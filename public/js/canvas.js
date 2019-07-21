let canvasModule = {};

canvasModule.main = function () {
  var self = this;

  //config
  var configObj = {
    stageWidth: 640,
    stageHeight: 640,
    borderColor: "#fe5000", //border refers to the active item shadow highlight
    borderOffsetX: 5,
    borderOffsetY: 5,
    borderBlur: 0,
    minScale: 0.5,
    maxScale: 1.5,
    scaleStep: 0.1,
    blurLimit: 10,
  };

  //canvas vars
  var deactivateFunction; //function to call when mouse rolls out of screen
  var stage = null; //will hold all canvas references
  var stageUpdate = false; //tells stage when to update
  var gridImg, gridBitmap = null; //perspective plane
  var gridBounds; //holds Y pos of grid
  var envForeground = null; //ref to the foreground bitmap
  var envBackground = null; //ref to the background bitmap
  var editItem; //reference to the bitmap being manipulated
  var editMode; //scale, move, etc
  var blurFilter = null;
  var rotateInterval; //holds the timer to do repeat rotate calls on hold
  var scaleInterval; //holds timer to do repeat scale calls on hold
  var scaleMore = false; //make image larger when true, smaller when false
  var blurInterval; //holds the timer to do repeat blur calls on hold
  var blurMore = true; //make more blurry when true, less blurry when false
  var blurHold = false; //true when user first holds mouse down, false when they release
  var ww, wh; //window width, height to determine rollout perimeter on desktop when mouse is down
  var addingID; //will hold the ID of the image being added to the screen until it can be assigned to a canvas image, at which point it will be removed
  var lastID; //will be used to help detect repeat additions of images
  var initialOrganism = null; //will hold the data of the user's selection from the previous screen

  //refs
  var $activeButton; //keeps track of button clicked when inactive in order to deactivate it
  var $canvasControls;

  //control vars
  var disabledTimer; //holds the timer to hide the tooltip for disabled buttons

  //unused?
  var imageryPath = 'assets/images/temp/';

  //submission
  var saveID; //will store ID of scenario we are saving the image for
  var savedImage; //will store the path to the image on the server that we create from canvas
  var collageImg; //will hold the image created from the collage for use in both submitting to the smart museum and to the database

  //hammer
  var isTouch; //will determine how to handle button press / hold
  var touchInstance; //holds hammer.js touch events
  var pinch, rotate; //hammer pinch and rotate instances


  self.init = function (initialOrganismData) {
    initialOrganism = initialOrganismData;
    addRefs();
    initStage();
  }

  var addRefs = function () {
    $canvasControls = $('.visualize__canvas_controls');
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
    $('.front').on('click', onFrontClick); //send item in front of all others
    $('.back').on('click', onBackClick); //send item behind all others
    $('.remove').on('click', onRemoveClick); //delete item
    $('.rotate').on('click', updateRotate);
    $('.scale').on('click', updateScale);
    $('.blur').on('click', changeBlur);

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
    if (initialOrganism) {
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

    itemContainer.addChild(itemBitmap);
    stage.addChild(itemContainer);
    if (isRepeat) { //if we've just added the same image to the screen, stagger this one's position so we can see both it and the previous
      self.setRandomPosition(itemContainer);
    } else {
      self.centerElement(itemContainer); //put the item in the center of the canvas
    }

    addItemListeners(itemContainer);
    stageUpdate = true;
    itemContainer.dispatchEvent('click'); //make the item highlighted as if it were clicked on stage so it can be manipulated

  }

  var addItemListeners = function (item) {
    item.on("mousedown", onItemDown); //figure out our mouse coordinates before triggering either a click or drag
    item.on('click', toggleItemManipulation); //make an item manipulatable
    item.on("pressmove", onDragItem); //drag an item
    item.on('pressup', onDragUp); //stop dragging
  }

  var onItemDown = function (e) {
    this.offset = { x: this.x - e.stageX, y: this.y - e.stageY };
  }

  var toggleItemManipulation = function (e) { //make the item editable

    checkIfTopItem(this); //if it is not the top item, make the button clickable that will allow us to send it to the top

    if (editItem && editItem.id != this.id) { //we are switching to a new item
      editItem.editable = false;
      removeHighlight(editItem);
      editItem = this;
    }

    if (this.editable) { //item is editable if it has been selected
      if (!this.dragging) { //if we are not dragging the item, deselect it
        this.editable = false;
        removeHighlight(this);
        editItem = null;
      }
    } else { //make it editable
      editItem = this;
      this.editable = true;
      addHighlight(this);
    }
  }

  var onDragItem = function (e) {
    if (this.editable) {
      this.dragging = true;
      this.x = e.stageX + this.offset.x;
      this.y = e.stageY + this.offset.y;
      stageUpdate = true;
    }
  }

  var onDragUp = function () {
    this.dragging = false;
  }

  var checkIfTopItem = function (thisItem) { //see if the item is at the top of the stack
    var numItems = stage.numChildren;
    var itemIndex = stage.getChildIndex(thisItem);

    var indexLimit = 1;
    if (envForeground != null) {
      indexLimit++;
    }

    if (envBackground != null) {
      indexLimit++;
    }

    var isTop = false;

    if (itemIndex == numItems - 1) {
      isTop = true;
    }

    if (isTop) {
      $('.front').addClass('inactive');
      if (numItems > indexLimit + 1) { //as long as we can send the item back still, enable the back button (grid always at 1, hence the plus 1)
        $('.back').removeClass('inactive');
      }
    } else {
      if (itemIndex == indexLimit) { //can't go any further back, disable the bottom
        $('.back').addClass('inactive');
      } else {
        $('.back').removeClass('inactive');
      }
      $('.front').removeClass('inactive');
    }

  }

  var addHighlight = function (item) {
    showCanvasControls(); //activate the buttons since we have an active item
    item.shadow = new createjs.Shadow(configObj.borderColor, configObj.borderOffsetX, configObj.borderOffsetY, configObj.borderBlur); //add a highlight to the selected item
    stageUpdate = true;
    enableCanvasTouch(); //enable touch events for the highlighted item
  }

  var removeHighlight = function (item) {

    hideCanvasControls();
    if (item) {
      item.shadow = null;
    }

    stageUpdate = true;
    disableCanvasTouch(); //remove touch functionality for the item
  }

  var showCanvasControls = function () {
    $canvasControls.addClass('active');
  }

  var hideCanvasControls = function () {
    $canvasControls.removeClass('active');
  }

  var onFrontClick = function () { //send item to the front of all other items
    var $thisButton = $(this);
    var $thisContainer = $thisButton.closest('.canvas-controls');
    var isActive = $thisContainer.hasClass('active');

    if (isActive) {
      bringToFront(editItem);
    }

  }

  var onBackClick = function () {
    var $thisButton = $(this);
    var $thisContainer = $thisButton.closest('.canvas-controls');
    var isActive = $thisContainer.hasClass('active');

    if (isActive) {
      var buttonInactive = $thisButton.hasClass('inactive');
      if (!buttonInactive) {
        sendToBack(editItem);
      }
    }
  }

  var bringToFront = function (obj) {
    stage.setChildIndex(obj, stage.getNumChildren() - 1);
    $('.front').addClass('inactive');
    $('.back').removeClass('inactive');
  }

  var sendToBack = function (obj) {
    var curIndex = stage.getChildIndex(obj);
    var indexLimit = 1; //index we must stay above

    if (envForeground != null) { //gotta stay in front of the foreground
      indexLimit++;
    }

    if (envBackground != null) { //gotta stay in front of the background
      indexLimit++;
    }

    if (curIndex > indexLimit) { //MH - doesn't account for background, foreground (grid at 1)
      var nextClosestObject = stage.getChildAt(curIndex - 1);
      stage.setChildIndex(nextClosestObject, curIndex);
      stage.setChildIndex(obj, curIndex - 1);
      if (curIndex == indexLimit + 1) { //cant go any further back than this otherwise we'd be behind the grid / environment images
        $('.back').addClass('inactive');
      }
    }

    if (curIndex < stage.numChildren) {
      $('.front').removeClass('inactive');
    }
  }

  var onRemoveClick = function () {
    var $thisButton = $(this);
    var $thisContainer = $thisButton.closest('.canvas-controls');
    var isActive = $thisContainer.hasClass('active');
    if (isActive) {
      var itemToRemove = editItem;
      //need to remove this item from the goal tag array if not an organism
      removeHighlight(editItem);
      editItem = null;
      if (itemToRemove) {
        itemToRemove.removeAllEventListeners();
      }
      stage.removeChild(itemToRemove); //need to first remove item and image from array (or delete arrays if they're not being used)
    }
  }

  var updateRotate = function () {
    if (editItem != null && editItem.editable) {
      //var editItemImg = editItem.children[0];
      if (editItem.rotation < 360) {
        editItem.rotation++;
      } else {
        editItem.rotation = 0;
      }
      stageUpdate = true;
    }
  }

  var updateScale = function () {
    var scaleVal;
    if (editItem != null && editItem.editable) {
      if (scaleMore) {
        if (editItem.scaleX < configObj.maxScale) {
          scaleVal = editItem.scaleX + configObj.scaleStep;
        } else {
          scaleVal = configObj.maxScale;
          scaleMore = false;
          $('.scale').removeClass('up');
        }
      } else {
        if (editItem.scaleX > configObj.minScale) {
          scaleVal = editItem.scaleX - configObj.scaleStep;
        } else {
          scaleVal = configObj.minScale;
          scaleMore = true;
          $('.scale').addClass('up');
        }
      }

      editItem.scaleX = editItem.scaleY = scaleVal;
      stageUpdate = true;
    }
  }

  var changeBlur = function () {
    if (editItem != null && editItem.editable) {
      var blurVal = getBlur();
      if (blurMore) {
        if (blurVal < configObj.blurLimit) {
          blurVal++;
        } else { //we're at max bluriness, make successive calls blur less
          $('.blur').removeClass('blurry');
          blurMore = false;
        }
      } else {
        if (blurVal > 0) {
          blurVal--;
        } else { //we are unblurred, make successive calls blur more
          $('.blur').addClass('blurry');
          blurMore = true;
        }

      }
      updateBlur(blurVal);
    }
  }

  var getBlur = function () {

    var editItemImg = editItem.children[0];
    if (editItemImg.filters == null) {
      editItemImg.filters = [blurFilter];
    }
    return editItemImg.filters[0].blurX;
  }

  var updateBlur = function (thisVal) {
    var editItemImg = editItem.children[0];

    if (editItemImg.filters == null) {
      editItemImg.filters = [blurFilter];
    }

    editItemImg.filters[0].blurX = editItemImg.filters[0].blurY = thisVal;

    stageUpdate = true;
    editItemImg.updateCache();
  }

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