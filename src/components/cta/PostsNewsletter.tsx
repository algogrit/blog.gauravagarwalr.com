export default function PostsNewsletter() {
  return (
    <div className="bg-linear-to-r from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600 p-8 text-white text-center">
      <h3 className="text-2xl font-bold mb-2">Subscribe to the Newsletter</h3>
      <p className="mb-6 opacity-90">Get the latest posts delivered right to your inbox</p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"/>
          <button className="px-6 py-3 bg-white dark:bg-gray-800 text-orange-500 dark:text-orange-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Subscribe</button>
      </div>
    </div>
  );
}
