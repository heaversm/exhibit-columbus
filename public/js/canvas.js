let canvasModule = {};
let canvasInstance;

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

  self.init = function () {
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

    // $('.front').on('click', onFrontClick); //send item in front of all others
    // $('.back').on('click', onBackClick); //send item behind all others
    // $('.remove').on('click', onRemoveClick); //delete item
    // $('.help').on('click', onHelpClick); //display instructions for this page
    // $('.rotate').on('click', updateRotate);
    // $('.scale').on('click', updateScale);
    // $('.blur').on('click', changeBlur);

    // $('.image-button').on('click', onImageButtonClick);
    //$('.btn-save').on('click', onSaveClick); //user has saved their imagery
    initCanvasTouch();
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

window.onload = function () {
  canvasInstance = new canvasModule.main();
}