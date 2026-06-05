// 常用正则示例预设，点击即可载入到编辑器与测试区。

export interface Preset {
  label: string
  pattern: string
  flags: string
  sample: string
}

export const PRESETS: Preset[] = [
  {
    label: '中国手机号',
    pattern: '1[3-9]\\d{9}',
    flags: 'g',
    sample: '联系我：13800138000，备用号 19912345678，错误号 12345。',
  },
  {
    label: '电子邮箱',
    pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.-]+',
    flags: 'g',
    sample: '邮件 alice@example.com 与 bob.dev+test@mail.co.uk 都有效。',
  },
  {
    label: 'URL 链接',
    pattern: 'https?:\\/\\/[^\\s]+',
    flags: 'g',
    sample: '访问 https://example.com/path?q=1 或 http://a.cn 了解更多。',
  },
  {
    label: '日期 YYYY-MM-DD',
    pattern: '(\\d{4})-(\\d{2})-(\\d{2})',
    flags: 'g',
    sample: '起止日期 2024-01-15 至 2025-12-31，无效 2024/01。',
  },
  {
    label: 'IPv4 地址',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    flags: 'g',
    sample: '网关 192.168.1.1，DNS 8.8.8.8，环回 127.0.0.1。',
  },
  {
    label: '十六进制颜色',
    pattern: '#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b',
    flags: 'g',
    sample: '主色 #6366f1，强调 #fff，背景 #0f172a。',
  },
  {
    label: '中文字符',
    pattern: '[\\u4e00-\\u9fa5]+',
    flags: 'g',
    sample: 'Hello 世界，这是 mixed 混合文本 123。',
  },
  {
    label: '身份证号(18位)',
    pattern: '\\d{17}[\\dXx]',
    flags: 'g',
    sample: '示例 11010519491231002X 与 110105199003074258。',
  },
]
