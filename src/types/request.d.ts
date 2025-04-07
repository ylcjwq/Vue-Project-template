declare global {
  /**
   * 接口响应对象
   */
  interface ApiResponse<T> {
    code: number;
    data: T;
    messages?: string;
  }
}

export {};
