#!/usr/bin/env bash
set -euo pipefail

# update-agent-context.sh - Update agent context file with feature information
# Usage: ./update-agent-context.sh <feature-dir>

FEATURE_DIR="$1"
CONTEXT_FILE="$FEATURE_DIR/.agent-context.md"

cat > "$CONTEXT_FILE" <<EOF
# Agent Context for Feature

This file contains context information for AI agents working on this feature.

## Feature Directory
$FEATURE_DIR

## Available Artifacts
$(ls -1 "$FEATURE_DIR"/*.md 2>/dev/null || echo "No artifacts yet")

## Last Updated
$(date)

EOF

echo "Agent context updated: $CONTEXT_FILE"
