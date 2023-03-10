import http from '@/core/http'
import type { Share, ListResult, ShareQuery, RecentTotalRes, DataTrendType, YearOverYearType } from '@/types'

/**
 * 创建/修改分享内容
 *
 * @export
 * @param {Share} data
 * @return {*}
 */
export function createShare(data: Share) {
  const IS_EDIT = data.id
  const method = IS_EDIT ? 'patch' : 'post'
  const url = IS_EDIT ? `/share/${data.id}` : '/share'
  return http[method]({ url, data })
}

/**
 * 获取分享内容列表
 *
 * @export
 * @param {ShareQuery} params
 * @return {*}
 */
export function getShares(params: ShareQuery) {
  return http.get<ListResult<Share>>({
    url: '/share',
    params
  })
}

/**
 * 删除分享内容
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function removeShare(id: number) {
  return http.delete({ url: `/share/${id}`, loadingMessage: '正在删除...' })
}

/**
 * 获取分享内容详情
 *
 * @export
 * @param {number} id
 * @return {*}
 */
export function getShareDetailInfo(id: number) {
  return http.get<Share>({ url: `/share/${id}` })
}

/**
 * 获取站点信息
 *
 * @export
 * @param {string} url
 * @return {*}
 */
export function getWebsiteInfo(url: string) {
  return http.get<{ title: string; description: string }>({
    url: '/share/website',
    params: { url }
  })
}


/**
 * 近2年、2个月的数据汇总对比
 *
 * @export
 * @param {('year' | 'month')} type
 * @return {*} 
 */
export function recentTotal(type: 'year' | 'month') {
  return http.get<RecentTotalRes>({
    url: `/share/total/${type}`,
  })
}

/**
 * 近7、14、30天的数据趋势
 *
 * @export
 * @param {DataTrendType} type
 * @return {*} 
 */
export function dataTrend(type: DataTrendType) {
  return http.get<any>({
    url: `/share/trend`,
    params: {
      type,
    }
  })
}


/**
 * 数据同比（季度、月度）
 *
 * @export
 * @param {DataTrendType} type
 * @return {*} 
 */
export function dataYearOverYear(type: YearOverYearType) {
  return http.get<any>({
    url: `/share/year-over-year`,
    params: { type }
  })
}

/**
 * 查询分享内容的分类、机器人、标签占比
 *
 * @export
 * @param {('category' | 'robot' | 'tag')} type
 * @return {*} 
 */
export function percentPip(type: 'category' | 'robot' | 'tag') {
  return http.get<{ name: string; value: number | string}[]>({
    url: `/share/pip/${type}`,
  })
}


/**
 * 按归类查询分享内容
 *
 * @export
 * @param {string} year
 * @param {('quarter' | 'month')} type
 * @return {*} 
 */
export function findShareByFiled(year: string, type: 'quarter' | 'month') {
  return http.get<{ type: string; label: string; list: Share[];}[]>({
    url: `/share/filed`,
    params: {
      year,
      type,
    },
  })
}
