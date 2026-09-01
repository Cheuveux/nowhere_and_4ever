// components/seo/Seo.tsx
interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article'| 'take' | 'chat-room' | 'special' | 'mosaic';
}

const SITE_NAME = "This Place Is Nowhere And Its Forever";
const DEFAULT_IMAGE = "https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/og-default.jpg";
const SITE_URL = "https://this-place-is-nowhere-and-its-forever.com";

export function Seo({ title, description, image, url, type = 'website' }: SeoProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || DEFAULT_IMAGE} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || DEFAULT_IMAGE} />

      <link rel="canonical" href={fullUrl} />
    </>
  );
}