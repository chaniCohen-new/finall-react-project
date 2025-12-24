import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button
} from '@mui/material';
import { addWord } from './wordService'; // הייבוא הנדרש

const AddWordDialog = ({ open, onClose, onWordAdded }) => {
    const [newWord, setNewWord] = useState({ word: '', translating: '', lesson: '', image: null });

    const handleNewWordChange = (e) => {
        const { name, value } = e.target;
        setNewWord({ ...newWord, [name]: value });
    };

    const handleImageChange = (e) => {
        setNewWord({ ...newWord, image: e.target.files[0] });
    };

    const handleAddWord = async () => {
        try {
            const response = await addWord(newWord); // קריאה לפונקציה ממחלקת ה-API
            onWordAdded(response); // החזרת המילה החדשה להורה
            onClose(); // סגירת הדיאלוג
        } catch (error) {
            console.error("Error adding word:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>הוסף מילה חדשה</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    מלא את הפרטים להוספת מילה חדשה.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    name="word"
                    label="מילה"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={handleNewWordChange}
                />
                <TextField
                    margin="dense"
                    name="translating"
                    label="תרגום"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={handleNewWordChange}
                />
                <TextField
                    margin="dense"
                    name="lesson"
                    label="שיעור"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={handleNewWordChange}
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="upload-image">
                    <Button variant="contained" component="span" style={{ marginTop: '10px' }}>
                        העלה תמונה
                    </Button>
                </label>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleAddWord} color="primary">הוסף</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddWordDialog;