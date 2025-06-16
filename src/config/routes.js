import Dashboard from '@/components/pages/Dashboard';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  }
};

export const routeArray = Object.values(routes);
export default routes;