# Wix Content Extractor

Extract clean content elements from Wix-generated HTML, removing all the Wix framework code.

## Usage

### Option 1: Extract from a file
```bash
python3 extract_content.py index.html
```

### Option 2: Extract from a URL
```bash
python3 extract_content.py --url https://your-wix-site.com
# or
python3 extract_content.py https://your-wix-site.com
```

### Option 3: Paste content directly
If you have HTML content, save it to a file first, then run:
```bash
python3 extract_content.py your-file.html
```

## Output

The script creates `extracted_content.html` with:
- Clean, readable HTML structure
- All text content extracted
- Images (if any)
- No Wix framework code
- No scripts or tracking code

## What gets extracted

- Headings (h1-h6)
- Paragraphs
- Lists
- Links
- Images
- Table content
- Other text elements

## What gets removed

- Wix-specific classes and IDs
- Data attributes
- Script tags
- Style tags
- Framework code
- Tracking code
# vsa
