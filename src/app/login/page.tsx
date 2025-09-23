import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = generateSEOMetadata({
  title: "Sign In - Access Your Account",
  description:
    "Sign in to your TOP4 Call Drivers account to book professional drivers, manage your trips, and access exclusive offers.",
  keywords: [
    "login",
    "sign in",
    "account access",
    "user login",
    "driver booking login",
  ],
  url: "/login",
});

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] bg-gray-50 flex flex-col justify-center custom-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full">
          <div className="text-center">
            <h2 className="">Sign in to your account</h2>
            {/* <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Access your TOP4 Call Drivers account to book professional drivers
            </p> */}
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-[#354B9C] hover:text-[#2a3a7a] transition-colors"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
