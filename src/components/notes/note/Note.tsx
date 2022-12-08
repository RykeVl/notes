import {ComponentType, MouseEvent, FocusEvent, useCallback, useState} from 'react';
import clsx from 'clsx';
import Highlighter from 'react-highlight-words';

import {note} from 'types';

import styles from './note.module.scss';

interface Props {
    note: note;
    filter: string;
    deleteNote: (id: string) => void;
    editNote: (id: string, newText: string) => void;
    changeFilter: (tag: string) => void;
    isLastElement: () => boolean;
}

const Note: ComponentType<Props> = ({
                                        note,
                                        filter,
                                        deleteNote,
                                        changeFilter,
                                        isLastElement,
                                        editNote
                                    }) => {
    const [showHighlight, setShowHighlight] = useState(false);

    const deleteTask = useCallback(() => {
        deleteNote(note.id);

        if (isLastElement()) {
            changeFilter('');
        }
    }, [deleteNote, note.id, isLastElement, changeFilter]);

    const handleTagClick = useCallback((event: MouseEvent<HTMLLIElement>) => {
        changeFilter(event.currentTarget.innerText);
    }, [changeFilter]);

    const onFocusCheck = useCallback(() => {
        setShowHighlight(true);
    }, [setShowHighlight]);

    const onBlurCheck = useCallback((event: FocusEvent<HTMLDivElement>) => {
        setShowHighlight(false);

        editNote(note.id, event.currentTarget.innerText);
    }, [setShowHighlight, editNote, note.id]);

    return (
        <li className={styles.container}>
            <div
                className={styles.text}
                contentEditable
                suppressContentEditableWarning={true}
                onFocus={onFocusCheck}
                onBlur={onBlurCheck}
            >
                {note.text}
            </div>

            <Highlighter
                className={clsx(styles.highlighter, {[styles.highlighterActive]: showHighlight})}
                highlightClassName={styles.highlighterWord}
                searchWords={note.tags}
                textToHighlight={note.text}
            />

            <div
                className={styles.delete}
                onClick={deleteTask}
            >
                [x]
            </div>

            {note.tags.length > 0
                ? <ul className={styles.tags}>
                    {note.tags.map((tag) => {
                        return (
                            <li
                                key={tag}
                                className={clsx(styles.tag, {[styles.tagActive]: filter === tag})}
                                onClick={handleTagClick}
                            >
                                {tag}
                            </li>
                        );
                    })}
                </ul>
                : ''
            }
        </li>
    );
};

export default Note;