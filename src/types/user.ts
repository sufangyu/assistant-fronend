import type { RoleType, StatusEnum, StatusType } from '@/enum'
import type { BaseQuery } from './base'

/** 机器人 */
export interface User {
  id?: number
  username?: string
  nickname?: string
  mobile?: string
  /** 类型（1: 超管; 2: 作者; 3: 访客;） */
  role?: RoleType
  status?: StatusType
  password?: string
  createdAt?: string
}

export interface UserQuery extends BaseQuery {
  username?: string
  status?: StatusEnum
  role?: RoleType
}
