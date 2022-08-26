import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
    type: {type: String, required: true},
    token: {type: String, required: true},
})

export default mongoose.model("Token", TokenSchema);