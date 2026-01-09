import type { CollectionEntry } from "astro:content";
import FormattedDate from "../FormattedDate";
import FeaturedTagPill from "../tags/FeaturedTagPill";

const FeaturedPost = ({
  post
}: {post: CollectionEntry<"posts"> | undefined}) => {
  if(post === undefined) {
    return <></>
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-1 w-12 bg-linear-to-r from-orange-500 to-yellow-500 rounded mr-3"></div>
        <h2 className="text-3xl font-bold">Featured Article</h2>
      </div>

      <a href={"/posts/"+post.id} className="block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl group">
        <div className="gap-8 p-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.data.tags.map((tag, index) => (
                <FeaturedTagPill tag={tag} key={index}/>
              ))}
            </div>
            <h3 className="text-3xl font-bold mb-4 group-hover:text-orange-500">
              {post.data.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <FormattedDate date={post.data.date}/>
              </span>
              <span>15 min read</span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded text-xs font-medium">Featured</span>
            </div>
            <p className="text-lg mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              {post.data.excerpt}
            </p>
            <div className="inline-flex items-center gap-2 text-orange-500 dark:text-orange-400 font-semibold group-hover:gap-3">
              Read Full Article
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

export default FeaturedPost;
