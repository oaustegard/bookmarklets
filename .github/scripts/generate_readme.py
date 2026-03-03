#!/usr/bin/env python3
"""
Generate a README for a bookmarklet JS file using GitHub Models AI.

Usage:
    GITHUB_TOKEN=<token> python3 generate_readme.py <js_file>

Reads documentation standards from .claude/commands/document_command.md,
calls the GitHub Models inference API, and writes <basename>_README.md.
"""

import json
import os
import sys
import urllib.error
import urllib.request


def main():
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        print("Error: GITHUB_TOKEN not set", file=sys.stderr)
        sys.exit(1)

    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <bookmarklet.js>", file=sys.stderr)
        sys.exit(1)

    js_file = sys.argv[1]
    basename = js_file.removesuffix(".js")
    readme_file = f"{basename}_README.md"

    if not os.path.exists(js_file):
        print(f"Error: {js_file} not found", file=sys.stderr)
        sys.exit(1)

    # Reuse the existing /document command as the authoritative README spec
    doc_cmd = ".claude/commands/document_command.md"
    with open(doc_cmd) as f:
        doc_instructions = f.read()

    with open(js_file) as f:
        js_code = f.read()

    system_prompt = (
        "You are a documentation expert for the oaustegard/bookmarklets GitHub repo.\n"
        "Generate README files following the project documentation standards below.\n"
        "Output ONLY raw Markdown — no preamble, no wrapping code fence.\n\n"
        + doc_instructions
    )

    user_prompt = (
        f"Generate a README for this bookmarklet.\n\n"
        f"Filename : {js_file}\n"
        f"Basename : {basename}\n"
        f"README   : {readme_file}\n\n"
        f"Source code:\n```javascript\n{js_code}\n```"
    )

    payload = {
        "model": "openai/gpt-4o",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.3,
        "max_tokens": 2000,
    }

    req = urllib.request.Request(
        "https://models.github.ai/inference/chat/completions",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)

    content = result["choices"][0]["message"]["content"]

    with open(readme_file, "w") as f:
        f.write(content)

    print(f"Generated: {readme_file}")
    for line in content.splitlines()[:10]:
        print(f"  {line}")


if __name__ == "__main__":
    main()
