import { createHashRouter } from 'react-router-dom';
import SideBar, { defaultRoutes } from './components/sidebar';
// import UsersAdmin from './User';
// import WebsiteList from './WebList';
// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';

const routes = [
  {
    element: <SideBar />,
    children: defaultRoutes,
  },
];
export const router = createHashRouter(routes);
