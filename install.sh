#!/bin/bash
# Claude Code Security Setup Skill - Bash Installer
#
# 使い方:
#   cd your-project && bash /path/to/install.sh
#   または
#   bash /path/to/install.sh /path/to/target-project
#
# npx claude-security-setup の代替として使用できます。
# インストール後、Claude Code で /security-setup を実行してセットアップを開始してください。

set -euo pipefail

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SOURCE="${SCRIPT_DIR}/.claude/skills/security-setup"

TARGET_DIR="${1:-.}"
TARGET_SKILL_DIR="${TARGET_DIR}/.claude/skills/security-setup"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} Claude Code Security Setup Installer${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 前提チェック
if [ ! -d "${SKILL_SOURCE}" ]; then
    error "スキルソースが見つかりません: ${SKILL_SOURCE}"
    error "このスクリプトはリポジトリルートから実行してください。"
    exit 1
fi

if [ ! -d "${TARGET_DIR}" ]; then
    error "対象ディレクトリが存在しません: ${TARGET_DIR}"
    exit 1
fi

# 既存チェック
if [ -d "${TARGET_SKILL_DIR}" ]; then
    warn "既にスキルがインストールされています: ${TARGET_SKILL_DIR}"
    read -p "上書きしますか？ (y/N): " answer
    if [[ ! "${answer}" =~ ^[Yy]$ ]]; then
        info "インストールを中止しました。"
        exit 0
    fi
fi

# コピー
info "スキルをインストール中..."
mkdir -p "${TARGET_SKILL_DIR}"
cp -r "${SKILL_SOURCE}/"* "${TARGET_SKILL_DIR}/"

ok "インストール完了!"
echo ""
echo -e "  インストール先: ${GREEN}${TARGET_SKILL_DIR}${NC}"
echo ""
echo -e "  ${YELLOW}インストールされたファイル:${NC}"
find "${TARGET_SKILL_DIR}" -type f | while read -r f; do
    rel="${f#${TARGET_SKILL_DIR}/}"
    echo -e "    ${GREEN}+${NC} ${rel}"
done
echo ""
echo -e "  ${YELLOW}次のステップ:${NC}"
echo -e "  1. 対象プロジェクトで Claude Code を起動"
echo -e "  2. ${GREEN}/security-setup${NC} を実行"
echo -e "  3. セキュリティ機能を選択してセットアップ完了"
echo ""
