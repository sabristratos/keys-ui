const v = class v {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const t = this.name;
    return v.instances.has(t) || v.instances.set(t, new this()), v.instances.get(t);
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
      s.forEach((a) => {
        a.addedNodes.length > 0 && t(a.addedNodes);
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
v.instances = /* @__PURE__ */ new Map();
let y = v;
class r {
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
    const a = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelectorAll(a, s);
  }
  /**
   * Find single element with data attribute
   */
  static findFirstByDataAttribute(t, e, s) {
    const a = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelector(a, s);
  }
  /**
   * Check if element has data attribute with optional value
   */
  static hasDataAttribute(t, e, s) {
    if (!t) return !1;
    const a = t.dataset[e];
    return s !== void 0 ? a === s : a !== void 0;
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
    return e != null && e.classes && s.classList.add(...e.classes), e != null && e.attributes && Object.entries(e.attributes).forEach(([a, i]) => {
      s.setAttribute(a, i);
    }), e != null && e.textContent && (s.textContent = e.textContent), e != null && e.innerHTML && (s.innerHTML = e.innerHTML), s;
  }
}
class u {
  /**
   * Create and dispatch custom event
   */
  static dispatchCustomEvent(t, e, s, a) {
    const i = new CustomEvent(e, {
      detail: s,
      bubbles: (a == null ? void 0 : a.bubbles) ?? !0,
      cancelable: (a == null ? void 0 : a.cancelable) ?? !0
    });
    return t.dispatchEvent(i);
  }
  /**
   * Add event listener with automatic cleanup tracking
   */
  static addEventListener(t, e, s, a) {
    return t.addEventListener(e, s, a), () => {
      t.removeEventListener(e, s, a);
    };
  }
  /**
   * Handle generic events with delegation
   */
  static handleDelegatedEvent(t, e, s, a) {
    const i = a || document, n = (o) => {
      const l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(e)), d && s(d, o);
    };
    return this.addEventListener(i, t, n);
  }
  /**
   * Handle click events with delegation
   */
  static handleDelegatedClick(t, e, s) {
    const a = s || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(a, "click", i);
  }
  /**
   * Handle keydown events with delegation
   */
  static handleDelegatedKeydown(t, e, s) {
    const a = s || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(a, "keydown", i);
  }
  /**
   * Handle specific key presses
   */
  static handleKeyPress(t, e, s) {
    return (a) => {
      t.includes(a.key) && (s != null && s.preventDefault && a.preventDefault(), s != null && s.stopPropagation && a.stopPropagation(), e(a.key, a));
    };
  }
  /**
   * Handle input events with delegation
   */
  static handleDelegatedInput(t, e, s) {
    const a = s || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(a, "input", i);
  }
  /**
   * Handle change events with delegation
   */
  static handleDelegatedChange(t, e, s) {
    const a = s || document, i = (n) => {
      const o = n.target;
      let l = null;
      o instanceof Element && (l = o.closest(t)), l && e(l, n);
    };
    return this.addEventListener(a, "change", i);
  }
  /**
   * Handle focus events with delegation
   */
  static handleDelegatedFocus(t, e, s) {
    const a = s || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(a, "focusin", i);
  }
  /**
   * Create debounced event handler
   */
  static debounce(t, e) {
    let s = null;
    return (...a) => {
      s && clearTimeout(s), s = setTimeout(() => {
        t(...a);
      }, e);
    };
  }
  /**
   * Create throttled event handler
   */
  static throttle(t, e) {
    let s = !1;
    return (...a) => {
      s || (t(...a), s = !0, setTimeout(() => {
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
    const s = (a) => {
      const i = a, n = i.target;
      t.contains(n) || e(i);
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
    const a = (i) => {
      const n = i;
      if (s && !s(t)) {
        i.preventDefault();
        return;
      }
      const o = new FormData(t);
      e(o, n);
    };
    return this.addEventListener(t, "submit", a);
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
      var i, n, o, l, d, c, f, h, g, m, S;
      const { key: s } = e, a = ((i = t.preventDefault) == null ? void 0 : i.includes(s)) ?? !0;
      switch (s) {
        case "ArrowUp":
          a && e.preventDefault(), (n = t.onArrowUp) == null || n.call(t);
          break;
        case "ArrowDown":
          a && e.preventDefault(), (o = t.onArrowDown) == null || o.call(t);
          break;
        case "ArrowLeft":
          a && e.preventDefault(), (l = t.onArrowLeft) == null || l.call(t);
          break;
        case "ArrowRight":
          a && e.preventDefault(), (d = t.onArrowRight) == null || d.call(t);
          break;
        case "Enter":
          a && e.preventDefault(), (c = t.onEnter) == null || c.call(t);
          break;
        case " ":
          a && e.preventDefault(), (f = t.onSpace) == null || f.call(t);
          break;
        case "Escape":
          a && e.preventDefault(), (h = t.onEscape) == null || h.call(t);
          break;
        case "Home":
          a && e.preventDefault(), (g = t.onHome) == null || g.call(t);
          break;
        case "End":
          a && e.preventDefault(), (m = t.onEnd) == null || m.call(t);
          break;
        case "Tab":
          (S = t.onTab) == null || S.call(t);
          break;
      }
    };
  }
}
function R(b, t = "") {
  const e = window.KeysUITranslations;
  if (!e)
    return t;
  const s = b.split(".");
  let a = e;
  for (const i of s)
    if (a = a == null ? void 0 : a[i], a === void 0)
      return t;
  return a || t;
}
class k extends y {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick(".input-action", (t, e) => {
      e.preventDefault(), this.handleActionClick(t);
    }), u.handleDelegatedKeydown(".input-action", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleActionClick(t));
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(t) {
    const e = r.findClosest(t, ".input-action"), s = e == null ? void 0 : e.dataset.action;
    if (!s) return;
    const a = r.findFormElementForAction(t);
    if (a) {
      switch (s) {
        case "clear":
          this.clearValue(a);
          break;
        case "copy":
          await this.copyToClipboard(a, e);
          break;
        case "toggle-password":
          await this.togglePasswordVisibility(a, t, e);
          break;
        case "external":
          this.openExternalUrl(t.dataset.url);
          break;
        default:
          this.handleCustomAction(a, s);
          break;
      }
      this.dispatchActionEvent(a, s);
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
    const s = r.querySelector(".button-icon-default", t), a = r.querySelector(".button-icon-toggle", t), i = r.querySelector(".button-icon-success", t), n = t.dataset.iconDefault, o = t.dataset.iconToggle, l = t.dataset.iconSuccess;
    s && (s.classList.remove("opacity-100"), s.classList.add("opacity-0")), a && (a.classList.remove("opacity-100", "scale-110", "scale-90"), a.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), e === n && s ? (s.classList.remove("opacity-0"), s.classList.add("opacity-100")) : e === o && a ? (a.classList.remove("opacity-0"), a.classList.add("opacity-100")) : e === l && i && (i.classList.remove("opacity-0"), i.classList.add("opacity-100", "scale-110"));
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
    const s = r.querySelector("button", e);
    try {
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, R("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && await this.showCopySuccess(s, e);
    } catch {
      this.fallbackCopyToClipboard(t, e);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(t, e) {
    const s = r.querySelector("button", e);
    t.select(), t instanceof HTMLInputElement && t.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(t, R("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && this.showCopySuccess(s, e);
    } catch {
      this.showFeedback(t, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(t, e) {
    const s = t.dataset.iconSuccess, a = t.dataset.labelSuccess, i = t.dataset.iconDefault, n = r.querySelector(".sr-only", t);
    if (s && i)
      if (await this.swapButtonIcon(t, s), a && n) {
        const o = n.textContent;
        n.textContent = a, setTimeout(async () => {
          await this.swapButtonIcon(t, i), o && n && (n.textContent = o);
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
    var f;
    const a = t.type === "password", i = a ? "text" : "password", n = e.dataset.iconDefault, o = e.dataset.iconToggle, l = (f = r.querySelector(".sr-only", e)) == null ? void 0 : f.textContent, d = e.dataset.labelToggle;
    t.type = i;
    const c = r.querySelector(".sr-only", e);
    a ? (o && await this.swapButtonIcon(e, o), d && c && (c.textContent = d), e.setAttribute("aria-label", d || "Hide password")) : (n && await this.swapButtonIcon(e, n), l && c && (c.textContent = l), e.setAttribute("aria-label", l || "Show password"));
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
    u.dispatchCustomEvent(t, "form-action", {
      element: t,
      action: e,
      value: t.value
    });
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(t, e, s = "success") {
    const a = document.createElement("div");
    a.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${s === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, a.textContent = e;
    const i = r.findClosest(t, ".relative");
    i && (i.appendChild(a), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 2e3));
  }
  /**
   * Add a custom action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return u.addEventListener(document, "form-action", (s) => {
      const a = s;
      a.detail.action === t && e(a.detail.element);
    });
  }
  /**
   * Clean up FormActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
k.getInstance();
const M = class M {
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
    var f;
    if (this.prefersReducedMotion())
      return t.style.opacity = "1", e.scale && (t.style.transform = "scale(1)"), (f = e.onComplete) == null || f.call(e), null;
    const {
      duration: s = 300,
      easing: a = "ease-out",
      delay: i = 0,
      fill: n = "forwards",
      scale: o = !1,
      onComplete: l
    } = e, d = o ? [
      { opacity: "0", transform: "scale(0.95)" },
      { opacity: "1", transform: "scale(1)" }
    ] : [
      { opacity: "0" },
      { opacity: "1" }
    ], c = t.animate(d, {
      duration: s,
      easing: a,
      delay: i,
      fill: n
    });
    return l && c.addEventListener("finish", l, { once: !0 }), c;
  }
  /**
   * Fade out animation with optional scale transform
   */
  static fadeOut(t, e = {}) {
    var f;
    if (this.prefersReducedMotion())
      return t.style.opacity = "0", e.scale && (t.style.transform = "scale(0.95)"), (f = e.onComplete) == null || f.call(e), null;
    const {
      duration: s = 300,
      easing: a = "ease-in",
      delay: i = 0,
      fill: n = "forwards",
      scale: o = !1,
      onComplete: l
    } = e, d = o ? [
      { opacity: "1", transform: "scale(1)" },
      { opacity: "0", transform: "scale(0.95)" }
    ] : [
      { opacity: "1" },
      { opacity: "0" }
    ], c = t.animate(d, {
      duration: s,
      easing: a,
      delay: i,
      fill: n
    });
    return l && c.addEventListener("finish", l, { once: !0 }), c;
  }
  /**
   * Expand height animation (for accordions, dropdowns, etc.)
   */
  static expandHeight(t, e = {}) {
    var f;
    if (this.prefersReducedMotion())
      return t.style.height = e.toHeight === "auto" ? "" : `${e.toHeight}px`, (f = e.onComplete) == null || f.call(e), null;
    const {
      duration: s = 300,
      easing: a = "ease-out",
      fromHeight: i = 0,
      toHeight: n = "auto",
      onComplete: o
    } = e, l = i === "auto" ? t.offsetHeight : i;
    let d;
    if (n === "auto") {
      const h = t.style.height;
      t.style.height = "auto", d = t.offsetHeight, t.style.height = h;
    } else
      d = n;
    t.style.height = `${l}px`, t.style.overflow = "hidden";
    const c = t.animate([
      { height: `${l}px` },
      { height: `${d}px` }
    ], {
      duration: s,
      easing: a,
      fill: "forwards"
    });
    return c.addEventListener("finish", () => {
      n === "auto" && (t.style.height = ""), t.style.overflow = "", o == null || o();
    }, { once: !0 }), c;
  }
  /**
   * Collapse height animation
   */
  static collapseHeight(t, e = {}) {
    var d;
    if (this.prefersReducedMotion())
      return t.style.height = `${e.toHeight || 0}px`, (d = e.onComplete) == null || d.call(e), null;
    const {
      duration: s = 300,
      easing: a = "ease-out",
      toHeight: i = 0,
      onComplete: n
    } = e, o = t.offsetHeight;
    t.style.height = `${o}px`, t.style.overflow = "hidden";
    const l = t.animate([
      { height: `${o}px` },
      { height: `${i}px` }
    ], {
      duration: s,
      easing: a,
      fill: "forwards"
    });
    return l.addEventListener("finish", () => {
      i === 0 && (t.style.display = "none"), t.style.overflow = "", n == null || n();
    }, { once: !0 }), l;
  }
  /**
   * Slide in animation (for panels, tooltips, etc.)
   */
  static slideIn(t, e, s = {}) {
    var c;
    if (this.prefersReducedMotion())
      return t.style.transform = "translate(0, 0)", t.style.opacity = "1", (c = s.onComplete) == null || c.call(s), null;
    const {
      duration: a = 200,
      easing: i = "ease-out",
      distance: n = 10,
      onComplete: o
    } = s, l = {
      up: `translateY(${n}px)`,
      down: `translateY(-${n}px)`,
      left: `translateX(${n}px)`,
      right: `translateX(-${n}px)`
    }, d = t.animate([
      {
        transform: l[e],
        opacity: "0"
      },
      {
        transform: "translate(0, 0)",
        opacity: "1"
      }
    ], {
      duration: a,
      easing: i,
      fill: "forwards"
    });
    return o && d.addEventListener("finish", o, { once: !0 }), d;
  }
  /**
   * Slide out animation
   */
  static slideOut(t, e, s = {}) {
    var c;
    if (this.prefersReducedMotion())
      return t.style.opacity = "0", (c = s.onComplete) == null || c.call(s), null;
    const {
      duration: a = 200,
      easing: i = "ease-in",
      distance: n = 10,
      onComplete: o
    } = s, l = {
      up: `translateY(-${n}px)`,
      down: `translateY(${n}px)`,
      left: `translateX(-${n}px)`,
      right: `translateX(${n}px)`
    }, d = t.animate([
      {
        transform: "translate(0, 0)",
        opacity: "1"
      },
      {
        transform: l[e],
        opacity: "0"
      }
    ], {
      duration: a,
      easing: i,
      fill: "forwards"
    });
    return o && d.addEventListener("finish", o, { once: !0 }), d;
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
    const { cleanup: a, ...i } = s, n = t.animate(e, i);
    return n.addEventListener("finish", () => {
      a == null || a();
    }, { once: !0 }), n.addEventListener("cancel", () => {
      a == null || a();
    }, { once: !0 }), n;
  }
  /**
   * Create a managed timer that can be paused/resumed
   */
  static createTimer(t, e) {
    const s = ++this.timerCounter, a = {
      id: s,
      callback: t,
      delay: e,
      startTime: Date.now(),
      paused: !1
    }, i = window.setTimeout(() => {
      this.timers.delete(s), t();
    }, e);
    return a.id = i, this.timers.set(s, a), s;
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
  static applyTransitionClasses(t, e, s, a = 300) {
    t.classList.add(e), t.offsetHeight, t.classList.add(s), setTimeout(() => {
      t.classList.remove(e);
    }, a);
  }
};
M.timers = /* @__PURE__ */ new Map(), M.timerCounter = 0;
let p = M;
typeof window < "u" && (window.AnimationUtils = p);
class L extends y {
  /**
   * Initialize alert elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick("[data-dismiss-alert]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), u.handleDelegatedKeydown("[data-dismiss-alert]", (t, e) => {
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
    return r.findClosest(t, '[data-dismissible="true"]');
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(t) {
    t.classList.add("alert-dismissing"), p.slideOut(t, "right", {
      duration: 300,
      easing: "ease-out",
      distance: 100
    }), p.collapseHeight(t, {
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
    t.style.display = "block", p.slideIn(t, "right", {
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
      message: a,
      dismissible: i = !0,
      duration: n,
      container: o = document.body
    } = t, l = document.createElement("div");
    l.className = this.getAlertClasses(e), l.setAttribute("role", "alert"), i && l.setAttribute("data-dismissible", "true");
    const d = this.buildAlertContent(e, s, a, i);
    return l.innerHTML = d, o.appendChild(l), l.style.opacity = "0", l.style.transform = "translateX(100%)", setTimeout(() => {
      this.showAlert(l);
    }, 10), n && n > 0 && p.createTimer(() => {
      this.dismissAlert(l);
    }, n), this.dispatchAlertEvent(l, "create"), l;
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
  buildAlertContent(t, e, s, a) {
    const i = this.getVariantIcon(t), n = this.getVariantIconColor(t);
    return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${n}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(i)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${e ? `<div class="text-base font-medium">${e}</div>` : ""}
                    <div class="text-sm opacity-90 ${e ? "mt-1" : ""}">${s || ""}</div>
                </div>
                ${a ? `
                    <div class="ml-auto pl-3">
                        <button type="button" data-dismiss-alert class="inline-flex rounded-md p-1 ${n} hover:bg-current hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current" aria-label="Dismiss">
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
    u.dispatchCustomEvent(t, "alert-action", {
      alert: t,
      action: e
    }), u.dispatchCustomEvent(document.body, "alert-action", {
      alert: t,
      action: e
    });
  }
  /**
   * Add a custom alert action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return u.addEventListener(document, "alert-action", (s) => {
      const a = s;
      a.detail.action === t && e(a.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(t) {
    r.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((s) => {
      this.dismissAlert(s);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    r.querySelectorAll('[data-dismissible="true"]').forEach((e) => {
      this.dismissAlert(e);
    });
  }
  /**
   * Clean up AlertActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
L.getInstance();
class w extends y {
  /**
   * Initialize calendar elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("calendar", "true").forEach((t) => {
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
    let a;
    try {
      a = e ? JSON.parse(e) : {};
    } catch (n) {
      console.error("Failed to parse calendar data:", n), a = {};
    }
    const i = {
      currentMonth: a.currentMonth || this.getCurrentYearMonth(),
      selectedDate: a.selectedDate || null,
      startDate: a.startDate || null,
      endDate: a.endDate || null,
      focusedDate: a.selectedDate || a.startDate || this.getTodayDate(),
      isRange: a.isRange || !1,
      monthsToShow: a.monthsToShow || 1,
      rangeSelectionState: "none",
      isDisabled: s,
      minDate: a.minDate || null,
      maxDate: a.maxDate || null,
      disabledDates: a.disabledDates || [],
      weekdays: a.weekdays || ["S", "M", "T", "W", "T", "F", "S"],
      monthNames: a.monthNames || [
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
    u.handleDelegatedClick("[data-calendar-date]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const s = r.findClosest(t, '[data-calendar="true"]');
        s && !this.isCalendarDisabled(s) && this.selectDate(s, t.dataset.calendarDate);
      }
    }), u.handleDelegatedClick("[data-calendar-nav]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const s = r.findClosest(t, '[data-calendar="true"]'), a = t.dataset.calendarNav;
        s && !this.isCalendarDisabled(s) && this.navigateMonth(s, a);
      }
    }), u.handleDelegatedClick("[data-calendar-month-year-btn]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const s = r.findClosest(t, '[data-calendar="true"]');
        s && !this.isCalendarDisabled(s) && this.toggleMonthYearDropdown(s);
      }
    }), u.handleDelegatedClick("[data-calendar-month]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-calendar="true"]'), a = parseInt(t.dataset.calendarMonth);
      s && !this.isCalendarDisabled(s) && this.selectMonth(s, a);
    }), u.handleDelegatedClick("[data-calendar-year]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-calendar="true"]'), a = parseInt(t.dataset.calendarYear);
      s && !this.isCalendarDisabled(s) && this.selectYear(s, a);
    }), u.handleDelegatedKeydown('[data-calendar="true"]', (t, e) => {
      if (e.key === "Escape") {
        const s = this.getState(t);
        if (s && s.viewMode !== "calendar") {
          e.preventDefault(), s.viewMode = "calendar", this.setState(t, s), this.renderCalendarGrid(t);
          const a = r.querySelector("[data-calendar-month-year-btn]", t);
          a && a.focus();
          return;
        }
      }
      this.handleKeydown(t, e);
    }), u.handleDelegatedFocus("[data-calendar-date]", (t) => {
      const e = r.findClosest(t, '[data-calendar="true"]');
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
          r.hasDataAttribute(s, "calendar", "true") && this.initializeCalendar(s), r.findByDataAttribute("calendar", "true", s).forEach((a) => {
            this.initializeCalendar(a);
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
    const a = new Date(e);
    if (s.rangeSelectionState === "none" || s.rangeSelectionState === "selecting-start")
      s.startDate = e, s.endDate = null, s.rangeSelectionState = "selecting-end", s.focusedDate = e;
    else if (s.rangeSelectionState === "selecting-end") {
      const i = new Date(s.startDate);
      a < i ? (s.endDate = s.startDate, s.startDate = e) : s.endDate = e, s.rangeSelectionState = "none", s.focusedDate = e;
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
    const a = new Date(t), i = new Date(e), n = new Date(s);
    return a >= i && a <= n;
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
    const [a, i] = s.currentMonth.split("-").map(Number), n = new Date(a, i - 1, 1);
    e === "prev" ? n.setMonth(n.getMonth() - 1) : n.setMonth(n.getMonth() + 1);
    const o = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
    s.currentMonth = o, this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: o,
      year: n.getFullYear(),
      month: n.getMonth() + 1
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.getState(t);
    if (!s || s.isDisabled) return;
    const a = s.focusedDate;
    if (!a) return;
    let i = null;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault(), i = this.addDaysToDate(a, -1);
        break;
      case "ArrowRight":
        e.preventDefault(), i = this.addDaysToDate(a, 1);
        break;
      case "ArrowUp":
        e.preventDefault(), i = this.addDaysToDate(a, -7);
        break;
      case "ArrowDown":
        e.preventDefault(), i = this.addDaysToDate(a, 7);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.selectDate(t, a);
        return;
      case "Home":
        e.preventDefault(), i = this.getFirstDayOfMonth(a);
        break;
      case "End":
        e.preventDefault(), i = this.getLastDayOfMonth(a);
        break;
      case "PageUp":
        e.preventDefault(), i = this.addMonthsToDate(a, e.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        e.preventDefault(), i = this.addMonthsToDate(a, e.shiftKey ? 12 : 1);
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
    const [s, a] = e.currentMonth.split("-").map(Number), i = new Date(s, a - 1, 1), n = new Date(s, a, 0), o = new Date(i);
    o.setDate(o.getDate() - o.getDay());
    const l = new Date(n);
    l.setDate(l.getDate() + (6 - l.getDay()));
    const d = [], c = new Date(o);
    for (; c <= l; ) {
      const h = this.formatDateString(c), g = c.getMonth() === a - 1 && c.getFullYear() === s, m = {
        date: h,
        day: c.getDate(),
        isCurrentMonth: g,
        isToday: this.isToday(h),
        isSelected: h === e.selectedDate,
        isDisabled: this.isDateDisabled(t, c)
      };
      e.isRange && (m.isInRange = this.isDateInRange(h, e.startDate, e.endDate), m.isRangeStart = this.isDateRangeStart(h, e.startDate), m.isRangeEnd = this.isDateRangeEnd(h, e.endDate), m.isSelected = m.isRangeStart || m.isRangeEnd), d.push(m), c.setDate(c.getDate() + 1);
    }
    const f = [];
    for (let h = 0; h < d.length; h += 7)
      f.push(d.slice(h, h + 7));
    return f;
  }
  /**
   * Check if a date is disabled
   */
  isDateDisabled(t, e) {
    const s = this.getState(t);
    if (!s || s.isDisabled) return !0;
    const a = this.formatDateString(e);
    return s.minDate && a < s.minDate || s.maxDate && a > s.maxDate ? !0 : s.disabledDates.includes(a);
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
    const s = r.querySelector("[data-calendar-grid-container]", t);
    if (!s) return;
    const a = this.generateCalendarGrid(t);
    let i = '<table class="w-full" role="grid" aria-label="Calendar">';
    i += '<thead><tr role="row">', e.weekdays.forEach((n) => {
      const l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(n)];
      i += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${l}">${n}</th>`;
    }), i += "</tr></thead>", i += "<tbody>", a.forEach((n) => {
      i += '<tr role="row">', n.forEach((o) => {
        const l = this.getDayButtonClasses(o), d = this.getDateAriaLabel(o.date, o.isToday, o.isSelected, o.isRangeStart, o.isRangeEnd, o.isInRange), c = this.getRangeAttributes(o, e);
        i += `
                    <td class="calendar-day text-center relative" role="gridcell">
                        <button type="button"
                                class="${l}"
                                data-calendar-date="${o.date}"
                                data-is-current-month="${o.isCurrentMonth}"
                                ${o.isDisabled ? "disabled" : ""}
                                aria-selected="${o.isSelected}"
                                aria-label="${d}"
                                data-is-today="${o.isToday}"
                                ${c}>
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
    return t.isCurrentMonth ? t.isDisabled ? e += " text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50" : t.isSelected ? e += " bg-brand text-foreground-brand font-semibold" : t.isToday ? e += " bg-brand/10 text-brand font-semibold border border-brand/20" : e += " text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800" : e += " text-neutral-400 dark:text-neutral-600", e;
  }
  /**
   * Get ARIA label for a date
   */
  getDateAriaLabel(t, e, s) {
    let n = new Date(t).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return e && (n += " (Today)"), s && (n += " (Selected)"), n;
  }
  /**
   * Update month/year display
   */
  updateMonthYearDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const [s, a] = e.currentMonth.split("-").map(Number), n = `${e.monthNames[a - 1]} ${s}`, o = r.querySelector(".calendar-month-year-display", t);
    o && (o.textContent = n);
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
    const s = r.querySelector("[data-calendar-grid-container]", t);
    if (!s) return;
    const [a, i] = e.currentMonth.split("-").map(Number);
    let n = '<div class="month-grid grid grid-cols-3 gap-1 p-2">';
    e.monthNames.forEach((o, l) => {
      const d = l + 1, c = d === i, f = this.isMonthDisabled(t, a, d);
      n += `
                <button type="button"
                        class="month-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${c ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${f ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-month="${d}"
                        ${f ? "disabled" : ""}>
                    ${o}
                </button>
            `;
    }), n += "</div>", this.animateViewTransition(s, n);
  }
  /**
   * Render year selection grid
   */
  renderYearGrid(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelector("[data-calendar-grid-container]", t);
    if (!s) return;
    const [a] = e.currentMonth.split("-").map(Number), i = a - 10, n = a + 10;
    let o = '<div class="year-grid grid grid-cols-4 gap-1 p-2 max-h-64 overflow-y-auto">';
    for (let l = i; l <= n; l++) {
      const d = l === a, c = this.isYearDisabled(t, l);
      o += `
                <button type="button"
                        class="year-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${d ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${c ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-year="${l}"
                        ${c ? "disabled" : ""}>
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
    const [a] = s.currentMonth.split("-").map(Number), i = `${a}-${String(e).padStart(2, "0")}`;
    s.currentMonth = i, s.viewMode = "calendar", this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: i,
      year: a,
      month: e
    });
  }
  /**
   * Select a year
   */
  selectYear(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const [, a] = s.currentMonth.split("-").map(Number), i = `${e}-${String(a).padStart(2, "0")}`;
    s.currentMonth = i, s.viewMode = "calendar", this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: i,
      year: e,
      month: a
    });
  }
  /**
   * Check if a month is disabled
   */
  isMonthDisabled(t, e, s) {
    const a = this.getState(t);
    if (!a) return !1;
    const i = `${e}-${String(s).padStart(2, "0")}-01`, n = new Date(e, s, 0).getDate(), o = `${e}-${String(s).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    return !!(a.minDate && o < a.minDate || a.maxDate && i > a.maxDate);
  }
  /**
   * Check if a year is disabled
   */
  isYearDisabled(t, e) {
    const s = this.getState(t);
    if (!s) return !1;
    const a = `${e}-01-01`, i = `${e}-12-31`;
    return !!(s.minDate && i < s.minDate || s.maxDate && a > s.maxDate);
  }
  /**
   * Focus a specific date
   */
  focusDate(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const [a, i] = e.split("-").map(Number), [n, o] = s.currentMonth.split("-").map(Number);
    if (a !== n || i !== o) {
      const l = `${a}-${String(i).padStart(2, "0")}`;
      s.currentMonth = l, this.setState(t, s), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
        currentMonth: l,
        year: a,
        month: i
      });
    }
    s.focusedDate = e, this.setState(t, s), p.createTimer(() => {
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
   * Update hidden form input
   */
  updateHiddenInput(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelector(".calendar-hidden-input", t);
    s && (s.value = e.selectedDate || "");
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
    t.style.opacity = "0.7", t.style.transform = "scale(0.98)", p.createTimer(() => {
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
    u.dispatchCustomEvent(t, e, {
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
    const s = r.querySelectorAll("[data-calendar-grid-container]", t);
    if (s.length === 0) return;
    const a = /* @__PURE__ */ new Date(e.currentMonth + "-01");
    s.forEach((i, n) => {
      const o = new Date(a);
      o.setMonth(a.getMonth() + n);
      const l = {
        ...e,
        currentMonth: `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`
      }, d = this.generateCalendarGridForMonth(t, l);
      let c = `<div class="calendar-month-header">${e.monthNames[o.getMonth()]} ${o.getFullYear()}</div>`;
      c += '<table class="w-full" role="grid" aria-label="Calendar">', c += '<thead><tr role="row">', e.weekdays.forEach((f) => {
        const g = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(f)];
        c += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${g}">${f}</th>`;
      }), c += "</tr></thead>", c += "<tbody>", d.forEach((f) => {
        c += '<tr role="row">', f.forEach((h) => {
          const g = this.getDayButtonClasses(h), m = this.getDateAriaLabel(h.date, h.isToday, h.isSelected, h.isRangeStart, h.isRangeEnd, h.isInRange), S = this.getRangeAttributes(h, e);
          c += `
                        <td class="calendar-day text-center relative" role="gridcell">
                            <button type="button"
                                    class="${g}"
                                    data-calendar-date="${h.date}"
                                    data-is-current-month="${h.isCurrentMonth}"
                                    ${h.isDisabled ? "disabled" : ""}
                                    aria-selected="${h.isSelected}"
                                    aria-label="${m}"
                                    data-is-today="${h.isToday}"
                                    ${S}>
                                ${h.day}
                            </button>
                        </td>
                    `;
        }), c += "</tr>";
      }), c += "</tbody></table>", i.innerHTML = c;
    });
  }
  /**
   * Generate calendar grid for a specific month
   */
  generateCalendarGridForMonth(t, e) {
    const s = this.getState(t);
    if (!s) return [];
    this.setState(t, { ...s, currentMonth: e.currentMonth });
    const a = this.generateCalendarGrid(t);
    return this.setState(t, s), a;
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
   * Update aria label to include range information
   */
  getDateAriaLabel(t, e, s, a, i, n) {
    let o = this.formatDateForDisplay(t);
    return e && (o += ", Today"), s ? o += ", Selected" : a ? o += ", Range start" : i ? o += ", Range end" : n && (o += ", In selected range"), o;
  }
  /**
   * Update hidden input for range selection
   */
  updateHiddenInput(t) {
    const e = this.getState(t);
    if (e)
      if (e.isRange) {
        const s = r.querySelector(".calendar-start-input", t), a = r.querySelector(".calendar-end-input", t), i = r.querySelector(".calendar-range-input", t);
        if (s && (s.value = e.startDate || ""), a && (a.value = e.endDate || ""), i) {
          const n = e.startDate && e.endDate ? `${e.startDate},${e.endDate}` : e.startDate || "";
          i.value = n;
        }
      } else {
        const s = r.querySelector(".calendar-hidden-input", t);
        s && (s.value = e.selectedDate || "");
      }
  }
  /**
   * Clean up CalendarActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  w.getInstance().init();
}) : w.getInstance().init();
window.CalendarActions = w;
w.getInstance();
class I extends y {
  /**
   * Initialize radio elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick("label[for]", (t) => {
      const e = t.getAttribute("for");
      if (!e) return;
      const s = r.getElementById(e);
      !s || s.type !== "radio" || this.focusRadioInput(s);
    }), u.handleDelegatedKeydown('input[type="radio"]', (t, e) => {
      u.createNavigationHandler({
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
    r.focus(t, 0), this.dispatchFocusEvent(t);
  }
  /**
   * Focus the next radio in the same group
   */
  focusNextRadio(t) {
    const e = this.getRadioGroup(t), a = (e.indexOf(t) + 1) % e.length, i = e[a];
    i && (i.focus(), i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(i));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(t) {
    const e = this.getRadioGroup(t), s = e.indexOf(t), a = s === 0 ? e.length - 1 : s - 1, i = e[a];
    i && (i.focus(), i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(i));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(t) {
    const e = t.name;
    return e ? Array.from(r.querySelectorAll(`input[type="radio"][name="${e}"]`)).filter((a) => !a.disabled) : [t];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(t) {
    u.dispatchCustomEvent(t, "radio-focus", {
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
    return u.addEventListener(document, "radio-focus", (e) => {
      t(e.detail.radio);
    });
  }
  /**
   * Clean up RadioActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
I.getInstance();
class D extends y {
  /**
   * Initialize range elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("range", "true").forEach((t) => {
      this.initializeRange(t);
    });
  }
  /**
   * Initialize a single range component
   */
  initializeRange(t) {
    var n, o, l;
    if (this.hasState(t))
      return;
    const e = r.querySelector(".range-track", t);
    if (!e) return;
    const s = {
      min: parseFloat(e.dataset.min || "0"),
      max: parseFloat(e.dataset.max || "100"),
      step: parseFloat(e.dataset.step || "1"),
      dual: e.dataset.dual === "true",
      ticks: e.dataset.ticks ? JSON.parse(e.dataset.ticks) : [],
      disabled: e.dataset.disabled === "true"
    }, a = this.getElements(t, s);
    if (!a.track) return;
    const i = {
      minValue: s.dual ? parseFloat(((n = a.inputs.min) == null ? void 0 : n.value) || s.min.toString()) : s.min,
      maxValue: s.dual ? parseFloat(((o = a.inputs.max) == null ? void 0 : o.value) || s.max.toString()) : s.max,
      singleValue: s.dual ? s.min : parseFloat(((l = a.inputs.single) == null ? void 0 : l.value) || s.min.toString()),
      isDragging: !1,
      activeHandle: null
    };
    this.setState(t, { config: s, state: i, elements: a }), s.disabled || this.setupHandleInteractions(t, a);
  }
  /**
   * Get all relevant elements for a range component
   */
  getElements(t, e) {
    const s = r.querySelector(".range-track", t), a = r.querySelector(".range-fill", t), i = {}, n = {}, o = {}, l = {};
    return e.dual ? (i.min = r.querySelector('[data-handle="min"]', t), i.max = r.querySelector('[data-handle="max"]', t), n.min = r.querySelector('[data-native-input="min"]', t), n.max = r.querySelector('[data-native-input="max"]', t), o.min = r.querySelector('[data-range-input="min"]', t), o.max = r.querySelector('[data-range-input="max"]', t), l.min = r.querySelector('[data-value-display="min"]', t), l.max = r.querySelector('[data-value-display="max"]', t)) : (i.single = r.querySelector('[data-handle="single"]', t), n.single = r.querySelector('[data-native-input="single"]', t), o.single = r.querySelector('[data-range-input="single"]', t), l.single = r.querySelector('[data-value-display="single"]', t)), {
      container: t,
      track: s,
      fill: a,
      handles: i,
      inputs: n,
      hiddenInputs: o,
      valueDisplays: l
    };
  }
  /**
   * Set up handle interactions (mouse, touch, keyboard)
   */
  setupHandleInteractions(t, e) {
    const { handles: s } = e;
    Object.entries(s).forEach(([a, i]) => {
      i && (i.addEventListener("mousedown", (n) => this.handleStart(n, t, a)), i.addEventListener("touchstart", (n) => this.handleStart(n, t, a), { passive: !1 }), i.addEventListener("keydown", (n) => this.handleKeydown(n, t, a)), i.addEventListener("focus", () => this.handleFocus(t, a)), i.addEventListener("blur", () => this.handleBlur(t, a)));
    }), e.track.addEventListener("click", (a) => this.handleTrackClick(a, t));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.addEventListener(document, "mousemove", (t) => this.handleMove(t)), u.addEventListener(document, "mouseup", (t) => this.handleEnd(t)), u.addEventListener(document, "touchmove", (t) => this.handleMove(t), { passive: !1 }), u.addEventListener(document, "touchend", (t) => this.handleEnd(t)), u.addEventListener(document, "touchcancel", (t) => this.handleEnd(t));
  }
  /**
   * Setup dynamic observer for new ranges - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const s = e;
          r.hasDataAttribute(s, "range", "true") && this.initializeRange(s), r.findByDataAttribute("range", "true", s).forEach((a) => {
            this.initializeRange(a);
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
    const a = this.getState(e);
    if (!a || a.config.disabled) return;
    a.state.isDragging = !0, a.state.activeHandle = s;
    const i = a.elements.handles[s];
    i && (i.classList.add("dragging"), i.focus()), e.classList.add("dragging"), document.body.style.userSelect = "none";
  }
  /**
   * Handle drag move
   */
  handleMove(t) {
    const e = Array.from(this.getAllStates().entries()).find(([h, g]) => g.state.isDragging);
    if (!e) return;
    t.preventDefault();
    const [s, a] = e, { config: i, state: n, elements: o } = a, l = "touches" in t ? t.touches[0].clientX : t.clientX, d = o.track.getBoundingClientRect(), c = Math.max(0, Math.min(1, (l - d.left) / d.width));
    let f = this.percentageToValue(c, i);
    f = this.snapToTickIfNeeded(f, i), this.updateValue(s, n.activeHandle, f);
  }
  /**
   * Handle drag end
   */
  handleEnd(t) {
    const e = Array.from(this.getAllStates().entries()).find(([n, o]) => o.state.isDragging);
    if (!e) return;
    const [s, a] = e;
    a.state.isDragging = !1;
    const i = a.elements.handles[a.state.activeHandle];
    i && i.classList.remove("dragging"), s.classList.remove("dragging"), a.state.activeHandle = null, document.body.style.userSelect = "", this.dispatchChangeEvent(s);
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e, s) {
    const a = this.getState(e);
    if (!a || a.config.disabled) return;
    const { config: i, state: n } = a;
    let o = !1, l;
    const d = s === "min" ? n.minValue : s === "max" ? n.maxValue : n.singleValue;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowDown":
        l = Math.max(i.min, d - i.step), o = !0;
        break;
      case "ArrowRight":
      case "ArrowUp":
        l = Math.min(i.max, d + i.step), o = !0;
        break;
      case "PageDown":
        l = Math.max(i.min, d - i.step * 10), o = !0;
        break;
      case "PageUp":
        l = Math.min(i.max, d + i.step * 10), o = !0;
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
    const { config: a, state: i } = s, n = s.elements.track.getBoundingClientRect(), o = (t.clientX - n.left) / n.width;
    let l = this.percentageToValue(o, a);
    if (l = this.snapToTickIfNeeded(l, a), a.dual) {
      const d = Math.abs(l - i.minValue), c = Math.abs(l - i.maxValue), f = d <= c ? "min" : "max";
      this.updateValue(e, f, l);
    } else
      this.updateValue(e, "single", l);
    this.dispatchChangeEvent(e);
  }
  /**
   * Update a handle's value and visual position
   */
  updateValue(t, e, s) {
    const a = this.getState(t);
    if (!a) return;
    const { config: i, state: n, elements: o } = a;
    i.dual ? e === "min" ? (s = Math.min(s, n.maxValue), n.minValue = s) : e === "max" && (s = Math.max(s, n.minValue), n.maxValue = s) : n.singleValue = s, this.updateVisualElements(t), this.updateFormInputs(t), this.dispatchInputEvent(t);
  }
  /**
   * Update visual elements (handles, fill, value displays)
   */
  updateVisualElements(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: a, elements: i } = e;
    if (s.dual) {
      const n = this.valueToPercentage(a.minValue, s), o = this.valueToPercentage(a.maxValue, s);
      i.handles.min && (i.handles.min.style.left = `${n}%`, i.handles.min.setAttribute("aria-valuenow", a.minValue.toString()), i.handles.min.setAttribute("aria-valuetext", a.minValue.toString())), i.handles.max && (i.handles.max.style.left = `${o}%`, i.handles.max.setAttribute("aria-valuenow", a.maxValue.toString()), i.handles.max.setAttribute("aria-valuetext", a.maxValue.toString())), i.fill.style.left = `${n}%`, i.fill.style.width = `${o - n}%`, i.valueDisplays.min && (i.valueDisplays.min.textContent = a.minValue.toString()), i.valueDisplays.max && (i.valueDisplays.max.textContent = a.maxValue.toString());
    } else {
      const n = this.valueToPercentage(a.singleValue, s);
      i.handles.single && (i.handles.single.style.left = `${n}%`, i.handles.single.setAttribute("aria-valuenow", a.singleValue.toString()), i.handles.single.setAttribute("aria-valuetext", a.singleValue.toString())), i.fill.style.width = `${n}%`, i.valueDisplays.single && (i.valueDisplays.single.textContent = a.singleValue.toString());
    }
  }
  /**
   * Update form inputs for submission
   */
  updateFormInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: a, elements: i } = e;
    s.dual ? (i.inputs.min && (i.inputs.min.value = a.minValue.toString()), i.inputs.max && (i.inputs.max.value = a.maxValue.toString()), i.hiddenInputs.min && (i.hiddenInputs.min.value = a.minValue.toString()), i.hiddenInputs.max && (i.hiddenInputs.max.value = a.maxValue.toString())) : (i.inputs.single && (i.inputs.single.value = a.singleValue.toString()), i.hiddenInputs.single && (i.hiddenInputs.single.value = a.singleValue.toString()));
  }
  /**
   * Convert percentage to value
   */
  percentageToValue(t, e) {
    const s = e.max - e.min;
    let a = e.min + t * s;
    return a = Math.round(a / e.step) * e.step, Math.max(e.min, Math.min(e.max, a));
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
    let s = e.ticks[0], a = Math.abs(t - s);
    for (const i of e.ticks) {
      const n = Math.abs(t - i);
      n < a && (s = i, a = n);
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
    var n, o, l;
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: a } = e, i = s.dual ? [a.minValue, a.maxValue] : a.singleValue;
    u.dispatchCustomEvent(t, "range-input", {
      value: i,
      dual: s.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), s.dual ? ((n = e.elements.hiddenInputs.min) == null || n.dispatchEvent(new Event("input", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("input", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  /**
   * Dispatch change event when interaction is complete
   */
  dispatchChangeEvent(t) {
    var n, o, l;
    const e = this.getState(t);
    if (!e) return;
    const { config: s, state: a } = e, i = s.dual ? [a.minValue, a.maxValue] : a.singleValue;
    u.dispatchCustomEvent(t, "range-change", {
      value: i,
      dual: s.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), s.dual ? ((n = e.elements.hiddenInputs.min) == null || n.dispatchEvent(new Event("change", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("change", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Get current value for a range component
   */
  getValue(t) {
    const e = this.getState(t);
    if (!e) return null;
    const { config: s, state: a } = e;
    return s.dual ? [a.minValue, a.maxValue] : a.singleValue;
  }
  /**
   * Set value for a range component
   */
  setValue(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const { config: a } = s;
    a.dual && Array.isArray(e) ? (this.updateValue(t, "min", e[0]), this.updateValue(t, "max", e[1])) : !a.dual && typeof e == "number" && this.updateValue(t, "single", e), this.dispatchChangeEvent(t);
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
  D.getInstance().init();
}) : D.getInstance().init();
window.RangeActions = D;
D.getInstance();
class O extends y {
  /**
   * Initialize select elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("select", "true").forEach((t) => {
      this.initializeSelect(t);
    });
  }
  /**
   * Initialize a single select element
   */
  initializeSelect(t) {
    const e = t.dataset.multiple === "true", s = t.dataset.value;
    let a = [];
    if (s)
      try {
        a = e ? JSON.parse(s) : [s];
      } catch {
        a = e ? [] : [s];
      }
    const i = {
      isOpen: !1,
      selectedValues: a,
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
    u.handleDelegatedClick("[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]", (t, e) => {
      if (t.matches("[data-remove-chip]")) {
        e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
        const s = t.dataset.removeChip, a = r.findClosest(t, '[data-select="true"]');
        a && s && this.removeChip(a, s);
        return;
      }
      if (t.matches("[data-select-clear]")) {
        e.preventDefault(), e.stopPropagation();
        const s = r.findClosest(t, '[data-select="true"]');
        s && this.clearSelection(s);
        return;
      }
      if (t.matches("[data-select-option]")) {
        e.preventDefault(), e.stopPropagation();
        const s = r.findClosest(t, '[data-select="true"]');
        s && this.selectOption(s, t);
        return;
      }
      if (t.matches("[data-select-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const s = r.findClosest(t, '[data-select="true"]');
        s && !this.isDisabled(s) && this.toggleDropdown(s);
        return;
      }
      if (t.matches("[data-select-search]")) {
        e.stopPropagation();
        return;
      }
    }), u.addEventListener(document, "click", (t) => {
      var s;
      const e = t.target;
      if (e && e instanceof Element) {
        const a = (s = e.closest("[data-select-search]")) == null ? void 0 : s.parentElement;
        if (a && r.querySelector("[data-select-search]", a)) {
          t.stopPropagation();
          return;
        }
        e.closest("[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]") || this.closeAllDropdowns();
      }
    }), u.handleDelegatedInput("[data-select-search]", (t, e) => {
      const s = r.findClosest(t, '[data-select="true"]');
      s && this.handleSearch(s, t.value);
    }), u.handleDelegatedKeydown('[data-select="true"]', (t, e) => {
      this.handleKeydown(t, e);
    }), u.handleDelegatedFocus('[data-select="true"]', (t, e) => {
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
          r.hasDataAttribute(s, "select", "true") && (this.hasState(s) || this.initializeSelect(s)), r.findByDataAttribute("select", "true", s).forEach((i) => {
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
    const s = r.querySelector("[data-select-dropdown]", t), a = r.querySelector("[data-select-trigger]", t), i = r.querySelector("[data-select-search]", t);
    if (s && (s.classList.remove("hidden"), this.positionDropdown(t)), a) {
      a.setAttribute("aria-expanded", "true");
      const n = r.querySelector(".select-arrow", a);
      n && n.classList.add("rotate-180");
    }
    i && t.dataset.searchable === "true" && p.createTimer(() => i.focus(), 10), this.updateFilteredOptions(t), this.dispatchSelectEvent(t, "select:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    e.isOpen = !1, e.searchTerm = "", e.focusedIndex = -1, this.setState(t, e);
    const s = r.querySelector("[data-select-dropdown]", t), a = r.querySelector("[data-select-trigger]", t), i = r.querySelector("[data-select-search]", t);
    if (s && s.classList.add("hidden"), a) {
      a.setAttribute("aria-expanded", "false");
      const n = r.querySelector(".select-arrow", a);
      n && n.classList.remove("rotate-180");
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
    const s = this.getState(t), a = e.dataset.value;
    if (!s || !a || e.getAttribute("aria-disabled") === "true")
      return;
    const i = t.dataset.multiple === "true";
    if (i) {
      const n = s.selectedValues.indexOf(a);
      n > -1 ? s.selectedValues.splice(n, 1) : s.selectedValues.push(a);
    } else
      s.selectedValues = [a], this.closeDropdown(t);
    this.setState(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: i ? s.selectedValues : a,
      selectedValues: s.selectedValues
    });
  }
  /**
   * Remove chip (for multiple selection)
   */
  removeChip(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const a = s.selectedValues.indexOf(e);
    a > -1 && (s.selectedValues.splice(a, 1), this.setState(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
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
      (a) => a.searchableText.includes(e.searchTerm)
    ) : e.filteredOptions = s, this.setState(t, e);
  }
  /**
   * Update options visibility based on filter
   */
  updateOptionsVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelectorAll("[data-select-option]", t), a = r.querySelector("[data-select-no-results]", t);
    let i = 0;
    s.forEach((n) => {
      const o = n, l = o.dataset.value || "";
      e.filteredOptions.some((c) => c.value === l) ? (o.style.display = "", i++) : o.style.display = "none";
    }), a && (i === 0 && e.searchTerm ? a.classList.remove("hidden") : a.classList.add("hidden"));
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
            const a = s.filteredOptions[s.focusedIndex];
            a && this.selectOption(t, a.element);
          }
          break;
        case "Escape":
          if (s.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const a = r.querySelector("[data-select-trigger]", t);
            a && a.focus();
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
    const a = s.filteredOptions.length;
    a !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = e > 0 ? 0 : a - 1 : (s.focusedIndex += e, s.focusedIndex >= a ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = a - 1)), this.setState(t, s), this.updateOptionFocus(t));
  }
  /**
   * Update visual focus state of options
   */
  updateOptionFocus(t) {
    const e = this.getState(t);
    if (!e) return;
    r.querySelectorAll("[data-select-option]", t).forEach((a, i) => {
      const n = a;
      i === e.focusedIndex ? (n.classList.add("bg-neutral-100", "dark:bg-neutral-800"), n.scrollIntoView({ block: "nearest" })) : n.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
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
    const s = r.querySelector("[data-select-chips]", t);
    if (s)
      if (s.innerHTML = "", e.selectedValues.length === 0) {
        const a = t.dataset.placeholder || "Select options...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${a}</span>`;
      } else
        e.selectedValues.forEach((a) => {
          const i = this.findOptionByValue(t, a), n = i ? i.displayLabel : a, o = t.dataset.clearable === "true" && !this.isDisabled(t), l = `select-chip-${this.generateChipId(a)}`, d = document.createElement("button");
          d.type = "button", d.className = "inline-flex items-center gap-1 font-medium cursor-pointer transition-colors px-1.5 py-0.5 text-xs rounded-sm", d.style.cssText = `
                    background-color: var(--color-brand-50);
                    color: var(--color-brand-700);
                    border: 1px solid var(--color-brand-200);
                `, d.setAttribute("data-chip-value", a), d.setAttribute("data-remove-chip", a), d.setAttribute("data-dismiss-target", `#${l}`), d.setAttribute("aria-label", "Remove badge"), d.id = l, d.addEventListener("mouseenter", () => {
            d.style.backgroundColor = "var(--color-brand-100)";
          }), d.addEventListener("mouseleave", () => {
            d.style.backgroundColor = "var(--color-brand-50)";
          });
          const c = document.createElement("span");
          if (c.textContent = n, d.appendChild(c), o) {
            const f = document.createElement("span");
            f.className = "text-brand-600 hover:text-brand-700 ml-1 flex-shrink-0 font-bold leading-none", f.textContent = "×", f.setAttribute("aria-hidden", "true"), d.appendChild(f);
            const h = document.createElement("span");
            h.className = "sr-only", h.textContent = "Remove badge", d.appendChild(h);
          }
          s.appendChild(d);
        });
  }
  /**
   * Update single value display
   */
  updateSingleValueDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelector(".select-value", t);
    if (s)
      if (e.selectedValues.length === 0) {
        const a = t.dataset.placeholder || "Select option...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${a}</span>`;
      } else {
        const a = e.selectedValues[0], i = this.findOptionByValue(t, a), n = i ? i.displayLabel : a;
        s.textContent = n;
      }
  }
  /**
   * Update hidden form inputs
   */
  updateHiddenInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = t.dataset.multiple === "true", a = t.dataset.name;
    if (!a) return;
    if (r.querySelectorAll(".select-hidden-input", t).forEach((n) => n.remove()), s)
      e.selectedValues.forEach((n) => {
        const o = document.createElement("input");
        o.type = "hidden", o.name = `${a}[]`, o.value = n, o.className = "select-hidden-input", t.appendChild(o);
      });
    else {
      const n = document.createElement("input");
      n.type = "hidden", n.name = a, n.value = e.selectedValues[0] || "", n.className = "select-hidden-input", t.appendChild(n);
    }
  }
  /**
   * Update options selected state attributes
   */
  updateOptionsSelectedState(t) {
    const e = this.getState(t);
    if (!e) return;
    r.querySelectorAll("[data-select-option]", t).forEach((a) => {
      var l, d, c, f;
      const i = a, n = i.dataset.value || "", o = e.selectedValues.includes(n);
      if (i.setAttribute("aria-selected", o ? "true" : "false"), o) {
        i.classList.add("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const h = r.querySelector(".text-brand-600", i);
        h && ((l = h.parentElement) == null || l.classList.remove("opacity-0"), (d = h.parentElement) == null || d.classList.add("opacity-100"));
      } else {
        i.classList.remove("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const h = r.querySelector(".text-brand-600", i);
        h && ((c = h.parentElement) == null || c.classList.add("opacity-0"), (f = h.parentElement) == null || f.classList.remove("opacity-100"));
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
    const e = r.querySelectorAll("[data-select-option]", t);
    return Array.from(e).map((s) => {
      var n, o;
      const a = s, i = a.dataset.displayLabel || ((n = a.textContent) == null ? void 0 : n.trim()) || "";
      return {
        element: a,
        value: a.dataset.value || "",
        label: ((o = a.textContent) == null ? void 0 : o.trim()) || "",
        displayLabel: i,
        searchableText: a.dataset.searchableText || "",
        disabled: a.getAttribute("aria-disabled") === "true"
      };
    });
  }
  /**
   * Find option by value
   */
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((a) => a.value === e) || null;
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = r.querySelector("[data-select-dropdown]", t), s = r.querySelector("[data-select-trigger]", t);
    if (!e || !s) return;
    const a = s.getBoundingClientRect(), i = e.getBoundingClientRect(), o = window.innerHeight - a.bottom, l = a.top, d = i.height || 240;
    o < d && l > d ? (e.style.bottom = "100%", e.style.top = "auto", e.style.marginBottom = "4px", e.style.marginTop = "0") : (e.style.top = "100%", e.style.bottom = "auto", e.style.marginTop = "4px", e.style.marginBottom = "0");
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
    u.dispatchCustomEvent(t, e, {
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
    const a = t.dataset.multiple === "true";
    s.selectedValues = a ? e : e.slice(0, 1), this.setState(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: a ? s.selectedValues : s.selectedValues[0] || "",
      selectedValues: s.selectedValues
    });
  }
  /**
   * Clean up SelectActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
O.getInstance();
class $ extends y {
  constructor() {
    super(...arguments), this.resizeCleanup = null;
  }
  /**
   * Initialize tabs elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("tabs", "true").forEach((t) => {
      this.initializeTabsElement(t);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(t) {
    const e = t.dataset.orientation || "horizontal", s = t.dataset.variant || "default", a = t.dataset.disabled === "true", i = t.dataset.value, n = Array.from(r.querySelectorAll('[data-tabs-trigger="true"]', t)), o = Array.from(r.querySelectorAll('[data-tabs-panel="true"]', t));
    let l = i || null;
    if (!l && n.length > 0) {
      const c = n.find((f) => f.getAttribute("aria-disabled") !== "true");
      l = (c == null ? void 0 : c.dataset.value) || null;
    }
    const d = {
      activeTab: l,
      tabs: n,
      panels: o,
      orientation: e,
      variant: s,
      disabled: a
    };
    this.setState(t, d), this.updateTabsState(t), this.initializeMarker(t), t.classList.add("tabs-initialized");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick('[data-tabs-trigger="true"]', (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-tabs="true"]');
      s && t.getAttribute("aria-disabled") !== "true" && this.activateTab(s, t.dataset.value || "");
    }), u.handleDelegatedKeydown('[data-tabs-trigger="true"]', (t, e) => {
      const s = r.findClosest(t, '[data-tabs="true"]');
      s && this.handleKeydown(s, e);
    }), this.resizeCleanup = u.handleResize(() => {
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
          r.hasDataAttribute(s, "tabs", "true") && (this.hasState(s) || this.initializeTabsElement(s)), r.findByDataAttribute("tabs", "true", s).forEach((i) => {
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
    const a = this.getState(t);
    if (!a || a.disabled) return;
    const i = a.tabs.find((o) => o.dataset.value === e);
    if (!i || i.getAttribute("aria-disabled") === "true")
      return;
    const n = a.activeTab;
    a.activeTab = e, this.setState(t, a), this.updateTabsState(t), this.repositionMarker(t, i), s && i.focus(), u.dispatchCustomEvent(t, "tabs:change", {
      tabs: t,
      activeTab: e,
      previousTab: n
    });
  }
  /**
   * Update tabs visual state and panel visibility
   */
  updateTabsState(t) {
    const e = this.getState(t);
    e && (e.tabs.forEach((s) => {
      const a = s.dataset.value === e.activeTab, i = s.getAttribute("aria-disabled") === "true";
      s.setAttribute("aria-selected", a ? "true" : "false"), s.setAttribute("data-state", a ? "active" : "inactive"), i ? s.setAttribute("tabindex", "-1") : a ? s.setAttribute("tabindex", "0") : s.setAttribute("tabindex", "-1"), s.id = `tab-${s.dataset.value}`;
    }), e.panels.forEach((s) => {
      const a = s.dataset.value === e.activeTab;
      s.setAttribute("data-state", a ? "active" : "inactive"), s.style.display = a ? "block" : "none", s.setAttribute("aria-labelledby", `tab-${s.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.getState(t);
    if (!s || s.disabled) return;
    const a = e.target, i = s.tabs.indexOf(a);
    let n = -1;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault(), n = s.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(s, i) : e.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(s, i) : i;
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault(), n = s.orientation === "horizontal" ? this.getNextEnabledTabIndex(s, i) : e.key === "ArrowDown" ? this.getNextEnabledTabIndex(s, i) : i;
        break;
      case "Home":
        e.preventDefault(), n = this.getFirstEnabledTabIndex(s);
        break;
      case "End":
        e.preventDefault(), n = this.getLastEnabledTabIndex(s);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), a.dataset.value && this.activateTab(t, a.dataset.value, !0);
        return;
    }
    if (n >= 0 && n < s.tabs.length) {
      const o = s.tabs[n];
      o.dataset.value && this.activateTab(t, o.dataset.value, !0);
    }
  }
  /**
   * Get next enabled tab index
   */
  getNextEnabledTabIndex(t, e) {
    for (let s = 1; s < t.tabs.length; s++) {
      const a = (e + s) % t.tabs.length;
      if (t.tabs[a].getAttribute("aria-disabled") !== "true")
        return a;
    }
    return e;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(t, e) {
    for (let s = 1; s < t.tabs.length; s++) {
      const a = (e - s + t.tabs.length) % t.tabs.length;
      if (t.tabs[a].getAttribute("aria-disabled") !== "true")
        return a;
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
    const s = e.tabs.find((a) => a.dataset.value === e.activeTab);
    s && p.createTimer(() => {
      this.repositionMarker(t, s);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const a = r.querySelector('[data-tab-marker="true"]', t);
    if (!a) return;
    const { orientation: i, variant: n } = s;
    i === "vertical" ? this.repositionVerticalMarker(a, e, n) : this.repositionHorizontalMarker(a, e, n);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(t, e, s) {
    const a = e.offsetWidth, i = e.offsetLeft;
    if (t.style.width = `${a}px`, s === "pills") {
      const n = e.offsetHeight, o = e.offsetTop;
      t.style.height = `${n}px`, t.style.transform = `translate(${i}px, ${o}px)`;
    } else
      t.style.transform = `translateX(${i}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(t, e, s) {
    const a = e.offsetHeight, i = e.offsetTop;
    if (t.style.height = `${a}px`, s === "pills") {
      const n = e.offsetWidth, o = e.offsetLeft;
      t.style.width = `${n}px`, t.style.transform = `translate(${o}px, ${i}px)`;
    } else
      t.style.transform = `translateY(${i}px)`;
  }
  /**
   * Handle window resize - reposition all markers
   */
  handleResize() {
    this.getAllStates().forEach((t, e) => {
      if (t.activeTab) {
        const s = t.tabs.find((a) => a.dataset.value === t.activeTab);
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
$.getInstance();
class V extends y {
  /**
   * Initialize modal elements - required by BaseActionClass
   */
  initializeElements() {
    r.querySelectorAll("dialog[data-modal]").forEach((t) => {
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
    u.handleDelegatedClick("[commandfor]", (t, e) => {
      const s = t.getAttribute("command"), a = t.getAttribute("commandfor");
      if (s === "show-modal" && a) {
        const i = r.getElementById(a);
        i && i.matches("dialog[data-modal]") && this.handleModalOpen(i, t);
      }
    }), u.handleDelegatedClick("[data-modal-close]", (t, e) => {
      const s = r.findClosest(t, "dialog[data-modal]");
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
          s.matches && s.matches("dialog[data-modal]") && this.initializeModal(s), r.querySelectorAll("dialog[data-modal]", s).forEach((i) => {
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
    const e = r.querySelector("[autofocus]", t);
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
    const e = r.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(t, e, s = {}) {
    u.dispatchCustomEvent(t, e, {
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
    const e = r.getElementById(t);
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
    const s = r.getElementById(t);
    if (!s) return;
    const a = s.getAttribute("wire:model");
    if (a && typeof window.Livewire < "u" && window.Livewire.find) {
      const n = (i = r.findClosest(s, "[wire\\:id]")) == null ? void 0 : i.getAttribute("wire:id");
      if (n) {
        const o = window.Livewire.find(n);
        o && o.set(a, e);
      }
    }
  }
  /**
   * Toggle a modal's open state
   */
  toggleModal(t) {
    const e = r.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : e.open ? this.closeModal(t) : this.openModal(t);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    r.querySelectorAll("dialog[data-modal][open]").forEach((t) => {
      t.id && this.closeModal(t.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(t, e) {
    const s = r.getElementById(t);
    return !s || !s.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (this.handleModalOpen(s, e), s.showModal(), this.dispatchLivewireEvent("modalOpened", { id: t, modal: t }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(t) {
    const e = r.getElementById(t);
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
V.getInstance();
class E extends y {
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
    u.handleDelegatedClick("[data-toast-dismiss]", (t, e) => {
      const s = t.getAttribute("data-toast-dismiss");
      s && (e.preventDefault(), e.stopPropagation(), this.dismiss(s));
    }), u.handleDelegatedClick("[data-toast-action]", (t, e) => {
      const s = t.getAttribute("data-toast-action"), a = r.findClosest(t, '[data-toast="true"]');
      s && a && (e.preventDefault(), e.stopPropagation(), this.dispatchToastEvent("toast:action", a.id, { action: s }));
    }), u.handleDelegatedEvent("mouseenter", '[data-toast="true"]', (t) => {
      this.pauseTimer(t.id);
    }), u.handleDelegatedEvent("mouseleave", '[data-toast="true"]', (t) => {
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
          r.hasDataAttribute(s, "toast-container") && this.discoverToasts(), r.findByDataAttribute("toast-container").forEach(() => {
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
    t && r.findByDataAttribute("toast-container").forEach((e) => {
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
    const a = e.position || "top-right", i = s.containers.get(a);
    if (!i)
      return !1;
    const n = `toast-${t}-${a}-${++s.toastCounter}`, o = this.createToastElement(n, t, a, e);
    i.appendChild(o), p.fadeIn(o, {
      scale: !0,
      duration: 300,
      onComplete: () => {
        o.setAttribute("data-toast-visible", "true");
      }
    });
    const l = e.duration || 5e3;
    return !(e.persistent === !0) && l > 0 && this.setTimer(n, l), s.toasts.set(n, o), this.setupToastListeners(o), this.dispatchToastEvent("toast:show", n, e), !0;
  }
  /**
   * Create a toast element dynamically
   */
  createToastElement(t, e, s, a) {
    const i = e === "error" ? "danger" : e, n = document.createElement("div");
    return n.className = "pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2", n.setAttribute("data-toast", "true"), n.setAttribute("data-toast-variant", e), n.setAttribute("data-toast-position", s), n.setAttribute("data-toast-visible", "false"), n.setAttribute("role", "alert"), n.setAttribute("aria-live", "polite"), n.id = t, n.innerHTML = `
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
        `, this.updateToastContent(n, a), n;
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
    return s ? (this.clearTimer(t), e.pausedTimers.delete(t), s.setAttribute("data-toast-visible", "false"), s.setAttribute("data-toast-exiting", "true"), p.fadeOut(s, {
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
    const s = r.querySelector("[data-toast-title]", t), a = r.querySelector("[data-toast-message]", t), i = r.querySelector("[data-toast-actions]", t);
    s && e.title ? (s.textContent = e.title, s.classList.remove("hidden")) : s && s.classList.add("hidden"), a && e.message && (a.textContent = e.message), i && e.actions ? (i.innerHTML = e.actions, i.classList.remove("hidden")) : i && i.classList.add("hidden"), t.setAttribute("data-toast-duration", String(e.duration || 5e3)), t.setAttribute("data-toast-persistent", String(e.persistent === !0));
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(t) {
    const e = r.querySelector("[data-toast-title]", t), s = r.querySelector("[data-toast-message]", t), a = r.querySelector("[data-toast-actions]", t);
    e && (e.textContent = "", e.classList.add("hidden")), s && (s.textContent = ""), a && (a.innerHTML = "", a.classList.add("hidden")), t.removeAttribute("data-toast-duration"), t.removeAttribute("data-toast-persistent");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(t, e) {
    const s = this.getGlobalState();
    if (!s) return;
    this.clearTimer(t);
    const a = s.toasts.get(t);
    a && a.setAttribute("data-toast-start-time", String(Date.now()));
    const i = p.createTimer(() => {
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
    s && (p.clearTimer(s), e.timers.delete(t));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const s = e.timers.get(t), a = e.toasts.get(t);
    if (s && a) {
      p.pauseTimer(s);
      const i = parseInt(a.getAttribute("data-toast-duration") || "5000"), n = parseInt(a.getAttribute("data-toast-start-time") || "0"), o = Date.now() - n, l = Math.max(0, i - o);
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
    const s = e.toasts.get(t), a = e.timers.get(t), i = e.pausedTimers.get(t);
    s && a ? s.getAttribute("data-toast-persistent") === "true" || (p.resumeTimer(a), e.pausedTimers.delete(t)) : s && i && !(s.getAttribute("data-toast-persistent") === "true") && i.remaining > 0 && (this.setTimer(t, i.remaining), e.pausedTimers.delete(t));
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(t, e, s = {}) {
    const a = this.getGlobalState();
    if (!a) return;
    const i = { id: e, toast: e, ...s };
    u.dispatchCustomEvent(document, t, i, {
      bubbles: !0,
      cancelable: !0
    });
    const n = a.toasts.get(e);
    if (n && u.dispatchCustomEvent(n, t, i, {
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
    t && (t.timers.forEach((e) => p.clearTimer(e)), t.timers.clear(), t.pausedTimers.clear(), t.toasts.forEach((e) => {
      this.resetToastContent(e), e.style.display = "none", e.setAttribute("data-toast-visible", "false");
    }), t.toasts.clear(), t.containers.clear());
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  E.getInstance().init();
}) : E.getInstance().init();
window.ToastActions = E;
E.getInstance();
class q extends y {
  /**
   * Initialize dropdown elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("dropdown", "true").forEach((t) => {
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
    }, s = r.findClosest(t, '[data-submenu="true"]');
    s && s !== t && (e.parent = s), this.setState(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(t) {
    const e = r.querySelectorAll('[data-submenu="true"]', t), s = this.getState(t);
    s && (s.children = Array.from(e), this.setState(t, s)), e.forEach((a) => {
      this.hasState(a) || this.initializeDropdown(a);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (t, e) => {
      if (t.matches("[data-submenu-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const s = r.findClosest(t, '[data-submenu="true"]');
        s && !this.isDisabled(s) && this.toggleSubmenu(s);
        return;
      }
      if (t.matches("[data-dropdown-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const s = r.findClosest(t, '[data-dropdown="true"]');
        s && !this.isDisabled(s) && this.toggleDropdown(s);
        return;
      }
      if (t.matches("[data-menu-item]")) {
        const s = r.findClosest(t, '[data-dropdown="true"]');
        s && (t.dataset.keepOpen === "true" || this.closeDropdown(s));
        return;
      }
      if (t.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (e.stopPropagation(), !(t.dataset.keepOpen !== "false")) {
          const a = r.findClosest(t, '[data-dropdown="true"]');
          a && this.closeDropdown(a);
        }
        return;
      }
      if (t.matches("[data-dropdown-panel], [data-submenu-panel]")) {
        e.stopPropagation();
        return;
      }
    }), u.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]") || this.closeAllDropdowns());
    }), u.addEventListener(document, "mouseenter", (t) => {
      const e = r.findClosest(t.target, "[data-submenu-trigger]");
      if (e && !this.isMobile()) {
        const s = r.findClosest(e, '[data-submenu="true"]');
        s && !this.isDisabled(s) && (this.closeSiblingSubmenus(s), setTimeout(() => {
          e.matches(":hover") && this.openSubmenu(s);
        }, 100));
      }
    }, { capture: !0 }), u.addEventListener(document, "mouseleave", (t) => {
      const e = r.findClosest(t.target, '[data-submenu="true"]');
      if (e && !this.isMobile()) {
        const s = this.getState(e);
        s != null && s.isOpen && setTimeout(() => {
          e.matches(":hover") || this.closeSubmenu(e);
        }, 150);
      }
    }, { capture: !0 }), u.handleDelegatedKeydown('[data-dropdown="true"]', (t, e) => {
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
          r.hasDataAttribute(s, "dropdown", "true") && (this.hasState(s) || this.initializeDropdown(s)), r.findByDataAttribute("dropdown", "true", s).forEach((i) => {
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
    const s = r.querySelector("[data-dropdown-panel]", t), a = r.querySelector("[data-dropdown-trigger]", t);
    s && (s.classList.remove("hidden"), this.positionDropdown(t)), a && a.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "dropdown:open");
  }
  /**
   * Open submenu
   */
  openSubmenu(t) {
    const e = this.getState(t);
    if (!e || this.isDisabled(t)) return;
    e.isOpen = !0, e.focusedIndex = -1, this.setState(t, e);
    const s = r.querySelector("[data-submenu-panel]", t), a = r.querySelector("[data-submenu-trigger]", t);
    s && (s.classList.remove("hidden"), this.positionSubmenu(t)), a && a.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const s = r.querySelector("[data-dropdown-panel]", t), a = r.querySelector("[data-dropdown-trigger]", t);
    s && s.classList.add("hidden"), a && a.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "dropdown:close");
  }
  /**
   * Close submenu
   */
  closeSubmenu(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const s = r.querySelector("[data-submenu-panel]", t), a = r.querySelector("[data-submenu-trigger]", t);
    s && s.classList.add("hidden"), a && a.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "submenu:close");
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
    this.getAllStates().forEach((s, a) => {
      if (a !== t && s.isOpen) {
        const i = (e == null ? void 0 : e.parent) === a, n = s.parent === t;
        !i && !n && this.closeDropdown(a);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(t) {
    const e = this.getState(t), s = e == null ? void 0 : e.parent;
    if (s) {
      const a = this.getState(s);
      a == null || a.children.forEach((i) => {
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
            const a = s.menuItems[s.focusedIndex];
            a && a.click();
          }
          break;
        case "Escape":
          if (s.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const a = r.querySelector("[data-dropdown-trigger]", t);
            a && a.focus();
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
    const a = s.menuItems.length;
    a !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = e > 0 ? 0 : a - 1 : (s.focusedIndex += e, s.focusedIndex >= a ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = a - 1)), this.setState(t, s), this.updateItemFocus(t));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(t) {
    const e = this.getState(t);
    e && e.menuItems.forEach((s, a) => {
      a === e.focusedIndex ? (s.classList.add("bg-neutral-100", "dark:bg-neutral-800"), s.scrollIntoView({ block: "nearest" })) : s.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", t);
    e.menuItems = Array.from(s).filter((a) => {
      const i = a;
      return !i.hasAttribute("disabled") && i.offsetParent !== null;
    }), this.setState(t, e);
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = r.querySelector("[data-dropdown-panel]", t), s = r.querySelector("[data-dropdown-trigger]", t);
    if (!e || !s) return;
    const a = s.getBoundingClientRect(), i = e.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, l = t.dataset.position || "bottom", d = t.dataset.align || "start", c = parseInt(t.dataset.offset || "8");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "";
    const f = n - a.bottom, h = a.top;
    o - a.left, a.right;
    let g = l, m = d;
    switch (l === "bottom" && f < i.height && h > i.height ? g = "top" : l === "top" && h < i.height && f > i.height && (g = "bottom"), g) {
      case "top":
        e.style.bottom = "100%", e.style.marginBottom = `${c}px`;
        break;
      case "bottom":
        e.style.top = "100%", e.style.marginTop = `${c}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${c}px`;
        break;
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${c}px`;
        break;
    }
    if (g === "top" || g === "bottom")
      switch (m) {
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
      switch (m) {
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
    const e = r.querySelector("[data-submenu-panel]", t), s = r.querySelector("[data-submenu-trigger]", t);
    if (!e || !s) return;
    const a = s.getBoundingClientRect(), i = e.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, l = t.dataset.position || "right", d = t.dataset.align || "start", c = parseInt(t.dataset.offset || "4");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "", e.style.transform = "";
    const f = o - a.right, h = a.left;
    n - a.bottom, a.top;
    let g = l;
    switch (l === "right" && f < i.width && h > i.width ? g = "left" : l === "left" && h < i.width && f > i.width && (g = "right"), g) {
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${c}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${c}px`;
        break;
    }
    switch (d) {
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
    const m = e.getBoundingClientRect();
    if (m.bottom > n) {
      const S = m.bottom - n + 8;
      e.style.transform = `translateY(-${S}px)`;
    } else if (m.top < 0) {
      const S = Math.abs(m.top) + 8;
      e.style.transform = `translateY(${S}px)`;
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
    u.dispatchCustomEvent(t, e, {
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
q.getInstance();
class A extends y {
  /**
   * Initialize table elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("table", "true").forEach((t) => {
      this.initializeTable(t);
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single table
   */
  initializeTable(t) {
    var a;
    if (this.hasState(t))
      return;
    const e = {
      selectedRows: /* @__PURE__ */ new Set(),
      sortColumn: null,
      sortDirection: null,
      selectAllState: "none"
    };
    this.setState(t, e);
    const s = r.querySelector('[data-sorted="true"]', t);
    if (s) {
      const i = s.getAttribute("data-sort-key") || ((a = s.textContent) == null ? void 0 : a.trim()) || "", n = s.getAttribute("data-direction");
      e.sortColumn = i, e.sortDirection = n;
    }
    this.updateSelectionState(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick('[data-sortable="true"]', (t, e) => {
      e.preventDefault(), this.handleSort(t);
    }), u.handleDelegatedChange("[data-table-row-select]", (t) => {
      this.handleRowSelection(t);
    }), u.handleDelegatedChange("[data-table-select-all]", (t) => {
      this.handleSelectAll(t);
    }), u.handleDelegatedKeydown('[data-table="true"]', (t, e) => {
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
          r.hasDataAttribute(s, "table", "true") && this.initializeTable(s), r.findByDataAttribute("table", "true", s).forEach((a) => {
            this.initializeTable(a);
          });
        }
      });
    });
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || u.addEventListener(document, "livewire:navigated", () => {
      this.reinitialize();
    });
  }
  /**
   * Handle sortable header clicks
   */
  handleSort(t) {
    var n;
    const e = r.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const s = this.getState(e);
    if (!s) return;
    const a = t.getAttribute("data-sort-key") || ((n = t.textContent) == null ? void 0 : n.trim()) || "";
    let i = "asc";
    s.sortColumn === a && (s.sortDirection === "asc" ? i = "desc" : s.sortDirection === "desc" && (i = null)), s.sortColumn = i ? a : null, s.sortDirection = i, this.updateSortUI(e, a, i), this.dispatchSortEvent(e, {
      column: a,
      direction: i || "asc",
      url: t.getAttribute("data-sort-url") || void 0,
      livewireMethod: t.getAttribute("data-sort-method") || void 0
    });
  }
  /**
   * Update sort UI indicators
   */
  updateSortUI(t, e, s) {
    if (r.querySelectorAll('[data-sortable="true"]', t).forEach((i) => {
      i.setAttribute("data-sorted", "false"), i.removeAttribute("data-direction"), r.querySelectorAll(".table-sort-icon", i).forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), s) {
      const i = t.querySelector(`[data-sort-key="${e}"]`);
      if (i) {
        i.setAttribute("data-sorted", "true"), i.setAttribute("data-direction", s);
        const n = r.querySelector(".table-sort-icon", i);
        if (n) {
          const o = s === "asc" ? "heroicon-o-chevron-up" : "heroicon-o-chevron-down";
          n.setAttribute("data-icon", o), n.classList.remove("opacity-0", "group-hover:opacity-100"), n.classList.add("opacity-100");
        }
      }
    }
  }
  /**
   * Handle individual row selection
   */
  handleRowSelection(t) {
    const e = r.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const s = this.getState(e);
    if (!s) return;
    const a = t.getAttribute("data-row-id");
    a && (t.checked ? s.selectedRows.add(a) : s.selectedRows.delete(a), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(s.selectedRows)));
  }
  /**
   * Handle select all checkbox
   */
  handleSelectAll(t) {
    const e = r.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const s = this.getState(e);
    if (!s) return;
    const a = r.querySelectorAll("[data-table-row-select]", e);
    t.checked ? a.forEach((i) => {
      i.checked = !0;
      const n = i.getAttribute("data-row-id");
      n && s.selectedRows.add(n);
    }) : a.forEach((i) => {
      i.checked = !1;
      const n = i.getAttribute("data-row-id");
      n && s.selectedRows.delete(n);
    }), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(s.selectedRows));
  }
  /**
   * Update selection state and UI
   */
  updateSelectionState(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelectorAll("[data-table-row-select]", t), a = r.querySelector("[data-table-select-all]", t), i = s.length, n = e.selectedRows.size;
    n === 0 ? (e.selectAllState = "none", a && (a.checked = !1, a.indeterminate = !1)) : n === i ? (e.selectAllState = "all", a && (a.checked = !0, a.indeterminate = !1)) : (e.selectAllState = "some", a && (a.checked = !1, a.indeterminate = !0)), r.querySelectorAll("[data-table-row]", t).forEach((l) => {
      const d = l.getAttribute("data-row-id");
      d && e.selectedRows.has(d) ? (l.setAttribute("data-selected", "true"), l.classList.add("table-row-selected")) : (l.setAttribute("data-selected", "false"), l.classList.remove("table-row-selected"));
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
    if (u.dispatchCustomEvent(t, "table:sort", e, {
      bubbles: !0,
      cancelable: !0
    }), e.livewireMethod && window.Livewire) {
      const s = t.getAttribute("wire:id");
      if (s) {
        const a = window.Livewire.find(s);
        a && a.call(e.livewireMethod, e.column, e.direction);
      }
    }
  }
  /**
   * Dispatch selection event
   */
  dispatchSelectionEvent(t, e) {
    u.dispatchCustomEvent(t, "table:selection", { selectedIds: e }, {
      bubbles: !0,
      cancelable: !0
    });
    const s = t.getAttribute("data-selection-method");
    if (s && window.Livewire) {
      const a = t.getAttribute("wire:id");
      if (a) {
        const i = window.Livewire.find(a);
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
  A.getInstance().init();
}) : A.getInstance().init();
window.TableActions = A;
A.getInstance();
class H extends y {
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
    r.findByDataAttribute("button-group", "true").filter(
      (e) => r.hasDataAttribute(e, "attached", "true")
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
          r.hasDataAttribute(s, "button-group", "true") && r.hasDataAttribute(s, "attached", "true") && this.processButtonGroup(s), r.findByDataAttribute("button-group", "true", s).filter(
            (i) => r.hasDataAttribute(i, "attached", "true")
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
      (a) => a.tagName === "BUTTON" || a.tagName === "A"
    );
    s.length <= 1 || s.forEach((a, i) => {
      const n = i === 0, o = i === s.length - 1, l = !n && !o;
      this.clearBorderRadiusClasses(a), e === "horizontal" ? n ? a.classList.add("rounded-r-none") : o ? a.classList.add("rounded-l-none") : l && a.classList.add("rounded-none") : e === "vertical" && (n ? a.classList.add("rounded-b-none") : o ? a.classList.add("rounded-t-none") : l && a.classList.add("rounded-none"));
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
H.getInstance();
class x extends y {
  /**
   * Initialize tooltip elements - required by BaseActionClass
   */
  initializeElements() {
    r.querySelectorAll("[data-tooltip-target]").forEach((t) => {
      const e = t.getAttribute("data-tooltip-target");
      if (e) {
        const s = r.getElementById(e);
        s && this.initializeTooltip(t, s);
      }
    }), r.findByDataAttribute("tooltip", "true").forEach((t) => {
      const e = t.getAttribute("data-target");
      if (e) {
        const s = r.querySelector(e);
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
    const s = t.getAttribute("data-tooltip-trigger") || e.getAttribute("data-trigger") || "hover", a = parseInt(t.getAttribute("data-tooltip-delay") || e.getAttribute("data-delay") || "100"), i = {
      isVisible: !1,
      trigger: t,
      tooltip: e,
      triggerType: s,
      delay: a
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
        t.addEventListener("click", (a) => {
          a.preventDefault(), this.toggleTooltip(e);
        });
        break;
      case "focus":
        t.addEventListener("focus", () => this.scheduleShow(e)), t.addEventListener("blur", () => this.scheduleHide(e));
        break;
    }
    t.addEventListener("keydown", (a) => {
      a.key === "Escape" && s.isVisible && this.hideTooltip(e);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && this.getAllStates().forEach((s, a) => {
        var i;
        if (s.triggerType === "click" && s.isVisible) {
          const n = e;
          !((i = s.trigger) != null && i.contains(n)) && !a.contains(n) && this.hideTooltip(a);
        }
      });
    }), u.addEventListener(document, "scroll", () => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.hideTooltip(e);
      });
    }, { passive: !0 }), u.handleResize(() => {
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
          r.querySelectorAll("[data-tooltip-target]", s).forEach((a) => {
            const i = a.getAttribute("data-tooltip-target");
            if (i) {
              const n = r.getElementById(i);
              n && !this.hasState(n) && this.initializeTooltip(a, n);
            }
          }), r.findByDataAttribute("tooltip", "true", s).forEach((a) => {
            const i = a.getAttribute("data-target");
            if (i) {
              const n = r.querySelector(i);
              n && !this.hasState(a) && this.initializeTooltip(n, a);
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
    !e || t.getAttribute("data-disabled") === "true" || (this.cancelHide(t), e.showTimer = p.createTimer(() => {
      this.showTooltip(t);
    }, e.delay));
  }
  /**
   * Schedule tooltip to hide with delay
   */
  scheduleHide(t) {
    const e = this.getState(t);
    e && (this.cancelShow(t), e.hideTimer = p.createTimer(() => {
      this.hideTooltip(t);
    }, 100));
  }
  /**
   * Cancel scheduled show
   */
  cancelShow(t) {
    const e = this.getState(t);
    e != null && e.showTimer && (p.clearTimer(e.showTimer), delete e.showTimer);
  }
  /**
   * Cancel scheduled hide
   */
  cancelHide(t) {
    const e = this.getState(t);
    e != null && e.hideTimer && (p.clearTimer(e.hideTimer), delete e.hideTimer);
  }
  /**
   * Show tooltip
   */
  showTooltip(t) {
    const e = this.getState(t);
    !e || e.isVisible || (e.trigger && this.positionTooltip(e.trigger, t), p.fadeIn(t, {
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
    !e || !e.isVisible || p.fadeOut(t, {
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
    const s = t.getBoundingClientRect(), a = e.style.visibility, i = e.style.opacity;
    e.style.visibility = "hidden", e.style.opacity = "1", e.style.position = "fixed", e.style.top = "-9999px", e.style.left = "-9999px";
    const n = e.getBoundingClientRect(), o = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    e.style.visibility = a, e.style.opacity = i;
    const l = e.getAttribute("data-placement") || "top", d = this.calculateOptimalPosition(s, n, o, l);
    e.style.position = "fixed", e.style.top = `${d.top}px`, e.style.left = `${d.left}px`, e.setAttribute("data-placement", d.placement);
  }
  /**
   * Calculate optimal tooltip position with collision detection
   */
  calculateOptimalPosition(t, e, s, a) {
    const n = {
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
    }, o = n[a];
    if (this.positionFitsInViewport(o, e, s))
      return o;
    const l = Object.values(n).filter((d) => d.placement !== a);
    for (const d of l)
      if (this.positionFitsInViewport(d, e, s))
        return d;
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
    u.dispatchCustomEvent(t, e, {
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
    const e = r.getElementById(t);
    return e && this.hasState(e) ? (this.showTooltip(e), !0) : !1;
  }
  /**
   * Public API: Hide tooltip programmatically
   */
  hide(t) {
    const e = r.getElementById(t);
    return e && this.hasState(e) ? (this.hideTooltip(e), !0) : !1;
  }
  /**
   * Public API: Toggle tooltip programmatically
   */
  toggle(t) {
    const e = r.getElementById(t);
    return e && this.hasState(e) ? (this.toggleTooltip(e), !0) : !1;
  }
  /**
   * Public API: Destroy tooltip instance
   */
  destroy(t) {
    const e = r.getElementById(t);
    return e && this.hasState(e) ? (this.hideTooltip(e), this.removeState(e), !0) : !1;
  }
  /**
   * Clean up TooltipActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  x.getInstance().init();
}) : x.getInstance().init();
window.TooltipActions = x;
x.getInstance();
class T extends y {
  /**
   * Initialize timepicker elements - required by BaseActionClass
   */
  initializeElements() {
    r.querySelectorAll('[data-timepicker="true"]').forEach((t) => {
      this.initializeTimePicker(t);
    });
  }
  /**
   * Initialize a single timepicker element
   */
  initializeTimePicker(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.format || "24", s = t.dataset.showSeconds === "true", a = parseInt(t.dataset.step || "1"), i = t.dataset.minTime || null, n = t.dataset.maxTime || null, o = t.dataset.value || null, l = this.parseTime(o) || this.getCurrentTime(), d = {
      isOpen: !1,
      format: e,
      showSeconds: s,
      hour: l.hour,
      minute: l.minute,
      second: l.second,
      period: l.period || "AM",
      step: a,
      minTime: i,
      maxTime: n,
      value: o
    };
    this.setState(t, d), this.updateDisplay(t), this.updateSelectedStates(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    u.handleDelegatedClick("[data-timepicker-trigger]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]');
      s && !this.isDisabled(s) && this.toggleDropdown(s);
    }), u.handleDelegatedClick("[data-timepicker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const s = r.findClosest(t, '[data-timepicker="true"]');
      s && this.clearTime(s);
    }), u.handleDelegatedClick("[data-timepicker-hour]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]'), a = parseInt(t.dataset.timepickerHour || "0");
      s && this.setHour(s, a);
    }), u.handleDelegatedClick("[data-timepicker-minute]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]'), a = parseInt(t.dataset.timepickerMinute || "0");
      s && this.setMinute(s, a);
    }), u.handleDelegatedClick("[data-timepicker-second]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]'), a = parseInt(t.dataset.timepickerSecond || "0");
      s && this.setSecond(s, a);
    }), u.handleDelegatedClick("[data-timepicker-period]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]'), a = t.dataset.timepickerPeriod;
      s && this.setPeriod(s, a);
    }), u.handleDelegatedClick("[data-timepicker-format]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]'), a = t.dataset.timepickerFormat;
      s && this.setFormat(s, a);
    }), u.handleDelegatedClick("[data-timepicker-now]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]');
      s && this.setToCurrentTime(s);
    }), u.handleDelegatedClick("[data-timepicker-apply]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]');
      s && this.applyTime(s);
    }), u.handleDelegatedClick("[data-timepicker-cancel]", (t, e) => {
      e.preventDefault();
      const s = r.findClosest(t, '[data-timepicker="true"]');
      s && this.closeDropdown(s);
    }), u.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest('[data-timepicker="true"]') || this.closeAllDropdowns());
    }), u.handleDelegatedKeydown('[data-timepicker="true"]', (t, e) => {
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
          s.matches && s.matches('[data-timepicker="true"]') && this.initializeTimePicker(s), r.querySelectorAll('[data-timepicker="true"]', s).forEach((a) => {
            this.initializeTimePicker(a);
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
    const s = r.querySelector("[data-timepicker-dropdown]", t), a = r.querySelector("[data-timepicker-trigger]", t);
    s && (s.classList.remove("hidden"), this.positionDropdown(t)), a && a.setAttribute("aria-expanded", "true"), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.dispatchTimePickerEvent(t, "timepicker:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    e.isOpen = !1, this.setState(t, e);
    const s = r.querySelector("[data-timepicker-dropdown]", t), a = r.querySelector("[data-timepicker-trigger]", t);
    s && s.classList.add("hidden"), a && a.setAttribute("aria-expanded", "false"), this.dispatchTimePickerEvent(t, "timepicker:close");
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
  convertHourBetweenFormats(t, e, s, a) {
    if (e === s)
      return { hour: t, period: a };
    if (e === "24" && s === "12")
      return t === 0 ? { hour: 12, period: "AM" } : t >= 1 && t <= 11 ? { hour: t, period: "AM" } : t === 12 ? { hour: 12, period: "PM" } : { hour: t - 12, period: "PM" };
    if (e === "12" && s === "24") {
      if (!a)
        throw new Error("Period (AM/PM) required for 12h to 24h conversion");
      return a === "AM" ? t === 12 ? { hour: 0 } : { hour: t } : t === 12 ? { hour: 12 } : { hour: t + 12 };
    }
    return { hour: t, period: a };
  }
  /**
   * Set format (12/24 hour)
   */
  setFormat(t, e) {
    const s = this.getState(t);
    if (!s) return;
    const a = t.dataset.formatMode;
    if (a === "12" || a === "24") {
      console.warn(`TimePicker format is locked to ${a}h mode. Cannot switch to ${e}h.`);
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
    const a = this.getState(t);
    if (a) {
      switch (e) {
        case "hour":
          a.format === "12" ? (a.hour = a.hour + s, a.hour > 12 && (a.hour = 1), a.hour < 1 && (a.hour = 12)) : (a.hour = a.hour + s, a.hour > 23 && (a.hour = 0), a.hour < 0 && (a.hour = 23));
          break;
        case "minute":
          a.minute = a.minute + s * a.step, a.minute >= 60 ? a.minute = a.minute % 60 : a.minute < 0 && (a.minute = 60 + a.minute % 60, a.minute === 60 && (a.minute = 0));
          break;
        case "second":
          a.second = a.second + s, a.second >= 60 ? a.second = 0 : a.second < 0 && (a.second = 59);
          break;
      }
      this.setState(t, a), this.updateDisplay(t), this.dispatchTimePickerEvent(t, "timepicker:increment", {
        unit: e,
        direction: s,
        value: this.formatTimeValue(a)
      });
    }
  }
  /**
   * Update display value
   */
  updateDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = this.formatTimeValue(e), a = r.querySelector("[data-timepicker-trigger]", t);
    a && (a.value = s || "");
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
    const s = r.querySelector(".timepicker-hidden-input", t), a = r.querySelector("[data-timepicker-trigger]", t);
    s && (s.value = e), a && (a.value = e);
    const i = this.getState(t);
    i && (i.value = e, this.setState(t, i));
  }
  /**
   * Update selected states in dropdown
   */
  updateSelectedStates(t) {
    const e = this.getState(t);
    if (!e) return;
    r.querySelectorAll(".selected", t).forEach((i) => i.classList.remove("selected"));
    const s = r.querySelector(`[data-timepicker-hour="${e.hour}"]`, t);
    s && s.classList.add("selected");
    const a = r.querySelector(`[data-timepicker-minute="${e.minute}"]`, t);
    if (a && a.classList.add("selected"), e.showSeconds) {
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
    r.querySelectorAll("[data-timepicker-format]", t).forEach((a) => {
      a.dataset.timepickerFormat === e.format ? (a.classList.add("bg-brand", "text-foreground-brand"), a.classList.remove("bg-surface", "text-muted")) : (a.classList.remove("bg-brand", "text-foreground-brand"), a.classList.add("bg-surface", "text-muted"));
    });
  }
  /**
   * Update hour options based on current format
   */
  updateHourOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const s = r.querySelector("[data-timepicker-dropdown] .h-24:first-child", t);
    if (!s) return;
    const a = e.format === "12" ? Array.from({ length: 12 }, (i, n) => n + 1) : (
      // 1-12 for 12h
      Array.from({ length: 24 }, (i, n) => n)
    );
    s.innerHTML = "", a.forEach((i) => {
      const n = document.createElement("button");
      n.type = "button", n.dataset.timepickerHour = i.toString(), n.className = "w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors", n.textContent = i.toString().padStart(2, "0"), s.appendChild(n);
    }), e.format === "12" && (e.hour < 1 || e.hour > 12) ? (e.hour = Math.max(1, Math.min(12, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t)) : e.format === "24" && (e.hour < 0 || e.hour > 23) && (e.hour = Math.max(0, Math.min(23, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t));
  }
  /**
   * Scroll to selected options in dropdown lists
   */
  scrollToSelectedOptions(t) {
    r.querySelectorAll(".selected", t).forEach((s) => {
      s.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
  /**
   * Position dropdown
   */
  positionDropdown(t) {
    const e = r.querySelector("[data-timepicker-dropdown]", t), s = r.querySelector("[data-timepicker-trigger]", t);
    if (!e || !s) return;
    e.style.top = "", e.style.bottom = "", e.style.marginTop = "", e.style.marginBottom = "", e.style.maxHeight = "";
    const a = s.getBoundingClientRect(), i = window.innerHeight, n = window.innerWidth, l = e.getBoundingClientRect().height, d = i - a.bottom - 8, c = a.top - 8, f = 200;
    let h = !1, g = "none";
    l <= d ? h = !1 : l <= c ? h = !0 : c > d ? (h = !0, g = Math.max(c, f) + "px") : (h = !1, g = Math.max(d, f) + "px"), h ? (e.style.bottom = "100%", e.style.top = "auto", e.style.marginBottom = "4px", e.style.marginTop = "0") : (e.style.top = "100%", e.style.bottom = "auto", e.style.marginTop = "4px", e.style.marginBottom = "0"), g !== "none" && (e.style.maxHeight = g, e.style.overflowY = "auto");
    const m = a.left;
    m + e.offsetWidth > n ? (e.style.right = "0", e.style.left = "auto") : m < 0 && (e.style.left = "0", e.style.right = "auto");
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
      for (const a of s) {
        const i = t.match(a);
        if (i) {
          const n = parseInt(i[1]), o = parseInt(i[2]), l = parseInt(i[3] || "0"), d = (e = i[4]) == null ? void 0 : e.toUpperCase();
          return { hour: n, minute: o, second: l, period: d };
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
    const { hour: e, minute: s, second: a, period: i, format: n, showSeconds: o } = t;
    if (n === "12") {
      const l = e.toString(), d = s.toString().padStart(2, "0"), c = a.toString().padStart(2, "0");
      return o ? `${l}:${d}:${c} ${i}` : `${l}:${d} ${i}`;
    } else {
      const l = e.toString().padStart(2, "0"), d = s.toString().padStart(2, "0"), c = a.toString().padStart(2, "0");
      return o ? `${l}:${d}:${c}` : `${l}:${d}`;
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
    u.dispatchCustomEvent(t, e, {
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
    const s = this.parseTime(e), a = this.getState(t);
    !s || !a || (a.hour = s.hour, a.minute = s.minute, a.second = s.second, s.period && (a.period = s.period), this.setState(t, a), this.updateDisplay(t), this.updateSelectedStates(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: this.formatTimeValue(a),
      state: { ...a }
    }));
  }
  /**
   * Clean up TimePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  T.getInstance().init();
}) : T.getInstance().init();
window.TimePickerActions = T;
T.getInstance();
class C extends y {
  /**
   * Initialize accordion elements - required by BaseActionClass
   */
  initializeElements() {
    r.querySelectorAll("details[data-accordion]").forEach((t) => {
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
    u.handleDelegatedClick("details[data-accordion] summary", (t, e) => {
      const s = r.findClosest(t, "details[data-accordion]");
      s && this.handleSummaryClick(s, e);
    }), u.handleDelegatedEvent("toggle", "details[data-accordion]", (t) => {
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
          s.matches && s.matches("details[data-accordion]") && this.initializeAccordion(s), r.querySelectorAll("details[data-accordion]", s).forEach((a) => {
            this.initializeAccordion(a);
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
    if (p.prefersReducedMotion())
      return;
    e.preventDefault();
    const a = !t.open;
    s.isExpanding = a, a ? this.expand(t) : this.shrink(t);
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
    const s = r.querySelector("summary", t), a = s ? s.offsetHeight : 0, i = t.offsetHeight;
    e.animation = p.expandHeight(t, {
      fromHeight: a,
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
    const s = r.querySelector("summary", t), a = s ? s.offsetHeight : 0;
    e.animation = p.collapseHeight(t, {
      toHeight: a,
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
    const e = r.getElementById(t);
    if (!e || !e.matches("details[data-accordion]"))
      return console.warn(`Accordion with id "${t}" not found`), !1;
    if (e.open)
      return !0;
    const s = this.getState(e);
    return s && s.isAnimating ? !1 : p.prefersReducedMotion() ? (e.open = !0, !0) : (this.expand(e), !0);
  }
  /**
   * Programmatically close an accordion
   */
  closeAccordion(t) {
    const e = r.getElementById(t);
    if (!e || !e.matches("details[data-accordion]"))
      return console.warn(`Accordion with id "${t}" not found`), !1;
    if (!e.open)
      return !0;
    const s = this.getState(e);
    return s && s.isAnimating ? !1 : p.prefersReducedMotion() ? (e.open = !1, !0) : (this.shrink(e), !0);
  }
  /**
   * Toggle an accordion's state
   */
  toggleAccordion(t) {
    const e = r.getElementById(t);
    return !e || !e.matches("details[data-accordion]") ? (console.warn(`Accordion with id "${t}" not found`), !1) : e.open ? this.closeAccordion(t) : this.openAccordion(t);
  }
  /**
   * Check if accordion is open
   */
  isAccordionOpen(t) {
    const e = r.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Check if accordion is animating
   */
  isAccordionAnimating(t) {
    const e = r.getElementById(t);
    if (!e) return !1;
    const s = this.getState(e);
    return s ? s.isAnimating : !1;
  }
  /**
   * Get accordion state
   */
  getAccordionState(t) {
    const e = r.getElementById(t);
    return e && this.getState(e) || null;
  }
  /**
   * Dispatch custom accordion events
   */
  dispatchAccordionEvent(t, e, s = {}) {
    u.dispatchCustomEvent(t, e, {
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
      p.cancelAnimation(t.animation), e.removeAttribute("animating"), e.style.height = "", e.style.overflow = "";
    });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  C.getInstance().init();
}) : C.getInstance().init();
window.AccordionActions = C;
C.getInstance();
function z() {
  k.getInstance().init(), L.getInstance().init(), w.getInstance().init(), I.getInstance().init(), D.getInstance().init(), O.getInstance().init(), $.getInstance().init(), V.getInstance().init(), E.getInstance().init(), q.getInstance().init(), A.getInstance().init(), H.getInstance().init(), x.getInstance().init(), T.getInstance().init(), C.getInstance().init();
}
const B = {
  FormActions: k.getInstance(),
  AlertActions: L.getInstance(),
  CalendarActions: w.getInstance(),
  RadioActions: I.getInstance(),
  RangeActions: D.getInstance(),
  SelectActions: O.getInstance(),
  TabsActions: $.getInstance(),
  ModalActions: V.getInstance(),
  ToastActions: E.getInstance(),
  DropdownActions: q.getInstance(),
  TableActions: A.getInstance(),
  ButtonGroupActions: H.getInstance(),
  TooltipActions: x.getInstance(),
  TimePickerActions: T.getInstance(),
  AccordionActions: C.getInstance(),
  init: z
};
export {
  C as AccordionActions,
  L as AlertActions,
  y as BaseActionClass,
  H as ButtonGroupActions,
  w as CalendarActions,
  r as DOMUtils,
  q as DropdownActions,
  u as EventUtils,
  k as FormActions,
  V as ModalActions,
  I as RadioActions,
  D as RangeActions,
  O as SelectActions,
  A as TableActions,
  $ as TabsActions,
  T as TimePickerActions,
  E as ToastActions,
  x as TooltipActions,
  B as default,
  z as initializeKeysUI
};
