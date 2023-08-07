import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import React, { useEffect } from 'react';
import useSetState from 'src/hooks/useSetState';

import Table from 'antd/lib/table';
import message from 'antd/lib/message';
import 'antd/dist/antd.css';
import { request } from 'src/appHelper';
import { generateNewDefaultConfig } from 'src/services/mockService';
import dayjs from 'dayjs';

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
const WebsiteList = () => {
  const [state, setState] = useSetState({
    list: [] as any[],
    showNewPopup: false,
    needPullList: true,
    isLoadingTable: false,
  });

  useEffect(() => {
    if (!state.needPullList) return;
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
  }, [state.needPullList]);
  return (
    <main style={{ margin: '0 auto', maxWidth: '50rem', paddingTop: '3rem' }}>
      <h2>Website admin</h2>
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

export default WebsiteList
