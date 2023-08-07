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
import { Transfer } from 'antd';

const RoleAdmin = () => {
  const [state, setState] = useSetState({
    list: [] as any[],
    showNewPopup: false,
    showEditPopup: false,
    needPullList: true,
    isLoadingTable: false,
    editingRole: null as any,
    permissions: [] as { id: number; name: string; desc: string }[],
    selectKeys: [] as any[],
  });


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      render(permissions: { name: string }[]) {
        return permissions?.map((item) => item.name).join(',');
      },
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
        return (
          <div
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => {
              setState({
                editingRole: record,
                showEditPopup: true,
              });
            }}
          >
            Edit
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!state.needPullList) return;
    setState({ isLoadingTable: true });
    Promise.all([
      request('/api/role').then((res) => {
        setState({
          list: res.data.list,
        });
      }),
      request('/api/permission').then((res) => {
        setState({
          permissions: res.data.list,
        });
      }),
    ]).finally(() => {
      setState({ needPullList: false, isLoadingTable: false });
    });
  }, [state.needPullList]);
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
        open={state.showEditPopup}
        footer={null}
        onCancel={() => setState({ showEditPopup: false })}
      >
        <Form
          initialValues={state.editingRole?.permissions.map((i: any) => i.id)}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 50 }}
          onFinish={async (values) => {
            request
              .patch(`/api/role/${state.editingRole.id}`, {
                id: state.editingRole.id,
                permissions: values.permissions
                  .map((newRoleIdStr: string) =>
                    state.permissions.find((i) => i.id === Number(newRoleIdStr)),
                  )
                  .filter(Boolean),
              })
              .then(() => {
                setState({ needPullList: true, showEditPopup: false });
              })
              .catch((err) => {
                message.error(err.toString());
              });
          }}
        >
          <Form.Item name="permissions">
            <Transfer
              dataSource={state.permissions.map((i) => ({
                key: i.id.toString(),
                title: i.name,
                description: i.desc,
              }))}
              targetKeys={state.editingRole?.permissions?.map((i: any) => i.id.toString())}
              onChange={(targetKeys) => {
                setState({
                  editingRole: {
                    ...state.editingRole,
                    permissions: targetKeys
                      .map((i: any) => state.permissions.find((j) => j.id.toString() === i))
                      .filter(Boolean),
                  },
                });
              }}
              render={(item) => item.title}
            ></Transfer>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={state.showNewPopup}
        footer={null}
        onCancel={() => setState({ showNewPopup: false })}
      >
        <Form
          // initialValues={state.editingUser}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 50 }}
          onFinish={async (values) => {
            request
              .post('/api/role', {
                ...values,
                permissions: [],
              })
              .then(() => {
                setState({ needPullList: true, showNewPopup: false });
              })
              .catch((err) => {
                message.error(err.toString());
              });
          }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: '不可为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="desc"
            rules={[{ required: true, message: '不可为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};

export default RoleAdmin;
