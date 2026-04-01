# 機密ファイルの取り扱い

[< ガイドトップに戻る](../README.md)

---

## 機密ファイルとは？

「他人に見られたら困るファイル」のことです。具体的には以下のようなものです。

| ファイル | 中身 | 漏洩した場合のリスク |
|----------|------|---------------------|
| `.env` | パスワード、APIキー | サービスへの不正アクセス |
| `*.pem`, `*.key` | SSL/TLS証明書の秘密鍵 | 通信の盗聴、なりすまし |
| `id_rsa`, `id_ed25519` | SSH秘密鍵 | サーバーへの不正ログイン |
| `~/.aws/credentials` | AWSアクセスキー | クラウドリソースの不正利用（高額請求の恐れ） |
| `credentials.json` | GCPサービスアカウントキー | Google Cloudの不正利用 |
| `~/.kube/config` | Kubernetes認証情報 | コンテナ環境の不正操作 |
| `.npmrc`, `.pypirc` | パッケージレジストリの認証トークン | 不正パッケージの公開 |
| `terraform.tfstate` | インフラの状態ファイル | インフラ構成の漏洩、秘密値の暴露 |

## 本ツールキットでの保護

機密ファイルは **3重** に保護されています。

| 層 | 仕組み | 詳細 |
|----|--------|------|
| **Permissions** | `Read(**/.env*)` 等のルールで読み取り自体を禁止 | [Permissions](../02-core-features/permissions.md) |
| **Sandbox** | OSレベルでファイルへのアクセスをブロック | [Sandbox](../02-core-features/sandbox.md) |
| **Hook Guard** | ファイルパスのパターンマッチで検出・ブロック | [Hook Guard](../02-core-features/hook-guard.md) |

## もし機密ファイルをうっかり Git にコミットしてしまったら

### 最も重要なこと：シークレットの無効化

1. **即座にそのシークレットを無効化（ローテーション）する** — パスワード変更、APIキーの再発行など
2. Git の履歴からファイルを削除する（`git filter-branch` や BFG Repo-Cleaner を使用）
3. `.gitignore` に追加して再発防止

> **重要:** Git の履歴から削除しても、すでにフォーク・クローンされていれば取り返せません。**シークレットの無効化（ローテーション）が最優先**です。

---

## 関連ドキュメント

- [.gitignore 設定](../02-core-features/gitignore.md) — 機密ファイルの Git 除外パターン
- [Permissions](../02-core-features/permissions.md) — ファイルアクセスの禁止ルール
