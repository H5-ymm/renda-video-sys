import { post, $post } from '../axios'

export const seeUserResume = (data) => $post('/Resumemasg/seeUserResume', data);