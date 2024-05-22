import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import tracks from "./defaultTracks"
import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import jwt from "jsonwebtoken"
import { applyMiddleware } from "graphql-middleware"
import { makeExecutableSchema } from "graphql-tools"

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		const token = (req.headers.authorization || "").replace("Bearer ", "")
		const user = await isValidatedUser(token)
		return { user }
	},
})

console.log(`🚀  Server ready at: ${url}`)

export function isValidatedUser(token: string) {
	const testing = process.env.TEST_TOKEN
	if (testing && token == testing) return token
	return jwt.verify(token, process.env.JWT_SECRET)
}
