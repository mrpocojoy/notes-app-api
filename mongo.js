const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const userName = 'MrJow_dev'
const password = process.argv[2]
const dbName = 'notes-app'

const url =
  `mongodb+srv://${userName}:${password}@freecodecamp2022.2qrgxcj.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  userId: Number,
  title: String,
  body: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  "userId": 4,
  "title": "qui est esse",
  "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  "important": false
})

note
  .save()
  .then(result => {
    console.log('note saved!', result)
    mongoose.connection.close()
  })

// const filter = {
//   important: true
// }

// Note
//   .find(filter)
//   .then(result => {
//     console.log('result', result)
//     // result.forEach(note => {
//     //   console.log(note)
//     // })
//     mongoose.connection.close()
//   })
//   .catch(error => console.error(error))