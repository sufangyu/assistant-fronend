import http from '@/core/http'
import type { StatusType } from '@/enum'
import type { Robot, RobotQuery, ListResult } from '@/types'

/**
 * 分类管理（新建、修改）
 *
 * @export
 * @param {Robot} data
 * @return {*}
 */
export function manageRobot(data: Robot) {
  const IS_EDIT = data.id
  const method = IS_EDIT ? 'patch' : 'post'
  const url = IS_EDIT ? `/robot/${data.id}` : '/robot'
  return http[method]({ url, data })
}

/**
 * 获取全部分类
 *
 * @export
 * @return {*}
 */
export function getRobots() {
  return http.get<Robot[]>({ url: '/robot' })
}

/**
 * 获取分类列表
 *
 * @export
 * @return {*}
 */
export function getRobotList(params: RobotQuery) {
  return http.get<ListResult<Robot>>({ url: '/robot/list', params })
}

/**
 * 获取分类详情
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function getRobotDetailInfo(id: number) {
  return http.get<Robot>({ url: `/robot/${id}` })
}

/**
 * 删除分类
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function removeRobot(id: number) {
  return http.delete({ url: `/robot/${id}`, loadingMessage: '正在删除...' })
}

/**
 * 停用/启用
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function toggleRobotStatus(id: number, status: StatusType) {
  return http.patch({ url: `/robot/status/${id}`, data: { status } })
}
