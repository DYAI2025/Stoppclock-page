#!/usr/bin/env bash
set -euo pipefail

# check-prerequisites.sh - Validate prerequisites for a speckit command
# Usage: ./check-prerequisites.sh <command-name> <feature-dir>

COMMAND="$1"
FEATURE_DIR="$2"

case "$COMMAND" in
  clarify|plan)
    if [ ! -f "$FEATURE_DIR/spec.md" ]; then
      echo "Error: spec.md not found. Run /speckit.specify first."
      exit 1
    fi
    ;;
  tasks)
    if [ ! -f "$FEATURE_DIR/spec.md" ] || [ ! -f "$FEATURE_DIR/plan.md" ]; then
      echo "Error: spec.md and plan.md required. Run /speckit.specify and /speckit.plan first."
      exit 1
    fi
    ;;
  implement)
    if [ ! -f "$FEATURE_DIR/tasks.md" ]; then
      echo "Error: tasks.md not found. Run /speckit.tasks first."
      exit 1
    fi
    ;;
  *)
    echo "Unknown command: $COMMAND"
    exit 1
    ;;
esac

echo "Prerequisites validated for $COMMAND"
