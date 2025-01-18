// 请求配置
interface RequestConfig {
  maxConcurrent?: number; // 最大并发数
  stopOnError?: boolean; // 是否在遇到错误时停止
  retryTimes?: number; // 重试次数
}

// 请求任务
interface RequestTask {
  id: string; // 任务id
  fn: () => Promise<any>; // 请求函数
  resolve: (value: any) => void; // 成功回调
  reject: (reason?: any) => void; // 失败回调
  retryCount?: number; // 重试次数
  isRunning?: boolean; // 是否正在运行
}

// 并发控制结果
interface ConcurrentControlResult {
  /**
   * 添加请求
   * @param fn 请求函数
   * @returns 返回请求的结果
   */
  addRequest: (fn: () => Promise<any>) => Promise<any>;

  // 当前正在运行的请求数
  currentRunning: Ref<number>;

  // 是否遇到错误
  hasError: Ref<boolean>;

  // 是否暂停
  isPaused: Ref<boolean>;

  /**
   * 暂停队列
   */
  pause: () => void;

  /**
   * 恢复队列
   */
  resume: () => void;

  /**
   * 清空队列
   * @param waitForRunning 是否等待运行中的请求完成
   * @returns 返回清空队列的结果
   */
  clear: (
    waitForRunning?: boolean,
  ) => Promise<{ completed: any[]; cancelled: number; inProgress: number }>;

  // 已完成的任务
  completedTasks: Ref<Record<string, any>>;

  // 待处理的请求
  pendingTasks: Ref<Record<string, RequestTask>>;
}

/**
 * 并发控制
 * @param config 配置
 * @returns 返回并发控制的结果
 */
export function useConcurrentRequest(config: RequestConfig = {}): ConcurrentControlResult {
  const { maxConcurrent = 3, stopOnError = false, retryTimes = 0 } = config;

  const queue: RequestTask[] = []; // 请求队列
  const currentRunning = ref(0); // 当前正在运行的请求数
  const hasError = ref(false); // 是否遇到错误
  const isPaused = ref(false); // 是否暂停
  const completedTasks = ref<Record<string, any>>({}); // 存储已完成的任务结果
  const pendingTasks = ref<Record<string, RequestTask>>({}); // 存储待处理的任务

  /**
   * 拒绝所有待处理的请求
   * @param error 错误
   */
  const rejectAllPending = (error: any) => {
    while (queue.length) {
      const task = queue.shift();
      task?.reject(new Error(`请求队列因错误被终止: ${error.message}`));
    }
  };

  /**
   * 执行队列中的下一个任务
   */
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
      task.isRunning = true; // 标记任务开始执行
      const result = await task.fn();
      Reflect.deleteProperty(pendingTasks.value, task.id);
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
      task.isRunning = false; // 标记任务执行结束
      runNextTask();
    }
  };

  /**
   * 生成任务id
   * @returns 返回任务id
   */
  const generateTaskId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    const taskId = `${timestamp}-${random}`;
    return taskId;
  };

  /**
   * 添加请求到队列
   * @param fn 请求函数
   * @returns 返回请求的结果
   */
  const addRequest = <T>(fn: () => Promise<T>): Promise<T> => {
    const taskId = generateTaskId();
    return new Promise((resolve, reject) => {
      const task = {
        id: taskId,
        fn,
        resolve: (value: T) => {
          completedTasks.value[taskId] = value;
          resolve(value);
        },
        reject,
        retryCount: 0,
      };

      pendingTasks.value[taskId] = task;
      queue.push(task);
      runNextTask();
    });
  };

  /**
   * 暂停队列处理
   */
  const pause = () => {
    isPaused.value = true;
  };

  /**
   * 恢复队列处理
   */
  const resume = () => {
    isPaused.value = false;
    runNextTask();
  };

  /**
   * 清空队列
   * @param waitForRunning 是否等待运行中的请求完成
   * @returns 返回清空队列的结果
   */
  const clear = async (
    waitForRunning: boolean = false,
  ): Promise<{
    completed: any[];
    cancelled: number;
    inProgress: number;
  }> => {
    const completed = { ...completedTasks.value };
    const queuedTasks = [...queue];
    const runningTasks = Object.values(pendingTasks.value).filter((task) => task.isRunning);

    // 清空等待队列
    queue.length = 0;

    // 拒绝所有等待中的任务
    queuedTasks.forEach((queuedTask) => {
      queuedTask.reject('请求已被取消');
      Reflect.deleteProperty(pendingTasks.value, queuedTask.id);
    });

    let runningResults = [];
    // 等待所有正在执行的任务完成并决定是否收集结果
    const results = await Promise.allSettled(
      runningTasks.map(
        (task) =>
          new Promise((resolve, reject) => {
            const originalResolve = task.resolve;
            const originalReject = task.reject;

            task.resolve = (value: any) => {
              originalResolve(value);
              resolve(value);
            };

            task.reject = (error: any) => {
              originalReject(error);
              reject(error);
            };
          }),
      ),
    );

    // 如果配置了等待运行中的任务，则收集结果
    if (waitForRunning && runningTasks.length > 0) {
      runningResults = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map((result) => result.value);
    }

    // 重置状态
    completedTasks.value = {};
    hasError.value = false;
    isPaused.value = false;

    return {
      completed: [...Object.values(completed), ...runningResults],
      cancelled: queuedTasks.length,
      inProgress: waitForRunning ? 0 : runningTasks.length,
    };
  };

  return {
    addRequest,
    currentRunning,
    hasError,
    isPaused,
    pause,
    resume,
    clear,
    completedTasks: readonly(completedTasks),
    pendingTasks: readonly(pendingTasks),
  };
}
