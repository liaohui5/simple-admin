/**
 * 格式化时间
 * @param {*} str 
 */
export const datetime = str => {
  const date = new Date(str);
  const y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    i = date.getMinutes(),
    s = date.getSeconds();
  return `${y}/${m}/${d} ${h}:${i}:${s}`;
};
