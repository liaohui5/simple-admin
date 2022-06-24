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

/**
 * 随机获取数组中的某一项目
 * @param {any[]} arr
 * @returns {number}
 */
export const randomInArray = (arr) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

/**
 * 获取随机渐变背景颜色
 * @returns {String}
 */
export function getRandomBgColor() {
  const dirs = ["left", "right", "top", "bottom"];
  const colors = ["#a8c0ff, #3f2b96", "#4e54c8, #8f94fb", "#355c7d, #6c5b7b, #c06c84", "#fc5c7d, #6a82fb", "#108dc7, #ef8e38"];
  const dir = randomInArray(dirs);
  const color = randomInArray(colors);
  return `linear-gradient(to ${dir}, ${color})`;
}

/**
 * 缓存获取数据的函数,不要每次都重新获取
 * @param {Function} fn
 * @param {Function} makeKey
 * @returns {any}
 */
export function memoize(fn, makeKey = JSON.stringify) {
  const mem = async function (...args) {
    const key = makeKey(args);
    const cache = mem.cache;
    if (!cache.has(key)) {
      const res = await fn.apply(this, args);
      cache.set(key, res);
    }
    return cache.get(key);
  };
  mem.cache = new Map();
  return mem;
}
