<script setup lang="ts">
import { useConcurrentRequest } from './index';

// 创建一个配置了错误处理策略的实例
const { addRequest, currentRunning, clear, completedTasks, pendingTasks } = useConcurrentRequest({
  maxConcurrent: 3,
  stopOnError: true,
  retryTimes: 2,
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

const handleClear = async () => {
  try {
    const { completed, cancelled, inProgress } = await clear();
    console.log('已完成的请求结果:', completed);
    console.log('被取消的请求数:', cancelled);
    console.log('正在执行的请求数:', inProgress);
  } catch (error) {
    console.error('取消请求时发生错误:', error);
  }
};
</script>

<template>
  <button @click="handleRequests">并发请求</button>
  <button @click="handleClear">清空队列</button>
  <p>当前并发数: {{ currentRunning }}</p>
  <p>已完成的请求数: {{ Object.keys(completedTasks).length }}</p>
  <p>待处理的请求数: {{ Object.keys(pendingTasks).length }}</p>
</template>
