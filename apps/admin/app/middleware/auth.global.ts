import { auth } from "~/lib/auth"

const publicRoutes = [
  {
    path: "/login",
    action: "redirect"
  },
  {
    path: "/registrar",
    action: "redirect"
  }
] as const

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const publicRoute = publicRoutes.find((route) => route.path === to.path)
  const session = await auth.getSession()

  if (!session.data && publicRoute) return
  if (!session.data && !publicRoute) {
    return navigateTo("/login", {
      replace: true
    })
  }
  if (session.data && publicRoute?.action === "redirect") {
    return navigateTo("/", {
      replace: true
    })
  }
})
