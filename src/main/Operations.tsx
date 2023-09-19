import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import React, { useEffect } from 'react';
import useSetState from 'src/hooks/useSetState';

import Table from 'antd/lib/table';
import message from 'antd/lib/message';
import { request } from 'src/appHelper';
import { generateNewDefaultConfig } from 'src/services/mockService';
import dayjs from 'dayjs';
import { Select } from 'antd';

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
const Operations = () => {
  const [state, setState] = useSetState({
    list: [] as any[],
    env: 'int',
    showNewAIPopup: false,
    showNewRoomPopup: false,
    needPullList: true,
    isLoadingTable: false,
  });

  // useEffect(() => {
  //   if (!state.needPullList) return;
  //   setState({ isLoadingTable: true });
  //   request('/api/website')
  //     .then((res) => {
  //       if (Array.isArray(res.data)) {
  //         setState({
  //           list: res.data.sort(
  //             (a: any, b: any) => dayjs(b.updateTime).unix() - dayjs(a.updateTime).unix(),
  //           ),
  //         });
  //       }
  //     })
  //     .finally(() => {
  //       setState({ needPullList: false, isLoadingTable: false });
  //     });
  // }, [state.needPullList]);
  return (
    <main style={{ margin: '0 auto', maxWidth: '50rem', paddingTop: '3rem' }}>
      {/* <h2>Website admin</h2> */}
      <Button
        type="primary"
        onClick={() => setState({ showNewAIPopup: true })}
        style={{ marginBottom: 20 }}
      >
        New AI
      </Button>
      <Button
        type="primary"
        onClick={() => setState({ showNewRoomPopup: true })}
        style={{ marginBottom: 20, marginLeft: 20 }}
      >
        New Room
      </Button>
      {/* <Table
        dataSource={state.list}
        columns={columns}
        rowKey="id"
        loading={state.isLoadingTable}
        pagination={{
          pageSize: 20,
          hideOnSinglePage: true,
        }}
      /> */}
      <Modal
        open={state.showNewAIPopup}
        footer={null}
        onCancel={() => setState({ showNewAIPopup: false })}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 50 }}
          onFinish={async (values) => {
            request
              .get(`/${state.env}/api/operate/createCharacter`, {
                params: {
                  url: values.url,
                },
              })
              .then(() => {
                setState({ needPullList: true, showNewAIPopup: false });
              })
              .catch((err) => {
                message.error(err.toString());
              });
          }}
        >
          <Form.Item label="Environment" name="env">
            <Select
              defaultValue={state.env}
              onChange={(value) => setState({ env: value })}
              options={[
                { label: 'Int', value: 'int' },
                { label: 'Prod', value: 'prod' },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: 'Please input the url!' }]}
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
      <Modal
        open={state.showNewRoomPopup}
        footer={null}
        onCancel={() => setState({ showNewRoomPopup: false })}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 50 }}
          onFinish={async (values) => {
            request
              .get(`/${state.env}/api/operate/createRoom`, {
                params: {
                  url: values.url,
                },
              })
              .then(() => {
                setState({ needPullList: true, showNewRoomPopup: false });
              })
              .catch((err) => {
                message.error(err.toString());
              });
          }}
        >
          <Form.Item label="Environment" name="env">
            <Select
              defaultValue={state.env}
              onChange={(value) => setState({ env: value })}
              options={[
                { label: 'Int', value: 'int' },
                { label: 'Prod', value: 'prod' },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            label="Url"
            name="url"
            rules={[{ required: true, message: 'Please input the url!' }]}
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

export default Operations;
