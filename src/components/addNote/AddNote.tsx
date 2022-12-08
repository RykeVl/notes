import {ComponentType, FormEvent, useRef} from 'react';

import styles from './addNote.module.scss';

interface Props {
    addNote: (text: string) => void;
}

interface AddNoteElements extends HTMLFormControlsCollection {
    text: HTMLTextAreaElement;
}

interface AddNoteForm extends HTMLFormElement {
    readonly elements: AddNoteElements;
}

const AddNote:ComponentType<Props> = ({addNote}) => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (event: FormEvent<AddNoteForm>) => {
        event.preventDefault();
        addNote(event.currentTarget.elements.text.value);

        if (formRef.current) {
            formRef.current.reset()
        };
    }

    return (
        <div className={styles.container}>
            <form
                className={styles.form}
                onSubmit={handleSubmit}
                ref={formRef}
            >
                <textarea
                    name="text"
                    cols={30}
                    rows={5}
                    placeholder={'Type your note...'}
                    required
                />

                <button
                    type="submit"
                    className={styles.button}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddNote;