import {useCallback, useMemo, useState} from 'react';
import {uid} from 'uid';

import {Notes} from 'components/notes';
import {AddNote} from 'components/addNote';

import {note} from './types';
import styles from './app.module.scss';

const App = () => {
    const [notes, setNotes] = useState({
        isLoaded: false,
        items: [],
    });
    const [filter, setFilter] = useState<string>('');
    const tagRegex = useMemo(() => /\B(#[a-zA-Z]+\b)(?!;)/g, []);

    const getNotes = useCallback(() => {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');

        setNotes({
            isLoaded: true,
            items: notes,
        });
    }, [setNotes]);

    const addNote = useCallback((text: string) => {
        const tags: Set<string> = new Set();

        Array.from(text.matchAll(tagRegex)).forEach((tag) => {
            tags.add(tag[0].slice(1));
        });

        const note: note = {id: uid(), text: text, tags: Array.from(tags)};
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');

        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        getNotes();
    }, [tagRegex, getNotes]);

    const checkTags = useCallback((notes: Array<note>) => {
        let isExist = false;

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].tags.includes(filter)) {
                isExist = true;
            }
        }

        if (!isExist) {
            setFilter('');
        }
    }, [filter, setFilter]);

    const deleteNote = useCallback((id: string) => {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === id) {
                notes.splice(i, 1);
                i = notes.length;
            }
        }

        checkTags(notes);

        localStorage.setItem('notes', JSON.stringify(notes));
        getNotes();
    }, [checkTags, getNotes]);

    const editNote = useCallback((id: string, newText: string) => {
        const checkSpaces = newText.replaceAll(' ', '');
        const checkBrs = checkSpaces.replaceAll('\n', '');

        if (checkBrs.length === 0) {
            deleteNote(id);

            return;
        }

        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const tags: Set<string> = new Set();

        Array.from(newText.matchAll(tagRegex)).forEach((tag) => {
            tags.add(tag[0].slice(1));
        });

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === id) {
                notes[i].text = newText;
                notes[i].tags = Array.from(tags);
                i = notes.length;
            }
        }

        checkTags(notes);

        localStorage.setItem('notes', JSON.stringify(notes));
        getNotes();
    }, [checkTags, deleteNote, tagRegex, getNotes]);

    return (
        <div className={styles.app}>
            <Notes
                notes={notes}
                filter={filter}
                setFilter={setFilter}
                getNotes={getNotes}
                deleteNote={deleteNote}
                editNote={editNote}
            />

            <AddNote addNote={addNote}/>
        </div>
    );
};

export default App;