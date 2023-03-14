import type { RouteRecordRaw } from 'vue-router'
import { RoleTypeEnum } from '@/enum'

export const shareRouters: RouteRecordRaw[] = [
  {
    path: '/share',
    name: 'Share',
    component: () => import('@/layout/base.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'ShareDashboard',
        component: () => import('@/views/share/dashboard.vue'),
        meta: {
          title: '仪表盘',
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      },
      {
        path: 'list',
        name: 'ShareList',
        component: () => import('@/views/share/list.vue'),
        meta: {
          title: '分享列表',
          auth: true,
          roles: [RoleTypeEnum.ROOT, RoleTypeEnum.AUTHOR]
        }
      },
      {
        path: 'filed',
        name: 'ShareFiled',
        component: () => import('@/views/share/filed.vue'),
        meta: {
          title: '分享归档'
          // auth: true,
          // roles: [RoleTypeEnum.ROOT, RoleTypeEnum.AUTHOR]
        }
      },
      {
        path: 'create',
        name: 'ShareCreate',
        component: () => import('@/views/share/create.vue'),
        meta: {
          title: '创建分享'
          // auth: true,
          // roles: [RoleTypeEnum.ROOT, RoleTypeEnum.VISITOR]
        }
      },
      {
        path: 'edit/:id',
        name: 'ShareEdit',
        component: () => import('@/views/share/create.vue'),
        meta: {
          active: '/share/create',
          title: '编辑分享',
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      }
    ]
  }
]
