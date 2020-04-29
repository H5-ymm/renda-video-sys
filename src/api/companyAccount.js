import {
	$post
} from '../axios'

export const getJobUserList = data => $post('/consumer/wantedJobUserList', data);

export const addCompanyInfo = data => $post('/consumer/addCompanyInfo', data);

export const seeCompanyInfo = data => $post('/consumer/seeCompanyInfo', data);
export const companyEdit = data => $post('/company/company_edit', data);

export const companyDel = data => $post('/faircompany/delFairCompany', data);
