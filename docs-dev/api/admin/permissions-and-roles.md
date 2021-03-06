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

> Delete a permission by name. Note: if the permission comes back, the permission is still in the code. The programmer has the final say of a permission existing.

```endpoint
DELETE /api/v1/admin/permissions/:name
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"
* This is a hard delete. You cannot bring information back.

<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| msg | string |  |


```json
{
    "msg": "This permission was successfully deleted."
}
```

<!-- tabs:end -->

#### Failed

<!-- tabs:start -->
#### ** 400 **

Bad Request: The name of the permission doesn't exist. The name should be case sensitive alphanumeric with an underscore allowed. 

```json
{
    "msg": "Bad Request: Can not delete a permission that doesn't exist. Use the link to get a link to valid permission names.",
    "link": "/api/v1/admin/permissions"
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

#### ** 500 **

Internal Server Error:
Service is down.

```json
{
    "msg": "Internal server error"
}
```

<!-- tabs:end -->




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
{
    "msg": "Bad Request: 'sortColumn' isn't a valid permissions. Use link to find valid 'sortColumns'",
    "humanMsg": "You are sorting by a permissions that doesn't exist.",
    "link": "/api/v1/admin/permissions"
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

#### ** 500 **

Internal Server Error:
Service is down.

```json
{
    "msg": "Internal server error"
}
```

<!-- tabs:end -->





## Post New Role

> Create a new user. Also has the option to email the user if mailinator environment variables are defined. 


```endpoint
POST /api/v1/admin/roles
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| name | string | Required | |
| ...permissions names | boolean | optional | List of permissions names. GET /api/v1/admin/permissions for list of permission names |

#### Success

<!-- tabs:start -->

#### ** 201 **

schema

| Name | Type | Description |
|---|---|---|
| id | number | New role id.. |

```json
{
    "id": 21
}
```

<!-- tabs:end -->

#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad request.
You may be using a permission that doesn't exist.

```json
{
    "msg": "Bad Request: 'test_permission' isn't a valid permission. Use link to find valid permissions",
    "humanMsg": "You have assigned permission 'test_permission' to a role, but that permission doesn't exist.",
    "link": "/api/v1/admin/permissions"
}
```

#### ** 401 **

Unauthorized

```json
{
    "msg": "Unauthorized.",
    "humanMsg": "You don't have the necessary permission(s).",
    "resolve": {
        "role": "Admin"
    }
}
```

#### ** 409 **

Conflict
Role name is already in use.

```json
{
    "msg": "Bad Request: role named 'test role' already assigned.",
    "humanMsg": "The name for this role is already in use."
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

## Patch Many Roles

> You can run a bulk patch on many roles, up to 50.  


```endpoint
PATCH /api/v1/admin/roles
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"
* Up to 50 updates at once can be performed.

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| roles | role[] | Required | List of role objects. |
| roles[n].id | number | Required | Id of role |
| roles[n].name | string | Optional | New name of role. |
| roles[n].isDeleted | string | Optional | Deletes a role. |
| roles[n]... permissions names | boolean | optional | List of permissions names. GET /api/v1/admin/permissions for list of permission names |

#### Success

<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| msg | string |  |

```json
{
    "msg": "All roles have been successfully updated."
}
```

<!-- tabs:end -->

#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad request.
* You may be using a permission that doesn't exist.
* Too many updates
* Id doesn't exist
* etc...

```json
{
    "msg": "Bad Request: Id '71' does not exist."
}
```

#### ** 401 **

Unauthorized

```json
{
    "msg": "Unauthorized.",
    "humanMsg": "You don't have the necessary permission(s).",
    "resolve": {
        "role": "Admin"
    }
}
```

#### ** 409 **

Conflict
Role name is already in use.

```json
{
    "msg": "Bad Request: role named 'Awesome Dude' already assigned. Index '1' cannot use this name current."
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

## Get One Role

> Get a role.

```endpoint
GET /api/v1/admin/roles/:id
```

#### Additional Information
* Admin Type Only
* Token required in header "Authorization: Bearer {token}"

#### Url Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| id | number | Required | Id of the role  |

#### Success

<!-- tabs:start -->

#### ** 200 **

schema

```json
{
    "id": 2,
    "name": "Exec Management",
    "permission1": 1,
    "permission2": 1,
    "permission3": 1
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

#### ** 404 **

Id doesn't have value. The record could have been deleted and need to be updated in the database manually.

```json
{
    "msg": "Not Found: No role with 'id'"
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




