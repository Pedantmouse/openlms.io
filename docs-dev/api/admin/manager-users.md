# Auth - Account Manager API

<!-- ## Overview

> The account manager is responsible for managing the user's account, notifications, manage permissions, and profile. -->





## Get all users

> Get a paginated list of all users in this application. This list includes all users that are organizational and admin by default. Use the url param "admin=true", "user=true" or "organization=true" to filter by user type. You can use any combination of these params for your list.


```endpoint
GET /api/v1/admin/users
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"
* "user.isDeleted" = true will not show up here. You will need to update the database manually to bring a user back.

#### URL Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| q | string | Optional | Search funcationality on users.|
| profile | boolean | Optional | Include profile with results. "q" search will search profile as well. Search functionality will only target the columns "firstName", "lastName", "website", "username", and "phoneNumber". |
| admin | boolean | Optional | Filter list to only admin users.|
| organizational | boolean | Optional | Filter list to only organizational users  |
| users | boolean | Optional | Filter list to only normal users  |
| page | number | Optional | What number page you are only. Defaults to 0  |
| pageSize | number | Optional | How many records per page. Defaults to 15  |
| sort-column | string | Optional | What property to sort.  No default. |
| sort-direction | enum('asc', 'desc') | Optional | Do you want to sort in ascending or descending. Default to 'asc' if "sort" is present  |
| sort-scope | enum("user", "profile") | Optional | Do you want to sort by a property in the users or profile scope. Defaults to user if "sort" is present. |

#### Success

<!-- tabs:start -->

#### ** 201 **

schema

| Name | Type | Description |
|---|---|---|
| rows | user[] | All list of users. |
| count | number | Total number of results that match search criteria. |


```endpoint
GET /api/v1/admin/users?q=BUGS&profile=true&admin=true&organizational=true
```

```json
{
    "count": 1,
    "rows": [
        {
            "id": 1,
            "email": "bugs@acme.com",
            "isAdmin": true,
            "isBanned": false,
            "isDisabled": false,
            "isOrganizationMember": false,
            "isDeleted": false,
            "createdAt": "2020-02-12T01:59:53.000Z",
            "updatedAt": "2020-02-12T01:59:53.000Z",
            "Profile": {
                "id": 2,
                "userId": 1,
                "firstName": "bob",
                "lastName": "Bunny",
                "username": "bugsbunny",
                "phoneNumber": "(555) 555-5555",
                "website": "http://bugsbunny.com",
                "createdAt": "2020-02-15T01:00:00.000Z",
                "updatedAt": "2020-02-15T02:00:00.000Z"
            }
        }
    ]
}
```

<!-- tabs:end -->

#### Failed

<!-- tabs:start -->

#### ** 401 **

Unauthorized

```json
{
    "msg": "Unauthorized.",
    "humanMsg": "You don't the necessary permission(s).",
    "resolve": {
        "role": "Admin"
    }
}
```

#### ** 500 **

Internal Server Error:
Service is down.

```json
{
    "msg": "Internal server error"
}
```

<!-- tabs:end -->





## Post New User

> Create a new user. Also has the option to email the user if mailinator environment variables are defined. 


```endpoint
POST /api/v1/admin/users
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| email | string | Required | |
| password | string | Required | |
| firstName | string | Required | |
| lastName | string | Required | |
| username | string | Required | only lowercase, alpha-numeric |
| phoneNumber | string | Optional | format: (###) ###-#### |
| website | string | Optional | |
| isAdmin | string | Optional | |
| shouldSendEmail | boolean | Optional | Should the user be email with password |
| Roles | number[] | Optional | Array of role ids |

#### Success

<!-- tabs:start -->

#### ** 201 **

schema

| Name | Type | Description |
|---|---|---|
| user | object | current user record with new user id. |
| user.profile | object | current user profile record with new profile id. |

```json
{
   "user": {
        "isBanned": false,
        "isDisabled": false,
        "isDeleted": false,
        "id": 6,
        "email": "porky3@acme.com",
        "isOrganizationMember": true,
        "isAdmin": false,
        "updatedAt": "2020-02-16T04:50:22.235Z",
        "createdAt": "2020-02-16T04:50:22.235Z",
        "profile": {
            "id": 6,
            "userId": 6,
            "firstName": "Porky",
            "lastName": "Pig",
            "website": "http://porkypig.com",
            "username": "pigman",
            "updatedAt": "2020-02-16T04:50:22.763Z",
            "createdAt": "2020-02-16T04:50:22.763Z"
        }
   }
}
```

<!-- tabs:end -->

#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad request.
You probably don't have all the required fields.

```json
{
    "msg": "Bad Request: 'email' is required",
    "humanMsg": "Please provide an email."
}
```

#### ** 401 **

Unauthorized

```json
{
    "msg": "Unauthorized.",
    "humanMsg": "You don't the necessary permission(s).",
    "resolve": {
        "role": "Admin"
    }
}
```

#### ** 409 **

Conflict
Email is already in use.

```json
{
    "msg": "Conflict: User email already has existing email",
    "humanMsg": "This email has already been register."
}
```

#### ** 500 **

Internal Server Error:
Service is down.

```json
{
    "msg": "Internal server error"
}
```

<!-- tabs:end -->



