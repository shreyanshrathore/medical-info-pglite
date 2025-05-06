#!/bin/bash

# Check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo "git-filter-repo not found. Please install it first:"
    echo "  pip install git-filter-repo"
    exit 1
fi

# Author details
NEW_AUTHOR_NAME="shreyanshrathore"
NEW_AUTHOR_EMAIL="shreyanshrathore75649@gmail.com"

# Start time for commits (modify as needed)
START_DATE="2025-05-04 00:00:00 +0530"
TIME_INTERVAL=$((3 * 60 * 60)) # 3 hours in seconds

# Generate rewrite rules
TEMP_FILE="rewrite-rules.txt"
echo "" > "$TEMP_FILE"

COMMIT_COUNTER=0
CURRENT_DATE=$(date -j -f "%Y-%m-%d" "$START_DATE" "%Y-%m-%d")

git log --reverse --format='%H %an <%ae>' | while read -r COMMIT_HASH AUTHOR_DETAILS; do
    # Increment commit counter and date
    COMMIT_COUNTER=$((COMMIT_COUNTER + 1))
    CURRENT_DATE=$(($CURRENT_DATE + $TIME_INTERVAL))

    # Adjust date for the last few commits
    if [ "$COMMIT_COUNTER" -gt 5 ]; then
        if [ "$COMMIT_COUNTER" -eq 8 ]; then
            CURRENT_DATE=$(date -j -f "%Y-%m-%d" "2025-05-06 09:00:00 +0530" "%Y-%m-%d")
        else
            CURRENT_DATE=$(($CURRENT_DATE + $TIME_INTERVAL))
        fi
    fi

    NEW_DATE=$(date -d "@$CURRENT_DATE" +"%Y-%m-%dT%H:%M:%S%z")
    echo "commit $COMMIT_HASH"
    echo "    author-name $NEW_AUTHOR_NAME"
    echo "    author-email $NEW_AUTHOR_EMAIL"
    echo "    author-date $NEW_DATE"
    echo "    committer-name $NEW_AUTHOR_NAME"
    echo "    committer-email $NEW_AUTHOR_EMAIL"
    echo "    committer-date $NEW_DATE"
    echo "" >> "$TEMP_FILE"
done

# Apply the rewrite rules
echo "Rewriting history..."
git filter-repo --replace-message "$TEMP_FILE"

# Cleanup temporary files
rm "$TEMP_FILE"

echo "History updated successfully!"
