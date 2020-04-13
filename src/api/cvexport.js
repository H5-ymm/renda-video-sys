import { post, $post } from '../axios'

export const exportUserResume = (data) => $post('/resumemasg/exportUserResume', data);