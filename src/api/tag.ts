import http from '@/core/http'
import type { Tag, TagQuery, ListResult } from '@/types'

/**
 * 分类管理（新建、修改）
 *
 * @export
 * @param {Tag} data
 * @return {*}
 */
export function manageTag(data: Tag) {
  const IS_EDIT = data.id
  const method = IS_EDIT ? 'patch' : 'post'
  const url = IS_EDIT ? `/tag/${data.id}` : '/tag'
  return http[method]({ url, data })
}

/**
 * 获取全部分类
 *
 * @export
 * @return {*}
 */
export function getTags() {
  return http.get<Tag[]>({ url: '/tag' })
}

/**
 * 获取分类列表
 *
 * @export
 * @return {*}
 */
export function getTagList(params: TagQuery) {
  return http.get<ListResult<Tag>>({ url: '/tag/list', params })
}

/**
 * 获取分类详情
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function getTagDetailInfo(id: number) {
  return http.get<Tag>({ url: `/tag/${id}` })
}

/**
 * 删除分类
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function removeTag(id: number) {
  return http.delete({ url: `/tag/${id}`, loadingMessage: '正在删除...' })
}
