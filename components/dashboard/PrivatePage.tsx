import Link from "next/link";

export function PrivatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="bg-card border rounded-lg shadow-lg p-8 text-center">
          {/* Lock Icon */}
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Private Page
          </h1>
          <p className="text-muted-foreground mb-6">
            This page is only accessible to authenticated users.
          </p>

          {/* Description */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-muted-foreground">
              You need to be signed in to access the dashboard. Please sign in
              to your account or create a new one to continue.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/signin"
              className="block w-full bg-primary text-primary-foreground rounded-md px-4 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block w-full bg-secondary text-secondary-foreground border rounded-md px-4 py-3 font-medium hover:bg-secondary/80 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/"
              className="block w-full text-muted-foreground hover:text-foreground transition-colors text-sm mt-4"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/faq" className="text-primary hover:underline">
              Visit our FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
