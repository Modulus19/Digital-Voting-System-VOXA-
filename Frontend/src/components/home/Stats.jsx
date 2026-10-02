const Stats = () => {
  const stats = [
    {
      number: "10K+",
      label: "Polls Created",
    },
    {
      number: "50K+",
      label: "Votes Cast",
    },
    {
      number: "5K+",
      label: "Active Users",
    },
    {
      number: "99%",
      label: "User Satisfaction",
    },
  ];

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl md:text-4xl">
                {stat.number}
              </h2>

              <p className="mt-2 text-xs text-[#8C8C94] sm:text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

