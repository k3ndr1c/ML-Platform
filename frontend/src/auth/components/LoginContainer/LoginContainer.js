import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import { Link, Redirect } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

import { loginUser } from '../../actions';


const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

function LoginForm() {
  const dispatch = useDispatch()

  return (
    <>
      <Row className="justify-content-center mt-3 mb-3">
        <h2>Login</h2>
      </Row>
      <Row className="justify-content-center">
        <Formik
          validationSchema={schema}
          onSubmit={(values) => {
            dispatch(loginUser(values))
          }}
          initialValues={{
            username: '',
            password: '',
          }}
        >
        {({
          handleSubmit,
          handleChange
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  name="username"
                  onChange={handleChange}  
                  aria-describedby="inputGroupPrepend"
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                onChange={handleChange}  
                required
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit"
            >
              Log in
            </Button>
          </Form>
          )}
        </Formik>
      </Row>
      <Row className="justify-content-center mt-3">
        <div>Don't have an account yet? <Link to="/register">Register</Link></div> 
      </Row>
    </>
  )
}

function LoginErrorAlert() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Row className="justify-content-center mt-3">
        <Alert variant="danger" onClose={() => setShow(false)}>
          <Alert.Heading>Login Error!</Alert.Heading>
          <p>
            Account information is not correct. 
          </p>
        </Alert>
      </Row>
    );
  }

  return null;
}

export default function LoginContainer() {
  const accessToken = useSelector(state => state.authReducer.accessToken);
  const error = useSelector(state => state.authReducer.error);

  if (accessToken !== null)  {
    return <Redirect to={'/profile'} />;
  }

  if (error === 'LoginFailedError') {
    return (
      <>
        <LoginForm />
        <LoginErrorAlert />
      </>
    )
  }

  return <LoginForm />;
}