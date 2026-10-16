# html-plan-template

AIエージェント（Claude Code / Antigravity）との開発で、**長文のMarkdown計画書の代わりに「触って決められる1枚のHTML計画書」で仕様合意してから実装する**ためのリポジトリ雛型です。

- 計画は `plans/current-plan.html` の1枚に集約（外部依存なし、ダブルクリックで開ける）
- 読み手は実装の分岐点（**doc-ask**）をラジオボタン/チェックボックスで選ぶだけ
- `Respond` → `Copy response` で回答がMarkdown化され、そのままCLIに貼り付けられる
- エージェントは回答を受け取ってから初めて `src/` を実装する

## ディレクトリ構成

```
.
├── .antigravity/rules.md          # Antigravity 用ルール
├── CLAUDE.md                      # Claude Code 用ルール
├── plans/
│   ├── archive/                   # 完了済み計画（YYYYMMDD-機能名.html）
│   │   └── 20261016-hello-world.html  # サンプル計画（1サイクル完了済み）
│   ├── templates/plan-template.html  # 計画HTMLのひな型
│   └── current-plan.html          # 進行中の計画（作業中のみ存在。完了後は archive/ へ移動）
├── src/                           # ソースコード（サンプル: Hello World 挨拶ページ）
├── .gitignore
└── README.md
```

## まず試す

同梱のサンプル（Hello World 挨拶ページ）は、計画 → 回答 → 実装 → アーカイブの1サイクルを完了した状態です。計画HTMLと、その計画から実装した成果物を見比べられます。

```bash
# macOS
open plans/archive/20261016-hello-world.html   # サンプル計画
open src/index.html                             # 実装結果
# Linux
xdg-open plans/archive/20261016-hello-world.html
xdg-open src/index.html
# Windows (PowerShell)
start plans/archive/20261016-hello-world.html
start src/index.html
```

- アーカイブ済みの計画も操作できます。選択を切り替えるとモックやコード断片が変わり、`Respond` で回答Markdownが生成されることを確認できます（合意済みの記録なので、ファイル自体は編集しません）。
- 回答待ちの状態から試したい場合は、テンプレートをコピーして新しい計画を作ってください。
  ```bash
  cp plans/templates/plan-template.html plans/current-plan.html
  ```
- コミット履歴（`git log --oneline`）で、仕様合意コミットと実装コミットが分かれていることも確認できます。

## html-plan ワークフロー

### 1. 計画生成（エージェント）

エージェントに機能を依頼すると、実装前に `plans/current-plan.html` を作成/更新して提示します。

```
> 挨拶ページを作りたい。まず計画を出して
```

計画HTMLの構成:

| 要素 | 内容 |
| --- | --- |
| Claim ツリー（最大3階層） | L1: UIモック/状態図 → L2: スキーマ/フロー → L3: 実ファイル/コード断片 |
| doc-ask（2〜5個） | 実装の分岐点。推奨デフォルトが選択済み（「推奨」バッジ付き） |
| 決定バー（画面上部） | 決定数・保留数・推奨からの変更数 |
| Respond エリア（画面下部） | 全体コメント、回答Markdown生成、コピー |

### 2. ブラウザで回答を選ぶ（人間）

1. 計画HTMLをブラウザで開く
2. 各 doc-ask で選択（推奨のままでよければ触らなくてよい）
   - 決めきれない項目は「保留（後で決める）」にチェック
   - 項目ごとのメモ欄、画面下部の全体コメントに補足を書く
3. `Respond` で回答Markdownを生成 → `Copy response` でコピー

生成される回答の例:

```markdown
# Plan Response: Hello World 挨拶ページ 実装計画

- plan-id: `20261016-hello-world`
- revision: 1
- source: `plans/current-plan.html`
- responded-at: 2026-10-16T01:33:40.737Z

## 決定事項
- [A1] 表示言語をどうするか → **日英切替ボタン**（推奨から変更 / 推奨: 日本語のみ）
  - メモ: ボタンは右上に
- [A2] ユーザー操作をどこまで入れるか → **名前入力で挨拶を更新**（推奨どおり）

## 未決定事項
- なし

## コメント
- なし

## 指示
上記の決定に従って実装を開始してください。仕様合意コミット → 実装コミットの順で分けること。
```

### 3. CLIに貼り付ける（人間 → エージェント）

コピーした回答をそのまま Claude Code / Antigravity のプロンプトに貼り付けます。

- **未決定事項がある場合**: エージェントは実装せず、計画を更新（revision +1）して再提示 → 手順2に戻る
- **未決定事項がない場合**: エージェントは計画HTMLに決定を反映して仕様合意コミット → 実装へ

### 4. 実装完了とアーカイブ（エージェント）

1. 決定事項に従い `src/` を実装し、計画の受け入れ基準で検証
2. 計画HTMLを `plans/archive/YYYYMMDD-[機能名].html` へ移動
   ```bash
   git mv plans/current-plan.html plans/archive/20261016-hello-world.html
   ```
3. 実装コミットを作成。次の機能はテンプレートから新しい `current-plan.html` を作る

## コミットの作法

**仕様合意コミット**と**実装コミット**を分離します。「何を決めたか」と「どう作ったか」を履歴上で切り分け、レビューと差し戻しを容易にするためです。

| 順 | 種別 | 含めるファイル | メッセージ例 |
| --- | --- | --- | --- |
| 1 | 仕様合意 | `plans/current-plan.html`（決定反映済み） | `plan(hello-world): 仕様合意 rev2 (A1=日英切替, A3=Vanilla JS)` |
| 2 | 実装 | `src/**` ＋ 計画HTMLのアーカイブ移動 | `feat(hello-world): 挨拶ページを実装` |

- 1つの実装コミットに計画変更を混ぜない。実装中に仕様変更が必要になったら、計画を更新して再合意（新たな仕様合意コミット）してから続ける。
- 実装コミットの本文に根拠となる計画ファイルのパスを書く（例: `Plan: plans/archive/20261016-hello-world.html`）。
- `plans/` 配下のHTMLは合意の記録なので Git 管理します（`.gitignore` 対象外）。

## 計画テンプレートの記法（作成者向け）

テンプレートを複製したら、`<title>`・`#plan-meta`・`PLAN:CONTENT` マーカー間のみ編集します。

```html
<!-- doc-ask: checked を付けた選択肢が推奨デフォルト -->
<fieldset class="doc-ask" data-ask="A1" data-question="表示言語をどうするか">
  <legend><span class="id">A1</span>表示言語をどうするか</legend>
  <label class="opt"><input type="radio" name="A1" value="ja" data-label="日本語のみ" checked>
    <span><span class="t">日本語のみ</span><span class="d">メリット / デメリット</span></span></label>
  <label class="opt"><input type="radio" name="A1" value="ja-en" data-label="日英切替">
    <span><span class="t">日英切替</span><span class="d">メリット / デメリット</span></span></label>
</fieldset>

<!-- 選択に連動する表示（; = AND, | = OR） -->
<p data-when="A1=ja-en">切替ボタンを表示</p>
<p>現在: <b data-bind="A1"></b></p>
```

## 制約・注意点

- クリップボードAPIが使えない環境では自動的に `execCommand('copy')` にフォールバックします。それも失敗した場合はテキストエリアから手動でコピーしてください。
- 選択状態はブラウザに保存されません（再読み込みで推奨デフォルトに戻ります）。回答は生成したMarkdownで受け渡してください。
- `:has()` セレクタ（選択中の枠線強調）は最新の主要ブラウザで動作します。非対応ブラウザでも機能自体は動きます。
