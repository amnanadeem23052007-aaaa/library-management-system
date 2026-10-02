export default function Footer() {
  return (
    <footer className="mt-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="h-16 flex justify-between items-center px-4 sm:px-8">
        <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">
          © 2026 Library Management System
        </p>

        <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">
          Developed by Amna Nadeem
        </p>
      </div>
    </footer>
  );
}