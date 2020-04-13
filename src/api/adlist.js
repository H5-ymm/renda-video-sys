import { $post } from '../axios'

export const advertiseList = (data) => $post('/advertisement/advertiseList', data);
export const advertisementInfo = (data) => $post('/advertisement/advertisementInfo', data);
export const addAdvertisementInfo = (data) => $post('/Advertisement/addAdvertisementInfo', data);
export const editAdvertiseInfo = (data) => $post('/advertisement/editAdvertiseInfo', data);
export const delAdvertiseInfo = (data) => $post('/advertisement/delAdvertiseInfo', data);
