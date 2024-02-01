## Usage

Run the script from the command line, passing the student data and internship data as JSON strings. The format for the command is:

```bash
python match_students.py '[student_data_json]' '[internship_data_json]'
```

### Data Format

- **Student Data**: A JSON array of students. Each student is a JSON object with the following fields:

  - `admin_number`: Student's admin number (string)
  - `specialization`: Student's area of specialization (string)
  - `citizenship`: Student's citizenship status ("Singaporean", "PR", or "Others") (string)
  - `gpa`: Student's GPA (float)
  - `tags`: List of tags representing interests or skills (array of strings)

- **Internship Data**: A JSON array of internships. Each internship is a JSON object with the following fields:
  - `opportunity_id`: Internship's unique ID (string)
  - `job_role`: Role offered in the internship (string)
  - `tags`: List of tags relevant to the internship (array of strings)
  - `citizen_type`: Citizenship requirement for the internship ("Singaporean/PR" or "All") (string)
  - `vacancies`: Number of available slots (integer)

### Example Command

```bash
python match_students.py '[{"admin_number":"S0000001","specialization":"Software","citizenship":"Singaporean","gpa":3.8,"tags":["Java", "Web Development"]}]'/////'[{"opportunity_id":"INT001","job_role":"Software Developer","tags":["Java", "System Architecture"],"citizen_type":"Singaporean/PR","vacancies":2}]'
```
