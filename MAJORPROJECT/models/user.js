const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // this will define automatically username and password field so we don't need to define it manually

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose); // this will add username and password field to the userSchema

const User = mongoose.model("User", userSchema);

module.exports = User;