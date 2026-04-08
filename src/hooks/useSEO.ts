import { useEffect } from "react";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
}

const DEFAULT_SEO: SEOData = {
  title: "DTF ARTZONE",
  description: "Impressão DTF com qualidade profissional, adesivos personalizados e atendimento ágil.",
  keywords: "dtf, impressão dtf, adesivos personalizados, gráfica dtf",
  ogImage: "",
  favicon: ""
};

function getMetaContent(name: string): string | null {
  const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return meta ? meta.getAttribute("content") : null;
}

function setMetaTag(name: string, content: string, isProperty = false): void {
  let meta = document.querySelector(
    isProperty 
      ? `meta[property="${name}"]` 
      : `meta[name="${name}"]`
  );
  
  if (!meta) {
    meta = document.createElement("meta");
    if (isProperty) {
      meta.setAttribute("property", name);
    } else {
      meta.setAttribute("name", name);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute("href", href);
}

export function useSEO(content: Record<string, string> | undefined) {
  const seo: SEOData = {
    title: content?.seo_title || DEFAULT_SEO.title,
    description: content?.seo_description || DEFAULT_SEO.description,
    keywords: content?.seo_keywords || DEFAULT_SEO.keywords,
    ogImage: content?.seo_og_image || DEFAULT_SEO.ogImage,
    favicon: content?.seo_favicon || DEFAULT_SEO.favicon
  };

  useEffect(() => {
    if (!seo.title) return;

    document.title = seo.title;
    setMetaTag("description", seo.description);
    setMetaTag("keywords", seo.keywords);
    setMetaTag("og:title", seo.title, true);
    setMetaTag("og:description", seo.description, true);
    
    if (seo.ogImage) {
      setMetaTag("og:image", seo.ogImage, true);
    } else {
      const ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (ogImageMeta) ogImageMeta.remove();
    }

    if (seo.favicon) {
      setLinkTag("icon", seo.favicon);
    }
  }, [seo]);

  return seo;
}