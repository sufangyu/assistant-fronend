import type { RouteRecordRaw } from 'vue-router'

export const accountRouters: RouteRecordRaw[] = [
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/layout/base.vue'),
    meta: {
      title: '个人中心',
      auth: true
    },
    children: [
      {
        path: 'index',
        name: 'AccountIndex',
        component: () => import('@/views/auth/account.vue'),
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: '用户登录'
    }
  }
]
