import http from '@/core/http'
import type { Category, CategoryQuery, ListResult } from '@/types'

/**
 * 分类管理（新建、修改）
 *
 * @export
 * @param {Category} data
 * @return {*}
 */
export function manageCategory(data: Category) {
  const IS_EDIT = data.id
  const method = IS_EDIT ? 'patch' : 'post'
  const url = IS_EDIT ? `/category/${data.id}` : '/category'
  return http[method]({ url, data })
}

/**
 * 获取全部分类
 *
 * @export
 * @return {*}
 */
export function getCategories() {
  return http.get<Category[]>({ url: '/category' })
}

/**
 * 获取分类列表
 *
 * @export
 * @return {*}
 */
export function getCategoryList(params: CategoryQuery) {
  return http.get<ListResult<Category>>({ url: '/category/list', params })
}

/**
 * 获取分类详情
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function getCategoryDetailInfo(id: number) {
  return http.get<Category>({ url: `/category/${id}` })
}

/**
 * 删除分类
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function removeCategory(id: number) {
  return http.delete({ url: `/category/${id}`, loadingMessage: '正在删除...' })
}
