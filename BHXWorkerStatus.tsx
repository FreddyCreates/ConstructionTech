import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left — Brand */}
          <div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-construction-primary">
                BuildSafe
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              BuildSafe Platform
            </p>
            <p className="text-sm font-medium text-foreground/80">
              Construction Intelligence Technology
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Native AI. Sovereign data. Zero external models.
            </p>
          </div>

          {/* Middle — Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/70">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/safety"
                  className="hover:text-construction-primary transition-colors"
                >
                  Safety Suite
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-construction-primary transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/bidconnect"
                  className="hover:text-construction-primary transition-colors"
                >
                  BidConnect
                </Link>
              </li>
              <li>
                <Link
                  to="/design"
                  className="hover:text-construction-primary transition-colors"
                >
                  Design Intelligence
                </Link>
              </li>
              <li>
                <Link
                  to="/workspace"
                  className="hover:text-construction-primary transition-colors"
                >
                  Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Right — AI Platform */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/70">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/workspace"
                  className="hover:text-construction-primary transition-colors"
                >
                  Protocols &amp; Standards
                </Link>
              </li>
              <li>
                <Link
                  to="/workspace"
                  className="hover:text-construction-primary transition-colors"
                >
                  Research Library
                </Link>
              </li>
              <li>
                <Link
                  to="/workspace"
                  className="hover:text-construction-primary transition-colors"
                >
                  Builder Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/workspace"
                  className="hover:text-construction-primary transition-colors"
                >
                  Colony
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="hover:text-construction-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-construction-primary transition-colors"
            >
              Terms
            </a>
          </div>
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} BuildSafe. Powered by{" "}
            <span className="font-semibold text-construction-primary">
              Medina Tech
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
