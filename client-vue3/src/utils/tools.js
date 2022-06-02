/**
 * 使用对象映射key+修改对象引用来生成树形数据
 * @param {Array} data
 * @param {Object} option
 * @param {Number|String} option.root
 * @param {String} option.id
 * @param {String} option.pid
 * @param {String} option.children
 * @returns {Array}
 */
export const getTree = function (data, option) {
  const options = Object.assign(
    {
      root: 0,
      id: "id",
      pid: "pid",
      children: "children",
    },
    option
  );

  // 创建一个新的数据, 避免污染外界的参数
  const source = JSON.parse(JSON.stringify(data));
  const { root, id, pid, children } = options;
  const dataMap = {};
  const res = [];

  let itemId, itemPid;
  for (let item of source) {
    itemId = item[id];
    itemPid = item[pid];

    if (!dataMap[itemId]) {
      // => {[item.id]: item}
      dataMap[itemId] = item;
    }

    if (itemPid === root) {
      // 顶级类
      res.push(item);
      continue;
    }

    // --- 处理非顶级类
    if (!dataMap[itemPid]) {
      // 没有顶级类的二级类(一般是脏数据)
      dataMap[itemPid] = {};
    }

    if (!dataMap[itemPid][children]) {
      // 没有children, 确保后面添加childre的时候不会报错
      dataMap[itemPid][children] = [];
    }

    dataMap[itemPid][children].push(item);
  }

  return res;
};
