// TODO: Actually subscribe!
export default function NewsletterCTA() {
  return (
      <section id="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600 p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with New Articles</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Get the latest posts on engineering, programming, and technology delivered right to your inbox. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input type="email" placeholder="Enter your email address" required className="flex-1 px-6 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"/>
                <button type="submit" className="px-8 py-4 bg-white dark:bg-gray-800 text-orange-500 dark:text-orange-400 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg">
                    Subscribe
                </button>
            </form>
            <p className="text-sm mt-4 opacity-75">Join 1,000+ engineers who read the newsletter</p>
        </div>
    </section>
  );
}
