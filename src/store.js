import { store } from 'react-easy-state';

const userState = store({
  inspirationData: null,
  objectData: null,
  objectiveData: null,
  visualizeData: null,
})

export { userState };