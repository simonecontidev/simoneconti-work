// app/head.tsx
export default function Head() {
  const initTheme = `
  (function () {
    try {
      var root = document.documentElement;
      var saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
      var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var next = saved || system;
      root.classList.toggle('dark', next === 'dark');
      root.setAttribute('data-theme', next);
    } catch (e) {}
  })();`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initTheme }} />
    </>
  );
}