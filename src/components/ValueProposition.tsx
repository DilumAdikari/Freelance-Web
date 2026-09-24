export default function ValueProposition() {
  const values = [
    { title: 'Proof of Quality', desc: 'Check client reviews, work samples, and verify profiles before hiring.', icon: '✓' },
    { title: 'No Upfront Cost', desc: 'Clear and upfront pricing. Know what you pay before you start.', icon: '$' },
    { title: 'Fast Turnaround', desc: 'Filter by delivery timeframe to get your project done on time.', icon: '⚡' },
    { title: 'Safe & Protected', desc: 'Payments are held securely and released only when work is approved.', icon: '🛡️' },
  ];

  return (
    <section className="border-b border-gray-200 bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-black">
            A whole world of freelance talent at your fingertips
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Reliable, secure, and quality services delivered efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold"
                style={{ backgroundColor: '#178f23' }}
              >
                {v.icon}
              </div>
              <h3 className="mt-4 font-bold text-black">{v.title}</h3>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}