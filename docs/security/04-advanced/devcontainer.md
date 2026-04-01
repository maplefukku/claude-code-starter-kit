# Docker / devcontainer での隔離実行

[< ガイドトップに戻る](../README.md)

---

## なぜ Docker で隔離？

Docker コンテナ内で Claude Code を実行すると、ホストマシン（あなたのパソコン）のファイルやシステムから完全に分離されます。

> **たとえるなら:** 「もう1台の別のパソコンの中で作業してもらう」ようなものです。万が一問題が起きても、あなたのパソコン本体には影響しません。

## 本ツールキットの devcontainer 設定

```json
{
  "name": "claude-code-secure",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "remoteUser": "vscode",
  "containerUser": "vscode",
  "runArgs": [
    "--memory=8g",
    "--cpus=4"
  ],
  "securityOpt": [
    "no-new-privileges:true"
  ]
}
```

### 各設定の意味

| 設定 | 効果 |
|------|------|
| `remoteUser: "vscode"` | root（管理者）ではなく一般ユーザーとして実行 |
| `--memory=8g` | メモリ使用量を8GBに制限 |
| `--cpus=4` | CPU使用を4コアに制限 |
| `no-new-privileges:true` | コンテナ内で権限昇格（より高い権限の取得）を禁止 |

## 使い方

1. VS Code に「Dev Containers」拡張機能をインストール
2. `.devcontainer/devcontainer.json` をプロジェクトルートに配置（テンプレートを使用）
3. VS Code で「Reopen in Container」を選択
4. コンテナ内で Claude Code を使用

## テンプレートの場所

```
.claude/skills/security-setup/templates/devcontainer.json
```

---

## 関連ドキュメント

- [Sandbox](../02-core-features/sandbox.md) — コンテナを使わない場合のOS レベル隔離
