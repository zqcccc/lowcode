import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import { useEffect, useState } from 'react';
import { request } from '../appHelper';

interface IProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: IProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <main style={{ margin: '0 auto', maxWidth: '30rem', paddingTop: '3rem' }}>
      <h1 style={{ textAlign: 'center' }}>Login</h1>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ marginTop: 50 }}
        onFinish={async (values) => {
          request
            .post<{ token: string; message?: string }>('/api/user/login', values)
            .then((res) => {
              const { data } = res;
              if (data.token) {
                localStorage.setItem('lowcode_token', data.token);
                onLoginSuccess();
              } else if (data.message) {
                message.warning(data.message);
              } else {
                message.error('Login failed');
              }
            })
            .catch((reason) => {
              console.log(
                '%c reason: ',
                'font-size:12px;background-color: #EDD8AB;color:#fff;',
                reason,
              );
              message.warning('Login failed');
            });
        }}
      >
        <Form.Item
          label="UserName"
          name="username"
          rules={[{ required: true, message: 'Please input the UserName!' }]}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input the Password!' }]}
        >
          <Input.Password
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </main>
  );
};
export default Login;
