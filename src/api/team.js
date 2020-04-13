import { $post } from '../axios'
export const getTeamList = data => $post('/teamcms/getTeamList', data)
export const getTeamInfo = data => $post('/teamcms/getTeam_info', data) // 获取团队信息
export const edit_team = data => $post('/teamcms/edit_team', data) // 修改团队信息

export const departmentRoleList = data => $post('/teamcms/departmentRoleList', data) // 获取团队部门和部门职称列表


export const delTeam = data => $post('/teamcms/del_team', data) // 
export const checkTeamSave = data => $post('/teamcms/save_status', data)  // 团队审核
export const lockTeamSave = data => $post('/teamcms/lock_team', data)  // 团队锁定

export const lockUserSave = data => $post('/teamcms/lock_user', data)  // 成员锁定
export const delUser = data => $post('/teamcms/del_user', data)  //删除团员
export const getUserDetail = data => $post('/teamcms/detail_user', data) //获取团员信息

export const getTeamUserList = data => $post('/teamcms/getTeam_userList', data) //获取成员列表

