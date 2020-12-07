import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import Header from '../Header';

import { getUserJobs, createJob } from '../../actions';


function JobDetail({
  fileName, dateCreated, dateFinished, status, prediction
}) {

  return (
    <>
      <td>{fileName}</td>
      <td>{dateCreated}</td>
      <td>{dateFinished}</td>
      <td>{status}</td>
      <td>{prediction}</td>
    </>
  )
}

function JobTable() {

  const jobs = useSelector(state => state.jobReducer.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserJobs())
  }, []);


  return (
    <Row className="justify-content-center">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th></th>
            <th>File Name</th>
            <th>Date Created</th>
            <th>Date Finished</th>
            <th>Status</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((array, jobIndex) => {
            return (array.map(({file_name, created_at, finished_at, status, prediction }, index) => {
              return (index === 0 && array.length > 0) ? (
                <tr key={`${jobIndex}-${index}`}>
                  <td rowSpan={array.length}>{jobIndex}</td>
                  <JobDetail 
                    fileName={file_name}
                    dateCreated={created_at}
                    dateFinished={finished_at}
                    status={status}
                    prediction={prediction}
                  />
                </tr>
              ) : (
                    <tr key={`${jobIndex}-${index}`}>
                      <JobDetail 
                        fileName={file_name}
                        dateCreated={created_at}
                        dateFinished={finished_at}
                        status={status}
                        prediction={prediction}
                      />
                    </tr>
                  )
            }))}
          )}
        </tbody>
      </Table>
    </Row>
  )
}

function FileUploadComponent() {

  const [files, setFiles] = useState({})
  const [uploadMessage, setUploadMessage] = useState('');
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    return dispatch(createJob(files, setUploadMessage));
  }

  function renderAlert() {

    if (uploadMessage === 'UploadSuccess') {
      return (
        <Alert variant="success">
          Upload succeeded
        </Alert>
      )
    }
    else if (uploadMessage === 'UploadFail') {
      return (
        <Alert variant="danger">
          Upload failed
        </Alert>
      )
    }

    return null;
  }

  function handleChange(event) {
    setFiles(event.target.files)
  }

  return (
    <>
      <Row className="justify-content-center mb-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.File 
              id="formFile" 
              label="Upload file/files to predict"
              onChange={handleChange}
              multiple
              encType="multipart/form-data"
            />
          </Form.Group>
            <Button variant="primary" type="submit">
              Create job 
            </Button>
        </Form>
      </Row>
      <Row className="justify-content-center">
      {renderAlert()}
      </Row>
    </>
  )
}

function DashboardContainer() {


  return (
    <>
      <Header />
      <Row 
        style={{marginTop: '75px'}}
        className="justify-content-center mb-3"
      >
        <h2>Job Dashboard</h2>
      </Row>
      <FileUploadComponent />
      <JobTable />
    </>
  )
}

export default function Dashboard() {

  const accessToken = useSelector(state => state.authReducer.accessToken);

  if (accessToken == null)  {
    return <Redirect to={'/'} />;
  }

  return (
    <DashboardContainer />
  )
}


