// resolvers.js
import db from "./db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import fetch from "./fetch"
import { GraphQLError } from "graphql"

export default {
	Query: {
		getTrackByNameAndArtist: async (_, { name, artistName }, { user }) => {
			if (!name) return null
			if (!artistName) return null

			let track: any = db.tracks.find(
				(t) => t.name === name && t.artistName === artistName
			)

			if (!track) {
				track = await fetch(name, [artistName])
				//console.log({ fetch: track })
				if (track) db.tracks.push(track)
			}
			return track
		},
		getAllTracks: async (_, __, { user }) => {
			return db.tracks
		},
		getTrackById: async (_, { id }, { user }) => {
			const track = db.tracks.find((t) => t.id == id)
			if (!track) throw new GraphQLError("Track not found")

			return track
		},
	},
	Mutation: {
		createTrack: async (_, args, { user }) => {
			if (!user) throw new GraphQLError("Invalid user!")
			const track = {
				id: db.tracks.length + 1,
				...args,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
			db.tracks.push(track)
			return track
		},
		updateTrack: async (_, { id, ...args }, { user }) => {
			if (!user) throw new GraphQLError("Invalid user!")
			const index = db.tracks.findIndex((t) => t.id == id)
			if (index === -1) throw new GraphQLError("Track not found")

			//console.log({ ...args })
			const updatedTrack = {
				...db.tracks[index],
				...args,
				updatedAt: new Date(),
			}
			db.tracks[index] = updatedTrack
			return updatedTrack
		},
		deleteTrack: async (_, { id }, { user }) => {
			if (!user) throw new GraphQLError("Invalid user!")
			const index = db.tracks.findIndex((t) => t.id == id)
			if (index === -1) throw new GraphQLError("Track not found")

			const deletedTrack = db.tracks.splice(index, 1)
			return deletedTrack[0]
		},
		signUp: async (_, { username, password }) => {
			const hashedPassword = await bcrypt.hash(password, 10)
			const user = {
				id: db.users.length + 1,
				username,
				password: hashedPassword,
			}
			db.users.push(user)
			//console.log({ user, secret: process.env.JWT_SECRET })
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
			//console.log({ signUp: user, token })
			return { token }
		},
		login: async (_, { username, password }) => {
			const user = db.users.find((u) => u.username === username)
			if (!user) {
				throw new GraphQLError("Invalid credentials")
			}
			const valid = await bcrypt.compare(password, user.password)
			if (!valid) {
				throw new GraphQLError("Invalid credentials")
			}
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
			//console.log({ verify: jwt.verify(token, process.env.JWT_SECRET) })
			//console.log({ login: user, token, users: db.users })
			return { token }
		},
	},
}
