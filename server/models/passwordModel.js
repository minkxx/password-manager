import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    website: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const Password = mongoose.models.password || mongoose.model('Password', passwordSchema);

export default Password;