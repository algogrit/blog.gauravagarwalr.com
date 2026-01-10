import type { CollectionEntry } from "astro:content";

export default function RelatedPosts({posts}: { posts: CollectionEntry<'posts'>[]}) {
  return (
		<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <a href={"/posts/"+post.id} className="group p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-orange-500 hover:shadow-lg transition" key={post.id}>
            <h4 className="font-semibold mb-2 group-hover:text-orange-500">{post.data.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{post.data.excerpt}</p>
          </a>
        ))}
      </div>
		</div>
  )
}
