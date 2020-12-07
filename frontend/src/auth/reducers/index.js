import { 
  LOGIN_USER,
  REGISTER_USER, 
  LOGOUT_USER, 
  LOGIN_FAILED,
  REGISTER_FAILED,
  GET_USER_PROFILE,
  GET_USER_PROFILE_FAILED,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL
} from '../actions/types';


const initialState = {
  user: {},
  accessToken: localStorage.getItem('accessToken'),
  error: null,
  successMessage: null
};


export default function authReducer(state = initialState, action) {
  switch (action.type) {
    
    case LOGIN_USER:
      return { ...state, user: {}, accessToken: action.payload.accessToken, error: null }
    
    case REGISTER_USER:
      return { ...state, user: {'registerSuccess': 'true'}, error: null }
    
    case LOGOUT_USER:
      return { ...state, user: {}, accessToken: null, successMessage: null }
    
    case LOGIN_FAILED:
      return { ...state, error: 'LoginFailedError' }
    
    case REGISTER_FAILED:
      return { ...state, error: action.payload.error }
    
    case GET_USER_PROFILE:
      return { ...state, user: action.payload.user, accessToken: action.payload.accessToken, successMessage: null }
    
    case GET_USER_PROFILE_FAILED:
      return { ...state, user: {}, accessToken: null }

    case CHANGE_PASSWORD:
      return { ...state, error: null, successMessage: 'You changed you password!' }
    
    case CHANGE_PASSWORD_FAIL:
      return { ...state, error: action.payload.error }
    
    default:
      return state;
  }
}