function typeEffect(element, speed, done) {
  var text = element.innerHTML;
  element.innerHTML = "";

  var i = 0;
  var timer = setInterval(function() {
    if (i < text.length) {
      element.append(text.charAt(i));
      i++;
    } else {
      clearInterval(timer);
      if (typeof done === 'function') done();
    }
  }, speed);
}


// application
var speed = 75;
var h1 = document.querySelector('h1');
var p = document.querySelector('p.tagline');
var menuItems = document.querySelectorAll('.menu-item');
var menuToggles = document.querySelectorAll('.menu-toggle');

var lockIntroPosition = function() {
  var centeralign = document.getElementById('centeralign');
  var columns = document.querySelector('.columns');
  if (!centeralign || !columns) return;
  if (window.innerWidth <= 700) {
    centeralign.style.verticalAlign = 'top';
    centeralign.style.paddingTop = '32px';
    return;
  }
  var rect = columns.getBoundingClientRect();
  var topPadding = Math.min(rect.top, 120);
  centeralign.style.verticalAlign = 'top';
  centeralign.style.paddingTop = topPadding + 'px';
};

lockIntroPosition();
window.addEventListener('load', lockIntroPosition);
window.addEventListener('resize', lockIntroPosition);

// type affect to header
typeEffect(h1, speed, function(){
  // type affect to body
  p.style.visibility = "visible";
  typeEffect(p, speed, function(){
    menuItems.forEach(function(item, idx) {
      window.setTimeout(function() {
        item.classList.add('is-visible');
      }, 80 * idx);
    });
  });
});

var closeAllDropdowns = function(exceptToggle) {
  menuToggles.forEach(function(toggle) {
    if (exceptToggle && toggle === exceptToggle) return;
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (!expanded) return;
    toggle.setAttribute('aria-expanded', 'false');
    var dropdown = toggle.parentElement && toggle.parentElement.querySelector('.menu-dropdown');
    if (dropdown) dropdown.hidden = true;
  });
};

menuToggles.forEach(function(toggle) {
  toggle.addEventListener('click', function(event) {
    event.stopPropagation();
    var dropdown = toggle.parentElement && toggle.parentElement.querySelector('.menu-dropdown');
    if (!dropdown) return;

    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns(toggle);

    toggle.setAttribute('aria-expanded', String(!isOpen));
    dropdown.hidden = isOpen;
  });
});

document.addEventListener('click', function(event) {
  var clickedInsideMenu = event.target.closest('.menu-item');
  if (!clickedInsideMenu) closeAllDropdowns();
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') closeAllDropdowns();
});
