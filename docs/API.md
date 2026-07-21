# Frontend API Documentation

> Clean reference generated from the Swagger specification.

## Contents

1.  Authentication APIs
2.  Tweet APIs
3.  User APIs
4.  Moderation APIs
5.  Common Response Format
6.  Error Codes
7.  Common Models

---

# Authentication APIs

## Register

- **Method:** `POST`
- **Endpoint:** `/user/register`
- **Auth:** No
- **Content-Type:** `multipart/form-data`

### Request

Field Required Notes

---

userName ✅ Unique username
email ✅ Email
fullName ✅ Full name
password ✅ Password
avatar ✅ WEBP image
coverImage ❌ WEBP image
role Admin only Defaults to user

### Success

Returns the created user.

---

## Login

- **Method:** `POST`
- **Endpoint:** `/user/login`
- **Auth:** No
- **Content-Type:** `application/json`

Returns: - `userData` - `accessToken` - `refreshToken`

---

## Logout

- **GET** `/user/logout`
- Authentication required.

---

## Refresh Token

- **POST** `/user/refreshToken`
- Returns new access and refresh tokens.

---

# Tweet APIs

## Create Tweet

- **POST** `/tweet/createTweet`
- **Auth:** Required
- **Content-Type:** `multipart/form-data`

Fields: title, description, status, tags, image (WEBP), isSensitive,
author (admin only).

Business rules: - User → awaiting_approval - Moderator → may set
status - Admin → can publish directly - Sensitive tweets require
approval unless admin.

---

## Get All Tweets

- **GET** `/tweet/getAllTweets`
- Public endpoint

Query: - page - limit - status - author - search - sortBy

Returns: - tweets\[\] - pagination

> Frontend note: `page`/`limit` are consumed as an incrementing cursor for infinite scroll — no page-number UI. See Rules.md.

---

## Get Tweet By ID

`GET /tweet/getTweetById/{id}`

Returns one tweet with comments.

---

## Get My Tweets

`GET /tweet/getMyTweets`

Authenticated user's tweets.

Supports: - page - limit - status - sortBy

---

## Update Tweet

`PATCH /tweet/updateTweet/{id}`

Users update their own tweets. Admins can update any tweet.

---

## Update Tweet Status

`PATCH /tweet/updateTweetStatus/{id}`

Admin/Moderator only.

---

## Delete Tweet

`DELETE /tweet/deleteTweet/{id}`

---

## Like Tweet

`POST /tweet/likeTweet/{id}`

Returns: - isLiked - likesCount - dislikesCount

---

## Dislike Tweet

`POST /tweet/dislikeTweet/{id}`

---

## Repost Tweet

`POST /tweet/repostTweet/{id}`

---

## Tweet Moderation

`GET /tweet/moderate`

Admin/Moderator only.

Supports filtering, search and pagination.

> Frontend note: consumed via infinite scroll — no page-number UI. See Rules.md.

---

## Tweet Reactions

- `GET /tweet/{id}/likes`
- `GET /tweet/{id}/dislikes`
- `GET /tweet/{id}/reposts`

All return paginated user lists — consumed via infinite scroll on the frontend, no page-number UI. See Rules.md.

---

# User APIs

- `GET /user/me`
- `PATCH /user/updateUser`
- `PATCH /user/updateAvatar`
- `PATCH /user/updateCover`
- `GET /user/{id}`
- `GET /user/allUsers` (infinite scroll on frontend, no page-number UI)
- `GET /user/channel/{username}`
- `DELETE /user/deleteUser`
- `DELETE /user/deleteUser/{id}` (Admin)
- `PATCH /user/updateUser/{id}` (Admin/Moderator)

---

# Moderation APIs

### Tweets

- GET `/tweet/moderate`
- PATCH `/tweet/updateTweetStatus/{id}`

### Users

- GET `/user/moderate`
- PATCH `/user/updateUser/{id}`
- DELETE `/user/deleteUser/{id}`

---

# Common Response Format

```json
{
  "statusCode": 200,
  "data": {},
  "message": "...",
  "success": true
}
```

---

# Error Codes

Code Meaning

---

200 Success
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Server Error

---

# Common Models

## Tweet

- \_id
- title
- description
- image
- status
- isSensitive
- tags\[\]
- author
- likesCount
- dislikesCount
- repostsCount
- comments\[\]
- createdAt
- updatedAt

## User

- \_id
- userName
- fullName
- email
- avatar
- coverImage
- role
- isDisabled
- createdAt
- updatedAt
