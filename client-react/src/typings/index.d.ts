// 多处用到, 直接声明, 简写类型
type numstr = number | string;
type toggleVisibleFunction = (show: boolean) => void;

// redux dispatch action
type ReduxDispatchAction = {
  type: string;
  payload?: any;
};

// redux dispatch
type ReduxDispatch = (action: ReduxDispatchAction) => void;
