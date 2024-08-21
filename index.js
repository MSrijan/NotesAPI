const express = require('express');
const app = express();
const PORT = 3000;
const noteController = require('./controllers/Notes')
const logDetails = require('./middlewares/logDetails');
const errorHandler = require('./middlewares/errorHandler');

app.use(logDetails)
app.use(errorHandler);
app.use(express.json());
//all notes
app.get('/notes',noteController.getAllNotes)
//search by keyword
app.get('/notes/search', noteController.searchNotes) //placed in top because on placing it below the /notes/:id this won't get called
//note by id
app.get('/notes/:id', noteController.getNote)
//add note
app.post('/notes', noteController.addNote)
//updaate a note
app.put('/notes/:id', noteController.updateNote)
//delete a note
app.delete('/notes/:id', noteController.deleteNote)

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
})