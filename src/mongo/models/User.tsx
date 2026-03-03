import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: {type: String, required: false },
  given_name: { type: String, required: true },
  family_name: { type: String, required: true },
  picture_link: { type: String, required: false },
  google_api_refresh_token: { type: String, required: true },
  app_token: { type: {
    token: String,
    iat: Date,
    exp: Date,
  }, required: true },

});

export default mongoose.models.user || mongoose.model("user", userSchema);  