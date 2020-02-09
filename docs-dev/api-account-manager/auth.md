# Auth - Account Manager API

<!-- ## Overview

> The account manager is responsible for managing the user's account, notifications, manage permissions, and profile. -->





## Register

> This is where the user is created. All other API(s) in this ecosystem will require the user first register here. The first user that registers with the account manager api will be granted all admin privages.

```endpoint
POST /api/v1/register/email
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
POST /api/v1/login/email
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
    "resolve": "/api/v1/reactivate/email"
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

## Forgot Password

## Refresh Token

## Verifty Token

## Disable Account