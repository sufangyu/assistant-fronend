import type { PushResultEnum, PushResultModuleType, PushResultType } from '@/enum'
import type { Robot } from './robot'
import type { BaseQuery } from './base'

/** 推送结果记录 */
export interface PushRecord {
  id?: number
  /** share: 分享 */
  module: PushResultModuleType
  title: string
  variable: string

  results: PushRecordResult[]
  resultTotal?: { success: number; fail: number }
  createdAt?: string
}

export interface PushRecordQuery extends BaseQuery {
  result?: PushResultEnum
}

export interface PushRecordResult {
  id: number
  /** 结果（0: 失败; 1: 成功;）*/
  result?: PushResultType
  createdAt?: string
  robot: Robot
}
