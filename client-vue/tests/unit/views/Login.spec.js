"use strict";

import ElementUI from "element-ui";
import { createLocalVue, mount } from "@vue/test-utils";

import Login from "@/views/Login.vue";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("登录页面", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Login, {
      localVue,
    });
  });

  it("登录页有两个输入框 输入邮箱 & 密码", () => {
    const components = wrapper.findAllComponents(ElementUI.Input);
    expect(components.exists()).toBeTruthy();
    expect(components).toHaveLength(2);
  });

  it("登录页有一个提交按钮",  async() => {
    const btn = wrapper.find('button');
    console.log('%c 🍞 btn: ', 'font-size:20px;background-color: #B03734;color:#fff;', btn);
    expect(btn.exists()).toBeTruthy();
    await btn.trigger('click');
  });

  // it("当登陆页面按钮被点击时, 如果内容为空就不能提交数据",  () => {
  //   const btn = wrapper.findComponent(ElementUI.Button);
  // });

  // it("当登陆页面按钮被点击时, 如果内容不为空就提交数据", async () => {
  //   const btn = wrapper.findComponent(ElementUI.Button);
  // });
});
