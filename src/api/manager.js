import { $post } from '../axios'

export const getUserList = data => $post('/user/userList', data);
export const addUser = data => $post('/user/addUser', data);
export const deleteUser = data => $post('/user/deleteUser', data);
export const updateUser = data => $post('/user/updateUser', data);


