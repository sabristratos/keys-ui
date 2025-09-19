const w = class w {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const t = this.name;
    return w.instances.has(t) || w.instances.set(t, new this()), w.instances.get(t);
  }
  /**
   * Standardized initialization flow
   * Prevents double initialization and provides lifecycle hooks
   */
  init() {
    var t, e, a;
    this.initialized || ((t = this.onBeforeInit) == null || t.call(this), this.bindEventListeners(), this.initializeElements(), (e = this.setupDynamicObserver) == null || e.call(this), (a = this.onAfterInit) == null || a.call(this), this.initialized = !0);
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
    const e = new MutationObserver((a) => {
      a.forEach((s) => {
        s.addedNodes.length > 0 && t(s.addedNodes);
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
    let a = null;
    return () => {
      a && clearTimeout(a), a = setTimeout(t, e);
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
w.instances = /* @__PURE__ */ new Map();
let D = w;
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
    const a = e || document;
    return Array.from(a.querySelectorAll(t));
  }
  /**
   * Find elements with specific data attribute
   */
  static findByDataAttribute(t, e, a) {
    const s = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelectorAll(s, a);
  }
  /**
   * Find single element with data attribute
   */
  static findFirstByDataAttribute(t, e, a) {
    const s = e ? `[data-${t}="${e}"]` : `[data-${t}]`;
    return this.querySelector(s, a);
  }
  /**
   * Check if element has data attribute with optional value
   */
  static hasDataAttribute(t, e, a) {
    if (!t) return !1;
    const s = t.dataset[e];
    return a !== void 0 ? s === a : s !== void 0;
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
  static setDataAttribute(t, e, a) {
    t && (t.dataset[e] = a);
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
    var a;
    return ((a = t == null ? void 0 : t.matches) == null ? void 0 : a.call(t, e)) ?? !1;
  }
  /**
   * Find all child elements matching selector
   */
  static findChildren(t, e) {
    return t ? Array.from(t.children).filter(
      (a) => this.matches(a, e)
    ) : [];
  }
  /**
   * Get next sibling element matching selector
   */
  static getNextSibling(t, e) {
    let a = t == null ? void 0 : t.nextElementSibling;
    for (; a; ) {
      if (!e || this.matches(a, e))
        return a;
      a = a.nextElementSibling;
    }
    return null;
  }
  /**
   * Get previous sibling element matching selector
   */
  static getPreviousSibling(t, e) {
    let a = t == null ? void 0 : t.previousElementSibling;
    for (; a; ) {
      if (!e || this.matches(a, e))
        return a;
      a = a.previousElementSibling;
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
  static toggleClass(t, e, a) {
    return (t == null ? void 0 : t.classList.toggle(e, a)) ?? !1;
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
  static toggleAttribute(t, e, a) {
    t && (a !== void 0 ? t.setAttribute(e, a) : t.removeAttribute(e));
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
    const a = document.createElement(t);
    return e != null && e.classes && a.classList.add(...e.classes), e != null && e.attributes && Object.entries(e.attributes).forEach(([s, i]) => {
      a.setAttribute(s, i);
    }), e != null && e.textContent && (a.textContent = e.textContent), e != null && e.innerHTML && (a.innerHTML = e.innerHTML), a;
  }
}
class c {
  /**
   * Create and dispatch custom event
   */
  static dispatchCustomEvent(t, e, a, s) {
    const i = new CustomEvent(e, {
      detail: a,
      bubbles: (s == null ? void 0 : s.bubbles) ?? !0,
      cancelable: (s == null ? void 0 : s.cancelable) ?? !0
    });
    return t.dispatchEvent(i);
  }
  /**
   * Add event listener with automatic cleanup tracking
   */
  static addEventListener(t, e, a, s) {
    return t.addEventListener(e, a, s), () => {
      t.removeEventListener(e, a, s);
    };
  }
  /**
   * Handle generic events with delegation
   */
  static handleDelegatedEvent(t, e, a, s) {
    const i = s || document, n = (o) => {
      const l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(e)), d && a(d, o);
    };
    return this.addEventListener(i, t, n);
  }
  /**
   * Handle click events with delegation
   */
  static handleDelegatedClick(t, e, a) {
    const s = a || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(s, "click", i);
  }
  /**
   * Handle keydown events with delegation
   */
  static handleDelegatedKeydown(t, e, a) {
    const s = a || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(s, "keydown", i);
  }
  /**
   * Handle specific key presses
   */
  static handleKeyPress(t, e, a) {
    return (s) => {
      t.includes(s.key) && (a != null && a.preventDefault && s.preventDefault(), a != null && a.stopPropagation && s.stopPropagation(), e(s.key, s));
    };
  }
  /**
   * Handle input events with delegation
   */
  static handleDelegatedInput(t, e, a) {
    const s = a || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(s, "input", i);
  }
  /**
   * Handle change events with delegation
   */
  static handleDelegatedChange(t, e, a) {
    const s = a || document, i = (n) => {
      const o = n.target;
      let l = null;
      o instanceof Element && (l = o.closest(t)), l && e(l, n);
    };
    return this.addEventListener(s, "change", i);
  }
  /**
   * Handle focus events with delegation
   */
  static handleDelegatedFocus(t, e, a) {
    const s = a || document, i = (n) => {
      const o = n, l = o.target;
      let d = null;
      l instanceof Element && (d = l.closest(t)), d && e(d, o);
    };
    return this.addEventListener(s, "focusin", i);
  }
  /**
   * Create debounced event handler
   */
  static debounce(t, e) {
    let a = null;
    return (...s) => {
      a && clearTimeout(a), a = setTimeout(() => {
        t(...s);
      }, e);
    };
  }
  /**
   * Create throttled event handler
   */
  static throttle(t, e) {
    let a = !1;
    return (...s) => {
      a || (t(...s), a = !0, setTimeout(() => {
        a = !1;
      }, e));
    };
  }
  /**
   * Handle window resize with debouncing
   */
  static handleResize(t, e = 100) {
    const a = this.debounce(t, e);
    return this.addEventListener(window, "resize", a);
  }
  /**
   * Handle click outside element
   */
  static handleClickOutside(t, e) {
    const a = (s) => {
      const i = s, n = i.target;
      t.contains(n) || e(i);
    };
    return this.addEventListener(document, "click", a);
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
  static handleFormSubmission(t, e, a) {
    const s = (i) => {
      const n = i;
      if (a && !a(t)) {
        i.preventDefault();
        return;
      }
      const o = new FormData(t);
      e(o, n);
    };
    return this.addEventListener(t, "submit", s);
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
      var i, n, o, l, d, u, h, f, g, m, S;
      const { key: a } = e, s = ((i = t.preventDefault) == null ? void 0 : i.includes(a)) ?? !0;
      switch (a) {
        case "ArrowUp":
          s && e.preventDefault(), (n = t.onArrowUp) == null || n.call(t);
          break;
        case "ArrowDown":
          s && e.preventDefault(), (o = t.onArrowDown) == null || o.call(t);
          break;
        case "ArrowLeft":
          s && e.preventDefault(), (l = t.onArrowLeft) == null || l.call(t);
          break;
        case "ArrowRight":
          s && e.preventDefault(), (d = t.onArrowRight) == null || d.call(t);
          break;
        case "Enter":
          s && e.preventDefault(), (u = t.onEnter) == null || u.call(t);
          break;
        case " ":
          s && e.preventDefault(), (h = t.onSpace) == null || h.call(t);
          break;
        case "Escape":
          s && e.preventDefault(), (f = t.onEscape) == null || f.call(t);
          break;
        case "Home":
          s && e.preventDefault(), (g = t.onHome) == null || g.call(t);
          break;
        case "End":
          s && e.preventDefault(), (m = t.onEnd) == null || m.call(t);
          break;
        case "Tab":
          (S = t.onTab) == null || S.call(t);
          break;
      }
    };
  }
}
function B(b, t = "") {
  const e = window.KeysUITranslations;
  if (!e)
    return t;
  const a = b.split(".");
  let s = e;
  for (const i of a)
    if (s = s == null ? void 0 : s[i], s === void 0)
      return t;
  return s || t;
}
class O extends D {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick(".input-action", (t, e) => {
      e.preventDefault(), this.handleActionClick(t);
    }), c.handleDelegatedKeydown(".input-action", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleActionClick(t));
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(t) {
    const e = r.findClosest(t, ".input-action"), a = e == null ? void 0 : e.dataset.action;
    if (!a) return;
    const s = r.findFormElementForAction(t);
    if (s) {
      switch (a) {
        case "clear":
          this.clearValue(s);
          break;
        case "copy":
          await this.copyToClipboard(s, e);
          break;
        case "toggle-password":
          await this.togglePasswordVisibility(s, t, e);
          break;
        case "external":
          this.openExternalUrl(t.dataset.url);
          break;
        default:
          this.handleCustomAction(s, a);
          break;
      }
      this.dispatchActionEvent(s, a);
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
    const a = r.querySelector(".button-icon-default", t), s = r.querySelector(".button-icon-toggle", t), i = r.querySelector(".button-icon-success", t), n = t.dataset.iconDefault, o = t.dataset.iconToggle, l = t.dataset.iconSuccess;
    a && (a.classList.remove("opacity-100"), a.classList.add("opacity-0")), s && (s.classList.remove("opacity-100", "scale-110", "scale-90"), s.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), e === n && a ? (a.classList.remove("opacity-0"), a.classList.add("opacity-100")) : e === o && s ? (s.classList.remove("opacity-0"), s.classList.add("opacity-100")) : e === l && i && (i.classList.remove("opacity-0"), i.classList.add("opacity-100", "scale-110"));
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
    const a = r.querySelector("button", e);
    try {
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, B("feedback.copied_clipboard", "Copied to clipboard"), "success"), a && await this.showCopySuccess(a, e);
    } catch {
      this.fallbackCopyToClipboard(t, e);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(t, e) {
    const a = r.querySelector("button", e);
    t.select(), t instanceof HTMLInputElement && t.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(t, B("feedback.copied_clipboard", "Copied to clipboard"), "success"), a && this.showCopySuccess(a, e);
    } catch {
      this.showFeedback(t, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(t, e) {
    const a = t.dataset.iconSuccess, s = t.dataset.labelSuccess, i = t.dataset.iconDefault, n = r.querySelector(".sr-only", t);
    if (a && i)
      if (await this.swapButtonIcon(t, a), s && n) {
        const o = n.textContent;
        n.textContent = s, setTimeout(async () => {
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
  async togglePasswordVisibility(t, e, a) {
    var h;
    const s = t.type === "password", i = s ? "text" : "password", n = e.dataset.iconDefault, o = e.dataset.iconToggle, l = (h = r.querySelector(".sr-only", e)) == null ? void 0 : h.textContent, d = e.dataset.labelToggle;
    t.type = i;
    const u = r.querySelector(".sr-only", e);
    s ? (o && await this.swapButtonIcon(e, o), d && u && (u.textContent = d), e.setAttribute("aria-label", d || "Hide password")) : (n && await this.swapButtonIcon(e, n), l && u && (u.textContent = l), e.setAttribute("aria-label", l || "Show password"));
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
    c.dispatchCustomEvent(t, "form-action", {
      element: t,
      action: e,
      value: t.value
    });
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(t, e, a = "success") {
    const s = document.createElement("div");
    s.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${a === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, s.textContent = e;
    const i = r.findClosest(t, ".relative");
    i && (i.appendChild(s), setTimeout(() => {
      s.parentNode && s.parentNode.removeChild(s);
    }, 2e3));
  }
  /**
   * Add a custom action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return c.addEventListener(document, "form-action", (a) => {
      const s = a;
      s.detail.action === t && e(s.detail.element);
    });
  }
  /**
   * Clean up FormActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
O.getInstance();
const I = class I {
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
    var h;
    if (this.prefersReducedMotion())
      return t.style.opacity = "1", e.scale && (t.style.transform = "scale(1)"), (h = e.onComplete) == null || h.call(e), null;
    const {
      duration: a = 300,
      easing: s = "ease-out",
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
    ], u = t.animate(d, {
      duration: a,
      easing: s,
      delay: i,
      fill: n
    });
    return l && u.addEventListener("finish", l, { once: !0 }), u;
  }
  /**
   * Fade out animation with optional scale transform
   */
  static fadeOut(t, e = {}) {
    var h;
    if (this.prefersReducedMotion())
      return t.style.opacity = "0", e.scale && (t.style.transform = "scale(0.95)"), (h = e.onComplete) == null || h.call(e), null;
    const {
      duration: a = 300,
      easing: s = "ease-in",
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
    ], u = t.animate(d, {
      duration: a,
      easing: s,
      delay: i,
      fill: n
    });
    return l && u.addEventListener("finish", l, { once: !0 }), u;
  }
  /**
   * Expand height animation (for accordions, dropdowns, etc.)
   */
  static expandHeight(t, e = {}) {
    var h;
    if (this.prefersReducedMotion())
      return t.style.height = e.toHeight === "auto" ? "" : `${e.toHeight}px`, (h = e.onComplete) == null || h.call(e), null;
    const {
      duration: a = 300,
      easing: s = "ease-out",
      fromHeight: i = 0,
      toHeight: n = "auto",
      onComplete: o
    } = e, l = i === "auto" ? t.offsetHeight : i;
    let d;
    if (n === "auto") {
      const f = t.style.height;
      t.style.height = "auto", d = t.offsetHeight, t.style.height = f;
    } else
      d = n;
    t.style.height = `${l}px`, t.style.overflow = "hidden";
    const u = t.animate([
      { height: `${l}px` },
      { height: `${d}px` }
    ], {
      duration: a,
      easing: s,
      fill: "forwards"
    });
    return u.addEventListener("finish", () => {
      n === "auto" && (t.style.height = ""), t.style.overflow = "", o == null || o();
    }, { once: !0 }), u;
  }
  /**
   * Collapse height animation
   */
  static collapseHeight(t, e = {}) {
    var d;
    if (this.prefersReducedMotion())
      return t.style.height = `${e.toHeight || 0}px`, (d = e.onComplete) == null || d.call(e), null;
    const {
      duration: a = 300,
      easing: s = "ease-out",
      toHeight: i = 0,
      onComplete: n
    } = e, o = t.offsetHeight;
    t.style.height = `${o}px`, t.style.overflow = "hidden";
    const l = t.animate([
      { height: `${o}px` },
      { height: `${i}px` }
    ], {
      duration: a,
      easing: s,
      fill: "forwards"
    });
    return l.addEventListener("finish", () => {
      i === 0 && (t.style.display = "none"), t.style.overflow = "", n == null || n();
    }, { once: !0 }), l;
  }
  /**
   * Slide in animation (for panels, tooltips, etc.)
   */
  static slideIn(t, e, a = {}) {
    var u;
    if (this.prefersReducedMotion())
      return t.style.transform = "translate(0, 0)", t.style.opacity = "1", (u = a.onComplete) == null || u.call(a), null;
    const {
      duration: s = 200,
      easing: i = "ease-out",
      distance: n = 10,
      onComplete: o
    } = a, l = {
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
      duration: s,
      easing: i,
      fill: "forwards"
    });
    return o && d.addEventListener("finish", o, { once: !0 }), d;
  }
  /**
   * Slide out animation
   */
  static slideOut(t, e, a = {}) {
    var u;
    if (this.prefersReducedMotion())
      return t.style.opacity = "0", (u = a.onComplete) == null || u.call(a), null;
    const {
      duration: s = 200,
      easing: i = "ease-in",
      distance: n = 10,
      onComplete: o
    } = a, l = {
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
      duration: s,
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
  static animateWithCleanup(t, e, a = {}) {
    var o;
    if (this.prefersReducedMotion())
      return (o = a.cleanup) == null || o.call(a), null;
    const { cleanup: s, ...i } = a, n = t.animate(e, i);
    return n.addEventListener("finish", () => {
      s == null || s();
    }, { once: !0 }), n.addEventListener("cancel", () => {
      s == null || s();
    }, { once: !0 }), n;
  }
  /**
   * Create a managed timer that can be paused/resumed
   */
  static createTimer(t, e) {
    const a = ++this.timerCounter, s = {
      id: a,
      callback: t,
      delay: e,
      startTime: Date.now(),
      paused: !1
    }, i = window.setTimeout(() => {
      this.timers.delete(a), t();
    }, e);
    return s.id = i, this.timers.set(a, s), a;
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
      const a = Date.now() - e.startTime;
      e.remaining = Math.max(0, e.delay - a), e.paused = !0;
    }
  }
  /**
   * Resume a paused timer
   */
  static resumeTimer(t) {
    const e = this.timers.get(t);
    if (e && e.paused && e.remaining !== void 0) {
      e.paused = !1, e.startTime = Date.now(), e.delay = e.remaining;
      const a = window.setTimeout(() => {
        this.timers.delete(t), e.callback();
      }, e.remaining);
      e.id = a;
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
  static applyTransitionClasses(t, e, a, s = 300) {
    t.classList.add(e), t.offsetHeight, t.classList.add(a), setTimeout(() => {
      t.classList.remove(e);
    }, s);
  }
};
I.timers = /* @__PURE__ */ new Map(), I.timerCounter = 0;
let p = I;
typeof window < "u" && (window.AnimationUtils = p);
class $ extends D {
  /**
   * Initialize alert elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick("[data-dismiss-alert]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), c.handleDelegatedKeydown("[data-dismiss-alert]", (t, e) => {
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
      title: a,
      message: s,
      dismissible: i = !0,
      duration: n,
      container: o = document.body
    } = t, l = document.createElement("div");
    l.className = this.getAlertClasses(e), l.setAttribute("role", "alert"), i && l.setAttribute("data-dismissible", "true");
    const d = this.buildAlertContent(e, a, s, i);
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
    const e = "rounded-lg border p-4 space-y-3", a = {
      info: "bg-info/5 border-info/20 text-info-foreground",
      success: "bg-success/5 border-success/20 text-success-foreground",
      warning: "bg-warning/5 border-warning/20 text-warning-foreground",
      danger: "bg-danger/5 border-danger/20 text-danger-foreground",
      neutral: "bg-neutral/5 border-neutral/20 text-neutral-foreground"
    };
    return `${e} ${a[t] || a.info}`;
  }
  /**
   * Build alert content HTML
   */
  buildAlertContent(t, e, a, s) {
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
                    <div class="text-sm opacity-90 ${e ? "mt-1" : ""}">${a || ""}</div>
                </div>
                ${s ? `
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
    c.dispatchCustomEvent(t, "alert-action", {
      alert: t,
      action: e
    }), c.dispatchCustomEvent(document.body, "alert-action", {
      alert: t,
      action: e
    });
  }
  /**
   * Add a custom alert action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return c.addEventListener(document, "alert-action", (a) => {
      const s = a;
      s.detail.action === t && e(s.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(t) {
    r.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((a) => {
      this.dismissAlert(a);
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
$.getInstance();
const L = class L {
  /**
   * Format Date object to string using custom format
   */
  static formatDate(t, e) {
    if (!t || isNaN(t.getTime()))
      return "";
    const a = t.getFullYear(), s = t.getMonth() + 1, i = t.getDate(), n = {
      Y: String(a),
      y: String(a).slice(-2),
      F: this.MONTH_NAMES[s - 1],
      M: this.MONTH_NAMES_SHORT[s - 1],
      m: String(s).padStart(2, "0"),
      n: String(s),
      d: String(i).padStart(2, "0"),
      j: String(i)
    };
    let o = e;
    for (const [l, d] of Object.entries(n))
      o = o.replace(new RegExp(l, "g"), d);
    return o;
  }
  /**
   * Format Date object to YYYY-MM-DD string
   */
  static formatDateString(t) {
    if (!t || isNaN(t.getTime()))
      return "";
    const e = t.getFullYear(), a = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getDate()).padStart(2, "0");
    return `${e}-${a}-${s}`;
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
    const a = this.parseDate(t);
    return a ? this.formatDate(a, e) : "";
  }
  /**
   * Format date range for display
   */
  static formatRangeForDisplay(t, e, a, s = " - ") {
    if (!t) return "";
    const i = this.formatDateForDisplay(t, a), n = e ? this.formatDateForDisplay(e, a) : "";
    return n ? `${i}${s}${n}` : i;
  }
  /**
   * Format date range for form submission
   */
  static formatRangeForSubmission(t, e, a = "Y-m-d") {
    if (!t) return null;
    const s = this.formatDateForSubmission(t, a), i = e ? this.formatDateForSubmission(e, a) : "";
    return i ? `${s},${i}` : `${s},`;
  }
  /**
   * Format single date for form submission
   */
  static formatDateForSubmission(t, e = "Y-m-d") {
    if (!t) return "";
    const a = this.parseDate(t);
    return a ? this.formatDate(a, e) : "";
  }
  /**
   * Add days to a date string
   */
  static addDaysToDate(t, e) {
    const a = this.parseDate(t);
    return a ? (a.setDate(a.getDate() + e), this.formatDateString(a)) : t;
  }
  /**
   * Add months to a date string
   */
  static addMonthsToDate(t, e) {
    const a = this.parseDate(t);
    return a ? (a.setMonth(a.getMonth() + e), this.formatDateString(a)) : t;
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
  static isDateInRange(t, e, a) {
    if (!e || !a) return !1;
    const s = this.parseDate(t), i = this.parseDate(e), n = this.parseDate(a);
    return !s || !i || !n ? !1 : s >= i && s <= n;
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
      const a = new Date(t);
      if (!isNaN(a.getTime()))
        return a;
    } catch {
    }
    return null;
  }
  /**
   * Create ARIA label for date with contextual information
   */
  static createDateAriaLabel(t, e = !1, a = !1, s = !1, i = !1, n = !1) {
    const o = this.parseDate(t);
    if (!o) return t;
    let d = o.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return e && (d += ", Today"), a ? d += ", Selected" : s ? d += ", Range start" : i ? d += ", Range end" : n && (d += ", In selected range"), d;
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
    const a = this.parseDate(t), s = this.parseDate(e);
    return !a || !s ? 0 : a.getTime() - s.getTime();
  }
  /**
   * Get quick selector date ranges
   */
  static getQuickSelectorDate(t) {
    const e = /* @__PURE__ */ new Date();
    let a = null, s = null;
    switch (t) {
      case "today":
        a = e, s = e;
        break;
      case "yesterday":
        a = new Date(e), a.setDate(e.getDate() - 1), s = a;
        break;
      case "last7days":
        s = e, a = new Date(e), a.setDate(e.getDate() - 6);
        break;
      case "last30days":
        s = e, a = new Date(e), a.setDate(e.getDate() - 29);
        break;
      case "thismonth":
        a = new Date(e.getFullYear(), e.getMonth(), 1), s = new Date(e.getFullYear(), e.getMonth() + 1, 0);
        break;
      case "lastmonth":
        a = new Date(e.getFullYear(), e.getMonth() - 1, 1), s = new Date(e.getFullYear(), e.getMonth(), 0);
        break;
      case "thisyear":
        a = new Date(e.getFullYear(), 0, 1), s = new Date(e.getFullYear(), 11, 31);
        break;
    }
    return { start: a, end: s };
  }
};
L.MONTH_NAMES = [
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
], L.MONTH_NAMES_SHORT = [
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
let y = L;
class v extends D {
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
    const e = t.dataset.calendarData, a = t.dataset.disabled === "true";
    let s;
    try {
      s = e ? JSON.parse(e) : {};
    } catch (n) {
      console.error("Failed to parse calendar data:", n), s = {};
    }
    const i = {
      currentMonth: s.currentMonth || this.getCurrentYearMonth(),
      selectedDate: s.selectedDate || null,
      startDate: s.startDate || null,
      endDate: s.endDate || null,
      focusedDate: s.selectedDate || s.startDate || this.getTodayDate(),
      isRange: s.isRange || !1,
      monthsToShow: s.monthsToShow || 1,
      rangeSelectionState: "none",
      isDisabled: a,
      minDate: s.minDate || null,
      maxDate: s.maxDate || null,
      disabledDates: s.disabledDates || [],
      weekdays: s.weekdays || ["S", "M", "T", "W", "T", "F", "S"],
      monthNames: s.monthNames || [
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
    c.handleDelegatedClick("[data-calendar-date]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const a = r.findClosest(t, '[data-calendar="true"]');
        a && !this.isCalendarDisabled(a) && this.selectDate(a, t.dataset.calendarDate);
      }
    }), c.handleDelegatedClick("[data-calendar-nav]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const a = r.findClosest(t, '[data-calendar="true"]'), s = t.dataset.calendarNav;
        a && !this.isCalendarDisabled(a) && this.navigateMonth(a, s);
      }
    }), c.handleDelegatedClick("[data-calendar-action]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const a = r.findClosest(t, '[data-calendar="true"]'), s = t.dataset.calendarAction;
        a && !this.isCalendarDisabled(a) && this.handleFooterAction(a, s);
      }
    }), c.handleDelegatedClick("[data-calendar-month-year-btn]", (t, e) => {
      if (!t.disabled) {
        e.preventDefault();
        const a = r.findClosest(t, '[data-calendar="true"]');
        a && !this.isCalendarDisabled(a) && this.toggleMonthYearDropdown(a);
      }
    }), c.handleDelegatedClick("[data-calendar-month]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-calendar="true"]'), s = parseInt(t.dataset.calendarMonth);
      a && !this.isCalendarDisabled(a) && this.selectMonth(a, s);
    }), c.handleDelegatedClick("[data-calendar-year]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-calendar="true"]'), s = parseInt(t.dataset.calendarYear);
      a && !this.isCalendarDisabled(a) && this.selectYear(a, s);
    }), c.handleDelegatedKeydown('[data-calendar="true"]', (t, e) => {
      if (e.key === "Escape") {
        const a = this.getState(t);
        if (a && a.viewMode !== "calendar") {
          e.preventDefault(), a.viewMode = "calendar", this.setState(t, a), this.renderCalendarGrid(t);
          const s = r.querySelector("[data-calendar-month-year-btn]", t);
          s && s.focus();
          return;
        }
      }
      this.handleKeydown(t, e);
    }), c.handleDelegatedFocus("[data-calendar-date]", (t) => {
      const e = r.findClosest(t, '[data-calendar="true"]');
      if (e) {
        const a = this.getState(e);
        a && (a.focusedDate = t.dataset.calendarDate, this.setState(e, a));
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
          const a = e;
          r.hasDataAttribute(a, "calendar", "true") && this.initializeCalendar(a), r.findByDataAttribute("calendar", "true", a).forEach((s) => {
            this.initializeCalendar(s);
          });
        }
      });
    });
  }
  /**
   * Select a date (handles both single date and range selection)
   */
  selectDate(t, e) {
    const a = this.getState(t);
    !a || a.isDisabled || (a.isRange ? this.handleRangeSelection(t, e) : (a.selectedDate = e, a.focusedDate = e, this.setState(t, a), this.renderCalendarGrid(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:dateSelected", {
      selectedDate: e,
      formattedDate: this.formatDateForDisplay(e)
    })));
  }
  /**
   * Handle range selection logic
   */
  handleRangeSelection(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const s = new Date(e);
    if (a.rangeSelectionState === "none" || a.rangeSelectionState === "selecting-start")
      a.startDate = e, a.endDate = null, a.rangeSelectionState = "selecting-end", a.focusedDate = e;
    else if (a.rangeSelectionState === "selecting-end") {
      const i = new Date(a.startDate);
      s < i ? (a.endDate = a.startDate, a.startDate = e) : a.endDate = e, a.rangeSelectionState = "none", a.focusedDate = e;
    }
    this.setState(t, a), this.renderCalendarGrid(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:rangeSelected", {
      startDate: a.startDate,
      endDate: a.endDate,
      formattedRange: this.formatRangeForDisplay(a.startDate, a.endDate)
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
  isDateInRange(t, e, a) {
    if (!e || !a) return !1;
    const s = new Date(t), i = new Date(e), n = new Date(a);
    return s >= i && s <= n;
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
    const a = this.getState(t);
    if (!a || a.isDisabled) return;
    const [s, i] = a.currentMonth.split("-").map(Number), n = new Date(s, i - 1, 1);
    e === "prev" ? n.setMonth(n.getMonth() - 1) : n.setMonth(n.getMonth() + 1);
    const o = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
    a.currentMonth = o, this.setState(t, a), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: o,
      year: n.getFullYear(),
      month: n.getMonth() + 1
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const a = this.getState(t);
    if (!a || a.isDisabled) return;
    const s = a.focusedDate;
    if (!s) return;
    let i = null;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault(), i = this.addDaysToDate(s, -1);
        break;
      case "ArrowRight":
        e.preventDefault(), i = this.addDaysToDate(s, 1);
        break;
      case "ArrowUp":
        e.preventDefault(), i = this.addDaysToDate(s, -7);
        break;
      case "ArrowDown":
        e.preventDefault(), i = this.addDaysToDate(s, 7);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this.selectDate(t, s);
        return;
      case "Home":
        e.preventDefault(), i = this.getFirstDayOfMonth(s);
        break;
      case "End":
        e.preventDefault(), i = this.getLastDayOfMonth(s);
        break;
      case "PageUp":
        e.preventDefault(), i = this.addMonthsToDate(s, e.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        e.preventDefault(), i = this.addMonthsToDate(s, e.shiftKey ? 12 : 1);
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
    const [a, s] = e.currentMonth.split("-").map(Number), i = new Date(a, s - 1, 1), n = new Date(a, s, 0), o = new Date(i);
    o.setDate(o.getDate() - o.getDay());
    const l = new Date(n);
    l.setDate(l.getDate() + (6 - l.getDay()));
    const d = [], u = new Date(o);
    for (; u <= l; ) {
      const f = this.formatDateString(u), g = u.getMonth() === s - 1 && u.getFullYear() === a, m = {
        date: f,
        day: u.getDate(),
        isCurrentMonth: g,
        isToday: this.isToday(f),
        isSelected: f === e.selectedDate,
        isDisabled: this.isDateDisabled(t, u)
      };
      e.isRange && (m.isInRange = this.isDateInRange(f, e.startDate, e.endDate), m.isRangeStart = this.isDateRangeStart(f, e.startDate), m.isRangeEnd = this.isDateRangeEnd(f, e.endDate), m.isSelected = m.isRangeStart || m.isRangeEnd), d.push(m), u.setDate(u.getDate() + 1);
    }
    const h = [];
    for (let f = 0; f < d.length; f += 7)
      h.push(d.slice(f, f + 7));
    return h;
  }
  /**
   * Check if a date is disabled
   */
  isDateDisabled(t, e) {
    const a = this.getState(t);
    if (!a || a.isDisabled) return !0;
    const s = this.formatDateString(e);
    return a.minDate && s < a.minDate || a.maxDate && s > a.maxDate ? !0 : a.disabledDates.includes(s);
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
    const a = r.querySelector("[data-calendar-grid-container]", t);
    if (!a) return;
    const s = this.generateCalendarGrid(t);
    let i = '<table class="w-full" role="grid" aria-label="Calendar">';
    i += '<thead><tr role="row">', e.weekdays.forEach((n) => {
      const l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(n)];
      i += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${l}">${n}</th>`;
    }), i += "</tr></thead>", i += "<tbody>", s.forEach((n) => {
      i += '<tr role="row">', n.forEach((o) => {
        const l = this.getDayButtonClasses(o), d = y.createDateAriaLabel(o.date, o.isToday, o.isSelected, o.isRangeStart, o.isRangeEnd, o.isInRange), u = this.getRangeAttributes(o, e);
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
                                ${u}>
                            ${o.day}
                        </button>
                    </td>
                `;
      }), i += "</tr>";
    }), i += "</tbody></table>", a.innerHTML = i;
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
    const [a, s] = e.currentMonth.split("-").map(Number), n = `${e.monthNames[s - 1]} ${a}`, o = r.querySelector(".calendar-month-year-display", t);
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
    const a = r.querySelector("[data-calendar-grid-container]", t);
    if (!a) return;
    const [s, i] = e.currentMonth.split("-").map(Number);
    let n = '<div class="month-grid grid grid-cols-3 gap-1 p-2">';
    e.monthNames.forEach((o, l) => {
      const d = l + 1, u = d === i, h = this.isMonthDisabled(t, s, d);
      n += `
                <button type="button"
                        class="month-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${u ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${h ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-month="${d}"
                        ${h ? "disabled" : ""}>
                    ${o}
                </button>
            `;
    }), n += "</div>", this.animateViewTransition(a, n);
  }
  /**
   * Render year selection grid
   */
  renderYearGrid(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = r.querySelector("[data-calendar-grid-container]", t);
    if (!a) return;
    const [s] = e.currentMonth.split("-").map(Number), i = s - 10, n = s + 10;
    let o = '<div class="year-grid grid grid-cols-4 gap-1 p-2 max-h-64 overflow-y-auto">';
    for (let l = i; l <= n; l++) {
      const d = l === s, u = this.isYearDisabled(t, l);
      o += `
                <button type="button"
                        class="year-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${d ? "bg-brand text-foreground-brand border-brand" : "bg-surface text-foreground border-border"} ${u ? "opacity-50 cursor-not-allowed" : ""}"
                        data-calendar-year="${l}"
                        ${u ? "disabled" : ""}>
                    ${l}
                </button>
            `;
    }
    o += "</div>", a.innerHTML = o;
  }
  /**
   * Select a month
   */
  selectMonth(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const [s] = a.currentMonth.split("-").map(Number), i = `${s}-${String(e).padStart(2, "0")}`;
    a.currentMonth = i, a.viewMode = "calendar", this.setState(t, a), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: i,
      year: s,
      month: e
    });
  }
  /**
   * Select a year
   */
  selectYear(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const [, s] = a.currentMonth.split("-").map(Number), i = `${e}-${String(s).padStart(2, "0")}`;
    a.currentMonth = i, a.viewMode = "calendar", this.setState(t, a), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
      currentMonth: i,
      year: e,
      month: s
    });
  }
  /**
   * Check if a month is disabled
   */
  isMonthDisabled(t, e, a) {
    const s = this.getState(t);
    if (!s) return !1;
    const i = `${e}-${String(a).padStart(2, "0")}-01`, n = new Date(e, a, 0).getDate(), o = `${e}-${String(a).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    return !!(s.minDate && o < s.minDate || s.maxDate && i > s.maxDate);
  }
  /**
   * Check if a year is disabled
   */
  isYearDisabled(t, e) {
    const a = this.getState(t);
    if (!a) return !1;
    const s = `${e}-01-01`, i = `${e}-12-31`;
    return !!(a.minDate && i < a.minDate || a.maxDate && s > a.maxDate);
  }
  /**
   * Focus a specific date
   */
  focusDate(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const [s, i] = e.split("-").map(Number), [n, o] = a.currentMonth.split("-").map(Number);
    if (s !== n || i !== o) {
      const l = `${s}-${String(i).padStart(2, "0")}`;
      a.currentMonth = l, this.setState(t, a), this.renderCalendarGrid(t), this.updateMonthYearDisplay(t), this.dispatchCalendarEvent(t, "calendar:monthChanged", {
        currentMonth: l,
        year: s,
        month: i
      });
    }
    a.focusedDate = e, this.setState(t, a), p.createTimer(() => {
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
    const a = new Date(t);
    return a.setDate(a.getDate() + e), this.formatDateString(a);
  }
  /**
   * Utility: Add months to a date string
   */
  addMonthsToDate(t, e) {
    const a = new Date(t);
    return a.setMonth(a.getMonth() + e), this.formatDateString(a);
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
  dispatchCalendarEvent(t, e, a = null) {
    c.dispatchCustomEvent(t, e, {
      calendar: t,
      ...a
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
    const a = this.getState(t);
    a && (a.selectedDate = e, e && (a.focusedDate = e), this.setState(t, a), this.updateCalendarDisplay(t), this.updateHiddenInput(t), this.dispatchCalendarEvent(t, "calendar:dateSelected", {
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
    const a = r.querySelectorAll("[data-calendar-grid-container]", t);
    if (a.length === 0) return;
    const s = /* @__PURE__ */ new Date(e.currentMonth + "-01");
    a.forEach((i, n) => {
      const o = new Date(s);
      o.setMonth(s.getMonth() + n);
      const l = {
        ...e,
        currentMonth: `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`
      }, d = this.generateCalendarGridForMonth(t, l, n, a.length);
      let u = `<div class="calendar-month-header">${e.monthNames[o.getMonth()]} ${o.getFullYear()}</div>`;
      u += '<table class="w-full" role="grid" aria-label="Calendar">', u += '<thead><tr role="row">', e.weekdays.forEach((h) => {
        const g = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][e.weekdays.indexOf(h)];
        u += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${g}">${h}</th>`;
      }), u += "</tr></thead>", u += "<tbody>", d.forEach((h) => {
        u += '<tr role="row">', h.forEach((f) => {
          const g = this.getDayButtonClasses(f), m = y.createDateAriaLabel(f.date, f.isToday, f.isSelected, f.isRangeStart, f.isRangeEnd, f.isInRange), S = this.getRangeAttributes(f, e);
          u += `
                        <td class="calendar-day text-center relative" role="gridcell">
                            <button type="button"
                                    class="${g}"
                                    data-calendar-date="${f.date}"
                                    data-is-current-month="${f.isCurrentMonth}"
                                    ${f.isDisabled ? "disabled" : ""}
                                    aria-selected="${f.isSelected}"
                                    aria-label="${m}"
                                    data-is-today="${f.isToday}"
                                    ${S}>
                                ${f.day}
                            </button>
                        </td>
                    `;
        }), u += "</tr>";
      }), u += "</tbody></table>", i.innerHTML = u;
    });
  }
  /**
   * Generate calendar grid for a specific month
   */
  generateCalendarGridForMonth(t, e, a = 0, s = 1) {
    const i = this.getState(t);
    if (!i) return [];
    this.setState(t, { ...i, currentMonth: e.currentMonth });
    let n = this.generateCalendarGrid(t);
    return s > 1 && a < s - 1 && n[n.length - 1].some((d) => !d.isCurrentMonth && d.day <= 15) && (n = n.slice(0, -1)), this.setState(t, i), n;
  }
  /**
   * Get range attributes for a day button
   */
  getRangeAttributes(t, e) {
    if (!e.isRange) return "";
    const a = [];
    return t.isInRange && a.push('data-is-in-range="true"'), t.isRangeStart && a.push('data-is-range-start="true"'), t.isRangeEnd && a.push('data-is-range-end="true"'), a.join(" ");
  }
  /**
   * Update hidden input for range selection
   */
  updateHiddenInput(t) {
    const e = this.getState(t);
    if (e)
      if (e.isRange) {
        const a = r.querySelector(".calendar-start-input", t), s = r.querySelector(".calendar-end-input", t), i = r.querySelector(".calendar-range-input", t);
        if (a && (a.value = e.startDate || ""), s && (s.value = e.endDate || ""), i) {
          const n = e.startDate && e.endDate ? `${e.startDate},${e.endDate}` : e.startDate || "";
          i.value = n;
        }
      } else {
        const a = r.querySelector(".calendar-hidden-input", t);
        a && (a.value = e.selectedDate || "");
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
    const a = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    this.isDateDisabled(t, /* @__PURE__ */ new Date()) || (this.navigateToToday(t), this.selectDate(t, a));
  }
  /**
   * Navigate calendar to show today's month
   */
  navigateToToday(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = /* @__PURE__ */ new Date(), s = `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}`;
    e.currentMonth !== s && (e.currentMonth = s, this.setState(t, e), this.renderCalendarDisplay(t));
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
  v.getInstance().init();
}) : v.getInstance().init();
window.CalendarActions = v;
v.getInstance();
class q extends D {
  /**
   * Initialize radio elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick("label[for]", (t) => {
      const e = t.getAttribute("for");
      if (!e) return;
      const a = r.getElementById(e);
      !a || a.type !== "radio" || this.focusRadioInput(a);
    }), c.handleDelegatedKeydown('input[type="radio"]', (t, e) => {
      c.createNavigationHandler({
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
    const e = this.getRadioGroup(t), s = (e.indexOf(t) + 1) % e.length, i = e[s];
    i && (i.focus(), i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(i));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(t) {
    const e = this.getRadioGroup(t), a = e.indexOf(t), s = a === 0 ? e.length - 1 : a - 1, i = e[s];
    i && (i.focus(), i.checked = !0, i.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(i));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(t) {
    const e = t.name;
    return e ? Array.from(r.querySelectorAll(`input[type="radio"][name="${e}"]`)).filter((s) => !s.disabled) : [t];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(t) {
    c.dispatchCustomEvent(t, "radio-focus", {
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
    return c.addEventListener(document, "radio-focus", (e) => {
      t(e.detail.radio);
    });
  }
  /**
   * Clean up RadioActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
q.getInstance();
class E extends D {
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
    const a = {
      min: parseFloat(e.dataset.min || "0"),
      max: parseFloat(e.dataset.max || "100"),
      step: parseFloat(e.dataset.step || "1"),
      dual: e.dataset.dual === "true",
      ticks: e.dataset.ticks ? JSON.parse(e.dataset.ticks) : [],
      disabled: e.dataset.disabled === "true"
    }, s = this.getElements(t, a);
    if (!s.track) return;
    const i = {
      minValue: a.dual ? parseFloat(((n = s.inputs.min) == null ? void 0 : n.value) || a.min.toString()) : a.min,
      maxValue: a.dual ? parseFloat(((o = s.inputs.max) == null ? void 0 : o.value) || a.max.toString()) : a.max,
      singleValue: a.dual ? a.min : parseFloat(((l = s.inputs.single) == null ? void 0 : l.value) || a.min.toString()),
      isDragging: !1,
      activeHandle: null
    };
    this.setState(t, { config: a, state: i, elements: s }), a.disabled || this.setupHandleInteractions(t, s);
  }
  /**
   * Get all relevant elements for a range component
   */
  getElements(t, e) {
    const a = r.querySelector(".range-track", t), s = r.querySelector(".range-fill", t), i = {}, n = {}, o = {}, l = {};
    return e.dual ? (i.min = r.querySelector('[data-handle="min"]', t), i.max = r.querySelector('[data-handle="max"]', t), n.min = r.querySelector('[data-native-input="min"]', t), n.max = r.querySelector('[data-native-input="max"]', t), o.min = r.querySelector('[data-range-input="min"]', t), o.max = r.querySelector('[data-range-input="max"]', t), l.min = r.querySelector('[data-value-display="min"]', t), l.max = r.querySelector('[data-value-display="max"]', t)) : (i.single = r.querySelector('[data-handle="single"]', t), n.single = r.querySelector('[data-native-input="single"]', t), o.single = r.querySelector('[data-range-input="single"]', t), l.single = r.querySelector('[data-value-display="single"]', t)), {
      container: t,
      track: a,
      fill: s,
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
    const { handles: a } = e;
    Object.entries(a).forEach(([s, i]) => {
      i && (i.addEventListener("mousedown", (n) => this.handleStart(n, t, s)), i.addEventListener("touchstart", (n) => this.handleStart(n, t, s), { passive: !1 }), i.addEventListener("keydown", (n) => this.handleKeydown(n, t, s)), i.addEventListener("focus", () => this.handleFocus(t, s)), i.addEventListener("blur", () => this.handleBlur(t, s)));
    }), e.track.addEventListener("click", (s) => this.handleTrackClick(s, t));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.addEventListener(document, "mousemove", (t) => this.handleMove(t)), c.addEventListener(document, "mouseup", (t) => this.handleEnd(t)), c.addEventListener(document, "touchmove", (t) => this.handleMove(t), { passive: !1 }), c.addEventListener(document, "touchend", (t) => this.handleEnd(t)), c.addEventListener(document, "touchcancel", (t) => this.handleEnd(t));
  }
  /**
   * Setup dynamic observer for new ranges - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const a = e;
          r.hasDataAttribute(a, "range", "true") && this.initializeRange(a), r.findByDataAttribute("range", "true", a).forEach((s) => {
            this.initializeRange(s);
          });
        }
      });
    });
  }
  /**
   * Handle drag start
   */
  handleStart(t, e, a) {
    t.preventDefault();
    const s = this.getState(e);
    if (!s || s.config.disabled) return;
    s.state.isDragging = !0, s.state.activeHandle = a;
    const i = s.elements.handles[a];
    i && (i.classList.add("dragging"), i.focus()), e.classList.add("dragging"), document.body.style.userSelect = "none";
  }
  /**
   * Handle drag move
   */
  handleMove(t) {
    const e = Array.from(this.getAllStates().entries()).find(([f, g]) => g.state.isDragging);
    if (!e) return;
    t.preventDefault();
    const [a, s] = e, { config: i, state: n, elements: o } = s, l = "touches" in t ? t.touches[0].clientX : t.clientX, d = o.track.getBoundingClientRect(), u = Math.max(0, Math.min(1, (l - d.left) / d.width));
    let h = this.percentageToValue(u, i);
    h = this.snapToTickIfNeeded(h, i), this.updateValue(a, n.activeHandle, h);
  }
  /**
   * Handle drag end
   */
  handleEnd(t) {
    const e = Array.from(this.getAllStates().entries()).find(([n, o]) => o.state.isDragging);
    if (!e) return;
    const [a, s] = e;
    s.state.isDragging = !1;
    const i = s.elements.handles[s.state.activeHandle];
    i && i.classList.remove("dragging"), a.classList.remove("dragging"), s.state.activeHandle = null, document.body.style.userSelect = "", this.dispatchChangeEvent(a);
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e, a) {
    const s = this.getState(e);
    if (!s || s.config.disabled) return;
    const { config: i, state: n } = s;
    let o = !1, l;
    const d = a === "min" ? n.minValue : a === "max" ? n.maxValue : n.singleValue;
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
    o && (t.preventDefault(), l = this.snapToTickIfNeeded(l, i), this.updateValue(e, a, l), this.dispatchChangeEvent(e));
  }
  /**
   * Handle track click to jump to position
   */
  handleTrackClick(t, e) {
    const a = this.getState(e);
    if (!a || a.config.disabled) return;
    const { config: s, state: i } = a, n = a.elements.track.getBoundingClientRect(), o = (t.clientX - n.left) / n.width;
    let l = this.percentageToValue(o, s);
    if (l = this.snapToTickIfNeeded(l, s), s.dual) {
      const d = Math.abs(l - i.minValue), u = Math.abs(l - i.maxValue), h = d <= u ? "min" : "max";
      this.updateValue(e, h, l);
    } else
      this.updateValue(e, "single", l);
    this.dispatchChangeEvent(e);
  }
  /**
   * Update a handle's value and visual position
   */
  updateValue(t, e, a) {
    const s = this.getState(t);
    if (!s) return;
    const { config: i, state: n, elements: o } = s;
    i.dual ? e === "min" ? (a = Math.min(a, n.maxValue), n.minValue = a) : e === "max" && (a = Math.max(a, n.minValue), n.maxValue = a) : n.singleValue = a, this.updateVisualElements(t), this.updateFormInputs(t), this.dispatchInputEvent(t);
  }
  /**
   * Update visual elements (handles, fill, value displays)
   */
  updateVisualElements(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: a, state: s, elements: i } = e;
    if (a.dual) {
      const n = this.valueToPercentage(s.minValue, a), o = this.valueToPercentage(s.maxValue, a);
      i.handles.min && (i.handles.min.style.left = `${n}%`, i.handles.min.setAttribute("aria-valuenow", s.minValue.toString()), i.handles.min.setAttribute("aria-valuetext", s.minValue.toString())), i.handles.max && (i.handles.max.style.left = `${o}%`, i.handles.max.setAttribute("aria-valuenow", s.maxValue.toString()), i.handles.max.setAttribute("aria-valuetext", s.maxValue.toString())), i.fill.style.left = `${n}%`, i.fill.style.width = `${o - n}%`, i.valueDisplays.min && (i.valueDisplays.min.textContent = s.minValue.toString()), i.valueDisplays.max && (i.valueDisplays.max.textContent = s.maxValue.toString());
    } else {
      const n = this.valueToPercentage(s.singleValue, a);
      i.handles.single && (i.handles.single.style.left = `${n}%`, i.handles.single.setAttribute("aria-valuenow", s.singleValue.toString()), i.handles.single.setAttribute("aria-valuetext", s.singleValue.toString())), i.fill.style.width = `${n}%`, i.valueDisplays.single && (i.valueDisplays.single.textContent = s.singleValue.toString());
    }
  }
  /**
   * Update form inputs for submission
   */
  updateFormInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const { config: a, state: s, elements: i } = e;
    a.dual ? (i.inputs.min && (i.inputs.min.value = s.minValue.toString()), i.inputs.max && (i.inputs.max.value = s.maxValue.toString()), i.hiddenInputs.min && (i.hiddenInputs.min.value = s.minValue.toString()), i.hiddenInputs.max && (i.hiddenInputs.max.value = s.maxValue.toString())) : (i.inputs.single && (i.inputs.single.value = s.singleValue.toString()), i.hiddenInputs.single && (i.hiddenInputs.single.value = s.singleValue.toString()));
  }
  /**
   * Convert percentage to value
   */
  percentageToValue(t, e) {
    const a = e.max - e.min;
    let s = e.min + t * a;
    return s = Math.round(s / e.step) * e.step, Math.max(e.min, Math.min(e.max, s));
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
    let a = e.ticks[0], s = Math.abs(t - a);
    for (const i of e.ticks) {
      const n = Math.abs(t - i);
      n < s && (a = i, s = n);
    }
    return a;
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
    const { config: a, state: s } = e, i = a.dual ? [s.minValue, s.maxValue] : s.singleValue;
    c.dispatchCustomEvent(t, "range-input", {
      value: i,
      dual: a.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), a.dual ? ((n = e.elements.hiddenInputs.min) == null || n.dispatchEvent(new Event("input", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("input", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  /**
   * Dispatch change event when interaction is complete
   */
  dispatchChangeEvent(t) {
    var n, o, l;
    const e = this.getState(t);
    if (!e) return;
    const { config: a, state: s } = e, i = a.dual ? [s.minValue, s.maxValue] : s.singleValue;
    c.dispatchCustomEvent(t, "range-change", {
      value: i,
      dual: a.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), a.dual ? ((n = e.elements.hiddenInputs.min) == null || n.dispatchEvent(new Event("change", { bubbles: !0 })), (o = e.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("change", { bubbles: !0 }))) : (l = e.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Get current value for a range component
   */
  getValue(t) {
    const e = this.getState(t);
    if (!e) return null;
    const { config: a, state: s } = e;
    return a.dual ? [s.minValue, s.maxValue] : s.singleValue;
  }
  /**
   * Set value for a range component
   */
  setValue(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const { config: s } = a;
    s.dual && Array.isArray(e) ? (this.updateValue(t, "min", e[0]), this.updateValue(t, "max", e[1])) : !s.dual && typeof e == "number" && this.updateValue(t, "single", e), this.dispatchChangeEvent(t);
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
  E.getInstance().init();
}) : E.getInstance().init();
window.RangeActions = E;
E.getInstance();
class V extends D {
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
    const e = t.dataset.multiple === "true", a = t.dataset.value;
    let s = [];
    if (a)
      try {
        s = e ? JSON.parse(a) : [a];
      } catch {
        s = e ? [] : [a];
      }
    const i = {
      isOpen: !1,
      selectedValues: s,
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
    c.handleDelegatedClick("[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]", (t, e) => {
      if (t.matches("[data-remove-chip]")) {
        e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
        const a = t.dataset.removeChip, s = r.findClosest(t, '[data-select="true"]');
        s && a && this.removeChip(s, a);
        return;
      }
      if (t.matches("[data-select-clear]")) {
        e.preventDefault(), e.stopPropagation();
        const a = r.findClosest(t, '[data-select="true"]');
        a && this.clearSelection(a);
        return;
      }
      if (t.matches("[data-select-option]")) {
        e.preventDefault(), e.stopPropagation();
        const a = r.findClosest(t, '[data-select="true"]');
        a && this.selectOption(a, t);
        return;
      }
      if (t.matches("[data-select-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const a = r.findClosest(t, '[data-select="true"]');
        a && !this.isDisabled(a) && this.toggleDropdown(a);
        return;
      }
      if (t.matches("[data-select-search]")) {
        e.stopPropagation();
        return;
      }
    }), c.addEventListener(document, "click", (t) => {
      var a;
      const e = t.target;
      if (e && e instanceof Element) {
        const s = (a = e.closest("[data-select-search]")) == null ? void 0 : a.parentElement;
        if (s && r.querySelector("[data-select-search]", s)) {
          t.stopPropagation();
          return;
        }
        e.closest("[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]") || this.closeAllDropdowns();
      }
    }), c.handleDelegatedInput("[data-select-search]", (t, e) => {
      const a = r.findClosest(t, '[data-select="true"]');
      a && this.handleSearch(a, t.value);
    }), c.handleDelegatedKeydown('[data-select="true"]', (t, e) => {
      this.handleKeydown(t, e);
    }), c.handleDelegatedFocus('[data-select="true"]', (t, e) => {
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
          const a = e;
          r.hasDataAttribute(a, "select", "true") && (this.hasState(a) || this.initializeSelect(a)), r.findByDataAttribute("select", "true", a).forEach((i) => {
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
    const a = r.querySelector("[data-select-dropdown]", t), s = r.querySelector("[data-select-trigger]", t), i = r.querySelector("[data-select-search]", t);
    if (a && (a.classList.remove("hidden"), this.positionDropdown(t)), s) {
      s.setAttribute("aria-expanded", "true");
      const n = r.querySelector(".select-arrow", s);
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
    const a = r.querySelector("[data-select-dropdown]", t), s = r.querySelector("[data-select-trigger]", t), i = r.querySelector("[data-select-search]", t);
    if (a && a.classList.add("hidden"), s) {
      s.setAttribute("aria-expanded", "false");
      const n = r.querySelector(".select-arrow", s);
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
    const a = this.getState(t), s = e.dataset.value;
    if (!a || !s || e.getAttribute("aria-disabled") === "true")
      return;
    const i = t.dataset.multiple === "true";
    if (i) {
      const n = a.selectedValues.indexOf(s);
      n > -1 ? a.selectedValues.splice(n, 1) : a.selectedValues.push(s);
    } else
      a.selectedValues = [s], this.closeDropdown(t);
    this.setState(t, a), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: i ? a.selectedValues : s,
      selectedValues: a.selectedValues
    });
  }
  /**
   * Remove chip (for multiple selection)
   */
  removeChip(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const s = a.selectedValues.indexOf(e);
    s > -1 && (a.selectedValues.splice(s, 1), this.setState(t, a), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: a.selectedValues,
      selectedValues: a.selectedValues
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
    const a = this.getState(t);
    a && (a.searchTerm = e.toLowerCase(), this.setState(t, a), this.updateFilteredOptions(t), this.updateOptionsVisibility(t));
  }
  /**
   * Update filtered options based on search term
   */
  updateFilteredOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = this.getAllOptions(t);
    e.searchTerm ? e.filteredOptions = a.filter(
      (s) => s.searchableText.includes(e.searchTerm)
    ) : e.filteredOptions = a, this.setState(t, e);
  }
  /**
   * Update options visibility based on filter
   */
  updateOptionsVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = r.querySelectorAll("[data-select-option]", t), s = r.querySelector("[data-select-no-results]", t);
    let i = 0;
    a.forEach((n) => {
      const o = n, l = o.dataset.value || "";
      e.filteredOptions.some((u) => u.value === l) ? (o.style.display = "", i++) : o.style.display = "none";
    }), s && (i === 0 && e.searchTerm ? s.classList.remove("hidden") : s.classList.add("hidden"));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const a = this.getState(t);
    if (a)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!a.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (a.focusedIndex >= 0) {
            e.preventDefault();
            const s = a.filteredOptions[a.focusedIndex];
            s && this.selectOption(t, s.element);
          }
          break;
        case "Escape":
          if (a.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const s = r.querySelector("[data-select-trigger]", t);
            s && s.focus();
          }
          break;
        case "ArrowDown":
          a.isOpen ? (e.preventDefault(), this.navigateOptions(t, 1)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "ArrowUp":
          a.isOpen && (e.preventDefault(), this.navigateOptions(t, -1));
          break;
        case "Tab":
          a.isOpen && this.closeDropdown(t);
          break;
      }
  }
  /**
   * Navigate through options with arrow keys
   */
  navigateOptions(t, e) {
    const a = this.getState(t);
    if (!a || !a.isOpen) return;
    const s = a.filteredOptions.length;
    s !== 0 && (a.focusedIndex === -1 ? a.focusedIndex = e > 0 ? 0 : s - 1 : (a.focusedIndex += e, a.focusedIndex >= s ? a.focusedIndex = 0 : a.focusedIndex < 0 && (a.focusedIndex = s - 1)), this.setState(t, a), this.updateOptionFocus(t));
  }
  /**
   * Update visual focus state of options
   */
  updateOptionFocus(t) {
    const e = this.getState(t);
    if (!e) return;
    r.querySelectorAll("[data-select-option]", t).forEach((s, i) => {
      const n = s;
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
    const a = r.querySelector("[data-select-chips]", t);
    if (a)
      if (a.innerHTML = "", e.selectedValues.length === 0) {
        const s = t.dataset.placeholder || "Select options...";
        a.innerHTML = `<span class="text-neutral-500 select-placeholder">${s}</span>`;
      } else
        e.selectedValues.forEach((s) => {
          const i = this.findOptionByValue(t, s), n = i ? i.displayLabel : s, o = t.dataset.clearable === "true" && !this.isDisabled(t), l = `select-chip-${this.generateChipId(s)}`, d = document.createElement("button");
          d.type = "button", d.className = "inline-flex items-center gap-1 font-medium cursor-pointer transition-colors px-1.5 py-0.5 text-xs rounded-sm", d.style.cssText = `
                    background-color: var(--color-brand-50);
                    color: var(--color-brand-700);
                    border: 1px solid var(--color-brand-200);
                `, d.setAttribute("data-chip-value", s), d.setAttribute("data-remove-chip", s), d.setAttribute("data-dismiss-target", `#${l}`), d.setAttribute("aria-label", "Remove badge"), d.id = l, d.addEventListener("mouseenter", () => {
            d.style.backgroundColor = "var(--color-brand-100)";
          }), d.addEventListener("mouseleave", () => {
            d.style.backgroundColor = "var(--color-brand-50)";
          });
          const u = document.createElement("span");
          if (u.textContent = n, d.appendChild(u), o) {
            const h = document.createElement("span");
            h.className = "text-brand-600 hover:text-brand-700 ml-1 flex-shrink-0 font-bold leading-none", h.textContent = "×", h.setAttribute("aria-hidden", "true"), d.appendChild(h);
            const f = document.createElement("span");
            f.className = "sr-only", f.textContent = "Remove badge", d.appendChild(f);
          }
          a.appendChild(d);
        });
  }
  /**
   * Update single value display
   */
  updateSingleValueDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = r.querySelector(".select-value", t);
    if (a)
      if (e.selectedValues.length === 0) {
        const s = t.dataset.placeholder || "Select option...";
        a.innerHTML = `<span class="text-neutral-500 select-placeholder">${s}</span>`;
      } else {
        const s = e.selectedValues[0], i = this.findOptionByValue(t, s), n = i ? i.displayLabel : s;
        a.textContent = n;
      }
  }
  /**
   * Update hidden form inputs
   */
  updateHiddenInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = t.dataset.multiple === "true", s = t.dataset.name;
    if (!s) return;
    if (r.querySelectorAll(".select-hidden-input", t).forEach((n) => n.remove()), a)
      e.selectedValues.forEach((n) => {
        const o = document.createElement("input");
        o.type = "hidden", o.name = `${s}[]`, o.value = n, o.className = "select-hidden-input", t.appendChild(o);
      });
    else {
      const n = document.createElement("input");
      n.type = "hidden", n.name = s, n.value = e.selectedValues[0] || "", n.className = "select-hidden-input", t.appendChild(n);
    }
  }
  /**
   * Update options selected state attributes
   */
  updateOptionsSelectedState(t) {
    const e = this.getState(t);
    if (!e) return;
    r.querySelectorAll("[data-select-option]", t).forEach((s) => {
      var l, d, u, h;
      const i = s, n = i.dataset.value || "", o = e.selectedValues.includes(n);
      if (i.setAttribute("aria-selected", o ? "true" : "false"), o) {
        i.classList.add("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const f = r.querySelector(".text-brand-600", i);
        f && ((l = f.parentElement) == null || l.classList.remove("opacity-0"), (d = f.parentElement) == null || d.classList.add("opacity-100"));
      } else {
        i.classList.remove("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const f = r.querySelector(".text-brand-600", i);
        f && ((u = f.parentElement) == null || u.classList.add("opacity-0"), (h = f.parentElement) == null || h.classList.remove("opacity-100"));
      }
    });
  }
  /**
   * Update options list
   */
  updateOptions(t) {
    const e = this.getAllOptions(t), a = this.getState(t);
    a && (a.filteredOptions = e, this.setState(t, a));
  }
  /**
   * Get all options from select element
   */
  getAllOptions(t) {
    const e = r.querySelectorAll("[data-select-option]", t);
    return Array.from(e).map((a) => {
      var n, o;
      const s = a, i = s.dataset.displayLabel || ((n = s.textContent) == null ? void 0 : n.trim()) || "";
      return {
        element: s,
        value: s.dataset.value || "",
        label: ((o = s.textContent) == null ? void 0 : o.trim()) || "",
        displayLabel: i,
        searchableText: s.dataset.searchableText || "",
        disabled: s.getAttribute("aria-disabled") === "true"
      };
    });
  }
  /**
   * Find option by value
   */
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((s) => s.value === e) || null;
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = r.querySelector("[data-select-dropdown]", t), a = r.querySelector("[data-select-trigger]", t);
    if (!e || !a) return;
    const s = a.getBoundingClientRect(), i = e.getBoundingClientRect(), o = window.innerHeight - s.bottom, l = s.top, d = i.height || 240;
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
  dispatchSelectEvent(t, e, a = null) {
    c.dispatchCustomEvent(t, e, {
      select: t,
      ...a
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
    const a = this.getState(t);
    if (!a) return;
    const s = t.dataset.multiple === "true";
    a.selectedValues = s ? e : e.slice(0, 1), this.setState(t, a), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: s ? a.selectedValues : a.selectedValues[0] || "",
      selectedValues: a.selectedValues
    });
  }
  /**
   * Clean up SelectActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
V.getInstance();
class H extends D {
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
    const e = t.dataset.orientation || "horizontal", a = t.dataset.variant || "default", s = t.dataset.disabled === "true", i = t.dataset.value, n = Array.from(r.querySelectorAll('[data-tabs-trigger="true"]', t)), o = Array.from(r.querySelectorAll('[data-tabs-panel="true"]', t));
    let l = i || null;
    if (!l && n.length > 0) {
      const u = n.find((h) => h.getAttribute("aria-disabled") !== "true");
      l = (u == null ? void 0 : u.dataset.value) || null;
    }
    const d = {
      activeTab: l,
      tabs: n,
      panels: o,
      orientation: e,
      variant: a,
      disabled: s
    };
    this.setState(t, d), this.updateTabsState(t), this.initializeMarker(t), t.classList.add("tabs-initialized");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick('[data-tabs-trigger="true"]', (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-tabs="true"]');
      a && t.getAttribute("aria-disabled") !== "true" && this.activateTab(a, t.dataset.value || "");
    }), c.handleDelegatedKeydown('[data-tabs-trigger="true"]', (t, e) => {
      const a = r.findClosest(t, '[data-tabs="true"]');
      a && this.handleKeydown(a, e);
    }), this.resizeCleanup = c.handleResize(() => {
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
          const a = e;
          r.hasDataAttribute(a, "tabs", "true") && (this.hasState(a) || this.initializeTabsElement(a)), r.findByDataAttribute("tabs", "true", a).forEach((i) => {
            this.hasState(i) || this.initializeTabsElement(i);
          });
        }
      });
    });
  }
  /**
   * Activate a specific tab
   */
  activateTab(t, e, a = !1) {
    const s = this.getState(t);
    if (!s || s.disabled) return;
    const i = s.tabs.find((o) => o.dataset.value === e);
    if (!i || i.getAttribute("aria-disabled") === "true")
      return;
    const n = s.activeTab;
    s.activeTab = e, this.setState(t, s), this.updateTabsState(t), this.repositionMarker(t, i), a && i.focus(), c.dispatchCustomEvent(t, "tabs:change", {
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
    e && (e.tabs.forEach((a) => {
      const s = a.dataset.value === e.activeTab, i = a.getAttribute("aria-disabled") === "true";
      a.setAttribute("aria-selected", s ? "true" : "false"), a.setAttribute("data-state", s ? "active" : "inactive"), i ? a.setAttribute("tabindex", "-1") : s ? a.setAttribute("tabindex", "0") : a.setAttribute("tabindex", "-1"), a.id = `tab-${a.dataset.value}`;
    }), e.panels.forEach((a) => {
      const s = a.dataset.value === e.activeTab;
      a.setAttribute("data-state", s ? "active" : "inactive"), a.style.display = s ? "block" : "none", a.setAttribute("aria-labelledby", `tab-${a.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const a = this.getState(t);
    if (!a || a.disabled) return;
    const s = e.target, i = a.tabs.indexOf(s);
    let n = -1;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault(), n = a.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(a, i) : e.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(a, i) : i;
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault(), n = a.orientation === "horizontal" ? this.getNextEnabledTabIndex(a, i) : e.key === "ArrowDown" ? this.getNextEnabledTabIndex(a, i) : i;
        break;
      case "Home":
        e.preventDefault(), n = this.getFirstEnabledTabIndex(a);
        break;
      case "End":
        e.preventDefault(), n = this.getLastEnabledTabIndex(a);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), s.dataset.value && this.activateTab(t, s.dataset.value, !0);
        return;
    }
    if (n >= 0 && n < a.tabs.length) {
      const o = a.tabs[n];
      o.dataset.value && this.activateTab(t, o.dataset.value, !0);
    }
  }
  /**
   * Get next enabled tab index
   */
  getNextEnabledTabIndex(t, e) {
    for (let a = 1; a < t.tabs.length; a++) {
      const s = (e + a) % t.tabs.length;
      if (t.tabs[s].getAttribute("aria-disabled") !== "true")
        return s;
    }
    return e;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(t, e) {
    for (let a = 1; a < t.tabs.length; a++) {
      const s = (e - a + t.tabs.length) % t.tabs.length;
      if (t.tabs[s].getAttribute("aria-disabled") !== "true")
        return s;
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
  setActiveTab(t, e, a = !1) {
    this.activateTab(t, e, a);
  }
  /**
   * Initialize marker position for the active tab
   */
  initializeMarker(t) {
    const e = this.getState(t);
    if (!e || !e.activeTab) return;
    const a = e.tabs.find((s) => s.dataset.value === e.activeTab);
    a && p.createTimer(() => {
      this.repositionMarker(t, a);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const s = r.querySelector('[data-tab-marker="true"]', t);
    if (!s) return;
    const { orientation: i, variant: n } = a;
    i === "vertical" ? this.repositionVerticalMarker(s, e, n) : this.repositionHorizontalMarker(s, e, n);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(t, e, a) {
    const s = e.offsetWidth, i = e.offsetLeft;
    if (t.style.width = `${s}px`, a === "pills") {
      const n = e.offsetHeight, o = e.offsetTop;
      t.style.height = `${n}px`, t.style.transform = `translate(${i}px, ${o}px)`;
    } else
      t.style.transform = `translateX(${i}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(t, e, a) {
    const s = e.offsetHeight, i = e.offsetTop;
    if (t.style.height = `${s}px`, a === "pills") {
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
        const a = t.tabs.find((s) => s.dataset.value === t.activeTab);
        a && this.repositionMarker(e, a);
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
H.getInstance();
class R extends D {
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
    }), t.addEventListener("cancel", (a) => {
      this.handleModalCancel(t, a);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick("[commandfor]", (t, e) => {
      const a = t.getAttribute("command"), s = t.getAttribute("commandfor");
      if (a === "show-modal" && s) {
        const i = r.getElementById(s);
        i && i.matches("dialog[data-modal]") && this.handleModalOpen(i, t);
      }
    }), c.handleDelegatedClick("[data-modal-close]", (t, e) => {
      const a = r.findClosest(t, "dialog[data-modal]");
      a && a.close();
    });
  }
  /**
   * Setup dynamic observer for new modals - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const a = e;
          a.matches && a.matches("dialog[data-modal]") && this.initializeModal(a), r.querySelectorAll("dialog[data-modal]", a).forEach((i) => {
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
    const a = t.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    a.length > 0 && a[0].focus();
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
  dispatchModalEvent(t, e, a = {}) {
    c.dispatchCustomEvent(t, e, {
      modal: t,
      ...a
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
    const a = r.getElementById(t);
    if (!a) return;
    const s = a.getAttribute("wire:model");
    if (s && typeof window.Livewire < "u" && window.Livewire.find) {
      const n = (i = r.findClosest(a, "[wire\\:id]")) == null ? void 0 : i.getAttribute("wire:id");
      if (n) {
        const o = window.Livewire.find(n);
        o && o.set(s, e);
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
    const a = r.getElementById(t);
    return !a || !a.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (this.handleModalOpen(a, e), a.showModal(), this.dispatchLivewireEvent("modalOpened", { id: t, modal: t }), !0);
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
    const a = this.getState(t);
    if (!a) return;
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !0), a.lastFocusedElement = e || document.activeElement, this.setState(t, a), this.dispatchModalEvent(t, "modal:open", { trigger: e }), this.dispatchLivewireEvent("modalOpened", { id: t.id, modal: t.id }), setTimeout(() => {
      this.setInitialFocus(t);
    }, 50);
  }
  /**
   * Clean up ModalActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
R.getInstance();
class A extends D {
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
    c.handleDelegatedClick("[data-toast-dismiss]", (t, e) => {
      const a = t.getAttribute("data-toast-dismiss");
      a && (e.preventDefault(), e.stopPropagation(), this.dismiss(a));
    }), c.handleDelegatedClick("[data-toast-action]", (t, e) => {
      const a = t.getAttribute("data-toast-action"), s = r.findClosest(t, '[data-toast="true"]');
      a && s && (e.preventDefault(), e.stopPropagation(), this.dispatchToastEvent("toast:action", s.id, { action: a }));
    }), c.handleDelegatedEvent("mouseenter", '[data-toast="true"]', (t) => {
      this.pauseTimer(t.id);
    }), c.handleDelegatedEvent("mouseleave", '[data-toast="true"]', (t) => {
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
          const a = e;
          r.hasDataAttribute(a, "toast-container") && this.discoverToasts(), r.findByDataAttribute("toast-container").forEach(() => {
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
      const a = e.getAttribute("data-toast-container");
      a && t.containers.set(a, e);
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
    const a = this.getGlobalState();
    a && (a.toasts.set(t, e), this.setupToastListeners(e));
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
    const a = this.getGlobalState();
    if (!a) return !1;
    const s = e.position || "top-right", i = a.containers.get(s);
    if (!i)
      return !1;
    const n = `toast-${t}-${s}-${++a.toastCounter}`, o = this.createToastElement(n, t, s, e);
    i.appendChild(o), p.fadeIn(o, {
      scale: !0,
      duration: 300,
      onComplete: () => {
        o.setAttribute("data-toast-visible", "true");
      }
    });
    const l = e.duration || 5e3;
    return !(e.persistent === !0) && l > 0 && this.setTimer(n, l), a.toasts.set(n, o), this.setupToastListeners(o), this.dispatchToastEvent("toast:show", n, e), !0;
  }
  /**
   * Create a toast element dynamically
   */
  createToastElement(t, e, a, s) {
    const i = e === "error" ? "danger" : e, n = document.createElement("div");
    return n.className = "pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2", n.setAttribute("data-toast", "true"), n.setAttribute("data-toast-variant", e), n.setAttribute("data-toast-position", a), n.setAttribute("data-toast-visible", "false"), n.setAttribute("role", "alert"), n.setAttribute("aria-live", "polite"), n.id = t, n.innerHTML = `
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
        `, this.updateToastContent(n, s), n;
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
    const a = e.toasts.get(t);
    return a ? (this.clearTimer(t), e.pausedTimers.delete(t), a.setAttribute("data-toast-visible", "false"), a.setAttribute("data-toast-exiting", "true"), p.fadeOut(a, {
      scale: !0,
      duration: 300,
      onComplete: () => {
        a.parentNode && a.parentNode.removeChild(a), e.toasts.delete(t);
      }
    }), this.dispatchToastEvent("toast:dismiss", t), !0) : !1;
  }
  /**
   * Dismiss all visible toasts
   */
  dismissAll() {
    const t = this.getGlobalState();
    t && t.toasts.forEach((e, a) => {
      e.getAttribute("data-toast-visible") === "true" && this.dismiss(a);
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
    const a = r.querySelector("[data-toast-title]", t), s = r.querySelector("[data-toast-message]", t), i = r.querySelector("[data-toast-actions]", t);
    a && e.title ? (a.textContent = e.title, a.classList.remove("hidden")) : a && a.classList.add("hidden"), s && e.message && (s.textContent = e.message), i && e.actions ? (i.innerHTML = e.actions, i.classList.remove("hidden")) : i && i.classList.add("hidden"), t.setAttribute("data-toast-duration", String(e.duration || 5e3)), t.setAttribute("data-toast-persistent", String(e.persistent === !0));
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(t) {
    const e = r.querySelector("[data-toast-title]", t), a = r.querySelector("[data-toast-message]", t), s = r.querySelector("[data-toast-actions]", t);
    e && (e.textContent = "", e.classList.add("hidden")), a && (a.textContent = ""), s && (s.innerHTML = "", s.classList.add("hidden")), t.removeAttribute("data-toast-duration"), t.removeAttribute("data-toast-persistent");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(t, e) {
    const a = this.getGlobalState();
    if (!a) return;
    this.clearTimer(t);
    const s = a.toasts.get(t);
    s && s.setAttribute("data-toast-start-time", String(Date.now()));
    const i = p.createTimer(() => {
      this.dismiss(t);
    }, e);
    a.timers.set(t, i);
  }
  /**
   * Clear timer
   */
  clearTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const a = e.timers.get(t);
    a && (p.clearTimer(a), e.timers.delete(t));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const a = e.timers.get(t), s = e.toasts.get(t);
    if (a && s) {
      p.pauseTimer(a);
      const i = parseInt(s.getAttribute("data-toast-duration") || "5000"), n = parseInt(s.getAttribute("data-toast-start-time") || "0"), o = Date.now() - n, l = Math.max(0, i - o);
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
    const a = e.toasts.get(t), s = e.timers.get(t), i = e.pausedTimers.get(t);
    a && s ? a.getAttribute("data-toast-persistent") === "true" || (p.resumeTimer(s), e.pausedTimers.delete(t)) : a && i && !(a.getAttribute("data-toast-persistent") === "true") && i.remaining > 0 && (this.setTimer(t, i.remaining), e.pausedTimers.delete(t));
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(t, e, a = {}) {
    const s = this.getGlobalState();
    if (!s) return;
    const i = { id: e, toast: e, ...a };
    c.dispatchCustomEvent(document, t, i, {
      bubbles: !0,
      cancelable: !0
    });
    const n = s.toasts.get(e);
    if (n && c.dispatchCustomEvent(n, t, i, {
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
    const a = e.toasts.get(t);
    return a ? {
      id: t,
      visible: a.getAttribute("data-toast-visible") === "true",
      variant: a.getAttribute("data-toast-variant"),
      position: a.getAttribute("data-toast-position"),
      duration: parseInt(a.getAttribute("data-toast-duration") || "0"),
      persistent: a.getAttribute("data-toast-persistent") === "true"
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
  A.getInstance().init();
}) : A.getInstance().init();
window.ToastActions = A;
A.getInstance();
class F extends D {
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
    }, a = r.findClosest(t, '[data-submenu="true"]');
    a && a !== t && (e.parent = a), this.setState(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(t) {
    const e = r.querySelectorAll('[data-submenu="true"]', t), a = this.getState(t);
    a && (a.children = Array.from(e), this.setState(t, a)), e.forEach((s) => {
      this.hasState(s) || this.initializeDropdown(s);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (t, e) => {
      if (t.matches("[data-submenu-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const a = r.findClosest(t, '[data-submenu="true"]');
        a && !this.isDisabled(a) && this.toggleSubmenu(a);
        return;
      }
      if (t.matches("[data-dropdown-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const a = r.findClosest(t, '[data-dropdown="true"]');
        a && !this.isDisabled(a) && this.toggleDropdown(a);
        return;
      }
      if (t.matches("[data-menu-item]")) {
        const a = r.findClosest(t, '[data-dropdown="true"]');
        a && (t.dataset.keepOpen === "true" || this.closeDropdown(a));
        return;
      }
      if (t.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (e.stopPropagation(), !(t.dataset.keepOpen !== "false")) {
          const s = r.findClosest(t, '[data-dropdown="true"]');
          s && this.closeDropdown(s);
        }
        return;
      }
      if (t.matches("[data-dropdown-panel], [data-submenu-panel]")) {
        e.stopPropagation();
        return;
      }
    }), c.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]") || this.closeAllDropdowns());
    }), c.addEventListener(document, "mouseenter", (t) => {
      const e = r.findClosest(t.target, "[data-submenu-trigger]");
      if (e && !this.isMobile()) {
        const a = r.findClosest(e, '[data-submenu="true"]');
        a && !this.isDisabled(a) && (this.closeSiblingSubmenus(a), setTimeout(() => {
          e.matches(":hover") && this.openSubmenu(a);
        }, 100));
      }
    }, { capture: !0 }), c.addEventListener(document, "mouseleave", (t) => {
      const e = r.findClosest(t.target, '[data-submenu="true"]');
      if (e && !this.isMobile()) {
        const a = this.getState(e);
        a != null && a.isOpen && setTimeout(() => {
          e.matches(":hover") || this.closeSubmenu(e);
        }, 150);
      }
    }, { capture: !0 }), c.handleDelegatedKeydown('[data-dropdown="true"]', (t, e) => {
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
          const a = e;
          r.hasDataAttribute(a, "dropdown", "true") && (this.hasState(a) || this.initializeDropdown(a)), r.findByDataAttribute("dropdown", "true", a).forEach((i) => {
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
    const a = r.querySelector("[data-dropdown-panel]", t), s = r.querySelector("[data-dropdown-trigger]", t);
    a && (a.classList.remove("hidden"), this.positionDropdown(t)), s && s.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "dropdown:open");
  }
  /**
   * Open submenu
   */
  openSubmenu(t) {
    const e = this.getState(t);
    if (!e || this.isDisabled(t)) return;
    e.isOpen = !0, e.focusedIndex = -1, this.setState(t, e);
    const a = r.querySelector("[data-submenu-panel]", t), s = r.querySelector("[data-submenu-trigger]", t);
    a && (a.classList.remove("hidden"), this.positionSubmenu(t)), s && s.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const a = r.querySelector("[data-dropdown-panel]", t), s = r.querySelector("[data-dropdown-trigger]", t);
    a && a.classList.add("hidden"), s && s.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "dropdown:close");
  }
  /**
   * Close submenu
   */
  closeSubmenu(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const a = r.querySelector("[data-submenu-panel]", t), s = r.querySelector("[data-submenu-trigger]", t);
    a && a.classList.add("hidden"), s && s.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "submenu:close");
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
    this.getAllStates().forEach((a, s) => {
      if (s !== t && a.isOpen) {
        const i = (e == null ? void 0 : e.parent) === s, n = a.parent === t;
        !i && !n && this.closeDropdown(s);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(t) {
    const e = this.getState(t), a = e == null ? void 0 : e.parent;
    if (a) {
      const s = this.getState(a);
      s == null || s.children.forEach((i) => {
        i !== t && this.closeSubmenu(i);
      });
    }
  }
  /**
   * Close all child submenus
   */
  closeChildSubmenus(t) {
    const e = this.getState(t);
    e == null || e.children.forEach((a) => {
      this.closeSubmenu(a);
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
    const a = this.getState(t);
    if (a)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!a.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (a.focusedIndex >= 0) {
            e.preventDefault();
            const s = a.menuItems[a.focusedIndex];
            s && s.click();
          }
          break;
        case "Escape":
          if (a.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const s = r.querySelector("[data-dropdown-trigger]", t);
            s && s.focus();
          }
          break;
        case "ArrowDown":
          a.isOpen ? (e.preventDefault(), this.navigateItems(t, 1)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "ArrowUp":
          a.isOpen && (e.preventDefault(), this.navigateItems(t, -1));
          break;
        case "Tab":
          a.isOpen && this.closeDropdown(t);
          break;
      }
  }
  /**
   * Navigate through menu items with arrow keys
   */
  navigateItems(t, e) {
    const a = this.getState(t);
    if (!a || !a.isOpen) return;
    const s = a.menuItems.length;
    s !== 0 && (a.focusedIndex === -1 ? a.focusedIndex = e > 0 ? 0 : s - 1 : (a.focusedIndex += e, a.focusedIndex >= s ? a.focusedIndex = 0 : a.focusedIndex < 0 && (a.focusedIndex = s - 1)), this.setState(t, a), this.updateItemFocus(t));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(t) {
    const e = this.getState(t);
    e && e.menuItems.forEach((a, s) => {
      s === e.focusedIndex ? (a.classList.add("bg-neutral-100", "dark:bg-neutral-800"), a.scrollIntoView({ block: "nearest" })) : a.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = r.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", t);
    e.menuItems = Array.from(a).filter((s) => {
      const i = s;
      return !i.hasAttribute("disabled") && i.offsetParent !== null;
    }), this.setState(t, e);
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = r.querySelector("[data-dropdown-panel]", t), a = r.querySelector("[data-dropdown-trigger]", t);
    if (!e || !a) return;
    const s = a.getBoundingClientRect(), i = e.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, l = t.dataset.position || "bottom", d = t.dataset.align || "start", u = parseInt(t.dataset.offset || "8");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "";
    const h = n - s.bottom, f = s.top;
    o - s.left, s.right;
    let g = l, m = d;
    switch (l === "bottom" && h < i.height && f > i.height ? g = "top" : l === "top" && f < i.height && h > i.height && (g = "bottom"), g) {
      case "top":
        e.style.bottom = "100%", e.style.marginBottom = `${u}px`;
        break;
      case "bottom":
        e.style.top = "100%", e.style.marginTop = `${u}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${u}px`;
        break;
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${u}px`;
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
    const e = r.querySelector("[data-submenu-panel]", t), a = r.querySelector("[data-submenu-trigger]", t);
    if (!e || !a) return;
    const s = a.getBoundingClientRect(), i = e.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, l = t.dataset.position || "right", d = t.dataset.align || "start", u = parseInt(t.dataset.offset || "4");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "", e.style.transform = "";
    const h = o - s.right, f = s.left;
    n - s.bottom, s.top;
    let g = l;
    switch (l === "right" && h < i.width && f > i.width ? g = "left" : l === "left" && f < i.width && h > i.width && (g = "right"), g) {
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${u}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${u}px`;
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
  dispatchDropdownEvent(t, e, a = null) {
    c.dispatchCustomEvent(t, e, {
      dropdown: t,
      ...a
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
F.getInstance();
class C extends D {
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
    var s;
    if (this.hasState(t))
      return;
    const e = {
      selectedRows: /* @__PURE__ */ new Set(),
      sortColumn: null,
      sortDirection: null,
      selectAllState: "none"
    };
    this.setState(t, e);
    const a = r.querySelector('[data-sorted="true"]', t);
    if (a) {
      const i = a.getAttribute("data-sort-key") || ((s = a.textContent) == null ? void 0 : s.trim()) || "", n = a.getAttribute("data-direction");
      e.sortColumn = i, e.sortDirection = n;
    }
    this.updateSelectionState(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick('[data-sortable="true"]', (t, e) => {
      e.preventDefault(), this.handleSort(t);
    }), c.handleDelegatedChange("[data-table-row-select]", (t) => {
      this.handleRowSelection(t);
    }), c.handleDelegatedChange("[data-table-select-all]", (t) => {
      this.handleSelectAll(t);
    }), c.handleDelegatedKeydown('[data-table="true"]', (t, e) => {
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
          const a = e;
          r.hasDataAttribute(a, "table", "true") && this.initializeTable(a), r.findByDataAttribute("table", "true", a).forEach((s) => {
            this.initializeTable(s);
          });
        }
      });
    });
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || c.addEventListener(document, "livewire:navigated", () => {
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
    const a = this.getState(e);
    if (!a) return;
    const s = t.getAttribute("data-sort-key") || ((n = t.textContent) == null ? void 0 : n.trim()) || "";
    let i = "asc";
    a.sortColumn === s && (a.sortDirection === "asc" ? i = "desc" : a.sortDirection === "desc" && (i = null)), a.sortColumn = i ? s : null, a.sortDirection = i, this.updateSortUI(e, s, i), this.dispatchSortEvent(e, {
      column: s,
      direction: i || "asc",
      url: t.getAttribute("data-sort-url") || void 0,
      livewireMethod: t.getAttribute("data-sort-method") || void 0
    });
  }
  /**
   * Update sort UI indicators
   */
  updateSortUI(t, e, a) {
    if (r.querySelectorAll('[data-sortable="true"]', t).forEach((i) => {
      i.setAttribute("data-sorted", "false"), i.removeAttribute("data-direction"), r.querySelectorAll(".table-sort-icon", i).forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), a) {
      const i = t.querySelector(`[data-sort-key="${e}"]`);
      if (i) {
        i.setAttribute("data-sorted", "true"), i.setAttribute("data-direction", a);
        const n = r.querySelector(".table-sort-icon", i);
        if (n) {
          const o = a === "asc" ? "heroicon-o-chevron-up" : "heroicon-o-chevron-down";
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
    const a = this.getState(e);
    if (!a) return;
    const s = t.getAttribute("data-row-id");
    s && (t.checked ? a.selectedRows.add(s) : a.selectedRows.delete(s), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(a.selectedRows)));
  }
  /**
   * Handle select all checkbox
   */
  handleSelectAll(t) {
    const e = r.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const a = this.getState(e);
    if (!a) return;
    const s = r.querySelectorAll("[data-table-row-select]", e);
    t.checked ? s.forEach((i) => {
      i.checked = !0;
      const n = i.getAttribute("data-row-id");
      n && a.selectedRows.add(n);
    }) : s.forEach((i) => {
      i.checked = !1;
      const n = i.getAttribute("data-row-id");
      n && a.selectedRows.delete(n);
    }), this.updateSelectionState(e), this.dispatchSelectionEvent(e, Array.from(a.selectedRows));
  }
  /**
   * Update selection state and UI
   */
  updateSelectionState(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = r.querySelectorAll("[data-table-row-select]", t), s = r.querySelector("[data-table-select-all]", t), i = a.length, n = e.selectedRows.size;
    n === 0 ? (e.selectAllState = "none", s && (s.checked = !1, s.indeterminate = !1)) : n === i ? (e.selectAllState = "all", s && (s.checked = !0, s.indeterminate = !1)) : (e.selectAllState = "some", s && (s.checked = !1, s.indeterminate = !0)), r.querySelectorAll("[data-table-row]", t).forEach((l) => {
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
    if (c.dispatchCustomEvent(t, "table:sort", e, {
      bubbles: !0,
      cancelable: !0
    }), e.livewireMethod && window.Livewire) {
      const a = t.getAttribute("wire:id");
      if (a) {
        const s = window.Livewire.find(a);
        s && s.call(e.livewireMethod, e.column, e.direction);
      }
    }
  }
  /**
   * Dispatch selection event
   */
  dispatchSelectionEvent(t, e) {
    c.dispatchCustomEvent(t, "table:selection", { selectedIds: e }, {
      bubbles: !0,
      cancelable: !0
    });
    const a = t.getAttribute("data-selection-method");
    if (a && window.Livewire) {
      const s = t.getAttribute("wire:id");
      if (s) {
        const i = window.Livewire.find(s);
        i && i.call(a, e);
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
  C.getInstance().init();
}) : C.getInstance().init();
window.TableActions = C;
C.getInstance();
class N extends D {
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
          const a = e;
          r.hasDataAttribute(a, "button-group", "true") && r.hasDataAttribute(a, "attached", "true") && this.processButtonGroup(a), r.findByDataAttribute("button-group", "true", a).filter(
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
    const e = t.getAttribute("data-orientation") || "horizontal", a = Array.from(t.children).filter(
      (s) => s.tagName === "BUTTON" || s.tagName === "A"
    );
    a.length <= 1 || a.forEach((s, i) => {
      const n = i === 0, o = i === a.length - 1, l = !n && !o;
      this.clearBorderRadiusClasses(s), e === "horizontal" ? n ? s.classList.add("rounded-r-none") : o ? s.classList.add("rounded-l-none") : l && s.classList.add("rounded-none") : e === "vertical" && (n ? s.classList.add("rounded-b-none") : o ? s.classList.add("rounded-t-none") : l && s.classList.add("rounded-none"));
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
    ].forEach((a) => {
      t.classList.remove(a);
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
N.getInstance();
class T extends D {
  /**
   * Initialize tooltip elements - required by BaseActionClass
   */
  initializeElements() {
    r.querySelectorAll("[data-tooltip-target]").forEach((t) => {
      const e = t.getAttribute("data-tooltip-target");
      if (e) {
        const a = r.getElementById(e);
        a && this.initializeTooltip(t, a);
      }
    }), r.findByDataAttribute("tooltip", "true").forEach((t) => {
      const e = t.getAttribute("data-target");
      if (e) {
        const a = r.querySelector(e);
        a && this.initializeTooltip(a, t);
      }
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single tooltip
   */
  initializeTooltip(t, e) {
    if (this.hasState(e))
      return;
    const a = t.getAttribute("data-tooltip-trigger") || e.getAttribute("data-trigger") || "hover", s = parseInt(t.getAttribute("data-tooltip-delay") || e.getAttribute("data-delay") || "100"), i = {
      isVisible: !1,
      trigger: t,
      tooltip: e,
      triggerType: a,
      delay: s
    };
    this.setState(e, i), this.bindTooltipEvents(t, e, i), this.hideTooltip(e);
  }
  /**
   * Bind events for a specific tooltip
   */
  bindTooltipEvents(t, e, a) {
    switch (a.triggerType) {
      case "hover":
        t.addEventListener("mouseenter", () => this.scheduleShow(e)), t.addEventListener("mouseleave", () => this.scheduleHide(e)), e.addEventListener("mouseenter", () => this.cancelHide(e)), e.addEventListener("mouseleave", () => this.scheduleHide(e));
        break;
      case "click":
        t.addEventListener("click", (s) => {
          s.preventDefault(), this.toggleTooltip(e);
        });
        break;
      case "focus":
        t.addEventListener("focus", () => this.scheduleShow(e)), t.addEventListener("blur", () => this.scheduleHide(e));
        break;
    }
    t.addEventListener("keydown", (s) => {
      s.key === "Escape" && a.isVisible && this.hideTooltip(e);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && this.getAllStates().forEach((a, s) => {
        var i;
        if (a.triggerType === "click" && a.isVisible) {
          const n = e;
          !((i = a.trigger) != null && i.contains(n)) && !s.contains(n) && this.hideTooltip(s);
        }
      });
    }), c.addEventListener(document, "scroll", () => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.hideTooltip(e);
      });
    }, { passive: !0 }), c.handleResize(() => {
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
          const a = e;
          r.querySelectorAll("[data-tooltip-target]", a).forEach((s) => {
            const i = s.getAttribute("data-tooltip-target");
            if (i) {
              const n = r.getElementById(i);
              n && !this.hasState(n) && this.initializeTooltip(s, n);
            }
          }), r.findByDataAttribute("tooltip", "true", a).forEach((s) => {
            const i = s.getAttribute("data-target");
            if (i) {
              const n = r.querySelector(i);
              n && !this.hasState(s) && this.initializeTooltip(n, s);
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
    const a = t.getBoundingClientRect(), s = e.style.visibility, i = e.style.opacity;
    e.style.visibility = "hidden", e.style.opacity = "1", e.style.position = "fixed", e.style.top = "-9999px", e.style.left = "-9999px";
    const n = e.getBoundingClientRect(), o = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    e.style.visibility = s, e.style.opacity = i;
    const l = e.getAttribute("data-placement") || "top", d = this.calculateOptimalPosition(a, n, o, l);
    e.style.position = "fixed", e.style.top = `${d.top}px`, e.style.left = `${d.left}px`, e.setAttribute("data-placement", d.placement);
  }
  /**
   * Calculate optimal tooltip position with collision detection
   */
  calculateOptimalPosition(t, e, a, s) {
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
    }, o = n[s];
    if (this.positionFitsInViewport(o, e, a))
      return o;
    const l = Object.values(n).filter((d) => d.placement !== s);
    for (const d of l)
      if (this.positionFitsInViewport(d, e, a))
        return d;
    return {
      top: Math.max(8, Math.min(o.top, a.height - e.height - 8)),
      left: Math.max(8, Math.min(o.left, a.width - e.width - 8)),
      placement: o.placement
    };
  }
  /**
   * Check if position fits in viewport
   */
  positionFitsInViewport(t, e, a) {
    return t.top >= 0 && t.left >= 0 && t.top + e.height <= a.height && t.left + e.width <= a.width;
  }
  /**
   * Dispatch tooltip events
   */
  dispatchTooltipEvent(t, e, a = {}) {
    c.dispatchCustomEvent(t, e, {
      tooltip: t,
      ...a
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
  T.getInstance().init();
}) : T.getInstance().init();
window.TooltipActions = T;
T.getInstance();
class x extends D {
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
    const e = t.dataset.format || "24", a = t.dataset.showSeconds === "true", s = parseInt(t.dataset.step || "1"), i = t.dataset.minTime || null, n = t.dataset.maxTime || null, o = t.dataset.value || null, l = this.parseTime(o) || this.getCurrentTime(), d = {
      isOpen: !1,
      format: e,
      showSeconds: a,
      hour: l.hour,
      minute: l.minute,
      second: l.second,
      period: l.period || "AM",
      step: s,
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
    c.handleDelegatedClick("[data-timepicker-trigger]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]');
      a && !this.isDisabled(a) && this.toggleDropdown(a);
    }), c.handleDelegatedClick("[data-timepicker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const a = r.findClosest(t, '[data-timepicker="true"]');
      a && this.clearTime(a);
    }), c.handleDelegatedClick("[data-timepicker-hour]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]'), s = parseInt(t.dataset.timepickerHour || "0");
      a && this.setHour(a, s);
    }), c.handleDelegatedClick("[data-timepicker-minute]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]'), s = parseInt(t.dataset.timepickerMinute || "0");
      a && this.setMinute(a, s);
    }), c.handleDelegatedClick("[data-timepicker-second]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]'), s = parseInt(t.dataset.timepickerSecond || "0");
      a && this.setSecond(a, s);
    }), c.handleDelegatedClick("[data-timepicker-period]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]'), s = t.dataset.timepickerPeriod;
      a && this.setPeriod(a, s);
    }), c.handleDelegatedClick("[data-timepicker-format]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]'), s = t.dataset.timepickerFormat;
      a && this.setFormat(a, s);
    }), c.handleDelegatedClick("[data-timepicker-now]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]');
      a && this.setToCurrentTime(a);
    }), c.handleDelegatedClick("[data-timepicker-apply]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]');
      a && this.applyTime(a);
    }), c.handleDelegatedClick("[data-timepicker-cancel]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-timepicker="true"]');
      a && this.closeDropdown(a);
    }), c.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest('[data-timepicker="true"]') || this.closeAllDropdowns());
    }), c.handleDelegatedKeydown('[data-timepicker="true"]', (t, e) => {
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
          const a = e;
          a.matches && a.matches('[data-timepicker="true"]') && this.initializeTimePicker(a), r.querySelectorAll('[data-timepicker="true"]', a).forEach((s) => {
            this.initializeTimePicker(s);
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
    const a = r.querySelector("[data-timepicker-dropdown]", t), s = r.querySelector("[data-timepicker-trigger]", t);
    a && (a.classList.remove("hidden"), this.positionDropdown(t)), s && s.setAttribute("aria-expanded", "true"), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.dispatchTimePickerEvent(t, "timepicker:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    e.isOpen = !1, this.setState(t, e);
    const a = r.querySelector("[data-timepicker-dropdown]", t), s = r.querySelector("[data-timepicker-trigger]", t);
    a && a.classList.add("hidden"), s && s.setAttribute("aria-expanded", "false"), this.dispatchTimePickerEvent(t, "timepicker:close");
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
    const a = this.getState(t);
    a && (a.hour = e, this.setState(t, a), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set minute value
   */
  setMinute(t, e) {
    const a = this.getState(t);
    a && (a.minute = e, this.setState(t, a), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set second value
   */
  setSecond(t, e) {
    const a = this.getState(t);
    a && (a.second = e, this.setState(t, a), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Set period (AM/PM)
   */
  setPeriod(t, e) {
    const a = this.getState(t);
    a && (a.period = e, this.setState(t, a), this.updateSelectedStates(t), this.updatePreview(t));
  }
  /**
   * Convert hour between 12h and 24h formats
   */
  convertHourBetweenFormats(t, e, a, s) {
    if (e === a)
      return { hour: t, period: s };
    if (e === "24" && a === "12")
      return t === 0 ? { hour: 12, period: "AM" } : t >= 1 && t <= 11 ? { hour: t, period: "AM" } : t === 12 ? { hour: 12, period: "PM" } : { hour: t - 12, period: "PM" };
    if (e === "12" && a === "24") {
      if (!s)
        throw new Error("Period (AM/PM) required for 12h to 24h conversion");
      return s === "AM" ? t === 12 ? { hour: 0 } : { hour: t } : t === 12 ? { hour: 12 } : { hour: t + 12 };
    }
    return { hour: t, period: s };
  }
  /**
   * Set format (12/24 hour)
   */
  setFormat(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const s = t.dataset.formatMode;
    if (s === "12" || s === "24") {
      console.warn(`TimePicker format is locked to ${s}h mode. Cannot switch to ${e}h.`);
      return;
    }
    if (a.format !== e) {
      const i = this.convertHourBetweenFormats(a.hour, a.format, e, a.period);
      a.hour = i.hour, i.period && (a.period = i.period), a.format = e, this.setState(t, a), this.updateFormatButtons(t), this.updateHourOptions(t), this.updateSelectedStates(t), this.updateDisplay(t), this.updatePreview(t);
    }
  }
  /**
   * Set to current time
   */
  setToCurrentTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = this.getCurrentTime();
    e.format === "12" ? (e.hour = a.hour > 12 ? a.hour - 12 : a.hour === 0 ? 12 : a.hour, e.period = a.hour >= 12 ? "PM" : "AM") : e.hour = a.hour, e.minute = a.minute, e.second = a.second, this.setState(t, e), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.updatePreview(t);
  }
  /**
   * Apply time selection
   */
  applyTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = this.formatTimeValue(e);
    this.setValue(t, a), this.closeDropdown(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: a,
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
    const a = this.getState(t);
    if (a)
      switch (e.key) {
        case "Enter":
        case " ":
          a.isOpen ? (e.preventDefault(), this.applyTime(t)) : (e.preventDefault(), this.openDropdown(t));
          break;
        case "Escape":
          a.isOpen && (e.preventDefault(), this.closeDropdown(t));
          break;
        case "ArrowUp":
          a.isOpen ? e.preventDefault() : (e.preventDefault(), this.incrementTime(t, "minute", 1));
          break;
        case "ArrowDown":
          a.isOpen ? e.preventDefault() : (e.preventDefault(), this.incrementTime(t, "minute", -1));
          break;
        case "ArrowLeft":
          a.isOpen || (e.preventDefault(), this.incrementTime(t, "hour", -1));
          break;
        case "ArrowRight":
          a.isOpen || (e.preventDefault(), this.incrementTime(t, "hour", 1));
          break;
      }
  }
  /**
   * Increment/decrement time values
   */
  incrementTime(t, e, a) {
    const s = this.getState(t);
    if (s) {
      switch (e) {
        case "hour":
          s.format === "12" ? (s.hour = s.hour + a, s.hour > 12 && (s.hour = 1), s.hour < 1 && (s.hour = 12)) : (s.hour = s.hour + a, s.hour > 23 && (s.hour = 0), s.hour < 0 && (s.hour = 23));
          break;
        case "minute":
          s.minute = s.minute + a * s.step, s.minute >= 60 ? s.minute = s.minute % 60 : s.minute < 0 && (s.minute = 60 + s.minute % 60, s.minute === 60 && (s.minute = 0));
          break;
        case "second":
          s.second = s.second + a, s.second >= 60 ? s.second = 0 : s.second < 0 && (s.second = 59);
          break;
      }
      this.setState(t, s), this.updateDisplay(t), this.dispatchTimePickerEvent(t, "timepicker:increment", {
        unit: e,
        direction: a,
        value: this.formatTimeValue(s)
      });
    }
  }
  /**
   * Update display value
   */
  updateDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = this.formatTimeValue(e), s = r.querySelector("[data-timepicker-trigger]", t);
    s && (s.value = a || "");
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
    const a = r.querySelector(".timepicker-hidden-input", t), s = r.querySelector("[data-timepicker-trigger]", t);
    a && (a.value = e), s && (s.value = e);
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
    const a = r.querySelector(`[data-timepicker-hour="${e.hour}"]`, t);
    a && a.classList.add("selected");
    const s = r.querySelector(`[data-timepicker-minute="${e.minute}"]`, t);
    if (s && s.classList.add("selected"), e.showSeconds) {
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
    r.querySelectorAll("[data-timepicker-format]", t).forEach((s) => {
      s.dataset.timepickerFormat === e.format ? (s.classList.add("bg-brand", "text-foreground-brand"), s.classList.remove("bg-surface", "text-muted")) : (s.classList.remove("bg-brand", "text-foreground-brand"), s.classList.add("bg-surface", "text-muted"));
    });
  }
  /**
   * Update hour options based on current format
   */
  updateHourOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const a = r.querySelector("[data-timepicker-dropdown] .h-24:first-child", t);
    if (!a) return;
    const s = e.format === "12" ? Array.from({ length: 12 }, (i, n) => n + 1) : (
      // 1-12 for 12h
      Array.from({ length: 24 }, (i, n) => n)
    );
    a.innerHTML = "", s.forEach((i) => {
      const n = document.createElement("button");
      n.type = "button", n.dataset.timepickerHour = i.toString(), n.className = "w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors", n.textContent = i.toString().padStart(2, "0"), a.appendChild(n);
    }), e.format === "12" && (e.hour < 1 || e.hour > 12) ? (e.hour = Math.max(1, Math.min(12, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t)) : e.format === "24" && (e.hour < 0 || e.hour > 23) && (e.hour = Math.max(0, Math.min(23, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t));
  }
  /**
   * Scroll to selected options in dropdown lists
   */
  scrollToSelectedOptions(t) {
    r.querySelectorAll(".selected", t).forEach((a) => {
      a.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
  /**
   * Position dropdown
   */
  positionDropdown(t) {
    const e = r.querySelector("[data-timepicker-dropdown]", t), a = r.querySelector("[data-timepicker-trigger]", t);
    if (!e || !a) return;
    e.style.top = "", e.style.bottom = "", e.style.marginTop = "", e.style.marginBottom = "", e.style.maxHeight = "";
    const s = a.getBoundingClientRect(), i = window.innerHeight, n = window.innerWidth, l = e.getBoundingClientRect().height, d = i - s.bottom - 8, u = s.top - 8, h = 200;
    let f = !1, g = "none";
    l <= d ? f = !1 : l <= u ? f = !0 : u > d ? (f = !0, g = Math.max(u, h) + "px") : (f = !1, g = Math.max(d, h) + "px"), f ? (e.style.bottom = "100%", e.style.top = "auto", e.style.marginBottom = "4px", e.style.marginTop = "0") : (e.style.top = "100%", e.style.bottom = "auto", e.style.marginTop = "4px", e.style.marginBottom = "0"), g !== "none" && (e.style.maxHeight = g, e.style.overflowY = "auto");
    const m = s.left;
    m + e.offsetWidth > n ? (e.style.right = "0", e.style.left = "auto") : m < 0 && (e.style.left = "0", e.style.right = "auto");
  }
  /**
   * Parse time string into components
   */
  parseTime(t) {
    var e;
    if (!t) return null;
    try {
      const a = [
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
      ];
      for (const s of a) {
        const i = t.match(s);
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
    const { hour: e, minute: a, second: s, period: i, format: n, showSeconds: o } = t;
    if (n === "12") {
      const l = e.toString(), d = a.toString().padStart(2, "0"), u = s.toString().padStart(2, "0");
      return o ? `${l}:${d}:${u} ${i}` : `${l}:${d} ${i}`;
    } else {
      const l = e.toString().padStart(2, "0"), d = a.toString().padStart(2, "0"), u = s.toString().padStart(2, "0");
      return o ? `${l}:${d}:${u}` : `${l}:${d}`;
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
  dispatchTimePickerEvent(t, e, a = null) {
    c.dispatchCustomEvent(t, e, {
      timepicker: t,
      ...a
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
    const a = this.parseTime(e), s = this.getState(t);
    !a || !s || (s.hour = a.hour, s.minute = a.minute, s.second = a.second, a.period && (s.period = a.period), this.setState(t, s), this.updateDisplay(t), this.updateSelectedStates(t), this.dispatchTimePickerEvent(t, "timepicker:change", {
      value: this.formatTimeValue(s),
      state: { ...s }
    }));
  }
  /**
   * Clean up TimePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  x.getInstance().init();
}) : x.getInstance().init();
window.TimePickerActions = x;
x.getInstance();
class M extends D {
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
    c.handleDelegatedClick("details[data-accordion] summary", (t, e) => {
      const a = r.findClosest(t, "details[data-accordion]");
      a && this.handleSummaryClick(a, e);
    }), c.handleDelegatedEvent("toggle", "details[data-accordion]", (t) => {
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
          const a = e;
          a.matches && a.matches("details[data-accordion]") && this.initializeAccordion(a), r.querySelectorAll("details[data-accordion]", a).forEach((s) => {
            this.initializeAccordion(s);
          });
        }
      });
    });
  }
  /**
   * Handle summary click with animation
   */
  handleSummaryClick(t, e) {
    const a = this.getState(t);
    if (!a) return;
    if (a.isAnimating) {
      e.preventDefault();
      return;
    }
    if (p.prefersReducedMotion())
      return;
    e.preventDefault();
    const s = !t.open;
    a.isExpanding = s, s ? this.expand(t) : this.shrink(t);
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
    const a = r.querySelector("summary", t), s = a ? a.offsetHeight : 0, i = t.offsetHeight;
    e.animation = p.expandHeight(t, {
      fromHeight: s,
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
    const a = r.querySelector("summary", t), s = a ? a.offsetHeight : 0;
    e.animation = p.collapseHeight(t, {
      toHeight: s,
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
    const a = this.getState(e);
    return a && a.isAnimating ? !1 : p.prefersReducedMotion() ? (e.open = !0, !0) : (this.expand(e), !0);
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
    const a = this.getState(e);
    return a && a.isAnimating ? !1 : p.prefersReducedMotion() ? (e.open = !1, !0) : (this.shrink(e), !0);
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
    const a = this.getState(e);
    return a ? a.isAnimating : !1;
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
  dispatchAccordionEvent(t, e, a = {}) {
    c.dispatchCustomEvent(t, e, {
      accordion: t,
      ...a
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
  M.getInstance().init();
}) : M.getInstance().init();
window.AccordionActions = M;
M.getInstance();
class z extends D {
  /**
   * Initialize editor elements - required by BaseActionClass
   */
  initializeElements() {
    this.processEditors();
  }
  /**
   * Process all existing editors on the page
   */
  processEditors() {
    r.findByDataAttribute("editor", "true").forEach((e) => this.initializeEditor(e));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick(
      "[data-editor-command]",
      (t, e) => this.handleToolbarClick(t, e)
    ), c.handleDelegatedInput(
      '[data-editor-content="true"]',
      (t, e) => this.handleContentChange(t, e)
    ), c.addEventListener(document, "selectionchange", () => {
      this.updateToolbarStates();
    }), c.handleDelegatedFocus(
      '[data-editor-content="true"]',
      (t, e) => this.handleEditorFocus(t, e)
    );
  }
  /**
   * Setup dynamic observer for new editors - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const a = e;
          r.hasDataAttribute(a, "editor", "true") && this.initializeEditor(a), r.findByDataAttribute("editor", "true", a).forEach((i) => this.initializeEditor(i));
        }
      });
    });
  }
  /**
   * Initialize a single editor element
   */
  initializeEditor(t) {
    if (!r.getDataAttribute(t, "editor-id")) return;
    const a = r.querySelector('[data-editor-content="true"]', t), s = r.querySelector('[data-editor-input="true"]', t), i = r.querySelectorAll("[data-editor-command]", t);
    if (!a) return;
    const n = {
      contentElement: a,
      hiddenInput: s,
      toolbarButtons: i,
      isActive: !1
    };
    this.setState(t, n), s && s.value && !a.innerHTML.trim() && (a.innerHTML = s.value);
  }
  /**
   * Handle toolbar button clicks
   */
  handleToolbarClick(t, e) {
    e.preventDefault();
    const a = r.getDataAttribute(t, "editor-command"), s = r.getDataAttribute(t, "editor-value");
    if (r.hasDataAttribute(t, "editor-toggle", "true"), !a) return;
    const i = r.findClosest(t, '[data-editor="true"]');
    if (!i) return;
    const n = this.getState(i);
    n && (r.focus(n.contentElement), a === "createLink" ? this.handleCreateLink() : s ? document.execCommand(a, !1, s) : document.execCommand(a, !1), this.updateToolbarStates(), this.syncContentToInput(n));
  }
  /**
   * Handle content changes in the editor
   */
  handleContentChange(t, e) {
    const a = r.findClosest(t, '[data-editor="true"]');
    if (!a) return;
    const s = this.getState(a);
    s && (this.syncContentToInput(s), setTimeout(() => this.updateToolbarStates(), 10));
  }
  /**
   * Handle editor focus
   */
  handleEditorFocus(t, e) {
    const a = r.findClosest(t, '[data-editor="true"]');
    if (!a) return;
    const s = this.getState(a);
    s && (s.isActive = !0, this.updateToolbarStates());
  }
  /**
   * Sync contenteditable content to hidden input
   */
  syncContentToInput(t) {
    t.hiddenInput && (t.hiddenInput.value = t.contentElement.innerHTML);
  }
  /**
   * Update toolbar button states based on current selection
   */
  updateToolbarStates() {
    this.stateManager.forEach((t, e) => {
      t.isActive && t.toolbarButtons.forEach((a) => {
        const s = r.getDataAttribute(a, "editor-command"), i = r.hasDataAttribute(a, "editor-toggle", "true");
        if (!(!s || !i))
          try {
            const n = document.queryCommandState(s);
            r.toggleClass(a, "active", n);
          } catch {
          }
      });
    });
  }
  /**
   * Handle link creation with user input
   */
  handleCreateLink() {
    const t = window.getSelection();
    if (!t || t.rangeCount === 0) return;
    const e = t.toString(), a = prompt("Enter URL:", e.startsWith("http") ? e : "https://");
    a && document.execCommand("createLink", !1, a);
  }
  /**
   * Get editor content as HTML
   */
  getEditorContent(t) {
    const e = this.getState(t);
    return e ? e.contentElement.innerHTML : "";
  }
  /**
   * Set editor content
   */
  setEditorContent(t, e) {
    const a = this.getState(t);
    a && (a.contentElement.innerHTML = e, this.syncContentToInput(a));
  }
  /**
   * Clear editor content
   */
  clearEditor(t) {
    this.setEditorContent(t, "");
  }
  /**
   * Focus specific editor
   */
  focusEditor(t) {
    const e = this.getState(t);
    e && (r.focus(e.contentElement), e.isActive = !0);
  }
  /**
   * Check if editor is focused/active
   */
  isEditorActive(t) {
    const e = this.getState(t);
    return e ? e.isActive : !1;
  }
  /**
   * Execute command on specific editor
   */
  execCommand(t, e, a) {
    const s = this.getState(t);
    s && (r.focus(s.contentElement), a ? document.execCommand(e, !1, a) : document.execCommand(e, !1), this.updateToolbarStates(), this.syncContentToInput(s));
  }
  /**
   * Clean up EditorActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.stateManager.forEach((t) => {
      t.isActive = !1;
    });
  }
}
z.getInstance();
class k extends D {
  /**
   * Initialize date picker elements - required by BaseActionClass
   */
  initializeElements() {
    r.findByDataAttribute("date-picker", "true").forEach((t) => {
      this.initializeDatePicker(t);
    });
  }
  /**
   * Initialize a single date picker element
   */
  initializeDatePicker(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.datePickerConfig, a = t.dataset.inline === "true", s = t.dataset.disabled === "true";
    let i;
    try {
      i = e ? JSON.parse(e) : {};
    } catch (o) {
      console.error("Failed to parse date picker config:", o), i = {};
    }
    const n = {
      isOpen: a,
      selectedDate: i.selectedDate || null,
      startDate: i.startDate || null,
      endDate: i.endDate || null,
      format: i.format || "Y-m-d",
      displayFormat: i.displayFormat || i.format || "Y-m-d",
      isRange: i.isRange || !1,
      closeOnSelect: i.closeOnSelect !== !1,
      isInline: a,
      isDisabled: s,
      position: "bottom"
    };
    this.setState(t, n), this.setupCalendarEventListeners(t), a && this.openDropdown(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    c.handleDelegatedClick("[data-date-picker-input]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-date-picker="true"]');
      a && !this.isDisabled(a) && this.toggleDropdown(a);
    }), c.handleDelegatedFocus("[data-date-picker-input]", (t) => {
      const e = r.findClosest(t, '[data-date-picker="true"]');
      if (e && !this.isDisabled(e)) {
        const a = this.getState(e);
        a && !a.isOpen && !a.isInline && this.openDropdown(e);
      }
    }), c.handleDelegatedClick("[data-date-picker-trigger]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const a = r.findClosest(t, '[data-date-picker="true"]');
      a && !this.isDisabled(a) && this.toggleDropdown(a);
    }), c.handleDelegatedClick("[data-date-picker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const a = r.findClosest(t, '[data-date-picker="true"]');
      a && !this.isDisabled(a) && this.clearDate(a);
    }), c.handleDelegatedClick("[data-quick-selector]", (t, e) => {
      e.preventDefault();
      const a = r.findClosest(t, '[data-date-picker="true"]'), s = t.dataset.quickSelector;
      a && s && !this.isDisabled(a) && this.applyQuickSelector(a, s);
    }), c.handleDelegatedKeydown("[data-date-picker-input]", (t, e) => {
      const a = r.findClosest(t, '[data-date-picker="true"]');
      if (!a) return;
      const s = this.getState(a);
      if (s)
        switch (e.key) {
          case "Escape":
            s.isOpen && (e.preventDefault(), this.closeDropdown(a));
            break;
          case "Enter":
            e.preventDefault(), s.isOpen || this.openDropdown(a);
            break;
          case "ArrowDown":
            s.isOpen || (e.preventDefault(), this.openDropdown(a));
            break;
          case "Tab":
            if (s.isOpen && !e.shiftKey) {
              const i = r.querySelector('[data-calendar="true"]', a);
              i && p.createTimer(() => {
                const n = i.querySelector("button:not(:disabled)");
                n && n.focus();
              }, 10);
            }
            break;
        }
    }), c.handleDelegatedInput("[data-date-picker-input]", (t) => {
      if (!t.readOnly) {
        const e = r.findClosest(t, '[data-date-picker="true"]');
        e && !this.isDisabled(e) && this.handleManualInput(e, t.value);
      }
    }), c.handleDocumentClick((t) => {
      const e = t.target;
      r.findByDataAttribute("date-picker", "true").forEach((a) => {
        const s = this.getState(a);
        s && s.isOpen && !s.isInline && (a.contains(e) || this.closeDropdown(a));
      });
    }), c.handleWindowResize(() => {
      r.findByDataAttribute("date-picker", "true").forEach((t) => {
        const e = this.getState(t);
        e && e.isOpen && !e.isInline && this.updateDropdownPosition(t);
      });
    });
  }
  /**
   * Setup calendar event listeners for a date picker
   */
  setupCalendarEventListeners(t) {
    const e = r.querySelector('[data-calendar="true"]', t);
    e && (e.addEventListener("calendar:dateSelected", (a) => {
      const s = a.detail;
      this.handleDateSelected(t, s.selectedDate, s.formattedDate);
    }), e.addEventListener("calendar:rangeSelected", (a) => {
      const s = a.detail;
      this.handleRangeSelected(t, s.startDate, s.endDate, s.formattedRange);
    }), e.addEventListener("calendar:cleared", (a) => {
      this.handleCalendarCleared(t);
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
    const a = r.querySelector("[data-date-picker-dropdown]", t);
    a && (this.updateDropdownPosition(t), a.classList.add("animating-in"), a.classList.add("open"), p.createTimer(() => {
      a.classList.remove("animating-in");
      const s = r.querySelector('[data-calendar="true"]', t);
      if (s) {
        const i = s.querySelector('button:not(:disabled), [tabindex="0"]');
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
    const a = r.querySelector("[data-date-picker-dropdown]", t);
    if (!a) return;
    a.classList.remove("open");
    const s = r.querySelector("[data-date-picker-input]", t);
    s && s.focus(), this.dispatchDatePickerEvent(t, "datepicker:closed");
  }
  /**
   * Update dropdown position based on viewport
   */
  updateDropdownPosition(t) {
    const e = r.querySelector("[data-date-picker-dropdown]", t);
    if (!e) return;
    const a = this.getState(t);
    if (!a) return;
    const s = window.innerHeight, i = t.getBoundingClientRect(), n = e.offsetHeight || 400, o = s - i.bottom, l = i.top;
    o < n && l > n ? (e.classList.add("top"), a.position = "top") : (e.classList.remove("top"), a.position = "bottom"), this.setState(t, a);
  }
  /**
   * Handle date selection from calendar
   */
  handleDateSelected(t, e, a) {
    const s = this.getState(t);
    if (!s) return;
    s.selectedDate = e, this.setState(t, s);
    const i = r.querySelector("[data-date-picker-input]", t);
    i && a && (i.value = y.formatDateForDisplay(e, s.displayFormat));
    const n = r.querySelector("[data-date-picker-value]", t);
    n && (n.value = e ? y.formatDateForSubmission(e, s.format) : ""), s.closeOnSelect && !s.isInline && p.createTimer(() => {
      this.closeDropdown(t);
    }, 150), this.updateClearButtonVisibility(t), this.dispatchDatePickerEvent(t, "datepicker:change", {
      value: e,
      formatted: a
    });
  }
  /**
   * Handle range selection from calendar
   */
  handleRangeSelected(t, e, a, s) {
    const i = this.getState(t);
    if (!i) return;
    i.startDate = e, i.endDate = a, this.setState(t, i);
    const n = r.querySelector("[data-date-picker-input]", t);
    n && (n.value = y.formatRangeForDisplay(e, a, i.displayFormat));
    const o = r.querySelector("[data-date-picker-value]", t);
    if (o) {
      const l = y.formatRangeForSubmission(e, a, i.format);
      o.value = l || "";
    }
    i.closeOnSelect && e && a && !i.isInline && p.createTimer(() => {
      this.closeDropdown(t);
    }, 150), this.updateClearButtonVisibility(t), this.dispatchDatePickerEvent(t, "datepicker:change", {
      startDate: e,
      endDate: a,
      formatted: s
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
    const a = r.querySelector("[data-date-picker-input]", t);
    a && (a.value = "");
    const s = r.querySelector("[data-date-picker-value]", t);
    s && (s.value = "");
    const i = r.querySelector('[data-calendar="true"]', t);
    if (i && window.CalendarActions) {
      const n = window.CalendarActions.getInstance();
      if (e.isRange) {
        const o = n.getCalendarState(i);
        o && (o.startDate = null, o.endDate = null, o.rangeSelectionState = "none", n.setState(i, o), i.dispatchEvent(new CustomEvent("calendar:cleared")));
      } else
        n.setSelectedDate(i, null);
    }
    this.updateClearButtonVisibility(t), e.isInline || this.closeDropdown(t), this.dispatchDatePickerEvent(t, "datepicker:cleared");
  }
  /**
   * Apply quick selector
   */
  applyQuickSelector(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const { start: s, end: i } = y.getQuickSelectorDate(e);
    let n = s, o = s, l = i;
    const d = r.querySelector('[data-calendar="true"]', t);
    if (d && window.CalendarActions) {
      const u = window.CalendarActions.getInstance();
      if (a.isRange && o && l) {
        const h = u.getCalendarState(d);
        h && (h.startDate = y.formatDateString(o), h.endDate = y.formatDateString(l), h.rangeSelectionState = "none", u.setState(d, h), d.dispatchEvent(new CustomEvent("calendar:rangeSelected", {
          detail: {
            startDate: h.startDate,
            endDate: h.endDate,
            formattedRange: y.formatRangeForDisplay(h.startDate, h.endDate, a.displayFormat)
          }
        })));
      } else if (n) {
        const h = y.formatDateString(n);
        u.setSelectedDate(d, h);
      }
    }
  }
  /**
   * Handle manual input
   */
  handleManualInput(t, e) {
    const a = this.getState(t);
    if (!a) return;
    const s = y.parseInputDate(e, a.displayFormat);
    if (s) {
      const i = y.formatDateString(s), n = r.querySelector('[data-calendar="true"]', t);
      n && window.CalendarActions && window.CalendarActions.getInstance().setSelectedDate(n, i);
    }
  }
  /**
   * Update clear button visibility
   */
  updateClearButtonVisibility(t) {
    const e = r.querySelector("[data-date-picker-clear]", t);
    if (!e) return;
    const a = r.querySelector("[data-date-picker-input]", t);
    a && a.value ? e.style.display = "" : e.style.display = "none";
  }
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
  dispatchDatePickerEvent(t, e, a = null) {
    c.dispatchCustomEvent(t, e, {
      datePicker: t,
      ...a
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
          const a = e;
          r.hasDataAttribute(a, "date-picker", "true") && this.initializeDatePicker(a), r.findByDataAttribute("date-picker", "true", a).forEach((s) => {
            this.initializeDatePicker(s);
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
  k.getInstance().init();
}) : k.getInstance().init();
window.DatePickerActions = k;
k.getInstance();
function Y() {
  O.getInstance().init(), $.getInstance().init(), v.getInstance().init(), q.getInstance().init(), E.getInstance().init(), V.getInstance().init(), H.getInstance().init(), R.getInstance().init(), A.getInstance().init(), F.getInstance().init(), C.getInstance().init(), N.getInstance().init(), T.getInstance().init(), x.getInstance().init(), M.getInstance().init(), z.getInstance().init(), k.getInstance().init();
}
const P = {
  FormActions: O.getInstance(),
  AlertActions: $.getInstance(),
  CalendarActions: v.getInstance(),
  RadioActions: q.getInstance(),
  RangeActions: E.getInstance(),
  SelectActions: V.getInstance(),
  TabsActions: H.getInstance(),
  ModalActions: R.getInstance(),
  ToastActions: A.getInstance(),
  DropdownActions: F.getInstance(),
  TableActions: C.getInstance(),
  ButtonGroupActions: N.getInstance(),
  TooltipActions: T.getInstance(),
  TimePickerActions: x.getInstance(),
  AccordionActions: M.getInstance(),
  EditorActions: z.getInstance(),
  DatePickerActions: k.getInstance(),
  init: Y
};
export {
  M as AccordionActions,
  $ as AlertActions,
  D as BaseActionClass,
  N as ButtonGroupActions,
  v as CalendarActions,
  r as DOMUtils,
  k as DatePickerActions,
  F as DropdownActions,
  z as EditorActions,
  c as EventUtils,
  O as FormActions,
  R as ModalActions,
  q as RadioActions,
  E as RangeActions,
  V as SelectActions,
  C as TableActions,
  H as TabsActions,
  x as TimePickerActions,
  A as ToastActions,
  T as TooltipActions,
  P as default,
  Y as initializeKeysUI
};
