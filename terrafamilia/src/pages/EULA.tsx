import { Link } from "react-router-dom";

function EULA() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              End User License Agreement
            </h1>
            <p className="text-sm text-slate-600">
              Last Updated: October 27, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account and using Terrafamilia ("the Service"),
                you agree to be bound by this End User License Agreement
                ("Agreement"). If you do not agree to these terms, please do not
                use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                2. Description of Service
              </h2>
              <p>
                Terrafamilia is a community forum platform that facilitates
                trading, bartering, knowledge exchange, and community
                collaboration among its members.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                3. User Responsibilities
              </h2>
              <p>By using the Service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Provide accurate, current, and complete information during
                  registration
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Be responsible for all activities that occur under your
                  account
                </li>
                <li>
                  Comply with all applicable local, state, national, and
                  international laws
                </li>
                <li>
                  Respect the rights and dignity of other community members
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                4. Prohibited Conduct
              </h2>
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Post content that is illegal, harmful, or offensive</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Impersonate any person or entity</li>
                <li>Post spam, advertisements, or unsolicited promotions</li>
                <li>
                  Attempt to gain unauthorized access to the Service or other
                  user accounts
                </li>
                <li>
                  Use automated systems (bots) without explicit permission
                </li>
                <li>Violate intellectual property rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                5. Content Ownership and License
              </h2>
              <p>
                You retain ownership of any content you post on Terrafamilia.
                However, by posting content, you grant Terrafamilia a
                non-exclusive, worldwide, royalty-free license to use, display,
                reproduce, and distribute your content on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                6. Privacy and Data Protection
              </h2>
              <p>
                Your privacy is important to us. We collect and use your
                personal information in accordance with our Privacy Policy. By
                using the Service, you consent to our collection and use of your
                data as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                7. Trading and Transactions
              </h2>
              <p>
                Terrafamilia facilitates connections between users for trading
                and bartering purposes. However:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  We are not responsible for the quality, safety, or legality of
                  items offered or exchanged
                </li>
                <li>
                  We do not guarantee the accuracy of user listings or
                  descriptions
                </li>
                <li>All transactions are conducted at your own risk</li>
                <li>
                  We recommend meeting in safe, public locations for exchanges
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                8. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED. TERRAFAMILIA DISCLAIMS ALL WARRANTIES,
                INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, TERRAFAMILIA SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                10. Account Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account at any
                time, with or without notice, for violations of this Agreement
                or for any other reason we deem appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                11. Modifications to Agreement
              </h2>
              <p>
                We reserve the right to modify this Agreement at any time.
                Changes will be effective upon posting to the Service. Your
                continued use of the Service after changes are posted
                constitutes acceptance of the modified Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                12. Governing Law
              </h2>
              <p>
                This Agreement shall be governed by and construed in accordance
                with the laws of the jurisdiction in which Terrafamilia
                operates, without regard to its conflict of law provisions.
              </p>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link
              to="/sso"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EULA;
