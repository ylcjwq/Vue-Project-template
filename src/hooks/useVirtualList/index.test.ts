import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref, onMounted } from 'vue';
import useVirtualList from './index';

describe('useVirtualList', () => {
  const mockOffsetHeight = 50;
  let scroll: (event: Event) => void;

  beforeEach(() => {
    // 重置 scroll
    scroll = () => {};

    // 模拟 DOM 元素
    document.querySelector = vi.fn(() => ({
      style: {},
      addEventListener: (event: string, callback: (event: Event) => void) => {
        if (event === 'scroll') {
          scroll = callback;
        }
      },
      removeEventListener: (event: string) => {
        if (event === 'scroll') {
          scroll = () => {};
        }
      },
      offsetHeight: mockOffsetHeight,
      scrollTop: 0,
      getBoundingClientRect: () => ({
        height: mockOffsetHeight,
        width: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: mockOffsetHeight,
        left: 0,
      }),
      dispatchEvent: (event: Event) => {
        if (event.type === 'scroll') {
          scroll(event);
        }
        return true;
      },
    }));

    document.querySelectorAll = vi.fn(
      () =>
        Array.from({ length: 10 }, () => ({
          offsetHeight: mockOffsetHeight,
        })) as unknown as NodeListOf<Element>,
    );
  });

  const TestComponent = defineComponent({
    setup() {
      const data = ref<{ id: number; content: string }[]>([]);

      const config = {
        data,
        scrollContainer: '.scroll-container',
        actualHeightContainer: '.actual-height',
        translateContainer: '.translate-container',
        itemContainer: '.item',
        itemHeight: 50,
        size: 10,
      };

      const { actualRenderData } = useVirtualList(config);

      onMounted(() => {
        data.value = Array.from({ length: 1000 }, (_, index) => ({
          id: index,
          content: `Item ${index}`,
        }));
      });

      return { actualRenderData, data };
    },
    template: `
      <div class="scroll-container" style="height: 300px; overflow: auto;">
        <div class="actual-height">
          <div class="translate-container">
            <div v-for="item in actualRenderData" :key="item.id" class="item">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    `,
  });

  it('应该初始渲染指定数量的项目', async () => {
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.actualRenderData.length).toBe(10);
  });

  it('滚动时应该更新渲染的项目', async () => {
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // 触发滚动事件
    scroll({ target: { scrollTop: 200 } } as unknown as Event);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.actualRenderData.length).toBe(10);
    expect(wrapper.vm.actualRenderData[0].id).toBe(3);
  });

  it('组件卸载时应移除滚动事件的监听', async () => {
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // 触发滚动事件
    scroll({ target: { scrollTop: 200 } } as unknown as Event);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.actualRenderData.length).toBe(10);
    expect(wrapper.vm.actualRenderData[0].id).toBe(3);

    wrapper.unmount();
    await wrapper.vm.$nextTick();

    // 触发滚动事件
    scroll({ target: { scrollTop: 400 } } as unknown as Event);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.actualRenderData.length).toBe(10);
    expect(wrapper.vm.actualRenderData[0].id).toBe(3);
  });
});
