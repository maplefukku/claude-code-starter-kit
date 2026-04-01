# .gitignore — 機密ファイルをリポジトリから除外する

[< ガイドトップに戻る](../README.md)

---

## なぜ重要？

`.gitignore` に登録されたファイルは、Git（バージョン管理システム）の追跡対象から外れます。つまり、`git add` や `git commit` で誤ってリポジトリに含めてしまうことを防ぎます。

> **たとえるなら:** 「この書類はコピー機に入れないでください」というラベルを貼るようなものです。

## 本ツールキットで追加されるパターン

| パターン | 説明 |
|----------|------|
| `.env`, `.env.*`, `.env.local`, `.env.production` | 環境変数ファイル（パスワード・APIキー等を含む） |
| `*.pem`, `*.key`, `*.secret` | 秘密鍵・シークレットファイル |
| `*.p12`, `*.pfx`, `*.jks`, `*.keystore` | 証明書ストア（暗号化された証明書の保管ファイル） |
| `credentials.json`, `serviceAccountKey.json`, `token.json` | 各種認証情報ファイル |
| `.npmrc`, `.pypirc`, `.netrc` | パッケージマネージャの認証設定 |
| `id_rsa`, `id_ed25519`, `*.pub` | SSHの鍵ファイル |
| `.terraform/`, `terraform.tfstate*` | Terraform（クラウドインフラ管理ツール）の状態ファイル |
| `.claude/settings.local.json` | Claude Code の個人設定 |
| `.claude/security-audit.log` | セキュリティ監査ログ |
| `.docker/config.json` | Docker の認証情報 |

## 注意事項

> `.gitignore` に追加しても、**すでに Git で追跡済みのファイルは除外されません。** 過去にコミットしてしまったファイルは別途対処が必要です。

### すでにコミットしてしまったファイルの除外方法

```bash
# Git の追跡対象から外す（ファイル自体は削除しない）
git rm --cached .env

# コミットする
git commit -m "remove tracked .env file"
```

> 過去の履歴にもファイルが残っている場合は、`git filter-branch` や BFG Repo-Cleaner を使った履歴の書き換えが必要です。

---

## 関連ドキュメント

- [機密ファイルの取り扱い](../03-threat-knowledge/sensitive-files.md) — 各ファイルの詳細なリスク解説
