export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-950">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 uppercase dark:text-white">
          System Maintenance
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          The CDSS platform is currently undergoing scheduled maintenance to improve our
          services. We'll be back online shortly.
        </p>
        <div className="pt-4">
          <a
            href="/login"
            className="bg-primary inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:scale-105"
          >
            Check Status
          </a>
        </div>
      </div>
    </div>
  );
}
