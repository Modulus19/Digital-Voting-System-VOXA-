# VOXA API Documentation

> Digital Voting System — Backend API Contract

## 1. Base URL

Local development:

http://localhost:5000/api

Example:

GET http://localhost:5000/api/polls

## 2. Authentication

VOXA uses JWT Bearer authentication for protected endpoints.

Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

## 3. Standard Response Format

Successful:

json
{ "success": true, "message": "Operation successful", "data": {} }

Error:

json
{ "success": false, "message": "Something went wrong", "data": null }

## 4. Authentication Endpoints

Mounted under /api/auth.

| Method | Endpoint                  | Purpose                    |
| ------ | ------------------------- | -------------------------- |
| POST   | /auth/register            | Create an account          |
| POST   | /auth/verify-email        | Verify email OTP           |
| POST   | /auth/resend-verification | Resend verification OTP    |
| POST   | /auth/login               | Login and receive JWT      |
| POST   | /auth/forgot-password     | Request password reset OTP |
| POST   | /auth/verify-reset-otp    | Verify reset OTP           |
| POST   | /auth/reset-password      | Set a new password         |

A newly registered user must verify their email before logging in.

## 5. User Endpoints

### Get Current User

GET /api/users/me

Authentication required.

Possible roles:

text
user
admin

## 6. Poll Endpoints

Mounted under /api/polls.

### Create Poll

POST /api/polls

Example body:

json
{
"question": "Which feature should VOXA prioritize?",
"options": [
{ "text": "Voting" },
{ "text": "Results" },
{ "text": "User Management" }
],
"resultsVisibility": "after_vote"
}

Supported visibility values:

text
after_vote
after_close
admin_only

New polls start as draft.

### Get Polls

GET /api/polls

Optional query parameters may include page and limit.

### Get Poll

GET /api/polls/:id

### Update Poll

PATCH /api/polls/:id

Only the poll creator or an administrator should manage the poll.

### Delete Poll

DELETE /api/polls/:id

### Publish Poll

PATCH /api/polls/:id/publish

Changes a draft poll to published.

### Close Poll

PATCH /api/polls/:id/close

Changes a published poll to closed.

## 7. Poll Statuses

| Status    | Meaning                              |
| --------- | ------------------------------------ |
| draft     | Being prepared; cannot receive votes |
| published | Active; can receive votes            |
| closed    | Voting has ended                     |

## 8. Voting

### Submit Vote

POST /api/polls/:pollId/vote

Authentication required.

Body:

json
{ "selectedOption": "OPTION_ID" }

The backend enforces that the poll exists, is published, the option belongs to the poll, and the user has not already voted.

Duplicate vote response:

json
{
"success": false,
"message": "You have already voted on this poll.",
"data": null
}

### Vote History

GET /api/votes/history

Authentication required.

## 9. Results

### Get Poll Results

GET /api/polls/:pollId/results

Authentication required.

### after_vote

The user must have voted before results are available.

### after_close

Results remain hidden until the poll is closed.

Before closing:

json
{
"success": false,
"message": "Results will be available after the poll is closed.",
"data": null
}

### admin_only

Only administrators can view the results.

json
{
"success": false,
"message": "Only administrators can view the results of this poll.",
"data": null
}

### Successful Results Response

json
{
"success": true,
"message": "Poll results retrieved successfully",
"data": {
"poll": {
"id": "POLL_ID",
"question": "Which feature should VOXA prioritize?",
"status": "published",
"resultsVisibility": "after_vote"
},
"totalVotes": 4,
"results": [
{
"optionId": "OPTION_ID_1",
"option": "Voting",
"votes": 3,
"percentage": 75
}
]
}
}

## 10. HTTP Status Codes

| Status | Meaning                         |
| -----: | ------------------------------- |
|    200 | Successful                      |
|    201 | Created                         |
|    400 | Invalid input                   |
|    401 | Authentication required/invalid |
|    403 | Not permitted                   |
|    404 | Not found                       |
|    409 | Conflict, e.g. duplicate vote   |
|    500 | Server error                    |

## 11. Recommended Frontend Structure

text
src/
└── services/
├── api.js
├── authApi.js
├── userApi.js
├── pollApi.js
├── voteApi.js
└── resultApi.js

Example API helper:

js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}) => {
const token = localStorage.getItem("accessToken");

const response = await fetch(${API_BASE_URL}${endpoint}, {
...options,
headers: {
"Content-Type": "application/json",
...(token ? { Authorization: Bearer ${token} } : {}),
...options.headers,
},
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.message || "Request failed");
}

return data;
};

## 12. Frontend Environment Variable

Frontend/.env:

env
VITE_API_BASE_URL=http://localhost:5000/api

Frontend/.env.example:

env
VITE_API_BASE_URL=http://localhost:5000/api

Do not put backend secrets or database credentials in frontend environment variables.

## 13. Frontend Flow

### Registration

text
Register → Verify Email → Login → Receive JWT → Dashboard

### Voting

text
Browse polls → Open poll → Select option → Submit vote → Show result when permitted

### Results

text
Request results → Backend checks visibility → Display counts and percentages

## 14. Important Frontend Rules

The frontend should not rely only on frontend validation. The backend is authoritative for:

- Authentication
- Authorization
- Poll ownership
- Poll status
- Valid options
- Duplicate-vote prevention
- Result visibility
- Admin permissions

## 15. Integration Checklist

- [ ] Register
- [ ] Verify email
- [ ] Login
- [ ] Store JWT
- [ ] Send Bearer token
- [ ] Create poll
- [ ] View polls
- [ ] View a poll
- [ ] Publish poll
- [ ] Vote
- [ ] Prevent duplicate vote
- [ ] View vote history
- [ ] Test after_vote results
- [ ] Test after_close results
- [ ] Test admin_only results
- [ ] Handle loading states
- [ ] Handle empty states
- [ ] Handle API errors

## 16. Postman Collection

Recommended collection structure:

text
VOXA API
├── Auth
│ ├── Register
│ ├── Verify Email
│ ├── Resend Verification
│ ├── Login
│ ├── Forgot Password
│ ├── Verify Reset OTP
│ └── Reset Password
├── Users
│ └── Get Current User
├── Polls
│ ├── Create
│ ├── Get All
│ ├── Get One
│ ├── Update
│ ├── Delete
│ ├── Publish
│ └── Close
├── Voting
│ ├── Cast Vote
│ └── Vote History
└── Results
└── Get Results

## 17. API Contract Rule

When a backend endpoint changes, update this documentation before frontend integration. If the actual response differs from this document, resolve the discrepancy between frontend and backend before changing frontend logic.
