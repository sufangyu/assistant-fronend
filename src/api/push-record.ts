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

export function repushRecord(record: PushRecord) {
  return http.post<PushRecord>({
    url: '/push-record/repush',
    data: record
  })
}
