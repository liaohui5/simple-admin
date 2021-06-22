import React, { useState } from 'react';
import { Modal, Form, Radio, Input, InputNumber, Select, message } from 'antd';
import { useRequest } from 'umi';
import * as PermService from '@/services/permissions';

const addPermLayer: React.FC<IAddPermLayerProps> = (props) => {
  const { showAddPermLayer, toggleAddPermLayer, refresh } = props;
  const [form] = Form.useForm();
  const [type, setType] = useState<number>(0);
  const [desc, setDesc] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [pid, setPid] = useState<number>(0);
  const [method, setMethod] = useState<string>('');

  // 获取插件权限参数
  const getCreatePermParams = (): ICreatePermissionItem => {
    const data: ICreatePermissionItem = { type, pid, desc };
    if (path) {
      data.path = path;
    }
    if (method) {
      data.method = method;
    }
    return data;
  };

  // 创建权限
  const { run: createPermission } = useRequest(
    PermService.createPermission(getCreatePermParams()),
    {
      manual: true,
      onSuccess: (res: IBaseResponse) => {
        if (res.success) {
          message.success('创建成功');
          toggleAddPermLayer(false);
          refresh();
          return;
        }
        message.success('创建失败: ' + res.msg);
      },
    },
  );

  // 表单验证规则
  const checkRules = {
    type: [
      {
        required: true,
        message: '必须选择权限类型',
      },
    ],

    desc: [
      {
        required: true,
        message: '必须填写权限描述',
      },
    ],

    pid: [
      {
        required: true,
        message: '必须填写权限父级id',
      },
    ],
  };

  return (
    <React.Fragment>
      <Modal
        title="创建新权限"
        visible={showAddPermLayer}
        onOk={createPermission}
        onCancel={() => toggleAddPermLayer(false)}
        cancelText={'取消'}
        okText={'确定'}
        width={'50%'}
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          labelCol={{ span: 3 }}
        >
          <Form.Item label="权限类型" name="type" rules={checkRules.type}>
            <Radio.Group onChange={(e) => setType(e.target.value)}>
              <Radio value={0}>路由权限</Radio>
              <Radio value={1}>API权限</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="权限描述" name="desc" rules={checkRules.desc}>
            <Input
              autoComplete="off"
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="权限路径" name="path">
            <Input
              autoComplete="off"
              onChange={(e) => setPath(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="父级权限ID" name="pid" rules={checkRules.pid}>
            <InputNumber min={0} onChange={(val) => setPid(val)} />
          </Form.Item>

          {type === 1 ? (
            <Form.Item label="权限请求方式" name="pid">
              <Select onChange={(val) => setMethod(val)}>
                <Select.Option value="get">
                  <div className="option-content">
                    <span>GET</span>
                    <span className="option-content-label">获取列表</span>
                  </div>
                </Select.Option>

                <Select.Option value="post">
                  <div className="option-content">
                    <span>POST</span>
                    <span className="option-content-label">创建数据</span>
                  </div>
                </Select.Option>
                <Select.Option value="patch">
                  <div className="option-content">
                    <span>PATCH</span>
                    <span className="option-content-label">修改数据</span>
                  </div>
                </Select.Option>

                <Select.Option value="delete">
                  <div className="option-content">
                    <span>DELETE</span>
                    <span className="option-content-label">删除数据</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default addPermLayer;
