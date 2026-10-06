import { Link } from "react-router-dom";
import paths from "../../routes/paths";
const CTA = () => {
  return (
    <section className="w-full py-12 sm:py-16">
      <div className="w-full bg-[#FAFAFA] px-6 py-14 text-center md:px-12 md:py-16">

        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
          Ready to make your voice count?
        </h2>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
                to={paths.auth.register}
                className="w-full rounded-full bg-[#3B82F6] px-7 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600 sm:w-auto">
                Get Started
            </Link>

            <Link
                to={paths.auth.login}
                className="w-full rounded-full border border-[#8C8C94] bg-white px-7 py-3 text-center text-sm font-semibold text-[#0F172A] transition hover:border-[#3B82F6] hover:text-[#3B82F6] sm:w-auto">
                    Log In
            </Link>
        </div>

      </div>
    </section>
  );
};

export default CTA;