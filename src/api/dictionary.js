import { getData, $post } from '../axios'

export const getConstant = data => getData('/tool/getConstant', data)
export const getProvincesList = data => $post('/tool/selectAddress', data)