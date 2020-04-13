import { post } from '../axios'
export const inquiryList = (data) => post('/inquiry/inquiryList', data);
export const addInquiryInfo = (data) => post('/inquiry/addInquiryInfo', data);
export const editInquiryInfo = (data) => post('/inquiry/editInquiryInfo', data);
export const gainInquiryInfo = (data) => post('/inquiry/gainInquiryInfo', data);
export const delInquiryInfo = (data) => post('/inquiry/delInquiryInfo', data);
