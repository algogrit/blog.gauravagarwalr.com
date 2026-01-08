import type { CollectionEntry } from "astro:content";
import FormattedDate from "./FormattedDate";

const FeaturedPost = ({
  post
}: {post: CollectionEntry<"posts"> | undefined}) => {
  if(post === undefined) {
    return <></>
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-10">Featured Article</h2>
      <div className="grid md:grid-cols-2 gap-10 p-8 border rounded-xl shadow-sm hover:shadow-lg transition">
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            {post.data.title}
          </h3>

          <div className="flex flex-wrap gap-5 text-sm text-slate-500 mb-4">
            <span><FormattedDate date={post.data.date} /></span>
            <span>⏱️ 15 min read</span>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">
            {post.data.excerpt}
          </p>

          <a href={"/posts/"+post.id} className="inline-flex items-center gap-2 font-semibold text-brand hover:gap-4 transition-all">
            Read Full Article →
          </a>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-6xl text-white">
          🔀
        </div>
      </div>
    </section>
  );
}

export default FeaturedPost;
