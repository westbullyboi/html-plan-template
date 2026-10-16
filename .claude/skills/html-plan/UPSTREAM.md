# html-plan（同梱版）の取り込み元

| 項目 | 値 |
| --- | --- |
| 取り込み元 | https://github.com/anthropics/claude-plugins-community/tree/main/html-plan |
| コミット | `06ec7b6a0a82bdc4bec44bd82d4368c42f20d7c1`（2026-10-13） |
| 作者 | Thariq Shihipar |
| バージョン | 1.0.0（`UPSTREAM-plugin.json`） |
| ライセンス | plugin.json の記載は MIT。取り込み元リポジトリ全体は Apache-2.0（`LICENSE` に全文を同梱） |

`skills/html-plan/` 以下を**無改変**でコピーしている（`LICENSE`・`UPSTREAM-plugin.json`・本ファイルのみ追加）。
挙動を変えたい場合はファイルを編集せず、リポジトリの `CLAUDE.md` にルールを書く。

## 同梱にした理由

リポジトリの `.claude/settings.json` でマーケットプレイスのプラグインを有効にしても、クラウドセッションでは読み込まれない。
`.claude/skills/` はクラウドセッションでも読み込まれるため、同梱にした（2026-10-16 時点の公式ドキュメント
https://code.claude.com/docs/en/cloud-environments#what-carries-over-from-your-setup ）。

## 更新手順

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/anthropics/claude-plugins-community.git /tmp/cpc
git -C /tmp/cpc sparse-checkout set html-plan
git -C /tmp/cpc log -1 --format='%H %cd'          # 新しいコミットを確認
diff -r /tmp/cpc/html-plan/skills/html-plan .claude/skills/html-plan   # 差分を読んでから取り込む
cp -r /tmp/cpc/html-plan/skills/html-plan/. .claude/skills/html-plan/
cp /tmp/cpc/html-plan/.claude-plugin/plugin.json .claude/skills/html-plan/UPSTREAM-plugin.json
```

取り込んだら、本ファイルのコミットとバージョンを更新し、`plans/examples/sample-ja.src.html` を pack して動作を確認する。
