import { getCollection } from "astro:content";

const site = "https://yufeifan.cn";

export async function GET() {
  const works = await getCollection("work");
  const posts = await getCollection("writing");
  const routes = [
    "",
    "work",
    ...works.map((work) => `work/${work.id}`),
    "experience",
    "writing",
    ...posts.map((post) => `writing/${post.id}`),
    "notes",
    "about",
    "resume"
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const loc = route ? `${site}/${route}` : site;
    return `  <url><loc>${loc}</loc></url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
