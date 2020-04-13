
import { $post } from '../axios'

export const getLogList = data => $post('/company/company_log', data); // 日志
export const getRole = data => $post('/index/getRole', data);
