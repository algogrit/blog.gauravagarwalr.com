export default function About() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-yellow-500 rounded mr-3"></div>
              <h2 className="text-3xl font-bold">About the Author</h2>
            </div>
            <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">
              👋&nbsp;&nbsp;I'm Gaurav Agarwal, a Director of Engineering passionate about building scalable systems and sharing knowledge with the engineering community.
            </p>
            <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
              Through this blog, I share deep technical insights, programming concepts, and lessons learned from years of software development.
            </p>
            <div className="flex gap-4">
              <a href="https://algogrit.com" className="text-orange-500 dark:text-orange-400 hover:underline font-semibold">More About Me →</a>
              <a href="https://codermana.com" className="text-orange-500 dark:text-orange-400 hover:underline font-semibold">CoderMana →</a>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-4">Enterprise Training & Consulting</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Looking to upskill your engineering team? CoderMana offers custom technical training and architecture consulting for enterprises.
            </p>
            <ul className="space-y-2 mb-6 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                3000+ Engineers Trained
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                35+ Enterprise Clients
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                14+ Programming Languages & tools
              </li>
            </ul>
            <a href="https://codermana.com" className="block w-full px-6 py-3 bg-linear-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 text-center shadow-lg">
              Learn More About CoderMana
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
