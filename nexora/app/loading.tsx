export default function Loading() {
  return (
    <div className="container-nexora py-24">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <div className="skeleton mx-auto h-6 w-40 rounded-full" />
        <div className="skeleton mx-auto h-10 w-3/4 rounded-xl" />
        <div className="skeleton mx-auto h-5 w-2/3 rounded-xl" />
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-xl2" />
        ))}
      </div>
    </div>
  );
}
