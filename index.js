require('dotenv').config();
const express = require('express');
const app = express();
const Note = require('./models/note')
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3001"
  }
});
const cors = require('cors');

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());


let notes = [
  {
    id: 1,
    content: "test message",
    userId: 877
  },
  {
    id: 2,
    content: "cyndaquill is a pokemon",
    userId: 8297
  },
  {
    id: 3,
    content: "and it's MY pokemon",
    userId: 8297
  },
  {
    id: 4,
    content: "today i read chapter 464 of KKKB",
    userId: 522
  },
  {
    id: 5,
    content: "Yuna, Shinobu, fox lady and the two bears are fighting some monsters to protect the orochi seals",
    userId: 522
  },
  {
    id: 6,
    content: "romeo romeo donde estas que no te veo!",
    userId: 9696
  },
  {
    id: 7,
    content: "馬鹿外人だけ。。",
    userId: 96
  },
]

function generateId() {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}


app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

io.on('connection', (socket) => {
  console.log('a user connected with id ' + socket.id);

  socket.on('message', (data) => {
    console.log(data);

    let newNote = new Note ({
      content: data.content,
      userId: data.userId,
    });

    newNote.save().then(() => {
      io.emit('messageResponse', newNote);
    })
  })

  socket.on('delete', (data) => {
    io.emit('messageDelete', data)
  })

  socket.on('disconnect', () => {
    console.log('user gone')
  })
});



app.get('/api/notes/:id', (req, res) => {
  let noteId = req.params.id;
  Note.findById(noteId).then(note => res.json(note))
})


app.put('/api/notes/:id', (req, res) => {
  let noteId = req.params.id;
  let body = req.body;

  let editNote = {
    content: body.content
  }

  Note.findByIdAndUpdate(noteId, editNote, {new: true})
    .then(resNote => res.json(resNote))
})


const PORT = process.env.PORT;
http.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
})