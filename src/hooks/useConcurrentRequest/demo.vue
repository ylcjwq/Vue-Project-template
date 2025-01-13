<script setup lang="ts">
import { useConcurrentRequest } from './index';

// 创建一个配置了错误处理策略的实例
const { addRequest, currentRunning } = useConcurrentRequest({
  maxConcurrent: 3,
  stopOnError: true, // 遇到错误时停止处理队列
  retryTimes: 2, // 失败重试2次
});

// 模拟API请求
const mockRequest = async (id: number) => {
  const url = `https://jsonplaceholder.typicode.com/todos/${id}`;
  const res = await fetch(url);
  return res.json();
};

// 使用示例
const handleRequests = async () => {
  try {
    // 创建10个请求
    const requests = Array.from({ length: 10 }, (_, i) => {
      return addRequest(() => mockRequest(i + 1));
    });

    const results = await Promise.all(requests);
    console.log('所有请求完成:', results);
  } catch (error) {
    console.error('请求队列因错误被终止:', error);
  }
};
</script>

<template>
  <button @click="handleRequests">并发请求</button>
  <p>当前并发数: {{ currentRunning }}</p>
</template>
