import { getCollection } from "astro:content";

const site = "https://yufeifan.cn";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = (await getCollection("writing")).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>dd-y / 余非凡 Writing</title>
    <link>${site}/writing</link>
    <description>RAG、Agent、评测与 AI 工程系统的长文章。</description>
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${site}/writing/${post.id}</link>
      <guid>${site}/writing/${post.id}</guid>
      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
}
