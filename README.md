### Deno CLI for ChatGPT API

> 使用该脚本需要准备好 OpenAI Key

个人用的极简的命令行工具，用来方便做一些小任务比如翻译、语法修改、生成 Git
Commit Message。

需要先安装 Deno 才能使用，用下面的方法把命令安装到本地（Deno 的沙盒能有效防止越
权操作，小脚本用起来更放心

```
deno install --allow-read --allow-env=HOME --allow-net=api.openai.com
```

Example

```
> ai
输入数字选择功能，下列功能将直接从剪贴板读取文本
1. 翻译至英文
2. 翻译至中文
3. 语法修正
4. Generate Git commit message (based on git diff --cached)
请输入 Prompt 或选择功能

```
