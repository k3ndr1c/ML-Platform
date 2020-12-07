import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Header from '../Header';

import { updateUserPassword, getUserProfile } from '../../../auth/actions';


const schema = yup.object({
  password: yup.string().required('Password is required'),
  newPassword: yup.string().required('New Password is required'),
  confirmNewPassword: yup.string()
    .oneOf([yup.ref('newPassword'), ''], 'New Password must match')
    .required('Password is required')
});

function ChangePasswordForm() {
  const successMessage = useSelector(state => state.authReducer.successMessage);
  const error = useSelector(state => state.authReducer.error);
  const dispatch = useDispatch()
  const initialValues = {
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  }

  return (
    <>
      <Row className="justify-content-center mt-4 mb-3">
        <h4>Change Password</h4>
      </Row>
      <Row className="justify-content-center">
        <Formik
          validationSchema={schema}
          initialValues={initialValues}
          onSubmit={async (values, {setSubmitting, resetForm}) => {
              const inputData = {
                  'old_password': values.password,
                  'new_password': values.newPassword,
              }
              dispatch(updateUserPassword(inputData))
              resetForm(initialValues);
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
                <Form.Group as={Col} controlId="validationFormikPassword">
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
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}  controlId="validationFormikNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    isInvalid={errors.newPassword && touched.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormikConfirmNewPassword">
                <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmNewPassword"
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    isInvalid={
                      errors.confirmNewPassword && touched.confirmNewPassword
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmNewPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Button type="submit">Change Password</Button>
            </Form>
          )}
        </Formik>
      </Row>
      <Row className="justify-content-center mt-3">
        {(error) && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        {(successMessage) && (
          <Alert variant="success">
            {successMessage}
          </Alert>
        )}
      </Row>
    </>
  );
}


function Profile() {
  const user = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserProfile())
  }, []);

  return (
    <>
      <Row className="justify-content-center">
        <h5>First Name: {user.first_name}</h5>
      </Row>
      <Row className="justify-content-center">
        <h5>Middle Name: {user.middle_name}</h5>
      </Row>
      <Row className="justify-content-center">
        <h5>Last Name: {user.last_name}</h5>
      </Row>
      <Row className="justify-content-center">
        <h5>Email: {user.email}</h5>
      </Row>
      <Row className="justify-content-center">
        <h5>Phone Number: {user.phone_number}</h5>
      </Row>
      <Row className="justify-content-center">
        <h5>Mail Address: {user.mail_address}</h5>
      </Row>
      <Row className="justify-content-center">
        <h5>Occupation: {user.occupation}</h5>
      </Row>
    </>
  )
}

export default function ProfileContainer() {

  return (
    <>
      <Header />
      <Row 
        style={{marginTop: '75px'}}
        className="justify-content-center mb-3"
      >
        <h2>Profile</h2>
      </Row>
      <Profile />
      <ChangePasswordForm />
    </>
  );

}