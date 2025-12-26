import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Gaurav's Blog
        </h1>
        <p className="text-xl text-gray-600">
          Engineering Insights & Technical Deep Dives
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group border rounded-lg p-6 hover:shadow-lg transition hover:border-primary"
          >
            <div className="flex gap-2 mb-3 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition">
              {post.title}
            </h2>
            <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
}
