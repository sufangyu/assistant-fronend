import type { PushResultEnum, PushResultModuleType, PushResultType } from '@/enum'
import type { BaseQuery } from './base'

/** 推送结果记录 */
export interface PushRecord {
  id?: number
  /** share: 分享 */
  module: PushResultModuleType
  variable?: string
  /** 结果（0: 失败; 1: 成功;）*/
  result?: PushResultType
  createdAt?: string
}

export interface PushRecordQuery extends BaseQuery {
  result?: PushResultEnum
}
