# Date: 06-18-19

## Attendees:
Russell Tan (slack:Russell Tan, gh: sellnat77)

Winston Laoh (slack: winston, gh: wlaoh)

Dean Church (slack:dean, gh: rankazze)

Joshua Marx(slack: Joshua Marx, gh: brodly)

Armett Johnson (slack: Armett Johnson, gh: moneymett)

Harsh Bhatt (slack: Harsh Bhatt)

Lauren Sandberg (slack: Lauren Sandberg, gh: laurenjsandberg)

Nathan Danielsen (gh: ndanielsen)

## Agenda:

Review [readme](https://docs.google.com/document/d/1wzD8BWgljvJkLT2ImxC6FCCEKNUXm9zX3K6JtkkVl-I) doc content and format

Deciding how to document roll call, then doing roll call

- Will document roll via Google Sheets @ [311-Data Roster](https://docs.google.com/spreadsheets/d/1CZHH_91zTb9avfsJG9MtakCqbhLWQzTyTtQVNDqKqyM/edit#gid=0)

Deciding how to do skills inventory, interest, and then doing it

- Russell Tan: Mobile frontend (swift), Backend, AWS/platform
- Winston Laoh: Backend, test, tools, infra engineer, project management
- Joshua Marx: Frontend, UI/UX(Storytelling)
- Armett Johnson: Frontend, UI/UX, product roadmapping
- Harsh Bhatt: Back-end engineer
- Lauren Sandberg: Product/project management, UX, product roadmapping
- Nathan Daneilsen: Frontend, UX, Product roadmapping

Skeleton roles and responsibilities
- Product Owner/Manager
  - Interfaces with and represents the customer
  - Determines product requirements and roadmap
  - Communicates needs/requirements/goals with the rest of the team
- Project Manager
  - Resource negotiation with DTLA HackforLA hosts
  - Communicating with tech/UI/UX leads to establish feasible requirements
  - Draft agenda, run meetings
  - Set/speak to tech milestones
- Tech Lead
  - Act as voice for reasonable delivery timelines, communicate tech lift involved
  - Responsible for overall system architecture
  - Perform code review
  - Drive QA standards
- UI/UX Lead
  - Represents the user
  - Designs interfaces, user flows
  - Performs user/usability testing
  - Communicate with tech lead to ensure they&#39;re on the same page about capabilities
- Customer/Stakeholder
  - Communicate their needs/goals (for product, and for timeline)
  - Review prototypes, User Acceptance Testing
  - Commitment

Review

1. Current My311-bi: https://empowerla.org/demographics-BI/
2. Mayor's Dashboard 311 request intake site: http://dashboard.lamayor.org/
3. LAEmpower site: http://empowerla.org/

Are there any other 311 visualization tools?

- My311 Data repository: [https://data.lacity.org/A-Well-Run-City/MyLA311-Service-Request-Data-2019/pvft-t768](https://data.lacity.org/A-Well-Run-City/MyLA311-Service-Request-Data-2019/pvft-t768)
- NYC 311 Data: [http://people.ischool.berkeley.edu/~samuel.goodgame/311/](http://people.ischool.berkeley.edu/~samuel.goodgame/311/)
- [https://cvalenzuela.github.io/alt\_docs/found\_materials/](https://cvalenzuela.github.io/alt_docs/found_materials/)

## Next steps?
- Need to hear back from EmpowerLA re: neighborhood council reps!
- Ideate other 311 visualization tools
- Discuss skills and responsibilities


# Date: 06-25-19

## Attendees:
Russell Tan (slack:Russell Tan, gh: sellnat77)

Winston Laoh (slack: winston, gh: wlaoh)

Joshua Marx (slack: Joshua Marx, gh: brodly)

Harsh Bhatt (slack: Harsh Bhatt)

Armett Johnson

Kenneth Wyrick

## Agenda:
- Administrative setup of github repo
  - Wiki
- Analyze actual 311 data and determine if correlations can be drawn
  - "Can we actually make this work"
  - Ideate other 311 visualization tools
  - Find existing neighborhood council initiatives
  - [https://data.lacity.org/A-Well-Run-City/MyLA311-Service-Request-Data-2019/pvft-t768](https://data.lacity.org/A-Well-Run-City/MyLA311-Service-Request-Data-2019/pvft-t768)

Notes:

- Internal data analysis tool to help find correlations with 311 data -- year over year, month over month, etc.
- Deploy on Raspberry Pi
- Pull data when it detects internet
- Frontend Dashboard
- Backend DB with data
- Startup script
- JSON 311 dataset for 1 year  = 500mb

## Next Steps:
- Talk tech stack
  - Implementation?
  
# Date: 07-02-19

## Attendees:
Russell Tan

Joshua Marx

Armett Johnson

Lauren Sandberg

Long Nguyen

Rose Pender

Bobby Araiza

Kenneth Wyrick

## Agenda:
- Goals
  - Continue brainstorming and thinking about what we might be able to do with the data
  - Determine what frameworks we&#39;d like to use
  - Prototype
    - Machine learning model
    - Explore correlations prototype
      - Russell
    - Explore YoY MoM WoW diffing prototype on particular columns

## Notes:
- Our knowledge base…
  - Spark is the easiest machine learning framework (from Python)
  - JavaScript
  - D3 for visualization
- Colaboratory
  - Free tool for python collaboration
  - [https://colab.research.google.com/](https://colab.research.google.com/)
- Department of Transportation update re: 311
  - Adding data on calls re: scooters!
    - All scooter operators must comply
    - You can now report on all kinds of stuff - where they&#39;re parked, multiple people on a single scooter, etc.
  - MDS - Mobility Data Specification
    - [https://github.com/CityOfLosAngeles/mobility-data-specification](https://github.com/CityOfLosAngeles/mobility-data-specification)
- Open Questions:
  - Success Metrics…
    - Are we counting number of calls vs. number of actual incidents? (i.e. what if multiple people call about the same issue?)
    - Issue created date vs. closed date (time to close)?

## Next Steps:
- Overview of prototype findings
- Continue hacking on prototypes
- Continue brainstorming

# Date: 07-09-19

## Attendees:
Kevin Chrzanowski

Russell Tan

Joshua Marx

Armett Johnson

Lauren Sandberg

Long Nguyen

Rose Pender

Bobby Araiza

## Agenda:

- Establish who needs admin access to github
- ***DELIVERABLE*** Draft email for NC people about 311 data meeting (last Tues of the month)
  - What is CodeForAmerica very brief
  - What is Hackforla very brief
  - Get them excited for the meeting
    - Imagine the possibilities with 311 data at your fingertips
  - Overview of the meeting and whats to be covered
    - Brief on the questions that we have
  - Mention cookies to encourage attendance
- ***DELIVERABLE*** Draft Google survey Q&#39;s -\&gt; Bonnie will create actual survey
  - Do you know about 311 data
  - Do you use 311 data
  - Are you a member of leadership or a regular councilmember?

## Notes:
- Link to deliverables: [https://docs.google.com/document/d/12JQ46SVsyywmdwEFPpE-Q1xFHdXNIP-AnbSaPKs0Kvk/edit#heading=h.k0arncwly1xs](https://docs.google.com/document/d/12JQ46SVsyywmdwEFPpE-Q1xFHdXNIP-AnbSaPKs0Kvk/edit#heading=h.k0arncwly1xs)
- Link to survey: [https://docs.google.com/forms/d/1N\_cY23y4u04oHOlkyQId-K3k11J23lUGwMljmNHpmMk/edit](https://docs.google.com/forms/d/1N_cY23y4u04oHOlkyQId-K3k11J23lUGwMljmNHpmMk/edit)

## Next Steps:
- Create github admin snazzyness
- Create brief write-ups of prototypes for voting/final sign off
  - [https://docs.google.com/document/d/1CNEJ1yAa41WbjMLYDB-UuTUjnd51X5tTJ9kWVQlH9NM/edit#](https://docs.google.com/document/d/1CNEJ1yAa41WbjMLYDB-UuTUjnd51X5tTJ9kWVQlH9NM/edit#)
- Create a market-analysis report (Overview of what&#39;s already there)
  - What&#39;s out there
  - How are other people using these?
  - Prevent hours of explaining what&#39;s out there
- Clean up documentation
  - Utilize githubs tooling
