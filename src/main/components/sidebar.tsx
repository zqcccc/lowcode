import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import {
  Outlet,
  useLocation,
  useMatch,
  useMatches,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useAccountStore } from 'src/store/account';
import Operations from '../Operations';
import RoleAdmin from '../Role';
import UsersAdmin from '../User';
import WebsiteList from '../WebList';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

interface RouteItem {
  path: string;
  element: React.ReactNode;
  icon: React.ReactNode;
  label: React.ReactNode;
  key: React.Key;
  children?: RouteItem[];
  permissions?: string[];
}

export const defaultRoutes: RouteItem[] = [
  {
    path: '/',
    element: <Operations />,
    icon: <DesktopOutlined />,
    label: 'Kararu',
    key: '/',
    // children: [],
  },
  {
    path: '/website',
    element: <WebsiteList />,
    icon: <DesktopOutlined />,
    label: 'Website',
    key: '/website',
    // children: [],
  },
  {
    path: '/users',
    element: <UsersAdmin />,
    icon: <UserOutlined />,
    label: 'User',
    key: '/users',
    permissions: ['generalEdit'],
  },
  {
    path: '/roles',
    element: <RoleAdmin />,
    icon: <PieChartOutlined />,
    label: 'Role',
    key: '/roles',
    permissions: ['generalEdit'],
  },
];

const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const match = useMatches();

  const accountStore = useAccountStore();

  const curRoute = defaultRoutes.find((route) => route.path === match[1].pathname);

  const items: MenuItem[] = defaultRoutes
    .map((route) => {
      const { label, key, icon, children, permissions } = route;
      if (permissions) {
        if (
          permissions?.some((permission) =>
            accountStore.userInfo?.permissions?.includes(permission),
          )
        ) {
          return getItem(
            label,
            key,
            icon,
            children?.map?.((child) => getItem(child.label, child.key)),
          );
        } else {
          return null;
        }
      }
      return getItem(
        label,
        key,
        icon,
        children?.map?.((child) => getItem(child.label, child.key)),
      );
    })
    .filter(Boolean);

  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <h1
          className="logo"
          style={{
            width: '100%',
            height: 32,
            color: '#fff',
            // background: 'rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}
        >
          低代码管理
        </h1>
        <Menu
          theme="dark"
          selectedKeys={[match[1].pathname]}
          mode="inline"
          items={items}
          onClick={({ key: pathname }) => navigate(pathname)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center' }}
        >
          <div style={{ margin: '0 10px 0 auto' }}>
            Hi, {accountStore.userInfo?.username}
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => {
                useAccountStore.getState().empty();
              }}
            >
              Log out
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {curRoute && <Breadcrumb.Item>{curRoute.label}</Breadcrumb.Item>}
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default SideBar;
