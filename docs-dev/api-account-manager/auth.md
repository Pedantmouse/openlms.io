# Auth - Account Manager API

<!-- ## Overview

> The account manager is responsible for managing the user's account, notifications, manage permissions, and profile. -->





## Register

> This is where the user is created. All other API(s) in this ecosystem will require the user first register here. The first user that registers with the account manager api will be granted all admin privages.

```endpoint
POST /api/v1/auth/register/email
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| password | string | Required | 6 or more chars.|
| password2 | string | Required | Must match password.|
| email | email | Required | 255 character limit |

#### Success


<!-- tabs:start -->

#### ** 201 **

schema

| Name | Type | Description |
|---|---|---|
| token | string | The token the user will use for subsequent request. |
| tokenIssuedDate | string | In utc time. |
| tokenExpiredDate | string | In utc time. |
| userId | number | |



```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgxMTk4MDcwLCJleHAiOjE1ODEyNTgwNzB9.-doO4Ff_E_P70CGpplDYqRha9h6lz62glxJLTZGcE4I",
    "tokenIssuedDate": "Sat, 08 Feb 2020 21:41:10 GMT",
    "tokenExpiredDate": "Sat, 08 Feb 2020 21:42:10 GMT",
    "userId": 1
}
```


<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 
* Are you forgetting any required params?
* Does password and password2 match?
* Does the email surpass the 255 email character limit?

```json
{
    "msg": "Bad Request: Password is missing.",
    "humanMsg": "Please enter a password for your account"
}
```

#### ** 409 **

Conflict:
The user already has an account using that email address.

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




## Login

> An existing user can use this endpoint to get the token needed to access their data. By logging into a disabled account, you will need to get reable account.

```endpoint
POST /api/v1/auth/login/email
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| password | string | Required |  |
| email | email | Required |  |

#### Success


<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| token | string | The token the user will use for subsequent request. |
| tokenIssuedDate | string | In utc time. |
| tokenExpiredDate | string | In utc time. |
| userId | number | |



```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgxMTk4MDcwLCJleHAiOjE1ODEyNTgwNzB9.-doO4Ff_E_P70CGpplDYqRha9h6lz62glxJLTZGcE4I",
    "tokenIssuedDate": "Sat, 08 Feb 2020 21:41:10 GMT",
    "tokenExpiredDate": "Sat, 08 Feb 2020 21:42:10 GMT",
    "userId": 1
}
```


<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 
Your credentials are bad.

```json
{
    "msg": "Bad Request: Email and password required.",
    "humanMsg": "Please enter your account information"
}
```

#### ** 401 **

Unauthorized:
Your account is disabled. You will need to reactivate it.


```json
{
    "msg": "Unauthorized: User account is disabled.",
    "humanMsg": "This account is disabled.",
    "resolve": "/api/v1/auth/reactivate/email"
}

```

#### ** 403 **

Forbidden:
The user has been blocked from service. This can be from any reason. But here are some examples.
* Acount Banned
* IP Blocked


```json
{
    "msg": "Forbidden: User has been banned.",
    "humanMsg": "This account is suspended."
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

## Validate Token

> Is the token valid? This endpoint will tell you.

```endpoint
POST /api/v1/auth/token/validate
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| token | string | Required |  |

#### Success


<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| isValid | boolean | Is the token valid. |



```json
{
    "isValid": true
}
```


<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 
The body doesn't contain a token.

```json
{
    "msg": "Bad Request: The body should contain a token."
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


## Refresh Token

> Refresh that token before it expires.

```endpoint
POST /api/v1/auth/token/refresh
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| token | string | Required |  |

#### Success


<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| token | string | The token the user will use for subsequent request. |
| tokenIssuedDate | string | In utc time. |
| tokenExpiredDate | string | In utc time. |
| userId | number | |



```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgxMTk4MDcwLCJleHAiOjE1ODEyNTgwNzB9.-doO4Ff_E_P70CGpplDYqRha9h6lz62glxJLTZGcE4I",
    "tokenIssuedDate": "Sat, 08 Feb 2020 21:41:10 GMT",
    "tokenExpiredDate": "Sat, 08 Feb 2020 21:42:10 GMT",
    "userId": 1
}
```

<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 
That is not a token. You need to login it to receive another token

```json
{
    "msg": "Bad Request: Token is invalid.",
    "resolve": "/api/v1/auth/login/email"
}
```

#### ** 401 **

Unauthorized: 
The token has expired. You need to login it to receive another token

```json
{
    "msg": "Unauthorized: Token has expired.",
    "resolve": "/api/v1/auth/login/email"
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


## Forgot Password

> Send an email with a link to reset password.

```endpoint
POST /api/v1/auth/forgot-password
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| email | string | Required |  |

#### Success


<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| msg | string |  |
| humanMsg | string |  |


```json
{
    "msg": "Email has been sent",
    "humanMsg": "Email has been sent."
}
```

<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 

```json
{
    "msg": "Bad Request: Email not a valid email.",
    "humanMsg": "Please enter a valid email."
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


## Disable Account

> The user will user this endpoint to disable account.

```endpoint
POST /api/v1/auth/disable
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| password | string | Required |  |
| email | email | Required |  |

#### Success


<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| msg | string |  |


```json
{
    "msg": "Account successfully disabled"
}
```

<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 

```json
{
    "msg": "Bad Request: Email not a valid email.",
    "humanMsg": "Please enter a valid email."
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




## Reactivate Account

> The user will user this endpoint to reactivate a disabled account.

```endpoint
POST /api/v1/auth/reactivate
```

#### Body Params

| Name | Type | Required/Optional | Description|
|---|---|---|---|
| password | string | Required |  |
| email | email | Required |  |

#### Success


<!-- tabs:start -->

#### ** 200 **

schema

| Name | Type | Description |
|---|---|---|
| msg | string |  |


```json
{
    "msg": "Account successfully reactivated"
}
```

<!-- tabs:end -->



#### Failed

<!-- tabs:start -->

#### ** 400 **

Bad Request: 

```json
{
    "msg": "Bad Request: Email not a valid email.",
    "humanMsg": "Please enter a valid email."
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


