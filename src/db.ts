// dirt simple for now
export class Database {
	_users = []
	_tracks = []

	get users() {
		return this._users
	}
	get tracks() {
		return this._tracks
	}

	set users(users) {
		this._users = users
	}
	set tracks(tracks) {
		this._tracks = tracks
	}
}

export default new Database()
