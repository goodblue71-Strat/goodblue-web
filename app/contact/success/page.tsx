import Link from 'next/link';

type PageProps = {
  searchParams: Promise<{ name?: string }>;
};

export default async function ContactSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = params.name || 'there';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You, {name}!
          </h1>
          <p className="text-lg text-gray-600">
            Your message has been successfully sent.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-700 mb-4">
            We've received your message and will get back to you as soon as possible.
          </p>
          <p className="text-sm text-gray-500">
            You should receive a confirmation email shortly.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
