## 并发请求hook

### 使用

可用于需要并发请求的场景，比如批量请求、批量上传等。

### 参数

- maxConcurrent: 最大并发数
- stopOnError: 是否在遇到错误时停止
- retryTimes: 重试次数

### 返回值

- addRequest: 添加请求
- currentRunning: 当前正在运行的请求数
- hasError: 是否遇到错误
- isPaused: 是否暂停
- pause: 暂停
- resume: 恢复
- clear: 清空
- completedTasks: 已完成的任务
- pendingTasks: 待处理的请求

### 示例

查看 [示例代码](./demo.vue)。
