import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import tracks from "./testData.js"
import typeDefs from "./typeDefs.js"
import resolvers from "./resolvers.js"
import jwt from "jsonwebtoken"

const getUser = (token: string) => {
	try {
		if (token) {
			console.log({
				getUser: token,
				secret: process.env.JWT_SECRET,
				verify: jwt.verify(token, process.env.JWT_SECRET),
			})
			return jwt.verify(token, process.env.JWT_SECRET)
		}
		return null
	} catch (err) {
		return null
	}
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs,
	resolvers,
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		// Get the user token from the headers.
		const token = req.headers.authorization || ""

		// Try to retrieve a user with the token
		const user = await getUser(token)

		// Add the user to the context
		return { user }
	},
})

console.log(`🚀  Server ready at: ${url}`)
