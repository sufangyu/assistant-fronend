import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, Canceler, Method } from 'axios'
import {
  handleRequestDefault,
  handleRequestGlobalParams,
  handleRequestDuplicate,
  handleRequestConfigUrl,
  handleResponseDefault,
  handleResponseSuccess,
  handleResponseFail,
  handleResponseError
} from './interceptors'
import type { IRequestConfig, IResponse } from './types'

class RequestHttp {
  service: AxiosInstance

  /** 实例化 Axios 配置 */
  private instanceConfig: IRequestConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    withCredentials: true,
    timeout: 5000
  }

  /** HTTP 请求 默认配置 */
  private defaultConfig: IRequestConfig = {
    url: '',
    baseURL: import.meta.env.VITE_API_BASE,
    method: 'GET',
    params: {},
    data: {},
    config: {},
    loading: true,
    loadingMessage: '加载中...',
    responseType: 'json',
    isCancelDuplicateWithoutParams: false
  }

  constructor() {
    this.service = axios.create(this.instanceConfig)
    this.interceptors()
  }

  interceptors() {
    // 请求拦截
    this.service.interceptors.request.use(handleRequestDefault, (error) => Promise.reject(error))
    this.service.interceptors.request.use(handleRequestGlobalParams)
    this.service.interceptors.request.use(handleRequestDuplicate)
    this.service.interceptors.request.use(handleRequestConfigUrl)

    // 响应拦截
    this.service.interceptors.response.use(handleResponseDefault)
    this.service.interceptors.response.use(handleResponseSuccess)
    this.service.interceptors.response.use(handleResponseFail, handleResponseError)
  }

  /**
   * 获取最终配置
   *
   * @private
   * @param {IRequestConfig} requestConfig 请求配置
   * @param {AxiosRequestConfig} config axios 配置
   * @param {Method} method 请求方法
   * @return {*}  {IRequestConfig}
   * @memberof RequestHttp
   */
  private getMergeConfig(
    requestConfig: IRequestConfig,
    config: AxiosRequestConfig,
    method: Method
  ): IRequestConfig {
    const mergeConfig = {
      ...this.defaultConfig,
      ...requestConfig,
      ...config,
      method
    }

    mergeConfig.cancelToken = new axios.CancelToken((c: Canceler) => {
      mergeConfig.cancelFn = c
    })

    return mergeConfig
  }

  /** GET 请求 */
  async get<T>({ config = {}, ...requestConfig }: IRequestConfig = {}): Promise<IResponse<T>> {
    const mergeConfig = this.getMergeConfig(requestConfig, config, 'GET')
    const res = await this.service.request(mergeConfig)

    return res.data
  }

  /** POST 请求 */
  async post<T>({ config = {}, ...requestConfig }: IRequestConfig = {}): Promise<IResponse<T>> {
    const mergeConfig = this.getMergeConfig(requestConfig, config, 'POST')
    const res = await this.service.request(mergeConfig)

    return res.data
  }

  /** PUT 请求 */
  async put<T>({ config = {}, ...requestConfig }: IRequestConfig = {}): Promise<IResponse<T>> {
    const mergeConfig = this.getMergeConfig(requestConfig, config, 'PUT')
    const res = await this.service.request(mergeConfig)

    return res.data
  }

  /** PATCH 请求 */
  async patch<T>({ config = {}, ...requestConfig }: IRequestConfig = {}): Promise<IResponse<T>> {
    const mergeConfig = this.getMergeConfig(requestConfig, config, 'PATCH')
    const res = await this.service.request(mergeConfig)

    return res.data
  }

  /** DELETE 请求 */
  async delete<T>({ config = {}, ...requestConfig }: IRequestConfig = {}): Promise<IResponse<T>> {
    const mergeConfig = this.getMergeConfig(requestConfig, config, 'DELETE')
    const res = await this.service.request(mergeConfig)

    return res.data
  }
}

const http = new RequestHttp()
export default http
