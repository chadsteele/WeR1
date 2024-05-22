import { expect, test, describe } from "@jest/globals"
import { ApolloServer } from "@apollo/server"
import defaultTracks from "./defaultTracks"
import db from "./db"
import typeDefs from "./typeDefs"
import resolvers from "./resolvers"

const contextValue = { user: "chad steele" }

const testServer = new ApolloServer({
	typeDefs,
	resolvers,
})

describe("Mutations", () => {
	describe("signUp(username: String!, password: String!): AuthPayload!", () => {
		// arrange
		const query = `
		        mutation signUp($username: String!, $password: String!) {
		            signUp(username: $username, password: $password) {
		            token
		            }
				}
		  `
		const variables = {
			username: "chad",
			password: "steele",
		}
		test("returns a valid token", async () => {
			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const token = response.body.singleResult.data.signUp.token

			expect(token).toBeTruthy()

			// a valid token has 3 parts separated by .
			// e.g.
			// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
			// .eyJ1c2VySWQiOjEsImlhdCI6MTcxNjIxMDM2OX0
			// .QVt5NFKk7JtGPgH-Rr-h-dvr1K85KcO40zblAEq5oLQ
			expect(token.split(".").length).toEqual(3)
		})
	})
	describe("login(username: String!, password: String!): AuthPayload!", () => {
		// arrange:
		const query = `
		                mutation Login($username: String!, $password: String!) {
		                    login(username: $username, password: $password) {
		                    token
		                    }
		                }
		  `
		const variables = {
			username: "chad",
			password: "steele",
		}

		test("good login - returns a valid token", async () => {
			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const token = response.body.singleResult.data.login.token

			// assert:

			expect(token).toBeTruthy()

			// a valid token has 3 parts separated by .
			// e.g.
			// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
			// .eyJ1c2VySWQiOjEsImlhdCI6MTcxNjIxMDM2OX0
			// .QVt5NFKk7JtGPgH-Rr-h-dvr1K85KcO40zblAEq5oLQ
			expect(token.split(".").length).toEqual(3)
		})

		test("failed login - bad password", async () => {
			// arrange:
			const variables = {
				username: "chad",
				password: "error",
			}

			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const error = response.body.singleResult.errors[0].message

			// assert:
			expect(error.length).toBeGreaterThan(0)
		})

		test("failed login - bad username", async () => {
			// arrange:
			const variables = {
				username: "error",
				password: "steele",
			}

			// act:
			const response: any = await testServer.executeOperation({
				query,
				variables,
			})

			const error = response.body.singleResult.errors[0].message

			// assert:
			expect(error.length).toBeGreaterThan(0)
		})
	})
	describe("createTrack(name: String!, artistName: String!, duration: Int!, ISRC: String!, releaseDate: DateTime!): Track!", () => {
		// arrange
		const query = `
					mutation CreateTrack($name: String!, $artistName: String!, $duration: Int!, $ISRC: String!, $releaseDate: DateTime!) {
						createTrack(name: $name, artistName: $artistName, duration: $duration, ISRC: $ISRC, releaseDate: $releaseDate) {
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
			name: "testing",
			artistName: "tester",
			duration: 9999,
			ISRC: "ISRC test",
			releaseDate: "1999",
		}
		test("returns a new valid track record", async () => {
			// act:
			const response: any = await testServer.executeOperation(
				{
					query,
					variables,
				},
				{ contextValue }
			)

			const data = response.body.singleResult.data.createTrack

			// assert:
			// ensure all variables match
			for (let key in variables) {
				expect(variables[key]).toBe(data[key])
			}
			expect(data.createdAt).toEqual(data.updatedAt) // brand new
		})
	})
	describe("updateTrack(id: ID!, name: String, artistName: String, duration: Int, ISRC: String, releaseDate: DateTime): Track!", () => {
		// arrange
		const query = `
				mutation UpdateTrack($id: ID!, $name: String) {
					updateTrack(id: $id, name: $name) {,
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
			id: "1",
			name: "updated",
		}
		test("updates a record", async () => {
			// act:
			db.tracks = [...defaultTracks]
			const response: any = await testServer.executeOperation(
				{
					query,
					variables,
				},
				{ contextValue }
			)

			const data = response.body.singleResult.data.updateTrack

			// assert:
			// ensure all variables match
			for (let key in variables) {
				expect(variables[key]).toBe(data[key])
			}
			const created = new Date(data.createdAt).getTime()
			const updated = new Date(data.updatedAt).getTime()
			expect(created).toBeLessThanOrEqual(updated) // different dates
		})
	})
	describe("deleteTrack(id: ID!): Track!", () => {
		// arrange
		db.tracks = [...defaultTracks]
		const query = `
				mutation DeleteTrack($deleteTrackId: ID!) {
					deleteTrack(id: $deleteTrackId) {
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
			deleteTrackId: "4",
		}
		test("deletes Bad Guy by Billie Eillish", async () => {
			// act:
			db.tracks = [...defaultTracks]
			const response: any = await testServer.executeOperation(
				{
					query,
					variables,
				},
				{ contextValue }
			)

			const data = response.body.singleResult.data.deleteTrack

			// assert:
			expect(data.name).toEqual("Bad Guy") // returns the deleted record
			const badguys = db.tracks.filter((track) => track.name == "Bad Guy")
			expect(badguys.length).toEqual(0) // it's gone
		})
	})
})
