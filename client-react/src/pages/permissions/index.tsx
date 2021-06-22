import React, { useState, useEffect } from 'react';
import { useRequest } from 'umi';
import { Popconfirm, Tag, Table, Button, Input, Select, message } from 'antd';
import ContentContainer from '@/components/ContentContainer';
import styles from '@/assets/less/common.less';
import AddPermLayer from '@/pages/permissions/addPermLayer';
import EditPermLayer from '@/pages/permissions/editPermLayer';
import * as PermService from '@/services/permissions';

const Permissions: React.FC = () => {
  const [response, setResponse] = useState({ count: 0, rows: [] });
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [type, setType] = useState<numstr>('');
  const [content, setContent] = useState<string>('');
  const [showAddPermLayer, toggleAddPermLayer] = useState<boolean>(false);
  const [statusParams, setStatusParams] = useState<IUpdateStatusParams>({
    status: 0,
    id: 0,
  });
  const [currentPerm, setCurrentPerm] = useState<IPermissionItem>();
  const [showEditLayer, toggleEditLayer] = useState<boolean>(false);

  // 处理获取数据的参数
  const getParams = (): ISearchParams => {
    const params: ISearchParams = { page, size };
    if (typeof type === 'number' && content) {
      params.type = type;
      params.desc = content;
    }
    return params;
  };

  // 获取权限列表数据
  const { run: getPermissions } = useRequest(
    PermService.getPermissions(getParams()),
    {
      manual: true,
      onSuccess: (res) => res.success && setResponse(res.data),
    },
  );

  // 锁定/解锁权限
  const { run: togglePermStatus } = useRequest(
    PermService.updatePermStatus(statusParams),
    {
      manual: true,
      onSuccess: (res: IBaseResponse) => {
        if (res.success) {
          message.success('操作成功');
          getPermissions();
          return;
        }
        message.success('操作失败' + res.msg);
      },
    },
  );

  // 删除权限
  const delPermId = currentPerm ? currentPerm.id : 0;
  const { run: deletePermission } = useRequest(
    PermService.deletePermById(delPermId),
    {
      manual: true,
      onSuccess: (res: IBaseResponse) => {
        if (res.success) {
          message.success('删除成功');
          getPermissions();
          return;
        }
        message.error('删除失败' + res.msg);
      },
    },
  );

  useEffect(() => {
    if (response.rows.length === 0 && typeof getPermissions === 'function') {
      getPermissions();
    }
  }, []);

  /**
   * 搜索
   */
  const handleSearch = () => {
    if (typeof type !== 'number') {
      message.info('请选择搜索的类型');
      return;
    }
    if (!content) {
      message.info('请输入搜索的内容');
      return;
    }
    getPermissions();
  };

  /**
   * 页面切换
   * @param page 当前页
   * @param size 每页多少条
   */
  const handlePageChange = async (page: number, size: number) => {
    await setPage(page);
    await setSize(size);
    getPermissions();
  };

  /**
   * 重置
   */
  const handleReset = async () => {
    await setPage(1);
    await setSize(10);
    await setType('');
    await setContent('');
    getPermissions();
  };

  /**
   * 修改权限状态
   * @param id 权限ID
   * @param status 权限状态(0:解锁 1:锁定)
   */
  const updatePermissionsStatus = async (id: number, status: number) => {
    await setStatusParams({ id, status });
    togglePermStatus();
  };

  /**
   * 删除权限
   * @param row 当前权限
   */
  const confirmDelete = async (row: IPermissionItem) => {
    await setCurrentPerm(row);
    deletePermission();
  };

  /**
   * 修改当前权限
   * @param row 当前权限
   */
  const showEditWindow = async (row: IPermissionItem) => {
    await setCurrentPerm(row);
    toggleEditLayer(true);
  };

  const l = (...args: any) => {
    console.info(args);
  };

  return (
    <>
      {showEditLayer && currentPerm && (
        <EditPermLayer
          {...{
            showEditLayer,
            toggleEditLayer,
            currentPerm,
            refresh: getPermissions,
          }}
        />
      )}
      {
        <AddPermLayer
          {...{
            showAddPermLayer,
            toggleAddPermLayer,
            refresh: getPermissions,
          }}
        />
      }
      <ContentContainer title={'用户管理'} title2={'用户列表'}>
        {/* 搜索 */}
        <Input.Group>
          <div className={styles.search_bar}>
            <div className={styles.left}>
              <Select
                className={styles.select}
                value={type}
                onChange={(val) => setType(val)}
                placeholder="权限类型"
              >
                <Select.Option value={0}>路由权限</Select.Option>
                <Select.Option value={1}>API权限</Select.Option>
              </Select>
              <div className={styles.input}>
                <Input
                  placeholder="请输入搜索内容"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className={styles.btns}>
                <Button type="primary" onClick={handleSearch}>
                  搜索
                </Button>
                <Button danger onClick={handleReset}>
                  重置
                </Button>
              </div>
            </div>
            <Button type="primary" onClick={() => toggleAddPermLayer(true)}>
              添加权限
            </Button>
          </div>
        </Input.Group>

        {/* 表格数据展示 */}
        <div className="table-wrapper">
          <Table
            bordered
            dataSource={response.rows}
            rowKey={(item: IPermissionItem) => item.id}
            pagination={{
              total: response.count,
              pageSize: size,
              top: 'none',
              bottom: 'bottomRight',
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
              hideOnSinglePage: true,
            }}
          >
            <Table.Column title="ID" dataIndex="id" key="id" />
            <Table.Column
              title="ID"
              dataIndex="id"
              key="id"
              render={({ type }: IPermissionItem) =>
                type === 0 ? '路由权限' : 'API权限'
              }
            />
            <Table.Column title="权限描述" dataIndex="desc" key="desc" />
            <Table.Column title="权限路径" dataIndex="path" key="path" />
            <Table.Column
              title="权限方法(API权限)"
              dataIndex="method"
              key="method"
            />
            <Table.Column title="父级权限ID" dataIndex="pid" key="pid" />
            <Table.Column
              title="状态"
              dataIndex="status"
              key="status"
              render={({ status }: IPermissionItem) => {
                if (status === 0) {
                  return <Tag color="blue">正常</Tag>;
                } else {
                  return <Tag color="red">锁定</Tag>;
                }
              }}
            />
            <Table.Column
              title="操作"
              width="300px"
              render={(row: IPermissionItem) => (
                <div className="table-btns">
                  <Button type="primary" onClick={() => showEditWindow(row)}>
                    修改
                  </Button>
                  <Popconfirm
                    placement="bottom"
                    title="删除这个权限可能会导致有些功能异常,确定要删除吗?"
                    onConfirm={() => confirmDelete(row)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger>删除</Button>
                  </Popconfirm>
                  {/* 锁定: status->1 解锁: status->0 */}
                  {row.status === 0 ? (
                    <Button
                      danger
                      onClick={() => updatePermissionsStatus(row.id, 1)}
                    >
                      锁定
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      ghost
                      onClick={() => updatePermissionsStatus(row.id, 0)}
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

export default Permissions;
