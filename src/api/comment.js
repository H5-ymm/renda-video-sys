
import { post, $post } from '../axios'

export const getDiscussList = data => $post('/blscms/discussList', data) // 文章列表
export const getDiscussInfo = data => $post('/blscms/discussInfo', data) // 文章详情
export const seeTeamJobInfo = data => $post('/manageinvoice/seeTeamJobInfo', data) // 简历详情
export const delDiscuss = data => $post('/blscms/del_discuss', data)  // 删除文章
export const getReply = data => post('/blscms/getReply', data)  // 文章评论列表
export const delReplyfirst = data => post('/blscms/del_replyfirst', data)  // 删除一级评论
export const delReply = data => post('/blscms/del_reply', data)  // 删除二级评论


