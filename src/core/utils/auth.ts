import { useAuthStore } from '@/stores'

export function hasAuth<T = number>(roles: T[]) {
  const authStore = useAuthStore()
  const curRole = authStore?.account?.role as T

  if (!curRole) {
    return false
  }
  return roles.includes(curRole)
}
