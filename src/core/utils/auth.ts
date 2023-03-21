import { useAuthStore } from '@/stores'

export function hasAuth<T extends number>(roles: T[]) {
  const authStore = useAuthStore()
  const curRole = (authStore?.account?.role ?? -1) as T

  if (!curRole) {
    return false
  }
  return roles.includes(curRole)
}
