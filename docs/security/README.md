# Claude Code セキュリティガイド

> Claude Code を安全に使うための包括的なガイドです。  
> 専門知識がなくても読み進められるよう、用語にはできるだけ補足を添えています。

---

## ガイドの構成

### 1. 基礎知識 — まず読んでほしい内容

| ドキュメント | 内容 |
|-------------|------|
| [はじめに — なぜセキュリティが必要？](01-basics/introduction.md) | Claude Code のリスクと、このガイドの目的 |
| [5分でわかるリスクの全体像](01-basics/risk-overview.md) | 4つのリスクカテゴリの概要 |
| [防御アーキテクチャ](01-basics/architecture.md) | 多層防御の全体像を図解で理解する |

### 2. コア機能 — このツールキットの主要な防御

| ドキュメント | 内容 |
|-------------|------|
| [Permissions（許可ルール）](02-core-features/permissions.md) | 77個のdenyルールで危険な操作を自動ブロック |
| [Hook Guard（3層防御）](02-core-features/hook-guard.md) | プロンプトインジェクション検出・コマンドブロック・出力監視 |
| [Sandbox（サンドボックス）](02-core-features/sandbox.md) | OSレベルでファイル・ネットワークアクセスを制限 |
| [CLAUDE.md セキュリティポリシー](02-core-features/claude-md-policy.md) | AIへの行動規範を定義する |
| [.gitignore 設定](02-core-features/gitignore.md) | 機密ファイルをリポジトリから除外する |

### 3. 脅威の知識 — 何を守るのか理解する

| ドキュメント | 内容 |
|-------------|------|
| [プロンプトインジェクション](03-threat-knowledge/prompt-injection.md) | AIへの不正な指示の仕組みと防御 |
| [機密ファイルの取り扱い](03-threat-knowledge/sensitive-files.md) | 漏洩すると何が起きるか、どう守るか |
| [危険なコマンド一覧](03-threat-knowledge/dangerous-commands.md) | カテゴリ別の危険コマンドと危険度 |
| [Git 操作のセキュリティ](03-threat-knowledge/git-security.md) | 破壊的なGitコマンドと安全な代替手段 |
| [MCP・サブエージェントの安全管理](03-threat-knowledge/mcp-security.md) | 外部プラグインのリスクと対策 |
| [ネットワーク通信の制御](03-threat-knowledge/network-control.md) | 通信先の制限とカスタマイズ方法 |

### 4. 応用設定 — チーム・企業向け

| ドキュメント | 内容 |
|-------------|------|
| [チーム向け managed-settings](04-advanced/managed-settings.md) | メンバー全員に強制適用する設定 |
| [Docker / devcontainer 隔離実行](04-advanced/devcontainer.md) | コンテナ内での安全な実行環境 |
| [プライバシー設定](04-advanced/privacy.md) | データ利用・テレメトリの制御 |

### 5. 運用・リファレンス

| ドキュメント | 内容 |
|-------------|------|
| [定期監査のすすめ](05-operations/audit-checklist.md) | 週次チェックリスト |
| [監査ログの読み方](05-operations/audit-log.md) | security-audit.log のフォーマットと確認方法 |
| [トラブルシューティング](05-operations/troubleshooting.md) | よくある問題と対処法 |
| [用語集](05-operations/glossary.md) | 専門用語の読み方・意味 |

---

## クイックスタート

```bash
# 1. ツールキットをインストール
npx claude-security-setup

# 2. Claude Code を起動してセットアップ
claude
# Claude Code 内で:
/security-setup
```

セットアップウィザードが質問形式で案内します。すべての推奨項目を選択すれば、このガイドで説明した防御がすべて適用されます。

---

> **最終更新:** 2026-04-01  
> **対象バージョン:** claude-security-setup v1.0.3 / Claude Code v2.1.53+
