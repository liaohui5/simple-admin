import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import { Layout, Button, Menu } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

/**
 * 无限分类(将线性数据转成树形数据)
 * @param {Array} data
 * @returns {Array}
 */
const getTree = (data = []) => {
  const cloneDatas = JSON.parse(JSON.stringify(data));
  return cloneDatas.filter((root) => {
    const children = cloneDatas.filter((child) => root.id === child.pid);
    if (children.length > 0) {
      root.children = children;
    }
    return root.pid === 0;
  });
};

/**
 * 布局组件
 * @param props
 * @returns
 */
const Layouts: React.FC<ILayoutsProps> = (props) => {
  const [authUser, setAuthUser] = useState<IAuthUser | object>({});
  const [menus, setMenus] = useState<Array<IMenuItem>>([]);

  // 等数据都加载完: 更新侧边栏菜单
  // 因为用的是:redux-persist 这个插件来同步dva model 中的数据到本地
  // 所以在 onload 完成的时候, props 中才有 authUser, 如果直接写在
  // useEffect 中,第一次执行的时候, 本地的数据 authUser 还没有同步到
  // model 中, 第一次执行的时候就会报错
  window.onload = () => setAuthUser(props.authUser);
  useEffect(() => {
    props.authUser && setMenus(getTree(props.authUser.permissions));
  }, [authUser]);

  // 跳转到指定位置
  const toPage = (path: string, pid: string | number) => {
    props.history.push(`${path}?openmenuid=${pid}`);
  };

  return (
    <Layout className={styles.layouts_container}>
      <Header className={styles.header}>
        <div className={styles.logo}>Admin</div>
        <div className={styles.menus}>
          <li className={styles.menu_item}>{authUser.username}</li>
          <li className={styles.menu_item}>
            <img className={styles.avatar} src={authUser.avatar} />
          </li>
          <li className={styles.menu_item}>
            <Button type="primary" danger onClick={() => props.logout()}>
              注销登录
            </Button>
          </li>
        </div>
      </Header>
      <Layout className={styles.main_container}>
        <Sider width={300} className="site-layout-background">
          <Menu
            theme="light"
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            defaultSelectedKeys={[props.location.pathname]}
            defaultOpenKeys={[props.location.query.openmenuid]}
          >
            <Menu.Item key="/" onClick={() => props.history.push('/')}>
              首页
            </Menu.Item>
            {menus.map((item: any) => {
              return (
                <SubMenu key={item.id} title={item.desc}>
                  {item.children.map((menu: any) => (
                    <Menu.Item
                      key={menu.path}
                      onClick={() => toPage(menu.path, item.id)}
                    >
                      {menu.desc}
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            })}
          </Menu>
        </Sider>
        <Content
          className={styles.content_wrapper}
          style={{ padding: 20, margin: 0 }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state: any) => {
  return {
    authUser: state.login.authUser,
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    logout: () => dispatch({ type: 'login/logout' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layouts);
