import { Icon } from "@iconify/react";
import { Link} from "react-router-dom";
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
          <div className="space-y-4 text-[15px] font-bold leading-relaxed text-[#0F172A]">
            <p>
              VOXA is a web app designed for quick, honest opinions. Create a
              poll on anything, share it, and see what people really think.
              <br />
              Polls are also created by the admins on topics that matter to the
              community, anyone can jump in, vote, and watch the results update
              in real time.
            </p>

            <p>
              No noise, no lengthy surveys — just a question, a few options,and
              an honest result. Whether
              <br />
              it's a lighthearted debate or a decision
              that affects everyone, Voxa makes it easy to have your <br /> say.
            </p>

            {/* Why Use VOXA */}
            <div className="pt-1">
              <h2 className="mb-3 text-base font-bold">Why Use VOXA?</h2>

              <p className="mb-3">We believe every voice matters.</p>

              <p>
                Traditional Voting can be stressful, time consuming, and
                difficult to organize which is why VOXA simplifies that process
                by bringing voting into one easy-to-use platform where users
                can create, browse polls, vote and view results with ease.
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

                <p className="text-xs font-semibold text-[#8C8C94]">
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

                <p className="text-xs font-semibold text-[#8C8C94]">
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

                <p className="text-xs font-semibold text-[#8C8C94]">
                  Track outcomes as they close
                </p>
              </div>
            </div>
          </div>

          {/* Bottom text + button */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-center text-[13px] font-semibold text-#0F172A]">
              Got a question worth putting to a vote? Reach out to an admin to
              get it added.
            </p>

            {/* <button
              type="button"
              className="mt-8 h-8 w-25 rounded-lg border border-[#3B82F6] bg-white text-xs font-bold text-[#0F172A] transition hover:bg-pink-50"
            >
              Log In
            </button> */}

            <Link
               to="/login"
               className="mt-8 h-8 w-25 rounded-lg border border-[#3B82F6] bg-white text-xs font-bold text-[#0F172A] transition hover:bg-pink-50 flex items-center justify-center"
>
               Log In
            </Link>
          </div>
        </section>

        {/* RIGHT IMAGE SECTION */}
        <section className="hidden w-[30%] shrink-0 md:block ml-auto pt-4 self-start">
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



// import { ArrowLeft } from 'lucide-react'; // Optional: for the back arrow icon

// export default function UserProfile() {
//   return (
//     <div className="min-h-screen bg-[#F9FAFB] text-[#172033] flex flex-col">
//       {/* Navigation Bar */}
//       <header className="w-full bg-white border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
//             V
//           </div>
//           <div>
//             <span className="text-xl font-bold tracking-tight text-[#172033]">Voxa</span>
//             <p className="text-[10px] text-gray-400 tracking-wider">Every Vote Has a Voice</p>
//           </div>
//         </div>

//         {/* Nav Links & Avatar */}
//         <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
//           <a href="#" className="hover:text-purple-600 transition-colors">Home</a>
//           <a href="#" className="hover:text-purple-600 transition-colors">About</a>
//           <a href="#" className="hover:text-purple-600 transition-colors">Polls</a>
//           <a href="#" className="hover:text-purple-600 transition-colors">My Votes</a>
//         </nav>

//         {/* User Profile Pill Icon */}
//         <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
//           WU
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <main className="flex-1 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
//         {/* Card Container */}
//         <div className="w-full max-w-5xl bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 sm:p-10 relative min-h-[520px] flex flex-col justify-between">
          
//           {/* Top Section inside Card: Back Button */}
//           <div>
//             <button 
//               onClick={() => window.history.back()} 
//               className="text-gray-500 hover:text-[#172033] transition-colors p-2 rounded-full hover:bg-gray-50 inline-flex items-center justify-center"
//               aria-label="Go back"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Center Profile Details */}
//           <div className="flex flex-col items-center text-center my-auto py-6">
//             {/* Avatar Circle */}
//             <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#8A56E2] text-white flex items-center justify-center text-3xl sm:text-4xl font-semibold tracking-wider shadow-md mb-4">
//               WU
//             </div>

//             {/* User Name & Email */}
//             <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">William Uri</h1>
//             <p className="text-sm text-gray-500 mt-0.5">williamuri@gmail.com</p>
//             <p className="text-xs text-gray-400 mt-0.5">Member since Sep 2026</p>

//             {/* Statistics Divider Block */}
//             <div className="w-full max-w-md grid grid-cols-3 border-t border-b border-gray-100 my-8 py-4">
//               <div className="flex flex-col items-center justify-center">
//                 <span className="text-lg sm:text-xl font-bold text-[#172033]">12</span>
//                 <span className="text-xs text-gray-500 mt-0.5">Polls voted</span>
//               </div>
//               <div className="flex flex-col items-center justify-center border-x border-gray-100">
//                 <span className="text-lg sm:text-xl font-bold text-[#172033]">4</span>
//                 <span className="text-xs text-gray-500 mt-0.5">Trending Joined</span>
//               </div>
//               <div className="flex flex-col items-center justify-center">
//                 <span className="text-lg sm:text-xl font-bold text-[#172033]">61%</span>
//                 <span className="text-xs text-gray-500 mt-0.5">Majority side</span>
//               </div>
//             </div>

//             {/* Edit Profile Action Link */}
//             <button className="text-sm font-medium text-[#2563EB] hover:text-blue-700 transition-colors">
//               Edit Profile
//             </button>
//           </div>

//           {/* Bottom spacing anchor */}
//           <div></div>
//         </div>
//       </main>
//     </div>
//   );
// }



