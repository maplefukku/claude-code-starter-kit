# ネットワーク通信の制御

[< ガイドトップに戻る](../README.md)

---

## なぜ制限が必要？

Claude Code が任意のウェブサイトと通信できると、以下のリスクがあります。

| リスク | 具体例 |
|--------|--------|
| データの外部送信 | コードの内容を外部サーバーにアップロード |
| 悪意あるスクリプトの取得 | 攻撃者のサーバーからマルウェアをダウンロード |
| 情報収集 | AIの動作状況を外部に報告 |

## デフォルトの許可ドメイン

本ツールキットでは、開発に最低限必要な9ドメインのみを許可しています。

| カテゴリ | ドメイン |
|----------|----------|
| GitHub | `github.com`, `api.github.com`, `*.github.com`, `objects.githubusercontent.com`, `raw.githubusercontent.com` |
| npm | `npmjs.org`, `registry.npmjs.org` |
| PyPI | `pypi.org`, `files.pythonhosted.org` |

**上記以外のサイトとの通信はすべてブロックされます。**

## ドメインの追加方法

プロジェクトで他のサービスが必要な場合は、`settings.json` で追加できます。

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

### ドメイン追加のベストプラクティス

- **本当に必要なドメインだけ** を追加する
- **ワイルドカード（`*`）の多用は避ける** — `*.example.com` より `api.example.com` を指定
- **追加したドメインを定期的に見直す** — 不要になったら削除

---

## 関連ドキュメント

- [Sandbox](../02-core-features/sandbox.md) — ネットワーク制限を含むOS レベル隔離の全体像
