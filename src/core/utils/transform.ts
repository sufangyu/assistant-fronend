import NP from 'number-precision'

/**
 * 转换统计信息
 *
 * @param current
 * @param prev
 * @returns
 */
export function transformTotal(current: number, prev: number) {
  const diff = current - prev
  return {
    total: current,
    trend: diff >= 0 ? 'up' : 'down',
    contrast: NP.round(NP.times(NP.divide(diff, prev), 100), 2)
  }
}
