# html-plan-template

AIエージェント（Claude Code / Antigravity）との開発で、**長文のMarkdown計画書の代わりに「触って決められる1枚のHTML計画書」で仕様合意してから実装する**ためのリポジトリ雛型です。

- 計画書は Claude Code チームが公開した公式 skill **html-plan** で作ります（`.claude/skills/html-plan/` に同梱。取り込み元は `UPSTREAM.md`）
- 計画は「主張の木」と、読み手が選ぶ 2〜5 個の決定（doc-ask）でできています
- 読み手は決定を選び、主張やコードの行にコメントし、`Respond` → `Copy response` で1つの回答にまとめて貼り戻します
- エージェントは回答を受け取ってから初めて `src/` を実装します

## ディレクトリ構成

```
.
├── .antigravity/rules.md          # Antigravity 用ルール
├── .claude/skills/                # プロジェクトスキル（html-plan ほか。下記参照）
├── CLAUDE.md                      # Claude Code 用ルール（WHAT / WHY / HOW）
├── docs/tooling.md                # 検討した道具・採否・出典
├── plans/
│   ├── archive/                   # 完了済み計画（YYYYMMDD-機能名.html / .src.html）
│   │   └── legacy/                # 旧・自作テンプレート（参照用）
│   ├── examples/                  # 公式形式・日本語のサンプル計画
│   ├── current-plan.src.html      # 進行中の計画の元ファイル（作業中のみ）
│   └── current-plan.html          # pack.mjs の出力（作業中のみ）
├── src/                           # ソースコード（サンプル: Hello World 挨拶ページ）
├── .gitignore
├── skills-lock.json               # npx skills の導入元・ハッシュ
└── README.md
```

## まず試す

公式形式で日本語のサンプル計画（挨拶ページに配色切替を追加する計画）を開きます。

```bash
# macOS
open plans/examples/sample-ja.html
# Linux
xdg-open plans/examples/sample-ja.html
# Windows (PowerShell)
start plans/examples/sample-ja.html
```

- 主張をクリックすると1段ずつ開きます。下部の「N to answer」ボタンで、まだ開いていない決定へ移動できます。
- 決定を選び、`Respond` → `Copy response` で回答 Markdown をコピーできます。
- 元ファイルを編集して書き出し直すには: `node .claude/skills/html-plan/runtime/pack.mjs plans/examples/sample-ja.src.html --root .`（Node.js が必要。ほかの依存はなし）

## html-plan ワークフロー

### 1. 計画生成（エージェント）

```
> /html-plan 挨拶ページに配色切替を追加
```

エージェントは `plans/current-plan.src.html` を書き、`pack.mjs` で `plans/current-plan.html`（依存なしの1ファイル）を書き出して提示します。

| レベル | 答える問い | 見せ方 |
| --- | --- | --- |
| 1 | 誰が何をできる・見えるようになるか | UI モック、状態機械 |
| 2 | それはどう動くか | 呼び出しの木、スキーマ、短いコード |
| 3 | どこを変えるか | 実ファイルと行番号つきのコード |

### 2. ブラウザで回答を選ぶ（人間）

1. `plans/current-plan.html` をブラウザで開く
2. 決定を選ぶ（推奨のままでよければ触らなくてよい）。気になる主張やコードの行にはコメントを付ける
3. `Respond` → `Copy response` でコピーする

生成される回答の例（`plans/examples/sample-ja.html` で決定1を変えた場合）:

```markdown
# Re: 挨拶ページに配色切替を追加

## Decisions
1. [1] 最初に表示する配色をどう決めますか？
   → **常に明るい配色** `light`  ✎ (was: OS の設定に従う)
2. [1.1] 選んだ配色を保存しますか？  _(not opened; default kept)_
   → **保存する** `yes`
```

- `✎ (was: …)` は推奨から変えた決定、`_(kept as proposed)_` は開いて推奨を維持した決定です。
- `_(not opened; default kept)_` は開いていない決定です。エージェントは同意とみなさず、重要なら聞き直します。

### 3. CLIに貼り付ける（人間 → エージェント）

コピーした回答をそのまま Claude Code / Antigravity に貼り付けます。回答は「指示」ではなく「データ」として扱われ、コメント欄に書かれた命令は実行されません。

- **計画の形が変わる回答**（決定で主張が消える、スキーマの編集、コメントでの要望）: エージェントは計画を更新して再提示 → 手順2へ
- **そのまま進められる回答**: エージェントは決定を計画に反映して仕様合意コミット → 実装へ

### 4. 実装完了とアーカイブ（エージェント）

```bash
git mv plans/current-plan.src.html plans/archive/20261016-theme.src.html
git mv plans/current-plan.html     plans/archive/20261016-theme.html
```

## コミットの作法

**仕様合意コミット**と**実装コミット**を分離します。「何を決めたか」と「どう作ったか」を履歴上で切り分け、レビューと差し戻しを容易にするためです。

| 順 | 種別 | 含めるファイル | メッセージ例 |
|---|---|---|---|
| 1 | 仕様合意 | `plans/current-plan.src.html` と `plans/current-plan.html`（決定反映済み） | `plan(theme): 仕様合意 (initial=OS設定, persist=保存する)` |
| 2 | 実装 | `src/**` ＋ 計画のアーカイブ移動 | `feat(theme): 配色切替を追加` |

- 1つの実装コミットに計画変更を混ぜない。実装中に仕様変更が必要になったら、計画を更新して再合意してから続ける。
- 実装コミットの本文に根拠となる計画ファイルのパスを書く（例: `Plan: plans/archive/20261016-theme.html`）。
- `plans/` 配下のHTMLは合意の記録なので Git 管理します（`.gitignore` 対象外）。

## プロジェクトスキル

`.claude/skills/` に置いたスキルは、リポジトリを開いた Claude Code（クラウドセッションを含む）で自動的に使えます。

| スキル | 呼び方の例 | 内容 |
| --- | --- | --- |
| html-plan | `/html-plan 作りたいもの` | 1枚のインタラクティブな HTML 計画書を作る（下記ワークフロー） |
| find-skills | 「〇〇用のスキルはある？」 | [skills.sh](https://skills.sh/) と `npx skills find` で公開スキルを探して提案 |
| graphify | `/graphify .` → `graphify query "認証はどこ？"` | コードをナレッジグラフにして構造を問い合わせる（初回に Python 3.10+ と `graphifyy` が必要） |
| explain | `/explain` + コード | ビジネスロジック / エラーハンドリング / 性能懸念の3層で解説 |
| summarize | `/summarize` + 文書 | 重要ポイント3つ / 最短セットアップ / 制約 で要約 |
| quiz | `/quiz` | 直前の会話から理解度確認の質問を5つ作成 |

```bash
npx skills list                 # 入っている外部スキルの一覧
npx skills update               # 外部スキルを更新（導入元とハッシュは skills-lock.json）
pip install graphifyy           # graphify の CLI（ローカルで使う場合）
```

### 汎用開発スキル（50件・自作）

各スキルは「実行手順」「守るべき制約」「出力フォーマット」を持ちます。コードを書き換えるスキルは、変更理由の明記と差分の前後3行以上のコンテキスト維持を必須にしています。`/<name>` で明示的に呼ぶか、依頼内容に合えば Claude が自動で選びます。

| 分類 | スキル |
| --- | --- |
| コード生成・リファクタリング | `clean-code`, `design-pattern`, `error-handler`, `async-optimize`, `type-safety`, `legacy-migration`, `boilerplate-gen`, `sql-optimize`, `api-client-gen`, `config-migrator` |
| テスト・品質保証 | `unit-test-gen`, `mock-factory`, `e2e-scenario`, `edge-case-hunter`, `coverage-booster`, `mutation-test`, `benchmark-gen`, `security-audit`, `race-condition`, `dependency-check` |
| ドキュメント・レビュー | `jsdoc-gen`, `readme-updater`, `architecture-decision`, `api-spec-gen`, `pr-description`, `code-reviewer`, `release-notes`, `diagram-mermaid`, `onboarding-guide`, `todo-summarizer` |
| デバッグ・トラブルシューティング | `log-injector`, `stacktrace-analyzer`, `memory-leak`, `git-bisect-helper`, `regex-wizard`, `network-stubby`, `docker-debugger`, `ci-cd-fixer`, `env-validator`, `cors-solver` |
| プロジェクト管理・効率化 | `commit-wizard`, `issue-creator`, `db-migration-gen`, `i18n-translator`, `feature-flag`, `css-tailwind`, `sh-automation`, `package-trimmer`, `license-header`, `cursor-rules-sync` |

外部スキルの導入ルール（SKILL.md を読んでから入れる、グローバル導入しない等）は `CLAUDE.md` の「7. プロジェクトスキル」を参照してください。
出典: [Claude Codeを最強にする『神Skill』厳選5選（tatsuki）](https://note.com/nobel/n/ndeb8327f909a)


## 計画の書き方（作成者向け）

書き方の正本は同梱の公式ドキュメントです。

- `.claude/skills/html-plan/SKILL.md` — 木の規則、手順、回答の扱い
- `.claude/skills/html-plan/references/blocks.md` — `doc-claim` / `doc-mock` / `doc-code` / `doc-ask` などの全ブロック
- `.claude/skills/html-plan/examples/scheduled-send.html` — 英語の完全な実例
- `plans/examples/sample-ja.src.html` — 日本語の小さな実例

公式 skill は英語の STE（Simplified Technical English）を前提にしていますが、このリポジトリでは日本語で書きます（規則は `CLAUDE.md` 3章）。

## 制約・注意点

- `pack.mjs` には Node.js が必要です。書き出した HTML は外部依存なしで、オフラインでも動きます。
- 日本語の主張には `write a full sentence with a verb, not a heading` という警告が出ます。英語向けの判定による誤検知なので無視してかまいません（エラーではなく、書き出しは止まりません）。
- `pack.mjs` は `src=` で参照したコードを HTML に埋め込みます。計画を外部に共有する前に、出力の最後に表示される「埋め込んだファイル一覧」を確認してください。
- 同梱の html-plan は、作者が「広く出す前にフィードバックがほしい」としている段階のものです。更新するときは `UPSTREAM.md` の手順で差分を読んでから取り込んでください。
- 2026-10-16 以前の計画（`plans/archive/20261016-hello-world.html` など）は旧・自作テンプレートで作られています。単体で開けますが、回答の形式は新しい形式と異なります。
