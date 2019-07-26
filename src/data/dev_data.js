const appSettingsData = {
  "RESET_CLICKS": 3, //number of clicks to trigger an app reset
}

const homeData = {
  "SELECTION_INTERVAL": 10000, //ms between highlighting each new vision
  "NUM_VISIONS": 15, //number of visions to show onscreen
}

const visionData = {
  "DIVISIONS": 6, //number of visions in each group //MH TODO: (ideally find a better way to do this, as the next "level" will contain more items than the previous, but not sure by what amount)
  "GROUP_ROTATIONS": [60,45,45,22.5,22.5,22.5], //the array of rotations of visions per group in degrees
  "GROUP_TRANSLATIONS": [150,250,250,325,325,325], //the array of translations of items in pixels per group
  "GROUP_TRANSLATIONS_VARIANCE": 10, //max number of pixels a vision can stray from its center (+ or -)
  "SCALE_BASE": 0.5, //the largest scale each unselected item can be as a %
  "SCALE_BASE_VARIANCE": 0.2, //how much the scale of each item varies as a % (+ or -)
  "VISION_QUALITY": 70, //percent, for generating image from contentful
  "VISION_WIDTH": 400, //px, for generating image from contentful
}

const inspirationSettingsData = {
  "DIVISIONS": 9, //number of inspirations in each group //MH TODO: (ideally find a better way to do this, as the next "level" will contain more items than the previous, but not sure by what amount)
  "GROUP_ROTATIONS": [40], //the array of rotations of inspirations per group in degrees
  "GROUP_TRANSLATIONS": [350], //the array of translations of items in pixels per group
  "GROUP_TRANSLATIONS_VARIANCE": 0, //max number of pixels a vision can stray from its center (+ or -)
  "SCALE_BASE": 0.5, //the largest scale each unselected item can be as a %
  "SCALE_BASE_VARIANCE": 0.0, //how much the scale of each item varies as a % (+ or -)
  "IMAGE_QUALITY": 70, //percent, for generating image from contentful
  "IMAGE_WIDTH": 400, //px, for generating image from contentful
}

const redesignSettingsData = {
  "SAMPLE_SIZE": 10, //how many random objectives to select for menu
  "IMAGE_QUALITY": 70, //percent, for generating image from contentful
  "OBJECT_WIDTH": 250, //px, for generating image from contentful
  "INSPIRATION_WIDTH": 300, //px of inspiration, for generating image from contentful
}

const visualizeSettingsData = {
  "SAMPLE_SIZE": 10, //how many images per category
  "CATEGORIES": ["background","foreground","people", "objects","effects"], //names of categories to display in tab order
  "CANVAS_SIZE": 640, //width & height of canvas in pixels
  "INTERACTABLE_SHADOW_COLOR": "#fe5000", //value for shadow color as hex or color name
  "SCALE_INCREMENT": 0.1, //decimal percentage by which to scale an element each click
  "SCALE_MAX": 2.0, //the largest we can scale an image
  "SCALE_MIN": 0.5, //the smallest we can scale an image
  "ROTATION_INCREMENT": 10, //the amount by which we change the rotation each click
  "SUCCESS_TIME": 1000, //time in ms to pause before moving to the success / confirmation screen
  "CONTROLS": [
    {
      "name": "front",
      "icon": "sort-up.svg",
      "initalState": "inactive",
    },
    {
      "name": "back",
      "icon": "sort-down.svg",
      "initalState": "inactive",
    },
    {
      "name": "scale",
      "icon": "compress.svg",
      "iconActive": "expand.svg",
    },
    {
      "name": "rotate",
      "icon": "rotate.svg",
    },
    {
      "name": "blur",
      "icon": "eye.svg",
    },
    {
      "name": "remove",
      "icon": "trash.svg",
    },
    {
      "name": "help",
      "icon": "question.svg",
    },
  ], //controls enabled for user for canvas
}

const visualizeInstructionsData = {
  "controls": {
    "front": "Move selected item one layer up",
    "back": "Move selected item one layer down",
    "scale": "Scale selected item",
    "rotate": "Rotate selected item",
    "blur": "Blur selected item",
    "remove": "Delete selected item",
  },
  "canvas": [
    "Tap an item to select or deselect it.",
    "Use two fingers to rotate the selected item.",
    "Use pinch and expand gestures to scale your item.",
    "FG & BG Elements cannot be selected, only replaced.",
  ],
  "items": [
    "Choose images from the tabs here to place them on the canvas above.",
    "When you are finished, click the sign and send button to submit."
  ],
  "processingMessage": "Your future is processing. Please wait.",
  "signaturePlaceholder": "Type your name here",
}

const confirmationSettingsData = {
  "CONFIRMATION_TIMEOUT": 5000, //ms to wait before rebooting to app home screen
}

export {
  appSettingsData,
  homeData,
  visionData,
  inspirationSettingsData,
  redesignSettingsData,
  visualizeSettingsData,
  visualizeInstructionsData,
  confirmationSettingsData,
};