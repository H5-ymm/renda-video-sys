import {
	$post
} from '../axios'

export const getCompanyList = data => $post('/faircompany/fairCompanyList', data);

export const addFairCompanyUser = data => $post('/faircompany/addFairCompanyUser', data);

export const getCompanyInfo = data => $post('/faircompany/seeFairCompanyInfo', data);

export const companyCheck = data => $post('/faircompany/approvalFairCompany', data);

export const companyEdit = data => $post('/company/company_edit', data);

export const companyDel = data => $post('/faircompany/delFairCompany', data);

export const getProvincesList = data => $post('/tool/selectAddress', data)