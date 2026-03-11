# FlowToolkit

OA 系统前端工具库

[![Version](https://img.shields.io/npm/v/flowtoolkit.svg)](https://www.npmjs.com/package/flowtoolkit)
[![License](https://img.shields.io/npm/l/flowtoolkit.svg)](LICENSE)
[![Size](https://img.shields.io/bundlejsize/flowtoolkit.svg)](https://www.npmjs.com/package/flowtoolkit)

## 特性

- **水印模块 (Watermark)** - 页面文本水印，支持高清屏适配、防篡改保护、密码验证
- **国际化 (i18n)** - 多语言支持，模板变量替换，DOM 元素批量替换
- **工具函数** - 常用 DOM、日期、加密等工具函数

## 安装

```bash
npm install flowtoolkit
```

## 快速开始

### 浏览器直接使用 (CDN / 本地)

```html
<!-- 引入 UMD 版本（推荐） -->
<script src="flowtoolkit.umd.js"></script>

<!-- 或者 ES Module 版本 -->
<script type="module">
  import FlowToolkit from './flowtoolkit.esm.js';
</script>

<script>
  // 使用全局变量 FT 或 FlowToolkit
  // 水印示例
  const watermark = new FT.Watermark({
    content: '内部文档',
    rotate: 15
  });
  watermark.create();

  // 国际化示例
  FT.i18n.init({
    currentLang: 'zh-CN'
  });
</script>
```

### NPM 模块引入

```javascript
import { Watermark } from 'flowtoolkit';
import { i18n, utils } from 'flowtoolkit';

// 创建水印
const wm = new Watermark({ content: '机密文档' });
await wm.create();

// 国际化
i18n.init({ currentLang: 'zh-CN' });
```

## 模块

### 水印 (Watermark)

```javascript
import { Watermark } from 'flowtoolkit/watermark';

const wm = new Watermark({
  content: '内部文档 | 请勿外传',
  width: 250,
  height: 150,
  fontColor: 'rgba(192, 192, 192, 0.3)',
  fontSize: '14px',
  rotate: 15,
  zIndex: 9999
});

// 创建水印
await wm.create();

// 销毁水印
wm.destroy();

// 带密码验证取消水印
await wm.cancelWithPassword();
```

#### 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 300 | 单个水印宽度(px) |
| height | number | 300 | 单个水印高度(px) |
| content | string | 'Watermark' | 水印文本内容 |
| contentType | string | 'text' | 内容类型: 'text' / 'multi-line-text' |
| fontColor | string | '#000000' | 字体颜色 |
| fontSize | string | '16px' | 字体大小 |
| rotate | number | 0 | 旋转角度(度) |
| zIndex | number | 9999 | 层级 |
| parent | string/HTMLElement | document.body | 父容器 |
| mode | string | 'single' | 模式: 'single' / 'multiple' |
| protect | boolean | true | 启用防篡改保护 |
| updateOnResize | boolean | true | 窗口变化时更新 |

### 国际化 (i18n)

```javascript
import { I18n } from 'flowtoolkit/language';

// 初始化
I18n.init({
  currentLang: 'zh-CN',
  debug: true
});

// 切换语言
I18n.changeLang('en-US');

// 获取翻译
const text = I18n.t('btn.submit');
const textWithVar = I18n.t('user.age', { age: 28 });
```

#### HTML 使用

```html
<!-- 基础文本替换 -->
<span data-i18n="btn.submit"></span>

<!-- 带变量 -->
<div data-i18n="user.age" data-i18n-age="28"></div>

<!-- 替换属性 -->
<input data-i18n="form.name" data-i18n-prop="placeholder">
<img data-i18n="img.desc" data-i18n-prop="alt">
```

#### 支持的属性类型

- `text` - 元素文本内容 (textContent)
- `html` - 元素 HTML 内容 (innerHTML)
- `input` - input 框 value
- `title` - title 属性
- `placeholder` - 占位符
- `alt` - 图片 alt 属性

### 工具函数

```javascript
import { dom, date, crypto } from 'flowtoolkit/utils';

// DOM 操作
dom.$('#id');                      // 选择元素
dom.create('<div>');               // 创建元素
dom.addClass(el, 'active');        // 添加类名
dom.removeClass(el, 'active');     // 移除类名
dom.on(el, 'click', fn);           // 事件绑定
dom.off(el, 'click', fn);          // 事件解绑

// 日期操作
date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
date.parse('2024-01-01');
date.addDays(new Date(), 7);
date.diffDays(date1, date2);

// 加密
crypto.md5('message');
crypto.sha256('message');
crypto.base64Encode('message');
crypto.base64Decode('encoded');
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 11
- Edge >= 79

## 项目结构

```
flowtoolkit/
├── src/
│   ├── modules/        # 功能模块
│   │   ├── watermark/
│   │   ├── language/
│   │   └── utils/
│   └── index.js       # 入口文件
├── dist/              # 构建输出
├── package.json
└── vite.config.js
```

## License

MIT License - see [LICENSE](LICENSE) file
