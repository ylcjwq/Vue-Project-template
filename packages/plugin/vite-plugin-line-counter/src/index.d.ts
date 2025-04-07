interface Options {
  /**
   * 单个文件最大行数限制
   * @default 300
   */
  maxLines?: number;

  /**
   * 要忽略的文件夹名称
   * @default ['node_modules', 'dist']
   */
  ignore?: string[];

  /**
   * 要忽略的文件正则表达式
   * @default [/\.d\.ts$/]
   */
  ignorePattern?: RegExp[];

  /**
   * 指定要检查的文件夹路径，为空则检查所有文件
   * @example ['src/components', 'src/views']
   * @default []
   */
  include?: string[];

  /**
   * 指定要检查的文件类型
   * @example ['.vue', '.ts', '.js']
   * @default ['.vue', '.ts', '.js', '.jsx', '.tsx']
   */
  fileTypes?: string[];
}

export default function lineCounterPlugin(options?: Options): {
  name: string;
  enforce: string;
  buildEnd: () => Promise<void>;
};
