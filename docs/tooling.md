# 開発ツールの採否と出典

2026-10-16 に、計画「開発用プラグイン・スキルの導入計画」（`plans/archive/20261016-dev-plugins.html`）で決めた内容の記録です。
コマンドは、記載した一次情報（GitHub のマーケットプレイス定義・公式ドキュメント）で確認しています。

## 採用したもの

| 道具 | 入れ方 | 理由 | 出典 |
| --- | --- | --- | --- |
| html-plan（公式コミュニティ skill） | `.claude/skills/html-plan/` に同梱（commit `06ec7b6`） | 自作テンプレートより機能が多い（主張ごとのコメント、スキーマ編集、開いていない決定の区別、lint）。同梱ならクラウドセッションでも動く | [anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community/tree/main/html-plan) / [解説記事（まさお）](https://note.com/masa_wunder/n/n29b09dec1896) |
| find-skills / graphify / explain / summarize / quiz | `.claude/skills/` に配置 | 詳細は `CLAUDE.md` 7章 | [解説記事（tatsuki）](https://note.com/nobel/n/ndeb8327f909a) |

## 検討したが入れていないもの

必要になったら、下のコマンドで入れられます（ローカルの Claude Code で実行。クラウドセッションではプラグインは読み込まれません）。

| 道具 | 入れ方（確認済み） | 入れていない理由 | 出典 |
| --- | --- | --- | --- |
| Superpowers | `/plugin install superpowers@claude-plugins-official` | 計画を立てる工程（brainstorm / write-plan）が html-plan と重なり、計画の流れが2本になる | [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) / [解説記事（まさお）](https://note.com/masa_wunder/n/n47dd7fc0d68e) |
| Codex plugin | `/plugin marketplace add openai/codex-plugin-cc` → `/plugin install codex@openai-codex` | OpenAI のアカウントと Codex CLI が必要 | [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc) / [解説記事（まさお）](https://note.com/masa_wunder/n/n5766ec3023f1) |
| i-have-adhd | 未確認（入手元を一次情報で確認していない） | 記事の著者自身が「入れずに CLAUDE.md に写す」方法を勧めている | [解説記事（まさお）](https://note.com/masa_wunder/n/n5eb52cf9017c) |
| `/claude-api build-eval`・`hillclimb` | Claude Code に同梱（`claude update`） | AI アプリを作るときにだけ使う。このリポジトリは対象外 | [解説記事（まさお）](https://note.com/masa_wunder/n/n8adbb2f8bba8) |
| Claude Mods | Claude Code 2.1.287 以降で有効（記事による） | 上級者向け。今の目的に必要ない | [解説記事（まさお）](https://note.com/masa_wunder/n/nb279e587ae0e) |
| Cua Spaces | — | 方針として使わないと決めた | [解説記事（まさお）](https://note.com/masa_wunder/n/n059d77fe9a3f) |

## 前提にした公式ドキュメント

- リポジトリの `.claude/settings.json` で指定したプラグインは、クラウドセッションでは読み込まれない。`.claude/skills/` は読み込まれる — [Cloud environments: What carries over](https://code.claude.com/docs/en/cloud-environments#what-carries-over-from-your-setup)
- `enabledPlugins` / `extraKnownMarketplaces` の書式 — [Settings reference](https://code.claude.com/docs/en/settings-reference#enabledplugins)
- スキル一覧の文字数枠（モデルのコンテキストの1%）と description の上限（1,536文字） — [Skills](https://code.claude.com/docs/en/skills)
