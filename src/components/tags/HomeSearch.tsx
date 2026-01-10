import setQueryParam from "../helpers/setQueryParam";

export default function HomeSearch() {
  return (
    <div className="max-w-7xl mx-auto my-12">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="search" placeholder="Search articles..." onChange={(e) => setQueryParam("q", e.target.value)} className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm text-gray-900 dark:text-gray-100"/>
      </div>
    </div>
  );
};
