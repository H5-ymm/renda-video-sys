import { getData } from '../axios'

export const getConstant = data => getData('/index/getConstant', data)