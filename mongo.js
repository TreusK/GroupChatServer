const mongoose = require('mongoose')

const url =
  `mongodb+srv://groupChatAdmin:yITUnmw9LfESkrZN@clustergroupchat.ikg7l25.mongodb.net/messages?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  id: Number,
  content: String,
  userId: Number,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  id: 4,
  content: "hello everyone",
  userId: 522
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})