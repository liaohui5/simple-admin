import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, Popconfirm, message } from 'antd';
import { useRequest } from 'umi';
import * as RoleService from '@/services/roles';
import ContentContainer from '@/components/ContentContainer';
import EditRoleLayer from '@/pages/roles/editRoleLayer';
import AddRoleLayer from '@/pages/roles/addRoleLayer';
import AssignPermissions from '@/pages/roles/assignPermissions';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<IRoleItem[]>([]);
  const [currentRole, setCurrentRole] = useState<IRoleItem>();
  const [showEditRoleLayer, toggleEditRoleLayer] = useState<boolean>(false);
  const [showAddRoleLayer, toggleAddRoleLayer] = useState<boolean>(false);
  const [showAssignLayer, toggleAssignLayer] = useState<boolean>(false);

  // 获取所有角色请求
  const { run: getRoles } = useRequest(RoleService.getRoles, {
    manual: true,
    onSuccess: (res: IResponse<IRoleItem[]>) => {
      res.success && setRoles(res.data);
    },
  });

  // 删除角色请求
  const roleId: number = currentRole ? currentRole.id : 0;
  const { run: sendDeleteRoleRequest } = useRequest(
    RoleService.deleteRoleById(roleId),
    {
      manual: true,
      onSuccess: (res: IBaseResponse) => {
        if (res.success) {
          message.success('删除成功');
          getRoles();
          return;
        }
        message.success('删除失败:' + res.msg);
      },
    },
  );

  useEffect(() => {
    roles.length === 0 && getRoles();
  }, []);

  // 显示修改角色信息弹窗
  const showEditRole = async (row: IRoleItem) => {
    await setCurrentRole(row);
    toggleEditRoleLayer(true);
  };

  // 显示分配权限信息弹窗
  const showAssign = async (row: IRoleItem) => {
    await setCurrentRole(row);
    toggleAssignLayer(true);
  };

  // 确认删除角色
  const confirmDelete = async (row: IRoleItem) => {
    await setCurrentRole(row);
    sendDeleteRoleRequest();
  };

  return (
    <>
      {
        <>
          {
            /* 创建角色信息 */
            <AddRoleLayer
              {...{
                showAddRoleLayer,
                toggleAddRoleLayer,
                refresh: getRoles,
              }}
            />
          }
          {
            /* 编辑角色信息 */
            showEditRoleLayer && currentRole && (
              <EditRoleLayer
                {...{
                  showEditRoleLayer,
                  toggleEditRoleLayer,
                  currentRole,
                  refresh: getRoles,
                }}
              />
            )
          }
          {
            /* 分配角色权限 */
            showAssignLayer && currentRole && (
              <AssignPermissions
                {...{
                  currentRole,
                  showAssignLayer,
                  toggleAssignLayer,
                  refresh: getRoles,
                }}
              />
            )
          }
        </>
      }
      <ContentContainer title="权限管理" title2="角色管理">
        <div>
          <Button type="primary" onClick={() => toggleAddRoleLayer(true)}>
            添加角色
          </Button>
        </div>
        <div className="table-wrapper">
          <Table
            dataSource={roles}
            bordered
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            rowKey={(item) => item.id}
          >
            <Table.Column title="角色ID" dataIndex="id" key="id" />
            <Table.Column
              title="角色名称"
              dataIndex="role_name"
              key="role_name"
            />
            <Table.Column
              title="角色权限描述"
              dataIndex="role_desc"
              key="role_desc"
            />
            <Table.Column
              title="角色拥有的权限"
              dataIndex="permissions"
              key="permissions"
              render={(pers: any) =>
                pers.map((item: any, i: number) => {
                  const color = i % 2 === 0 ? 'blue' : 'success';
                  return (
                    <Tag
                      color={color}
                      key={item.id}
                      style={{ marginBottom: 8 }}
                    >
                      {item.desc}
                    </Tag>
                  );
                })
              }
            />

            <Table.Column
              title="操作"
              width="270px"
              render={(row) => (
                <div className="table-btns">
                  <Button
                    type="primary"
                    ghost
                    onClick={() => showEditRole(row)}
                  >
                    修改
                  </Button>
                  <Button type="primary" onClick={() => showAssign(row)}>
                    分配权限
                  </Button>
                  <Popconfirm
                    placement="bottom"
                    title="删除这个角色可能会影响其他人的权限,确定要删除这个角色吗?"
                    onConfirm={() => confirmDelete(row)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger>删除</Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </div>
      </ContentContainer>
    </>
  );
};

export default Roles;
