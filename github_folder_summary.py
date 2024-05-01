#TODO Command line arguments for the repo address and folder path and output file name (default to CONTENT_SUMMARY.md)
#TODO Add error handling for API calls
#TODO Add and display a file counter since the process is long-running
#TODO Upload/update the markdown file to the repository
#TODO If the file already exists, update it instead of creating a new one, and only process files modified after the last summary update 
#TODO Ignore dotfiles and folders(?) and the markdown file itself as well as a README.md file

import openai
from github import Github
import os

# Constants
REPO_NAME = "oaustegard/bookmarklets"
FOLDER_PATH = ""
MARKDOWN_FILENAME = "CONTENT_SUMMARY.md"
GITHUB_TOKEN = os.getenv("GitHub_Folder_Summarizer_PAT")
OPENAI_API_KEY = os.getenv("OpenAI_CodeSummarizer_PAT")

# Initialize GitHub and OpenAI APIs
g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)
openai.api_key = OPENAI_API_KEY


def get_file_summary(file_content):
    system_prompt = (
        "You are an assistant tasked with providing concise summaries of code files "
        "provided by the user. Make sure the summary does not exceed 150 tokens. "
        "Describe the functionality without referencing 'This file...'"
    )
    user_message = f"{file_content}\n"

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        max_tokens=150,  # Adjust this value as needed
        temperature=0.1
    )
    return response.choices[0].message.content.strip()


def generate_markdown_summary(repo, folder_path):
    markdown_content = f"# Index of Files in '{repo.full_name}/{folder_path}'\n\n"
    contents = repo.get_contents(folder_path)
    total_files = len(contents)
    
    for index, content_file in enumerate(contents, start=1):
        file_name = content_file.name
        file_url = content_file.html_url
        
        try:
            file_content = content_file.decoded_content.decode(errors='replace')
        except UnicodeDecodeError:
            print(f"Skipping file {file_name} due to decode error.")
            continue

        file_summary = get_file_summary(file_content)
        
        markdown_content += f"## [{file_name}]({file_url})\n\n"
        markdown_content += f"{file_summary}\n\n"
        
        # Print progress
        print(f"Processed file {index}/{total_files}: {file_name}")
    
    return markdown_content


def save_markdown_file(content, filename):
    with open(filename, "w") as f:
        f.write(content)
    print(f"Summary written to {filename}")

# Generate the markdown summary and save it to a file
markdown_summary = generate_markdown_summary(repo, FOLDER_PATH)
save_markdown_file(markdown_summary, MARKDOWN_FILENAME)
