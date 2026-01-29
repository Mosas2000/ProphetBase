'use client';


export default function DeveloperPortal() {
  const resources = [
    { title: 'API Reference', desc: 'Complete REST API documentation', link: '/docs/api' },
    { title: 'SDKs', desc: 'Libraries for JS, Python, and Rust', link: '/docs/sdks' },
    { title: 'Governance', desc: 'Protocol parameters and voting', link: '/docs/governance' },
    { title: 'Sandbox', desc: 'Test strategies in a risk-free environment', link: '/dev/sandbox' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Developer Portal
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Build the future of prediction markets on ProphetBase.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res) => (
          <div key={res.title} className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{res.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{res.desc}</p>
            <a href={res.link} className="text-blue-600 font-semibold hover:underline">
              Explore →
            </a>
          </div>
        ))}
      </div>

      <section className="mt-16 bg-blue-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="mb-6 opacity-90">Join our developer community on Discord or check our GitHub for open issues.</p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold">Discord</button>
          <button className="px-6 py-2 bg-transparent border border-white rounded-lg font-bold">GitHub</button>
        </div>
      </section>
    </div>
  );
}
