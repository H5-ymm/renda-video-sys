import { $post } from '../axios'

export const getRoleList = data => $post('/role/getRoleList', data)
