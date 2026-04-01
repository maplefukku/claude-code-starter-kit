# プライバシー設定

[< ガイドトップに戻る](../README.md)

---

## データの扱いについて

Claude Code を使用する際、入力されたデータがAIの学習に使われる可能性があります。業務で使用する場合は特に注意が必要です。

## 推奨設定

### 1. Help Improve Claude をOFF（重要）

**設定場所:** claude.ai → Settings → Privacy → 「Help Improve Claude」

- これにより、あなたのデータがAIのトレーニングに使われることを防ぎます
- データ保持期間は30日に固定されます

### 2. Telemetry OFF（オプション）

非必須のネットワーク通信を無効化します。

```json
// settings.json で設定する場合
{
  "env": {
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

> **注意:** feature flag評価も無効化されるため、一部機能に影響する場合があります。

### 3. サブプロセスの環境変数スクラブ

Claude Code が起動するサブプロセス（子プロセス）から、環境変数に含まれるシークレットを除去します。

```json
{
  "env": {
    "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB": "1"
  }
}
```

---

## 関連ドキュメント

- [チーム向け managed-settings](managed-settings.md) — チーム全体にプライバシー設定を強制する
