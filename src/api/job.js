import { $post } from '../axios'
export const getJobList = data => $post('/fairjob/fairJobList', data);
export const trialFairJob = data => $post('/fairjob/trialFairJob', data);
export const delFairJob = data => $post('/fairjob/delFairJob', data);
export const fairJobInfo = data => $post('/fairjob/fairJobInfo', data);