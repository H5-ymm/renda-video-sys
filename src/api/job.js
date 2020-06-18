import { $post } from '../axios'
export const getJobList = data => {
  let url = data.comId ? '/consumer/getCompanyJobList' : '/fairjob/fairJobList'
  console.log(url)
  return $post(url, data)
};
export const trialFairJob = data => $post('/fairjob/trialFairJob', data);
export const delFairJob = data => $post('/fairjob/delFairJob', data);
export const fairJobInfo = data => $post('/fairjob/fairJobInfo', data);