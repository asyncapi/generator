/* eslint-disable */

function bindExpanders() {
  var props = document.querySelectorAll('.js-prop');
  props.forEach(function (prop) {
    prop.addEventListener('click', function (ev) {
      ev.stopPropagation();
      ev.currentTarget.parentElement.classList.toggle('is-open');
    });
  });
}

function removeCurrentLinkSelection() {
  var links = document.querySelectorAll('.navigation__list__item-text--link');
  if (!links) return;

  for (var i = 0; i < links.length; i++) {
    links[i].classList.remove('navigation__list__item-text--link--active');
  }
}

function selectCurrentLink() {
  removeCurrentLinkSelection();

  var hash = window.location.hash;
  if (!hash) return;

  var link = document.querySelector("a[href='" + hash + "']");
  if (!link) return;

  link.classList.add('navigation__list__item-text--link--active');
}

function highlightCode() {
  var blocks = document.querySelectorAll('.hljs code');

  for (var i = 0; i < blocks.length; i++) {
    hljs.highlightBlock(blocks[i]);
  }
}

window.addEventListener('hashchange', selectCurrentLink);
window.addEventListener('load', selectCurrentLink);
window.addEventListener('load', highlightCode);
window.addEventListener('load', bindExpanders);
