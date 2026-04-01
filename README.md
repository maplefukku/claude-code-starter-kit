# Claude Code Security Setup

Claude Codeのセキュリティ設定をインタラクティブにセットアップするスキルです。

## クイックスタート

```bash
# プロジェクトディレクトリで実行
npx claude-security-setup

# Claude Code を起動して実行
/security-setup
```

### 代替: bash でインストール

```bash
cd your-project
bash /path/to/claude-code-starter-kit/install.sh
```

## 設定可能な項目

`/security-setup` を実行すると、以下の項目を個別に選択してセットアップできます。

### コアセキュリティ

| 項目 | 内容 |
|------|------|
| **Permissions deny-first** | 50+の危険操作（rm -rf, sudo, curl\|bash, .envアクセス等）をdenyルールでブロック |
| **Hook Guard 3層防御** | プロンプトインジェクション検出・危険コマンド自動ブロック・ツール出力監視 |
| **Sandbox 強化** | ファイルシステム・ネットワークをOSレベルで制限（allowedDomainsカスタマイズ可） |
| **Planモードデフォルト化** | 実行前に必ず計画を確認するモードをデフォルトに |

### 追加ハードニング

| 項目 | 内容 |
|------|------|
| **CLAUDE.md セキュリティポリシー** | OWASP遵守・機密ファイル禁止・レビュー必須等のポリシーを追記 |
| **.gitignore 機密ファイル除外** | .env*, *.pem, *.key, credentials.json等をgitignoreに追加 |
| **Telemetry OFF** | テレメトリ送信を無効化 |
| **Bypass モード無効化** | bypassPermissionsモードの使用を禁止 |

### ガイダンス（手動設定）

セットアップ完了後、以下の手動設定についてもガイダンスが表示されます:

- **プライバシー設定**: claude.ai → Settings → Privacy → Help Improve Claude OFF
- **managed-settings.json**: チーム全員への設定強制（テンプレート付き）
- **devcontainer**: Docker隔離環境（テンプレート付き）
- **MCP制御**: 未使用MCPサーバーの削除
- **定期監査**: /permissions, /status, /hooks の定期実行

## Hook Guard（3層防御）

`hook_guard.mjs` は以下の3層でセキュリティを確保します（Node.jsで動作、Python不要）:

| 層 | イベント | 機能 |
|----|----------|------|
| 第1層 | UserPromptSubmit | プロンプトインジェクション検出（英語・日本語16+パターン） |
| 第2層 | PreToolUse | 危険コマンド（25+パターン）・機密ファイルアクセス（20+パターン）のブロック |
| 第3層 | PostToolUse | ツール出力に含まれるインジェクションパターンの監視・警告 |

ブロックイベントは `.claude/security-audit.log` に自動記録されます。

## テンプレート一覧

`templates/` ディレクトリに以下のテンプレートが含まれています:

| ファイル | 用途 |
|----------|------|
| `settings-permissions.json` | permissions deny-firstルール |
| `settings-sandbox.json` | sandbox設定 |
| `settings-hooks.json` | hooks設定 |
| `managed-settings.json` | チーム向けmanaged設定 |
| `devcontainer.json` | devcontainer設定 |
| `claude-md-security.md` | CLAUDE.mdセキュリティポリシー |
| `gitignore-additions.txt` | .gitignore追記パターン |

## セットアップ後の削除

`/security-setup` の最後に、スキル自体を削除するか選択できます。
削除しても、セットアップ済みの設定ファイル（settings.json, hook_guard.mjs, CLAUDE.md等）はそのまま残ります。

## ライセンス

MIT
