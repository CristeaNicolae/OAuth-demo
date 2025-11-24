import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  google_api_access_token: { type: String, required: true },
  google_api_refresh_token: { type: String, required: true },
});

export default mongoose.model("user", userSchema);