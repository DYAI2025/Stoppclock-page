#!/usr/bin/env bash
set -euo pipefail

# setup-plan.sh - Initialize planning artifacts for a feature
# Usage: ./setup-plan.sh <feature-dir>

if [ $# -eq 0 ]; then
  echo "Usage: $0 <feature-dir>"
  exit 1
fi

FEATURE_DIR="$1"

# Create planning artifacts
touch "$FEATURE_DIR/plan.md"
touch "$FEATURE_DIR/data-model.md"
touch "$FEATURE_DIR/research.md"
touch "$FEATURE_DIR/quickstart.md"
mkdir -p "$FEATURE_DIR/contracts"

echo "Planning artifacts created in $FEATURE_DIR"
