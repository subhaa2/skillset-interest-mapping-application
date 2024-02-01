import sys
import json
from openai import OpenAI
import string
clientOpenAI = OpenAI()

class Student:
    def __init__(self, admin_number, specialization, citizenship, gpa, tags):
        self.admin_number = admin_number
        self.specialization = specialization
        self.citizenship = citizenship
        self.gpa = gpa
        self.tags = tags
        # add proj rank

class ITPInternship:
    def __init__(self, opportunity_id, job_role, tags, citizen_type, vacancies):
        self.opportunity_id = opportunity_id
        self.job_role = job_role
        self.tags = tags
        self.citizen_type = citizen_type
        self.vacancies = vacancies
        # add proj type for prism

# student_data = [
#     Student("S0000001", "Software", "Singaporean", 3.8, ["Java", "Web Development", "App Development"]),
#     Student("S0000002", "UIUX Design", "PR", 3.6, ["Graphic Design", "UI/UX"]),
#     Student("S0000003", "Networking", "Others", 3.7, ["Python", "Cybersecurity"]),
#     Student("S0000004", "Media Tech Systems", "Singaporean", 3.5, ["Data Analysis", "Python"]),
#     Student("S0000005", "Software", "PR", 3.9, ["Cybersecurity", "Network Security"]),
#     Student("S0000006", "Chef", "Singaporean", 3.4, ["Cooking"]),
#     # Student("S0000007", "Networking", "Others", 3.2, ["Adobe Suite", "Photography"]),
#     # Student("S0000008", "Media Tech Systems", "PR", 3.8, ["Machine Learning", "R"]),
#     # Student("S0000009", "Software", "Singaporean", 3.6, ["Penetration Testing", "Network Security"]),
#     # Student("S0000010", "UIUX Design", "Others", 3.7, ["JavaScript", "React"])
# ]

# itp_internships = [
#     ITPInternship("INT001", "Software Developer", ["Java", "System Architecture"], "Singaporean/PR", 2),
#     ITPInternship("INT002", "Graphic Designer", ["Adobe Suite", "Graphic Design"], "All", 3),
#     ITPInternship("INT003", "Chef", ["Messing with Vegetables"], "Singaporean/PR", 4),
    # ITPInternship("INT004", "Network Engineer", ["Cisco Networking", "System Administration"], "Singaporean/PR", 3),
    # ITPInternship("INT005", "Multimedia Specialist", ["Adobe Creative Suite", "Graphic Design"], "All", 2),
    # ITPInternship("INT006", "Cloud Solutions Architect", ["AWS", "Cloud Security"], "Singaporean/PR", 4)
# ]


def best_company_match(student, companies):
    prompt = "Task: Rank all the companies provided based on how well their job roles and tags align with the student's interests (tags). Provide the ranking as a single line, comma-separated list of company IDs at the bottom. Format strictly as: 'Company 1 ID, Company 2 ID, ...'. Ensure all company IDs are included and separated by commas without any additional spaces or characters.\n\n"

    prompt += f"Student Profile - Specialization: {student.specialization}, Tags: {', '.join(student.tags)}\n"

    prompt += "Company Profiles:\n"
    for company in companies:
        prompt += f"Company ID: {company.opportunity_id}, Job Role: {company.job_role}, Tags: {', '.join(company.tags)}\n"

    prompt += "Provide the company IDs in a single line, comma-separated list, strictly in the format: Company 1 ID,Company 2 ID,...."
    
    response = clientOpenAI.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    output = response.choices[0].message.content
    sorted_companies = []

    last_line = output.strip().split('\n')[-1]
    company_ids = last_line.strip().split(",")
    sorted_companies = [company_id.strip() for company_id in company_ids]

    return sorted_companies

def allocate_students_to_internships(students, assignments, internships):
    sorted_students = sorted(students, key=lambda student: student.gpa, reverse=True)

    internship_vacancies = {internship.opportunity_id: internship.vacancies for internship in internships}

    final_allocations = {}

    for student in sorted_students:
        for preferred_internship in assignments[student.admin_number]:
            if internship_vacancies[int(preferred_internship)] > 0:
                final_allocations[student.admin_number] = preferred_internship
                internship_vacancies[int(preferred_internship)] -= 1
                break

    return final_allocations

def match_students_to_itp(students, internships):
    assignments = {}

    for student in students:
        # Step 1: Nationality Matching - Filter internships based on citizenship
        eligible_internships = []
        for internship in internships:
            if student.citizenship in ["Singaporean", "PR"]:
                eligible_internships.append(internship)
            elif student.citizenship == "Others" and "All" in internship.citizen_type:
                eligible_internships.append(internship)

        # Step 2: Find Best Matches - Use the best_company_match function for each student
        best_matches = best_company_match(student, eligible_internships)
        assignments[student.admin_number] = best_matches
    
    # Sort by GPA and allocate
    final_allocations = allocate_students_to_internships(students, assignments, internships)
    return final_allocations

if __name__ == "__main__":
    student = sys.argv[1]
    internship = sys.argv[2]

    student_data = json.loads(student)
    internship_data = json.loads(internship)

    students = [Student(**data) for data in student_data]
    internships = [ITPInternship(**data) for data in internship_data]

    final_allocations = match_students_to_itp(students, internships)

    json_output = json.dumps(final_allocations, indent=4)
    print(json_output)