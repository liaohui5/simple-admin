import React, { useState, useRef } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { useRequest } from 'umi';
import EventEmitter from 'events';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';
import * as UserService from '@/services/users';

const eventMgr = new EventEmitter();

const addUserLayer: React.FC<IAddUserLayerProps> = (props) => {
  const { showAddUserLayer, toggleAddUserLayer, refresh } = props;
  const [username, setUsername] = useState<string>('');
  const [email, setEamil] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [url, setURL] = useState<string>('');
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [form] = Form.useForm();
  const cropperRef = useRef<HTMLImageElement>(null);

  /**
   * 图片上传之前的处理(裁剪图片)
   * @param file
   * @returns
   */
  const beforeUpload = (file: File) => {
    setURL(URL.createObjectURL(file));
    setShowCropper(true);
    return new Promise((resolve, reject) => {
      eventMgr.on('croperror', (msg) => {
        setShowCropper(false);
        message.error('裁剪失败, 取消上传');
        reject(msg);
      });
      eventMgr.on('cropend', (blob) => {
        setShowCropper(false);
        message.success('裁剪成功, 文件正在上传');
        resolve(blob);
      });
    });
  };

  /**
   * 裁剪图片(裁剪成功后, 通知上传)
   * @returns
   */
  const cropImage = (): void => {
    const cropper: any = cropperRef?.current?.cropper;
    if (!cropper) {
      eventMgr.emit('croperror', '裁剪失败: cropper ref 获取失败');
      return;
    }

    const onCroped = (blob: any) => eventMgr.emit('cropend', blob);
    cropper.getCroppedCanvas().toBlob(onCroped, 'image/jpeg', 1);
  };

  /**
   * 上传中、完成、失败都会调用这个函数(状态: status)
   * @docs https://ant.design/components/upload-cn/#onChange
   * @param param0
   */
  const onFileChange = ({ file: { status, response } }: any): void => {
    if (status === 'done') {
      message.success('头像上传成功!');
      setAvatar(response.data.url);
      return;
    }

    if (status === 'error') {
      message.error('头像上传失败!');
      return;
    }
  };

  /**
   * 获取请求的参数
   * @returns
   */
  const getParams = (): ICreateUserItem => {
    const data: ICreateUserItem = { username, password, email };
    if (avatar) data.avatar = avatar;
    return data;
  };

  // 添加用户信息
  const { run: createUser } = useRequest(UserService.createUser(getParams()), {
    manual: true,
    onSuccess: (res: IBaseResponse) => {
      if (res.success) {
        message.success('用户添加成功');
        toggleAddUserLayer(false);
        refresh();
        return;
      }
      message.error('用户添加成功:' + res.msg);
    },
  });

  // 表单字段检查规则
  const checkRules = {
    username: [
      {
        validator: (_: any, val: string) => {
          if (!val) return Promise.reject('用户名不能为空');
          if (val.length < 1 || val.length > 8) {
            return Promise.reject('用户名只能1-8位字符');
          }
          return Promise.resolve();
        },
      },
    ],
    email: [
      {
        validator: (_: any, value: string) => {
          if (!value) return Promise.reject('请填写邮箱地址');
          const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!emailReg.test(value)) {
            return Promise.reject('邮箱格式有误');
          }
          return Promise.resolve();
        },
      },
    ],
    password: [
      {
        validator: (_: any, val: string) => {
          if (!val) {
            return Promise.reject('密码不能为空');
          }
          const passwordReg = /^[a-z0-9_-]{6,18}$/i;
          if (!passwordReg.test(val)) {
            return Promise.reject('密码必须是6-18位字母,数字,下划线');
          }
        },
      },
    ],
    confirm: [
      {
        validator: (_: any, val: string) => {
          if (!val) {
            return Promise.reject('请确认您的密码');
          }
          const password = form.getFieldValue('password');
          if (val !== password) {
            return Promise.reject('两次密码不一致');
          }
          return Promise.resolve();
        },
      },
    ],
  };

  return (
    <>
      {showCropper && (
        <div className="cropper-wrapper">
          <Cropper
            className="cropper-cropper"
            src={url}
            aspectRatio={1}
            autoCrop={true}
            ref={cropperRef}
          />
          <div className="cropper-btns">
            <Button onClick={() => setShowCropper(false)}>取消</Button>
            <Button type="primary" onClick={cropImage}>
              确定
            </Button>
          </div>
        </div>
      )}
      <Modal
        title="添加用户信息"
        visible={showAddUserLayer}
        onOk={createUser}
        onCancel={() => toggleAddUserLayer(false)}
        cancelText={'取消'}
        okText={'确定'}
        width={'50%'}
      >
        <Form form={form} layout="vertical" labelAlign="left">
          <Form.Item label="用户名" name="username" rules={checkRules.username}>
            <Input
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={checkRules.email}>
            <Input
              autoComplete="off"
              onChange={(e) => setEamil(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={checkRules.password}>
            <Input
              autoComplete="off"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="确认密码" name="confirm" rules={checkRules.confirm}>
            <Input
              autoComplete="off"
              type="password"
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="头像(可选)">
            {/* avatarUploadURL 是一个环境变量 */}
            <Upload
              action={avatarUploadURL}
              beforeUpload={beforeUpload}
              onChange={onFileChange}
              accept="image/*"
              name="avatar"
              showUploadList={false}
              valuePropName="fileList"
              maxCount={1}
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <div className="upload-avatar">
                {avatar && <img src={avatar} />}
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default addUserLayer;
