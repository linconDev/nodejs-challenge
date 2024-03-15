# Api Product Register

## Description

The Project aims to register products, of any type, to the user's liking.

### Instructions

1. This project was developed using nest.js, if you want to perform maintenance or test locally outside of docker, perform the following steps.

- Install Node.js version 20.11.1
- Install yarn globally
```shell
npm install yarn -g
```
- Install nestjs globally 
```shell
npm i -g @nestjs/cli
```
- install project dependencies:
```shell
yarn install
```
- Run the project with the command:
```shell
yarn start:dev
```

2. Only two routes are public, [POST] - [auth/login], [POST] - [user], The body to register your user is as follows:

``` json
{
    "name": "",
    "email": "",
    "password": ""
}
```

3. Then go to the login route and log in with the following field:

``` json
{
    "email": "",
    "password": ""
}
```

You receive:

``` json
{
    "user": {
        "id": 1,
        "name": "Lincon",
        "email": "lincongallo@gmail.com",
        "created_at": "15/03/2024 09:31:09",
        "updated_at": "15/03/2024 09:34:50"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNlY3JldGUiOiJsaW5jb25nYWxsb0BnbWFpbC5jb20kMmIkMTAkamU5TGU4UXBVS25HcFIzZkdGTHBIZXBlYXVwMzJTNXJFVFc3RExobTA1cTFzVmJ2WVZYWWEiLCJpYXQiOjE3MTA1MDcyMzksImV4cCI6MTcxMTExMjAzOX0.nW_cyoSYIUaSqXEzbE7IzZC5L3GCChOBBYmGVxXb_cw"
}
```

copy the access_token and in the other routes in headers, you will add Authorization, and in the value field do Bearer + access_token.

4. Register Factories first to be able to register products.
