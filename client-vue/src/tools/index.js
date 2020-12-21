/**
 * 无限分类(将线性数据转成树形数据)
 * @param {Array} data
 * @returns {Array}
 */
export const getTree = data => {
  const cloneDatas = JSON.parse(JSON.stringify(data));
  return cloneDatas.filter(root => {
    const children = cloneDatas.filter(child => root.id === child.pid);
    if (children.length > 0) {
      root.children = children;
    }
    return root.pid === 0;
  });
};
