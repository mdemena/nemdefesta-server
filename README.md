# Nem De Festa '!!!' (Server edition)

## Developers

[Marc De Mena](@mdemena)

## Link to App

https://www.nemdefesta.cat

## Description

An app where users can enjoy experience in local events/parties in catalonia, in my first iteration of this application.

## User Stories

- **event list** - As a user I want to be able to know and search local partys around me or a location of my election.
- **event detail** - As a user I want to see the event detail and so that I can decide if I want assist to it, like, comments, etc..
- **event like** - As a user I want to like/unlike local event/party.
- **event assist** - As a user I want to set I assist to local event/party.
- **event add comments** - As a user I want to put comments of the event, we need be loggedin.
- **event comments like** - As a user I want to like event comments.
- **activity detail** - As a user I want to see the event activity to event and so that I can decide if I want assist to it, like, comment, etc..
- **activity like** - As a user I want to like local event/party.
- **activity assist** - As a user I want to set I assist to local event/party.
- **activity add comments** - As a user I want to put comments of the event activity, we need be loggedin.
- **activity comment like** - As a user I want to like activity comments.
- **sign up** - As a user I want to sign up on the applicaction so that I can see all information refer to me and events that I could attend, etc..
- **login** - As a user I want to be able to log in on the application so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the application so that I can make sure no one will access my account.
- **profile** - As a user I want view and update all information refered to me. Can upload an avatar, view my interactions (Comments, Assitance, etc..)
- **event create** - As a user I want create a new local event/party.
- **location event create** - As a user I want I want create a new shared location for activitis in a local event/party.
- **activity create** - As a user I want I want create a new activity in a local event/party.

## Backlog

List of other features outside of the MVPs scope

Photos:

- User can upload images for an event or activity.

Competitions:
In some towns like Granollers or Sant Celoni, during local event/party it plays a competition between 2 or more teams (Blanc and Blaus in Granollers, Montsenys and Montnegres in Sant Celoni, etc.)

- Set teams for local event/party competition.
- Set puntable activities.
- Set results of activity competitions.
- Show results of competitions in activities and local event/party.

Push Notifications:

- User can subscribe to receive notificactions for activities.
- User can subscribe to receive notifications for competition results, when will be applied.
- Receive a notification when starts a subscribed activity.
- Receive a notificacion when has new competition result information, when will be applied.

## Routes

| Method | URL             | Description                        |
| ------ | --------------- | ---------------------------------- |
| POST   | /api/auth/login | Return User data if user logged in |

```
body:
    - email
    - password
```

| Method | URL              | Description                                     |
| ------ | ---------------- | ----------------------------------------------- |
| POST   | /api/auth/logout | Logout.                                         |
| POST   | /api/auth/signup | Add user and return user data if user signup in |

```
body:
    - email
    - name
    - password
```

| Method | URL        | Description           |
| ------ | ---------- | --------------------- |
| GET    | /api/user/ | Return User data      |
| DELETE | /api/user/ | Delete User           |
| PUT    | /api/user/ | Update User data info |

```
body:
    - email
    - name
```

| Method | URL              | Description       |
| ------ | ---------------- | ----------------- |
| PATCH  | /api/user/upload | Update User image |

```
body:
    - image
```

| Method | URL                     | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| POST   | /api/user/checkusername | Check if username exist in database |

```
body:
    - username
```

| Method | URL                  | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | /api/user/checkemail | Check if email exist in database |

```
body:
    - email
```

| Method | URL          | Description                            |
| ------ | ------------ | -------------------------------------- |
| POST   | /api/events/ | Return events list match filter params |

```
body:
    - fromDate
    - toDate
    - longitude
    - lalitude
    - distance
    - searchText
```

| Method | URL              | Description                                                  |
| ------ | ---------------- | ------------------------------------------------------------ |
| GET    | /api/events/:id  | Return event details: Event data, activities, comments, etc. |
| POST   | /api/events/add/ | Create a new event and return event details: Event data      |

```
body:
    - name
    - description
    - from
    - to
    - image
    - location
```

| Method | URL             | Description                                                              |
| ------ | --------------- | ------------------------------------------------------------------------ |
| DELETE | /api/events/:id | Delete event and all info related, then return event details: Event data |
| PUT    | /api/events/:id | Update event info and return event details: Event data                   |

```
body:
    - name
    - description
    - from
    - to
    - location
```

| Method | URL                    | Description        |
| ------ | ---------------------- | ------------------ |
| PATCH  | /api/events/upload/:id | Update event image |

```
body:
    - image
```

| Method | URL                   | Description                             |
| ------ | --------------------- | --------------------------------------- |
| PATCH  | /api/events/image/:id | Add an image to image list for an event |

```
body:
    - title
    - description
    - image
```

| Method | URL                      | Description                                                                  |
| ------ | ------------------------ | ---------------------------------------------------------------------------- |
| PATCH  | /api/events/like/:id     | Add a like to event                                                          |
| PATCH  | /api/events/unlike/:id   | Add a unlike to event                                                        |
| PATCH  | /api/events/attendee/:id | Add an user to event assist list                                             |
| GET    | /api/locations/          | Return a location list.                                                      |
| GET    | /api/locations/:id       | Return location details: Location data, etc.                                 |
| GET    | /api/locations/event/:id | Return a loaction list for an Event.                                         |
| POST   | /api/locations/          | Create a new location event and return location event details: Location data |

```
body:
    - name
    - address
    - formatted_address
    - lat
    - lng
    - event
```

| Method | URL                | Description                                                     |
| ------ | ------------------ | --------------------------------------------------------------- |
| DELETE | /api/locations/:id | Delete location, then return location details: Location data    |
| PUT    | /api/locations/:id | Update location info and return location details: Location data |

```
body:
    - name
    - address
    - formatted_address
    - lat
    - lng
```

| Method | URL              | Description                                |
| ------ | ---------------- | ------------------------------------------ |
| POST   | /api/activities/ | Return activities list match filter params |
```
body:
    - fromDate
    - toDate
    - longitude
    - lalitude
    - distance
    - searchText
```

| Method | URL                       | Description                                                                 |
| ------ | ------------------------- | --------------------------------------------------------------------------- |
| GET    | /api/activities/event/:id | Return activities list from an eventid put in params.                       |
| GET    | /api/activities/:id       | Return activity details: Activity data, comments, etc.                      |
| POST   | /api/activities/add/:id   | Create a new activity in a event and return activity details: Activity data |

```
body:
    - name
    - description
    - from
    - to
    - image
    - location
```

| Method | URL                 | Description                                                                       |
| ------ | ------------------- | --------------------------------------------------------------------------------- |
| DELETE | /api/activities/:id | Delete activity and all info related, then return activity details: Activity data |
| PUT    | /api/activities/:id | Update activity info and return activity details: Activity data                   |

```
body:
    - name
    - description
    - from
    - to
    - location
```

| Method | URL                      | Description           |
| ------ | ------------------------ | --------------------- |
| PATCH  | /api/activity/upload/:id | Update activity image |

```
body:
    - image
```

| Method | URL                     | Description                                |
| ------ | ----------------------- | ------------------------------------------ |
| PATCH  | /api/activity/image/:id | Add an image to image list for an activity |

```
body:
    - title
    - description
    - image
```

| Method | URL                      | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| PATCH  | /api/activity/like/:id   | Add a like to event                 |
| PATCH  | /api/activity/unlike/:id | Add an unlike to event              |
| PATCH  | /api/activity/assist/:id | Add an activity to user assist list |

| Method | URL                        | Description                                                                           |
| ------ | -------------------------- | ------------------------------------------------------------------------------------- |
| GET    | /api/comments              | Return comments list.                                                                 |
| GET    | /api/comments/event/:id    | Return comments list from an event.                                                   |
| GET    | /api/comments/activity/:id | Return comments list from an activity.                                                |
| GET    | /api/comments/:id          | Return comment details: Comment data, likes, etc.                                     |
| POST   | /api/comments/:id          | Create a new activity in a event or activity and return comment details: Comment data |

```
body:
    - title
    - description
```

| Method | URL               | Description                                                   |
| ------ | ----------------- | ------------------------------------------------------------- |
| DELETE | /api/comments/:id | Delete comment, then return comments details: Comments data   |
| PUT    | /api/comments/:id | Update comments info and return comment details: Comment data |

```
body:
    - title
    - description
```

| Method | URL                     | Description              |
| ------ | ----------------------- | ------------------------ |
| PATCH  | /api/comment/like/:id   | Add a like to comment    |
| PATCH  | /api/comment/unlike/:id | Add an unlike to comment |
| PATCH  | /api/image/like/:id     | Add a like to image      |
| PATCH  | /api/image/unlike/:id   | Add an unlike to image   |

## Models

```
User model
- username: String
- email: String
- name: String
- password: String
- image: String
```

```
Event model
- name: String
- description: String
- type: String
- from: Date
- to: Date
- image: String
- location:
    - name: String
    - address: String
    - formatted_address: String
    - lat: Number
    - lng: Number
- locations: Array of Location id
- images: Array of String
- likes: Array of User id
- unlikes: Array of User id
- assistants: Array of User id
- comments: Array of Comment id
- user: User id
```

```
Location model
- name: String
- address: String
- formatted_address: String
- lat: Number
- lng: Number
- event: Event id
```

```
Activity model
- name: String
- description: String
- type: String
- from: Date
- to: Date
- image: String
- location: Location Id
- images: Array of String
- likes: Array of User id
- unlikes: Array of User id
- assistants: Array of User id
- comments: Array of Comment id
- event: Event id
```

```
Comment model
- title: String
- description: String
- likes: Array of User id,
- unlikes: Array of User id,
- user: User Id,
```

```
Image model
- title: String
- description: String
- image: String
- likes: Array of User id,
- unlikes: Array of User id,
- user: User Id,
```

## Links

### Wireframes

[Wireframes](https://excalidraw.com/#json=6310275766550528,jC9GmdLS5-t-SHJT2pUBkw)

### Git

[Repository Link](https://github.com/mdemena/nemdefesta-server)

[Deploy Link]('https://server.nemdefesta.cat/')
