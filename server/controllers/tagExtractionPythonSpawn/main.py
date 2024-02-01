import argparse
from openai import OpenAI
import string
clientOpenAI = OpenAI()

def extractTagsForCodingFrameworks(text):
    prompt = (
        "Your task is to analyze text inputs and generate relevant tags, focusing strictly on identifying specific technologies, programming languages, or concrete skills mentioned. Avoid making assumptions or inferring skills not explicitly stated. Here are some guidelines:\n\n"
        "1. Only include tags for technologies or skills that are explicitly mentioned.\n"
        "2. If the input is too broad or lacks specific references (like 'I like to code'), tag as 'General Coding' or 'Too General'.\n"
        "3. Do not infer or assume additional contexts or skills not clearly stated in the input.\n"
        "Analyze the following input and generate tags accordingly: " + text +
        "\nExpected output format: 'Tags: CSS, Java, Python'. Separate tags with commas. If the input is too general or lacks specific references, return 'General Coding' or 'No Relevant Context'."
    )
    response = clientOpenAI.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def extractTagsForCompanyInterests(text):
    prompt = (
        "Your task is to analyze text inputs and generate relevant tags, focusing strictly on identifying specific fields, industry sectors, or types of work related to companies, as mentioned. Avoid making assumptions or inferring details not explicitly stated. Here are some guidelines:\n\n"
        "1. Include tags for industry sectors, fields, or types of work explicitly mentioned, such as 'Machine Learning', 'Web Development', 'Finance', etc.\n"
        "2. If the input is too broad or lacks specific references to company interests (like 'I want to work at a big company'), tag as 'General Company Interest' or 'Too General'.\n"
        "3. Do not infer or assume specific company interests not clearly stated in the input.\n"
        "Analyze the following input and generate tags accordingly: " + text +
        "\nExpected output format: 'Tags: Machine Learning, Web Development'. Separate tags with commas. If the input is too general or lacks specific references, return 'General Company Interest' or 'No Relevant Context'."
    )
    response = clientOpenAI.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def convertTagsToArray(tags_string):
    # maybe add checks here in case form wrong
    clean_string = tags_string.replace("Tags:", "").strip()
    if clean_string in ['General Coding', 'No Relevant Context']:
        return []
    tags_array = [tag.strip() for tag in clean_string.split(',')]
    return tags_array

def standardizeTechName(tech_name):
    prompt = (
        "Convert the given technology name to its most commonly recognized and official version. For instance, 'Reactjs' should be standardized to 'React', 'Pyton' to 'Python', and 'javascrpt' to 'JavaScript'. Avoid adding unnecessary text like 'Standardization:' before the name. Simply provide the correct, official form of the technology name.\n\n"
        "Input Technology Name: " + tech_name +
        "\nStandardized Version:"
    )
    response = clientOpenAI.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    standardized_name = response.choices[0].message.content.strip()
    return standardized_name

def standardizeInterest(interests):
    prompt = (
        "Please process the following text by expanding any short forms or abbreviations to their full forms. Keep the output brief, ideally just a few words. For instance, 'Web Dev' should be converted to 'Web Development'. Here's the text I'd like you to transform: " + interests
    )
    response = clientOpenAI.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    standardized_name = response.choices[0].message.content.strip()
    return standardized_name

def standardizeTechNamesArray(tech_names_array):
    standardized_names = []
    for tech_name in tech_names_array:
        standardized_name = standardizeTechName(tech_name)
        standardized_names.append(standardized_name)
    return standardized_names

def remove_punctuation(text):
    return ''.join(char for char in text if char not in string.punctuation)

def standardizeInterestsArray(interests_array):
    standardizeInterests = []
    for interest in interests_array:
        standardized_name = standardizeInterest(interest)
        standardized_name = remove_punctuation(standardized_name)
        standardizeInterests.append(standardized_name)
    return standardizeInterests

def processTagsForLangsAndFrameworks(text):
    extracted_tags = extractTagsForCodingFrameworks(text)
    tags_array = convertTagsToArray(extracted_tags)
    standardized_names_array = standardizeTechNamesArray(tags_array)
    return standardized_names_array

def processTagsForCompanies(text):
    extracted_tags = extractTagsForCompanyInterests(text)
    tags_array = convertTagsToArray(extracted_tags)
    standardized_names_array = standardizeInterestsArray(tags_array)
    return standardized_names_array

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process text for extracting tags.')
    parser.add_argument('--function', type=str, help='Function to call')
    parser.add_argument('--text', type=str, help='Text to process', default='')
    parser.add_argument('--pdf', type=str, help='PDF path', default='')
    
    args = parser.parse_args()

    if args.function == 'parseData':
        result = parseData(args.pdf)
    elif args.function == 'processTagsForLangsAndFrameworks':
        result = processTagsForLangsAndFrameworks(args.text)
    elif args.function == 'processTagsForCompanies':
        result = processTagsForCompanies(args.text)
    else:
        result = 'Invalid function specified'

    print(result)