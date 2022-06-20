import { reactive } from "vue";
import { ElMessage } from "element-plus";

/**
 * 搜索/重置/改变当前页/改变每页多少条数据自动调用 getData
 * @param {Function} getData
 * @returns {object: {params,onPageChange,onPageSizeChange,onSearch,onReset}}
 */
function usePaginteGetData(getData) {
  if (typeof getData !== "function") {
    throw new TypeError('the "getData" must be a function');
  }

  const raw = {
    type: "",
    content: "",
    page: 1,
    size: 10,
  };

  // 参数
  const params = reactive(raw);

  // 点击搜索按钮
  function onSearch(data) {
    const { type, content } = data;
    params.type = type;
    params.content = content;
    if (!params.type) {
      ElMessage.warning("请选择搜索类型");
      return;
    }
    if (!params.content) {
      ElMessage.warning("请选择搜索内容");
      return;
    }
    getData();
  }

  // 点击重置按钮
  function onReset() {
    Object.keys(raw).forEach((key) => {
      params[key] = raw[key];
    });
    getData(params);
  }

  // 改变当前页
  function onPageChange(page, callback = null) {
    params.page = page;
    getData(params);
    typeof callback === "function" && callback(params);
  }

  // 改变每页多少条数据
  function onPageSizeChange(pageSize, callback = null) {
    params.size = pageSize;
    getData(params);
    typeof callback === "function" && callback(params);
  }

  return {
    params,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onReset,
  };
}

export default usePaginteGetData;
