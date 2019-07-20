let canvasModule = {};

canvasModule.main = function () {
  var self = this;

  
  var configObj = {
    stageWidth: 640,
    stageHeight: 640,
  }; //will hold the config vars loaded from database
  
  var stage = null; //will hold all canvas references
  var stageUpdate = false; //tells stage when to update
  var gridImg, gridBitmap = null; //perspective plane
  var gridBounds; //holds Y pos of grid
  
  var imageryPath = 'assets/images/temp/';
  
  var envForeground = null; //ref to the foreground bitmap
  var envBackground = null; //ref to the background bitmap
  
  var isTouch; //will determine how to handle button press / hold
  
  var editItem; //reference to the bitmap being manipulated
  var editMode; //scale, move, etc
  var blurFilter = null;
  
  var rotateInterval; //holds the timer to do repeat rotate calls on hold
  
  var scaleInterval; //holds timer to do repeat scale calls on hold
  
  var scaleMore = false; //make image larger when true, smaller when false
  var blurInterval; //holds the timer to do repeat blur calls on hold
  
  var blurMore = true; //make more blurry when true, less blurry when false
  var blurHold = false; //true when user first holds mouse down, false when they release
  
  var saveID; //will store ID of scenario we are saving the image for
  var savedImage; //will store the path to the image on the server that we create from canvas
  var collageImg; //will hold the image created from the collage for use in both submitting to the smart museum and to the database
  
  var addingID; //will hold the ID of the image being added to the screen until it can be assigned to a canvas image, at which point it will be removed
  var lastID; //will be used to help detect repeat additions of images
  
  var initialOrganism = null; //will hold the data of the user's selection from the previous screen
  
  self.init = function (initialOrganismData) {
    initialOrganism = initialOrganismData;
    initStage();
  }

  var loadGrid = function () { //add the grid that shows above the foreground to create perspective
    gridImg = new Image();
    gridImg.src = "assets/images/perspective-grid.png";

    $(gridImg).load(function () {
      drawGrid();
    });
  }

  var drawGrid = function () {
    gridBitmap = new createjs.Bitmap(gridImg);
    stage.addChild(gridBitmap);
    gridBounds = gridBitmap.getBounds();
    gridBounds.y = configObj.stageHeight - gridBounds.height;
    gridBitmap.x = 0;
    gridBitmap.y = gridBounds.y;
    stage.update(); //update the canvas with the changes
    addTick(); //run a timer which updates the stage continuously
    addFilters(); //effects like blur
    addControlsListeners(); //the buttons which manipulate images on the canvas
    addInitialOrganism(); //add the organism image selected in the previous step (create)
  }

  var addControlsListeners = function () {
    isTouch = true;

    $('.image-button').on('click', onImageButtonClick);

    // $('.front').on('click', onFrontClick); //send item in front of all others
    // $('.back').on('click', onBackClick); //send item behind all others
    // $('.remove').on('click', onRemoveClick); //delete item
    // $('.help').on('click', onHelpClick); //display instructions for this page
    // $('.rotate').on('click', updateRotate);
    // $('.scale').on('click', updateScale);
    // $('.blur').on('click', changeBlur);

    //$('.btn-save').on('click', onSaveClick); //user has saved their imagery
    initCanvasTouch();
  }

  var onImageButtonClick = function () {
    var $thisItem = $(this);
    var thisType = $thisItem.attr('data-type');

    addingID = $thisItem.attr('data-id');

    switch (thisType) {
      case 'background':
      case 'foreground':
        onEnvironmentClick($thisItem, thisType);
        break;
      default:
        onItemClick($thisItem);
        break;
    }
  }

  var addInitialOrganism = function () { //add the organism image selected in the previous step (create)
    if (initialOrganism){
      loadItem(initialOrganism.image);
    }
  }

  var onEnvironmentClick = function ($thisItem, thisType) {
    //MH TODO: Handle foreground and background removal through control buttons
    var thisImageURL = $thisItem.attr('src');
    var thisType = $thisItem.attr('data-type');
    loadEnvironment(thisImageURL, thisType);
  }

  var loadEnvironment = function (src, type) { //backgrounds and foregrounds loaded with this functionality as they need to be sized and manipulated differently
    var envImg = new Image();
    envImg.src = src;

    $(envImg).load(function () {
      drawEnvironment(envImg, type);
    });
  }

  var drawEnvironment = function (envImg, type) {
    var envBitmap = new createjs.Bitmap(envImg);
    switch (type) {
      case 'foreground':
        envBitmap.y = gridBounds.y;
        if (envForeground != null) {
          stage.removeChild(envForeground);
        }
        envForeground = envBitmap;
        stage.addChild(envBitmap);
        stage.setChildIndex(envBitmap, 0); //foreground should be behind all other elements
        break;
      case 'background':
        envBitmap.y = 0;
        if (envBackground != null) {
          stage.removeChild(envBackground);
        }
        envBackground = envBitmap;
        stage.addChild(envBitmap);
        stage.setChildIndex(envBitmap, 1); //background should be behind all other elements
        break;
    }
    stageUpdate = true;
  }

  var onItemClick = function ($thisItem) {
    var thisImageURL = $thisItem.attr('src');
    loadItem(thisImageURL);
  }

  var loadItem = function (src) { //anything that is not a bg or foreground element is loaded with this functionality
    var itemImg = new Image();
    itemImg.src = src;

    $(itemImg).load(function () {
      drawItem(itemImg);
    });
  }

  var drawItem = function (itemImg) {
    var itemBitmap = new createjs.Bitmap(itemImg);
    itemBitmap.cache(0, 0, itemImg.width, itemImg.height);
    var isRepeat = false; //repeat addition of an item just added to screen
    var itemContainer = new createjs.Container();

    if (addingID) {
      if (lastID == addingID) {
        isRepeat = true;
      }
      itemContainer.imgID = addingID;
      lastID = addingID;
      addingID = null;
    }

    console.log(addingID, lastID);

    itemContainer.addChild(itemBitmap);
    stage.addChild(itemContainer);
    if (isRepeat) { //if we've just added the same image to the screen, stagger this one's position so we can see both it and the previous
      self.setRandomPosition(itemContainer);
    } else {
      self.centerElement(itemContainer); //put the item in the center of the canvas
    }

    //addItemListeners(itemContainer);
    stageUpdate = true;

    itemContainer.dispatchEvent('click'); //make the item highlighted as if it were clicked on stage so it can be manipulated

  }

  // var addItemListeners = function (item) {
  //   item.on("mousedown", onItemDown); //figure out our mouse coordinates before triggering either a click or drag
  //   item.on('click', toggleItemManipulation); //make an item manipulatable
  //   item.on("pressmove", onDragItem); //drag an item
  //   item.on('pressup', onDragUp); //stop dragging
  // }

  self.setRandomPosition = function (el) { //occurs when we have just added the same item to the stage so they don't cover each other
    var elBounds = el.children[0].bitmapCache;
    el.regX = elBounds.width >> 1;
    el.regY = elBounds.height >> 1;
    el.x = self.randomNumber(elBounds.width / 2, configObj.stageWidth - elBounds.width / 2);
    el.y = self.randomNumber(elBounds.height / 2, configObj.stageHeight - elBounds.height / 2);
  }

  self.centerElement = function (el) {
    var elBounds = el.children[0].bitmapCache; //MH - https://github.com/CreateJS/EaselJS/issues/915 - 
    el.regX = elBounds.width >> 1;
    el.regY = elBounds.height >> 1;
    el.x = configObj.stageWidth >> 1;
    el.y = configObj.stageHeight >> 1;
  }

  self.randomNumber = function (min, max) { //create random integer
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var initCanvasTouch = function () { //add the listeners that allow a user to use touch gestures to rotate and scale their imagery
    var touchEl = document.getElementById('collageCanvas');
    touchInstance = new Hammer.Manager(touchEl);
    pinch = new Hammer.Pinch();
    rotate = new Hammer.Rotate();
    pinch.recognizeWith(rotate);
    touchInstance.add([pinch, rotate]);
    touchInstance.on("pinch rotate", onCanvasTouch); //add the ability to recognize pinch and rotate...
    disableCanvasTouch(); //...but disable it for now
  }

  var onCanvasTouch = function (e) {
    var rotationVal = e.rotation;
    var scaleVal = e.scale;
    editItem.rotation = rotationVal;
    editItem.scaleX = editItem.scaleY = scaleVal;
    stageUpdate = true;
  }

  var enableCanvasTouch = function () {
    touchInstance.get('rotate').set({ enable: true });
    touchInstance.get('pinch').set({ enable: true });
  }
  var disableCanvasTouch = function () {
    touchInstance.get('rotate').set({ enable: false });
    touchInstance.get('pinch').set({ enable: false });
  }

  var addFilters = function () {
    blurFilter = new createjs.BlurFilter(0, 0, 2); //x,y,quality (1,2,3,etc);
  }

  var addTick = function () {
    createjs.Ticker.addEventListener("tick", onTick);
  }

  var onTick = function (event) { //check whether we need to update the stage or not
    if (stageUpdate) { //there has been a change on our canvas, update it
      !stageUpdate; // only update once
      stage.update(event);
    }
  }

  const initStage = function () {
    stage = new createjs.Stage("collageCanvas");
    configObj.midX = configObj.stageWidth / 2;
    configObj.midY = configObj.stageHeight / 2;
    ww = $(window).width();
    wh = $(window).height();
    if (createjs.Touch.isSupported()) { //add touch events if we are on a touch device
      createjs.Touch.enable(stage);
    }
    loadGrid();

  }

}

// window.onload = function () {
//   window.canvasInstance = new canvasModule.main();
//   window.canvasInstance.init();
// }
window.canvasInstance = new canvasModule.main();