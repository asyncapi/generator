/* eslint-disable */

function bindExpanders() {
  var props = document.querySelectorAll('.js-prop');
  for (let index = 0; index < props.length; index++) {
    const prop = props[index];
    prop.addEventListener('click', function (ev) {
      ev.stopPropagation();
      ev.currentTarget.parentElement.classList.toggle('is-open');
    });
  }
}

function highlightCode() {
  var blocks = document.querySelectorAll('.hljs code');

  for (var i = 0; i < blocks.length; i++) {
    hljs.highlightBlock(blocks[i]);
  }
}

function bindMenuItems() {
  var items = document.querySelectorAll('.js-menu-item');

  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function () {
      document.getElementById("burger-menu").checked = false;
    });
  }
}

window.addEventListener('load', highlightCode);
window.addEventListener('load', bindExpanders);
window.addEventListener('load', bindMenuItems);
