import { store, view } from 'react-easy-state';

const userState = store({
  inspirationData: null,
  objectData: null,
  objectiveData: null,
})

export { userState };