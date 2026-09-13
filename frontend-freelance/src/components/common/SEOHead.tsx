import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api, getImageUrl } from "../../services/api.js";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  type?: string;
  keywords?: string;
}

let cachedGlobalSEO: any = null;
let isFetchingSEO = false;
const listeners: Array<(data: any) => void> = [];

export function updateSEOCache(newGlobal: any) {
  cachedGlobalSEO = { ...cachedGlobalSEO, ...newGlobal };
  listeners.forEach((fn) => fn(cachedGlobalSEO));

  if (newGlobal?.favicon) {
    applyFaviconTag(getImageUrl(newGlobal.favicon));
  }
}

export function applyFaviconTag(url: string) {
  if (!url) return;
  const resolved = getImageUrl(url);
  const rels = ["icon", "shortcut icon", "apple-touch-icon"];
  rels.forEach((rel) => {
    let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = resolved;
  });
}

export function SEOHead({
  title,
  description,
  image,
  canonicalUrl,
  type = "website",
  keywords,
}: SEOHeadProps) {
  const [globalSeo, setGlobalSeo] = useState<any>(cachedGlobalSEO);

  useEffect(() => {
    const handleUpdate = (data: any) => setGlobalSeo(data);
    listeners.push(handleUpdate);

    if (!cachedGlobalSEO && !isFetchingSEO) {
      isFetchingSEO = true;
      api
        .get("/seo")
        .then((res) => {
          if (res?.global) {
            cachedGlobalSEO = res.global;
            listeners.forEach((fn) => fn(res.global));
            if (res.global.favicon) {
              applyFaviconTag(getImageUrl(res.global.favicon));
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          isFetchingSEO = false;
        });
    } else if (cachedGlobalSEO?.favicon) {
      applyFaviconTag(getImageUrl(cachedGlobalSEO.favicon));
    }

    return () => {
      const idx = listeners.indexOf(handleUpdate);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const finalTitle = title || globalSeo?.siteTitle || "Saurabh Rathore — Premium Framer & UI Designer";
  const finalDescription =
    description ||
    globalSeo?.siteDescription ||
    "Clean, motion-first digital design and high-end Webflow & Framer development.";
  const rawImage = image || globalSeo?.openGraphImage;
  const finalImage = rawImage ? getImageUrl(rawImage) : "";
  const rawFavicon = globalSeo?.favicon;
  const finalFavicon = rawFavicon ? getImageUrl(rawFavicon) : "/favicon.ico";
  const finalKeywords = keywords || globalSeo?.keywords || "";
  const twitterCard = globalSeo?.twitterCard || "summary_large_image";

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}

      {/* Dynamic Favicon Links */}
      {finalFavicon && <link rel="icon" href={finalFavicon} />}
      {finalFavicon && <link rel="shortcut icon" href={finalFavicon} />}
      {finalFavicon && <link rel="apple-touch-icon" href={finalFavicon} />}

      {/* OpenGraph Social Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      {finalImage && <meta property="og:image" content={finalImage} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Twitter Card Social Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalImage && <meta name="twitter:image" content={finalImage} />}
    </Helmet>
  );
}
