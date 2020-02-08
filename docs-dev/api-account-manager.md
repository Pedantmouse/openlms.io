# Account Manager API

## Register

> This is where the user is created. All other API(s) in this ecosystem will require the user first register here. The first user that registers with the account manager api will be granted all admin privages.

```endpoint
POST /api/v1/users
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
| refresh | string | Time when the token will expire. |
| user_id | number | |



```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgxMTU1MTM3LCJleHAiOjE1ODExNjU5Mzd9.tIs_PdW2TN8xVoW8Tz4wSNaEKL4BIRweL1-isJQOz1A",
    "user": {
        "id": 1,
        "updatedAt": "2020-02-08T09:45:37.363Z",
        "createdAt": "2020-02-08T09:45:37.363Z"
    }
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

```

#### ** 403 **

Forbidden:
The user is ban from this service. Or the ip is blocked

```json

```

#### ** 409 **

Conflict:
The user already has an account using that email address.

```json

```

#### ** 500 **

Internal Server Error:
Service is down.

```json

```




<!-- tabs:end -->