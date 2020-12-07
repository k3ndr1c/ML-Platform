import { 
  GET_USER_JOBS, 
  CREATE_JOB,
  CREATE_JOB_FAILED
} from '../actions/types';


const initialState = {
  jobs: [],
  uploadMessage: ''
};


export default function jobReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_JOBS:
      return { ...state, jobs: action.payload.jobs }
    
    case CREATE_JOB:
      return { ...state, uploadMessage: action.payload.uploadMessage }

    case CREATE_JOB_FAILED:
      return { ...state, uploadMessage: action.payload.uploadMessage }
    
    default:
      return state;
  }
}