# Demo Playwright usage for API Testing

## Description
```
This is a demo project to show how to use Playwright for API Testing

Typescript is used for this project
```

## Pre-requisites
```
NodeJS
GIT
```

## Steps
### Clone Repository
```
git clone
```

### Install dependencies
```
npm install
```

### Add .env file
```
Create .env file in the root folder
For basic setup, this tests cases need 

GOREST_TOKEN=your-token

Get The token by registering here
https://gorest.co.in/#google_vignette

You can generate and get the token from here
https://gorest.co.in/my-account/access-tokens
```

### Test Files is inside tests folder
```
./tests/some-test.spec.ts
```

## How to run the tests
### For Running all tests
```
npx playwright test
```

### For Running specific test
```
npx playwright test tests/some-test.spec.ts
```
