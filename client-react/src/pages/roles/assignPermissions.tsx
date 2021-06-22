import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Tree, message, Tag } from 'antd';
import { useRequest } from 'umi';
import * as RoleService from '@/services/roles';
import * as PermissionService from '@/services/permissions';

const assignPermissions: React.FC<IAssignPermissionsProps> = (props) => {
  const { showAssignLayer, toggleAssignLayer, currentRole, refresh } = props;

  const [pids, setPids] = useState<number[]>([]); // 拥有的权限ID
  const [permsTree, setPermsTree] = useState<IPermissionTreeItem[]>([]);

  /**
   * 将属性结构的数据的key修改为antd的tree组件需要的格式
   * @param tree
   * @returns
   */
  const treeDataGenerator = useCallback((tree = []) => {
    let node: any;
    for (let i = 0, l = tree.length; i < l; i++) {
      node = tree[i];
      node.key = node.id;
      node.title = node.desc;
      node.checkable = true;
      node.children && treeDataGenerator(node.children);
    }
    return tree;
  }, []);

  // 获取所有权限数据(树型结构)
  const { run: getPermsTree } = useRequest(
    PermissionService.getPermissionTree,
    {
      manual: true,
      onSuccess: (res: IResponse<IPermissionTreeItem[]>) => {
        res.success && setPermsTree(treeDataGenerator(res.data));
      },
    },
  );

  // 分配权限
  const curRoleId = currentRole ? currentRole.id : 0;
  const { run: assignPerms } = useRequest(
    RoleService.assignPermissions(curRoleId, pids),
    {
      manual: true,
      onSuccess: (res: IBaseResponse) => {
        if (res.success) {
          message.success('权限分配成功');
          toggleAssignLayer(false);
          refresh();
          return;
        }
        message.error('权限分配失败:' + res.msg);
      },
    },
  );

  useEffect(() => {
    // 页面挂载后: 获取权限数据
    if (permsTree.length === 0) {
      getPermsTree();
    }

    // 初始化已经当前角色已经拥有的权限ID
    if (currentRole && currentRole.permissions) {
      const ids = currentRole.permissions.map((item: any) => item.id);
      setPids(ids);
    }
  }, [showAssignLayer]);

  return (
    <Modal
      title="给角色分配权限"
      visible={showAssignLayer}
      onOk={assignPerms}
      onCancel={() => toggleAssignLayer(false)}
      cancelText={'取消'}
      okText={'确定'}
      width={'50%'}
    >
      {
        // 有数据才渲染
        permsTree.length > 0 && (
          <Tree
            draggable={false}
            selectable={false}
            checkable={true}
            blockNode={true}
            autoExpandParent={true}
            defaultExpandAll={true}
            defaultCheckedKeys={pids}
            treeData={permsTree}
            onCheck={(checkedKeys: number[]) => setPids(checkedKeys)}
            titleRender={(row: any) => {
              return (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{row.title}</span>
                  {row.pid === 0 && (
                    <Tag color="blue">
                      {row.type === 0 ? '路由权限' : 'API权限'}
                    </Tag>
                  )}
                </div>
              );
            }}
          />
        )
      }
    </Modal>
  );
};

export default assignPermissions;
