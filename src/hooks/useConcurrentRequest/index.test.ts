import { describe, it, expect, vi } from 'vitest';
import { useConcurrentRequest } from './index';

describe('useConcurrentRequest', () => {
  it('应该能够按照最大并发数执行请求', async () => {
    const { addRequest, currentRunning } = useConcurrentRequest({ maxConcurrent: 2 });

    const mockRequest = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('success'), 100)),
      );

    // 添加三个请求
    const requests = [
      addRequest(() => mockRequest()),
      addRequest(() => mockRequest()),
      addRequest(() => mockRequest()),
    ];

    // 检查当前运行的请求数量是否不超过最大并发数
    expect(currentRunning.value).toBeLessThanOrEqual(2);

    // 等待所有请求完成
    await Promise.all(requests);
    expect(mockRequest).toHaveBeenCalledTimes(3);
  });

  it('应该在遇到错误时停止并拒绝剩余请求', async () => {
    const { addRequest } = useConcurrentRequest({ stopOnError: true, maxConcurrent: 1 });

    const successRequest = vi.fn().mockResolvedValue('success');
    const failRequest = vi.fn().mockRejectedValue(new Error('测试错误'));

    const requests = [
      addRequest(successRequest),
      addRequest(failRequest),
      addRequest(successRequest),
    ];

    await expect(Promise.all(requests)).rejects.toThrow('测试错误');
    expect(successRequest).toHaveBeenCalledTimes(1);
  });

  it('应该在失败时重试指定次数', async () => {
    const { addRequest } = useConcurrentRequest({ retryTimes: 2 });

    const failRequest = vi
      .fn()
      .mockRejectedValueOnce(new Error('失败1'))
      .mockRejectedValueOnce(new Error('失败2'))
      .mockResolvedValueOnce('success');

    const result = await addRequest(failRequest);

    expect(failRequest).toHaveBeenCalledTimes(3);
    expect(result).toBe('success');
  });

  it('应该能够暂停和恢复请求队列', async () => {
    const { addRequest, pause, resume, currentRunning } = useConcurrentRequest();

    const mockRequest = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('success'), 100)),
      );

    // 添加请求并立即暂停
    const requests = [
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
    ];
    pause();

    await new Promise((resolve) => setTimeout(resolve, 400));

    // 检查是否暂停执行
    expect(currentRunning.value).toBe(0);

    // 恢复执行
    resume();
    await Promise.all(requests);

    expect(mockRequest).toHaveBeenCalledTimes(5);
  });

  it('应该能够清空请求队列', async () => {
    const { addRequest, clear, currentRunning } = useConcurrentRequest();

    const mockRequest = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('success'), 100)),
      );

    // 添加多个请求
    const requests = [
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
      addRequest(mockRequest),
    ];

    // 清空队列
    clear();

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(currentRunning.value).toBe(0);
    expect(mockRequest).toHaveBeenCalledTimes(3);

    await Promise.all(requests);
    expect(mockRequest).toHaveBeenCalledTimes(3);
  });
});
