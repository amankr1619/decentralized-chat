import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  private_key: String,
  public_key: String,
  mnemonics: String,
  address: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", userSchema);

export default User;
