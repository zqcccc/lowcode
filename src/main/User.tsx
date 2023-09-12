import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import React, { useEffect } from 'react';
import useSetState from 'src/hooks/useSetState';

import Table from 'antd/lib/table';
import message from 'antd/lib/message';
import { request } from 'src/appHelper';
// import { generateNewDefaultConfig } from 'src/services/mockService';
import dayjs from 'dayjs';
import Transfer from 'antd/lib/transfer';

const UsersAdmin = () => {
  const [state, setState] = useSetState({
    list: [] as any[],
    showNewPopup: false,
    showEditPopup: false,
    needPullList: true,
    isLoadingTable: false,
    editingUser: null as any,
    roles: [] as { id: number; name: string; desc: string }[],
    selectKeys: [] as any[],
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      render(role: { name: string }[]) {
        return role?.map((item) => item.name).join(',');
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
                editingUser: record,
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
      request('/api/user/list').then((res) => {
        if (Array.isArray(res.data?.list)) {
          setState({
            list: res.data.list.sort(
              (a: any, b: any) => dayjs(b.updateTime).unix() - dayjs(a.updateTime).unix(),
            ),
          });
        }
      }),
      request('/api/role').then((res) => {
        setState({
          roles: res.data.list,
        });
      }),
    ]).finally(() => {
      setState({ needPullList: false, isLoadingTable: false });
    });
  }, [state.needPullList]);

  return (
    <main style={{ margin: '0 auto', maxWidth: '50rem', paddingTop: '2rem' }}>
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
          initialValues={state.editingUser?.roles.map((i: any) => i.id)}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          style={{ marginTop: 40 }}
          onFinish={async (values) => {
            request
              .post('/api/user/update', {
                id: state.editingUser.id,
                roles: values.roles
                  .map((newRoleIdStr: string) =>
                    state.roles.find((i) => i.id === Number(newRoleIdStr)),
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
          <Form.Item name="roles" label="Role">
            <Transfer
              titles={['未选', '已选']}
              dataSource={state.roles.map((i) => ({
                key: i.id.toString(),
                title: i.name,
                description: i.desc,
              }))}
              targetKeys={state.editingUser?.roles.map((i: any) => i.id.toString())}
              onChange={(targetKeys) => {
                console.log(
                  '%c targetKeys: ',
                  'font-size:12px;background-color: #2EAFB0;color:#fff;',
                  targetKeys,
                );
                setState({
                  editingUser: {
                    ...state.editingUser,
                    roles: targetKeys
                      .map((i: any) => state.roles.find((j) => j.id.toString() === i))
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
              .post('/api/user/register', {
                ...values,
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
            label="User Name"
            name="username"
            rules={[
              { required: true, message: '不可为空' },
              {
                min: 6,
                message: '最少6位',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: '不可为空' },
              {
                type: 'email',
                message: '请输入正确的邮箱',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: '不可为空' },
              {
                min: 6,
                message: '最少6位',
              },
            ]}
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

export default UsersAdmin;
