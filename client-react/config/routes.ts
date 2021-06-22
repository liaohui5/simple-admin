
// 路由
const routes = [
  { path: '/login', component: '@/pages/login/index' },
  {
    path: '/',
    component: '@/layouts/index',
    wrappers: ['@/wrappers/login'],
    routes: [
      {
        path: '/',
        component: '@/pages/welcome/index',
      },
      {
        path: '/users',
        component: '@/pages/users/index',
      },
      {
        path: '/roles',
        component: '@/pages/roles/index',
      },
      {
        path: '/permissions',
        component: '@/pages/permissions/index',
      },
    ],
  },
];

export default routes;
