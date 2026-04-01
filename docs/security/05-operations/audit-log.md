# セキュリティ監査ログの読み方

[< ガイドトップに戻る](../README.md)

---

## ログファイルの場所

```
.claude/security-audit.log
```

## ログの形式

各行がJSON形式で、1つのセキュリティイベントを記録しています。

```json
{
  "timestamp": "2026-04-01T02:49:42.315Z",
  "event": "UserPromptSubmit:BLOCKED",
  "detail": "Blocked: potential prompt injection detected (matched: '[SYSTEM]')"
}
```

| フィールド | 意味 |
|------------|------|
| `timestamp` | イベントが発生した日時（UTC） |
| `event` | イベントの種類（どの層で何が起きたか） |
| `detail` | 詳細情報（何がブロックされたか、何にマッチしたか） |

## イベントの種類

| イベント | 意味 |
|----------|------|
| `UserPromptSubmit:BLOCKED` | 第1層でプロンプトインジェクションを検出してブロック |
| `PreToolUse:BLOCKED:Bash` | 第2層で危険なBashコマンドをブロック |
| `PreToolUse:BLOCKED:File` | 第2層で機密ファイルへのアクセスをブロック |
| `PreToolUse:BLOCKED:Search` | 第2層で機密パスへの検索をブロック |
| `PostToolUse:WARNING` | 第3層でツール出力にインジェクションパターンを検出（警告） |

## ログの確認方法

```bash
# 最新のログを表示
cat .claude/security-audit.log

# ブロックされたイベントだけを表示
grep "BLOCKED" .claude/security-audit.log

# 今日のイベントだけを表示
grep "2026-04-01" .claude/security-audit.log

# イベント数を数える
wc -l .claude/security-audit.log
```

## ログの見方のポイント

> **ログにイベントが記録されていたら：** それは防御が正常に機能した証拠です。ただし、なぜそのイベントが発生したか（意図的なテストか、本当の攻撃か）を確認しましょう。

- `BLOCKED` イベント → 危険な操作が未然に防がれた
- `WARNING` イベント → 実行は完了しているが、不審なパターンが出力に含まれていた
- 短時間に大量のイベント → 攻撃の試みの可能性。入力元を確認する

---

## 関連ドキュメント

- [Hook Guard](../02-core-features/hook-guard.md) — ログを出力する3層防御の仕組み
- [定期監査のすすめ](audit-checklist.md) — 週次チェックリスト
