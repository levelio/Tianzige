import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '@/styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="天天识字 - 快乐学习汉字书写" />
        <meta name="theme-color" content="#10b981" />
        <title>天天识字</title>
      </head>
      <body>
        <Outlet />
        <TanStackRouterDevtools />
      </body>
    </html>
  )
}
