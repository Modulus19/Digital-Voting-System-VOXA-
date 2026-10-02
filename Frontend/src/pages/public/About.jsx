import { Icon } from "@iconify/react";
import voteimage from "../../assets/images/voteimage.jpg";

function About() {
  return (
    <main className="in-h-screen bg-white pl-8 py-8 pr-0 md:pl-12 lg:pl-24">
      <div className="flex w-full gap-12 lg:gap-16">
        {/* LEFT CONTENT */}
        <section className="flex-1 pt-4">
          {/* Heading */}
          <h1 className="mb-8 text-3xl font-bold text-[#0F172A] text-center text-[32px]">
            What is VOXA?
          </h1>

          {/* Description */}
          <div className="max-w-2xl space-y-4 text-sm font-bold leading-relaxed text-[#0F172A] text-[15px]">
            <p>
              VOXA is a web app designed for quick, honest opinions. Create a poll on anything, share it, and see what people really think.
              Polls are also created by the admins on topics that matter to the community, anyone can jump in, vote, and watch the results update in real time.
            </p>

            <p>
              No noise, no lengthy surveys — just a question, a few options,and an honest result. Whether 
              it's a lighthearted debate or a decision that affects everyone, Voxa makes it easy to have your say.
            </p>

            {/* Why Use VOXA */}
            <div className="pt-1">
              <h2 className="mb-3 text-base font-bold">Why Use VOXA?</h2>

              <p className="mb-3">
                We believe every voice matters.
              </p>

              <p>
                Traditional Voting can be stressful, time consuming, and difficult to organize which is why VOXA simplifies that process by 
                bringing voting into one easy-to-use platform where users can create, browse polls, vote and view results with ease.
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="mt-7 space-y-5">
            {/* Browse polls */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <Icon
                  icon="mdi:magnify"
                  className="text-xl text-gray-700"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Browse polls
                </h3>

                <p className="text-xs  font-semibold text-[#8C8C94]">
                  See what's being asked right now
                </p>
              </div>
            </div>

            {/* Vote instantly */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <Icon
                  icon="mdi:check-circle"
                  className="text-xl text-green-500"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Vote instantly
                </h3>

                <p className="text-xs  font-semibold text-[#8C8C94]">
                  Tap an option, see results
                </p>
              </div>
            </div>

            {/* Stay informed */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <Icon
                  icon="mdi:bell"
                  className="text-xl text-yellow-500"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Stay informed
                </h3>

                <p className="text-xs  font-semibold text-[#8C8C94]">
                  Track outcomes as they close
                </p>
              </div>
            </div>
          </div>

          {/* Bottom text + button */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-center text-[13px] font-semibold text-#0F172A]">
              Got a question worth putting to a vote? Reach out to an admin to get it added.
            </p>

            <button
              type="button"
              className="mt-8 h-8 w-25 rounded-lg border border-[#FF4D6D]  bg-white text-xs font-bold text-[#3B82F6] transition hover:bg-pink-50"
            >
              Log In
            </button>
          </div>
        </section>

        {/* RIGHT IMAGE SECTION */}
        <section className="hidden w-2/5 shrink-0 md:block ml-auto pt-4 self-start">
          <img
            src={voteimage}
            alt="VOXA voting"
            className="block w-full h-170 object-contain object-right-top"
          />
        </section>
      </div>
    </main>
  );
}

export default About;
// max-h-170