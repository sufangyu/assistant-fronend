import { createRouter, createWebHashHistory } from 'vue-router'
import { baseRouters } from './base'
import { shareRouters } from './share'
import { otherRouters } from './other'
import { accountRouters } from './account'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/share/create'
    },
    ...shareRouters,
    ...otherRouters,
    ...accountRouters,
    ...baseRouters
  ]
})

export default router
