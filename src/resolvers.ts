// resolvers.js

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import fetch from "node-fetch"
import tracks from "./testData.js"

const users = [] // In-memory user store for simplicity
//let tracks = [] // In-memory track store for simplicity

const fetchTrackFromAPI = async (name, artistName) => {
	const apiKey = process.env.ACRCLOUD_API_KEY
	const url = `https://api.acrcloud.com/v1/music?name=${name}&artist=${artistName}`
	// https://eu-api-v2.acrcloud.com/api/external-metadata/tracks

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	})

	const data = await response.json()
	if (data.metadata && data.metadata.music.length > 0) {
		const track = data.metadata.music[0]
		return {
			id: tracks.length + 1,
			name: track.title,
			artistName: track.artists[0].name,
			duration: track.duration_ms / 1000,
			ISRC: track.external_ids.isrc,
			releaseDate: new Date(track.release_date),
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	}
	return null
}

export default {
	Query: {
		getTrackByNameAndArtist: async (_, { name, artistName }, { user }) => {
			if (!user) throw new Error("You must be logged in")
			let track = tracks.find(
				(t) => t.name === name && t.artistName === artistName
			)

			if (!track) {
				track = await fetchTrackFromAPI(name, artistName)
				if (track) {
					tracks.push(track)
				}
			}

			return track
		},
		getAllTracks: async (_, __, { user }) => {
			if (!user) throw new Error("You must be logged in")
			return tracks
		},
		getTrackById: async (_, { id }, { user }) => {
			if (!user) throw new Error("You must be logged in")

			const track = tracks.find((t) => t.id === parseInt(id))
			if (!track) throw new Error("Track not found")

			return track
		},
	},
	Mutation: {
		createTrack: async (_, args, { user }) => {
			if (!user) throw new Error("You must be logged in")

			const track = {
				id: tracks.length + 1,
				...args,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
			tracks.push(track)
			return track
		},
		updateTrack: async (_, { id, ...args }, { user }) => {
			if (!user) throw new Error("You must be logged in")

			const index = tracks.findIndex((t) => t.id === parseInt(id))
			if (index === -1) throw new Error("Track not found")

			const updatedTrack = {
				...tracks[index],
				...args,
				updatedAt: new Date(),
			}
			tracks[index] = updatedTrack
			return updatedTrack
		},
		deleteTrack: async (_, { id }, { user }) => {
			if (!user) throw new Error("You must be logged in")

			const index = tracks.findIndex((t) => t.id === parseInt(id))
			if (index === -1) throw new Error("Track not found")

			const deletedTrack = tracks.splice(index, 1)
			return deletedTrack[0]
		},
		signUp: async (_, { username, password }) => {
			const hashedPassword = await bcrypt.hash(password, 10)
			const user = {
				id: users.length + 1,
				username,
				password: hashedPassword,
			}
			users.push(user)
			console.log({ user, secret: process.env.JWT_SECRET })
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
			console.log({ user, token })
			return { token }
		},
		login: async (_, { username, password }) => {
			const user = users.find((u) => u.username === username)
			if (!user) {
				throw new Error("Invalid credentials")
			}
			const valid = await bcrypt.compare(password, user.password)
			if (!valid) {
				throw new Error("Invalid credentials")
			}
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
			return { token }
		},
	},
}
