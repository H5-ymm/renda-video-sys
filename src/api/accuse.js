//举报

import { $post } from '../axios'

export const reportList = (data) => $post('/report/reportList', data);
export const gainReportInfo = (data) => $post('/report/gainReportInfo', data);
export const feedbackReportInfo = (data) => $post('/report/feedbackReportInfo', data);