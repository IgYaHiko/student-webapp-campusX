
import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

const features = [
  "Report campus problems",
  "Track your complaints",
  "Make a difference on campus",
];

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row ">
      {/* Left Side: Deep Blue Gradient Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[radial-gradient(ellipse_at_40%_5%,#93c5fd_0%,#3b82f6_22%,#1d4ed8_45%,#172554_70%,#020617_100%)] overflow-hidden">
        {/* Top Logo */}
        <Link href="/" className="cursor-pointer">
          <div className="absolute top-6 left-8 z-10 flex items-center gap-3">
            

            <div>
              <h1 className="text-xl font-bold font-poppins text-white tracking-tight">
                SaySO
              </h1>
              
            </div>
          </div>
        </Link>

        {/* Center Branding Content */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pt-28 xl:p-12">
          <div className="mx-auto w-full max-w-md">
           

            <h2 className="text-center text-4xl font-semibold tracking-tight text-white  xl:text-5xl">
              Get Started with Us
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-center text-base leading-7 text-white/80">
              Make your campus better, one report at a time.
            </p>

            {/* Vertically Scrolling Cards */}
            <div
              className="relative mt-8 h-[230px] overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              }}
            >
              <div className="animate-scroll-up flex flex-col">
                {[0, 1].map((group) => (
                  <div
                    key={group}
                    aria-hidden={group === 1}
                    className="flex shrink-0 flex-col gap-3 pb-3"
                  >
                    {features.map((item, index) => (
                      <div
                        key={`${group}-${item}`}
                        className={`flex items-center gap-4 rounded-xl px-5 py-4 ${
                          index === 0
                            ? "bg-white text-slate-950 shadow-lg shadow-blue-950/20"
                            : "border border-white/15 bg-slate-950/30 text-white backdrop-blur-sm"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                            index === 0
                              ? "bg-blue-600 text-white"
                              : "bg-white/15 text-white"
                          }`}
                        >
                          {index + 1}
                        </span>

                        <span className="text-sm font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/65">
              Your campus. Your voice. Your impact.
            </p>
          </div>
        </div>
      </div>

                
<div className="absolute bottom-0 left-0 right-0 p-8  from-black/30 to-transparent">
  <div className="max-w-sm text-left">
    <svg
      className="h-8 w-8 text-yellow-300 mb-3"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>

    <blockquote className="text-white/95 text-xs italic leading-relaxed font-medium">
      &quot;Every voice deserves to be heard. Every campus problem deserves
      a solution. Let&apos;s make change happen, together.&quot;
    </blockquote>

    <p className="text-yellow-400 text-sm mt-3 font-semibold">
      — SaySo Team
    </p>
  </div>
</div>

      
                
      {/* Right Side: Form Area */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[410px]">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-10 flex items-center justify-center gap-3 lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white font-bold">
              C
            </div>

            <div>
              <h1 className="text-xl font-bold">CampusFix</h1>
              <p className="text-xs text-white/65">
                Campus Problem Resolution
              </p>
            </div>
          </Link>

          {/* Form Heading */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 ">
              {description}
            </p>
          </div>

          {children}

          {/* Form Footer */}
          <div className="relative z-20 mt-4 text-center text-sm">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}