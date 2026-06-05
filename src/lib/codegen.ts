// 把当前正则与 flags 导出为多种语言的可用代码片段。

export interface CodeSnippet {
  lang: string
  label: string
  code: string
}

function jsString(s: string): string {
  return JSON.stringify(s)
}

/** 转义用于双引号字符串字面量中的内容（Java / Python 普通字符串） */
function quoteString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function pythonFlags(flags: string): string {
  const map: Record<string, string> = {
    i: 're.IGNORECASE',
    m: 're.MULTILINE',
    s: 're.DOTALL',
    u: 're.UNICODE',
    x: 're.VERBOSE',
  }
  const used = [...flags].map((f) => map[f]).filter(Boolean)
  return used.length ? used.join(' | ') : '0'
}

function javaFlags(flags: string): string {
  const map: Record<string, string> = {
    i: 'Pattern.CASE_INSENSITIVE',
    m: 'Pattern.MULTILINE',
    s: 'Pattern.DOTALL',
    u: 'Pattern.UNICODE_CASE',
  }
  const used = [...flags].map((f) => map[f]).filter(Boolean)
  return used.length ? used.join(' | ') : '0'
}

export function generateSnippets(pattern: string, flags: string): CodeSnippet[] {
  const safePattern = pattern || ''

  const js = `const regex = new RegExp(${jsString(safePattern)}, ${jsString(flags)});

const text = "在这里放入待测试文本";
const matches = text.match(regex);
console.log(matches);`

  const py = `import re

pattern = re.compile(r"""${safePattern}""", ${pythonFlags(flags)})

text = "在这里放入待测试文本"
matches = pattern.findall(text)
print(matches)`

  const java = `import java.util.regex.*;

Pattern pattern = Pattern.compile("${quoteString(safePattern)}", ${javaFlags(flags)});

String text = "在这里放入待测试文本";
Matcher matcher = pattern.matcher(text);
while (matcher.find()) {
    System.out.println(matcher.group());
}`

  return [
    { lang: 'javascript', label: 'JavaScript', code: js },
    { lang: 'python', label: 'Python', code: py },
    { lang: 'java', label: 'Java', code: java },
  ]
}
