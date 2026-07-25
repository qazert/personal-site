/**
 * Sets data-theme on <html> before first paint so the page never flashes the
 * wrong mode. Runs ahead of hydration, so it is deliberately dependency-free.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = stored === "light" || stored === "dark" ? stored : system;
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
