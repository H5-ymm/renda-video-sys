import { $post } from '../axios'

export const goLogin = data => $post('/login/login', data);