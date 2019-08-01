import { store } from 'react-easy-state';

const userState = store({ //will fill with user selections
  inspirationData: null,
  objectData: null,
  objectiveData: null,
  visualizeData: null,
  screenWidth: null,
  screenHeight: null,
  isPro: false, //true when screen dimensions larger than SW__IPAD_PRO from App Settings Data
});

const dataStore = store({ //will fill with data from contentful
  inspirationsData: null,
  objectivesData: null,
  objectsData: null,
  siteData: null,
  visionsData: null,
  visualizeData: null,
});

export { userState, dataStore };