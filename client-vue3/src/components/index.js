// 注册全局组件
import breadcrumb from "@/components/breadcrumb.vue";

function registerGlobalComponents(app) {
  const globalComponents = [
    breadcrumb,
  ];

  for (const item of globalComponents) {
    app.component(item.name, item);
  }
}


export default registerGlobalComponents;
