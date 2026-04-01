---
name: security-setup
description: Claude Codeのセキュリティ設定をインタラクティブにセットアップする。permissions deny-first、sandbox強化、3層Hook Guard、CLAUDE.mdポリシー、.gitignore強化、telemetry OFF等を個別に選択して一括構成。
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# Claude Code セキュリティセットアップスキル

このスキルはClaude Codeのセキュリティ設定をインタラクティブにセットアップします。
以下の手順を**必ず順番に**実行してください。

---

## Step 0: 現状確認

以下のファイルの存在と内容を確認してください:

1. `.claude/settings.json` — 既存設定があればマージする必要がある
2. `.claude/settings.local.json` — 個人設定の有無
3. `CLAUDE.md` — 既存のセキュリティポリシーの有無
4. `.gitignore` — 現在のignoreパターン
5. `.claude/scripts/hook_guard.mjs` — 既存のHook Guardの有無

各ファイルの有無と、既存settings.jsonの主要な設定キー（permissions, hooks, sandbox等）をユーザーに簡潔に報告してください。

---

## Step 1: コアセキュリティ機能の選択

**AskUserQuestionツール**を使って、以下のように質問してください:

- question: "どのコアセキュリティ機能を設定しますか？"
- header: "Core"
- multiSelect: true
- options:
  1. label: "Permissions deny-first（推奨）"
     description: "rm -rf、sudo、curl|bash、.envアクセス等50+の危険操作をdenyルールでブロック"
  2. label: "Hook Guard 3層防御（推奨）"
     description: "プロンプトインジェクション検出・危険コマンド自動ブロック・出力監視をPythonスクリプトで実行"
  3. label: "Sandbox 強化"
     description: "ファイルシステム・ネットワークをOSレベルで制限。allowedDomainsのカスタマイズ可能"
  4. label: "Planモードデフォルト化"
     description: "defaultMode: plan を設定。実行前に必ず計画を確認するモードをデフォルトに"

---

## Step 2: 追加ハードニングの選択

**AskUserQuestionツール**を使って、以下のように質問してください:

- question: "追加のハードニングを選択してください"
- header: "Hardening"
- multiSelect: true
- options:
  1. label: "CLAUDE.md セキュリティポリシー（推奨）"
     description: "機密ファイル禁止・危険コマンド禁止・OWASP遵守・レビュー必須等のポリシーをCLAUDE.mdに追記"
  2. label: ".gitignore 機密ファイル除外（推奨）"
     description: ".env*, *.pem, *.key, credentials.json, settings.local.json等をgitignoreに追加"
  3. label: "Telemetry OFF"
     description: "環境変数 CLAUDE_CODE_ENABLE_TELEMETRY=0 を設定してテレメトリ送信を無効化"
  4. label: "Bypass モード無効化"
     description: "disableBypassPermissionsMode を設定してbypassPermissionsモードの使用を禁止"

---

## Step 3: 条件付きフォローアップ質問

### Sandbox を選択した場合

**AskUserQuestionツール**で追加ドメインを確認してください:

- question: "Sandbox のネットワーク制限に追加するドメインはありますか？デフォルト: github.com, api.github.com, npmjs.org, registry.npmjs.org, pypi.org, files.pythonhosted.org"
- header: "Domains"
- multiSelect: false
- options:
  1. label: "デフォルトのまま"
     description: "上記6ドメインのみ許可"
  2. label: "カスタマイズする"
     description: "追加したいドメインを入力（Other を選択して入力）"

ユーザーが「カスタマイズする」またはOtherを選んだ場合、入力されたドメインをsandbox設定に追加してください。

---

## Step 4: 設定ファイルの作成・更新

選択された項目に応じて以下を実行してください。

### 4-1: settings.json の構築

**重要なマージルール:**
- 既存の `.claude/settings.json` がある場合は、Readツールで読み取る
- 既存の permissions.deny 配列がある場合は、新しいルールを**追加**（重複は排除）
- 既存の permissions.allow, hooks, sandbox 等の他のキーは**保持**
- 既存にないキーのみ追加する

以下の各テンプレートをReadツールで `${CLAUDE_SKILL_DIR}/templates/` から読み取り、選択された項目に応じてマージしてください:

#### Permissions deny-first を選択した場合
- `${CLAUDE_SKILL_DIR}/templates/settings-permissions.json` を読み取り
- `permissions.deny` 配列の全ルールをマージ
- `_comment` キーは設定ファイルに含めない

#### Sandbox 強化を選択した場合
- `${CLAUDE_SKILL_DIR}/templates/settings-sandbox.json` を読み取り
- `sandbox` オブジェクト全体をマージ
- Step 3で追加ドメインがあれば `sandbox.network.allowedDomains` に追加
- `_comment` キーは設定ファイルに含めない

#### Hook Guard を選択した場合
- `${CLAUDE_SKILL_DIR}/templates/settings-hooks.json` を読み取り
- `hooks` オブジェクトをマージ（既存のhooksがあれば各イベントの配列に追加）
- `_comment` キーは設定ファイルに含めない

#### Planモードデフォルト化を選択した場合
- `"defaultMode": "plan"` を追加

#### Telemetry OFF を選択した場合
- `"env": { "CLAUDE_CODE_ENABLE_TELEMETRY": "0" }` を追加（既存envとマージ）

#### Bypass モード無効化を選択した場合
- `"disableBypassPermissionsMode": "disable"` を追加

最終的なJSONをWriteツールで `.claude/settings.json` に書き込んでください。

### 4-2: Hook Guard スクリプトのコピー（選択時のみ）

1. `${CLAUDE_SKILL_DIR}/scripts/hook_guard.mjs` をReadツールで読み取り
2. `.claude/scripts/` ディレクトリが存在しない場合は `mkdir -p .claude/scripts` をBashで実行
3. Writeツールで `.claude/scripts/hook_guard.mjs` に書き込み

### 4-3: CLAUDE.md セキュリティポリシー追記（選択時のみ）

1. `${CLAUDE_SKILL_DIR}/templates/claude-md-security.md` をReadツールで読み取り
2. 既存の `CLAUDE.md` がある場合:
   - 既に `## Security Policy` セクションがあれば「既にセキュリティポリシーが存在します。上書きしますか？」とAskUserQuestionで確認
   - なければ末尾に追記
3. 既存の `CLAUDE.md` がない場合: 新規作成（セキュリティポリシーの内容のみ）

### 4-4: .gitignore 強化（選択時のみ）

1. `${CLAUDE_SKILL_DIR}/templates/gitignore-additions.txt` をReadツールで読み取り
2. 既存の `.gitignore` がある場合:
   - 各行をチェックし、まだ含まれていないパターンのみ追記
3. `.gitignore` がない場合: 新規作成

---

## Step 5: ガイダンス表示

以下のガイダンスをユーザーに表示してください。これらは手動設定が必要な項目です。

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 追加で推奨する手動セキュリティ設定
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. プライバシー設定（重要）
   claude.ai → Settings → Privacy → 「Help Improve Claude」をOFF
   → トレーニングデータへの利用を防止（30日保持に固定）

2. managed-settings.json（チーム/企業向け）
   チーム全員に設定を強制するには managed-settings.json を配置:
   - macOS: /Library/Application Support/ClaudeCode/managed-settings.json
   - Linux: /etc/claude-code/managed-settings.json
   - Windows: C:\Program Files\ClaudeCode\managed-settings.json
   テンプレート: .claude/skills/security-setup/templates/managed-settings.json

3. devcontainer（隔離環境）
   Docker/devcontainer での隔離実行を推奨。
   テンプレート: .claude/skills/security-setup/templates/devcontainer.json

4. MCP サーバー制御
   未使用のMCPサーバーは削除。必要なものだけ明示的に許可。
   /mcp で現在の状態を確認。

5. 定期監査コマンド（週1推奨）
   - /permissions — 現在の全ルール一覧
   - /status — どの階層の設定が有効か確認
   - /hooks — 有効なHooks一覧

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 6: セットアップ完了レポート

以下のサマリーを表示してください:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ セキュリティセットアップ完了
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

適用した設定:
  - [各選択項目を箇条書き]

作成/更新したファイル:
  - [ファイルパス一覧]

deny ルール数: [N] 個
Hooks: [有効/無効]
Sandbox: [有効/無効]
Default Mode: [plan/default]

次のアクション:
  1. /permissions で設定を確認
  2. /hooks でHook Guardの登録を確認
  3. 必要に応じて .claude/settings.json を手動調整
  4. チーム利用の場合は managed-settings.json を検討

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 7: スキルの削除確認

**AskUserQuestionツール**で以下を確認してください:

- question: "セキュリティセットアップが完了しました。このセットアップスキル自体を削除しますか？（セットアップ済みの設定ファイル・スクリプトは残ります）"
- header: "Cleanup"
- multiSelect: false
- options:
  1. label: "削除する"
     description: ".claude/skills/security-setup/ ディレクトリを削除。設定ファイルやhook_guard.mjsには影響なし"
  2. label: "残す"
     description: "スキルを残す。再実行や設定の追加・更新に使える"

ユーザーが「削除する」を選んだ場合:
- Bashツールで `rm -r .claude/skills/security-setup/` を実行
- `.claude/skills/` が空になった場合は `rmdir .claude/skills/` も実行
- 「スキルを削除しました。設定ファイルはそのまま残っています。」と伝える

ユーザーが「残す」を選んだ場合:
- 「スキルを残しました。設定を変更したい場合は /security-setup で再実行できます。」と伝える
