/**
 *
 * @param {HTMLElement} container
 * @returns {Array<HTMLElement>}
 */
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe",
    ),
  );
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
  summary.setAttribute(
    'aria-expanded',
    `${summary.parentElement.hasAttribute('open')}`,
  );

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('click', (/** @type {PointerEvent} */ event) => {
    const currentTarget = /** @type {HTMLElement} */ (event.currentTarget);

    currentTarget.setAttribute(
      'aria-expanded',
      `${!currentTarget.closest('details').hasAttribute('open')}`,
    );
  });

  if (summary.closest('header-drawer, menu-drawer')) return;
  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});

const trapFocusHandlers = {};

/**
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} elementToFocus
 */
function trapFocus(container, elementToFocus = container) {
  /** @type {Array<HTMLElement>} */
  const elements = getFocusableElements(container);

  /** @type {HTMLElement} */
  const first = elements[0];

  /** @type {HTMLElement} */
  const last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (/** @type {FocusEvent} */ event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (/** @type {KeyboardEvent} */ event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();

  if (
    elementToFocus instanceof HTMLInputElement &&
    ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
    elementToFocus.value
  ) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(':focus-visible');
} catch (e) {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = [
    'ARROWUP',
    'ARROWDOWN',
    'ARROWLEFT',
    'ARROWRIGHT',
    'TAB',
    'ENTER',
    'SPACE',
    'ESCAPE',
    'HOME',
    'END',
    'PAGEUP',
    'PAGEDOWN',
  ];
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener('keydown', (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener('mousedown', () => {
    mouseClick = true;
  });

  window.addEventListener(
    'focus',
    () => {
      if (currentFocusedElement)
        currentFocusedElement.classList.remove('focused');

      if (mouseClick) return;

      currentFocusedElement = document.activeElement;
      currentFocusedElement.classList.add('focused');
    },
    true,
  );
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((/** @type {HTMLIFrameElement} */ video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + 'pauseVideo' + '","args":""}',
      '*',
    );
  });

  document.querySelectorAll('.js-vimeo').forEach((/** @type {HTMLIFrameElement} */ video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });

  document.querySelectorAll('video').forEach((video) => video.pause());

  document.dispatchEvent(new CustomEvent('product-model:pause'));
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

/**
 * @param {KeyboardEvent} event
 * @returns
 */
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const target = /** @type {HTMLElement} */ (event.target);
  const openDetailsElement = target.closest('details[open]');

  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', 'false');
  summaryElement.focus();
}

/**
 *
 * @param {Function} callback
 * @param {Number} wait - timeout duration in milliseconds
 * @returns
 */
function debounce(callback, wait) {
  let t;
  return (/** @type {any} */ ...args) => {
    clearTimeout(t);
    t = setTimeout(() => callback.apply(this, args), wait);
  };
}

/**
 *
 * @param {Function} callback
 * @param {Number} delay
 * @returns
 */
function throttle(callback, delay) {
  let lastCall = 0;
  return function (/** @type {any} */ ...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return callback(...args);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 */

if (typeof window.Shopify == 'undefined') {
  window.Shopify = { bind: null, setSelectorByValue: null, addListener: null, postLink: null, CountryProvinceSelector: null };
}

/**
 *
 * @param {Function} callback
 * @param {Object} scope - The object to be used as the 'this' object
 * @returns {EventListenerOrEventListenerObject}
 */
Shopify.bind = function (callback, scope) {
  return function () {
    return callback.apply(scope, arguments);
  };
};

/**
 * @param {HTMLSelectElement} selector
 * @param {String} value
 * @returns
 */
Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

/**
 * @param {HTMLElement} target
 * @param {keyof HTMLElementEventMap} eventName
 * @param {EventListenerOrEventListenerObject} callback
 */
Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener(eventName, callback, false);
};

/**
 * @param {String} path
 * @param {Object} options
 */
Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);

  for (var key in params) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);
    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

/**
 * @param {String} country_domid
 * @param {String} province_domid
 * @param {Object} options
 */
Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options,
) {
  /** @type {HTMLSelectElement | null} */
  this.countryElement = window[`${country_domid}`];
  /** @type {HTMLSelectElement | null} */
  this.provinceElement = window[`${province_domid}`];
  /** @type {HTMLElement | HTMLSelectElement} */
  this.provinceContainer = document.getElementById(
    options['hideElement'] || province_domid,
  );

  Shopify.addListener(
    this.countryElement,
    'change',
    Shopify.bind(this.countryHandler, this),
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryElement.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryElement, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceElement.getAttribute('data-default');
    if (value && this.provinceElement.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceElement, value);
    }
  },

  countryHandler: function () {
    let option = this.countryElement.options[this.countryElement.selectedIndex];
    const raw = option.getAttribute('data-provinces');
    /** @type {Array<Array<String>} */
    const provinces = JSON.parse(raw);

    this.clearOptions(this.provinceElement);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      provinces.forEach((province) => {
        let option = document.createElement('option');
        option.value = province[0];
        option.innerHTML = province[1];
        this.provinceElement.appendChild(option);
      });
      for (var i = 0; i < provinces.length; i++) {
      }

      this.provinceContainer.style.display = '';
    }
  },

  /**
   * @param {HTMLSelectElement} selector
   */
  clearOptions: function (selector) {
    selector.replaceChildren();
  },

  /**
   * @param {HTMLSelectElement} selector
   * @param {Array<String>} values
   */
  setOptions: function (selector, values) {
    const fragment = new DocumentFragment();

    values.forEach((value) => {
      var option = document.createElement('option');
      option.value = value;
      option.innerHTML = value;
      fragment.appendChild(option);
    });

    selector.appendChild(fragment);
  },
};
