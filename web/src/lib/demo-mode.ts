/** Editor tanpa login hanya tersedia ketika aplikasi berjalan di komputer pengembang. */
export function isLocalDemoEditorEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
