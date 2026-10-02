import {Icon} from "@iconify/react";
const Hero = () => {
  const steps = [
    {
      number: "1",
      title: "Create polls",
      description: "Add any poll",
    },
    {
      number: "2",
      title: "Browse polls",
      description: "See what's trending right now",
    },
    {
      number: "3",
      title: "Cast Your Vote",
      description: "Pick an option in one tap",
    },
    {
      number: "4",
      title: "See results",
      description: "Watch outcomes, update live",
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

        {/* LEFT SIDE */}
        <div className="text-center lg:text-left">

          {/* Heading */}
          <h1 className="text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl md:text-5xl">
            Vote on what matters instantly
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-[#0F172A] sm:text-base md:text-lg lg:mx-0">
            Create polls, share your opinion, and see what everyone really
            thinks.
          </p>

          {/* How It Works */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-center text-xl font-bold text-[#0F172A] sm:text-2xl">
              How It Works
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 md:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center"
                >
                  {/* Number */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9d9d9] text-lg font-bold text-[#111827] sm:h-14 sm:w-14 sm:text-xl">
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-xs font-bold text-[#111827] sm:mt-5 sm:text-sm">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 max-w-[130px] text-center text-[11px] leading-5 text-[#111827] sm:text-xs">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center">
          <div className="w-full max-w-[570px] bg-[#FFFFFF] p-4 sm:p-6 md:p-8 lg:p-10">

            {/* Poll Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

              {/* Poll Header */}
              <div className="flex items-start gap-3 sm:gap-4">

                {/* Poll Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                    <Icon
                        icon="fluent-emoji-high-contrast:party-popper"
                        width="32"
                        height="32"/>
                </div>

                {/* Question */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

                    <h3 className="text-sm font-bold text-[#0F172A] sm:text-base md:text-lg">
                      What's the best way to spend a Friday?
                    </h3>

                    <span className="shrink-0 text-[10px] text-[#8C8C94] sm:text-xs">
                      Ends in 2 hours
                    </span>
                  </div>

                  {/* Options */}
                  <div className="mt-5 space-y-3">
                    <div className="rounded-full bg-[#f1f1f3] px-4 py-3 text-xs text-[#0F172A] sm:px-5 sm:text-sm">
                      Go clubbing
                    </div>

                    <div className="rounded-full bg-[#f1f1f3] px-4 py-3 text-xs text-[#0F172A] sm:px-5 sm:text-sm">
                      Netflix and chill
                    </div>

                    <div className="rounded-full bg-[#f1f1f3] px-4 py-3 text-xs text-[#0F172A] sm:px-5 sm:text-sm">
                      Sleep throughout
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

