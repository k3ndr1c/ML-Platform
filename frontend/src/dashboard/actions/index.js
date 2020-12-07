import { 
  GET_USER_JOBS, 
  CREATE_JOB, 
  CREATE_JOB_FAILED
} from '../actions/types';
import { GET_USER_JOBS_FAILED } from '../../auth/actions/types';


export const createJob = (files, setUploadMessage) => async (dispatch) => {
  
  let formData = new FormData();

  for (let i = 0; i < files['length']; i++) {
    formData.append(`file-${i}`, files[`${i}`])
  }
  formData.append('length', files['length'])

  const accessToken = localStorage.getItem('accessToken')
  const request = {
    method: "post",
    body: formData,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  }

  const response = await fetch('http://localhost:8000/api/jobs/create-job', request);
  if (!response.ok) {
    setUploadMessage('UploadFail');
    const payload = { uploadMessage: 'UploadFail' }
    dispatch( { type: CREATE_JOB_FAILED, payload });
  }
  else{
    setUploadMessage('UploadSuccess');
    const payload = { uploadMessage: 'UploadSuccess' }
    dispatch( { type: CREATE_JOB, payload });
  }
}

export const getUserJobs = () => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken')
  const request = {
    method: "get",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  }

  const response = await fetch('http://localhost:8000/api/jobs/predictions/', request);
  if (!response.ok) {
    localStorage.removeItem("accessToken");
    return dispatch({ type: GET_USER_JOBS_FAILED })
  }
  else {
    const data = await response.json();
    const jobs = combineJobIds(data);
    const payload = { jobs: jobs }

    dispatch({ type: GET_USER_JOBS, payload })
  }
}


function combineJobIds(data) {

  var jobIdMap = new Map();

  data.map(value => {
    let jobId = value['job_id'];
    if (jobIdMap.has(jobId)) {
      let prevArray = jobIdMap.get(jobId);
      jobIdMap.set(jobId, [...prevArray, value]);
    }
    else {
      jobIdMap.set(jobId, [value]);
    }
  })
    
  return Array.from(jobIdMap.values());
}