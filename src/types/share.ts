import type { BaseQuery } from './base'
import type { Category } from './category'
import type { Robot } from './robot'
import type { Tag } from './tag'

/** 分享内容 */
export interface Share {
  id?: number
  url?: string
  title?: string
  description?: string
  categoryId?: number
  category?: Category

  tagIds?: number[]
  tags?: Tag[]

  robotIds?: number[]
  robots?: Robot[]

  createdAt?: string
}

/** 分享内容列表查询条件 */
export interface ShareQuery extends BaseQuery {
  categoryId?: string
  tagIds?: number[]
}

/** 分享内容归档查询 */
export interface ShareFiledQuery {
  year?: string
  type?: 'quarter' | 'month'
}


/** 近2年、2月的数据汇总对比 */
export interface RecentTotalRes {
  prev: number;
  current: number;
  type: 'year' | 'month';
}

export type DataTrendType = "7day" | "14day" | "30day";

export type YearOverYearType = 'quarter' | 'month';