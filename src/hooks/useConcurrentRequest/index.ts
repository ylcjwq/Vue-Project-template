interface RequestConfig {
  maxConcurrent?: number; // 最大并发数
  stopOnError?: boolean; // 是否在遇到错误时停止
  retryTimes?: number; // 重试次数
}

interface RequestTask {
  fn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  retryCount?: number;
}

export function useConcurrentRequest(config: RequestConfig = {}) {
  const { maxConcurrent = 3, stopOnError = false, retryTimes = 0 } = config;

  const queue: RequestTask[] = [];
  const currentRunning = ref(0);
  const hasError = ref(false);
  const isPaused = ref(false);

  // 拒绝所有待处理的请求
  const rejectAllPending = (error: any) => {
    while (queue.length) {
      const task = queue.shift();
      task?.reject(new Error(`请求队列因错误被终止: ${error.message}`));
    }
  };

  // 执行队列中的下一个任务
  const runNextTask = async () => {
    if (
      currentRunning.value >= maxConcurrent ||
      queue.length === 0 ||
      (hasError.value && stopOnError) ||
      isPaused.value
    ) {
      return;
    }

    const task = queue.shift();
    if (!task) return;

    try {
      currentRunning.value++;
      const result = await task.fn();
      task.resolve(result);
      hasError.value = false;
    } catch (error) {
      // 处理重试逻辑
      if ((task.retryCount || 0) < retryTimes) {
        task.retryCount = (task.retryCount || 0) + 1;
        queue.unshift(task); // 将任务重新放回队列头部
      } else {
        hasError.value = true;
        task.reject(error);
        if (stopOnError) {
          // 如果配置为遇错停止，则清空队列并拒绝所有待处理的请求
          rejectAllPending(error);
          return;
        }
      }
    } finally {
      currentRunning.value--;
      runNextTask();
    }
  };

  // 添加请求到队列
  const addRequest = <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      queue.push({
        fn,
        resolve,
        reject,
        retryCount: 0,
      });
      runNextTask();
    });
  };

  // 暂停队列处理
  const pause = () => {
    isPaused.value = true;
  };

  // 恢复队列处理
  const resume = () => {
    isPaused.value = false;
    runNextTask();
  };

  // 清空队列
  const clear = () => {
    queue.length = 0;
    hasError.value = false;
    isPaused.value = false;
  };

  return {
    addRequest,
    currentRunning,
    hasError,
    isPaused,
    pause,
    resume,
    clear,
  };
}
