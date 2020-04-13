import { post, $post } from '../axios'

export const internalList = (data) => post('/manageinvoice/internalList', data);
