import React, { useState } from 'react';
import { useRequest } from 'umi';
import { Modal, Form, Input, message } from 'antd';
import * as RoleService from '@/services/roles';

const addRoleLayer: React.FC<IAddRoleLayerProps> = (props) => {
  const { showAddRoleLayer, toggleAddRoleLayer, refresh } = props;
  const [role_name, setRoleName] = useState<string>('');
  const [role_desc, setRoleDesc] = useState<string>('');
  const [form] = Form.useForm();

  // 创建角色
  const { run } = useRequest(RoleService.createRole({ role_name, role_desc }), {
    manual: true,
    onSuccess: (res: IResponse<IRoleItem[]>) => {
      if (res.success) {
        message.success('创建成功');
        toggleAddRoleLayer(false);
        refresh();
        return;
      }
      message.error('创建失败:' + res.msg);
    },
  });

  return (
    <Modal
      title="创建新角色"
      visible={showAddRoleLayer}
      onOk={run}
      onCancel={() => toggleAddRoleLayer(false)}
      cancelText={'取消'}
      okText={'确定'}
      width={'50%'}
    >
      <Form form={form} layout="vertical" labelAlign="left">
        <Form.Item
          label="角色名称"
          name="role_name"
          rules={[{ required: true, message: '角色名称不能为空' }]}
        >
          <Input
            autoComplete="off"
            onChange={(e) => setRoleName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="角色权限描述(可选)" name="role_desc">
          <Input
            autoComplete="off"
            onChange={(e) => setRoleDesc(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default addRoleLayer;
