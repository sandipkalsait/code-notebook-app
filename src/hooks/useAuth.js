import { useAuthContext } from '@components/Auth/AuthContext'

export const useAuth = () => {
  return useAuthContext()
}