type CustomerNote = {
  id: string;
  note: string;
  createdAt: Date;
};

export function mapCustomerNoteToHttp(
  note: CustomerNote,
) {
  return {
    id: note.id,
    note: note.note,
    createdAt: note.createdAt.toISOString(),
  };
}