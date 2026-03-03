import { useEffect, useState } from "react";
import { getSEOForRoute, getCanonicalUrl, getOgImageUrl, isNoindexRoute } from "../config/seo";

// Hook für Hash-basiertes Routing
function useHashLocation() {
  const [route, setRoute] = useState<string>(() => {
    const hash = window.location.hash || "#/";
    return hash.replace(/^#/, "") || "/";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      setRoute(hash.replace(/^#/, "") || "/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}

/**
 * useSEO — Setzt alle SEO-Metadaten dynamisch pro Route
 *
 * Datenquelle: src/config/seo.ts (Single Source of Truth)
 *
 * Setzt:
 * - document.title
 * - meta[name="description"]
 * - meta[name="keywords"]
 * - meta[name="robots"] (noindex für rechtliche Seiten)
 * - link[rel="canonical"]
 * - meta[property="og:title"]
 * - meta[property="og:description"]
 * - meta[property="og:image"]
 * - meta[property="og:url"]
 * - meta[name="twitter:title"]
 * - meta[name="twitter:description"]
 * - meta[name="twitter:image"]
 * - html[lang]
 */
export function useSEO() {
  const route = useHashLocation();

  useEffect(() => {
    const seo = getSEOForRoute(route);
    const canonicalUrl = getCanonicalUrl(route);
    const ogImageUrl = getOgImageUrl(route);

    // ── Document Title ─────────────────────────────────────────────────────
    document.title = seo.title;

    // ── HTML lang-Attribut ─────────────────────────────────────────────────
    if (seo.lang) {
      document.documentElement.setAttribute("lang", seo.lang);
    }

    // ── Meta-Helper ───────────────────────────────────────────────────────
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = selector
          .replace("meta[", "").replace("]", "")
          .split("=")
          .map(s => s.replace(/["']/g, ""));
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const setLink = (rel: string, attr: string, value: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // ── Standard Meta Tags ─────────────────────────────────────────────────
    setMeta('meta[name="description"]', "content", seo.description);

    if (seo.keywords) {
      setMeta('meta[name="keywords"]', "content", seo.keywords);
    }

    // Robots: noindex für rechtliche/interne Seiten
    if (isNoindexRoute(route)) {
      setMeta('meta[name="robots"]', "content", "noindex, follow");
    } else {
      setMeta('meta[name="robots"]', "content", "index, follow");
    }

    // ── Canonical ──────────────────────────────────────────────────────────
    setLink("canonical", "href", canonicalUrl);

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:image"]', "content", ogImageUrl);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "Stoppclock");

    // ── Twitter Cards ──────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('meta[name="twitter:image"]', "content", ogImageUrl);

  }, [route]);
}

// Render-less Component für App-Root
export function SEOHead() {
  useSEO();
  return null;
}
