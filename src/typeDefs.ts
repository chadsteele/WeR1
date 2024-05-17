export default `#graphql
scalar DateTime

interface Base {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Track implements Base {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    name: String!
    artistName: String!
    duration: Int!
    ISRC: String!
    releaseDate: DateTime!
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
`
