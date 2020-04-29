import { $post } from '../axios'

export const getJobFairList = data => $post('/videojobfair/jobFairList', data);
export const addJobFair = data => $post('/videojobfair/createJobFair', data);
export const deleteJobFair = data => $post('/videojobfair/delJobFair', data);
export const editJobFair = data => $post('/videojobfair/editJobFair', data);
export const jobFairDetail = data => $post('/videojobfair/getJobFairInfo', data);