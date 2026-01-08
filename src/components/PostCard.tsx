import type { CollectionEntry } from "astro:content";
import FormattedDate from "./FormattedDate";

const PostCard = ({
  post
}: {post: CollectionEntry<"posts">}) => {

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <article className="p-6 border rounded-lg hover:border-brand hover:shadow-lg transition">
        <div className="flex gap-2 mb-3">
          {post.data.tags.splice(0,3).map((tag, index) => (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-brand" key={index}>{tag}</span>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">{post.data.title}</h3>

        <div className="flex gap-4 text-xs text-slate-500 mb-3">
          <span><FormattedDate date={post.data.date} /></span>
          <span>⏱️ 8 min</span>
        </div>

        <p className="text-sm text-slate-600">
          {post.data.excerpt}
        </p>
      </article>
    </div>
  );

}

export default PostCard;
