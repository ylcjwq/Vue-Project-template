import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
  // 转换器
  transformers: [
    transformerDirectives(), // 添加指令转换器
  ],
  // 快捷方式
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-btn-cen': 'flex flex-justify-between flex-items-center',
    'flex-btn-str': 'flex flex-justify-between flex-items-start',
    'flex-str-cen': 'flex flex-justify-start flex-items-center',
    'flex-cen-cen': 'flex flex-justify-center flex-items-center',
    'flex-str-str': 'flex flex-justify-start flex-items-start',
  },
  // 预设
  presets: [
    presetUno(),
    presetIcons({
      warn: true,
      prefix: ['i-'],
      extraProperties: {
        display: 'inline-block',
      },
    }),
    presetAttributify(),
  ],
  // 规则
  rules: [
    [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` })],
    [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })],
    [/^wh-(\d+)$/, ([, d]) => ({ width: `${d}px`, height: `${d}px` })],
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
    [/^mx-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px`, 'margin-right': `${d}px` })],
    [/^my-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px`, 'margin-bottom': `${d}px` })],
    [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
    [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],
    [/^px-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px`, 'padding-right': `${d}px` })],
    [/^py-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px`, 'padding-bottom': `${d}px` })],
    [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
    [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
    [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
    [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],
    [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^top-(\d+)$/, ([, d]) => ({ top: `${d}px` })],
    [/^bottom-(\d+)$/, ([, d]) => ({ bottom: `${d}px` })],
    [/^left-(\d+)$/, ([, d]) => ({ left: `${d}px` })],
    [/^right-(\d+)$/, ([, d]) => ({ right: `${d}px` })],
    [/^rounded-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
    [/^text-ellipsis-1/, () => ({ 'text-overflow': `ellipsis`, 'overflow': 'hidden', 'white-space': 'nowrap' })],
    [
      /^text-ellipsis-([2-9]\d*)$/,
      ([, d]) => ({
        'text-overflow': `ellipsis`,
        'display': '-webkit-box',
        'overflow': 'hidden',
        '-webkit-line-clamp': d,
        '-webkit-box-orient': 'vertical',
      }),
    ],
    [
      /^border-\[(.*)\]$/,
      ([, d]) => {
        const [width, color, style] = d.split(',');
        return {
          'border-width': width ? `${width}px` : '1px',
          'border-color': color || '#000',
          'border-style': style || 'solid',
        };
      },
    ],
  ],
});
