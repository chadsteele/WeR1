# WeR1 Homework

by Chad Steele

## Init

The [Original Requirements](#original-requirements) are at the end of this document

Clone and initialize the repository in your environment

```bash


```

If you don't already have ACR Cloud creds, get them...

-   For the external API please use: https://docs.acrcloud.com/reference/metadata-api.
-   To get the credentials for the external API requests, please sign up on https://console.acrcloud.com/signup#/register.

Ensure you have .env file in your root directory with the following...

```bash
JWT_SECRET=your.super.secret
JWT_EXPIRATION_TIME=60*60*24*7
ACRCLOUD_API_URL=https://eu-api-v2.acrcloud.com/api/external-metadata/tracks
ACRCLOUD_API_KEY=e.g.eyJ0eXA...Q3F9uXNy2qsvys
TEST_TOKEN=testing
```

Note: TEST_TOKEN is optional, but if you use it. You can put it in your headers in Apollo Studio and bypass the jwt tedium. For example, given that TEST_TOKEN=testing you can set Authorization header like so

```bash
Authorization:testing
```

## Integration Tests

The best way to exercise the code is via the unit/integration tests. You should see results similar to this...
The assignment asked for 2 tests. I did 18, to ensure it's working as expected. There are likely 18 more, at least, to test for all the ways a user could fail and/or hack the api. My goal was to satisfy the homework, not be bulletproof.

```bash
$ npm test

> wer1@1.0.0 test
> jest --verbose

 PASS  src/fetch.test.ts
  fetch from ACRCloud
    ✓ find 1999 by Prince on the internet (1029 ms)

 PASS  src/mutations.test.ts
  Mutations
    signUp(username: String!, password: String!): AuthPayload!
      ✓ returns a valid token (111 ms)
    login(username: String!, password: String!): AuthPayload!
      ✓ good login - returns a valid token (70 ms)
      ✓ failed login - bad password (92 ms)
      ✓ failed login - bad username (8 ms)
    createTrack(name: String!, artistName: String!, duration: Int!, ISRC: String!, releaseDate: DateTime!): Track!
      ✓ returns a new valid track record (6 ms)
    updateTrack(id: ID!, name: String, artistName: String, duration: Int, ISRC: String, releaseDate: DateTime): Track!
      ✓ updates a record (6 ms)
    deleteTrack(id: ID!): Track!
      ✓ deletes Bad Guy by Billie Eillish (6 ms)

 PASS  src/queries.test.ts (5.738 s)
  Queries
    getAllTracks: [Track!]!
      ✓ all of testData is returned (39 ms)
    getTrackByNameAndArtist(name: String!, artistName: String!): Track
      ✓ no artist returns nothing (7 ms)
      ✓ no track name returns nothing
      ✓ finds Blinding Lights by The Weekend in testData (2 ms)
      ✓ find Kiss by Prince on the internet (2958 ms)
    getTrackById(id: ID!): Track
      ✓ id = 1 - does not fetch from the internet  (9 ms)
      ✓ id = 2 - does not fetch from the internet  (2 ms)
      ✓ id = 3 - does not fetch from the internet  (1 ms)
      ✓ id = 4 - does not fetch from the internet  (4 ms)
      ✓ id = 5 - does not fetch from the internet  (4 ms)

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        6.178 s, estimated 7 s
Ran all test suites.

```

## Original Requirements

### Task: Build a GraphQL API for a track search service.

In this test assignment, you will be building a GraphQL API for a track search service. The goal
is to create a GraphQL schema and implement the necessary resolvers to handle various
operations related to tracks. The API should allow users to fetch tracks by name, create new
tracks if they are not present in the system, fetch all tracks, update tracks, and delete tracks.
You are required to create an Apollo server to run the Studio for the application, allowing you
to interact and test the GraphQL API. While the focus of this assignment is on the backend
functionality, you are not required to build a frontend for the application as Apollo Studio will
serve this purpose nicely.

For the external API please use: https://docs.acrcloud.com/reference/metadata-api.

To get the credentials for the external API requests, please sign up on
https://console.acrcloud.com/signup#/register.

Requirements:

1.  Implement a GraphQL schema with the following types. Please create a base
    schema that has internal id, created at & updated at fields that will be extended to the
    following schema:

         Track:

             - name
             - artist_name
             - duration
             - ISRC
             - release_date

2.  Implement the necessary resolvers to handle the following operations:

        -   Get a Track by its name and artist name & create a new entity to the database
            when not present in the system (should fetch data from the external API).
        -   Get all tracks in the database.
        -   Get/Update/Delete a specific Track by internal ID.

3.  Implement token authentication for the GraphQL endpoint.
4.  Include proper error handling and response status codes for GraphQL endpoints.
5.  Use TypeScript for type safety and provide clear and comprehensive type definitions
    for the application.
6.  Create an Apollo server for running the Studio for the application.
7.  Front-end not required for this application.
8.  Write 2 tests for the application
9.  Dockerized setup is a plus but not a requirement. Please add guidelines to the
    readme how to run the application in any case
10. Serve the GraphQL API through a single endpoint /graphql.

System logic implementation:

    -   When there is a search for a Track and there is no entry in the database, fetch it from
        the external API and create a new entry to the database.

Evaluation Criteria:

        -   Correct implementation of the GraphQL schema and resolvers.
        -   Proper error handling and response status codes.
        -   Use of TypeScript for type safety and clear type definitions.
        -   Overall code organization, readability, and best practices.
        -   Tests properly written.

**Please write a few sentences on how the evaluation criteria was met.**
