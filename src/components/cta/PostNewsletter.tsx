export default function PostNewsletter() {
  return (
    <div className="mt-12 mb-12 bg-linear-to-r from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600 rounded-xl p-8 text-white">
      <h3 className="text-2xl font-bold mb-2">Enjoyed this article?</h3>
      <p className="mb-6 opacity-90">Subscribe to get more technical deep dives delivered to your inbox</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"/>
        <button className="px-6 py-3 bg-white dark:bg-gray-800 text-orange-500 dark:text-orange-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Subscribe</button>
      </div>
    </div>
    );
};
