import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { View } from "react-native"

export default function LogoutPage() {
  const { logout } = useAuth()

  useEffect(() => {
    const doLogout = async () => {
      await logout()
    }
    doLogout()
  }, [logout])

  return <View />
}
