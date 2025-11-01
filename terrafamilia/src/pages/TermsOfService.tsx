import { Link } from "react-router-dom";
import { Shield, FileText, Users, AlertCircle } from "lucide-react";

function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600">
            Last Updated: October 28, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              1. Agreement to Terms
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              By accessing and using TerraFamilia ("the Service"), you agree to
              be bound by these Terms of Service. If you do not agree to these
              terms, please do not use the Service.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the Service after changes constitutes acceptance of the
              modified terms.
            </p>
          </div>
        </div>

        {/* User Accounts */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              2. User Accounts
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              <span className="font-semibold">Account Creation:</span> You must
              provide accurate and complete information when creating an
              account. You are responsible for maintaining the security of your
              account credentials.
            </p>
            <p>
              <span className="font-semibold">Account Responsibility:</span> You
              are responsible for all activities that occur under your account.
              Notify us immediately of any unauthorized access.
            </p>
            <p>
              <span className="font-semibold">Account Termination:</span> We
              reserve the right to suspend or terminate accounts that violate
              these terms or engage in harmful behavior.
            </p>
          </div>
        </div>

        {/* User Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              3. User Content and Conduct
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p className="font-semibold">You agree NOT to post content that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Violates any laws or regulations</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains hate speech, harassment, or threats</li>
              <li>Promotes violence or illegal activities</li>
              <li>Contains spam, malware, or deceptive content</li>
              <li>Impersonates others or misrepresents your identity</li>
              <li>
                Contains adult content or material inappropriate for all ages
              </li>
            </ul>
            <p className="mt-4">
              <span className="font-semibold">Content Ownership:</span> You
              retain ownership of content you post, but grant TerraFamilia a
              license to display, distribute, and moderate that content within
              the Service.
            </p>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              4. Community Guidelines
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              <span className="font-semibold">Respectful Interaction:</span>{" "}
              Treat all community members with respect and courtesy. Personal
              attacks, bullying, and harassment are not tolerated.
            </p>
            <p>
              <span className="font-semibold">Constructive Discussion:</span>{" "}
              Engage in meaningful dialogue. Stay on topic and contribute
              positively to discussions.
            </p>
            <p>
              <span className="font-semibold">Reporting Violations:</span> If
              you see content or behavior that violates these terms, please
              report it to our moderation team.
            </p>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              5. Intellectual Property
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              The TerraFamilia platform, including its design, code, and
              branding, is protected by copyright and other intellectual
              property laws. You may not copy, modify, or distribute any part of
              the Service without permission.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              6. Disclaimer of Warranties
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE
              WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              7. Limitation of Liability
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TERRAFAMILIA SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">8. Privacy</h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              Your use of the Service is also governed by our{" "}
              <Link
                to="/eula"
                className="text-cyan-600 hover:text-cyan-700 underline font-semibold"
              >
                End User License Agreement (EULA)
              </Link>
              , which includes our privacy practices.
            </p>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-cyan-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">
              9. Termination
            </h2>
          </div>
          <div className="ml-10 space-y-3 text-slate-700">
            <p>
              We reserve the right to terminate or suspend your access to the
              Service at any time, with or without notice, for conduct that we
              believe violates these Terms or is harmful to other users,
              TerraFamilia, or third parties.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
