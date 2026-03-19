import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  imagePath?: string;
  noindex?: boolean;
};

const SITE_NAME = "E&S Tech Solutions";
const DEFAULT_IMAGE_PATH = "eandsfinallogo.png";

const getBaseUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  if (configured) return configured.replace(/\/+$/, "");
  if (typeof window === "undefined") return "";
  return window.location.origin;
};

const getPathname = (path?: string) => {
  if (path) return path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
};

const toAbsoluteUrl = (baseUrl: string, assetPath: string) => {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const basePath = (import.meta.env.BASE_URL || "/").replace(/^\//, "/");
  const cleanBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const cleanAsset = assetPath.replace(/^\//, "");
  if (!cleanBase) return `${cleanBasePath}${cleanAsset}`;
  return `${cleanBase}${cleanBasePath}${cleanAsset}`;
};

export const GlobalSeo = () => {
  const gaId = import.meta.env.VITE_GA_ID as string | undefined;
  const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined;

  return (
    <Helmet>
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {verification ? <meta name="google-site-verification" content={verification} /> : null}
      {gaId ? <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} /> : null}
      {gaId ? (
        <script>
          {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
        </script>
      ) : null}
    </Helmet>
  );
};

const Seo = ({ title, description, path, imagePath, noindex }: SeoProps) => {
  const baseUrl = getBaseUrl();
  const pathname = getPathname(path);
  const canonical = baseUrl ? `${baseUrl}${pathname}` : pathname;
  const image = toAbsoluteUrl(baseUrl, imagePath ?? DEFAULT_IMAGE_PATH);
  const robots = noindex ? "noindex,nofollow" : "index,follow";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
