import * as React from 'react';
import { Breadcrumb, Card } from 'antd';

const ContentContainer: React.FC<IContentContainerProps> = (props) => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        {props.title && <Breadcrumb.Item>{props.title}</Breadcrumb.Item>}
        {props.title2 && <Breadcrumb.Item>{props.title2}</Breadcrumb.Item>}
      </Breadcrumb>
      <Card style={{ marginTop: 20 }}>{props.children}</Card>
    </>
  );
};

export default ContentContainer;
