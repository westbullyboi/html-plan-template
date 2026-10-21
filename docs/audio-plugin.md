# Audio Plugin 開発（APC フレームワーク）

正本の規則は `CLAUDE.md` 9章。本ファイルは初回セットアップと日常の手順を補足する。

## 構成

```
frameworks/audio-plugin-coder/   APC 本体（git submodule。編集しない）
audio-plugins/                   生成するプラグイン（本リポジトリで Git 管理。apc.config.json の plugins_dir）
plans/                           html-plan の計画（従来どおり）
```

## 初回セットアップ（1 回だけ）

1. submodule を取得する: `git submodule update --init frameworks/audio-plugin-coder`
2. APC の依存（JUCE 9、pluginval など）を取得する:
   `cd frameworks/audio-plugin-coder && git submodule update --init --recursive`（容量が大きい）
3. 前提ツールを確認する: macOS は `bash scripts/system-check.sh --human`（Xcode + CLT、CMake 3.22+、Node.js 18+、Python 3.8+、jq）。
4. `apc.config.example.json` を `frameworks/audio-plugin-coder/apc.config.json` にコピーし、次を変更する（または `/apc-setup` に任せる）:
   ```json
   "paths": { "plugins_dir": "../../audio-plugins" }
   ```
   `plugins_dir` は APC のルートからの相対パスで解決される（`bin/apc.js` の `path.resolve(ROOT, ...)`）。
5. 確認する: `node bin/apc.js paths` で `plugins_dir` が本リポジトリの `audio-plugins/` を指すこと、`node bin/apc.js doctor` で問題がないこと。

## 1 つのプラグインを作る流れ

| 段階 | やること | 担当 |
| --- | --- | --- |
| 1. 計画 | `/html-plan` で機能・UI 方針・フォーマット（VST3/AU/CLAP）・DSP 方針を合意 | Claude Code |
| 2. 仕様合意 | `# Re: …` を受け取り、仕様合意コミットを作る | Claude Code |
| 3. dream〜design | `/apc-dream <Name>` → `/apc-plan <Name>` → `/apc-design <Name>` | Claude Code（UI の確認は Antigravity 可） |
| 4. impl | `/apc-impl <Name>` | Claude Code |
| 5. test | `/apc-test <Name>`（pluginval など） | Claude Code / Antigravity |
| 6. ship | `/apc-ship <Name>`（`release/` に出力） | Claude Code |
| 7. アーカイブ | 計画を `plans/archive/` へ移し、実装コミット | Claude Code |

- フェーズごとに止まり、次のフェーズは明示して始める。
- 途中で AI を切り替えるときは `CLAUDE.md` 8章のハンドオフを使う。APC の `status.json` に現在のフェーズが残るので、ハンドオフにはそのフェーズ名を書く。

## 更新

- `git submodule update --remote frameworks/audio-plugin-coder` で最新へ上げ、`node bin/apc.js version` と `npm test` を確認してからコミットする。
- 更新は本リポジトリ側で別コミットにする（例: `chore(deps): APC を v1.9.0 に更新`）。

## 注意

- 導入時の APC は v1.8.0。CLAP 対応はベータ（APC README 記載）。
- `JUCE` は AGPLv3 または商用ライセンス。クローズドソースで配布する場合は商用ライセンスが必要。
- APC の `AGENTS.md` にある「AI の Co-Authored-By 禁止」は APC 自身向け。本リポジトリの規約には適用しない。
