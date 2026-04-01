# トラブルシューティング

[< ガイドトップに戻る](../README.md)

---

## Q: 正当なコマンドがブロックされてしまう

Permissions のdenyルールが厳しすぎる場合があります。

**対処法:** `.claude/settings.json` の `permissions.allow` に許可ルールを追加してください。

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run deploy)"
    ]
  }
}
```

## Q: サンドボックスで必要なドメインにアクセスできない

**対処法:** `sandbox.network.allowedDomains` に必要なドメインを追加してください。

```json
{
  "sandbox": {
    "network": {
      "allowedDomains": [
        "github.com",
        "your-api.example.com"
      ]
    }
  }
}
```

## Q: Hook Guard がエラーを出す

Node.js がインストールされていないか、パスが通っていない可能性があります。

**確認方法:**

```bash
node --version  # v16.7.0 以上が必要
```

**対処法:** Node.js をインストールするか、バージョンを更新してください。

## Q: 設定が反映されない

設定ファイルの優先順位を確認してください。

```
優先度（高い方が優先）:
1. managed-settings.json（管理者設定） — 最も優先
2. ~/.claude/settings.json（ユーザーグローバル設定）
3. .claude/settings.json（プロジェクト設定）
4. .claude/settings.local.json（個人ローカル設定）
```

> `/status` コマンドで、どの設定ファイルが有効か確認できます。

## Q: セキュリティセットアップを初期状態に戻したい

```bash
# バックアップから復元（セットアップ時に自動作成されている場合）
cp .claude/settings.json.bak .claude/settings.json
```

## Q: 監査ログが大きくなりすぎた

```bash
# ログのサイズを確認
du -h .claude/security-audit.log

# 古いログをアーカイブして新しいログを開始
mv .claude/security-audit.log .claude/security-audit.log.old
```

---

## 関連ドキュメント

- [Permissions](../02-core-features/permissions.md) — 許可・禁止ルールの設定
- [Sandbox](../02-core-features/sandbox.md) — サンドボックスの設定
- [監査ログの読み方](audit-log.md) — ログの確認方法
