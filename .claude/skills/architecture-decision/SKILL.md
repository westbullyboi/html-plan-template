---
name: architecture-decision
description: ADR（Architecture Decision Record）を作成する。背景、検討した選択肢、決定、結果（トレードオフ）を記録する。技術選定や設計方針を決めたとき、または決めた理由を残したいときに使う。
---
# 指示
決定そのものより、「なぜそう決めたか」と「何を諦めたか」を残す。

## 実行手順
1. 既存の ADR の置き場所（docs/adr/ など）と形式・連番を確認する。なければ docs/adr/ を提案する。
2. ユーザーから、決定内容・背景・制約を聞き取る。不足していれば質問する。
3. 選択肢を最低2つ挙げ、それぞれの長所・短所を整理する。
4. 決定と、その結果として受け入れるトレードオフを書く。
5. 関連する ADR（置き換える・置き換えられる）があればリンクする。

## 守るべき制約
- ユーザーが決めていないことを決定として書かない（未決定なら Status を Proposed にする）。
- 事実と推測を区別し、根拠となる資料があればリンクする。
- 既存の ADR を書き換えない（置き換える場合は新しい ADR で Superseded とする）。

## 出力フォーマット
```
# ADR-NNNN: <タイトル>
- Status: Proposed | Accepted | Superseded by ADR-XXXX
- Date: YYYY-MM-DD
## Context
## Options
### Option A / Option B（長所・短所）
## Decision
## Consequences（良い点・悪い点・今後の課題）
```
