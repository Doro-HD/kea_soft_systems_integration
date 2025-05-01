import requests
from bs4 import BeautifulSoup


def main():
    html = requests.get('https://en.wikipedia.org/wiki/List_of_Monty_Python_projects').text
    parsed_html = BeautifulSoup(html, 'lxml')

    projects = {}
    current_category = None

    tags = parsed_html.find('div', { 'class': 'mw-parser-output'})
    for tag in tags:
        if tag.name == 'div' and 'mw-heading' in tag.get('class', []):
            current_category = tag.text.replace('[edit]', '')
            projects[current_category] = []

        elif tag.name == 'ul':
            for li in tag.find_all('li'):
                projects[current_category].append(li)

    for project in projects.keys():
        print(project)


if __name__ == "__main__":
    main()
