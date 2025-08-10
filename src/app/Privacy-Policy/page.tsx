"use client";

import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="mt-10 min-h-[60vh] px-4 md:px-10 py-10 flex items-start justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <h2 className="text-base md:text-xl font-semibold text-neutral-500">
          Last Updated on 01st August 2024.
        </h2>

        <section>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Who we are
          </h1>
          <p className="text-base md:text-lg mt-2">
            Kindly go through our{" "}
            <span
              onClick={() => router.push("/about")}
              className="text-red-600 cursor-pointer hover:text-red-700 underline"
            >
              About us
            </span>{" "}
            page.
          </p>
        </section>

        <section>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Comments
          </h1>
          <p className="text-base md:text-lg mt-2 leading-relaxed">
            When visitors leave comments on the site we collect the data shown
            in the comments form, and also the visitor’s IP address and browser
            user agent string to help spam detection. <br />
            An anonymized string created from your email address (also called a
            hash) may be provided to the Gravatar service to see if you are
            using it. The Gravatar service privacy policy is available here:{" "}
            <a
              href="https://automattic.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              automattic.com/privacy
            </a>
            . After approval of your comment, your profile picture is visible to
            the public in the context of your comment.
          </p>
        </section>

        {/* Other sections remain unchanged */}
        {/* ... */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
