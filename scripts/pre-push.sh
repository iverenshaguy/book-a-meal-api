#!/bin/sh
# Run lint and related tests only for JS files changed vs the upstream branch.

UPSTREAM=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)

if [ -n "$UPSTREAM" ]; then
  CHANGED=$(git diff --name-only "$UPSTREAM"...HEAD | grep -E '\.(js|jsx)$')
else
  # New branch with no upstream yet — compare with the merge base of main
  BASE=$(git merge-base HEAD main 2>/dev/null)
  if [ -n "$BASE" ]; then
    CHANGED=$(git diff --name-only "$BASE"...HEAD | grep -E '\.(js|jsx)$')
  else
    CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | grep -E '\.(js|jsx)$')
  fi
fi

# Filter out deleted files — only lint/test files that exist on disk
CHANGED=$(echo "$CHANGED" | while read -r f; do [ -f "$f" ] && echo "$f"; done)

if [ -z "$CHANGED" ]; then
  echo "No changed JS files detected, skipping pre-push checks."
  exit 0
fi

CHANGED_FILES=$(echo "$CHANGED" | tr '\n' ' ')
echo "Running pre-push checks on: $CHANGED_FILES"

./node_modules/.bin/eslint $CHANGED_FILES || exit 1
NODE_ENV=test ./node_modules/.bin/jest --findRelatedTests --passWithNoTests --runInBand --forceExit $CHANGED_FILES
