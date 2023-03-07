import { ChatGPTAPI } from "npm:chatgpt";
import { clipboard } from "https://gist.githubusercontent.com/zxch3n/923a35474c957a4085bedb2444d09eb8/raw/f640fc40619dbf106afe2b70b942a588f8b2a805/clipboard.ts";

const KEY_PATH = Deno.env.get("HOME") + "/.config/openaiapi.txt";
let KEY = "";
if (!KEY) {
  try {
    KEY = await Deno.readTextFile(KEY_PATH);
  } catch (_) {
    KEY = prompt("Please input your OpenAI API key") || "";
    if (KEY.startsWith("sk")) {
      await Deno.writeTextFile(KEY_PATH, KEY);
      console.log("The key is written to " + KEY_PATH);
    } else {
      console.log("Invalid API key");
      Deno.exit();
    }
  }
}

const INPUT = "请输入文本:\n";

// deno run --allow-read --allow-net=api.openai.com --allow-run=pbpaste chat.ts
export async function translateToChinese(s: string) {
  const api = new ChatGPTAPI({
    apiKey: KEY,
  });

  const res = await api.sendMessage("请帮我把下面这段话翻译成中文\n" + s);
  console.log("🤖 ChatGPT:\n");
  console.log(res.text);
}

export async function translateToEnglish(s: string) {
  const api = new ChatGPTAPI({
    apiKey: KEY,
  });

  const res = await api.sendMessage("请帮我把下面这段话翻译成英文\n" + s);
  console.log("🤖 ChatGPT:\n");
  console.log(res.text);
}

export async function revise(s: string) {
  const api = new ChatGPTAPI({
    apiKey: KEY,
  });

  const res = await api.sendMessage(
    "Please help me revise the following text\n" + s,
  );
  console.log("🤖 ChatGPT:\n");
  console.log(res.text);
}

export async function gitDiff() {
  const process = Deno.run({
    cmd: ["git", "diff", "--cached"],
    stdout: "piped",
  });
  const decoder = new TextDecoder();
  const output = await process.output();
  let diff = decoder.decode(output);
  const api = new ChatGPTAPI({
    apiKey: KEY,
  });
  diff = diff.replace(/\s+/g, " ");
  console.log("The diff content length is " + diff.length);
  if (diff.length > 3000) {
    console.log("The message is trimmed to 3000 characters");
    diff = diff.slice(0, 3000);
  }

  console.log("\n\n");
  console.log("Generating commit message...");
  const r = await api.sendMessage(
    `Write a commit message for the following diff\n\n\n${diff}`,
    {
      systemMessage:
        "You are a helpful assistant writes git commit messages in conventional commit format",
    },
  );

  console.log("\n\n");
  console.log("🤖 ChatGPT:\n");
  console.log(r.text);
  console.log("");
  await clipboard.writeText(r.text);
  console.log("✅ Commit message is copied to your clipboard.");
}

export async function interactive(initPrompt: string | undefined) {
  const api = new ChatGPTAPI({
    apiKey: KEY,
  });
  let parentMsg: string | undefined;
  while (true) {
    const s = initPrompt || prompt(INPUT) || "";
    initPrompt = undefined;
    if (s.toLocaleLowerCase() == "exit") {
      break;
    }

    const res = await api.sendMessage(s, { parentMessageId: parentMsg });
    parentMsg = res.parentMessageId;
    console.log(res.text);
  }
}

async function main() {
  console.log("输入数字选择功能，下列功能将直接从剪贴板读取文本");
  console.log("1. 翻译至英文");
  console.log("2. 翻译至中文");
  console.log("3. 语法修正");
  console.log("4. Generate Git commit message (based on git diff --cached)");
  const choiceOrPrompt = prompt("请输入 Prompt 或选择功能\n") || "";
  if (choiceOrPrompt.length == 1) {
    switch (choiceOrPrompt) {
      case "1":
        translateToEnglish(await clipboard.readText() || "");
        break;
      case "2":
        translateToChinese(await clipboard.readText() || "");
        break;
      case "3":
        revise(await clipboard.readText() || "");
        break;
      case "4":
        gitDiff();
        break;
      default:
        console.log("Unknown choice");
    }
  } else {
    interactive(choiceOrPrompt);
  }
}

main();
