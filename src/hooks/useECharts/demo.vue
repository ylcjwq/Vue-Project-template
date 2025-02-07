<script setup lang="ts">
import { useECharts } from '@/hooks/useECharts';
import type { ChartStrategy } from '@/hooks/useECharts';

const createLineOptionStrategy = (): ChartStrategy => {
  return {
    getOptions: () => ({
      title: {
        text: 'ECharts Demo',
      },
      legend: {
        data: ['折线图1', '折线图2'],
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      series: [
        {
          data: [1, 1, 2, 1, 1, 1, 1],
          name: '折线图1',
          type: 'line',
        },
        {
          data: [2, 3, 4, 2, 3, 3, 3],
          name: '折线图2',
          type: 'line',
        },
      ],
    }),
  };
};

const chartRef = ref<HTMLDivElement | null>(null);
const { options } = useECharts(chartRef, createLineOptionStrategy().getOptions());

setTimeout(() => {
  if (options.series) {
    options.series[0] = {
      data: [220, 200, 200, 200, 200, 210, 260],
      type: 'bar',
      name: '柱状图',
      label: {
        show: true, // 显示数据标签
        position: 'top', // 标签位置
      },
    };
    options.series[1].data = [240, 210, 210, 210, 210, 230, 300];
    options.legend! = {
      data: ['折线图1', '折线图2'],
    };
  }
}, 2000);
</script>

<template>
  <div>
    <div
      ref="chartRef"
      style="width: 100%; height: 400px"
    />
  </div>
</template>

<style scoped lang="scss"></style>
