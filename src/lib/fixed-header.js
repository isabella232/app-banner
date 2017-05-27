export default function findFixedHeader() {
  let el = document.elementFromPoint(1, 1);
  let style;

  if (!el) {
    return false;
  }

  do {
    style = window.getComputedStyle(el);

    if ((!style || style.position !== 'fixed') && el.parentElement) { // This is not the header
      el = el.parentElement;
    }
  } while (el.parentElement && style.position !== 'fixed');

  if (el && style.position === 'fixed') {
    // console.log('found the header');
    return el;
  }

  // console.log('no header found');

  return false;
}
