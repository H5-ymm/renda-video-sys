import {
	$post
} from '../axios'

export const getCompanyList = data => $post('/company/companyList', data);

export const getCompanyInfo = data => $post('/company/company_info', data);

export const companyCheck = data => $post('/company/save_status', data);

export const companyEdit = data => $post('/company/company_edit', data);

export const companyLog = data => $post('/company/company_log', data);

export const resetPassword = data => $post('/company/reset_password', data);

export const companyDel = data => $post('/company/company_del', data);

export const companyLock = data => $post('/company/save_lock', data);

export const getProvincesList = () => $post('/Frequency/getProvincesList')

export const getCitysList = data => $post('/Frequency/getCitysList', data)

export const getAreasList = data => $post('/Frequency/getAreasList', data)
export const reset_password = data => $post('/company/reset_password', data)