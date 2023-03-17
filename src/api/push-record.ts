import http from '@/core/http'
import type { PushRecord, PushRecordQuery, ListResult } from '@/types'

/**
 * 获取分类列表
 *
 * @export
 * @return {*}
 */
export function getPushRecordList(params: PushRecordQuery) {
  return http.get<ListResult<PushRecord>>({ url: '/push-record/list', params })
}

/**
 * 获取推送记录详情（含推送结果）
 *
 * @export
 * @param {number} [id]
 * @return {*}
 */
export function repushRecordDetail(id?: number) {
  return http.get<PushRecord>({
    url: `/push-record/${id}`
  })
}

/**
 *  重新推送
 * @param record
 * @returns
 */
export function repushRecord(record: PushRecord) {
  return http.post<PushRecord>({
    url: '/push-record/repush',
    data: record
  })
}
