import { $post } from '../axios'
export const adminUserLocking = data => $post('/user/adminUserLocking', data);
