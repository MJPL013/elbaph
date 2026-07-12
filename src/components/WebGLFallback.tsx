export function WebGLFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1eee8] p-6 font-sans text-[#241006]">
      <section className="max-w-md rounded-lg border border-[#241006]/15 bg-[#fff8ef] p-5 shadow-[0_18px_48px_rgba(36,16,6,0.16)]">
        <h1 className="text-2xl font-black">Manoj Pal</h1>
        <p className="mt-2 text-sm leading-relaxed">
          This browser could not start the 3D portfolio planet. Please open it in a browser with WebGL enabled.
        </p>
        <a className="mt-4 inline-block rounded bg-[#246a73] px-3 py-2 text-sm font-bold text-[#fff8ef]" href="mailto:manojpal6723@gmail.com">
          Email Manoj
        </a>
      </section>
    </main>
  );
}
