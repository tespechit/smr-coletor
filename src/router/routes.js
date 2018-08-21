const routes = [
  {
    path: '/',
    component: () => import('layouts/Default'),
    children: [
      { path: '', component: () => import('pages/Inicio') },
      { path: '/pesquisas', component: () => import('pages/Pesquisas') },
      { path: '/concorrentes', component: () => import('pages/Concorrentes') },
      { path: '/coleta', component: () => import('pages/Coleta') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404.vue')
  })
}

export default routes
