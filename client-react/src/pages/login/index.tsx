import React from 'react';
import styles from './index.less';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect, useRequest } from 'umi';

import * as LoginService from '@/services/login';

/**
 * 登录页
 * @param props
 * @returns
 */
const Login: React.FC<ILoginProps> = (props) => {
  const [from] = Form.useForm();
  const getParams = () => from.getFieldsValue();

  // 提交表单数据
  const { run: handleSubmit } = useRequest(LoginService.login(getParams()), {
    manual: true,
    onSuccess: async (res: IResponse<IAuthUser>) => {
      if (res.success) {
        await props.login(res.data);
        props.history.replace('/');
      }
    },
  });

  const checkRules = {
    email: [
      {
        validator: (_: any, value: string) => {
          if (!value) return Promise.reject(new Error('请填写邮箱地址'));
          const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!emailReg.test(value)) {
            return Promise.reject(new Error('邮箱格式有误'));
          }
          return Promise.resolve();
        },
      },
    ],
    password: [
      {
        required: true,
        message: '密码不能为空',
      },
    ],
  };

  const initValues = {
    email: 'admin@qq.com',
    password: '123456',
  };

  return (
    <div className={styles.login_container}>
      <Card title="登录" className={styles.card_container}>
        <Form form={from} initialValues={initValues} onFinish={handleSubmit}>
          <Form.Item name="email" rules={checkRules.email}>
            <Input
              prefix={<UserOutlined />}
              size="large"
              placeholder="请输入邮箱"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item name="password" rules={checkRules.password}>
            <Input
              type="password"
              prefix={<LockOutlined />}
              size="large"
              placeholder="请输入密码"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => {
  return {
    login: (data: IAuthUser) => {
      dispatch({ type: 'login/login', payload: data });
    },
  };
};

export default connect(null, mapDispatchToProps)(Login);
