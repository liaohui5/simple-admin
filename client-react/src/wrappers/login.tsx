import React from 'react';
import { Redirect } from 'umi';

const CheckLogin: React.FC = (props) => {
  const authUser = window.localStorage.getItem('auth-user');
  return authUser ? <>{props.children}</> : <Redirect to="/login" />;
};

export default CheckLogin;
