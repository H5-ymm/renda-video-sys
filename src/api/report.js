//反馈

import { $post } from '../axios'

export const feedbackList = (data) => $post('/feedback/feedbackList', data);
export const gainFeedbackInfo = (data) => $post('/feedback/gainFeedbackInfo', data);
export const doFeedbackInfo = (data) => $post('/feedback/doFeedbackInfo', data);