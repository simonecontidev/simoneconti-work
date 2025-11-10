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
                onClick={() => navigateWithTransition("/contact")}
              />
            </div>
          </div>
        </div>

    
      </div>
    </section>
  );
}