import { store } from 'react-easy-state';

const userState = store({ //will fill with user selections
  inspirationData: null,
  objectData: null,
  objectiveData: null,
  visualizeData: null,
});

const dataStore = store({ //will fill with data from contentful
  siteData: null,
  visionsData: null,
});

export { userState, dataStore };