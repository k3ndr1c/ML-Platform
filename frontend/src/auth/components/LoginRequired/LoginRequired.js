import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom'
export default function LoginRequired({ children }) {

  const accessToken = useSelector(state => state.authReducer.accessToken);

  return (
    (accessToken !== null) ? (
      children
    ) : <Redirect
          to="/login"
        />
  )
}