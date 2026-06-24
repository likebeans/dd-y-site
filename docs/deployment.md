# Deployment

## Local Build

```bash
npm run build
```

## Cloudflare Auth

```bash
npx wrangler whoami
```

If not authenticated:

```bash
npx wrangler login
```

## Preview Deploy

```bash
npm run build
npm run deploy:preview
```

## Production Deploy

```bash
npm run build
npm run deploy:prod
```

## Cloudflare Pages Dashboard

Build command:

```bash
npm run build
```

Build output directory:

```text
dist
```

Production domain:

```text
yufeifan.cn
```

Recommended redirect:

```text
www.yufeifan.cn -> yufeifan.cn
```

Recommended post-launch settings:

- Enable Cloudflare Web Analytics.
- Add custom domains for `yufeifan.cn` and `www.yufeifan.cn`.
- Keep the canonical site URL as `https://yufeifan.cn`.
