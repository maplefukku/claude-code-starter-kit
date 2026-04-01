# チーム・企業向けの設定（managed-settings）

[< ガイドトップに戻る](../README.md)

---

## managed-settings.json とは？

チームの管理者が、メンバー全員の Claude Code に**強制的に適用される設定**を定義するファイルです。

> **たとえるなら:** 会社のパソコンに入れるセキュリティソフトのグループポリシーのようなものです。個人が勝手にオフにすることはできません。

## 配置場所

| OS | パス |
|----|------|
| macOS | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| Linux | `/etc/claude-code/managed-settings.json` |
| Windows | `C:\Program Files\ClaudeCode\managed-settings.json` |

> `managed-settings.d/` ディレクトリにファイルを分割して配置することも可能です。

## 設定できる項目

```json
{
  "disableAutoMode": "disable",
  "allowManagedPermissionRulesOnly": true,
  "allowManagedHooksOnly": true,
  "allowManagedMcpServersOnly": true,
  "env": {
    "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB": "1"
  },
  "permissions": {
    "disableBypassPermissionsMode": "disable",
    "deny": [ ... ]
  },
  "sandbox": {
    "enabled": true,
    "network": {
      "allowManagedDomainsOnly": true,
      "allowedDomains": [ ... ]
    },
    "filesystem": {
      "allowManagedReadPathsOnly": true
    }
  }
}
```

## 設定項目の解説

| 設定 | 効果 |
|------|------|
| `disableAutoMode` | AIが自動で操作するモードを無効化（必ずユーザーに確認する） |
| `allowManagedPermissionRulesOnly` | 管理者が定義したPermissionsルールのみ有効にする |
| `allowManagedHooksOnly` | 管理者が定義したHooksのみ有効にする |
| `allowManagedMcpServersOnly` | 管理者が許可したMCPサーバーのみ使用可能にする |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` | サブプロセスの環境変数からシークレットを除去する |
| `disableBypassPermissionsMode` | Permissionsの迂回モードを無効化する |
| `allowManagedDomainsOnly` | 管理者が許可したドメインのみ通信可能にする |
| `allowManagedReadPathsOnly` | 管理者が許可したパスのみ読み取り可能にする |

## テンプレートの場所

本ツールキットにテンプレートが同梱されています。

```
.claude/skills/security-setup/templates/managed-settings.json
```

---

## 関連ドキュメント

- [Permissions](../02-core-features/permissions.md) — 個別プロジェクトのPermissions設定
- [Sandbox](../02-core-features/sandbox.md) — 個別プロジェクトのSandbox設定
