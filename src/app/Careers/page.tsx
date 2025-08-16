// app/careers/page.tsx  (App Router)
// or pages/careers.tsx  (Pages Router)

import Footer from "@/components/Footer";

const Careers = () => {
  return (
    <>
      <div className="mt-14 flex items-center flex-col justify-center min-h-[60vh] px-4">
        <h2 className="font-baloo text-xl sm:text-2xl md:text-3xl font-medium text-center">
          We currently don’t have any jobs available.
        </h2>
        <p className="font-light text-center mt-4">
          Please check back regularly, as we frequently post new jobs.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Careers;
