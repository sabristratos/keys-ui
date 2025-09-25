var jm = Object.defineProperty;
var Fm = (r, t, e) => t in r ? jm(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var _ = (r, t, e) => Fm(r, typeof t != "symbol" ? t + "" : t, e);
const _r = class _r {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const t = this.name;
    return _r.instances.has(t) || _r.instances.set(t, new this()), _r.instances.get(t);
  }
  /**
   * Standardized initialization flow
   * Prevents double initialization and provides lifecycle hooks
   */
  init() {
    var t, e, n;
    this.initialized || ((t = this.onBeforeInit) == null || t.call(this), this.bindEventListeners(), this.initializeElements(), (e = this.setupDynamicObserver) == null || e.call(this), (n = this.onAfterInit) == null || n.call(this), this.initialized = !0);
  }
  /**
   * Standardized cleanup and destroy
   * Handles state cleanup and provides extension point
   */
  destroy() {
    var t;
    (t = this.onDestroy) == null || t.call(this), this.stateManager.clear(), this.initialized = !1;
  }
  /**
   * State management utilities
   * Common operations used across multiple action classes
   */
  getState(t) {
    return this.stateManager.get(t);
  }
  setState(t, e) {
    this.stateManager.set(t, e);
  }
  removeState(t) {
    return this.stateManager.delete(t);
  }
  hasState(t) {
    return this.stateManager.has(t);
  }
  clearAllStates() {
    this.stateManager.clear();
  }
  getAllStates() {
    return new Map(this.stateManager);
  }
  /**
   * Common utility methods used across action classes
   * Note: For DOM operations use DOMUtils, for events use EventUtils
   */
  /**
   * Common MutationObserver setup for dynamic content
   * Used by many action classes to detect new elements
   */
  createDynamicObserver(t) {
    const e = new MutationObserver((n) => {
      n.forEach((i) => {
        i.addedNodes.length > 0 && t(i.addedNodes);
      });
    });
    return e.observe(document.body, {
      childList: !0,
      subtree: !0
    }), e;
  }
  /**
   * Debounced resize handler utility
   * Used by positioning-aware components
   */
  createResizeHandler(t, e = 100) {
    let n = null;
    return () => {
      n && clearTimeout(n), n = setTimeout(t, e);
    };
  }
  /**
   * Check if the action class is properly initialized
   */
  isInitialized() {
    return this.initialized;
  }
  /**
   * Get the number of managed states
   * Useful for debugging and testing
   */
  getStateCount() {
    return this.stateManager.size;
  }
};
_r.instances = /* @__PURE__ */ new Map();
let ht = _r;
class b {
  /**
   * Safely find the closest ancestor element matching selector
   */
  static findClosest(t, e) {
    return !t || !(t instanceof Element) ? null : t.closest(e) || null;
  }
  /**
   * Find closest element with data attribute
   */
  static findClosestWithData(t, e) {
    return (t == null ? void 0 : t.closest(`[data-${e}]`)) || null;
  }
  /**
   * Safely query selector within element or document
   */
  static querySelector(t, e) {
    return (e || document).querySelector(t) || null;
  }
  /**
   * Safely query all elements matching selector
   */
  static querySelectorAll(t, e) {
    const n = e || document;
    return Array.from(n.querySelectorAll(t));
  }
  /**
   * Find elements with specific data attribute
   */
  static findByDataAttribute(t, e, n) {
    const i = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelectorAll(i, n);
  }
  /**
   * Find single element with data attribute
   */
  static findFirstByDataAttribute(t, e, n) {
    const i = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelector(i, n);
  }
  /**
   * Check if element has data attribute with optional value
   */
  static hasDataAttribute(t, e, n) {
    if (!t) return !1;
    const i = t.dataset[e];
    return n !== void 0 ? i === n : i !== void 0;
  }
  /**
   * Get data attribute value safely
   */
  static getDataAttribute(t, e) {
    return t == null ? void 0 : t.dataset[e];
  }
  /**
   * Set data attribute safely
   */
  static setDataAttribute(t, e, n) {
    t && (t.dataset[e] = n);
  }
  /**
   * Remove data attribute safely
   */
  static removeDataAttribute(t, e) {
    t && delete t.dataset[e];
  }
  /**
   * Check if element is disabled (multiple ways)
   */
  static isDisabled(t) {
    return t ? t.hasAttribute("disabled") || t.dataset.disabled === "true" || t.getAttribute("aria-disabled") === "true" : !0;
  }
  /**
   * Check if element is hidden
   */
  static isHidden(t) {
    return t ? t.hidden || t.style.display === "none" || t.getAttribute("aria-hidden") === "true" || !t.offsetParent : !0;
  }
  /**
   * Find form element (input/textarea) within container
   */
  static findFormElement(t) {
    return (t == null ? void 0 : t.querySelector("input, textarea")) || null;
  }
  /**
   * Find form element associated with action button
   */
  static findFormElementForAction(t) {
    const e = this.findClosest(t, ".relative");
    return this.findFormElement(e);
  }
  /**
   * Get element by ID safely
   */
  static getElementById(t) {
    return document.getElementById(t) || null;
  }
  /**
   * Check if element matches selector
   */
  static matches(t, e) {
    var n;
    return ((n = t == null ? void 0 : t.matches) == null ? void 0 : n.call(t, e)) ?? !1;
  }
  /**
   * Find all child elements matching selector
   */
  static findChildren(t, e) {
    return t ? Array.from(t.children).filter(
      (n) => this.matches(n, e)
    ) : [];
  }
  /**
   * Get next sibling element matching selector
   */
  static getNextSibling(t, e) {
    let n = t == null ? void 0 : t.nextElementSibling;
    for (; n; ) {
      if (!e || this.matches(n, e))
        return n;
      n = n.nextElementSibling;
    }
    return null;
  }
  /**
   * Get previous sibling element matching selector
   */
  static getPreviousSibling(t, e) {
    let n = t == null ? void 0 : t.previousElementSibling;
    for (; n; ) {
      if (!e || this.matches(n, e))
        return n;
      n = n.previousElementSibling;
    }
    return null;
  }
  /**
   * Add class safely
   */
  static addClass(t, e) {
    t == null || t.classList.add(e);
  }
  /**
   * Remove class safely
   */
  static removeClass(t, e) {
    t == null || t.classList.remove(e);
  }
  /**
   * Toggle class safely
   */
  static toggleClass(t, e, n) {
    return (t == null ? void 0 : t.classList.toggle(e, n)) ?? !1;
  }
  /**
   * Check if element has class
   */
  static hasClass(t, e) {
    return (t == null ? void 0 : t.classList.contains(e)) ?? !1;
  }
  /**
   * Remove multiple classes safely
   */
  static removeClasses(t, e) {
    t && t.classList.remove(...e);
  }
  /**
   * Add multiple classes safely
   */
  static addClasses(t, e) {
    t && t.classList.add(...e);
  }
  /**
   * Set or remove attribute based on condition
   */
  static toggleAttribute(t, e, n) {
    t && (n !== void 0 ? t.setAttribute(e, n) : t.removeAttribute(e));
  }
  /**
   * Get element's computed style property
   */
  static getComputedStyle(t, e) {
    return t ? window.getComputedStyle(t).getPropertyValue(e) : "";
  }
  /**
   * Check if element is visible in viewport
   */
  static isInViewport(t) {
    if (!t) return !1;
    const e = t.getBoundingClientRect();
    return e.top >= 0 && e.left >= 0 && e.bottom <= (window.innerHeight || document.documentElement.clientHeight) && e.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  /**
   * Get element's offset relative to document
   */
  static getElementOffset(t) {
    if (!t) return { top: 0, left: 0 };
    const e = t.getBoundingClientRect();
    return {
      top: e.top + window.pageYOffset,
      left: e.left + window.pageXOffset
    };
  }
  /**
   * Focus element safely with optional delay
   */
  static focus(t, e) {
    t && (e ? setTimeout(() => t.focus(), e) : t.focus());
  }
  /**
   * Scroll element into view safely
   */
  static scrollIntoView(t, e) {
    t && t.scrollIntoView(e || { block: "nearest" });
  }
  /**
   * Remove element from DOM safely
   */
  static removeElement(t) {
    t && t.parentNode && t.parentNode.removeChild(t);
  }
  /**
   * Create element with optional classes and attributes
   */
  static createElement(t, e) {
    const n = document.createElement(t);
    return e != null && e.classes && n.classList.add(...e.classes), e != null && e.attributes && Object.entries(e.attributes).forEach(([i, s]) => {
      n.setAttribute(i, s);
    }), e != null && e.textContent && (n.textContent = e.textContent), e != null && e.innerHTML && (n.innerHTML = e.innerHTML), n;
  }
}
class D {
  /**
   * Create and dispatch custom event
   */
  static dispatchCustomEvent(t, e, n, i) {
    const s = new CustomEvent(e, {
      detail: n,
      bubbles: (i == null ? void 0 : i.bubbles) ?? !0,
      cancelable: (i == null ? void 0 : i.cancelable) ?? !0
    });
    return t.dispatchEvent(s);
  }
  /**
   * Add event listener with automatic cleanup tracking
   */
  static addEventListener(t, e, n, i) {
    return t.addEventListener(e, n, i), () => {
      t.removeEventListener(e, n, i);
    };
  }
  /**
   * Handle generic events with delegation
   */
  static handleDelegatedEvent(t, e, n, i) {
    const s = i || document, a = (o) => {
      const l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(e)), c && n(c, o);
    };
    return this.addEventListener(s, t, a);
  }
  /**
   * Handle click events with delegation
   */
  static handleDelegatedClick(t, e, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(t)), c && e(c, o);
    };
    return this.addEventListener(i, "click", s);
  }
  /**
   * Handle keydown events with delegation
   */
  static handleDelegatedKeydown(t, e, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(t)), c && e(c, o);
    };
    return this.addEventListener(i, "keydown", s);
  }
  /**
   * Handle specific key presses
   */
  static handleKeyPress(t, e, n) {
    return (i) => {
      t.includes(i.key) && (n != null && n.preventDefault && i.preventDefault(), n != null && n.stopPropagation && i.stopPropagation(), e(i.key, i));
    };
  }
  /**
   * Handle input events with delegation
   */
  static handleDelegatedInput(t, e, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(t)), c && e(c, o);
    };
    return this.addEventListener(i, "input", s);
  }
  /**
   * Handle change events with delegation
   */
  static handleDelegatedChange(t, e, n) {
    const i = n || document, s = (a) => {
      const o = a.target;
      let l = null;
      o instanceof Element && (l = o.closest(t)), l && e(l, a);
    };
    return this.addEventListener(i, "change", s);
  }
  /**
   * Handle focus events with delegation
   */
  static handleDelegatedFocus(t, e, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(t)), c && e(c, o);
    };
    return this.addEventListener(i, "focusin", s);
  }
  /**
   * Create debounced event handler
   */
  static debounce(t, e) {
    let n = null;
    return (...i) => {
      n && clearTimeout(n), n = setTimeout(() => {
        t(...i);
      }, e);
    };
  }
  /**
   * Create throttled event handler
   */
  static throttle(t, e) {
    let n = !1;
    return (...i) => {
      n || (t(...i), n = !0, setTimeout(() => {
        n = !1;
      }, e));
    };
  }
  /**
   * Handle window resize with debouncing
   */
  static handleResize(t, e = 100) {
    const n = this.debounce(t, e);
    return this.addEventListener(window, "resize", n);
  }
  /**
   * Handle click outside element
   */
  static handleClickOutside(t, e) {
    const n = (i) => {
      const s = i, a = s.target;
      t.contains(a) || e(s);
    };
    return this.addEventListener(document, "click", n);
  }
  /**
   * Handle escape key globally
   */
  static handleEscape(t) {
    const e = this.handleKeyPress(["Escape"], (n, i) => t(i));
    return this.addEventListener(document, "keydown", (n) => e(n));
  }
  /**
   * Prevent default and stop propagation helper
   */
  static preventAndStop(t) {
    t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation();
  }
  /**
   * Check if event should be handled (not disabled/hidden)
   */
  static shouldHandleEvent(t) {
    return !t.hasAttribute("disabled") && t.dataset.disabled !== "true" && t.getAttribute("aria-disabled") !== "true" && t.offsetParent !== null;
  }
  /**
   * Handle form submission with validation
   */
  static handleFormSubmission(t, e, n) {
    const i = (s) => {
      const a = s;
      if (n && !n(t)) {
        s.preventDefault();
        return;
      }
      const o = new FormData(t);
      e(o, a);
    };
    return this.addEventListener(t, "submit", i);
  }
  /**
   * Create event cleanup manager
   */
  static createCleanupManager() {
    const t = [];
    return {
      add: (e) => {
        t.push(e);
      },
      cleanup: () => {
        t.forEach((e) => e()), t.length = 0;
      }
    };
  }
  /**
   * Common keyboard navigation handler
   */
  static createNavigationHandler(t) {
    return (e) => {
      var s, a, o, l, c, u, h, f, p, m, y;
      const { key: n } = e, i = ((s = t.preventDefault) == null ? void 0 : s.includes(n)) ?? !0;
      switch (n) {
        case "ArrowUp":
          i && e.preventDefault(), (a = t.onArrowUp) == null || a.call(t);
          break;
        case "ArrowDown":
          i && e.preventDefault(), (o = t.onArrowDown) == null || o.call(t);
          break;
        case "ArrowLeft":
          i && e.preventDefault(), (l = t.onArrowLeft) == null || l.call(t);
          break;
        case "ArrowRight":
          i && e.preventDefault(), (c = t.onArrowRight) == null || c.call(t);
          break;
        case "Enter":
          i && e.preventDefault(), (u = t.onEnter) == null || u.call(t);
          break;
        case " ":
          i && e.preventDefault(), (h = t.onSpace) == null || h.call(t);
          break;
        case "Escape":
          i && e.preventDefault(), (f = t.onEscape) == null || f.call(t);
          break;
        case "Home":
          i && e.preventDefault(), (p = t.onHome) == null || p.call(t);
          break;
        case "End":
          i && e.preventDefault(), (m = t.onEnd) == null || m.call(t);
          break;
        case "Tab":
          (y = t.onTab) == null || y.call(t);
          break;
      }
    };
  }
}
function Vu(r, t = "") {
  const e = window.KeysUITranslations;
  if (!e)
    return t;
  const n = r.split(".");
  let i = e;
  for (const s of n)
    if (i = i == null ? void 0 : i[s], i === void 0)
      return t;
  return i || t;
}
class Nc extends ht {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick(".input-action", (t, e) => {
      e.preventDefault(), this.handleActionClick(t);
    }), D.handleDelegatedKeydown(".input-action", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleActionClick(t));
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(t) {
    const e = b.findClosest(t, ".input-action"), n = e == null ? void 0 : e.dataset.action;
    if (!n) return;
    const i = b.findFormElementForAction(t);
    if (i) {
      switch (n) {
        case "clear":
          this.clearValue(i);
          break;
        case "copy":
          await this.copyToClipboard(i, e);
          break;
        case "toggle-password":
          await this.togglePasswordVisibility(i, t, e);
          break;
        case "external":
          this.openExternalUrl(t.dataset.url);
          break;
        default:
          this.handleCustomAction(i, n);
          break;
      }
      this.dispatchActionEvent(i, n);
    }
  }
  /**
   * Swap the icon using CSS classes and data attributes
   */
  async swapButtonIcon(t, e) {
    t.setAttribute("data-current-icon", e), this.updateButtonIconState(t, e);
  }
  /**
   * Update button icon state using Tailwind classes
   */
  updateButtonIconState(t, e) {
    const n = b.querySelector(".button-icon-default", t), i = b.querySelector(".button-icon-toggle", t), s = b.querySelector(".button-icon-success", t), a = t.dataset.iconDefault, o = t.dataset.iconToggle, l = t.dataset.iconSuccess;
    n && (n.classList.remove("opacity-100"), n.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), s && (s.classList.remove("opacity-100", "scale-110", "scale-90"), s.classList.add("opacity-0")), e === a && n ? (n.classList.remove("opacity-0"), n.classList.add("opacity-100")) : e === o && i ? (i.classList.remove("opacity-0"), i.classList.add("opacity-100")) : e === l && s && (s.classList.remove("opacity-0"), s.classList.add("opacity-100", "scale-110"));
  }
  /**
   * Animate icon success feedback using Tailwind classes
   */
  animateIconSuccess(t) {
    t.classList.add("scale-110"), setTimeout(() => {
      t.classList.remove("scale-110"), t.classList.add("scale-90"), setTimeout(() => {
        t.classList.remove("scale-90");
      }, 150);
    }, 150);
  }
  /**
   * Clear form element value
   */
  clearValue(t) {
    t.value = "", t.focus(), t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Copy form element value to clipboard
   */
  async copyToClipboard(t, e) {
    const n = b.querySelector("button", e);
    try {
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, Vu("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && await this.showCopySuccess(n, e);
    } catch {
      this.fallbackCopyToClipboard(t, e);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(t, e) {
    const n = b.querySelector("button", e);
    t.select(), t instanceof HTMLInputElement && t.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(t, Vu("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && this.showCopySuccess(n, e);
    } catch {
      this.showFeedback(t, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(t, e) {
    const n = t.dataset.iconSuccess, i = t.dataset.labelSuccess, s = t.dataset.iconDefault, a = b.querySelector(".sr-only", t);
    if (n && s)
      if (await this.swapButtonIcon(t, n), i && a) {
        const o = a.textContent;
        a.textContent = i, setTimeout(async () => {
          await this.swapButtonIcon(t, s), o && a && (a.textContent = o);
        }, 2e3);
      } else
        setTimeout(async () => {
          await this.swapButtonIcon(t, s);
        }, 2e3);
  }
  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(t, e, n) {
    var h;
    const i = t.type === "password", s = i ? "text" : "password", a = e.dataset.iconDefault, o = e.dataset.iconToggle, l = (h = b.querySelector(".sr-only", e)) == null ? void 0 : h.textContent, c = e.dataset.labelToggle;
    t.type = s;
    const u = b.querySelector(".sr-only", e);
    i ? (o && await this.swapButtonIcon(e, o), c && u && (u.textContent = c), e.setAttribute("aria-label", c || "Hide password")) : (a && await this.swapButtonIcon(e, a), l && u && (u.textContent = l), e.setAttribute("aria-label", l || "Show password"));
  }
  /**
   * Open external URL in new tab
   */
  openExternalUrl(t) {
    if (t)
      try {
        window.open(t, "_blank", "noopener,noreferrer");
      } catch (e) {
        console.error("Failed to open external URL:", e);
      }
  }
  /**
   * Handle custom actions
   */
  handleCustomAction(t, e) {
  }
  /**
   * Dispatch custom event for action
   */
  dispatchActionEvent(t, e) {
    D.dispatchCustomEvent(t, "form-action", {
      element: t,
      action: e,
      value: t.value
    });
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(t, e, n = "success") {
    const i = document.createElement("div");
    i.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${n === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, i.textContent = e;
    const s = b.findClosest(t, ".relative");
    s && (s.appendChild(i), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 2e3));
  }
  /**
   * Add a custom action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return D.addEventListener(document, "form-action", (n) => {
      const i = n;
      i.detail.action === t && e(i.detail.element);
    });
  }
  /**
   * Clean up FormActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Nc.getInstance();
class Mc extends ht {
  /**
   * Initialize alert elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-dismiss-alert]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), D.handleDelegatedKeydown("[data-dismiss-alert]", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleDismissClick(t));
    });
  }
  /**
   * Handle dismiss button click
   */
  handleDismissClick(t) {
    const e = this.findAlertForButton(t);
    e && (this.dismissAlert(e), this.dispatchAlertEvent(e, "dismiss"));
  }
  /**
   * Find the alert element associated with a dismiss button
   */
  findAlertForButton(t) {
    return b.findClosest(t, '[data-dismissible="true"]');
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(t) {
    t.classList.add("alert-dismissing"), AnimationUtils.slideOut(t, "right", {
      duration: 300,
      easing: "ease-out",
      distance: 100
    }), AnimationUtils.collapseHeight(t, {
      toHeight: 0,
      duration: 300,
      easing: "ease-out",
      onComplete: () => {
        t.parentNode && t.parentNode.removeChild(t);
      }
    });
  }
  /**
   * Show an alert programmatically
   */
  showAlert(t) {
    t.style.display = "block", AnimationUtils.slideIn(t, "right", {
      duration: 300,
      easing: "ease-out",
      distance: 100,
      onComplete: () => {
        this.dispatchAlertEvent(t, "show");
      }
    });
  }
  /**
   * Create and show a new alert dynamically
   */
  createAlert(t) {
    const {
      variant: e = "info",
      title: n,
      message: i,
      dismissible: s = !0,
      duration: a,
      container: o = document.body
    } = t, l = document.createElement("div");
    l.className = this.getAlertClasses(e), l.setAttribute("role", "alert"), s && l.setAttribute("data-dismissible", "true");
    const c = this.buildAlertContent(e, n, i, s);
    return l.innerHTML = c, o.appendChild(l), l.style.opacity = "0", l.style.transform = "translateX(100%)", setTimeout(() => {
      this.showAlert(l);
    }, 10), a && a > 0 && AnimationUtils.createTimer(() => {
      this.dismissAlert(l);
    }, a), this.dispatchAlertEvent(l, "create"), l;
  }
  /**
   * Get CSS classes for alert variant
   */
  getAlertClasses(t) {
    const e = "rounded-lg border p-4 space-y-3", n = {
      info: "bg-info/5 border-info/20 text-info-foreground",
      success: "bg-success/5 border-success/20 text-success-foreground",
      warning: "bg-warning/5 border-warning/20 text-warning-foreground",
      danger: "bg-danger/5 border-danger/20 text-danger-foreground",
      neutral: "bg-neutral/5 border-neutral/20 text-neutral-foreground"
    };
    return `${e} ${n[t] || n.info}`;
  }
  /**
   * Build alert content HTML
   */
  buildAlertContent(t, e, n, i) {
    const s = this.getVariantIcon(t), a = this.getVariantIconColor(t);
    return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${a}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(s)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${e ? `<div class="text-base font-medium">${e}</div>` : ""}
                    <div class="text-sm opacity-90 ${e ? "mt-1" : ""}">${n || ""}</div>
                </div>
                ${i ? `
                    <div class="ml-auto pl-3">
                        <button type="button" data-dismiss-alert class="inline-flex rounded-md p-1 ${a} hover:bg-current hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current" aria-label="Dismiss">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                ` : ""}
            </div>
        `;
  }
  /**
   * Get icon name for variant
   */
  getVariantIcon(t) {
    const e = {
      info: "information-circle",
      success: "check-circle",
      warning: "exclamation-triangle",
      danger: "x-circle",
      neutral: "chat-bubble-left-ellipsis"
    };
    return e[t] || e.info;
  }
  /**
   * Get icon color for variant
   */
  getVariantIconColor(t) {
    const e = {
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      neutral: "text-neutral"
    };
    return e[t] || e.info;
  }
  /**
   * Get SVG path for icon
   */
  getIconSvg(t) {
    const e = {
      "information-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      "check-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      "exclamation-triangle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
      "x-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      "chat-bubble-left-ellipsis": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
    };
    return e[t] || e["information-circle"];
  }
  /**
   * Dispatch custom event for alert action
   */
  dispatchAlertEvent(t, e) {
    D.dispatchCustomEvent(t, "alert-action", {
      alert: t,
      action: e
    }), D.dispatchCustomEvent(document.body, "alert-action", {
      alert: t,
      action: e
    });
  }
  /**
   * Add a custom alert action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return D.addEventListener(document, "alert-action", (n) => {
      const i = n;
      i.detail.action === t && e(i.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(t) {
    b.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((n) => {
      this.dismissAlert(n);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    b.querySelectorAll('[data-dismissible="true"]').forEach((e) => {
      this.dismissAlert(e);
    });
  }
  /**
   * Clean up AlertActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Mc.getInstance();
class qc extends ht {
  /**
   * Initialize badge elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-dismiss-target]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), D.handleDelegatedKeydown("[data-dismiss-target]", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleDismissClick(t));
    });
  }
  /**
   * Handle dismiss button click
   */
  handleDismissClick(t) {
    const e = this.findBadgeForButton(t);
    e && (this.dismissBadge(e), this.dispatchBadgeEvent(e, "dismiss"));
  }
  /**
   * Find the badge element associated with a dismiss button
   */
  findBadgeForButton(t) {
    const e = t.getAttribute("data-dismiss-target");
    if (!e) return null;
    const n = e.startsWith("#") ? e.slice(1) : e;
    return b.querySelector(`#${n}`);
  }
  /**
   * Dismiss a badge with smooth animation
   */
  dismissBadge(t) {
    t.classList.add("badge-dismissing"), t.style.transition = "all 250ms ease-out", t.style.transform = "scale(0.8)", t.style.opacity = "0", setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t);
    }, 250);
  }
  /**
   * Show a badge programmatically
   */
  showBadge(t) {
    t.style.display = "inline-flex", t.style.opacity = "0", t.style.transform = "scale(0.8)", setTimeout(() => {
      t.style.transition = "all 250ms ease-out", t.style.opacity = "1", t.style.transform = "scale(1)", this.dispatchBadgeEvent(t, "show");
    }, 10);
  }
  /**
   * Create and show a new badge dynamically
   */
  createBadge(t) {
    const {
      variant: e = "simple",
      color: n = "blue",
      size: i = "sm",
      text: s,
      icon: a,
      dismissible: o = !1,
      container: l = document.body
    } = t, c = document.createElement(o ? "button" : "span"), u = o ? `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : void 0;
    c.className = this.getBadgeClasses(e, n, i), u && (c.id = u), o && (c.setAttribute("type", "button"), c.setAttribute("data-dismiss-target", `#${u}`), c.setAttribute("aria-label", "Remove badge"));
    const h = this.buildBadgeContent(s, a, o);
    return c.innerHTML = h, l.appendChild(c), c.style.opacity = "0", c.style.transform = "scale(0.8)", setTimeout(() => {
      this.showBadge(c);
    }, 10), this.dispatchBadgeEvent(c, "create"), c;
  }
  /**
   * Get CSS classes for badge
   */
  getBadgeClasses(t, e, n) {
    const i = "inline-flex items-center font-medium", s = {
      xs: "px-1.5 py-0.5 text-xs",
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-3 py-1 text-sm"
    }, a = {
      simple: "rounded-full",
      chip: "rounded-sm",
      subtle: ""
    }, o = this.getColorClasses(t, e);
    return `${i} ${s[n] || s.sm} ${a[t] || a.simple} ${o}`;
  }
  /**
   * Get color classes for badge
   */
  getColorClasses(t, e) {
    if (t === "subtle") {
      const i = {
        brand: "text-brand",
        success: "text-success",
        warning: "text-warning",
        danger: "text-danger",
        neutral: "text-neutral",
        blue: "text-blue-600",
        green: "text-green-600",
        red: "text-red-600",
        purple: "text-purple-600",
        yellow: "text-yellow-600"
      };
      return i[e] || i.blue;
    }
    const n = {
      brand: "bg-brand/10 text-brand",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      danger: "bg-danger/10 text-danger",
      neutral: "bg-neutral/10 text-neutral",
      blue: "bg-blue-500/10 text-blue-600",
      green: "bg-green-500/10 text-green-600",
      red: "bg-red-500/10 text-red-600",
      purple: "bg-purple-500/10 text-purple-600",
      yellow: "bg-yellow-500/10 text-yellow-600"
    };
    return n[e] || n.blue;
  }
  /**
   * Build badge content HTML
   */
  buildBadgeContent(t, e, n) {
    let i = "";
    return e && (i += `<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <!-- Icon would be rendered here -->
            </svg>`), i += t, n && (i += `<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`), i;
  }
  /**
   * Dispatch custom event for badge action
   */
  dispatchBadgeEvent(t, e) {
    D.dispatchCustomEvent(t, "badge-action", {
      badge: t,
      action: e
    }), D.dispatchCustomEvent(document.body, "badge-action", {
      badge: t,
      action: e
    });
  }
  /**
   * Add a custom badge action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return D.addEventListener(document, "badge-action", (n) => {
      const i = n;
      i.detail.action === t && e(i.detail.badge);
    });
  }
  /**
   * Dismiss all badges of a specific color
   */
  dismissAllByColor(t) {
    b.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((n) => {
      this.dismissBadge(n);
    });
  }
  /**
   * Dismiss all dismissible badges
   */
  dismissAll() {
    b.querySelectorAll("[data-dismiss-target]").forEach((e) => {
      const n = this.findBadgeForButton(e);
      n && this.dismissBadge(n);
    });
  }
  /**
   * Clean up BadgeActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
qc.getInstance();
const Pa = class Pa {
  /**
   * Format Date object to string using custom format
   */
  static formatDate(t, e) {
    if (!t || isNaN(t.getTime()))
      return "";
    const n = t.getFullYear(), i = t.getMonth() + 1, s = t.getDate(), a = {
      Y: String(n),
      y: String(n).slice(-2),
      F: this.MONTH_NAMES[i - 1],
      M: this.MONTH_NAMES_SHORT[i - 1],
      m: String(i).padStart(2, "0"),
      n: String(i),
      d: String(s).padStart(2, "0"),
      j: String(s)
    };
    let o = e;
    for (const [l, c] of Object.entries(a))
      o = o.replace(new RegExp(l, "g"), c);
    return o;
  }
  /**
   * Format Date object to YYYY-MM-DD string
   */
  static formatDateString(t) {
    if (!t || isNaN(t.getTime()))
      return "";
    const e = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0");
    return `${e}-${n}-${i}`;
  }
  /**
   * Parse date string to Date object
   */
  static parseDate(t) {
    if (!t || typeof t != "string" || !t.trim())
      return null;
    try {
      const e = new Date(t);
      return isNaN(e.getTime()) ? null : e;
    } catch {
      return null;
    }
  }
  /**
   * Format date for display using specified format
   */
  static formatDateForDisplay(t, e) {
    if (!t) return "";
    const n = this.parseDate(t);
    return n ? this.formatDate(n, e) : "";
  }
  /**
   * Format date range for display
   */
  static formatRangeForDisplay(t, e, n, i = " - ") {
    if (!t) return "";
    const s = this.formatDateForDisplay(t, n), a = e ? this.formatDateForDisplay(e, n) : "";
    return a ? `${s}${i}${a}` : s;
  }
  /**
   * Format date range for form submission
   */
  static formatRangeForSubmission(t, e, n = "Y-m-d") {
    if (!t) return null;
    const i = this.formatDateForSubmission(t, n), s = e ? this.formatDateForSubmission(e, n) : "";
    return s ? `${i},${s}` : i;
  }
  /**
   * Format single date for form submission
   */
  static formatDateForSubmission(t, e = "Y-m-d") {
    if (!t) return "";
    const n = this.parseDate(t);
    return n ? this.formatDate(n, e) : "";
  }
  /**
   * Add days to a date string
   */
  static addDaysToDate(t, e) {
    const n = this.parseDate(t);
    return n ? (n.setDate(n.getDate() + e), this.formatDateString(n)) : t;
  }
  /**
   * Add months to a date string
   */
  static addMonthsToDate(t, e) {
    const n = this.parseDate(t);
    return n ? (n.setMonth(n.getMonth() + e), this.formatDateString(n)) : t;
  }
  /**
   * Get first day of month for a date string
   */
  static getFirstDayOfMonth(t) {
    const e = this.parseDate(t);
    return e ? (e.setDate(1), this.formatDateString(e)) : t;
  }
  /**
   * Get last day of month for a date string
   */
  static getLastDayOfMonth(t) {
    const e = this.parseDate(t);
    return e ? (e.setMonth(e.getMonth() + 1, 0), this.formatDateString(e)) : t;
  }
  /**
   * Get current year-month string (YYYY-MM)
   */
  static getCurrentYearMonth() {
    const t = /* @__PURE__ */ new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
  }
  /**
   * Get today's date string (YYYY-MM-DD)
   */
  static getTodayDate() {
    return this.formatDateString(/* @__PURE__ */ new Date());
  }
  /**
   * Check if date string is today
   */
  static isToday(t) {
    return t === this.getTodayDate();
  }
  /**
   * Check if a date is within a range
   */
  static isDateInRange(t, e, n) {
    if (!e || !n) return !1;
    const i = this.parseDate(t), s = this.parseDate(e), a = this.parseDate(n);
    return !i || !s || !a ? !1 : i >= s && i <= a;
  }
  /**
   * Check if a date matches start of range
   */
  static isDateRangeStart(t, e) {
    return e === t;
  }
  /**
   * Check if a date matches end of range
   */
  static isDateRangeEnd(t, e) {
    return e === t;
  }
  /**
   * Get placeholder text for date format
   */
  static getFormatPlaceholder(t) {
    return {
      "Y-m-d": "YYYY-MM-DD",
      "Y/m/d": "YYYY/MM/DD",
      "d-m-Y": "DD-MM-YYYY",
      "d/m/Y": "DD/MM/YYYY",
      "m/d/Y": "MM/DD/YYYY",
      "m-d-Y": "MM-DD-YYYY",
      "F j, Y": "Month DD, YYYY",
      "M j, Y": "Mon DD, YYYY",
      "j F Y": "DD Month YYYY"
    }[t] || "YYYY-MM-DD";
  }
  /**
   * Parse input date string with multiple format support
   */
  static parseInputDate(t, e) {
    if (!t || !t.trim()) return null;
    try {
      const n = new Date(t);
      if (!isNaN(n.getTime()))
        return n;
    } catch {
    }
    return null;
  }
  /**
   * Create ARIA label for date with contextual information
   */
  static createDateAriaLabel(t, e = !1, n = !1, i = !1, s = !1, a = !1) {
    const o = this.parseDate(t);
    if (!o) return t;
    let c = o.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return e && (c += ", Today"), n ? c += ", Selected" : i ? c += ", Range start" : s ? c += ", Range end" : a && (c += ", In selected range"), c;
  }
  /**
   * Validate date string format
   */
  static isValidDateString(t) {
    const e = this.parseDate(t);
    return e !== null && !isNaN(e.getTime());
  }
  /**
   * Compare two date strings
   */
  static compareDates(t, e) {
    const n = this.parseDate(t), i = this.parseDate(e);
    return !n || !i ? 0 : n.getTime() - i.getTime();
  }
  /**
   * Get quick selector date ranges
   */
  static getQuickSelectorDate(t) {
    const e = /* @__PURE__ */ new Date();
    let n = null, i = null;
    switch (t) {
      case "today":
        n = e, i = e;
        break;
      case "yesterday":
        n = new Date(e), n.setDate(e.getDate() - 1), i = n;
        break;
      case "last7days":
        i = e, n = new Date(e), n.setDate(e.getDate() - 6);
        break;
      case "last30days":
        i = e, n = new Date(e), n.setDate(e.getDate() - 29);
        break;
      case "thismonth":
        n = new Date(e.getFullYear(), e.getMonth(), 1), i = new Date(e.getFullYear(), e.getMonth() + 1, 0);
        break;
      case "lastmonth":
        n = new Date(e.getFullYear(), e.getMonth() - 1, 1), i = new Date(e.getFullYear(), e.getMonth(), 0);
        break;
      case "thisyear":
        n = new Date(e.getFullYear(), 0, 1), i = new Date(e.getFullYear(), 11, 31);
        break;
    }
    return { start: n, end: i };
  }
};
Pa.MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
], Pa.MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
let $t = Pa;
class Ur extends ht {
  /**
   * Initialize calendar elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("calendar", "true").forEach((t) => {
      this.initializeCalendar(t);
    });
  }
  /**
   * Initialize a single calendar element
   */
  initializeCalendar(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.calendarData, n = t.dataset.disabled === "true";
    let i;
    try {
      i = e ? JSON.parse(e) : {};
    } catch (a) {
      console.error("Failed to parse calendar data:", a), i = {};
    }
    const s = {
      currentMonth: i.currentMonth || this.getCurrentYearMonth(),
      selectedDate: i.selectedDate || null,
      startDate: i.startDate || null,
      endDate: i.endDate || null,
      focusedDate: i.selectedDate || i.startDate || this.getTodayDate(),
      isRange: i.isRange || !1,
      monthsToShow: i.monthsToShow || 1,
      rangeSelectionState: "none",
      isDisabled: n,
      minDate: i.minDate || null,
      maxDate: i.maxDate || null,
      disabledDates: i.disabledDates || [],
      weekdays: i.weekdays || ["S", "M", "T", "W", "T", "F", "S"],
      monthNames: i.monthNames || [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      viewMode: "calendar"
    };
    this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-calendar-date]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault(), e.stopPropagation();
        const n = b.findClosest(t, '[data-calendar="true"]');
        n && !this.isCalendarDisabled(n) && this.selectDate(n, t.dataset.calendarDate);
      }
    }), D.handleDelegatedClick("[data-calendar-nav]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const n = b.findClosest(t, '[data-calendar="true"]'), i = t.dataset.calendarNav;
        n && !this.isCalendarDisabled(n) && this.navigateMonth(n, i);
      }
    }), D.handleDelegatedClick("[data-calendar-action]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const n = b.findClosest(t, '[data-calendar="true"]'), i = t.dataset.calendarAction;
        n && !this.isCalendarDisabled(n) && this.handleFooterAction(n, i);
      }
    }), D.handleDelegatedClick("[data-calendar-month-year-btn]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const n = b.findClosest(t, '[data-calendar="true"]');
        n && !this.isCalendarDisabled(n) && this.toggleMonthYearDropdown(n);
      }
    }), D.handleDelegatedClick("[data-calendar-month]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-calendar="true"]'), i = parseInt(t.dataset.calendarMonth);
      n && !this.isCalendarDisabled(n) && this.selectMonth(n, i);
    }), D.handleDelegatedClick("[data-calendar-year]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-calendar="true"]'), i = parseInt(t.dataset.calendarYear);
      n && !this.isCalendarDisabled(n) && this.selectYear(n, i);
    }), D.handleDelegatedKeydown('[data-calendar="true"]', (t, e) => {
      if (e.key === "Escape") {
        const n = this.getState(t);
        if (n && n.viewMode !== "calendar") {
          e.preventDefault(), n.viewMode = "calendar", this.setState(t, n), this.renderCalendarGrid(t);
          const i = b.querySelector("[data-calendar-month-year-btn]", t);
          i && i.focus();
          return;
        }
      }
      this.handleKeydown(t, e);
    }), D.handleDelegatedFocus("[data-calendar-date]", (t) => {
      const e = b.findClosest(t, '[data-calendar="true"]');
      if (e) {
        const n = this.getState(e);
        n && (n.focusedDate = t.dataset.calendarDate, this.setState(e, n));
      }
    });
  }
  /**
   * Setup dynamic observer for new calendars - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "calendar", "true") && this.initializeCalendar(n), b.findByDataAttribute("calendar", "true", n).forEach((i) => {
            this.initializeCalendar(i);
          });
        }
      });
    });
  }
  /**
   * Select a date (handles both single date and range selection)
   */
  selectDate(t, e) {
    const n = this.getState(t);
    !n || n.isDisabled || (n.isRange ? this.handleRangeSelection(t, e) : (n.selectedDate = e, n.focusedDate = e, this.setState(t, n), this.renderCalendarGrid(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:dateSelected", {
      selectedDate: e,
      formattedDate: this.formatDateForDisplay(e)
    })));
  }
  /**
   * Handle range selection logic
   */
  handleRangeSelection(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = new Date(e);
    if (n.rangeSelectionState === "none" || n.rangeSelectionState === "selecting-start")
      n.startDate = e, n.endDate = null, n.rangeSelectionState = "selecting-end", n.focusedDate = e;
    else if (n.rangeSelectionState === "selecting-end") {
      const s = new Date(n.startDate);
      i < s ? (n.endDate = n.startDate, n.startDate = e) : n.endDate = e, n.rangeSelectionState = "none", n.focusedDate = e;
    }
    this.setState(t, n), this.renderCalendarGrid(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:rangeSelected", {
      startDate: n.startDate,
      endDate: n.endDate,
      formattedRange: this.formatRangeForDisplay(n.startDate, n.endDate)
    });
  }
  /**
   * Format range for display
   */
  formatRangeForDisplay(t, e) {
    return !t && !e ? "" : t && !e ? this.formatDateForDisplay(t) : !t && e ? this.formatDateForDisplay(e) : `${this.formatDateForDisplay(t)} - ${this.formatDateForDisplay(e)}`;
  }
  /**
   * Check if a date is in range
   */
  isDateInRange(t, e, n) {
    if (!e || !n) return !1;
    const i = new Date(t), s = new Date(e), a = new Date(n);
    return i >= s && i <= a;
  }
  /**
   * Check if a date is range start
   */
  isDateRangeStart(t, e) {
    return e === t;
  }
  /**
   * Check if a date is range end
   */
  isDateRangeEnd(t, e) {
    return e === t;
  }
  /**
   * Navigate to previous or next month
   */
  navigateMonth(t, e) {
    const n = this.getState(t);
    if (!n || n.isDisabled) return;
    const [i, s] = n.currentMonth.split("-").map(Number), a = new Date(i, s - 1, 1);
    e === "prev" ? a.setMonth(a.getMonth() - 1) : a.setMonth(a.getMonth() + 1);
    const o = `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}`;
    n.currentMonth = o, this.setState(t, n), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: o,
      year: a.getFullYear(),
      month: a.getMonth() + 1
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const n = this.getState(t);
    if (!n || n.isDisabled) return;
    const i = n.focusedDate;
    if (!i) return;
    let s = null;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault(), s = this.addDaysToDate(i, -1);
        break;
      case "ArrowRight":
        e.preventDefault(), s = this.addDaysToDate(i, 1);
        break;
      case "ArrowUp":
        e.preventDefault(), s = this.addDaysToDate(i, -7);
        break;
      case "ArrowDown":
        e.preventDefault(), s = this.addDaysToDate(i, 7);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.selectDate(t, i);
        return;
      case "Home":
        e.preventDefault(), s = this.getFirstDayOfMonth(i);
        break;
      case "End":
        e.preventDefault(), s = this.getLastDayOfMonth(i);
        break;
      case "PageUp":
        e.preventDefault(), s = this.addMonthsToDate(i, e.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        e.preventDefault(), s = this.addMonthsToDate(i, e.shiftKey ? 12 : 1);
        break;
    }
    s && this.focusDate(t, s);
  }
  /**
   * Generate calendar grid for a given month
   */
  generateCalendarGrid(t) {
    const e = this.getState(t);
    if (!e) return [];
    const [n, i] = e.currentMonth.split("-").map(Number), s = new Date(n, i - 1, 1), a = new Date(n, i, 0), o = new Date(s);
    o.setDate(o.getDate() - o.getDay());
    const l = new Date(a);
    l.setDate(l.getDate() + (6 - l.getDay()));
    const c = [], u = new Date(o);
    for (; u <= l; ) {
      const f = this.formatDateString(u), p = u.getMonth() === i - 1 && u.getFullYear() === n, m = {
        date: f,
        day: u.getDate(),
        isCurrentMonth: p,
        isToday: this.isToday(f),
        isSelected: f === e.selectedDate,
        isDisabled: this.isDateDisabled(t, u)
      };
      e.isRange && (m.isInRange = this.isDateInRange(f, e.startDate, e.endDate), m.isRangeStart = this.isDateRangeStart(f, e.startDate), m.isRangeEnd = this.isDateRangeEnd(f, e.endDate), m.isSelected = m.isRangeStart || m.isRangeEnd), c.push(m), u.setDate(u.getDate() + 1);
    }
    const h = [];
    for (let f = 0; f < c.length; f += 7)
      h.push(c.slice(f, f + 7));
    return h;
  }
  /**
   * Check if a date is disabled
   */
  isDateDisabled(t, e) {
    const n = this.getState(t);
    if (!n || n.isDisabled) return !0;
    const i = this.formatDateString(e);
    return n.minDate && i < n.minDate || n.maxDate && i > n.maxDate ? !0 : n.disabledDates.includes(i);
  }
  /**
   * Render calendar grid to DOM (supports multiple months)
   */
  renderCalendarGrid(t) {
    const e = this.getState(t);
    e && (e.monthsToShow > 1 ? this.renderMultipleMonths(t) : this.renderSingleMonth(t));
  }
  /**
   * Render single month view
   */
  renderSingleMonth(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector("[data-calendar-grid-container]", t);
    if (!n) return;
    const i = this.generateCalendarGrid(t);
    let s = '<table class="w-full" role="grid" aria-label="Calendar">';
    s += '<thead><tr role="row">', e.weekdays.forEach((a) => {
      const l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(a)];
      s += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${l}">${a}</th>`;
    }), s += "</tr></thead>", s += "<tbody>", i.forEach((a) => {
      s += '<tr role="row">', a.forEach((o) => {
        const l = this.getDayButtonClasses(o), c = $t.createDateAriaLabel(o.date, o.isToday, o.isSelected, o.isRangeStart, o.isRangeEnd, o.isInRange), u = this.getRangeAttributes(o, e);
        s += `
                    <td class="calendar-day text-center relative" role="gridcell">
                        <button type="button"
                                class="${l}"
                                data-calendar-date="${o.date}"
                                data-is-current-month="${o.isCurrentMonth}"
                                ${o.isDisabled ? "disabled" : ""}
                                aria-selected="${o.isSelected}"
                                aria-label="${c}"
                                data-is-today="${o.isToday}"
                                ${u}>
                            ${o.day}
                        </button>
                    </td>
                `;
      }), s += "</tr>";
    }), s += "</tbody></table>", n.innerHTML = s;
  }
  /**
   * Get cell classes based on calendar size
   */
  getCellClasses(t) {
    return "";
  }
  /**
   * Get button classes for a day
   */
  getDayButtonClasses(t) {
    let e = "flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1";
    return t.isCurrentMonth ? t.isDisabled ? e += " text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50" : t.isSelected ? t.isInRange || t.isRangeStart || t.isRangeEnd ? e += " font-semibold" : e += " bg-brand text-foreground-brand font-semibold" : t.isToday ? e += " bg-brand/10 text-brand font-semibold border border-brand/20" : t.isInRange ? e += " text-foreground" : e += " text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800" : e += " text-neutral-400 dark:text-neutral-600", e;
  }
  /**
   * Update month/year display
   */
  updateMonthYearDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const [n, i] = e.currentMonth.split("-").map(Number), a = `${e.monthNames[i - 1]} ${n}`, o = b.querySelector(".calendar-month-year-display", t);
    o && (o.textContent = a);
  }
  /**
   * Toggle between calendar, month, and year views
   */
  toggleMonthYearDropdown(t) {
    const e = this.getState(t);
    if (e) {
      switch (e.viewMode) {
        case "calendar":
          e.viewMode = "month", this.renderMonthGrid(t);
          break;
        case "month":
          e.viewMode = "year", this.renderYearGrid(t);
          break;
        case "year":
          e.viewMode = "calendar", this.renderCalendarGrid(t);
          break;
      }
      this.setState(t, e);
    }
  }
  /**
   * Render month selection grid
   */
  renderMonthGrid(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector("[data-calendar-grid-container]", t);
    if (!n) return;
    const [i, s] = e.currentMonth.split("-").map(Number);
    let a = '<div class="month-grid grid grid-cols-3 gap-1 p-2">';
    e.monthNames.forEach((o, l) => {
      const c = l + 1, u = c === s, h = this.isMonthDisabled(t, i, c);
      a += `
                <button type="button"
                        class="month-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${u ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${h ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-month="${c}"
                        ${h ? "disabled" : ""}>
                    ${o}
                </button>
            `;
    }), a += "</div>", this.animateViewTransition(n, a);
  }
  /**
   * Render year selection grid
   */
  renderYearGrid(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector("[data-calendar-grid-container]", t);
    if (!n) return;
    const [i] = e.currentMonth.split("-").map(Number), s = i - 10, a = i + 10;
    let o = '<div class="year-grid grid grid-cols-4 gap-1 p-2 max-h-64 overflow-y-auto">';
    for (let l = s; l <= a; l++) {
      const c = l === i, u = this.isYearDisabled(t, l);
      o += `
                <button type="button"
                        class="year-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${c ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${u ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-year="${l}"
                        ${u ? "disabled" : ""}>
                    ${l}
                </button>
            `;
    }
    o += "</div>", n.innerHTML = o;
  }
  /**
   * Select a month
   */
  selectMonth(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const [i] = n.currentMonth.split("-").map(Number), s = `${i}-${String(e).padStart(2, "0")}`;
    n.currentMonth = s, n.viewMode = "calendar", this.setState(t, n), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: s,
      year: i,
      month: e
    });
  }
  /**
   * Select a year
   */
  selectYear(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const [, i] = n.currentMonth.split("-").map(Number), s = `${e}-${String(i).padStart(2, "0")}`;
    n.currentMonth = s, n.viewMode = "calendar", this.setState(t, n), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: s,
      year: e,
      month: i
    });
  }
  /**
   * Check if a month is disabled
   */
  isMonthDisabled(t, e, n) {
    const i = this.getState(t);
    if (!i) return !1;
    const s = `${e}-${String(n).padStart(2, "0")}-01`, a = new Date(e, n, 0).getDate(), o = `${e}-${String(n).padStart(2, "0")}-${String(a).padStart(2, "0")}`;
    return !!(i.minDate && o < i.minDate || i.maxDate && s > i.maxDate);
  }
  /**
   * Check if a year is disabled
   */
  isYearDisabled(t, e) {
    const n = this.getState(t);
    if (!n) return !1;
    const i = `${e}-01-01`, s = `${e}-12-31`;
    return !!(n.minDate && s < n.minDate || n.maxDate && i > n.maxDate);
  }
  /**
   * Focus a specific date
   */
  focusDate(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const [i, s] = e.split("-").map(Number), [a, o] = n.currentMonth.split("-").map(Number);
    if (i !== a || s !== o) {
      const l = `${i}-${String(s).padStart(2, "0")}`;
      n.currentMonth = l, this.setState(t, n), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
        currentMonth: l,
        year: i,
        month: s
      });
    }
    n.focusedDate = e, this.setState(t, n), AnimationUtils.createTimer(() => {
      const l = t.querySelector(`[data-calendar-date="${e}"]`);
      l && l.focus();
    }, 10);
  }
  /**
   * Update calendar visual display
   */
  updateCalendarDisplay(t) {
    this.renderCalendarGrid(t);
  }
  /**
   * Utility: Add days to a date string
   */
  addDaysToDate(t, e) {
    const n = new Date(t);
    return n.setDate(n.getDate() + e), this.formatDateString(n);
  }
  /**
   * Utility: Add months to a date string
   */
  addMonthsToDate(t, e) {
    const n = new Date(t);
    return n.setMonth(n.getMonth() + e), this.formatDateString(n);
  }
  /**
   * Utility: Get first day of month for a date string
   */
  getFirstDayOfMonth(t) {
    const e = new Date(t);
    return e.setDate(1), this.formatDateString(e);
  }
  /**
   * Utility: Get last day of month for a date string
   */
  getLastDayOfMonth(t) {
    const e = new Date(t);
    return e.setMonth(e.getMonth() + 1, 0), this.formatDateString(e);
  }
  /**
   * Utility: Format Date object to YYYY-MM-DD string
   */
  formatDateString(t) {
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }
  /**
   * Utility: Get current year-month string
   */
  getCurrentYearMonth() {
    const t = /* @__PURE__ */ new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
  }
  /**
   * Utility: Get today's date string
   */
  getTodayDate() {
    return this.formatDateString(/* @__PURE__ */ new Date());
  }
  /**
   * Utility: Check if date string is today
   */
  isToday(t) {
    return t === this.getTodayDate();
  }
  /**
   * Animate view transitions for smooth UX
   */
  animateViewTransition(t, e) {
    t.style.opacity = "0.7", t.style.transform = "scale(0.98)", AnimationUtils.createTimer(() => {
      t.innerHTML = e, t.style.opacity = "1", t.style.transform = "scale(1)";
    }, 100);
  }
  /**
   * Utility: Format date for display
   */
  formatDateForDisplay(t) {
    return new Date(t).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  /**
   * Check if calendar is disabled
   */
  isCalendarDisabled(t) {
    const e = this.getState(t);
    return e ? e.isDisabled : !1;
  }
  /**
   * Dispatch custom calendar event
   */
  dispatchCalendarEvent(t, e, n = null) {
    D.dispatchCustomEvent(t, e, {
      calendar: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Get calendar state (for external access)
   */
  getCalendarState(t) {
    return this.getState(t) || null;
  }
  /**
   * Set selected date programmatically
   */
  setSelectedDate(t, e) {
    const n = this.getState(t);
    n && (n.selectedDate = e, e && (n.focusedDate = e), this.setState(t, n), this.updateCalendarDisplay(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:dateSelected", {
      selectedDate: e,
      formattedDate: e ? this.formatDateForDisplay(e) : null
    }));
  }
  /**
   * Render multiple months view
   */
  renderMultipleMonths(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelectorAll("[data-calendar-grid-container]", t);
    if (n.length === 0) return;
    const i = /* @__PURE__ */ new Date(e.currentMonth + "-01");
    n.forEach((s, a) => {
      const o = new Date(i);
      o.setMonth(i.getMonth() + a);
      const l = {
        ...e,
        currentMonth: `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`
      }, c = this.generateCalendarGridForMonth(t, l, a, n.length);
      let u = `<div class="calendar-month-header">${e.monthNames[o.getMonth()]} ${o.getFullYear()}</div>`;
      u += '<table class="w-full" role="grid" aria-label="Calendar">', u += '<thead><tr role="row">', e.weekdays.forEach((h) => {
        const p = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(h)];
        u += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${p}">${h}</th>`;
      }), u += "</tr></thead>", u += "<tbody>", c.forEach((h) => {
        u += '<tr role="row">', h.forEach((f) => {
          const p = this.getDayButtonClasses(f), m = $t.createDateAriaLabel(f.date, f.isToday, f.isSelected, f.isRangeStart, f.isRangeEnd, f.isInRange), y = this.getRangeAttributes(f, e);
          u += `
                        <td class="calendar-day text-center relative" role="gridcell">
                            <button type="button"
                                    class="${p}"
                                    data-calendar-date="${f.date}"
                                    data-is-current-month="${f.isCurrentMonth}"
                                    ${f.isDisabled ? "disabled" : ""}
                                    aria-selected="${f.isSelected}"
                                    aria-label="${m}"
                                    data-is-today="${f.isToday}"
                                    ${y}>
                                ${f.day}
                            </button>
                        </td>
                    `;
        }), u += "</tr>";
      }), u += "</tbody></table>", s.innerHTML = u;
    });
  }
  /**
   * Generate calendar grid for a specific month
   */
  generateCalendarGridForMonth(t, e, n = 0, i = 1) {
    const s = this.getState(t);
    if (!s) return [];
    this.setState(t, { ...s, currentMonth: e.currentMonth });
    let a = this.generateCalendarGrid(t);
    return i > 1 && n < i - 1 && a[a.length - 1].some((c) => !c.isCurrentMonth && c.day <= 15) && (a = a.slice(0, -1)), this.setState(t, s), a;
  }
  /**
   * Get range attributes for a day button
   */
  getRangeAttributes(t, e) {
    if (!e.isRange) return "";
    const n = [];
    return t.isInRange && n.push('data-is-in-range="true"'), t.isRangeStart && n.push('data-is-range-start="true"'), t.isRangeEnd && n.push('data-is-range-end="true"'), n.join(" ");
  }
  /**
   * Update hidden input for range selection
   */
  updateHiddenInput(t) {
    const e = this.getState(t);
    if (e)
      if (e.isRange) {
        const n = b.querySelector(".calendar-start-input", t), i = b.querySelector(".calendar-end-input", t), s = b.querySelector(".calendar-range-input", t);
        if (n && (n.value = e.startDate || ""), i && (i.value = e.endDate || ""), s) {
          const a = e.startDate && e.endDate ? `${e.startDate},${e.endDate}` : e.startDate || "";
          s.value = a;
        }
      } else {
        const n = b.querySelector(".calendar-hidden-input", t);
        n && (n.value = e.selectedDate || "");
      }
  }
  /**
   * Clear all selected dates (both single and range modes)
   */
  clearSelection(t) {
    const e = this.getState(t);
    !e || e.isDisabled || (e.selectedDate = null, e.startDate = null, e.endDate = null, e.focusedDate = null, this.setState(t, e), this.updateHiddenInput(t), this.renderCalendarGrid(t), this.dispatchCalendarEvent(t, "calendar:cleared", {
      isRange: e.isRange
    }));
  }
  /**
   * Navigate to today's date and select it
   */
  selectToday(t) {
    const e = this.getState(t);
    if (!e || e.isDisabled) return;
    const n = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    this.isDateDisabled(t, /* @__PURE__ */ new Date()) || (this.navigateToToday(t), this.selectDate(t, n));
  }
  /**
   * Navigate calendar to show today's month
   */
  navigateToToday(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = /* @__PURE__ */ new Date(), i = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
    e.currentMonth !== i && (e.currentMonth = i, this.setState(t, e), this.updateCalendarDisplay(t));
  }
  /**
   * Handle calendar footer action buttons
   */
  handleFooterAction(t, e) {
    switch (e) {
      case "clear":
        this.clearSelection(t);
        break;
      case "today":
        this.selectToday(t);
        break;
    }
  }
  /**
   * Clean up CalendarActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Ur.getInstance().init();
}) : Ur.getInstance().init();
window.CalendarActions = Ur;
Ur.getInstance();
class _c extends ht {
  /**
   * Initialize radio elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("label[for]", (t) => {
      const e = t.getAttribute("for");
      if (!e) return;
      const n = b.getElementById(e);
      !n || n.type !== "radio" || this.focusRadioInput(n);
    }), D.handleDelegatedKeydown('input[type="radio"]', (t, e) => {
      D.createNavigationHandler({
        onArrowDown: () => this.focusNextRadio(t),
        onArrowRight: () => this.focusNextRadio(t),
        onArrowUp: () => this.focusPreviousRadio(t),
        onArrowLeft: () => this.focusPreviousRadio(t),
        preventDefault: ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"]
      })(e);
    });
  }
  /**
   * Focus a radio input with proper timing
   */
  focusRadioInput(t) {
    b.focus(t, 0), this.dispatchFocusEvent(t);
  }
  /**
   * Focus the next radio in the same group
   */
  focusNextRadio(t) {
    const e = this.getRadioGroup(t), i = (e.indexOf(t) + 1) % e.length, s = e[i];
    s && (s.focus(), s.checked = !0, s.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(s));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(t) {
    const e = this.getRadioGroup(t), n = e.indexOf(t), i = n === 0 ? e.length - 1 : n - 1, s = e[i];
    s && (s.focus(), s.checked = !0, s.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(s));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(t) {
    const e = t.name;
    return e ? Array.from(b.querySelectorAll(`input[type="radio"][name="${e}"]`)).filter((i) => !i.disabled) : [t];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(t) {
    D.dispatchCustomEvent(t, "radio-focus", {
      radio: t,
      name: t.name,
      value: t.value,
      checked: t.checked
    });
  }
  /**
   * Add a custom radio focus handler with automatic cleanup
   */
  addFocusHandler(t) {
    return D.addEventListener(document, "radio-focus", (e) => {
      t(e.detail.radio);
    });
  }
  /**
   * Clean up RadioActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
_c.getInstance();
class Vr extends ht {
  /**
   * Initialize range elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("range", "true").forEach((t) => {
      this.initializeRange(t);
    });
  }
  /**
   * Initialize a single range component
   */
  initializeRange(t) {
    var a, o, l;
    if (this.hasState(t))
      return;
    const e = b.querySelector(".range-track", t);
    if (!e) return;
    const n = {
      min: parseFloat(e.dataset.min || "0"),
      max: parseFloat(e.dataset.max || "100"),
      step: parseFloat(e.dataset.step || "1"),
      dual: e.dataset.dual === "true",
      ticks: e.dataset.ticks ? JSON.parse(e.dataset.ticks) : [],
      disabled: e.dataset.disabled === "true"
    }, i = this.getElements(t, n);
    if (!i.track) return;
    const s = {
      minValue: n.dual ? parseFloat(((a = i.inputs.min) == null ? void 0 : a.value) || n.min.toString()) : n.min,
      maxValue: n.dual ? parseFloat(((o = i.inputs.max) == null ? void 0 : o.value) || n.max.toString()) : n.max,
      singleValue: n.dual ? n.min : parseFloat(((l = i.inputs.single) == null ? void 0 : l.value) || n.min.toString()),
      isDragging: !1,
      activeHandle: null
    };
    this.setState(t, { config: n, state: s, elements: i }), n.disabled || this.setupHandleInteractions(t, i);
  }
  /**
   * Get all relevant elements for a range component
   */
  getElements(t, e) {
    const n = b.querySelector(".range-track", t), i = b.querySelector(".range-fill", t), s = {}, a = {}, o = {}, l = {};
    return e.dual ? (s.min = b.querySelector('[data-handle="min"]', t), s.max = b.querySelector('[data-handle="max"]', t), a.min = b.querySelector('[data-native-input="min"]', t), a.max = b.querySelector('[data-native-input="max"]', t), o.min = b.querySelector('[data-range-input="min"]', t), o.max = b.querySelector('[data-range-input="max"]', t), l.min = b.querySelector('[data-value-display="min"]', t), l.max = b.querySelector('[data-value-display="max"]', t)) : (s.single = b.querySelector('[data-handle="single"]', t), a.single = b.querySelector('[data-native-input="single"]', t), o.single = b.querySelector('[data-range-input="single"]', t), l.single = b.querySelector('[data-value-display="single"]', t)), {
      container: t,
      track: n,
      fill: i,
      handles: s,
      inputs: a,
      hiddenInputs: o,
      valueDisplays: l
    };
  }
  /**
   * Set up handle interactions (mouse, touch, keyboard)
   */
  setupHandleInteractions(t, e) {
    const { handles: n } = e;
    Object.entries(n).forEach(([i, s]) => {
      s && (s.addEventListener("mousedown", (a) => this.handleStart(a, t, i)), s.addEventListener("touchstart", (a) => this.handleStart(a, t, i), { passive: !1 }), s.addEventListener("keydown", (a) => this.handleKeydown(a, t, i)), s.addEventListener("focus", () => this.handleFocus(t, i)), s.addEventListener("blur", () => this.handleBlur(t, i)));
    }), e.track.addEventListener("click", (i) => this.handleTrackClick(i, t));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.addEventListener(document, "mousemove", (t) => this.handleMove(t)), D.addEventListener(document, "mouseup", (t) => this.handleEnd(t)), D.addEventListener(document, "touchmove", (t) => this.handleMove(t), { passive: !1 }), D.addEventListener(document, "touchend", (t) => this.handleEnd(t)), D.addEventListener(document, "touchcancel", (t) => this.handleEnd(t));
  }
  /**
   * Setup dynamic observer for new ranges - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "range", "true") && this.initializeRange(n), b.findByDataAttribute("range", "true", n).forEach((i) => {
            this.initializeRange(i);
          });
        }
      });
    });
  }
  /**
   * Handle drag start
   */
  handleStart(t, e, n) {
    t.preventDefault();
    const i = this.getState(e);
    if (!i || i.config.disabled) return;
    i.state.isDragging = !0, i.state.activeHandle = n;
    const s = i.elements.handles[n];
    s && (s.classList.add("dragging"), s.focus()), e.classList.add("dragging"), document.body.style.userSelect = "none";
  }
  /**
   * Handle drag move
   */
  handleMove(t) {
    const e = Array.from(this.getAllStates().entries()).find(([f, p]) => p.state.isDragging);
    if (!e) return;
    t.preventDefault();
    const [n, i] = e, { config: s, state: a, elements: o } = i, l = "touches" in t ? t.touches[0].clientX : t.clientX, c = o.track.getBoundingClientRect(), u = Math.max(0, Math.min(1, (l - c.left) / c.width));
    let h = this.percentageToValue(u, s);
    h = this.snapToTickIfNeeded(h, s), this.updateValue(n, a.activeHandle, h);
  }
  /**
   * Handle drag end
   */
  handleEnd(t) {
    const e = Array.from(this.getAllStates().entries()).find(([a, o]) => o.state.isDragging);
    if (!e) return;
    const [n, i] = e;
    i.state.isDragging = !1;
    const s = i.elements.handles[i.state.activeHandle];
    s && s.classList.remove("dragging"), n.classList.remove("dragging"), i.state.activeHandle = null, document.body.style.userSelect = "", this.dispatchChangeEvent(n);
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e, n) {
    const i = this.getState(e);
    if (!i || i.config.disabled) return;
    const { config: s, state: a } = i;
    let o = !1, l;
    const c = n === "min" ? a.minValue : n === "max" ? a.maxValue : a.singleValue;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowDown":
        l = Math.max(s.min, c - s.step), o = !0;
        break;
      case "ArrowRight":
      case "ArrowUp":
        l = Math.min(s.max, c + s.step), o = !0;
        break;
      case "PageDown":
        l = Math.max(s.min, c - s.step * 10), o = !0;
        break;
      case "PageUp":
        l = Math.min(s.max, c + s.step * 10), o = !0;
        break;
      case "Home":
        l = s.min, o = !0;
        break;
      case "End":
        l = s.max, o = !0;
        break;
    }
    o && (t.preventDefault(), l = this.snapToTickIfNeeded(l, s), this.updateValue(e, n, l), this.dispatchChangeEvent(e));
  }
  /**
   * Handle track click to jump to position
   */
  handleTrackClick(t, e) {
    const n = this.getState(e);
    if (!n || n.config.disabled) return;
    const { config: i, state: s } = n, a = n.elements.track.getBoundingClientRect(), o = (t.clientX - a.left) / a.width;
    let l = this.percentageToValue(o, i);
    if (l = this.snapToTickIfNeeded(l, i), i.dual) {
      const c = Math.abs(l - s.minValue), u = Math.abs(l - s.maxValue), h = c <= u ? "min" : "max";
      this.updateValue(e, h, l);
    } else
      this.updateValue(e, "single", l);
    this.dispatchChangeEvent(e);
  }
  /**
   * Update a handle's value and visual position
   */
  updateValue(t, e, n) {
    const i = this.getState(t);
    if (!i) return;
    const { config: s, state: a, elements: o } = i;
    s.dual ? e === "min" ? (n = Math.min(n, a.maxValue), a.minValue = n) : e === "max" && (n = Math.max(n, a.minValue), a.maxValue = n) : a.singleValue = n, this.updateVisualElements(t), this.updateFormInputs(t), this.dispatchInputEvent(t);
  }
  /**
   * Update visual elements (handles, fill, value displays)
   */
  updateVisualElements(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: n, state: i, elements: s } = e;
    if (n.dual) {
      const a = this.valueToPercentage(i.minValue, n), o = this.valueToPercentage(i.maxValue, n);
      s.handles.min && (s.handles.min.style.left = `${a}%`, s.handles.min.setAttribute("aria-valuenow", i.minValue.toString()), s.handles.min.setAttribute("aria-valuetext", i.minValue.toString())), s.handles.max && (s.handles.max.style.left = `${o}%`, s.handles.max.setAttribute("aria-valuenow", i.maxValue.toString()), s.handles.max.setAttribute("aria-valuetext", i.maxValue.toString())), s.fill.style.left = `${a}%`, s.fill.style.width = `${o - a}%`, s.valueDisplays.min && (s.valueDisplays.min.textContent = i.minValue.toString()), s.valueDisplays.max && (s.valueDisplays.max.textContent = i.maxValue.toString());
    } else {
      const a = this.valueToPercentage(i.singleValue, n);
      s.handles.single && (s.handles.single.style.left = `${a}%`, s.handles.single.setAttribute("aria-valuenow", i.singleValue.toString()), s.handles.single.setAttribute("aria-valuetext", i.singleValue.toString())), s.fill.style.width = `${a}%`, s.valueDisplays.single && (s.valueDisplays.single.textContent = i.singleValue.toString());
    }
  }
  /**
   * Update form inputs for submission
   */
  updateFormInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: n, state: i, elements: s } = e;
    n.dual ? (s.inputs.min && (s.inputs.min.value = i.minValue.toString()), s.inputs.max && (s.inputs.max.value = i.maxValue.toString()), s.hiddenInputs.min && (s.hiddenInputs.min.value = i.minValue.toString()), s.hiddenInputs.max && (s.hiddenInputs.max.value = i.maxValue.toString())) : (s.inputs.single && (s.inputs.single.value = i.singleValue.toString()), s.hiddenInputs.single && (s.hiddenInputs.single.value = i.singleValue.toString()));
  }
  /**
   * Convert percentage to value
   */
  percentageToValue(t, e) {
    const n = e.max - e.min;
    let i = e.min + t * n;
    return i = Math.round(i / e.step) * e.step, Math.max(e.min, Math.min(e.max, i));
  }
  /**
   * Convert value to percentage
   */
  valueToPercentage(t, e) {
    return (t - e.min) / (e.max - e.min) * 100;
  }
  /**
   * Snap value to nearest tick if ticks are enabled
   */
  snapToTickIfNeeded(t, e) {
    if (e.ticks.length === 0)
      return t;
    let n = e.ticks[0], i = Math.abs(t - n);
    for (const s of e.ticks) {
      const a = Math.abs(t - s);
      a < i && (n = s, i = a);
    }
    return n;
  }
  /**
   * Handle focus events
   */
  handleFocus(t, e) {
  }
  /**
   * Handle blur events
   */
  handleBlur(t, e) {
  }
  /**
   * Dispatch input event for real-time updates (e.g., Livewire)
   */
  dispatchInputEvent(t) {
    var a, o, l;
    const e = this.getState(t);
    if (!e) return;
    const { config: n, state: i } = e, s = n.dual ? [i.minValue, i.maxValue] : i.singleValue;
    D.dispatchCustomEvent(t, "range-input", {
      value: s,
      dual: n.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), n.dual ? ((a = e.elements.hiddenInputs.min) == null || a.dispatchEvent(new Event("input", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("input", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  /**
   * Dispatch change event when interaction is complete
   */
  dispatchChangeEvent(t) {
    var a, o, l;
    const e = this.getState(t);
    if (!e) return;
    const { config: n, state: i } = e, s = n.dual ? [i.minValue, i.maxValue] : i.singleValue;
    D.dispatchCustomEvent(t, "range-change", {
      value: s,
      dual: n.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), n.dual ? ((a = e.elements.hiddenInputs.min) == null || a.dispatchEvent(new Event("change", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("change", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Get current value for a range component
   */
  getValue(t) {
    const e = this.getState(t);
    if (!e) return null;
    const { config: n, state: i } = e;
    return n.dual ? [i.minValue, i.maxValue] : i.singleValue;
  }
  /**
   * Set value for a range component
   */
  setValue(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const { config: i } = n;
    i.dual && Array.isArray(e) ? (this.updateValue(t, "min", e[0]), this.updateValue(t, "max", e[1])) : !i.dual && typeof e == "number" && this.updateValue(t, "single", e), this.dispatchChangeEvent(t);
  }
  /**
   * Destroy range component
   */
  destroyRange(t) {
    this.removeState(t);
  }
  /**
   * Destroy all range components and clean up
   */
  destroyAll() {
    this.clearAllStates();
  }
  /**
   * Clean up RangeActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Vr.getInstance().init();
}) : Vr.getInstance().init();
window.RangeActions = Vr;
Vr.getInstance();
const Hm = ["top", "right", "bottom", "left"], Ce = Math.min, Mt = Math.max, va = Math.round, Ws = Math.floor, Ge = (r) => ({
  x: r,
  y: r
}), Um = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Vm = {
  start: "end",
  end: "start"
};
function Pl(r, t, e) {
  return Mt(r, Ce(t, e));
}
function _n(r, t) {
  return typeof r == "function" ? r(t) : r;
}
function Ye(r) {
  return r.split("-")[0];
}
function ui(r) {
  return r.split("-")[1];
}
function vf(r) {
  return r === "x" ? "y" : "x";
}
function Rc(r) {
  return r === "y" ? "height" : "width";
}
const Gm = /* @__PURE__ */ new Set(["top", "bottom"]);
function Ue(r) {
  return Gm.has(Ye(r)) ? "y" : "x";
}
function zc(r) {
  return vf(Ue(r));
}
function Wm(r, t, e) {
  e === void 0 && (e = !1);
  const n = ui(r), i = zc(r), s = Rc(i);
  let a = i === "x" ? n === (e ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (a = wa(a)), [a, wa(a)];
}
function Km(r) {
  const t = wa(r);
  return [Bl(r), t, Bl(t)];
}
function Bl(r) {
  return r.replace(/start|end/g, (t) => Vm[t]);
}
const Gu = ["left", "right"], Wu = ["right", "left"], Ym = ["top", "bottom"], Qm = ["bottom", "top"];
function Zm(r, t, e) {
  switch (r) {
    case "top":
    case "bottom":
      return e ? t ? Wu : Gu : t ? Gu : Wu;
    case "left":
    case "right":
      return t ? Ym : Qm;
    default:
      return [];
  }
}
function Xm(r, t, e, n) {
  const i = ui(r);
  let s = Zm(Ye(r), e === "start", n);
  return i && (s = s.map((a) => a + "-" + i), t && (s = s.concat(s.map(Bl)))), s;
}
function wa(r) {
  return r.replace(/left|right|bottom|top/g, (t) => Um[t]);
}
function Jm(r) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...r
  };
}
function Pc(r) {
  return typeof r != "number" ? Jm(r) : {
    top: r,
    right: r,
    bottom: r,
    left: r
  };
}
function Gr(r) {
  const {
    x: t,
    y: e,
    width: n,
    height: i
  } = r;
  return {
    width: n,
    height: i,
    top: e,
    left: t,
    right: t + n,
    bottom: e + i,
    x: t,
    y: e
  };
}
function Ku(r, t, e) {
  let {
    reference: n,
    floating: i
  } = r;
  const s = Ue(t), a = zc(t), o = Rc(a), l = Ye(t), c = s === "y", u = n.x + n.width / 2 - i.width / 2, h = n.y + n.height / 2 - i.height / 2, f = n[o] / 2 - i[o] / 2;
  let p;
  switch (l) {
    case "top":
      p = {
        x: u,
        y: n.y - i.height
      };
      break;
    case "bottom":
      p = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      p = {
        x: n.x + n.width,
        y: h
      };
      break;
    case "left":
      p = {
        x: n.x - i.width,
        y: h
      };
      break;
    default:
      p = {
        x: n.x,
        y: n.y
      };
  }
  switch (ui(t)) {
    case "start":
      p[a] -= f * (e && c ? -1 : 1);
      break;
    case "end":
      p[a] += f * (e && c ? -1 : 1);
      break;
  }
  return p;
}
const tb = async (r, t, e) => {
  const {
    placement: n = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: a
  } = e, o = s.filter(Boolean), l = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let c = await a.getElementRects({
    reference: r,
    floating: t,
    strategy: i
  }), {
    x: u,
    y: h
  } = Ku(c, n, l), f = n, p = {}, m = 0;
  for (let y = 0; y < o.length; y++) {
    const {
      name: w,
      fn: v
    } = o[y], {
      x: S,
      y: A,
      data: E,
      reset: T
    } = await v({
      x: u,
      y: h,
      initialPlacement: n,
      placement: f,
      strategy: i,
      middlewareData: p,
      rects: c,
      platform: a,
      elements: {
        reference: r,
        floating: t
      }
    });
    u = S ?? u, h = A ?? h, p = {
      ...p,
      [w]: {
        ...p[w],
        ...E
      }
    }, T && m <= 50 && (m++, typeof T == "object" && (T.placement && (f = T.placement), T.rects && (c = T.rects === !0 ? await a.getElementRects({
      reference: r,
      floating: t,
      strategy: i
    }) : T.rects), {
      x: u,
      y: h
    } = Ku(c, f, l)), y = -1);
  }
  return {
    x: u,
    y: h,
    placement: f,
    strategy: i,
    middlewareData: p
  };
};
async function Xi(r, t) {
  var e;
  t === void 0 && (t = {});
  const {
    x: n,
    y: i,
    platform: s,
    rects: a,
    elements: o,
    strategy: l
  } = r, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: h = "floating",
    altBoundary: f = !1,
    padding: p = 0
  } = _n(t, r), m = Pc(p), w = o[f ? h === "floating" ? "reference" : "floating" : h], v = Gr(await s.getClippingRect({
    element: (e = await (s.isElement == null ? void 0 : s.isElement(w))) == null || e ? w : w.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), S = h === "floating" ? {
    x: n,
    y: i,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, A = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(o.floating)), E = await (s.isElement == null ? void 0 : s.isElement(A)) ? await (s.getScale == null ? void 0 : s.getScale(A)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, T = Gr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: o,
    rect: S,
    offsetParent: A,
    strategy: l
  }) : S);
  return {
    top: (v.top - T.top + m.top) / E.y,
    bottom: (T.bottom - v.bottom + m.bottom) / E.y,
    left: (v.left - T.left + m.left) / E.x,
    right: (T.right - v.right + m.right) / E.x
  };
}
const eb = (r) => ({
  name: "arrow",
  options: r,
  async fn(t) {
    const {
      x: e,
      y: n,
      placement: i,
      rects: s,
      platform: a,
      elements: o,
      middlewareData: l
    } = t, {
      element: c,
      padding: u = 0
    } = _n(r, t) || {};
    if (c == null)
      return {};
    const h = Pc(u), f = {
      x: e,
      y: n
    }, p = zc(i), m = Rc(p), y = await a.getDimensions(c), w = p === "y", v = w ? "top" : "left", S = w ? "bottom" : "right", A = w ? "clientHeight" : "clientWidth", E = s.reference[m] + s.reference[p] - f[p] - s.floating[m], T = f[p] - s.reference[p], M = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(c));
    let N = M ? M[A] : 0;
    (!N || !await (a.isElement == null ? void 0 : a.isElement(M))) && (N = o.floating[A] || s.floating[m]);
    const k = E / 2 - T / 2, C = N / 2 - y[m] / 2 - 1, q = Ce(h[v], C), I = Ce(h[S], C), j = q, Q = N - y[m] - I, H = N / 2 - y[m] / 2 + k, lt = Pl(j, H, Q), it = !l.arrow && ui(i) != null && H !== lt && s.reference[m] / 2 - (H < j ? q : I) - y[m] / 2 < 0, vt = it ? H < j ? H - j : H - Q : 0;
    return {
      [p]: f[p] + vt,
      data: {
        [p]: lt,
        centerOffset: H - lt - vt,
        ...it && {
          alignmentOffset: vt
        }
      },
      reset: it
    };
  }
}), nb = function(r) {
  return r === void 0 && (r = {}), {
    name: "flip",
    options: r,
    async fn(t) {
      var e, n;
      const {
        placement: i,
        middlewareData: s,
        rects: a,
        initialPlacement: o,
        platform: l,
        elements: c
      } = t, {
        mainAxis: u = !0,
        crossAxis: h = !0,
        fallbackPlacements: f,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: m = "none",
        flipAlignment: y = !0,
        ...w
      } = _n(r, t);
      if ((e = s.arrow) != null && e.alignmentOffset)
        return {};
      const v = Ye(i), S = Ue(o), A = Ye(o) === o, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), T = f || (A || !y ? [wa(o)] : Km(o)), M = m !== "none";
      !f && M && T.push(...Xm(o, y, m, E));
      const N = [o, ...T], k = await Xi(t, w), C = [];
      let q = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && C.push(k[v]), h) {
        const H = Wm(i, a, E);
        C.push(k[H[0]], k[H[1]]);
      }
      if (q = [...q, {
        placement: i,
        overflows: C
      }], !C.every((H) => H <= 0)) {
        var I, j;
        const H = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, lt = N[H];
        if (lt && (!(h === "alignment" ? S !== Ue(lt) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        q.every((ut) => Ue(ut.placement) === S ? ut.overflows[0] > 0 : !0)))
          return {
            data: {
              index: H,
              overflows: q
            },
            reset: {
              placement: lt
            }
          };
        let it = (j = q.filter((vt) => vt.overflows[0] <= 0).sort((vt, ut) => vt.overflows[1] - ut.overflows[1])[0]) == null ? void 0 : j.placement;
        if (!it)
          switch (p) {
            case "bestFit": {
              var Q;
              const vt = (Q = q.filter((ut) => {
                if (M) {
                  const wt = Ue(ut.placement);
                  return wt === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  wt === "y";
                }
                return !0;
              }).map((ut) => [ut.placement, ut.overflows.filter((wt) => wt > 0).reduce((wt, U) => wt + U, 0)]).sort((ut, wt) => ut[1] - wt[1])[0]) == null ? void 0 : Q[0];
              vt && (it = vt);
              break;
            }
            case "initialPlacement":
              it = o;
              break;
          }
        if (i !== it)
          return {
            reset: {
              placement: it
            }
          };
      }
      return {};
    }
  };
};
function Yu(r, t) {
  return {
    top: r.top - t.height,
    right: r.right - t.width,
    bottom: r.bottom - t.height,
    left: r.left - t.width
  };
}
function Qu(r) {
  return Hm.some((t) => r[t] >= 0);
}
const rb = function(r) {
  return r === void 0 && (r = {}), {
    name: "hide",
    options: r,
    async fn(t) {
      const {
        rects: e
      } = t, {
        strategy: n = "referenceHidden",
        ...i
      } = _n(r, t);
      switch (n) {
        case "referenceHidden": {
          const s = await Xi(t, {
            ...i,
            elementContext: "reference"
          }), a = Yu(s, e.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Qu(a)
            }
          };
        }
        case "escaped": {
          const s = await Xi(t, {
            ...i,
            altBoundary: !0
          }), a = Yu(s, e.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Qu(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
};
function wf(r) {
  const t = Ce(...r.map((s) => s.left)), e = Ce(...r.map((s) => s.top)), n = Mt(...r.map((s) => s.right)), i = Mt(...r.map((s) => s.bottom));
  return {
    x: t,
    y: e,
    width: n - t,
    height: i - e
  };
}
function ib(r) {
  const t = r.slice().sort((i, s) => i.y - s.y), e = [];
  let n = null;
  for (let i = 0; i < t.length; i++) {
    const s = t[i];
    !n || s.y - n.y > n.height / 2 ? e.push([s]) : e[e.length - 1].push(s), n = s;
  }
  return e.map((i) => Gr(wf(i)));
}
const sb = function(r) {
  return r === void 0 && (r = {}), {
    name: "inline",
    options: r,
    async fn(t) {
      const {
        placement: e,
        elements: n,
        rects: i,
        platform: s,
        strategy: a
      } = t, {
        padding: o = 2,
        x: l,
        y: c
      } = _n(r, t), u = Array.from(await (s.getClientRects == null ? void 0 : s.getClientRects(n.reference)) || []), h = ib(u), f = Gr(wf(u)), p = Pc(o);
      function m() {
        if (h.length === 2 && h[0].left > h[1].right && l != null && c != null)
          return h.find((w) => l > w.left - p.left && l < w.right + p.right && c > w.top - p.top && c < w.bottom + p.bottom) || f;
        if (h.length >= 2) {
          if (Ue(e) === "y") {
            const q = h[0], I = h[h.length - 1], j = Ye(e) === "top", Q = q.top, H = I.bottom, lt = j ? q.left : I.left, it = j ? q.right : I.right, vt = it - lt, ut = H - Q;
            return {
              top: Q,
              bottom: H,
              left: lt,
              right: it,
              width: vt,
              height: ut,
              x: lt,
              y: Q
            };
          }
          const w = Ye(e) === "left", v = Mt(...h.map((q) => q.right)), S = Ce(...h.map((q) => q.left)), A = h.filter((q) => w ? q.left === S : q.right === v), E = A[0].top, T = A[A.length - 1].bottom, M = S, N = v, k = N - M, C = T - E;
          return {
            top: E,
            bottom: T,
            left: M,
            right: N,
            width: k,
            height: C,
            x: M,
            y: E
          };
        }
        return f;
      }
      const y = await s.getElementRects({
        reference: {
          getBoundingClientRect: m
        },
        floating: n.floating,
        strategy: a
      });
      return i.reference.x !== y.reference.x || i.reference.y !== y.reference.y || i.reference.width !== y.reference.width || i.reference.height !== y.reference.height ? {
        reset: {
          rects: y
        }
      } : {};
    }
  };
}, ab = /* @__PURE__ */ new Set(["left", "top"]);
async function ob(r, t) {
  const {
    placement: e,
    platform: n,
    elements: i
  } = r, s = await (n.isRTL == null ? void 0 : n.isRTL(i.floating)), a = Ye(e), o = ui(e), l = Ue(e) === "y", c = ab.has(a) ? -1 : 1, u = s && l ? -1 : 1, h = _n(t, r);
  let {
    mainAxis: f,
    crossAxis: p,
    alignmentAxis: m
  } = typeof h == "number" ? {
    mainAxis: h,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: h.mainAxis || 0,
    crossAxis: h.crossAxis || 0,
    alignmentAxis: h.alignmentAxis
  };
  return o && typeof m == "number" && (p = o === "end" ? m * -1 : m), l ? {
    x: p * u,
    y: f * c
  } : {
    x: f * c,
    y: p * u
  };
}
const lb = function(r) {
  return r === void 0 && (r = 0), {
    name: "offset",
    options: r,
    async fn(t) {
      var e, n;
      const {
        x: i,
        y: s,
        placement: a,
        middlewareData: o
      } = t, l = await ob(t, r);
      return a === ((e = o.offset) == null ? void 0 : e.placement) && (n = o.arrow) != null && n.alignmentOffset ? {} : {
        x: i + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: a
        }
      };
    }
  };
}, cb = function(r) {
  return r === void 0 && (r = {}), {
    name: "shift",
    options: r,
    async fn(t) {
      const {
        x: e,
        y: n,
        placement: i
      } = t, {
        mainAxis: s = !0,
        crossAxis: a = !1,
        limiter: o = {
          fn: (w) => {
            let {
              x: v,
              y: S
            } = w;
            return {
              x: v,
              y: S
            };
          }
        },
        ...l
      } = _n(r, t), c = {
        x: e,
        y: n
      }, u = await Xi(t, l), h = Ue(Ye(i)), f = vf(h);
      let p = c[f], m = c[h];
      if (s) {
        const w = f === "y" ? "top" : "left", v = f === "y" ? "bottom" : "right", S = p + u[w], A = p - u[v];
        p = Pl(S, p, A);
      }
      if (a) {
        const w = h === "y" ? "top" : "left", v = h === "y" ? "bottom" : "right", S = m + u[w], A = m - u[v];
        m = Pl(S, m, A);
      }
      const y = o.fn({
        ...t,
        [f]: p,
        [h]: m
      });
      return {
        ...y,
        data: {
          x: y.x - e,
          y: y.y - n,
          enabled: {
            [f]: s,
            [h]: a
          }
        }
      };
    }
  };
}, ub = function(r) {
  return r === void 0 && (r = {}), {
    name: "size",
    options: r,
    async fn(t) {
      var e, n;
      const {
        placement: i,
        rects: s,
        platform: a,
        elements: o
      } = t, {
        apply: l = () => {
        },
        ...c
      } = _n(r, t), u = await Xi(t, c), h = Ye(i), f = ui(i), p = Ue(i) === "y", {
        width: m,
        height: y
      } = s.floating;
      let w, v;
      h === "top" || h === "bottom" ? (w = h, v = f === (await (a.isRTL == null ? void 0 : a.isRTL(o.floating)) ? "start" : "end") ? "left" : "right") : (v = h, w = f === "end" ? "top" : "bottom");
      const S = y - u.top - u.bottom, A = m - u.left - u.right, E = Ce(y - u[w], S), T = Ce(m - u[v], A), M = !t.middlewareData.shift;
      let N = E, k = T;
      if ((e = t.middlewareData.shift) != null && e.enabled.x && (k = A), (n = t.middlewareData.shift) != null && n.enabled.y && (N = S), M && !f) {
        const q = Mt(u.left, 0), I = Mt(u.right, 0), j = Mt(u.top, 0), Q = Mt(u.bottom, 0);
        p ? k = m - 2 * (q !== 0 || I !== 0 ? q + I : Mt(u.left, u.right)) : N = y - 2 * (j !== 0 || Q !== 0 ? j + Q : Mt(u.top, u.bottom));
      }
      await l({
        ...t,
        availableWidth: k,
        availableHeight: N
      });
      const C = await a.getDimensions(o.floating);
      return m !== C.width || y !== C.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Ba() {
  return typeof window < "u";
}
function di(r) {
  return xf(r) ? (r.nodeName || "").toLowerCase() : "#document";
}
function Xt(r) {
  var t;
  return (r == null || (t = r.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function nn(r) {
  var t;
  return (t = (xf(r) ? r.ownerDocument : r.document) || window.document) == null ? void 0 : t.documentElement;
}
function xf(r) {
  return Ba() ? r instanceof Node || r instanceof Xt(r).Node : !1;
}
function Te(r) {
  return Ba() ? r instanceof Element || r instanceof Xt(r).Element : !1;
}
function Qe(r) {
  return Ba() ? r instanceof HTMLElement || r instanceof Xt(r).HTMLElement : !1;
}
function Zu(r) {
  return !Ba() || typeof ShadowRoot > "u" ? !1 : r instanceof ShadowRoot || r instanceof Xt(r).ShadowRoot;
}
const db = /* @__PURE__ */ new Set(["inline", "contents"]);
function fs(r) {
  const {
    overflow: t,
    overflowX: e,
    overflowY: n,
    display: i
  } = Le(r);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + e) && !db.has(i);
}
const hb = /* @__PURE__ */ new Set(["table", "td", "th"]);
function fb(r) {
  return hb.has(di(r));
}
const pb = [":popover-open", ":modal"];
function $a(r) {
  return pb.some((t) => {
    try {
      return r.matches(t);
    } catch {
      return !1;
    }
  });
}
const gb = ["transform", "translate", "scale", "rotate", "perspective"], mb = ["transform", "translate", "scale", "rotate", "perspective", "filter"], bb = ["paint", "layout", "strict", "content"];
function Bc(r) {
  const t = $c(), e = Te(r) ? Le(r) : r;
  return gb.some((n) => e[n] ? e[n] !== "none" : !1) || (e.containerType ? e.containerType !== "normal" : !1) || !t && (e.backdropFilter ? e.backdropFilter !== "none" : !1) || !t && (e.filter ? e.filter !== "none" : !1) || mb.some((n) => (e.willChange || "").includes(n)) || bb.some((n) => (e.contain || "").includes(n));
}
function yb(r) {
  let t = On(r);
  for (; Qe(t) && !Wr(t); ) {
    if (Bc(t))
      return t;
    if ($a(t))
      return null;
    t = On(t);
  }
  return null;
}
function $c() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const vb = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Wr(r) {
  return vb.has(di(r));
}
function Le(r) {
  return Xt(r).getComputedStyle(r);
}
function ja(r) {
  return Te(r) ? {
    scrollLeft: r.scrollLeft,
    scrollTop: r.scrollTop
  } : {
    scrollLeft: r.scrollX,
    scrollTop: r.scrollY
  };
}
function On(r) {
  if (di(r) === "html")
    return r;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    r.assignedSlot || // DOM Element detected.
    r.parentNode || // ShadowRoot detected.
    Zu(r) && r.host || // Fallback.
    nn(r)
  );
  return Zu(t) ? t.host : t;
}
function Sf(r) {
  const t = On(r);
  return Wr(t) ? r.ownerDocument ? r.ownerDocument.body : r.body : Qe(t) && fs(t) ? t : Sf(t);
}
function Ji(r, t, e) {
  var n;
  t === void 0 && (t = []), e === void 0 && (e = !0);
  const i = Sf(r), s = i === ((n = r.ownerDocument) == null ? void 0 : n.body), a = Xt(i);
  if (s) {
    const o = $l(a);
    return t.concat(a, a.visualViewport || [], fs(i) ? i : [], o && e ? Ji(o) : []);
  }
  return t.concat(i, Ji(i, [], e));
}
function $l(r) {
  return r.parent && Object.getPrototypeOf(r.parent) ? r.frameElement : null;
}
function kf(r) {
  const t = Le(r);
  let e = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const i = Qe(r), s = i ? r.offsetWidth : e, a = i ? r.offsetHeight : n, o = va(e) !== s || va(n) !== a;
  return o && (e = s, n = a), {
    width: e,
    height: n,
    $: o
  };
}
function jc(r) {
  return Te(r) ? r : r.contextElement;
}
function Rr(r) {
  const t = jc(r);
  if (!Qe(t))
    return Ge(1);
  const e = t.getBoundingClientRect(), {
    width: n,
    height: i,
    $: s
  } = kf(t);
  let a = (s ? va(e.width) : e.width) / n, o = (s ? va(e.height) : e.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const wb = /* @__PURE__ */ Ge(0);
function Af(r) {
  const t = Xt(r);
  return !$c() || !t.visualViewport ? wb : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function xb(r, t, e) {
  return t === void 0 && (t = !1), !e || t && e !== Xt(r) ? !1 : t;
}
function tr(r, t, e, n) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  const i = r.getBoundingClientRect(), s = jc(r);
  let a = Ge(1);
  t && (n ? Te(n) && (a = Rr(n)) : a = Rr(r));
  const o = xb(s, e, n) ? Af(s) : Ge(0);
  let l = (i.left + o.x) / a.x, c = (i.top + o.y) / a.y, u = i.width / a.x, h = i.height / a.y;
  if (s) {
    const f = Xt(s), p = n && Te(n) ? Xt(n) : n;
    let m = f, y = $l(m);
    for (; y && n && p !== m; ) {
      const w = Rr(y), v = y.getBoundingClientRect(), S = Le(y), A = v.left + (y.clientLeft + parseFloat(S.paddingLeft)) * w.x, E = v.top + (y.clientTop + parseFloat(S.paddingTop)) * w.y;
      l *= w.x, c *= w.y, u *= w.x, h *= w.y, l += A, c += E, m = Xt(y), y = $l(m);
    }
  }
  return Gr({
    width: u,
    height: h,
    x: l,
    y: c
  });
}
function Fa(r, t) {
  const e = ja(r).scrollLeft;
  return t ? t.left + e : tr(nn(r)).left + e;
}
function Ef(r, t) {
  const e = r.getBoundingClientRect(), n = e.left + t.scrollLeft - Fa(r, e), i = e.top + t.scrollTop;
  return {
    x: n,
    y: i
  };
}
function Sb(r) {
  let {
    elements: t,
    rect: e,
    offsetParent: n,
    strategy: i
  } = r;
  const s = i === "fixed", a = nn(n), o = t ? $a(t.floating) : !1;
  if (n === a || o && s)
    return e;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Ge(1);
  const u = Ge(0), h = Qe(n);
  if ((h || !h && !s) && ((di(n) !== "body" || fs(a)) && (l = ja(n)), Qe(n))) {
    const p = tr(n);
    c = Rr(n), u.x = p.x + n.clientLeft, u.y = p.y + n.clientTop;
  }
  const f = a && !h && !s ? Ef(a, l) : Ge(0);
  return {
    width: e.width * c.x,
    height: e.height * c.y,
    x: e.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: e.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function kb(r) {
  return Array.from(r.getClientRects());
}
function Ab(r) {
  const t = nn(r), e = ja(r), n = r.ownerDocument.body, i = Mt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = Mt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -e.scrollLeft + Fa(r);
  const o = -e.scrollTop;
  return Le(n).direction === "rtl" && (a += Mt(t.clientWidth, n.clientWidth) - i), {
    width: i,
    height: s,
    x: a,
    y: o
  };
}
const Xu = 25;
function Eb(r, t) {
  const e = Xt(r), n = nn(r), i = e.visualViewport;
  let s = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (i) {
    s = i.width, a = i.height;
    const u = $c();
    (!u || u && t === "fixed") && (o = i.offsetLeft, l = i.offsetTop);
  }
  const c = Fa(n);
  if (c <= 0) {
    const u = n.ownerDocument, h = u.body, f = getComputedStyle(h), p = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, m = Math.abs(n.clientWidth - h.clientWidth - p);
    m <= Xu && (s -= m);
  } else c <= Xu && (s += c);
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
const Cb = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Tb(r, t) {
  const e = tr(r, !0, t === "fixed"), n = e.top + r.clientTop, i = e.left + r.clientLeft, s = Qe(r) ? Rr(r) : Ge(1), a = r.clientWidth * s.x, o = r.clientHeight * s.y, l = i * s.x, c = n * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: c
  };
}
function Ju(r, t, e) {
  let n;
  if (t === "viewport")
    n = Eb(r, e);
  else if (t === "document")
    n = Ab(nn(r));
  else if (Te(t))
    n = Tb(t, e);
  else {
    const i = Af(r);
    n = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return Gr(n);
}
function Cf(r, t) {
  const e = On(r);
  return e === t || !Te(e) || Wr(e) ? !1 : Le(e).position === "fixed" || Cf(e, t);
}
function Lb(r, t) {
  const e = t.get(r);
  if (e)
    return e;
  let n = Ji(r, [], !1).filter((o) => Te(o) && di(o) !== "body"), i = null;
  const s = Le(r).position === "fixed";
  let a = s ? On(r) : r;
  for (; Te(a) && !Wr(a); ) {
    const o = Le(a), l = Bc(a);
    !l && o.position === "fixed" && (i = null), (s ? !l && !i : !l && o.position === "static" && !!i && Cb.has(i.position) || fs(a) && !l && Cf(r, a)) ? n = n.filter((u) => u !== a) : i = o, a = On(a);
  }
  return t.set(r, n), n;
}
function Db(r) {
  let {
    element: t,
    boundary: e,
    rootBoundary: n,
    strategy: i
  } = r;
  const a = [...e === "clippingAncestors" ? $a(t) ? [] : Lb(t, this._c) : [].concat(e), n], o = a[0], l = a.reduce((c, u) => {
    const h = Ju(t, u, i);
    return c.top = Mt(h.top, c.top), c.right = Ce(h.right, c.right), c.bottom = Ce(h.bottom, c.bottom), c.left = Mt(h.left, c.left), c;
  }, Ju(t, o, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Ob(r) {
  const {
    width: t,
    height: e
  } = kf(r);
  return {
    width: t,
    height: e
  };
}
function Ib(r, t, e) {
  const n = Qe(t), i = nn(t), s = e === "fixed", a = tr(r, !0, s, t);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ge(0);
  function c() {
    l.x = Fa(i);
  }
  if (n || !n && !s)
    if ((di(t) !== "body" || fs(i)) && (o = ja(t)), n) {
      const p = tr(t, !0, s, t);
      l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
    } else i && c();
  s && !n && i && c();
  const u = i && !n && !s ? Ef(i, o) : Ge(0), h = a.left + o.scrollLeft - l.x - u.x, f = a.top + o.scrollTop - l.y - u.y;
  return {
    x: h,
    y: f,
    width: a.width,
    height: a.height
  };
}
function tl(r) {
  return Le(r).position === "static";
}
function td(r, t) {
  if (!Qe(r) || Le(r).position === "fixed")
    return null;
  if (t)
    return t(r);
  let e = r.offsetParent;
  return nn(r) === e && (e = e.ownerDocument.body), e;
}
function Tf(r, t) {
  const e = Xt(r);
  if ($a(r))
    return e;
  if (!Qe(r)) {
    let i = On(r);
    for (; i && !Wr(i); ) {
      if (Te(i) && !tl(i))
        return i;
      i = On(i);
    }
    return e;
  }
  let n = td(r, t);
  for (; n && fb(n) && tl(n); )
    n = td(n, t);
  return n && Wr(n) && tl(n) && !Bc(n) ? e : n || yb(r) || e;
}
const Nb = async function(r) {
  const t = this.getOffsetParent || Tf, e = this.getDimensions, n = await e(r.floating);
  return {
    reference: Ib(r.reference, await t(r.floating), r.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function Mb(r) {
  return Le(r).direction === "rtl";
}
const qb = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Sb,
  getDocumentElement: nn,
  getClippingRect: Db,
  getOffsetParent: Tf,
  getElementRects: Nb,
  getClientRects: kb,
  getDimensions: Ob,
  getScale: Rr,
  isElement: Te,
  isRTL: Mb
};
function Lf(r, t) {
  return r.x === t.x && r.y === t.y && r.width === t.width && r.height === t.height;
}
function _b(r, t) {
  let e = null, n;
  const i = nn(r);
  function s() {
    var o;
    clearTimeout(n), (o = e) == null || o.disconnect(), e = null;
  }
  function a(o, l) {
    o === void 0 && (o = !1), l === void 0 && (l = 1), s();
    const c = r.getBoundingClientRect(), {
      left: u,
      top: h,
      width: f,
      height: p
    } = c;
    if (o || t(), !f || !p)
      return;
    const m = Ws(h), y = Ws(i.clientWidth - (u + f)), w = Ws(i.clientHeight - (h + p)), v = Ws(u), A = {
      rootMargin: -m + "px " + -y + "px " + -w + "px " + -v + "px",
      threshold: Mt(0, Ce(1, l)) || 1
    };
    let E = !0;
    function T(M) {
      const N = M[0].intersectionRatio;
      if (N !== l) {
        if (!E)
          return a();
        N ? a(!1, N) : n = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      N === 1 && !Lf(c, r.getBoundingClientRect()) && a(), E = !1;
    }
    try {
      e = new IntersectionObserver(T, {
        ...A,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      e = new IntersectionObserver(T, A);
    }
    e.observe(r);
  }
  return a(!0), s;
}
function Rb(r, t, e, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = jc(r), u = i || s ? [...c ? Ji(c) : [], ...Ji(t)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", e, {
      passive: !0
    }), s && v.addEventListener("resize", e);
  });
  const h = c && o ? _b(c, e) : null;
  let f = -1, p = null;
  a && (p = new ResizeObserver((v) => {
    let [S] = v;
    S && S.target === c && p && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var A;
      (A = p) == null || A.observe(t);
    })), e();
  }), c && !l && p.observe(c), p.observe(t));
  let m, y = l ? tr(r) : null;
  l && w();
  function w() {
    const v = tr(r);
    y && !Lf(y, v) && e(), y = v, m = requestAnimationFrame(w);
  }
  return e(), () => {
    var v;
    u.forEach((S) => {
      i && S.removeEventListener("scroll", e), s && S.removeEventListener("resize", e);
    }), h == null || h(), (v = p) == null || v.disconnect(), p = null, l && cancelAnimationFrame(m);
  };
}
const ed = lb, zb = cb, Pb = nb, Bb = ub, $b = rb, jb = eb, Fb = sb, Hb = (r, t, e) => {
  const n = /* @__PURE__ */ new Map(), i = {
    platform: qb,
    ...e
  }, s = {
    ...i.platform,
    _c: n
  };
  return tb(r, t, {
    ...i,
    platform: s
  });
};
let ps = class zi {
  constructor() {
    this.floatingElements = /* @__PURE__ */ new Map(), this.bindEvents();
  }
  static getInstance() {
    return zi.instance || (zi.instance = new zi()), zi.instance;
  }
  /**
   * Create a floating element with proper anchoring to trigger
   */
  createFloating(t, e, n = {}) {
    if (n.useFloating === !1)
      return this.createFallbackFloating(t, e, n);
    const i = this.generateFloatingId(), s = [];
    if (n.offset !== void 0 ? s.push(ed(n.offset)) : s.push(ed(8)), n.inline) {
      const h = typeof n.inline == "object" ? n.inline : {};
      s.push(Fb(h));
    }
    if (n.flip !== !1) {
      const h = typeof n.flip == "object" ? n.flip : {};
      s.push(Pb({
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        fallbackPlacements: h.fallbackPlacements || this.getFallbackPlacements(n.placement || "bottom"),
        fallbackStrategy: h.fallbackStrategy || n.fallbackStrategy || "bestFit",
        padding: h.padding || 8
      }));
    }
    if (n.shift !== !1) {
      const h = typeof n.shift == "object" ? n.shift : {};
      s.push(zb({
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        padding: h.padding || 8,
        limiter: h.limiter,
        crossAxis: h.crossAxis !== !1
      }));
    }
    if (n.size) {
      const h = typeof n.size == "object" ? n.size : {};
      s.push(Bb({
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        padding: h.padding || 8,
        apply: h.apply || (({ availableWidth: f, availableHeight: p }) => {
          Object.assign(e.style, {
            maxWidth: `${f}px`,
            maxHeight: `${p}px`
          });
        })
      }));
    }
    if (n.hide !== !1) {
      const h = typeof n.hide == "object" ? n.hide : {};
      s.push($b({
        strategy: h.strategy || "referenceHidden",
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        padding: h.padding || 8
      }));
    }
    n.arrow && n.arrow !== !0 && s.push(jb({ element: n.arrow }));
    const a = async () => {
      const { x: h, y: f, placement: p, middlewareData: m } = await Hb(t, e, {
        placement: n.placement || "bottom-start",
        strategy: n.strategy || "absolute",
        middleware: s
      }), y = this.floatingElements.get(i);
      if (y && (y.x = h, y.y = f, y.placement = p, y.middlewareData = m), Object.assign(e.style, {
        left: `${h}px`,
        top: `${f}px`,
        position: n.strategy || "absolute"
      }), e.setAttribute("data-floating-placement", p), m.hide) {
        const { referenceHidden: w, escaped: v } = m.hide;
        e.style.visibility = w || v ? "hidden" : "visible";
      }
      if (n.arrow && n.arrow !== !0 && m.arrow) {
        const w = n.arrow, { x: v, y: S } = m.arrow, A = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        }[p.split("-")[0]];
        Object.assign(w.style, {
          left: v != null ? `${v}px` : "",
          top: S != null ? `${S}px` : "",
          right: "",
          bottom: "",
          [A]: "-4px"
        });
      }
    }, o = n.autoUpdate !== !1 ? typeof n.autoUpdate == "object" ? n.autoUpdate : {} : null;
    let l = null;
    o && (l = Rb(t, e, a, {
      ancestorScroll: o.ancestorScroll !== !1,
      ancestorResize: o.ancestorResize !== !1,
      elementResize: o.elementResize !== !1,
      layoutShift: o.layoutShift !== !1,
      animationFrame: o.animationFrame === !0
    }));
    const u = {
      id: i,
      trigger: t,
      floating: e,
      cleanup: () => {
        l && l(), this.destroyFloating(i);
      },
      update: a
    };
    return this.floatingElements.set(i, u), a(), u;
  }
  /**
   * Create fallback floating element when Floating UI is disabled
   * Uses CSS-based positioning as fallback
   */
  createFallbackFloating(t, e, n = {}) {
    const i = this.generateFloatingId(), s = async () => {
      const c = t.getBoundingClientRect(), u = e.getBoundingClientRect();
      let h = 0, f = 0;
      const p = n.placement || "bottom-start", m = typeof n.offset == "number" ? n.offset : 8;
      p.startsWith("bottom") ? h = c.bottom + m : p.startsWith("top") ? h = c.top - u.height - m : p.startsWith("right") ? f = c.right + m : p.startsWith("left") && (f = c.left - u.width - m), p.includes("start") ? p.startsWith("top") || p.startsWith("bottom") ? f = c.left : h = c.top : p.includes("end") ? p.startsWith("top") || p.startsWith("bottom") ? f = c.right - u.width : h = c.bottom - u.height : p.startsWith("top") || p.startsWith("bottom") ? f = c.left + (c.width - u.width) / 2 : h = c.top + (c.height - u.height) / 2, Object.assign(e.style, {
        position: "fixed",
        top: `${h}px`,
        left: `${f}px`
      }), e.setAttribute("data-floating-placement", p);
    }, o = {
      id: i,
      trigger: t,
      floating: e,
      cleanup: () => {
        this.destroyFloating(i);
      },
      update: s
    };
    this.floatingElements.set(i, o), s();
    const l = () => s();
    return window.addEventListener("resize", l), window.addEventListener("scroll", l, !0), o.cleanup = () => {
      window.removeEventListener("resize", l), window.removeEventListener("scroll", l, !0), this.destroyFloating(i);
    }, o;
  }
  /**
   * Destroy a specific floating element
   */
  destroyFloating(t) {
    this.floatingElements.get(t) && this.floatingElements.delete(t);
  }
  /**
   * Destroy all floating elements
   */
  destroyAllFloating() {
    this.floatingElements.forEach((t) => {
      t.cleanup();
    }), this.floatingElements.clear();
  }
  /**
   * Get a floating instance by ID
   */
  getFloating(t) {
    return this.floatingElements.get(t);
  }
  /**
   * Update all floating elements
   */
  async updateAllFloating() {
    const t = Array.from(this.floatingElements.values()).map(
      (e) => e.update()
    );
    await Promise.all(t);
  }
  /**
   * Generate unique floating ID
   */
  generateFloatingId() {
    return `floating-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Get fallback placements for flip middleware
   */
  getFallbackPlacements(t) {
    return {
      bottom: ["top", "bottom-end", "bottom-start"],
      "bottom-start": ["top-start", "bottom-end", "bottom"],
      "bottom-end": ["top-end", "bottom-start", "bottom"],
      top: ["bottom", "top-end", "top-start"],
      "top-start": ["bottom-start", "top-end", "top"],
      "top-end": ["bottom-end", "top-start", "top"],
      right: ["left", "right-end", "right-start"],
      "right-start": ["left-start", "right-end", "right"],
      "right-end": ["left-end", "right-start", "right"],
      left: ["right", "left-end", "left-start"],
      "left-start": ["right-start", "left-end", "left"],
      "left-end": ["right-end", "left-start", "left"]
    }[t] || ["bottom", "top", "right", "left"];
  }
  /**
   * Bind global events for floating management
   */
  bindEvents() {
    window.addEventListener("beforeunload", () => {
      this.destroyAllFloating();
    }), document.addEventListener("keydown", (t) => {
      t.key;
    });
  }
  /**
   * Cleanup manager and all floating elements
   */
  destroy() {
    this.destroyAllFloating();
  }
};
const vO = ps.getInstance();
let Bt = class {
  /**
   * Check if Livewire is available globally
   */
  static isLivewireAvailable() {
    return typeof window < "u" && "Livewire" in window;
  }
  /**
   * Detect if a select element is Livewire-enabled
   */
  static isLivewireEnabled(t) {
    return t.dataset.livewireEnabled === "true" || t.dataset.livewireMode === "true" || !!t.dataset.wireModel;
  }
  /**
   * Get the Livewire component for a select element
   */
  static getLivewireComponent(t) {
    if (!this.isLivewireAvailable()) return null;
    const e = t.closest("[wire\\:id]");
    return e ? window.Livewire.find(e.getAttribute("wire:id")) : null;
  }
  /**
   * Get the wire:model property name
   */
  static getWireModelProperty(t) {
    return t.dataset.wireModel || t.dataset.livewireProperty || null;
  }
  /**
   * Update Livewire property value
   */
  static updateLivewireProperty(t, e) {
    const n = this.getLivewireComponent(t), i = this.getWireModelProperty(t);
    if (!(!n || !i))
      try {
        n.set(i, e);
      } catch (s) {
        console.warn("Failed to update Livewire property:", i, s);
      }
  }
  /**
   * Get current value from Livewire property
   */
  static getLivewirePropertyValue(t) {
    const e = this.getLivewireComponent(t), n = this.getWireModelProperty(t);
    if (!e || !n) return null;
    try {
      return e.get(n);
    } catch (i) {
      return console.warn("Failed to get Livewire property value:", n, i), null;
    }
  }
  /**
   * Setup Livewire event listeners
   */
  static setupEventListeners(t, e) {
    if (!this.isLivewireAvailable()) return;
    const n = t.closest("[wire\\:id]");
    n && (document.addEventListener("livewire:update", (i) => {
      i.detail.component.id === n.getAttribute("wire:id") && e({
        type: "livewire:update",
        component: i.detail.component,
        element: t
      });
    }), document.addEventListener("livewire:morph.updated", () => {
      e({
        type: "livewire:morph.updated",
        element: t
      });
    }));
  }
  /**
   * Format value for Livewire (arrays vs strings)
   */
  static formatValueForLivewire(t, e) {
    return e ? Array.isArray(t) ? t : [] : Array.isArray(t) ? t[0] || "" : t || "";
  }
  /**
   * Parse value from Livewire property
   */
  static parseValueFromLivewire(t, e) {
    if (e) {
      if (Array.isArray(t)) return t.map((n) => String(n));
      if (typeof t == "string")
        try {
          const n = JSON.parse(t);
          return Array.isArray(n) ? n.map((i) => String(i)) : [];
        } catch {
          return [];
        }
      return [];
    } else
      return t ? [String(t)] : [];
  }
};
class Fc extends ht {
  /**
   * Initialize select elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("select", "true").forEach((t) => {
      this.initializeSelect(t);
    });
  }
  /**
   * Initialize a single select element
   */
  initializeSelect(t) {
    const e = t.dataset.multiple === "true", n = Bt.isLivewireEnabled(t);
    let i = [];
    n ? i = this.readLivewireInitialValues(t, e) : i = this.readInitialValues(t, e);
    const s = {
      isOpen: !1,
      selectedValues: i,
      searchTerm: "",
      focusedIndex: -1,
      filteredOptions: []
    };
    n && this.setupLivewireIntegration(t, s), this.setState(t, s), this.updateOptions(t), this.updateOptionsSelectedState(t), this.updateDisplay(t), this.updateStableInputs(t);
  }
  /**
   * Read initial values from stable inputs
   */
  readInitialValues(t, e) {
    if (e) {
      const n = b.querySelectorAll(".select-pool-input", t), i = [];
      return n.forEach((s) => {
        s.dataset.poolActive === "true" && s.value && i.push(s.value);
      }), i;
    } else {
      const n = b.querySelector(".select-single-input", t);
      return n && n.value ? [n.value] : [];
    }
  }
  /**
   * Read initial values from Livewire property
   */
  readLivewireInitialValues(t, e) {
    const n = Bt.getLivewirePropertyValue(t);
    return Bt.parseValueFromLivewire(n, e);
  }
  /**
   * Setup Livewire integration for a select element
   */
  setupLivewireIntegration(t, e) {
    const n = Bt.getWireModelProperty(t);
    n && (e.livewireComponent = Bt.getLivewireComponent(t), e.livewireProperty = n, Bt.setupEventListeners(t, (i) => {
      this.handleLivewireEvent(t, i);
    }));
  }
  /**
   * Handle Livewire events (update, morph, etc.)
   */
  handleLivewireEvent(t, e) {
    if (this.getState(t))
      switch (e.type) {
        case "livewire:update":
          this.syncFromLivewire(t);
          break;
        case "livewire:morph.updated":
          this.reinitializeAfterMorph(t);
          break;
      }
  }
  /**
   * Synchronize state from Livewire to JavaScript
   */
  syncFromLivewire(t) {
    const e = this.getState(t);
    if (!e || !e.livewireProperty) return;
    const n = t.dataset.multiple === "true", i = Bt.getLivewirePropertyValue(t), s = Bt.parseValueFromLivewire(i, n);
    JSON.stringify(e.selectedValues) !== JSON.stringify(s) && (e.selectedValues = s, this.setState(t, e), this.updateDisplay(t), this.updateOptionsSelectedState(t), this.updateStableInputs(t));
  }
  /**
   * Synchronize state from JavaScript to Livewire
   */
  syncToLivewire(t) {
    const e = this.getState(t);
    if (!e || !Bt.isLivewireEnabled(t)) return;
    const n = t.dataset.multiple === "true", i = Bt.formatValueForLivewire(e.selectedValues, n);
    Bt.updateLivewireProperty(t, i);
  }
  /**
   * Reinitialize select after DOM morphing
   */
  reinitializeAfterMorph(t) {
    b.findByDataAttribute("select", "true").includes(t) && (this.hasState(t) || this.initializeSelect(t));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-chip-remove]", (t, e) => {
      e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
      const n = t.dataset.chipValue, i = b.findClosest(t, '[data-select="true"]');
      i && n && this.removeChip(i, n);
    }), D.handleDelegatedClick("[data-select-clear] button", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = b.findClosest(t, '[data-select="true"]');
      n && this.clearSelection(n);
    }), D.handleDelegatedClick("[data-select-option]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = b.findClosest(t, '[data-select="true"]');
      n && this.selectOption(n, t);
    }), D.handleDelegatedClick("[data-select-trigger]", (t, e) => {
      if (e.target.closest("[data-select-clear]"))
        return;
      e.preventDefault(), e.stopPropagation();
      const s = b.findClosest(t, '[data-select="true"]');
      s && !this.isDisabled(s) && this.toggleDropdown(s);
    }), D.addEventListener(document, "click", (t) => {
      const e = t.target;
      if (e && e instanceof Element) {
        const n = e.closest('[data-select="true"], [data-select-dropdown], [data-select-search], [data-chip-remove], [data-select-clear], [data-select-option], [data-select-trigger]'), i = e.matches("input, button") && e.closest('[data-select="true"]');
        if (n || i)
          return;
        this.closeAllDropdowns();
      }
    }), D.handleDelegatedInput('input[type="text"]', (t, e) => {
      const n = b.findClosest(t, '[data-select="true"]'), i = n && n.dataset.searchable === "true", s = t.closest("[data-select-dropdown]");
      n && i && s && this.handleDebouncedSearch(n, t.value);
    }), D.handleDelegatedKeydown('[data-select="true"]', (t, e) => {
      this.handleKeydown(t, e);
    }), D.handleDelegatedFocus('[data-select="true"]', (t, e) => {
      this.isOpen(t);
    });
  }
  /**
   * Setup dynamic observer for new selects - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "select", "true") && (this.hasState(n) || this.initializeSelect(n)), b.findByDataAttribute("select", "true", n).forEach((s) => {
            this.hasState(s) || this.initializeSelect(s);
          });
        }
      });
    });
  }
  /**
   * Toggle dropdown open/closed state
   */
  toggleDropdown(t) {
    const e = this.getState(t);
    e && (e.isOpen ? this.closeDropdown(t) : this.openDropdown(t));
  }
  /**
   * Open dropdown
   */
  openDropdown(t) {
    const e = this.getState(t);
    if (!e || this.isDisabled(t)) return;
    this.closeAllDropdowns(), e.isOpen = !0, this.setState(t, e), t.setAttribute("data-dropdown-state", "open");
    const n = b.querySelector("[data-select-dropdown]", t), i = b.querySelector("[data-select-trigger]", t), s = b.querySelector("[data-select-search]", t);
    if (n && (n.classList.remove("hidden"), this.setupFloating(t, n)), i) {
      i.setAttribute("aria-expanded", "true");
      const a = b.querySelector(".select-arrow", i);
      a && a.classList.add("rotate-180");
    }
    s && t.dataset.searchable === "true" && setTimeout(() => s.focus(), 10), this.updateFilteredOptions(t), this.dispatchSelectEvent(t, "select:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen)
      return;
    this.cleanupFloating(t), e.isOpen = !1, e.searchTerm = "", e.focusedIndex = -1, this.setState(t, e), t.setAttribute("data-dropdown-state", "closed");
    const n = b.querySelector("[data-select-dropdown]", t), i = b.querySelector("[data-select-trigger]", t), s = b.querySelector("[data-select-search]", t);
    if (n && n.classList.add("hidden"), i) {
      i.setAttribute("aria-expanded", "false");
      const a = b.querySelector(".select-arrow", i);
      a && a.classList.remove("rotate-180");
    }
    s && (s.value = ""), this.handleSearch(t, ""), this.dispatchSelectEvent(t, "select:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.getAllStates().forEach((t, e) => {
      t.isOpen && this.closeDropdown(e);
    });
  }
  /**
   * Handle option selection
   */
  selectOption(t, e) {
    const n = this.getState(t), i = e.dataset.value;
    if (!n || !i || e.getAttribute("aria-disabled") === "true")
      return;
    const s = t.dataset.multiple === "true";
    if (s) {
      const a = n.selectedValues.indexOf(i);
      a > -1 ? n.selectedValues.splice(a, 1) : n.selectedValues.push(i);
    } else
      n.selectedValues = [i], this.closeDropdown(t);
    this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), Bt.isLivewireEnabled(t) && this.syncToLivewire(t), this.dispatchSelectEvent(t, "select:change", {
      value: s ? n.selectedValues : i,
      selectedValues: n.selectedValues
    });
  }
  /**
   * Remove chip (for multiple selection)
   */
  removeChip(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = n.selectedValues.indexOf(e);
    if (i > -1) {
      n.selectedValues.splice(i, 1), this.setState(t, n);
      const s = b.querySelector(`[data-chip-value="${e}"]`, t);
      s && (s.style.transition = "all 200ms ease-out", s.style.opacity = "0", s.style.transform = "scale(0.8)", setTimeout(() => {
        s.parentNode && s.remove();
      }, 200)), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), Bt.isLivewireEnabled(t) && this.syncToLivewire(t), this.dispatchSelectEvent(t, "select:change", {
        value: n.selectedValues,
        selectedValues: n.selectedValues
      });
    }
  }
  /**
   * Clear all selections
   */
  clearSelection(t) {
    const e = this.getState(t);
    e && (e.selectedValues = [], this.setState(t, e), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), Bt.isLivewireEnabled(t) && this.syncToLivewire(t), this.dispatchSelectEvent(t, "select:change", {
      value: t.dataset.multiple === "true" ? [] : "",
      selectedValues: []
    }));
  }
  /**
   * Handle debounced search functionality
   */
  handleDebouncedSearch(t, e) {
    const n = this.getState(t);
    n && (n.searchTimeout && clearTimeout(n.searchTimeout), n.searchTimeout = window.setTimeout(() => {
      this.handleSearch(t, e);
    }, 150), this.setState(t, n));
  }
  /**
   * Handle search functionality
   */
  handleSearch(t, e) {
    const n = this.getState(t);
    n && (n.searchTerm = e.toLowerCase(), this.setState(t, n), t.setAttribute("data-search-active", n.searchTerm ? "true" : "false"), t.setAttribute("data-search-term", n.searchTerm), this.updateFilteredOptions(t), this.updateOptionsVisibility(t));
  }
  /**
   * Update filtered options based on search term
   */
  updateFilteredOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = this.getAllOptions(t);
    e.searchTerm ? e.filteredOptions = n.filter(
      (i) => i.searchableText.includes(e.searchTerm)
    ) : e.filteredOptions = n, this.setState(t, e);
  }
  /**
   * Update options visibility based on filter
   */
  updateOptionsVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelectorAll("[data-select-option]", t), i = b.querySelector("[data-select-no-results]", t);
    let s = 0;
    n.forEach((a) => {
      const o = a, l = o.dataset.value || "";
      e.filteredOptions.some((u) => u.value === l) ? (o.style.display = "", s++) : o.style.display = "none";
    }), i && (s === 0 && e.searchTerm ? i.classList.remove("hidden") : i.classList.add("hidden")), t.setAttribute("data-visible-options", s.toString()), t.setAttribute("data-has-results", s > 0 ? "true" : "false"), t.setAttribute("data-show-no-results", s === 0 && e.searchTerm ? "true" : "false");
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const n = this.getState(t);
    if (n)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!n.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (n.focusedIndex >= 0) {
            e.preventDefault();
            const i = n.filteredOptions[n.focusedIndex];
            i && this.selectOption(t, i.element);
          }
          break;
        case "Escape":
          if (n.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const i = b.querySelector("[data-select-trigger]", t);
            i && i.focus();
          }
          break;
        case "ArrowDown":
          n.isOpen ? (e.preventDefault(), this.navigateOptions(t, 1)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "ArrowUp":
          n.isOpen && (e.preventDefault(), this.navigateOptions(t, -1));
          break;
        case "Tab":
          n.isOpen && this.closeDropdown(t);
          break;
      }
  }
  /**
   * Navigate through options with arrow keys
   */
  navigateOptions(t, e) {
    const n = this.getState(t);
    if (!n || !n.isOpen) return;
    const i = n.filteredOptions.length;
    i !== 0 && (n.focusedIndex === -1 ? n.focusedIndex = e > 0 ? 0 : i - 1 : (n.focusedIndex += e, n.focusedIndex >= i ? n.focusedIndex = 0 : n.focusedIndex < 0 && (n.focusedIndex = i - 1)), this.setState(t, n), this.updateOptionFocus(t));
  }
  /**
   * Update visual focus state of options
   */
  updateOptionFocus(t) {
    const e = this.getState(t);
    if (!e) return;
    b.querySelectorAll("[data-select-option]", t).forEach((i, s) => {
      const a = i;
      s === e.focusedIndex ? (a.classList.add("bg-neutral-100", "dark:bg-neutral-800"), a.scrollIntoView({ block: "nearest" })) : a.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update display of selected values
   */
  updateDisplay(t) {
    if (!this.getState(t)) return;
    t.dataset.multiple === "true" ? this.updateChipsDisplay(t) : this.updateSingleValueDisplay(t), this.updateClearButtonVisibility(t);
  }
  /**
   * Update clear button visibility based on selection state
   */
  updateClearButtonVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector("[data-select-clear]", t);
    if (!n) return;
    const i = e.selectedValues.length > 0, s = t.dataset.disabled === "true", a = t.dataset.clearable === "true";
    i && !s && a ? (n.classList.remove("opacity-0", "pointer-events-none"), n.classList.add("opacity-100", "pointer-events-auto")) : (n.classList.remove("opacity-100", "pointer-events-auto"), n.classList.add("opacity-0", "pointer-events-none"));
  }
  /**
   * Update chips display for multiple selection - creates/removes chips dynamically
   */
  updateChipsDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector("[data-select-chips]", t);
    if (!n) return;
    const i = b.querySelectorAll('[data-select-chip="true"]', n), s = b.querySelector("[data-select-placeholder]", n);
    if (e.selectedValues.length === 0)
      if (i.forEach((a) => a.remove()), s)
        s.style.display = "inline";
      else {
        const a = t.dataset.placeholder || "Select options...", o = document.createElement("span");
        o.className = "text-neutral-500 select-placeholder", o.setAttribute("data-select-placeholder", "true"), o.textContent = a, n.appendChild(o);
      }
    else {
      s && (s.style.display = "none");
      const a = Array.from(i).map(
        (o) => o.dataset.chipValue
      ).filter((o) => o);
      i.forEach((o) => {
        const l = o.dataset.chipValue;
        l && !e.selectedValues.includes(l) && o.remove();
      }), e.selectedValues.forEach((o) => {
        a.includes(o) || this.createChipElement(t, n, o);
      });
    }
  }
  /**
   * Create a new chip element for a selected value
   */
  createChipElement(t, e, n) {
    const i = t.dataset.name || t.id || "select", s = this.findOptionByValue(t, n), a = s ? s.displayLabel : n, o = t.dataset.clearable === "true", l = t.dataset.disabled === "true", c = o && !l, u = document.createElement("span");
    u.className = "inline-flex items-center font-medium px-2 py-0.5 text-xs rounded-sm bg-brand text-white", u.setAttribute("data-select-chip", "true"), u.setAttribute("data-chip-value", n), u.setAttribute("data-variant", "chip"), u.setAttribute("data-color", "brand"), u.setAttribute("data-size", "xs"), u.setAttribute("data-badge-id", `chip-${i}-${n}`), u.id = `chip-${i}-${n}`, c ? u.innerHTML = `
                <span class="chip-label">${a}</span>
                <button type="button" class="ml-1.5 p-0.5 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-white/30" data-chip-remove data-chip-value="${n}">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="sr-only">Remove ${a}</span>
                </button>
            ` : u.innerHTML = `<span class="chip-label">${a}</span>`, e.appendChild(u);
  }
  /**
   * Update single value display
   */
  updateSingleValueDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector(".select-value", t);
    if (n)
      if (e.selectedValues.length === 0) {
        const i = t.dataset.placeholder || "Select option...";
        n.innerHTML = `<span class="text-neutral-500 select-placeholder">${i}</span>`;
      } else {
        const i = e.selectedValues[0], s = this.findOptionByValue(t, i), a = s ? s.displayLabel : i;
        n.textContent = a;
      }
  }
  /**
   * Update stable inputs - with Livewire integration support
   */
  updateStableInputs(t, e, n) {
    const i = e || this.getState(t);
    if (!i) return;
    const s = n ?? t.dataset.multiple === "true";
    Bt.isLivewireEnabled(t) ? this.syncToLivewire(t) : s ? this.updateMultipleInputPool(t, i.selectedValues) : this.updateSingleInput(t, i.selectedValues[0] || "");
  }
  /**
   * Update single input value (for single select)
   */
  updateSingleInput(t, e) {
    const n = b.querySelector(".select-single-input", t);
    n && n.value !== e && (n.value = e, n.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  /**
   * Update multiple input pool (for multiple select)
   */
  updateMultipleInputPool(t, e) {
    const n = b.querySelectorAll(".select-pool-input", t);
    n.forEach((s, a) => {
      const o = a < e.length, l = o ? e[a] : "";
      s.value !== l && (s.value = l), s.dataset.poolActive = o ? "true" : "false", s.style.display = o ? "" : "none";
    });
    const i = n[0];
    i && i.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Update options selected state attributes
   */
  updateOptionsSelectedState(t) {
    const e = this.getState(t);
    if (!e) return;
    b.querySelectorAll("[data-select-option]", t).forEach((i) => {
      var l, c, u, h;
      const s = i, a = s.dataset.value || "", o = e.selectedValues.includes(a);
      if (s.setAttribute("aria-selected", o ? "true" : "false"), o) {
        s.classList.add("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const f = b.querySelector(".text-brand-600", s);
        f && ((l = f.parentElement) == null || l.classList.remove("opacity-0"), (c = f.parentElement) == null || c.classList.add("opacity-100"));
      } else {
        s.classList.remove("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const f = b.querySelector(".text-brand-600", s);
        f && ((u = f.parentElement) == null || u.classList.add("opacity-0"), (h = f.parentElement) == null || h.classList.remove("opacity-100"));
      }
    });
  }
  /**
   * Update options list
   */
  updateOptions(t) {
    const e = this.getAllOptions(t), n = this.getState(t);
    n && (n.filteredOptions = e, this.setState(t, n));
  }
  /**
   * Get all options from select element
   */
  getAllOptions(t) {
    const e = b.querySelectorAll("[data-select-option]", t);
    return Array.from(e).map((n) => {
      var a, o;
      const i = n, s = i.dataset.displayLabel || ((a = i.textContent) == null ? void 0 : a.trim()) || "";
      return {
        element: i,
        value: i.dataset.value || "",
        label: ((o = i.textContent) == null ? void 0 : o.trim()) || "",
        displayLabel: s,
        searchableText: i.dataset.searchableText || "",
        disabled: i.getAttribute("aria-disabled") === "true"
      };
    });
  }
  /**
   * Find option by value
   */
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((i) => i.value === e) || null;
  }
  /**
   * Check if select is disabled
   */
  isDisabled(t) {
    return t.dataset.disabled === "true";
  }
  /**
   * Check if dropdown is open
   */
  isOpen(t) {
    const e = this.getState(t);
    return e ? e.isOpen : !1;
  }
  /**
   * Dispatch custom select event
   */
  dispatchSelectEvent(t, e, n = null) {
    D.dispatchCustomEvent(t, e, {
      select: t,
      ...n
    }, {
      bubbles: !0
    });
  }
  /**
   * Get select state (for external access)
   */
  getSelectState(t) {
    return this.getState(t) || null;
  }
  /**
   * Set selected values programmatically
   */
  setSelectedValues(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = t.dataset.multiple === "true";
    n.selectedValues = i ? e : e.slice(0, 1), this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: i ? n.selectedValues : n.selectedValues[0] || "",
      selectedValues: n.selectedValues
    });
  }
  /**
   * Set select value programmatically (external API)
   */
  setSelectValue(t, e) {
    const n = Array.isArray(e) ? e : [e];
    this.setSelectedValues(t, n);
  }
  /**
   * Get current select value (external API)
   */
  getSelectValue(t) {
    const e = this.getState(t);
    return e ? t.dataset.multiple === "true" ? e.selectedValues : e.selectedValues[0] || null : null;
  }
  /**
   * Setup floating for dropdown using Floating UI
   */
  setupFloating(t, e) {
    const n = this.getState(t);
    if (!n) return;
    this.cleanupFloating(t);
    const i = b.querySelector("[data-select-trigger]", t);
    if (!i) return;
    const s = t.dataset.floatingPlacement || "bottom-start", a = parseInt(t.dataset.floatingOffset || "4", 10), o = ps.getInstance().createFloating(i, e, {
      placement: s,
      offset: a,
      flip: {
        fallbackStrategy: "bestFit",
        padding: 8
      },
      shift: {
        padding: 8,
        crossAxis: !0
      },
      size: {
        apply: ({ availableHeight: l }) => {
          const c = b.querySelector("[data-select-options]", e);
          c && Object.assign(c.style, {
            maxHeight: `${Math.min(l - 20, 320)}px`,
            overflowY: "auto"
          });
        }
      },
      hide: {
        strategy: "escaped"
      },
      autoUpdate: {
        ancestorScroll: !0,
        ancestorResize: !0,
        elementResize: !0,
        layoutShift: !0
      }
    });
    n.floating = o, this.setState(t, n);
  }
  /**
   * Clean up floating for select
   */
  cleanupFloating(t) {
    const e = this.getState(t);
    e && (e.floating && (e.floating.cleanup(), e.floating = void 0), this.setState(t, e));
  }
  /**
   * Clean up SelectActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.getAllStates().forEach((t, e) => {
      this.cleanupFloating(e), t.searchTimeout && clearTimeout(t.searchTimeout);
    });
  }
}
Fc.getInstance();
class Hc extends ht {
  constructor() {
    super(...arguments), this.resizeCleanup = null;
  }
  /**
   * Initialize tabs elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("tabs", "true").forEach((t) => {
      this.initializeTabsElement(t);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(t) {
    const e = t.dataset.orientation || "horizontal", n = t.dataset.variant || "default", i = t.dataset.disabled === "true", s = t.dataset.value, a = Array.from(b.querySelectorAll('[data-tabs-trigger="true"]', t)), o = Array.from(b.querySelectorAll('[data-tabs-panel="true"]', t));
    let l = s || null;
    if (!l && a.length > 0) {
      const u = a.find((h) => h.getAttribute("aria-disabled") !== "true");
      l = (u == null ? void 0 : u.dataset.value) || null;
    }
    const c = {
      activeTab: l,
      tabs: a,
      panels: o,
      orientation: e,
      variant: n,
      disabled: i
    };
    this.setState(t, c), this.updateTabsState(t), this.initializeMarker(t), t.classList.add("tabs-initialized");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick('[data-tabs-trigger="true"]', (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-tabs="true"]');
      n && t.getAttribute("aria-disabled") !== "true" && this.activateTab(n, t.dataset.value || "");
    }), D.handleDelegatedKeydown('[data-tabs-trigger="true"]', (t, e) => {
      const n = b.findClosest(t, '[data-tabs="true"]');
      n && this.handleKeydown(n, e);
    }), this.resizeCleanup = D.handleResize(() => {
      this.handleResize();
    }, 100);
  }
  /**
   * Setup dynamic observer for new tabs - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "tabs", "true") && (this.hasState(n) || this.initializeTabsElement(n)), b.findByDataAttribute("tabs", "true", n).forEach((s) => {
            this.hasState(s) || this.initializeTabsElement(s);
          });
        }
      });
    });
  }
  /**
   * Activate a specific tab
   */
  activateTab(t, e, n = !1) {
    const i = this.getState(t);
    if (!i || i.disabled) return;
    const s = i.tabs.find((o) => o.dataset.value === e);
    if (!s || s.getAttribute("aria-disabled") === "true")
      return;
    const a = i.activeTab;
    i.activeTab = e, this.setState(t, i), this.updateTabsState(t), this.repositionMarker(t, s), n && s.focus(), D.dispatchCustomEvent(t, "tabs:change", {
      tabs: t,
      activeTab: e,
      previousTab: a
    });
  }
  /**
   * Update tabs visual state and panel visibility
   */
  updateTabsState(t) {
    const e = this.getState(t);
    e && (e.tabs.forEach((n) => {
      const i = n.dataset.value === e.activeTab, s = n.getAttribute("aria-disabled") === "true";
      n.setAttribute("aria-selected", i ? "true" : "false"), n.setAttribute("data-state", i ? "active" : "inactive"), s ? n.setAttribute("tabindex", "-1") : i ? n.setAttribute("tabindex", "0") : n.setAttribute("tabindex", "-1"), n.id = `tab-${n.dataset.value}`;
    }), e.panels.forEach((n) => {
      const i = n.dataset.value === e.activeTab;
      n.setAttribute("data-state", i ? "active" : "inactive"), n.style.display = i ? "block" : "none", n.setAttribute("aria-labelledby", `tab-${n.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const n = this.getState(t);
    if (!n || n.disabled) return;
    const i = e.target, s = n.tabs.indexOf(i);
    let a = -1;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault(), a = n.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(n, s) : e.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(n, s) : s;
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault(), a = n.orientation === "horizontal" ? this.getNextEnabledTabIndex(n, s) : e.key === "ArrowDown" ? this.getNextEnabledTabIndex(n, s) : s;
        break;
      case "Home":
        e.preventDefault(), a = this.getFirstEnabledTabIndex(n);
        break;
      case "End":
        e.preventDefault(), a = this.getLastEnabledTabIndex(n);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), i.dataset.value && this.activateTab(t, i.dataset.value, !0);
        return;
    }
    if (a >= 0 && a < n.tabs.length) {
      const o = n.tabs[a];
      o.dataset.value && this.activateTab(t, o.dataset.value, !0);
    }
  }
  /**
   * Get next enabled tab index
   */
  getNextEnabledTabIndex(t, e) {
    for (let n = 1; n < t.tabs.length; n++) {
      const i = (e + n) % t.tabs.length;
      if (t.tabs[i].getAttribute("aria-disabled") !== "true")
        return i;
    }
    return e;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(t, e) {
    for (let n = 1; n < t.tabs.length; n++) {
      const i = (e - n + t.tabs.length) % t.tabs.length;
      if (t.tabs[i].getAttribute("aria-disabled") !== "true")
        return i;
    }
    return e;
  }
  /**
   * Get first enabled tab index
   */
  getFirstEnabledTabIndex(t) {
    for (let e = 0; e < t.tabs.length; e++)
      if (t.tabs[e].getAttribute("aria-disabled") !== "true")
        return e;
    return 0;
  }
  /**
   * Get last enabled tab index
   */
  getLastEnabledTabIndex(t) {
    for (let e = t.tabs.length - 1; e >= 0; e--)
      if (t.tabs[e].getAttribute("aria-disabled") !== "true")
        return e;
    return t.tabs.length - 1;
  }
  /**
   * Get tabs state (for external access)
   */
  getTabsState(t) {
    return this.getState(t) || null;
  }
  /**
   * Set active tab programmatically
   */
  setActiveTab(t, e, n = !1) {
    this.activateTab(t, e, n);
  }
  /**
   * Initialize marker position for the active tab
   */
  initializeMarker(t) {
    const e = this.getState(t);
    if (!e || !e.activeTab) return;
    const n = e.tabs.find((i) => i.dataset.value === e.activeTab);
    n && AnimationUtils.createTimer(() => {
      this.repositionMarker(t, n);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = b.querySelector('[data-tab-marker="true"]', t);
    if (!i) return;
    const { orientation: s, variant: a } = n;
    s === "vertical" ? this.repositionVerticalMarker(i, e, a) : this.repositionHorizontalMarker(i, e, a);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(t, e, n) {
    const i = e.offsetWidth, s = e.offsetLeft;
    if (t.style.width = `${i}px`, n === "pills") {
      const a = e.offsetHeight, o = e.offsetTop;
      t.style.height = `${a}px`, t.style.transform = `translate(${s}px, ${o}px)`;
    } else
      t.style.transform = `translateX(${s}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(t, e, n) {
    const i = e.offsetHeight, s = e.offsetTop;
    if (t.style.height = `${i}px`, n === "pills") {
      const a = e.offsetWidth, o = e.offsetLeft;
      t.style.width = `${a}px`, t.style.transform = `translate(${o}px, ${s}px)`;
    } else
      t.style.transform = `translateY(${s}px)`;
  }
  /**
   * Handle window resize - reposition all markers
   */
  handleResize() {
    this.getAllStates().forEach((t, e) => {
      if (t.activeTab) {
        const n = t.tabs.find((i) => i.dataset.value === t.activeTab);
        n && this.repositionMarker(e, n);
      }
    });
  }
  /**
   * Clean up TabsActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.resizeCleanup && (this.resizeCleanup(), this.resizeCleanup = null);
  }
}
Hc.getInstance();
class Uc extends ht {
  /**
   * Initialize modal elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll("dialog[data-modal]").forEach((t) => {
      this.initializeModal(t);
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single modal element
   */
  initializeModal(t) {
    if (this.hasState(t))
      return;
    const e = {
      lastFocusedElement: null
    };
    this.setState(t, e), t.addEventListener("close", () => {
      this.handleModalClose(t);
    }), t.addEventListener("cancel", (n) => {
      this.handleModalCancel(t, n);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[commandfor]", (t, e) => {
      const n = t.getAttribute("command"), i = t.getAttribute("commandfor");
      if (n === "show-modal" && i) {
        const s = b.getElementById(i);
        s && s.matches("dialog[data-modal]") && this.handleModalOpen(s, t);
      }
    }), D.handleDelegatedClick("[data-modal-close]", (t, e) => {
      const n = b.findClosest(t, "dialog[data-modal]");
      n && n.close();
    });
  }
  /**
   * Setup dynamic observer for new modals - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          n.matches && n.matches("dialog[data-modal]") && this.initializeModal(n), b.querySelectorAll("dialog[data-modal]", n).forEach((s) => {
            this.initializeModal(s);
          });
        }
      });
    });
  }
  /**
   * Handle modal cancel event (ESC key)
   */
  handleModalCancel(t, e) {
    this.dispatchModalEvent(t, "modal:cancel", { originalEvent: e });
  }
  /**
   * Set initial focus when modal opens
   */
  setInitialFocus(t) {
    const e = b.querySelector("[autofocus]", t);
    if (e) {
      e.focus();
      return;
    }
    const n = t.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    n.length > 0 && n[0].focus();
  }
  /**
   * Check if a modal is open
   */
  isModalOpen(t) {
    const e = b.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(t, e, n = {}) {
    D.dispatchCustomEvent(t, e, {
      modal: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Get modal state (for external access)
   */
  getModalState(t) {
    const e = b.getElementById(t);
    return e && this.getState(e) || null;
  }
  /**
   * Set up Livewire integration if available
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || (window.Livewire.on("openModal", (t) => {
      const e = t.id || t.modal;
      e && (this.openModal(e), t.wireModel && this.updateWireModel(e, !0));
    }), window.Livewire.on("closeModal", (t) => {
      const e = t.id || t.modal;
      e ? (this.closeModal(e), t.wireModel && this.updateWireModel(e, !1)) : this.closeAllModals();
    }), window.Livewire.on("toggleModal", (t) => {
      const e = t.id || t.modal;
      e && this.toggleModal(e);
    }));
  }
  /**
   * Update Livewire wire:model for modal state
   */
  updateWireModel(t, e) {
    var s;
    const n = b.getElementById(t);
    if (!n) return;
    const i = n.getAttribute("wire:model");
    if (i && typeof window.Livewire < "u" && window.Livewire.find) {
      const a = (s = b.findClosest(n, "[wire\\:id]")) == null ? void 0 : s.getAttribute("wire:id");
      if (a) {
        const o = window.Livewire.find(a);
        o && o.set(i, e);
      }
    }
  }
  /**
   * Toggle a modal's open state
   */
  toggleModal(t) {
    const e = b.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : e.open ? this.closeModal(t) : this.openModal(t);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    b.querySelectorAll("dialog[data-modal][open]").forEach((t) => {
      t.id && this.closeModal(t.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(t, e) {
    const n = b.getElementById(t);
    return !n || !n.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (this.handleModalOpen(n, e), n.showModal(), this.dispatchLivewireEvent("modalOpened", { id: t, modal: t }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(t) {
    const e = b.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (e.close(), this.dispatchLivewireEvent("modalClosed", { id: t, modal: t }), !0);
  }
  /**
   * Dispatch Livewire events
   */
  dispatchLivewireEvent(t, e) {
    typeof window.Livewire < "u" && window.Livewire.dispatch && window.Livewire.dispatch(t, e);
  }
  /**
   * Handle modal close event with Livewire integration
   */
  handleModalClose(t) {
    const e = this.getState(t);
    if (!e) return;
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !1), e.lastFocusedElement && document.contains(e.lastFocusedElement) && e.lastFocusedElement.focus(), e.lastFocusedElement = null, this.setState(t, e), this.dispatchModalEvent(t, "modal:close"), this.dispatchLivewireEvent("modalClosed", { id: t.id, modal: t.id });
  }
  /**
   * Handle modal opening with Livewire integration
   */
  handleModalOpen(t, e) {
    const n = this.getState(t);
    if (!n) return;
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !0), n.lastFocusedElement = e || document.activeElement, this.setState(t, n), this.dispatchModalEvent(t, "modal:open", { trigger: e }), this.dispatchLivewireEvent("modalOpened", { id: t.id, modal: t.id }), setTimeout(() => {
      this.setInitialFocus(t);
    }, 50);
  }
  /**
   * Clean up ModalActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Uc.getInstance();
class Kr extends ht {
  /**
   * Initialize toast elements - required by BaseActionClass
   */
  initializeElements() {
    this.initializeToastSystem(), this.setupLivewireIntegration();
  }
  /**
   * Initialize the global toast system
   */
  initializeToastSystem() {
    const t = document.documentElement;
    if (!this.hasState(t)) {
      const e = {
        toasts: /* @__PURE__ */ new Map(),
        containers: /* @__PURE__ */ new Map(),
        timers: /* @__PURE__ */ new Map(),
        pausedTimers: /* @__PURE__ */ new Map(),
        toastCounter: 0
      };
      this.setState(t, e);
    }
    this.discoverToasts();
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-toast-dismiss]", (t, e) => {
      const n = t.getAttribute("data-toast-dismiss");
      n && (e.preventDefault(), e.stopPropagation(), this.dismiss(n));
    }), D.handleDelegatedClick("[data-toast-action]", (t, e) => {
      const n = t.getAttribute("data-toast-action"), i = b.findClosest(t, '[data-toast="true"]');
      n && i && (e.preventDefault(), e.stopPropagation(), this.dispatchToastEvent("toast:action", i.id, { action: n }));
    }), D.handleDelegatedEvent("mouseenter", '[data-toast="true"]', (t) => {
      this.pauseTimer(t.id);
    }), D.handleDelegatedEvent("mouseleave", '[data-toast="true"]', (t) => {
      this.resumeTimer(t.id);
    });
  }
  /**
   * Setup dynamic observer for new toast containers - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "toast-container") && this.discoverToasts(), b.findByDataAttribute("toast-container").forEach(() => {
            this.discoverToasts();
          });
        }
      });
    });
  }
  /**
   * Discover and register toast containers
   */
  discoverToasts() {
    const t = this.getGlobalState();
    t && b.findByDataAttribute("toast-container").forEach((e) => {
      const n = e.getAttribute("data-toast-container");
      n && t.containers.set(n, e);
    });
  }
  /**
   * Get global toast state
   */
  getGlobalState() {
    return this.getState(document.documentElement) || null;
  }
  /**
   * Register a toast element for management
   */
  registerToast(t, e) {
    const n = this.getGlobalState();
    n && (n.toasts.set(t, e), this.setupToastListeners(e));
  }
  /**
   * Set up individual toast event listeners (no longer needed with event delegation)
   */
  setupToastListeners(t) {
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || (window.Livewire.on("showToast", (t) => {
      const e = t.variant || "info";
      this.show(e, t);
    }), window.Livewire.on("hideToast", (t) => {
      t.id ? this.dismiss(t.id) : this.dismissAll();
    }));
  }
  /**
   * Show a toast programmatically
   */
  show(t, e = {}) {
    const n = this.getGlobalState();
    if (!n) return !1;
    const i = e.position || "top-right", s = n.containers.get(i);
    if (!s)
      return !1;
    const a = `toast-${t}-${i}-${++n.toastCounter}`, o = this.createToastElement(a, t, i, e);
    s.appendChild(o), o.setAttribute("data-toast-visible", "true");
    const l = e.duration || 5e3;
    return !(e.persistent === !0) && l > 0 && this.setTimer(a, l), n.toasts.set(a, o), this.setupToastListeners(o), this.dispatchToastEvent("toast:show", a, e), !0;
  }
  /**
   * Create a toast element dynamically
   */
  createToastElement(t, e, n, i) {
    const s = e === "error" ? "danger" : e, a = document.createElement("div");
    return a.className = "pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2", a.setAttribute("data-toast", "true"), a.setAttribute("data-toast-variant", e), a.setAttribute("data-toast-position", n), a.setAttribute("data-toast-visible", "false"), a.setAttribute("role", "alert"), a.setAttribute("aria-live", "polite"), a.id = t, a.innerHTML = `
            <div class="rounded-lg border p-4 space-y-3 ${this.getVariantClasses(s)}" role="alert" data-dismissible="true">
                <div class="flex">
                    <div class="flex-shrink-0 mt-1">
                        <svg class="w-5 h-5 ${this.getIconColor(s)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${this.getIconPath(s)}
                        </svg>
                    </div>
                    <div class="ml-3 flex-1">
                        <div data-toast-title class="hidden font-medium text-base"></div>
                        <div data-toast-message class="text-sm opacity-90"></div>
                        <div class="flex space-x-2 [&:not(:has(.hidden))]:mt-3">
                            <div data-toast-actions class="hidden"></div>
                        </div>
                    </div>
                    <div class="ml-auto pl-3">
                        <button type="button" class="inline-flex items-center justify-center rounded-md bg-transparent p-1.5 text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${this.getIconColor(s)}" data-toast-dismiss="${t}" aria-label="Dismiss">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="sr-only">Dismiss</span>
                        </button>
                    </div>
                </div>
            </div>
        `, this.updateToastContent(a, i), a;
  }
  /**
   * Get variant classes for alert styling
   */
  getVariantClasses(t) {
    const e = {
      info: "bg-info-100 border-info-200 text-info-foreground",
      success: "bg-success-100 border-success-200 text-success-foreground",
      warning: "bg-warning-100 border-warning-200 text-warning-foreground",
      danger: "bg-danger-100 border-danger-200 text-danger-foreground",
      neutral: "bg-neutral-100 border-neutral-200 text-neutral-foreground"
    };
    return e[t] || e.info;
  }
  /**
   * Get icon color for variant
   */
  getIconColor(t) {
    const e = {
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      neutral: "text-neutral"
    };
    return e[t] || e.info;
  }
  /**
   * Get icon SVG path for variant
   */
  getIconPath(t) {
    const e = {
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
      danger: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      neutral: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
    };
    return e[t] || e.info;
  }
  /**
   * Dismiss a toast
   */
  dismiss(t) {
    const e = this.getGlobalState();
    if (!e) return !1;
    const n = e.toasts.get(t);
    return n ? (this.clearTimer(t), e.pausedTimers.delete(t), n.setAttribute("data-toast-visible", "false"), n.setAttribute("data-toast-exiting", "true"), n.parentNode && n.parentNode.removeChild(n), e.toasts.delete(t), this.dispatchToastEvent("toast:dismiss", t), !0) : !1;
  }
  /**
   * Dismiss all visible toasts
   */
  dismissAll() {
    const t = this.getGlobalState();
    t && t.toasts.forEach((e, n) => {
      e.getAttribute("data-toast-visible") === "true" && this.dismiss(n);
    });
  }
  /**
   * Helper methods for convenience
   */
  success(t, e = {}) {
    return this.show("success", { message: t, ...e });
  }
  error(t, e = {}) {
    return this.show("error", { message: t, ...e });
  }
  warning(t, e = {}) {
    return this.show("warning", { message: t, ...e });
  }
  info(t, e = {}) {
    return this.show("info", { message: t, ...e });
  }
  /**
   * Update toast content
   */
  updateToastContent(t, e) {
    const n = b.querySelector("[data-toast-title]", t), i = b.querySelector("[data-toast-message]", t), s = b.querySelector("[data-toast-actions]", t);
    n && e.title ? (n.textContent = e.title, n.classList.remove("hidden")) : n && n.classList.add("hidden"), i && e.message && (i.textContent = e.message), s && e.actions ? (s.innerHTML = e.actions, s.classList.remove("hidden")) : s && s.classList.add("hidden"), t.setAttribute("data-toast-duration", String(e.duration || 5e3)), t.setAttribute("data-toast-persistent", String(e.persistent === !0));
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(t) {
    const e = b.querySelector("[data-toast-title]", t), n = b.querySelector("[data-toast-message]", t), i = b.querySelector("[data-toast-actions]", t);
    e && (e.textContent = "", e.classList.add("hidden")), n && (n.textContent = ""), i && (i.innerHTML = "", i.classList.add("hidden")), t.removeAttribute("data-toast-duration"), t.removeAttribute("data-toast-persistent");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(t, e) {
    const n = this.getGlobalState();
    if (!n) return;
    this.clearTimer(t);
    const i = n.toasts.get(t);
    i && i.setAttribute("data-toast-start-time", String(Date.now()));
    const s = setTimeout(() => {
      this.dismiss(t);
    }, e);
    n.timers.set(t, s);
  }
  /**
   * Clear timer
   */
  clearTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const n = e.timers.get(t);
    n && (clearTimeout(n), e.timers.delete(t));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const n = e.timers.get(t), i = e.toasts.get(t);
    if (n && i) {
      const s = parseInt(i.getAttribute("data-toast-duration") || "5000"), a = parseInt(i.getAttribute("data-toast-start-time") || "0"), o = Date.now() - a, l = Math.max(0, s - o);
      e.pausedTimers.set(t, {
        remaining: l,
        startTime: Date.now()
      });
    }
  }
  /**
   * Resume timer (on mouse leave)
   */
  resumeTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const n = e.toasts.get(t), i = e.timers.get(t), s = e.pausedTimers.get(t);
    n && i ? n.getAttribute("data-toast-persistent") === "true" || e.pausedTimers.delete(t) : n && s && !(n.getAttribute("data-toast-persistent") === "true") && s.remaining > 0 && (this.setTimer(t, s.remaining), e.pausedTimers.delete(t));
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(t, e, n = {}) {
    const i = this.getGlobalState();
    if (!i) return;
    const s = { id: e, toast: e, ...n };
    D.dispatchCustomEvent(document.documentElement, t, s, {
      bubbles: !0,
      cancelable: !0
    });
    const a = i.toasts.get(e);
    if (a && D.dispatchCustomEvent(a, t, s, {
      bubbles: !0,
      cancelable: !0
    }), typeof window.Livewire < "u") {
      const o = t.replace("toast:", "toast");
      window.Livewire.dispatch(o, s);
    }
  }
  /**
   * Get toast state (for external access)
   */
  getToastState(t) {
    const e = this.getGlobalState();
    if (!e) return null;
    const n = e.toasts.get(t);
    return n ? {
      id: t,
      visible: n.getAttribute("data-toast-visible") === "true",
      variant: n.getAttribute("data-toast-variant"),
      position: n.getAttribute("data-toast-position"),
      duration: parseInt(n.getAttribute("data-toast-duration") || "0"),
      persistent: n.getAttribute("data-toast-persistent") === "true"
    } : null;
  }
  /**
   * Clean up ToastActions - extends BaseActionClass destroy
   */
  onDestroy() {
    const t = this.getGlobalState();
    t && (t.timers.forEach((e) => clearTimeout(e)), t.timers.clear(), t.pausedTimers.clear(), t.toasts.forEach((e) => {
      this.resetToastContent(e), e.style.display = "none", e.setAttribute("data-toast-visible", "false");
    }), t.toasts.clear(), t.containers.clear());
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Kr.getInstance().init();
}) : Kr.getInstance().init();
window.ToastActions = Kr;
Kr.getInstance();
class Vc extends ht {
  /**
   * Initialize dropdown elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("dropdown", "true").forEach((t) => {
      this.initializeDropdown(t);
    }), b.findByDataAttribute("submenu", "true").forEach((t) => {
      this.initializeDropdown(t);
    });
  }
  /**
   * Initialize a single dropdown element
   */
  initializeDropdown(t) {
    const e = {
      isOpen: !1,
      focusedIndex: -1,
      menuItems: [],
      children: []
    }, n = b.findClosest(t, '[data-submenu="true"]');
    n && n !== t && (e.parent = n), this.setState(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(t) {
    const e = b.querySelectorAll('[data-submenu="true"]', t), n = this.getState(t);
    n && (n.children = Array.from(e), this.setState(t, n)), e.forEach((i) => {
      this.hasState(i) || this.initializeDropdown(i);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (t, e) => {
      if (t.matches("[data-submenu-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const n = b.findClosest(t, '[data-submenu="true"]');
        n && !this.isDisabled(n) && this.toggleSubmenu(n);
        return;
      }
      if (t.matches("[data-dropdown-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const n = b.findClosest(t, '[data-dropdown="true"]');
        n && !this.isDisabled(n) && this.toggleDropdown(n);
        return;
      }
      if (t.matches("[data-menu-item]")) {
        const n = b.findClosest(t, '[data-dropdown="true"]');
        n && (t.dataset.keepOpen === "true" || this.closeDropdown(n));
        return;
      }
      if (t.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (e.stopPropagation(), !(t.dataset.keepOpen !== "false")) {
          const i = b.findClosest(t, '[data-dropdown="true"]');
          i && this.closeDropdown(i);
        }
        return;
      }
      if (t.matches("[data-dropdown-panel], [data-submenu-panel]")) {
        e.stopPropagation();
        return;
      }
    }), D.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]") || this.closeAllDropdowns());
    }), D.addEventListener(document, "mouseenter", (t) => {
      const e = b.findClosest(t.target, "[data-submenu-trigger]");
      if (e && !this.isMobile()) {
        const n = b.findClosest(e, "[data-popover-trigger]");
        if (n) {
          const i = b.findClosest(e, "[data-keys-dropdown]");
          i && b.querySelectorAll("[data-popover-trigger]", i).forEach((a) => {
            var l;
            const o = a.getAttribute("data-popover-trigger");
            if (o && o !== n.getAttribute("data-popover-trigger")) {
              const c = document.getElementById(o);
              c && c.matches(":popover-open") && ((l = c.hidePopover) == null || l.call(c));
            }
          }), setTimeout(() => {
            e.matches(":hover") && e.click();
          }, 100);
        }
      }
    }, { capture: !0 }), D.handleDelegatedKeydown('[data-dropdown="true"]', (t, e) => {
      this.handleKeydown(t, e);
    });
  }
  /**
   * Setup dynamic observer for new dropdowns - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "dropdown", "true") && (this.hasState(n) || this.initializeDropdown(n)), b.hasDataAttribute(n, "submenu", "true") && (this.hasState(n) || this.initializeDropdown(n)), b.findByDataAttribute("dropdown", "true", n).forEach((a) => {
            this.hasState(a) || this.initializeDropdown(a);
          }), b.findByDataAttribute("submenu", "true", n).forEach((a) => {
            this.hasState(a) || this.initializeDropdown(a);
          });
        }
      });
    });
  }
  /**
   * Toggle dropdown open/closed state
   */
  toggleDropdown(t) {
    const e = this.getState(t);
    e && (e.isOpen ? this.closeDropdown(t) : this.openDropdown(t));
  }
  /**
   * Open dropdown
   */
  openDropdown(t) {
    var s;
    const e = this.getState(t);
    if (!e || this.isDisabled(t)) return;
    this.closeSiblingDropdowns(t), e.isOpen = !0, e.focusedIndex = -1, this.setState(t, e);
    const n = b.querySelector("[data-keys-popover]", t), i = b.querySelector("[data-dropdown-trigger]", t);
    n && ((s = n.showPopover) == null || s.call(n)), i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "dropdown:open");
  }
  /**
   * Open submenu using HTML Popover API
   */
  openSubmenu(t) {
    var s;
    const e = this.getState(t);
    if (!e || this.isDisabled(t))
      return;
    e.isOpen = !0, e.focusedIndex = -1, this.closeSiblingSubmenus(t), this.setState(t, e);
    const n = b.querySelector("[data-keys-popover]", t), i = b.querySelector("[data-submenu-trigger]", t);
    if (n)
      try {
        (s = n.showPopover) == null || s.call(n);
      } catch {
      }
    i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    var s;
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const n = b.querySelector("[data-keys-popover]", t), i = b.querySelector("[data-dropdown-trigger]", t);
    n && ((s = n.hidePopover) == null || s.call(n)), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "dropdown:close");
  }
  /**
   * Close submenu using HTML Popover API
   */
  closeSubmenu(t) {
    var s;
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const n = b.querySelector("[data-keys-popover]", t), i = b.querySelector("[data-submenu-trigger]", t);
    n && ((s = n.hidePopover) == null || s.call(n)), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "submenu:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.getAllStates().forEach((t, e) => {
      t.isOpen && (t.parent || this.closeDropdown(e));
    });
  }
  /**
   * Close sibling dropdowns but preserve parent-child relationships
   */
  closeSiblingDropdowns(t) {
    const e = this.getState(t);
    this.getAllStates().forEach((n, i) => {
      if (i !== t && n.isOpen) {
        const s = (e == null ? void 0 : e.parent) === i, a = n.parent === t;
        !s && !a && this.closeDropdown(i);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(t) {
    const e = this.getState(t), n = e == null ? void 0 : e.parent;
    if (n) {
      const i = this.getState(n);
      i == null || i.children.forEach((s) => {
        s !== t && this.closeSubmenu(s);
      });
    }
  }
  /**
   * Close all child submenus
   */
  closeChildSubmenus(t) {
    const e = this.getState(t);
    e == null || e.children.forEach((n) => {
      this.closeSubmenu(n);
    });
  }
  /**
   * Toggle submenu open/closed state
   */
  toggleSubmenu(t) {
    const e = this.getState(t);
    e && (e.isOpen ? this.closeSubmenu(t) : this.openSubmenu(t));
  }
  /**
   * Check if device is mobile
   */
  isMobile() {
    return window.innerWidth < 768 || "ontouchstart" in window;
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const n = this.getState(t);
    if (n)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!n.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (n.focusedIndex >= 0) {
            e.preventDefault();
            const i = n.menuItems[n.focusedIndex];
            i && i.click();
          }
          break;
        case "Escape":
          if (n.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const i = b.querySelector("[data-dropdown-trigger]", t);
            i && i.focus();
          }
          break;
        case "ArrowDown":
          n.isOpen ? (e.preventDefault(), this.navigateItems(t, 1)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "ArrowUp":
          n.isOpen && (e.preventDefault(), this.navigateItems(t, -1));
          break;
        case "Tab":
          n.isOpen && this.closeDropdown(t);
          break;
      }
  }
  /**
   * Navigate through menu items with arrow keys
   */
  navigateItems(t, e) {
    const n = this.getState(t);
    if (!n || !n.isOpen) return;
    const i = n.menuItems.length;
    i !== 0 && (n.focusedIndex === -1 ? n.focusedIndex = e > 0 ? 0 : i - 1 : (n.focusedIndex += e, n.focusedIndex >= i ? n.focusedIndex = 0 : n.focusedIndex < 0 && (n.focusedIndex = i - 1)), this.setState(t, n), this.updateItemFocus(t));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(t) {
    const e = this.getState(t);
    e && e.menuItems.forEach((n, i) => {
      i === e.focusedIndex ? (n.classList.add("bg-neutral-100", "dark:bg-neutral-800"), n.scrollIntoView({ block: "nearest" })) : n.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", t);
    e.menuItems = Array.from(n).filter((i) => {
      const s = i;
      return !s.hasAttribute("disabled") && s.offsetParent !== null;
    }), this.setState(t, e);
  }
  /**
   * Setup floating for dropdown using Floating UI
   */
  setupFloating(t, e, n) {
    const i = this.getState(t);
    if (!i) return;
    i.floating && i.floating.cleanup();
    const s = t.dataset.position || "bottom", a = t.dataset.align || "start", o = parseInt(t.dataset.offset || "8");
    let l = s;
    s === "bottom" || s === "top" ? a === "start" ? l = `${s}-start` : a === "end" && (l = `${s}-end`) : (s === "left" || s === "right") && (a === "start" ? l = `${s}-start` : a === "end" && (l = `${s}-end`));
    const c = FloatingManager.getInstance().createFloating(e, n, {
      placement: l,
      offset: o,
      flip: {
        fallbackStrategy: "bestFit",
        padding: 8
      },
      shift: {
        padding: 8,
        crossAxis: !0
      },
      hide: {
        strategy: "escaped"
      },
      autoUpdate: {
        ancestorScroll: !0,
        ancestorResize: !0,
        elementResize: !0,
        layoutShift: !0
      }
    });
    i.floating = c, this.setState(t, i);
  }
  /**
   * Check if dropdown is disabled
   */
  isDisabled(t) {
    return t.dataset.disabled === "true";
  }
  /**
   * Dispatch custom dropdown event
   */
  dispatchDropdownEvent(t, e, n = null) {
    D.dispatchCustomEvent(t, e, {
      dropdown: t,
      ...n
    }, {
      bubbles: !0
    });
  }
  /**
   * Clean up DropdownActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Vc.getInstance();
class Yr extends ht {
  /**
   * Initialize table elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("table", "true").forEach((t) => {
      this.initializeTable(t);
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single table
   */
  initializeTable(t) {
    var i;
    if (this.hasState(t))
      return;
    const e = {
      selectedRows: /* @__PURE__ */ new Set(),
      sortColumn: null,
      sortDirection: null,
      selectAllState: "none"
    };
    this.setState(t, e);
    const n = b.querySelector('[data-sorted="true"]', t);
    if (n) {
      const s = n.getAttribute("data-sort-key") || ((i = n.textContent) == null ? void 0 : i.trim()) || "", a = n.getAttribute("data-direction");
      e.sortColumn = s, e.sortDirection = a;
    }
    this.updateSelectionState(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick('[data-sortable="true"]', (t, e) => {
      e.preventDefault(), this.handleSort(t);
    }), D.handleDelegatedChange("[data-table-row-select]", (t) => {
      this.handleRowSelection(t);
    }), D.handleDelegatedChange("[data-table-select-all]", (t) => {
      this.handleSelectAll(t);
    }), D.handleDelegatedKeydown('[data-table="true"]', (t, e) => {
      this.handleKeyboard(e);
    });
  }
  /**
   * Setup dynamic observer for new tables - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "table", "true") && this.initializeTable(n), b.findByDataAttribute("table", "true", n).forEach((i) => {
            this.initializeTable(i);
          });
        }
      });
    });
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || D.addEventListener(document, "livewire:navigated", () => {
      this.reinitialize();
    });
  }
  /**
   * Handle sortable header clicks
   */
  handleSort(t) {
    var a;
    const e = b.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const n = this.getState(e);
    if (!n) return;
    const i = t.getAttribute("data-sort-key") || ((a = t.textContent) == null ? void 0 : a.trim()) || "";
    let s = "asc";
    n.sortColumn === i && (n.sortDirection === "asc" ? s = "desc" : n.sortDirection === "desc" && (s = null)), n.sortColumn = s ? i : null, n.sortDirection = s, this.updateSortUI(e, i, s), this.dispatchSortEvent(e, {
      column: i,
      direction: s || "asc",
      url: t.getAttribute("data-sort-url") || void 0,
      livewireMethod: t.getAttribute("data-sort-method") || void 0
    });
  }
  /**
   * Update sort UI indicators
   */
  updateSortUI(t, e, n) {
    if (b.querySelectorAll('[data-sortable="true"]', t).forEach((s) => {
      s.setAttribute("data-sorted", "false"), s.removeAttribute("data-direction"), b.querySelectorAll(".table-sort-icon", s).forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), n) {
      const s = t.querySelector(`[data-sort-key="${e}"]`);
      if (s) {
        s.setAttribute("data-sorted", "true"), s.setAttribute("data-direction", n);
        const a = b.querySelector(".table-sort-icon", s);
        if (a) {
          const o = n === "asc" ? "heroicon-o-chevron-up" : "heroicon-o-chevron-down";
          a.setAttribute("data-icon", o), a.classList.remove("opacity-0", "group-hover:opacity-100"), a.classList.add("opacity-100");
        }
      }
    }
  }
  /**
   * Handle individual row selection
   */
  handleRowSelection(t) {
    const e = b.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const n = this.getState(e);
    if (!n) return;
    const i = t.getAttribute("data-row-id");
    i && (t.checked ? n.selectedRows.add(i) : n.selectedRows.delete(i), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(n.selectedRows)));
  }
  /**
   * Handle select all checkbox
   */
  handleSelectAll(t) {
    const e = b.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const n = this.getState(e);
    if (!n) return;
    const i = b.querySelectorAll("[data-table-row-select]", e);
    t.checked ? i.forEach((s) => {
      s.checked = !0;
      const a = s.getAttribute("data-row-id");
      a && n.selectedRows.add(a);
    }) : i.forEach((s) => {
      s.checked = !1;
      const a = s.getAttribute("data-row-id");
      a && n.selectedRows.delete(a);
    }), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(n.selectedRows));
  }
  /**
   * Update selection state and UI
   */
  updateSelectionState(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelectorAll("[data-table-row-select]", t), i = b.querySelector("[data-table-select-all]", t), s = n.length, a = e.selectedRows.size;
    a === 0 ? (e.selectAllState = "none", i && (i.checked = !1, i.indeterminate = !1)) : a === s ? (e.selectAllState = "all", i && (i.checked = !0, i.indeterminate = !1)) : (e.selectAllState = "some", i && (i.checked = !1, i.indeterminate = !0)), b.querySelectorAll("[data-table-row]", t).forEach((l) => {
      const c = l.getAttribute("data-row-id");
      c && e.selectedRows.has(c) ? (l.setAttribute("data-selected", "true"), l.classList.add("table-row-selected")) : (l.setAttribute("data-selected", "false"), l.classList.remove("table-row-selected"));
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeyboard(t) {
    const e = t.target;
    t.key === " " && e.matches('[data-sortable="true"]') && (t.preventDefault(), this.handleSort(e)), t.key === "Enter" && e.matches('[data-sortable="true"]') && (t.preventDefault(), this.handleSort(e));
  }
  /**
   * Dispatch sort event
   */
  dispatchSortEvent(t, e) {
    if (D.dispatchCustomEvent(t, "table:sort", e, {
      bubbles: !0,
      cancelable: !0
    }), e.livewireMethod && window.Livewire) {
      const n = t.getAttribute("wire:id");
      if (n) {
        const i = window.Livewire.find(n);
        i && i.call(e.livewireMethod, e.column, e.direction);
      }
    }
  }
  /**
   * Dispatch selection event
   */
  dispatchSelectionEvent(t, e) {
    D.dispatchCustomEvent(t, "table:selection", { selectedIds: e }, {
      bubbles: !0,
      cancelable: !0
    });
    const n = t.getAttribute("data-selection-method");
    if (n && window.Livewire) {
      const i = t.getAttribute("wire:id");
      if (i) {
        const s = window.Livewire.find(i);
        s && s.call(n, e);
      }
    }
  }
  /**
   * Reinitialize after page changes
   */
  reinitialize() {
    this.clearAllStates(), this.initializeElements();
  }
  /**
   * Get selected rows for a table
   */
  getSelectedRows(t) {
    const e = this.getState(t);
    return e ? Array.from(e.selectedRows) : [];
  }
  /**
   * Clear selection for a table
   */
  clearSelection(t) {
    const e = this.getState(t);
    e && (e.selectedRows.clear(), this.updateSelectionState(t), this.dispatchSelectionEvent(t, []));
  }
  /**
   * Clean up TableActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Yr.getInstance().init();
}) : Yr.getInstance().init();
window.TableActions = Yr;
Yr.getInstance();
class Gc extends ht {
  /**
   * Initialize button group elements - required by BaseActionClass
   */
  initializeElements() {
    this.processButtonGroups();
  }
  /**
   * Process all existing button groups on the page
   */
  processButtonGroups() {
    b.findByDataAttribute("button-group", "true").filter(
      (e) => b.hasDataAttribute(e, "attached", "true")
    ).forEach((e) => this.processButtonGroup(e));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
  }
  /**
   * Setup dynamic observer for new button groups - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "button-group", "true") && b.hasDataAttribute(n, "attached", "true") && this.processButtonGroup(n), b.findByDataAttribute("button-group", "true", n).filter(
            (s) => b.hasDataAttribute(s, "attached", "true")
          ).forEach((s) => this.processButtonGroup(s));
        }
      });
    });
  }
  /**
   * Process a single button group element
   */
  processButtonGroup(t) {
    const e = t.getAttribute("data-orientation") || "horizontal", n = Array.from(t.children).filter(
      (i) => i.tagName === "BUTTON" || i.tagName === "A"
    );
    n.length <= 1 || n.forEach((i, s) => {
      const a = s === 0, o = s === n.length - 1, l = !a && !o;
      this.clearBorderRadiusClasses(i), e === "horizontal" ? a ? i.classList.add("rounded-r-none") : o ? i.classList.add("rounded-l-none") : l && i.classList.add("rounded-none") : e === "vertical" && (a ? i.classList.add("rounded-b-none") : o ? i.classList.add("rounded-t-none") : l && i.classList.add("rounded-none"));
    });
  }
  /**
   * Clear existing border radius classes from a button
   */
  clearBorderRadiusClasses(t) {
    [
      "rounded-none",
      "rounded-r-none",
      "rounded-l-none",
      "rounded-t-none",
      "rounded-b-none"
    ].forEach((n) => {
      t.classList.remove(n);
    });
  }
  /**
   * Re-process all button groups (useful after dynamic content changes)
   */
  refresh() {
    this.processButtonGroups();
  }
  /**
   * Process a specific button group by element reference
   */
  processGroup(t) {
    t.matches('[data-button-group="true"][data-attached="true"]') && this.processButtonGroup(t);
  }
  /**
   * Clean up ButtonGroupActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Gc.getInstance();
class Qr extends ht {
  /**
   * Initialize tooltip elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll("[data-tooltip-target]").forEach((t) => {
      const e = t.getAttribute("data-tooltip-target");
      if (e) {
        const n = b.getElementById(e);
        n && this.initializeTooltip(t, n);
      }
    }), b.findByDataAttribute("tooltip", "true").forEach((t) => {
      const e = t.getAttribute("data-target");
      if (e) {
        const n = b.querySelector(e);
        n && this.initializeTooltip(n, t);
      }
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single tooltip
   */
  initializeTooltip(t, e) {
    if (this.hasState(e))
      return;
    const n = t.getAttribute("data-tooltip-trigger") || e.getAttribute("data-trigger") || "hover", i = parseInt(t.getAttribute("data-tooltip-delay") || e.getAttribute("data-delay") || "100"), s = {
      isVisible: !1,
      trigger: t,
      tooltip: e,
      triggerType: n,
      delay: i
    };
    this.setState(e, s), this.bindTooltipEvents(t, e, s), this.hideTooltip(e);
  }
  /**
   * Bind events for a specific tooltip
   */
  bindTooltipEvents(t, e, n) {
    switch (n.triggerType) {
      case "hover":
        t.addEventListener("mouseenter", () => this.scheduleShow(e)), t.addEventListener("mouseleave", () => this.scheduleHide(e)), e.addEventListener("mouseenter", () => this.cancelHide(e)), e.addEventListener("mouseleave", () => this.scheduleHide(e));
        break;
      case "click":
        t.addEventListener("click", (i) => {
          i.preventDefault(), this.toggleTooltip(e);
        });
        break;
      case "focus":
        t.addEventListener("focus", () => this.scheduleShow(e)), t.addEventListener("blur", () => this.scheduleHide(e));
        break;
    }
    t.addEventListener("keydown", (i) => {
      i.key === "Escape" && n.isVisible && this.hideTooltip(e);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && this.getAllStates().forEach((n, i) => {
        var s;
        if (n.triggerType === "click" && n.isVisible) {
          const a = e;
          !((s = n.trigger) != null && s.contains(a)) && !i.contains(a) && this.hideTooltip(i);
        }
      });
    }), D.addEventListener(document, "scroll", () => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.hideTooltip(e);
      });
    }, { passive: !0 }), D.handleResize(() => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.positionTooltip(t.trigger, e);
      });
    }, 100);
  }
  /**
   * Setup dynamic observer for new tooltips - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.querySelectorAll("[data-tooltip-target]", n).forEach((i) => {
            const s = i.getAttribute("data-tooltip-target");
            if (s) {
              const a = b.getElementById(s);
              a && !this.hasState(a) && this.initializeTooltip(i, a);
            }
          }), b.findByDataAttribute("tooltip", "true", n).forEach((i) => {
            const s = i.getAttribute("data-target");
            if (s) {
              const a = b.querySelector(s);
              a && !this.hasState(i) && this.initializeTooltip(a, i);
            }
          });
        }
      });
    });
  }
  /**
   * Schedule tooltip to show with delay
   */
  scheduleShow(t) {
    const e = this.getState(t);
    !e || t.getAttribute("data-disabled") === "true" || (this.cancelHide(t), e.showTimer = window.setTimeout(() => {
      this.showTooltip(t);
    }, e.delay));
  }
  /**
   * Schedule tooltip to hide with delay
   */
  scheduleHide(t) {
    const e = this.getState(t);
    e && (this.cancelShow(t), e.hideTimer = window.setTimeout(() => {
      this.hideTooltip(t);
    }, 100));
  }
  /**
   * Cancel scheduled show
   */
  cancelShow(t) {
    const e = this.getState(t);
    e != null && e.showTimer && (clearTimeout(e.showTimer), delete e.showTimer);
  }
  /**
   * Cancel scheduled hide
   */
  cancelHide(t) {
    const e = this.getState(t);
    e != null && e.hideTimer && (clearTimeout(e.hideTimer), delete e.hideTimer);
  }
  /**
   * Show tooltip
   */
  showTooltip(t) {
    const e = this.getState(t);
    !e || e.isVisible || (e.trigger && this.positionTooltip(e.trigger, t), t.setAttribute("data-show", "true"), e.isVisible = !0, this.dispatchTooltipEvent(t, "tooltip:show", { trigger: e.trigger }));
  }
  /**
   * Hide tooltip
   */
  hideTooltip(t) {
    const e = this.getState(t);
    !e || !e.isVisible || (e.floating && (e.floating.cleanup(), e.floating = void 0), t.setAttribute("data-show", "false"), e.isVisible = !1, this.dispatchTooltipEvent(t, "tooltip:hide", { trigger: e.trigger }));
  }
  /**
   * Toggle tooltip visibility
   */
  toggleTooltip(t) {
    const e = this.getState(t);
    e && (e.isVisible ? this.hideTooltip(t) : this.showTooltip(t));
  }
  /**
   * Position tooltip relative to trigger using Floating UI
   */
  positionTooltip(t, e) {
    this.getState(e) && this.setupFloating(t, e);
  }
  /**
   * Setup floating for tooltip using Floating UI
   */
  setupFloating(t, e) {
    const n = this.getState(e);
    if (!n) return;
    n.floating && n.floating.cleanup();
    const i = e.getAttribute("data-placement") || "top", s = b.querySelector("[data-tooltip-arrow]", e), a = ps.getInstance().createFloating(t, e, {
      placement: i,
      offset: 8,
      flip: {
        fallbackStrategy: "bestFit",
        padding: 8
      },
      shift: {
        padding: 8,
        crossAxis: !0
      },
      arrow: s || void 0,
      hide: {
        strategy: "referenceHidden"
      },
      autoUpdate: {
        ancestorScroll: !0,
        ancestorResize: !0,
        elementResize: !0,
        layoutShift: !0
      }
    });
    n.floating = a;
  }
  /**
   * Dispatch tooltip events
   */
  dispatchTooltipEvent(t, e, n = {}) {
    D.dispatchCustomEvent(t, e, {
      tooltip: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || document.addEventListener("livewire:navigated", () => {
      this.reinitialize();
    });
  }
  /**
   * Reinitialize tooltips (useful after dynamic content changes)
   */
  reinitialize() {
    this.clearAllStates(), this.initializeElements();
  }
  /**
   * Public API: Show tooltip programmatically
   */
  show(t) {
    const e = b.getElementById(t);
    return e && this.hasState(e) ? (this.showTooltip(e), !0) : !1;
  }
  /**
   * Public API: Hide tooltip programmatically
   */
  hide(t) {
    const e = b.getElementById(t);
    return e && this.hasState(e) ? (this.hideTooltip(e), !0) : !1;
  }
  /**
   * Public API: Toggle tooltip programmatically
   */
  toggle(t) {
    const e = b.getElementById(t);
    return e && this.hasState(e) ? (this.toggleTooltip(e), !0) : !1;
  }
  /**
   * Public API: Destroy tooltip instance
   */
  destroyTooltip(t) {
    const e = b.getElementById(t);
    return e && this.hasState(e) ? (this.hideTooltip(e), this.removeState(e), !0) : !1;
  }
  /**
   * Clean up TooltipActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.getAllStates().forEach((t, e) => {
      t.floating && t.floating.cleanup();
    });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Qr.getInstance().init();
}) : Qr.getInstance().init();
window.TooltipActions = Qr;
Qr.getInstance();
class Zr extends ht {
  /**
   * Initialize timepicker elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll('[data-timepicker="true"]').forEach((t) => {
      this.initializeTimePicker(t);
    });
  }
  /**
   * Initialize a single timepicker element
   */
  initializeTimePicker(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.format || "24", n = t.dataset.showSeconds === "true", i = parseInt(t.dataset.step || "1"), s = t.dataset.minTime || null, a = t.dataset.maxTime || null, o = t.dataset.value || null, l = this.parseTime(o) || this.getCurrentTime(), c = {
      isOpen: !1,
      format: e,
      showSeconds: n,
      hour: l.hour,
      minute: l.minute,
      second: l.second,
      period: l.period || "AM",
      step: i,
      minTime: s,
      maxTime: a,
      value: o
    };
    this.setState(t, c), this.updateDisplay(t), this.updateSelectedStates(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-timepicker-trigger]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]');
      n && !this.isDisabled(n) && this.toggleDropdown(n);
    }), D.handleDelegatedClick("[data-timepicker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = b.findClosest(t, '[data-timepicker="true"]');
      n && this.clearTime(n);
    }), D.handleDelegatedClick("[data-timepicker-hour]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]'), i = parseInt(t.dataset.timepickerHour || "0");
      n && this.setHour(n, i);
    }), D.handleDelegatedClick("[data-timepicker-minute]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]'), i = parseInt(t.dataset.timepickerMinute || "0");
      n && this.setMinute(n, i);
    }), D.handleDelegatedClick("[data-timepicker-second]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]'), i = parseInt(t.dataset.timepickerSecond || "0");
      n && this.setSecond(n, i);
    }), D.handleDelegatedClick("[data-timepicker-period]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]'), i = t.dataset.timepickerPeriod;
      n && this.setPeriod(n, i);
    }), D.handleDelegatedClick("[data-timepicker-format]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]'), i = t.dataset.timepickerFormat;
      n && this.setFormat(n, i);
    }), D.handleDelegatedClick("[data-timepicker-now]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]');
      n && this.setToCurrentTime(n);
    }), D.handleDelegatedClick("[data-timepicker-apply]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]');
      n && this.applyTime(n);
    }), D.handleDelegatedClick("[data-timepicker-cancel]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-timepicker="true"]');
      n && this.closeDropdown(n);
    }), D.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest('[data-timepicker="true"]') || this.closeAllDropdowns());
    }), D.handleDelegatedKeydown('[data-timepicker="true"]', (t, e) => {
      this.handleKeydown(t, e);
    });
  }
  /**
   * Setup dynamic observer for new timepickers - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          n.matches && n.matches('[data-timepicker="true"]') && this.initializeTimePicker(n), b.querySelectorAll('[data-timepicker="true"]', n).forEach((i) => {
            this.initializeTimePicker(i);
          });
        }
      });
    });
  }
  /**
   * Toggle dropdown open/closed state
   */
  toggleDropdown(t) {
    const e = this.getState(t);
    e && (e.isOpen ? this.closeDropdown(t) : this.openDropdown(t));
  }
  /**
   * Open dropdown
   */
  openDropdown(t) {
    const e = this.getState(t);
    if (!e || this.isDisabled(t)) return;
    this.closeAllDropdowns(), e.isOpen = !0, this.setState(t, e);
    const n = b.querySelector("[data-timepicker-dropdown]", t), i = b.querySelector("[data-timepicker-trigger]", t);
    n && (n.classList.remove("hidden"), this.positionDropdown(t)), i && i.setAttribute("aria-expanded", "true"), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.dispatchTimePickerEvent(t, "timepicker:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    e.floating && (e.floating.cleanup(), e.floating = void 0), e.isOpen = !1, this.setState(t, e);
    const n = b.querySelector("[data-timepicker-dropdown]", t), i = b.querySelector("[data-timepicker-trigger]", t);
    n && n.classList.add("hidden"), i && i.setAttribute("aria-expanded", "false"), this.dispatchTimePickerEvent(t, "timepicker:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.getAllStates().forEach((t, e) => {
      t.isOpen && this.closeDropdown(e);
    });
  }
  /**
   * Set hour value
   */
  setHour(t, e) {
    const n = this.getState(t);
    n && (n.hour = e, this.setState(t, n), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set minute value
   */
  setMinute(t, e) {
    const n = this.getState(t);
    n && (n.minute = e, this.setState(t, n), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set second value
   */
  setSecond(t, e) {
    const n = this.getState(t);
    n && (n.second = e, this.setState(t, n), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set period (AM/PM)
   */
  setPeriod(t, e) {
    const n = this.getState(t);
    n && (n.period = e, this.setState(t, n), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Convert hour between 12h and 24h formats
   */
  convertHourBetweenFormats(t, e, n, i) {
    if (e === n)
      return { hour: t, period: i };
    if (e === "24" && n === "12")
      return t === 0 ? { hour: 12, period: "AM" } : t >= 1 && t <= 11 ? { hour: t, period: "AM" } : t === 12 ? { hour: 12, period: "PM" } : { hour: t - 12, period: "PM" };
    if (e === "12" && n === "24") {
      if (!i)
        throw new Error("Period (AM/PM) required for 12h to 24h conversion");
      return i === "AM" ? t === 12 ? { hour: 0 } : { hour: t } : t === 12 ? { hour: 12 } : { hour: t + 12 };
    }
    return { hour: t, period: i };
  }
  /**
   * Set format (12/24 hour)
   */
  setFormat(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = t.dataset.formatMode;
    if (i === "12" || i === "24") {
      console.warn(`TimePicker format is locked to ${i}h mode. Cannot switch to ${e}h.`);
      return;
    }
    if (n.format !== e) {
      const s = this.convertHourBetweenFormats(n.hour, n.format, e, n.period);
      n.hour = s.hour, s.period && (n.period = s.period), n.format = e, this.setState(t, n), this.updateFormatButtons(t), this.updateHourOptions(t), this.updateSelectedStates(t), this.updateDisplay(t), this.updatePreview(t);
    }
  }
  /**
   * Set to current time
   */
  setToCurrentTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = this.getCurrentTime();
    e.format === "12" ? (e.hour = n.hour > 12 ? n.hour - 12 : n.hour === 0 ? 12 : n.hour, e.period = n.hour >= 12 ? "PM" : "AM") : e.hour = n.hour, e.minute = n.minute, e.second = n.second, this.setState(t, e), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.updatePreview(t);
  }
  /**
   * Apply time selection
   */
  applyTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = this.formatTimeValue(e);
    this.setValue(t, n), this.closeDropdown(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: n,
      state: { ...e }
    });
  }
  /**
   * Clear time value
   */
  clearTime(t) {
    this.setValue(t, ""), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: "",
      state: null
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const n = this.getState(t);
    if (n)
      switch (e.key) {
        case "Enter":
        case " ":
          n.isOpen ? (e.preventDefault(), this.applyTime(t)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "Escape":
          n.isOpen && (e.preventDefault(), this.closeDropdown(t));
          break;
        case "ArrowUp":
          n.isOpen ? e.preventDefault() : (e.preventDefault(), this.incrementTime(t, "minute", 1));
          break;
        case "ArrowDown":
          n.isOpen ? e.preventDefault() : (e.preventDefault(), this.incrementTime(t, "minute", -1));
          break;
        case "ArrowLeft":
          n.isOpen || (e.preventDefault(), this.incrementTime(t, "hour", -1));
          break;
        case "ArrowRight":
          n.isOpen || (e.preventDefault(), this.incrementTime(t, "hour", 1));
          break;
      }
  }
  /**
   * Increment/decrement time values
   */
  incrementTime(t, e, n) {
    const i = this.getState(t);
    if (i) {
      switch (e) {
        case "hour":
          i.format === "12" ? (i.hour = i.hour + n, i.hour > 12 && (i.hour = 1), i.hour < 1 && (i.hour = 12)) : (i.hour = i.hour + n, i.hour > 23 && (i.hour = 0), i.hour < 0 && (i.hour = 23));
          break;
        case "minute":
          i.minute = i.minute + n * i.step, i.minute >= 60 ? i.minute = i.minute % 60 : i.minute < 0 && (i.minute = 60 + i.minute % 60, i.minute === 60 && (i.minute = 0));
          break;
        case "second":
          i.second = i.second + n, i.second >= 60 ? i.second = 0 : i.second < 0 && (i.second = 59);
          break;
      }
      this.setState(t, i), this.updateDisplay(t), this.dispatchTimePickerEvent(t, "timepicker:increment", {
        unit: e,
        direction: n,
        value: this.formatTimeValue(i)
      });
    }
  }
  /**
   * Update display value
   */
  updateDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = this.formatTimeValue(e), i = b.querySelector("[data-timepicker-trigger]", t);
    i && (i.value = n || "");
  }
  /**
   * Update preview in dropdown
   */
  updatePreview(t) {
    this.updateDisplay(t);
  }
  /**
   * Set value and update hidden input
   */
  setValue(t, e) {
    const n = b.querySelector(".timepicker-hidden-input", t), i = b.querySelector("[data-timepicker-trigger]", t);
    n && (n.value = e), i && (i.value = e);
    const s = this.getState(t);
    s && (s.value = e, this.setState(t, s));
  }
  /**
   * Update selected states in dropdown
   */
  updateSelectedStates(t) {
    const e = this.getState(t);
    if (!e) return;
    b.querySelectorAll(".selected", t).forEach((s) => s.classList.remove("selected"));
    const n = b.querySelector(`[data-timepicker-hour="${e.hour}"]`, t);
    n && n.classList.add("selected");
    const i = b.querySelector(`[data-timepicker-minute="${e.minute}"]`, t);
    if (i && i.classList.add("selected"), e.showSeconds) {
      const s = t.querySelector(`[data-timepicker-second="${e.second}"]`);
      s && s.classList.add("selected");
    }
    if (e.format === "12") {
      const s = t.querySelector(`[data-timepicker-period="${e.period}"]`);
      s && s.classList.add("selected");
    }
  }
  /**
   * Update format toggle buttons
   */
  updateFormatButtons(t) {
    const e = this.getState(t);
    if (!e) return;
    b.querySelectorAll("[data-timepicker-format]", t).forEach((i) => {
      i.dataset.timepickerFormat === e.format ? (i.classList.add("bg-brand", "text-foreground-brand"), i.classList.remove("bg-surface", "text-muted")) : (i.classList.remove("bg-brand", "text-foreground-brand"), i.classList.add("bg-surface", "text-muted"));
    });
  }
  /**
   * Update hour options based on current format
   */
  updateHourOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.querySelector("[data-timepicker-dropdown] .h-24:first-child", t);
    if (!n) return;
    const i = e.format === "12" ? Array.from({ length: 12 }, (s, a) => a + 1) : (
      // 1-12 for 12h
      Array.from({ length: 24 }, (s, a) => a)
    );
    n.innerHTML = "", i.forEach((s) => {
      const a = document.createElement("button");
      a.type = "button", a.dataset.timepickerHour = s.toString(), a.className = "w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors", a.textContent = s.toString().padStart(2, "0"), n.appendChild(a);
    }), e.format === "12" && (e.hour < 1 || e.hour > 12) ? (e.hour = Math.max(1, Math.min(12, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t)) : e.format === "24" && (e.hour < 0 || e.hour > 23) && (e.hour = Math.max(0, Math.min(23, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t));
  }
  /**
   * Scroll to selected options in dropdown lists
   */
  scrollToSelectedOptions(t) {
    b.querySelectorAll(".selected", t).forEach((n) => {
      n.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
  /**
   * Position dropdown using Floating UI
   */
  positionDropdown(t) {
    const e = b.querySelector("[data-timepicker-dropdown]", t), n = b.querySelector("[data-timepicker-trigger]", t);
    !e || !n || this.setupFloating(t, n, e);
  }
  /**
   * Setup floating for time picker using Floating UI
   */
  setupFloating(t, e, n) {
    const i = this.getState(t);
    if (!i) return;
    i.floating && i.floating.cleanup();
    const s = t.dataset.position || "bottom", a = t.dataset.align || "start", o = parseInt(t.dataset.offset || "8");
    let l = s;
    (s === "bottom" || s === "top") && (a === "start" ? l = `${s}-start` : a === "end" && (l = `${s}-end`));
    const c = ps.getInstance().createFloating(e, n, {
      placement: l,
      offset: o,
      flip: {
        fallbackStrategy: "bestFit",
        padding: 8
      },
      shift: {
        padding: 8,
        crossAxis: !0
      },
      size: {
        apply: ({ availableHeight: u }) => {
          const f = Math.max(u - 16, 200);
          n.style.maxHeight = `${f}px`, n.style.overflowY = "auto";
        }
      },
      hide: {
        strategy: "escaped"
      },
      autoUpdate: {
        ancestorScroll: !0,
        ancestorResize: !0,
        elementResize: !0,
        layoutShift: !0
      }
    });
    i.floating = c, this.setState(t, i);
  }
  /**
   * Parse time string into components
   */
  parseTime(t) {
    var e;
    if (!t) return null;
    try {
      const n = [
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
      ];
      for (const i of n) {
        const s = t.match(i);
        if (s) {
          const a = parseInt(s[1]), o = parseInt(s[2]), l = parseInt(s[3] || "0"), c = (e = s[4]) == null ? void 0 : e.toUpperCase();
          return { hour: a, minute: o, second: l, period: c };
        }
      }
    } catch {
    }
    return null;
  }
  /**
   * Get current time
   */
  getCurrentTime() {
    const t = /* @__PURE__ */ new Date();
    return {
      hour: t.getHours(),
      minute: t.getMinutes(),
      second: t.getSeconds()
    };
  }
  /**
   * Format time value from state
   */
  formatTimeValue(t) {
    const { hour: e, minute: n, second: i, period: s, format: a, showSeconds: o } = t;
    if (a === "12") {
      const l = e.toString(), c = n.toString().padStart(2, "0"), u = i.toString().padStart(2, "0");
      return o ? `${l}:${c}:${u} ${s}` : `${l}:${c} ${s}`;
    } else {
      const l = e.toString().padStart(2, "0"), c = n.toString().padStart(2, "0"), u = i.toString().padStart(2, "0");
      return o ? `${l}:${c}:${u}` : `${l}:${c}`;
    }
  }
  /**
   * Check if timepicker is disabled
   */
  isDisabled(t) {
    return t.dataset.disabled === "true";
  }
  /**
   * Dispatch custom timepicker event
   */
  dispatchTimePickerEvent(t, e, n = null) {
    D.dispatchCustomEvent(t, e, {
      timepicker: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Get timepicker state (for external access)
   */
  getTimePickerState(t) {
    return this.getState(t) || null;
  }
  /**
   * Set time programmatically
   */
  setTime(t, e) {
    const n = this.parseTime(e), i = this.getState(t);
    !n || !i || (i.hour = n.hour, i.minute = n.minute, i.second = n.second, n.period && (i.period = n.period), this.setState(t, i), this.updateDisplay(t), this.updateSelectedStates(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: this.formatTimeValue(i),
      state: { ...i }
    }));
  }
  /**
   * Clean up TimePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.getAllStates().forEach((t, e) => {
      t.floating && t.floating.cleanup();
    });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Zr.getInstance().init();
}) : Zr.getInstance().init();
window.TimePickerActions = Zr;
Zr.getInstance();
class Xr extends ht {
  /**
   * Initialize accordion elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll("details[data-accordion]").forEach((t) => {
      this.initializeAccordion(t);
    });
  }
  /**
   * Initialize a single accordion element
   */
  initializeAccordion(t) {
    if (this.hasState(t))
      return;
    const e = {
      isOpen: t.open
    };
    this.setState(t, e);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("details[data-accordion] summary", (t, e) => {
      const n = b.findClosest(t, "details[data-accordion]");
      n && this.handleSummaryClick(n, e);
    }), D.handleDelegatedEvent("toggle", "details[data-accordion]", (t) => {
      this.handleToggle(t);
    });
  }
  /**
   * Setup dynamic observer for new accordions - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          n.matches && n.matches("details[data-accordion]") && this.initializeAccordion(n), b.querySelectorAll("details[data-accordion]", n).forEach((i) => {
            this.initializeAccordion(i);
          });
        }
      });
    });
  }
  /**
   * Handle summary click - now just updates state and dispatches events
   */
  handleSummaryClick(t, e) {
    const n = this.getState(t);
    n && (n.isOpen = !t.open, this.setState(t, n), this.dispatchAccordionEvent(t, n.isOpen ? "accordion:expanding" : "accordion:collapsing"));
  }
  /**
   * Handle toggle events (for keyboard navigation)
   */
  handleToggle(t) {
    const e = this.getState(t);
    e && (e.isOpen = t.open, this.setState(t, e)), this.dispatchAccordionEvent(t, "accordion:toggle", {
      isExpanded: t.open
    });
  }
  /**
   * Programmatically open an accordion
   */
  openAccordion(t) {
    const e = b.getElementById(t);
    if (!e || !e.matches("details[data-accordion]"))
      return console.warn(`Accordion with id "${t}" not found`), !1;
    if (e.open)
      return !0;
    e.open = !0;
    const n = this.getState(e);
    return n && (n.isOpen = !0, this.setState(e, n)), this.dispatchAccordionEvent(e, "accordion:opened", {
      isExpanded: !0
    }), !0;
  }
  /**
   * Programmatically close an accordion
   */
  closeAccordion(t) {
    const e = b.getElementById(t);
    if (!e || !e.matches("details[data-accordion]"))
      return console.warn(`Accordion with id "${t}" not found`), !1;
    if (!e.open)
      return !0;
    e.open = !1;
    const n = this.getState(e);
    return n && (n.isOpen = !1, this.setState(e, n)), this.dispatchAccordionEvent(e, "accordion:closed", {
      isExpanded: !1
    }), !0;
  }
  /**
   * Toggle an accordion's state
   */
  toggleAccordion(t) {
    const e = b.getElementById(t);
    return !e || !e.matches("details[data-accordion]") ? (console.warn(`Accordion with id "${t}" not found`), !1) : e.open ? this.closeAccordion(t) : this.openAccordion(t);
  }
  /**
   * Check if accordion is open
   */
  isAccordionOpen(t) {
    const e = b.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Check if accordion is animating (deprecated - CSS animations don't need tracking)
   */
  isAccordionAnimating(t) {
    return !1;
  }
  /**
   * Get accordion state
   */
  getAccordionState(t) {
    const e = b.getElementById(t);
    return e && this.getState(e) || null;
  }
  /**
   * Dispatch custom accordion events
   */
  dispatchAccordionEvent(t, e, n = {}) {
    D.dispatchCustomEvent(t, e, {
      accordion: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Clean up AccordionActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Xr.getInstance().init();
}) : Xr.getInstance().init();
window.AccordionActions = Xr;
Xr.getInstance();
class Vn {
  /**
   * Check if Livewire is available globally
   */
  static isLivewireAvailable() {
    return typeof window < "u" && "Livewire" in window;
  }
  /**
   * Detect if an editor element is Livewire-enabled
   */
  static isLivewireEnabled(t) {
    return t.dataset.livewireEnabled === "true" || t.dataset.livewireMode === "true" || !!t.dataset.wireModel || !!t.querySelector('[data-quill-input="true"][wire\\:model]');
  }
  /**
   * Get the Livewire component for an editor element
   */
  static getLivewireComponent(t) {
    if (!this.isLivewireAvailable()) return null;
    const e = t.closest("[wire\\:id]");
    return e ? window.Livewire.find(e.getAttribute("wire:id")) : null;
  }
  /**
   * Get the wire:model property name from the editor container
   */
  static getWireModelProperty(t) {
    if (t.dataset.wireModel)
      return t.dataset.wireModel;
    if (t.dataset.livewireProperty)
      return t.dataset.livewireProperty;
    for (const n of t.attributes)
      if (n.name.startsWith("wire:model"))
        return n.value;
    const e = t.querySelector('[data-quill-input="true"]');
    if (e) {
      for (const n of e.attributes)
        if (n.name.startsWith("wire:model"))
          return n.value;
    }
    return null;
  }
  /**
   * Update Livewire property value
   */
  static updateLivewireProperty(t, e) {
    const n = this.getLivewireComponent(t), i = this.getWireModelProperty(t);
    if (!(!n || !i))
      try {
        n.set(i, e);
      } catch (s) {
        console.warn("Failed to update Livewire property:", i, s);
      }
  }
  /**
   * Format value for Livewire (HTML content)
   */
  static formatValueForLivewire(t) {
    return t || "";
  }
}
class Wc extends ht {
  /**
   * Initialize editor elements - required by BaseActionClass
   */
  initializeElements() {
    this.processQuillEditors();
  }
  /**
   * Process all existing Quill editors on the page
   */
  processQuillEditors() {
    b.findByDataAttribute("quill-editor", "true").forEach((e) => this.initializeQuillEditor(e));
  }
  /**
   * Bind event listeners - minimal for Quill integration
   */
  bindEventListeners() {
  }
  /**
   * Setup dynamic observer for new editors - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "quill-editor", "true") && this.initializeQuillEditor(n), b.findByDataAttribute("quill-editor", "true", n).forEach((s) => this.initializeQuillEditor(s));
        }
      });
    });
  }
  /**
   * Find the hidden input for an editor
   */
  findHiddenInput(t) {
    return b.querySelector('[data-quill-input="true"]', t);
  }
  /**
   * Initialize a single Quill editor element
   */
  initializeQuillEditor(t) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initializeQuillEditor(t);
      });
      return;
    }
    if (!b.getDataAttribute(t, "editorId")) {
      console.warn("Editor missing editorId, skipping initialization");
      return;
    }
    if (this.hasState(t))
      return;
    const n = b.querySelector('[data-quill-container="true"]', t), i = this.findHiddenInput(t), s = b.querySelector('[data-quill-live-region="true"]', t);
    if (!n)
      return;
    const a = b.getDataAttribute(n, "quillConfig");
    let o = "";
    if (i && i.value)
      o = i.value;
    else {
      const h = b.getDataAttribute(n, "quill-value");
      if (h)
        try {
          o = JSON.parse(h);
        } catch {
          o = h;
        }
    }
    let l = {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ header: [1, 2, !1] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"]
        ]
      }
    };
    if (a)
      try {
        const h = JSON.parse(a);
        l = { ...l, ...h };
      } catch {
      }
    let c;
    try {
      if (!window.Quill) {
        console.error("Global Quill not available");
        return;
      }
      c = new window.Quill(n, l);
    } catch (h) {
      console.error("Quill initialization failed:", h);
      return;
    }
    if (o)
      try {
        c.clipboard.dangerouslyPasteHTML(o);
      } catch (h) {
        console.warn("Failed to set initial content:", h), c.setText(o);
      }
    Vn.isLivewireEnabled(t);
    const u = {
      quillInstance: c,
      containerElement: n,
      hiddenInput: i,
      config: l,
      liveRegion: s,
      lastAnnouncementTime: 0
    };
    this.setState(t, u), this.setupContentSync(u), this.setupAccessibilityFeatures(u);
  }
  /**
   * Set up content synchronization between Quill and Livewire
   */
  setupContentSync(t) {
    const e = Vn.isLivewireEnabled(t.containerElement);
    t.quillInstance.on("text-change", (n, i, s) => {
      e ? this.syncToLivewireWithState(t) : this.syncQuillToInput(t);
    }), e ? this.syncToLivewireWithState(t) : this.syncQuillToInput(t);
  }
  /**
   * Sync Quill content to hidden input and dispatch events for Livewire
   */
  syncQuillToInput(t) {
    if (t.hiddenInput) {
      const e = t.quillInstance.root.innerHTML, n = t.hiddenInput.value;
      e !== n && (t.hiddenInput.value = e, this.dispatchLivewireInputEvent(t.hiddenInput, e));
    }
  }
  /**
   * Dispatch proper input events for Livewire integration
   */
  dispatchLivewireInputEvent(t, e) {
    const n = new InputEvent("input", {
      bubbles: !0,
      cancelable: !0,
      inputType: "insertText",
      data: e
    });
    t.dispatchEvent(n);
    const i = new Event("change", { bubbles: !0, cancelable: !0 });
    t.dispatchEvent(i);
  }
  /**
   * Get editor content as HTML
   */
  getEditorContent(t) {
    const e = this.getState(t);
    return e ? e.quillInstance.root.innerHTML : "";
  }
  /**
   * Set editor content
   */
  setEditorContent(t, e) {
    const n = this.getState(t);
    if (n) {
      try {
        n.quillInstance.clipboard.dangerouslyPasteHTML(e);
      } catch (i) {
        console.warn("Failed to set editor content:", i), n.quillInstance.setText(e);
      }
      this.syncQuillToInput(n);
    }
  }
  /**
   * Clear editor content
   */
  clearEditor(t) {
    const e = this.getState(t);
    e && (e.quillInstance.setText(""), this.syncQuillToInput(e));
  }
  /**
   * Focus specific editor
   */
  focusEditor(t) {
    const e = this.getState(t);
    e && e.quillInstance.focus();
  }
  /**
   * Get Quill instance for advanced usage
   */
  getQuillInstance(t) {
    const e = this.getState(t);
    return e ? e.quillInstance : null;
  }
  /**
   * Set up accessibility features for the editor
   */
  setupAccessibilityFeatures(t) {
    this.setupKeyboardNavigation(t), this.setupContentAnnouncements(t), this.setupToolbarAccessibility(t);
  }
  /**
   * Set up keyboard navigation enhancements
   */
  setupKeyboardNavigation(t) {
    t.quillInstance.keyboard.addBinding({
      key: "F1",
      handler: () => (this.announceKeyboardHelp(t), !1)
    }), t.containerElement.addEventListener("focus", () => {
      t.liveRegion && this.announceToLiveRegion(t, "Rich text editor focused. Press F1 for keyboard shortcuts.");
    });
  }
  /**
   * Set up content change announcements for screen readers
   */
  setupContentAnnouncements(t) {
    let e = null;
    const n = 2e3;
    t.quillInstance.on("text-change", (i, s, a) => {
      a === "user" && (e && clearTimeout(e), e = window.setTimeout(() => {
        const o = t.quillInstance.getText().trim(), l = o ? o.split(/\s+/).length : 0;
        l > 0 && this.announceToLiveRegion(t, `${l} words written`);
      }, n));
    }), t.quillInstance.on("selection-change", (i, s, a) => {
      if (i && a === "user") {
        const o = t.quillInstance.getFormat(i);
        this.announceFormattingChanges(t, o);
      }
    });
  }
  /**
   * Set up toolbar accessibility enhancements
   */
  setupToolbarAccessibility(t) {
    const e = t.containerElement.querySelector(".ql-toolbar");
    if (!e) return;
    e.setAttribute("role", "toolbar"), e.setAttribute("aria-label", "Rich text editor toolbar");
    const n = e.querySelectorAll("button");
    n.forEach((i, s) => {
      this.enhanceButtonAccessibility(i), i.setAttribute("tabindex", s === 0 ? "0" : "-1");
    }), e.addEventListener("keydown", (i) => {
      this.handleToolbarKeyboard(i, n);
    });
  }
  /**
   * Enhance individual button accessibility
   */
  enhanceButtonAccessibility(t) {
    const e = {
      "ql-bold": "Bold",
      "ql-italic": "Italic",
      "ql-underline": "Underline",
      "ql-strike": "Strikethrough",
      "ql-link": "Insert link",
      "ql-clean": "Remove formatting",
      'ql-list[value="ordered"]': "Numbered list",
      'ql-list[value="bullet"]': "Bullet list",
      'ql-header[value="1"]': "Heading 1",
      'ql-header[value="2"]': "Heading 2"
    };
    for (const [n, i] of Object.entries(e))
      if (t.classList.contains(n.split("[")[0]) || t.matches(`[${n.split("[")[1]}`)) {
        t.setAttribute("aria-label", i), t.setAttribute("title", i);
        break;
      }
  }
  /**
   * Handle toolbar keyboard navigation
   */
  handleToolbarKeyboard(t, e) {
    const n = Array.from(e).findIndex((s) => s === document.activeElement);
    if (n === -1) return;
    let i = n;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowUp":
        i = n > 0 ? n - 1 : e.length - 1, t.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowDown":
        i = n < e.length - 1 ? n + 1 : 0, t.preventDefault();
        break;
      case "Home":
        i = 0, t.preventDefault();
        break;
      case "End":
        i = e.length - 1, t.preventDefault();
        break;
      default:
        return;
    }
    e[n].setAttribute("tabindex", "-1"), e[i].setAttribute("tabindex", "0"), e[i].focus();
  }
  /**
   * Announce text to the live region
   */
  announceToLiveRegion(t, e) {
    if (!t.liveRegion) return;
    const n = Date.now();
    n - t.lastAnnouncementTime < 1e3 || (t.liveRegion.textContent = e, t.lastAnnouncementTime = n, setTimeout(() => {
      t.liveRegion && (t.liveRegion.textContent = "");
    }, 3e3));
  }
  /**
   * Announce formatting changes
   */
  announceFormattingChanges(t, e) {
    const n = Object.keys(e).filter((i) => e[i]);
    if (n.length > 0) {
      const i = n.map((s) => {
        switch (s) {
          case "bold":
            return "bold";
          case "italic":
            return "italic";
          case "underline":
            return "underlined";
          case "strike":
            return "strikethrough";
          case "header":
            return `heading ${e[s]}`;
          case "list":
            return `${e[s]} list`;
          default:
            return s;
        }
      });
      this.announceToLiveRegion(t, `Formatting: ${i.join(", ")}`);
    }
  }
  /**
   * Announce keyboard shortcuts help
   */
  announceKeyboardHelp(t) {
    this.announceToLiveRegion(t, "Keyboard shortcuts: Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, Ctrl+K for link. Use arrow keys to navigate toolbar buttons.");
  }
  /**
   * Synchronize content from Quill to Livewire using provided state
   */
  syncToLivewireWithState(t) {
    const e = t.quillInstance.root.innerHTML, n = Vn.formatValueForLivewire(e);
    Vn.updateLivewireProperty(t.containerElement, n);
  }
  /**
   * Reinitialize editor after DOM morphing
   */
  reinitializeAfterMorph(t) {
    b.querySelector('[data-quill-container="true"]', t) && !this.hasState(t) && this.initializeQuillEditor(t);
  }
  /**
   * Manually trigger content sync to Livewire (for debugging)
   */
  manualSync() {
    b.querySelectorAll('[data-quill-container="true"]').forEach((e) => {
      if (Vn.isLivewireEnabled(e)) {
        const n = window.Quill.find(e);
        if (n) {
          const i = n.root.innerHTML, s = Vn.formatValueForLivewire(i);
          Vn.updateLivewireProperty(e, s);
        }
      }
    });
  }
  /**
   * Clean up EditorActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.stateManager.forEach((t) => {
      t.quillInstance.off("text-change");
    });
  }
}
Wc.getInstance();
class Jr extends ht {
  /**
   * Initialize date picker elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("date-picker", "true").forEach((t) => {
      this.initializeDatePicker(t);
    });
  }
  /**
   * Initialize a single date picker element
   */
  initializeDatePicker(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.datePickerConfig, n = t.dataset.inline === "true", i = t.dataset.disabled === "true";
    let s;
    try {
      s = e ? JSON.parse(e) : {};
    } catch (o) {
      console.error("Failed to parse date picker config:", o), s = {};
    }
    const a = {
      isOpen: n,
      selectedDate: s.selectedDate || null,
      startDate: s.startDate || null,
      endDate: s.endDate || null,
      format: s.format || "Y-m-d",
      displayFormat: s.displayFormat || s.format || "Y-m-d",
      isRange: s.isRange || !1,
      closeOnSelect: s.closeOnSelect !== !1,
      isInline: n,
      isDisabled: i,
      position: "bottom"
    };
    this.setState(t, a), this.setupCalendarEventListeners(t), n && this.openDropdown(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-date-picker-input]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-date-picker="true"]');
      n && !this.isDisabled(n) && this.toggleDropdown(n);
    }), D.handleDelegatedClick("[data-date-picker-trigger]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = b.findClosest(t, '[data-date-picker="true"]');
      n && !this.isDisabled(n) && this.toggleDropdown(n);
    }), D.handleDelegatedClick("[data-date-picker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = b.findClosest(t, '[data-date-picker="true"]');
      n && !this.isDisabled(n) && this.clearDate(n);
    }), D.handleDelegatedClick("[data-quick-selector]", (t, e) => {
      e.preventDefault();
      const n = b.findClosest(t, '[data-date-picker="true"]'), i = t.dataset.quickSelector;
      n && i && !this.isDisabled(n) && this.applyQuickSelector(n, i);
    }), D.handleDelegatedKeydown("[data-date-picker-input]", (t, e) => {
      const n = b.findClosest(t, '[data-date-picker="true"]');
      if (!n) return;
      const i = this.getState(n);
      if (i)
        switch (e.key) {
          case "Escape":
            i.isOpen && (e.preventDefault(), this.closeDropdown(n));
            break;
          case "Enter":
            e.preventDefault(), i.isOpen || this.openDropdown(n);
            break;
          case "ArrowDown":
            i.isOpen || (e.preventDefault(), this.openDropdown(n));
            break;
          case "Tab":
            if (i.isOpen && !e.shiftKey) {
              const s = b.querySelector('[data-calendar="true"]', n);
              s && setTimeout(() => {
                const a = s.querySelector("button:not(:disabled)");
                a && a.focus();
              }, 10);
            }
            break;
        }
    }), D.handleDelegatedInput("[data-date-picker-input]", (t) => {
      if (!t.readOnly) {
        const e = b.findClosest(t, '[data-date-picker="true"]');
        e && !this.isDisabled(e) && this.handleManualInput(e, t.value);
      }
    }), D.addEventListener(document, "click", (t) => {
      const e = t.target;
      b.findByDataAttribute("date-picker", "true").forEach((n) => {
        const i = this.getState(n);
        if (i && i.isOpen && !i.isInline) {
          const s = !n.contains(e), a = e.closest('[data-calendar="true"]') || e.hasAttribute("data-calendar-date") || e.hasAttribute("data-calendar-nav") || e.hasAttribute("data-calendar-action") || e.hasAttribute("data-quick-selector");
          s && !a && this.closeDropdown(n);
        }
      });
    }), D.handleResize(() => {
      b.findByDataAttribute("date-picker", "true").forEach((t) => {
        const e = this.getState(t);
        e && e.isOpen && !e.isInline && this.updateDropdownPosition(t);
      });
    });
  }
  /**
   * Setup calendar event listeners for a date picker
   */
  setupCalendarEventListeners(t) {
    const e = b.querySelector('[data-calendar="true"]', t);
    e && (e.addEventListener("calendar:dateSelected", (n) => {
      n.stopPropagation();
      const i = n.detail;
      this.handleDateSelected(t, i.selectedDate, i.formattedDate);
    }), e.addEventListener("calendar:rangeSelected", (n) => {
      n.stopPropagation();
      const i = n.detail;
      this.handleRangeSelected(t, i.startDate, i.endDate, i.formattedRange);
    }), e.addEventListener("calendar:cleared", (n) => {
      n.stopPropagation(), this.handleCalendarCleared(t);
    }));
  }
  /**
   * Toggle dropdown open/closed
   */
  toggleDropdown(t) {
    const e = this.getState(t);
    !e || e.isInline || (e.isOpen ? this.closeDropdown(t) : this.openDropdown(t));
  }
  /**
   * Open dropdown
   */
  openDropdown(t) {
    const e = this.getState(t);
    if (!e || e.isOpen || e.isDisabled) return;
    e.isOpen = !0, this.setState(t, e);
    const n = b.querySelector("[data-date-picker-dropdown]", t);
    n && (this.updateDropdownPosition(t), n.classList.add("animating-in"), n.classList.add("open"), setTimeout(() => {
      n.classList.remove("animating-in");
      const i = b.querySelector('[data-calendar="true"]', t);
      if (i) {
        const s = i.querySelector('button:not(:disabled), [tabindex="0"]');
        s && s.focus();
      }
    }, 200), this.dispatchDatePickerEvent(t, "datepicker:opened"));
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen || e.isInline) return;
    e.floating && (e.floating.cleanup(), e.floating = void 0), e.isOpen = !1, this.setState(t, e);
    const n = b.querySelector("[data-date-picker-dropdown]", t);
    if (!n) return;
    n.classList.remove("open");
    const i = b.querySelector("[data-date-picker-input]", t);
    i && i.focus(), this.dispatchDatePickerEvent(t, "datepicker:closed");
  }
  /**
   * Update dropdown position using Floating UI
   */
  updateDropdownPosition(t) {
    const e = b.querySelector("[data-date-picker-dropdown]", t);
    !e || !this.getState(t) || this.setupFloating(t, e);
  }
  /**
   * Setup floating for date picker using Floating UI
   */
  setupFloating(t, e) {
    const n = this.getState(t);
    if (!n) return;
    n.floating && n.floating.cleanup();
    const s = b.querySelector("[data-date-picker-input]", t) || t, a = t.dataset.position || "bottom", o = t.dataset.align || "start", l = parseInt(t.dataset.offset || "8");
    let c = a;
    (a === "bottom" || a === "top") && (o === "start" ? c = `${a}-start` : o === "end" && (c = `${a}-end`));
    const u = ps.getInstance().createFloating(s, e, {
      placement: c,
      offset: l,
      flip: {
        fallbackStrategy: "bestFit",
        padding: 8
      },
      shift: {
        padding: 8,
        crossAxis: !0
      },
      hide: {
        strategy: "escaped"
      },
      autoUpdate: {
        ancestorScroll: !0,
        ancestorResize: !0,
        elementResize: !0,
        layoutShift: !0
      }
    });
    n.floating = u, this.setState(t, n);
  }
  /**
   * Handle date selection from calendar
   */
  handleDateSelected(t, e, n) {
    const i = this.getState(t);
    if (!i) return;
    i.selectedDate = e, this.setState(t, i);
    const s = b.querySelector("[data-date-picker-input]", t);
    s && n && (s.value = $t.formatDateForDisplay(e, i.displayFormat));
    const a = b.querySelector("[data-date-picker-value]", t);
    a && (a.value = e ? $t.formatDateForSubmission(e, i.format) : ""), i.closeOnSelect && !i.isInline && !i.isRange && setTimeout(() => {
      this.closeDropdown(t);
    }, 150), this.dispatchDatePickerEvent(t, "datepicker:change", {
      value: e,
      formatted: n
    });
  }
  /**
   * Handle range selection from calendar
   */
  handleRangeSelected(t, e, n, i) {
    const s = this.getState(t);
    if (!s) return;
    s.startDate = e, s.endDate = n, this.setState(t, s);
    const a = b.querySelector("[data-date-picker-input]", t);
    a && (a.value = $t.formatRangeForDisplay(e, n, s.displayFormat));
    const o = b.querySelector("[data-date-picker-value]", t);
    if (o) {
      const l = $t.formatRangeForSubmission(e, n, s.format);
      o.value = l || "";
    }
    s.closeOnSelect && e && n && !s.isInline && setTimeout(() => {
      this.closeDropdown(t);
    }, 150), this.dispatchDatePickerEvent(t, "datepicker:change", {
      startDate: e,
      endDate: n,
      formatted: i
    });
  }
  /**
   * Handle calendar cleared event
   */
  handleCalendarCleared(t) {
    this.clearDate(t);
  }
  /**
   * Clear selected date(s)
   */
  clearDate(t) {
    const e = this.getState(t);
    if (!e) return;
    e.selectedDate = null, e.startDate = null, e.endDate = null, this.setState(t, e);
    const n = b.querySelector("[data-date-picker-input]", t);
    n && (n.value = "");
    const i = b.querySelector("[data-date-picker-value]", t);
    i && (i.value = "");
    const s = b.querySelector('[data-calendar="true"]', t);
    if (s && window.CalendarActions)
      try {
        const a = window.CalendarActions.getInstance();
        if (e.isRange) {
          const o = a.getCalendarState(s);
          o && (o.startDate = null, o.endDate = null, o.rangeSelectionState = "none", a.setState(s, o), s.dispatchEvent(new CustomEvent("calendar:cleared")));
        } else
          a.setSelectedDate(s, null);
      } catch (a) {
        console.warn("Calendar actions not available or failed:", a);
      }
    e.isInline || this.closeDropdown(t), this.dispatchDatePickerEvent(t, "datepicker:cleared");
  }
  /**
   * Apply quick selector
   */
  applyQuickSelector(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const { start: i, end: s } = $t.getQuickSelectorDate(e);
    let a = i, o = i, l = s;
    const c = b.querySelector('[data-calendar="true"]', t);
    if (c && window.CalendarActions)
      try {
        const u = window.CalendarActions.getInstance();
        if (n.isRange && o && l) {
          const h = u.getCalendarState(c);
          h && (h.startDate = $t.formatDateString(o), h.endDate = $t.formatDateString(l), h.rangeSelectionState = "none", u.setState(c, h), c.dispatchEvent(new CustomEvent("calendar:rangeSelected", {
            detail: {
              startDate: h.startDate,
              endDate: h.endDate,
              formattedRange: $t.formatRangeForDisplay(h.startDate, h.endDate, n.displayFormat)
            }
          })));
        } else if (a) {
          const h = $t.formatDateString(a);
          u.setSelectedDate(c, h);
        }
      } catch (u) {
        console.warn("Calendar actions not available or failed:", u);
      }
  }
  /**
   * Handle manual input
   */
  handleManualInput(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = $t.parseInputDate(e, n.displayFormat);
    if (i) {
      const s = $t.formatDateString(i), a = b.querySelector('[data-calendar="true"]', t);
      if (a && window.CalendarActions)
        try {
          window.CalendarActions.getInstance().setSelectedDate(a, s);
        } catch (o) {
          console.warn("Calendar actions not available or failed:", o);
        }
    }
  }
  // updateClearButtonVisibility method removed - visibility handled by template conditional rendering
  /**
   * Check if date picker is disabled
   */
  isDisabled(t) {
    const e = this.getState(t);
    return e ? e.isDisabled : !1;
  }
  /**
   * Dispatch custom date picker event
   */
  dispatchDatePickerEvent(t, e, n = null) {
    D.dispatchCustomEvent(t, e, {
      datePicker: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Setup dynamic observer for new date pickers - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          b.hasDataAttribute(n, "date-picker", "true") && this.initializeDatePicker(n), b.findByDataAttribute("date-picker", "true", n).forEach((i) => {
            this.initializeDatePicker(i);
          });
        }
      });
    });
  }
  /**
   * Clean up DatePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.getAllStates().forEach((t, e) => {
      t.floating && t.floating.cleanup();
    });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Jr.getInstance().init();
}) : Jr.getInstance().init();
window.DatePickerActions = Jr;
Jr.getInstance();
class Kc extends ht {
  constructor() {
    super(...arguments), this.cleanupFunctions = [];
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      D.handleDelegatedClick(
        '[data-add-to-cart="true"]',
        (t, e) => this.handleAddToCart(t, e)
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedClick(
        ".qty-decrease",
        (t, e) => this.handleQuantityChange(t, e, "decrease")
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedClick(
        ".qty-increase",
        (t, e) => this.handleQuantityChange(t, e, "increase")
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedInput(
        ".qty-input",
        (t, e) => this.handleQuantityInput(t, e)
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedKeydown(
        ".qty-input",
        (t, e) => this.handleQuantityKeydown(t, e)
      )
    );
  }
  initializeElements() {
    b.findByDataAttribute("add-to-cart", "true").forEach((e) => this.initializeButton(e));
  }
  initializeButton(t) {
    const e = this.extractStateFromButton(t);
    if (e) {
      const n = b.querySelector(".button-text", t);
      n && (e.originalText = n.textContent || ""), this.setState(t, e), this.updateButtonState(t), this.updateQuantityControls(t);
    }
  }
  extractStateFromButton(t) {
    const e = b.getDataAttribute(t, "productId");
    return e ? {
      productId: e,
      variantId: b.getDataAttribute(t, "variantId"),
      quantity: parseInt(b.getDataAttribute(t, "quantity") || "1"),
      maxQuantity: parseInt(b.getDataAttribute(t, "maxQuantity") || "99"),
      stockLevel: b.getDataAttribute(t, "stockLevel") ? parseInt(b.getDataAttribute(t, "stockLevel")) : void 0,
      price: b.getDataAttribute(t, "price"),
      ajaxUrl: b.getDataAttribute(t, "ajaxUrl") || "/cart/add",
      inCart: b.getDataAttribute(t, "inCart") === "true",
      isProcessing: !1
    } : (console.warn("AddToCart button missing required data-product-id attribute"), null);
  }
  async handleAddToCart(t, e) {
    if (e.preventDefault(), b.isDisabled(t))
      return;
    const n = this.getState(t);
    if (!n || n.isProcessing)
      return;
    const i = this.getQuantityInput(t);
    if (i && (n.quantity = parseInt(i.value) || 1), !this.validateQuantity(n.quantity, n)) {
      this.showError(t, "Invalid quantity");
      return;
    }
    n.isProcessing = !0, this.setState(t, n), this.setButtonState(t, "adding");
    try {
      const s = await this.sendCartRequest(n);
      if (s.success)
        n.inCart = s.inCart ?? !0, n.isProcessing = !1, s.stockLevel !== void 0 && (n.stockLevel = s.stockLevel, b.setDataAttribute(t, "stockLevel", s.stockLevel.toString())), this.setState(t, n), this.setButtonState(t, "added"), this.dispatchCartEvent(t, "cart:added", {
          productId: n.productId,
          variantId: n.variantId,
          quantity: n.quantity,
          cartCount: s.cartCount
        }), setTimeout(() => {
          var a;
          (a = this.getState(t)) != null && a.inCart && this.setButtonState(t, "default");
        }, 2e3);
      else
        throw new Error(s.error || s.message || "Failed to add to cart");
    } catch (s) {
      n.isProcessing = !1, this.setState(t, n), this.setButtonState(t, "default"), this.showError(t, s instanceof Error ? s.message : "An error occurred");
    }
    this.updateQuantityControls(t);
  }
  handleQuantityChange(t, e, n) {
    e.preventDefault();
    const i = b.getDataAttribute(t, "target");
    if (!i) return;
    const s = b.getElementById(i);
    if (!s) return;
    const a = b.findClosest(t, ".add-to-cart-wrapper"), o = a ? b.querySelector('[data-add-to-cart="true"]', a) : null;
    if (!o) return;
    const l = this.getState(o);
    if (!l) return;
    const c = parseInt(s.value) || 1;
    let u = c;
    n === "increase" ? u = Math.min(c + 1, l.maxQuantity) : u = Math.max(c - 1, 1), u !== c && (s.value = u.toString(), l.quantity = u, this.setState(o, l), this.dispatchCartEvent(o, "cart:quantity-changed", {
      productId: l.productId,
      quantity: u,
      previousQuantity: c
    })), this.updateQuantityControls(o);
  }
  handleQuantityInput(t, e) {
    const n = b.findClosest(t, ".add-to-cart-wrapper"), i = n ? b.querySelector('[data-add-to-cart="true"]', n) : null;
    if (!i) return;
    const s = this.getState(i);
    if (!s) return;
    let a = parseInt(t.value) || 1;
    a = Math.max(1, Math.min(a, s.maxQuantity)), t.value !== a.toString() && (t.value = a.toString()), s.quantity = a, this.setState(i, s), this.updateQuantityControls(i);
  }
  handleQuantityKeydown(t, e) {
    [8, 9, 27, 13, 35, 36, 37, 39, 38, 40].includes(e.keyCode) || // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode) || (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.preventDefault();
  }
  validateQuantity(t, e) {
    return !(t < 1 || t > e.maxQuantity || e.stockLevel !== void 0 && t > e.stockLevel);
  }
  async sendCartRequest(t) {
    var s;
    const e = new FormData();
    e.append("product_id", t.productId), e.append("quantity", t.quantity.toString()), t.variantId && e.append("variant_id", t.variantId);
    const n = (s = b.querySelector('meta[name="csrf-token"]')) == null ? void 0 : s.getAttribute("content");
    n && e.append("_token", n);
    const i = await fetch(t.ajaxUrl, {
      method: "POST",
      body: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    });
    if (!i.ok)
      throw new Error(`HTTP ${i.status}: ${i.statusText}`);
    return await i.json();
  }
  setButtonState(t, e) {
    b.removeClasses(t, ["adding", "added"]), e !== "default" && b.addClass(t, e);
    const n = b.querySelector(".button-text", t);
    if (n) {
      const i = this.getState(t);
      switch (e) {
        case "adding":
          const s = b.getDataAttribute(t, "labelToggle");
          s && (n.textContent = s);
          break;
        case "added":
          const a = b.getDataAttribute(t, "labelSuccess");
          a && (n.textContent = a);
          break;
        case "default":
          i != null && i.originalText && (n.textContent = i.originalText);
          break;
      }
    }
  }
  updateButtonState(t) {
    const e = this.getState(t);
    e && (e.stockLevel !== void 0 && e.stockLevel <= 0 ? (b.toggleAttribute(t, "disabled", "true"), b.addClasses(t, ["cursor-not-allowed", "opacity-50"])) : (b.toggleAttribute(t, "disabled"), b.removeClasses(t, ["cursor-not-allowed", "opacity-50"])));
  }
  updateQuantityControls(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = b.findClosest(t, ".add-to-cart-wrapper");
    if (!n) return;
    const i = b.querySelector(".qty-decrease", n);
    i && b.toggleAttribute(i, "disabled", e.quantity <= 1 ? "true" : void 0);
    const s = b.querySelector(".qty-increase", n);
    if (s) {
      const o = e.quantity >= e.maxQuantity || e.stockLevel !== void 0 && e.quantity >= e.stockLevel;
      b.toggleAttribute(s, "disabled", o ? "true" : void 0);
    }
    const a = this.getQuantityInput(t);
    a && (a.max = e.maxQuantity.toString(), e.stockLevel !== void 0 && (a.max = Math.min(e.maxQuantity, e.stockLevel).toString()));
  }
  getQuantityInput(t) {
    const e = b.findClosest(t, ".add-to-cart-wrapper");
    return e ? b.querySelector(".qty-input", e) : null;
  }
  showError(t, e) {
    this.dispatchCartEvent(t, "cart:error", { message: e }), console.error("Add to Cart Error:", e);
  }
  dispatchCartEvent(t, e, n) {
    D.dispatchCustomEvent(t, e, n);
  }
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        e instanceof Element && b.findByDataAttribute("add-to-cart", "true", e).forEach((i) => this.initializeButton(i));
      });
    });
  }
  destroy() {
    this.cleanupFunctions.forEach((t) => t()), this.cleanupFunctions = [], super.destroy();
  }
}
if (typeof document < "u") {
  const r = () => {
    Kc.getInstance().init();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
}
class Ub extends ht {
  constructor() {
    super(), this.cleanupFunctions = [], this.currentModal = null;
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      D.handleDelegatedClick(
        "[data-lightbox-trigger]",
        (t, e) => this.handleThumbnailClick(t, e)
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedClick(
        "[data-lightbox-close]",
        (t, e) => this.handleCloseClick(t, e)
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedClick(
        "[data-lightbox-prev]",
        (t, e) => this.handlePrevClick(t, e)
      )
    ), this.cleanupFunctions.push(
      D.handleDelegatedClick(
        "[data-lightbox-next]",
        (t, e) => this.handleNextClick(t, e)
      )
    ), this.cleanupFunctions.push(
      D.addEventListener(document, "keydown", (t) => {
        this.handleKeydown(t);
      })
    ), this.cleanupFunctions.push(
      D.handleDelegatedClick(
        "[data-lightbox-modal]",
        (t, e) => this.handleModalBackgroundClick(t, e)
      )
    );
  }
  initializeElements() {
    b.findByDataAttribute("file-upload-zone").forEach((i) => {
      if (i.getAttribute("data-lightbox") === "true") {
        const a = i.parentElement;
        a && this.initializeLightboxForUpload(a);
      }
    }), b.findByDataAttribute("lightbox-image").forEach((i) => {
      this.initializeLightboxForImage(i);
    }), b.findByDataAttribute("gallery").forEach((i) => {
      i.getAttribute("data-lightbox") === "true" && this.initializeLightboxForGallery(i);
    });
  }
  initializeLightboxForUpload(t) {
    const e = t.getAttribute("data-file-upload-id") || t.id || "upload-" + Date.now();
    this.setState(t, {
      currentImageIndex: 0,
      images: [],
      isOpen: !1,
      elementId: e
    });
  }
  initializeLightboxForImage(t) {
    const e = t.id || "image-" + Date.now(), n = t.closest("[data-lightbox-container]") || t, i = t.querySelector("img") || t;
    if (i && i.tagName === "IMG") {
      const s = this.extractImageData(i, e);
      this.setState(n, {
        currentImageIndex: 0,
        images: [s],
        isOpen: !1,
        elementId: e
      });
    }
  }
  initializeLightboxForGallery(t) {
    const e = t.getAttribute("data-gallery-id") || t.id || "gallery-" + Date.now(), n = [];
    t.querySelectorAll("[data-gallery-image]").forEach((s, a) => {
      const o = s.querySelector("img") || s;
      o && o.tagName === "IMG" && n.push(this.extractImageData(o, `${e}-${a}`, a));
    }), this.setState(t, {
      currentImageIndex: 0,
      images: n,
      isOpen: !1,
      elementId: e
    });
  }
  getFilenameFromSrc(t) {
    try {
      return new URL(t).pathname.split("/").pop() || "image";
    } catch {
      return t.split("/").pop() || "image";
    }
  }
  extractImageData(t, e, n) {
    return {
      id: e,
      src: t.src,
      alt: t.alt || (n !== void 0 ? `Gallery image ${n + 1}` : "Image"),
      fileName: t.getAttribute("data-filename") || this.getFilenameFromSrc(t.src),
      fileSize: t.getAttribute("data-filesize") || "Unknown size",
      fileType: t.getAttribute("data-filetype") || "image"
    };
  }
  handleThumbnailClick(t, e) {
    e.preventDefault(), e.stopPropagation();
    const n = this.findLightboxContainer(t);
    if (!n)
      return;
    const i = this.getState(n);
    if (!i)
      return;
    let s = 0;
    const a = t.getAttribute("data-lightbox-trigger");
    a && (s = i.images.findIndex((l) => l.id === a));
    const o = t.getAttribute("data-gallery-image");
    o !== null && (s = parseInt(o, 10)), t.hasAttribute("data-lightbox-image") && (s = 0), !(s === -1 || s >= i.images.length) && this.openLightbox(n, s);
  }
  handleCloseClick(t, e) {
    e.preventDefault(), this.closeLightbox();
  }
  handlePrevClick(t, e) {
    e.preventDefault(), this.navigateToPrevious();
  }
  handleNextClick(t, e) {
    e.preventDefault(), this.navigateToNext();
  }
  handleKeydown(t) {
    if (!(!this.currentModal || !this.currentModal.open))
      switch (t.key) {
        case "Escape":
          t.preventDefault(), this.closeLightbox();
          break;
        case "ArrowLeft":
          t.preventDefault(), this.navigateToPrevious();
          break;
        case "ArrowRight":
          t.preventDefault(), this.navigateToNext();
          break;
      }
  }
  handleModalBackgroundClick(t, e) {
    e.target === t && this.closeLightbox();
  }
  openLightbox(t, e) {
    const n = this.getState(t);
    if (!n || !n.images.length)
      return;
    n.currentImageIndex = e, n.isOpen = !0, this.setState(t, n);
    const i = this.getOrCreateLightboxModal(t);
    this.currentModal = i, this.updateModalContent(i, n), i.showModal(), D.dispatchCustomEvent(t, "lightbox:open", {
      imageIndex: e,
      image: n.images[e]
    });
  }
  closeLightbox() {
    if (!this.currentModal)
      return;
    const t = this.findContainerElementFromModal(this.currentModal);
    if (t) {
      const e = this.getState(t);
      e && (e.isOpen = !1, this.setState(t, e)), D.dispatchCustomEvent(t, "lightbox:close", {});
    }
    this.currentModal.close(), this.currentModal = null;
  }
  navigateToPrevious() {
    if (!this.currentModal) return;
    const t = this.findContainerElementFromModal(this.currentModal);
    if (!t) return;
    const e = this.getState(t);
    if (!e || !e.images.length) return;
    const n = e.currentImageIndex > 0 ? e.currentImageIndex - 1 : e.images.length - 1;
    e.currentImageIndex = n, this.setState(t, e), this.updateModalContent(this.currentModal, e), D.dispatchCustomEvent(t, "lightbox:navigate", {
      direction: "previous",
      imageIndex: n,
      image: e.images[n]
    });
  }
  navigateToNext() {
    if (!this.currentModal) return;
    const t = this.findContainerElementFromModal(this.currentModal);
    if (!t) return;
    const e = this.getState(t);
    if (!e || !e.images.length) return;
    const n = e.currentImageIndex < e.images.length - 1 ? e.currentImageIndex + 1 : 0;
    e.currentImageIndex = n, this.setState(t, e), this.updateModalContent(this.currentModal, e), D.dispatchCustomEvent(t, "lightbox:navigate", {
      direction: "next",
      imageIndex: n,
      image: e.images[n]
    });
  }
  getOrCreateLightboxModal(t) {
    const n = this.getElementId(t) + "-lightbox-modal";
    let i = document.getElementById(n);
    return i || (i = this.createLightboxModal(n), document.body.appendChild(i)), i;
  }
  getElementId(t) {
    const e = t.getAttribute("data-file-upload-id");
    if (e)
      return e;
    const n = t.getAttribute("data-gallery-id");
    return n || t.id || "lightbox-" + Date.now();
  }
  createLightboxModal(t) {
    const e = b.createElement("dialog", {
      attributes: {
        id: t,
        "data-lightbox-modal": "true",
        "data-modal": "true",
        class: "lightbox-modal p-0 m-0 w-full h-full max-w-none max-h-none bg-black/90 backdrop:bg-black/50"
      }
    });
    return e.innerHTML = `
            <div class="lightbox-content relative w-full h-full flex items-center justify-center p-8">
                <!-- Close button -->
                <button
                    type="button"
                    class="lightbox-close absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 flex items-center justify-center"
                    data-lightbox-close="true"
                    aria-label="Close lightbox"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <!-- Previous button -->
                <button
                    type="button"
                    class="lightbox-nav lightbox-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 flex items-center justify-center"
                    data-lightbox-prev="true"
                    aria-label="Previous image"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>

                <!-- Next button -->
                <button
                    type="button"
                    class="lightbox-nav lightbox-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 flex items-center justify-center"
                    data-lightbox-next="true"
                    aria-label="Next image"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>

                <!-- Image container -->
                <div class="lightbox-image-container flex-1 flex items-center justify-center">
                    <img
                        class="lightbox-image max-w-full max-h-full object-contain"
                        src=""
                        alt=""
                        data-lightbox-image="true"
                    />
                </div>

                <!-- Image info -->
                <div class="lightbox-info absolute bottom-4 left-4 right-4 z-20 bg-black/70 text-white p-4 rounded-lg">
                    <h3 class="lightbox-title text-lg font-semibold mb-1" data-lightbox-title="true"></h3>
                    <div class="lightbox-meta text-sm text-white/80 flex items-center gap-4">
                        <span data-lightbox-size="true"></span>
                        <span data-lightbox-counter="true"></span>
                    </div>
                </div>
            </div>
        `, e;
  }
  updateModalContent(t, e) {
    const n = e.images[e.currentImageIndex];
    if (!n) return;
    const i = t.querySelector("[data-lightbox-image]");
    i && (i.src = n.src, i.alt = n.alt);
    const s = t.querySelector("[data-lightbox-title]");
    s && (s.textContent = n.fileName);
    const a = t.querySelector("[data-lightbox-size]");
    a && (a.textContent = n.fileSize);
    const o = t.querySelector("[data-lightbox-counter]");
    o && (o.textContent = `${e.currentImageIndex + 1} of ${e.images.length}`);
    const l = t.querySelector("[data-lightbox-prev]"), c = t.querySelector("[data-lightbox-next]");
    if (l && c) {
      const u = e.images.length > 1;
      l.style.display = u ? "flex" : "none", c.style.display = u ? "flex" : "none";
    }
  }
  findLightboxContainer(t) {
    const e = b.findClosest(t, "[data-file-upload-id]");
    if (e)
      return e;
    const n = b.findClosest(t, "[data-gallery]");
    if (n)
      return n;
    const i = b.findClosest(t, "[data-lightbox-container]");
    return i || (t.hasAttribute("data-lightbox-image") ? t : null);
  }
  findContainerElementFromModal(t) {
    const n = t.id.replace("-lightbox-modal", "");
    let i = document.querySelector(`[data-file-upload-id="${n}"]`);
    return i || (i = document.querySelector(`[data-gallery-id="${n}"]`), i) || (i = document.getElementById(n), i) ? i : null;
  }
  // Public method to add an image to the lightbox
  addImage(t, e) {
    const n = this.getState(t);
    n && (n.images.push(e), this.setState(t, n));
  }
  // Public method to add multiple images (for galleries)
  addImages(t, e) {
    const n = this.getState(t);
    n && (n.images.push(...e), this.setState(t, n));
  }
  // Public method to set images (replace all)
  setImages(t, e) {
    const n = this.getState(t);
    n && (n.images = e, this.setState(t, n));
  }
  // Public method to remove an image from the lightbox
  removeImage(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = n.images.findIndex((s) => s.id === e);
    i !== -1 && (n.images.splice(i, 1), n.currentImageIndex >= n.images.length && (n.currentImageIndex = Math.max(0, n.images.length - 1)), this.setState(t, n), n.images.length === 0 && n.isOpen && this.closeLightbox());
  }
  destroy() {
    this.cleanupFunctions.forEach((t) => t()), this.cleanupFunctions = [], this.currentModal && (this.currentModal.close(), this.currentModal = null), super.destroy();
  }
}
class Df extends ht {
  constructor() {
    super(), this.lightboxActions = new Ub(), this.init();
  }
  /**
   * Initialize gallery elements - required by BaseActionClass
   */
  initializeElements() {
    this.lightboxActions.init(), b.findByDataAttribute("gallery", "true").forEach((t) => {
      this.initializeGallery(t);
    });
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedKeydown('[data-gallery="true"]', (t, e) => {
      const n = t.dataset.galleryId;
      n && this.handleKeyboardNavigation(e, n, t);
    });
  }
  /**
   * Extract image data from gallery DOM elements
   */
  extractImageData(t) {
    const e = [];
    return t.querySelectorAll("[data-gallery-slide]").forEach((i, s) => {
      const a = i.querySelector("img");
      a && e.push({
        id: i.getAttribute("data-gallery-slide") || `img-${s}`,
        src: a.src,
        alt: a.alt || `Image ${s + 1}`,
        caption: a.getAttribute("data-caption"),
        thumbnail: a.src,
        // Default to same as src
        title: a.getAttribute("data-title"),
        description: a.getAttribute("data-description")
      });
    }), e;
  }
  /**
   * Initialize a single gallery element
   */
  initializeGallery(t) {
    const e = t.dataset.galleryId;
    if (!e) return;
    const n = parseInt(t.dataset.totalImages || "0"), i = this.extractImageData(t);
    this.setState(t, {
      currentIndex: 0,
      isAutoplayActive: t.dataset.autoplay === "true",
      autoplayInterval: null,
      touchStartX: 0,
      touchEndX: 0,
      isDragging: !1,
      totalImages: n,
      images: i
    }), this.setupGalleryEventListeners(t, e), t.dataset.autoplay === "true" && this.startAutoplay(e, t), this.updateAccessibility(t, e), this.initializeImageErrorHandling(t), this.preloadAdjacentImages(t, 0);
  }
  /**
   * Set up event listeners for gallery interactions
   */
  setupGalleryEventListeners(t, e) {
    const n = t.querySelector('[data-gallery-action="prev"]'), i = t.querySelector('[data-gallery-action="next"]');
    n && D.addEventListener(n, "click", () => {
      this.navigateToImage(e, t, "prev");
    }), i && D.addEventListener(i, "click", () => {
      this.navigateToImage(e, t, "next");
    }), t.querySelectorAll("[data-gallery-thumbnail]").forEach((o, l) => {
      D.addEventListener(o, "click", () => {
        this.goToImage(e, t, l);
      }), D.addEventListener(o, "keydown", (c) => {
        const u = c;
        (u.key === "Enter" || u.key === " ") && (u.preventDefault(), this.goToImage(e, t, l));
      });
    });
    const a = t.querySelector('[data-gallery-action="toggle-autoplay"]');
    a && D.addEventListener(a, "click", () => {
      this.toggleAutoplay(e, t);
    }), this.setupTouchEvents(t, e), D.addEventListener(t, "mouseenter", () => {
      this.pauseAutoplayOnHover(e);
    }), D.addEventListener(t, "mouseleave", () => {
      this.resumeAutoplayOnHover(e, t);
    });
  }
  /**
   * Set up touch/swipe event listeners
   */
  setupTouchEvents(t, e) {
    const n = t.querySelector(".gallery-main");
    n && (D.addEventListener(n, "touchstart", (i) => {
      const s = i, a = this.getState(t);
      a && (a.touchStartX = s.touches[0].clientX, a.isDragging = !0, this.setState(t, a));
    }), D.addEventListener(n, "touchmove", (i) => {
      const s = i, a = this.getState(t);
      a != null && a.isDragging && (a.touchEndX = s.touches[0].clientX, this.setState(t, a));
    }), D.addEventListener(n, "touchend", () => {
      const i = this.getState(t);
      if (!(i != null && i.isDragging)) return;
      i.isDragging = !1;
      const s = i.touchStartX - i.touchEndX;
      Math.abs(s) > 50 && (s > 0 ? this.navigateToImage(e, t, "next") : this.navigateToImage(e, t, "prev")), this.setState(t, i);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(t, e, n) {
    switch (t.key) {
      case "ArrowLeft":
        t.preventDefault(), this.navigateToImage(e, n, "prev");
        break;
      case "ArrowRight":
        t.preventDefault(), this.navigateToImage(e, n, "next");
        break;
      case "Home":
        t.preventDefault(), this.goToImage(e, n, 0);
        break;
      case "End":
        t.preventDefault();
        const i = this.getState(n);
        i && this.goToImage(e, n, i.totalImages - 1);
        break;
      case "Escape":
        t.preventDefault(), this.handleEscapeKey(e, n);
        break;
      case " ":
      case "Spacebar":
        t.preventDefault(), this.toggleAutoplay(e, n);
        break;
      case "Enter":
        const s = t.target;
        if (s.hasAttribute("data-gallery-thumbnail")) {
          t.preventDefault();
          const a = parseInt(s.getAttribute("data-gallery-thumbnail") || "0");
          this.goToImage(e, n, a);
        }
        break;
    }
  }
  /**
   * Handle escape key with proper lightbox and autoplay logic
   */
  handleEscapeKey(t, e) {
    const n = e.dataset.lightbox === "true", i = this.getState(e);
    n ? this.closeLightbox(e) : i != null && i.isAutoplayActive && this.pauseAutoplay(t, e), this.announceAction(e, "Gallery navigation closed");
  }
  /**
   * Close lightbox using the unified LightboxActions
   */
  closeLightbox(t) {
    const e = this.lightboxActions.getState(t);
    e && e.isOpen && (this.emitGalleryEvent(t, "gallery:lightboxClose", {}), this.announceAction(t, "Lightbox closed"));
  }
  /**
   * Announce actions to screen readers
   */
  announceAction(t, e) {
    const n = t.querySelector("[data-gallery-live]");
    n && (n.textContent = e, setTimeout(() => {
      n.textContent === e && (n.textContent = "");
    }, 1e3));
  }
  /**
   * Navigate to previous or next image
   */
  navigateToImage(t, e, n) {
    const i = this.getState(e);
    if (!i) return;
    const s = parseInt(e.dataset.totalImages || "0"), a = e.dataset.loop === "true";
    let o = i.currentIndex;
    n === "next" ? (o = i.currentIndex + 1, o >= s && (o = a ? 0 : s - 1)) : (o = i.currentIndex - 1, o < 0 && (o = a ? s - 1 : 0)), this.goToImage(t, e, o);
  }
  /**
   * Go to a specific image by index
   */
  goToImage(t, e, n) {
    const i = this.getState(e);
    if (!i) return;
    const s = parseInt(e.dataset.totalImages || "0");
    n < 0 || n >= s || (i.currentIndex = n, this.setState(e, i), this.updateImageDisplay(e, n), this.updateThumbnails(e, n), this.updateCounter(e, n), this.updateImageDetails(e, n), this.updateNavigationButtons(e, n, s), this.updateAccessibility(e, t), this.announceImageChange(e, n, s), this.preloadAdjacentImages(e, n), this.emitGalleryEvent(e, "gallery:imageChanged", {
      currentIndex: n,
      galleryId: t
    }));
  }
  /**
   * Update image display
   */
  updateImageDisplay(t, e) {
    t.querySelectorAll(".gallery-slide").forEach((i, s) => {
      const a = i;
      s === e ? (a.classList.remove("opacity-0"), a.classList.add("opacity-100", "active")) : (a.classList.remove("opacity-100", "active"), a.classList.add("opacity-0"));
    });
  }
  /**
   * Update thumbnail highlighting
   */
  updateThumbnails(t, e) {
    t.querySelectorAll(".gallery-thumbnail").forEach((i, s) => {
      const a = i;
      s === e ? (a.classList.add("active", "border-brand-500"), a.classList.remove("border-transparent"), a.setAttribute("aria-current", "true")) : (a.classList.remove("active", "border-brand-500"), a.classList.add("border-transparent"), a.removeAttribute("aria-current"));
    });
  }
  /**
   * Update image counter
   */
  updateCounter(t, e) {
    const n = t.querySelector("[data-gallery-current]");
    n && (n.textContent = (e + 1).toString());
  }
  /**
   * Update image details for ecommerce type
   */
  updateImageDetails(t, e) {
    t.querySelector("[data-gallery-title]"), t.querySelector("[data-gallery-description]");
  }
  /**
   * Update navigation button states
   */
  updateNavigationButtons(t, e, n) {
    const i = t.querySelector('[data-gallery-action="prev"]'), s = t.querySelector('[data-gallery-action="next"]'), a = t.dataset.loop === "true";
    i && (i.disabled = !a && e === 0), s && (s.disabled = !a && e === n - 1);
  }
  /**
   * Start autoplay
   */
  startAutoplay(t, e) {
    const n = this.getState(e);
    if (!n) return;
    const i = parseInt(e.dataset.autoplayDelay || "3000");
    n.autoplayInterval = window.setInterval(() => {
      this.navigateToImage(t, e, "next");
    }, i), n.isAutoplayActive = !0, this.setState(e, n), this.updateAutoplayButton(e, !0);
  }
  /**
   * Pause autoplay
   */
  pauseAutoplay(t, e) {
    const n = this.getState(e);
    n && (n.autoplayInterval && (clearInterval(n.autoplayInterval), n.autoplayInterval = null), n.isAutoplayActive = !1, this.setState(e, n), this.updateAutoplayButton(e, !1));
  }
  /**
   * Toggle autoplay
   */
  toggleAutoplay(t, e) {
    const n = this.getState(e);
    n && (n.isAutoplayActive ? this.pauseAutoplay(t, e) : this.startAutoplay(t, e));
  }
  /**
   * Update autoplay button state using Button component's multi-state functionality
   */
  updateAutoplayButton(t, e) {
    const n = t.querySelector(".gallery-autoplay-toggle");
    if (n) {
      n.setAttribute("aria-pressed", e.toString()), n.setAttribute("aria-label", e ? "Pause autoplay" : "Resume autoplay");
      const i = n.querySelector(".button-icon-default"), s = n.querySelector(".button-icon-toggle");
      i && s && (e ? (i.classList.remove("opacity-0"), i.classList.add("opacity-100"), s.classList.remove("opacity-100"), s.classList.add("opacity-0")) : (i.classList.remove("opacity-100"), i.classList.add("opacity-0"), s.classList.remove("opacity-0"), s.classList.add("opacity-100")));
    }
  }
  /**
   * Pause autoplay on hover
   */
  pauseAutoplayOnHover(t) {
    const e = document.querySelector(`[data-gallery-id="${t}"]`);
    if (!e) return;
    const n = this.getState(e);
    !(n != null && n.isAutoplayActive) || !n.autoplayInterval || (clearInterval(n.autoplayInterval), n.autoplayInterval = null, this.setState(e, n));
  }
  /**
   * Resume autoplay when hover ends
   */
  resumeAutoplayOnHover(t, e) {
    const n = this.getState(e);
    if (!(n != null && n.isAutoplayActive) || n.autoplayInterval) return;
    const i = parseInt(e.dataset.autoplayDelay || "3000");
    n.autoplayInterval = window.setInterval(() => {
      this.navigateToImage(t, e, "next");
    }, i), this.setState(e, n);
  }
  /**
   * Update accessibility attributes
   */
  updateAccessibility(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = parseInt(t.dataset.totalImages || "0"), s = t.querySelector(`[data-gallery-slide="${n.currentIndex}"]`);
    s && (s.setAttribute("aria-current", "true"), s.setAttribute("aria-label", `Image ${n.currentIndex + 1} of ${i}`)), t.querySelectorAll("[data-gallery-slide]").forEach((o, l) => {
      l !== n.currentIndex && o.removeAttribute("aria-current");
    });
  }
  /**
   * Emit custom gallery events
   */
  emitGalleryEvent(t, e, n) {
    const i = new CustomEvent(e, { detail: n, bubbles: !0 });
    t.dispatchEvent(i);
  }
  /**
   * Announce image change to screen readers
   */
  announceImageChange(t, e, n) {
    const i = t.querySelector("[data-gallery-live]");
    if (i) {
      const a = t.querySelectorAll("[data-gallery-slide]")[e], o = a == null ? void 0 : a.querySelector("img"), c = `Showing ${(o == null ? void 0 : o.getAttribute("alt")) || `Image ${e + 1}`}, image ${e + 1} of ${n}`;
      i.textContent = c, setTimeout(() => {
        i.textContent === c && (i.textContent = "");
      }, 1e3);
    }
  }
  /**
   * Initialize error handling for gallery images
   */
  initializeImageErrorHandling(t) {
    t.querySelectorAll(".gallery-slide img").forEach((i) => {
      const s = i;
      s.complete || this.setImageLoadingState(s, !0), s.addEventListener("load", () => {
        this.setImageLoadingState(s, !1), this.setImageErrorState(s, !1);
      }), s.addEventListener("error", () => {
        this.setImageLoadingState(s, !1), this.setImageErrorState(s, !0), this.handleImageError(s, t), console.warn(`Failed to load gallery image: ${s.src}`);
      });
    }), t.querySelectorAll(".gallery-thumbnail img").forEach((i) => {
      const s = i;
      s.addEventListener("error", () => {
        this.setThumbnailErrorState(s, !0), console.warn(`Failed to load gallery thumbnail: ${s.src}`);
      });
    });
  }
  /**
   * Set loading state for an image
   */
  setImageLoadingState(t, e) {
    const n = t.closest(".gallery-slide");
    n && (e ? (n.classList.add("gallery-image-loading"), n.setAttribute("aria-busy", "true")) : (n.classList.remove("gallery-image-loading"), n.removeAttribute("aria-busy")));
  }
  /**
   * Set error state for an image
   */
  setImageErrorState(t, e) {
    const n = t.closest(".gallery-slide");
    if (n)
      if (e)
        n.classList.add("gallery-image-error"), n.setAttribute("aria-label", "Image failed to load"), n.querySelector(".gallery-error-placeholder") || this.createImageErrorPlaceholder(n);
      else {
        n.classList.remove("gallery-image-error"), n.removeAttribute("aria-label");
        const i = n.querySelector(".gallery-error-placeholder");
        i && i.remove();
      }
  }
  /**
   * Set error state for thumbnail images
   */
  setThumbnailErrorState(t, e) {
    const n = t.closest(".gallery-thumbnail");
    n && e && (n.classList.add("gallery-thumbnail-error"), t.style.display = "none", n.querySelector(".gallery-thumbnail-error-placeholder") || this.createThumbnailErrorPlaceholder(n));
  }
  /**
   * Create error placeholder for main images
   */
  createImageErrorPlaceholder(t) {
    const e = document.createElement("div");
    e.className = "gallery-error-placeholder absolute inset-0 flex items-center justify-center bg-surface border border-border rounded-lg", e.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 text-muted opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
                <p class="text-sm text-muted">Image failed to load</p>
            </div>
        `, t.appendChild(e);
  }
  /**
   * Create error placeholder for thumbnail images
   */
  createThumbnailErrorPlaceholder(t) {
    const e = document.createElement("div");
    e.className = "gallery-thumbnail-error-placeholder absolute inset-0 flex items-center justify-center bg-surface border border-border rounded text-muted", e.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        `, t.appendChild(e);
  }
  /**
   * Preload adjacent images for smoother transitions
   */
  preloadAdjacentImages(t, e) {
    const n = parseInt(t.dataset.totalImages || "0"), i = t.dataset.loop === "true", s = [], a = e - 1;
    a >= 0 ? s.push(a) : i && n > 1 && s.push(n - 1);
    const o = e + 1;
    o < n ? s.push(o) : i && n > 1 && s.push(0), s.forEach((l) => {
      const c = t.querySelector(`[data-gallery-slide="${l}"]`);
      if (c) {
        const u = c.querySelector("img");
        if (u && u.src && !u.complete) {
          const h = new Image();
          h.src = u.src, h.onerror = () => {
            console.warn(`Failed to preload image: ${h.src}`);
          };
        }
      }
    });
  }
  /**
   * Handle image load errors with retry logic
   */
  handleImageError(t, e) {
    const n = parseInt(t.dataset.retryCount || "0");
    n < 2 ? (t.dataset.retryCount = (n + 1).toString(), setTimeout(() => {
      const s = t.src;
      t.src = "", t.src = s + "?retry=" + n;
    }, 1e3 * (n + 1))) : (this.checkGalleryHealth(e), this.announceAction(e, "Image failed to load"));
  }
  /**
   * Check if gallery has too many failed images
   */
  checkGalleryHealth(t) {
    const e = t.querySelectorAll(".gallery-slide img").length;
    t.querySelectorAll(".gallery-image-error").length > e / 2 && this.setGalleryErrorState(t, !0);
  }
  /**
   * Set error state for entire gallery
   */
  setGalleryErrorState(t, e) {
    e ? (t.classList.add("gallery-has-errors"), this.announceAction(t, "Gallery has loading issues. Some images may not be available.")) : t.classList.remove("gallery-has-errors");
  }
  /**
   * Clean up when gallery is removed
   */
  cleanup(t) {
    const e = document.querySelector(`[data-gallery-id="${t}"]`);
    if (!e) return;
    const n = this.getState(e);
    n != null && n.autoplayInterval && clearInterval(n.autoplayInterval), this.removeState(e);
  }
}
class Yc {
  constructor() {
    console.log("PopoverActions: Using native HTML Popover API");
  }
}
new Yc();
function Of() {
  const r = document.querySelectorAll('[data-keys-file-upload="true"]:not([data-initialized="true"])'), t = typeof window.Livewire < "u";
  r.forEach((e) => {
    const n = e, i = n.querySelector(".file-input");
    i && (Vb(n, i), Gb(n, i), Wb(n, i), Kb(n, i), Yb(n, i, t), n.dataset.initialized = "true");
  });
}
function Vb(r, t, e) {
  t.addEventListener("change", () => {
    t.files && t.files.length > 0 ? If(r, t, t.files[0]) : Nf(r);
  });
}
function Gb(r, t) {
  if (r.dataset.dragDrop !== "true" || r.dataset.disabled === "true")
    return;
  ["dragenter", "dragover", "dragleave", "drop"].forEach((n) => r.addEventListener(n, Jb)), ["dragenter", "dragover"].forEach((n) => {
    r.addEventListener(n, () => r.classList.add("dragover"));
  }), ["dragleave", "drop"].forEach((n) => {
    r.addEventListener(n, () => r.classList.remove("dragover"));
  }), r.addEventListener("drop", (n) => {
    var s;
    const i = (s = n.dataTransfer) == null ? void 0 : s.files;
    i && i.length > 0 && If(r, t, i[0]);
  });
}
function Wb(r, t) {
  const e = r.querySelector('[type="button"]:not(.file-change-btn)');
  e && e.addEventListener("click", (i) => {
    i.preventDefault(), i.stopPropagation(), t.disabled || t.click();
  });
  const n = r.querySelector(".file-change-btn");
  n && n.addEventListener("click", (i) => {
    i.preventDefault(), i.stopPropagation(), t.disabled || t.click();
  }), r.addEventListener("click", (i) => {
    var l;
    const s = i.target;
    !((l = r.querySelector(".upload-empty-state")) != null && l.classList.contains("hidden")) && (s === r || s.closest(".upload-empty-state") || s.closest(".file-input")) && !s.closest("button") && !t.disabled && t.click();
  });
}
function Kb(r, t) {
  const e = r.querySelector(".file-remove");
  e && e.addEventListener("click", (n) => {
    n.preventDefault(), n.stopPropagation(), t.value = "", Nf(r), Qc(r), _f(r, "File removed"), r.dataset.livewire === "true" && t.dispatchEvent(new Event("change", { bubbles: !0 }));
  });
}
function Yb(r, t, e) {
  !e || r.dataset.livewire !== "true" || (t.addEventListener("livewire-upload-start", () => {
    Mr(r, !0), jl(r, 0);
  }), t.addEventListener("livewire-upload-progress", (n) => {
    var s;
    const i = n;
    (s = i.detail) != null && s.progress && jl(r, i.detail.progress);
  }), t.addEventListener("livewire-upload-finish", () => {
    Mr(r, !1), t.files && t.files.length > 0 && Mf(r, t.files[0]);
  }), t.addEventListener("livewire-upload-error", (n) => {
    var s;
    qf(r, ((s = n.detail) == null ? void 0 : s.message) || "Upload failed. Please try again."), Mr(r, !1);
  }), t.addEventListener("livewire-upload-cancel", () => {
    Mr(r, !1), Qc(r);
  }));
}
function If(r, t, e, n) {
  const i = Qb(r, e);
  if (!i.valid) {
    qf(r, i.error || "Invalid file");
    return;
  }
  Qc(r), r.dataset.livewire === "true" ? (Mr(r, !0), jl(r, 0)) : Mf(r, e);
}
function Qb(r, t) {
  const e = r.dataset.accept, n = r.dataset.maxSize, i = r.dataset.maxSizeFormatted;
  if (e && e !== "*") {
    const s = e.split(",").map((o) => o.trim());
    if (!s.some((o) => o.startsWith(".") ? t.name.toLowerCase().endsWith(o.toLowerCase()) : o.includes("*") ? t.type.startsWith(o.split("/")[0] + "/") : t.type === o))
      return { valid: !1, error: `File type not allowed. Accepted: ${s.join(", ")}` };
  }
  return n && t.size > parseInt(n) ? { valid: !1, error: `File too large. Maximum size: ${i || "10MB"}` } : { valid: !0 };
}
function Nf(r) {
  const t = r.querySelector(".upload-empty-state"), e = r.querySelector(".upload-file-state");
  Se(t, !0), Se(e, !1), Mr(r, !1), r.classList.remove("dragover");
}
function Mf(r, t) {
  const e = r.querySelector(".upload-empty-state"), n = r.querySelector(".upload-file-state");
  Se(e, !1), Se(n, !0), Zb(r, t), _f(r, `File selected: ${t.name}`);
}
function Zb(r, t) {
  const e = r.querySelector(".file-name"), n = r.querySelector(".file-size"), i = r.querySelector(".file-preview-image"), s = r.querySelector(".file-icon");
  if (e && (e.textContent = t.name), n && (n.textContent = Xb(t.size)), t.type.startsWith("image/")) {
    const a = new FileReader();
    a.onload = (o) => {
      var l;
      i && ((l = o.target) != null && l.result) && (i.src = o.target.result, Se(i, !0), Se(s, !1));
    }, a.readAsDataURL(t);
  } else
    Se(i, !1), Se(s, !0);
}
function Mr(r, t) {
  const e = r.querySelector(".upload-progress");
  Se(e, t);
}
function qf(r, t) {
  const e = r.querySelector(".error-message");
  e && (e.textContent = t, Se(e, !0)), r.setAttribute("data-invalid", "true");
}
function Qc(r) {
  const t = r.querySelector(".error-message");
  t && Se(t, !1), r.removeAttribute("data-invalid");
}
function Xb(r) {
  if (r === 0) return "0 Bytes";
  const t = 1024, e = ["Bytes", "KB", "MB", "GB"], n = Math.floor(Math.log(r) / Math.log(t));
  return parseFloat((r / Math.pow(t, n)).toFixed(2)) + " " + e[n];
}
function Se(r, t) {
  r && r.classList.toggle("hidden", !t);
}
function jl(r, t) {
  const e = r.querySelector(".upload-progress-bar");
  e && (e.style.width = `${t}%`);
}
function Jb(r) {
  r.preventDefault(), r.stopPropagation();
}
function _f(r, t) {
  const e = document.createElement("div");
  e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), e.className = "sr-only", e.textContent = t, r.appendChild(e), setTimeout(() => {
    r.contains(e) && r.removeChild(e);
  }, 1e3);
}
document.addEventListener("DOMContentLoaded", Of);
typeof window.Livewire < "u" && document.addEventListener("livewire:navigated", Of);
var Rf = typeof global == "object" && global && global.Object === Object && global, ty = typeof self == "object" && self && self.Object === Object && self, rn = Rf || ty || Function("return this")(), In = rn.Symbol, zf = Object.prototype, ey = zf.hasOwnProperty, ny = zf.toString, Mi = In ? In.toStringTag : void 0;
function ry(r) {
  var t = ey.call(r, Mi), e = r[Mi];
  try {
    r[Mi] = void 0;
    var n = !0;
  } catch {
  }
  var i = ny.call(r);
  return n && (t ? r[Mi] = e : delete r[Mi]), i;
}
var iy = Object.prototype, sy = iy.toString;
function ay(r) {
  return sy.call(r);
}
var oy = "[object Null]", ly = "[object Undefined]", nd = In ? In.toStringTag : void 0;
function hi(r) {
  return r == null ? r === void 0 ? ly : oy : nd && nd in Object(r) ? ry(r) : ay(r);
}
function fn(r) {
  return r != null && typeof r == "object";
}
var er = Array.isArray;
function Rn(r) {
  var t = typeof r;
  return r != null && (t == "object" || t == "function");
}
function Pf(r) {
  return r;
}
var cy = "[object AsyncFunction]", uy = "[object Function]", dy = "[object GeneratorFunction]", hy = "[object Proxy]";
function Zc(r) {
  if (!Rn(r))
    return !1;
  var t = hi(r);
  return t == uy || t == dy || t == cy || t == hy;
}
var el = rn["__core-js_shared__"], rd = function() {
  var r = /[^.]+$/.exec(el && el.keys && el.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function fy(r) {
  return !!rd && rd in r;
}
var py = Function.prototype, gy = py.toString;
function ar(r) {
  if (r != null) {
    try {
      return gy.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var my = /[\\^$.*+?()[\]{}|]/g, by = /^\[object .+?Constructor\]$/, yy = Function.prototype, vy = Object.prototype, wy = yy.toString, xy = vy.hasOwnProperty, Sy = RegExp(
  "^" + wy.call(xy).replace(my, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function ky(r) {
  if (!Rn(r) || fy(r))
    return !1;
  var t = Zc(r) ? Sy : by;
  return t.test(ar(r));
}
function Ay(r, t) {
  return r == null ? void 0 : r[t];
}
function or(r, t) {
  var e = Ay(r, t);
  return ky(e) ? e : void 0;
}
var Fl = or(rn, "WeakMap"), id = Object.create, Ey = /* @__PURE__ */ function() {
  function r() {
  }
  return function(t) {
    if (!Rn(t))
      return {};
    if (id)
      return id(t);
    r.prototype = t;
    var e = new r();
    return r.prototype = void 0, e;
  };
}();
function Cy(r, t, e) {
  switch (e.length) {
    case 0:
      return r.call(t);
    case 1:
      return r.call(t, e[0]);
    case 2:
      return r.call(t, e[0], e[1]);
    case 3:
      return r.call(t, e[0], e[1], e[2]);
  }
  return r.apply(t, e);
}
function Ty(r, t) {
  var e = -1, n = r.length;
  for (t || (t = Array(n)); ++e < n; )
    t[e] = r[e];
  return t;
}
var Ly = 800, Dy = 16, Oy = Date.now;
function Iy(r) {
  var t = 0, e = 0;
  return function() {
    var n = Oy(), i = Dy - (n - e);
    if (e = n, i > 0) {
      if (++t >= Ly)
        return arguments[0];
    } else
      t = 0;
    return r.apply(void 0, arguments);
  };
}
function Ny(r) {
  return function() {
    return r;
  };
}
var xa = function() {
  try {
    var r = or(Object, "defineProperty");
    return r({}, "", {}), r;
  } catch {
  }
}(), My = xa ? function(r, t) {
  return xa(r, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Ny(t),
    writable: !0
  });
} : Pf, qy = Iy(My);
function _y(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length; ++e < n && t(r[e], e, r) !== !1; )
    ;
  return r;
}
var Ry = 9007199254740991, zy = /^(?:0|[1-9]\d*)$/;
function Bf(r, t) {
  var e = typeof r;
  return t = t ?? Ry, !!t && (e == "number" || e != "symbol" && zy.test(r)) && r > -1 && r % 1 == 0 && r < t;
}
function Xc(r, t, e) {
  t == "__proto__" && xa ? xa(r, t, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : r[t] = e;
}
function gs(r, t) {
  return r === t || r !== r && t !== t;
}
var Py = Object.prototype, By = Py.hasOwnProperty;
function $f(r, t, e) {
  var n = r[t];
  (!(By.call(r, t) && gs(n, e)) || e === void 0 && !(t in r)) && Xc(r, t, e);
}
function $y(r, t, e, n) {
  var i = !e;
  e || (e = {});
  for (var s = -1, a = t.length; ++s < a; ) {
    var o = t[s], l = void 0;
    l === void 0 && (l = r[o]), i ? Xc(e, o, l) : $f(e, o, l);
  }
  return e;
}
var sd = Math.max;
function jy(r, t, e) {
  return t = sd(t === void 0 ? r.length - 1 : t, 0), function() {
    for (var n = arguments, i = -1, s = sd(n.length - t, 0), a = Array(s); ++i < s; )
      a[i] = n[t + i];
    i = -1;
    for (var o = Array(t + 1); ++i < t; )
      o[i] = n[i];
    return o[t] = e(a), Cy(r, this, o);
  };
}
function Fy(r, t) {
  return qy(jy(r, t, Pf), r + "");
}
var Hy = 9007199254740991;
function jf(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= Hy;
}
function Ha(r) {
  return r != null && jf(r.length) && !Zc(r);
}
function Uy(r, t, e) {
  if (!Rn(e))
    return !1;
  var n = typeof t;
  return (n == "number" ? Ha(e) && Bf(t, e.length) : n == "string" && t in e) ? gs(e[t], r) : !1;
}
function Vy(r) {
  return Fy(function(t, e) {
    var n = -1, i = e.length, s = i > 1 ? e[i - 1] : void 0, a = i > 2 ? e[2] : void 0;
    for (s = r.length > 3 && typeof s == "function" ? (i--, s) : void 0, a && Uy(e[0], e[1], a) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++n < i; ) {
      var o = e[n];
      o && r(t, o, n, s);
    }
    return t;
  });
}
var Gy = Object.prototype;
function Jc(r) {
  var t = r && r.constructor, e = typeof t == "function" && t.prototype || Gy;
  return r === e;
}
function Wy(r, t) {
  for (var e = -1, n = Array(r); ++e < r; )
    n[e] = t(e);
  return n;
}
var Ky = "[object Arguments]";
function ad(r) {
  return fn(r) && hi(r) == Ky;
}
var Ff = Object.prototype, Yy = Ff.hasOwnProperty, Qy = Ff.propertyIsEnumerable, Hl = ad(/* @__PURE__ */ function() {
  return arguments;
}()) ? ad : function(r) {
  return fn(r) && Yy.call(r, "callee") && !Qy.call(r, "callee");
};
function Zy() {
  return !1;
}
var Hf = typeof exports == "object" && exports && !exports.nodeType && exports, od = Hf && typeof module == "object" && module && !module.nodeType && module, Xy = od && od.exports === Hf, ld = Xy ? rn.Buffer : void 0, Jy = ld ? ld.isBuffer : void 0, ts = Jy || Zy, tv = "[object Arguments]", ev = "[object Array]", nv = "[object Boolean]", rv = "[object Date]", iv = "[object Error]", sv = "[object Function]", av = "[object Map]", ov = "[object Number]", lv = "[object Object]", cv = "[object RegExp]", uv = "[object Set]", dv = "[object String]", hv = "[object WeakMap]", fv = "[object ArrayBuffer]", pv = "[object DataView]", gv = "[object Float32Array]", mv = "[object Float64Array]", bv = "[object Int8Array]", yv = "[object Int16Array]", vv = "[object Int32Array]", wv = "[object Uint8Array]", xv = "[object Uint8ClampedArray]", Sv = "[object Uint16Array]", kv = "[object Uint32Array]", ct = {};
ct[gv] = ct[mv] = ct[bv] = ct[yv] = ct[vv] = ct[wv] = ct[xv] = ct[Sv] = ct[kv] = !0;
ct[tv] = ct[ev] = ct[fv] = ct[nv] = ct[pv] = ct[rv] = ct[iv] = ct[sv] = ct[av] = ct[ov] = ct[lv] = ct[cv] = ct[uv] = ct[dv] = ct[hv] = !1;
function Av(r) {
  return fn(r) && jf(r.length) && !!ct[hi(r)];
}
function tu(r) {
  return function(t) {
    return r(t);
  };
}
var Uf = typeof exports == "object" && exports && !exports.nodeType && exports, Ui = Uf && typeof module == "object" && module && !module.nodeType && module, Ev = Ui && Ui.exports === Uf, nl = Ev && Rf.process, ti = function() {
  try {
    var r = Ui && Ui.require && Ui.require("util").types;
    return r || nl && nl.binding && nl.binding("util");
  } catch {
  }
}(), cd = ti && ti.isTypedArray, eu = cd ? tu(cd) : Av, Cv = Object.prototype, Tv = Cv.hasOwnProperty;
function Vf(r, t) {
  var e = er(r), n = !e && Hl(r), i = !e && !n && ts(r), s = !e && !n && !i && eu(r), a = e || n || i || s, o = a ? Wy(r.length, String) : [], l = o.length;
  for (var c in r)
    (t || Tv.call(r, c)) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    Bf(c, l))) && o.push(c);
  return o;
}
function Gf(r, t) {
  return function(e) {
    return r(t(e));
  };
}
var Lv = Gf(Object.keys, Object), Dv = Object.prototype, Ov = Dv.hasOwnProperty;
function Iv(r) {
  if (!Jc(r))
    return Lv(r);
  var t = [];
  for (var e in Object(r))
    Ov.call(r, e) && e != "constructor" && t.push(e);
  return t;
}
function Nv(r) {
  return Ha(r) ? Vf(r) : Iv(r);
}
function Mv(r) {
  var t = [];
  if (r != null)
    for (var e in Object(r))
      t.push(e);
  return t;
}
var qv = Object.prototype, _v = qv.hasOwnProperty;
function Rv(r) {
  if (!Rn(r))
    return Mv(r);
  var t = Jc(r), e = [];
  for (var n in r)
    n == "constructor" && (t || !_v.call(r, n)) || e.push(n);
  return e;
}
function Wf(r) {
  return Ha(r) ? Vf(r, !0) : Rv(r);
}
var es = or(Object, "create");
function zv() {
  this.__data__ = es ? es(null) : {}, this.size = 0;
}
function Pv(r) {
  var t = this.has(r) && delete this.__data__[r];
  return this.size -= t ? 1 : 0, t;
}
var Bv = "__lodash_hash_undefined__", $v = Object.prototype, jv = $v.hasOwnProperty;
function Fv(r) {
  var t = this.__data__;
  if (es) {
    var e = t[r];
    return e === Bv ? void 0 : e;
  }
  return jv.call(t, r) ? t[r] : void 0;
}
var Hv = Object.prototype, Uv = Hv.hasOwnProperty;
function Vv(r) {
  var t = this.__data__;
  return es ? t[r] !== void 0 : Uv.call(t, r);
}
var Gv = "__lodash_hash_undefined__";
function Wv(r, t) {
  var e = this.__data__;
  return this.size += this.has(r) ? 0 : 1, e[r] = es && t === void 0 ? Gv : t, this;
}
function nr(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
nr.prototype.clear = zv;
nr.prototype.delete = Pv;
nr.prototype.get = Fv;
nr.prototype.has = Vv;
nr.prototype.set = Wv;
function Kv() {
  this.__data__ = [], this.size = 0;
}
function Ua(r, t) {
  for (var e = r.length; e--; )
    if (gs(r[e][0], t))
      return e;
  return -1;
}
var Yv = Array.prototype, Qv = Yv.splice;
function Zv(r) {
  var t = this.__data__, e = Ua(t, r);
  if (e < 0)
    return !1;
  var n = t.length - 1;
  return e == n ? t.pop() : Qv.call(t, e, 1), --this.size, !0;
}
function Xv(r) {
  var t = this.__data__, e = Ua(t, r);
  return e < 0 ? void 0 : t[e][1];
}
function Jv(r) {
  return Ua(this.__data__, r) > -1;
}
function t1(r, t) {
  var e = this.__data__, n = Ua(e, r);
  return n < 0 ? (++this.size, e.push([r, t])) : e[n][1] = t, this;
}
function bn(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
bn.prototype.clear = Kv;
bn.prototype.delete = Zv;
bn.prototype.get = Xv;
bn.prototype.has = Jv;
bn.prototype.set = t1;
var ns = or(rn, "Map");
function e1() {
  this.size = 0, this.__data__ = {
    hash: new nr(),
    map: new (ns || bn)(),
    string: new nr()
  };
}
function n1(r) {
  var t = typeof r;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? r !== "__proto__" : r === null;
}
function Va(r, t) {
  var e = r.__data__;
  return n1(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
}
function r1(r) {
  var t = Va(this, r).delete(r);
  return this.size -= t ? 1 : 0, t;
}
function i1(r) {
  return Va(this, r).get(r);
}
function s1(r) {
  return Va(this, r).has(r);
}
function a1(r, t) {
  var e = Va(this, r), n = e.size;
  return e.set(r, t), this.size += e.size == n ? 0 : 1, this;
}
function lr(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
lr.prototype.clear = e1;
lr.prototype.delete = r1;
lr.prototype.get = i1;
lr.prototype.has = s1;
lr.prototype.set = a1;
function o1(r, t) {
  for (var e = -1, n = t.length, i = r.length; ++e < n; )
    r[i + e] = t[e];
  return r;
}
var Kf = Gf(Object.getPrototypeOf, Object), l1 = "[object Object]", c1 = Function.prototype, u1 = Object.prototype, Yf = c1.toString, d1 = u1.hasOwnProperty, h1 = Yf.call(Object);
function f1(r) {
  if (!fn(r) || hi(r) != l1)
    return !1;
  var t = Kf(r);
  if (t === null)
    return !0;
  var e = d1.call(t, "constructor") && t.constructor;
  return typeof e == "function" && e instanceof e && Yf.call(e) == h1;
}
function p1() {
  this.__data__ = new bn(), this.size = 0;
}
function g1(r) {
  var t = this.__data__, e = t.delete(r);
  return this.size = t.size, e;
}
function m1(r) {
  return this.__data__.get(r);
}
function b1(r) {
  return this.__data__.has(r);
}
var y1 = 200;
function v1(r, t) {
  var e = this.__data__;
  if (e instanceof bn) {
    var n = e.__data__;
    if (!ns || n.length < y1 - 1)
      return n.push([r, t]), this.size = ++e.size, this;
    e = this.__data__ = new lr(n);
  }
  return e.set(r, t), this.size = e.size, this;
}
function We(r) {
  var t = this.__data__ = new bn(r);
  this.size = t.size;
}
We.prototype.clear = p1;
We.prototype.delete = g1;
We.prototype.get = m1;
We.prototype.has = b1;
We.prototype.set = v1;
var Qf = typeof exports == "object" && exports && !exports.nodeType && exports, ud = Qf && typeof module == "object" && module && !module.nodeType && module, w1 = ud && ud.exports === Qf, dd = w1 ? rn.Buffer : void 0, hd = dd ? dd.allocUnsafe : void 0;
function Zf(r, t) {
  if (t)
    return r.slice();
  var e = r.length, n = hd ? hd(e) : new r.constructor(e);
  return r.copy(n), n;
}
function x1(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length, i = 0, s = []; ++e < n; ) {
    var a = r[e];
    t(a, e, r) && (s[i++] = a);
  }
  return s;
}
function S1() {
  return [];
}
var k1 = Object.prototype, A1 = k1.propertyIsEnumerable, fd = Object.getOwnPropertySymbols, E1 = fd ? function(r) {
  return r == null ? [] : (r = Object(r), x1(fd(r), function(t) {
    return A1.call(r, t);
  }));
} : S1;
function C1(r, t, e) {
  var n = t(r);
  return er(r) ? n : o1(n, e(r));
}
function Ul(r) {
  return C1(r, Nv, E1);
}
var Vl = or(rn, "DataView"), Gl = or(rn, "Promise"), Wl = or(rn, "Set"), pd = "[object Map]", T1 = "[object Object]", gd = "[object Promise]", md = "[object Set]", bd = "[object WeakMap]", yd = "[object DataView]", L1 = ar(Vl), D1 = ar(ns), O1 = ar(Gl), I1 = ar(Wl), N1 = ar(Fl), we = hi;
(Vl && we(new Vl(new ArrayBuffer(1))) != yd || ns && we(new ns()) != pd || Gl && we(Gl.resolve()) != gd || Wl && we(new Wl()) != md || Fl && we(new Fl()) != bd) && (we = function(r) {
  var t = hi(r), e = t == T1 ? r.constructor : void 0, n = e ? ar(e) : "";
  if (n)
    switch (n) {
      case L1:
        return yd;
      case D1:
        return pd;
      case O1:
        return gd;
      case I1:
        return md;
      case N1:
        return bd;
    }
  return t;
});
var M1 = Object.prototype, q1 = M1.hasOwnProperty;
function _1(r) {
  var t = r.length, e = new r.constructor(t);
  return t && typeof r[0] == "string" && q1.call(r, "index") && (e.index = r.index, e.input = r.input), e;
}
var Sa = rn.Uint8Array;
function nu(r) {
  var t = new r.constructor(r.byteLength);
  return new Sa(t).set(new Sa(r)), t;
}
function R1(r, t) {
  var e = nu(r.buffer);
  return new r.constructor(e, r.byteOffset, r.byteLength);
}
var z1 = /\w*$/;
function P1(r) {
  var t = new r.constructor(r.source, z1.exec(r));
  return t.lastIndex = r.lastIndex, t;
}
var vd = In ? In.prototype : void 0, wd = vd ? vd.valueOf : void 0;
function B1(r) {
  return wd ? Object(wd.call(r)) : {};
}
function Xf(r, t) {
  var e = t ? nu(r.buffer) : r.buffer;
  return new r.constructor(e, r.byteOffset, r.length);
}
var $1 = "[object Boolean]", j1 = "[object Date]", F1 = "[object Map]", H1 = "[object Number]", U1 = "[object RegExp]", V1 = "[object Set]", G1 = "[object String]", W1 = "[object Symbol]", K1 = "[object ArrayBuffer]", Y1 = "[object DataView]", Q1 = "[object Float32Array]", Z1 = "[object Float64Array]", X1 = "[object Int8Array]", J1 = "[object Int16Array]", t0 = "[object Int32Array]", e0 = "[object Uint8Array]", n0 = "[object Uint8ClampedArray]", r0 = "[object Uint16Array]", i0 = "[object Uint32Array]";
function s0(r, t, e) {
  var n = r.constructor;
  switch (t) {
    case K1:
      return nu(r);
    case $1:
    case j1:
      return new n(+r);
    case Y1:
      return R1(r);
    case Q1:
    case Z1:
    case X1:
    case J1:
    case t0:
    case e0:
    case n0:
    case r0:
    case i0:
      return Xf(r, e);
    case F1:
      return new n();
    case H1:
    case G1:
      return new n(r);
    case U1:
      return P1(r);
    case V1:
      return new n();
    case W1:
      return B1(r);
  }
}
function Jf(r) {
  return typeof r.constructor == "function" && !Jc(r) ? Ey(Kf(r)) : {};
}
var a0 = "[object Map]";
function o0(r) {
  return fn(r) && we(r) == a0;
}
var xd = ti && ti.isMap, l0 = xd ? tu(xd) : o0, c0 = "[object Set]";
function u0(r) {
  return fn(r) && we(r) == c0;
}
var Sd = ti && ti.isSet, d0 = Sd ? tu(Sd) : u0, h0 = 1, tp = "[object Arguments]", f0 = "[object Array]", p0 = "[object Boolean]", g0 = "[object Date]", m0 = "[object Error]", ep = "[object Function]", b0 = "[object GeneratorFunction]", y0 = "[object Map]", v0 = "[object Number]", np = "[object Object]", w0 = "[object RegExp]", x0 = "[object Set]", S0 = "[object String]", k0 = "[object Symbol]", A0 = "[object WeakMap]", E0 = "[object ArrayBuffer]", C0 = "[object DataView]", T0 = "[object Float32Array]", L0 = "[object Float64Array]", D0 = "[object Int8Array]", O0 = "[object Int16Array]", I0 = "[object Int32Array]", N0 = "[object Uint8Array]", M0 = "[object Uint8ClampedArray]", q0 = "[object Uint16Array]", _0 = "[object Uint32Array]", at = {};
at[tp] = at[f0] = at[E0] = at[C0] = at[p0] = at[g0] = at[T0] = at[L0] = at[D0] = at[O0] = at[I0] = at[y0] = at[v0] = at[np] = at[w0] = at[x0] = at[S0] = at[k0] = at[N0] = at[M0] = at[q0] = at[_0] = !0;
at[m0] = at[ep] = at[A0] = !1;
function ua(r, t, e, n, i, s) {
  var a, o = t & h0;
  if (a !== void 0)
    return a;
  if (!Rn(r))
    return r;
  var l = er(r);
  if (l)
    a = _1(r);
  else {
    var c = we(r), u = c == ep || c == b0;
    if (ts(r))
      return Zf(r, o);
    if (c == np || c == tp || u && !i)
      a = u ? {} : Jf(r);
    else {
      if (!at[c])
        return i ? r : {};
      a = s0(r, c, o);
    }
  }
  s || (s = new We());
  var h = s.get(r);
  if (h)
    return h;
  s.set(r, a), d0(r) ? r.forEach(function(m) {
    a.add(ua(m, t, e, m, r, s));
  }) : l0(r) && r.forEach(function(m, y) {
    a.set(y, ua(m, t, e, y, r, s));
  });
  var f = Ul, p = l ? void 0 : f(r);
  return _y(p || r, function(m, y) {
    p && (y = m, m = r[y]), $f(a, y, ua(m, t, e, y, r, s));
  }), a;
}
var R0 = 1, z0 = 4;
function zr(r) {
  return ua(r, R0 | z0);
}
var P0 = "__lodash_hash_undefined__";
function B0(r) {
  return this.__data__.set(r, P0), this;
}
function $0(r) {
  return this.__data__.has(r);
}
function ka(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.__data__ = new lr(); ++t < e; )
    this.add(r[t]);
}
ka.prototype.add = ka.prototype.push = B0;
ka.prototype.has = $0;
function j0(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length; ++e < n; )
    if (t(r[e], e, r))
      return !0;
  return !1;
}
function F0(r, t) {
  return r.has(t);
}
var H0 = 1, U0 = 2;
function rp(r, t, e, n, i, s) {
  var a = e & H0, o = r.length, l = t.length;
  if (o != l && !(a && l > o))
    return !1;
  var c = s.get(r), u = s.get(t);
  if (c && u)
    return c == t && u == r;
  var h = -1, f = !0, p = e & U0 ? new ka() : void 0;
  for (s.set(r, t), s.set(t, r); ++h < o; ) {
    var m = r[h], y = t[h];
    if (n)
      var w = a ? n(y, m, h, t, r, s) : n(m, y, h, r, t, s);
    if (w !== void 0) {
      if (w)
        continue;
      f = !1;
      break;
    }
    if (p) {
      if (!j0(t, function(v, S) {
        if (!F0(p, S) && (m === v || i(m, v, e, n, s)))
          return p.push(S);
      })) {
        f = !1;
        break;
      }
    } else if (!(m === y || i(m, y, e, n, s))) {
      f = !1;
      break;
    }
  }
  return s.delete(r), s.delete(t), f;
}
function V0(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(n, i) {
    e[++t] = [i, n];
  }), e;
}
function G0(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(n) {
    e[++t] = n;
  }), e;
}
var W0 = 1, K0 = 2, Y0 = "[object Boolean]", Q0 = "[object Date]", Z0 = "[object Error]", X0 = "[object Map]", J0 = "[object Number]", tw = "[object RegExp]", ew = "[object Set]", nw = "[object String]", rw = "[object Symbol]", iw = "[object ArrayBuffer]", sw = "[object DataView]", kd = In ? In.prototype : void 0, rl = kd ? kd.valueOf : void 0;
function aw(r, t, e, n, i, s, a) {
  switch (e) {
    case sw:
      if (r.byteLength != t.byteLength || r.byteOffset != t.byteOffset)
        return !1;
      r = r.buffer, t = t.buffer;
    case iw:
      return !(r.byteLength != t.byteLength || !s(new Sa(r), new Sa(t)));
    case Y0:
    case Q0:
    case J0:
      return gs(+r, +t);
    case Z0:
      return r.name == t.name && r.message == t.message;
    case tw:
    case nw:
      return r == t + "";
    case X0:
      var o = V0;
    case ew:
      var l = n & W0;
      if (o || (o = G0), r.size != t.size && !l)
        return !1;
      var c = a.get(r);
      if (c)
        return c == t;
      n |= K0, a.set(r, t);
      var u = rp(o(r), o(t), n, i, s, a);
      return a.delete(r), u;
    case rw:
      if (rl)
        return rl.call(r) == rl.call(t);
  }
  return !1;
}
var ow = 1, lw = Object.prototype, cw = lw.hasOwnProperty;
function uw(r, t, e, n, i, s) {
  var a = e & ow, o = Ul(r), l = o.length, c = Ul(t), u = c.length;
  if (l != u && !a)
    return !1;
  for (var h = l; h--; ) {
    var f = o[h];
    if (!(a ? f in t : cw.call(t, f)))
      return !1;
  }
  var p = s.get(r), m = s.get(t);
  if (p && m)
    return p == t && m == r;
  var y = !0;
  s.set(r, t), s.set(t, r);
  for (var w = a; ++h < l; ) {
    f = o[h];
    var v = r[f], S = t[f];
    if (n)
      var A = a ? n(S, v, f, t, r, s) : n(v, S, f, r, t, s);
    if (!(A === void 0 ? v === S || i(v, S, e, n, s) : A)) {
      y = !1;
      break;
    }
    w || (w = f == "constructor");
  }
  if (y && !w) {
    var E = r.constructor, T = t.constructor;
    E != T && "constructor" in r && "constructor" in t && !(typeof E == "function" && E instanceof E && typeof T == "function" && T instanceof T) && (y = !1);
  }
  return s.delete(r), s.delete(t), y;
}
var dw = 1, Ad = "[object Arguments]", Ed = "[object Array]", Ks = "[object Object]", hw = Object.prototype, Cd = hw.hasOwnProperty;
function fw(r, t, e, n, i, s) {
  var a = er(r), o = er(t), l = a ? Ed : we(r), c = o ? Ed : we(t);
  l = l == Ad ? Ks : l, c = c == Ad ? Ks : c;
  var u = l == Ks, h = c == Ks, f = l == c;
  if (f && ts(r)) {
    if (!ts(t))
      return !1;
    a = !0, u = !1;
  }
  if (f && !u)
    return s || (s = new We()), a || eu(r) ? rp(r, t, e, n, i, s) : aw(r, t, l, e, n, i, s);
  if (!(e & dw)) {
    var p = u && Cd.call(r, "__wrapped__"), m = h && Cd.call(t, "__wrapped__");
    if (p || m) {
      var y = p ? r.value() : r, w = m ? t.value() : t;
      return s || (s = new We()), i(y, w, e, n, s);
    }
  }
  return f ? (s || (s = new We()), uw(r, t, e, n, i, s)) : !1;
}
function ip(r, t, e, n, i) {
  return r === t ? !0 : r == null || t == null || !fn(r) && !fn(t) ? r !== r && t !== t : fw(r, t, e, n, ip, i);
}
function pw(r) {
  return function(t, e, n) {
    for (var i = -1, s = Object(t), a = n(t), o = a.length; o--; ) {
      var l = a[++i];
      if (e(s[l], l, s) === !1)
        break;
    }
    return t;
  };
}
var gw = pw();
function Kl(r, t, e) {
  (e !== void 0 && !gs(r[t], e) || e === void 0 && !(t in r)) && Xc(r, t, e);
}
function mw(r) {
  return fn(r) && Ha(r);
}
function Yl(r, t) {
  if (!(t === "constructor" && typeof r[t] == "function") && t != "__proto__")
    return r[t];
}
function bw(r) {
  return $y(r, Wf(r));
}
function yw(r, t, e, n, i, s, a) {
  var o = Yl(r, e), l = Yl(t, e), c = a.get(l);
  if (c) {
    Kl(r, e, c);
    return;
  }
  var u = s ? s(o, l, e + "", r, t, a) : void 0, h = u === void 0;
  if (h) {
    var f = er(l), p = !f && ts(l), m = !f && !p && eu(l);
    u = l, f || p || m ? er(o) ? u = o : mw(o) ? u = Ty(o) : p ? (h = !1, u = Zf(l, !0)) : m ? (h = !1, u = Xf(l, !0)) : u = [] : f1(l) || Hl(l) ? (u = o, Hl(o) ? u = bw(o) : (!Rn(o) || Zc(o)) && (u = Jf(l))) : h = !1;
  }
  h && (a.set(l, u), i(u, l, n, s, a), a.delete(l)), Kl(r, e, u);
}
function sp(r, t, e, n, i) {
  r !== t && gw(t, function(s, a) {
    if (i || (i = new We()), Rn(s))
      yw(r, t, a, e, sp, n, i);
    else {
      var o = n ? n(Yl(r, a), s, a + "", r, t, i) : void 0;
      o === void 0 && (o = s), Kl(r, a, o);
    }
  }, Wf);
}
function ru(r, t) {
  return ip(r, t);
}
var Dn = Vy(function(r, t, e) {
  sp(r, t, e);
}), B = /* @__PURE__ */ ((r) => (r[r.TYPE = 3] = "TYPE", r[r.LEVEL = 12] = "LEVEL", r[r.ATTRIBUTE = 13] = "ATTRIBUTE", r[r.BLOT = 14] = "BLOT", r[r.INLINE = 7] = "INLINE", r[r.BLOCK = 11] = "BLOCK", r[r.BLOCK_BLOT = 10] = "BLOCK_BLOT", r[r.INLINE_BLOT = 6] = "INLINE_BLOT", r[r.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", r[r.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", r[r.ANY = 15] = "ANY", r))(B || {});
class Ze {
  constructor(t, e, n = {}) {
    this.attrName = t, this.keyName = e;
    const i = B.TYPE & B.ATTRIBUTE;
    this.scope = n.scope != null ? (
      // Ignore type bits, force attribute bit
      n.scope & B.LEVEL | i
    ) : B.ATTRIBUTE, n.whitelist != null && (this.whitelist = n.whitelist);
  }
  static keys(t) {
    return Array.from(t.attributes).map((e) => e.name);
  }
  add(t, e) {
    return this.canAdd(t, e) ? (t.setAttribute(this.keyName, e), !0) : !1;
  }
  canAdd(t, e) {
    return this.whitelist == null ? !0 : typeof e == "string" ? this.whitelist.indexOf(e.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(e) > -1;
  }
  remove(t) {
    t.removeAttribute(this.keyName);
  }
  value(t) {
    const e = t.getAttribute(this.keyName);
    return this.canAdd(t, e) && e ? e : "";
  }
}
class Pr extends Error {
  constructor(t) {
    t = "[Parchment] " + t, super(t), this.message = t, this.name = this.constructor.name;
  }
}
const ap = class Ql {
  constructor() {
    this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
  }
  static find(t, e = !1) {
    if (t == null)
      return null;
    if (this.blots.has(t))
      return this.blots.get(t) || null;
    if (e) {
      let n = null;
      try {
        n = t.parentNode;
      } catch {
        return null;
      }
      return this.find(n, e);
    }
    return null;
  }
  create(t, e, n) {
    const i = this.query(e);
    if (i == null)
      throw new Pr(`Unable to create ${e} blot`);
    const s = i, a = (
      // @ts-expect-error Fix me later
      e instanceof Node || e.nodeType === Node.TEXT_NODE ? e : s.create(n)
    ), o = new s(t, a, n);
    return Ql.blots.set(o.domNode, o), o;
  }
  find(t, e = !1) {
    return Ql.find(t, e);
  }
  query(t, e = B.ANY) {
    let n;
    return typeof t == "string" ? n = this.types[t] || this.attributes[t] : t instanceof Text || t.nodeType === Node.TEXT_NODE ? n = this.types.text : typeof t == "number" ? t & B.LEVEL & B.BLOCK ? n = this.types.block : t & B.LEVEL & B.INLINE && (n = this.types.inline) : t instanceof Element && ((t.getAttribute("class") || "").split(/\s+/).some((i) => (n = this.classes[i], !!n)), n = n || this.tags[t.tagName]), n == null ? null : "scope" in n && e & B.LEVEL & n.scope && e & B.TYPE & n.scope ? n : null;
  }
  register(...t) {
    return t.map((e) => {
      const n = "blotName" in e, i = "attrName" in e;
      if (!n && !i)
        throw new Pr("Invalid definition");
      if (n && e.blotName === "abstract")
        throw new Pr("Cannot register abstract class");
      const s = n ? e.blotName : i ? e.attrName : void 0;
      return this.types[s] = e, i ? typeof e.keyName == "string" && (this.attributes[e.keyName] = e) : n && (e.className && (this.classes[e.className] = e), e.tagName && (Array.isArray(e.tagName) ? e.tagName = e.tagName.map((a) => a.toUpperCase()) : e.tagName = e.tagName.toUpperCase(), (Array.isArray(e.tagName) ? e.tagName : [e.tagName]).forEach((a) => {
        (this.tags[a] == null || e.className == null) && (this.tags[a] = e);
      }))), e;
    });
  }
};
ap.blots = /* @__PURE__ */ new WeakMap();
let ei = ap;
function Td(r, t) {
  return (r.getAttribute("class") || "").split(/\s+/).filter((e) => e.indexOf(`${t}-`) === 0);
}
class vw extends Ze {
  static keys(t) {
    return (t.getAttribute("class") || "").split(/\s+/).map((e) => e.split("-").slice(0, -1).join("-"));
  }
  add(t, e) {
    return this.canAdd(t, e) ? (this.remove(t), t.classList.add(`${this.keyName}-${e}`), !0) : !1;
  }
  remove(t) {
    Td(t, this.keyName).forEach((e) => {
      t.classList.remove(e);
    }), t.classList.length === 0 && t.removeAttribute("class");
  }
  value(t) {
    const e = (Td(t, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(t, e) ? e : "";
  }
}
const Ne = vw;
function il(r) {
  const t = r.split("-"), e = t.slice(1).map((n) => n[0].toUpperCase() + n.slice(1)).join("");
  return t[0] + e;
}
class ww extends Ze {
  static keys(t) {
    return (t.getAttribute("style") || "").split(";").map((e) => e.split(":")[0].trim());
  }
  add(t, e) {
    return this.canAdd(t, e) ? (t.style[il(this.keyName)] = e, !0) : !1;
  }
  remove(t) {
    t.style[il(this.keyName)] = "", t.getAttribute("style") || t.removeAttribute("style");
  }
  value(t) {
    const e = t.style[il(this.keyName)];
    return this.canAdd(t, e) ? e : "";
  }
}
const zn = ww;
class xw {
  constructor(t) {
    this.attributes = {}, this.domNode = t, this.build();
  }
  attribute(t, e) {
    e ? t.add(this.domNode, e) && (t.value(this.domNode) != null ? this.attributes[t.attrName] = t : delete this.attributes[t.attrName]) : (t.remove(this.domNode), delete this.attributes[t.attrName]);
  }
  build() {
    this.attributes = {};
    const t = ei.find(this.domNode);
    if (t == null)
      return;
    const e = Ze.keys(this.domNode), n = Ne.keys(this.domNode), i = zn.keys(this.domNode);
    e.concat(n).concat(i).forEach((s) => {
      const a = t.scroll.query(s, B.ATTRIBUTE);
      a instanceof Ze && (this.attributes[a.attrName] = a);
    });
  }
  copy(t) {
    Object.keys(this.attributes).forEach((e) => {
      const n = this.attributes[e].value(this.domNode);
      t.format(e, n);
    });
  }
  move(t) {
    this.copy(t), Object.keys(this.attributes).forEach((e) => {
      this.attributes[e].remove(this.domNode);
    }), this.attributes = {};
  }
  values() {
    return Object.keys(this.attributes).reduce(
      (t, e) => (t[e] = this.attributes[e].value(this.domNode), t),
      {}
    );
  }
}
const Ga = xw, op = class {
  constructor(t, e) {
    this.scroll = t, this.domNode = e, ei.blots.set(e, this), this.prev = null, this.next = null;
  }
  static create(t) {
    if (this.tagName == null)
      throw new Pr("Blot definition missing tagName");
    let e, n;
    return Array.isArray(this.tagName) ? (typeof t == "string" ? (n = t.toUpperCase(), parseInt(n, 10).toString() === n && (n = parseInt(n, 10))) : typeof t == "number" && (n = t), typeof n == "number" ? e = document.createElement(this.tagName[n - 1]) : n && this.tagName.indexOf(n) > -1 ? e = document.createElement(n) : e = document.createElement(this.tagName[0])) : e = document.createElement(this.tagName), this.className && e.classList.add(this.className), e;
  }
  // Hack for accessing inherited static methods
  get statics() {
    return this.constructor;
  }
  attach() {
  }
  clone() {
    const t = this.domNode.cloneNode(!1);
    return this.scroll.create(t);
  }
  detach() {
    this.parent != null && this.parent.removeChild(this), ei.blots.delete(this.domNode);
  }
  deleteAt(t, e) {
    this.isolate(t, e).remove();
  }
  formatAt(t, e, n, i) {
    const s = this.isolate(t, e);
    if (this.scroll.query(n, B.BLOT) != null && i)
      s.wrap(n, i);
    else if (this.scroll.query(n, B.ATTRIBUTE) != null) {
      const a = this.scroll.create(this.statics.scope);
      s.wrap(a), a.format(n, i);
    }
  }
  insertAt(t, e, n) {
    const i = n == null ? this.scroll.create("text", e) : this.scroll.create(e, n), s = this.split(t);
    this.parent.insertBefore(i, s || void 0);
  }
  isolate(t, e) {
    const n = this.split(t);
    if (n == null)
      throw new Error("Attempt to isolate at end");
    return n.split(e), n;
  }
  length() {
    return 1;
  }
  offset(t = this.parent) {
    return this.parent == null || this === t ? 0 : this.parent.children.offset(this) + this.parent.offset(t);
  }
  optimize(t) {
    this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
  }
  remove() {
    this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
  }
  replaceWith(t, e) {
    const n = typeof t == "string" ? this.scroll.create(t, e) : t;
    return this.parent != null && (this.parent.insertBefore(n, this.next || void 0), this.remove()), n;
  }
  split(t, e) {
    return t === 0 ? this : this.next;
  }
  update(t, e) {
  }
  wrap(t, e) {
    const n = typeof t == "string" ? this.scroll.create(t, e) : t;
    if (this.parent != null && this.parent.insertBefore(n, this.next || void 0), typeof n.appendChild != "function")
      throw new Pr(`Cannot wrap ${t}`);
    return n.appendChild(this), n;
  }
};
op.blotName = "abstract";
let lp = op;
const cp = class extends lp {
  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  static value(t) {
    return !0;
  }
  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */
  index(t, e) {
    return this.domNode === t || this.domNode.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(e, 1) : -1;
  }
  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */
  position(t, e) {
    let n = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
    return t > 0 && (n += 1), [this.parent.domNode, n];
  }
  /**
   * Return value represented by this blot
   * Should not change without interaction from API or
   * user change detectable by update()
   */
  value() {
    return {
      [this.statics.blotName]: this.statics.value(this.domNode) || !0
    };
  }
};
cp.scope = B.INLINE_BLOT;
let Sw = cp;
const qt = Sw;
class kw {
  constructor() {
    this.head = null, this.tail = null, this.length = 0;
  }
  append(...t) {
    if (this.insertBefore(t[0], null), t.length > 1) {
      const e = t.slice(1);
      this.append(...e);
    }
  }
  at(t) {
    const e = this.iterator();
    let n = e();
    for (; n && t > 0; )
      t -= 1, n = e();
    return n;
  }
  contains(t) {
    const e = this.iterator();
    let n = e();
    for (; n; ) {
      if (n === t)
        return !0;
      n = e();
    }
    return !1;
  }
  indexOf(t) {
    const e = this.iterator();
    let n = e(), i = 0;
    for (; n; ) {
      if (n === t)
        return i;
      i += 1, n = e();
    }
    return -1;
  }
  insertBefore(t, e) {
    t != null && (this.remove(t), t.next = e, e != null ? (t.prev = e.prev, e.prev != null && (e.prev.next = t), e.prev = t, e === this.head && (this.head = t)) : this.tail != null ? (this.tail.next = t, t.prev = this.tail, this.tail = t) : (t.prev = null, this.head = this.tail = t), this.length += 1);
  }
  offset(t) {
    let e = 0, n = this.head;
    for (; n != null; ) {
      if (n === t)
        return e;
      e += n.length(), n = n.next;
    }
    return -1;
  }
  remove(t) {
    this.contains(t) && (t.prev != null && (t.prev.next = t.next), t.next != null && (t.next.prev = t.prev), t === this.head && (this.head = t.next), t === this.tail && (this.tail = t.prev), this.length -= 1);
  }
  iterator(t = this.head) {
    return () => {
      const e = t;
      return t != null && (t = t.next), e;
    };
  }
  find(t, e = !1) {
    const n = this.iterator();
    let i = n();
    for (; i; ) {
      const s = i.length();
      if (t < s || e && t === s && (i.next == null || i.next.length() !== 0))
        return [i, t];
      t -= s, i = n();
    }
    return [null, 0];
  }
  forEach(t) {
    const e = this.iterator();
    let n = e();
    for (; n; )
      t(n), n = e();
  }
  forEachAt(t, e, n) {
    if (e <= 0)
      return;
    const [i, s] = this.find(t);
    let a = t - s;
    const o = this.iterator(i);
    let l = o();
    for (; l && a < t + e; ) {
      const c = l.length();
      t > a ? n(
        l,
        t - a,
        Math.min(e, a + c - t)
      ) : n(l, 0, Math.min(c, t + e - a)), a += c, l = o();
    }
  }
  map(t) {
    return this.reduce((e, n) => (e.push(t(n)), e), []);
  }
  reduce(t, e) {
    const n = this.iterator();
    let i = n();
    for (; i; )
      e = t(e, i), i = n();
    return e;
  }
}
function Ld(r, t) {
  const e = t.find(r);
  if (e)
    return e;
  try {
    return t.create(r);
  } catch {
    const n = t.create(B.INLINE);
    return Array.from(r.childNodes).forEach((i) => {
      n.domNode.appendChild(i);
    }), r.parentNode && r.parentNode.replaceChild(n.domNode, r), n.attach(), n;
  }
}
const up = class An extends lp {
  constructor(t, e) {
    super(t, e), this.uiNode = null, this.build();
  }
  appendChild(t) {
    this.insertBefore(t);
  }
  attach() {
    super.attach(), this.children.forEach((t) => {
      t.attach();
    });
  }
  attachUI(t) {
    this.uiNode != null && this.uiNode.remove(), this.uiNode = t, An.uiClass && this.uiNode.classList.add(An.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new kw(), Array.from(this.domNode.childNodes).filter((t) => t !== this.uiNode).reverse().forEach((t) => {
      try {
        const e = Ld(t, this.scroll);
        this.insertBefore(e, this.children.head || void 0);
      } catch (e) {
        if (e instanceof Pr)
          return;
        throw e;
      }
    });
  }
  deleteAt(t, e) {
    if (t === 0 && e === this.length())
      return this.remove();
    this.children.forEachAt(t, e, (n, i, s) => {
      n.deleteAt(i, s);
    });
  }
  descendant(t, e = 0) {
    const [n, i] = this.children.find(e);
    return t.blotName == null && t(n) || t.blotName != null && n instanceof t ? [n, i] : n instanceof An ? n.descendant(t, i) : [null, -1];
  }
  descendants(t, e = 0, n = Number.MAX_VALUE) {
    let i = [], s = n;
    return this.children.forEachAt(
      e,
      n,
      (a, o, l) => {
        (t.blotName == null && t(a) || t.blotName != null && a instanceof t) && i.push(a), a instanceof An && (i = i.concat(
          a.descendants(t, o, s)
        )), s -= l;
      }
    ), i;
  }
  detach() {
    this.children.forEach((t) => {
      t.detach();
    }), super.detach();
  }
  enforceAllowedChildren() {
    let t = !1;
    this.children.forEach((e) => {
      t || this.statics.allowedChildren.some(
        (n) => e instanceof n
      ) || (e.statics.scope === B.BLOCK_BLOT ? (e.next != null && this.splitAfter(e), e.prev != null && this.splitAfter(e.prev), e.parent.unwrap(), t = !0) : e instanceof An ? e.unwrap() : e.remove());
    });
  }
  formatAt(t, e, n, i) {
    this.children.forEachAt(t, e, (s, a, o) => {
      s.formatAt(a, o, n, i);
    });
  }
  insertAt(t, e, n) {
    const [i, s] = this.children.find(t);
    if (i)
      i.insertAt(s, e, n);
    else {
      const a = n == null ? this.scroll.create("text", e) : this.scroll.create(e, n);
      this.appendChild(a);
    }
  }
  insertBefore(t, e) {
    t.parent != null && t.parent.children.remove(t);
    let n = null;
    this.children.insertBefore(t, e || null), t.parent = this, e != null && (n = e.domNode), (this.domNode.parentNode !== t.domNode || this.domNode.nextSibling !== n) && this.domNode.insertBefore(t.domNode, n), t.attach();
  }
  length() {
    return this.children.reduce((t, e) => t + e.length(), 0);
  }
  moveChildren(t, e) {
    this.children.forEach((n) => {
      t.insertBefore(n, e);
    });
  }
  optimize(t) {
    if (super.optimize(t), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0)
      if (this.statics.defaultChild != null) {
        const e = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(e);
      } else
        this.remove();
  }
  path(t, e = !1) {
    const [n, i] = this.children.find(t, e), s = [[this, t]];
    return n instanceof An ? s.concat(n.path(i, e)) : (n != null && s.push([n, i]), s);
  }
  removeChild(t) {
    this.children.remove(t);
  }
  replaceWith(t, e) {
    const n = typeof t == "string" ? this.scroll.create(t, e) : t;
    return n instanceof An && this.moveChildren(n), super.replaceWith(n);
  }
  split(t, e = !1) {
    if (!e) {
      if (t === 0)
        return this;
      if (t === this.length())
        return this.next;
    }
    const n = this.clone();
    return this.parent && this.parent.insertBefore(n, this.next || void 0), this.children.forEachAt(t, this.length(), (i, s, a) => {
      const o = i.split(s, e);
      o != null && n.appendChild(o);
    }), n;
  }
  splitAfter(t) {
    const e = this.clone();
    for (; t.next != null; )
      e.appendChild(t.next);
    return this.parent && this.parent.insertBefore(e, this.next || void 0), e;
  }
  unwrap() {
    this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
  }
  update(t, e) {
    const n = [], i = [];
    t.forEach((s) => {
      s.target === this.domNode && s.type === "childList" && (n.push(...s.addedNodes), i.push(...s.removedNodes));
    }), i.forEach((s) => {
      if (s.parentNode != null && // @ts-expect-error Fix me later
      s.tagName !== "IFRAME" && document.body.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_CONTAINED_BY)
        return;
      const a = this.scroll.find(s);
      a != null && (a.domNode.parentNode == null || a.domNode.parentNode === this.domNode) && a.detach();
    }), n.filter((s) => s.parentNode === this.domNode && s !== this.uiNode).sort((s, a) => s === a ? 0 : s.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1).forEach((s) => {
      let a = null;
      s.nextSibling != null && (a = this.scroll.find(s.nextSibling));
      const o = Ld(s, this.scroll);
      (o.next !== a || o.next == null) && (o.parent != null && o.parent.removeChild(this), this.insertBefore(o, a || void 0));
    }), this.enforceAllowedChildren();
  }
};
up.uiClass = "";
let Aw = up;
const Ae = Aw;
function Ew(r, t) {
  if (Object.keys(r).length !== Object.keys(t).length)
    return !1;
  for (const e in r)
    if (r[e] !== t[e])
      return !1;
  return !0;
}
const Tr = class Lr extends Ae {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const n = e.query(Lr.blotName);
    if (!(n != null && t.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new Ga(this.domNode);
  }
  format(t, e) {
    if (t === this.statics.blotName && !e)
      this.children.forEach((n) => {
        n instanceof Lr || (n = n.wrap(Lr.blotName, !0)), this.attributes.copy(n);
      }), this.unwrap();
    else {
      const n = this.scroll.query(t, B.INLINE);
      if (n == null)
        return;
      n instanceof Ze ? this.attributes.attribute(n, e) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e);
    }
  }
  formats() {
    const t = this.attributes.values(), e = this.statics.formats(this.domNode, this.scroll);
    return e != null && (t[this.statics.blotName] = e), t;
  }
  formatAt(t, e, n, i) {
    this.formats()[n] != null || this.scroll.query(n, B.ATTRIBUTE) ? this.isolate(t, e).format(n, i) : super.formatAt(t, e, n, i);
  }
  optimize(t) {
    super.optimize(t);
    const e = this.formats();
    if (Object.keys(e).length === 0)
      return this.unwrap();
    const n = this.next;
    n instanceof Lr && n.prev === this && Ew(e, n.formats()) && (n.moveChildren(this), n.remove());
  }
  replaceWith(t, e) {
    const n = super.replaceWith(t, e);
    return this.attributes.copy(n), n;
  }
  update(t, e) {
    super.update(t, e), t.some(
      (n) => n.target === this.domNode && n.type === "attributes"
    ) && this.attributes.build();
  }
  wrap(t, e) {
    const n = super.wrap(t, e);
    return n instanceof Lr && this.attributes.move(n), n;
  }
};
Tr.allowedChildren = [Tr, qt], Tr.blotName = "inline", Tr.scope = B.INLINE_BLOT, Tr.tagName = "SPAN";
let Cw = Tr;
const iu = Cw, Dr = class Zl extends Ae {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const n = e.query(Zl.blotName);
    if (!(n != null && t.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new Ga(this.domNode);
  }
  format(t, e) {
    const n = this.scroll.query(t, B.BLOCK);
    n != null && (n instanceof Ze ? this.attributes.attribute(n, e) : t === this.statics.blotName && !e ? this.replaceWith(Zl.blotName) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e));
  }
  formats() {
    const t = this.attributes.values(), e = this.statics.formats(this.domNode, this.scroll);
    return e != null && (t[this.statics.blotName] = e), t;
  }
  formatAt(t, e, n, i) {
    this.scroll.query(n, B.BLOCK) != null ? this.format(n, i) : super.formatAt(t, e, n, i);
  }
  insertAt(t, e, n) {
    if (n == null || this.scroll.query(e, B.INLINE) != null)
      super.insertAt(t, e, n);
    else {
      const i = this.split(t);
      if (i != null) {
        const s = this.scroll.create(e, n);
        i.parent.insertBefore(s, i);
      } else
        throw new Error("Attempt to insertAt after block boundaries");
    }
  }
  replaceWith(t, e) {
    const n = super.replaceWith(t, e);
    return this.attributes.copy(n), n;
  }
  update(t, e) {
    super.update(t, e), t.some(
      (n) => n.target === this.domNode && n.type === "attributes"
    ) && this.attributes.build();
  }
};
Dr.blotName = "block", Dr.scope = B.BLOCK_BLOT, Dr.tagName = "P", Dr.allowedChildren = [
  iu,
  Dr,
  qt
];
let Tw = Dr;
const rs = Tw, Xl = class extends Ae {
  checkMerge() {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  }
  deleteAt(t, e) {
    super.deleteAt(t, e), this.enforceAllowedChildren();
  }
  formatAt(t, e, n, i) {
    super.formatAt(t, e, n, i), this.enforceAllowedChildren();
  }
  insertAt(t, e, n) {
    super.insertAt(t, e, n), this.enforceAllowedChildren();
  }
  optimize(t) {
    super.optimize(t), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
  }
};
Xl.blotName = "container", Xl.scope = B.BLOCK_BLOT;
let Lw = Xl;
const Wa = Lw;
class Dw extends qt {
  static formats(t, e) {
  }
  format(t, e) {
    super.formatAt(0, this.length(), t, e);
  }
  formatAt(t, e, n, i) {
    t === 0 && e === this.length() ? this.format(n, i) : super.formatAt(t, e, n, i);
  }
  formats() {
    return this.statics.formats(this.domNode, this.scroll);
  }
}
const te = Dw, Ow = {
  attributes: !0,
  characterData: !0,
  characterDataOldValue: !0,
  childList: !0,
  subtree: !0
}, Iw = 100, Or = class extends Ae {
  constructor(t, e) {
    super(null, e), this.registry = t, this.scroll = this, this.build(), this.observer = new MutationObserver((n) => {
      this.update(n);
    }), this.observer.observe(this.domNode, Ow), this.attach();
  }
  create(t, e) {
    return this.registry.create(this, t, e);
  }
  find(t, e = !1) {
    const n = this.registry.find(t, e);
    return n ? n.scroll === this ? n : e ? this.find(n.scroll.domNode.parentNode, !0) : null : null;
  }
  query(t, e = B.ANY) {
    return this.registry.query(t, e);
  }
  register(...t) {
    return this.registry.register(...t);
  }
  build() {
    this.scroll != null && super.build();
  }
  detach() {
    super.detach(), this.observer.disconnect();
  }
  deleteAt(t, e) {
    this.update(), t === 0 && e === this.length() ? this.children.forEach((n) => {
      n.remove();
    }) : super.deleteAt(t, e);
  }
  formatAt(t, e, n, i) {
    this.update(), super.formatAt(t, e, n, i);
  }
  insertAt(t, e, n) {
    this.update(), super.insertAt(t, e, n);
  }
  optimize(t = [], e = {}) {
    super.optimize(e);
    const n = e.mutationsMap || /* @__PURE__ */ new WeakMap();
    let i = Array.from(this.observer.takeRecords());
    for (; i.length > 0; )
      t.push(i.pop());
    const s = (l, c = !0) => {
      l == null || l === this || l.domNode.parentNode != null && (n.has(l.domNode) || n.set(l.domNode, []), c && s(l.parent));
    }, a = (l) => {
      n.has(l.domNode) && (l instanceof Ae && l.children.forEach(a), n.delete(l.domNode), l.optimize(e));
    };
    let o = t;
    for (let l = 0; o.length > 0; l += 1) {
      if (l >= Iw)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (o.forEach((c) => {
        const u = this.find(c.target, !0);
        u != null && (u.domNode === c.target && (c.type === "childList" ? (s(this.find(c.previousSibling, !1)), Array.from(c.addedNodes).forEach((h) => {
          const f = this.find(h, !1);
          s(f, !1), f instanceof Ae && f.children.forEach((p) => {
            s(p, !1);
          });
        })) : c.type === "attributes" && s(u.prev)), s(u));
      }), this.children.forEach(a), o = Array.from(this.observer.takeRecords()), i = o.slice(); i.length > 0; )
        t.push(i.pop());
    }
  }
  update(t, e = {}) {
    t = t || this.observer.takeRecords();
    const n = /* @__PURE__ */ new WeakMap();
    t.map((i) => {
      const s = this.find(i.target, !0);
      return s == null ? null : n.has(s.domNode) ? (n.get(s.domNode).push(i), null) : (n.set(s.domNode, [i]), s);
    }).forEach((i) => {
      i != null && i !== this && n.has(i.domNode) && i.update(n.get(i.domNode) || [], e);
    }), e.mutationsMap = n, n.has(this.domNode) && super.update(n.get(this.domNode), e), this.optimize(t, e);
  }
};
Or.blotName = "scroll", Or.defaultChild = rs, Or.allowedChildren = [rs, Wa], Or.scope = B.BLOCK_BLOT, Or.tagName = "DIV";
let Nw = Or;
const su = Nw, Jl = class dp extends qt {
  static create(t) {
    return document.createTextNode(t);
  }
  static value(t) {
    return t.data;
  }
  constructor(t, e) {
    super(t, e), this.text = this.statics.value(this.domNode);
  }
  deleteAt(t, e) {
    this.domNode.data = this.text = this.text.slice(0, t) + this.text.slice(t + e);
  }
  index(t, e) {
    return this.domNode === t ? e : -1;
  }
  insertAt(t, e, n) {
    n == null ? (this.text = this.text.slice(0, t) + e + this.text.slice(t), this.domNode.data = this.text) : super.insertAt(t, e, n);
  }
  length() {
    return this.text.length;
  }
  optimize(t) {
    super.optimize(t), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof dp && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
  }
  position(t, e = !1) {
    return [this.domNode, t];
  }
  split(t, e = !1) {
    if (!e) {
      if (t === 0)
        return this;
      if (t === this.length())
        return this.next;
    }
    const n = this.scroll.create(this.domNode.splitText(t));
    return this.parent.insertBefore(n, this.next || void 0), this.text = this.statics.value(this.domNode), n;
  }
  update(t, e) {
    t.some((n) => n.type === "characterData" && n.target === this.domNode) && (this.text = this.statics.value(this.domNode));
  }
  value() {
    return this.text;
  }
};
Jl.blotName = "text", Jl.scope = B.INLINE_BLOT;
let Mw = Jl;
const Aa = Mw, qw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Attributor: Ze,
  AttributorStore: Ga,
  BlockBlot: rs,
  ClassAttributor: Ne,
  ContainerBlot: Wa,
  EmbedBlot: te,
  InlineBlot: iu,
  LeafBlot: qt,
  ParentBlot: Ae,
  Registry: ei,
  Scope: B,
  ScrollBlot: su,
  StyleAttributor: zn,
  TextBlot: Aa
}, Symbol.toStringTag, { value: "Module" }));
var Cn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function hp(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var tc = { exports: {} }, Zt = -1, Ft = 1, St = 0;
function is(r, t, e, n, i) {
  if (r === t)
    return r ? [[St, r]] : [];
  if (e != null) {
    var s = Hw(r, t, e);
    if (s)
      return s;
  }
  var a = au(r, t), o = r.substring(0, a);
  r = r.substring(a), t = t.substring(a), a = Ka(r, t);
  var l = r.substring(r.length - a);
  r = r.substring(0, r.length - a), t = t.substring(0, t.length - a);
  var c = _w(r, t);
  return o && c.unshift([St, o]), l && c.push([St, l]), ou(c, i), n && Pw(c), c;
}
function _w(r, t) {
  var e;
  if (!r)
    return [[Ft, t]];
  if (!t)
    return [[Zt, r]];
  var n = r.length > t.length ? r : t, i = r.length > t.length ? t : r, s = n.indexOf(i);
  if (s !== -1)
    return e = [
      [Ft, n.substring(0, s)],
      [St, i],
      [Ft, n.substring(s + i.length)]
    ], r.length > t.length && (e[0][0] = e[2][0] = Zt), e;
  if (i.length === 1)
    return [
      [Zt, r],
      [Ft, t]
    ];
  var a = zw(r, t);
  if (a) {
    var o = a[0], l = a[1], c = a[2], u = a[3], h = a[4], f = is(o, c), p = is(l, u);
    return f.concat([[St, h]], p);
  }
  return Rw(r, t);
}
function Rw(r, t) {
  for (var e = r.length, n = t.length, i = Math.ceil((e + n) / 2), s = i, a = 2 * i, o = new Array(a), l = new Array(a), c = 0; c < a; c++)
    o[c] = -1, l[c] = -1;
  o[s + 1] = 0, l[s + 1] = 0;
  for (var u = e - n, h = u % 2 !== 0, f = 0, p = 0, m = 0, y = 0, w = 0; w < i; w++) {
    for (var v = -w + f; v <= w - p; v += 2) {
      var S = s + v, A;
      v === -w || v !== w && o[S - 1] < o[S + 1] ? A = o[S + 1] : A = o[S - 1] + 1;
      for (var E = A - v; A < e && E < n && r.charAt(A) === t.charAt(E); )
        A++, E++;
      if (o[S] = A, A > e)
        p += 2;
      else if (E > n)
        f += 2;
      else if (h) {
        var T = s + u - v;
        if (T >= 0 && T < a && l[T] !== -1) {
          var M = e - l[T];
          if (A >= M)
            return Dd(r, t, A, E);
        }
      }
    }
    for (var N = -w + m; N <= w - y; N += 2) {
      var T = s + N, M;
      N === -w || N !== w && l[T - 1] < l[T + 1] ? M = l[T + 1] : M = l[T - 1] + 1;
      for (var k = M - N; M < e && k < n && r.charAt(e - M - 1) === t.charAt(n - k - 1); )
        M++, k++;
      if (l[T] = M, M > e)
        y += 2;
      else if (k > n)
        m += 2;
      else if (!h) {
        var S = s + u - N;
        if (S >= 0 && S < a && o[S] !== -1) {
          var A = o[S], E = s + A - S;
          if (M = e - M, A >= M)
            return Dd(r, t, A, E);
        }
      }
    }
  }
  return [
    [Zt, r],
    [Ft, t]
  ];
}
function Dd(r, t, e, n) {
  var i = r.substring(0, e), s = t.substring(0, n), a = r.substring(e), o = t.substring(n), l = is(i, s), c = is(a, o);
  return l.concat(c);
}
function au(r, t) {
  if (!r || !t || r.charAt(0) !== t.charAt(0))
    return 0;
  for (var e = 0, n = Math.min(r.length, t.length), i = n, s = 0; e < i; )
    r.substring(s, i) == t.substring(s, i) ? (e = i, s = e) : n = i, i = Math.floor((n - e) / 2 + e);
  return fp(r.charCodeAt(i - 1)) && i--, i;
}
function Od(r, t) {
  var e = r.length, n = t.length;
  if (e == 0 || n == 0)
    return 0;
  e > n ? r = r.substring(e - n) : e < n && (t = t.substring(0, e));
  var i = Math.min(e, n);
  if (r == t)
    return i;
  for (var s = 0, a = 1; ; ) {
    var o = r.substring(i - a), l = t.indexOf(o);
    if (l == -1)
      return s;
    a += l, (l == 0 || r.substring(i - a) == t.substring(0, a)) && (s = a, a++);
  }
}
function Ka(r, t) {
  if (!r || !t || r.slice(-1) !== t.slice(-1))
    return 0;
  for (var e = 0, n = Math.min(r.length, t.length), i = n, s = 0; e < i; )
    r.substring(r.length - i, r.length - s) == t.substring(t.length - i, t.length - s) ? (e = i, s = e) : n = i, i = Math.floor((n - e) / 2 + e);
  return pp(r.charCodeAt(r.length - i)) && i--, i;
}
function zw(r, t) {
  var e = r.length > t.length ? r : t, n = r.length > t.length ? t : r;
  if (e.length < 4 || n.length * 2 < e.length)
    return null;
  function i(p, m, y) {
    for (var w = p.substring(y, y + Math.floor(p.length / 4)), v = -1, S = "", A, E, T, M; (v = m.indexOf(w, v + 1)) !== -1; ) {
      var N = au(
        p.substring(y),
        m.substring(v)
      ), k = Ka(
        p.substring(0, y),
        m.substring(0, v)
      );
      S.length < k + N && (S = m.substring(v - k, v) + m.substring(v, v + N), A = p.substring(0, y - k), E = p.substring(y + N), T = m.substring(0, v - k), M = m.substring(v + N));
    }
    return S.length * 2 >= p.length ? [
      A,
      E,
      T,
      M,
      S
    ] : null;
  }
  var s = i(
    e,
    n,
    Math.ceil(e.length / 4)
  ), a = i(
    e,
    n,
    Math.ceil(e.length / 2)
  ), o;
  if (!s && !a)
    return null;
  a ? s ? o = s[4].length > a[4].length ? s : a : o = a : o = s;
  var l, c, u, h;
  r.length > t.length ? (l = o[0], c = o[1], u = o[2], h = o[3]) : (u = o[0], h = o[1], l = o[2], c = o[3]);
  var f = o[4];
  return [l, c, u, h, f];
}
function Pw(r) {
  for (var t = !1, e = [], n = 0, i = null, s = 0, a = 0, o = 0, l = 0, c = 0; s < r.length; )
    r[s][0] == St ? (e[n++] = s, a = l, o = c, l = 0, c = 0, i = r[s][1]) : (r[s][0] == Ft ? l += r[s][1].length : c += r[s][1].length, i && i.length <= Math.max(a, o) && i.length <= Math.max(l, c) && (r.splice(e[n - 1], 0, [
      Zt,
      i
    ]), r[e[n - 1] + 1][0] = Ft, n--, n--, s = n > 0 ? e[n - 1] : -1, a = 0, o = 0, l = 0, c = 0, i = null, t = !0)), s++;
  for (t && ou(r), jw(r), s = 1; s < r.length; ) {
    if (r[s - 1][0] == Zt && r[s][0] == Ft) {
      var u = r[s - 1][1], h = r[s][1], f = Od(u, h), p = Od(h, u);
      f >= p ? (f >= u.length / 2 || f >= h.length / 2) && (r.splice(s, 0, [
        St,
        h.substring(0, f)
      ]), r[s - 1][1] = u.substring(
        0,
        u.length - f
      ), r[s + 1][1] = h.substring(f), s++) : (p >= u.length / 2 || p >= h.length / 2) && (r.splice(s, 0, [
        St,
        u.substring(0, p)
      ]), r[s - 1][0] = Ft, r[s - 1][1] = h.substring(
        0,
        h.length - p
      ), r[s + 1][0] = Zt, r[s + 1][1] = u.substring(p), s++), s++;
    }
    s++;
  }
}
var Id = /[^a-zA-Z0-9]/, Nd = /\s/, Md = /[\r\n]/, Bw = /\n\r?\n$/, $w = /^\r?\n\r?\n/;
function jw(r) {
  function t(p, m) {
    if (!p || !m)
      return 6;
    var y = p.charAt(p.length - 1), w = m.charAt(0), v = y.match(Id), S = w.match(Id), A = v && y.match(Nd), E = S && w.match(Nd), T = A && y.match(Md), M = E && w.match(Md), N = T && p.match(Bw), k = M && m.match($w);
    return N || k ? 5 : T || M ? 4 : v && !A && E ? 3 : A || E ? 2 : v || S ? 1 : 0;
  }
  for (var e = 1; e < r.length - 1; ) {
    if (r[e - 1][0] == St && r[e + 1][0] == St) {
      var n = r[e - 1][1], i = r[e][1], s = r[e + 1][1], a = Ka(n, i);
      if (a) {
        var o = i.substring(i.length - a);
        n = n.substring(0, n.length - a), i = o + i.substring(0, i.length - a), s = o + s;
      }
      for (var l = n, c = i, u = s, h = t(n, i) + t(i, s); i.charAt(0) === s.charAt(0); ) {
        n += i.charAt(0), i = i.substring(1) + s.charAt(0), s = s.substring(1);
        var f = t(n, i) + t(i, s);
        f >= h && (h = f, l = n, c = i, u = s);
      }
      r[e - 1][1] != l && (l ? r[e - 1][1] = l : (r.splice(e - 1, 1), e--), r[e][1] = c, u ? r[e + 1][1] = u : (r.splice(e + 1, 1), e--));
    }
    e++;
  }
}
function ou(r, t) {
  r.push([St, ""]);
  for (var e = 0, n = 0, i = 0, s = "", a = "", o; e < r.length; ) {
    if (e < r.length - 1 && !r[e][1]) {
      r.splice(e, 1);
      continue;
    }
    switch (r[e][0]) {
      case Ft:
        i++, a += r[e][1], e++;
        break;
      case Zt:
        n++, s += r[e][1], e++;
        break;
      case St:
        var l = e - i - n - 1;
        if (t) {
          if (l >= 0 && mp(r[l][1])) {
            var c = r[l][1].slice(-1);
            if (r[l][1] = r[l][1].slice(
              0,
              -1
            ), s = c + s, a = c + a, !r[l][1]) {
              r.splice(l, 1), e--;
              var u = l - 1;
              r[u] && r[u][0] === Ft && (i++, a = r[u][1] + a, u--), r[u] && r[u][0] === Zt && (n++, s = r[u][1] + s, u--), l = u;
            }
          }
          if (gp(r[e][1])) {
            var c = r[e][1].charAt(0);
            r[e][1] = r[e][1].slice(1), s += c, a += c;
          }
        }
        if (e < r.length - 1 && !r[e][1]) {
          r.splice(e, 1);
          break;
        }
        if (s.length > 0 || a.length > 0) {
          s.length > 0 && a.length > 0 && (o = au(a, s), o !== 0 && (l >= 0 ? r[l][1] += a.substring(
            0,
            o
          ) : (r.splice(0, 0, [
            St,
            a.substring(0, o)
          ]), e++), a = a.substring(o), s = s.substring(o)), o = Ka(a, s), o !== 0 && (r[e][1] = a.substring(a.length - o) + r[e][1], a = a.substring(
            0,
            a.length - o
          ), s = s.substring(
            0,
            s.length - o
          )));
          var h = i + n;
          s.length === 0 && a.length === 0 ? (r.splice(e - h, h), e = e - h) : s.length === 0 ? (r.splice(e - h, h, [Ft, a]), e = e - h + 1) : a.length === 0 ? (r.splice(e - h, h, [Zt, s]), e = e - h + 1) : (r.splice(
            e - h,
            h,
            [Zt, s],
            [Ft, a]
          ), e = e - h + 2);
        }
        e !== 0 && r[e - 1][0] === St ? (r[e - 1][1] += r[e][1], r.splice(e, 1)) : e++, i = 0, n = 0, s = "", a = "";
        break;
    }
  }
  r[r.length - 1][1] === "" && r.pop();
  var f = !1;
  for (e = 1; e < r.length - 1; )
    r[e - 1][0] === St && r[e + 1][0] === St && (r[e][1].substring(
      r[e][1].length - r[e - 1][1].length
    ) === r[e - 1][1] ? (r[e][1] = r[e - 1][1] + r[e][1].substring(
      0,
      r[e][1].length - r[e - 1][1].length
    ), r[e + 1][1] = r[e - 1][1] + r[e + 1][1], r.splice(e - 1, 1), f = !0) : r[e][1].substring(0, r[e + 1][1].length) == r[e + 1][1] && (r[e - 1][1] += r[e + 1][1], r[e][1] = r[e][1].substring(r[e + 1][1].length) + r[e + 1][1], r.splice(e + 1, 1), f = !0)), e++;
  f && ou(r, t);
}
function fp(r) {
  return r >= 55296 && r <= 56319;
}
function pp(r) {
  return r >= 56320 && r <= 57343;
}
function gp(r) {
  return pp(r.charCodeAt(0));
}
function mp(r) {
  return fp(r.charCodeAt(r.length - 1));
}
function Fw(r) {
  for (var t = [], e = 0; e < r.length; e++)
    r[e][1].length > 0 && t.push(r[e]);
  return t;
}
function sl(r, t, e, n) {
  return mp(r) || gp(n) ? null : Fw([
    [St, r],
    [Zt, t],
    [Ft, e],
    [St, n]
  ]);
}
function Hw(r, t, e) {
  var n = typeof e == "number" ? { index: e, length: 0 } : e.oldRange, i = typeof e == "number" ? null : e.newRange, s = r.length, a = t.length;
  if (n.length === 0 && (i === null || i.length === 0)) {
    var o = n.index, l = r.slice(0, o), c = r.slice(o), u = i ? i.index : null;
    t: {
      var h = o + a - s;
      if (u !== null && u !== h || h < 0 || h > a)
        break t;
      var f = t.slice(0, h), p = t.slice(h);
      if (p !== c)
        break t;
      var m = Math.min(o, h), y = l.slice(0, m), w = f.slice(0, m);
      if (y !== w)
        break t;
      var v = l.slice(m), S = f.slice(m);
      return sl(y, v, S, c);
    }
    t: {
      if (u !== null && u !== o)
        break t;
      var A = o, f = t.slice(0, A), p = t.slice(A);
      if (f !== l)
        break t;
      var E = Math.min(s - A, a - A), T = c.slice(c.length - E), M = p.slice(p.length - E);
      if (T !== M)
        break t;
      var v = c.slice(0, c.length - E), S = p.slice(0, p.length - E);
      return sl(l, v, S, T);
    }
  }
  if (n.length > 0 && i && i.length === 0)
    t: {
      var y = r.slice(0, n.index), T = r.slice(n.index + n.length), m = y.length, E = T.length;
      if (a < m + E)
        break t;
      var w = t.slice(0, m), M = t.slice(a - E);
      if (y !== w || T !== M)
        break t;
      var v = r.slice(m, s - E), S = t.slice(m, a - E);
      return sl(y, v, S, T);
    }
  return null;
}
function Ya(r, t, e, n) {
  return is(r, t, e, n, !0);
}
Ya.INSERT = Ft;
Ya.DELETE = Zt;
Ya.EQUAL = St;
var Uw = Ya, Ea = { exports: {} };
Ea.exports;
(function(r, t) {
  var e = 200, n = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", l = "[object Date]", c = "[object Error]", u = "[object Function]", h = "[object GeneratorFunction]", f = "[object Map]", p = "[object Number]", m = "[object Object]", y = "[object Promise]", w = "[object RegExp]", v = "[object Set]", S = "[object String]", A = "[object Symbol]", E = "[object WeakMap]", T = "[object ArrayBuffer]", M = "[object DataView]", N = "[object Float32Array]", k = "[object Float64Array]", C = "[object Int8Array]", q = "[object Int16Array]", I = "[object Int32Array]", j = "[object Uint8Array]", Q = "[object Uint8ClampedArray]", H = "[object Uint16Array]", lt = "[object Uint32Array]", it = /[\\^$.*+?()[\]{}|]/g, vt = /\w*$/, ut = /^\[object .+?Constructor\]$/, wt = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[a] = U[T] = U[M] = U[o] = U[l] = U[N] = U[k] = U[C] = U[q] = U[I] = U[f] = U[p] = U[m] = U[w] = U[v] = U[S] = U[A] = U[j] = U[Q] = U[H] = U[lt] = !0, U[c] = U[u] = U[E] = !1;
  var _e = typeof Cn == "object" && Cn && Cn.Object === Object && Cn, Re = typeof self == "object" && self && self.Object === Object && self, fe = _e || Re || Function("return this")(), Ss = t && !t.nodeType && t, et = Ss && !0 && r && !r.nodeType && r, ks = et && et.exports === Ss;
  function ho(d, g) {
    return d.set(g[0], g[1]), d;
  }
  function pe(d, g) {
    return d.add(g), d;
  }
  function As(d, g) {
    for (var x = -1, L = d ? d.length : 0; ++x < L && g(d[x], x, d) !== !1; )
      ;
    return d;
  }
  function Es(d, g) {
    for (var x = -1, L = g.length, V = d.length; ++x < L; )
      d[V + x] = g[x];
    return d;
  }
  function pi(d, g, x, L) {
    for (var V = -1, $ = d ? d.length : 0; ++V < $; )
      x = g(x, d[V], V, d);
    return x;
  }
  function gi(d, g) {
    for (var x = -1, L = Array(d); ++x < d; )
      L[x] = g(x);
    return L;
  }
  function Cs(d, g) {
    return d == null ? void 0 : d[g];
  }
  function mi(d) {
    var g = !1;
    if (d != null && typeof d.toString != "function")
      try {
        g = !!(d + "");
      } catch {
      }
    return g;
  }
  function Ts(d) {
    var g = -1, x = Array(d.size);
    return d.forEach(function(L, V) {
      x[++g] = [V, L];
    }), x;
  }
  function bi(d, g) {
    return function(x) {
      return d(g(x));
    };
  }
  function Ls(d) {
    var g = -1, x = Array(d.size);
    return d.forEach(function(L) {
      x[++g] = L;
    }), x;
  }
  var fo = Array.prototype, po = Function.prototype, hr = Object.prototype, yi = fe["__core-js_shared__"], Ds = function() {
    var d = /[^.]+$/.exec(yi && yi.keys && yi.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Os = po.toString, ze = hr.hasOwnProperty, fr = hr.toString, go = RegExp(
    "^" + Os.call(ze).replace(it, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Pn = ks ? fe.Buffer : void 0, pr = fe.Symbol, vi = fe.Uint8Array, ne = bi(Object.getPrototypeOf, Object), Is = Object.create, Ns = hr.propertyIsEnumerable, mo = fo.splice, wi = Object.getOwnPropertySymbols, gr = Pn ? Pn.isBuffer : void 0, Ms = bi(Object.keys, Object), mr = me(fe, "DataView"), Bn = me(fe, "Map"), ge = me(fe, "Promise"), br = me(fe, "Set"), xi = me(fe, "WeakMap"), $n = me(Object, "create"), Si = Pt(mr), jn = Pt(Bn), ki = Pt(ge), Ai = Pt(br), Ei = Pt(xi), wn = pr ? pr.prototype : void 0, qs = wn ? wn.valueOf : void 0;
  function on(d) {
    var g = -1, x = d ? d.length : 0;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function bo() {
    this.__data__ = $n ? $n(null) : {};
  }
  function yo(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function vo(d) {
    var g = this.__data__;
    if ($n) {
      var x = g[d];
      return x === n ? void 0 : x;
    }
    return ze.call(g, d) ? g[d] : void 0;
  }
  function _s(d) {
    var g = this.__data__;
    return $n ? g[d] !== void 0 : ze.call(g, d);
  }
  function Ci(d, g) {
    var x = this.__data__;
    return x[d] = $n && g === void 0 ? n : g, this;
  }
  on.prototype.clear = bo, on.prototype.delete = yo, on.prototype.get = vo, on.prototype.has = _s, on.prototype.set = Ci;
  function Et(d) {
    var g = -1, x = d ? d.length : 0;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function wo() {
    this.__data__ = [];
  }
  function xo(d) {
    var g = this.__data__, x = vr(g, d);
    if (x < 0)
      return !1;
    var L = g.length - 1;
    return x == L ? g.pop() : mo.call(g, x, 1), !0;
  }
  function So(d) {
    var g = this.__data__, x = vr(g, d);
    return x < 0 ? void 0 : g[x][1];
  }
  function ko(d) {
    return vr(this.__data__, d) > -1;
  }
  function Ao(d, g) {
    var x = this.__data__, L = vr(x, d);
    return L < 0 ? x.push([d, g]) : x[L][1] = g, this;
  }
  Et.prototype.clear = wo, Et.prototype.delete = xo, Et.prototype.get = So, Et.prototype.has = ko, Et.prototype.set = Ao;
  function Lt(d) {
    var g = -1, x = d ? d.length : 0;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function Eo() {
    this.__data__ = {
      hash: new on(),
      map: new (Bn || Et)(),
      string: new on()
    };
  }
  function Co(d) {
    return Hn(this, d).delete(d);
  }
  function To(d) {
    return Hn(this, d).get(d);
  }
  function Lo(d) {
    return Hn(this, d).has(d);
  }
  function Do(d, g) {
    return Hn(this, d).set(d, g), this;
  }
  Lt.prototype.clear = Eo, Lt.prototype.delete = Co, Lt.prototype.get = To, Lt.prototype.has = Lo, Lt.prototype.set = Do;
  function Ut(d) {
    this.__data__ = new Et(d);
  }
  function Oo() {
    this.__data__ = new Et();
  }
  function Io(d) {
    return this.__data__.delete(d);
  }
  function No(d) {
    return this.__data__.get(d);
  }
  function Mo(d) {
    return this.__data__.has(d);
  }
  function qo(d, g) {
    var x = this.__data__;
    if (x instanceof Et) {
      var L = x.__data__;
      if (!Bn || L.length < e - 1)
        return L.push([d, g]), this;
      x = this.__data__ = new Lt(L);
    }
    return x.set(d, g), this;
  }
  Ut.prototype.clear = Oo, Ut.prototype.delete = Io, Ut.prototype.get = No, Ut.prototype.has = Mo, Ut.prototype.set = qo;
  function yr(d, g) {
    var x = Oi(d) || xr(d) ? gi(d.length, String) : [], L = x.length, V = !!L;
    for (var $ in d)
      ze.call(d, $) && !(V && ($ == "length" || Ko($, L))) && x.push($);
    return x;
  }
  function Rs(d, g, x) {
    var L = d[g];
    (!(ze.call(d, g) && js(L, x)) || x === void 0 && !(g in d)) && (d[g] = x);
  }
  function vr(d, g) {
    for (var x = d.length; x--; )
      if (js(d[x][0], g))
        return x;
    return -1;
  }
  function Pe(d, g) {
    return d && Di(g, Ni(g), d);
  }
  function Ti(d, g, x, L, V, $, X) {
    var Z;
    if (L && (Z = $ ? L(d, V, $, X) : L(d)), Z !== void 0)
      return Z;
    if (!$e(d))
      return d;
    var gt = Oi(d);
    if (gt) {
      if (Z = Go(d), !g)
        return Ho(d, Z);
    } else {
      var tt = cn(d), Dt = tt == u || tt == h;
      if (Fs(d))
        return wr(d, g);
      if (tt == m || tt == s || Dt && !$) {
        if (mi(d))
          return $ ? d : {};
        if (Z = Be(Dt ? {} : d), !g)
          return Uo(d, Pe(Z, d));
      } else {
        if (!U[tt])
          return $ ? d : {};
        Z = Wo(d, tt, Ti, g);
      }
    }
    X || (X = new Ut());
    var Vt = X.get(d);
    if (Vt)
      return Vt;
    if (X.set(d, Z), !gt)
      var xt = x ? Vo(d) : Ni(d);
    return As(xt || d, function(Ot, Ct) {
      xt && (Ct = Ot, Ot = d[Ct]), Rs(Z, Ct, Ti(Ot, g, x, L, Ct, d, X));
    }), Z;
  }
  function _o(d) {
    return $e(d) ? Is(d) : {};
  }
  function Ro(d, g, x) {
    var L = g(d);
    return Oi(d) ? L : Es(L, x(d));
  }
  function zo(d) {
    return fr.call(d);
  }
  function Po(d) {
    if (!$e(d) || Qo(d))
      return !1;
    var g = Ii(d) || mi(d) ? go : ut;
    return g.test(Pt(d));
  }
  function Bo(d) {
    if (!Bs(d))
      return Ms(d);
    var g = [];
    for (var x in Object(d))
      ze.call(d, x) && x != "constructor" && g.push(x);
    return g;
  }
  function wr(d, g) {
    if (g)
      return d.slice();
    var x = new d.constructor(d.length);
    return d.copy(x), x;
  }
  function Li(d) {
    var g = new d.constructor(d.byteLength);
    return new vi(g).set(new vi(d)), g;
  }
  function Fn(d, g) {
    var x = g ? Li(d.buffer) : d.buffer;
    return new d.constructor(x, d.byteOffset, d.byteLength);
  }
  function zs(d, g, x) {
    var L = g ? x(Ts(d), !0) : Ts(d);
    return pi(L, ho, new d.constructor());
  }
  function Ps(d) {
    var g = new d.constructor(d.source, vt.exec(d));
    return g.lastIndex = d.lastIndex, g;
  }
  function $o(d, g, x) {
    var L = g ? x(Ls(d), !0) : Ls(d);
    return pi(L, pe, new d.constructor());
  }
  function jo(d) {
    return qs ? Object(qs.call(d)) : {};
  }
  function Fo(d, g) {
    var x = g ? Li(d.buffer) : d.buffer;
    return new d.constructor(x, d.byteOffset, d.length);
  }
  function Ho(d, g) {
    var x = -1, L = d.length;
    for (g || (g = Array(L)); ++x < L; )
      g[x] = d[x];
    return g;
  }
  function Di(d, g, x, L) {
    x || (x = {});
    for (var V = -1, $ = g.length; ++V < $; ) {
      var X = g[V], Z = void 0;
      Rs(x, X, Z === void 0 ? d[X] : Z);
    }
    return x;
  }
  function Uo(d, g) {
    return Di(d, ln(d), g);
  }
  function Vo(d) {
    return Ro(d, Ni, ln);
  }
  function Hn(d, g) {
    var x = d.__data__;
    return Yo(g) ? x[typeof g == "string" ? "string" : "hash"] : x.map;
  }
  function me(d, g) {
    var x = Cs(d, g);
    return Po(x) ? x : void 0;
  }
  var ln = wi ? bi(wi, Object) : Xo, cn = zo;
  (mr && cn(new mr(new ArrayBuffer(1))) != M || Bn && cn(new Bn()) != f || ge && cn(ge.resolve()) != y || br && cn(new br()) != v || xi && cn(new xi()) != E) && (cn = function(d) {
    var g = fr.call(d), x = g == m ? d.constructor : void 0, L = x ? Pt(x) : void 0;
    if (L)
      switch (L) {
        case Si:
          return M;
        case jn:
          return f;
        case ki:
          return y;
        case Ai:
          return v;
        case Ei:
          return E;
      }
    return g;
  });
  function Go(d) {
    var g = d.length, x = d.constructor(g);
    return g && typeof d[0] == "string" && ze.call(d, "index") && (x.index = d.index, x.input = d.input), x;
  }
  function Be(d) {
    return typeof d.constructor == "function" && !Bs(d) ? _o(ne(d)) : {};
  }
  function Wo(d, g, x, L) {
    var V = d.constructor;
    switch (g) {
      case T:
        return Li(d);
      case o:
      case l:
        return new V(+d);
      case M:
        return Fn(d, L);
      case N:
      case k:
      case C:
      case q:
      case I:
      case j:
      case Q:
      case H:
      case lt:
        return Fo(d, L);
      case f:
        return zs(d, L, x);
      case p:
      case S:
        return new V(d);
      case w:
        return Ps(d);
      case v:
        return $o(d, L, x);
      case A:
        return jo(d);
    }
  }
  function Ko(d, g) {
    return g = g ?? i, !!g && (typeof d == "number" || wt.test(d)) && d > -1 && d % 1 == 0 && d < g;
  }
  function Yo(d) {
    var g = typeof d;
    return g == "string" || g == "number" || g == "symbol" || g == "boolean" ? d !== "__proto__" : d === null;
  }
  function Qo(d) {
    return !!Ds && Ds in d;
  }
  function Bs(d) {
    var g = d && d.constructor, x = typeof g == "function" && g.prototype || hr;
    return d === x;
  }
  function Pt(d) {
    if (d != null) {
      try {
        return Os.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function $s(d) {
    return Ti(d, !0, !0);
  }
  function js(d, g) {
    return d === g || d !== d && g !== g;
  }
  function xr(d) {
    return Zo(d) && ze.call(d, "callee") && (!Ns.call(d, "callee") || fr.call(d) == s);
  }
  var Oi = Array.isArray;
  function Sr(d) {
    return d != null && Hs(d.length) && !Ii(d);
  }
  function Zo(d) {
    return Us(d) && Sr(d);
  }
  var Fs = gr || Jo;
  function Ii(d) {
    var g = $e(d) ? fr.call(d) : "";
    return g == u || g == h;
  }
  function Hs(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= i;
  }
  function $e(d) {
    var g = typeof d;
    return !!d && (g == "object" || g == "function");
  }
  function Us(d) {
    return !!d && typeof d == "object";
  }
  function Ni(d) {
    return Sr(d) ? yr(d) : Bo(d);
  }
  function Xo() {
    return [];
  }
  function Jo() {
    return !1;
  }
  r.exports = $s;
})(Ea, Ea.exports);
var bp = Ea.exports, Ca = { exports: {} };
Ca.exports;
(function(r, t) {
  var e = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, o = "[object Arguments]", l = "[object Array]", c = "[object AsyncFunction]", u = "[object Boolean]", h = "[object Date]", f = "[object Error]", p = "[object Function]", m = "[object GeneratorFunction]", y = "[object Map]", w = "[object Number]", v = "[object Null]", S = "[object Object]", A = "[object Promise]", E = "[object Proxy]", T = "[object RegExp]", M = "[object Set]", N = "[object String]", k = "[object Symbol]", C = "[object Undefined]", q = "[object WeakMap]", I = "[object ArrayBuffer]", j = "[object DataView]", Q = "[object Float32Array]", H = "[object Float64Array]", lt = "[object Int8Array]", it = "[object Int16Array]", vt = "[object Int32Array]", ut = "[object Uint8Array]", wt = "[object Uint8ClampedArray]", U = "[object Uint16Array]", _e = "[object Uint32Array]", Re = /[\\^$.*+?()[\]{}|]/g, fe = /^\[object .+?Constructor\]$/, Ss = /^(?:0|[1-9]\d*)$/, et = {};
  et[Q] = et[H] = et[lt] = et[it] = et[vt] = et[ut] = et[wt] = et[U] = et[_e] = !0, et[o] = et[l] = et[I] = et[u] = et[j] = et[h] = et[f] = et[p] = et[y] = et[w] = et[S] = et[T] = et[M] = et[N] = et[q] = !1;
  var ks = typeof Cn == "object" && Cn && Cn.Object === Object && Cn, ho = typeof self == "object" && self && self.Object === Object && self, pe = ks || ho || Function("return this")(), As = t && !t.nodeType && t, Es = As && !0 && r && !r.nodeType && r, pi = Es && Es.exports === As, gi = pi && ks.process, Cs = function() {
    try {
      return gi && gi.binding && gi.binding("util");
    } catch {
    }
  }(), mi = Cs && Cs.isTypedArray;
  function Ts(d, g) {
    for (var x = -1, L = d == null ? 0 : d.length, V = 0, $ = []; ++x < L; ) {
      var X = d[x];
      g(X, x, d) && ($[V++] = X);
    }
    return $;
  }
  function bi(d, g) {
    for (var x = -1, L = g.length, V = d.length; ++x < L; )
      d[V + x] = g[x];
    return d;
  }
  function Ls(d, g) {
    for (var x = -1, L = d == null ? 0 : d.length; ++x < L; )
      if (g(d[x], x, d))
        return !0;
    return !1;
  }
  function fo(d, g) {
    for (var x = -1, L = Array(d); ++x < d; )
      L[x] = g(x);
    return L;
  }
  function po(d) {
    return function(g) {
      return d(g);
    };
  }
  function hr(d, g) {
    return d.has(g);
  }
  function yi(d, g) {
    return d == null ? void 0 : d[g];
  }
  function Ds(d) {
    var g = -1, x = Array(d.size);
    return d.forEach(function(L, V) {
      x[++g] = [V, L];
    }), x;
  }
  function Os(d, g) {
    return function(x) {
      return d(g(x));
    };
  }
  function ze(d) {
    var g = -1, x = Array(d.size);
    return d.forEach(function(L) {
      x[++g] = L;
    }), x;
  }
  var fr = Array.prototype, go = Function.prototype, Pn = Object.prototype, pr = pe["__core-js_shared__"], vi = go.toString, ne = Pn.hasOwnProperty, Is = function() {
    var d = /[^.]+$/.exec(pr && pr.keys && pr.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Ns = Pn.toString, mo = RegExp(
    "^" + vi.call(ne).replace(Re, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), wi = pi ? pe.Buffer : void 0, gr = pe.Symbol, Ms = pe.Uint8Array, mr = Pn.propertyIsEnumerable, Bn = fr.splice, ge = gr ? gr.toStringTag : void 0, br = Object.getOwnPropertySymbols, xi = wi ? wi.isBuffer : void 0, $n = Os(Object.keys, Object), Si = ln(pe, "DataView"), jn = ln(pe, "Map"), ki = ln(pe, "Promise"), Ai = ln(pe, "Set"), Ei = ln(pe, "WeakMap"), wn = ln(Object, "create"), qs = Pt(Si), on = Pt(jn), bo = Pt(ki), yo = Pt(Ai), vo = Pt(Ei), _s = gr ? gr.prototype : void 0, Ci = _s ? _s.valueOf : void 0;
  function Et(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function wo() {
    this.__data__ = wn ? wn(null) : {}, this.size = 0;
  }
  function xo(d) {
    var g = this.has(d) && delete this.__data__[d];
    return this.size -= g ? 1 : 0, g;
  }
  function So(d) {
    var g = this.__data__;
    if (wn) {
      var x = g[d];
      return x === n ? void 0 : x;
    }
    return ne.call(g, d) ? g[d] : void 0;
  }
  function ko(d) {
    var g = this.__data__;
    return wn ? g[d] !== void 0 : ne.call(g, d);
  }
  function Ao(d, g) {
    var x = this.__data__;
    return this.size += this.has(d) ? 0 : 1, x[d] = wn && g === void 0 ? n : g, this;
  }
  Et.prototype.clear = wo, Et.prototype.delete = xo, Et.prototype.get = So, Et.prototype.has = ko, Et.prototype.set = Ao;
  function Lt(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function Eo() {
    this.__data__ = [], this.size = 0;
  }
  function Co(d) {
    var g = this.__data__, x = wr(g, d);
    if (x < 0)
      return !1;
    var L = g.length - 1;
    return x == L ? g.pop() : Bn.call(g, x, 1), --this.size, !0;
  }
  function To(d) {
    var g = this.__data__, x = wr(g, d);
    return x < 0 ? void 0 : g[x][1];
  }
  function Lo(d) {
    return wr(this.__data__, d) > -1;
  }
  function Do(d, g) {
    var x = this.__data__, L = wr(x, d);
    return L < 0 ? (++this.size, x.push([d, g])) : x[L][1] = g, this;
  }
  Lt.prototype.clear = Eo, Lt.prototype.delete = Co, Lt.prototype.get = To, Lt.prototype.has = Lo, Lt.prototype.set = Do;
  function Ut(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function Oo() {
    this.size = 0, this.__data__ = {
      hash: new Et(),
      map: new (jn || Lt)(),
      string: new Et()
    };
  }
  function Io(d) {
    var g = me(this, d).delete(d);
    return this.size -= g ? 1 : 0, g;
  }
  function No(d) {
    return me(this, d).get(d);
  }
  function Mo(d) {
    return me(this, d).has(d);
  }
  function qo(d, g) {
    var x = me(this, d), L = x.size;
    return x.set(d, g), this.size += x.size == L ? 0 : 1, this;
  }
  Ut.prototype.clear = Oo, Ut.prototype.delete = Io, Ut.prototype.get = No, Ut.prototype.has = Mo, Ut.prototype.set = qo;
  function yr(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.__data__ = new Ut(); ++g < x; )
      this.add(d[g]);
  }
  function Rs(d) {
    return this.__data__.set(d, n), this;
  }
  function vr(d) {
    return this.__data__.has(d);
  }
  yr.prototype.add = yr.prototype.push = Rs, yr.prototype.has = vr;
  function Pe(d) {
    var g = this.__data__ = new Lt(d);
    this.size = g.size;
  }
  function Ti() {
    this.__data__ = new Lt(), this.size = 0;
  }
  function _o(d) {
    var g = this.__data__, x = g.delete(d);
    return this.size = g.size, x;
  }
  function Ro(d) {
    return this.__data__.get(d);
  }
  function zo(d) {
    return this.__data__.has(d);
  }
  function Po(d, g) {
    var x = this.__data__;
    if (x instanceof Lt) {
      var L = x.__data__;
      if (!jn || L.length < e - 1)
        return L.push([d, g]), this.size = ++x.size, this;
      x = this.__data__ = new Ut(L);
    }
    return x.set(d, g), this.size = x.size, this;
  }
  Pe.prototype.clear = Ti, Pe.prototype.delete = _o, Pe.prototype.get = Ro, Pe.prototype.has = zo, Pe.prototype.set = Po;
  function Bo(d, g) {
    var x = xr(d), L = !x && js(d), V = !x && !L && Sr(d), $ = !x && !L && !V && Us(d), X = x || L || V || $, Z = X ? fo(d.length, String) : [], gt = Z.length;
    for (var tt in d)
      ne.call(d, tt) && !(X && // Safari 9 has enumerable `arguments.length` in strict mode.
      (tt == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      V && (tt == "offset" || tt == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      $ && (tt == "buffer" || tt == "byteLength" || tt == "byteOffset") || // Skip index properties.
      Wo(tt, gt))) && Z.push(tt);
    return Z;
  }
  function wr(d, g) {
    for (var x = d.length; x--; )
      if ($s(d[x][0], g))
        return x;
    return -1;
  }
  function Li(d, g, x) {
    var L = g(d);
    return xr(d) ? L : bi(L, x(d));
  }
  function Fn(d) {
    return d == null ? d === void 0 ? C : v : ge && ge in Object(d) ? cn(d) : Bs(d);
  }
  function zs(d) {
    return $e(d) && Fn(d) == o;
  }
  function Ps(d, g, x, L, V) {
    return d === g ? !0 : d == null || g == null || !$e(d) && !$e(g) ? d !== d && g !== g : $o(d, g, x, L, Ps, V);
  }
  function $o(d, g, x, L, V, $) {
    var X = xr(d), Z = xr(g), gt = X ? l : Be(d), tt = Z ? l : Be(g);
    gt = gt == o ? S : gt, tt = tt == o ? S : tt;
    var Dt = gt == S, Vt = tt == S, xt = gt == tt;
    if (xt && Sr(d)) {
      if (!Sr(g))
        return !1;
      X = !0, Dt = !1;
    }
    if (xt && !Dt)
      return $ || ($ = new Pe()), X || Us(d) ? Di(d, g, x, L, V, $) : Uo(d, g, gt, x, L, V, $);
    if (!(x & i)) {
      var Ot = Dt && ne.call(d, "__wrapped__"), Ct = Vt && ne.call(g, "__wrapped__");
      if (Ot || Ct) {
        var xn = Ot ? d.value() : d, un = Ct ? g.value() : g;
        return $ || ($ = new Pe()), V(xn, un, x, L, $);
      }
    }
    return xt ? ($ || ($ = new Pe()), Vo(d, g, x, L, V, $)) : !1;
  }
  function jo(d) {
    if (!Hs(d) || Yo(d))
      return !1;
    var g = Fs(d) ? mo : fe;
    return g.test(Pt(d));
  }
  function Fo(d) {
    return $e(d) && Ii(d.length) && !!et[Fn(d)];
  }
  function Ho(d) {
    if (!Qo(d))
      return $n(d);
    var g = [];
    for (var x in Object(d))
      ne.call(d, x) && x != "constructor" && g.push(x);
    return g;
  }
  function Di(d, g, x, L, V, $) {
    var X = x & i, Z = d.length, gt = g.length;
    if (Z != gt && !(X && gt > Z))
      return !1;
    var tt = $.get(d);
    if (tt && $.get(g))
      return tt == g;
    var Dt = -1, Vt = !0, xt = x & s ? new yr() : void 0;
    for ($.set(d, g), $.set(g, d); ++Dt < Z; ) {
      var Ot = d[Dt], Ct = g[Dt];
      if (L)
        var xn = X ? L(Ct, Ot, Dt, g, d, $) : L(Ot, Ct, Dt, d, g, $);
      if (xn !== void 0) {
        if (xn)
          continue;
        Vt = !1;
        break;
      }
      if (xt) {
        if (!Ls(g, function(un, Un) {
          if (!hr(xt, Un) && (Ot === un || V(Ot, un, x, L, $)))
            return xt.push(Un);
        })) {
          Vt = !1;
          break;
        }
      } else if (!(Ot === Ct || V(Ot, Ct, x, L, $))) {
        Vt = !1;
        break;
      }
    }
    return $.delete(d), $.delete(g), Vt;
  }
  function Uo(d, g, x, L, V, $, X) {
    switch (x) {
      case j:
        if (d.byteLength != g.byteLength || d.byteOffset != g.byteOffset)
          return !1;
        d = d.buffer, g = g.buffer;
      case I:
        return !(d.byteLength != g.byteLength || !$(new Ms(d), new Ms(g)));
      case u:
      case h:
      case w:
        return $s(+d, +g);
      case f:
        return d.name == g.name && d.message == g.message;
      case T:
      case N:
        return d == g + "";
      case y:
        var Z = Ds;
      case M:
        var gt = L & i;
        if (Z || (Z = ze), d.size != g.size && !gt)
          return !1;
        var tt = X.get(d);
        if (tt)
          return tt == g;
        L |= s, X.set(d, g);
        var Dt = Di(Z(d), Z(g), L, V, $, X);
        return X.delete(d), Dt;
      case k:
        if (Ci)
          return Ci.call(d) == Ci.call(g);
    }
    return !1;
  }
  function Vo(d, g, x, L, V, $) {
    var X = x & i, Z = Hn(d), gt = Z.length, tt = Hn(g), Dt = tt.length;
    if (gt != Dt && !X)
      return !1;
    for (var Vt = gt; Vt--; ) {
      var xt = Z[Vt];
      if (!(X ? xt in g : ne.call(g, xt)))
        return !1;
    }
    var Ot = $.get(d);
    if (Ot && $.get(g))
      return Ot == g;
    var Ct = !0;
    $.set(d, g), $.set(g, d);
    for (var xn = X; ++Vt < gt; ) {
      xt = Z[Vt];
      var un = d[xt], Un = g[xt];
      if (L)
        var Uu = X ? L(Un, un, xt, g, d, $) : L(un, Un, xt, d, g, $);
      if (!(Uu === void 0 ? un === Un || V(un, Un, x, L, $) : Uu)) {
        Ct = !1;
        break;
      }
      xn || (xn = xt == "constructor");
    }
    if (Ct && !xn) {
      var Vs = d.constructor, Gs = g.constructor;
      Vs != Gs && "constructor" in d && "constructor" in g && !(typeof Vs == "function" && Vs instanceof Vs && typeof Gs == "function" && Gs instanceof Gs) && (Ct = !1);
    }
    return $.delete(d), $.delete(g), Ct;
  }
  function Hn(d) {
    return Li(d, Ni, Go);
  }
  function me(d, g) {
    var x = d.__data__;
    return Ko(g) ? x[typeof g == "string" ? "string" : "hash"] : x.map;
  }
  function ln(d, g) {
    var x = yi(d, g);
    return jo(x) ? x : void 0;
  }
  function cn(d) {
    var g = ne.call(d, ge), x = d[ge];
    try {
      d[ge] = void 0;
      var L = !0;
    } catch {
    }
    var V = Ns.call(d);
    return L && (g ? d[ge] = x : delete d[ge]), V;
  }
  var Go = br ? function(d) {
    return d == null ? [] : (d = Object(d), Ts(br(d), function(g) {
      return mr.call(d, g);
    }));
  } : Xo, Be = Fn;
  (Si && Be(new Si(new ArrayBuffer(1))) != j || jn && Be(new jn()) != y || ki && Be(ki.resolve()) != A || Ai && Be(new Ai()) != M || Ei && Be(new Ei()) != q) && (Be = function(d) {
    var g = Fn(d), x = g == S ? d.constructor : void 0, L = x ? Pt(x) : "";
    if (L)
      switch (L) {
        case qs:
          return j;
        case on:
          return y;
        case bo:
          return A;
        case yo:
          return M;
        case vo:
          return q;
      }
    return g;
  });
  function Wo(d, g) {
    return g = g ?? a, !!g && (typeof d == "number" || Ss.test(d)) && d > -1 && d % 1 == 0 && d < g;
  }
  function Ko(d) {
    var g = typeof d;
    return g == "string" || g == "number" || g == "symbol" || g == "boolean" ? d !== "__proto__" : d === null;
  }
  function Yo(d) {
    return !!Is && Is in d;
  }
  function Qo(d) {
    var g = d && d.constructor, x = typeof g == "function" && g.prototype || Pn;
    return d === x;
  }
  function Bs(d) {
    return Ns.call(d);
  }
  function Pt(d) {
    if (d != null) {
      try {
        return vi.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function $s(d, g) {
    return d === g || d !== d && g !== g;
  }
  var js = zs(/* @__PURE__ */ function() {
    return arguments;
  }()) ? zs : function(d) {
    return $e(d) && ne.call(d, "callee") && !mr.call(d, "callee");
  }, xr = Array.isArray;
  function Oi(d) {
    return d != null && Ii(d.length) && !Fs(d);
  }
  var Sr = xi || Jo;
  function Zo(d, g) {
    return Ps(d, g);
  }
  function Fs(d) {
    if (!Hs(d))
      return !1;
    var g = Fn(d);
    return g == p || g == m || g == c || g == E;
  }
  function Ii(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= a;
  }
  function Hs(d) {
    var g = typeof d;
    return d != null && (g == "object" || g == "function");
  }
  function $e(d) {
    return d != null && typeof d == "object";
  }
  var Us = mi ? po(mi) : Fo;
  function Ni(d) {
    return Oi(d) ? Bo(d) : Ho(d);
  }
  function Xo() {
    return [];
  }
  function Jo() {
    return !1;
  }
  r.exports = Zo;
})(Ca, Ca.exports);
var yp = Ca.exports, lu = {};
Object.defineProperty(lu, "__esModule", { value: !0 });
const Vw = bp, Gw = yp;
var ec;
(function(r) {
  function t(s = {}, a = {}, o = !1) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    let l = Vw(a);
    o || (l = Object.keys(l).reduce((c, u) => (l[u] != null && (c[u] = l[u]), c), {}));
    for (const c in s)
      s[c] !== void 0 && a[c] === void 0 && (l[c] = s[c]);
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.compose = t;
  function e(s = {}, a = {}) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    const o = Object.keys(s).concat(Object.keys(a)).reduce((l, c) => (Gw(s[c], a[c]) || (l[c] = a[c] === void 0 ? null : a[c]), l), {});
    return Object.keys(o).length > 0 ? o : void 0;
  }
  r.diff = e;
  function n(s = {}, a = {}) {
    s = s || {};
    const o = Object.keys(a).reduce((l, c) => (a[c] !== s[c] && s[c] !== void 0 && (l[c] = a[c]), l), {});
    return Object.keys(s).reduce((l, c) => (s[c] !== a[c] && a[c] === void 0 && (l[c] = null), l), o);
  }
  r.invert = n;
  function i(s, a, o = !1) {
    if (typeof s != "object")
      return a;
    if (typeof a != "object")
      return;
    if (!o)
      return a;
    const l = Object.keys(a).reduce((c, u) => (s[u] === void 0 && (c[u] = a[u]), c), {});
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.transform = i;
})(ec || (ec = {}));
lu.default = ec;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
var nc;
(function(r) {
  function t(e) {
    return typeof e.delete == "number" ? e.delete : typeof e.retain == "number" ? e.retain : typeof e.retain == "object" && e.retain !== null ? 1 : typeof e.insert == "string" ? e.insert.length : 1;
  }
  r.length = t;
})(nc || (nc = {}));
Qa.default = nc;
var cu = {};
Object.defineProperty(cu, "__esModule", { value: !0 });
const qd = Qa;
class Ww {
  constructor(t) {
    this.ops = t, this.index = 0, this.offset = 0;
  }
  hasNext() {
    return this.peekLength() < 1 / 0;
  }
  next(t) {
    t || (t = 1 / 0);
    const e = this.ops[this.index];
    if (e) {
      const n = this.offset, i = qd.default.length(e);
      if (t >= i - n ? (t = i - n, this.index += 1, this.offset = 0) : this.offset += t, typeof e.delete == "number")
        return { delete: t };
      {
        const s = {};
        return e.attributes && (s.attributes = e.attributes), typeof e.retain == "number" ? s.retain = t : typeof e.retain == "object" && e.retain !== null ? s.retain = e.retain : typeof e.insert == "string" ? s.insert = e.insert.substr(n, t) : s.insert = e.insert, s;
      }
    } else
      return { retain: 1 / 0 };
  }
  peek() {
    return this.ops[this.index];
  }
  peekLength() {
    return this.ops[this.index] ? qd.default.length(this.ops[this.index]) - this.offset : 1 / 0;
  }
  peekType() {
    const t = this.ops[this.index];
    return t ? typeof t.delete == "number" ? "delete" : typeof t.retain == "number" || typeof t.retain == "object" && t.retain !== null ? "retain" : "insert" : "retain";
  }
  rest() {
    if (this.hasNext()) {
      if (this.offset === 0)
        return this.ops.slice(this.index);
      {
        const t = this.offset, e = this.index, n = this.next(), i = this.ops.slice(this.index);
        return this.offset = t, this.index = e, [n].concat(i);
      }
    } else return [];
  }
}
cu.default = Ww;
(function(r, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.AttributeMap = t.OpIterator = t.Op = void 0;
  const e = Uw, n = bp, i = yp, s = lu;
  t.AttributeMap = s.default;
  const a = Qa;
  t.Op = a.default;
  const o = cu;
  t.OpIterator = o.default;
  const l = "\0", c = (h, f) => {
    if (typeof h != "object" || h === null)
      throw new Error(`cannot retain a ${typeof h}`);
    if (typeof f != "object" || f === null)
      throw new Error(`cannot retain a ${typeof f}`);
    const p = Object.keys(h)[0];
    if (!p || p !== Object.keys(f)[0])
      throw new Error(`embed types not matched: ${p} != ${Object.keys(f)[0]}`);
    return [p, h[p], f[p]];
  };
  class u {
    constructor(f) {
      Array.isArray(f) ? this.ops = f : f != null && Array.isArray(f.ops) ? this.ops = f.ops : this.ops = [];
    }
    static registerEmbed(f, p) {
      this.handlers[f] = p;
    }
    static unregisterEmbed(f) {
      delete this.handlers[f];
    }
    static getHandler(f) {
      const p = this.handlers[f];
      if (!p)
        throw new Error(`no handlers for embed type "${f}"`);
      return p;
    }
    insert(f, p) {
      const m = {};
      return typeof f == "string" && f.length === 0 ? this : (m.insert = f, p != null && typeof p == "object" && Object.keys(p).length > 0 && (m.attributes = p), this.push(m));
    }
    delete(f) {
      return f <= 0 ? this : this.push({ delete: f });
    }
    retain(f, p) {
      if (typeof f == "number" && f <= 0)
        return this;
      const m = { retain: f };
      return p != null && typeof p == "object" && Object.keys(p).length > 0 && (m.attributes = p), this.push(m);
    }
    push(f) {
      let p = this.ops.length, m = this.ops[p - 1];
      if (f = n(f), typeof m == "object") {
        if (typeof f.delete == "number" && typeof m.delete == "number")
          return this.ops[p - 1] = { delete: m.delete + f.delete }, this;
        if (typeof m.delete == "number" && f.insert != null && (p -= 1, m = this.ops[p - 1], typeof m != "object"))
          return this.ops.unshift(f), this;
        if (i(f.attributes, m.attributes)) {
          if (typeof f.insert == "string" && typeof m.insert == "string")
            return this.ops[p - 1] = { insert: m.insert + f.insert }, typeof f.attributes == "object" && (this.ops[p - 1].attributes = f.attributes), this;
          if (typeof f.retain == "number" && typeof m.retain == "number")
            return this.ops[p - 1] = { retain: m.retain + f.retain }, typeof f.attributes == "object" && (this.ops[p - 1].attributes = f.attributes), this;
        }
      }
      return p === this.ops.length ? this.ops.push(f) : this.ops.splice(p, 0, f), this;
    }
    chop() {
      const f = this.ops[this.ops.length - 1];
      return f && typeof f.retain == "number" && !f.attributes && this.ops.pop(), this;
    }
    filter(f) {
      return this.ops.filter(f);
    }
    forEach(f) {
      this.ops.forEach(f);
    }
    map(f) {
      return this.ops.map(f);
    }
    partition(f) {
      const p = [], m = [];
      return this.forEach((y) => {
        (f(y) ? p : m).push(y);
      }), [p, m];
    }
    reduce(f, p) {
      return this.ops.reduce(f, p);
    }
    changeLength() {
      return this.reduce((f, p) => p.insert ? f + a.default.length(p) : p.delete ? f - p.delete : f, 0);
    }
    length() {
      return this.reduce((f, p) => f + a.default.length(p), 0);
    }
    slice(f = 0, p = 1 / 0) {
      const m = [], y = new o.default(this.ops);
      let w = 0;
      for (; w < p && y.hasNext(); ) {
        let v;
        w < f ? v = y.next(f - w) : (v = y.next(p - w), m.push(v)), w += a.default.length(v);
      }
      return new u(m);
    }
    compose(f) {
      const p = new o.default(this.ops), m = new o.default(f.ops), y = [], w = m.peek();
      if (w != null && typeof w.retain == "number" && w.attributes == null) {
        let S = w.retain;
        for (; p.peekType() === "insert" && p.peekLength() <= S; )
          S -= p.peekLength(), y.push(p.next());
        w.retain - S > 0 && m.next(w.retain - S);
      }
      const v = new u(y);
      for (; p.hasNext() || m.hasNext(); )
        if (m.peekType() === "insert")
          v.push(m.next());
        else if (p.peekType() === "delete")
          v.push(p.next());
        else {
          const S = Math.min(p.peekLength(), m.peekLength()), A = p.next(S), E = m.next(S);
          if (E.retain) {
            const T = {};
            if (typeof A.retain == "number")
              T.retain = typeof E.retain == "number" ? S : E.retain;
            else if (typeof E.retain == "number")
              A.retain == null ? T.insert = A.insert : T.retain = A.retain;
            else {
              const N = A.retain == null ? "insert" : "retain", [k, C, q] = c(A[N], E.retain), I = u.getHandler(k);
              T[N] = {
                [k]: I.compose(C, q, N === "retain")
              };
            }
            const M = s.default.compose(A.attributes, E.attributes, typeof A.retain == "number");
            if (M && (T.attributes = M), v.push(T), !m.hasNext() && i(v.ops[v.ops.length - 1], T)) {
              const N = new u(p.rest());
              return v.concat(N).chop();
            }
          } else typeof E.delete == "number" && (typeof A.retain == "number" || typeof A.retain == "object" && A.retain !== null) && v.push(E);
        }
      return v.chop();
    }
    concat(f) {
      const p = new u(this.ops.slice());
      return f.ops.length > 0 && (p.push(f.ops[0]), p.ops = p.ops.concat(f.ops.slice(1))), p;
    }
    diff(f, p) {
      if (this.ops === f.ops)
        return new u();
      const m = [this, f].map((A) => A.map((E) => {
        if (E.insert != null)
          return typeof E.insert == "string" ? E.insert : l;
        const T = A === f ? "on" : "with";
        throw new Error("diff() called " + T + " non-document");
      }).join("")), y = new u(), w = e(m[0], m[1], p, !0), v = new o.default(this.ops), S = new o.default(f.ops);
      return w.forEach((A) => {
        let E = A[1].length;
        for (; E > 0; ) {
          let T = 0;
          switch (A[0]) {
            case e.INSERT:
              T = Math.min(S.peekLength(), E), y.push(S.next(T));
              break;
            case e.DELETE:
              T = Math.min(E, v.peekLength()), v.next(T), y.delete(T);
              break;
            case e.EQUAL:
              T = Math.min(v.peekLength(), S.peekLength(), E);
              const M = v.next(T), N = S.next(T);
              i(M.insert, N.insert) ? y.retain(T, s.default.diff(M.attributes, N.attributes)) : y.push(N).delete(T);
              break;
          }
          E -= T;
        }
      }), y.chop();
    }
    eachLine(f, p = `
`) {
      const m = new o.default(this.ops);
      let y = new u(), w = 0;
      for (; m.hasNext(); ) {
        if (m.peekType() !== "insert")
          return;
        const v = m.peek(), S = a.default.length(v) - m.peekLength(), A = typeof v.insert == "string" ? v.insert.indexOf(p, S) - S : -1;
        if (A < 0)
          y.push(m.next());
        else if (A > 0)
          y.push(m.next(A));
        else {
          if (f(y, m.next(1).attributes || {}, w) === !1)
            return;
          w += 1, y = new u();
        }
      }
      y.length() > 0 && f(y, {}, w);
    }
    invert(f) {
      const p = new u();
      return this.reduce((m, y) => {
        if (y.insert)
          p.delete(a.default.length(y));
        else {
          if (typeof y.retain == "number" && y.attributes == null)
            return p.retain(y.retain), m + y.retain;
          if (y.delete || typeof y.retain == "number") {
            const w = y.delete || y.retain;
            return f.slice(m, m + w).forEach((S) => {
              y.delete ? p.push(S) : y.retain && y.attributes && p.retain(a.default.length(S), s.default.invert(y.attributes, S.attributes));
            }), m + w;
          } else if (typeof y.retain == "object" && y.retain !== null) {
            const w = f.slice(m, m + 1), v = new o.default(w.ops).next(), [S, A, E] = c(y.retain, v.insert), T = u.getHandler(S);
            return p.retain({ [S]: T.invert(A, E) }, s.default.invert(y.attributes, v.attributes)), m + 1;
          }
        }
        return m;
      }, 0), p.chop();
    }
    transform(f, p = !1) {
      if (p = !!p, typeof f == "number")
        return this.transformPosition(f, p);
      const m = f, y = new o.default(this.ops), w = new o.default(m.ops), v = new u();
      for (; y.hasNext() || w.hasNext(); )
        if (y.peekType() === "insert" && (p || w.peekType() !== "insert"))
          v.retain(a.default.length(y.next()));
        else if (w.peekType() === "insert")
          v.push(w.next());
        else {
          const S = Math.min(y.peekLength(), w.peekLength()), A = y.next(S), E = w.next(S);
          if (A.delete)
            continue;
          if (E.delete)
            v.push(E);
          else {
            const T = A.retain, M = E.retain;
            let N = typeof M == "object" && M !== null ? M : S;
            if (typeof T == "object" && T !== null && typeof M == "object" && M !== null) {
              const k = Object.keys(T)[0];
              if (k === Object.keys(M)[0]) {
                const C = u.getHandler(k);
                C && (N = {
                  [k]: C.transform(T[k], M[k], p)
                });
              }
            }
            v.retain(N, s.default.transform(A.attributes, E.attributes, p));
          }
        }
      return v.chop();
    }
    transformPosition(f, p = !1) {
      p = !!p;
      const m = new o.default(this.ops);
      let y = 0;
      for (; m.hasNext() && y <= f; ) {
        const w = m.peekLength(), v = m.peekType();
        if (m.next(), v === "delete") {
          f -= Math.min(w, f - y);
          continue;
        } else v === "insert" && (y < f || !p) && (f += w);
        y += w;
      }
      return f;
    }
  }
  u.Op = a.default, u.OpIterator = o.default, u.AttributeMap = s.default, u.handlers = {}, t.default = u, r.exports = u, r.exports.default = u;
})(tc, tc.exports);
var ue = tc.exports;
const P = /* @__PURE__ */ hp(ue);
class Me extends te {
  static value() {
  }
  optimize() {
    (this.prev || this.next) && this.remove();
  }
  length() {
    return 0;
  }
  value() {
    return "";
  }
}
Me.blotName = "break";
Me.tagName = "BR";
let De = class extends Aa {
};
const Kw = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Za(r) {
  return r.replace(/[&<>"']/g, (t) => Kw[t]);
}
const je = class je extends iu {
  static compare(t, e) {
    const n = je.order.indexOf(t), i = je.order.indexOf(e);
    return n >= 0 || i >= 0 ? n - i : t === e ? 0 : t < e ? -1 : 1;
  }
  formatAt(t, e, n, i) {
    if (je.compare(this.statics.blotName, n) < 0 && this.scroll.query(n, B.BLOT)) {
      const s = this.isolate(t, e);
      i && s.wrap(n, i);
    } else
      super.formatAt(t, e, n, i);
  }
  optimize(t) {
    if (super.optimize(t), this.parent instanceof je && je.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const e = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(e), e.wrap(this);
    }
  }
};
_(je, "allowedChildren", [je, Me, te, De]), // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
_(je, "order", [
  "cursor",
  "inline",
  // Must be lower
  "link",
  // Chrome wants <a> to be lower
  "underline",
  "strike",
  "italic",
  "bold",
  "script",
  "code"
  // Must be higher
]);
let Xe = je;
const _d = 1;
class Tt extends rs {
  constructor() {
    super(...arguments);
    _(this, "cache", {});
  }
  delta() {
    return this.cache.delta == null && (this.cache.delta = vp(this)), this.cache.delta;
  }
  deleteAt(e, n) {
    super.deleteAt(e, n), this.cache = {};
  }
  formatAt(e, n, i, s) {
    n <= 0 || (this.scroll.query(i, B.BLOCK) ? e + n === this.length() && this.format(i, s) : super.formatAt(e, Math.min(n, this.length() - e - 1), i, s), this.cache = {});
  }
  insertAt(e, n, i) {
    if (i != null) {
      super.insertAt(e, n, i), this.cache = {};
      return;
    }
    if (n.length === 0) return;
    const s = n.split(`
`), a = s.shift();
    a.length > 0 && (e < this.length() - 1 || this.children.tail == null ? super.insertAt(Math.min(e, this.length() - 1), a) : this.children.tail.insertAt(this.children.tail.length(), a), this.cache = {});
    let o = this;
    s.reduce((l, c) => (o = o.split(l, !0), o.insertAt(0, c), c.length), e + a.length);
  }
  insertBefore(e, n) {
    const {
      head: i
    } = this.children;
    super.insertBefore(e, n), i instanceof Me && i.remove(), this.cache = {};
  }
  length() {
    return this.cache.length == null && (this.cache.length = super.length() + _d), this.cache.length;
  }
  moveChildren(e, n) {
    super.moveChildren(e, n), this.cache = {};
  }
  optimize(e) {
    super.optimize(e), this.cache = {};
  }
  path(e) {
    return super.path(e, !0);
  }
  removeChild(e) {
    super.removeChild(e), this.cache = {};
  }
  split(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (n && (e === 0 || e >= this.length() - _d)) {
      const s = this.clone();
      return e === 0 ? (this.parent.insertBefore(s, this), this) : (this.parent.insertBefore(s, this.next), s);
    }
    const i = super.split(e, n);
    return this.cache = {}, i;
  }
}
Tt.blotName = "block";
Tt.tagName = "P";
Tt.defaultChild = Me;
Tt.allowedChildren = [Me, Xe, te, De];
class ce extends te {
  attach() {
    super.attach(), this.attributes = new Ga(this.domNode);
  }
  delta() {
    return new P().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values()
    });
  }
  format(t, e) {
    const n = this.scroll.query(t, B.BLOCK_ATTRIBUTE);
    n != null && this.attributes.attribute(n, e);
  }
  formatAt(t, e, n, i) {
    this.format(n, i);
  }
  insertAt(t, e, n) {
    if (n != null) {
      super.insertAt(t, e, n);
      return;
    }
    const i = e.split(`
`), s = i.pop(), a = i.map((l) => {
      const c = this.scroll.create(Tt.blotName);
      return c.insertAt(0, l), c;
    }), o = this.split(t);
    a.forEach((l) => {
      this.parent.insertBefore(l, o);
    }), s && this.parent.insertBefore(this.scroll.create("text", s), o);
  }
}
ce.scope = B.BLOCK_BLOT;
function vp(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  return r.descendants(qt).reduce((e, n) => n.length() === 0 ? e : e.insert(n.value(), ae(n, {}, t)), new P()).insert(`
`, ae(r));
}
function ae(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  return r == null || ("formats" in r && typeof r.formats == "function" && (t = {
    ...t,
    ...r.formats()
  }, e && delete t["code-token"]), r.parent == null || r.parent.statics.blotName === "scroll" || r.parent.statics.scope !== r.statics.scope) ? t : ae(r.parent, t, e);
}
const ie = class ie extends te {
  // Zero width no break space
  static value() {
  }
  constructor(t, e, n) {
    super(t, e), this.selection = n, this.textNode = document.createTextNode(ie.CONTENTS), this.domNode.appendChild(this.textNode), this.savedLength = 0;
  }
  detach() {
    this.parent != null && this.parent.removeChild(this);
  }
  format(t, e) {
    if (this.savedLength !== 0) {
      super.format(t, e);
      return;
    }
    let n = this, i = 0;
    for (; n != null && n.statics.scope !== B.BLOCK_BLOT; )
      i += n.offset(n.parent), n = n.parent;
    n != null && (this.savedLength = ie.CONTENTS.length, n.optimize(), n.formatAt(i, ie.CONTENTS.length, t, e), this.savedLength = 0);
  }
  index(t, e) {
    return t === this.textNode ? 0 : super.index(t, e);
  }
  length() {
    return this.savedLength;
  }
  position() {
    return [this.textNode, this.textNode.data.length];
  }
  remove() {
    super.remove(), this.parent = null;
  }
  restore() {
    if (this.selection.composing || this.parent == null) return null;
    const t = this.selection.getNativeRange();
    for (; this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode; )
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    const e = this.prev instanceof De ? this.prev : null, n = e ? e.length() : 0, i = this.next instanceof De ? this.next : null, s = i ? i.text : "", {
      textNode: a
    } = this, o = a.data.split(ie.CONTENTS).join("");
    a.data = ie.CONTENTS;
    let l;
    if (e)
      l = e, (o || i) && (e.insertAt(e.length(), o + s), i && i.remove());
    else if (i)
      l = i, i.insertAt(0, o);
    else {
      const c = document.createTextNode(o);
      l = this.scroll.create(c), this.parent.insertBefore(l, this);
    }
    if (this.remove(), t) {
      const c = (f, p) => e && f === e.domNode ? p : f === a ? n + p - 1 : i && f === i.domNode ? n + o.length + p : null, u = c(t.start.node, t.start.offset), h = c(t.end.node, t.end.offset);
      if (u !== null && h !== null)
        return {
          startNode: l.domNode,
          startOffset: u,
          endNode: l.domNode,
          endOffset: h
        };
    }
    return null;
  }
  update(t, e) {
    if (t.some((n) => n.type === "characterData" && n.target === this.textNode)) {
      const n = this.restore();
      n && (e.range = n);
    }
  }
  // Avoid .ql-cursor being a descendant of `<a/>`.
  // The reason is Safari pushes down `<a/>` on text insertion.
  // That will cause DOM nodes not sync with the model.
  //
  // For example ({I} is the caret), given the markup:
  //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
  // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
  //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
  // And then "x" will be inserted after `<a/>`:
  //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
  optimize(t) {
    super.optimize(t);
    let {
      parent: e
    } = this;
    for (; e; ) {
      if (e.domNode.tagName === "A") {
        this.savedLength = ie.CONTENTS.length, e.isolate(this.offset(e), this.length()).unwrap(), this.savedLength = 0;
        break;
      }
      e = e.parent;
    }
  }
  value() {
    return "";
  }
};
_(ie, "blotName", "cursor"), _(ie, "className", "ql-cursor"), _(ie, "tagName", "span"), _(ie, "CONTENTS", "\uFEFF");
let ni = ie;
var wp = { exports: {} };
(function(r) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function n() {
  }
  Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (e = !1));
  function i(l, c, u) {
    this.fn = l, this.context = c, this.once = u || !1;
  }
  function s(l, c, u, h, f) {
    if (typeof u != "function")
      throw new TypeError("The listener must be a function");
    var p = new i(u, h || l, f), m = e ? e + c : c;
    return l._events[m] ? l._events[m].fn ? l._events[m] = [l._events[m], p] : l._events[m].push(p) : (l._events[m] = p, l._eventsCount++), l;
  }
  function a(l, c) {
    --l._eventsCount === 0 ? l._events = new n() : delete l._events[c];
  }
  function o() {
    this._events = new n(), this._eventsCount = 0;
  }
  o.prototype.eventNames = function() {
    var c = [], u, h;
    if (this._eventsCount === 0) return c;
    for (h in u = this._events)
      t.call(u, h) && c.push(e ? h.slice(1) : h);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(u)) : c;
  }, o.prototype.listeners = function(c) {
    var u = e ? e + c : c, h = this._events[u];
    if (!h) return [];
    if (h.fn) return [h.fn];
    for (var f = 0, p = h.length, m = new Array(p); f < p; f++)
      m[f] = h[f].fn;
    return m;
  }, o.prototype.listenerCount = function(c) {
    var u = e ? e + c : c, h = this._events[u];
    return h ? h.fn ? 1 : h.length : 0;
  }, o.prototype.emit = function(c, u, h, f, p, m) {
    var y = e ? e + c : c;
    if (!this._events[y]) return !1;
    var w = this._events[y], v = arguments.length, S, A;
    if (w.fn) {
      switch (w.once && this.removeListener(c, w.fn, void 0, !0), v) {
        case 1:
          return w.fn.call(w.context), !0;
        case 2:
          return w.fn.call(w.context, u), !0;
        case 3:
          return w.fn.call(w.context, u, h), !0;
        case 4:
          return w.fn.call(w.context, u, h, f), !0;
        case 5:
          return w.fn.call(w.context, u, h, f, p), !0;
        case 6:
          return w.fn.call(w.context, u, h, f, p, m), !0;
      }
      for (A = 1, S = new Array(v - 1); A < v; A++)
        S[A - 1] = arguments[A];
      w.fn.apply(w.context, S);
    } else {
      var E = w.length, T;
      for (A = 0; A < E; A++)
        switch (w[A].once && this.removeListener(c, w[A].fn, void 0, !0), v) {
          case 1:
            w[A].fn.call(w[A].context);
            break;
          case 2:
            w[A].fn.call(w[A].context, u);
            break;
          case 3:
            w[A].fn.call(w[A].context, u, h);
            break;
          case 4:
            w[A].fn.call(w[A].context, u, h, f);
            break;
          default:
            if (!S) for (T = 1, S = new Array(v - 1); T < v; T++)
              S[T - 1] = arguments[T];
            w[A].fn.apply(w[A].context, S);
        }
    }
    return !0;
  }, o.prototype.on = function(c, u, h) {
    return s(this, c, u, h, !1);
  }, o.prototype.once = function(c, u, h) {
    return s(this, c, u, h, !0);
  }, o.prototype.removeListener = function(c, u, h, f) {
    var p = e ? e + c : c;
    if (!this._events[p]) return this;
    if (!u)
      return a(this, p), this;
    var m = this._events[p];
    if (m.fn)
      m.fn === u && (!f || m.once) && (!h || m.context === h) && a(this, p);
    else {
      for (var y = 0, w = [], v = m.length; y < v; y++)
        (m[y].fn !== u || f && !m[y].once || h && m[y].context !== h) && w.push(m[y]);
      w.length ? this._events[p] = w.length === 1 ? w[0] : w : a(this, p);
    }
    return this;
  }, o.prototype.removeAllListeners = function(c) {
    var u;
    return c ? (u = e ? e + c : c, this._events[u] && a(this, u)) : (this._events = new n(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = e, o.EventEmitter = o, r.exports = o;
})(wp);
var Yw = wp.exports;
const Qw = /* @__PURE__ */ hp(Yw), rc = /* @__PURE__ */ new WeakMap(), ic = ["error", "warn", "log", "info"];
let sc = "warn";
function xp(r) {
  if (sc && ic.indexOf(r) <= ic.indexOf(sc)) {
    for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
      e[n - 1] = arguments[n];
    console[r](...e);
  }
}
function yn(r) {
  return ic.reduce((t, e) => (t[e] = xp.bind(console, e, r), t), {});
}
yn.level = (r) => {
  sc = r;
};
xp.level = yn.level;
const al = yn("quill:events"), Zw = ["selectionchange", "mousedown", "mouseup", "click"];
Zw.forEach((r) => {
  document.addEventListener(r, function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    Array.from(document.querySelectorAll(".ql-container")).forEach((i) => {
      const s = rc.get(i);
      s && s.emitter && s.emitter.handleDOM(...e);
    });
  });
});
class z extends Qw {
  constructor() {
    super(), this.domListeners = {}, this.on("error", al.error);
  }
  emit() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return al.log.call(al, ...e), super.emit(...e);
  }
  handleDOM(t) {
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
      n[i - 1] = arguments[i];
    (this.domListeners[t.type] || []).forEach((s) => {
      let {
        node: a,
        handler: o
      } = s;
      (t.target === a || a.contains(t.target)) && o(t, ...n);
    });
  }
  listenDOM(t, e, n) {
    this.domListeners[t] || (this.domListeners[t] = []), this.domListeners[t].push({
      node: e,
      handler: n
    });
  }
}
_(z, "events", {
  EDITOR_CHANGE: "editor-change",
  SCROLL_BEFORE_UPDATE: "scroll-before-update",
  SCROLL_BLOT_MOUNT: "scroll-blot-mount",
  SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount",
  SCROLL_OPTIMIZE: "scroll-optimize",
  SCROLL_UPDATE: "scroll-update",
  SCROLL_EMBED_UPDATE: "scroll-embed-update",
  SELECTION_CHANGE: "selection-change",
  TEXT_CHANGE: "text-change",
  COMPOSITION_BEFORE_START: "composition-before-start",
  COMPOSITION_START: "composition-start",
  COMPOSITION_BEFORE_END: "composition-before-end",
  COMPOSITION_END: "composition-end"
}), _(z, "sources", {
  API: "api",
  SILENT: "silent",
  USER: "user"
});
const ol = yn("quill:selection");
class rr {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = t, this.length = e;
  }
}
class Xw {
  constructor(t, e) {
    this.emitter = e, this.scroll = t, this.composing = !1, this.mouseDown = !1, this.root = this.scroll.domNode, this.cursor = this.scroll.create("cursor", this), this.savedRange = new rr(0, 0), this.lastRange = this.savedRange, this.lastNative = null, this.handleComposition(), this.handleDragging(), this.emitter.listenDOM("selectionchange", document, () => {
      !this.mouseDown && !this.composing && setTimeout(this.update.bind(this, z.sources.USER), 1);
    }), this.emitter.on(z.events.SCROLL_BEFORE_UPDATE, () => {
      if (!this.hasFocus()) return;
      const n = this.getNativeRange();
      n != null && n.start.node !== this.cursor.textNode && this.emitter.once(z.events.SCROLL_UPDATE, (i, s) => {
        try {
          this.root.contains(n.start.node) && this.root.contains(n.end.node) && this.setNativeRange(n.start.node, n.start.offset, n.end.node, n.end.offset);
          const a = s.some((o) => o.type === "characterData" || o.type === "childList" || o.type === "attributes" && o.target === this.root);
          this.update(a ? z.sources.SILENT : i);
        } catch {
        }
      });
    }), this.emitter.on(z.events.SCROLL_OPTIMIZE, (n, i) => {
      if (i.range) {
        const {
          startNode: s,
          startOffset: a,
          endNode: o,
          endOffset: l
        } = i.range;
        this.setNativeRange(s, a, o, l), this.update(z.sources.SILENT);
      }
    }), this.update(z.sources.SILENT);
  }
  handleComposition() {
    this.emitter.on(z.events.COMPOSITION_BEFORE_START, () => {
      this.composing = !0;
    }), this.emitter.on(z.events.COMPOSITION_END, () => {
      if (this.composing = !1, this.cursor.parent) {
        const t = this.cursor.restore();
        if (!t) return;
        setTimeout(() => {
          this.setNativeRange(t.startNode, t.startOffset, t.endNode, t.endOffset);
        }, 1);
      }
    });
  }
  handleDragging() {
    this.emitter.listenDOM("mousedown", document.body, () => {
      this.mouseDown = !0;
    }), this.emitter.listenDOM("mouseup", document.body, () => {
      this.mouseDown = !1, this.update(z.sources.USER);
    });
  }
  focus() {
    this.hasFocus() || (this.root.focus({
      preventScroll: !0
    }), this.setRange(this.savedRange));
  }
  format(t, e) {
    this.scroll.update();
    const n = this.getNativeRange();
    if (!(n == null || !n.native.collapsed || this.scroll.query(t, B.BLOCK))) {
      if (n.start.node !== this.cursor.textNode) {
        const i = this.scroll.find(n.start.node, !1);
        if (i == null) return;
        if (i instanceof qt) {
          const s = i.split(n.start.offset);
          i.parent.insertBefore(this.cursor, s);
        } else
          i.insertBefore(this.cursor, n.start.node);
        this.cursor.attach();
      }
      this.cursor.format(t, e), this.scroll.optimize(), this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length), this.update();
    }
  }
  getBounds(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const n = this.scroll.length();
    t = Math.min(t, n - 1), e = Math.min(t + e, n - 1) - t;
    let i, [s, a] = this.scroll.leaf(t);
    if (s == null) return null;
    if (e > 0 && a === s.length()) {
      const [u] = this.scroll.leaf(t + 1);
      if (u) {
        const [h] = this.scroll.line(t), [f] = this.scroll.line(t + 1);
        h === f && (s = u, a = 0);
      }
    }
    [i, a] = s.position(a, !0);
    const o = document.createRange();
    if (e > 0)
      return o.setStart(i, a), [s, a] = this.scroll.leaf(t + e), s == null ? null : ([i, a] = s.position(a, !0), o.setEnd(i, a), o.getBoundingClientRect());
    let l = "left", c;
    if (i instanceof Text) {
      if (!i.data.length)
        return null;
      a < i.data.length ? (o.setStart(i, a), o.setEnd(i, a + 1)) : (o.setStart(i, a - 1), o.setEnd(i, a), l = "right"), c = o.getBoundingClientRect();
    } else {
      if (!(s.domNode instanceof Element)) return null;
      c = s.domNode.getBoundingClientRect(), a > 0 && (l = "right");
    }
    return {
      bottom: c.top + c.height,
      height: c.height,
      left: c[l],
      right: c[l],
      top: c.top,
      width: 0
    };
  }
  getNativeRange() {
    const t = document.getSelection();
    if (t == null || t.rangeCount <= 0) return null;
    const e = t.getRangeAt(0);
    if (e == null) return null;
    const n = this.normalizeNative(e);
    return ol.info("getNativeRange", n), n;
  }
  getRange() {
    const t = this.scroll.domNode;
    if ("isConnected" in t && !t.isConnected)
      return [null, null];
    const e = this.getNativeRange();
    return e == null ? [null, null] : [this.normalizedToRange(e), e];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && ll(this.root, document.activeElement);
  }
  normalizedToRange(t) {
    const e = [[t.start.node, t.start.offset]];
    t.native.collapsed || e.push([t.end.node, t.end.offset]);
    const n = e.map((a) => {
      const [o, l] = a, c = this.scroll.find(o, !0), u = c.offset(this.scroll);
      return l === 0 ? u : c instanceof qt ? u + c.index(o, l) : u + c.length();
    }), i = Math.min(Math.max(...n), this.scroll.length() - 1), s = Math.min(i, ...n);
    return new rr(s, i - s);
  }
  normalizeNative(t) {
    if (!ll(this.root, t.startContainer) || !t.collapsed && !ll(this.root, t.endContainer))
      return null;
    const e = {
      start: {
        node: t.startContainer,
        offset: t.startOffset
      },
      end: {
        node: t.endContainer,
        offset: t.endOffset
      },
      native: t
    };
    return [e.start, e.end].forEach((n) => {
      let {
        node: i,
        offset: s
      } = n;
      for (; !(i instanceof Text) && i.childNodes.length > 0; )
        if (i.childNodes.length > s)
          i = i.childNodes[s], s = 0;
        else if (i.childNodes.length === s)
          i = i.lastChild, i instanceof Text ? s = i.data.length : i.childNodes.length > 0 ? s = i.childNodes.length : s = i.childNodes.length + 1;
        else
          break;
      n.node = i, n.offset = s;
    }), e;
  }
  rangeToNative(t) {
    const e = this.scroll.length(), n = (i, s) => {
      i = Math.min(e - 1, i);
      const [a, o] = this.scroll.leaf(i);
      return a ? a.position(o, s) : [null, -1];
    };
    return [...n(t.index, !1), ...n(t.index + t.length, !0)];
  }
  setNativeRange(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : t, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : e, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !1;
    if (ol.info("setNativeRange", t, e, n, i), t != null && (this.root.parentNode == null || t.parentNode == null || // @ts-expect-error Fix me later
    n.parentNode == null))
      return;
    const a = document.getSelection();
    if (a != null)
      if (t != null) {
        this.hasFocus() || this.root.focus({
          preventScroll: !0
        });
        const {
          native: o
        } = this.getNativeRange() || {};
        if (o == null || s || t !== o.startContainer || e !== o.startOffset || n !== o.endContainer || i !== o.endOffset) {
          t instanceof Element && t.tagName === "BR" && (e = Array.from(t.parentNode.childNodes).indexOf(t), t = t.parentNode), n instanceof Element && n.tagName === "BR" && (i = Array.from(n.parentNode.childNodes).indexOf(n), n = n.parentNode);
          const l = document.createRange();
          l.setStart(t, e), l.setEnd(n, i), a.removeAllRanges(), a.addRange(l);
        }
      } else
        a.removeAllRanges(), this.root.blur();
  }
  setRange(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : z.sources.API;
    if (typeof e == "string" && (n = e, e = !1), ol.info("setRange", t), t != null) {
      const i = this.rangeToNative(t);
      this.setNativeRange(...i, e);
    } else
      this.setNativeRange(null);
    this.update(n);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : z.sources.USER;
    const e = this.lastRange, [n, i] = this.getRange();
    if (this.lastRange = n, this.lastNative = i, this.lastRange != null && (this.savedRange = this.lastRange), !ru(e, this.lastRange)) {
      if (!this.composing && i != null && i.native.collapsed && i.start.node !== this.cursor.textNode) {
        const a = this.cursor.restore();
        a && this.setNativeRange(a.startNode, a.startOffset, a.endNode, a.endOffset);
      }
      const s = [z.events.SELECTION_CHANGE, zr(this.lastRange), zr(e), t];
      this.emitter.emit(z.events.EDITOR_CHANGE, ...s), t !== z.sources.SILENT && this.emitter.emit(...s);
    }
  }
}
function ll(r, t) {
  try {
    t.parentNode;
  } catch {
    return !1;
  }
  return r.contains(t);
}
const Jw = /^[ -~]*$/;
class tx {
  constructor(t) {
    this.scroll = t, this.delta = this.getDelta();
  }
  applyDelta(t) {
    this.scroll.update();
    let e = this.scroll.length();
    this.scroll.batchStart();
    const n = Rd(t), i = new P();
    return nx(n.ops.slice()).reduce((a, o) => {
      const l = ue.Op.length(o);
      let c = o.attributes || {}, u = !1, h = !1;
      if (o.insert != null) {
        if (i.retain(l), typeof o.insert == "string") {
          const m = o.insert;
          h = !m.endsWith(`
`) && (e <= a || !!this.scroll.descendant(ce, a)[0]), this.scroll.insertAt(a, m);
          const [y, w] = this.scroll.line(a);
          let v = Dn({}, ae(y));
          if (y instanceof Tt) {
            const [S] = y.descendant(qt, w);
            S && (v = Dn(v, ae(S)));
          }
          c = ue.AttributeMap.diff(v, c) || {};
        } else if (typeof o.insert == "object") {
          const m = Object.keys(o.insert)[0];
          if (m == null) return a;
          const y = this.scroll.query(m, B.INLINE) != null;
          if (y)
            (e <= a || this.scroll.descendant(ce, a)[0]) && (h = !0);
          else if (a > 0) {
            const [w, v] = this.scroll.descendant(qt, a - 1);
            w instanceof De ? w.value()[v] !== `
` && (u = !0) : w instanceof te && w.statics.scope === B.INLINE_BLOT && (u = !0);
          }
          if (this.scroll.insertAt(a, m, o.insert[m]), y) {
            const [w] = this.scroll.descendant(qt, a);
            if (w) {
              const v = Dn({}, ae(w));
              c = ue.AttributeMap.diff(v, c) || {};
            }
          }
        }
        e += l;
      } else if (i.push(o), o.retain !== null && typeof o.retain == "object") {
        const m = Object.keys(o.retain)[0];
        if (m == null) return a;
        this.scroll.updateEmbedAt(a, m, o.retain[m]);
      }
      Object.keys(c).forEach((m) => {
        this.scroll.formatAt(a, l, m, c[m]);
      });
      const f = u ? 1 : 0, p = h ? 1 : 0;
      return e += f + p, i.retain(f), i.delete(p), a + l + f + p;
    }, 0), i.reduce((a, o) => typeof o.delete == "number" ? (this.scroll.deleteAt(a, o.delete), a) : a + ue.Op.length(o), 0), this.scroll.batchEnd(), this.scroll.optimize(), this.update(n);
  }
  deleteText(t, e) {
    return this.scroll.deleteAt(t, e), this.update(new P().retain(t).delete(e));
  }
  formatLine(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.scroll.update(), Object.keys(n).forEach((s) => {
      this.scroll.lines(t, Math.max(e, 1)).forEach((a) => {
        a.format(s, n[s]);
      });
    }), this.scroll.optimize();
    const i = new P().retain(t).retain(e, zr(n));
    return this.update(i);
  }
  formatText(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(n).forEach((s) => {
      this.scroll.formatAt(t, e, s, n[s]);
    });
    const i = new P().retain(t).retain(e, zr(n));
    return this.update(i);
  }
  getContents(t, e) {
    return this.delta.slice(t, t + e);
  }
  getDelta() {
    return this.scroll.lines().reduce((t, e) => t.concat(e.delta()), new P());
  }
  getFormat(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = [], i = [];
    e === 0 ? this.scroll.path(t).forEach((o) => {
      const [l] = o;
      l instanceof Tt ? n.push(l) : l instanceof qt && i.push(l);
    }) : (n = this.scroll.lines(t, e), i = this.scroll.descendants(qt, t, e));
    const [s, a] = [n, i].map((o) => {
      const l = o.shift();
      if (l == null) return {};
      let c = ae(l);
      for (; Object.keys(c).length > 0; ) {
        const u = o.shift();
        if (u == null) return c;
        c = ex(ae(u), c);
      }
      return c;
    });
    return {
      ...s,
      ...a
    };
  }
  getHTML(t, e) {
    const [n, i] = this.scroll.line(t);
    if (n) {
      const s = n.length();
      return n.length() >= i + e && !(i === 0 && e === s) ? ss(n, i, e, !0) : ss(this.scroll, t, e, !0);
    }
    return "";
  }
  getText(t, e) {
    return this.getContents(t, e).filter((n) => typeof n.insert == "string").map((n) => n.insert).join("");
  }
  insertContents(t, e) {
    const n = Rd(e), i = new P().retain(t).concat(n);
    return this.scroll.insertContents(t, n), this.update(i);
  }
  insertEmbed(t, e, n) {
    return this.scroll.insertAt(t, e, n), this.update(new P().retain(t).insert({
      [e]: n
    }));
  }
  insertText(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return e = e.replace(/\r\n/g, `
`).replace(/\r/g, `
`), this.scroll.insertAt(t, e), Object.keys(n).forEach((i) => {
      this.scroll.formatAt(t, e.length, i, n[i]);
    }), this.update(new P().retain(t).insert(e, zr(n)));
  }
  isBlank() {
    if (this.scroll.children.length === 0) return !0;
    if (this.scroll.children.length > 1) return !1;
    const t = this.scroll.children.head;
    if ((t == null ? void 0 : t.statics.blotName) !== Tt.blotName) return !1;
    const e = t;
    return e.children.length > 1 ? !1 : e.children.head instanceof Me;
  }
  removeFormat(t, e) {
    const n = this.getText(t, e), [i, s] = this.scroll.line(t + e);
    let a = 0, o = new P();
    i != null && (a = i.length() - s, o = i.delta().slice(s, s + a - 1).insert(`
`));
    const c = this.getContents(t, e + a).diff(new P().insert(n).concat(o)), u = new P().retain(t).concat(c);
    return this.applyDelta(u);
  }
  update(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
    const i = this.delta;
    if (e.length === 1 && e[0].type === "characterData" && // @ts-expect-error Fix me later
    e[0].target.data.match(Jw) && this.scroll.find(e[0].target)) {
      const s = this.scroll.find(e[0].target), a = ae(s), o = s.offset(this.scroll), l = e[0].oldValue.replace(ni.CONTENTS, ""), c = new P().insert(l), u = new P().insert(s.value()), h = n && {
        oldRange: zd(n.oldRange, -o),
        newRange: zd(n.newRange, -o)
      };
      t = new P().retain(o).concat(c.diff(u, h)).reduce((p, m) => m.insert ? p.insert(m.insert, a) : p.push(m), new P()), this.delta = i.compose(t);
    } else
      this.delta = this.getDelta(), (!t || !ru(i.compose(t), this.delta)) && (t = i.diff(this.delta, n));
    return t;
  }
}
function Ir(r, t, e) {
  if (r.length === 0) {
    const [p] = cl(e.pop());
    return t <= 0 ? `</li></${p}>` : `</li></${p}>${Ir([], t - 1, e)}`;
  }
  const [{
    child: n,
    offset: i,
    length: s,
    indent: a,
    type: o
  }, ...l] = r, [c, u] = cl(o);
  if (a > t)
    return e.push(o), a === t + 1 ? `<${c}><li${u}>${ss(n, i, s)}${Ir(l, a, e)}` : `<${c}><li>${Ir(r, t + 1, e)}`;
  const h = e[e.length - 1];
  if (a === t && o === h)
    return `</li><li${u}>${ss(n, i, s)}${Ir(l, a, e)}`;
  const [f] = cl(e.pop());
  return `</li></${f}>${Ir(r, t - 1, e)}`;
}
function ss(r, t, e) {
  let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if ("html" in r && typeof r.html == "function")
    return r.html(t, e);
  if (r instanceof De)
    return Za(r.value().slice(t, t + e)).replaceAll(" ", "&nbsp;");
  if (r instanceof Ae) {
    if (r.statics.blotName === "list-container") {
      const c = [];
      return r.children.forEachAt(t, e, (u, h, f) => {
        const p = "formats" in u && typeof u.formats == "function" ? u.formats() : {};
        c.push({
          child: u,
          offset: h,
          length: f,
          indent: p.indent || 0,
          type: p.list
        });
      }), Ir(c, -1, []);
    }
    const i = [];
    if (r.children.forEachAt(t, e, (c, u, h) => {
      i.push(ss(c, u, h));
    }), n || r.statics.blotName === "list")
      return i.join("");
    const {
      outerHTML: s,
      innerHTML: a
    } = r.domNode, [o, l] = s.split(`>${a}<`);
    return o === "<table" ? `<table style="border: 1px solid #000;">${i.join("")}<${l}` : `${o}>${i.join("")}<${l}`;
  }
  return r.domNode instanceof Element ? r.domNode.outerHTML : "";
}
function ex(r, t) {
  return Object.keys(t).reduce((e, n) => {
    if (r[n] == null) return e;
    const i = t[n];
    return i === r[n] ? e[n] = i : Array.isArray(i) ? i.indexOf(r[n]) < 0 ? e[n] = i.concat([r[n]]) : e[n] = i : e[n] = [i, r[n]], e;
  }, {});
}
function cl(r) {
  const t = r === "ordered" ? "ol" : "ul";
  switch (r) {
    case "checked":
      return [t, ' data-list="checked"'];
    case "unchecked":
      return [t, ' data-list="unchecked"'];
    default:
      return [t, ""];
  }
}
function Rd(r) {
  return r.reduce((t, e) => {
    if (typeof e.insert == "string") {
      const n = e.insert.replace(/\r\n/g, `
`).replace(/\r/g, `
`);
      return t.insert(n, e.attributes);
    }
    return t.push(e);
  }, new P());
}
function zd(r, t) {
  let {
    index: e,
    length: n
  } = r;
  return new rr(e + t, n);
}
function nx(r) {
  const t = [];
  return r.forEach((e) => {
    typeof e.insert == "string" ? e.insert.split(`
`).forEach((i, s) => {
      s && t.push({
        insert: `
`,
        attributes: e.attributes
      }), i && t.push({
        insert: i,
        attributes: e.attributes
      });
    }) : t.push(e);
  }), t;
}
class qe {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = t, this.options = e;
  }
}
_(qe, "DEFAULTS", {});
const Ys = "\uFEFF";
class uu extends te {
  constructor(t, e) {
    super(t, e), this.contentNode = document.createElement("span"), this.contentNode.setAttribute("contenteditable", "false"), Array.from(this.domNode.childNodes).forEach((n) => {
      this.contentNode.appendChild(n);
    }), this.leftGuard = document.createTextNode(Ys), this.rightGuard = document.createTextNode(Ys), this.domNode.appendChild(this.leftGuard), this.domNode.appendChild(this.contentNode), this.domNode.appendChild(this.rightGuard);
  }
  index(t, e) {
    return t === this.leftGuard ? 0 : t === this.rightGuard ? 1 : super.index(t, e);
  }
  restore(t) {
    let e = null, n;
    const i = t.data.split(Ys).join("");
    if (t === this.leftGuard)
      if (this.prev instanceof De) {
        const s = this.prev.length();
        this.prev.insertAt(s, i), e = {
          startNode: this.prev.domNode,
          startOffset: s + i.length
        };
      } else
        n = document.createTextNode(i), this.parent.insertBefore(this.scroll.create(n), this), e = {
          startNode: n,
          startOffset: i.length
        };
    else t === this.rightGuard && (this.next instanceof De ? (this.next.insertAt(0, i), e = {
      startNode: this.next.domNode,
      startOffset: i.length
    }) : (n = document.createTextNode(i), this.parent.insertBefore(this.scroll.create(n), this.next), e = {
      startNode: n,
      startOffset: i.length
    }));
    return t.data = Ys, e;
  }
  update(t, e) {
    t.forEach((n) => {
      if (n.type === "characterData" && (n.target === this.leftGuard || n.target === this.rightGuard)) {
        const i = this.restore(n.target);
        i && (e.range = i);
      }
    });
  }
}
class rx {
  constructor(t, e) {
    _(this, "isComposing", !1);
    this.scroll = t, this.emitter = e, this.setupListeners();
  }
  setupListeners() {
    this.scroll.domNode.addEventListener("compositionstart", (t) => {
      this.isComposing || this.handleCompositionStart(t);
    }), this.scroll.domNode.addEventListener("compositionend", (t) => {
      this.isComposing && queueMicrotask(() => {
        this.handleCompositionEnd(t);
      });
    });
  }
  handleCompositionStart(t) {
    const e = t.target instanceof Node ? this.scroll.find(t.target, !0) : null;
    e && !(e instanceof uu) && (this.emitter.emit(z.events.COMPOSITION_BEFORE_START, t), this.scroll.batchStart(), this.emitter.emit(z.events.COMPOSITION_START, t), this.isComposing = !0);
  }
  handleCompositionEnd(t) {
    this.emitter.emit(z.events.COMPOSITION_BEFORE_END, t), this.scroll.batchEnd(), this.emitter.emit(z.events.COMPOSITION_END, t), this.isComposing = !1;
  }
}
const Qi = class Qi {
  constructor(t, e) {
    _(this, "modules", {});
    this.quill = t, this.options = e;
  }
  init() {
    Object.keys(this.options.modules).forEach((t) => {
      this.modules[t] == null && this.addModule(t);
    });
  }
  addModule(t) {
    const e = this.quill.constructor.import(`modules/${t}`);
    return this.modules[t] = new e(this.quill, this.options.modules[t] || {}), this.modules[t];
  }
};
_(Qi, "DEFAULTS", {
  modules: {}
}), _(Qi, "themes", {
  default: Qi
});
let ri = Qi;
const ix = (r) => r.parentElement || r.getRootNode().host || null, sx = (r) => {
  const t = r.getBoundingClientRect(), e = "offsetWidth" in r && Math.abs(t.width) / r.offsetWidth || 1, n = "offsetHeight" in r && Math.abs(t.height) / r.offsetHeight || 1;
  return {
    top: t.top,
    right: t.left + r.clientWidth * e,
    bottom: t.top + r.clientHeight * n,
    left: t.left
  };
}, Qs = (r) => {
  const t = parseInt(r, 10);
  return Number.isNaN(t) ? 0 : t;
}, Pd = (r, t, e, n, i, s) => r < e && t > n ? 0 : r < e ? -(e - r + i) : t > n ? t - r > n - e ? r + i - e : t - n + s : 0, ax = (r, t) => {
  var s, a, o;
  const e = r.ownerDocument;
  let n = t, i = r;
  for (; i; ) {
    const l = i === e.body, c = l ? {
      top: 0,
      right: ((s = window.visualViewport) == null ? void 0 : s.width) ?? e.documentElement.clientWidth,
      bottom: ((a = window.visualViewport) == null ? void 0 : a.height) ?? e.documentElement.clientHeight,
      left: 0
    } : sx(i), u = getComputedStyle(i), h = Pd(n.left, n.right, c.left, c.right, Qs(u.scrollPaddingLeft), Qs(u.scrollPaddingRight)), f = Pd(n.top, n.bottom, c.top, c.bottom, Qs(u.scrollPaddingTop), Qs(u.scrollPaddingBottom));
    if (h || f)
      if (l)
        (o = e.defaultView) == null || o.scrollBy(h, f);
      else {
        const {
          scrollLeft: p,
          scrollTop: m
        } = i;
        f && (i.scrollTop += f), h && (i.scrollLeft += h);
        const y = i.scrollLeft - p, w = i.scrollTop - m;
        n = {
          left: n.left - y,
          top: n.top - w,
          right: n.right - y,
          bottom: n.bottom - w
        };
      }
    i = l || u.position === "fixed" ? null : ix(i);
  }
}, ox = 100, lx = ["block", "break", "cursor", "inline", "scroll", "text"], cx = (r, t, e) => {
  const n = new ei();
  return lx.forEach((i) => {
    const s = t.query(i);
    s && n.register(s);
  }), r.forEach((i) => {
    let s = t.query(i);
    s || e.error(`Cannot register "${i}" specified in "formats" config. Are you sure it was registered?`);
    let a = 0;
    for (; s; )
      if (n.register(s), s = "blotName" in s ? s.requiredContainer ?? null : null, a += 1, a > ox) {
        e.error(`Cycle detected in registering blot requiredContainer: "${i}"`);
        break;
      }
  }), n;
}, Br = yn("quill"), Zs = new ei();
Ae.uiClass = "ql-ui";
const ye = class ye {
  static debug(t) {
    t === !0 && (t = "log"), yn.level(t);
  }
  static find(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    return rc.get(t) || Zs.find(t, e);
  }
  static import(t) {
    return this.imports[t] == null && Br.error(`Cannot import ${t}. Are you sure it was registered?`), this.imports[t];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) != "string") {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = !!(!(arguments.length <= 1) && arguments[1]), n = "attrName" in t ? t.attrName : t.blotName;
      typeof n == "string" ? this.register(`formats/${n}`, t, e) : Object.keys(t).forEach((i) => {
        this.register(i, t[i], e);
      });
    } else {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = arguments.length <= 1 ? void 0 : arguments[1], n = !!(!(arguments.length <= 2) && arguments[2]);
      this.imports[t] != null && !n && Br.warn(`Overwriting ${t} with`, e), this.imports[t] = e, (t.startsWith("blots/") || t.startsWith("formats/")) && e && typeof e != "boolean" && e.blotName !== "abstract" && Zs.register(e), typeof e.register == "function" && e.register(Zs);
    }
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.options = ux(t, e), this.container = this.options.container, this.container == null) {
      Br.error("Invalid Quill container", t);
      return;
    }
    this.options.debug && ye.debug(this.options.debug);
    const n = this.container.innerHTML.trim();
    this.container.classList.add("ql-container"), this.container.innerHTML = "", rc.set(this.container, this), this.root = this.addContainer("ql-editor"), this.root.classList.add("ql-blank"), this.emitter = new z();
    const i = su.blotName, s = this.options.registry.query(i);
    if (!s || !("blotName" in s))
      throw new Error(`Cannot initialize Quill without "${i}" blot`);
    if (this.scroll = new s(this.options.registry, this.root, {
      emitter: this.emitter
    }), this.editor = new tx(this.scroll), this.selection = new Xw(this.scroll, this.emitter), this.composition = new rx(this.scroll, this.emitter), this.theme = new this.options.theme(this, this.options), this.keyboard = this.theme.addModule("keyboard"), this.clipboard = this.theme.addModule("clipboard"), this.history = this.theme.addModule("history"), this.uploader = this.theme.addModule("uploader"), this.theme.addModule("input"), this.theme.addModule("uiNode"), this.theme.init(), this.emitter.on(z.events.EDITOR_CHANGE, (a) => {
      a === z.events.TEXT_CHANGE && this.root.classList.toggle("ql-blank", this.editor.isBlank());
    }), this.emitter.on(z.events.SCROLL_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), u = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      be.call(this, () => this.editor.update(null, o, u), a);
    }), this.emitter.on(z.events.SCROLL_EMBED_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), u = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      be.call(this, () => {
        const h = new P().retain(a.offset(this)).retain({
          [a.statics.blotName]: o
        });
        return this.editor.update(h, [], u);
      }, ye.sources.USER);
    }), n) {
      const a = this.clipboard.convert({
        html: `${n}<p><br></p>`,
        text: `
`
      });
      this.setContents(a);
    }
    this.history.clear(), this.options.placeholder && this.root.setAttribute("data-placeholder", this.options.placeholder), this.options.readOnly && this.disable(), this.allowReadOnlyEdits = !1;
  }
  addContainer(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (typeof t == "string") {
      const n = t;
      t = document.createElement("div"), t.classList.add(n);
    }
    return this.container.insertBefore(t, e), t;
  }
  blur() {
    this.selection.setRange(null);
  }
  deleteText(t, e, n) {
    return [t, e, , n] = dn(t, e, n), be.call(this, () => this.editor.deleteText(t, e), n, t, -1 * e);
  }
  disable() {
    this.enable(!1);
  }
  editReadOnly(t) {
    this.allowReadOnlyEdits = !0;
    const e = t();
    return this.allowReadOnlyEdits = !1, e;
  }
  enable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    this.scroll.enable(t), this.container.classList.toggle("ql-disabled", !t);
  }
  focus() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.selection.focus(), t.preventScroll || this.scrollSelectionIntoView();
  }
  format(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : z.sources.API;
    return be.call(this, () => {
      const i = this.getSelection(!0);
      let s = new P();
      if (i == null) return s;
      if (this.scroll.query(t, B.BLOCK))
        s = this.editor.formatLine(i.index, i.length, {
          [t]: e
        });
      else {
        if (i.length === 0)
          return this.selection.format(t, e), s;
        s = this.editor.formatText(i.index, i.length, {
          [t]: e
        });
      }
      return this.setSelection(i, z.sources.SILENT), s;
    }, n);
  }
  formatLine(t, e, n, i, s) {
    let a;
    return [t, e, a, s] = dn(
      t,
      e,
      // @ts-expect-error
      n,
      i,
      s
    ), be.call(this, () => this.editor.formatLine(t, e, a), s, t, 0);
  }
  formatText(t, e, n, i, s) {
    let a;
    return [t, e, a, s] = dn(
      // @ts-expect-error
      t,
      e,
      n,
      i,
      s
    ), be.call(this, () => this.editor.formatText(t, e, a), s, t, 0);
  }
  getBounds(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = null;
    if (typeof t == "number" ? n = this.selection.getBounds(t, e) : n = this.selection.getBounds(t.index, t.length), !n) return null;
    const i = this.container.getBoundingClientRect();
    return {
      bottom: n.bottom - i.top,
      height: n.height,
      left: n.left - i.left,
      right: n.right - i.left,
      top: n.top - i.top,
      width: n.width
    };
  }
  getContents() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - t;
    return [t, e] = dn(t, e), this.editor.getContents(t, e);
  }
  getFormat() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(!0), e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return typeof t == "number" ? this.editor.getFormat(t, e) : this.editor.getFormat(t.index, t.length);
  }
  getIndex(t) {
    return t.offset(this.scroll);
  }
  getLength() {
    return this.scroll.length();
  }
  getLeaf(t) {
    return this.scroll.leaf(t);
  }
  getLine(t) {
    return this.scroll.line(t);
  }
  getLines() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    return typeof t != "number" ? this.scroll.lines(t.index, t.length) : this.scroll.lines(t, e);
  }
  getModule(t) {
    return this.theme.modules[t];
  }
  getSelection() {
    return (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1) && this.focus(), this.update(), this.selection.getRange()[0];
  }
  getSemanticHTML() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 ? arguments[1] : void 0;
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = dn(t, e), this.editor.getHTML(t, e);
  }
  getText() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 ? arguments[1] : void 0;
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = dn(t, e), this.editor.getText(t, e);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(t, e, n) {
    let i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ye.sources.API;
    return be.call(this, () => this.editor.insertEmbed(t, e, n), i, t);
  }
  insertText(t, e, n, i, s) {
    let a;
    return [t, , a, s] = dn(t, 0, n, i, s), be.call(this, () => this.editor.insertText(t, e, a), s, t, e.length);
  }
  isEnabled() {
    return this.scroll.isEnabled();
  }
  off() {
    return this.emitter.off(...arguments);
  }
  on() {
    return this.emitter.on(...arguments);
  }
  once() {
    return this.emitter.once(...arguments);
  }
  removeFormat(t, e, n) {
    return [t, e, , n] = dn(t, e, n), be.call(this, () => this.editor.removeFormat(t, e), n, t);
  }
  scrollRectIntoView(t) {
    ax(this.root, t);
  }
  /**
   * @deprecated Use Quill#scrollSelectionIntoView() instead.
   */
  scrollIntoView() {
    console.warn("Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead."), this.scrollSelectionIntoView();
  }
  /**
   * Scroll the current selection into the visible area.
   * If the selection is already visible, no scrolling will occur.
   */
  scrollSelectionIntoView() {
    const t = this.selection.lastRange, e = t && this.selection.getBounds(t.index, t.length);
    e && this.scrollRectIntoView(e);
  }
  setContents(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : z.sources.API;
    return be.call(this, () => {
      t = new P(t);
      const n = this.getLength(), i = this.editor.deleteText(0, n), s = this.editor.insertContents(0, t), a = this.editor.deleteText(this.getLength() - 1, 1);
      return i.compose(s).compose(a);
    }, e);
  }
  setSelection(t, e, n) {
    t == null ? this.selection.setRange(null, e || ye.sources.API) : ([t, e, , n] = dn(t, e, n), this.selection.setRange(new rr(Math.max(0, t), e), n), n !== z.sources.SILENT && this.scrollSelectionIntoView());
  }
  setText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : z.sources.API;
    const n = new P().insert(t);
    return this.setContents(n, e);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : z.sources.USER;
    const e = this.scroll.update(t);
    return this.selection.update(t), e;
  }
  updateContents(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : z.sources.API;
    return be.call(this, () => (t = new P(t), this.editor.applyDelta(t)), e, !0);
  }
};
_(ye, "DEFAULTS", {
  bounds: null,
  modules: {
    clipboard: !0,
    keyboard: !0,
    history: !0,
    uploader: !0
  },
  placeholder: "",
  readOnly: !1,
  registry: Zs,
  theme: "default"
}), _(ye, "events", z.events), _(ye, "sources", z.sources), _(ye, "version", "2.0.3"), _(ye, "imports", {
  delta: P,
  parchment: qw,
  "core/module": qe,
  "core/theme": ri
});
let O = ye;
function Bd(r) {
  return typeof r == "string" ? document.querySelector(r) : r;
}
function ul(r) {
  return Object.entries(r ?? {}).reduce((t, e) => {
    let [n, i] = e;
    return {
      ...t,
      [n]: i === !0 ? {} : i
    };
  }, {});
}
function $d(r) {
  return Object.fromEntries(Object.entries(r).filter((t) => t[1] !== void 0));
}
function ux(r, t) {
  const e = Bd(r);
  if (!e)
    throw new Error("Invalid Quill container");
  const i = !t.theme || t.theme === O.DEFAULTS.theme ? ri : O.import(`themes/${t.theme}`);
  if (!i)
    throw new Error(`Invalid theme ${t.theme}. Did you register it?`);
  const {
    modules: s,
    ...a
  } = O.DEFAULTS, {
    modules: o,
    ...l
  } = i.DEFAULTS;
  let c = ul(t.modules);
  c != null && c.toolbar && c.toolbar.constructor !== Object && (c = {
    ...c,
    toolbar: {
      container: c.toolbar
    }
  });
  const u = Dn({}, ul(s), ul(o), c), h = {
    ...a,
    ...$d(l),
    ...$d(t)
  };
  let f = t.registry;
  return f ? t.formats && Br.warn('Ignoring "formats" option because "registry" is specified') : f = t.formats ? cx(t.formats, h.registry, Br) : h.registry, {
    ...h,
    registry: f,
    container: e,
    theme: i,
    modules: Object.entries(u).reduce((p, m) => {
      let [y, w] = m;
      if (!w) return p;
      const v = O.import(`modules/${y}`);
      return v == null ? (Br.error(`Cannot load ${y} module. Are you sure you registered it?`), p) : {
        ...p,
        // @ts-expect-error
        [y]: Dn({}, v.DEFAULTS || {}, w)
      };
    }, {}),
    bounds: Bd(h.bounds)
  };
}
function be(r, t, e, n) {
  if (!this.isEnabled() && t === z.sources.USER && !this.allowReadOnlyEdits)
    return new P();
  let i = e == null ? null : this.getSelection();
  const s = this.editor.delta, a = r();
  if (i != null && (e === !0 && (e = i.index), n == null ? i = jd(i, a, t) : n !== 0 && (i = jd(i, e, n, t)), this.setSelection(i, z.sources.SILENT)), a.length() > 0) {
    const o = [z.events.TEXT_CHANGE, a, s, t];
    this.emitter.emit(z.events.EDITOR_CHANGE, ...o), t !== z.sources.SILENT && this.emitter.emit(...o);
  }
  return a;
}
function dn(r, t, e, n, i) {
  let s = {};
  return typeof r.index == "number" && typeof r.length == "number" ? typeof t != "number" ? (i = n, n = e, e = t, t = r.length, r = r.index) : (t = r.length, r = r.index) : typeof t != "number" && (i = n, n = e, e = t, t = 0), typeof e == "object" ? (s = e, i = n) : typeof e == "string" && (n != null ? s[e] = n : i = e), i = i || z.sources.API, [r, t, s, i];
}
function jd(r, t, e, n) {
  const i = typeof e == "number" ? e : 0;
  if (r == null) return null;
  let s, a;
  return t && typeof t.transformPosition == "function" ? [s, a] = [r.index, r.index + r.length].map((o) => (
    // @ts-expect-error -- TODO: add a better type guard around `index`
    t.transformPosition(o, n !== z.sources.USER)
  )) : [s, a] = [r.index, r.index + r.length].map((o) => o < t || o === t && n === z.sources.USER ? o : i >= 0 ? o + i : Math.max(t, o + i)), new rr(s, a - s);
}
class cr extends Wa {
}
function Fd(r) {
  return r instanceof Tt || r instanceof ce;
}
function Hd(r) {
  return typeof r.updateContent == "function";
}
class Nr extends su {
  constructor(t, e, n) {
    let {
      emitter: i
    } = n;
    super(t, e), this.emitter = i, this.batch = !1, this.optimize(), this.enable(), this.domNode.addEventListener("dragstart", (s) => this.handleDragStart(s));
  }
  batchStart() {
    Array.isArray(this.batch) || (this.batch = []);
  }
  batchEnd() {
    if (!this.batch) return;
    const t = this.batch;
    this.batch = !1, this.update(t);
  }
  emitMount(t) {
    this.emitter.emit(z.events.SCROLL_BLOT_MOUNT, t);
  }
  emitUnmount(t) {
    this.emitter.emit(z.events.SCROLL_BLOT_UNMOUNT, t);
  }
  emitEmbedUpdate(t, e) {
    this.emitter.emit(z.events.SCROLL_EMBED_UPDATE, t, e);
  }
  deleteAt(t, e) {
    const [n, i] = this.line(t), [s] = this.line(t + e);
    if (super.deleteAt(t, e), s != null && n !== s && i > 0) {
      if (n instanceof ce || s instanceof ce) {
        this.optimize();
        return;
      }
      const a = s.children.head instanceof Me ? null : s.children.head;
      n.moveChildren(s, a), n.remove();
    }
    this.optimize();
  }
  enable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    this.domNode.setAttribute("contenteditable", t ? "true" : "false");
  }
  formatAt(t, e, n, i) {
    super.formatAt(t, e, n, i), this.optimize();
  }
  insertAt(t, e, n) {
    if (t >= this.length())
      if (n == null || this.scroll.query(e, B.BLOCK) == null) {
        const i = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(i), n == null && e.endsWith(`
`) ? i.insertAt(0, e.slice(0, -1), n) : i.insertAt(0, e, n);
      } else {
        const i = this.scroll.create(e, n);
        this.appendChild(i);
      }
    else
      super.insertAt(t, e, n);
    this.optimize();
  }
  insertBefore(t, e) {
    if (t.statics.scope === B.INLINE_BLOT) {
      const n = this.scroll.create(this.statics.defaultChild.blotName);
      n.appendChild(t), super.insertBefore(n, e);
    } else
      super.insertBefore(t, e);
  }
  insertContents(t, e) {
    const n = this.deltaToRenderBlocks(e.concat(new P().insert(`
`))), i = n.pop();
    if (i == null) return;
    this.batchStart();
    const s = n.shift();
    if (s) {
      const l = s.type === "block" && (s.delta.length() === 0 || !this.descendant(ce, t)[0] && t < this.length()), c = s.type === "block" ? s.delta : new P().insert({
        [s.key]: s.value
      });
      dl(this, t, c);
      const u = s.type === "block" ? 1 : 0, h = t + c.length() + u;
      l && this.insertAt(h - 1, `
`);
      const f = ae(this.line(t)[0]), p = ue.AttributeMap.diff(f, s.attributes) || {};
      Object.keys(p).forEach((m) => {
        this.formatAt(h - 1, 1, m, p[m]);
      }), t = h;
    }
    let [a, o] = this.children.find(t);
    if (n.length && (a && (a = a.split(o), o = 0), n.forEach((l) => {
      if (l.type === "block") {
        const c = this.createBlock(l.attributes, a || void 0);
        dl(c, 0, l.delta);
      } else {
        const c = this.create(l.key, l.value);
        this.insertBefore(c, a || void 0), Object.keys(l.attributes).forEach((u) => {
          c.format(u, l.attributes[u]);
        });
      }
    })), i.type === "block" && i.delta.length()) {
      const l = a ? a.offset(a.scroll) + o : this.length();
      dl(this, l, i.delta);
    }
    this.batchEnd(), this.optimize();
  }
  isEnabled() {
    return this.domNode.getAttribute("contenteditable") === "true";
  }
  leaf(t) {
    const e = this.path(t).pop();
    if (!e)
      return [null, -1];
    const [n, i] = e;
    return n instanceof qt ? [n, i] : [null, -1];
  }
  line(t) {
    return t === this.length() ? this.line(t - 1) : this.descendant(Fd, t);
  }
  lines() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const n = (i, s, a) => {
      let o = [], l = a;
      return i.children.forEachAt(s, a, (c, u, h) => {
        Fd(c) ? o.push(c) : c instanceof Wa && (o = o.concat(n(c, u, l))), l -= h;
      }), o;
    };
    return n(this, t, e);
  }
  optimize() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.batch || (super.optimize(t, e), t.length > 0 && this.emitter.emit(z.events.SCROLL_OPTIMIZE, t, e));
  }
  path(t) {
    return super.path(t).slice(1);
  }
  remove() {
  }
  update(t) {
    if (this.batch) {
      Array.isArray(t) && (this.batch = this.batch.concat(t));
      return;
    }
    let e = z.sources.USER;
    typeof t == "string" && (e = t), Array.isArray(t) || (t = this.observer.takeRecords()), t = t.filter((n) => {
      let {
        target: i
      } = n;
      const s = this.find(i, !0);
      return s && !Hd(s);
    }), t.length > 0 && this.emitter.emit(z.events.SCROLL_BEFORE_UPDATE, e, t), super.update(t.concat([])), t.length > 0 && this.emitter.emit(z.events.SCROLL_UPDATE, e, t);
  }
  updateEmbedAt(t, e, n) {
    const [i] = this.descendant((s) => s instanceof ce, t);
    i && i.statics.blotName === e && Hd(i) && i.updateContent(n);
  }
  handleDragStart(t) {
    t.preventDefault();
  }
  deltaToRenderBlocks(t) {
    const e = [];
    let n = new P();
    return t.forEach((i) => {
      const s = i == null ? void 0 : i.insert;
      if (s)
        if (typeof s == "string") {
          const a = s.split(`
`);
          a.slice(0, -1).forEach((l) => {
            n.insert(l, i.attributes), e.push({
              type: "block",
              delta: n,
              attributes: i.attributes ?? {}
            }), n = new P();
          });
          const o = a[a.length - 1];
          o && n.insert(o, i.attributes);
        } else {
          const a = Object.keys(s)[0];
          if (!a) return;
          this.query(a, B.INLINE) ? n.push(i) : (n.length() && e.push({
            type: "block",
            delta: n,
            attributes: {}
          }), n = new P(), e.push({
            type: "blockEmbed",
            key: a,
            value: s[a],
            attributes: i.attributes ?? {}
          }));
        }
    }), n.length() && e.push({
      type: "block",
      delta: n,
      attributes: {}
    }), e;
  }
  createBlock(t, e) {
    let n;
    const i = {};
    Object.entries(t).forEach((o) => {
      let [l, c] = o;
      this.query(l, B.BLOCK & B.BLOT) != null ? n = l : i[l] = c;
    });
    const s = this.create(n || this.statics.defaultChild.blotName, n ? t[n] : void 0);
    this.insertBefore(s, e || void 0);
    const a = s.length();
    return Object.entries(i).forEach((o) => {
      let [l, c] = o;
      s.formatAt(0, a, l, c);
    }), s;
  }
}
_(Nr, "blotName", "scroll"), _(Nr, "className", "ql-editor"), _(Nr, "tagName", "DIV"), _(Nr, "defaultChild", Tt), _(Nr, "allowedChildren", [Tt, ce, cr]);
function dl(r, t, e) {
  e.reduce((n, i) => {
    const s = ue.Op.length(i);
    let a = i.attributes || {};
    if (i.insert != null) {
      if (typeof i.insert == "string") {
        const o = i.insert;
        r.insertAt(n, o);
        const [l] = r.descendant(qt, n), c = ae(l);
        a = ue.AttributeMap.diff(c, a) || {};
      } else if (typeof i.insert == "object") {
        const o = Object.keys(i.insert)[0];
        if (o == null) return n;
        if (r.insertAt(n, o, i.insert[o]), r.scroll.query(o, B.INLINE) != null) {
          const [c] = r.descendant(qt, n), u = ae(c);
          a = ue.AttributeMap.diff(u, a) || {};
        }
      }
    }
    return Object.keys(a).forEach((o) => {
      r.formatAt(n, s, o, a[o]);
    }), n + s;
  }, t);
}
const du = {
  scope: B.BLOCK,
  whitelist: ["right", "center", "justify"]
}, dx = new Ze("align", "align", du), Sp = new Ne("align", "ql-align", du), kp = new zn("align", "text-align", du);
class Ap extends zn {
  value(t) {
    let e = super.value(t);
    return e.startsWith("rgb(") ? (e = e.replace(/^[^\d]+/, "").replace(/[^\d]+$/, ""), `#${e.split(",").map((i) => `00${parseInt(i, 10).toString(16)}`.slice(-2)).join("")}`) : e;
  }
}
const hx = new Ne("color", "ql-color", {
  scope: B.INLINE
}), hu = new Ap("color", "color", {
  scope: B.INLINE
}), fx = new Ne("background", "ql-bg", {
  scope: B.INLINE
}), fu = new Ap("background", "background-color", {
  scope: B.INLINE
});
class ur extends cr {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("spellcheck", "false"), e;
  }
  code(t, e) {
    return this.children.map((n) => n.length() <= 1 ? "" : n.domNode.innerText).join(`
`).slice(t, t + e);
  }
  html(t, e) {
    return `<pre>
${Za(this.code(t, e))}
</pre>`;
  }
}
class _t extends Tt {
  static register() {
    O.register(ur);
  }
}
_(_t, "TAB", "  ");
class pu extends Xe {
}
pu.blotName = "code";
pu.tagName = "CODE";
_t.blotName = "code-block";
_t.className = "ql-code-block";
_t.tagName = "DIV";
ur.blotName = "code-block-container";
ur.className = "ql-code-block-container";
ur.tagName = "DIV";
ur.allowedChildren = [_t];
_t.allowedChildren = [De, Me, ni];
_t.requiredContainer = ur;
const gu = {
  scope: B.BLOCK,
  whitelist: ["rtl"]
}, Ep = new Ze("direction", "dir", gu), Cp = new Ne("direction", "ql-direction", gu), Tp = new zn("direction", "direction", gu), Lp = {
  scope: B.INLINE,
  whitelist: ["serif", "monospace"]
}, Dp = new Ne("font", "ql-font", Lp);
class px extends zn {
  value(t) {
    return super.value(t).replace(/["']/g, "");
  }
}
const Op = new px("font", "font-family", Lp), Ip = new Ne("size", "ql-size", {
  scope: B.INLINE,
  whitelist: ["small", "large", "huge"]
}), Np = new zn("size", "font-size", {
  scope: B.INLINE,
  whitelist: ["10px", "18px", "32px"]
}), gx = yn("quill:keyboard"), mx = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
class Xa extends qe {
  static match(t, e) {
    return ["altKey", "ctrlKey", "metaKey", "shiftKey"].some((n) => !!e[n] !== t[n] && e[n] !== null) ? !1 : e.key === t.key || e.key === t.which;
  }
  constructor(t, e) {
    super(t, e), this.bindings = {}, Object.keys(this.options.bindings).forEach((n) => {
      this.options.bindings[n] && this.addBinding(this.options.bindings[n]);
    }), this.addBinding({
      key: "Enter",
      shiftKey: null
    }, this.handleEnter), this.addBinding({
      key: "Enter",
      metaKey: null,
      ctrlKey: null,
      altKey: null
    }, () => {
    }), /Firefox/i.test(navigator.userAgent) ? (this.addBinding({
      key: "Backspace"
    }, {
      collapsed: !0
    }, this.handleBackspace), this.addBinding({
      key: "Delete"
    }, {
      collapsed: !0
    }, this.handleDelete)) : (this.addBinding({
      key: "Backspace"
    }, {
      collapsed: !0,
      prefix: /^.?$/
    }, this.handleBackspace), this.addBinding({
      key: "Delete"
    }, {
      collapsed: !0,
      suffix: /^.?$/
    }, this.handleDelete)), this.addBinding({
      key: "Backspace"
    }, {
      collapsed: !1
    }, this.handleDeleteRange), this.addBinding({
      key: "Delete"
    }, {
      collapsed: !1
    }, this.handleDeleteRange), this.addBinding({
      key: "Backspace",
      altKey: null,
      ctrlKey: null,
      metaKey: null,
      shiftKey: null
    }, {
      collapsed: !0,
      offset: 0
    }, this.handleBackspace), this.listen();
  }
  addBinding(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const i = yx(t);
    if (i == null) {
      gx.warn("Attempted to add invalid keyboard binding", i);
      return;
    }
    typeof e == "function" && (e = {
      handler: e
    }), typeof n == "function" && (n = {
      handler: n
    }), (Array.isArray(i.key) ? i.key : [i.key]).forEach((a) => {
      const o = {
        ...i,
        key: a,
        ...e,
        ...n
      };
      this.bindings[o.key] = this.bindings[o.key] || [], this.bindings[o.key].push(o);
    });
  }
  listen() {
    this.quill.root.addEventListener("keydown", (t) => {
      if (t.defaultPrevented || t.isComposing || t.keyCode === 229 && (t.key === "Enter" || t.key === "Backspace")) return;
      const i = (this.bindings[t.key] || []).concat(this.bindings[t.which] || []).filter((v) => Xa.match(t, v));
      if (i.length === 0) return;
      const s = O.find(t.target, !0);
      if (s && s.scroll !== this.quill.scroll) return;
      const a = this.quill.getSelection();
      if (a == null || !this.quill.hasFocus()) return;
      const [o, l] = this.quill.getLine(a.index), [c, u] = this.quill.getLeaf(a.index), [h, f] = a.length === 0 ? [c, u] : this.quill.getLeaf(a.index + a.length), p = c instanceof Aa ? c.value().slice(0, u) : "", m = h instanceof Aa ? h.value().slice(f) : "", y = {
        collapsed: a.length === 0,
        // @ts-expect-error Fix me later
        empty: a.length === 0 && o.length() <= 1,
        format: this.quill.getFormat(a),
        line: o,
        offset: l,
        prefix: p,
        suffix: m,
        event: t
      };
      i.some((v) => {
        if (v.collapsed != null && v.collapsed !== y.collapsed || v.empty != null && v.empty !== y.empty || v.offset != null && v.offset !== y.offset)
          return !1;
        if (Array.isArray(v.format)) {
          if (v.format.every((S) => y.format[S] == null))
            return !1;
        } else if (typeof v.format == "object" && !Object.keys(v.format).every((S) => v.format[S] === !0 ? y.format[S] != null : v.format[S] === !1 ? y.format[S] == null : ru(v.format[S], y.format[S])))
          return !1;
        return v.prefix != null && !v.prefix.test(y.prefix) || v.suffix != null && !v.suffix.test(y.suffix) ? !1 : v.handler.call(this, a, y, v) !== !0;
      }) && t.preventDefault();
    });
  }
  handleBackspace(t, e) {
    const n = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(e.prefix) ? 2 : 1;
    if (t.index === 0 || this.quill.getLength() <= 1) return;
    let i = {};
    const [s] = this.quill.getLine(t.index);
    let a = new P().retain(t.index - n).delete(n);
    if (e.offset === 0) {
      const [o] = this.quill.getLine(t.index - 1);
      if (o && !(o.statics.blotName === "block" && o.length() <= 1)) {
        const c = s.formats(), u = this.quill.getFormat(t.index - 1, 1);
        if (i = ue.AttributeMap.diff(c, u) || {}, Object.keys(i).length > 0) {
          const h = new P().retain(t.index + s.length() - 2).retain(1, i);
          a = a.compose(h);
        }
      }
    }
    this.quill.updateContents(a, O.sources.USER), this.quill.focus();
  }
  handleDelete(t, e) {
    const n = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(e.suffix) ? 2 : 1;
    if (t.index >= this.quill.getLength() - n) return;
    let i = {};
    const [s] = this.quill.getLine(t.index);
    let a = new P().retain(t.index).delete(n);
    if (e.offset >= s.length() - 1) {
      const [o] = this.quill.getLine(t.index + 1);
      if (o) {
        const l = s.formats(), c = this.quill.getFormat(t.index, 1);
        i = ue.AttributeMap.diff(l, c) || {}, Object.keys(i).length > 0 && (a = a.retain(o.length() - 1).retain(1, i));
      }
    }
    this.quill.updateContents(a, O.sources.USER), this.quill.focus();
  }
  handleDeleteRange(t) {
    mu({
      range: t,
      quill: this.quill
    }), this.quill.focus();
  }
  handleEnter(t, e) {
    const n = Object.keys(e.format).reduce((s, a) => (this.quill.scroll.query(a, B.BLOCK) && !Array.isArray(e.format[a]) && (s[a] = e.format[a]), s), {}), i = new P().retain(t.index).delete(t.length).insert(`
`, n);
    this.quill.updateContents(i, O.sources.USER), this.quill.setSelection(t.index + 1, O.sources.SILENT), this.quill.focus();
  }
}
const bx = {
  bindings: {
    bold: hl("bold"),
    italic: hl("italic"),
    underline: hl("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "+1", O.sources.USER), !1);
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: !0,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "-1", O.sources.USER), !1);
      }
    },
    "outdent backspace": {
      key: "Backspace",
      collapsed: !0,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ["indent", "list"],
      offset: 0,
      handler(r, t) {
        t.format.indent != null ? this.quill.format("indent", "-1", O.sources.USER) : t.format.list != null && this.quill.format("list", !1, O.sources.USER);
      }
    },
    "indent code-block": Ud(!0),
    "outdent code-block": Ud(!1),
    "remove tab": {
      key: "Tab",
      shiftKey: !0,
      collapsed: !0,
      prefix: /\t$/,
      handler(r) {
        this.quill.deleteText(r.index - 1, 1, O.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(r, t) {
        if (t.format.table) return !0;
        this.quill.history.cutoff();
        const e = new P().retain(r.index).delete(r.length).insert("	");
        return this.quill.updateContents(e, O.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index + 1, O.sources.SILENT), !1;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: !0,
      format: ["blockquote"],
      empty: !0,
      handler() {
        this.quill.format("blockquote", !1, O.sources.USER);
      }
    },
    "list empty enter": {
      key: "Enter",
      collapsed: !0,
      format: ["list"],
      empty: !0,
      handler(r, t) {
        const e = {
          list: !1
        };
        t.format.indent && (e.indent = !1), this.quill.formatLine(r.index, r.length, e, O.sources.USER);
      }
    },
    "checklist enter": {
      key: "Enter",
      collapsed: !0,
      format: {
        list: "checked"
      },
      handler(r) {
        const [t, e] = this.quill.getLine(r.index), n = {
          // @ts-expect-error Fix me later
          ...t.formats(),
          list: "checked"
        }, i = new P().retain(r.index).insert(`
`, n).retain(t.length() - e - 1).retain(1, {
          list: "unchecked"
        });
        this.quill.updateContents(i, O.sources.USER), this.quill.setSelection(r.index + 1, O.sources.SILENT), this.quill.scrollSelectionIntoView();
      }
    },
    "header enter": {
      key: "Enter",
      collapsed: !0,
      format: ["header"],
      suffix: /^$/,
      handler(r, t) {
        const [e, n] = this.quill.getLine(r.index), i = new P().retain(r.index).insert(`
`, t.format).retain(e.length() - n - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(i, O.sources.USER), this.quill.setSelection(r.index + 1, O.sources.SILENT), this.quill.scrollSelectionIntoView();
      }
    },
    "table backspace": {
      key: "Backspace",
      format: ["table"],
      collapsed: !0,
      offset: 0,
      handler() {
      }
    },
    "table delete": {
      key: "Delete",
      format: ["table"],
      collapsed: !0,
      suffix: /^$/,
      handler() {
      }
    },
    "table enter": {
      key: "Enter",
      shiftKey: null,
      format: ["table"],
      handler(r) {
        const t = this.quill.getModule("table");
        if (t) {
          const [e, n, i, s] = t.getTable(r), a = vx(e, n, i, s);
          if (a == null) return;
          let o = e.offset();
          if (a < 0) {
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, O.sources.USER), this.quill.setSelection(r.index + 1, r.length, O.sources.SILENT);
          } else if (a > 0) {
            o += e.length();
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, O.sources.USER), this.quill.setSelection(o, O.sources.USER);
          }
        }
      }
    },
    "table tab": {
      key: "Tab",
      shiftKey: null,
      format: ["table"],
      handler(r, t) {
        const {
          event: e,
          line: n
        } = t, i = n.offset(this.quill.scroll);
        e.shiftKey ? this.quill.setSelection(i - 1, O.sources.USER) : this.quill.setSelection(i + n.length(), O.sources.USER);
      }
    },
    "list autofill": {
      key: " ",
      shiftKey: null,
      collapsed: !0,
      format: {
        "code-block": !1,
        blockquote: !1,
        table: !1
      },
      prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
      handler(r, t) {
        if (this.quill.scroll.query("list") == null) return !0;
        const {
          length: e
        } = t.prefix, [n, i] = this.quill.getLine(r.index);
        if (i > e) return !0;
        let s;
        switch (t.prefix.trim()) {
          case "[]":
          case "[ ]":
            s = "unchecked";
            break;
          case "[x]":
            s = "checked";
            break;
          case "-":
          case "*":
            s = "bullet";
            break;
          default:
            s = "ordered";
        }
        this.quill.insertText(r.index, " ", O.sources.USER), this.quill.history.cutoff();
        const a = new P().retain(r.index - i).delete(e + 1).retain(n.length() - 2 - i).retain(1, {
          list: s
        });
        return this.quill.updateContents(a, O.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index - e, O.sources.SILENT), !1;
      }
    },
    "code exit": {
      key: "Enter",
      collapsed: !0,
      format: ["code-block"],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler(r) {
        const [t, e] = this.quill.getLine(r.index);
        let n = 2, i = t;
        for (; i != null && i.length() <= 1 && i.formats()["code-block"]; )
          if (i = i.prev, n -= 1, n <= 0) {
            const s = new P().retain(r.index + t.length() - e - 2).retain(1, {
              "code-block": null
            }).delete(1);
            return this.quill.updateContents(s, O.sources.USER), this.quill.setSelection(r.index - 1, O.sources.SILENT), !1;
          }
        return !0;
      }
    },
    "embed left": Xs("ArrowLeft", !1),
    "embed left shift": Xs("ArrowLeft", !0),
    "embed right": Xs("ArrowRight", !1),
    "embed right shift": Xs("ArrowRight", !0),
    "table down": Vd(!1),
    "table up": Vd(!0)
  }
};
Xa.DEFAULTS = bx;
function Ud(r) {
  return {
    key: "Tab",
    shiftKey: !r,
    format: {
      "code-block": !0
    },
    handler(t, e) {
      let {
        event: n
      } = e;
      const i = this.quill.scroll.query("code-block"), {
        TAB: s
      } = i;
      if (t.length === 0 && !n.shiftKey) {
        this.quill.insertText(t.index, s, O.sources.USER), this.quill.setSelection(t.index + s.length, O.sources.SILENT);
        return;
      }
      const a = t.length === 0 ? this.quill.getLines(t.index, 1) : this.quill.getLines(t);
      let {
        index: o,
        length: l
      } = t;
      a.forEach((c, u) => {
        r ? (c.insertAt(0, s), u === 0 ? o += s.length : l += s.length) : c.domNode.textContent.startsWith(s) && (c.deleteAt(0, s.length), u === 0 ? o -= s.length : l -= s.length);
      }), this.quill.update(O.sources.USER), this.quill.setSelection(o, l, O.sources.SILENT);
    }
  };
}
function Xs(r, t) {
  return {
    key: r,
    shiftKey: t,
    altKey: null,
    [r === "ArrowLeft" ? "prefix" : "suffix"]: /^$/,
    handler(n) {
      let {
        index: i
      } = n;
      r === "ArrowRight" && (i += n.length + 1);
      const [s] = this.quill.getLeaf(i);
      return s instanceof te ? (r === "ArrowLeft" ? t ? this.quill.setSelection(n.index - 1, n.length + 1, O.sources.USER) : this.quill.setSelection(n.index - 1, O.sources.USER) : t ? this.quill.setSelection(n.index, n.length + 1, O.sources.USER) : this.quill.setSelection(n.index + n.length + 1, O.sources.USER), !1) : !0;
    }
  };
}
function hl(r) {
  return {
    key: r[0],
    shortKey: !0,
    handler(t, e) {
      this.quill.format(r, !e.format[r], O.sources.USER);
    }
  };
}
function Vd(r) {
  return {
    key: r ? "ArrowUp" : "ArrowDown",
    collapsed: !0,
    format: ["table"],
    handler(t, e) {
      const n = r ? "prev" : "next", i = e.line, s = i.parent[n];
      if (s != null) {
        if (s.statics.blotName === "table-row") {
          let a = s.children.head, o = i;
          for (; o.prev != null; )
            o = o.prev, a = a.next;
          const l = a.offset(this.quill.scroll) + Math.min(e.offset, a.length() - 1);
          this.quill.setSelection(l, 0, O.sources.USER);
        }
      } else {
        const a = i.table()[n];
        a != null && (r ? this.quill.setSelection(a.offset(this.quill.scroll) + a.length() - 1, 0, O.sources.USER) : this.quill.setSelection(a.offset(this.quill.scroll), 0, O.sources.USER));
      }
      return !1;
    }
  };
}
function yx(r) {
  if (typeof r == "string" || typeof r == "number")
    r = {
      key: r
    };
  else if (typeof r == "object")
    r = zr(r);
  else
    return null;
  return r.shortKey && (r[mx] = r.shortKey, delete r.shortKey), r;
}
function mu(r) {
  let {
    quill: t,
    range: e
  } = r;
  const n = t.getLines(e);
  let i = {};
  if (n.length > 1) {
    const s = n[0].formats(), a = n[n.length - 1].formats();
    i = ue.AttributeMap.diff(a, s) || {};
  }
  t.deleteText(e, O.sources.USER), Object.keys(i).length > 0 && t.formatLine(e.index, 1, i, O.sources.USER), t.setSelection(e.index, O.sources.SILENT);
}
function vx(r, t, e, n) {
  return t.prev == null && t.next == null ? e.prev == null && e.next == null ? n === 0 ? -1 : 1 : e.prev == null ? -1 : 1 : t.prev == null ? -1 : t.next == null ? 1 : null;
}
const wx = /font-weight:\s*normal/, xx = ["P", "OL", "UL"], Gd = (r) => r && xx.includes(r.tagName), Sx = (r) => {
  Array.from(r.querySelectorAll("br")).filter((t) => Gd(t.previousElementSibling) && Gd(t.nextElementSibling)).forEach((t) => {
    var e;
    (e = t.parentNode) == null || e.removeChild(t);
  });
}, kx = (r) => {
  Array.from(r.querySelectorAll('b[style*="font-weight"]')).filter((t) => {
    var e;
    return (e = t.getAttribute("style")) == null ? void 0 : e.match(wx);
  }).forEach((t) => {
    var n;
    const e = r.createDocumentFragment();
    e.append(...t.childNodes), (n = t.parentNode) == null || n.replaceChild(e, t);
  });
};
function Ax(r) {
  r.querySelector('[id^="docs-internal-guid-"]') && (kx(r), Sx(r));
}
const Ex = /\bmso-list:[^;]*ignore/i, Cx = /\bmso-list:[^;]*\bl(\d+)/i, Tx = /\bmso-list:[^;]*\blevel(\d+)/i, Lx = (r, t) => {
  const e = r.getAttribute("style"), n = e == null ? void 0 : e.match(Cx);
  if (!n)
    return null;
  const i = Number(n[1]), s = e == null ? void 0 : e.match(Tx), a = s ? Number(s[1]) : 1, o = new RegExp(`@list l${i}:level${a}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i"), l = t.match(o), c = l && l[1] === "bullet" ? "bullet" : "ordered";
  return {
    id: i,
    indent: a,
    type: c,
    element: r
  };
}, Dx = (r) => {
  var a, o;
  const t = Array.from(r.querySelectorAll("[style*=mso-list]")), e = [], n = [];
  t.forEach((l) => {
    (l.getAttribute("style") || "").match(Ex) ? e.push(l) : n.push(l);
  }), e.forEach((l) => {
    var c;
    return (c = l.parentNode) == null ? void 0 : c.removeChild(l);
  });
  const i = r.documentElement.innerHTML, s = n.map((l) => Lx(l, i)).filter((l) => l);
  for (; s.length; ) {
    const l = [];
    let c = s.shift();
    for (; c; )
      l.push(c), c = s.length && ((a = s[0]) == null ? void 0 : a.element) === c.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
      s[0].id === c.id ? s.shift() : null;
    const u = document.createElement("ul");
    l.forEach((p) => {
      const m = document.createElement("li");
      m.setAttribute("data-list", p.type), p.indent > 1 && m.setAttribute("class", `ql-indent-${p.indent - 1}`), m.innerHTML = p.element.innerHTML, u.appendChild(m);
    });
    const h = (o = l[0]) == null ? void 0 : o.element, {
      parentNode: f
    } = h ?? {};
    h && (f == null || f.replaceChild(u, h)), l.slice(1).forEach((p) => {
      let {
        element: m
      } = p;
      f == null || f.removeChild(m);
    });
  }
};
function Ox(r) {
  r.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word" && Dx(r);
}
const Ix = [Ox, Ax], Nx = (r) => {
  r.documentElement && Ix.forEach((t) => {
    t(r);
  });
}, Mx = yn("quill:clipboard"), qx = [[Node.TEXT_NODE, Gx], [Node.TEXT_NODE, Kd], ["br", Bx], [Node.ELEMENT_NODE, Kd], [Node.ELEMENT_NODE, Px], [Node.ELEMENT_NODE, zx], [Node.ELEMENT_NODE, Ux], ["li", Fx], ["ol, ul", Hx], ["pre", $x], ["tr", Vx], ["b", fl("bold")], ["i", fl("italic")], ["strike", fl("strike")], ["style", jx]], _x = [dx, Ep].reduce((r, t) => (r[t.keyName] = t, r), {}), Wd = [kp, fu, hu, Tp, Op, Np].reduce((r, t) => (r[t.keyName] = t, r), {});
class Mp extends qe {
  constructor(t, e) {
    super(t, e), this.quill.root.addEventListener("copy", (n) => this.onCaptureCopy(n, !1)), this.quill.root.addEventListener("cut", (n) => this.onCaptureCopy(n, !0)), this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this)), this.matchers = [], qx.concat(this.options.matchers ?? []).forEach((n) => {
      let [i, s] = n;
      this.addMatcher(i, s);
    });
  }
  addMatcher(t, e) {
    this.matchers.push([t, e]);
  }
  convert(t) {
    let {
      html: e,
      text: n
    } = t, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (i[_t.blotName])
      return new P().insert(n || "", {
        [_t.blotName]: i[_t.blotName]
      });
    if (!e)
      return new P().insert(n || "", i);
    const s = this.convertHTML(e);
    return ms(s, `
`) && (s.ops[s.ops.length - 1].attributes == null || i.table) ? s.compose(new P().retain(s.length() - 1).delete(1)) : s;
  }
  normalizeHTML(t) {
    Nx(t);
  }
  convertHTML(t) {
    const e = new DOMParser().parseFromString(t, "text/html");
    this.normalizeHTML(e);
    const n = e.body, i = /* @__PURE__ */ new WeakMap(), [s, a] = this.prepareMatching(n, i);
    return bu(this.quill.scroll, n, s, a, i);
  }
  dangerouslyPasteHTML(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : O.sources.API;
    if (typeof t == "string") {
      const i = this.convert({
        html: t,
        text: ""
      });
      this.quill.setContents(i, e), this.quill.setSelection(0, O.sources.SILENT);
    } else {
      const i = this.convert({
        html: e,
        text: ""
      });
      this.quill.updateContents(new P().retain(t).concat(i), n), this.quill.setSelection(t + i.length(), O.sources.SILENT);
    }
  }
  onCaptureCopy(t) {
    var a, o;
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (t.defaultPrevented) return;
    t.preventDefault();
    const [n] = this.quill.selection.getRange();
    if (n == null) return;
    const {
      html: i,
      text: s
    } = this.onCopy(n, e);
    (a = t.clipboardData) == null || a.setData("text/plain", s), (o = t.clipboardData) == null || o.setData("text/html", i), e && mu({
      range: n,
      quill: this.quill
    });
  }
  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */
  normalizeURIList(t) {
    return t.split(/\r?\n/).filter((e) => e[0] !== "#").join(`
`);
  }
  onCapturePaste(t) {
    var a, o, l, c, u;
    if (t.defaultPrevented || !this.quill.isEnabled()) return;
    t.preventDefault();
    const e = this.quill.getSelection(!0);
    if (e == null) return;
    const n = (a = t.clipboardData) == null ? void 0 : a.getData("text/html");
    let i = (o = t.clipboardData) == null ? void 0 : o.getData("text/plain");
    if (!n && !i) {
      const h = (l = t.clipboardData) == null ? void 0 : l.getData("text/uri-list");
      h && (i = this.normalizeURIList(h));
    }
    const s = Array.from(((c = t.clipboardData) == null ? void 0 : c.files) || []);
    if (!n && s.length > 0) {
      this.quill.uploader.upload(e, s);
      return;
    }
    if (n && s.length > 0) {
      const h = new DOMParser().parseFromString(n, "text/html");
      if (h.body.childElementCount === 1 && ((u = h.body.firstElementChild) == null ? void 0 : u.tagName) === "IMG") {
        this.quill.uploader.upload(e, s);
        return;
      }
    }
    this.onPaste(e, {
      html: n,
      text: i
    });
  }
  onCopy(t) {
    const e = this.quill.getText(t);
    return {
      html: this.quill.getSemanticHTML(t),
      text: e
    };
  }
  onPaste(t, e) {
    let {
      text: n,
      html: i
    } = e;
    const s = this.quill.getFormat(t.index), a = this.convert({
      text: n,
      html: i
    }, s);
    Mx.log("onPaste", a, {
      text: n,
      html: i
    });
    const o = new P().retain(t.index).delete(t.length).concat(a);
    this.quill.updateContents(o, O.sources.USER), this.quill.setSelection(o.length() - t.length, O.sources.SILENT), this.quill.scrollSelectionIntoView();
  }
  prepareMatching(t, e) {
    const n = [], i = [];
    return this.matchers.forEach((s) => {
      const [a, o] = s;
      switch (a) {
        case Node.TEXT_NODE:
          i.push(o);
          break;
        case Node.ELEMENT_NODE:
          n.push(o);
          break;
        default:
          Array.from(t.querySelectorAll(a)).forEach((l) => {
            if (e.has(l)) {
              const c = e.get(l);
              c == null || c.push(o);
            } else
              e.set(l, [o]);
          });
          break;
      }
    }), [n, i];
  }
}
_(Mp, "DEFAULTS", {
  matchers: []
});
function dr(r, t, e, n) {
  return n.query(t) ? r.reduce((i, s) => {
    if (!s.insert) return i;
    if (s.attributes && s.attributes[t])
      return i.push(s);
    const a = e ? {
      [t]: e
    } : {};
    return i.insert(s.insert, {
      ...a,
      ...s.attributes
    });
  }, new P()) : r;
}
function ms(r, t) {
  let e = "";
  for (let n = r.ops.length - 1; n >= 0 && e.length < t.length; --n) {
    const i = r.ops[n];
    if (typeof i.insert != "string") break;
    e = i.insert + e;
  }
  return e.slice(-1 * t.length) === t;
}
function Tn(r, t) {
  if (!(r instanceof Element)) return !1;
  const e = t.query(r);
  return e && e.prototype instanceof te ? !1 : ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(r.tagName.toLowerCase());
}
function Rx(r, t) {
  return r.previousElementSibling && r.nextElementSibling && !Tn(r.previousElementSibling, t) && !Tn(r.nextElementSibling, t);
}
const Js = /* @__PURE__ */ new WeakMap();
function qp(r) {
  return r == null ? !1 : (Js.has(r) || (r.tagName === "PRE" ? Js.set(r, !0) : Js.set(r, qp(r.parentNode))), Js.get(r));
}
function bu(r, t, e, n, i) {
  return t.nodeType === t.TEXT_NODE ? n.reduce((s, a) => a(t, s, r), new P()) : t.nodeType === t.ELEMENT_NODE ? Array.from(t.childNodes || []).reduce((s, a) => {
    let o = bu(r, a, e, n, i);
    return a.nodeType === t.ELEMENT_NODE && (o = e.reduce((l, c) => c(a, l, r), o), o = (i.get(a) || []).reduce((l, c) => c(a, l, r), o)), s.concat(o);
  }, new P()) : new P();
}
function fl(r) {
  return (t, e, n) => dr(e, r, !0, n);
}
function zx(r, t, e) {
  const n = Ze.keys(r), i = Ne.keys(r), s = zn.keys(r), a = {};
  return n.concat(i).concat(s).forEach((o) => {
    let l = e.query(o, B.ATTRIBUTE);
    l != null && (a[l.attrName] = l.value(r), a[l.attrName]) || (l = _x[o], l != null && (l.attrName === o || l.keyName === o) && (a[l.attrName] = l.value(r) || void 0), l = Wd[o], l != null && (l.attrName === o || l.keyName === o) && (l = Wd[o], a[l.attrName] = l.value(r) || void 0));
  }), Object.entries(a).reduce((o, l) => {
    let [c, u] = l;
    return dr(o, c, u, e);
  }, t);
}
function Px(r, t, e) {
  const n = e.query(r);
  if (n == null) return t;
  if (n.prototype instanceof te) {
    const i = {}, s = n.value(r);
    if (s != null)
      return i[n.blotName] = s, new P().insert(i, n.formats(r, e));
  } else if (n.prototype instanceof rs && !ms(t, `
`) && t.insert(`
`), "blotName" in n && "formats" in n && typeof n.formats == "function")
    return dr(t, n.blotName, n.formats(r, e), e);
  return t;
}
function Bx(r, t) {
  return ms(t, `
`) || t.insert(`
`), t;
}
function $x(r, t, e) {
  const n = e.query("code-block"), i = n && "formats" in n && typeof n.formats == "function" ? n.formats(r, e) : !0;
  return dr(t, "code-block", i, e);
}
function jx() {
  return new P();
}
function Fx(r, t, e) {
  const n = e.query(r);
  if (n == null || // @ts-expect-error
  n.blotName !== "list" || !ms(t, `
`))
    return t;
  let i = -1, s = r.parentNode;
  for (; s != null; )
    ["OL", "UL"].includes(s.tagName) && (i += 1), s = s.parentNode;
  return i <= 0 ? t : t.reduce((a, o) => o.insert ? o.attributes && typeof o.attributes.indent == "number" ? a.push(o) : a.insert(o.insert, {
    indent: i,
    ...o.attributes || {}
  }) : a, new P());
}
function Hx(r, t, e) {
  const n = r;
  let i = n.tagName === "OL" ? "ordered" : "bullet";
  const s = n.getAttribute("data-checked");
  return s && (i = s === "true" ? "checked" : "unchecked"), dr(t, "list", i, e);
}
function Kd(r, t, e) {
  if (!ms(t, `
`)) {
    if (Tn(r, e) && (r.childNodes.length > 0 || r instanceof HTMLParagraphElement))
      return t.insert(`
`);
    if (t.length() > 0 && r.nextSibling) {
      let n = r.nextSibling;
      for (; n != null; ) {
        if (Tn(n, e))
          return t.insert(`
`);
        const i = e.query(n);
        if (i && i.prototype instanceof ce)
          return t.insert(`
`);
        n = n.firstChild;
      }
    }
  }
  return t;
}
function Ux(r, t, e) {
  var s;
  const n = {}, i = r.style || {};
  return i.fontStyle === "italic" && (n.italic = !0), i.textDecoration === "underline" && (n.underline = !0), i.textDecoration === "line-through" && (n.strike = !0), ((s = i.fontWeight) != null && s.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(i.fontWeight, 10) >= 700) && (n.bold = !0), t = Object.entries(n).reduce((a, o) => {
    let [l, c] = o;
    return dr(a, l, c, e);
  }, t), parseFloat(i.textIndent || 0) > 0 ? new P().insert("	").concat(t) : t;
}
function Vx(r, t, e) {
  var i, s;
  const n = ((i = r.parentElement) == null ? void 0 : i.tagName) === "TABLE" ? r.parentElement : (s = r.parentElement) == null ? void 0 : s.parentElement;
  if (n != null) {
    const o = Array.from(n.querySelectorAll("tr")).indexOf(r) + 1;
    return dr(t, "table", o, e);
  }
  return t;
}
function Gx(r, t, e) {
  var i;
  let n = r.data;
  if (((i = r.parentElement) == null ? void 0 : i.tagName) === "O:P")
    return t.insert(n.trim());
  if (!qp(r)) {
    if (n.trim().length === 0 && n.includes(`
`) && !Rx(r, e))
      return t;
    n = n.replace(/[^\S\u00a0]/g, " "), n = n.replace(/ {2,}/g, " "), (r.previousSibling == null && r.parentElement != null && Tn(r.parentElement, e) || r.previousSibling instanceof Element && Tn(r.previousSibling, e)) && (n = n.replace(/^ /, "")), (r.nextSibling == null && r.parentElement != null && Tn(r.parentElement, e) || r.nextSibling instanceof Element && Tn(r.nextSibling, e)) && (n = n.replace(/ $/, "")), n = n.replaceAll(" ", " ");
  }
  return t.insert(n);
}
class _p extends qe {
  constructor(e, n) {
    super(e, n);
    _(this, "lastRecorded", 0);
    _(this, "ignoreChange", !1);
    _(this, "stack", {
      undo: [],
      redo: []
    });
    _(this, "currentRange", null);
    this.quill.on(O.events.EDITOR_CHANGE, (i, s, a, o) => {
      i === O.events.SELECTION_CHANGE ? s && o !== O.sources.SILENT && (this.currentRange = s) : i === O.events.TEXT_CHANGE && (this.ignoreChange || (!this.options.userOnly || o === O.sources.USER ? this.record(s, a) : this.transform(s)), this.currentRange = ac(this.currentRange, s));
    }), this.quill.keyboard.addBinding({
      key: "z",
      shortKey: !0
    }, this.undo.bind(this)), this.quill.keyboard.addBinding({
      key: ["z", "Z"],
      shortKey: !0,
      shiftKey: !0
    }, this.redo.bind(this)), /Win/i.test(navigator.platform) && this.quill.keyboard.addBinding({
      key: "y",
      shortKey: !0
    }, this.redo.bind(this)), this.quill.root.addEventListener("beforeinput", (i) => {
      i.inputType === "historyUndo" ? (this.undo(), i.preventDefault()) : i.inputType === "historyRedo" && (this.redo(), i.preventDefault());
    });
  }
  change(e, n) {
    if (this.stack[e].length === 0) return;
    const i = this.stack[e].pop();
    if (!i) return;
    const s = this.quill.getContents(), a = i.delta.invert(s);
    this.stack[n].push({
      delta: a,
      range: ac(i.range, a)
    }), this.lastRecorded = 0, this.ignoreChange = !0, this.quill.updateContents(i.delta, O.sources.USER), this.ignoreChange = !1, this.restoreSelection(i);
  }
  clear() {
    this.stack = {
      undo: [],
      redo: []
    };
  }
  cutoff() {
    this.lastRecorded = 0;
  }
  record(e, n) {
    if (e.ops.length === 0) return;
    this.stack.redo = [];
    let i = e.invert(n), s = this.currentRange;
    const a = Date.now();
    if (
      // @ts-expect-error Fix me later
      this.lastRecorded + this.options.delay > a && this.stack.undo.length > 0
    ) {
      const o = this.stack.undo.pop();
      o && (i = i.compose(o.delta), s = o.range);
    } else
      this.lastRecorded = a;
    i.length() !== 0 && (this.stack.undo.push({
      delta: i,
      range: s
    }), this.stack.undo.length > this.options.maxStack && this.stack.undo.shift());
  }
  redo() {
    this.change("redo", "undo");
  }
  transform(e) {
    Yd(this.stack.undo, e), Yd(this.stack.redo, e);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(e) {
    if (e.range)
      this.quill.setSelection(e.range, O.sources.USER);
    else {
      const n = Kx(this.quill.scroll, e.delta);
      this.quill.setSelection(n, O.sources.USER);
    }
  }
}
_(_p, "DEFAULTS", {
  delay: 1e3,
  maxStack: 100,
  userOnly: !1
});
function Yd(r, t) {
  let e = t;
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = r[n];
    r[n] = {
      delta: e.transform(i.delta, !0),
      range: i.range && ac(i.range, e)
    }, e = i.delta.transform(e), r[n].delta.length() === 0 && r.splice(n, 1);
  }
}
function Wx(r, t) {
  const e = t.ops[t.ops.length - 1];
  return e == null ? !1 : e.insert != null ? typeof e.insert == "string" && e.insert.endsWith(`
`) : e.attributes != null ? Object.keys(e.attributes).some((n) => r.query(n, B.BLOCK) != null) : !1;
}
function Kx(r, t) {
  const e = t.reduce((i, s) => i + (s.delete || 0), 0);
  let n = t.length() - e;
  return Wx(r, t) && (n -= 1), n;
}
function ac(r, t) {
  if (!r) return r;
  const e = t.transformPosition(r.index), n = t.transformPosition(r.index + r.length);
  return {
    index: e,
    length: n - e
  };
}
class Rp extends qe {
  constructor(t, e) {
    super(t, e), t.root.addEventListener("drop", (n) => {
      var a;
      n.preventDefault();
      let i = null;
      if (document.caretRangeFromPoint)
        i = document.caretRangeFromPoint(n.clientX, n.clientY);
      else if (document.caretPositionFromPoint) {
        const o = document.caretPositionFromPoint(n.clientX, n.clientY);
        i = document.createRange(), i.setStart(o.offsetNode, o.offset), i.setEnd(o.offsetNode, o.offset);
      }
      const s = i && t.selection.normalizeNative(i);
      if (s) {
        const o = t.selection.normalizedToRange(s);
        (a = n.dataTransfer) != null && a.files && this.upload(o, n.dataTransfer.files);
      }
    });
  }
  upload(t, e) {
    const n = [];
    Array.from(e).forEach((i) => {
      var s;
      i && ((s = this.options.mimetypes) != null && s.includes(i.type)) && n.push(i);
    }), n.length > 0 && this.options.handler.call(this, t, n);
  }
}
Rp.DEFAULTS = {
  mimetypes: ["image/png", "image/jpeg"],
  handler(r, t) {
    if (!this.quill.scroll.query("image"))
      return;
    const e = t.map((n) => new Promise((i) => {
      const s = new FileReader();
      s.onload = () => {
        i(s.result);
      }, s.readAsDataURL(n);
    }));
    Promise.all(e).then((n) => {
      const i = n.reduce((s, a) => s.insert({
        image: a
      }), new P().retain(r.index).delete(r.length));
      this.quill.updateContents(i, z.sources.USER), this.quill.setSelection(r.index + n.length, z.sources.SILENT);
    });
  }
};
const Yx = ["insertText", "insertReplacementText"];
class Qx extends qe {
  constructor(t, e) {
    super(t, e), t.root.addEventListener("beforeinput", (n) => {
      this.handleBeforeInput(n);
    }), /Android/i.test(navigator.userAgent) || t.on(O.events.COMPOSITION_BEFORE_START, () => {
      this.handleCompositionStart();
    });
  }
  deleteRange(t) {
    mu({
      range: t,
      quill: this.quill
    });
  }
  replaceText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (t.length === 0) return !1;
    if (e) {
      const n = this.quill.getFormat(t.index, 1);
      this.deleteRange(t), this.quill.updateContents(new P().retain(t.index).insert(e, n), O.sources.USER);
    } else
      this.deleteRange(t);
    return this.quill.setSelection(t.index + e.length, 0, O.sources.SILENT), !0;
  }
  handleBeforeInput(t) {
    if (this.quill.composition.isComposing || t.defaultPrevented || !Yx.includes(t.inputType))
      return;
    const e = t.getTargetRanges ? t.getTargetRanges()[0] : null;
    if (!e || e.collapsed === !0)
      return;
    const n = Zx(t);
    if (n == null)
      return;
    const i = this.quill.selection.normalizeNative(e), s = i ? this.quill.selection.normalizedToRange(i) : null;
    s && this.replaceText(s, n) && t.preventDefault();
  }
  handleCompositionStart() {
    const t = this.quill.getSelection();
    t && this.replaceText(t);
  }
}
function Zx(r) {
  var t;
  return typeof r.data == "string" ? r.data : (t = r.dataTransfer) != null && t.types.includes("text/plain") ? r.dataTransfer.getData("text/plain") : null;
}
const Xx = /Mac/i.test(navigator.platform), Jx = 100, tS = (r) => !!(r.key === "ArrowLeft" || r.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
r.key === "ArrowUp" || r.key === "ArrowDown" || r.key === "Home" || Xx && r.key === "a" && r.ctrlKey === !0);
class eS extends qe {
  constructor(e, n) {
    super(e, n);
    _(this, "isListening", !1);
    _(this, "selectionChangeDeadline", 0);
    this.handleArrowKeys(), this.handleNavigationShortcuts();
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ["ArrowLeft", "ArrowRight"],
      offset: 0,
      shiftKey: null,
      handler(e, n) {
        let {
          line: i,
          event: s
        } = n;
        if (!(i instanceof Ae) || !i.uiNode)
          return !0;
        const a = getComputedStyle(i.domNode).direction === "rtl";
        return a && s.key !== "ArrowRight" || !a && s.key !== "ArrowLeft" ? !0 : (this.quill.setSelection(e.index - 1, e.length + (s.shiftKey ? 1 : 0), O.sources.USER), !1);
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (e) => {
      !e.defaultPrevented && tS(e) && this.ensureListeningToSelectionChange();
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    if (this.selectionChangeDeadline = Date.now() + Jx, this.isListening) return;
    this.isListening = !0;
    const e = () => {
      this.isListening = !1, Date.now() <= this.selectionChangeDeadline && this.handleSelectionChange();
    };
    document.addEventListener("selectionchange", e, {
      once: !0
    });
  }
  handleSelectionChange() {
    const e = document.getSelection();
    if (!e) return;
    const n = e.getRangeAt(0);
    if (n.collapsed !== !0 || n.startOffset !== 0) return;
    const i = this.quill.scroll.find(n.startContainer);
    if (!(i instanceof Ae) || !i.uiNode) return;
    const s = document.createRange();
    s.setStartAfter(i.uiNode), s.setEndAfter(i.uiNode), e.removeAllRanges(), e.addRange(s);
  }
}
O.register({
  "blots/block": Tt,
  "blots/block/embed": ce,
  "blots/break": Me,
  "blots/container": cr,
  "blots/cursor": ni,
  "blots/embed": uu,
  "blots/inline": Xe,
  "blots/scroll": Nr,
  "blots/text": De,
  "modules/clipboard": Mp,
  "modules/history": _p,
  "modules/keyboard": Xa,
  "modules/uploader": Rp,
  "modules/input": Qx,
  "modules/uiNode": eS
});
class nS extends Ne {
  add(t, e) {
    let n = 0;
    if (e === "+1" || e === "-1") {
      const i = this.value(t) || 0;
      n = e === "+1" ? i + 1 : i - 1;
    } else typeof e == "number" && (n = e);
    return n === 0 ? (this.remove(t), !0) : super.add(t, n.toString());
  }
  canAdd(t, e) {
    return super.canAdd(t, e) || super.canAdd(t, parseInt(e, 10));
  }
  value(t) {
    return parseInt(super.value(t), 10) || void 0;
  }
}
const rS = new nS("indent", "ql-indent", {
  scope: B.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
class oc extends Tt {
}
_(oc, "blotName", "blockquote"), _(oc, "tagName", "blockquote");
class lc extends Tt {
  static formats(t) {
    return this.tagName.indexOf(t.tagName) + 1;
  }
}
_(lc, "blotName", "header"), _(lc, "tagName", ["H1", "H2", "H3", "H4", "H5", "H6"]);
class bs extends cr {
}
bs.blotName = "list-container";
bs.tagName = "OL";
class ys extends Tt {
  static create(t) {
    const e = super.create();
    return e.setAttribute("data-list", t), e;
  }
  static formats(t) {
    return t.getAttribute("data-list") || void 0;
  }
  static register() {
    O.register(bs);
  }
  constructor(t, e) {
    super(t, e);
    const n = e.ownerDocument.createElement("span"), i = (s) => {
      if (!t.isEnabled()) return;
      const a = this.statics.formats(e, t);
      a === "checked" ? (this.format("list", "unchecked"), s.preventDefault()) : a === "unchecked" && (this.format("list", "checked"), s.preventDefault());
    };
    n.addEventListener("mousedown", i), n.addEventListener("touchstart", i), this.attachUI(n);
  }
  format(t, e) {
    t === this.statics.blotName && e ? this.domNode.setAttribute("data-list", e) : super.format(t, e);
  }
}
ys.blotName = "list";
ys.tagName = "LI";
bs.allowedChildren = [ys];
ys.requiredContainer = bs;
class as extends Xe {
  static create() {
    return super.create();
  }
  static formats() {
    return !0;
  }
  optimize(t) {
    super.optimize(t), this.domNode.tagName !== this.statics.tagName[0] && this.replaceWith(this.statics.blotName);
  }
}
_(as, "blotName", "bold"), _(as, "tagName", ["STRONG", "B"]);
class cc extends as {
}
_(cc, "blotName", "italic"), _(cc, "tagName", ["EM", "I"]);
class Ln extends Xe {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("href", this.sanitize(t)), e.setAttribute("rel", "noopener noreferrer"), e.setAttribute("target", "_blank"), e;
  }
  static formats(t) {
    return t.getAttribute("href");
  }
  static sanitize(t) {
    return zp(t, this.PROTOCOL_WHITELIST) ? t : this.SANITIZED_URL;
  }
  format(t, e) {
    t !== this.statics.blotName || !e ? super.format(t, e) : this.domNode.setAttribute("href", this.constructor.sanitize(e));
  }
}
_(Ln, "blotName", "link"), _(Ln, "tagName", "A"), _(Ln, "SANITIZED_URL", "about:blank"), _(Ln, "PROTOCOL_WHITELIST", ["http", "https", "mailto", "tel", "sms"]);
function zp(r, t) {
  const e = document.createElement("a");
  e.href = r;
  const n = e.href.slice(0, e.href.indexOf(":"));
  return t.indexOf(n) > -1;
}
class uc extends Xe {
  static create(t) {
    return t === "super" ? document.createElement("sup") : t === "sub" ? document.createElement("sub") : super.create(t);
  }
  static formats(t) {
    if (t.tagName === "SUB") return "sub";
    if (t.tagName === "SUP") return "super";
  }
}
_(uc, "blotName", "script"), _(uc, "tagName", ["SUB", "SUP"]);
class dc extends as {
}
_(dc, "blotName", "strike"), _(dc, "tagName", ["S", "STRIKE"]);
class hc extends Xe {
}
_(hc, "blotName", "underline"), _(hc, "tagName", "U");
class da extends uu {
  static create(t) {
    if (window.katex == null)
      throw new Error("Formula module requires KaTeX.");
    const e = super.create(t);
    return typeof t == "string" && (window.katex.render(t, e, {
      throwOnError: !1,
      errorColor: "#f00"
    }), e.setAttribute("data-value", t)), e;
  }
  static value(t) {
    return t.getAttribute("data-value");
  }
  html() {
    const {
      formula: t
    } = this.value();
    return `<span>${t}</span>`;
  }
}
_(da, "blotName", "formula"), _(da, "className", "ql-formula"), _(da, "tagName", "SPAN");
const Qd = ["alt", "height", "width"];
var ca;
let iS = (ca = class extends te {
  static create(t) {
    const e = super.create(t);
    return typeof t == "string" && e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return Qd.reduce((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e), {});
  }
  static match(t) {
    return /\.(jpe?g|gif|png)$/.test(t) || /^data:image\/.+;base64/.test(t);
  }
  static sanitize(t) {
    return zp(t, ["http", "https", "data"]) ? t : "//:0";
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    Qd.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
}, _(ca, "blotName", "image"), _(ca, "tagName", "IMG"), ca);
const Zd = ["height", "width"];
class ha extends ce {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("frameborder", "0"), e.setAttribute("allowfullscreen", "true"), e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return Zd.reduce((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e), {});
  }
  static sanitize(t) {
    return Ln.sanitize(t);
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    Zd.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
  html() {
    const {
      video: t
    } = this.value();
    return `<a href="${t}">${t}</a>`;
  }
}
_(ha, "blotName", "video"), _(ha, "className", "ql-video"), _(ha, "tagName", "IFRAME");
const Pi = new Ne("code-token", "hljs", {
  scope: B.INLINE
});
class pn extends Xe {
  static formats(t, e) {
    for (; t != null && t !== e.domNode; ) {
      if (t.classList && t.classList.contains(_t.className))
        return super.formats(t, e);
      t = t.parentNode;
    }
  }
  constructor(t, e, n) {
    super(t, e, n), Pi.add(this.domNode, n);
  }
  format(t, e) {
    t !== pn.blotName ? super.format(t, e) : e ? Pi.add(this.domNode, e) : (Pi.remove(this.domNode), this.domNode.classList.remove(this.statics.className));
  }
  optimize() {
    super.optimize(...arguments), Pi.value(this.domNode) || this.unwrap();
  }
}
pn.blotName = "code-token";
pn.className = "ql-token";
class oe extends _t {
  static create(t) {
    const e = super.create(t);
    return typeof t == "string" && e.setAttribute("data-language", t), e;
  }
  static formats(t) {
    return t.getAttribute("data-language") || "plain";
  }
  static register() {
  }
  // Syntax module will register
  format(t, e) {
    t === this.statics.blotName && e ? this.domNode.setAttribute("data-language", e) : super.format(t, e);
  }
  replaceWith(t, e) {
    return this.formatAt(0, this.length(), pn.blotName, !1), super.replaceWith(t, e);
  }
}
class Vi extends ur {
  attach() {
    super.attach(), this.forceNext = !1, this.scroll.emitMount(this);
  }
  format(t, e) {
    t === oe.blotName && (this.forceNext = !0, this.children.forEach((n) => {
      n.format(t, e);
    }));
  }
  formatAt(t, e, n, i) {
    n === oe.blotName && (this.forceNext = !0), super.formatAt(t, e, n, i);
  }
  highlight(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.children.head == null) return;
    const i = `${Array.from(this.domNode.childNodes).filter((a) => a !== this.uiNode).map((a) => a.textContent).join(`
`)}
`, s = oe.formats(this.children.head.domNode);
    if (e || this.forceNext || this.cachedText !== i) {
      if (i.trim().length > 0 || this.cachedText == null) {
        const a = this.children.reduce((l, c) => l.concat(vp(c, !1)), new P()), o = t(i, s);
        a.diff(o).reduce((l, c) => {
          let {
            retain: u,
            attributes: h
          } = c;
          return u ? (h && Object.keys(h).forEach((f) => {
            [oe.blotName, pn.blotName].includes(f) && this.formatAt(l, u, f, h[f]);
          }), l + u) : l;
        }, 0);
      }
      this.cachedText = i, this.forceNext = !1;
    }
  }
  html(t, e) {
    const [n] = this.children.find(t);
    return `<pre data-language="${n ? oe.formats(n.domNode) : "plain"}">
${Za(this.code(t, e))}
</pre>`;
  }
  optimize(t) {
    if (super.optimize(t), this.parent != null && this.children.head != null && this.uiNode != null) {
      const e = oe.formats(this.children.head.domNode);
      e !== this.uiNode.value && (this.uiNode.value = e);
    }
  }
}
Vi.allowedChildren = [oe];
oe.requiredContainer = Vi;
oe.allowedChildren = [pn, ni, De, Me];
const sS = (r, t, e) => {
  if (typeof r.versionString == "string") {
    const n = r.versionString.split(".")[0];
    if (parseInt(n, 10) >= 11)
      return r.highlight(e, {
        language: t
      }).value;
  }
  return r.highlight(t, e).value;
};
class Pp extends qe {
  static register() {
    O.register(pn, !0), O.register(oe, !0), O.register(Vi, !0);
  }
  constructor(t, e) {
    if (super(t, e), this.options.hljs == null)
      throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
    this.languages = this.options.languages.reduce((n, i) => {
      let {
        key: s
      } = i;
      return n[s] = !0, n;
    }, {}), this.highlightBlot = this.highlightBlot.bind(this), this.initListener(), this.initTimer();
  }
  initListener() {
    this.quill.on(O.events.SCROLL_BLOT_MOUNT, (t) => {
      if (!(t instanceof Vi)) return;
      const e = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach((n) => {
        let {
          key: i,
          label: s
        } = n;
        const a = e.ownerDocument.createElement("option");
        a.textContent = s, a.setAttribute("value", i), e.appendChild(a);
      }), e.addEventListener("change", () => {
        t.format(oe.blotName, e.value), this.quill.root.focus(), this.highlight(t, !0);
      }), t.uiNode == null && (t.attachUI(e), t.children.head && (e.value = oe.formats(t.children.head.domNode)));
    });
  }
  initTimer() {
    let t = null;
    this.quill.on(O.events.SCROLL_OPTIMIZE, () => {
      t && clearTimeout(t), t = setTimeout(() => {
        this.highlight(), t = null;
      }, this.options.interval);
    });
  }
  highlight() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.quill.selection.composing) return;
    this.quill.update(O.sources.USER);
    const n = this.quill.getSelection();
    (t == null ? this.quill.scroll.descendants(Vi) : [t]).forEach((s) => {
      s.highlight(this.highlightBlot, e);
    }), this.quill.update(O.sources.SILENT), n != null && this.quill.setSelection(n, O.sources.SILENT);
  }
  highlightBlot(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
    if (e = this.languages[e] ? e : "plain", e === "plain")
      return Za(t).split(`
`).reduce((i, s, a) => (a !== 0 && i.insert(`
`, {
        [_t.blotName]: e
      }), i.insert(s)), new P());
    const n = this.quill.root.ownerDocument.createElement("div");
    return n.classList.add(_t.className), n.innerHTML = sS(this.options.hljs, e, t), bu(this.quill.scroll, n, [(i, s) => {
      const a = Pi.value(i);
      return a ? s.compose(new P().retain(s.length(), {
        [pn.blotName]: a
      })) : s;
    }], [(i, s) => i.data.split(`
`).reduce((a, o, l) => (l !== 0 && a.insert(`
`, {
      [_t.blotName]: e
    }), a.insert(o)), s)], /* @__PURE__ */ new WeakMap());
  }
}
Pp.DEFAULTS = {
  hljs: window.hljs,
  interval: 1e3,
  languages: [{
    key: "plain",
    label: "Plain"
  }, {
    key: "bash",
    label: "Bash"
  }, {
    key: "cpp",
    label: "C++"
  }, {
    key: "cs",
    label: "C#"
  }, {
    key: "css",
    label: "CSS"
  }, {
    key: "diff",
    label: "Diff"
  }, {
    key: "xml",
    label: "HTML/XML"
  }, {
    key: "java",
    label: "Java"
  }, {
    key: "javascript",
    label: "JavaScript"
  }, {
    key: "markdown",
    label: "Markdown"
  }, {
    key: "php",
    label: "PHP"
  }, {
    key: "python",
    label: "Python"
  }, {
    key: "ruby",
    label: "Ruby"
  }, {
    key: "sql",
    label: "SQL"
  }]
};
const Zi = class Zi extends Tt {
  static create(t) {
    const e = super.create();
    return t ? e.setAttribute("data-row", t) : e.setAttribute("data-row", yu()), e;
  }
  static formats(t) {
    if (t.hasAttribute("data-row"))
      return t.getAttribute("data-row");
  }
  cellOffset() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  format(t, e) {
    t === Zi.blotName && e ? this.domNode.setAttribute("data-row", e) : super.format(t, e);
  }
  row() {
    return this.parent;
  }
  rowOffset() {
    return this.row() ? this.row().rowOffset() : -1;
  }
  table() {
    return this.row() && this.row().table();
  }
};
_(Zi, "blotName", "table"), _(Zi, "tagName", "TD");
let xe = Zi;
class gn extends cr {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const t = this.children.head.formats(), e = this.children.tail.formats(), n = this.next.children.head.formats(), i = this.next.children.tail.formats();
      return t.table === e.table && t.table === n.table && t.table === i.table;
    }
    return !1;
  }
  optimize(t) {
    super.optimize(t), this.children.forEach((e) => {
      if (e.next == null) return;
      const n = e.formats(), i = e.next.formats();
      if (n.table !== i.table) {
        const s = this.splitAfter(e);
        s && s.optimize(), this.prev && this.prev.optimize();
      }
    });
  }
  rowOffset() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  table() {
    return this.parent && this.parent.parent;
  }
}
_(gn, "blotName", "table-row"), _(gn, "tagName", "TR");
class Ke extends cr {
}
_(Ke, "blotName", "table-body"), _(Ke, "tagName", "TBODY");
class ii extends cr {
  balanceCells() {
    const t = this.descendants(gn), e = t.reduce((n, i) => Math.max(i.children.length, n), 0);
    t.forEach((n) => {
      new Array(e - n.children.length).fill(0).forEach(() => {
        let i;
        n.children.head != null && (i = xe.formats(n.children.head.domNode));
        const s = this.scroll.create(xe.blotName, i);
        n.appendChild(s), s.optimize();
      });
    });
  }
  cells(t) {
    return this.rows().map((e) => e.children.at(t));
  }
  deleteColumn(t) {
    const [e] = this.descendant(Ke);
    e == null || e.children.head == null || e.children.forEach((n) => {
      const i = n.children.at(t);
      i != null && i.remove();
    });
  }
  insertColumn(t) {
    const [e] = this.descendant(Ke);
    e == null || e.children.head == null || e.children.forEach((n) => {
      const i = n.children.at(t), s = xe.formats(n.children.head.domNode), a = this.scroll.create(xe.blotName, s);
      n.insertBefore(a, i);
    });
  }
  insertRow(t) {
    const [e] = this.descendant(Ke);
    if (e == null || e.children.head == null) return;
    const n = yu(), i = this.scroll.create(gn.blotName);
    e.children.head.children.forEach(() => {
      const a = this.scroll.create(xe.blotName, n);
      i.appendChild(a);
    });
    const s = e.children.at(t);
    e.insertBefore(i, s);
  }
  rows() {
    const t = this.children.head;
    return t == null ? [] : t.children.map((e) => e);
  }
}
_(ii, "blotName", "table-container"), _(ii, "tagName", "TABLE");
ii.allowedChildren = [Ke];
Ke.requiredContainer = ii;
Ke.allowedChildren = [gn];
gn.requiredContainer = Ke;
gn.allowedChildren = [xe];
xe.requiredContainer = gn;
function yu() {
  return `row-${Math.random().toString(36).slice(2, 6)}`;
}
class aS extends qe {
  static register() {
    O.register(xe), O.register(gn), O.register(Ke), O.register(ii);
  }
  constructor() {
    super(...arguments), this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(ii).forEach((t) => {
      t.balanceCells();
    });
  }
  deleteColumn() {
    const [t, , e] = this.getTable();
    e != null && (t.deleteColumn(e.cellOffset()), this.quill.update(O.sources.USER));
  }
  deleteRow() {
    const [, t] = this.getTable();
    t != null && (t.remove(), this.quill.update(O.sources.USER));
  }
  deleteTable() {
    const [t] = this.getTable();
    if (t == null) return;
    const e = t.offset();
    t.remove(), this.quill.update(O.sources.USER), this.quill.setSelection(e, O.sources.SILENT);
  }
  getTable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
    if (t == null) return [null, null, null, -1];
    const [e, n] = this.quill.getLine(t.index);
    if (e == null || e.statics.blotName !== xe.blotName)
      return [null, null, null, -1];
    const i = e.parent;
    return [i.parent.parent, i, e, n];
  }
  insertColumn(t) {
    const e = this.quill.getSelection();
    if (!e) return;
    const [n, i, s] = this.getTable(e);
    if (s == null) return;
    const a = s.cellOffset();
    n.insertColumn(a + t), this.quill.update(O.sources.USER);
    let o = i.rowOffset();
    t === 0 && (o += 1), this.quill.setSelection(e.index + o, e.length, O.sources.SILENT);
  }
  insertColumnLeft() {
    this.insertColumn(0);
  }
  insertColumnRight() {
    this.insertColumn(1);
  }
  insertRow(t) {
    const e = this.quill.getSelection();
    if (!e) return;
    const [n, i, s] = this.getTable(e);
    if (s == null) return;
    const a = i.rowOffset();
    n.insertRow(a + t), this.quill.update(O.sources.USER), t > 0 ? this.quill.setSelection(e, O.sources.SILENT) : this.quill.setSelection(e.index + i.children.length, e.length, O.sources.SILENT);
  }
  insertRowAbove() {
    this.insertRow(0);
  }
  insertRowBelow() {
    this.insertRow(1);
  }
  insertTable(t, e) {
    const n = this.quill.getSelection();
    if (n == null) return;
    const i = new Array(t).fill(0).reduce((s) => {
      const a = new Array(e).fill(`
`).join("");
      return s.insert(a, {
        table: yu()
      });
    }, new P().retain(n.index));
    this.quill.updateContents(i, O.sources.USER), this.quill.setSelection(n.index, O.sources.SILENT), this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(O.events.SCROLL_OPTIMIZE, (t) => {
      t.some((e) => ["TD", "TR", "TBODY", "TABLE"].includes(e.target.tagName) ? (this.quill.once(O.events.TEXT_CHANGE, (n, i, s) => {
        s === O.sources.USER && this.balanceTables();
      }), !0) : !1);
    });
  }
}
const Xd = yn("quill:toolbar");
class vu extends qe {
  constructor(t, e) {
    var n, i;
    if (super(t, e), Array.isArray(this.options.container)) {
      const s = document.createElement("div");
      s.setAttribute("role", "toolbar"), oS(s, this.options.container), (i = (n = t.container) == null ? void 0 : n.parentNode) == null || i.insertBefore(s, t.container), this.container = s;
    } else typeof this.options.container == "string" ? this.container = document.querySelector(this.options.container) : this.container = this.options.container;
    if (!(this.container instanceof HTMLElement)) {
      Xd.error("Container required for toolbar", this.options);
      return;
    }
    this.container.classList.add("ql-toolbar"), this.controls = [], this.handlers = {}, this.options.handlers && Object.keys(this.options.handlers).forEach((s) => {
      var o;
      const a = (o = this.options.handlers) == null ? void 0 : o[s];
      a && this.addHandler(s, a);
    }), Array.from(this.container.querySelectorAll("button, select")).forEach((s) => {
      this.attach(s);
    }), this.quill.on(O.events.EDITOR_CHANGE, () => {
      const [s] = this.quill.selection.getRange();
      this.update(s);
    });
  }
  addHandler(t, e) {
    this.handlers[t] = e;
  }
  attach(t) {
    let e = Array.from(t.classList).find((i) => i.indexOf("ql-") === 0);
    if (!e) return;
    if (e = e.slice(3), t.tagName === "BUTTON" && t.setAttribute("type", "button"), this.handlers[e] == null && this.quill.scroll.query(e) == null) {
      Xd.warn("ignoring attaching to nonexistent format", e, t);
      return;
    }
    const n = t.tagName === "SELECT" ? "change" : "click";
    t.addEventListener(n, (i) => {
      let s;
      if (t.tagName === "SELECT") {
        if (t.selectedIndex < 0) return;
        const o = t.options[t.selectedIndex];
        o.hasAttribute("selected") ? s = !1 : s = o.value || !1;
      } else
        t.classList.contains("ql-active") ? s = !1 : s = t.value || !t.hasAttribute("value"), i.preventDefault();
      this.quill.focus();
      const [a] = this.quill.selection.getRange();
      if (this.handlers[e] != null)
        this.handlers[e].call(this, s);
      else if (
        // @ts-expect-error
        this.quill.scroll.query(e).prototype instanceof te
      ) {
        if (s = prompt(`Enter ${e}`), !s) return;
        this.quill.updateContents(new P().retain(a.index).delete(a.length).insert({
          [e]: s
        }), O.sources.USER);
      } else
        this.quill.format(e, s, O.sources.USER);
      this.update(a);
    }), this.controls.push([e, t]);
  }
  update(t) {
    const e = t == null ? {} : this.quill.getFormat(t);
    this.controls.forEach((n) => {
      const [i, s] = n;
      if (s.tagName === "SELECT") {
        let a = null;
        if (t == null)
          a = null;
        else if (e[i] == null)
          a = s.querySelector("option[selected]");
        else if (!Array.isArray(e[i])) {
          let o = e[i];
          typeof o == "string" && (o = o.replace(/"/g, '\\"')), a = s.querySelector(`option[value="${o}"]`);
        }
        a == null ? (s.value = "", s.selectedIndex = -1) : a.selected = !0;
      } else if (t == null)
        s.classList.remove("ql-active"), s.setAttribute("aria-pressed", "false");
      else if (s.hasAttribute("value")) {
        const a = e[i], o = a === s.getAttribute("value") || a != null && a.toString() === s.getAttribute("value") || a == null && !s.getAttribute("value");
        s.classList.toggle("ql-active", o), s.setAttribute("aria-pressed", o.toString());
      } else {
        const a = e[i] != null;
        s.classList.toggle("ql-active", a), s.setAttribute("aria-pressed", a.toString());
      }
    });
  }
}
vu.DEFAULTS = {};
function Jd(r, t, e) {
  const n = document.createElement("button");
  n.setAttribute("type", "button"), n.classList.add(`ql-${t}`), n.setAttribute("aria-pressed", "false"), e != null ? (n.value = e, n.setAttribute("aria-label", `${t}: ${e}`)) : n.setAttribute("aria-label", t), r.appendChild(n);
}
function oS(r, t) {
  Array.isArray(t[0]) || (t = [t]), t.forEach((e) => {
    const n = document.createElement("span");
    n.classList.add("ql-formats"), e.forEach((i) => {
      if (typeof i == "string")
        Jd(n, i);
      else {
        const s = Object.keys(i)[0], a = i[s];
        Array.isArray(a) ? lS(n, s, a) : Jd(n, s, a);
      }
    }), r.appendChild(n);
  });
}
function lS(r, t, e) {
  const n = document.createElement("select");
  n.classList.add(`ql-${t}`), e.forEach((i) => {
    const s = document.createElement("option");
    i !== !1 ? s.setAttribute("value", String(i)) : s.setAttribute("selected", "selected"), n.appendChild(s);
  }), r.appendChild(n);
}
vu.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const r = this.quill.getSelection();
      if (r != null)
        if (r.length === 0) {
          const t = this.quill.getFormat();
          Object.keys(t).forEach((e) => {
            this.quill.scroll.query(e, B.INLINE) != null && this.quill.format(e, !1, O.sources.USER);
          });
        } else
          this.quill.removeFormat(r.index, r.length, O.sources.USER);
    },
    direction(r) {
      const {
        align: t
      } = this.quill.getFormat();
      r === "rtl" && t == null ? this.quill.format("align", "right", O.sources.USER) : !r && t === "right" && this.quill.format("align", !1, O.sources.USER), this.quill.format("direction", r, O.sources.USER);
    },
    indent(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t), n = parseInt(e.indent || 0, 10);
      if (r === "+1" || r === "-1") {
        let i = r === "+1" ? 1 : -1;
        e.direction === "rtl" && (i *= -1), this.quill.format("indent", n + i, O.sources.USER);
      }
    },
    link(r) {
      r === !0 && (r = prompt("Enter link URL:")), this.quill.format("link", r, O.sources.USER);
    },
    list(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t);
      r === "check" ? e.list === "checked" || e.list === "unchecked" ? this.quill.format("list", !1, O.sources.USER) : this.quill.format("list", "unchecked", O.sources.USER) : this.quill.format("list", r, O.sources.USER);
    }
  }
};
const cS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>', uS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>', dS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>', hS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>', fS = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>', pS = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>', gS = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>', mS = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>', th = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>', bS = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>', yS = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>', vS = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>', wS = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>', xS = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>', SS = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', kS = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', AS = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>', ES = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', CS = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>', TS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>', LS = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>', DS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>', OS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>', IS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>', NS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>', MS = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>', qS = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>', _S = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>', RS = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>', zS = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>', PS = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>', BS = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>', $S = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>', os = {
  align: {
    "": cS,
    center: uS,
    right: dS,
    justify: hS
  },
  background: fS,
  blockquote: pS,
  bold: gS,
  clean: mS,
  code: th,
  "code-block": th,
  color: bS,
  direction: {
    "": yS,
    rtl: vS
  },
  formula: wS,
  header: {
    1: xS,
    2: SS,
    3: kS,
    4: AS,
    5: ES,
    6: CS
  },
  italic: TS,
  image: LS,
  indent: {
    "+1": DS,
    "-1": OS
  },
  link: IS,
  list: {
    bullet: NS,
    check: MS,
    ordered: qS
  },
  script: {
    sub: _S,
    super: RS
  },
  strike: zS,
  table: PS,
  underline: BS,
  video: $S
}, jS = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
let eh = 0;
function nh(r, t) {
  r.setAttribute(t, `${r.getAttribute(t) !== "true"}`);
}
class Ja {
  constructor(t) {
    this.select = t, this.container = document.createElement("span"), this.buildPicker(), this.select.style.display = "none", this.select.parentNode.insertBefore(this.container, this.select), this.label.addEventListener("mousedown", () => {
      this.togglePicker();
    }), this.label.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
          this.togglePicker();
          break;
        case "Escape":
          this.escape(), e.preventDefault();
          break;
      }
    }), this.select.addEventListener("change", this.update.bind(this));
  }
  togglePicker() {
    this.container.classList.toggle("ql-expanded"), nh(this.label, "aria-expanded"), nh(this.options, "aria-hidden");
  }
  buildItem(t) {
    const e = document.createElement("span");
    e.tabIndex = "0", e.setAttribute("role", "button"), e.classList.add("ql-picker-item");
    const n = t.getAttribute("value");
    return n && e.setAttribute("data-value", n), t.textContent && e.setAttribute("data-label", t.textContent), e.addEventListener("click", () => {
      this.selectItem(e, !0);
    }), e.addEventListener("keydown", (i) => {
      switch (i.key) {
        case "Enter":
          this.selectItem(e, !0), i.preventDefault();
          break;
        case "Escape":
          this.escape(), i.preventDefault();
          break;
      }
    }), e;
  }
  buildLabel() {
    const t = document.createElement("span");
    return t.classList.add("ql-picker-label"), t.innerHTML = jS, t.tabIndex = "0", t.setAttribute("role", "button"), t.setAttribute("aria-expanded", "false"), this.container.appendChild(t), t;
  }
  buildOptions() {
    const t = document.createElement("span");
    t.classList.add("ql-picker-options"), t.setAttribute("aria-hidden", "true"), t.tabIndex = "-1", t.id = `ql-picker-options-${eh}`, eh += 1, this.label.setAttribute("aria-controls", t.id), this.options = t, Array.from(this.select.options).forEach((e) => {
      const n = this.buildItem(e);
      t.appendChild(n), e.selected === !0 && this.selectItem(n);
    }), this.container.appendChild(t);
  }
  buildPicker() {
    Array.from(this.select.attributes).forEach((t) => {
      this.container.setAttribute(t.name, t.value);
    }), this.container.classList.add("ql-picker"), this.label = this.buildLabel(), this.buildOptions();
  }
  escape() {
    this.close(), setTimeout(() => this.label.focus(), 1);
  }
  close() {
    this.container.classList.remove("ql-expanded"), this.label.setAttribute("aria-expanded", "false"), this.options.setAttribute("aria-hidden", "true");
  }
  selectItem(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    const n = this.container.querySelector(".ql-selected");
    t !== n && (n != null && n.classList.remove("ql-selected"), t != null && (t.classList.add("ql-selected"), this.select.selectedIndex = Array.from(t.parentNode.children).indexOf(t), t.hasAttribute("data-value") ? this.label.setAttribute("data-value", t.getAttribute("data-value")) : this.label.removeAttribute("data-value"), t.hasAttribute("data-label") ? this.label.setAttribute("data-label", t.getAttribute("data-label")) : this.label.removeAttribute("data-label"), e && (this.select.dispatchEvent(new Event("change")), this.close())));
  }
  update() {
    let t;
    if (this.select.selectedIndex > -1) {
      const n = (
        // @ts-expect-error Fix me later
        this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex]
      );
      t = this.select.options[this.select.selectedIndex], this.selectItem(n);
    } else
      this.selectItem(null);
    const e = t != null && t !== this.select.querySelector("option[selected]");
    this.label.classList.toggle("ql-active", e);
  }
}
class Bp extends Ja {
  constructor(t, e) {
    super(t), this.label.innerHTML = e, this.container.classList.add("ql-color-picker"), Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((n) => {
      n.classList.add("ql-primary");
    });
  }
  buildItem(t) {
    const e = super.buildItem(t);
    return e.style.backgroundColor = t.getAttribute("value") || "", e;
  }
  selectItem(t, e) {
    super.selectItem(t, e);
    const n = this.label.querySelector(".ql-color-label"), i = t && t.getAttribute("data-value") || "";
    n && (n.tagName === "line" ? n.style.stroke = i : n.style.fill = i);
  }
}
class $p extends Ja {
  constructor(t, e) {
    super(t), this.container.classList.add("ql-icon-picker"), Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach((n) => {
      n.innerHTML = e[n.getAttribute("data-value") || ""];
    }), this.defaultItem = this.container.querySelector(".ql-selected"), this.selectItem(this.defaultItem);
  }
  selectItem(t, e) {
    super.selectItem(t, e);
    const n = t || this.defaultItem;
    if (n != null) {
      if (this.label.innerHTML === n.innerHTML) return;
      this.label.innerHTML = n.innerHTML;
    }
  }
}
const FS = (r) => {
  const {
    overflowY: t
  } = getComputedStyle(r, null);
  return t !== "visible" && t !== "clip";
};
class jp {
  constructor(t, e) {
    this.quill = t, this.boundsContainer = e || document.body, this.root = t.addContainer("ql-tooltip"), this.root.innerHTML = this.constructor.TEMPLATE, FS(this.quill.root) && this.quill.root.addEventListener("scroll", () => {
      this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
    }), this.hide();
  }
  hide() {
    this.root.classList.add("ql-hidden");
  }
  position(t) {
    const e = t.left + t.width / 2 - this.root.offsetWidth / 2, n = t.bottom + this.quill.root.scrollTop;
    this.root.style.left = `${e}px`, this.root.style.top = `${n}px`, this.root.classList.remove("ql-flip");
    const i = this.boundsContainer.getBoundingClientRect(), s = this.root.getBoundingClientRect();
    let a = 0;
    if (s.right > i.right && (a = i.right - s.right, this.root.style.left = `${e + a}px`), s.left < i.left && (a = i.left - s.left, this.root.style.left = `${e + a}px`), s.bottom > i.bottom) {
      const o = s.bottom - s.top, l = t.bottom - t.top + o;
      this.root.style.top = `${n - l}px`, this.root.classList.add("ql-flip");
    }
    return a;
  }
  show() {
    this.root.classList.remove("ql-editing"), this.root.classList.remove("ql-hidden");
  }
}
const HS = [!1, "center", "right", "justify"], US = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"], VS = [!1, "serif", "monospace"], GS = ["1", "2", "3", !1], WS = ["small", !1, "large", "huge"];
class vs extends ri {
  constructor(t, e) {
    super(t, e);
    const n = (i) => {
      if (!document.body.contains(t.root)) {
        document.body.removeEventListener("click", n);
        return;
      }
      this.tooltip != null && // @ts-expect-error
      !this.tooltip.root.contains(i.target) && // @ts-expect-error
      document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus() && this.tooltip.hide(), this.pickers != null && this.pickers.forEach((s) => {
        s.container.contains(i.target) || s.close();
      });
    };
    t.emitter.listenDOM("click", document.body, n);
  }
  addModule(t) {
    const e = super.addModule(t);
    return t === "toolbar" && this.extendToolbar(e), e;
  }
  buildButtons(t, e) {
    Array.from(t).forEach((n) => {
      (n.getAttribute("class") || "").split(/\s+/).forEach((s) => {
        if (s.startsWith("ql-") && (s = s.slice(3), e[s] != null))
          if (s === "direction")
            n.innerHTML = e[s][""] + e[s].rtl;
          else if (typeof e[s] == "string")
            n.innerHTML = e[s];
          else {
            const a = n.value || "";
            a != null && e[s][a] && (n.innerHTML = e[s][a]);
          }
      });
    });
  }
  buildPickers(t, e) {
    this.pickers = Array.from(t).map((i) => {
      if (i.classList.contains("ql-align") && (i.querySelector("option") == null && qi(i, HS), typeof e.align == "object"))
        return new $p(i, e.align);
      if (i.classList.contains("ql-background") || i.classList.contains("ql-color")) {
        const s = i.classList.contains("ql-background") ? "background" : "color";
        return i.querySelector("option") == null && qi(i, US, s === "background" ? "#ffffff" : "#000000"), new Bp(i, e[s]);
      }
      return i.querySelector("option") == null && (i.classList.contains("ql-font") ? qi(i, VS) : i.classList.contains("ql-header") ? qi(i, GS) : i.classList.contains("ql-size") && qi(i, WS)), new Ja(i);
    });
    const n = () => {
      this.pickers.forEach((i) => {
        i.update();
      });
    };
    this.quill.on(z.events.EDITOR_CHANGE, n);
  }
}
vs.DEFAULTS = Dn({}, ri.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        formula() {
          this.quill.theme.tooltip.edit("formula");
        },
        image() {
          let r = this.container.querySelector("input.ql-image[type=file]");
          r == null && (r = document.createElement("input"), r.setAttribute("type", "file"), r.setAttribute("accept", this.quill.uploader.options.mimetypes.join(", ")), r.classList.add("ql-image"), r.addEventListener("change", () => {
            const t = this.quill.getSelection(!0);
            this.quill.uploader.upload(t, r.files), r.value = "";
          }), this.container.appendChild(r)), r.click();
        },
        video() {
          this.quill.theme.tooltip.edit("video");
        }
      }
    }
  }
});
class Fp extends jp {
  constructor(t, e) {
    super(t, e), this.textbox = this.root.querySelector('input[type="text"]'), this.listen();
  }
  listen() {
    this.textbox.addEventListener("keydown", (t) => {
      t.key === "Enter" ? (this.save(), t.preventDefault()) : t.key === "Escape" && (this.cancel(), t.preventDefault());
    });
  }
  cancel() {
    this.hide(), this.restoreFocus();
  }
  edit() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link", e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (this.root.classList.remove("ql-hidden"), this.root.classList.add("ql-editing"), this.textbox == null) return;
    e != null ? this.textbox.value = e : t !== this.root.getAttribute("data-mode") && (this.textbox.value = "");
    const n = this.quill.getBounds(this.quill.selection.savedRange);
    n != null && this.position(n), this.textbox.select(), this.textbox.setAttribute("placeholder", this.textbox.getAttribute(`data-${t}`) || ""), this.root.setAttribute("data-mode", t);
  }
  restoreFocus() {
    this.quill.focus({
      preventScroll: !0
    });
  }
  save() {
    let {
      value: t
    } = this.textbox;
    switch (this.root.getAttribute("data-mode")) {
      case "link": {
        const {
          scrollTop: e
        } = this.quill.root;
        this.linkRange ? (this.quill.formatText(this.linkRange, "link", t, z.sources.USER), delete this.linkRange) : (this.restoreFocus(), this.quill.format("link", t, z.sources.USER)), this.quill.root.scrollTop = e;
        break;
      }
      case "video":
        t = KS(t);
      case "formula": {
        if (!t) break;
        const e = this.quill.getSelection(!0);
        if (e != null) {
          const n = e.index + e.length;
          this.quill.insertEmbed(
            n,
            // @ts-expect-error Fix me later
            this.root.getAttribute("data-mode"),
            t,
            z.sources.USER
          ), this.root.getAttribute("data-mode") === "formula" && this.quill.insertText(n + 1, " ", z.sources.USER), this.quill.setSelection(n + 2, z.sources.USER);
        }
        break;
      }
    }
    this.textbox.value = "", this.hide();
  }
}
function KS(r) {
  let t = r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  return t ? `${t[1] || "https"}://www.youtube.com/embed/${t[2]}?showinfo=0` : (t = r.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) ? `${t[1] || "https"}://player.vimeo.com/video/${t[2]}/` : r;
}
function qi(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  t.forEach((n) => {
    const i = document.createElement("option");
    n === e ? i.setAttribute("selected", "selected") : i.setAttribute("value", String(n)), r.appendChild(i);
  });
}
const YS = [["bold", "italic", "link"], [{
  header: 1
}, {
  header: 2
}, "blockquote"]];
class Hp extends Fp {
  constructor(t, e) {
    super(t, e), this.quill.on(z.events.EDITOR_CHANGE, (n, i, s, a) => {
      if (n === z.events.SELECTION_CHANGE)
        if (i != null && i.length > 0 && a === z.sources.USER) {
          this.show(), this.root.style.left = "0px", this.root.style.width = "", this.root.style.width = `${this.root.offsetWidth}px`;
          const o = this.quill.getLines(i.index, i.length);
          if (o.length === 1) {
            const l = this.quill.getBounds(i);
            l != null && this.position(l);
          } else {
            const l = o[o.length - 1], c = this.quill.getIndex(l), u = Math.min(l.length() - 1, i.index + i.length - c), h = this.quill.getBounds(new rr(c, u));
            h != null && this.position(h);
          }
        } else document.activeElement !== this.textbox && this.quill.hasFocus() && this.hide();
    });
  }
  listen() {
    super.listen(), this.root.querySelector(".ql-close").addEventListener("click", () => {
      this.root.classList.remove("ql-editing");
    }), this.quill.on(z.events.SCROLL_OPTIMIZE, () => {
      setTimeout(() => {
        if (this.root.classList.contains("ql-hidden")) return;
        const t = this.quill.getSelection();
        if (t != null) {
          const e = this.quill.getBounds(t);
          e != null && this.position(e);
        }
      }, 1);
    });
  }
  cancel() {
    this.show();
  }
  position(t) {
    const e = super.position(t), n = this.root.querySelector(".ql-tooltip-arrow");
    return n.style.marginLeft = "", e !== 0 && (n.style.marginLeft = `${-1 * e - n.offsetWidth / 2}px`), e;
  }
}
_(Hp, "TEMPLATE", ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join(""));
class Up extends vs {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = YS), super(t, e), this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(t) {
    this.tooltip = new Hp(this.quill, this.options.bounds), t.container != null && (this.tooltip.root.appendChild(t.container), this.buildButtons(t.container.querySelectorAll("button"), os), this.buildPickers(t.container.querySelectorAll("select"), os));
  }
}
Up.DEFAULTS = Dn({}, vs.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(r) {
          r ? this.quill.theme.tooltip.edit() : this.quill.format("link", !1, O.sources.USER);
        }
      }
    }
  }
});
const QS = [[{
  header: ["1", "2", "3", !1]
}], ["bold", "italic", "underline", "link"], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["clean"]];
class Vp extends Fp {
  constructor() {
    super(...arguments);
    _(this, "preview", this.root.querySelector("a.ql-preview"));
  }
  listen() {
    super.listen(), this.root.querySelector("a.ql-action").addEventListener("click", (e) => {
      this.root.classList.contains("ql-editing") ? this.save() : this.edit("link", this.preview.textContent), e.preventDefault();
    }), this.root.querySelector("a.ql-remove").addEventListener("click", (e) => {
      if (this.linkRange != null) {
        const n = this.linkRange;
        this.restoreFocus(), this.quill.formatText(n, "link", !1, z.sources.USER), delete this.linkRange;
      }
      e.preventDefault(), this.hide();
    }), this.quill.on(z.events.SELECTION_CHANGE, (e, n, i) => {
      if (e != null) {
        if (e.length === 0 && i === z.sources.USER) {
          const [s, a] = this.quill.scroll.descendant(Ln, e.index);
          if (s != null) {
            this.linkRange = new rr(e.index - a, s.length());
            const o = Ln.formats(s.domNode);
            this.preview.textContent = o, this.preview.setAttribute("href", o), this.show();
            const l = this.quill.getBounds(this.linkRange);
            l != null && this.position(l);
            return;
          }
        } else
          delete this.linkRange;
        this.hide();
      }
    });
  }
  show() {
    super.show(), this.root.removeAttribute("data-mode");
  }
}
_(Vp, "TEMPLATE", ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join(""));
class Gp extends vs {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = QS), super(t, e), this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(t) {
    t.container != null && (t.container.classList.add("ql-snow"), this.buildButtons(t.container.querySelectorAll("button"), os), this.buildPickers(t.container.querySelectorAll("select"), os), this.tooltip = new Vp(this.quill, this.options.bounds), t.container.querySelector(".ql-link") && this.quill.keyboard.addBinding({
      key: "k",
      shortKey: !0
    }, (e, n) => {
      t.handlers.link.call(t, !n.format.link);
    }));
  }
}
Gp.DEFAULTS = Dn({}, vs.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(r) {
          if (r) {
            const t = this.quill.getSelection();
            if (t == null || t.length === 0) return;
            let e = this.quill.getText(t);
            /^\S+@\S+\.\S+$/.test(e) && e.indexOf("mailto:") !== 0 && (e = `mailto:${e}`);
            const {
              tooltip: n
            } = this.quill.theme;
            n.edit("link", e);
          } else
            this.quill.format("link", !1, O.sources.USER);
        }
      }
    }
  }
});
O.register({
  "attributors/attribute/direction": Ep,
  "attributors/class/align": Sp,
  "attributors/class/background": fx,
  "attributors/class/color": hx,
  "attributors/class/direction": Cp,
  "attributors/class/font": Dp,
  "attributors/class/size": Ip,
  "attributors/style/align": kp,
  "attributors/style/background": fu,
  "attributors/style/color": hu,
  "attributors/style/direction": Tp,
  "attributors/style/font": Op,
  "attributors/style/size": Np
}, !0);
O.register({
  "formats/align": Sp,
  "formats/direction": Cp,
  "formats/indent": rS,
  "formats/background": fu,
  "formats/color": hu,
  "formats/font": Dp,
  "formats/size": Ip,
  "formats/blockquote": oc,
  "formats/code-block": _t,
  "formats/header": lc,
  "formats/list": ys,
  "formats/bold": as,
  "formats/code": pu,
  "formats/italic": cc,
  "formats/link": Ln,
  "formats/script": uc,
  "formats/strike": dc,
  "formats/underline": hc,
  "formats/formula": da,
  "formats/image": iS,
  "formats/video": ha,
  "modules/syntax": Pp,
  "modules/table": aS,
  "modules/toolbar": vu,
  "themes/bubble": Up,
  "themes/snow": Gp,
  "ui/icons": os,
  "ui/picker": Ja,
  "ui/icon-picker": $p,
  "ui/color-picker": Bp,
  "ui/tooltip": jp
}, !0);
const Hu = class Hu {
  /**
   * Detect if the current document is in RTL mode
   */
  static isRTL() {
    var e;
    if (this.cachedDirection !== null)
      return this.cachedDirection === "rtl";
    const t = [
      // Check document direction
      document.documentElement.getAttribute("dir"),
      // Check html lang attribute for RTL languages
      this.getDirectionFromLanguage(document.documentElement.getAttribute("lang")),
      // Check body direction
      (e = document.body) == null ? void 0 : e.getAttribute("dir"),
      // Check computed style
      window.getComputedStyle(document.documentElement).direction
    ];
    for (const n of t) {
      if (n === "rtl")
        return this.cachedDirection = "rtl", !0;
      if (n === "ltr")
        return this.cachedDirection = "ltr", !1;
    }
    return this.cachedDirection = "ltr", !1;
  }
  /**
   * Get direction based on language code
   */
  static getDirectionFromLanguage(t) {
    if (!t) return null;
    const e = [
      "ar",
      "he",
      "fa",
      "ur",
      "ps",
      "sd",
      "ug",
      "yi",
      "arc",
      "ckb",
      "dv",
      "ha",
      "ji",
      "ku",
      "ks",
      "ms",
      "nqo",
      "pnb",
      "prs",
      "ug",
      "uz"
    ], n = t.toLowerCase().split("-")[0];
    return e.includes(n) ? "rtl" : "ltr";
  }
  /**
   * Clear cached direction (useful for dynamic changes)
   */
  static clearCache() {
    this.cachedDirection = null;
  }
  /**
   * Transform directional class names for RTL
   */
  static transformDirectionalClasses(t) {
    if (!this.isRTL())
      return t;
    const e = /* @__PURE__ */ new Map([
      // Margin classes
      ["ml-", "mr-"],
      ["mr-", "ml-"],
      ["ms-", "me-"],
      ["me-", "ms-"],
      // Padding classes
      ["pl-", "pr-"],
      ["pr-", "pl-"],
      ["ps-", "pe-"],
      ["pe-", "ps-"],
      // Border classes
      ["border-l-", "border-r-"],
      ["border-r-", "border-l-"],
      ["border-s-", "border-e-"],
      ["border-e-", "border-s-"],
      // Border radius classes
      ["rounded-l-", "rounded-r-"],
      ["rounded-r-", "rounded-l-"],
      ["rounded-s-", "rounded-e-"],
      ["rounded-e-", "rounded-s-"],
      ["rounded-tl-", "rounded-tr-"],
      ["rounded-tr-", "rounded-tl-"],
      ["rounded-bl-", "rounded-br-"],
      ["rounded-br-", "rounded-bl-"],
      ["rounded-ss-", "rounded-se-"],
      ["rounded-se-", "rounded-ss-"],
      ["rounded-es-", "rounded-ee-"],
      ["rounded-ee-", "rounded-es-"],
      // Position classes
      ["left-", "right-"],
      ["right-", "left-"],
      ["start-", "end-"],
      ["end-", "start-"],
      // Text alignment
      ["text-left", "text-right"],
      ["text-right", "text-left"],
      // Flexbox
      ["justify-start", "justify-end"],
      ["justify-end", "justify-start"],
      ["items-start", "items-end"],
      ["items-end", "items-start"],
      ["self-start", "self-end"],
      ["self-end", "self-start"],
      // Float
      ["float-left", "float-right"],
      ["float-right", "float-left"],
      // Clear
      ["clear-left", "clear-right"],
      ["clear-right", "clear-left"]
    ]);
    let n = t;
    for (const [i, s] of e) {
      const a = new RegExp(`\\b${i.replace("-", "\\-")}([\\w\\-\\.\\[\\]%\\/]+)?\\b`, "g");
      new RegExp(`\\b${s.replace("-", "\\-")}([\\w\\-\\.\\[\\]%\\/]+)?\\b`, "g"), n = n.replace(a, (o, l) => s + (l || ""));
    }
    return n;
  }
  /**
   * Get the opposite direction for icon positioning
   */
  static getOppositePosition(t) {
    return this.isRTL() ? t === "left" ? "right" : "left" : t;
  }
  /**
   * Get logical position (start/end) based on physical position (left/right)
   */
  static getLogicalPosition(t) {
    return this.isRTL() ? t === "left" ? "end" : "start" : t === "left" ? "start" : "end";
  }
  /**
   * Get physical position from logical position
   */
  static getPhysicalPosition(t) {
    return this.isRTL() ? t === "start" ? "right" : "left" : t === "start" ? "left" : "right";
  }
  /**
   * Add RTL-aware classes to an element
   */
  static addRTLClasses(t, e) {
    const n = this.transformDirectionalClasses(e);
    t.classList.add(...n.split(" ").filter((i) => i.trim()));
  }
  /**
   * Remove RTL-aware classes from an element
   */
  static removeRTLClasses(t, e) {
    const n = this.transformDirectionalClasses(e);
    t.classList.remove(...n.split(" ").filter((i) => i.trim()));
  }
  /**
   * Listen for direction changes and clear cache
   */
  static observeDirectionChanges() {
    const t = new MutationObserver((e) => {
      for (const n of e)
        if (n.type === "attributes" && (n.attributeName === "dir" || n.attributeName === "lang")) {
          this.clearCache(), document.dispatchEvent(new CustomEvent("keys:direction-change", {
            detail: { isRTL: this.isRTL() }
          }));
          break;
        }
    });
    t.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["dir", "lang"]
    }), t.observe(document.body, {
      attributes: !0,
      attributeFilter: ["dir", "lang"]
    });
  }
  /**
   * Get dropdown positioning for RTL
   */
  static getDropdownPosition(t, e) {
    let n = t, i = e;
    return this.isRTL() && (n === "left" ? n = "right" : n === "right" && (n = "left"), (t === "top" || t === "bottom") && (e === "start" ? i = "end" : e === "end" && (i = "start"))), { position: n, align: i };
  }
  /**
   * Initialize RTL support globally
   */
  static initialize() {
    this.isRTL() ? (document.documentElement.classList.add("rtl"), document.documentElement.setAttribute("dir", "rtl")) : (document.documentElement.classList.add("ltr"), document.documentElement.setAttribute("dir", "ltr")), this.observeDirectionChanges();
    const t = document.createElement("style");
    t.textContent = `
            :root {
                --direction-factor: ${this.isRTL() ? "-1" : "1"};
                --text-align-start: ${this.isRTL() ? "right" : "left"};
                --text-align-end: ${this.isRTL() ? "left" : "right"};
            }
        `, document.head.appendChild(t);
  }
};
Hu.cachedDirection = null;
let fc = Hu;
var ZS = Object.defineProperty, XS = Object.defineProperties, JS = Object.getOwnPropertyDescriptors, rh = Object.getOwnPropertySymbols, tk = Object.prototype.hasOwnProperty, ek = Object.prototype.propertyIsEnumerable, ih = (r, t, e) => t in r ? ZS(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, G = (r, t) => {
  for (var e in t || (t = {}))
    tk.call(t, e) && ih(r, e, t[e]);
  if (rh)
    for (var e of rh(t))
      ek.call(t, e) && ih(r, e, t[e]);
  return r;
}, jt = (r, t) => XS(r, JS(t)), yt = (r, t, e) => new Promise((n, i) => {
  var s = (l) => {
    try {
      o(e.next(l));
    } catch (c) {
      i(c);
    }
  }, a = (l) => {
    try {
      o(e.throw(l));
    } catch (c) {
      i(c);
    }
  }, o = (l) => l.done ? n(l.value) : Promise.resolve(l.value).then(s, a);
  o((e = e.apply(r, t)).next());
});
const pc = Math.min, $r = Math.max, Ta = Math.round, ta = Math.floor, Nn = (r) => ({
  x: r,
  y: r
});
function nk(r, t) {
  return typeof r == "function" ? r(t) : r;
}
function rk(r) {
  return G({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, r);
}
function ik(r) {
  return typeof r != "number" ? rk(r) : {
    top: r,
    right: r,
    bottom: r,
    left: r
  };
}
function La(r) {
  const {
    x: t,
    y: e,
    width: n,
    height: i
  } = r;
  return {
    width: n,
    height: i,
    top: e,
    left: t,
    right: t + n,
    bottom: e + i,
    x: t,
    y: e
  };
}
function sk(r, t) {
  return yt(this, null, function* () {
    var e;
    t === void 0 && (t = {});
    const {
      x: n,
      y: i,
      platform: s,
      rects: a,
      elements: o,
      strategy: l
    } = r, {
      boundary: c = "clippingAncestors",
      rootBoundary: u = "viewport",
      elementContext: h = "floating",
      altBoundary: f = !1,
      padding: p = 0
    } = nk(t, r), m = ik(p), y = o[f ? h === "floating" ? "reference" : "floating" : h], w = La(yield s.getClippingRect({
      element: (e = yield s.isElement == null ? void 0 : s.isElement(y)) == null || e ? y : y.contextElement || (yield s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
      boundary: c,
      rootBoundary: u,
      strategy: l
    })), v = h === "floating" ? {
      x: n,
      y: i,
      width: a.floating.width,
      height: a.floating.height
    } : a.reference, S = yield s.getOffsetParent == null ? void 0 : s.getOffsetParent(o.floating), A = (yield s.isElement == null ? void 0 : s.isElement(S)) ? (yield s.getScale == null ? void 0 : s.getScale(S)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    }, E = La(s.convertOffsetParentRelativeRectToViewportRelativeRect ? yield s.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements: o,
      rect: v,
      offsetParent: S,
      strategy: l
    }) : v);
    return {
      top: (w.top - E.top + m.top) / A.y,
      bottom: (E.bottom - w.bottom + m.bottom) / A.y,
      left: (w.left - E.left + m.left) / A.x,
      right: (E.right - w.right + m.right) / A.x
    };
  });
}
function fi(r) {
  return Wp(r) ? (r.nodeName || "").toLowerCase() : "#document";
}
function Jt(r) {
  var t;
  return (r == null || (t = r.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function vn(r) {
  var t;
  return (t = (Wp(r) ? r.ownerDocument : r.document) || window.document) == null ? void 0 : t.documentElement;
}
function Wp(r) {
  return r instanceof Node || r instanceof Jt(r).Node;
}
function Je(r) {
  return r instanceof Element || r instanceof Jt(r).Element;
}
function tn(r) {
  return r instanceof HTMLElement || r instanceof Jt(r).HTMLElement;
}
function sh(r) {
  return typeof ShadowRoot > "u" ? !1 : r instanceof ShadowRoot || r instanceof Jt(r).ShadowRoot;
}
function ws(r) {
  const {
    overflow: t,
    overflowX: e,
    overflowY: n,
    display: i
  } = Oe(r);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + e) && !["inline", "contents"].includes(i);
}
function ak(r) {
  return ["table", "td", "th"].includes(fi(r));
}
function to(r) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return r.matches(t);
    } catch {
      return !1;
    }
  });
}
function wu(r) {
  const t = xu(), e = Oe(r);
  return e.transform !== "none" || e.perspective !== "none" || (e.containerType ? e.containerType !== "normal" : !1) || !t && (e.backdropFilter ? e.backdropFilter !== "none" : !1) || !t && (e.filter ? e.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((n) => (e.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (e.contain || "").includes(n));
}
function ok(r) {
  let t = Mn(r);
  for (; tn(t) && !si(t); ) {
    if (to(t))
      return null;
    if (wu(t))
      return t;
    t = Mn(t);
  }
  return null;
}
function xu() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function si(r) {
  return ["html", "body", "#document"].includes(fi(r));
}
function Oe(r) {
  return Jt(r).getComputedStyle(r);
}
function eo(r) {
  return Je(r) ? {
    scrollLeft: r.scrollLeft,
    scrollTop: r.scrollTop
  } : {
    scrollLeft: r.scrollX,
    scrollTop: r.scrollY
  };
}
function Mn(r) {
  if (fi(r) === "html")
    return r;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    r.assignedSlot || // DOM Element detected.
    r.parentNode || // ShadowRoot detected.
    sh(r) && r.host || // Fallback.
    vn(r)
  );
  return sh(t) ? t.host : t;
}
function Kp(r) {
  const t = Mn(r);
  return si(t) ? r.ownerDocument ? r.ownerDocument.body : r.body : tn(t) && ws(t) ? t : Kp(t);
}
function ls(r, t, e) {
  var n;
  t === void 0 && (t = []), e === void 0 && (e = !0);
  const i = Kp(r), s = i === ((n = r.ownerDocument) == null ? void 0 : n.body), a = Jt(i);
  return s ? t.concat(a, a.visualViewport || [], ws(i) ? i : [], a.frameElement && e ? ls(a.frameElement) : []) : t.concat(i, ls(i, [], e));
}
function Yp(r) {
  const t = Oe(r);
  let e = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const i = tn(r), s = i ? r.offsetWidth : e, a = i ? r.offsetHeight : n, o = Ta(e) !== s || Ta(n) !== a;
  return o && (e = s, n = a), {
    width: e,
    height: n,
    $: o
  };
}
function Su(r) {
  return Je(r) ? r : r.contextElement;
}
function jr(r) {
  const t = Su(r);
  if (!tn(t))
    return Nn(1);
  const e = t.getBoundingClientRect(), {
    width: n,
    height: i,
    $: s
  } = Yp(t);
  let a = (s ? Ta(e.width) : e.width) / n, o = (s ? Ta(e.height) : e.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const lk = /* @__PURE__ */ Nn(0);
function Qp(r) {
  const t = Jt(r);
  return !xu() || !t.visualViewport ? lk : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function ck(r, t, e) {
  return t === void 0 && (t = !1), !e || t && e !== Jt(r) ? !1 : t;
}
function ir(r, t, e, n) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  const i = r.getBoundingClientRect(), s = Su(r);
  let a = Nn(1);
  t && (n ? Je(n) && (a = jr(n)) : a = jr(r));
  const o = ck(s, e, n) ? Qp(s) : Nn(0);
  let l = (i.left + o.x) / a.x, c = (i.top + o.y) / a.y, u = i.width / a.x, h = i.height / a.y;
  if (s) {
    const f = Jt(s), p = n && Je(n) ? Jt(n) : n;
    let m = f, y = m.frameElement;
    for (; y && n && p !== m; ) {
      const w = jr(y), v = y.getBoundingClientRect(), S = Oe(y), A = v.left + (y.clientLeft + parseFloat(S.paddingLeft)) * w.x, E = v.top + (y.clientTop + parseFloat(S.paddingTop)) * w.y;
      l *= w.x, c *= w.y, u *= w.x, h *= w.y, l += A, c += E, m = Jt(y), y = m.frameElement;
    }
  }
  return La({
    width: u,
    height: h,
    x: l,
    y: c
  });
}
function uk(r) {
  let {
    elements: t,
    rect: e,
    offsetParent: n,
    strategy: i
  } = r;
  const s = i === "fixed", a = vn(n), o = t ? to(t.floating) : !1;
  if (n === a || o && s)
    return e;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Nn(1);
  const u = Nn(0), h = tn(n);
  if ((h || !h && !s) && ((fi(n) !== "body" || ws(a)) && (l = eo(n)), tn(n))) {
    const f = ir(n);
    c = jr(n), u.x = f.x + n.clientLeft, u.y = f.y + n.clientTop;
  }
  return {
    width: e.width * c.x,
    height: e.height * c.y,
    x: e.x * c.x - l.scrollLeft * c.x + u.x,
    y: e.y * c.y - l.scrollTop * c.y + u.y
  };
}
function dk(r) {
  return Array.from(r.getClientRects());
}
function Zp(r) {
  return ir(vn(r)).left + eo(r).scrollLeft;
}
function hk(r) {
  const t = vn(r), e = eo(r), n = r.ownerDocument.body, i = $r(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = $r(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -e.scrollLeft + Zp(r);
  const o = -e.scrollTop;
  return Oe(n).direction === "rtl" && (a += $r(t.clientWidth, n.clientWidth) - i), {
    width: i,
    height: s,
    x: a,
    y: o
  };
}
function fk(r, t) {
  const e = Jt(r), n = vn(r), i = e.visualViewport;
  let s = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (i) {
    s = i.width, a = i.height;
    const c = xu();
    (!c || c && t === "fixed") && (o = i.offsetLeft, l = i.offsetTop);
  }
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
function pk(r, t) {
  const e = ir(r, !0, t === "fixed"), n = e.top + r.clientTop, i = e.left + r.clientLeft, s = tn(r) ? jr(r) : Nn(1), a = r.clientWidth * s.x, o = r.clientHeight * s.y, l = i * s.x, c = n * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: c
  };
}
function ah(r, t, e) {
  let n;
  if (t === "viewport")
    n = fk(r, e);
  else if (t === "document")
    n = hk(vn(r));
  else if (Je(t))
    n = pk(t, e);
  else {
    const i = Qp(r);
    n = jt(G({}, t), {
      x: t.x - i.x,
      y: t.y - i.y
    });
  }
  return La(n);
}
function Xp(r, t) {
  const e = Mn(r);
  return e === t || !Je(e) || si(e) ? !1 : Oe(e).position === "fixed" || Xp(e, t);
}
function gk(r, t) {
  const e = t.get(r);
  if (e)
    return e;
  let n = ls(r, [], !1).filter((o) => Je(o) && fi(o) !== "body"), i = null;
  const s = Oe(r).position === "fixed";
  let a = s ? Mn(r) : r;
  for (; Je(a) && !si(a); ) {
    const o = Oe(a), l = wu(a);
    !l && o.position === "fixed" && (i = null), (s ? !l && !i : !l && o.position === "static" && i && ["absolute", "fixed"].includes(i.position) || ws(a) && !l && Xp(r, a)) ? n = n.filter((c) => c !== a) : i = o, a = Mn(a);
  }
  return t.set(r, n), n;
}
function mk(r) {
  let {
    element: t,
    boundary: e,
    rootBoundary: n,
    strategy: i
  } = r;
  const s = [...e === "clippingAncestors" ? to(t) ? [] : gk(t, this._c) : [].concat(e), n], a = s[0], o = s.reduce((l, c) => {
    const u = ah(t, c, i);
    return l.top = $r(u.top, l.top), l.right = pc(u.right, l.right), l.bottom = pc(u.bottom, l.bottom), l.left = $r(u.left, l.left), l;
  }, ah(t, a, i));
  return {
    width: o.right - o.left,
    height: o.bottom - o.top,
    x: o.left,
    y: o.top
  };
}
function bk(r) {
  const {
    width: t,
    height: e
  } = Yp(r);
  return {
    width: t,
    height: e
  };
}
function yk(r, t, e) {
  const n = tn(t), i = vn(t), s = e === "fixed", a = ir(r, !0, s, t);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Nn(0);
  if (n || !n && !s)
    if ((fi(t) !== "body" || ws(i)) && (o = eo(t)), n) {
      const h = ir(t, !0, s, t);
      l.x = h.x + t.clientLeft, l.y = h.y + t.clientTop;
    } else i && (l.x = Zp(i));
  const c = a.left + o.scrollLeft - l.x, u = a.top + o.scrollTop - l.y;
  return {
    x: c,
    y: u,
    width: a.width,
    height: a.height
  };
}
function pl(r) {
  return Oe(r).position === "static";
}
function oh(r, t) {
  return !tn(r) || Oe(r).position === "fixed" ? null : t ? t(r) : r.offsetParent;
}
function Jp(r, t) {
  const e = Jt(r);
  if (to(r))
    return e;
  if (!tn(r)) {
    let i = Mn(r);
    for (; i && !si(i); ) {
      if (Je(i) && !pl(i))
        return i;
      i = Mn(i);
    }
    return e;
  }
  let n = oh(r, t);
  for (; n && ak(n) && pl(n); )
    n = oh(n, t);
  return n && si(n) && pl(n) && !wu(n) ? e : n || ok(r) || e;
}
const vk = function(r) {
  return yt(this, null, function* () {
    const t = this.getOffsetParent || Jp, e = this.getDimensions, n = yield e(r.floating);
    return {
      reference: yk(r.reference, yield t(r.floating), r.strategy),
      floating: {
        x: 0,
        y: 0,
        width: n.width,
        height: n.height
      }
    };
  });
};
function wk(r) {
  return Oe(r).direction === "rtl";
}
const le = {
  convertOffsetParentRelativeRectToViewportRelativeRect: uk,
  getDocumentElement: vn,
  getClippingRect: mk,
  getOffsetParent: Jp,
  getElementRects: vk,
  getClientRects: dk,
  getDimensions: bk,
  getScale: jr,
  isElement: Je,
  isRTL: wk
};
function xk(r, t) {
  let e = null, n;
  const i = vn(r);
  function s() {
    var o;
    clearTimeout(n), (o = e) == null || o.disconnect(), e = null;
  }
  function a(o, l) {
    o === void 0 && (o = !1), l === void 0 && (l = 1), s();
    const {
      left: c,
      top: u,
      width: h,
      height: f
    } = r.getBoundingClientRect();
    if (o || t(), !h || !f)
      return;
    const p = ta(u), m = ta(i.clientWidth - (c + h)), y = ta(i.clientHeight - (u + f)), w = ta(c), v = {
      rootMargin: -p + "px " + -m + "px " + -y + "px " + -w + "px",
      threshold: $r(0, pc(1, l)) || 1
    };
    let S = !0;
    function A(E) {
      const T = E[0].intersectionRatio;
      if (T !== l) {
        if (!S)
          return a();
        T ? a(!1, T) : n = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      S = !1;
    }
    try {
      e = new IntersectionObserver(A, jt(G({}, v), {
        // Handle <iframe>s
        root: i.ownerDocument
      }));
    } catch {
      e = new IntersectionObserver(A, v);
    }
    e.observe(r);
  }
  return a(!0), s;
}
function tg(r, t, e, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Su(r), u = i || s ? [...c ? ls(c) : [], ...ls(t)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", e, {
      passive: !0
    }), s && v.addEventListener("resize", e);
  });
  const h = c && o ? xk(c, e) : null;
  let f = -1, p = null;
  a && (p = new ResizeObserver((v) => {
    let [S] = v;
    S && S.target === c && p && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var A;
      (A = p) == null || A.observe(t);
    })), e();
  }), c && !l && p.observe(c), p.observe(t));
  let m, y = l ? ir(r) : null;
  l && w();
  function w() {
    const v = ir(r);
    y && (v.x !== y.x || v.y !== y.y || v.width !== y.width || v.height !== y.height) && e(), y = v, m = requestAnimationFrame(w);
  }
  return e(), () => {
    var v;
    u.forEach((S) => {
      i && S.removeEventListener("scroll", e), s && S.removeEventListener("resize", e);
    }), h == null || h(), (v = p) == null || v.disconnect(), p = null, l && cancelAnimationFrame(m);
  };
}
const Sk = sk, gl = 0, R = 1, Y = 2, bt = 3, ot = 4, sn = 5, no = 6, Nt = 7, Gt = 8, K = 9, F = 10, dt = 11, W = 12, ft = 13, xs = 14, Wt = 15, Rt = 16, Kt = 17, an = 18, ee = 19, Ie = 20, kt = 21, rt = 22, zt = 23, de = 24, Ht = 25, kk = 0;
function At(r) {
  return r >= 48 && r <= 57;
}
function qn(r) {
  return At(r) || // 0 .. 9
  r >= 65 && r <= 70 || // A .. F
  r >= 97 && r <= 102;
}
function ku(r) {
  return r >= 65 && r <= 90;
}
function Ak(r) {
  return r >= 97 && r <= 122;
}
function Ek(r) {
  return ku(r) || Ak(r);
}
function Ck(r) {
  return r >= 128;
}
function Da(r) {
  return Ek(r) || Ck(r) || r === 95;
}
function eg(r) {
  return Da(r) || At(r) || r === 45;
}
function Tk(r) {
  return r >= 0 && r <= 8 || r === 11 || r >= 14 && r <= 31 || r === 127;
}
function Oa(r) {
  return r === 10 || r === 13 || r === 12;
}
function sr(r) {
  return Oa(r) || r === 32 || r === 9;
}
function Ve(r, t) {
  return !(r !== 92 || Oa(t) || t === kk);
}
function fa(r, t, e) {
  return r === 45 ? Da(t) || t === 45 || Ve(t, e) : Da(r) ? !0 : r === 92 ? Ve(r, t) : !1;
}
function ml(r, t, e) {
  return r === 43 || r === 45 ? At(t) ? 2 : t === 46 && At(e) ? 3 : 0 : r === 46 ? At(t) ? 2 : 0 : At(r) ? 1 : 0;
}
function ng(r) {
  return r === 65279 || r === 65534 ? 1 : 0;
}
const gc = new Array(128), Lk = 128, pa = 130, rg = 131, Au = 132, ig = 133;
for (let r = 0; r < gc.length; r++)
  gc[r] = sr(r) && pa || At(r) && rg || Da(r) && Au || Tk(r) && ig || r || Lk;
function bl(r) {
  return r < 128 ? gc[r] : Au;
}
function Fr(r, t) {
  return t < r.length ? r.charCodeAt(t) : 0;
}
function mc(r, t, e) {
  return e === 13 && Fr(r, t + 1) === 10 ? 2 : 1;
}
function Hr(r, t, e) {
  let n = r.charCodeAt(t);
  return ku(n) && (n = n | 32), n === e;
}
function cs(r, t, e, n) {
  if (e - t !== n.length || t < 0 || e > r.length)
    return !1;
  for (let i = t; i < e; i++) {
    const s = n.charCodeAt(i - t);
    let a = r.charCodeAt(i);
    if (ku(a) && (a = a | 32), a !== s)
      return !1;
  }
  return !0;
}
function Dk(r, t) {
  for (; t >= 0 && sr(r.charCodeAt(t)); t--)
    ;
  return t + 1;
}
function ea(r, t) {
  for (; t < r.length && sr(r.charCodeAt(t)); t++)
    ;
  return t;
}
function yl(r, t) {
  for (; t < r.length && At(r.charCodeAt(t)); t++)
    ;
  return t;
}
function ai(r, t) {
  if (t += 2, qn(Fr(r, t - 1))) {
    for (const n = Math.min(r.length, t + 5); t < n && qn(Fr(r, t)); t++)
      ;
    const e = Fr(r, t);
    sr(e) && (t += mc(r, t, e));
  }
  return t;
}
function na(r, t) {
  for (; t < r.length; t++) {
    const e = r.charCodeAt(t);
    if (!eg(e)) {
      if (Ve(e, Fr(r, t + 1))) {
        t = ai(r, t) - 1;
        continue;
      }
      break;
    }
  }
  return t;
}
function ro(r, t) {
  let e = r.charCodeAt(t);
  if ((e === 43 || e === 45) && (e = r.charCodeAt(t += 1)), At(e) && (t = yl(r, t + 1), e = r.charCodeAt(t)), e === 46 && At(r.charCodeAt(t + 1)) && (t += 2, t = yl(r, t)), Hr(
    r,
    t,
    101
    /* e */
  )) {
    let n = 0;
    e = r.charCodeAt(t + 1), (e === 45 || e === 43) && (n = 1, e = r.charCodeAt(t + 2)), At(e) && (t = yl(r, t + 1 + n + 1));
  }
  return t;
}
function vl(r, t) {
  for (; t < r.length; t++) {
    const e = r.charCodeAt(t);
    if (e === 41) {
      t++;
      break;
    }
    Ve(e, Fr(r, t + 1)) && (t = ai(r, t));
  }
  return t;
}
function sg(r) {
  if (r.length === 1 && !qn(r.charCodeAt(0)))
    return r[0];
  let t = parseInt(r, 16);
  return (t === 0 || // If this number is zero,
  t >= 55296 && t <= 57343 || // or is for a surrogate,
  t > 1114111) && (t = 65533), String.fromCodePoint(t);
}
const ag = [
  "EOF-token",
  "ident-token",
  "function-token",
  "at-keyword-token",
  "hash-token",
  "string-token",
  "bad-string-token",
  "url-token",
  "bad-url-token",
  "delim-token",
  "number-token",
  "percentage-token",
  "dimension-token",
  "whitespace-token",
  "CDO-token",
  "CDC-token",
  "colon-token",
  "semicolon-token",
  "comma-token",
  "[-token",
  "]-token",
  "(-token",
  ")-token",
  "{-token",
  "}-token"
], Ok = 16 * 1024;
function Ia(r = null, t) {
  return r === null || r.length < t ? new Uint32Array(Math.max(t + 1024, Ok)) : r;
}
const lh = 10, Ik = 12, ch = 13;
function uh(r) {
  const t = r.source, e = t.length, n = t.length > 0 ? ng(t.charCodeAt(0)) : 0, i = Ia(r.lines, e), s = Ia(r.columns, e);
  let a = r.startLine, o = r.startColumn;
  for (let l = n; l < e; l++) {
    const c = t.charCodeAt(l);
    i[l] = a, s[l] = o++, (c === lh || c === ch || c === Ik) && (c === ch && l + 1 < e && t.charCodeAt(l + 1) === lh && (l++, i[l] = a, s[l] = o), a++, o = 1);
  }
  i[e] = a, s[e] = o, r.lines = i, r.columns = s, r.computed = !0;
}
class Nk {
  constructor() {
    this.lines = null, this.columns = null, this.computed = !1;
  }
  setSource(t, e = 0, n = 1, i = 1) {
    this.source = t, this.startOffset = e, this.startLine = n, this.startColumn = i, this.computed = !1;
  }
  getLocation(t, e) {
    return this.computed || uh(this), {
      source: e,
      offset: this.startOffset + t,
      line: this.lines[t],
      column: this.columns[t]
    };
  }
  getLocationRange(t, e, n) {
    return this.computed || uh(this), {
      source: n,
      start: {
        offset: this.startOffset + t,
        line: this.lines[t],
        column: this.columns[t]
      },
      end: {
        offset: this.startOffset + e,
        line: this.lines[e],
        column: this.columns[e]
      }
    };
  }
}
const re = 16777215, Sn = 24, Mk = /* @__PURE__ */ new Map([
  [Y, rt],
  [kt, rt],
  [ee, Ie],
  [zt, de]
]);
class qk {
  constructor(t, e) {
    this.setSource(t, e);
  }
  reset() {
    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
  }
  setSource(t = "", e = () => {
  }) {
    t = String(t || "");
    const n = t.length, i = Ia(this.offsetAndType, t.length + 1), s = Ia(this.balance, t.length + 1);
    let a = 0, o = 0, l = 0, c = -1;
    for (this.offsetAndType = null, this.balance = null, e(t, (u, h, f) => {
      switch (u) {
        default:
          s[a] = n;
          break;
        case o: {
          let p = l & re;
          for (l = s[p], o = l >> Sn, s[a] = p, s[p++] = a; p < a; p++)
            s[p] === n && (s[p] = a);
          break;
        }
        case kt:
        case Y:
        case ee:
        case zt:
          s[a] = l, o = Mk.get(u), l = o << Sn | a;
          break;
      }
      i[a++] = u << Sn | f, c === -1 && (c = h);
    }), i[a] = gl << Sn | n, s[a] = n, s[n] = n; l !== 0; ) {
      const u = l & re;
      l = s[u], s[u] = n;
    }
    this.source = t, this.firstCharOffset = c === -1 ? 0 : c, this.tokenCount = a, this.offsetAndType = i, this.balance = s, this.reset(), this.next();
  }
  lookupType(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t] >> Sn : gl;
  }
  lookupOffset(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t - 1] & re : this.source.length;
  }
  lookupValue(t, e) {
    return t += this.tokenIndex, t < this.tokenCount ? cs(
      this.source,
      this.offsetAndType[t - 1] & re,
      this.offsetAndType[t] & re,
      e
    ) : !1;
  }
  getTokenStart(t) {
    return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & re : this.offsetAndType[this.tokenCount] & re : this.firstCharOffset;
  }
  substrToCursor(t) {
    return this.source.substring(t, this.tokenStart);
  }
  isBalanceEdge(t) {
    return this.balance[this.tokenIndex] < t;
  }
  isDelim(t, e) {
    return e ? this.lookupType(e) === K && this.source.charCodeAt(this.lookupOffset(e)) === t : this.tokenType === K && this.source.charCodeAt(this.tokenStart) === t;
  }
  skip(t) {
    let e = this.tokenIndex + t;
    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.offsetAndType[e - 1] & re, e = this.offsetAndType[e], this.tokenType = e >> Sn, this.tokenEnd = e & re) : (this.tokenIndex = this.tokenCount, this.next());
  }
  next() {
    let t = this.tokenIndex + 1;
    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.tokenEnd, t = this.offsetAndType[t], this.tokenType = t >> Sn, this.tokenEnd = t & re) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = gl, this.tokenStart = this.tokenEnd = this.source.length);
  }
  skipSC() {
    for (; this.tokenType === ft || this.tokenType === Ht; )
      this.next();
  }
  skipUntilBalanced(t, e) {
    let n = t, i, s;
    t:
      for (; n < this.tokenCount; n++) {
        if (i = this.balance[n], i < t)
          break t;
        switch (s = n > 0 ? this.offsetAndType[n - 1] & re : this.firstCharOffset, e(this.source.charCodeAt(s))) {
          case 1:
            break t;
          case 2:
            n++;
            break t;
          default:
            this.balance[i] === n && (n = i);
        }
      }
    this.skip(n - this.tokenIndex);
  }
  forEachToken(t) {
    for (let e = 0, n = this.firstCharOffset; e < this.tokenCount; e++) {
      const i = n, s = this.offsetAndType[e], a = s & re, o = s >> Sn;
      n = a, t(o, i, a, e);
    }
  }
  dump() {
    const t = new Array(this.tokenCount);
    return this.forEachToken((e, n, i, s) => {
      t[s] = {
        idx: s,
        type: ag[e],
        chunk: this.source.substring(n, i),
        balance: this.balance[s]
      };
    }), t;
  }
}
function io(r, t) {
  function e(h) {
    return h < o ? r.charCodeAt(h) : 0;
  }
  function n() {
    if (c = ro(r, c), fa(e(c), e(c + 1), e(c + 2))) {
      u = W, c = na(r, c);
      return;
    }
    if (e(c) === 37) {
      u = dt, c++;
      return;
    }
    u = F;
  }
  function i() {
    const h = c;
    if (c = na(r, c), cs(r, h, c, "url") && e(c) === 40) {
      if (c = ea(r, c + 1), e(c) === 34 || e(c) === 39) {
        u = Y, c = h + 4;
        return;
      }
      a();
      return;
    }
    if (e(c) === 40) {
      u = Y, c++;
      return;
    }
    u = R;
  }
  function s(h) {
    for (h || (h = e(c++)), u = sn; c < r.length; c++) {
      const f = r.charCodeAt(c);
      switch (bl(f)) {
        case h:
          c++;
          return;
        case pa:
          if (Oa(f)) {
            c += mc(r, c, f), u = no;
            return;
          }
          break;
        case 92:
          if (c === r.length - 1)
            break;
          const p = e(c + 1);
          Oa(p) ? c += mc(r, c + 1, p) : Ve(f, p) && (c = ai(r, c) - 1);
          break;
      }
    }
  }
  function a() {
    for (u = Nt, c = ea(r, c); c < r.length; c++) {
      const h = r.charCodeAt(c);
      switch (bl(h)) {
        case 41:
          c++;
          return;
        case pa:
          if (c = ea(r, c), e(c) === 41 || c >= r.length) {
            c < r.length && c++;
            return;
          }
          c = vl(r, c), u = Gt;
          return;
        case 34:
        case 39:
        case 40:
        case ig:
          c = vl(r, c), u = Gt;
          return;
        case 92:
          if (Ve(h, e(c + 1))) {
            c = ai(r, c) - 1;
            break;
          }
          c = vl(r, c), u = Gt;
          return;
      }
    }
  }
  r = String(r || "");
  const o = r.length;
  let l = ng(e(0)), c = l, u;
  for (; c < o; ) {
    const h = r.charCodeAt(c);
    switch (bl(h)) {
      case pa:
        u = ft, c = ea(r, c + 1);
        break;
      case 34:
        s();
        break;
      case 35:
        eg(e(c + 1)) || Ve(e(c + 1), e(c + 2)) ? (u = ot, c = na(r, c + 1)) : (u = K, c++);
        break;
      case 39:
        s();
        break;
      case 40:
        u = kt, c++;
        break;
      case 41:
        u = rt, c++;
        break;
      case 43:
        ml(h, e(c + 1), e(c + 2)) ? n() : (u = K, c++);
        break;
      case 44:
        u = an, c++;
        break;
      case 45:
        ml(h, e(c + 1), e(c + 2)) ? n() : e(c + 1) === 45 && e(c + 2) === 62 ? (u = Wt, c = c + 3) : fa(h, e(c + 1), e(c + 2)) ? i() : (u = K, c++);
        break;
      case 46:
        ml(h, e(c + 1), e(c + 2)) ? n() : (u = K, c++);
        break;
      case 47:
        e(c + 1) === 42 ? (u = Ht, c = r.indexOf("*/", c + 2), c = c === -1 ? r.length : c + 2) : (u = K, c++);
        break;
      case 58:
        u = Rt, c++;
        break;
      case 59:
        u = Kt, c++;
        break;
      case 60:
        e(c + 1) === 33 && e(c + 2) === 45 && e(c + 3) === 45 ? (u = xs, c = c + 4) : (u = K, c++);
        break;
      case 64:
        fa(e(c + 1), e(c + 2), e(c + 3)) ? (u = bt, c = na(r, c + 1)) : (u = K, c++);
        break;
      case 91:
        u = ee, c++;
        break;
      case 92:
        Ve(h, e(c + 1)) ? i() : (u = K, c++);
        break;
      case 93:
        u = Ie, c++;
        break;
      case 123:
        u = zt, c++;
        break;
      case 125:
        u = de, c++;
        break;
      case rg:
        n();
        break;
      case Au:
        i();
        break;
      default:
        u = K, c++;
    }
    t(u, l, l = c);
  }
}
let kr = null;
class mt {
  static createItem(t) {
    return {
      prev: null,
      next: null,
      data: t
    };
  }
  constructor() {
    this.head = null, this.tail = null, this.cursor = null;
  }
  createItem(t) {
    return mt.createItem(t);
  }
  // cursor helpers
  allocateCursor(t, e) {
    let n;
    return kr !== null ? (n = kr, kr = kr.cursor, n.prev = t, n.next = e, n.cursor = this.cursor) : n = {
      prev: t,
      next: e,
      cursor: this.cursor
    }, this.cursor = n, n;
  }
  releaseCursor() {
    const { cursor: t } = this;
    this.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = kr, kr = t;
  }
  updateCursors(t, e, n, i) {
    let { cursor: s } = this;
    for (; s !== null; )
      s.prev === t && (s.prev = e), s.next === n && (s.next = i), s = s.cursor;
  }
  *[Symbol.iterator]() {
    for (let t = this.head; t !== null; t = t.next)
      yield t.data;
  }
  // getters
  get size() {
    let t = 0;
    for (let e = this.head; e !== null; e = e.next)
      t++;
    return t;
  }
  get isEmpty() {
    return this.head === null;
  }
  get first() {
    return this.head && this.head.data;
  }
  get last() {
    return this.tail && this.tail.data;
  }
  // convertors
  fromArray(t) {
    let e = null;
    this.head = null;
    for (let n of t) {
      const i = mt.createItem(n);
      e !== null ? e.next = i : this.head = i, i.prev = e, e = i;
    }
    return this.tail = e, this;
  }
  toArray() {
    return [...this];
  }
  toJSON() {
    return [...this];
  }
  // array-like methods
  forEach(t, e = this) {
    const n = this.allocateCursor(null, this.head);
    for (; n.next !== null; ) {
      const i = n.next;
      n.next = i.next, t.call(e, i.data, i, this);
    }
    this.releaseCursor();
  }
  forEachRight(t, e = this) {
    const n = this.allocateCursor(this.tail, null);
    for (; n.prev !== null; ) {
      const i = n.prev;
      n.prev = i.prev, t.call(e, i.data, i, this);
    }
    this.releaseCursor();
  }
  reduce(t, e, n = this) {
    let i = this.allocateCursor(null, this.head), s = e, a;
    for (; i.next !== null; )
      a = i.next, i.next = a.next, s = t.call(n, s, a.data, a, this);
    return this.releaseCursor(), s;
  }
  reduceRight(t, e, n = this) {
    let i = this.allocateCursor(this.tail, null), s = e, a;
    for (; i.prev !== null; )
      a = i.prev, i.prev = a.prev, s = t.call(n, s, a.data, a, this);
    return this.releaseCursor(), s;
  }
  some(t, e = this) {
    for (let n = this.head; n !== null; n = n.next)
      if (t.call(e, n.data, n, this))
        return !0;
    return !1;
  }
  map(t, e = this) {
    const n = new mt();
    for (let i = this.head; i !== null; i = i.next)
      n.appendData(t.call(e, i.data, i, this));
    return n;
  }
  filter(t, e = this) {
    const n = new mt();
    for (let i = this.head; i !== null; i = i.next)
      t.call(e, i.data, i, this) && n.appendData(i.data);
    return n;
  }
  nextUntil(t, e, n = this) {
    if (t === null)
      return;
    const i = this.allocateCursor(null, t);
    for (; i.next !== null; ) {
      const s = i.next;
      if (i.next = s.next, e.call(n, s.data, s, this))
        break;
    }
    this.releaseCursor();
  }
  prevUntil(t, e, n = this) {
    if (t === null)
      return;
    const i = this.allocateCursor(t, null);
    for (; i.prev !== null; ) {
      const s = i.prev;
      if (i.prev = s.prev, e.call(n, s.data, s, this))
        break;
    }
    this.releaseCursor();
  }
  // mutation
  clear() {
    this.head = null, this.tail = null;
  }
  copy() {
    const t = new mt();
    for (let e of this)
      t.appendData(e);
    return t;
  }
  prepend(t) {
    return this.updateCursors(null, t, this.head, t), this.head !== null ? (this.head.prev = t, t.next = this.head) : this.tail = t, this.head = t, this;
  }
  prependData(t) {
    return this.prepend(mt.createItem(t));
  }
  append(t) {
    return this.insert(t);
  }
  appendData(t) {
    return this.insert(mt.createItem(t));
  }
  insert(t, e = null) {
    if (e !== null)
      if (this.updateCursors(e.prev, t, e, t), e.prev === null) {
        if (this.head !== e)
          throw new Error("before doesn't belong to list");
        this.head = t, e.prev = t, t.next = e, this.updateCursors(null, t);
      } else
        e.prev.next = t, t.prev = e.prev, e.prev = t, t.next = e;
    else
      this.updateCursors(this.tail, t, null, t), this.tail !== null ? (this.tail.next = t, t.prev = this.tail) : this.head = t, this.tail = t;
    return this;
  }
  insertData(t, e) {
    return this.insert(mt.createItem(t), e);
  }
  remove(t) {
    if (this.updateCursors(t, t.prev, t, t.next), t.prev !== null)
      t.prev.next = t.next;
    else {
      if (this.head !== t)
        throw new Error("item doesn't belong to list");
      this.head = t.next;
    }
    if (t.next !== null)
      t.next.prev = t.prev;
    else {
      if (this.tail !== t)
        throw new Error("item doesn't belong to list");
      this.tail = t.prev;
    }
    return t.prev = null, t.next = null, t;
  }
  push(t) {
    this.insert(mt.createItem(t));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(t) {
    this.prepend(mt.createItem(t));
  }
  shift() {
    return this.head !== null ? this.remove(this.head) : null;
  }
  prependList(t) {
    return this.insertList(t, this.head);
  }
  appendList(t) {
    return this.insertList(t);
  }
  insertList(t, e) {
    return t.head === null ? this : (e != null ? (this.updateCursors(e.prev, t.tail, e, t.head), e.prev !== null ? (e.prev.next = t.head, t.head.prev = e.prev) : this.head = t.head, e.prev = t.tail, t.tail.next = e) : (this.updateCursors(this.tail, t.tail, null, t.head), this.tail !== null ? (this.tail.next = t.head, t.head.prev = this.tail) : this.head = t.head, this.tail = t.tail), t.head = null, t.tail = null, this);
  }
  replace(t, e) {
    "head" in e ? this.insertList(e, t) : this.insert(e, t), this.remove(t);
  }
}
function so(r, t) {
  const e = Object.create(SyntaxError.prototype), n = new Error();
  return Object.assign(e, {
    name: r,
    message: t,
    get stack() {
      return (n.stack || "").replace(/^(.+\n){1,3}/, `${r}: ${t}
`);
    }
  });
}
const wl = 100, dh = 60, hh = "    ";
function fh({ source: r, line: t, column: e }, n) {
  function i(u, h) {
    return s.slice(u, h).map(
      (f, p) => String(u + p + 1).padStart(l) + " |" + f
    ).join(`
`);
  }
  const s = r.split(/\r\n?|\n|\f/), a = Math.max(1, t - n) - 1, o = Math.min(t + n, s.length + 1), l = Math.max(4, String(o).length) + 1;
  let c = 0;
  e += (hh.length - 1) * (s[t - 1].substr(0, e - 1).match(/\t/g) || []).length, e > wl && (c = e - dh + 3, e = dh - 2);
  for (let u = a; u <= o; u++)
    u >= 0 && u < s.length && (s[u] = s[u].replace(/\t/g, hh), s[u] = (c > 0 && s[u].length > c ? "…" : "") + s[u].substr(c, wl - 2) + (s[u].length > c + wl - 1 ? "…" : ""));
  return [
    i(a, t),
    new Array(e + l + 2).join("-") + "^",
    i(t, o)
  ].filter(Boolean).join(`
`);
}
function ph(r, t, e, n, i) {
  return Object.assign(so("SyntaxError", r), {
    source: t,
    offset: e,
    line: n,
    column: i,
    sourceFragment(s) {
      return fh({ source: t, line: n, column: i }, isNaN(s) ? 0 : s);
    },
    get formattedMessage() {
      return `Parse error: ${r}
` + fh({ source: t, line: n, column: i }, 2);
    }
  });
}
function _k(r) {
  const t = this.createList();
  let e = !1;
  const n = {
    recognizer: r
  };
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case Ht:
        this.next();
        continue;
      case ft:
        e = !0, this.next();
        continue;
    }
    let i = r.getNode.call(this, n);
    if (i === void 0)
      break;
    e && (r.onWhiteSpace && r.onWhiteSpace.call(this, i, t, n), e = !1), t.push(i);
  }
  return e && r.onWhiteSpace && r.onWhiteSpace.call(this, null, t, n), t;
}
const gh = () => {
}, Rk = 33, zk = 35, xl = 59, mh = 123, bh = 0;
function Pk(r) {
  return function() {
    return this[r]();
  };
}
function Sl(r) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const e in r) {
    const n = r[e], i = n.parse || n;
    i && (t[e] = i);
  }
  return t;
}
function Bk(r) {
  const t = {
    context: /* @__PURE__ */ Object.create(null),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), r.scope),
    atrule: Sl(r.atrule),
    pseudo: Sl(r.pseudo),
    node: Sl(r.node)
  };
  for (const e in r.parseContext)
    switch (typeof r.parseContext[e]) {
      case "function":
        t.context[e] = r.parseContext[e];
        break;
      case "string":
        t.context[e] = Pk(r.parseContext[e]);
        break;
    }
  return G(G({
    config: t
  }, t), t.node);
}
function $k(r) {
  let t = "", e = "<unknown>", n = !1, i = gh, s = !1;
  const a = new Nk(), o = Object.assign(new qk(), Bk(r || {}), {
    parseAtrulePrelude: !0,
    parseRulePrelude: !0,
    parseValue: !0,
    parseCustomProperty: !1,
    readSequence: _k,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(l) {
      return l === mh ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(l) {
      return l === mh || l === xl ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(l) {
      return l === Rk || l === xl ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(l) {
      return l === xl ? 2 : 0;
    },
    createList() {
      return new mt();
    },
    createSingleNodeList(l) {
      return new mt().appendData(l);
    },
    getFirstListNode(l) {
      return l && l.first;
    },
    getLastListNode(l) {
      return l && l.last;
    },
    parseWithFallback(l, c) {
      const u = this.tokenIndex;
      try {
        return l.call(this);
      } catch (h) {
        if (s)
          throw h;
        const f = c.call(this, u);
        return s = !0, i(h, f), s = !1, f;
      }
    },
    lookupNonWSType(l) {
      let c;
      do
        if (c = this.lookupType(l++), c !== ft)
          return c;
      while (c !== bh);
      return bh;
    },
    charCodeAt(l) {
      return l >= 0 && l < t.length ? t.charCodeAt(l) : 0;
    },
    substring(l, c) {
      return t.substring(l, c);
    },
    substrToCursor(l) {
      return this.source.substring(l, this.tokenStart);
    },
    cmpChar(l, c) {
      return Hr(t, l, c);
    },
    cmpStr(l, c, u) {
      return cs(t, l, c, u);
    },
    consume(l) {
      const c = this.tokenStart;
      return this.eat(l), this.substrToCursor(c);
    },
    consumeFunctionName() {
      const l = t.substring(this.tokenStart, this.tokenEnd - 1);
      return this.eat(Y), l;
    },
    consumeNumber(l) {
      const c = t.substring(this.tokenStart, ro(t, this.tokenStart));
      return this.eat(l), c;
    },
    eat(l) {
      if (this.tokenType !== l) {
        const c = ag[l].slice(0, -6).replace(/-/g, " ").replace(/^./, (f) => f.toUpperCase());
        let u = `${/[[\](){}]/.test(c) ? `"${c}"` : c} is expected`, h = this.tokenStart;
        switch (l) {
          case R:
            this.tokenType === Y || this.tokenType === Nt ? (h = this.tokenEnd - 1, u = "Identifier is expected but function found") : u = "Identifier is expected";
            break;
          case ot:
            this.isDelim(zk) && (this.next(), h++, u = "Name is expected");
            break;
          case dt:
            this.tokenType === F && (h = this.tokenEnd, u = "Percent sign is expected");
            break;
        }
        this.error(u, h);
      }
      this.next();
    },
    eatIdent(l) {
      (this.tokenType !== R || this.lookupValue(0, l) === !1) && this.error(`Identifier "${l}" is expected`), this.next();
    },
    eatDelim(l) {
      this.isDelim(l) || this.error(`Delim "${String.fromCharCode(l)}" is expected`), this.next();
    },
    getLocation(l, c) {
      return n ? a.getLocationRange(
        l,
        c,
        e
      ) : null;
    },
    getLocationFromList(l) {
      if (n) {
        const c = this.getFirstListNode(l), u = this.getLastListNode(l);
        return a.getLocationRange(
          c !== null ? c.loc.start.offset - a.startOffset : this.tokenStart,
          u !== null ? u.loc.end.offset - a.startOffset : this.tokenStart,
          e
        );
      }
      return null;
    },
    error(l, c) {
      const u = typeof c < "u" && c < t.length ? a.getLocation(c) : this.eof ? a.getLocation(Dk(t, t.length - 1)) : a.getLocation(this.tokenStart);
      throw new ph(
        l || "Unexpected input",
        t,
        u.offset,
        u.line,
        u.column
      );
    }
  });
  return Object.assign(function(l, c) {
    t = l, c = c || {}, o.setSource(t, io), a.setSource(
      t,
      c.offset,
      c.line,
      c.column
    ), e = c.filename || "<unknown>", n = !!c.positions, i = typeof c.onParseError == "function" ? c.onParseError : gh, s = !1, o.parseAtrulePrelude = "parseAtrulePrelude" in c ? !!c.parseAtrulePrelude : !0, o.parseRulePrelude = "parseRulePrelude" in c ? !!c.parseRulePrelude : !0, o.parseValue = "parseValue" in c ? !!c.parseValue : !0, o.parseCustomProperty = "parseCustomProperty" in c ? !!c.parseCustomProperty : !1;
    const { context: u = "default", onComment: h } = c;
    if (!(u in o.context))
      throw new Error("Unknown context `" + u + "`");
    typeof h == "function" && o.forEachToken((p, m, y) => {
      if (p === Ht) {
        const w = o.getLocation(m, y), v = cs(t, y - 2, y, "*/") ? t.slice(m + 2, y - 2) : t.slice(m + 2, y);
        h(v, w);
      }
    });
    const f = o.context[u].call(o, c);
    return o.eof || o.error(), f;
  }, {
    SyntaxError: ph,
    config: o.config
  });
}
var Eu = {}, Cu = {}, yh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
Cu.encode = function(r) {
  if (0 <= r && r < yh.length)
    return yh[r];
  throw new TypeError("Must be between 0 and 63: " + r);
};
Cu.decode = function(r) {
  var t = 65, e = 90, n = 97, i = 122, s = 48, a = 57, o = 43, l = 47, c = 26, u = 52;
  return t <= r && r <= e ? r - t : n <= r && r <= i ? r - n + c : s <= r && r <= a ? r - s + u : r == o ? 62 : r == l ? 63 : -1;
};
var og = Cu, Tu = 5, lg = 1 << Tu, cg = lg - 1, ug = lg;
function jk(r) {
  return r < 0 ? (-r << 1) + 1 : (r << 1) + 0;
}
function Fk(r) {
  var t = (r & 1) === 1, e = r >> 1;
  return t ? -e : e;
}
Eu.encode = function(r) {
  var t = "", e, n = jk(r);
  do
    e = n & cg, n >>>= Tu, n > 0 && (e |= ug), t += og.encode(e);
  while (n > 0);
  return t;
};
Eu.decode = function(r, t, e) {
  var n = r.length, i = 0, s = 0, a, o;
  do {
    if (t >= n)
      throw new Error("Expected more digits in base 64 VLQ value.");
    if (o = og.decode(r.charCodeAt(t++)), o === -1)
      throw new Error("Invalid base64 digit: " + r.charAt(t - 1));
    a = !!(o & ug), o &= cg, i = i + (o << s), s += Tu;
  } while (a);
  e.value = Fk(i), e.rest = t;
};
var ao = {};
(function(r) {
  function t(k, C, q) {
    if (C in k)
      return k[C];
    if (arguments.length === 3)
      return q;
    throw new Error('"' + C + '" is a required argument.');
  }
  r.getArg = t;
  var e = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, n = /^data:.+\,.+$/;
  function i(k) {
    var C = k.match(e);
    return C ? {
      scheme: C[1],
      auth: C[2],
      host: C[3],
      port: C[4],
      path: C[5]
    } : null;
  }
  r.urlParse = i;
  function s(k) {
    var C = "";
    return k.scheme && (C += k.scheme + ":"), C += "//", k.auth && (C += k.auth + "@"), k.host && (C += k.host), k.port && (C += ":" + k.port), k.path && (C += k.path), C;
  }
  r.urlGenerate = s;
  var a = 32;
  function o(k) {
    var C = [];
    return function(q) {
      for (var I = 0; I < C.length; I++)
        if (C[I].input === q) {
          var j = C[0];
          return C[0] = C[I], C[I] = j, C[0].result;
        }
      var Q = k(q);
      return C.unshift({
        input: q,
        result: Q
      }), C.length > a && C.pop(), Q;
    };
  }
  var l = o(function(k) {
    var C = k, q = i(k);
    if (q) {
      if (!q.path)
        return k;
      C = q.path;
    }
    for (var I = r.isAbsolute(C), j = [], Q = 0, H = 0; ; )
      if (Q = H, H = C.indexOf("/", Q), H === -1) {
        j.push(C.slice(Q));
        break;
      } else
        for (j.push(C.slice(Q, H)); H < C.length && C[H] === "/"; )
          H++;
    for (var lt, it = 0, H = j.length - 1; H >= 0; H--)
      lt = j[H], lt === "." ? j.splice(H, 1) : lt === ".." ? it++ : it > 0 && (lt === "" ? (j.splice(H + 1, it), it = 0) : (j.splice(H, 2), it--));
    return C = j.join("/"), C === "" && (C = I ? "/" : "."), q ? (q.path = C, s(q)) : C;
  });
  r.normalize = l;
  function c(k, C) {
    k === "" && (k = "."), C === "" && (C = ".");
    var q = i(C), I = i(k);
    if (I && (k = I.path || "/"), q && !q.scheme)
      return I && (q.scheme = I.scheme), s(q);
    if (q || C.match(n))
      return C;
    if (I && !I.host && !I.path)
      return I.host = C, s(I);
    var j = C.charAt(0) === "/" ? C : l(k.replace(/\/+$/, "") + "/" + C);
    return I ? (I.path = j, s(I)) : j;
  }
  r.join = c, r.isAbsolute = function(k) {
    return k.charAt(0) === "/" || e.test(k);
  };
  function u(k, C) {
    k === "" && (k = "."), k = k.replace(/\/$/, "");
    for (var q = 0; C.indexOf(k + "/") !== 0; ) {
      var I = k.lastIndexOf("/");
      if (I < 0 || (k = k.slice(0, I), k.match(/^([^\/]+:\/)?\/*$/)))
        return C;
      ++q;
    }
    return Array(q + 1).join("../") + C.substr(k.length + 1);
  }
  r.relative = u;
  var h = function() {
    var k = /* @__PURE__ */ Object.create(null);
    return !("__proto__" in k);
  }();
  function f(k) {
    return k;
  }
  function p(k) {
    return y(k) ? "$" + k : k;
  }
  r.toSetString = h ? f : p;
  function m(k) {
    return y(k) ? k.slice(1) : k;
  }
  r.fromSetString = h ? f : m;
  function y(k) {
    if (!k)
      return !1;
    var C = k.length;
    if (C < 9 || k.charCodeAt(C - 1) !== 95 || k.charCodeAt(C - 2) !== 95 || k.charCodeAt(C - 3) !== 111 || k.charCodeAt(C - 4) !== 116 || k.charCodeAt(C - 5) !== 111 || k.charCodeAt(C - 6) !== 114 || k.charCodeAt(C - 7) !== 112 || k.charCodeAt(C - 8) !== 95 || k.charCodeAt(C - 9) !== 95)
      return !1;
    for (var q = C - 10; q >= 0; q--)
      if (k.charCodeAt(q) !== 36)
        return !1;
    return !0;
  }
  function w(k, C, q) {
    var I = E(k.source, C.source);
    return I !== 0 || (I = k.originalLine - C.originalLine, I !== 0) || (I = k.originalColumn - C.originalColumn, I !== 0 || q) || (I = k.generatedColumn - C.generatedColumn, I !== 0) || (I = k.generatedLine - C.generatedLine, I !== 0) ? I : E(k.name, C.name);
  }
  r.compareByOriginalPositions = w;
  function v(k, C, q) {
    var I;
    return I = k.originalLine - C.originalLine, I !== 0 || (I = k.originalColumn - C.originalColumn, I !== 0 || q) || (I = k.generatedColumn - C.generatedColumn, I !== 0) || (I = k.generatedLine - C.generatedLine, I !== 0) ? I : E(k.name, C.name);
  }
  r.compareByOriginalPositionsNoSource = v;
  function S(k, C, q) {
    var I = k.generatedLine - C.generatedLine;
    return I !== 0 || (I = k.generatedColumn - C.generatedColumn, I !== 0 || q) || (I = E(k.source, C.source), I !== 0) || (I = k.originalLine - C.originalLine, I !== 0) || (I = k.originalColumn - C.originalColumn, I !== 0) ? I : E(k.name, C.name);
  }
  r.compareByGeneratedPositionsDeflated = S;
  function A(k, C, q) {
    var I = k.generatedColumn - C.generatedColumn;
    return I !== 0 || q || (I = E(k.source, C.source), I !== 0) || (I = k.originalLine - C.originalLine, I !== 0) || (I = k.originalColumn - C.originalColumn, I !== 0) ? I : E(k.name, C.name);
  }
  r.compareByGeneratedPositionsDeflatedNoLine = A;
  function E(k, C) {
    return k === C ? 0 : k === null ? 1 : C === null ? -1 : k > C ? 1 : -1;
  }
  function T(k, C) {
    var q = k.generatedLine - C.generatedLine;
    return q !== 0 || (q = k.generatedColumn - C.generatedColumn, q !== 0) || (q = E(k.source, C.source), q !== 0) || (q = k.originalLine - C.originalLine, q !== 0) || (q = k.originalColumn - C.originalColumn, q !== 0) ? q : E(k.name, C.name);
  }
  r.compareByGeneratedPositionsInflated = T;
  function M(k) {
    return JSON.parse(k.replace(/^\)]}'[^\n]*\n/, ""));
  }
  r.parseSourceMapInput = M;
  function N(k, C, q) {
    if (C = C || "", k && (k[k.length - 1] !== "/" && C[0] !== "/" && (k += "/"), C = k + C), q) {
      var I = i(q);
      if (!I)
        throw new Error("sourceMapURL could not be parsed");
      if (I.path) {
        var j = I.path.lastIndexOf("/");
        j >= 0 && (I.path = I.path.substring(0, j + 1));
      }
      C = c(s(I), C);
    }
    return l(C);
  }
  r.computeSourceURL = N;
})(ao);
var dg = {}, Lu = ao, Du = Object.prototype.hasOwnProperty, Jn = typeof Map < "u";
function mn() {
  this._array = [], this._set = Jn ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
}
mn.fromArray = function(r, t) {
  for (var e = new mn(), n = 0, i = r.length; n < i; n++)
    e.add(r[n], t);
  return e;
};
mn.prototype.size = function() {
  return Jn ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
mn.prototype.add = function(r, t) {
  var e = Jn ? r : Lu.toSetString(r), n = Jn ? this.has(r) : Du.call(this._set, e), i = this._array.length;
  (!n || t) && this._array.push(r), n || (Jn ? this._set.set(r, i) : this._set[e] = i);
};
mn.prototype.has = function(r) {
  if (Jn)
    return this._set.has(r);
  var t = Lu.toSetString(r);
  return Du.call(this._set, t);
};
mn.prototype.indexOf = function(r) {
  if (Jn) {
    var t = this._set.get(r);
    if (t >= 0)
      return t;
  } else {
    var e = Lu.toSetString(r);
    if (Du.call(this._set, e))
      return this._set[e];
  }
  throw new Error('"' + r + '" is not in the set.');
};
mn.prototype.at = function(r) {
  if (r >= 0 && r < this._array.length)
    return this._array[r];
  throw new Error("No element indexed by " + r);
};
mn.prototype.toArray = function() {
  return this._array.slice();
};
dg.ArraySet = mn;
var hg = {}, fg = ao;
function Hk(r, t) {
  var e = r.generatedLine, n = t.generatedLine, i = r.generatedColumn, s = t.generatedColumn;
  return n > e || n == e && s >= i || fg.compareByGeneratedPositionsInflated(r, t) <= 0;
}
function oo() {
  this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
}
oo.prototype.unsortedForEach = function(r, t) {
  this._array.forEach(r, t);
};
oo.prototype.add = function(r) {
  Hk(this._last, r) ? (this._last = r, this._array.push(r)) : (this._sorted = !1, this._array.push(r));
};
oo.prototype.toArray = function() {
  return this._sorted || (this._array.sort(fg.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
};
hg.MappingList = oo;
var _i = Eu, pt = ao, Na = dg.ArraySet, Uk = hg.MappingList;
function he(r) {
  r || (r = {}), this._file = pt.getArg(r, "file", null), this._sourceRoot = pt.getArg(r, "sourceRoot", null), this._skipValidation = pt.getArg(r, "skipValidation", !1), this._ignoreInvalidMapping = pt.getArg(r, "ignoreInvalidMapping", !1), this._sources = new Na(), this._names = new Na(), this._mappings = new Uk(), this._sourcesContents = null;
}
he.prototype._version = 3;
he.fromSourceMap = function(r, t) {
  var e = r.sourceRoot, n = new he(Object.assign(t || {}, {
    file: r.file,
    sourceRoot: e
  }));
  return r.eachMapping(function(i) {
    var s = {
      generated: {
        line: i.generatedLine,
        column: i.generatedColumn
      }
    };
    i.source != null && (s.source = i.source, e != null && (s.source = pt.relative(e, s.source)), s.original = {
      line: i.originalLine,
      column: i.originalColumn
    }, i.name != null && (s.name = i.name)), n.addMapping(s);
  }), r.sources.forEach(function(i) {
    var s = i;
    e !== null && (s = pt.relative(e, i)), n._sources.has(s) || n._sources.add(s);
    var a = r.sourceContentFor(i);
    a != null && n.setSourceContent(i, a);
  }), n;
};
he.prototype.addMapping = function(r) {
  var t = pt.getArg(r, "generated"), e = pt.getArg(r, "original", null), n = pt.getArg(r, "source", null), i = pt.getArg(r, "name", null);
  !this._skipValidation && this._validateMapping(t, e, n, i) === !1 || (n != null && (n = String(n), this._sources.has(n) || this._sources.add(n)), i != null && (i = String(i), this._names.has(i) || this._names.add(i)), this._mappings.add({
    generatedLine: t.line,
    generatedColumn: t.column,
    originalLine: e != null && e.line,
    originalColumn: e != null && e.column,
    source: n,
    name: i
  }));
};
he.prototype.setSourceContent = function(r, t) {
  var e = r;
  this._sourceRoot != null && (e = pt.relative(this._sourceRoot, e)), t != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[pt.toSetString(e)] = t) : this._sourcesContents && (delete this._sourcesContents[pt.toSetString(e)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
};
he.prototype.applySourceMap = function(r, t, e) {
  var n = t;
  if (t == null) {
    if (r.file == null)
      throw new Error(
        `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
      );
    n = r.file;
  }
  var i = this._sourceRoot;
  i != null && (n = pt.relative(i, n));
  var s = new Na(), a = new Na();
  this._mappings.unsortedForEach(function(o) {
    if (o.source === n && o.originalLine != null) {
      var l = r.originalPositionFor({
        line: o.originalLine,
        column: o.originalColumn
      });
      l.source != null && (o.source = l.source, e != null && (o.source = pt.join(e, o.source)), i != null && (o.source = pt.relative(i, o.source)), o.originalLine = l.line, o.originalColumn = l.column, l.name != null && (o.name = l.name));
    }
    var c = o.source;
    c != null && !s.has(c) && s.add(c);
    var u = o.name;
    u != null && !a.has(u) && a.add(u);
  }, this), this._sources = s, this._names = a, r.sources.forEach(function(o) {
    var l = r.sourceContentFor(o);
    l != null && (e != null && (o = pt.join(e, o)), i != null && (o = pt.relative(i, o)), this.setSourceContent(o, l));
  }, this);
};
he.prototype._validateMapping = function(r, t, e, n) {
  if (t && typeof t.line != "number" && typeof t.column != "number") {
    var i = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
    if (this._ignoreInvalidMapping)
      return typeof console < "u" && console.warn && console.warn(i), !1;
    throw new Error(i);
  }
  if (!(r && "line" in r && "column" in r && r.line > 0 && r.column >= 0 && !t && !e && !n)) {
    if (r && "line" in r && "column" in r && t && "line" in t && "column" in t && r.line > 0 && r.column >= 0 && t.line > 0 && t.column >= 0 && e)
      return;
    var i = "Invalid mapping: " + JSON.stringify({
      generated: r,
      source: e,
      original: t,
      name: n
    });
    if (this._ignoreInvalidMapping)
      return typeof console < "u" && console.warn && console.warn(i), !1;
    throw new Error(i);
  }
};
he.prototype._serializeMappings = function() {
  for (var r = 0, t = 1, e = 0, n = 0, i = 0, s = 0, a = "", o, l, c, u, h = this._mappings.toArray(), f = 0, p = h.length; f < p; f++) {
    if (l = h[f], o = "", l.generatedLine !== t)
      for (r = 0; l.generatedLine !== t; )
        o += ";", t++;
    else if (f > 0) {
      if (!pt.compareByGeneratedPositionsInflated(l, h[f - 1]))
        continue;
      o += ",";
    }
    o += _i.encode(l.generatedColumn - r), r = l.generatedColumn, l.source != null && (u = this._sources.indexOf(l.source), o += _i.encode(u - s), s = u, o += _i.encode(l.originalLine - 1 - n), n = l.originalLine - 1, o += _i.encode(l.originalColumn - e), e = l.originalColumn, l.name != null && (c = this._names.indexOf(l.name), o += _i.encode(c - i), i = c)), a += o;
  }
  return a;
};
he.prototype._generateSourcesContent = function(r, t) {
  return r.map(function(e) {
    if (!this._sourcesContents)
      return null;
    t != null && (e = pt.relative(t, e));
    var n = pt.toSetString(e);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
  }, this);
};
he.prototype.toJSON = function() {
  var r = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  return this._file != null && (r.file = this._file), this._sourceRoot != null && (r.sourceRoot = this._sourceRoot), this._sourcesContents && (r.sourcesContent = this._generateSourcesContent(r.sources, r.sourceRoot)), r;
};
he.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
};
var Vk = he;
const vh = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function Gk(r) {
  const t = new Vk(), e = {
    line: 1,
    column: 0
  }, n = {
    line: 0,
    // should be zero to add first mapping
    column: 0
  }, i = {
    line: 1,
    column: 0
  }, s = {
    generated: i
  };
  let a = 1, o = 0, l = !1;
  const c = r.node;
  r.node = function(f) {
    if (f.loc && f.loc.start && vh.has(f.type)) {
      const p = f.loc.start.line, m = f.loc.start.column - 1;
      (n.line !== p || n.column !== m) && (n.line = p, n.column = m, e.line = a, e.column = o, l && (l = !1, (e.line !== i.line || e.column !== i.column) && t.addMapping(s)), l = !0, t.addMapping({
        source: f.loc.source,
        original: n,
        generated: e
      }));
    }
    c.call(this, f), l && vh.has(f.type) && (i.line = a, i.column = o);
  };
  const u = r.emit;
  r.emit = function(f, p, m) {
    for (let y = 0; y < f.length; y++)
      f.charCodeAt(y) === 10 ? (a++, o = 0) : o++;
    u(f, p, m);
  };
  const h = r.result;
  return r.result = function() {
    return l && t.addMapping(s), {
      css: h(),
      map: t
    };
  }, r;
}
const Wk = 43, Kk = 45, kl = (r, t) => {
  if (r === K && (r = t), typeof r == "string") {
    const e = r.charCodeAt(0);
    return e > 127 ? 32768 : e << 8;
  }
  return r;
}, pg = [
  [R, R],
  [R, Y],
  [R, Nt],
  [R, Gt],
  [R, "-"],
  [R, F],
  [R, dt],
  [R, W],
  [R, Wt],
  [R, kt],
  [bt, R],
  [bt, Y],
  [bt, Nt],
  [bt, Gt],
  [bt, "-"],
  [bt, F],
  [bt, dt],
  [bt, W],
  [bt, Wt],
  [ot, R],
  [ot, Y],
  [ot, Nt],
  [ot, Gt],
  [ot, "-"],
  [ot, F],
  [ot, dt],
  [ot, W],
  [ot, Wt],
  [W, R],
  [W, Y],
  [W, Nt],
  [W, Gt],
  [W, "-"],
  [W, F],
  [W, dt],
  [W, W],
  [W, Wt],
  ["#", R],
  ["#", Y],
  ["#", Nt],
  ["#", Gt],
  ["#", "-"],
  ["#", F],
  ["#", dt],
  ["#", W],
  ["#", Wt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", R],
  ["-", Y],
  ["-", Nt],
  ["-", Gt],
  ["-", "-"],
  ["-", F],
  ["-", dt],
  ["-", W],
  ["-", Wt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [F, R],
  [F, Y],
  [F, Nt],
  [F, Gt],
  [F, F],
  [F, dt],
  [F, W],
  [F, "%"],
  [F, Wt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", R],
  ["@", Y],
  ["@", Nt],
  ["@", Gt],
  ["@", "-"],
  ["@", Wt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", F],
  [".", dt],
  [".", W],
  ["+", F],
  ["+", dt],
  ["+", W],
  ["/", "*"]
], Yk = pg.concat([
  [R, ot],
  [W, ot],
  [ot, ot],
  [bt, kt],
  [bt, sn],
  [bt, Rt],
  [dt, dt],
  [dt, W],
  [dt, Y],
  [dt, "-"],
  [rt, R],
  [rt, Y],
  [rt, dt],
  [rt, W],
  [rt, ot],
  [rt, "-"]
]);
function gg(r) {
  const t = new Set(
    r.map(([e, n]) => kl(e) << 16 | kl(n))
  );
  return function(e, n, i) {
    const s = kl(n, i), a = i.charCodeAt(0);
    return (a === Kk && n !== R && n !== Y && n !== Wt || a === Wk ? t.has(e << 16 | a << 8) : t.has(e << 16 | s)) && this.emit(" ", ft, !0), s;
  };
}
const Qk = gg(pg), mg = gg(Yk), wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe: mg,
  spec: Qk
}, Symbol.toStringTag, { value: "Module" })), Zk = 92;
function Xk(r, t) {
  if (typeof t == "function") {
    let e = null;
    r.children.forEach((n) => {
      e !== null && t.call(this, e), this.node(n), e = n;
    });
    return;
  }
  r.children.forEach(this.node, this);
}
function Jk(r) {
  io(r, (t, e, n) => {
    this.token(t, r.slice(e, n));
  });
}
function tA(r) {
  const t = /* @__PURE__ */ new Map();
  for (let e in r.node) {
    const n = r.node[e];
    typeof (n.generate || n) == "function" && t.set(e, n.generate || n);
  }
  return function(e, n) {
    let i = "", s = 0, a = {
      node(l) {
        if (t.has(l.type))
          t.get(l.type).call(o, l);
        else
          throw new Error("Unknown node type: " + l.type);
      },
      tokenBefore: mg,
      token(l, c) {
        s = this.tokenBefore(s, l, c), this.emit(c, l, !1), l === K && c.charCodeAt(0) === Zk && this.emit(`
`, ft, !0);
      },
      emit(l) {
        i += l;
      },
      result() {
        return i;
      }
    };
    n && (typeof n.decorator == "function" && (a = n.decorator(a)), n.sourceMap && (a = Gk(a)), n.mode in wh && (a.tokenBefore = wh[n.mode]));
    const o = {
      node: (l) => a.node(l),
      children: Xk,
      token: (l, c) => a.token(l, c),
      tokenize: Jk
    };
    return a.node(e), a.result();
  };
}
function eA(r) {
  return {
    fromPlainObject(t) {
      return r(t, {
        enter(e) {
          e.children && !(e.children instanceof mt) && (e.children = new mt().fromArray(e.children));
        }
      }), t;
    },
    toPlainObject(t) {
      return r(t, {
        leave(e) {
          e.children && e.children instanceof mt && (e.children = e.children.toArray());
        }
      }), t;
    }
  };
}
const { hasOwnProperty: Ou } = Object.prototype, Bi = function() {
};
function xh(r) {
  return typeof r == "function" ? r : Bi;
}
function Sh(r, t) {
  return function(e, n, i) {
    e.type === t && r.call(this, e, n, i);
  };
}
function nA(r, t) {
  const e = t.structure, n = [];
  for (const i in e) {
    if (Ou.call(e, i) === !1)
      continue;
    let s = e[i];
    const a = {
      name: i,
      type: !1,
      nullable: !1
    };
    Array.isArray(s) || (s = [s]);
    for (const o of s)
      o === null ? a.nullable = !0 : typeof o == "string" ? a.type = "node" : Array.isArray(o) && (a.type = "list");
    a.type && n.push(a);
  }
  return n.length ? {
    context: t.walkContext,
    fields: n
  } : null;
}
function rA(r) {
  const t = {};
  for (const e in r.node)
    if (Ou.call(r.node, e)) {
      const n = r.node[e];
      if (!n.structure)
        throw new Error("Missed `structure` field in `" + e + "` node type definition");
      t[e] = nA(e, n);
    }
  return t;
}
function kh(r, t) {
  const e = r.fields.slice(), n = r.context, i = typeof n == "string";
  return t && e.reverse(), function(s, a, o, l) {
    let c;
    i && (c = a[n], a[n] = s);
    for (const u of e) {
      const h = s[u.name];
      if (!u.nullable || h) {
        if (u.type === "list") {
          if (t ? h.reduceRight(l, !1) : h.reduce(l, !1))
            return !0;
        } else if (o(h))
          return !0;
      }
    }
    i && (a[n] = c);
  };
}
function Ah({
  StyleSheet: r,
  Atrule: t,
  Rule: e,
  Block: n,
  DeclarationList: i
}) {
  return {
    Atrule: {
      StyleSheet: r,
      Atrule: t,
      Rule: e,
      Block: n
    },
    Rule: {
      StyleSheet: r,
      Atrule: t,
      Rule: e,
      Block: n
    },
    Declaration: {
      StyleSheet: r,
      Atrule: t,
      Rule: e,
      Block: n,
      DeclarationList: i
    }
  };
}
function iA(r) {
  const t = rA(r), e = {}, n = {}, i = Symbol("break-walk"), s = Symbol("skip-node");
  for (const c in t)
    Ou.call(t, c) && t[c] !== null && (e[c] = kh(t[c], !1), n[c] = kh(t[c], !0));
  const a = Ah(e), o = Ah(n), l = function(c, u) {
    function h(v, S, A) {
      const E = f.call(w, v, S, A);
      return E === i ? !0 : E === s ? !1 : !!(m.hasOwnProperty(v.type) && m[v.type](v, w, h, y) || p.call(w, v, S, A) === i);
    }
    let f = Bi, p = Bi, m = e, y = (v, S, A, E) => v || h(S, A, E);
    const w = {
      break: i,
      skip: s,
      root: c,
      stylesheet: null,
      atrule: null,
      atrulePrelude: null,
      rule: null,
      selector: null,
      block: null,
      declaration: null,
      function: null
    };
    if (typeof u == "function")
      f = u;
    else if (u && (f = xh(u.enter), p = xh(u.leave), u.reverse && (m = n), u.visit)) {
      if (a.hasOwnProperty(u.visit))
        m = u.reverse ? o[u.visit] : a[u.visit];
      else if (!t.hasOwnProperty(u.visit))
        throw new Error("Bad value `" + u.visit + "` for `visit` option (should be: " + Object.keys(t).sort().join(", ") + ")");
      f = Sh(f, u.visit), p = Sh(p, u.visit);
    }
    if (f === Bi && p === Bi)
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    h(c);
  };
  return l.break = i, l.skip = s, l.find = function(c, u) {
    let h = null;
    return l(c, function(f, p, m) {
      if (u.call(this, f, p, m))
        return h = f, i;
    }), h;
  }, l.findLast = function(c, u) {
    let h = null;
    return l(c, {
      reverse: !0,
      enter(f, p, m) {
        if (u.call(this, f, p, m))
          return h = f, i;
      }
    }), h;
  }, l.findAll = function(c, u) {
    const h = [];
    return l(c, function(f, p, m) {
      u.call(this, f, p, m) && h.push(f);
    }), h;
  }, l;
}
function sA(r) {
  return r;
}
function aA(r) {
  const { min: t, max: e, comma: n } = r;
  return t === 0 && e === 0 ? n ? "#?" : "*" : t === 0 && e === 1 ? "?" : t === 1 && e === 0 ? n ? "#" : "+" : t === 1 && e === 1 ? "" : (n ? "#" : "") + (t === e ? "{" + t + "}" : "{" + t + "," + (e !== 0 ? e : "") + "}");
}
function oA(r) {
  switch (r.type) {
    case "Range":
      return " [" + (r.min === null ? "-∞" : r.min) + "," + (r.max === null ? "∞" : r.max) + "]";
    default:
      throw new Error("Unknown node type `" + r.type + "`");
  }
}
function lA(r, t, e, n) {
  const i = r.combinator === " " || n ? r.combinator : " " + r.combinator + " ", s = r.terms.map((a) => Iu(a, t, e, n)).join(i);
  return r.explicit || e ? (n || s[0] === "," ? "[" : "[ ") + s + (n ? "]" : " ]") : s;
}
function Iu(r, t, e, n) {
  let i;
  switch (r.type) {
    case "Group":
      i = lA(r, t, e, n) + (r.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return Iu(r.term, t, e, n) + t(aA(r), r);
    case "Type":
      i = "<" + r.name + (r.opts ? t(oA(r.opts), r.opts) : "") + ">";
      break;
    case "Property":
      i = "<'" + r.name + "'>";
      break;
    case "Keyword":
      i = r.name;
      break;
    case "AtKeyword":
      i = "@" + r.name;
      break;
    case "Function":
      i = r.name + "(";
      break;
    case "String":
    case "Token":
      i = r.value;
      break;
    case "Comma":
      i = ",";
      break;
    default:
      throw new Error("Unknown node type `" + r.type + "`");
  }
  return t(i, r);
}
function Nu(r, t) {
  let e = sA, n = !1, i = !1;
  return typeof t == "function" ? e = t : t && (n = !!t.forceBraces, i = !!t.compact, typeof t.decorate == "function" && (e = t.decorate)), Iu(r, e, n, i);
}
const Eh = { offset: 0, line: 1, column: 1 };
function cA(r, t) {
  const e = r.tokens, n = r.longestMatch, i = n < e.length && e[n].node || null, s = i !== t ? i : null;
  let a = 0, o = 0, l = 0, c = "", u, h;
  for (let f = 0; f < e.length; f++) {
    const p = e[f].value;
    f === n && (o = p.length, a = c.length), s !== null && e[f].node === s && (f <= n ? l++ : l = 0), c += p;
  }
  return n === e.length || l > 1 ? (u = ra(s || t, "end") || $i(Eh, c), h = $i(u)) : (u = ra(s, "start") || $i(ra(t, "start") || Eh, c.slice(0, a)), h = ra(s, "end") || $i(u, c.substr(a, o))), {
    css: c,
    mismatchOffset: a,
    mismatchLength: o,
    start: u,
    end: h
  };
}
function ra(r, t) {
  const e = r && r.loc && r.loc[t];
  return e ? "line" in e ? $i(e) : e : null;
}
function $i({ offset: r, line: t, column: e }, n) {
  const i = {
    offset: r,
    line: t,
    column: e
  };
  if (n) {
    const s = n.split(/\n|\r\n?|\f/);
    i.offset += n.length, i.line += s.length - 1, i.column = s.length === 1 ? i.column + n.length : s.pop().length + 1;
  }
  return i;
}
const Ri = function(r, t) {
  const e = so(
    "SyntaxReferenceError",
    r + (t ? " `" + t + "`" : "")
  );
  return e.reference = t, e;
}, uA = function(r, t, e, n) {
  const i = so("SyntaxMatchError", r), {
    css: s,
    mismatchOffset: a,
    mismatchLength: o,
    start: l,
    end: c
  } = cA(n, e);
  return i.rawMessage = r, i.syntax = t ? Nu(t) : "<generic>", i.css = s, i.mismatchOffset = a, i.mismatchLength = o, i.message = r + `
  syntax: ` + i.syntax + `
   value: ` + (s || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, l), i.loc = {
    source: e && e.loc && e.loc.source || "<unknown>",
    start: l,
    end: c
  }, i;
}, ia = /* @__PURE__ */ new Map(), Ar = /* @__PURE__ */ new Map(), Ma = 45, Al = dA, Ch = hA;
function Mu(r, t) {
  return t = t || 0, r.length - t >= 2 && r.charCodeAt(t) === Ma && r.charCodeAt(t + 1) === Ma;
}
function bg(r, t) {
  if (t = t || 0, r.length - t >= 3 && r.charCodeAt(t) === Ma && r.charCodeAt(t + 1) !== Ma) {
    const e = r.indexOf("-", t + 2);
    if (e !== -1)
      return r.substring(t, e + 1);
  }
  return "";
}
function dA(r) {
  if (ia.has(r))
    return ia.get(r);
  const t = r.toLowerCase();
  let e = ia.get(t);
  if (e === void 0) {
    const n = Mu(t, 0), i = n ? "" : bg(t, 0);
    e = Object.freeze({
      basename: t.substr(i.length),
      name: t,
      prefix: i,
      vendor: i,
      custom: n
    });
  }
  return ia.set(r, e), e;
}
function hA(r) {
  if (Ar.has(r))
    return Ar.get(r);
  let t = r, e = r[0];
  e === "/" ? e = r[1] === "/" ? "//" : "/" : e !== "_" && e !== "*" && e !== "$" && e !== "#" && e !== "+" && e !== "&" && (e = "");
  const n = Mu(t, e.length);
  if (!n && (t = t.toLowerCase(), Ar.has(t))) {
    const o = Ar.get(t);
    return Ar.set(r, o), o;
  }
  const i = n ? "" : bg(t, e.length), s = t.substr(0, e.length + i.length), a = Object.freeze({
    basename: t.substr(s.length),
    name: t.substr(e.length),
    hack: e,
    vendor: i,
    prefix: s,
    custom: n
  });
  return Ar.set(r, a), a;
}
const yg = [
  "initial",
  "inherit",
  "unset",
  "revert",
  "revert-layer"
], us = 43, Fe = 45, El = 110, Er = !0, fA = !1;
function bc(r, t) {
  return r !== null && r.type === K && r.value.charCodeAt(0) === t;
}
function Gi(r, t, e) {
  for (; r !== null && (r.type === ft || r.type === Ht); )
    r = e(++t);
  return t;
}
function En(r, t, e, n) {
  if (!r)
    return 0;
  const i = r.value.charCodeAt(t);
  if (i === us || i === Fe) {
    if (e)
      return 0;
    t++;
  }
  for (; t < r.value.length; t++)
    if (!At(r.value.charCodeAt(t)))
      return 0;
  return n + 1;
}
function Cl(r, t, e) {
  let n = !1, i = Gi(r, t, e);
  if (r = e(i), r === null)
    return t;
  if (r.type !== F)
    if (bc(r, us) || bc(r, Fe)) {
      if (n = !0, i = Gi(e(++i), i, e), r = e(i), r === null || r.type !== F)
        return 0;
    } else
      return t;
  if (!n) {
    const s = r.value.charCodeAt(0);
    if (s !== us && s !== Fe)
      return 0;
  }
  return En(r, n ? 0 : 1, n, i);
}
function pA(r, t) {
  let e = 0;
  if (!r)
    return 0;
  if (r.type === F)
    return En(r, 0, fA, e);
  if (r.type === R && r.value.charCodeAt(0) === Fe) {
    if (!Hr(r.value, 1, El))
      return 0;
    switch (r.value.length) {
      case 2:
        return Cl(t(++e), e, t);
      case 3:
        return r.value.charCodeAt(2) !== Fe ? 0 : (e = Gi(t(++e), e, t), r = t(e), En(r, 0, Er, e));
      default:
        return r.value.charCodeAt(2) !== Fe ? 0 : En(r, 3, Er, e);
    }
  } else if (r.type === R || bc(r, us) && t(e + 1).type === R) {
    if (r.type !== R && (r = t(++e)), r === null || !Hr(r.value, 0, El))
      return 0;
    switch (r.value.length) {
      case 1:
        return Cl(t(++e), e, t);
      case 2:
        return r.value.charCodeAt(1) !== Fe ? 0 : (e = Gi(t(++e), e, t), r = t(e), En(r, 0, Er, e));
      default:
        return r.value.charCodeAt(1) !== Fe ? 0 : En(r, 2, Er, e);
    }
  } else if (r.type === W) {
    let n = r.value.charCodeAt(0), i = n === us || n === Fe ? 1 : 0, s = i;
    for (; s < r.value.length && At(r.value.charCodeAt(s)); s++)
      ;
    return s === i || !Hr(r.value, s, El) ? 0 : s + 1 === r.value.length ? Cl(t(++e), e, t) : r.value.charCodeAt(s + 1) !== Fe ? 0 : s + 2 === r.value.length ? (e = Gi(t(++e), e, t), r = t(e), En(r, 0, Er, e)) : En(r, s + 2, Er, e);
  }
  return 0;
}
const gA = 43, vg = 45, wg = 63, mA = 117;
function yc(r, t) {
  return r !== null && r.type === K && r.value.charCodeAt(0) === t;
}
function bA(r, t) {
  return r.value.charCodeAt(0) === t;
}
function ji(r, t, e) {
  let n = 0;
  for (let i = t; i < r.value.length; i++) {
    const s = r.value.charCodeAt(i);
    if (s === vg && e && n !== 0)
      return ji(r, t + n + 1, !1), 6;
    if (!qn(s) || ++n > 6)
      return 0;
  }
  return n;
}
function sa(r, t, e) {
  if (!r)
    return 0;
  for (; yc(e(t), wg); ) {
    if (++r > 6)
      return 0;
    t++;
  }
  return t;
}
function yA(r, t) {
  let e = 0;
  if (r === null || r.type !== R || !Hr(r.value, 0, mA) || (r = t(++e), r === null))
    return 0;
  if (yc(r, gA))
    return r = t(++e), r === null ? 0 : r.type === R ? sa(ji(r, 0, !0), ++e, t) : yc(r, wg) ? sa(1, ++e, t) : 0;
  if (r.type === F) {
    const n = ji(r, 1, !0);
    return n === 0 ? 0 : (r = t(++e), r === null ? e : r.type === W || r.type === F ? !bA(r, vg) || !ji(r, 1, !1) ? 0 : e + 1 : sa(n, e, t));
  }
  return r.type === W ? sa(ji(r, 1, !0), ++e, t) : 0;
}
const vA = ["calc(", "-moz-calc(", "-webkit-calc("], qu = /* @__PURE__ */ new Map([
  [Y, rt],
  [kt, rt],
  [ee, Ie],
  [zt, de]
]);
function Ee(r, t) {
  return t < r.length ? r.charCodeAt(t) : 0;
}
function xg(r, t) {
  return cs(r, 0, r.length, t);
}
function Sg(r, t) {
  for (let e = 0; e < t.length; e++)
    if (xg(r, t[e]))
      return !0;
  return !1;
}
function kg(r, t) {
  return t !== r.length - 2 ? !1 : Ee(r, t) === 92 && // U+005C REVERSE SOLIDUS (\)
  At(Ee(r, t + 1));
}
function lo(r, t, e) {
  if (r && r.type === "Range") {
    const n = Number(
      e !== void 0 && e !== t.length ? t.substr(0, e) : t
    );
    if (isNaN(n) || r.min !== null && n < r.min && typeof r.min != "string" || r.max !== null && n > r.max && typeof r.max != "string")
      return !0;
  }
  return !1;
}
function wA(r, t) {
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case de:
        case rt:
        case Ie:
          if (r.type !== e)
            break t;
          if (e = n.pop(), n.length === 0) {
            i++;
            break t;
          }
          break;
        case Y:
        case kt:
        case ee:
        case zt:
          n.push(e), e = qu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function se(r) {
  return function(t, e, n) {
    return t === null ? 0 : t.type === Y && Sg(t.value, vA) ? wA(t, e) : r(t, e, n);
  };
}
function st(r) {
  return function(t) {
    return t === null || t.type !== r ? 0 : 1;
  };
}
function xA(r) {
  if (r === null || r.type !== R)
    return 0;
  const t = r.value.toLowerCase();
  return Sg(t, yg) || xg(t, "default") ? 0 : 1;
}
function SA(r) {
  return r === null || r.type !== R || Ee(r.value, 0) !== 45 || Ee(r.value, 1) !== 45 ? 0 : 1;
}
function kA(r) {
  if (r === null || r.type !== ot)
    return 0;
  const t = r.value.length;
  if (t !== 4 && t !== 5 && t !== 7 && t !== 9)
    return 0;
  for (let e = 1; e < t; e++)
    if (!qn(Ee(r.value, e)))
      return 0;
  return 1;
}
function AA(r) {
  return r === null || r.type !== ot || !fa(Ee(r.value, 1), Ee(r.value, 2), Ee(r.value, 3)) ? 0 : 1;
}
function EA(r, t) {
  if (!r)
    return 0;
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case no:
        case Gt:
          break t;
        case de:
        case rt:
        case Ie:
          if (r.type !== e)
            break t;
          e = n.pop();
          break;
        case Kt:
          if (e === 0)
            break t;
          break;
        case K:
          if (e === 0 && r.value === "!")
            break t;
          break;
        case Y:
        case kt:
        case ee:
        case zt:
          n.push(e), e = qu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function CA(r, t) {
  if (!r)
    return 0;
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case no:
        case Gt:
          break t;
        case de:
        case rt:
        case Ie:
          if (r.type !== e)
            break t;
          e = n.pop();
          break;
        case Y:
        case kt:
        case ee:
        case zt:
          n.push(e), e = qu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function hn(r) {
  return r && (r = new Set(r)), function(t, e, n) {
    if (t === null || t.type !== W)
      return 0;
    const i = ro(t.value, 0);
    if (r !== null) {
      const s = t.value.indexOf("\\", i), a = s === -1 || !kg(t.value, s) ? t.value.substr(i) : t.value.substring(i, s);
      if (r.has(a.toLowerCase()) === !1)
        return 0;
    }
    return lo(n, t.value, i) ? 0 : 1;
  };
}
function TA(r, t, e) {
  return r === null || r.type !== dt || lo(e, r.value, r.value.length - 1) ? 0 : 1;
}
function Ag(r) {
  return typeof r != "function" && (r = function() {
    return 0;
  }), function(t, e, n) {
    return t !== null && t.type === F && Number(t.value) === 0 ? 1 : r(t, e, n);
  };
}
function LA(r, t, e) {
  if (r === null)
    return 0;
  const n = ro(r.value, 0);
  return n !== r.value.length && !kg(r.value, n) || lo(e, r.value, n) ? 0 : 1;
}
function DA(r, t, e) {
  if (r === null || r.type !== F)
    return 0;
  let n = Ee(r.value, 0) === 43 || // U+002B PLUS SIGN (+)
  Ee(r.value, 0) === 45 ? 1 : 0;
  for (; n < r.value.length; n++)
    if (!At(Ee(r.value, n)))
      return 0;
  return lo(e, r.value, n) ? 0 : 1;
}
const OA = {
  "ident-token": st(R),
  "function-token": st(Y),
  "at-keyword-token": st(bt),
  "hash-token": st(ot),
  "string-token": st(sn),
  "bad-string-token": st(no),
  "url-token": st(Nt),
  "bad-url-token": st(Gt),
  "delim-token": st(K),
  "number-token": st(F),
  "percentage-token": st(dt),
  "dimension-token": st(W),
  "whitespace-token": st(ft),
  "CDO-token": st(xs),
  "CDC-token": st(Wt),
  "colon-token": st(Rt),
  "semicolon-token": st(Kt),
  "comma-token": st(an),
  "[-token": st(ee),
  "]-token": st(Ie),
  "(-token": st(kt),
  ")-token": st(rt),
  "{-token": st(zt),
  "}-token": st(de)
}, IA = {
  // token type aliases
  string: st(sn),
  ident: st(R),
  // percentage
  percentage: se(TA),
  // numeric
  zero: Ag(),
  number: se(LA),
  integer: se(DA),
  // complex types
  "custom-ident": xA,
  "custom-property-name": SA,
  "hex-color": kA,
  "id-selector": AA,
  // element( <id-selector> )
  "an-plus-b": pA,
  urange: yA,
  "declaration-value": EA,
  "any-value": CA
};
function NA(r) {
  const {
    angle: t,
    decibel: e,
    frequency: n,
    flex: i,
    length: s,
    resolution: a,
    semitones: o,
    time: l
  } = r || {};
  return {
    dimension: se(hn(null)),
    angle: se(hn(t)),
    decibel: se(hn(e)),
    frequency: se(hn(n)),
    flex: se(hn(i)),
    length: se(Ag(hn(s))),
    resolution: se(hn(a)),
    semitones: se(hn(o)),
    time: se(hn(l))
  };
}
function MA(r) {
  return G(G(G({}, OA), IA), NA(r));
}
const qA = [
  // absolute length units https://www.w3.org/TR/css-values-3/#lengths
  "cm",
  "mm",
  "q",
  "in",
  "pt",
  "pc",
  "px",
  // font-relative length units https://drafts.csswg.org/css-values-4/#font-relative-lengths
  "em",
  "rem",
  "ex",
  "rex",
  "cap",
  "rcap",
  "ch",
  "rch",
  "ic",
  "ric",
  "lh",
  "rlh",
  // viewport-percentage lengths https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
  "vw",
  "svw",
  "lvw",
  "dvw",
  "vh",
  "svh",
  "lvh",
  "dvh",
  "vi",
  "svi",
  "lvi",
  "dvi",
  "vb",
  "svb",
  "lvb",
  "dvb",
  "vmin",
  "svmin",
  "lvmin",
  "dvmin",
  "vmax",
  "svmax",
  "lvmax",
  "dvmax",
  // container relative lengths https://drafts.csswg.org/css-contain-3/#container-lengths
  "cqw",
  "cqh",
  "cqi",
  "cqb",
  "cqmin",
  "cqmax"
], _A = ["deg", "grad", "rad", "turn"], RA = ["s", "ms"], zA = ["hz", "khz"], PA = ["dpi", "dpcm", "dppx", "x"], BA = ["fr"], $A = ["db"], jA = ["st"], Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angle: _A,
  decibel: $A,
  flex: BA,
  frequency: zA,
  length: qA,
  resolution: PA,
  semitones: jA,
  time: RA
}, Symbol.toStringTag, { value: "Module" }));
function FA(r, t, e) {
  return Object.assign(so("SyntaxError", r), {
    input: t,
    offset: e,
    rawMessage: r,
    message: r + `
  ` + t + `
--` + new Array((e || t.length) + 1).join("-") + "^"
  });
}
const HA = 9, UA = 10, VA = 12, GA = 13, WA = 32;
class KA {
  constructor(t) {
    this.str = t, this.pos = 0;
  }
  charCodeAt(t) {
    return t < this.str.length ? this.str.charCodeAt(t) : 0;
  }
  charCode() {
    return this.charCodeAt(this.pos);
  }
  nextCharCode() {
    return this.charCodeAt(this.pos + 1);
  }
  nextNonWsCode(t) {
    return this.charCodeAt(this.findWsEnd(t));
  }
  findWsEnd(t) {
    for (; t < this.str.length; t++) {
      const e = this.str.charCodeAt(t);
      if (e !== GA && e !== UA && e !== VA && e !== WA && e !== HA)
        break;
    }
    return t;
  }
  substringToPos(t) {
    return this.str.substring(this.pos, this.pos = t);
  }
  eat(t) {
    this.charCode() !== t && this.error("Expect `" + String.fromCharCode(t) + "`"), this.pos++;
  }
  peek() {
    return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
  }
  error(t) {
    throw new FA(t, this.str, this.pos);
  }
}
const YA = 9, QA = 10, ZA = 12, XA = 13, JA = 32, Eg = 33, _u = 35, Lh = 38, qa = 39, Cg = 40, tE = 41, Tg = 42, Ru = 43, zu = 44, Dh = 45, Pu = 60, Lg = 62, vc = 63, eE = 64, co = 91, Bu = 93, _a = 123, Oh = 124, Ih = 125, Nh = 8734, ds = new Uint8Array(128).map(
  (r, t) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0
), Mh = {
  " ": 1,
  "&&": 2,
  "||": 3,
  "|": 4
};
function Ra(r) {
  return r.substringToPos(
    r.findWsEnd(r.pos)
  );
}
function oi(r) {
  let t = r.pos;
  for (; t < r.str.length; t++) {
    const e = r.str.charCodeAt(t);
    if (e >= 128 || ds[e] === 0)
      break;
  }
  return r.pos === t && r.error("Expect a keyword"), r.substringToPos(t);
}
function za(r) {
  let t = r.pos;
  for (; t < r.str.length; t++) {
    const e = r.str.charCodeAt(t);
    if (e < 48 || e > 57)
      break;
  }
  return r.pos === t && r.error("Expect a number"), r.substringToPos(t);
}
function nE(r) {
  const t = r.str.indexOf("'", r.pos + 1);
  return t === -1 && (r.pos = r.str.length, r.error("Expect an apostrophe")), r.substringToPos(t + 1);
}
function qh(r) {
  let t = null, e = null;
  return r.eat(_a), t = za(r), r.charCode() === zu ? (r.pos++, r.charCode() !== Ih && (e = za(r))) : e = t, r.eat(Ih), {
    min: Number(t),
    max: e ? Number(e) : 0
  };
}
function rE(r) {
  let t = null, e = !1;
  switch (r.charCode()) {
    case Tg:
      r.pos++, t = {
        min: 0,
        max: 0
      };
      break;
    case Ru:
      r.pos++, t = {
        min: 1,
        max: 0
      };
      break;
    case vc:
      r.pos++, t = {
        min: 0,
        max: 1
      };
      break;
    case _u:
      r.pos++, e = !0, r.charCode() === _a ? t = qh(r) : r.charCode() === vc ? (r.pos++, t = {
        min: 0,
        max: 0
      }) : t = {
        min: 1,
        max: 0
      };
      break;
    case _a:
      t = qh(r);
      break;
    default:
      return null;
  }
  return {
    type: "Multiplier",
    comma: e,
    min: t.min,
    max: t.max,
    term: null
  };
}
function li(r, t) {
  const e = rE(r);
  return e !== null ? (e.term = t, r.charCode() === _u && r.charCodeAt(r.pos - 1) === Ru ? li(r, e) : e) : t;
}
function Tl(r) {
  const t = r.peek();
  return t === "" ? null : {
    type: "Token",
    value: t
  };
}
function iE(r) {
  let t;
  return r.eat(Pu), r.eat(qa), t = oi(r), r.eat(qa), r.eat(Lg), li(r, {
    type: "Property",
    name: t
  });
}
function sE(r) {
  let t = null, e = null, n = 1;
  return r.eat(co), r.charCode() === Dh && (r.peek(), n = -1), n == -1 && r.charCode() === Nh ? r.peek() : (t = n * Number(za(r)), ds[r.charCode()] !== 0 && (t += oi(r))), Ra(r), r.eat(zu), Ra(r), r.charCode() === Nh ? r.peek() : (n = 1, r.charCode() === Dh && (r.peek(), n = -1), e = n * Number(za(r)), ds[r.charCode()] !== 0 && (e += oi(r))), r.eat(Bu), {
    type: "Range",
    min: t,
    max: e
  };
}
function aE(r) {
  let t, e = null;
  return r.eat(Pu), t = oi(r), r.charCode() === Cg && r.nextCharCode() === tE && (r.pos += 2, t += "()"), r.charCodeAt(r.findWsEnd(r.pos)) === co && (Ra(r), e = sE(r)), r.eat(Lg), li(r, {
    type: "Type",
    name: t,
    opts: e
  });
}
function oE(r) {
  const t = oi(r);
  return r.charCode() === Cg ? (r.pos++, {
    type: "Function",
    name: t
  }) : li(r, {
    type: "Keyword",
    name: t
  });
}
function lE(r, t) {
  function e(i, s) {
    return {
      type: "Group",
      terms: i,
      combinator: s,
      disallowEmpty: !1,
      explicit: !1
    };
  }
  let n;
  for (t = Object.keys(t).sort((i, s) => Mh[i] - Mh[s]); t.length > 0; ) {
    n = t.shift();
    let i = 0, s = 0;
    for (; i < r.length; i++) {
      const a = r[i];
      a.type === "Combinator" && (a.value === n ? (s === -1 && (s = i - 1), r.splice(i, 1), i--) : (s !== -1 && i - s > 1 && (r.splice(
        s,
        i - s,
        e(r.slice(s, i), n)
      ), i = s + 1), s = -1));
    }
    s !== -1 && t.length && r.splice(
      s,
      i - s,
      e(r.slice(s, i), n)
    );
  }
  return n;
}
function Dg(r) {
  const t = [], e = {};
  let n, i = null, s = r.pos;
  for (; n = uE(r); )
    n.type !== "Spaces" && (n.type === "Combinator" ? ((i === null || i.type === "Combinator") && (r.pos = s, r.error("Unexpected combinator")), e[n.value] = !0) : i !== null && i.type !== "Combinator" && (e[" "] = !0, t.push({
      type: "Combinator",
      value: " "
    })), t.push(n), i = n, s = r.pos);
  return i !== null && i.type === "Combinator" && (r.pos -= s, r.error("Unexpected combinator")), {
    type: "Group",
    terms: t,
    combinator: lE(t, e) || " ",
    disallowEmpty: !1,
    explicit: !1
  };
}
function cE(r) {
  let t;
  return r.eat(co), t = Dg(r), r.eat(Bu), t.explicit = !0, r.charCode() === Eg && (r.pos++, t.disallowEmpty = !0), t;
}
function uE(r) {
  let t = r.charCode();
  if (t < 128 && ds[t] === 1)
    return oE(r);
  switch (t) {
    case Bu:
      break;
    case co:
      return li(r, cE(r));
    case Pu:
      return r.nextCharCode() === qa ? iE(r) : aE(r);
    case Oh:
      return {
        type: "Combinator",
        value: r.substringToPos(
          r.pos + (r.nextCharCode() === Oh ? 2 : 1)
        )
      };
    case Lh:
      return r.pos++, r.eat(Lh), {
        type: "Combinator",
        value: "&&"
      };
    case zu:
      return r.pos++, {
        type: "Comma"
      };
    case qa:
      return li(r, {
        type: "String",
        value: nE(r)
      });
    case JA:
    case YA:
    case QA:
    case XA:
    case ZA:
      return {
        type: "Spaces",
        value: Ra(r)
      };
    case eE:
      return t = r.nextCharCode(), t < 128 && ds[t] === 1 ? (r.pos++, {
        type: "AtKeyword",
        name: oi(r)
      }) : Tl(r);
    case Tg:
    case Ru:
    case vc:
    case _u:
    case Eg:
      break;
    case _a:
      if (t = r.nextCharCode(), t < 48 || t > 57)
        return Tl(r);
      break;
    default:
      return Tl(r);
  }
}
function Og(r) {
  const t = new KA(r), e = Dg(t);
  return t.pos !== r.length && t.error("Unexpected input"), e.terms.length === 1 && e.terms[0].type === "Group" ? e.terms[0] : e;
}
const Fi = function() {
};
function _h(r) {
  return typeof r == "function" ? r : Fi;
}
function dE(r, t, e) {
  function n(a) {
    switch (i.call(e, a), a.type) {
      case "Group":
        a.terms.forEach(n);
        break;
      case "Multiplier":
        n(a.term);
        break;
      case "Type":
      case "Property":
      case "Keyword":
      case "AtKeyword":
      case "Function":
      case "String":
      case "Token":
      case "Comma":
        break;
      default:
        throw new Error("Unknown type: " + a.type);
    }
    s.call(e, a);
  }
  let i = Fi, s = Fi;
  if (typeof t == "function" ? i = t : t && (i = _h(t.enter), s = _h(t.leave)), i === Fi && s === Fi)
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  n(r);
}
const hE = {
  decorator(r) {
    const t = [];
    let e = null;
    return jt(G({}, r), {
      node(n) {
        const i = e;
        e = n, r.node.call(this, n), e = i;
      },
      emit(n, i, s) {
        t.push({
          type: i,
          value: n,
          node: s ? null : e
        });
      },
      result() {
        return t;
      }
    });
  }
};
function fE(r) {
  const t = [];
  return io(
    r,
    (e, n, i) => t.push({
      type: e,
      value: r.slice(n, i),
      node: null
    })
  ), t;
}
function pE(r, t) {
  return typeof r == "string" ? fE(r) : t.generate(r, hE);
}
const J = { type: "Match" }, nt = { type: "Mismatch" }, $u = { type: "DisallowEmpty" }, gE = 40, mE = 41;
function It(r, t, e) {
  return t === J && e === nt || r === J && t === J && e === J ? r : (r.type === "If" && r.else === nt && t === J && (t = r.then, r = r.match), {
    type: "If",
    match: r,
    then: t,
    else: e
  });
}
function Ig(r) {
  return r.length > 2 && r.charCodeAt(r.length - 2) === gE && r.charCodeAt(r.length - 1) === mE;
}
function Rh(r) {
  return r.type === "Keyword" || r.type === "AtKeyword" || r.type === "Function" || r.type === "Type" && Ig(r.name);
}
function wc(r, t, e) {
  switch (r) {
    case " ": {
      let n = J;
      for (let i = t.length - 1; i >= 0; i--) {
        const s = t[i];
        n = It(
          s,
          n,
          nt
        );
      }
      return n;
    }
    case "|": {
      let n = nt, i = null;
      for (let s = t.length - 1; s >= 0; s--) {
        let a = t[s];
        if (Rh(a) && (i === null && s > 0 && Rh(t[s - 1]) && (i = /* @__PURE__ */ Object.create(null), n = It(
          {
            type: "Enum",
            map: i
          },
          J,
          n
        )), i !== null)) {
          const o = (Ig(a.name) ? a.name.slice(0, -1) : a.name).toLowerCase();
          if (!(o in i)) {
            i[o] = a;
            continue;
          }
        }
        i = null, n = It(
          a,
          J,
          n
        );
      }
      return n;
    }
    case "&&": {
      if (t.length > 5)
        return {
          type: "MatchOnce",
          terms: t,
          all: !0
        };
      let n = nt;
      for (let i = t.length - 1; i >= 0; i--) {
        const s = t[i];
        let a;
        t.length > 1 ? a = wc(
          r,
          t.filter(function(o) {
            return o !== s;
          }),
          !1
        ) : a = J, n = It(
          s,
          a,
          n
        );
      }
      return n;
    }
    case "||": {
      if (t.length > 5)
        return {
          type: "MatchOnce",
          terms: t,
          all: !1
        };
      let n = e ? J : nt;
      for (let i = t.length - 1; i >= 0; i--) {
        const s = t[i];
        let a;
        t.length > 1 ? a = wc(
          r,
          t.filter(function(o) {
            return o !== s;
          }),
          !0
        ) : a = J, n = It(
          s,
          a,
          n
        );
      }
      return n;
    }
  }
}
function bE(r) {
  let t = J, e = ju(r.term);
  if (r.max === 0)
    e = It(
      e,
      $u,
      nt
    ), t = It(
      e,
      null,
      // will be a loop
      nt
    ), t.then = It(
      J,
      J,
      t
      // make a loop
    ), r.comma && (t.then.else = It(
      { type: "Comma", syntax: r },
      t,
      nt
    ));
  else
    for (let n = r.min || 1; n <= r.max; n++)
      r.comma && t !== J && (t = It(
        { type: "Comma", syntax: r },
        t,
        nt
      )), t = It(
        e,
        It(
          J,
          J,
          t
        ),
        nt
      );
  if (r.min === 0)
    t = It(
      J,
      J,
      t
    );
  else
    for (let n = 0; n < r.min - 1; n++)
      r.comma && t !== J && (t = It(
        { type: "Comma", syntax: r },
        t,
        nt
      )), t = It(
        e,
        t,
        nt
      );
  return t;
}
function ju(r) {
  if (typeof r == "function")
    return {
      type: "Generic",
      fn: r
    };
  switch (r.type) {
    case "Group": {
      let t = wc(
        r.combinator,
        r.terms.map(ju),
        !1
      );
      return r.disallowEmpty && (t = It(
        t,
        $u,
        nt
      )), t;
    }
    case "Multiplier":
      return bE(r);
    case "Type":
    case "Property":
      return {
        type: r.type,
        name: r.name,
        syntax: r
      };
    case "Keyword":
      return {
        type: r.type,
        name: r.name.toLowerCase(),
        syntax: r
      };
    case "AtKeyword":
      return {
        type: r.type,
        name: "@" + r.name.toLowerCase(),
        syntax: r
      };
    case "Function":
      return {
        type: r.type,
        name: r.name.toLowerCase() + "(",
        syntax: r
      };
    case "String":
      return r.value.length === 3 ? {
        type: "Token",
        value: r.value.charAt(1),
        syntax: r
      } : {
        type: r.type,
        value: r.value.substr(1, r.value.length - 2).replace(/\\'/g, "'"),
        syntax: r
      };
    case "Token":
      return {
        type: r.type,
        value: r.value,
        syntax: r
      };
    case "Comma":
      return {
        type: r.type,
        syntax: r
      };
    default:
      throw new Error("Unknown node type:", r.type);
  }
}
function xc(r, t) {
  return typeof r == "string" && (r = Og(r)), {
    type: "MatchGraph",
    match: ju(r),
    syntax: t || null,
    source: r
  };
}
const { hasOwnProperty: zh } = Object.prototype, yE = 0, vE = 1, Sc = 2, Ng = 3, Ph = "Match", wE = "Mismatch", xE = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", Bh = 15e3;
function SE(r) {
  let t = null, e = null, n = r;
  for (; n !== null; )
    e = n.prev, n.prev = t, t = n, n = e;
  return t;
}
function Ll(r, t) {
  if (r.length !== t.length)
    return !1;
  for (let e = 0; e < r.length; e++) {
    const n = t.charCodeAt(e);
    let i = r.charCodeAt(e);
    if (i >= 65 && i <= 90 && (i = i | 32), i !== n)
      return !1;
  }
  return !0;
}
function kE(r) {
  return r.type !== K ? !1 : r.value !== "?";
}
function $h(r) {
  return r === null ? !0 : r.type === an || r.type === Y || r.type === kt || r.type === ee || r.type === zt || kE(r);
}
function jh(r) {
  return r === null ? !0 : r.type === rt || r.type === Ie || r.type === de || r.type === K && r.value === "/";
}
function AE(r, t, e) {
  function n() {
    do
      S++, v = S < r.length ? r[S] : null;
    while (v !== null && (v.type === ft || v.type === Ht));
  }
  function i(T) {
    const M = S + T;
    return M < r.length ? r[M] : null;
  }
  function s(T, M) {
    return {
      nextState: T,
      matchStack: E,
      syntaxStack: h,
      thenStack: f,
      tokenIndex: S,
      prev: M
    };
  }
  function a(T) {
    f = {
      nextState: T,
      matchStack: E,
      syntaxStack: h,
      prev: f
    };
  }
  function o(T) {
    p = s(T, p);
  }
  function l() {
    E = {
      type: vE,
      syntax: t.syntax,
      token: v,
      prev: E
    }, n(), m = null, S > A && (A = S);
  }
  function c() {
    h = {
      syntax: t.syntax,
      opts: t.syntax.opts || h !== null && h.opts || null,
      prev: h
    }, E = {
      type: Sc,
      syntax: t.syntax,
      token: E.token,
      prev: E
    };
  }
  function u() {
    E.type === Sc ? E = E.prev : E = {
      type: Ng,
      syntax: h.syntax,
      token: E.token,
      prev: E
    }, h = h.prev;
  }
  let h = null, f = null, p = null, m = null, y = 0, w = null, v = null, S = -1, A = 0, E = {
    type: yE,
    syntax: null,
    token: null,
    prev: null
  };
  for (n(); w === null && ++y < Bh; )
    switch (t.type) {
      case "Match":
        if (f === null) {
          if (v !== null && (S !== r.length - 1 || v.value !== "\\0" && v.value !== "\\9")) {
            t = nt;
            break;
          }
          w = Ph;
          break;
        }
        if (t = f.nextState, t === $u)
          if (f.matchStack === E) {
            t = nt;
            break;
          } else
            t = J;
        for (; f.syntaxStack !== h; )
          u();
        f = f.prev;
        break;
      case "Mismatch":
        if (m !== null && m !== !1)
          (p === null || S > p.tokenIndex) && (p = m, m = !1);
        else if (p === null) {
          w = wE;
          break;
        }
        t = p.nextState, f = p.thenStack, h = p.syntaxStack, E = p.matchStack, S = p.tokenIndex, v = S < r.length ? r[S] : null, p = p.prev;
        break;
      case "MatchGraph":
        t = t.match;
        break;
      case "If":
        t.else !== nt && o(t.else), t.then !== J && a(t.then), t = t.match;
        break;
      case "MatchOnce":
        t = {
          type: "MatchOnceBuffer",
          syntax: t,
          index: 0,
          mask: 0
        };
        break;
      case "MatchOnceBuffer": {
        const N = t.syntax.terms;
        if (t.index === N.length) {
          if (t.mask === 0 || t.syntax.all) {
            t = nt;
            break;
          }
          t = J;
          break;
        }
        if (t.mask === (1 << N.length) - 1) {
          t = J;
          break;
        }
        for (; t.index < N.length; t.index++) {
          const k = 1 << t.index;
          if (!(t.mask & k)) {
            o(t), a({
              type: "AddMatchOnce",
              syntax: t.syntax,
              mask: t.mask | k
            }), t = N[t.index++];
            break;
          }
        }
        break;
      }
      case "AddMatchOnce":
        t = {
          type: "MatchOnceBuffer",
          syntax: t.syntax,
          index: 0,
          mask: t.mask
        };
        break;
      case "Enum":
        if (v !== null) {
          let N = v.value.toLowerCase();
          if (N.indexOf("\\") !== -1 && (N = N.replace(/\\[09].*$/, "")), zh.call(t.map, N)) {
            t = t.map[N];
            break;
          }
        }
        t = nt;
        break;
      case "Generic": {
        const N = h !== null ? h.opts : null, k = S + Math.floor(t.fn(v, i, N));
        if (!isNaN(k) && k > S) {
          for (; S < k; )
            l();
          t = J;
        } else
          t = nt;
        break;
      }
      case "Type":
      case "Property": {
        const N = t.type === "Type" ? "types" : "properties", k = zh.call(e, N) ? e[N][t.name] : null;
        if (!k || !k.match)
          throw new Error(
            "Bad syntax reference: " + (t.type === "Type" ? "<" + t.name + ">" : "<'" + t.name + "'>")
          );
        if (m !== !1 && v !== null && t.type === "Type" && // https://drafts.csswg.org/css-values-4/#custom-idents
        // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
        // can only claim the keyword if no other unfulfilled production can claim it.
        (t.name === "custom-ident" && v.type === R || // https://drafts.csswg.org/css-values-4/#lengths
        // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
        // it must parse as a <number>
        t.name === "length" && v.value === "0")) {
          m === null && (m = s(t, p)), t = nt;
          break;
        }
        c(), t = k.match;
        break;
      }
      case "Keyword": {
        const N = t.name;
        if (v !== null) {
          let k = v.value;
          if (k.indexOf("\\") !== -1 && (k = k.replace(/\\[09].*$/, "")), Ll(k, N)) {
            l(), t = J;
            break;
          }
        }
        t = nt;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (v !== null && Ll(v.value, t.name)) {
          l(), t = J;
          break;
        }
        t = nt;
        break;
      case "Token":
        if (v !== null && v.value === t.value) {
          l(), t = J;
          break;
        }
        t = nt;
        break;
      case "Comma":
        v !== null && v.type === an ? $h(E.token) ? t = nt : (l(), t = jh(v) ? nt : J) : t = $h(E.token) || jh(v) ? J : nt;
        break;
      case "String":
        let T = "", M = S;
        for (; M < r.length && T.length < t.value.length; M++)
          T += r[M].value;
        if (Ll(T, t.value)) {
          for (; S < M; )
            l();
          t = J;
        } else
          t = nt;
        break;
      default:
        throw new Error("Unknown node type: " + t.type);
    }
  switch (w) {
    case null:
      console.warn("[csstree-match] BREAK after " + Bh + " iterations"), w = xE, E = null;
      break;
    case Ph:
      for (; h !== null; )
        u();
      break;
    default:
      E = null;
  }
  return {
    tokens: r,
    reason: w,
    iterations: y,
    match: E,
    longestMatch: A
  };
}
function Fh(r, t, e) {
  const n = AE(r, t, e || {});
  if (n.match === null)
    return n;
  let i = n.match, s = n.match = {
    syntax: t.syntax || null,
    match: []
  };
  const a = [s];
  for (i = SE(i).prev; i !== null; ) {
    switch (i.type) {
      case Sc:
        s.match.push(s = {
          syntax: i.syntax,
          match: []
        }), a.push(s);
        break;
      case Ng:
        a.pop(), s = a[a.length - 1];
        break;
      default:
        s.match.push({
          syntax: i.syntax || null,
          token: i.token.value,
          node: i.token.node
        });
    }
    i = i.prev;
  }
  return n;
}
function Mg(r) {
  function t(i) {
    return i === null ? !1 : i.type === "Type" || i.type === "Property" || i.type === "Keyword";
  }
  function e(i) {
    if (Array.isArray(i.match)) {
      for (let s = 0; s < i.match.length; s++)
        if (e(i.match[s]))
          return t(i.syntax) && n.unshift(i.syntax), !0;
    } else if (i.node === r)
      return n = t(i.syntax) ? [i.syntax] : [], !0;
    return !1;
  }
  let n = null;
  return this.matched !== null && e(this.matched), n;
}
function EE(r, t) {
  return Fu(this, r, (e) => e.type === "Type" && e.name === t);
}
function CE(r, t) {
  return Fu(this, r, (e) => e.type === "Property" && e.name === t);
}
function TE(r) {
  return Fu(this, r, (t) => t.type === "Keyword");
}
function Fu(r, t, e) {
  const n = Mg.call(r, t);
  return n === null ? !1 : n.some(e);
}
const LE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getTrace: Mg,
  isKeyword: TE,
  isProperty: CE,
  isType: EE
}, Symbol.toStringTag, { value: "Module" }));
function qg(r) {
  return "node" in r ? r.node : qg(r.match[0]);
}
function _g(r) {
  return "node" in r ? r.node : _g(r.match[r.match.length - 1]);
}
function Hh(r, t, e, n, i) {
  function s(o) {
    if (o.syntax !== null && o.syntax.type === n && o.syntax.name === i) {
      const l = qg(o), c = _g(o);
      r.syntax.walk(t, function(u, h, f) {
        if (u === l) {
          const p = new mt();
          do {
            if (p.appendData(h.data), h.data === c)
              break;
            h = h.next;
          } while (h !== null);
          a.push({
            parent: f,
            nodes: p
          });
        }
      });
    }
    Array.isArray(o.match) && o.match.forEach(s);
  }
  const a = [];
  return e.matched !== null && s(e.matched), a;
}
const { hasOwnProperty: Wi } = Object.prototype;
function Dl(r) {
  return typeof r == "number" && isFinite(r) && Math.floor(r) === r && r >= 0;
}
function Uh(r) {
  return !!r && Dl(r.offset) && Dl(r.line) && Dl(r.column);
}
function DE(r, t) {
  return function(e, n) {
    if (!e || e.constructor !== Object)
      return n(e, "Type of node should be an Object");
    for (let i in e) {
      let s = !0;
      if (Wi.call(e, i) !== !1) {
        if (i === "type")
          e.type !== r && n(e, "Wrong node type `" + e.type + "`, expected `" + r + "`");
        else if (i === "loc") {
          if (e.loc === null)
            continue;
          if (e.loc && e.loc.constructor === Object)
            if (typeof e.loc.source != "string")
              i += ".source";
            else if (!Uh(e.loc.start))
              i += ".start";
            else if (!Uh(e.loc.end))
              i += ".end";
            else
              continue;
          s = !1;
        } else if (t.hasOwnProperty(i)) {
          s = !1;
          for (let a = 0; !s && a < t[i].length; a++) {
            const o = t[i][a];
            switch (o) {
              case String:
                s = typeof e[i] == "string";
                break;
              case Boolean:
                s = typeof e[i] == "boolean";
                break;
              case null:
                s = e[i] === null;
                break;
              default:
                typeof o == "string" ? s = e[i] && e[i].type === o : Array.isArray(o) && (s = e[i] instanceof mt);
            }
          }
        } else
          n(e, "Unknown field `" + i + "` for " + r + " node type");
        s || n(e, "Bad value for `" + r + "." + i + "`");
      }
    }
    for (const i in t)
      Wi.call(t, i) && Wi.call(e, i) === !1 && n(e, "Field `" + r + "." + i + "` is missed");
  };
}
function OE(r, t) {
  const e = t.structure, n = {
    type: String,
    loc: !0
  }, i = {
    type: '"' + r + '"'
  };
  for (const s in e) {
    if (Wi.call(e, s) === !1)
      continue;
    const a = [], o = n[s] = Array.isArray(e[s]) ? e[s].slice() : [e[s]];
    for (let l = 0; l < o.length; l++) {
      const c = o[l];
      if (c === String || c === Boolean)
        a.push(c.name);
      else if (c === null)
        a.push("null");
      else if (typeof c == "string")
        a.push("<" + c + ">");
      else if (Array.isArray(c))
        a.push("List");
      else
        throw new Error("Wrong value `" + c + "` in `" + r + "." + s + "` structure definition");
    }
    i[s] = a.join(" | ");
  }
  return {
    docs: i,
    check: DE(r, n)
  };
}
function IE(r) {
  const t = {};
  if (r.node) {
    for (const e in r.node)
      if (Wi.call(r.node, e)) {
        const n = r.node[e];
        if (n.structure)
          t[e] = OE(e, n);
        else
          throw new Error("Missed `structure` field in `" + e + "` node type definition");
      }
  }
  return t;
}
const NE = xc(yg.join(" | "));
function kc(r, t, e) {
  const n = {};
  for (const i in r)
    r[i].syntax && (n[i] = e ? r[i].syntax : Nu(r[i].syntax, { compact: t }));
  return n;
}
function ME(r, t, e) {
  const n = {};
  for (const [i, s] of Object.entries(r))
    n[i] = {
      prelude: s.prelude && (e ? s.prelude.syntax : Nu(s.prelude.syntax, { compact: t })),
      descriptors: s.descriptors && kc(s.descriptors, t, e)
    };
  return n;
}
function qE(r) {
  for (let t = 0; t < r.length; t++)
    if (r[t].value.toLowerCase() === "var(")
      return !0;
  return !1;
}
function ve(r, t, e) {
  return G({
    matched: r,
    iterations: e,
    error: t
  }, LE);
}
function Cr(r, t, e, n) {
  const i = pE(e, r.syntax);
  let s;
  return qE(i) ? ve(null, new Error("Matching for a tree with var() is not supported")) : (n && (s = Fh(i, r.cssWideKeywordsSyntax, r)), (!n || !s.match) && (s = Fh(i, t.match, r), !s.match) ? ve(
    null,
    new uA(s.reason, t.syntax, e, s),
    s.iterations
  ) : ve(s.match, null, s.iterations));
}
class Vh {
  constructor(t, e, n) {
    if (this.cssWideKeywordsSyntax = NE, this.syntax = e, this.generic = !1, this.units = G({}, Th), this.atrules = /* @__PURE__ */ Object.create(null), this.properties = /* @__PURE__ */ Object.create(null), this.types = /* @__PURE__ */ Object.create(null), this.structure = n || IE(t), t) {
      if (t.units)
        for (const i of Object.keys(Th))
          Array.isArray(t.units[i]) && (this.units[i] = t.units[i]);
      if (t.types)
        for (const i in t.types)
          this.addType_(i, t.types[i]);
      if (t.generic) {
        this.generic = !0;
        for (const [i, s] of Object.entries(MA(this.units)))
          this.addType_(i, s);
      }
      if (t.atrules)
        for (const i in t.atrules)
          this.addAtrule_(i, t.atrules[i]);
      if (t.properties)
        for (const i in t.properties)
          this.addProperty_(i, t.properties[i]);
    }
  }
  checkStructure(t) {
    function e(s, a) {
      i.push({ node: s, message: a });
    }
    const n = this.structure, i = [];
    return this.syntax.walk(t, function(s) {
      n.hasOwnProperty(s.type) ? n[s.type].check(s, e) : e(s, "Unknown node type `" + s.type + "`");
    }), i.length ? i : !1;
  }
  createDescriptor(t, e, n, i = null) {
    const s = {
      type: e,
      name: n
    }, a = {
      type: e,
      name: n,
      parent: i,
      serializable: typeof t == "string" || t && typeof t.type == "string",
      syntax: null,
      match: null
    };
    return typeof t == "function" ? a.match = xc(t, s) : (typeof t == "string" ? Object.defineProperty(a, "syntax", {
      get() {
        return Object.defineProperty(a, "syntax", {
          value: Og(t)
        }), a.syntax;
      }
    }) : a.syntax = t, Object.defineProperty(a, "match", {
      get() {
        return Object.defineProperty(a, "match", {
          value: xc(a.syntax, s)
        }), a.match;
      }
    })), a;
  }
  addAtrule_(t, e) {
    e && (this.atrules[t] = {
      type: "Atrule",
      name: t,
      prelude: e.prelude ? this.createDescriptor(e.prelude, "AtrulePrelude", t) : null,
      descriptors: e.descriptors ? Object.keys(e.descriptors).reduce(
        (n, i) => (n[i] = this.createDescriptor(e.descriptors[i], "AtruleDescriptor", i, t), n),
        /* @__PURE__ */ Object.create(null)
      ) : null
    });
  }
  addProperty_(t, e) {
    e && (this.properties[t] = this.createDescriptor(e, "Property", t));
  }
  addType_(t, e) {
    e && (this.types[t] = this.createDescriptor(e, "Type", t));
  }
  checkAtruleName(t) {
    if (!this.getAtrule(t))
      return new Ri("Unknown at-rule", "@" + t);
  }
  checkAtrulePrelude(t, e) {
    const n = this.checkAtruleName(t);
    if (n)
      return n;
    const i = this.getAtrule(t);
    if (!i.prelude && e)
      return new SyntaxError("At-rule `@" + t + "` should not contain a prelude");
    if (i.prelude && !e && !Cr(this, i.prelude, "", !1).matched)
      return new SyntaxError("At-rule `@" + t + "` should contain a prelude");
  }
  checkAtruleDescriptorName(t, e) {
    const n = this.checkAtruleName(t);
    if (n)
      return n;
    const i = this.getAtrule(t), s = Al(e);
    if (!i.descriptors)
      return new SyntaxError("At-rule `@" + t + "` has no known descriptors");
    if (!i.descriptors[s.name] && !i.descriptors[s.basename])
      return new Ri("Unknown at-rule descriptor", e);
  }
  checkPropertyName(t) {
    if (!this.getProperty(t))
      return new Ri("Unknown property", t);
  }
  matchAtrulePrelude(t, e) {
    const n = this.checkAtrulePrelude(t, e);
    if (n)
      return ve(null, n);
    const i = this.getAtrule(t);
    return i.prelude ? Cr(this, i.prelude, e || "", !1) : ve(null, null);
  }
  matchAtruleDescriptor(t, e, n) {
    const i = this.checkAtruleDescriptorName(t, e);
    if (i)
      return ve(null, i);
    const s = this.getAtrule(t), a = Al(e);
    return Cr(this, s.descriptors[a.name] || s.descriptors[a.basename], n, !1);
  }
  matchDeclaration(t) {
    return t.type !== "Declaration" ? ve(null, new Error("Not a Declaration node")) : this.matchProperty(t.property, t.value);
  }
  matchProperty(t, e) {
    if (Ch(t).custom)
      return ve(null, new Error("Lexer matching doesn't applicable for custom properties"));
    const n = this.checkPropertyName(t);
    return n ? ve(null, n) : Cr(this, this.getProperty(t), e, !0);
  }
  matchType(t, e) {
    const n = this.getType(t);
    return n ? Cr(this, n, e, !1) : ve(null, new Ri("Unknown type", t));
  }
  match(t, e) {
    return typeof t != "string" && (!t || !t.type) ? ve(null, new Ri("Bad syntax")) : ((typeof t == "string" || !t.match) && (t = this.createDescriptor(t, "Type", "anonymous")), Cr(this, t, e, !1));
  }
  findValueFragments(t, e, n, i) {
    return Hh(this, e, this.matchProperty(t, e), n, i);
  }
  findDeclarationValueFragments(t, e, n) {
    return Hh(this, t.value, this.matchDeclaration(t), e, n);
  }
  findAllFragments(t, e, n) {
    const i = [];
    return this.syntax.walk(t, {
      visit: "Declaration",
      enter: (s) => {
        i.push.apply(i, this.findDeclarationValueFragments(s, e, n));
      }
    }), i;
  }
  getAtrule(t, e = !0) {
    const n = Al(t);
    return (n.vendor && e ? this.atrules[n.name] || this.atrules[n.basename] : this.atrules[n.name]) || null;
  }
  getAtrulePrelude(t, e = !0) {
    const n = this.getAtrule(t, e);
    return n && n.prelude || null;
  }
  getAtruleDescriptor(t, e) {
    return this.atrules.hasOwnProperty(t) && this.atrules.declarators && this.atrules[t].declarators[e] || null;
  }
  getProperty(t, e = !0) {
    const n = Ch(t);
    return (n.vendor && e ? this.properties[n.name] || this.properties[n.basename] : this.properties[n.name]) || null;
  }
  getType(t) {
    return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
  }
  validate() {
    function t(i, s, a, o) {
      if (a.has(s))
        return a.get(s);
      a.set(s, !1), o.syntax !== null && dE(o.syntax, function(l) {
        if (l.type !== "Type" && l.type !== "Property")
          return;
        const c = l.type === "Type" ? i.types : i.properties, u = l.type === "Type" ? e : n;
        (!hasOwnProperty.call(c, l.name) || t(i, l.name, u, c[l.name])) && a.set(s, !0);
      }, this);
    }
    let e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
    for (const i in this.types)
      t(this, i, e, this.types[i]);
    for (const i in this.properties)
      t(this, i, n, this.properties[i]);
    return e = [...e.keys()].filter((i) => e.get(i)), n = [...n.keys()].filter((i) => n.get(i)), e.length || n.length ? {
      types: e,
      properties: n
    } : null;
  }
  dump(t, e) {
    return {
      generic: this.generic,
      units: this.units,
      types: kc(this.types, !e, t),
      properties: kc(this.properties, !e, t),
      atrules: ME(this.atrules, !e, t)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
}
function Ol(r, t) {
  return typeof t == "string" && /^\s*\|/.test(t) ? typeof r == "string" ? r + t : t.replace(/^\s*\|\s*/, "") : t || null;
}
function Gh(r, t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const [n, i] of Object.entries(r))
    if (i) {
      e[n] = {};
      for (const s of Object.keys(i))
        t.includes(s) && (e[n][s] = i[s]);
    }
  return e;
}
function Ac(r, t) {
  const e = G({}, r);
  for (const [n, i] of Object.entries(t))
    switch (n) {
      case "generic":
        e[n] = !!i;
        break;
      case "units":
        e[n] = G({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = Array.isArray(a) ? a : [];
        break;
      case "atrules":
        e[n] = G({}, r[n]);
        for (const [s, a] of Object.entries(i)) {
          const o = e[n][s] || {}, l = e[n][s] = {
            prelude: o.prelude || null,
            descriptors: G({}, o.descriptors)
          };
          if (a) {
            l.prelude = a.prelude ? Ol(l.prelude, a.prelude) : l.prelude || null;
            for (const [c, u] of Object.entries(a.descriptors || {}))
              l.descriptors[c] = u ? Ol(l.descriptors[c], u) : null;
            Object.keys(l.descriptors).length || (l.descriptors = null);
          }
        }
        break;
      case "types":
      case "properties":
        e[n] = G({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = Ol(e[n][s], a);
        break;
      case "scope":
        e[n] = G({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = G(G({}, e[n][s]), a);
        break;
      case "parseContext":
        e[n] = G(G({}, r[n]), i);
        break;
      case "atrule":
      case "pseudo":
        e[n] = G(G({}, r[n]), Gh(i, ["parse"]));
        break;
      case "node":
        e[n] = G(G({}, r[n]), Gh(i, ["name", "structure", "parse", "generate", "walkContext"]));
        break;
    }
  return e;
}
function Rg(r) {
  const t = $k(r), e = iA(r), n = tA(r), { fromPlainObject: i, toPlainObject: s } = eA(e), a = {
    lexer: null,
    createLexer: (o) => new Vh(o, a, a.lexer.structure),
    tokenize: io,
    parse: t,
    generate: n,
    walk: e,
    find: e.find,
    findLast: e.findLast,
    findAll: e.findAll,
    fromPlainObject: i,
    toPlainObject: s,
    fork(o) {
      const l = Ac({}, r);
      return Rg(
        typeof o == "function" ? o(l, Object.assign) : Ac(l, o)
      );
    }
  };
  return a.lexer = new Vh({
    generic: !0,
    units: r.units,
    types: r.types,
    atrules: r.atrules,
    properties: r.properties,
    node: r.node
  }, a), a;
}
const _E = (r) => Rg(Ac({}, r)), RE = {
  generic: !0,
  units: {
    angle: [
      "deg",
      "grad",
      "rad",
      "turn"
    ],
    decibel: [
      "db"
    ],
    flex: [
      "fr"
    ],
    frequency: [
      "hz",
      "khz"
    ],
    length: [
      "cm",
      "mm",
      "q",
      "in",
      "pt",
      "pc",
      "px",
      "em",
      "rem",
      "ex",
      "rex",
      "cap",
      "rcap",
      "ch",
      "rch",
      "ic",
      "ric",
      "lh",
      "rlh",
      "vw",
      "svw",
      "lvw",
      "dvw",
      "vh",
      "svh",
      "lvh",
      "dvh",
      "vi",
      "svi",
      "lvi",
      "dvi",
      "vb",
      "svb",
      "lvb",
      "dvb",
      "vmin",
      "svmin",
      "lvmin",
      "dvmin",
      "vmax",
      "svmax",
      "lvmax",
      "dvmax",
      "cqw",
      "cqh",
      "cqi",
      "cqb",
      "cqmin",
      "cqmax"
    ],
    resolution: [
      "dpi",
      "dpcm",
      "dppx",
      "x"
    ],
    semitones: [
      "st"
    ],
    time: [
      "s",
      "ms"
    ]
  },
  types: {
    "abs()": "abs( <calc-sum> )",
    "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
    "acos()": "acos( <calc-sum> )",
    "alpha-value": "<number>|<percentage>",
    "angle-percentage": "<angle>|<percentage>",
    "angular-color-hint": "<angle-percentage>",
    "angular-color-stop": "<color>&&<color-stop-angle>?",
    "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
    "animateable-feature": "scroll-position|contents|<custom-ident>",
    "asin()": "asin( <calc-sum> )",
    "atan()": "atan( <calc-sum> )",
    "atan2()": "atan2( <calc-sum> , <calc-sum> )",
    attachment: "scroll|fixed|local",
    "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
    "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
    "attr-modifier": "i|s",
    "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
    "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
    axis: "block|inline|vertical|horizontal",
    "baseline-position": "[first|last]? baseline",
    "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
    "bg-image": "none|<image>",
    "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
    "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
    "blur()": "blur( <length> )",
    "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
    box: "border-box|padding-box|content-box",
    "brightness()": "brightness( <number-percentage> )",
    "calc()": "calc( <calc-sum> )",
    "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
    "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
    "calc-value": "<number>|<dimension>|<percentage>|<calc-constant>|( <calc-sum> )",
    "calc-constant": "e|pi|infinity|-infinity|NaN",
    "cf-final-image": "<image>|<color>",
    "cf-mixing-image": "<percentage>?&&<image>",
    "circle()": "circle( [<shape-radius>]? [at <position>]? )",
    "clamp()": "clamp( <calc-sum>#{3} )",
    "class-selector": "'.' <ident-token>",
    "clip-source": "<url>",
    color: "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
    "color-stop": "<color-stop-length>|<color-stop-angle>",
    "color-stop-angle": "<angle-percentage>{1,2}",
    "color-stop-length": "<length-percentage>{1,2}",
    "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
    combinator: "'>'|'+'|'~'|['||']",
    "common-lig-values": "[common-ligatures|no-common-ligatures]",
    "compat-auto": "searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button",
    "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
    "compositing-operator": "add|subtract|intersect|exclude",
    "compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
    "compound-selector-list": "<compound-selector>#",
    "complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
    "complex-selector-list": "<complex-selector>#",
    "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
    "contextual-alt-values": "[contextual|no-contextual]",
    "content-distribution": "space-between|space-around|space-evenly|stretch",
    "content-list": "[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>|<attr()>]+",
    "content-position": "center|start|end|flex-start|flex-end",
    "content-replacement": "<image>",
    "contrast()": "contrast( [<number-percentage>] )",
    "cos()": "cos( <calc-sum> )",
    counter: "<counter()>|<counters()>",
    "counter()": "counter( <counter-name> , <counter-style>? )",
    "counter-name": "<custom-ident>",
    "counter-style": "<counter-style-name>|symbols( )",
    "counter-style-name": "<custom-ident>",
    "counters()": "counters( <counter-name> , <string> , <counter-style>? )",
    "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
    "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
    "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
    "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
    "display-box": "contents|none",
    "display-inside": "flow|flow-root|table|flex|grid|ruby",
    "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
    "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
    "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
    "display-outside": "block|inline|run-in",
    "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
    "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
    "east-asian-width-values": "[full-width|proportional-width]",
    "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
    "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
    "ending-shape": "circle|ellipse",
    "env()": "env( <custom-ident> , <declaration-value>? )",
    "exp()": "exp( <calc-sum> )",
    "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
    "family-name": "<string>|<custom-ident>+",
    "feature-tag-value": "<string> [<integer>|on|off]?",
    "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
    "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
    "feature-value-block-list": "<feature-value-block>+",
    "feature-value-declaration": "<custom-ident> : <integer>+ ;",
    "feature-value-declaration-list": "<feature-value-declaration>",
    "feature-value-name": "<custom-ident>",
    "fill-rule": "nonzero|evenodd",
    "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
    "filter-function-list": "[<filter-function>|<url>]+",
    "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    "fixed-breadth": "<length-percentage>",
    "fixed-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
    "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
    "font-variant-css21": "[normal|small-caps]",
    "font-weight-absolute": "normal|bold|<number [1,1000]>",
    "frequency-percentage": "<frequency>|<percentage>",
    "general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
    "generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
    "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
    "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
    gradient: "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<repeating-conic-gradient()>|<-legacy-gradient>",
    "grayscale()": "grayscale( <number-percentage> )",
    "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
    "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
    "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
    "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
    hue: "<number>|<angle>",
    "hue-rotate()": "hue-rotate( <angle> )",
    "hwb()": "hwb( [<hue>|none] [<percentage>|none] [<percentage>|none] [/ [<alpha-value>|none]]? )",
    "hypot()": "hypot( <calc-sum># )",
    image: "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
    "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
    "image-set()": "image-set( <image-set-option># )",
    "image-set-option": "[<image>|<string>] [<resolution>||type( <string> )]",
    "image-src": "<url>|<string>",
    "image-tags": "ltr|rtl",
    "inflexible-breadth": "<length-percentage>|min-content|max-content|auto",
    "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
    "invert()": "invert( <number-percentage> )",
    "keyframes-name": "<custom-ident>|<string>",
    "keyframe-block": "<keyframe-selector># { <declaration-list> }",
    "keyframe-block-list": "<keyframe-block>+",
    "keyframe-selector": "from|to|<percentage>",
    "lab()": "lab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "layer()": "layer( <layer-name> )",
    "layer-name": "<ident> ['.' <ident>]*",
    "lch()": "lch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
    "leader()": "leader( <leader-type> )",
    "leader-type": "dotted|solid|space|<string>",
    "length-percentage": "<length>|<percentage>",
    "line-names": "'[' <custom-ident>* ']'",
    "line-name-list": "[<line-names>|<name-repeat>]+",
    "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
    "line-width": "<length>|thin|medium|thick",
    "linear-color-hint": "<length-percentage>",
    "linear-color-stop": "<color> <color-stop-length>?",
    "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
    "log()": "log( <calc-sum> , <calc-sum>? )",
    "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
    "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
    "mask-reference": "none|<image>|<mask-source>",
    "mask-source": "<url>",
    "masking-mode": "alpha|luminance|match-source",
    "matrix()": "matrix( <number>#{6} )",
    "matrix3d()": "matrix3d( <number>#{16} )",
    "max()": "max( <calc-sum># )",
    "media-and": "<media-in-parens> [and <media-in-parens>]+",
    "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
    "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
    "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
    "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
    "media-not": "not <media-in-parens>",
    "media-or": "<media-in-parens> [or <media-in-parens>]+",
    "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
    "media-query-list": "<media-query>#",
    "media-type": "<ident>",
    "mf-boolean": "<mf-name>",
    "mf-name": "<ident>",
    "mf-plain": "<mf-name> : <mf-value>",
    "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
    "mf-value": "<number>|<dimension>|<ident>|<ratio>",
    "min()": "min( <calc-sum># )",
    "minmax()": "minmax( [<length-percentage>|min-content|max-content|auto] , [<length-percentage>|<flex>|min-content|max-content|auto] )",
    "mod()": "mod( <calc-sum> , <calc-sum> )",
    "name-repeat": "repeat( [<integer [1,∞]>|auto-fill] , <line-names>+ )",
    "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
    "namespace-prefix": "<ident>",
    "ns-prefix": "[<ident-token>|'*']? '|'",
    "number-percentage": "<number>|<percentage>",
    "numeric-figure-values": "[lining-nums|oldstyle-nums]",
    "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
    "numeric-spacing-values": "[proportional-nums|tabular-nums]",
    nth: "<an-plus-b>|even|odd",
    "opacity()": "opacity( [<number-percentage>] )",
    "overflow-position": "unsafe|safe",
    "outline-radius": "<length>|<percentage>",
    "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
    "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
    "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
    "page-selector-list": "[<page-selector>#]?",
    "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
    "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
    "path()": "path( [<fill-rule> ,]? <string> )",
    "paint()": "paint( <ident> , <declaration-value>? )",
    "perspective()": "perspective( [<length [0,∞]>|none] )",
    "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
    position: "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
    "pow()": "pow( <calc-sum> , <calc-sum> )",
    "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
    "pseudo-element-selector": "':' <pseudo-class-selector>",
    "pseudo-page": ": [left|right|first|blank]",
    quote: "open-quote|close-quote|no-open-quote|no-close-quote",
    "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
    ratio: "<number [0,∞]> [/ <number [0,∞]>]?",
    "relative-selector": "<combinator>? <complex-selector>",
    "relative-selector-list": "<relative-selector>#",
    "relative-size": "larger|smaller",
    "rem()": "rem( <calc-sum> , <calc-sum> )",
    "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
    "repeating-conic-gradient()": "repeating-conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
    "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
    "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
    "reversed-counter-name": "reversed( <counter-name> )",
    "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
    "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
    "rotate()": "rotate( [<angle>|<zero>] )",
    "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
    "rotateX()": "rotateX( [<angle>|<zero>] )",
    "rotateY()": "rotateY( [<angle>|<zero>] )",
    "rotateZ()": "rotateZ( [<angle>|<zero>] )",
    "round()": "round( <rounding-strategy>? , <calc-sum> , <calc-sum> )",
    "rounding-strategy": "nearest|up|down|to-zero",
    "saturate()": "saturate( <number-percentage> )",
    "scale()": "scale( [<number>|<percentage>]#{1,2} )",
    "scale3d()": "scale3d( [<number>|<percentage>]#{3} )",
    "scaleX()": "scaleX( [<number>|<percentage>] )",
    "scaleY()": "scaleY( [<number>|<percentage>] )",
    "scaleZ()": "scaleZ( [<number>|<percentage>] )",
    scroller: "root|nearest",
    "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
    "shape-radius": "<length-percentage>|closest-side|farthest-side",
    "sign()": "sign( <calc-sum> )",
    "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
    "skewX()": "skewX( [<angle>|<zero>] )",
    "skewY()": "skewY( [<angle>|<zero>] )",
    "sepia()": "sepia( <number-percentage> )",
    shadow: "inset?&&<length>{2,4}&&<color>?",
    "shadow-t": "[<length>{2,3}&&<color>?]",
    shape: "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
    "shape-box": "<box>|margin-box",
    "side-or-corner": "[left|right]||[top|bottom]",
    "sin()": "sin( <calc-sum> )",
    "single-animation": "<time>||<easing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
    "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
    "single-animation-fill-mode": "none|forwards|backwards|both",
    "single-animation-iteration-count": "infinite|<number>",
    "single-animation-play-state": "running|paused",
    "single-animation-timeline": "auto|none|<timeline-name>|scroll( <axis>? <scroller>? )",
    "single-transition": "[none|<single-transition-property>]||<time>||<easing-function>||<time>",
    "single-transition-property": "all|<custom-ident>",
    size: "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
    "sqrt()": "sqrt( <calc-sum> )",
    "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
    "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
    "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
    "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
    "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
    "supports-feature": "<supports-decl>|<supports-selector-fn>",
    "supports-decl": "( <declaration> )",
    "supports-selector-fn": "selector( <complex-selector> )",
    symbol: "<string>|<image>|<custom-ident>",
    "tan()": "tan( <calc-sum> )",
    target: "<target-counter()>|<target-counters()>|<target-text()>",
    "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
    "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
    "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
    "time-percentage": "<time>|<percentage>",
    "timeline-name": "<custom-ident>|<string>",
    "easing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
    "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
    "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
    "track-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <track-size>]+ <line-names>? )",
    "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( <length-percentage> )",
    "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
    "transform-list": "<transform-function>+",
    "translate()": "translate( <length-percentage> , <length-percentage>? )",
    "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
    "translateX()": "translateX( <length-percentage> )",
    "translateY()": "translateY( <length-percentage> )",
    "translateZ()": "translateZ( <length> )",
    "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
    "type-selector": "<wq-name>|<ns-prefix>? '*'",
    "var()": "var( <custom-property-name> , <declaration-value>? )",
    "viewport-length": "auto|<length-percentage>",
    "visual-box": "content-box|padding-box|border-box",
    "wq-name": "<ns-prefix>? <ident-token>",
    "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
    "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
    "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
    "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
    "-legacy-radial-gradient-shape": "circle|ellipse",
    "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
    "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
    "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
    "-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
    "-non-standard-width": "fill-available|min-intrinsic|intrinsic|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
    "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
    "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
    "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
    "-webkit-gradient-radius": "<length>|<percentage>",
    "-webkit-gradient-type": "linear|radial",
    "-webkit-mask-box-repeat": "repeat|stretch|round",
    "-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
    "-ms-filter-function-list": "<-ms-filter-function>+",
    "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
    "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
    "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
    "-ms-filter": "<string>",
    age: "child|young|old",
    "attr-name": "<wq-name>",
    "attr-fallback": "<any-value>",
    "bg-clip": "<box>|border|text",
    bottom: "<length>|auto",
    "generic-voice": "[<age>? <gender> <integer>?]",
    gender: "male|female|neutral",
    left: "<length>|auto",
    "mask-image": "<mask-reference>#",
    paint: "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
    right: "<length>|auto",
    "scroll-timeline-axis": "block|inline|vertical|horizontal",
    "scroll-timeline-name": "none|<custom-ident>",
    "single-animation-composition": "replace|add|accumulate",
    "svg-length": "<percentage>|<length>|<number>",
    "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
    top: "<length>|auto",
    x: "<number>",
    y: "<number>",
    declaration: "<ident-token> : <declaration-value>? ['!' important]?",
    "declaration-list": "[<declaration>? ';']* <declaration>?",
    url: "url( <string> <url-modifier>* )|<url-token>",
    "url-modifier": "<ident>|<function-token> <any-value> )",
    "number-zero-one": "<number [0,1]>",
    "number-one-or-greater": "<number [1,∞]>",
    "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box"
  },
  properties: {
    "--*": "<declaration-value>",
    "-ms-accelerator": "false|true",
    "-ms-block-progression": "tb|rl|bt|lr",
    "-ms-content-zoom-chaining": "none|chained",
    "-ms-content-zooming": "none|zoom",
    "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
    "-ms-content-zoom-limit-max": "<percentage>",
    "-ms-content-zoom-limit-min": "<percentage>",
    "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
    "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
    "-ms-content-zoom-snap-type": "none|proximity|mandatory",
    "-ms-filter": "<string>",
    "-ms-flow-from": "[none|<custom-ident>]#",
    "-ms-flow-into": "[none|<custom-ident>]#",
    "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
    "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
    "-ms-high-contrast-adjust": "auto|none",
    "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
    "-ms-hyphenate-limit-lines": "no-limit|<integer>",
    "-ms-hyphenate-limit-zone": "<percentage>|<length>",
    "-ms-ime-align": "auto|after",
    "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
    "-ms-scrollbar-3dlight-color": "<color>",
    "-ms-scrollbar-arrow-color": "<color>",
    "-ms-scrollbar-base-color": "<color>",
    "-ms-scrollbar-darkshadow-color": "<color>",
    "-ms-scrollbar-face-color": "<color>",
    "-ms-scrollbar-highlight-color": "<color>",
    "-ms-scrollbar-shadow-color": "<color>",
    "-ms-scrollbar-track-color": "<color>",
    "-ms-scroll-chaining": "chained|none",
    "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
    "-ms-scroll-limit-x-max": "auto|<length>",
    "-ms-scroll-limit-x-min": "<length>",
    "-ms-scroll-limit-y-max": "auto|<length>",
    "-ms-scroll-limit-y-min": "<length>",
    "-ms-scroll-rails": "none|railed",
    "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-type": "none|proximity|mandatory",
    "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
    "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
    "-ms-scroll-translation": "none|vertical-to-horizontal",
    "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
    "-ms-touch-select": "grippers|none",
    "-ms-user-select": "none|element|text",
    "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
    "-ms-wrap-margin": "<length>",
    "-ms-wrap-through": "wrap|none",
    "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
    "-moz-binding": "<url>|none",
    "-moz-border-bottom-colors": "<color>+|none",
    "-moz-border-left-colors": "<color>+|none",
    "-moz-border-right-colors": "<color>+|none",
    "-moz-border-top-colors": "<color>+|none",
    "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
    "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
    "-moz-force-broken-image-icon": "0|1",
    "-moz-image-region": "<shape>|auto",
    "-moz-orient": "inline|block|horizontal|vertical",
    "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
    "-moz-outline-radius-bottomleft": "<outline-radius>",
    "-moz-outline-radius-bottomright": "<outline-radius>",
    "-moz-outline-radius-topleft": "<outline-radius>",
    "-moz-outline-radius-topright": "<outline-radius>",
    "-moz-stack-sizing": "ignore|stretch-to-fit",
    "-moz-text-blink": "none|blink",
    "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
    "-moz-user-input": "auto|none|enabled|disabled",
    "-moz-user-modify": "read-only|read-write|write-only",
    "-moz-window-dragging": "drag|no-drag",
    "-moz-window-shadow": "default|menu|tooltip|sheet|none",
    "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
    "-webkit-border-before": "<'border-width'>||<'border-style'>||<color>",
    "-webkit-border-before-color": "<color>",
    "-webkit-border-before-style": "<'border-style'>",
    "-webkit-border-before-width": "<'border-width'>",
    "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
    "-webkit-line-clamp": "none|<integer>",
    "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
    "-webkit-mask-attachment": "<attachment>#",
    "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
    "-webkit-mask-composite": "<composite-style>#",
    "-webkit-mask-image": "<mask-reference>#",
    "-webkit-mask-origin": "[<box>|border|padding|content]#",
    "-webkit-mask-position": "<position>#",
    "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
    "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
    "-webkit-mask-repeat": "<repeat-style>#",
    "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
    "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
    "-webkit-mask-size": "<bg-size>#",
    "-webkit-overflow-scrolling": "auto|touch",
    "-webkit-tap-highlight-color": "<color>",
    "-webkit-text-fill-color": "<color>",
    "-webkit-text-stroke": "<length>||<color>",
    "-webkit-text-stroke-color": "<color>",
    "-webkit-text-stroke-width": "<length>",
    "-webkit-touch-callout": "default|none",
    "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
    "accent-color": "auto|<color>",
    "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
    "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
    "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
    "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
    all: "initial|inherit|unset|revert|revert-layer",
    animation: "<single-animation>#",
    "animation-composition": "<single-animation-composition>#",
    "animation-delay": "<time>#",
    "animation-direction": "<single-animation-direction>#",
    "animation-duration": "<time>#",
    "animation-fill-mode": "<single-animation-fill-mode>#",
    "animation-iteration-count": "<single-animation-iteration-count>#",
    "animation-name": "[none|<keyframes-name>]#",
    "animation-play-state": "<single-animation-play-state>#",
    "animation-timing-function": "<easing-function>#",
    "animation-timeline": "<single-animation-timeline>#",
    appearance: "none|auto|textfield|menulist-button|<compat-auto>",
    "aspect-ratio": "auto|<ratio>",
    azimuth: "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
    "backdrop-filter": "none|<filter-function-list>",
    "backface-visibility": "visible|hidden",
    background: "[<bg-layer> ,]* <final-bg-layer>",
    "background-attachment": "<attachment>#",
    "background-blend-mode": "<blend-mode>#",
    "background-clip": "<bg-clip>#",
    "background-color": "<color>",
    "background-image": "<bg-image>#",
    "background-origin": "<box>#",
    "background-position": "<bg-position>#",
    "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
    "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
    "background-repeat": "<repeat-style>#",
    "background-size": "<bg-size>#",
    "block-overflow": "clip|ellipsis|<string>",
    "block-size": "<'width'>",
    border: "<line-width>||<line-style>||<color>",
    "border-block": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-color": "<'border-top-color'>{1,2}",
    "border-block-style": "<'border-top-style'>",
    "border-block-width": "<'border-top-width'>",
    "border-block-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-end-color": "<'border-top-color'>",
    "border-block-end-style": "<'border-top-style'>",
    "border-block-end-width": "<'border-top-width'>",
    "border-block-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-start-color": "<'border-top-color'>",
    "border-block-start-style": "<'border-top-style'>",
    "border-block-start-width": "<'border-top-width'>",
    "border-bottom": "<line-width>||<line-style>||<color>",
    "border-bottom-color": "<'border-top-color'>",
    "border-bottom-left-radius": "<length-percentage>{1,2}",
    "border-bottom-right-radius": "<length-percentage>{1,2}",
    "border-bottom-style": "<line-style>",
    "border-bottom-width": "<line-width>",
    "border-collapse": "collapse|separate",
    "border-color": "<color>{1,4}",
    "border-end-end-radius": "<length-percentage>{1,2}",
    "border-end-start-radius": "<length-percentage>{1,2}",
    "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
    "border-image-outset": "[<length>|<number>]{1,4}",
    "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
    "border-image-slice": "<number-percentage>{1,4}&&fill?",
    "border-image-source": "none|<image>",
    "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
    "border-inline": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-color": "<'border-top-color'>{1,2}",
    "border-inline-style": "<'border-top-style'>",
    "border-inline-width": "<'border-top-width'>",
    "border-inline-end-color": "<'border-top-color'>",
    "border-inline-end-style": "<'border-top-style'>",
    "border-inline-end-width": "<'border-top-width'>",
    "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-start-color": "<'border-top-color'>",
    "border-inline-start-style": "<'border-top-style'>",
    "border-inline-start-width": "<'border-top-width'>",
    "border-left": "<line-width>||<line-style>||<color>",
    "border-left-color": "<color>",
    "border-left-style": "<line-style>",
    "border-left-width": "<line-width>",
    "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
    "border-right": "<line-width>||<line-style>||<color>",
    "border-right-color": "<color>",
    "border-right-style": "<line-style>",
    "border-right-width": "<line-width>",
    "border-spacing": "<length> <length>?",
    "border-start-end-radius": "<length-percentage>{1,2}",
    "border-start-start-radius": "<length-percentage>{1,2}",
    "border-style": "<line-style>{1,4}",
    "border-top": "<line-width>||<line-style>||<color>",
    "border-top-color": "<color>",
    "border-top-left-radius": "<length-percentage>{1,2}",
    "border-top-right-radius": "<length-percentage>{1,2}",
    "border-top-style": "<line-style>",
    "border-top-width": "<line-width>",
    "border-width": "<line-width>{1,4}",
    bottom: "<length>|<percentage>|auto",
    "box-align": "start|center|end|baseline|stretch",
    "box-decoration-break": "slice|clone",
    "box-direction": "normal|reverse|inherit",
    "box-flex": "<number>",
    "box-flex-group": "<integer>",
    "box-lines": "single|multiple",
    "box-ordinal-group": "<integer>",
    "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
    "box-pack": "start|center|end|justify",
    "box-shadow": "none|<shadow>#",
    "box-sizing": "content-box|border-box",
    "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
    "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
    caret: "<'caret-color'>||<'caret-shape'>",
    "caret-color": "auto|<color>",
    "caret-shape": "auto|bar|block|underscore",
    clear: "none|left|right|both|inline-start|inline-end",
    clip: "<shape>|auto",
    "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
    color: "<color>",
    "print-color-adjust": "economy|exact",
    "color-scheme": "normal|[light|dark|<custom-ident>]+&&only?",
    "column-count": "<integer>|auto",
    "column-fill": "auto|balance|balance-all",
    "column-gap": "normal|<length-percentage>",
    "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
    "column-rule-color": "<color>",
    "column-rule-style": "<'border-style'>",
    "column-rule-width": "<'border-width'>",
    "column-span": "none|all",
    "column-width": "<length>|auto",
    columns: "<'column-width'>||<'column-count'>",
    contain: "none|strict|content|[[size||inline-size]||layout||style||paint]",
    "contain-intrinsic-size": "[none|<length>|auto <length>]{1,2}",
    "contain-intrinsic-block-size": "none|<length>|auto <length>",
    "contain-intrinsic-height": "none|<length>|auto <length>",
    "contain-intrinsic-inline-size": "none|<length>|auto <length>",
    "contain-intrinsic-width": "none|<length>|auto <length>",
    content: "normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>]+]?",
    "content-visibility": "visible|auto|hidden",
    "counter-increment": "[<counter-name> <integer>?]+|none",
    "counter-reset": "[<counter-name> <integer>?|<reversed-counter-name> <integer>?]+|none",
    "counter-set": "[<counter-name> <integer>?]+|none",
    cursor: "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
    direction: "ltr|rtl",
    display: "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
    "empty-cells": "show|hide",
    filter: "none|<filter-function-list>|<-ms-filter-function-list>",
    flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
    "flex-basis": "content|<'width'>",
    "flex-direction": "row|row-reverse|column|column-reverse",
    "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
    "flex-grow": "<number>",
    "flex-shrink": "<number>",
    "flex-wrap": "nowrap|wrap|wrap-reverse",
    float: "left|right|none|inline-start|inline-end",
    font: "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
    "font-family": "[<family-name>|<generic-family>]#",
    "font-feature-settings": "normal|<feature-tag-value>#",
    "font-kerning": "auto|normal|none",
    "font-language-override": "normal|<string>",
    "font-optical-sizing": "auto|none",
    "font-variation-settings": "normal|[<string> <number>]#",
    "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
    "font-size-adjust": "none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]",
    "font-smooth": "auto|never|always|<absolute-size>|<length>",
    "font-stretch": "<font-stretch-absolute>",
    "font-style": "normal|italic|oblique <angle>?",
    "font-synthesis": "none|[weight||style||small-caps]",
    "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
    "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
    "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
    "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
    "font-variant-position": "normal|sub|super",
    "font-weight": "<font-weight-absolute>|bolder|lighter",
    "forced-color-adjust": "auto|none",
    gap: "<'row-gap'> <'column-gap'>?",
    grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
    "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
    "grid-auto-columns": "<track-size>+",
    "grid-auto-flow": "[row|column]||dense",
    "grid-auto-rows": "<track-size>+",
    "grid-column": "<grid-line> [/ <grid-line>]?",
    "grid-column-end": "<grid-line>",
    "grid-column-gap": "<length-percentage>",
    "grid-column-start": "<grid-line>",
    "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
    "grid-row": "<grid-line> [/ <grid-line>]?",
    "grid-row-end": "<grid-line>",
    "grid-row-gap": "<length-percentage>",
    "grid-row-start": "<grid-line>",
    "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
    "grid-template-areas": "none|<string>+",
    "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
    height: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
    "hyphenate-character": "auto|<string>",
    hyphens: "none|manual|auto",
    "image-orientation": "from-image|<angle>|[<angle>? flip]",
    "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
    "image-resolution": "[from-image||<resolution>]&&snap?",
    "ime-mode": "auto|normal|active|inactive|disabled",
    "initial-letter": "normal|[<number> <integer>?]",
    "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
    "inline-size": "<'width'>",
    "input-security": "auto|none",
    inset: "<'top'>{1,4}",
    "inset-block": "<'top'>{1,2}",
    "inset-block-end": "<'top'>",
    "inset-block-start": "<'top'>",
    "inset-inline": "<'top'>{1,2}",
    "inset-inline-end": "<'top'>",
    "inset-inline-start": "<'top'>",
    isolation: "auto|isolate",
    "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
    "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
    "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
    "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
    left: "<length>|<percentage>|auto",
    "letter-spacing": "normal|<length-percentage>",
    "line-break": "auto|loose|normal|strict|anywhere",
    "line-clamp": "none|<integer>",
    "line-height": "normal|<number>|<length>|<percentage>",
    "line-height-step": "<length>",
    "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
    "list-style-image": "<image>|none",
    "list-style-position": "inside|outside",
    "list-style-type": "<counter-style>|<string>|none",
    margin: "[<length>|<percentage>|auto]{1,4}",
    "margin-block": "<'margin-left'>{1,2}",
    "margin-block-end": "<'margin-left'>",
    "margin-block-start": "<'margin-left'>",
    "margin-bottom": "<length>|<percentage>|auto",
    "margin-inline": "<'margin-left'>{1,2}",
    "margin-inline-end": "<'margin-left'>",
    "margin-inline-start": "<'margin-left'>",
    "margin-left": "<length>|<percentage>|auto",
    "margin-right": "<length>|<percentage>|auto",
    "margin-top": "<length>|<percentage>|auto",
    "margin-trim": "none|in-flow|all",
    mask: "<mask-layer>#",
    "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
    "mask-border-mode": "luminance|alpha",
    "mask-border-outset": "[<length>|<number>]{1,4}",
    "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
    "mask-border-slice": "<number-percentage>{1,4} fill?",
    "mask-border-source": "none|<image>",
    "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
    "mask-clip": "[<geometry-box>|no-clip]#",
    "mask-composite": "<compositing-operator>#",
    "mask-image": "<mask-reference>#",
    "mask-mode": "<masking-mode>#",
    "mask-origin": "<geometry-box>#",
    "mask-position": "<position>#",
    "mask-repeat": "<repeat-style>#",
    "mask-size": "<bg-size>#",
    "mask-type": "luminance|alpha",
    "masonry-auto-flow": "[pack|next]||[definite-first|ordered]",
    "math-depth": "auto-add|add( <integer> )|<integer>",
    "math-shift": "normal|compact",
    "math-style": "normal|compact",
    "max-block-size": "<'max-width'>",
    "max-height": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
    "max-inline-size": "<'max-width'>",
    "max-lines": "none|<integer>",
    "max-width": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>",
    "min-block-size": "<'min-width'>",
    "min-height": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
    "min-inline-size": "<'min-width'>",
    "min-width": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>",
    "mix-blend-mode": "<blend-mode>|plus-lighter",
    "object-fit": "fill|contain|cover|none|scale-down",
    "object-position": "<position>",
    offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
    "offset-anchor": "auto|<position>",
    "offset-distance": "<length-percentage>",
    "offset-path": "none|ray( [<angle>&&<size>&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
    "offset-position": "auto|<position>",
    "offset-rotate": "[auto|reverse]||<angle>",
    opacity: "<alpha-value>",
    order: "<integer>",
    orphans: "<integer>",
    outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
    "outline-color": "<color>|invert",
    "outline-offset": "<length>",
    "outline-style": "auto|<'border-style'>",
    "outline-width": "<line-width>",
    overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
    "overflow-anchor": "auto|none",
    "overflow-block": "visible|hidden|clip|scroll|auto",
    "overflow-clip-box": "padding-box|content-box",
    "overflow-clip-margin": "<visual-box>||<length [0,∞]>",
    "overflow-inline": "visible|hidden|clip|scroll|auto",
    "overflow-wrap": "normal|break-word|anywhere",
    "overflow-x": "visible|hidden|clip|scroll|auto",
    "overflow-y": "visible|hidden|clip|scroll|auto",
    "overscroll-behavior": "[contain|none|auto]{1,2}",
    "overscroll-behavior-block": "contain|none|auto",
    "overscroll-behavior-inline": "contain|none|auto",
    "overscroll-behavior-x": "contain|none|auto",
    "overscroll-behavior-y": "contain|none|auto",
    padding: "[<length>|<percentage>]{1,4}",
    "padding-block": "<'padding-left'>{1,2}",
    "padding-block-end": "<'padding-left'>",
    "padding-block-start": "<'padding-left'>",
    "padding-bottom": "<length>|<percentage>",
    "padding-inline": "<'padding-left'>{1,2}",
    "padding-inline-end": "<'padding-left'>",
    "padding-inline-start": "<'padding-left'>",
    "padding-left": "<length>|<percentage>",
    "padding-right": "<length>|<percentage>",
    "padding-top": "<length>|<percentage>",
    "page-break-after": "auto|always|avoid|left|right|recto|verso",
    "page-break-before": "auto|always|avoid|left|right|recto|verso",
    "page-break-inside": "auto|avoid",
    "paint-order": "normal|[fill||stroke||markers]",
    perspective: "none|<length>",
    "perspective-origin": "<position>",
    "place-content": "<'align-content'> <'justify-content'>?",
    "place-items": "<'align-items'> <'justify-items'>?",
    "place-self": "<'align-self'> <'justify-self'>?",
    "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
    position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
    quotes: "none|auto|[<string> <string>]+",
    resize: "none|both|horizontal|vertical|block|inline",
    right: "<length>|<percentage>|auto",
    rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
    "row-gap": "normal|<length-percentage>",
    "ruby-align": "start|center|space-between|space-around",
    "ruby-merge": "separate|collapse|auto",
    "ruby-position": "[alternate||[over|under]]|inter-character",
    scale: "none|<number>{1,3}",
    "scrollbar-color": "auto|<color>{2}",
    "scrollbar-gutter": "auto|stable&&both-edges?",
    "scrollbar-width": "auto|thin|none",
    "scroll-behavior": "auto|smooth",
    "scroll-margin": "<length>{1,4}",
    "scroll-margin-block": "<length>{1,2}",
    "scroll-margin-block-start": "<length>",
    "scroll-margin-block-end": "<length>",
    "scroll-margin-bottom": "<length>",
    "scroll-margin-inline": "<length>{1,2}",
    "scroll-margin-inline-start": "<length>",
    "scroll-margin-inline-end": "<length>",
    "scroll-margin-left": "<length>",
    "scroll-margin-right": "<length>",
    "scroll-margin-top": "<length>",
    "scroll-padding": "[auto|<length-percentage>]{1,4}",
    "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-block-start": "auto|<length-percentage>",
    "scroll-padding-block-end": "auto|<length-percentage>",
    "scroll-padding-bottom": "auto|<length-percentage>",
    "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-inline-start": "auto|<length-percentage>",
    "scroll-padding-inline-end": "auto|<length-percentage>",
    "scroll-padding-left": "auto|<length-percentage>",
    "scroll-padding-right": "auto|<length-percentage>",
    "scroll-padding-top": "auto|<length-percentage>",
    "scroll-snap-align": "[none|start|end|center]{1,2}",
    "scroll-snap-coordinate": "none|<position>#",
    "scroll-snap-destination": "<position>",
    "scroll-snap-points-x": "none|repeat( <length-percentage> )",
    "scroll-snap-points-y": "none|repeat( <length-percentage> )",
    "scroll-snap-stop": "normal|always",
    "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
    "scroll-snap-type-x": "none|mandatory|proximity",
    "scroll-snap-type-y": "none|mandatory|proximity",
    "scroll-timeline": "<scroll-timeline-name>||<scroll-timeline-axis>",
    "scroll-timeline-axis": "block|inline|vertical|horizontal",
    "scroll-timeline-name": "none|<custom-ident>",
    "shape-image-threshold": "<alpha-value>",
    "shape-margin": "<length-percentage>",
    "shape-outside": "none|[<shape-box>||<basic-shape>]|<image>",
    "tab-size": "<integer>|<length>",
    "table-layout": "auto|fixed",
    "text-align": "start|end|left|right|center|justify|match-parent",
    "text-align-last": "auto|start|end|left|right|center|justify",
    "text-combine-upright": "none|all|[digits <integer>?]",
    "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
    "text-decoration-color": "<color>",
    "text-decoration-line": "none|[underline||overline||line-through||blink]|spelling-error|grammar-error",
    "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
    "text-decoration-skip-ink": "auto|all|none",
    "text-decoration-style": "solid|double|dotted|dashed|wavy",
    "text-decoration-thickness": "auto|from-font|<length>|<percentage>",
    "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
    "text-emphasis-color": "<color>",
    "text-emphasis-position": "[over|under]&&[right|left]",
    "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
    "text-indent": "<length-percentage>&&hanging?&&each-line?",
    "text-justify": "auto|inter-character|inter-word|none",
    "text-orientation": "mixed|upright|sideways",
    "text-overflow": "[clip|ellipsis|<string>]{1,2}",
    "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
    "text-shadow": "none|<shadow-t>#",
    "text-size-adjust": "none|auto|<percentage>",
    "text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
    "text-underline-offset": "auto|<length>|<percentage>",
    "text-underline-position": "auto|from-font|[under||[left|right]]",
    top: "<length>|<percentage>|auto",
    "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
    transform: "none|<transform-list>",
    "transform-box": "content-box|border-box|fill-box|stroke-box|view-box",
    "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
    "transform-style": "flat|preserve-3d",
    transition: "<single-transition>#",
    "transition-delay": "<time>#",
    "transition-duration": "<time>#",
    "transition-property": "none|<single-transition-property>#",
    "transition-timing-function": "<easing-function>#",
    translate: "none|<length-percentage> [<length-percentage> <length>?]?",
    "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext",
    "user-select": "auto|text|none|contain|all",
    "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
    visibility: "visible|hidden|collapse",
    "white-space": "normal|pre|nowrap|pre-wrap|pre-line|break-spaces",
    widows: "<integer>",
    width: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|fill|stretch|intrinsic|-moz-max-content|-webkit-max-content|-moz-fit-content|-webkit-fit-content",
    "will-change": "auto|<animateable-feature>#",
    "word-break": "normal|break-all|keep-all|break-word",
    "word-spacing": "normal|<length>",
    "word-wrap": "normal|break-word",
    "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
    "z-index": "auto|<integer>",
    zoom: "normal|reset|<number>|<percentage>",
    "-moz-background-clip": "padding|border",
    "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
    "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
    "-moz-border-radius-topleft": "<'border-top-left-radius'>",
    "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
    "-moz-control-character-visibility": "visible|hidden",
    "-moz-osx-font-smoothing": "auto|grayscale",
    "-moz-user-select": "none|text|all|-moz-none",
    "-ms-flex-align": "start|end|center|baseline|stretch",
    "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
    "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
    "-ms-flex-negative": "<'flex-shrink'>",
    "-ms-flex-pack": "start|end|center|justify|distribute",
    "-ms-flex-order": "<integer>",
    "-ms-flex-positive": "<'flex-grow'>",
    "-ms-flex-preferred-size": "<'flex-basis'>",
    "-ms-interpolation-mode": "nearest-neighbor|bicubic",
    "-ms-grid-column-align": "start|end|center|stretch",
    "-ms-grid-row-align": "start|end|center|stretch",
    "-ms-hyphenate-limit-last": "none|always|column|page|spread",
    "-webkit-background-clip": "[<box>|border|padding|content|text]#",
    "-webkit-column-break-after": "always|auto|avoid",
    "-webkit-column-break-before": "always|auto|avoid",
    "-webkit-column-break-inside": "always|auto|avoid",
    "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
    "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
    "-webkit-print-color-adjust": "economy|exact",
    "-webkit-text-security": "none|circle|disc|square",
    "-webkit-user-drag": "none|element|auto",
    "-webkit-user-select": "auto|none|text|all",
    "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
    "baseline-shift": "baseline|sub|super|<svg-length>",
    behavior: "<url>+",
    "clip-rule": "nonzero|evenodd",
    cue: "<'cue-before'> <'cue-after'>?",
    "cue-after": "<url> <decibel>?|none",
    "cue-before": "<url> <decibel>?|none",
    "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
    fill: "<paint>",
    "fill-opacity": "<number-zero-one>",
    "fill-rule": "nonzero|evenodd",
    "glyph-orientation-horizontal": "<angle>",
    "glyph-orientation-vertical": "<angle>",
    kerning: "auto|<svg-length>",
    marker: "none|<url>",
    "marker-end": "none|<url>",
    "marker-mid": "none|<url>",
    "marker-start": "none|<url>",
    pause: "<'pause-before'> <'pause-after'>?",
    "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    rest: "<'rest-before'> <'rest-after'>?",
    "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
    src: "[<url> [format( <string># )]?|local( <family-name> )]#",
    speak: "auto|none|normal",
    "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
    stroke: "<paint>",
    "stroke-dasharray": "none|[<svg-length>+]#",
    "stroke-dashoffset": "<svg-length>",
    "stroke-linecap": "butt|round|square",
    "stroke-linejoin": "miter|round|bevel",
    "stroke-miterlimit": "<number-one-or-greater>",
    "stroke-opacity": "<number-zero-one>",
    "stroke-width": "<svg-length>",
    "text-anchor": "start|middle|end",
    "unicode-range": "<urange>#",
    "voice-balance": "<number>|left|center|right|leftwards|rightwards",
    "voice-duration": "auto|<time>",
    "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
    "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
    "voice-stress": "normal|strong|moderate|none|reduced",
    "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
  },
  atrules: {
    charset: {
      prelude: "<string>",
      descriptors: null
    },
    "counter-style": {
      prelude: "<counter-style-name>",
      descriptors: {
        "additive-symbols": "[<integer>&&<symbol>]#",
        fallback: "<counter-style-name>",
        negative: "<symbol> <symbol>?",
        pad: "<integer>&&<symbol>",
        prefix: "<symbol>",
        range: "[[<integer>|infinite]{2}]#|auto",
        "speak-as": "auto|bullets|numbers|words|spell-out|<counter-style-name>",
        suffix: "<symbol>",
        symbols: "<symbol>+",
        system: "cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]"
      }
    },
    document: {
      prelude: "[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#",
      descriptors: null
    },
    "font-face": {
      prelude: null,
      descriptors: {
        "ascent-override": "normal|<percentage>",
        "descent-override": "normal|<percentage>",
        "font-display": "[auto|block|swap|fallback|optional]",
        "font-family": "<family-name>",
        "font-feature-settings": "normal|<feature-tag-value>#",
        "font-variation-settings": "normal|[<string> <number>]#",
        "font-stretch": "<font-stretch-absolute>{1,2}",
        "font-style": "normal|italic|oblique <angle>{0,2}",
        "font-weight": "<font-weight-absolute>{1,2}",
        "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
        "line-gap-override": "normal|<percentage>",
        "size-adjust": "<percentage>",
        src: "[<url> [format( <string># )]?|local( <family-name> )]#",
        "unicode-range": "<urange>#"
      }
    },
    "font-feature-values": {
      prelude: "<family-name>#",
      descriptors: null
    },
    import: {
      prelude: "[<string>|<url>] [layer|layer( <layer-name> )]? [supports( [<supports-condition>|<declaration>] )]? <media-query-list>?",
      descriptors: null
    },
    keyframes: {
      prelude: "<keyframes-name>",
      descriptors: null
    },
    layer: {
      prelude: "[<layer-name>#|<layer-name>?]",
      descriptors: null
    },
    media: {
      prelude: "<media-query-list>",
      descriptors: null
    },
    namespace: {
      prelude: "<namespace-prefix>? [<string>|<url>]",
      descriptors: null
    },
    page: {
      prelude: "<page-selector-list>",
      descriptors: {
        bleed: "auto|<length>",
        marks: "none|[crop||cross]",
        size: "<length>{1,2}|auto|[<page-size>||[portrait|landscape]]"
      }
    },
    property: {
      prelude: "<custom-property-name>",
      descriptors: {
        syntax: "<string>",
        inherits: "true|false",
        "initial-value": "<string>"
      }
    },
    "scroll-timeline": {
      prelude: "<timeline-name>",
      descriptors: null
    },
    supports: {
      prelude: "<supports-condition>",
      descriptors: null
    },
    viewport: {
      prelude: null,
      descriptors: {
        height: "<viewport-length>{1,2}",
        "max-height": "<viewport-length>",
        "max-width": "<viewport-length>",
        "max-zoom": "auto|<number>|<percentage>",
        "min-height": "<viewport-length>",
        "min-width": "<viewport-length>",
        "min-zoom": "auto|<number>|<percentage>",
        orientation: "auto|portrait|landscape",
        "user-zoom": "zoom|fixed",
        "viewport-fit": "auto|contain|cover",
        width: "<viewport-length>{1,2}",
        zoom: "auto|<number>|<percentage>"
      }
    },
    nest: {
      prelude: "<complex-selector-list>",
      descriptors: null
    }
  }
}, He = 43, Yt = 45, ga = 110, Wn = !0, zE = !1;
function ma(r, t) {
  let e = this.tokenStart + r;
  const n = this.charCodeAt(e);
  for ((n === He || n === Yt) && (t && this.error("Number sign is not allowed"), e++); e < this.tokenEnd; e++)
    At(this.charCodeAt(e)) || this.error("Integer is expected", e);
}
function qr(r) {
  return ma.call(this, 0, r);
}
function kn(r, t) {
  if (!this.cmpChar(this.tokenStart + r, t)) {
    let e = "";
    switch (t) {
      case ga:
        e = "N is expected";
        break;
      case Yt:
        e = "HyphenMinus is expected";
        break;
    }
    this.error(e, this.tokenStart + r);
  }
}
function Il() {
  let r = 0, t = 0, e = this.tokenType;
  for (; e === ft || e === Ht; )
    e = this.lookupType(++r);
  if (e !== F)
    if (this.isDelim(He, r) || this.isDelim(Yt, r)) {
      t = this.isDelim(He, r) ? He : Yt;
      do
        e = this.lookupType(++r);
      while (e === ft || e === Ht);
      e !== F && (this.skip(r), qr.call(this, Wn));
    } else
      return null;
  return r > 0 && this.skip(r), t === 0 && (e = this.charCodeAt(this.tokenStart), e !== He && e !== Yt && this.error("Number sign is expected")), qr.call(this, t !== 0), t === Yt ? "-" + this.consume(F) : this.consume(F);
}
const PE = "AnPlusB", BE = {
  a: [String, null],
  b: [String, null]
};
function zg() {
  const r = this.tokenStart;
  let t = null, e = null;
  if (this.tokenType === F)
    qr.call(this, zE), e = this.consume(F);
  else if (this.tokenType === R && this.cmpChar(this.tokenStart, Yt))
    switch (t = "-1", kn.call(this, 1, ga), this.tokenEnd - this.tokenStart) {
      case 2:
        this.next(), e = Il.call(this);
        break;
      case 3:
        kn.call(this, 2, Yt), this.next(), this.skipSC(), qr.call(this, Wn), e = "-" + this.consume(F);
        break;
      default:
        kn.call(this, 2, Yt), ma.call(this, 3, Wn), this.next(), e = this.substrToCursor(r + 2);
    }
  else if (this.tokenType === R || this.isDelim(He) && this.lookupType(1) === R) {
    let n = 0;
    switch (t = "1", this.isDelim(He) && (n = 1, this.next()), kn.call(this, 0, ga), this.tokenEnd - this.tokenStart) {
      case 1:
        this.next(), e = Il.call(this);
        break;
      case 2:
        kn.call(this, 1, Yt), this.next(), this.skipSC(), qr.call(this, Wn), e = "-" + this.consume(F);
        break;
      default:
        kn.call(this, 1, Yt), ma.call(this, 2, Wn), this.next(), e = this.substrToCursor(r + n + 1);
    }
  } else if (this.tokenType === W) {
    const n = this.charCodeAt(this.tokenStart), i = n === He || n === Yt;
    let s = this.tokenStart + i;
    for (; s < this.tokenEnd && At(this.charCodeAt(s)); s++)
      ;
    s === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), kn.call(this, s - this.tokenStart, ga), t = this.substring(r, s), s + 1 === this.tokenEnd ? (this.next(), e = Il.call(this)) : (kn.call(this, s - this.tokenStart + 1, Yt), s + 2 === this.tokenEnd ? (this.next(), this.skipSC(), qr.call(this, Wn), e = "-" + this.consume(F)) : (ma.call(this, s - this.tokenStart + 2, Wn), this.next(), e = this.substrToCursor(s + 1)));
  } else
    this.error();
  return t !== null && t.charCodeAt(0) === He && (t = t.substr(1)), e !== null && e.charCodeAt(0) === He && (e = e.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(r, this.tokenStart),
    a: t,
    b: e
  };
}
function $E(r) {
  if (r.a) {
    const t = r.a === "+1" && "n" || r.a === "1" && "n" || r.a === "-1" && "-n" || r.a + "n";
    if (r.b) {
      const e = r.b[0] === "-" || r.b[0] === "+" ? r.b : "+" + r.b;
      this.tokenize(t + e);
    } else
      this.tokenize(t);
  } else
    this.tokenize(r.b);
}
const jE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: $E,
  name: PE,
  parse: zg,
  structure: BE
}, Symbol.toStringTag, { value: "Module" }));
function Wh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function FE() {
  for (let r = 1, t; t = this.lookupType(r); r++) {
    if (t === de)
      return !0;
    if (t === zt || t === bt)
      return !1;
  }
  return !1;
}
const HE = "Atrule", UE = "atrule", VE = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function Pg(r = !1) {
  const t = this.tokenStart;
  let e, n, i = null, s = null;
  switch (this.eat(bt), e = this.substrToCursor(t + 1), n = e.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== zt && this.tokenType !== Kt && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, e, r), Wh) : i = Wh.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case Kt:
      this.next();
      break;
    case zt:
      hasOwnProperty.call(this.atrule, n) && typeof this.atrule[n].block == "function" ? s = this.atrule[n].block.call(this, r) : s = this.Block(FE.call(this));
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(t, this.tokenStart),
    name: e,
    prelude: i,
    block: s
  };
}
function GE(r) {
  this.token(bt, "@" + r.name), r.prelude !== null && this.node(r.prelude), r.block ? this.node(r.block) : this.token(Kt, ";");
}
const WE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: GE,
  name: HE,
  parse: Pg,
  structure: VE,
  walkContext: UE
}, Symbol.toStringTag, { value: "Module" })), KE = "AtrulePrelude", YE = "atrulePrelude", QE = {
  children: [[]]
};
function Bg(r) {
  let t = null;
  return r !== null && (r = r.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, r) && typeof this.atrule[r].prelude == "function" ? t = this.atrule[r].prelude.call(this) : t = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== zt && this.tokenType !== Kt && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function ZE(r) {
  this.children(r);
}
const XE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ZE,
  name: KE,
  parse: Bg,
  structure: QE,
  walkContext: YE
}, Symbol.toStringTag, { value: "Module" })), JE = 36, $g = 42, ba = 61, tC = 94, Ec = 124, eC = 126;
function nC() {
  this.eof && this.error("Unexpected end of input");
  const r = this.tokenStart;
  let t = !1;
  return this.isDelim($g) ? (t = !0, this.next()) : this.isDelim(Ec) || this.eat(R), this.isDelim(Ec) ? this.charCodeAt(this.tokenStart + 1) !== ba ? (this.next(), this.eat(R)) : t && this.error("Identifier is expected", this.tokenEnd) : t && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function rC() {
  const r = this.tokenStart, t = this.charCodeAt(r);
  return t !== ba && // =
  t !== eC && // ~=
  t !== tC && // ^=
  t !== JE && // $=
  t !== $g && // *=
  t !== Ec && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), t !== ba && (this.isDelim(ba) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(r);
}
const iC = "AttributeSelector", sC = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function jg() {
  const r = this.tokenStart;
  let t, e = null, n = null, i = null;
  return this.eat(ee), this.skipSC(), t = nC.call(this), this.skipSC(), this.tokenType !== Ie && (this.tokenType !== R && (e = rC.call(this), this.skipSC(), n = this.tokenType === sn ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === R && (i = this.consume(R), this.skipSC())), this.eat(Ie), {
    type: "AttributeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: t,
    matcher: e,
    value: n,
    flags: i
  };
}
function aC(r) {
  this.token(K, "["), this.node(r.name), r.matcher !== null && (this.tokenize(r.matcher), this.node(r.value)), r.flags !== null && this.token(R, r.flags), this.token(K, "]");
}
const oC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: aC,
  name: iC,
  parse: jg,
  structure: sC
}, Symbol.toStringTag, { value: "Module" })), lC = 38;
function Fg(r) {
  return this.Raw(r, null, !0);
}
function Kh() {
  return this.parseWithFallback(this.Rule, Fg);
}
function Yh(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
function cC() {
  if (this.tokenType === Kt)
    return Yh.call(this, this.tokenIndex);
  const r = this.parseWithFallback(this.Declaration, Yh);
  return this.tokenType === Kt && this.next(), r;
}
const uC = "Block", dC = "block", hC = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function Hg(r) {
  const t = r ? cC : Kh, e = this.tokenStart;
  let n = this.createList();
  this.eat(zt);
  t:
    for (; !this.eof; )
      switch (this.tokenType) {
        case de:
          break t;
        case ft:
        case Ht:
          this.next();
          break;
        case bt:
          n.push(this.parseWithFallback(this.Atrule.bind(this, r), Fg));
          break;
        default:
          r && this.isDelim(lC) ? n.push(Kh.call(this)) : n.push(t.call(this));
      }
  return this.eof || this.eat(de), {
    type: "Block",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function fC(r) {
  this.token(zt, "{"), this.children(r, (t) => {
    t.type === "Declaration" && this.token(Kt, ";");
  }), this.token(de, "}");
}
const pC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: fC,
  name: uC,
  parse: Hg,
  structure: hC,
  walkContext: dC
}, Symbol.toStringTag, { value: "Module" })), gC = "Brackets", mC = {
  children: [[]]
};
function Ug(r, t) {
  const e = this.tokenStart;
  let n = null;
  return this.eat(ee), n = r.call(this, t), this.eof || this.eat(Ie), {
    type: "Brackets",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function bC(r) {
  this.token(K, "["), this.children(r), this.token(K, "]");
}
const yC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: bC,
  name: gC,
  parse: Ug,
  structure: mC
}, Symbol.toStringTag, { value: "Module" })), vC = "CDC", wC = [];
function Vg() {
  const r = this.tokenStart;
  return this.eat(Wt), {
    type: "CDC",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function xC() {
  this.token(Wt, "-->");
}
const SC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xC,
  name: vC,
  parse: Vg,
  structure: wC
}, Symbol.toStringTag, { value: "Module" })), kC = "CDO", AC = [];
function Gg() {
  const r = this.tokenStart;
  return this.eat(xs), {
    type: "CDO",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function EC() {
  this.token(xs, "<!--");
}
const CC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: EC,
  name: kC,
  parse: Gg,
  structure: AC
}, Symbol.toStringTag, { value: "Module" })), TC = 46, LC = "ClassSelector", DC = {
  name: String
};
function Wg() {
  return this.eatDelim(TC), {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(R)
  };
}
function OC(r) {
  this.token(K, "."), this.token(R, r.name);
}
const IC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OC,
  name: LC,
  parse: Wg,
  structure: DC
}, Symbol.toStringTag, { value: "Module" })), NC = 43, Qh = 47, MC = 62, qC = 126, _C = "Combinator", RC = {
  name: String
};
function Kg() {
  const r = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case ft:
      t = " ";
      break;
    case K:
      switch (this.charCodeAt(this.tokenStart)) {
        case MC:
        case NC:
        case qC:
          this.next();
          break;
        case Qh:
          this.next(), this.eatIdent("deep"), this.eatDelim(Qh);
          break;
        default:
          this.error("Combinator is expected");
      }
      t = this.substrToCursor(r);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(r, this.tokenStart),
    name: t
  };
}
function zC(r) {
  this.tokenize(r.name);
}
const PC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: zC,
  name: _C,
  parse: Kg,
  structure: RC
}, Symbol.toStringTag, { value: "Module" })), BC = 42, $C = 47, jC = "Comment", FC = {
  value: String
};
function Yg() {
  const r = this.tokenStart;
  let t = this.tokenEnd;
  return this.eat(Ht), t - r + 2 >= 2 && this.charCodeAt(t - 2) === BC && this.charCodeAt(t - 1) === $C && (t -= 2), {
    type: "Comment",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substring(r + 2, t)
  };
}
function HC(r) {
  this.token(Ht, "/*" + r.value + "*/");
}
const UC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: HC,
  name: jC,
  parse: Yg,
  structure: FC
}, Symbol.toStringTag, { value: "Module" })), Qg = 33, VC = 35, GC = 36, WC = 38, KC = 42, YC = 43, Zh = 47;
function QC(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function ZC(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function XC() {
  const r = this.tokenIndex, t = this.Value();
  return t.type !== "Raw" && this.eof === !1 && this.tokenType !== Kt && this.isDelim(Qg) === !1 && this.isBalanceEdge(r) === !1 && this.error(), t;
}
const JC = "Declaration", tT = "declaration", eT = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function Zg() {
  const r = this.tokenStart, t = this.tokenIndex, e = rT.call(this), n = Mu(e), i = n ? this.parseCustomProperty : this.parseValue, s = n ? ZC : QC;
  let a = !1, o;
  this.skipSC(), this.eat(Rt);
  const l = this.tokenIndex;
  if (n || this.skipSC(), i ? o = this.parseWithFallback(XC, s) : o = s.call(this, this.tokenIndex), n && o.type === "Value" && o.children.isEmpty) {
    for (let c = l - this.tokenIndex; c <= 0; c++)
      if (this.lookupType(c) === ft) {
        o.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
  }
  return this.isDelim(Qg) && (a = iT.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== Kt && this.isBalanceEdge(t) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(r, this.tokenStart),
    important: a,
    property: e,
    value: o
  };
}
function nT(r) {
  this.token(R, r.property), this.token(Rt, ":"), this.node(r.value), r.important && (this.token(K, "!"), this.token(R, r.important === !0 ? "important" : r.important));
}
function rT() {
  const r = this.tokenStart;
  if (this.tokenType === K)
    switch (this.charCodeAt(this.tokenStart)) {
      case KC:
      case GC:
      case YC:
      case VC:
      case WC:
        this.next();
        break;
      case Zh:
        this.next(), this.isDelim(Zh) && this.next();
        break;
    }
  return this.tokenType === ot ? this.eat(ot) : this.eat(R), this.substrToCursor(r);
}
function iT() {
  this.eat(K), this.skipSC();
  const r = this.consume(R);
  return r === "important" ? !0 : r;
}
const sT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nT,
  name: JC,
  parse: Zg,
  structure: eT,
  walkContext: tT
}, Symbol.toStringTag, { value: "Module" })), aT = 38;
function Nl(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
const oT = "DeclarationList", lT = {
  children: [[
    "Declaration",
    "Atrule",
    "Rule"
  ]]
};
function Xg() {
  const r = this.createList();
  for (; !this.eof; )
    switch (this.tokenType) {
      case ft:
      case Ht:
      case Kt:
        this.next();
        break;
      case bt:
        r.push(this.parseWithFallback(this.Atrule.bind(this, !0), Nl));
        break;
      default:
        this.isDelim(aT) ? r.push(this.parseWithFallback(this.Rule, Nl)) : r.push(this.parseWithFallback(this.Declaration, Nl));
    }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function cT(r) {
  this.children(r, (t) => {
    t.type === "Declaration" && this.token(Kt, ";");
  });
}
const uT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: cT,
  name: oT,
  parse: Xg,
  structure: lT
}, Symbol.toStringTag, { value: "Module" })), dT = "Dimension", hT = {
  value: String,
  unit: String
};
function Jg() {
  const r = this.tokenStart, t = this.consumeNumber(W);
  return {
    type: "Dimension",
    loc: this.getLocation(r, this.tokenStart),
    value: t,
    unit: this.substring(r + t.length, this.tokenStart)
  };
}
function fT(r) {
  this.token(W, r.value + r.unit);
}
const pT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: fT,
  name: dT,
  parse: Jg,
  structure: hT
}, Symbol.toStringTag, { value: "Module" })), gT = "Function", mT = "function", bT = {
  name: String,
  children: [[]]
};
function tm(r, t) {
  const e = this.tokenStart, n = this.consumeFunctionName(), i = n.toLowerCase();
  let s;
  return s = t.hasOwnProperty(i) ? t[i].call(this, t) : r.call(this, t), this.eof || this.eat(rt), {
    type: "Function",
    loc: this.getLocation(e, this.tokenStart),
    name: n,
    children: s
  };
}
function yT(r) {
  this.token(Y, r.name + "("), this.children(r), this.token(rt, ")");
}
const vT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: yT,
  name: gT,
  parse: tm,
  structure: bT,
  walkContext: mT
}, Symbol.toStringTag, { value: "Module" })), wT = "XXX", xT = "Hash", ST = {
  value: String
};
function em() {
  const r = this.tokenStart;
  return this.eat(ot), {
    type: "Hash",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r + 1)
  };
}
function kT(r) {
  this.token(ot, "#" + r.value);
}
const AT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: kT,
  name: xT,
  parse: em,
  structure: ST,
  xxx: wT
}, Symbol.toStringTag, { value: "Module" })), ET = "Identifier", CT = {
  name: String
};
function nm() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(R)
  };
}
function TT(r) {
  this.token(R, r.name);
}
const LT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: TT,
  name: ET,
  parse: nm,
  structure: CT
}, Symbol.toStringTag, { value: "Module" })), DT = "IdSelector", OT = {
  name: String
};
function rm() {
  const r = this.tokenStart;
  return this.eat(ot), {
    type: "IdSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r + 1)
  };
}
function IT(r) {
  this.token(K, "#" + r.name);
}
const NT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: IT,
  name: DT,
  parse: rm,
  structure: OT
}, Symbol.toStringTag, { value: "Module" })), MT = "MediaFeature", qT = {
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", null]
};
function im() {
  const r = this.tokenStart;
  let t, e = null;
  if (this.eat(kt), this.skipSC(), t = this.consume(R), this.skipSC(), this.tokenType !== rt) {
    switch (this.eat(Rt), this.skipSC(), this.tokenType) {
      case F:
        this.lookupNonWSType(1) === K ? e = this.Ratio() : e = this.Number();
        break;
      case W:
        e = this.Dimension();
        break;
      case R:
        e = this.Identifier();
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  return this.eat(rt), {
    type: "MediaFeature",
    loc: this.getLocation(r, this.tokenStart),
    name: t,
    value: e
  };
}
function _T(r) {
  this.token(kt, "("), this.token(R, r.name), r.value !== null && (this.token(Rt, ":"), this.node(r.value)), this.token(rt, ")");
}
const RT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: _T,
  name: MT,
  parse: im,
  structure: qT
}, Symbol.toStringTag, { value: "Module" })), zT = "MediaQuery", PT = {
  children: [[
    "Identifier",
    "MediaFeature",
    "WhiteSpace"
  ]]
};
function sm() {
  const r = this.createList();
  let t = null;
  this.skipSC();
  t:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case Ht:
        case ft:
          this.next();
          continue;
        case R:
          t = this.Identifier();
          break;
        case kt:
          t = this.MediaFeature();
          break;
        default:
          break t;
      }
      r.push(t);
    }
  return t === null && this.error("Identifier or parenthesis is expected"), {
    type: "MediaQuery",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function BT(r) {
  this.children(r);
}
const $T = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: BT,
  name: zT,
  parse: sm,
  structure: PT
}, Symbol.toStringTag, { value: "Module" })), jT = "MediaQueryList", FT = {
  children: [[
    "MediaQuery"
  ]]
};
function am() {
  const r = this.createList();
  for (this.skipSC(); !this.eof && (r.push(this.MediaQuery()), this.tokenType === an); )
    this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function HT(r) {
  this.children(r, () => this.token(an, ","));
}
const UT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: HT,
  name: jT,
  parse: am,
  structure: FT
}, Symbol.toStringTag, { value: "Module" })), VT = 38, GT = "NestingSelector", WT = {};
function om() {
  const r = this.tokenStart;
  return this.eatDelim(VT), {
    type: "NestingSelector",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function KT() {
  this.token(K, "&");
}
const YT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: KT,
  name: GT,
  parse: om,
  structure: WT
}, Symbol.toStringTag, { value: "Module" })), QT = "Nth", ZT = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function lm() {
  this.skipSC();
  const r = this.tokenStart;
  let t = r, e = null, n;
  return this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? n = this.Identifier() : n = this.AnPlusB(), t = this.tokenStart, this.skipSC(), this.lookupValue(0, "of") && (this.next(), e = this.SelectorList(), t = this.tokenStart), {
    type: "Nth",
    loc: this.getLocation(r, t),
    nth: n,
    selector: e
  };
}
function XT(r) {
  this.node(r.nth), r.selector !== null && (this.token(R, "of"), this.node(r.selector));
}
const JT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: XT,
  name: QT,
  parse: lm,
  structure: ZT
}, Symbol.toStringTag, { value: "Module" })), tL = "Number", eL = {
  value: String
};
function cm() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(F)
  };
}
function nL(r) {
  this.token(F, r.value);
}
const rL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nL,
  name: tL,
  parse: cm,
  structure: eL
}, Symbol.toStringTag, { value: "Module" })), iL = "Operator", sL = {
  value: String
};
function um() {
  const r = this.tokenStart;
  return this.next(), {
    type: "Operator",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r)
  };
}
function aL(r) {
  this.tokenize(r.value);
}
const oL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: aL,
  name: iL,
  parse: um,
  structure: sL
}, Symbol.toStringTag, { value: "Module" })), lL = "Parentheses", cL = {
  children: [[]]
};
function dm(r, t) {
  const e = this.tokenStart;
  let n = null;
  return this.eat(kt), n = r.call(this, t), this.eof || this.eat(rt), {
    type: "Parentheses",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function uL(r) {
  this.token(kt, "("), this.children(r), this.token(rt, ")");
}
const dL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: uL,
  name: lL,
  parse: dm,
  structure: cL
}, Symbol.toStringTag, { value: "Module" })), hL = "Percentage", fL = {
  value: String
};
function hm() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(dt)
  };
}
function pL(r) {
  this.token(dt, r.value + "%");
}
const gL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: pL,
  name: hL,
  parse: hm,
  structure: fL
}, Symbol.toStringTag, { value: "Module" })), mL = "PseudoClassSelector", bL = "function", yL = {
  name: String,
  children: [["Raw"], null]
};
function fm() {
  const r = this.tokenStart;
  let t = null, e, n;
  return this.eat(Rt), this.tokenType === Y ? (e = this.consumeFunctionName(), n = e.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(rt)) : e = this.consume(R), {
    type: "PseudoClassSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    children: t
  };
}
function vL(r) {
  this.token(Rt, ":"), r.children === null ? this.token(R, r.name) : (this.token(Y, r.name + "("), this.children(r), this.token(rt, ")"));
}
const wL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: vL,
  name: mL,
  parse: fm,
  structure: yL,
  walkContext: bL
}, Symbol.toStringTag, { value: "Module" })), xL = "PseudoElementSelector", SL = "function", kL = {
  name: String,
  children: [["Raw"], null]
};
function pm() {
  const r = this.tokenStart;
  let t = null, e, n;
  return this.eat(Rt), this.eat(Rt), this.tokenType === Y ? (e = this.consumeFunctionName(), n = e.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(rt)) : e = this.consume(R), {
    type: "PseudoElementSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    children: t
  };
}
function AL(r) {
  this.token(Rt, ":"), this.token(Rt, ":"), r.children === null ? this.token(R, r.name) : (this.token(Y, r.name + "("), this.children(r), this.token(rt, ")"));
}
const EL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: AL,
  name: xL,
  parse: pm,
  structure: kL,
  walkContext: SL
}, Symbol.toStringTag, { value: "Module" })), CL = 47, TL = 46;
function Xh() {
  this.skipSC();
  const r = this.consume(F);
  for (let t = 0; t < r.length; t++) {
    const e = r.charCodeAt(t);
    !At(e) && e !== TL && this.error("Unsigned number is expected", this.tokenStart - r.length + t);
  }
  return Number(r) === 0 && this.error("Zero number is not allowed", this.tokenStart - r.length), r;
}
const LL = "Ratio", DL = {
  left: String,
  right: String
};
function gm() {
  const r = this.tokenStart, t = Xh.call(this);
  let e;
  return this.skipSC(), this.eatDelim(CL), e = Xh.call(this), {
    type: "Ratio",
    loc: this.getLocation(r, this.tokenStart),
    left: t,
    right: e
  };
}
function OL(r) {
  this.token(F, r.left), this.token(K, "/"), this.token(F, r.right);
}
const IL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OL,
  name: LL,
  parse: gm,
  structure: DL
}, Symbol.toStringTag, { value: "Module" }));
function NL() {
  return this.tokenIndex > 0 && this.lookupType(-1) === ft ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
const ML = "Raw", qL = {
  value: String
};
function mm(r, t, e) {
  const n = this.getTokenStart(r);
  let i;
  return this.skipUntilBalanced(r, t || this.consumeUntilBalanceEnd), e && this.tokenStart > n ? i = NL.call(this) : i = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(n, i),
    value: this.substring(n, i)
  };
}
function _L(r) {
  this.tokenize(r.value);
}
const RL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: _L,
  name: ML,
  parse: mm,
  structure: qL
}, Symbol.toStringTag, { value: "Module" }));
function Jh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracket, !0);
}
function zL() {
  const r = this.SelectorList();
  return r.type !== "Raw" && this.eof === !1 && this.tokenType !== zt && this.error(), r;
}
const PL = "Rule", BL = "rule", $L = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function bm() {
  const r = this.tokenIndex, t = this.tokenStart;
  let e, n;
  return this.parseRulePrelude ? e = this.parseWithFallback(zL, Jh) : e = Jh.call(this, r), n = this.Block(!0), {
    type: "Rule",
    loc: this.getLocation(t, this.tokenStart),
    prelude: e,
    block: n
  };
}
function jL(r) {
  this.node(r.prelude), this.node(r.block);
}
const FL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: jL,
  name: PL,
  parse: bm,
  structure: $L,
  walkContext: BL
}, Symbol.toStringTag, { value: "Module" })), HL = "Selector", UL = {
  children: [[
    "TypeSelector",
    "IdSelector",
    "ClassSelector",
    "AttributeSelector",
    "PseudoClassSelector",
    "PseudoElementSelector",
    "Combinator",
    "WhiteSpace"
  ]]
};
function ym() {
  const r = this.readSequence(this.scope.Selector);
  return this.getFirstListNode(r) === null && this.error("Selector is expected"), {
    type: "Selector",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function VL(r) {
  this.children(r);
}
const GL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: VL,
  name: HL,
  parse: ym,
  structure: UL
}, Symbol.toStringTag, { value: "Module" })), WL = "SelectorList", KL = "selector", YL = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function vm() {
  const r = this.createList();
  for (; !this.eof; ) {
    if (r.push(this.Selector()), this.tokenType === an) {
      this.next();
      continue;
    }
    break;
  }
  return {
    type: "SelectorList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function QL(r) {
  this.children(r, () => this.token(an, ","));
}
const ZL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: QL,
  name: WL,
  parse: vm,
  structure: YL,
  walkContext: KL
}, Symbol.toStringTag, { value: "Module" })), Cc = 92, wm = 34, XL = 39;
function xm(r) {
  const t = r.length, e = r.charCodeAt(0), n = e === wm || e === XL ? 1 : 0, i = n === 1 && t > 1 && r.charCodeAt(t - 1) === e ? t - 2 : t - 1;
  let s = "";
  for (let a = n; a <= i; a++) {
    let o = r.charCodeAt(a);
    if (o === Cc) {
      if (a === i) {
        a !== t - 1 && (s = r.substr(a + 1));
        break;
      }
      if (o = r.charCodeAt(++a), Ve(Cc, o)) {
        const l = a - 1, c = ai(r, l);
        a = c - 1, s += sg(r.substring(l + 1, c));
      } else
        o === 13 && r.charCodeAt(a + 1) === 10 && a++;
    } else
      s += r[a];
  }
  return s;
}
function JL(r, t) {
  const e = '"', n = wm;
  let i = "", s = !1;
  for (let a = 0; a < r.length; a++) {
    const o = r.charCodeAt(a);
    if (o === 0) {
      i += "�";
      continue;
    }
    if (o <= 31 || o === 127) {
      i += "\\" + o.toString(16), s = !0;
      continue;
    }
    o === n || o === Cc ? (i += "\\" + r.charAt(a), s = !1) : (s && (qn(o) || sr(o)) && (i += " "), i += r.charAt(a), s = !1);
  }
  return e + i + e;
}
const tD = "String", eD = {
  value: String
};
function Sm() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: xm(this.consume(sn))
  };
}
function nD(r) {
  this.token(sn, JL(r.value));
}
const rD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nD,
  name: tD,
  parse: Sm,
  structure: eD
}, Symbol.toStringTag, { value: "Module" })), iD = 33;
function tf(r) {
  return this.Raw(r, null, !1);
}
const sD = "StyleSheet", aD = "stylesheet", oD = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function km() {
  const r = this.tokenStart, t = this.createList();
  let e;
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case ft:
        this.next();
        continue;
      case Ht:
        if (this.charCodeAt(this.tokenStart + 2) !== iD) {
          this.next();
          continue;
        }
        e = this.Comment();
        break;
      case xs:
        e = this.CDO();
        break;
      case Wt:
        e = this.CDC();
        break;
      case bt:
        e = this.parseWithFallback(this.Atrule, tf);
        break;
      default:
        e = this.parseWithFallback(this.Rule, tf);
    }
    t.push(e);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(r, this.tokenStart),
    children: t
  };
}
function lD(r) {
  this.children(r);
}
const cD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lD,
  name: sD,
  parse: km,
  structure: oD,
  walkContext: aD
}, Symbol.toStringTag, { value: "Module" })), uD = 42, ef = 124;
function Ml() {
  this.tokenType !== R && this.isDelim(uD) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
const dD = "TypeSelector", hD = {
  name: String
};
function Am() {
  const r = this.tokenStart;
  return this.isDelim(ef) ? (this.next(), Ml.call(this)) : (Ml.call(this), this.isDelim(ef) && (this.next(), Ml.call(this))), {
    type: "TypeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function fD(r) {
  this.tokenize(r.name);
}
const pD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: fD,
  name: dD,
  parse: Am,
  structure: hD
}, Symbol.toStringTag, { value: "Module" })), Em = 43, Cm = 45, Tc = 63;
function Hi(r, t) {
  let e = 0;
  for (let n = this.tokenStart + r; n < this.tokenEnd; n++) {
    const i = this.charCodeAt(n);
    if (i === Cm && t && e !== 0)
      return Hi.call(this, r + e + 1, !1), -1;
    qn(i) || this.error(
      t && e !== 0 ? "Hyphen minus" + (e < 6 ? " or hex digit" : "") + " is expected" : e < 6 ? "Hex digit is expected" : "Unexpected input",
      n
    ), ++e > 6 && this.error("Too many hex digits", n);
  }
  return this.next(), e;
}
function aa(r) {
  let t = 0;
  for (; this.isDelim(Tc); )
    ++t > r && this.error("Too many question marks"), this.next();
}
function gD(r) {
  this.charCodeAt(this.tokenStart) !== r && this.error((r === Em ? "Plus sign" : "Hyphen minus") + " is expected");
}
function mD() {
  let r = 0;
  switch (this.tokenType) {
    case F:
      if (r = Hi.call(this, 1, !0), this.isDelim(Tc)) {
        aa.call(this, 6 - r);
        break;
      }
      if (this.tokenType === W || this.tokenType === F) {
        gD.call(this, Cm), Hi.call(this, 1, !1);
        break;
      }
      break;
    case W:
      r = Hi.call(this, 1, !0), r > 0 && aa.call(this, 6 - r);
      break;
    default:
      if (this.eatDelim(Em), this.tokenType === R) {
        r = Hi.call(this, 0, !0), r > 0 && aa.call(this, 6 - r);
        break;
      }
      if (this.isDelim(Tc)) {
        this.next(), aa.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
const bD = "UnicodeRange", yD = {
  value: String
};
function Tm() {
  const r = this.tokenStart;
  return this.eatIdent("u"), mD.call(this), {
    type: "UnicodeRange",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r)
  };
}
function vD(r) {
  this.tokenize(r.value);
}
const wD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: vD,
  name: bD,
  parse: Tm,
  structure: yD
}, Symbol.toStringTag, { value: "Module" })), xD = 32, Lc = 92, SD = 34, kD = 39, AD = 40, Lm = 41;
function ED(r) {
  const t = r.length;
  let e = 4, n = r.charCodeAt(t - 1) === Lm ? t - 2 : t - 1, i = "";
  for (; e < n && sr(r.charCodeAt(e)); )
    e++;
  for (; e < n && sr(r.charCodeAt(n)); )
    n--;
  for (let s = e; s <= n; s++) {
    let a = r.charCodeAt(s);
    if (a === Lc) {
      if (s === n) {
        s !== t - 1 && (i = r.substr(s + 1));
        break;
      }
      if (a = r.charCodeAt(++s), Ve(Lc, a)) {
        const o = s - 1, l = ai(r, o);
        s = l - 1, i += sg(r.substring(o + 1, l));
      } else
        a === 13 && r.charCodeAt(s + 1) === 10 && s++;
    } else
      i += r[s];
  }
  return i;
}
function CD(r) {
  let t = "", e = !1;
  for (let n = 0; n < r.length; n++) {
    const i = r.charCodeAt(n);
    if (i === 0) {
      t += "�";
      continue;
    }
    if (i <= 31 || i === 127) {
      t += "\\" + i.toString(16), e = !0;
      continue;
    }
    i === xD || i === Lc || i === SD || i === kD || i === AD || i === Lm ? (t += "\\" + r.charAt(n), e = !1) : (e && qn(i) && (t += " "), t += r.charAt(n), e = !1);
  }
  return "url(" + t + ")";
}
const TD = "Url", LD = {
  value: String
};
function Dm() {
  const r = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case Nt:
      t = ED(this.consume(Nt));
      break;
    case Y:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(Y), this.skipSC(), t = xm(this.consume(sn)), this.skipSC(), this.eof || this.eat(rt);
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(r, this.tokenStart),
    value: t
  };
}
function DD(r) {
  this.token(Nt, CD(r.value));
}
const OD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: DD,
  name: TD,
  parse: Dm,
  structure: LD
}, Symbol.toStringTag, { value: "Module" })), ID = "Value", ND = {
  children: [[]]
};
function Om() {
  const r = this.tokenStart, t = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(r, this.tokenStart),
    children: t
  };
}
function MD(r) {
  this.children(r);
}
const qD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: MD,
  name: ID,
  parse: Om,
  structure: ND
}, Symbol.toStringTag, { value: "Module" })), _D = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
}), RD = "WhiteSpace", zD = {
  value: String
};
function Im() {
  return this.eat(ft), _D;
}
function PD(r) {
  this.token(ft, r.value);
}
const BD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: PD,
  name: RD,
  parse: Im,
  structure: zD
}, Symbol.toStringTag, { value: "Module" })), Nm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: jE,
  Atrule: WE,
  AtrulePrelude: XE,
  AttributeSelector: oC,
  Block: pC,
  Brackets: yC,
  CDC: SC,
  CDO: CC,
  ClassSelector: IC,
  Combinator: PC,
  Comment: UC,
  Declaration: sT,
  DeclarationList: uT,
  Dimension: pT,
  Function: vT,
  Hash: AT,
  IdSelector: NT,
  Identifier: LT,
  MediaFeature: RT,
  MediaQuery: $T,
  MediaQueryList: UT,
  NestingSelector: YT,
  Nth: JT,
  Number: rL,
  Operator: oL,
  Parentheses: dL,
  Percentage: gL,
  PseudoClassSelector: wL,
  PseudoElementSelector: EL,
  Ratio: IL,
  Raw: RL,
  Rule: FL,
  Selector: GL,
  SelectorList: ZL,
  String: rD,
  StyleSheet: cD,
  TypeSelector: pD,
  UnicodeRange: wD,
  Url: OD,
  Value: qD,
  WhiteSpace: BD
}, Symbol.toStringTag, { value: "Module" })), $D = jt(G({
  generic: !0
}, RE), {
  node: Nm
}), jD = 35, FD = 42, nf = 43, HD = 45, UD = 47, VD = 117;
function Mm(r) {
  switch (this.tokenType) {
    case ot:
      return this.Hash();
    case an:
      return this.Operator();
    case kt:
      return this.Parentheses(this.readSequence, r.recognizer);
    case ee:
      return this.Brackets(this.readSequence, r.recognizer);
    case sn:
      return this.String();
    case W:
      return this.Dimension();
    case dt:
      return this.Percentage();
    case F:
      return this.Number();
    case Y:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, r.recognizer);
    case Nt:
      return this.Url();
    case R:
      return this.cmpChar(this.tokenStart, VD) && this.cmpChar(this.tokenStart + 1, nf) ? this.UnicodeRange() : this.Identifier();
    case K: {
      const t = this.charCodeAt(this.tokenStart);
      if (t === UD || t === FD || t === nf || t === HD)
        return this.Operator();
      t === jD && this.error("Hex or identifier is expected", this.tokenStart + 1);
      break;
    }
  }
}
const GD = {
  getNode: Mm
}, WD = 35, KD = 38, YD = 42, QD = 43, ZD = 47, rf = 46, XD = 62, JD = 124, t2 = 126;
function e2(r, t) {
  t.last !== null && t.last.type !== "Combinator" && r !== null && r.type !== "Combinator" && t.push({
    // FIXME: this.Combinator() should be used instead
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function n2() {
  switch (this.tokenType) {
    case ee:
      return this.AttributeSelector();
    case ot:
      return this.IdSelector();
    case Rt:
      return this.lookupType(1) === Rt ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case R:
      return this.TypeSelector();
    case F:
    case dt:
      return this.Percentage();
    case W:
      this.charCodeAt(this.tokenStart) === rf && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case K: {
      switch (this.charCodeAt(this.tokenStart)) {
        case QD:
        case XD:
        case t2:
        case ZD:
          return this.Combinator();
        case rf:
          return this.ClassSelector();
        case YD:
        case JD:
          return this.TypeSelector();
        case WD:
          return this.IdSelector();
        case KD:
          return this.NestingSelector();
      }
      break;
    }
  }
}
const r2 = {
  onWhiteSpace: e2,
  getNode: n2
};
function i2() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function s2() {
  const r = this.createList();
  if (this.skipSC(), r.push(this.Identifier()), this.skipSC(), this.tokenType === an) {
    r.push(this.Operator());
    const t = this.tokenIndex, e = this.parseCustomProperty ? this.Value(null) : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, !1);
    if (e.type === "Value" && e.children.isEmpty) {
      for (let n = t - this.tokenIndex; n <= 0; n++)
        if (this.lookupType(n) === ft) {
          e.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
    }
    r.push(e);
  }
  return r;
}
function sf(r) {
  return r !== null && r.type === "Operator" && (r.value[r.value.length - 1] === "-" || r.value[r.value.length - 1] === "+");
}
const a2 = {
  getNode: Mm,
  onWhiteSpace(r, t) {
    sf(r) && (r.value = " " + r.value), sf(t.last) && (t.last.value += " ");
  },
  expression: i2,
  var: s2
}, o2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: GD,
  Selector: r2,
  Value: a2
}, Symbol.toStringTag, { value: "Module" })), l2 = {
  parse: {
    prelude: null,
    block() {
      return this.Block(!0);
    }
  }
}, c2 = {
  parse: {
    prelude() {
      const r = this.createList();
      switch (this.skipSC(), this.tokenType) {
        case sn:
          r.push(this.String());
          break;
        case Nt:
        case Y:
          r.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      return (this.lookupNonWSType(0) === R || this.lookupNonWSType(0) === kt) && r.push(this.MediaQueryList()), r;
    },
    block: null
  }
}, u2 = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.MediaQueryList()
      );
    },
    block(r = !1) {
      return this.Block(r);
    }
  }
}, d2 = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(!0);
    }
  }
}, h2 = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(!0);
    }
  }
};
function f2() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function p2() {
  return this.skipSC(), this.tokenType === R && this.lookupNonWSType(1) === Rt ? this.createSingleNodeList(
    this.Declaration()
  ) : qm.call(this);
}
function qm() {
  const r = this.createList();
  let t;
  this.skipSC();
  t:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case Ht:
        case ft:
          this.next();
          continue;
        case Y:
          t = this.Function(f2, this.scope.AtrulePrelude);
          break;
        case R:
          t = this.Identifier();
          break;
        case kt:
          t = this.Parentheses(p2, this.scope.AtrulePrelude);
          break;
        default:
          break t;
      }
      r.push(t);
    }
  return r;
}
const g2 = {
  parse: {
    prelude() {
      const r = qm.call(this);
      return this.getFirstListNode(r) === null && this.error("Condition is expected"), r;
    },
    block(r = !1) {
      return this.Block(r);
    }
  }
}, m2 = {
  "font-face": l2,
  import: c2,
  media: u2,
  nest: d2,
  page: h2,
  supports: g2
}, Gn = {
  parse() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
}, ql = {
  parse() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
}, af = {
  parse() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
}, oa = {
  parse() {
    return this.createSingleNodeList(
      this.Nth()
    );
  }
}, b2 = {
  dir: af,
  has: Gn,
  lang: af,
  matches: Gn,
  is: Gn,
  "-moz-any": Gn,
  "-webkit-any": Gn,
  where: Gn,
  not: Gn,
  "nth-child": oa,
  "nth-last-child": oa,
  "nth-last-of-type": oa,
  "nth-of-type": oa,
  slotted: ql,
  host: ql,
  "host-context": ql
}, y2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: zg,
  Atrule: Pg,
  AtrulePrelude: Bg,
  AttributeSelector: jg,
  Block: Hg,
  Brackets: Ug,
  CDC: Vg,
  CDO: Gg,
  ClassSelector: Wg,
  Combinator: Kg,
  Comment: Yg,
  Declaration: Zg,
  DeclarationList: Xg,
  Dimension: Jg,
  Function: tm,
  Hash: em,
  IdSelector: rm,
  Identifier: nm,
  MediaFeature: im,
  MediaQuery: sm,
  MediaQueryList: am,
  NestingSelector: om,
  Nth: lm,
  Number: cm,
  Operator: um,
  Parentheses: dm,
  Percentage: hm,
  PseudoClassSelector: fm,
  PseudoElementSelector: pm,
  Ratio: gm,
  Raw: mm,
  Rule: bm,
  Selector: ym,
  SelectorList: vm,
  String: Sm,
  StyleSheet: km,
  TypeSelector: Am,
  UnicodeRange: Tm,
  Url: Dm,
  Value: Om,
  WhiteSpace: Im
}, Symbol.toStringTag, { value: "Module" })), v2 = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude(r) {
      return this.AtrulePrelude(r.atrule ? String(r.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block() {
      return this.Block(!0);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  scope: o2,
  atrule: m2,
  pseudo: b2,
  node: y2
}, w2 = {
  node: Nm
}, x2 = _E(G(G(G({}, $D), v2), w2));
function Dc(r) {
  const t = {};
  for (const e in r) {
    let n = r[e];
    n && (Array.isArray(n) || n instanceof mt ? n = n.map(Dc) : n.constructor === Object && (n = Dc(n))), t[e] = n;
  }
  return t;
}
const {
  tokenize: TO,
  parse: S2,
  generate: k2,
  lexer: LO,
  createLexer: DO,
  walk: Kn,
  find: OO,
  findLast: IO,
  findAll: NO,
  toPlainObject: MO,
  fromPlainObject: qO,
  fork: _O
} = x2;
let A2 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", ke = (r = 21) => {
  let t = "", e = r;
  for (; e--; )
    t += A2[Math.random() * 64 | 0];
  return t;
};
function Yn(r) {
  return S2(r, {
    parseAtrulePrelude: !1,
    parseCustomProperty: !0
  });
}
function Qt(r) {
  return k2(r, {
    // Default `safe` adds extra (potentially breaking) spaces for compatibility
    // with old browsers.
    mode: "spec"
  });
}
function _m(r) {
  return r.type === "Declaration";
}
function E2(r) {
  return r.value.children.first.name;
}
const Oc = {
  "position-anchor": `--position-anchor-${ke(12)}`,
  "anchor-scope": `--anchor-scope-${ke(12)}`,
  "anchor-name": `--anchor-name-${ke(12)}`
};
function C2(r, t) {
  return _m(r) && Oc[r.property] && t ? (t.children.appendData(jt(G({}, r), {
    property: Oc[r.property]
  })), { updated: !0 }) : {};
}
function T2(r) {
  for (const t of r) {
    let e = !1;
    const n = Yn(t.css);
    Kn(n, {
      visit: "Declaration",
      enter(i) {
        var s;
        const a = (s = this.rule) == null ? void 0 : s.block, { updated: o } = C2(i, a);
        o && (e = !0);
      }
    }), e && (t.css = Qt(n), t.changed = !0);
  }
  return r.some((t) => t.changed === !0);
}
var Rm = /* @__PURE__ */ ((r) => (r.All = "all", r.None = "none", r))(Rm || {});
function en(r, t) {
  var e;
  return t = (e = Oc[t]) != null ? e : t, (r instanceof HTMLElement ? getComputedStyle(r) : r.computedStyle).getPropertyValue(t).trim();
}
function ci(r, t, e) {
  return en(r, t) === e;
}
function L2(r, { selector: t, pseudoElementPart: e }) {
  const n = getComputedStyle(r, e), i = document.createElement("div"), s = document.createElement("style");
  i.id = `fake-pseudo-element-${ke()}`;
  for (const o of Array.from(n)) {
    const l = n.getPropertyValue(o);
    i.style.setProperty(o, l);
  }
  s.textContent += `#${i.id}${e} { content: ${n.content}; }`, s.textContent += `${t} { display: none !important; }`, document.head.append(s);
  const a = e === "::before" ? "afterbegin" : "beforeend";
  return r.insertAdjacentElement(a, i), { fakePseudoElement: i, sheet: s, computedStyle: n };
}
function D2(r) {
  let t = r;
  for (; t; ) {
    if (ci(t, "overflow", "scroll"))
      return t;
    t = t.parentElement;
  }
  return t;
}
function O2(r) {
  let t = D2(r);
  return t === document.documentElement && (t = null), t ?? { scrollTop: 0, scrollLeft: 0 };
}
function I2(r) {
  const { elementPart: t, pseudoElementPart: e } = r, n = [];
  if (e && !(e === "::before" || e === "::after")) return n;
  const i = Array.from(
    document.querySelectorAll(t)
  );
  if (!e)
    return n.push(...i), n;
  for (const s of i) {
    const { fakePseudoElement: a, sheet: o, computedStyle: l } = L2(
      s,
      r
    ), c = a.getBoundingClientRect(), { scrollY: u, scrollX: h } = globalThis, f = O2(s);
    n.push({
      fakePseudoElement: a,
      computedStyle: l,
      removeFakePseudoElement() {
        a.remove(), o.remove();
      },
      // For https://floating-ui.com/docs/autoupdate#ancestorscroll to work on
      // `VirtualElement`s.
      contextElement: s,
      // https://floating-ui.com/docs/virtual-elements
      getBoundingClientRect() {
        const { scrollY: p, scrollX: m } = globalThis, { scrollTop: y, scrollLeft: w } = f;
        return DOMRect.fromRect({
          y: c.y + (u - p) + (f.scrollTop - y),
          x: c.x + (h - m) + (f.scrollLeft - w),
          width: c.width,
          height: c.height
        });
      }
    });
  }
  return n;
}
function N2(r, t) {
  const e = en(r, "anchor-name");
  return t ? e.split(",").map((n) => n.trim()).includes(t) : !e;
}
function M2(r, t) {
  const e = en(r, "anchor-scope");
  return e === t || e === "all";
}
function q2(r) {
  return !!((r.type === "text/css" || r.rel === "stylesheet") && r.href);
}
function _2(r) {
  const t = new URL(r.href, document.baseURI);
  if (q2(r) && t.origin === location.origin)
    return t;
}
function R2(r) {
  return yt(this, null, function* () {
    return Promise.all(
      r.map((t) => yt(this, null, function* () {
        if (!t.url)
          return t;
        const e = yield (yield fetch(t.url.toString())).text();
        return jt(G({}, t), { css: e });
      }))
    );
  });
}
function z2() {
  const r = document.querySelectorAll('[style*="anchor"]'), t = [];
  return r.forEach((e) => {
    const n = ke(12), i = "data-has-inline-styles";
    e.setAttribute(i, n);
    const s = e.getAttribute("style"), a = `[${i}="${n}"] { ${s} }`;
    t.push({ el: e, css: a });
  }), t;
}
function P2() {
  return yt(this, null, function* () {
    const r = document.querySelectorAll("link, style"), t = [];
    r.forEach((n) => {
      if (n.tagName.toLowerCase() === "link") {
        const i = _2(n);
        i && t.push({ el: n, url: i });
      }
      n.tagName.toLowerCase() === "style" && t.push({ el: n, css: n.innerHTML });
    });
    const e = z2();
    return yield R2([...t, ...e]);
  });
}
function B2(r, t) {
  return !r || r === t ? !1 : zm(r) ? r.document.contains(t) : r.contains(t);
}
function zm(r) {
  return !!(r && r === r.window);
}
function $2(r) {
  return ci(r, "position", "fixed");
}
function Ic(r) {
  return !!(r && ($2(r) || ci(r, "position", "absolute")));
}
function of(r, t) {
  return r.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING;
}
function j2(r) {
  return yt(this, null, function* () {
    return yield le.getOffsetParent(r);
  });
}
function _l(r) {
  return yt(this, null, function* () {
    if (!["absolute", "fixed"].includes(en(r, "position")))
      return yield j2(r);
    let t = r.parentElement;
    for (; t; ) {
      if (!ci(t, "position", "static") && ci(t, "display", "block"))
        return t;
      t = t.parentElement;
    }
    return window;
  });
}
function F2(r, t, e, n) {
  return yt(this, null, function* () {
    const i = yield _l(r), s = yield _l(e);
    if (!(B2(s, r) || zm(s)) || i === s && !(!Ic(r) || of(r, e)))
      return !1;
    if (i !== s) {
      let a;
      const o = [];
      for (a = i; a && a !== s && a !== window; )
        o.push(a), a = yield _l(a);
      const l = o[o.length - 1];
      if (l instanceof HTMLElement && !(!Ic(l) || of(l, e)))
        return !1;
    }
    {
      let a = r.parentElement;
      for (; a; ) {
        if (ci(a, "content-visibility", "hidden"))
          return !1;
        a = a.parentElement;
      }
    }
    return !(t && n && lf(r, t, n) !== lf(e, t, n));
  });
}
function lf(r, t, e) {
  for (; !(r.matches(e) && M2(r, t)); ) {
    if (!r.parentElement)
      return null;
    r = r.parentElement;
  }
  return r;
}
function cf(r, t, e, n) {
  return yt(this, null, function* () {
    if (!(r instanceof HTMLElement && e.length && Ic(r)))
      return null;
    const i = e.flatMap(I2).filter((a) => N2(a, t)), s = n.map((a) => a.selector).join(",") || null;
    for (let a = i.length - 1; a >= 0; a--) {
      const o = i[a], l = "fakePseudoElement" in o;
      if (yield F2(
        l ? o.fakePseudoElement : o,
        t,
        r,
        s
      ))
        return l && o.removeFakePseudoElement(), o;
    }
    return null;
  });
}
const H2 = [
  "left",
  "right",
  "top",
  "bottom",
  "inset-block-start",
  "inset-block-end",
  "inset-inline-start",
  "inset-inline-end",
  "inset-block",
  "inset-inline",
  "inset"
], U2 = [
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height"
], V2 = [
  "justify-content",
  "align-content",
  "justify-self",
  "align-self",
  "justify-items",
  "align-items"
], G2 = [
  "top",
  "left",
  "right",
  "bottom",
  "start",
  "end",
  "self-start",
  "self-end",
  "center"
], W2 = [
  "width",
  "height",
  "block",
  "inline",
  "self-block",
  "self-inline"
];
function K2(r) {
  return r.type === "Declaration" && r.property === "anchor-name";
}
function Y2(r) {
  return r.type === "Declaration" && r.property === "anchor-scope";
}
function Pm(r) {
  return !!(r && r.type === "Function" && r.name === "anchor");
}
function Bm(r) {
  return !!(r && r.type === "Function" && r.name === "anchor-size");
}
function ya(r) {
  return !!(r && r.type === "Function" && r.name === "var");
}
function Q2(r) {
  return r.type === "Declaration" && r.property === "position-fallback";
}
function Z2(r) {
  return r.type === "Atrule" && r.name === "position-fallback";
}
function X2(r) {
  return r.type === "Atrule" && r.name === "try";
}
function Rl(r) {
  return !!(r.type === "Identifier" && r.name);
}
function J2(r) {
  return !!(r.type === "Percentage" && r.value);
}
function hs(r) {
  return H2.includes(r);
}
function tO(r) {
  return G2.includes(r);
}
function uo(r) {
  return U2.includes(r);
}
function eO(r) {
  return W2.includes(r);
}
function nO(r) {
  return V2.includes(r);
}
function uf(r, t) {
  let e, n, i, s = "", a = !1, o;
  const l = [];
  r.children.toArray().forEach((f) => {
    if (a) {
      s = `${s}${Qt(f)}`;
      return;
    }
    if (f.type === "Operator" && f.value === ",") {
      a = !0;
      return;
    }
    l.push(f);
  });
  let [c, u] = l;
  if (u || (u = c, c = void 0), c && (Rl(c) ? c.name === "implicit" ? c = void 0 : c.name.startsWith("--") && (e = c.name) : ya(c) && c.children.first && (o = c.children.first.name)), u)
    if (Pm(r)) {
      if (Rl(u) && tO(u.name))
        n = u.name;
      else if (J2(u)) {
        const f = Number(u.value);
        n = Number.isNaN(f) ? void 0 : f;
      }
    } else Bm(r) && Rl(u) && eO(u.name) && (i = u.name);
  const h = `--anchor-${ke(12)}`;
  return Object.assign(r, {
    type: "Raw",
    value: `var(${h})`,
    children: null
  }), Reflect.deleteProperty(r, "name"), {
    anchorName: e,
    anchorSide: n,
    anchorSize: i,
    fallbackValue: s || "0px",
    customPropName: o,
    uuid: h
  };
}
function df(r) {
  return r.value.children.map(
    ({ name: t }) => t
  );
}
function zl(r) {
  return r ? r.children.map((t) => {
    var e;
    let n;
    ((e = t.children.last) == null ? void 0 : e.type) === "PseudoElementSelector" && (t = Dc(t), n = Qt(t.children.last), t.children.pop());
    const i = Qt(t);
    return {
      selector: i + (n ?? ""),
      elementPart: i,
      pseudoElementPart: n
    };
  }).toArray() : [];
}
let Ki = {}, Zn = {}, Xn = {}, Yi = {}, Qn = {};
function rO() {
  Ki = {}, Zn = {}, Xn = {}, Yi = {}, Qn = {};
}
function iO(r, t) {
  var e;
  if ((Pm(r) || Bm(r)) && t) {
    if (t.property.startsWith("--")) {
      const n = Qt(t.value), i = uf(r);
      return Yi[i.uuid] = n, Xn[t.property] = [
        ...(e = Xn[t.property]) != null ? e : [],
        i
      ], { changed: !0 };
    }
    if (hs(t.property) || uo(t.property)) {
      const n = uf(r);
      return { prop: t.property, data: n, changed: !0 };
    }
  }
  return {};
}
function sO(r) {
  return Q2(r) && r.value.children.first ? E2(r) : null;
}
function aO(r) {
  var t, e;
  if (Z2(r) && (t = r.prelude) != null && t.value && (e = r.block) != null && e.children) {
    const n = r.prelude.value, i = [];
    return r.block.children.filter(X2).forEach((s) => {
      var a;
      if ((a = s.block) != null && a.children) {
        const o = s.block.children.filter(
          (c) => _m(c) && (hs(c.property) || uo(c.property) || nO(c.property))
        ), l = {
          uuid: `${n}-try-${ke(12)}`,
          declarations: Object.fromEntries(
            o.map((c) => [c.property, Qt(c.value)])
          )
        };
        i.push(l);
      }
    }), { name: n, blocks: i };
  }
  return {};
}
function oO(r, t) {
  return yt(this, null, function* () {
    let e = t.anchorName;
    const n = t.customPropName;
    if (r && !e) {
      const o = r.getAttribute("anchor"), l = en(
        r,
        "position-anchor"
      );
      if (l)
        e = l;
      else if (n)
        e = en(r, n);
      else if (o) {
        const c = `#${CSS.escape(o)}`;
        return yield cf(
          r,
          null,
          [{ selector: c, elementPart: c }],
          []
        );
      }
    }
    const i = e ? Ki[e] || [] : [], s = e ? Zn[Rm.All] || [] : [], a = e ? Zn[e] || [] : [];
    return yield cf(
      r,
      e || null,
      i,
      [...s, ...a]
    );
  });
}
function lO(r) {
  return yt(this, null, function* () {
    var t, e, n, i, s, a;
    const o = {}, l = {}, c = {}, u = {};
    rO();
    for (const y of r) {
      const w = Yn(y.css);
      Kn(w, {
        visit: "Atrule",
        enter(v) {
          const { name: S, blocks: A } = aO(v);
          S && A != null && A.length && (c[S] = {
            targets: [],
            blocks: A
          });
        }
      });
    }
    for (const y of r) {
      let w = !1;
      const v = Yn(y.css);
      Kn(v, {
        visit: "Declaration",
        enter(S) {
          var A, E;
          const T = (A = this.rule) == null ? void 0 : A.prelude, M = zl(T), N = sO(S);
          if (N && M.length && c[N]) {
            for (const { selector: k } of M)
              u[k] = { fallbacks: c[N].blocks }, c[N].targets.includes(k) || c[N].targets.push(k);
            for (const k of c[N].blocks) {
              const C = `[data-anchor-polyfill="${k.uuid}"]`;
              (E = this.stylesheet) == null || E.children.prependData({
                type: "Rule",
                prelude: {
                  type: "Raw",
                  value: C
                },
                block: {
                  type: "Block",
                  children: new mt().fromArray(
                    Object.entries(k.declarations).map(([q, I]) => ({
                      type: "Declaration",
                      important: !0,
                      property: q,
                      value: {
                        type: "Raw",
                        value: I
                      }
                    }))
                  )
                }
              }), l[C] = M.map(({ selector: q }) => q).join(", ");
            }
            w = !0;
          }
        }
      }), w && (y.css = Qt(v), y.changed = !0);
    }
    for (const y of r) {
      let w = !1;
      const v = Yn(y.css);
      Kn(v, function(S) {
        var A, E, T;
        const M = (A = this.rule) == null ? void 0 : A.prelude, N = zl(M);
        if (K2(S) && N.length)
          for (const I of df(S))
            Ki[I] != null || (Ki[I] = []), Ki[I].push(...N);
        if (Y2(S) && N.length)
          for (const I of df(S))
            Zn[I] != null || (Zn[I] = []), Zn[I].push(...N);
        const {
          prop: k,
          data: C,
          changed: q
        } = iO(S, this.declaration);
        if (k && C && N.length)
          for (const { selector: I } of N)
            o[I] = jt(G({}, o[I]), {
              [k]: [...(T = (E = o[I]) == null ? void 0 : E[k]) != null ? T : [], C]
            });
        q && (w = !0);
      }), w && (y.css = Qt(v), y.changed = !0);
    }
    const h = new Set(Object.keys(Xn)), f = {}, p = (y) => {
      var w, v, S, A, E;
      const T = [], M = new Set((v = (w = f[y]) == null ? void 0 : w.names) != null ? v : []);
      for (; M.size > 0; )
        for (const N of M)
          T.push(...(S = Xn[N]) != null ? S : []), M.delete(N), (E = (A = f[N]) == null ? void 0 : A.names) != null && E.length && f[N].names.forEach((k) => M.add(k));
      return T;
    };
    for (; h.size > 0; ) {
      const y = [];
      for (const w of r) {
        let v = !1;
        const S = Yn(w.css);
        Kn(S, {
          visit: "Function",
          enter(A) {
            var E, T;
            const M = (E = this.rule) == null ? void 0 : E.prelude, N = this.declaration, k = N == null ? void 0 : N.property;
            if ((M == null ? void 0 : M.children.isEmpty) === !1 && ya(A) && N && k && A.children.first && h.has(
              A.children.first.name
            ) && // For now, we only want assignments to other CSS custom properties
            k.startsWith("--")) {
              const C = A.children.first, q = (T = Xn[C.name]) != null ? T : [], I = p(C.name);
              if (!(q.length || I.length))
                return;
              const j = `${C.name}-anchor-${ke(12)}`, Q = Qt(N.value);
              Yi[j] = Q, f[k] || (f[k] = { names: [], uuids: [] });
              const H = f[k];
              H.names.includes(C.name) || H.names.push(C.name), H.uuids.push(j), y.push(k), C.name = j, v = !0;
            }
          }
        }), v && (w.css = Qt(S), w.changed = !0);
      }
      h.clear(), y.forEach((w) => h.add(w));
    }
    for (const y of r) {
      let w = !1;
      const v = Yn(y.css);
      Kn(v, {
        visit: "Function",
        enter(S) {
          var A, E, T, M, N, k, C;
          const q = (A = this.rule) == null ? void 0 : A.prelude, I = this.declaration, j = I == null ? void 0 : I.property;
          if ((q == null ? void 0 : q.children.isEmpty) === !1 && ya(S) && I && j && S.children.first && // Now we only want assignments to inset/sizing properties
          (hs(j) || uo(j))) {
            const Q = S.children.first, H = (E = Xn[Q.name]) != null ? E : [], lt = p(Q.name);
            if (!(H.length || lt.length))
              return;
            const it = `${j}-${ke(12)}`;
            if (lt.length) {
              const ut = /* @__PURE__ */ new Set([Q.name]);
              for (; ut.size > 0; )
                for (const wt of ut) {
                  const U = f[wt];
                  if ((T = U == null ? void 0 : U.names) != null && T.length && (M = U == null ? void 0 : U.uuids) != null && M.length)
                    for (const _e of U.names)
                      for (const Re of U.uuids)
                        Qn[Re] = jt(G({}, Qn[Re]), {
                          // - `key` (`propUuid`) is the property-specific
                          //   uuid to append to the new custom property name
                          // - `value` is the new property-specific custom
                          //   property value to use
                          [it]: `${_e}-${it}`
                        });
                  ut.delete(wt), (N = U == null ? void 0 : U.names) != null && N.length && U.names.forEach((_e) => ut.add(_e));
                }
            }
            const vt = zl(q);
            for (const ut of [...H, ...lt]) {
              const wt = G({}, ut), U = `--anchor-${ke(12)}-${j}`, _e = wt.uuid;
              wt.uuid = U;
              for (const { selector: Re } of vt)
                o[Re] = jt(G({}, o[Re]), {
                  [j]: [...(C = (k = o[Re]) == null ? void 0 : k[j]) != null ? C : [], wt]
                });
              Qn[_e] = jt(G({}, Qn[_e]), {
                // - `key` (`propUuid`) is the property-specific
                //   uuid to append to the new custom property name
                // - `value` is the new property-specific custom
                //   property value to use
                [it]: U
              });
            }
            Q.name = `${Q.name}-${it}`, w = !0;
          }
        }
      }), w && (y.css = Qt(v), y.changed = !0);
    }
    if (Object.keys(Qn).length > 0)
      for (const y of r) {
        let w = !1;
        const v = Yn(y.css);
        Kn(v, {
          visit: "Function",
          enter(S) {
            var A, E, T, M;
            if (ya(S) && (E = (A = S.children.first) == null ? void 0 : A.name) != null && E.startsWith(
              "--"
            ) && (M = (T = this.declaration) == null ? void 0 : T.property) != null && M.startsWith("--") && this.block) {
              const N = S.children.first, k = Qn[N.name];
              if (k)
                for (const [C, q] of Object.entries(k))
                  this.block.children.appendData({
                    type: "Declaration",
                    important: !1,
                    property: `${this.declaration.property}-${C}`,
                    value: {
                      type: "Raw",
                      value: Qt(this.declaration.value).replace(
                        `var(${N.name})`,
                        `var(${q})`
                      )
                    }
                  }), w = !0;
              Yi[N.name] && (this.declaration.value = {
                type: "Raw",
                value: Yi[N.name]
              }, w = !0);
            }
          }
        }), w && (y.css = Qt(v), y.changed = !0);
      }
    const m = /* @__PURE__ */ new Map();
    for (const [y, w] of Object.entries(o)) {
      let v;
      y.startsWith("[data-anchor-polyfill=") && l[y] ? v = document.querySelectorAll(l[y]) : v = document.querySelectorAll(y);
      for (const [S, A] of Object.entries(w))
        for (const E of A)
          for (const T of v) {
            const M = yield oO(T, E), N = `--anchor-${ke(12)}`;
            m.set(T, jt(G({}, (t = m.get(T)) != null ? t : {}), {
              [E.uuid]: N
            })), T.setAttribute(
              "style",
              `${E.uuid}: var(${N}); ${(e = T.getAttribute("style")) != null ? e : ""}`
            ), u[y] = jt(G({}, u[y]), {
              declarations: jt(G({}, (n = u[y]) == null ? void 0 : n.declarations), {
                [S]: [
                  ...(a = (s = (i = u[y]) == null ? void 0 : i.declarations) == null ? void 0 : s[S]) != null ? a : [],
                  jt(G({}, E), { anchorEl: M, targetEl: T, uuid: N })
                ]
              })
            });
          }
    }
    return { rules: u, inlineStyles: m, anchorScopes: Zn };
  });
}
function hf(r, t, e = !1) {
  return yt(this, null, function* () {
    const n = [];
    for (const { el: i, css: s, changed: a } of r) {
      const o = { el: i, css: s, changed: !1 };
      if (a) {
        if (i.tagName.toLowerCase() === "style")
          i.innerHTML = s;
        else if (i.tagName.toLowerCase() === "link") {
          const l = new Blob([s], { type: "text/css" }), c = URL.createObjectURL(l), u = document.createElement("link");
          u.rel = "stylesheet", u.href = c;
          const h = new Promise((f) => {
            u.onload = f;
          });
          i.replaceWith(u), yield h, URL.revokeObjectURL(c), o.el = u;
        } else if (i.hasAttribute("data-has-inline-styles")) {
          const l = i.getAttribute("data-has-inline-styles");
          if (l) {
            const c = `[data-has-inline-styles="${l}"]{`;
            let u = s.slice(c.length, -1);
            const h = t == null ? void 0 : t.get(i);
            if (h)
              for (const [f, p] of Object.entries(h))
                u = `${f}: var(${p}); ${u}`;
            i.setAttribute("style", u);
          }
        }
      }
      e && i.hasAttribute("data-has-inline-styles") && i.removeAttribute("data-has-inline-styles"), n.push(o);
    }
    return n;
  });
}
const cO = jt(G({}, le), { _c: /* @__PURE__ */ new Map() }), $m = (r) => yt(void 0, null, function* () {
  var t, e, n;
  let i = yield (t = le.getOffsetParent) == null ? void 0 : t.call(le, r);
  return (yield (e = le.isElement) == null ? void 0 : e.call(le, i)) || (i = (yield (n = le.getDocumentElement) == null ? void 0 : n.call(le, r)) || window.document.documentElement), i;
}), uO = (r, t) => {
  let e;
  switch (r) {
    case "start":
    case "self-start":
      e = 0;
      break;
    case "end":
    case "self-end":
      e = 100;
      break;
    default:
      typeof r == "number" && !Number.isNaN(r) && (e = r);
  }
  if (e !== void 0)
    return t ? 100 - e : e;
}, dO = (r, t) => {
  let e;
  switch (r) {
    case "block":
    case "self-block":
      e = t ? "width" : "height";
      break;
    case "inline":
    case "self-inline":
      e = t ? "height" : "width";
      break;
  }
  return e;
}, ff = (r) => {
  switch (r) {
    case "top":
    case "bottom":
      return "y";
    case "left":
    case "right":
      return "x";
  }
  return null;
}, hO = (r) => {
  switch (r) {
    case "x":
      return "width";
    case "y":
      return "height";
  }
  return null;
}, pf = (r) => en(r, "display") === "inline", gf = (r, t) => (t === "x" ? ["border-left-width", "border-right-width"] : ["border-top-width", "border-bottom-width"]).reduce(
  (e, n) => e + parseInt(en(r, n), 10),
  0
) || 0, la = (r, t) => parseInt(en(r, `margin-${t}`), 10) || 0, fO = (r) => ({
  top: la(r, "top"),
  right: la(r, "right"),
  bottom: la(r, "bottom"),
  left: la(r, "left")
}), mf = (r) => yt(void 0, [r], function* ({
  targetEl: t,
  targetProperty: e,
  anchorRect: n,
  anchorSide: i,
  anchorSize: s,
  fallback: a
}) {
  var o;
  if (!((s || i !== void 0) && t && n))
    return a;
  if (s) {
    if (!uo(e))
      return a;
    let l;
    switch (s) {
      case "width":
      case "height":
        l = s;
        break;
      default: {
        let c = !1;
        const u = en(t, "writing-mode");
        c = u.startsWith("vertical-") || u.startsWith("sideways-"), l = dO(s, c);
      }
    }
    return l ? `${n[l]}px` : a;
  }
  if (i !== void 0) {
    let l, c;
    const u = ff(e);
    if (!(hs(e) && u && (!hs(i) || u === ff(i))))
      return a;
    switch (i) {
      case "left":
        l = 0;
        break;
      case "right":
        l = 100;
        break;
      case "top":
        l = 0;
        break;
      case "bottom":
        l = 100;
        break;
      case "center":
        l = 50;
        break;
      default:
        if (t) {
          const p = (yield (o = le.isRTL) == null ? void 0 : o.call(le, t)) || !1;
          l = uO(i, p);
        }
    }
    const h = typeof l == "number" && !Number.isNaN(l), f = hO(u);
    if (h && f) {
      (e === "bottom" || e === "right") && (c = yield $m(t));
      let p = n[u] + n[f] * (l / 100);
      switch (e) {
        case "bottom": {
          if (!c)
            break;
          let m = c.clientHeight;
          if (m === 0 && pf(c)) {
            const y = gf(c, u);
            m = c.offsetHeight - y;
          }
          p = m - p;
          break;
        }
        case "right": {
          if (!c)
            break;
          let m = c.clientWidth;
          if (m === 0 && pf(c)) {
            const y = gf(c, u);
            m = c.offsetWidth - y;
          }
          p = m - p;
          break;
        }
      }
      return `${p}px`;
    }
  }
  return a;
});
function pO(r, t = !1) {
  return yt(this, null, function* () {
    const e = document.documentElement;
    for (const [n, i] of Object.entries(r))
      for (const s of i) {
        const a = s.anchorEl, o = s.targetEl;
        if (a && o)
          tg(
            a,
            o,
            () => yt(this, null, function* () {
              const l = yield le.getElementRects({
                reference: a,
                floating: o,
                strategy: "absolute"
              }), c = yield mf({
                targetEl: o,
                targetProperty: n,
                anchorRect: l.reference,
                anchorSide: s.anchorSide,
                anchorSize: s.anchorSize,
                fallback: s.fallbackValue
              });
              e.style.setProperty(s.uuid, c);
            }),
            { animationFrame: t }
          );
        else {
          const l = yield mf({
            targetProperty: n,
            anchorSide: s.anchorSide,
            anchorSize: s.anchorSize,
            fallback: s.fallbackValue
          });
          e.style.setProperty(s.uuid, l);
        }
      }
  });
}
function gO(r, t, e = !1) {
  return yt(this, null, function* () {
    if (!t.length)
      return;
    const n = document.querySelectorAll(r);
    for (const i of n) {
      let s = !1;
      const a = yield $m(i);
      tg(
        i,
        i,
        () => yt(this, null, function* () {
          if (!s) {
            s = !0;
            for (const [o, { uuid: l }] of t.entries()) {
              if (i.setAttribute("data-anchor-polyfill", l), o === t.length - 1) {
                s = !1;
                break;
              }
              const c = yield le.getElementRects({
                reference: i,
                floating: i,
                strategy: "absolute"
              }), u = yield Sk(
                {
                  x: i.offsetLeft,
                  y: i.offsetTop,
                  platform: cO,
                  rects: c,
                  elements: { floating: i },
                  strategy: "absolute"
                },
                {
                  boundary: a,
                  rootBoundary: "document",
                  padding: fO(i)
                }
              );
              if (Object.values(u).every((h) => h <= 0)) {
                s = !1;
                break;
              }
            }
          }
        }),
        { animationFrame: e }
      );
    }
  });
}
function mO(r, t = !1) {
  return yt(this, null, function* () {
    var e, n;
    for (const i of Object.values(r))
      yield pO((e = i.declarations) != null ? e : {}, t);
    for (const [i, s] of Object.entries(r))
      yield gO(
        i,
        (n = s.fallbacks) != null ? n : [],
        t
      );
  });
}
function bO(r) {
  return yt(this, null, function* () {
    const t = !!window.UPDATE_ANCHOR_ON_ANIMATION_FRAME;
    let e = yield P2();
    (yield T2(e)) && (e = yield hf(e));
    const { rules: n, inlineStyles: i } = yield lO(e);
    return Object.values(n).length && (yield hf(e, i, !0), yield mO(n, t)), n;
  });
}
function bf() {
  "anchorName" in document.documentElement.style || bO(), fc.initialize(), Nc.getInstance().init(), Mc.getInstance().init(), qc.getInstance().init(), Ur.getInstance().init(), _c.getInstance().init(), Vr.getInstance().init(), Fc.getInstance().init(), Hc.getInstance().init(), Uc.getInstance().init(), Kr.getInstance().init(), Vc.getInstance().init(), Yr.getInstance().init(), Gc.getInstance().init(), Qr.getInstance().init(), Zr.getInstance().init(), Xr.getInstance().init(), Wc.getInstance().init(), Jr.getInstance().init(), Kc.getInstance().init(), Df.getInstance().init(), new Yc();
}
const yf = {
  FormActions: Nc.getInstance(),
  AlertActions: Mc.getInstance(),
  BadgeActions: qc.getInstance(),
  CalendarActions: Ur.getInstance(),
  RadioActions: _c.getInstance(),
  RangeActions: Vr.getInstance(),
  SelectActions: Fc.getInstance(),
  TabsActions: Hc.getInstance(),
  ModalActions: Uc.getInstance(),
  ToastActions: Kr.getInstance(),
  DropdownActions: Vc.getInstance(),
  TableActions: Yr.getInstance(),
  ButtonGroupActions: Gc.getInstance(),
  TooltipActions: Qr.getInstance(),
  TimePickerActions: Zr.getInstance(),
  AccordionActions: Xr.getInstance(),
  EditorActions: Wc.getInstance(),
  DatePickerActions: Jr.getInstance(),
  AddToCartActions: Kc.getInstance(),
  GalleryActions: Df.getInstance(),
  PopoverActions: new Yc(),
  // Expose Quill for EditorActions to use
  Quill: O,
  init: bf,
  initialize: bf
  // Alias for consistency
};
typeof window < "u" && (window.KeysUI = yf, window.Quill = O, window.manualSyncEditor = () => yf.EditorActions.manualSync());
export {
  Xr as AccordionActions,
  Kc as AddToCartActions,
  Mc as AlertActions,
  qc as BadgeActions,
  ht as BaseActionClass,
  Gc as ButtonGroupActions,
  Ur as CalendarActions,
  b as DOMUtils,
  Jr as DatePickerActions,
  Vc as DropdownActions,
  Wc as EditorActions,
  D as EventUtils,
  vO as FloatingManager,
  Nc as FormActions,
  Df as GalleryActions,
  Uc as ModalActions,
  Yc as PopoverActions,
  fc as RTLUtils,
  _c as RadioActions,
  Vr as RangeActions,
  Fc as SelectActions,
  Yr as TableActions,
  Hc as TabsActions,
  Zr as TimePickerActions,
  Kr as ToastActions,
  Qr as TooltipActions,
  yf as default,
  bf as initializeKeysUI
};
