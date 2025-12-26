'use client';

import Giscus from '@giscus/react';

export default function Comments() {
  return (
    <div className="mt-12 pt-8 border-t">
      <Giscus
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO!}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
