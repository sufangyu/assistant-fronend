export interface ListResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

/** 查询基础条件 */
export interface BaseQuery {
  page?: number
  size?: number
  start?: string
  end?: string
  daterange?: string
}
