import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, onMounted, nextTick } from 'vue';
import { useECharts } from './index';
import * as echarts from 'echarts';

// 模拟整个 echarts 模块
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    getDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  })),
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: vi.fn(),
  };
});

describe('useECharts', () => {
  let chartRef: Ref<HTMLElement | null>;
  let initOptions: echarts.EChartsOption;

  beforeEach(() => {
    // 创建一个实际的 DOM 元素作为图表容器
    const div = document.createElement('div');
    chartRef = ref(div);
    initOptions = { title: { text: 'Test Chart' }, series: [] };
  });

  afterEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
  });

  it('应该在挂载时初始化图表实例', async () => {
    const { chartInstance } = useECharts(chartRef, initOptions);

    // 触发 onMounted 钩子
    onMounted(() => {
      expect(echarts.init).toHaveBeenCalledWith(chartRef.value, undefined, undefined);
      expect(chartInstance.value).toBeTruthy();
    });
  });

  it('应该在 options 变化时更新图表', async () => {
    const { options, chartInstance } = useECharts(chartRef, initOptions);
    const newOptions = { title: { text: 'Updated Title' }, series: [] };

    // 模拟初始化后的实例
    chartInstance.value = { setOption: vi.fn() } as unknown as echarts.EChartsType;

    // 使用 Object.assign 确保保留 series 属性
    Object.assign(options, newOptions);
    await nextTick();

    // 断言包含完整的配置对象
    expect(chartInstance.value.setOption).toHaveBeenCalledWith(
      {
        title: { text: 'Updated Title' },
        series: [],
      },
      { notMerge: true, lazyUpdate: true },
    );
  });

  it('应该在窗口调整大小时调用 resize', () => {
    const { handleResize, chartInstance } = useECharts(chartRef, initOptions);
    chartInstance.value = { resize: vi.fn() } as unknown as echarts.EChartsType;

    // 模拟窗口 resize 事件
    window.dispatchEvent(new Event('resize'));
    handleResize();

    expect(chartInstance.value.resize).toHaveBeenCalled();
  });

  it('应该在卸载时销毁图表实例', () => {
    const { disposeChart, chartInstance } = useECharts(chartRef, initOptions);
    const disposeMock = vi.fn();

    // 设置模拟实例
    chartInstance.value = { dispose: disposeMock } as unknown as echarts.EChartsType;
    disposeChart();

    // 验证方法调用和实例置空
    expect(disposeMock).toHaveBeenCalled();
    expect(chartInstance.value).toBeNull();
  });

  it('应该生成并触发图片下载', () => {
    const { downloadChartImage, chartInstance } = useECharts(chartRef, initOptions);
    chartInstance.value = {
      getDataURL: vi.fn(() => 'data:image/png;base64,mock'),
    } as unknown as echarts.EChartsType;

    const createElementSpy = vi.spyOn(document, 'createElement');
    const clickSpy = vi.fn();
    createElementSpy.mockReturnValue({ click: clickSpy } as unknown as HTMLAnchorElement);

    downloadChartImage('test.png');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
  });
});
