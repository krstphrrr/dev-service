
import mongoose from "mongoose"
const Schema = mongoose.Schema

const files = new Schema ({
  user_email: { type:String, required: true},
  filename: { type:String, required: true},
  path: { type: String, required: true},
  size: { type: Number, required: true},
  uuid: { type: String, required: true},
  creator: {type: String, required: false},
  
},{ timestamps: true})

export default mongoose.model('Files', files)