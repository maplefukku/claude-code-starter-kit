# Sandbox（サンドボックス）— OS レベルの隔離

[< ガイドトップに戻る](../README.md)

---

## サンドボックスとは？

サンドボックスとは、プログラムが動ける範囲を限定する仕組みです。

> **たとえるなら:** 子どもが遊ぶ「砂場（sandbox）」のように、「この囲いの中だけで遊んでね」と制限をかける仕組みです。Claude Code は砂場の外にあるファイルやネットワークにアクセスできなくなります。

## ファイルシステムの制限

### 読み取り禁止

以下のフォルダやファイルは、Claude Code から読み取ることができません。

| パス | 内容 |
|------|------|
| `~/.*` | ホームディレクトリの隠しファイル全般 |
| `/etc/**` | システム設定ファイル |
| `~/.ssh/**` | SSHの鍵ファイル（サーバー接続用の秘密鍵） |
| `~/.aws/**` | AWSの認証情報（クラウドサービスへのアクセスキー） |
| `~/.gnupg/**` | GPGの鍵（暗号化・署名用の秘密鍵） |
| `~/.kube/config` | Kubernetesの設定（コンテナ管理の認証情報） |
| `~/.docker/config.json` | Dockerの認証情報 |
| `**/.env*` | 環境変数ファイル（パスワード・APIキー等） |
| `**/*.pem`, `**/*.key` | 秘密鍵ファイル |
| `**/credentials.json` | 認証情報ファイル |

### 書き込み禁止

以下のファイルは、Claude Code で上書き・編集できません。

| パス | 理由 |
|------|------|
| `.claude/settings.json` | セキュリティ設定そのものの改ざん防止 |
| `.claude/settings.local.json` | 個人設定の改ざん防止 |
| `~/.claude/**` | グローバル設定の改ざん防止 |
| `~/.ssh/**`, `~/.aws/**`, `~/.gnupg/**` | 各種秘密鍵・認証情報の改ざん防止 |
| `~/.config/**` | アプリケーション設定の改ざん防止 |

## ネットワーク通信の制限

Claude Code が通信できるドメイン（ウェブサイト）を限定します。

**許可されるドメイン（デフォルト）：**

| ドメイン | 用途 |
|----------|------|
| `github.com`, `api.github.com`, `*.github.com` | GitHubでのコード管理 |
| `objects.githubusercontent.com` | GitHubの静的コンテンツ |
| `raw.githubusercontent.com` | GitHubの生ファイル |
| `npmjs.org`, `registry.npmjs.org` | Node.jsパッケージの取得 |
| `pypi.org`, `files.pythonhosted.org` | Pythonパッケージの取得 |

> **上記以外のサイトとの通信はすべてブロックされます。** 必要なドメインがある場合は、セットアップ時にカスタマイズできます。

## 重要な設定オプション

```json
{
  "sandbox": {
    "enabled": true,
    "allowUnsandboxedCommands": false,
    "failIfUnavailable": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"]
  }
}
```

| 設定 | 意味 |
|------|------|
| `enabled: true` | サンドボックスを有効にする |
| `allowUnsandboxedCommands: false` | サンドボックスの外でコマンドを実行することを禁止 |
| `failIfUnavailable: true` | サンドボックスが利用できない環境ではエラーにする（安全側に倒す） |
| `autoAllowBashIfSandboxed: true` | サンドボックス内であればBashコマンドを自動許可 |
| `excludedCommands: ["docker"]` | Docker コマンドはサンドボックスの対象外（Docker自体が隔離環境のため） |

## ドメインの追加方法

プロジェクトで他のサービスが必要な場合：

```json
{
  "sandbox": {
    "network": {
      "allowedDomains": [
        "github.com",
        "api.github.com",
        "your-api.example.com"
      ]
    }
  }
}
```

> **原則：** 本当に必要なドメインだけを追加してください。ワイルドカード（`*`）の多用は避けましょう。

---

## 関連ドキュメント

- [ネットワーク通信の制御](../03-threat-knowledge/network-control.md) — ネットワーク制限の背景と詳細
- [Permissions](permissions.md) — サンドボックスと連携するアプリケーション層の制御
