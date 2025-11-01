export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-24 rounded-xl bg-muted" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-28 rounded-lg bg-muted" />
        <div className="h-28 rounded-lg bg-muted" />
        <div className="h-28 rounded-lg bg-muted" />
        <div className="h-28 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-lg bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
      <div className="h-80 rounded-lg bg-muted" />
      <div className="h-80 rounded-lg bg-muted" />
    </div>
  );
}
