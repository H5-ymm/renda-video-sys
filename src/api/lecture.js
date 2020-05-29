import {
	$post,
	uploadVideoAndFile
} from '../axios'

export const getLectureList = data => $post('/alecture/preachList', data);

export const addLecture = data => $post('/alecture/createAlecture', data);

export const getLectureInfo = data => $post('/alecture/getAlectureInfo', data);

export const lectureCheck = data => $post('/alecture/examineList', data);

export const lectureEdit = data => $post('/alecture/editAlecture', data);

export const lectureDel = data => $post('/alecture/delAlecture', data);

export const companyList = data => $post('/alecture/companyList', data)

export const moreupload = data => uploadVideoAndFile(data)
