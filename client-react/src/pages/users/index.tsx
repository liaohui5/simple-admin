import React, { useState, useEffect } from 'react';
import { useRequest } from 'umi';
import { Tag, Table, Button, Input, Select, message } from 'antd';
import ContentContainer from '@/components/ContentContainer';
import UpdateUserInfoLayer from '@/pages/users/updateUserInfoLayer';
import AddUserLayer from '@/pages/users/addUserLayer';
import AssignRolesLayer from '@/pages/users/assignRolesLayer';
import * as UserService from '@/services/users';
import styles from '@/assets/less/common.less';

const Users: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [type, setType] = useState<numstr>(0);
  const [content, setContent] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<IUserItem>();
  const [showUpdateLayer, toggleUpdateLayer] = useState<boolean>(false);
  const [showAddUserLayer, toggleAddUserLayer] = useState<boolean>(false);
  const [showAssignLayer, toggleAssignLayer] = useState<boolean>(false);
  const [response, setResponse] = useState<IPaginationResponseData<IUserItem>>({
    count: 0,
    rows: [],
  });
  const [
    updateStatusParams,
    setUpdateStatusParams,
  ] = useState<IUpdateStatusParams>({
    status: 0,
    id: 0,
  });

  /**
   * 处理获取数据的参数
   */
  const getParams = (): ISearchParams => {
    const params: ISearchParams = { page, size };
    if (type && content) {
      params.type = type;
      params.content = content;
    }
    return params;
  };

  // 获取用户信息列表
  const { run: getUsers } = useRequest(UserService.getUsers(getParams()), {
    manual: true,
    debounceInterval: 500,
    onSuccess: (res: IPaginationResponse<IUserItem>) => {
      res.success && setResponse(res.data);
    },
  });

  // 修改用户状态(0: 正常 1:锁定, 锁定后无法登陆)
  const { run: updateUserStatus } = useRequest(
    UserService.updateUserStatus(updateStatusParams),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          message.success('修改成功');
          getUsers();
          return;
        }
        message.success('修改失败:' + res.msg);
      },
    },
  );

  useEffect(() => {
    response.rows.length === 0 && getUsers();
  }, []);

  /**
   * 搜索
   */
  const search = () => {
    if (!type) {
      message.info('请选择搜索的类型');
      return;
    }
    if (!content) {
      message.info('请输入搜索的内容');
      return;
    }
    getUsers();
  };

  /**
   * 页面切换
   * @param page 当前页
   * @param size 每页多少条
   */
  const onPageChange = async (page: number, size: number) => {
    await setPage(page);
    await setSize(size);
    getUsers();
  };

  /**
   * 重置
   */
  const reset = async () => {
    await setPage(1);
    await setSize(10);
    await setType('');
    await setContent('');
    getUsers();
  };

  /**
   * 显示修改用户信息弹窗
   * @param user
   */
  const showUpdateUser = async (user: IUserItem) => {
    await setCurrentUser(user);
    toggleUpdateLayer(true);
  };

  /**
   * 显示分配用户角色弹窗
   * @param user
   */
  const showAssignRolesLayer = async (user: IUserItem) => {
    await setCurrentUser(user);
    toggleAssignLayer(true);
  };

  /**
   * 修改用户状态
   * @param id 当前用户ID
   * @param status 修改的状态
   */
  const updateStatus = async (id: number, status: number) => {
    await setUpdateStatusParams({ id, status });
    updateUserStatus();
  };

  return (
    <>
      {/* 添加用户信息 */}
      <AddUserLayer
        {...{
          showAddUserLayer,
          toggleAddUserLayer,
          refresh: getUsers,
        }}
      />

      {/* 更新用户信息 */}
      {showUpdateLayer && (
        <UpdateUserInfoLayer
          {...{
            showUpdateLayer,
            toggleUpdateLayer,
            currentUser,
            refresh: getUsers,
          }}
        />
      )}

      {/* 分配用户角色 */}
      <AssignRolesLayer
        {...{
          showAssignLayer,
          toggleAssignLayer,
          currentUser,
          refresh: getUsers,
        }}
      />

      <ContentContainer title={'用户管理'} title2={'用户列表'}>
        {/* 搜索 */}
        <Input.Group>
          <div className={styles.search_bar}>
            <div className={styles.left}>
              <Select
                className={styles.select}
                value={type}
                onChange={(val: number) => setType(val)}
                placeholder="请选择搜索内容"
              >
                <Select.Option value={1}>用户ID</Select.Option>
                <Select.Option value={2}>用户名</Select.Option>
                <Select.Option value={3}>用户邮箱</Select.Option>
              </Select>
              <div className={styles.input}>
                <Input
                  placeholder="请输入搜索内容"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className={styles.btns}>
                <Button type="primary" onClick={search}>
                  搜索
                </Button>
                <Button danger onClick={reset}>
                  重置
                </Button>
              </div>
            </div>
            <Button type="primary" onClick={() => toggleAddUserLayer(true)}>
              添加用户
            </Button>
          </div>
        </Input.Group>

        {/* 表格数据展示 */}
        <div className="table-wrapper">
          <Table
            bordered
            dataSource={response.rows}
            rowKey={(item) => item.id}
            pagination={{
              total: response.count,
              pageSize: size,
              top: 'none',
              bottom: 'bottomRight',
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: onPageChange,
              onShowSizeChange: onPageChange,
              hideOnSinglePage: true,
            }}
          >
            <Table.Column title="ID" dataIndex="id" key="userid" />
            <Table.Column title="用户名" dataIndex="username" key="username" />
            <Table.Column title="邮箱" dataIndex="email" key="email" />
            {/* TODO: 如果图片加载失败, onerror 处理 */}
            <Table.Column
              title="头像"
              dataIndex="avatar"
              key="avatar"
              width={40}
              render={(avatar) =>
                avatar && (
                  <img
                    src={avatar}
                    style={{ maxWidth: 40, borderRadius: '50%' }}
                  />
                )
              }
            />
            <Table.Column
              title="角色"
              dataIndex="roles"
              key="roles"
              render={(roles) => {
                return roles.map((role) => (
                  <Tag color="blue" key={role.id}>
                    {role.role_name}
                  </Tag>
                ));
              }}
            />
            <Table.Column
              title="状态"
              dataIndex="status"
              key="status"
              render={(status) => {
                if (status === 0) {
                  return <Tag color="blue">正常</Tag>;
                } else {
                  return <Tag color="red">锁定</Tag>;
                }
              }}
            />
            <Table.Column
              title="创建时间"
              dataIndex="created_at"
              key="created_at"
              render={(time: numstr): string => {
                const date = new Date(time);
                const y = date.getFullYear();
                let m: numstr = date.getMonth() + 1;
                m = m < 10 ? `0${m}` : m;
                let d: numstr = date.getDate();
                d = d < 10 ? `0${d}` : d;
                let h: numstr = date.getHours();
                h = h < 10 ? `0${h}` : h;
                let i: numstr = date.getMinutes();
                i = i < 10 ? `0${i}` : i;
                return `${y}-${m}-${d} ${h}:${i}`;
              }}
            />

            <Table.Column
              title="操作"
              width="300px"
              render={(row) => (
                <div className="table-btns">
                  <Button onClick={() => showUpdateUser(row)}>修改信息</Button>
                  <Button
                    type="primary"
                    onClick={() => showAssignRolesLayer(row)}
                  >
                    分配角色
                  </Button>
                  {/* 锁定: status->1 解锁: status->0 */}
                  {row.status === 0 ? (
                    <Button danger onClick={() => updateStatus(row.id, 1)}>
                      锁定
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      ghost
                      onClick={() => updateStatus(row.id, 0)}
                    >
                      解锁
                    </Button>
                  )}
                </div>
              )}
            />
          </Table>
        </div>
      </ContentContainer>
    </>
  );
};

export default Users;
