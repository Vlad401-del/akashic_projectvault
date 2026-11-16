/**
 * Validasi murni formulir diskusi, dipakai bersama oleh komponen client dan
 * server action supaya aturan tampil sama di kedua sisi.
 */
export type DiscussionForm = {
  authorName: string;
  body: string;
  replyToId: string | null;
};

export type DiscussionErrors = {
  authorName?: string;
  body?: string;
  replyToId?: string;
};

export const DISCUSSION_BODY_MAX = 1500;

export function emptyDiscussionForm(): DiscussionForm {
  return { authorName: "", body: "", replyToId: null };
}

export function validateDiscussionForm(
  form: DiscussionForm,
  options: { requireName: boolean },
): DiscussionErrors {
  const errors: DiscussionErrors = {};
  const name = form.authorName.trim();
  const body = form.body.trim();

  if (options.requireName) {
    if (name.length < 2 || name.length > 60) {
      errors.authorName = "Nama harus 2-60 karakter agar lawan diskusi tahu siapa yang bertanya.";
    }
  }

  if (body.length < 10) {
    errors.body = "Tulis pesan minimal 10 karakter supaya konteks pertanyaan atau jawaban jelas.";
  } else if (body.length > DISCUSSION_BODY_MAX) {
    errors.body = `Pesan maksimal ${DISCUSSION_BODY_MAX} karakter; pecah menjadi beberapa pesan bila perlu.`;
  }

  return errors;
}

export function hasDiscussionErrors(errors: DiscussionErrors): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}