import {ComponentType, useCallback, useRef} from 'react';

import {Note} from 'components/notes/note'
import {note} from 'types';

import styles from './notes.module.scss';

interface Props {
    notes: {
        isLoaded: Boolean,
        items: Array<note>,
    };
    filter: string;
    setFilter: (filter: string) => void;
    getNotes: () => void;
    deleteNote: (id: string) => void;
    editNote: (id: string, newText: string) => void;
}

const Notes: ComponentType<Props> = ({
                                         notes,
                                         filter,
                                         setFilter,
                                         getNotes,
                                         deleteNote,
                                         editNote
                                     }) => {

    const listRef = useRef<HTMLUListElement | null>(null);

    const changeFilter = useCallback((tag: string) => {
        if (filter === tag) {
            setFilter('');
        } else {
            setFilter(tag);
        }
    }, [filter, setFilter]);

    const isLastElement = useCallback(() => {
        if (listRef.current) {
            return listRef.current.childNodes.length === 1;
        }

        return true;
    }, [listRef]);

    if (notes.isLoaded && notes.items.length > 0) {
        return (
            <div>
                <ul ref={listRef} className={styles.list}>
                    {notes.items.map((note, index) => {
                        if (note.tags.includes(filter) || filter === '') {
                            return (
                                <Note
                                    key={note.id}
                                    note={note}
                                    filter={filter}
                                    deleteNote={deleteNote}
                                    editNote={editNote}
                                    changeFilter={changeFilter}
                                    isLastElement={isLastElement}
                                />
                            );
                        } else {
                            return '';
                        }
                    })}
                </ul>
            </div>
        );
    }

    if (notes.isLoaded) {
        return (
            <div>
                Create new note.
            </div>
        );
    }

    getNotes();

    return (
        <div>
            Loading...
        </div>
    );
};

export default Notes;