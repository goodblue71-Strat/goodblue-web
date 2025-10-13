export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-gray-600">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>© {new Date().getFullYear()}. GoodBlue.ai</p>
        <div className="flex items-center gap-5">
          <a href="#contact" className="hover:text-gray-900">Contact</a>
          <a href="#linkedin" className="hover:text-gray-900">LinkedIn</a>
          <a href="#privacy" className="hover:text-gray-900">Privacy</a>
          <a href="#terms" className="hover:text-gray-900">Terms</a>
        </div>
      </div>
    </footer>
  );
}
