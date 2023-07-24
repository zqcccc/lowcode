import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import React, { useEffect } from 'react';
import useSetState from 'src/hooks/useSetState';

import Table from 'antd/lib/table';
import message from 'antd/lib/message';
import 'antd/dist/antd.css';
import Login from './Login';
import { request } from 'src/appHelper';
import { generateNewDefaultConfig } from 'src/services/mockService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Updated At',
    dataIndex: 'updateTime',
    render: (text: string) => dayjs(text).fromNow(),
    // sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Action',
    render: (_: any, record: any) => {
      return <a href={`/edit.html?id=${record.id}`}>Edit</a>;
    },
  },
];
const Entry = () => {
  const [state, setState] = useSetState({
    loadingUser: true,
    list: [] as any[],
    showNewPopup: false,
    needPullList: true,
    hasLogin: false,
    isLoadingTable: false,
  });
  useEffect(() => {
    const token = localStorage.getItem('lowcode_token');
    if (token) {
      request('/api/user/check')
        .then((res) => {
          if (res.data?.token) {
            setState({ hasLogin: true });
          } else if (res.data.message) {
            message.error(res.data.message);
          } else if (res.data.statusCode === 401 || res.status >= 400) {
            localStorage.removeItem('lowcode_token');
            message.error('登录过期，请重新登录');
          }
        })
        .finally(() => {
          setState({ loadingUser: false });
        });
    }
  }, []);
  useEffect(() => {
    if (!state.needPullList || !state.hasLogin) return;
    setState({ isLoadingTable: true });
    request('/api/website')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setState({
            list: res.data.sort(
              (a: any, b: any) => dayjs(b.updateTime).unix() - dayjs(a.updateTime).unix(),
            ),
          });
        }
      })
      .finally(() => {
        setState({ needPullList: false, isLoadingTable: false });
      });
  }, [state.needPullList, state.hasLogin]);
  if (state.loadingUser) {
    return <div>loading...</div>;
  }
  if (!state.hasLogin) {
    return <Login onLoginSuccess={() => setState({ hasLogin: true })} />;
  }
  return (
    <main style={{ margin: '0 auto', maxWidth: '50rem', paddingTop: '3rem' }}>
      <Button
        type="primary"
        onClick={() => setState({ showNewPopup: true })}
        style={{ marginBottom: 20 }}
      >
        New
      </Button>
      <Table
        dataSource={state.list}
        columns={columns}
        rowKey="id"
        loading={state.isLoadingTable}
        pagination={{
          pageSize: 20,
          hideOnSinglePage: true,
        }}
      />
      <Modal
        open={state.showNewPopup}
        footer={null}
        onCancel={() => setState({ showNewPopup: false })}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 50 }}
          onFinish={async (values) => {
            request
              .post('/api/website', {
                ...values,
                config: await generateNewDefaultConfig(),
              })
              .then(() => {
                setState({ needPullList: true, showNewPopup: false });
              })
              .catch((err) => {
                message.error(err.toString());
              });
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name of website!' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};

export default Entry;
