import type { BaseQuery } from './base'

/** 分类 */
export interface Category {
  id?: number
  name?: string
  createdAt?: string
}

export interface CategoryQuery extends BaseQuery {
  name?: string
}
