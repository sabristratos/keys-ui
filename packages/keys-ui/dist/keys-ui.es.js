var xl = Object.defineProperty;
var Tl = (r, t, e) => t in r ? xl(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var C = (r, t, e) => Tl(r, typeof t != "symbol" ? t + "" : t, e);
const Ue = class Ue {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const t = this.name;
    return Ue.instances.has(t) || Ue.instances.set(t, new this()), Ue.instances.get(t);
  }
  /**
   * Standardized initialization flow
   * Prevents double initialization and provides lifecycle hooks
   */
  init() {
    var t, e, s;
    this.initialized || ((t = this.onBeforeInit) == null || t.call(this), this.bindEventListeners(), this.initializeElements(), (e = this.setupDynamicObserver) == null || e.call(this), (s = this.onAfterInit) == null || s.call(this), this.initialized = !0);
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
    const e = new MutationObserver((s) => {
      s.forEach((n) => {
        n.addedNodes.length > 0 && t(n.addedNodes);
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
    let s = null;
    return () => {
      s && clearTimeout(s), s = setTimeout(t, e);
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
Ue.instances = /* @__PURE__ */ new Map();
let G = Ue;
class f {
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
    const s = e || document;
    return Array.from(s.querySelectorAll(t));
  }
  /**
   * Find elements with specific data attribute
   */
  static findByDataAttribute(t, e, s) {
    const n = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelectorAll(n, s);
  }
  /**
   * Find single element with data attribute
   */
  static findFirstByDataAttribute(t, e, s) {
    const n = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelector(n, s);
  }
  /**
   * Check if element has data attribute with optional value
   */
  static hasDataAttribute(t, e, s) {
    if (!t) return !1;
    const n = t.dataset[e];
    return s !== void 0 ? n === s : n !== void 0;
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
  static setDataAttribute(t, e, s) {
    t && (t.dataset[e] = s);
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
    var s;
    return ((s = t == null ? void 0 : t.matches) == null ? void 0 : s.call(t, e)) ?? !1;
  }
  /**
   * Find all child elements matching selector
   */
  static findChildren(t, e) {
    return t ? Array.from(t.children).filter(
      (s) => this.matches(s, e)
    ) : [];
  }
  /**
   * Get next sibling element matching selector
   */
  static getNextSibling(t, e) {
    let s = t == null ? void 0 : t.nextElementSibling;
    for (; s; ) {
      if (!e || this.matches(s, e))
        return s;
      s = s.nextElementSibling;
    }
    return null;
  }
  /**
   * Get previous sibling element matching selector
   */
  static getPreviousSibling(t, e) {
    let s = t == null ? void 0 : t.previousElementSibling;
    for (; s; ) {
      if (!e || this.matches(s, e))
        return s;
      s = s.previousElementSibling;
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
  static toggleClass(t, e, s) {
    return (t == null ? void 0 : t.classList.toggle(e, s)) ?? !1;
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
  static toggleAttribute(t, e, s) {
    t && (s !== void 0 ? t.setAttribute(e, s) : t.removeAttribute(e));
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
    const s = document.createElement(t);
    return e != null && e.classes && s.classList.add(...e.classes), e != null && e.attributes && Object.entries(e.attributes).forEach(([n, i]) => {
      s.setAttribute(n, i);
    }), e != null && e.textContent && (s.textContent = e.textContent), e != null && e.innerHTML && (s.innerHTML = e.innerHTML), s;
  }
}
class w {
  /**
   * Create and dispatch custom event
   */
  static dispatchCustomEvent(t, e, s, n) {
    const i = new CustomEvent(e, {
      detail: s,
      bubbles: (n == null ? void 0 : n.bubbles) ?? !0,
      cancelable: (n == null ? void 0 : n.cancelable) ?? !0
    });
    return t.dispatchEvent(i);
  }
  /**
   * Add event listener with automatic cleanup tracking
   */
  static addEventListener(t, e, s, n) {
    return t.addEventListener(e, s, n), () => {
      t.removeEventListener(e, s, n);
    };
  }
  /**
   * Handle generic events with delegation
   */
  static handleDelegatedEvent(t, e, s, n) {
    const i = n || document, a = (o) => {
      const l = o.target;
      let u = null;
      l instanceof Element && (u = l.closest(e)), u && s(u, o);
    };
    return this.addEventListener(i, t, a);
  }
  /**
   * Handle click events with delegation
   */
  static handleDelegatedClick(t, e, s) {
    const n = s || document, i = (a) => {
      const o = a, l = o.target;
      let u = null;
      l instanceof Element && (u = l.closest(t)), u && e(u, o);
    };
    return this.addEventListener(n, "click", i);
  }
  /**
   * Handle keydown events with delegation
   */
  static handleDelegatedKeydown(t, e, s) {
    const n = s || document, i = (a) => {
      const o = a, l = o.target;
      let u = null;
      l instanceof Element && (u = l.closest(t)), u && e(u, o);
    };
    return this.addEventListener(n, "keydown", i);
  }
  /**
   * Handle specific key presses
   */
  static handleKeyPress(t, e, s) {
    return (n) => {
      t.includes(n.key) && (s != null && s.preventDefault && n.preventDefault(), s != null && s.stopPropagation && n.stopPropagation(), e(n.key, n));
    };
  }
  /**
   * Handle input events with delegation
   */
  static handleDelegatedInput(t, e, s) {
    const n = s || document, i = (a) => {
      const o = a, l = o.target;
      let u = null;
      l instanceof Element && (u = l.closest(t)), u && e(u, o);
    };
    return this.addEventListener(n, "input", i);
  }
  /**
   * Handle change events with delegation
   */
  static handleDelegatedChange(t, e, s) {
    const n = s || document, i = (a) => {
      const o = a.target;
      let l = null;
      o instanceof Element && (l = o.closest(t)), l && e(l, a);
    };
    return this.addEventListener(n, "change", i);
  }
  /**
   * Handle focus events with delegation
   */
  static handleDelegatedFocus(t, e, s) {
    const n = s || document, i = (a) => {
      const o = a, l = o.target;
      let u = null;
      l instanceof Element && (u = l.closest(t)), u && e(u, o);
    };
    return this.addEventListener(n, "focusin", i);
  }
  /**
   * Create debounced event handler
   */
  static debounce(t, e) {
    let s = null;
    return (...n) => {
      s && clearTimeout(s), s = setTimeout(() => {
        t(...n);
      }, e);
    };
  }
  /**
   * Create throttled event handler
   */
  static throttle(t, e) {
    let s = !1;
    return (...n) => {
      s || (t(...n), s = !0, setTimeout(() => {
        s = !1;
      }, e));
    };
  }
  /**
   * Handle window resize with debouncing
   */
  static handleResize(t, e = 100) {
    const s = this.debounce(t, e);
    return this.addEventListener(window, "resize", s);
  }
  /**
   * Handle click outside element
   */
  static handleClickOutside(t, e) {
    const s = (n) => {
      const i = n, a = i.target;
      t.contains(a) || e(i);
    };
    return this.addEventListener(document, "click", s);
  }
  /**
   * Handle escape key globally
   */
  static handleEscape(t) {
    const e = this.handleKeyPress(["Escape"], t);
    return this.addEventListener(document, "keydown", e);
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
  static handleFormSubmission(t, e, s) {
    const n = (i) => {
      const a = i;
      if (s && !s(t)) {
        i.preventDefault();
        return;
      }
      const o = new FormData(t);
      e(o, a);
    };
    return this.addEventListener(t, "submit", n);
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
      var i, a, o, l, u, h, g, p, m, y, v;
      const { key: s } = e, n = ((i = t.preventDefault) == null ? void 0 : i.includes(s)) ?? !0;
      switch (s) {
        case "ArrowUp":
          n && e.preventDefault(), (a = t.onArrowUp) == null || a.call(t);
          break;
        case "ArrowDown":
          n && e.preventDefault(), (o = t.onArrowDown) == null || o.call(t);
          break;
        case "ArrowLeft":
          n && e.preventDefault(), (l = t.onArrowLeft) == null || l.call(t);
          break;
        case "ArrowRight":
          n && e.preventDefault(), (u = t.onArrowRight) == null || u.call(t);
          break;
        case "Enter":
          n && e.preventDefault(), (h = t.onEnter) == null || h.call(t);
          break;
        case " ":
          n && e.preventDefault(), (g = t.onSpace) == null || g.call(t);
          break;
        case "Escape":
          n && e.preventDefault(), (p = t.onEscape) == null || p.call(t);
          break;
        case "Home":
          n && e.preventDefault(), (m = t.onHome) == null || m.call(t);
          break;
        case "End":
          n && e.preventDefault(), (y = t.onEnd) == null || y.call(t);
          break;
        case "Tab":
          (v = t.onTab) == null || v.call(t);
          break;
      }
    };
  }
}
function la(r, t = "") {
  const e = window.KeysUITranslations;
  if (!e)
    return t;
  const s = r.split(".");
  let n = e;
  for (const i of s)
    if (n = n == null ? void 0 : n[i], n === void 0)
      return t;
  return n || t;
}
class Lr extends G {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick(".input-action", (t, e) => {
      e.preventDefault(), this.handleActionClick(t);
    }), w.handleDelegatedKeydown(".input-action", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleActionClick(t));
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(t) {
    const e = f.findClosest(t, ".input-action"), s = e == null ? void 0 : e.dataset.action;
    if (!s) return;
    const n = f.findFormElementForAction(t);
    if (n) {
      switch (s) {
        case "clear":
          this.clearValue(n);
          break;
        case "copy":
          await this.copyToClipboard(n, e);
          break;
        case "toggle-password":
          await this.togglePasswordVisibility(n, t, e);
          break;
        case "external":
          this.openExternalUrl(t.dataset.url);
          break;
        default:
          this.handleCustomAction(n, s);
          break;
      }
      this.dispatchActionEvent(n, s);
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
    const s = f.querySelector(".button-icon-default", t), n = f.querySelector(".button-icon-toggle", t), i = f.querySelector(".button-icon-success", t), a = t.dataset.iconDefault, o = t.dataset.iconToggle, l = t.dataset.iconSuccess;
    s && (s.classList.remove("opacity-100"), s.classList.add("opacity-0")), n && (n.classList.remove("opacity-100", "scale-110", "scale-90"), n.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), e === a && s ? (s.classList.remove("opacity-0"), s.classList.add("opacity-100")) : e === o && n ? (n.classList.remove("opacity-0"), n.classList.add("opacity-100")) : e === l && i && (i.classList.remove("opacity-0"), i.classList.add("opacity-100", "scale-110"));
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
    const s = f.querySelector("button", e);
    try {
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, la("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && await this.showCopySuccess(s, e);
    } catch {
      this.fallbackCopyToClipboard(t, e);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(t, e) {
    const s = f.querySelector("button", e);
    t.select(), t instanceof HTMLInputElement && t.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(t, la("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && this.showCopySuccess(s, e);
    } catch {
      this.showFeedback(t, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(t, e) {
    const s = t.dataset.iconSuccess, n = t.dataset.labelSuccess, i = t.dataset.iconDefault, a = f.querySelector(".sr-only", t);
    if (s && i)
      if (await this.swapButtonIcon(t, s), n && a) {
        const o = a.textContent;
        a.textContent = n, setTimeout(async () => {
          await this.swapButtonIcon(t, i), o && a && (a.textContent = o);
        }, 2e3);
      } else
        setTimeout(async () => {
          await this.swapButtonIcon(t, i);
        }, 2e3);
  }
  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(t, e, s) {
    var g;
    const n = t.type === "password", i = n ? "text" : "password", a = e.dataset.iconDefault, o = e.dataset.iconToggle, l = (g = f.querySelector(".sr-only", e)) == null ? void 0 : g.textContent, u = e.dataset.labelToggle;
    t.type = i;
    const h = f.querySelector(".sr-only", e);
    n ? (o && await this.swapButtonIcon(e, o), u && h && (h.textContent = u), e.setAttribute("aria-label", u || "Hide password")) : (a && await this.swapButtonIcon(e, a), l && h && (h.textContent = l), e.setAttribute("aria-label", l || "Show password"));
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
    w.dispatchCustomEvent(t, "form-action", {
      element: t,
      action: e,
      value: t.value
    });
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(t, e, s = "success") {
    const n = document.createElement("div");
    n.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${s === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, n.textContent = e;
    const i = f.findClosest(t, ".relative");
    i && (i.appendChild(n), setTimeout(() => {
      n.parentNode && n.parentNode.removeChild(n);
    }, 2e3));
  }
  /**
   * Add a custom action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return w.addEventListener(document, "form-action", (s) => {
      const n = s;
      n.detail.action === t && e(n.detail.element);
    });
  }
  /**
   * Clean up FormActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Lr.getInstance();
const $n = class $n {
  /**
   * Check if user prefers reduced motion
   */
  static prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /**
   * Fade in animation with optional scale transform
   */
  static fadeIn(t, e = {}) {
    var g;
    if (this.prefersReducedMotion())
      return t.style.opacity = "1", e.scale && (t.style.transform = "scale(1)"), (g = e.onComplete) == null || g.call(e), null;
    const {
      duration: s = 300,
      easing: n = "ease-out",
      delay: i = 0,
      fill: a = "forwards",
      scale: o = !1,
      onComplete: l
    } = e, u = o ? [
      { opacity: "0", transform: "scale(0.95)" },
      { opacity: "1", transform: "scale(1)" }
    ] : [
      { opacity: "0" },
      { opacity: "1" }
    ], h = t.animate(u, {
      duration: s,
      easing: n,
      delay: i,
      fill: a
    });
    return l && h.addEventListener("finish", l, { once: !0 }), h;
  }
  /**
   * Fade out animation with optional scale transform
   */
  static fadeOut(t, e = {}) {
    var g;
    if (this.prefersReducedMotion())
      return t.style.opacity = "0", e.scale && (t.style.transform = "scale(0.95)"), (g = e.onComplete) == null || g.call(e), null;
    const {
      duration: s = 300,
      easing: n = "ease-in",
      delay: i = 0,
      fill: a = "forwards",
      scale: o = !1,
      onComplete: l
    } = e, u = o ? [
      { opacity: "1", transform: "scale(1)" },
      { opacity: "0", transform: "scale(0.95)" }
    ] : [
      { opacity: "1" },
      { opacity: "0" }
    ], h = t.animate(u, {
      duration: s,
      easing: n,
      delay: i,
      fill: a
    });
    return l && h.addEventListener("finish", l, { once: !0 }), h;
  }
  /**
   * Expand height animation (for accordions, dropdowns, etc.)
   */
  static expandHeight(t, e = {}) {
    var g;
    if (this.prefersReducedMotion())
      return t.style.height = e.toHeight === "auto" ? "" : `${e.toHeight}px`, (g = e.onComplete) == null || g.call(e), null;
    const {
      duration: s = 300,
      easing: n = "ease-out",
      fromHeight: i = 0,
      toHeight: a = "auto",
      onComplete: o
    } = e, l = i === "auto" ? t.offsetHeight : i;
    let u;
    if (a === "auto") {
      const p = t.style.height;
      t.style.height = "auto", u = t.offsetHeight, t.style.height = p;
    } else
      u = a;
    t.style.height = `${l}px`, t.style.overflow = "hidden";
    const h = t.animate([
      { height: `${l}px` },
      { height: `${u}px` }
    ], {
      duration: s,
      easing: n,
      fill: "forwards"
    });
    return h.addEventListener("finish", () => {
      a === "auto" && (t.style.height = ""), t.style.overflow = "", o == null || o();
    }, { once: !0 }), h;
  }
  /**
   * Collapse height animation
   */
  static collapseHeight(t, e = {}) {
    var u;
    if (this.prefersReducedMotion())
      return t.style.height = `${e.toHeight || 0}px`, (u = e.onComplete) == null || u.call(e), null;
    const {
      duration: s = 300,
      easing: n = "ease-out",
      toHeight: i = 0,
      onComplete: a
    } = e, o = t.offsetHeight;
    t.style.height = `${o}px`, t.style.overflow = "hidden";
    const l = t.animate([
      { height: `${o}px` },
      { height: `${i}px` }
    ], {
      duration: s,
      easing: n,
      fill: "forwards"
    });
    return l.addEventListener("finish", () => {
      i === 0 && (t.style.display = "none"), t.style.overflow = "", a == null || a();
    }, { once: !0 }), l;
  }
  /**
   * Slide in animation (for panels, tooltips, etc.)
   */
  static slideIn(t, e, s = {}) {
    var h;
    if (this.prefersReducedMotion())
      return t.style.transform = "translate(0, 0)", t.style.opacity = "1", (h = s.onComplete) == null || h.call(s), null;
    const {
      duration: n = 200,
      easing: i = "ease-out",
      distance: a = 10,
      onComplete: o
    } = s, l = {
      up: `translateY(${a}px)`,
      down: `translateY(-${a}px)`,
      left: `translateX(${a}px)`,
      right: `translateX(-${a}px)`
    }, u = t.animate([
      {
        transform: l[e],
        opacity: "0"
      },
      {
        transform: "translate(0, 0)",
        opacity: "1"
      }
    ], {
      duration: n,
      easing: i,
      fill: "forwards"
    });
    return o && u.addEventListener("finish", o, { once: !0 }), u;
  }
  /**
   * Slide out animation
   */
  static slideOut(t, e, s = {}) {
    var h;
    if (this.prefersReducedMotion())
      return t.style.opacity = "0", (h = s.onComplete) == null || h.call(s), null;
    const {
      duration: n = 200,
      easing: i = "ease-in",
      distance: a = 10,
      onComplete: o
    } = s, l = {
      up: `translateY(-${a}px)`,
      down: `translateY(${a}px)`,
      left: `translateX(-${a}px)`,
      right: `translateX(${a}px)`
    }, u = t.animate([
      {
        transform: "translate(0, 0)",
        opacity: "1"
      },
      {
        transform: l[e],
        opacity: "0"
      }
    ], {
      duration: n,
      easing: i,
      fill: "forwards"
    });
    return o && u.addEventListener("finish", o, { once: !0 }), u;
  }
  /**
   * Cancel an animation if it exists
   */
  static cancelAnimation(t) {
    t && t.playState !== "finished" && t.cancel();
  }
  /**
   * Wait for an animation to complete
   */
  static async waitForAnimation(t) {
    if (t)
      return new Promise((e) => {
        t.playState === "finished" ? e() : t.addEventListener("finish", () => e(), { once: !0 });
      });
  }
  /**
   * Animate with automatic cleanup
   */
  static animateWithCleanup(t, e, s = {}) {
    var o;
    if (this.prefersReducedMotion())
      return (o = s.cleanup) == null || o.call(s), null;
    const { cleanup: n, ...i } = s, a = t.animate(e, i);
    return a.addEventListener("finish", () => {
      n == null || n();
    }, { once: !0 }), a.addEventListener("cancel", () => {
      n == null || n();
    }, { once: !0 }), a;
  }
  /**
   * Create a managed timer that can be paused/resumed
   */
  static createTimer(t, e) {
    const s = ++this.timerCounter, n = {
      id: s,
      callback: t,
      delay: e,
      startTime: Date.now(),
      paused: !1
    }, i = window.setTimeout(() => {
      this.timers.delete(s), t();
    }, e);
    return n.id = i, this.timers.set(s, n), s;
  }
  /**
   * Clear a timer
   */
  static clearTimer(t) {
    const e = this.timers.get(t);
    e && (clearTimeout(e.id), this.timers.delete(t));
  }
  /**
   * Pause a timer
   */
  static pauseTimer(t) {
    const e = this.timers.get(t);
    if (e && !e.paused) {
      clearTimeout(e.id);
      const s = Date.now() - e.startTime;
      e.remaining = Math.max(0, e.delay - s), e.paused = !0;
    }
  }
  /**
   * Resume a paused timer
   */
  static resumeTimer(t) {
    const e = this.timers.get(t);
    if (e && e.paused && e.remaining !== void 0) {
      e.paused = !1, e.startTime = Date.now(), e.delay = e.remaining;
      const s = window.setTimeout(() => {
        this.timers.delete(t), e.callback();
      }, e.remaining);
      e.id = s;
    }
  }
  /**
   * Clear all timers (useful for cleanup)
   */
  static clearAllTimers() {
    this.timers.forEach((t) => {
      clearTimeout(t.id);
    }), this.timers.clear();
  }
  /**
   * Apply transition classes for CSS-based animations
   */
  static applyTransitionClasses(t, e, s, n = 300) {
    t.classList.add(e), t.offsetHeight, t.classList.add(s), setTimeout(() => {
      t.classList.remove(e);
    }, n);
  }
};
$n.timers = /* @__PURE__ */ new Map(), $n.timerCounter = 0;
let _ = $n;
typeof window < "u" && (window.AnimationUtils = _);
class Ir extends G {
  /**
   * Initialize alert elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[data-dismiss-alert]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), w.handleDelegatedKeydown("[data-dismiss-alert]", (t, e) => {
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
    return f.findClosest(t, '[data-dismissible="true"]');
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(t) {
    t.classList.add("alert-dismissing"), _.slideOut(t, "right", {
      duration: 300,
      easing: "ease-out",
      distance: 100
    }), _.collapseHeight(t, {
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
    t.style.display = "block", _.slideIn(t, "right", {
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
      title: s,
      message: n,
      dismissible: i = !0,
      duration: a,
      container: o = document.body
    } = t, l = document.createElement("div");
    l.className = this.getAlertClasses(e), l.setAttribute("role", "alert"), i && l.setAttribute("data-dismissible", "true");
    const u = this.buildAlertContent(e, s, n, i);
    return l.innerHTML = u, o.appendChild(l), l.style.opacity = "0", l.style.transform = "translateX(100%)", setTimeout(() => {
      this.showAlert(l);
    }, 10), a && a > 0 && _.createTimer(() => {
      this.dismissAlert(l);
    }, a), this.dispatchAlertEvent(l, "create"), l;
  }
  /**
   * Get CSS classes for alert variant
   */
  getAlertClasses(t) {
    const e = "rounded-lg border p-4 space-y-3", s = {
      info: "bg-info/5 border-info/20 text-info-foreground",
      success: "bg-success/5 border-success/20 text-success-foreground",
      warning: "bg-warning/5 border-warning/20 text-warning-foreground",
      danger: "bg-danger/5 border-danger/20 text-danger-foreground",
      neutral: "bg-neutral/5 border-neutral/20 text-neutral-foreground"
    };
    return `${e} ${s[t] || s.info}`;
  }
  /**
   * Build alert content HTML
   */
  buildAlertContent(t, e, s, n) {
    const i = this.getVariantIcon(t), a = this.getVariantIconColor(t);
    return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${a}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(i)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${e ? `<div class="text-base font-medium">${e}</div>` : ""}
                    <div class="text-sm opacity-90 ${e ? "mt-1" : ""}">${s || ""}</div>
                </div>
                ${n ? `
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
    w.dispatchCustomEvent(t, "alert-action", {
      alert: t,
      action: e
    }), w.dispatchCustomEvent(document.body, "alert-action", {
      alert: t,
      action: e
    });
  }
  /**
   * Add a custom alert action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return w.addEventListener(document, "alert-action", (s) => {
      const n = s;
      n.detail.action === t && e(n.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(t) {
    f.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((s) => {
      this.dismissAlert(s);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    f.querySelectorAll('[data-dismissible="true"]').forEach((e) => {
      this.dismissAlert(e);
    });
  }
  /**
   * Clean up AlertActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Ir.getInstance();
const Bn = class Bn {
  /**
   * Format Date object to string using custom format
   */
  static formatDate(t, e) {
    if (!t || isNaN(t.getTime()))
      return "";
    const s = t.getFullYear(), n = t.getMonth() + 1, i = t.getDate(), a = {
      Y: String(s),
      y: String(s).slice(-2),
      F: this.MONTH_NAMES[n - 1],
      M: this.MONTH_NAMES_SHORT[n - 1],
      m: String(n).padStart(2, "0"),
      n: String(n),
      d: String(i).padStart(2, "0"),
      j: String(i)
    };
    let o = e;
    for (const [l, u] of Object.entries(a))
      o = o.replace(new RegExp(l, "g"), u);
    return o;
  }
  /**
   * Format Date object to YYYY-MM-DD string
   */
  static formatDateString(t) {
    if (!t || isNaN(t.getTime()))
      return "";
    const e = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), n = String(t.getDate()).padStart(2, "0");
    return `${e}-${s}-${n}`;
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
    const s = this.parseDate(t);
    return s ? this.formatDate(s, e) : "";
  }
  /**
   * Format date range for display
   */
  static formatRangeForDisplay(t, e, s, n = " - ") {
    if (!t) return "";
    const i = this.formatDateForDisplay(t, s), a = e ? this.formatDateForDisplay(e, s) : "";
    return a ? `${i}${n}${a}` : i;
  }
  /**
   * Format date range for form submission
   */
  static formatRangeForSubmission(t, e, s = "Y-m-d") {
    if (!t) return null;
    const n = this.formatDateForSubmission(t, s), i = e ? this.formatDateForSubmission(e, s) : "";
    return i ? `${n},${i}` : n;
  }
  /**
   * Format single date for form submission
   */
  static formatDateForSubmission(t, e = "Y-m-d") {
    if (!t) return "";
    const s = this.parseDate(t);
    return s ? this.formatDate(s, e) : "";
  }
  /**
   * Add days to a date string
   */
  static addDaysToDate(t, e) {
    const s = this.parseDate(t);
    return s ? (s.setDate(s.getDate() + e), this.formatDateString(s)) : t;
  }
  /**
   * Add months to a date string
   */
  static addMonthsToDate(t, e) {
    const s = this.parseDate(t);
    return s ? (s.setMonth(s.getMonth() + e), this.formatDateString(s)) : t;
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
  static isDateInRange(t, e, s) {
    if (!e || !s) return !1;
    const n = this.parseDate(t), i = this.parseDate(e), a = this.parseDate(s);
    return !n || !i || !a ? !1 : n >= i && n <= a;
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
      const s = new Date(t);
      if (!isNaN(s.getTime()))
        return s;
    } catch {
    }
    return null;
  }
  /**
   * Create ARIA label for date with contextual information
   */
  static createDateAriaLabel(t, e = !1, s = !1, n = !1, i = !1, a = !1) {
    const o = this.parseDate(t);
    if (!o) return t;
    let u = o.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return e && (u += ", Today"), s ? u += ", Selected" : n ? u += ", Range start" : i ? u += ", Range end" : a && (u += ", In selected range"), u;
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
    const s = this.parseDate(t), n = this.parseDate(e);
    return !s || !n ? 0 : s.getTime() - n.getTime();
  }
  /**
   * Get quick selector date ranges
   */
  static getQuickSelectorDate(t) {
    const e = /* @__PURE__ */ new Date();
    let s = null, n = null;
    switch (t) {
      case "today":
        s = e, n = e;
        break;
      case "yesterday":
        s = new Date(e), s.setDate(e.getDate() - 1), n = s;
        break;
      case "last7days":
        n = e, s = new Date(e), s.setDate(e.getDate() - 6);
        break;
      case "last30days":
        n = e, s = new Date(e), s.setDate(e.getDate() - 29);
        break;
      case "thismonth":
        s = new Date(e.getFullYear(), e.getMonth(), 1), n = new Date(e.getFullYear(), e.getMonth() + 1, 0);
        break;
      case "lastmonth":
        s = new Date(e.getFullYear(), e.getMonth() - 1, 1), n = new Date(e.getFullYear(), e.getMonth(), 0);
        break;
      case "thisyear":
        s = new Date(e.getFullYear(), 0, 1), n = new Date(e.getFullYear(), 11, 31);
        break;
    }
    return { start: s, end: n };
  }
};
Bn.MONTH_NAMES = [
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
], Bn.MONTH_NAMES_SHORT = [
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
let rt = Bn;
class Ke extends G {
  /**
   * Initialize calendar elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("calendar", "true").forEach((t) => {
      this.initializeCalendar(t);
    });
  }
  /**
   * Initialize a single calendar element
   */
  initializeCalendar(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.calendarData, s = t.dataset.disabled === "true";
    let n;
    try {
      n = e ? JSON.parse(e) : {};
    } catch (a) {
      console.error("Failed to parse calendar data:", a), n = {};
    }
    const i = {
      currentMonth: n.currentMonth || this.getCurrentYearMonth(),
      selectedDate: n.selectedDate || null,
      startDate: n.startDate || null,
      endDate: n.endDate || null,
      focusedDate: n.selectedDate || n.startDate || this.getTodayDate(),
      isRange: n.isRange || !1,
      monthsToShow: n.monthsToShow || 1,
      rangeSelectionState: "none",
      isDisabled: s,
      minDate: n.minDate || null,
      maxDate: n.maxDate || null,
      disabledDates: n.disabledDates || [],
      weekdays: n.weekdays || ["S", "M", "T", "W", "T", "F", "S"],
      monthNames: n.monthNames || [
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
    this.setState(t, i), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[data-calendar-date]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault(), e.stopPropagation();
        const s = f.findClosest(t, '[data-calendar="true"]');
        s && !this.isCalendarDisabled(s) && this.selectDate(s, t.dataset.calendarDate);
      }
    }), w.handleDelegatedClick("[data-calendar-nav]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const s = f.findClosest(t, '[data-calendar="true"]'), n = t.dataset.calendarNav;
        s && !this.isCalendarDisabled(s) && this.navigateMonth(s, n);
      }
    }), w.handleDelegatedClick("[data-calendar-action]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const s = f.findClosest(t, '[data-calendar="true"]'), n = t.dataset.calendarAction;
        s && !this.isCalendarDisabled(s) && this.handleFooterAction(s, n);
      }
    }), w.handleDelegatedClick("[data-calendar-month-year-btn]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const s = f.findClosest(t, '[data-calendar="true"]');
        s && !this.isCalendarDisabled(s) && this.toggleMonthYearDropdown(s);
      }
    }), w.handleDelegatedClick("[data-calendar-month]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-calendar="true"]'), n = parseInt(t.dataset.calendarMonth);
      s && !this.isCalendarDisabled(s) && this.selectMonth(s, n);
    }), w.handleDelegatedClick("[data-calendar-year]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-calendar="true"]'), n = parseInt(t.dataset.calendarYear);
      s && !this.isCalendarDisabled(s) && this.selectYear(s, n);
    }), w.handleDelegatedKeydown('[data-calendar="true"]', (t, e) => {
      if (e.key === "Escape") {
        const s = this.getState(t);
        if (s && s.viewMode !== "calendar") {
          e.preventDefault(), s.viewMode = "calendar", this.setState(t, s), this.renderCalendarGrid(t);
          const n = f.querySelector("[data-calendar-month-year-btn]", t);
          n && n.focus();
          return;
        }
      }
      this.handleKeydown(t, e);
    }), w.handleDelegatedFocus("[data-calendar-date]", (t) => {
      const e = f.findClosest(t, '[data-calendar="true"]');
      if (e) {
        const s = this.getState(e);
        s && (s.focusedDate = t.dataset.calendarDate, this.setState(e, s));
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
          const s = e;
          f.hasDataAttribute(s, "calendar", "true") && this.initializeCalendar(s), f.findByDataAttribute("calendar", "true", s).forEach((n) => {
            this.initializeCalendar(n);
          });
        }
      });
    });
  }
  /**
   * Select a date (handles both single date and range selection)
   */
  selectDate(t, e) {
    const s = this.getState(t);
    !s || s.isDisabled || (s.isRange ? this.handleRangeSelection(t, e) : (s.selectedDate = e, s.focusedDate = e, this.setState(t, s), this.renderCalendarGrid(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:dateSelected", {
      selectedDate: e,
      formattedDate: this.formatDateForDisplay(e)
    })));
  }
  /**
   * Handle range selection logic
   */
  handleRangeSelection(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const n = new Date(e);
    if (s.rangeSelectionState === "none" || s.rangeSelectionState === "selecting-start")
      s.startDate = e, s.endDate = null, s.rangeSelectionState = "selecting-end", s.focusedDate = e;
    else if (s.rangeSelectionState === "selecting-end") {
      const i = new Date(s.startDate);
      n < i ? (s.endDate = s.startDate, s.startDate = e) : s.endDate = e, s.rangeSelectionState = "none", s.focusedDate = e;
    }
    this.setState(t, s), this.renderCalendarGrid(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:rangeSelected", {
      startDate: s.startDate,
      endDate: s.endDate,
      formattedRange: this.formatRangeForDisplay(s.startDate, s.endDate)
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
  isDateInRange(t, e, s) {
    if (!e || !s) return !1;
    const n = new Date(t), i = new Date(e), a = new Date(s);
    return n >= i && n <= a;
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
    const s = this.getState(t);
    if (!s || s.isDisabled) return;
    const [n, i] = s.currentMonth.split("-").map(Number), a = new Date(n, i - 1, 1);
    e === "prev" ? a.setMonth(a.getMonth() - 1) : a.setMonth(a.getMonth() + 1);
    const o = `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}`;
    s.currentMonth = o, this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: o,
      year: a.getFullYear(),
      month: a.getMonth() + 1
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.getState(t);
    if (!s || s.isDisabled) return;
    const n = s.focusedDate;
    if (!n) return;
    let i = null;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault(), i = this.addDaysToDate(n, -1);
        break;
      case "ArrowRight":
        e.preventDefault(), i = this.addDaysToDate(n, 1);
        break;
      case "ArrowUp":
        e.preventDefault(), i = this.addDaysToDate(n, -7);
        break;
      case "ArrowDown":
        e.preventDefault(), i = this.addDaysToDate(n, 7);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.selectDate(t, n);
        return;
      case "Home":
        e.preventDefault(), i = this.getFirstDayOfMonth(n);
        break;
      case "End":
        e.preventDefault(), i = this.getLastDayOfMonth(n);
        break;
      case "PageUp":
        e.preventDefault(), i = this.addMonthsToDate(n, e.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        e.preventDefault(), i = this.addMonthsToDate(n, e.shiftKey ? 12 : 1);
        break;
    }
    i && this.focusDate(t, i);
  }
  /**
   * Generate calendar grid for a given month
   */
  generateCalendarGrid(t) {
    const e = this.getState(t);
    if (!e) return [];
    const [s, n] = e.currentMonth.split("-").map(Number), i = new Date(s, n - 1, 1), a = new Date(s, n, 0), o = new Date(i);
    o.setDate(o.getDate() - o.getDay());
    const l = new Date(a);
    l.setDate(l.getDate() + (6 - l.getDay()));
    const u = [], h = new Date(o);
    for (; h <= l; ) {
      const p = this.formatDateString(h), m = h.getMonth() === n - 1 && h.getFullYear() === s, y = {
        date: p,
        day: h.getDate(),
        isCurrentMonth: m,
        isToday: this.isToday(p),
        isSelected: p === e.selectedDate,
        isDisabled: this.isDateDisabled(t, h)
      };
      e.isRange && (y.isInRange = this.isDateInRange(p, e.startDate, e.endDate), y.isRangeStart = this.isDateRangeStart(p, e.startDate), y.isRangeEnd = this.isDateRangeEnd(p, e.endDate), y.isSelected = y.isRangeStart || y.isRangeEnd), u.push(y), h.setDate(h.getDate() + 1);
    }
    const g = [];
    for (let p = 0; p < u.length; p += 7)
      g.push(u.slice(p, p + 7));
    return g;
  }
  /**
   * Check if a date is disabled
   */
  isDateDisabled(t, e) {
    const s = this.getState(t);
    if (!s || s.isDisabled) return !0;
    const n = this.formatDateString(e);
    return s.minDate && n < s.minDate || s.maxDate && n > s.maxDate ? !0 : s.disabledDates.includes(n);
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
    const s = f.querySelector("[data-calendar-grid-container]", t);
    if (!s) return;
    const n = this.generateCalendarGrid(t);
    let i = '<table class="w-full" role="grid" aria-label="Calendar">';
    i += '<thead><tr role="row">', e.weekdays.forEach((a) => {
      const l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(a)];
      i += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${l}">${a}</th>`;
    }), i += "</tr></thead>", i += "<tbody>", n.forEach((a) => {
      i += '<tr role="row">', a.forEach((o) => {
        const l = this.getDayButtonClasses(o), u = rt.createDateAriaLabel(o.date, o.isToday, o.isSelected, o.isRangeStart, o.isRangeEnd, o.isInRange), h = this.getRangeAttributes(o, e);
        i += `
                    <td class="calendar-day text-center relative" role="gridcell">
                        <button type="button"
                                class="${l}"
                                data-calendar-date="${o.date}"
                                data-is-current-month="${o.isCurrentMonth}"
                                ${o.isDisabled ? "disabled" : ""}
                                aria-selected="${o.isSelected}"
                                aria-label="${u}"
                                data-is-today="${o.isToday}"
                                ${h}>
                            ${o.day}
                        </button>
                    </td>
                `;
      }), i += "</tr>";
    }), i += "</tbody></table>", s.innerHTML = i;
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
    const [s, n] = e.currentMonth.split("-").map(Number), a = `${e.monthNames[n - 1]} ${s}`, o = f.querySelector(".calendar-month-year-display", t);
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
    const s = f.querySelector("[data-calendar-grid-container]", t);
    if (!s) return;
    const [n, i] = e.currentMonth.split("-").map(Number);
    let a = '<div class="month-grid grid grid-cols-3 gap-1 p-2">';
    e.monthNames.forEach((o, l) => {
      const u = l + 1, h = u === i, g = this.isMonthDisabled(t, n, u);
      a += `
                <button type="button"
                        class="month-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${h ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${g ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-month="${u}"
                        ${g ? "disabled" : ""}>
                    ${o}
                </button>
            `;
    }), a += "</div>", this.animateViewTransition(s, a);
  }
  /**
   * Render year selection grid
   */
  renderYearGrid(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelector("[data-calendar-grid-container]", t);
    if (!s) return;
    const [n] = e.currentMonth.split("-").map(Number), i = n - 10, a = n + 10;
    let o = '<div class="year-grid grid grid-cols-4 gap-1 p-2 max-h-64 overflow-y-auto">';
    for (let l = i; l <= a; l++) {
      const u = l === n, h = this.isYearDisabled(t, l);
      o += `
                <button type="button"
                        class="year-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${u ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${h ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-year="${l}"
                        ${h ? "disabled" : ""}>
                    ${l}
                </button>
            `;
    }
    o += "</div>", s.innerHTML = o;
  }
  /**
   * Select a month
   */
  selectMonth(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const [n] = s.currentMonth.split("-").map(Number), i = `${n}-${String(e).padStart(2, "0")}`;
    s.currentMonth = i, s.viewMode = "calendar", this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: i,
      year: n,
      month: e
    });
  }
  /**
   * Select a year
   */
  selectYear(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const [, n] = s.currentMonth.split("-").map(Number), i = `${e}-${String(n).padStart(2, "0")}`;
    s.currentMonth = i, s.viewMode = "calendar", this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: i,
      year: e,
      month: n
    });
  }
  /**
   * Check if a month is disabled
   */
  isMonthDisabled(t, e, s) {
    const n = this.getState(t);
    if (!n) return !1;
    const i = `${e}-${String(s).padStart(2, "0")}-01`, a = new Date(e, s, 0).getDate(), o = `${e}-${String(s).padStart(2, "0")}-${String(a).padStart(2, "0")}`;
    return !!(n.minDate && o < n.minDate || n.maxDate && i > n.maxDate);
  }
  /**
   * Check if a year is disabled
   */
  isYearDisabled(t, e) {
    const s = this.getState(t);
    if (!s) return !1;
    const n = `${e}-01-01`, i = `${e}-12-31`;
    return !!(s.minDate && i < s.minDate || s.maxDate && n > s.maxDate);
  }
  /**
   * Focus a specific date
   */
  focusDate(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const [n, i] = e.split("-").map(Number), [a, o] = s.currentMonth.split("-").map(Number);
    if (n !== a || i !== o) {
      const l = `${n}-${String(i).padStart(2, "0")}`;
      s.currentMonth = l, this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
        currentMonth: l,
        year: n,
        month: i
      });
    }
    s.focusedDate = e, this.setState(t, s), _.createTimer(() => {
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
    const s = new Date(t);
    return s.setDate(s.getDate() + e), this.formatDateString(s);
  }
  /**
   * Utility: Add months to a date string
   */
  addMonthsToDate(t, e) {
    const s = new Date(t);
    return s.setMonth(s.getMonth() + e), this.formatDateString(s);
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
    t.style.opacity = "0.7", t.style.transform = "scale(0.98)", _.createTimer(() => {
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
  dispatchCalendarEvent(t, e, s = null) {
    w.dispatchCustomEvent(t, e, {
      calendar: t,
      ...s
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
    const s = this.getState(t);
    s && (s.selectedDate = e, e && (s.focusedDate = e), this.setState(t, s), this.updateCalendarDisplay(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:dateSelected", {
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
    const s = f.querySelectorAll("[data-calendar-grid-container]", t);
    if (s.length === 0) return;
    const n = /* @__PURE__ */ new Date(e.currentMonth + "-01");
    s.forEach((i, a) => {
      const o = new Date(n);
      o.setMonth(n.getMonth() + a);
      const l = {
        ...e,
        currentMonth: `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`
      }, u = this.generateCalendarGridForMonth(t, l, a, s.length);
      let h = `<div class="calendar-month-header">${e.monthNames[o.getMonth()]} ${o.getFullYear()}</div>`;
      h += '<table class="w-full" role="grid" aria-label="Calendar">', h += '<thead><tr role="row">', e.weekdays.forEach((g) => {
        const m = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(g)];
        h += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${m}">${g}</th>`;
      }), h += "</tr></thead>", h += "<tbody>", u.forEach((g) => {
        h += '<tr role="row">', g.forEach((p) => {
          const m = this.getDayButtonClasses(p), y = rt.createDateAriaLabel(p.date, p.isToday, p.isSelected, p.isRangeStart, p.isRangeEnd, p.isInRange), v = this.getRangeAttributes(p, e);
          h += `
                        <td class="calendar-day text-center relative" role="gridcell">
                            <button type="button"
                                    class="${m}"
                                    data-calendar-date="${p.date}"
                                    data-is-current-month="${p.isCurrentMonth}"
                                    ${p.isDisabled ? "disabled" : ""}
                                    aria-selected="${p.isSelected}"
                                    aria-label="${y}"
                                    data-is-today="${p.isToday}"
                                    ${v}>
                                ${p.day}
                            </button>
                        </td>
                    `;
        }), h += "</tr>";
      }), h += "</tbody></table>", i.innerHTML = h;
    });
  }
  /**
   * Generate calendar grid for a specific month
   */
  generateCalendarGridForMonth(t, e, s = 0, n = 1) {
    const i = this.getState(t);
    if (!i) return [];
    this.setState(t, { ...i, currentMonth: e.currentMonth });
    let a = this.generateCalendarGrid(t);
    return n > 1 && s < n - 1 && a[a.length - 1].some((u) => !u.isCurrentMonth && u.day <= 15) && (a = a.slice(0, -1)), this.setState(t, i), a;
  }
  /**
   * Get range attributes for a day button
   */
  getRangeAttributes(t, e) {
    if (!e.isRange) return "";
    const s = [];
    return t.isInRange && s.push('data-is-in-range="true"'), t.isRangeStart && s.push('data-is-range-start="true"'), t.isRangeEnd && s.push('data-is-range-end="true"'), s.join(" ");
  }
  /**
   * Update hidden input for range selection
   */
  updateHiddenInput(t) {
    const e = this.getState(t);
    if (e)
      if (e.isRange) {
        const s = f.querySelector(".calendar-start-input", t), n = f.querySelector(".calendar-end-input", t), i = f.querySelector(".calendar-range-input", t);
        if (s && (s.value = e.startDate || ""), n && (n.value = e.endDate || ""), i) {
          const a = e.startDate && e.endDate ? `${e.startDate},${e.endDate}` : e.startDate || "";
          i.value = a;
        }
      } else {
        const s = f.querySelector(".calendar-hidden-input", t);
        s && (s.value = e.selectedDate || "");
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
    const s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    this.isDateDisabled(t, /* @__PURE__ */ new Date()) || (this.navigateToToday(t), this.selectDate(t, s));
  }
  /**
   * Navigate calendar to show today's month
   */
  navigateToToday(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = /* @__PURE__ */ new Date(), n = `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`;
    e.currentMonth !== n && (e.currentMonth = n, this.setState(t, e), this.renderCalendarDisplay(t));
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
  Ke.getInstance().init();
}) : Ke.getInstance().init();
window.CalendarActions = Ke;
Ke.getInstance();
class Nr extends G {
  /**
   * Initialize radio elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("label[for]", (t) => {
      const e = t.getAttribute("for");
      if (!e) return;
      const s = f.getElementById(e);
      !s || s.type !== "radio" || this.focusRadioInput(s);
    }), w.handleDelegatedKeydown('input[type="radio"]', (t, e) => {
      w.createNavigationHandler({
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
    f.focus(t, 0), this.dispatchFocusEvent(t);
  }
  /**
   * Focus the next radio in the same group
   */
  focusNextRadio(t) {
    const e = this.getRadioGroup(t), n = (e.indexOf(t) + 1) % e.length, i = e[n];
    i && (i.focus(), i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(i));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(t) {
    const e = this.getRadioGroup(t), s = e.indexOf(t), n = s === 0 ? e.length - 1 : s - 1, i = e[n];
    i && (i.focus(), i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(i));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(t) {
    const e = t.name;
    return e ? Array.from(f.querySelectorAll(`input[type="radio"][name="${e}"]`)).filter((n) => !n.disabled) : [t];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(t) {
    w.dispatchCustomEvent(t, "radio-focus", {
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
    return w.addEventListener(document, "radio-focus", (e) => {
      t(e.detail.radio);
    });
  }
  /**
   * Clean up RadioActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Nr.getInstance();
class Ye extends G {
  /**
   * Initialize range elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("range", "true").forEach((t) => {
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
    const e = f.querySelector(".range-track", t);
    if (!e) return;
    const s = {
      min: parseFloat(e.dataset.min || "0"),
      max: parseFloat(e.dataset.max || "100"),
      step: parseFloat(e.dataset.step || "1"),
      dual: e.dataset.dual === "true",
      ticks: e.dataset.ticks ? JSON.parse(e.dataset.ticks) : [],
      disabled: e.dataset.disabled === "true"
    }, n = this.getElements(t, s);
    if (!n.track) return;
    const i = {
      minValue: s.dual ? parseFloat(((a = n.inputs.min) == null ? void 0 : a.value) || s.min.toString()) : s.min,
      maxValue: s.dual ? parseFloat(((o = n.inputs.max) == null ? void 0 : o.value) || s.max.toString()) : s.max,
      singleValue: s.dual ? s.min : parseFloat(((l = n.inputs.single) == null ? void 0 : l.value) || s.min.toString()),
      isDragging: !1,
      activeHandle: null
    };
    this.setState(t, { config: s, state: i, elements: n }), s.disabled || this.setupHandleInteractions(t, n);
  }
  /**
   * Get all relevant elements for a range component
   */
  getElements(t, e) {
    const s = f.querySelector(".range-track", t), n = f.querySelector(".range-fill", t), i = {}, a = {}, o = {}, l = {};
    return e.dual ? (i.min = f.querySelector('[data-handle="min"]', t), i.max = f.querySelector('[data-handle="max"]', t), a.min = f.querySelector('[data-native-input="min"]', t), a.max = f.querySelector('[data-native-input="max"]', t), o.min = f.querySelector('[data-range-input="min"]', t), o.max = f.querySelector('[data-range-input="max"]', t), l.min = f.querySelector('[data-value-display="min"]', t), l.max = f.querySelector('[data-value-display="max"]', t)) : (i.single = f.querySelector('[data-handle="single"]', t), a.single = f.querySelector('[data-native-input="single"]', t), o.single = f.querySelector('[data-range-input="single"]', t), l.single = f.querySelector('[data-value-display="single"]', t)), {
      container: t,
      track: s,
      fill: n,
      handles: i,
      inputs: a,
      hiddenInputs: o,
      valueDisplays: l
    };
  }
  /**
   * Set up handle interactions (mouse, touch, keyboard)
   */
  setupHandleInteractions(t, e) {
    const { handles: s } = e;
    Object.entries(s).forEach(([n, i]) => {
      i && (i.addEventListener("mousedown", (a) => this.handleStart(a, t, n)), i.addEventListener("touchstart", (a) => this.handleStart(a, t, n), { passive: !1 }), i.addEventListener("keydown", (a) => this.handleKeydown(a, t, n)), i.addEventListener("focus", () => this.handleFocus(t, n)), i.addEventListener("blur", () => this.handleBlur(t, n)));
    }), e.track.addEventListener("click", (n) => this.handleTrackClick(n, t));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.addEventListener(document, "mousemove", (t) => this.handleMove(t)), w.addEventListener(document, "mouseup", (t) => this.handleEnd(t)), w.addEventListener(document, "touchmove", (t) => this.handleMove(t), { passive: !1 }), w.addEventListener(document, "touchend", (t) => this.handleEnd(t)), w.addEventListener(document, "touchcancel", (t) => this.handleEnd(t));
  }
  /**
   * Setup dynamic observer for new ranges - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const s = e;
          f.hasDataAttribute(s, "range", "true") && this.initializeRange(s), f.findByDataAttribute("range", "true", s).forEach((n) => {
            this.initializeRange(n);
          });
        }
      });
    });
  }
  /**
   * Handle drag start
   */
  handleStart(t, e, s) {
    t.preventDefault();
    const n = this.getState(e);
    if (!n || n.config.disabled) return;
    n.state.isDragging = !0, n.state.activeHandle = s;
    const i = n.elements.handles[s];
    i && (i.classList.add("dragging"), i.focus()), e.classList.add("dragging"), document.body.style.userSelect = "none";
  }
  /**
   * Handle drag move
   */
  handleMove(t) {
    const e = Array.from(this.getAllStates().entries()).find(([p, m]) => m.state.isDragging);
    if (!e) return;
    t.preventDefault();
    const [s, n] = e, { config: i, state: a, elements: o } = n, l = "touches" in t ? t.touches[0].clientX : t.clientX, u = o.track.getBoundingClientRect(), h = Math.max(0, Math.min(1, (l - u.left) / u.width));
    let g = this.percentageToValue(h, i);
    g = this.snapToTickIfNeeded(g, i), this.updateValue(s, a.activeHandle, g);
  }
  /**
   * Handle drag end
   */
  handleEnd(t) {
    const e = Array.from(this.getAllStates().entries()).find(([a, o]) => o.state.isDragging);
    if (!e) return;
    const [s, n] = e;
    n.state.isDragging = !1;
    const i = n.elements.handles[n.state.activeHandle];
    i && i.classList.remove("dragging"), s.classList.remove("dragging"), n.state.activeHandle = null, document.body.style.userSelect = "", this.dispatchChangeEvent(s);
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e, s) {
    const n = this.getState(e);
    if (!n || n.config.disabled) return;
    const { config: i, state: a } = n;
    let o = !1, l;
    const u = s === "min" ? a.minValue : s === "max" ? a.maxValue : a.singleValue;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowDown":
        l = Math.max(i.min, u - i.step), o = !0;
        break;
      case "ArrowRight":
      case "ArrowUp":
        l = Math.min(i.max, u + i.step), o = !0;
        break;
      case "PageDown":
        l = Math.max(i.min, u - i.step * 10), o = !0;
        break;
      case "PageUp":
        l = Math.min(i.max, u + i.step * 10), o = !0;
        break;
      case "Home":
        l = i.min, o = !0;
        break;
      case "End":
        l = i.max, o = !0;
        break;
    }
    o && (t.preventDefault(), l = this.snapToTickIfNeeded(l, i), this.updateValue(e, s, l), this.dispatchChangeEvent(e));
  }
  /**
   * Handle track click to jump to position
   */
  handleTrackClick(t, e) {
    const s = this.getState(e);
    if (!s || s.config.disabled) return;
    const { config: n, state: i } = s, a = s.elements.track.getBoundingClientRect(), o = (t.clientX - a.left) / a.width;
    let l = this.percentageToValue(o, n);
    if (l = this.snapToTickIfNeeded(l, n), n.dual) {
      const u = Math.abs(l - i.minValue), h = Math.abs(l - i.maxValue), g = u <= h ? "min" : "max";
      this.updateValue(e, g, l);
    } else
      this.updateValue(e, "single", l);
    this.dispatchChangeEvent(e);
  }
  /**
   * Update a handle's value and visual position
   */
  updateValue(t, e, s) {
    const n = this.getState(t);
    if (!n) return;
    const { config: i, state: a, elements: o } = n;
    i.dual ? e === "min" ? (s = Math.min(s, a.maxValue), a.minValue = s) : e === "max" && (s = Math.max(s, a.minValue), a.maxValue = s) : a.singleValue = s, this.updateVisualElements(t), this.updateFormInputs(t), this.dispatchInputEvent(t);
  }
  /**
   * Update visual elements (handles, fill, value displays)
   */
  updateVisualElements(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: n, elements: i } = e;
    if (s.dual) {
      const a = this.valueToPercentage(n.minValue, s), o = this.valueToPercentage(n.maxValue, s);
      i.handles.min && (i.handles.min.style.left = `${a}%`, i.handles.min.setAttribute("aria-valuenow", n.minValue.toString()), i.handles.min.setAttribute("aria-valuetext", n.minValue.toString())), i.handles.max && (i.handles.max.style.left = `${o}%`, i.handles.max.setAttribute("aria-valuenow", n.maxValue.toString()), i.handles.max.setAttribute("aria-valuetext", n.maxValue.toString())), i.fill.style.left = `${a}%`, i.fill.style.width = `${o - a}%`, i.valueDisplays.min && (i.valueDisplays.min.textContent = n.minValue.toString()), i.valueDisplays.max && (i.valueDisplays.max.textContent = n.maxValue.toString());
    } else {
      const a = this.valueToPercentage(n.singleValue, s);
      i.handles.single && (i.handles.single.style.left = `${a}%`, i.handles.single.setAttribute("aria-valuenow", n.singleValue.toString()), i.handles.single.setAttribute("aria-valuetext", n.singleValue.toString())), i.fill.style.width = `${a}%`, i.valueDisplays.single && (i.valueDisplays.single.textContent = n.singleValue.toString());
    }
  }
  /**
   * Update form inputs for submission
   */
  updateFormInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: n, elements: i } = e;
    s.dual ? (i.inputs.min && (i.inputs.min.value = n.minValue.toString()), i.inputs.max && (i.inputs.max.value = n.maxValue.toString()), i.hiddenInputs.min && (i.hiddenInputs.min.value = n.minValue.toString()), i.hiddenInputs.max && (i.hiddenInputs.max.value = n.maxValue.toString())) : (i.inputs.single && (i.inputs.single.value = n.singleValue.toString()), i.hiddenInputs.single && (i.hiddenInputs.single.value = n.singleValue.toString()));
  }
  /**
   * Convert percentage to value
   */
  percentageToValue(t, e) {
    const s = e.max - e.min;
    let n = e.min + t * s;
    return n = Math.round(n / e.step) * e.step, Math.max(e.min, Math.min(e.max, n));
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
    let s = e.ticks[0], n = Math.abs(t - s);
    for (const i of e.ticks) {
      const a = Math.abs(t - i);
      a < n && (s = i, n = a);
    }
    return s;
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
    const { config: s, state: n } = e, i = s.dual ? [n.minValue, n.maxValue] : n.singleValue;
    w.dispatchCustomEvent(t, "range-input", {
      value: i,
      dual: s.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), s.dual ? ((a = e.elements.hiddenInputs.min) == null || a.dispatchEvent(new Event("input", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("input", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  /**
   * Dispatch change event when interaction is complete
   */
  dispatchChangeEvent(t) {
    var a, o, l;
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: n } = e, i = s.dual ? [n.minValue, n.maxValue] : n.singleValue;
    w.dispatchCustomEvent(t, "range-change", {
      value: i,
      dual: s.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), s.dual ? ((a = e.elements.hiddenInputs.min) == null || a.dispatchEvent(new Event("change", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("change", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Get current value for a range component
   */
  getValue(t) {
    const e = this.getState(t);
    if (!e) return null;
    const { config: s, state: n } = e;
    return s.dual ? [n.minValue, n.maxValue] : n.singleValue;
  }
  /**
   * Set value for a range component
   */
  setValue(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const { config: n } = s;
    n.dual && Array.isArray(e) ? (this.updateValue(t, "min", e[0]), this.updateValue(t, "max", e[1])) : !n.dual && typeof e == "number" && this.updateValue(t, "single", e), this.dispatchChangeEvent(t);
  }
  /**
   * Destroy range component
   */
  destroy(t) {
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
  Ye.getInstance().init();
}) : Ye.getInstance().init();
window.RangeActions = Ye;
Ye.getInstance();
class kr extends G {
  /**
   * Initialize select elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("select", "true").forEach((t) => {
      this.initializeSelect(t);
    });
  }
  /**
   * Initialize a single select element
   */
  initializeSelect(t) {
    const e = t.dataset.multiple === "true", s = t.dataset.value;
    let n = [];
    if (s)
      try {
        n = e ? JSON.parse(s) : [s];
      } catch {
        n = e ? [] : [s];
      }
    const i = {
      isOpen: !1,
      selectedValues: n,
      searchTerm: "",
      focusedIndex: -1,
      filteredOptions: []
    };
    this.setState(t, i), this.updateOptions(t), this.updateOptionsSelectedState(t), this.updateDisplay(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]", (t, e) => {
      if (t.matches("[data-remove-chip]")) {
        e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
        const s = t.dataset.removeChip, n = f.findClosest(t, '[data-select="true"]');
        n && s && this.removeChip(n, s);
        return;
      }
      if (t.matches("[data-select-clear]")) {
        e.preventDefault(), e.stopPropagation();
        const s = f.findClosest(t, '[data-select="true"]');
        s && this.clearSelection(s);
        return;
      }
      if (t.matches("[data-select-option]")) {
        e.preventDefault(), e.stopPropagation();
        const s = f.findClosest(t, '[data-select="true"]');
        s && this.selectOption(s, t);
        return;
      }
      if (t.matches("[data-select-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const s = f.findClosest(t, '[data-select="true"]');
        s && !this.isDisabled(s) && this.toggleDropdown(s);
        return;
      }
      if (t.matches("[data-select-search]")) {
        e.stopPropagation();
        return;
      }
    }), w.addEventListener(document, "click", (t) => {
      var s;
      const e = t.target;
      if (e && e instanceof Element) {
        const n = (s = e.closest("[data-select-search]")) == null ? void 0 : s.parentElement;
        if (n && f.querySelector("[data-select-search]", n)) {
          t.stopPropagation();
          return;
        }
        e.closest("[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]") || this.closeAllDropdowns();
      }
    }), w.handleDelegatedInput("[data-select-search]", (t, e) => {
      const s = f.findClosest(t, '[data-select="true"]');
      s && this.handleSearch(s, t.value);
    }), w.handleDelegatedKeydown('[data-select="true"]', (t, e) => {
      this.handleKeydown(t, e);
    }), w.handleDelegatedFocus('[data-select="true"]', (t, e) => {
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
          const s = e;
          f.hasDataAttribute(s, "select", "true") && (this.hasState(s) || this.initializeSelect(s)), f.findByDataAttribute("select", "true", s).forEach((i) => {
            this.hasState(i) || this.initializeSelect(i);
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
    const s = f.querySelector("[data-select-dropdown]", t), n = f.querySelector("[data-select-trigger]", t), i = f.querySelector("[data-select-search]", t);
    if (s && (s.classList.remove("hidden"), this.positionDropdown(t)), n) {
      n.setAttribute("aria-expanded", "true");
      const a = f.querySelector(".select-arrow", n);
      a && a.classList.add("rotate-180");
    }
    i && t.dataset.searchable === "true" && _.createTimer(() => i.focus(), 10), this.updateFilteredOptions(t), this.dispatchSelectEvent(t, "select:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    e.isOpen = !1, e.searchTerm = "", e.focusedIndex = -1, this.setState(t, e);
    const s = f.querySelector("[data-select-dropdown]", t), n = f.querySelector("[data-select-trigger]", t), i = f.querySelector("[data-select-search]", t);
    if (s && s.classList.add("hidden"), n) {
      n.setAttribute("aria-expanded", "false");
      const a = f.querySelector(".select-arrow", n);
      a && a.classList.remove("rotate-180");
    }
    i && (i.value = ""), this.handleSearch(t, ""), this.dispatchSelectEvent(t, "select:close");
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
    const s = this.getState(t), n = e.dataset.value;
    if (!s || !n || e.getAttribute("aria-disabled") === "true")
      return;
    const i = t.dataset.multiple === "true";
    if (i) {
      const a = s.selectedValues.indexOf(n);
      a > -1 ? s.selectedValues.splice(a, 1) : s.selectedValues.push(n);
    } else
      s.selectedValues = [n], this.closeDropdown(t);
    this.setState(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: i ? s.selectedValues : n,
      selectedValues: s.selectedValues
    });
  }
  /**
   * Remove chip (for multiple selection)
   */
  removeChip(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const n = s.selectedValues.indexOf(e);
    n > -1 && (s.selectedValues.splice(n, 1), this.setState(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: s.selectedValues,
      selectedValues: s.selectedValues
    }));
  }
  /**
   * Clear all selections
   */
  clearSelection(t) {
    const e = this.getState(t);
    e && (e.selectedValues = [], this.setState(t, e), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: t.dataset.multiple === "true" ? [] : "",
      selectedValues: []
    }));
  }
  /**
   * Handle search functionality
   */
  handleSearch(t, e) {
    const s = this.getState(t);
    s && (s.searchTerm = e.toLowerCase(), this.setState(t, s), this.updateFilteredOptions(t), this.updateOptionsVisibility(t));
  }
  /**
   * Update filtered options based on search term
   */
  updateFilteredOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = this.getAllOptions(t);
    e.searchTerm ? e.filteredOptions = s.filter(
      (n) => n.searchableText.includes(e.searchTerm)
    ) : e.filteredOptions = s, this.setState(t, e);
  }
  /**
   * Update options visibility based on filter
   */
  updateOptionsVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelectorAll("[data-select-option]", t), n = f.querySelector("[data-select-no-results]", t);
    let i = 0;
    s.forEach((a) => {
      const o = a, l = o.dataset.value || "";
      e.filteredOptions.some((h) => h.value === l) ? (o.style.display = "", i++) : o.style.display = "none";
    }), n && (i === 0 && e.searchTerm ? n.classList.remove("hidden") : n.classList.add("hidden"));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.getState(t);
    if (s)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!s.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (s.focusedIndex >= 0) {
            e.preventDefault();
            const n = s.filteredOptions[s.focusedIndex];
            n && this.selectOption(t, n.element);
          }
          break;
        case "Escape":
          if (s.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const n = f.querySelector("[data-select-trigger]", t);
            n && n.focus();
          }
          break;
        case "ArrowDown":
          s.isOpen ? (e.preventDefault(), this.navigateOptions(t, 1)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "ArrowUp":
          s.isOpen && (e.preventDefault(), this.navigateOptions(t, -1));
          break;
        case "Tab":
          s.isOpen && this.closeDropdown(t);
          break;
      }
  }
  /**
   * Navigate through options with arrow keys
   */
  navigateOptions(t, e) {
    const s = this.getState(t);
    if (!s || !s.isOpen) return;
    const n = s.filteredOptions.length;
    n !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = e > 0 ? 0 : n - 1 : (s.focusedIndex += e, s.focusedIndex >= n ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = n - 1)), this.setState(t, s), this.updateOptionFocus(t));
  }
  /**
   * Update visual focus state of options
   */
  updateOptionFocus(t) {
    const e = this.getState(t);
    if (!e) return;
    f.querySelectorAll("[data-select-option]", t).forEach((n, i) => {
      const a = n;
      i === e.focusedIndex ? (a.classList.add("bg-neutral-100", "dark:bg-neutral-800"), a.scrollIntoView({ block: "nearest" })) : a.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update display of selected values
   */
  updateDisplay(t) {
    if (!this.getState(t)) return;
    t.dataset.multiple === "true" ? this.updateChipsDisplay(t) : this.updateSingleValueDisplay(t);
  }
  /**
   * Update chips display for multiple selection using Badge components
   */
  updateChipsDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelector("[data-select-chips]", t);
    if (s)
      if (s.innerHTML = "", e.selectedValues.length === 0) {
        const n = t.dataset.placeholder || "Select options...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${n}</span>`;
      } else
        e.selectedValues.forEach((n) => {
          const i = this.findOptionByValue(t, n), a = i ? i.displayLabel : n, o = t.dataset.clearable === "true" && !this.isDisabled(t), l = `select-chip-${this.generateChipId(n)}`, u = document.createElement("button");
          u.type = "button", u.className = "inline-flex items-center gap-1 font-medium cursor-pointer transition-colors px-1.5 py-0.5 text-xs rounded-sm", u.style.cssText = `
                    background-color: var(--color-brand-50);
                    color: var(--color-brand-700);
                    border: 1px solid var(--color-brand-200);
                `, u.setAttribute("data-chip-value", n), u.setAttribute("data-remove-chip", n), u.setAttribute("data-dismiss-target", `#${l}`), u.setAttribute("aria-label", "Remove badge"), u.id = l, u.addEventListener("mouseenter", () => {
            u.style.backgroundColor = "var(--color-brand-100)";
          }), u.addEventListener("mouseleave", () => {
            u.style.backgroundColor = "var(--color-brand-50)";
          });
          const h = document.createElement("span");
          if (h.textContent = a, u.appendChild(h), o) {
            const g = document.createElement("span");
            g.className = "text-brand-600 hover:text-brand-700 ml-1 flex-shrink-0 font-bold leading-none", g.textContent = "×", g.setAttribute("aria-hidden", "true"), u.appendChild(g);
            const p = document.createElement("span");
            p.className = "sr-only", p.textContent = "Remove badge", u.appendChild(p);
          }
          s.appendChild(u);
        });
  }
  /**
   * Update single value display
   */
  updateSingleValueDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelector(".select-value", t);
    if (s)
      if (e.selectedValues.length === 0) {
        const n = t.dataset.placeholder || "Select option...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${n}</span>`;
      } else {
        const n = e.selectedValues[0], i = this.findOptionByValue(t, n), a = i ? i.displayLabel : n;
        s.textContent = a;
      }
  }
  /**
   * Update hidden form inputs
   */
  updateHiddenInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = t.dataset.multiple === "true", n = t.dataset.name;
    if (!n) return;
    if (f.querySelectorAll(".select-hidden-input", t).forEach((a) => a.remove()), s)
      e.selectedValues.forEach((a) => {
        const o = document.createElement("input");
        o.type = "hidden", o.name = `${n}[]`, o.value = a, o.className = "select-hidden-input", t.appendChild(o);
      });
    else {
      const a = document.createElement("input");
      a.type = "hidden", a.name = n, a.value = e.selectedValues[0] || "", a.className = "select-hidden-input", t.appendChild(a);
    }
  }
  /**
   * Update options selected state attributes
   */
  updateOptionsSelectedState(t) {
    const e = this.getState(t);
    if (!e) return;
    f.querySelectorAll("[data-select-option]", t).forEach((n) => {
      var l, u, h, g;
      const i = n, a = i.dataset.value || "", o = e.selectedValues.includes(a);
      if (i.setAttribute("aria-selected", o ? "true" : "false"), o) {
        i.classList.add("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const p = f.querySelector(".text-brand-600", i);
        p && ((l = p.parentElement) == null || l.classList.remove("opacity-0"), (u = p.parentElement) == null || u.classList.add("opacity-100"));
      } else {
        i.classList.remove("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const p = f.querySelector(".text-brand-600", i);
        p && ((h = p.parentElement) == null || h.classList.add("opacity-0"), (g = p.parentElement) == null || g.classList.remove("opacity-100"));
      }
    });
  }
  /**
   * Update options list
   */
  updateOptions(t) {
    const e = this.getAllOptions(t), s = this.getState(t);
    s && (s.filteredOptions = e, this.setState(t, s));
  }
  /**
   * Get all options from select element
   */
  getAllOptions(t) {
    const e = f.querySelectorAll("[data-select-option]", t);
    return Array.from(e).map((s) => {
      var a, o;
      const n = s, i = n.dataset.displayLabel || ((a = n.textContent) == null ? void 0 : a.trim()) || "";
      return {
        element: n,
        value: n.dataset.value || "",
        label: ((o = n.textContent) == null ? void 0 : o.trim()) || "",
        displayLabel: i,
        searchableText: n.dataset.searchableText || "",
        disabled: n.getAttribute("aria-disabled") === "true"
      };
    });
  }
  /**
   * Find option by value
   */
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((n) => n.value === e) || null;
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = f.querySelector("[data-select-dropdown]", t), s = f.querySelector("[data-select-trigger]", t);
    if (!e || !s) return;
    const n = s.getBoundingClientRect(), i = e.getBoundingClientRect(), o = window.innerHeight - n.bottom, l = n.top, u = i.height || 240;
    o < u && l > u ? (e.style.bottom = "100%", e.style.top = "auto", e.style.marginBottom = "4px", e.style.marginTop = "0") : (e.style.top = "100%", e.style.bottom = "auto", e.style.marginTop = "4px", e.style.marginBottom = "0");
  }
  /**
   * Reposition all open dropdowns
   */
  repositionDropdowns() {
    this.getAllStates().forEach((t, e) => {
      t.isOpen && this.positionDropdown(e);
    });
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
   * Generate unique chip ID for a value
   */
  generateChipId(t) {
    return btoa(t).replace(/[^a-zA-Z0-9]/g, "").substring(0, 8) + Date.now().toString(36);
  }
  /**
   * Dispatch custom select event
   */
  dispatchSelectEvent(t, e, s = null) {
    w.dispatchCustomEvent(t, e, {
      select: t,
      ...s
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
    const s = this.getState(t);
    if (!s) return;
    const n = t.dataset.multiple === "true";
    s.selectedValues = n ? e : e.slice(0, 1), this.setState(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: n ? s.selectedValues : s.selectedValues[0] || "",
      selectedValues: s.selectedValues
    });
  }
  /**
   * Clean up SelectActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
kr.getInstance();
class qr extends G {
  constructor() {
    super(...arguments), this.resizeCleanup = null;
  }
  /**
   * Initialize tabs elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("tabs", "true").forEach((t) => {
      this.initializeTabsElement(t);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(t) {
    const e = t.dataset.orientation || "horizontal", s = t.dataset.variant || "default", n = t.dataset.disabled === "true", i = t.dataset.value, a = Array.from(f.querySelectorAll('[data-tabs-trigger="true"]', t)), o = Array.from(f.querySelectorAll('[data-tabs-panel="true"]', t));
    let l = i || null;
    if (!l && a.length > 0) {
      const h = a.find((g) => g.getAttribute("aria-disabled") !== "true");
      l = (h == null ? void 0 : h.dataset.value) || null;
    }
    const u = {
      activeTab: l,
      tabs: a,
      panels: o,
      orientation: e,
      variant: s,
      disabled: n
    };
    this.setState(t, u), this.updateTabsState(t), this.initializeMarker(t), t.classList.add("tabs-initialized");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick('[data-tabs-trigger="true"]', (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-tabs="true"]');
      s && t.getAttribute("aria-disabled") !== "true" && this.activateTab(s, t.dataset.value || "");
    }), w.handleDelegatedKeydown('[data-tabs-trigger="true"]', (t, e) => {
      const s = f.findClosest(t, '[data-tabs="true"]');
      s && this.handleKeydown(s, e);
    }), this.resizeCleanup = w.handleResize(() => {
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
          const s = e;
          f.hasDataAttribute(s, "tabs", "true") && (this.hasState(s) || this.initializeTabsElement(s)), f.findByDataAttribute("tabs", "true", s).forEach((i) => {
            this.hasState(i) || this.initializeTabsElement(i);
          });
        }
      });
    });
  }
  /**
   * Activate a specific tab
   */
  activateTab(t, e, s = !1) {
    const n = this.getState(t);
    if (!n || n.disabled) return;
    const i = n.tabs.find((o) => o.dataset.value === e);
    if (!i || i.getAttribute("aria-disabled") === "true")
      return;
    const a = n.activeTab;
    n.activeTab = e, this.setState(t, n), this.updateTabsState(t), this.repositionMarker(t, i), s && i.focus(), w.dispatchCustomEvent(t, "tabs:change", {
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
    e && (e.tabs.forEach((s) => {
      const n = s.dataset.value === e.activeTab, i = s.getAttribute("aria-disabled") === "true";
      s.setAttribute("aria-selected", n ? "true" : "false"), s.setAttribute("data-state", n ? "active" : "inactive"), i ? s.setAttribute("tabindex", "-1") : n ? s.setAttribute("tabindex", "0") : s.setAttribute("tabindex", "-1"), s.id = `tab-${s.dataset.value}`;
    }), e.panels.forEach((s) => {
      const n = s.dataset.value === e.activeTab;
      s.setAttribute("data-state", n ? "active" : "inactive"), s.style.display = n ? "block" : "none", s.setAttribute("aria-labelledby", `tab-${s.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.getState(t);
    if (!s || s.disabled) return;
    const n = e.target, i = s.tabs.indexOf(n);
    let a = -1;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault(), a = s.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(s, i) : e.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(s, i) : i;
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault(), a = s.orientation === "horizontal" ? this.getNextEnabledTabIndex(s, i) : e.key === "ArrowDown" ? this.getNextEnabledTabIndex(s, i) : i;
        break;
      case "Home":
        e.preventDefault(), a = this.getFirstEnabledTabIndex(s);
        break;
      case "End":
        e.preventDefault(), a = this.getLastEnabledTabIndex(s);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), n.dataset.value && this.activateTab(t, n.dataset.value, !0);
        return;
    }
    if (a >= 0 && a < s.tabs.length) {
      const o = s.tabs[a];
      o.dataset.value && this.activateTab(t, o.dataset.value, !0);
    }
  }
  /**
   * Get next enabled tab index
   */
  getNextEnabledTabIndex(t, e) {
    for (let s = 1; s < t.tabs.length; s++) {
      const n = (e + s) % t.tabs.length;
      if (t.tabs[n].getAttribute("aria-disabled") !== "true")
        return n;
    }
    return e;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(t, e) {
    for (let s = 1; s < t.tabs.length; s++) {
      const n = (e - s + t.tabs.length) % t.tabs.length;
      if (t.tabs[n].getAttribute("aria-disabled") !== "true")
        return n;
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
  setActiveTab(t, e, s = !1) {
    this.activateTab(t, e, s);
  }
  /**
   * Initialize marker position for the active tab
   */
  initializeMarker(t) {
    const e = this.getState(t);
    if (!e || !e.activeTab) return;
    const s = e.tabs.find((n) => n.dataset.value === e.activeTab);
    s && _.createTimer(() => {
      this.repositionMarker(t, s);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const n = f.querySelector('[data-tab-marker="true"]', t);
    if (!n) return;
    const { orientation: i, variant: a } = s;
    i === "vertical" ? this.repositionVerticalMarker(n, e, a) : this.repositionHorizontalMarker(n, e, a);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(t, e, s) {
    const n = e.offsetWidth, i = e.offsetLeft;
    if (t.style.width = `${n}px`, s === "pills") {
      const a = e.offsetHeight, o = e.offsetTop;
      t.style.height = `${a}px`, t.style.transform = `translate(${i}px, ${o}px)`;
    } else
      t.style.transform = `translateX(${i}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(t, e, s) {
    const n = e.offsetHeight, i = e.offsetTop;
    if (t.style.height = `${n}px`, s === "pills") {
      const a = e.offsetWidth, o = e.offsetLeft;
      t.style.width = `${a}px`, t.style.transform = `translate(${o}px, ${i}px)`;
    } else
      t.style.transform = `translateY(${i}px)`;
  }
  /**
   * Handle window resize - reposition all markers
   */
  handleResize() {
    this.getAllStates().forEach((t, e) => {
      if (t.activeTab) {
        const s = t.tabs.find((n) => n.dataset.value === t.activeTab);
        s && this.repositionMarker(e, s);
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
qr.getInstance();
class Or extends G {
  /**
   * Initialize modal elements - required by BaseActionClass
   */
  initializeElements() {
    f.querySelectorAll("dialog[data-modal]").forEach((t) => {
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
      lastFocusedElement: null,
      isAnimating: !1
    };
    this.setState(t, e), t.addEventListener("close", () => {
      this.handleModalClose(t);
    }), t.addEventListener("cancel", (s) => {
      this.handleModalCancel(t, s);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[commandfor]", (t, e) => {
      const s = t.getAttribute("command"), n = t.getAttribute("commandfor");
      if (s === "show-modal" && n) {
        const i = f.getElementById(n);
        i && i.matches("dialog[data-modal]") && this.handleModalOpen(i, t);
      }
    }), w.handleDelegatedClick("[data-modal-close]", (t, e) => {
      const s = f.findClosest(t, "dialog[data-modal]");
      s && s.close();
    });
  }
  /**
   * Setup dynamic observer for new modals - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const s = e;
          s.matches && s.matches("dialog[data-modal]") && this.initializeModal(s), f.querySelectorAll("dialog[data-modal]", s).forEach((i) => {
            this.initializeModal(i);
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
    const e = f.querySelector("[autofocus]", t);
    if (e) {
      e.focus();
      return;
    }
    const s = t.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    s.length > 0 && s[0].focus();
  }
  /**
   * Check if a modal is open
   */
  isModalOpen(t) {
    const e = f.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(t, e, s = {}) {
    w.dispatchCustomEvent(t, e, {
      modal: t,
      ...s
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Get modal state (for external access)
   */
  getModalState(t) {
    const e = f.getElementById(t);
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
    var i;
    const s = f.getElementById(t);
    if (!s) return;
    const n = s.getAttribute("wire:model");
    if (n && typeof window.Livewire < "u" && window.Livewire.find) {
      const a = (i = f.findClosest(s, "[wire\\:id]")) == null ? void 0 : i.getAttribute("wire:id");
      if (a) {
        const o = window.Livewire.find(a);
        o && o.set(n, e);
      }
    }
  }
  /**
   * Toggle a modal's open state
   */
  toggleModal(t) {
    const e = f.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : e.open ? this.closeModal(t) : this.openModal(t);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    f.querySelectorAll("dialog[data-modal][open]").forEach((t) => {
      t.id && this.closeModal(t.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(t, e) {
    const s = f.getElementById(t);
    return !s || !s.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (this.handleModalOpen(s, e), s.showModal(), this.dispatchLivewireEvent("modalOpened", { id: t, modal: t }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(t) {
    const e = f.getElementById(t);
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
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !1), e.lastFocusedElement && document.contains(e.lastFocusedElement) && e.lastFocusedElement.focus(), e.lastFocusedElement = null, e.isAnimating = !1, this.setState(t, e), this.dispatchModalEvent(t, "modal:close"), this.dispatchLivewireEvent("modalClosed", { id: t.id, modal: t.id });
  }
  /**
   * Handle modal opening with Livewire integration
   */
  handleModalOpen(t, e) {
    const s = this.getState(t);
    if (!s) return;
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !0), s.lastFocusedElement = e || document.activeElement, this.setState(t, s), this.dispatchModalEvent(t, "modal:open", { trigger: e }), this.dispatchLivewireEvent("modalOpened", { id: t.id, modal: t.id }), setTimeout(() => {
      this.setInitialFocus(t);
    }, 50);
  }
  /**
   * Clean up ModalActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Or.getInstance();
class We extends G {
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
    w.handleDelegatedClick("[data-toast-dismiss]", (t, e) => {
      const s = t.getAttribute("data-toast-dismiss");
      s && (e.preventDefault(), e.stopPropagation(), this.dismiss(s));
    }), w.handleDelegatedClick("[data-toast-action]", (t, e) => {
      const s = t.getAttribute("data-toast-action"), n = f.findClosest(t, '[data-toast="true"]');
      s && n && (e.preventDefault(), e.stopPropagation(), this.dispatchToastEvent("toast:action", n.id, { action: s }));
    }), w.handleDelegatedEvent("mouseenter", '[data-toast="true"]', (t) => {
      this.pauseTimer(t.id);
    }), w.handleDelegatedEvent("mouseleave", '[data-toast="true"]', (t) => {
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
          const s = e;
          f.hasDataAttribute(s, "toast-container") && this.discoverToasts(), f.findByDataAttribute("toast-container").forEach(() => {
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
    t && f.findByDataAttribute("toast-container").forEach((e) => {
      const s = e.getAttribute("data-toast-container");
      s && t.containers.set(s, e);
    });
  }
  /**
   * Get global toast state
   */
  getGlobalState() {
    return this.getState(document.documentElement);
  }
  /**
   * Register a toast element for management
   */
  registerToast(t, e) {
    const s = this.getGlobalState();
    s && (s.toasts.set(t, e), this.setupToastListeners(e));
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
    const s = this.getGlobalState();
    if (!s) return !1;
    const n = e.position || "top-right", i = s.containers.get(n);
    if (!i)
      return !1;
    const a = `toast-${t}-${n}-${++s.toastCounter}`, o = this.createToastElement(a, t, n, e);
    i.appendChild(o), _.fadeIn(o, {
      scale: !0,
      duration: 300,
      onComplete: () => {
        o.setAttribute("data-toast-visible", "true");
      }
    });
    const l = e.duration || 5e3;
    return !(e.persistent === !0) && l > 0 && this.setTimer(a, l), s.toasts.set(a, o), this.setupToastListeners(o), this.dispatchToastEvent("toast:show", a, e), !0;
  }
  /**
   * Create a toast element dynamically
   */
  createToastElement(t, e, s, n) {
    const i = e === "error" ? "danger" : e, a = document.createElement("div");
    return a.className = "pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2", a.setAttribute("data-toast", "true"), a.setAttribute("data-toast-variant", e), a.setAttribute("data-toast-position", s), a.setAttribute("data-toast-visible", "false"), a.setAttribute("role", "alert"), a.setAttribute("aria-live", "polite"), a.id = t, a.innerHTML = `
            <div class="rounded-lg border p-4 space-y-3 ${this.getVariantClasses(i)}" role="alert" data-dismissible="true">
                <div class="flex">
                    <div class="flex-shrink-0 mt-1">
                        <svg class="w-5 h-5 ${this.getIconColor(i)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${this.getIconPath(i)}
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
                        <button type="button" class="inline-flex items-center justify-center rounded-md bg-transparent p-1.5 text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${this.getIconColor(i)}" data-toast-dismiss="${t}" aria-label="Dismiss">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="sr-only">Dismiss</span>
                        </button>
                    </div>
                </div>
            </div>
        `, this.updateToastContent(a, n), a;
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
    const s = e.toasts.get(t);
    return s ? (this.clearTimer(t), e.pausedTimers.delete(t), s.setAttribute("data-toast-visible", "false"), s.setAttribute("data-toast-exiting", "true"), _.fadeOut(s, {
      scale: !0,
      duration: 300,
      onComplete: () => {
        s.parentNode && s.parentNode.removeChild(s), e.toasts.delete(t);
      }
    }), this.dispatchToastEvent("toast:dismiss", t), !0) : !1;
  }
  /**
   * Dismiss all visible toasts
   */
  dismissAll() {
    const t = this.getGlobalState();
    t && t.toasts.forEach((e, s) => {
      e.getAttribute("data-toast-visible") === "true" && this.dismiss(s);
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
    const s = f.querySelector("[data-toast-title]", t), n = f.querySelector("[data-toast-message]", t), i = f.querySelector("[data-toast-actions]", t);
    s && e.title ? (s.textContent = e.title, s.classList.remove("hidden")) : s && s.classList.add("hidden"), n && e.message && (n.textContent = e.message), i && e.actions ? (i.innerHTML = e.actions, i.classList.remove("hidden")) : i && i.classList.add("hidden"), t.setAttribute("data-toast-duration", String(e.duration || 5e3)), t.setAttribute("data-toast-persistent", String(e.persistent === !0));
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(t) {
    const e = f.querySelector("[data-toast-title]", t), s = f.querySelector("[data-toast-message]", t), n = f.querySelector("[data-toast-actions]", t);
    e && (e.textContent = "", e.classList.add("hidden")), s && (s.textContent = ""), n && (n.innerHTML = "", n.classList.add("hidden")), t.removeAttribute("data-toast-duration"), t.removeAttribute("data-toast-persistent");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(t, e) {
    const s = this.getGlobalState();
    if (!s) return;
    this.clearTimer(t);
    const n = s.toasts.get(t);
    n && n.setAttribute("data-toast-start-time", String(Date.now()));
    const i = _.createTimer(() => {
      this.dismiss(t);
    }, e);
    s.timers.set(t, i);
  }
  /**
   * Clear timer
   */
  clearTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const s = e.timers.get(t);
    s && (_.clearTimer(s), e.timers.delete(t));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const s = e.timers.get(t), n = e.toasts.get(t);
    if (s && n) {
      _.pauseTimer(s);
      const i = parseInt(n.getAttribute("data-toast-duration") || "5000"), a = parseInt(n.getAttribute("data-toast-start-time") || "0"), o = Date.now() - a, l = Math.max(0, i - o);
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
    const s = e.toasts.get(t), n = e.timers.get(t), i = e.pausedTimers.get(t);
    s && n ? s.getAttribute("data-toast-persistent") === "true" || (_.resumeTimer(n), e.pausedTimers.delete(t)) : s && i && !(s.getAttribute("data-toast-persistent") === "true") && i.remaining > 0 && (this.setTimer(t, i.remaining), e.pausedTimers.delete(t));
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(t, e, s = {}) {
    const n = this.getGlobalState();
    if (!n) return;
    const i = { id: e, toast: e, ...s };
    w.dispatchCustomEvent(document, t, i, {
      bubbles: !0,
      cancelable: !0
    });
    const a = n.toasts.get(e);
    if (a && w.dispatchCustomEvent(a, t, i, {
      bubbles: !0,
      cancelable: !0
    }), typeof window.Livewire < "u") {
      const o = t.replace("toast:", "toast");
      window.Livewire.dispatch(o, i);
    }
  }
  /**
   * Get toast state (for external access)
   */
  getToastState(t) {
    const e = this.getGlobalState();
    if (!e) return null;
    const s = e.toasts.get(t);
    return s ? {
      id: t,
      visible: s.getAttribute("data-toast-visible") === "true",
      variant: s.getAttribute("data-toast-variant"),
      position: s.getAttribute("data-toast-position"),
      duration: parseInt(s.getAttribute("data-toast-duration") || "0"),
      persistent: s.getAttribute("data-toast-persistent") === "true"
    } : null;
  }
  /**
   * Clean up ToastActions - extends BaseActionClass destroy
   */
  onDestroy() {
    const t = this.getGlobalState();
    t && (t.timers.forEach((e) => _.clearTimer(e)), t.timers.clear(), t.pausedTimers.clear(), t.toasts.forEach((e) => {
      this.resetToastContent(e), e.style.display = "none", e.setAttribute("data-toast-visible", "false");
    }), t.toasts.clear(), t.containers.clear());
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  We.getInstance().init();
}) : We.getInstance().init();
window.ToastActions = We;
We.getInstance();
class Mr extends G {
  /**
   * Initialize dropdown elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("dropdown", "true").forEach((t) => {
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
    }, s = f.findClosest(t, '[data-submenu="true"]');
    s && s !== t && (e.parent = s), this.setState(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(t) {
    const e = f.querySelectorAll('[data-submenu="true"]', t), s = this.getState(t);
    s && (s.children = Array.from(e), this.setState(t, s)), e.forEach((n) => {
      this.hasState(n) || this.initializeDropdown(n);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (t, e) => {
      if (t.matches("[data-submenu-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const s = f.findClosest(t, '[data-submenu="true"]');
        s && !this.isDisabled(s) && this.toggleSubmenu(s);
        return;
      }
      if (t.matches("[data-dropdown-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const s = f.findClosest(t, '[data-dropdown="true"]');
        s && !this.isDisabled(s) && this.toggleDropdown(s);
        return;
      }
      if (t.matches("[data-menu-item]")) {
        const s = f.findClosest(t, '[data-dropdown="true"]');
        s && (t.dataset.keepOpen === "true" || this.closeDropdown(s));
        return;
      }
      if (t.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (e.stopPropagation(), !(t.dataset.keepOpen !== "false")) {
          const n = f.findClosest(t, '[data-dropdown="true"]');
          n && this.closeDropdown(n);
        }
        return;
      }
      if (t.matches("[data-dropdown-panel], [data-submenu-panel]")) {
        e.stopPropagation();
        return;
      }
    }), w.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]") || this.closeAllDropdowns());
    }), w.addEventListener(document, "mouseenter", (t) => {
      const e = f.findClosest(t.target, "[data-submenu-trigger]");
      if (e && !this.isMobile()) {
        const s = f.findClosest(e, '[data-submenu="true"]');
        s && !this.isDisabled(s) && (this.closeSiblingSubmenus(s), setTimeout(() => {
          e.matches(":hover") && this.openSubmenu(s);
        }, 100));
      }
    }, { capture: !0 }), w.addEventListener(document, "mouseleave", (t) => {
      const e = f.findClosest(t.target, '[data-submenu="true"]');
      if (e && !this.isMobile()) {
        const s = this.getState(e);
        s != null && s.isOpen && setTimeout(() => {
          e.matches(":hover") || this.closeSubmenu(e);
        }, 150);
      }
    }, { capture: !0 }), w.handleDelegatedKeydown('[data-dropdown="true"]', (t, e) => {
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
          const s = e;
          f.hasDataAttribute(s, "dropdown", "true") && (this.hasState(s) || this.initializeDropdown(s)), f.findByDataAttribute("dropdown", "true", s).forEach((i) => {
            this.hasState(i) || this.initializeDropdown(i);
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
    this.closeSiblingDropdowns(t), e.isOpen = !0, e.focusedIndex = -1, this.setState(t, e);
    const s = f.querySelector("[data-dropdown-panel]", t), n = f.querySelector("[data-dropdown-trigger]", t);
    s && (s.classList.remove("hidden"), this.positionDropdown(t)), n && n.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "dropdown:open");
  }
  /**
   * Open submenu
   */
  openSubmenu(t) {
    const e = this.getState(t);
    if (!e || this.isDisabled(t)) return;
    e.isOpen = !0, e.focusedIndex = -1, this.setState(t, e);
    const s = f.querySelector("[data-submenu-panel]", t), n = f.querySelector("[data-submenu-trigger]", t);
    s && (s.classList.remove("hidden"), this.positionSubmenu(t)), n && n.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const s = f.querySelector("[data-dropdown-panel]", t), n = f.querySelector("[data-dropdown-trigger]", t);
    s && s.classList.add("hidden"), n && n.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "dropdown:close");
  }
  /**
   * Close submenu
   */
  closeSubmenu(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const s = f.querySelector("[data-submenu-panel]", t), n = f.querySelector("[data-submenu-trigger]", t);
    s && s.classList.add("hidden"), n && n.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "submenu:close");
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
    this.getAllStates().forEach((s, n) => {
      if (n !== t && s.isOpen) {
        const i = (e == null ? void 0 : e.parent) === n, a = s.parent === t;
        !i && !a && this.closeDropdown(n);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(t) {
    const e = this.getState(t), s = e == null ? void 0 : e.parent;
    if (s) {
      const n = this.getState(s);
      n == null || n.children.forEach((i) => {
        i !== t && this.closeSubmenu(i);
      });
    }
  }
  /**
   * Close all child submenus
   */
  closeChildSubmenus(t) {
    const e = this.getState(t);
    e == null || e.children.forEach((s) => {
      this.closeSubmenu(s);
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
    const s = this.getState(t);
    if (s)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!s.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (s.focusedIndex >= 0) {
            e.preventDefault();
            const n = s.menuItems[s.focusedIndex];
            n && n.click();
          }
          break;
        case "Escape":
          if (s.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const n = f.querySelector("[data-dropdown-trigger]", t);
            n && n.focus();
          }
          break;
        case "ArrowDown":
          s.isOpen ? (e.preventDefault(), this.navigateItems(t, 1)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "ArrowUp":
          s.isOpen && (e.preventDefault(), this.navigateItems(t, -1));
          break;
        case "Tab":
          s.isOpen && this.closeDropdown(t);
          break;
      }
  }
  /**
   * Navigate through menu items with arrow keys
   */
  navigateItems(t, e) {
    const s = this.getState(t);
    if (!s || !s.isOpen) return;
    const n = s.menuItems.length;
    n !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = e > 0 ? 0 : n - 1 : (s.focusedIndex += e, s.focusedIndex >= n ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = n - 1)), this.setState(t, s), this.updateItemFocus(t));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(t) {
    const e = this.getState(t);
    e && e.menuItems.forEach((s, n) => {
      n === e.focusedIndex ? (s.classList.add("bg-neutral-100", "dark:bg-neutral-800"), s.scrollIntoView({ block: "nearest" })) : s.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", t);
    e.menuItems = Array.from(s).filter((n) => {
      const i = n;
      return !i.hasAttribute("disabled") && i.offsetParent !== null;
    }), this.setState(t, e);
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = f.querySelector("[data-dropdown-panel]", t), s = f.querySelector("[data-dropdown-trigger]", t);
    if (!e || !s) return;
    const n = s.getBoundingClientRect(), i = e.getBoundingClientRect(), a = window.innerHeight, o = window.innerWidth, l = t.dataset.position || "bottom", u = t.dataset.align || "start", h = parseInt(t.dataset.offset || "8");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "";
    const g = a - n.bottom, p = n.top;
    o - n.left, n.right;
    let m = l, y = u;
    switch (l === "bottom" && g < i.height && p > i.height ? m = "top" : l === "top" && p < i.height && g > i.height && (m = "bottom"), m) {
      case "top":
        e.style.bottom = "100%", e.style.marginBottom = `${h}px`;
        break;
      case "bottom":
        e.style.top = "100%", e.style.marginTop = `${h}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${h}px`;
        break;
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${h}px`;
        break;
    }
    if (m === "top" || m === "bottom")
      switch (y) {
        case "start":
          e.style.left = "0";
          break;
        case "center":
          e.style.left = "50%", e.style.transform = "translateX(-50%)";
          break;
        case "end":
          e.style.right = "0";
          break;
      }
    else
      switch (y) {
        case "start":
          e.style.top = "0";
          break;
        case "center":
          e.style.top = "50%", e.style.transform = "translateY(-50%)";
          break;
        case "end":
          e.style.bottom = "0";
          break;
      }
  }
  /**
   * Position submenu relative to trigger
   */
  positionSubmenu(t) {
    const e = f.querySelector("[data-submenu-panel]", t), s = f.querySelector("[data-submenu-trigger]", t);
    if (!e || !s) return;
    const n = s.getBoundingClientRect(), i = e.getBoundingClientRect(), a = window.innerHeight, o = window.innerWidth, l = t.dataset.position || "right", u = t.dataset.align || "start", h = parseInt(t.dataset.offset || "4");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "", e.style.transform = "";
    const g = o - n.right, p = n.left;
    a - n.bottom, n.top;
    let m = l;
    switch (l === "right" && g < i.width && p > i.width ? m = "left" : l === "left" && p < i.width && g > i.width && (m = "right"), m) {
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${h}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${h}px`;
        break;
    }
    switch (u) {
      case "start":
        e.style.top = "0";
        break;
      case "center":
        e.style.top = "50%", e.style.transform = "translateY(-50%)";
        break;
      case "end":
        e.style.bottom = "0";
        break;
    }
    const y = e.getBoundingClientRect();
    if (y.bottom > a) {
      const v = y.bottom - a + 8;
      e.style.transform = `translateY(-${v}px)`;
    } else if (y.top < 0) {
      const v = Math.abs(y.top) + 8;
      e.style.transform = `translateY(${v}px)`;
    }
  }
  /**
   * Reposition all open dropdowns and submenus
   */
  repositionDropdowns() {
    this.getAllStates().forEach((t, e) => {
      t.isOpen && (e.hasAttribute("data-submenu") ? this.positionSubmenu(e) : this.positionDropdown(e));
    });
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
  dispatchDropdownEvent(t, e, s = null) {
    w.dispatchCustomEvent(t, e, {
      dropdown: t,
      ...s
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
Mr.getInstance();
class Ze extends G {
  /**
   * Initialize table elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("table", "true").forEach((t) => {
      this.initializeTable(t);
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single table
   */
  initializeTable(t) {
    var n;
    if (this.hasState(t))
      return;
    const e = {
      selectedRows: /* @__PURE__ */ new Set(),
      sortColumn: null,
      sortDirection: null,
      selectAllState: "none"
    };
    this.setState(t, e);
    const s = f.querySelector('[data-sorted="true"]', t);
    if (s) {
      const i = s.getAttribute("data-sort-key") || ((n = s.textContent) == null ? void 0 : n.trim()) || "", a = s.getAttribute("data-direction");
      e.sortColumn = i, e.sortDirection = a;
    }
    this.updateSelectionState(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick('[data-sortable="true"]', (t, e) => {
      e.preventDefault(), this.handleSort(t);
    }), w.handleDelegatedChange("[data-table-row-select]", (t) => {
      this.handleRowSelection(t);
    }), w.handleDelegatedChange("[data-table-select-all]", (t) => {
      this.handleSelectAll(t);
    }), w.handleDelegatedKeydown('[data-table="true"]', (t, e) => {
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
          const s = e;
          f.hasDataAttribute(s, "table", "true") && this.initializeTable(s), f.findByDataAttribute("table", "true", s).forEach((n) => {
            this.initializeTable(n);
          });
        }
      });
    });
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || w.addEventListener(document, "livewire:navigated", () => {
      this.reinitialize();
    });
  }
  /**
   * Handle sortable header clicks
   */
  handleSort(t) {
    var a;
    const e = f.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const s = this.getState(e);
    if (!s) return;
    const n = t.getAttribute("data-sort-key") || ((a = t.textContent) == null ? void 0 : a.trim()) || "";
    let i = "asc";
    s.sortColumn === n && (s.sortDirection === "asc" ? i = "desc" : s.sortDirection === "desc" && (i = null)), s.sortColumn = i ? n : null, s.sortDirection = i, this.updateSortUI(e, n, i), this.dispatchSortEvent(e, {
      column: n,
      direction: i || "asc",
      url: t.getAttribute("data-sort-url") || void 0,
      livewireMethod: t.getAttribute("data-sort-method") || void 0
    });
  }
  /**
   * Update sort UI indicators
   */
  updateSortUI(t, e, s) {
    if (f.querySelectorAll('[data-sortable="true"]', t).forEach((i) => {
      i.setAttribute("data-sorted", "false"), i.removeAttribute("data-direction"), f.querySelectorAll(".table-sort-icon", i).forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), s) {
      const i = t.querySelector(`[data-sort-key="${e}"]`);
      if (i) {
        i.setAttribute("data-sorted", "true"), i.setAttribute("data-direction", s);
        const a = f.querySelector(".table-sort-icon", i);
        if (a) {
          const o = s === "asc" ? "heroicon-o-chevron-up" : "heroicon-o-chevron-down";
          a.setAttribute("data-icon", o), a.classList.remove("opacity-0", "group-hover:opacity-100"), a.classList.add("opacity-100");
        }
      }
    }
  }
  /**
   * Handle individual row selection
   */
  handleRowSelection(t) {
    const e = f.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const s = this.getState(e);
    if (!s) return;
    const n = t.getAttribute("data-row-id");
    n && (t.checked ? s.selectedRows.add(n) : s.selectedRows.delete(n), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(s.selectedRows)));
  }
  /**
   * Handle select all checkbox
   */
  handleSelectAll(t) {
    const e = f.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const s = this.getState(e);
    if (!s) return;
    const n = f.querySelectorAll("[data-table-row-select]", e);
    t.checked ? n.forEach((i) => {
      i.checked = !0;
      const a = i.getAttribute("data-row-id");
      a && s.selectedRows.add(a);
    }) : n.forEach((i) => {
      i.checked = !1;
      const a = i.getAttribute("data-row-id");
      a && s.selectedRows.delete(a);
    }), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(s.selectedRows));
  }
  /**
   * Update selection state and UI
   */
  updateSelectionState(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelectorAll("[data-table-row-select]", t), n = f.querySelector("[data-table-select-all]", t), i = s.length, a = e.selectedRows.size;
    a === 0 ? (e.selectAllState = "none", n && (n.checked = !1, n.indeterminate = !1)) : a === i ? (e.selectAllState = "all", n && (n.checked = !0, n.indeterminate = !1)) : (e.selectAllState = "some", n && (n.checked = !1, n.indeterminate = !0)), f.querySelectorAll("[data-table-row]", t).forEach((l) => {
      const u = l.getAttribute("data-row-id");
      u && e.selectedRows.has(u) ? (l.setAttribute("data-selected", "true"), l.classList.add("table-row-selected")) : (l.setAttribute("data-selected", "false"), l.classList.remove("table-row-selected"));
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
    if (w.dispatchCustomEvent(t, "table:sort", e, {
      bubbles: !0,
      cancelable: !0
    }), e.livewireMethod && window.Livewire) {
      const s = t.getAttribute("wire:id");
      if (s) {
        const n = window.Livewire.find(s);
        n && n.call(e.livewireMethod, e.column, e.direction);
      }
    }
  }
  /**
   * Dispatch selection event
   */
  dispatchSelectionEvent(t, e) {
    w.dispatchCustomEvent(t, "table:selection", { selectedIds: e }, {
      bubbles: !0,
      cancelable: !0
    });
    const s = t.getAttribute("data-selection-method");
    if (s && window.Livewire) {
      const n = t.getAttribute("wire:id");
      if (n) {
        const i = window.Livewire.find(n);
        i && i.call(s, e);
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
  Ze.getInstance().init();
}) : Ze.getInstance().init();
window.TableActions = Ze;
Ze.getInstance();
class Rr extends G {
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
    f.findByDataAttribute("button-group", "true").filter(
      (e) => f.hasDataAttribute(e, "attached", "true")
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
          const s = e;
          f.hasDataAttribute(s, "button-group", "true") && f.hasDataAttribute(s, "attached", "true") && this.processButtonGroup(s), f.findByDataAttribute("button-group", "true", s).filter(
            (i) => f.hasDataAttribute(i, "attached", "true")
          ).forEach((i) => this.processButtonGroup(i));
        }
      });
    });
  }
  /**
   * Process a single button group element
   */
  processButtonGroup(t) {
    const e = t.getAttribute("data-orientation") || "horizontal", s = Array.from(t.children).filter(
      (n) => n.tagName === "BUTTON" || n.tagName === "A"
    );
    s.length <= 1 || s.forEach((n, i) => {
      const a = i === 0, o = i === s.length - 1, l = !a && !o;
      this.clearBorderRadiusClasses(n), e === "horizontal" ? a ? n.classList.add("rounded-r-none") : o ? n.classList.add("rounded-l-none") : l && n.classList.add("rounded-none") : e === "vertical" && (a ? n.classList.add("rounded-b-none") : o ? n.classList.add("rounded-t-none") : l && n.classList.add("rounded-none"));
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
    ].forEach((s) => {
      t.classList.remove(s);
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
Rr.getInstance();
class Qe extends G {
  /**
   * Initialize tooltip elements - required by BaseActionClass
   */
  initializeElements() {
    f.querySelectorAll("[data-tooltip-target]").forEach((t) => {
      const e = t.getAttribute("data-tooltip-target");
      if (e) {
        const s = f.getElementById(e);
        s && this.initializeTooltip(t, s);
      }
    }), f.findByDataAttribute("tooltip", "true").forEach((t) => {
      const e = t.getAttribute("data-target");
      if (e) {
        const s = f.querySelector(e);
        s && this.initializeTooltip(s, t);
      }
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single tooltip
   */
  initializeTooltip(t, e) {
    if (this.hasState(e))
      return;
    const s = t.getAttribute("data-tooltip-trigger") || e.getAttribute("data-trigger") || "hover", n = parseInt(t.getAttribute("data-tooltip-delay") || e.getAttribute("data-delay") || "100"), i = {
      isVisible: !1,
      trigger: t,
      tooltip: e,
      triggerType: s,
      delay: n
    };
    this.setState(e, i), this.bindTooltipEvents(t, e, i), this.hideTooltip(e);
  }
  /**
   * Bind events for a specific tooltip
   */
  bindTooltipEvents(t, e, s) {
    switch (s.triggerType) {
      case "hover":
        t.addEventListener("mouseenter", () => this.scheduleShow(e)), t.addEventListener("mouseleave", () => this.scheduleHide(e)), e.addEventListener("mouseenter", () => this.cancelHide(e)), e.addEventListener("mouseleave", () => this.scheduleHide(e));
        break;
      case "click":
        t.addEventListener("click", (n) => {
          n.preventDefault(), this.toggleTooltip(e);
        });
        break;
      case "focus":
        t.addEventListener("focus", () => this.scheduleShow(e)), t.addEventListener("blur", () => this.scheduleHide(e));
        break;
    }
    t.addEventListener("keydown", (n) => {
      n.key === "Escape" && s.isVisible && this.hideTooltip(e);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && this.getAllStates().forEach((s, n) => {
        var i;
        if (s.triggerType === "click" && s.isVisible) {
          const a = e;
          !((i = s.trigger) != null && i.contains(a)) && !n.contains(a) && this.hideTooltip(n);
        }
      });
    }), w.addEventListener(document, "scroll", () => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.hideTooltip(e);
      });
    }, { passive: !0 }), w.handleResize(() => {
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
          const s = e;
          f.querySelectorAll("[data-tooltip-target]", s).forEach((n) => {
            const i = n.getAttribute("data-tooltip-target");
            if (i) {
              const a = f.getElementById(i);
              a && !this.hasState(a) && this.initializeTooltip(n, a);
            }
          }), f.findByDataAttribute("tooltip", "true", s).forEach((n) => {
            const i = n.getAttribute("data-target");
            if (i) {
              const a = f.querySelector(i);
              a && !this.hasState(n) && this.initializeTooltip(a, n);
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
    !e || t.getAttribute("data-disabled") === "true" || (this.cancelHide(t), e.showTimer = _.createTimer(() => {
      this.showTooltip(t);
    }, e.delay));
  }
  /**
   * Schedule tooltip to hide with delay
   */
  scheduleHide(t) {
    const e = this.getState(t);
    e && (this.cancelShow(t), e.hideTimer = _.createTimer(() => {
      this.hideTooltip(t);
    }, 100));
  }
  /**
   * Cancel scheduled show
   */
  cancelShow(t) {
    const e = this.getState(t);
    e != null && e.showTimer && (_.clearTimer(e.showTimer), delete e.showTimer);
  }
  /**
   * Cancel scheduled hide
   */
  cancelHide(t) {
    const e = this.getState(t);
    e != null && e.hideTimer && (_.clearTimer(e.hideTimer), delete e.hideTimer);
  }
  /**
   * Show tooltip
   */
  showTooltip(t) {
    const e = this.getState(t);
    !e || e.isVisible || (e.trigger && this.positionTooltip(e.trigger, t), _.fadeIn(t, {
      duration: 200,
      onComplete: () => {
        t.setAttribute("data-show", "true"), e.isVisible = !0, this.dispatchTooltipEvent(t, "tooltip:show", { trigger: e.trigger });
      }
    }));
  }
  /**
   * Hide tooltip
   */
  hideTooltip(t) {
    const e = this.getState(t);
    !e || !e.isVisible || _.fadeOut(t, {
      duration: 150,
      onComplete: () => {
        t.setAttribute("data-show", "false"), e.isVisible = !1, this.dispatchTooltipEvent(t, "tooltip:hide", { trigger: e.trigger });
      }
    });
  }
  /**
   * Toggle tooltip visibility
   */
  toggleTooltip(t) {
    const e = this.getState(t);
    e && (e.isVisible ? this.hideTooltip(t) : this.showTooltip(t));
  }
  /**
   * Position tooltip relative to trigger
   */
  positionTooltip(t, e) {
    const s = t.getBoundingClientRect(), n = e.style.visibility, i = e.style.opacity;
    e.style.visibility = "hidden", e.style.opacity = "1", e.style.position = "fixed", e.style.top = "-9999px", e.style.left = "-9999px";
    const a = e.getBoundingClientRect(), o = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    e.style.visibility = n, e.style.opacity = i;
    const l = e.getAttribute("data-placement") || "top", u = this.calculateOptimalPosition(s, a, o, l);
    e.style.position = "fixed", e.style.top = `${u.top}px`, e.style.left = `${u.left}px`, e.setAttribute("data-placement", u.placement);
  }
  /**
   * Calculate optimal tooltip position with collision detection
   */
  calculateOptimalPosition(t, e, s, n) {
    const a = {
      top: {
        top: t.top - e.height - 8,
        left: t.left + (t.width - e.width) / 2,
        placement: "top"
      },
      bottom: {
        top: t.bottom + 8,
        left: t.left + (t.width - e.width) / 2,
        placement: "bottom"
      },
      left: {
        top: t.top + (t.height - e.height) / 2,
        left: t.left - e.width - 8,
        placement: "left"
      },
      right: {
        top: t.top + (t.height - e.height) / 2,
        left: t.right + 8,
        placement: "right"
      }
    }, o = a[n];
    if (this.positionFitsInViewport(o, e, s))
      return o;
    const l = Object.values(a).filter((u) => u.placement !== n);
    for (const u of l)
      if (this.positionFitsInViewport(u, e, s))
        return u;
    return {
      top: Math.max(8, Math.min(o.top, s.height - e.height - 8)),
      left: Math.max(8, Math.min(o.left, s.width - e.width - 8)),
      placement: o.placement
    };
  }
  /**
   * Check if position fits in viewport
   */
  positionFitsInViewport(t, e, s) {
    return t.top >= 0 && t.left >= 0 && t.top + e.height <= s.height && t.left + e.width <= s.width;
  }
  /**
   * Dispatch tooltip events
   */
  dispatchTooltipEvent(t, e, s = {}) {
    w.dispatchCustomEvent(t, e, {
      tooltip: t,
      ...s
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
    this.tooltipStates.clear(), this.initializeTooltips();
  }
  /**
   * Public API: Show tooltip programmatically
   */
  show(t) {
    const e = f.getElementById(t);
    return e && this.hasState(e) ? (this.showTooltip(e), !0) : !1;
  }
  /**
   * Public API: Hide tooltip programmatically
   */
  hide(t) {
    const e = f.getElementById(t);
    return e && this.hasState(e) ? (this.hideTooltip(e), !0) : !1;
  }
  /**
   * Public API: Toggle tooltip programmatically
   */
  toggle(t) {
    const e = f.getElementById(t);
    return e && this.hasState(e) ? (this.toggleTooltip(e), !0) : !1;
  }
  /**
   * Public API: Destroy tooltip instance
   */
  destroy(t) {
    const e = f.getElementById(t);
    return e && this.hasState(e) ? (this.hideTooltip(e), this.removeState(e), !0) : !1;
  }
  /**
   * Clean up TooltipActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Qe.getInstance().init();
}) : Qe.getInstance().init();
window.TooltipActions = Qe;
Qe.getInstance();
class Xe extends G {
  /**
   * Initialize timepicker elements - required by BaseActionClass
   */
  initializeElements() {
    f.querySelectorAll('[data-timepicker="true"]').forEach((t) => {
      this.initializeTimePicker(t);
    });
  }
  /**
   * Initialize a single timepicker element
   */
  initializeTimePicker(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.format || "24", s = t.dataset.showSeconds === "true", n = parseInt(t.dataset.step || "1"), i = t.dataset.minTime || null, a = t.dataset.maxTime || null, o = t.dataset.value || null, l = this.parseTime(o) || this.getCurrentTime(), u = {
      isOpen: !1,
      format: e,
      showSeconds: s,
      hour: l.hour,
      minute: l.minute,
      second: l.second,
      period: l.period || "AM",
      step: n,
      minTime: i,
      maxTime: a,
      value: o
    };
    this.setState(t, u), this.updateDisplay(t), this.updateSelectedStates(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[data-timepicker-trigger]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]');
      s && !this.isDisabled(s) && this.toggleDropdown(s);
    }), w.handleDelegatedClick("[data-timepicker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const s = f.findClosest(t, '[data-timepicker="true"]');
      s && this.clearTime(s);
    }), w.handleDelegatedClick("[data-timepicker-hour]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]'), n = parseInt(t.dataset.timepickerHour || "0");
      s && this.setHour(s, n);
    }), w.handleDelegatedClick("[data-timepicker-minute]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]'), n = parseInt(t.dataset.timepickerMinute || "0");
      s && this.setMinute(s, n);
    }), w.handleDelegatedClick("[data-timepicker-second]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]'), n = parseInt(t.dataset.timepickerSecond || "0");
      s && this.setSecond(s, n);
    }), w.handleDelegatedClick("[data-timepicker-period]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]'), n = t.dataset.timepickerPeriod;
      s && this.setPeriod(s, n);
    }), w.handleDelegatedClick("[data-timepicker-format]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]'), n = t.dataset.timepickerFormat;
      s && this.setFormat(s, n);
    }), w.handleDelegatedClick("[data-timepicker-now]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]');
      s && this.setToCurrentTime(s);
    }), w.handleDelegatedClick("[data-timepicker-apply]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]');
      s && this.applyTime(s);
    }), w.handleDelegatedClick("[data-timepicker-cancel]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-timepicker="true"]');
      s && this.closeDropdown(s);
    }), w.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest('[data-timepicker="true"]') || this.closeAllDropdowns());
    }), w.handleDelegatedKeydown('[data-timepicker="true"]', (t, e) => {
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
          const s = e;
          s.matches && s.matches('[data-timepicker="true"]') && this.initializeTimePicker(s), f.querySelectorAll('[data-timepicker="true"]', s).forEach((n) => {
            this.initializeTimePicker(n);
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
    const s = f.querySelector("[data-timepicker-dropdown]", t), n = f.querySelector("[data-timepicker-trigger]", t);
    s && (s.classList.remove("hidden"), this.positionDropdown(t)), n && n.setAttribute("aria-expanded", "true"), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.dispatchTimePickerEvent(t, "timepicker:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    e.isOpen = !1, this.setState(t, e);
    const s = f.querySelector("[data-timepicker-dropdown]", t), n = f.querySelector("[data-timepicker-trigger]", t);
    s && s.classList.add("hidden"), n && n.setAttribute("aria-expanded", "false"), this.dispatchTimePickerEvent(t, "timepicker:close");
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
    const s = this.getState(t);
    s && (s.hour = e, this.setState(t, s), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set minute value
   */
  setMinute(t, e) {
    const s = this.getState(t);
    s && (s.minute = e, this.setState(t, s), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set second value
   */
  setSecond(t, e) {
    const s = this.getState(t);
    s && (s.second = e, this.setState(t, s), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set period (AM/PM)
   */
  setPeriod(t, e) {
    const s = this.getState(t);
    s && (s.period = e, this.setState(t, s), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Convert hour between 12h and 24h formats
   */
  convertHourBetweenFormats(t, e, s, n) {
    if (e === s)
      return { hour: t, period: n };
    if (e === "24" && s === "12")
      return t === 0 ? { hour: 12, period: "AM" } : t >= 1 && t <= 11 ? { hour: t, period: "AM" } : t === 12 ? { hour: 12, period: "PM" } : { hour: t - 12, period: "PM" };
    if (e === "12" && s === "24") {
      if (!n)
        throw new Error("Period (AM/PM) required for 12h to 24h conversion");
      return n === "AM" ? t === 12 ? { hour: 0 } : { hour: t } : t === 12 ? { hour: 12 } : { hour: t + 12 };
    }
    return { hour: t, period: n };
  }
  /**
   * Set format (12/24 hour)
   */
  setFormat(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const n = t.dataset.formatMode;
    if (n === "12" || n === "24") {
      console.warn(`TimePicker format is locked to ${n}h mode. Cannot switch to ${e}h.`);
      return;
    }
    if (s.format !== e) {
      const i = this.convertHourBetweenFormats(s.hour, s.format, e, s.period);
      s.hour = i.hour, i.period && (s.period = i.period), s.format = e, this.setState(t, s), this.updateFormatButtons(t), this.updateHourOptions(t), this.updateSelectedStates(t), this.updateDisplay(t), this.updatePreview(t);
    }
  }
  /**
   * Set to current time
   */
  setToCurrentTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = this.getCurrentTime();
    e.format === "12" ? (e.hour = s.hour > 12 ? s.hour - 12 : s.hour === 0 ? 12 : s.hour, e.period = s.hour >= 12 ? "PM" : "AM") : e.hour = s.hour, e.minute = s.minute, e.second = s.second, this.setState(t, e), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.updatePreview(t);
  }
  /**
   * Apply time selection
   */
  applyTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = this.formatTimeValue(e);
    this.setValue(t, s), this.closeDropdown(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: s,
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
    const s = this.getState(t);
    if (s)
      switch (e.key) {
        case "Enter":
        case " ":
          s.isOpen ? (e.preventDefault(), this.applyTime(t)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "Escape":
          s.isOpen && (e.preventDefault(), this.closeDropdown(t));
          break;
        case "ArrowUp":
          s.isOpen ? e.preventDefault() : (e.preventDefault(), this.incrementTime(t, "minute", 1));
          break;
        case "ArrowDown":
          s.isOpen ? e.preventDefault() : (e.preventDefault(), this.incrementTime(t, "minute", -1));
          break;
        case "ArrowLeft":
          s.isOpen || (e.preventDefault(), this.incrementTime(t, "hour", -1));
          break;
        case "ArrowRight":
          s.isOpen || (e.preventDefault(), this.incrementTime(t, "hour", 1));
          break;
      }
  }
  /**
   * Increment/decrement time values
   */
  incrementTime(t, e, s) {
    const n = this.getState(t);
    if (n) {
      switch (e) {
        case "hour":
          n.format === "12" ? (n.hour = n.hour + s, n.hour > 12 && (n.hour = 1), n.hour < 1 && (n.hour = 12)) : (n.hour = n.hour + s, n.hour > 23 && (n.hour = 0), n.hour < 0 && (n.hour = 23));
          break;
        case "minute":
          n.minute = n.minute + s * n.step, n.minute >= 60 ? n.minute = n.minute % 60 : n.minute < 0 && (n.minute = 60 + n.minute % 60, n.minute === 60 && (n.minute = 0));
          break;
        case "second":
          n.second = n.second + s, n.second >= 60 ? n.second = 0 : n.second < 0 && (n.second = 59);
          break;
      }
      this.setState(t, n), this.updateDisplay(t), this.dispatchTimePickerEvent(t, "timepicker:increment", {
        unit: e,
        direction: s,
        value: this.formatTimeValue(n)
      });
    }
  }
  /**
   * Update display value
   */
  updateDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = this.formatTimeValue(e), n = f.querySelector("[data-timepicker-trigger]", t);
    n && (n.value = s || "");
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
    const s = f.querySelector(".timepicker-hidden-input", t), n = f.querySelector("[data-timepicker-trigger]", t);
    s && (s.value = e), n && (n.value = e);
    const i = this.getState(t);
    i && (i.value = e, this.setState(t, i));
  }
  /**
   * Update selected states in dropdown
   */
  updateSelectedStates(t) {
    const e = this.getState(t);
    if (!e) return;
    f.querySelectorAll(".selected", t).forEach((i) => i.classList.remove("selected"));
    const s = f.querySelector(`[data-timepicker-hour="${e.hour}"]`, t);
    s && s.classList.add("selected");
    const n = f.querySelector(`[data-timepicker-minute="${e.minute}"]`, t);
    if (n && n.classList.add("selected"), e.showSeconds) {
      const i = t.querySelector(`[data-timepicker-second="${e.second}"]`);
      i && i.classList.add("selected");
    }
    if (e.format === "12") {
      const i = t.querySelector(`[data-timepicker-period="${e.period}"]`);
      i && i.classList.add("selected");
    }
  }
  /**
   * Update format toggle buttons
   */
  updateFormatButtons(t) {
    const e = this.getState(t);
    if (!e) return;
    f.querySelectorAll("[data-timepicker-format]", t).forEach((n) => {
      n.dataset.timepickerFormat === e.format ? (n.classList.add("bg-brand", "text-foreground-brand"), n.classList.remove("bg-surface", "text-muted")) : (n.classList.remove("bg-brand", "text-foreground-brand"), n.classList.add("bg-surface", "text-muted"));
    });
  }
  /**
   * Update hour options based on current format
   */
  updateHourOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.querySelector("[data-timepicker-dropdown] .h-24:first-child", t);
    if (!s) return;
    const n = e.format === "12" ? Array.from({ length: 12 }, (i, a) => a + 1) : (
      // 1-12 for 12h
      Array.from({ length: 24 }, (i, a) => a)
    );
    s.innerHTML = "", n.forEach((i) => {
      const a = document.createElement("button");
      a.type = "button", a.dataset.timepickerHour = i.toString(), a.className = "w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors", a.textContent = i.toString().padStart(2, "0"), s.appendChild(a);
    }), e.format === "12" && (e.hour < 1 || e.hour > 12) ? (e.hour = Math.max(1, Math.min(12, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t)) : e.format === "24" && (e.hour < 0 || e.hour > 23) && (e.hour = Math.max(0, Math.min(23, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t));
  }
  /**
   * Scroll to selected options in dropdown lists
   */
  scrollToSelectedOptions(t) {
    f.querySelectorAll(".selected", t).forEach((s) => {
      s.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
  /**
   * Position dropdown
   */
  positionDropdown(t) {
    const e = f.querySelector("[data-timepicker-dropdown]", t), s = f.querySelector("[data-timepicker-trigger]", t);
    if (!e || !s) return;
    e.style.top = "", e.style.bottom = "", e.style.marginTop = "", e.style.marginBottom = "", e.style.maxHeight = "";
    const n = s.getBoundingClientRect(), i = window.innerHeight, a = window.innerWidth, l = e.getBoundingClientRect().height, u = i - n.bottom - 8, h = n.top - 8, g = 200;
    let p = !1, m = "none";
    l <= u ? p = !1 : l <= h ? p = !0 : h > u ? (p = !0, m = Math.max(h, g) + "px") : (p = !1, m = Math.max(u, g) + "px"), p ? (e.style.bottom = "100%", e.style.top = "auto", e.style.marginBottom = "4px", e.style.marginTop = "0") : (e.style.top = "100%", e.style.bottom = "auto", e.style.marginTop = "4px", e.style.marginBottom = "0"), m !== "none" && (e.style.maxHeight = m, e.style.overflowY = "auto");
    const y = n.left;
    y + e.offsetWidth > a ? (e.style.right = "0", e.style.left = "auto") : y < 0 && (e.style.left = "0", e.style.right = "auto");
  }
  /**
   * Parse time string into components
   */
  parseTime(t) {
    var e;
    if (!t) return null;
    try {
      const s = [
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
      ];
      for (const n of s) {
        const i = t.match(n);
        if (i) {
          const a = parseInt(i[1]), o = parseInt(i[2]), l = parseInt(i[3] || "0"), u = (e = i[4]) == null ? void 0 : e.toUpperCase();
          return { hour: a, minute: o, second: l, period: u };
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
    const { hour: e, minute: s, second: n, period: i, format: a, showSeconds: o } = t;
    if (a === "12") {
      const l = e.toString(), u = s.toString().padStart(2, "0"), h = n.toString().padStart(2, "0");
      return o ? `${l}:${u}:${h} ${i}` : `${l}:${u} ${i}`;
    } else {
      const l = e.toString().padStart(2, "0"), u = s.toString().padStart(2, "0"), h = n.toString().padStart(2, "0");
      return o ? `${l}:${u}:${h}` : `${l}:${u}`;
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
  dispatchTimePickerEvent(t, e, s = null) {
    w.dispatchCustomEvent(t, e, {
      timepicker: t,
      ...s
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
    const s = this.parseTime(e), n = this.getState(t);
    !s || !n || (n.hour = s.hour, n.minute = s.minute, n.second = s.second, s.period && (n.period = s.period), this.setState(t, n), this.updateDisplay(t), this.updateSelectedStates(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: this.formatTimeValue(n),
      state: { ...n }
    }));
  }
  /**
   * Clean up TimePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Xe.getInstance().init();
}) : Xe.getInstance().init();
window.TimePickerActions = Xe;
Xe.getInstance();
class Je extends G {
  /**
   * Initialize accordion elements - required by BaseActionClass
   */
  initializeElements() {
    f.querySelectorAll("details[data-accordion]").forEach((t) => {
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
      isAnimating: !1,
      animation: null,
      isExpanding: !1
    };
    this.setState(t, e);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("details[data-accordion] summary", (t, e) => {
      const s = f.findClosest(t, "details[data-accordion]");
      s && this.handleSummaryClick(s, e);
    }), w.handleDelegatedEvent("toggle", "details[data-accordion]", (t) => {
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
          const s = e;
          s.matches && s.matches("details[data-accordion]") && this.initializeAccordion(s), f.querySelectorAll("details[data-accordion]", s).forEach((n) => {
            this.initializeAccordion(n);
          });
        }
      });
    });
  }
  /**
   * Handle summary click with animation
   */
  handleSummaryClick(t, e) {
    const s = this.getState(t);
    if (!s) return;
    if (s.isAnimating) {
      e.preventDefault();
      return;
    }
    if (_.prefersReducedMotion())
      return;
    e.preventDefault();
    const n = !t.open;
    s.isExpanding = n, n ? this.expand(t) : this.shrink(t);
  }
  /**
   * Handle toggle events (for keyboard navigation)
   */
  handleToggle(t) {
    this.dispatchAccordionEvent(t, "accordion:toggle", {
      isExpanded: t.open
    });
  }
  /**
   * Expand accordion with animation
   */
  expand(t) {
    const e = this.getState(t);
    if (!e) return;
    e.isAnimating = !0, t.setAttribute("animating", ""), t.open = !0;
    const s = f.querySelector("summary", t), n = s ? s.offsetHeight : 0, i = t.offsetHeight;
    e.animation = _.expandHeight(t, {
      fromHeight: n,
      toHeight: i,
      duration: 300,
      easing: "ease-out",
      onComplete: () => {
        this.onAnimationFinish(t);
      }
    }), this.dispatchAccordionEvent(t, "accordion:expanding");
  }
  /**
   * Shrink accordion with animation
   */
  shrink(t) {
    const e = this.getState(t);
    if (!e) return;
    e.isAnimating = !0, t.setAttribute("animating", "");
    const s = f.querySelector("summary", t), n = s ? s.offsetHeight : 0;
    e.animation = _.collapseHeight(t, {
      toHeight: n,
      duration: 300,
      easing: "ease-out",
      onComplete: () => {
        t.open = !1, this.onAnimationFinish(t);
      }
    }), this.dispatchAccordionEvent(t, "accordion:collapsing");
  }
  /**
   * Clean up after animation finishes
   */
  onAnimationFinish(t) {
    const e = this.getState(t);
    e && (t.removeAttribute("animating"), t.style.height = "", t.style.overflow = "", e.animation = null, e.isAnimating = !1, this.setState(t, e), this.dispatchAccordionEvent(t, "accordion:animated", {
      isExpanded: t.open
    }));
  }
  /**
   * Programmatically open an accordion
   */
  openAccordion(t) {
    const e = f.getElementById(t);
    if (!e || !e.matches("details[data-accordion]"))
      return console.warn(`Accordion with id "${t}" not found`), !1;
    if (e.open)
      return !0;
    const s = this.getState(e);
    return s && s.isAnimating ? !1 : _.prefersReducedMotion() ? (e.open = !0, !0) : (this.expand(e), !0);
  }
  /**
   * Programmatically close an accordion
   */
  closeAccordion(t) {
    const e = f.getElementById(t);
    if (!e || !e.matches("details[data-accordion]"))
      return console.warn(`Accordion with id "${t}" not found`), !1;
    if (!e.open)
      return !0;
    const s = this.getState(e);
    return s && s.isAnimating ? !1 : _.prefersReducedMotion() ? (e.open = !1, !0) : (this.shrink(e), !0);
  }
  /**
   * Toggle an accordion's state
   */
  toggleAccordion(t) {
    const e = f.getElementById(t);
    return !e || !e.matches("details[data-accordion]") ? (console.warn(`Accordion with id "${t}" not found`), !1) : e.open ? this.closeAccordion(t) : this.openAccordion(t);
  }
  /**
   * Check if accordion is open
   */
  isAccordionOpen(t) {
    const e = f.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Check if accordion is animating
   */
  isAccordionAnimating(t) {
    const e = f.getElementById(t);
    if (!e) return !1;
    const s = this.getState(e);
    return s ? s.isAnimating : !1;
  }
  /**
   * Get accordion state
   */
  getAccordionState(t) {
    const e = f.getElementById(t);
    return e && this.getState(e) || null;
  }
  /**
   * Dispatch custom accordion events
   */
  dispatchAccordionEvent(t, e, s = {}) {
    w.dispatchCustomEvent(t, e, {
      accordion: t,
      ...s
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Clean up AccordionActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.getAllStates().forEach((t, e) => {
      _.cancelAnimation(t.animation), e.removeAttribute("animating"), e.style.height = "", e.style.overflow = "";
    });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Je.getInstance().init();
}) : Je.getInstance().init();
window.AccordionActions = Je;
Je.getInstance();
var uo = typeof global == "object" && global && global.Object === Object && global, Dl = typeof self == "object" && self && self.Object === Object && self, Ft = uo || Dl || Function("return this")(), re = Ft.Symbol, ho = Object.prototype, Cl = ho.hasOwnProperty, Ll = ho.toString, Ds = re ? re.toStringTag : void 0;
function Il(r) {
  var t = Cl.call(r, Ds), e = r[Ds];
  try {
    r[Ds] = void 0;
    var s = !0;
  } catch {
  }
  var n = Ll.call(r);
  return s && (t ? r[Ds] = e : delete r[Ds]), n;
}
var Nl = Object.prototype, kl = Nl.toString;
function ql(r) {
  return kl.call(r);
}
var Ol = "[object Null]", Ml = "[object Undefined]", ca = re ? re.toStringTag : void 0;
function as(r) {
  return r == null ? r === void 0 ? Ml : Ol : ca && ca in Object(r) ? Il(r) : ql(r);
}
function Gt(r) {
  return r != null && typeof r == "object";
}
var be = Array.isArray;
function ae(r) {
  var t = typeof r;
  return r != null && (t == "object" || t == "function");
}
function fo(r) {
  return r;
}
var Rl = "[object AsyncFunction]", _l = "[object Function]", $l = "[object GeneratorFunction]", Bl = "[object Proxy]";
function _r(r) {
  if (!ae(r))
    return !1;
  var t = as(r);
  return t == _l || t == $l || t == Rl || t == Bl;
}
var zi = Ft["__core-js_shared__"], ua = function() {
  var r = /[^.]+$/.exec(zi && zi.keys && zi.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function Fl(r) {
  return !!ua && ua in r;
}
var Pl = Function.prototype, Hl = Pl.toString;
function we(r) {
  if (r != null) {
    try {
      return Hl.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var jl = /[\\^$.*+?()[\]{}|]/g, Ul = /^\[object .+?Constructor\]$/, zl = Function.prototype, Vl = Object.prototype, Gl = zl.toString, Kl = Vl.hasOwnProperty, Yl = RegExp(
  "^" + Gl.call(Kl).replace(jl, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Wl(r) {
  if (!ae(r) || Fl(r))
    return !1;
  var t = _r(r) ? Yl : Ul;
  return t.test(we(r));
}
function Zl(r, t) {
  return r == null ? void 0 : r[t];
}
function Se(r, t) {
  var e = Zl(r, t);
  return Wl(e) ? e : void 0;
}
var nr = Se(Ft, "WeakMap"), da = Object.create, Ql = /* @__PURE__ */ function() {
  function r() {
  }
  return function(t) {
    if (!ae(t))
      return {};
    if (da)
      return da(t);
    r.prototype = t;
    var e = new r();
    return r.prototype = void 0, e;
  };
}();
function Xl(r, t, e) {
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
function Jl(r, t) {
  var e = -1, s = r.length;
  for (t || (t = Array(s)); ++e < s; )
    t[e] = r[e];
  return t;
}
var tc = 800, ec = 16, sc = Date.now;
function nc(r) {
  var t = 0, e = 0;
  return function() {
    var s = sc(), n = ec - (s - e);
    if (e = s, n > 0) {
      if (++t >= tc)
        return arguments[0];
    } else
      t = 0;
    return r.apply(void 0, arguments);
  };
}
function ic(r) {
  return function() {
    return r;
  };
}
var kn = function() {
  try {
    var r = Se(Object, "defineProperty");
    return r({}, "", {}), r;
  } catch {
  }
}(), rc = kn ? function(r, t) {
  return kn(r, "toString", {
    configurable: !0,
    enumerable: !1,
    value: ic(t),
    writable: !0
  });
} : fo, ac = nc(rc);
function oc(r, t) {
  for (var e = -1, s = r == null ? 0 : r.length; ++e < s && t(r[e], e, r) !== !1; )
    ;
  return r;
}
var lc = 9007199254740991, cc = /^(?:0|[1-9]\d*)$/;
function po(r, t) {
  var e = typeof r;
  return t = t ?? lc, !!t && (e == "number" || e != "symbol" && cc.test(r)) && r > -1 && r % 1 == 0 && r < t;
}
function $r(r, t, e) {
  t == "__proto__" && kn ? kn(r, t, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : r[t] = e;
}
function Hs(r, t) {
  return r === t || r !== r && t !== t;
}
var uc = Object.prototype, dc = uc.hasOwnProperty;
function go(r, t, e) {
  var s = r[t];
  (!(dc.call(r, t) && Hs(s, e)) || e === void 0 && !(t in r)) && $r(r, t, e);
}
function hc(r, t, e, s) {
  var n = !e;
  e || (e = {});
  for (var i = -1, a = t.length; ++i < a; ) {
    var o = t[i], l = void 0;
    l === void 0 && (l = r[o]), n ? $r(e, o, l) : go(e, o, l);
  }
  return e;
}
var ha = Math.max;
function fc(r, t, e) {
  return t = ha(t === void 0 ? r.length - 1 : t, 0), function() {
    for (var s = arguments, n = -1, i = ha(s.length - t, 0), a = Array(i); ++n < i; )
      a[n] = s[t + n];
    n = -1;
    for (var o = Array(t + 1); ++n < t; )
      o[n] = s[n];
    return o[t] = e(a), Xl(r, this, o);
  };
}
function pc(r, t) {
  return ac(fc(r, t, fo), r + "");
}
var gc = 9007199254740991;
function mo(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= gc;
}
function Fn(r) {
  return r != null && mo(r.length) && !_r(r);
}
function mc(r, t, e) {
  if (!ae(e))
    return !1;
  var s = typeof t;
  return (s == "number" ? Fn(e) && po(t, e.length) : s == "string" && t in e) ? Hs(e[t], r) : !1;
}
function bc(r) {
  return pc(function(t, e) {
    var s = -1, n = e.length, i = n > 1 ? e[n - 1] : void 0, a = n > 2 ? e[2] : void 0;
    for (i = r.length > 3 && typeof i == "function" ? (n--, i) : void 0, a && mc(e[0], e[1], a) && (i = n < 3 ? void 0 : i, n = 1), t = Object(t); ++s < n; ) {
      var o = e[s];
      o && r(t, o, s, i);
    }
    return t;
  });
}
var yc = Object.prototype;
function Br(r) {
  var t = r && r.constructor, e = typeof t == "function" && t.prototype || yc;
  return r === e;
}
function vc(r, t) {
  for (var e = -1, s = Array(r); ++e < r; )
    s[e] = t(e);
  return s;
}
var wc = "[object Arguments]";
function fa(r) {
  return Gt(r) && as(r) == wc;
}
var bo = Object.prototype, Sc = bo.hasOwnProperty, Ac = bo.propertyIsEnumerable, ir = fa(/* @__PURE__ */ function() {
  return arguments;
}()) ? fa : function(r) {
  return Gt(r) && Sc.call(r, "callee") && !Ac.call(r, "callee");
};
function Ec() {
  return !1;
}
var yo = typeof exports == "object" && exports && !exports.nodeType && exports, pa = yo && typeof module == "object" && module && !module.nodeType && module, xc = pa && pa.exports === yo, ga = xc ? Ft.Buffer : void 0, Tc = ga ? ga.isBuffer : void 0, Os = Tc || Ec, Dc = "[object Arguments]", Cc = "[object Array]", Lc = "[object Boolean]", Ic = "[object Date]", Nc = "[object Error]", kc = "[object Function]", qc = "[object Map]", Oc = "[object Number]", Mc = "[object Object]", Rc = "[object RegExp]", _c = "[object Set]", $c = "[object String]", Bc = "[object WeakMap]", Fc = "[object ArrayBuffer]", Pc = "[object DataView]", Hc = "[object Float32Array]", jc = "[object Float64Array]", Uc = "[object Int8Array]", zc = "[object Int16Array]", Vc = "[object Int32Array]", Gc = "[object Uint8Array]", Kc = "[object Uint8ClampedArray]", Yc = "[object Uint16Array]", Wc = "[object Uint32Array]", V = {};
V[Hc] = V[jc] = V[Uc] = V[zc] = V[Vc] = V[Gc] = V[Kc] = V[Yc] = V[Wc] = !0;
V[Dc] = V[Cc] = V[Fc] = V[Lc] = V[Pc] = V[Ic] = V[Nc] = V[kc] = V[qc] = V[Oc] = V[Mc] = V[Rc] = V[_c] = V[$c] = V[Bc] = !1;
function Zc(r) {
  return Gt(r) && mo(r.length) && !!V[as(r)];
}
function Fr(r) {
  return function(t) {
    return r(t);
  };
}
var vo = typeof exports == "object" && exports && !exports.nodeType && exports, Is = vo && typeof module == "object" && module && !module.nodeType && module, Qc = Is && Is.exports === vo, Vi = Qc && uo.process, ts = function() {
  try {
    var r = Is && Is.require && Is.require("util").types;
    return r || Vi && Vi.binding && Vi.binding("util");
  } catch {
  }
}(), ma = ts && ts.isTypedArray, Pr = ma ? Fr(ma) : Zc, Xc = Object.prototype, Jc = Xc.hasOwnProperty;
function wo(r, t) {
  var e = be(r), s = !e && ir(r), n = !e && !s && Os(r), i = !e && !s && !n && Pr(r), a = e || s || n || i, o = a ? vc(r.length, String) : [], l = o.length;
  for (var u in r)
    (t || Jc.call(r, u)) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (u == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    n && (u == "offset" || u == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    i && (u == "buffer" || u == "byteLength" || u == "byteOffset") || // Skip index properties.
    po(u, l))) && o.push(u);
  return o;
}
function So(r, t) {
  return function(e) {
    return r(t(e));
  };
}
var tu = So(Object.keys, Object), eu = Object.prototype, su = eu.hasOwnProperty;
function nu(r) {
  if (!Br(r))
    return tu(r);
  var t = [];
  for (var e in Object(r))
    su.call(r, e) && e != "constructor" && t.push(e);
  return t;
}
function iu(r) {
  return Fn(r) ? wo(r) : nu(r);
}
function ru(r) {
  var t = [];
  if (r != null)
    for (var e in Object(r))
      t.push(e);
  return t;
}
var au = Object.prototype, ou = au.hasOwnProperty;
function lu(r) {
  if (!ae(r))
    return ru(r);
  var t = Br(r), e = [];
  for (var s in r)
    s == "constructor" && (t || !ou.call(r, s)) || e.push(s);
  return e;
}
function Ao(r) {
  return Fn(r) ? wo(r, !0) : lu(r);
}
var Ms = Se(Object, "create");
function cu() {
  this.__data__ = Ms ? Ms(null) : {}, this.size = 0;
}
function uu(r) {
  var t = this.has(r) && delete this.__data__[r];
  return this.size -= t ? 1 : 0, t;
}
var du = "__lodash_hash_undefined__", hu = Object.prototype, fu = hu.hasOwnProperty;
function pu(r) {
  var t = this.__data__;
  if (Ms) {
    var e = t[r];
    return e === du ? void 0 : e;
  }
  return fu.call(t, r) ? t[r] : void 0;
}
var gu = Object.prototype, mu = gu.hasOwnProperty;
function bu(r) {
  var t = this.__data__;
  return Ms ? t[r] !== void 0 : mu.call(t, r);
}
var yu = "__lodash_hash_undefined__";
function vu(r, t) {
  var e = this.__data__;
  return this.size += this.has(r) ? 0 : 1, e[r] = Ms && t === void 0 ? yu : t, this;
}
function ye(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var s = r[t];
    this.set(s[0], s[1]);
  }
}
ye.prototype.clear = cu;
ye.prototype.delete = uu;
ye.prototype.get = pu;
ye.prototype.has = bu;
ye.prototype.set = vu;
function wu() {
  this.__data__ = [], this.size = 0;
}
function Pn(r, t) {
  for (var e = r.length; e--; )
    if (Hs(r[e][0], t))
      return e;
  return -1;
}
var Su = Array.prototype, Au = Su.splice;
function Eu(r) {
  var t = this.__data__, e = Pn(t, r);
  if (e < 0)
    return !1;
  var s = t.length - 1;
  return e == s ? t.pop() : Au.call(t, e, 1), --this.size, !0;
}
function xu(r) {
  var t = this.__data__, e = Pn(t, r);
  return e < 0 ? void 0 : t[e][1];
}
function Tu(r) {
  return Pn(this.__data__, r) > -1;
}
function Du(r, t) {
  var e = this.__data__, s = Pn(e, r);
  return s < 0 ? (++this.size, e.push([r, t])) : e[s][1] = t, this;
}
function Wt(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var s = r[t];
    this.set(s[0], s[1]);
  }
}
Wt.prototype.clear = wu;
Wt.prototype.delete = Eu;
Wt.prototype.get = xu;
Wt.prototype.has = Tu;
Wt.prototype.set = Du;
var Rs = Se(Ft, "Map");
function Cu() {
  this.size = 0, this.__data__ = {
    hash: new ye(),
    map: new (Rs || Wt)(),
    string: new ye()
  };
}
function Lu(r) {
  var t = typeof r;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? r !== "__proto__" : r === null;
}
function Hn(r, t) {
  var e = r.__data__;
  return Lu(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
}
function Iu(r) {
  var t = Hn(this, r).delete(r);
  return this.size -= t ? 1 : 0, t;
}
function Nu(r) {
  return Hn(this, r).get(r);
}
function ku(r) {
  return Hn(this, r).has(r);
}
function qu(r, t) {
  var e = Hn(this, r), s = e.size;
  return e.set(r, t), this.size += e.size == s ? 0 : 1, this;
}
function Ae(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var s = r[t];
    this.set(s[0], s[1]);
  }
}
Ae.prototype.clear = Cu;
Ae.prototype.delete = Iu;
Ae.prototype.get = Nu;
Ae.prototype.has = ku;
Ae.prototype.set = qu;
function Ou(r, t) {
  for (var e = -1, s = t.length, n = r.length; ++e < s; )
    r[n + e] = t[e];
  return r;
}
var Eo = So(Object.getPrototypeOf, Object), Mu = "[object Object]", Ru = Function.prototype, _u = Object.prototype, xo = Ru.toString, $u = _u.hasOwnProperty, Bu = xo.call(Object);
function Fu(r) {
  if (!Gt(r) || as(r) != Mu)
    return !1;
  var t = Eo(r);
  if (t === null)
    return !0;
  var e = $u.call(t, "constructor") && t.constructor;
  return typeof e == "function" && e instanceof e && xo.call(e) == Bu;
}
function Pu() {
  this.__data__ = new Wt(), this.size = 0;
}
function Hu(r) {
  var t = this.__data__, e = t.delete(r);
  return this.size = t.size, e;
}
function ju(r) {
  return this.__data__.get(r);
}
function Uu(r) {
  return this.__data__.has(r);
}
var zu = 200;
function Vu(r, t) {
  var e = this.__data__;
  if (e instanceof Wt) {
    var s = e.__data__;
    if (!Rs || s.length < zu - 1)
      return s.push([r, t]), this.size = ++e.size, this;
    e = this.__data__ = new Ae(s);
  }
  return e.set(r, t), this.size = e.size, this;
}
function Rt(r) {
  var t = this.__data__ = new Wt(r);
  this.size = t.size;
}
Rt.prototype.clear = Pu;
Rt.prototype.delete = Hu;
Rt.prototype.get = ju;
Rt.prototype.has = Uu;
Rt.prototype.set = Vu;
var To = typeof exports == "object" && exports && !exports.nodeType && exports, ba = To && typeof module == "object" && module && !module.nodeType && module, Gu = ba && ba.exports === To, ya = Gu ? Ft.Buffer : void 0, va = ya ? ya.allocUnsafe : void 0;
function Do(r, t) {
  if (t)
    return r.slice();
  var e = r.length, s = va ? va(e) : new r.constructor(e);
  return r.copy(s), s;
}
function Ku(r, t) {
  for (var e = -1, s = r == null ? 0 : r.length, n = 0, i = []; ++e < s; ) {
    var a = r[e];
    t(a, e, r) && (i[n++] = a);
  }
  return i;
}
function Yu() {
  return [];
}
var Wu = Object.prototype, Zu = Wu.propertyIsEnumerable, wa = Object.getOwnPropertySymbols, Qu = wa ? function(r) {
  return r == null ? [] : (r = Object(r), Ku(wa(r), function(t) {
    return Zu.call(r, t);
  }));
} : Yu;
function Xu(r, t, e) {
  var s = t(r);
  return be(r) ? s : Ou(s, e(r));
}
function rr(r) {
  return Xu(r, iu, Qu);
}
var ar = Se(Ft, "DataView"), or = Se(Ft, "Promise"), lr = Se(Ft, "Set"), Sa = "[object Map]", Ju = "[object Object]", Aa = "[object Promise]", Ea = "[object Set]", xa = "[object WeakMap]", Ta = "[object DataView]", td = we(ar), ed = we(Rs), sd = we(or), nd = we(lr), id = we(nr), Et = as;
(ar && Et(new ar(new ArrayBuffer(1))) != Ta || Rs && Et(new Rs()) != Sa || or && Et(or.resolve()) != Aa || lr && Et(new lr()) != Ea || nr && Et(new nr()) != xa) && (Et = function(r) {
  var t = as(r), e = t == Ju ? r.constructor : void 0, s = e ? we(e) : "";
  if (s)
    switch (s) {
      case td:
        return Ta;
      case ed:
        return Sa;
      case sd:
        return Aa;
      case nd:
        return Ea;
      case id:
        return xa;
    }
  return t;
});
var rd = Object.prototype, ad = rd.hasOwnProperty;
function od(r) {
  var t = r.length, e = new r.constructor(t);
  return t && typeof r[0] == "string" && ad.call(r, "index") && (e.index = r.index, e.input = r.input), e;
}
var qn = Ft.Uint8Array;
function Hr(r) {
  var t = new r.constructor(r.byteLength);
  return new qn(t).set(new qn(r)), t;
}
function ld(r, t) {
  var e = Hr(r.buffer);
  return new r.constructor(e, r.byteOffset, r.byteLength);
}
var cd = /\w*$/;
function ud(r) {
  var t = new r.constructor(r.source, cd.exec(r));
  return t.lastIndex = r.lastIndex, t;
}
var Da = re ? re.prototype : void 0, Ca = Da ? Da.valueOf : void 0;
function dd(r) {
  return Ca ? Object(Ca.call(r)) : {};
}
function Co(r, t) {
  var e = t ? Hr(r.buffer) : r.buffer;
  return new r.constructor(e, r.byteOffset, r.length);
}
var hd = "[object Boolean]", fd = "[object Date]", pd = "[object Map]", gd = "[object Number]", md = "[object RegExp]", bd = "[object Set]", yd = "[object String]", vd = "[object Symbol]", wd = "[object ArrayBuffer]", Sd = "[object DataView]", Ad = "[object Float32Array]", Ed = "[object Float64Array]", xd = "[object Int8Array]", Td = "[object Int16Array]", Dd = "[object Int32Array]", Cd = "[object Uint8Array]", Ld = "[object Uint8ClampedArray]", Id = "[object Uint16Array]", Nd = "[object Uint32Array]";
function kd(r, t, e) {
  var s = r.constructor;
  switch (t) {
    case wd:
      return Hr(r);
    case hd:
    case fd:
      return new s(+r);
    case Sd:
      return ld(r);
    case Ad:
    case Ed:
    case xd:
    case Td:
    case Dd:
    case Cd:
    case Ld:
    case Id:
    case Nd:
      return Co(r, e);
    case pd:
      return new s();
    case gd:
    case yd:
      return new s(r);
    case md:
      return ud(r);
    case bd:
      return new s();
    case vd:
      return dd(r);
  }
}
function Lo(r) {
  return typeof r.constructor == "function" && !Br(r) ? Ql(Eo(r)) : {};
}
var qd = "[object Map]";
function Od(r) {
  return Gt(r) && Et(r) == qd;
}
var La = ts && ts.isMap, Md = La ? Fr(La) : Od, Rd = "[object Set]";
function _d(r) {
  return Gt(r) && Et(r) == Rd;
}
var Ia = ts && ts.isSet, $d = Ia ? Fr(Ia) : _d, Bd = 1, Io = "[object Arguments]", Fd = "[object Array]", Pd = "[object Boolean]", Hd = "[object Date]", jd = "[object Error]", No = "[object Function]", Ud = "[object GeneratorFunction]", zd = "[object Map]", Vd = "[object Number]", ko = "[object Object]", Gd = "[object RegExp]", Kd = "[object Set]", Yd = "[object String]", Wd = "[object Symbol]", Zd = "[object WeakMap]", Qd = "[object ArrayBuffer]", Xd = "[object DataView]", Jd = "[object Float32Array]", th = "[object Float64Array]", eh = "[object Int8Array]", sh = "[object Int16Array]", nh = "[object Int32Array]", ih = "[object Uint8Array]", rh = "[object Uint8ClampedArray]", ah = "[object Uint16Array]", oh = "[object Uint32Array]", U = {};
U[Io] = U[Fd] = U[Qd] = U[Xd] = U[Pd] = U[Hd] = U[Jd] = U[th] = U[eh] = U[sh] = U[nh] = U[zd] = U[Vd] = U[ko] = U[Gd] = U[Kd] = U[Yd] = U[Wd] = U[ih] = U[rh] = U[ah] = U[oh] = !0;
U[jd] = U[No] = U[Zd] = !1;
function Ln(r, t, e, s, n, i) {
  var a, o = t & Bd;
  if (a !== void 0)
    return a;
  if (!ae(r))
    return r;
  var l = be(r);
  if (l)
    a = od(r);
  else {
    var u = Et(r), h = u == No || u == Ud;
    if (Os(r))
      return Do(r, o);
    if (u == ko || u == Io || h && !n)
      a = h ? {} : Lo(r);
    else {
      if (!U[u])
        return n ? r : {};
      a = kd(r, u, o);
    }
  }
  i || (i = new Rt());
  var g = i.get(r);
  if (g)
    return g;
  i.set(r, a), $d(r) ? r.forEach(function(y) {
    a.add(Ln(y, t, e, y, r, i));
  }) : Md(r) && r.forEach(function(y, v) {
    a.set(v, Ln(y, t, e, v, r, i));
  });
  var p = rr, m = l ? void 0 : p(r);
  return oc(m || r, function(y, v) {
    m && (v = y, y = r[v]), go(a, v, Ln(y, t, e, v, r, i));
  }), a;
}
var lh = 1, ch = 4;
function ze(r) {
  return Ln(r, lh | ch);
}
var uh = "__lodash_hash_undefined__";
function dh(r) {
  return this.__data__.set(r, uh), this;
}
function hh(r) {
  return this.__data__.has(r);
}
function On(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.__data__ = new Ae(); ++t < e; )
    this.add(r[t]);
}
On.prototype.add = On.prototype.push = dh;
On.prototype.has = hh;
function fh(r, t) {
  for (var e = -1, s = r == null ? 0 : r.length; ++e < s; )
    if (t(r[e], e, r))
      return !0;
  return !1;
}
function ph(r, t) {
  return r.has(t);
}
var gh = 1, mh = 2;
function qo(r, t, e, s, n, i) {
  var a = e & gh, o = r.length, l = t.length;
  if (o != l && !(a && l > o))
    return !1;
  var u = i.get(r), h = i.get(t);
  if (u && h)
    return u == t && h == r;
  var g = -1, p = !0, m = e & mh ? new On() : void 0;
  for (i.set(r, t), i.set(t, r); ++g < o; ) {
    var y = r[g], v = t[g];
    if (s)
      var S = a ? s(v, y, g, t, r, i) : s(y, v, g, r, t, i);
    if (S !== void 0) {
      if (S)
        continue;
      p = !1;
      break;
    }
    if (m) {
      if (!fh(t, function(E, T) {
        if (!ph(m, T) && (y === E || n(y, E, e, s, i)))
          return m.push(T);
      })) {
        p = !1;
        break;
      }
    } else if (!(y === v || n(y, v, e, s, i))) {
      p = !1;
      break;
    }
  }
  return i.delete(r), i.delete(t), p;
}
function bh(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(s, n) {
    e[++t] = [n, s];
  }), e;
}
function yh(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(s) {
    e[++t] = s;
  }), e;
}
var vh = 1, wh = 2, Sh = "[object Boolean]", Ah = "[object Date]", Eh = "[object Error]", xh = "[object Map]", Th = "[object Number]", Dh = "[object RegExp]", Ch = "[object Set]", Lh = "[object String]", Ih = "[object Symbol]", Nh = "[object ArrayBuffer]", kh = "[object DataView]", Na = re ? re.prototype : void 0, Gi = Na ? Na.valueOf : void 0;
function qh(r, t, e, s, n, i, a) {
  switch (e) {
    case kh:
      if (r.byteLength != t.byteLength || r.byteOffset != t.byteOffset)
        return !1;
      r = r.buffer, t = t.buffer;
    case Nh:
      return !(r.byteLength != t.byteLength || !i(new qn(r), new qn(t)));
    case Sh:
    case Ah:
    case Th:
      return Hs(+r, +t);
    case Eh:
      return r.name == t.name && r.message == t.message;
    case Dh:
    case Lh:
      return r == t + "";
    case xh:
      var o = bh;
    case Ch:
      var l = s & vh;
      if (o || (o = yh), r.size != t.size && !l)
        return !1;
      var u = a.get(r);
      if (u)
        return u == t;
      s |= wh, a.set(r, t);
      var h = qo(o(r), o(t), s, n, i, a);
      return a.delete(r), h;
    case Ih:
      if (Gi)
        return Gi.call(r) == Gi.call(t);
  }
  return !1;
}
var Oh = 1, Mh = Object.prototype, Rh = Mh.hasOwnProperty;
function _h(r, t, e, s, n, i) {
  var a = e & Oh, o = rr(r), l = o.length, u = rr(t), h = u.length;
  if (l != h && !a)
    return !1;
  for (var g = l; g--; ) {
    var p = o[g];
    if (!(a ? p in t : Rh.call(t, p)))
      return !1;
  }
  var m = i.get(r), y = i.get(t);
  if (m && y)
    return m == t && y == r;
  var v = !0;
  i.set(r, t), i.set(t, r);
  for (var S = a; ++g < l; ) {
    p = o[g];
    var E = r[p], T = t[p];
    if (s)
      var D = a ? s(T, E, p, t, r, i) : s(E, T, p, r, t, i);
    if (!(D === void 0 ? E === T || n(E, T, e, s, i) : D)) {
      v = !1;
      break;
    }
    S || (S = p == "constructor");
  }
  if (v && !S) {
    var N = r.constructor, L = t.constructor;
    N != L && "constructor" in r && "constructor" in t && !(typeof N == "function" && N instanceof N && typeof L == "function" && L instanceof L) && (v = !1);
  }
  return i.delete(r), i.delete(t), v;
}
var $h = 1, ka = "[object Arguments]", qa = "[object Array]", Sn = "[object Object]", Bh = Object.prototype, Oa = Bh.hasOwnProperty;
function Fh(r, t, e, s, n, i) {
  var a = be(r), o = be(t), l = a ? qa : Et(r), u = o ? qa : Et(t);
  l = l == ka ? Sn : l, u = u == ka ? Sn : u;
  var h = l == Sn, g = u == Sn, p = l == u;
  if (p && Os(r)) {
    if (!Os(t))
      return !1;
    a = !0, h = !1;
  }
  if (p && !h)
    return i || (i = new Rt()), a || Pr(r) ? qo(r, t, e, s, n, i) : qh(r, t, l, e, s, n, i);
  if (!(e & $h)) {
    var m = h && Oa.call(r, "__wrapped__"), y = g && Oa.call(t, "__wrapped__");
    if (m || y) {
      var v = m ? r.value() : r, S = y ? t.value() : t;
      return i || (i = new Rt()), n(v, S, e, s, i);
    }
  }
  return p ? (i || (i = new Rt()), _h(r, t, e, s, n, i)) : !1;
}
function Oo(r, t, e, s, n) {
  return r === t ? !0 : r == null || t == null || !Gt(r) && !Gt(t) ? r !== r && t !== t : Fh(r, t, e, s, Oo, n);
}
function Ph(r) {
  return function(t, e, s) {
    for (var n = -1, i = Object(t), a = s(t), o = a.length; o--; ) {
      var l = a[++n];
      if (e(i[l], l, i) === !1)
        break;
    }
    return t;
  };
}
var Hh = Ph();
function cr(r, t, e) {
  (e !== void 0 && !Hs(r[t], e) || e === void 0 && !(t in r)) && $r(r, t, e);
}
function jh(r) {
  return Gt(r) && Fn(r);
}
function ur(r, t) {
  if (!(t === "constructor" && typeof r[t] == "function") && t != "__proto__")
    return r[t];
}
function Uh(r) {
  return hc(r, Ao(r));
}
function zh(r, t, e, s, n, i, a) {
  var o = ur(r, e), l = ur(t, e), u = a.get(l);
  if (u) {
    cr(r, e, u);
    return;
  }
  var h = i ? i(o, l, e + "", r, t, a) : void 0, g = h === void 0;
  if (g) {
    var p = be(l), m = !p && Os(l), y = !p && !m && Pr(l);
    h = l, p || m || y ? be(o) ? h = o : jh(o) ? h = Jl(o) : m ? (g = !1, h = Do(l, !0)) : y ? (g = !1, h = Co(l, !0)) : h = [] : Fu(l) || ir(l) ? (h = o, ir(o) ? h = Uh(o) : (!ae(o) || _r(o)) && (h = Lo(l))) : g = !1;
  }
  g && (a.set(l, h), n(h, l, s, i, a), a.delete(l)), cr(r, e, h);
}
function Mo(r, t, e, s, n) {
  r !== t && Hh(t, function(i, a) {
    if (n || (n = new Rt()), ae(i))
      zh(r, t, a, e, Mo, s, n);
    else {
      var o = s ? s(ur(r, a), i, a + "", r, t, n) : void 0;
      o === void 0 && (o = i), cr(r, a, o);
    }
  }, Ao);
}
function jr(r, t) {
  return Oo(r, t);
}
var ie = bc(function(r, t, e) {
  Mo(r, t, e);
}), q = /* @__PURE__ */ ((r) => (r[r.TYPE = 3] = "TYPE", r[r.LEVEL = 12] = "LEVEL", r[r.ATTRIBUTE = 13] = "ATTRIBUTE", r[r.BLOT = 14] = "BLOT", r[r.INLINE = 7] = "INLINE", r[r.BLOCK = 11] = "BLOCK", r[r.BLOCK_BLOT = 10] = "BLOCK_BLOT", r[r.INLINE_BLOT = 6] = "INLINE_BLOT", r[r.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", r[r.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", r[r.ANY = 15] = "ANY", r))(q || {});
class $t {
  constructor(t, e, s = {}) {
    this.attrName = t, this.keyName = e;
    const n = q.TYPE & q.ATTRIBUTE;
    this.scope = s.scope != null ? (
      // Ignore type bits, force attribute bit
      s.scope & q.LEVEL | n
    ) : q.ATTRIBUTE, s.whitelist != null && (this.whitelist = s.whitelist);
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
class Ve extends Error {
  constructor(t) {
    t = "[Parchment] " + t, super(t), this.message = t, this.name = this.constructor.name;
  }
}
const Ro = class dr {
  constructor() {
    this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
  }
  static find(t, e = !1) {
    if (t == null)
      return null;
    if (this.blots.has(t))
      return this.blots.get(t) || null;
    if (e) {
      let s = null;
      try {
        s = t.parentNode;
      } catch {
        return null;
      }
      return this.find(s, e);
    }
    return null;
  }
  create(t, e, s) {
    const n = this.query(e);
    if (n == null)
      throw new Ve(`Unable to create ${e} blot`);
    const i = n, a = (
      // @ts-expect-error Fix me later
      e instanceof Node || e.nodeType === Node.TEXT_NODE ? e : i.create(s)
    ), o = new i(t, a, s);
    return dr.blots.set(o.domNode, o), o;
  }
  find(t, e = !1) {
    return dr.find(t, e);
  }
  query(t, e = q.ANY) {
    let s;
    return typeof t == "string" ? s = this.types[t] || this.attributes[t] : t instanceof Text || t.nodeType === Node.TEXT_NODE ? s = this.types.text : typeof t == "number" ? t & q.LEVEL & q.BLOCK ? s = this.types.block : t & q.LEVEL & q.INLINE && (s = this.types.inline) : t instanceof Element && ((t.getAttribute("class") || "").split(/\s+/).some((n) => (s = this.classes[n], !!s)), s = s || this.tags[t.tagName]), s == null ? null : "scope" in s && e & q.LEVEL & s.scope && e & q.TYPE & s.scope ? s : null;
  }
  register(...t) {
    return t.map((e) => {
      const s = "blotName" in e, n = "attrName" in e;
      if (!s && !n)
        throw new Ve("Invalid definition");
      if (s && e.blotName === "abstract")
        throw new Ve("Cannot register abstract class");
      const i = s ? e.blotName : n ? e.attrName : void 0;
      return this.types[i] = e, n ? typeof e.keyName == "string" && (this.attributes[e.keyName] = e) : s && (e.className && (this.classes[e.className] = e), e.tagName && (Array.isArray(e.tagName) ? e.tagName = e.tagName.map((a) => a.toUpperCase()) : e.tagName = e.tagName.toUpperCase(), (Array.isArray(e.tagName) ? e.tagName : [e.tagName]).forEach((a) => {
        (this.tags[a] == null || e.className == null) && (this.tags[a] = e);
      }))), e;
    });
  }
};
Ro.blots = /* @__PURE__ */ new WeakMap();
let es = Ro;
function Ma(r, t) {
  return (r.getAttribute("class") || "").split(/\s+/).filter((e) => e.indexOf(`${t}-`) === 0);
}
class Vh extends $t {
  static keys(t) {
    return (t.getAttribute("class") || "").split(/\s+/).map((e) => e.split("-").slice(0, -1).join("-"));
  }
  add(t, e) {
    return this.canAdd(t, e) ? (this.remove(t), t.classList.add(`${this.keyName}-${e}`), !0) : !1;
  }
  remove(t) {
    Ma(t, this.keyName).forEach((e) => {
      t.classList.remove(e);
    }), t.classList.length === 0 && t.removeAttribute("class");
  }
  value(t) {
    const e = (Ma(t, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(t, e) ? e : "";
  }
}
const Ct = Vh;
function Ki(r) {
  const t = r.split("-"), e = t.slice(1).map((s) => s[0].toUpperCase() + s.slice(1)).join("");
  return t[0] + e;
}
class Gh extends $t {
  static keys(t) {
    return (t.getAttribute("style") || "").split(";").map((e) => e.split(":")[0].trim());
  }
  add(t, e) {
    return this.canAdd(t, e) ? (t.style[Ki(this.keyName)] = e, !0) : !1;
  }
  remove(t) {
    t.style[Ki(this.keyName)] = "", t.getAttribute("style") || t.removeAttribute("style");
  }
  value(t) {
    const e = t.style[Ki(this.keyName)];
    return this.canAdd(t, e) ? e : "";
  }
}
const oe = Gh;
class Kh {
  constructor(t) {
    this.attributes = {}, this.domNode = t, this.build();
  }
  attribute(t, e) {
    e ? t.add(this.domNode, e) && (t.value(this.domNode) != null ? this.attributes[t.attrName] = t : delete this.attributes[t.attrName]) : (t.remove(this.domNode), delete this.attributes[t.attrName]);
  }
  build() {
    this.attributes = {};
    const t = es.find(this.domNode);
    if (t == null)
      return;
    const e = $t.keys(this.domNode), s = Ct.keys(this.domNode), n = oe.keys(this.domNode);
    e.concat(s).concat(n).forEach((i) => {
      const a = t.scroll.query(i, q.ATTRIBUTE);
      a instanceof $t && (this.attributes[a.attrName] = a);
    });
  }
  copy(t) {
    Object.keys(this.attributes).forEach((e) => {
      const s = this.attributes[e].value(this.domNode);
      t.format(e, s);
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
const jn = Kh, _o = class {
  constructor(t, e) {
    this.scroll = t, this.domNode = e, es.blots.set(e, this), this.prev = null, this.next = null;
  }
  static create(t) {
    if (this.tagName == null)
      throw new Ve("Blot definition missing tagName");
    let e, s;
    return Array.isArray(this.tagName) ? (typeof t == "string" ? (s = t.toUpperCase(), parseInt(s, 10).toString() === s && (s = parseInt(s, 10))) : typeof t == "number" && (s = t), typeof s == "number" ? e = document.createElement(this.tagName[s - 1]) : s && this.tagName.indexOf(s) > -1 ? e = document.createElement(s) : e = document.createElement(this.tagName[0])) : e = document.createElement(this.tagName), this.className && e.classList.add(this.className), e;
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
    this.parent != null && this.parent.removeChild(this), es.blots.delete(this.domNode);
  }
  deleteAt(t, e) {
    this.isolate(t, e).remove();
  }
  formatAt(t, e, s, n) {
    const i = this.isolate(t, e);
    if (this.scroll.query(s, q.BLOT) != null && n)
      i.wrap(s, n);
    else if (this.scroll.query(s, q.ATTRIBUTE) != null) {
      const a = this.scroll.create(this.statics.scope);
      i.wrap(a), a.format(s, n);
    }
  }
  insertAt(t, e, s) {
    const n = s == null ? this.scroll.create("text", e) : this.scroll.create(e, s), i = this.split(t);
    this.parent.insertBefore(n, i || void 0);
  }
  isolate(t, e) {
    const s = this.split(t);
    if (s == null)
      throw new Error("Attempt to isolate at end");
    return s.split(e), s;
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
    const s = typeof t == "string" ? this.scroll.create(t, e) : t;
    return this.parent != null && (this.parent.insertBefore(s, this.next || void 0), this.remove()), s;
  }
  split(t, e) {
    return t === 0 ? this : this.next;
  }
  update(t, e) {
  }
  wrap(t, e) {
    const s = typeof t == "string" ? this.scroll.create(t, e) : t;
    if (this.parent != null && this.parent.insertBefore(s, this.next || void 0), typeof s.appendChild != "function")
      throw new Ve(`Cannot wrap ${t}`);
    return s.appendChild(this), s;
  }
};
_o.blotName = "abstract";
let $o = _o;
const Bo = class extends $o {
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
    let s = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
    return t > 0 && (s += 1), [this.parent.domNode, s];
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
Bo.scope = q.INLINE_BLOT;
let Yh = Bo;
const st = Yh;
class Wh {
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
    let s = e();
    for (; s && t > 0; )
      t -= 1, s = e();
    return s;
  }
  contains(t) {
    const e = this.iterator();
    let s = e();
    for (; s; ) {
      if (s === t)
        return !0;
      s = e();
    }
    return !1;
  }
  indexOf(t) {
    const e = this.iterator();
    let s = e(), n = 0;
    for (; s; ) {
      if (s === t)
        return n;
      n += 1, s = e();
    }
    return -1;
  }
  insertBefore(t, e) {
    t != null && (this.remove(t), t.next = e, e != null ? (t.prev = e.prev, e.prev != null && (e.prev.next = t), e.prev = t, e === this.head && (this.head = t)) : this.tail != null ? (this.tail.next = t, t.prev = this.tail, this.tail = t) : (t.prev = null, this.head = this.tail = t), this.length += 1);
  }
  offset(t) {
    let e = 0, s = this.head;
    for (; s != null; ) {
      if (s === t)
        return e;
      e += s.length(), s = s.next;
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
    const s = this.iterator();
    let n = s();
    for (; n; ) {
      const i = n.length();
      if (t < i || e && t === i && (n.next == null || n.next.length() !== 0))
        return [n, t];
      t -= i, n = s();
    }
    return [null, 0];
  }
  forEach(t) {
    const e = this.iterator();
    let s = e();
    for (; s; )
      t(s), s = e();
  }
  forEachAt(t, e, s) {
    if (e <= 0)
      return;
    const [n, i] = this.find(t);
    let a = t - i;
    const o = this.iterator(n);
    let l = o();
    for (; l && a < t + e; ) {
      const u = l.length();
      t > a ? s(
        l,
        t - a,
        Math.min(e, a + u - t)
      ) : s(l, 0, Math.min(u, t + e - a)), a += u, l = o();
    }
  }
  map(t) {
    return this.reduce((e, s) => (e.push(t(s)), e), []);
  }
  reduce(t, e) {
    const s = this.iterator();
    let n = s();
    for (; n; )
      e = t(e, n), n = s();
    return e;
  }
}
function Ra(r, t) {
  const e = t.find(r);
  if (e)
    return e;
  try {
    return t.create(r);
  } catch {
    const s = t.create(q.INLINE);
    return Array.from(r.childNodes).forEach((n) => {
      s.domNode.appendChild(n);
    }), r.parentNode && r.parentNode.replaceChild(s.domNode, r), s.attach(), s;
  }
}
const Fo = class te extends $o {
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
    this.uiNode != null && this.uiNode.remove(), this.uiNode = t, te.uiClass && this.uiNode.classList.add(te.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new Wh(), Array.from(this.domNode.childNodes).filter((t) => t !== this.uiNode).reverse().forEach((t) => {
      try {
        const e = Ra(t, this.scroll);
        this.insertBefore(e, this.children.head || void 0);
      } catch (e) {
        if (e instanceof Ve)
          return;
        throw e;
      }
    });
  }
  deleteAt(t, e) {
    if (t === 0 && e === this.length())
      return this.remove();
    this.children.forEachAt(t, e, (s, n, i) => {
      s.deleteAt(n, i);
    });
  }
  descendant(t, e = 0) {
    const [s, n] = this.children.find(e);
    return t.blotName == null && t(s) || t.blotName != null && s instanceof t ? [s, n] : s instanceof te ? s.descendant(t, n) : [null, -1];
  }
  descendants(t, e = 0, s = Number.MAX_VALUE) {
    let n = [], i = s;
    return this.children.forEachAt(
      e,
      s,
      (a, o, l) => {
        (t.blotName == null && t(a) || t.blotName != null && a instanceof t) && n.push(a), a instanceof te && (n = n.concat(
          a.descendants(t, o, i)
        )), i -= l;
      }
    ), n;
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
        (s) => e instanceof s
      ) || (e.statics.scope === q.BLOCK_BLOT ? (e.next != null && this.splitAfter(e), e.prev != null && this.splitAfter(e.prev), e.parent.unwrap(), t = !0) : e instanceof te ? e.unwrap() : e.remove());
    });
  }
  formatAt(t, e, s, n) {
    this.children.forEachAt(t, e, (i, a, o) => {
      i.formatAt(a, o, s, n);
    });
  }
  insertAt(t, e, s) {
    const [n, i] = this.children.find(t);
    if (n)
      n.insertAt(i, e, s);
    else {
      const a = s == null ? this.scroll.create("text", e) : this.scroll.create(e, s);
      this.appendChild(a);
    }
  }
  insertBefore(t, e) {
    t.parent != null && t.parent.children.remove(t);
    let s = null;
    this.children.insertBefore(t, e || null), t.parent = this, e != null && (s = e.domNode), (this.domNode.parentNode !== t.domNode || this.domNode.nextSibling !== s) && this.domNode.insertBefore(t.domNode, s), t.attach();
  }
  length() {
    return this.children.reduce((t, e) => t + e.length(), 0);
  }
  moveChildren(t, e) {
    this.children.forEach((s) => {
      t.insertBefore(s, e);
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
    const [s, n] = this.children.find(t, e), i = [[this, t]];
    return s instanceof te ? i.concat(s.path(n, e)) : (s != null && i.push([s, n]), i);
  }
  removeChild(t) {
    this.children.remove(t);
  }
  replaceWith(t, e) {
    const s = typeof t == "string" ? this.scroll.create(t, e) : t;
    return s instanceof te && this.moveChildren(s), super.replaceWith(s);
  }
  split(t, e = !1) {
    if (!e) {
      if (t === 0)
        return this;
      if (t === this.length())
        return this.next;
    }
    const s = this.clone();
    return this.parent && this.parent.insertBefore(s, this.next || void 0), this.children.forEachAt(t, this.length(), (n, i, a) => {
      const o = n.split(i, e);
      o != null && s.appendChild(o);
    }), s;
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
    const s = [], n = [];
    t.forEach((i) => {
      i.target === this.domNode && i.type === "childList" && (s.push(...i.addedNodes), n.push(...i.removedNodes));
    }), n.forEach((i) => {
      if (i.parentNode != null && // @ts-expect-error Fix me later
      i.tagName !== "IFRAME" && document.body.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY)
        return;
      const a = this.scroll.find(i);
      a != null && (a.domNode.parentNode == null || a.domNode.parentNode === this.domNode) && a.detach();
    }), s.filter((i) => i.parentNode === this.domNode && i !== this.uiNode).sort((i, a) => i === a ? 0 : i.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1).forEach((i) => {
      let a = null;
      i.nextSibling != null && (a = this.scroll.find(i.nextSibling));
      const o = Ra(i, this.scroll);
      (o.next !== a || o.next == null) && (o.parent != null && o.parent.removeChild(this), this.insertBefore(o, a || void 0));
    }), this.enforceAllowedChildren();
  }
};
Fo.uiClass = "";
let Zh = Fo;
const Tt = Zh;
function Qh(r, t) {
  if (Object.keys(r).length !== Object.keys(t).length)
    return !1;
  for (const e in r)
    if (r[e] !== t[e])
      return !1;
  return !0;
}
const $e = class Be extends Tt {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const s = e.query(Be.blotName);
    if (!(s != null && t.tagName === s.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new jn(this.domNode);
  }
  format(t, e) {
    if (t === this.statics.blotName && !e)
      this.children.forEach((s) => {
        s instanceof Be || (s = s.wrap(Be.blotName, !0)), this.attributes.copy(s);
      }), this.unwrap();
    else {
      const s = this.scroll.query(t, q.INLINE);
      if (s == null)
        return;
      s instanceof $t ? this.attributes.attribute(s, e) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e);
    }
  }
  formats() {
    const t = this.attributes.values(), e = this.statics.formats(this.domNode, this.scroll);
    return e != null && (t[this.statics.blotName] = e), t;
  }
  formatAt(t, e, s, n) {
    this.formats()[s] != null || this.scroll.query(s, q.ATTRIBUTE) ? this.isolate(t, e).format(s, n) : super.formatAt(t, e, s, n);
  }
  optimize(t) {
    super.optimize(t);
    const e = this.formats();
    if (Object.keys(e).length === 0)
      return this.unwrap();
    const s = this.next;
    s instanceof Be && s.prev === this && Qh(e, s.formats()) && (s.moveChildren(this), s.remove());
  }
  replaceWith(t, e) {
    const s = super.replaceWith(t, e);
    return this.attributes.copy(s), s;
  }
  update(t, e) {
    super.update(t, e), t.some(
      (s) => s.target === this.domNode && s.type === "attributes"
    ) && this.attributes.build();
  }
  wrap(t, e) {
    const s = super.wrap(t, e);
    return s instanceof Be && this.attributes.move(s), s;
  }
};
$e.allowedChildren = [$e, st], $e.blotName = "inline", $e.scope = q.INLINE_BLOT, $e.tagName = "SPAN";
let Xh = $e;
const Ur = Xh, Fe = class hr extends Tt {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const s = e.query(hr.blotName);
    if (!(s != null && t.tagName === s.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new jn(this.domNode);
  }
  format(t, e) {
    const s = this.scroll.query(t, q.BLOCK);
    s != null && (s instanceof $t ? this.attributes.attribute(s, e) : t === this.statics.blotName && !e ? this.replaceWith(hr.blotName) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e));
  }
  formats() {
    const t = this.attributes.values(), e = this.statics.formats(this.domNode, this.scroll);
    return e != null && (t[this.statics.blotName] = e), t;
  }
  formatAt(t, e, s, n) {
    this.scroll.query(s, q.BLOCK) != null ? this.format(s, n) : super.formatAt(t, e, s, n);
  }
  insertAt(t, e, s) {
    if (s == null || this.scroll.query(e, q.INLINE) != null)
      super.insertAt(t, e, s);
    else {
      const n = this.split(t);
      if (n != null) {
        const i = this.scroll.create(e, s);
        n.parent.insertBefore(i, n);
      } else
        throw new Error("Attempt to insertAt after block boundaries");
    }
  }
  replaceWith(t, e) {
    const s = super.replaceWith(t, e);
    return this.attributes.copy(s), s;
  }
  update(t, e) {
    super.update(t, e), t.some(
      (s) => s.target === this.domNode && s.type === "attributes"
    ) && this.attributes.build();
  }
};
Fe.blotName = "block", Fe.scope = q.BLOCK_BLOT, Fe.tagName = "P", Fe.allowedChildren = [
  Ur,
  Fe,
  st
];
let Jh = Fe;
const _s = Jh, fr = class extends Tt {
  checkMerge() {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  }
  deleteAt(t, e) {
    super.deleteAt(t, e), this.enforceAllowedChildren();
  }
  formatAt(t, e, s, n) {
    super.formatAt(t, e, s, n), this.enforceAllowedChildren();
  }
  insertAt(t, e, s) {
    super.insertAt(t, e, s), this.enforceAllowedChildren();
  }
  optimize(t) {
    super.optimize(t), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
  }
};
fr.blotName = "container", fr.scope = q.BLOCK_BLOT;
let tf = fr;
const Un = tf;
class ef extends st {
  static formats(t, e) {
  }
  format(t, e) {
    super.formatAt(0, this.length(), t, e);
  }
  formatAt(t, e, s, n) {
    t === 0 && e === this.length() ? this.format(s, n) : super.formatAt(t, e, s, n);
  }
  formats() {
    return this.statics.formats(this.domNode, this.scroll);
  }
}
const ut = ef, sf = {
  attributes: !0,
  characterData: !0,
  characterDataOldValue: !0,
  childList: !0,
  subtree: !0
}, nf = 100, Pe = class extends Tt {
  constructor(t, e) {
    super(null, e), this.registry = t, this.scroll = this, this.build(), this.observer = new MutationObserver((s) => {
      this.update(s);
    }), this.observer.observe(this.domNode, sf), this.attach();
  }
  create(t, e) {
    return this.registry.create(this, t, e);
  }
  find(t, e = !1) {
    const s = this.registry.find(t, e);
    return s ? s.scroll === this ? s : e ? this.find(s.scroll.domNode.parentNode, !0) : null : null;
  }
  query(t, e = q.ANY) {
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
    this.update(), t === 0 && e === this.length() ? this.children.forEach((s) => {
      s.remove();
    }) : super.deleteAt(t, e);
  }
  formatAt(t, e, s, n) {
    this.update(), super.formatAt(t, e, s, n);
  }
  insertAt(t, e, s) {
    this.update(), super.insertAt(t, e, s);
  }
  optimize(t = [], e = {}) {
    super.optimize(e);
    const s = e.mutationsMap || /* @__PURE__ */ new WeakMap();
    let n = Array.from(this.observer.takeRecords());
    for (; n.length > 0; )
      t.push(n.pop());
    const i = (l, u = !0) => {
      l == null || l === this || l.domNode.parentNode != null && (s.has(l.domNode) || s.set(l.domNode, []), u && i(l.parent));
    }, a = (l) => {
      s.has(l.domNode) && (l instanceof Tt && l.children.forEach(a), s.delete(l.domNode), l.optimize(e));
    };
    let o = t;
    for (let l = 0; o.length > 0; l += 1) {
      if (l >= nf)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (o.forEach((u) => {
        const h = this.find(u.target, !0);
        h != null && (h.domNode === u.target && (u.type === "childList" ? (i(this.find(u.previousSibling, !1)), Array.from(u.addedNodes).forEach((g) => {
          const p = this.find(g, !1);
          i(p, !1), p instanceof Tt && p.children.forEach((m) => {
            i(m, !1);
          });
        })) : u.type === "attributes" && i(h.prev)), i(h));
      }), this.children.forEach(a), o = Array.from(this.observer.takeRecords()), n = o.slice(); n.length > 0; )
        t.push(n.pop());
    }
  }
  update(t, e = {}) {
    t = t || this.observer.takeRecords();
    const s = /* @__PURE__ */ new WeakMap();
    t.map((n) => {
      const i = this.find(n.target, !0);
      return i == null ? null : s.has(i.domNode) ? (s.get(i.domNode).push(n), null) : (s.set(i.domNode, [n]), i);
    }).forEach((n) => {
      n != null && n !== this && s.has(n.domNode) && n.update(s.get(n.domNode) || [], e);
    }), e.mutationsMap = s, s.has(this.domNode) && super.update(s.get(this.domNode), e), this.optimize(t, e);
  }
};
Pe.blotName = "scroll", Pe.defaultChild = _s, Pe.allowedChildren = [_s, Un], Pe.scope = q.BLOCK_BLOT, Pe.tagName = "DIV";
let rf = Pe;
const zr = rf, pr = class Po extends st {
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
  insertAt(t, e, s) {
    s == null ? (this.text = this.text.slice(0, t) + e + this.text.slice(t), this.domNode.data = this.text) : super.insertAt(t, e, s);
  }
  length() {
    return this.text.length;
  }
  optimize(t) {
    super.optimize(t), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof Po && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
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
    const s = this.scroll.create(this.domNode.splitText(t));
    return this.parent.insertBefore(s, this.next || void 0), this.text = this.statics.value(this.domNode), s;
  }
  update(t, e) {
    t.some((s) => s.type === "characterData" && s.target === this.domNode) && (this.text = this.statics.value(this.domNode));
  }
  value() {
    return this.text;
  }
};
pr.blotName = "text", pr.scope = q.INLINE_BLOT;
let af = pr;
const Mn = af, of = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Attributor: $t,
  AttributorStore: jn,
  BlockBlot: _s,
  ClassAttributor: Ct,
  ContainerBlot: Un,
  EmbedBlot: ut,
  InlineBlot: Ur,
  LeafBlot: st,
  ParentBlot: Tt,
  Registry: es,
  Scope: q,
  ScrollBlot: zr,
  StyleAttributor: oe,
  TextBlot: Mn
}, Symbol.toStringTag, { value: "Module" }));
var ee = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ho(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var gr = { exports: {} }, ct = -1, at = 1, W = 0;
function $s(r, t, e, s, n) {
  if (r === t)
    return r ? [[W, r]] : [];
  if (e != null) {
    var i = mf(r, t, e);
    if (i)
      return i;
  }
  var a = Vr(r, t), o = r.substring(0, a);
  r = r.substring(a), t = t.substring(a), a = zn(r, t);
  var l = r.substring(r.length - a);
  r = r.substring(0, r.length - a), t = t.substring(0, t.length - a);
  var u = lf(r, t);
  return o && u.unshift([W, o]), l && u.push([W, l]), Gr(u, n), s && df(u), u;
}
function lf(r, t) {
  var e;
  if (!r)
    return [[at, t]];
  if (!t)
    return [[ct, r]];
  var s = r.length > t.length ? r : t, n = r.length > t.length ? t : r, i = s.indexOf(n);
  if (i !== -1)
    return e = [
      [at, s.substring(0, i)],
      [W, n],
      [at, s.substring(i + n.length)]
    ], r.length > t.length && (e[0][0] = e[2][0] = ct), e;
  if (n.length === 1)
    return [
      [ct, r],
      [at, t]
    ];
  var a = uf(r, t);
  if (a) {
    var o = a[0], l = a[1], u = a[2], h = a[3], g = a[4], p = $s(o, u), m = $s(l, h);
    return p.concat([[W, g]], m);
  }
  return cf(r, t);
}
function cf(r, t) {
  for (var e = r.length, s = t.length, n = Math.ceil((e + s) / 2), i = n, a = 2 * n, o = new Array(a), l = new Array(a), u = 0; u < a; u++)
    o[u] = -1, l[u] = -1;
  o[i + 1] = 0, l[i + 1] = 0;
  for (var h = e - s, g = h % 2 !== 0, p = 0, m = 0, y = 0, v = 0, S = 0; S < n; S++) {
    for (var E = -S + p; E <= S - m; E += 2) {
      var T = i + E, D;
      E === -S || E !== S && o[T - 1] < o[T + 1] ? D = o[T + 1] : D = o[T - 1] + 1;
      for (var N = D - E; D < e && N < s && r.charAt(D) === t.charAt(N); )
        D++, N++;
      if (o[T] = D, D > e)
        m += 2;
      else if (N > s)
        p += 2;
      else if (g) {
        var L = i + h - E;
        if (L >= 0 && L < a && l[L] !== -1) {
          var M = e - l[L];
          if (D >= M)
            return _a(r, t, D, N);
        }
      }
    }
    for (var $ = -S + y; $ <= S - v; $ += 2) {
      var L = i + $, M;
      $ === -S || $ !== S && l[L - 1] < l[L + 1] ? M = l[L + 1] : M = l[L - 1] + 1;
      for (var z = M - $; M < e && z < s && r.charAt(e - M - 1) === t.charAt(s - z - 1); )
        M++, z++;
      if (l[L] = M, M > e)
        v += 2;
      else if (z > s)
        y += 2;
      else if (!g) {
        var T = i + h - $;
        if (T >= 0 && T < a && o[T] !== -1) {
          var D = o[T], N = i + D - T;
          if (M = e - M, D >= M)
            return _a(r, t, D, N);
        }
      }
    }
  }
  return [
    [ct, r],
    [at, t]
  ];
}
function _a(r, t, e, s) {
  var n = r.substring(0, e), i = t.substring(0, s), a = r.substring(e), o = t.substring(s), l = $s(n, i), u = $s(a, o);
  return l.concat(u);
}
function Vr(r, t) {
  if (!r || !t || r.charAt(0) !== t.charAt(0))
    return 0;
  for (var e = 0, s = Math.min(r.length, t.length), n = s, i = 0; e < n; )
    r.substring(i, n) == t.substring(i, n) ? (e = n, i = e) : s = n, n = Math.floor((s - e) / 2 + e);
  return jo(r.charCodeAt(n - 1)) && n--, n;
}
function $a(r, t) {
  var e = r.length, s = t.length;
  if (e == 0 || s == 0)
    return 0;
  e > s ? r = r.substring(e - s) : e < s && (t = t.substring(0, e));
  var n = Math.min(e, s);
  if (r == t)
    return n;
  for (var i = 0, a = 1; ; ) {
    var o = r.substring(n - a), l = t.indexOf(o);
    if (l == -1)
      return i;
    a += l, (l == 0 || r.substring(n - a) == t.substring(0, a)) && (i = a, a++);
  }
}
function zn(r, t) {
  if (!r || !t || r.slice(-1) !== t.slice(-1))
    return 0;
  for (var e = 0, s = Math.min(r.length, t.length), n = s, i = 0; e < n; )
    r.substring(r.length - n, r.length - i) == t.substring(t.length - n, t.length - i) ? (e = n, i = e) : s = n, n = Math.floor((s - e) / 2 + e);
  return Uo(r.charCodeAt(r.length - n)) && n--, n;
}
function uf(r, t) {
  var e = r.length > t.length ? r : t, s = r.length > t.length ? t : r;
  if (e.length < 4 || s.length * 2 < e.length)
    return null;
  function n(m, y, v) {
    for (var S = m.substring(v, v + Math.floor(m.length / 4)), E = -1, T = "", D, N, L, M; (E = y.indexOf(S, E + 1)) !== -1; ) {
      var $ = Vr(
        m.substring(v),
        y.substring(E)
      ), z = zn(
        m.substring(0, v),
        y.substring(0, E)
      );
      T.length < z + $ && (T = y.substring(E - z, E) + y.substring(E, E + $), D = m.substring(0, v - z), N = m.substring(v + $), L = y.substring(0, E - z), M = y.substring(E + $));
    }
    return T.length * 2 >= m.length ? [
      D,
      N,
      L,
      M,
      T
    ] : null;
  }
  var i = n(
    e,
    s,
    Math.ceil(e.length / 4)
  ), a = n(
    e,
    s,
    Math.ceil(e.length / 2)
  ), o;
  if (!i && !a)
    return null;
  a ? i ? o = i[4].length > a[4].length ? i : a : o = a : o = i;
  var l, u, h, g;
  r.length > t.length ? (l = o[0], u = o[1], h = o[2], g = o[3]) : (h = o[0], g = o[1], l = o[2], u = o[3]);
  var p = o[4];
  return [l, u, h, g, p];
}
function df(r) {
  for (var t = !1, e = [], s = 0, n = null, i = 0, a = 0, o = 0, l = 0, u = 0; i < r.length; )
    r[i][0] == W ? (e[s++] = i, a = l, o = u, l = 0, u = 0, n = r[i][1]) : (r[i][0] == at ? l += r[i][1].length : u += r[i][1].length, n && n.length <= Math.max(a, o) && n.length <= Math.max(l, u) && (r.splice(e[s - 1], 0, [
      ct,
      n
    ]), r[e[s - 1] + 1][0] = at, s--, s--, i = s > 0 ? e[s - 1] : -1, a = 0, o = 0, l = 0, u = 0, n = null, t = !0)), i++;
  for (t && Gr(r), pf(r), i = 1; i < r.length; ) {
    if (r[i - 1][0] == ct && r[i][0] == at) {
      var h = r[i - 1][1], g = r[i][1], p = $a(h, g), m = $a(g, h);
      p >= m ? (p >= h.length / 2 || p >= g.length / 2) && (r.splice(i, 0, [
        W,
        g.substring(0, p)
      ]), r[i - 1][1] = h.substring(
        0,
        h.length - p
      ), r[i + 1][1] = g.substring(p), i++) : (m >= h.length / 2 || m >= g.length / 2) && (r.splice(i, 0, [
        W,
        h.substring(0, m)
      ]), r[i - 1][0] = at, r[i - 1][1] = g.substring(
        0,
        g.length - m
      ), r[i + 1][0] = ct, r[i + 1][1] = h.substring(m), i++), i++;
    }
    i++;
  }
}
var Ba = /[^a-zA-Z0-9]/, Fa = /\s/, Pa = /[\r\n]/, hf = /\n\r?\n$/, ff = /^\r?\n\r?\n/;
function pf(r) {
  function t(m, y) {
    if (!m || !y)
      return 6;
    var v = m.charAt(m.length - 1), S = y.charAt(0), E = v.match(Ba), T = S.match(Ba), D = E && v.match(Fa), N = T && S.match(Fa), L = D && v.match(Pa), M = N && S.match(Pa), $ = L && m.match(hf), z = M && y.match(ff);
    return $ || z ? 5 : L || M ? 4 : E && !D && N ? 3 : D || N ? 2 : E || T ? 1 : 0;
  }
  for (var e = 1; e < r.length - 1; ) {
    if (r[e - 1][0] == W && r[e + 1][0] == W) {
      var s = r[e - 1][1], n = r[e][1], i = r[e + 1][1], a = zn(s, n);
      if (a) {
        var o = n.substring(n.length - a);
        s = s.substring(0, s.length - a), n = o + n.substring(0, n.length - a), i = o + i;
      }
      for (var l = s, u = n, h = i, g = t(s, n) + t(n, i); n.charAt(0) === i.charAt(0); ) {
        s += n.charAt(0), n = n.substring(1) + i.charAt(0), i = i.substring(1);
        var p = t(s, n) + t(n, i);
        p >= g && (g = p, l = s, u = n, h = i);
      }
      r[e - 1][1] != l && (l ? r[e - 1][1] = l : (r.splice(e - 1, 1), e--), r[e][1] = u, h ? r[e + 1][1] = h : (r.splice(e + 1, 1), e--));
    }
    e++;
  }
}
function Gr(r, t) {
  r.push([W, ""]);
  for (var e = 0, s = 0, n = 0, i = "", a = "", o; e < r.length; ) {
    if (e < r.length - 1 && !r[e][1]) {
      r.splice(e, 1);
      continue;
    }
    switch (r[e][0]) {
      case at:
        n++, a += r[e][1], e++;
        break;
      case ct:
        s++, i += r[e][1], e++;
        break;
      case W:
        var l = e - n - s - 1;
        if (t) {
          if (l >= 0 && Vo(r[l][1])) {
            var u = r[l][1].slice(-1);
            if (r[l][1] = r[l][1].slice(
              0,
              -1
            ), i = u + i, a = u + a, !r[l][1]) {
              r.splice(l, 1), e--;
              var h = l - 1;
              r[h] && r[h][0] === at && (n++, a = r[h][1] + a, h--), r[h] && r[h][0] === ct && (s++, i = r[h][1] + i, h--), l = h;
            }
          }
          if (zo(r[e][1])) {
            var u = r[e][1].charAt(0);
            r[e][1] = r[e][1].slice(1), i += u, a += u;
          }
        }
        if (e < r.length - 1 && !r[e][1]) {
          r.splice(e, 1);
          break;
        }
        if (i.length > 0 || a.length > 0) {
          i.length > 0 && a.length > 0 && (o = Vr(a, i), o !== 0 && (l >= 0 ? r[l][1] += a.substring(
            0,
            o
          ) : (r.splice(0, 0, [
            W,
            a.substring(0, o)
          ]), e++), a = a.substring(o), i = i.substring(o)), o = zn(a, i), o !== 0 && (r[e][1] = a.substring(a.length - o) + r[e][1], a = a.substring(
            0,
            a.length - o
          ), i = i.substring(
            0,
            i.length - o
          )));
          var g = n + s;
          i.length === 0 && a.length === 0 ? (r.splice(e - g, g), e = e - g) : i.length === 0 ? (r.splice(e - g, g, [at, a]), e = e - g + 1) : a.length === 0 ? (r.splice(e - g, g, [ct, i]), e = e - g + 1) : (r.splice(
            e - g,
            g,
            [ct, i],
            [at, a]
          ), e = e - g + 2);
        }
        e !== 0 && r[e - 1][0] === W ? (r[e - 1][1] += r[e][1], r.splice(e, 1)) : e++, n = 0, s = 0, i = "", a = "";
        break;
    }
  }
  r[r.length - 1][1] === "" && r.pop();
  var p = !1;
  for (e = 1; e < r.length - 1; )
    r[e - 1][0] === W && r[e + 1][0] === W && (r[e][1].substring(
      r[e][1].length - r[e - 1][1].length
    ) === r[e - 1][1] ? (r[e][1] = r[e - 1][1] + r[e][1].substring(
      0,
      r[e][1].length - r[e - 1][1].length
    ), r[e + 1][1] = r[e - 1][1] + r[e + 1][1], r.splice(e - 1, 1), p = !0) : r[e][1].substring(0, r[e + 1][1].length) == r[e + 1][1] && (r[e - 1][1] += r[e + 1][1], r[e][1] = r[e][1].substring(r[e + 1][1].length) + r[e + 1][1], r.splice(e + 1, 1), p = !0)), e++;
  p && Gr(r, t);
}
function jo(r) {
  return r >= 55296 && r <= 56319;
}
function Uo(r) {
  return r >= 56320 && r <= 57343;
}
function zo(r) {
  return Uo(r.charCodeAt(0));
}
function Vo(r) {
  return jo(r.charCodeAt(r.length - 1));
}
function gf(r) {
  for (var t = [], e = 0; e < r.length; e++)
    r[e][1].length > 0 && t.push(r[e]);
  return t;
}
function Yi(r, t, e, s) {
  return Vo(r) || zo(s) ? null : gf([
    [W, r],
    [ct, t],
    [at, e],
    [W, s]
  ]);
}
function mf(r, t, e) {
  var s = typeof e == "number" ? { index: e, length: 0 } : e.oldRange, n = typeof e == "number" ? null : e.newRange, i = r.length, a = t.length;
  if (s.length === 0 && (n === null || n.length === 0)) {
    var o = s.index, l = r.slice(0, o), u = r.slice(o), h = n ? n.index : null;
    t: {
      var g = o + a - i;
      if (h !== null && h !== g || g < 0 || g > a)
        break t;
      var p = t.slice(0, g), m = t.slice(g);
      if (m !== u)
        break t;
      var y = Math.min(o, g), v = l.slice(0, y), S = p.slice(0, y);
      if (v !== S)
        break t;
      var E = l.slice(y), T = p.slice(y);
      return Yi(v, E, T, u);
    }
    t: {
      if (h !== null && h !== o)
        break t;
      var D = o, p = t.slice(0, D), m = t.slice(D);
      if (p !== l)
        break t;
      var N = Math.min(i - D, a - D), L = u.slice(u.length - N), M = m.slice(m.length - N);
      if (L !== M)
        break t;
      var E = u.slice(0, u.length - N), T = m.slice(0, m.length - N);
      return Yi(l, E, T, L);
    }
  }
  if (s.length > 0 && n && n.length === 0)
    t: {
      var v = r.slice(0, s.index), L = r.slice(s.index + s.length), y = v.length, N = L.length;
      if (a < y + N)
        break t;
      var S = t.slice(0, y), M = t.slice(a - N);
      if (v !== S || L !== M)
        break t;
      var E = r.slice(y, i - N), T = t.slice(y, a - N);
      return Yi(v, E, T, L);
    }
  return null;
}
function Vn(r, t, e, s) {
  return $s(r, t, e, s, !0);
}
Vn.INSERT = at;
Vn.DELETE = ct;
Vn.EQUAL = W;
var bf = Vn, Rn = { exports: {} };
Rn.exports;
(function(r, t) {
  var e = 200, s = "__lodash_hash_undefined__", n = 9007199254740991, i = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", l = "[object Date]", u = "[object Error]", h = "[object Function]", g = "[object GeneratorFunction]", p = "[object Map]", m = "[object Number]", y = "[object Object]", v = "[object Promise]", S = "[object RegExp]", E = "[object Set]", T = "[object String]", D = "[object Symbol]", N = "[object WeakMap]", L = "[object ArrayBuffer]", M = "[object DataView]", $ = "[object Float32Array]", z = "[object Float64Array]", Pt = "[object Int8Array]", Qt = "[object Int16Array]", le = "[object Int32Array]", ce = "[object Uint8Array]", Gs = "[object Uint8ClampedArray]", Ks = "[object Uint16Array]", Ys = "[object Uint32Array]", Zn = /[\\^$.*+?()[\]{}|]/g, Qn = /\w*$/, Xn = /^\[object .+?Constructor\]$/, Jn = /^(?:0|[1-9]\d*)$/, H = {};
  H[i] = H[a] = H[L] = H[M] = H[o] = H[l] = H[$] = H[z] = H[Pt] = H[Qt] = H[le] = H[p] = H[m] = H[y] = H[S] = H[E] = H[T] = H[D] = H[ce] = H[Gs] = H[Ks] = H[Ys] = !0, H[u] = H[h] = H[N] = !1;
  var ti = typeof ee == "object" && ee && ee.Object === Object && ee, ei = typeof self == "object" && self && self.Object === Object && self, bt = ti || ei || Function("return this")(), Ws = t && !t.nodeType && t, j = Ws && !0 && r && !r.nodeType && r, Zs = j && j.exports === Ws;
  function si(c, d) {
    return c.set(d[0], d[1]), c;
  }
  function yt(c, d) {
    return c.add(d), c;
  }
  function Qs(c, d) {
    for (var b = -1, A = c ? c.length : 0; ++b < A && d(c[b], b, c) !== !1; )
      ;
    return c;
  }
  function Xs(c, d) {
    for (var b = -1, A = d.length, R = c.length; ++b < A; )
      c[R + b] = d[b];
    return c;
  }
  function os(c, d, b, A) {
    for (var R = -1, O = c ? c.length : 0; ++R < O; )
      b = d(b, c[R], R, c);
    return b;
  }
  function ls(c, d) {
    for (var b = -1, A = Array(c); ++b < c; )
      A[b] = d(b);
    return A;
  }
  function Js(c, d) {
    return c == null ? void 0 : c[d];
  }
  function cs(c) {
    var d = !1;
    if (c != null && typeof c.toString != "function")
      try {
        d = !!(c + "");
      } catch {
      }
    return d;
  }
  function tn(c) {
    var d = -1, b = Array(c.size);
    return c.forEach(function(A, R) {
      b[++d] = [R, A];
    }), b;
  }
  function us(c, d) {
    return function(b) {
      return c(d(b));
    };
  }
  function en(c) {
    var d = -1, b = Array(c.size);
    return c.forEach(function(A) {
      b[++d] = A;
    }), b;
  }
  var ni = Array.prototype, ii = Function.prototype, De = Object.prototype, ds = bt["__core-js_shared__"], sn = function() {
    var c = /[^.]+$/.exec(ds && ds.keys && ds.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), nn = ii.toString, Nt = De.hasOwnProperty, Ce = De.toString, ri = RegExp(
    "^" + nn.call(Nt).replace(Zn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ue = Zs ? bt.Buffer : void 0, Le = bt.Symbol, hs = bt.Uint8Array, dt = us(Object.getPrototypeOf, Object), rn = Object.create, an = De.propertyIsEnumerable, ai = ni.splice, fs = Object.getOwnPropertySymbols, Ie = ue ? ue.isBuffer : void 0, on = us(Object.keys, Object), Ne = wt(bt, "DataView"), de = wt(bt, "Map"), vt = wt(bt, "Promise"), ke = wt(bt, "Set"), ps = wt(bt, "WeakMap"), he = wt(Object, "create"), gs = it(Ne), fe = it(de), ms = it(vt), bs = it(ke), ys = it(ps), Xt = Le ? Le.prototype : void 0, ln = Xt ? Xt.valueOf : void 0;
  function Ht(c) {
    var d = -1, b = c ? c.length : 0;
    for (this.clear(); ++d < b; ) {
      var A = c[d];
      this.set(A[0], A[1]);
    }
  }
  function oi() {
    this.__data__ = he ? he(null) : {};
  }
  function li(c) {
    return this.has(c) && delete this.__data__[c];
  }
  function ci(c) {
    var d = this.__data__;
    if (he) {
      var b = d[c];
      return b === s ? void 0 : b;
    }
    return Nt.call(d, c) ? d[c] : void 0;
  }
  function cn(c) {
    var d = this.__data__;
    return he ? d[c] !== void 0 : Nt.call(d, c);
  }
  function vs(c, d) {
    var b = this.__data__;
    return b[c] = he && d === void 0 ? s : d, this;
  }
  Ht.prototype.clear = oi, Ht.prototype.delete = li, Ht.prototype.get = ci, Ht.prototype.has = cn, Ht.prototype.set = vs;
  function Z(c) {
    var d = -1, b = c ? c.length : 0;
    for (this.clear(); ++d < b; ) {
      var A = c[d];
      this.set(A[0], A[1]);
    }
  }
  function ui() {
    this.__data__ = [];
  }
  function di(c) {
    var d = this.__data__, b = Oe(d, c);
    if (b < 0)
      return !1;
    var A = d.length - 1;
    return b == A ? d.pop() : ai.call(d, b, 1), !0;
  }
  function hi(c) {
    var d = this.__data__, b = Oe(d, c);
    return b < 0 ? void 0 : d[b][1];
  }
  function fi(c) {
    return Oe(this.__data__, c) > -1;
  }
  function pi(c, d) {
    var b = this.__data__, A = Oe(b, c);
    return A < 0 ? b.push([c, d]) : b[A][1] = d, this;
  }
  Z.prototype.clear = ui, Z.prototype.delete = di, Z.prototype.get = hi, Z.prototype.has = fi, Z.prototype.set = pi;
  function J(c) {
    var d = -1, b = c ? c.length : 0;
    for (this.clear(); ++d < b; ) {
      var A = c[d];
      this.set(A[0], A[1]);
    }
  }
  function gi() {
    this.__data__ = {
      hash: new Ht(),
      map: new (de || Z)(),
      string: new Ht()
    };
  }
  function mi(c) {
    return ge(this, c).delete(c);
  }
  function bi(c) {
    return ge(this, c).get(c);
  }
  function yi(c) {
    return ge(this, c).has(c);
  }
  function vi(c, d) {
    return ge(this, c).set(c, d), this;
  }
  J.prototype.clear = gi, J.prototype.delete = mi, J.prototype.get = bi, J.prototype.has = yi, J.prototype.set = vi;
  function ot(c) {
    this.__data__ = new Z(c);
  }
  function wi() {
    this.__data__ = new Z();
  }
  function Si(c) {
    return this.__data__.delete(c);
  }
  function Ai(c) {
    return this.__data__.get(c);
  }
  function Ei(c) {
    return this.__data__.has(c);
  }
  function xi(c, d) {
    var b = this.__data__;
    if (b instanceof Z) {
      var A = b.__data__;
      if (!de || A.length < e - 1)
        return A.push([c, d]), this;
      b = this.__data__ = new J(A);
    }
    return b.set(c, d), this;
  }
  ot.prototype.clear = wi, ot.prototype.delete = Si, ot.prototype.get = Ai, ot.prototype.has = Ei, ot.prototype.set = xi;
  function qe(c, d) {
    var b = Es(c) || Re(c) ? ls(c.length, String) : [], A = b.length, R = !!A;
    for (var O in c)
      Nt.call(c, O) && !(R && (O == "length" || Bi(O, A))) && b.push(O);
    return b;
  }
  function un(c, d, b) {
    var A = c[d];
    (!(Nt.call(c, d) && gn(A, b)) || b === void 0 && !(d in c)) && (c[d] = b);
  }
  function Oe(c, d) {
    for (var b = c.length; b--; )
      if (gn(c[b][0], d))
        return b;
    return -1;
  }
  function kt(c, d) {
    return c && As(d, Ts(d), c);
  }
  function ws(c, d, b, A, R, O, F) {
    var B;
    if (A && (B = O ? A(c, R, O, F) : A(c)), B !== void 0)
      return B;
    if (!Ot(c))
      return c;
    var K = Es(c);
    if (K) {
      if (B = _i(c), !d)
        return Oi(c, B);
    } else {
      var P = Ut(c), tt = P == h || P == g;
      if (mn(c))
        return Me(c, d);
      if (P == y || P == i || tt && !O) {
        if (cs(c))
          return O ? c : {};
        if (B = qt(tt ? {} : c), !d)
          return Mi(c, kt(B, c));
      } else {
        if (!H[P])
          return O ? c : {};
        B = $i(c, P, ws, d);
      }
    }
    F || (F = new ot());
    var lt = F.get(c);
    if (lt)
      return lt;
    if (F.set(c, B), !K)
      var Y = b ? Ri(c) : Ts(c);
    return Qs(Y || c, function(et, Q) {
      Y && (Q = et, et = c[Q]), un(B, Q, ws(et, d, b, A, Q, c, F));
    }), B;
  }
  function Ti(c) {
    return Ot(c) ? rn(c) : {};
  }
  function Di(c, d, b) {
    var A = d(c);
    return Es(c) ? A : Xs(A, b(c));
  }
  function Ci(c) {
    return Ce.call(c);
  }
  function Li(c) {
    if (!Ot(c) || Pi(c))
      return !1;
    var d = xs(c) || cs(c) ? ri : Xn;
    return d.test(it(c));
  }
  function Ii(c) {
    if (!fn(c))
      return on(c);
    var d = [];
    for (var b in Object(c))
      Nt.call(c, b) && b != "constructor" && d.push(b);
    return d;
  }
  function Me(c, d) {
    if (d)
      return c.slice();
    var b = new c.constructor(c.length);
    return c.copy(b), b;
  }
  function Ss(c) {
    var d = new c.constructor(c.byteLength);
    return new hs(d).set(new hs(c)), d;
  }
  function pe(c, d) {
    var b = d ? Ss(c.buffer) : c.buffer;
    return new c.constructor(b, c.byteOffset, c.byteLength);
  }
  function dn(c, d, b) {
    var A = d ? b(tn(c), !0) : tn(c);
    return os(A, si, new c.constructor());
  }
  function hn(c) {
    var d = new c.constructor(c.source, Qn.exec(c));
    return d.lastIndex = c.lastIndex, d;
  }
  function Ni(c, d, b) {
    var A = d ? b(en(c), !0) : en(c);
    return os(A, yt, new c.constructor());
  }
  function ki(c) {
    return ln ? Object(ln.call(c)) : {};
  }
  function qi(c, d) {
    var b = d ? Ss(c.buffer) : c.buffer;
    return new c.constructor(b, c.byteOffset, c.length);
  }
  function Oi(c, d) {
    var b = -1, A = c.length;
    for (d || (d = Array(A)); ++b < A; )
      d[b] = c[b];
    return d;
  }
  function As(c, d, b, A) {
    b || (b = {});
    for (var R = -1, O = d.length; ++R < O; ) {
      var F = d[R], B = void 0;
      un(b, F, B === void 0 ? c[F] : B);
    }
    return b;
  }
  function Mi(c, d) {
    return As(c, jt(c), d);
  }
  function Ri(c) {
    return Di(c, Ts, jt);
  }
  function ge(c, d) {
    var b = c.__data__;
    return Fi(d) ? b[typeof d == "string" ? "string" : "hash"] : b.map;
  }
  function wt(c, d) {
    var b = Js(c, d);
    return Li(b) ? b : void 0;
  }
  var jt = fs ? us(fs, Object) : ji, Ut = Ci;
  (Ne && Ut(new Ne(new ArrayBuffer(1))) != M || de && Ut(new de()) != p || vt && Ut(vt.resolve()) != v || ke && Ut(new ke()) != E || ps && Ut(new ps()) != N) && (Ut = function(c) {
    var d = Ce.call(c), b = d == y ? c.constructor : void 0, A = b ? it(b) : void 0;
    if (A)
      switch (A) {
        case gs:
          return M;
        case fe:
          return p;
        case ms:
          return v;
        case bs:
          return E;
        case ys:
          return N;
      }
    return d;
  });
  function _i(c) {
    var d = c.length, b = c.constructor(d);
    return d && typeof c[0] == "string" && Nt.call(c, "index") && (b.index = c.index, b.input = c.input), b;
  }
  function qt(c) {
    return typeof c.constructor == "function" && !fn(c) ? Ti(dt(c)) : {};
  }
  function $i(c, d, b, A) {
    var R = c.constructor;
    switch (d) {
      case L:
        return Ss(c);
      case o:
      case l:
        return new R(+c);
      case M:
        return pe(c, A);
      case $:
      case z:
      case Pt:
      case Qt:
      case le:
      case ce:
      case Gs:
      case Ks:
      case Ys:
        return qi(c, A);
      case p:
        return dn(c, A, b);
      case m:
      case T:
        return new R(c);
      case S:
        return hn(c);
      case E:
        return Ni(c, A, b);
      case D:
        return ki(c);
    }
  }
  function Bi(c, d) {
    return d = d ?? n, !!d && (typeof c == "number" || Jn.test(c)) && c > -1 && c % 1 == 0 && c < d;
  }
  function Fi(c) {
    var d = typeof c;
    return d == "string" || d == "number" || d == "symbol" || d == "boolean" ? c !== "__proto__" : c === null;
  }
  function Pi(c) {
    return !!sn && sn in c;
  }
  function fn(c) {
    var d = c && c.constructor, b = typeof d == "function" && d.prototype || De;
    return c === b;
  }
  function it(c) {
    if (c != null) {
      try {
        return nn.call(c);
      } catch {
      }
      try {
        return c + "";
      } catch {
      }
    }
    return "";
  }
  function pn(c) {
    return ws(c, !0, !0);
  }
  function gn(c, d) {
    return c === d || c !== c && d !== d;
  }
  function Re(c) {
    return Hi(c) && Nt.call(c, "callee") && (!an.call(c, "callee") || Ce.call(c) == i);
  }
  var Es = Array.isArray;
  function _e(c) {
    return c != null && bn(c.length) && !xs(c);
  }
  function Hi(c) {
    return yn(c) && _e(c);
  }
  var mn = Ie || Ui;
  function xs(c) {
    var d = Ot(c) ? Ce.call(c) : "";
    return d == h || d == g;
  }
  function bn(c) {
    return typeof c == "number" && c > -1 && c % 1 == 0 && c <= n;
  }
  function Ot(c) {
    var d = typeof c;
    return !!c && (d == "object" || d == "function");
  }
  function yn(c) {
    return !!c && typeof c == "object";
  }
  function Ts(c) {
    return _e(c) ? qe(c) : Ii(c);
  }
  function ji() {
    return [];
  }
  function Ui() {
    return !1;
  }
  r.exports = pn;
})(Rn, Rn.exports);
var Go = Rn.exports, _n = { exports: {} };
_n.exports;
(function(r, t) {
  var e = 200, s = "__lodash_hash_undefined__", n = 1, i = 2, a = 9007199254740991, o = "[object Arguments]", l = "[object Array]", u = "[object AsyncFunction]", h = "[object Boolean]", g = "[object Date]", p = "[object Error]", m = "[object Function]", y = "[object GeneratorFunction]", v = "[object Map]", S = "[object Number]", E = "[object Null]", T = "[object Object]", D = "[object Promise]", N = "[object Proxy]", L = "[object RegExp]", M = "[object Set]", $ = "[object String]", z = "[object Symbol]", Pt = "[object Undefined]", Qt = "[object WeakMap]", le = "[object ArrayBuffer]", ce = "[object DataView]", Gs = "[object Float32Array]", Ks = "[object Float64Array]", Ys = "[object Int8Array]", Zn = "[object Int16Array]", Qn = "[object Int32Array]", Xn = "[object Uint8Array]", Jn = "[object Uint8ClampedArray]", H = "[object Uint16Array]", ti = "[object Uint32Array]", ei = /[\\^$.*+?()[\]{}|]/g, bt = /^\[object .+?Constructor\]$/, Ws = /^(?:0|[1-9]\d*)$/, j = {};
  j[Gs] = j[Ks] = j[Ys] = j[Zn] = j[Qn] = j[Xn] = j[Jn] = j[H] = j[ti] = !0, j[o] = j[l] = j[le] = j[h] = j[ce] = j[g] = j[p] = j[m] = j[v] = j[S] = j[T] = j[L] = j[M] = j[$] = j[Qt] = !1;
  var Zs = typeof ee == "object" && ee && ee.Object === Object && ee, si = typeof self == "object" && self && self.Object === Object && self, yt = Zs || si || Function("return this")(), Qs = t && !t.nodeType && t, Xs = Qs && !0 && r && !r.nodeType && r, os = Xs && Xs.exports === Qs, ls = os && Zs.process, Js = function() {
    try {
      return ls && ls.binding && ls.binding("util");
    } catch {
    }
  }(), cs = Js && Js.isTypedArray;
  function tn(c, d) {
    for (var b = -1, A = c == null ? 0 : c.length, R = 0, O = []; ++b < A; ) {
      var F = c[b];
      d(F, b, c) && (O[R++] = F);
    }
    return O;
  }
  function us(c, d) {
    for (var b = -1, A = d.length, R = c.length; ++b < A; )
      c[R + b] = d[b];
    return c;
  }
  function en(c, d) {
    for (var b = -1, A = c == null ? 0 : c.length; ++b < A; )
      if (d(c[b], b, c))
        return !0;
    return !1;
  }
  function ni(c, d) {
    for (var b = -1, A = Array(c); ++b < c; )
      A[b] = d(b);
    return A;
  }
  function ii(c) {
    return function(d) {
      return c(d);
    };
  }
  function De(c, d) {
    return c.has(d);
  }
  function ds(c, d) {
    return c == null ? void 0 : c[d];
  }
  function sn(c) {
    var d = -1, b = Array(c.size);
    return c.forEach(function(A, R) {
      b[++d] = [R, A];
    }), b;
  }
  function nn(c, d) {
    return function(b) {
      return c(d(b));
    };
  }
  function Nt(c) {
    var d = -1, b = Array(c.size);
    return c.forEach(function(A) {
      b[++d] = A;
    }), b;
  }
  var Ce = Array.prototype, ri = Function.prototype, ue = Object.prototype, Le = yt["__core-js_shared__"], hs = ri.toString, dt = ue.hasOwnProperty, rn = function() {
    var c = /[^.]+$/.exec(Le && Le.keys && Le.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), an = ue.toString, ai = RegExp(
    "^" + hs.call(dt).replace(ei, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), fs = os ? yt.Buffer : void 0, Ie = yt.Symbol, on = yt.Uint8Array, Ne = ue.propertyIsEnumerable, de = Ce.splice, vt = Ie ? Ie.toStringTag : void 0, ke = Object.getOwnPropertySymbols, ps = fs ? fs.isBuffer : void 0, he = nn(Object.keys, Object), gs = jt(yt, "DataView"), fe = jt(yt, "Map"), ms = jt(yt, "Promise"), bs = jt(yt, "Set"), ys = jt(yt, "WeakMap"), Xt = jt(Object, "create"), ln = it(gs), Ht = it(fe), oi = it(ms), li = it(bs), ci = it(ys), cn = Ie ? Ie.prototype : void 0, vs = cn ? cn.valueOf : void 0;
  function Z(c) {
    var d = -1, b = c == null ? 0 : c.length;
    for (this.clear(); ++d < b; ) {
      var A = c[d];
      this.set(A[0], A[1]);
    }
  }
  function ui() {
    this.__data__ = Xt ? Xt(null) : {}, this.size = 0;
  }
  function di(c) {
    var d = this.has(c) && delete this.__data__[c];
    return this.size -= d ? 1 : 0, d;
  }
  function hi(c) {
    var d = this.__data__;
    if (Xt) {
      var b = d[c];
      return b === s ? void 0 : b;
    }
    return dt.call(d, c) ? d[c] : void 0;
  }
  function fi(c) {
    var d = this.__data__;
    return Xt ? d[c] !== void 0 : dt.call(d, c);
  }
  function pi(c, d) {
    var b = this.__data__;
    return this.size += this.has(c) ? 0 : 1, b[c] = Xt && d === void 0 ? s : d, this;
  }
  Z.prototype.clear = ui, Z.prototype.delete = di, Z.prototype.get = hi, Z.prototype.has = fi, Z.prototype.set = pi;
  function J(c) {
    var d = -1, b = c == null ? 0 : c.length;
    for (this.clear(); ++d < b; ) {
      var A = c[d];
      this.set(A[0], A[1]);
    }
  }
  function gi() {
    this.__data__ = [], this.size = 0;
  }
  function mi(c) {
    var d = this.__data__, b = Me(d, c);
    if (b < 0)
      return !1;
    var A = d.length - 1;
    return b == A ? d.pop() : de.call(d, b, 1), --this.size, !0;
  }
  function bi(c) {
    var d = this.__data__, b = Me(d, c);
    return b < 0 ? void 0 : d[b][1];
  }
  function yi(c) {
    return Me(this.__data__, c) > -1;
  }
  function vi(c, d) {
    var b = this.__data__, A = Me(b, c);
    return A < 0 ? (++this.size, b.push([c, d])) : b[A][1] = d, this;
  }
  J.prototype.clear = gi, J.prototype.delete = mi, J.prototype.get = bi, J.prototype.has = yi, J.prototype.set = vi;
  function ot(c) {
    var d = -1, b = c == null ? 0 : c.length;
    for (this.clear(); ++d < b; ) {
      var A = c[d];
      this.set(A[0], A[1]);
    }
  }
  function wi() {
    this.size = 0, this.__data__ = {
      hash: new Z(),
      map: new (fe || J)(),
      string: new Z()
    };
  }
  function Si(c) {
    var d = wt(this, c).delete(c);
    return this.size -= d ? 1 : 0, d;
  }
  function Ai(c) {
    return wt(this, c).get(c);
  }
  function Ei(c) {
    return wt(this, c).has(c);
  }
  function xi(c, d) {
    var b = wt(this, c), A = b.size;
    return b.set(c, d), this.size += b.size == A ? 0 : 1, this;
  }
  ot.prototype.clear = wi, ot.prototype.delete = Si, ot.prototype.get = Ai, ot.prototype.has = Ei, ot.prototype.set = xi;
  function qe(c) {
    var d = -1, b = c == null ? 0 : c.length;
    for (this.__data__ = new ot(); ++d < b; )
      this.add(c[d]);
  }
  function un(c) {
    return this.__data__.set(c, s), this;
  }
  function Oe(c) {
    return this.__data__.has(c);
  }
  qe.prototype.add = qe.prototype.push = un, qe.prototype.has = Oe;
  function kt(c) {
    var d = this.__data__ = new J(c);
    this.size = d.size;
  }
  function ws() {
    this.__data__ = new J(), this.size = 0;
  }
  function Ti(c) {
    var d = this.__data__, b = d.delete(c);
    return this.size = d.size, b;
  }
  function Di(c) {
    return this.__data__.get(c);
  }
  function Ci(c) {
    return this.__data__.has(c);
  }
  function Li(c, d) {
    var b = this.__data__;
    if (b instanceof J) {
      var A = b.__data__;
      if (!fe || A.length < e - 1)
        return A.push([c, d]), this.size = ++b.size, this;
      b = this.__data__ = new ot(A);
    }
    return b.set(c, d), this.size = b.size, this;
  }
  kt.prototype.clear = ws, kt.prototype.delete = Ti, kt.prototype.get = Di, kt.prototype.has = Ci, kt.prototype.set = Li;
  function Ii(c, d) {
    var b = Re(c), A = !b && gn(c), R = !b && !A && _e(c), O = !b && !A && !R && yn(c), F = b || A || R || O, B = F ? ni(c.length, String) : [], K = B.length;
    for (var P in c)
      dt.call(c, P) && !(F && // Safari 9 has enumerable `arguments.length` in strict mode.
      (P == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      R && (P == "offset" || P == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      O && (P == "buffer" || P == "byteLength" || P == "byteOffset") || // Skip index properties.
      $i(P, K))) && B.push(P);
    return B;
  }
  function Me(c, d) {
    for (var b = c.length; b--; )
      if (pn(c[b][0], d))
        return b;
    return -1;
  }
  function Ss(c, d, b) {
    var A = d(c);
    return Re(c) ? A : us(A, b(c));
  }
  function pe(c) {
    return c == null ? c === void 0 ? Pt : E : vt && vt in Object(c) ? Ut(c) : fn(c);
  }
  function dn(c) {
    return Ot(c) && pe(c) == o;
  }
  function hn(c, d, b, A, R) {
    return c === d ? !0 : c == null || d == null || !Ot(c) && !Ot(d) ? c !== c && d !== d : Ni(c, d, b, A, hn, R);
  }
  function Ni(c, d, b, A, R, O) {
    var F = Re(c), B = Re(d), K = F ? l : qt(c), P = B ? l : qt(d);
    K = K == o ? T : K, P = P == o ? T : P;
    var tt = K == T, lt = P == T, Y = K == P;
    if (Y && _e(c)) {
      if (!_e(d))
        return !1;
      F = !0, tt = !1;
    }
    if (Y && !tt)
      return O || (O = new kt()), F || yn(c) ? As(c, d, b, A, R, O) : Mi(c, d, K, b, A, R, O);
    if (!(b & n)) {
      var et = tt && dt.call(c, "__wrapped__"), Q = lt && dt.call(d, "__wrapped__");
      if (et || Q) {
        var Jt = et ? c.value() : c, zt = Q ? d.value() : d;
        return O || (O = new kt()), R(Jt, zt, b, A, O);
      }
    }
    return Y ? (O || (O = new kt()), Ri(c, d, b, A, R, O)) : !1;
  }
  function ki(c) {
    if (!bn(c) || Fi(c))
      return !1;
    var d = mn(c) ? ai : bt;
    return d.test(it(c));
  }
  function qi(c) {
    return Ot(c) && xs(c.length) && !!j[pe(c)];
  }
  function Oi(c) {
    if (!Pi(c))
      return he(c);
    var d = [];
    for (var b in Object(c))
      dt.call(c, b) && b != "constructor" && d.push(b);
    return d;
  }
  function As(c, d, b, A, R, O) {
    var F = b & n, B = c.length, K = d.length;
    if (B != K && !(F && K > B))
      return !1;
    var P = O.get(c);
    if (P && O.get(d))
      return P == d;
    var tt = -1, lt = !0, Y = b & i ? new qe() : void 0;
    for (O.set(c, d), O.set(d, c); ++tt < B; ) {
      var et = c[tt], Q = d[tt];
      if (A)
        var Jt = F ? A(Q, et, tt, d, c, O) : A(et, Q, tt, c, d, O);
      if (Jt !== void 0) {
        if (Jt)
          continue;
        lt = !1;
        break;
      }
      if (Y) {
        if (!en(d, function(zt, me) {
          if (!De(Y, me) && (et === zt || R(et, zt, b, A, O)))
            return Y.push(me);
        })) {
          lt = !1;
          break;
        }
      } else if (!(et === Q || R(et, Q, b, A, O))) {
        lt = !1;
        break;
      }
    }
    return O.delete(c), O.delete(d), lt;
  }
  function Mi(c, d, b, A, R, O, F) {
    switch (b) {
      case ce:
        if (c.byteLength != d.byteLength || c.byteOffset != d.byteOffset)
          return !1;
        c = c.buffer, d = d.buffer;
      case le:
        return !(c.byteLength != d.byteLength || !O(new on(c), new on(d)));
      case h:
      case g:
      case S:
        return pn(+c, +d);
      case p:
        return c.name == d.name && c.message == d.message;
      case L:
      case $:
        return c == d + "";
      case v:
        var B = sn;
      case M:
        var K = A & n;
        if (B || (B = Nt), c.size != d.size && !K)
          return !1;
        var P = F.get(c);
        if (P)
          return P == d;
        A |= i, F.set(c, d);
        var tt = As(B(c), B(d), A, R, O, F);
        return F.delete(c), tt;
      case z:
        if (vs)
          return vs.call(c) == vs.call(d);
    }
    return !1;
  }
  function Ri(c, d, b, A, R, O) {
    var F = b & n, B = ge(c), K = B.length, P = ge(d), tt = P.length;
    if (K != tt && !F)
      return !1;
    for (var lt = K; lt--; ) {
      var Y = B[lt];
      if (!(F ? Y in d : dt.call(d, Y)))
        return !1;
    }
    var et = O.get(c);
    if (et && O.get(d))
      return et == d;
    var Q = !0;
    O.set(c, d), O.set(d, c);
    for (var Jt = F; ++lt < K; ) {
      Y = B[lt];
      var zt = c[Y], me = d[Y];
      if (A)
        var oa = F ? A(me, zt, Y, d, c, O) : A(zt, me, Y, c, d, O);
      if (!(oa === void 0 ? zt === me || R(zt, me, b, A, O) : oa)) {
        Q = !1;
        break;
      }
      Jt || (Jt = Y == "constructor");
    }
    if (Q && !Jt) {
      var vn = c.constructor, wn = d.constructor;
      vn != wn && "constructor" in c && "constructor" in d && !(typeof vn == "function" && vn instanceof vn && typeof wn == "function" && wn instanceof wn) && (Q = !1);
    }
    return O.delete(c), O.delete(d), Q;
  }
  function ge(c) {
    return Ss(c, Ts, _i);
  }
  function wt(c, d) {
    var b = c.__data__;
    return Bi(d) ? b[typeof d == "string" ? "string" : "hash"] : b.map;
  }
  function jt(c, d) {
    var b = ds(c, d);
    return ki(b) ? b : void 0;
  }
  function Ut(c) {
    var d = dt.call(c, vt), b = c[vt];
    try {
      c[vt] = void 0;
      var A = !0;
    } catch {
    }
    var R = an.call(c);
    return A && (d ? c[vt] = b : delete c[vt]), R;
  }
  var _i = ke ? function(c) {
    return c == null ? [] : (c = Object(c), tn(ke(c), function(d) {
      return Ne.call(c, d);
    }));
  } : ji, qt = pe;
  (gs && qt(new gs(new ArrayBuffer(1))) != ce || fe && qt(new fe()) != v || ms && qt(ms.resolve()) != D || bs && qt(new bs()) != M || ys && qt(new ys()) != Qt) && (qt = function(c) {
    var d = pe(c), b = d == T ? c.constructor : void 0, A = b ? it(b) : "";
    if (A)
      switch (A) {
        case ln:
          return ce;
        case Ht:
          return v;
        case oi:
          return D;
        case li:
          return M;
        case ci:
          return Qt;
      }
    return d;
  });
  function $i(c, d) {
    return d = d ?? a, !!d && (typeof c == "number" || Ws.test(c)) && c > -1 && c % 1 == 0 && c < d;
  }
  function Bi(c) {
    var d = typeof c;
    return d == "string" || d == "number" || d == "symbol" || d == "boolean" ? c !== "__proto__" : c === null;
  }
  function Fi(c) {
    return !!rn && rn in c;
  }
  function Pi(c) {
    var d = c && c.constructor, b = typeof d == "function" && d.prototype || ue;
    return c === b;
  }
  function fn(c) {
    return an.call(c);
  }
  function it(c) {
    if (c != null) {
      try {
        return hs.call(c);
      } catch {
      }
      try {
        return c + "";
      } catch {
      }
    }
    return "";
  }
  function pn(c, d) {
    return c === d || c !== c && d !== d;
  }
  var gn = dn(/* @__PURE__ */ function() {
    return arguments;
  }()) ? dn : function(c) {
    return Ot(c) && dt.call(c, "callee") && !Ne.call(c, "callee");
  }, Re = Array.isArray;
  function Es(c) {
    return c != null && xs(c.length) && !mn(c);
  }
  var _e = ps || Ui;
  function Hi(c, d) {
    return hn(c, d);
  }
  function mn(c) {
    if (!bn(c))
      return !1;
    var d = pe(c);
    return d == m || d == y || d == u || d == N;
  }
  function xs(c) {
    return typeof c == "number" && c > -1 && c % 1 == 0 && c <= a;
  }
  function bn(c) {
    var d = typeof c;
    return c != null && (d == "object" || d == "function");
  }
  function Ot(c) {
    return c != null && typeof c == "object";
  }
  var yn = cs ? ii(cs) : qi;
  function Ts(c) {
    return Es(c) ? Ii(c) : Oi(c);
  }
  function ji() {
    return [];
  }
  function Ui() {
    return !1;
  }
  r.exports = Hi;
})(_n, _n.exports);
var Ko = _n.exports, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
const yf = Go, vf = Ko;
var mr;
(function(r) {
  function t(i = {}, a = {}, o = !1) {
    typeof i != "object" && (i = {}), typeof a != "object" && (a = {});
    let l = yf(a);
    o || (l = Object.keys(l).reduce((u, h) => (l[h] != null && (u[h] = l[h]), u), {}));
    for (const u in i)
      i[u] !== void 0 && a[u] === void 0 && (l[u] = i[u]);
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.compose = t;
  function e(i = {}, a = {}) {
    typeof i != "object" && (i = {}), typeof a != "object" && (a = {});
    const o = Object.keys(i).concat(Object.keys(a)).reduce((l, u) => (vf(i[u], a[u]) || (l[u] = a[u] === void 0 ? null : a[u]), l), {});
    return Object.keys(o).length > 0 ? o : void 0;
  }
  r.diff = e;
  function s(i = {}, a = {}) {
    i = i || {};
    const o = Object.keys(a).reduce((l, u) => (a[u] !== i[u] && i[u] !== void 0 && (l[u] = a[u]), l), {});
    return Object.keys(i).reduce((l, u) => (i[u] !== a[u] && a[u] === void 0 && (l[u] = null), l), o);
  }
  r.invert = s;
  function n(i, a, o = !1) {
    if (typeof i != "object")
      return a;
    if (typeof a != "object")
      return;
    if (!o)
      return a;
    const l = Object.keys(a).reduce((u, h) => (i[h] === void 0 && (u[h] = a[h]), u), {});
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.transform = n;
})(mr || (mr = {}));
Kr.default = mr;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
var br;
(function(r) {
  function t(e) {
    return typeof e.delete == "number" ? e.delete : typeof e.retain == "number" ? e.retain : typeof e.retain == "object" && e.retain !== null ? 1 : typeof e.insert == "string" ? e.insert.length : 1;
  }
  r.length = t;
})(br || (br = {}));
Gn.default = br;
var Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
const Ha = Gn;
class wf {
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
      const s = this.offset, n = Ha.default.length(e);
      if (t >= n - s ? (t = n - s, this.index += 1, this.offset = 0) : this.offset += t, typeof e.delete == "number")
        return { delete: t };
      {
        const i = {};
        return e.attributes && (i.attributes = e.attributes), typeof e.retain == "number" ? i.retain = t : typeof e.retain == "object" && e.retain !== null ? i.retain = e.retain : typeof e.insert == "string" ? i.insert = e.insert.substr(s, t) : i.insert = e.insert, i;
      }
    } else
      return { retain: 1 / 0 };
  }
  peek() {
    return this.ops[this.index];
  }
  peekLength() {
    return this.ops[this.index] ? Ha.default.length(this.ops[this.index]) - this.offset : 1 / 0;
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
        const t = this.offset, e = this.index, s = this.next(), n = this.ops.slice(this.index);
        return this.offset = t, this.index = e, [s].concat(n);
      }
    } else return [];
  }
}
Yr.default = wf;
(function(r, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.AttributeMap = t.OpIterator = t.Op = void 0;
  const e = bf, s = Go, n = Ko, i = Kr;
  t.AttributeMap = i.default;
  const a = Gn;
  t.Op = a.default;
  const o = Yr;
  t.OpIterator = o.default;
  const l = "\0", u = (g, p) => {
    if (typeof g != "object" || g === null)
      throw new Error(`cannot retain a ${typeof g}`);
    if (typeof p != "object" || p === null)
      throw new Error(`cannot retain a ${typeof p}`);
    const m = Object.keys(g)[0];
    if (!m || m !== Object.keys(p)[0])
      throw new Error(`embed types not matched: ${m} != ${Object.keys(p)[0]}`);
    return [m, g[m], p[m]];
  };
  class h {
    constructor(p) {
      Array.isArray(p) ? this.ops = p : p != null && Array.isArray(p.ops) ? this.ops = p.ops : this.ops = [];
    }
    static registerEmbed(p, m) {
      this.handlers[p] = m;
    }
    static unregisterEmbed(p) {
      delete this.handlers[p];
    }
    static getHandler(p) {
      const m = this.handlers[p];
      if (!m)
        throw new Error(`no handlers for embed type "${p}"`);
      return m;
    }
    insert(p, m) {
      const y = {};
      return typeof p == "string" && p.length === 0 ? this : (y.insert = p, m != null && typeof m == "object" && Object.keys(m).length > 0 && (y.attributes = m), this.push(y));
    }
    delete(p) {
      return p <= 0 ? this : this.push({ delete: p });
    }
    retain(p, m) {
      if (typeof p == "number" && p <= 0)
        return this;
      const y = { retain: p };
      return m != null && typeof m == "object" && Object.keys(m).length > 0 && (y.attributes = m), this.push(y);
    }
    push(p) {
      let m = this.ops.length, y = this.ops[m - 1];
      if (p = s(p), typeof y == "object") {
        if (typeof p.delete == "number" && typeof y.delete == "number")
          return this.ops[m - 1] = { delete: y.delete + p.delete }, this;
        if (typeof y.delete == "number" && p.insert != null && (m -= 1, y = this.ops[m - 1], typeof y != "object"))
          return this.ops.unshift(p), this;
        if (n(p.attributes, y.attributes)) {
          if (typeof p.insert == "string" && typeof y.insert == "string")
            return this.ops[m - 1] = { insert: y.insert + p.insert }, typeof p.attributes == "object" && (this.ops[m - 1].attributes = p.attributes), this;
          if (typeof p.retain == "number" && typeof y.retain == "number")
            return this.ops[m - 1] = { retain: y.retain + p.retain }, typeof p.attributes == "object" && (this.ops[m - 1].attributes = p.attributes), this;
        }
      }
      return m === this.ops.length ? this.ops.push(p) : this.ops.splice(m, 0, p), this;
    }
    chop() {
      const p = this.ops[this.ops.length - 1];
      return p && typeof p.retain == "number" && !p.attributes && this.ops.pop(), this;
    }
    filter(p) {
      return this.ops.filter(p);
    }
    forEach(p) {
      this.ops.forEach(p);
    }
    map(p) {
      return this.ops.map(p);
    }
    partition(p) {
      const m = [], y = [];
      return this.forEach((v) => {
        (p(v) ? m : y).push(v);
      }), [m, y];
    }
    reduce(p, m) {
      return this.ops.reduce(p, m);
    }
    changeLength() {
      return this.reduce((p, m) => m.insert ? p + a.default.length(m) : m.delete ? p - m.delete : p, 0);
    }
    length() {
      return this.reduce((p, m) => p + a.default.length(m), 0);
    }
    slice(p = 0, m = 1 / 0) {
      const y = [], v = new o.default(this.ops);
      let S = 0;
      for (; S < m && v.hasNext(); ) {
        let E;
        S < p ? E = v.next(p - S) : (E = v.next(m - S), y.push(E)), S += a.default.length(E);
      }
      return new h(y);
    }
    compose(p) {
      const m = new o.default(this.ops), y = new o.default(p.ops), v = [], S = y.peek();
      if (S != null && typeof S.retain == "number" && S.attributes == null) {
        let T = S.retain;
        for (; m.peekType() === "insert" && m.peekLength() <= T; )
          T -= m.peekLength(), v.push(m.next());
        S.retain - T > 0 && y.next(S.retain - T);
      }
      const E = new h(v);
      for (; m.hasNext() || y.hasNext(); )
        if (y.peekType() === "insert")
          E.push(y.next());
        else if (m.peekType() === "delete")
          E.push(m.next());
        else {
          const T = Math.min(m.peekLength(), y.peekLength()), D = m.next(T), N = y.next(T);
          if (N.retain) {
            const L = {};
            if (typeof D.retain == "number")
              L.retain = typeof N.retain == "number" ? T : N.retain;
            else if (typeof N.retain == "number")
              D.retain == null ? L.insert = D.insert : L.retain = D.retain;
            else {
              const $ = D.retain == null ? "insert" : "retain", [z, Pt, Qt] = u(D[$], N.retain), le = h.getHandler(z);
              L[$] = {
                [z]: le.compose(Pt, Qt, $ === "retain")
              };
            }
            const M = i.default.compose(D.attributes, N.attributes, typeof D.retain == "number");
            if (M && (L.attributes = M), E.push(L), !y.hasNext() && n(E.ops[E.ops.length - 1], L)) {
              const $ = new h(m.rest());
              return E.concat($).chop();
            }
          } else typeof N.delete == "number" && (typeof D.retain == "number" || typeof D.retain == "object" && D.retain !== null) && E.push(N);
        }
      return E.chop();
    }
    concat(p) {
      const m = new h(this.ops.slice());
      return p.ops.length > 0 && (m.push(p.ops[0]), m.ops = m.ops.concat(p.ops.slice(1))), m;
    }
    diff(p, m) {
      if (this.ops === p.ops)
        return new h();
      const y = [this, p].map((D) => D.map((N) => {
        if (N.insert != null)
          return typeof N.insert == "string" ? N.insert : l;
        const L = D === p ? "on" : "with";
        throw new Error("diff() called " + L + " non-document");
      }).join("")), v = new h(), S = e(y[0], y[1], m, !0), E = new o.default(this.ops), T = new o.default(p.ops);
      return S.forEach((D) => {
        let N = D[1].length;
        for (; N > 0; ) {
          let L = 0;
          switch (D[0]) {
            case e.INSERT:
              L = Math.min(T.peekLength(), N), v.push(T.next(L));
              break;
            case e.DELETE:
              L = Math.min(N, E.peekLength()), E.next(L), v.delete(L);
              break;
            case e.EQUAL:
              L = Math.min(E.peekLength(), T.peekLength(), N);
              const M = E.next(L), $ = T.next(L);
              n(M.insert, $.insert) ? v.retain(L, i.default.diff(M.attributes, $.attributes)) : v.push($).delete(L);
              break;
          }
          N -= L;
        }
      }), v.chop();
    }
    eachLine(p, m = `
`) {
      const y = new o.default(this.ops);
      let v = new h(), S = 0;
      for (; y.hasNext(); ) {
        if (y.peekType() !== "insert")
          return;
        const E = y.peek(), T = a.default.length(E) - y.peekLength(), D = typeof E.insert == "string" ? E.insert.indexOf(m, T) - T : -1;
        if (D < 0)
          v.push(y.next());
        else if (D > 0)
          v.push(y.next(D));
        else {
          if (p(v, y.next(1).attributes || {}, S) === !1)
            return;
          S += 1, v = new h();
        }
      }
      v.length() > 0 && p(v, {}, S);
    }
    invert(p) {
      const m = new h();
      return this.reduce((y, v) => {
        if (v.insert)
          m.delete(a.default.length(v));
        else {
          if (typeof v.retain == "number" && v.attributes == null)
            return m.retain(v.retain), y + v.retain;
          if (v.delete || typeof v.retain == "number") {
            const S = v.delete || v.retain;
            return p.slice(y, y + S).forEach((T) => {
              v.delete ? m.push(T) : v.retain && v.attributes && m.retain(a.default.length(T), i.default.invert(v.attributes, T.attributes));
            }), y + S;
          } else if (typeof v.retain == "object" && v.retain !== null) {
            const S = p.slice(y, y + 1), E = new o.default(S.ops).next(), [T, D, N] = u(v.retain, E.insert), L = h.getHandler(T);
            return m.retain({ [T]: L.invert(D, N) }, i.default.invert(v.attributes, E.attributes)), y + 1;
          }
        }
        return y;
      }, 0), m.chop();
    }
    transform(p, m = !1) {
      if (m = !!m, typeof p == "number")
        return this.transformPosition(p, m);
      const y = p, v = new o.default(this.ops), S = new o.default(y.ops), E = new h();
      for (; v.hasNext() || S.hasNext(); )
        if (v.peekType() === "insert" && (m || S.peekType() !== "insert"))
          E.retain(a.default.length(v.next()));
        else if (S.peekType() === "insert")
          E.push(S.next());
        else {
          const T = Math.min(v.peekLength(), S.peekLength()), D = v.next(T), N = S.next(T);
          if (D.delete)
            continue;
          if (N.delete)
            E.push(N);
          else {
            const L = D.retain, M = N.retain;
            let $ = typeof M == "object" && M !== null ? M : T;
            if (typeof L == "object" && L !== null && typeof M == "object" && M !== null) {
              const z = Object.keys(L)[0];
              if (z === Object.keys(M)[0]) {
                const Pt = h.getHandler(z);
                Pt && ($ = {
                  [z]: Pt.transform(L[z], M[z], m)
                });
              }
            }
            E.retain($, i.default.transform(D.attributes, N.attributes, m));
          }
        }
      return E.chop();
    }
    transformPosition(p, m = !1) {
      m = !!m;
      const y = new o.default(this.ops);
      let v = 0;
      for (; y.hasNext() && v <= p; ) {
        const S = y.peekLength(), E = y.peekType();
        if (y.next(), E === "delete") {
          p -= Math.min(S, p - v);
          continue;
        } else E === "insert" && (v < p || !m) && (p += S);
        v += S;
      }
      return p;
    }
  }
  h.Op = a.default, h.OpIterator = o.default, h.AttributeMap = i.default, h.handlers = {}, t.default = h, r.exports = h, r.exports.default = h;
})(gr, gr.exports);
var mt = gr.exports;
const k = /* @__PURE__ */ Ho(mt);
class Lt extends ut {
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
Lt.blotName = "break";
Lt.tagName = "BR";
let Dt = class extends Mn {
};
const Sf = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Kn(r) {
  return r.replace(/[&<>"']/g, (t) => Sf[t]);
}
const Mt = class Mt extends Ur {
  static compare(t, e) {
    const s = Mt.order.indexOf(t), n = Mt.order.indexOf(e);
    return s >= 0 || n >= 0 ? s - n : t === e ? 0 : t < e ? -1 : 1;
  }
  formatAt(t, e, s, n) {
    if (Mt.compare(this.statics.blotName, s) < 0 && this.scroll.query(s, q.BLOT)) {
      const i = this.isolate(t, e);
      n && i.wrap(s, n);
    } else
      super.formatAt(t, e, s, n);
  }
  optimize(t) {
    if (super.optimize(t), this.parent instanceof Mt && Mt.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const e = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(e), e.wrap(this);
    }
  }
};
C(Mt, "allowedChildren", [Mt, Lt, ut, Dt]), // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
C(Mt, "order", [
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
let Bt = Mt;
const ja = 1;
class X extends _s {
  constructor() {
    super(...arguments);
    C(this, "cache", {});
  }
  delta() {
    return this.cache.delta == null && (this.cache.delta = Yo(this)), this.cache.delta;
  }
  deleteAt(e, s) {
    super.deleteAt(e, s), this.cache = {};
  }
  formatAt(e, s, n, i) {
    s <= 0 || (this.scroll.query(n, q.BLOCK) ? e + s === this.length() && this.format(n, i) : super.formatAt(e, Math.min(s, this.length() - e - 1), n, i), this.cache = {});
  }
  insertAt(e, s, n) {
    if (n != null) {
      super.insertAt(e, s, n), this.cache = {};
      return;
    }
    if (s.length === 0) return;
    const i = s.split(`
`), a = i.shift();
    a.length > 0 && (e < this.length() - 1 || this.children.tail == null ? super.insertAt(Math.min(e, this.length() - 1), a) : this.children.tail.insertAt(this.children.tail.length(), a), this.cache = {});
    let o = this;
    i.reduce((l, u) => (o = o.split(l, !0), o.insertAt(0, u), u.length), e + a.length);
  }
  insertBefore(e, s) {
    const {
      head: n
    } = this.children;
    super.insertBefore(e, s), n instanceof Lt && n.remove(), this.cache = {};
  }
  length() {
    return this.cache.length == null && (this.cache.length = super.length() + ja), this.cache.length;
  }
  moveChildren(e, s) {
    super.moveChildren(e, s), this.cache = {};
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
    let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (s && (e === 0 || e >= this.length() - ja)) {
      const i = this.clone();
      return e === 0 ? (this.parent.insertBefore(i, this), this) : (this.parent.insertBefore(i, this.next), i);
    }
    const n = super.split(e, s);
    return this.cache = {}, n;
  }
}
X.blotName = "block";
X.tagName = "P";
X.defaultChild = Lt;
X.allowedChildren = [Lt, Bt, ut, Dt];
class gt extends ut {
  attach() {
    super.attach(), this.attributes = new jn(this.domNode);
  }
  delta() {
    return new k().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values()
    });
  }
  format(t, e) {
    const s = this.scroll.query(t, q.BLOCK_ATTRIBUTE);
    s != null && this.attributes.attribute(s, e);
  }
  formatAt(t, e, s, n) {
    this.format(s, n);
  }
  insertAt(t, e, s) {
    if (s != null) {
      super.insertAt(t, e, s);
      return;
    }
    const n = e.split(`
`), i = n.pop(), a = n.map((l) => {
      const u = this.scroll.create(X.blotName);
      return u.insertAt(0, l), u;
    }), o = this.split(t);
    a.forEach((l) => {
      this.parent.insertBefore(l, o);
    }), i && this.parent.insertBefore(this.scroll.create("text", i), o);
  }
}
gt.scope = q.BLOCK_BLOT;
function Yo(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  return r.descendants(st).reduce((e, s) => s.length() === 0 ? e : e.insert(s.value(), ft(s, {}, t)), new k()).insert(`
`, ft(r));
}
function ft(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  return r == null || ("formats" in r && typeof r.formats == "function" && (t = {
    ...t,
    ...r.formats()
  }, e && delete t["code-token"]), r.parent == null || r.parent.statics.blotName === "scroll" || r.parent.statics.scope !== r.statics.scope) ? t : ft(r.parent, t, e);
}
const ht = class ht extends ut {
  // Zero width no break space
  static value() {
  }
  constructor(t, e, s) {
    super(t, e), this.selection = s, this.textNode = document.createTextNode(ht.CONTENTS), this.domNode.appendChild(this.textNode), this.savedLength = 0;
  }
  detach() {
    this.parent != null && this.parent.removeChild(this);
  }
  format(t, e) {
    if (this.savedLength !== 0) {
      super.format(t, e);
      return;
    }
    let s = this, n = 0;
    for (; s != null && s.statics.scope !== q.BLOCK_BLOT; )
      n += s.offset(s.parent), s = s.parent;
    s != null && (this.savedLength = ht.CONTENTS.length, s.optimize(), s.formatAt(n, ht.CONTENTS.length, t, e), this.savedLength = 0);
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
    const e = this.prev instanceof Dt ? this.prev : null, s = e ? e.length() : 0, n = this.next instanceof Dt ? this.next : null, i = n ? n.text : "", {
      textNode: a
    } = this, o = a.data.split(ht.CONTENTS).join("");
    a.data = ht.CONTENTS;
    let l;
    if (e)
      l = e, (o || n) && (e.insertAt(e.length(), o + i), n && n.remove());
    else if (n)
      l = n, n.insertAt(0, o);
    else {
      const u = document.createTextNode(o);
      l = this.scroll.create(u), this.parent.insertBefore(l, this);
    }
    if (this.remove(), t) {
      const u = (p, m) => e && p === e.domNode ? m : p === a ? s + m - 1 : n && p === n.domNode ? s + o.length + m : null, h = u(t.start.node, t.start.offset), g = u(t.end.node, t.end.offset);
      if (h !== null && g !== null)
        return {
          startNode: l.domNode,
          startOffset: h,
          endNode: l.domNode,
          endOffset: g
        };
    }
    return null;
  }
  update(t, e) {
    if (t.some((s) => s.type === "characterData" && s.target === this.textNode)) {
      const s = this.restore();
      s && (e.range = s);
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
        this.savedLength = ht.CONTENTS.length, e.isolate(this.offset(e), this.length()).unwrap(), this.savedLength = 0;
        break;
      }
      e = e.parent;
    }
  }
  value() {
    return "";
  }
};
C(ht, "blotName", "cursor"), C(ht, "className", "ql-cursor"), C(ht, "tagName", "span"), C(ht, "CONTENTS", "\uFEFF");
let ss = ht;
var Wo = { exports: {} };
(function(r) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function s() {
  }
  Object.create && (s.prototype = /* @__PURE__ */ Object.create(null), new s().__proto__ || (e = !1));
  function n(l, u, h) {
    this.fn = l, this.context = u, this.once = h || !1;
  }
  function i(l, u, h, g, p) {
    if (typeof h != "function")
      throw new TypeError("The listener must be a function");
    var m = new n(h, g || l, p), y = e ? e + u : u;
    return l._events[y] ? l._events[y].fn ? l._events[y] = [l._events[y], m] : l._events[y].push(m) : (l._events[y] = m, l._eventsCount++), l;
  }
  function a(l, u) {
    --l._eventsCount === 0 ? l._events = new s() : delete l._events[u];
  }
  function o() {
    this._events = new s(), this._eventsCount = 0;
  }
  o.prototype.eventNames = function() {
    var u = [], h, g;
    if (this._eventsCount === 0) return u;
    for (g in h = this._events)
      t.call(h, g) && u.push(e ? g.slice(1) : g);
    return Object.getOwnPropertySymbols ? u.concat(Object.getOwnPropertySymbols(h)) : u;
  }, o.prototype.listeners = function(u) {
    var h = e ? e + u : u, g = this._events[h];
    if (!g) return [];
    if (g.fn) return [g.fn];
    for (var p = 0, m = g.length, y = new Array(m); p < m; p++)
      y[p] = g[p].fn;
    return y;
  }, o.prototype.listenerCount = function(u) {
    var h = e ? e + u : u, g = this._events[h];
    return g ? g.fn ? 1 : g.length : 0;
  }, o.prototype.emit = function(u, h, g, p, m, y) {
    var v = e ? e + u : u;
    if (!this._events[v]) return !1;
    var S = this._events[v], E = arguments.length, T, D;
    if (S.fn) {
      switch (S.once && this.removeListener(u, S.fn, void 0, !0), E) {
        case 1:
          return S.fn.call(S.context), !0;
        case 2:
          return S.fn.call(S.context, h), !0;
        case 3:
          return S.fn.call(S.context, h, g), !0;
        case 4:
          return S.fn.call(S.context, h, g, p), !0;
        case 5:
          return S.fn.call(S.context, h, g, p, m), !0;
        case 6:
          return S.fn.call(S.context, h, g, p, m, y), !0;
      }
      for (D = 1, T = new Array(E - 1); D < E; D++)
        T[D - 1] = arguments[D];
      S.fn.apply(S.context, T);
    } else {
      var N = S.length, L;
      for (D = 0; D < N; D++)
        switch (S[D].once && this.removeListener(u, S[D].fn, void 0, !0), E) {
          case 1:
            S[D].fn.call(S[D].context);
            break;
          case 2:
            S[D].fn.call(S[D].context, h);
            break;
          case 3:
            S[D].fn.call(S[D].context, h, g);
            break;
          case 4:
            S[D].fn.call(S[D].context, h, g, p);
            break;
          default:
            if (!T) for (L = 1, T = new Array(E - 1); L < E; L++)
              T[L - 1] = arguments[L];
            S[D].fn.apply(S[D].context, T);
        }
    }
    return !0;
  }, o.prototype.on = function(u, h, g) {
    return i(this, u, h, g, !1);
  }, o.prototype.once = function(u, h, g) {
    return i(this, u, h, g, !0);
  }, o.prototype.removeListener = function(u, h, g, p) {
    var m = e ? e + u : u;
    if (!this._events[m]) return this;
    if (!h)
      return a(this, m), this;
    var y = this._events[m];
    if (y.fn)
      y.fn === h && (!p || y.once) && (!g || y.context === g) && a(this, m);
    else {
      for (var v = 0, S = [], E = y.length; v < E; v++)
        (y[v].fn !== h || p && !y[v].once || g && y[v].context !== g) && S.push(y[v]);
      S.length ? this._events[m] = S.length === 1 ? S[0] : S : a(this, m);
    }
    return this;
  }, o.prototype.removeAllListeners = function(u) {
    var h;
    return u ? (h = e ? e + u : u, this._events[h] && a(this, h)) : (this._events = new s(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = e, o.EventEmitter = o, r.exports = o;
})(Wo);
var Af = Wo.exports;
const Ef = /* @__PURE__ */ Ho(Af), yr = /* @__PURE__ */ new WeakMap(), vr = ["error", "warn", "log", "info"];
let wr = "warn";
function Zo(r) {
  if (wr && vr.indexOf(r) <= vr.indexOf(wr)) {
    for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      e[s - 1] = arguments[s];
    console[r](...e);
  }
}
function Zt(r) {
  return vr.reduce((t, e) => (t[e] = Zo.bind(console, e, r), t), {});
}
Zt.level = (r) => {
  wr = r;
};
Zo.level = Zt.level;
const Wi = Zt("quill:events"), xf = ["selectionchange", "mousedown", "mouseup", "click"];
xf.forEach((r) => {
  document.addEventListener(r, function() {
    for (var t = arguments.length, e = new Array(t), s = 0; s < t; s++)
      e[s] = arguments[s];
    Array.from(document.querySelectorAll(".ql-container")).forEach((n) => {
      const i = yr.get(n);
      i && i.emitter && i.emitter.handleDOM(...e);
    });
  });
});
class I extends Ef {
  constructor() {
    super(), this.domListeners = {}, this.on("error", Wi.error);
  }
  emit() {
    for (var t = arguments.length, e = new Array(t), s = 0; s < t; s++)
      e[s] = arguments[s];
    return Wi.log.call(Wi, ...e), super.emit(...e);
  }
  handleDOM(t) {
    for (var e = arguments.length, s = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++)
      s[n - 1] = arguments[n];
    (this.domListeners[t.type] || []).forEach((i) => {
      let {
        node: a,
        handler: o
      } = i;
      (t.target === a || a.contains(t.target)) && o(t, ...s);
    });
  }
  listenDOM(t, e, s) {
    this.domListeners[t] || (this.domListeners[t] = []), this.domListeners[t].push({
      node: e,
      handler: s
    });
  }
}
C(I, "events", {
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
}), C(I, "sources", {
  API: "api",
  SILENT: "silent",
  USER: "user"
});
const Zi = Zt("quill:selection");
class ve {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = t, this.length = e;
  }
}
class Tf {
  constructor(t, e) {
    this.emitter = e, this.scroll = t, this.composing = !1, this.mouseDown = !1, this.root = this.scroll.domNode, this.cursor = this.scroll.create("cursor", this), this.savedRange = new ve(0, 0), this.lastRange = this.savedRange, this.lastNative = null, this.handleComposition(), this.handleDragging(), this.emitter.listenDOM("selectionchange", document, () => {
      !this.mouseDown && !this.composing && setTimeout(this.update.bind(this, I.sources.USER), 1);
    }), this.emitter.on(I.events.SCROLL_BEFORE_UPDATE, () => {
      if (!this.hasFocus()) return;
      const s = this.getNativeRange();
      s != null && s.start.node !== this.cursor.textNode && this.emitter.once(I.events.SCROLL_UPDATE, (n, i) => {
        try {
          this.root.contains(s.start.node) && this.root.contains(s.end.node) && this.setNativeRange(s.start.node, s.start.offset, s.end.node, s.end.offset);
          const a = i.some((o) => o.type === "characterData" || o.type === "childList" || o.type === "attributes" && o.target === this.root);
          this.update(a ? I.sources.SILENT : n);
        } catch {
        }
      });
    }), this.emitter.on(I.events.SCROLL_OPTIMIZE, (s, n) => {
      if (n.range) {
        const {
          startNode: i,
          startOffset: a,
          endNode: o,
          endOffset: l
        } = n.range;
        this.setNativeRange(i, a, o, l), this.update(I.sources.SILENT);
      }
    }), this.update(I.sources.SILENT);
  }
  handleComposition() {
    this.emitter.on(I.events.COMPOSITION_BEFORE_START, () => {
      this.composing = !0;
    }), this.emitter.on(I.events.COMPOSITION_END, () => {
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
      this.mouseDown = !1, this.update(I.sources.USER);
    });
  }
  focus() {
    this.hasFocus() || (this.root.focus({
      preventScroll: !0
    }), this.setRange(this.savedRange));
  }
  format(t, e) {
    this.scroll.update();
    const s = this.getNativeRange();
    if (!(s == null || !s.native.collapsed || this.scroll.query(t, q.BLOCK))) {
      if (s.start.node !== this.cursor.textNode) {
        const n = this.scroll.find(s.start.node, !1);
        if (n == null) return;
        if (n instanceof st) {
          const i = n.split(s.start.offset);
          n.parent.insertBefore(this.cursor, i);
        } else
          n.insertBefore(this.cursor, s.start.node);
        this.cursor.attach();
      }
      this.cursor.format(t, e), this.scroll.optimize(), this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length), this.update();
    }
  }
  getBounds(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const s = this.scroll.length();
    t = Math.min(t, s - 1), e = Math.min(t + e, s - 1) - t;
    let n, [i, a] = this.scroll.leaf(t);
    if (i == null) return null;
    if (e > 0 && a === i.length()) {
      const [h] = this.scroll.leaf(t + 1);
      if (h) {
        const [g] = this.scroll.line(t), [p] = this.scroll.line(t + 1);
        g === p && (i = h, a = 0);
      }
    }
    [n, a] = i.position(a, !0);
    const o = document.createRange();
    if (e > 0)
      return o.setStart(n, a), [i, a] = this.scroll.leaf(t + e), i == null ? null : ([n, a] = i.position(a, !0), o.setEnd(n, a), o.getBoundingClientRect());
    let l = "left", u;
    if (n instanceof Text) {
      if (!n.data.length)
        return null;
      a < n.data.length ? (o.setStart(n, a), o.setEnd(n, a + 1)) : (o.setStart(n, a - 1), o.setEnd(n, a), l = "right"), u = o.getBoundingClientRect();
    } else {
      if (!(i.domNode instanceof Element)) return null;
      u = i.domNode.getBoundingClientRect(), a > 0 && (l = "right");
    }
    return {
      bottom: u.top + u.height,
      height: u.height,
      left: u[l],
      right: u[l],
      top: u.top,
      width: 0
    };
  }
  getNativeRange() {
    const t = document.getSelection();
    if (t == null || t.rangeCount <= 0) return null;
    const e = t.getRangeAt(0);
    if (e == null) return null;
    const s = this.normalizeNative(e);
    return Zi.info("getNativeRange", s), s;
  }
  getRange() {
    const t = this.scroll.domNode;
    if ("isConnected" in t && !t.isConnected)
      return [null, null];
    const e = this.getNativeRange();
    return e == null ? [null, null] : [this.normalizedToRange(e), e];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && Qi(this.root, document.activeElement);
  }
  normalizedToRange(t) {
    const e = [[t.start.node, t.start.offset]];
    t.native.collapsed || e.push([t.end.node, t.end.offset]);
    const s = e.map((a) => {
      const [o, l] = a, u = this.scroll.find(o, !0), h = u.offset(this.scroll);
      return l === 0 ? h : u instanceof st ? h + u.index(o, l) : h + u.length();
    }), n = Math.min(Math.max(...s), this.scroll.length() - 1), i = Math.min(n, ...s);
    return new ve(i, n - i);
  }
  normalizeNative(t) {
    if (!Qi(this.root, t.startContainer) || !t.collapsed && !Qi(this.root, t.endContainer))
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
    return [e.start, e.end].forEach((s) => {
      let {
        node: n,
        offset: i
      } = s;
      for (; !(n instanceof Text) && n.childNodes.length > 0; )
        if (n.childNodes.length > i)
          n = n.childNodes[i], i = 0;
        else if (n.childNodes.length === i)
          n = n.lastChild, n instanceof Text ? i = n.data.length : n.childNodes.length > 0 ? i = n.childNodes.length : i = n.childNodes.length + 1;
        else
          break;
      s.node = n, s.offset = i;
    }), e;
  }
  rangeToNative(t) {
    const e = this.scroll.length(), s = (n, i) => {
      n = Math.min(e - 1, n);
      const [a, o] = this.scroll.leaf(n);
      return a ? a.position(o, i) : [null, -1];
    };
    return [...s(t.index, !1), ...s(t.index + t.length, !0)];
  }
  setNativeRange(t, e) {
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : t, n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : e, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !1;
    if (Zi.info("setNativeRange", t, e, s, n), t != null && (this.root.parentNode == null || t.parentNode == null || // @ts-expect-error Fix me later
    s.parentNode == null))
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
        if (o == null || i || t !== o.startContainer || e !== o.startOffset || s !== o.endContainer || n !== o.endOffset) {
          t instanceof Element && t.tagName === "BR" && (e = Array.from(t.parentNode.childNodes).indexOf(t), t = t.parentNode), s instanceof Element && s.tagName === "BR" && (n = Array.from(s.parentNode.childNodes).indexOf(s), s = s.parentNode);
          const l = document.createRange();
          l.setStart(t, e), l.setEnd(s, n), a.removeAllRanges(), a.addRange(l);
        }
      } else
        a.removeAllRanges(), this.root.blur();
  }
  setRange(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : I.sources.API;
    if (typeof e == "string" && (s = e, e = !1), Zi.info("setRange", t), t != null) {
      const n = this.rangeToNative(t);
      this.setNativeRange(...n, e);
    } else
      this.setNativeRange(null);
    this.update(s);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : I.sources.USER;
    const e = this.lastRange, [s, n] = this.getRange();
    if (this.lastRange = s, this.lastNative = n, this.lastRange != null && (this.savedRange = this.lastRange), !jr(e, this.lastRange)) {
      if (!this.composing && n != null && n.native.collapsed && n.start.node !== this.cursor.textNode) {
        const a = this.cursor.restore();
        a && this.setNativeRange(a.startNode, a.startOffset, a.endNode, a.endOffset);
      }
      const i = [I.events.SELECTION_CHANGE, ze(this.lastRange), ze(e), t];
      this.emitter.emit(I.events.EDITOR_CHANGE, ...i), t !== I.sources.SILENT && this.emitter.emit(...i);
    }
  }
}
function Qi(r, t) {
  try {
    t.parentNode;
  } catch {
    return !1;
  }
  return r.contains(t);
}
const Df = /^[ -~]*$/;
class Cf {
  constructor(t) {
    this.scroll = t, this.delta = this.getDelta();
  }
  applyDelta(t) {
    this.scroll.update();
    let e = this.scroll.length();
    this.scroll.batchStart();
    const s = Ua(t), n = new k();
    return If(s.ops.slice()).reduce((a, o) => {
      const l = mt.Op.length(o);
      let u = o.attributes || {}, h = !1, g = !1;
      if (o.insert != null) {
        if (n.retain(l), typeof o.insert == "string") {
          const y = o.insert;
          g = !y.endsWith(`
`) && (e <= a || !!this.scroll.descendant(gt, a)[0]), this.scroll.insertAt(a, y);
          const [v, S] = this.scroll.line(a);
          let E = ie({}, ft(v));
          if (v instanceof X) {
            const [T] = v.descendant(st, S);
            T && (E = ie(E, ft(T)));
          }
          u = mt.AttributeMap.diff(E, u) || {};
        } else if (typeof o.insert == "object") {
          const y = Object.keys(o.insert)[0];
          if (y == null) return a;
          const v = this.scroll.query(y, q.INLINE) != null;
          if (v)
            (e <= a || this.scroll.descendant(gt, a)[0]) && (g = !0);
          else if (a > 0) {
            const [S, E] = this.scroll.descendant(st, a - 1);
            S instanceof Dt ? S.value()[E] !== `
` && (h = !0) : S instanceof ut && S.statics.scope === q.INLINE_BLOT && (h = !0);
          }
          if (this.scroll.insertAt(a, y, o.insert[y]), v) {
            const [S] = this.scroll.descendant(st, a);
            if (S) {
              const E = ie({}, ft(S));
              u = mt.AttributeMap.diff(E, u) || {};
            }
          }
        }
        e += l;
      } else if (n.push(o), o.retain !== null && typeof o.retain == "object") {
        const y = Object.keys(o.retain)[0];
        if (y == null) return a;
        this.scroll.updateEmbedAt(a, y, o.retain[y]);
      }
      Object.keys(u).forEach((y) => {
        this.scroll.formatAt(a, l, y, u[y]);
      });
      const p = h ? 1 : 0, m = g ? 1 : 0;
      return e += p + m, n.retain(p), n.delete(m), a + l + p + m;
    }, 0), n.reduce((a, o) => typeof o.delete == "number" ? (this.scroll.deleteAt(a, o.delete), a) : a + mt.Op.length(o), 0), this.scroll.batchEnd(), this.scroll.optimize(), this.update(s);
  }
  deleteText(t, e) {
    return this.scroll.deleteAt(t, e), this.update(new k().retain(t).delete(e));
  }
  formatLine(t, e) {
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.scroll.update(), Object.keys(s).forEach((i) => {
      this.scroll.lines(t, Math.max(e, 1)).forEach((a) => {
        a.format(i, s[i]);
      });
    }), this.scroll.optimize();
    const n = new k().retain(t).retain(e, ze(s));
    return this.update(n);
  }
  formatText(t, e) {
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(s).forEach((i) => {
      this.scroll.formatAt(t, e, i, s[i]);
    });
    const n = new k().retain(t).retain(e, ze(s));
    return this.update(n);
  }
  getContents(t, e) {
    return this.delta.slice(t, t + e);
  }
  getDelta() {
    return this.scroll.lines().reduce((t, e) => t.concat(e.delta()), new k());
  }
  getFormat(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, s = [], n = [];
    e === 0 ? this.scroll.path(t).forEach((o) => {
      const [l] = o;
      l instanceof X ? s.push(l) : l instanceof st && n.push(l);
    }) : (s = this.scroll.lines(t, e), n = this.scroll.descendants(st, t, e));
    const [i, a] = [s, n].map((o) => {
      const l = o.shift();
      if (l == null) return {};
      let u = ft(l);
      for (; Object.keys(u).length > 0; ) {
        const h = o.shift();
        if (h == null) return u;
        u = Lf(ft(h), u);
      }
      return u;
    });
    return {
      ...i,
      ...a
    };
  }
  getHTML(t, e) {
    const [s, n] = this.scroll.line(t);
    if (s) {
      const i = s.length();
      return s.length() >= n + e && !(n === 0 && e === i) ? Bs(s, n, e, !0) : Bs(this.scroll, t, e, !0);
    }
    return "";
  }
  getText(t, e) {
    return this.getContents(t, e).filter((s) => typeof s.insert == "string").map((s) => s.insert).join("");
  }
  insertContents(t, e) {
    const s = Ua(e), n = new k().retain(t).concat(s);
    return this.scroll.insertContents(t, s), this.update(n);
  }
  insertEmbed(t, e, s) {
    return this.scroll.insertAt(t, e, s), this.update(new k().retain(t).insert({
      [e]: s
    }));
  }
  insertText(t, e) {
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return e = e.replace(/\r\n/g, `
`).replace(/\r/g, `
`), this.scroll.insertAt(t, e), Object.keys(s).forEach((n) => {
      this.scroll.formatAt(t, e.length, n, s[n]);
    }), this.update(new k().retain(t).insert(e, ze(s)));
  }
  isBlank() {
    if (this.scroll.children.length === 0) return !0;
    if (this.scroll.children.length > 1) return !1;
    const t = this.scroll.children.head;
    if ((t == null ? void 0 : t.statics.blotName) !== X.blotName) return !1;
    const e = t;
    return e.children.length > 1 ? !1 : e.children.head instanceof Lt;
  }
  removeFormat(t, e) {
    const s = this.getText(t, e), [n, i] = this.scroll.line(t + e);
    let a = 0, o = new k();
    n != null && (a = n.length() - i, o = n.delta().slice(i, i + a - 1).insert(`
`));
    const u = this.getContents(t, e + a).diff(new k().insert(s).concat(o)), h = new k().retain(t).concat(u);
    return this.applyDelta(h);
  }
  update(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
    const n = this.delta;
    if (e.length === 1 && e[0].type === "characterData" && // @ts-expect-error Fix me later
    e[0].target.data.match(Df) && this.scroll.find(e[0].target)) {
      const i = this.scroll.find(e[0].target), a = ft(i), o = i.offset(this.scroll), l = e[0].oldValue.replace(ss.CONTENTS, ""), u = new k().insert(l), h = new k().insert(i.value()), g = s && {
        oldRange: za(s.oldRange, -o),
        newRange: za(s.newRange, -o)
      };
      t = new k().retain(o).concat(u.diff(h, g)).reduce((m, y) => y.insert ? m.insert(y.insert, a) : m.push(y), new k()), this.delta = n.compose(t);
    } else
      this.delta = this.getDelta(), (!t || !jr(n.compose(t), this.delta)) && (t = n.diff(this.delta, s));
    return t;
  }
}
function He(r, t, e) {
  if (r.length === 0) {
    const [m] = Xi(e.pop());
    return t <= 0 ? `</li></${m}>` : `</li></${m}>${He([], t - 1, e)}`;
  }
  const [{
    child: s,
    offset: n,
    length: i,
    indent: a,
    type: o
  }, ...l] = r, [u, h] = Xi(o);
  if (a > t)
    return e.push(o), a === t + 1 ? `<${u}><li${h}>${Bs(s, n, i)}${He(l, a, e)}` : `<${u}><li>${He(r, t + 1, e)}`;
  const g = e[e.length - 1];
  if (a === t && o === g)
    return `</li><li${h}>${Bs(s, n, i)}${He(l, a, e)}`;
  const [p] = Xi(e.pop());
  return `</li></${p}>${He(r, t - 1, e)}`;
}
function Bs(r, t, e) {
  let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if ("html" in r && typeof r.html == "function")
    return r.html(t, e);
  if (r instanceof Dt)
    return Kn(r.value().slice(t, t + e)).replaceAll(" ", "&nbsp;");
  if (r instanceof Tt) {
    if (r.statics.blotName === "list-container") {
      const u = [];
      return r.children.forEachAt(t, e, (h, g, p) => {
        const m = "formats" in h && typeof h.formats == "function" ? h.formats() : {};
        u.push({
          child: h,
          offset: g,
          length: p,
          indent: m.indent || 0,
          type: m.list
        });
      }), He(u, -1, []);
    }
    const n = [];
    if (r.children.forEachAt(t, e, (u, h, g) => {
      n.push(Bs(u, h, g));
    }), s || r.statics.blotName === "list")
      return n.join("");
    const {
      outerHTML: i,
      innerHTML: a
    } = r.domNode, [o, l] = i.split(`>${a}<`);
    return o === "<table" ? `<table style="border: 1px solid #000;">${n.join("")}<${l}` : `${o}>${n.join("")}<${l}`;
  }
  return r.domNode instanceof Element ? r.domNode.outerHTML : "";
}
function Lf(r, t) {
  return Object.keys(t).reduce((e, s) => {
    if (r[s] == null) return e;
    const n = t[s];
    return n === r[s] ? e[s] = n : Array.isArray(n) ? n.indexOf(r[s]) < 0 ? e[s] = n.concat([r[s]]) : e[s] = n : e[s] = [n, r[s]], e;
  }, {});
}
function Xi(r) {
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
function Ua(r) {
  return r.reduce((t, e) => {
    if (typeof e.insert == "string") {
      const s = e.insert.replace(/\r\n/g, `
`).replace(/\r/g, `
`);
      return t.insert(s, e.attributes);
    }
    return t.push(e);
  }, new k());
}
function za(r, t) {
  let {
    index: e,
    length: s
  } = r;
  return new ve(e + t, s);
}
function If(r) {
  const t = [];
  return r.forEach((e) => {
    typeof e.insert == "string" ? e.insert.split(`
`).forEach((n, i) => {
      i && t.push({
        insert: `
`,
        attributes: e.attributes
      }), n && t.push({
        insert: n,
        attributes: e.attributes
      });
    }) : t.push(e);
  }), t;
}
class It {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = t, this.options = e;
  }
}
C(It, "DEFAULTS", {});
const An = "\uFEFF";
class Wr extends ut {
  constructor(t, e) {
    super(t, e), this.contentNode = document.createElement("span"), this.contentNode.setAttribute("contenteditable", "false"), Array.from(this.domNode.childNodes).forEach((s) => {
      this.contentNode.appendChild(s);
    }), this.leftGuard = document.createTextNode(An), this.rightGuard = document.createTextNode(An), this.domNode.appendChild(this.leftGuard), this.domNode.appendChild(this.contentNode), this.domNode.appendChild(this.rightGuard);
  }
  index(t, e) {
    return t === this.leftGuard ? 0 : t === this.rightGuard ? 1 : super.index(t, e);
  }
  restore(t) {
    let e = null, s;
    const n = t.data.split(An).join("");
    if (t === this.leftGuard)
      if (this.prev instanceof Dt) {
        const i = this.prev.length();
        this.prev.insertAt(i, n), e = {
          startNode: this.prev.domNode,
          startOffset: i + n.length
        };
      } else
        s = document.createTextNode(n), this.parent.insertBefore(this.scroll.create(s), this), e = {
          startNode: s,
          startOffset: n.length
        };
    else t === this.rightGuard && (this.next instanceof Dt ? (this.next.insertAt(0, n), e = {
      startNode: this.next.domNode,
      startOffset: n.length
    }) : (s = document.createTextNode(n), this.parent.insertBefore(this.scroll.create(s), this.next), e = {
      startNode: s,
      startOffset: n.length
    }));
    return t.data = An, e;
  }
  update(t, e) {
    t.forEach((s) => {
      if (s.type === "characterData" && (s.target === this.leftGuard || s.target === this.rightGuard)) {
        const n = this.restore(s.target);
        n && (e.range = n);
      }
    });
  }
}
class Nf {
  constructor(t, e) {
    C(this, "isComposing", !1);
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
    e && !(e instanceof Wr) && (this.emitter.emit(I.events.COMPOSITION_BEFORE_START, t), this.scroll.batchStart(), this.emitter.emit(I.events.COMPOSITION_START, t), this.isComposing = !0);
  }
  handleCompositionEnd(t) {
    this.emitter.emit(I.events.COMPOSITION_BEFORE_END, t), this.scroll.batchEnd(), this.emitter.emit(I.events.COMPOSITION_END, t), this.isComposing = !1;
  }
}
const ks = class ks {
  constructor(t, e) {
    C(this, "modules", {});
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
C(ks, "DEFAULTS", {
  modules: {}
}), C(ks, "themes", {
  default: ks
});
let ns = ks;
const kf = (r) => r.parentElement || r.getRootNode().host || null, qf = (r) => {
  const t = r.getBoundingClientRect(), e = "offsetWidth" in r && Math.abs(t.width) / r.offsetWidth || 1, s = "offsetHeight" in r && Math.abs(t.height) / r.offsetHeight || 1;
  return {
    top: t.top,
    right: t.left + r.clientWidth * e,
    bottom: t.top + r.clientHeight * s,
    left: t.left
  };
}, En = (r) => {
  const t = parseInt(r, 10);
  return Number.isNaN(t) ? 0 : t;
}, Va = (r, t, e, s, n, i) => r < e && t > s ? 0 : r < e ? -(e - r + n) : t > s ? t - r > s - e ? r + n - e : t - s + i : 0, Of = (r, t) => {
  var i, a, o;
  const e = r.ownerDocument;
  let s = t, n = r;
  for (; n; ) {
    const l = n === e.body, u = l ? {
      top: 0,
      right: ((i = window.visualViewport) == null ? void 0 : i.width) ?? e.documentElement.clientWidth,
      bottom: ((a = window.visualViewport) == null ? void 0 : a.height) ?? e.documentElement.clientHeight,
      left: 0
    } : qf(n), h = getComputedStyle(n), g = Va(s.left, s.right, u.left, u.right, En(h.scrollPaddingLeft), En(h.scrollPaddingRight)), p = Va(s.top, s.bottom, u.top, u.bottom, En(h.scrollPaddingTop), En(h.scrollPaddingBottom));
    if (g || p)
      if (l)
        (o = e.defaultView) == null || o.scrollBy(g, p);
      else {
        const {
          scrollLeft: m,
          scrollTop: y
        } = n;
        p && (n.scrollTop += p), g && (n.scrollLeft += g);
        const v = n.scrollLeft - m, S = n.scrollTop - y;
        s = {
          left: s.left - v,
          top: s.top - S,
          right: s.right - v,
          bottom: s.bottom - S
        };
      }
    n = l || h.position === "fixed" ? null : kf(n);
  }
}, Mf = 100, Rf = ["block", "break", "cursor", "inline", "scroll", "text"], _f = (r, t, e) => {
  const s = new es();
  return Rf.forEach((n) => {
    const i = t.query(n);
    i && s.register(i);
  }), r.forEach((n) => {
    let i = t.query(n);
    i || e.error(`Cannot register "${n}" specified in "formats" config. Are you sure it was registered?`);
    let a = 0;
    for (; i; )
      if (s.register(i), i = "blotName" in i ? i.requiredContainer ?? null : null, a += 1, a > Mf) {
        e.error(`Cycle detected in registering blot requiredContainer: "${n}"`);
        break;
      }
  }), s;
}, Ge = Zt("quill"), xn = new es();
Tt.uiClass = "ql-ui";
const At = class At {
  static debug(t) {
    t === !0 && (t = "log"), Zt.level(t);
  }
  static find(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    return yr.get(t) || xn.find(t, e);
  }
  static import(t) {
    return this.imports[t] == null && Ge.error(`Cannot import ${t}. Are you sure it was registered?`), this.imports[t];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) != "string") {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = !!(!(arguments.length <= 1) && arguments[1]), s = "attrName" in t ? t.attrName : t.blotName;
      typeof s == "string" ? this.register(`formats/${s}`, t, e) : Object.keys(t).forEach((n) => {
        this.register(n, t[n], e);
      });
    } else {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = arguments.length <= 1 ? void 0 : arguments[1], s = !!(!(arguments.length <= 2) && arguments[2]);
      this.imports[t] != null && !s && Ge.warn(`Overwriting ${t} with`, e), this.imports[t] = e, (t.startsWith("blots/") || t.startsWith("formats/")) && e && typeof e != "boolean" && e.blotName !== "abstract" && xn.register(e), typeof e.register == "function" && e.register(xn);
    }
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.options = $f(t, e), this.container = this.options.container, this.container == null) {
      Ge.error("Invalid Quill container", t);
      return;
    }
    this.options.debug && At.debug(this.options.debug);
    const s = this.container.innerHTML.trim();
    this.container.classList.add("ql-container"), this.container.innerHTML = "", yr.set(this.container, this), this.root = this.addContainer("ql-editor"), this.root.classList.add("ql-blank"), this.emitter = new I();
    const n = zr.blotName, i = this.options.registry.query(n);
    if (!i || !("blotName" in i))
      throw new Error(`Cannot initialize Quill without "${n}" blot`);
    if (this.scroll = new i(this.options.registry, this.root, {
      emitter: this.emitter
    }), this.editor = new Cf(this.scroll), this.selection = new Tf(this.scroll, this.emitter), this.composition = new Nf(this.scroll, this.emitter), this.theme = new this.options.theme(this, this.options), this.keyboard = this.theme.addModule("keyboard"), this.clipboard = this.theme.addModule("clipboard"), this.history = this.theme.addModule("history"), this.uploader = this.theme.addModule("uploader"), this.theme.addModule("input"), this.theme.addModule("uiNode"), this.theme.init(), this.emitter.on(I.events.EDITOR_CHANGE, (a) => {
      a === I.events.TEXT_CHANGE && this.root.classList.toggle("ql-blank", this.editor.isBlank());
    }), this.emitter.on(I.events.SCROLL_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [u] = this.selection.getRange(), h = l && u ? {
        oldRange: l,
        newRange: u
      } : void 0;
      St.call(this, () => this.editor.update(null, o, h), a);
    }), this.emitter.on(I.events.SCROLL_EMBED_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [u] = this.selection.getRange(), h = l && u ? {
        oldRange: l,
        newRange: u
      } : void 0;
      St.call(this, () => {
        const g = new k().retain(a.offset(this)).retain({
          [a.statics.blotName]: o
        });
        return this.editor.update(g, [], h);
      }, At.sources.USER);
    }), s) {
      const a = this.clipboard.convert({
        html: `${s}<p><br></p>`,
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
      const s = t;
      t = document.createElement("div"), t.classList.add(s);
    }
    return this.container.insertBefore(t, e), t;
  }
  blur() {
    this.selection.setRange(null);
  }
  deleteText(t, e, s) {
    return [t, e, , s] = Vt(t, e, s), St.call(this, () => this.editor.deleteText(t, e), s, t, -1 * e);
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
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : I.sources.API;
    return St.call(this, () => {
      const n = this.getSelection(!0);
      let i = new k();
      if (n == null) return i;
      if (this.scroll.query(t, q.BLOCK))
        i = this.editor.formatLine(n.index, n.length, {
          [t]: e
        });
      else {
        if (n.length === 0)
          return this.selection.format(t, e), i;
        i = this.editor.formatText(n.index, n.length, {
          [t]: e
        });
      }
      return this.setSelection(n, I.sources.SILENT), i;
    }, s);
  }
  formatLine(t, e, s, n, i) {
    let a;
    return [t, e, a, i] = Vt(
      t,
      e,
      // @ts-expect-error
      s,
      n,
      i
    ), St.call(this, () => this.editor.formatLine(t, e, a), i, t, 0);
  }
  formatText(t, e, s, n, i) {
    let a;
    return [t, e, a, i] = Vt(
      // @ts-expect-error
      t,
      e,
      s,
      n,
      i
    ), St.call(this, () => this.editor.formatText(t, e, a), i, t, 0);
  }
  getBounds(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, s = null;
    if (typeof t == "number" ? s = this.selection.getBounds(t, e) : s = this.selection.getBounds(t.index, t.length), !s) return null;
    const n = this.container.getBoundingClientRect();
    return {
      bottom: s.bottom - n.top,
      height: s.height,
      left: s.left - n.left,
      right: s.right - n.left,
      top: s.top - n.top,
      width: s.width
    };
  }
  getContents() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - t;
    return [t, e] = Vt(t, e), this.editor.getContents(t, e);
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
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = Vt(t, e), this.editor.getHTML(t, e);
  }
  getText() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 ? arguments[1] : void 0;
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = Vt(t, e), this.editor.getText(t, e);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(t, e, s) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : At.sources.API;
    return St.call(this, () => this.editor.insertEmbed(t, e, s), n, t);
  }
  insertText(t, e, s, n, i) {
    let a;
    return [t, , a, i] = Vt(t, 0, s, n, i), St.call(this, () => this.editor.insertText(t, e, a), i, t, e.length);
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
  removeFormat(t, e, s) {
    return [t, e, , s] = Vt(t, e, s), St.call(this, () => this.editor.removeFormat(t, e), s, t);
  }
  scrollRectIntoView(t) {
    Of(this.root, t);
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
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : I.sources.API;
    return St.call(this, () => {
      t = new k(t);
      const s = this.getLength(), n = this.editor.deleteText(0, s), i = this.editor.insertContents(0, t), a = this.editor.deleteText(this.getLength() - 1, 1);
      return n.compose(i).compose(a);
    }, e);
  }
  setSelection(t, e, s) {
    t == null ? this.selection.setRange(null, e || At.sources.API) : ([t, e, , s] = Vt(t, e, s), this.selection.setRange(new ve(Math.max(0, t), e), s), s !== I.sources.SILENT && this.scrollSelectionIntoView());
  }
  setText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : I.sources.API;
    const s = new k().insert(t);
    return this.setContents(s, e);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : I.sources.USER;
    const e = this.scroll.update(t);
    return this.selection.update(t), e;
  }
  updateContents(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : I.sources.API;
    return St.call(this, () => (t = new k(t), this.editor.applyDelta(t)), e, !0);
  }
};
C(At, "DEFAULTS", {
  bounds: null,
  modules: {
    clipboard: !0,
    keyboard: !0,
    history: !0,
    uploader: !0
  },
  placeholder: "",
  readOnly: !1,
  registry: xn,
  theme: "default"
}), C(At, "events", I.events), C(At, "sources", I.sources), C(At, "version", "2.0.3"), C(At, "imports", {
  delta: k,
  parchment: of,
  "core/module": It,
  "core/theme": ns
});
let x = At;
function Ga(r) {
  return typeof r == "string" ? document.querySelector(r) : r;
}
function Ji(r) {
  return Object.entries(r ?? {}).reduce((t, e) => {
    let [s, n] = e;
    return {
      ...t,
      [s]: n === !0 ? {} : n
    };
  }, {});
}
function Ka(r) {
  return Object.fromEntries(Object.entries(r).filter((t) => t[1] !== void 0));
}
function $f(r, t) {
  const e = Ga(r);
  if (!e)
    throw new Error("Invalid Quill container");
  const n = !t.theme || t.theme === x.DEFAULTS.theme ? ns : x.import(`themes/${t.theme}`);
  if (!n)
    throw new Error(`Invalid theme ${t.theme}. Did you register it?`);
  const {
    modules: i,
    ...a
  } = x.DEFAULTS, {
    modules: o,
    ...l
  } = n.DEFAULTS;
  let u = Ji(t.modules);
  u != null && u.toolbar && u.toolbar.constructor !== Object && (u = {
    ...u,
    toolbar: {
      container: u.toolbar
    }
  });
  const h = ie({}, Ji(i), Ji(o), u), g = {
    ...a,
    ...Ka(l),
    ...Ka(t)
  };
  let p = t.registry;
  return p ? t.formats && Ge.warn('Ignoring "formats" option because "registry" is specified') : p = t.formats ? _f(t.formats, g.registry, Ge) : g.registry, {
    ...g,
    registry: p,
    container: e,
    theme: n,
    modules: Object.entries(h).reduce((m, y) => {
      let [v, S] = y;
      if (!S) return m;
      const E = x.import(`modules/${v}`);
      return E == null ? (Ge.error(`Cannot load ${v} module. Are you sure you registered it?`), m) : {
        ...m,
        // @ts-expect-error
        [v]: ie({}, E.DEFAULTS || {}, S)
      };
    }, {}),
    bounds: Ga(g.bounds)
  };
}
function St(r, t, e, s) {
  if (!this.isEnabled() && t === I.sources.USER && !this.allowReadOnlyEdits)
    return new k();
  let n = e == null ? null : this.getSelection();
  const i = this.editor.delta, a = r();
  if (n != null && (e === !0 && (e = n.index), s == null ? n = Ya(n, a, t) : s !== 0 && (n = Ya(n, e, s, t)), this.setSelection(n, I.sources.SILENT)), a.length() > 0) {
    const o = [I.events.TEXT_CHANGE, a, i, t];
    this.emitter.emit(I.events.EDITOR_CHANGE, ...o), t !== I.sources.SILENT && this.emitter.emit(...o);
  }
  return a;
}
function Vt(r, t, e, s, n) {
  let i = {};
  return typeof r.index == "number" && typeof r.length == "number" ? typeof t != "number" ? (n = s, s = e, e = t, t = r.length, r = r.index) : (t = r.length, r = r.index) : typeof t != "number" && (n = s, s = e, e = t, t = 0), typeof e == "object" ? (i = e, n = s) : typeof e == "string" && (s != null ? i[e] = s : n = e), n = n || I.sources.API, [r, t, i, n];
}
function Ya(r, t, e, s) {
  const n = typeof e == "number" ? e : 0;
  if (r == null) return null;
  let i, a;
  return t && typeof t.transformPosition == "function" ? [i, a] = [r.index, r.index + r.length].map((o) => (
    // @ts-expect-error -- TODO: add a better type guard around `index`
    t.transformPosition(o, s !== I.sources.USER)
  )) : [i, a] = [r.index, r.index + r.length].map((o) => o < t || o === t && s === I.sources.USER ? o : n >= 0 ? o + n : Math.max(t, o + n)), new ve(i, a - i);
}
class Ee extends Un {
}
function Wa(r) {
  return r instanceof X || r instanceof gt;
}
function Za(r) {
  return typeof r.updateContent == "function";
}
class je extends zr {
  constructor(t, e, s) {
    let {
      emitter: n
    } = s;
    super(t, e), this.emitter = n, this.batch = !1, this.optimize(), this.enable(), this.domNode.addEventListener("dragstart", (i) => this.handleDragStart(i));
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
    this.emitter.emit(I.events.SCROLL_BLOT_MOUNT, t);
  }
  emitUnmount(t) {
    this.emitter.emit(I.events.SCROLL_BLOT_UNMOUNT, t);
  }
  emitEmbedUpdate(t, e) {
    this.emitter.emit(I.events.SCROLL_EMBED_UPDATE, t, e);
  }
  deleteAt(t, e) {
    const [s, n] = this.line(t), [i] = this.line(t + e);
    if (super.deleteAt(t, e), i != null && s !== i && n > 0) {
      if (s instanceof gt || i instanceof gt) {
        this.optimize();
        return;
      }
      const a = i.children.head instanceof Lt ? null : i.children.head;
      s.moveChildren(i, a), s.remove();
    }
    this.optimize();
  }
  enable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    this.domNode.setAttribute("contenteditable", t ? "true" : "false");
  }
  formatAt(t, e, s, n) {
    super.formatAt(t, e, s, n), this.optimize();
  }
  insertAt(t, e, s) {
    if (t >= this.length())
      if (s == null || this.scroll.query(e, q.BLOCK) == null) {
        const n = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(n), s == null && e.endsWith(`
`) ? n.insertAt(0, e.slice(0, -1), s) : n.insertAt(0, e, s);
      } else {
        const n = this.scroll.create(e, s);
        this.appendChild(n);
      }
    else
      super.insertAt(t, e, s);
    this.optimize();
  }
  insertBefore(t, e) {
    if (t.statics.scope === q.INLINE_BLOT) {
      const s = this.scroll.create(this.statics.defaultChild.blotName);
      s.appendChild(t), super.insertBefore(s, e);
    } else
      super.insertBefore(t, e);
  }
  insertContents(t, e) {
    const s = this.deltaToRenderBlocks(e.concat(new k().insert(`
`))), n = s.pop();
    if (n == null) return;
    this.batchStart();
    const i = s.shift();
    if (i) {
      const l = i.type === "block" && (i.delta.length() === 0 || !this.descendant(gt, t)[0] && t < this.length()), u = i.type === "block" ? i.delta : new k().insert({
        [i.key]: i.value
      });
      tr(this, t, u);
      const h = i.type === "block" ? 1 : 0, g = t + u.length() + h;
      l && this.insertAt(g - 1, `
`);
      const p = ft(this.line(t)[0]), m = mt.AttributeMap.diff(p, i.attributes) || {};
      Object.keys(m).forEach((y) => {
        this.formatAt(g - 1, 1, y, m[y]);
      }), t = g;
    }
    let [a, o] = this.children.find(t);
    if (s.length && (a && (a = a.split(o), o = 0), s.forEach((l) => {
      if (l.type === "block") {
        const u = this.createBlock(l.attributes, a || void 0);
        tr(u, 0, l.delta);
      } else {
        const u = this.create(l.key, l.value);
        this.insertBefore(u, a || void 0), Object.keys(l.attributes).forEach((h) => {
          u.format(h, l.attributes[h]);
        });
      }
    })), n.type === "block" && n.delta.length()) {
      const l = a ? a.offset(a.scroll) + o : this.length();
      tr(this, l, n.delta);
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
    const [s, n] = e;
    return s instanceof st ? [s, n] : [null, -1];
  }
  line(t) {
    return t === this.length() ? this.line(t - 1) : this.descendant(Wa, t);
  }
  lines() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const s = (n, i, a) => {
      let o = [], l = a;
      return n.children.forEachAt(i, a, (u, h, g) => {
        Wa(u) ? o.push(u) : u instanceof Un && (o = o.concat(s(u, h, l))), l -= g;
      }), o;
    };
    return s(this, t, e);
  }
  optimize() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.batch || (super.optimize(t, e), t.length > 0 && this.emitter.emit(I.events.SCROLL_OPTIMIZE, t, e));
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
    let e = I.sources.USER;
    typeof t == "string" && (e = t), Array.isArray(t) || (t = this.observer.takeRecords()), t = t.filter((s) => {
      let {
        target: n
      } = s;
      const i = this.find(n, !0);
      return i && !Za(i);
    }), t.length > 0 && this.emitter.emit(I.events.SCROLL_BEFORE_UPDATE, e, t), super.update(t.concat([])), t.length > 0 && this.emitter.emit(I.events.SCROLL_UPDATE, e, t);
  }
  updateEmbedAt(t, e, s) {
    const [n] = this.descendant((i) => i instanceof gt, t);
    n && n.statics.blotName === e && Za(n) && n.updateContent(s);
  }
  handleDragStart(t) {
    t.preventDefault();
  }
  deltaToRenderBlocks(t) {
    const e = [];
    let s = new k();
    return t.forEach((n) => {
      const i = n == null ? void 0 : n.insert;
      if (i)
        if (typeof i == "string") {
          const a = i.split(`
`);
          a.slice(0, -1).forEach((l) => {
            s.insert(l, n.attributes), e.push({
              type: "block",
              delta: s,
              attributes: n.attributes ?? {}
            }), s = new k();
          });
          const o = a[a.length - 1];
          o && s.insert(o, n.attributes);
        } else {
          const a = Object.keys(i)[0];
          if (!a) return;
          this.query(a, q.INLINE) ? s.push(n) : (s.length() && e.push({
            type: "block",
            delta: s,
            attributes: {}
          }), s = new k(), e.push({
            type: "blockEmbed",
            key: a,
            value: i[a],
            attributes: n.attributes ?? {}
          }));
        }
    }), s.length() && e.push({
      type: "block",
      delta: s,
      attributes: {}
    }), e;
  }
  createBlock(t, e) {
    let s;
    const n = {};
    Object.entries(t).forEach((o) => {
      let [l, u] = o;
      this.query(l, q.BLOCK & q.BLOT) != null ? s = l : n[l] = u;
    });
    const i = this.create(s || this.statics.defaultChild.blotName, s ? t[s] : void 0);
    this.insertBefore(i, e || void 0);
    const a = i.length();
    return Object.entries(n).forEach((o) => {
      let [l, u] = o;
      i.formatAt(0, a, l, u);
    }), i;
  }
}
C(je, "blotName", "scroll"), C(je, "className", "ql-editor"), C(je, "tagName", "DIV"), C(je, "defaultChild", X), C(je, "allowedChildren", [X, gt, Ee]);
function tr(r, t, e) {
  e.reduce((s, n) => {
    const i = mt.Op.length(n);
    let a = n.attributes || {};
    if (n.insert != null) {
      if (typeof n.insert == "string") {
        const o = n.insert;
        r.insertAt(s, o);
        const [l] = r.descendant(st, s), u = ft(l);
        a = mt.AttributeMap.diff(u, a) || {};
      } else if (typeof n.insert == "object") {
        const o = Object.keys(n.insert)[0];
        if (o == null) return s;
        if (r.insertAt(s, o, n.insert[o]), r.scroll.query(o, q.INLINE) != null) {
          const [u] = r.descendant(st, s), h = ft(u);
          a = mt.AttributeMap.diff(h, a) || {};
        }
      }
    }
    return Object.keys(a).forEach((o) => {
      r.formatAt(s, i, o, a[o]);
    }), s + i;
  }, t);
}
const Zr = {
  scope: q.BLOCK,
  whitelist: ["right", "center", "justify"]
}, Bf = new $t("align", "align", Zr), Qo = new Ct("align", "ql-align", Zr), Xo = new oe("align", "text-align", Zr);
class Jo extends oe {
  value(t) {
    let e = super.value(t);
    return e.startsWith("rgb(") ? (e = e.replace(/^[^\d]+/, "").replace(/[^\d]+$/, ""), `#${e.split(",").map((n) => `00${parseInt(n, 10).toString(16)}`.slice(-2)).join("")}`) : e;
  }
}
const Ff = new Ct("color", "ql-color", {
  scope: q.INLINE
}), Qr = new Jo("color", "color", {
  scope: q.INLINE
}), Pf = new Ct("background", "ql-bg", {
  scope: q.INLINE
}), Xr = new Jo("background", "background-color", {
  scope: q.INLINE
});
class xe extends Ee {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("spellcheck", "false"), e;
  }
  code(t, e) {
    return this.children.map((s) => s.length() <= 1 ? "" : s.domNode.innerText).join(`
`).slice(t, t + e);
  }
  html(t, e) {
    return `<pre>
${Kn(this.code(t, e))}
</pre>`;
  }
}
class nt extends X {
  static register() {
    x.register(xe);
  }
}
C(nt, "TAB", "  ");
class Jr extends Bt {
}
Jr.blotName = "code";
Jr.tagName = "CODE";
nt.blotName = "code-block";
nt.className = "ql-code-block";
nt.tagName = "DIV";
xe.blotName = "code-block-container";
xe.className = "ql-code-block-container";
xe.tagName = "DIV";
xe.allowedChildren = [nt];
nt.allowedChildren = [Dt, Lt, ss];
nt.requiredContainer = xe;
const ta = {
  scope: q.BLOCK,
  whitelist: ["rtl"]
}, tl = new $t("direction", "dir", ta), el = new Ct("direction", "ql-direction", ta), sl = new oe("direction", "direction", ta), nl = {
  scope: q.INLINE,
  whitelist: ["serif", "monospace"]
}, il = new Ct("font", "ql-font", nl);
class Hf extends oe {
  value(t) {
    return super.value(t).replace(/["']/g, "");
  }
}
const rl = new Hf("font", "font-family", nl), al = new Ct("size", "ql-size", {
  scope: q.INLINE,
  whitelist: ["small", "large", "huge"]
}), ol = new oe("size", "font-size", {
  scope: q.INLINE,
  whitelist: ["10px", "18px", "32px"]
}), jf = Zt("quill:keyboard"), Uf = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
class Yn extends It {
  static match(t, e) {
    return ["altKey", "ctrlKey", "metaKey", "shiftKey"].some((s) => !!e[s] !== t[s] && e[s] !== null) ? !1 : e.key === t.key || e.key === t.which;
  }
  constructor(t, e) {
    super(t, e), this.bindings = {}, Object.keys(this.options.bindings).forEach((s) => {
      this.options.bindings[s] && this.addBinding(this.options.bindings[s]);
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
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const n = Vf(t);
    if (n == null) {
      jf.warn("Attempted to add invalid keyboard binding", n);
      return;
    }
    typeof e == "function" && (e = {
      handler: e
    }), typeof s == "function" && (s = {
      handler: s
    }), (Array.isArray(n.key) ? n.key : [n.key]).forEach((a) => {
      const o = {
        ...n,
        key: a,
        ...e,
        ...s
      };
      this.bindings[o.key] = this.bindings[o.key] || [], this.bindings[o.key].push(o);
    });
  }
  listen() {
    this.quill.root.addEventListener("keydown", (t) => {
      if (t.defaultPrevented || t.isComposing || t.keyCode === 229 && (t.key === "Enter" || t.key === "Backspace")) return;
      const n = (this.bindings[t.key] || []).concat(this.bindings[t.which] || []).filter((E) => Yn.match(t, E));
      if (n.length === 0) return;
      const i = x.find(t.target, !0);
      if (i && i.scroll !== this.quill.scroll) return;
      const a = this.quill.getSelection();
      if (a == null || !this.quill.hasFocus()) return;
      const [o, l] = this.quill.getLine(a.index), [u, h] = this.quill.getLeaf(a.index), [g, p] = a.length === 0 ? [u, h] : this.quill.getLeaf(a.index + a.length), m = u instanceof Mn ? u.value().slice(0, h) : "", y = g instanceof Mn ? g.value().slice(p) : "", v = {
        collapsed: a.length === 0,
        // @ts-expect-error Fix me later
        empty: a.length === 0 && o.length() <= 1,
        format: this.quill.getFormat(a),
        line: o,
        offset: l,
        prefix: m,
        suffix: y,
        event: t
      };
      n.some((E) => {
        if (E.collapsed != null && E.collapsed !== v.collapsed || E.empty != null && E.empty !== v.empty || E.offset != null && E.offset !== v.offset)
          return !1;
        if (Array.isArray(E.format)) {
          if (E.format.every((T) => v.format[T] == null))
            return !1;
        } else if (typeof E.format == "object" && !Object.keys(E.format).every((T) => E.format[T] === !0 ? v.format[T] != null : E.format[T] === !1 ? v.format[T] == null : jr(E.format[T], v.format[T])))
          return !1;
        return E.prefix != null && !E.prefix.test(v.prefix) || E.suffix != null && !E.suffix.test(v.suffix) ? !1 : E.handler.call(this, a, v, E) !== !0;
      }) && t.preventDefault();
    });
  }
  handleBackspace(t, e) {
    const s = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(e.prefix) ? 2 : 1;
    if (t.index === 0 || this.quill.getLength() <= 1) return;
    let n = {};
    const [i] = this.quill.getLine(t.index);
    let a = new k().retain(t.index - s).delete(s);
    if (e.offset === 0) {
      const [o] = this.quill.getLine(t.index - 1);
      if (o && !(o.statics.blotName === "block" && o.length() <= 1)) {
        const u = i.formats(), h = this.quill.getFormat(t.index - 1, 1);
        if (n = mt.AttributeMap.diff(u, h) || {}, Object.keys(n).length > 0) {
          const g = new k().retain(t.index + i.length() - 2).retain(1, n);
          a = a.compose(g);
        }
      }
    }
    this.quill.updateContents(a, x.sources.USER), this.quill.focus();
  }
  handleDelete(t, e) {
    const s = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(e.suffix) ? 2 : 1;
    if (t.index >= this.quill.getLength() - s) return;
    let n = {};
    const [i] = this.quill.getLine(t.index);
    let a = new k().retain(t.index).delete(s);
    if (e.offset >= i.length() - 1) {
      const [o] = this.quill.getLine(t.index + 1);
      if (o) {
        const l = i.formats(), u = this.quill.getFormat(t.index, 1);
        n = mt.AttributeMap.diff(l, u) || {}, Object.keys(n).length > 0 && (a = a.retain(o.length() - 1).retain(1, n));
      }
    }
    this.quill.updateContents(a, x.sources.USER), this.quill.focus();
  }
  handleDeleteRange(t) {
    ea({
      range: t,
      quill: this.quill
    }), this.quill.focus();
  }
  handleEnter(t, e) {
    const s = Object.keys(e.format).reduce((i, a) => (this.quill.scroll.query(a, q.BLOCK) && !Array.isArray(e.format[a]) && (i[a] = e.format[a]), i), {}), n = new k().retain(t.index).delete(t.length).insert(`
`, s);
    this.quill.updateContents(n, x.sources.USER), this.quill.setSelection(t.index + 1, x.sources.SILENT), this.quill.focus();
  }
}
const zf = {
  bindings: {
    bold: er("bold"),
    italic: er("italic"),
    underline: er("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "+1", x.sources.USER), !1);
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: !0,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "-1", x.sources.USER), !1);
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
        t.format.indent != null ? this.quill.format("indent", "-1", x.sources.USER) : t.format.list != null && this.quill.format("list", !1, x.sources.USER);
      }
    },
    "indent code-block": Qa(!0),
    "outdent code-block": Qa(!1),
    "remove tab": {
      key: "Tab",
      shiftKey: !0,
      collapsed: !0,
      prefix: /\t$/,
      handler(r) {
        this.quill.deleteText(r.index - 1, 1, x.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(r, t) {
        if (t.format.table) return !0;
        this.quill.history.cutoff();
        const e = new k().retain(r.index).delete(r.length).insert("	");
        return this.quill.updateContents(e, x.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index + 1, x.sources.SILENT), !1;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: !0,
      format: ["blockquote"],
      empty: !0,
      handler() {
        this.quill.format("blockquote", !1, x.sources.USER);
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
        t.format.indent && (e.indent = !1), this.quill.formatLine(r.index, r.length, e, x.sources.USER);
      }
    },
    "checklist enter": {
      key: "Enter",
      collapsed: !0,
      format: {
        list: "checked"
      },
      handler(r) {
        const [t, e] = this.quill.getLine(r.index), s = {
          // @ts-expect-error Fix me later
          ...t.formats(),
          list: "checked"
        }, n = new k().retain(r.index).insert(`
`, s).retain(t.length() - e - 1).retain(1, {
          list: "unchecked"
        });
        this.quill.updateContents(n, x.sources.USER), this.quill.setSelection(r.index + 1, x.sources.SILENT), this.quill.scrollSelectionIntoView();
      }
    },
    "header enter": {
      key: "Enter",
      collapsed: !0,
      format: ["header"],
      suffix: /^$/,
      handler(r, t) {
        const [e, s] = this.quill.getLine(r.index), n = new k().retain(r.index).insert(`
`, t.format).retain(e.length() - s - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(n, x.sources.USER), this.quill.setSelection(r.index + 1, x.sources.SILENT), this.quill.scrollSelectionIntoView();
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
          const [e, s, n, i] = t.getTable(r), a = Gf(e, s, n, i);
          if (a == null) return;
          let o = e.offset();
          if (a < 0) {
            const l = new k().retain(o).insert(`
`);
            this.quill.updateContents(l, x.sources.USER), this.quill.setSelection(r.index + 1, r.length, x.sources.SILENT);
          } else if (a > 0) {
            o += e.length();
            const l = new k().retain(o).insert(`
`);
            this.quill.updateContents(l, x.sources.USER), this.quill.setSelection(o, x.sources.USER);
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
          line: s
        } = t, n = s.offset(this.quill.scroll);
        e.shiftKey ? this.quill.setSelection(n - 1, x.sources.USER) : this.quill.setSelection(n + s.length(), x.sources.USER);
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
        } = t.prefix, [s, n] = this.quill.getLine(r.index);
        if (n > e) return !0;
        let i;
        switch (t.prefix.trim()) {
          case "[]":
          case "[ ]":
            i = "unchecked";
            break;
          case "[x]":
            i = "checked";
            break;
          case "-":
          case "*":
            i = "bullet";
            break;
          default:
            i = "ordered";
        }
        this.quill.insertText(r.index, " ", x.sources.USER), this.quill.history.cutoff();
        const a = new k().retain(r.index - n).delete(e + 1).retain(s.length() - 2 - n).retain(1, {
          list: i
        });
        return this.quill.updateContents(a, x.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index - e, x.sources.SILENT), !1;
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
        let s = 2, n = t;
        for (; n != null && n.length() <= 1 && n.formats()["code-block"]; )
          if (n = n.prev, s -= 1, s <= 0) {
            const i = new k().retain(r.index + t.length() - e - 2).retain(1, {
              "code-block": null
            }).delete(1);
            return this.quill.updateContents(i, x.sources.USER), this.quill.setSelection(r.index - 1, x.sources.SILENT), !1;
          }
        return !0;
      }
    },
    "embed left": Tn("ArrowLeft", !1),
    "embed left shift": Tn("ArrowLeft", !0),
    "embed right": Tn("ArrowRight", !1),
    "embed right shift": Tn("ArrowRight", !0),
    "table down": Xa(!1),
    "table up": Xa(!0)
  }
};
Yn.DEFAULTS = zf;
function Qa(r) {
  return {
    key: "Tab",
    shiftKey: !r,
    format: {
      "code-block": !0
    },
    handler(t, e) {
      let {
        event: s
      } = e;
      const n = this.quill.scroll.query("code-block"), {
        TAB: i
      } = n;
      if (t.length === 0 && !s.shiftKey) {
        this.quill.insertText(t.index, i, x.sources.USER), this.quill.setSelection(t.index + i.length, x.sources.SILENT);
        return;
      }
      const a = t.length === 0 ? this.quill.getLines(t.index, 1) : this.quill.getLines(t);
      let {
        index: o,
        length: l
      } = t;
      a.forEach((u, h) => {
        r ? (u.insertAt(0, i), h === 0 ? o += i.length : l += i.length) : u.domNode.textContent.startsWith(i) && (u.deleteAt(0, i.length), h === 0 ? o -= i.length : l -= i.length);
      }), this.quill.update(x.sources.USER), this.quill.setSelection(o, l, x.sources.SILENT);
    }
  };
}
function Tn(r, t) {
  return {
    key: r,
    shiftKey: t,
    altKey: null,
    [r === "ArrowLeft" ? "prefix" : "suffix"]: /^$/,
    handler(s) {
      let {
        index: n
      } = s;
      r === "ArrowRight" && (n += s.length + 1);
      const [i] = this.quill.getLeaf(n);
      return i instanceof ut ? (r === "ArrowLeft" ? t ? this.quill.setSelection(s.index - 1, s.length + 1, x.sources.USER) : this.quill.setSelection(s.index - 1, x.sources.USER) : t ? this.quill.setSelection(s.index, s.length + 1, x.sources.USER) : this.quill.setSelection(s.index + s.length + 1, x.sources.USER), !1) : !0;
    }
  };
}
function er(r) {
  return {
    key: r[0],
    shortKey: !0,
    handler(t, e) {
      this.quill.format(r, !e.format[r], x.sources.USER);
    }
  };
}
function Xa(r) {
  return {
    key: r ? "ArrowUp" : "ArrowDown",
    collapsed: !0,
    format: ["table"],
    handler(t, e) {
      const s = r ? "prev" : "next", n = e.line, i = n.parent[s];
      if (i != null) {
        if (i.statics.blotName === "table-row") {
          let a = i.children.head, o = n;
          for (; o.prev != null; )
            o = o.prev, a = a.next;
          const l = a.offset(this.quill.scroll) + Math.min(e.offset, a.length() - 1);
          this.quill.setSelection(l, 0, x.sources.USER);
        }
      } else {
        const a = n.table()[s];
        a != null && (r ? this.quill.setSelection(a.offset(this.quill.scroll) + a.length() - 1, 0, x.sources.USER) : this.quill.setSelection(a.offset(this.quill.scroll), 0, x.sources.USER));
      }
      return !1;
    }
  };
}
function Vf(r) {
  if (typeof r == "string" || typeof r == "number")
    r = {
      key: r
    };
  else if (typeof r == "object")
    r = ze(r);
  else
    return null;
  return r.shortKey && (r[Uf] = r.shortKey, delete r.shortKey), r;
}
function ea(r) {
  let {
    quill: t,
    range: e
  } = r;
  const s = t.getLines(e);
  let n = {};
  if (s.length > 1) {
    const i = s[0].formats(), a = s[s.length - 1].formats();
    n = mt.AttributeMap.diff(a, i) || {};
  }
  t.deleteText(e, x.sources.USER), Object.keys(n).length > 0 && t.formatLine(e.index, 1, n, x.sources.USER), t.setSelection(e.index, x.sources.SILENT);
}
function Gf(r, t, e, s) {
  return t.prev == null && t.next == null ? e.prev == null && e.next == null ? s === 0 ? -1 : 1 : e.prev == null ? -1 : 1 : t.prev == null ? -1 : t.next == null ? 1 : null;
}
const Kf = /font-weight:\s*normal/, Yf = ["P", "OL", "UL"], Ja = (r) => r && Yf.includes(r.tagName), Wf = (r) => {
  Array.from(r.querySelectorAll("br")).filter((t) => Ja(t.previousElementSibling) && Ja(t.nextElementSibling)).forEach((t) => {
    var e;
    (e = t.parentNode) == null || e.removeChild(t);
  });
}, Zf = (r) => {
  Array.from(r.querySelectorAll('b[style*="font-weight"]')).filter((t) => {
    var e;
    return (e = t.getAttribute("style")) == null ? void 0 : e.match(Kf);
  }).forEach((t) => {
    var s;
    const e = r.createDocumentFragment();
    e.append(...t.childNodes), (s = t.parentNode) == null || s.replaceChild(e, t);
  });
};
function Qf(r) {
  r.querySelector('[id^="docs-internal-guid-"]') && (Zf(r), Wf(r));
}
const Xf = /\bmso-list:[^;]*ignore/i, Jf = /\bmso-list:[^;]*\bl(\d+)/i, tp = /\bmso-list:[^;]*\blevel(\d+)/i, ep = (r, t) => {
  const e = r.getAttribute("style"), s = e == null ? void 0 : e.match(Jf);
  if (!s)
    return null;
  const n = Number(s[1]), i = e == null ? void 0 : e.match(tp), a = i ? Number(i[1]) : 1, o = new RegExp(`@list l${n}:level${a}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i"), l = t.match(o), u = l && l[1] === "bullet" ? "bullet" : "ordered";
  return {
    id: n,
    indent: a,
    type: u,
    element: r
  };
}, sp = (r) => {
  var a, o;
  const t = Array.from(r.querySelectorAll("[style*=mso-list]")), e = [], s = [];
  t.forEach((l) => {
    (l.getAttribute("style") || "").match(Xf) ? e.push(l) : s.push(l);
  }), e.forEach((l) => {
    var u;
    return (u = l.parentNode) == null ? void 0 : u.removeChild(l);
  });
  const n = r.documentElement.innerHTML, i = s.map((l) => ep(l, n)).filter((l) => l);
  for (; i.length; ) {
    const l = [];
    let u = i.shift();
    for (; u; )
      l.push(u), u = i.length && ((a = i[0]) == null ? void 0 : a.element) === u.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
      i[0].id === u.id ? i.shift() : null;
    const h = document.createElement("ul");
    l.forEach((m) => {
      const y = document.createElement("li");
      y.setAttribute("data-list", m.type), m.indent > 1 && y.setAttribute("class", `ql-indent-${m.indent - 1}`), y.innerHTML = m.element.innerHTML, h.appendChild(y);
    });
    const g = (o = l[0]) == null ? void 0 : o.element, {
      parentNode: p
    } = g ?? {};
    g && (p == null || p.replaceChild(h, g)), l.slice(1).forEach((m) => {
      let {
        element: y
      } = m;
      p == null || p.removeChild(y);
    });
  }
};
function np(r) {
  r.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word" && sp(r);
}
const ip = [np, Qf], rp = (r) => {
  r.documentElement && ip.forEach((t) => {
    t(r);
  });
}, ap = Zt("quill:clipboard"), op = [[Node.TEXT_NODE, vp], [Node.TEXT_NODE, eo], ["br", hp], [Node.ELEMENT_NODE, eo], [Node.ELEMENT_NODE, dp], [Node.ELEMENT_NODE, up], [Node.ELEMENT_NODE, bp], ["li", gp], ["ol, ul", mp], ["pre", fp], ["tr", yp], ["b", sr("bold")], ["i", sr("italic")], ["strike", sr("strike")], ["style", pp]], lp = [Bf, tl].reduce((r, t) => (r[t.keyName] = t, r), {}), to = [Xo, Xr, Qr, sl, rl, ol].reduce((r, t) => (r[t.keyName] = t, r), {});
class ll extends It {
  constructor(t, e) {
    super(t, e), this.quill.root.addEventListener("copy", (s) => this.onCaptureCopy(s, !1)), this.quill.root.addEventListener("cut", (s) => this.onCaptureCopy(s, !0)), this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this)), this.matchers = [], op.concat(this.options.matchers ?? []).forEach((s) => {
      let [n, i] = s;
      this.addMatcher(n, i);
    });
  }
  addMatcher(t, e) {
    this.matchers.push([t, e]);
  }
  convert(t) {
    let {
      html: e,
      text: s
    } = t, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (n[nt.blotName])
      return new k().insert(s || "", {
        [nt.blotName]: n[nt.blotName]
      });
    if (!e)
      return new k().insert(s || "", n);
    const i = this.convertHTML(e);
    return js(i, `
`) && (i.ops[i.ops.length - 1].attributes == null || n.table) ? i.compose(new k().retain(i.length() - 1).delete(1)) : i;
  }
  normalizeHTML(t) {
    rp(t);
  }
  convertHTML(t) {
    const e = new DOMParser().parseFromString(t, "text/html");
    this.normalizeHTML(e);
    const s = e.body, n = /* @__PURE__ */ new WeakMap(), [i, a] = this.prepareMatching(s, n);
    return sa(this.quill.scroll, s, i, a, n);
  }
  dangerouslyPasteHTML(t, e) {
    let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : x.sources.API;
    if (typeof t == "string") {
      const n = this.convert({
        html: t,
        text: ""
      });
      this.quill.setContents(n, e), this.quill.setSelection(0, x.sources.SILENT);
    } else {
      const n = this.convert({
        html: e,
        text: ""
      });
      this.quill.updateContents(new k().retain(t).concat(n), s), this.quill.setSelection(t + n.length(), x.sources.SILENT);
    }
  }
  onCaptureCopy(t) {
    var a, o;
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (t.defaultPrevented) return;
    t.preventDefault();
    const [s] = this.quill.selection.getRange();
    if (s == null) return;
    const {
      html: n,
      text: i
    } = this.onCopy(s, e);
    (a = t.clipboardData) == null || a.setData("text/plain", i), (o = t.clipboardData) == null || o.setData("text/html", n), e && ea({
      range: s,
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
    var a, o, l, u, h;
    if (t.defaultPrevented || !this.quill.isEnabled()) return;
    t.preventDefault();
    const e = this.quill.getSelection(!0);
    if (e == null) return;
    const s = (a = t.clipboardData) == null ? void 0 : a.getData("text/html");
    let n = (o = t.clipboardData) == null ? void 0 : o.getData("text/plain");
    if (!s && !n) {
      const g = (l = t.clipboardData) == null ? void 0 : l.getData("text/uri-list");
      g && (n = this.normalizeURIList(g));
    }
    const i = Array.from(((u = t.clipboardData) == null ? void 0 : u.files) || []);
    if (!s && i.length > 0) {
      this.quill.uploader.upload(e, i);
      return;
    }
    if (s && i.length > 0) {
      const g = new DOMParser().parseFromString(s, "text/html");
      if (g.body.childElementCount === 1 && ((h = g.body.firstElementChild) == null ? void 0 : h.tagName) === "IMG") {
        this.quill.uploader.upload(e, i);
        return;
      }
    }
    this.onPaste(e, {
      html: s,
      text: n
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
      text: s,
      html: n
    } = e;
    const i = this.quill.getFormat(t.index), a = this.convert({
      text: s,
      html: n
    }, i);
    ap.log("onPaste", a, {
      text: s,
      html: n
    });
    const o = new k().retain(t.index).delete(t.length).concat(a);
    this.quill.updateContents(o, x.sources.USER), this.quill.setSelection(o.length() - t.length, x.sources.SILENT), this.quill.scrollSelectionIntoView();
  }
  prepareMatching(t, e) {
    const s = [], n = [];
    return this.matchers.forEach((i) => {
      const [a, o] = i;
      switch (a) {
        case Node.TEXT_NODE:
          n.push(o);
          break;
        case Node.ELEMENT_NODE:
          s.push(o);
          break;
        default:
          Array.from(t.querySelectorAll(a)).forEach((l) => {
            if (e.has(l)) {
              const u = e.get(l);
              u == null || u.push(o);
            } else
              e.set(l, [o]);
          });
          break;
      }
    }), [s, n];
  }
}
C(ll, "DEFAULTS", {
  matchers: []
});
function Te(r, t, e, s) {
  return s.query(t) ? r.reduce((n, i) => {
    if (!i.insert) return n;
    if (i.attributes && i.attributes[t])
      return n.push(i);
    const a = e ? {
      [t]: e
    } : {};
    return n.insert(i.insert, {
      ...a,
      ...i.attributes
    });
  }, new k()) : r;
}
function js(r, t) {
  let e = "";
  for (let s = r.ops.length - 1; s >= 0 && e.length < t.length; --s) {
    const n = r.ops[s];
    if (typeof n.insert != "string") break;
    e = n.insert + e;
  }
  return e.slice(-1 * t.length) === t;
}
function se(r, t) {
  if (!(r instanceof Element)) return !1;
  const e = t.query(r);
  return e && e.prototype instanceof ut ? !1 : ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(r.tagName.toLowerCase());
}
function cp(r, t) {
  return r.previousElementSibling && r.nextElementSibling && !se(r.previousElementSibling, t) && !se(r.nextElementSibling, t);
}
const Dn = /* @__PURE__ */ new WeakMap();
function cl(r) {
  return r == null ? !1 : (Dn.has(r) || (r.tagName === "PRE" ? Dn.set(r, !0) : Dn.set(r, cl(r.parentNode))), Dn.get(r));
}
function sa(r, t, e, s, n) {
  return t.nodeType === t.TEXT_NODE ? s.reduce((i, a) => a(t, i, r), new k()) : t.nodeType === t.ELEMENT_NODE ? Array.from(t.childNodes || []).reduce((i, a) => {
    let o = sa(r, a, e, s, n);
    return a.nodeType === t.ELEMENT_NODE && (o = e.reduce((l, u) => u(a, l, r), o), o = (n.get(a) || []).reduce((l, u) => u(a, l, r), o)), i.concat(o);
  }, new k()) : new k();
}
function sr(r) {
  return (t, e, s) => Te(e, r, !0, s);
}
function up(r, t, e) {
  const s = $t.keys(r), n = Ct.keys(r), i = oe.keys(r), a = {};
  return s.concat(n).concat(i).forEach((o) => {
    let l = e.query(o, q.ATTRIBUTE);
    l != null && (a[l.attrName] = l.value(r), a[l.attrName]) || (l = lp[o], l != null && (l.attrName === o || l.keyName === o) && (a[l.attrName] = l.value(r) || void 0), l = to[o], l != null && (l.attrName === o || l.keyName === o) && (l = to[o], a[l.attrName] = l.value(r) || void 0));
  }), Object.entries(a).reduce((o, l) => {
    let [u, h] = l;
    return Te(o, u, h, e);
  }, t);
}
function dp(r, t, e) {
  const s = e.query(r);
  if (s == null) return t;
  if (s.prototype instanceof ut) {
    const n = {}, i = s.value(r);
    if (i != null)
      return n[s.blotName] = i, new k().insert(n, s.formats(r, e));
  } else if (s.prototype instanceof _s && !js(t, `
`) && t.insert(`
`), "blotName" in s && "formats" in s && typeof s.formats == "function")
    return Te(t, s.blotName, s.formats(r, e), e);
  return t;
}
function hp(r, t) {
  return js(t, `
`) || t.insert(`
`), t;
}
function fp(r, t, e) {
  const s = e.query("code-block"), n = s && "formats" in s && typeof s.formats == "function" ? s.formats(r, e) : !0;
  return Te(t, "code-block", n, e);
}
function pp() {
  return new k();
}
function gp(r, t, e) {
  const s = e.query(r);
  if (s == null || // @ts-expect-error
  s.blotName !== "list" || !js(t, `
`))
    return t;
  let n = -1, i = r.parentNode;
  for (; i != null; )
    ["OL", "UL"].includes(i.tagName) && (n += 1), i = i.parentNode;
  return n <= 0 ? t : t.reduce((a, o) => o.insert ? o.attributes && typeof o.attributes.indent == "number" ? a.push(o) : a.insert(o.insert, {
    indent: n,
    ...o.attributes || {}
  }) : a, new k());
}
function mp(r, t, e) {
  const s = r;
  let n = s.tagName === "OL" ? "ordered" : "bullet";
  const i = s.getAttribute("data-checked");
  return i && (n = i === "true" ? "checked" : "unchecked"), Te(t, "list", n, e);
}
function eo(r, t, e) {
  if (!js(t, `
`)) {
    if (se(r, e) && (r.childNodes.length > 0 || r instanceof HTMLParagraphElement))
      return t.insert(`
`);
    if (t.length() > 0 && r.nextSibling) {
      let s = r.nextSibling;
      for (; s != null; ) {
        if (se(s, e))
          return t.insert(`
`);
        const n = e.query(s);
        if (n && n.prototype instanceof gt)
          return t.insert(`
`);
        s = s.firstChild;
      }
    }
  }
  return t;
}
function bp(r, t, e) {
  var i;
  const s = {}, n = r.style || {};
  return n.fontStyle === "italic" && (s.italic = !0), n.textDecoration === "underline" && (s.underline = !0), n.textDecoration === "line-through" && (s.strike = !0), ((i = n.fontWeight) != null && i.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(n.fontWeight, 10) >= 700) && (s.bold = !0), t = Object.entries(s).reduce((a, o) => {
    let [l, u] = o;
    return Te(a, l, u, e);
  }, t), parseFloat(n.textIndent || 0) > 0 ? new k().insert("	").concat(t) : t;
}
function yp(r, t, e) {
  var n, i;
  const s = ((n = r.parentElement) == null ? void 0 : n.tagName) === "TABLE" ? r.parentElement : (i = r.parentElement) == null ? void 0 : i.parentElement;
  if (s != null) {
    const o = Array.from(s.querySelectorAll("tr")).indexOf(r) + 1;
    return Te(t, "table", o, e);
  }
  return t;
}
function vp(r, t, e) {
  var n;
  let s = r.data;
  if (((n = r.parentElement) == null ? void 0 : n.tagName) === "O:P")
    return t.insert(s.trim());
  if (!cl(r)) {
    if (s.trim().length === 0 && s.includes(`
`) && !cp(r, e))
      return t;
    s = s.replace(/[^\S\u00a0]/g, " "), s = s.replace(/ {2,}/g, " "), (r.previousSibling == null && r.parentElement != null && se(r.parentElement, e) || r.previousSibling instanceof Element && se(r.previousSibling, e)) && (s = s.replace(/^ /, "")), (r.nextSibling == null && r.parentElement != null && se(r.parentElement, e) || r.nextSibling instanceof Element && se(r.nextSibling, e)) && (s = s.replace(/ $/, "")), s = s.replaceAll(" ", " ");
  }
  return t.insert(s);
}
class ul extends It {
  constructor(e, s) {
    super(e, s);
    C(this, "lastRecorded", 0);
    C(this, "ignoreChange", !1);
    C(this, "stack", {
      undo: [],
      redo: []
    });
    C(this, "currentRange", null);
    this.quill.on(x.events.EDITOR_CHANGE, (n, i, a, o) => {
      n === x.events.SELECTION_CHANGE ? i && o !== x.sources.SILENT && (this.currentRange = i) : n === x.events.TEXT_CHANGE && (this.ignoreChange || (!this.options.userOnly || o === x.sources.USER ? this.record(i, a) : this.transform(i)), this.currentRange = Sr(this.currentRange, i));
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
    }, this.redo.bind(this)), this.quill.root.addEventListener("beforeinput", (n) => {
      n.inputType === "historyUndo" ? (this.undo(), n.preventDefault()) : n.inputType === "historyRedo" && (this.redo(), n.preventDefault());
    });
  }
  change(e, s) {
    if (this.stack[e].length === 0) return;
    const n = this.stack[e].pop();
    if (!n) return;
    const i = this.quill.getContents(), a = n.delta.invert(i);
    this.stack[s].push({
      delta: a,
      range: Sr(n.range, a)
    }), this.lastRecorded = 0, this.ignoreChange = !0, this.quill.updateContents(n.delta, x.sources.USER), this.ignoreChange = !1, this.restoreSelection(n);
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
  record(e, s) {
    if (e.ops.length === 0) return;
    this.stack.redo = [];
    let n = e.invert(s), i = this.currentRange;
    const a = Date.now();
    if (
      // @ts-expect-error Fix me later
      this.lastRecorded + this.options.delay > a && this.stack.undo.length > 0
    ) {
      const o = this.stack.undo.pop();
      o && (n = n.compose(o.delta), i = o.range);
    } else
      this.lastRecorded = a;
    n.length() !== 0 && (this.stack.undo.push({
      delta: n,
      range: i
    }), this.stack.undo.length > this.options.maxStack && this.stack.undo.shift());
  }
  redo() {
    this.change("redo", "undo");
  }
  transform(e) {
    so(this.stack.undo, e), so(this.stack.redo, e);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(e) {
    if (e.range)
      this.quill.setSelection(e.range, x.sources.USER);
    else {
      const s = Sp(this.quill.scroll, e.delta);
      this.quill.setSelection(s, x.sources.USER);
    }
  }
}
C(ul, "DEFAULTS", {
  delay: 1e3,
  maxStack: 100,
  userOnly: !1
});
function so(r, t) {
  let e = t;
  for (let s = r.length - 1; s >= 0; s -= 1) {
    const n = r[s];
    r[s] = {
      delta: e.transform(n.delta, !0),
      range: n.range && Sr(n.range, e)
    }, e = n.delta.transform(e), r[s].delta.length() === 0 && r.splice(s, 1);
  }
}
function wp(r, t) {
  const e = t.ops[t.ops.length - 1];
  return e == null ? !1 : e.insert != null ? typeof e.insert == "string" && e.insert.endsWith(`
`) : e.attributes != null ? Object.keys(e.attributes).some((s) => r.query(s, q.BLOCK) != null) : !1;
}
function Sp(r, t) {
  const e = t.reduce((n, i) => n + (i.delete || 0), 0);
  let s = t.length() - e;
  return wp(r, t) && (s -= 1), s;
}
function Sr(r, t) {
  if (!r) return r;
  const e = t.transformPosition(r.index), s = t.transformPosition(r.index + r.length);
  return {
    index: e,
    length: s - e
  };
}
class dl extends It {
  constructor(t, e) {
    super(t, e), t.root.addEventListener("drop", (s) => {
      var a;
      s.preventDefault();
      let n = null;
      if (document.caretRangeFromPoint)
        n = document.caretRangeFromPoint(s.clientX, s.clientY);
      else if (document.caretPositionFromPoint) {
        const o = document.caretPositionFromPoint(s.clientX, s.clientY);
        n = document.createRange(), n.setStart(o.offsetNode, o.offset), n.setEnd(o.offsetNode, o.offset);
      }
      const i = n && t.selection.normalizeNative(n);
      if (i) {
        const o = t.selection.normalizedToRange(i);
        (a = s.dataTransfer) != null && a.files && this.upload(o, s.dataTransfer.files);
      }
    });
  }
  upload(t, e) {
    const s = [];
    Array.from(e).forEach((n) => {
      var i;
      n && ((i = this.options.mimetypes) != null && i.includes(n.type)) && s.push(n);
    }), s.length > 0 && this.options.handler.call(this, t, s);
  }
}
dl.DEFAULTS = {
  mimetypes: ["image/png", "image/jpeg"],
  handler(r, t) {
    if (!this.quill.scroll.query("image"))
      return;
    const e = t.map((s) => new Promise((n) => {
      const i = new FileReader();
      i.onload = () => {
        n(i.result);
      }, i.readAsDataURL(s);
    }));
    Promise.all(e).then((s) => {
      const n = s.reduce((i, a) => i.insert({
        image: a
      }), new k().retain(r.index).delete(r.length));
      this.quill.updateContents(n, I.sources.USER), this.quill.setSelection(r.index + s.length, I.sources.SILENT);
    });
  }
};
const Ap = ["insertText", "insertReplacementText"];
class Ep extends It {
  constructor(t, e) {
    super(t, e), t.root.addEventListener("beforeinput", (s) => {
      this.handleBeforeInput(s);
    }), /Android/i.test(navigator.userAgent) || t.on(x.events.COMPOSITION_BEFORE_START, () => {
      this.handleCompositionStart();
    });
  }
  deleteRange(t) {
    ea({
      range: t,
      quill: this.quill
    });
  }
  replaceText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (t.length === 0) return !1;
    if (e) {
      const s = this.quill.getFormat(t.index, 1);
      this.deleteRange(t), this.quill.updateContents(new k().retain(t.index).insert(e, s), x.sources.USER);
    } else
      this.deleteRange(t);
    return this.quill.setSelection(t.index + e.length, 0, x.sources.SILENT), !0;
  }
  handleBeforeInput(t) {
    if (this.quill.composition.isComposing || t.defaultPrevented || !Ap.includes(t.inputType))
      return;
    const e = t.getTargetRanges ? t.getTargetRanges()[0] : null;
    if (!e || e.collapsed === !0)
      return;
    const s = xp(t);
    if (s == null)
      return;
    const n = this.quill.selection.normalizeNative(e), i = n ? this.quill.selection.normalizedToRange(n) : null;
    i && this.replaceText(i, s) && t.preventDefault();
  }
  handleCompositionStart() {
    const t = this.quill.getSelection();
    t && this.replaceText(t);
  }
}
function xp(r) {
  var t;
  return typeof r.data == "string" ? r.data : (t = r.dataTransfer) != null && t.types.includes("text/plain") ? r.dataTransfer.getData("text/plain") : null;
}
const Tp = /Mac/i.test(navigator.platform), Dp = 100, Cp = (r) => !!(r.key === "ArrowLeft" || r.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
r.key === "ArrowUp" || r.key === "ArrowDown" || r.key === "Home" || Tp && r.key === "a" && r.ctrlKey === !0);
class Lp extends It {
  constructor(e, s) {
    super(e, s);
    C(this, "isListening", !1);
    C(this, "selectionChangeDeadline", 0);
    this.handleArrowKeys(), this.handleNavigationShortcuts();
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ["ArrowLeft", "ArrowRight"],
      offset: 0,
      shiftKey: null,
      handler(e, s) {
        let {
          line: n,
          event: i
        } = s;
        if (!(n instanceof Tt) || !n.uiNode)
          return !0;
        const a = getComputedStyle(n.domNode).direction === "rtl";
        return a && i.key !== "ArrowRight" || !a && i.key !== "ArrowLeft" ? !0 : (this.quill.setSelection(e.index - 1, e.length + (i.shiftKey ? 1 : 0), x.sources.USER), !1);
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (e) => {
      !e.defaultPrevented && Cp(e) && this.ensureListeningToSelectionChange();
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    if (this.selectionChangeDeadline = Date.now() + Dp, this.isListening) return;
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
    const s = e.getRangeAt(0);
    if (s.collapsed !== !0 || s.startOffset !== 0) return;
    const n = this.quill.scroll.find(s.startContainer);
    if (!(n instanceof Tt) || !n.uiNode) return;
    const i = document.createRange();
    i.setStartAfter(n.uiNode), i.setEndAfter(n.uiNode), e.removeAllRanges(), e.addRange(i);
  }
}
x.register({
  "blots/block": X,
  "blots/block/embed": gt,
  "blots/break": Lt,
  "blots/container": Ee,
  "blots/cursor": ss,
  "blots/embed": Wr,
  "blots/inline": Bt,
  "blots/scroll": je,
  "blots/text": Dt,
  "modules/clipboard": ll,
  "modules/history": ul,
  "modules/keyboard": Yn,
  "modules/uploader": dl,
  "modules/input": Ep,
  "modules/uiNode": Lp
});
class Ip extends Ct {
  add(t, e) {
    let s = 0;
    if (e === "+1" || e === "-1") {
      const n = this.value(t) || 0;
      s = e === "+1" ? n + 1 : n - 1;
    } else typeof e == "number" && (s = e);
    return s === 0 ? (this.remove(t), !0) : super.add(t, s.toString());
  }
  canAdd(t, e) {
    return super.canAdd(t, e) || super.canAdd(t, parseInt(e, 10));
  }
  value(t) {
    return parseInt(super.value(t), 10) || void 0;
  }
}
const Np = new Ip("indent", "ql-indent", {
  scope: q.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
class Ar extends X {
}
C(Ar, "blotName", "blockquote"), C(Ar, "tagName", "blockquote");
class Er extends X {
  static formats(t) {
    return this.tagName.indexOf(t.tagName) + 1;
  }
}
C(Er, "blotName", "header"), C(Er, "tagName", ["H1", "H2", "H3", "H4", "H5", "H6"]);
class Us extends Ee {
}
Us.blotName = "list-container";
Us.tagName = "OL";
class zs extends X {
  static create(t) {
    const e = super.create();
    return e.setAttribute("data-list", t), e;
  }
  static formats(t) {
    return t.getAttribute("data-list") || void 0;
  }
  static register() {
    x.register(Us);
  }
  constructor(t, e) {
    super(t, e);
    const s = e.ownerDocument.createElement("span"), n = (i) => {
      if (!t.isEnabled()) return;
      const a = this.statics.formats(e, t);
      a === "checked" ? (this.format("list", "unchecked"), i.preventDefault()) : a === "unchecked" && (this.format("list", "checked"), i.preventDefault());
    };
    s.addEventListener("mousedown", n), s.addEventListener("touchstart", n), this.attachUI(s);
  }
  format(t, e) {
    t === this.statics.blotName && e ? this.domNode.setAttribute("data-list", e) : super.format(t, e);
  }
}
zs.blotName = "list";
zs.tagName = "LI";
Us.allowedChildren = [zs];
zs.requiredContainer = Us;
class Fs extends Bt {
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
C(Fs, "blotName", "bold"), C(Fs, "tagName", ["STRONG", "B"]);
class xr extends Fs {
}
C(xr, "blotName", "italic"), C(xr, "tagName", ["EM", "I"]);
class ne extends Bt {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("href", this.sanitize(t)), e.setAttribute("rel", "noopener noreferrer"), e.setAttribute("target", "_blank"), e;
  }
  static formats(t) {
    return t.getAttribute("href");
  }
  static sanitize(t) {
    return hl(t, this.PROTOCOL_WHITELIST) ? t : this.SANITIZED_URL;
  }
  format(t, e) {
    t !== this.statics.blotName || !e ? super.format(t, e) : this.domNode.setAttribute("href", this.constructor.sanitize(e));
  }
}
C(ne, "blotName", "link"), C(ne, "tagName", "A"), C(ne, "SANITIZED_URL", "about:blank"), C(ne, "PROTOCOL_WHITELIST", ["http", "https", "mailto", "tel", "sms"]);
function hl(r, t) {
  const e = document.createElement("a");
  e.href = r;
  const s = e.href.slice(0, e.href.indexOf(":"));
  return t.indexOf(s) > -1;
}
class Tr extends Bt {
  static create(t) {
    return t === "super" ? document.createElement("sup") : t === "sub" ? document.createElement("sub") : super.create(t);
  }
  static formats(t) {
    if (t.tagName === "SUB") return "sub";
    if (t.tagName === "SUP") return "super";
  }
}
C(Tr, "blotName", "script"), C(Tr, "tagName", ["SUB", "SUP"]);
class Dr extends Fs {
}
C(Dr, "blotName", "strike"), C(Dr, "tagName", ["S", "STRIKE"]);
class Cr extends Bt {
}
C(Cr, "blotName", "underline"), C(Cr, "tagName", "U");
class In extends Wr {
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
C(In, "blotName", "formula"), C(In, "className", "ql-formula"), C(In, "tagName", "SPAN");
const no = ["alt", "height", "width"];
var Cn;
let kp = (Cn = class extends ut {
  static create(t) {
    const e = super.create(t);
    return typeof t == "string" && e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return no.reduce((e, s) => (t.hasAttribute(s) && (e[s] = t.getAttribute(s)), e), {});
  }
  static match(t) {
    return /\.(jpe?g|gif|png)$/.test(t) || /^data:image\/.+;base64/.test(t);
  }
  static sanitize(t) {
    return hl(t, ["http", "https", "data"]) ? t : "//:0";
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    no.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
}, C(Cn, "blotName", "image"), C(Cn, "tagName", "IMG"), Cn);
const io = ["height", "width"];
class Nn extends gt {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("frameborder", "0"), e.setAttribute("allowfullscreen", "true"), e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return io.reduce((e, s) => (t.hasAttribute(s) && (e[s] = t.getAttribute(s)), e), {});
  }
  static sanitize(t) {
    return ne.sanitize(t);
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    io.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
  html() {
    const {
      video: t
    } = this.value();
    return `<a href="${t}">${t}</a>`;
  }
}
C(Nn, "blotName", "video"), C(Nn, "className", "ql-video"), C(Nn, "tagName", "IFRAME");
const Ls = new Ct("code-token", "hljs", {
  scope: q.INLINE
});
class Kt extends Bt {
  static formats(t, e) {
    for (; t != null && t !== e.domNode; ) {
      if (t.classList && t.classList.contains(nt.className))
        return super.formats(t, e);
      t = t.parentNode;
    }
  }
  constructor(t, e, s) {
    super(t, e, s), Ls.add(this.domNode, s);
  }
  format(t, e) {
    t !== Kt.blotName ? super.format(t, e) : e ? Ls.add(this.domNode, e) : (Ls.remove(this.domNode), this.domNode.classList.remove(this.statics.className));
  }
  optimize() {
    super.optimize(...arguments), Ls.value(this.domNode) || this.unwrap();
  }
}
Kt.blotName = "code-token";
Kt.className = "ql-token";
class pt extends nt {
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
    return this.formatAt(0, this.length(), Kt.blotName, !1), super.replaceWith(t, e);
  }
}
class Ns extends xe {
  attach() {
    super.attach(), this.forceNext = !1, this.scroll.emitMount(this);
  }
  format(t, e) {
    t === pt.blotName && (this.forceNext = !0, this.children.forEach((s) => {
      s.format(t, e);
    }));
  }
  formatAt(t, e, s, n) {
    s === pt.blotName && (this.forceNext = !0), super.formatAt(t, e, s, n);
  }
  highlight(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.children.head == null) return;
    const n = `${Array.from(this.domNode.childNodes).filter((a) => a !== this.uiNode).map((a) => a.textContent).join(`
`)}
`, i = pt.formats(this.children.head.domNode);
    if (e || this.forceNext || this.cachedText !== n) {
      if (n.trim().length > 0 || this.cachedText == null) {
        const a = this.children.reduce((l, u) => l.concat(Yo(u, !1)), new k()), o = t(n, i);
        a.diff(o).reduce((l, u) => {
          let {
            retain: h,
            attributes: g
          } = u;
          return h ? (g && Object.keys(g).forEach((p) => {
            [pt.blotName, Kt.blotName].includes(p) && this.formatAt(l, h, p, g[p]);
          }), l + h) : l;
        }, 0);
      }
      this.cachedText = n, this.forceNext = !1;
    }
  }
  html(t, e) {
    const [s] = this.children.find(t);
    return `<pre data-language="${s ? pt.formats(s.domNode) : "plain"}">
${Kn(this.code(t, e))}
</pre>`;
  }
  optimize(t) {
    if (super.optimize(t), this.parent != null && this.children.head != null && this.uiNode != null) {
      const e = pt.formats(this.children.head.domNode);
      e !== this.uiNode.value && (this.uiNode.value = e);
    }
  }
}
Ns.allowedChildren = [pt];
pt.requiredContainer = Ns;
pt.allowedChildren = [Kt, ss, Dt, Lt];
const qp = (r, t, e) => {
  if (typeof r.versionString == "string") {
    const s = r.versionString.split(".")[0];
    if (parseInt(s, 10) >= 11)
      return r.highlight(e, {
        language: t
      }).value;
  }
  return r.highlight(t, e).value;
};
class fl extends It {
  static register() {
    x.register(Kt, !0), x.register(pt, !0), x.register(Ns, !0);
  }
  constructor(t, e) {
    if (super(t, e), this.options.hljs == null)
      throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
    this.languages = this.options.languages.reduce((s, n) => {
      let {
        key: i
      } = n;
      return s[i] = !0, s;
    }, {}), this.highlightBlot = this.highlightBlot.bind(this), this.initListener(), this.initTimer();
  }
  initListener() {
    this.quill.on(x.events.SCROLL_BLOT_MOUNT, (t) => {
      if (!(t instanceof Ns)) return;
      const e = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach((s) => {
        let {
          key: n,
          label: i
        } = s;
        const a = e.ownerDocument.createElement("option");
        a.textContent = i, a.setAttribute("value", n), e.appendChild(a);
      }), e.addEventListener("change", () => {
        t.format(pt.blotName, e.value), this.quill.root.focus(), this.highlight(t, !0);
      }), t.uiNode == null && (t.attachUI(e), t.children.head && (e.value = pt.formats(t.children.head.domNode)));
    });
  }
  initTimer() {
    let t = null;
    this.quill.on(x.events.SCROLL_OPTIMIZE, () => {
      t && clearTimeout(t), t = setTimeout(() => {
        this.highlight(), t = null;
      }, this.options.interval);
    });
  }
  highlight() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.quill.selection.composing) return;
    this.quill.update(x.sources.USER);
    const s = this.quill.getSelection();
    (t == null ? this.quill.scroll.descendants(Ns) : [t]).forEach((i) => {
      i.highlight(this.highlightBlot, e);
    }), this.quill.update(x.sources.SILENT), s != null && this.quill.setSelection(s, x.sources.SILENT);
  }
  highlightBlot(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
    if (e = this.languages[e] ? e : "plain", e === "plain")
      return Kn(t).split(`
`).reduce((n, i, a) => (a !== 0 && n.insert(`
`, {
        [nt.blotName]: e
      }), n.insert(i)), new k());
    const s = this.quill.root.ownerDocument.createElement("div");
    return s.classList.add(nt.className), s.innerHTML = qp(this.options.hljs, e, t), sa(this.quill.scroll, s, [(n, i) => {
      const a = Ls.value(n);
      return a ? i.compose(new k().retain(i.length(), {
        [Kt.blotName]: a
      })) : i;
    }], [(n, i) => n.data.split(`
`).reduce((a, o, l) => (l !== 0 && a.insert(`
`, {
      [nt.blotName]: e
    }), a.insert(o)), i)], /* @__PURE__ */ new WeakMap());
  }
}
fl.DEFAULTS = {
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
const qs = class qs extends X {
  static create(t) {
    const e = super.create();
    return t ? e.setAttribute("data-row", t) : e.setAttribute("data-row", na()), e;
  }
  static formats(t) {
    if (t.hasAttribute("data-row"))
      return t.getAttribute("data-row");
  }
  cellOffset() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  format(t, e) {
    t === qs.blotName && e ? this.domNode.setAttribute("data-row", e) : super.format(t, e);
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
C(qs, "blotName", "table"), C(qs, "tagName", "TD");
let xt = qs;
class Yt extends Ee {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const t = this.children.head.formats(), e = this.children.tail.formats(), s = this.next.children.head.formats(), n = this.next.children.tail.formats();
      return t.table === e.table && t.table === s.table && t.table === n.table;
    }
    return !1;
  }
  optimize(t) {
    super.optimize(t), this.children.forEach((e) => {
      if (e.next == null) return;
      const s = e.formats(), n = e.next.formats();
      if (s.table !== n.table) {
        const i = this.splitAfter(e);
        i && i.optimize(), this.prev && this.prev.optimize();
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
C(Yt, "blotName", "table-row"), C(Yt, "tagName", "TR");
class _t extends Ee {
}
C(_t, "blotName", "table-body"), C(_t, "tagName", "TBODY");
class is extends Ee {
  balanceCells() {
    const t = this.descendants(Yt), e = t.reduce((s, n) => Math.max(n.children.length, s), 0);
    t.forEach((s) => {
      new Array(e - s.children.length).fill(0).forEach(() => {
        let n;
        s.children.head != null && (n = xt.formats(s.children.head.domNode));
        const i = this.scroll.create(xt.blotName, n);
        s.appendChild(i), i.optimize();
      });
    });
  }
  cells(t) {
    return this.rows().map((e) => e.children.at(t));
  }
  deleteColumn(t) {
    const [e] = this.descendant(_t);
    e == null || e.children.head == null || e.children.forEach((s) => {
      const n = s.children.at(t);
      n != null && n.remove();
    });
  }
  insertColumn(t) {
    const [e] = this.descendant(_t);
    e == null || e.children.head == null || e.children.forEach((s) => {
      const n = s.children.at(t), i = xt.formats(s.children.head.domNode), a = this.scroll.create(xt.blotName, i);
      s.insertBefore(a, n);
    });
  }
  insertRow(t) {
    const [e] = this.descendant(_t);
    if (e == null || e.children.head == null) return;
    const s = na(), n = this.scroll.create(Yt.blotName);
    e.children.head.children.forEach(() => {
      const a = this.scroll.create(xt.blotName, s);
      n.appendChild(a);
    });
    const i = e.children.at(t);
    e.insertBefore(n, i);
  }
  rows() {
    const t = this.children.head;
    return t == null ? [] : t.children.map((e) => e);
  }
}
C(is, "blotName", "table-container"), C(is, "tagName", "TABLE");
is.allowedChildren = [_t];
_t.requiredContainer = is;
_t.allowedChildren = [Yt];
Yt.requiredContainer = _t;
Yt.allowedChildren = [xt];
xt.requiredContainer = Yt;
function na() {
  return `row-${Math.random().toString(36).slice(2, 6)}`;
}
class Op extends It {
  static register() {
    x.register(xt), x.register(Yt), x.register(_t), x.register(is);
  }
  constructor() {
    super(...arguments), this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(is).forEach((t) => {
      t.balanceCells();
    });
  }
  deleteColumn() {
    const [t, , e] = this.getTable();
    e != null && (t.deleteColumn(e.cellOffset()), this.quill.update(x.sources.USER));
  }
  deleteRow() {
    const [, t] = this.getTable();
    t != null && (t.remove(), this.quill.update(x.sources.USER));
  }
  deleteTable() {
    const [t] = this.getTable();
    if (t == null) return;
    const e = t.offset();
    t.remove(), this.quill.update(x.sources.USER), this.quill.setSelection(e, x.sources.SILENT);
  }
  getTable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
    if (t == null) return [null, null, null, -1];
    const [e, s] = this.quill.getLine(t.index);
    if (e == null || e.statics.blotName !== xt.blotName)
      return [null, null, null, -1];
    const n = e.parent;
    return [n.parent.parent, n, e, s];
  }
  insertColumn(t) {
    const e = this.quill.getSelection();
    if (!e) return;
    const [s, n, i] = this.getTable(e);
    if (i == null) return;
    const a = i.cellOffset();
    s.insertColumn(a + t), this.quill.update(x.sources.USER);
    let o = n.rowOffset();
    t === 0 && (o += 1), this.quill.setSelection(e.index + o, e.length, x.sources.SILENT);
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
    const [s, n, i] = this.getTable(e);
    if (i == null) return;
    const a = n.rowOffset();
    s.insertRow(a + t), this.quill.update(x.sources.USER), t > 0 ? this.quill.setSelection(e, x.sources.SILENT) : this.quill.setSelection(e.index + n.children.length, e.length, x.sources.SILENT);
  }
  insertRowAbove() {
    this.insertRow(0);
  }
  insertRowBelow() {
    this.insertRow(1);
  }
  insertTable(t, e) {
    const s = this.quill.getSelection();
    if (s == null) return;
    const n = new Array(t).fill(0).reduce((i) => {
      const a = new Array(e).fill(`
`).join("");
      return i.insert(a, {
        table: na()
      });
    }, new k().retain(s.index));
    this.quill.updateContents(n, x.sources.USER), this.quill.setSelection(s.index, x.sources.SILENT), this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(x.events.SCROLL_OPTIMIZE, (t) => {
      t.some((e) => ["TD", "TR", "TBODY", "TABLE"].includes(e.target.tagName) ? (this.quill.once(x.events.TEXT_CHANGE, (s, n, i) => {
        i === x.sources.USER && this.balanceTables();
      }), !0) : !1);
    });
  }
}
const ro = Zt("quill:toolbar");
class ia extends It {
  constructor(t, e) {
    var s, n;
    if (super(t, e), Array.isArray(this.options.container)) {
      const i = document.createElement("div");
      i.setAttribute("role", "toolbar"), Mp(i, this.options.container), (n = (s = t.container) == null ? void 0 : s.parentNode) == null || n.insertBefore(i, t.container), this.container = i;
    } else typeof this.options.container == "string" ? this.container = document.querySelector(this.options.container) : this.container = this.options.container;
    if (!(this.container instanceof HTMLElement)) {
      ro.error("Container required for toolbar", this.options);
      return;
    }
    this.container.classList.add("ql-toolbar"), this.controls = [], this.handlers = {}, this.options.handlers && Object.keys(this.options.handlers).forEach((i) => {
      var o;
      const a = (o = this.options.handlers) == null ? void 0 : o[i];
      a && this.addHandler(i, a);
    }), Array.from(this.container.querySelectorAll("button, select")).forEach((i) => {
      this.attach(i);
    }), this.quill.on(x.events.EDITOR_CHANGE, () => {
      const [i] = this.quill.selection.getRange();
      this.update(i);
    });
  }
  addHandler(t, e) {
    this.handlers[t] = e;
  }
  attach(t) {
    let e = Array.from(t.classList).find((n) => n.indexOf("ql-") === 0);
    if (!e) return;
    if (e = e.slice(3), t.tagName === "BUTTON" && t.setAttribute("type", "button"), this.handlers[e] == null && this.quill.scroll.query(e) == null) {
      ro.warn("ignoring attaching to nonexistent format", e, t);
      return;
    }
    const s = t.tagName === "SELECT" ? "change" : "click";
    t.addEventListener(s, (n) => {
      let i;
      if (t.tagName === "SELECT") {
        if (t.selectedIndex < 0) return;
        const o = t.options[t.selectedIndex];
        o.hasAttribute("selected") ? i = !1 : i = o.value || !1;
      } else
        t.classList.contains("ql-active") ? i = !1 : i = t.value || !t.hasAttribute("value"), n.preventDefault();
      this.quill.focus();
      const [a] = this.quill.selection.getRange();
      if (this.handlers[e] != null)
        this.handlers[e].call(this, i);
      else if (
        // @ts-expect-error
        this.quill.scroll.query(e).prototype instanceof ut
      ) {
        if (i = prompt(`Enter ${e}`), !i) return;
        this.quill.updateContents(new k().retain(a.index).delete(a.length).insert({
          [e]: i
        }), x.sources.USER);
      } else
        this.quill.format(e, i, x.sources.USER);
      this.update(a);
    }), this.controls.push([e, t]);
  }
  update(t) {
    const e = t == null ? {} : this.quill.getFormat(t);
    this.controls.forEach((s) => {
      const [n, i] = s;
      if (i.tagName === "SELECT") {
        let a = null;
        if (t == null)
          a = null;
        else if (e[n] == null)
          a = i.querySelector("option[selected]");
        else if (!Array.isArray(e[n])) {
          let o = e[n];
          typeof o == "string" && (o = o.replace(/"/g, '\\"')), a = i.querySelector(`option[value="${o}"]`);
        }
        a == null ? (i.value = "", i.selectedIndex = -1) : a.selected = !0;
      } else if (t == null)
        i.classList.remove("ql-active"), i.setAttribute("aria-pressed", "false");
      else if (i.hasAttribute("value")) {
        const a = e[n], o = a === i.getAttribute("value") || a != null && a.toString() === i.getAttribute("value") || a == null && !i.getAttribute("value");
        i.classList.toggle("ql-active", o), i.setAttribute("aria-pressed", o.toString());
      } else {
        const a = e[n] != null;
        i.classList.toggle("ql-active", a), i.setAttribute("aria-pressed", a.toString());
      }
    });
  }
}
ia.DEFAULTS = {};
function ao(r, t, e) {
  const s = document.createElement("button");
  s.setAttribute("type", "button"), s.classList.add(`ql-${t}`), s.setAttribute("aria-pressed", "false"), e != null ? (s.value = e, s.setAttribute("aria-label", `${t}: ${e}`)) : s.setAttribute("aria-label", t), r.appendChild(s);
}
function Mp(r, t) {
  Array.isArray(t[0]) || (t = [t]), t.forEach((e) => {
    const s = document.createElement("span");
    s.classList.add("ql-formats"), e.forEach((n) => {
      if (typeof n == "string")
        ao(s, n);
      else {
        const i = Object.keys(n)[0], a = n[i];
        Array.isArray(a) ? Rp(s, i, a) : ao(s, i, a);
      }
    }), r.appendChild(s);
  });
}
function Rp(r, t, e) {
  const s = document.createElement("select");
  s.classList.add(`ql-${t}`), e.forEach((n) => {
    const i = document.createElement("option");
    n !== !1 ? i.setAttribute("value", String(n)) : i.setAttribute("selected", "selected"), s.appendChild(i);
  }), r.appendChild(s);
}
ia.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const r = this.quill.getSelection();
      if (r != null)
        if (r.length === 0) {
          const t = this.quill.getFormat();
          Object.keys(t).forEach((e) => {
            this.quill.scroll.query(e, q.INLINE) != null && this.quill.format(e, !1, x.sources.USER);
          });
        } else
          this.quill.removeFormat(r.index, r.length, x.sources.USER);
    },
    direction(r) {
      const {
        align: t
      } = this.quill.getFormat();
      r === "rtl" && t == null ? this.quill.format("align", "right", x.sources.USER) : !r && t === "right" && this.quill.format("align", !1, x.sources.USER), this.quill.format("direction", r, x.sources.USER);
    },
    indent(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t), s = parseInt(e.indent || 0, 10);
      if (r === "+1" || r === "-1") {
        let n = r === "+1" ? 1 : -1;
        e.direction === "rtl" && (n *= -1), this.quill.format("indent", s + n, x.sources.USER);
      }
    },
    link(r) {
      r === !0 && (r = prompt("Enter link URL:")), this.quill.format("link", r, x.sources.USER);
    },
    list(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t);
      r === "check" ? e.list === "checked" || e.list === "unchecked" ? this.quill.format("list", !1, x.sources.USER) : this.quill.format("list", "unchecked", x.sources.USER) : this.quill.format("list", r, x.sources.USER);
    }
  }
};
const _p = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>', $p = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>', Bp = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>', Fp = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>', Pp = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>', Hp = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>', jp = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>', Up = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>', oo = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>', zp = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>', Vp = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>', Gp = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>', Kp = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>', Yp = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>', Wp = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Zp = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Qp = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>', Xp = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Jp = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>', tg = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>', eg = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>', sg = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>', ng = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>', ig = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>', rg = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>', ag = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>', og = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>', lg = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>', cg = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>', ug = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>', dg = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>', hg = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>', fg = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>', Ps = {
  align: {
    "": _p,
    center: $p,
    right: Bp,
    justify: Fp
  },
  background: Pp,
  blockquote: Hp,
  bold: jp,
  clean: Up,
  code: oo,
  "code-block": oo,
  color: zp,
  direction: {
    "": Vp,
    rtl: Gp
  },
  formula: Kp,
  header: {
    1: Yp,
    2: Wp,
    3: Zp,
    4: Qp,
    5: Xp,
    6: Jp
  },
  italic: tg,
  image: eg,
  indent: {
    "+1": sg,
    "-1": ng
  },
  link: ig,
  list: {
    bullet: rg,
    check: ag,
    ordered: og
  },
  script: {
    sub: lg,
    super: cg
  },
  strike: ug,
  table: dg,
  underline: hg,
  video: fg
}, pg = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
let lo = 0;
function co(r, t) {
  r.setAttribute(t, `${r.getAttribute(t) !== "true"}`);
}
class Wn {
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
    this.container.classList.toggle("ql-expanded"), co(this.label, "aria-expanded"), co(this.options, "aria-hidden");
  }
  buildItem(t) {
    const e = document.createElement("span");
    e.tabIndex = "0", e.setAttribute("role", "button"), e.classList.add("ql-picker-item");
    const s = t.getAttribute("value");
    return s && e.setAttribute("data-value", s), t.textContent && e.setAttribute("data-label", t.textContent), e.addEventListener("click", () => {
      this.selectItem(e, !0);
    }), e.addEventListener("keydown", (n) => {
      switch (n.key) {
        case "Enter":
          this.selectItem(e, !0), n.preventDefault();
          break;
        case "Escape":
          this.escape(), n.preventDefault();
          break;
      }
    }), e;
  }
  buildLabel() {
    const t = document.createElement("span");
    return t.classList.add("ql-picker-label"), t.innerHTML = pg, t.tabIndex = "0", t.setAttribute("role", "button"), t.setAttribute("aria-expanded", "false"), this.container.appendChild(t), t;
  }
  buildOptions() {
    const t = document.createElement("span");
    t.classList.add("ql-picker-options"), t.setAttribute("aria-hidden", "true"), t.tabIndex = "-1", t.id = `ql-picker-options-${lo}`, lo += 1, this.label.setAttribute("aria-controls", t.id), this.options = t, Array.from(this.select.options).forEach((e) => {
      const s = this.buildItem(e);
      t.appendChild(s), e.selected === !0 && this.selectItem(s);
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
    const s = this.container.querySelector(".ql-selected");
    t !== s && (s != null && s.classList.remove("ql-selected"), t != null && (t.classList.add("ql-selected"), this.select.selectedIndex = Array.from(t.parentNode.children).indexOf(t), t.hasAttribute("data-value") ? this.label.setAttribute("data-value", t.getAttribute("data-value")) : this.label.removeAttribute("data-value"), t.hasAttribute("data-label") ? this.label.setAttribute("data-label", t.getAttribute("data-label")) : this.label.removeAttribute("data-label"), e && (this.select.dispatchEvent(new Event("change")), this.close())));
  }
  update() {
    let t;
    if (this.select.selectedIndex > -1) {
      const s = (
        // @ts-expect-error Fix me later
        this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex]
      );
      t = this.select.options[this.select.selectedIndex], this.selectItem(s);
    } else
      this.selectItem(null);
    const e = t != null && t !== this.select.querySelector("option[selected]");
    this.label.classList.toggle("ql-active", e);
  }
}
class pl extends Wn {
  constructor(t, e) {
    super(t), this.label.innerHTML = e, this.container.classList.add("ql-color-picker"), Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((s) => {
      s.classList.add("ql-primary");
    });
  }
  buildItem(t) {
    const e = super.buildItem(t);
    return e.style.backgroundColor = t.getAttribute("value") || "", e;
  }
  selectItem(t, e) {
    super.selectItem(t, e);
    const s = this.label.querySelector(".ql-color-label"), n = t && t.getAttribute("data-value") || "";
    s && (s.tagName === "line" ? s.style.stroke = n : s.style.fill = n);
  }
}
class gl extends Wn {
  constructor(t, e) {
    super(t), this.container.classList.add("ql-icon-picker"), Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach((s) => {
      s.innerHTML = e[s.getAttribute("data-value") || ""];
    }), this.defaultItem = this.container.querySelector(".ql-selected"), this.selectItem(this.defaultItem);
  }
  selectItem(t, e) {
    super.selectItem(t, e);
    const s = t || this.defaultItem;
    if (s != null) {
      if (this.label.innerHTML === s.innerHTML) return;
      this.label.innerHTML = s.innerHTML;
    }
  }
}
const gg = (r) => {
  const {
    overflowY: t
  } = getComputedStyle(r, null);
  return t !== "visible" && t !== "clip";
};
class ml {
  constructor(t, e) {
    this.quill = t, this.boundsContainer = e || document.body, this.root = t.addContainer("ql-tooltip"), this.root.innerHTML = this.constructor.TEMPLATE, gg(this.quill.root) && this.quill.root.addEventListener("scroll", () => {
      this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
    }), this.hide();
  }
  hide() {
    this.root.classList.add("ql-hidden");
  }
  position(t) {
    const e = t.left + t.width / 2 - this.root.offsetWidth / 2, s = t.bottom + this.quill.root.scrollTop;
    this.root.style.left = `${e}px`, this.root.style.top = `${s}px`, this.root.classList.remove("ql-flip");
    const n = this.boundsContainer.getBoundingClientRect(), i = this.root.getBoundingClientRect();
    let a = 0;
    if (i.right > n.right && (a = n.right - i.right, this.root.style.left = `${e + a}px`), i.left < n.left && (a = n.left - i.left, this.root.style.left = `${e + a}px`), i.bottom > n.bottom) {
      const o = i.bottom - i.top, l = t.bottom - t.top + o;
      this.root.style.top = `${s - l}px`, this.root.classList.add("ql-flip");
    }
    return a;
  }
  show() {
    this.root.classList.remove("ql-editing"), this.root.classList.remove("ql-hidden");
  }
}
const mg = [!1, "center", "right", "justify"], bg = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"], yg = [!1, "serif", "monospace"], vg = ["1", "2", "3", !1], wg = ["small", !1, "large", "huge"];
class Vs extends ns {
  constructor(t, e) {
    super(t, e);
    const s = (n) => {
      if (!document.body.contains(t.root)) {
        document.body.removeEventListener("click", s);
        return;
      }
      this.tooltip != null && // @ts-expect-error
      !this.tooltip.root.contains(n.target) && // @ts-expect-error
      document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus() && this.tooltip.hide(), this.pickers != null && this.pickers.forEach((i) => {
        i.container.contains(n.target) || i.close();
      });
    };
    t.emitter.listenDOM("click", document.body, s);
  }
  addModule(t) {
    const e = super.addModule(t);
    return t === "toolbar" && this.extendToolbar(e), e;
  }
  buildButtons(t, e) {
    Array.from(t).forEach((s) => {
      (s.getAttribute("class") || "").split(/\s+/).forEach((i) => {
        if (i.startsWith("ql-") && (i = i.slice(3), e[i] != null))
          if (i === "direction")
            s.innerHTML = e[i][""] + e[i].rtl;
          else if (typeof e[i] == "string")
            s.innerHTML = e[i];
          else {
            const a = s.value || "";
            a != null && e[i][a] && (s.innerHTML = e[i][a]);
          }
      });
    });
  }
  buildPickers(t, e) {
    this.pickers = Array.from(t).map((n) => {
      if (n.classList.contains("ql-align") && (n.querySelector("option") == null && Cs(n, mg), typeof e.align == "object"))
        return new gl(n, e.align);
      if (n.classList.contains("ql-background") || n.classList.contains("ql-color")) {
        const i = n.classList.contains("ql-background") ? "background" : "color";
        return n.querySelector("option") == null && Cs(n, bg, i === "background" ? "#ffffff" : "#000000"), new pl(n, e[i]);
      }
      return n.querySelector("option") == null && (n.classList.contains("ql-font") ? Cs(n, yg) : n.classList.contains("ql-header") ? Cs(n, vg) : n.classList.contains("ql-size") && Cs(n, wg)), new Wn(n);
    });
    const s = () => {
      this.pickers.forEach((n) => {
        n.update();
      });
    };
    this.quill.on(I.events.EDITOR_CHANGE, s);
  }
}
Vs.DEFAULTS = ie({}, ns.DEFAULTS, {
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
class bl extends ml {
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
    const s = this.quill.getBounds(this.quill.selection.savedRange);
    s != null && this.position(s), this.textbox.select(), this.textbox.setAttribute("placeholder", this.textbox.getAttribute(`data-${t}`) || ""), this.root.setAttribute("data-mode", t);
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
        this.linkRange ? (this.quill.formatText(this.linkRange, "link", t, I.sources.USER), delete this.linkRange) : (this.restoreFocus(), this.quill.format("link", t, I.sources.USER)), this.quill.root.scrollTop = e;
        break;
      }
      case "video":
        t = Sg(t);
      case "formula": {
        if (!t) break;
        const e = this.quill.getSelection(!0);
        if (e != null) {
          const s = e.index + e.length;
          this.quill.insertEmbed(
            s,
            // @ts-expect-error Fix me later
            this.root.getAttribute("data-mode"),
            t,
            I.sources.USER
          ), this.root.getAttribute("data-mode") === "formula" && this.quill.insertText(s + 1, " ", I.sources.USER), this.quill.setSelection(s + 2, I.sources.USER);
        }
        break;
      }
    }
    this.textbox.value = "", this.hide();
  }
}
function Sg(r) {
  let t = r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  return t ? `${t[1] || "https"}://www.youtube.com/embed/${t[2]}?showinfo=0` : (t = r.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) ? `${t[1] || "https"}://player.vimeo.com/video/${t[2]}/` : r;
}
function Cs(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  t.forEach((s) => {
    const n = document.createElement("option");
    s === e ? n.setAttribute("selected", "selected") : n.setAttribute("value", String(s)), r.appendChild(n);
  });
}
const Ag = [["bold", "italic", "link"], [{
  header: 1
}, {
  header: 2
}, "blockquote"]];
class yl extends bl {
  constructor(t, e) {
    super(t, e), this.quill.on(I.events.EDITOR_CHANGE, (s, n, i, a) => {
      if (s === I.events.SELECTION_CHANGE)
        if (n != null && n.length > 0 && a === I.sources.USER) {
          this.show(), this.root.style.left = "0px", this.root.style.width = "", this.root.style.width = `${this.root.offsetWidth}px`;
          const o = this.quill.getLines(n.index, n.length);
          if (o.length === 1) {
            const l = this.quill.getBounds(n);
            l != null && this.position(l);
          } else {
            const l = o[o.length - 1], u = this.quill.getIndex(l), h = Math.min(l.length() - 1, n.index + n.length - u), g = this.quill.getBounds(new ve(u, h));
            g != null && this.position(g);
          }
        } else document.activeElement !== this.textbox && this.quill.hasFocus() && this.hide();
    });
  }
  listen() {
    super.listen(), this.root.querySelector(".ql-close").addEventListener("click", () => {
      this.root.classList.remove("ql-editing");
    }), this.quill.on(I.events.SCROLL_OPTIMIZE, () => {
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
    const e = super.position(t), s = this.root.querySelector(".ql-tooltip-arrow");
    return s.style.marginLeft = "", e !== 0 && (s.style.marginLeft = `${-1 * e - s.offsetWidth / 2}px`), e;
  }
}
C(yl, "TEMPLATE", ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join(""));
class vl extends Vs {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = Ag), super(t, e), this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(t) {
    this.tooltip = new yl(this.quill, this.options.bounds), t.container != null && (this.tooltip.root.appendChild(t.container), this.buildButtons(t.container.querySelectorAll("button"), Ps), this.buildPickers(t.container.querySelectorAll("select"), Ps));
  }
}
vl.DEFAULTS = ie({}, Vs.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(r) {
          r ? this.quill.theme.tooltip.edit() : this.quill.format("link", !1, x.sources.USER);
        }
      }
    }
  }
});
const Eg = [[{
  header: ["1", "2", "3", !1]
}], ["bold", "italic", "underline", "link"], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["clean"]];
class wl extends bl {
  constructor() {
    super(...arguments);
    C(this, "preview", this.root.querySelector("a.ql-preview"));
  }
  listen() {
    super.listen(), this.root.querySelector("a.ql-action").addEventListener("click", (e) => {
      this.root.classList.contains("ql-editing") ? this.save() : this.edit("link", this.preview.textContent), e.preventDefault();
    }), this.root.querySelector("a.ql-remove").addEventListener("click", (e) => {
      if (this.linkRange != null) {
        const s = this.linkRange;
        this.restoreFocus(), this.quill.formatText(s, "link", !1, I.sources.USER), delete this.linkRange;
      }
      e.preventDefault(), this.hide();
    }), this.quill.on(I.events.SELECTION_CHANGE, (e, s, n) => {
      if (e != null) {
        if (e.length === 0 && n === I.sources.USER) {
          const [i, a] = this.quill.scroll.descendant(ne, e.index);
          if (i != null) {
            this.linkRange = new ve(e.index - a, i.length());
            const o = ne.formats(i.domNode);
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
C(wl, "TEMPLATE", ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join(""));
class Sl extends Vs {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = Eg), super(t, e), this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(t) {
    t.container != null && (t.container.classList.add("ql-snow"), this.buildButtons(t.container.querySelectorAll("button"), Ps), this.buildPickers(t.container.querySelectorAll("select"), Ps), this.tooltip = new wl(this.quill, this.options.bounds), t.container.querySelector(".ql-link") && this.quill.keyboard.addBinding({
      key: "k",
      shortKey: !0
    }, (e, s) => {
      t.handlers.link.call(t, !s.format.link);
    }));
  }
}
Sl.DEFAULTS = ie({}, Vs.DEFAULTS, {
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
              tooltip: s
            } = this.quill.theme;
            s.edit("link", e);
          } else
            this.quill.format("link", !1, x.sources.USER);
        }
      }
    }
  }
});
x.register({
  "attributors/attribute/direction": tl,
  "attributors/class/align": Qo,
  "attributors/class/background": Pf,
  "attributors/class/color": Ff,
  "attributors/class/direction": el,
  "attributors/class/font": il,
  "attributors/class/size": al,
  "attributors/style/align": Xo,
  "attributors/style/background": Xr,
  "attributors/style/color": Qr,
  "attributors/style/direction": sl,
  "attributors/style/font": rl,
  "attributors/style/size": ol
}, !0);
x.register({
  "formats/align": Qo,
  "formats/direction": el,
  "formats/indent": Np,
  "formats/background": Xr,
  "formats/color": Qr,
  "formats/font": il,
  "formats/size": al,
  "formats/blockquote": Ar,
  "formats/code-block": nt,
  "formats/header": Er,
  "formats/list": zs,
  "formats/bold": Fs,
  "formats/code": Jr,
  "formats/italic": xr,
  "formats/link": ne,
  "formats/script": Tr,
  "formats/strike": Dr,
  "formats/underline": Cr,
  "formats/formula": In,
  "formats/image": kp,
  "formats/video": Nn,
  "modules/syntax": fl,
  "modules/table": Op,
  "modules/toolbar": ia,
  "themes/bubble": vl,
  "themes/snow": Sl,
  "ui/icons": Ps,
  "ui/picker": Wn,
  "ui/icon-picker": gl,
  "ui/color-picker": pl,
  "ui/tooltip": ml
}, !0);
class ra extends G {
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
    f.findByDataAttribute("quill-editor", "true").forEach((e) => this.initializeQuillEditor(e));
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
          const s = e;
          f.hasDataAttribute(s, "quill-editor", "true") && this.initializeQuillEditor(s), f.findByDataAttribute("quill-editor", "true", s).forEach((i) => this.initializeQuillEditor(i));
        }
      });
    });
  }
  /**
   * Initialize a single Quill editor element
   */
  initializeQuillEditor(t) {
    if (console.log("EditorActions: Initializing Quill editor", t), !f.getDataAttribute(t, "editorId")) {
      console.warn("EditorActions: No editor-id found");
      return;
    }
    const s = f.querySelector('[data-quill-container="true"]', t), n = f.querySelector('[data-quill-input="true"]', t), i = f.querySelector('[data-quill-live-region="true"]', t);
    if (!s) {
      console.warn("EditorActions: No Quill container element found");
      return;
    }
    const a = f.getDataAttribute(s, "quillConfig"), o = f.getDataAttribute(s, "quillValue");
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
        const g = JSON.parse(a);
        l = { ...l, ...g };
      } catch (g) {
        console.warn("EditorActions: Invalid Quill config JSON", g), console.warn("EditorActions: Using default config");
      }
    console.log("EditorActions: Final Quill config", l), console.log("EditorActions: Container element", s);
    let u;
    try {
      u = new x(s, l), console.log("EditorActions: Quill instance created successfully", u);
    } catch (g) {
      console.error("EditorActions: Failed to create Quill instance", g);
      return;
    }
    if (o)
      try {
        u.root.innerHTML = o;
      } catch (g) {
        console.warn("EditorActions: Error setting initial value", g);
      }
    const h = {
      quillInstance: u,
      containerElement: s,
      hiddenInput: n,
      config: l,
      liveRegion: i,
      lastAnnouncementTime: 0
    };
    this.setState(t, h), this.setupContentSync(h), this.setupAccessibilityFeatures(h), console.log("EditorActions: Quill editor initialized successfully");
  }
  /**
   * Set up content synchronization between Quill and hidden input
   */
  setupContentSync(t) {
    t.quillInstance.on("text-change", () => {
      this.syncQuillToInput(t);
    }), this.syncQuillToInput(t);
  }
  /**
   * Sync Quill content to hidden input
   */
  syncQuillToInput(t) {
    t.hiddenInput && (t.hiddenInput.value = t.quillInstance.root.innerHTML);
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
    const s = this.getState(t);
    s && (s.quillInstance.root.innerHTML = e, this.syncQuillToInput(s));
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
    const s = 2e3;
    t.quillInstance.on("text-change", (n, i, a) => {
      a === "user" && (e && clearTimeout(e), e = window.setTimeout(() => {
        const o = t.quillInstance.getText().trim(), l = o ? o.split(/\s+/).length : 0;
        l > 0 && this.announceToLiveRegion(t, `${l} words written`);
      }, s));
    }), t.quillInstance.on("selection-change", (n, i, a) => {
      if (n && a === "user") {
        const o = t.quillInstance.getFormat(n);
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
    const s = e.querySelectorAll("button");
    s.forEach((n, i) => {
      this.enhanceButtonAccessibility(n), n.setAttribute("tabindex", i === 0 ? "0" : "-1");
    }), e.addEventListener("keydown", (n) => {
      this.handleToolbarKeyboard(n, s);
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
    for (const [s, n] of Object.entries(e))
      if (t.classList.contains(s.split("[")[0]) || t.matches(`[${s.split("[")[1]}`)) {
        t.setAttribute("aria-label", n), t.setAttribute("title", n);
        break;
      }
  }
  /**
   * Handle toolbar keyboard navigation
   */
  handleToolbarKeyboard(t, e) {
    const s = Array.from(e).findIndex((i) => i === document.activeElement);
    if (s === -1) return;
    let n = s;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowUp":
        n = s > 0 ? s - 1 : e.length - 1, t.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowDown":
        n = s < e.length - 1 ? s + 1 : 0, t.preventDefault();
        break;
      case "Home":
        n = 0, t.preventDefault();
        break;
      case "End":
        n = e.length - 1, t.preventDefault();
        break;
      default:
        return;
    }
    e[s].setAttribute("tabindex", "-1"), e[n].setAttribute("tabindex", "0"), e[n].focus();
  }
  /**
   * Announce text to the live region
   */
  announceToLiveRegion(t, e) {
    if (!t.liveRegion) return;
    const s = Date.now();
    s - t.lastAnnouncementTime < 1e3 || (t.liveRegion.textContent = e, t.lastAnnouncementTime = s, setTimeout(() => {
      t.liveRegion && (t.liveRegion.textContent = "");
    }, 3e3));
  }
  /**
   * Announce formatting changes
   */
  announceFormattingChanges(t, e) {
    const s = Object.keys(e).filter((n) => e[n]);
    if (s.length > 0) {
      const n = s.map((i) => {
        switch (i) {
          case "bold":
            return "bold";
          case "italic":
            return "italic";
          case "underline":
            return "underlined";
          case "strike":
            return "strikethrough";
          case "header":
            return `heading ${e[i]}`;
          case "list":
            return `${e[i]} list`;
          default:
            return i;
        }
      });
      this.announceToLiveRegion(t, `Formatting: ${n.join(", ")}`);
    }
  }
  /**
   * Announce keyboard shortcuts help
   */
  announceKeyboardHelp(t) {
    this.announceToLiveRegion(t, "Keyboard shortcuts: Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, Ctrl+K for link. Use arrow keys to navigate toolbar buttons.");
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
ra.getInstance();
class rs extends G {
  /**
   * Initialize date picker elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("date-picker", "true").forEach((t) => {
      this.initializeDatePicker(t);
    });
  }
  /**
   * Initialize a single date picker element
   */
  initializeDatePicker(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.datePickerConfig, s = t.dataset.inline === "true", n = t.dataset.disabled === "true";
    let i;
    try {
      i = e ? JSON.parse(e) : {};
    } catch (o) {
      console.error("Failed to parse date picker config:", o), i = {};
    }
    const a = {
      isOpen: s,
      selectedDate: i.selectedDate || null,
      startDate: i.startDate || null,
      endDate: i.endDate || null,
      format: i.format || "Y-m-d",
      displayFormat: i.displayFormat || i.format || "Y-m-d",
      isRange: i.isRange || !1,
      closeOnSelect: i.closeOnSelect !== !1,
      isInline: s,
      isDisabled: n,
      position: "bottom"
    };
    this.setState(t, a), this.setupCalendarEventListeners(t), s && this.openDropdown(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    w.handleDelegatedClick("[data-date-picker-input]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-date-picker="true"]');
      s && !this.isDisabled(s) && this.toggleDropdown(s);
    }), w.handleDelegatedClick("[data-date-picker-trigger]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const s = f.findClosest(t, '[data-date-picker="true"]');
      s && !this.isDisabled(s) && this.toggleDropdown(s);
    }), w.handleDelegatedClick("[data-date-picker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const s = f.findClosest(t, '[data-date-picker="true"]');
      s && !this.isDisabled(s) && this.clearDate(s);
    }), w.handleDelegatedClick("[data-quick-selector]", (t, e) => {
      e.preventDefault();
      const s = f.findClosest(t, '[data-date-picker="true"]'), n = t.dataset.quickSelector;
      s && n && !this.isDisabled(s) && this.applyQuickSelector(s, n);
    }), w.handleDelegatedKeydown("[data-date-picker-input]", (t, e) => {
      const s = f.findClosest(t, '[data-date-picker="true"]');
      if (!s) return;
      const n = this.getState(s);
      if (n)
        switch (e.key) {
          case "Escape":
            n.isOpen && (e.preventDefault(), this.closeDropdown(s));
            break;
          case "Enter":
            e.preventDefault(), n.isOpen || this.openDropdown(s);
            break;
          case "ArrowDown":
            n.isOpen || (e.preventDefault(), this.openDropdown(s));
            break;
          case "Tab":
            if (n.isOpen && !e.shiftKey) {
              const i = f.querySelector('[data-calendar="true"]', s);
              i && _.createTimer(() => {
                const a = i.querySelector("button:not(:disabled)");
                a && a.focus();
              }, 10);
            }
            break;
        }
    }), w.handleDelegatedInput("[data-date-picker-input]", (t) => {
      if (!t.readOnly) {
        const e = f.findClosest(t, '[data-date-picker="true"]');
        e && !this.isDisabled(e) && this.handleManualInput(e, t.value);
      }
    }), w.addEventListener(document, "click", (t) => {
      const e = t.target;
      f.findByDataAttribute("date-picker", "true").forEach((s) => {
        const n = this.getState(s);
        if (n && n.isOpen && !n.isInline) {
          const i = !s.contains(e), a = e.closest('[data-calendar="true"]') || e.hasAttribute("data-calendar-date") || e.hasAttribute("data-calendar-nav") || e.hasAttribute("data-calendar-action") || e.hasAttribute("data-quick-selector");
          i && !a && this.closeDropdown(s);
        }
      });
    }), w.handleResize(() => {
      f.findByDataAttribute("date-picker", "true").forEach((t) => {
        const e = this.getState(t);
        e && e.isOpen && !e.isInline && this.updateDropdownPosition(t);
      });
    });
  }
  /**
   * Setup calendar event listeners for a date picker
   */
  setupCalendarEventListeners(t) {
    const e = f.querySelector('[data-calendar="true"]', t);
    e && (e.addEventListener("calendar:dateSelected", (s) => {
      s.stopPropagation();
      const n = s.detail;
      this.handleDateSelected(t, n.selectedDate, n.formattedDate);
    }), e.addEventListener("calendar:rangeSelected", (s) => {
      s.stopPropagation();
      const n = s.detail;
      this.handleRangeSelected(t, n.startDate, n.endDate, n.formattedRange);
    }), e.addEventListener("calendar:cleared", (s) => {
      s.stopPropagation(), this.handleCalendarCleared(t);
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
    const s = f.querySelector("[data-date-picker-dropdown]", t);
    s && (this.updateDropdownPosition(t), s.classList.add("animating-in"), s.classList.add("open"), _.createTimer(() => {
      s.classList.remove("animating-in");
      const n = f.querySelector('[data-calendar="true"]', t);
      if (n) {
        const i = n.querySelector('button:not(:disabled), [tabindex="0"]');
        i && i.focus();
      }
    }, 200), this.dispatchDatePickerEvent(t, "datepicker:opened"));
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen || e.isInline) return;
    e.isOpen = !1, this.setState(t, e);
    const s = f.querySelector("[data-date-picker-dropdown]", t);
    if (!s) return;
    s.classList.remove("open");
    const n = f.querySelector("[data-date-picker-input]", t);
    n && n.focus(), this.dispatchDatePickerEvent(t, "datepicker:closed");
  }
  /**
   * Update dropdown position based on viewport
   */
  updateDropdownPosition(t) {
    const e = f.querySelector("[data-date-picker-dropdown]", t);
    if (!e) return;
    const s = this.getState(t);
    if (!s) return;
    const n = window.innerHeight, i = t.getBoundingClientRect(), a = e.offsetHeight || 400, o = n - i.bottom, l = i.top;
    o < a && l > a ? (e.classList.add("top"), s.position = "top") : (e.classList.remove("top"), s.position = "bottom"), this.setState(t, s);
  }
  /**
   * Handle date selection from calendar
   */
  handleDateSelected(t, e, s) {
    const n = this.getState(t);
    if (!n) return;
    n.selectedDate = e, this.setState(t, n);
    const i = f.querySelector("[data-date-picker-input]", t);
    i && s && (i.value = rt.formatDateForDisplay(e, n.displayFormat));
    const a = f.querySelector("[data-date-picker-value]", t);
    a && (a.value = e ? rt.formatDateForSubmission(e, n.format) : ""), n.closeOnSelect && !n.isInline && !n.isRange && _.createTimer(() => {
      this.closeDropdown(t);
    }, 150), this.dispatchDatePickerEvent(t, "datepicker:change", {
      value: e,
      formatted: s
    });
  }
  /**
   * Handle range selection from calendar
   */
  handleRangeSelected(t, e, s, n) {
    const i = this.getState(t);
    if (!i) return;
    i.startDate = e, i.endDate = s, this.setState(t, i);
    const a = f.querySelector("[data-date-picker-input]", t);
    a && (a.value = rt.formatRangeForDisplay(e, s, i.displayFormat));
    const o = f.querySelector("[data-date-picker-value]", t);
    if (o) {
      const l = rt.formatRangeForSubmission(e, s, i.format);
      o.value = l || "";
    }
    i.closeOnSelect && e && s && !i.isInline && _.createTimer(() => {
      this.closeDropdown(t);
    }, 150), this.dispatchDatePickerEvent(t, "datepicker:change", {
      startDate: e,
      endDate: s,
      formatted: n
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
    const s = f.querySelector("[data-date-picker-input]", t);
    s && (s.value = "");
    const n = f.querySelector("[data-date-picker-value]", t);
    n && (n.value = "");
    const i = f.querySelector('[data-calendar="true"]', t);
    if (i && window.CalendarActions)
      try {
        const a = window.CalendarActions.getInstance();
        if (e.isRange) {
          const o = a.getCalendarState(i);
          o && (o.startDate = null, o.endDate = null, o.rangeSelectionState = "none", a.setState(i, o), i.dispatchEvent(new CustomEvent("calendar:cleared")));
        } else
          a.setSelectedDate(i, null);
      } catch (a) {
        console.warn("Calendar actions not available or failed:", a);
      }
    e.isInline || this.closeDropdown(t), this.dispatchDatePickerEvent(t, "datepicker:cleared");
  }
  /**
   * Apply quick selector
   */
  applyQuickSelector(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const { start: n, end: i } = rt.getQuickSelectorDate(e);
    let a = n, o = n, l = i;
    const u = f.querySelector('[data-calendar="true"]', t);
    if (u && window.CalendarActions)
      try {
        const h = window.CalendarActions.getInstance();
        if (s.isRange && o && l) {
          const g = h.getCalendarState(u);
          g && (g.startDate = rt.formatDateString(o), g.endDate = rt.formatDateString(l), g.rangeSelectionState = "none", h.setState(u, g), u.dispatchEvent(new CustomEvent("calendar:rangeSelected", {
            detail: {
              startDate: g.startDate,
              endDate: g.endDate,
              formattedRange: rt.formatRangeForDisplay(g.startDate, g.endDate, s.displayFormat)
            }
          })));
        } else if (a) {
          const g = rt.formatDateString(a);
          h.setSelectedDate(u, g);
        }
      } catch (h) {
        console.warn("Calendar actions not available or failed:", h);
      }
  }
  /**
   * Handle manual input
   */
  handleManualInput(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const n = rt.parseInputDate(e, s.displayFormat);
    if (n) {
      const i = rt.formatDateString(n), a = f.querySelector('[data-calendar="true"]', t);
      if (a && window.CalendarActions)
        try {
          window.CalendarActions.getInstance().setSelectedDate(a, i);
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
  dispatchDatePickerEvent(t, e, s = null) {
    w.dispatchCustomEvent(t, e, {
      datePicker: t,
      ...s
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
          const s = e;
          f.hasDataAttribute(s, "date-picker", "true") && this.initializeDatePicker(s), f.findByDataAttribute("date-picker", "true", s).forEach((n) => {
            this.initializeDatePicker(n);
          });
        }
      });
    });
  }
  /**
   * Clean up DatePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  rs.getInstance().init();
}) : rs.getInstance().init();
window.DatePickerActions = rs;
rs.getInstance();
class aa extends G {
  constructor() {
    super(...arguments), this.cleanupFunctions = [];
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      w.handleDelegatedClick(
        '[data-add-to-cart="true"]',
        (t, e) => this.handleAddToCart(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedClick(
        ".qty-decrease",
        (t, e) => this.handleQuantityChange(t, e, "decrease")
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedClick(
        ".qty-increase",
        (t, e) => this.handleQuantityChange(t, e, "increase")
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedInput(
        ".qty-input",
        (t, e) => this.handleQuantityInput(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedKeydown(
        ".qty-input",
        (t, e) => this.handleQuantityKeydown(t, e)
      )
    );
  }
  initializeElements() {
    f.findByDataAttribute("add-to-cart", "true").forEach((e) => this.initializeButton(e));
  }
  initializeButton(t) {
    const e = this.extractStateFromButton(t);
    if (e) {
      const s = f.querySelector(".button-text", t);
      s && (e.originalText = s.textContent || ""), this.setState(t, e), this.updateButtonState(t), this.updateQuantityControls(t);
    }
  }
  extractStateFromButton(t) {
    const e = f.getDataAttribute(t, "productId");
    return e ? {
      productId: e,
      variantId: f.getDataAttribute(t, "variantId"),
      quantity: parseInt(f.getDataAttribute(t, "quantity") || "1"),
      maxQuantity: parseInt(f.getDataAttribute(t, "maxQuantity") || "99"),
      stockLevel: f.getDataAttribute(t, "stockLevel") ? parseInt(f.getDataAttribute(t, "stockLevel")) : void 0,
      price: f.getDataAttribute(t, "price"),
      ajaxUrl: f.getDataAttribute(t, "ajaxUrl") || "/cart/add",
      inCart: f.getDataAttribute(t, "inCart") === "true",
      isProcessing: !1
    } : (console.warn("AddToCart button missing required data-product-id attribute"), null);
  }
  async handleAddToCart(t, e) {
    if (e.preventDefault(), f.isDisabled(t))
      return;
    const s = this.getState(t);
    if (!s || s.isProcessing)
      return;
    const n = this.getQuantityInput(t);
    if (n && (s.quantity = parseInt(n.value) || 1), !this.validateQuantity(s.quantity, s)) {
      this.showError(t, "Invalid quantity");
      return;
    }
    s.isProcessing = !0, this.setState(t, s), this.setButtonState(t, "adding");
    try {
      const i = await this.sendCartRequest(s);
      if (i.success)
        s.inCart = i.inCart ?? !0, s.isProcessing = !1, i.stockLevel !== void 0 && (s.stockLevel = i.stockLevel, f.setDataAttribute(t, "stockLevel", i.stockLevel.toString())), this.setState(t, s), this.setButtonState(t, "added"), this.dispatchCartEvent(t, "cart:added", {
          productId: s.productId,
          variantId: s.variantId,
          quantity: s.quantity,
          cartCount: i.cartCount
        }), setTimeout(() => {
          var a;
          (a = this.getState(t)) != null && a.inCart && this.setButtonState(t, "default");
        }, 2e3);
      else
        throw new Error(i.error || i.message || "Failed to add to cart");
    } catch (i) {
      s.isProcessing = !1, this.setState(t, s), this.setButtonState(t, "default"), this.showError(t, i instanceof Error ? i.message : "An error occurred");
    }
    this.updateQuantityControls(t);
  }
  handleQuantityChange(t, e, s) {
    e.preventDefault();
    const n = f.getDataAttribute(t, "target");
    if (!n) return;
    const i = f.getElementById(n);
    if (!i) return;
    const a = f.findClosest(t, ".add-to-cart-wrapper"), o = a ? f.querySelector('[data-add-to-cart="true"]', a) : null;
    if (!o) return;
    const l = this.getState(o);
    if (!l) return;
    const u = parseInt(i.value) || 1;
    let h = u;
    s === "increase" ? h = Math.min(u + 1, l.maxQuantity) : h = Math.max(u - 1, 1), h !== u && (i.value = h.toString(), l.quantity = h, this.setState(o, l), this.dispatchCartEvent(o, "cart:quantity-changed", {
      productId: l.productId,
      quantity: h,
      previousQuantity: u
    })), this.updateQuantityControls(o);
  }
  handleQuantityInput(t, e) {
    const s = f.findClosest(t, ".add-to-cart-wrapper"), n = s ? f.querySelector('[data-add-to-cart="true"]', s) : null;
    if (!n) return;
    const i = this.getState(n);
    if (!i) return;
    let a = parseInt(t.value) || 1;
    a = Math.max(1, Math.min(a, i.maxQuantity)), t.value !== a.toString() && (t.value = a.toString()), i.quantity = a, this.setState(n, i), this.updateQuantityControls(n);
  }
  handleQuantityKeydown(t, e) {
    [8, 9, 27, 13, 35, 36, 37, 39, 38, 40].includes(e.keyCode) || // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode) || (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.preventDefault();
  }
  validateQuantity(t, e) {
    return !(t < 1 || t > e.maxQuantity || e.stockLevel !== void 0 && t > e.stockLevel);
  }
  async sendCartRequest(t) {
    var i;
    const e = new FormData();
    e.append("product_id", t.productId), e.append("quantity", t.quantity.toString()), t.variantId && e.append("variant_id", t.variantId);
    const s = (i = f.querySelector('meta[name="csrf-token"]')) == null ? void 0 : i.getAttribute("content");
    s && e.append("_token", s);
    const n = await fetch(t.ajaxUrl, {
      method: "POST",
      body: e,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    });
    if (!n.ok)
      throw new Error(`HTTP ${n.status}: ${n.statusText}`);
    return await n.json();
  }
  setButtonState(t, e) {
    f.removeClasses(t, ["adding", "added"]), e !== "default" && f.addClass(t, e);
    const s = f.querySelector(".button-text", t);
    if (s) {
      const n = this.getState(t);
      switch (e) {
        case "adding":
          const i = f.getDataAttribute(t, "labelToggle");
          i && (s.textContent = i);
          break;
        case "added":
          const a = f.getDataAttribute(t, "labelSuccess");
          a && (s.textContent = a);
          break;
        case "default":
          n != null && n.originalText && (s.textContent = n.originalText);
          break;
      }
    }
  }
  updateButtonState(t) {
    const e = this.getState(t);
    e && (e.stockLevel !== void 0 && e.stockLevel <= 0 ? (f.toggleAttribute(t, "disabled", "true"), f.addClasses(t, ["cursor-not-allowed", "opacity-50"])) : (f.toggleAttribute(t, "disabled"), f.removeClasses(t, ["cursor-not-allowed", "opacity-50"])));
  }
  updateQuantityControls(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = f.findClosest(t, ".add-to-cart-wrapper");
    if (!s) return;
    const n = f.querySelector(".qty-decrease", s);
    n && f.toggleAttribute(n, "disabled", e.quantity <= 1 ? "true" : void 0);
    const i = f.querySelector(".qty-increase", s);
    if (i) {
      const o = e.quantity >= e.maxQuantity || e.stockLevel !== void 0 && e.quantity >= e.stockLevel;
      f.toggleAttribute(i, "disabled", o ? "true" : void 0);
    }
    const a = this.getQuantityInput(t);
    a && (a.max = e.maxQuantity.toString(), e.stockLevel !== void 0 && (a.max = Math.min(e.maxQuantity, e.stockLevel).toString()));
  }
  getQuantityInput(t) {
    const e = f.findClosest(t, ".add-to-cart-wrapper");
    return f.querySelector(".qty-input", e);
  }
  showError(t, e) {
    this.dispatchCartEvent(t, "cart:error", { message: e }), console.error("Add to Cart Error:", e);
  }
  dispatchCartEvent(t, e, s) {
    w.dispatchCustomEvent(t, e, s);
  }
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        e instanceof Element && f.findByDataAttribute("add-to-cart", "true", e).forEach((n) => this.initializeButton(n));
      });
    });
  }
  destroy() {
    this.cleanupFunctions.forEach((t) => t()), this.cleanupFunctions = [], super.destroy();
  }
}
if (typeof document < "u") {
  const r = () => {
    aa.getInstance().init();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
}
class Al extends G {
  constructor() {
    super(...arguments), this.cleanupFunctions = [], this.filePreviewsMap = /* @__PURE__ */ new Map();
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      w.handleDelegatedClick(
        "[data-file-upload-zone]",
        (t, e) => this.handleDropZoneClick(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedEvent(
        "keydown",
        "[data-file-upload-zone]",
        (t, e) => this.handleDropZoneKeydown(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedChange(
        "[data-file-input]",
        (t, e) => this.handleFileInputChange(t, e)
      )
    ), this.setupDragAndDropEvents(), this.cleanupFunctions.push(
      w.handleDelegatedClick(
        "[data-remove-file]",
        (t, e) => this.handleRemoveFile(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedClick(
        "[data-remove-existing-file]",
        (t, e) => this.handleRemoveExistingFile(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedClick(
        "[data-dismiss-error]",
        (t, e) => this.handleDismissError(t, e)
      )
    ), this.cleanupFunctions.push(
      w.handleDelegatedClick(
        "[data-add-more-files]",
        (t, e) => this.handleAddMoreFiles(t, e)
      )
    );
  }
  initializeElements() {
    const t = f.findByDataAttribute("file-upload-zone");
    console.log(`FileUploadActions: Found ${t.length} file upload zones to initialize`), t.forEach((e, s) => {
      console.log(`FileUploadActions: Initializing zone ${s + 1}:`, e), this.initializeZone(e);
    });
  }
  initializeZone(t) {
    const e = this.findFileInput(t);
    if (console.log("FileUploadActions: Found input for zone:", e), !e) {
      console.warn("FileUploadActions: No file input found for zone:", t);
      return;
    }
    const s = f.getDataAttribute(t, "preview"), n = f.getDataAttribute(t, "progress"), i = f.getDataAttribute(t, "auto-upload");
    console.log("FileUploadActions: Data attributes - preview:", s, "progress:", n, "auto-upload:", i);
    const a = {
      files: [],
      isUploading: !1,
      isDragOver: !1,
      hasLivewire: this.detectLivewire(e),
      livewireProperty: this.getLivewireProperty(e),
      validationRules: this.parseValidationRules(t),
      preview: s === "true",
      progress: n === "true",
      autoUpload: i === "true",
      fileUploadZone: t
    };
    this.setState(t, a), this.filePreviewsMap.set(t, /* @__PURE__ */ new Map());
  }
  setupDragAndDropEvents() {
    this.cleanupFunctions.push(
      w.addEventListener(document, "dragenter", (t) => t.preventDefault()),
      w.addEventListener(document, "dragover", (t) => t.preventDefault()),
      w.addEventListener(document, "drop", (t) => t.preventDefault())
    ), this.cleanupFunctions.push(
      w.handleDelegatedEvent(
        "dragenter",
        "[data-file-upload-zone]",
        (t, e) => this.handleDragEnter(t, e)
      ),
      w.handleDelegatedEvent(
        "dragover",
        "[data-file-upload-zone]",
        (t, e) => this.handleDragOver(t, e)
      ),
      w.handleDelegatedEvent(
        "dragleave",
        "[data-file-upload-zone]",
        (t, e) => this.handleDragLeave(t, e)
      ),
      w.handleDelegatedEvent(
        "drop",
        "[data-file-upload-zone]",
        (t, e) => this.handleDrop(t, e)
      )
    );
  }
  handleDropZoneClick(t, e) {
    if (console.log("FileUploadActions: Drop zone clicked:", t, e), f.isDisabled(t)) {
      console.log("FileUploadActions: Zone is disabled, ignoring click");
      return;
    }
    const s = e.target;
    if (s === t || s.closest("[data-file-upload-zone]") === t) {
      if (s.closest('button, a, [role="button"]:not([data-file-upload-zone])') && !s.closest(".pointer-events-none")) {
        console.log("FileUploadActions: Clicked on nested interactive element, ignoring");
        return;
      }
      console.log("FileUploadActions: Valid drop zone click, triggering file select"), this.triggerFileSelect(t);
    }
  }
  handleDropZoneKeydown(t, e) {
    f.isDisabled(t) || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.triggerFileSelect(t));
  }
  triggerFileSelect(t) {
    const e = this.findFileInput(t);
    console.log("FileUploadActions: Found input for trigger:", e), e ? (console.log("FileUploadActions: Triggering input click"), e.click(), this.announceToScreenReader("File selection dialog opened")) : console.warn("FileUploadActions: No input found for zone trigger");
  }
  // Browse button functionality removed - now handled by drop zone click
  handleFileInputChange(t, e) {
    console.log("FileUploadActions: File input change detected:", t, e);
    const s = t.parentElement, n = s ? s.querySelector("[data-file-upload-zone]") : null;
    if (console.log("FileUploadActions: Found zone for file input:", n), !n) return;
    const i = Array.from(t.files || []);
    console.log("FileUploadActions: Selected files:", i), this.processFiles(n, i);
  }
  handleDragEnter(t, e) {
    f.isDisabled(t) || (e.preventDefault(), this.setDragState(t, !0));
  }
  handleDragOver(t, e) {
    f.isDisabled(t) || (e.preventDefault(), e.dataTransfer.dropEffect = "copy");
  }
  handleDragLeave(t, e) {
    if (f.isDisabled(t)) return;
    const s = t.getBoundingClientRect(), n = e.clientX, i = e.clientY;
    (n < s.left || n > s.right || i < s.top || i > s.bottom) && this.setDragState(t, !1);
  }
  handleDrop(t, e) {
    var n;
    if (f.isDisabled(t)) return;
    e.preventDefault(), this.setDragState(t, !1);
    const s = Array.from(((n = e.dataTransfer) == null ? void 0 : n.files) || []);
    s.length > 0 && this.processFiles(t, s);
  }
  handleRemoveFile(t, e) {
    console.log("FileUploadActions: Remove button clicked:", t, e), e.stopPropagation();
    const s = t.getAttribute("data-remove-file");
    console.log("FileUploadActions: File ID to remove:", s);
    const n = f.findClosest(t, "[data-file-previews]"), i = n == null ? void 0 : n.parentElement, a = i ? i.querySelector("[data-file-upload-zone]") : null;
    console.log("FileUploadActions: Found preview area:", n), console.log("FileUploadActions: Found wrapper:", i), console.log("FileUploadActions: Found zone for removal:", a), a && s ? this.removeFile(a, s) : console.warn("FileUploadActions: Could not find zone or fileId for removal");
  }
  handleRemoveExistingFile(t, e) {
    console.log("FileUploadActions: Remove existing file button clicked:", t, e), e.stopPropagation();
    const s = t.getAttribute("data-remove-existing-file");
    console.log("FileUploadActions: File ID to remove:", s), w.dispatchCustomEvent(t, "file-upload:remove-existing", {
      fileId: s
    }), console.log("FileUploadActions: Dispatched remove-existing event for file:", s);
  }
  handleAddMoreFiles(t, e) {
    console.log("FileUploadActions: Add more files button clicked:", t, e), e.stopPropagation();
    const s = f.findClosest(t, "[data-file-previews]"), n = s == null ? void 0 : s.parentElement, i = n ? n.querySelector("[data-file-upload-zone]") : null;
    if (console.log("FileUploadActions: Found zone for add more button:", i), !i) {
      console.warn("FileUploadActions: No zone found for add more button");
      return;
    }
    const a = this.findFileInput(i);
    a ? (console.log("FileUploadActions: Triggering input click for add more"), a.click(), this.announceToScreenReader("File selection dialog opened for additional files")) : console.warn("FileUploadActions: No input found for add more button");
  }
  processFiles(t, e) {
    console.log("FileUploadActions: Processing files:", e);
    const s = this.getState(t);
    if (console.log("FileUploadActions: Current state:", s), !s) return;
    const n = this.validateFiles(e, s.validationRules, s.files.length);
    if (console.log("FileUploadActions: Validation result:", n), !n.valid) {
      this.showError(t, n.errors.join(", "));
      return;
    }
    const i = n.validFiles;
    console.log("FileUploadActions: Adding new files to state:", i);
    const a = this.findFileInput(t);
    !((a == null ? void 0 : a.hasAttribute("multiple")) ?? !1) && s.files.length > 0 ? (s.files = [...i], this.clearAllPreviews(t)) : s.files.push(...i), this.setState(t, s), console.log("FileUploadActions: Preview enabled?", s.preview), s.preview && (console.log("FileUploadActions: Creating file previews for:", i), this.createFilePreviews(t, i)), s.hasLivewire && this.updateLivewireFiles(t, s.files), s.autoUpload && this.uploadFiles(t, i);
    const l = i.length, u = s.files.length, h = l === 1 ? `Selected ${i[0].name}` : `Selected ${l} files`, g = u > l ? ` (${u} files total)` : "";
    this.announceToScreenReader(h + g), w.dispatchCustomEvent(t, "file-upload:files-added", {
      files: i,
      allFiles: s.files
    });
  }
  validateFiles(t, e, s) {
    const n = [], i = [];
    if (e.maxFiles && s + t.length > e.maxFiles)
      return n.push(`Maximum ${e.maxFiles} files allowed`), { valid: !1, validFiles: [], errors: n };
    for (const a of t) {
      const o = [];
      e.accept && !this.isFileTypeAllowed(a, e.accept) && o.push(`${a.name}: File type not allowed`), e.maxSize && a.size > e.maxSize && o.push(`${a.name}: File too large (max ${this.formatFileSize(e.maxSize)})`), o.length === 0 ? i.push(a) : n.push(...o);
    }
    return { valid: n.length === 0, validFiles: i, errors: n };
  }
  isFileTypeAllowed(t, e) {
    return e.split(",").map((n) => n.trim()).some((n) => {
      if (n.startsWith("."))
        return t.name.toLowerCase().endsWith(n.toLowerCase());
      if (n.includes("*")) {
        const i = n.replace("*", ".*");
        return new RegExp(i).test(t.type);
      } else
        return t.type === n;
    });
  }
  createFilePreviews(t, e) {
    var i;
    const s = (i = t.parentElement) == null ? void 0 : i.querySelector("[data-preview-list]");
    if (!s) {
      console.warn("FileUploadActions: Preview container not found");
      return;
    }
    const n = this.filePreviewsMap.get(t) || /* @__PURE__ */ new Map();
    e.forEach((a) => {
      const o = this.generateFileId(a), l = {
        file: a,
        id: o,
        progress: 0,
        status: "pending"
      };
      n.set(o, l), this.renderFilePreview(s, l);
    }), this.filePreviewsMap.set(t, n), this.updatePreviewLayout(t), this.showPreviewArea(t);
  }
  renderFilePreview(t, e) {
    const s = t.getAttribute("data-layout-type") || "file-list";
    this.renderFilePreviewForLayout(t, e, s);
  }
  /**
   * Renders a file preview for a specific layout type
   */
  renderFilePreviewForLayout(t, e, s) {
    const n = e.file.type.startsWith("image/"), i = this.formatFileSize(e.file.size), a = this.getFileTypeIconName(e.file);
    let o;
    s === "image-grid" && n ? o = this.createImageGridPreview(e, i) : s === "mixed" && n ? o = this.createMixedImagePreview(e, i) : o = this.createFileListPreview(e, i, a, n), t.appendChild(o), n && this.loadImagePreview(o, e), this.updatePreviewStatus(o, e.status);
  }
  /**
   * Creates a large image grid preview for pure image uploads
   */
  createImageGridPreview(t, e) {
    const s = f.createElement("div", {
      classes: ["image-grid-item", "group", "relative", "bg-surface", "border", "border-border", "rounded-lg", "overflow-hidden", "transition-all", "duration-200", "hover:shadow-lg", "hover:border-brand"],
      attributes: {
        "data-file-id": t.id,
        "data-file-status": t.status,
        role: "listitem"
      }
    });
    return s.innerHTML = `
            <!-- Large Image Display (1:1 aspect ratio) -->
            <div class="aspect-square relative bg-surface overflow-hidden">
                <img
                    src=""
                    alt="Preview of ${this.escapeHtml(t.file.name)}"
                    class="w-full h-full object-cover opacity-50 transition-opacity duration-200"
                    data-image-preview="true"
                />

                <!-- Status indicator corner badge -->
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ${this.getStatusIndicator(t.status)}
                </div>

                <!-- Hover overlay with file details -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                    <div class="p-4 w-full text-white">
                        <h4 class="font-medium text-sm truncate mb-1" title="${this.escapeHtml(t.file.name)}">
                            ${this.escapeHtml(t.file.name)}
                        </h4>
                        <div class="flex items-center justify-between text-xs text-white/80">
                            <span>${e}</span>
                            ${t.status !== "pending" ? `<span class="capitalize">${t.status}</span>` : ""}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete button (always visible on mobile, hover on desktop) -->
            <button
                type="button"
                class="absolute top-2 left-2 w-8 h-8 bg-black/60 hover:bg-danger text-white rounded-full transition-all duration-200 opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                data-remove-file="${t.id}"
                aria-label="Remove ${this.escapeHtml(t.file.name)}"
            >
                ${this.getHeroiconSvg("heroicon-o-x-mark", "w-4 h-4")}
            </button>

            <!-- Progress bar for uploads -->
            ${t.status === "uploading" ? `
                <div class="absolute bottom-0 left-0 right-0 h-2 bg-black/20">
                    <div
                        class="h-full bg-brand transition-all duration-300 ease-out"
                        style="width: ${t.progress}%"
                        data-progress-bar="${t.id}"
                    ></div>
                </div>
            ` : ""}
        `, s;
  }
  /**
   * Creates an enhanced image preview for mixed file uploads
   */
  createMixedImagePreview(t, e) {
    const s = f.createElement("div", {
      classes: ["mixed-image-item", "group", "relative", "flex", "items-center", "p-4", "border", "border-border", "rounded-lg", "bg-surface", "hover:bg-surface/80", "transition-all", "duration-200"],
      attributes: {
        "data-file-id": t.id,
        "data-file-status": t.status,
        role: "listitem"
      }
    });
    return s.innerHTML = `
            <!-- Enhanced Image Thumbnail (larger than standard) -->
            <div class="flex items-center space-x-4 flex-1 min-w-0">
                <div class="file-preview-thumbnail flex-shrink-0">
                    <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-surface border border-border">
                        <img
                            src=""
                            alt="Preview of ${this.escapeHtml(t.file.name)}"
                            class="w-full h-full object-cover opacity-50"
                            data-image-preview="true"
                        />
                        <!-- Status indicator -->
                        <div class="absolute top-1 right-1">
                            ${this.getStatusIndicator(t.status, "sm")}
                        </div>
                    </div>
                </div>

                <!-- File Information -->
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors" title="${this.escapeHtml(t.file.name)}">
                        ${this.escapeHtml(t.file.name)}
                    </p>
                    <div class="flex items-center space-x-2 text-xs text-muted mt-1">
                        <span>${e}</span>
                        ${t.status !== "pending" ? `
                            <span class="text-muted/50">•</span>
                            <span class="capitalize ${this.getStatusColor(t.status)}">
                                ${t.status}
                            </span>
                        ` : ""}
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2 flex-shrink-0">
                ${t.status === "uploading" ? `
                    <div class="w-4 h-4 animate-spin text-brand">
                        <svg fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ` : ""}

                <button
                    type="button"
                    class="p-2 opacity-60 group-hover:opacity-100 hover:bg-danger/10 text-danger hover:text-danger-hover rounded transition-all duration-200"
                    data-remove-file="${t.id}"
                    aria-label="Remove ${this.escapeHtml(t.file.name)}"
                >
                    ${this.getHeroiconSvg("heroicon-o-trash", "w-4 h-4")}
                </button>
            </div>

            <!-- Progress Bar -->
            ${t.status === "uploading" ? `
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-lg overflow-hidden">
                    <div
                        class="h-full bg-brand transition-all duration-300 ease-out"
                        style="width: ${t.progress}%"
                        data-progress-bar="${t.id}"
                    ></div>
                </div>
            ` : ""}
        `, s;
  }
  /**
   * Creates a standard file list preview
   */
  createFileListPreview(t, e, s, n) {
    const i = f.createElement("div", {
      classes: ["file-preview-item", "group", "relative", "flex", "items-center", "justify-between", "p-4", "border", "border-border", "rounded-lg", "bg-surface", "hover:bg-surface/80", "transition-all", "duration-200"],
      attributes: {
        "data-file-id": t.id,
        "data-file-status": t.status,
        role: "listitem"
      }
    });
    return i.innerHTML = `
            <div class="flex items-center space-x-4 flex-1 min-w-0">
                <div class="file-preview-thumbnail flex-shrink-0">
                    ${n ? `<div class="relative w-12 h-12 rounded-md overflow-hidden bg-surface border border-border">
                            <img src="" alt="Preview of ${this.escapeHtml(t.file.name)}" class="w-full h-full object-cover opacity-50" data-image-preview="true" />
                        </div>` : `<div class="w-12 h-12 rounded-md bg-surface border border-border flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                            ${this.getHeroiconSvg(s, "w-6 h-6")}
                        </div>`}
                </div>

                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors" title="${this.escapeHtml(t.file.name)}">
                        ${this.escapeHtml(t.file.name)}
                    </p>
                    <div class="flex items-center space-x-2 text-xs text-muted">
                        <span>${e}</span>
                        ${t.status !== "pending" ? `
                            <span class="text-muted/50">•</span>
                            <span class="capitalize ${this.getStatusColor(t.status)}">
                                ${t.status}
                            </span>
                        ` : ""}
                    </div>
                </div>
            </div>

            <div class="flex items-center space-x-2 flex-shrink-0">
                ${t.status === "uploading" ? `
                    <div class="w-4 h-4 animate-spin text-brand">
                        <svg fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ` : ""}

                ${t.status === "success" ? `
                    ${this.getHeroiconSvg("heroicon-o-check-circle", "w-5 h-5 text-success")}
                ` : ""}

                ${t.status === "error" ? `
                    ${this.getHeroiconSvg("heroicon-o-exclamation-triangle", "w-5 h-5 text-danger")}
                ` : ""}

                <button
                    type="button"
                    class="p-2 opacity-60 group-hover:opacity-100 hover:bg-danger/10 text-danger hover:text-danger-hover rounded transition-all duration-200"
                    data-remove-file="${t.id}"
                    aria-label="Remove ${this.escapeHtml(t.file.name)}"
                >
                    ${this.getHeroiconSvg("heroicon-o-trash", "w-4 h-4")}
                </button>
            </div>

            ${t.status === "uploading" ? `
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-lg overflow-hidden">
                    <div
                        class="h-full bg-brand transition-all duration-300 ease-out"
                        style="width: ${t.progress}%"
                        data-progress-bar="${t.id}"
                    ></div>
                </div>
            ` : ""}
        `, i;
  }
  /**
   * Gets status indicator for corner badges
   */
  getStatusIndicator(t, e = "md") {
    const s = e === "sm" ? "w-4 h-4" : "w-6 h-6";
    switch (t) {
      case "success":
        return `<div class="${s} bg-success rounded-full flex items-center justify-center">
                    ${this.getHeroiconSvg("heroicon-o-check", `${e === "sm" ? "w-2.5 h-2.5" : "w-4 h-4"} text-white`)}
                </div>`;
      case "error":
        return `<div class="${s} bg-danger rounded-full flex items-center justify-center">
                    ${this.getHeroiconSvg("heroicon-o-x-mark", `${e === "sm" ? "w-2.5 h-2.5" : "w-4 h-4"} text-white`)}
                </div>`;
      case "uploading":
        return `<div class="${s} bg-brand rounded-full flex items-center justify-center">
                    <div class="${e === "sm" ? "w-2.5 h-2.5" : "w-4 h-4"} animate-spin text-white">
                        <svg fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>`;
      default:
        return "";
    }
  }
  escapeHtml(t) {
    const e = document.createElement("div");
    return e.textContent = t, e.innerHTML;
  }
  truncateText(t, e) {
    return t.length > e ? t.substring(0, e) + "..." : t;
  }
  getStatusColor(t) {
    switch (t) {
      case "success":
        return "text-success";
      case "error":
        return "text-danger";
      case "uploading":
        return "text-brand";
      default:
        return "text-muted";
    }
  }
  loadImagePreview(t, e) {
    const s = t.querySelector("[data-image-preview]");
    if (s && e.file.type.startsWith("image/")) {
      const n = t.querySelector(".file-preview-thumbnail");
      n && n.classList.add("skeleton-loader");
      const i = new FileReader();
      i.onload = (a) => {
        var o;
        (o = a.target) != null && o.result && (s.src = a.target.result, s.classList.remove("opacity-50"), s.onload = () => {
          n && n.classList.remove("skeleton-loader");
        }, e.preview = a.target.result, console.log("FileUploadActions: Image preview loaded for:", e.id));
      }, i.onerror = () => {
        console.error("FileUploadActions: Failed to read image file:", e.file.name), n && n.classList.remove("skeleton-loader"), this.announceToScreenReader(`Failed to load preview for ${e.file.name}`);
      }, i.readAsDataURL(e.file);
    }
  }
  updatePreviewStatus(t, e) {
    t.classList.remove("upload-success", "upload-error", "uploading"), e === "success" ? t.classList.add("upload-success") : e === "error" ? t.classList.add("upload-error") : e === "uploading" && t.classList.add("uploading"), t.setAttribute("data-file-status", e);
  }
  /**
   * Updates the preview layout based on file types (grid for images, list for files)
   */
  updatePreviewLayout(t) {
    var u;
    const e = (u = t.parentElement) == null ? void 0 : u.querySelector("[data-preview-list]");
    if (!e) {
      console.warn("FileUploadActions: Preview container not found for layout update");
      return;
    }
    const s = this.getState(t);
    if (!s) return;
    const n = s.files.some((h) => h.type.startsWith("image/")), i = s.files.filter((h) => h.type.startsWith("image/")).length, a = s.files.length, o = n && i === a, l = n && i < a;
    console.log("FileUploadActions: Layout detection - Images:", i, "Total:", a, "Image-only:", o), e.classList.remove("image-grid-layout", "file-list-layout", "mixed-layout"), o ? (e.classList.add("image-grid-layout"), e.setAttribute("data-layout-type", "image-grid")) : l ? (e.classList.add("mixed-layout"), e.setAttribute("data-layout-type", "mixed")) : (e.classList.add("file-list-layout"), e.setAttribute("data-layout-type", "file-list")), this.reRenderPreviewsForLayout(e, s);
  }
  /**
   * Re-renders all previews for the current layout type
   */
  reRenderPreviewsForLayout(t, e) {
    const s = t.getAttribute("data-layout-type") || "file-list";
    t.innerHTML = "";
    const n = e.fileUploadZone, i = this.filePreviewsMap.get(n);
    i && i.forEach((a) => {
      this.renderFilePreviewForLayout(t, a, s);
    });
  }
  updateFilePreviewProgress(t, e, s) {
    const n = document.querySelector(`[data-file-id="${t}"]`);
    if (!n) return;
    const i = n.querySelector("[data-progress-bar]");
    i && (i.style.width = `${e}%`), s && this.updatePreviewStatus(n, s);
  }
  generateImagePreview(t, e, s) {
    console.log("FileUploadActions: Image preview generation handled by template system");
  }
  removeFile(t, e) {
    var l;
    console.log("FileUploadActions: removeFile called with zone:", t, "fileId:", e);
    const s = this.getState(t);
    if (!s) {
      console.warn("FileUploadActions: No state found for zone");
      return;
    }
    console.log("FileUploadActions: Current files before removal:", s.files);
    const n = s.files.find((u) => this.generateFileId(u) === e), i = (n == null ? void 0 : n.name) || "File";
    s.files = s.files.filter((u) => this.generateFileId(u) !== e), this.setState(t, s), console.log("FileUploadActions: Files after removal:", s.files);
    const a = this.filePreviewsMap.get(t);
    a && (a.delete(e), console.log("FileUploadActions: Removed from previews map"));
    const o = (l = t.parentElement) == null ? void 0 : l.querySelector(`[data-file-id="${e}"]`);
    console.log("FileUploadActions: Found preview element to remove:", o), o && (f.removeElement(o), console.log("FileUploadActions: Removed preview element from DOM")), s.hasLivewire && this.updateLivewireFiles(t, s.files), s.files.length === 0 && this.hidePreviewArea(t), this.announceToScreenReader(`${i} removed`), w.dispatchCustomEvent(t, "file-upload:file-removed", {
      fileId: e,
      fileName: i,
      allFiles: s.files
    });
  }
  uploadFiles(t, e) {
    const s = this.getState(t);
    !s || s.isUploading || (s.isUploading = !0, this.setState(t, s), this.setUploadingState(t, !0), w.dispatchCustomEvent(t, "file-upload:upload-start", {
      files: e
    }), this.simulateUpload(t, e));
  }
  simulateUpload(t, e) {
    const s = t.querySelector("[data-upload-progress]");
    this.getState(t) && e.forEach((o) => {
      const l = this.generateFileId(o);
      this.updateFilePreviewProgress(l, 0, "uploading");
    });
    let i = 0;
    const a = setInterval(() => {
      if (i += Math.random() * 10, i >= 100 && (i = 100, clearInterval(a), this.completeUpload(t, e)), s) {
        const o = s.querySelector(".progress-bar");
        o && (o.style.width = `${i}%`);
      }
      e.forEach((o) => {
        const l = this.generateFileId(o);
        this.updateFilePreviewProgress(l, i);
      });
    }, 100);
  }
  completeUpload(t, e) {
    const s = this.getState(t);
    if (!s) return;
    s.isUploading = !1, this.setState(t, s), this.setUploadingState(t, !1), e.forEach((a) => {
      const o = this.generateFileId(a);
      this.updateFilePreviewProgress(o, 100, "success");
    });
    const n = e.length, i = n === 1 ? `File ${e[0].name} uploaded successfully` : `${n} files uploaded successfully`;
    this.announceToScreenReader(i), w.dispatchCustomEvent(t, "file-upload:upload-complete", {
      files: e
    });
  }
  // Helper methods
  findFileInput(t) {
    const e = t.parentElement;
    if (!e) return null;
    const s = e.querySelector("[data-file-input]");
    return console.log("FileUploadActions: Looking for input in wrapper:", e, "found:", s), s || null;
  }
  detectLivewire(t) {
    return Array.from(t.attributes).some((e) => e.name.startsWith("wire:"));
  }
  getLivewireProperty(t) {
    return t.getAttribute("wire:model") || t.getAttribute("wire:model.live") || void 0;
  }
  parseValidationRules(t) {
    const e = f.getDataAttribute(t, "validation-rules");
    try {
      return e ? JSON.parse(e) : {};
    } catch {
      return {};
    }
  }
  updateLivewireFiles(t, e) {
    const s = this.findFileInput(t);
    if (!s) return;
    const n = new DataTransfer();
    e.forEach((i) => n.items.add(i)), s.files = n.files, s.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  setDragState(t, e) {
    const s = this.getState(t);
    s && (s.isDragOver = e, this.setState(t, s), f.toggleClass(t, "drag-over", e));
  }
  setUploadingState(t, e) {
    f.toggleClass(t, "uploading", e);
  }
  showPreviewArea(t) {
    var s;
    const e = (s = t.parentElement) == null ? void 0 : s.querySelector("[data-file-previews]");
    if (e) {
      f.removeClass(e, "hidden");
      const n = e.querySelector("[data-add-more-files]");
      n && f.removeClass(n, "hidden");
    }
  }
  hidePreviewArea(t) {
    var s;
    const e = (s = t.parentElement) == null ? void 0 : s.querySelector("[data-file-previews]");
    e && f.addClass(e, "hidden");
  }
  clearAllPreviews(t) {
    var s;
    const e = (s = t.parentElement) == null ? void 0 : s.querySelector("[data-preview-list]");
    e && e.querySelectorAll("[data-file-id]").forEach((i) => {
      f.removeElement(i);
    }), this.filePreviewsMap.set(t, /* @__PURE__ */ new Map()), this.updatePreviewLayout(t);
  }
  handleDismissError(t, e) {
    e.stopPropagation();
    const s = f.findClosest(t, "[data-file-upload-errors]");
    s && f.addClass(s, "hidden");
  }
  showError(t, e) {
    var n;
    const s = (n = t.parentElement) == null ? void 0 : n.querySelector("[data-file-upload-errors]");
    if (s) {
      const i = s.querySelector("[data-error-message]");
      i && (i.textContent = e), f.removeClass(s, "hidden"), s.focus();
    }
    this.announceToScreenReader(`Error: ${e}`), w.dispatchCustomEvent(t, "file-upload:error", {
      message: e
    });
  }
  announceToScreenReader(t) {
    let e = document.getElementById("file-upload-live-region");
    e || (e = document.createElement("div"), e.id = "file-upload-live-region", e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), e.className = "sr-only", document.body.appendChild(e)), e.__clearTimeout && clearTimeout(e.__clearTimeout), e.textContent = t, e.__clearTimeout = setTimeout(() => {
      e.textContent = "";
    }, 5e3);
  }
  generateFileId(t) {
    return `${t.name}-${t.size}-${Date.now()}`;
  }
  getFileTypeIconName(t) {
    var n;
    const e = t.type.toLowerCase(), s = (n = t.name.split(".").pop()) == null ? void 0 : n.toLowerCase();
    return e.startsWith("image/") ? "heroicon-o-photo" : e.startsWith("video/") ? "heroicon-o-video-camera" : e.startsWith("audio/") ? "heroicon-o-musical-note" : e === "application/pdf" ? "heroicon-o-document-text" : ["zip", "rar", "7z", "tar", "gz"].includes(s || "") || e.includes("zip") || e.includes("compressed") ? "heroicon-o-archive-box" : ["js", "ts", "html", "css", "php", "py", "java", "cpp", "c", "json", "xml"].includes(s || "") || e.includes("text") ? "heroicon-o-code-bracket" : ["ppt", "pptx"].includes(s || "") || e.includes("presentation") ? "heroicon-o-presentation-chart-bar" : ["xls", "xlsx", "csv"].includes(s || "") || e.includes("spreadsheet") ? "heroicon-o-table-cells" : "heroicon-o-document";
  }
  getHeroiconSvg(t, e) {
    const s = `${e} fill="none" stroke="currentColor" viewBox="0 0 24 24"`;
    switch (t) {
      case "heroicon-o-photo":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>`;
      case "heroicon-o-video-camera":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>`;
      case "heroicon-o-musical-note":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                </svg>`;
      case "heroicon-o-document-text":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>`;
      case "heroicon-o-archive-box":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>`;
      case "heroicon-o-code-bracket":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>`;
      case "heroicon-o-presentation-chart-bar":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0-1-3m1 3-1-3m-16.5-3h12.75" />
                </svg>`;
      case "heroicon-o-table-cells":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625a1.125 1.125 0 0 0 1.125-1.125m-1.125 1.125h-1.5A1.125 1.125 0 0 1 18 18.375m3.375 1.125V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75V5.625M3.375 4.5c0-.621.504-1.125 1.125-1.125M4.5 4.5h1.5" />
                </svg>`;
      case "heroicon-o-x-mark":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
                </svg>`;
      case "heroicon-o-check":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4.5 12.75 6 6 9-13.5" />
                </svg>`;
      case "heroicon-o-check-circle":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>`;
      case "heroicon-o-exclamation-triangle":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>`;
      case "heroicon-o-trash":
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>`;
      case "heroicon-o-document":
      default:
        return `<svg class="${s}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>`;
    }
  }
  formatFileSize(t) {
    if (t === 0) return "0 Bytes";
    const e = 1024, s = ["Bytes", "KB", "MB", "GB"], n = Math.floor(Math.log(t) / Math.log(e));
    return parseFloat((t / Math.pow(e, n)).toFixed(2)) + " " + s[n];
  }
  destroy() {
    this.cleanupFunctions.forEach((t) => t()), this.cleanupFunctions = [], this.filePreviewsMap.clear(), super.destroy();
  }
}
class El extends G {
  /**
   * Initialize gallery elements - required by BaseActionClass
   */
  initializeElements() {
    f.findByDataAttribute("gallery", "true").forEach((t) => {
      this.initializeGallery(t);
    });
  }
  /**
   * Initialize a single gallery element
   */
  initializeGallery(t) {
    const e = t.dataset.galleryId;
    e && (this.setState(e, {
      currentIndex: 0,
      isAutoplayActive: t.dataset.autoplay === "true",
      autoplayInterval: null,
      touchStartX: 0,
      touchEndX: 0,
      isDragging: !1
    }), this.setupGalleryEventListeners(t, e), t.dataset.autoplay === "true" && this.startAutoplay(e, t), this.updateAccessibility(t, e), this.initializeImageErrorHandling(t), this.preloadAdjacentImages(t, 0));
  }
  /**
   * Set up event listeners for gallery interactions
   */
  setupGalleryEventListeners(t, e) {
    const s = t.querySelector('[data-gallery-action="prev"]'), n = t.querySelector('[data-gallery-action="next"]');
    s && w.delegate(s, "click", () => {
      this.navigateToImage(e, t, "prev");
    }), n && w.delegate(n, "click", () => {
      this.navigateToImage(e, t, "next");
    }), t.querySelectorAll("[data-gallery-thumbnail]").forEach((o, l) => {
      w.delegate(o, "click", () => {
        this.goToImage(e, t, l);
      }), w.delegate(o, "keydown", (u) => {
        (u.key === "Enter" || u.key === " ") && (u.preventDefault(), this.goToImage(e, t, l));
      });
    });
    const a = t.querySelector('[data-gallery-action="toggle-autoplay"]');
    a && w.delegate(a, "click", () => {
      this.toggleAutoplay(e, t);
    }), w.delegate(t, "keydown", (o) => {
      this.handleKeyboardNavigation(o, e, t);
    }), this.setupTouchEvents(t, e), w.delegate(t, "mouseenter", () => {
      this.pauseAutoplayOnHover(e);
    }), w.delegate(t, "mouseleave", () => {
      this.resumeAutoplayOnHover(e, t);
    });
  }
  /**
   * Set up touch/swipe event listeners
   */
  setupTouchEvents(t, e) {
    const s = t.querySelector(".gallery-main");
    s && (w.delegate(s, "touchstart", (n) => {
      const i = this.getState(e);
      i && (i.touchStartX = n.touches[0].clientX, i.isDragging = !0, this.setState(e, i));
    }, { passive: !0 }), w.delegate(s, "touchmove", (n) => {
      const i = this.getState(e);
      i != null && i.isDragging && (i.touchEndX = n.touches[0].clientX, this.setState(e, i));
    }, { passive: !0 }), w.delegate(s, "touchend", () => {
      const n = this.getState(e);
      if (!(n != null && n.isDragging)) return;
      n.isDragging = !1;
      const i = n.touchStartX - n.touchEndX;
      Math.abs(i) > 50 && (i > 0 ? this.navigateToImage(e, t, "next") : this.navigateToImage(e, t, "prev")), this.setState(e, n);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(t, e, s) {
    var n;
    switch (t.key) {
      case "ArrowLeft":
        t.preventDefault(), this.navigateToImage(e, s, "prev");
        break;
      case "ArrowRight":
        t.preventDefault(), this.navigateToImage(e, s, "next");
        break;
      case "Home":
        t.preventDefault(), this.goToImage(e, s, 0);
        break;
      case "End":
        t.preventDefault();
        const i = parseInt(s.dataset.totalImages || "0");
        this.goToImage(e, s, i - 1);
        break;
      case "Escape":
        t.preventDefault(), (n = this.getState(e)) != null && n.isAutoplayActive && this.pauseAutoplay(e, s);
        break;
      case " ":
        t.preventDefault(), this.toggleAutoplay(e, s);
        break;
    }
  }
  /**
   * Navigate to previous or next image
   */
  navigateToImage(t, e, s) {
    const n = this.getState(t);
    if (!n) return;
    const i = parseInt(e.dataset.totalImages || "0"), a = e.dataset.loop === "true";
    let o = n.currentIndex;
    s === "next" ? (o = n.currentIndex + 1, o >= i && (o = a ? 0 : i - 1)) : (o = n.currentIndex - 1, o < 0 && (o = a ? i - 1 : 0)), this.goToImage(t, e, o);
  }
  /**
   * Go to a specific image by index
   */
  goToImage(t, e, s) {
    const n = this.getState(t);
    if (!n) return;
    const i = parseInt(e.dataset.totalImages || "0");
    s < 0 || s >= i || (n.currentIndex = s, this.setState(t, n), this.updateImageDisplay(e, s), this.updateThumbnails(e, s), this.updateCounter(e, s), this.updateImageDetails(e, s), this.updateNavigationButtons(e, s, i), this.updateAccessibility(e, t), this.announceImageChange(e, s, i), this.preloadAdjacentImages(e, s), this.emitGalleryEvent(e, "gallery:imageChanged", {
      currentIndex: s,
      galleryId: t
    }));
  }
  /**
   * Update image display
   */
  updateImageDisplay(t, e) {
    t.querySelectorAll(".gallery-slide").forEach((n, i) => {
      const a = n;
      i === e ? (a.classList.remove("opacity-0"), a.classList.add("opacity-100", "active")) : (a.classList.remove("opacity-100", "active"), a.classList.add("opacity-0"));
    });
  }
  /**
   * Update thumbnail highlighting
   */
  updateThumbnails(t, e) {
    t.querySelectorAll(".gallery-thumbnail").forEach((n, i) => {
      const a = n;
      i === e ? (a.classList.add("active", "border-brand-500"), a.classList.remove("border-transparent"), a.setAttribute("aria-current", "true")) : (a.classList.remove("active", "border-brand-500"), a.classList.add("border-transparent"), a.removeAttribute("aria-current"));
    });
  }
  /**
   * Update image counter
   */
  updateCounter(t, e) {
    const s = t.querySelector("[data-gallery-current]");
    s && (s.textContent = (e + 1).toString());
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
  updateNavigationButtons(t, e, s) {
    const n = t.querySelector('[data-gallery-action="prev"]'), i = t.querySelector('[data-gallery-action="next"]'), a = t.dataset.loop === "true";
    n && (n.disabled = !a && e === 0), i && (i.disabled = !a && e === s - 1);
  }
  /**
   * Start autoplay
   */
  startAutoplay(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const n = parseInt(e.dataset.autoplayDelay || "3000");
    s.autoplayInterval = window.setInterval(() => {
      this.navigateToImage(t, e, "next");
    }, n), s.isAutoplayActive = !0, this.setState(t, s), this.updateAutoplayButton(e, !0);
  }
  /**
   * Pause autoplay
   */
  pauseAutoplay(t, e) {
    const s = this.getState(t);
    s && (s.autoplayInterval && (clearInterval(s.autoplayInterval), s.autoplayInterval = null), s.isAutoplayActive = !1, this.setState(t, s), this.updateAutoplayButton(e, !1));
  }
  /**
   * Toggle autoplay
   */
  toggleAutoplay(t, e) {
    const s = this.getState(t);
    s && (s.isAutoplayActive ? this.pauseAutoplay(t, e) : this.startAutoplay(t, e));
  }
  /**
   * Update autoplay button icon and aria-pressed state
   */
  updateAutoplayButton(t, e) {
    const s = t.querySelector(".gallery-autoplay-toggle"), n = t.querySelector(".play-icon"), i = t.querySelector(".pause-icon");
    s && (s.setAttribute("aria-pressed", e.toString()), s.setAttribute("aria-label", e ? "Pause autoplay" : "Resume autoplay")), n && i && (e ? (n.classList.add("show"), n.classList.remove("hide"), i.classList.add("hide"), i.classList.remove("show")) : (n.classList.add("hide"), n.classList.remove("show"), i.classList.add("show"), i.classList.remove("hide")));
  }
  /**
   * Pause autoplay on hover
   */
  pauseAutoplayOnHover(t) {
    const e = this.getState(t);
    !(e != null && e.isAutoplayActive) || !e.autoplayInterval || (clearInterval(e.autoplayInterval), e.autoplayInterval = null, this.setState(t, e));
  }
  /**
   * Resume autoplay when hover ends
   */
  resumeAutoplayOnHover(t, e) {
    const s = this.getState(t);
    if (!(s != null && s.isAutoplayActive) || s.autoplayInterval) return;
    const n = parseInt(e.dataset.autoplayDelay || "3000");
    s.autoplayInterval = window.setInterval(() => {
      this.navigateToImage(t, e, "next");
    }, n), this.setState(t, s);
  }
  /**
   * Update accessibility attributes
   */
  updateAccessibility(t, e) {
    const s = this.getState(e);
    if (!s) return;
    const n = parseInt(t.dataset.totalImages || "0"), i = t.querySelector(`[data-gallery-slide="${s.currentIndex}"]`);
    i && (i.setAttribute("aria-current", "true"), i.setAttribute("aria-label", `Image ${s.currentIndex + 1} of ${n}`)), t.querySelectorAll("[data-gallery-slide]").forEach((o, l) => {
      l !== s.currentIndex && o.removeAttribute("aria-current");
    });
  }
  /**
   * Emit custom gallery events
   */
  emitGalleryEvent(t, e, s) {
    const n = new CustomEvent(e, { detail: s, bubbles: !0 });
    t.dispatchEvent(n);
  }
  /**
   * Announce image change to screen readers
   */
  announceImageChange(t, e, s) {
    const n = t.querySelector("[data-gallery-live]");
    if (n) {
      const a = t.querySelectorAll("[data-gallery-slide]")[e], o = a == null ? void 0 : a.querySelector("img"), u = `Showing ${(o == null ? void 0 : o.getAttribute("alt")) || `Image ${e + 1}`}, image ${e + 1} of ${s}`;
      n.textContent = u, setTimeout(() => {
        n.textContent === u && (n.textContent = "");
      }, 1e3);
    }
  }
  /**
   * Initialize error handling for gallery images
   */
  initializeImageErrorHandling(t) {
    t.querySelectorAll(".gallery-slide img").forEach((n) => {
      const i = n;
      i.complete || this.setImageLoadingState(i, !0), i.addEventListener("load", () => {
        this.setImageLoadingState(i, !1), this.setImageErrorState(i, !1);
      }), i.addEventListener("error", () => {
        this.setImageLoadingState(i, !1), this.setImageErrorState(i, !0), console.warn(`Failed to load gallery image: ${i.src}`);
      });
    }), t.querySelectorAll(".gallery-thumbnail img").forEach((n) => {
      const i = n;
      i.addEventListener("error", () => {
        this.setThumbnailErrorState(i, !0), console.warn(`Failed to load gallery thumbnail: ${i.src}`);
      });
    });
  }
  /**
   * Set loading state for an image
   */
  setImageLoadingState(t, e) {
    const s = t.closest(".gallery-slide");
    s && (e ? (s.classList.add("gallery-image-loading"), s.setAttribute("aria-busy", "true")) : (s.classList.remove("gallery-image-loading"), s.removeAttribute("aria-busy")));
  }
  /**
   * Set error state for an image
   */
  setImageErrorState(t, e) {
    const s = t.closest(".gallery-slide");
    if (s)
      if (e)
        s.classList.add("gallery-image-error"), s.setAttribute("aria-label", "Image failed to load"), s.querySelector(".gallery-error-placeholder") || this.createImageErrorPlaceholder(s);
      else {
        s.classList.remove("gallery-image-error"), s.removeAttribute("aria-label");
        const n = s.querySelector(".gallery-error-placeholder");
        n && n.remove();
      }
  }
  /**
   * Set error state for thumbnail images
   */
  setThumbnailErrorState(t, e) {
    const s = t.closest(".gallery-thumbnail");
    s && e && (s.classList.add("gallery-thumbnail-error"), t.style.display = "none", s.querySelector(".gallery-thumbnail-error-placeholder") || this.createThumbnailErrorPlaceholder(s));
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
    const s = parseInt(t.dataset.totalImages || "0"), n = t.dataset.loop === "true", i = [], a = e - 1;
    a >= 0 ? i.push(a) : n && s > 1 && i.push(s - 1);
    const o = e + 1;
    o < s ? i.push(o) : n && s > 1 && i.push(0), i.forEach((l) => {
      const u = t.querySelector(`[data-gallery-slide="${l}"]`);
      if (u) {
        const h = u.querySelector("img");
        if (h && h.src && !h.complete) {
          const g = new Image();
          g.src = h.src, g.onerror = () => {
            console.warn(`Failed to preload image: ${g.src}`);
          };
        }
      }
    });
  }
  /**
   * Clean up when gallery is removed
   */
  cleanup(t) {
    const e = this.getState(t);
    e != null && e.autoplayInterval && clearInterval(e.autoplayInterval), this.removeState(t);
  }
}
function xg() {
  Lr.getInstance().init(), Ir.getInstance().init(), Ke.getInstance().init(), Nr.getInstance().init(), Ye.getInstance().init(), kr.getInstance().init(), qr.getInstance().init(), Or.getInstance().init(), We.getInstance().init(), Mr.getInstance().init(), Ze.getInstance().init(), Rr.getInstance().init(), Qe.getInstance().init(), Xe.getInstance().init(), Je.getInstance().init(), ra.getInstance().init(), rs.getInstance().init(), aa.getInstance().init(), Al.getInstance().init(), El.getInstance().init();
}
const qg = {
  FormActions: Lr.getInstance(),
  AlertActions: Ir.getInstance(),
  CalendarActions: Ke.getInstance(),
  RadioActions: Nr.getInstance(),
  RangeActions: Ye.getInstance(),
  SelectActions: kr.getInstance(),
  TabsActions: qr.getInstance(),
  ModalActions: Or.getInstance(),
  ToastActions: We.getInstance(),
  DropdownActions: Mr.getInstance(),
  TableActions: Ze.getInstance(),
  ButtonGroupActions: Rr.getInstance(),
  TooltipActions: Qe.getInstance(),
  TimePickerActions: Xe.getInstance(),
  AccordionActions: Je.getInstance(),
  EditorActions: ra.getInstance(),
  DatePickerActions: rs.getInstance(),
  AddToCartActions: aa.getInstance(),
  FileUploadActions: Al.getInstance(),
  GalleryActions: El.getInstance(),
  init: xg
};
export {
  Je as AccordionActions,
  aa as AddToCartActions,
  Ir as AlertActions,
  G as BaseActionClass,
  Rr as ButtonGroupActions,
  Ke as CalendarActions,
  f as DOMUtils,
  rs as DatePickerActions,
  Mr as DropdownActions,
  ra as EditorActions,
  w as EventUtils,
  Al as FileUploadActions,
  Lr as FormActions,
  El as GalleryActions,
  Or as ModalActions,
  Nr as RadioActions,
  Ye as RangeActions,
  kr as SelectActions,
  Ze as TableActions,
  qr as TabsActions,
  Xe as TimePickerActions,
  We as ToastActions,
  Qe as TooltipActions,
  qg as default,
  xg as initializeKeysUI
};
