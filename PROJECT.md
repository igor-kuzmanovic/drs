# Project Assignment: Survey System

## Survey System Overview

Implement a system for creating surveys that can be sent to selected individuals via email. Allow survey creators to manage all the surveys they have created and sent.

The implementation should contain three main components:

1. User Interface (UI)
2. Request and Data Processing Service (Engine)
3. Database (DB)

---

## System Sketch

### User Interface (UI)

The user interface is a web application developed using Flask that allows users to interact with their portfolio of actions.

Supported user interface actions include:

- Register a new user
- Log in an existing user
- Edit user profile
- View surveys the user has created and a simple display of results
- Create a new survey
- Delete a completed survey and terminate a survey on request
- Display survey results on the survey page and visualize the survey
- Display a survey response page for respondents (respondents are not system users)

#### User Registration Includes the Following Fields:

- First Name
- Last Name
- Address
- City
- Country
- Phone Number
- Email
- Password

#### Login is Done Via:

- Email Address
- Password

After registration, the user lands on the initial page which displays the survey overview. Initially, the user has no surveys and has the option to create their first survey.

---

### Creating a Survey

When creating a survey, the user can create a simple one consisting of:

- Survey name
- A question
- Three answers: Yes / No / I can't answer
- Survey end date

After configuring these, the user inputs a list of email addresses to send the survey to and specifies whether the survey is anonymous.

- Surveys are emailed to all entered addresses.
- A limit of **50 email addresses** must be enforced.
- Email sending should be implemented in a **separate process** using an external email service.

Users receiving the email can respond via:

- Clicking the appropriate link in the email
- Using a dedicated page in the application

Note: These users **do not** need to be logged in. If the survey is closed, respondents should be informed that it has ended.

Survey owners can click on each survey to view voting results. If the survey is anonymous, email addresses of respondents are **not** shown. Each survey must include a **simple chart** displaying the results.

---

## Request and Data Processing Service (Engine)

The Engine is a service implemented as a Flask API application. This service provides endpoints that enable the UI application to process data and communicate with the database. The UI sends requests to the Engine, which handles communication with the database and data processing.

---

## Database (DB)

The database communicates with the Engine and is used to store all necessary application data, including user information, actions, transactions, and current stock values.

The database model can be either SQL or NoSQL depending on preference but must support easy tracking of:

- Users
- Actions
- Purchases and sales
- Profit/loss per transaction

---

## Key Functionalities

1. User registration and authentication
2. Survey management: view current surveys, create, delete
3. Survey detail display: results in tabular format, chart
   - (if anonymous, only the chart is shown)
4. Survey search by name
5. Sending surveys via external API using an email service

---

## Grading Criteria

| Feature                                                         | Points |
| --------------------------------------------------------------- | ------ |
| Functional application with a working Flask app                 | 51     |
| - A single app without a database but fully functional          |        |
| Engine implemented as a separate Flask app (API communication)  | 10     |
| Implemented database connected to Engine                        | 9      |
| Use of processes during implementation                          | 15     |
| Dockerization and multi-machine deployment (distributed system) | 15     |

_Note: Point adjustments possible up to the first checkpoint._
