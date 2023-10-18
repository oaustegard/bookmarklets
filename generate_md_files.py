import os
import argparse
import openai
from pathlib import Path

def list_files(directory):
    return [f for f in directory.iterdir() if f.is_file()]

def read_file(file_path):
    with open(file_path, 'r') as f:
        return f.read()

def invoke_api(file_path, content):

    # check the content's length -- if longer than 10000 characters print a message and skip the file
    if len(content) > 10000:
        print(f"Skipping {file_path.name} because it is too long.")
        return ""

    prompt = f"""
Create Markdown documenting the following JavaScript bookmarklet's function and methodology
``` js
{content}
```
Strictly follow the format below:

# $(Bookmarklet Name)
## Use Case
$(use case)
## Code
``` js
$(the Code)
```
## Details
$(details about how code works, if warranted)"""

    response = openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
        temperature=0.2,
        max_tokens=1000,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response.choices[0].text.strip()

def write_markdown(file_path, content):
    with open(file_path, 'w') as f:
        f.write(content)

def main():
    # Initialize OpenAI API key
    openai.api_key = os.getenv("OPENAI_API_KEY")

    # CLI Argument Parsing
    parser = argparse.ArgumentParser(description='Generate Markdown documentation for files in a directory.')
    parser.add_argument('dir', type=str, help='The target directory containing files to document')
    parser.add_argument('--ignore', type=str, nargs='+', default=[], help='List of file names to ignore')
    args = parser.parse_args()

    # Read the directory
    target_dir = Path(args.dir)
    if not target_dir.is_dir():
        print("The provided path is not a directory.")
        exit(1)

    # Iterate through each file
    for file_path in list_files(target_dir):
        print(f"Generating documentation for {file_path.name}")
        if file_path.name in args.ignore:
            continue  # Skip if the file is in the ignore list
        md_file_path = target_dir / f"{file_path.stem}.md"
        if md_file_path.exists():
            continue  # Skip if .md file already exists
        content = read_file(file_path)
        md_content = invoke_api(file_path, content)
        write_markdown(md_file_path, md_content)


    print("Documentation generation complete.")

if __name__ == "__main__":
    main()
