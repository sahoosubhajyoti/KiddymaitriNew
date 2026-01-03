import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Add Exercise */}
        <Link href="/AddExercise" className="group">
          <div className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-500 h-full">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-600 group-hover:text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600">
                Add Exercise
              </h2>
              <p className="mt-2 text-gray-500">
                Create new coding exercises, set classes, and add code templates.
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Add Pictures */}
        <Link href="/AddPictures" className="group">
          <div className="bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-green-500 h-full">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-green-600 group-hover:text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-green-600">
                Add Pictures
              </h2>
              <p className="mt-2 text-gray-500">
                Upload images and manage galleries.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}