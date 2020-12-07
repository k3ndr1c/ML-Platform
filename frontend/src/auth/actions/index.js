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
} from './types';



export const loginUser = (credentials) => async (dispatch) => {
  const request = {
    method: "post",
    body: JSON.stringify(credentials),
    headers: {
      "content-type": "application/json",
    },
  }
  const response = await fetch('http://localhost:8000/api/auth/login/', request);
  if (!response.ok) {
    return dispatch({ type: LOGIN_FAILED })
  }
  else {
    const data = await response.json();
    const { access } = data;
    localStorage.setItem("accessToken", access)

    const payload = { accessToken: access }
  
    dispatch({ type: LOGIN_USER, payload })
  
    const TWO_MINUTES = 120000;
    setTimeout(async () => {
      localStorage.removeItem("accessToken")
      dispatch({ type: LOGOUT_USER })
    }, TWO_MINUTES)
  }
}

export const registerUser = userData => async (dispatch) => {
  const request = {
    method: "post",
    body: JSON.stringify(userData),
    headers: {
      "content-type": "application/json",
    },
  }
  const response = await fetch('http://localhost:8000/api/auth/register-user/', request);
  if (!response.ok) {
    response.json().then(
      (error) => {
        const payload = { error }
        dispatch({ type: REGISTER_FAILED, payload })
      }
    )
  }
  else {
    dispatch({ type: REGISTER_USER });
  }
}

export function logoutUser() {
  localStorage.removeItem("accessToken")
  return { type: LOGOUT_USER }
}

export const getUserProfile = () => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken')
  const request = {
    method: "get",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  }

  const response = await fetch('http://localhost:8000/api/auth/user/', request);
  if (!response.ok) {
    localStorage.removeItem("accessToken")
    return dispatch({ type: GET_USER_PROFILE_FAILED })
  }
  else {
    const {
      username,
      email,
      first_name,
      middle_name,
      last_name,
      phone_number,
      mail_address,
      occupation
    } = await response.json();
  
    const user = {
      username,
      email,
      first_name,
      middle_name,
      last_name,
      phone_number,
      mail_address,
      occupation
    }
    const payload = { user: user, accessToken: accessToken }
    dispatch({ type: GET_USER_PROFILE, payload })
  }
}

export const updateUserPassword = data => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken')

  const request = {
    method: "put",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  }
  const response = await fetch('http://localhost:8000/api/auth/user/change-password', request);
  if (!response.ok) {
    if (response.status === 403) {
      localStorage.removeItem("accessToken")
      return { type: LOGOUT_USER }
    }
    response.json().then(
      (error) => {
        const { old_password } = error;
        const payload = { error: old_password[0] }
        dispatch({ type: CHANGE_PASSWORD_FAIL, payload })
      }
    )
  }
  else {
    dispatch({ type: CHANGE_PASSWORD });
  }
}