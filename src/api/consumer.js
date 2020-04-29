
import { $post } from '../axios'

export const wantedJobUserList = data => $post('/consumer/wantedJobUserList', data); // 日志
export const addConsumer = data => $post('/consumer/addConsumer', data);
export const seeConsumerInfo = data => $post('/consumer/seeConsumerInfo', data);
export const delConsumer = data => $post('/consumer/delConsumer', data);
