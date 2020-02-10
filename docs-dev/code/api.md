# Code - API


## Token

#### How to exclude a route.

> All routes in the api want to have a token. You can force a route to not want a token by including it in the excludedRoute list.

in /api/api.js

```javascript
app.all('*', authService.tokenMiddleware({excludedRoutes:[
  '/api/v1/auth/*',
  '/api/v1/test'
]}));
```

> The list from the code above are routes that don't need tokens. 
> * Any route that begins with "/api/v1/auth/"
> * The route "/api/v1/test"

#### How to get the User Id

> If the route isn't excluded. There will be two new properties on the req object.

```javascript
  req.token;
  req.decodedToken;

  //where to find your user id.
  req.decodedToken.id;
```


## Permissions And Roles

> This app is broken into four different types of users. This section is about protecting routes for only admins and organizational members.

| User Type | Description|
|---|---|
|Admin|Every route is available to them.|
|Organizational| The can navigate the backend by permissions |
| User | They consume the content on the frontend. |
| Lead | CRM only, not users yet. |

#### Admin Routes

> To enforce a route for only admins, just "authService.onlyAdmin" middleware into the route

```javascript
app.post('/fake', authService.onlyAdmin, fakeController.fake);
```

> Now the route "/fake" can only be accessed by admins, all other users will recieve a 401 with the following response.

<!-- tabs:start -->

#### ** 401 **

```json
{
  "msg": "Unauthorized.",
  "humanMsg": "You don't the necessary permission(s).",
  "resolve": {
    "role": "Admin"
  }
}
```

<!-- tabs:end -->



