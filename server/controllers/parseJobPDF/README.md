# PDF Job Parser

This script is designed to parse job information from a PDF file and generate job titles using the OpenAI GPT-4 model.

## Requirements

To run this script, you will need Python installed on your system and the following Python libraries:
- PyPDF2
- argparse
- openai

You can install the required packages using pip:

```bash
pip install PyPDF2 openai
```

## Usage

Run the script from the command line by providing the path to your PDF file as an argument:

```bash
python script_name.py /path/to/your/file.pdf
```

Replace `script_name.py` with the actual name of your Python script and `/path/to/your/file.pdf` with the path to the PDF file you wish to parse.

The script will output the parsed data, including company information and job details, to the command line.

## Output

The script will print a dictionary to the command line with the following structure:

```json
{
  "company_info": {
    "CompanyName": "Example Company Name",
    "Allowance": "Example Allowance"
  },
  "job_info": [
    {
      "JobName": "Generated Job Title",
      "JobDetails": "Details about the job",
      "IntendedLearningOutcomes": "Expected learning outcomes",
      "PreferredSkillSet": "Required skills for the job"
    },
  ]
}
```

Each `job_info` entry represents a job extracted from the PDF, with a generated job title based on the details provided.
