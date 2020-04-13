import {
	exportData,
	$post
} from '../axios'

export const teamAdministrationResume = (data) => $post('/resumemasg/teamAdministrationResume', data);
export const exportUserResume = (data) => exportData('/resumemasg/exportUserResume', data);
export const getTrackingList = (data) => $post('/resumemasg/getTrackingList', data);