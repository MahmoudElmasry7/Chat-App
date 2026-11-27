import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  room: {
     type: String,
     required: true, 
     index: true 
    
    },
  username: { 
    type: String, 
    required: true 
    
    },
  text: {
    type: String, 
    required: true 
    
    }
}, 
{ 
    timestamps: true 
})

export default mongoose.model('Message', messageSchema)