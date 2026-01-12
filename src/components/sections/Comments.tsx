import { useEffect } from "react";

function getTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function updateGiscusTheme(theme: "light" | "dark") {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame"
  );

  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme,
        },
      },
    },
    "https://giscus.app"
  );
}

export default function Comments() {
  useEffect(() => {
    const container = document.getElementById("giscus-container");
    if (!container || container.hasChildNodes()) return;

    const script = document.createElement("script");

    Object.entries({
      src: "https://giscus.app/client.js",
      "data-repo": "algogrit/blog-discussions",
      "data-repo-id": "R_kgDOQxE5BA",
      "data-category": "Announcements",
      "data-category-id": "DIC_kwDOQxE5BM4C02ut",
      "data-mapping": "pathname",
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "bottom",
      "data-theme": getTheme(),
      "data-lang": "en",
      crossorigin: "anonymous",
      async: "true",
    }).forEach(([key, value]) =>
      script.setAttribute(key, value)
    );

    container.appendChild(script);

    // Observe <html> class changes
    const observer = new MutationObserver(() => {
      updateGiscusTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return <div id="giscus-container" className="mt-20"/>;
}
