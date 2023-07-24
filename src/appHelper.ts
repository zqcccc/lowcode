import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';
import axios from 'axios';
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

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('lowcode_token');
  if (token) config.headers['Authorization'] = 'Bearer ' + token;
  return config;
});
