"use client";

import Footer from "@/components/Footer";
import Link from "next/link";

const ShippingReturnPolicy = () => {
    return (
      <div>
        <div className="mt-10 min-h-[60vh] px-4 md:px-10 py-10 flex items-start justify-center">
          <div className="max-w-4xl w-full space-y-8">
            <h2 className="text-base md:text-xl font-semibold text-neutral-500">
              Last Updated on 14th August 2025.
            </h2>

            <section>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                Shipping & Return Policy
              </h1>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                This Shipping & Return Policy is part of our Terms of Service
                ("Terms") and should be therefore read alongside our main Terms:{" "}
                <Link
                  href="/Terms-Services"
                  className="text-red-600 hover:text-red-700 underline"
                >
                  Terms of Service
                </Link>
                .
              </p>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                Please carefully review our Shipping & Delivery Policy when
                purchasing our products. This policy will apply to any order you
                place with us.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                What are my shipping delivery options?
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                We offer shipping through Speed Post. In some cases, a
                third-party supplier may be managing our inventory and will be
                responsible for shipping your products.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Shipping Fees
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                The shipping fees will be as per{" "}
                <a
                  href="https://www.indiapost.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  https://www.indiapost.gov.in/
                </a>
                . All the shipping would be on to-pay basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Do you deliver internationally?
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                Currently, we offer shipping within India.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Returns
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                All returns must be postmarked within seven (7) days of the
                purchase date. All returned items must be in new and unused
                condition, with all original tags and labels attached.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Return process
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                To return an item, please email customer service at{" "}
                <a
                  href="mailto:support@email.com"
                  className="text-blue-600 underline"
                >
                 support@kiddymaitri.co.in
                </a>{" "}
                to obtain a Return Merchandise Authorisation (RMA) number.
              </p>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                After receiving an RMA number, place the item securely in its
                original packaging and include your proof of purchase, then mail
                your return to the following address:
              </p>
              <address className="text-base md:text-lg mt-4 leading-relaxed not-italic">
                Kiddymaitri Private Limited
                <br />
                Attn: Returns
                <br />
                RMA #<br />
                TI 109 AT FTBI, TIIR BUILDING NIT, ROURKELA,
                <br />
                Sundargarh, Odisha, India, 769008
              </address>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                Return shipping charges will be paid or reimbursed by us.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Refunds
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                After receiving your return and inspecting the condition of your
                item, we will process your exchange. Please allow at least
                fifteen (15) days from the receipt of your item to process your
                exchange. We will notify you by email when your return has been
                processed.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Exceptions
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                For defective or damaged products, please contact us at the
                contact details below to arrange a refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                Questions
              </h2>
              <p className="text-base md:text-lg mt-2 leading-relaxed">
                If you have any questions concerning our return policy, please
                contact us at:{" "}
                <a
                  href="mailto:support@kiddymaitri.co.in"
                  className="text-blue-600 underline"
                >
                  support@kiddymaitri.co.in
                </a>
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default ShippingReturnPolicy;
