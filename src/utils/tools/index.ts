import { isObject } from '@vueuse/core';

/**
 * @description: 过滤空字符串
 * @param {*} obj
 * @return {*}
 */
export function removeEmptyStringFields(obj: any) {
  for (const key in obj) {
    if (isObject(obj[key])) {
      obj[key] = removeEmptyStringFields(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        Reflect.deleteProperty(obj, key);
      }
    } else if (!obj[key]) {
      Reflect.deleteProperty(obj, key);
    }
  }
  return obj;
}
