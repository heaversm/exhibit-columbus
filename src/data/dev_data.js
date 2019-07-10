const homeData = {
  "SELECTION_INTERVAL": 10000, //ms between highlighting each new vision
}

const visionData = {
  "DIVISIONS": 6, //number of visions in each group //MH TODO: (ideally find a better way to do this, as the next "level" will contain more items than the previous, but not sure by what amount)
  "GROUP_ROTATIONS": [60,45,45,22.5,22.5,22.5], //the array of rotations of visions per group in degrees
  "GROUP_TRANSLATIONS": [150,250,250,325,325,325], //the array of translations of items in pixels per group
  "GROUP_TRANSLATIONS_VARIANCE": 10, //max number of pixels a vision can stray from its center (+ or -)
  "SCALE_BASE": 0.5, //the largest scale each unselected item can be as a %
  "SCALE_BASE_VARIANCE": 0.2, //how much the scale of each item varies as a % (+ or -)
}

const inspirationSettingsData = {
  "DIVISIONS": 9, //number of inspirations in each group //MH TODO: (ideally find a better way to do this, as the next "level" will contain more items than the previous, but not sure by what amount)
  "GROUP_ROTATIONS": [40], //the array of rotations of inspirations per group in degrees
  "GROUP_TRANSLATIONS": [350], //the array of translations of items in pixels per group
  "GROUP_TRANSLATIONS_VARIANCE": 0, //max number of pixels a vision can stray from its center (+ or -)
  "SCALE_BASE": 0.5, //the largest scale each unselected item can be as a %
  "SCALE_BASE_VARIANCE": 0.0, //how much the scale of each item varies as a % (+ or -)
}

const redesignSettingsData = {
  "SAMPLE_SIZE": 10, //how many random objectives to select for menu
}

export {
  homeData,
  visionData,
  inspirationSettingsData,
  redesignSettingsData
};