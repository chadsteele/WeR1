import tracks from "./testData.js"

export default {
	Query: {
		getTrackByNameAndArtist: async () => {},
		getAllTracks: async () => {
			return await tracks
		},
		getTrackById: async () => {},
	},
	Mutation: {
		createTrack: async () => {},
		updateTrack: async () => {},
		deleteTrack: async () => {},
	},
}
