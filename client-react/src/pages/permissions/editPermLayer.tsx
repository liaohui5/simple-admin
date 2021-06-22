import React, { useState } from 'react';
import { Modal, Form, Radio, Input, InputNumber, Select, message } from 'antd';
import * as PermService from '@/services/permissions';
import { useRequest } from 'umi';

const EditPermLayer: React.FC<IEditPermLayerProps> = (props) => {
  const { currentPerm, showEditLayer, toggleEditLayer, refresh } = props;
  const [form] = Form.useForm();
  const [type, setType] = useState<number>(0);
  const [desc, setDesc] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [pid, setPid] = useState<number>(0);
  const [method, setMethod] = useState<string>('');

  // 获取修改权限参数
  const getParams = (): ICreatePermissionItem => {
    const data: ICreatePermissionItem = { type, pid, desc };
    if (path !== currentPerm.path) {
      data.path = path;
    }
    if (method !== currentPerm.method) {
      data.method = method;
    }
    return data;
  };

  // 修改权限
  const permId = currentPerm ? currentPerm.id : 0;
  const { run } = useRequest(PermService.updatePermInfo(permId, getParams()), {
    manual: true,
    onSuccess: (res: IBaseResponse) => {
      if (res.success) {
        message.success("修改成功");
        toggleEditLayer(false);
        refresh();
        return;
      }
      message.success("修改失败:" + res.msg);
    }
  });

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
        title="修改权限信息"
        visible={showEditLayer}
        onOk={run}
        onCancel={() => toggleEditLayer(false)}
        cancelText={'取消'}
        okText={'确定'}
        width={'50%'}
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          labelCol={{ span: 3 }}
          initialValues={currentPerm}
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

export default EditPermLayer;
