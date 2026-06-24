export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://yufeifan.cn/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
