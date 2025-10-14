export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-gray-600 w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row min-w-0">
          <p className="shrink-0">
            © {new Date().getFullYear()}. GoodBlue.ai
          </p>
          <div className="flex items-center gap-5 flex-wrap min-w-0">
            <a href="/contact" className="hover:text-gray-900">
              Contact
            </a>
            <a href="https://www.linkedin.com/in/kirthi-vani/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900"
            >
              LinkedIn
            </a>
            <a href="/Privacy" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="/Terms" className="hover:text-gray-900">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
