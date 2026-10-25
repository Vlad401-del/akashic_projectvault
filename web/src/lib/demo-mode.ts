/** Editor tanpa login hanya boleh dipakai saat `npm run dev` di komputer sendiri. */
export function isLocalDemoEditorEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
