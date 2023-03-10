import type { BaseQuery } from './base'

/** 分类 */
export interface Tag {
  id?: number
  name?: string
  createdAt?: string
}

export interface TagQuery extends BaseQuery {
  name?: string
}
