import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../common/input/InputField";
import Checkbox from "../common/input/Checkbox";
import { useRegister } from "../../hooks/useAuth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function SignUpForm() {
  const nav = useNavigate();
  const { register, loading, error } = useRegister();

  const [organization, setOrganization] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);

  const autoSlug = useMemo(() => slugify(organization), [organization]);

  // If user hasn't manually edited slug, keep it in sync
  const effectiveSlug = organizationSlug || autoSlug;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await register({
      organization: organization.trim(),
      organization_slug: effectiveSlug.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password,
      confirm_password: confirmPassword,
      terms,
    });

    if (res.ok) nav(res.redirect);
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your account.
            </p>
          </div>

          {!!error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="space-y-5">
              {/* Org */}
              <div>
                <Label>
                  Organization Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={organization}
                  onChange={(e) => {
                    setOrganization(e.target.value)
                    setOrganizationSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-"))
                  }}
                  placeholder="Your Company Name"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Preview: <span className="font-medium">{effectiveSlug || "your-company-slug"}</span>.qall.io
                </p>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    First Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    disabled={loading}
                  />
                </div>

                <div className="sm:col-span-1">
                  <Label>
                    Last Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Label>
                  Confirm Password <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Confirm your password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Terms */}
              <div className="flex items-center gap-3 text-xs">
                <Checkbox className="w-5 h-5" checked={terms} onChange={setTerms} />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  I agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">Terms and Conditions</span>, and our{" "}
                  <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}