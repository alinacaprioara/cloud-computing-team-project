from http.server import BaseHTTPRequestHandler, HTTPServer

from bson import ObjectId
from pymongo import MongoClient
import json

client = MongoClient('localhost', 27017)
db = client['song_storage']
songs = db.songs
users = db.users


def convert_object_id_to_json(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError("Type not serializable")


class SongStorageAPI(BaseHTTPRequestHandler):
    def _send_response(self, code, body, headers=None):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")

        if headers:
            for header, value in headers.items():
                self.send_header(header, value)

        self.end_headers()
        self.wfile.write(json.dumps(body, default=convert_object_id_to_json).encode())

    def do_GET(self):
        if self.path == "/songs":
            all_songs = list(songs.find({}, {"_id": 1, "title": 1, "artist": 1}))
            self._send_response(200, all_songs)

        elif self.path.startswith("/songs/"):
            song_id = self.path.split("/")[-1]
            try:
                song = songs.find_one({"_id": ObjectId(song_id)})
                if song:
                    self._send_response(200, song)
                else:
                    self._send_response(404, {"error": "Song not found"})
            except Exception as e:
                self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})

        elif self.path == "/users":
            users_list = list(users.find({}, {"_id": 1, "username": 1}))
            self._send_response(200, users_list)


        elif self.path.startswith("/users/") and self.path.endswith("/playlists"):
            user_id = self.path.split("/")[-2]
            try:
                user = users.find_one({"_id": ObjectId(user_id)})
                if user:
                    self._send_response(200, user.get("playlists",[]))
                else:
                    self._send_response(404, {"error": "User not found"})
            except Exception as e:
                self._send_response(422, {"error": f"{e} Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})

        elif self.path.startswith("/users/") and "/playlists/" in self.path:
            user_id = self.path.split("/")[-3]
            playlist_id = self.path.split("/")[-1]

            try:
                user = users.find_one({"_id": ObjectId(user_id)})
                if user:
                    playlist = None
                    for p in user["playlists"]:
                        if str(p["_id"]) == playlist_id:
                            playlist = p
                            break
                    if playlist:
                        self._send_response(200, playlist)
                    else:
                        self._send_response(404, {"error": "Playlist not found"})
                else:
                    self._send_response(404, {"error": "User not found"})
            except:
                self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})

        elif self.path.startswith("/users/"):
            user_id = self.path.split("/")[-1]
            user = users.find_one({"_id": ObjectId(user_id)})
            if user:
                self._send_response(200, user)
            else:
                self._send_response(404, {"error": "User not found"})

    def do_POST(self):

        try:
            body_length = int(self.headers.get('Content-Length', 0))
            if body_length == 0:
                self._send_response(400, {"error": "Request body is missing"})
                return
            post_data = json.loads(self.rfile.read(body_length))

            if self.path == "/songs":
                required_fields = {"title", "artist", "album", "year", "genre"}
                if not all(field in post_data for field in required_fields):
                    self._send_response(422, {"error": "Request had invalid or missing data."})
                    return
                song_id = songs.insert_one(post_data).inserted_id
                location_header = f"/songs/{str(song_id)}"

                self._send_response(201, song_id)

            elif self.path == "/users":
                user_id = users.insert_one(post_data).inserted_id
                location_header = f"/users/{str(user_id)}"
                self._send_response(201, {"_id": str(user_id)}, headers={"Location": location_header})

            elif self.path.startswith("/users/") and "/playlists" in self.path:
                user_id = self.path.split("/")[-2]
                try:
                    playlist_data = post_data
                    playlist_data["_id"] = ObjectId()
                    result = users.update_one(
                        {"_id": ObjectId(user_id)},
                        {"$push": {"playlists": playlist_data}}
                    )
                    if result.matched_count:
                        location_header = f"/users/{user_id}/playlists/{str(playlist_data['_id'])}"
                        self._send_response(201, str(playlist_data["_id"]), headers={"Location": location_header})
                    else:
                        self._send_response(404, {"error": "User not found"})
                except:
                    self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})
        except Exception as e:
            self._send_response(500, {"error": "Internal Server Error", "details": str(e)})

    def do_PUT(self):
        try:
            body_length = int(self.headers.get('Content-Length', 0))
            if body_length == 0:
                self._send_response(400, {"error": "Request body is missing"})
                return

            post_data = json.loads(self.rfile.read(body_length))

            if self.path.startswith("/songs/"):
                song_id = self.path.split("/")[-1]
                try:
                    result = songs.update_one(
                        {"_id": ObjectId(song_id)},
                        {"$set": post_data}
                    )
                    if result.matched_count:
                        updated_song = songs.find_one({"_id": ObjectId(song_id)})
                        if updated_song:
                            updated_song["_id"] = str(updated_song["_id"])
                            self._send_response(200, updated_song)
                        else:
                            self._send_response(404, {"error": "Song not found after update"})
                    else:
                        self._send_response(404, {"error": "Song not found"})
                except:
                    self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})

            elif self.path.startswith("/users/") and "/playlists/" in self.path:

                user_id, playlist_id = self.path.split("/")[-3], self.path.split("/")[-1]
                try:
                    user = users.find_one({"_id": ObjectId(user_id)}, {"playlists": 1})

                    if not user:
                        self._send_response(404, {"error": "User not found"})
                        return

                    playlist = next((p for p in user["playlists"] if str(p["_id"]) == playlist_id), None)

                    if not playlist:
                        self._send_response(404, {"error": "Playlist not found"})
                        return

                    post_data["_id"] = ObjectId(playlist_id)
                    result = users.update_one(
                        {"_id": ObjectId(user_id), "playlists._id": ObjectId(playlist_id)},
                        {"$set": {"playlists.$": post_data}}
                    )
                    if result.matched_count:
                        updated_user = users.find_one({"_id": ObjectId(user_id)}, {"playlists": 1})
                        updated_playlist = next((p for p in updated_user["playlists"] if str(p["_id"]) == playlist_id),
                                                None)
                        if updated_playlist:
                            updated_playlist["_id"] = str(updated_playlist["_id"])
                            for song in updated_playlist.get("songs", []):
                                if "_id" in song:
                                    song["_id"] = str(song["_id"])

                            self._send_response(200, updated_playlist)
                        else:
                            self._send_response(404, {"error": "Updated playlist not found"})

                except:
                    self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})
        except Exception as e:
            self._send_response(500, {"error": "Internal Server Error", "details": str(e)})

    def do_DELETE(self):
        try:
            if self.path == "/songs" or self.path == "/users":
                self._send_response(405,{"error": "Method Not Allowed - Can't delete a whole collection."})
                return

            if self.path.startswith("/songs/"):
                song_id = self.path.split("/")[-1]
                try:
                    result = songs.delete_one({"_id": ObjectId(song_id)})
                    if result.deleted_count:
                        self._send_response(200, {"message": "Song deleted"})
                    else:
                        self._send_response(404, {"error": "Song not found"})
                except:
                    self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})

            elif self.path.startswith("/users/") and "/playlists/" in self.path:
                path_parts = self.path.split("/")
                user_id = path_parts[-3]
                playlist_id = path_parts[-1]
                try:
                        result = users.update_one({"_id": ObjectId(user_id)},{"$pull": {"playlists": {"_id": ObjectId(playlist_id)}}})
                        if result.modified_count:
                            self._send_response(200, {"message": "Playlist deleted"})
                        else:
                            self._send_response(404, {"error": "Playlist not found or user does not exist"})
                except:
                    self._send_response(422, {"error": "Unprocessable Entity - The ID must be a 12-byte input or a 24-character hex string"})
        except Exception as e:
            self._send_response(500, {"error": "Internal Server Error", "details": str(e)})


if __name__ == "__main__":
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, SongStorageAPI)
    print("Port 8000: server running")
    httpd.serve_forever()
