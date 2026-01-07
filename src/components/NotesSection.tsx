import React, { useState } from 'react';
import { OrderNote } from '../types';
import { Button } from './Button';
import styles from './NotesSection.module.css';

interface NotesSectionProps {
    notes: OrderNote[];
    onAddNote: (content: string) => void;
    onDeleteNote: (noteId: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes, onAddNote, onDeleteNote }) => {
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        onAddNote(newNote);
        setNewNote('');
        setIsAdding(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.notesSection}>
            <div className={styles.header}>
                <h3 className={styles.title}>Internal Notes</h3>
                {!isAdding && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsAdding(true)}
                    >
                        + Add Note
                    </Button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className={styles.addNoteForm}>
                    <textarea
                        className={styles.textarea}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add an internal note..."
                        rows={3}
                        autoFocus
                    />
                    <div className={styles.formActions}>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                setIsAdding(false);
                                setNewNote('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={!newNote.trim()}>
                            Save Note
                        </Button>
                    </div>
                </form>
            )}

            <div className={styles.notesList}>
                {notes && notes.length > 0 ? (
                    [...notes].reverse().map((note) => (
                        <div key={note.id} className={styles.noteCard}>
                            <div className={styles.noteHeader}>
                                <div className={styles.noteAuthor}>
                                    <span className={styles.authorName}>{note.createdByName}</span>
                                    <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => {
                                        if (window.confirm('Delete this note?')) {
                                            onDeleteNote(note.id);
                                        }
                                    }}
                                    title="Delete note"
                                >
                                    ×
                                </button>
                            </div>
                            <p className={styles.noteContent}>{note.content}</p>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No notes yet. Add one to keep track of important information.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
