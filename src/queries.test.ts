import defaultTracks from "./defaultTracks"
import { beforeAll, expect, jest, test, describe } from "@jest/globals"
import db from "./db"
import { ApolloServer } from "@apollo/server"
import tracks from "./defaultTracks"
import typeDefs from "./typeDefs"
import resolvers from "./resolvers"

const testServer = new ApolloServer({
	typeDefs,
	resolvers,
})

describe("Queries", () => {
	describe("getAllTracks: [Track!]!", () => {
		// arrange
		db.tracks = [...defaultTracks]
		const query = `
                    query GetAllTracks {
                        getAllTracks {
                            id
                            name
                            artistName
                            duration
                            ISRC
                            releaseDate
                            createdAt
                            updatedAt
                        }
                    }
                    `

		test("all of testData is returned", async () => {
			// act:
			const response: any = await testServer.executeOperation({
				query,
			})
			const data = response.body.singleResult.data.getAllTracks

			// assert:
			expect(data).toBeDefined()
			expect(data.length).toBeGreaterThanOrEqual(defaultTracks.length)
			defaultTracks.forEach((track, i) => {
				expect(track).toMatchObject(data[i]) // DO NOT delete original tracks
			})
		})
	})
	describe("getTrackByNameAndArtist(name: String!, artistName: String!): Track", () => {
		// arrange
		const query = `
                    query GetTrackByNameAndArtist($name: String!, $artistName: String!) {
                        getTrackByNameAndArtist(name: $name, artistName: $artistName) {
                            id
                            name
                            artistName
                            duration
                            ISRC
                            releaseDate
                            createdAt
                            updatedAt
                        }
                    }
                    `

		test("no artist returns nothing", async () => {
			// arrange:
			db.tracks = [...defaultTracks]
			const variables = {
				name: "Blinding Lights",
				artistName: "",
			}

			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const data = response.body.singleResult.data.getTrackByNameAndArtist

			// assert:
			expect(data).toBeNull()
		})

		test("no track name returns nothing", async () => {
			// arrange:
			db.tracks = [...defaultTracks]
			const variables = {
				name: "",
				artistName: "The Weeknd",
			}

			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const data = response.body.singleResult.data.getTrackByNameAndArtist

			// assert:
			expect(data).toBeNull()
		})

		test("finds Blinding Lights by The Weekend in testData", async () => {
			// arrange:
			db.tracks = [...defaultTracks]
			const variables = {
				name: "Blinding Lights",
				artistName: "The Weeknd",
			}

			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const data = response.body.singleResult.data.getTrackByNameAndArtist

			// assert:
			// ensure all variables match
			for (let key in variables) {
				expect(variables[key]).toBe(data[key])
			}
		})

		test("find Kiss by Prince on the internet", async () => {
			// arrange:
			db.tracks = [...defaultTracks]
			const variables = {
				name: "Kiss",
				artistName: "Prince",
			}

			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const data = response.body.singleResult.data.getTrackByNameAndArtist

			// assert:
			// ensure all variables match
			for (let key in variables) {
				expect(variables[key]).toBe(data[key])
			}
		})
	})

	describe("getTrackById(id: ID!): Track", () => {
		// arrange
		const query = `
                        query GetTrackById($getTrackById: ID!) {
                            getTrackById(id: $getTrackById) {
                            id
                            name
                            artistName
                            duration
                            ISRC
                            releaseDate
                            createdAt
                            updatedAt
                            }
                        }
                        `
		const variables = {
			getTrackById: 1,
		}

		defaultTracks.forEach((track, i) => {
			test(`id = ${
				i + 1
			} - does not fetch from the internet `, async () => {
				// arrange::
				variables.getTrackById = i + 1

				// act:
				const response: any = await testServer.executeOperation({
					query,
					variables,
				})

				const data = response.body.singleResult.data.getTrackById

				// assert:
				expect(data).toMatchObject(defaultTracks[i])
			})
		})
	})
})
