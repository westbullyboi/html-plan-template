# 複数 AI の使い分けと引き継ぎ

正本の短い規則は `CLAUDE.md` 8章。本ファイルは判断の目安と手順を補足する。役割は既定値であり、プロジェクトの状況に合わせて書き換えてよい（`CLAUDE.md`・`.antigravity/rules.md`・本ファイルを同期する）。

## 入口ファイル

| CLI | 読み込むファイル | 内容 |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` | 正本 |
| Antigravity | `.antigravity/rules.md` | 同等ルール |
| Gemini CLI | `GEMINI.md` | `CLAUDE.md` 参照の薄いファイル |
| Freebuff | `AGENTS.md` | `CLAUDE.md` 参照の薄いファイル（※下記） |

※ Freebuff が `AGENTS.md` を読むかは未検証。読まない場合は、起動時に「`AGENTS.md` を読んでください」と指示する。

## どの CLI を使うか

1. 仕様が未確定、または判断分岐がある → **Claude Code**（`/html-plan`）。
2. 画面を作る・ブラウザで動作を確認する・独立した複数タスクを並列に進める → **Antigravity**。
3. 大量のファイルやログを読んで要約する（変更しない） → **Gemini CLI**。
4. 機械的で影響範囲が小さい作業（雛形、置換、テスト追加） → **Freebuff**。
5. 実装後のレビュー・決定との整合確認・アーカイブ → **Claude Code**。

## 引き継ぎの流れ

```
切り替え元                          切り替え先
 1. WIP コミット                     5. .handoff/current.md を読む
 2. .handoff/current.md を書く       6. git status / git log -5 で照合
 3. （必要なら）ユーザーに報告       7. 「次の一手」から再開
 4. CLI を切り替える                 8. 終了時にハンドオフを更新
```

- 使い切りの制限（レート制限など）で突然止まる場合に備え、区切りごとに（機能の一部が動いた時点で）ハンドオフを更新しておく。
- 雛形は `docs/handoff-template.md`。`.handoff/` は `.gitignore` 済みで、コミットしない。
- 引き継ぎ後に決定と矛盾する変更が必要になったら、実装を止めて Claude Code で計画を更新する（`CLAUDE.md` 5章）。
