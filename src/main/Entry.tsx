import React, { useEffect } from 'react';
import useSetState from 'src/hooks/useSetState';
// import Skeleton from 'antd/lib/skeleton';

// import Table from 'antd/lib/table';
import 'antd/dist/antd.css';
import Login from './Login';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAccountStore } from 'src/store/account';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';
import { request } from 'src/appHelper';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const Entry = () => {
  const [state, setState] = useSetState({
    loadingUser: false,
    list: [] as any[],
    showNewPopup: false,
    needPullList: true,
    hasLogin: false,
    isLoadingTable: false,
  });

  const accountStore = useAccountStore();
  useEffect(() => {
    const token = accountStore.accessToken;
    if (token) {
      setState({ loadingUser: true });
      request('/api/user')
        .then((res) => {
          if (res.data)
            accountStore.set({
              userInfo: {
                username: res.data.username,
                roles: res.data.roles.map((r: any) => r.name),
                permissions: res.data.permissions,
              },
            });
        })
        .finally(() => {
          setState({ loadingUser: false });
        });
    }
  }, [accountStore.accessToken]);
  if (!accountStore.accessToken) {
    return <Login onLoginSuccess={() => setState({ hasLogin: true })} />;
  }
  return <RouterProvider router={router} />;
};

export default Entry;
