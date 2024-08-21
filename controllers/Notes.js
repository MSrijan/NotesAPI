const fs = require('fs');
const path = require('path');
const notePath = path.join(__dirname, '..', 'data', 'notes.json');

//reads the note.json file
const readNotes = () => {
    try {
        if (!fs.existsSync(notePath)) {
            throw new Error('notes.json file not found');
        }
        const notes = fs.readFileSync(notePath, 'utf-8');
        return JSON.parse(notes);
    } catch (error) {
        throw new Error(error.message || 'Failed to read notes.');
    }
};
//writes in the note.json file
const writeNotes = (notes) => {
    fs.writeFileSync(notePath, JSON.stringify(notes, null, 2), 'utf-8');
};
//returns all notes
const getAllNotes = (req, res, next) => {
    try {
        const notes = readNotes();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};
//returns a specific note by id
const getNote = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const notes = readNotes();
        const note = notes.find(note => note.id === id);
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({ success: false, message: 'Note not found' });
        }
    } catch (error) {
        next(error);
    }
};
//add a note
const addNote = (req, res, next) => {
    try {
        const newNote = req.body;
        const notes = readNotes();
        newNote.id = (notes.length ? Math.max(...notes.map(note => note.id)) + 1 : 1);
        notes.push(newNote);
        writeNotes(notes);
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
};
//update a note by id
const updateNote = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updatedNoteData = req.body.note;
        const notes = readNotes();
        const index = notes.findIndex(note => note.id === id);

        if (index !== -1) {
            const currentNote = notes[index];
            notes[index] = currentNote;
            writeNotes(notes);
            res.status(200).json(currentNote);
        } else {
            res.status(404).json({ success: false, message: 'Note not found' });
        }
    } catch (error) {
        next(error);
    }
};
//delete a note by id
const deleteNote = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        let notes = readNotes();
        const initialLength = notes.length;
        notes = notes.filter(note => note.id !== id);
        if (notes.length < initialLength) {
            writeNotes(notes);
            res.status(200).json({ success: true, message: 'Note deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Note not found' });
        }
    } catch (error) {
        next(error);
    }
};

// search note by keyword
const searchNotes = (req, res, next) => {
    try {
        const keyword = req.query.keyword.toLowerCase();
        const notes = readNotes();
        const filteredNotes = notes.filter(note => note.note.toLowerCase().includes(keyword));
        if (filteredNotes.length > 0) {
            res.status(200).json(filteredNotes);
        } else {
            res.status(404).json({ success: false, message: 'No notes found matching the keyword' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNotes,
    getNote,
    addNote,
    updateNote,
    deleteNote,
    searchNotes
};
