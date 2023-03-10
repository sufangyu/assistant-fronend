import qs from 'qs'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { IRequestConfig, IResponse } from './types'
import helper from './help'

// 缓存请求对象, 用于取消重复请求
const cacheRequestPromise: { [key: string]: any } = {}
// 是否是空对象
const isEmptyObject = (obj: any) => JSON.stringify(obj) === '{}'

/**
 * 请求拦截器 - 处理默认配置
 *
 * @export
 * @param {IRequestConfig} config
 * @return {*}
 */
export function handleRequestDefault(config: IRequestConfig): IRequestConfig {
  const METHOD = config.method!.toLocaleUpperCase()

  if (config.loading) {
    if (['POST', 'PUT'].includes(METHOD)) {
      config.loadingMessage = '提交中...'
    }
    const message = config.loadingMessage
    helper.showFullScreenLoading(message)
  }

  return config
}

/**
 * 请求拦截器 - 处理全局参数
 *
 * @export
 * @param {IRequestConfig} config
 * @return {*}
 */
export function handleRequestGlobalParams(config: IRequestConfig): IRequestConfig {
  const METHOD = config.method!.toLocaleUpperCase()

  if (METHOD === 'GET') {
    // GET请求: 数组类型如arr=[1,2]，则转换成arr=1&arr=2
    config.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'repeat' })
  }

  return config
}

/**
 * 请求拦截器 - 处理重复请求拦截器
 *
 * @export
 * @param {IRequestConfig} config
 * @returns
 */
export function handleRequestDuplicate(config: IRequestConfig): IRequestConfig {
  // 发起请求时，取消当前正在进行的相同请求
  let cacheRequestKey = config.method! + config.url!
  const dataTemp = { ...config.data }
  const paramsTemp = { ...config.params }

  if (!config.isCancelDuplicateWithoutParams) {
    if (!isEmptyObject(dataTemp)) {
      cacheRequestKey += `&${JSON.stringify(dataTemp)}`
    }

    if (!isEmptyObject(paramsTemp)) {
      cacheRequestKey += `&${JSON.stringify(paramsTemp)}`
    }
  }

  // 取消重复请求
  if (cacheRequestPromise[cacheRequestKey]) {
    cacheRequestPromise[cacheRequestKey]('Cancel operation')
  }
  cacheRequestPromise[cacheRequestKey] = config.cancelFn!

  return config
}

/**
 * 请求拦截器 - 处理请求 URL 域名拼接
 *
 * @export
 * @param {IRequestConfig} config
 * @returns
 */
export function handleRequestConfigUrl(config: IRequestConfig): IRequestConfig {
  // 处理完整 URL. 非 http, https 才处理
  const isExternal = /^(https?:)/.test(config.url!)
  if (!isExternal) {
    const API_BASE = import.meta.env.VITE_API_BASE
    config.url = `${API_BASE}${config.url}`
  }

  return config
}

/**
 * 响应处理 loading 显示
 * @param response AxiosResponse
 */
export function handleResponseDefault(response: AxiosResponse) {
  const requestConfig: IRequestConfig = response.config

  if (requestConfig.loading) {
    helper.hideFullScreenLoading()
  }

  return response
}

/**
 * 响应拦截器 - 处理成功响应
 *
 * @export
 * @param {AxiosResponse<IResponse>} response
 * @returns
 */
export async function handleResponseSuccess(response: AxiosResponse<IResponse>) {
  if (response.config.responseType!.toLocaleLowerCase() === 'blob') {
    return Promise.resolve(response)
  }
  const { success } = response.data ?? {}
  if (success) {
    return Promise.resolve(response)
  }

  return response
}

/**
 * 响应拦截器 - 处理失败响应
 *
 * @export
 * @param {AxiosResponse<IResponse>} response
 * @returns
 */
export function handleResponseFail(response: AxiosResponse<IResponse>) {
  const { data } = response
  // const requestConfig: IRequestConfig = response.config;
  const { success, message } = data

  if (!success) {
    helper.showMessage(message || '操作失败')
    return Promise.reject(data)
  }

  return response
}

/**
 * 响应拦截器 - 处理错误响应
 *
 * @export
 * @param {{
 *   message: string;
 *   response: { status?: any; statusText?: any };
 * }} error
 * @return {*}
 */
export async function handleResponseError(error: {
  message: string
  response: { status?: any; statusText?: any }
}) {
  helper.hideFullScreenLoading()

  // 通过 axios.isCancel(error) 判断是否是 canceled 的请求
  if (axios.isCancel(error)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      isCancel: true,
      status: 'canceled',
      statusText: 'Cancel operation',
      message: error.message
    })
  }

  // HTTP 错误
  if (error && error.response) {
    const MESSAGE_MAP: { [key: string]: string } = {
      400: '错误请求',
      401: '会话过期，请重新登录',
      403: '拒绝访问',
      404: '请求错误，未找到该资源',
      405: '请求方法未允许',
      408: '请求超时',
      500: '服务器端出错',
      501: '网络未实现',
      502: '网络错误',
      503: '服务不可用',
      504: '网络超时',
      505: 'HTTP版本不支持该请求'
    }
    error.message = MESSAGE_MAP[error.response.status] || `连接错误${error.response.status}`
  } else {
    error.message = error.message || '连接到服务器失败'
  }

  const { status = '', statusText = '未知错误' } = error.response || {}
  const errorMessage = `${status ? `${status} - ` : ''}${error.message}`
  helper.showMessage(errorMessage)

  // // TODO: 处理登录过期 & 没有权限的逻辑
  // if (status && status === 401) {
  //   return Promise.reject(data);
  // }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    status,
    statusText,
    message: error.message
  })
}
