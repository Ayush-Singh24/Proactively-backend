# API DOCUMENTATION (POSTMAN)

Check out in detailed documentation here: https://documenter.getpostman.com/view/40351834/2sAYHwJQ8X#e36902a5-ce05-4c62-8d51-28c89359ac64

# Technologies Used

- Node.js + Express.js
- Typescript
- Nodemon
- LIBSQLITE + Drizzle
- SendGrid Mail
- ICS (For Calender Invite)

I have utilized Drizzle to design and interact with SQL Database(LIBSQL).

LibSQL is used in this project primarily for facilitating ease of testing. This choice enables more efficient and effective testing of database interactions.

# How to Run?

Use the following commands:

```
git clone https://github.com/ayush-singh24/proactively-backend.git

cd proactively-backend
```

- Copy KEY VALUE FOR `SENDGRID_API_KEY` environment value from **abc.txt** and paste it in .env file.

```
npm install (or) yarn

npm run start (or) yarn start
```

Now the server should be running on your machine with `PORT:3000`.

# Endpoints

Some examples and screenshots of the implemented endpoints. For more comprehenesive explanation check out my documentation here: https://documenter.getpostman.com/view/40351834/2sAYHwJQ8X#e36902a5-ce05-4c62-8d51-28c89359ac64

If you have followed the steps above to run the server, then hit the request at `https://localhost:3000/`

## /auth/signup (POST)

Signup

### Request

```
{
    "firstName": "Atul",
    "lastName": "Singh",
    "email": "asayush40@gmail.com",
    "password": "1234",
    "userType": "user"
}

```

### Response

```
{
    "message": "Success",
    "user": 24
}
```

## /auth/login (POST)

Endpoint for login(only for signedup users).

### Request

```
{
    "email": "asayush40@gmail.com",
    "password": "1234"
}
```

### Response

```
{
    "message": "Logged in Successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTczMzkyMzU5NH0.qJz95jYh-QUMZTZQ3O3iu8m-br6e2W0w8NhCFbKCXBc",
    "userId": 1
}
```

This token is then used to attach **Authorization** header for protected routes.

![otp-proof](./screenshots/otp-proof.png)

## /verify (POST) (PROTECTED ROUTE)

OTP verifcation

### Request

```
{
    "otp" : "7134"
}
```

### Response

```
{
    "message": "User verified successfully"
}
```

## /speaker/profile (PATCH) (PROTECTED ROUTE) (FOR SPEAKERS ONLY)

Endpoint for speakers, so they can updater their profile.

## Request

```
{
    "expertise": "Can talk about politics",
    "pricePerSession": 500
}
```

## Response

```
{
    "message": "Added expertise and price per session",
    "userId": 2
}
```

## /user/allSpeakers?date=11-12-2024 (GET) (PROTECTED ROUTE)

Get all speakers and their available timeslots.

## Response

```
{
    "message": "Success",
    "data": [
        {
            "email": "asayushsingh80@gmail.com",
            "firstName": "Ayush",
            "lastName": "Singh",
            "expertise": "Can talk about politics",
            "pricePerSession": 500,
            "status": "not verified",
            "availableSlots": [
                "9 AM - 10 AM",
                "10 AM - 11 AM",
                "11 AM - 12 PM",
                "12 PM - 1 PM",
                "1 PM - 2 PM",
                "2 PM - 3 PM",
                "3 PM - 4 PM"
            ]
        }
    ]
}
```

## /user/book (PROTECTED ROUTE)

Endpoint for booking speaker's timeslot.

## Request

```
{
    "date": "11-12-2024",
    "slot": "10 AM - 11 AM",
    "speakerEmail": "asayushsingh80@gmail.com"
}
```

## Response (SUCCESS)

```
{
    "message": "Slot booked successfully",
    "bookingId": 13
}
```

Upon successfull booking, Google Calender Invite is sent to both user and speaker.

USER:
![calender-invite](./screenshots/calender-invite.png)

SPEAKER:
![calender-invite2](./screenshots/calender-invite2.png)

## Response (ERROR)

```
{
    "error": "Speaker is not available for that slot, please try with some other slot"
}
```

# CAUTION

## Upon successful login, please ensure to check your inbox and spam folder for emails sent by our backend system. Occasionally, these emails may be flagged as spam.
