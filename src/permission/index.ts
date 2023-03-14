import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
import { useAuthStore } from '@/stores'

NProgress.configure({ showSpinner: true })

router.beforeEach(
  async (to: RouteLocationNormalized, _f: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start()
    // console.log(to, _f, next);
    const authStore = useAuthStore()

    /** 未登录  */
    if (!authStore.isSigned) {
      if (to.matched.length === 0) {
        console.log('[No Signed]: No match router')
        next({ name: 'Login', replace: true })
      } else if (to?.meta?.auth) {
        console.log('[No Signed]: Need auth')
        const redirectUrl = encodeURIComponent(to.fullPath)
        next({
          name: 'Login',
          query: { redirect: redirectUrl },
          replace: true
        })
      }
      next()
    }

    /** 已登录  */
    if (authStore.isSigned && !authStore.account) {
      // 获取用户信息
      try {
        await authStore.getUserDetail()
      } catch (err) {
        console.log(err)
      }
    }
    
    if (to.name === 'Login') {
      next('/')
    } else if (to?.meta?.auth) {
      const hasAuth = checkAuth(to, authStore?.account?.role)
      hasAuth ? next() : next({ path: '/redirect/403', replace: false })
    }

    next()
  }
)

router.afterEach(() => {
  NProgress.done()
})

/**
 * 校验访问权限
 *
 * @param {RouteLocationNormalized} to
 * @return {*}
 */
function checkAuth(to: RouteLocationNormalized, role?: number) {
  if (!role) {
    return false
  }
  const curRouteRoles: number[] = (to?.meta?.roles as []) ?? []
  if (curRouteRoles.length === 0) {
    return true
  }

  const curUserRole = role
  return curRouteRoles.includes(curUserRole)
}
