import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGet, usePost, usePut, useDelete, useBlob } from '@/hooks/useRequest';
import { useStorage } from '@vueuse/core';

// Mock router
vi.mock('@/routers/index', () => ({
  default: {
    replace: vi.fn(() => Promise.resolve()),
    currentRoute: {
      value: {
        path: '/test',
      },
    },
  },
}));

// 添加 location.reload mock
const reloadMock = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: reloadMock,
  },
  writable: true,
});

// Mock Element Plus message
vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

// 创建一个通用的模拟响应生成器
function createMockResponse(options = {}) {
  const defaultOptions = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    data: {} as Record<string, any>,
    type: 'basic',
    errorMessages: '请求失败',
    blob: () => Promise.resolve(new Blob()),
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return {
    ok: mergedOptions.ok,
    status: mergedOptions.status,
    statusText: mergedOptions.statusText,
    headers: mergedOptions.headers,
    type: mergedOptions.type,
    json: () =>
      Promise.resolve({
        code: mergedOptions.data.code || mergedOptions.status,
        data: mergedOptions.data,
        errorMessages: mergedOptions.errorMessages,
      }),
    text: () => Promise.resolve(JSON.stringify(mergedOptions.data)),
    clone: () => createMockResponse(mergedOptions),
    blob: mergedOptions.blob,
  };
}

describe('useRequest', () => {
  beforeEach(() => {
    // 清除所有模拟的调用记录
    vi.clearAllMocks();
    // 重置 token
    const token = useStorage('token', '');
    token.value = '';
  });

  describe('useGet', () => {
    it('应该正确处理成功的GET请求', async () => {
      const mockResponse = createMockResponse({
        data: { message: 'success' },
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data, error } = await useGet('/api/test');
      expect(error.value).toBe(null);
      expect(data.value).toEqual({ message: 'success' });
    });

    it('应该正确处理带查询参数的GET请求', async () => {
      const mockResponse = createMockResponse({
        data: {},
      });
      globalThis.fetch = vi.fn().mockImplementation((url) => {
        expect(url).toContain('?name=test');
        return Promise.resolve(mockResponse);
      });

      await useGet('/api/test', { name: 'test' });
    });
  });

  describe('usePost', () => {
    it('应该正确处理POST请求', async () => {
      const mockResponse = createMockResponse({
        data: { id: 1 },
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const payload = { name: 'test' };
      const { data, error } = await usePost('/api/test', payload);

      expect(error.value).toBe(null);
      expect(data.value).toEqual({ id: 1 });
    });
  });

  describe('usePut', () => {
    it('应该正确处理PUT请求', async () => {
      const mockResponse = createMockResponse({
        data: { id: 1, updated: true },
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const payload = { id: 1, name: 'updated' };
      const { data, error } = await usePut('/api/test', payload);

      expect(error.value).toBe(null);
      expect(data.value).toEqual({ id: 1, updated: true });
    });
  });

  describe('useDelete', () => {
    it('应该正确处理DELETE请求', async () => {
      const mockResponse = createMockResponse({
        data: { success: true },
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data, error } = await useDelete('/api/test');

      expect(error.value).toBe(null);
      expect(data.value).toEqual({ success: true });
    });
  });

  describe('useBlob', () => {
    it('应该正确处理Blob请求', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const mockResponse = createMockResponse();
      mockResponse.blob = () => Promise.resolve(blob);
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data } = await useBlob('/api/test');
      expect(data.value).instanceOf(Blob);
    });
  });

  describe('认证处理', () => {
    it('未登录时应该拦截非白名单请求', async () => {
      const mockResponse = createMockResponse({
        status: 401,
        errorMessages: '未登录',
        data: 1,
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data } = await useGet('/api/test');
      expect(data.value).toBe(null);
    });

    it('登录过期时应该正确处理401响应', async () => {
      const token = useStorage('token', '');
      token.value = 'invalid-token';

      const mockResponse = createMockResponse({
        status: 401,
        errorMessages: '登录已过期',
        data: 1,
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data } = await useGet('/api/test');
      expect(data.value).toBe(null);
    });
  });

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      const mockResponse = createMockResponse({
        ok: false,
        status: 500,
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { error } = await useGet('/api/test');
      expect(error.value).toBeTruthy();
    });

    it('应该处理其他错误', async () => {
      const mockResponse = createMockResponse({
        status: 200,
        data: {
          code: 1000,
          message: '业务错误',
        },
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data } = await useGet('/api/test');
      expect(data.value).toBe(null);
    });

    it('应该处理服务器500错误', async () => {
      const mockResponse = createMockResponse({
        status: 500,
        errorMessages: '服务器错误',
        ok: false,
      });
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

      const { data, error } = await useGet('/api/test');
      expect(data.value).toBe(null);
      expect(error.value).toBeTruthy();
    });

    it('应该处理请求超时', async () => {
      globalThis.fetch = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout'));
          }, 100);
        });
      });

      const { error } = await useGet('/api/test');
      expect(error.value).toBeTruthy();
    });
  });
});
