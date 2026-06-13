import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, any>;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = "website",
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = `${title} | Onsite Interior Solutions`;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Set basic meta tags
    setMetaTag("description", description);
    if (keywords) {
      setMetaTag("keywords", keywords);
    }

    // Set Open Graph tags
    const baseUrl = window.location.origin;
    const fullUrl = canonicalUrl
      ? `${baseUrl}${canonicalUrl}`
      : window.location.href;
    const defaultOgImage = `${baseUrl}/assets/generated/construction-hero.dim_1200x600.jpg`;
    const ogImageUrl = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${baseUrl}${ogImage}`
      : defaultOgImage;

    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:url", fullUrl, true);
    setMetaTag("og:image", ogImageUrl, true);
    setMetaTag("og:site_name", "Onsite Interior Solutions", true);

    // Set Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImageUrl);

    // Set canonical URL
    let canonicalLink = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullUrl;

    // Set structured data
    if (structuredData) {
      let scriptTag = document.querySelector(
        'script[type="application/ld+json"]',
      ) as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Reset title to default
      document.title = "Onsite Interior Solutions (OIS) Marketing Website";
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    structuredData,
  ]);

  return null;
}
