import { RoleTypeEnum } from '@/enum'
import type { RouteRecordRaw } from 'vue-router'

export const otherRouters: RouteRecordRaw[] = [
  {
    path: '/push-record',
    name: 'PushRecord',
    component: () => import('@/layout/base.vue'),
    meta: {
      title: '推送记录'
    },
    children: [
      {
        path: 'index',
        name: 'PushRecordIndex',
        component: () => import('@/views/push-record/index.vue'),
        meta: {
          title: '推送记录',
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      }
    ]
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/layout/base.vue'),
    meta: {
      title: '分类管理'
    },
    children: [
      {
        path: 'index',
        name: 'CategoryIndex',
        component: () => import('@/views/category/index.vue'),
        meta: {
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      }
    ]
  },
  {
    path: '/tag',
    name: 'Tag',
    component: () => import('@/layout/base.vue'),
    meta: {
      title: '标签管理'
    },
    children: [
      {
        path: 'index',
        name: 'TagIndex',
        component: () => import('@/views/tag/index.vue'),
        meta: {
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      }
    ]
  },
  {
    path: '/robot',
    name: 'Robot',
    component: () => import('@/layout/base.vue'),
    meta: {
      title: '机器人管理'
    },
    children: [
      {
        path: 'index',
        name: 'RobotIndex',
        component: () => import('@/views/robot/index.vue'),
        meta: {
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/layout/base.vue'),
    meta: {
      title: '用户管理'
    },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/views/user/index.vue'),
        meta: {
          auth: true,
          roles: [RoleTypeEnum.ROOT]
        }
      }
    ]
  }
]
