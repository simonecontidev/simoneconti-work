"use client";

import Copy from "../../components/Copy/Copy";
import AnimatedButton from "../../components/ui/AnimatedButton";
import useViewTransition from "../../hooks/useViewTransition";

export default function CTACard() {
  const { navigateWithTransition } = useViewTransition();

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 space-y-12 md:space-y-16">
        {/* Intro copy */}
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 md:flex-row md:gap-10">
          <div className="flex-1">
            <Copy>
              <p className="text-sm uppercase tracking-wide text-white/60">
                Part of the collective
              </p>
            </Copy>
          </div>

          <div className="flex-1">
            <Copy>
              <p className="text-lg text-white/85 md:text-xl">
                Polite Chaos is connected to The Noise Network, a collective of studios exploring
                digital art as emotion, motion, and code.
              </p>
            </Copy>

            <div className="mt-6">
              <AnimatedButton
                label="Drop your portfolio"
                route="/contact"
                onClick={() => navigateWithTransition("/contact")}
              />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 text-white md:p-8">
          <div className="flex flex-col gap-8 md:flex-row md:gap-10">
            <div className="flex-1">
              <Copy>
                <h3 className="text-2xl font-semibold md:text-3xl">Secret Department</h3>
              </Copy>
            </div>

            <div className="flex-1">
              <Copy>
                <p className="mb-6 text-white/85">
                  We like to think we build order out of chaos, but it’s usually the other way
                  around. Every project starts as a mess of sketches and motion tests.
                </p>
                <p className="mb-10 text-white/85">
                  If something feels too polished, we probably broke it on purpose and rebuilt it
                  slightly wrong — just enough to feel human.
                </p>
              </Copy>

              {/* Secondary button (ghost) */}
              <button
                type="button"
                onClick={() => navigateWithTransition("/about")}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 hover:border-white/40 hover:bg-white/10"
                aria-label="Read the theory"
              >
                <span className="text-base">📝</span>
                Read the theory
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}