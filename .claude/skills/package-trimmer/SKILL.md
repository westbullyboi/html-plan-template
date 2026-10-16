---
name: package-trimmer
description: package.json、requirements.txt、pyproject.toml、go.mod などから、使われていない依存ライブラリを特定する。depcheck、knip、deptry などのツールと、import の検索を組み合わせ、誤検出を除いたうえで削除を提案する。依存を整理してインストール時間やサイズを減らしたいときに使う。
---
# 指示
使われていないと確認できたものだけを、削除候補として提示する。

## 実行手順
1. パッケージマネージャと依存の定義ファイルを確認する。
2. ツールがあれば実行する（depcheck / knip / deptry など）。なければ、各依存について import・require の使用を検索する。
3. 誤検出を除外する：設定ファイルからだけ参照されるもの（eslint プラグイン、babel プリセット）、CLI として scripts から使われるもの、型定義（@types）、ピア依存、動的 import、プラグインとして文字列で読み込まれるもの。
4. 結果を3つに分類する：削除してよい / 要確認 / dependencies と devDependencies の配置が誤っている。
5. 削除は了承を得てから行い、ビルド・テスト・lint を実行して確認する。

## 守るべき制約
- 一度に大量に削除しない。まとまりごとに削除して確認する。
- lock ファイルはパッケージマネージャのコマンドで更新する（手で編集しない）。
- 削除の理由（参照がないことの根拠）を項目ごとに示す。

## 出力フォーマット
```
## 削除候補
| パッケージ | 分類 | 根拠 |
## 要確認
## 配置の誤り（dependencies ↔ devDependencies）
## 削除後の確認結果（build / test / lint）
```
