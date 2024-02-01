# Script Description

This Python script processes text for extracting tags. It provides different functions that can be called using command-line arguments.

## Command-Line Arguments

- `--function`: Specifies the function to call.
- `--text`: Provides text input for processing (default: '').
- `--pdf`: Specifies the path to a PDF file (default: '').

## Examples

1. To parse data from a PDF:
   `python script.py --function parseData --pdf /path/to/your.pdf`

2. To generate a job name from text:
   `python script.py --function generate_job_name --text "Job description text"`

3. To process tags for programming languages and frameworks from text:
   `python script.py --function processTagsForLangsAndFrameworks --text "Python, JavaScript"`

4. To process tags for companies from text:
   `python script.py --function processTagsForCompanies --text "Google, Microsoft"`

5. If an invalid function is specified:
   `python script.py --function invalidFunction`

Result: "Invalid function specified" will be printed.

**Note:**

- Replace `script.py` with the actual name of your Python script.
- Provide appropriate file paths and text inputs as needed for your specific use case.
