# Permissions and Roles



<!-- ## Overview

> The account manager is responsible for managing the user's account, notifications, manage permissions, and profile. -->

## Get Permissions List.

> Get a list of current permissions that can be used for roles.

```endpoint
GET /api/v1/admin/permissions
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"

#### Success

<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| permissions | string[] | List of all permissions by name. |

```json
{
    "permissions": [
        "asdf",
        "blah",
        "cool",
        "Bobby"
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





## Delete a Permission.

> Get a list of current permissions that can be used for roles.

```endpoint
GET /api/v1/admin/roles
```


## Get all Roles

> Get a list of current roles.

```endpoint
GET /api/v1/admin/roles
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"
* "role.isDeleted" = true will not show up here. You will need to update the database manually to bring a role back.

#### URL Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| page | number | Optional | What number page you are only. Defaults to 0  |
| pageSize | number | Optional | How many records per page. Defaults to 15  |
| sort-column | string | Optional | What property to sort.  "name" is default default. Use "role meta" for list of permissions to use. |
| sort-direction | enum('asc', 'desc') | Optional | Do you want to sort in ascending or descending. Default to 'asc' if "sort" is present.  |

#### Success

<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| rows | user[] | All list of roles. |
| count | number | Total number of results that match search criteria. |


```endpoint
GET /api/v1/admin/roles
```

```json
{
    "rows": [
        {
            "id": 1,
            "name": "Test Role",
            "view_test": 1,
            "update_test": 0,
            "publish_test": 0
        }
    ],
    "count": 1
}
```

<!-- tabs:end -->

#### Failed

<!-- tabs:start -->
#### ** 400 **

Your "sort-column" doesn't match a known permissions. 
* You didn't spell the permission correctly.
* Your using a permission name that isn't alpha-numeric, or has spaces, or special characters. These are illegal permission names.
* You haven't updated your database.

One way to updated your database:
Have you updated your database. Environment variable DB_MIGRATE=true, then reload npm start(or save a js file if using nodemon), then you make want to reset the environment file to DB_MIGRATE=false.

```json

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

#### ** 500 **

Internal Server Error:
Service is down.

```json
{
    "msg": "Internal server error"
}
```

<!-- tabs:end -->



<!-- 

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

<!-- tabs:start 

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

<!-- tabs:end 

#### Failed

<!-- tabs:start 

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

<!-- tabs:end 


 -->
