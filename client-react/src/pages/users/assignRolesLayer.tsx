import React, { useEffect, useState } from 'react';
import { Modal, message, Checkbox, Tooltip } from 'antd';
import { useRequest } from 'umi';
import * as UserService from '@/services/users';
import * as RoleService from '@/services/roles';

const assignRolesLayer: React.FC<IAssignRolesLayerProps> = (props) => {
  const { showAssignLayer, refresh, toggleAssignLayer, currentUser } = props;
  const [allRoles, setAllRoles] = useState<IRoleItem[]>([]);
  const [roles, setRoles] = useState<number[]>([]);

  // 获取所有角色
  const { run: getAllRoles } = useRequest(RoleService.getRoles, {
    manual: true,
    onSuccess: (res: IResponse<IRoleItem[]>) => {
      res.success && setAllRoles(res.data);
    },
  });

  // 给用户分配角色
  const userId = currentUser ? currentUser.id : 0;
  const { run: assignUserRoles } = useRequest(
    UserService.assignUserRoles(userId, roles),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          toggleAssignLayer(false);
          message.success('角色分配成功');
          refresh();
          return;
        }
        message.error('角色分配失败:' + res.msg);
      },
    },
  );

  useEffect(() => {
    // 页面挂载后: 先获取所有角色, 如果已经请求过数据就不重复请求
    if (allRoles.length === 0) {
      getAllRoles();
    }

    // 获取当前用户已经有的角色id数组
    if (!showAssignLayer) {
      setAllRoles([]);
      return;
    }
    if (currentUser && currentUser.roles) {
      const roleIds: number[] = currentUser.roles.map((item: IRoleItem) => {
        return item.id;
      });
      setRoles(roleIds);
    }
  }, [showAssignLayer]);

  /**
   * 切换选中状态
   * @param e Event
   * @param row 当前被点击角色信息
   * @returns
   */
  const toggle = (e: any, row: IRoleItem) => {
    // 取消选中
    if (!e.target.checked) {
      const checkedIds = roles.filter((item) => item !== row.id);
      setRoles(checkedIds);
      return;
    }

    // 选中
    if (!roles.includes(row.id)) {
      roles.push(row.id);
      setRoles(roles);
      return;
    }
  };

  return (
    <Modal
      title="分配角色"
      visible={showAssignLayer}
      onOk={assignUserRoles}
      onCancel={() => toggleAssignLayer(false)}
      cancelText={'取消'}
      okText={'确定'}
      width={'50%'}
    >
      {
        /* 渲染角色列表 checkbox: 已经拥有的(roles)选中 */
        allRoles.map((item: any) => (
          <Checkbox
            key={item.id}
            defaultChecked={roles.includes(item.id)}
            onChange={(e) => toggle(e, item)}
          >
            <Tooltip title={item.role_desc} color="blue">
              {item.role_name}
            </Tooltip>
          </Checkbox>
        ))
      }
    </Modal>
  );
};

export default assignRolesLayer;
