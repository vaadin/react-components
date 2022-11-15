const observerOptions = {
  childList: true,
  subtree: true,
};

export default function catchRender(tag: string, root: Element) {
  return new Promise<void>((resolve) => {
    console.log(tag, root);

    const observer = new MutationObserver((mutations) => {
      console.log(mutations);

      if (mutations.flatMap(({ addedNodes }) => Array.from(addedNodes)).some((node) => node.nodeName === tag)) {
        resolve();
      }
    });

    observer.observe(root, observerOptions);
  });
}
