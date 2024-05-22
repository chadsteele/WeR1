import { expect, test, describe } from "@jest/globals"
import fetch from "./fetchACR"

describe("fetch from ACRCloud", () => {
	test("find 1999 by Prince on the internet", async () => {
		// arrange:
		const name = "1999 - 2019 Remaster",
			artistName = "Prince"

		// act:
		const data = await fetch(name, [artistName])

		// assert:
		expect(name).toEqual(data.name)
		expect(artistName).toEqual(data.artistName)
	})
})
