// 所有组件的 props 接口约束

interface IContentContainerProps {
  title: string;
  title2: string;
}

interface ILayoutsProps {
  authUser?: IAuthUser;
  location: Location;
  logout: () => void;
}

interface ILoginProps {
  login: (params: IAuthUser) => void;
}

interface IUpdateUserInfoLayerProps {
  showUpdateLayer: boolean;
  currentUser: IUserItem;
  toggleUpdateLayer: toggleVisibleFunction;
  refresh: () => void;
}

interface IAssignRolesLayerProps {
  showAssignLayer: boolean;
  currentUser: IUserItem;
  refresh: () => void;
  toggleAssignLayer: toggleVisibleFunction;
}

interface IAddUserLayerProps {
  showAddUserLayer: boolean;
  toggleAddUserLayer: toggleVisibleFunction;
  refresh: () => void;
}

interface IAddRoleLayerProps {
  showAddRoleLayer: boolean;
  toggleAddRoleLayer: toggleVisibleFunction;
  refresh: () => void;
}

interface IAssignPermissionsProps {
  showAssignLayer: boolean;
  toggleAssignLayer: toggleVisibleFunction;
  currentRole: IRoleItem;
  refresh: () => void;
}

interface IEditRoleLayerProps {
  showEditRoleLayer: boolean;
  toggleEditRoleLayer: toggleVisibleFunction;
  currentRole: IRoleItem;
  refresh: () => void;
}

interface IAddPermLayerProps {
  showAddPermLayer: boolean;
  toggleAddPermLayer: toggleVisibleFunction;
  refresh: () => void;
}

interface IEditPermLayerProps {
  currentPerm: IPermissionItem;
  showEditLayer: boolean;
  toggleEditLayer: toggleVisibleFunction;
  refresh: () => void;
}
