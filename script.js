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
var mobileOverlay = document.getElementById('mobile-overlay');
var mobileOverlayTitle = document.getElementById('mobile-overlay-title');
var mobileOverlayContent = document.getElementById('mobile-overlay-content');

var isMobile = function() {
  return window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
};

var getMenuTitle = function(toggle) {
  var titleEl = toggle && toggle.querySelector('.menu-title');
  return titleEl ? titleEl.textContent.trim() : '';
};

var fitOverlayToViewport = function() {
  if (!mobileOverlay) return;
  if (!mobileOverlay.classList.contains('is-open')) return;
  var available = window.innerHeight - 32;
  if (available < 160) available = 160;
  mobileOverlay.style.maxHeight = available + 'px';
};

var lockIntroPosition = function() {
  var centeralign = document.getElementById('centeralign');
  var columns = document.querySelector('.columns');
  if (!centeralign || !columns) return;
  if (window.innerWidth <= 700) {
    centeralign.style.verticalAlign = 'middle';
    centeralign.style.paddingTop = '0px';
    var rectMobile = columns.getBoundingClientRect();
    centeralign.style.verticalAlign = 'top';
    centeralign.style.paddingTop = rectMobile.top + 'px';
    return;
  }
  centeralign.style.verticalAlign = 'middle';
  centeralign.style.paddingTop = '0px';
  var rect = columns.getBoundingClientRect();
  centeralign.style.verticalAlign = 'top';
  centeralign.style.paddingTop = rect.top + 'px';
};

lockIntroPosition();
window.addEventListener('load', lockIntroPosition);
window.addEventListener('resize', function() {
  lockIntroPosition();
  fitOverlayToViewport();
});

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

var closeMobileOverlay = function(immediate) {
  if (!mobileOverlay) return;
  mobileOverlay.classList.remove('is-open');
  mobileOverlay.setAttribute('aria-hidden', 'true');
  if (immediate) {
    document.body.classList.remove('overlay-open');
    if (mobileOverlayTitle) mobileOverlayTitle.textContent = '';
    if (mobileOverlayContent) mobileOverlayContent.innerHTML = '';
    return;
  }
  window.setTimeout(function() {
    document.body.classList.remove('overlay-open');
    if (mobileOverlayTitle) mobileOverlayTitle.textContent = '';
    if (mobileOverlayContent) mobileOverlayContent.innerHTML = '';
  }, 250);
};

var openMobileOverlay = function(toggle) {
  if (!mobileOverlay || !mobileOverlayContent || !mobileOverlayTitle) return;
  var item = toggle.closest('.menu-item');
  if (!item) return;
  var titleEl = item.querySelector('.menu-title');
  var dropdown = item.querySelector('.menu-dropdown');
  if (!titleEl || !dropdown) return;

  var isAlreadyOpen = mobileOverlay.classList.contains('is-open') && mobileOverlayTitle.textContent === titleEl.textContent;
  if (isAlreadyOpen) {
    closeMobileOverlay();
    return;
  }

  closeAllDropdowns();

  var setOverlayContent = function() {
    mobileOverlayTitle.textContent = titleEl.textContent;
    mobileOverlayContent.innerHTML = '';
    Array.from(dropdown.children).forEach(function(el) {
      mobileOverlayContent.appendChild(el.cloneNode(true));
    });
  };

  document.body.classList.add('overlay-open');
  mobileOverlay.setAttribute('aria-hidden', 'false');

  if (mobileOverlay.classList.contains('is-open')) {
    mobileOverlay.classList.remove('is-open');
    window.setTimeout(function() {
      setOverlayContent();
      mobileOverlay.classList.add('is-open');
      fitOverlayToViewport();
    }, 230);
  } else {
    setOverlayContent();
    mobileOverlay.classList.add('is-open');
    fitOverlayToViewport();
  }
};

menuToggles.forEach(function(toggle) {
  toggle.addEventListener('click', function(event) {
    event.stopPropagation();
    var title = getMenuTitle(toggle);

    if (title === 'About') {
      closeAllDropdowns();
      openMobileOverlay(toggle);
      return;
    }

    closeMobileOverlay(true);

    var dropdown = toggle.parentElement && toggle.parentElement.querySelector('.menu-dropdown');
    if (!dropdown) return;

    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns(toggle);

    toggle.setAttribute('aria-expanded', String(!isOpen));
    dropdown.hidden = isOpen;
  });
});

document.addEventListener('click', function(event) {
  var clickedInsideMenuItem = event.target.closest('.menu-item');
  var clickedInsideOverlay = event.target.closest('#mobile-overlay');
  if (!clickedInsideMenuItem && !clickedInsideOverlay) {
    closeAllDropdowns();
    closeMobileOverlay();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeAllDropdowns();
    closeMobileOverlay();
  }
});

if (mobileOverlay) {
  mobileOverlay.addEventListener('click', function(event) {
    if (!isMobile()) return;
    if (event.target === mobileOverlay) closeMobileOverlay();
  });
}
