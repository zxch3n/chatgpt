# Deno CLI for ChatGPT API

> 使用该脚本需要准备好 OpenAI Key

个人用的极简的命令行工具，用来方便做一些小任务比如翻译、语法修改、生成 Git
Commit Message。

需要先安装 Deno 才能使用，用下面的方法把命令安装到本地（Deno 的沙盒能有效防止越
权操作，小脚本用起来更放心

例如它能够提供这样的授权提示

```
┌ ⚠️  Deno requests run access to "git".
├ Requested by `Deno.run()` API
├ Run again with --allow-run to bypass this prompt.
└ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all run permissions) >
```

## 安装

```
deno install -f --allow-read --allow-env=HOME --allow-net=api.openai.com https://github.com/zxch3n/chatgpt/raw/main/ai.ts
```

## Example

```
> ai
输入数字选择功能，下列功能将直接从剪贴板读取文本
1. 翻译至英文
2. 翻译至中文
3. 语法修正
4. Generate Git commit message (based on git diff --cached)
请输入 Prompt 或选择功能
 4

✅ Granted run access to "git".
The diff content length is 4498
The message is trimmed to 3000 characters

Generating commit message...

🤖 ChatGPT:

feat: Add Deno settings and CLI tool for ChatGPT API

This commit adds Deno settings to enable the Deno runtime and disable linting. Additionally, a new CLI tool has been added to perform tasks such as translation, syntax correction, and generating Git commit messages. The tool requires an OpenAI API key to function, which can be configured by running the installation command provided in the README file. This commit also includes a new `gitDiff` function in the `ai.ts` file to generate commit messages based on `git diff --cached`.

✅ Granted run access to "pbcopy".
✅ Commit message is copied to your clipboard.

```
