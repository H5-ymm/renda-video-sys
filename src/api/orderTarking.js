import { post, $post } from '../axios'

export const getList = data => post('/receipt/receiptList', data);
export const getOrderDetail = data => post('/enterpriseinvoice/selectInvoiceInfo', data);
export const getFdJobList = data => $post('/companyfdcms/fdJobList', data);
export const getCount = data => $post('/companyfdcms/getCount', data);
export const delFdjob = data => $post('/companyfdcms/fdjob_del', data);
export const checkFdjob = data => $post('/companyfdcms/save_status', data);
export const getJobInfo = data => $post('/companyfdcms/get_job_info', data); // 发单职位详情
export const updateInvoice = data => $post('/companyfdcms/updateInvoice', data);





