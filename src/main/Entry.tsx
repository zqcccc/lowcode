import React, { useEffect } from 'react';
import useSetState from 'src/hooks/useSetState';
import Skeleton from 'antd/lib/skeleton';

import Table from 'antd/lib/table';
import 'antd/dist/antd.css';
import Login from './Login';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAccountStore } from 'src/store/account';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';

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
  // useEffect(() => {
  //   const token = accountStore.refreshToken;
  //   if (token) {
  //     setState({ loadingUser: true });
  //     request('/api/user/refresh', { params: { refreshToken: token } })
  //       .then((res) => {
  //         if (res.data?.accessToken) {
  //           setState({ hasLogin: true });
  //           accountStore.set({
  //             accessToken: res.data.accessToken,
  //             refreshToken: res.data.refreshToken,
  //             username: res.data.userName,
  //           });
  //         } else {
  //           accountStore.set({ username: '', accessToken: '', refreshToken: '' });
  //           // if (res.data.message) {
  //           //   message.error(res.data.message);
  //           // } else if (res.data.statusCode === 401 || res.status >= 400) {
  //           //   message.error('登录过期，请重新登录');
  //           // }
  //         }
  //       })
  //       .finally(() => {
  //         setState({ loadingUser: false });
  //       });
  //   }
  // }, []);
  // if (state.loadingUser) {
  //   return (
  //     <>
  //       {Array(2)
  //         .fill(0)
  //         .map((_, i) => (
  //           <Skeleton key={i} active paragraph={{ rows: 10 }} />
  //         ))}
  //     </>
  //   );
  // }
  if (!accountStore.accessToken) {
    return <Login onLoginSuccess={() => setState({ hasLogin: true })} />;
  }
  return <RouterProvider router={router} />;
};

export default Entry;
