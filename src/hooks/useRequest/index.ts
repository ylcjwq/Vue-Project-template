import { stringifyQuery } from 'vue-router';
import { createFetch, isObject } from '@vueuse/core';
import { removeEmptyStringFields } from '@/utils/tools';
import type { LocationQueryRaw } from 'vue-router';
import type { MaybeRef, UseFetchReturn } from '@vueuse/core';

const whiteApis = ['/api/login', '/api/test']; // 接口白名单

const baseUrl = import.meta.env.VITE_BASE_URL;
const useRequest = createFetch({
  baseUrl,
  options: {
    immediate: true,
    timeout: 10000,
    beforeFetch({ options, cancel, url }) {
      const token = useStorage('RFR_Token', '');

      if (!whiteApis.find((item) => url.includes(item)) && !token.value) {
        ElMessage.warning('未登录');
        cancel();
      }

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token.value}`,
      };

      return { options };
    },
    afterFetch({ data, response }) {
      // 如果是Blob响应，直接返回
      if (data instanceof Blob) {
        return { data, response };
      }

      const code = data.code || data.Code;
      const message = data.message || data.Message;

      // NOTE: 拦截返回，需要根据具体返回修改
      if (code === 200) {
        return { data, response };
      } else {
        console.log(message, '出现未全局拦截错误');
        ElMessage.error(message || '请求错误');
        data = null;
      }

      return { data, response };
    },
    onFetchError({ data, error, response }) {
      console.log(data, error, response);

      const status = response?.status;

      if (status === 401) {
        ElMessage.warning('登录已经过期');
        data = null;
        return { data, error };
      } else if (status === 500) {
        ElMessage.error('服务器错误');
        data = null;
        return { data, error };
      }

      console.error('请求错误:', error);
      if (error.name === 'TimeoutError') {
        ElMessage.error('请求超时，请稍后重试');
      } else {
        ElMessage.error('网络请求失败，请检查网络连接');
      }
      data = undefined;
      return { data, error };
    },
  },
  fetchOptions: {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

export default useRequest;

/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 * @param options 请求选项
 */
export function useGet<T = any>(
  url: MaybeRef<string>,
  query?: MaybeRef<unknown>,
  options?: MaybeRef<RequestInit>,
): UseFetchReturn<ApiResponse<T>> {
  const _url = computed(() => {
    const _url = unref(url);
    const _query = unref(query);
    const cleanedQuery = isObject(_query) ? removeEmptyStringFields(_query) : _query;
    const queryString = isObject(cleanedQuery)
      ? stringifyQuery(cleanedQuery as LocationQueryRaw)
      : cleanedQuery || '';
    return `${_url}${queryString ? '?' : ''}${queryString}`;
  });

  return useRequest<ApiResponse<T>>(_url, unref(options) || {}).json();
}

/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 * @param options 请求选项
 */
export function usePost<T = any>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  options?: MaybeRef<RequestInit>,
): UseFetchReturn<ApiResponse<T>> {
  const cleanedPayload = computed(() => {
    const _payload = unref(payload);
    return isObject(_payload) ? removeEmptyStringFields(_payload) : _payload;
  });

  return useRequest<ApiResponse<T>>(url, unref(options) || {}).post(cleanedPayload).json();
}

/**
 * 封装 put 请求
 * @param url 请求地址
 * @param payload 请求参数
 * @param options 请求选项
 */
export function usePut<T = any>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  options?: MaybeRef<RequestInit>,
): UseFetchReturn<ApiResponse<T>> {
  const cleanedPayload = computed(() => {
    const _payload = unref(payload);
    return isObject(_payload) ? removeEmptyStringFields(_payload) : _payload;
  });

  return useRequest<ApiResponse<T>>(url, unref(options) || {}).put(cleanedPayload).json();
}

/**
 * 封装 delete 请求
 * @param url 请求地址
 * @param payload 请求参数
 * @param options 请求选项
 */
export function useDelete<T = any>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
  options?: MaybeRef<RequestInit>,
): UseFetchReturn<ApiResponse<T>> {
  const cleanedPayload = computed(() => {
    const _payload = unref(payload);
    return isObject(_payload) ? removeEmptyStringFields(_payload) : _payload;
  });

  return useRequest<ApiResponse<T>>(url, unref(options) || {}).delete(cleanedPayload).json();
}

/**
 * 封装获取Blob进行下载
 * @param url 请求地址
 * @param headers 请求头
 */
export function useBlob(url: MaybeRef<string>, headers?: MaybeRef<Record<string, string>>): UseFetchReturn<Blob> {
  const fetchOptions: RequestInit = {};
  if (headers) {
    fetchOptions.headers = unref(headers);
  }
  return useRequest<Blob>(url, fetchOptions).blob();
}
