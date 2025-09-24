import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = generateSEOMetadata({
  title: "Sign Up - Create Your Account",
  description:
    "Create your TOP4 Call Drivers account to book professional drivers, manage your trips, and get exclusive offers.",
  keywords: [
    "signup",
    "register",
    "create account",
    "new user",
    "driver booking registration",
  ],
  url: "/signup",
});

export default function SignupPage() {
  return (
    <div className="md:min-h-[90vh] bg-gray-50 custom-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md h-fit my-auto">
        <div className="text-center">
          <h2 className="">Create your account</h2>
          {/* <p className="mt-2 text-sm text-gray-600">
            Join TOP4 Call Drivers to book professional drivers instantly
          </p> */}
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <SignupForm />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#354B9C] hover:text-[#2a3a7a] transition-colors"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
