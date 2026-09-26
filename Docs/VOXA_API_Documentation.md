# VOXA Backend API Documentation

## Base URL

Local development:

http://localhost:5000/api

Production:

Replace with the deployed backend URL.

# Authentication

Most protected endpoints require a JWT access token.

Send the token using:

Authorization: Bearer YOUR_ACCESS_TOKEN

## 1. Register

### POST

/api/auth/register

### Body

{
"email": "user@example.com",
"username": "john",
"password": "password123"
}

### Notes

- A new account is created with the role user.
- Email verification is required before login.
- Users cannot register themselves as administrators.

## 2. Verify Email

### POST

/api/auth/verify-email

### Body

{
"email": "user@example.com",
"otp": "123456"
}

## 3. Resend Verification OTP

### POST

/api/auth/resend-verification

### Body

{
"email": "user@example.com"
}

# Login

## POST

/api/auth/login

### Body

{
"email": "user@example.com",
"password": "password123"
}

### Successful response

The response contains an access token.

{
"success": true,
"data": {
"user": {
"id": "...",
"email": "user@example.com",
"username": "john",
"role": "user",
"emailVerified": true
},
"accessToken": "..."
}
}

The frontend should store the access token and send it with protected requests.

# Current User

## GET

/api/auth/me

### Authentication

Required.

Authorization: Bearer YOUR_ACCESS_TOKEN

Returns the currently authenticated user's information.

# Password Reset

## Forgot Password

### POST

/api/auth/forgot-password

### Body

{
"email": "user@example.com"
}

## Verify Reset OTP

### POST

/api/auth/verify-reset-otp

### Body

{
"email": "user@example.com",
"otp": "123456"
}

## Reset Password

### POST

/api/auth/reset-password

### Body

{
"resetToken": "RESET_TOKEN",
"newPassword": "newpassword123"
}

# Polls

All poll endpoints require authentication.

## Create Poll

### POST

/api/polls

### Body

{
"question": "Which feature should admins monitor most?",
"options": [
{
"text": "User Activity"
},
{
"text": "Poll Activity"
},
{
"text": "Voting Activity"
}
],
"resultsVisibility": "admin_only"
}

### Possible resultsVisibility values

after_vote
after_close
admin_only

## Get Polls

### GET

/api/polls

Optional query parameters:

/api/polls?page=1&limit=10

## Get Single Poll

### GET

/api/polls/:id

Example:

/api/polls/6ab732e789435e0e68ca1025

## Update Poll

### PATCH

/api/polls/:id

Example body:

{
"question": "Updated question"
}

## Delete Poll

### DELETE

/api/polls/:id

## Publish Poll

### PATCH

/api/polls/:id/publish

A poll must be published before users can vote.

## Close Poll

### PATCH

/api/polls/:id/close

# Voting

## Submit Vote

### POST

/api/polls/:pollId/vote

### Authentication

Required.

### Body

{
"selectedOption": "OPTION_ID"
}

Example:

POST /api/polls/6ab732e789435e0e68ca1025/vote

{
"selectedOption": "6ab732e789435e0e68ca1026"
}

### Important

A user can vote only once per poll.

The poll must have:

status = published

# Vote History

## GET

/api/votes/history

### Authentication

Required.

Returns the authenticated user's voting history.

# Poll Results

## GET

/api/polls/:pollId/results

### Authentication

Required.

Example:

GET /api/polls/6ab732e789435e0e68ca1025/results

## Results Visibility

### admin_only

Only administrators can view the results.

### after_vote

A user must vote before viewing the results.

### after_close

Results become available after the poll has been closed.

## Example Results Response

{
"success": true,
"message": "Poll results retrieved successfully",
"data": {
"poll": {
"id": "6ab732e789435e0e68ca1025",
"question": "Which feature should admins monitor most?",
"status": "published",
"resultsVisibility": "admin_only"
},
"totalVotes": 0,
"results": [
{
"optionId": "6ab732e789435e0e68ca1026",
"option": "User Activity",
"votes": 0,
"percentage": 0
},
{
"optionId": "6ab732e789435e0e68ca1027",
"option": "Poll Activity",
"votes": 0,
"percentage": 0
},
{
"optionId": "6ab732e789435e0e68ca1028",
"option": "Voting Activity",
"votes": 0,
"percentage": 0
}
]
}
}

# Authentication Header

For protected endpoints, the frontend should send:

Authorization: Bearer ACCESS_TOKEN

Example Axios configuration:

ts
const token = localStorage.getItem("accessToken");

const response = await axios.get(${API_URL}/polls, {
headers: {
Authorization: Bearer ${token},
},
});

# Important Frontend Rules

1. Do not expose JWT_SECRET.
2. Do not expose MongoDB credentials.
3. Do not allow users to choose the admin role during registration.
4. Store the access token after successful login.
5. Send the access token with protected requests.
6. Handle 401 responses by redirecting the user to login.
7. Handle 403 responses as permission/authorization errors.
8. A poll must be published before voting.
9. A user can vote only once per poll.
10. Results visibility depends on the poll's resultsVisibility setting.

# API Health Check

### GET

/api/health

Expected response:

{
"success": true,
"message": "VOXA API is running",
"data": null
}
