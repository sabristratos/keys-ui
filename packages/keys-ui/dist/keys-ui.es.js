var im = Object.defineProperty;
var sm = (r, e, t) => e in r ? im(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var q = (r, e, t) => sm(r, typeof e != "symbol" ? e + "" : e, t);
const Ir = class Ir {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const e = this.name;
    return Ir.instances.has(e) || Ir.instances.set(e, new this()), Ir.instances.get(e);
  }
  /**
   * Standardized initialization flow
   * Prevents double initialization and provides lifecycle hooks
   */
  init() {
    var e, t, n;
    this.initialized || ((e = this.onBeforeInit) == null || e.call(this), this.bindEventListeners(), this.initializeElements(), (t = this.setupDynamicObserver) == null || t.call(this), (n = this.onAfterInit) == null || n.call(this), this.initialized = !0);
  }
  /**
   * Standardized cleanup and destroy
   * Handles state cleanup and provides extension point
   */
  destroy() {
    var e;
    (e = this.onDestroy) == null || e.call(this), this.stateManager.clear(), this.initialized = !1;
  }
  /**
   * State management utilities
   * Common operations used across multiple action classes
   */
  getState(e) {
    return this.stateManager.get(e);
  }
  setState(e, t) {
    this.stateManager.set(e, t);
  }
  removeState(e) {
    return this.stateManager.delete(e);
  }
  hasState(e) {
    return this.stateManager.has(e);
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
  createDynamicObserver(e) {
    const t = new MutationObserver((n) => {
      n.forEach((i) => {
        i.addedNodes.length > 0 && e(i.addedNodes);
      });
    });
    return t.observe(document.body, {
      childList: !0,
      subtree: !0
    }), t;
  }
  /**
   * Debounced resize handler utility
   * Used by positioning-aware components
   */
  createResizeHandler(e, t = 100) {
    let n = null;
    return () => {
      n && clearTimeout(n), n = setTimeout(e, t);
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
Ir.instances = /* @__PURE__ */ new Map();
let ee = Ir;
class b {
  /**
   * Safely find the closest ancestor element matching selector
   */
  static findClosest(e, t) {
    return !e || !(e instanceof Element) ? null : e.closest(t) || null;
  }
  /**
   * Find closest element with data attribute
   */
  static findClosestWithData(e, t) {
    return (e == null ? void 0 : e.closest(`[data-${t}]`)) || null;
  }
  /**
   * Safely query selector within element or document
   */
  static querySelector(e, t) {
    return (t || document).querySelector(e) || null;
  }
  /**
   * Safely query all elements matching selector
   */
  static querySelectorAll(e, t) {
    const n = t || document;
    return Array.from(n.querySelectorAll(e));
  }
  /**
   * Find elements with specific data attribute
   */
  static findByDataAttribute(e, t, n) {
    const i = t ? `[data-${e}="${t}"]` : `[data-${e}]`;
    return this.querySelectorAll(i, n);
  }
  /**
   * Find single element with data attribute
   */
  static findFirstByDataAttribute(e, t, n) {
    const i = t ? `[data-${e}="${t}"]` : `[data-${e}]`;
    return this.querySelector(i, n);
  }
  /**
   * Check if element has data attribute with optional value
   */
  static hasDataAttribute(e, t, n) {
    if (!e) return !1;
    const i = e.dataset[t];
    return n !== void 0 ? i === n : i !== void 0;
  }
  /**
   * Get data attribute value safely
   */
  static getDataAttribute(e, t) {
    return e == null ? void 0 : e.dataset[t];
  }
  /**
   * Set data attribute safely
   */
  static setDataAttribute(e, t, n) {
    e && (e.dataset[t] = n);
  }
  /**
   * Remove data attribute safely
   */
  static removeDataAttribute(e, t) {
    e && delete e.dataset[t];
  }
  /**
   * Check if element is disabled (multiple ways)
   */
  static isDisabled(e) {
    return e ? e.hasAttribute("disabled") || e.dataset.disabled === "true" || e.getAttribute("aria-disabled") === "true" : !0;
  }
  /**
   * Check if element is hidden
   */
  static isHidden(e) {
    return e ? e.hidden || e.style.display === "none" || e.getAttribute("aria-hidden") === "true" || !e.offsetParent : !0;
  }
  /**
   * Find form element (input/textarea) within container
   */
  static findFormElement(e) {
    return (e == null ? void 0 : e.querySelector("input, textarea")) || null;
  }
  /**
   * Find form element associated with action button
   */
  static findFormElementForAction(e) {
    let t = this.findClosest(e, '[data-input-actions="true"]');
    if (t && (t.tagName.toLowerCase() === "input" || t.tagName.toLowerCase() === "textarea"))
      return t;
    if (t = this.findClosest(e, '*:has(input[data-input-actions="true"]), *:has(textarea[data-input-actions="true"])'), t) {
      const i = this.findFormElement(t);
      if (i)
        return i;
    }
    let n = e.parentElement;
    for (; n; ) {
      const i = this.findFormElement(n);
      if (i)
        return i;
      n = n.parentElement;
    }
    return null;
  }
  /**
   * Get element by ID safely
   */
  static getElementById(e) {
    return document.getElementById(e) || null;
  }
  /**
   * Check if element matches selector
   */
  static matches(e, t) {
    var n;
    return ((n = e == null ? void 0 : e.matches) == null ? void 0 : n.call(e, t)) ?? !1;
  }
  /**
   * Find all child elements matching selector
   */
  static findChildren(e, t) {
    return e ? Array.from(e.children).filter(
      (n) => this.matches(n, t)
    ) : [];
  }
  /**
   * Get next sibling element matching selector
   */
  static getNextSibling(e, t) {
    let n = e == null ? void 0 : e.nextElementSibling;
    for (; n; ) {
      if (!t || this.matches(n, t))
        return n;
      n = n.nextElementSibling;
    }
    return null;
  }
  /**
   * Get previous sibling element matching selector
   */
  static getPreviousSibling(e, t) {
    let n = e == null ? void 0 : e.previousElementSibling;
    for (; n; ) {
      if (!t || this.matches(n, t))
        return n;
      n = n.previousElementSibling;
    }
    return null;
  }
  /**
   * Add class safely
   */
  static addClass(e, t) {
    e == null || e.classList.add(t);
  }
  /**
   * Remove class safely
   */
  static removeClass(e, t) {
    e == null || e.classList.remove(t);
  }
  /**
   * Toggle class safely
   */
  static toggleClass(e, t, n) {
    return (e == null ? void 0 : e.classList.toggle(t, n)) ?? !1;
  }
  /**
   * Check if element has class
   */
  static hasClass(e, t) {
    return (e == null ? void 0 : e.classList.contains(t)) ?? !1;
  }
  /**
   * Remove multiple classes safely
   */
  static removeClasses(e, t) {
    e && e.classList.remove(...t);
  }
  /**
   * Add multiple classes safely
   */
  static addClasses(e, t) {
    e && e.classList.add(...t);
  }
  /**
   * Set or remove attribute based on condition
   */
  static toggleAttribute(e, t, n) {
    e && (n !== void 0 ? e.setAttribute(t, n) : e.removeAttribute(t));
  }
  /**
   * Get element's computed style property
   */
  static getComputedStyle(e, t) {
    return e ? window.getComputedStyle(e).getPropertyValue(t) : "";
  }
  /**
   * Check if element is visible in viewport
   */
  static isInViewport(e) {
    if (!e) return !1;
    const t = e.getBoundingClientRect();
    return t.top >= 0 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  /**
   * Get element's offset relative to document
   */
  static getElementOffset(e) {
    if (!e) return { top: 0, left: 0 };
    const t = e.getBoundingClientRect();
    return {
      top: t.top + window.pageYOffset,
      left: t.left + window.pageXOffset
    };
  }
  /**
   * Focus element safely with optional delay
   */
  static focus(e, t) {
    e && (t ? setTimeout(() => e.focus(), t) : e.focus());
  }
  /**
   * Scroll element into view safely
   */
  static scrollIntoView(e, t) {
    e && e.scrollIntoView(t || { block: "nearest" });
  }
  /**
   * Remove element from DOM safely
   */
  static removeElement(e) {
    e && e.parentNode && e.parentNode.removeChild(e);
  }
  /**
   * Create element with optional classes and attributes
   */
  static createElement(e, t) {
    const n = document.createElement(e);
    return t != null && t.classes && n.classList.add(...t.classes), t != null && t.attributes && Object.entries(t.attributes).forEach(([i, s]) => {
      n.setAttribute(i, s);
    }), t != null && t.textContent && (n.textContent = t.textContent), t != null && t.innerHTML && (n.innerHTML = t.innerHTML), n;
  }
}
class T {
  /**
   * Create and dispatch custom event
   */
  static dispatchCustomEvent(e, t, n, i) {
    const s = new CustomEvent(t, {
      detail: n,
      bubbles: (i == null ? void 0 : i.bubbles) ?? !0,
      cancelable: (i == null ? void 0 : i.cancelable) ?? !0
    });
    return e.dispatchEvent(s);
  }
  /**
   * Add event listener with automatic cleanup tracking
   */
  static addEventListener(e, t, n, i) {
    return e.addEventListener(t, n, i), () => {
      e.removeEventListener(t, n, i);
    };
  }
  /**
   * Handle generic events with delegation
   */
  static handleDelegatedEvent(e, t, n, i) {
    const s = i || document, a = (o) => {
      const l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(t)), c && n(c, o);
    };
    return this.addEventListener(s, e, a);
  }
  /**
   * Handle click events with delegation
   */
  static handleDelegatedClick(e, t, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(e)), c && t(c, o);
    };
    return this.addEventListener(i, "click", s);
  }
  /**
   * Handle keydown events with delegation
   */
  static handleDelegatedKeydown(e, t, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(e)), c && t(c, o);
    };
    return this.addEventListener(i, "keydown", s);
  }
  /**
   * Handle specific key presses
   */
  static handleKeyPress(e, t, n) {
    return (i) => {
      e.includes(i.key) && (n != null && n.preventDefault && i.preventDefault(), n != null && n.stopPropagation && i.stopPropagation(), t(i.key, i));
    };
  }
  /**
   * Handle input events with delegation
   */
  static handleDelegatedInput(e, t, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(e)), c && t(c, o);
    };
    return this.addEventListener(i, "input", s);
  }
  /**
   * Handle change events with delegation
   */
  static handleDelegatedChange(e, t, n) {
    const i = n || document, s = (a) => {
      const o = a.target;
      let l = null;
      o instanceof Element && (l = o.closest(e)), l && t(l, a);
    };
    return this.addEventListener(i, "change", s);
  }
  /**
   * Handle focus events with delegation
   */
  static handleDelegatedFocus(e, t, n) {
    const i = n || document, s = (a) => {
      const o = a, l = o.target;
      let c = null;
      l instanceof Element && (c = l.closest(e)), c && t(c, o);
    };
    return this.addEventListener(i, "focusin", s);
  }
  /**
   * Create debounced event handler
   */
  static debounce(e, t) {
    let n = null;
    return (...i) => {
      n && clearTimeout(n), n = setTimeout(() => {
        e(...i);
      }, t);
    };
  }
  /**
   * Create throttled event handler
   */
  static throttle(e, t) {
    let n = !1;
    return (...i) => {
      n || (e(...i), n = !0, setTimeout(() => {
        n = !1;
      }, t));
    };
  }
  /**
   * Handle window resize with debouncing
   */
  static handleResize(e, t = 100) {
    const n = this.debounce(e, t);
    return this.addEventListener(window, "resize", n);
  }
  /**
   * Handle click outside element
   */
  static handleClickOutside(e, t) {
    const n = (i) => {
      const s = i, a = s.target;
      e.contains(a) || t(s);
    };
    return this.addEventListener(document, "click", n);
  }
  /**
   * Handle escape key globally
   */
  static handleEscape(e) {
    const t = this.handleKeyPress(["Escape"], (n, i) => e(i));
    return this.addEventListener(document, "keydown", (n) => t(n));
  }
  /**
   * Prevent default and stop propagation helper
   */
  static preventAndStop(e) {
    e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
  }
  /**
   * Check if event should be handled (not disabled/hidden)
   */
  static shouldHandleEvent(e) {
    return !e.hasAttribute("disabled") && e.dataset.disabled !== "true" && e.getAttribute("aria-disabled") !== "true" && e.offsetParent !== null;
  }
  /**
   * Handle form submission with validation
   */
  static handleFormSubmission(e, t, n) {
    const i = (s) => {
      const a = s;
      if (n && !n(e)) {
        s.preventDefault();
        return;
      }
      const o = new FormData(e);
      t(o, a);
    };
    return this.addEventListener(e, "submit", i);
  }
  /**
   * Create event cleanup manager
   */
  static createCleanupManager() {
    const e = [];
    return {
      add: (t) => {
        e.push(t);
      },
      cleanup: () => {
        e.forEach((t) => t()), e.length = 0;
      }
    };
  }
  /**
   * Common keyboard navigation handler
   */
  static createNavigationHandler(e) {
    return (t) => {
      var s, a, o, l, c, d, f, h, g, m, y;
      const { key: n } = t, i = ((s = e.preventDefault) == null ? void 0 : s.includes(n)) ?? !0;
      switch (n) {
        case "ArrowUp":
          i && t.preventDefault(), (a = e.onArrowUp) == null || a.call(e);
          break;
        case "ArrowDown":
          i && t.preventDefault(), (o = e.onArrowDown) == null || o.call(e);
          break;
        case "ArrowLeft":
          i && t.preventDefault(), (l = e.onArrowLeft) == null || l.call(e);
          break;
        case "ArrowRight":
          i && t.preventDefault(), (c = e.onArrowRight) == null || c.call(e);
          break;
        case "Enter":
          i && t.preventDefault(), (d = e.onEnter) == null || d.call(e);
          break;
        case " ":
          i && t.preventDefault(), (f = e.onSpace) == null || f.call(e);
          break;
        case "Escape":
          i && t.preventDefault(), (h = e.onEscape) == null || h.call(e);
          break;
        case "Home":
          i && t.preventDefault(), (g = e.onHome) == null || g.call(e);
          break;
        case "End":
          i && t.preventDefault(), (m = e.onEnd) == null || m.call(e);
          break;
        case "Tab":
          (y = e.onTab) == null || y.call(e);
          break;
      }
    };
  }
}
function Su(r, e = "") {
  const t = window.KeysUITranslations;
  if (!t)
    return e;
  const n = r.split(".");
  let i = t;
  for (const s of n)
    if (i = i == null ? void 0 : i[s], i === void 0)
      return e;
  return i || e;
}
class pc extends ee {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-action] button", (e, t) => {
      t.preventDefault(), this.handleActionClick(e);
    }), T.handleDelegatedKeydown("[data-action] button", (e, t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.handleActionClick(e));
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(e) {
    const t = b.findClosest(e, "[data-action]"), n = t == null ? void 0 : t.dataset.action;
    if (!n) return;
    const i = b.findFormElementForAction(e);
    if (!i) return;
    const s = n === "password_toggle" ? "toggle-password" : n;
    switch (s) {
      case "clear":
        this.clearValue(i);
        break;
      case "copy":
        await this.copyToClipboard(i, t);
        break;
      case "toggle-password":
        await this.togglePasswordVisibility(i, e, t);
        break;
      case "external":
        this.openExternalUrl(t.dataset.url);
        break;
      default:
        this.handleCustomAction(i, s);
        break;
    }
    this.dispatchActionEvent(i, s);
  }
  /**
   * Swap the icon using CSS classes and data attributes
   */
  async swapButtonIcon(e, t) {
    e.setAttribute("data-current-icon", t), this.updateButtonIconState(e, t);
  }
  /**
   * Update button icon state using Tailwind classes
   */
  updateButtonIconState(e, t) {
    const n = b.querySelector(".button-icon-default", e), i = b.querySelector(".button-icon-toggle", e), s = b.querySelector(".button-icon-success", e), a = e.dataset.iconDefault, o = e.dataset.iconToggle, l = e.dataset.iconSuccess;
    n && (n.classList.remove("opacity-100"), n.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), s && (s.classList.remove("opacity-100", "scale-110", "scale-90"), s.classList.add("opacity-0")), t === a && n ? (n.classList.remove("opacity-0"), n.classList.add("opacity-100")) : t === o && i ? (i.classList.remove("opacity-0"), i.classList.add("opacity-100")) : t === l && s && (s.classList.remove("opacity-0"), s.classList.add("opacity-100", "scale-110"));
  }
  /**
   * Animate icon success feedback using Tailwind classes
   */
  animateIconSuccess(e) {
    e.classList.add("scale-110"), setTimeout(() => {
      e.classList.remove("scale-110"), e.classList.add("scale-90"), setTimeout(() => {
        e.classList.remove("scale-90");
      }, 150);
    }, 150);
  }
  /**
   * Clear form element value
   */
  clearValue(e) {
    e.value = "", e.focus(), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Copy form element value to clipboard
   */
  async copyToClipboard(e, t) {
    const n = b.querySelector("button", t);
    try {
      await navigator.clipboard.writeText(e.value), this.showFeedback(e, Su("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && await this.showCopySuccess(n, t);
    } catch {
      this.fallbackCopyToClipboard(e, t);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(e, t) {
    const n = b.querySelector("button", t);
    e.select(), e instanceof HTMLInputElement && e.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(e, Su("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && this.showCopySuccess(n, t);
    } catch {
      this.showFeedback(e, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(e, t) {
    const n = e.dataset.iconSuccess, i = e.dataset.labelSuccess, s = e.dataset.iconDefault, a = b.querySelector(".sr-only", e);
    if (n && s)
      if (await this.swapButtonIcon(e, n), i && a) {
        const o = a.textContent;
        a.textContent = i, setTimeout(async () => {
          await this.swapButtonIcon(e, s), o && a && (a.textContent = o);
        }, 2e3);
      } else
        setTimeout(async () => {
          await this.swapButtonIcon(e, s);
        }, 2e3);
  }
  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(e, t, n) {
    var f;
    const i = e.type === "password", s = i ? "text" : "password", a = t.dataset.iconDefault, o = t.dataset.iconToggle, l = (f = b.querySelector(".sr-only", t)) == null ? void 0 : f.textContent, c = t.dataset.labelToggle;
    e.type = s;
    const d = b.querySelector(".sr-only", t);
    i ? (o && await this.swapButtonIcon(t, o), c && d && (d.textContent = c), t.setAttribute("aria-label", c || "Hide password")) : (a && await this.swapButtonIcon(t, a), l && d && (d.textContent = l), t.setAttribute("aria-label", l || "Show password"));
  }
  /**
   * Open external URL in new tab
   */
  openExternalUrl(e) {
    if (e)
      try {
        window.open(e, "_blank", "noopener,noreferrer");
      } catch (t) {
        console.error("Failed to open external URL:", t);
      }
  }
  /**
   * Handle custom actions
   */
  handleCustomAction(e, t) {
  }
  /**
   * Dispatch custom event for action
   */
  dispatchActionEvent(e, t) {
    T.dispatchCustomEvent(e, "form-action", {
      element: e,
      action: t,
      value: e.value
    });
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(e, t, n = "success") {
    const i = document.createElement("div");
    i.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${n === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, i.textContent = t;
    const s = b.findClosest(e, ".relative");
    s && (s.appendChild(i), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 2e3));
  }
  /**
   * Add a custom action handler with automatic cleanup
   */
  addActionHandler(e, t) {
    return T.addEventListener(document, "form-action", (n) => {
      const i = n;
      i.detail.action === e && t(i.detail.element);
    });
  }
  /**
   * Clean up FormActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
pc.getInstance();
class gc extends ee {
  /**
   * Initialize textarea elements - required by BaseActionClass
   */
  initializeElements() {
    this.initializeAutoResize(), this.initializeCharacterCounts();
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedEvent("input", 'textarea[data-auto-resize="true"]', (e) => {
      this.handleAutoResize(e);
    }), T.handleDelegatedEvent("input", 'textarea[data-show-character-count="true"]', (e) => {
      this.updateCharacterCount(e);
    }), T.handleDelegatedEvent("paste", 'textarea[data-show-character-count="true"]', (e) => {
      setTimeout(() => {
        this.updateCharacterCount(e);
      }, 0);
    }), T.handleDelegatedEvent("cut", 'textarea[data-show-character-count="true"]', (e) => {
      setTimeout(() => {
        this.updateCharacterCount(e);
      }, 0);
    });
  }
  /**
   * Initialize auto-resize functionality for existing textareas
   */
  initializeAutoResize() {
    b.querySelectorAll('textarea[data-auto-resize="true"]').forEach((t) => {
      this.setupAutoResize(t);
    });
  }
  /**
   * Initialize character count displays for existing textareas
   */
  initializeCharacterCounts() {
    b.querySelectorAll('textarea[data-show-character-count="true"]').forEach((t) => {
      this.updateCharacterCount(t);
    });
  }
  /**
   * Setup auto-resize for a textarea element
   */
  setupAutoResize(e) {
    const t = parseInt(e.getAttribute("rows") || "3"), n = this.getLineHeight(e), i = this.getVerticalPadding(e), s = t * n + i;
    e.style.minHeight = `${s}px`, e.style.resize = "none", e.style.overflow = "hidden", this.handleAutoResize(e);
  }
  /**
   * Handle auto-resize for textarea
   */
  handleAutoResize(e) {
    e.style.height = "auto";
    const t = e.scrollHeight, n = parseInt(e.style.minHeight || "0"), i = Math.max(t, n);
    e.style.height = `${i}px`, this.dispatchResizeEvent(e, i);
  }
  /**
   * Update character count display
   */
  updateCharacterCount(e) {
    const t = e.id || e.name;
    if (!t) return;
    const n = b.querySelector(`[data-character-count][data-target-id="${t}"]`);
    if (!n) return;
    const i = e.value.length, s = parseInt(n.dataset.maxLength || "0") || null, a = b.querySelector("[data-current-count]", n);
    a && (a.textContent = i.toString()), this.applyCharacterCountFeedback(n, e, i, s), this.dispatchCharacterCountEvent(e, i, s);
  }
  /**
   * Apply visual feedback for character count
   */
  applyCharacterCountFeedback(e, t, n, i) {
    if (!i) return;
    e.classList.remove("text-muted", "text-warning", "text-danger"), t.classList.remove("border-warning", "border-danger", "focus:border-warning", "focus:border-danger", "focus:ring-warning", "focus:ring-danger");
    const s = n / i * 100;
    n > i ? (e.classList.add("text-danger"), t.classList.add("border-danger", "focus:border-danger", "focus:ring-danger")) : s >= 90 ? (e.classList.add("text-warning"), t.classList.add("border-warning", "focus:border-warning", "focus:ring-warning")) : e.classList.add("text-muted");
  }
  /**
   * Get line height for textarea
   */
  getLineHeight(e) {
    const t = window.getComputedStyle(e), n = t.lineHeight;
    return n === "normal" ? parseFloat(t.fontSize) * 1.2 : parseFloat(n);
  }
  /**
   * Get vertical padding for textarea
   */
  getVerticalPadding(e) {
    const t = window.getComputedStyle(e), n = parseFloat(t.paddingTop), i = parseFloat(t.paddingBottom), s = parseFloat(t.borderTopWidth), a = parseFloat(t.borderBottomWidth);
    return n + i + s + a;
  }
  /**
   * Dispatch resize event
   */
  dispatchResizeEvent(e, t) {
    T.dispatchCustomEvent(e, "textarea-resize", {
      element: e,
      height: t
    });
  }
  /**
   * Dispatch character count event
   */
  dispatchCharacterCountEvent(e, t, n) {
    T.dispatchCustomEvent(e, "textarea-character-count", {
      element: e,
      currentLength: t,
      maxLength: n || void 0
    });
  }
  /**
   * Add a custom resize handler with automatic cleanup
   */
  addResizeHandler(e) {
    return T.addEventListener(document, "textarea-resize", (t) => {
      const n = t;
      e(n.detail.element, n.detail.height);
    });
  }
  /**
   * Add a custom character count handler with automatic cleanup
   */
  addCharacterCountHandler(e) {
    return T.addEventListener(document, "textarea-character-count", (t) => {
      e(t.detail);
    });
  }
  /**
   * Clean up TextareaActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = void 0);
  }
  /**
   * Manually trigger auto-resize for a specific textarea
   */
  triggerAutoResize(e) {
    e.dataset.autoResize === "true" && this.handleAutoResize(e);
  }
  /**
   * Manually trigger character count update for a specific textarea
   */
  triggerCharacterCountUpdate(e) {
    e.dataset.showCharacterCount === "true" && this.updateCharacterCount(e);
  }
}
gc.getInstance();
class mc extends ee {
  /**
   * Initialize alert elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-dismiss-alert]", (e, t) => {
      t.preventDefault(), this.handleDismissClick(e);
    }), T.handleDelegatedKeydown("[data-dismiss-alert]", (e, t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.handleDismissClick(e));
    });
  }
  /**
   * Handle dismiss button click
   */
  handleDismissClick(e) {
    const t = this.findAlertForButton(e);
    t && (this.dismissAlert(t), this.dispatchAlertEvent(t, "dismiss"));
  }
  /**
   * Find the alert element associated with a dismiss button
   */
  findAlertForButton(e) {
    return b.findClosest(e, '[data-dismissible="true"]');
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(e) {
    e.classList.add("alert-dismissing"), AnimationUtils.slideOut(e, "right", {
      duration: 300,
      easing: "ease-out",
      distance: 100
    }), AnimationUtils.collapseHeight(e, {
      toHeight: 0,
      duration: 300,
      easing: "ease-out",
      onComplete: () => {
        e.parentNode && e.parentNode.removeChild(e);
      }
    });
  }
  /**
   * Show an alert programmatically
   */
  showAlert(e) {
    e.style.display = "block", AnimationUtils.slideIn(e, "right", {
      duration: 300,
      easing: "ease-out",
      distance: 100,
      onComplete: () => {
        this.dispatchAlertEvent(e, "show");
      }
    });
  }
  /**
   * Create and show a new alert dynamically
   */
  createAlert(e) {
    const {
      variant: t = "info",
      title: n,
      message: i,
      dismissible: s = !0,
      duration: a,
      container: o = document.body
    } = e, l = document.createElement("div");
    l.className = this.getAlertClasses(t), l.setAttribute("role", "alert"), s && l.setAttribute("data-dismissible", "true");
    const c = this.buildAlertContent(t, n, i, s);
    return l.innerHTML = c, o.appendChild(l), l.style.opacity = "0", l.style.transform = "translateX(100%)", setTimeout(() => {
      this.showAlert(l);
    }, 10), a && a > 0 && AnimationUtils.createTimer(() => {
      this.dismissAlert(l);
    }, a), this.dispatchAlertEvent(l, "create"), l;
  }
  /**
   * Get CSS classes for alert variant
   */
  getAlertClasses(e) {
    const t = "rounded-lg border p-4 space-y-3", n = {
      info: "bg-info/5 border-info/20 text-info-foreground",
      success: "bg-success/5 border-success/20 text-success-foreground",
      warning: "bg-warning/5 border-warning/20 text-warning-foreground",
      danger: "bg-danger/5 border-danger/20 text-danger-foreground",
      neutral: "bg-neutral/5 border-neutral/20 text-neutral-foreground"
    };
    return `${t} ${n[e] || n.info}`;
  }
  /**
   * Build alert content HTML
   */
  buildAlertContent(e, t, n, i) {
    const s = this.getVariantIcon(e), a = this.getVariantIconColor(e);
    return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${a}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(s)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${t ? `<div class="text-base font-medium">${t}</div>` : ""}
                    <div class="text-sm opacity-90 ${t ? "mt-1" : ""}">${n || ""}</div>
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
  getVariantIcon(e) {
    const t = {
      info: "information-circle",
      success: "check-circle",
      warning: "exclamation-triangle",
      danger: "x-circle",
      neutral: "chat-bubble-left-ellipsis"
    };
    return t[e] || t.info;
  }
  /**
   * Get icon color for variant
   */
  getVariantIconColor(e) {
    const t = {
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      neutral: "text-neutral"
    };
    return t[e] || t.info;
  }
  /**
   * Get SVG path for icon
   */
  getIconSvg(e) {
    const t = {
      "information-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      "check-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      "exclamation-triangle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
      "x-circle": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      "chat-bubble-left-ellipsis": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
    };
    return t[e] || t["information-circle"];
  }
  /**
   * Dispatch custom event for alert action
   */
  dispatchAlertEvent(e, t) {
    T.dispatchCustomEvent(e, "alert-action", {
      alert: e,
      action: t
    }), T.dispatchCustomEvent(document.body, "alert-action", {
      alert: e,
      action: t
    });
  }
  /**
   * Add a custom alert action handler with automatic cleanup
   */
  addActionHandler(e, t) {
    return T.addEventListener(document, "alert-action", (n) => {
      const i = n;
      i.detail.action === e && t(i.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(e) {
    b.querySelectorAll(`[data-dismissible="true"][class*="${e}"]`).forEach((n) => {
      this.dismissAlert(n);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    b.querySelectorAll('[data-dismissible="true"]').forEach((t) => {
      this.dismissAlert(t);
    });
  }
  /**
   * Clean up AlertActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
mc.getInstance();
class Fh extends ee {
  constructor() {
    super(...arguments), this.failedUrls = /* @__PURE__ */ new Set(), this.MAX_RETRIES = 2, this.RETRY_DELAY = 1e3;
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
  }
  /**
   * Set up dynamic observer for newly added avatars
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
          n.hasAttribute("data-keys-avatar") && this.initializeAvatar(n), n.querySelectorAll('[data-keys-avatar="true"]').forEach((s) => {
            this.initializeAvatar(s);
          });
        }
      });
    });
  }
  /**
   * Initialize avatar elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll('[data-keys-avatar="true"]').forEach((t) => {
      this.initializeAvatar(t);
    });
  }
  /**
   * Initialize a single avatar element
   */
  initializeAvatar(e) {
    const t = e.querySelector("img"), n = e.querySelector('[data-avatar-fallback="true"]');
    if (!t)
      return;
    const i = e.getAttribute("data-fallback-type") || "icon", s = {
      element: e,
      img: t,
      fallbackContainer: n,
      hasInitials: i === "initials",
      hasIcon: i === "icon",
      retryCount: 0,
      maxRetries: this.MAX_RETRIES,
      isLoading: !1,
      hasFailed: !1
    };
    this.setState(e, s), this.setupImageErrorHandling(s), t.complete && !t.naturalWidth && this.handleImageError(s);
  }
  /**
   * Set up error handling for avatar image
   */
  setupImageErrorHandling(e) {
    e.img && (T.addEventListener(e.img, "error", () => {
      this.handleImageError(e);
    }), T.addEventListener(e.img, "load", () => {
      this.handleImageLoad(e);
    }), e.img.loading === "lazy" && this.setupLazyLoadingSupport(e));
  }
  /**
   * Handle image load error
   */
  handleImageError(e) {
    if (!e.img || e.hasFailed) return;
    const t = e.img.src;
    if (this.failedUrls.add(t), e.retryCount < e.maxRetries && !this.failedUrls.has(t)) {
      this.retryImageLoad(e);
      return;
    }
    e.hasFailed = !0, this.showFallback(e);
  }
  /**
   * Handle successful image load
   */
  handleImageLoad(e) {
    if (!e.img) return;
    const t = e.img.src;
    this.failedUrls.delete(t), e.hasFailed = !1, e.retryCount = 0, e.isLoading = !1, this.showImage(e);
  }
  /**
   * Retry loading the image after a delay
   */
  retryImageLoad(e) {
    !e.img || e.retryCount >= e.maxRetries || (e.retryCount++, e.isLoading = !0, e.element.setAttribute("data-avatar-loading", "true"), setTimeout(() => {
      if (!e.img || e.hasFailed) return;
      const t = e.img.src;
      e.img.src = "", requestAnimationFrame(() => {
        e.img && (e.img.src = t);
      });
    }, this.RETRY_DELAY * e.retryCount));
  }
  /**
   * Show the fallback (initials or icon) using existing styled template structure
   */
  showFallback(e) {
    e.img && (e.img.style.display = "none", e.fallbackContainer && (e.fallbackContainer.style.display = "block"), e.element.setAttribute("data-avatar-fallback-active", "true"), e.element.removeAttribute("data-avatar-image-active"), e.element.removeAttribute("data-avatar-loading"), this.updateAccessibility(e, "fallback"), this.dispatchAvatarEvent(e.element, "fallback", {
      hasInitials: e.hasInitials,
      hasIcon: e.hasIcon
    }));
  }
  /**
   * Show the image (hide fallback) using existing template structure
   */
  showImage(e) {
    e.img && (e.img.style.display = "block", e.fallbackContainer && (e.fallbackContainer.style.display = "none"), e.element.setAttribute("data-avatar-image-active", "true"), e.element.removeAttribute("data-avatar-fallback-active"), e.element.removeAttribute("data-avatar-loading"), this.updateAccessibility(e, "image"), this.dispatchAvatarEvent(e.element, "imageLoad", {
      src: e.img.src
    }));
  }
  /**
   * Set up lazy loading support
   */
  setupLazyLoadingSupport(e) {
    if (!e.img || !("IntersectionObserver" in window)) return;
    const t = new IntersectionObserver((n) => {
      n.forEach((i) => {
        i.isIntersecting && t.unobserve(i.target);
      });
    }, {
      rootMargin: "50px"
    });
    t.observe(e.img);
  }
  /**
   * Update accessibility attributes based on current state
   */
  updateAccessibility(e, t) {
    var s;
    const n = e.element.getAttribute("data-avatar-name"), i = (s = e.img) == null ? void 0 : s.getAttribute("alt");
    if (t === "fallback") {
      const a = e.hasInitials && n ? `Initials for ${n}` : "Avatar placeholder";
      e.element.setAttribute("aria-label", a);
    } else t === "image" && i && e.element.setAttribute("aria-label", i);
  }
  /**
   * Dispatch custom avatar events
   */
  dispatchAvatarEvent(e, t, n = {}) {
    const i = new CustomEvent(`avatar:${t}`, {
      detail: {
        element: e,
        ...n
      },
      bubbles: !0
    });
    e.dispatchEvent(i);
  }
  /**
   * Public method to manually trigger fallback for an avatar
   */
  triggerFallback(e) {
    const t = this.getState(e);
    t && !t.hasFailed && this.handleImageError(t);
  }
  /**
   * Public method to retry loading an avatar image
   */
  retryAvatar(e) {
    const t = this.getState(e);
    t && t.hasFailed && t.img && (t.hasFailed = !1, t.retryCount = 0, this.handleImageLoad(t));
  }
  /**
   * Public method to check if an avatar has failed
   */
  hasAvatarFailed(e) {
    const t = this.getState(e);
    return t ? t.hasFailed : !1;
  }
  /**
   * Clear failed URLs cache (useful for network recovery scenarios)
   */
  clearFailedUrlsCache() {
    this.failedUrls.clear();
  }
}
class bc extends ee {
  /**
   * Initialize badge elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-dismiss-target]", (e, t) => {
      t.preventDefault(), this.handleDismissClick(e);
    }), T.handleDelegatedKeydown("[data-dismiss-target]", (e, t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.handleDismissClick(e));
    });
  }
  /**
   * Handle dismiss button click
   */
  handleDismissClick(e) {
    const t = this.findBadgeForButton(e);
    t && (this.dismissBadge(t), this.dispatchBadgeEvent(t, "dismiss"));
  }
  /**
   * Find the badge element associated with a dismiss button
   */
  findBadgeForButton(e) {
    const t = e.getAttribute("data-dismiss-target");
    if (!t) return null;
    const n = t.startsWith("#") ? t.slice(1) : t;
    return b.querySelector(`#${n}`);
  }
  /**
   * Dismiss a badge with smooth animation
   */
  dismissBadge(e) {
    e.classList.add("badge-dismissing"), e.style.transition = "all 250ms ease-out", e.style.transform = "scale(0.8)", e.style.opacity = "0", setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 250);
  }
  /**
   * Show a badge programmatically
   */
  showBadge(e) {
    e.style.display = "inline-flex", e.style.opacity = "0", e.style.transform = "scale(0.8)", setTimeout(() => {
      e.style.transition = "all 250ms ease-out", e.style.opacity = "1", e.style.transform = "scale(1)", this.dispatchBadgeEvent(e, "show");
    }, 10);
  }
  /**
   * Create and show a new badge dynamically
   */
  createBadge(e) {
    const {
      variant: t = "simple",
      color: n = "blue",
      size: i = "sm",
      text: s,
      icon: a,
      dismissible: o = !1,
      container: l = document.body
    } = e, c = document.createElement(o ? "button" : "span"), d = o ? `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : void 0;
    c.className = this.getBadgeClasses(t, n, i), d && (c.id = d), o && (c.setAttribute("type", "button"), c.setAttribute("data-dismiss-target", `#${d}`), c.setAttribute("aria-label", "Remove badge"));
    const f = this.buildBadgeContent(s, a, o);
    return c.innerHTML = f, l.appendChild(c), c.style.opacity = "0", c.style.transform = "scale(0.8)", setTimeout(() => {
      this.showBadge(c);
    }, 10), this.dispatchBadgeEvent(c, "create"), c;
  }
  /**
   * Get CSS classes for badge
   */
  getBadgeClasses(e, t, n) {
    const i = "inline-flex items-center font-medium", s = {
      xs: "px-1.5 py-0.5 text-xs",
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-3 py-1 text-sm"
    }, a = {
      simple: "rounded-full",
      chip: "rounded-sm",
      subtle: ""
    }, o = this.getColorClasses(e, t);
    return `${i} ${s[n] || s.sm} ${a[e] || a.simple} ${o}`;
  }
  /**
   * Get color classes for badge
   */
  getColorClasses(e, t) {
    if (e === "subtle") {
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
      return i[t] || i.blue;
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
    return n[t] || n.blue;
  }
  /**
   * Build badge content HTML
   */
  buildBadgeContent(e, t, n) {
    let i = "";
    return t && (i += `<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <!-- Icon would be rendered here -->
            </svg>`), i += e, n && (i += `<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`), i;
  }
  /**
   * Dispatch custom event for badge action
   */
  dispatchBadgeEvent(e, t) {
    T.dispatchCustomEvent(e, "badge-action", {
      badge: e,
      action: t
    }), T.dispatchCustomEvent(document.body, "badge-action", {
      badge: e,
      action: t
    });
  }
  /**
   * Add a custom badge action handler with automatic cleanup
   */
  addActionHandler(e, t) {
    return T.addEventListener(document, "badge-action", (n) => {
      const i = n;
      i.detail.action === e && t(i.detail.badge);
    });
  }
  /**
   * Dismiss all badges of a specific color
   */
  dismissAllByColor(e) {
    b.querySelectorAll(`[data-dismissible="true"][class*="${e}"]`).forEach((n) => {
      this.dismissBadge(n);
    });
  }
  /**
   * Dismiss all dismissible badges
   */
  dismissAll() {
    b.querySelectorAll("[data-dismiss-target]").forEach((t) => {
      const n = this.findBadgeForButton(t);
      n && this.dismissBadge(n);
    });
  }
  /**
   * Clean up BadgeActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
const Ro = bc.getInstance();
class yc extends ee {
  /**
   * Initialize badge group elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll('[data-keys-badge-group="true"]').forEach((t) => {
      this.initializeBadgeGroup(t);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick('[data-badge-group-action="clear-all"]', (e, t) => {
      t.preventDefault(), this.handleClearAllClick(e);
    }), T.handleDelegatedKeydown('[data-badge-group-action="clear-all"]', (e, t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.handleClearAllClick(e));
    }), T.handleDelegatedClick('[data-badge-group-action="show-more"]', (e, t) => {
      t.preventDefault(), this.handleShowMoreClick(e);
    });
  }
  /**
   * Initialize a single badge group
   */
  initializeBadgeGroup(e) {
    this.applyMaxBadgeLogic(e), this.applySizeInheritance(e), this.dispatchGroupEvent(e, "init");
  }
  /**
   * Apply max badge logic to limit visible badges
   */
  applyMaxBadgeLogic(e) {
    const t = e.getAttribute("data-max");
    if (!t) return;
    const n = parseInt(t, 10);
    if (isNaN(n) || n < 1) return;
    const i = e.querySelector('[data-badge-container="true"]') || e, s = Array.from(i.children).filter(
      (o) => o.hasAttribute("data-keys-badge") || o.classList.contains("badge")
    );
    if (s.length <= n) return;
    const a = s.slice(n);
    a.forEach((o) => {
      o.style.display = "none", o.setAttribute("data-hidden-by-max", "true");
    }), this.createOrUpdateMoreIndicator(e, i, a.length);
  }
  /**
   * Create or update the "+N more" indicator
   */
  createOrUpdateMoreIndicator(e, t, n) {
    const i = t.querySelector('[data-badge-group-action="show-more"]');
    i && i.remove();
    const s = document.createElement("button");
    s.className = "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral/10 text-neutral hover:bg-neutral/20 transition-colors duration-200", s.setAttribute("data-badge-group-action", "show-more"), s.setAttribute("data-hidden-count", n.toString()), s.setAttribute("type", "button"), s.setAttribute("aria-label", `Show ${n} more badges`), s.innerHTML = `+${n} more`, t.appendChild(s);
  }
  /**
   * Apply size inheritance to child badges
   */
  applySizeInheritance(e) {
    const t = e.getAttribute("data-size");
    if (!t) return;
    e.style.setProperty("--badge-group-size", t), e.querySelectorAll('[data-keys-badge="true"]:not([data-size])').forEach((i) => {
      i.setAttribute("data-size", t), this.updateBadgeSizeClasses(i, t);
    });
  }
  /**
   * Update badge CSS classes for size inheritance
   */
  updateBadgeSizeClasses(e, t) {
    e.classList.remove("px-1.5", "py-0.5", "text-xs", "px-2.5", "px-3", "py-1", "text-sm");
    const n = {
      xs: ["px-1.5", "py-0.5", "text-xs"],
      sm: ["px-2.5", "py-0.5", "text-xs"],
      md: ["px-3", "py-1", "text-sm"]
    }, i = n[t] || n.sm;
    e.classList.add(...i);
  }
  /**
   * Handle "Clear All" button click
   */
  handleClearAllClick(e) {
    const t = this.findBadgeGroupForButton(e);
    t && (this.clearAllBadges(t), this.dispatchGroupEvent(t, "clear-all"));
  }
  /**
   * Handle "Show More" button click
   */
  handleShowMoreClick(e) {
    const t = this.findBadgeGroupForButton(e);
    t && (this.showAllBadges(t), this.dispatchGroupEvent(t, "show-more"));
  }
  /**
   * Find the badge group element associated with an action button
   */
  findBadgeGroupForButton(e) {
    return e.closest('[data-keys-badge-group="true"]');
  }
  /**
   * Clear all dismissible badges in a group
   */
  clearAllBadges(e) {
    e.querySelectorAll('[data-dismiss-target], [data-dismissible="true"]').forEach((i) => {
      if (i.hasAttribute("data-dismiss-target")) {
        const s = i.getAttribute("data-dismiss-target");
        if (s) {
          const a = b.querySelector(s.startsWith("#") ? s : `#${s}`);
          a && Ro.dismissBadge(a);
        }
      } else
        Ro.dismissBadge(i);
    });
    const n = e.querySelector('[data-badge-group-action="show-more"]');
    n && n.remove();
  }
  /**
   * Show all hidden badges in a group
   */
  showAllBadges(e) {
    e.querySelectorAll('[data-hidden-by-max="true"]').forEach((i) => {
      i.style.display = "", i.removeAttribute("data-hidden-by-max");
    });
    const n = e.querySelector('[data-badge-group-action="show-more"]');
    n && n.remove(), e.setAttribute("data-all-badges-shown", "true");
  }
  /**
   * Add a badge to a group programmatically
   */
  addBadgeToGroup(e, t) {
    const n = e.getAttribute("data-size"), i = t.size || n || "sm", s = Ro.createBadge({
      ...t,
      size: i,
      container: e.querySelector('[data-badge-container="true"]') || e
    });
    return this.applyMaxBadgeLogic(e), this.dispatchGroupEvent(e, "badge-added", [s]), s;
  }
  /**
   * Refresh a badge group (re-apply all logic)
   */
  refreshBadgeGroup(e) {
    this.initializeBadgeGroup(e);
  }
  /**
   * Dispatch custom event for badge group action
   */
  dispatchGroupEvent(e, t, n) {
    T.dispatchCustomEvent(e, "badge-group-action", {
      group: e,
      action: t,
      badges: n
    }), T.dispatchCustomEvent(document.body, "badge-group-action", {
      group: e,
      action: t,
      badges: n
    });
  }
  /**
   * Add a custom badge group action handler
   */
  addGroupActionHandler(e, t) {
    return T.addEventListener(document, "badge-group-action", (n) => {
      const i = n;
      i.detail.action === e && t(i.detail.group, i.detail.badges);
    });
  }
  /**
   * Initialize badge groups that are added dynamically
   */
  initializeDynamicGroups() {
    b.querySelectorAll('[data-keys-badge-group="true"]:not([data-group-initialized])').forEach((t) => {
      this.initializeBadgeGroup(t), t.setAttribute("data-group-initialized", "true");
    });
  }
  /**
   * Clean up BadgeGroupActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
yc.getInstance();
class vc extends ee {
  constructor() {
    super(...arguments), this.buttonStates = /* @__PURE__ */ new Map();
  }
  /**
   * Initialize multi-state button elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll('[data-multi-state="true"]').forEach((t) => {
      this.initializeButton(t);
    });
  }
  /**
   * Initialize a single multi-state button
   */
  initializeButton(e) {
    this.buttonStates.set(e, {
      current: "default",
      cycling: !1,
      element: e
    }), this.updateIconState(e, "default");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick('[data-multi-state="true"]', (e, t) => {
      t.preventDefault(), this.handleButtonClick(e);
    }), T.handleDelegatedKeydown('[data-multi-state="true"]', (e, t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.handleButtonClick(e));
    });
  }
  /**
   * Handle multi-state button click
   */
  async handleButtonClick(e) {
    const t = this.buttonStates.get(e);
    if (!t || t.cycling) return;
    const n = this.getNextState(t.current, e);
    t.cycling = !0, await this.transitionToState(e, n), t.current = n, t.cycling = !1, n === "success" && setTimeout(async () => {
      t.current === "success" && (t.cycling = !0, await this.transitionToState(e, "default"), t.current = "default", t.cycling = !1);
    }, 2e3), this.dispatchButtonEvent(e, n);
  }
  /**
   * Determine the next state for a button
   */
  getNextState(e, t) {
    const n = t.dataset.iconToggle, i = t.dataset.iconSuccess;
    switch (e) {
      case "default":
        return n ? "toggle" : i ? "success" : "default";
      case "toggle":
        return i ? "success" : "default";
      case "success":
      default:
        return "default";
    }
  }
  /**
   * Transition button to a specific state
   */
  async transitionToState(e, t) {
    this.updateIconState(e, t), this.updateButtonLabel(e, t), t === "success" && this.animateSuccessFeedback(e);
  }
  /**
   * Update button icon state using CSS classes
   */
  updateIconState(e, t) {
    const n = b.querySelector(".button-icon-default", e), i = b.querySelector(".button-icon-toggle", e), s = b.querySelector(".button-icon-success", e);
    [n, i, s].forEach((o) => {
      o && (o.classList.remove("opacity-100", "scale-110"), o.classList.add("opacity-0"));
    });
    let a = null;
    switch (t) {
      case "default":
        a = n;
        break;
      case "toggle":
        a = i;
        break;
      case "success":
        a = s, a && a.classList.add("scale-110");
        break;
    }
    a && (a.classList.remove("opacity-0"), a.classList.add("opacity-100"));
  }
  /**
   * Update button label and accessibility attributes
   */
  updateButtonLabel(e, t) {
    const n = b.querySelector(".sr-only", e);
    let i = null, s = null;
    switch (t) {
      case "default":
        const a = this.getOriginalLabel(e);
        i = a, s = a;
        break;
      case "toggle":
        i = e.dataset.labelToggle || null, s = e.dataset.labelToggle || null;
        break;
      case "success":
        i = e.dataset.labelSuccess || null, s = e.dataset.labelSuccess || null;
        break;
    }
    i && n && (n.textContent = i), s && e.setAttribute("aria-label", s), t === "toggle" ? e.setAttribute("aria-pressed", "true") : e.removeAttribute("aria-pressed");
  }
  /**
   * Get the original label for a button
   */
  getOriginalLabel(e) {
    var n;
    if (e.dataset.originalLabel)
      return e.dataset.originalLabel;
    const t = (n = e.textContent) == null ? void 0 : n.trim();
    return t ? (e.dataset.originalLabel = t, t) : e.getAttribute("aria-label") || "Button";
  }
  /**
   * Animate success feedback with scale and timing
   */
  animateSuccessFeedback(e) {
    e.classList.add("scale-105"), setTimeout(() => {
      e.classList.remove("scale-105");
    }, 200);
  }
  /**
   * Dispatch custom event for button state change
   */
  dispatchButtonEvent(e, t) {
    T.dispatchCustomEvent(e, "button-state-change", {
      element: e,
      state: t,
      timestamp: Date.now()
    });
  }
  /**
   * Public method to manually set button state
   */
  setButtonState(e, t) {
    const n = this.buttonStates.get(e);
    n || this.initializeButton(e), this.transitionToState(e, t), n && (n.current = t);
  }
  /**
   * Public method to get current button state
   */
  getButtonState(e) {
    const t = this.buttonStates.get(e);
    return t ? t.current : "default";
  }
  /**
   * Add a custom state change handler with automatic cleanup
   */
  addStateChangeHandler(e) {
    return T.addEventListener(document, "button-state-change", (t) => {
      const n = t;
      e(n.detail.element, n.detail.state);
    });
  }
  /**
   * Clean up ButtonActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.buttonStates.clear();
  }
}
vc.getInstance();
const ka = class ka {
  /**
   * Format Date object to string using custom format
   */
  static formatDate(e, t) {
    if (!e || isNaN(e.getTime()))
      return "";
    const n = e.getFullYear(), i = e.getMonth() + 1, s = e.getDate(), a = [
      ["YYYY", String(n)],
      ["YY", String(n).slice(-2)],
      ["Y", String(n)],
      ["y", String(n).slice(-2)],
      ["MMMM", this.MONTH_NAMES[i - 1]],
      ["MMM", this.MONTH_NAMES_SHORT[i - 1]],
      ["MM", String(i).padStart(2, "0")],
      ["M", this.MONTH_NAMES_SHORT[i - 1]],
      ["mm", String(i).padStart(2, "0")],
      ["m", String(i).padStart(2, "0")],
      ["n", String(i)],
      ["F", this.MONTH_NAMES[i - 1]],
      ["DD", String(s).padStart(2, "0")],
      ["dd", String(s).padStart(2, "0")],
      ["d", String(s).padStart(2, "0")],
      ["j", String(s)]
    ];
    let o = t;
    for (const [l, c] of a)
      o = o.replace(new RegExp(l, "g"), c);
    return o;
  }
  /**
   * Format Date object to YYYY-MM-DD string
   */
  static formatDateString(e) {
    if (!e || isNaN(e.getTime()))
      return "";
    const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), i = String(e.getDate()).padStart(2, "0");
    return `${t}-${n}-${i}`;
  }
  /**
   * Parse date string to Date object
   */
  static parseDate(e) {
    if (!e || typeof e != "string" || !e.trim())
      return null;
    try {
      const t = new Date(e);
      return isNaN(t.getTime()) ? null : t;
    } catch {
      return null;
    }
  }
  /**
   * Format date for display using specified format
   */
  static formatDateForDisplay(e, t) {
    if (!e) return "";
    const n = this.parseDate(e);
    return n ? this.formatDate(n, t) : "";
  }
  /**
   * Format date range for display
   */
  static formatRangeForDisplay(e, t, n, i = " - ") {
    if (!e) return "";
    const s = this.formatDateForDisplay(e, n), a = t ? this.formatDateForDisplay(t, n) : "";
    return a ? `${s}${i}${a}` : s;
  }
  /**
   * Format date range for form submission
   */
  static formatRangeForSubmission(e, t, n = "Y-m-d") {
    if (!e) return null;
    const i = this.formatDateForSubmission(e, n), s = t ? this.formatDateForSubmission(t, n) : "";
    return s ? `${i},${s}` : i;
  }
  /**
   * Format single date for form submission
   */
  static formatDateForSubmission(e, t = "Y-m-d") {
    if (!e) return "";
    const n = this.parseDate(e);
    return n ? this.formatDate(n, t) : "";
  }
  /**
   * Add days to a date string
   */
  static addDaysToDate(e, t) {
    const n = this.parseDate(e);
    return n ? (n.setDate(n.getDate() + t), this.formatDateString(n)) : e;
  }
  /**
   * Add months to a date string
   */
  static addMonthsToDate(e, t) {
    const n = this.parseDate(e);
    return n ? (n.setMonth(n.getMonth() + t), this.formatDateString(n)) : e;
  }
  /**
   * Get first day of month for a date string
   */
  static getFirstDayOfMonth(e) {
    const t = this.parseDate(e);
    return t ? (t.setDate(1), this.formatDateString(t)) : e;
  }
  /**
   * Get last day of month for a date string
   */
  static getLastDayOfMonth(e) {
    const t = this.parseDate(e);
    return t ? (t.setMonth(t.getMonth() + 1, 0), this.formatDateString(t)) : e;
  }
  /**
   * Get current year-month string (YYYY-MM)
   */
  static getCurrentYearMonth() {
    const e = /* @__PURE__ */ new Date();
    return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}`;
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
  static isToday(e) {
    return e === this.getTodayDate();
  }
  /**
   * Check if a date is within a range
   */
  static isDateInRange(e, t, n) {
    if (!t || !n) return !1;
    const i = this.parseDate(e), s = this.parseDate(t), a = this.parseDate(n);
    return !i || !s || !a ? !1 : i >= s && i <= a;
  }
  /**
   * Check if a date matches start of range
   */
  static isDateRangeStart(e, t) {
    return t === e;
  }
  /**
   * Check if a date matches end of range
   */
  static isDateRangeEnd(e, t) {
    return t === e;
  }
  /**
   * Get placeholder text for date format
   */
  static getFormatPlaceholder(e) {
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
    }[e] || "YYYY-MM-DD";
  }
  /**
   * Parse input date string with multiple format support
   */
  static parseInputDate(e, t) {
    if (!e || !e.trim()) return null;
    try {
      const n = new Date(e);
      if (!isNaN(n.getTime()))
        return n;
    } catch {
    }
    return null;
  }
  /**
   * Create ARIA label for date with contextual information
   */
  static createDateAriaLabel(e, t = !1, n = !1, i = !1, s = !1, a = !1) {
    const o = this.parseDate(e);
    if (!o) return e;
    let c = o.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return t && (c += ", Today"), n ? c += ", Selected" : i ? c += ", Range start" : s ? c += ", Range end" : a && (c += ", In selected range"), c;
  }
  /**
   * Validate date string format
   */
  static isValidDateString(e) {
    const t = this.parseDate(e);
    return t !== null && !isNaN(t.getTime());
  }
  /**
   * Compare two date strings
   */
  static compareDates(e, t) {
    const n = this.parseDate(e), i = this.parseDate(t);
    return !n || !i ? 0 : n.getTime() - i.getTime();
  }
  /**
   * Get quick selector date ranges
   */
  static getQuickSelectorDate(e) {
    const t = /* @__PURE__ */ new Date();
    let n = null, i = null;
    switch (e) {
      case "today":
        n = t, i = t;
        break;
      case "yesterday":
        n = new Date(t), n.setDate(t.getDate() - 1), i = n;
        break;
      case "last7days":
        i = t, n = new Date(t), n.setDate(t.getDate() - 6);
        break;
      case "last30days":
        i = t, n = new Date(t), n.setDate(t.getDate() - 29);
        break;
      case "thismonth":
        n = new Date(t.getFullYear(), t.getMonth(), 1), i = new Date(t.getFullYear(), t.getMonth() + 1, 0);
        break;
      case "lastmonth":
        n = new Date(t.getFullYear(), t.getMonth() - 1, 1), i = new Date(t.getFullYear(), t.getMonth(), 0);
        break;
      case "thisyear":
        n = new Date(t.getFullYear(), 0, 1), i = new Date(t.getFullYear(), 11, 31);
        break;
    }
    return { start: n, end: i };
  }
};
ka.MONTH_NAMES = [
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
], ka.MONTH_NAMES_SHORT = [
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
let ve = ka;
class Pt {
  /**
   * Handle date selection for both single and range modes
   */
  static selectDate(e, t, n, i) {
    n.isDisabled || (n.isRange ? this.handleRangeSelection(e, t, n, i) : i({
      selectedDate: t,
      focusedDate: t
    }));
  }
  /**
   * Handle range selection logic with proper start/end management
   */
  static handleRangeSelection(e, t, n, i) {
    const s = new Date(t);
    if (!n.startDate || n.rangeSelectionState === "none") {
      i({
        startDate: t,
        endDate: null,
        focusedDate: t,
        rangeSelectionState: "selecting-end"
      });
      return;
    }
    if (n.startDate && !n.endDate) {
      const a = new Date(n.startDate);
      s < a ? i({
        startDate: t,
        endDate: null,
        focusedDate: t,
        rangeSelectionState: "selecting-end"
      }) : s.getTime() === a.getTime() ? i({
        startDate: null,
        endDate: null,
        focusedDate: t,
        rangeSelectionState: "none"
      }) : i({
        endDate: t,
        focusedDate: t,
        rangeSelectionState: "none"
      });
      return;
    }
    i({
      startDate: t,
      endDate: null,
      focusedDate: t,
      rangeSelectionState: "selecting-end"
    });
  }
  /**
   * Clear selected dates (single or range)
   */
  static clearSelection(e, t, n) {
    t.isRange ? n({
      startDate: null,
      endDate: null,
      rangeSelectionState: "none"
    }) : n({
      selectedDate: null
    });
  }
  /**
   * Select today's date
   */
  static selectToday(e, t, n) {
    const i = this.getTodayDate();
    t.isRange ? n({
      startDate: i,
      endDate: i,
      focusedDate: i,
      rangeSelectionState: "none"
    }) : n({
      selectedDate: i,
      focusedDate: i
    });
  }
  /**
   * Format range dates for display
   */
  static formatRangeForDisplay(e, t) {
    return !e && !t ? "" : e && t ? `${e},${t}` : e ? `${e},` : "";
  }
  /**
   * Check if a date is within the selected range
   */
  static isDateInRange(e, t, n) {
    if (!t || !n) return !1;
    const i = new Date(e), s = new Date(t), a = new Date(n);
    return i >= s && i <= a;
  }
  /**
   * Check if a date is the range start
   */
  static isDateRangeStart(e, t) {
    return t === e;
  }
  /**
   * Check if a date is the range end
   */
  static isDateRangeEnd(e, t) {
    return t === e;
  }
  /**
   * Get range attributes for styling
   */
  static getRangeAttributes(e, t) {
    if (!t.isRange) return "";
    const n = [];
    return e.isInRange && n.push('data-is-in-range="true"'), e.isRangeStart && n.push('data-is-range-start="true"'), e.isRangeEnd && n.push('data-is-range-end="true"'), n.join(" ");
  }
  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getTodayDate() {
    const e = /* @__PURE__ */ new Date();
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
  }
  /**
   * Check if a date string represents today
   */
  static isToday(e) {
    return e === this.getTodayDate();
  }
}
class am {
  /**
   * Generate calendar grid data for a specific month
   */
  static generateCalendarGrid(e, t, n = 0) {
    const i = this.addMonthsToDate(t.currentMonth + "-01", n), s = parseInt(i.substring(0, 4)), a = parseInt(i.substring(5, 7)) - 1, o = new Date(s, a, 1), l = new Date(o);
    l.setDate(l.getDate() - o.getDay());
    const c = [];
    let d = [];
    for (let f = 0; f < 42; f++) {
      const h = new Date(l);
      h.setDate(l.getDate() + f);
      const g = this.formatDateString(h), m = h.getMonth() === a, y = Pt.isToday(g), x = t.selectedDate === g, w = this.isDateDisabled(e, h, t), S = t.isRange ? Pt.isDateInRange(g, t.startDate, t.endDate) : !1, E = t.isRange ? Pt.isDateRangeStart(g, t.startDate) : !1, C = t.isRange ? Pt.isDateRangeEnd(g, t.endDate) : !1, I = {
        date: g,
        day: h.getDate(),
        isCurrentMonth: m,
        isToday: y,
        isSelected: x,
        isDisabled: w,
        isInRange: S,
        isRangeStart: E,
        isRangeEnd: C
      };
      d.push(I), d.length === 7 && (c.push(d), d = []);
    }
    return c;
  }
  /**
   * Render the complete calendar grid
   */
  static renderCalendarGrid(e, t) {
    t.monthsToShow > 1 ? this.renderMultipleMonths(e, t) : this.renderSingleMonth(e, t);
  }
  /**
   * Render a single month calendar
   */
  static renderSingleMonth(e, t) {
    const n = e.querySelector("[data-calendar-grid-container]");
    if (!n) return;
    const i = this.generateCalendarGrid(e, t), s = this.getCellClasses(e), a = t.weekdays.map(
      (c) => `<div class="${s} font-semibold text-muted text-center">${c}</div>`
    ).join(""), o = i.map(
      (c) => c.map((d) => {
        const f = this.getDayButtonClasses(d, e, t), h = Pt.getRangeAttributes(d, t), g = this.getDateAriaLabel(d, t);
        return `
                    <div class="calendar-day ${s}">
                        <button
                            type="button"
                            class="${f}"
                            data-date="${d.date}"
                            data-calendar-day-btn
                            ${d.isDisabled ? "disabled" : ""}
                            ${h}
                            aria-label="${g}"
                            tabindex="${d.date === t.focusedDate ? "0" : "-1"}"
                        >
                            ${d.day}
                        </button>
                    </div>
                `;
      }).join("")
    ).join(""), l = `
            <div class="calendar-weekdays-grid grid grid-cols-7 gap-0">
                ${a}
            </div>
            <div class="calendar-days-grid grid grid-cols-7 gap-0">
                ${o}
            </div>
        `;
    n.innerHTML = l;
  }
  /**
   * Render multiple months calendar
   */
  static renderMultipleMonths(e, t) {
    e.querySelectorAll("[data-calendar-grid-container]").forEach((i, s) => {
      if (s >= t.monthsToShow) return;
      const a = this.generateCalendarGrid(e, t, s), o = this.getCellClasses(e), l = this.addMonthsToDate(t.currentMonth + "-01", s), c = t.monthNames[parseInt(l.substring(5, 7)) - 1], d = l.substring(0, 4), f = `
                <div class="calendar-month-header text-center font-semibold text-sm mb-2 text-muted">
                    ${c} ${d}
                </div>
            `, h = t.weekdays.map(
        (y) => `<div class="${o} font-semibold text-muted text-center text-xs">${y}</div>`
      ).join(""), g = a.map(
        (y) => y.map((x) => {
          const w = this.getDayButtonClasses(x, e, t), S = Pt.getRangeAttributes(x, t), E = this.getDateAriaLabel(x, t);
          return `
                        <div class="calendar-day ${o}">
                            <button
                                type="button"
                                class="${w}"
                                data-date="${x.date}"
                                data-calendar-day-btn
                                data-month-index="${s}"
                                ${x.isDisabled ? "disabled" : ""}
                                ${S}
                                aria-label="${E}"
                                tabindex="${x.date === t.focusedDate ? "0" : "-1"}"
                            >
                                ${x.day}
                            </button>
                        </div>
                    `;
        }).join("")
      ).join(""), m = `
                ${f}
                <div class="calendar-weekdays-grid grid grid-cols-7 gap-0 mb-1">
                    ${h}
                </div>
                <div class="calendar-days-grid grid grid-cols-7 gap-0">
                    ${g}
                </div>
            `;
      i.innerHTML = m;
    });
  }
  /**
   * Get responsive cell classes based on calendar size
   */
  static getCellClasses(e) {
    const t = e.dataset.size || "md";
    return {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base"
    }[t] || "w-10 h-10 text-sm";
  }
  /**
   * Get day button classes with proper state styling
   */
  static getDayButtonClasses(e, t, n) {
    const i = t.dataset.size || "md", s = "w-full h-full rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1", a = {
      sm: "text-xs",
      md: "text-sm font-medium",
      lg: "text-base font-medium"
    }[i] || "text-sm font-medium";
    let o = "";
    return e.isDisabled ? o = "bg-surface text-muted border-transparent cursor-not-allowed opacity-40 hover:bg-surface hover:border-transparent" : e.isSelected && !n.isRange ? o = "bg-brand text-white border-brand-600 font-bold shadow-sm" : e.isToday ? o = "bg-neutral-50 text-brand border-brand font-semibold" : e.isCurrentMonth ? o = "text-foreground border-transparent hover:bg-neutral-hover hover:border-border" : o = "text-muted border-transparent hover:bg-neutral-hover hover:border-border", `${s} ${a} ${o}`.trim();
  }
  /**
   * Generate accessible aria-label for date buttons
   */
  static getDateAriaLabel(e, t) {
    const n = new Date(e.date), i = n.toLocaleDateString("en-US", { weekday: "long" }), s = n.toLocaleDateString("en-US", { month: "long" });
    let a = `${i}, ${s} ${e.day}, ${n.getFullYear()}`;
    return e.isToday && (a += ", today"), e.isSelected && (a += ", selected"), e.isRangeStart && (a += ", range start"), e.isRangeEnd && (a += ", range end"), e.isInRange && (a += ", in range"), e.isDisabled && (a += ", disabled"), a;
  }
  /**
   * Check if a date should be disabled
   */
  static isDateDisabled(e, t, n) {
    if (n.isDisabled) return !0;
    const i = this.formatDateString(t);
    return n.minDate && i < n.minDate || n.maxDate && i > n.maxDate ? !0 : n.disabledDates && Array.isArray(n.disabledDates) ? n.disabledDates.includes(i) : !1;
  }
  /**
   * Format date as YYYY-MM-DD string
   */
  static formatDateString(e) {
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
  }
  /**
   * Add months to a date string
   */
  static addMonthsToDate(e, t) {
    const n = new Date(e);
    return n.setMonth(n.getMonth() + t), this.formatDateString(n);
  }
}
class wn {
  /**
   * Navigate to previous or next month
   */
  static navigateMonth(e, t, n, i, s) {
    if (n.isDisabled) return;
    const a = /* @__PURE__ */ new Date(n.currentMonth + "-01"), o = new Date(a);
    t === "prev" ? o.setMonth(a.getMonth() - 1) : o.setMonth(a.getMonth() + 1);
    const l = this.formatYearMonth(o);
    this.canNavigateToMonth(o, n) && (i({
      currentMonth: l,
      viewMode: "calendar"
    }), s(), this.updateMonthYearDisplay(e, n.monthNames, l));
  }
  /**
   * Navigate to today's month
   */
  static navigateToToday(e, t, n, i) {
    const s = /* @__PURE__ */ new Date(), a = this.formatYearMonth(s);
    a !== t.currentMonth && (n({
      currentMonth: a,
      viewMode: "calendar"
    }), i(), this.updateMonthYearDisplay(e, t.monthNames, a));
  }
  /**
   * Toggle month/year dropdown
   */
  static toggleMonthYearDropdown(e, t, n, i) {
    t.isDisabled || (t.viewMode === "calendar" ? (n({ viewMode: "month" }), this.renderMonthGrid(e, t, n, i)) : t.viewMode === "month" ? (n({ viewMode: "year" }), this.renderYearGrid(e, t, n, i)) : (n({ viewMode: "calendar" }), i()));
  }
  /**
   * Render month selection grid
   */
  static renderMonthGrid(e, t, n, i) {
    const s = e.querySelector("[data-calendar-grid-container]");
    if (!s) return;
    const a = parseInt(t.currentMonth.substring(0, 4)), o = parseInt(t.currentMonth.substring(5, 7)) - 1, l = t.monthNames.map((f, h) => {
      const g = h === o, m = this.isMonthDisabled(e, a, h, t);
      return `
                <button
                    type="button"
                    class="${this.getMonthButtonClasses(g, m)} month-option"
                    data-month="${h}"
                    data-calendar-month-btn
                    ${m ? "disabled" : ""}
                    aria-label="Select ${f} ${a}"
                >
                    ${f}
                </button>
            `;
    }).join(""), d = `
            ${`
            <div class="flex items-center justify-between mb-4">
                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-brand"
                    data-calendar-year-nav="prev"
                    aria-label="Previous year"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    type="button"
                    class="text-lg font-semibold px-4 py-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-brand"
                    data-calendar-year-btn
                    aria-label="Select year ${a}"
                >
                    ${a}
                </button>

                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-brand"
                    data-calendar-year-nav="next"
                    aria-label="Next year"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        `}
            <div class="month-grid grid grid-cols-3 gap-2">
                ${l}
            </div>
        `;
    s.innerHTML = d, this.bindMonthGridEvents(e, t, n, i);
  }
  /**
   * Render year selection grid
   */
  static renderYearGrid(e, t, n, i) {
    const s = e.querySelector("[data-calendar-grid-container]");
    if (!s) return;
    const a = parseInt(t.currentMonth.substring(0, 4)), o = Math.floor(a / 10) * 10, c = Array.from({ length: 12 }, (h, g) => o - 1 + g).map((h) => {
      const g = h === a, m = this.isYearDisabled(e, h, t), y = h < o || h >= o + 10;
      return `
                <button
                    type="button"
                    class="${this.getYearButtonClasses(g, m, y)} year-option"
                    data-year="${h}"
                    data-calendar-year-option
                    ${m ? "disabled" : ""}
                    aria-label="Select year ${h}"
                >
                    ${h}
                </button>
            `;
    }).join(""), f = `
            ${`
            <div class="flex items-center justify-between mb-4">
                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-brand"
                    data-calendar-decade-nav="prev"
                    aria-label="Previous decade"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <span class="text-lg font-semibold">
                    ${o} - ${o + 9}
                </span>

                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-brand"
                    data-calendar-decade-nav="next"
                    aria-label="Next decade"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        `}
            <div class="year-grid grid grid-cols-4 gap-2">
                ${c}
            </div>
        `;
    s.innerHTML = f, this.bindYearGridEvents(e, t, n, i);
  }
  /**
   * Select a specific month
   */
  static selectMonth(e, t, n, i, s) {
    const o = `${n.currentMonth.substring(0, 4)}-${String(t + 1).padStart(2, "0")}`;
    i({
      currentMonth: o,
      viewMode: "calendar"
    }), s(), this.updateMonthYearDisplay(e, n.monthNames, o);
  }
  /**
   * Select a specific year
   */
  static selectYear(e, t, n, i, s) {
    const a = n.currentMonth.substring(5, 7), o = `${t}-${a}`;
    i({
      currentMonth: o,
      viewMode: "month"
    }), this.renderMonthGrid(e, n, i, s);
  }
  /**
   * Navigate year in month/year picker
   */
  static navigateYear(e, t, n, i, s) {
    if (n.isDisabled) return;
    const a = parseInt(n.currentMonth.substring(0, 4)), o = t === "prev" ? a - 1 : a + 1, l = n.currentMonth.substring(5, 7), c = `${o}-${l}`;
    i({
      currentMonth: c
    }), n.viewMode === "year" ? this.renderYearGrid(e, n, i, s) : n.viewMode === "month" && this.renderMonthGrid(e, n, i, s);
  }
  /**
   * Check if navigation to a specific month is allowed
   */
  static canNavigateToMonth(e, t) {
    if (t.minDate) {
      const n = new Date(t.minDate), i = new Date(n.getFullYear(), n.getMonth(), 1);
      if (e < i) return !1;
    }
    if (t.maxDate) {
      const n = new Date(t.maxDate), i = new Date(n.getFullYear(), n.getMonth(), 1);
      if (e > i) return !1;
    }
    return !0;
  }
  /**
   * Check if a specific month is disabled
   */
  static isMonthDisabled(e, t, n, i) {
    if (i.minDate) {
      const s = new Date(i.minDate);
      if (t < s.getFullYear() || t === s.getFullYear() && n < s.getMonth())
        return !0;
    }
    if (i.maxDate) {
      const s = new Date(i.maxDate);
      if (t > s.getFullYear() || t === s.getFullYear() && n > s.getMonth())
        return !0;
    }
    return !1;
  }
  /**
   * Check if a specific year is disabled
   */
  static isYearDisabled(e, t, n) {
    return !!(n.minDate && t < new Date(n.minDate).getFullYear() || n.maxDate && t > new Date(n.maxDate).getFullYear());
  }
  /**
   * Update month/year display in header
   */
  static updateMonthYearDisplay(e, t, n) {
    const i = e.querySelector(".calendar-month-year-display");
    if (!i) return;
    const s = n.substring(0, 4), a = parseInt(n.substring(5, 7)) - 1, o = t[a];
    i.textContent = `${o} ${s}`;
  }
  /**
   * Get month button classes
   */
  static getMonthButtonClasses(e, t) {
    const n = "w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand";
    return t ? `${n} bg-surface text-muted cursor-not-allowed opacity-50` : e ? `${n} bg-brand text-white font-semibold shadow-sm` : `${n} text-foreground hover:bg-neutral-hover hover:scale-105`;
  }
  /**
   * Get year button classes
   */
  static getYearButtonClasses(e, t, n) {
    const i = "w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand";
    return t ? `${i} bg-surface text-muted cursor-not-allowed opacity-50` : e ? `${i} bg-brand text-white font-semibold shadow-sm` : n ? `${i} text-muted hover:bg-neutral-hover opacity-75` : `${i} text-foreground hover:bg-neutral-hover hover:scale-105`;
  }
  /**
   * Format date as YYYY-MM string
   */
  static formatYearMonth(e) {
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0");
  }
  /**
   * Bind month grid event listeners
   */
  static bindMonthGridEvents(e, t, n, i) {
    var s;
    e.querySelectorAll("[data-calendar-month-btn]").forEach((a) => {
      a.addEventListener("click", (o) => {
        const l = parseInt(o.target.dataset.month || "0");
        this.selectMonth(e, l, t, n, i);
      });
    }), (s = e.querySelector("[data-calendar-year-btn]")) == null || s.addEventListener("click", () => {
      n({ viewMode: "year" }), this.renderYearGrid(e, t, n, i);
    });
  }
  /**
   * Bind year grid event listeners
   */
  static bindYearGridEvents(e, t, n, i) {
    e.querySelectorAll("[data-calendar-year-option]").forEach((s) => {
      s.addEventListener("click", (a) => {
        const o = parseInt(a.target.dataset.year || "0");
        this.selectYear(e, o, t, n, i);
      });
    }), e.querySelectorAll("[data-calendar-decade-nav]").forEach((s) => {
      s.addEventListener("click", (a) => {
        const o = a.target.dataset.calendarDecadeNav, l = parseInt(t.currentMonth.substring(0, 4)), c = Math.floor(l / 10) * 10, h = `${(o === "prev" ? c - 10 : c + 10) + l % 10}-${t.currentMonth.substring(5, 7)}`;
        n({ currentMonth: h }), this.renderYearGrid(e, t, n, i);
      });
    });
  }
}
class Po {
  /**
   * Handle keyboard navigation
   */
  static handleKeydown(e, t, n, i, s, a) {
    if (n.isDisabled || !n.focusedDate) return;
    const { key: o, ctrlKey: l, shiftKey: c } = t;
    switch (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", "Enter", " ", "Escape"].includes(o) && t.preventDefault(), o) {
      case "ArrowLeft":
        this.navigateByDays(e, -1, n, i, a);
        break;
      case "ArrowRight":
        this.navigateByDays(e, 1, n, i, a);
        break;
      case "ArrowUp":
        this.navigateByDays(e, -7, n, i, a);
        break;
      case "ArrowDown":
        this.navigateByDays(e, 7, n, i, a);
        break;
      case "PageUp":
        c ? this.navigateByYears(e, -1, n, i, a) : this.navigateByMonths(e, -1, n, i, a);
        break;
      case "PageDown":
        c ? this.navigateByYears(e, 1, n, i, a) : this.navigateByMonths(e, 1, n, i, a);
        break;
      case "Home":
        l ? this.navigateToToday(e, n, i, a) : this.navigateToWeekStart(e, n, i, a);
        break;
      case "End":
        this.navigateToWeekEnd(e, n, i, a);
        break;
      case "Enter":
      case " ":
        n.focusedDate && s(n.focusedDate);
        break;
      case "Escape":
        this.handleEscape(e, n, i, a);
        break;
      case "t":
      case "T":
        !l && !c && this.navigateToToday(e, n, i, a);
        break;
    }
  }
  /**
   * Navigate by a specific number of days
   */
  static navigateByDays(e, t, n, i, s) {
    if (!n.focusedDate) return;
    const a = this.addDaysToDate(n.focusedDate, t);
    this.isDateNavigable(a, n) && this.focusDate(e, a, n, i, s);
  }
  /**
   * Navigate by a specific number of months
   */
  static navigateByMonths(e, t, n, i, s) {
    if (!n.focusedDate) return;
    const a = new Date(n.focusedDate), o = new Date(a);
    o.setMonth(a.getMonth() + t), o.getDate() !== a.getDate() && o.setDate(0);
    const l = this.formatDateString(o);
    if (this.isDateNavigable(l, n)) {
      const c = this.formatYearMonth(o);
      c !== n.currentMonth ? (i({
        currentMonth: c,
        focusedDate: l
      }), s()) : this.focusDate(e, l, n, i, s);
    }
  }
  /**
   * Navigate by a specific number of years
   */
  static navigateByYears(e, t, n, i, s) {
    if (!n.focusedDate) return;
    const a = new Date(n.focusedDate), o = new Date(a);
    o.setFullYear(a.getFullYear() + t), o.getMonth() !== a.getMonth() && o.setDate(0);
    const l = this.formatDateString(o);
    if (this.isDateNavigable(l, n)) {
      const c = this.formatYearMonth(o);
      i({
        currentMonth: c,
        focusedDate: l
      }), setTimeout(() => s(), 100);
    }
  }
  /**
   * Navigate to the start of the current week (Sunday)
   */
  static navigateToWeekStart(e, t, n, i) {
    if (!t.focusedDate) return;
    const s = new Date(t.focusedDate), a = s.getDay(), o = new Date(s);
    o.setDate(s.getDate() - a);
    const l = this.formatDateString(o);
    this.isDateNavigable(l, t) && this.focusDate(e, l, t, n, i);
  }
  /**
   * Navigate to the end of the current week (Saturday)
   */
  static navigateToWeekEnd(e, t, n, i) {
    if (!t.focusedDate) return;
    const s = new Date(t.focusedDate), a = 6 - s.getDay(), o = new Date(s);
    o.setDate(s.getDate() + a);
    const l = this.formatDateString(o);
    this.isDateNavigable(l, t) && this.focusDate(e, l, t, n, i);
  }
  /**
   * Navigate to today's date
   */
  static navigateToToday(e, t, n, i) {
    const s = this.getTodayDate();
    if (this.isDateNavigable(s, t)) {
      const a = this.formatYearMonth(new Date(s));
      a !== t.currentMonth ? (n({
        currentMonth: a,
        focusedDate: s
      }), i()) : this.focusDate(e, s, t, n, i);
    }
  }
  /**
   * Handle Escape key - close dropdowns or cancel operations
   */
  static handleEscape(e, t, n, i) {
    t.viewMode !== "calendar" ? (n({ viewMode: "calendar" }), setTimeout(() => i(), 100)) : t.isRange && t.rangeSelectionState === "selecting-end" && (n({
      rangeSelectionState: "none",
      startDate: null,
      endDate: null
    }), setTimeout(() => i(), 100));
  }
  /**
   * Focus a specific date and update visual state
   */
  static focusDate(e, t, n, i, s) {
    i({ focusedDate: t }), e.querySelectorAll("[data-calendar-day-btn]").forEach((o) => {
      o.setAttribute("tabindex", "-1");
    });
    const a = e.querySelector(`[data-calendar-day-btn][data-date="${t}"]`);
    a && (a.setAttribute("tabindex", "0"), a.focus());
  }
  /**
   * Check if a date can be navigated to (not disabled)
   */
  static isDateNavigable(e, t) {
    return !(t.minDate && e < t.minDate || t.maxDate && e > t.maxDate || t.disabledDates.includes(e));
  }
  /**
   * Add days to a date string
   */
  static addDaysToDate(e, t) {
    const n = new Date(e);
    return n.setDate(n.getDate() + t), this.formatDateString(n);
  }
  /**
   * Format date as YYYY-MM-DD string
   */
  static formatDateString(e) {
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
  }
  /**
   * Format date as YYYY-MM string
   */
  static formatYearMonth(e) {
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0");
  }
  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getTodayDate() {
    const e = /* @__PURE__ */ new Date();
    return this.formatDateString(e);
  }
  /**
   * Set up keyboard event listeners for a calendar
   */
  static bindKeyboardEvents(e, t, n, i, s) {
    e.removeEventListener("keydown", e.dataset.keydownHandler);
    const a = (o) => {
      this.handleKeydown(e, o, t, n, i, s);
    };
    e.dataset.keydownHandler = a.toString(), e.addEventListener("keydown", a), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0");
  }
  /**
   * Initialize focus for a calendar
   */
  static initializeFocus(e, t) {
    const n = t.focusedDate || this.getTodayDate(), i = e.querySelector(`[data-calendar-day-btn][data-date="${n}"]`);
    i && (i.setAttribute("tabindex", "0"), document.activeElement === e && i.focus());
  }
  /**
   * Cleanup keyboard event listeners
   */
  static unbindKeyboardEvents(e) {
    const t = e.dataset.keydownHandler;
    t && (e.removeEventListener("keydown", t), delete e.dataset.keydownHandler);
  }
}
class tn {
  /**
   * Update hidden form inputs based on current selection
   */
  static updateHiddenInput(e, t) {
    t.isRange ? this.updateRangeInputs(e, t) : this.updateSingleInput(e, t);
  }
  /**
   * Update hidden inputs for range mode
   */
  static updateRangeInputs(e, t) {
    const n = e.querySelector(".calendar-start-input"), i = e.querySelector(".calendar-end-input"), s = e.querySelector(".calendar-range-input");
    n && (n.value = t.startDate || ""), i && (i.value = t.endDate || ""), s && (s.value = Pt.formatRangeForDisplay(t.startDate, t.endDate)), [n, i, s].forEach((a) => {
      a && this.dispatchInputChangeEvent(a);
    });
  }
  /**
   * Update hidden input for single date mode
   */
  static updateSingleInput(e, t) {
    const n = e.querySelector(".calendar-hidden-input");
    n && (n.value = t.selectedDate || "", this.dispatchInputChangeEvent(n));
  }
  /**
   * Dispatch change event on input for framework integration
   */
  static dispatchInputChangeEvent(e) {
    const t = new Event("input", { bubbles: !0 }), n = new Event("change", { bubbles: !0 });
    e.dispatchEvent(t), e.dispatchEvent(n), window.Livewire && e.hasAttribute("wire:model") && window.Livewire.hook("message.processed", () => {
    });
  }
  /**
   * Handle quick selector actions
   */
  static handleQuickSelector(e, t, n, i, s) {
    const a = /* @__PURE__ */ new Date();
    let o = null, l = null, c = null;
    switch (t) {
      case "today":
        if (c = this.formatDateString(a), this.isDateDisabled(c, n)) {
          console.warn("Today is disabled and cannot be selected");
          return;
        }
        n.isRange && (o = c, l = c);
        break;
      case "yesterday":
        const g = new Date(a);
        if (g.setDate(g.getDate() - 1), c = this.formatDateString(g), this.isDateDisabled(c, n)) {
          console.warn("Yesterday is disabled and cannot be selected");
          return;
        }
        n.isRange && (o = c, l = c);
        break;
      case "last7days":
        if (n.isRange) {
          l = this.formatDateString(a);
          const m = new Date(a);
          m.setDate(a.getDate() - 6), o = this.formatDateString(m);
        }
        break;
      case "last30days":
        if (n.isRange) {
          l = this.formatDateString(a);
          const m = new Date(a);
          m.setDate(a.getDate() - 29), o = this.formatDateString(m);
        }
        break;
      case "thismonth":
        if (n.isRange) {
          const m = new Date(a.getFullYear(), a.getMonth(), 1), y = new Date(a.getFullYear(), a.getMonth() + 1, 0);
          o = this.formatDateString(m), l = this.formatDateString(y);
        }
        break;
      case "lastmonth":
        if (n.isRange) {
          const m = new Date(a.getFullYear(), a.getMonth() - 1, 1), y = new Date(a.getFullYear(), a.getMonth(), 0);
          o = this.formatDateString(m), l = this.formatDateString(y);
        }
        break;
      case "thisyear":
        if (n.isRange) {
          const m = new Date(a.getFullYear(), 0, 1), y = new Date(a.getFullYear(), 11, 31);
          o = this.formatDateString(m), l = this.formatDateString(y);
        }
        break;
      default:
        console.warn(`Unknown quick selector value: ${t}`);
        return;
    }
    const d = l || c;
    let f = n.currentMonth;
    d && (f = this.formatYearMonth(new Date(d))), n.isRange && o && l ? i({
      startDate: o,
      endDate: l,
      rangeSelectionState: "none",
      focusedDate: l,
      viewMode: "calendar",
      currentMonth: f
    }) : !n.isRange && c && i({
      selectedDate: c,
      focusedDate: c,
      viewMode: "calendar",
      currentMonth: f
    }), s(), wn.updateMonthYearDisplay(e, n.monthNames, f), this.updateHiddenInput(e, n);
    const h = c ? ve.formatDateForDisplay(c, n.displayFormat) : null;
    o && ve.formatDateForDisplay(o, n.displayFormat), l && ve.formatDateForDisplay(l, n.displayFormat), n.isRange && o && l ? this.dispatchCalendarEvent(e, "rangeSelected", {
      startDate: o,
      endDate: l,
      formattedRange: ve.formatRangeForDisplay(o, l, n.displayFormat),
      source: "quickSelector"
    }) : !n.isRange && c && this.dispatchCalendarEvent(e, "dateSelected", {
      selectedDate: c,
      formattedDate: h,
      source: "quickSelector"
    });
  }
  /**
   * Check if a date is disabled based on calendar constraints
   */
  static isDateDisabled(e, t) {
    const n = ve.parseDate(e);
    if (!n) return !0;
    if (t.minDate) {
      const i = ve.parseDate(t.minDate);
      if (i && n < i)
        return !0;
    }
    if (t.maxDate) {
      const i = ve.parseDate(t.maxDate);
      if (i && n > i)
        return !0;
    }
    return !!(t.disabledDates && t.disabledDates.includes(e));
  }
  /**
   * Handle footer actions (clear, today)
   */
  static handleFooterAction(e, t, n, i, s) {
    switch (t) {
      case "clear":
        Pt.clearSelection(e, n, i), s(), this.updateHiddenInput(e, n), this.dispatchCalendarEvent(e, "cleared", {
          source: "footerAction"
        });
        break;
      case "today":
        const a = this.formatDateString(/* @__PURE__ */ new Date()), o = this.formatYearMonth(/* @__PURE__ */ new Date());
        if (this.isDateDisabled(a, n)) {
          console.warn("Today is disabled and cannot be selected");
          return;
        }
        n.isRange ? i({
          startDate: a,
          endDate: a,
          focusedDate: a,
          rangeSelectionState: "none",
          currentMonth: o
        }) : i({
          selectedDate: a,
          focusedDate: a,
          currentMonth: o
        }), s(), wn.updateMonthYearDisplay(e, n.monthNames, o), this.updateHiddenInput(e, n);
        const l = ve.formatDateForDisplay(a, n.displayFormat);
        this.dispatchCalendarEvent(e, "dateSelected", {
          selectedDate: n.isRange ? null : a,
          startDate: n.isRange ? a : null,
          endDate: n.isRange ? a : null,
          formattedDate: n.isRange ? null : l,
          formattedRange: n.isRange ? `${l} - ${l}` : null,
          source: "footerAction"
        });
        break;
      default:
        console.warn(`Unknown footer action: ${t}`);
    }
  }
  /**
   * Dispatch custom calendar events for framework integration
   */
  static dispatchCalendarEvent(e, t, n = null) {
    const i = new CustomEvent(`calendar:${t}`, {
      bubbles: !0,
      cancelable: !0,
      detail: {
        calendar: e,
        ...n
      }
    });
    e.dispatchEvent(i), document.dispatchEvent(new CustomEvent(`keys:calendar:${t}`, {
      bubbles: !0,
      cancelable: !0,
      detail: {
        calendar: e,
        ...n
      }
    }));
  }
  /**
   * Bind form integration event listeners
   */
  static bindFormEvents(e, t, n, i) {
    e.addEventListener("quickSelector:clicked", (s) => {
      var o;
      const a = (o = s.detail) == null ? void 0 : o.value;
      a && this.handleQuickSelector(e, a, t, n, i);
    }), e.addEventListener("click", (s) => {
      const a = s.target.closest("[data-quick-selector]");
      if (a && !e.closest("[data-keys-date-picker]")) {
        const l = a.dataset.quickSelector;
        l && this.handleQuickSelector(e, l, t, n, i);
      }
    }), e.querySelectorAll("[data-calendar-action]").forEach((s) => {
      s.addEventListener("click", (a) => {
        const o = a.target.dataset.calendarAction;
        o && this.handleFooterAction(e, o, t, n, i);
      });
    });
  }
  /**
   * Get current calendar state for external access
   */
  static getCalendarState(e, t) {
    return {
      currentMonth: t.currentMonth,
      selectedDate: t.selectedDate,
      startDate: t.startDate,
      endDate: t.endDate,
      focusedDate: t.focusedDate,
      isRange: t.isRange,
      isDisabled: t.isDisabled,
      viewMode: t.viewMode,
      rangeSelectionState: t.rangeSelectionState,
      formattedValue: t.isRange ? Pt.formatRangeForDisplay(t.startDate, t.endDate) : t.selectedDate
    };
  }
  /**
   * Set selected date programmatically (external API)
   */
  static setSelectedDate(e, t, n, i, s) {
    if (n.isRange) {
      console.warn("Use setSelectedRange for range calendars");
      return;
    }
    if (i({
      selectedDate: t,
      focusedDate: t
    }), t) {
      const a = this.formatYearMonth(new Date(t));
      a !== n.currentMonth && i({ currentMonth: a });
    }
    s(), this.updateHiddenInput(e, n), this.dispatchCalendarEvent(e, "dateChanged", {
      selectedDate: t,
      source: "programmatic"
    });
  }
  /**
   * Set selected range programmatically (external API)
   */
  static setSelectedRange(e, t, n, i, s, a) {
    if (!i.isRange) {
      console.warn("Use setSelectedDate for single date calendars");
      return;
    }
    if (s({
      startDate: t,
      endDate: n,
      rangeSelectionState: "none",
      focusedDate: n || t
    }), n || t) {
      const o = n || t, l = this.formatYearMonth(new Date(o));
      l !== i.currentMonth && s({ currentMonth: l });
    }
    a(), this.updateHiddenInput(e, i), this.dispatchCalendarEvent(e, "rangeChanged", {
      startDate: t,
      endDate: n,
      source: "programmatic"
    });
  }
  /**
   * Format date as YYYY-MM-DD string
   */
  static formatDateString(e) {
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
  }
  /**
   * Format date as YYYY-MM string
   */
  static formatYearMonth(e) {
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0");
  }
}
class $h extends ee {
  /**
   * Initialize calendar elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("keys-calendar", "true").forEach((e) => {
      this.initializeCalendar(e);
    });
  }
  /**
   * Initialize a single calendar element
   */
  initializeCalendar(e) {
    if (this.hasState(e))
      return;
    const t = e.dataset.keysCalendarConfig, n = e.dataset.disabled === "true";
    let i;
    try {
      i = t ? JSON.parse(t) : {};
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
      viewMode: "calendar",
      format: i.format || "Y-m-d",
      displayFormat: i.displayFormat || i.format || "Y-m-d"
    };
    this.setState(e, s), this.renderCalendar(e), this.bindAllEventListeners(e), tn.updateHiddenInput(e, s), tn.dispatchCalendarEvent(e, "initialized", { state: s });
  }
  /**
   * Bind all event listeners for a calendar
   */
  bindEventListeners() {
  }
  /**
   * Bind all event listeners for a specific calendar
   */
  bindAllEventListeners(e) {
    const t = this.getState(e);
    t && (this.bindDateSelectionEvents(e), this.bindNavigationEvents(e), tn.bindFormEvents(
      e,
      t,
      (n) => this.updateState(e, n),
      () => this.renderCalendar(e)
    ), Po.bindKeyboardEvents(
      e,
      t,
      (n) => this.updateState(e, n),
      (n) => this.selectDate(e, n),
      () => this.renderCalendar(e)
    ));
  }
  /**
   * Bind date selection event listeners
   */
  bindDateSelectionEvents(e) {
    e.addEventListener("click", (t) => {
      const n = t.target;
      if (n.dataset.calendarDayBtn !== void 0) {
        const i = n.dataset.date;
        i && !n.disabled && this.selectDate(e, i);
      }
    });
  }
  /**
   * Bind navigation event listeners
   */
  bindNavigationEvents(e) {
    e.addEventListener("click", (t) => {
      const n = t.target, i = this.getState(e);
      if (!i) return;
      const s = n.closest("[data-calendar-nav]");
      if (s) {
        const d = s.dataset.calendarNav;
        wn.navigateMonth(
          e,
          d,
          i,
          (f) => this.updateState(e, f),
          () => this.renderCalendar(e)
        );
        return;
      }
      if (n.closest("[data-calendar-month-year-btn]")) {
        wn.toggleMonthYearDropdown(
          e,
          i,
          (d) => this.updateState(e, d),
          () => this.renderCalendar(e)
        );
        return;
      }
      const o = n.closest("[data-calendar-month-btn]");
      if (o) {
        const d = parseInt(o.dataset.month || "0");
        wn.selectMonth(
          e,
          d,
          i,
          (f) => this.updateState(e, f),
          () => this.renderCalendar(e)
        );
        return;
      }
      const l = n.closest("[data-calendar-year-option]");
      if (l) {
        const d = parseInt(l.dataset.year || "0");
        wn.selectYear(
          e,
          d,
          i,
          (f) => this.updateState(e, f),
          () => this.renderCalendar(e)
        );
        return;
      }
      const c = n.closest("[data-calendar-year-nav]");
      if (c) {
        const d = c.dataset.calendarYearNav;
        wn.navigateYear(
          e,
          d,
          i,
          (f) => this.updateState(e, f),
          () => this.renderCalendar(e)
        );
        return;
      }
    });
  }
  /**
   * Handle date selection
   */
  selectDate(e, t) {
    const n = this.getState(e);
    if (!n) return;
    Pt.selectDate(
      e,
      t,
      n,
      (s) => this.updateState(e, s)
    ), this.renderCalendar(e), tn.updateHiddenInput(e, this.getState(e));
    const i = this.getState(e);
    if (n.isRange) {
      const s = i.startDate && i.endDate ? ve.formatRangeForDisplay(i.startDate, i.endDate, i.displayFormat) : i.startDate ? ve.formatDateForDisplay(i.startDate, i.displayFormat) : "";
      tn.dispatchCalendarEvent(e, "rangeSelected", {
        startDate: i.startDate,
        endDate: i.endDate,
        formattedRange: s,
        source: "userClick"
      });
    } else {
      const s = ve.formatDateForDisplay(t, i.displayFormat);
      tn.dispatchCalendarEvent(e, "dateSelected", {
        selectedDate: t,
        formattedDate: s,
        source: "userClick"
      });
    }
  }
  /**
   * Render the calendar
   */
  renderCalendar(e) {
    const t = this.getState(e);
    t && (this.toggleQuickSelectors(e, t.viewMode), t.viewMode === "calendar" ? (am.renderCalendarGrid(e, t), Po.initializeFocus(e, t)) : t.viewMode === "month" || t.viewMode === "year" && wn.renderYearGrid(
      e,
      t,
      (n) => this.updateState(e, n),
      () => this.renderCalendar(e)
    ));
  }
  /**
   * Toggle quick selectors visibility based on view mode, isRange, and selector configuration
   */
  toggleQuickSelectors(e, t) {
    const n = this.getState(e), i = e.querySelector('[data-view-mode-show="calendar"]');
    if (i) {
      const a = i.querySelectorAll("[data-quick-selector]").length > 0;
      t === "calendar" && (n != null && n.isRange) && a ? i.style.display = "" : i.style.display = "none";
    }
  }
  /**
   * Update state and trigger re-render
   */
  updateState(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = { ...n, ...t };
    this.setState(e, i);
  }
  /**
   * Setup dynamic observer for dynamically added calendars
   */
  setupDynamicObserver() {
    new MutationObserver((t) => {
      t.forEach((n) => {
        n.addedNodes.forEach((i) => {
          if (i.nodeType === Node.ELEMENT_NODE) {
            const s = i;
            s.dataset.keysCalendar === "true" && this.initializeCalendar(s), s.querySelectorAll('[data-keys-calendar="true"]').forEach((o) => {
              this.initializeCalendar(o);
            });
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  /**
   * Public API: Get calendar state
   */
  getCalendarState(e) {
    const t = this.getState(e);
    return t ? tn.getCalendarState(e, t) : null;
  }
  /**
   * Public API: Set selected date
   */
  setSelectedDate(e, t) {
    const n = this.getState(e);
    n && tn.setSelectedDate(
      e,
      t,
      n,
      (i) => this.updateState(e, i),
      () => this.renderCalendar(e)
    );
  }
  /**
   * Public API: Set selected range
   */
  setSelectedRange(e, t, n) {
    const i = this.getState(e);
    i && tn.setSelectedRange(
      e,
      t,
      n,
      i,
      (s) => this.updateState(e, s),
      () => this.renderCalendar(e)
    );
  }
  /**
   * Cleanup when component is destroyed
   */
  onDestroy() {
    b.findByDataAttribute("keys-calendar", "true").forEach((e) => {
      Po.unbindKeyboardEvents(e);
    });
  }
  /**
   * Get current year-month string
   */
  getCurrentYearMonth() {
    const e = /* @__PURE__ */ new Date();
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0");
  }
  /**
   * Get today's date string
   */
  getTodayDate() {
    const e = /* @__PURE__ */ new Date();
    return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
  }
}
class wc extends ee {
  /**
   * Initialize radio elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("label[for]", (e) => {
      const t = e.getAttribute("for");
      if (!t) return;
      const n = b.getElementById(t);
      !n || n.type !== "radio" || this.focusRadioInput(n);
    }), T.handleDelegatedKeydown('input[type="radio"]', (e, t) => {
      T.createNavigationHandler({
        onArrowDown: () => this.focusNextRadio(e),
        onArrowRight: () => this.focusNextRadio(e),
        onArrowUp: () => this.focusPreviousRadio(e),
        onArrowLeft: () => this.focusPreviousRadio(e),
        preventDefault: ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"]
      })(t);
    });
  }
  /**
   * Focus a radio input with proper timing
   */
  focusRadioInput(e) {
    b.focus(e, 0), this.dispatchFocusEvent(e);
  }
  /**
   * Focus the next radio in the same group
   */
  focusNextRadio(e) {
    const t = this.getRadioGroup(e), i = (t.indexOf(e) + 1) % t.length, s = t[i];
    s && (s.focus(), s.checked = !0, s.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(s));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(e) {
    const t = this.getRadioGroup(e), n = t.indexOf(e), i = n === 0 ? t.length - 1 : n - 1, s = t[i];
    s && (s.focus(), s.checked = !0, s.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(s));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(e) {
    const t = e.name;
    return t ? Array.from(b.querySelectorAll(`input[type="radio"][name="${t}"]`)).filter((i) => !i.disabled) : [e];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(e) {
    T.dispatchCustomEvent(e, "radio-focus", {
      radio: e,
      name: e.name,
      value: e.value,
      checked: e.checked
    });
  }
  /**
   * Add a custom radio focus handler with automatic cleanup
   */
  addFocusHandler(e) {
    return T.addEventListener(document, "radio-focus", (t) => {
      e(t.detail.radio);
    });
  }
  /**
   * Clean up RadioActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
wc.getInstance();
class Br extends ee {
  /**
   * Initialize range elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("range", "true").forEach((e) => {
      this.initializeRange(e);
    });
  }
  /**
   * Initialize a single range component
   */
  initializeRange(e) {
    var a, o, l;
    if (this.hasState(e))
      return;
    const t = b.querySelector(".range-track", e);
    if (!t) return;
    const n = {
      min: parseFloat(t.dataset.min || "0"),
      max: parseFloat(t.dataset.max || "100"),
      step: parseFloat(t.dataset.step || "1"),
      dual: t.dataset.dual === "true",
      ticks: t.dataset.ticks ? JSON.parse(t.dataset.ticks) : [],
      disabled: t.dataset.disabled === "true"
    }, i = this.getElements(e, n);
    if (!i.track) return;
    const s = {
      minValue: n.dual ? parseFloat(((a = i.inputs.min) == null ? void 0 : a.value) || n.min.toString()) : n.min,
      maxValue: n.dual ? parseFloat(((o = i.inputs.max) == null ? void 0 : o.value) || n.max.toString()) : n.max,
      singleValue: n.dual ? n.min : parseFloat(((l = i.inputs.single) == null ? void 0 : l.value) || n.min.toString()),
      isDragging: !1,
      activeHandle: null
    };
    this.setState(e, { config: n, state: s, elements: i }), n.disabled || this.setupHandleInteractions(e, i);
  }
  /**
   * Get all relevant elements for a range component
   */
  getElements(e, t) {
    const n = b.querySelector(".range-track", e), i = b.querySelector(".range-fill", e), s = {}, a = {}, o = {}, l = {};
    return t.dual ? (s.min = b.querySelector('[data-handle="min"]', e), s.max = b.querySelector('[data-handle="max"]', e), a.min = b.querySelector('[data-native-input="min"]', e), a.max = b.querySelector('[data-native-input="max"]', e), o.min = b.querySelector('[data-range-input="min"]', e), o.max = b.querySelector('[data-range-input="max"]', e), l.min = b.querySelector('[data-value-display="min"]', e), l.max = b.querySelector('[data-value-display="max"]', e)) : (s.single = b.querySelector('[data-handle="single"]', e), a.single = b.querySelector('[data-native-input="single"]', e), o.single = b.querySelector('[data-range-input="single"]', e), l.single = b.querySelector('[data-value-display="single"]', e)), {
      container: e,
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
  setupHandleInteractions(e, t) {
    const { handles: n } = t;
    Object.entries(n).forEach(([i, s]) => {
      s && (s.addEventListener("mousedown", (a) => this.handleStart(a, e, i)), s.addEventListener("touchstart", (a) => this.handleStart(a, e, i), { passive: !1 }), s.addEventListener("keydown", (a) => this.handleKeydown(a, e, i)), s.addEventListener("focus", () => this.handleFocus(e, i)), s.addEventListener("blur", () => this.handleBlur(e, i)));
    }), t.track.addEventListener("click", (i) => this.handleTrackClick(i, e));
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.addEventListener(document, "mousemove", (e) => this.handleMove(e)), T.addEventListener(document, "mouseup", (e) => this.handleEnd(e)), T.addEventListener(document, "touchmove", (e) => this.handleMove(e), { passive: !1 }), T.addEventListener(document, "touchend", (e) => this.handleEnd(e)), T.addEventListener(document, "touchcancel", (e) => this.handleEnd(e));
  }
  /**
   * Setup dynamic observer for new ranges - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
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
  handleStart(e, t, n) {
    e.preventDefault();
    const i = this.getState(t);
    if (!i || i.config.disabled) return;
    i.state.isDragging = !0, i.state.activeHandle = n;
    const s = i.elements.handles[n];
    s && (s.classList.add("dragging"), s.focus()), t.classList.add("dragging"), document.body.style.userSelect = "none";
  }
  /**
   * Handle drag move
   */
  handleMove(e) {
    const t = Array.from(this.getAllStates().entries()).find(([h, g]) => g.state.isDragging);
    if (!t) return;
    e.preventDefault();
    const [n, i] = t, { config: s, state: a, elements: o } = i, l = "touches" in e ? e.touches[0].clientX : e.clientX, c = o.track.getBoundingClientRect(), d = Math.max(0, Math.min(1, (l - c.left) / c.width));
    let f = this.percentageToValue(d, s);
    f = this.snapToTickIfNeeded(f, s), this.updateValue(n, a.activeHandle, f);
  }
  /**
   * Handle drag end
   */
  handleEnd(e) {
    const t = Array.from(this.getAllStates().entries()).find(([a, o]) => o.state.isDragging);
    if (!t) return;
    const [n, i] = t;
    i.state.isDragging = !1;
    const s = i.elements.handles[i.state.activeHandle];
    s && s.classList.remove("dragging"), n.classList.remove("dragging"), i.state.activeHandle = null, document.body.style.userSelect = "", this.dispatchChangeEvent(n);
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(e, t, n) {
    const i = this.getState(t);
    if (!i || i.config.disabled) return;
    const { config: s, state: a } = i;
    let o = !1, l;
    const c = n === "min" ? a.minValue : n === "max" ? a.maxValue : a.singleValue;
    switch (e.key) {
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
    o && (e.preventDefault(), l = this.snapToTickIfNeeded(l, s), this.updateValue(t, n, l), this.dispatchChangeEvent(t));
  }
  /**
   * Handle track click to jump to position
   */
  handleTrackClick(e, t) {
    const n = this.getState(t);
    if (!n || n.config.disabled) return;
    const { config: i, state: s } = n, a = n.elements.track.getBoundingClientRect(), o = (e.clientX - a.left) / a.width;
    let l = this.percentageToValue(o, i);
    if (l = this.snapToTickIfNeeded(l, i), i.dual) {
      const c = Math.abs(l - s.minValue), d = Math.abs(l - s.maxValue), f = c <= d ? "min" : "max";
      this.updateValue(t, f, l);
    } else
      this.updateValue(t, "single", l);
    this.dispatchChangeEvent(t);
  }
  /**
   * Update a handle's value and visual position
   */
  updateValue(e, t, n) {
    const i = this.getState(e);
    if (!i) return;
    const { config: s, state: a, elements: o } = i;
    s.dual ? t === "min" ? (n = Math.min(n, a.maxValue), a.minValue = n) : t === "max" && (n = Math.max(n, a.minValue), a.maxValue = n) : a.singleValue = n, this.updateVisualElements(e), this.updateFormInputs(e), this.dispatchInputEvent(e);
  }
  /**
   * Update visual elements (handles, fill, value displays)
   */
  updateVisualElements(e) {
    const t = this.getState(e);
    if (!t) return;
    const { config: n, state: i, elements: s } = t;
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
  updateFormInputs(e) {
    const t = this.getState(e);
    if (!t) return;
    const { config: n, state: i, elements: s } = t;
    n.dual ? (s.inputs.min && (s.inputs.min.value = i.minValue.toString()), s.inputs.max && (s.inputs.max.value = i.maxValue.toString()), s.hiddenInputs.min && (s.hiddenInputs.min.value = i.minValue.toString()), s.hiddenInputs.max && (s.hiddenInputs.max.value = i.maxValue.toString())) : (s.inputs.single && (s.inputs.single.value = i.singleValue.toString()), s.hiddenInputs.single && (s.hiddenInputs.single.value = i.singleValue.toString()));
  }
  /**
   * Convert percentage to value
   */
  percentageToValue(e, t) {
    const n = t.max - t.min;
    let i = t.min + e * n;
    return i = Math.round(i / t.step) * t.step, Math.max(t.min, Math.min(t.max, i));
  }
  /**
   * Convert value to percentage
   */
  valueToPercentage(e, t) {
    return (e - t.min) / (t.max - t.min) * 100;
  }
  /**
   * Snap value to nearest tick if ticks are enabled
   */
  snapToTickIfNeeded(e, t) {
    if (t.ticks.length === 0)
      return e;
    let n = t.ticks[0], i = Math.abs(e - n);
    for (const s of t.ticks) {
      const a = Math.abs(e - s);
      a < i && (n = s, i = a);
    }
    return n;
  }
  /**
   * Handle focus events
   */
  handleFocus(e, t) {
  }
  /**
   * Handle blur events
   */
  handleBlur(e, t) {
  }
  /**
   * Dispatch input event for real-time updates (e.g., Livewire)
   */
  dispatchInputEvent(e) {
    var a, o, l;
    const t = this.getState(e);
    if (!t) return;
    const { config: n, state: i } = t, s = n.dual ? [i.minValue, i.maxValue] : i.singleValue;
    T.dispatchCustomEvent(e, "range-input", {
      value: s,
      dual: n.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), n.dual ? ((a = t.elements.hiddenInputs.min) == null || a.dispatchEvent(new Event("input", { bubbles: !0 })), (o = t.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("input", { bubbles: !0 }))) : (l = t.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  /**
   * Dispatch change event when interaction is complete
   */
  dispatchChangeEvent(e) {
    var a, o, l;
    const t = this.getState(e);
    if (!t) return;
    const { config: n, state: i } = t, s = n.dual ? [i.minValue, i.maxValue] : i.singleValue;
    T.dispatchCustomEvent(e, "range-change", {
      value: s,
      dual: n.dual
    }, {
      bubbles: !0,
      cancelable: !0
    }), n.dual ? ((a = t.elements.hiddenInputs.min) == null || a.dispatchEvent(new Event("change", { bubbles: !0 })), (o = t.elements.hiddenInputs.max) == null || o.dispatchEvent(new Event("change", { bubbles: !0 }))) : (l = t.elements.hiddenInputs.single) == null || l.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  /**
   * Get current value for a range component
   */
  getValue(e) {
    const t = this.getState(e);
    if (!t) return null;
    const { config: n, state: i } = t;
    return n.dual ? [i.minValue, i.maxValue] : i.singleValue;
  }
  /**
   * Set value for a range component
   */
  setValue(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const { config: i } = n;
    i.dual && Array.isArray(t) ? (this.updateValue(e, "min", t[0]), this.updateValue(e, "max", t[1])) : !i.dual && typeof t == "number" && this.updateValue(e, "single", t), this.dispatchChangeEvent(e);
  }
  /**
   * Destroy range component
   */
  destroyRange(e) {
    this.removeState(e);
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
  Br.getInstance().init();
}) : Br.getInstance().init();
window.RangeActions = Br;
Br.getInstance();
class om extends ee {
  constructor(e) {
    super(), this.hoverValue = 0, this.container = e, this.stars = e.querySelectorAll(".rating-star"), this.hiddenInput = e.querySelector('[data-rating-input="true"]') || document.querySelector(`#${e.dataset.ratingId}`), this.currentValue = parseFloat(e.dataset.value || "0"), this.maxValue = parseInt(e.dataset.max || "5"), this.readonly = e.dataset.readonly === "true", this.disabled = e.dataset.disabled === "true", this.allowHalf = e.dataset.allowHalf === "true", !this.readonly && !this.disabled && this.initializeInteractive();
  }
  initializeInteractive() {
    this.stars.forEach((e, t) => {
      e.addEventListener("click", (n) => this.handleClick(n, t + 1)), e.addEventListener("mouseenter", () => this.handleHover(t + 1)), e.addEventListener("mouseleave", () => this.handleHoverEnd());
    }), this.container.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.container.addEventListener("mouseleave", () => this.handleHoverEnd()), console.log(`[Rating] Initialized interactive rating with value: ${this.currentValue}/${this.maxValue}`);
  }
  handleClick(e, t) {
    if (e.preventDefault(), !(this.readonly || this.disabled)) {
      if (this.allowHalf) {
        const i = e.currentTarget.getBoundingClientRect();
        t = e.clientX - i.left < i.width / 2 ? t - 0.5 : t;
      }
      this.setRating(t), console.log(`[Rating] Rating set to: ${t}`), this.container.dispatchEvent(new CustomEvent("rating-change", {
        detail: { value: t },
        bubbles: !0
      }));
    }
  }
  handleHover(e) {
    this.readonly || this.disabled || (this.hoverValue = e, this.updateStars(e));
  }
  handleHoverEnd() {
    this.readonly || this.disabled || (this.hoverValue = 0, this.updateStars(this.currentValue));
  }
  handleKeyDown(e) {
    if (this.readonly || this.disabled)
      return;
    let t = this.currentValue;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault(), t = Math.min(this.maxValue, this.currentValue + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault(), t = Math.max(0, this.currentValue - 1);
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        e.preventDefault();
        const n = parseInt(e.key);
        n <= this.maxValue && (t = n);
        break;
      case "Home":
        e.preventDefault(), t = 1;
        break;
      case "End":
        e.preventDefault(), t = this.maxValue;
        break;
      default:
        return;
    }
    t !== this.currentValue && this.setRating(t);
  }
  setRating(e) {
    this.currentValue = e, this.updateStars(e), this.updateHiddenInput(e), this.updateLivewire(e);
  }
  updateStars(e) {
    const t = this.hoverValue || e;
    this.stars.forEach((n, i) => {
      const s = i + 1, a = n.querySelector("[data-keys-icon]");
      if (!a) return;
      const o = s <= t, c = `text-${this.container.dataset.color || "warning"}`, d = ["opacity-30", "text-neutral-400", "dark:text-neutral-500"], f = ["text-brand", "text-warning", "text-success", "text-danger", "text-neutral-500"];
      a.classList.remove(
        ...d,
        ...f,
        c
      ), o ? a.classList.add(c) : a.classList.add(...d), n.setAttribute("aria-pressed", o ? "true" : "false");
    }), this.container.dataset.value = e.toString();
  }
  updateHiddenInput(e) {
    this.hiddenInput && (this.hiddenInput.value = e.toString(), this.hiddenInput.dispatchEvent(new Event("input", { bubbles: !0 })), this.hiddenInput.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  updateLivewire(e) {
    var n, i, s, a;
    const t = (n = this.hiddenInput) == null ? void 0 : n.__livewire;
    if (t && ((i = this.hiddenInput) != null && i.hasAttribute("wire:model"))) {
      const o = this.hiddenInput.getAttribute("wire:model");
      o && t.set(o, e);
    }
    if (typeof window.Livewire < "u" && ((s = this.hiddenInput) != null && s.name))
      try {
        const o = window.Livewire.find(
          (a = this.container.closest("[wire\\:id]")) == null ? void 0 : a.getAttribute("wire:id")
        );
        o && o.set(this.hiddenInput.name, e);
      } catch {
      }
  }
  getValue() {
    return this.currentValue;
  }
  setValue(e) {
    !this.readonly && !this.disabled && this.setRating(e);
  }
  destroy() {
    console.log("[Rating] Component destroyed");
  }
}
if (typeof window < "u") {
  const r = () => {
    console.log("[Rating] Initializing rating components...");
    const e = document.querySelectorAll('[data-keys-rating="true"]');
    console.log(`[Rating] Found ${e.length} rating component(s)`), e.forEach((t) => {
      t.__ratingActions || (t.__ratingActions = new om(t));
    });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r(), document.addEventListener("livewire:navigated", r);
}
let pn = class {
  static isLivewireAvailable() {
    return typeof window < "u" && "Livewire" in window;
  }
  static isLivewireEnabled(e) {
    return e.dataset.livewireEnabled === "true" || e.dataset.livewireMode === "true" || !!e.dataset.wireModel;
  }
  static getLivewireComponent(e) {
    if (!this.isLivewireAvailable()) return null;
    const t = e.closest("[wire\\:id]");
    return t ? window.Livewire.find(t.getAttribute("wire:id")) : null;
  }
  static getWireModelProperty(e) {
    return e.dataset.wireModel || e.dataset.livewireProperty || null;
  }
  static updateLivewireProperty(e, t) {
    const n = this.getLivewireComponent(e), i = this.getWireModelProperty(e);
    if (!(!n || !i))
      try {
        n.set(i, t);
      } catch (s) {
        console.warn("Failed to update Livewire property:", i, s);
      }
  }
  static formatValueForLivewire(e, t) {
    return t ? Array.isArray(e) ? e : [] : Array.isArray(e) ? e[0] || "" : e || "";
  }
};
class xc extends ee {
  initializeElements() {
    b.findByDataAttribute("select", "true").forEach((t, n) => {
      this.initializeSelect(t);
    });
  }
  initializeSelect(e) {
    const t = e.dataset.multiple === "true", i = {
      selectedValues: this.readInitialValues(e, t),
      searchTerm: "",
      filteredOptions: []
    };
    this.setState(e, i), this.updateOptions(e), this.updateOptionsSelectedState(e), this.updateDisplay(e), this.updateStableInputs(e);
  }
  readInitialValues(e, t) {
    if (pn.isLivewireEnabled(e))
      return [];
    if (t) {
      const n = b.querySelectorAll(".select-pool-input", e), i = [];
      return n.forEach((s) => {
        s.dataset.poolActive === "true" && s.value && i.push(s.value);
      }), i;
    } else {
      const n = b.querySelector(".select-single-input", e);
      return n && n.value ? [n.value] : [];
    }
  }
  bindEventListeners() {
    T.handleDelegatedEvent("click", "[data-chip-remove]", (e, t) => {
      t.preventDefault(), t.stopPropagation();
      const n = e.dataset.chipValue, i = b.findClosest(e, '[data-select="true"]');
      i && n && this.removeChip(i, n);
    }), T.handleDelegatedEvent("click", "[data-select-clear]", (e, t) => {
      t.preventDefault(), t.stopPropagation();
      const n = b.findClosest(e, '[data-select="true"]');
      n && this.clearSelection(n);
    }), T.handleDelegatedEvent("click", "[data-select-option]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, '[data-select="true"]');
      n && this.selectOption(n, e);
    }), T.handleDelegatedEvent("input", "input[data-select-search]", (e, t) => {
      const n = b.findClosest(e, '[data-select="true"]');
      n && n.dataset.searchable === "true" && this.handleSearch(n, e.value);
    }), T.addEventListener(document, "toggle", (e) => {
      var n;
      const t = e.target;
      if (t.dataset.keysPopover === "true" && t.id.startsWith("select-dropdown-")) {
        const i = e, s = t.id.replace("select-dropdown-", ""), a = (n = b.querySelector(`[data-select="true"] button[id="${s}"]`)) == null ? void 0 : n.closest('[data-select="true"]');
        i.newState === "open" ? this.handlePopoverOpened(t, a) : i.newState === "closed" && this.handlePopoverClosed(t, a);
      }
    });
  }
  handlePopoverOpened(e, t) {
    if (t && t.dataset.searchable === "true") {
      const n = b.querySelector("input[data-select-search]", e);
      n && setTimeout(() => {
        n.focus();
      }, 0);
    }
  }
  handlePopoverClosed(e, t) {
    if (t) {
      const n = b.querySelector("input[data-select-search]", e);
      n && (n.value = "", this.handleSearch(t, ""));
    }
  }
  selectOption(e, t) {
    var a;
    const n = this.getState(e), i = t.dataset.value;
    if (!n || !i || t.getAttribute("aria-disabled") === "true")
      return;
    if (e.dataset.multiple === "true") {
      const o = n.selectedValues.indexOf(i);
      o > -1 ? n.selectedValues.splice(o, 1) : n.selectedValues.push(i);
    } else {
      n.selectedValues = [i];
      const o = b.querySelector(`#select-dropdown-${(a = e.querySelector("button")) == null ? void 0 : a.id}`);
      o && o.hidePopover && o.hidePopover();
    }
    this.setState(e, n), this.updateDisplay(e), this.updateStableInputs(e), this.updateOptionsSelectedState(e), pn.isLivewireEnabled(e) && this.syncToLivewire(e);
  }
  removeChip(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = n.selectedValues.indexOf(t);
    i > -1 && (n.selectedValues.splice(i, 1), this.setState(e, n), this.updateDisplay(e), this.updateStableInputs(e), this.updateOptionsSelectedState(e), pn.isLivewireEnabled(e) && this.syncToLivewire(e));
  }
  clearSelection(e) {
    const t = this.getState(e);
    t && (t.selectedValues = [], this.setState(e, t), this.updateDisplay(e), this.updateStableInputs(e), this.updateOptionsSelectedState(e), pn.isLivewireEnabled(e) && this.syncToLivewire(e));
  }
  handleSearch(e, t) {
    const n = this.getState(e);
    n && (n.searchTerm = t.toLowerCase(), this.setState(e, n), this.updateFilteredOptions(e), this.updateOptionsVisibility(e));
  }
  updateFilteredOptions(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = this.getAllOptions(e);
    t.searchTerm ? t.filteredOptions = n.filter(
      (i) => i.searchableText.includes(t.searchTerm)
    ) : t.filteredOptions = n, this.setState(e, t);
  }
  updateOptionsVisibility(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelectorAll("[data-select-option]", e), i = b.querySelector("[data-select-no-results]", e);
    let s = 0;
    n.forEach((a) => {
      const o = a, l = o.dataset.value || "";
      t.filteredOptions.some((d) => d.value === l) ? (o.style.display = "", s++) : o.style.display = "none";
    }), i && (s === 0 && t.searchTerm ? i.classList.remove("hidden") : i.classList.add("hidden"));
  }
  updateDisplay(e) {
    if (!this.getState(e)) return;
    e.dataset.multiple === "true" ? this.updateChipsDisplay(e) : this.updateSingleValueDisplay(e), this.updateClearButtonVisibility(e);
  }
  updateClearButtonVisibility(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelector("[data-select-clear]", e);
    if (!n) return;
    const i = t.selectedValues.length > 0, s = e.dataset.disabled === "true", a = e.dataset.clearable === "true";
    i && !s && a ? (n.classList.remove("opacity-0", "pointer-events-none"), n.classList.add("opacity-100", "pointer-events-auto")) : (n.classList.remove("opacity-100", "pointer-events-auto"), n.classList.add("opacity-0", "pointer-events-none"));
  }
  updateChipsDisplay(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelector("[data-select-chips]", e);
    if (!n) return;
    const i = b.querySelectorAll('[data-select-chip="true"]', n), s = b.querySelector("[data-select-placeholder]", e), a = b.querySelector("[data-select-spacer]", e);
    if (t.selectedValues.length === 0)
      i.forEach((o) => o.remove()), s && (s.style.display = "inline"), a && (a.style.display = "none");
    else {
      s && (s.style.display = "none"), a && (a.style.display = "inline");
      const o = Array.from(i).map(
        (l) => l.dataset.chipValue
      ).filter((l) => l);
      i.forEach((l) => {
        const c = l.dataset.chipValue;
        c && !t.selectedValues.includes(c) && l.remove();
      }), t.selectedValues.forEach((l) => {
        o.includes(l) || this.createChipElement(e, n, l);
      });
    }
  }
  createChipElement(e, t, n) {
    this.createChipElementFallback(e, t, n);
  }
  createChipElementFallback(e, t, n) {
    const i = this.findOptionByValue(e, n), s = i ? i.displayLabel : n, a = i ? i.htmlContent : s, o = document.createElement("span");
    o.className = "inline-flex items-center font-medium px-2 py-0.5 text-xs rounded-md bg-surface text-foreground border border-border gap-1.5", o.setAttribute("data-select-chip", "true"), o.setAttribute("data-chip-value", n), o.innerHTML = `
            <span class="chip-content inline-flex items-center gap-1.5">${a}</span>
            <button type="button" class="w-4 h-4 flex items-center justify-center rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-border" data-chip-remove data-chip-value="${n}">
                <span class="text-xs leading-none" aria-hidden="true">×</span>
                <span class="sr-only">Remove ${s}</span>
            </button>
        `, t.appendChild(o);
  }
  updateSingleValueDisplay(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelector(".select-value", e);
    if (n)
      if (t.selectedValues.length === 0) {
        const i = e.dataset.placeholder || "Select option...";
        n.innerHTML = `<span class="text-muted select-placeholder">${i}</span>`;
      } else {
        const i = t.selectedValues[0], s = this.findOptionByValue(e, i), a = s ? s.htmlContent : i;
        n.innerHTML = a;
      }
  }
  updateStableInputs(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = e.dataset.multiple === "true";
    pn.isLivewireEnabled(e) ? this.syncToLivewire(e) : n ? this.updateMultipleInputPool(e, t.selectedValues) : this.updateSingleInput(e, t.selectedValues[0] || "");
  }
  updateSingleInput(e, t) {
    const n = b.querySelector(".select-single-input", e);
    n && n.value !== t && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  updateMultipleInputPool(e, t) {
    const n = b.querySelectorAll(".select-pool-input", e);
    n.forEach((s, a) => {
      const o = a < t.length, l = o ? t[a] : "";
      s.value !== l && (s.value = l), s.dataset.poolActive = o ? "true" : "false", s.style.display = o ? "" : "none";
    });
    const i = n[0];
    i && i.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  updateOptionsSelectedState(e) {
    const t = this.getState(e);
    if (!t) return;
    b.querySelectorAll("[data-select-option]", e).forEach((i) => {
      const s = i, a = s.dataset.value || "", o = t.selectedValues.includes(a);
      s.setAttribute("aria-selected", o ? "true" : "false");
    });
  }
  updateOptions(e) {
    const t = this.getAllOptions(e), n = this.getState(e);
    n && (n.filteredOptions = t, this.setState(e, n));
  }
  getAllOptions(e) {
    const t = b.querySelectorAll("[data-select-option]", e);
    return Array.from(t).map((n) => {
      var c, d;
      const i = n, s = i.dataset.displayLabel || ((c = i.textContent) == null ? void 0 : c.trim()) || "", a = i.cloneNode(!0), o = a.querySelector(".flex-shrink-0.ml-2");
      o && o.remove();
      const l = a.innerHTML.trim();
      return {
        element: i,
        value: i.dataset.value || "",
        label: ((d = i.textContent) == null ? void 0 : d.trim()) || "",
        displayLabel: s,
        searchableText: i.dataset.searchableText || s.toLowerCase(),
        disabled: i.getAttribute("aria-disabled") === "true",
        htmlContent: l
      };
    });
  }
  findOptionByValue(e, t) {
    return this.getAllOptions(e).find((i) => i.value === t) || null;
  }
  syncToLivewire(e) {
    const t = this.getState(e);
    if (!t || !pn.isLivewireEnabled(e)) return;
    const n = e.dataset.multiple === "true", i = pn.formatValueForLivewire(t.selectedValues, n);
    pn.updateLivewireProperty(e, i);
  }
  setSelectedValues(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = e.dataset.multiple === "true";
    n.selectedValues = i ? t : t.slice(0, 1), this.setState(e, n), this.updateDisplay(e), this.updateStableInputs(e), this.updateOptionsSelectedState(e);
  }
  getSelectValue(e) {
    const t = this.getState(e);
    return t ? e.dataset.multiple === "true" ? t.selectedValues : t.selectedValues[0] || null : null;
  }
}
xc.getInstance();
class kc extends ee {
  constructor() {
    super(...arguments), this.resizeCleanup = null;
  }
  /**
   * Initialize tabs elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("keys-tabs", "true").forEach((e) => {
      this.initializeTabsElement(e);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(e) {
    const t = e.dataset.orientation || "horizontal", n = e.dataset.variant || "default", i = e.dataset.disabled === "true", s = e.dataset.value, a = Array.from(b.querySelectorAll('[data-tabs-trigger="true"]', e)), o = Array.from(b.querySelectorAll('[data-tabs-panel="true"]', e));
    let l = s || null;
    if (!l && a.length > 0) {
      const d = a.find((f) => f.getAttribute("aria-disabled") !== "true");
      l = (d == null ? void 0 : d.dataset.value) || null;
    }
    const c = {
      activeTab: l,
      tabs: a,
      panels: o,
      orientation: t,
      variant: n,
      disabled: i
    };
    this.setState(e, c), this.updateTabsState(e), this.initializeMarker(e), e.classList.add("tabs-initialized");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick('[data-tabs-trigger="true"]', (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, '[data-keys-tabs="true"]');
      n && e.getAttribute("aria-disabled") !== "true" && this.activateTab(n, e.dataset.value || "");
    }), T.handleDelegatedKeydown('[data-tabs-trigger="true"]', (e, t) => {
      const n = b.findClosest(e, '[data-keys-tabs="true"]');
      n && this.handleKeydown(n, t);
    }), this.resizeCleanup = T.handleResize(() => {
      this.handleResize();
    }, 100);
  }
  /**
   * Setup dynamic observer for new tabs - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
          b.hasDataAttribute(n, "keys-tabs", "true") && (this.hasState(n) || this.initializeTabsElement(n)), b.findByDataAttribute("keys-tabs", "true", n).forEach((s) => {
            this.hasState(s) || this.initializeTabsElement(s);
          });
        }
      });
    });
  }
  /**
   * Activate a specific tab
   */
  activateTab(e, t, n = !1) {
    const i = this.getState(e);
    if (!i || i.disabled) return;
    const s = i.tabs.find((o) => o.dataset.value === t);
    if (!s || s.getAttribute("aria-disabled") === "true")
      return;
    const a = i.activeTab;
    i.activeTab = t, this.setState(e, i), this.updateTabsState(e), this.repositionMarker(e, s), n && s.focus(), T.dispatchCustomEvent(e, "tabs:change", {
      tabs: e,
      activeTab: t,
      previousTab: a
    });
  }
  /**
   * Update tabs visual state and panel visibility
   */
  updateTabsState(e) {
    const t = this.getState(e);
    t && (t.tabs.forEach((n) => {
      const i = n.dataset.value === t.activeTab, s = n.getAttribute("aria-disabled") === "true";
      n.setAttribute("aria-selected", i ? "true" : "false"), n.setAttribute("data-state", i ? "active" : "inactive"), s ? n.setAttribute("tabindex", "-1") : i ? n.setAttribute("tabindex", "0") : n.setAttribute("tabindex", "-1"), n.id = `tab-${n.dataset.value}`;
    }), t.panels.forEach((n) => {
      const i = n.dataset.value === t.activeTab;
      n.setAttribute("data-state", i ? "active" : "inactive"), n.style.display = i ? "block" : "none", n.setAttribute("aria-labelledby", `tab-${n.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(e, t) {
    const n = this.getState(e);
    if (!n || n.disabled) return;
    const i = t.target, s = n.tabs.indexOf(i);
    let a = -1;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowUp":
        t.preventDefault(), a = n.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(n, s) : t.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(n, s) : s;
        break;
      case "ArrowRight":
      case "ArrowDown":
        t.preventDefault(), a = n.orientation === "horizontal" ? this.getNextEnabledTabIndex(n, s) : t.key === "ArrowDown" ? this.getNextEnabledTabIndex(n, s) : s;
        break;
      case "Home":
        t.preventDefault(), a = this.getFirstEnabledTabIndex(n);
        break;
      case "End":
        t.preventDefault(), a = this.getLastEnabledTabIndex(n);
        break;
      case "Enter":
      case " ":
        t.preventDefault(), i.dataset.value && this.activateTab(e, i.dataset.value, !0);
        return;
    }
    if (a >= 0 && a < n.tabs.length) {
      const o = n.tabs[a];
      o.dataset.value && this.activateTab(e, o.dataset.value, !0);
    }
  }
  /**
   * Get next enabled tab index
   */
  getNextEnabledTabIndex(e, t) {
    for (let n = 1; n < e.tabs.length; n++) {
      const i = (t + n) % e.tabs.length;
      if (e.tabs[i].getAttribute("aria-disabled") !== "true")
        return i;
    }
    return t;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(e, t) {
    for (let n = 1; n < e.tabs.length; n++) {
      const i = (t - n + e.tabs.length) % e.tabs.length;
      if (e.tabs[i].getAttribute("aria-disabled") !== "true")
        return i;
    }
    return t;
  }
  /**
   * Get first enabled tab index
   */
  getFirstEnabledTabIndex(e) {
    for (let t = 0; t < e.tabs.length; t++)
      if (e.tabs[t].getAttribute("aria-disabled") !== "true")
        return t;
    return 0;
  }
  /**
   * Get last enabled tab index
   */
  getLastEnabledTabIndex(e) {
    for (let t = e.tabs.length - 1; t >= 0; t--)
      if (e.tabs[t].getAttribute("aria-disabled") !== "true")
        return t;
    return e.tabs.length - 1;
  }
  /**
   * Get tabs state (for external access)
   */
  getTabsState(e) {
    return this.getState(e) || null;
  }
  /**
   * Set active tab programmatically
   */
  setActiveTab(e, t, n = !1) {
    this.activateTab(e, t, n);
  }
  /**
   * Initialize marker position for the active tab
   */
  initializeMarker(e) {
    const t = this.getState(e);
    if (!t || !t.activeTab) return;
    const n = t.tabs.find((i) => i.dataset.value === t.activeTab);
    n && setTimeout(() => {
      this.repositionMarker(e, n);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = b.querySelector('[data-tab-marker="true"]', e);
    if (!i) return;
    const { orientation: s, variant: a } = n;
    s === "vertical" ? this.repositionVerticalMarker(i, t, a) : this.repositionHorizontalMarker(i, t, a);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(e, t, n) {
    const i = t.offsetWidth, s = t.offsetLeft;
    if (e.style.width = `${i}px`, n === "pills") {
      const a = t.offsetHeight, o = t.offsetTop;
      e.style.height = `${a}px`, e.style.transform = `translate(${s}px, ${o}px)`;
    } else
      e.style.transform = `translateX(${s}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(e, t, n) {
    const i = t.offsetHeight, s = t.offsetTop;
    if (e.style.height = `${i}px`, n === "pills") {
      const a = t.offsetWidth, o = t.offsetLeft;
      e.style.width = `${a}px`, e.style.transform = `translate(${o}px, ${s}px)`;
    } else
      e.style.transform = `translateY(${s}px)`;
  }
  /**
   * Handle window resize - reposition all markers
   */
  handleResize() {
    this.getAllStates().forEach((e, t) => {
      if (e.activeTab) {
        const n = e.tabs.find((i) => i.dataset.value === e.activeTab);
        n && this.repositionMarker(t, n);
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
kc.getInstance();
class Sc extends ee {
  /**
   * Initialize modal elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll("dialog[data-modal]").forEach((e) => {
      this.initializeModal(e);
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single modal element
   */
  initializeModal(e) {
    if (this.hasState(e))
      return;
    const t = {
      lastFocusedElement: null
    };
    this.setState(e, t), e.addEventListener("close", () => {
      this.handleModalClose(e);
    }), e.addEventListener("cancel", (n) => {
      this.handleModalCancel(e, n);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[commandfor]", (e, t) => {
      const n = e.getAttribute("command"), i = e.getAttribute("commandfor");
      if (n === "show-modal" && i) {
        const s = b.getElementById(i);
        s && s.matches("dialog[data-modal]") && this.handleModalOpen(s, e);
      }
    }), T.handleDelegatedClick("[data-modal-close]", (e, t) => {
      const n = b.findClosest(e, "dialog[data-modal]");
      n && n.close();
    });
  }
  /**
   * Setup dynamic observer for new modals - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
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
  handleModalCancel(e, t) {
    this.dispatchModalEvent(e, "modal:cancel", { originalEvent: t });
  }
  /**
   * Set initial focus when modal opens
   */
  setInitialFocus(e) {
    const t = b.querySelector("[autofocus]", e);
    if (t) {
      t.focus();
      return;
    }
    const n = e.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    n.length > 0 && n[0].focus();
  }
  /**
   * Check if a modal is open
   */
  isModalOpen(e) {
    const t = b.getElementById(e);
    return t ? t.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(e, t, n = {}) {
    T.dispatchCustomEvent(e, t, {
      modal: e,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Get modal state (for external access)
   */
  getModalState(e) {
    const t = b.getElementById(e);
    return t && this.getState(t) || null;
  }
  /**
   * Set up Livewire integration if available
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || (window.Livewire.on("openModal", (e) => {
      const t = e.id || e.modal;
      t && (this.openModal(t), e.wireModel && this.updateWireModel(t, !0));
    }), window.Livewire.on("closeModal", (e) => {
      const t = e.id || e.modal;
      t ? (this.closeModal(t), e.wireModel && this.updateWireModel(t, !1)) : this.closeAllModals();
    }), window.Livewire.on("toggleModal", (e) => {
      const t = e.id || e.modal;
      t && this.toggleModal(t);
    }));
  }
  /**
   * Update Livewire wire:model for modal state
   */
  updateWireModel(e, t) {
    var s;
    const n = b.getElementById(e);
    if (!n) return;
    const i = n.getAttribute("wire:model");
    if (i && typeof window.Livewire < "u" && window.Livewire.find) {
      const a = (s = b.findClosest(n, "[wire\\:id]")) == null ? void 0 : s.getAttribute("wire:id");
      if (a) {
        const o = window.Livewire.find(a);
        o && o.set(i, t);
      }
    }
  }
  /**
   * Toggle a modal's open state
   */
  toggleModal(e) {
    const t = b.getElementById(e);
    return !t || !t.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${e}" not found`), !1) : t.open ? this.closeModal(e) : this.openModal(e);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    b.querySelectorAll("dialog[data-modal][open]").forEach((e) => {
      e.id && this.closeModal(e.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(e, t) {
    const n = b.getElementById(e);
    return !n || !n.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${e}" not found`), !1) : (this.handleModalOpen(n, t), n.showModal(), this.dispatchLivewireEvent("modalOpened", { id: e, modal: e }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(e) {
    const t = b.getElementById(e);
    return !t || !t.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${e}" not found`), !1) : (t.close(), this.dispatchLivewireEvent("modalClosed", { id: e, modal: e }), !0);
  }
  /**
   * Dispatch Livewire events
   */
  dispatchLivewireEvent(e, t) {
    typeof window.Livewire < "u" && window.Livewire.dispatch && window.Livewire.dispatch(e, t);
  }
  /**
   * Handle modal close event with Livewire integration
   */
  handleModalClose(e) {
    const t = this.getState(e);
    if (!t) return;
    e.getAttribute("wire:model") && this.updateWireModel(e.id, !1), t.lastFocusedElement && document.contains(t.lastFocusedElement) && t.lastFocusedElement.focus(), t.lastFocusedElement = null, this.setState(e, t), this.dispatchModalEvent(e, "modal:close"), this.dispatchLivewireEvent("modalClosed", { id: e.id, modal: e.id });
  }
  /**
   * Handle modal opening with Livewire integration
   */
  handleModalOpen(e, t) {
    const n = this.getState(e);
    if (!n) return;
    e.getAttribute("wire:model") && this.updateWireModel(e.id, !0), n.lastFocusedElement = t || document.activeElement, this.setState(e, n), this.dispatchModalEvent(e, "modal:open", { trigger: t }), this.dispatchLivewireEvent("modalOpened", { id: e.id, modal: e.id }), setTimeout(() => {
      this.setInitialFocus(e);
    }, 50);
  }
  /**
   * Clean up ModalActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Sc.getInstance();
const yr = {
  DEFAULT_TIMEOUT: 5e3,
  STACK_OFFSET: 72,
  ANIMATION_DURATION: 300
}, gn = {
  TOAST: '[data-keys-toast="true"]',
  DISMISS_BUTTON: "[data-toast-dismiss]"
};
class Fr extends ee {
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
    const e = document.documentElement;
    if (!this.hasState(e)) {
      const t = {
        toasts: /* @__PURE__ */ new Map(),
        timers: /* @__PURE__ */ new Map(),
        pausedTimers: /* @__PURE__ */ new Map(),
        toastCounter: 0
      };
      this.setState(e, t);
    }
    this.discoverToasts();
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick(`${gn.TOAST}[popover] [data-keys-button]${gn.DISMISS_BUTTON}`, (e, t) => {
      const n = e.getAttribute("data-toast-dismiss");
      n && (t.preventDefault(), t.stopPropagation(), this.dismiss(n));
    }), T.handleDelegatedEvent("toggle", `${gn.TOAST}[popover]`, (e) => {
      const t = e.id;
      if (t) {
        const n = e.matches(":popover-open");
        this.dispatchToastEvent(n ? "toast:show" : "toast:close", t);
      }
    }), T.handleDelegatedClick(`${gn.TOAST}[popover] [data-toast-action]`, (e, t) => {
      const n = e.getAttribute("data-toast-action"), i = b.findClosest(e, `${gn.TOAST}[popover]`);
      n && i && (t.preventDefault(), t.stopPropagation(), this.dispatchToastEvent("toast:action", i.id, { action: n }));
    }), T.handleDelegatedEvent("mouseenter", `${gn.TOAST}[popover]`, (e) => {
      this.pauseTimer(e.id);
    }), T.handleDelegatedEvent("mouseleave", `${gn.TOAST}[popover]`, (e) => {
      this.resumeTimer(e.id);
    }), T.handleDelegatedEvent("keydown", `${gn.TOAST}[popover]`, (e, t) => {
      const n = t;
      n.key === "Escape" && e.hasAttribute("data-dismissible") && (n.preventDefault(), this.dismiss(e.id));
    });
  }
  /**
   * Setup dynamic observer for new toasts - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        t.nodeType === Node.ELEMENT_NODE && t.querySelectorAll("[data-keys-toast][popover]").length > 0 && this.discoverToasts();
      });
    });
  }
  /**
   * Discover and register existing toasts (no containers needed)
   */
  discoverToasts() {
    const e = this.getGlobalState();
    e && document.querySelectorAll("[data-keys-toast][popover]").forEach((t) => {
      const n = t.id;
      n && e.toasts.set(n, t);
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
  registerToast(e, t) {
    const n = this.getGlobalState();
    n && n.toasts.set(e, t);
  }
  /**
   * Setup Livewire integration
   */
  setupLivewireIntegration() {
    typeof window.Livewire > "u" || (window.Livewire.on("showToast", (e) => {
      const t = e.variant || "info";
      this.show(t, e);
    }), window.Livewire.on("hideToast", (e) => {
      e.id ? this.dismiss(e.id) : this.dismissAll();
    }));
  }
  /**
   * Show a toast programmatically
   * @param variant Toast type (info, success, warning, danger, neutral)
   * @param data Toast configuration object
   * @returns Whether the toast was successfully created and shown
   */
  show(e, t = { message: "" }) {
    const n = this.getGlobalState();
    if (!n) return !1;
    const i = t.position || "top-right", s = `toast-${e}-${i}-${++n.toastCounter}`, a = this.createToastElement(s, e, i, t), l = this.calculateStackPosition(i) * yr.STACK_OFFSET;
    a.style.setProperty("--stack-offset", `${l}px`), document.body.appendChild(a), this.showToastElement(a), a.setAttribute("data-toast-visible", "true");
    const c = t.duration || yr.DEFAULT_TIMEOUT;
    return !(t.persistent === !0) && c > 0 && this.setTimer(s, c), n.toasts.set(s, a), this.dispatchToastEvent("toast:show", s, t), !0;
  }
  /**
   * Calculate stack position for toasts at a specific position
   */
  calculateStackPosition(e) {
    const t = this.getGlobalState();
    if (!t) return 0;
    let n = 0;
    return t.toasts.forEach((i) => {
      i.getAttribute("data-position") === e && i.getAttribute("data-toast-visible") === "true" && n++;
    }), n;
  }
  /**
   * Show toast element using Popover API with fallback
   */
  showToastElement(e) {
    try {
      e.showPopover();
    } catch {
      console.warn("Popover API not supported, using fallback display"), e.style.display = "block";
    }
  }
  /**
   * Hide toast element using Popover API with fallback
   */
  hideToastElement(e) {
    try {
      e.hidePopover();
    } catch {
      console.warn("Popover API hide failed, using manual hide"), e.style.display = "none";
    }
  }
  /**
   * Create a toast popover element dynamically to match Blade template
   */
  createToastElement(e, t, n, i) {
    const s = t === "error" ? "danger" : t, a = document.createElement("div");
    a.className = this.getPopoverClasses(n, s), a.setAttribute("data-keys-toast", "true"), a.setAttribute("data-variant", t), a.setAttribute("data-position", n), a.setAttribute("data-element-type", "popover"), a.setAttribute("data-dismissible", "true"), a.setAttribute("data-has-icon", "true"), a.setAttribute("popover", "manual"), a.setAttribute("role", "status");
    const o = s === "danger" || s === "warning" ? "assertive" : "polite";
    return a.setAttribute("aria-live", o), a.setAttribute("aria-atomic", "true"), a.id = e, i.title && (a.setAttribute("aria-labelledby", `${e}-title`), a.setAttribute("data-has-title", "true")), a.setAttribute("aria-describedby", `${e}-message`), a.innerHTML = `
            <div class="px-4 pt-4 pb-3">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${this.getIconWrapperClasses(s)}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-icon="true">
                            ${this.getIconPath(s)}
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 id="${e}-title" class="hidden font-semibold text-sm leading-5 mb-1"></h3>
                        <div id="${e}-message" class="text-sm opacity-90 leading-5"></div>
                    </div>
                    <div class="flex-shrink-0">
                        <button type="button"
                                class="inline-flex items-center justify-center rounded-md bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6 text-xs hover:bg-surface active:bg-muted focus:ring-brand text-current opacity-60 hover:opacity-100 -m-1"
                                data-keys-button="true"
                                data-variant="ghost"
                                data-size="xs"
                                data-element-type="button"
                                data-icon-only="true"
                                data-has-icon="true"
                                data-toast-dismiss="${e}"
                                aria-label="Dismiss notification">
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
   * Get popover classes for toast styling - matches Blade template exactly
   */
  getPopoverClasses(e, t) {
    let n = "max-w-sm w-fit h-fit rounded-lg shadow-lg text-foreground z-[9999] p-0 overflow-visible opacity-100";
    return n += " " + this.getVariantClasses(t), n;
  }
  /**
   * Get variant classes - adaptive backgrounds that switch between light and dark mode
   */
  getVariantClasses(e) {
    const t = {
      info: "border border-info bg-info-subtle",
      success: "border border-success bg-success-subtle",
      warning: "border border-warning bg-warning-subtle",
      danger: "border border-danger bg-danger-subtle",
      neutral: "border border-neutral bg-neutral-subtle"
    };
    return t[e] || t.info;
  }
  /**
   * Get icon wrapper classes for variant - optimized for text contrast
   */
  getIconWrapperClasses(e) {
    const t = {
      info: "bg-info text-white",
      success: "bg-success text-white",
      warning: "bg-warning text-black",
      danger: "bg-danger text-white",
      neutral: "bg-neutral text-white"
    };
    return t[e] || t.info;
  }
  /**
   * Get icon SVG path for variant
   */
  getIconPath(e) {
    const t = {
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
      danger: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      neutral: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
    };
    return t[e] || t.info;
  }
  /**
   * Dismiss a toast
   */
  dismiss(e) {
    const t = this.getGlobalState();
    if (!t) return !1;
    const n = t.toasts.get(e);
    if (!n)
      return !1;
    const i = n.getAttribute("data-position");
    return this.clearTimer(e), t.pausedTimers.delete(e), n.setAttribute("data-toast-visible", "false"), this.hideToastElement(n), t.toasts.delete(e), i && this.recalculateStackPositions(i), window.setTimeout(() => {
      n.parentNode && n.parentNode.removeChild(n);
    }, yr.ANIMATION_DURATION), this.dispatchToastEvent("toast:dismiss", e), !0;
  }
  /**
   * Recalculate stack positions for all toasts at a specific position
   */
  recalculateStackPositions(e) {
    const t = this.getGlobalState();
    if (!t) return;
    const n = [];
    t.toasts.forEach((i) => {
      i.getAttribute("data-position") === e && i.getAttribute("data-toast-visible") === "true" && n.push(i);
    }), n.forEach((i, s) => {
      const a = s * yr.STACK_OFFSET;
      i.style.setProperty("--stack-offset", `${a}px`);
    });
  }
  /**
   * Dismiss all visible toasts
   */
  dismissAll() {
    const e = this.getGlobalState();
    e && e.toasts.forEach((t, n) => {
      t.getAttribute("data-toast-visible") === "true" && this.dismiss(n);
    });
  }
  /**
   * Convenience methods for common toast types
   */
  /**
   * Show a success toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  success(e, t = {}) {
    return this.show("success", { message: e, ...t });
  }
  /**
   * Show an error toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  error(e, t = {}) {
    return this.show("danger", { message: e, ...t });
  }
  /**
   * Show a warning toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  warning(e, t = {}) {
    return this.show("warning", { message: e, ...t });
  }
  /**
   * Show an info toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  info(e, t = {}) {
    return this.show("info", { message: e, ...t });
  }
  /**
   * Update toast content with provided data
   */
  updateToastContent(e, t) {
    const n = e.querySelector(`#${e.id}-title`), i = e.querySelector(`#${e.id}-message`), s = e.querySelector("[data-toast-actions]");
    n && (t.title ? (n.textContent = t.title, n.classList.remove("hidden"), e.setAttribute("data-has-title", "true")) : (n.classList.add("hidden"), e.removeAttribute("data-has-title"))), i && t.message && (i.textContent = t.message), s && (t.actions ? (s.innerHTML = t.actions, s.classList.remove("hidden")) : s.classList.add("hidden"));
    const a = t.duration || yr.DEFAULT_TIMEOUT;
    e.setAttribute("data-timeout", String(a)), t.persistent === !0 && e.setAttribute("data-persistent", "true"), a > 0 && !t.persistent && e.setAttribute("data-auto-hide", "true");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(e, t) {
    const n = this.getGlobalState();
    if (!n) return;
    this.clearTimer(e);
    const i = n.toasts.get(e);
    i && i.setAttribute("data-toast-start-time", String(Date.now()));
    const s = window.setTimeout(() => {
      this.dismiss(e);
    }, t);
    n.timers.set(e, s);
  }
  /**
   * Clear timer
   */
  clearTimer(e) {
    const t = this.getGlobalState();
    if (!t) return;
    const n = t.timers.get(e);
    n && (window.clearTimeout(n), t.timers.delete(e));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(e) {
    const t = this.getGlobalState();
    if (!t) return;
    const n = t.timers.get(e), i = t.toasts.get(e);
    if (n && i) {
      const s = parseInt(i.getAttribute("data-timeout") || String(yr.DEFAULT_TIMEOUT)), a = parseInt(i.getAttribute("data-toast-start-time") || "0"), o = Date.now() - a, l = Math.max(0, s - o);
      this.clearTimer(e), t.pausedTimers.set(e, {
        remaining: l,
        startTime: Date.now()
      });
    }
  }
  /**
   * Resume timer (on mouse leave)
   */
  resumeTimer(e) {
    const t = this.getGlobalState();
    if (!t) return;
    const n = t.toasts.get(e), i = t.timers.get(e), s = t.pausedTimers.get(e);
    if (n && i)
      n.getAttribute("data-persistent") === "true" || t.pausedTimers.delete(e);
    else if (n && s) {
      const a = n.getAttribute("data-persistent") === "true", o = n.getAttribute("data-auto-hide") === "true";
      !a && o && s.remaining > 0 && (this.setTimer(e, s.remaining), t.pausedTimers.delete(e));
    }
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(e, t, n = {}) {
    const i = this.getGlobalState();
    if (!i) return;
    const s = { id: t, toast: t, ...n };
    T.dispatchCustomEvent(document.documentElement, e, s, {
      bubbles: !0,
      cancelable: !0
    });
    const a = i.toasts.get(t);
    if (a && T.dispatchCustomEvent(a, e, s, {
      bubbles: !0,
      cancelable: !0
    }), typeof window.Livewire < "u") {
      const o = e.replace("toast:", "toast");
      window.Livewire.dispatch(o, s);
    }
  }
  /**
   * Get toast state (for external access)
   */
  getToastState(e) {
    const t = this.getGlobalState();
    if (!t) return null;
    const n = t.toasts.get(e);
    return n ? {
      id: e,
      visible: n.getAttribute("data-toast-visible") === "true",
      open: n.matches(":popover-open") || !1,
      variant: n.getAttribute("data-variant"),
      position: n.getAttribute("data-position"),
      duration: parseInt(n.getAttribute("data-timeout") || "0"),
      persistent: n.getAttribute("data-persistent") === "true",
      autoHide: n.getAttribute("data-auto-hide") === "true",
      hasTitle: n.getAttribute("data-has-title") === "true",
      hasContent: n.getAttribute("data-has-content") === "true"
    } : null;
  }
  /**
   * Clean up ToastActions - extends BaseActionClass destroy
   */
  onDestroy() {
    const e = this.getGlobalState();
    e && (e.timers.forEach((t) => window.clearTimeout(t)), e.timers.clear(), e.pausedTimers.clear(), e.toasts.forEach((t) => {
      this.hideToastElement(t), t.setAttribute("data-toast-visible", "false");
    }), e.toasts.clear());
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Fr.getInstance().init();
}) : Fr.getInstance().init();
const lm = Fr.getInstance();
window.ToastActions = lm;
Fr.getInstance();
class Ac extends ee {
  /**
   * Initialize dropdown elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("dropdown", "true").forEach((e) => {
      this.initializeDropdown(e);
    }), b.findByDataAttribute("submenu", "true").forEach((e) => {
      this.initializeDropdown(e);
    });
  }
  /**
   * Initialize a single dropdown element
   */
  initializeDropdown(e) {
    const t = {
      isOpen: !1,
      focusedIndex: -1,
      menuItems: [],
      children: []
    }, n = b.findClosest(e, '[data-submenu="true"]');
    n && n !== e && (t.parent = n), this.setState(e, t), this.updateMenuItems(e), this.initializeSubmenus(e);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(e) {
    const t = b.querySelectorAll('[data-submenu="true"]', e), n = this.getState(e);
    n && (n.children = Array.from(t), this.setState(e, n)), t.forEach((i) => {
      this.hasState(i) || this.initializeDropdown(i);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (t, n) => {
      if (t.matches("[data-submenu-trigger]")) {
        n.preventDefault(), n.stopPropagation();
        const i = b.findClosest(t, '[data-submenu="true"]');
        i && !this.isDisabled(i) && this.toggleSubmenu(i);
        return;
      }
      if (t.matches("[data-dropdown-trigger]")) {
        n.preventDefault(), n.stopPropagation();
        const i = b.findClosest(t, '[data-dropdown="true"]');
        i && !this.isDisabled(i) && this.toggleDropdown(i);
        return;
      }
      if (t.matches("[data-menu-item]")) {
        const i = b.findClosest(t, '[data-dropdown="true"]');
        i && (t.dataset.keepOpen === "true" || this.closeDropdown(i));
        return;
      }
      if (t.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (n.stopPropagation(), !(t.dataset.keepOpen !== "false")) {
          const s = b.findClosest(t, '[data-dropdown="true"]');
          s && this.closeDropdown(s);
        }
        return;
      }
      if (t.matches("[data-dropdown-panel], [data-submenu-panel]")) {
        n.stopPropagation();
        return;
      }
    }), T.addEventListener(document, "click", (t) => {
      const n = t.target;
      n && n instanceof Element && (n.closest("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]") || this.closeAllDropdowns());
    });
    let e = null;
    T.addEventListener(document, "mouseenter", (t) => {
      const n = b.findClosest(t.target, "[data-submenu-trigger]");
      if (n && !this.isMobile()) {
        e && (clearTimeout(e), e = null);
        const i = b.findClosest(n, "[data-popover-trigger]");
        if (i) {
          const s = i.getAttribute("data-popover-trigger"), a = s ? document.getElementById(s) : null;
          if (a && !a.matches(":popover-open")) {
            const o = b.findClosest(n, '[role="menu"]');
            o && b.querySelectorAll("[data-submenu-trigger]", o).forEach((c) => {
              var d;
              if (c !== n) {
                const f = c.getAttribute("data-popover-trigger");
                if (f) {
                  const h = document.getElementById(f);
                  if (h && h.matches(":popover-open")) {
                    const g = h.style.transition;
                    h.style.transition = "none", (d = h.hidePopover) == null || d.call(h), requestAnimationFrame(() => {
                      h.style.transition = g;
                    });
                  }
                }
              }
            }), n.click();
          }
        }
      }
    }, { capture: !0 }), T.addEventListener(document, "mouseleave", (t) => {
      const n = b.findClosest(t.target, "[data-submenu-trigger]");
      if (n && !this.isMobile()) {
        const i = b.findClosest(n, "[data-popover-trigger]");
        if (i) {
          const s = i.getAttribute("data-popover-trigger"), a = s ? document.getElementById(s) : null;
          if (a && a.matches(":popover-open")) {
            const o = t.relatedTarget;
            if (o && (b.findClosest(o, `#${s}`) || o.id === s))
              return;
            e = window.setTimeout(() => {
              var d;
              if (a.matches(":hover"))
                return;
              const l = document.querySelector(":hover"), c = l ? b.findClosest(l, "[data-submenu-trigger]") : null;
              (!c || c === n) && ((d = a.hidePopover) == null || d.call(a));
            }, 200);
          }
        }
      }
    }, { capture: !0 }), T.handleDelegatedKeydown('[data-dropdown="true"]', (t, n) => {
      this.handleKeydown(t, n);
    });
  }
  /**
   * Setup dynamic observer for new dropdowns - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
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
  toggleDropdown(e) {
    const t = this.getState(e);
    t && (t.isOpen ? this.closeDropdown(e) : this.openDropdown(e));
  }
  /**
   * Open dropdown
   */
  openDropdown(e) {
    var s;
    const t = this.getState(e);
    if (!t || this.isDisabled(e)) return;
    this.closeSiblingDropdowns(e), t.isOpen = !0, t.focusedIndex = -1, this.setState(e, t);
    const n = b.querySelector("[data-keys-popover]", e), i = b.querySelector("[data-dropdown-trigger]", e);
    n && ((s = n.showPopover) == null || s.call(n)), i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(e), this.dispatchDropdownEvent(e, "dropdown:open");
  }
  /**
   * Open submenu using HTML Popover API
   */
  openSubmenu(e) {
    var s;
    const t = this.getState(e);
    if (!t || this.isDisabled(e))
      return;
    t.isOpen = !0, t.focusedIndex = -1, this.closeSiblingSubmenus(e), this.setState(e, t);
    const n = b.querySelector("[data-keys-popover]", e), i = b.querySelector("[data-submenu-trigger]", e);
    if (n)
      try {
        (s = n.showPopover) == null || s.call(n);
      } catch {
      }
    i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(e), this.dispatchDropdownEvent(e, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(e) {
    var s;
    const t = this.getState(e);
    if (!t || !t.isOpen) return;
    this.closeChildSubmenus(e), t.isOpen = !1, t.focusedIndex = -1, this.setState(e, t);
    const n = b.querySelector("[data-keys-popover]", e), i = b.querySelector("[data-dropdown-trigger]", e);
    n && ((s = n.hidePopover) == null || s.call(n)), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(e, "dropdown:close");
  }
  /**
   * Close submenu using HTML Popover API
   */
  closeSubmenu(e) {
    var s;
    const t = this.getState(e);
    if (!t || !t.isOpen) return;
    this.closeChildSubmenus(e), t.isOpen = !1, t.focusedIndex = -1, this.setState(e, t);
    const n = b.querySelector("[data-keys-popover]", e), i = b.querySelector("[data-submenu-trigger]", e);
    n && ((s = n.hidePopover) == null || s.call(n)), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(e, "submenu:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.getAllStates().forEach((e, t) => {
      e.isOpen && (e.parent || this.closeDropdown(t));
    });
  }
  /**
   * Close sibling dropdowns but preserve parent-child relationships
   */
  closeSiblingDropdowns(e) {
    const t = this.getState(e);
    this.getAllStates().forEach((n, i) => {
      if (i !== e && n.isOpen) {
        const s = (t == null ? void 0 : t.parent) === i, a = n.parent === e;
        !s && !a && this.closeDropdown(i);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(e) {
    const t = this.getState(e), n = t == null ? void 0 : t.parent;
    if (n) {
      const i = this.getState(n);
      i == null || i.children.forEach((s) => {
        s !== e && this.closeSubmenu(s);
      });
    }
  }
  /**
   * Close all child submenus
   */
  closeChildSubmenus(e) {
    const t = this.getState(e);
    t == null || t.children.forEach((n) => {
      this.closeSubmenu(n);
    });
  }
  /**
   * Toggle submenu open/closed state
   */
  toggleSubmenu(e) {
    const t = this.getState(e);
    t && (t.isOpen ? this.closeSubmenu(e) : this.openSubmenu(e));
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
  handleKeydown(e, t) {
    const n = this.getState(e);
    if (n)
      switch (t.key) {
        case "Enter":
        case " ":
          if (!n.isOpen)
            t.preventDefault(), this.openDropdown(e);
          else if (n.focusedIndex >= 0) {
            t.preventDefault();
            const i = n.menuItems[n.focusedIndex];
            i && i.click();
          }
          break;
        case "Escape":
          if (n.isOpen) {
            t.preventDefault(), this.closeDropdown(e);
            const i = b.querySelector("[data-dropdown-trigger]", e);
            i && i.focus();
          }
          break;
        case "ArrowDown":
          n.isOpen ? (t.preventDefault(), this.navigateItems(e, 1)) : (t.preventDefault(), this.openDropdown(e));
          break;
        case "ArrowUp":
          n.isOpen && (t.preventDefault(), this.navigateItems(e, -1));
          break;
        case "Tab":
          n.isOpen && this.closeDropdown(e);
          break;
      }
  }
  /**
   * Navigate through menu items with arrow keys
   */
  navigateItems(e, t) {
    const n = this.getState(e);
    if (!n || !n.isOpen) return;
    const i = n.menuItems.length;
    i !== 0 && (n.focusedIndex === -1 ? n.focusedIndex = t > 0 ? 0 : i - 1 : (n.focusedIndex += t, n.focusedIndex >= i ? n.focusedIndex = 0 : n.focusedIndex < 0 && (n.focusedIndex = i - 1)), this.setState(e, n), this.updateItemFocus(e));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(e) {
    const t = this.getState(e);
    t && t.menuItems.forEach((n, i) => {
      i === t.focusedIndex ? (n.classList.add("bg-neutral-100", "dark:bg-neutral-800"), n.scrollIntoView({ block: "nearest" })) : n.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", e);
    t.menuItems = Array.from(n).filter((i) => {
      const s = i;
      return !s.hasAttribute("disabled") && s.offsetParent !== null;
    }), this.setState(e, t);
  }
  /**
   * Check if dropdown is disabled
   */
  isDisabled(e) {
    return e.dataset.disabled === "true";
  }
  /**
   * Dispatch custom dropdown event
   */
  dispatchDropdownEvent(e, t, n = null) {
    T.dispatchCustomEvent(e, t, {
      dropdown: e,
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
Ac.getInstance();
class $r extends ee {
  /**
   * Initialize table elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("table", "true").forEach((e) => {
      this.initializeTable(e);
    }), this.setupLivewireIntegration();
  }
  /**
   * Initialize a single table
   */
  initializeTable(e) {
    var i;
    if (this.hasState(e))
      return;
    const t = {
      selectedRows: /* @__PURE__ */ new Set(),
      sortColumn: null,
      sortDirection: null,
      selectAllState: "none"
    };
    this.setState(e, t);
    const n = b.querySelector('[data-sorted="true"]', e);
    if (n) {
      const s = n.getAttribute("data-sort-key") || ((i = n.textContent) == null ? void 0 : i.trim()) || "", a = n.getAttribute("data-direction");
      t.sortColumn = s, t.sortDirection = a;
    }
    this.updateSelectionState(e);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick('[data-sortable="true"]', (e, t) => {
      t.preventDefault(), this.handleSort(e);
    }), T.handleDelegatedChange("[data-table-row-select]", (e) => {
      this.handleRowSelection(e);
    }), T.handleDelegatedChange("[data-table-select-all]", (e) => {
      this.handleSelectAll(e);
    }), T.handleDelegatedKeydown('[data-table="true"]', (e, t) => {
      this.handleKeyboard(t);
    });
  }
  /**
   * Setup dynamic observer for new tables - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
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
    typeof window.Livewire > "u" || T.addEventListener(document, "livewire:navigated", () => {
      this.reinitialize();
    });
  }
  /**
   * Handle sortable header clicks
   */
  handleSort(e) {
    var a;
    const t = b.findClosest(e, '[data-table="true"]');
    if (!t) return;
    const n = this.getState(t);
    if (!n) return;
    const i = e.getAttribute("data-sort-key") || ((a = e.textContent) == null ? void 0 : a.trim()) || "";
    let s = "asc";
    n.sortColumn === i && (n.sortDirection === "asc" ? s = "desc" : n.sortDirection === "desc" && (s = null)), n.sortColumn = s ? i : null, n.sortDirection = s, this.updateSortUI(t, i, s), this.dispatchSortEvent(t, {
      column: i,
      direction: s || "asc",
      url: e.getAttribute("data-sort-url") || void 0,
      livewireMethod: e.getAttribute("data-sort-method") || void 0
    });
  }
  /**
   * Update sort UI indicators
   */
  updateSortUI(e, t, n) {
    if (b.querySelectorAll('[data-sortable="true"]', e).forEach((s) => {
      s.setAttribute("data-sorted", "false"), s.removeAttribute("data-direction"), b.querySelectorAll(".table-sort-icon", s).forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), n) {
      const s = e.querySelector(`[data-sort-key="${t}"]`);
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
  handleRowSelection(e) {
    const t = b.findClosest(e, '[data-table="true"]');
    if (!t) return;
    const n = this.getState(t);
    if (!n) return;
    const i = e.getAttribute("data-row-id");
    i && (e.checked ? n.selectedRows.add(i) : n.selectedRows.delete(i), this.updateSelectionState(t), this.dispatchSelectionEvent(t, Array.from(n.selectedRows)));
  }
  /**
   * Handle select all checkbox
   */
  handleSelectAll(e) {
    const t = b.findClosest(e, '[data-table="true"]');
    if (!t) return;
    const n = this.getState(t);
    if (!n) return;
    const i = b.querySelectorAll("[data-table-row-select]", t);
    e.checked ? i.forEach((s) => {
      s.checked = !0;
      const a = s.getAttribute("data-row-id");
      a && n.selectedRows.add(a);
    }) : i.forEach((s) => {
      s.checked = !1;
      const a = s.getAttribute("data-row-id");
      a && n.selectedRows.delete(a);
    }), this.updateSelectionState(t), this.dispatchSelectionEvent(t, Array.from(n.selectedRows));
  }
  /**
   * Update selection state and UI
   */
  updateSelectionState(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelectorAll("[data-table-row-select]", e), i = b.querySelector("[data-table-select-all]", e), s = n.length, a = t.selectedRows.size;
    a === 0 ? (t.selectAllState = "none", i && (i.checked = !1, i.indeterminate = !1)) : a === s ? (t.selectAllState = "all", i && (i.checked = !0, i.indeterminate = !1)) : (t.selectAllState = "some", i && (i.checked = !1, i.indeterminate = !0)), b.querySelectorAll("[data-table-row]", e).forEach((l) => {
      const c = l.getAttribute("data-row-id");
      c && t.selectedRows.has(c) ? (l.setAttribute("data-selected", "true"), l.classList.add("table-row-selected")) : (l.setAttribute("data-selected", "false"), l.classList.remove("table-row-selected"));
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeyboard(e) {
    const t = e.target;
    e.key === " " && t.matches('[data-sortable="true"]') && (e.preventDefault(), this.handleSort(t)), e.key === "Enter" && t.matches('[data-sortable="true"]') && (e.preventDefault(), this.handleSort(t));
  }
  /**
   * Dispatch sort event
   */
  dispatchSortEvent(e, t) {
    if (T.dispatchCustomEvent(e, "table:sort", t, {
      bubbles: !0,
      cancelable: !0
    }), t.livewireMethod && window.Livewire) {
      const n = e.getAttribute("wire:id");
      if (n) {
        const i = window.Livewire.find(n);
        i && i.call(t.livewireMethod, t.column, t.direction);
      }
    }
  }
  /**
   * Dispatch selection event
   */
  dispatchSelectionEvent(e, t) {
    T.dispatchCustomEvent(e, "table:selection", { selectedIds: t }, {
      bubbles: !0,
      cancelable: !0
    });
    const n = e.getAttribute("data-selection-method");
    if (n && window.Livewire) {
      const i = e.getAttribute("wire:id");
      if (i) {
        const s = window.Livewire.find(i);
        s && s.call(n, t);
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
  getSelectedRows(e) {
    const t = this.getState(e);
    return t ? Array.from(t.selectedRows) : [];
  }
  /**
   * Clear selection for a table
   */
  clearSelection(e) {
    const t = this.getState(e);
    t && (t.selectedRows.clear(), this.updateSelectionState(e), this.dispatchSelectionEvent(e, []));
  }
  /**
   * Clean up TableActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  $r.getInstance().init();
}) : $r.getInstance().init();
window.TableActions = $r;
$r.getInstance();
class jr extends ee {
  /**
   * Initialize timepicker elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll("[data-keys-timepicker]").forEach((e) => {
      this.initializeTimePicker(e);
    });
  }
  /**
   * Initialize a single timepicker element
   */
  initializeTimePicker(e) {
    if (console.log("🕒 Initializing TimePicker:", e), this.hasState(e)) {
      console.log("🕒 TimePicker already initialized, skipping");
      return;
    }
    const t = e.dataset.format || "24", n = e.dataset.showSeconds === "true", i = parseInt(e.dataset.step || "1"), s = e.dataset.minTime || null, a = e.dataset.maxTime || null, o = e.dataset.value || null;
    console.log("🕒 TimePicker config:", { format: t, showSeconds: n, step: i, minTime: s, maxTime: a, initialValue: o });
    const l = this.parseTime(o) || this.getCurrentTime(), c = {
      isOpen: !1,
      format: t,
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
    this.setState(e, c), this.updateDisplay(e), this.updateSelectedStates(e), this.updateClearButtonVisibility(e, o || ""), console.log("🕒 TimePicker initialized successfully with state:", c);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-timepicker-trigger]", (e, t) => {
      console.log("🕒 TimePicker trigger clicked:", e);
      const n = b.findClosest(e, "[data-keys-timepicker]");
      if (n && !this.isDisabled(n)) {
        console.log("🕒 Native popover will handle toggle for:", n);
        const i = this.getState(n);
        i && console.log("🕒 Current TimePicker state:", i);
      } else
        console.log("🕒 TimePicker trigger ignored - disabled or not found"), t.preventDefault();
    }), T.handleDelegatedClick("[data-timepicker-clear]", (e, t) => {
      console.log("🕒 TimePicker clear button clicked:", e), t.preventDefault(), t.stopPropagation();
      const n = b.findClosest(e, "[data-keys-timepicker]");
      n && (console.log("🕒 Clearing TimePicker value for:", n), this.clearTime(n));
    }), T.handleDelegatedClick("[data-timepicker-hour]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]"), i = parseInt(e.dataset.timepickerHour || "0");
      n && this.setHour(n, i);
    }), T.handleDelegatedClick("[data-timepicker-minute]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]"), i = parseInt(e.dataset.timepickerMinute || "0");
      n && this.setMinute(n, i);
    }), T.handleDelegatedClick("[data-timepicker-second]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]"), i = parseInt(e.dataset.timepickerSecond || "0");
      n && this.setSecond(n, i);
    }), T.handleDelegatedClick("[data-timepicker-period]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]"), i = e.dataset.timepickerPeriod;
      n && this.setPeriod(n, i);
    }), T.handleDelegatedClick("[data-timepicker-format]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]"), i = e.dataset.timepickerFormat;
      n && this.setFormat(n, i);
    }), T.handleDelegatedClick("[data-timepicker-now]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]");
      n && this.setToCurrentTime(n);
    }), T.handleDelegatedClick("[data-timepicker-apply]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]");
      n && this.applyTime(n);
    }), T.handleDelegatedClick("[data-timepicker-cancel]", (e, t) => {
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-timepicker]");
      n && this.closeDropdown(n);
    }), T.addEventListener(document, "click", (e) => {
      const t = e.target;
      t && t instanceof Element && (t.closest("[data-keys-timepicker]") || this.closeAllDropdowns());
    }), T.handleDelegatedKeydown("[data-keys-timepicker]", (e, t) => {
      this.handleKeydown(e, t);
    });
  }
  /**
   * Setup dynamic observer for new timepickers - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
          n.matches && n.matches("[data-keys-timepicker]") && this.initializeTimePicker(n), b.querySelectorAll("[data-keys-timepicker]", n).forEach((i) => {
            this.initializeTimePicker(i);
          });
        }
      });
    });
  }
  /**
   * Toggle dropdown open/closed state
   */
  toggleDropdown(e) {
    const t = this.getState(e);
    t && (t.isOpen ? this.closeDropdown(e) : this.openDropdown(e));
  }
  /**
   * Open dropdown
   */
  openDropdown(e) {
    const t = this.getState(e);
    if (!t || this.isDisabled(e)) return;
    this.closeAllDropdowns(), t.isOpen = !0, this.setState(e, t);
    const n = b.querySelector("[data-timepicker-trigger]", e);
    n && n.setAttribute("aria-expanded", "true"), this.updateSelectedStates(e), this.scrollToSelectedOptions(e), this.dispatchTimePickerEvent(e, "timepicker:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(e) {
    const t = this.getState(e);
    if (!t) return;
    t.isOpen = !1, this.setState(e, t);
    const n = b.querySelector("[data-timepicker-trigger]", e), i = b.querySelector("[data-popover]", e);
    if (n && n.setAttribute("aria-expanded", "false"), i && "hidePopover" in i)
      try {
        i.hidePopover();
      } catch {
        console.log("Fallback: triggering click to close popover"), n && n.click();
      }
    else n && n.click();
    this.dispatchTimePickerEvent(e, "timepicker:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.getAllStates().forEach((e, t) => {
      e.isOpen && this.closeDropdown(t);
    });
  }
  /**
   * Set hour value
   */
  setHour(e, t) {
    const n = this.getState(e);
    n && (n.hour = t, this.setState(e, n), this.updateSelectedStates(e), this.updatePreview(e));
  }
  /**
   * Set minute value
   */
  setMinute(e, t) {
    const n = this.getState(e);
    n && (n.minute = t, this.setState(e, n), this.updateSelectedStates(e), this.updatePreview(e));
  }
  /**
   * Set second value
   */
  setSecond(e, t) {
    const n = this.getState(e);
    n && (n.second = t, this.setState(e, n), this.updateSelectedStates(e), this.updatePreview(e));
  }
  /**
   * Set period (AM/PM)
   */
  setPeriod(e, t) {
    const n = this.getState(e);
    n && (n.period = t, this.setState(e, n), this.updateSelectedStates(e), this.updatePreview(e));
  }
  /**
   * Convert hour between 12h and 24h formats
   */
  convertHourBetweenFormats(e, t, n, i) {
    if (t === n)
      return { hour: e, period: i };
    if (t === "24" && n === "12")
      return e === 0 ? { hour: 12, period: "AM" } : e >= 1 && e <= 11 ? { hour: e, period: "AM" } : e === 12 ? { hour: 12, period: "PM" } : { hour: e - 12, period: "PM" };
    if (t === "12" && n === "24") {
      if (!i)
        throw new Error("Period (AM/PM) required for 12h to 24h conversion");
      return i === "AM" ? e === 12 ? { hour: 0 } : { hour: e } : e === 12 ? { hour: 12 } : { hour: e + 12 };
    }
    return { hour: e, period: i };
  }
  /**
   * Set format (12/24 hour)
   */
  setFormat(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = e.dataset.formatMode;
    if (i === "12" || i === "24") {
      console.warn(`TimePicker format is locked to ${i}h mode. Cannot switch to ${t}h.`);
      return;
    }
    if (n.format !== t) {
      const s = this.convertHourBetweenFormats(n.hour, n.format, t, n.period);
      n.hour = s.hour, s.period && (n.period = s.period), n.format = t, this.setState(e, n), this.updateFormatButtons(e), this.updatePeriodSectionVisibility(e), this.updateGridLayout(e), this.updateHourOptions(e), this.updateSelectedStates(e), this.updateDisplay(e), this.updatePreview(e);
    }
  }
  /**
   * Set to current time
   */
  setToCurrentTime(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = this.getCurrentTime();
    if (t.format === "12") {
      const i = this.convertHourBetweenFormats(n.hour, "24", "12");
      t.hour = i.hour, t.period = i.period;
    } else
      t.hour = n.hour;
    t.minute = n.minute, t.second = n.second, this.setState(e, t), this.updateSelectedStates(e), this.scrollToSelectedOptions(e), this.updatePreview(e);
  }
  /**
   * Apply time selection
   */
  applyTime(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = this.formatTimeValue(t);
    this.setValue(e, n), this.closeDropdown(e), this.dispatchTimePickerEvent(e, "timepicker:change", {
      value: n,
      state: { ...t }
    });
  }
  /**
   * Clear time value
   */
  clearTime(e) {
    this.setValue(e, ""), this.dispatchTimePickerEvent(e, "timepicker:change", {
      value: "",
      state: null
    });
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(e, t) {
    const n = this.getState(e);
    if (n)
      switch (t.key) {
        case "Enter":
        case " ":
          n.isOpen ? (t.preventDefault(), this.applyTime(e)) : (t.preventDefault(), this.openDropdown(e));
          break;
        case "Escape":
          n.isOpen && (t.preventDefault(), this.closeDropdown(e));
          break;
        case "ArrowUp":
          n.isOpen ? t.preventDefault() : (t.preventDefault(), this.incrementTime(e, "minute", 1));
          break;
        case "ArrowDown":
          n.isOpen ? t.preventDefault() : (t.preventDefault(), this.incrementTime(e, "minute", -1));
          break;
        case "ArrowLeft":
          n.isOpen || (t.preventDefault(), this.incrementTime(e, "hour", -1));
          break;
        case "ArrowRight":
          n.isOpen || (t.preventDefault(), this.incrementTime(e, "hour", 1));
          break;
      }
  }
  /**
   * Increment/decrement time values
   */
  incrementTime(e, t, n) {
    const i = this.getState(e);
    if (i) {
      switch (t) {
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
      this.setState(e, i), this.updateDisplay(e), this.dispatchTimePickerEvent(e, "timepicker:increment", {
        unit: t,
        direction: n,
        value: this.formatTimeValue(i)
      });
    }
  }
  /**
   * Update display value
   */
  updateDisplay(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = this.formatTimeValue(t), i = b.querySelector("[data-timepicker-display]", e);
    if (i)
      if (n)
        i.innerHTML = n;
      else {
        const s = e.dataset.placeholder || "Select time...";
        i.innerHTML = `<span class="text-muted timepicker-placeholder">${s}</span>`;
      }
    n ? e.dataset.hasValue = "true" : delete e.dataset.hasValue, this.updateClearButtonVisibility(e, n);
  }
  /**
   * Update preview in dropdown
   */
  updatePreview(e) {
    this.updateDisplay(e);
  }
  /**
   * Set value and update hidden input
   */
  setValue(e, t) {
    const n = b.querySelector("[data-timepicker-hidden-input]", e), i = b.querySelector("[data-timepicker-display]", e);
    if (n && (n.value = t), i)
      if (t)
        i.innerHTML = t;
      else {
        const a = e.dataset.placeholder || "Select time...";
        i.innerHTML = `<span class="text-muted timepicker-placeholder">${a}</span>`;
      }
    t ? e.dataset.hasValue = "true" : delete e.dataset.hasValue, this.updateClearButtonVisibility(e, t);
    const s = this.getState(e);
    s && (s.value = t, this.setState(e, s));
  }
  /**
   * Update clear button visibility based on value
   */
  updateClearButtonVisibility(e, t) {
    const n = b.querySelector("[data-timepicker-clear]", e);
    console.log("🕒 Updating clear button visibility:", { value: t, clearButton: !!n, disabled: e.dataset.disabled }), n && (t && !e.dataset.disabled ? (n.classList.remove("opacity-0", "pointer-events-none"), n.classList.add("pointer-events-auto"), console.log("🕒 Clear button shown")) : (n.classList.add("opacity-0", "pointer-events-none"), n.classList.remove("pointer-events-auto"), console.log("🕒 Clear button hidden")));
  }
  /**
   * Update selected states in dropdown
   */
  updateSelectedStates(e) {
    const t = this.getState(e);
    if (!t) return;
    b.querySelectorAll(".selected", e).forEach((s) => s.classList.remove("selected"));
    const n = b.querySelector(`[data-timepicker-hour="${t.hour}"]`, e);
    n && n.classList.add("selected");
    const i = b.querySelector(`[data-timepicker-minute="${t.minute}"]`, e);
    if (i && i.classList.add("selected"), t.showSeconds) {
      const s = e.querySelector(`[data-timepicker-second="${t.second}"]`);
      s && s.classList.add("selected");
    }
    if (t.format === "12") {
      const s = e.querySelector(`[data-timepicker-period="${t.period}"]`);
      s && s.classList.add("selected");
    }
  }
  /**
   * Update format toggle buttons
   */
  updateFormatButtons(e) {
    const t = this.getState(e);
    if (!t) return;
    b.querySelectorAll("[data-timepicker-format]", e).forEach((i) => {
      i.dataset.timepickerFormat === t.format ? (i.classList.add("bg-brand", "text-foreground-brand"), i.classList.remove("bg-surface", "text-muted")) : (i.classList.remove("bg-brand", "text-foreground-brand"), i.classList.add("bg-surface", "text-muted"));
    });
  }
  /**
   * Update hour options based on current format
   */
  updateHourOptions(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelector("[data-timepicker-hours]", e);
    if (!n) return;
    const i = t.format === "12" ? Array.from({ length: 12 }, (s, a) => a + 1) : Array.from({ length: 24 }, (s, a) => a);
    n.innerHTML = "", i.forEach((s) => {
      const a = document.createElement("button");
      a.type = "button", a.dataset.timepickerHour = s.toString(), a.className = "w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand transition-colors", a.textContent = s.toString().padStart(2, "0"), n.appendChild(a);
    }), t.format === "12" && (t.hour < 1 || t.hour > 12) ? (t.hour = Math.max(1, Math.min(12, t.hour)), this.setState(e, t), this.updateDisplay(e), this.updatePreview(e)) : t.format === "24" && (t.hour < 0 || t.hour > 23) && (t.hour = Math.max(0, Math.min(23, t.hour)), this.setState(e, t), this.updateDisplay(e), this.updatePreview(e));
  }
  /**
   * Update visibility of the period (AM/PM) section based on current format
   */
  updatePeriodSectionVisibility(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelector("[data-timepicker-period-section]", e);
    n && (n.style.display = t.format === "12" ? "block" : "none");
  }
  /**
   * Update grid layout based on current format and settings
   */
  updateGridLayout(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.querySelector("[data-timepicker-grid]", e);
    if (!n) return;
    let i = 2;
    t.showSeconds && i++, t.format === "12" && i++, n.style.gridTemplateColumns = `repeat(${i}, 1fr)`;
  }
  /**
   * Scroll to selected options in dropdown lists
   */
  scrollToSelectedOptions(e) {
    b.querySelectorAll(".selected", e).forEach((n) => {
      n.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
  /**
   * Parse time string into components
   */
  parseTime(e) {
    var t;
    if (!e) return null;
    try {
      const n = [
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
        /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
      ];
      for (const i of n) {
        const s = e.match(i);
        if (s) {
          const a = parseInt(s[1]), o = parseInt(s[2]), l = parseInt(s[3] || "0"), c = (t = s[4]) == null ? void 0 : t.toUpperCase();
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
    const e = /* @__PURE__ */ new Date();
    return {
      hour: e.getHours(),
      minute: e.getMinutes(),
      second: e.getSeconds()
    };
  }
  /**
   * Format time value from state
   */
  formatTimeValue(e) {
    const { hour: t, minute: n, second: i, period: s, format: a, showSeconds: o } = e;
    if (a === "12") {
      const l = t.toString(), c = n.toString().padStart(2, "0"), d = i.toString().padStart(2, "0");
      return o ? `${l}:${c}:${d} ${s}` : `${l}:${c} ${s}`;
    } else {
      const l = t.toString().padStart(2, "0"), c = n.toString().padStart(2, "0"), d = i.toString().padStart(2, "0");
      return o ? `${l}:${c}:${d}` : `${l}:${c}`;
    }
  }
  /**
   * Check if timepicker is disabled
   */
  isDisabled(e) {
    return e.dataset.disabled === "true";
  }
  /**
   * Dispatch custom timepicker event
   */
  dispatchTimePickerEvent(e, t, n = null) {
    T.dispatchCustomEvent(e, t, {
      timepicker: e,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  /**
   * Get timepicker state (for external access)
   */
  getTimePickerState(e) {
    return this.getState(e) || null;
  }
  /**
   * Set time programmatically
   */
  setTime(e, t) {
    const n = this.parseTime(t), i = this.getState(e);
    !n || !i || (i.hour = n.hour, i.minute = n.minute, i.second = n.second, n.period && (i.period = n.period), this.setState(e, i), this.updateDisplay(e), this.updateSelectedStates(e), this.dispatchTimePickerEvent(e, "timepicker:change", {
      value: this.formatTimeValue(i),
      state: { ...i }
    }));
  }
  /**
   * Clean up TimePickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  jr.getInstance().init();
}) : jr.getInstance().init();
window.TimePickerActions = jr;
jr.getInstance();
class Bn {
  /**
   * Check if Livewire is available globally
   */
  static isLivewireAvailable() {
    return typeof window < "u" && "Livewire" in window;
  }
  /**
   * Detect if an editor element is Livewire-enabled
   */
  static isLivewireEnabled(e) {
    return e.dataset.livewireEnabled === "true" || e.dataset.livewireMode === "true" || !!e.dataset.wireModel || !!e.querySelector('[data-quill-input="true"][wire\\:model]');
  }
  /**
   * Get the Livewire component for an editor element
   */
  static getLivewireComponent(e) {
    if (!this.isLivewireAvailable()) return null;
    const t = e.closest("[wire\\:id]");
    return t ? window.Livewire.find(t.getAttribute("wire:id")) : null;
  }
  /**
   * Get the wire:model property name from the editor container
   */
  static getWireModelProperty(e) {
    if (e.dataset.wireModel)
      return e.dataset.wireModel;
    if (e.dataset.livewireProperty)
      return e.dataset.livewireProperty;
    for (const n of e.attributes)
      if (n.name.startsWith("wire:model"))
        return n.value;
    const t = e.querySelector('[data-quill-input="true"]');
    if (t) {
      for (const n of t.attributes)
        if (n.name.startsWith("wire:model"))
          return n.value;
    }
    return null;
  }
  /**
   * Update Livewire property value
   */
  static updateLivewireProperty(e, t) {
    const n = this.getLivewireComponent(e), i = this.getWireModelProperty(e);
    if (!(!n || !i))
      try {
        n.set(i, t);
      } catch (s) {
        console.warn("Failed to update Livewire property:", i, s);
      }
  }
  /**
   * Format value for Livewire (HTML content)
   */
  static formatValueForLivewire(e) {
    return e || "";
  }
}
class Ec extends ee {
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
    b.findByDataAttribute("quill-editor", "true").forEach((t) => this.initializeQuillEditor(t));
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
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
          b.hasDataAttribute(n, "quill-editor", "true") && this.initializeQuillEditor(n), b.findByDataAttribute("quill-editor", "true", n).forEach((s) => this.initializeQuillEditor(s));
        }
      });
    });
  }
  /**
   * Find the hidden input for an editor
   */
  findHiddenInput(e) {
    return b.querySelector('[data-quill-input="true"]', e);
  }
  /**
   * Initialize a single Quill editor element
   */
  initializeQuillEditor(e) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initializeQuillEditor(e);
      });
      return;
    }
    if (!b.getDataAttribute(e, "editorId")) {
      console.warn("Editor missing editorId, skipping initialization");
      return;
    }
    if (this.hasState(e))
      return;
    const n = b.querySelector('[data-quill-container="true"]', e), i = this.findHiddenInput(e), s = b.querySelector('[data-quill-live-region="true"]', e);
    if (!n)
      return;
    const a = b.getDataAttribute(n, "quillConfig");
    let o = "";
    if (i && i.value)
      o = i.value;
    else {
      const f = b.getDataAttribute(n, "quill-value");
      if (f)
        try {
          o = JSON.parse(f);
        } catch {
          o = f;
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
        const f = JSON.parse(a);
        l = { ...l, ...f };
      } catch {
      }
    let c;
    try {
      if (!window.Quill) {
        console.error("Global Quill not available");
        return;
      }
      c = new window.Quill(n, l);
    } catch (f) {
      console.error("Quill initialization failed:", f);
      return;
    }
    if (o)
      try {
        c.clipboard.dangerouslyPasteHTML(o);
      } catch (f) {
        console.warn("Failed to set initial content:", f), c.setText(o);
      }
    Bn.isLivewireEnabled(e);
    const d = {
      quillInstance: c,
      containerElement: n,
      hiddenInput: i,
      config: l,
      liveRegion: s,
      lastAnnouncementTime: 0
    };
    this.setState(e, d), this.setupContentSync(d), this.setupAccessibilityFeatures(d);
  }
  /**
   * Set up content synchronization between Quill and Livewire
   */
  setupContentSync(e) {
    const t = Bn.isLivewireEnabled(e.containerElement);
    e.quillInstance.on("text-change", (n, i, s) => {
      t ? this.syncToLivewireWithState(e) : this.syncQuillToInput(e);
    }), t ? this.syncToLivewireWithState(e) : this.syncQuillToInput(e);
  }
  /**
   * Sync Quill content to hidden input and dispatch events for Livewire
   */
  syncQuillToInput(e) {
    if (e.hiddenInput) {
      const t = e.quillInstance.root.innerHTML, n = e.hiddenInput.value;
      t !== n && (e.hiddenInput.value = t, this.dispatchLivewireInputEvent(e.hiddenInput, t));
    }
  }
  /**
   * Dispatch proper input events for Livewire integration
   */
  dispatchLivewireInputEvent(e, t) {
    const n = new InputEvent("input", {
      bubbles: !0,
      cancelable: !0,
      inputType: "insertText",
      data: t
    });
    e.dispatchEvent(n);
    const i = new Event("change", { bubbles: !0, cancelable: !0 });
    e.dispatchEvent(i);
  }
  /**
   * Get editor content as HTML
   */
  getEditorContent(e) {
    const t = this.getState(e);
    return t ? t.quillInstance.root.innerHTML : "";
  }
  /**
   * Set editor content
   */
  setEditorContent(e, t) {
    const n = this.getState(e);
    if (n) {
      try {
        n.quillInstance.clipboard.dangerouslyPasteHTML(t);
      } catch (i) {
        console.warn("Failed to set editor content:", i), n.quillInstance.setText(t);
      }
      this.syncQuillToInput(n);
    }
  }
  /**
   * Clear editor content
   */
  clearEditor(e) {
    const t = this.getState(e);
    t && (t.quillInstance.setText(""), this.syncQuillToInput(t));
  }
  /**
   * Focus specific editor
   */
  focusEditor(e) {
    const t = this.getState(e);
    t && t.quillInstance.focus();
  }
  /**
   * Get Quill instance for advanced usage
   */
  getQuillInstance(e) {
    const t = this.getState(e);
    return t ? t.quillInstance : null;
  }
  /**
   * Set up accessibility features for the editor
   */
  setupAccessibilityFeatures(e) {
    this.setupKeyboardNavigation(e), this.setupContentAnnouncements(e), this.setupToolbarAccessibility(e);
  }
  /**
   * Set up keyboard navigation enhancements
   */
  setupKeyboardNavigation(e) {
    e.quillInstance.keyboard.addBinding({
      key: "F1",
      handler: () => (this.announceKeyboardHelp(e), !1)
    }), e.containerElement.addEventListener("focus", () => {
      e.liveRegion && this.announceToLiveRegion(e, "Rich text editor focused. Press F1 for keyboard shortcuts.");
    });
  }
  /**
   * Set up content change announcements for screen readers
   */
  setupContentAnnouncements(e) {
    let t = null;
    const n = 2e3;
    e.quillInstance.on("text-change", (i, s, a) => {
      a === "user" && (t && clearTimeout(t), t = window.setTimeout(() => {
        const o = e.quillInstance.getText().trim(), l = o ? o.split(/\s+/).length : 0;
        l > 0 && this.announceToLiveRegion(e, `${l} words written`);
      }, n));
    }), e.quillInstance.on("selection-change", (i, s, a) => {
      if (i && a === "user") {
        const o = e.quillInstance.getFormat(i);
        this.announceFormattingChanges(e, o);
      }
    });
  }
  /**
   * Set up toolbar accessibility enhancements
   */
  setupToolbarAccessibility(e) {
    const t = e.containerElement.querySelector(".ql-toolbar");
    if (!t) return;
    t.setAttribute("role", "toolbar"), t.setAttribute("aria-label", "Rich text editor toolbar");
    const n = t.querySelectorAll("button");
    n.forEach((i, s) => {
      this.enhanceButtonAccessibility(i), i.setAttribute("tabindex", s === 0 ? "0" : "-1");
    }), t.addEventListener("keydown", (i) => {
      this.handleToolbarKeyboard(i, n);
    });
  }
  /**
   * Enhance individual button accessibility
   */
  enhanceButtonAccessibility(e) {
    const t = {
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
    for (const [n, i] of Object.entries(t))
      if (e.classList.contains(n.split("[")[0]) || e.matches(`[${n.split("[")[1]}`)) {
        e.setAttribute("aria-label", i), e.setAttribute("title", i);
        break;
      }
  }
  /**
   * Handle toolbar keyboard navigation
   */
  handleToolbarKeyboard(e, t) {
    const n = Array.from(t).findIndex((s) => s === document.activeElement);
    if (n === -1) return;
    let i = n;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        i = n > 0 ? n - 1 : t.length - 1, e.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowDown":
        i = n < t.length - 1 ? n + 1 : 0, e.preventDefault();
        break;
      case "Home":
        i = 0, e.preventDefault();
        break;
      case "End":
        i = t.length - 1, e.preventDefault();
        break;
      default:
        return;
    }
    t[n].setAttribute("tabindex", "-1"), t[i].setAttribute("tabindex", "0"), t[i].focus();
  }
  /**
   * Announce text to the live region
   */
  announceToLiveRegion(e, t) {
    if (!e.liveRegion) return;
    const n = Date.now();
    n - e.lastAnnouncementTime < 1e3 || (e.liveRegion.textContent = t, e.lastAnnouncementTime = n, setTimeout(() => {
      e.liveRegion && (e.liveRegion.textContent = "");
    }, 3e3));
  }
  /**
   * Announce formatting changes
   */
  announceFormattingChanges(e, t) {
    const n = Object.keys(t).filter((i) => t[i]);
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
            return `heading ${t[s]}`;
          case "list":
            return `${t[s]} list`;
          default:
            return s;
        }
      });
      this.announceToLiveRegion(e, `Formatting: ${i.join(", ")}`);
    }
  }
  /**
   * Announce keyboard shortcuts help
   */
  announceKeyboardHelp(e) {
    this.announceToLiveRegion(e, "Keyboard shortcuts: Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, Ctrl+K for link. Use arrow keys to navigate toolbar buttons.");
  }
  /**
   * Synchronize content from Quill to Livewire using provided state
   */
  syncToLivewireWithState(e) {
    const t = e.quillInstance.root.innerHTML, n = Bn.formatValueForLivewire(t);
    Bn.updateLivewireProperty(e.containerElement, n);
  }
  /**
   * Reinitialize editor after DOM morphing
   */
  reinitializeAfterMorph(e) {
    b.querySelector('[data-quill-container="true"]', e) && !this.hasState(e) && this.initializeQuillEditor(e);
  }
  /**
   * Manually trigger content sync to Livewire (for debugging)
   */
  manualSync() {
    b.querySelectorAll('[data-quill-container="true"]').forEach((t) => {
      if (Bn.isLivewireEnabled(t)) {
        const n = window.Quill.find(t);
        if (n) {
          const i = n.root.innerHTML, s = Bn.formatValueForLivewire(i);
          Bn.updateLivewireProperty(t, s);
        }
      }
    });
  }
  /**
   * Clean up EditorActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.stateManager.forEach((e) => {
      e.quillInstance.off("text-change");
    });
  }
}
Ec.getInstance();
class Ur extends ee {
  initializeElements() {
    b.querySelectorAll("[data-keys-date-picker]").forEach((e) => {
      this.initializeDatePicker(e);
    });
  }
  initializeDatePicker(e) {
    if (this.hasState(e)) return;
    const t = e.dataset.keysDatePickerConfig;
    let n = {};
    try {
      n = t ? JSON.parse(t) : {};
    } catch (s) {
      console.error("Failed to parse date picker config:", s);
    }
    const i = {
      selectedDate: n.selectedDate || null,
      startDate: n.startDate || null,
      endDate: n.endDate || null,
      format: n.format || "Y-m-d",
      displayFormat: n.displayFormat || n.format || "Y-m-d",
      isRange: n.isRange || !1,
      closeOnSelect: n.closeOnSelect !== !1,
      isInline: e.dataset.inline === "true",
      isDisabled: e.dataset.disabled === "true"
    };
    this.setState(e, i), this.setupCalendarEventListeners(e);
  }
  bindEventListeners() {
    T.handleDelegatedClick("[data-date-picker-clear]", (e, t) => {
      t.preventDefault(), t.stopPropagation();
      const n = b.findClosest(e, "[data-keys-date-picker]");
      n && !this.isDisabled(n) && this.clearDate(n);
    }), T.handleDelegatedClick("[data-quick-selector]", (e, t) => {
      var s;
      t.preventDefault();
      const n = b.findClosest(e, "[data-keys-date-picker]"), i = n ? b.querySelector('[data-keys-calendar="true"]', n) : null;
      if (i && ((s = window.KeysUI) != null && s.CalendarCore)) {
        const a = e.dataset.quickSelector;
        a && i.dispatchEvent(new CustomEvent("quickSelector:clicked", {
          detail: { value: a },
          bubbles: !0
        }));
      }
    }), T.handleDelegatedInput("[data-date-picker-input]", (e) => {
      if (!e.readOnly) {
        const t = b.findClosest(e, "[data-keys-date-picker]");
        t && !this.isDisabled(t) && this.handleManualInput(t, e.value);
      }
    });
  }
  setupCalendarEventListeners(e) {
    const t = b.querySelector('[data-keys-calendar="true"]', e);
    t && (t.addEventListener("calendar:dateSelected", (n) => {
      n.stopPropagation();
      const { selectedDate: i, formattedDate: s } = n.detail;
      this.handleDateSelected(e, i, s);
    }), t.addEventListener("calendar:rangeSelected", (n) => {
      n.stopPropagation();
      const { startDate: i, endDate: s, formattedRange: a } = n.detail;
      this.handleRangeSelected(e, i, s, a);
    }), t.addEventListener("calendar:cleared", (n) => {
      n.stopPropagation(), this.handleCalendarCleared(e);
    }));
  }
  handleDateSelected(e, t, n) {
    const i = this.getState(e);
    i && (i.selectedDate = t, this.setState(e, i), this.updateDisplay(e, t ? this.formatDateForDisplay(t, i.displayFormat) : null), this.updateHiddenInput(e, t ? ve.formatDateForSubmission(t, i.format) : ""), i.closeOnSelect && !i.isInline && !i.isRange && this.closePopover(e), this.dispatchDatePickerEvent(e, "datepicker:change", {
      value: t,
      formatted: n
    }));
  }
  handleRangeSelected(e, t, n, i) {
    const s = this.getState(e);
    if (!s) return;
    s.startDate = t, s.endDate = n, this.setState(e, s);
    const a = ve.formatRangeForDisplay(t, n, s.displayFormat);
    this.updateDisplay(e, a);
    const o = ve.formatRangeForSubmission(t, n, s.format);
    this.updateHiddenInput(e, o || ""), s.closeOnSelect && t && n && !s.isInline && this.closePopover(e), this.dispatchDatePickerEvent(e, "datepicker:change", {
      startDate: t,
      endDate: n,
      formatted: i
    });
  }
  handleCalendarCleared(e) {
    this.clearDate(e);
  }
  clearDate(e) {
    var i;
    const t = this.getState(e);
    if (!t) return;
    t.selectedDate = null, t.startDate = null, t.endDate = null, this.setState(e, t), this.updateDisplay(e, null), this.updateHiddenInput(e, "");
    const n = b.querySelector('[data-keys-calendar="true"]', e);
    if (n && ((i = window.KeysUI) != null && i.CalendarCore))
      try {
        const s = window.KeysUI.CalendarCore;
        t.isRange ? s.setSelectedRange(n, null, null) : s.setSelectedDate(n, null);
      } catch {
      }
    t.isInline || this.closePopover(e), this.dispatchDatePickerEvent(e, "datepicker:cleared");
  }
  updateDisplay(e, t) {
    const n = b.querySelector("[data-date-picker-display]", e);
    if (n)
      if (t)
        n.innerHTML = t;
      else {
        const i = e.dataset.placeholder || "Select date...";
        n.innerHTML = `<span class="text-muted date-picker-placeholder">${i}</span>`;
      }
  }
  updateHiddenInput(e, t) {
    const n = b.querySelector("[data-date-picker-value]", e);
    n && (n.value = t);
  }
  closePopover(e) {
    setTimeout(() => {
      const t = b.findClosest(e, "[data-keys-popover]") || b.querySelector("[data-keys-popover]", e);
      if (t && "hidePopover" in t)
        try {
          t.hidePopover();
        } catch {
        }
    }, 150);
  }
  handleManualInput(e, t) {
    var s;
    const n = this.getState(e);
    if (!n) return;
    const i = ve.parseInputDate(t, n.displayFormat);
    if (i) {
      const a = ve.formatDateString(i);
      this.updateDisplay(e, this.formatDateForDisplay(a, n.displayFormat));
      const o = b.querySelector('[data-keys-calendar="true"]', e);
      if (o && ((s = window.KeysUI) != null && s.CalendarCore))
        try {
          window.KeysUI.CalendarCore.setSelectedDate(o, a);
        } catch (l) {
          console.warn("Calendar core not available or failed:", l);
        }
    }
  }
  isDisabled(e) {
    const t = this.getState(e);
    return t ? t.isDisabled : !1;
  }
  dispatchDatePickerEvent(e, t, n = null) {
    T.dispatchCustomEvent(e, t, {
      datePicker: e,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
          b.hasDataAttribute(n, "keys-date-picker", "true") && this.initializeDatePicker(n), b.findByDataAttribute("keys-date-picker", "true", n).forEach((i) => {
            this.initializeDatePicker(i);
          });
        }
      });
    });
  }
  formatDateForDisplay(e, t) {
    try {
      const n = /* @__PURE__ */ new Date(e + "T00:00:00");
      return isNaN(n.getTime()) ? e : ve.formatDateForDisplay(e, t) || e;
    } catch (n) {
      return console.warn("Date formatting error:", n), e;
    }
  }
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Ur.getInstance().init();
}) : Ur.getInstance().init();
window.DatePickerActions = Ur;
Ur.getInstance();
class Cc extends ee {
  constructor() {
    super(...arguments), this.cleanupFunctions = [];
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      T.handleDelegatedClick(
        '[data-add-to-cart="true"]',
        (e, t) => this.handleAddToCart(e, t)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        ".qty-decrease",
        (e, t) => this.handleQuantityChange(e, t, "decrease")
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        ".qty-increase",
        (e, t) => this.handleQuantityChange(e, t, "increase")
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedInput(
        ".qty-input",
        (e, t) => this.handleQuantityInput(e, t)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedKeydown(
        ".qty-input",
        (e, t) => this.handleQuantityKeydown(e, t)
      )
    );
  }
  initializeElements() {
    b.findByDataAttribute("add-to-cart", "true").forEach((t) => this.initializeButton(t));
  }
  initializeButton(e) {
    const t = this.extractStateFromButton(e);
    if (t) {
      const n = b.querySelector(".button-text", e);
      n && (t.originalText = n.textContent || ""), this.setState(e, t), this.updateButtonState(e), this.updateQuantityControls(e);
    }
  }
  extractStateFromButton(e) {
    const t = b.getDataAttribute(e, "productId");
    return t ? {
      productId: t,
      variantId: b.getDataAttribute(e, "variantId"),
      quantity: parseInt(b.getDataAttribute(e, "quantity") || "1"),
      maxQuantity: parseInt(b.getDataAttribute(e, "maxQuantity") || "99"),
      stockLevel: b.getDataAttribute(e, "stockLevel") ? parseInt(b.getDataAttribute(e, "stockLevel")) : void 0,
      price: b.getDataAttribute(e, "price"),
      ajaxUrl: b.getDataAttribute(e, "ajaxUrl") || "/cart/add",
      inCart: b.getDataAttribute(e, "inCart") === "true",
      isProcessing: !1
    } : (console.warn("AddToCart button missing required data-product-id attribute"), null);
  }
  async handleAddToCart(e, t) {
    if (t.preventDefault(), b.isDisabled(e))
      return;
    const n = this.getState(e);
    if (!n || n.isProcessing)
      return;
    const i = this.getQuantityInput(e);
    if (i && (n.quantity = parseInt(i.value) || 1), !this.validateQuantity(n.quantity, n)) {
      this.showError(e, "Invalid quantity");
      return;
    }
    n.isProcessing = !0, this.setState(e, n), this.setButtonState(e, "adding");
    try {
      const s = await this.sendCartRequest(n);
      if (s.success)
        n.inCart = s.inCart ?? !0, n.isProcessing = !1, s.stockLevel !== void 0 && (n.stockLevel = s.stockLevel, b.setDataAttribute(e, "stockLevel", s.stockLevel.toString())), this.setState(e, n), this.setButtonState(e, "added"), this.dispatchCartEvent(e, "cart:added", {
          productId: n.productId,
          variantId: n.variantId,
          quantity: n.quantity,
          cartCount: s.cartCount
        }), setTimeout(() => {
          var a;
          (a = this.getState(e)) != null && a.inCart && this.setButtonState(e, "default");
        }, 2e3);
      else
        throw new Error(s.error || s.message || "Failed to add to cart");
    } catch (s) {
      n.isProcessing = !1, this.setState(e, n), this.setButtonState(e, "default"), this.showError(e, s instanceof Error ? s.message : "An error occurred");
    }
    this.updateQuantityControls(e);
  }
  handleQuantityChange(e, t, n) {
    t.preventDefault();
    const i = b.getDataAttribute(e, "target");
    if (!i) return;
    const s = b.getElementById(i);
    if (!s) return;
    const a = b.findClosest(e, ".add-to-cart-wrapper"), o = a ? b.querySelector('[data-add-to-cart="true"]', a) : null;
    if (!o) return;
    const l = this.getState(o);
    if (!l) return;
    const c = parseInt(s.value) || 1;
    let d = c;
    n === "increase" ? d = Math.min(c + 1, l.maxQuantity) : d = Math.max(c - 1, 1), d !== c && (s.value = d.toString(), l.quantity = d, this.setState(o, l), this.dispatchCartEvent(o, "cart:quantity-changed", {
      productId: l.productId,
      quantity: d,
      previousQuantity: c
    })), this.updateQuantityControls(o);
  }
  handleQuantityInput(e, t) {
    const n = b.findClosest(e, ".add-to-cart-wrapper"), i = n ? b.querySelector('[data-add-to-cart="true"]', n) : null;
    if (!i) return;
    const s = this.getState(i);
    if (!s) return;
    let a = parseInt(e.value) || 1;
    a = Math.max(1, Math.min(a, s.maxQuantity)), e.value !== a.toString() && (e.value = a.toString()), s.quantity = a, this.setState(i, s), this.updateQuantityControls(i);
  }
  handleQuantityKeydown(e, t) {
    [8, 9, 27, 13, 35, 36, 37, 39, 38, 40].includes(t.keyCode) || t.ctrlKey && [65, 67, 86, 88].includes(t.keyCode) || (t.shiftKey || t.keyCode < 48 || t.keyCode > 57) && (t.keyCode < 96 || t.keyCode > 105) && t.preventDefault();
  }
  validateQuantity(e, t) {
    return !(e < 1 || e > t.maxQuantity || t.stockLevel !== void 0 && e > t.stockLevel);
  }
  async sendCartRequest(e) {
    var s;
    const t = new FormData();
    t.append("product_id", e.productId), t.append("quantity", e.quantity.toString()), e.variantId && t.append("variant_id", e.variantId);
    const n = (s = b.querySelector('meta[name="csrf-token"]')) == null ? void 0 : s.getAttribute("content");
    n && t.append("_token", n);
    const i = await fetch(e.ajaxUrl, {
      method: "POST",
      body: t,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json"
      }
    });
    if (!i.ok)
      throw new Error(`HTTP ${i.status}: ${i.statusText}`);
    return await i.json();
  }
  setButtonState(e, t) {
    b.removeClasses(e, ["adding", "added"]), t !== "default" && b.addClass(e, t);
    const n = b.querySelector(".button-text", e);
    if (n) {
      const i = this.getState(e);
      switch (t) {
        case "adding":
          const s = b.getDataAttribute(e, "labelToggle");
          s && (n.textContent = s);
          break;
        case "added":
          const a = b.getDataAttribute(e, "labelSuccess");
          a && (n.textContent = a);
          break;
        case "default":
          i != null && i.originalText && (n.textContent = i.originalText);
          break;
      }
    }
  }
  updateButtonState(e) {
    const t = this.getState(e);
    t && (t.stockLevel !== void 0 && t.stockLevel <= 0 ? (b.toggleAttribute(e, "disabled", "true"), b.addClasses(e, ["cursor-not-allowed", "opacity-50"])) : (b.toggleAttribute(e, "disabled"), b.removeClasses(e, ["cursor-not-allowed", "opacity-50"])));
  }
  updateQuantityControls(e) {
    const t = this.getState(e);
    if (!t) return;
    const n = b.findClosest(e, ".add-to-cart-wrapper");
    if (!n) return;
    const i = b.querySelector(".qty-decrease", n);
    i && b.toggleAttribute(i, "disabled", t.quantity <= 1 ? "true" : void 0);
    const s = b.querySelector(".qty-increase", n);
    if (s) {
      const o = t.quantity >= t.maxQuantity || t.stockLevel !== void 0 && t.quantity >= t.stockLevel;
      b.toggleAttribute(s, "disabled", o ? "true" : void 0);
    }
    const a = this.getQuantityInput(e);
    a && (a.max = t.maxQuantity.toString(), t.stockLevel !== void 0 && (a.max = Math.min(t.maxQuantity, t.stockLevel).toString()));
  }
  getQuantityInput(e) {
    const t = b.findClosest(e, ".add-to-cart-wrapper");
    return t ? b.querySelector(".qty-input", t) : null;
  }
  showError(e, t) {
    this.dispatchCartEvent(e, "cart:error", { message: t }), console.error("Add to Cart Error:", t);
  }
  dispatchCartEvent(e, t, n) {
    T.dispatchCustomEvent(e, t, n);
  }
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        t instanceof Element && b.findByDataAttribute("add-to-cart", "true", t).forEach((i) => this.initializeButton(i));
      });
    });
  }
  destroy() {
    this.cleanupFunctions.forEach((e) => e()), this.cleanupFunctions = [], super.destroy();
  }
}
if (typeof document < "u") {
  const r = () => {
    Cc.getInstance().init();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
}
class Sa extends ee {
  constructor() {
    super(), this.cleanupFunctions = [], this.currentModal = null;
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-trigger]",
        (e, t) => this.handleThumbnailClick(e, t)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-close]",
        (e, t) => this.handleCloseClick(e, t)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-prev]",
        (e, t) => this.handlePrevClick(e, t)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-next]",
        (e, t) => this.handleNextClick(e, t)
      )
    ), this.cleanupFunctions.push(
      T.addEventListener(document, "keydown", (e) => {
        this.handleKeydown(e);
      })
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-modal]",
        (e, t) => this.handleModalBackgroundClick(e, t)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-trigger]",
        (e, t) => this.handleTriggerClick(e, t)
      )
    );
  }
  initializeElements() {
    console.log("[Lightbox] Initializing lightbox elements...");
    const e = b.findByDataAttribute("file-upload-zone");
    console.log("[Lightbox] Found file upload zones:", e.length), e.forEach((i) => {
      if (i.getAttribute("data-lightbox") === "true") {
        const a = i.parentElement;
        a && (console.log("[Lightbox] Initializing lightbox for upload zone"), this.initializeLightboxForUpload(a));
      }
    });
    const t = b.findByDataAttribute("lightbox-image");
    console.log("[Lightbox] Found standalone images:", t.length), t.forEach((i) => {
      console.log("[Lightbox] Initializing lightbox for image:", i), this.initializeLightboxForImage(i);
    });
    const n = b.findByDataAttribute("gallery");
    console.log("[Lightbox] Found gallery containers:", n.length), n.forEach((i) => {
      const s = i.getAttribute("data-lightbox") === "true";
      console.log("[Lightbox] Gallery has lightbox enabled:", s, i), s && (console.log("[Lightbox] Initializing lightbox for gallery"), this.initializeLightboxForGallery(i));
    }), console.log("[Lightbox] Initialization complete");
  }
  initializeLightboxForUpload(e) {
    const t = e.getAttribute("data-file-upload-id") || e.id || "upload-" + Date.now();
    this.setState(e, {
      currentImageIndex: 0,
      images: [],
      isOpen: !1,
      elementId: t
    });
  }
  initializeLightboxForImage(e) {
    const t = e.id || "image-" + Date.now(), n = e.closest("[data-lightbox-container]") || e, i = e.querySelector("img") || e;
    if (i && i.tagName === "IMG") {
      const s = this.extractImageData(i, t);
      this.setState(n, {
        currentImageIndex: 0,
        images: [s],
        isOpen: !1,
        elementId: t
      });
    }
  }
  initializeLightboxForGallery(e) {
    const t = e.getAttribute("data-gallery-id") || e.id || "gallery-" + Date.now(), n = [];
    e.querySelectorAll("[data-gallery-image]").forEach((s, a) => {
      const o = s.querySelector("img") || s;
      o && o.tagName === "IMG" && n.push(this.extractImageData(o, `${t}-${a}`, a));
    }), this.setState(e, {
      currentImageIndex: 0,
      images: n,
      isOpen: !1,
      elementId: t
    });
  }
  getFilenameFromSrc(e) {
    try {
      return new URL(e).pathname.split("/").pop() || "image";
    } catch {
      return e.split("/").pop() || "image";
    }
  }
  /**
   * Extract image data from HTML image element for lightbox display
   *
   * Reads image source, alt text, and metadata attributes to build LightboxImage object.
   * Falls back to extracting filename from src URL if data-filename not provided.
   *
   * @param img - The HTML image element to extract data from
   * @param id - Unique identifier for this image in the lightbox
   * @param index - Optional index for auto-generating alt text
   * @returns LightboxImage object with all metadata for display
   */
  extractImageData(e, t, n) {
    return {
      id: t,
      src: e.src,
      alt: e.alt || (n !== void 0 ? `Gallery image ${n + 1}` : "Image"),
      fileName: e.getAttribute("data-filename") || this.getFilenameFromSrc(e.src),
      fileSize: e.getAttribute("data-filesize") || "Unknown size",
      fileType: e.getAttribute("data-filetype") || "image"
    };
  }
  /**
   * Handle click on lightbox trigger element (image preview)
   */
  handleTriggerClick(e, t) {
    console.log("[Lightbox] Trigger clicked:", e), t.preventDefault(), t.stopPropagation();
    const n = e.closest(".file-upload-wrapper") || e.closest("[data-gallery]") || e.closest("[data-lightbox-container]") || e.closest("[data-keys-file-upload]");
    if (!n) {
      console.warn("[Lightbox] No container found for trigger:", e);
      return;
    }
    console.log("[Lightbox] Found container:", n);
    const i = this.getState(n);
    if (!i) {
      console.warn("[Lightbox] No state found for container");
      return;
    }
    console.log("[Lightbox] State:", i);
    const s = e.getAttribute("data-lightbox-trigger");
    if (!s) {
      console.warn("[Lightbox] No image ID on trigger");
      return;
    }
    const a = i.images.findIndex((o) => o.id === s);
    if (a === -1) {
      console.warn("[Lightbox] Image not found in state:", s);
      return;
    }
    console.log("[Lightbox] Opening lightbox at index:", a), this.openLightbox(n, a);
  }
  handleThumbnailClick(e, t) {
    t.preventDefault(), t.stopPropagation();
    const n = this.findLightboxContainer(e);
    if (!n)
      return;
    const i = this.getState(n);
    if (!i)
      return;
    let s = 0;
    const a = e.getAttribute("data-lightbox-trigger");
    a && (s = i.images.findIndex((l) => l.id === a));
    const o = e.getAttribute("data-gallery-image");
    o !== null && (s = parseInt(o, 10)), e.hasAttribute("data-lightbox-image") && (s = 0), !(s === -1 || s >= i.images.length) && this.openLightbox(n, s);
  }
  handleCloseClick(e, t) {
    t.preventDefault(), this.closeLightbox();
  }
  handlePrevClick(e, t) {
    t.preventDefault(), this.navigateToPrevious();
  }
  handleNextClick(e, t) {
    t.preventDefault(), this.navigateToNext();
  }
  handleKeydown(e) {
    if (!(!this.currentModal || !this.currentModal.open))
      switch (e.key) {
        case "Escape":
          e.preventDefault(), this.closeLightbox();
          break;
        case "ArrowLeft":
          e.preventDefault(), this.navigateToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault(), this.navigateToNext();
          break;
      }
  }
  handleModalBackgroundClick(e, t) {
    t.target === e && this.closeLightbox();
  }
  openLightbox(e, t) {
    const n = this.getState(e);
    if (!n || !n.images.length)
      return;
    n.currentImageIndex = t, n.isOpen = !0, this.setState(e, n);
    const i = this.getOrCreateLightboxModal(e);
    this.currentModal = i, this.updateModalContent(i, n), i.showModal(), T.dispatchCustomEvent(e, "lightbox:open", {
      imageIndex: t,
      image: n.images[t]
    });
  }
  closeLightbox() {
    if (!this.currentModal)
      return;
    const e = this.findContainerElementFromModal(this.currentModal);
    if (e) {
      const t = this.getState(e);
      t && (t.isOpen = !1, this.setState(e, t)), T.dispatchCustomEvent(e, "lightbox:close", {});
    }
    this.currentModal.close(), this.currentModal = null;
  }
  navigateToPrevious() {
    if (!this.currentModal) return;
    const e = this.findContainerElementFromModal(this.currentModal);
    if (!e) return;
    const t = this.getState(e);
    if (!t || !t.images.length) return;
    const n = t.currentImageIndex > 0 ? t.currentImageIndex - 1 : t.images.length - 1;
    t.currentImageIndex = n, this.setState(e, t), this.updateModalContent(this.currentModal, t), T.dispatchCustomEvent(e, "lightbox:navigate", {
      direction: "previous",
      imageIndex: n,
      image: t.images[n]
    });
  }
  navigateToNext() {
    if (!this.currentModal) return;
    const e = this.findContainerElementFromModal(this.currentModal);
    if (!e) return;
    const t = this.getState(e);
    if (!t || !t.images.length) return;
    const n = t.currentImageIndex < t.images.length - 1 ? t.currentImageIndex + 1 : 0;
    t.currentImageIndex = n, this.setState(e, t), this.updateModalContent(this.currentModal, t), T.dispatchCustomEvent(e, "lightbox:navigate", {
      direction: "next",
      imageIndex: n,
      image: t.images[n]
    });
  }
  getOrCreateLightboxModal(e) {
    const n = this.getElementId(e) + "-lightbox-modal";
    let i = document.getElementById(n);
    return i || (i = this.createLightboxModal(n), document.body.appendChild(i)), i;
  }
  getElementId(e) {
    const t = e.getAttribute("data-file-upload-id");
    if (t)
      return t;
    const n = e.getAttribute("data-gallery-id");
    return n || e.id || "lightbox-" + Date.now();
  }
  createLightboxModal(e) {
    const t = b.createElement("dialog", {
      attributes: {
        id: e,
        "data-lightbox-modal": "true",
        "data-modal": "true",
        class: "lightbox-modal p-0 m-0 w-full h-full max-w-none max-h-none bg-black/90 backdrop:bg-black/50"
      }
    });
    return t.innerHTML = `
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
        `, t;
  }
  updateModalContent(e, t) {
    const n = t.images[t.currentImageIndex];
    if (!n) return;
    const i = e.querySelector("[data-lightbox-image]");
    i && (i.src = n.src, i.alt = n.alt);
    const s = e.querySelector("[data-lightbox-title]");
    s && (s.textContent = n.fileName);
    const a = e.querySelector("[data-lightbox-size]");
    a && (a.textContent = n.fileSize);
    const o = e.querySelector("[data-lightbox-counter]");
    o && (o.textContent = `${t.currentImageIndex + 1} of ${t.images.length}`);
    const l = e.querySelector("[data-lightbox-prev]"), c = e.querySelector("[data-lightbox-next]");
    if (l && c) {
      const d = t.images.length > 1;
      l.style.display = d ? "flex" : "none", c.style.display = d ? "flex" : "none";
    }
  }
  findLightboxContainer(e) {
    const t = b.findClosest(e, "[data-file-upload-id]");
    if (t)
      return t;
    const n = b.findClosest(e, "[data-gallery]");
    if (n)
      return n;
    const i = b.findClosest(e, "[data-lightbox-container]");
    return i || (e.hasAttribute("data-lightbox-image") ? e : null);
  }
  findContainerElementFromModal(e) {
    const n = e.id.replace("-lightbox-modal", "");
    let i = document.querySelector(`[data-file-upload-id="${n}"]`);
    return i || (i = document.querySelector(`[data-gallery-id="${n}"]`), i) || (i = document.getElementById(n), i) ? i : null;
  }
  addImage(e, t) {
    const n = this.getState(e);
    n && (n.images.push(t), this.setState(e, n));
  }
  addImages(e, t) {
    const n = this.getState(e);
    n && (n.images.push(...t), this.setState(e, n));
  }
  setImages(e, t) {
    const n = this.getState(e);
    n && (n.images = t, this.setState(e, n));
  }
  removeImage(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = n.images.findIndex((s) => s.id === t);
    i !== -1 && (n.images.splice(i, 1), n.currentImageIndex >= n.images.length && (n.currentImageIndex = Math.max(0, n.images.length - 1)), this.setState(e, n), n.images.length === 0 && n.isOpen && this.closeLightbox());
  }
  destroy() {
    this.cleanupFunctions.forEach((e) => e()), this.cleanupFunctions = [], this.currentModal && (this.currentModal.close(), this.currentModal = null), super.destroy();
  }
}
class jh extends ee {
  constructor() {
    super(), this.lightboxActions = Sa.getInstance(), this.init();
  }
  /**
   * Initialize gallery elements - required by BaseActionClass
   */
  initializeElements() {
    b.findByDataAttribute("gallery", "true").forEach((e) => {
      this.initializeGallery(e);
    });
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedKeydown('[data-gallery="true"]', (e, t) => {
      const n = e.dataset.galleryId;
      n && this.handleKeyboardNavigation(t, n, e);
    });
  }
  /**
   * Extract image data from gallery DOM elements
   *
   * Scans all gallery slides and extracts image metadata for state management.
   * Looks for data attributes (caption, title, description) on img elements.
   *
   * @param galleryElement - The gallery container element
   * @returns Array of GalleryImage objects with extracted metadata
   */
  extractImageData(e) {
    const t = [];
    return e.querySelectorAll("[data-gallery-slide]").forEach((i, s) => {
      const a = i.querySelector("img");
      a && t.push({
        id: i.getAttribute("data-gallery-slide") || `img-${s}`,
        src: a.src,
        alt: a.alt || `Image ${s + 1}`,
        caption: a.getAttribute("data-caption"),
        thumbnail: a.src,
        title: a.getAttribute("data-title"),
        description: a.getAttribute("data-description")
      });
    }), t;
  }
  /**
   * Initialize a single gallery element
   */
  initializeGallery(e) {
    const t = e.dataset.galleryId;
    if (!t) return;
    const n = parseInt(e.dataset.totalImages || "0"), i = this.extractImageData(e);
    this.setState(e, {
      currentIndex: 0,
      isAutoplayActive: e.dataset.autoplay === "true",
      autoplayInterval: null,
      touchStartX: 0,
      touchEndX: 0,
      isDragging: !1,
      totalImages: n,
      images: i
    }), this.setupGalleryEventListeners(e, t), e.dataset.autoplay === "true" && this.startAutoplay(t, e), this.updateAccessibility(e, t), this.initializeImageErrorHandling(e), this.preloadAdjacentImages(e, 0);
  }
  /**
   * Set up event listeners for gallery interactions
   */
  setupGalleryEventListeners(e, t) {
    const n = e.querySelector('[data-gallery-action="prev"]'), i = e.querySelector('[data-gallery-action="next"]');
    n && T.addEventListener(n, "click", () => {
      this.navigateToImage(t, e, "prev");
    }), i && T.addEventListener(i, "click", () => {
      this.navigateToImage(t, e, "next");
    }), e.querySelectorAll("[data-gallery-thumbnail]").forEach((o, l) => {
      T.addEventListener(o, "click", () => {
        this.goToImage(t, e, l);
      }), T.addEventListener(o, "keydown", (c) => {
        const d = c;
        (d.key === "Enter" || d.key === " ") && (d.preventDefault(), this.goToImage(t, e, l));
      });
    });
    const a = e.querySelector('[data-gallery-action="toggle-autoplay"]');
    a && T.addEventListener(a, "click", () => {
      this.toggleAutoplay(t, e);
    }), this.setupTouchEvents(e, t), T.addEventListener(e, "mouseenter", () => {
      this.pauseAutoplayOnHover(t);
    }), T.addEventListener(e, "mouseleave", () => {
      this.resumeAutoplayOnHover(t, e);
    });
  }
  /**
   * Set up touch/swipe event listeners (simplified for scroll-based navigation)
   */
  setupTouchEvents(e, t) {
    const n = e.querySelector(".gallery-scroll-container");
    n && (T.addEventListener(n, "scroll", () => {
      this.updateCurrentIndexFromScroll(e, n);
    }), T.addEventListener(n, "touchstart", (i) => {
      const s = i, a = this.getState(e);
      a && (a.touchStartX = s.touches[0].clientX, this.setState(e, a));
    }), T.addEventListener(n, "touchmove", (i) => {
      const s = i, a = this.getState(e);
      if (!a || !s.touches[0]) return;
      const o = s.touches[0].clientX, l = s.touches[0].clientY;
      a.touchStartY || (a.touchStartY = l);
      const c = Math.abs(o - a.touchStartX), d = Math.abs(l - a.touchStartY);
      c > 10 && c > d && i.preventDefault(), this.setState(e, a);
    }));
  }
  /**
   * Update current index based on scroll position
   *
   * Calculates which slide is closest to the center of the viewport during scroll.
   * Updates gallery state and UI elements (thumbnails, counter) when the centered slide changes.
   * Used for scroll-snap navigation to keep UI in sync with scroll position.
   *
   * @param galleryElement - The gallery container element
   * @param scrollContainer - The scrollable container with gallery slides
   */
  updateCurrentIndexFromScroll(e, t) {
    const n = t.querySelectorAll(".gallery-slide");
    if (n.length === 0) return;
    const i = t.getBoundingClientRect(), s = i.left + i.width / 2;
    let a = 0, o = 1 / 0;
    n.forEach((c, d) => {
      const f = c.getBoundingClientRect(), h = f.left + f.width / 2, g = Math.abs(h - s);
      g < o && (o = g, a = d);
    });
    const l = this.getState(e);
    l && l.currentIndex !== a && (l.currentIndex = a, this.setState(e, l), this.updateThumbnails(e, a), this.updateCounter(e, a));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e, t, n) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault(), this.navigateToImage(t, n, "prev");
        break;
      case "ArrowRight":
        e.preventDefault(), this.navigateToImage(t, n, "next");
        break;
      case "Home":
        e.preventDefault(), this.goToImage(t, n, 0);
        break;
      case "End":
        e.preventDefault();
        const i = this.getState(n);
        i && this.goToImage(t, n, i.totalImages - 1);
        break;
      case "Escape":
        e.preventDefault(), this.handleEscapeKey(t, n);
        break;
      case " ":
      case "Spacebar":
        e.preventDefault(), this.toggleAutoplay(t, n);
        break;
      case "Enter":
        const s = e.target;
        if (s.hasAttribute("data-gallery-thumbnail")) {
          e.preventDefault();
          const a = parseInt(s.getAttribute("data-gallery-thumbnail") || "0");
          this.goToImage(t, n, a);
        }
        break;
    }
  }
  /**
   * Handle escape key with proper lightbox and autoplay logic
   */
  handleEscapeKey(e, t) {
    const n = t.dataset.lightbox === "true", i = this.getState(t);
    n ? this.closeLightbox(t) : i != null && i.isAutoplayActive && this.pauseAutoplay(e, t), this.announceAction(t, "Gallery navigation closed");
  }
  /**
   * Close lightbox using the unified LightboxActions
   */
  closeLightbox(e) {
    const t = this.lightboxActions.getState(e);
    t && t.isOpen && (this.emitGalleryEvent(e, "gallery:lightboxClose", {}), this.announceAction(e, "Lightbox closed"));
  }
  /**
   * Announce actions to screen readers
   */
  announceAction(e, t) {
    const n = e.querySelector("[data-gallery-live]");
    n && (n.textContent = t, setTimeout(() => {
      n.textContent === t && (n.textContent = "");
    }, 1e3));
  }
  /**
   * Navigate to previous or next image
   */
  navigateToImage(e, t, n) {
    const i = this.getState(t);
    if (!i) return;
    const s = parseInt(t.dataset.totalImages || "0"), a = t.dataset.loop === "true";
    let o = i.currentIndex;
    n === "next" ? (o = i.currentIndex + 1, o >= s && (o = a ? 0 : s - 1)) : (o = i.currentIndex - 1, o < 0 && (o = a ? s - 1 : 0)), this.goToImage(e, t, o);
  }
  /**
   * Go to a specific image by index
   */
  goToImage(e, t, n) {
    const i = this.getState(t);
    if (!i) return;
    const s = parseInt(t.dataset.totalImages || "0");
    n < 0 || n >= s || (i.currentIndex = n, this.setState(t, i), this.updateImageDisplay(t, n), this.updateThumbnails(t, n), this.updateCounter(t, n), this.updateImageDetails(t, n), this.updateNavigationButtons(t, n, s), this.updateAccessibility(t, e), this.announceImageChange(t, n, s), this.preloadAdjacentImages(t, n), this.emitGalleryEvent(t, "gallery:imageChanged", {
      currentIndex: n,
      galleryId: e
    }));
  }
  /**
   * Update image display using container-only scrolling (no page scroll hijacking)
   */
  updateImageDisplay(e, t) {
    const n = e.querySelector(".gallery-scroll-container");
    if (!n) return;
    const s = n.offsetWidth * t;
    n.scrollTo({
      left: s,
      behavior: "smooth"
    }), n.querySelectorAll(".gallery-slide").forEach((o, l) => {
      const c = o;
      l === t ? (c.classList.add("active"), c.setAttribute("aria-current", "true")) : (c.classList.remove("active"), c.removeAttribute("aria-current"));
    });
  }
  /**
   * Update thumbnail highlighting
   */
  updateThumbnails(e, t) {
    e.querySelectorAll(".gallery-thumbnail").forEach((i, s) => {
      const a = i;
      s === t ? (a.classList.add("active", "border-brand-500"), a.classList.remove("border-transparent"), a.setAttribute("aria-current", "true")) : (a.classList.remove("active", "border-brand-500"), a.classList.add("border-transparent"), a.removeAttribute("aria-current"));
    });
  }
  /**
   * Update image counter
   */
  updateCounter(e, t) {
    const n = e.querySelector("[data-gallery-current]");
    n && (n.textContent = (t + 1).toString());
  }
  /**
   * Update image details for ecommerce type
   */
  updateImageDetails(e, t) {
    e.querySelector("[data-gallery-title]"), e.querySelector("[data-gallery-description]");
  }
  /**
   * Update navigation button states
   */
  updateNavigationButtons(e, t, n) {
    const i = e.querySelector('[data-gallery-action="prev"]'), s = e.querySelector('[data-gallery-action="next"]'), a = e.dataset.loop === "true";
    i && (i.disabled = !a && t === 0), s && (s.disabled = !a && t === n - 1);
  }
  /**
   * Start autoplay with scroll-based navigation
   */
  startAutoplay(e, t) {
    const n = this.getState(t);
    if (!n) return;
    const i = parseInt(t.dataset.autoplayDelay || "3000");
    n.autoplayInterval = window.setInterval(() => {
      this.navigateToImageWithScroll(e, t, "next");
    }, i), n.isAutoplayActive = !0, this.setState(t, n), this.updateAutoplayButton(t, !0);
  }
  /**
   * Navigate using scroll-based approach
   */
  navigateToImageWithScroll(e, t, n) {
    const i = this.getState(t);
    if (!i) return;
    const s = parseInt(t.dataset.totalImages || "0"), a = t.dataset.loop === "true";
    let o = i.currentIndex;
    n === "next" ? (o = i.currentIndex + 1, o >= s && (o = a ? 0 : s - 1)) : (o = i.currentIndex - 1, o < 0 && (o = a ? s - 1 : 0)), this.goToImage(e, t, o);
  }
  /**
   * Pause autoplay
   */
  pauseAutoplay(e, t) {
    const n = this.getState(t);
    n && (n.autoplayInterval && (clearInterval(n.autoplayInterval), n.autoplayInterval = null), n.isAutoplayActive = !1, this.setState(t, n), this.updateAutoplayButton(t, !1));
  }
  /**
   * Toggle autoplay
   */
  toggleAutoplay(e, t) {
    const n = this.getState(t);
    n && (n.isAutoplayActive ? this.pauseAutoplay(e, t) : this.startAutoplay(e, t));
  }
  /**
   * Update autoplay button state using Button component's multi-state functionality
   */
  updateAutoplayButton(e, t) {
    const n = e.querySelector(".gallery-autoplay-toggle");
    if (n) {
      n.setAttribute("aria-pressed", t.toString()), n.setAttribute("aria-label", t ? "Pause autoplay" : "Resume autoplay");
      const i = n.querySelector(".button-icon-default"), s = n.querySelector(".button-icon-toggle");
      i && s && (t ? (i.classList.remove("opacity-0"), i.classList.add("opacity-100"), s.classList.remove("opacity-100"), s.classList.add("opacity-0")) : (i.classList.remove("opacity-100"), i.classList.add("opacity-0"), s.classList.remove("opacity-0"), s.classList.add("opacity-100")));
    }
  }
  /**
   * Pause autoplay on hover
   */
  pauseAutoplayOnHover(e) {
    const t = document.querySelector(`[data-gallery-id="${e}"]`);
    if (!t) return;
    const n = this.getState(t);
    !(n != null && n.isAutoplayActive) || !n.autoplayInterval || (clearInterval(n.autoplayInterval), n.autoplayInterval = null, this.setState(t, n));
  }
  /**
   * Resume autoplay when hover ends
   */
  resumeAutoplayOnHover(e, t) {
    const n = this.getState(t);
    if (!(n != null && n.isAutoplayActive) || n.autoplayInterval) return;
    const i = parseInt(t.dataset.autoplayDelay || "3000");
    n.autoplayInterval = window.setInterval(() => {
      this.navigateToImage(e, t, "next");
    }, i), this.setState(t, n);
  }
  /**
   * Update accessibility attributes
   */
  updateAccessibility(e, t) {
    const n = this.getState(e);
    if (!n) return;
    const i = parseInt(e.dataset.totalImages || "0"), s = e.querySelector(`[data-gallery-slide="${n.currentIndex}"]`);
    s && (s.setAttribute("aria-current", "true"), s.setAttribute("aria-label", `Image ${n.currentIndex + 1} of ${i}`)), e.querySelectorAll("[data-gallery-slide]").forEach((o, l) => {
      l !== n.currentIndex && o.removeAttribute("aria-current");
    });
  }
  /**
   * Emit custom gallery events
   */
  emitGalleryEvent(e, t, n) {
    const i = new CustomEvent(t, { detail: n, bubbles: !0 });
    e.dispatchEvent(i);
  }
  /**
   * Announce image change to screen readers
   */
  announceImageChange(e, t, n) {
    const i = e.querySelector("[data-gallery-live]");
    if (i) {
      const a = e.querySelectorAll("[data-gallery-slide]")[t], o = a == null ? void 0 : a.querySelector("img"), c = `Showing ${(o == null ? void 0 : o.getAttribute("alt")) || `Image ${t + 1}`}, image ${t + 1} of ${n}`;
      i.textContent = c, setTimeout(() => {
        i.textContent === c && (i.textContent = "");
      }, 1e3);
    }
  }
  /**
   * Initialize error handling for gallery images
   */
  initializeImageErrorHandling(e) {
    e.querySelectorAll(".gallery-slide img").forEach((i) => {
      const s = i;
      s.complete || this.setImageLoadingState(s, !0), s.addEventListener("load", () => {
        this.setImageLoadingState(s, !1), this.setImageErrorState(s, !1);
      }), s.addEventListener("error", () => {
        this.setImageLoadingState(s, !1), this.setImageErrorState(s, !0), this.handleImageError(s, e), console.warn(`Failed to load gallery image: ${s.src}`);
      });
    }), e.querySelectorAll(".gallery-thumbnail img").forEach((i) => {
      const s = i;
      s.addEventListener("error", () => {
        this.setThumbnailErrorState(s, !0), console.warn(`Failed to load gallery thumbnail: ${s.src}`);
      });
    });
  }
  /**
   * Set loading state for an image
   */
  setImageLoadingState(e, t) {
    const n = e.closest(".gallery-slide");
    n && (t ? (n.classList.add("gallery-image-loading"), n.setAttribute("aria-busy", "true")) : (n.classList.remove("gallery-image-loading"), n.removeAttribute("aria-busy")));
  }
  /**
   * Set error state for an image
   */
  setImageErrorState(e, t) {
    const n = e.closest(".gallery-slide");
    if (n)
      if (t)
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
  setThumbnailErrorState(e, t) {
    const n = e.closest(".gallery-thumbnail");
    n && t && (n.classList.add("gallery-thumbnail-error"), e.style.display = "none", n.querySelector(".gallery-thumbnail-error-placeholder") || this.createThumbnailErrorPlaceholder(n));
  }
  /**
   * Create error placeholder for main images
   */
  createImageErrorPlaceholder(e) {
    const t = document.createElement("div");
    t.className = "gallery-error-placeholder absolute inset-0 flex items-center justify-center bg-surface border border-border rounded-lg", t.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 text-muted opacity-50">
                    <svg xmlns="http:
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
                <p class="text-sm text-muted">Image failed to load</p>
            </div>
        `, e.appendChild(t);
  }
  /**
   * Create error placeholder for thumbnail images
   */
  createThumbnailErrorPlaceholder(e) {
    const t = document.createElement("div");
    t.className = "gallery-thumbnail-error-placeholder absolute inset-0 flex items-center justify-center bg-surface border border-border rounded text-muted", t.innerHTML = `
            <svg xmlns="http:
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        `, e.appendChild(t);
  }
  /**
   * Preload adjacent images for smoother transitions
   */
  preloadAdjacentImages(e, t) {
    const n = parseInt(e.dataset.totalImages || "0"), i = e.dataset.loop === "true", s = [], a = t - 1;
    a >= 0 ? s.push(a) : i && n > 1 && s.push(n - 1);
    const o = t + 1;
    o < n ? s.push(o) : i && n > 1 && s.push(0), s.forEach((l) => {
      const c = e.querySelector(`[data-gallery-slide="${l}"]`);
      if (c) {
        const d = c.querySelector("img");
        if (d && d.src && !d.complete) {
          const f = new Image();
          f.src = d.src, f.onerror = () => {
            console.warn(`Failed to preload image: ${f.src}`);
          };
        }
      }
    });
  }
  /**
   * Handle image load errors with retry logic
   */
  handleImageError(e, t) {
    const n = parseInt(e.dataset.retryCount || "0");
    n < 2 ? (e.dataset.retryCount = (n + 1).toString(), setTimeout(() => {
      const s = e.src;
      e.src = "", e.src = s + "?retry=" + n;
    }, 1e3 * (n + 1))) : (this.checkGalleryHealth(t), this.announceAction(t, "Image failed to load"));
  }
  /**
   * Check if gallery has too many failed images
   */
  checkGalleryHealth(e) {
    const t = e.querySelectorAll(".gallery-slide img").length;
    e.querySelectorAll(".gallery-image-error").length > t / 2 && this.setGalleryErrorState(e, !0);
  }
  /**
   * Set error state for entire gallery
   */
  setGalleryErrorState(e, t) {
    t ? (e.classList.add("gallery-has-errors"), this.announceAction(e, "Gallery has loading issues. Some images may not be available.")) : e.classList.remove("gallery-has-errors");
  }
  /**
   * Clean up when gallery is removed
   */
  cleanup(e) {
    const t = document.querySelector(`[data-gallery-id="${e}"]`);
    if (!t) return;
    const n = this.getState(t);
    n != null && n.autoplayInterval && clearInterval(n.autoplayInterval), this.removeState(t);
  }
}
class Tc {
  constructor() {
    console.log("PopoverActions: Using native HTML Popover API"), this.init();
  }
  init() {
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => this.wirePopovers()) : this.wirePopovers();
  }
  wirePopovers() {
    document.querySelectorAll("[data-popover-trigger]").forEach((t) => {
      const n = t.getAttribute("data-popover-trigger");
      if (!n) return;
      const i = document.getElementById(n);
      if (!i) return;
      const s = t.querySelector('button, a, [role="button"]');
      s && (s.addEventListener("click", (a) => {
        a.preventDefault(), i.matches(":popover-open") ? i.hidePopover() : i.showPopover();
      }), console.log(`[PopoverActions] Wired click listener for popover: ${n}`));
    });
  }
}
new Tc();
class Uh extends ee {
  constructor() {
    super(...arguments), this.failedUrls = /* @__PURE__ */ new Set(), this.DEFAULT_MAX_RETRIES = 2, this.RETRY_DELAY = 1e3;
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
  }
  /**
   * Set up dynamic observer for newly added images
   */
  setupDynamicObserver() {
    this.createDynamicObserver((e) => {
      e.forEach((t) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
          const n = t;
          n.hasAttribute("data-keys-image") && this.initializeImage(n), n.querySelectorAll('[data-keys-image="true"]').forEach((s) => {
            this.initializeImage(s);
          });
        }
      });
    });
  }
  /**
   * Initialize image elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll('[data-keys-image="true"]').forEach((t) => {
      this.initializeImage(t);
    });
  }
  /**
   * Initialize a single image element
   */
  initializeImage(e) {
    const t = e.querySelector("img"), n = e.querySelector('[data-image-fallback="true"]');
    if (!t)
      return;
    const i = e.getAttribute("data-fallback-icon") || "heroicon-o-photo", s = e.getAttribute("data-fallback-text") || "Image placeholder", a = parseInt(e.getAttribute("data-retry-attempts") || "2", 10), o = e.hasAttribute("data-lightbox"), l = {
      element: e,
      img: t,
      fallbackContainer: n,
      fallbackIcon: i,
      fallbackText: s,
      retryCount: 0,
      maxRetries: Math.max(0, Math.min(a, 5)),
      isLoading: !1,
      hasFailed: !1,
      hasLightbox: o
    };
    this.setState(e, l), this.setupImageErrorHandling(l), t.complete && !t.naturalWidth && this.handleImageError(l);
  }
  /**
   * Set up error handling for image
   */
  setupImageErrorHandling(e) {
    e.img && (T.addEventListener(e.img, "error", () => {
      this.handleImageError(e);
    }), T.addEventListener(e.img, "load", () => {
      this.handleImageLoad(e);
    }), e.img.loading === "lazy" && this.setupLazyLoadingSupport(e));
  }
  /**
   * Handle image load error with retry logic
   *
   * Implements progressive retry strategy with exponential backoff.
   * Tracks failed URLs globally to avoid repeated retry attempts.
   * Falls back to placeholder icon after max retries exceeded.
   *
   * @param state - Current image component state
   */
  handleImageError(e) {
    if (!e.img || e.hasFailed) return;
    const t = e.img.src;
    if (this.failedUrls.add(t), e.retryCount < e.maxRetries && !this.isKnownFailedUrl(t)) {
      this.retryImageLoad(e);
      return;
    }
    e.hasFailed = !0, this.showFallback(e);
  }
  /**
   * Handle successful image load
   */
  handleImageLoad(e) {
    if (!e.img) return;
    const t = e.img.src;
    this.failedUrls.delete(t), e.hasFailed = !1, e.retryCount = 0, e.isLoading = !1, this.showImage(e);
  }
  /**
   * Retry loading the image after a delay
   */
  retryImageLoad(e) {
    !e.img || e.retryCount >= e.maxRetries || (e.retryCount++, e.isLoading = !0, e.element.setAttribute("data-image-loading", "true"), setTimeout(() => {
      if (!e.img || e.hasFailed) return;
      const t = e.img.src;
      e.img.src = "", requestAnimationFrame(() => {
        e.img && (e.img.src = t);
      });
    }, this.RETRY_DELAY * e.retryCount));
  }
  /**
   * Show the fallback placeholder using existing styled template structure
   */
  showFallback(e) {
    e.img && (e.img.style.display = "none", e.fallbackContainer && (e.fallbackContainer.style.display = "flex"), e.element.setAttribute("data-fallback-active", "true"), e.element.removeAttribute("data-image-active"), e.element.removeAttribute("data-image-loading"), e.hasLightbox && this.disableLightbox(e), this.updateAccessibility(e, "fallback"), this.dispatchImageEvent(e.element, "fallback", {
      fallbackIcon: e.fallbackIcon,
      fallbackText: e.fallbackText,
      originalSrc: e.img.src
    }));
  }
  /**
   * Show the image (hide fallback) using existing template structure
   */
  showImage(e) {
    e.img && (e.img.style.display = "block", e.fallbackContainer && (e.fallbackContainer.style.display = "none"), e.element.setAttribute("data-image-active", "true"), e.element.removeAttribute("data-fallback-active"), e.element.removeAttribute("data-image-loading"), e.hasLightbox && this.enableLightbox(e), this.updateAccessibility(e, "image"), this.dispatchImageEvent(e.element, "imageLoad", {
      src: e.img.src
    }));
  }
  /**
   * Set up lazy loading support
   */
  setupLazyLoadingSupport(e) {
    if (!e.img || !("IntersectionObserver" in window)) return;
    const t = new IntersectionObserver((n) => {
      n.forEach((i) => {
        i.isIntersecting && t.unobserve(i.target);
      });
    }, {
      rootMargin: "50px"
    });
    t.observe(e.img);
  }
  /**
   * Update accessibility attributes based on current state
   */
  updateAccessibility(e, t) {
    var i;
    const n = (i = e.img) == null ? void 0 : i.getAttribute("alt");
    t === "fallback" ? (e.element.setAttribute("aria-label", e.fallbackText), e.img && (e.img.setAttribute("alt", ""), e.img.setAttribute("aria-hidden", "true"))) : t === "image" && n && (e.element.removeAttribute("aria-label"), e.img && (e.img.setAttribute("alt", n), e.img.removeAttribute("aria-hidden")));
  }
  /**
   * Disable lightbox functionality for fallback state
   */
  disableLightbox(e) {
    e.element.removeAttribute("role"), e.element.removeAttribute("tabindex"), e.element.style.cursor = "default", e.element.getAttribute("data-lightbox-trigger") && e.element.setAttribute("data-lightbox-disabled", "true");
  }
  /**
   * Enable lightbox functionality for image state
   */
  enableLightbox(e) {
    e.hasLightbox && (e.element.setAttribute("role", "button"), e.element.setAttribute("tabindex", "0"), e.element.style.cursor = "pointer", e.element.removeAttribute("data-lightbox-disabled"));
  }
  /**
   * Check if URL is known to be failed
   */
  isKnownFailedUrl(e) {
    return this.failedUrls.has(e);
  }
  /**
   * Dispatch custom image events
   */
  dispatchImageEvent(e, t, n = {}) {
    const i = new CustomEvent(`image:${t}`, {
      detail: {
        element: e,
        ...n
      },
      bubbles: !0
    });
    e.dispatchEvent(i);
  }
  /**
   * Public method to manually trigger fallback for an image
   */
  triggerFallback(e) {
    const t = this.getState(e);
    t && !t.hasFailed && this.handleImageError(t);
  }
  /**
   * Public method to retry loading an image
   */
  retryImage(e) {
    const t = this.getState(e);
    t && t.hasFailed && t.img && (t.hasFailed = !1, t.retryCount = 0, this.handleImageLoad(t));
  }
  /**
   * Public method to check if an image has failed
   */
  hasImageFailed(e) {
    const t = this.getState(e);
    return t ? t.hasFailed : !1;
  }
  /**
   * Clear failed URLs cache (useful for network recovery scenarios)
   */
  clearFailedUrlsCache() {
    this.failedUrls.clear();
  }
  /**
   * Get image loading state
   */
  isImageLoading(e) {
    const t = this.getState(e);
    return t ? t.isLoading : !1;
  }
  /**
   * Force reload an image (useful for updating dynamic sources)
   */
  reloadImage(e, t) {
    const n = this.getState(e);
    if (n && n.img)
      if (t)
        n.img.src = t;
      else {
        const i = n.img.src;
        n.img.src = "", requestAnimationFrame(() => {
          n.img && (n.img.src = i);
        });
      }
  }
}
class Hh extends ee {
  constructor() {
    super(...arguments), this.chartStates = /* @__PURE__ */ new Map(), this.outsideClickHandlers = /* @__PURE__ */ new WeakMap();
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
  }
  /**
   * Initialize chart elements - required by BaseActionClass
   */
  initializeElements() {
    b.querySelectorAll('[data-keys-chart="true"]').forEach((t) => {
      this.initializeChart(t);
    });
  }
  /**
   * Initialize a single chart element
   */
  initializeChart(e) {
    const t = e.getAttribute("data-interactive") === "true", n = e.getAttribute("data-animated") === "true", i = Array.from(e.querySelectorAll('[data-chart-item="true"]')), s = {
      element: e,
      isInteractive: t,
      isAnimated: n,
      dataItems: i,
      activeClickedItem: void 0,
      tooltipPinned: !1
    };
    this.chartStates.set(e, s), t && i.length > 0 && this.setupInteractiveEvents(s), this.setupKeyboardNavigation(s), this.setupOutsideClickHandler(s), n && this.triggerAnimations(s);
  }
  /**
   * Set up interactive event listeners for chart data items
   */
  setupInteractiveEvents(e) {
    e.dataItems.forEach((t, n) => {
      t.addEventListener("mouseenter", (i) => {
        const s = i.target;
        (!e.tooltipPinned || e.activeClickedItem === s) && this.showTooltip(e, s);
      }), t.addEventListener("mouseleave", () => {
        e.tooltipPinned || this.hideTooltip(e);
      }), t.addEventListener("click", (i) => {
        this.handleDataItemClick(e, i.target);
      });
    });
  }
  /**
   * Set up keyboard navigation for chart accessibility
   */
  setupKeyboardNavigation(e) {
    if (!e.isInteractive || e.dataItems.length === 0)
      return;
    const t = e.dataItems[0];
    if (t) {
      t.setAttribute("tabindex", "0"), t.setAttribute("role", "button");
      const n = t.getAttribute("data-label") || "", i = t.getAttribute("data-value") || "";
      t.setAttribute("aria-label", `${n}: ${i}`);
    }
    e.dataItems.forEach((n, i) => {
      if (!n.getAttribute("aria-label")) {
        const a = n.getAttribute("data-label") || "", o = n.getAttribute("data-value") || "";
        n.setAttribute("aria-label", `${a}: ${o}`);
      }
      n.addEventListener("keydown", (a) => {
        this.handleKeyboardNavigation(e, a, i);
      });
    });
  }
  /**
   * Set up outside click handler for pinned tooltips
   */
  setupOutsideClickHandler(e) {
    const t = (n) => {
      const i = n.target;
      e.tooltipPinned && !e.element.contains(i) && (this.hideTooltip(e), e.tooltipPinned = !1, e.activeClickedItem = void 0);
    };
    this.outsideClickHandlers.set(e.element, t), document.addEventListener("click", t);
  }
  /**
   * Clean up event listeners for a chart (prevents memory leaks)
   */
  destroyChart(e) {
    const t = this.outsideClickHandlers.get(e);
    t && (document.removeEventListener("click", t), this.outsideClickHandlers.delete(e)), this.chartStates.delete(e);
  }
  /**
   * Handle keyboard navigation between chart data items
   */
  handleKeyboardNavigation(e, t, n) {
    let i = -1;
    switch (t.key) {
      case "ArrowRight":
      case "ArrowDown":
        i = (n + 1) % e.dataItems.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        i = n === 0 ? e.dataItems.length - 1 : n - 1;
        break;
      case "Home":
        i = 0;
        break;
      case "End":
        i = e.dataItems.length - 1;
        break;
      case "Enter":
      case " ":
        this.handleDataItemClick(e, t.target), t.preventDefault();
        return;
    }
    i !== -1 && (t.preventDefault(), this.focusDataItem(e, i));
  }
  /**
   * Focus on a specific data item
   */
  focusDataItem(e, t) {
    e.dataItems.forEach((i) => {
      i.setAttribute("tabindex", "-1");
    });
    const n = e.dataItems[t];
    n && (n.setAttribute("tabindex", "0"), n.focus());
  }
  /**
   * Show tooltip for chart item on hover
   */
  showTooltip(e, t) {
    const n = this.extractItemData(t);
    if (!n) return;
    let i = e.element.querySelector("[data-chart-tooltip]");
    i || (i = this.createTooltip(e));
    const s = t.hasAttribute("data-chart-pie-slice");
    let a;
    if (s) {
      const o = t.getAttribute("data-percentage") || "0";
      a = `${n.label}: ${this.formatTooltipValue(n.value)} (${o}%)`;
    } else
      a = `${n.label}: ${this.formatTooltipValue(n.value)}`;
    i.textContent = a, this.positionTooltip(i, t), i.style.opacity = "1", i.style.pointerEvents = "none";
  }
  /**
   * Hide tooltip
   */
  hideTooltip(e) {
    const t = e.element.querySelector("[data-chart-tooltip]");
    t && (t.style.opacity = "0");
  }
  /**
   * Create tooltip element
   */
  createTooltip(e) {
    const t = document.createElement("div");
    return t.setAttribute("data-chart-tooltip", "true"), t.className = "chart-tooltip absolute px-2 py-1 text-xs font-medium pointer-events-none opacity-0 transition-opacity duration-200", e.element.appendChild(t), t;
  }
  /**
   * Position tooltip relative to chart item
   */
  positionTooltip(e, t) {
    var o;
    const n = t.getBoundingClientRect(), i = ((o = e.offsetParent) == null ? void 0 : o.getBoundingClientRect()) || { left: 0, top: 0 }, s = n.left - i.left + n.width / 2 - e.offsetWidth / 2, a = n.top - i.top - e.offsetHeight - 8;
    e.style.left = `${Math.max(0, s)}px`, e.style.top = `${Math.max(0, a)}px`;
  }
  /**
   * Format tooltip value for display
   */
  formatTooltipValue(e) {
    const t = parseFloat(e);
    return isNaN(t) ? e : t.toLocaleString();
  }
  /**
   * Extract data from chart item element for click handling
   */
  extractItemData(e) {
    const t = e.getAttribute("data-index"), n = e.getAttribute("data-value"), i = e.getAttribute("data-label");
    return t === null || n === null || i === null ? null : {
      index: parseInt(t),
      value: n,
      label: i
    };
  }
  /**
   * Handle click events on chart data items
   */
  handleDataItemClick(e, t) {
    const n = this.extractItemData(t);
    if (!n) return;
    e.activeClickedItem === t && e.tooltipPinned ? (this.hideTooltip(e), e.tooltipPinned = !1, e.activeClickedItem = void 0) : (this.showTooltip(e, t), e.tooltipPinned = !0, e.activeClickedItem = t), t.blur();
    const i = new CustomEvent("chart:item:click", {
      detail: {
        ...n,
        element: t,
        chart: e.element
      },
      bubbles: !0,
      cancelable: !0
    });
    e.element.dispatchEvent(i), "Livewire" in window && T.dispatchLivewireEvent(e.element, "chart-item-clicked", {
      index: n.index,
      value: n.value,
      label: n.label
    });
  }
  /**
   * Trigger chart animations
   * Note: Animations are now handled by CSS @keyframes with animation-delay attributes
   * This method dispatches the animation complete event for framework integration
   */
  triggerAnimations(e) {
    const i = e.dataItems.length * 100 + 800;
    setTimeout(() => {
      const s = new CustomEvent("chart:animation:complete", {
        detail: { chart: e.element },
        bubbles: !0
      });
      e.element.dispatchEvent(s);
    }, i);
  }
  /**
   * Public API: Refresh chart (useful for dynamic data updates)
   */
  refreshChart(e) {
    const t = this.chartStates.get(e);
    t && (t.dataItems = Array.from(e.querySelectorAll('[data-chart-item="true"]')), t.isInteractive && this.setupInteractiveEvents(t), t.isAnimated && this.triggerAnimations(t));
  }
  /**
   * Public API: Update chart data (for dynamic charts)
   */
  updateChartData(e, t) {
    const n = new CustomEvent("chart:data:update", {
      detail: { chart: e, data: t },
      bubbles: !0
    });
    e.dispatchEvent(n);
  }
}
class cm extends ee {
  constructor(e) {
    super(e), this.colorInput = null, this.textInput = null, this.isUpdating = !1, this.boundHandleColorInput = null, this.boundHandleTextInput = null, this.boundHandleTextBlur = null, this.boundHandleKeydown = null, this.initializeInputs(), this.setupEventListeners();
  }
  /**
   * Initialize color and text input elements
   */
  initializeInputs() {
    if (this.colorInput = b.querySelector("[data-color-input]", this.element), this.textInput = b.querySelector("[data-text-input]", this.element), !this.colorInput || !this.textInput) {
      console.warn("ColorPicker: Required input elements not found");
      return;
    }
  }
  /**
   * Setup event listeners for both inputs
   */
  setupEventListeners() {
    !this.colorInput || !this.textInput || (this.boundHandleColorInput = this.handleColorInput.bind(this), this.boundHandleTextInput = this.handleTextInput.bind(this), this.boundHandleTextBlur = this.handleTextBlur.bind(this), this.boundHandleKeydown = this.handleKeydown.bind(this), this.colorInput.addEventListener("input", this.boundHandleColorInput), this.textInput.addEventListener("input", this.boundHandleTextInput), this.textInput.addEventListener("blur", this.boundHandleTextBlur), this.textInput.addEventListener("keydown", this.boundHandleKeydown));
  }
  /**
   * Handle color picker input changes
   */
  handleColorInput(e) {
    if (this.isUpdating || !this.colorInput || !this.textInput) return;
    const n = e.target.value.toUpperCase();
    this.isUpdating = !0, this.textInput.value = n, this.dispatchChangeEvent(this.colorInput), this.isUpdating = !1;
  }
  /**
   * Handle text input changes
   */
  handleTextInput(e) {
    if (this.isUpdating || !this.colorInput || !this.textInput) return;
    const n = e.target.value;
    this.isValidHexColor(n) && (this.isUpdating = !0, this.colorInput.value = n.toUpperCase(), this.isUpdating = !1);
  }
  /**
   * Handle text input blur - validate and correct format
   */
  handleTextBlur(e) {
    if (!this.colorInput || !this.textInput) return;
    let n = e.target.value.trim();
    n.length > 0 && !n.startsWith("#") && (n = "#" + n), this.isValidHexColor(n) ? (n = n.toUpperCase(), this.isUpdating = !0, this.textInput.value = n, this.colorInput.value = n, this.dispatchChangeEvent(this.colorInput), this.isUpdating = !1) : n !== "" && (this.isUpdating = !0, this.textInput.value = this.colorInput.value, this.isUpdating = !1);
  }
  /**
   * Handle keyboard events
   */
  handleKeydown(e) {
    this.colorInput && e.key === "Enter" && (e.preventDefault(), this.colorInput.focus(), this.colorInput.click());
  }
  /**
   * Validate hex color format
   */
  isValidHexColor(e) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(e);
  }
  /**
   * Dispatch change event for form integration
   */
  dispatchChangeEvent(e) {
    const t = new Event("change", { bubbles: !0 });
    e.dispatchEvent(t);
  }
  /**
   * Cleanup method - properly removes event listeners using stored references
   */
  destroy() {
    this.colorInput && this.boundHandleColorInput && this.colorInput.removeEventListener("input", this.boundHandleColorInput), this.textInput && (this.boundHandleTextInput && this.textInput.removeEventListener("input", this.boundHandleTextInput), this.boundHandleTextBlur && this.textInput.removeEventListener("blur", this.boundHandleTextBlur), this.boundHandleKeydown && this.textInput.removeEventListener("keydown", this.boundHandleKeydown)), this.boundHandleColorInput = null, this.boundHandleTextInput = null, this.boundHandleTextBlur = null, this.boundHandleKeydown = null, this.colorInput = null, this.textInput = null;
  }
}
class Vh extends ee {
  constructor() {
    super("SidebarActions"), this.sidebars = /* @__PURE__ */ new Map();
  }
  init() {
    console.log("[SidebarActions] Initializing sidebar actions"), this.setupSidebars(), this.setupEventListeners();
  }
  setupSidebars() {
    document.querySelectorAll('[data-keys-sidebar="true"]').forEach((t) => {
      const n = t.id, i = document.querySelector(`[data-sidebar-overlay][data-sidebar-target="${n}"]`), s = Array.from(document.querySelectorAll(`[data-sidebar-toggle="${n}"]`));
      t.querySelectorAll("details[data-keys-sidebar-section]").forEach((o) => {
        const l = o;
        l.hasAttribute("open") || (l.dataset.originallyCollapsed = "true");
      }), this.sidebars.set(n, {
        sidebar: t,
        overlay: i,
        toggleButtons: s
      }), console.log(`[SidebarActions] Registered sidebar: ${n}`, { hasOverlay: !!i, toggleCount: s.length });
    });
  }
  setupEventListeners() {
    this.sidebars.forEach(({ sidebar: e, overlay: t, toggleButtons: n }, i) => {
      n.forEach((s) => {
        s.addEventListener("click", () => {
          this.toggleSidebar(i);
        });
      }), t && t.addEventListener("click", () => {
        this.closeSidebar(i);
      });
    }), document.addEventListener("keydown", (e) => {
      e.key === "Escape" && this.closeAllSidebars();
    }), window.addEventListener("resize", () => {
      this.updateAllToggleIcons();
    }), document.addEventListener("sidebar:toggle", (e) => {
      const { sidebarId: t } = e.detail;
      t && this.toggleSidebar(t);
    }), document.addEventListener("sidebar:open", (e) => {
      const { sidebarId: t } = e.detail;
      t && this.openSidebar(t);
    }), document.addEventListener("sidebar:close", (e) => {
      const { sidebarId: t } = e.detail;
      t && this.closeSidebar(t);
    }), this.updateAllToggleIcons();
  }
  toggleSidebar(e) {
    const t = this.sidebars.get(e);
    if (!t) {
      console.error(`[SidebarActions] Sidebar not found: ${e}`);
      return;
    }
    const { sidebar: n } = t;
    n.dataset.collapsed === "true" ? this.openSidebar(e) : this.closeSidebar(e);
  }
  openSidebar(e) {
    const t = this.sidebars.get(e);
    if (!t) {
      console.error(`[SidebarActions] Sidebar not found: ${e}`);
      return;
    }
    const { sidebar: n, overlay: i, toggleButtons: s } = t;
    n.dataset.collapsed = "false", n.classList.remove("sidebar-collapsed"), n.querySelectorAll("details[data-keys-sidebar-section]").forEach((o) => {
      const l = o;
      l.dataset.originallyCollapsed === "true" && l.removeAttribute("open");
    }), i && (i.classList.remove("opacity-0", "pointer-events-none"), i.classList.add("opacity-100")), this.updateToggleIcons(s, e), n.dispatchEvent(new CustomEvent("sidebar:opened", { detail: { sidebarId: e } })), console.log(`[SidebarActions] Opened sidebar: ${e}`);
  }
  closeSidebar(e) {
    const t = this.sidebars.get(e);
    if (!t) {
      console.error(`[SidebarActions] Sidebar not found: ${e}`);
      return;
    }
    const { sidebar: n, overlay: i, toggleButtons: s } = t;
    n.dataset.collapsed = "true", n.classList.add("sidebar-collapsed"), n.querySelectorAll("details[data-keys-sidebar-section]").forEach((o) => {
      o.setAttribute("open", "");
    }), i && (i.classList.remove("opacity-100"), i.classList.add("opacity-0", "pointer-events-none")), this.updateToggleIcons(s, e), n.dispatchEvent(new CustomEvent("sidebar:closed", { detail: { sidebarId: e } })), console.log(`[SidebarActions] Closed sidebar: ${e}`);
  }
  closeAllSidebars() {
    this.sidebars.forEach((e, t) => {
      this.closeSidebar(t);
    });
  }
  updateAllToggleIcons() {
    this.sidebars.forEach(({ toggleButtons: e }, t) => {
      this.updateToggleIcons(e, t);
    });
  }
  updateToggleIcons(e, t) {
    const n = window.innerWidth < 1024, i = this.sidebars.get(t);
    if (!i) return;
    const { sidebar: s } = i, a = s.dataset.collapsed === "true";
    e.forEach((o) => {
      const l = o.dataset.mobileIcon || "heroicon-o-x-mark", c = o.dataset.desktopIcon || "heroicon-o-chevron-up-down", d = o.querySelector("[data-icon]");
      if (!d) return;
      const f = d.querySelector("svg");
      if (!f) return;
      const h = n && !a ? l : c;
      d.setAttribute("data-icon-name", h), this.updateIconSvg(f, h);
    });
  }
  updateIconSvg(e, t) {
    const i = {
      "heroicon-o-x-mark": "M6 18L18 6M6 6l12 12",
      "heroicon-o-chevron-up-down": "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    }[t];
    if (!i) return;
    e.innerHTML = "";
    const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
    s.setAttribute("stroke-linecap", "round"), s.setAttribute("stroke-linejoin", "round"), s.setAttribute("d", i), e.appendChild(s);
  }
  destroy() {
    console.log("[SidebarActions] Destroying sidebar actions"), this.sidebars.clear();
  }
}
const X = {
  container: '[data-keys-file-upload="true"]:not([data-initialized="true"])',
  fileInput: ".file-input",
  emptyState: ".upload-empty-state",
  fileState: ".upload-file-state",
  fileName: ".file-name",
  fileSize: ".file-size",
  previewImage: ".file-preview-image",
  fileIcon: ".file-icon",
  changeButton: ".file-change-btn",
  removeButton: ".file-remove",
  uploadProgress: ".upload-progress",
  progressBar: ".upload-progress-bar",
  errorMessage: ".error-message",
  singleFilePreview: ".single-file-preview",
  multipleFilesPreview: ".multiple-files-preview",
  fileSummary: ".file-summary",
  fileCount: ".file-count",
  fileTotalSize: ".file-total-size",
  addMoreFilesBtn: ".file-add-more-btn",
  addMoreFilesContainer: ".add-more-files"
}, Oe = {
  initialized: "data-initialized",
  dragDrop: "data-drag-drop",
  disabled: "data-disabled",
  livewire: "data-livewire",
  accept: "data-accept",
  maxSize: "data-max-size",
  maxSizeFormatted: "data-max-size-formatted",
  invalid: "data-invalid",
  multiple: "data-multiple",
  maxFiles: "data-max-files"
}, En = {
  fileRemoved: "File removed",
  uploadFailed: "Upload failed. Please try again.",
  fileTypeError: (r) => `File type not allowed. Accepted: ${r}`,
  fileSizeError: (r) => `File too large. Maximum size: ${r}`,
  invalidFile: "Invalid file",
  maxFilesError: (r) => `Maximum ${r} file(s) allowed`,
  filesRemoved: (r) => `${r} file(s) removed`
}, Nr = /* @__PURE__ */ new Map(), Fi = Sa.getInstance(), Lc = () => typeof window.Livewire < "u";
function Yh() {
  console.log("[FileUpload] Initializing file upload components...");
  const r = document.querySelectorAll(X.container), e = Lc();
  console.log(`[FileUpload] Found ${r.length} file upload component(s)`), console.log(`[FileUpload] Livewire available: ${e}`), r.forEach((t, n) => {
    const i = t, s = i.closest(".file-upload-wrapper");
    if (!s) {
      console.warn(`[FileUpload] Component #${n + 1}: No wrapper found - skipping`);
      return;
    }
    const a = i.querySelector(X.fileInput);
    if (console.log(`[FileUpload] Initializing component #${n + 1}:`, {
      hasFileInput: !!a,
      hasWrapper: !!s,
      dataAttributes: i.dataset,
      dragDropEnabled: i.getAttribute(Oe.dragDrop),
      disabled: i.getAttribute(Oe.disabled)
    }), !a) {
      console.warn(`[FileUpload] Component #${n + 1}: No file input found - skipping`);
      return;
    }
    um(s, a, e), dm(i, a), hm(s, a), fm(s, a), gm(s, a, e), Fi.setState(s, {
      currentImageIndex: 0,
      images: [],
      isOpen: !1,
      elementId: s.id || `upload-${Date.now()}`
    }), i.setAttribute(Oe.initialized, "true"), console.log(`[FileUpload] Component #${n + 1} initialized successfully`);
  }), console.log("[FileUpload] Initialization complete");
}
function um(r, e, t) {
  console.log("[FileUpload] Setting up file handling");
  const n = r.getAttribute(Oe.multiple) === "true";
  e.addEventListener("change", () => {
    var a;
    const i = r.hasAttribute("data-adding-more"), s = Nr.get(r) || [];
    if (console.log("[FileUpload] File input change event:", {
      filesCount: ((a = e.files) == null ? void 0 : a.length) || 0,
      files: e.files ? Array.from(e.files).map((o) => ({ name: o.name, size: o.size, type: o.type })) : [],
      isMultiple: n,
      isAddingMore: i,
      existingFilesCount: s.length
    }), e.files && e.files.length > 0)
      if (n) {
        const o = i && s.length > 0;
        console.log("[FileUpload] Should append:", o), Kh(r, e, Array.from(e.files), t, o), r.removeAttribute("data-adding-more");
      } else
        Gh(r, e, e.files[0], t);
    else
      console.log("[FileUpload] No files - showing empty state"), Aa(r);
  });
}
function dm(r, e) {
  const t = r.getAttribute(Oe.dragDrop) === "true", n = r.getAttribute(Oe.disabled) === "true";
  if (console.log("[FileUpload] Setting up drag and drop:", {
    dragDropEnabled: t,
    isDisabled: n
  }), !t || n) {
    console.log("[FileUpload] Drag and drop skipped (disabled or not enabled)");
    return;
  }
  ["dragenter", "dragover", "dragleave", "drop"].forEach((s) => r.addEventListener(s, ym)), ["dragenter", "dragover"].forEach((s) => {
    r.addEventListener(s, () => {
      console.log(`[FileUpload] Drag event: ${s}`), r.classList.add("dragover");
    });
  }), ["dragleave", "drop"].forEach((s) => {
    r.addEventListener(s, () => {
      console.log(`[FileUpload] Drag event: ${s}`), r.classList.remove("dragover");
    });
  }), r.addEventListener("drop", (s) => {
    var l;
    const a = (l = s.dataTransfer) == null ? void 0 : l.files, o = r.getAttribute(Oe.multiple) === "true";
    console.log("[FileUpload] Drop event:", {
      filesCount: (a == null ? void 0 : a.length) || 0,
      files: a ? Array.from(a).map((c) => ({ name: c.name, size: c.size, type: c.type })) : [],
      isMultiple: o
    }), a && a.length > 0 && (o ? Kh(r, e, Array.from(a)) : Gh(r, e, a[0], Lc()));
  }), console.log("[FileUpload] Drag and drop setup complete");
}
function hm(r, e) {
  console.log("[FileUpload] Setting up click handlers");
  const t = r.querySelector(X.changeButton);
  console.log("[FileUpload] Change button found:", !!t), t && t.addEventListener("click", (s) => {
    console.log("[FileUpload] Change button clicked"), s.preventDefault(), s.stopPropagation(), e.disabled || e.click();
  });
  const n = r.querySelector(X.emptyState);
  console.log("[FileUpload] Empty state found:", !!n), n && n.addEventListener("click", (s) => {
    const a = s.target;
    if (console.log("[FileUpload] Dropzone clicked:", {
      target: a.tagName,
      disabled: e.disabled,
      isRemoving: r.hasAttribute("data-is-removing")
    }), a.closest(X.fileInput)) {
      console.log("[FileUpload] Click on file input - ignoring");
      return;
    }
    if (r.hasAttribute("data-is-removing")) {
      console.log("[FileUpload] File was just removed - ignoring click");
      return;
    }
    e.disabled || (console.log("[FileUpload] Triggering file input"), e.click());
  });
  const i = r.querySelector(X.addMoreFilesBtn);
  console.log("[FileUpload] Add more files button found:", !!i), i && i.addEventListener("click", (s) => {
    console.log("[FileUpload] Add more files button clicked"), s.preventDefault(), s.stopPropagation(), e.disabled || (r.setAttribute("data-adding-more", "true"), console.log("[FileUpload] Set adding-more flag"), e.click());
  }), r.addEventListener("click", (s) => {
    const o = s.target.closest("[data-remove-file]");
    if (o) {
      s.preventDefault(), s.stopPropagation();
      const l = parseInt(o.getAttribute("data-remove-file") || "0");
      console.log("[FileUpload] Remove individual file clicked:", l), pm(r, e, l);
    }
  }), console.log("[FileUpload] Click handlers setup complete");
}
function fm(r, e) {
  const t = r.querySelector(X.removeButton);
  t && t.addEventListener("click", (n) => {
    n.preventDefault(), n.stopPropagation(), console.log("[FileUpload] Remove button clicked - setting removal flag"), r.setAttribute("data-is-removing", "true"), e.value = "", Aa(r), Ea(r), $i(r, En.fileRemoved), setTimeout(() => {
      r.removeAttribute("data-is-removing"), console.log("[FileUpload] Removal flag cleared - dropzone clickable again");
    }, 150), r.getAttribute(Oe.livewire) === "true" && e.dispatchEvent(new Event("change", { bubbles: !0 }));
  });
}
function pm(r, e, t) {
  console.log("[FileUpload] Removing file at index:", t);
  const n = Nr.get(r) || [];
  if (t < 0 || t >= n.length) {
    console.error("[FileUpload] Invalid file index:", t);
    return;
  }
  const i = `preview-${t}-`, s = Fi.getState(r);
  s && s.images && s.images.filter((o) => o.id.startsWith(i)).forEach((o) => {
    Fi.removeImage(r, o.id);
  }), n.splice(t, 1), n.length === 0 ? (Nr.delete(r), e.value = "", Aa(r), $i(r, En.fileRemoved)) : (Nr.set(r, n), Wh(e, n), Zh(r, n), $i(r, `File removed. ${n.length} file(s) remaining`)), console.log("[FileUpload] File removed. Remaining files:", n.length);
}
function gm(r, e, t) {
  const n = r.getAttribute(Oe.livewire) === "true";
  !t || !n || (e.addEventListener("livewire-upload-start", () => {
    console.log("[FileUpload] Livewire upload started"), e.setAttribute("data-livewire-upload-started", "true"), Vn(r, !0), Sl(r, 0);
  }), e.addEventListener("livewire-upload-progress", (i) => {
    var a;
    const s = i;
    (a = s.detail) != null && a.progress && Sl(r, s.detail.progress);
  }), e.addEventListener("livewire-upload-finish", () => {
    console.log("[FileUpload] Livewire upload finished"), e.removeAttribute("data-livewire-upload-started"), Vn(r, !1), e.files && e.files.length > 0 && kl(r, e.files[0]);
  }), e.addEventListener("livewire-upload-error", (i) => {
    var a;
    ia(r, ((a = i.detail) == null ? void 0 : a.message) || En.uploadFailed), Vn(r, !1);
  }), e.addEventListener("livewire-upload-cancel", () => {
    Vn(r, !1), Ea(r);
  }));
}
function Gh(r, e, t, n) {
  console.log("[FileUpload] Handling file:", {
    name: t.name,
    size: t.size,
    type: t.type
  });
  const i = Qh(r, t);
  if (console.log("[FileUpload] Validation result:", i), !i.valid) {
    console.error("[FileUpload] Validation failed:", i.error), ia(r, i.error || En.invalidFile);
    return;
  }
  Ea(r);
  const s = r.getAttribute(Oe.livewire) === "true", a = n && typeof window.Livewire < "u";
  console.log("[FileUpload] Livewire mode:", {
    dataAttribute: s,
    actuallyAvailable: a
  }), s && a ? (console.log("[FileUpload] Showing upload progress (Livewire mode)"), Vn(r, !0), Sl(r, 0), setTimeout(() => {
    e.hasAttribute("data-livewire-upload-started") || (console.warn("[FileUpload] Livewire upload not started - falling back to standard mode"), Vn(r, !1), kl(r, t));
  }, 500)) : (s && !a && console.warn("[FileUpload] Livewire mode set but Livewire not available - using standard mode"), console.log("[FileUpload] Showing file state (standard mode)"), kl(r, t));
}
function Kh(r, e, t, n, i = !1) {
  console.log("[FileUpload] Handling multiple files:", {
    newFilesCount: t.length,
    append: i
  });
  const s = r.getAttribute(Oe.maxFiles), a = Nr.get(r) || [];
  let o = i ? [...a] : [];
  for (const l of t) {
    const c = Qh(r, l);
    if (!c.valid) {
      console.error("[FileUpload] Validation failed for file:", l.name, c.error), ia(r, c.error || En.invalidFile);
      continue;
    }
    if (s && o.length >= parseInt(s)) {
      ia(r, En.maxFilesError(parseInt(s)));
      break;
    }
    o.push(l);
  }
  if (o.length === 0) {
    console.log("[FileUpload] No valid files - showing empty state"), Aa(r);
    return;
  }
  Nr.set(r, o), Wh(e, o), Ea(r), Zh(r, o), console.log("[FileUpload] Multiple files handled:", {
    totalFiles: o.length,
    fileNames: o.map((l) => l.name)
  });
}
function Wh(r, e) {
  const t = new DataTransfer();
  e.forEach((n) => t.items.add(n)), r.files = t.files;
}
function Qh(r, e) {
  const t = r.getAttribute(Oe.accept), n = r.getAttribute(Oe.maxSize), i = r.getAttribute(Oe.maxSizeFormatted);
  if (t && t !== "*") {
    const s = t.split(",").map((o) => o.trim());
    if (!s.some((o) => o.startsWith(".") ? e.name.toLowerCase().endsWith(o.toLowerCase()) : o.includes("*") ? e.type.startsWith(o.split("/")[0] + "/") : e.type === o))
      return {
        valid: !1,
        error: En.fileTypeError(s.join(", "))
      };
  }
  return n && e.size > parseInt(n) ? {
    valid: !1,
    error: En.fileSizeError(i || "10MB")
  } : { valid: !0 };
}
function Aa(r) {
  console.log("[FileUpload] Showing empty state");
  const e = r.querySelector(X.emptyState), t = r.querySelector(X.fileState);
  console.log("[FileUpload] Empty state elements:", {
    emptyState: !!e,
    fileState: !!t
  }), de(e, !0), de(t, !1), Vn(r, !1), r.classList.remove("dragover"), console.log("[FileUpload] Empty state shown");
}
function kl(r, e) {
  console.log("[FileUpload] Showing file state for:", e.name);
  const t = r.querySelector(X.emptyState), n = r.querySelector(X.fileState), i = r.querySelector(X.singleFilePreview), s = r.querySelector(X.multipleFilesPreview), a = r.querySelector(X.fileSummary), o = r.querySelector(X.addMoreFilesContainer);
  console.log("[FileUpload] File state elements:", {
    emptyState: !!t,
    fileState: !!n
  }), de(t, !1), de(n, !0), de(i, !0), de(s, !1), de(a, !1), de(o, !1), bm(r, e), $i(r, `File selected: ${e.name}`), console.log("[FileUpload] File state shown");
}
function Zh(r, e) {
  console.log("[FileUpload] Showing multiple files state:", e.length);
  const t = r.querySelector(X.emptyState), n = r.querySelector(X.fileState), i = r.querySelector(X.singleFilePreview), s = r.querySelector(X.multipleFilesPreview), a = r.querySelector(X.fileSummary), o = r.querySelector(X.fileCount), l = r.querySelector(X.fileTotalSize), c = r.querySelector(X.addMoreFilesContainer);
  if (de(t, !1), de(n, !0), de(i, !1), de(s, !0), de(a, !0), de(c, !0), o && (o.textContent = e.length.toString()), l) {
    const d = e.reduce((f, h) => f + h.size, 0);
    l.textContent = Kn(d);
  }
  s && (s.innerHTML = "", e.forEach((d, f) => {
    const h = mm(r, d, f);
    s.appendChild(h);
  })), $i(r, `${e.length} file(s) selected`), console.log("[FileUpload] Multiple files state shown");
}
function mm(r, e, t) {
  const n = document.createElement("div");
  n.className = "file-card relative p-3 rounded-lg border-2 border-border bg-surface hover:border-brand transition-colors", n.setAttribute("data-file-index", t.toString());
  const i = document.createElement("div");
  i.className = "mb-2 relative";
  const s = document.createElement("img");
  s.className = "hidden w-full h-24 object-cover rounded", s.alt = e.name;
  const a = document.createElement("div");
  if (a.className = "flex items-center justify-center w-full h-24 bg-surface border border-border rounded", a.innerHTML = `<svg class="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>`, i.appendChild(s), i.appendChild(a), e.type.startsWith("image/")) {
    const f = new FileReader();
    f.onload = (h) => {
      var g;
      if ((g = h.target) != null && g.result) {
        const m = h.target.result;
        s.src = m, s.classList.remove("hidden"), a.classList.add("hidden");
        const y = `preview-${t}-${Date.now()}`;
        s.setAttribute("data-lightbox-trigger", y), s.setAttribute("data-filename", e.name), s.setAttribute("data-filetype", "image"), s.setAttribute("data-filesize", Kn(e.size)), s.style.cursor = "pointer", s.setAttribute("role", "button"), s.setAttribute("tabindex", "0"), s.setAttribute("aria-label", `View ${e.name} in lightbox`), console.log("[FileUpload] Registering card image with lightbox:", y), Fi.addImage(r, {
          id: y,
          src: m,
          alt: e.name,
          fileName: e.name,
          fileSize: Kn(e.size),
          fileType: e.type
        });
      }
    }, f.readAsDataURL(e);
  }
  const o = document.createElement("div");
  o.className = "space-y-1";
  const l = document.createElement("div");
  l.className = "text-sm font-medium text-foreground truncate", l.textContent = e.name, l.title = e.name;
  const c = document.createElement("div");
  c.className = "text-xs text-muted", c.textContent = Kn(e.size), o.appendChild(l), o.appendChild(c);
  const d = document.createElement("button");
  return d.type = "button", d.className = "absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-danger text-white hover:bg-danger-hover transition-colors", d.setAttribute("data-remove-file", t.toString()), d.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>`, n.appendChild(i), n.appendChild(o), n.appendChild(d), n;
}
function bm(r, e) {
  console.log("[FileUpload] Updating file info:", e.name);
  const t = r.querySelector(X.fileName), n = r.querySelector(X.fileSize), i = r.querySelector(X.previewImage), s = r.querySelector(X.fileIcon);
  if (console.log("[FileUpload] Info elements found:", {
    fileName: !!t,
    fileSize: !!n,
    previewImage: !!i,
    fileIcon: !!s
  }), t && (t.textContent = e.name), n && (n.textContent = Kn(e.size)), e.type.startsWith("image/")) {
    console.log("[FileUpload] Reading image preview");
    const a = new FileReader();
    a.onload = (o) => {
      var l;
      if (i && ((l = o.target) != null && l.result)) {
        console.log("[FileUpload] Image preview loaded");
        const c = o.target.result;
        i.src = c;
        const d = "preview-" + Date.now();
        i.setAttribute("data-lightbox-trigger", d), i.setAttribute("data-filename", e.name), i.setAttribute("data-filetype", "image"), i.setAttribute("data-filesize", Kn(e.size)), i.style.cursor = "pointer", i.setAttribute("role", "button"), i.setAttribute("tabindex", "0"), i.setAttribute("aria-label", `View ${e.name} in lightbox`);
        const f = i.closest(".file-upload-wrapper");
        f ? (console.log("[FileUpload] Registering image with lightbox:", d, f), Fi.addImage(f, {
          id: d,
          src: c,
          alt: e.name,
          fileName: e.name,
          fileSize: Kn(e.size),
          fileType: e.type
        })) : console.warn("[FileUpload] Could not find wrapper for lightbox registration"), de(i, !0), de(s, !1);
      }
    }, a.onerror = (o) => {
      console.error("[FileUpload] Error reading image:", o);
    }, a.readAsDataURL(e);
  } else
    console.log("[FileUpload] Showing file icon (non-image file)"), de(i, !1), de(s, !0);
  console.log("[FileUpload] File info updated");
}
function Vn(r, e) {
  const t = r.querySelector(X.uploadProgress);
  de(t, e);
}
function ia(r, e) {
  console.log("[FileUpload] Showing error:", e);
  const t = r.querySelector(X.errorMessage);
  t ? (t.textContent = e, de(t, !0)) : console.warn("[FileUpload] Error message element not found"), r.setAttribute(Oe.invalid, "true");
}
function Ea(r) {
  console.log("[FileUpload] Clearing error");
  const e = r.querySelector(X.errorMessage);
  e && de(e, !1), r.removeAttribute(Oe.invalid);
}
function Kn(r) {
  if (r === 0) return "0 Bytes";
  const e = 1024, t = ["Bytes", "KB", "MB", "GB"], n = Math.floor(Math.log(r) / Math.log(e));
  return parseFloat((r / Math.pow(e, n)).toFixed(2)) + " " + t[n];
}
function de(r, e) {
  if (!r) {
    console.warn("[FileUpload] toggleElement: element is null");
    return;
  }
  console.log("[FileUpload] Toggling element:", {
    element: r.className,
    show: e,
    wasHidden: r.classList.contains("hidden"),
    willBeHidden: !e
  }), r.classList.toggle("hidden", !e);
}
function Sl(r, e) {
  const t = r.querySelector(X.progressBar);
  t && (t.style.width = `${e}%`);
}
function ym(r) {
  r.preventDefault(), r.stopPropagation();
}
function $i(r, e) {
  const t = document.createElement("div");
  t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "true"), t.className = "sr-only", t.textContent = e, r.appendChild(t), setTimeout(() => {
    r.contains(t) && r.removeChild(t);
  }, 1e3);
}
document.addEventListener("DOMContentLoaded", Yh);
Lc() && document.addEventListener("livewire:navigated", Yh);
var Xh = typeof global == "object" && global && global.Object === Object && global, vm = typeof self == "object" && self && self.Object === Object && self, Kt = Xh || vm || Function("return this")(), Cn = Kt.Symbol, Jh = Object.prototype, wm = Jh.hasOwnProperty, xm = Jh.toString, ki = Cn ? Cn.toStringTag : void 0;
function km(r) {
  var e = wm.call(r, ki), t = r[ki];
  try {
    r[ki] = void 0;
    var n = !0;
  } catch {
  }
  var i = xm.call(r);
  return n && (e ? r[ki] = t : delete r[ki]), i;
}
var Sm = Object.prototype, Am = Sm.toString;
function Em(r) {
  return Am.call(r);
}
var Cm = "[object Null]", Tm = "[object Undefined]", Au = Cn ? Cn.toStringTag : void 0;
function ei(r) {
  return r == null ? r === void 0 ? Tm : Cm : Au && Au in Object(r) ? km(r) : Em(r);
}
function sn(r) {
  return r != null && typeof r == "object";
}
var Qn = Array.isArray;
function In(r) {
  var e = typeof r;
  return r != null && (e == "object" || e == "function");
}
function ef(r) {
  return r;
}
var Lm = "[object AsyncFunction]", Dm = "[object Function]", Im = "[object GeneratorFunction]", Nm = "[object Proxy]";
function Dc(r) {
  if (!In(r))
    return !1;
  var e = ei(r);
  return e == Dm || e == Im || e == Lm || e == Nm;
}
var Bo = Kt["__core-js_shared__"], Eu = function() {
  var r = /[^.]+$/.exec(Bo && Bo.keys && Bo.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function Om(r) {
  return !!Eu && Eu in r;
}
var Mm = Function.prototype, qm = Mm.toString;
function tr(r) {
  if (r != null) {
    try {
      return qm.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var _m = /[\\^$.*+?()[\]{}|]/g, zm = /^\[object .+?Constructor\]$/, Rm = Function.prototype, Pm = Object.prototype, Bm = Rm.toString, Fm = Pm.hasOwnProperty, $m = RegExp(
  "^" + Bm.call(Fm).replace(_m, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function jm(r) {
  if (!In(r) || Om(r))
    return !1;
  var e = Dc(r) ? $m : zm;
  return e.test(tr(r));
}
function Um(r, e) {
  return r == null ? void 0 : r[e];
}
function nr(r, e) {
  var t = Um(r, e);
  return jm(t) ? t : void 0;
}
var Al = nr(Kt, "WeakMap"), Cu = Object.create, Hm = /* @__PURE__ */ function() {
  function r() {
  }
  return function(e) {
    if (!In(e))
      return {};
    if (Cu)
      return Cu(e);
    r.prototype = e;
    var t = new r();
    return r.prototype = void 0, t;
  };
}();
function Vm(r, e, t) {
  switch (t.length) {
    case 0:
      return r.call(e);
    case 1:
      return r.call(e, t[0]);
    case 2:
      return r.call(e, t[0], t[1]);
    case 3:
      return r.call(e, t[0], t[1], t[2]);
  }
  return r.apply(e, t);
}
function Ym(r, e) {
  var t = -1, n = r.length;
  for (e || (e = Array(n)); ++t < n; )
    e[t] = r[t];
  return e;
}
var Gm = 800, Km = 16, Wm = Date.now;
function Qm(r) {
  var e = 0, t = 0;
  return function() {
    var n = Wm(), i = Km - (n - t);
    if (t = n, i > 0) {
      if (++e >= Gm)
        return arguments[0];
    } else
      e = 0;
    return r.apply(void 0, arguments);
  };
}
function Zm(r) {
  return function() {
    return r;
  };
}
var sa = function() {
  try {
    var r = nr(Object, "defineProperty");
    return r({}, "", {}), r;
  } catch {
  }
}(), Xm = sa ? function(r, e) {
  return sa(r, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Zm(e),
    writable: !0
  });
} : ef, Jm = Qm(Xm);
function eb(r, e) {
  for (var t = -1, n = r == null ? 0 : r.length; ++t < n && e(r[t], t, r) !== !1; )
    ;
  return r;
}
var tb = 9007199254740991, nb = /^(?:0|[1-9]\d*)$/;
function tf(r, e) {
  var t = typeof r;
  return e = e ?? tb, !!e && (t == "number" || t != "symbol" && nb.test(r)) && r > -1 && r % 1 == 0 && r < e;
}
function Ic(r, e, t) {
  e == "__proto__" && sa ? sa(r, e, {
    configurable: !0,
    enumerable: !0,
    value: t,
    writable: !0
  }) : r[e] = t;
}
function ts(r, e) {
  return r === e || r !== r && e !== e;
}
var rb = Object.prototype, ib = rb.hasOwnProperty;
function nf(r, e, t) {
  var n = r[e];
  (!(ib.call(r, e) && ts(n, t)) || t === void 0 && !(e in r)) && Ic(r, e, t);
}
function sb(r, e, t, n) {
  var i = !t;
  t || (t = {});
  for (var s = -1, a = e.length; ++s < a; ) {
    var o = e[s], l = void 0;
    l === void 0 && (l = r[o]), i ? Ic(t, o, l) : nf(t, o, l);
  }
  return t;
}
var Tu = Math.max;
function ab(r, e, t) {
  return e = Tu(e === void 0 ? r.length - 1 : e, 0), function() {
    for (var n = arguments, i = -1, s = Tu(n.length - e, 0), a = Array(s); ++i < s; )
      a[i] = n[e + i];
    i = -1;
    for (var o = Array(e + 1); ++i < e; )
      o[i] = n[i];
    return o[e] = t(a), Vm(r, this, o);
  };
}
function ob(r, e) {
  return Jm(ab(r, e, ef), r + "");
}
var lb = 9007199254740991;
function rf(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= lb;
}
function Ca(r) {
  return r != null && rf(r.length) && !Dc(r);
}
function cb(r, e, t) {
  if (!In(t))
    return !1;
  var n = typeof e;
  return (n == "number" ? Ca(t) && tf(e, t.length) : n == "string" && e in t) ? ts(t[e], r) : !1;
}
function ub(r) {
  return ob(function(e, t) {
    var n = -1, i = t.length, s = i > 1 ? t[i - 1] : void 0, a = i > 2 ? t[2] : void 0;
    for (s = r.length > 3 && typeof s == "function" ? (i--, s) : void 0, a && cb(t[0], t[1], a) && (s = i < 3 ? void 0 : s, i = 1), e = Object(e); ++n < i; ) {
      var o = t[n];
      o && r(e, o, n, s);
    }
    return e;
  });
}
var db = Object.prototype;
function Nc(r) {
  var e = r && r.constructor, t = typeof e == "function" && e.prototype || db;
  return r === t;
}
function hb(r, e) {
  for (var t = -1, n = Array(r); ++t < r; )
    n[t] = e(t);
  return n;
}
var fb = "[object Arguments]";
function Lu(r) {
  return sn(r) && ei(r) == fb;
}
var sf = Object.prototype, pb = sf.hasOwnProperty, gb = sf.propertyIsEnumerable, El = Lu(/* @__PURE__ */ function() {
  return arguments;
}()) ? Lu : function(r) {
  return sn(r) && pb.call(r, "callee") && !gb.call(r, "callee");
};
function mb() {
  return !1;
}
var af = typeof exports == "object" && exports && !exports.nodeType && exports, Du = af && typeof module == "object" && module && !module.nodeType && module, bb = Du && Du.exports === af, Iu = bb ? Kt.Buffer : void 0, yb = Iu ? Iu.isBuffer : void 0, ji = yb || mb, vb = "[object Arguments]", wb = "[object Array]", xb = "[object Boolean]", kb = "[object Date]", Sb = "[object Error]", Ab = "[object Function]", Eb = "[object Map]", Cb = "[object Number]", Tb = "[object Object]", Lb = "[object RegExp]", Db = "[object Set]", Ib = "[object String]", Nb = "[object WeakMap]", Ob = "[object ArrayBuffer]", Mb = "[object DataView]", qb = "[object Float32Array]", _b = "[object Float64Array]", zb = "[object Int8Array]", Rb = "[object Int16Array]", Pb = "[object Int32Array]", Bb = "[object Uint8Array]", Fb = "[object Uint8ClampedArray]", $b = "[object Uint16Array]", jb = "[object Uint32Array]", le = {};
le[qb] = le[_b] = le[zb] = le[Rb] = le[Pb] = le[Bb] = le[Fb] = le[$b] = le[jb] = !0;
le[vb] = le[wb] = le[Ob] = le[xb] = le[Mb] = le[kb] = le[Sb] = le[Ab] = le[Eb] = le[Cb] = le[Tb] = le[Lb] = le[Db] = le[Ib] = le[Nb] = !1;
function Ub(r) {
  return sn(r) && rf(r.length) && !!le[ei(r)];
}
function Oc(r) {
  return function(e) {
    return r(e);
  };
}
var of = typeof exports == "object" && exports && !exports.nodeType && exports, Oi = of && typeof module == "object" && module && !module.nodeType && module, Hb = Oi && Oi.exports === of, Fo = Hb && Xh.process, Hr = function() {
  try {
    var r = Oi && Oi.require && Oi.require("util").types;
    return r || Fo && Fo.binding && Fo.binding("util");
  } catch {
  }
}(), Nu = Hr && Hr.isTypedArray, Mc = Nu ? Oc(Nu) : Ub, Vb = Object.prototype, Yb = Vb.hasOwnProperty;
function lf(r, e) {
  var t = Qn(r), n = !t && El(r), i = !t && !n && ji(r), s = !t && !n && !i && Mc(r), a = t || n || i || s, o = a ? hb(r.length, String) : [], l = o.length;
  for (var c in r)
    (e || Yb.call(r, c)) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    tf(c, l))) && o.push(c);
  return o;
}
function cf(r, e) {
  return function(t) {
    return r(e(t));
  };
}
var Gb = cf(Object.keys, Object), Kb = Object.prototype, Wb = Kb.hasOwnProperty;
function Qb(r) {
  if (!Nc(r))
    return Gb(r);
  var e = [];
  for (var t in Object(r))
    Wb.call(r, t) && t != "constructor" && e.push(t);
  return e;
}
function Zb(r) {
  return Ca(r) ? lf(r) : Qb(r);
}
function Xb(r) {
  var e = [];
  if (r != null)
    for (var t in Object(r))
      e.push(t);
  return e;
}
var Jb = Object.prototype, ey = Jb.hasOwnProperty;
function ty(r) {
  if (!In(r))
    return Xb(r);
  var e = Nc(r), t = [];
  for (var n in r)
    n == "constructor" && (e || !ey.call(r, n)) || t.push(n);
  return t;
}
function uf(r) {
  return Ca(r) ? lf(r, !0) : ty(r);
}
var Ui = nr(Object, "create");
function ny() {
  this.__data__ = Ui ? Ui(null) : {}, this.size = 0;
}
function ry(r) {
  var e = this.has(r) && delete this.__data__[r];
  return this.size -= e ? 1 : 0, e;
}
var iy = "__lodash_hash_undefined__", sy = Object.prototype, ay = sy.hasOwnProperty;
function oy(r) {
  var e = this.__data__;
  if (Ui) {
    var t = e[r];
    return t === iy ? void 0 : t;
  }
  return ay.call(e, r) ? e[r] : void 0;
}
var ly = Object.prototype, cy = ly.hasOwnProperty;
function uy(r) {
  var e = this.__data__;
  return Ui ? e[r] !== void 0 : cy.call(e, r);
}
var dy = "__lodash_hash_undefined__";
function hy(r, e) {
  var t = this.__data__;
  return this.size += this.has(r) ? 0 : 1, t[r] = Ui && e === void 0 ? dy : e, this;
}
function Zn(r) {
  var e = -1, t = r == null ? 0 : r.length;
  for (this.clear(); ++e < t; ) {
    var n = r[e];
    this.set(n[0], n[1]);
  }
}
Zn.prototype.clear = ny;
Zn.prototype.delete = ry;
Zn.prototype.get = oy;
Zn.prototype.has = uy;
Zn.prototype.set = hy;
function fy() {
  this.__data__ = [], this.size = 0;
}
function Ta(r, e) {
  for (var t = r.length; t--; )
    if (ts(r[t][0], e))
      return t;
  return -1;
}
var py = Array.prototype, gy = py.splice;
function my(r) {
  var e = this.__data__, t = Ta(e, r);
  if (t < 0)
    return !1;
  var n = e.length - 1;
  return t == n ? e.pop() : gy.call(e, t, 1), --this.size, !0;
}
function by(r) {
  var e = this.__data__, t = Ta(e, r);
  return t < 0 ? void 0 : e[t][1];
}
function yy(r) {
  return Ta(this.__data__, r) > -1;
}
function vy(r, e) {
  var t = this.__data__, n = Ta(t, r);
  return n < 0 ? (++this.size, t.push([r, e])) : t[n][1] = e, this;
}
function cn(r) {
  var e = -1, t = r == null ? 0 : r.length;
  for (this.clear(); ++e < t; ) {
    var n = r[e];
    this.set(n[0], n[1]);
  }
}
cn.prototype.clear = fy;
cn.prototype.delete = my;
cn.prototype.get = by;
cn.prototype.has = yy;
cn.prototype.set = vy;
var Hi = nr(Kt, "Map");
function wy() {
  this.size = 0, this.__data__ = {
    hash: new Zn(),
    map: new (Hi || cn)(),
    string: new Zn()
  };
}
function xy(r) {
  var e = typeof r;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? r !== "__proto__" : r === null;
}
function La(r, e) {
  var t = r.__data__;
  return xy(e) ? t[typeof e == "string" ? "string" : "hash"] : t.map;
}
function ky(r) {
  var e = La(this, r).delete(r);
  return this.size -= e ? 1 : 0, e;
}
function Sy(r) {
  return La(this, r).get(r);
}
function Ay(r) {
  return La(this, r).has(r);
}
function Ey(r, e) {
  var t = La(this, r), n = t.size;
  return t.set(r, e), this.size += t.size == n ? 0 : 1, this;
}
function rr(r) {
  var e = -1, t = r == null ? 0 : r.length;
  for (this.clear(); ++e < t; ) {
    var n = r[e];
    this.set(n[0], n[1]);
  }
}
rr.prototype.clear = wy;
rr.prototype.delete = ky;
rr.prototype.get = Sy;
rr.prototype.has = Ay;
rr.prototype.set = Ey;
function Cy(r, e) {
  for (var t = -1, n = e.length, i = r.length; ++t < n; )
    r[i + t] = e[t];
  return r;
}
var df = cf(Object.getPrototypeOf, Object), Ty = "[object Object]", Ly = Function.prototype, Dy = Object.prototype, hf = Ly.toString, Iy = Dy.hasOwnProperty, Ny = hf.call(Object);
function Oy(r) {
  if (!sn(r) || ei(r) != Ty)
    return !1;
  var e = df(r);
  if (e === null)
    return !0;
  var t = Iy.call(e, "constructor") && e.constructor;
  return typeof t == "function" && t instanceof t && hf.call(t) == Ny;
}
function My() {
  this.__data__ = new cn(), this.size = 0;
}
function qy(r) {
  var e = this.__data__, t = e.delete(r);
  return this.size = e.size, t;
}
function _y(r) {
  return this.__data__.get(r);
}
function zy(r) {
  return this.__data__.has(r);
}
var Ry = 200;
function Py(r, e) {
  var t = this.__data__;
  if (t instanceof cn) {
    var n = t.__data__;
    if (!Hi || n.length < Ry - 1)
      return n.push([r, e]), this.size = ++t.size, this;
    t = this.__data__ = new rr(n);
  }
  return t.set(r, e), this.size = t.size, this;
}
function $t(r) {
  var e = this.__data__ = new cn(r);
  this.size = e.size;
}
$t.prototype.clear = My;
$t.prototype.delete = qy;
$t.prototype.get = _y;
$t.prototype.has = zy;
$t.prototype.set = Py;
var ff = typeof exports == "object" && exports && !exports.nodeType && exports, Ou = ff && typeof module == "object" && module && !module.nodeType && module, By = Ou && Ou.exports === ff, Mu = By ? Kt.Buffer : void 0, qu = Mu ? Mu.allocUnsafe : void 0;
function pf(r, e) {
  if (e)
    return r.slice();
  var t = r.length, n = qu ? qu(t) : new r.constructor(t);
  return r.copy(n), n;
}
function Fy(r, e) {
  for (var t = -1, n = r == null ? 0 : r.length, i = 0, s = []; ++t < n; ) {
    var a = r[t];
    e(a, t, r) && (s[i++] = a);
  }
  return s;
}
function $y() {
  return [];
}
var jy = Object.prototype, Uy = jy.propertyIsEnumerable, _u = Object.getOwnPropertySymbols, Hy = _u ? function(r) {
  return r == null ? [] : (r = Object(r), Fy(_u(r), function(e) {
    return Uy.call(r, e);
  }));
} : $y;
function Vy(r, e, t) {
  var n = e(r);
  return Qn(r) ? n : Cy(n, t(r));
}
function Cl(r) {
  return Vy(r, Zb, Hy);
}
var Tl = nr(Kt, "DataView"), Ll = nr(Kt, "Promise"), Dl = nr(Kt, "Set"), zu = "[object Map]", Yy = "[object Object]", Ru = "[object Promise]", Pu = "[object Set]", Bu = "[object WeakMap]", Fu = "[object DataView]", Gy = tr(Tl), Ky = tr(Hi), Wy = tr(Ll), Qy = tr(Dl), Zy = tr(Al), bt = ei;
(Tl && bt(new Tl(new ArrayBuffer(1))) != Fu || Hi && bt(new Hi()) != zu || Ll && bt(Ll.resolve()) != Ru || Dl && bt(new Dl()) != Pu || Al && bt(new Al()) != Bu) && (bt = function(r) {
  var e = ei(r), t = e == Yy ? r.constructor : void 0, n = t ? tr(t) : "";
  if (n)
    switch (n) {
      case Gy:
        return Fu;
      case Ky:
        return zu;
      case Wy:
        return Ru;
      case Qy:
        return Pu;
      case Zy:
        return Bu;
    }
  return e;
});
var Xy = Object.prototype, Jy = Xy.hasOwnProperty;
function ev(r) {
  var e = r.length, t = new r.constructor(e);
  return e && typeof r[0] == "string" && Jy.call(r, "index") && (t.index = r.index, t.input = r.input), t;
}
var aa = Kt.Uint8Array;
function qc(r) {
  var e = new r.constructor(r.byteLength);
  return new aa(e).set(new aa(r)), e;
}
function tv(r, e) {
  var t = qc(r.buffer);
  return new r.constructor(t, r.byteOffset, r.byteLength);
}
var nv = /\w*$/;
function rv(r) {
  var e = new r.constructor(r.source, nv.exec(r));
  return e.lastIndex = r.lastIndex, e;
}
var $u = Cn ? Cn.prototype : void 0, ju = $u ? $u.valueOf : void 0;
function iv(r) {
  return ju ? Object(ju.call(r)) : {};
}
function gf(r, e) {
  var t = e ? qc(r.buffer) : r.buffer;
  return new r.constructor(t, r.byteOffset, r.length);
}
var sv = "[object Boolean]", av = "[object Date]", ov = "[object Map]", lv = "[object Number]", cv = "[object RegExp]", uv = "[object Set]", dv = "[object String]", hv = "[object Symbol]", fv = "[object ArrayBuffer]", pv = "[object DataView]", gv = "[object Float32Array]", mv = "[object Float64Array]", bv = "[object Int8Array]", yv = "[object Int16Array]", vv = "[object Int32Array]", wv = "[object Uint8Array]", xv = "[object Uint8ClampedArray]", kv = "[object Uint16Array]", Sv = "[object Uint32Array]";
function Av(r, e, t) {
  var n = r.constructor;
  switch (e) {
    case fv:
      return qc(r);
    case sv:
    case av:
      return new n(+r);
    case pv:
      return tv(r);
    case gv:
    case mv:
    case bv:
    case yv:
    case vv:
    case wv:
    case xv:
    case kv:
    case Sv:
      return gf(r, t);
    case ov:
      return new n();
    case lv:
    case dv:
      return new n(r);
    case cv:
      return rv(r);
    case uv:
      return new n();
    case hv:
      return iv(r);
  }
}
function mf(r) {
  return typeof r.constructor == "function" && !Nc(r) ? Hm(df(r)) : {};
}
var Ev = "[object Map]";
function Cv(r) {
  return sn(r) && bt(r) == Ev;
}
var Uu = Hr && Hr.isMap, Tv = Uu ? Oc(Uu) : Cv, Lv = "[object Set]";
function Dv(r) {
  return sn(r) && bt(r) == Lv;
}
var Hu = Hr && Hr.isSet, Iv = Hu ? Oc(Hu) : Dv, Nv = 1, bf = "[object Arguments]", Ov = "[object Array]", Mv = "[object Boolean]", qv = "[object Date]", _v = "[object Error]", yf = "[object Function]", zv = "[object GeneratorFunction]", Rv = "[object Map]", Pv = "[object Number]", vf = "[object Object]", Bv = "[object RegExp]", Fv = "[object Set]", $v = "[object String]", jv = "[object Symbol]", Uv = "[object WeakMap]", Hv = "[object ArrayBuffer]", Vv = "[object DataView]", Yv = "[object Float32Array]", Gv = "[object Float64Array]", Kv = "[object Int8Array]", Wv = "[object Int16Array]", Qv = "[object Int32Array]", Zv = "[object Uint8Array]", Xv = "[object Uint8ClampedArray]", Jv = "[object Uint16Array]", e1 = "[object Uint32Array]", ae = {};
ae[bf] = ae[Ov] = ae[Hv] = ae[Vv] = ae[Mv] = ae[qv] = ae[Yv] = ae[Gv] = ae[Kv] = ae[Wv] = ae[Qv] = ae[Rv] = ae[Pv] = ae[vf] = ae[Bv] = ae[Fv] = ae[$v] = ae[jv] = ae[Zv] = ae[Xv] = ae[Jv] = ae[e1] = !0;
ae[_v] = ae[yf] = ae[Uv] = !1;
function Ws(r, e, t, n, i, s) {
  var a, o = e & Nv;
  if (a !== void 0)
    return a;
  if (!In(r))
    return r;
  var l = Qn(r);
  if (l)
    a = ev(r);
  else {
    var c = bt(r), d = c == yf || c == zv;
    if (ji(r))
      return pf(r, o);
    if (c == vf || c == bf || d && !i)
      a = d ? {} : mf(r);
    else {
      if (!ae[c])
        return i ? r : {};
      a = Av(r, c, o);
    }
  }
  s || (s = new $t());
  var f = s.get(r);
  if (f)
    return f;
  s.set(r, a), Iv(r) ? r.forEach(function(m) {
    a.add(Ws(m, e, t, m, r, s));
  }) : Tv(r) && r.forEach(function(m, y) {
    a.set(y, Ws(m, e, t, y, r, s));
  });
  var h = Cl, g = l ? void 0 : h(r);
  return eb(g || r, function(m, y) {
    g && (y = m, m = r[y]), nf(a, y, Ws(m, e, t, y, r, s));
  }), a;
}
var t1 = 1, n1 = 4;
function Or(r) {
  return Ws(r, t1 | n1);
}
var r1 = "__lodash_hash_undefined__";
function i1(r) {
  return this.__data__.set(r, r1), this;
}
function s1(r) {
  return this.__data__.has(r);
}
function oa(r) {
  var e = -1, t = r == null ? 0 : r.length;
  for (this.__data__ = new rr(); ++e < t; )
    this.add(r[e]);
}
oa.prototype.add = oa.prototype.push = i1;
oa.prototype.has = s1;
function a1(r, e) {
  for (var t = -1, n = r == null ? 0 : r.length; ++t < n; )
    if (e(r[t], t, r))
      return !0;
  return !1;
}
function o1(r, e) {
  return r.has(e);
}
var l1 = 1, c1 = 2;
function wf(r, e, t, n, i, s) {
  var a = t & l1, o = r.length, l = e.length;
  if (o != l && !(a && l > o))
    return !1;
  var c = s.get(r), d = s.get(e);
  if (c && d)
    return c == e && d == r;
  var f = -1, h = !0, g = t & c1 ? new oa() : void 0;
  for (s.set(r, e), s.set(e, r); ++f < o; ) {
    var m = r[f], y = e[f];
    if (n)
      var x = a ? n(y, m, f, e, r, s) : n(m, y, f, r, e, s);
    if (x !== void 0) {
      if (x)
        continue;
      h = !1;
      break;
    }
    if (g) {
      if (!a1(e, function(w, S) {
        if (!o1(g, S) && (m === w || i(m, w, t, n, s)))
          return g.push(S);
      })) {
        h = !1;
        break;
      }
    } else if (!(m === y || i(m, y, t, n, s))) {
      h = !1;
      break;
    }
  }
  return s.delete(r), s.delete(e), h;
}
function u1(r) {
  var e = -1, t = Array(r.size);
  return r.forEach(function(n, i) {
    t[++e] = [i, n];
  }), t;
}
function d1(r) {
  var e = -1, t = Array(r.size);
  return r.forEach(function(n) {
    t[++e] = n;
  }), t;
}
var h1 = 1, f1 = 2, p1 = "[object Boolean]", g1 = "[object Date]", m1 = "[object Error]", b1 = "[object Map]", y1 = "[object Number]", v1 = "[object RegExp]", w1 = "[object Set]", x1 = "[object String]", k1 = "[object Symbol]", S1 = "[object ArrayBuffer]", A1 = "[object DataView]", Vu = Cn ? Cn.prototype : void 0, $o = Vu ? Vu.valueOf : void 0;
function E1(r, e, t, n, i, s, a) {
  switch (t) {
    case A1:
      if (r.byteLength != e.byteLength || r.byteOffset != e.byteOffset)
        return !1;
      r = r.buffer, e = e.buffer;
    case S1:
      return !(r.byteLength != e.byteLength || !s(new aa(r), new aa(e)));
    case p1:
    case g1:
    case y1:
      return ts(+r, +e);
    case m1:
      return r.name == e.name && r.message == e.message;
    case v1:
    case x1:
      return r == e + "";
    case b1:
      var o = u1;
    case w1:
      var l = n & h1;
      if (o || (o = d1), r.size != e.size && !l)
        return !1;
      var c = a.get(r);
      if (c)
        return c == e;
      n |= f1, a.set(r, e);
      var d = wf(o(r), o(e), n, i, s, a);
      return a.delete(r), d;
    case k1:
      if ($o)
        return $o.call(r) == $o.call(e);
  }
  return !1;
}
var C1 = 1, T1 = Object.prototype, L1 = T1.hasOwnProperty;
function D1(r, e, t, n, i, s) {
  var a = t & C1, o = Cl(r), l = o.length, c = Cl(e), d = c.length;
  if (l != d && !a)
    return !1;
  for (var f = l; f--; ) {
    var h = o[f];
    if (!(a ? h in e : L1.call(e, h)))
      return !1;
  }
  var g = s.get(r), m = s.get(e);
  if (g && m)
    return g == e && m == r;
  var y = !0;
  s.set(r, e), s.set(e, r);
  for (var x = a; ++f < l; ) {
    h = o[f];
    var w = r[h], S = e[h];
    if (n)
      var E = a ? n(S, w, h, e, r, s) : n(w, S, h, r, e, s);
    if (!(E === void 0 ? w === S || i(w, S, t, n, s) : E)) {
      y = !1;
      break;
    }
    x || (x = h == "constructor");
  }
  if (y && !x) {
    var C = r.constructor, I = e.constructor;
    C != I && "constructor" in r && "constructor" in e && !(typeof C == "function" && C instanceof C && typeof I == "function" && I instanceof I) && (y = !1);
  }
  return s.delete(r), s.delete(e), y;
}
var I1 = 1, Yu = "[object Arguments]", Gu = "[object Array]", Ms = "[object Object]", N1 = Object.prototype, Ku = N1.hasOwnProperty;
function O1(r, e, t, n, i, s) {
  var a = Qn(r), o = Qn(e), l = a ? Gu : bt(r), c = o ? Gu : bt(e);
  l = l == Yu ? Ms : l, c = c == Yu ? Ms : c;
  var d = l == Ms, f = c == Ms, h = l == c;
  if (h && ji(r)) {
    if (!ji(e))
      return !1;
    a = !0, d = !1;
  }
  if (h && !d)
    return s || (s = new $t()), a || Mc(r) ? wf(r, e, t, n, i, s) : E1(r, e, l, t, n, i, s);
  if (!(t & I1)) {
    var g = d && Ku.call(r, "__wrapped__"), m = f && Ku.call(e, "__wrapped__");
    if (g || m) {
      var y = g ? r.value() : r, x = m ? e.value() : e;
      return s || (s = new $t()), i(y, x, t, n, s);
    }
  }
  return h ? (s || (s = new $t()), D1(r, e, t, n, i, s)) : !1;
}
function xf(r, e, t, n, i) {
  return r === e ? !0 : r == null || e == null || !sn(r) && !sn(e) ? r !== r && e !== e : O1(r, e, t, n, xf, i);
}
function M1(r) {
  return function(e, t, n) {
    for (var i = -1, s = Object(e), a = n(e), o = a.length; o--; ) {
      var l = a[++i];
      if (t(s[l], l, s) === !1)
        break;
    }
    return e;
  };
}
var q1 = M1();
function Il(r, e, t) {
  (t !== void 0 && !ts(r[e], t) || t === void 0 && !(e in r)) && Ic(r, e, t);
}
function _1(r) {
  return sn(r) && Ca(r);
}
function Nl(r, e) {
  if (!(e === "constructor" && typeof r[e] == "function") && e != "__proto__")
    return r[e];
}
function z1(r) {
  return sb(r, uf(r));
}
function R1(r, e, t, n, i, s, a) {
  var o = Nl(r, t), l = Nl(e, t), c = a.get(l);
  if (c) {
    Il(r, t, c);
    return;
  }
  var d = s ? s(o, l, t + "", r, e, a) : void 0, f = d === void 0;
  if (f) {
    var h = Qn(l), g = !h && ji(l), m = !h && !g && Mc(l);
    d = l, h || g || m ? Qn(o) ? d = o : _1(o) ? d = Ym(o) : g ? (f = !1, d = pf(l, !0)) : m ? (f = !1, d = gf(l, !0)) : d = [] : Oy(l) || El(l) ? (d = o, El(o) ? d = z1(o) : (!In(o) || Dc(o)) && (d = mf(l))) : f = !1;
  }
  f && (a.set(l, d), i(d, l, n, s, a), a.delete(l)), Il(r, t, d);
}
function kf(r, e, t, n, i) {
  r !== e && q1(e, function(s, a) {
    if (i || (i = new $t()), In(s))
      R1(r, e, a, t, kf, n, i);
    else {
      var o = n ? n(Nl(r, a), s, a + "", r, e, i) : void 0;
      o === void 0 && (o = s), Il(r, a, o);
    }
  }, uf);
}
function _c(r, e) {
  return xf(r, e);
}
var An = ub(function(r, e, t) {
  kf(r, e, t);
}), B = /* @__PURE__ */ ((r) => (r[r.TYPE = 3] = "TYPE", r[r.LEVEL = 12] = "LEVEL", r[r.ATTRIBUTE = 13] = "ATTRIBUTE", r[r.BLOT = 14] = "BLOT", r[r.INLINE = 7] = "INLINE", r[r.BLOCK = 11] = "BLOCK", r[r.BLOCK_BLOT = 10] = "BLOCK_BLOT", r[r.INLINE_BLOT = 6] = "INLINE_BLOT", r[r.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", r[r.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", r[r.ANY = 15] = "ANY", r))(B || {});
class Ut {
  constructor(e, t, n = {}) {
    this.attrName = e, this.keyName = t;
    const i = B.TYPE & B.ATTRIBUTE;
    this.scope = n.scope != null ? (
      // Ignore type bits, force attribute bit
      n.scope & B.LEVEL | i
    ) : B.ATTRIBUTE, n.whitelist != null && (this.whitelist = n.whitelist);
  }
  static keys(e) {
    return Array.from(e.attributes).map((t) => t.name);
  }
  add(e, t) {
    return this.canAdd(e, t) ? (e.setAttribute(this.keyName, t), !0) : !1;
  }
  canAdd(e, t) {
    return this.whitelist == null ? !0 : typeof t == "string" ? this.whitelist.indexOf(t.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(t) > -1;
  }
  remove(e) {
    e.removeAttribute(this.keyName);
  }
  value(e) {
    const t = e.getAttribute(this.keyName);
    return this.canAdd(e, t) && t ? t : "";
  }
}
class Mr extends Error {
  constructor(e) {
    e = "[Parchment] " + e, super(e), this.message = e, this.name = this.constructor.name;
  }
}
const Sf = class Ol {
  constructor() {
    this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
  }
  static find(e, t = !1) {
    if (e == null)
      return null;
    if (this.blots.has(e))
      return this.blots.get(e) || null;
    if (t) {
      let n = null;
      try {
        n = e.parentNode;
      } catch {
        return null;
      }
      return this.find(n, t);
    }
    return null;
  }
  create(e, t, n) {
    const i = this.query(t);
    if (i == null)
      throw new Mr(`Unable to create ${t} blot`);
    const s = i, a = (
      // @ts-expect-error Fix me later
      t instanceof Node || t.nodeType === Node.TEXT_NODE ? t : s.create(n)
    ), o = new s(e, a, n);
    return Ol.blots.set(o.domNode, o), o;
  }
  find(e, t = !1) {
    return Ol.find(e, t);
  }
  query(e, t = B.ANY) {
    let n;
    return typeof e == "string" ? n = this.types[e] || this.attributes[e] : e instanceof Text || e.nodeType === Node.TEXT_NODE ? n = this.types.text : typeof e == "number" ? e & B.LEVEL & B.BLOCK ? n = this.types.block : e & B.LEVEL & B.INLINE && (n = this.types.inline) : e instanceof Element && ((e.getAttribute("class") || "").split(/\s+/).some((i) => (n = this.classes[i], !!n)), n = n || this.tags[e.tagName]), n == null ? null : "scope" in n && t & B.LEVEL & n.scope && t & B.TYPE & n.scope ? n : null;
  }
  register(...e) {
    return e.map((t) => {
      const n = "blotName" in t, i = "attrName" in t;
      if (!n && !i)
        throw new Mr("Invalid definition");
      if (n && t.blotName === "abstract")
        throw new Mr("Cannot register abstract class");
      const s = n ? t.blotName : i ? t.attrName : void 0;
      return this.types[s] = t, i ? typeof t.keyName == "string" && (this.attributes[t.keyName] = t) : n && (t.className && (this.classes[t.className] = t), t.tagName && (Array.isArray(t.tagName) ? t.tagName = t.tagName.map((a) => a.toUpperCase()) : t.tagName = t.tagName.toUpperCase(), (Array.isArray(t.tagName) ? t.tagName : [t.tagName]).forEach((a) => {
        (this.tags[a] == null || t.className == null) && (this.tags[a] = t);
      }))), t;
    });
  }
};
Sf.blots = /* @__PURE__ */ new WeakMap();
let Vr = Sf;
function Wu(r, e) {
  return (r.getAttribute("class") || "").split(/\s+/).filter((t) => t.indexOf(`${e}-`) === 0);
}
class P1 extends Ut {
  static keys(e) {
    return (e.getAttribute("class") || "").split(/\s+/).map((t) => t.split("-").slice(0, -1).join("-"));
  }
  add(e, t) {
    return this.canAdd(e, t) ? (this.remove(e), e.classList.add(`${this.keyName}-${t}`), !0) : !1;
  }
  remove(e) {
    Wu(e, this.keyName).forEach((t) => {
      e.classList.remove(t);
    }), e.classList.length === 0 && e.removeAttribute("class");
  }
  value(e) {
    const t = (Wu(e, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(e, t) ? t : "";
  }
}
const Et = P1;
function jo(r) {
  const e = r.split("-"), t = e.slice(1).map((n) => n[0].toUpperCase() + n.slice(1)).join("");
  return e[0] + t;
}
class B1 extends Ut {
  static keys(e) {
    return (e.getAttribute("style") || "").split(";").map((t) => t.split(":")[0].trim());
  }
  add(e, t) {
    return this.canAdd(e, t) ? (e.style[jo(this.keyName)] = t, !0) : !1;
  }
  remove(e) {
    e.style[jo(this.keyName)] = "", e.getAttribute("style") || e.removeAttribute("style");
  }
  value(e) {
    const t = e.style[jo(this.keyName)];
    return this.canAdd(e, t) ? t : "";
  }
}
const Nn = B1;
class F1 {
  constructor(e) {
    this.attributes = {}, this.domNode = e, this.build();
  }
  attribute(e, t) {
    t ? e.add(this.domNode, t) && (e.value(this.domNode) != null ? this.attributes[e.attrName] = e : delete this.attributes[e.attrName]) : (e.remove(this.domNode), delete this.attributes[e.attrName]);
  }
  build() {
    this.attributes = {};
    const e = Vr.find(this.domNode);
    if (e == null)
      return;
    const t = Ut.keys(this.domNode), n = Et.keys(this.domNode), i = Nn.keys(this.domNode);
    t.concat(n).concat(i).forEach((s) => {
      const a = e.scroll.query(s, B.ATTRIBUTE);
      a instanceof Ut && (this.attributes[a.attrName] = a);
    });
  }
  copy(e) {
    Object.keys(this.attributes).forEach((t) => {
      const n = this.attributes[t].value(this.domNode);
      e.format(t, n);
    });
  }
  move(e) {
    this.copy(e), Object.keys(this.attributes).forEach((t) => {
      this.attributes[t].remove(this.domNode);
    }), this.attributes = {};
  }
  values() {
    return Object.keys(this.attributes).reduce(
      (e, t) => (e[t] = this.attributes[t].value(this.domNode), e),
      {}
    );
  }
}
const Da = F1, Af = class {
  constructor(e, t) {
    this.scroll = e, this.domNode = t, Vr.blots.set(t, this), this.prev = null, this.next = null;
  }
  static create(e) {
    if (this.tagName == null)
      throw new Mr("Blot definition missing tagName");
    let t, n;
    return Array.isArray(this.tagName) ? (typeof e == "string" ? (n = e.toUpperCase(), parseInt(n, 10).toString() === n && (n = parseInt(n, 10))) : typeof e == "number" && (n = e), typeof n == "number" ? t = document.createElement(this.tagName[n - 1]) : n && this.tagName.indexOf(n) > -1 ? t = document.createElement(n) : t = document.createElement(this.tagName[0])) : t = document.createElement(this.tagName), this.className && t.classList.add(this.className), t;
  }
  // Hack for accessing inherited static methods
  get statics() {
    return this.constructor;
  }
  attach() {
  }
  clone() {
    const e = this.domNode.cloneNode(!1);
    return this.scroll.create(e);
  }
  detach() {
    this.parent != null && this.parent.removeChild(this), Vr.blots.delete(this.domNode);
  }
  deleteAt(e, t) {
    this.isolate(e, t).remove();
  }
  formatAt(e, t, n, i) {
    const s = this.isolate(e, t);
    if (this.scroll.query(n, B.BLOT) != null && i)
      s.wrap(n, i);
    else if (this.scroll.query(n, B.ATTRIBUTE) != null) {
      const a = this.scroll.create(this.statics.scope);
      s.wrap(a), a.format(n, i);
    }
  }
  insertAt(e, t, n) {
    const i = n == null ? this.scroll.create("text", t) : this.scroll.create(t, n), s = this.split(e);
    this.parent.insertBefore(i, s || void 0);
  }
  isolate(e, t) {
    const n = this.split(e);
    if (n == null)
      throw new Error("Attempt to isolate at end");
    return n.split(t), n;
  }
  length() {
    return 1;
  }
  offset(e = this.parent) {
    return this.parent == null || this === e ? 0 : this.parent.children.offset(this) + this.parent.offset(e);
  }
  optimize(e) {
    this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
  }
  remove() {
    this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
  }
  replaceWith(e, t) {
    const n = typeof e == "string" ? this.scroll.create(e, t) : e;
    return this.parent != null && (this.parent.insertBefore(n, this.next || void 0), this.remove()), n;
  }
  split(e, t) {
    return e === 0 ? this : this.next;
  }
  update(e, t) {
  }
  wrap(e, t) {
    const n = typeof e == "string" ? this.scroll.create(e, t) : e;
    if (this.parent != null && this.parent.insertBefore(n, this.next || void 0), typeof n.appendChild != "function")
      throw new Mr(`Cannot wrap ${e}`);
    return n.appendChild(this), n;
  }
};
Af.blotName = "abstract";
let Ef = Af;
const Cf = class extends Ef {
  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  static value(e) {
    return !0;
  }
  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */
  index(e, t) {
    return this.domNode === e || this.domNode.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(t, 1) : -1;
  }
  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */
  position(e, t) {
    let n = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
    return e > 0 && (n += 1), [this.parent.domNode, n];
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
Cf.scope = B.INLINE_BLOT;
let $1 = Cf;
const Ne = $1;
class j1 {
  constructor() {
    this.head = null, this.tail = null, this.length = 0;
  }
  append(...e) {
    if (this.insertBefore(e[0], null), e.length > 1) {
      const t = e.slice(1);
      this.append(...t);
    }
  }
  at(e) {
    const t = this.iterator();
    let n = t();
    for (; n && e > 0; )
      e -= 1, n = t();
    return n;
  }
  contains(e) {
    const t = this.iterator();
    let n = t();
    for (; n; ) {
      if (n === e)
        return !0;
      n = t();
    }
    return !1;
  }
  indexOf(e) {
    const t = this.iterator();
    let n = t(), i = 0;
    for (; n; ) {
      if (n === e)
        return i;
      i += 1, n = t();
    }
    return -1;
  }
  insertBefore(e, t) {
    e != null && (this.remove(e), e.next = t, t != null ? (e.prev = t.prev, t.prev != null && (t.prev.next = e), t.prev = e, t === this.head && (this.head = e)) : this.tail != null ? (this.tail.next = e, e.prev = this.tail, this.tail = e) : (e.prev = null, this.head = this.tail = e), this.length += 1);
  }
  offset(e) {
    let t = 0, n = this.head;
    for (; n != null; ) {
      if (n === e)
        return t;
      t += n.length(), n = n.next;
    }
    return -1;
  }
  remove(e) {
    this.contains(e) && (e.prev != null && (e.prev.next = e.next), e.next != null && (e.next.prev = e.prev), e === this.head && (this.head = e.next), e === this.tail && (this.tail = e.prev), this.length -= 1);
  }
  iterator(e = this.head) {
    return () => {
      const t = e;
      return e != null && (e = e.next), t;
    };
  }
  find(e, t = !1) {
    const n = this.iterator();
    let i = n();
    for (; i; ) {
      const s = i.length();
      if (e < s || t && e === s && (i.next == null || i.next.length() !== 0))
        return [i, e];
      e -= s, i = n();
    }
    return [null, 0];
  }
  forEach(e) {
    const t = this.iterator();
    let n = t();
    for (; n; )
      e(n), n = t();
  }
  forEachAt(e, t, n) {
    if (t <= 0)
      return;
    const [i, s] = this.find(e);
    let a = e - s;
    const o = this.iterator(i);
    let l = o();
    for (; l && a < e + t; ) {
      const c = l.length();
      e > a ? n(
        l,
        e - a,
        Math.min(t, a + c - e)
      ) : n(l, 0, Math.min(c, e + t - a)), a += c, l = o();
    }
  }
  map(e) {
    return this.reduce((t, n) => (t.push(e(n)), t), []);
  }
  reduce(e, t) {
    const n = this.iterator();
    let i = n();
    for (; i; )
      t = e(t, i), i = n();
    return t;
  }
}
function Qu(r, e) {
  const t = e.find(r);
  if (t)
    return t;
  try {
    return e.create(r);
  } catch {
    const n = e.create(B.INLINE);
    return Array.from(r.childNodes).forEach((i) => {
      n.domNode.appendChild(i);
    }), r.parentNode && r.parentNode.replaceChild(n.domNode, r), n.attach(), n;
  }
}
const Tf = class yn extends Ef {
  constructor(e, t) {
    super(e, t), this.uiNode = null, this.build();
  }
  appendChild(e) {
    this.insertBefore(e);
  }
  attach() {
    super.attach(), this.children.forEach((e) => {
      e.attach();
    });
  }
  attachUI(e) {
    this.uiNode != null && this.uiNode.remove(), this.uiNode = e, yn.uiClass && this.uiNode.classList.add(yn.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new j1(), Array.from(this.domNode.childNodes).filter((e) => e !== this.uiNode).reverse().forEach((e) => {
      try {
        const t = Qu(e, this.scroll);
        this.insertBefore(t, this.children.head || void 0);
      } catch (t) {
        if (t instanceof Mr)
          return;
        throw t;
      }
    });
  }
  deleteAt(e, t) {
    if (e === 0 && t === this.length())
      return this.remove();
    this.children.forEachAt(e, t, (n, i, s) => {
      n.deleteAt(i, s);
    });
  }
  descendant(e, t = 0) {
    const [n, i] = this.children.find(t);
    return e.blotName == null && e(n) || e.blotName != null && n instanceof e ? [n, i] : n instanceof yn ? n.descendant(e, i) : [null, -1];
  }
  descendants(e, t = 0, n = Number.MAX_VALUE) {
    let i = [], s = n;
    return this.children.forEachAt(
      t,
      n,
      (a, o, l) => {
        (e.blotName == null && e(a) || e.blotName != null && a instanceof e) && i.push(a), a instanceof yn && (i = i.concat(
          a.descendants(e, o, s)
        )), s -= l;
      }
    ), i;
  }
  detach() {
    this.children.forEach((e) => {
      e.detach();
    }), super.detach();
  }
  enforceAllowedChildren() {
    let e = !1;
    this.children.forEach((t) => {
      e || this.statics.allowedChildren.some(
        (n) => t instanceof n
      ) || (t.statics.scope === B.BLOCK_BLOT ? (t.next != null && this.splitAfter(t), t.prev != null && this.splitAfter(t.prev), t.parent.unwrap(), e = !0) : t instanceof yn ? t.unwrap() : t.remove());
    });
  }
  formatAt(e, t, n, i) {
    this.children.forEachAt(e, t, (s, a, o) => {
      s.formatAt(a, o, n, i);
    });
  }
  insertAt(e, t, n) {
    const [i, s] = this.children.find(e);
    if (i)
      i.insertAt(s, t, n);
    else {
      const a = n == null ? this.scroll.create("text", t) : this.scroll.create(t, n);
      this.appendChild(a);
    }
  }
  insertBefore(e, t) {
    e.parent != null && e.parent.children.remove(e);
    let n = null;
    this.children.insertBefore(e, t || null), e.parent = this, t != null && (n = t.domNode), (this.domNode.parentNode !== e.domNode || this.domNode.nextSibling !== n) && this.domNode.insertBefore(e.domNode, n), e.attach();
  }
  length() {
    return this.children.reduce((e, t) => e + t.length(), 0);
  }
  moveChildren(e, t) {
    this.children.forEach((n) => {
      e.insertBefore(n, t);
    });
  }
  optimize(e) {
    if (super.optimize(e), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0)
      if (this.statics.defaultChild != null) {
        const t = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(t);
      } else
        this.remove();
  }
  path(e, t = !1) {
    const [n, i] = this.children.find(e, t), s = [[this, e]];
    return n instanceof yn ? s.concat(n.path(i, t)) : (n != null && s.push([n, i]), s);
  }
  removeChild(e) {
    this.children.remove(e);
  }
  replaceWith(e, t) {
    const n = typeof e == "string" ? this.scroll.create(e, t) : e;
    return n instanceof yn && this.moveChildren(n), super.replaceWith(n);
  }
  split(e, t = !1) {
    if (!t) {
      if (e === 0)
        return this;
      if (e === this.length())
        return this.next;
    }
    const n = this.clone();
    return this.parent && this.parent.insertBefore(n, this.next || void 0), this.children.forEachAt(e, this.length(), (i, s, a) => {
      const o = i.split(s, t);
      o != null && n.appendChild(o);
    }), n;
  }
  splitAfter(e) {
    const t = this.clone();
    for (; e.next != null; )
      t.appendChild(e.next);
    return this.parent && this.parent.insertBefore(t, this.next || void 0), t;
  }
  unwrap() {
    this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
  }
  update(e, t) {
    const n = [], i = [];
    e.forEach((s) => {
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
      const o = Qu(s, this.scroll);
      (o.next !== a || o.next == null) && (o.parent != null && o.parent.removeChild(this), this.insertBefore(o, a || void 0));
    }), this.enforceAllowedChildren();
  }
};
Tf.uiClass = "";
let U1 = Tf;
const wt = U1;
function H1(r, e) {
  if (Object.keys(r).length !== Object.keys(e).length)
    return !1;
  for (const t in r)
    if (r[t] !== e[t])
      return !1;
  return !0;
}
const Sr = class Ar extends wt {
  static create(e) {
    return super.create(e);
  }
  static formats(e, t) {
    const n = t.query(Ar.blotName);
    if (!(n != null && e.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return e.tagName.toLowerCase();
    }
  }
  constructor(e, t) {
    super(e, t), this.attributes = new Da(this.domNode);
  }
  format(e, t) {
    if (e === this.statics.blotName && !t)
      this.children.forEach((n) => {
        n instanceof Ar || (n = n.wrap(Ar.blotName, !0)), this.attributes.copy(n);
      }), this.unwrap();
    else {
      const n = this.scroll.query(e, B.INLINE);
      if (n == null)
        return;
      n instanceof Ut ? this.attributes.attribute(n, t) : t && (e !== this.statics.blotName || this.formats()[e] !== t) && this.replaceWith(e, t);
    }
  }
  formats() {
    const e = this.attributes.values(), t = this.statics.formats(this.domNode, this.scroll);
    return t != null && (e[this.statics.blotName] = t), e;
  }
  formatAt(e, t, n, i) {
    this.formats()[n] != null || this.scroll.query(n, B.ATTRIBUTE) ? this.isolate(e, t).format(n, i) : super.formatAt(e, t, n, i);
  }
  optimize(e) {
    super.optimize(e);
    const t = this.formats();
    if (Object.keys(t).length === 0)
      return this.unwrap();
    const n = this.next;
    n instanceof Ar && n.prev === this && H1(t, n.formats()) && (n.moveChildren(this), n.remove());
  }
  replaceWith(e, t) {
    const n = super.replaceWith(e, t);
    return this.attributes.copy(n), n;
  }
  update(e, t) {
    super.update(e, t), e.some(
      (n) => n.target === this.domNode && n.type === "attributes"
    ) && this.attributes.build();
  }
  wrap(e, t) {
    const n = super.wrap(e, t);
    return n instanceof Ar && this.attributes.move(n), n;
  }
};
Sr.allowedChildren = [Sr, Ne], Sr.blotName = "inline", Sr.scope = B.INLINE_BLOT, Sr.tagName = "SPAN";
let V1 = Sr;
const zc = V1, Er = class Ml extends wt {
  static create(e) {
    return super.create(e);
  }
  static formats(e, t) {
    const n = t.query(Ml.blotName);
    if (!(n != null && e.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return e.tagName.toLowerCase();
    }
  }
  constructor(e, t) {
    super(e, t), this.attributes = new Da(this.domNode);
  }
  format(e, t) {
    const n = this.scroll.query(e, B.BLOCK);
    n != null && (n instanceof Ut ? this.attributes.attribute(n, t) : e === this.statics.blotName && !t ? this.replaceWith(Ml.blotName) : t && (e !== this.statics.blotName || this.formats()[e] !== t) && this.replaceWith(e, t));
  }
  formats() {
    const e = this.attributes.values(), t = this.statics.formats(this.domNode, this.scroll);
    return t != null && (e[this.statics.blotName] = t), e;
  }
  formatAt(e, t, n, i) {
    this.scroll.query(n, B.BLOCK) != null ? this.format(n, i) : super.formatAt(e, t, n, i);
  }
  insertAt(e, t, n) {
    if (n == null || this.scroll.query(t, B.INLINE) != null)
      super.insertAt(e, t, n);
    else {
      const i = this.split(e);
      if (i != null) {
        const s = this.scroll.create(t, n);
        i.parent.insertBefore(s, i);
      } else
        throw new Error("Attempt to insertAt after block boundaries");
    }
  }
  replaceWith(e, t) {
    const n = super.replaceWith(e, t);
    return this.attributes.copy(n), n;
  }
  update(e, t) {
    super.update(e, t), e.some(
      (n) => n.target === this.domNode && n.type === "attributes"
    ) && this.attributes.build();
  }
};
Er.blotName = "block", Er.scope = B.BLOCK_BLOT, Er.tagName = "P", Er.allowedChildren = [
  zc,
  Er,
  Ne
];
let Y1 = Er;
const Vi = Y1, ql = class extends wt {
  checkMerge() {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  }
  deleteAt(e, t) {
    super.deleteAt(e, t), this.enforceAllowedChildren();
  }
  formatAt(e, t, n, i) {
    super.formatAt(e, t, n, i), this.enforceAllowedChildren();
  }
  insertAt(e, t, n) {
    super.insertAt(e, t, n), this.enforceAllowedChildren();
  }
  optimize(e) {
    super.optimize(e), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
  }
};
ql.blotName = "container", ql.scope = B.BLOCK_BLOT;
let G1 = ql;
const Ia = G1;
class K1 extends Ne {
  static formats(e, t) {
  }
  format(e, t) {
    super.formatAt(0, this.length(), e, t);
  }
  formatAt(e, t, n, i) {
    e === 0 && t === this.length() ? this.format(n, i) : super.formatAt(e, t, n, i);
  }
  formats() {
    return this.statics.formats(this.domNode, this.scroll);
  }
}
const Ze = K1, W1 = {
  attributes: !0,
  characterData: !0,
  characterDataOldValue: !0,
  childList: !0,
  subtree: !0
}, Q1 = 100, Cr = class extends wt {
  constructor(e, t) {
    super(null, t), this.registry = e, this.scroll = this, this.build(), this.observer = new MutationObserver((n) => {
      this.update(n);
    }), this.observer.observe(this.domNode, W1), this.attach();
  }
  create(e, t) {
    return this.registry.create(this, e, t);
  }
  find(e, t = !1) {
    const n = this.registry.find(e, t);
    return n ? n.scroll === this ? n : t ? this.find(n.scroll.domNode.parentNode, !0) : null : null;
  }
  query(e, t = B.ANY) {
    return this.registry.query(e, t);
  }
  register(...e) {
    return this.registry.register(...e);
  }
  build() {
    this.scroll != null && super.build();
  }
  detach() {
    super.detach(), this.observer.disconnect();
  }
  deleteAt(e, t) {
    this.update(), e === 0 && t === this.length() ? this.children.forEach((n) => {
      n.remove();
    }) : super.deleteAt(e, t);
  }
  formatAt(e, t, n, i) {
    this.update(), super.formatAt(e, t, n, i);
  }
  insertAt(e, t, n) {
    this.update(), super.insertAt(e, t, n);
  }
  optimize(e = [], t = {}) {
    super.optimize(t);
    const n = t.mutationsMap || /* @__PURE__ */ new WeakMap();
    let i = Array.from(this.observer.takeRecords());
    for (; i.length > 0; )
      e.push(i.pop());
    const s = (l, c = !0) => {
      l == null || l === this || l.domNode.parentNode != null && (n.has(l.domNode) || n.set(l.domNode, []), c && s(l.parent));
    }, a = (l) => {
      n.has(l.domNode) && (l instanceof wt && l.children.forEach(a), n.delete(l.domNode), l.optimize(t));
    };
    let o = e;
    for (let l = 0; o.length > 0; l += 1) {
      if (l >= Q1)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (o.forEach((c) => {
        const d = this.find(c.target, !0);
        d != null && (d.domNode === c.target && (c.type === "childList" ? (s(this.find(c.previousSibling, !1)), Array.from(c.addedNodes).forEach((f) => {
          const h = this.find(f, !1);
          s(h, !1), h instanceof wt && h.children.forEach((g) => {
            s(g, !1);
          });
        })) : c.type === "attributes" && s(d.prev)), s(d));
      }), this.children.forEach(a), o = Array.from(this.observer.takeRecords()), i = o.slice(); i.length > 0; )
        e.push(i.pop());
    }
  }
  update(e, t = {}) {
    e = e || this.observer.takeRecords();
    const n = /* @__PURE__ */ new WeakMap();
    e.map((i) => {
      const s = this.find(i.target, !0);
      return s == null ? null : n.has(s.domNode) ? (n.get(s.domNode).push(i), null) : (n.set(s.domNode, [i]), s);
    }).forEach((i) => {
      i != null && i !== this && n.has(i.domNode) && i.update(n.get(i.domNode) || [], t);
    }), t.mutationsMap = n, n.has(this.domNode) && super.update(n.get(this.domNode), t), this.optimize(e, t);
  }
};
Cr.blotName = "scroll", Cr.defaultChild = Vi, Cr.allowedChildren = [Vi, Ia], Cr.scope = B.BLOCK_BLOT, Cr.tagName = "DIV";
let Z1 = Cr;
const Rc = Z1, _l = class Lf extends Ne {
  static create(e) {
    return document.createTextNode(e);
  }
  static value(e) {
    return e.data;
  }
  constructor(e, t) {
    super(e, t), this.text = this.statics.value(this.domNode);
  }
  deleteAt(e, t) {
    this.domNode.data = this.text = this.text.slice(0, e) + this.text.slice(e + t);
  }
  index(e, t) {
    return this.domNode === e ? t : -1;
  }
  insertAt(e, t, n) {
    n == null ? (this.text = this.text.slice(0, e) + t + this.text.slice(e), this.domNode.data = this.text) : super.insertAt(e, t, n);
  }
  length() {
    return this.text.length;
  }
  optimize(e) {
    super.optimize(e), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof Lf && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
  }
  position(e, t = !1) {
    return [this.domNode, e];
  }
  split(e, t = !1) {
    if (!t) {
      if (e === 0)
        return this;
      if (e === this.length())
        return this.next;
    }
    const n = this.scroll.create(this.domNode.splitText(e));
    return this.parent.insertBefore(n, this.next || void 0), this.text = this.statics.value(this.domNode), n;
  }
  update(e, t) {
    e.some((n) => n.type === "characterData" && n.target === this.domNode) && (this.text = this.statics.value(this.domNode));
  }
  value() {
    return this.text;
  }
};
_l.blotName = "text", _l.scope = B.INLINE_BLOT;
let X1 = _l;
const la = X1, J1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Attributor: Ut,
  AttributorStore: Da,
  BlockBlot: Vi,
  ClassAttributor: Et,
  ContainerBlot: Ia,
  EmbedBlot: Ze,
  InlineBlot: zc,
  LeafBlot: Ne,
  ParentBlot: wt,
  Registry: Vr,
  Scope: B,
  ScrollBlot: Rc,
  StyleAttributor: Nn,
  TextBlot: la
}, Symbol.toStringTag, { value: "Module" }));
var xn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Df(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var zl = { exports: {} }, We = -1, Pe = 1, we = 0;
function Yi(r, e, t, n, i) {
  if (r === e)
    return r ? [[we, r]] : [];
  if (t != null) {
    var s = l0(r, e, t);
    if (s)
      return s;
  }
  var a = Pc(r, e), o = r.substring(0, a);
  r = r.substring(a), e = e.substring(a), a = Na(r, e);
  var l = r.substring(r.length - a);
  r = r.substring(0, r.length - a), e = e.substring(0, e.length - a);
  var c = e0(r, e);
  return o && c.unshift([we, o]), l && c.push([we, l]), Bc(c, i), n && r0(c), c;
}
function e0(r, e) {
  var t;
  if (!r)
    return [[Pe, e]];
  if (!e)
    return [[We, r]];
  var n = r.length > e.length ? r : e, i = r.length > e.length ? e : r, s = n.indexOf(i);
  if (s !== -1)
    return t = [
      [Pe, n.substring(0, s)],
      [we, i],
      [Pe, n.substring(s + i.length)]
    ], r.length > e.length && (t[0][0] = t[2][0] = We), t;
  if (i.length === 1)
    return [
      [We, r],
      [Pe, e]
    ];
  var a = n0(r, e);
  if (a) {
    var o = a[0], l = a[1], c = a[2], d = a[3], f = a[4], h = Yi(o, c), g = Yi(l, d);
    return h.concat([[we, f]], g);
  }
  return t0(r, e);
}
function t0(r, e) {
  for (var t = r.length, n = e.length, i = Math.ceil((t + n) / 2), s = i, a = 2 * i, o = new Array(a), l = new Array(a), c = 0; c < a; c++)
    o[c] = -1, l[c] = -1;
  o[s + 1] = 0, l[s + 1] = 0;
  for (var d = t - n, f = d % 2 !== 0, h = 0, g = 0, m = 0, y = 0, x = 0; x < i; x++) {
    for (var w = -x + h; w <= x - g; w += 2) {
      var S = s + w, E;
      w === -x || w !== x && o[S - 1] < o[S + 1] ? E = o[S + 1] : E = o[S - 1] + 1;
      for (var C = E - w; E < t && C < n && r.charAt(E) === e.charAt(C); )
        E++, C++;
      if (o[S] = E, E > t)
        g += 2;
      else if (C > n)
        h += 2;
      else if (f) {
        var I = s + d - w;
        if (I >= 0 && I < a && l[I] !== -1) {
          var M = t - l[I];
          if (E >= M)
            return Zu(r, e, E, C);
        }
      }
    }
    for (var O = -x + m; O <= x - y; O += 2) {
      var I = s + O, M;
      O === -x || O !== x && l[I - 1] < l[I + 1] ? M = l[I + 1] : M = l[I - 1] + 1;
      for (var k = M - O; M < t && k < n && r.charAt(t - M - 1) === e.charAt(n - k - 1); )
        M++, k++;
      if (l[I] = M, M > t)
        y += 2;
      else if (k > n)
        m += 2;
      else if (!f) {
        var S = s + d - O;
        if (S >= 0 && S < a && o[S] !== -1) {
          var E = o[S], C = s + E - S;
          if (M = t - M, E >= M)
            return Zu(r, e, E, C);
        }
      }
    }
  }
  return [
    [We, r],
    [Pe, e]
  ];
}
function Zu(r, e, t, n) {
  var i = r.substring(0, t), s = e.substring(0, n), a = r.substring(t), o = e.substring(n), l = Yi(i, s), c = Yi(a, o);
  return l.concat(c);
}
function Pc(r, e) {
  if (!r || !e || r.charAt(0) !== e.charAt(0))
    return 0;
  for (var t = 0, n = Math.min(r.length, e.length), i = n, s = 0; t < i; )
    r.substring(s, i) == e.substring(s, i) ? (t = i, s = t) : n = i, i = Math.floor((n - t) / 2 + t);
  return If(r.charCodeAt(i - 1)) && i--, i;
}
function Xu(r, e) {
  var t = r.length, n = e.length;
  if (t == 0 || n == 0)
    return 0;
  t > n ? r = r.substring(t - n) : t < n && (e = e.substring(0, t));
  var i = Math.min(t, n);
  if (r == e)
    return i;
  for (var s = 0, a = 1; ; ) {
    var o = r.substring(i - a), l = e.indexOf(o);
    if (l == -1)
      return s;
    a += l, (l == 0 || r.substring(i - a) == e.substring(0, a)) && (s = a, a++);
  }
}
function Na(r, e) {
  if (!r || !e || r.slice(-1) !== e.slice(-1))
    return 0;
  for (var t = 0, n = Math.min(r.length, e.length), i = n, s = 0; t < i; )
    r.substring(r.length - i, r.length - s) == e.substring(e.length - i, e.length - s) ? (t = i, s = t) : n = i, i = Math.floor((n - t) / 2 + t);
  return Nf(r.charCodeAt(r.length - i)) && i--, i;
}
function n0(r, e) {
  var t = r.length > e.length ? r : e, n = r.length > e.length ? e : r;
  if (t.length < 4 || n.length * 2 < t.length)
    return null;
  function i(g, m, y) {
    for (var x = g.substring(y, y + Math.floor(g.length / 4)), w = -1, S = "", E, C, I, M; (w = m.indexOf(x, w + 1)) !== -1; ) {
      var O = Pc(
        g.substring(y),
        m.substring(w)
      ), k = Na(
        g.substring(0, y),
        m.substring(0, w)
      );
      S.length < k + O && (S = m.substring(w - k, w) + m.substring(w, w + O), E = g.substring(0, y - k), C = g.substring(y + O), I = m.substring(0, w - k), M = m.substring(w + O));
    }
    return S.length * 2 >= g.length ? [
      E,
      C,
      I,
      M,
      S
    ] : null;
  }
  var s = i(
    t,
    n,
    Math.ceil(t.length / 4)
  ), a = i(
    t,
    n,
    Math.ceil(t.length / 2)
  ), o;
  if (!s && !a)
    return null;
  a ? s ? o = s[4].length > a[4].length ? s : a : o = a : o = s;
  var l, c, d, f;
  r.length > e.length ? (l = o[0], c = o[1], d = o[2], f = o[3]) : (d = o[0], f = o[1], l = o[2], c = o[3]);
  var h = o[4];
  return [l, c, d, f, h];
}
function r0(r) {
  for (var e = !1, t = [], n = 0, i = null, s = 0, a = 0, o = 0, l = 0, c = 0; s < r.length; )
    r[s][0] == we ? (t[n++] = s, a = l, o = c, l = 0, c = 0, i = r[s][1]) : (r[s][0] == Pe ? l += r[s][1].length : c += r[s][1].length, i && i.length <= Math.max(a, o) && i.length <= Math.max(l, c) && (r.splice(t[n - 1], 0, [
      We,
      i
    ]), r[t[n - 1] + 1][0] = Pe, n--, n--, s = n > 0 ? t[n - 1] : -1, a = 0, o = 0, l = 0, c = 0, i = null, e = !0)), s++;
  for (e && Bc(r), a0(r), s = 1; s < r.length; ) {
    if (r[s - 1][0] == We && r[s][0] == Pe) {
      var d = r[s - 1][1], f = r[s][1], h = Xu(d, f), g = Xu(f, d);
      h >= g ? (h >= d.length / 2 || h >= f.length / 2) && (r.splice(s, 0, [
        we,
        f.substring(0, h)
      ]), r[s - 1][1] = d.substring(
        0,
        d.length - h
      ), r[s + 1][1] = f.substring(h), s++) : (g >= d.length / 2 || g >= f.length / 2) && (r.splice(s, 0, [
        we,
        d.substring(0, g)
      ]), r[s - 1][0] = Pe, r[s - 1][1] = f.substring(
        0,
        f.length - g
      ), r[s + 1][0] = We, r[s + 1][1] = d.substring(g), s++), s++;
    }
    s++;
  }
}
var Ju = /[^a-zA-Z0-9]/, ed = /\s/, td = /[\r\n]/, i0 = /\n\r?\n$/, s0 = /^\r?\n\r?\n/;
function a0(r) {
  function e(g, m) {
    if (!g || !m)
      return 6;
    var y = g.charAt(g.length - 1), x = m.charAt(0), w = y.match(Ju), S = x.match(Ju), E = w && y.match(ed), C = S && x.match(ed), I = E && y.match(td), M = C && x.match(td), O = I && g.match(i0), k = M && m.match(s0);
    return O || k ? 5 : I || M ? 4 : w && !E && C ? 3 : E || C ? 2 : w || S ? 1 : 0;
  }
  for (var t = 1; t < r.length - 1; ) {
    if (r[t - 1][0] == we && r[t + 1][0] == we) {
      var n = r[t - 1][1], i = r[t][1], s = r[t + 1][1], a = Na(n, i);
      if (a) {
        var o = i.substring(i.length - a);
        n = n.substring(0, n.length - a), i = o + i.substring(0, i.length - a), s = o + s;
      }
      for (var l = n, c = i, d = s, f = e(n, i) + e(i, s); i.charAt(0) === s.charAt(0); ) {
        n += i.charAt(0), i = i.substring(1) + s.charAt(0), s = s.substring(1);
        var h = e(n, i) + e(i, s);
        h >= f && (f = h, l = n, c = i, d = s);
      }
      r[t - 1][1] != l && (l ? r[t - 1][1] = l : (r.splice(t - 1, 1), t--), r[t][1] = c, d ? r[t + 1][1] = d : (r.splice(t + 1, 1), t--));
    }
    t++;
  }
}
function Bc(r, e) {
  r.push([we, ""]);
  for (var t = 0, n = 0, i = 0, s = "", a = "", o; t < r.length; ) {
    if (t < r.length - 1 && !r[t][1]) {
      r.splice(t, 1);
      continue;
    }
    switch (r[t][0]) {
      case Pe:
        i++, a += r[t][1], t++;
        break;
      case We:
        n++, s += r[t][1], t++;
        break;
      case we:
        var l = t - i - n - 1;
        if (e) {
          if (l >= 0 && Mf(r[l][1])) {
            var c = r[l][1].slice(-1);
            if (r[l][1] = r[l][1].slice(
              0,
              -1
            ), s = c + s, a = c + a, !r[l][1]) {
              r.splice(l, 1), t--;
              var d = l - 1;
              r[d] && r[d][0] === Pe && (i++, a = r[d][1] + a, d--), r[d] && r[d][0] === We && (n++, s = r[d][1] + s, d--), l = d;
            }
          }
          if (Of(r[t][1])) {
            var c = r[t][1].charAt(0);
            r[t][1] = r[t][1].slice(1), s += c, a += c;
          }
        }
        if (t < r.length - 1 && !r[t][1]) {
          r.splice(t, 1);
          break;
        }
        if (s.length > 0 || a.length > 0) {
          s.length > 0 && a.length > 0 && (o = Pc(a, s), o !== 0 && (l >= 0 ? r[l][1] += a.substring(
            0,
            o
          ) : (r.splice(0, 0, [
            we,
            a.substring(0, o)
          ]), t++), a = a.substring(o), s = s.substring(o)), o = Na(a, s), o !== 0 && (r[t][1] = a.substring(a.length - o) + r[t][1], a = a.substring(
            0,
            a.length - o
          ), s = s.substring(
            0,
            s.length - o
          )));
          var f = i + n;
          s.length === 0 && a.length === 0 ? (r.splice(t - f, f), t = t - f) : s.length === 0 ? (r.splice(t - f, f, [Pe, a]), t = t - f + 1) : a.length === 0 ? (r.splice(t - f, f, [We, s]), t = t - f + 1) : (r.splice(
            t - f,
            f,
            [We, s],
            [Pe, a]
          ), t = t - f + 2);
        }
        t !== 0 && r[t - 1][0] === we ? (r[t - 1][1] += r[t][1], r.splice(t, 1)) : t++, i = 0, n = 0, s = "", a = "";
        break;
    }
  }
  r[r.length - 1][1] === "" && r.pop();
  var h = !1;
  for (t = 1; t < r.length - 1; )
    r[t - 1][0] === we && r[t + 1][0] === we && (r[t][1].substring(
      r[t][1].length - r[t - 1][1].length
    ) === r[t - 1][1] ? (r[t][1] = r[t - 1][1] + r[t][1].substring(
      0,
      r[t][1].length - r[t - 1][1].length
    ), r[t + 1][1] = r[t - 1][1] + r[t + 1][1], r.splice(t - 1, 1), h = !0) : r[t][1].substring(0, r[t + 1][1].length) == r[t + 1][1] && (r[t - 1][1] += r[t + 1][1], r[t][1] = r[t][1].substring(r[t + 1][1].length) + r[t + 1][1], r.splice(t + 1, 1), h = !0)), t++;
  h && Bc(r, e);
}
function If(r) {
  return r >= 55296 && r <= 56319;
}
function Nf(r) {
  return r >= 56320 && r <= 57343;
}
function Of(r) {
  return Nf(r.charCodeAt(0));
}
function Mf(r) {
  return If(r.charCodeAt(r.length - 1));
}
function o0(r) {
  for (var e = [], t = 0; t < r.length; t++)
    r[t][1].length > 0 && e.push(r[t]);
  return e;
}
function Uo(r, e, t, n) {
  return Mf(r) || Of(n) ? null : o0([
    [we, r],
    [We, e],
    [Pe, t],
    [we, n]
  ]);
}
function l0(r, e, t) {
  var n = typeof t == "number" ? { index: t, length: 0 } : t.oldRange, i = typeof t == "number" ? null : t.newRange, s = r.length, a = e.length;
  if (n.length === 0 && (i === null || i.length === 0)) {
    var o = n.index, l = r.slice(0, o), c = r.slice(o), d = i ? i.index : null;
    e: {
      var f = o + a - s;
      if (d !== null && d !== f || f < 0 || f > a)
        break e;
      var h = e.slice(0, f), g = e.slice(f);
      if (g !== c)
        break e;
      var m = Math.min(o, f), y = l.slice(0, m), x = h.slice(0, m);
      if (y !== x)
        break e;
      var w = l.slice(m), S = h.slice(m);
      return Uo(y, w, S, c);
    }
    e: {
      if (d !== null && d !== o)
        break e;
      var E = o, h = e.slice(0, E), g = e.slice(E);
      if (h !== l)
        break e;
      var C = Math.min(s - E, a - E), I = c.slice(c.length - C), M = g.slice(g.length - C);
      if (I !== M)
        break e;
      var w = c.slice(0, c.length - C), S = g.slice(0, g.length - C);
      return Uo(l, w, S, I);
    }
  }
  if (n.length > 0 && i && i.length === 0)
    e: {
      var y = r.slice(0, n.index), I = r.slice(n.index + n.length), m = y.length, C = I.length;
      if (a < m + C)
        break e;
      var x = e.slice(0, m), M = e.slice(a - C);
      if (y !== x || I !== M)
        break e;
      var w = r.slice(m, s - C), S = e.slice(m, a - C);
      return Uo(y, w, S, I);
    }
  return null;
}
function Oa(r, e, t, n) {
  return Yi(r, e, t, n, !0);
}
Oa.INSERT = Pe;
Oa.DELETE = We;
Oa.EQUAL = we;
var c0 = Oa, ca = { exports: {} };
ca.exports;
(function(r, e) {
  var t = 200, n = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", l = "[object Date]", c = "[object Error]", d = "[object Function]", f = "[object GeneratorFunction]", h = "[object Map]", g = "[object Number]", m = "[object Object]", y = "[object Promise]", x = "[object RegExp]", w = "[object Set]", S = "[object String]", E = "[object Symbol]", C = "[object WeakMap]", I = "[object ArrayBuffer]", M = "[object DataView]", O = "[object Float32Array]", k = "[object Float64Array]", A = "[object Int8Array]", _ = "[object Int16Array]", N = "[object Int32Array]", V = "[object Uint8Array]", fe = "[object Uint8ClampedArray]", ie = "[object Uint16Array]", Ye = "[object Uint32Array]", Fe = /[\\^$.*+?()[\]{}|]/g, ni = /\w*$/, Lt = /^\[object .+?Constructor\]$/, Dt = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[a] = U[I] = U[M] = U[o] = U[l] = U[O] = U[k] = U[A] = U[_] = U[N] = U[h] = U[g] = U[m] = U[x] = U[w] = U[S] = U[E] = U[V] = U[fe] = U[ie] = U[Ye] = !0, U[c] = U[d] = U[C] = !1;
  var It = typeof xn == "object" && xn && xn.Object === Object && xn, Nt = typeof self == "object" && self && self.Object === Object && self, ut = It || Nt || Function("return this")(), ls = e && !e.nodeType && e, te = ls && !0 && r && !r.nodeType && r, cs = te && te.exports === ls;
  function Ka(u, p) {
    return u.set(p[0], p[1]), u;
  }
  function dt(u, p) {
    return u.add(p), u;
  }
  function us(u, p) {
    for (var v = -1, L = u ? u.length : 0; ++v < L && p(u[v], v, u) !== !1; )
      ;
    return u;
  }
  function ds(u, p) {
    for (var v = -1, L = p.length, j = u.length; ++v < L; )
      u[j + v] = p[v];
    return u;
  }
  function ri(u, p, v, L) {
    for (var j = -1, F = u ? u.length : 0; ++j < F; )
      v = p(v, u[j], j, u);
    return v;
  }
  function ii(u, p) {
    for (var v = -1, L = Array(u); ++v < u; )
      L[v] = p(v);
    return L;
  }
  function hs(u, p) {
    return u == null ? void 0 : u[p];
  }
  function si(u) {
    var p = !1;
    if (u != null && typeof u.toString != "function")
      try {
        p = !!(u + "");
      } catch {
      }
    return p;
  }
  function fs(u) {
    var p = -1, v = Array(u.size);
    return u.forEach(function(L, j) {
      v[++p] = [j, L];
    }), v;
  }
  function ai(u, p) {
    return function(v) {
      return u(p(v));
    };
  }
  function ps(u) {
    var p = -1, v = Array(u.size);
    return u.forEach(function(L) {
      v[++p] = L;
    }), v;
  }
  var Wa = Array.prototype, Qa = Function.prototype, or = Object.prototype, oi = ut["__core-js_shared__"], gs = function() {
    var u = /[^.]+$/.exec(oi && oi.keys && oi.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), ms = Qa.toString, Ot = or.hasOwnProperty, lr = or.toString, Za = RegExp(
    "^" + ms.call(Ot).replace(Fe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), On = cs ? ut.Buffer : void 0, cr = ut.Symbol, li = ut.Uint8Array, Je = ai(Object.getPrototypeOf, Object), bs = Object.create, ys = or.propertyIsEnumerable, Xa = Wa.splice, ci = Object.getOwnPropertySymbols, ur = On ? On.isBuffer : void 0, vs = ai(Object.keys, Object), dr = ft(ut, "DataView"), Mn = ft(ut, "Map"), ht = ft(ut, "Promise"), hr = ft(ut, "Set"), ui = ft(ut, "WeakMap"), qn = ft(Object, "create"), di = ze(dr), _n = ze(Mn), hi = ze(ht), fi = ze(hr), pi = ze(ui), hn = cr ? cr.prototype : void 0, ws = hn ? hn.valueOf : void 0;
  function Zt(u) {
    var p = -1, v = u ? u.length : 0;
    for (this.clear(); ++p < v; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function Ja() {
    this.__data__ = qn ? qn(null) : {};
  }
  function eo(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function to(u) {
    var p = this.__data__;
    if (qn) {
      var v = p[u];
      return v === n ? void 0 : v;
    }
    return Ot.call(p, u) ? p[u] : void 0;
  }
  function xs(u) {
    var p = this.__data__;
    return qn ? p[u] !== void 0 : Ot.call(p, u);
  }
  function gi(u, p) {
    var v = this.__data__;
    return v[u] = qn && p === void 0 ? n : p, this;
  }
  Zt.prototype.clear = Ja, Zt.prototype.delete = eo, Zt.prototype.get = to, Zt.prototype.has = xs, Zt.prototype.set = gi;
  function Se(u) {
    var p = -1, v = u ? u.length : 0;
    for (this.clear(); ++p < v; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function no() {
    this.__data__ = [];
  }
  function ro(u) {
    var p = this.__data__, v = pr(p, u);
    if (v < 0)
      return !1;
    var L = p.length - 1;
    return v == L ? p.pop() : Xa.call(p, v, 1), !0;
  }
  function io(u) {
    var p = this.__data__, v = pr(p, u);
    return v < 0 ? void 0 : p[v][1];
  }
  function so(u) {
    return pr(this.__data__, u) > -1;
  }
  function ao(u, p) {
    var v = this.__data__, L = pr(v, u);
    return L < 0 ? v.push([u, p]) : v[L][1] = p, this;
  }
  Se.prototype.clear = no, Se.prototype.delete = ro, Se.prototype.get = io, Se.prototype.has = so, Se.prototype.set = ao;
  function Ce(u) {
    var p = -1, v = u ? u.length : 0;
    for (this.clear(); ++p < v; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function oo() {
    this.__data__ = {
      hash: new Zt(),
      map: new (Mn || Se)(),
      string: new Zt()
    };
  }
  function lo(u) {
    return Rn(this, u).delete(u);
  }
  function co(u) {
    return Rn(this, u).get(u);
  }
  function uo(u) {
    return Rn(this, u).has(u);
  }
  function ho(u, p) {
    return Rn(this, u).set(u, p), this;
  }
  Ce.prototype.clear = oo, Ce.prototype.delete = lo, Ce.prototype.get = co, Ce.prototype.has = uo, Ce.prototype.set = ho;
  function $e(u) {
    this.__data__ = new Se(u);
  }
  function fo() {
    this.__data__ = new Se();
  }
  function po(u) {
    return this.__data__.delete(u);
  }
  function go(u) {
    return this.__data__.get(u);
  }
  function mo(u) {
    return this.__data__.has(u);
  }
  function bo(u, p) {
    var v = this.__data__;
    if (v instanceof Se) {
      var L = v.__data__;
      if (!Mn || L.length < t - 1)
        return L.push([u, p]), this;
      v = this.__data__ = new Ce(L);
    }
    return v.set(u, p), this;
  }
  $e.prototype.clear = fo, $e.prototype.delete = po, $e.prototype.get = go, $e.prototype.has = mo, $e.prototype.set = bo;
  function fr(u, p) {
    var v = vi(u) || mr(u) ? ii(u.length, String) : [], L = v.length, j = !!L;
    for (var F in u)
      Ot.call(u, F) && !(j && (F == "length" || No(F, L))) && v.push(F);
    return v;
  }
  function ks(u, p, v) {
    var L = u[p];
    (!(Ot.call(u, p) && Ts(L, v)) || v === void 0 && !(p in u)) && (u[p] = v);
  }
  function pr(u, p) {
    for (var v = u.length; v--; )
      if (Ts(u[v][0], p))
        return v;
    return -1;
  }
  function Mt(u, p) {
    return u && yi(p, xi(p), u);
  }
  function mi(u, p, v, L, j, F, Q) {
    var W;
    if (L && (W = F ? L(u, j, F, Q) : L(u)), W !== void 0)
      return W;
    if (!_t(u))
      return u;
    var pe = vi(u);
    if (pe) {
      if (W = Do(u), !p)
        return Co(u, W);
    } else {
      var J = Jt(u), Te = J == d || J == f;
      if (Ls(u))
        return gr(u, p);
      if (J == m || J == s || Te && !F) {
        if (si(u))
          return F ? u : {};
        if (W = qt(Te ? {} : u), !p)
          return To(u, Mt(W, u));
      } else {
        if (!U[J])
          return F ? u : {};
        W = Io(u, J, mi, p);
      }
    }
    Q || (Q = new $e());
    var je = Q.get(u);
    if (je)
      return je;
    if (Q.set(u, W), !pe)
      var ye = v ? Lo(u) : xi(u);
    return us(ye || u, function(Le, Ae) {
      ye && (Ae = Le, Le = u[Ae]), ks(W, Ae, mi(Le, p, v, L, Ae, u, Q));
    }), W;
  }
  function yo(u) {
    return _t(u) ? bs(u) : {};
  }
  function vo(u, p, v) {
    var L = p(u);
    return vi(u) ? L : ds(L, v(u));
  }
  function wo(u) {
    return lr.call(u);
  }
  function xo(u) {
    if (!_t(u) || Mo(u))
      return !1;
    var p = wi(u) || si(u) ? Za : Lt;
    return p.test(ze(u));
  }
  function ko(u) {
    if (!Es(u))
      return vs(u);
    var p = [];
    for (var v in Object(u))
      Ot.call(u, v) && v != "constructor" && p.push(v);
    return p;
  }
  function gr(u, p) {
    if (p)
      return u.slice();
    var v = new u.constructor(u.length);
    return u.copy(v), v;
  }
  function bi(u) {
    var p = new u.constructor(u.byteLength);
    return new li(p).set(new li(u)), p;
  }
  function zn(u, p) {
    var v = p ? bi(u.buffer) : u.buffer;
    return new u.constructor(v, u.byteOffset, u.byteLength);
  }
  function Ss(u, p, v) {
    var L = p ? v(fs(u), !0) : fs(u);
    return ri(L, Ka, new u.constructor());
  }
  function As(u) {
    var p = new u.constructor(u.source, ni.exec(u));
    return p.lastIndex = u.lastIndex, p;
  }
  function So(u, p, v) {
    var L = p ? v(ps(u), !0) : ps(u);
    return ri(L, dt, new u.constructor());
  }
  function Ao(u) {
    return ws ? Object(ws.call(u)) : {};
  }
  function Eo(u, p) {
    var v = p ? bi(u.buffer) : u.buffer;
    return new u.constructor(v, u.byteOffset, u.length);
  }
  function Co(u, p) {
    var v = -1, L = u.length;
    for (p || (p = Array(L)); ++v < L; )
      p[v] = u[v];
    return p;
  }
  function yi(u, p, v, L) {
    v || (v = {});
    for (var j = -1, F = p.length; ++j < F; ) {
      var Q = p[j], W = void 0;
      ks(v, Q, W === void 0 ? u[Q] : W);
    }
    return v;
  }
  function To(u, p) {
    return yi(u, Xt(u), p);
  }
  function Lo(u) {
    return vo(u, xi, Xt);
  }
  function Rn(u, p) {
    var v = u.__data__;
    return Oo(p) ? v[typeof p == "string" ? "string" : "hash"] : v.map;
  }
  function ft(u, p) {
    var v = hs(u, p);
    return xo(v) ? v : void 0;
  }
  var Xt = ci ? ai(ci, Object) : _o, Jt = wo;
  (dr && Jt(new dr(new ArrayBuffer(1))) != M || Mn && Jt(new Mn()) != h || ht && Jt(ht.resolve()) != y || hr && Jt(new hr()) != w || ui && Jt(new ui()) != C) && (Jt = function(u) {
    var p = lr.call(u), v = p == m ? u.constructor : void 0, L = v ? ze(v) : void 0;
    if (L)
      switch (L) {
        case di:
          return M;
        case _n:
          return h;
        case hi:
          return y;
        case fi:
          return w;
        case pi:
          return C;
      }
    return p;
  });
  function Do(u) {
    var p = u.length, v = u.constructor(p);
    return p && typeof u[0] == "string" && Ot.call(u, "index") && (v.index = u.index, v.input = u.input), v;
  }
  function qt(u) {
    return typeof u.constructor == "function" && !Es(u) ? yo(Je(u)) : {};
  }
  function Io(u, p, v, L) {
    var j = u.constructor;
    switch (p) {
      case I:
        return bi(u);
      case o:
      case l:
        return new j(+u);
      case M:
        return zn(u, L);
      case O:
      case k:
      case A:
      case _:
      case N:
      case V:
      case fe:
      case ie:
      case Ye:
        return Eo(u, L);
      case h:
        return Ss(u, L, v);
      case g:
      case S:
        return new j(u);
      case x:
        return As(u);
      case w:
        return So(u, L, v);
      case E:
        return Ao(u);
    }
  }
  function No(u, p) {
    return p = p ?? i, !!p && (typeof u == "number" || Dt.test(u)) && u > -1 && u % 1 == 0 && u < p;
  }
  function Oo(u) {
    var p = typeof u;
    return p == "string" || p == "number" || p == "symbol" || p == "boolean" ? u !== "__proto__" : u === null;
  }
  function Mo(u) {
    return !!gs && gs in u;
  }
  function Es(u) {
    var p = u && u.constructor, v = typeof p == "function" && p.prototype || or;
    return u === v;
  }
  function ze(u) {
    if (u != null) {
      try {
        return ms.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function Cs(u) {
    return mi(u, !0, !0);
  }
  function Ts(u, p) {
    return u === p || u !== u && p !== p;
  }
  function mr(u) {
    return qo(u) && Ot.call(u, "callee") && (!ys.call(u, "callee") || lr.call(u) == s);
  }
  var vi = Array.isArray;
  function br(u) {
    return u != null && Ds(u.length) && !wi(u);
  }
  function qo(u) {
    return Is(u) && br(u);
  }
  var Ls = ur || zo;
  function wi(u) {
    var p = _t(u) ? lr.call(u) : "";
    return p == d || p == f;
  }
  function Ds(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= i;
  }
  function _t(u) {
    var p = typeof u;
    return !!u && (p == "object" || p == "function");
  }
  function Is(u) {
    return !!u && typeof u == "object";
  }
  function xi(u) {
    return br(u) ? fr(u) : ko(u);
  }
  function _o() {
    return [];
  }
  function zo() {
    return !1;
  }
  r.exports = Cs;
})(ca, ca.exports);
var qf = ca.exports, ua = { exports: {} };
ua.exports;
(function(r, e) {
  var t = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, o = "[object Arguments]", l = "[object Array]", c = "[object AsyncFunction]", d = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", m = "[object GeneratorFunction]", y = "[object Map]", x = "[object Number]", w = "[object Null]", S = "[object Object]", E = "[object Promise]", C = "[object Proxy]", I = "[object RegExp]", M = "[object Set]", O = "[object String]", k = "[object Symbol]", A = "[object Undefined]", _ = "[object WeakMap]", N = "[object ArrayBuffer]", V = "[object DataView]", fe = "[object Float32Array]", ie = "[object Float64Array]", Ye = "[object Int8Array]", Fe = "[object Int16Array]", ni = "[object Int32Array]", Lt = "[object Uint8Array]", Dt = "[object Uint8ClampedArray]", U = "[object Uint16Array]", It = "[object Uint32Array]", Nt = /[\\^$.*+?()[\]{}|]/g, ut = /^\[object .+?Constructor\]$/, ls = /^(?:0|[1-9]\d*)$/, te = {};
  te[fe] = te[ie] = te[Ye] = te[Fe] = te[ni] = te[Lt] = te[Dt] = te[U] = te[It] = !0, te[o] = te[l] = te[N] = te[d] = te[V] = te[f] = te[h] = te[g] = te[y] = te[x] = te[S] = te[I] = te[M] = te[O] = te[_] = !1;
  var cs = typeof xn == "object" && xn && xn.Object === Object && xn, Ka = typeof self == "object" && self && self.Object === Object && self, dt = cs || Ka || Function("return this")(), us = e && !e.nodeType && e, ds = us && !0 && r && !r.nodeType && r, ri = ds && ds.exports === us, ii = ri && cs.process, hs = function() {
    try {
      return ii && ii.binding && ii.binding("util");
    } catch {
    }
  }(), si = hs && hs.isTypedArray;
  function fs(u, p) {
    for (var v = -1, L = u == null ? 0 : u.length, j = 0, F = []; ++v < L; ) {
      var Q = u[v];
      p(Q, v, u) && (F[j++] = Q);
    }
    return F;
  }
  function ai(u, p) {
    for (var v = -1, L = p.length, j = u.length; ++v < L; )
      u[j + v] = p[v];
    return u;
  }
  function ps(u, p) {
    for (var v = -1, L = u == null ? 0 : u.length; ++v < L; )
      if (p(u[v], v, u))
        return !0;
    return !1;
  }
  function Wa(u, p) {
    for (var v = -1, L = Array(u); ++v < u; )
      L[v] = p(v);
    return L;
  }
  function Qa(u) {
    return function(p) {
      return u(p);
    };
  }
  function or(u, p) {
    return u.has(p);
  }
  function oi(u, p) {
    return u == null ? void 0 : u[p];
  }
  function gs(u) {
    var p = -1, v = Array(u.size);
    return u.forEach(function(L, j) {
      v[++p] = [j, L];
    }), v;
  }
  function ms(u, p) {
    return function(v) {
      return u(p(v));
    };
  }
  function Ot(u) {
    var p = -1, v = Array(u.size);
    return u.forEach(function(L) {
      v[++p] = L;
    }), v;
  }
  var lr = Array.prototype, Za = Function.prototype, On = Object.prototype, cr = dt["__core-js_shared__"], li = Za.toString, Je = On.hasOwnProperty, bs = function() {
    var u = /[^.]+$/.exec(cr && cr.keys && cr.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), ys = On.toString, Xa = RegExp(
    "^" + li.call(Je).replace(Nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ci = ri ? dt.Buffer : void 0, ur = dt.Symbol, vs = dt.Uint8Array, dr = On.propertyIsEnumerable, Mn = lr.splice, ht = ur ? ur.toStringTag : void 0, hr = Object.getOwnPropertySymbols, ui = ci ? ci.isBuffer : void 0, qn = ms(Object.keys, Object), di = Xt(dt, "DataView"), _n = Xt(dt, "Map"), hi = Xt(dt, "Promise"), fi = Xt(dt, "Set"), pi = Xt(dt, "WeakMap"), hn = Xt(Object, "create"), ws = ze(di), Zt = ze(_n), Ja = ze(hi), eo = ze(fi), to = ze(pi), xs = ur ? ur.prototype : void 0, gi = xs ? xs.valueOf : void 0;
  function Se(u) {
    var p = -1, v = u == null ? 0 : u.length;
    for (this.clear(); ++p < v; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function no() {
    this.__data__ = hn ? hn(null) : {}, this.size = 0;
  }
  function ro(u) {
    var p = this.has(u) && delete this.__data__[u];
    return this.size -= p ? 1 : 0, p;
  }
  function io(u) {
    var p = this.__data__;
    if (hn) {
      var v = p[u];
      return v === n ? void 0 : v;
    }
    return Je.call(p, u) ? p[u] : void 0;
  }
  function so(u) {
    var p = this.__data__;
    return hn ? p[u] !== void 0 : Je.call(p, u);
  }
  function ao(u, p) {
    var v = this.__data__;
    return this.size += this.has(u) ? 0 : 1, v[u] = hn && p === void 0 ? n : p, this;
  }
  Se.prototype.clear = no, Se.prototype.delete = ro, Se.prototype.get = io, Se.prototype.has = so, Se.prototype.set = ao;
  function Ce(u) {
    var p = -1, v = u == null ? 0 : u.length;
    for (this.clear(); ++p < v; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function oo() {
    this.__data__ = [], this.size = 0;
  }
  function lo(u) {
    var p = this.__data__, v = gr(p, u);
    if (v < 0)
      return !1;
    var L = p.length - 1;
    return v == L ? p.pop() : Mn.call(p, v, 1), --this.size, !0;
  }
  function co(u) {
    var p = this.__data__, v = gr(p, u);
    return v < 0 ? void 0 : p[v][1];
  }
  function uo(u) {
    return gr(this.__data__, u) > -1;
  }
  function ho(u, p) {
    var v = this.__data__, L = gr(v, u);
    return L < 0 ? (++this.size, v.push([u, p])) : v[L][1] = p, this;
  }
  Ce.prototype.clear = oo, Ce.prototype.delete = lo, Ce.prototype.get = co, Ce.prototype.has = uo, Ce.prototype.set = ho;
  function $e(u) {
    var p = -1, v = u == null ? 0 : u.length;
    for (this.clear(); ++p < v; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function fo() {
    this.size = 0, this.__data__ = {
      hash: new Se(),
      map: new (_n || Ce)(),
      string: new Se()
    };
  }
  function po(u) {
    var p = ft(this, u).delete(u);
    return this.size -= p ? 1 : 0, p;
  }
  function go(u) {
    return ft(this, u).get(u);
  }
  function mo(u) {
    return ft(this, u).has(u);
  }
  function bo(u, p) {
    var v = ft(this, u), L = v.size;
    return v.set(u, p), this.size += v.size == L ? 0 : 1, this;
  }
  $e.prototype.clear = fo, $e.prototype.delete = po, $e.prototype.get = go, $e.prototype.has = mo, $e.prototype.set = bo;
  function fr(u) {
    var p = -1, v = u == null ? 0 : u.length;
    for (this.__data__ = new $e(); ++p < v; )
      this.add(u[p]);
  }
  function ks(u) {
    return this.__data__.set(u, n), this;
  }
  function pr(u) {
    return this.__data__.has(u);
  }
  fr.prototype.add = fr.prototype.push = ks, fr.prototype.has = pr;
  function Mt(u) {
    var p = this.__data__ = new Ce(u);
    this.size = p.size;
  }
  function mi() {
    this.__data__ = new Ce(), this.size = 0;
  }
  function yo(u) {
    var p = this.__data__, v = p.delete(u);
    return this.size = p.size, v;
  }
  function vo(u) {
    return this.__data__.get(u);
  }
  function wo(u) {
    return this.__data__.has(u);
  }
  function xo(u, p) {
    var v = this.__data__;
    if (v instanceof Ce) {
      var L = v.__data__;
      if (!_n || L.length < t - 1)
        return L.push([u, p]), this.size = ++v.size, this;
      v = this.__data__ = new $e(L);
    }
    return v.set(u, p), this.size = v.size, this;
  }
  Mt.prototype.clear = mi, Mt.prototype.delete = yo, Mt.prototype.get = vo, Mt.prototype.has = wo, Mt.prototype.set = xo;
  function ko(u, p) {
    var v = mr(u), L = !v && Ts(u), j = !v && !L && br(u), F = !v && !L && !j && Is(u), Q = v || L || j || F, W = Q ? Wa(u.length, String) : [], pe = W.length;
    for (var J in u)
      Je.call(u, J) && !(Q && // Safari 9 has enumerable `arguments.length` in strict mode.
      (J == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      j && (J == "offset" || J == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      F && (J == "buffer" || J == "byteLength" || J == "byteOffset") || // Skip index properties.
      Io(J, pe))) && W.push(J);
    return W;
  }
  function gr(u, p) {
    for (var v = u.length; v--; )
      if (Cs(u[v][0], p))
        return v;
    return -1;
  }
  function bi(u, p, v) {
    var L = p(u);
    return mr(u) ? L : ai(L, v(u));
  }
  function zn(u) {
    return u == null ? u === void 0 ? A : w : ht && ht in Object(u) ? Jt(u) : Es(u);
  }
  function Ss(u) {
    return _t(u) && zn(u) == o;
  }
  function As(u, p, v, L, j) {
    return u === p ? !0 : u == null || p == null || !_t(u) && !_t(p) ? u !== u && p !== p : So(u, p, v, L, As, j);
  }
  function So(u, p, v, L, j, F) {
    var Q = mr(u), W = mr(p), pe = Q ? l : qt(u), J = W ? l : qt(p);
    pe = pe == o ? S : pe, J = J == o ? S : J;
    var Te = pe == S, je = J == S, ye = pe == J;
    if (ye && br(u)) {
      if (!br(p))
        return !1;
      Q = !0, Te = !1;
    }
    if (ye && !Te)
      return F || (F = new Mt()), Q || Is(u) ? yi(u, p, v, L, j, F) : To(u, p, pe, v, L, j, F);
    if (!(v & i)) {
      var Le = Te && Je.call(u, "__wrapped__"), Ae = je && Je.call(p, "__wrapped__");
      if (Le || Ae) {
        var fn = Le ? u.value() : u, en = Ae ? p.value() : p;
        return F || (F = new Mt()), j(fn, en, v, L, F);
      }
    }
    return ye ? (F || (F = new Mt()), Lo(u, p, v, L, j, F)) : !1;
  }
  function Ao(u) {
    if (!Ds(u) || Oo(u))
      return !1;
    var p = Ls(u) ? Xa : ut;
    return p.test(ze(u));
  }
  function Eo(u) {
    return _t(u) && wi(u.length) && !!te[zn(u)];
  }
  function Co(u) {
    if (!Mo(u))
      return qn(u);
    var p = [];
    for (var v in Object(u))
      Je.call(u, v) && v != "constructor" && p.push(v);
    return p;
  }
  function yi(u, p, v, L, j, F) {
    var Q = v & i, W = u.length, pe = p.length;
    if (W != pe && !(Q && pe > W))
      return !1;
    var J = F.get(u);
    if (J && F.get(p))
      return J == p;
    var Te = -1, je = !0, ye = v & s ? new fr() : void 0;
    for (F.set(u, p), F.set(p, u); ++Te < W; ) {
      var Le = u[Te], Ae = p[Te];
      if (L)
        var fn = Q ? L(Ae, Le, Te, p, u, F) : L(Le, Ae, Te, u, p, F);
      if (fn !== void 0) {
        if (fn)
          continue;
        je = !1;
        break;
      }
      if (ye) {
        if (!ps(p, function(en, Pn) {
          if (!or(ye, Pn) && (Le === en || j(Le, en, v, L, F)))
            return ye.push(Pn);
        })) {
          je = !1;
          break;
        }
      } else if (!(Le === Ae || j(Le, Ae, v, L, F))) {
        je = !1;
        break;
      }
    }
    return F.delete(u), F.delete(p), je;
  }
  function To(u, p, v, L, j, F, Q) {
    switch (v) {
      case V:
        if (u.byteLength != p.byteLength || u.byteOffset != p.byteOffset)
          return !1;
        u = u.buffer, p = p.buffer;
      case N:
        return !(u.byteLength != p.byteLength || !F(new vs(u), new vs(p)));
      case d:
      case f:
      case x:
        return Cs(+u, +p);
      case h:
        return u.name == p.name && u.message == p.message;
      case I:
      case O:
        return u == p + "";
      case y:
        var W = gs;
      case M:
        var pe = L & i;
        if (W || (W = Ot), u.size != p.size && !pe)
          return !1;
        var J = Q.get(u);
        if (J)
          return J == p;
        L |= s, Q.set(u, p);
        var Te = yi(W(u), W(p), L, j, F, Q);
        return Q.delete(u), Te;
      case k:
        if (gi)
          return gi.call(u) == gi.call(p);
    }
    return !1;
  }
  function Lo(u, p, v, L, j, F) {
    var Q = v & i, W = Rn(u), pe = W.length, J = Rn(p), Te = J.length;
    if (pe != Te && !Q)
      return !1;
    for (var je = pe; je--; ) {
      var ye = W[je];
      if (!(Q ? ye in p : Je.call(p, ye)))
        return !1;
    }
    var Le = F.get(u);
    if (Le && F.get(p))
      return Le == p;
    var Ae = !0;
    F.set(u, p), F.set(p, u);
    for (var fn = Q; ++je < pe; ) {
      ye = W[je];
      var en = u[ye], Pn = p[ye];
      if (L)
        var ku = Q ? L(Pn, en, ye, p, u, F) : L(en, Pn, ye, u, p, F);
      if (!(ku === void 0 ? en === Pn || j(en, Pn, v, L, F) : ku)) {
        Ae = !1;
        break;
      }
      fn || (fn = ye == "constructor");
    }
    if (Ae && !fn) {
      var Ns = u.constructor, Os = p.constructor;
      Ns != Os && "constructor" in u && "constructor" in p && !(typeof Ns == "function" && Ns instanceof Ns && typeof Os == "function" && Os instanceof Os) && (Ae = !1);
    }
    return F.delete(u), F.delete(p), Ae;
  }
  function Rn(u) {
    return bi(u, xi, Do);
  }
  function ft(u, p) {
    var v = u.__data__;
    return No(p) ? v[typeof p == "string" ? "string" : "hash"] : v.map;
  }
  function Xt(u, p) {
    var v = oi(u, p);
    return Ao(v) ? v : void 0;
  }
  function Jt(u) {
    var p = Je.call(u, ht), v = u[ht];
    try {
      u[ht] = void 0;
      var L = !0;
    } catch {
    }
    var j = ys.call(u);
    return L && (p ? u[ht] = v : delete u[ht]), j;
  }
  var Do = hr ? function(u) {
    return u == null ? [] : (u = Object(u), fs(hr(u), function(p) {
      return dr.call(u, p);
    }));
  } : _o, qt = zn;
  (di && qt(new di(new ArrayBuffer(1))) != V || _n && qt(new _n()) != y || hi && qt(hi.resolve()) != E || fi && qt(new fi()) != M || pi && qt(new pi()) != _) && (qt = function(u) {
    var p = zn(u), v = p == S ? u.constructor : void 0, L = v ? ze(v) : "";
    if (L)
      switch (L) {
        case ws:
          return V;
        case Zt:
          return y;
        case Ja:
          return E;
        case eo:
          return M;
        case to:
          return _;
      }
    return p;
  });
  function Io(u, p) {
    return p = p ?? a, !!p && (typeof u == "number" || ls.test(u)) && u > -1 && u % 1 == 0 && u < p;
  }
  function No(u) {
    var p = typeof u;
    return p == "string" || p == "number" || p == "symbol" || p == "boolean" ? u !== "__proto__" : u === null;
  }
  function Oo(u) {
    return !!bs && bs in u;
  }
  function Mo(u) {
    var p = u && u.constructor, v = typeof p == "function" && p.prototype || On;
    return u === v;
  }
  function Es(u) {
    return ys.call(u);
  }
  function ze(u) {
    if (u != null) {
      try {
        return li.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function Cs(u, p) {
    return u === p || u !== u && p !== p;
  }
  var Ts = Ss(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ss : function(u) {
    return _t(u) && Je.call(u, "callee") && !dr.call(u, "callee");
  }, mr = Array.isArray;
  function vi(u) {
    return u != null && wi(u.length) && !Ls(u);
  }
  var br = ui || zo;
  function qo(u, p) {
    return As(u, p);
  }
  function Ls(u) {
    if (!Ds(u))
      return !1;
    var p = zn(u);
    return p == g || p == m || p == c || p == C;
  }
  function wi(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= a;
  }
  function Ds(u) {
    var p = typeof u;
    return u != null && (p == "object" || p == "function");
  }
  function _t(u) {
    return u != null && typeof u == "object";
  }
  var Is = si ? Qa(si) : Eo;
  function xi(u) {
    return vi(u) ? ko(u) : Co(u);
  }
  function _o() {
    return [];
  }
  function zo() {
    return !1;
  }
  r.exports = qo;
})(ua, ua.exports);
var _f = ua.exports, Fc = {};
Object.defineProperty(Fc, "__esModule", { value: !0 });
const u0 = qf, d0 = _f;
var Rl;
(function(r) {
  function e(s = {}, a = {}, o = !1) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    let l = u0(a);
    o || (l = Object.keys(l).reduce((c, d) => (l[d] != null && (c[d] = l[d]), c), {}));
    for (const c in s)
      s[c] !== void 0 && a[c] === void 0 && (l[c] = s[c]);
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.compose = e;
  function t(s = {}, a = {}) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    const o = Object.keys(s).concat(Object.keys(a)).reduce((l, c) => (d0(s[c], a[c]) || (l[c] = a[c] === void 0 ? null : a[c]), l), {});
    return Object.keys(o).length > 0 ? o : void 0;
  }
  r.diff = t;
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
    const l = Object.keys(a).reduce((c, d) => (s[d] === void 0 && (c[d] = a[d]), c), {});
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.transform = i;
})(Rl || (Rl = {}));
Fc.default = Rl;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
var Pl;
(function(r) {
  function e(t) {
    return typeof t.delete == "number" ? t.delete : typeof t.retain == "number" ? t.retain : typeof t.retain == "object" && t.retain !== null ? 1 : typeof t.insert == "string" ? t.insert.length : 1;
  }
  r.length = e;
})(Pl || (Pl = {}));
Ma.default = Pl;
var $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
const nd = Ma;
class h0 {
  constructor(e) {
    this.ops = e, this.index = 0, this.offset = 0;
  }
  hasNext() {
    return this.peekLength() < 1 / 0;
  }
  next(e) {
    e || (e = 1 / 0);
    const t = this.ops[this.index];
    if (t) {
      const n = this.offset, i = nd.default.length(t);
      if (e >= i - n ? (e = i - n, this.index += 1, this.offset = 0) : this.offset += e, typeof t.delete == "number")
        return { delete: e };
      {
        const s = {};
        return t.attributes && (s.attributes = t.attributes), typeof t.retain == "number" ? s.retain = e : typeof t.retain == "object" && t.retain !== null ? s.retain = t.retain : typeof t.insert == "string" ? s.insert = t.insert.substr(n, e) : s.insert = t.insert, s;
      }
    } else
      return { retain: 1 / 0 };
  }
  peek() {
    return this.ops[this.index];
  }
  peekLength() {
    return this.ops[this.index] ? nd.default.length(this.ops[this.index]) - this.offset : 1 / 0;
  }
  peekType() {
    const e = this.ops[this.index];
    return e ? typeof e.delete == "number" ? "delete" : typeof e.retain == "number" || typeof e.retain == "object" && e.retain !== null ? "retain" : "insert" : "retain";
  }
  rest() {
    if (this.hasNext()) {
      if (this.offset === 0)
        return this.ops.slice(this.index);
      {
        const e = this.offset, t = this.index, n = this.next(), i = this.ops.slice(this.index);
        return this.offset = e, this.index = t, [n].concat(i);
      }
    } else return [];
  }
}
$c.default = h0;
(function(r, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.AttributeMap = e.OpIterator = e.Op = void 0;
  const t = c0, n = qf, i = _f, s = Fc;
  e.AttributeMap = s.default;
  const a = Ma;
  e.Op = a.default;
  const o = $c;
  e.OpIterator = o.default;
  const l = "\0", c = (f, h) => {
    if (typeof f != "object" || f === null)
      throw new Error(`cannot retain a ${typeof f}`);
    if (typeof h != "object" || h === null)
      throw new Error(`cannot retain a ${typeof h}`);
    const g = Object.keys(f)[0];
    if (!g || g !== Object.keys(h)[0])
      throw new Error(`embed types not matched: ${g} != ${Object.keys(h)[0]}`);
    return [g, f[g], h[g]];
  };
  class d {
    constructor(h) {
      Array.isArray(h) ? this.ops = h : h != null && Array.isArray(h.ops) ? this.ops = h.ops : this.ops = [];
    }
    static registerEmbed(h, g) {
      this.handlers[h] = g;
    }
    static unregisterEmbed(h) {
      delete this.handlers[h];
    }
    static getHandler(h) {
      const g = this.handlers[h];
      if (!g)
        throw new Error(`no handlers for embed type "${h}"`);
      return g;
    }
    insert(h, g) {
      const m = {};
      return typeof h == "string" && h.length === 0 ? this : (m.insert = h, g != null && typeof g == "object" && Object.keys(g).length > 0 && (m.attributes = g), this.push(m));
    }
    delete(h) {
      return h <= 0 ? this : this.push({ delete: h });
    }
    retain(h, g) {
      if (typeof h == "number" && h <= 0)
        return this;
      const m = { retain: h };
      return g != null && typeof g == "object" && Object.keys(g).length > 0 && (m.attributes = g), this.push(m);
    }
    push(h) {
      let g = this.ops.length, m = this.ops[g - 1];
      if (h = n(h), typeof m == "object") {
        if (typeof h.delete == "number" && typeof m.delete == "number")
          return this.ops[g - 1] = { delete: m.delete + h.delete }, this;
        if (typeof m.delete == "number" && h.insert != null && (g -= 1, m = this.ops[g - 1], typeof m != "object"))
          return this.ops.unshift(h), this;
        if (i(h.attributes, m.attributes)) {
          if (typeof h.insert == "string" && typeof m.insert == "string")
            return this.ops[g - 1] = { insert: m.insert + h.insert }, typeof h.attributes == "object" && (this.ops[g - 1].attributes = h.attributes), this;
          if (typeof h.retain == "number" && typeof m.retain == "number")
            return this.ops[g - 1] = { retain: m.retain + h.retain }, typeof h.attributes == "object" && (this.ops[g - 1].attributes = h.attributes), this;
        }
      }
      return g === this.ops.length ? this.ops.push(h) : this.ops.splice(g, 0, h), this;
    }
    chop() {
      const h = this.ops[this.ops.length - 1];
      return h && typeof h.retain == "number" && !h.attributes && this.ops.pop(), this;
    }
    filter(h) {
      return this.ops.filter(h);
    }
    forEach(h) {
      this.ops.forEach(h);
    }
    map(h) {
      return this.ops.map(h);
    }
    partition(h) {
      const g = [], m = [];
      return this.forEach((y) => {
        (h(y) ? g : m).push(y);
      }), [g, m];
    }
    reduce(h, g) {
      return this.ops.reduce(h, g);
    }
    changeLength() {
      return this.reduce((h, g) => g.insert ? h + a.default.length(g) : g.delete ? h - g.delete : h, 0);
    }
    length() {
      return this.reduce((h, g) => h + a.default.length(g), 0);
    }
    slice(h = 0, g = 1 / 0) {
      const m = [], y = new o.default(this.ops);
      let x = 0;
      for (; x < g && y.hasNext(); ) {
        let w;
        x < h ? w = y.next(h - x) : (w = y.next(g - x), m.push(w)), x += a.default.length(w);
      }
      return new d(m);
    }
    compose(h) {
      const g = new o.default(this.ops), m = new o.default(h.ops), y = [], x = m.peek();
      if (x != null && typeof x.retain == "number" && x.attributes == null) {
        let S = x.retain;
        for (; g.peekType() === "insert" && g.peekLength() <= S; )
          S -= g.peekLength(), y.push(g.next());
        x.retain - S > 0 && m.next(x.retain - S);
      }
      const w = new d(y);
      for (; g.hasNext() || m.hasNext(); )
        if (m.peekType() === "insert")
          w.push(m.next());
        else if (g.peekType() === "delete")
          w.push(g.next());
        else {
          const S = Math.min(g.peekLength(), m.peekLength()), E = g.next(S), C = m.next(S);
          if (C.retain) {
            const I = {};
            if (typeof E.retain == "number")
              I.retain = typeof C.retain == "number" ? S : C.retain;
            else if (typeof C.retain == "number")
              E.retain == null ? I.insert = E.insert : I.retain = E.retain;
            else {
              const O = E.retain == null ? "insert" : "retain", [k, A, _] = c(E[O], C.retain), N = d.getHandler(k);
              I[O] = {
                [k]: N.compose(A, _, O === "retain")
              };
            }
            const M = s.default.compose(E.attributes, C.attributes, typeof E.retain == "number");
            if (M && (I.attributes = M), w.push(I), !m.hasNext() && i(w.ops[w.ops.length - 1], I)) {
              const O = new d(g.rest());
              return w.concat(O).chop();
            }
          } else typeof C.delete == "number" && (typeof E.retain == "number" || typeof E.retain == "object" && E.retain !== null) && w.push(C);
        }
      return w.chop();
    }
    concat(h) {
      const g = new d(this.ops.slice());
      return h.ops.length > 0 && (g.push(h.ops[0]), g.ops = g.ops.concat(h.ops.slice(1))), g;
    }
    diff(h, g) {
      if (this.ops === h.ops)
        return new d();
      const m = [this, h].map((E) => E.map((C) => {
        if (C.insert != null)
          return typeof C.insert == "string" ? C.insert : l;
        const I = E === h ? "on" : "with";
        throw new Error("diff() called " + I + " non-document");
      }).join("")), y = new d(), x = t(m[0], m[1], g, !0), w = new o.default(this.ops), S = new o.default(h.ops);
      return x.forEach((E) => {
        let C = E[1].length;
        for (; C > 0; ) {
          let I = 0;
          switch (E[0]) {
            case t.INSERT:
              I = Math.min(S.peekLength(), C), y.push(S.next(I));
              break;
            case t.DELETE:
              I = Math.min(C, w.peekLength()), w.next(I), y.delete(I);
              break;
            case t.EQUAL:
              I = Math.min(w.peekLength(), S.peekLength(), C);
              const M = w.next(I), O = S.next(I);
              i(M.insert, O.insert) ? y.retain(I, s.default.diff(M.attributes, O.attributes)) : y.push(O).delete(I);
              break;
          }
          C -= I;
        }
      }), y.chop();
    }
    eachLine(h, g = `
`) {
      const m = new o.default(this.ops);
      let y = new d(), x = 0;
      for (; m.hasNext(); ) {
        if (m.peekType() !== "insert")
          return;
        const w = m.peek(), S = a.default.length(w) - m.peekLength(), E = typeof w.insert == "string" ? w.insert.indexOf(g, S) - S : -1;
        if (E < 0)
          y.push(m.next());
        else if (E > 0)
          y.push(m.next(E));
        else {
          if (h(y, m.next(1).attributes || {}, x) === !1)
            return;
          x += 1, y = new d();
        }
      }
      y.length() > 0 && h(y, {}, x);
    }
    invert(h) {
      const g = new d();
      return this.reduce((m, y) => {
        if (y.insert)
          g.delete(a.default.length(y));
        else {
          if (typeof y.retain == "number" && y.attributes == null)
            return g.retain(y.retain), m + y.retain;
          if (y.delete || typeof y.retain == "number") {
            const x = y.delete || y.retain;
            return h.slice(m, m + x).forEach((S) => {
              y.delete ? g.push(S) : y.retain && y.attributes && g.retain(a.default.length(S), s.default.invert(y.attributes, S.attributes));
            }), m + x;
          } else if (typeof y.retain == "object" && y.retain !== null) {
            const x = h.slice(m, m + 1), w = new o.default(x.ops).next(), [S, E, C] = c(y.retain, w.insert), I = d.getHandler(S);
            return g.retain({ [S]: I.invert(E, C) }, s.default.invert(y.attributes, w.attributes)), m + 1;
          }
        }
        return m;
      }, 0), g.chop();
    }
    transform(h, g = !1) {
      if (g = !!g, typeof h == "number")
        return this.transformPosition(h, g);
      const m = h, y = new o.default(this.ops), x = new o.default(m.ops), w = new d();
      for (; y.hasNext() || x.hasNext(); )
        if (y.peekType() === "insert" && (g || x.peekType() !== "insert"))
          w.retain(a.default.length(y.next()));
        else if (x.peekType() === "insert")
          w.push(x.next());
        else {
          const S = Math.min(y.peekLength(), x.peekLength()), E = y.next(S), C = x.next(S);
          if (E.delete)
            continue;
          if (C.delete)
            w.push(C);
          else {
            const I = E.retain, M = C.retain;
            let O = typeof M == "object" && M !== null ? M : S;
            if (typeof I == "object" && I !== null && typeof M == "object" && M !== null) {
              const k = Object.keys(I)[0];
              if (k === Object.keys(M)[0]) {
                const A = d.getHandler(k);
                A && (O = {
                  [k]: A.transform(I[k], M[k], g)
                });
              }
            }
            w.retain(O, s.default.transform(E.attributes, C.attributes, g));
          }
        }
      return w.chop();
    }
    transformPosition(h, g = !1) {
      g = !!g;
      const m = new o.default(this.ops);
      let y = 0;
      for (; m.hasNext() && y <= h; ) {
        const x = m.peekLength(), w = m.peekType();
        if (m.next(), w === "delete") {
          h -= Math.min(x, h - y);
          continue;
        } else w === "insert" && (y < h || !g) && (h += x);
        y += x;
      }
      return h;
    }
  }
  d.Op = a.default, d.OpIterator = o.default, d.AttributeMap = s.default, d.handlers = {}, e.default = d, r.exports = d, r.exports.default = d;
})(zl, zl.exports);
var ot = zl.exports;
const P = /* @__PURE__ */ Df(ot);
class Ct extends Ze {
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
Ct.blotName = "break";
Ct.tagName = "BR";
let kt = class extends la {
};
const f0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function qa(r) {
  return r.replace(/[&<>"']/g, (e) => f0[e]);
}
const zt = class zt extends zc {
  static compare(e, t) {
    const n = zt.order.indexOf(e), i = zt.order.indexOf(t);
    return n >= 0 || i >= 0 ? n - i : e === t ? 0 : e < t ? -1 : 1;
  }
  formatAt(e, t, n, i) {
    if (zt.compare(this.statics.blotName, n) < 0 && this.scroll.query(n, B.BLOT)) {
      const s = this.isolate(e, t);
      i && s.wrap(n, i);
    } else
      super.formatAt(e, t, n, i);
  }
  optimize(e) {
    if (super.optimize(e), this.parent instanceof zt && zt.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const t = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(t), t.wrap(this);
    }
  }
};
q(zt, "allowedChildren", [zt, Ct, Ze, kt]), // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
q(zt, "order", [
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
let Ht = zt;
const rd = 1;
class Ee extends Vi {
  constructor() {
    super(...arguments);
    q(this, "cache", {});
  }
  delta() {
    return this.cache.delta == null && (this.cache.delta = zf(this)), this.cache.delta;
  }
  deleteAt(t, n) {
    super.deleteAt(t, n), this.cache = {};
  }
  formatAt(t, n, i, s) {
    n <= 0 || (this.scroll.query(i, B.BLOCK) ? t + n === this.length() && this.format(i, s) : super.formatAt(t, Math.min(n, this.length() - t - 1), i, s), this.cache = {});
  }
  insertAt(t, n, i) {
    if (i != null) {
      super.insertAt(t, n, i), this.cache = {};
      return;
    }
    if (n.length === 0) return;
    const s = n.split(`
`), a = s.shift();
    a.length > 0 && (t < this.length() - 1 || this.children.tail == null ? super.insertAt(Math.min(t, this.length() - 1), a) : this.children.tail.insertAt(this.children.tail.length(), a), this.cache = {});
    let o = this;
    s.reduce((l, c) => (o = o.split(l, !0), o.insertAt(0, c), c.length), t + a.length);
  }
  insertBefore(t, n) {
    const {
      head: i
    } = this.children;
    super.insertBefore(t, n), i instanceof Ct && i.remove(), this.cache = {};
  }
  length() {
    return this.cache.length == null && (this.cache.length = super.length() + rd), this.cache.length;
  }
  moveChildren(t, n) {
    super.moveChildren(t, n), this.cache = {};
  }
  optimize(t) {
    super.optimize(t), this.cache = {};
  }
  path(t) {
    return super.path(t, !0);
  }
  removeChild(t) {
    super.removeChild(t), this.cache = {};
  }
  split(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (n && (t === 0 || t >= this.length() - rd)) {
      const s = this.clone();
      return t === 0 ? (this.parent.insertBefore(s, this), this) : (this.parent.insertBefore(s, this.next), s);
    }
    const i = super.split(t, n);
    return this.cache = {}, i;
  }
}
Ee.blotName = "block";
Ee.tagName = "P";
Ee.defaultChild = Ct;
Ee.allowedChildren = [Ct, Ht, Ze, kt];
class at extends Ze {
  attach() {
    super.attach(), this.attributes = new Da(this.domNode);
  }
  delta() {
    return new P().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values()
    });
  }
  format(e, t) {
    const n = this.scroll.query(e, B.BLOCK_ATTRIBUTE);
    n != null && this.attributes.attribute(n, t);
  }
  formatAt(e, t, n, i) {
    this.format(n, i);
  }
  insertAt(e, t, n) {
    if (n != null) {
      super.insertAt(e, t, n);
      return;
    }
    const i = t.split(`
`), s = i.pop(), a = i.map((l) => {
      const c = this.scroll.create(Ee.blotName);
      return c.insertAt(0, l), c;
    }), o = this.split(e);
    a.forEach((l) => {
      this.parent.insertBefore(l, o);
    }), s && this.parent.insertBefore(this.scroll.create("text", s), o);
  }
}
at.scope = B.BLOCK_BLOT;
function zf(r) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  return r.descendants(Ne).reduce((t, n) => n.length() === 0 ? t : t.insert(n.value(), rt(n, {}, e)), new P()).insert(`
`, rt(r));
}
function rt(r) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  return r == null || ("formats" in r && typeof r.formats == "function" && (e = {
    ...e,
    ...r.formats()
  }, t && delete e["code-token"]), r.parent == null || r.parent.statics.blotName === "scroll" || r.parent.statics.scope !== r.statics.scope) ? e : rt(r.parent, e, t);
}
const tt = class tt extends Ze {
  // Zero width no break space
  static value() {
  }
  constructor(e, t, n) {
    super(e, t), this.selection = n, this.textNode = document.createTextNode(tt.CONTENTS), this.domNode.appendChild(this.textNode), this.savedLength = 0;
  }
  detach() {
    this.parent != null && this.parent.removeChild(this);
  }
  format(e, t) {
    if (this.savedLength !== 0) {
      super.format(e, t);
      return;
    }
    let n = this, i = 0;
    for (; n != null && n.statics.scope !== B.BLOCK_BLOT; )
      i += n.offset(n.parent), n = n.parent;
    n != null && (this.savedLength = tt.CONTENTS.length, n.optimize(), n.formatAt(i, tt.CONTENTS.length, e, t), this.savedLength = 0);
  }
  index(e, t) {
    return e === this.textNode ? 0 : super.index(e, t);
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
    const e = this.selection.getNativeRange();
    for (; this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode; )
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    const t = this.prev instanceof kt ? this.prev : null, n = t ? t.length() : 0, i = this.next instanceof kt ? this.next : null, s = i ? i.text : "", {
      textNode: a
    } = this, o = a.data.split(tt.CONTENTS).join("");
    a.data = tt.CONTENTS;
    let l;
    if (t)
      l = t, (o || i) && (t.insertAt(t.length(), o + s), i && i.remove());
    else if (i)
      l = i, i.insertAt(0, o);
    else {
      const c = document.createTextNode(o);
      l = this.scroll.create(c), this.parent.insertBefore(l, this);
    }
    if (this.remove(), e) {
      const c = (h, g) => t && h === t.domNode ? g : h === a ? n + g - 1 : i && h === i.domNode ? n + o.length + g : null, d = c(e.start.node, e.start.offset), f = c(e.end.node, e.end.offset);
      if (d !== null && f !== null)
        return {
          startNode: l.domNode,
          startOffset: d,
          endNode: l.domNode,
          endOffset: f
        };
    }
    return null;
  }
  update(e, t) {
    if (e.some((n) => n.type === "characterData" && n.target === this.textNode)) {
      const n = this.restore();
      n && (t.range = n);
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
  optimize(e) {
    super.optimize(e);
    let {
      parent: t
    } = this;
    for (; t; ) {
      if (t.domNode.tagName === "A") {
        this.savedLength = tt.CONTENTS.length, t.isolate(this.offset(t), this.length()).unwrap(), this.savedLength = 0;
        break;
      }
      t = t.parent;
    }
  }
  value() {
    return "";
  }
};
q(tt, "blotName", "cursor"), q(tt, "className", "ql-cursor"), q(tt, "tagName", "span"), q(tt, "CONTENTS", "\uFEFF");
let Yr = tt;
var Rf = { exports: {} };
(function(r) {
  var e = Object.prototype.hasOwnProperty, t = "~";
  function n() {
  }
  Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (t = !1));
  function i(l, c, d) {
    this.fn = l, this.context = c, this.once = d || !1;
  }
  function s(l, c, d, f, h) {
    if (typeof d != "function")
      throw new TypeError("The listener must be a function");
    var g = new i(d, f || l, h), m = t ? t + c : c;
    return l._events[m] ? l._events[m].fn ? l._events[m] = [l._events[m], g] : l._events[m].push(g) : (l._events[m] = g, l._eventsCount++), l;
  }
  function a(l, c) {
    --l._eventsCount === 0 ? l._events = new n() : delete l._events[c];
  }
  function o() {
    this._events = new n(), this._eventsCount = 0;
  }
  o.prototype.eventNames = function() {
    var c = [], d, f;
    if (this._eventsCount === 0) return c;
    for (f in d = this._events)
      e.call(d, f) && c.push(t ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(d)) : c;
  }, o.prototype.listeners = function(c) {
    var d = t ? t + c : c, f = this._events[d];
    if (!f) return [];
    if (f.fn) return [f.fn];
    for (var h = 0, g = f.length, m = new Array(g); h < g; h++)
      m[h] = f[h].fn;
    return m;
  }, o.prototype.listenerCount = function(c) {
    var d = t ? t + c : c, f = this._events[d];
    return f ? f.fn ? 1 : f.length : 0;
  }, o.prototype.emit = function(c, d, f, h, g, m) {
    var y = t ? t + c : c;
    if (!this._events[y]) return !1;
    var x = this._events[y], w = arguments.length, S, E;
    if (x.fn) {
      switch (x.once && this.removeListener(c, x.fn, void 0, !0), w) {
        case 1:
          return x.fn.call(x.context), !0;
        case 2:
          return x.fn.call(x.context, d), !0;
        case 3:
          return x.fn.call(x.context, d, f), !0;
        case 4:
          return x.fn.call(x.context, d, f, h), !0;
        case 5:
          return x.fn.call(x.context, d, f, h, g), !0;
        case 6:
          return x.fn.call(x.context, d, f, h, g, m), !0;
      }
      for (E = 1, S = new Array(w - 1); E < w; E++)
        S[E - 1] = arguments[E];
      x.fn.apply(x.context, S);
    } else {
      var C = x.length, I;
      for (E = 0; E < C; E++)
        switch (x[E].once && this.removeListener(c, x[E].fn, void 0, !0), w) {
          case 1:
            x[E].fn.call(x[E].context);
            break;
          case 2:
            x[E].fn.call(x[E].context, d);
            break;
          case 3:
            x[E].fn.call(x[E].context, d, f);
            break;
          case 4:
            x[E].fn.call(x[E].context, d, f, h);
            break;
          default:
            if (!S) for (I = 1, S = new Array(w - 1); I < w; I++)
              S[I - 1] = arguments[I];
            x[E].fn.apply(x[E].context, S);
        }
    }
    return !0;
  }, o.prototype.on = function(c, d, f) {
    return s(this, c, d, f, !1);
  }, o.prototype.once = function(c, d, f) {
    return s(this, c, d, f, !0);
  }, o.prototype.removeListener = function(c, d, f, h) {
    var g = t ? t + c : c;
    if (!this._events[g]) return this;
    if (!d)
      return a(this, g), this;
    var m = this._events[g];
    if (m.fn)
      m.fn === d && (!h || m.once) && (!f || m.context === f) && a(this, g);
    else {
      for (var y = 0, x = [], w = m.length; y < w; y++)
        (m[y].fn !== d || h && !m[y].once || f && m[y].context !== f) && x.push(m[y]);
      x.length ? this._events[g] = x.length === 1 ? x[0] : x : a(this, g);
    }
    return this;
  }, o.prototype.removeAllListeners = function(c) {
    var d;
    return c ? (d = t ? t + c : c, this._events[d] && a(this, d)) : (this._events = new n(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = t, o.EventEmitter = o, r.exports = o;
})(Rf);
var p0 = Rf.exports;
const g0 = /* @__PURE__ */ Df(p0), Bl = /* @__PURE__ */ new WeakMap(), Fl = ["error", "warn", "log", "info"];
let $l = "warn";
function Pf(r) {
  if ($l && Fl.indexOf(r) <= Fl.indexOf($l)) {
    for (var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++)
      t[n - 1] = arguments[n];
    console[r](...t);
  }
}
function un(r) {
  return Fl.reduce((e, t) => (e[t] = Pf.bind(console, t, r), e), {});
}
un.level = (r) => {
  $l = r;
};
Pf.level = un.level;
const Ho = un("quill:events"), m0 = ["selectionchange", "mousedown", "mouseup", "click"];
m0.forEach((r) => {
  document.addEventListener(r, function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    Array.from(document.querySelectorAll(".ql-container")).forEach((i) => {
      const s = Bl.get(i);
      s && s.emitter && s.emitter.handleDOM(...t);
    });
  });
});
class R extends g0 {
  constructor() {
    super(), this.domListeners = {}, this.on("error", Ho.error);
  }
  emit() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    return Ho.log.call(Ho, ...t), super.emit(...t);
  }
  handleDOM(e) {
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      n[i - 1] = arguments[i];
    (this.domListeners[e.type] || []).forEach((s) => {
      let {
        node: a,
        handler: o
      } = s;
      (e.target === a || a.contains(e.target)) && o(e, ...n);
    });
  }
  listenDOM(e, t, n) {
    this.domListeners[e] || (this.domListeners[e] = []), this.domListeners[e].push({
      node: t,
      handler: n
    });
  }
}
q(R, "events", {
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
}), q(R, "sources", {
  API: "api",
  SILENT: "silent",
  USER: "user"
});
const Vo = un("quill:selection");
class Xn {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = e, this.length = t;
  }
}
class b0 {
  constructor(e, t) {
    this.emitter = t, this.scroll = e, this.composing = !1, this.mouseDown = !1, this.root = this.scroll.domNode, this.cursor = this.scroll.create("cursor", this), this.savedRange = new Xn(0, 0), this.lastRange = this.savedRange, this.lastNative = null, this.handleComposition(), this.handleDragging(), this.emitter.listenDOM("selectionchange", document, () => {
      !this.mouseDown && !this.composing && setTimeout(this.update.bind(this, R.sources.USER), 1);
    }), this.emitter.on(R.events.SCROLL_BEFORE_UPDATE, () => {
      if (!this.hasFocus()) return;
      const n = this.getNativeRange();
      n != null && n.start.node !== this.cursor.textNode && this.emitter.once(R.events.SCROLL_UPDATE, (i, s) => {
        try {
          this.root.contains(n.start.node) && this.root.contains(n.end.node) && this.setNativeRange(n.start.node, n.start.offset, n.end.node, n.end.offset);
          const a = s.some((o) => o.type === "characterData" || o.type === "childList" || o.type === "attributes" && o.target === this.root);
          this.update(a ? R.sources.SILENT : i);
        } catch {
        }
      });
    }), this.emitter.on(R.events.SCROLL_OPTIMIZE, (n, i) => {
      if (i.range) {
        const {
          startNode: s,
          startOffset: a,
          endNode: o,
          endOffset: l
        } = i.range;
        this.setNativeRange(s, a, o, l), this.update(R.sources.SILENT);
      }
    }), this.update(R.sources.SILENT);
  }
  handleComposition() {
    this.emitter.on(R.events.COMPOSITION_BEFORE_START, () => {
      this.composing = !0;
    }), this.emitter.on(R.events.COMPOSITION_END, () => {
      if (this.composing = !1, this.cursor.parent) {
        const e = this.cursor.restore();
        if (!e) return;
        setTimeout(() => {
          this.setNativeRange(e.startNode, e.startOffset, e.endNode, e.endOffset);
        }, 1);
      }
    });
  }
  handleDragging() {
    this.emitter.listenDOM("mousedown", document.body, () => {
      this.mouseDown = !0;
    }), this.emitter.listenDOM("mouseup", document.body, () => {
      this.mouseDown = !1, this.update(R.sources.USER);
    });
  }
  focus() {
    this.hasFocus() || (this.root.focus({
      preventScroll: !0
    }), this.setRange(this.savedRange));
  }
  format(e, t) {
    this.scroll.update();
    const n = this.getNativeRange();
    if (!(n == null || !n.native.collapsed || this.scroll.query(e, B.BLOCK))) {
      if (n.start.node !== this.cursor.textNode) {
        const i = this.scroll.find(n.start.node, !1);
        if (i == null) return;
        if (i instanceof Ne) {
          const s = i.split(n.start.offset);
          i.parent.insertBefore(this.cursor, s);
        } else
          i.insertBefore(this.cursor, n.start.node);
        this.cursor.attach();
      }
      this.cursor.format(e, t), this.scroll.optimize(), this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length), this.update();
    }
  }
  getBounds(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const n = this.scroll.length();
    e = Math.min(e, n - 1), t = Math.min(e + t, n - 1) - e;
    let i, [s, a] = this.scroll.leaf(e);
    if (s == null) return null;
    if (t > 0 && a === s.length()) {
      const [d] = this.scroll.leaf(e + 1);
      if (d) {
        const [f] = this.scroll.line(e), [h] = this.scroll.line(e + 1);
        f === h && (s = d, a = 0);
      }
    }
    [i, a] = s.position(a, !0);
    const o = document.createRange();
    if (t > 0)
      return o.setStart(i, a), [s, a] = this.scroll.leaf(e + t), s == null ? null : ([i, a] = s.position(a, !0), o.setEnd(i, a), o.getBoundingClientRect());
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
    const e = document.getSelection();
    if (e == null || e.rangeCount <= 0) return null;
    const t = e.getRangeAt(0);
    if (t == null) return null;
    const n = this.normalizeNative(t);
    return Vo.info("getNativeRange", n), n;
  }
  getRange() {
    const e = this.scroll.domNode;
    if ("isConnected" in e && !e.isConnected)
      return [null, null];
    const t = this.getNativeRange();
    return t == null ? [null, null] : [this.normalizedToRange(t), t];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && Yo(this.root, document.activeElement);
  }
  normalizedToRange(e) {
    const t = [[e.start.node, e.start.offset]];
    e.native.collapsed || t.push([e.end.node, e.end.offset]);
    const n = t.map((a) => {
      const [o, l] = a, c = this.scroll.find(o, !0), d = c.offset(this.scroll);
      return l === 0 ? d : c instanceof Ne ? d + c.index(o, l) : d + c.length();
    }), i = Math.min(Math.max(...n), this.scroll.length() - 1), s = Math.min(i, ...n);
    return new Xn(s, i - s);
  }
  normalizeNative(e) {
    if (!Yo(this.root, e.startContainer) || !e.collapsed && !Yo(this.root, e.endContainer))
      return null;
    const t = {
      start: {
        node: e.startContainer,
        offset: e.startOffset
      },
      end: {
        node: e.endContainer,
        offset: e.endOffset
      },
      native: e
    };
    return [t.start, t.end].forEach((n) => {
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
    }), t;
  }
  rangeToNative(e) {
    const t = this.scroll.length(), n = (i, s) => {
      i = Math.min(t - 1, i);
      const [a, o] = this.scroll.leaf(i);
      return a ? a.position(o, s) : [null, -1];
    };
    return [...n(e.index, !1), ...n(e.index + e.length, !0)];
  }
  setNativeRange(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : e, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : t, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !1;
    if (Vo.info("setNativeRange", e, t, n, i), e != null && (this.root.parentNode == null || e.parentNode == null || // @ts-expect-error Fix me later
    n.parentNode == null))
      return;
    const a = document.getSelection();
    if (a != null)
      if (e != null) {
        this.hasFocus() || this.root.focus({
          preventScroll: !0
        });
        const {
          native: o
        } = this.getNativeRange() || {};
        if (o == null || s || e !== o.startContainer || t !== o.startOffset || n !== o.endContainer || i !== o.endOffset) {
          e instanceof Element && e.tagName === "BR" && (t = Array.from(e.parentNode.childNodes).indexOf(e), e = e.parentNode), n instanceof Element && n.tagName === "BR" && (i = Array.from(n.parentNode.childNodes).indexOf(n), n = n.parentNode);
          const l = document.createRange();
          l.setStart(e, t), l.setEnd(n, i), a.removeAllRanges(), a.addRange(l);
        }
      } else
        a.removeAllRanges(), this.root.blur();
  }
  setRange(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : R.sources.API;
    if (typeof t == "string" && (n = t, t = !1), Vo.info("setRange", e), e != null) {
      const i = this.rangeToNative(e);
      this.setNativeRange(...i, t);
    } else
      this.setNativeRange(null);
    this.update(n);
  }
  update() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : R.sources.USER;
    const t = this.lastRange, [n, i] = this.getRange();
    if (this.lastRange = n, this.lastNative = i, this.lastRange != null && (this.savedRange = this.lastRange), !_c(t, this.lastRange)) {
      if (!this.composing && i != null && i.native.collapsed && i.start.node !== this.cursor.textNode) {
        const a = this.cursor.restore();
        a && this.setNativeRange(a.startNode, a.startOffset, a.endNode, a.endOffset);
      }
      const s = [R.events.SELECTION_CHANGE, Or(this.lastRange), Or(t), e];
      this.emitter.emit(R.events.EDITOR_CHANGE, ...s), e !== R.sources.SILENT && this.emitter.emit(...s);
    }
  }
}
function Yo(r, e) {
  try {
    e.parentNode;
  } catch {
    return !1;
  }
  return r.contains(e);
}
const y0 = /^[ -~]*$/;
class v0 {
  constructor(e) {
    this.scroll = e, this.delta = this.getDelta();
  }
  applyDelta(e) {
    this.scroll.update();
    let t = this.scroll.length();
    this.scroll.batchStart();
    const n = id(e), i = new P();
    return x0(n.ops.slice()).reduce((a, o) => {
      const l = ot.Op.length(o);
      let c = o.attributes || {}, d = !1, f = !1;
      if (o.insert != null) {
        if (i.retain(l), typeof o.insert == "string") {
          const m = o.insert;
          f = !m.endsWith(`
`) && (t <= a || !!this.scroll.descendant(at, a)[0]), this.scroll.insertAt(a, m);
          const [y, x] = this.scroll.line(a);
          let w = An({}, rt(y));
          if (y instanceof Ee) {
            const [S] = y.descendant(Ne, x);
            S && (w = An(w, rt(S)));
          }
          c = ot.AttributeMap.diff(w, c) || {};
        } else if (typeof o.insert == "object") {
          const m = Object.keys(o.insert)[0];
          if (m == null) return a;
          const y = this.scroll.query(m, B.INLINE) != null;
          if (y)
            (t <= a || this.scroll.descendant(at, a)[0]) && (f = !0);
          else if (a > 0) {
            const [x, w] = this.scroll.descendant(Ne, a - 1);
            x instanceof kt ? x.value()[w] !== `
` && (d = !0) : x instanceof Ze && x.statics.scope === B.INLINE_BLOT && (d = !0);
          }
          if (this.scroll.insertAt(a, m, o.insert[m]), y) {
            const [x] = this.scroll.descendant(Ne, a);
            if (x) {
              const w = An({}, rt(x));
              c = ot.AttributeMap.diff(w, c) || {};
            }
          }
        }
        t += l;
      } else if (i.push(o), o.retain !== null && typeof o.retain == "object") {
        const m = Object.keys(o.retain)[0];
        if (m == null) return a;
        this.scroll.updateEmbedAt(a, m, o.retain[m]);
      }
      Object.keys(c).forEach((m) => {
        this.scroll.formatAt(a, l, m, c[m]);
      });
      const h = d ? 1 : 0, g = f ? 1 : 0;
      return t += h + g, i.retain(h), i.delete(g), a + l + h + g;
    }, 0), i.reduce((a, o) => typeof o.delete == "number" ? (this.scroll.deleteAt(a, o.delete), a) : a + ot.Op.length(o), 0), this.scroll.batchEnd(), this.scroll.optimize(), this.update(n);
  }
  deleteText(e, t) {
    return this.scroll.deleteAt(e, t), this.update(new P().retain(e).delete(t));
  }
  formatLine(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.scroll.update(), Object.keys(n).forEach((s) => {
      this.scroll.lines(e, Math.max(t, 1)).forEach((a) => {
        a.format(s, n[s]);
      });
    }), this.scroll.optimize();
    const i = new P().retain(e).retain(t, Or(n));
    return this.update(i);
  }
  formatText(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(n).forEach((s) => {
      this.scroll.formatAt(e, t, s, n[s]);
    });
    const i = new P().retain(e).retain(t, Or(n));
    return this.update(i);
  }
  getContents(e, t) {
    return this.delta.slice(e, e + t);
  }
  getDelta() {
    return this.scroll.lines().reduce((e, t) => e.concat(t.delta()), new P());
  }
  getFormat(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = [], i = [];
    t === 0 ? this.scroll.path(e).forEach((o) => {
      const [l] = o;
      l instanceof Ee ? n.push(l) : l instanceof Ne && i.push(l);
    }) : (n = this.scroll.lines(e, t), i = this.scroll.descendants(Ne, e, t));
    const [s, a] = [n, i].map((o) => {
      const l = o.shift();
      if (l == null) return {};
      let c = rt(l);
      for (; Object.keys(c).length > 0; ) {
        const d = o.shift();
        if (d == null) return c;
        c = w0(rt(d), c);
      }
      return c;
    });
    return {
      ...s,
      ...a
    };
  }
  getHTML(e, t) {
    const [n, i] = this.scroll.line(e);
    if (n) {
      const s = n.length();
      return n.length() >= i + t && !(i === 0 && t === s) ? Gi(n, i, t, !0) : Gi(this.scroll, e, t, !0);
    }
    return "";
  }
  getText(e, t) {
    return this.getContents(e, t).filter((n) => typeof n.insert == "string").map((n) => n.insert).join("");
  }
  insertContents(e, t) {
    const n = id(t), i = new P().retain(e).concat(n);
    return this.scroll.insertContents(e, n), this.update(i);
  }
  insertEmbed(e, t, n) {
    return this.scroll.insertAt(e, t, n), this.update(new P().retain(e).insert({
      [t]: n
    }));
  }
  insertText(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return t = t.replace(/\r\n/g, `
`).replace(/\r/g, `
`), this.scroll.insertAt(e, t), Object.keys(n).forEach((i) => {
      this.scroll.formatAt(e, t.length, i, n[i]);
    }), this.update(new P().retain(e).insert(t, Or(n)));
  }
  isBlank() {
    if (this.scroll.children.length === 0) return !0;
    if (this.scroll.children.length > 1) return !1;
    const e = this.scroll.children.head;
    if ((e == null ? void 0 : e.statics.blotName) !== Ee.blotName) return !1;
    const t = e;
    return t.children.length > 1 ? !1 : t.children.head instanceof Ct;
  }
  removeFormat(e, t) {
    const n = this.getText(e, t), [i, s] = this.scroll.line(e + t);
    let a = 0, o = new P();
    i != null && (a = i.length() - s, o = i.delta().slice(s, s + a - 1).insert(`
`));
    const c = this.getContents(e, t + a).diff(new P().insert(n).concat(o)), d = new P().retain(e).concat(c);
    return this.applyDelta(d);
  }
  update(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
    const i = this.delta;
    if (t.length === 1 && t[0].type === "characterData" && // @ts-expect-error Fix me later
    t[0].target.data.match(y0) && this.scroll.find(t[0].target)) {
      const s = this.scroll.find(t[0].target), a = rt(s), o = s.offset(this.scroll), l = t[0].oldValue.replace(Yr.CONTENTS, ""), c = new P().insert(l), d = new P().insert(s.value()), f = n && {
        oldRange: sd(n.oldRange, -o),
        newRange: sd(n.newRange, -o)
      };
      e = new P().retain(o).concat(c.diff(d, f)).reduce((g, m) => m.insert ? g.insert(m.insert, a) : g.push(m), new P()), this.delta = i.compose(e);
    } else
      this.delta = this.getDelta(), (!e || !_c(i.compose(e), this.delta)) && (e = i.diff(this.delta, n));
    return e;
  }
}
function Tr(r, e, t) {
  if (r.length === 0) {
    const [g] = Go(t.pop());
    return e <= 0 ? `</li></${g}>` : `</li></${g}>${Tr([], e - 1, t)}`;
  }
  const [{
    child: n,
    offset: i,
    length: s,
    indent: a,
    type: o
  }, ...l] = r, [c, d] = Go(o);
  if (a > e)
    return t.push(o), a === e + 1 ? `<${c}><li${d}>${Gi(n, i, s)}${Tr(l, a, t)}` : `<${c}><li>${Tr(r, e + 1, t)}`;
  const f = t[t.length - 1];
  if (a === e && o === f)
    return `</li><li${d}>${Gi(n, i, s)}${Tr(l, a, t)}`;
  const [h] = Go(t.pop());
  return `</li></${h}>${Tr(r, e - 1, t)}`;
}
function Gi(r, e, t) {
  let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if ("html" in r && typeof r.html == "function")
    return r.html(e, t);
  if (r instanceof kt)
    return qa(r.value().slice(e, e + t)).replaceAll(" ", "&nbsp;");
  if (r instanceof wt) {
    if (r.statics.blotName === "list-container") {
      const c = [];
      return r.children.forEachAt(e, t, (d, f, h) => {
        const g = "formats" in d && typeof d.formats == "function" ? d.formats() : {};
        c.push({
          child: d,
          offset: f,
          length: h,
          indent: g.indent || 0,
          type: g.list
        });
      }), Tr(c, -1, []);
    }
    const i = [];
    if (r.children.forEachAt(e, t, (c, d, f) => {
      i.push(Gi(c, d, f));
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
function w0(r, e) {
  return Object.keys(e).reduce((t, n) => {
    if (r[n] == null) return t;
    const i = e[n];
    return i === r[n] ? t[n] = i : Array.isArray(i) ? i.indexOf(r[n]) < 0 ? t[n] = i.concat([r[n]]) : t[n] = i : t[n] = [i, r[n]], t;
  }, {});
}
function Go(r) {
  const e = r === "ordered" ? "ol" : "ul";
  switch (r) {
    case "checked":
      return [e, ' data-list="checked"'];
    case "unchecked":
      return [e, ' data-list="unchecked"'];
    default:
      return [e, ""];
  }
}
function id(r) {
  return r.reduce((e, t) => {
    if (typeof t.insert == "string") {
      const n = t.insert.replace(/\r\n/g, `
`).replace(/\r/g, `
`);
      return e.insert(n, t.attributes);
    }
    return e.push(t);
  }, new P());
}
function sd(r, e) {
  let {
    index: t,
    length: n
  } = r;
  return new Xn(t + e, n);
}
function x0(r) {
  const e = [];
  return r.forEach((t) => {
    typeof t.insert == "string" ? t.insert.split(`
`).forEach((i, s) => {
      s && e.push({
        insert: `
`,
        attributes: t.attributes
      }), i && e.push({
        insert: i,
        attributes: t.attributes
      });
    }) : e.push(t);
  }), e;
}
class Tt {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = e, this.options = t;
  }
}
q(Tt, "DEFAULTS", {});
const qs = "\uFEFF";
class jc extends Ze {
  constructor(e, t) {
    super(e, t), this.contentNode = document.createElement("span"), this.contentNode.setAttribute("contenteditable", "false"), Array.from(this.domNode.childNodes).forEach((n) => {
      this.contentNode.appendChild(n);
    }), this.leftGuard = document.createTextNode(qs), this.rightGuard = document.createTextNode(qs), this.domNode.appendChild(this.leftGuard), this.domNode.appendChild(this.contentNode), this.domNode.appendChild(this.rightGuard);
  }
  index(e, t) {
    return e === this.leftGuard ? 0 : e === this.rightGuard ? 1 : super.index(e, t);
  }
  restore(e) {
    let t = null, n;
    const i = e.data.split(qs).join("");
    if (e === this.leftGuard)
      if (this.prev instanceof kt) {
        const s = this.prev.length();
        this.prev.insertAt(s, i), t = {
          startNode: this.prev.domNode,
          startOffset: s + i.length
        };
      } else
        n = document.createTextNode(i), this.parent.insertBefore(this.scroll.create(n), this), t = {
          startNode: n,
          startOffset: i.length
        };
    else e === this.rightGuard && (this.next instanceof kt ? (this.next.insertAt(0, i), t = {
      startNode: this.next.domNode,
      startOffset: i.length
    }) : (n = document.createTextNode(i), this.parent.insertBefore(this.scroll.create(n), this.next), t = {
      startNode: n,
      startOffset: i.length
    }));
    return e.data = qs, t;
  }
  update(e, t) {
    e.forEach((n) => {
      if (n.type === "characterData" && (n.target === this.leftGuard || n.target === this.rightGuard)) {
        const i = this.restore(n.target);
        i && (t.range = i);
      }
    });
  }
}
class k0 {
  constructor(e, t) {
    q(this, "isComposing", !1);
    this.scroll = e, this.emitter = t, this.setupListeners();
  }
  setupListeners() {
    this.scroll.domNode.addEventListener("compositionstart", (e) => {
      this.isComposing || this.handleCompositionStart(e);
    }), this.scroll.domNode.addEventListener("compositionend", (e) => {
      this.isComposing && queueMicrotask(() => {
        this.handleCompositionEnd(e);
      });
    });
  }
  handleCompositionStart(e) {
    const t = e.target instanceof Node ? this.scroll.find(e.target, !0) : null;
    t && !(t instanceof jc) && (this.emitter.emit(R.events.COMPOSITION_BEFORE_START, e), this.scroll.batchStart(), this.emitter.emit(R.events.COMPOSITION_START, e), this.isComposing = !0);
  }
  handleCompositionEnd(e) {
    this.emitter.emit(R.events.COMPOSITION_BEFORE_END, e), this.scroll.batchEnd(), this.emitter.emit(R.events.COMPOSITION_END, e), this.isComposing = !1;
  }
}
const Pi = class Pi {
  constructor(e, t) {
    q(this, "modules", {});
    this.quill = e, this.options = t;
  }
  init() {
    Object.keys(this.options.modules).forEach((e) => {
      this.modules[e] == null && this.addModule(e);
    });
  }
  addModule(e) {
    const t = this.quill.constructor.import(`modules/${e}`);
    return this.modules[e] = new t(this.quill, this.options.modules[e] || {}), this.modules[e];
  }
};
q(Pi, "DEFAULTS", {
  modules: {}
}), q(Pi, "themes", {
  default: Pi
});
let Gr = Pi;
const S0 = (r) => r.parentElement || r.getRootNode().host || null, A0 = (r) => {
  const e = r.getBoundingClientRect(), t = "offsetWidth" in r && Math.abs(e.width) / r.offsetWidth || 1, n = "offsetHeight" in r && Math.abs(e.height) / r.offsetHeight || 1;
  return {
    top: e.top,
    right: e.left + r.clientWidth * t,
    bottom: e.top + r.clientHeight * n,
    left: e.left
  };
}, _s = (r) => {
  const e = parseInt(r, 10);
  return Number.isNaN(e) ? 0 : e;
}, ad = (r, e, t, n, i, s) => r < t && e > n ? 0 : r < t ? -(t - r + i) : e > n ? e - r > n - t ? r + i - t : e - n + s : 0, E0 = (r, e) => {
  var s, a, o;
  const t = r.ownerDocument;
  let n = e, i = r;
  for (; i; ) {
    const l = i === t.body, c = l ? {
      top: 0,
      right: ((s = window.visualViewport) == null ? void 0 : s.width) ?? t.documentElement.clientWidth,
      bottom: ((a = window.visualViewport) == null ? void 0 : a.height) ?? t.documentElement.clientHeight,
      left: 0
    } : A0(i), d = getComputedStyle(i), f = ad(n.left, n.right, c.left, c.right, _s(d.scrollPaddingLeft), _s(d.scrollPaddingRight)), h = ad(n.top, n.bottom, c.top, c.bottom, _s(d.scrollPaddingTop), _s(d.scrollPaddingBottom));
    if (f || h)
      if (l)
        (o = t.defaultView) == null || o.scrollBy(f, h);
      else {
        const {
          scrollLeft: g,
          scrollTop: m
        } = i;
        h && (i.scrollTop += h), f && (i.scrollLeft += f);
        const y = i.scrollLeft - g, x = i.scrollTop - m;
        n = {
          left: n.left - y,
          top: n.top - x,
          right: n.right - y,
          bottom: n.bottom - x
        };
      }
    i = l || d.position === "fixed" ? null : S0(i);
  }
}, C0 = 100, T0 = ["block", "break", "cursor", "inline", "scroll", "text"], L0 = (r, e, t) => {
  const n = new Vr();
  return T0.forEach((i) => {
    const s = e.query(i);
    s && n.register(s);
  }), r.forEach((i) => {
    let s = e.query(i);
    s || t.error(`Cannot register "${i}" specified in "formats" config. Are you sure it was registered?`);
    let a = 0;
    for (; s; )
      if (n.register(s), s = "blotName" in s ? s.requiredContainer ?? null : null, a += 1, a > C0) {
        t.error(`Cycle detected in registering blot requiredContainer: "${i}"`);
        break;
      }
  }), n;
}, qr = un("quill"), zs = new Vr();
wt.uiClass = "ql-ui";
const gt = class gt {
  static debug(e) {
    e === !0 && (e = "log"), un.level(e);
  }
  static find(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    return Bl.get(e) || zs.find(e, t);
  }
  static import(e) {
    return this.imports[e] == null && qr.error(`Cannot import ${e}. Are you sure it was registered?`), this.imports[e];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) != "string") {
      const e = arguments.length <= 0 ? void 0 : arguments[0], t = !!(!(arguments.length <= 1) && arguments[1]), n = "attrName" in e ? e.attrName : e.blotName;
      typeof n == "string" ? this.register(`formats/${n}`, e, t) : Object.keys(e).forEach((i) => {
        this.register(i, e[i], t);
      });
    } else {
      const e = arguments.length <= 0 ? void 0 : arguments[0], t = arguments.length <= 1 ? void 0 : arguments[1], n = !!(!(arguments.length <= 2) && arguments[2]);
      this.imports[e] != null && !n && qr.warn(`Overwriting ${e} with`, t), this.imports[e] = t, (e.startsWith("blots/") || e.startsWith("formats/")) && t && typeof t != "boolean" && t.blotName !== "abstract" && zs.register(t), typeof t.register == "function" && t.register(zs);
    }
  }
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.options = D0(e, t), this.container = this.options.container, this.container == null) {
      qr.error("Invalid Quill container", e);
      return;
    }
    this.options.debug && gt.debug(this.options.debug);
    const n = this.container.innerHTML.trim();
    this.container.classList.add("ql-container"), this.container.innerHTML = "", Bl.set(this.container, this), this.root = this.addContainer("ql-editor"), this.root.classList.add("ql-blank"), this.emitter = new R();
    const i = Rc.blotName, s = this.options.registry.query(i);
    if (!s || !("blotName" in s))
      throw new Error(`Cannot initialize Quill without "${i}" blot`);
    if (this.scroll = new s(this.options.registry, this.root, {
      emitter: this.emitter
    }), this.editor = new v0(this.scroll), this.selection = new b0(this.scroll, this.emitter), this.composition = new k0(this.scroll, this.emitter), this.theme = new this.options.theme(this, this.options), this.keyboard = this.theme.addModule("keyboard"), this.clipboard = this.theme.addModule("clipboard"), this.history = this.theme.addModule("history"), this.uploader = this.theme.addModule("uploader"), this.theme.addModule("input"), this.theme.addModule("uiNode"), this.theme.init(), this.emitter.on(R.events.EDITOR_CHANGE, (a) => {
      a === R.events.TEXT_CHANGE && this.root.classList.toggle("ql-blank", this.editor.isBlank());
    }), this.emitter.on(R.events.SCROLL_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), d = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      pt.call(this, () => this.editor.update(null, o, d), a);
    }), this.emitter.on(R.events.SCROLL_EMBED_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), d = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      pt.call(this, () => {
        const f = new P().retain(a.offset(this)).retain({
          [a.statics.blotName]: o
        });
        return this.editor.update(f, [], d);
      }, gt.sources.USER);
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
  addContainer(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (typeof e == "string") {
      const n = e;
      e = document.createElement("div"), e.classList.add(n);
    }
    return this.container.insertBefore(e, t), e;
  }
  blur() {
    this.selection.setRange(null);
  }
  deleteText(e, t, n) {
    return [e, t, , n] = nn(e, t, n), pt.call(this, () => this.editor.deleteText(e, t), n, e, -1 * t);
  }
  disable() {
    this.enable(!1);
  }
  editReadOnly(e) {
    this.allowReadOnlyEdits = !0;
    const t = e();
    return this.allowReadOnlyEdits = !1, t;
  }
  enable() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    this.scroll.enable(e), this.container.classList.toggle("ql-disabled", !e);
  }
  focus() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.selection.focus(), e.preventScroll || this.scrollSelectionIntoView();
  }
  format(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : R.sources.API;
    return pt.call(this, () => {
      const i = this.getSelection(!0);
      let s = new P();
      if (i == null) return s;
      if (this.scroll.query(e, B.BLOCK))
        s = this.editor.formatLine(i.index, i.length, {
          [e]: t
        });
      else {
        if (i.length === 0)
          return this.selection.format(e, t), s;
        s = this.editor.formatText(i.index, i.length, {
          [e]: t
        });
      }
      return this.setSelection(i, R.sources.SILENT), s;
    }, n);
  }
  formatLine(e, t, n, i, s) {
    let a;
    return [e, t, a, s] = nn(
      e,
      t,
      // @ts-expect-error
      n,
      i,
      s
    ), pt.call(this, () => this.editor.formatLine(e, t, a), s, e, 0);
  }
  formatText(e, t, n, i, s) {
    let a;
    return [e, t, a, s] = nn(
      // @ts-expect-error
      e,
      t,
      n,
      i,
      s
    ), pt.call(this, () => this.editor.formatText(e, t, a), s, e, 0);
  }
  getBounds(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = null;
    if (typeof e == "number" ? n = this.selection.getBounds(e, t) : n = this.selection.getBounds(e.index, e.length), !n) return null;
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
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - e;
    return [e, t] = nn(e, t), this.editor.getContents(e, t);
  }
  getFormat() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(!0), t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return typeof e == "number" ? this.editor.getFormat(e, t) : this.editor.getFormat(e.index, e.length);
  }
  getIndex(e) {
    return e.offset(this.scroll);
  }
  getLength() {
    return this.scroll.length();
  }
  getLeaf(e) {
    return this.scroll.leaf(e);
  }
  getLine(e) {
    return this.scroll.line(e);
  }
  getLines() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    return typeof e != "number" ? this.scroll.lines(e.index, e.length) : this.scroll.lines(e, t);
  }
  getModule(e) {
    return this.theme.modules[e];
  }
  getSelection() {
    return (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1) && this.focus(), this.update(), this.selection.getRange()[0];
  }
  getSemanticHTML() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, t = arguments.length > 1 ? arguments[1] : void 0;
    return typeof e == "number" && (t = t ?? this.getLength() - e), [e, t] = nn(e, t), this.editor.getHTML(e, t);
  }
  getText() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, t = arguments.length > 1 ? arguments[1] : void 0;
    return typeof e == "number" && (t = t ?? this.getLength() - e), [e, t] = nn(e, t), this.editor.getText(e, t);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(e, t, n) {
    let i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : gt.sources.API;
    return pt.call(this, () => this.editor.insertEmbed(e, t, n), i, e);
  }
  insertText(e, t, n, i, s) {
    let a;
    return [e, , a, s] = nn(e, 0, n, i, s), pt.call(this, () => this.editor.insertText(e, t, a), s, e, t.length);
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
  removeFormat(e, t, n) {
    return [e, t, , n] = nn(e, t, n), pt.call(this, () => this.editor.removeFormat(e, t), n, e);
  }
  scrollRectIntoView(e) {
    E0(this.root, e);
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
    const e = this.selection.lastRange, t = e && this.selection.getBounds(e.index, e.length);
    t && this.scrollRectIntoView(t);
  }
  setContents(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : R.sources.API;
    return pt.call(this, () => {
      e = new P(e);
      const n = this.getLength(), i = this.editor.deleteText(0, n), s = this.editor.insertContents(0, e), a = this.editor.deleteText(this.getLength() - 1, 1);
      return i.compose(s).compose(a);
    }, t);
  }
  setSelection(e, t, n) {
    e == null ? this.selection.setRange(null, t || gt.sources.API) : ([e, t, , n] = nn(e, t, n), this.selection.setRange(new Xn(Math.max(0, e), t), n), n !== R.sources.SILENT && this.scrollSelectionIntoView());
  }
  setText(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : R.sources.API;
    const n = new P().insert(e);
    return this.setContents(n, t);
  }
  update() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : R.sources.USER;
    const t = this.scroll.update(e);
    return this.selection.update(e), t;
  }
  updateContents(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : R.sources.API;
    return pt.call(this, () => (e = new P(e), this.editor.applyDelta(e)), t, !0);
  }
};
q(gt, "DEFAULTS", {
  bounds: null,
  modules: {
    clipboard: !0,
    keyboard: !0,
    history: !0,
    uploader: !0
  },
  placeholder: "",
  readOnly: !1,
  registry: zs,
  theme: "default"
}), q(gt, "events", R.events), q(gt, "sources", R.sources), q(gt, "version", "2.0.3"), q(gt, "imports", {
  delta: P,
  parchment: J1,
  "core/module": Tt,
  "core/theme": Gr
});
let D = gt;
function od(r) {
  return typeof r == "string" ? document.querySelector(r) : r;
}
function Ko(r) {
  return Object.entries(r ?? {}).reduce((e, t) => {
    let [n, i] = t;
    return {
      ...e,
      [n]: i === !0 ? {} : i
    };
  }, {});
}
function ld(r) {
  return Object.fromEntries(Object.entries(r).filter((e) => e[1] !== void 0));
}
function D0(r, e) {
  const t = od(r);
  if (!t)
    throw new Error("Invalid Quill container");
  const i = !e.theme || e.theme === D.DEFAULTS.theme ? Gr : D.import(`themes/${e.theme}`);
  if (!i)
    throw new Error(`Invalid theme ${e.theme}. Did you register it?`);
  const {
    modules: s,
    ...a
  } = D.DEFAULTS, {
    modules: o,
    ...l
  } = i.DEFAULTS;
  let c = Ko(e.modules);
  c != null && c.toolbar && c.toolbar.constructor !== Object && (c = {
    ...c,
    toolbar: {
      container: c.toolbar
    }
  });
  const d = An({}, Ko(s), Ko(o), c), f = {
    ...a,
    ...ld(l),
    ...ld(e)
  };
  let h = e.registry;
  return h ? e.formats && qr.warn('Ignoring "formats" option because "registry" is specified') : h = e.formats ? L0(e.formats, f.registry, qr) : f.registry, {
    ...f,
    registry: h,
    container: t,
    theme: i,
    modules: Object.entries(d).reduce((g, m) => {
      let [y, x] = m;
      if (!x) return g;
      const w = D.import(`modules/${y}`);
      return w == null ? (qr.error(`Cannot load ${y} module. Are you sure you registered it?`), g) : {
        ...g,
        // @ts-expect-error
        [y]: An({}, w.DEFAULTS || {}, x)
      };
    }, {}),
    bounds: od(f.bounds)
  };
}
function pt(r, e, t, n) {
  if (!this.isEnabled() && e === R.sources.USER && !this.allowReadOnlyEdits)
    return new P();
  let i = t == null ? null : this.getSelection();
  const s = this.editor.delta, a = r();
  if (i != null && (t === !0 && (t = i.index), n == null ? i = cd(i, a, e) : n !== 0 && (i = cd(i, t, n, e)), this.setSelection(i, R.sources.SILENT)), a.length() > 0) {
    const o = [R.events.TEXT_CHANGE, a, s, e];
    this.emitter.emit(R.events.EDITOR_CHANGE, ...o), e !== R.sources.SILENT && this.emitter.emit(...o);
  }
  return a;
}
function nn(r, e, t, n, i) {
  let s = {};
  return typeof r.index == "number" && typeof r.length == "number" ? typeof e != "number" ? (i = n, n = t, t = e, e = r.length, r = r.index) : (e = r.length, r = r.index) : typeof e != "number" && (i = n, n = t, t = e, e = 0), typeof t == "object" ? (s = t, i = n) : typeof t == "string" && (n != null ? s[t] = n : i = t), i = i || R.sources.API, [r, e, s, i];
}
function cd(r, e, t, n) {
  const i = typeof t == "number" ? t : 0;
  if (r == null) return null;
  let s, a;
  return e && typeof e.transformPosition == "function" ? [s, a] = [r.index, r.index + r.length].map((o) => (
    // @ts-expect-error -- TODO: add a better type guard around `index`
    e.transformPosition(o, n !== R.sources.USER)
  )) : [s, a] = [r.index, r.index + r.length].map((o) => o < e || o === e && n === R.sources.USER ? o : i >= 0 ? o + i : Math.max(e, o + i)), new Xn(s, a - s);
}
class ir extends Ia {
}
function ud(r) {
  return r instanceof Ee || r instanceof at;
}
function dd(r) {
  return typeof r.updateContent == "function";
}
class Lr extends Rc {
  constructor(e, t, n) {
    let {
      emitter: i
    } = n;
    super(e, t), this.emitter = i, this.batch = !1, this.optimize(), this.enable(), this.domNode.addEventListener("dragstart", (s) => this.handleDragStart(s));
  }
  batchStart() {
    Array.isArray(this.batch) || (this.batch = []);
  }
  batchEnd() {
    if (!this.batch) return;
    const e = this.batch;
    this.batch = !1, this.update(e);
  }
  emitMount(e) {
    this.emitter.emit(R.events.SCROLL_BLOT_MOUNT, e);
  }
  emitUnmount(e) {
    this.emitter.emit(R.events.SCROLL_BLOT_UNMOUNT, e);
  }
  emitEmbedUpdate(e, t) {
    this.emitter.emit(R.events.SCROLL_EMBED_UPDATE, e, t);
  }
  deleteAt(e, t) {
    const [n, i] = this.line(e), [s] = this.line(e + t);
    if (super.deleteAt(e, t), s != null && n !== s && i > 0) {
      if (n instanceof at || s instanceof at) {
        this.optimize();
        return;
      }
      const a = s.children.head instanceof Ct ? null : s.children.head;
      n.moveChildren(s, a), n.remove();
    }
    this.optimize();
  }
  enable() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    this.domNode.setAttribute("contenteditable", e ? "true" : "false");
  }
  formatAt(e, t, n, i) {
    super.formatAt(e, t, n, i), this.optimize();
  }
  insertAt(e, t, n) {
    if (e >= this.length())
      if (n == null || this.scroll.query(t, B.BLOCK) == null) {
        const i = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(i), n == null && t.endsWith(`
`) ? i.insertAt(0, t.slice(0, -1), n) : i.insertAt(0, t, n);
      } else {
        const i = this.scroll.create(t, n);
        this.appendChild(i);
      }
    else
      super.insertAt(e, t, n);
    this.optimize();
  }
  insertBefore(e, t) {
    if (e.statics.scope === B.INLINE_BLOT) {
      const n = this.scroll.create(this.statics.defaultChild.blotName);
      n.appendChild(e), super.insertBefore(n, t);
    } else
      super.insertBefore(e, t);
  }
  insertContents(e, t) {
    const n = this.deltaToRenderBlocks(t.concat(new P().insert(`
`))), i = n.pop();
    if (i == null) return;
    this.batchStart();
    const s = n.shift();
    if (s) {
      const l = s.type === "block" && (s.delta.length() === 0 || !this.descendant(at, e)[0] && e < this.length()), c = s.type === "block" ? s.delta : new P().insert({
        [s.key]: s.value
      });
      Wo(this, e, c);
      const d = s.type === "block" ? 1 : 0, f = e + c.length() + d;
      l && this.insertAt(f - 1, `
`);
      const h = rt(this.line(e)[0]), g = ot.AttributeMap.diff(h, s.attributes) || {};
      Object.keys(g).forEach((m) => {
        this.formatAt(f - 1, 1, m, g[m]);
      }), e = f;
    }
    let [a, o] = this.children.find(e);
    if (n.length && (a && (a = a.split(o), o = 0), n.forEach((l) => {
      if (l.type === "block") {
        const c = this.createBlock(l.attributes, a || void 0);
        Wo(c, 0, l.delta);
      } else {
        const c = this.create(l.key, l.value);
        this.insertBefore(c, a || void 0), Object.keys(l.attributes).forEach((d) => {
          c.format(d, l.attributes[d]);
        });
      }
    })), i.type === "block" && i.delta.length()) {
      const l = a ? a.offset(a.scroll) + o : this.length();
      Wo(this, l, i.delta);
    }
    this.batchEnd(), this.optimize();
  }
  isEnabled() {
    return this.domNode.getAttribute("contenteditable") === "true";
  }
  leaf(e) {
    const t = this.path(e).pop();
    if (!t)
      return [null, -1];
    const [n, i] = t;
    return n instanceof Ne ? [n, i] : [null, -1];
  }
  line(e) {
    return e === this.length() ? this.line(e - 1) : this.descendant(ud, e);
  }
  lines() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const n = (i, s, a) => {
      let o = [], l = a;
      return i.children.forEachAt(s, a, (c, d, f) => {
        ud(c) ? o.push(c) : c instanceof Ia && (o = o.concat(n(c, d, l))), l -= f;
      }), o;
    };
    return n(this, e, t);
  }
  optimize() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.batch || (super.optimize(e, t), e.length > 0 && this.emitter.emit(R.events.SCROLL_OPTIMIZE, e, t));
  }
  path(e) {
    return super.path(e).slice(1);
  }
  remove() {
  }
  update(e) {
    if (this.batch) {
      Array.isArray(e) && (this.batch = this.batch.concat(e));
      return;
    }
    let t = R.sources.USER;
    typeof e == "string" && (t = e), Array.isArray(e) || (e = this.observer.takeRecords()), e = e.filter((n) => {
      let {
        target: i
      } = n;
      const s = this.find(i, !0);
      return s && !dd(s);
    }), e.length > 0 && this.emitter.emit(R.events.SCROLL_BEFORE_UPDATE, t, e), super.update(e.concat([])), e.length > 0 && this.emitter.emit(R.events.SCROLL_UPDATE, t, e);
  }
  updateEmbedAt(e, t, n) {
    const [i] = this.descendant((s) => s instanceof at, e);
    i && i.statics.blotName === t && dd(i) && i.updateContent(n);
  }
  handleDragStart(e) {
    e.preventDefault();
  }
  deltaToRenderBlocks(e) {
    const t = [];
    let n = new P();
    return e.forEach((i) => {
      const s = i == null ? void 0 : i.insert;
      if (s)
        if (typeof s == "string") {
          const a = s.split(`
`);
          a.slice(0, -1).forEach((l) => {
            n.insert(l, i.attributes), t.push({
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
          this.query(a, B.INLINE) ? n.push(i) : (n.length() && t.push({
            type: "block",
            delta: n,
            attributes: {}
          }), n = new P(), t.push({
            type: "blockEmbed",
            key: a,
            value: s[a],
            attributes: i.attributes ?? {}
          }));
        }
    }), n.length() && t.push({
      type: "block",
      delta: n,
      attributes: {}
    }), t;
  }
  createBlock(e, t) {
    let n;
    const i = {};
    Object.entries(e).forEach((o) => {
      let [l, c] = o;
      this.query(l, B.BLOCK & B.BLOT) != null ? n = l : i[l] = c;
    });
    const s = this.create(n || this.statics.defaultChild.blotName, n ? e[n] : void 0);
    this.insertBefore(s, t || void 0);
    const a = s.length();
    return Object.entries(i).forEach((o) => {
      let [l, c] = o;
      s.formatAt(0, a, l, c);
    }), s;
  }
}
q(Lr, "blotName", "scroll"), q(Lr, "className", "ql-editor"), q(Lr, "tagName", "DIV"), q(Lr, "defaultChild", Ee), q(Lr, "allowedChildren", [Ee, at, ir]);
function Wo(r, e, t) {
  t.reduce((n, i) => {
    const s = ot.Op.length(i);
    let a = i.attributes || {};
    if (i.insert != null) {
      if (typeof i.insert == "string") {
        const o = i.insert;
        r.insertAt(n, o);
        const [l] = r.descendant(Ne, n), c = rt(l);
        a = ot.AttributeMap.diff(c, a) || {};
      } else if (typeof i.insert == "object") {
        const o = Object.keys(i.insert)[0];
        if (o == null) return n;
        if (r.insertAt(n, o, i.insert[o]), r.scroll.query(o, B.INLINE) != null) {
          const [c] = r.descendant(Ne, n), d = rt(c);
          a = ot.AttributeMap.diff(d, a) || {};
        }
      }
    }
    return Object.keys(a).forEach((o) => {
      r.formatAt(n, s, o, a[o]);
    }), n + s;
  }, e);
}
const Uc = {
  scope: B.BLOCK,
  whitelist: ["right", "center", "justify"]
}, I0 = new Ut("align", "align", Uc), Bf = new Et("align", "ql-align", Uc), Ff = new Nn("align", "text-align", Uc);
class $f extends Nn {
  value(e) {
    let t = super.value(e);
    return t.startsWith("rgb(") ? (t = t.replace(/^[^\d]+/, "").replace(/[^\d]+$/, ""), `#${t.split(",").map((i) => `00${parseInt(i, 10).toString(16)}`.slice(-2)).join("")}`) : t;
  }
}
const N0 = new Et("color", "ql-color", {
  scope: B.INLINE
}), Hc = new $f("color", "color", {
  scope: B.INLINE
}), O0 = new Et("background", "ql-bg", {
  scope: B.INLINE
}), Vc = new $f("background", "background-color", {
  scope: B.INLINE
});
class sr extends ir {
  static create(e) {
    const t = super.create(e);
    return t.setAttribute("spellcheck", "false"), t;
  }
  code(e, t) {
    return this.children.map((n) => n.length() <= 1 ? "" : n.domNode.innerText).join(`
`).slice(e, e + t);
  }
  html(e, t) {
    return `<pre>
${qa(this.code(e, t))}
</pre>`;
  }
}
class Me extends Ee {
  static register() {
    D.register(sr);
  }
}
q(Me, "TAB", "  ");
class Yc extends Ht {
}
Yc.blotName = "code";
Yc.tagName = "CODE";
Me.blotName = "code-block";
Me.className = "ql-code-block";
Me.tagName = "DIV";
sr.blotName = "code-block-container";
sr.className = "ql-code-block-container";
sr.tagName = "DIV";
sr.allowedChildren = [Me];
Me.allowedChildren = [kt, Ct, Yr];
Me.requiredContainer = sr;
const Gc = {
  scope: B.BLOCK,
  whitelist: ["rtl"]
}, jf = new Ut("direction", "dir", Gc), Uf = new Et("direction", "ql-direction", Gc), Hf = new Nn("direction", "direction", Gc), Vf = {
  scope: B.INLINE,
  whitelist: ["serif", "monospace"]
}, Yf = new Et("font", "ql-font", Vf);
class M0 extends Nn {
  value(e) {
    return super.value(e).replace(/["']/g, "");
  }
}
const Gf = new M0("font", "font-family", Vf), Kf = new Et("size", "ql-size", {
  scope: B.INLINE,
  whitelist: ["small", "large", "huge"]
}), Wf = new Nn("size", "font-size", {
  scope: B.INLINE,
  whitelist: ["10px", "18px", "32px"]
}), q0 = un("quill:keyboard"), _0 = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
class _a extends Tt {
  static match(e, t) {
    return ["altKey", "ctrlKey", "metaKey", "shiftKey"].some((n) => !!t[n] !== e[n] && t[n] !== null) ? !1 : t.key === e.key || t.key === e.which;
  }
  constructor(e, t) {
    super(e, t), this.bindings = {}, Object.keys(this.options.bindings).forEach((n) => {
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
  addBinding(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const i = R0(e);
    if (i == null) {
      q0.warn("Attempted to add invalid keyboard binding", i);
      return;
    }
    typeof t == "function" && (t = {
      handler: t
    }), typeof n == "function" && (n = {
      handler: n
    }), (Array.isArray(i.key) ? i.key : [i.key]).forEach((a) => {
      const o = {
        ...i,
        key: a,
        ...t,
        ...n
      };
      this.bindings[o.key] = this.bindings[o.key] || [], this.bindings[o.key].push(o);
    });
  }
  listen() {
    this.quill.root.addEventListener("keydown", (e) => {
      if (e.defaultPrevented || e.isComposing || e.keyCode === 229 && (e.key === "Enter" || e.key === "Backspace")) return;
      const i = (this.bindings[e.key] || []).concat(this.bindings[e.which] || []).filter((w) => _a.match(e, w));
      if (i.length === 0) return;
      const s = D.find(e.target, !0);
      if (s && s.scroll !== this.quill.scroll) return;
      const a = this.quill.getSelection();
      if (a == null || !this.quill.hasFocus()) return;
      const [o, l] = this.quill.getLine(a.index), [c, d] = this.quill.getLeaf(a.index), [f, h] = a.length === 0 ? [c, d] : this.quill.getLeaf(a.index + a.length), g = c instanceof la ? c.value().slice(0, d) : "", m = f instanceof la ? f.value().slice(h) : "", y = {
        collapsed: a.length === 0,
        // @ts-expect-error Fix me later
        empty: a.length === 0 && o.length() <= 1,
        format: this.quill.getFormat(a),
        line: o,
        offset: l,
        prefix: g,
        suffix: m,
        event: e
      };
      i.some((w) => {
        if (w.collapsed != null && w.collapsed !== y.collapsed || w.empty != null && w.empty !== y.empty || w.offset != null && w.offset !== y.offset)
          return !1;
        if (Array.isArray(w.format)) {
          if (w.format.every((S) => y.format[S] == null))
            return !1;
        } else if (typeof w.format == "object" && !Object.keys(w.format).every((S) => w.format[S] === !0 ? y.format[S] != null : w.format[S] === !1 ? y.format[S] == null : _c(w.format[S], y.format[S])))
          return !1;
        return w.prefix != null && !w.prefix.test(y.prefix) || w.suffix != null && !w.suffix.test(y.suffix) ? !1 : w.handler.call(this, a, y, w) !== !0;
      }) && e.preventDefault();
    });
  }
  handleBackspace(e, t) {
    const n = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(t.prefix) ? 2 : 1;
    if (e.index === 0 || this.quill.getLength() <= 1) return;
    let i = {};
    const [s] = this.quill.getLine(e.index);
    let a = new P().retain(e.index - n).delete(n);
    if (t.offset === 0) {
      const [o] = this.quill.getLine(e.index - 1);
      if (o && !(o.statics.blotName === "block" && o.length() <= 1)) {
        const c = s.formats(), d = this.quill.getFormat(e.index - 1, 1);
        if (i = ot.AttributeMap.diff(c, d) || {}, Object.keys(i).length > 0) {
          const f = new P().retain(e.index + s.length() - 2).retain(1, i);
          a = a.compose(f);
        }
      }
    }
    this.quill.updateContents(a, D.sources.USER), this.quill.focus();
  }
  handleDelete(e, t) {
    const n = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(t.suffix) ? 2 : 1;
    if (e.index >= this.quill.getLength() - n) return;
    let i = {};
    const [s] = this.quill.getLine(e.index);
    let a = new P().retain(e.index).delete(n);
    if (t.offset >= s.length() - 1) {
      const [o] = this.quill.getLine(e.index + 1);
      if (o) {
        const l = s.formats(), c = this.quill.getFormat(e.index, 1);
        i = ot.AttributeMap.diff(l, c) || {}, Object.keys(i).length > 0 && (a = a.retain(o.length() - 1).retain(1, i));
      }
    }
    this.quill.updateContents(a, D.sources.USER), this.quill.focus();
  }
  handleDeleteRange(e) {
    Kc({
      range: e,
      quill: this.quill
    }), this.quill.focus();
  }
  handleEnter(e, t) {
    const n = Object.keys(t.format).reduce((s, a) => (this.quill.scroll.query(a, B.BLOCK) && !Array.isArray(t.format[a]) && (s[a] = t.format[a]), s), {}), i = new P().retain(e.index).delete(e.length).insert(`
`, n);
    this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(e.index + 1, D.sources.SILENT), this.quill.focus();
  }
}
const z0 = {
  bindings: {
    bold: Qo("bold"),
    italic: Qo("italic"),
    underline: Qo("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(r, e) {
        return e.collapsed && e.offset !== 0 ? !0 : (this.quill.format("indent", "+1", D.sources.USER), !1);
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: !0,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(r, e) {
        return e.collapsed && e.offset !== 0 ? !0 : (this.quill.format("indent", "-1", D.sources.USER), !1);
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
      handler(r, e) {
        e.format.indent != null ? this.quill.format("indent", "-1", D.sources.USER) : e.format.list != null && this.quill.format("list", !1, D.sources.USER);
      }
    },
    "indent code-block": hd(!0),
    "outdent code-block": hd(!1),
    "remove tab": {
      key: "Tab",
      shiftKey: !0,
      collapsed: !0,
      prefix: /\t$/,
      handler(r) {
        this.quill.deleteText(r.index - 1, 1, D.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(r, e) {
        if (e.format.table) return !0;
        this.quill.history.cutoff();
        const t = new P().retain(r.index).delete(r.length).insert("	");
        return this.quill.updateContents(t, D.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index + 1, D.sources.SILENT), !1;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: !0,
      format: ["blockquote"],
      empty: !0,
      handler() {
        this.quill.format("blockquote", !1, D.sources.USER);
      }
    },
    "list empty enter": {
      key: "Enter",
      collapsed: !0,
      format: ["list"],
      empty: !0,
      handler(r, e) {
        const t = {
          list: !1
        };
        e.format.indent && (t.indent = !1), this.quill.formatLine(r.index, r.length, t, D.sources.USER);
      }
    },
    "checklist enter": {
      key: "Enter",
      collapsed: !0,
      format: {
        list: "checked"
      },
      handler(r) {
        const [e, t] = this.quill.getLine(r.index), n = {
          // @ts-expect-error Fix me later
          ...e.formats(),
          list: "checked"
        }, i = new P().retain(r.index).insert(`
`, n).retain(e.length() - t - 1).retain(1, {
          list: "unchecked"
        });
        this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(r.index + 1, D.sources.SILENT), this.quill.scrollSelectionIntoView();
      }
    },
    "header enter": {
      key: "Enter",
      collapsed: !0,
      format: ["header"],
      suffix: /^$/,
      handler(r, e) {
        const [t, n] = this.quill.getLine(r.index), i = new P().retain(r.index).insert(`
`, e.format).retain(t.length() - n - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(r.index + 1, D.sources.SILENT), this.quill.scrollSelectionIntoView();
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
        const e = this.quill.getModule("table");
        if (e) {
          const [t, n, i, s] = e.getTable(r), a = P0(t, n, i, s);
          if (a == null) return;
          let o = t.offset();
          if (a < 0) {
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, D.sources.USER), this.quill.setSelection(r.index + 1, r.length, D.sources.SILENT);
          } else if (a > 0) {
            o += t.length();
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, D.sources.USER), this.quill.setSelection(o, D.sources.USER);
          }
        }
      }
    },
    "table tab": {
      key: "Tab",
      shiftKey: null,
      format: ["table"],
      handler(r, e) {
        const {
          event: t,
          line: n
        } = e, i = n.offset(this.quill.scroll);
        t.shiftKey ? this.quill.setSelection(i - 1, D.sources.USER) : this.quill.setSelection(i + n.length(), D.sources.USER);
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
      handler(r, e) {
        if (this.quill.scroll.query("list") == null) return !0;
        const {
          length: t
        } = e.prefix, [n, i] = this.quill.getLine(r.index);
        if (i > t) return !0;
        let s;
        switch (e.prefix.trim()) {
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
        this.quill.insertText(r.index, " ", D.sources.USER), this.quill.history.cutoff();
        const a = new P().retain(r.index - i).delete(t + 1).retain(n.length() - 2 - i).retain(1, {
          list: s
        });
        return this.quill.updateContents(a, D.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index - t, D.sources.SILENT), !1;
      }
    },
    "code exit": {
      key: "Enter",
      collapsed: !0,
      format: ["code-block"],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler(r) {
        const [e, t] = this.quill.getLine(r.index);
        let n = 2, i = e;
        for (; i != null && i.length() <= 1 && i.formats()["code-block"]; )
          if (i = i.prev, n -= 1, n <= 0) {
            const s = new P().retain(r.index + e.length() - t - 2).retain(1, {
              "code-block": null
            }).delete(1);
            return this.quill.updateContents(s, D.sources.USER), this.quill.setSelection(r.index - 1, D.sources.SILENT), !1;
          }
        return !0;
      }
    },
    "embed left": Rs("ArrowLeft", !1),
    "embed left shift": Rs("ArrowLeft", !0),
    "embed right": Rs("ArrowRight", !1),
    "embed right shift": Rs("ArrowRight", !0),
    "table down": fd(!1),
    "table up": fd(!0)
  }
};
_a.DEFAULTS = z0;
function hd(r) {
  return {
    key: "Tab",
    shiftKey: !r,
    format: {
      "code-block": !0
    },
    handler(e, t) {
      let {
        event: n
      } = t;
      const i = this.quill.scroll.query("code-block"), {
        TAB: s
      } = i;
      if (e.length === 0 && !n.shiftKey) {
        this.quill.insertText(e.index, s, D.sources.USER), this.quill.setSelection(e.index + s.length, D.sources.SILENT);
        return;
      }
      const a = e.length === 0 ? this.quill.getLines(e.index, 1) : this.quill.getLines(e);
      let {
        index: o,
        length: l
      } = e;
      a.forEach((c, d) => {
        r ? (c.insertAt(0, s), d === 0 ? o += s.length : l += s.length) : c.domNode.textContent.startsWith(s) && (c.deleteAt(0, s.length), d === 0 ? o -= s.length : l -= s.length);
      }), this.quill.update(D.sources.USER), this.quill.setSelection(o, l, D.sources.SILENT);
    }
  };
}
function Rs(r, e) {
  return {
    key: r,
    shiftKey: e,
    altKey: null,
    [r === "ArrowLeft" ? "prefix" : "suffix"]: /^$/,
    handler(n) {
      let {
        index: i
      } = n;
      r === "ArrowRight" && (i += n.length + 1);
      const [s] = this.quill.getLeaf(i);
      return s instanceof Ze ? (r === "ArrowLeft" ? e ? this.quill.setSelection(n.index - 1, n.length + 1, D.sources.USER) : this.quill.setSelection(n.index - 1, D.sources.USER) : e ? this.quill.setSelection(n.index, n.length + 1, D.sources.USER) : this.quill.setSelection(n.index + n.length + 1, D.sources.USER), !1) : !0;
    }
  };
}
function Qo(r) {
  return {
    key: r[0],
    shortKey: !0,
    handler(e, t) {
      this.quill.format(r, !t.format[r], D.sources.USER);
    }
  };
}
function fd(r) {
  return {
    key: r ? "ArrowUp" : "ArrowDown",
    collapsed: !0,
    format: ["table"],
    handler(e, t) {
      const n = r ? "prev" : "next", i = t.line, s = i.parent[n];
      if (s != null) {
        if (s.statics.blotName === "table-row") {
          let a = s.children.head, o = i;
          for (; o.prev != null; )
            o = o.prev, a = a.next;
          const l = a.offset(this.quill.scroll) + Math.min(t.offset, a.length() - 1);
          this.quill.setSelection(l, 0, D.sources.USER);
        }
      } else {
        const a = i.table()[n];
        a != null && (r ? this.quill.setSelection(a.offset(this.quill.scroll) + a.length() - 1, 0, D.sources.USER) : this.quill.setSelection(a.offset(this.quill.scroll), 0, D.sources.USER));
      }
      return !1;
    }
  };
}
function R0(r) {
  if (typeof r == "string" || typeof r == "number")
    r = {
      key: r
    };
  else if (typeof r == "object")
    r = Or(r);
  else
    return null;
  return r.shortKey && (r[_0] = r.shortKey, delete r.shortKey), r;
}
function Kc(r) {
  let {
    quill: e,
    range: t
  } = r;
  const n = e.getLines(t);
  let i = {};
  if (n.length > 1) {
    const s = n[0].formats(), a = n[n.length - 1].formats();
    i = ot.AttributeMap.diff(a, s) || {};
  }
  e.deleteText(t, D.sources.USER), Object.keys(i).length > 0 && e.formatLine(t.index, 1, i, D.sources.USER), e.setSelection(t.index, D.sources.SILENT);
}
function P0(r, e, t, n) {
  return e.prev == null && e.next == null ? t.prev == null && t.next == null ? n === 0 ? -1 : 1 : t.prev == null ? -1 : 1 : e.prev == null ? -1 : e.next == null ? 1 : null;
}
const B0 = /font-weight:\s*normal/, F0 = ["P", "OL", "UL"], pd = (r) => r && F0.includes(r.tagName), $0 = (r) => {
  Array.from(r.querySelectorAll("br")).filter((e) => pd(e.previousElementSibling) && pd(e.nextElementSibling)).forEach((e) => {
    var t;
    (t = e.parentNode) == null || t.removeChild(e);
  });
}, j0 = (r) => {
  Array.from(r.querySelectorAll('b[style*="font-weight"]')).filter((e) => {
    var t;
    return (t = e.getAttribute("style")) == null ? void 0 : t.match(B0);
  }).forEach((e) => {
    var n;
    const t = r.createDocumentFragment();
    t.append(...e.childNodes), (n = e.parentNode) == null || n.replaceChild(t, e);
  });
};
function U0(r) {
  r.querySelector('[id^="docs-internal-guid-"]') && (j0(r), $0(r));
}
const H0 = /\bmso-list:[^;]*ignore/i, V0 = /\bmso-list:[^;]*\bl(\d+)/i, Y0 = /\bmso-list:[^;]*\blevel(\d+)/i, G0 = (r, e) => {
  const t = r.getAttribute("style"), n = t == null ? void 0 : t.match(V0);
  if (!n)
    return null;
  const i = Number(n[1]), s = t == null ? void 0 : t.match(Y0), a = s ? Number(s[1]) : 1, o = new RegExp(`@list l${i}:level${a}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i"), l = e.match(o), c = l && l[1] === "bullet" ? "bullet" : "ordered";
  return {
    id: i,
    indent: a,
    type: c,
    element: r
  };
}, K0 = (r) => {
  var a, o;
  const e = Array.from(r.querySelectorAll("[style*=mso-list]")), t = [], n = [];
  e.forEach((l) => {
    (l.getAttribute("style") || "").match(H0) ? t.push(l) : n.push(l);
  }), t.forEach((l) => {
    var c;
    return (c = l.parentNode) == null ? void 0 : c.removeChild(l);
  });
  const i = r.documentElement.innerHTML, s = n.map((l) => G0(l, i)).filter((l) => l);
  for (; s.length; ) {
    const l = [];
    let c = s.shift();
    for (; c; )
      l.push(c), c = s.length && ((a = s[0]) == null ? void 0 : a.element) === c.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
      s[0].id === c.id ? s.shift() : null;
    const d = document.createElement("ul");
    l.forEach((g) => {
      const m = document.createElement("li");
      m.setAttribute("data-list", g.type), g.indent > 1 && m.setAttribute("class", `ql-indent-${g.indent - 1}`), m.innerHTML = g.element.innerHTML, d.appendChild(m);
    });
    const f = (o = l[0]) == null ? void 0 : o.element, {
      parentNode: h
    } = f ?? {};
    f && (h == null || h.replaceChild(d, f)), l.slice(1).forEach((g) => {
      let {
        element: m
      } = g;
      h == null || h.removeChild(m);
    });
  }
};
function W0(r) {
  r.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word" && K0(r);
}
const Q0 = [W0, U0], Z0 = (r) => {
  r.documentElement && Q0.forEach((e) => {
    e(r);
  });
}, X0 = un("quill:clipboard"), J0 = [[Node.TEXT_NODE, dw], [Node.TEXT_NODE, md], ["br", iw], [Node.ELEMENT_NODE, md], [Node.ELEMENT_NODE, rw], [Node.ELEMENT_NODE, nw], [Node.ELEMENT_NODE, cw], ["li", ow], ["ol, ul", lw], ["pre", sw], ["tr", uw], ["b", Zo("bold")], ["i", Zo("italic")], ["strike", Zo("strike")], ["style", aw]], ew = [I0, jf].reduce((r, e) => (r[e.keyName] = e, r), {}), gd = [Ff, Vc, Hc, Hf, Gf, Wf].reduce((r, e) => (r[e.keyName] = e, r), {});
class Qf extends Tt {
  constructor(e, t) {
    super(e, t), this.quill.root.addEventListener("copy", (n) => this.onCaptureCopy(n, !1)), this.quill.root.addEventListener("cut", (n) => this.onCaptureCopy(n, !0)), this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this)), this.matchers = [], J0.concat(this.options.matchers ?? []).forEach((n) => {
      let [i, s] = n;
      this.addMatcher(i, s);
    });
  }
  addMatcher(e, t) {
    this.matchers.push([e, t]);
  }
  convert(e) {
    let {
      html: t,
      text: n
    } = e, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (i[Me.blotName])
      return new P().insert(n || "", {
        [Me.blotName]: i[Me.blotName]
      });
    if (!t)
      return new P().insert(n || "", i);
    const s = this.convertHTML(t);
    return ns(s, `
`) && (s.ops[s.ops.length - 1].attributes == null || i.table) ? s.compose(new P().retain(s.length() - 1).delete(1)) : s;
  }
  normalizeHTML(e) {
    Z0(e);
  }
  convertHTML(e) {
    const t = new DOMParser().parseFromString(e, "text/html");
    this.normalizeHTML(t);
    const n = t.body, i = /* @__PURE__ */ new WeakMap(), [s, a] = this.prepareMatching(n, i);
    return Wc(this.quill.scroll, n, s, a, i);
  }
  dangerouslyPasteHTML(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : D.sources.API;
    if (typeof e == "string") {
      const i = this.convert({
        html: e,
        text: ""
      });
      this.quill.setContents(i, t), this.quill.setSelection(0, D.sources.SILENT);
    } else {
      const i = this.convert({
        html: t,
        text: ""
      });
      this.quill.updateContents(new P().retain(e).concat(i), n), this.quill.setSelection(e + i.length(), D.sources.SILENT);
    }
  }
  onCaptureCopy(e) {
    var a, o;
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (e.defaultPrevented) return;
    e.preventDefault();
    const [n] = this.quill.selection.getRange();
    if (n == null) return;
    const {
      html: i,
      text: s
    } = this.onCopy(n, t);
    (a = e.clipboardData) == null || a.setData("text/plain", s), (o = e.clipboardData) == null || o.setData("text/html", i), t && Kc({
      range: n,
      quill: this.quill
    });
  }
  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */
  normalizeURIList(e) {
    return e.split(/\r?\n/).filter((t) => t[0] !== "#").join(`
`);
  }
  onCapturePaste(e) {
    var a, o, l, c, d;
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    e.preventDefault();
    const t = this.quill.getSelection(!0);
    if (t == null) return;
    const n = (a = e.clipboardData) == null ? void 0 : a.getData("text/html");
    let i = (o = e.clipboardData) == null ? void 0 : o.getData("text/plain");
    if (!n && !i) {
      const f = (l = e.clipboardData) == null ? void 0 : l.getData("text/uri-list");
      f && (i = this.normalizeURIList(f));
    }
    const s = Array.from(((c = e.clipboardData) == null ? void 0 : c.files) || []);
    if (!n && s.length > 0) {
      this.quill.uploader.upload(t, s);
      return;
    }
    if (n && s.length > 0) {
      const f = new DOMParser().parseFromString(n, "text/html");
      if (f.body.childElementCount === 1 && ((d = f.body.firstElementChild) == null ? void 0 : d.tagName) === "IMG") {
        this.quill.uploader.upload(t, s);
        return;
      }
    }
    this.onPaste(t, {
      html: n,
      text: i
    });
  }
  onCopy(e) {
    const t = this.quill.getText(e);
    return {
      html: this.quill.getSemanticHTML(e),
      text: t
    };
  }
  onPaste(e, t) {
    let {
      text: n,
      html: i
    } = t;
    const s = this.quill.getFormat(e.index), a = this.convert({
      text: n,
      html: i
    }, s);
    X0.log("onPaste", a, {
      text: n,
      html: i
    });
    const o = new P().retain(e.index).delete(e.length).concat(a);
    this.quill.updateContents(o, D.sources.USER), this.quill.setSelection(o.length() - e.length, D.sources.SILENT), this.quill.scrollSelectionIntoView();
  }
  prepareMatching(e, t) {
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
          Array.from(e.querySelectorAll(a)).forEach((l) => {
            if (t.has(l)) {
              const c = t.get(l);
              c == null || c.push(o);
            } else
              t.set(l, [o]);
          });
          break;
      }
    }), [n, i];
  }
}
q(Qf, "DEFAULTS", {
  matchers: []
});
function ar(r, e, t, n) {
  return n.query(e) ? r.reduce((i, s) => {
    if (!s.insert) return i;
    if (s.attributes && s.attributes[e])
      return i.push(s);
    const a = t ? {
      [e]: t
    } : {};
    return i.insert(s.insert, {
      ...a,
      ...s.attributes
    });
  }, new P()) : r;
}
function ns(r, e) {
  let t = "";
  for (let n = r.ops.length - 1; n >= 0 && t.length < e.length; --n) {
    const i = r.ops[n];
    if (typeof i.insert != "string") break;
    t = i.insert + t;
  }
  return t.slice(-1 * e.length) === e;
}
function kn(r, e) {
  if (!(r instanceof Element)) return !1;
  const t = e.query(r);
  return t && t.prototype instanceof Ze ? !1 : ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(r.tagName.toLowerCase());
}
function tw(r, e) {
  return r.previousElementSibling && r.nextElementSibling && !kn(r.previousElementSibling, e) && !kn(r.nextElementSibling, e);
}
const Ps = /* @__PURE__ */ new WeakMap();
function Zf(r) {
  return r == null ? !1 : (Ps.has(r) || (r.tagName === "PRE" ? Ps.set(r, !0) : Ps.set(r, Zf(r.parentNode))), Ps.get(r));
}
function Wc(r, e, t, n, i) {
  return e.nodeType === e.TEXT_NODE ? n.reduce((s, a) => a(e, s, r), new P()) : e.nodeType === e.ELEMENT_NODE ? Array.from(e.childNodes || []).reduce((s, a) => {
    let o = Wc(r, a, t, n, i);
    return a.nodeType === e.ELEMENT_NODE && (o = t.reduce((l, c) => c(a, l, r), o), o = (i.get(a) || []).reduce((l, c) => c(a, l, r), o)), s.concat(o);
  }, new P()) : new P();
}
function Zo(r) {
  return (e, t, n) => ar(t, r, !0, n);
}
function nw(r, e, t) {
  const n = Ut.keys(r), i = Et.keys(r), s = Nn.keys(r), a = {};
  return n.concat(i).concat(s).forEach((o) => {
    let l = t.query(o, B.ATTRIBUTE);
    l != null && (a[l.attrName] = l.value(r), a[l.attrName]) || (l = ew[o], l != null && (l.attrName === o || l.keyName === o) && (a[l.attrName] = l.value(r) || void 0), l = gd[o], l != null && (l.attrName === o || l.keyName === o) && (l = gd[o], a[l.attrName] = l.value(r) || void 0));
  }), Object.entries(a).reduce((o, l) => {
    let [c, d] = l;
    return ar(o, c, d, t);
  }, e);
}
function rw(r, e, t) {
  const n = t.query(r);
  if (n == null) return e;
  if (n.prototype instanceof Ze) {
    const i = {}, s = n.value(r);
    if (s != null)
      return i[n.blotName] = s, new P().insert(i, n.formats(r, t));
  } else if (n.prototype instanceof Vi && !ns(e, `
`) && e.insert(`
`), "blotName" in n && "formats" in n && typeof n.formats == "function")
    return ar(e, n.blotName, n.formats(r, t), t);
  return e;
}
function iw(r, e) {
  return ns(e, `
`) || e.insert(`
`), e;
}
function sw(r, e, t) {
  const n = t.query("code-block"), i = n && "formats" in n && typeof n.formats == "function" ? n.formats(r, t) : !0;
  return ar(e, "code-block", i, t);
}
function aw() {
  return new P();
}
function ow(r, e, t) {
  const n = t.query(r);
  if (n == null || // @ts-expect-error
  n.blotName !== "list" || !ns(e, `
`))
    return e;
  let i = -1, s = r.parentNode;
  for (; s != null; )
    ["OL", "UL"].includes(s.tagName) && (i += 1), s = s.parentNode;
  return i <= 0 ? e : e.reduce((a, o) => o.insert ? o.attributes && typeof o.attributes.indent == "number" ? a.push(o) : a.insert(o.insert, {
    indent: i,
    ...o.attributes || {}
  }) : a, new P());
}
function lw(r, e, t) {
  const n = r;
  let i = n.tagName === "OL" ? "ordered" : "bullet";
  const s = n.getAttribute("data-checked");
  return s && (i = s === "true" ? "checked" : "unchecked"), ar(e, "list", i, t);
}
function md(r, e, t) {
  if (!ns(e, `
`)) {
    if (kn(r, t) && (r.childNodes.length > 0 || r instanceof HTMLParagraphElement))
      return e.insert(`
`);
    if (e.length() > 0 && r.nextSibling) {
      let n = r.nextSibling;
      for (; n != null; ) {
        if (kn(n, t))
          return e.insert(`
`);
        const i = t.query(n);
        if (i && i.prototype instanceof at)
          return e.insert(`
`);
        n = n.firstChild;
      }
    }
  }
  return e;
}
function cw(r, e, t) {
  var s;
  const n = {}, i = r.style || {};
  return i.fontStyle === "italic" && (n.italic = !0), i.textDecoration === "underline" && (n.underline = !0), i.textDecoration === "line-through" && (n.strike = !0), ((s = i.fontWeight) != null && s.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(i.fontWeight, 10) >= 700) && (n.bold = !0), e = Object.entries(n).reduce((a, o) => {
    let [l, c] = o;
    return ar(a, l, c, t);
  }, e), parseFloat(i.textIndent || 0) > 0 ? new P().insert("	").concat(e) : e;
}
function uw(r, e, t) {
  var i, s;
  const n = ((i = r.parentElement) == null ? void 0 : i.tagName) === "TABLE" ? r.parentElement : (s = r.parentElement) == null ? void 0 : s.parentElement;
  if (n != null) {
    const o = Array.from(n.querySelectorAll("tr")).indexOf(r) + 1;
    return ar(e, "table", o, t);
  }
  return e;
}
function dw(r, e, t) {
  var i;
  let n = r.data;
  if (((i = r.parentElement) == null ? void 0 : i.tagName) === "O:P")
    return e.insert(n.trim());
  if (!Zf(r)) {
    if (n.trim().length === 0 && n.includes(`
`) && !tw(r, t))
      return e;
    n = n.replace(/[^\S\u00a0]/g, " "), n = n.replace(/ {2,}/g, " "), (r.previousSibling == null && r.parentElement != null && kn(r.parentElement, t) || r.previousSibling instanceof Element && kn(r.previousSibling, t)) && (n = n.replace(/^ /, "")), (r.nextSibling == null && r.parentElement != null && kn(r.parentElement, t) || r.nextSibling instanceof Element && kn(r.nextSibling, t)) && (n = n.replace(/ $/, "")), n = n.replaceAll(" ", " ");
  }
  return e.insert(n);
}
class Xf extends Tt {
  constructor(t, n) {
    super(t, n);
    q(this, "lastRecorded", 0);
    q(this, "ignoreChange", !1);
    q(this, "stack", {
      undo: [],
      redo: []
    });
    q(this, "currentRange", null);
    this.quill.on(D.events.EDITOR_CHANGE, (i, s, a, o) => {
      i === D.events.SELECTION_CHANGE ? s && o !== D.sources.SILENT && (this.currentRange = s) : i === D.events.TEXT_CHANGE && (this.ignoreChange || (!this.options.userOnly || o === D.sources.USER ? this.record(s, a) : this.transform(s)), this.currentRange = jl(this.currentRange, s));
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
  change(t, n) {
    if (this.stack[t].length === 0) return;
    const i = this.stack[t].pop();
    if (!i) return;
    const s = this.quill.getContents(), a = i.delta.invert(s);
    this.stack[n].push({
      delta: a,
      range: jl(i.range, a)
    }), this.lastRecorded = 0, this.ignoreChange = !0, this.quill.updateContents(i.delta, D.sources.USER), this.ignoreChange = !1, this.restoreSelection(i);
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
  record(t, n) {
    if (t.ops.length === 0) return;
    this.stack.redo = [];
    let i = t.invert(n), s = this.currentRange;
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
  transform(t) {
    bd(this.stack.undo, t), bd(this.stack.redo, t);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(t) {
    if (t.range)
      this.quill.setSelection(t.range, D.sources.USER);
    else {
      const n = fw(this.quill.scroll, t.delta);
      this.quill.setSelection(n, D.sources.USER);
    }
  }
}
q(Xf, "DEFAULTS", {
  delay: 1e3,
  maxStack: 100,
  userOnly: !1
});
function bd(r, e) {
  let t = e;
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = r[n];
    r[n] = {
      delta: t.transform(i.delta, !0),
      range: i.range && jl(i.range, t)
    }, t = i.delta.transform(t), r[n].delta.length() === 0 && r.splice(n, 1);
  }
}
function hw(r, e) {
  const t = e.ops[e.ops.length - 1];
  return t == null ? !1 : t.insert != null ? typeof t.insert == "string" && t.insert.endsWith(`
`) : t.attributes != null ? Object.keys(t.attributes).some((n) => r.query(n, B.BLOCK) != null) : !1;
}
function fw(r, e) {
  const t = e.reduce((i, s) => i + (s.delete || 0), 0);
  let n = e.length() - t;
  return hw(r, e) && (n -= 1), n;
}
function jl(r, e) {
  if (!r) return r;
  const t = e.transformPosition(r.index), n = e.transformPosition(r.index + r.length);
  return {
    index: t,
    length: n - t
  };
}
class Jf extends Tt {
  constructor(e, t) {
    super(e, t), e.root.addEventListener("drop", (n) => {
      var a;
      n.preventDefault();
      let i = null;
      if (document.caretRangeFromPoint)
        i = document.caretRangeFromPoint(n.clientX, n.clientY);
      else if (document.caretPositionFromPoint) {
        const o = document.caretPositionFromPoint(n.clientX, n.clientY);
        i = document.createRange(), i.setStart(o.offsetNode, o.offset), i.setEnd(o.offsetNode, o.offset);
      }
      const s = i && e.selection.normalizeNative(i);
      if (s) {
        const o = e.selection.normalizedToRange(s);
        (a = n.dataTransfer) != null && a.files && this.upload(o, n.dataTransfer.files);
      }
    });
  }
  upload(e, t) {
    const n = [];
    Array.from(t).forEach((i) => {
      var s;
      i && ((s = this.options.mimetypes) != null && s.includes(i.type)) && n.push(i);
    }), n.length > 0 && this.options.handler.call(this, e, n);
  }
}
Jf.DEFAULTS = {
  mimetypes: ["image/png", "image/jpeg"],
  handler(r, e) {
    if (!this.quill.scroll.query("image"))
      return;
    const t = e.map((n) => new Promise((i) => {
      const s = new FileReader();
      s.onload = () => {
        i(s.result);
      }, s.readAsDataURL(n);
    }));
    Promise.all(t).then((n) => {
      const i = n.reduce((s, a) => s.insert({
        image: a
      }), new P().retain(r.index).delete(r.length));
      this.quill.updateContents(i, R.sources.USER), this.quill.setSelection(r.index + n.length, R.sources.SILENT);
    });
  }
};
const pw = ["insertText", "insertReplacementText"];
class gw extends Tt {
  constructor(e, t) {
    super(e, t), e.root.addEventListener("beforeinput", (n) => {
      this.handleBeforeInput(n);
    }), /Android/i.test(navigator.userAgent) || e.on(D.events.COMPOSITION_BEFORE_START, () => {
      this.handleCompositionStart();
    });
  }
  deleteRange(e) {
    Kc({
      range: e,
      quill: this.quill
    });
  }
  replaceText(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (e.length === 0) return !1;
    if (t) {
      const n = this.quill.getFormat(e.index, 1);
      this.deleteRange(e), this.quill.updateContents(new P().retain(e.index).insert(t, n), D.sources.USER);
    } else
      this.deleteRange(e);
    return this.quill.setSelection(e.index + t.length, 0, D.sources.SILENT), !0;
  }
  handleBeforeInput(e) {
    if (this.quill.composition.isComposing || e.defaultPrevented || !pw.includes(e.inputType))
      return;
    const t = e.getTargetRanges ? e.getTargetRanges()[0] : null;
    if (!t || t.collapsed === !0)
      return;
    const n = mw(e);
    if (n == null)
      return;
    const i = this.quill.selection.normalizeNative(t), s = i ? this.quill.selection.normalizedToRange(i) : null;
    s && this.replaceText(s, n) && e.preventDefault();
  }
  handleCompositionStart() {
    const e = this.quill.getSelection();
    e && this.replaceText(e);
  }
}
function mw(r) {
  var e;
  return typeof r.data == "string" ? r.data : (e = r.dataTransfer) != null && e.types.includes("text/plain") ? r.dataTransfer.getData("text/plain") : null;
}
const bw = /Mac/i.test(navigator.platform), yw = 100, vw = (r) => !!(r.key === "ArrowLeft" || r.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
r.key === "ArrowUp" || r.key === "ArrowDown" || r.key === "Home" || bw && r.key === "a" && r.ctrlKey === !0);
class ww extends Tt {
  constructor(t, n) {
    super(t, n);
    q(this, "isListening", !1);
    q(this, "selectionChangeDeadline", 0);
    this.handleArrowKeys(), this.handleNavigationShortcuts();
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ["ArrowLeft", "ArrowRight"],
      offset: 0,
      shiftKey: null,
      handler(t, n) {
        let {
          line: i,
          event: s
        } = n;
        if (!(i instanceof wt) || !i.uiNode)
          return !0;
        const a = getComputedStyle(i.domNode).direction === "rtl";
        return a && s.key !== "ArrowRight" || !a && s.key !== "ArrowLeft" ? !0 : (this.quill.setSelection(t.index - 1, t.length + (s.shiftKey ? 1 : 0), D.sources.USER), !1);
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (t) => {
      !t.defaultPrevented && vw(t) && this.ensureListeningToSelectionChange();
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    if (this.selectionChangeDeadline = Date.now() + yw, this.isListening) return;
    this.isListening = !0;
    const t = () => {
      this.isListening = !1, Date.now() <= this.selectionChangeDeadline && this.handleSelectionChange();
    };
    document.addEventListener("selectionchange", t, {
      once: !0
    });
  }
  handleSelectionChange() {
    const t = document.getSelection();
    if (!t) return;
    const n = t.getRangeAt(0);
    if (n.collapsed !== !0 || n.startOffset !== 0) return;
    const i = this.quill.scroll.find(n.startContainer);
    if (!(i instanceof wt) || !i.uiNode) return;
    const s = document.createRange();
    s.setStartAfter(i.uiNode), s.setEndAfter(i.uiNode), t.removeAllRanges(), t.addRange(s);
  }
}
D.register({
  "blots/block": Ee,
  "blots/block/embed": at,
  "blots/break": Ct,
  "blots/container": ir,
  "blots/cursor": Yr,
  "blots/embed": jc,
  "blots/inline": Ht,
  "blots/scroll": Lr,
  "blots/text": kt,
  "modules/clipboard": Qf,
  "modules/history": Xf,
  "modules/keyboard": _a,
  "modules/uploader": Jf,
  "modules/input": gw,
  "modules/uiNode": ww
});
class xw extends Et {
  add(e, t) {
    let n = 0;
    if (t === "+1" || t === "-1") {
      const i = this.value(e) || 0;
      n = t === "+1" ? i + 1 : i - 1;
    } else typeof t == "number" && (n = t);
    return n === 0 ? (this.remove(e), !0) : super.add(e, n.toString());
  }
  canAdd(e, t) {
    return super.canAdd(e, t) || super.canAdd(e, parseInt(t, 10));
  }
  value(e) {
    return parseInt(super.value(e), 10) || void 0;
  }
}
const kw = new xw("indent", "ql-indent", {
  scope: B.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
class Ul extends Ee {
}
q(Ul, "blotName", "blockquote"), q(Ul, "tagName", "blockquote");
class Hl extends Ee {
  static formats(e) {
    return this.tagName.indexOf(e.tagName) + 1;
  }
}
q(Hl, "blotName", "header"), q(Hl, "tagName", ["H1", "H2", "H3", "H4", "H5", "H6"]);
class rs extends ir {
}
rs.blotName = "list-container";
rs.tagName = "OL";
class is extends Ee {
  static create(e) {
    const t = super.create();
    return t.setAttribute("data-list", e), t;
  }
  static formats(e) {
    return e.getAttribute("data-list") || void 0;
  }
  static register() {
    D.register(rs);
  }
  constructor(e, t) {
    super(e, t);
    const n = t.ownerDocument.createElement("span"), i = (s) => {
      if (!e.isEnabled()) return;
      const a = this.statics.formats(t, e);
      a === "checked" ? (this.format("list", "unchecked"), s.preventDefault()) : a === "unchecked" && (this.format("list", "checked"), s.preventDefault());
    };
    n.addEventListener("mousedown", i), n.addEventListener("touchstart", i), this.attachUI(n);
  }
  format(e, t) {
    e === this.statics.blotName && t ? this.domNode.setAttribute("data-list", t) : super.format(e, t);
  }
}
is.blotName = "list";
is.tagName = "LI";
rs.allowedChildren = [is];
is.requiredContainer = rs;
class Ki extends Ht {
  static create() {
    return super.create();
  }
  static formats() {
    return !0;
  }
  optimize(e) {
    super.optimize(e), this.domNode.tagName !== this.statics.tagName[0] && this.replaceWith(this.statics.blotName);
  }
}
q(Ki, "blotName", "bold"), q(Ki, "tagName", ["STRONG", "B"]);
class Vl extends Ki {
}
q(Vl, "blotName", "italic"), q(Vl, "tagName", ["EM", "I"]);
class Sn extends Ht {
  static create(e) {
    const t = super.create(e);
    return t.setAttribute("href", this.sanitize(e)), t.setAttribute("rel", "noopener noreferrer"), t.setAttribute("target", "_blank"), t;
  }
  static formats(e) {
    return e.getAttribute("href");
  }
  static sanitize(e) {
    return ep(e, this.PROTOCOL_WHITELIST) ? e : this.SANITIZED_URL;
  }
  format(e, t) {
    e !== this.statics.blotName || !t ? super.format(e, t) : this.domNode.setAttribute("href", this.constructor.sanitize(t));
  }
}
q(Sn, "blotName", "link"), q(Sn, "tagName", "A"), q(Sn, "SANITIZED_URL", "about:blank"), q(Sn, "PROTOCOL_WHITELIST", ["http", "https", "mailto", "tel", "sms"]);
function ep(r, e) {
  const t = document.createElement("a");
  t.href = r;
  const n = t.href.slice(0, t.href.indexOf(":"));
  return e.indexOf(n) > -1;
}
class Yl extends Ht {
  static create(e) {
    return e === "super" ? document.createElement("sup") : e === "sub" ? document.createElement("sub") : super.create(e);
  }
  static formats(e) {
    if (e.tagName === "SUB") return "sub";
    if (e.tagName === "SUP") return "super";
  }
}
q(Yl, "blotName", "script"), q(Yl, "tagName", ["SUB", "SUP"]);
class Gl extends Ki {
}
q(Gl, "blotName", "strike"), q(Gl, "tagName", ["S", "STRIKE"]);
class Kl extends Ht {
}
q(Kl, "blotName", "underline"), q(Kl, "tagName", "U");
class Qs extends jc {
  static create(e) {
    if (window.katex == null)
      throw new Error("Formula module requires KaTeX.");
    const t = super.create(e);
    return typeof e == "string" && (window.katex.render(e, t, {
      throwOnError: !1,
      errorColor: "#f00"
    }), t.setAttribute("data-value", e)), t;
  }
  static value(e) {
    return e.getAttribute("data-value");
  }
  html() {
    const {
      formula: e
    } = this.value();
    return `<span>${e}</span>`;
  }
}
q(Qs, "blotName", "formula"), q(Qs, "className", "ql-formula"), q(Qs, "tagName", "SPAN");
const yd = ["alt", "height", "width"];
var Ks;
let Sw = (Ks = class extends Ze {
  static create(e) {
    const t = super.create(e);
    return typeof e == "string" && t.setAttribute("src", this.sanitize(e)), t;
  }
  static formats(e) {
    return yd.reduce((t, n) => (e.hasAttribute(n) && (t[n] = e.getAttribute(n)), t), {});
  }
  static match(e) {
    return /\.(jpe?g|gif|png)$/.test(e) || /^data:image\/.+;base64/.test(e);
  }
  static sanitize(e) {
    return ep(e, ["http", "https", "data"]) ? e : "//:0";
  }
  static value(e) {
    return e.getAttribute("src");
  }
  format(e, t) {
    yd.indexOf(e) > -1 ? t ? this.domNode.setAttribute(e, t) : this.domNode.removeAttribute(e) : super.format(e, t);
  }
}, q(Ks, "blotName", "image"), q(Ks, "tagName", "IMG"), Ks);
const vd = ["height", "width"];
class Zs extends at {
  static create(e) {
    const t = super.create(e);
    return t.setAttribute("frameborder", "0"), t.setAttribute("allowfullscreen", "true"), t.setAttribute("src", this.sanitize(e)), t;
  }
  static formats(e) {
    return vd.reduce((t, n) => (e.hasAttribute(n) && (t[n] = e.getAttribute(n)), t), {});
  }
  static sanitize(e) {
    return Sn.sanitize(e);
  }
  static value(e) {
    return e.getAttribute("src");
  }
  format(e, t) {
    vd.indexOf(e) > -1 ? t ? this.domNode.setAttribute(e, t) : this.domNode.removeAttribute(e) : super.format(e, t);
  }
  html() {
    const {
      video: e
    } = this.value();
    return `<a href="${e}">${e}</a>`;
  }
}
q(Zs, "blotName", "video"), q(Zs, "className", "ql-video"), q(Zs, "tagName", "IFRAME");
const Ci = new Et("code-token", "hljs", {
  scope: B.INLINE
});
class an extends Ht {
  static formats(e, t) {
    for (; e != null && e !== t.domNode; ) {
      if (e.classList && e.classList.contains(Me.className))
        return super.formats(e, t);
      e = e.parentNode;
    }
  }
  constructor(e, t, n) {
    super(e, t, n), Ci.add(this.domNode, n);
  }
  format(e, t) {
    e !== an.blotName ? super.format(e, t) : t ? Ci.add(this.domNode, t) : (Ci.remove(this.domNode), this.domNode.classList.remove(this.statics.className));
  }
  optimize() {
    super.optimize(...arguments), Ci.value(this.domNode) || this.unwrap();
  }
}
an.blotName = "code-token";
an.className = "ql-token";
class it extends Me {
  static create(e) {
    const t = super.create(e);
    return typeof e == "string" && t.setAttribute("data-language", e), t;
  }
  static formats(e) {
    return e.getAttribute("data-language") || "plain";
  }
  static register() {
  }
  // Syntax module will register
  format(e, t) {
    e === this.statics.blotName && t ? this.domNode.setAttribute("data-language", t) : super.format(e, t);
  }
  replaceWith(e, t) {
    return this.formatAt(0, this.length(), an.blotName, !1), super.replaceWith(e, t);
  }
}
class Mi extends sr {
  attach() {
    super.attach(), this.forceNext = !1, this.scroll.emitMount(this);
  }
  format(e, t) {
    e === it.blotName && (this.forceNext = !0, this.children.forEach((n) => {
      n.format(e, t);
    }));
  }
  formatAt(e, t, n, i) {
    n === it.blotName && (this.forceNext = !0), super.formatAt(e, t, n, i);
  }
  highlight(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.children.head == null) return;
    const i = `${Array.from(this.domNode.childNodes).filter((a) => a !== this.uiNode).map((a) => a.textContent).join(`
`)}
`, s = it.formats(this.children.head.domNode);
    if (t || this.forceNext || this.cachedText !== i) {
      if (i.trim().length > 0 || this.cachedText == null) {
        const a = this.children.reduce((l, c) => l.concat(zf(c, !1)), new P()), o = e(i, s);
        a.diff(o).reduce((l, c) => {
          let {
            retain: d,
            attributes: f
          } = c;
          return d ? (f && Object.keys(f).forEach((h) => {
            [it.blotName, an.blotName].includes(h) && this.formatAt(l, d, h, f[h]);
          }), l + d) : l;
        }, 0);
      }
      this.cachedText = i, this.forceNext = !1;
    }
  }
  html(e, t) {
    const [n] = this.children.find(e);
    return `<pre data-language="${n ? it.formats(n.domNode) : "plain"}">
${qa(this.code(e, t))}
</pre>`;
  }
  optimize(e) {
    if (super.optimize(e), this.parent != null && this.children.head != null && this.uiNode != null) {
      const t = it.formats(this.children.head.domNode);
      t !== this.uiNode.value && (this.uiNode.value = t);
    }
  }
}
Mi.allowedChildren = [it];
it.requiredContainer = Mi;
it.allowedChildren = [an, Yr, kt, Ct];
const Aw = (r, e, t) => {
  if (typeof r.versionString == "string") {
    const n = r.versionString.split(".")[0];
    if (parseInt(n, 10) >= 11)
      return r.highlight(t, {
        language: e
      }).value;
  }
  return r.highlight(e, t).value;
};
class tp extends Tt {
  static register() {
    D.register(an, !0), D.register(it, !0), D.register(Mi, !0);
  }
  constructor(e, t) {
    if (super(e, t), this.options.hljs == null)
      throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");
    this.languages = this.options.languages.reduce((n, i) => {
      let {
        key: s
      } = i;
      return n[s] = !0, n;
    }, {}), this.highlightBlot = this.highlightBlot.bind(this), this.initListener(), this.initTimer();
  }
  initListener() {
    this.quill.on(D.events.SCROLL_BLOT_MOUNT, (e) => {
      if (!(e instanceof Mi)) return;
      const t = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach((n) => {
        let {
          key: i,
          label: s
        } = n;
        const a = t.ownerDocument.createElement("option");
        a.textContent = s, a.setAttribute("value", i), t.appendChild(a);
      }), t.addEventListener("change", () => {
        e.format(it.blotName, t.value), this.quill.root.focus(), this.highlight(e, !0);
      }), e.uiNode == null && (e.attachUI(t), e.children.head && (t.value = it.formats(e.children.head.domNode)));
    });
  }
  initTimer() {
    let e = null;
    this.quill.on(D.events.SCROLL_OPTIMIZE, () => {
      e && clearTimeout(e), e = setTimeout(() => {
        this.highlight(), e = null;
      }, this.options.interval);
    });
  }
  highlight() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.quill.selection.composing) return;
    this.quill.update(D.sources.USER);
    const n = this.quill.getSelection();
    (e == null ? this.quill.scroll.descendants(Mi) : [e]).forEach((s) => {
      s.highlight(this.highlightBlot, t);
    }), this.quill.update(D.sources.SILENT), n != null && this.quill.setSelection(n, D.sources.SILENT);
  }
  highlightBlot(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
    if (t = this.languages[t] ? t : "plain", t === "plain")
      return qa(e).split(`
`).reduce((i, s, a) => (a !== 0 && i.insert(`
`, {
        [Me.blotName]: t
      }), i.insert(s)), new P());
    const n = this.quill.root.ownerDocument.createElement("div");
    return n.classList.add(Me.className), n.innerHTML = Aw(this.options.hljs, t, e), Wc(this.quill.scroll, n, [(i, s) => {
      const a = Ci.value(i);
      return a ? s.compose(new P().retain(s.length(), {
        [an.blotName]: a
      })) : s;
    }], [(i, s) => i.data.split(`
`).reduce((a, o, l) => (l !== 0 && a.insert(`
`, {
      [Me.blotName]: t
    }), a.insert(o)), s)], /* @__PURE__ */ new WeakMap());
  }
}
tp.DEFAULTS = {
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
const Bi = class Bi extends Ee {
  static create(e) {
    const t = super.create();
    return e ? t.setAttribute("data-row", e) : t.setAttribute("data-row", Qc()), t;
  }
  static formats(e) {
    if (e.hasAttribute("data-row"))
      return e.getAttribute("data-row");
  }
  cellOffset() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  format(e, t) {
    e === Bi.blotName && t ? this.domNode.setAttribute("data-row", t) : super.format(e, t);
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
q(Bi, "blotName", "table"), q(Bi, "tagName", "TD");
let yt = Bi;
class on extends ir {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const e = this.children.head.formats(), t = this.children.tail.formats(), n = this.next.children.head.formats(), i = this.next.children.tail.formats();
      return e.table === t.table && e.table === n.table && e.table === i.table;
    }
    return !1;
  }
  optimize(e) {
    super.optimize(e), this.children.forEach((t) => {
      if (t.next == null) return;
      const n = t.formats(), i = t.next.formats();
      if (n.table !== i.table) {
        const s = this.splitAfter(t);
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
q(on, "blotName", "table-row"), q(on, "tagName", "TR");
class jt extends ir {
}
q(jt, "blotName", "table-body"), q(jt, "tagName", "TBODY");
class Kr extends ir {
  balanceCells() {
    const e = this.descendants(on), t = e.reduce((n, i) => Math.max(i.children.length, n), 0);
    e.forEach((n) => {
      new Array(t - n.children.length).fill(0).forEach(() => {
        let i;
        n.children.head != null && (i = yt.formats(n.children.head.domNode));
        const s = this.scroll.create(yt.blotName, i);
        n.appendChild(s), s.optimize();
      });
    });
  }
  cells(e) {
    return this.rows().map((t) => t.children.at(e));
  }
  deleteColumn(e) {
    const [t] = this.descendant(jt);
    t == null || t.children.head == null || t.children.forEach((n) => {
      const i = n.children.at(e);
      i != null && i.remove();
    });
  }
  insertColumn(e) {
    const [t] = this.descendant(jt);
    t == null || t.children.head == null || t.children.forEach((n) => {
      const i = n.children.at(e), s = yt.formats(n.children.head.domNode), a = this.scroll.create(yt.blotName, s);
      n.insertBefore(a, i);
    });
  }
  insertRow(e) {
    const [t] = this.descendant(jt);
    if (t == null || t.children.head == null) return;
    const n = Qc(), i = this.scroll.create(on.blotName);
    t.children.head.children.forEach(() => {
      const a = this.scroll.create(yt.blotName, n);
      i.appendChild(a);
    });
    const s = t.children.at(e);
    t.insertBefore(i, s);
  }
  rows() {
    const e = this.children.head;
    return e == null ? [] : e.children.map((t) => t);
  }
}
q(Kr, "blotName", "table-container"), q(Kr, "tagName", "TABLE");
Kr.allowedChildren = [jt];
jt.requiredContainer = Kr;
jt.allowedChildren = [on];
on.requiredContainer = jt;
on.allowedChildren = [yt];
yt.requiredContainer = on;
function Qc() {
  return `row-${Math.random().toString(36).slice(2, 6)}`;
}
class Ew extends Tt {
  static register() {
    D.register(yt), D.register(on), D.register(jt), D.register(Kr);
  }
  constructor() {
    super(...arguments), this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(Kr).forEach((e) => {
      e.balanceCells();
    });
  }
  deleteColumn() {
    const [e, , t] = this.getTable();
    t != null && (e.deleteColumn(t.cellOffset()), this.quill.update(D.sources.USER));
  }
  deleteRow() {
    const [, e] = this.getTable();
    e != null && (e.remove(), this.quill.update(D.sources.USER));
  }
  deleteTable() {
    const [e] = this.getTable();
    if (e == null) return;
    const t = e.offset();
    e.remove(), this.quill.update(D.sources.USER), this.quill.setSelection(t, D.sources.SILENT);
  }
  getTable() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
    if (e == null) return [null, null, null, -1];
    const [t, n] = this.quill.getLine(e.index);
    if (t == null || t.statics.blotName !== yt.blotName)
      return [null, null, null, -1];
    const i = t.parent;
    return [i.parent.parent, i, t, n];
  }
  insertColumn(e) {
    const t = this.quill.getSelection();
    if (!t) return;
    const [n, i, s] = this.getTable(t);
    if (s == null) return;
    const a = s.cellOffset();
    n.insertColumn(a + e), this.quill.update(D.sources.USER);
    let o = i.rowOffset();
    e === 0 && (o += 1), this.quill.setSelection(t.index + o, t.length, D.sources.SILENT);
  }
  insertColumnLeft() {
    this.insertColumn(0);
  }
  insertColumnRight() {
    this.insertColumn(1);
  }
  insertRow(e) {
    const t = this.quill.getSelection();
    if (!t) return;
    const [n, i, s] = this.getTable(t);
    if (s == null) return;
    const a = i.rowOffset();
    n.insertRow(a + e), this.quill.update(D.sources.USER), e > 0 ? this.quill.setSelection(t, D.sources.SILENT) : this.quill.setSelection(t.index + i.children.length, t.length, D.sources.SILENT);
  }
  insertRowAbove() {
    this.insertRow(0);
  }
  insertRowBelow() {
    this.insertRow(1);
  }
  insertTable(e, t) {
    const n = this.quill.getSelection();
    if (n == null) return;
    const i = new Array(e).fill(0).reduce((s) => {
      const a = new Array(t).fill(`
`).join("");
      return s.insert(a, {
        table: Qc()
      });
    }, new P().retain(n.index));
    this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(n.index, D.sources.SILENT), this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(D.events.SCROLL_OPTIMIZE, (e) => {
      e.some((t) => ["TD", "TR", "TBODY", "TABLE"].includes(t.target.tagName) ? (this.quill.once(D.events.TEXT_CHANGE, (n, i, s) => {
        s === D.sources.USER && this.balanceTables();
      }), !0) : !1);
    });
  }
}
const wd = un("quill:toolbar");
class Zc extends Tt {
  constructor(e, t) {
    var n, i;
    if (super(e, t), Array.isArray(this.options.container)) {
      const s = document.createElement("div");
      s.setAttribute("role", "toolbar"), Cw(s, this.options.container), (i = (n = e.container) == null ? void 0 : n.parentNode) == null || i.insertBefore(s, e.container), this.container = s;
    } else typeof this.options.container == "string" ? this.container = document.querySelector(this.options.container) : this.container = this.options.container;
    if (!(this.container instanceof HTMLElement)) {
      wd.error("Container required for toolbar", this.options);
      return;
    }
    this.container.classList.add("ql-toolbar"), this.controls = [], this.handlers = {}, this.options.handlers && Object.keys(this.options.handlers).forEach((s) => {
      var o;
      const a = (o = this.options.handlers) == null ? void 0 : o[s];
      a && this.addHandler(s, a);
    }), Array.from(this.container.querySelectorAll("button, select")).forEach((s) => {
      this.attach(s);
    }), this.quill.on(D.events.EDITOR_CHANGE, () => {
      const [s] = this.quill.selection.getRange();
      this.update(s);
    });
  }
  addHandler(e, t) {
    this.handlers[e] = t;
  }
  attach(e) {
    let t = Array.from(e.classList).find((i) => i.indexOf("ql-") === 0);
    if (!t) return;
    if (t = t.slice(3), e.tagName === "BUTTON" && e.setAttribute("type", "button"), this.handlers[t] == null && this.quill.scroll.query(t) == null) {
      wd.warn("ignoring attaching to nonexistent format", t, e);
      return;
    }
    const n = e.tagName === "SELECT" ? "change" : "click";
    e.addEventListener(n, (i) => {
      let s;
      if (e.tagName === "SELECT") {
        if (e.selectedIndex < 0) return;
        const o = e.options[e.selectedIndex];
        o.hasAttribute("selected") ? s = !1 : s = o.value || !1;
      } else
        e.classList.contains("ql-active") ? s = !1 : s = e.value || !e.hasAttribute("value"), i.preventDefault();
      this.quill.focus();
      const [a] = this.quill.selection.getRange();
      if (this.handlers[t] != null)
        this.handlers[t].call(this, s);
      else if (
        // @ts-expect-error
        this.quill.scroll.query(t).prototype instanceof Ze
      ) {
        if (s = prompt(`Enter ${t}`), !s) return;
        this.quill.updateContents(new P().retain(a.index).delete(a.length).insert({
          [t]: s
        }), D.sources.USER);
      } else
        this.quill.format(t, s, D.sources.USER);
      this.update(a);
    }), this.controls.push([t, e]);
  }
  update(e) {
    const t = e == null ? {} : this.quill.getFormat(e);
    this.controls.forEach((n) => {
      const [i, s] = n;
      if (s.tagName === "SELECT") {
        let a = null;
        if (e == null)
          a = null;
        else if (t[i] == null)
          a = s.querySelector("option[selected]");
        else if (!Array.isArray(t[i])) {
          let o = t[i];
          typeof o == "string" && (o = o.replace(/"/g, '\\"')), a = s.querySelector(`option[value="${o}"]`);
        }
        a == null ? (s.value = "", s.selectedIndex = -1) : a.selected = !0;
      } else if (e == null)
        s.classList.remove("ql-active"), s.setAttribute("aria-pressed", "false");
      else if (s.hasAttribute("value")) {
        const a = t[i], o = a === s.getAttribute("value") || a != null && a.toString() === s.getAttribute("value") || a == null && !s.getAttribute("value");
        s.classList.toggle("ql-active", o), s.setAttribute("aria-pressed", o.toString());
      } else {
        const a = t[i] != null;
        s.classList.toggle("ql-active", a), s.setAttribute("aria-pressed", a.toString());
      }
    });
  }
}
Zc.DEFAULTS = {};
function xd(r, e, t) {
  const n = document.createElement("button");
  n.setAttribute("type", "button"), n.classList.add(`ql-${e}`), n.setAttribute("aria-pressed", "false"), t != null ? (n.value = t, n.setAttribute("aria-label", `${e}: ${t}`)) : n.setAttribute("aria-label", e), r.appendChild(n);
}
function Cw(r, e) {
  Array.isArray(e[0]) || (e = [e]), e.forEach((t) => {
    const n = document.createElement("span");
    n.classList.add("ql-formats"), t.forEach((i) => {
      if (typeof i == "string")
        xd(n, i);
      else {
        const s = Object.keys(i)[0], a = i[s];
        Array.isArray(a) ? Tw(n, s, a) : xd(n, s, a);
      }
    }), r.appendChild(n);
  });
}
function Tw(r, e, t) {
  const n = document.createElement("select");
  n.classList.add(`ql-${e}`), t.forEach((i) => {
    const s = document.createElement("option");
    i !== !1 ? s.setAttribute("value", String(i)) : s.setAttribute("selected", "selected"), n.appendChild(s);
  }), r.appendChild(n);
}
Zc.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const r = this.quill.getSelection();
      if (r != null)
        if (r.length === 0) {
          const e = this.quill.getFormat();
          Object.keys(e).forEach((t) => {
            this.quill.scroll.query(t, B.INLINE) != null && this.quill.format(t, !1, D.sources.USER);
          });
        } else
          this.quill.removeFormat(r.index, r.length, D.sources.USER);
    },
    direction(r) {
      const {
        align: e
      } = this.quill.getFormat();
      r === "rtl" && e == null ? this.quill.format("align", "right", D.sources.USER) : !r && e === "right" && this.quill.format("align", !1, D.sources.USER), this.quill.format("direction", r, D.sources.USER);
    },
    indent(r) {
      const e = this.quill.getSelection(), t = this.quill.getFormat(e), n = parseInt(t.indent || 0, 10);
      if (r === "+1" || r === "-1") {
        let i = r === "+1" ? 1 : -1;
        t.direction === "rtl" && (i *= -1), this.quill.format("indent", n + i, D.sources.USER);
      }
    },
    link(r) {
      r === !0 && (r = prompt("Enter link URL:")), this.quill.format("link", r, D.sources.USER);
    },
    list(r) {
      const e = this.quill.getSelection(), t = this.quill.getFormat(e);
      r === "check" ? t.list === "checked" || t.list === "unchecked" ? this.quill.format("list", !1, D.sources.USER) : this.quill.format("list", "unchecked", D.sources.USER) : this.quill.format("list", r, D.sources.USER);
    }
  }
};
const Lw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>', Dw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>', Iw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>', Nw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>', Ow = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>', Mw = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>', qw = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>', _w = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>', kd = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>', zw = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>', Rw = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>', Pw = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>', Bw = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>', Fw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>', $w = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', jw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Uw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>', Hw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Vw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>', Yw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>', Gw = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>', Kw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>', Ww = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>', Qw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>', Zw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>', Xw = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>', Jw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>', ex = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>', tx = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>', nx = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>', rx = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>', ix = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>', sx = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>', Wi = {
  align: {
    "": Lw,
    center: Dw,
    right: Iw,
    justify: Nw
  },
  background: Ow,
  blockquote: Mw,
  bold: qw,
  clean: _w,
  code: kd,
  "code-block": kd,
  color: zw,
  direction: {
    "": Rw,
    rtl: Pw
  },
  formula: Bw,
  header: {
    1: Fw,
    2: $w,
    3: jw,
    4: Uw,
    5: Hw,
    6: Vw
  },
  italic: Yw,
  image: Gw,
  indent: {
    "+1": Kw,
    "-1": Ww
  },
  link: Qw,
  list: {
    bullet: Zw,
    check: Xw,
    ordered: Jw
  },
  script: {
    sub: ex,
    super: tx
  },
  strike: nx,
  table: rx,
  underline: ix,
  video: sx
}, ax = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
let Sd = 0;
function Ad(r, e) {
  r.setAttribute(e, `${r.getAttribute(e) !== "true"}`);
}
class za {
  constructor(e) {
    this.select = e, this.container = document.createElement("span"), this.buildPicker(), this.select.style.display = "none", this.select.parentNode.insertBefore(this.container, this.select), this.label.addEventListener("mousedown", () => {
      this.togglePicker();
    }), this.label.addEventListener("keydown", (t) => {
      switch (t.key) {
        case "Enter":
          this.togglePicker();
          break;
        case "Escape":
          this.escape(), t.preventDefault();
          break;
      }
    }), this.select.addEventListener("change", this.update.bind(this));
  }
  togglePicker() {
    this.container.classList.toggle("ql-expanded"), Ad(this.label, "aria-expanded"), Ad(this.options, "aria-hidden");
  }
  buildItem(e) {
    const t = document.createElement("span");
    t.tabIndex = "0", t.setAttribute("role", "button"), t.classList.add("ql-picker-item");
    const n = e.getAttribute("value");
    return n && t.setAttribute("data-value", n), e.textContent && t.setAttribute("data-label", e.textContent), t.addEventListener("click", () => {
      this.selectItem(t, !0);
    }), t.addEventListener("keydown", (i) => {
      switch (i.key) {
        case "Enter":
          this.selectItem(t, !0), i.preventDefault();
          break;
        case "Escape":
          this.escape(), i.preventDefault();
          break;
      }
    }), t;
  }
  buildLabel() {
    const e = document.createElement("span");
    return e.classList.add("ql-picker-label"), e.innerHTML = ax, e.tabIndex = "0", e.setAttribute("role", "button"), e.setAttribute("aria-expanded", "false"), this.container.appendChild(e), e;
  }
  buildOptions() {
    const e = document.createElement("span");
    e.classList.add("ql-picker-options"), e.setAttribute("aria-hidden", "true"), e.tabIndex = "-1", e.id = `ql-picker-options-${Sd}`, Sd += 1, this.label.setAttribute("aria-controls", e.id), this.options = e, Array.from(this.select.options).forEach((t) => {
      const n = this.buildItem(t);
      e.appendChild(n), t.selected === !0 && this.selectItem(n);
    }), this.container.appendChild(e);
  }
  buildPicker() {
    Array.from(this.select.attributes).forEach((e) => {
      this.container.setAttribute(e.name, e.value);
    }), this.container.classList.add("ql-picker"), this.label = this.buildLabel(), this.buildOptions();
  }
  escape() {
    this.close(), setTimeout(() => this.label.focus(), 1);
  }
  close() {
    this.container.classList.remove("ql-expanded"), this.label.setAttribute("aria-expanded", "false"), this.options.setAttribute("aria-hidden", "true");
  }
  selectItem(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    const n = this.container.querySelector(".ql-selected");
    e !== n && (n != null && n.classList.remove("ql-selected"), e != null && (e.classList.add("ql-selected"), this.select.selectedIndex = Array.from(e.parentNode.children).indexOf(e), e.hasAttribute("data-value") ? this.label.setAttribute("data-value", e.getAttribute("data-value")) : this.label.removeAttribute("data-value"), e.hasAttribute("data-label") ? this.label.setAttribute("data-label", e.getAttribute("data-label")) : this.label.removeAttribute("data-label"), t && (this.select.dispatchEvent(new Event("change")), this.close())));
  }
  update() {
    let e;
    if (this.select.selectedIndex > -1) {
      const n = (
        // @ts-expect-error Fix me later
        this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex]
      );
      e = this.select.options[this.select.selectedIndex], this.selectItem(n);
    } else
      this.selectItem(null);
    const t = e != null && e !== this.select.querySelector("option[selected]");
    this.label.classList.toggle("ql-active", t);
  }
}
class np extends za {
  constructor(e, t) {
    super(e), this.label.innerHTML = t, this.container.classList.add("ql-color-picker"), Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((n) => {
      n.classList.add("ql-primary");
    });
  }
  buildItem(e) {
    const t = super.buildItem(e);
    return t.style.backgroundColor = e.getAttribute("value") || "", t;
  }
  selectItem(e, t) {
    super.selectItem(e, t);
    const n = this.label.querySelector(".ql-color-label"), i = e && e.getAttribute("data-value") || "";
    n && (n.tagName === "line" ? n.style.stroke = i : n.style.fill = i);
  }
}
class rp extends za {
  constructor(e, t) {
    super(e), this.container.classList.add("ql-icon-picker"), Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach((n) => {
      n.innerHTML = t[n.getAttribute("data-value") || ""];
    }), this.defaultItem = this.container.querySelector(".ql-selected"), this.selectItem(this.defaultItem);
  }
  selectItem(e, t) {
    super.selectItem(e, t);
    const n = e || this.defaultItem;
    if (n != null) {
      if (this.label.innerHTML === n.innerHTML) return;
      this.label.innerHTML = n.innerHTML;
    }
  }
}
const ox = (r) => {
  const {
    overflowY: e
  } = getComputedStyle(r, null);
  return e !== "visible" && e !== "clip";
};
class ip {
  constructor(e, t) {
    this.quill = e, this.boundsContainer = t || document.body, this.root = e.addContainer("ql-tooltip"), this.root.innerHTML = this.constructor.TEMPLATE, ox(this.quill.root) && this.quill.root.addEventListener("scroll", () => {
      this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
    }), this.hide();
  }
  hide() {
    this.root.classList.add("ql-hidden");
  }
  position(e) {
    const t = e.left + e.width / 2 - this.root.offsetWidth / 2, n = e.bottom + this.quill.root.scrollTop;
    this.root.style.left = `${t}px`, this.root.style.top = `${n}px`, this.root.classList.remove("ql-flip");
    const i = this.boundsContainer.getBoundingClientRect(), s = this.root.getBoundingClientRect();
    let a = 0;
    if (s.right > i.right && (a = i.right - s.right, this.root.style.left = `${t + a}px`), s.left < i.left && (a = i.left - s.left, this.root.style.left = `${t + a}px`), s.bottom > i.bottom) {
      const o = s.bottom - s.top, l = e.bottom - e.top + o;
      this.root.style.top = `${n - l}px`, this.root.classList.add("ql-flip");
    }
    return a;
  }
  show() {
    this.root.classList.remove("ql-editing"), this.root.classList.remove("ql-hidden");
  }
}
const lx = [!1, "center", "right", "justify"], cx = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"], ux = [!1, "serif", "monospace"], dx = ["1", "2", "3", !1], hx = ["small", !1, "large", "huge"];
class ss extends Gr {
  constructor(e, t) {
    super(e, t);
    const n = (i) => {
      if (!document.body.contains(e.root)) {
        document.body.removeEventListener("click", n);
        return;
      }
      this.tooltip != null && // @ts-expect-error
      !this.tooltip.root.contains(i.target) && // @ts-expect-error
      document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus() && this.tooltip.hide(), this.pickers != null && this.pickers.forEach((s) => {
        s.container.contains(i.target) || s.close();
      });
    };
    e.emitter.listenDOM("click", document.body, n);
  }
  addModule(e) {
    const t = super.addModule(e);
    return e === "toolbar" && this.extendToolbar(t), t;
  }
  buildButtons(e, t) {
    Array.from(e).forEach((n) => {
      (n.getAttribute("class") || "").split(/\s+/).forEach((s) => {
        if (s.startsWith("ql-") && (s = s.slice(3), t[s] != null))
          if (s === "direction")
            n.innerHTML = t[s][""] + t[s].rtl;
          else if (typeof t[s] == "string")
            n.innerHTML = t[s];
          else {
            const a = n.value || "";
            a != null && t[s][a] && (n.innerHTML = t[s][a]);
          }
      });
    });
  }
  buildPickers(e, t) {
    this.pickers = Array.from(e).map((i) => {
      if (i.classList.contains("ql-align") && (i.querySelector("option") == null && Si(i, lx), typeof t.align == "object"))
        return new rp(i, t.align);
      if (i.classList.contains("ql-background") || i.classList.contains("ql-color")) {
        const s = i.classList.contains("ql-background") ? "background" : "color";
        return i.querySelector("option") == null && Si(i, cx, s === "background" ? "#ffffff" : "#000000"), new np(i, t[s]);
      }
      return i.querySelector("option") == null && (i.classList.contains("ql-font") ? Si(i, ux) : i.classList.contains("ql-header") ? Si(i, dx) : i.classList.contains("ql-size") && Si(i, hx)), new za(i);
    });
    const n = () => {
      this.pickers.forEach((i) => {
        i.update();
      });
    };
    this.quill.on(R.events.EDITOR_CHANGE, n);
  }
}
ss.DEFAULTS = An({}, Gr.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        formula() {
          this.quill.theme.tooltip.edit("formula");
        },
        image() {
          let r = this.container.querySelector("input.ql-image[type=file]");
          r == null && (r = document.createElement("input"), r.setAttribute("type", "file"), r.setAttribute("accept", this.quill.uploader.options.mimetypes.join(", ")), r.classList.add("ql-image"), r.addEventListener("change", () => {
            const e = this.quill.getSelection(!0);
            this.quill.uploader.upload(e, r.files), r.value = "";
          }), this.container.appendChild(r)), r.click();
        },
        video() {
          this.quill.theme.tooltip.edit("video");
        }
      }
    }
  }
});
class sp extends ip {
  constructor(e, t) {
    super(e, t), this.textbox = this.root.querySelector('input[type="text"]'), this.listen();
  }
  listen() {
    this.textbox.addEventListener("keydown", (e) => {
      e.key === "Enter" ? (this.save(), e.preventDefault()) : e.key === "Escape" && (this.cancel(), e.preventDefault());
    });
  }
  cancel() {
    this.hide(), this.restoreFocus();
  }
  edit() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "link", t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (this.root.classList.remove("ql-hidden"), this.root.classList.add("ql-editing"), this.textbox == null) return;
    t != null ? this.textbox.value = t : e !== this.root.getAttribute("data-mode") && (this.textbox.value = "");
    const n = this.quill.getBounds(this.quill.selection.savedRange);
    n != null && this.position(n), this.textbox.select(), this.textbox.setAttribute("placeholder", this.textbox.getAttribute(`data-${e}`) || ""), this.root.setAttribute("data-mode", e);
  }
  restoreFocus() {
    this.quill.focus({
      preventScroll: !0
    });
  }
  save() {
    let {
      value: e
    } = this.textbox;
    switch (this.root.getAttribute("data-mode")) {
      case "link": {
        const {
          scrollTop: t
        } = this.quill.root;
        this.linkRange ? (this.quill.formatText(this.linkRange, "link", e, R.sources.USER), delete this.linkRange) : (this.restoreFocus(), this.quill.format("link", e, R.sources.USER)), this.quill.root.scrollTop = t;
        break;
      }
      case "video":
        e = fx(e);
      case "formula": {
        if (!e) break;
        const t = this.quill.getSelection(!0);
        if (t != null) {
          const n = t.index + t.length;
          this.quill.insertEmbed(
            n,
            // @ts-expect-error Fix me later
            this.root.getAttribute("data-mode"),
            e,
            R.sources.USER
          ), this.root.getAttribute("data-mode") === "formula" && this.quill.insertText(n + 1, " ", R.sources.USER), this.quill.setSelection(n + 2, R.sources.USER);
        }
        break;
      }
    }
    this.textbox.value = "", this.hide();
  }
}
function fx(r) {
  let e = r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  return e ? `${e[1] || "https"}://www.youtube.com/embed/${e[2]}?showinfo=0` : (e = r.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) ? `${e[1] || "https"}://player.vimeo.com/video/${e[2]}/` : r;
}
function Si(r, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  e.forEach((n) => {
    const i = document.createElement("option");
    n === t ? i.setAttribute("selected", "selected") : i.setAttribute("value", String(n)), r.appendChild(i);
  });
}
const px = [["bold", "italic", "link"], [{
  header: 1
}, {
  header: 2
}, "blockquote"]];
class ap extends sp {
  constructor(e, t) {
    super(e, t), this.quill.on(R.events.EDITOR_CHANGE, (n, i, s, a) => {
      if (n === R.events.SELECTION_CHANGE)
        if (i != null && i.length > 0 && a === R.sources.USER) {
          this.show(), this.root.style.left = "0px", this.root.style.width = "", this.root.style.width = `${this.root.offsetWidth}px`;
          const o = this.quill.getLines(i.index, i.length);
          if (o.length === 1) {
            const l = this.quill.getBounds(i);
            l != null && this.position(l);
          } else {
            const l = o[o.length - 1], c = this.quill.getIndex(l), d = Math.min(l.length() - 1, i.index + i.length - c), f = this.quill.getBounds(new Xn(c, d));
            f != null && this.position(f);
          }
        } else document.activeElement !== this.textbox && this.quill.hasFocus() && this.hide();
    });
  }
  listen() {
    super.listen(), this.root.querySelector(".ql-close").addEventListener("click", () => {
      this.root.classList.remove("ql-editing");
    }), this.quill.on(R.events.SCROLL_OPTIMIZE, () => {
      setTimeout(() => {
        if (this.root.classList.contains("ql-hidden")) return;
        const e = this.quill.getSelection();
        if (e != null) {
          const t = this.quill.getBounds(e);
          t != null && this.position(t);
        }
      }, 1);
    });
  }
  cancel() {
    this.show();
  }
  position(e) {
    const t = super.position(e), n = this.root.querySelector(".ql-tooltip-arrow");
    return n.style.marginLeft = "", t !== 0 && (n.style.marginLeft = `${-1 * t - n.offsetWidth / 2}px`), t;
  }
}
q(ap, "TEMPLATE", ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join(""));
class op extends ss {
  constructor(e, t) {
    t.modules.toolbar != null && t.modules.toolbar.container == null && (t.modules.toolbar.container = px), super(e, t), this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(e) {
    this.tooltip = new ap(this.quill, this.options.bounds), e.container != null && (this.tooltip.root.appendChild(e.container), this.buildButtons(e.container.querySelectorAll("button"), Wi), this.buildPickers(e.container.querySelectorAll("select"), Wi));
  }
}
op.DEFAULTS = An({}, ss.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(r) {
          r ? this.quill.theme.tooltip.edit() : this.quill.format("link", !1, D.sources.USER);
        }
      }
    }
  }
});
const gx = [[{
  header: ["1", "2", "3", !1]
}], ["bold", "italic", "underline", "link"], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["clean"]];
class lp extends sp {
  constructor() {
    super(...arguments);
    q(this, "preview", this.root.querySelector("a.ql-preview"));
  }
  listen() {
    super.listen(), this.root.querySelector("a.ql-action").addEventListener("click", (t) => {
      this.root.classList.contains("ql-editing") ? this.save() : this.edit("link", this.preview.textContent), t.preventDefault();
    }), this.root.querySelector("a.ql-remove").addEventListener("click", (t) => {
      if (this.linkRange != null) {
        const n = this.linkRange;
        this.restoreFocus(), this.quill.formatText(n, "link", !1, R.sources.USER), delete this.linkRange;
      }
      t.preventDefault(), this.hide();
    }), this.quill.on(R.events.SELECTION_CHANGE, (t, n, i) => {
      if (t != null) {
        if (t.length === 0 && i === R.sources.USER) {
          const [s, a] = this.quill.scroll.descendant(Sn, t.index);
          if (s != null) {
            this.linkRange = new Xn(t.index - a, s.length());
            const o = Sn.formats(s.domNode);
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
q(lp, "TEMPLATE", ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join(""));
class cp extends ss {
  constructor(e, t) {
    t.modules.toolbar != null && t.modules.toolbar.container == null && (t.modules.toolbar.container = gx), super(e, t), this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(e) {
    e.container != null && (e.container.classList.add("ql-snow"), this.buildButtons(e.container.querySelectorAll("button"), Wi), this.buildPickers(e.container.querySelectorAll("select"), Wi), this.tooltip = new lp(this.quill, this.options.bounds), e.container.querySelector(".ql-link") && this.quill.keyboard.addBinding({
      key: "k",
      shortKey: !0
    }, (t, n) => {
      e.handlers.link.call(e, !n.format.link);
    }));
  }
}
cp.DEFAULTS = An({}, ss.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(r) {
          if (r) {
            const e = this.quill.getSelection();
            if (e == null || e.length === 0) return;
            let t = this.quill.getText(e);
            /^\S+@\S+\.\S+$/.test(t) && t.indexOf("mailto:") !== 0 && (t = `mailto:${t}`);
            const {
              tooltip: n
            } = this.quill.theme;
            n.edit("link", t);
          } else
            this.quill.format("link", !1, D.sources.USER);
        }
      }
    }
  }
});
D.register({
  "attributors/attribute/direction": jf,
  "attributors/class/align": Bf,
  "attributors/class/background": O0,
  "attributors/class/color": N0,
  "attributors/class/direction": Uf,
  "attributors/class/font": Yf,
  "attributors/class/size": Kf,
  "attributors/style/align": Ff,
  "attributors/style/background": Vc,
  "attributors/style/color": Hc,
  "attributors/style/direction": Hf,
  "attributors/style/font": Gf,
  "attributors/style/size": Wf
}, !0);
D.register({
  "formats/align": Bf,
  "formats/direction": Uf,
  "formats/indent": kw,
  "formats/background": Vc,
  "formats/color": Hc,
  "formats/font": Yf,
  "formats/size": Kf,
  "formats/blockquote": Ul,
  "formats/code-block": Me,
  "formats/header": Hl,
  "formats/list": is,
  "formats/bold": Ki,
  "formats/code": Yc,
  "formats/italic": Vl,
  "formats/link": Sn,
  "formats/script": Yl,
  "formats/strike": Gl,
  "formats/underline": Kl,
  "formats/formula": Qs,
  "formats/image": Sw,
  "formats/video": Zs,
  "modules/syntax": tp,
  "modules/table": Ew,
  "modules/toolbar": Zc,
  "themes/bubble": op,
  "themes/snow": cp,
  "ui/icons": Wi,
  "ui/picker": za,
  "ui/icon-picker": rp,
  "ui/color-picker": np,
  "ui/tooltip": ip
}, !0);
const xu = class xu {
  /**
   * Detect if the current document is in RTL mode
   */
  static isRTL() {
    var t;
    if (this.cachedDirection !== null)
      return this.cachedDirection === "rtl";
    const e = [
      document.documentElement.getAttribute("dir"),
      this.getDirectionFromLanguage(document.documentElement.getAttribute("lang")),
      (t = document.body) == null ? void 0 : t.getAttribute("dir"),
      window.getComputedStyle(document.documentElement).direction
    ];
    for (const n of e) {
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
  static getDirectionFromLanguage(e) {
    if (!e) return null;
    const t = [
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
    ], n = e.toLowerCase().split("-")[0];
    return t.includes(n) ? "rtl" : "ltr";
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
  static transformDirectionalClasses(e) {
    if (!this.isRTL())
      return e;
    const t = /* @__PURE__ */ new Map([
      ["ml-", "mr-"],
      ["mr-", "ml-"],
      ["ms-", "me-"],
      ["me-", "ms-"],
      ["pl-", "pr-"],
      ["pr-", "pl-"],
      ["ps-", "pe-"],
      ["pe-", "ps-"],
      ["border-l-", "border-r-"],
      ["border-r-", "border-l-"],
      ["border-s-", "border-e-"],
      ["border-e-", "border-s-"],
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
      ["left-", "right-"],
      ["right-", "left-"],
      ["start-", "end-"],
      ["end-", "start-"],
      ["text-left", "text-right"],
      ["text-right", "text-left"],
      ["justify-start", "justify-end"],
      ["justify-end", "justify-start"],
      ["items-start", "items-end"],
      ["items-end", "items-start"],
      ["self-start", "self-end"],
      ["self-end", "self-start"],
      ["float-left", "float-right"],
      ["float-right", "float-left"],
      ["clear-left", "clear-right"],
      ["clear-right", "clear-left"]
    ]);
    let n = e;
    for (const [i, s] of t) {
      const a = new RegExp(`\\b${i.replace("-", "\\-")}([\\w\\-\\.\\[\\]%\\/]+)?\\b`, "g");
      new RegExp(`\\b${s.replace("-", "\\-")}([\\w\\-\\.\\[\\]%\\/]+)?\\b`, "g"), n = n.replace(a, (o, l) => s + (l || ""));
    }
    return n;
  }
  /**
   * Get the opposite direction for icon positioning
   */
  static getOppositePosition(e) {
    return this.isRTL() ? e === "left" ? "right" : "left" : e;
  }
  /**
   * Get logical position (start/end) based on physical position (left/right)
   */
  static getLogicalPosition(e) {
    return this.isRTL() ? e === "left" ? "end" : "start" : e === "left" ? "start" : "end";
  }
  /**
   * Get physical position from logical position
   */
  static getPhysicalPosition(e) {
    return this.isRTL() ? e === "start" ? "right" : "left" : e === "start" ? "left" : "right";
  }
  /**
   * Add RTL-aware classes to an element
   */
  static addRTLClasses(e, t) {
    const n = this.transformDirectionalClasses(t);
    e.classList.add(...n.split(" ").filter((i) => i.trim()));
  }
  /**
   * Remove RTL-aware classes from an element
   */
  static removeRTLClasses(e, t) {
    const n = this.transformDirectionalClasses(t);
    e.classList.remove(...n.split(" ").filter((i) => i.trim()));
  }
  /**
   * Listen for direction changes and clear cache
   */
  static observeDirectionChanges() {
    const e = new MutationObserver((t) => {
      for (const n of t)
        if (n.type === "attributes" && (n.attributeName === "dir" || n.attributeName === "lang")) {
          this.clearCache(), document.dispatchEvent(new CustomEvent("keys:direction-change", {
            detail: { isRTL: this.isRTL() }
          }));
          break;
        }
    });
    e.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["dir", "lang"]
    }), e.observe(document.body, {
      attributes: !0,
      attributeFilter: ["dir", "lang"]
    });
  }
  /**
   * Get dropdown positioning for RTL
   */
  static getDropdownPosition(e, t) {
    let n = e, i = t;
    return this.isRTL() && (n === "left" ? n = "right" : n === "right" && (n = "left"), (e === "top" || e === "bottom") && (t === "start" ? i = "end" : t === "end" && (i = "start"))), { position: n, align: i };
  }
  /**
   * Initialize RTL support globally
   */
  static initialize() {
    this.isRTL() ? (document.documentElement.classList.add("rtl"), document.documentElement.setAttribute("dir", "rtl")) : (document.documentElement.classList.add("ltr"), document.documentElement.setAttribute("dir", "ltr")), this.observeDirectionChanges();
    const e = document.createElement("style");
    e.textContent = `
            :root {
                --direction-factor: ${this.isRTL() ? "-1" : "1"};
                --text-align-start: ${this.isRTL() ? "right" : "left"};
                --text-align-end: ${this.isRTL() ? "left" : "right"};
            }
        `, document.head.appendChild(e);
  }
};
xu.cachedDirection = null;
let Wl = xu;
var mx = Object.defineProperty, bx = Object.defineProperties, yx = Object.getOwnPropertyDescriptors, Ed = Object.getOwnPropertySymbols, vx = Object.prototype.hasOwnProperty, wx = Object.prototype.propertyIsEnumerable, Cd = (r, e, t) => e in r ? mx(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, H = (r, e) => {
  for (var t in e || (e = {}))
    vx.call(e, t) && Cd(r, t, e[t]);
  if (Ed)
    for (var t of Ed(e))
      wx.call(e, t) && Cd(r, t, e[t]);
  return r;
}, Re = (r, e) => bx(r, yx(e)), be = (r, e, t) => new Promise((n, i) => {
  var s = (l) => {
    try {
      o(t.next(l));
    } catch (c) {
      i(c);
    }
  }, a = (l) => {
    try {
      o(t.throw(l));
    } catch (c) {
      i(c);
    }
  }, o = (l) => l.done ? n(l.value) : Promise.resolve(l.value).then(s, a);
  o((t = t.apply(r, e)).next());
});
const Ql = Math.min, _r = Math.max, da = Math.round, Bs = Math.floor, Tn = (r) => ({
  x: r,
  y: r
});
function xx(r, e) {
  return typeof r == "function" ? r(e) : r;
}
function kx(r) {
  return H({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, r);
}
function Sx(r) {
  return typeof r != "number" ? kx(r) : {
    top: r,
    right: r,
    bottom: r,
    left: r
  };
}
function ha(r) {
  const {
    x: e,
    y: t,
    width: n,
    height: i
  } = r;
  return {
    width: n,
    height: i,
    top: t,
    left: e,
    right: e + n,
    bottom: t + i,
    x: e,
    y: t
  };
}
function Ax(r, e) {
  return be(this, null, function* () {
    var t;
    e === void 0 && (e = {});
    const {
      x: n,
      y: i,
      platform: s,
      rects: a,
      elements: o,
      strategy: l
    } = r, {
      boundary: c = "clippingAncestors",
      rootBoundary: d = "viewport",
      elementContext: f = "floating",
      altBoundary: h = !1,
      padding: g = 0
    } = xx(e, r), m = Sx(g), y = o[h ? f === "floating" ? "reference" : "floating" : f], x = ha(yield s.getClippingRect({
      element: (t = yield s.isElement == null ? void 0 : s.isElement(y)) == null || t ? y : y.contextElement || (yield s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
      boundary: c,
      rootBoundary: d,
      strategy: l
    })), w = f === "floating" ? {
      x: n,
      y: i,
      width: a.floating.width,
      height: a.floating.height
    } : a.reference, S = yield s.getOffsetParent == null ? void 0 : s.getOffsetParent(o.floating), E = (yield s.isElement == null ? void 0 : s.isElement(S)) ? (yield s.getScale == null ? void 0 : s.getScale(S)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    }, C = ha(s.convertOffsetParentRelativeRectToViewportRelativeRect ? yield s.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements: o,
      rect: w,
      offsetParent: S,
      strategy: l
    }) : w);
    return {
      top: (x.top - C.top + m.top) / E.y,
      bottom: (C.bottom - x.bottom + m.bottom) / E.y,
      left: (x.left - C.left + m.left) / E.x,
      right: (C.right - x.right + m.right) / E.x
    };
  });
}
function ti(r) {
  return up(r) ? (r.nodeName || "").toLowerCase() : "#document";
}
function Qe(r) {
  var e;
  return (r == null || (e = r.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function dn(r) {
  var e;
  return (e = (up(r) ? r.ownerDocument : r.document) || window.document) == null ? void 0 : e.documentElement;
}
function up(r) {
  return r instanceof Node || r instanceof Qe(r).Node;
}
function Vt(r) {
  return r instanceof Element || r instanceof Qe(r).Element;
}
function Yt(r) {
  return r instanceof HTMLElement || r instanceof Qe(r).HTMLElement;
}
function Td(r) {
  return typeof ShadowRoot > "u" ? !1 : r instanceof ShadowRoot || r instanceof Qe(r).ShadowRoot;
}
function as(r) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: n,
    display: i
  } = St(r);
  return /auto|scroll|overlay|hidden|clip/.test(e + n + t) && !["inline", "contents"].includes(i);
}
function Ex(r) {
  return ["table", "td", "th"].includes(ti(r));
}
function Ra(r) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return r.matches(e);
    } catch {
      return !1;
    }
  });
}
function Xc(r) {
  const e = Jc(), t = St(r);
  return t.transform !== "none" || t.perspective !== "none" || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((n) => (t.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (t.contain || "").includes(n));
}
function Cx(r) {
  let e = Ln(r);
  for (; Yt(e) && !Wr(e); ) {
    if (Ra(e))
      return null;
    if (Xc(e))
      return e;
    e = Ln(e);
  }
  return null;
}
function Jc() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Wr(r) {
  return ["html", "body", "#document"].includes(ti(r));
}
function St(r) {
  return Qe(r).getComputedStyle(r);
}
function Pa(r) {
  return Vt(r) ? {
    scrollLeft: r.scrollLeft,
    scrollTop: r.scrollTop
  } : {
    scrollLeft: r.scrollX,
    scrollTop: r.scrollY
  };
}
function Ln(r) {
  if (ti(r) === "html")
    return r;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    r.assignedSlot || // DOM Element detected.
    r.parentNode || // ShadowRoot detected.
    Td(r) && r.host || // Fallback.
    dn(r)
  );
  return Td(e) ? e.host : e;
}
function dp(r) {
  const e = Ln(r);
  return Wr(e) ? r.ownerDocument ? r.ownerDocument.body : r.body : Yt(e) && as(e) ? e : dp(e);
}
function Qi(r, e, t) {
  var n;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = dp(r), s = i === ((n = r.ownerDocument) == null ? void 0 : n.body), a = Qe(i);
  return s ? e.concat(a, a.visualViewport || [], as(i) ? i : [], a.frameElement && t ? Qi(a.frameElement) : []) : e.concat(i, Qi(i, [], t));
}
function hp(r) {
  const e = St(r);
  let t = parseFloat(e.width) || 0, n = parseFloat(e.height) || 0;
  const i = Yt(r), s = i ? r.offsetWidth : t, a = i ? r.offsetHeight : n, o = da(t) !== s || da(n) !== a;
  return o && (t = s, n = a), {
    width: t,
    height: n,
    $: o
  };
}
function eu(r) {
  return Vt(r) ? r : r.contextElement;
}
function zr(r) {
  const e = eu(r);
  if (!Yt(e))
    return Tn(1);
  const t = e.getBoundingClientRect(), {
    width: n,
    height: i,
    $: s
  } = hp(e);
  let a = (s ? da(t.width) : t.width) / n, o = (s ? da(t.height) : t.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const Tx = /* @__PURE__ */ Tn(0);
function fp(r) {
  const e = Qe(r);
  return !Jc() || !e.visualViewport ? Tx : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Lx(r, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== Qe(r) ? !1 : e;
}
function Jn(r, e, t, n) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = r.getBoundingClientRect(), s = eu(r);
  let a = Tn(1);
  e && (n ? Vt(n) && (a = zr(n)) : a = zr(r));
  const o = Lx(s, t, n) ? fp(s) : Tn(0);
  let l = (i.left + o.x) / a.x, c = (i.top + o.y) / a.y, d = i.width / a.x, f = i.height / a.y;
  if (s) {
    const h = Qe(s), g = n && Vt(n) ? Qe(n) : n;
    let m = h, y = m.frameElement;
    for (; y && n && g !== m; ) {
      const x = zr(y), w = y.getBoundingClientRect(), S = St(y), E = w.left + (y.clientLeft + parseFloat(S.paddingLeft)) * x.x, C = w.top + (y.clientTop + parseFloat(S.paddingTop)) * x.y;
      l *= x.x, c *= x.y, d *= x.x, f *= x.y, l += E, c += C, m = Qe(y), y = m.frameElement;
    }
  }
  return ha({
    width: d,
    height: f,
    x: l,
    y: c
  });
}
function Dx(r) {
  let {
    elements: e,
    rect: t,
    offsetParent: n,
    strategy: i
  } = r;
  const s = i === "fixed", a = dn(n), o = e ? Ra(e.floating) : !1;
  if (n === a || o && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Tn(1);
  const d = Tn(0), f = Yt(n);
  if ((f || !f && !s) && ((ti(n) !== "body" || as(a)) && (l = Pa(n)), Yt(n))) {
    const h = Jn(n);
    c = zr(n), d.x = h.x + n.clientLeft, d.y = h.y + n.clientTop;
  }
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - l.scrollLeft * c.x + d.x,
    y: t.y * c.y - l.scrollTop * c.y + d.y
  };
}
function Ix(r) {
  return Array.from(r.getClientRects());
}
function pp(r) {
  return Jn(dn(r)).left + Pa(r).scrollLeft;
}
function Nx(r) {
  const e = dn(r), t = Pa(r), n = r.ownerDocument.body, i = _r(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), s = _r(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -t.scrollLeft + pp(r);
  const o = -t.scrollTop;
  return St(n).direction === "rtl" && (a += _r(e.clientWidth, n.clientWidth) - i), {
    width: i,
    height: s,
    x: a,
    y: o
  };
}
function Ox(r, e) {
  const t = Qe(r), n = dn(r), i = t.visualViewport;
  let s = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (i) {
    s = i.width, a = i.height;
    const c = Jc();
    (!c || c && e === "fixed") && (o = i.offsetLeft, l = i.offsetTop);
  }
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
function Mx(r, e) {
  const t = Jn(r, !0, e === "fixed"), n = t.top + r.clientTop, i = t.left + r.clientLeft, s = Yt(r) ? zr(r) : Tn(1), a = r.clientWidth * s.x, o = r.clientHeight * s.y, l = i * s.x, c = n * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: c
  };
}
function Ld(r, e, t) {
  let n;
  if (e === "viewport")
    n = Ox(r, t);
  else if (e === "document")
    n = Nx(dn(r));
  else if (Vt(e))
    n = Mx(e, t);
  else {
    const i = fp(r);
    n = Re(H({}, e), {
      x: e.x - i.x,
      y: e.y - i.y
    });
  }
  return ha(n);
}
function gp(r, e) {
  const t = Ln(r);
  return t === e || !Vt(t) || Wr(t) ? !1 : St(t).position === "fixed" || gp(t, e);
}
function qx(r, e) {
  const t = e.get(r);
  if (t)
    return t;
  let n = Qi(r, [], !1).filter((o) => Vt(o) && ti(o) !== "body"), i = null;
  const s = St(r).position === "fixed";
  let a = s ? Ln(r) : r;
  for (; Vt(a) && !Wr(a); ) {
    const o = St(a), l = Xc(a);
    !l && o.position === "fixed" && (i = null), (s ? !l && !i : !l && o.position === "static" && i && ["absolute", "fixed"].includes(i.position) || as(a) && !l && gp(r, a)) ? n = n.filter((c) => c !== a) : i = o, a = Ln(a);
  }
  return e.set(r, n), n;
}
function _x(r) {
  let {
    element: e,
    boundary: t,
    rootBoundary: n,
    strategy: i
  } = r;
  const s = [...t === "clippingAncestors" ? Ra(e) ? [] : qx(e, this._c) : [].concat(t), n], a = s[0], o = s.reduce((l, c) => {
    const d = Ld(e, c, i);
    return l.top = _r(d.top, l.top), l.right = Ql(d.right, l.right), l.bottom = Ql(d.bottom, l.bottom), l.left = _r(d.left, l.left), l;
  }, Ld(e, a, i));
  return {
    width: o.right - o.left,
    height: o.bottom - o.top,
    x: o.left,
    y: o.top
  };
}
function zx(r) {
  const {
    width: e,
    height: t
  } = hp(r);
  return {
    width: e,
    height: t
  };
}
function Rx(r, e, t) {
  const n = Yt(e), i = dn(e), s = t === "fixed", a = Jn(r, !0, s, e);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Tn(0);
  if (n || !n && !s)
    if ((ti(e) !== "body" || as(i)) && (o = Pa(e)), n) {
      const f = Jn(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else i && (l.x = pp(i));
  const c = a.left + o.scrollLeft - l.x, d = a.top + o.scrollTop - l.y;
  return {
    x: c,
    y: d,
    width: a.width,
    height: a.height
  };
}
function Xo(r) {
  return St(r).position === "static";
}
function Dd(r, e) {
  return !Yt(r) || St(r).position === "fixed" ? null : e ? e(r) : r.offsetParent;
}
function mp(r, e) {
  const t = Qe(r);
  if (Ra(r))
    return t;
  if (!Yt(r)) {
    let i = Ln(r);
    for (; i && !Wr(i); ) {
      if (Vt(i) && !Xo(i))
        return i;
      i = Ln(i);
    }
    return t;
  }
  let n = Dd(r, e);
  for (; n && Ex(n) && Xo(n); )
    n = Dd(n, e);
  return n && Wr(n) && Xo(n) && !Xc(n) ? t : n || Cx(r) || t;
}
const Px = function(r) {
  return be(this, null, function* () {
    const e = this.getOffsetParent || mp, t = this.getDimensions, n = yield t(r.floating);
    return {
      reference: Rx(r.reference, yield e(r.floating), r.strategy),
      floating: {
        x: 0,
        y: 0,
        width: n.width,
        height: n.height
      }
    };
  });
};
function Bx(r) {
  return St(r).direction === "rtl";
}
const st = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Dx,
  getDocumentElement: dn,
  getClippingRect: _x,
  getOffsetParent: mp,
  getElementRects: Px,
  getClientRects: Ix,
  getDimensions: zx,
  getScale: zr,
  isElement: Vt,
  isRTL: Bx
};
function Fx(r, e) {
  let t = null, n;
  const i = dn(r);
  function s() {
    var o;
    clearTimeout(n), (o = t) == null || o.disconnect(), t = null;
  }
  function a(o, l) {
    o === void 0 && (o = !1), l === void 0 && (l = 1), s();
    const {
      left: c,
      top: d,
      width: f,
      height: h
    } = r.getBoundingClientRect();
    if (o || e(), !f || !h)
      return;
    const g = Bs(d), m = Bs(i.clientWidth - (c + f)), y = Bs(i.clientHeight - (d + h)), x = Bs(c), w = {
      rootMargin: -g + "px " + -m + "px " + -y + "px " + -x + "px",
      threshold: _r(0, Ql(1, l)) || 1
    };
    let S = !0;
    function E(C) {
      const I = C[0].intersectionRatio;
      if (I !== l) {
        if (!S)
          return a();
        I ? a(!1, I) : n = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      S = !1;
    }
    try {
      t = new IntersectionObserver(E, Re(H({}, w), {
        // Handle <iframe>s
        root: i.ownerDocument
      }));
    } catch {
      t = new IntersectionObserver(E, w);
    }
    t.observe(r);
  }
  return a(!0), s;
}
function bp(r, e, t, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = eu(r), d = i || s ? [...c ? Qi(c) : [], ...Qi(e)] : [];
  d.forEach((w) => {
    i && w.addEventListener("scroll", t, {
      passive: !0
    }), s && w.addEventListener("resize", t);
  });
  const f = c && o ? Fx(c, t) : null;
  let h = -1, g = null;
  a && (g = new ResizeObserver((w) => {
    let [S] = w;
    S && S.target === c && g && (g.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var E;
      (E = g) == null || E.observe(e);
    })), t();
  }), c && !l && g.observe(c), g.observe(e));
  let m, y = l ? Jn(r) : null;
  l && x();
  function x() {
    const w = Jn(r);
    y && (w.x !== y.x || w.y !== y.y || w.width !== y.width || w.height !== y.height) && t(), y = w, m = requestAnimationFrame(x);
  }
  return t(), () => {
    var w;
    d.forEach((S) => {
      i && S.removeEventListener("scroll", t), s && S.removeEventListener("resize", t);
    }), f == null || f(), (w = g) == null || w.disconnect(), g = null, l && cancelAnimationFrame(m);
  };
}
const $x = Ax, Jo = 0, z = 1, K = 2, me = 3, oe = 4, Wt = 5, Ba = 6, Ie = 7, Ue = 8, G = 9, $ = 10, ce = 11, Y = 12, ue = 13, os = 14, He = 15, qe = 16, Ve = 17, Qt = 18, Xe = 19, At = 20, xe = 21, re = 22, _e = 23, lt = 24, Be = 25, jx = 0;
function ke(r) {
  return r >= 48 && r <= 57;
}
function Dn(r) {
  return ke(r) || // 0 .. 9
  r >= 65 && r <= 70 || // A .. F
  r >= 97 && r <= 102;
}
function tu(r) {
  return r >= 65 && r <= 90;
}
function Ux(r) {
  return r >= 97 && r <= 122;
}
function Hx(r) {
  return tu(r) || Ux(r);
}
function Vx(r) {
  return r >= 128;
}
function fa(r) {
  return Hx(r) || Vx(r) || r === 95;
}
function yp(r) {
  return fa(r) || ke(r) || r === 45;
}
function Yx(r) {
  return r >= 0 && r <= 8 || r === 11 || r >= 14 && r <= 31 || r === 127;
}
function pa(r) {
  return r === 10 || r === 13 || r === 12;
}
function er(r) {
  return pa(r) || r === 32 || r === 9;
}
function Ft(r, e) {
  return !(r !== 92 || pa(e) || e === jx);
}
function Xs(r, e, t) {
  return r === 45 ? fa(e) || e === 45 || Ft(e, t) : fa(r) ? !0 : r === 92 ? Ft(r, e) : !1;
}
function el(r, e, t) {
  return r === 43 || r === 45 ? ke(e) ? 2 : e === 46 && ke(t) ? 3 : 0 : r === 46 ? ke(e) ? 2 : 0 : ke(r) ? 1 : 0;
}
function vp(r) {
  return r === 65279 || r === 65534 ? 1 : 0;
}
const Zl = new Array(128), Gx = 128, Js = 130, wp = 131, nu = 132, xp = 133;
for (let r = 0; r < Zl.length; r++)
  Zl[r] = er(r) && Js || ke(r) && wp || fa(r) && nu || Yx(r) && xp || r || Gx;
function tl(r) {
  return r < 128 ? Zl[r] : nu;
}
function Rr(r, e) {
  return e < r.length ? r.charCodeAt(e) : 0;
}
function Xl(r, e, t) {
  return t === 13 && Rr(r, e + 1) === 10 ? 2 : 1;
}
function Pr(r, e, t) {
  let n = r.charCodeAt(e);
  return tu(n) && (n = n | 32), n === t;
}
function Zi(r, e, t, n) {
  if (t - e !== n.length || e < 0 || t > r.length)
    return !1;
  for (let i = e; i < t; i++) {
    const s = n.charCodeAt(i - e);
    let a = r.charCodeAt(i);
    if (tu(a) && (a = a | 32), a !== s)
      return !1;
  }
  return !0;
}
function Kx(r, e) {
  for (; e >= 0 && er(r.charCodeAt(e)); e--)
    ;
  return e + 1;
}
function Fs(r, e) {
  for (; e < r.length && er(r.charCodeAt(e)); e++)
    ;
  return e;
}
function nl(r, e) {
  for (; e < r.length && ke(r.charCodeAt(e)); e++)
    ;
  return e;
}
function Qr(r, e) {
  if (e += 2, Dn(Rr(r, e - 1))) {
    for (const n = Math.min(r.length, e + 5); e < n && Dn(Rr(r, e)); e++)
      ;
    const t = Rr(r, e);
    er(t) && (e += Xl(r, e, t));
  }
  return e;
}
function $s(r, e) {
  for (; e < r.length; e++) {
    const t = r.charCodeAt(e);
    if (!yp(t)) {
      if (Ft(t, Rr(r, e + 1))) {
        e = Qr(r, e) - 1;
        continue;
      }
      break;
    }
  }
  return e;
}
function Fa(r, e) {
  let t = r.charCodeAt(e);
  if ((t === 43 || t === 45) && (t = r.charCodeAt(e += 1)), ke(t) && (e = nl(r, e + 1), t = r.charCodeAt(e)), t === 46 && ke(r.charCodeAt(e + 1)) && (e += 2, e = nl(r, e)), Pr(
    r,
    e,
    101
    /* e */
  )) {
    let n = 0;
    t = r.charCodeAt(e + 1), (t === 45 || t === 43) && (n = 1, t = r.charCodeAt(e + 2)), ke(t) && (e = nl(r, e + 1 + n + 1));
  }
  return e;
}
function rl(r, e) {
  for (; e < r.length; e++) {
    const t = r.charCodeAt(e);
    if (t === 41) {
      e++;
      break;
    }
    Ft(t, Rr(r, e + 1)) && (e = Qr(r, e));
  }
  return e;
}
function kp(r) {
  if (r.length === 1 && !Dn(r.charCodeAt(0)))
    return r[0];
  let e = parseInt(r, 16);
  return (e === 0 || // If this number is zero,
  e >= 55296 && e <= 57343 || // or is for a surrogate,
  e > 1114111) && (e = 65533), String.fromCodePoint(e);
}
const Sp = [
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
], Wx = 16 * 1024;
function ga(r = null, e) {
  return r === null || r.length < e ? new Uint32Array(Math.max(e + 1024, Wx)) : r;
}
const Id = 10, Qx = 12, Nd = 13;
function Od(r) {
  const e = r.source, t = e.length, n = e.length > 0 ? vp(e.charCodeAt(0)) : 0, i = ga(r.lines, t), s = ga(r.columns, t);
  let a = r.startLine, o = r.startColumn;
  for (let l = n; l < t; l++) {
    const c = e.charCodeAt(l);
    i[l] = a, s[l] = o++, (c === Id || c === Nd || c === Qx) && (c === Nd && l + 1 < t && e.charCodeAt(l + 1) === Id && (l++, i[l] = a, s[l] = o), a++, o = 1);
  }
  i[t] = a, s[t] = o, r.lines = i, r.columns = s, r.computed = !0;
}
class Zx {
  constructor() {
    this.lines = null, this.columns = null, this.computed = !1;
  }
  setSource(e, t = 0, n = 1, i = 1) {
    this.source = e, this.startOffset = t, this.startLine = n, this.startColumn = i, this.computed = !1;
  }
  getLocation(e, t) {
    return this.computed || Od(this), {
      source: t,
      offset: this.startOffset + e,
      line: this.lines[e],
      column: this.columns[e]
    };
  }
  getLocationRange(e, t, n) {
    return this.computed || Od(this), {
      source: n,
      start: {
        offset: this.startOffset + e,
        line: this.lines[e],
        column: this.columns[e]
      },
      end: {
        offset: this.startOffset + t,
        line: this.lines[t],
        column: this.columns[t]
      }
    };
  }
}
const et = 16777215, mn = 24, Xx = /* @__PURE__ */ new Map([
  [K, re],
  [xe, re],
  [Xe, At],
  [_e, lt]
]);
class Jx {
  constructor(e, t) {
    this.setSource(e, t);
  }
  reset() {
    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
  }
  setSource(e = "", t = () => {
  }) {
    e = String(e || "");
    const n = e.length, i = ga(this.offsetAndType, e.length + 1), s = ga(this.balance, e.length + 1);
    let a = 0, o = 0, l = 0, c = -1;
    for (this.offsetAndType = null, this.balance = null, t(e, (d, f, h) => {
      switch (d) {
        default:
          s[a] = n;
          break;
        case o: {
          let g = l & et;
          for (l = s[g], o = l >> mn, s[a] = g, s[g++] = a; g < a; g++)
            s[g] === n && (s[g] = a);
          break;
        }
        case xe:
        case K:
        case Xe:
        case _e:
          s[a] = l, o = Xx.get(d), l = o << mn | a;
          break;
      }
      i[a++] = d << mn | h, c === -1 && (c = f);
    }), i[a] = Jo << mn | n, s[a] = n, s[n] = n; l !== 0; ) {
      const d = l & et;
      l = s[d], s[d] = n;
    }
    this.source = e, this.firstCharOffset = c === -1 ? 0 : c, this.tokenCount = a, this.offsetAndType = i, this.balance = s, this.reset(), this.next();
  }
  lookupType(e) {
    return e += this.tokenIndex, e < this.tokenCount ? this.offsetAndType[e] >> mn : Jo;
  }
  lookupOffset(e) {
    return e += this.tokenIndex, e < this.tokenCount ? this.offsetAndType[e - 1] & et : this.source.length;
  }
  lookupValue(e, t) {
    return e += this.tokenIndex, e < this.tokenCount ? Zi(
      this.source,
      this.offsetAndType[e - 1] & et,
      this.offsetAndType[e] & et,
      t
    ) : !1;
  }
  getTokenStart(e) {
    return e === this.tokenIndex ? this.tokenStart : e > 0 ? e < this.tokenCount ? this.offsetAndType[e - 1] & et : this.offsetAndType[this.tokenCount] & et : this.firstCharOffset;
  }
  substrToCursor(e) {
    return this.source.substring(e, this.tokenStart);
  }
  isBalanceEdge(e) {
    return this.balance[this.tokenIndex] < e;
  }
  isDelim(e, t) {
    return t ? this.lookupType(t) === G && this.source.charCodeAt(this.lookupOffset(t)) === e : this.tokenType === G && this.source.charCodeAt(this.tokenStart) === e;
  }
  skip(e) {
    let t = this.tokenIndex + e;
    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.offsetAndType[t - 1] & et, t = this.offsetAndType[t], this.tokenType = t >> mn, this.tokenEnd = t & et) : (this.tokenIndex = this.tokenCount, this.next());
  }
  next() {
    let e = this.tokenIndex + 1;
    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.tokenEnd, e = this.offsetAndType[e], this.tokenType = e >> mn, this.tokenEnd = e & et) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = Jo, this.tokenStart = this.tokenEnd = this.source.length);
  }
  skipSC() {
    for (; this.tokenType === ue || this.tokenType === Be; )
      this.next();
  }
  skipUntilBalanced(e, t) {
    let n = e, i, s;
    e:
      for (; n < this.tokenCount; n++) {
        if (i = this.balance[n], i < e)
          break e;
        switch (s = n > 0 ? this.offsetAndType[n - 1] & et : this.firstCharOffset, t(this.source.charCodeAt(s))) {
          case 1:
            break e;
          case 2:
            n++;
            break e;
          default:
            this.balance[i] === n && (n = i);
        }
      }
    this.skip(n - this.tokenIndex);
  }
  forEachToken(e) {
    for (let t = 0, n = this.firstCharOffset; t < this.tokenCount; t++) {
      const i = n, s = this.offsetAndType[t], a = s & et, o = s >> mn;
      n = a, e(o, i, a, t);
    }
  }
  dump() {
    const e = new Array(this.tokenCount);
    return this.forEachToken((t, n, i, s) => {
      e[s] = {
        idx: s,
        type: Sp[t],
        chunk: this.source.substring(n, i),
        balance: this.balance[s]
      };
    }), e;
  }
}
function $a(r, e) {
  function t(f) {
    return f < o ? r.charCodeAt(f) : 0;
  }
  function n() {
    if (c = Fa(r, c), Xs(t(c), t(c + 1), t(c + 2))) {
      d = Y, c = $s(r, c);
      return;
    }
    if (t(c) === 37) {
      d = ce, c++;
      return;
    }
    d = $;
  }
  function i() {
    const f = c;
    if (c = $s(r, c), Zi(r, f, c, "url") && t(c) === 40) {
      if (c = Fs(r, c + 1), t(c) === 34 || t(c) === 39) {
        d = K, c = f + 4;
        return;
      }
      a();
      return;
    }
    if (t(c) === 40) {
      d = K, c++;
      return;
    }
    d = z;
  }
  function s(f) {
    for (f || (f = t(c++)), d = Wt; c < r.length; c++) {
      const h = r.charCodeAt(c);
      switch (tl(h)) {
        case f:
          c++;
          return;
        case Js:
          if (pa(h)) {
            c += Xl(r, c, h), d = Ba;
            return;
          }
          break;
        case 92:
          if (c === r.length - 1)
            break;
          const g = t(c + 1);
          pa(g) ? c += Xl(r, c + 1, g) : Ft(h, g) && (c = Qr(r, c) - 1);
          break;
      }
    }
  }
  function a() {
    for (d = Ie, c = Fs(r, c); c < r.length; c++) {
      const f = r.charCodeAt(c);
      switch (tl(f)) {
        case 41:
          c++;
          return;
        case Js:
          if (c = Fs(r, c), t(c) === 41 || c >= r.length) {
            c < r.length && c++;
            return;
          }
          c = rl(r, c), d = Ue;
          return;
        case 34:
        case 39:
        case 40:
        case xp:
          c = rl(r, c), d = Ue;
          return;
        case 92:
          if (Ft(f, t(c + 1))) {
            c = Qr(r, c) - 1;
            break;
          }
          c = rl(r, c), d = Ue;
          return;
      }
    }
  }
  r = String(r || "");
  const o = r.length;
  let l = vp(t(0)), c = l, d;
  for (; c < o; ) {
    const f = r.charCodeAt(c);
    switch (tl(f)) {
      case Js:
        d = ue, c = Fs(r, c + 1);
        break;
      case 34:
        s();
        break;
      case 35:
        yp(t(c + 1)) || Ft(t(c + 1), t(c + 2)) ? (d = oe, c = $s(r, c + 1)) : (d = G, c++);
        break;
      case 39:
        s();
        break;
      case 40:
        d = xe, c++;
        break;
      case 41:
        d = re, c++;
        break;
      case 43:
        el(f, t(c + 1), t(c + 2)) ? n() : (d = G, c++);
        break;
      case 44:
        d = Qt, c++;
        break;
      case 45:
        el(f, t(c + 1), t(c + 2)) ? n() : t(c + 1) === 45 && t(c + 2) === 62 ? (d = He, c = c + 3) : Xs(f, t(c + 1), t(c + 2)) ? i() : (d = G, c++);
        break;
      case 46:
        el(f, t(c + 1), t(c + 2)) ? n() : (d = G, c++);
        break;
      case 47:
        t(c + 1) === 42 ? (d = Be, c = r.indexOf("*/", c + 2), c = c === -1 ? r.length : c + 2) : (d = G, c++);
        break;
      case 58:
        d = qe, c++;
        break;
      case 59:
        d = Ve, c++;
        break;
      case 60:
        t(c + 1) === 33 && t(c + 2) === 45 && t(c + 3) === 45 ? (d = os, c = c + 4) : (d = G, c++);
        break;
      case 64:
        Xs(t(c + 1), t(c + 2), t(c + 3)) ? (d = me, c = $s(r, c + 1)) : (d = G, c++);
        break;
      case 91:
        d = Xe, c++;
        break;
      case 92:
        Ft(f, t(c + 1)) ? i() : (d = G, c++);
        break;
      case 93:
        d = At, c++;
        break;
      case 123:
        d = _e, c++;
        break;
      case 125:
        d = lt, c++;
        break;
      case wp:
        n();
        break;
      case nu:
        i();
        break;
      default:
        d = G, c++;
    }
    e(d, l, l = c);
  }
}
let vr = null;
class ge {
  static createItem(e) {
    return {
      prev: null,
      next: null,
      data: e
    };
  }
  constructor() {
    this.head = null, this.tail = null, this.cursor = null;
  }
  createItem(e) {
    return ge.createItem(e);
  }
  // cursor helpers
  allocateCursor(e, t) {
    let n;
    return vr !== null ? (n = vr, vr = vr.cursor, n.prev = e, n.next = t, n.cursor = this.cursor) : n = {
      prev: e,
      next: t,
      cursor: this.cursor
    }, this.cursor = n, n;
  }
  releaseCursor() {
    const { cursor: e } = this;
    this.cursor = e.cursor, e.prev = null, e.next = null, e.cursor = vr, vr = e;
  }
  updateCursors(e, t, n, i) {
    let { cursor: s } = this;
    for (; s !== null; )
      s.prev === e && (s.prev = t), s.next === n && (s.next = i), s = s.cursor;
  }
  *[Symbol.iterator]() {
    for (let e = this.head; e !== null; e = e.next)
      yield e.data;
  }
  // getters
  get size() {
    let e = 0;
    for (let t = this.head; t !== null; t = t.next)
      e++;
    return e;
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
  fromArray(e) {
    let t = null;
    this.head = null;
    for (let n of e) {
      const i = ge.createItem(n);
      t !== null ? t.next = i : this.head = i, i.prev = t, t = i;
    }
    return this.tail = t, this;
  }
  toArray() {
    return [...this];
  }
  toJSON() {
    return [...this];
  }
  // array-like methods
  forEach(e, t = this) {
    const n = this.allocateCursor(null, this.head);
    for (; n.next !== null; ) {
      const i = n.next;
      n.next = i.next, e.call(t, i.data, i, this);
    }
    this.releaseCursor();
  }
  forEachRight(e, t = this) {
    const n = this.allocateCursor(this.tail, null);
    for (; n.prev !== null; ) {
      const i = n.prev;
      n.prev = i.prev, e.call(t, i.data, i, this);
    }
    this.releaseCursor();
  }
  reduce(e, t, n = this) {
    let i = this.allocateCursor(null, this.head), s = t, a;
    for (; i.next !== null; )
      a = i.next, i.next = a.next, s = e.call(n, s, a.data, a, this);
    return this.releaseCursor(), s;
  }
  reduceRight(e, t, n = this) {
    let i = this.allocateCursor(this.tail, null), s = t, a;
    for (; i.prev !== null; )
      a = i.prev, i.prev = a.prev, s = e.call(n, s, a.data, a, this);
    return this.releaseCursor(), s;
  }
  some(e, t = this) {
    for (let n = this.head; n !== null; n = n.next)
      if (e.call(t, n.data, n, this))
        return !0;
    return !1;
  }
  map(e, t = this) {
    const n = new ge();
    for (let i = this.head; i !== null; i = i.next)
      n.appendData(e.call(t, i.data, i, this));
    return n;
  }
  filter(e, t = this) {
    const n = new ge();
    for (let i = this.head; i !== null; i = i.next)
      e.call(t, i.data, i, this) && n.appendData(i.data);
    return n;
  }
  nextUntil(e, t, n = this) {
    if (e === null)
      return;
    const i = this.allocateCursor(null, e);
    for (; i.next !== null; ) {
      const s = i.next;
      if (i.next = s.next, t.call(n, s.data, s, this))
        break;
    }
    this.releaseCursor();
  }
  prevUntil(e, t, n = this) {
    if (e === null)
      return;
    const i = this.allocateCursor(e, null);
    for (; i.prev !== null; ) {
      const s = i.prev;
      if (i.prev = s.prev, t.call(n, s.data, s, this))
        break;
    }
    this.releaseCursor();
  }
  // mutation
  clear() {
    this.head = null, this.tail = null;
  }
  copy() {
    const e = new ge();
    for (let t of this)
      e.appendData(t);
    return e;
  }
  prepend(e) {
    return this.updateCursors(null, e, this.head, e), this.head !== null ? (this.head.prev = e, e.next = this.head) : this.tail = e, this.head = e, this;
  }
  prependData(e) {
    return this.prepend(ge.createItem(e));
  }
  append(e) {
    return this.insert(e);
  }
  appendData(e) {
    return this.insert(ge.createItem(e));
  }
  insert(e, t = null) {
    if (t !== null)
      if (this.updateCursors(t.prev, e, t, e), t.prev === null) {
        if (this.head !== t)
          throw new Error("before doesn't belong to list");
        this.head = e, t.prev = e, e.next = t, this.updateCursors(null, e);
      } else
        t.prev.next = e, e.prev = t.prev, t.prev = e, e.next = t;
    else
      this.updateCursors(this.tail, e, null, e), this.tail !== null ? (this.tail.next = e, e.prev = this.tail) : this.head = e, this.tail = e;
    return this;
  }
  insertData(e, t) {
    return this.insert(ge.createItem(e), t);
  }
  remove(e) {
    if (this.updateCursors(e, e.prev, e, e.next), e.prev !== null)
      e.prev.next = e.next;
    else {
      if (this.head !== e)
        throw new Error("item doesn't belong to list");
      this.head = e.next;
    }
    if (e.next !== null)
      e.next.prev = e.prev;
    else {
      if (this.tail !== e)
        throw new Error("item doesn't belong to list");
      this.tail = e.prev;
    }
    return e.prev = null, e.next = null, e;
  }
  push(e) {
    this.insert(ge.createItem(e));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(e) {
    this.prepend(ge.createItem(e));
  }
  shift() {
    return this.head !== null ? this.remove(this.head) : null;
  }
  prependList(e) {
    return this.insertList(e, this.head);
  }
  appendList(e) {
    return this.insertList(e);
  }
  insertList(e, t) {
    return e.head === null ? this : (t != null ? (this.updateCursors(t.prev, e.tail, t, e.head), t.prev !== null ? (t.prev.next = e.head, e.head.prev = t.prev) : this.head = e.head, t.prev = e.tail, e.tail.next = t) : (this.updateCursors(this.tail, e.tail, null, e.head), this.tail !== null ? (this.tail.next = e.head, e.head.prev = this.tail) : this.head = e.head, this.tail = e.tail), e.head = null, e.tail = null, this);
  }
  replace(e, t) {
    "head" in t ? this.insertList(t, e) : this.insert(t, e), this.remove(e);
  }
}
function ja(r, e) {
  const t = Object.create(SyntaxError.prototype), n = new Error();
  return Object.assign(t, {
    name: r,
    message: e,
    get stack() {
      return (n.stack || "").replace(/^(.+\n){1,3}/, `${r}: ${e}
`);
    }
  });
}
const il = 100, Md = 60, qd = "    ";
function _d({ source: r, line: e, column: t }, n) {
  function i(d, f) {
    return s.slice(d, f).map(
      (h, g) => String(d + g + 1).padStart(l) + " |" + h
    ).join(`
`);
  }
  const s = r.split(/\r\n?|\n|\f/), a = Math.max(1, e - n) - 1, o = Math.min(e + n, s.length + 1), l = Math.max(4, String(o).length) + 1;
  let c = 0;
  t += (qd.length - 1) * (s[e - 1].substr(0, t - 1).match(/\t/g) || []).length, t > il && (c = t - Md + 3, t = Md - 2);
  for (let d = a; d <= o; d++)
    d >= 0 && d < s.length && (s[d] = s[d].replace(/\t/g, qd), s[d] = (c > 0 && s[d].length > c ? "…" : "") + s[d].substr(c, il - 2) + (s[d].length > c + il - 1 ? "…" : ""));
  return [
    i(a, e),
    new Array(t + l + 2).join("-") + "^",
    i(e, o)
  ].filter(Boolean).join(`
`);
}
function zd(r, e, t, n, i) {
  return Object.assign(ja("SyntaxError", r), {
    source: e,
    offset: t,
    line: n,
    column: i,
    sourceFragment(s) {
      return _d({ source: e, line: n, column: i }, isNaN(s) ? 0 : s);
    },
    get formattedMessage() {
      return `Parse error: ${r}
` + _d({ source: e, line: n, column: i }, 2);
    }
  });
}
function ek(r) {
  const e = this.createList();
  let t = !1;
  const n = {
    recognizer: r
  };
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case Be:
        this.next();
        continue;
      case ue:
        t = !0, this.next();
        continue;
    }
    let i = r.getNode.call(this, n);
    if (i === void 0)
      break;
    t && (r.onWhiteSpace && r.onWhiteSpace.call(this, i, e, n), t = !1), e.push(i);
  }
  return t && r.onWhiteSpace && r.onWhiteSpace.call(this, null, e, n), e;
}
const Rd = () => {
}, tk = 33, nk = 35, sl = 59, Pd = 123, Bd = 0;
function rk(r) {
  return function() {
    return this[r]();
  };
}
function al(r) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const t in r) {
    const n = r[t], i = n.parse || n;
    i && (e[t] = i);
  }
  return e;
}
function ik(r) {
  const e = {
    context: /* @__PURE__ */ Object.create(null),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), r.scope),
    atrule: al(r.atrule),
    pseudo: al(r.pseudo),
    node: al(r.node)
  };
  for (const t in r.parseContext)
    switch (typeof r.parseContext[t]) {
      case "function":
        e.context[t] = r.parseContext[t];
        break;
      case "string":
        e.context[t] = rk(r.parseContext[t]);
        break;
    }
  return H(H({
    config: e
  }, e), e.node);
}
function sk(r) {
  let e = "", t = "<unknown>", n = !1, i = Rd, s = !1;
  const a = new Zx(), o = Object.assign(new Jx(), ik(r || {}), {
    parseAtrulePrelude: !0,
    parseRulePrelude: !0,
    parseValue: !0,
    parseCustomProperty: !1,
    readSequence: ek,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(l) {
      return l === Pd ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(l) {
      return l === Pd || l === sl ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(l) {
      return l === tk || l === sl ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(l) {
      return l === sl ? 2 : 0;
    },
    createList() {
      return new ge();
    },
    createSingleNodeList(l) {
      return new ge().appendData(l);
    },
    getFirstListNode(l) {
      return l && l.first;
    },
    getLastListNode(l) {
      return l && l.last;
    },
    parseWithFallback(l, c) {
      const d = this.tokenIndex;
      try {
        return l.call(this);
      } catch (f) {
        if (s)
          throw f;
        const h = c.call(this, d);
        return s = !0, i(f, h), s = !1, h;
      }
    },
    lookupNonWSType(l) {
      let c;
      do
        if (c = this.lookupType(l++), c !== ue)
          return c;
      while (c !== Bd);
      return Bd;
    },
    charCodeAt(l) {
      return l >= 0 && l < e.length ? e.charCodeAt(l) : 0;
    },
    substring(l, c) {
      return e.substring(l, c);
    },
    substrToCursor(l) {
      return this.source.substring(l, this.tokenStart);
    },
    cmpChar(l, c) {
      return Pr(e, l, c);
    },
    cmpStr(l, c, d) {
      return Zi(e, l, c, d);
    },
    consume(l) {
      const c = this.tokenStart;
      return this.eat(l), this.substrToCursor(c);
    },
    consumeFunctionName() {
      const l = e.substring(this.tokenStart, this.tokenEnd - 1);
      return this.eat(K), l;
    },
    consumeNumber(l) {
      const c = e.substring(this.tokenStart, Fa(e, this.tokenStart));
      return this.eat(l), c;
    },
    eat(l) {
      if (this.tokenType !== l) {
        const c = Sp[l].slice(0, -6).replace(/-/g, " ").replace(/^./, (h) => h.toUpperCase());
        let d = `${/[[\](){}]/.test(c) ? `"${c}"` : c} is expected`, f = this.tokenStart;
        switch (l) {
          case z:
            this.tokenType === K || this.tokenType === Ie ? (f = this.tokenEnd - 1, d = "Identifier is expected but function found") : d = "Identifier is expected";
            break;
          case oe:
            this.isDelim(nk) && (this.next(), f++, d = "Name is expected");
            break;
          case ce:
            this.tokenType === $ && (f = this.tokenEnd, d = "Percent sign is expected");
            break;
        }
        this.error(d, f);
      }
      this.next();
    },
    eatIdent(l) {
      (this.tokenType !== z || this.lookupValue(0, l) === !1) && this.error(`Identifier "${l}" is expected`), this.next();
    },
    eatDelim(l) {
      this.isDelim(l) || this.error(`Delim "${String.fromCharCode(l)}" is expected`), this.next();
    },
    getLocation(l, c) {
      return n ? a.getLocationRange(
        l,
        c,
        t
      ) : null;
    },
    getLocationFromList(l) {
      if (n) {
        const c = this.getFirstListNode(l), d = this.getLastListNode(l);
        return a.getLocationRange(
          c !== null ? c.loc.start.offset - a.startOffset : this.tokenStart,
          d !== null ? d.loc.end.offset - a.startOffset : this.tokenStart,
          t
        );
      }
      return null;
    },
    error(l, c) {
      const d = typeof c < "u" && c < e.length ? a.getLocation(c) : this.eof ? a.getLocation(Kx(e, e.length - 1)) : a.getLocation(this.tokenStart);
      throw new zd(
        l || "Unexpected input",
        e,
        d.offset,
        d.line,
        d.column
      );
    }
  });
  return Object.assign(function(l, c) {
    e = l, c = c || {}, o.setSource(e, $a), a.setSource(
      e,
      c.offset,
      c.line,
      c.column
    ), t = c.filename || "<unknown>", n = !!c.positions, i = typeof c.onParseError == "function" ? c.onParseError : Rd, s = !1, o.parseAtrulePrelude = "parseAtrulePrelude" in c ? !!c.parseAtrulePrelude : !0, o.parseRulePrelude = "parseRulePrelude" in c ? !!c.parseRulePrelude : !0, o.parseValue = "parseValue" in c ? !!c.parseValue : !0, o.parseCustomProperty = "parseCustomProperty" in c ? !!c.parseCustomProperty : !1;
    const { context: d = "default", onComment: f } = c;
    if (!(d in o.context))
      throw new Error("Unknown context `" + d + "`");
    typeof f == "function" && o.forEachToken((g, m, y) => {
      if (g === Be) {
        const x = o.getLocation(m, y), w = Zi(e, y - 2, y, "*/") ? e.slice(m + 2, y - 2) : e.slice(m + 2, y);
        f(w, x);
      }
    });
    const h = o.context[d].call(o, c);
    return o.eof || o.error(), h;
  }, {
    SyntaxError: zd,
    config: o.config
  });
}
var ru = {}, iu = {}, Fd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
iu.encode = function(r) {
  if (0 <= r && r < Fd.length)
    return Fd[r];
  throw new TypeError("Must be between 0 and 63: " + r);
};
iu.decode = function(r) {
  var e = 65, t = 90, n = 97, i = 122, s = 48, a = 57, o = 43, l = 47, c = 26, d = 52;
  return e <= r && r <= t ? r - e : n <= r && r <= i ? r - n + c : s <= r && r <= a ? r - s + d : r == o ? 62 : r == l ? 63 : -1;
};
var Ap = iu, su = 5, Ep = 1 << su, Cp = Ep - 1, Tp = Ep;
function ak(r) {
  return r < 0 ? (-r << 1) + 1 : (r << 1) + 0;
}
function ok(r) {
  var e = (r & 1) === 1, t = r >> 1;
  return e ? -t : t;
}
ru.encode = function(r) {
  var e = "", t, n = ak(r);
  do
    t = n & Cp, n >>>= su, n > 0 && (t |= Tp), e += Ap.encode(t);
  while (n > 0);
  return e;
};
ru.decode = function(r, e, t) {
  var n = r.length, i = 0, s = 0, a, o;
  do {
    if (e >= n)
      throw new Error("Expected more digits in base 64 VLQ value.");
    if (o = Ap.decode(r.charCodeAt(e++)), o === -1)
      throw new Error("Invalid base64 digit: " + r.charAt(e - 1));
    a = !!(o & Tp), o &= Cp, i = i + (o << s), s += su;
  } while (a);
  t.value = ok(i), t.rest = e;
};
var Ua = {};
(function(r) {
  function e(k, A, _) {
    if (A in k)
      return k[A];
    if (arguments.length === 3)
      return _;
    throw new Error('"' + A + '" is a required argument.');
  }
  r.getArg = e;
  var t = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, n = /^data:.+\,.+$/;
  function i(k) {
    var A = k.match(t);
    return A ? {
      scheme: A[1],
      auth: A[2],
      host: A[3],
      port: A[4],
      path: A[5]
    } : null;
  }
  r.urlParse = i;
  function s(k) {
    var A = "";
    return k.scheme && (A += k.scheme + ":"), A += "//", k.auth && (A += k.auth + "@"), k.host && (A += k.host), k.port && (A += ":" + k.port), k.path && (A += k.path), A;
  }
  r.urlGenerate = s;
  var a = 32;
  function o(k) {
    var A = [];
    return function(_) {
      for (var N = 0; N < A.length; N++)
        if (A[N].input === _) {
          var V = A[0];
          return A[0] = A[N], A[N] = V, A[0].result;
        }
      var fe = k(_);
      return A.unshift({
        input: _,
        result: fe
      }), A.length > a && A.pop(), fe;
    };
  }
  var l = o(function(k) {
    var A = k, _ = i(k);
    if (_) {
      if (!_.path)
        return k;
      A = _.path;
    }
    for (var N = r.isAbsolute(A), V = [], fe = 0, ie = 0; ; )
      if (fe = ie, ie = A.indexOf("/", fe), ie === -1) {
        V.push(A.slice(fe));
        break;
      } else
        for (V.push(A.slice(fe, ie)); ie < A.length && A[ie] === "/"; )
          ie++;
    for (var Ye, Fe = 0, ie = V.length - 1; ie >= 0; ie--)
      Ye = V[ie], Ye === "." ? V.splice(ie, 1) : Ye === ".." ? Fe++ : Fe > 0 && (Ye === "" ? (V.splice(ie + 1, Fe), Fe = 0) : (V.splice(ie, 2), Fe--));
    return A = V.join("/"), A === "" && (A = N ? "/" : "."), _ ? (_.path = A, s(_)) : A;
  });
  r.normalize = l;
  function c(k, A) {
    k === "" && (k = "."), A === "" && (A = ".");
    var _ = i(A), N = i(k);
    if (N && (k = N.path || "/"), _ && !_.scheme)
      return N && (_.scheme = N.scheme), s(_);
    if (_ || A.match(n))
      return A;
    if (N && !N.host && !N.path)
      return N.host = A, s(N);
    var V = A.charAt(0) === "/" ? A : l(k.replace(/\/+$/, "") + "/" + A);
    return N ? (N.path = V, s(N)) : V;
  }
  r.join = c, r.isAbsolute = function(k) {
    return k.charAt(0) === "/" || t.test(k);
  };
  function d(k, A) {
    k === "" && (k = "."), k = k.replace(/\/$/, "");
    for (var _ = 0; A.indexOf(k + "/") !== 0; ) {
      var N = k.lastIndexOf("/");
      if (N < 0 || (k = k.slice(0, N), k.match(/^([^\/]+:\/)?\/*$/)))
        return A;
      ++_;
    }
    return Array(_ + 1).join("../") + A.substr(k.length + 1);
  }
  r.relative = d;
  var f = function() {
    var k = /* @__PURE__ */ Object.create(null);
    return !("__proto__" in k);
  }();
  function h(k) {
    return k;
  }
  function g(k) {
    return y(k) ? "$" + k : k;
  }
  r.toSetString = f ? h : g;
  function m(k) {
    return y(k) ? k.slice(1) : k;
  }
  r.fromSetString = f ? h : m;
  function y(k) {
    if (!k)
      return !1;
    var A = k.length;
    if (A < 9 || k.charCodeAt(A - 1) !== 95 || k.charCodeAt(A - 2) !== 95 || k.charCodeAt(A - 3) !== 111 || k.charCodeAt(A - 4) !== 116 || k.charCodeAt(A - 5) !== 111 || k.charCodeAt(A - 6) !== 114 || k.charCodeAt(A - 7) !== 112 || k.charCodeAt(A - 8) !== 95 || k.charCodeAt(A - 9) !== 95)
      return !1;
    for (var _ = A - 10; _ >= 0; _--)
      if (k.charCodeAt(_) !== 36)
        return !1;
    return !0;
  }
  function x(k, A, _) {
    var N = C(k.source, A.source);
    return N !== 0 || (N = k.originalLine - A.originalLine, N !== 0) || (N = k.originalColumn - A.originalColumn, N !== 0 || _) || (N = k.generatedColumn - A.generatedColumn, N !== 0) || (N = k.generatedLine - A.generatedLine, N !== 0) ? N : C(k.name, A.name);
  }
  r.compareByOriginalPositions = x;
  function w(k, A, _) {
    var N;
    return N = k.originalLine - A.originalLine, N !== 0 || (N = k.originalColumn - A.originalColumn, N !== 0 || _) || (N = k.generatedColumn - A.generatedColumn, N !== 0) || (N = k.generatedLine - A.generatedLine, N !== 0) ? N : C(k.name, A.name);
  }
  r.compareByOriginalPositionsNoSource = w;
  function S(k, A, _) {
    var N = k.generatedLine - A.generatedLine;
    return N !== 0 || (N = k.generatedColumn - A.generatedColumn, N !== 0 || _) || (N = C(k.source, A.source), N !== 0) || (N = k.originalLine - A.originalLine, N !== 0) || (N = k.originalColumn - A.originalColumn, N !== 0) ? N : C(k.name, A.name);
  }
  r.compareByGeneratedPositionsDeflated = S;
  function E(k, A, _) {
    var N = k.generatedColumn - A.generatedColumn;
    return N !== 0 || _ || (N = C(k.source, A.source), N !== 0) || (N = k.originalLine - A.originalLine, N !== 0) || (N = k.originalColumn - A.originalColumn, N !== 0) ? N : C(k.name, A.name);
  }
  r.compareByGeneratedPositionsDeflatedNoLine = E;
  function C(k, A) {
    return k === A ? 0 : k === null ? 1 : A === null ? -1 : k > A ? 1 : -1;
  }
  function I(k, A) {
    var _ = k.generatedLine - A.generatedLine;
    return _ !== 0 || (_ = k.generatedColumn - A.generatedColumn, _ !== 0) || (_ = C(k.source, A.source), _ !== 0) || (_ = k.originalLine - A.originalLine, _ !== 0) || (_ = k.originalColumn - A.originalColumn, _ !== 0) ? _ : C(k.name, A.name);
  }
  r.compareByGeneratedPositionsInflated = I;
  function M(k) {
    return JSON.parse(k.replace(/^\)]}'[^\n]*\n/, ""));
  }
  r.parseSourceMapInput = M;
  function O(k, A, _) {
    if (A = A || "", k && (k[k.length - 1] !== "/" && A[0] !== "/" && (k += "/"), A = k + A), _) {
      var N = i(_);
      if (!N)
        throw new Error("sourceMapURL could not be parsed");
      if (N.path) {
        var V = N.path.lastIndexOf("/");
        V >= 0 && (N.path = N.path.substring(0, V + 1));
      }
      A = c(s(N), A);
    }
    return l(A);
  }
  r.computeSourceURL = O;
})(Ua);
var Lp = {}, au = Ua, ou = Object.prototype.hasOwnProperty, Wn = typeof Map < "u";
function ln() {
  this._array = [], this._set = Wn ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
}
ln.fromArray = function(r, e) {
  for (var t = new ln(), n = 0, i = r.length; n < i; n++)
    t.add(r[n], e);
  return t;
};
ln.prototype.size = function() {
  return Wn ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
ln.prototype.add = function(r, e) {
  var t = Wn ? r : au.toSetString(r), n = Wn ? this.has(r) : ou.call(this._set, t), i = this._array.length;
  (!n || e) && this._array.push(r), n || (Wn ? this._set.set(r, i) : this._set[t] = i);
};
ln.prototype.has = function(r) {
  if (Wn)
    return this._set.has(r);
  var e = au.toSetString(r);
  return ou.call(this._set, e);
};
ln.prototype.indexOf = function(r) {
  if (Wn) {
    var e = this._set.get(r);
    if (e >= 0)
      return e;
  } else {
    var t = au.toSetString(r);
    if (ou.call(this._set, t))
      return this._set[t];
  }
  throw new Error('"' + r + '" is not in the set.');
};
ln.prototype.at = function(r) {
  if (r >= 0 && r < this._array.length)
    return this._array[r];
  throw new Error("No element indexed by " + r);
};
ln.prototype.toArray = function() {
  return this._array.slice();
};
Lp.ArraySet = ln;
var Dp = {}, Ip = Ua;
function lk(r, e) {
  var t = r.generatedLine, n = e.generatedLine, i = r.generatedColumn, s = e.generatedColumn;
  return n > t || n == t && s >= i || Ip.compareByGeneratedPositionsInflated(r, e) <= 0;
}
function Ha() {
  this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
}
Ha.prototype.unsortedForEach = function(r, e) {
  this._array.forEach(r, e);
};
Ha.prototype.add = function(r) {
  lk(this._last, r) ? (this._last = r, this._array.push(r)) : (this._sorted = !1, this._array.push(r));
};
Ha.prototype.toArray = function() {
  return this._sorted || (this._array.sort(Ip.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
};
Dp.MappingList = Ha;
var Ai = ru, he = Ua, ma = Lp.ArraySet, ck = Dp.MappingList;
function ct(r) {
  r || (r = {}), this._file = he.getArg(r, "file", null), this._sourceRoot = he.getArg(r, "sourceRoot", null), this._skipValidation = he.getArg(r, "skipValidation", !1), this._ignoreInvalidMapping = he.getArg(r, "ignoreInvalidMapping", !1), this._sources = new ma(), this._names = new ma(), this._mappings = new ck(), this._sourcesContents = null;
}
ct.prototype._version = 3;
ct.fromSourceMap = function(r, e) {
  var t = r.sourceRoot, n = new ct(Object.assign(e || {}, {
    file: r.file,
    sourceRoot: t
  }));
  return r.eachMapping(function(i) {
    var s = {
      generated: {
        line: i.generatedLine,
        column: i.generatedColumn
      }
    };
    i.source != null && (s.source = i.source, t != null && (s.source = he.relative(t, s.source)), s.original = {
      line: i.originalLine,
      column: i.originalColumn
    }, i.name != null && (s.name = i.name)), n.addMapping(s);
  }), r.sources.forEach(function(i) {
    var s = i;
    t !== null && (s = he.relative(t, i)), n._sources.has(s) || n._sources.add(s);
    var a = r.sourceContentFor(i);
    a != null && n.setSourceContent(i, a);
  }), n;
};
ct.prototype.addMapping = function(r) {
  var e = he.getArg(r, "generated"), t = he.getArg(r, "original", null), n = he.getArg(r, "source", null), i = he.getArg(r, "name", null);
  !this._skipValidation && this._validateMapping(e, t, n, i) === !1 || (n != null && (n = String(n), this._sources.has(n) || this._sources.add(n)), i != null && (i = String(i), this._names.has(i) || this._names.add(i)), this._mappings.add({
    generatedLine: e.line,
    generatedColumn: e.column,
    originalLine: t != null && t.line,
    originalColumn: t != null && t.column,
    source: n,
    name: i
  }));
};
ct.prototype.setSourceContent = function(r, e) {
  var t = r;
  this._sourceRoot != null && (t = he.relative(this._sourceRoot, t)), e != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[he.toSetString(t)] = e) : this._sourcesContents && (delete this._sourcesContents[he.toSetString(t)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
};
ct.prototype.applySourceMap = function(r, e, t) {
  var n = e;
  if (e == null) {
    if (r.file == null)
      throw new Error(
        `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
      );
    n = r.file;
  }
  var i = this._sourceRoot;
  i != null && (n = he.relative(i, n));
  var s = new ma(), a = new ma();
  this._mappings.unsortedForEach(function(o) {
    if (o.source === n && o.originalLine != null) {
      var l = r.originalPositionFor({
        line: o.originalLine,
        column: o.originalColumn
      });
      l.source != null && (o.source = l.source, t != null && (o.source = he.join(t, o.source)), i != null && (o.source = he.relative(i, o.source)), o.originalLine = l.line, o.originalColumn = l.column, l.name != null && (o.name = l.name));
    }
    var c = o.source;
    c != null && !s.has(c) && s.add(c);
    var d = o.name;
    d != null && !a.has(d) && a.add(d);
  }, this), this._sources = s, this._names = a, r.sources.forEach(function(o) {
    var l = r.sourceContentFor(o);
    l != null && (t != null && (o = he.join(t, o)), i != null && (o = he.relative(i, o)), this.setSourceContent(o, l));
  }, this);
};
ct.prototype._validateMapping = function(r, e, t, n) {
  if (e && typeof e.line != "number" && typeof e.column != "number") {
    var i = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
    if (this._ignoreInvalidMapping)
      return typeof console < "u" && console.warn && console.warn(i), !1;
    throw new Error(i);
  }
  if (!(r && "line" in r && "column" in r && r.line > 0 && r.column >= 0 && !e && !t && !n)) {
    if (r && "line" in r && "column" in r && e && "line" in e && "column" in e && r.line > 0 && r.column >= 0 && e.line > 0 && e.column >= 0 && t)
      return;
    var i = "Invalid mapping: " + JSON.stringify({
      generated: r,
      source: t,
      original: e,
      name: n
    });
    if (this._ignoreInvalidMapping)
      return typeof console < "u" && console.warn && console.warn(i), !1;
    throw new Error(i);
  }
};
ct.prototype._serializeMappings = function() {
  for (var r = 0, e = 1, t = 0, n = 0, i = 0, s = 0, a = "", o, l, c, d, f = this._mappings.toArray(), h = 0, g = f.length; h < g; h++) {
    if (l = f[h], o = "", l.generatedLine !== e)
      for (r = 0; l.generatedLine !== e; )
        o += ";", e++;
    else if (h > 0) {
      if (!he.compareByGeneratedPositionsInflated(l, f[h - 1]))
        continue;
      o += ",";
    }
    o += Ai.encode(l.generatedColumn - r), r = l.generatedColumn, l.source != null && (d = this._sources.indexOf(l.source), o += Ai.encode(d - s), s = d, o += Ai.encode(l.originalLine - 1 - n), n = l.originalLine - 1, o += Ai.encode(l.originalColumn - t), t = l.originalColumn, l.name != null && (c = this._names.indexOf(l.name), o += Ai.encode(c - i), i = c)), a += o;
  }
  return a;
};
ct.prototype._generateSourcesContent = function(r, e) {
  return r.map(function(t) {
    if (!this._sourcesContents)
      return null;
    e != null && (t = he.relative(e, t));
    var n = he.toSetString(t);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
  }, this);
};
ct.prototype.toJSON = function() {
  var r = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  return this._file != null && (r.file = this._file), this._sourceRoot != null && (r.sourceRoot = this._sourceRoot), this._sourcesContents && (r.sourcesContent = this._generateSourcesContent(r.sources, r.sourceRoot)), r;
};
ct.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
};
var uk = ct;
const $d = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function dk(r) {
  const e = new uk(), t = {
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
  r.node = function(h) {
    if (h.loc && h.loc.start && $d.has(h.type)) {
      const g = h.loc.start.line, m = h.loc.start.column - 1;
      (n.line !== g || n.column !== m) && (n.line = g, n.column = m, t.line = a, t.column = o, l && (l = !1, (t.line !== i.line || t.column !== i.column) && e.addMapping(s)), l = !0, e.addMapping({
        source: h.loc.source,
        original: n,
        generated: t
      }));
    }
    c.call(this, h), l && $d.has(h.type) && (i.line = a, i.column = o);
  };
  const d = r.emit;
  r.emit = function(h, g, m) {
    for (let y = 0; y < h.length; y++)
      h.charCodeAt(y) === 10 ? (a++, o = 0) : o++;
    d(h, g, m);
  };
  const f = r.result;
  return r.result = function() {
    return l && e.addMapping(s), {
      css: f(),
      map: e
    };
  }, r;
}
const hk = 43, fk = 45, ol = (r, e) => {
  if (r === G && (r = e), typeof r == "string") {
    const t = r.charCodeAt(0);
    return t > 127 ? 32768 : t << 8;
  }
  return r;
}, Np = [
  [z, z],
  [z, K],
  [z, Ie],
  [z, Ue],
  [z, "-"],
  [z, $],
  [z, ce],
  [z, Y],
  [z, He],
  [z, xe],
  [me, z],
  [me, K],
  [me, Ie],
  [me, Ue],
  [me, "-"],
  [me, $],
  [me, ce],
  [me, Y],
  [me, He],
  [oe, z],
  [oe, K],
  [oe, Ie],
  [oe, Ue],
  [oe, "-"],
  [oe, $],
  [oe, ce],
  [oe, Y],
  [oe, He],
  [Y, z],
  [Y, K],
  [Y, Ie],
  [Y, Ue],
  [Y, "-"],
  [Y, $],
  [Y, ce],
  [Y, Y],
  [Y, He],
  ["#", z],
  ["#", K],
  ["#", Ie],
  ["#", Ue],
  ["#", "-"],
  ["#", $],
  ["#", ce],
  ["#", Y],
  ["#", He],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", z],
  ["-", K],
  ["-", Ie],
  ["-", Ue],
  ["-", "-"],
  ["-", $],
  ["-", ce],
  ["-", Y],
  ["-", He],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [$, z],
  [$, K],
  [$, Ie],
  [$, Ue],
  [$, $],
  [$, ce],
  [$, Y],
  [$, "%"],
  [$, He],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", z],
  ["@", K],
  ["@", Ie],
  ["@", Ue],
  ["@", "-"],
  ["@", He],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", $],
  [".", ce],
  [".", Y],
  ["+", $],
  ["+", ce],
  ["+", Y],
  ["/", "*"]
], pk = Np.concat([
  [z, oe],
  [Y, oe],
  [oe, oe],
  [me, xe],
  [me, Wt],
  [me, qe],
  [ce, ce],
  [ce, Y],
  [ce, K],
  [ce, "-"],
  [re, z],
  [re, K],
  [re, ce],
  [re, Y],
  [re, oe],
  [re, "-"]
]);
function Op(r) {
  const e = new Set(
    r.map(([t, n]) => ol(t) << 16 | ol(n))
  );
  return function(t, n, i) {
    const s = ol(n, i), a = i.charCodeAt(0);
    return (a === fk && n !== z && n !== K && n !== He || a === hk ? e.has(t << 16 | a << 8) : e.has(t << 16 | s)) && this.emit(" ", ue, !0), s;
  };
}
const gk = Op(Np), Mp = Op(pk), jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe: Mp,
  spec: gk
}, Symbol.toStringTag, { value: "Module" })), mk = 92;
function bk(r, e) {
  if (typeof e == "function") {
    let t = null;
    r.children.forEach((n) => {
      t !== null && e.call(this, t), this.node(n), t = n;
    });
    return;
  }
  r.children.forEach(this.node, this);
}
function yk(r) {
  $a(r, (e, t, n) => {
    this.token(e, r.slice(t, n));
  });
}
function vk(r) {
  const e = /* @__PURE__ */ new Map();
  for (let t in r.node) {
    const n = r.node[t];
    typeof (n.generate || n) == "function" && e.set(t, n.generate || n);
  }
  return function(t, n) {
    let i = "", s = 0, a = {
      node(l) {
        if (e.has(l.type))
          e.get(l.type).call(o, l);
        else
          throw new Error("Unknown node type: " + l.type);
      },
      tokenBefore: Mp,
      token(l, c) {
        s = this.tokenBefore(s, l, c), this.emit(c, l, !1), l === G && c.charCodeAt(0) === mk && this.emit(`
`, ue, !0);
      },
      emit(l) {
        i += l;
      },
      result() {
        return i;
      }
    };
    n && (typeof n.decorator == "function" && (a = n.decorator(a)), n.sourceMap && (a = dk(a)), n.mode in jd && (a.tokenBefore = jd[n.mode]));
    const o = {
      node: (l) => a.node(l),
      children: bk,
      token: (l, c) => a.token(l, c),
      tokenize: yk
    };
    return a.node(t), a.result();
  };
}
function wk(r) {
  return {
    fromPlainObject(e) {
      return r(e, {
        enter(t) {
          t.children && !(t.children instanceof ge) && (t.children = new ge().fromArray(t.children));
        }
      }), e;
    },
    toPlainObject(e) {
      return r(e, {
        leave(t) {
          t.children && t.children instanceof ge && (t.children = t.children.toArray());
        }
      }), e;
    }
  };
}
const { hasOwnProperty: lu } = Object.prototype, Ti = function() {
};
function Ud(r) {
  return typeof r == "function" ? r : Ti;
}
function Hd(r, e) {
  return function(t, n, i) {
    t.type === e && r.call(this, t, n, i);
  };
}
function xk(r, e) {
  const t = e.structure, n = [];
  for (const i in t) {
    if (lu.call(t, i) === !1)
      continue;
    let s = t[i];
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
    context: e.walkContext,
    fields: n
  } : null;
}
function kk(r) {
  const e = {};
  for (const t in r.node)
    if (lu.call(r.node, t)) {
      const n = r.node[t];
      if (!n.structure)
        throw new Error("Missed `structure` field in `" + t + "` node type definition");
      e[t] = xk(t, n);
    }
  return e;
}
function Vd(r, e) {
  const t = r.fields.slice(), n = r.context, i = typeof n == "string";
  return e && t.reverse(), function(s, a, o, l) {
    let c;
    i && (c = a[n], a[n] = s);
    for (const d of t) {
      const f = s[d.name];
      if (!d.nullable || f) {
        if (d.type === "list") {
          if (e ? f.reduceRight(l, !1) : f.reduce(l, !1))
            return !0;
        } else if (o(f))
          return !0;
      }
    }
    i && (a[n] = c);
  };
}
function Yd({
  StyleSheet: r,
  Atrule: e,
  Rule: t,
  Block: n,
  DeclarationList: i
}) {
  return {
    Atrule: {
      StyleSheet: r,
      Atrule: e,
      Rule: t,
      Block: n
    },
    Rule: {
      StyleSheet: r,
      Atrule: e,
      Rule: t,
      Block: n
    },
    Declaration: {
      StyleSheet: r,
      Atrule: e,
      Rule: t,
      Block: n,
      DeclarationList: i
    }
  };
}
function Sk(r) {
  const e = kk(r), t = {}, n = {}, i = Symbol("break-walk"), s = Symbol("skip-node");
  for (const c in e)
    lu.call(e, c) && e[c] !== null && (t[c] = Vd(e[c], !1), n[c] = Vd(e[c], !0));
  const a = Yd(t), o = Yd(n), l = function(c, d) {
    function f(w, S, E) {
      const C = h.call(x, w, S, E);
      return C === i ? !0 : C === s ? !1 : !!(m.hasOwnProperty(w.type) && m[w.type](w, x, f, y) || g.call(x, w, S, E) === i);
    }
    let h = Ti, g = Ti, m = t, y = (w, S, E, C) => w || f(S, E, C);
    const x = {
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
    if (typeof d == "function")
      h = d;
    else if (d && (h = Ud(d.enter), g = Ud(d.leave), d.reverse && (m = n), d.visit)) {
      if (a.hasOwnProperty(d.visit))
        m = d.reverse ? o[d.visit] : a[d.visit];
      else if (!e.hasOwnProperty(d.visit))
        throw new Error("Bad value `" + d.visit + "` for `visit` option (should be: " + Object.keys(e).sort().join(", ") + ")");
      h = Hd(h, d.visit), g = Hd(g, d.visit);
    }
    if (h === Ti && g === Ti)
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    f(c);
  };
  return l.break = i, l.skip = s, l.find = function(c, d) {
    let f = null;
    return l(c, function(h, g, m) {
      if (d.call(this, h, g, m))
        return f = h, i;
    }), f;
  }, l.findLast = function(c, d) {
    let f = null;
    return l(c, {
      reverse: !0,
      enter(h, g, m) {
        if (d.call(this, h, g, m))
          return f = h, i;
      }
    }), f;
  }, l.findAll = function(c, d) {
    const f = [];
    return l(c, function(h, g, m) {
      d.call(this, h, g, m) && f.push(h);
    }), f;
  }, l;
}
function Ak(r) {
  return r;
}
function Ek(r) {
  const { min: e, max: t, comma: n } = r;
  return e === 0 && t === 0 ? n ? "#?" : "*" : e === 0 && t === 1 ? "?" : e === 1 && t === 0 ? n ? "#" : "+" : e === 1 && t === 1 ? "" : (n ? "#" : "") + (e === t ? "{" + e + "}" : "{" + e + "," + (t !== 0 ? t : "") + "}");
}
function Ck(r) {
  switch (r.type) {
    case "Range":
      return " [" + (r.min === null ? "-∞" : r.min) + "," + (r.max === null ? "∞" : r.max) + "]";
    default:
      throw new Error("Unknown node type `" + r.type + "`");
  }
}
function Tk(r, e, t, n) {
  const i = r.combinator === " " || n ? r.combinator : " " + r.combinator + " ", s = r.terms.map((a) => cu(a, e, t, n)).join(i);
  return r.explicit || t ? (n || s[0] === "," ? "[" : "[ ") + s + (n ? "]" : " ]") : s;
}
function cu(r, e, t, n) {
  let i;
  switch (r.type) {
    case "Group":
      i = Tk(r, e, t, n) + (r.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return cu(r.term, e, t, n) + e(Ek(r), r);
    case "Type":
      i = "<" + r.name + (r.opts ? e(Ck(r.opts), r.opts) : "") + ">";
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
  return e(i, r);
}
function uu(r, e) {
  let t = Ak, n = !1, i = !1;
  return typeof e == "function" ? t = e : e && (n = !!e.forceBraces, i = !!e.compact, typeof e.decorate == "function" && (t = e.decorate)), cu(r, t, n, i);
}
const Gd = { offset: 0, line: 1, column: 1 };
function Lk(r, e) {
  const t = r.tokens, n = r.longestMatch, i = n < t.length && t[n].node || null, s = i !== e ? i : null;
  let a = 0, o = 0, l = 0, c = "", d, f;
  for (let h = 0; h < t.length; h++) {
    const g = t[h].value;
    h === n && (o = g.length, a = c.length), s !== null && t[h].node === s && (h <= n ? l++ : l = 0), c += g;
  }
  return n === t.length || l > 1 ? (d = js(s || e, "end") || Li(Gd, c), f = Li(d)) : (d = js(s, "start") || Li(js(e, "start") || Gd, c.slice(0, a)), f = js(s, "end") || Li(d, c.substr(a, o))), {
    css: c,
    mismatchOffset: a,
    mismatchLength: o,
    start: d,
    end: f
  };
}
function js(r, e) {
  const t = r && r.loc && r.loc[e];
  return t ? "line" in t ? Li(t) : t : null;
}
function Li({ offset: r, line: e, column: t }, n) {
  const i = {
    offset: r,
    line: e,
    column: t
  };
  if (n) {
    const s = n.split(/\n|\r\n?|\f/);
    i.offset += n.length, i.line += s.length - 1, i.column = s.length === 1 ? i.column + n.length : s.pop().length + 1;
  }
  return i;
}
const Ei = function(r, e) {
  const t = ja(
    "SyntaxReferenceError",
    r + (e ? " `" + e + "`" : "")
  );
  return t.reference = e, t;
}, Dk = function(r, e, t, n) {
  const i = ja("SyntaxMatchError", r), {
    css: s,
    mismatchOffset: a,
    mismatchLength: o,
    start: l,
    end: c
  } = Lk(n, t);
  return i.rawMessage = r, i.syntax = e ? uu(e) : "<generic>", i.css = s, i.mismatchOffset = a, i.mismatchLength = o, i.message = r + `
  syntax: ` + i.syntax + `
   value: ` + (s || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, l), i.loc = {
    source: t && t.loc && t.loc.source || "<unknown>",
    start: l,
    end: c
  }, i;
}, Us = /* @__PURE__ */ new Map(), wr = /* @__PURE__ */ new Map(), ba = 45, ll = Ik, Kd = Nk;
function du(r, e) {
  return e = e || 0, r.length - e >= 2 && r.charCodeAt(e) === ba && r.charCodeAt(e + 1) === ba;
}
function qp(r, e) {
  if (e = e || 0, r.length - e >= 3 && r.charCodeAt(e) === ba && r.charCodeAt(e + 1) !== ba) {
    const t = r.indexOf("-", e + 2);
    if (t !== -1)
      return r.substring(e, t + 1);
  }
  return "";
}
function Ik(r) {
  if (Us.has(r))
    return Us.get(r);
  const e = r.toLowerCase();
  let t = Us.get(e);
  if (t === void 0) {
    const n = du(e, 0), i = n ? "" : qp(e, 0);
    t = Object.freeze({
      basename: e.substr(i.length),
      name: e,
      prefix: i,
      vendor: i,
      custom: n
    });
  }
  return Us.set(r, t), t;
}
function Nk(r) {
  if (wr.has(r))
    return wr.get(r);
  let e = r, t = r[0];
  t === "/" ? t = r[1] === "/" ? "//" : "/" : t !== "_" && t !== "*" && t !== "$" && t !== "#" && t !== "+" && t !== "&" && (t = "");
  const n = du(e, t.length);
  if (!n && (e = e.toLowerCase(), wr.has(e))) {
    const o = wr.get(e);
    return wr.set(r, o), o;
  }
  const i = n ? "" : qp(e, t.length), s = e.substr(0, t.length + i.length), a = Object.freeze({
    basename: e.substr(s.length),
    name: e.substr(t.length),
    hack: t,
    vendor: i,
    prefix: s,
    custom: n
  });
  return wr.set(r, a), a;
}
const _p = [
  "initial",
  "inherit",
  "unset",
  "revert",
  "revert-layer"
], Xi = 43, Rt = 45, cl = 110, xr = !0, Ok = !1;
function Jl(r, e) {
  return r !== null && r.type === G && r.value.charCodeAt(0) === e;
}
function qi(r, e, t) {
  for (; r !== null && (r.type === ue || r.type === Be); )
    r = t(++e);
  return e;
}
function vn(r, e, t, n) {
  if (!r)
    return 0;
  const i = r.value.charCodeAt(e);
  if (i === Xi || i === Rt) {
    if (t)
      return 0;
    e++;
  }
  for (; e < r.value.length; e++)
    if (!ke(r.value.charCodeAt(e)))
      return 0;
  return n + 1;
}
function ul(r, e, t) {
  let n = !1, i = qi(r, e, t);
  if (r = t(i), r === null)
    return e;
  if (r.type !== $)
    if (Jl(r, Xi) || Jl(r, Rt)) {
      if (n = !0, i = qi(t(++i), i, t), r = t(i), r === null || r.type !== $)
        return 0;
    } else
      return e;
  if (!n) {
    const s = r.value.charCodeAt(0);
    if (s !== Xi && s !== Rt)
      return 0;
  }
  return vn(r, n ? 0 : 1, n, i);
}
function Mk(r, e) {
  let t = 0;
  if (!r)
    return 0;
  if (r.type === $)
    return vn(r, 0, Ok, t);
  if (r.type === z && r.value.charCodeAt(0) === Rt) {
    if (!Pr(r.value, 1, cl))
      return 0;
    switch (r.value.length) {
      case 2:
        return ul(e(++t), t, e);
      case 3:
        return r.value.charCodeAt(2) !== Rt ? 0 : (t = qi(e(++t), t, e), r = e(t), vn(r, 0, xr, t));
      default:
        return r.value.charCodeAt(2) !== Rt ? 0 : vn(r, 3, xr, t);
    }
  } else if (r.type === z || Jl(r, Xi) && e(t + 1).type === z) {
    if (r.type !== z && (r = e(++t)), r === null || !Pr(r.value, 0, cl))
      return 0;
    switch (r.value.length) {
      case 1:
        return ul(e(++t), t, e);
      case 2:
        return r.value.charCodeAt(1) !== Rt ? 0 : (t = qi(e(++t), t, e), r = e(t), vn(r, 0, xr, t));
      default:
        return r.value.charCodeAt(1) !== Rt ? 0 : vn(r, 2, xr, t);
    }
  } else if (r.type === Y) {
    let n = r.value.charCodeAt(0), i = n === Xi || n === Rt ? 1 : 0, s = i;
    for (; s < r.value.length && ke(r.value.charCodeAt(s)); s++)
      ;
    return s === i || !Pr(r.value, s, cl) ? 0 : s + 1 === r.value.length ? ul(e(++t), t, e) : r.value.charCodeAt(s + 1) !== Rt ? 0 : s + 2 === r.value.length ? (t = qi(e(++t), t, e), r = e(t), vn(r, 0, xr, t)) : vn(r, s + 2, xr, t);
  }
  return 0;
}
const qk = 43, zp = 45, Rp = 63, _k = 117;
function ec(r, e) {
  return r !== null && r.type === G && r.value.charCodeAt(0) === e;
}
function zk(r, e) {
  return r.value.charCodeAt(0) === e;
}
function Di(r, e, t) {
  let n = 0;
  for (let i = e; i < r.value.length; i++) {
    const s = r.value.charCodeAt(i);
    if (s === zp && t && n !== 0)
      return Di(r, e + n + 1, !1), 6;
    if (!Dn(s) || ++n > 6)
      return 0;
  }
  return n;
}
function Hs(r, e, t) {
  if (!r)
    return 0;
  for (; ec(t(e), Rp); ) {
    if (++r > 6)
      return 0;
    e++;
  }
  return e;
}
function Rk(r, e) {
  let t = 0;
  if (r === null || r.type !== z || !Pr(r.value, 0, _k) || (r = e(++t), r === null))
    return 0;
  if (ec(r, qk))
    return r = e(++t), r === null ? 0 : r.type === z ? Hs(Di(r, 0, !0), ++t, e) : ec(r, Rp) ? Hs(1, ++t, e) : 0;
  if (r.type === $) {
    const n = Di(r, 1, !0);
    return n === 0 ? 0 : (r = e(++t), r === null ? t : r.type === Y || r.type === $ ? !zk(r, zp) || !Di(r, 1, !1) ? 0 : t + 1 : Hs(n, t, e));
  }
  return r.type === Y ? Hs(Di(r, 1, !0), ++t, e) : 0;
}
const Pk = ["calc(", "-moz-calc(", "-webkit-calc("], hu = /* @__PURE__ */ new Map([
  [K, re],
  [xe, re],
  [Xe, At],
  [_e, lt]
]);
function xt(r, e) {
  return e < r.length ? r.charCodeAt(e) : 0;
}
function Pp(r, e) {
  return Zi(r, 0, r.length, e);
}
function Bp(r, e) {
  for (let t = 0; t < e.length; t++)
    if (Pp(r, e[t]))
      return !0;
  return !1;
}
function Fp(r, e) {
  return e !== r.length - 2 ? !1 : xt(r, e) === 92 && // U+005C REVERSE SOLIDUS (\)
  ke(xt(r, e + 1));
}
function Va(r, e, t) {
  if (r && r.type === "Range") {
    const n = Number(
      t !== void 0 && t !== e.length ? e.substr(0, t) : e
    );
    if (isNaN(n) || r.min !== null && n < r.min && typeof r.min != "string" || r.max !== null && n > r.max && typeof r.max != "string")
      return !0;
  }
  return !1;
}
function Bk(r, e) {
  let t = 0, n = [], i = 0;
  e:
    do {
      switch (r.type) {
        case lt:
        case re:
        case At:
          if (r.type !== t)
            break e;
          if (t = n.pop(), n.length === 0) {
            i++;
            break e;
          }
          break;
        case K:
        case xe:
        case Xe:
        case _e:
          n.push(t), t = hu.get(r.type);
          break;
      }
      i++;
    } while (r = e(i));
  return i;
}
function nt(r) {
  return function(e, t, n) {
    return e === null ? 0 : e.type === K && Bp(e.value, Pk) ? Bk(e, t) : r(e, t, n);
  };
}
function se(r) {
  return function(e) {
    return e === null || e.type !== r ? 0 : 1;
  };
}
function Fk(r) {
  if (r === null || r.type !== z)
    return 0;
  const e = r.value.toLowerCase();
  return Bp(e, _p) || Pp(e, "default") ? 0 : 1;
}
function $k(r) {
  return r === null || r.type !== z || xt(r.value, 0) !== 45 || xt(r.value, 1) !== 45 ? 0 : 1;
}
function jk(r) {
  if (r === null || r.type !== oe)
    return 0;
  const e = r.value.length;
  if (e !== 4 && e !== 5 && e !== 7 && e !== 9)
    return 0;
  for (let t = 1; t < e; t++)
    if (!Dn(xt(r.value, t)))
      return 0;
  return 1;
}
function Uk(r) {
  return r === null || r.type !== oe || !Xs(xt(r.value, 1), xt(r.value, 2), xt(r.value, 3)) ? 0 : 1;
}
function Hk(r, e) {
  if (!r)
    return 0;
  let t = 0, n = [], i = 0;
  e:
    do {
      switch (r.type) {
        case Ba:
        case Ue:
          break e;
        case lt:
        case re:
        case At:
          if (r.type !== t)
            break e;
          t = n.pop();
          break;
        case Ve:
          if (t === 0)
            break e;
          break;
        case G:
          if (t === 0 && r.value === "!")
            break e;
          break;
        case K:
        case xe:
        case Xe:
        case _e:
          n.push(t), t = hu.get(r.type);
          break;
      }
      i++;
    } while (r = e(i));
  return i;
}
function Vk(r, e) {
  if (!r)
    return 0;
  let t = 0, n = [], i = 0;
  e:
    do {
      switch (r.type) {
        case Ba:
        case Ue:
          break e;
        case lt:
        case re:
        case At:
          if (r.type !== t)
            break e;
          t = n.pop();
          break;
        case K:
        case xe:
        case Xe:
        case _e:
          n.push(t), t = hu.get(r.type);
          break;
      }
      i++;
    } while (r = e(i));
  return i;
}
function rn(r) {
  return r && (r = new Set(r)), function(e, t, n) {
    if (e === null || e.type !== Y)
      return 0;
    const i = Fa(e.value, 0);
    if (r !== null) {
      const s = e.value.indexOf("\\", i), a = s === -1 || !Fp(e.value, s) ? e.value.substr(i) : e.value.substring(i, s);
      if (r.has(a.toLowerCase()) === !1)
        return 0;
    }
    return Va(n, e.value, i) ? 0 : 1;
  };
}
function Yk(r, e, t) {
  return r === null || r.type !== ce || Va(t, r.value, r.value.length - 1) ? 0 : 1;
}
function $p(r) {
  return typeof r != "function" && (r = function() {
    return 0;
  }), function(e, t, n) {
    return e !== null && e.type === $ && Number(e.value) === 0 ? 1 : r(e, t, n);
  };
}
function Gk(r, e, t) {
  if (r === null)
    return 0;
  const n = Fa(r.value, 0);
  return n !== r.value.length && !Fp(r.value, n) || Va(t, r.value, n) ? 0 : 1;
}
function Kk(r, e, t) {
  if (r === null || r.type !== $)
    return 0;
  let n = xt(r.value, 0) === 43 || // U+002B PLUS SIGN (+)
  xt(r.value, 0) === 45 ? 1 : 0;
  for (; n < r.value.length; n++)
    if (!ke(xt(r.value, n)))
      return 0;
  return Va(t, r.value, n) ? 0 : 1;
}
const Wk = {
  "ident-token": se(z),
  "function-token": se(K),
  "at-keyword-token": se(me),
  "hash-token": se(oe),
  "string-token": se(Wt),
  "bad-string-token": se(Ba),
  "url-token": se(Ie),
  "bad-url-token": se(Ue),
  "delim-token": se(G),
  "number-token": se($),
  "percentage-token": se(ce),
  "dimension-token": se(Y),
  "whitespace-token": se(ue),
  "CDO-token": se(os),
  "CDC-token": se(He),
  "colon-token": se(qe),
  "semicolon-token": se(Ve),
  "comma-token": se(Qt),
  "[-token": se(Xe),
  "]-token": se(At),
  "(-token": se(xe),
  ")-token": se(re),
  "{-token": se(_e),
  "}-token": se(lt)
}, Qk = {
  // token type aliases
  string: se(Wt),
  ident: se(z),
  // percentage
  percentage: nt(Yk),
  // numeric
  zero: $p(),
  number: nt(Gk),
  integer: nt(Kk),
  // complex types
  "custom-ident": Fk,
  "custom-property-name": $k,
  "hex-color": jk,
  "id-selector": Uk,
  // element( <id-selector> )
  "an-plus-b": Mk,
  urange: Rk,
  "declaration-value": Hk,
  "any-value": Vk
};
function Zk(r) {
  const {
    angle: e,
    decibel: t,
    frequency: n,
    flex: i,
    length: s,
    resolution: a,
    semitones: o,
    time: l
  } = r || {};
  return {
    dimension: nt(rn(null)),
    angle: nt(rn(e)),
    decibel: nt(rn(t)),
    frequency: nt(rn(n)),
    flex: nt(rn(i)),
    length: nt($p(rn(s))),
    resolution: nt(rn(a)),
    semitones: nt(rn(o)),
    time: nt(rn(l))
  };
}
function Xk(r) {
  return H(H(H({}, Wk), Qk), Zk(r));
}
const Jk = [
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
], eS = ["deg", "grad", "rad", "turn"], tS = ["s", "ms"], nS = ["hz", "khz"], rS = ["dpi", "dpcm", "dppx", "x"], iS = ["fr"], sS = ["db"], aS = ["st"], Wd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angle: eS,
  decibel: sS,
  flex: iS,
  frequency: nS,
  length: Jk,
  resolution: rS,
  semitones: aS,
  time: tS
}, Symbol.toStringTag, { value: "Module" }));
function oS(r, e, t) {
  return Object.assign(ja("SyntaxError", r), {
    input: e,
    offset: t,
    rawMessage: r,
    message: r + `
  ` + e + `
--` + new Array((t || e.length) + 1).join("-") + "^"
  });
}
const lS = 9, cS = 10, uS = 12, dS = 13, hS = 32;
class fS {
  constructor(e) {
    this.str = e, this.pos = 0;
  }
  charCodeAt(e) {
    return e < this.str.length ? this.str.charCodeAt(e) : 0;
  }
  charCode() {
    return this.charCodeAt(this.pos);
  }
  nextCharCode() {
    return this.charCodeAt(this.pos + 1);
  }
  nextNonWsCode(e) {
    return this.charCodeAt(this.findWsEnd(e));
  }
  findWsEnd(e) {
    for (; e < this.str.length; e++) {
      const t = this.str.charCodeAt(e);
      if (t !== dS && t !== cS && t !== uS && t !== hS && t !== lS)
        break;
    }
    return e;
  }
  substringToPos(e) {
    return this.str.substring(this.pos, this.pos = e);
  }
  eat(e) {
    this.charCode() !== e && this.error("Expect `" + String.fromCharCode(e) + "`"), this.pos++;
  }
  peek() {
    return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
  }
  error(e) {
    throw new oS(e, this.str, this.pos);
  }
}
const pS = 9, gS = 10, mS = 12, bS = 13, yS = 32, jp = 33, fu = 35, Qd = 38, ya = 39, Up = 40, vS = 41, Hp = 42, pu = 43, gu = 44, Zd = 45, mu = 60, Vp = 62, tc = 63, wS = 64, Ya = 91, bu = 93, va = 123, Xd = 124, Jd = 125, eh = 8734, Ji = new Uint8Array(128).map(
  (r, e) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(e)) ? 1 : 0
), th = {
  " ": 1,
  "&&": 2,
  "||": 3,
  "|": 4
};
function wa(r) {
  return r.substringToPos(
    r.findWsEnd(r.pos)
  );
}
function Zr(r) {
  let e = r.pos;
  for (; e < r.str.length; e++) {
    const t = r.str.charCodeAt(e);
    if (t >= 128 || Ji[t] === 0)
      break;
  }
  return r.pos === e && r.error("Expect a keyword"), r.substringToPos(e);
}
function xa(r) {
  let e = r.pos;
  for (; e < r.str.length; e++) {
    const t = r.str.charCodeAt(e);
    if (t < 48 || t > 57)
      break;
  }
  return r.pos === e && r.error("Expect a number"), r.substringToPos(e);
}
function xS(r) {
  const e = r.str.indexOf("'", r.pos + 1);
  return e === -1 && (r.pos = r.str.length, r.error("Expect an apostrophe")), r.substringToPos(e + 1);
}
function nh(r) {
  let e = null, t = null;
  return r.eat(va), e = xa(r), r.charCode() === gu ? (r.pos++, r.charCode() !== Jd && (t = xa(r))) : t = e, r.eat(Jd), {
    min: Number(e),
    max: t ? Number(t) : 0
  };
}
function kS(r) {
  let e = null, t = !1;
  switch (r.charCode()) {
    case Hp:
      r.pos++, e = {
        min: 0,
        max: 0
      };
      break;
    case pu:
      r.pos++, e = {
        min: 1,
        max: 0
      };
      break;
    case tc:
      r.pos++, e = {
        min: 0,
        max: 1
      };
      break;
    case fu:
      r.pos++, t = !0, r.charCode() === va ? e = nh(r) : r.charCode() === tc ? (r.pos++, e = {
        min: 0,
        max: 0
      }) : e = {
        min: 1,
        max: 0
      };
      break;
    case va:
      e = nh(r);
      break;
    default:
      return null;
  }
  return {
    type: "Multiplier",
    comma: t,
    min: e.min,
    max: e.max,
    term: null
  };
}
function Xr(r, e) {
  const t = kS(r);
  return t !== null ? (t.term = e, r.charCode() === fu && r.charCodeAt(r.pos - 1) === pu ? Xr(r, t) : t) : e;
}
function dl(r) {
  const e = r.peek();
  return e === "" ? null : {
    type: "Token",
    value: e
  };
}
function SS(r) {
  let e;
  return r.eat(mu), r.eat(ya), e = Zr(r), r.eat(ya), r.eat(Vp), Xr(r, {
    type: "Property",
    name: e
  });
}
function AS(r) {
  let e = null, t = null, n = 1;
  return r.eat(Ya), r.charCode() === Zd && (r.peek(), n = -1), n == -1 && r.charCode() === eh ? r.peek() : (e = n * Number(xa(r)), Ji[r.charCode()] !== 0 && (e += Zr(r))), wa(r), r.eat(gu), wa(r), r.charCode() === eh ? r.peek() : (n = 1, r.charCode() === Zd && (r.peek(), n = -1), t = n * Number(xa(r)), Ji[r.charCode()] !== 0 && (t += Zr(r))), r.eat(bu), {
    type: "Range",
    min: e,
    max: t
  };
}
function ES(r) {
  let e, t = null;
  return r.eat(mu), e = Zr(r), r.charCode() === Up && r.nextCharCode() === vS && (r.pos += 2, e += "()"), r.charCodeAt(r.findWsEnd(r.pos)) === Ya && (wa(r), t = AS(r)), r.eat(Vp), Xr(r, {
    type: "Type",
    name: e,
    opts: t
  });
}
function CS(r) {
  const e = Zr(r);
  return r.charCode() === Up ? (r.pos++, {
    type: "Function",
    name: e
  }) : Xr(r, {
    type: "Keyword",
    name: e
  });
}
function TS(r, e) {
  function t(i, s) {
    return {
      type: "Group",
      terms: i,
      combinator: s,
      disallowEmpty: !1,
      explicit: !1
    };
  }
  let n;
  for (e = Object.keys(e).sort((i, s) => th[i] - th[s]); e.length > 0; ) {
    n = e.shift();
    let i = 0, s = 0;
    for (; i < r.length; i++) {
      const a = r[i];
      a.type === "Combinator" && (a.value === n ? (s === -1 && (s = i - 1), r.splice(i, 1), i--) : (s !== -1 && i - s > 1 && (r.splice(
        s,
        i - s,
        t(r.slice(s, i), n)
      ), i = s + 1), s = -1));
    }
    s !== -1 && e.length && r.splice(
      s,
      i - s,
      t(r.slice(s, i), n)
    );
  }
  return n;
}
function Yp(r) {
  const e = [], t = {};
  let n, i = null, s = r.pos;
  for (; n = DS(r); )
    n.type !== "Spaces" && (n.type === "Combinator" ? ((i === null || i.type === "Combinator") && (r.pos = s, r.error("Unexpected combinator")), t[n.value] = !0) : i !== null && i.type !== "Combinator" && (t[" "] = !0, e.push({
      type: "Combinator",
      value: " "
    })), e.push(n), i = n, s = r.pos);
  return i !== null && i.type === "Combinator" && (r.pos -= s, r.error("Unexpected combinator")), {
    type: "Group",
    terms: e,
    combinator: TS(e, t) || " ",
    disallowEmpty: !1,
    explicit: !1
  };
}
function LS(r) {
  let e;
  return r.eat(Ya), e = Yp(r), r.eat(bu), e.explicit = !0, r.charCode() === jp && (r.pos++, e.disallowEmpty = !0), e;
}
function DS(r) {
  let e = r.charCode();
  if (e < 128 && Ji[e] === 1)
    return CS(r);
  switch (e) {
    case bu:
      break;
    case Ya:
      return Xr(r, LS(r));
    case mu:
      return r.nextCharCode() === ya ? SS(r) : ES(r);
    case Xd:
      return {
        type: "Combinator",
        value: r.substringToPos(
          r.pos + (r.nextCharCode() === Xd ? 2 : 1)
        )
      };
    case Qd:
      return r.pos++, r.eat(Qd), {
        type: "Combinator",
        value: "&&"
      };
    case gu:
      return r.pos++, {
        type: "Comma"
      };
    case ya:
      return Xr(r, {
        type: "String",
        value: xS(r)
      });
    case yS:
    case pS:
    case gS:
    case bS:
    case mS:
      return {
        type: "Spaces",
        value: wa(r)
      };
    case wS:
      return e = r.nextCharCode(), e < 128 && Ji[e] === 1 ? (r.pos++, {
        type: "AtKeyword",
        name: Zr(r)
      }) : dl(r);
    case Hp:
    case pu:
    case tc:
    case fu:
    case jp:
      break;
    case va:
      if (e = r.nextCharCode(), e < 48 || e > 57)
        return dl(r);
      break;
    default:
      return dl(r);
  }
}
function Gp(r) {
  const e = new fS(r), t = Yp(e);
  return e.pos !== r.length && e.error("Unexpected input"), t.terms.length === 1 && t.terms[0].type === "Group" ? t.terms[0] : t;
}
const Ii = function() {
};
function rh(r) {
  return typeof r == "function" ? r : Ii;
}
function IS(r, e, t) {
  function n(a) {
    switch (i.call(t, a), a.type) {
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
    s.call(t, a);
  }
  let i = Ii, s = Ii;
  if (typeof e == "function" ? i = e : e && (i = rh(e.enter), s = rh(e.leave)), i === Ii && s === Ii)
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  n(r);
}
const NS = {
  decorator(r) {
    const e = [];
    let t = null;
    return Re(H({}, r), {
      node(n) {
        const i = t;
        t = n, r.node.call(this, n), t = i;
      },
      emit(n, i, s) {
        e.push({
          type: i,
          value: n,
          node: s ? null : t
        });
      },
      result() {
        return e;
      }
    });
  }
};
function OS(r) {
  const e = [];
  return $a(
    r,
    (t, n, i) => e.push({
      type: t,
      value: r.slice(n, i),
      node: null
    })
  ), e;
}
function MS(r, e) {
  return typeof r == "string" ? OS(r) : e.generate(r, NS);
}
const Z = { type: "Match" }, ne = { type: "Mismatch" }, yu = { type: "DisallowEmpty" }, qS = 40, _S = 41;
function De(r, e, t) {
  return e === Z && t === ne || r === Z && e === Z && t === Z ? r : (r.type === "If" && r.else === ne && e === Z && (e = r.then, r = r.match), {
    type: "If",
    match: r,
    then: e,
    else: t
  });
}
function Kp(r) {
  return r.length > 2 && r.charCodeAt(r.length - 2) === qS && r.charCodeAt(r.length - 1) === _S;
}
function ih(r) {
  return r.type === "Keyword" || r.type === "AtKeyword" || r.type === "Function" || r.type === "Type" && Kp(r.name);
}
function nc(r, e, t) {
  switch (r) {
    case " ": {
      let n = Z;
      for (let i = e.length - 1; i >= 0; i--) {
        const s = e[i];
        n = De(
          s,
          n,
          ne
        );
      }
      return n;
    }
    case "|": {
      let n = ne, i = null;
      for (let s = e.length - 1; s >= 0; s--) {
        let a = e[s];
        if (ih(a) && (i === null && s > 0 && ih(e[s - 1]) && (i = /* @__PURE__ */ Object.create(null), n = De(
          {
            type: "Enum",
            map: i
          },
          Z,
          n
        )), i !== null)) {
          const o = (Kp(a.name) ? a.name.slice(0, -1) : a.name).toLowerCase();
          if (!(o in i)) {
            i[o] = a;
            continue;
          }
        }
        i = null, n = De(
          a,
          Z,
          n
        );
      }
      return n;
    }
    case "&&": {
      if (e.length > 5)
        return {
          type: "MatchOnce",
          terms: e,
          all: !0
        };
      let n = ne;
      for (let i = e.length - 1; i >= 0; i--) {
        const s = e[i];
        let a;
        e.length > 1 ? a = nc(
          r,
          e.filter(function(o) {
            return o !== s;
          }),
          !1
        ) : a = Z, n = De(
          s,
          a,
          n
        );
      }
      return n;
    }
    case "||": {
      if (e.length > 5)
        return {
          type: "MatchOnce",
          terms: e,
          all: !1
        };
      let n = t ? Z : ne;
      for (let i = e.length - 1; i >= 0; i--) {
        const s = e[i];
        let a;
        e.length > 1 ? a = nc(
          r,
          e.filter(function(o) {
            return o !== s;
          }),
          !0
        ) : a = Z, n = De(
          s,
          a,
          n
        );
      }
      return n;
    }
  }
}
function zS(r) {
  let e = Z, t = vu(r.term);
  if (r.max === 0)
    t = De(
      t,
      yu,
      ne
    ), e = De(
      t,
      null,
      // will be a loop
      ne
    ), e.then = De(
      Z,
      Z,
      e
      // make a loop
    ), r.comma && (e.then.else = De(
      { type: "Comma", syntax: r },
      e,
      ne
    ));
  else
    for (let n = r.min || 1; n <= r.max; n++)
      r.comma && e !== Z && (e = De(
        { type: "Comma", syntax: r },
        e,
        ne
      )), e = De(
        t,
        De(
          Z,
          Z,
          e
        ),
        ne
      );
  if (r.min === 0)
    e = De(
      Z,
      Z,
      e
    );
  else
    for (let n = 0; n < r.min - 1; n++)
      r.comma && e !== Z && (e = De(
        { type: "Comma", syntax: r },
        e,
        ne
      )), e = De(
        t,
        e,
        ne
      );
  return e;
}
function vu(r) {
  if (typeof r == "function")
    return {
      type: "Generic",
      fn: r
    };
  switch (r.type) {
    case "Group": {
      let e = nc(
        r.combinator,
        r.terms.map(vu),
        !1
      );
      return r.disallowEmpty && (e = De(
        e,
        yu,
        ne
      )), e;
    }
    case "Multiplier":
      return zS(r);
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
function rc(r, e) {
  return typeof r == "string" && (r = Gp(r)), {
    type: "MatchGraph",
    match: vu(r),
    syntax: e || null,
    source: r
  };
}
const { hasOwnProperty: sh } = Object.prototype, RS = 0, PS = 1, ic = 2, Wp = 3, ah = "Match", BS = "Mismatch", FS = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", oh = 15e3;
function $S(r) {
  let e = null, t = null, n = r;
  for (; n !== null; )
    t = n.prev, n.prev = e, e = n, n = t;
  return e;
}
function hl(r, e) {
  if (r.length !== e.length)
    return !1;
  for (let t = 0; t < r.length; t++) {
    const n = e.charCodeAt(t);
    let i = r.charCodeAt(t);
    if (i >= 65 && i <= 90 && (i = i | 32), i !== n)
      return !1;
  }
  return !0;
}
function jS(r) {
  return r.type !== G ? !1 : r.value !== "?";
}
function lh(r) {
  return r === null ? !0 : r.type === Qt || r.type === K || r.type === xe || r.type === Xe || r.type === _e || jS(r);
}
function ch(r) {
  return r === null ? !0 : r.type === re || r.type === At || r.type === lt || r.type === G && r.value === "/";
}
function US(r, e, t) {
  function n() {
    do
      S++, w = S < r.length ? r[S] : null;
    while (w !== null && (w.type === ue || w.type === Be));
  }
  function i(I) {
    const M = S + I;
    return M < r.length ? r[M] : null;
  }
  function s(I, M) {
    return {
      nextState: I,
      matchStack: C,
      syntaxStack: f,
      thenStack: h,
      tokenIndex: S,
      prev: M
    };
  }
  function a(I) {
    h = {
      nextState: I,
      matchStack: C,
      syntaxStack: f,
      prev: h
    };
  }
  function o(I) {
    g = s(I, g);
  }
  function l() {
    C = {
      type: PS,
      syntax: e.syntax,
      token: w,
      prev: C
    }, n(), m = null, S > E && (E = S);
  }
  function c() {
    f = {
      syntax: e.syntax,
      opts: e.syntax.opts || f !== null && f.opts || null,
      prev: f
    }, C = {
      type: ic,
      syntax: e.syntax,
      token: C.token,
      prev: C
    };
  }
  function d() {
    C.type === ic ? C = C.prev : C = {
      type: Wp,
      syntax: f.syntax,
      token: C.token,
      prev: C
    }, f = f.prev;
  }
  let f = null, h = null, g = null, m = null, y = 0, x = null, w = null, S = -1, E = 0, C = {
    type: RS,
    syntax: null,
    token: null,
    prev: null
  };
  for (n(); x === null && ++y < oh; )
    switch (e.type) {
      case "Match":
        if (h === null) {
          if (w !== null && (S !== r.length - 1 || w.value !== "\\0" && w.value !== "\\9")) {
            e = ne;
            break;
          }
          x = ah;
          break;
        }
        if (e = h.nextState, e === yu)
          if (h.matchStack === C) {
            e = ne;
            break;
          } else
            e = Z;
        for (; h.syntaxStack !== f; )
          d();
        h = h.prev;
        break;
      case "Mismatch":
        if (m !== null && m !== !1)
          (g === null || S > g.tokenIndex) && (g = m, m = !1);
        else if (g === null) {
          x = BS;
          break;
        }
        e = g.nextState, h = g.thenStack, f = g.syntaxStack, C = g.matchStack, S = g.tokenIndex, w = S < r.length ? r[S] : null, g = g.prev;
        break;
      case "MatchGraph":
        e = e.match;
        break;
      case "If":
        e.else !== ne && o(e.else), e.then !== Z && a(e.then), e = e.match;
        break;
      case "MatchOnce":
        e = {
          type: "MatchOnceBuffer",
          syntax: e,
          index: 0,
          mask: 0
        };
        break;
      case "MatchOnceBuffer": {
        const O = e.syntax.terms;
        if (e.index === O.length) {
          if (e.mask === 0 || e.syntax.all) {
            e = ne;
            break;
          }
          e = Z;
          break;
        }
        if (e.mask === (1 << O.length) - 1) {
          e = Z;
          break;
        }
        for (; e.index < O.length; e.index++) {
          const k = 1 << e.index;
          if (!(e.mask & k)) {
            o(e), a({
              type: "AddMatchOnce",
              syntax: e.syntax,
              mask: e.mask | k
            }), e = O[e.index++];
            break;
          }
        }
        break;
      }
      case "AddMatchOnce":
        e = {
          type: "MatchOnceBuffer",
          syntax: e.syntax,
          index: 0,
          mask: e.mask
        };
        break;
      case "Enum":
        if (w !== null) {
          let O = w.value.toLowerCase();
          if (O.indexOf("\\") !== -1 && (O = O.replace(/\\[09].*$/, "")), sh.call(e.map, O)) {
            e = e.map[O];
            break;
          }
        }
        e = ne;
        break;
      case "Generic": {
        const O = f !== null ? f.opts : null, k = S + Math.floor(e.fn(w, i, O));
        if (!isNaN(k) && k > S) {
          for (; S < k; )
            l();
          e = Z;
        } else
          e = ne;
        break;
      }
      case "Type":
      case "Property": {
        const O = e.type === "Type" ? "types" : "properties", k = sh.call(t, O) ? t[O][e.name] : null;
        if (!k || !k.match)
          throw new Error(
            "Bad syntax reference: " + (e.type === "Type" ? "<" + e.name + ">" : "<'" + e.name + "'>")
          );
        if (m !== !1 && w !== null && e.type === "Type" && // https://drafts.csswg.org/css-values-4/#custom-idents
        // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
        // can only claim the keyword if no other unfulfilled production can claim it.
        (e.name === "custom-ident" && w.type === z || // https://drafts.csswg.org/css-values-4/#lengths
        // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
        // it must parse as a <number>
        e.name === "length" && w.value === "0")) {
          m === null && (m = s(e, g)), e = ne;
          break;
        }
        c(), e = k.match;
        break;
      }
      case "Keyword": {
        const O = e.name;
        if (w !== null) {
          let k = w.value;
          if (k.indexOf("\\") !== -1 && (k = k.replace(/\\[09].*$/, "")), hl(k, O)) {
            l(), e = Z;
            break;
          }
        }
        e = ne;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (w !== null && hl(w.value, e.name)) {
          l(), e = Z;
          break;
        }
        e = ne;
        break;
      case "Token":
        if (w !== null && w.value === e.value) {
          l(), e = Z;
          break;
        }
        e = ne;
        break;
      case "Comma":
        w !== null && w.type === Qt ? lh(C.token) ? e = ne : (l(), e = ch(w) ? ne : Z) : e = lh(C.token) || ch(w) ? Z : ne;
        break;
      case "String":
        let I = "", M = S;
        for (; M < r.length && I.length < e.value.length; M++)
          I += r[M].value;
        if (hl(I, e.value)) {
          for (; S < M; )
            l();
          e = Z;
        } else
          e = ne;
        break;
      default:
        throw new Error("Unknown node type: " + e.type);
    }
  switch (x) {
    case null:
      console.warn("[csstree-match] BREAK after " + oh + " iterations"), x = FS, C = null;
      break;
    case ah:
      for (; f !== null; )
        d();
      break;
    default:
      C = null;
  }
  return {
    tokens: r,
    reason: x,
    iterations: y,
    match: C,
    longestMatch: E
  };
}
function uh(r, e, t) {
  const n = US(r, e, t || {});
  if (n.match === null)
    return n;
  let i = n.match, s = n.match = {
    syntax: e.syntax || null,
    match: []
  };
  const a = [s];
  for (i = $S(i).prev; i !== null; ) {
    switch (i.type) {
      case ic:
        s.match.push(s = {
          syntax: i.syntax,
          match: []
        }), a.push(s);
        break;
      case Wp:
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
function Qp(r) {
  function e(i) {
    return i === null ? !1 : i.type === "Type" || i.type === "Property" || i.type === "Keyword";
  }
  function t(i) {
    if (Array.isArray(i.match)) {
      for (let s = 0; s < i.match.length; s++)
        if (t(i.match[s]))
          return e(i.syntax) && n.unshift(i.syntax), !0;
    } else if (i.node === r)
      return n = e(i.syntax) ? [i.syntax] : [], !0;
    return !1;
  }
  let n = null;
  return this.matched !== null && t(this.matched), n;
}
function HS(r, e) {
  return wu(this, r, (t) => t.type === "Type" && t.name === e);
}
function VS(r, e) {
  return wu(this, r, (t) => t.type === "Property" && t.name === e);
}
function YS(r) {
  return wu(this, r, (e) => e.type === "Keyword");
}
function wu(r, e, t) {
  const n = Qp.call(r, e);
  return n === null ? !1 : n.some(t);
}
const GS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getTrace: Qp,
  isKeyword: YS,
  isProperty: VS,
  isType: HS
}, Symbol.toStringTag, { value: "Module" }));
function Zp(r) {
  return "node" in r ? r.node : Zp(r.match[0]);
}
function Xp(r) {
  return "node" in r ? r.node : Xp(r.match[r.match.length - 1]);
}
function dh(r, e, t, n, i) {
  function s(o) {
    if (o.syntax !== null && o.syntax.type === n && o.syntax.name === i) {
      const l = Zp(o), c = Xp(o);
      r.syntax.walk(e, function(d, f, h) {
        if (d === l) {
          const g = new ge();
          do {
            if (g.appendData(f.data), f.data === c)
              break;
            f = f.next;
          } while (f !== null);
          a.push({
            parent: h,
            nodes: g
          });
        }
      });
    }
    Array.isArray(o.match) && o.match.forEach(s);
  }
  const a = [];
  return t.matched !== null && s(t.matched), a;
}
const { hasOwnProperty: _i } = Object.prototype;
function fl(r) {
  return typeof r == "number" && isFinite(r) && Math.floor(r) === r && r >= 0;
}
function hh(r) {
  return !!r && fl(r.offset) && fl(r.line) && fl(r.column);
}
function KS(r, e) {
  return function(t, n) {
    if (!t || t.constructor !== Object)
      return n(t, "Type of node should be an Object");
    for (let i in t) {
      let s = !0;
      if (_i.call(t, i) !== !1) {
        if (i === "type")
          t.type !== r && n(t, "Wrong node type `" + t.type + "`, expected `" + r + "`");
        else if (i === "loc") {
          if (t.loc === null)
            continue;
          if (t.loc && t.loc.constructor === Object)
            if (typeof t.loc.source != "string")
              i += ".source";
            else if (!hh(t.loc.start))
              i += ".start";
            else if (!hh(t.loc.end))
              i += ".end";
            else
              continue;
          s = !1;
        } else if (e.hasOwnProperty(i)) {
          s = !1;
          for (let a = 0; !s && a < e[i].length; a++) {
            const o = e[i][a];
            switch (o) {
              case String:
                s = typeof t[i] == "string";
                break;
              case Boolean:
                s = typeof t[i] == "boolean";
                break;
              case null:
                s = t[i] === null;
                break;
              default:
                typeof o == "string" ? s = t[i] && t[i].type === o : Array.isArray(o) && (s = t[i] instanceof ge);
            }
          }
        } else
          n(t, "Unknown field `" + i + "` for " + r + " node type");
        s || n(t, "Bad value for `" + r + "." + i + "`");
      }
    }
    for (const i in e)
      _i.call(e, i) && _i.call(t, i) === !1 && n(t, "Field `" + r + "." + i + "` is missed");
  };
}
function WS(r, e) {
  const t = e.structure, n = {
    type: String,
    loc: !0
  }, i = {
    type: '"' + r + '"'
  };
  for (const s in t) {
    if (_i.call(t, s) === !1)
      continue;
    const a = [], o = n[s] = Array.isArray(t[s]) ? t[s].slice() : [t[s]];
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
    check: KS(r, n)
  };
}
function QS(r) {
  const e = {};
  if (r.node) {
    for (const t in r.node)
      if (_i.call(r.node, t)) {
        const n = r.node[t];
        if (n.structure)
          e[t] = WS(t, n);
        else
          throw new Error("Missed `structure` field in `" + t + "` node type definition");
      }
  }
  return e;
}
const ZS = rc(_p.join(" | "));
function sc(r, e, t) {
  const n = {};
  for (const i in r)
    r[i].syntax && (n[i] = t ? r[i].syntax : uu(r[i].syntax, { compact: e }));
  return n;
}
function XS(r, e, t) {
  const n = {};
  for (const [i, s] of Object.entries(r))
    n[i] = {
      prelude: s.prelude && (t ? s.prelude.syntax : uu(s.prelude.syntax, { compact: e })),
      descriptors: s.descriptors && sc(s.descriptors, e, t)
    };
  return n;
}
function JS(r) {
  for (let e = 0; e < r.length; e++)
    if (r[e].value.toLowerCase() === "var(")
      return !0;
  return !1;
}
function mt(r, e, t) {
  return H({
    matched: r,
    iterations: t,
    error: e
  }, GS);
}
function kr(r, e, t, n) {
  const i = MS(t, r.syntax);
  let s;
  return JS(i) ? mt(null, new Error("Matching for a tree with var() is not supported")) : (n && (s = uh(i, r.cssWideKeywordsSyntax, r)), (!n || !s.match) && (s = uh(i, e.match, r), !s.match) ? mt(
    null,
    new Dk(s.reason, e.syntax, t, s),
    s.iterations
  ) : mt(s.match, null, s.iterations));
}
class fh {
  constructor(e, t, n) {
    if (this.cssWideKeywordsSyntax = ZS, this.syntax = t, this.generic = !1, this.units = H({}, Wd), this.atrules = /* @__PURE__ */ Object.create(null), this.properties = /* @__PURE__ */ Object.create(null), this.types = /* @__PURE__ */ Object.create(null), this.structure = n || QS(e), e) {
      if (e.units)
        for (const i of Object.keys(Wd))
          Array.isArray(e.units[i]) && (this.units[i] = e.units[i]);
      if (e.types)
        for (const i in e.types)
          this.addType_(i, e.types[i]);
      if (e.generic) {
        this.generic = !0;
        for (const [i, s] of Object.entries(Xk(this.units)))
          this.addType_(i, s);
      }
      if (e.atrules)
        for (const i in e.atrules)
          this.addAtrule_(i, e.atrules[i]);
      if (e.properties)
        for (const i in e.properties)
          this.addProperty_(i, e.properties[i]);
    }
  }
  checkStructure(e) {
    function t(s, a) {
      i.push({ node: s, message: a });
    }
    const n = this.structure, i = [];
    return this.syntax.walk(e, function(s) {
      n.hasOwnProperty(s.type) ? n[s.type].check(s, t) : t(s, "Unknown node type `" + s.type + "`");
    }), i.length ? i : !1;
  }
  createDescriptor(e, t, n, i = null) {
    const s = {
      type: t,
      name: n
    }, a = {
      type: t,
      name: n,
      parent: i,
      serializable: typeof e == "string" || e && typeof e.type == "string",
      syntax: null,
      match: null
    };
    return typeof e == "function" ? a.match = rc(e, s) : (typeof e == "string" ? Object.defineProperty(a, "syntax", {
      get() {
        return Object.defineProperty(a, "syntax", {
          value: Gp(e)
        }), a.syntax;
      }
    }) : a.syntax = e, Object.defineProperty(a, "match", {
      get() {
        return Object.defineProperty(a, "match", {
          value: rc(a.syntax, s)
        }), a.match;
      }
    })), a;
  }
  addAtrule_(e, t) {
    t && (this.atrules[e] = {
      type: "Atrule",
      name: e,
      prelude: t.prelude ? this.createDescriptor(t.prelude, "AtrulePrelude", e) : null,
      descriptors: t.descriptors ? Object.keys(t.descriptors).reduce(
        (n, i) => (n[i] = this.createDescriptor(t.descriptors[i], "AtruleDescriptor", i, e), n),
        /* @__PURE__ */ Object.create(null)
      ) : null
    });
  }
  addProperty_(e, t) {
    t && (this.properties[e] = this.createDescriptor(t, "Property", e));
  }
  addType_(e, t) {
    t && (this.types[e] = this.createDescriptor(t, "Type", e));
  }
  checkAtruleName(e) {
    if (!this.getAtrule(e))
      return new Ei("Unknown at-rule", "@" + e);
  }
  checkAtrulePrelude(e, t) {
    const n = this.checkAtruleName(e);
    if (n)
      return n;
    const i = this.getAtrule(e);
    if (!i.prelude && t)
      return new SyntaxError("At-rule `@" + e + "` should not contain a prelude");
    if (i.prelude && !t && !kr(this, i.prelude, "", !1).matched)
      return new SyntaxError("At-rule `@" + e + "` should contain a prelude");
  }
  checkAtruleDescriptorName(e, t) {
    const n = this.checkAtruleName(e);
    if (n)
      return n;
    const i = this.getAtrule(e), s = ll(t);
    if (!i.descriptors)
      return new SyntaxError("At-rule `@" + e + "` has no known descriptors");
    if (!i.descriptors[s.name] && !i.descriptors[s.basename])
      return new Ei("Unknown at-rule descriptor", t);
  }
  checkPropertyName(e) {
    if (!this.getProperty(e))
      return new Ei("Unknown property", e);
  }
  matchAtrulePrelude(e, t) {
    const n = this.checkAtrulePrelude(e, t);
    if (n)
      return mt(null, n);
    const i = this.getAtrule(e);
    return i.prelude ? kr(this, i.prelude, t || "", !1) : mt(null, null);
  }
  matchAtruleDescriptor(e, t, n) {
    const i = this.checkAtruleDescriptorName(e, t);
    if (i)
      return mt(null, i);
    const s = this.getAtrule(e), a = ll(t);
    return kr(this, s.descriptors[a.name] || s.descriptors[a.basename], n, !1);
  }
  matchDeclaration(e) {
    return e.type !== "Declaration" ? mt(null, new Error("Not a Declaration node")) : this.matchProperty(e.property, e.value);
  }
  matchProperty(e, t) {
    if (Kd(e).custom)
      return mt(null, new Error("Lexer matching doesn't applicable for custom properties"));
    const n = this.checkPropertyName(e);
    return n ? mt(null, n) : kr(this, this.getProperty(e), t, !0);
  }
  matchType(e, t) {
    const n = this.getType(e);
    return n ? kr(this, n, t, !1) : mt(null, new Ei("Unknown type", e));
  }
  match(e, t) {
    return typeof e != "string" && (!e || !e.type) ? mt(null, new Ei("Bad syntax")) : ((typeof e == "string" || !e.match) && (e = this.createDescriptor(e, "Type", "anonymous")), kr(this, e, t, !1));
  }
  findValueFragments(e, t, n, i) {
    return dh(this, t, this.matchProperty(e, t), n, i);
  }
  findDeclarationValueFragments(e, t, n) {
    return dh(this, e.value, this.matchDeclaration(e), t, n);
  }
  findAllFragments(e, t, n) {
    const i = [];
    return this.syntax.walk(e, {
      visit: "Declaration",
      enter: (s) => {
        i.push.apply(i, this.findDeclarationValueFragments(s, t, n));
      }
    }), i;
  }
  getAtrule(e, t = !0) {
    const n = ll(e);
    return (n.vendor && t ? this.atrules[n.name] || this.atrules[n.basename] : this.atrules[n.name]) || null;
  }
  getAtrulePrelude(e, t = !0) {
    const n = this.getAtrule(e, t);
    return n && n.prelude || null;
  }
  getAtruleDescriptor(e, t) {
    return this.atrules.hasOwnProperty(e) && this.atrules.declarators && this.atrules[e].declarators[t] || null;
  }
  getProperty(e, t = !0) {
    const n = Kd(e);
    return (n.vendor && t ? this.properties[n.name] || this.properties[n.basename] : this.properties[n.name]) || null;
  }
  getType(e) {
    return hasOwnProperty.call(this.types, e) ? this.types[e] : null;
  }
  validate() {
    function e(i, s, a, o) {
      if (a.has(s))
        return a.get(s);
      a.set(s, !1), o.syntax !== null && IS(o.syntax, function(l) {
        if (l.type !== "Type" && l.type !== "Property")
          return;
        const c = l.type === "Type" ? i.types : i.properties, d = l.type === "Type" ? t : n;
        (!hasOwnProperty.call(c, l.name) || e(i, l.name, d, c[l.name])) && a.set(s, !0);
      }, this);
    }
    let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
    for (const i in this.types)
      e(this, i, t, this.types[i]);
    for (const i in this.properties)
      e(this, i, n, this.properties[i]);
    return t = [...t.keys()].filter((i) => t.get(i)), n = [...n.keys()].filter((i) => n.get(i)), t.length || n.length ? {
      types: t,
      properties: n
    } : null;
  }
  dump(e, t) {
    return {
      generic: this.generic,
      units: this.units,
      types: sc(this.types, !t, e),
      properties: sc(this.properties, !t, e),
      atrules: XS(this.atrules, !t, e)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
}
function pl(r, e) {
  return typeof e == "string" && /^\s*\|/.test(e) ? typeof r == "string" ? r + e : e.replace(/^\s*\|\s*/, "") : e || null;
}
function ph(r, e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const [n, i] of Object.entries(r))
    if (i) {
      t[n] = {};
      for (const s of Object.keys(i))
        e.includes(s) && (t[n][s] = i[s]);
    }
  return t;
}
function ac(r, e) {
  const t = H({}, r);
  for (const [n, i] of Object.entries(e))
    switch (n) {
      case "generic":
        t[n] = !!i;
        break;
      case "units":
        t[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i))
          t[n][s] = Array.isArray(a) ? a : [];
        break;
      case "atrules":
        t[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i)) {
          const o = t[n][s] || {}, l = t[n][s] = {
            prelude: o.prelude || null,
            descriptors: H({}, o.descriptors)
          };
          if (a) {
            l.prelude = a.prelude ? pl(l.prelude, a.prelude) : l.prelude || null;
            for (const [c, d] of Object.entries(a.descriptors || {}))
              l.descriptors[c] = d ? pl(l.descriptors[c], d) : null;
            Object.keys(l.descriptors).length || (l.descriptors = null);
          }
        }
        break;
      case "types":
      case "properties":
        t[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i))
          t[n][s] = pl(t[n][s], a);
        break;
      case "scope":
        t[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i))
          t[n][s] = H(H({}, t[n][s]), a);
        break;
      case "parseContext":
        t[n] = H(H({}, r[n]), i);
        break;
      case "atrule":
      case "pseudo":
        t[n] = H(H({}, r[n]), ph(i, ["parse"]));
        break;
      case "node":
        t[n] = H(H({}, r[n]), ph(i, ["name", "structure", "parse", "generate", "walkContext"]));
        break;
    }
  return t;
}
function Jp(r) {
  const e = sk(r), t = Sk(r), n = vk(r), { fromPlainObject: i, toPlainObject: s } = wk(t), a = {
    lexer: null,
    createLexer: (o) => new fh(o, a, a.lexer.structure),
    tokenize: $a,
    parse: e,
    generate: n,
    walk: t,
    find: t.find,
    findLast: t.findLast,
    findAll: t.findAll,
    fromPlainObject: i,
    toPlainObject: s,
    fork(o) {
      const l = ac({}, r);
      return Jp(
        typeof o == "function" ? o(l, Object.assign) : ac(l, o)
      );
    }
  };
  return a.lexer = new fh({
    generic: !0,
    units: r.units,
    types: r.types,
    atrules: r.atrules,
    properties: r.properties,
    node: r.node
  }, a), a;
}
const eA = (r) => Jp(ac({}, r)), tA = {
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
}, Bt = 43, Ge = 45, ea = 110, $n = !0, nA = !1;
function ta(r, e) {
  let t = this.tokenStart + r;
  const n = this.charCodeAt(t);
  for ((n === Bt || n === Ge) && (e && this.error("Number sign is not allowed"), t++); t < this.tokenEnd; t++)
    ke(this.charCodeAt(t)) || this.error("Integer is expected", t);
}
function Dr(r) {
  return ta.call(this, 0, r);
}
function bn(r, e) {
  if (!this.cmpChar(this.tokenStart + r, e)) {
    let t = "";
    switch (e) {
      case ea:
        t = "N is expected";
        break;
      case Ge:
        t = "HyphenMinus is expected";
        break;
    }
    this.error(t, this.tokenStart + r);
  }
}
function gl() {
  let r = 0, e = 0, t = this.tokenType;
  for (; t === ue || t === Be; )
    t = this.lookupType(++r);
  if (t !== $)
    if (this.isDelim(Bt, r) || this.isDelim(Ge, r)) {
      e = this.isDelim(Bt, r) ? Bt : Ge;
      do
        t = this.lookupType(++r);
      while (t === ue || t === Be);
      t !== $ && (this.skip(r), Dr.call(this, $n));
    } else
      return null;
  return r > 0 && this.skip(r), e === 0 && (t = this.charCodeAt(this.tokenStart), t !== Bt && t !== Ge && this.error("Number sign is expected")), Dr.call(this, e !== 0), e === Ge ? "-" + this.consume($) : this.consume($);
}
const rA = "AnPlusB", iA = {
  a: [String, null],
  b: [String, null]
};
function eg() {
  const r = this.tokenStart;
  let e = null, t = null;
  if (this.tokenType === $)
    Dr.call(this, nA), t = this.consume($);
  else if (this.tokenType === z && this.cmpChar(this.tokenStart, Ge))
    switch (e = "-1", bn.call(this, 1, ea), this.tokenEnd - this.tokenStart) {
      case 2:
        this.next(), t = gl.call(this);
        break;
      case 3:
        bn.call(this, 2, Ge), this.next(), this.skipSC(), Dr.call(this, $n), t = "-" + this.consume($);
        break;
      default:
        bn.call(this, 2, Ge), ta.call(this, 3, $n), this.next(), t = this.substrToCursor(r + 2);
    }
  else if (this.tokenType === z || this.isDelim(Bt) && this.lookupType(1) === z) {
    let n = 0;
    switch (e = "1", this.isDelim(Bt) && (n = 1, this.next()), bn.call(this, 0, ea), this.tokenEnd - this.tokenStart) {
      case 1:
        this.next(), t = gl.call(this);
        break;
      case 2:
        bn.call(this, 1, Ge), this.next(), this.skipSC(), Dr.call(this, $n), t = "-" + this.consume($);
        break;
      default:
        bn.call(this, 1, Ge), ta.call(this, 2, $n), this.next(), t = this.substrToCursor(r + n + 1);
    }
  } else if (this.tokenType === Y) {
    const n = this.charCodeAt(this.tokenStart), i = n === Bt || n === Ge;
    let s = this.tokenStart + i;
    for (; s < this.tokenEnd && ke(this.charCodeAt(s)); s++)
      ;
    s === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), bn.call(this, s - this.tokenStart, ea), e = this.substring(r, s), s + 1 === this.tokenEnd ? (this.next(), t = gl.call(this)) : (bn.call(this, s - this.tokenStart + 1, Ge), s + 2 === this.tokenEnd ? (this.next(), this.skipSC(), Dr.call(this, $n), t = "-" + this.consume($)) : (ta.call(this, s - this.tokenStart + 2, $n), this.next(), t = this.substrToCursor(s + 1)));
  } else
    this.error();
  return e !== null && e.charCodeAt(0) === Bt && (e = e.substr(1)), t !== null && t.charCodeAt(0) === Bt && (t = t.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(r, this.tokenStart),
    a: e,
    b: t
  };
}
function sA(r) {
  if (r.a) {
    const e = r.a === "+1" && "n" || r.a === "1" && "n" || r.a === "-1" && "-n" || r.a + "n";
    if (r.b) {
      const t = r.b[0] === "-" || r.b[0] === "+" ? r.b : "+" + r.b;
      this.tokenize(e + t);
    } else
      this.tokenize(e);
  } else
    this.tokenize(r.b);
}
const aA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: sA,
  name: rA,
  parse: eg,
  structure: iA
}, Symbol.toStringTag, { value: "Module" }));
function gh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function oA() {
  for (let r = 1, e; e = this.lookupType(r); r++) {
    if (e === lt)
      return !0;
    if (e === _e || e === me)
      return !1;
  }
  return !1;
}
const lA = "Atrule", cA = "atrule", uA = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function tg(r = !1) {
  const e = this.tokenStart;
  let t, n, i = null, s = null;
  switch (this.eat(me), t = this.substrToCursor(e + 1), n = t.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== _e && this.tokenType !== Ve && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, t, r), gh) : i = gh.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case Ve:
      this.next();
      break;
    case _e:
      hasOwnProperty.call(this.atrule, n) && typeof this.atrule[n].block == "function" ? s = this.atrule[n].block.call(this, r) : s = this.Block(oA.call(this));
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(e, this.tokenStart),
    name: t,
    prelude: i,
    block: s
  };
}
function dA(r) {
  this.token(me, "@" + r.name), r.prelude !== null && this.node(r.prelude), r.block ? this.node(r.block) : this.token(Ve, ";");
}
const hA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: dA,
  name: lA,
  parse: tg,
  structure: uA,
  walkContext: cA
}, Symbol.toStringTag, { value: "Module" })), fA = "AtrulePrelude", pA = "atrulePrelude", gA = {
  children: [[]]
};
function ng(r) {
  let e = null;
  return r !== null && (r = r.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, r) && typeof this.atrule[r].prelude == "function" ? e = this.atrule[r].prelude.call(this) : e = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== _e && this.tokenType !== Ve && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function mA(r) {
  this.children(r);
}
const bA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: mA,
  name: fA,
  parse: ng,
  structure: gA,
  walkContext: pA
}, Symbol.toStringTag, { value: "Module" })), yA = 36, rg = 42, na = 61, vA = 94, oc = 124, wA = 126;
function xA() {
  this.eof && this.error("Unexpected end of input");
  const r = this.tokenStart;
  let e = !1;
  return this.isDelim(rg) ? (e = !0, this.next()) : this.isDelim(oc) || this.eat(z), this.isDelim(oc) ? this.charCodeAt(this.tokenStart + 1) !== na ? (this.next(), this.eat(z)) : e && this.error("Identifier is expected", this.tokenEnd) : e && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function kA() {
  const r = this.tokenStart, e = this.charCodeAt(r);
  return e !== na && // =
  e !== wA && // ~=
  e !== vA && // ^=
  e !== yA && // $=
  e !== rg && // *=
  e !== oc && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), e !== na && (this.isDelim(na) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(r);
}
const SA = "AttributeSelector", AA = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function ig() {
  const r = this.tokenStart;
  let e, t = null, n = null, i = null;
  return this.eat(Xe), this.skipSC(), e = xA.call(this), this.skipSC(), this.tokenType !== At && (this.tokenType !== z && (t = kA.call(this), this.skipSC(), n = this.tokenType === Wt ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === z && (i = this.consume(z), this.skipSC())), this.eat(At), {
    type: "AttributeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    matcher: t,
    value: n,
    flags: i
  };
}
function EA(r) {
  this.token(G, "["), this.node(r.name), r.matcher !== null && (this.tokenize(r.matcher), this.node(r.value)), r.flags !== null && this.token(z, r.flags), this.token(G, "]");
}
const CA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: EA,
  name: SA,
  parse: ig,
  structure: AA
}, Symbol.toStringTag, { value: "Module" })), TA = 38;
function sg(r) {
  return this.Raw(r, null, !0);
}
function mh() {
  return this.parseWithFallback(this.Rule, sg);
}
function bh(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
function LA() {
  if (this.tokenType === Ve)
    return bh.call(this, this.tokenIndex);
  const r = this.parseWithFallback(this.Declaration, bh);
  return this.tokenType === Ve && this.next(), r;
}
const DA = "Block", IA = "block", NA = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function ag(r) {
  const e = r ? LA : mh, t = this.tokenStart;
  let n = this.createList();
  this.eat(_e);
  e:
    for (; !this.eof; )
      switch (this.tokenType) {
        case lt:
          break e;
        case ue:
        case Be:
          this.next();
          break;
        case me:
          n.push(this.parseWithFallback(this.Atrule.bind(this, r), sg));
          break;
        default:
          r && this.isDelim(TA) ? n.push(mh.call(this)) : n.push(e.call(this));
      }
  return this.eof || this.eat(lt), {
    type: "Block",
    loc: this.getLocation(t, this.tokenStart),
    children: n
  };
}
function OA(r) {
  this.token(_e, "{"), this.children(r, (e) => {
    e.type === "Declaration" && this.token(Ve, ";");
  }), this.token(lt, "}");
}
const MA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OA,
  name: DA,
  parse: ag,
  structure: NA,
  walkContext: IA
}, Symbol.toStringTag, { value: "Module" })), qA = "Brackets", _A = {
  children: [[]]
};
function og(r, e) {
  const t = this.tokenStart;
  let n = null;
  return this.eat(Xe), n = r.call(this, e), this.eof || this.eat(At), {
    type: "Brackets",
    loc: this.getLocation(t, this.tokenStart),
    children: n
  };
}
function zA(r) {
  this.token(G, "["), this.children(r), this.token(G, "]");
}
const RA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: zA,
  name: qA,
  parse: og,
  structure: _A
}, Symbol.toStringTag, { value: "Module" })), PA = "CDC", BA = [];
function lg() {
  const r = this.tokenStart;
  return this.eat(He), {
    type: "CDC",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function FA() {
  this.token(He, "-->");
}
const $A = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: FA,
  name: PA,
  parse: lg,
  structure: BA
}, Symbol.toStringTag, { value: "Module" })), jA = "CDO", UA = [];
function cg() {
  const r = this.tokenStart;
  return this.eat(os), {
    type: "CDO",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function HA() {
  this.token(os, "<!--");
}
const VA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: HA,
  name: jA,
  parse: cg,
  structure: UA
}, Symbol.toStringTag, { value: "Module" })), YA = 46, GA = "ClassSelector", KA = {
  name: String
};
function ug() {
  return this.eatDelim(YA), {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(z)
  };
}
function WA(r) {
  this.token(G, "."), this.token(z, r.name);
}
const QA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: WA,
  name: GA,
  parse: ug,
  structure: KA
}, Symbol.toStringTag, { value: "Module" })), ZA = 43, yh = 47, XA = 62, JA = 126, eE = "Combinator", tE = {
  name: String
};
function dg() {
  const r = this.tokenStart;
  let e;
  switch (this.tokenType) {
    case ue:
      e = " ";
      break;
    case G:
      switch (this.charCodeAt(this.tokenStart)) {
        case XA:
        case ZA:
        case JA:
          this.next();
          break;
        case yh:
          this.next(), this.eatIdent("deep"), this.eatDelim(yh);
          break;
        default:
          this.error("Combinator is expected");
      }
      e = this.substrToCursor(r);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(r, this.tokenStart),
    name: e
  };
}
function nE(r) {
  this.tokenize(r.name);
}
const rE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nE,
  name: eE,
  parse: dg,
  structure: tE
}, Symbol.toStringTag, { value: "Module" })), iE = 42, sE = 47, aE = "Comment", oE = {
  value: String
};
function hg() {
  const r = this.tokenStart;
  let e = this.tokenEnd;
  return this.eat(Be), e - r + 2 >= 2 && this.charCodeAt(e - 2) === iE && this.charCodeAt(e - 1) === sE && (e -= 2), {
    type: "Comment",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substring(r + 2, e)
  };
}
function lE(r) {
  this.token(Be, "/*" + r.value + "*/");
}
const cE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lE,
  name: aE,
  parse: hg,
  structure: oE
}, Symbol.toStringTag, { value: "Module" })), fg = 33, uE = 35, dE = 36, hE = 38, fE = 42, pE = 43, vh = 47;
function gE(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function mE(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function bE() {
  const r = this.tokenIndex, e = this.Value();
  return e.type !== "Raw" && this.eof === !1 && this.tokenType !== Ve && this.isDelim(fg) === !1 && this.isBalanceEdge(r) === !1 && this.error(), e;
}
const yE = "Declaration", vE = "declaration", wE = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function pg() {
  const r = this.tokenStart, e = this.tokenIndex, t = kE.call(this), n = du(t), i = n ? this.parseCustomProperty : this.parseValue, s = n ? mE : gE;
  let a = !1, o;
  this.skipSC(), this.eat(qe);
  const l = this.tokenIndex;
  if (n || this.skipSC(), i ? o = this.parseWithFallback(bE, s) : o = s.call(this, this.tokenIndex), n && o.type === "Value" && o.children.isEmpty) {
    for (let c = l - this.tokenIndex; c <= 0; c++)
      if (this.lookupType(c) === ue) {
        o.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
  }
  return this.isDelim(fg) && (a = SE.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== Ve && this.isBalanceEdge(e) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(r, this.tokenStart),
    important: a,
    property: t,
    value: o
  };
}
function xE(r) {
  this.token(z, r.property), this.token(qe, ":"), this.node(r.value), r.important && (this.token(G, "!"), this.token(z, r.important === !0 ? "important" : r.important));
}
function kE() {
  const r = this.tokenStart;
  if (this.tokenType === G)
    switch (this.charCodeAt(this.tokenStart)) {
      case fE:
      case dE:
      case pE:
      case uE:
      case hE:
        this.next();
        break;
      case vh:
        this.next(), this.isDelim(vh) && this.next();
        break;
    }
  return this.tokenType === oe ? this.eat(oe) : this.eat(z), this.substrToCursor(r);
}
function SE() {
  this.eat(G), this.skipSC();
  const r = this.consume(z);
  return r === "important" ? !0 : r;
}
const AE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xE,
  name: yE,
  parse: pg,
  structure: wE,
  walkContext: vE
}, Symbol.toStringTag, { value: "Module" })), EE = 38;
function ml(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
const CE = "DeclarationList", TE = {
  children: [[
    "Declaration",
    "Atrule",
    "Rule"
  ]]
};
function gg() {
  const r = this.createList();
  for (; !this.eof; )
    switch (this.tokenType) {
      case ue:
      case Be:
      case Ve:
        this.next();
        break;
      case me:
        r.push(this.parseWithFallback(this.Atrule.bind(this, !0), ml));
        break;
      default:
        this.isDelim(EE) ? r.push(this.parseWithFallback(this.Rule, ml)) : r.push(this.parseWithFallback(this.Declaration, ml));
    }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function LE(r) {
  this.children(r, (e) => {
    e.type === "Declaration" && this.token(Ve, ";");
  });
}
const DE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: LE,
  name: CE,
  parse: gg,
  structure: TE
}, Symbol.toStringTag, { value: "Module" })), IE = "Dimension", NE = {
  value: String,
  unit: String
};
function mg() {
  const r = this.tokenStart, e = this.consumeNumber(Y);
  return {
    type: "Dimension",
    loc: this.getLocation(r, this.tokenStart),
    value: e,
    unit: this.substring(r + e.length, this.tokenStart)
  };
}
function OE(r) {
  this.token(Y, r.value + r.unit);
}
const ME = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OE,
  name: IE,
  parse: mg,
  structure: NE
}, Symbol.toStringTag, { value: "Module" })), qE = "Function", _E = "function", zE = {
  name: String,
  children: [[]]
};
function bg(r, e) {
  const t = this.tokenStart, n = this.consumeFunctionName(), i = n.toLowerCase();
  let s;
  return s = e.hasOwnProperty(i) ? e[i].call(this, e) : r.call(this, e), this.eof || this.eat(re), {
    type: "Function",
    loc: this.getLocation(t, this.tokenStart),
    name: n,
    children: s
  };
}
function RE(r) {
  this.token(K, r.name + "("), this.children(r), this.token(re, ")");
}
const PE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: RE,
  name: qE,
  parse: bg,
  structure: zE,
  walkContext: _E
}, Symbol.toStringTag, { value: "Module" })), BE = "XXX", FE = "Hash", $E = {
  value: String
};
function yg() {
  const r = this.tokenStart;
  return this.eat(oe), {
    type: "Hash",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r + 1)
  };
}
function jE(r) {
  this.token(oe, "#" + r.value);
}
const UE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: jE,
  name: FE,
  parse: yg,
  structure: $E,
  xxx: BE
}, Symbol.toStringTag, { value: "Module" })), HE = "Identifier", VE = {
  name: String
};
function vg() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(z)
  };
}
function YE(r) {
  this.token(z, r.name);
}
const GE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: YE,
  name: HE,
  parse: vg,
  structure: VE
}, Symbol.toStringTag, { value: "Module" })), KE = "IdSelector", WE = {
  name: String
};
function wg() {
  const r = this.tokenStart;
  return this.eat(oe), {
    type: "IdSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r + 1)
  };
}
function QE(r) {
  this.token(G, "#" + r.name);
}
const ZE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: QE,
  name: KE,
  parse: wg,
  structure: WE
}, Symbol.toStringTag, { value: "Module" })), XE = "MediaFeature", JE = {
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", null]
};
function xg() {
  const r = this.tokenStart;
  let e, t = null;
  if (this.eat(xe), this.skipSC(), e = this.consume(z), this.skipSC(), this.tokenType !== re) {
    switch (this.eat(qe), this.skipSC(), this.tokenType) {
      case $:
        this.lookupNonWSType(1) === G ? t = this.Ratio() : t = this.Number();
        break;
      case Y:
        t = this.Dimension();
        break;
      case z:
        t = this.Identifier();
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  return this.eat(re), {
    type: "MediaFeature",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    value: t
  };
}
function eC(r) {
  this.token(xe, "("), this.token(z, r.name), r.value !== null && (this.token(qe, ":"), this.node(r.value)), this.token(re, ")");
}
const tC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: eC,
  name: XE,
  parse: xg,
  structure: JE
}, Symbol.toStringTag, { value: "Module" })), nC = "MediaQuery", rC = {
  children: [[
    "Identifier",
    "MediaFeature",
    "WhiteSpace"
  ]]
};
function kg() {
  const r = this.createList();
  let e = null;
  this.skipSC();
  e:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case Be:
        case ue:
          this.next();
          continue;
        case z:
          e = this.Identifier();
          break;
        case xe:
          e = this.MediaFeature();
          break;
        default:
          break e;
      }
      r.push(e);
    }
  return e === null && this.error("Identifier or parenthesis is expected"), {
    type: "MediaQuery",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function iC(r) {
  this.children(r);
}
const sC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: iC,
  name: nC,
  parse: kg,
  structure: rC
}, Symbol.toStringTag, { value: "Module" })), aC = "MediaQueryList", oC = {
  children: [[
    "MediaQuery"
  ]]
};
function Sg() {
  const r = this.createList();
  for (this.skipSC(); !this.eof && (r.push(this.MediaQuery()), this.tokenType === Qt); )
    this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function lC(r) {
  this.children(r, () => this.token(Qt, ","));
}
const cC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lC,
  name: aC,
  parse: Sg,
  structure: oC
}, Symbol.toStringTag, { value: "Module" })), uC = 38, dC = "NestingSelector", hC = {};
function Ag() {
  const r = this.tokenStart;
  return this.eatDelim(uC), {
    type: "NestingSelector",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function fC() {
  this.token(G, "&");
}
const pC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: fC,
  name: dC,
  parse: Ag,
  structure: hC
}, Symbol.toStringTag, { value: "Module" })), gC = "Nth", mC = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function Eg() {
  this.skipSC();
  const r = this.tokenStart;
  let e = r, t = null, n;
  return this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? n = this.Identifier() : n = this.AnPlusB(), e = this.tokenStart, this.skipSC(), this.lookupValue(0, "of") && (this.next(), t = this.SelectorList(), e = this.tokenStart), {
    type: "Nth",
    loc: this.getLocation(r, e),
    nth: n,
    selector: t
  };
}
function bC(r) {
  this.node(r.nth), r.selector !== null && (this.token(z, "of"), this.node(r.selector));
}
const yC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: bC,
  name: gC,
  parse: Eg,
  structure: mC
}, Symbol.toStringTag, { value: "Module" })), vC = "Number", wC = {
  value: String
};
function Cg() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume($)
  };
}
function xC(r) {
  this.token($, r.value);
}
const kC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xC,
  name: vC,
  parse: Cg,
  structure: wC
}, Symbol.toStringTag, { value: "Module" })), SC = "Operator", AC = {
  value: String
};
function Tg() {
  const r = this.tokenStart;
  return this.next(), {
    type: "Operator",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r)
  };
}
function EC(r) {
  this.tokenize(r.value);
}
const CC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: EC,
  name: SC,
  parse: Tg,
  structure: AC
}, Symbol.toStringTag, { value: "Module" })), TC = "Parentheses", LC = {
  children: [[]]
};
function Lg(r, e) {
  const t = this.tokenStart;
  let n = null;
  return this.eat(xe), n = r.call(this, e), this.eof || this.eat(re), {
    type: "Parentheses",
    loc: this.getLocation(t, this.tokenStart),
    children: n
  };
}
function DC(r) {
  this.token(xe, "("), this.children(r), this.token(re, ")");
}
const IC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: DC,
  name: TC,
  parse: Lg,
  structure: LC
}, Symbol.toStringTag, { value: "Module" })), NC = "Percentage", OC = {
  value: String
};
function Dg() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(ce)
  };
}
function MC(r) {
  this.token(ce, r.value + "%");
}
const qC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: MC,
  name: NC,
  parse: Dg,
  structure: OC
}, Symbol.toStringTag, { value: "Module" })), _C = "PseudoClassSelector", zC = "function", RC = {
  name: String,
  children: [["Raw"], null]
};
function Ig() {
  const r = this.tokenStart;
  let e = null, t, n;
  return this.eat(qe), this.tokenType === K ? (t = this.consumeFunctionName(), n = t.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), e = this.pseudo[n].call(this), this.skipSC()) : (e = this.createList(), e.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(re)) : t = this.consume(z), {
    type: "PseudoClassSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: t,
    children: e
  };
}
function PC(r) {
  this.token(qe, ":"), r.children === null ? this.token(z, r.name) : (this.token(K, r.name + "("), this.children(r), this.token(re, ")"));
}
const BC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: PC,
  name: _C,
  parse: Ig,
  structure: RC,
  walkContext: zC
}, Symbol.toStringTag, { value: "Module" })), FC = "PseudoElementSelector", $C = "function", jC = {
  name: String,
  children: [["Raw"], null]
};
function Ng() {
  const r = this.tokenStart;
  let e = null, t, n;
  return this.eat(qe), this.eat(qe), this.tokenType === K ? (t = this.consumeFunctionName(), n = t.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), e = this.pseudo[n].call(this), this.skipSC()) : (e = this.createList(), e.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(re)) : t = this.consume(z), {
    type: "PseudoElementSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: t,
    children: e
  };
}
function UC(r) {
  this.token(qe, ":"), this.token(qe, ":"), r.children === null ? this.token(z, r.name) : (this.token(K, r.name + "("), this.children(r), this.token(re, ")"));
}
const HC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: UC,
  name: FC,
  parse: Ng,
  structure: jC,
  walkContext: $C
}, Symbol.toStringTag, { value: "Module" })), VC = 47, YC = 46;
function wh() {
  this.skipSC();
  const r = this.consume($);
  for (let e = 0; e < r.length; e++) {
    const t = r.charCodeAt(e);
    !ke(t) && t !== YC && this.error("Unsigned number is expected", this.tokenStart - r.length + e);
  }
  return Number(r) === 0 && this.error("Zero number is not allowed", this.tokenStart - r.length), r;
}
const GC = "Ratio", KC = {
  left: String,
  right: String
};
function Og() {
  const r = this.tokenStart, e = wh.call(this);
  let t;
  return this.skipSC(), this.eatDelim(VC), t = wh.call(this), {
    type: "Ratio",
    loc: this.getLocation(r, this.tokenStart),
    left: e,
    right: t
  };
}
function WC(r) {
  this.token($, r.left), this.token(G, "/"), this.token($, r.right);
}
const QC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: WC,
  name: GC,
  parse: Og,
  structure: KC
}, Symbol.toStringTag, { value: "Module" }));
function ZC() {
  return this.tokenIndex > 0 && this.lookupType(-1) === ue ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
const XC = "Raw", JC = {
  value: String
};
function Mg(r, e, t) {
  const n = this.getTokenStart(r);
  let i;
  return this.skipUntilBalanced(r, e || this.consumeUntilBalanceEnd), t && this.tokenStart > n ? i = ZC.call(this) : i = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(n, i),
    value: this.substring(n, i)
  };
}
function eT(r) {
  this.tokenize(r.value);
}
const tT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: eT,
  name: XC,
  parse: Mg,
  structure: JC
}, Symbol.toStringTag, { value: "Module" }));
function xh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracket, !0);
}
function nT() {
  const r = this.SelectorList();
  return r.type !== "Raw" && this.eof === !1 && this.tokenType !== _e && this.error(), r;
}
const rT = "Rule", iT = "rule", sT = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function qg() {
  const r = this.tokenIndex, e = this.tokenStart;
  let t, n;
  return this.parseRulePrelude ? t = this.parseWithFallback(nT, xh) : t = xh.call(this, r), n = this.Block(!0), {
    type: "Rule",
    loc: this.getLocation(e, this.tokenStart),
    prelude: t,
    block: n
  };
}
function aT(r) {
  this.node(r.prelude), this.node(r.block);
}
const oT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: aT,
  name: rT,
  parse: qg,
  structure: sT,
  walkContext: iT
}, Symbol.toStringTag, { value: "Module" })), lT = "Selector", cT = {
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
function _g() {
  const r = this.readSequence(this.scope.Selector);
  return this.getFirstListNode(r) === null && this.error("Selector is expected"), {
    type: "Selector",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function uT(r) {
  this.children(r);
}
const dT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: uT,
  name: lT,
  parse: _g,
  structure: cT
}, Symbol.toStringTag, { value: "Module" })), hT = "SelectorList", fT = "selector", pT = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function zg() {
  const r = this.createList();
  for (; !this.eof; ) {
    if (r.push(this.Selector()), this.tokenType === Qt) {
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
function gT(r) {
  this.children(r, () => this.token(Qt, ","));
}
const mT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: gT,
  name: hT,
  parse: zg,
  structure: pT,
  walkContext: fT
}, Symbol.toStringTag, { value: "Module" })), lc = 92, Rg = 34, bT = 39;
function Pg(r) {
  const e = r.length, t = r.charCodeAt(0), n = t === Rg || t === bT ? 1 : 0, i = n === 1 && e > 1 && r.charCodeAt(e - 1) === t ? e - 2 : e - 1;
  let s = "";
  for (let a = n; a <= i; a++) {
    let o = r.charCodeAt(a);
    if (o === lc) {
      if (a === i) {
        a !== e - 1 && (s = r.substr(a + 1));
        break;
      }
      if (o = r.charCodeAt(++a), Ft(lc, o)) {
        const l = a - 1, c = Qr(r, l);
        a = c - 1, s += kp(r.substring(l + 1, c));
      } else
        o === 13 && r.charCodeAt(a + 1) === 10 && a++;
    } else
      s += r[a];
  }
  return s;
}
function yT(r, e) {
  const t = '"', n = Rg;
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
    o === n || o === lc ? (i += "\\" + r.charAt(a), s = !1) : (s && (Dn(o) || er(o)) && (i += " "), i += r.charAt(a), s = !1);
  }
  return t + i + t;
}
const vT = "String", wT = {
  value: String
};
function Bg() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: Pg(this.consume(Wt))
  };
}
function xT(r) {
  this.token(Wt, yT(r.value));
}
const kT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xT,
  name: vT,
  parse: Bg,
  structure: wT
}, Symbol.toStringTag, { value: "Module" })), ST = 33;
function kh(r) {
  return this.Raw(r, null, !1);
}
const AT = "StyleSheet", ET = "stylesheet", CT = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function Fg() {
  const r = this.tokenStart, e = this.createList();
  let t;
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case ue:
        this.next();
        continue;
      case Be:
        if (this.charCodeAt(this.tokenStart + 2) !== ST) {
          this.next();
          continue;
        }
        t = this.Comment();
        break;
      case os:
        t = this.CDO();
        break;
      case He:
        t = this.CDC();
        break;
      case me:
        t = this.parseWithFallback(this.Atrule, kh);
        break;
      default:
        t = this.parseWithFallback(this.Rule, kh);
    }
    e.push(t);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(r, this.tokenStart),
    children: e
  };
}
function TT(r) {
  this.children(r);
}
const LT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: TT,
  name: AT,
  parse: Fg,
  structure: CT,
  walkContext: ET
}, Symbol.toStringTag, { value: "Module" })), DT = 42, Sh = 124;
function bl() {
  this.tokenType !== z && this.isDelim(DT) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
const IT = "TypeSelector", NT = {
  name: String
};
function $g() {
  const r = this.tokenStart;
  return this.isDelim(Sh) ? (this.next(), bl.call(this)) : (bl.call(this), this.isDelim(Sh) && (this.next(), bl.call(this))), {
    type: "TypeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function OT(r) {
  this.tokenize(r.name);
}
const MT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OT,
  name: IT,
  parse: $g,
  structure: NT
}, Symbol.toStringTag, { value: "Module" })), jg = 43, Ug = 45, cc = 63;
function Ni(r, e) {
  let t = 0;
  for (let n = this.tokenStart + r; n < this.tokenEnd; n++) {
    const i = this.charCodeAt(n);
    if (i === Ug && e && t !== 0)
      return Ni.call(this, r + t + 1, !1), -1;
    Dn(i) || this.error(
      e && t !== 0 ? "Hyphen minus" + (t < 6 ? " or hex digit" : "") + " is expected" : t < 6 ? "Hex digit is expected" : "Unexpected input",
      n
    ), ++t > 6 && this.error("Too many hex digits", n);
  }
  return this.next(), t;
}
function Vs(r) {
  let e = 0;
  for (; this.isDelim(cc); )
    ++e > r && this.error("Too many question marks"), this.next();
}
function qT(r) {
  this.charCodeAt(this.tokenStart) !== r && this.error((r === jg ? "Plus sign" : "Hyphen minus") + " is expected");
}
function _T() {
  let r = 0;
  switch (this.tokenType) {
    case $:
      if (r = Ni.call(this, 1, !0), this.isDelim(cc)) {
        Vs.call(this, 6 - r);
        break;
      }
      if (this.tokenType === Y || this.tokenType === $) {
        qT.call(this, Ug), Ni.call(this, 1, !1);
        break;
      }
      break;
    case Y:
      r = Ni.call(this, 1, !0), r > 0 && Vs.call(this, 6 - r);
      break;
    default:
      if (this.eatDelim(jg), this.tokenType === z) {
        r = Ni.call(this, 0, !0), r > 0 && Vs.call(this, 6 - r);
        break;
      }
      if (this.isDelim(cc)) {
        this.next(), Vs.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
const zT = "UnicodeRange", RT = {
  value: String
};
function Hg() {
  const r = this.tokenStart;
  return this.eatIdent("u"), _T.call(this), {
    type: "UnicodeRange",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r)
  };
}
function PT(r) {
  this.tokenize(r.value);
}
const BT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: PT,
  name: zT,
  parse: Hg,
  structure: RT
}, Symbol.toStringTag, { value: "Module" })), FT = 32, uc = 92, $T = 34, jT = 39, UT = 40, Vg = 41;
function HT(r) {
  const e = r.length;
  let t = 4, n = r.charCodeAt(e - 1) === Vg ? e - 2 : e - 1, i = "";
  for (; t < n && er(r.charCodeAt(t)); )
    t++;
  for (; t < n && er(r.charCodeAt(n)); )
    n--;
  for (let s = t; s <= n; s++) {
    let a = r.charCodeAt(s);
    if (a === uc) {
      if (s === n) {
        s !== e - 1 && (i = r.substr(s + 1));
        break;
      }
      if (a = r.charCodeAt(++s), Ft(uc, a)) {
        const o = s - 1, l = Qr(r, o);
        s = l - 1, i += kp(r.substring(o + 1, l));
      } else
        a === 13 && r.charCodeAt(s + 1) === 10 && s++;
    } else
      i += r[s];
  }
  return i;
}
function VT(r) {
  let e = "", t = !1;
  for (let n = 0; n < r.length; n++) {
    const i = r.charCodeAt(n);
    if (i === 0) {
      e += "�";
      continue;
    }
    if (i <= 31 || i === 127) {
      e += "\\" + i.toString(16), t = !0;
      continue;
    }
    i === FT || i === uc || i === $T || i === jT || i === UT || i === Vg ? (e += "\\" + r.charAt(n), t = !1) : (t && Dn(i) && (e += " "), e += r.charAt(n), t = !1);
  }
  return "url(" + e + ")";
}
const YT = "Url", GT = {
  value: String
};
function Yg() {
  const r = this.tokenStart;
  let e;
  switch (this.tokenType) {
    case Ie:
      e = HT(this.consume(Ie));
      break;
    case K:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(K), this.skipSC(), e = Pg(this.consume(Wt)), this.skipSC(), this.eof || this.eat(re);
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(r, this.tokenStart),
    value: e
  };
}
function KT(r) {
  this.token(Ie, VT(r.value));
}
const WT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: KT,
  name: YT,
  parse: Yg,
  structure: GT
}, Symbol.toStringTag, { value: "Module" })), QT = "Value", ZT = {
  children: [[]]
};
function Gg() {
  const r = this.tokenStart, e = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(r, this.tokenStart),
    children: e
  };
}
function XT(r) {
  this.children(r);
}
const JT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: XT,
  name: QT,
  parse: Gg,
  structure: ZT
}, Symbol.toStringTag, { value: "Module" })), eL = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
}), tL = "WhiteSpace", nL = {
  value: String
};
function Kg() {
  return this.eat(ue), eL;
}
function rL(r) {
  this.token(ue, r.value);
}
const iL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: rL,
  name: tL,
  parse: Kg,
  structure: nL
}, Symbol.toStringTag, { value: "Module" })), Wg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: aA,
  Atrule: hA,
  AtrulePrelude: bA,
  AttributeSelector: CA,
  Block: MA,
  Brackets: RA,
  CDC: $A,
  CDO: VA,
  ClassSelector: QA,
  Combinator: rE,
  Comment: cE,
  Declaration: AE,
  DeclarationList: DE,
  Dimension: ME,
  Function: PE,
  Hash: UE,
  IdSelector: ZE,
  Identifier: GE,
  MediaFeature: tC,
  MediaQuery: sC,
  MediaQueryList: cC,
  NestingSelector: pC,
  Nth: yC,
  Number: kC,
  Operator: CC,
  Parentheses: IC,
  Percentage: qC,
  PseudoClassSelector: BC,
  PseudoElementSelector: HC,
  Ratio: QC,
  Raw: tT,
  Rule: oT,
  Selector: dT,
  SelectorList: mT,
  String: kT,
  StyleSheet: LT,
  TypeSelector: MT,
  UnicodeRange: BT,
  Url: WT,
  Value: JT,
  WhiteSpace: iL
}, Symbol.toStringTag, { value: "Module" })), sL = Re(H({
  generic: !0
}, tA), {
  node: Wg
}), aL = 35, oL = 42, Ah = 43, lL = 45, cL = 47, uL = 117;
function Qg(r) {
  switch (this.tokenType) {
    case oe:
      return this.Hash();
    case Qt:
      return this.Operator();
    case xe:
      return this.Parentheses(this.readSequence, r.recognizer);
    case Xe:
      return this.Brackets(this.readSequence, r.recognizer);
    case Wt:
      return this.String();
    case Y:
      return this.Dimension();
    case ce:
      return this.Percentage();
    case $:
      return this.Number();
    case K:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, r.recognizer);
    case Ie:
      return this.Url();
    case z:
      return this.cmpChar(this.tokenStart, uL) && this.cmpChar(this.tokenStart + 1, Ah) ? this.UnicodeRange() : this.Identifier();
    case G: {
      const e = this.charCodeAt(this.tokenStart);
      if (e === cL || e === oL || e === Ah || e === lL)
        return this.Operator();
      e === aL && this.error("Hex or identifier is expected", this.tokenStart + 1);
      break;
    }
  }
}
const dL = {
  getNode: Qg
}, hL = 35, fL = 38, pL = 42, gL = 43, mL = 47, Eh = 46, bL = 62, yL = 124, vL = 126;
function wL(r, e) {
  e.last !== null && e.last.type !== "Combinator" && r !== null && r.type !== "Combinator" && e.push({
    // FIXME: this.Combinator() should be used instead
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function xL() {
  switch (this.tokenType) {
    case Xe:
      return this.AttributeSelector();
    case oe:
      return this.IdSelector();
    case qe:
      return this.lookupType(1) === qe ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case z:
      return this.TypeSelector();
    case $:
    case ce:
      return this.Percentage();
    case Y:
      this.charCodeAt(this.tokenStart) === Eh && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case G: {
      switch (this.charCodeAt(this.tokenStart)) {
        case gL:
        case bL:
        case vL:
        case mL:
          return this.Combinator();
        case Eh:
          return this.ClassSelector();
        case pL:
        case yL:
          return this.TypeSelector();
        case hL:
          return this.IdSelector();
        case fL:
          return this.NestingSelector();
      }
      break;
    }
  }
}
const kL = {
  onWhiteSpace: wL,
  getNode: xL
};
function SL() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function AL() {
  const r = this.createList();
  if (this.skipSC(), r.push(this.Identifier()), this.skipSC(), this.tokenType === Qt) {
    r.push(this.Operator());
    const e = this.tokenIndex, t = this.parseCustomProperty ? this.Value(null) : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, !1);
    if (t.type === "Value" && t.children.isEmpty) {
      for (let n = e - this.tokenIndex; n <= 0; n++)
        if (this.lookupType(n) === ue) {
          t.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
    }
    r.push(t);
  }
  return r;
}
function Ch(r) {
  return r !== null && r.type === "Operator" && (r.value[r.value.length - 1] === "-" || r.value[r.value.length - 1] === "+");
}
const EL = {
  getNode: Qg,
  onWhiteSpace(r, e) {
    Ch(r) && (r.value = " " + r.value), Ch(e.last) && (e.last.value += " ");
  },
  expression: SL,
  var: AL
}, CL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: dL,
  Selector: kL,
  Value: EL
}, Symbol.toStringTag, { value: "Module" })), TL = {
  parse: {
    prelude: null,
    block() {
      return this.Block(!0);
    }
  }
}, LL = {
  parse: {
    prelude() {
      const r = this.createList();
      switch (this.skipSC(), this.tokenType) {
        case Wt:
          r.push(this.String());
          break;
        case Ie:
        case K:
          r.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      return (this.lookupNonWSType(0) === z || this.lookupNonWSType(0) === xe) && r.push(this.MediaQueryList()), r;
    },
    block: null
  }
}, DL = {
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
}, IL = {
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
}, NL = {
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
function OL() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function ML() {
  return this.skipSC(), this.tokenType === z && this.lookupNonWSType(1) === qe ? this.createSingleNodeList(
    this.Declaration()
  ) : Zg.call(this);
}
function Zg() {
  const r = this.createList();
  let e;
  this.skipSC();
  e:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case Be:
        case ue:
          this.next();
          continue;
        case K:
          e = this.Function(OL, this.scope.AtrulePrelude);
          break;
        case z:
          e = this.Identifier();
          break;
        case xe:
          e = this.Parentheses(ML, this.scope.AtrulePrelude);
          break;
        default:
          break e;
      }
      r.push(e);
    }
  return r;
}
const qL = {
  parse: {
    prelude() {
      const r = Zg.call(this);
      return this.getFirstListNode(r) === null && this.error("Condition is expected"), r;
    },
    block(r = !1) {
      return this.Block(r);
    }
  }
}, _L = {
  "font-face": TL,
  import: LL,
  media: DL,
  nest: IL,
  page: NL,
  supports: qL
}, Fn = {
  parse() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
}, yl = {
  parse() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
}, Th = {
  parse() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
}, Ys = {
  parse() {
    return this.createSingleNodeList(
      this.Nth()
    );
  }
}, zL = {
  dir: Th,
  has: Fn,
  lang: Th,
  matches: Fn,
  is: Fn,
  "-moz-any": Fn,
  "-webkit-any": Fn,
  where: Fn,
  not: Fn,
  "nth-child": Ys,
  "nth-last-child": Ys,
  "nth-last-of-type": Ys,
  "nth-of-type": Ys,
  slotted: yl,
  host: yl,
  "host-context": yl
}, RL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: eg,
  Atrule: tg,
  AtrulePrelude: ng,
  AttributeSelector: ig,
  Block: ag,
  Brackets: og,
  CDC: lg,
  CDO: cg,
  ClassSelector: ug,
  Combinator: dg,
  Comment: hg,
  Declaration: pg,
  DeclarationList: gg,
  Dimension: mg,
  Function: bg,
  Hash: yg,
  IdSelector: wg,
  Identifier: vg,
  MediaFeature: xg,
  MediaQuery: kg,
  MediaQueryList: Sg,
  NestingSelector: Ag,
  Nth: Eg,
  Number: Cg,
  Operator: Tg,
  Parentheses: Lg,
  Percentage: Dg,
  PseudoClassSelector: Ig,
  PseudoElementSelector: Ng,
  Ratio: Og,
  Raw: Mg,
  Rule: qg,
  Selector: _g,
  SelectorList: zg,
  String: Bg,
  StyleSheet: Fg,
  TypeSelector: $g,
  UnicodeRange: Hg,
  Url: Yg,
  Value: Gg,
  WhiteSpace: Kg
}, Symbol.toStringTag, { value: "Module" })), PL = {
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
  scope: CL,
  atrule: _L,
  pseudo: zL,
  node: RL
}, BL = {
  node: Wg
}, FL = eA(H(H(H({}, sL), PL), BL));
function dc(r) {
  const e = {};
  for (const t in r) {
    let n = r[t];
    n && (Array.isArray(n) || n instanceof ge ? n = n.map(dc) : n.constructor === Object && (n = dc(n))), e[t] = n;
  }
  return e;
}
const {
  tokenize: VD,
  parse: $L,
  generate: jL,
  lexer: YD,
  createLexer: GD,
  walk: jn,
  find: KD,
  findLast: WD,
  findAll: QD,
  toPlainObject: ZD,
  fromPlainObject: XD,
  fork: JD
} = FL;
let UL = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", vt = (r = 21) => {
  let e = "", t = r;
  for (; t--; )
    e += UL[Math.random() * 64 | 0];
  return e;
};
function Un(r) {
  return $L(r, {
    parseAtrulePrelude: !1,
    parseCustomProperty: !0
  });
}
function Ke(r) {
  return jL(r, {
    // Default `safe` adds extra (potentially breaking) spaces for compatibility
    // with old browsers.
    mode: "spec"
  });
}
function Xg(r) {
  return r.type === "Declaration";
}
function HL(r) {
  return r.value.children.first.name;
}
const hc = {
  "position-anchor": `--position-anchor-${vt(12)}`,
  "anchor-scope": `--anchor-scope-${vt(12)}`,
  "anchor-name": `--anchor-name-${vt(12)}`
};
function VL(r, e) {
  return Xg(r) && hc[r.property] && e ? (e.children.appendData(Re(H({}, r), {
    property: hc[r.property]
  })), { updated: !0 }) : {};
}
function YL(r) {
  for (const e of r) {
    let t = !1;
    const n = Un(e.css);
    jn(n, {
      visit: "Declaration",
      enter(i) {
        var s;
        const a = (s = this.rule) == null ? void 0 : s.block, { updated: o } = VL(i, a);
        o && (t = !0);
      }
    }), t && (e.css = Ke(n), e.changed = !0);
  }
  return r.some((e) => e.changed === !0);
}
var Jg = /* @__PURE__ */ ((r) => (r.All = "all", r.None = "none", r))(Jg || {});
function Gt(r, e) {
  var t;
  return e = (t = hc[e]) != null ? t : e, (r instanceof HTMLElement ? getComputedStyle(r) : r.computedStyle).getPropertyValue(e).trim();
}
function Jr(r, e, t) {
  return Gt(r, e) === t;
}
function GL(r, { selector: e, pseudoElementPart: t }) {
  const n = getComputedStyle(r, t), i = document.createElement("div"), s = document.createElement("style");
  i.id = `fake-pseudo-element-${vt()}`;
  for (const o of Array.from(n)) {
    const l = n.getPropertyValue(o);
    i.style.setProperty(o, l);
  }
  s.textContent += `#${i.id}${t} { content: ${n.content}; }`, s.textContent += `${e} { display: none !important; }`, document.head.append(s);
  const a = t === "::before" ? "afterbegin" : "beforeend";
  return r.insertAdjacentElement(a, i), { fakePseudoElement: i, sheet: s, computedStyle: n };
}
function KL(r) {
  let e = r;
  for (; e; ) {
    if (Jr(e, "overflow", "scroll"))
      return e;
    e = e.parentElement;
  }
  return e;
}
function WL(r) {
  let e = KL(r);
  return e === document.documentElement && (e = null), e ?? { scrollTop: 0, scrollLeft: 0 };
}
function QL(r) {
  const { elementPart: e, pseudoElementPart: t } = r, n = [];
  if (t && !(t === "::before" || t === "::after")) return n;
  const i = Array.from(
    document.querySelectorAll(e)
  );
  if (!t)
    return n.push(...i), n;
  for (const s of i) {
    const { fakePseudoElement: a, sheet: o, computedStyle: l } = GL(
      s,
      r
    ), c = a.getBoundingClientRect(), { scrollY: d, scrollX: f } = globalThis, h = WL(s);
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
        const { scrollY: g, scrollX: m } = globalThis, { scrollTop: y, scrollLeft: x } = h;
        return DOMRect.fromRect({
          y: c.y + (d - g) + (h.scrollTop - y),
          x: c.x + (f - m) + (h.scrollLeft - x),
          width: c.width,
          height: c.height
        });
      }
    });
  }
  return n;
}
function ZL(r, e) {
  const t = Gt(r, "anchor-name");
  return e ? t.split(",").map((n) => n.trim()).includes(e) : !t;
}
function XL(r, e) {
  const t = Gt(r, "anchor-scope");
  return t === e || t === "all";
}
function JL(r) {
  return !!((r.type === "text/css" || r.rel === "stylesheet") && r.href);
}
function eD(r) {
  const e = new URL(r.href, document.baseURI);
  if (JL(r) && e.origin === location.origin)
    return e;
}
function tD(r) {
  return be(this, null, function* () {
    return Promise.all(
      r.map((e) => be(this, null, function* () {
        if (!e.url)
          return e;
        const t = yield (yield fetch(e.url.toString())).text();
        return Re(H({}, e), { css: t });
      }))
    );
  });
}
function nD() {
  const r = document.querySelectorAll('[style*="anchor"]'), e = [];
  return r.forEach((t) => {
    const n = vt(12), i = "data-has-inline-styles";
    t.setAttribute(i, n);
    const s = t.getAttribute("style"), a = `[${i}="${n}"] { ${s} }`;
    e.push({ el: t, css: a });
  }), e;
}
function rD() {
  return be(this, null, function* () {
    const r = document.querySelectorAll("link, style"), e = [];
    r.forEach((n) => {
      if (n.tagName.toLowerCase() === "link") {
        const i = eD(n);
        i && e.push({ el: n, url: i });
      }
      n.tagName.toLowerCase() === "style" && e.push({ el: n, css: n.innerHTML });
    });
    const t = nD();
    return yield tD([...e, ...t]);
  });
}
function iD(r, e) {
  return !r || r === e ? !1 : em(r) ? r.document.contains(e) : r.contains(e);
}
function em(r) {
  return !!(r && r === r.window);
}
function sD(r) {
  return Jr(r, "position", "fixed");
}
function fc(r) {
  return !!(r && (sD(r) || Jr(r, "position", "absolute")));
}
function Lh(r, e) {
  return r.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING;
}
function aD(r) {
  return be(this, null, function* () {
    return yield st.getOffsetParent(r);
  });
}
function vl(r) {
  return be(this, null, function* () {
    if (!["absolute", "fixed"].includes(Gt(r, "position")))
      return yield aD(r);
    let e = r.parentElement;
    for (; e; ) {
      if (!Jr(e, "position", "static") && Jr(e, "display", "block"))
        return e;
      e = e.parentElement;
    }
    return window;
  });
}
function oD(r, e, t, n) {
  return be(this, null, function* () {
    const i = yield vl(r), s = yield vl(t);
    if (!(iD(s, r) || em(s)) || i === s && !(!fc(r) || Lh(r, t)))
      return !1;
    if (i !== s) {
      let a;
      const o = [];
      for (a = i; a && a !== s && a !== window; )
        o.push(a), a = yield vl(a);
      const l = o[o.length - 1];
      if (l instanceof HTMLElement && !(!fc(l) || Lh(l, t)))
        return !1;
    }
    {
      let a = r.parentElement;
      for (; a; ) {
        if (Jr(a, "content-visibility", "hidden"))
          return !1;
        a = a.parentElement;
      }
    }
    return !(e && n && Dh(r, e, n) !== Dh(t, e, n));
  });
}
function Dh(r, e, t) {
  for (; !(r.matches(t) && XL(r, e)); ) {
    if (!r.parentElement)
      return null;
    r = r.parentElement;
  }
  return r;
}
function Ih(r, e, t, n) {
  return be(this, null, function* () {
    if (!(r instanceof HTMLElement && t.length && fc(r)))
      return null;
    const i = t.flatMap(QL).filter((a) => ZL(a, e)), s = n.map((a) => a.selector).join(",") || null;
    for (let a = i.length - 1; a >= 0; a--) {
      const o = i[a], l = "fakePseudoElement" in o;
      if (yield oD(
        l ? o.fakePseudoElement : o,
        e,
        r,
        s
      ))
        return l && o.removeFakePseudoElement(), o;
    }
    return null;
  });
}
const lD = [
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
], cD = [
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height"
], uD = [
  "justify-content",
  "align-content",
  "justify-self",
  "align-self",
  "justify-items",
  "align-items"
], dD = [
  "top",
  "left",
  "right",
  "bottom",
  "start",
  "end",
  "self-start",
  "self-end",
  "center"
], hD = [
  "width",
  "height",
  "block",
  "inline",
  "self-block",
  "self-inline"
];
function fD(r) {
  return r.type === "Declaration" && r.property === "anchor-name";
}
function pD(r) {
  return r.type === "Declaration" && r.property === "anchor-scope";
}
function tm(r) {
  return !!(r && r.type === "Function" && r.name === "anchor");
}
function nm(r) {
  return !!(r && r.type === "Function" && r.name === "anchor-size");
}
function ra(r) {
  return !!(r && r.type === "Function" && r.name === "var");
}
function gD(r) {
  return r.type === "Declaration" && r.property === "position-fallback";
}
function mD(r) {
  return r.type === "Atrule" && r.name === "position-fallback";
}
function bD(r) {
  return r.type === "Atrule" && r.name === "try";
}
function wl(r) {
  return !!(r.type === "Identifier" && r.name);
}
function yD(r) {
  return !!(r.type === "Percentage" && r.value);
}
function es(r) {
  return lD.includes(r);
}
function vD(r) {
  return dD.includes(r);
}
function Ga(r) {
  return cD.includes(r);
}
function wD(r) {
  return hD.includes(r);
}
function xD(r) {
  return uD.includes(r);
}
function Nh(r, e) {
  let t, n, i, s = "", a = !1, o;
  const l = [];
  r.children.toArray().forEach((h) => {
    if (a) {
      s = `${s}${Ke(h)}`;
      return;
    }
    if (h.type === "Operator" && h.value === ",") {
      a = !0;
      return;
    }
    l.push(h);
  });
  let [c, d] = l;
  if (d || (d = c, c = void 0), c && (wl(c) ? c.name === "implicit" ? c = void 0 : c.name.startsWith("--") && (t = c.name) : ra(c) && c.children.first && (o = c.children.first.name)), d)
    if (tm(r)) {
      if (wl(d) && vD(d.name))
        n = d.name;
      else if (yD(d)) {
        const h = Number(d.value);
        n = Number.isNaN(h) ? void 0 : h;
      }
    } else nm(r) && wl(d) && wD(d.name) && (i = d.name);
  const f = `--anchor-${vt(12)}`;
  return Object.assign(r, {
    type: "Raw",
    value: `var(${f})`,
    children: null
  }), Reflect.deleteProperty(r, "name"), {
    anchorName: t,
    anchorSide: n,
    anchorSize: i,
    fallbackValue: s || "0px",
    customPropName: o,
    uuid: f
  };
}
function Oh(r) {
  return r.value.children.map(
    ({ name: e }) => e
  );
}
function xl(r) {
  return r ? r.children.map((e) => {
    var t;
    let n;
    ((t = e.children.last) == null ? void 0 : t.type) === "PseudoElementSelector" && (e = dc(e), n = Ke(e.children.last), e.children.pop());
    const i = Ke(e);
    return {
      selector: i + (n ?? ""),
      elementPart: i,
      pseudoElementPart: n
    };
  }).toArray() : [];
}
let zi = {}, Yn = {}, Gn = {}, Ri = {}, Hn = {};
function kD() {
  zi = {}, Yn = {}, Gn = {}, Ri = {}, Hn = {};
}
function SD(r, e) {
  var t;
  if ((tm(r) || nm(r)) && e) {
    if (e.property.startsWith("--")) {
      const n = Ke(e.value), i = Nh(r);
      return Ri[i.uuid] = n, Gn[e.property] = [
        ...(t = Gn[e.property]) != null ? t : [],
        i
      ], { changed: !0 };
    }
    if (es(e.property) || Ga(e.property)) {
      const n = Nh(r);
      return { prop: e.property, data: n, changed: !0 };
    }
  }
  return {};
}
function AD(r) {
  return gD(r) && r.value.children.first ? HL(r) : null;
}
function ED(r) {
  var e, t;
  if (mD(r) && (e = r.prelude) != null && e.value && (t = r.block) != null && t.children) {
    const n = r.prelude.value, i = [];
    return r.block.children.filter(bD).forEach((s) => {
      var a;
      if ((a = s.block) != null && a.children) {
        const o = s.block.children.filter(
          (c) => Xg(c) && (es(c.property) || Ga(c.property) || xD(c.property))
        ), l = {
          uuid: `${n}-try-${vt(12)}`,
          declarations: Object.fromEntries(
            o.map((c) => [c.property, Ke(c.value)])
          )
        };
        i.push(l);
      }
    }), { name: n, blocks: i };
  }
  return {};
}
function CD(r, e) {
  return be(this, null, function* () {
    let t = e.anchorName;
    const n = e.customPropName;
    if (r && !t) {
      const o = r.getAttribute("anchor"), l = Gt(
        r,
        "position-anchor"
      );
      if (l)
        t = l;
      else if (n)
        t = Gt(r, n);
      else if (o) {
        const c = `#${CSS.escape(o)}`;
        return yield Ih(
          r,
          null,
          [{ selector: c, elementPart: c }],
          []
        );
      }
    }
    const i = t ? zi[t] || [] : [], s = t ? Yn[Jg.All] || [] : [], a = t ? Yn[t] || [] : [];
    return yield Ih(
      r,
      t || null,
      i,
      [...s, ...a]
    );
  });
}
function TD(r) {
  return be(this, null, function* () {
    var e, t, n, i, s, a;
    const o = {}, l = {}, c = {}, d = {};
    kD();
    for (const y of r) {
      const x = Un(y.css);
      jn(x, {
        visit: "Atrule",
        enter(w) {
          const { name: S, blocks: E } = ED(w);
          S && E != null && E.length && (c[S] = {
            targets: [],
            blocks: E
          });
        }
      });
    }
    for (const y of r) {
      let x = !1;
      const w = Un(y.css);
      jn(w, {
        visit: "Declaration",
        enter(S) {
          var E, C;
          const I = (E = this.rule) == null ? void 0 : E.prelude, M = xl(I), O = AD(S);
          if (O && M.length && c[O]) {
            for (const { selector: k } of M)
              d[k] = { fallbacks: c[O].blocks }, c[O].targets.includes(k) || c[O].targets.push(k);
            for (const k of c[O].blocks) {
              const A = `[data-anchor-polyfill="${k.uuid}"]`;
              (C = this.stylesheet) == null || C.children.prependData({
                type: "Rule",
                prelude: {
                  type: "Raw",
                  value: A
                },
                block: {
                  type: "Block",
                  children: new ge().fromArray(
                    Object.entries(k.declarations).map(([_, N]) => ({
                      type: "Declaration",
                      important: !0,
                      property: _,
                      value: {
                        type: "Raw",
                        value: N
                      }
                    }))
                  )
                }
              }), l[A] = M.map(({ selector: _ }) => _).join(", ");
            }
            x = !0;
          }
        }
      }), x && (y.css = Ke(w), y.changed = !0);
    }
    for (const y of r) {
      let x = !1;
      const w = Un(y.css);
      jn(w, function(S) {
        var E, C, I;
        const M = (E = this.rule) == null ? void 0 : E.prelude, O = xl(M);
        if (fD(S) && O.length)
          for (const N of Oh(S))
            zi[N] != null || (zi[N] = []), zi[N].push(...O);
        if (pD(S) && O.length)
          for (const N of Oh(S))
            Yn[N] != null || (Yn[N] = []), Yn[N].push(...O);
        const {
          prop: k,
          data: A,
          changed: _
        } = SD(S, this.declaration);
        if (k && A && O.length)
          for (const { selector: N } of O)
            o[N] = Re(H({}, o[N]), {
              [k]: [...(I = (C = o[N]) == null ? void 0 : C[k]) != null ? I : [], A]
            });
        _ && (x = !0);
      }), x && (y.css = Ke(w), y.changed = !0);
    }
    const f = new Set(Object.keys(Gn)), h = {}, g = (y) => {
      var x, w, S, E, C;
      const I = [], M = new Set((w = (x = h[y]) == null ? void 0 : x.names) != null ? w : []);
      for (; M.size > 0; )
        for (const O of M)
          I.push(...(S = Gn[O]) != null ? S : []), M.delete(O), (C = (E = h[O]) == null ? void 0 : E.names) != null && C.length && h[O].names.forEach((k) => M.add(k));
      return I;
    };
    for (; f.size > 0; ) {
      const y = [];
      for (const x of r) {
        let w = !1;
        const S = Un(x.css);
        jn(S, {
          visit: "Function",
          enter(E) {
            var C, I;
            const M = (C = this.rule) == null ? void 0 : C.prelude, O = this.declaration, k = O == null ? void 0 : O.property;
            if ((M == null ? void 0 : M.children.isEmpty) === !1 && ra(E) && O && k && E.children.first && f.has(
              E.children.first.name
            ) && // For now, we only want assignments to other CSS custom properties
            k.startsWith("--")) {
              const A = E.children.first, _ = (I = Gn[A.name]) != null ? I : [], N = g(A.name);
              if (!(_.length || N.length))
                return;
              const V = `${A.name}-anchor-${vt(12)}`, fe = Ke(O.value);
              Ri[V] = fe, h[k] || (h[k] = { names: [], uuids: [] });
              const ie = h[k];
              ie.names.includes(A.name) || ie.names.push(A.name), ie.uuids.push(V), y.push(k), A.name = V, w = !0;
            }
          }
        }), w && (x.css = Ke(S), x.changed = !0);
      }
      f.clear(), y.forEach((x) => f.add(x));
    }
    for (const y of r) {
      let x = !1;
      const w = Un(y.css);
      jn(w, {
        visit: "Function",
        enter(S) {
          var E, C, I, M, O, k, A;
          const _ = (E = this.rule) == null ? void 0 : E.prelude, N = this.declaration, V = N == null ? void 0 : N.property;
          if ((_ == null ? void 0 : _.children.isEmpty) === !1 && ra(S) && N && V && S.children.first && // Now we only want assignments to inset/sizing properties
          (es(V) || Ga(V))) {
            const fe = S.children.first, ie = (C = Gn[fe.name]) != null ? C : [], Ye = g(fe.name);
            if (!(ie.length || Ye.length))
              return;
            const Fe = `${V}-${vt(12)}`;
            if (Ye.length) {
              const Lt = /* @__PURE__ */ new Set([fe.name]);
              for (; Lt.size > 0; )
                for (const Dt of Lt) {
                  const U = h[Dt];
                  if ((I = U == null ? void 0 : U.names) != null && I.length && (M = U == null ? void 0 : U.uuids) != null && M.length)
                    for (const It of U.names)
                      for (const Nt of U.uuids)
                        Hn[Nt] = Re(H({}, Hn[Nt]), {
                          // - `key` (`propUuid`) is the property-specific
                          //   uuid to append to the new custom property name
                          // - `value` is the new property-specific custom
                          //   property value to use
                          [Fe]: `${It}-${Fe}`
                        });
                  Lt.delete(Dt), (O = U == null ? void 0 : U.names) != null && O.length && U.names.forEach((It) => Lt.add(It));
                }
            }
            const ni = xl(_);
            for (const Lt of [...ie, ...Ye]) {
              const Dt = H({}, Lt), U = `--anchor-${vt(12)}-${V}`, It = Dt.uuid;
              Dt.uuid = U;
              for (const { selector: Nt } of ni)
                o[Nt] = Re(H({}, o[Nt]), {
                  [V]: [...(A = (k = o[Nt]) == null ? void 0 : k[V]) != null ? A : [], Dt]
                });
              Hn[It] = Re(H({}, Hn[It]), {
                // - `key` (`propUuid`) is the property-specific
                //   uuid to append to the new custom property name
                // - `value` is the new property-specific custom
                //   property value to use
                [Fe]: U
              });
            }
            fe.name = `${fe.name}-${Fe}`, x = !0;
          }
        }
      }), x && (y.css = Ke(w), y.changed = !0);
    }
    if (Object.keys(Hn).length > 0)
      for (const y of r) {
        let x = !1;
        const w = Un(y.css);
        jn(w, {
          visit: "Function",
          enter(S) {
            var E, C, I, M;
            if (ra(S) && (C = (E = S.children.first) == null ? void 0 : E.name) != null && C.startsWith(
              "--"
            ) && (M = (I = this.declaration) == null ? void 0 : I.property) != null && M.startsWith("--") && this.block) {
              const O = S.children.first, k = Hn[O.name];
              if (k)
                for (const [A, _] of Object.entries(k))
                  this.block.children.appendData({
                    type: "Declaration",
                    important: !1,
                    property: `${this.declaration.property}-${A}`,
                    value: {
                      type: "Raw",
                      value: Ke(this.declaration.value).replace(
                        `var(${O.name})`,
                        `var(${_})`
                      )
                    }
                  }), x = !0;
              Ri[O.name] && (this.declaration.value = {
                type: "Raw",
                value: Ri[O.name]
              }, x = !0);
            }
          }
        }), x && (y.css = Ke(w), y.changed = !0);
      }
    const m = /* @__PURE__ */ new Map();
    for (const [y, x] of Object.entries(o)) {
      let w;
      y.startsWith("[data-anchor-polyfill=") && l[y] ? w = document.querySelectorAll(l[y]) : w = document.querySelectorAll(y);
      for (const [S, E] of Object.entries(x))
        for (const C of E)
          for (const I of w) {
            const M = yield CD(I, C), O = `--anchor-${vt(12)}`;
            m.set(I, Re(H({}, (e = m.get(I)) != null ? e : {}), {
              [C.uuid]: O
            })), I.setAttribute(
              "style",
              `${C.uuid}: var(${O}); ${(t = I.getAttribute("style")) != null ? t : ""}`
            ), d[y] = Re(H({}, d[y]), {
              declarations: Re(H({}, (n = d[y]) == null ? void 0 : n.declarations), {
                [S]: [
                  ...(a = (s = (i = d[y]) == null ? void 0 : i.declarations) == null ? void 0 : s[S]) != null ? a : [],
                  Re(H({}, C), { anchorEl: M, targetEl: I, uuid: O })
                ]
              })
            });
          }
    }
    return { rules: d, inlineStyles: m, anchorScopes: Yn };
  });
}
function Mh(r, e, t = !1) {
  return be(this, null, function* () {
    const n = [];
    for (const { el: i, css: s, changed: a } of r) {
      const o = { el: i, css: s, changed: !1 };
      if (a) {
        if (i.tagName.toLowerCase() === "style")
          i.innerHTML = s;
        else if (i.tagName.toLowerCase() === "link") {
          const l = new Blob([s], { type: "text/css" }), c = URL.createObjectURL(l), d = document.createElement("link");
          d.rel = "stylesheet", d.href = c;
          const f = new Promise((h) => {
            d.onload = h;
          });
          i.replaceWith(d), yield f, URL.revokeObjectURL(c), o.el = d;
        } else if (i.hasAttribute("data-has-inline-styles")) {
          const l = i.getAttribute("data-has-inline-styles");
          if (l) {
            const c = `[data-has-inline-styles="${l}"]{`;
            let d = s.slice(c.length, -1);
            const f = e == null ? void 0 : e.get(i);
            if (f)
              for (const [h, g] of Object.entries(f))
                d = `${h}: var(${g}); ${d}`;
            i.setAttribute("style", d);
          }
        }
      }
      t && i.hasAttribute("data-has-inline-styles") && i.removeAttribute("data-has-inline-styles"), n.push(o);
    }
    return n;
  });
}
const LD = Re(H({}, st), { _c: /* @__PURE__ */ new Map() }), rm = (r) => be(void 0, null, function* () {
  var e, t, n;
  let i = yield (e = st.getOffsetParent) == null ? void 0 : e.call(st, r);
  return (yield (t = st.isElement) == null ? void 0 : t.call(st, i)) || (i = (yield (n = st.getDocumentElement) == null ? void 0 : n.call(st, r)) || window.document.documentElement), i;
}), DD = (r, e) => {
  let t;
  switch (r) {
    case "start":
    case "self-start":
      t = 0;
      break;
    case "end":
    case "self-end":
      t = 100;
      break;
    default:
      typeof r == "number" && !Number.isNaN(r) && (t = r);
  }
  if (t !== void 0)
    return e ? 100 - t : t;
}, ID = (r, e) => {
  let t;
  switch (r) {
    case "block":
    case "self-block":
      t = e ? "width" : "height";
      break;
    case "inline":
    case "self-inline":
      t = e ? "height" : "width";
      break;
  }
  return t;
}, qh = (r) => {
  switch (r) {
    case "top":
    case "bottom":
      return "y";
    case "left":
    case "right":
      return "x";
  }
  return null;
}, ND = (r) => {
  switch (r) {
    case "x":
      return "width";
    case "y":
      return "height";
  }
  return null;
}, _h = (r) => Gt(r, "display") === "inline", zh = (r, e) => (e === "x" ? ["border-left-width", "border-right-width"] : ["border-top-width", "border-bottom-width"]).reduce(
  (t, n) => t + parseInt(Gt(r, n), 10),
  0
) || 0, Gs = (r, e) => parseInt(Gt(r, `margin-${e}`), 10) || 0, OD = (r) => ({
  top: Gs(r, "top"),
  right: Gs(r, "right"),
  bottom: Gs(r, "bottom"),
  left: Gs(r, "left")
}), Rh = (r) => be(void 0, [r], function* ({
  targetEl: e,
  targetProperty: t,
  anchorRect: n,
  anchorSide: i,
  anchorSize: s,
  fallback: a
}) {
  var o;
  if (!((s || i !== void 0) && e && n))
    return a;
  if (s) {
    if (!Ga(t))
      return a;
    let l;
    switch (s) {
      case "width":
      case "height":
        l = s;
        break;
      default: {
        let c = !1;
        const d = Gt(e, "writing-mode");
        c = d.startsWith("vertical-") || d.startsWith("sideways-"), l = ID(s, c);
      }
    }
    return l ? `${n[l]}px` : a;
  }
  if (i !== void 0) {
    let l, c;
    const d = qh(t);
    if (!(es(t) && d && (!es(i) || d === qh(i))))
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
        if (e) {
          const g = (yield (o = st.isRTL) == null ? void 0 : o.call(st, e)) || !1;
          l = DD(i, g);
        }
    }
    const f = typeof l == "number" && !Number.isNaN(l), h = ND(d);
    if (f && h) {
      (t === "bottom" || t === "right") && (c = yield rm(e));
      let g = n[d] + n[h] * (l / 100);
      switch (t) {
        case "bottom": {
          if (!c)
            break;
          let m = c.clientHeight;
          if (m === 0 && _h(c)) {
            const y = zh(c, d);
            m = c.offsetHeight - y;
          }
          g = m - g;
          break;
        }
        case "right": {
          if (!c)
            break;
          let m = c.clientWidth;
          if (m === 0 && _h(c)) {
            const y = zh(c, d);
            m = c.offsetWidth - y;
          }
          g = m - g;
          break;
        }
      }
      return `${g}px`;
    }
  }
  return a;
});
function MD(r, e = !1) {
  return be(this, null, function* () {
    const t = document.documentElement;
    for (const [n, i] of Object.entries(r))
      for (const s of i) {
        const a = s.anchorEl, o = s.targetEl;
        if (a && o)
          bp(
            a,
            o,
            () => be(this, null, function* () {
              const l = yield st.getElementRects({
                reference: a,
                floating: o,
                strategy: "absolute"
              }), c = yield Rh({
                targetEl: o,
                targetProperty: n,
                anchorRect: l.reference,
                anchorSide: s.anchorSide,
                anchorSize: s.anchorSize,
                fallback: s.fallbackValue
              });
              t.style.setProperty(s.uuid, c);
            }),
            { animationFrame: e }
          );
        else {
          const l = yield Rh({
            targetProperty: n,
            anchorSide: s.anchorSide,
            anchorSize: s.anchorSize,
            fallback: s.fallbackValue
          });
          t.style.setProperty(s.uuid, l);
        }
      }
  });
}
function qD(r, e, t = !1) {
  return be(this, null, function* () {
    if (!e.length)
      return;
    const n = document.querySelectorAll(r);
    for (const i of n) {
      let s = !1;
      const a = yield rm(i);
      bp(
        i,
        i,
        () => be(this, null, function* () {
          if (!s) {
            s = !0;
            for (const [o, { uuid: l }] of e.entries()) {
              if (i.setAttribute("data-anchor-polyfill", l), o === e.length - 1) {
                s = !1;
                break;
              }
              const c = yield st.getElementRects({
                reference: i,
                floating: i,
                strategy: "absolute"
              }), d = yield $x(
                {
                  x: i.offsetLeft,
                  y: i.offsetTop,
                  platform: LD,
                  rects: c,
                  elements: { floating: i },
                  strategy: "absolute"
                },
                {
                  boundary: a,
                  rootBoundary: "document",
                  padding: OD(i)
                }
              );
              if (Object.values(d).every((f) => f <= 0)) {
                s = !1;
                break;
              }
            }
          }
        }),
        { animationFrame: t }
      );
    }
  });
}
function _D(r, e = !1) {
  return be(this, null, function* () {
    var t, n;
    for (const i of Object.values(r))
      yield MD((t = i.declarations) != null ? t : {}, e);
    for (const [i, s] of Object.entries(r))
      yield qD(
        i,
        (n = s.fallbacks) != null ? n : [],
        e
      );
  });
}
function zD(r) {
  return be(this, null, function* () {
    const e = !!window.UPDATE_ANCHOR_ON_ANIMATION_FRAME;
    let t = yield rD();
    (yield YL(t)) && (t = yield Mh(t));
    const { rules: n, inlineStyles: i } = yield TD(t);
    return Object.values(n).length && (yield Mh(t, i, !0), yield _D(n, e)), n;
  });
}
function Ph() {
  console.log("[Keys UI] Starting initialization..."), "anchorName" in document.documentElement.style || zD(), Wl.initialize(), pc.getInstance().init(), gc.getInstance().init(), mc.getInstance().init(), Fh.getInstance().init(), bc.getInstance().init(), yc.getInstance().init(), vc.getInstance().init(), $h.getInstance().init(), wc.getInstance().init(), Br.getInstance().init(), xc.getInstance().init(), kc.getInstance().init(), Sc.getInstance().init(), Fr.getInstance().init(), Ac.getInstance().init(), $r.getInstance().init(), jr.getInstance().init(), Ec.getInstance().init(), Ur.getInstance().init(), Cc.getInstance().init(), jh.getInstance().init(), Uh.getInstance().init(), console.log("[Keys UI] Initializing LightboxActions..."), Sa.getInstance().init(), Hh.getInstance().init(), new Tc(), console.log("[Keys UI] Initializing ColorPickerActions..."), document.querySelectorAll("[data-keys-color-picker]").forEach((e) => {
    new cm(e);
  }), console.log("[Keys UI] Initializing SidebarActions..."), new Vh().init(), console.log("[Keys UI] Initialization complete!");
}
const Bh = {
  FormActions: pc.getInstance(),
  TextareaActions: gc.getInstance(),
  AlertActions: mc.getInstance(),
  AvatarActions: Fh.getInstance(),
  BadgeActions: bc.getInstance(),
  BadgeGroupActions: yc.getInstance(),
  ButtonActions: vc.getInstance(),
  CalendarCore: $h.getInstance(),
  RadioActions: wc.getInstance(),
  RangeActions: Br.getInstance(),
  SelectActions: xc.getInstance(),
  TabsActions: kc.getInstance(),
  ModalActions: Sc.getInstance(),
  ToastActions: Fr.getInstance(),
  DropdownActions: Ac.getInstance(),
  TableActions: $r.getInstance(),
  TimePickerActions: jr.getInstance(),
  EditorActions: Ec.getInstance(),
  DatePickerActions: Ur.getInstance(),
  AddToCartActions: Cc.getInstance(),
  GalleryActions: jh.getInstance(),
  ImageActions: Uh.getInstance(),
  LightboxActions: Sa.getInstance(),
  ChartActions: Hh.getInstance(),
  PopoverActions: new Tc(),
  SidebarActions: Vh,
  Quill: D,
  init: Ph,
  initialize: Ph
};
typeof window < "u" && (window.KeysUI = Bh, window.Quill = D, window.manualSyncEditor = () => Bh.EditorActions.manualSync());
export {
  Cc as AddToCartActions,
  mc as AlertActions,
  Fh as AvatarActions,
  bc as BadgeActions,
  yc as BadgeGroupActions,
  ee as BaseActionClass,
  vc as ButtonActions,
  $h as CalendarCore,
  Hh as ChartActions,
  cm as ColorPickerActions,
  b as DOMUtils,
  Ur as DatePickerActions,
  Ac as DropdownActions,
  Ec as EditorActions,
  T as EventUtils,
  pc as FormActions,
  jh as GalleryActions,
  Uh as ImageActions,
  Sa as LightboxActions,
  Sc as ModalActions,
  Tc as PopoverActions,
  Wl as RTLUtils,
  wc as RadioActions,
  Br as RangeActions,
  om as RatingActions,
  xc as SelectActions,
  Vh as SidebarActions,
  $r as TableActions,
  kc as TabsActions,
  gc as TextareaActions,
  jr as TimePickerActions,
  Fr as ToastActions,
  Bh as default,
  Ph as initializeKeysUI
};
