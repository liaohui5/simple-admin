import breadcrumb from "@/components/breadcrumb.vue";
import search from "@/components/search.vue";
import paginate from "@/components/paginate.vue";

/**
 * 注册全局组件
 * @param {*} app
 */
function registerGlobalComponents(app) {
  const globalComponents = [
    breadcrumb,
    search,
    paginate
  ];

  for (const item of globalComponents) {
    app.component(item.name, item);
  }
}

export default registerGlobalComponents;
