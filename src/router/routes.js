const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/DashboardPage.vue')
      },
      {
        path: 'explicadores',
        component: () => import('@/pages/ExplicadoresPage.vue')
      },

      
    ]
  }
]

export default routes
