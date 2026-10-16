# Antigravity Rules — html-plan ワークフロー

> 本ファイルは `CLAUDE.md` と同じ行動規範を Antigravity エージェント向けにまとめたもの。内容を変更する場合は両方を同期すること。

## 必須ルール

1. **計画先行**: 機能開発・大幅なリファクタリングの前に、必ず `plans/current-plan.html` を作成または更新し、ユーザーに提示する。軽微な修正（誤字、コメント、判断分岐のない1ファイル内の修正）は対象外。
2. **回答待ち**: ユーザーが計画HTMLの `Copy response` で生成した `# Plan Response: …` を貼り付けるまで、`src/` 配下を変更しない。
3. **未決定があれば実装しない**: 回答の「未決定事項」が「なし」でなければ、計画を更新（`plan-meta.revision` +1）して再提示する。
4. **アーカイブ**: 実装完了後、計画HTMLを `plans/archive/YYYYMMDD-[機能名].html` に移動する（`git mv`）。

## 計画HTMLの作成手順

- `plans/templates/plan-template.html` をコピーして `plans/current-plan.html` を作る。
- 編集範囲は `<title>`、`#plan-meta`（JSON）、`<!-- PLAN:CONTENT:START -->`〜`END` の間のみ。`<style>` と末尾 `<script>` は変更しない。
- 外部CDN・外部ファイルを参照しない（ローカルでダブルクリックして単体動作すること）。

## 計画HTMLの設計制約

- **Claim ツリーは最大3階層**（`<details class="claim l1|l2|l3">`）
  - L1: UIモック / 状態図（ユーザーから見た主張）
  - L2: スキーマ / フロー（L1 を成立させる構造）
  - L3: 実ファイル / コード断片（具体的な変更点）
- **doc-ask を 2〜5 個**埋め込む（`<fieldset class="doc-ask" data-ask="A1" data-question="…">`）
  - 各選択肢に `data-label` と1行のメリット/デメリット
  - **推奨デフォルトに `checked`** を付ける
  - 選択に連動する表示は `data-when="A1=x|y;A2=z"` / `data-bind="A1"`
- **`Respond` と `Copy response` ボタンを維持**（テンプレート組み込み済み。削除しない）

## コミット規約

- **仕様合意コミット**（`plans/current-plan.html` のみ）と **実装コミット**（`src/` + アーカイブ移動）を分ける。
  - 例: `plan(hello-world): 仕様合意 rev2 (A1=日英切替)` → `feat(hello-world): 挨拶ページを実装`
- `plans/` 配下のHTMLは Git 管理対象（無視しない）。

## プロジェクトスキル

`.claude/skills/` に find-skills / graphify / explain / summarize / quiz と、汎用開発スキル50件（一覧は README）を置いている。コードを書き換えるスキルは変更理由と前後3行以上のコンテキストを示す。用途と導入ルールは `CLAUDE.md` の「7. プロジェクトスキル」を参照（同じルールに従う）。

- 外部スキルは導入前に SKILL.md を全文読む。導入はプロジェクト単位・コピー方式（`npx skills add ... --copy`）に限り、グローバル導入はしない。
- graphify は `graphify install --platform antigravity` で Antigravity にも登録できる（未導入。必要になったら実施）。
