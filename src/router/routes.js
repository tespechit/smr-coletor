export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/inicio') },
      { path: '/pesquisas', component: () => import('pages/pesquisas') },
      { path: '/concorrentes', component: () => import('pages/concorrentes') },
      { path: '/coleta', component: () => import('pages/coleta') }
    ]
  },

  {
    // Always leave this as last one
    path: '*',
    component: () => import('pages/outras/404')
  }
]
