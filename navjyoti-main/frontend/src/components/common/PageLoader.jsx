/** Full-screen suspense fallback used while lazy routes/chunks load. */
const PageLoader = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-brand-500" />
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  </div>
);

export default PageLoader;
