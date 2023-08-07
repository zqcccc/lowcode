import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';
import axios from 'axios';
import { useAccountStore } from './store/account';
const appHelper = {
  requestHandlersMap: {
    fetch: createFetchHandler(),
  },
  utils: {
    demoUtil: (...params: any[]) => {
      console.log(`this is a demoUtil with params ${params}`);
    },
  },
  constants: {
    ConstantA: 'ConstantA',
    ConstantB: 'ConstantB',
  },
};
export default appHelper;

export const request = axios.create({});

const refreshToken = async () => {
  const refreshToken = useAccountStore.getState().refreshToken;
  const res = await request.get('/api/user/refresh', { params: { refreshToken } });
  if (res.status === 200) {
    useAccountStore.setState({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      username: res.data.userName,
    });
  } else {
    useAccountStore.setState({
      accessToken: '',
      refreshToken: '',
      username: '',
    });
  }
  return res;
};

request.interceptors.request.use((config) => {
  const token = useAccountStore.getState().accessToken;
  if (token) config.headers['Authorization'] = 'Bearer ' + token;
  return config;
});

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    let { data, config } = error.response;

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
      const res = await refreshToken();

      if (res.status === 200) {
        return axios(
          Object.assign({}, config, {
            headers: { Authorization: 'Bearer ' + res.data.accessToken },
          }),
        );
      } else {
        throw res.data;
      }
    } else {
      return error.response;
    }
  },
);
