import breadcrumb from "@/components/breadcrumb.vue";
import search from "@/components/search.vue";
import paginate from "@/components/paginate.vue";
import layer from "@/components/layer.vue";

/**
 * 注册全局组件
 * @param {*} app
 */
export function registerGlobalComponents(app) {
  const globalComponents = [
    breadcrumb,
    search,
    paginate,
    layer,
  ];

  for (const item of globalComponents) {
    app.component(item.name, item);
  }
}


