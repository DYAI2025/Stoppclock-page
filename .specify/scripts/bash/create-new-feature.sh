#!/usr/bin/env bash
set -euo pipefail

# create-new-feature.sh - Initialize a new feature specification
# Usage: ./create-new-feature.sh --json "feature description" --short-name "feature-name"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
FEATURES_DIR="$REPO_ROOT/.specify/features"

# Parse arguments
JSON_OUTPUT=false
FEATURE_DESC=""
SHORT_NAME=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --json)
      JSON_OUTPUT=true
      FEATURE_DESC="$2"
      shift 2
      ;;
    --short-name)
      SHORT_NAME="$2"
      shift 2
      ;;
    *)
      FEATURE_DESC="$1"
      shift
      ;;
  esac
done

# Validate inputs
if [ -z "$FEATURE_DESC" ]; then
  echo "Error: Feature description required"
  exit 1
fi

if [ -z "$SHORT_NAME" ]; then
  echo "Error: --short-name required"
  exit 1
fi

# Generate branch name from short name
BRANCH_NAME="feature/$SHORT_NAME"

# Create feature directory
FEATURE_DIR="$FEATURES_DIR/$SHORT_NAME"
mkdir -p "$FEATURE_DIR"/{checklists,contracts,docs}

# Create spec file
SPEC_FILE="$FEATURE_DIR/spec.md"
touch "$SPEC_FILE"

# Create or switch to feature branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
  # Branch exists, check it out
  git checkout "$BRANCH_NAME" >/dev/null 2>&1
else
  # Create new branch
  git checkout -b "$BRANCH_NAME" >/dev/null 2>&1
fi

# Output results
if [ "$JSON_OUTPUT" = true ]; then
  cat <<EOF
{
  "BRANCH_NAME": "$BRANCH_NAME",
  "SPEC_FILE": "$SPEC_FILE",
  "FEATURE_DIR": "$FEATURE_DIR",
  "SHORT_NAME": "$SHORT_NAME",
  "DESCRIPTION": "$FEATURE_DESC"
}
EOF
else
  echo "Feature initialized:"
  echo "  Branch: $BRANCH_NAME"
  echo "  Spec: $SPEC_FILE"
  echo "  Directory: $FEATURE_DIR"
fi
