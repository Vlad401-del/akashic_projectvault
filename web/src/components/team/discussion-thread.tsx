"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { postTeamDiscussionAction } from "@/lib/discussion-actions";
import { DISCUSSION_BODY_MAX, emptyDiscussionForm, hasDiscussionErrors, validateDiscussionForm, type DiscussionErrors } from "@/lib/discussion-form";
import type { DiscussionMessage } from "@/lib/fixtures/types";

export function DiscussionThread({ teamId, initialMessages, closed = false }: {
  teamId: string;
  initialMessages: DiscussionMessage[];
  closed?: boolean;
}) {
  const [sentMessages, setSentMessages] = useState<DiscussionMessage[]>([]);
  const messages = [...initialMessages, ...sentMessages.filter((sent) => !initialMessages.some((message) => message.id === sent.id))];
  const [form, setForm] = useState(emptyDiscussionForm);
  const [errors, setErrors] = useState<DiscussionErrors>({});
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const replyTo = messages.find((message) => message.id === form.replyToId);
  const inputClass = "mt-1.5 w-full rounded-lg border border-line bg-canvas px-3.5 py-2 text-[14px] text-ink";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateDiscussionForm(form, { requireName: true });
    setErrors(validation);
    setNotice("");
    if (hasDiscussionErrors(validation)) return;
    startTransition(async () => {
      try {
        const result = await postTeamDiscussionAction(teamId, form);
        if (!result.ok) {
          setErrors(result.errors);
          setNotice(result.message ?? "Pesan belum terkirim. Periksa isian Anda.");
          return;
        }
        setSentMessages((previous) => [...previous, result.message]);
        setForm((previous) => ({ ...emptyDiscussionForm(), authorName: previous.authorName }));
        setNotice("Pesan berhasil dikirim.");
      } catch {
        setNotice("Pesan belum dapat dikirim. Periksa koneksi lalu coba lagi.");
      }
    });
  }

  return (
    <div className="min-w-0 [overflow-wrap:anywhere]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <h2 id={`diskusi-heading-${teamId}`} className="flex items-center gap-2 text-[20px] font-semibold text-ink">
            <Icon name="message" className="size-5 text-accent" />Diskusi Tim
          </h2>
          <p className="mt-1 text-[14px] text-ink-2">Tanya jawab terbuka seputar peran, komitmen, dan ide proyek.</p>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[12px] font-semibold text-accent">{messages.length} pesan</span>
      </div>
      {messages.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line bg-canvas p-8 text-center text-[14px] text-ink-2">Belum ada diskusi di tim ini. Jadilah yang pertama bertanya.</p>
      ) : (
        <ol className="mt-6 space-y-4">
          {messages.map((message) => {
            const parent = messages.find((candidate) => candidate.id === message.replyToId);
            return (
              <li key={message.id} id={`pesan-${message.id}`} className="rounded-xl border border-line bg-canvas p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold text-ink">{message.authorName}</span>
                  <time dateTime={message.createdAt} className="text-[12px] text-ink-2">{new Date(message.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" })} WIB</time>
                </div>
                {parent ? <blockquote className="mt-3 rounded-r-lg border-l-2 border-accent bg-surface px-3 py-2"><p className="text-[12px] font-semibold text-accent">{parent.authorName}</p><p className="line-clamp-2 text-[13px] text-ink-2">{parent.body}</p></blockquote> : null}
                <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.7] text-ink">{message.body}</p>
                {!closed ? <button type="button" disabled={pending} onClick={() => { setForm((previous) => ({ ...previous, replyToId: message.id })); textarea.current?.focus(); }} className="mt-3 inline-flex items-center gap-1.5 rounded text-[13px] font-semibold text-accent hover:underline"><Icon name="reply" className="size-3.5" />Balas</button> : null}
              </li>
            );
          })}
        </ol>
      )}
      {closed ? <p className="mt-6 text-[13px] text-ink-2">Pencarian tim ini sudah ditutup; diskusi hanya bisa dibaca.</p> : (
        <form onSubmit={submit} noValidate className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-5">
          <fieldset disabled={pending}>
            <legend className="text-[16px] font-semibold text-ink">{replyTo ? "Tulis balasan Anda" : "Tulis pesan"}</legend>
            {replyTo ? <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border-l-2 border-accent bg-canvas px-3 py-2"><p className="min-w-0 text-[13px] text-ink-2">Membalas {replyTo.authorName}: <span className="line-clamp-1">{replyTo.body}</span></p><button type="button" onClick={() => setForm((previous) => ({ ...previous, replyToId: null }))} className="shrink-0 text-[12px] font-semibold text-accent">Batal</button></div> : null}
            {errors.replyToId ? <p role="alert" className="mt-2 text-[13px] text-rose-600">{errors.replyToId}</p> : null}
            <div className="mt-4">
              <label htmlFor={`diskusi-nama-${teamId}`} className="text-[14px] font-semibold">Nama Anda</label>
              <input id={`diskusi-nama-${teamId}`} value={form.authorName} onChange={(event) => setForm((previous) => ({ ...previous, authorName: event.target.value }))} className={inputClass} aria-invalid={Boolean(errors.authorName)} aria-describedby={`diskusi-nama-info-${teamId}`} />
              <p id={`diskusi-nama-info-${teamId}`} className="mt-1 text-[12px] text-ink-2">Nama diisi sendiri oleh pengirim dan belum diverifikasi.</p>
              {errors.authorName ? <p role="alert" className="mt-1 text-[13px] text-rose-600">{errors.authorName}</p> : null}
            </div>
            <div className="mt-4">
              <div className="flex justify-between gap-2"><label htmlFor={`diskusi-body-${teamId}`} className="text-[14px] font-semibold">Pesan</label><span className="text-[12px] text-ink-2">{form.body.length}/{DISCUSSION_BODY_MAX}</span></div>
              <textarea ref={textarea} id={`diskusi-body-${teamId}`} rows={4} value={form.body} onChange={(event) => setForm((previous) => ({ ...previous, body: event.target.value }))} className={`${inputClass} resize-y`} aria-invalid={Boolean(errors.body)} />
              {errors.body ? <p role="alert" className="mt-1 text-[13px] text-rose-600">{errors.body}</p> : null}
            </div>
            <div className="mt-4 flex justify-end"><button type="submit" className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-5 text-[15px] font-semibold text-white hover:bg-accent-hover disabled:opacity-60">{pending ? "Mengirim…" : "Kirim pesan"}<Icon name="arrowRight" className="size-4" /></button></div>
          </fieldset>
        </form>
      )}
      <p role="status" className="mt-3 text-[13px] text-ink-2">{notice}</p>
    </div>
  );
}
