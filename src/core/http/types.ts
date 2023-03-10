import type { AxiosRequestConfig, Canceler } from 'axios'

// 请求配置项
export interface IRequestConfig extends AxiosRequestConfig {
  /** 是否显示 loading */
  loading?: boolean
  /** 全局loading 提示语 */
  loadingMessage?: string
  /** 调用的域名服务标志 */
  server?: string
  /** 缓存请求 cancelToken 的 key */
  cacheRequestKey?: string
  /** 取消重复 url 请求（不包含参数） */
  isCancelDuplicateWithoutParams?: boolean
  /** 取消请求对象 */
  cancelFn?: Canceler
  /** Axios 请求配置 */
  config?: AxiosRequestConfig
}

// 请求响应体
export interface IResponse<T = any> {
  /** 响应是否成功 */
  success?: boolean
  /** 响应 Code */
  code?: string
  /** 响应描述内容 */
  message?: string
  /** 响应实体数据 */
  data: T
}
