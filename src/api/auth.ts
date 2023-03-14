import http from '@/core/http'

/**
 * 用户登录
 *
 * @export
 * @param {{ username: string;  password: string}} data
 * @return {*}
 */
export function login(data: { username: string; password: string }) {
  return http.post<{ token: string }>({
    url: '/auth/login',
    data
  })
}
