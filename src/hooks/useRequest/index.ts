import { stringifyQuery } from 'vue-router';
import { createFetch, isObject } from '@vueuse/core';
import router from '@/routers/index';
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
      const token = useStorage('token', '');

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

      const status = response.status;
      const code = data.code;
      const message = data.errorMessages;

      if (status === 401) {
        ElMessage.warning('登录已经过期');
        setTimeout(() => {
          router
            .replace(`/login?redirect=${router.currentRoute.value.path}`)
            .then(() => location.reload());
        }, 1500);
        data = null;
      } else if (status === 500) {
        ElMessage.error('服务器错误');
        data = null;
      }

      // NOTE: 拦截返回，需要根据具体返回修改
      if (code === 200) {
        data = data.data || {};
      } else if (code === 401) {
        ElMessage.warning('登录已经过期');
        setTimeout(() => {
          router
            .replace(`/login?redirect=${router.currentRoute.value.path}`)
            .then(() => location.reload());
        }, 1500);
        data = null;
      } else {
        console.log(message, '出现未全局拦截错误');
        ElMessage.error(message || '请求错误');
        data = null;
      }

      return { data, response };
    },
    onFetchError({ data, error }) {
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
  },
});

export default useRequest;

/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 */
export function useGet<T = unknown>(
  url: MaybeRef<string>,
  query?: MaybeRef<unknown>,
): UseFetchReturn<T> {
  const _url = computed(() => {
    const _url = unref(url);
    const _query = unref(query);
    const queryString = isObject(_query)
      ? stringifyQuery(_query as LocationQueryRaw)
      : _query || '';
    return `${_url}${queryString ? '?' : ''}${queryString}`;
  });

  return useRequest<T>(_url).json();
}

/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePost<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
): UseFetchReturn<T> {
  return useRequest<T>(url).post(payload).json();
}

/**
 * 封装 put 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePut<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
): UseFetchReturn<T> {
  return useRequest<T>(url).put(payload).json();
}

/**
 * 封装 delete 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function useDelete<T = unknown>(
  url: MaybeRef<string>,
  payload?: MaybeRef<unknown>,
): UseFetchReturn<T> {
  return useRequest<T>(url).delete(payload).json();
}

/**
 * 封装获取Blob进行下载
 * @param url 请求地址
 */
export function useBlob(url: MaybeRef<string>): UseFetchReturn<Blob> {
  return useRequest(url).blob();
}
