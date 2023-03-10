import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      // component: () => import('../views/share/home.vue'),
      redirect: '/share/create'
    },
    {
      path: '/share',
      name: 'Share',
      children: [
        {
          path: 'dashboard',
          name: 'ShareDashboard',
          component: () => import('../views/share/dashboard.vue')
        },
        {
          path: 'list',
          name: 'ShareList',
          component: () => import('../views/share/list.vue')
        },
        {
          path: 'filed',
          name: 'ShareFiled',
          component: () => import('../views/share/filed.vue')
        },
        {
          path: 'create',
          name: 'ShareCreate',
          component: () => import('../views/share/create.vue')
        },
        {
          path: 'edit/:id',
          name: 'ShareEdit',
          component: () => import('../views/share/create.vue'),
          meta: {
            active: '/share/create'
          },
        }
      ]
    },
    {
      path: '/push-record',
      name: 'PushRecord',
      component: () => import('@/views/push-record/index.vue'),
      meta: {
        title: '推送记录'
      }
    },
    {
      path: '/category',
      name: 'Category',
      component: () => import('@/views/category/index.vue'),
      meta: {
        title: '分类管理'
      }
    },
    {
      path: '/tag',
      name: 'Tag',
      component: () => import('@/views/tag/index.vue'),
      meta: {
        title: '标签管理'
      }
    },
    {
      path: '/robot',
      name: 'Robot',
      component: () => import('@/views/robot/index.vue'),
      meta: {
        title: '机器人管理'
      }
    }
  ]
})

export default router
