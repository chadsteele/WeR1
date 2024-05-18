export default `
# schema.graphql

scalar DateTime

interface Base {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Track implements Base {
  id: ID!
  name: String!
  artistName: String!
  duration: Int!
  ISRC: String!
  releaseDate: DateTime!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  getTrackByNameAndArtist(name: String!, artistName: String!): Track
  getAllTracks: [Track!]!
  getTrackById(id: ID!): Track
}

type Mutation {
  createTrack(name: String!, artistName: String!, duration: Int!, ISRC: String!, releaseDate: DateTime!): Track!
  updateTrack(id: ID!, name: String, artistName: String, duration: Int, ISRC: String, releaseDate: DateTime): Track!
  deleteTrack(id: ID!): Track!
}

type AuthPayload {
  token: String!
}

type Mutation {
  signUp(username: String!, password: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
}

`
