import React, { useState } from 'react';
import { useRequest } from 'umi';
import { Modal, Form, Input, message } from 'antd';
import * as RoleService from '@/services/roles';

const editRoleLayer: React.FC<IEditRoleLayerProps> = (props: any) => {
  const {
    showEditRoleLayer,
    toggleEditRoleLayer,
    currentRole,
    refresh,
  } = props;

  const [role_name, setRoleName] = useState(currentRole.role_name);
  const [role_desc, setRoleDesc] = useState(currentRole.role_desc);
  const [form] = Form.useForm();

  // 修改角色信息
  const roleId = currentRole ? currentRole.id : 0;
  const { run } = useRequest(
    RoleService.updateRole(roleId, { role_name, role_desc }),
    {
      manual: true,
      onSuccess: (res: IBaseResponse) => {
        if (res.success) {
          message.success('修改成功');
          toggleEditRoleLayer(false);
          refresh();
          return;
        }
        message.error('修改失败:' + res.msg);
      },
    },
  );

  return (
    <Modal
      title="修改角色信息"
      visible={showEditRoleLayer}
      onOk={run}
      onCancel={() => toggleEditRoleLayer(false)}
      cancelText={'取消'}
      okText={'确定'}
      width={'50%'}
    >
      <Form
        form={form}
        initialValues={currentRole}
        layout="vertical"
        labelAlign="left"
      >
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

export default editRoleLayer;
