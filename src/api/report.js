//反馈

import { $post } from '../axios'
export const feedbackList = (data) => $post('/feedback/feedbackList', data);
export const doFeedbackInfo = (data) => $post('/feedback/delFeedback', data);