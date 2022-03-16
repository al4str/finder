export function scrollToY(to = 0): void {
  window.scrollTo(0, to);
}

export function scrollToEl(
  el?: HTMLElement,
  block?: ScrollIntoViewOptions['block'],
  inline?: ScrollIntoViewOptions['inline'],
): void {
  const target = el instanceof HTMLElement
    ? el
    : window.document.body;
  target.scrollIntoView({
    behavior: 'smooth',
    block: block || 'end',
    inline: inline || 'nearest',
  });
}
