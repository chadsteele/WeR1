import axios from "axios"
import "dotenv/config"

// using axios per the node example here https://docs.acrcloud.com/reference/metadata-api

export default async (name: string, artistNames: string[]) => {
	const apiKey = process.env.ACRCLOUD_API_KEY
	const url = process.env.ACRCLOUD_API_URL

	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url,
		params: {
			query: JSON.stringify({ track: name, artists: artistNames }),
			format: "json",
		},
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	}

	return await axios
		.request(config)
		.then((response) => {
			return map(response.data)
		})
		.catch((error) => {
			console.error({ config, error })
			return error
		})
}

function map({ data }: any) {
	data = {
		artists: [{ name: "missing artist" }],
		album: {},
		...data[0],
	}
	return {
		id: data.isrc,
		name: data.name,
		artistName: data.artists[0]?.name,
		duration: data.duration_ms,
		ISRC: data.isrc,
		releaseDate: data?.album?.release_date,
		createdAt: new Date(),
		updatedAt: new Date(),
	}
}

// const raw = {
// 	data: [
// 		{
// 			name: "bellyache",
// 			duration_ms: 179172,
// 			track_number: 1,
// 			isrc: "USUM71615103",
// 			artists: [{ name: "Billie Eilish" }],
// 			album: {
// 				name: "Bellyache",
// 				release_date: "2017-02-24",
// 				cover: "https://i.scdn.co/image/ab67616d0000b2734adbeb26299adca766cec2c5",
// 				covers: {
// 					small: "https://i.scdn.co/image/ab67616d000048514adbeb26299adca766cec2c5",
// 					medium: "https://i.scdn.co/image/ab67616d00001e024adbeb26299adca766cec2c5",
// 					large: "https://i.scdn.co/image/ab67616d0000b2734adbeb26299adca766cec2c5",
// 				},
// 				upc: "00602557307894",
// 			},
// 		},
// 	],
// }
