import type { CollectionEntry } from "astro:content";
import FormattedDate from "../FormattedDate";
import TagPill from "../tags/TagPill";

const PostCard = ({
  post
}: {post: CollectionEntry<"posts">}) => {

  return (
    <a href={"/posts/"+post.id} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 hover:shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.data.tags.map((tag, index) => (
            <TagPill tag={tag} key={index}/>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 line-clamp-2">{post.data.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <FormattedDate date={post.data.date}/>
          </span>
          <span>8 min read</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {post.data.excerpt}
        </p>
        <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400 font-medium group-hover:gap-3">
          Read Article
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default PostCard;
