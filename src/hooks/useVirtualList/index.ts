interface Config {
  data: Ref<any[]>; // 数据源
  scrollContainer: string; // 滚动容器的元素选择器
  actualHeightContainer: string; // 用于撑开高度的元素选择器
  translateContainer: string; // 用于偏移的元素选择器
  itemContainer: string; // 列表项选择器
  itemHeight: number; // 列表项高度
  size: number; // 每次渲染数据量
}

type HtmlElType = HTMLElement | null;

export default function useVirtualList(config: Config) {
  // 获取元素
  let actualHeightContainerEl: HtmlElType = null;
  let translateContainerEl: HtmlElType = null;
  let scrollContainerEl: HtmlElType = null;

  let count = 0;

  // 数据源，便于后续直接访问
  let dataSource: any[] = [];

  // 缓存已渲染元素的高度
  const RenderedItemsCache: any = {};

  // 实际渲染的数据
  const actualRenderData: Ref<any[]> = ref([]);

  // 获取缓存高度，无缓存，取配置项的 itemHeight
  const getItemHeightFromCache = (index: number | string) => {
    const val = RenderedItemsCache[index];
    return val === void 0 ? config.itemHeight : val;
  };

  // 更新实际高度
  const updateActualHeight = () => {
    let actualHeight = 0;
    dataSource.forEach((_, i) => {
      actualHeight += getItemHeightFromCache(i);
    });

    actualHeightContainerEl!.style.height = `${actualHeight}px`;
  };

  // 更新已渲染列表项的缓存高度
  const updateRenderedItemCache = (index: number) => {
    // 当所有元素的实际高度更新完毕，就不需要重新计算高度
    const shouldUpdate = Object.keys(RenderedItemsCache).length < dataSource.length;
    if (!shouldUpdate) return;

    nextTick(() => {
      // 获取所有列表项元素
      const Items: HTMLElement[] = Array.from(document.querySelectorAll(config.itemContainer));

      // 进行缓存
      Items.forEach((el) => {
        if (!RenderedItemsCache[index]) {
          RenderedItemsCache[index] = el.offsetHeight;
        }
        index++;
      });

      // 更新实际高度
      updateActualHeight();
    });
  };

  // 更新偏移值
  const updateOffset = (offset: number) => {
    translateContainerEl!.style.transform = `translateY(${offset}px)`;
  };

  // 更新实际渲染数据
  const updateRenderData = (scrollTop: number) => {
    let startIndex = 0;
    let offsetHeight = 0;

    if (count < 1) {
      count++;
    } else {
      count++;
      for (let i = 0; i < dataSource.length; i++) {
        offsetHeight += getItemHeightFromCache(i);

        if (offsetHeight >= scrollTop) {
          startIndex = i;
          break;
        }
      }
    }

    // 计算得出的渲染数据
    actualRenderData.value = dataSource.slice(startIndex, startIndex + config.size);

    // 缓存最新的列表项高度
    updateRenderedItemCache(startIndex);

    // 更新偏移值
    const initialOffset = count <= 1 ? 0 : offsetHeight - getItemHeightFromCache(startIndex);

    updateOffset(initialOffset);
  };

  // 滚动事件
  const handleScroll = (e: any) => {
    // 渲染正确的数据
    updateRenderData(e.target.scrollTop);
  };

  // 注册滚动事件
  onMounted(() => {
    actualHeightContainerEl = document.querySelector(config.actualHeightContainer);
    scrollContainerEl = document.querySelector(config.scrollContainer);
    translateContainerEl = document.querySelector(config.translateContainer);
    scrollContainerEl?.addEventListener('scroll', handleScroll);
  });

  // 移除滚动事件
  onBeforeUnmount(() => {
    scrollContainerEl?.removeEventListener('scroll', handleScroll);
  });

  // 数据源发生变动
  watch(
    () => config.data.value,
    (newVla) => {
      // 更新数据源
      dataSource = newVla;

      // 计算需要渲染的数据
      updateRenderData(0);
    },
  );

  return { actualRenderData };
}
