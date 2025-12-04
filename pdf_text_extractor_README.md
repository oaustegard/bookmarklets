# PDF Text Extractor

This bookmarklet redirects the current page to a PDF text extraction tool, passing the current URL as a parameter. It includes special handling for arXiv abstract pages, automatically converting them to their PDF versions.

## Purpose

Quickly extract text content from PDF files by redirecting to a hosted PDF text extraction tool at `austegard.com/web-utilities/pdf-text-extractor.html`. The tool is particularly useful for researchers working with arXiv papers, as it automatically handles abstract page URLs.

## Features

- **Universal PDF Extraction**: Works with any PDF URL by passing it to the extraction tool
- **arXiv Abstract Support**: Automatically converts arXiv abstract URLs (e.g., `arxiv.org/abs/2512.02543`) to PDF URLs (e.g., `arxiv.org/pdf/2512.02543.pdf`)
- **Simple Redirect**: Seamlessly redirects to the extraction tool with the appropriate URL
- **One-Click Operation**: Extract PDF text with a single bookmark click

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=pdf_text_extractor.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Extract PDF Text" or similar.
3. Set the URL to the JavaScript code found in [`pdf_text_extractor.js`](https://github.com/oaustegard/bookmarklets/blob/main/pdf_text_extractor.js).

## Usage

### For Regular PDF URLs
1. Navigate to any PDF file (or a page with a PDF URL)
2. Click the "Extract PDF Text" bookmarklet
3. You'll be redirected to the PDF text extraction tool with the URL pre-filled

### For arXiv Abstract Pages
1. Navigate to an arXiv abstract page (e.g., `https://arxiv.org/abs/2512.02543`)
2. Click the "Extract PDF Text" bookmarklet
3. The bookmarklet automatically converts the URL to the PDF version (`https://arxiv.org/pdf/2512.02543.pdf`)
4. You'll be redirected to the extraction tool with the PDF URL pre-filled

## How it Works

The bookmarklet performs the following steps:

1. **Captures Current URL**: Stores the current page's URL in a variable
2. **arXiv Detection**: Checks if the URL contains `arxiv.org` and `/abs/`
   - If detected, replaces `/abs/` with `/pdf/`
   - Ensures the URL ends with `.pdf` extension
3. **Redirect**: Navigates to `https://austegard.com/web-utilities/pdf-text-extractor.html` with the target URL as a query parameter

The extraction tool at the destination URL handles the actual PDF text extraction process.

## Technical Notes

- **Browser Compatibility**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- **arXiv URL Formats**: Handles both old and new arXiv identifier formats
- **URL Preservation**: For non-arXiv URLs, passes the current URL unchanged
- **Extraction Tool**: Requires the hosted PDF text extractor at austegard.com to be available

## Example Use Cases

- Extracting text from research papers on arXiv for citation or analysis
- Converting PDF content to searchable text
- Accessing PDF content on mobile devices where PDF viewers may be limited
- Quickly extracting text from technical documentation in PDF format

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
