import http from '@/core/http'
import type { StatusType } from '@/enum'
import type { User, ListResult, UserQuery } from '@/types'

/**
 * 分类管理（新建、修改）
 *
 * @export
 * @param {User} data
 * @return {*}
 */
export function manageUser(data: User) {
  const IS_EDIT = data.id
  const method = IS_EDIT ? 'patch' : 'post'
  const url = IS_EDIT ? `/user/${data.id}` : '/user'
  return http[method]<User>({ url, data })
}

/**
 * 获取分类列表
 *
 * @export
 * @return {*}
 */
export function getUserList(params: UserQuery) {
  return http.get<ListResult<User>>({ url: '/user/list', params })
}

/**
 * 获取详情
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function getUserDetailInfo(id: number) {
  return http.get<User>({ url: `/user/${id}` })
}

/**
 * 删除用户
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function removeUser(id: number) {
  return http.delete({ url: `/user/${id}`, loadingMessage: '正在删除...' })
}

/**
 * 重置密码
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function resetPassword(id: number) {
  return http.patch<{ password: string }>({
    url: `/user/reset/${id}`,
    loadingMessage: '正在重置...'
  })
}

/**
 * 停用/启用
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function toggleUserStatus(id: number, status: StatusType) {
  return http.patch({ url: `/user/status/${id}`, data: { status } })
}

/**
 * 获取用户详情（基于 TOKEN）
 *
 * @export
 * @return {*}
 */
export function userDetail() {
  return http.get<User>({
    url: '/user/detail'
  })
}
