import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import { Link, Redirect } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

import { registerUser } from '../../actions';


const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().required('Middle name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  mailAddress: yup.string().required('Mail Address is required'),
  occupation: yup.string().required('Occupation is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Password is required')
});

function RegisterForm() {
  const dispatch = useDispatch()

  return (
    <>
      <Row className="justify-content-center mt-3 mb-3">
        <h2>Sign Up</h2>
      </Row>
      <Row className="justify-content-center">
        <Formik
          validationSchema={schema}
          onSubmit={async (values) => 
            {
              const inputData = {
                  'first_name': values.firstName,
                  'middle_name': values.middleName,
                  'last_name': values.lastName,
                  'phone_number': values.phoneNumber,
                  'mail_address': values.mailAddress,
                  'occupation': values.occupation,
                  'email': values.email,
                  'username': values.username,
                  'password': values.password
              }
              dispatch(registerUser(inputData))}
            }
          initialValues={{
            firstName: '',
            middleName:'',
            lastName: '',
            phoneNumber: '',
            mailAddress: '',
            occupation: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="validationFormikFirstName">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    isInvalid={errors.firstName && touched.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormikMiddleName">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="middleName"
                    value={values.middleName}
                    onChange={handleChange}
                    isInvalid={errors.middleName && touched.middleName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.middleName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormikLastName">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    isInvalid={errors.lastName && touched.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
              <Form.Group as={Col} controlId="validationFormikPhoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    isInvalid={errors.phoneNumber && touched.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormikMailAddress">
                  <Form.Label>Mail Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="mailAddress"
                    value={values.mailAddress}
                    onChange={handleChange}
                    isInvalid={errors.mailAddress && touched.mailAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mailAddress}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormikOccupation">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    name="occupation"
                    value={values.occupation}
                    onChange={handleChange}
                    isInvalid={errors.occupation && touched.occupation}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.occupation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}  controlId="validationFormikEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={errors.email && touched.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                <Form.Group as={Col} controlId="validationFormikUsername">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      aria-describedby="inputGroupPrepend"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      isInvalid={errors.username && touched.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}  controlId="validationFormikPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={errors.password && touched.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                <Form.Group as={Col} controlId="validationFormikConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    isInvalid={
                      errors.confirmPassword && touched.confirmPassword
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Button type="submit">Sign Up</Button>
            </Form>
          )}
        </Formik>
      </Row>
      <Row className="justify-content-center mt-3">
        <div>Already have an account? <Link to="/login">Login</Link></div> 
      </Row>
    </>
  );
}

function SuccessPanel() {

  return (
    <>
      <Row className="justify-content-center mt-3 mb-3">
        <h2>Welcome!</h2>
      </Row>
        <Row className="justify-content-center mt-3">
          <div>You have successfully made an account. Come and <Link to="/login">Login</Link>.</div> 
        </Row>
    </>
  )
}

function ErrorPanel({ error }) {

  const notUniqueEmailError = 'Sorry that email is already associated with another account. Please try another email.';
  const notUniqueUsernameError = 'Sorry that username is already associated with another account. Please try another username.';
  const errorMessage = (error === 'DuplicateEmailError') ? notUniqueEmailError : notUniqueUsernameError;

  return (
    <>
      <Row className="justify-content-center mt-3 mb-3">
        <h2>Oh no!</h2>
      </Row>
        <Row className="justify-content-center mt-3">
          <div> {errorMessage} <a href="/register">Register</a></div> 
        </Row>
    </>
  )
}


export default function RegisterContainer() {

  const user = useSelector(state => state.authReducer.user);
  const accessToken = useSelector(state => state.authReducer.accessToken);
  const error = useSelector(state => state.authReducer.error);

  if (accessToken !== null)  {
    return <Redirect to={'/'} />;
  }
  else if (Object.keys(user).length === 0) {

    if (error === 'DuplicateEmailError' || error === 'DuplicateUsernameError') {
      return <ErrorPanel error={error} />
    }
    return (
      <RegisterForm />
    )
  }

  return <SuccessPanel />
}
