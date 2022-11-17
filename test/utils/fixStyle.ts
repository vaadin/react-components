const style = `
div:last-child {
  width: 100%;
  height: 500px;
}
`;

export default function fixStyle() {
  const css = new CSSStyleSheet();
  css.replaceSync(style);
  document.adoptedStyleSheets = [css];
}
