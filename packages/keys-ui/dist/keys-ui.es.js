var sm = Object.defineProperty;
var am = (r, t, e) => t in r ? sm(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var q = (r, t, e) => am(r, typeof t != "symbol" ? t + "" : t, e);
const Ir = class Ir {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const t = this.name;
    return Ir.instances.has(t) || Ir.instances.set(t, new this()), Ir.instances.get(t);
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
Ir.instances = /* @__PURE__ */ new Map();
let tt = Ir;
class y {
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
    let e = this.findClosest(t, '[data-input-actions="true"]');
    if (e && (e.tagName.toLowerCase() === "input" || e.tagName.toLowerCase() === "textarea"))
      return e;
    if (e = this.findClosest(t, '*:has(input[data-input-actions="true"]), *:has(textarea[data-input-actions="true"])'), e) {
      const i = this.findFormElement(e);
      if (i)
        return i;
    }
    let n = t.parentElement;
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
class T {
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
      var s, a, o, l, c, d, f, h, p, m, b;
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
          i && e.preventDefault(), (d = t.onEnter) == null || d.call(t);
          break;
        case " ":
          i && e.preventDefault(), (f = t.onSpace) == null || f.call(t);
          break;
        case "Escape":
          i && e.preventDefault(), (h = t.onEscape) == null || h.call(t);
          break;
        case "Home":
          i && e.preventDefault(), (p = t.onHome) == null || p.call(t);
          break;
        case "End":
          i && e.preventDefault(), (m = t.onEnd) == null || m.call(t);
          break;
        case "Tab":
          (b = t.onTab) == null || b.call(t);
          break;
      }
    };
  }
}
function Au(r, t = "") {
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
class pc extends tt {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-action] button", (t, e) => {
      e.preventDefault(), this.handleActionClick(t);
    }), T.handleDelegatedKeydown("[data-action] button", (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleActionClick(t));
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(t) {
    const e = y.findClosest(t, "[data-action]"), n = e == null ? void 0 : e.dataset.action;
    if (!n) return;
    const i = y.findFormElementForAction(t);
    if (!i) return;
    const s = n === "password_toggle" ? "toggle-password" : n;
    switch (s) {
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
        this.openExternalUrl(e.dataset.url);
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
  async swapButtonIcon(t, e) {
    t.setAttribute("data-current-icon", e), this.updateButtonIconState(t, e);
  }
  /**
   * Update button icon state using Tailwind classes
   */
  updateButtonIconState(t, e) {
    const n = y.querySelector(".button-icon-default", t), i = y.querySelector(".button-icon-toggle", t), s = y.querySelector(".button-icon-success", t), a = t.dataset.iconDefault, o = t.dataset.iconToggle, l = t.dataset.iconSuccess;
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
    const n = y.querySelector("button", e);
    try {
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, Au("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && await this.showCopySuccess(n, e);
    } catch {
      this.fallbackCopyToClipboard(t, e);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(t, e) {
    const n = y.querySelector("button", e);
    t.select(), t instanceof HTMLInputElement && t.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(t, Au("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && this.showCopySuccess(n, e);
    } catch {
      this.showFeedback(t, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(t, e) {
    const n = t.dataset.iconSuccess, i = t.dataset.labelSuccess, s = t.dataset.iconDefault, a = y.querySelector(".sr-only", t);
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
    var f;
    const i = t.type === "password", s = i ? "text" : "password", a = e.dataset.iconDefault, o = e.dataset.iconToggle, l = (f = y.querySelector(".sr-only", e)) == null ? void 0 : f.textContent, c = e.dataset.labelToggle;
    t.type = s;
    const d = y.querySelector(".sr-only", e);
    i ? (o && await this.swapButtonIcon(e, o), c && d && (d.textContent = c), e.setAttribute("aria-label", c || "Hide password")) : (a && await this.swapButtonIcon(e, a), l && d && (d.textContent = l), e.setAttribute("aria-label", l || "Show password"));
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
    T.dispatchCustomEvent(t, "form-action", {
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
    i.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${n === "success" ? "bg-success text-white" : "bg-danger text-white"}`, i.textContent = e;
    const s = y.findClosest(t, ".relative");
    s && (s.appendChild(i), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 2e3));
  }
  /**
   * Add a custom action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return T.addEventListener(document, "form-action", (n) => {
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
pc.getInstance();
class gc extends tt {
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
    T.handleDelegatedEvent("input", 'textarea[data-auto-resize="true"]', (t) => {
      this.handleAutoResize(t);
    }), T.handleDelegatedEvent("input", 'textarea[data-show-character-count="true"]', (t) => {
      this.updateCharacterCount(t);
    }), T.handleDelegatedEvent("paste", 'textarea[data-show-character-count="true"]', (t) => {
      setTimeout(() => {
        this.updateCharacterCount(t);
      }, 0);
    }), T.handleDelegatedEvent("cut", 'textarea[data-show-character-count="true"]', (t) => {
      setTimeout(() => {
        this.updateCharacterCount(t);
      }, 0);
    });
  }
  /**
   * Initialize auto-resize functionality for existing textareas
   */
  initializeAutoResize() {
    y.querySelectorAll('textarea[data-auto-resize="true"]').forEach((e) => {
      this.setupAutoResize(e);
    });
  }
  /**
   * Initialize character count displays for existing textareas
   */
  initializeCharacterCounts() {
    y.querySelectorAll('textarea[data-show-character-count="true"]').forEach((e) => {
      this.updateCharacterCount(e);
    });
  }
  /**
   * Setup auto-resize for a textarea element
   */
  setupAutoResize(t) {
    const e = parseInt(t.getAttribute("rows") || "3"), n = this.getLineHeight(t), i = this.getVerticalPadding(t), s = e * n + i;
    t.style.minHeight = `${s}px`, t.style.resize = "none", t.style.overflow = "hidden", this.handleAutoResize(t);
  }
  /**
   * Handle auto-resize for textarea
   */
  handleAutoResize(t) {
    t.style.height = "auto";
    const e = t.scrollHeight, n = parseInt(t.style.minHeight || "0"), i = Math.max(e, n);
    t.style.height = `${i}px`, this.dispatchResizeEvent(t, i);
  }
  /**
   * Update character count display
   */
  updateCharacterCount(t) {
    const e = t.id || t.name;
    if (!e) return;
    const n = y.querySelector(`[data-character-count][data-target-id="${e}"]`);
    if (!n) return;
    const i = t.value.length, s = parseInt(n.dataset.maxLength || "0") || null, a = y.querySelector("[data-current-count]", n);
    a && (a.textContent = i.toString()), this.applyCharacterCountFeedback(n, t, i, s), this.dispatchCharacterCountEvent(t, i, s);
  }
  /**
   * Apply visual feedback for character count
   */
  applyCharacterCountFeedback(t, e, n, i) {
    if (!i) return;
    t.classList.remove("text-muted", "text-warning", "text-danger"), e.classList.remove("border-warning", "border-danger", "focus:border-warning", "focus:border-danger", "focus:ring-warning", "focus:ring-danger");
    const s = n / i * 100;
    n > i ? (t.classList.add("text-danger"), e.classList.add("border-danger", "focus:border-danger", "focus:ring-danger")) : s >= 90 ? (t.classList.add("text-warning"), e.classList.add("border-warning", "focus:border-warning", "focus:ring-warning")) : t.classList.add("text-muted");
  }
  /**
   * Get line height for textarea
   */
  getLineHeight(t) {
    const e = window.getComputedStyle(t), n = e.lineHeight;
    return n === "normal" ? parseFloat(e.fontSize) * 1.2 : parseFloat(n);
  }
  /**
   * Get vertical padding for textarea
   */
  getVerticalPadding(t) {
    const e = window.getComputedStyle(t), n = parseFloat(e.paddingTop), i = parseFloat(e.paddingBottom), s = parseFloat(e.borderTopWidth), a = parseFloat(e.borderBottomWidth);
    return n + i + s + a;
  }
  /**
   * Dispatch resize event
   */
  dispatchResizeEvent(t, e) {
    T.dispatchCustomEvent(t, "textarea-resize", {
      element: t,
      height: e
    });
  }
  /**
   * Dispatch character count event
   */
  dispatchCharacterCountEvent(t, e, n) {
    T.dispatchCustomEvent(t, "textarea-character-count", {
      element: t,
      currentLength: e,
      maxLength: n || void 0
    });
  }
  /**
   * Add a custom resize handler with automatic cleanup
   */
  addResizeHandler(t) {
    return T.addEventListener(document, "textarea-resize", (e) => {
      const n = e;
      t(n.detail.element, n.detail.height);
    });
  }
  /**
   * Add a custom character count handler with automatic cleanup
   */
  addCharacterCountHandler(t) {
    return T.addEventListener(document, "textarea-character-count", (e) => {
      t(e.detail);
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
  triggerAutoResize(t) {
    t.dataset.autoResize === "true" && this.handleAutoResize(t);
  }
  /**
   * Manually trigger character count update for a specific textarea
   */
  triggerCharacterCountUpdate(t) {
    t.dataset.showCharacterCount === "true" && this.updateCharacterCount(t);
  }
}
gc.getInstance();
class mc extends tt {
  /**
   * Initialize alert elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-dismiss-alert]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), T.handleDelegatedKeydown("[data-dismiss-alert]", (t, e) => {
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
    return y.findClosest(t, '[data-dismissible="true"]');
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(t) {
    t.classList.add("alert-dismissing"), t.style.transition = "opacity 300ms ease-out, transform 300ms ease-out", t.style.opacity = "0", t.style.transform = "translateX(100px)", setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t);
    }, 300);
  }
  /**
   * Show an alert programmatically
   */
  showAlert(t) {
    t.style.display = "block", t.style.transition = "opacity 300ms ease-out, transform 300ms ease-out", t.style.opacity = "1", t.style.transform = "translateX(0)", setTimeout(() => {
      this.dispatchAlertEvent(t, "show");
    }, 300);
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
    }, 10), a && a > 0 && setTimeout(() => {
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
    T.dispatchCustomEvent(t, "alert-action", {
      alert: t,
      action: e
    }), T.dispatchCustomEvent(document.body, "alert-action", {
      alert: t,
      action: e
    });
  }
  /**
   * Add a custom alert action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return T.addEventListener(document, "alert-action", (n) => {
      const i = n;
      i.detail.action === t && e(i.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(t) {
    y.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((n) => {
      this.dismissAlert(n);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    y.querySelectorAll('[data-dismissible="true"]').forEach((e) => {
      this.dismissAlert(e);
    });
  }
  /**
   * Clean up AlertActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
mc.getInstance();
class jh extends tt {
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
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
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
    y.querySelectorAll('[data-keys-avatar="true"]').forEach((e) => {
      this.initializeAvatar(e);
    });
  }
  /**
   * Initialize a single avatar element
   */
  initializeAvatar(t) {
    const e = t.querySelector("img"), n = t.querySelector('[data-avatar-fallback="true"]');
    if (!e)
      return;
    const i = t.getAttribute("data-fallback-type") || "icon", s = {
      element: t,
      img: e,
      fallbackContainer: n,
      hasInitials: i === "initials",
      hasIcon: i === "icon",
      retryCount: 0,
      maxRetries: this.MAX_RETRIES,
      isLoading: !1,
      hasFailed: !1
    };
    this.setState(t, s), this.setupImageErrorHandling(s), e.complete && !e.naturalWidth && this.handleImageError(s);
  }
  /**
   * Set up error handling for avatar image
   */
  setupImageErrorHandling(t) {
    t.img && (T.addEventListener(t.img, "error", () => {
      this.handleImageError(t);
    }), T.addEventListener(t.img, "load", () => {
      this.handleImageLoad(t);
    }), t.img.loading === "lazy" && this.setupLazyLoadingSupport(t));
  }
  /**
   * Handle image load error
   */
  handleImageError(t) {
    if (!t.img || t.hasFailed) return;
    const e = t.img.src;
    if (this.failedUrls.add(e), t.retryCount < t.maxRetries && !this.failedUrls.has(e)) {
      this.retryImageLoad(t);
      return;
    }
    t.hasFailed = !0, this.showFallback(t);
  }
  /**
   * Handle successful image load
   */
  handleImageLoad(t) {
    if (!t.img) return;
    const e = t.img.src;
    this.failedUrls.delete(e), t.hasFailed = !1, t.retryCount = 0, t.isLoading = !1, this.showImage(t);
  }
  /**
   * Retry loading the image after a delay
   */
  retryImageLoad(t) {
    !t.img || t.retryCount >= t.maxRetries || (t.retryCount++, t.isLoading = !0, t.element.setAttribute("data-avatar-loading", "true"), setTimeout(() => {
      if (!t.img || t.hasFailed) return;
      const e = t.img.src;
      t.img.src = "", requestAnimationFrame(() => {
        t.img && (t.img.src = e);
      });
    }, this.RETRY_DELAY * t.retryCount));
  }
  /**
   * Show the fallback (initials or icon) using existing styled template structure
   */
  showFallback(t) {
    t.img && (t.img.style.display = "none", t.fallbackContainer && (t.fallbackContainer.style.display = "block"), t.element.setAttribute("data-avatar-fallback-active", "true"), t.element.removeAttribute("data-avatar-image-active"), t.element.removeAttribute("data-avatar-loading"), this.updateAccessibility(t, "fallback"), this.dispatchAvatarEvent(t.element, "fallback", {
      hasInitials: t.hasInitials,
      hasIcon: t.hasIcon
    }));
  }
  /**
   * Show the image (hide fallback) using existing template structure
   */
  showImage(t) {
    t.img && (t.img.style.display = "block", t.fallbackContainer && (t.fallbackContainer.style.display = "none"), t.element.setAttribute("data-avatar-image-active", "true"), t.element.removeAttribute("data-avatar-fallback-active"), t.element.removeAttribute("data-avatar-loading"), this.updateAccessibility(t, "image"), this.dispatchAvatarEvent(t.element, "imageLoad", {
      src: t.img.src
    }));
  }
  /**
   * Set up lazy loading support
   */
  setupLazyLoadingSupport(t) {
    if (!t.img || !("IntersectionObserver" in window)) return;
    const e = new IntersectionObserver((n) => {
      n.forEach((i) => {
        i.isIntersecting && e.unobserve(i.target);
      });
    }, {
      rootMargin: "50px"
    });
    e.observe(t.img);
  }
  /**
   * Update accessibility attributes based on current state
   */
  updateAccessibility(t, e) {
    var s;
    const n = t.element.getAttribute("data-avatar-name"), i = (s = t.img) == null ? void 0 : s.getAttribute("alt");
    if (e === "fallback") {
      const a = t.hasInitials && n ? `Initials for ${n}` : "Avatar placeholder";
      t.element.setAttribute("aria-label", a);
    } else e === "image" && i && t.element.setAttribute("aria-label", i);
  }
  /**
   * Dispatch custom avatar events
   */
  dispatchAvatarEvent(t, e, n = {}) {
    const i = new CustomEvent(`avatar:${e}`, {
      detail: {
        element: t,
        ...n
      },
      bubbles: !0
    });
    t.dispatchEvent(i);
  }
  /**
   * Public method to manually trigger fallback for an avatar
   */
  triggerFallback(t) {
    const e = this.getState(t);
    e && !e.hasFailed && this.handleImageError(e);
  }
  /**
   * Public method to retry loading an avatar image
   */
  retryAvatar(t) {
    const e = this.getState(t);
    e && e.hasFailed && e.img && (e.hasFailed = !1, e.retryCount = 0, this.handleImageLoad(e));
  }
  /**
   * Public method to check if an avatar has failed
   */
  hasAvatarFailed(t) {
    const e = this.getState(t);
    return e ? e.hasFailed : !1;
  }
  /**
   * Clear failed URLs cache (useful for network recovery scenarios)
   */
  clearFailedUrlsCache() {
    this.failedUrls.clear();
  }
}
class bc extends tt {
  /**
   * Initialize badge elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-dismiss-target]", (t, e) => {
      e.preventDefault(), this.handleDismissClick(t);
    }), T.handleDelegatedKeydown("[data-dismiss-target]", (t, e) => {
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
    return y.querySelector(`#${n}`);
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
    } = t, c = document.createElement(o ? "button" : "span"), d = o ? `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : void 0;
    c.className = this.getBadgeClasses(e, n, i), d && (c.id = d), o && (c.setAttribute("type", "button"), c.setAttribute("data-dismiss-target", `#${d}`), c.setAttribute("aria-label", "Remove badge"));
    const f = this.buildBadgeContent(s, a, o);
    return c.innerHTML = f, l.appendChild(c), c.style.opacity = "0", c.style.transform = "scale(0.8)", setTimeout(() => {
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
        brand: "text-accent",
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
      brand: "bg-accent/10 text-accent",
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
    T.dispatchCustomEvent(t, "badge-action", {
      badge: t,
      action: e
    }), T.dispatchCustomEvent(document.body, "badge-action", {
      badge: t,
      action: e
    });
  }
  /**
   * Add a custom badge action handler with automatic cleanup
   */
  addActionHandler(t, e) {
    return T.addEventListener(document, "badge-action", (n) => {
      const i = n;
      i.detail.action === t && e(i.detail.badge);
    });
  }
  /**
   * Dismiss all badges of a specific color
   */
  dismissAllByColor(t) {
    y.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((n) => {
      this.dismissBadge(n);
    });
  }
  /**
   * Dismiss all dismissible badges
   */
  dismissAll() {
    y.querySelectorAll("[data-dismiss-target]").forEach((e) => {
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
const Ro = bc.getInstance();
class yc extends tt {
  /**
   * Initialize badge group elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll('[data-keys-badge-group="true"]').forEach((e) => {
      this.initializeBadgeGroup(e);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick('[data-badge-group-action="clear-all"]', (t, e) => {
      e.preventDefault(), this.handleClearAllClick(t);
    }), T.handleDelegatedKeydown('[data-badge-group-action="clear-all"]', (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleClearAllClick(t));
    }), T.handleDelegatedClick('[data-badge-group-action="show-more"]', (t, e) => {
      e.preventDefault(), this.handleShowMoreClick(t);
    });
  }
  /**
   * Initialize a single badge group
   */
  initializeBadgeGroup(t) {
    this.applyMaxBadgeLogic(t), this.applySizeInheritance(t), this.dispatchGroupEvent(t, "init");
  }
  /**
   * Apply max badge logic to limit visible badges
   */
  applyMaxBadgeLogic(t) {
    const e = t.getAttribute("data-max");
    if (!e) return;
    const n = parseInt(e, 10);
    if (isNaN(n) || n < 1) return;
    const i = t.querySelector('[data-badge-container="true"]') || t, s = Array.from(i.children).filter(
      (o) => o.hasAttribute("data-keys-badge") || o.classList.contains("badge")
    );
    if (s.length <= n) return;
    const a = s.slice(n);
    a.forEach((o) => {
      o.style.display = "none", o.setAttribute("data-hidden-by-max", "true");
    }), this.createOrUpdateMoreIndicator(t, i, a.length);
  }
  /**
   * Create or update the "+N more" indicator
   */
  createOrUpdateMoreIndicator(t, e, n) {
    const i = e.querySelector('[data-badge-group-action="show-more"]');
    i && i.remove();
    const s = document.createElement("button");
    s.className = "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral/10 text-neutral hover:bg-neutral/20 transition-colors duration-200", s.setAttribute("data-badge-group-action", "show-more"), s.setAttribute("data-hidden-count", n.toString()), s.setAttribute("type", "button"), s.setAttribute("aria-label", `Show ${n} more badges`), s.innerHTML = `+${n} more`, e.appendChild(s);
  }
  /**
   * Apply size inheritance to child badges
   */
  applySizeInheritance(t) {
    const e = t.getAttribute("data-size");
    if (!e) return;
    t.style.setProperty("--badge-group-size", e), t.querySelectorAll('[data-keys-badge="true"]:not([data-size])').forEach((i) => {
      i.setAttribute("data-size", e), this.updateBadgeSizeClasses(i, e);
    });
  }
  /**
   * Update badge CSS classes for size inheritance
   */
  updateBadgeSizeClasses(t, e) {
    t.classList.remove("px-1.5", "py-0.5", "text-xs", "px-2.5", "px-3", "py-1", "text-sm");
    const n = {
      xs: ["px-1.5", "py-0.5", "text-xs"],
      sm: ["px-2.5", "py-0.5", "text-xs"],
      md: ["px-3", "py-1", "text-sm"]
    }, i = n[e] || n.sm;
    t.classList.add(...i);
  }
  /**
   * Handle "Clear All" button click
   */
  handleClearAllClick(t) {
    const e = this.findBadgeGroupForButton(t);
    e && (this.clearAllBadges(e), this.dispatchGroupEvent(e, "clear-all"));
  }
  /**
   * Handle "Show More" button click
   */
  handleShowMoreClick(t) {
    const e = this.findBadgeGroupForButton(t);
    e && (this.showAllBadges(e), this.dispatchGroupEvent(e, "show-more"));
  }
  /**
   * Find the badge group element associated with an action button
   */
  findBadgeGroupForButton(t) {
    return t.closest('[data-keys-badge-group="true"]');
  }
  /**
   * Clear all dismissible badges in a group
   */
  clearAllBadges(t) {
    t.querySelectorAll('[data-dismiss-target], [data-dismissible="true"]').forEach((i) => {
      if (i.hasAttribute("data-dismiss-target")) {
        const s = i.getAttribute("data-dismiss-target");
        if (s) {
          const a = y.querySelector(s.startsWith("#") ? s : `#${s}`);
          a && Ro.dismissBadge(a);
        }
      } else
        Ro.dismissBadge(i);
    });
    const n = t.querySelector('[data-badge-group-action="show-more"]');
    n && n.remove();
  }
  /**
   * Show all hidden badges in a group
   */
  showAllBadges(t) {
    t.querySelectorAll('[data-hidden-by-max="true"]').forEach((i) => {
      i.style.display = "", i.removeAttribute("data-hidden-by-max");
    });
    const n = t.querySelector('[data-badge-group-action="show-more"]');
    n && n.remove(), t.setAttribute("data-all-badges-shown", "true");
  }
  /**
   * Add a badge to a group programmatically
   */
  addBadgeToGroup(t, e) {
    const n = t.getAttribute("data-size"), i = e.size || n || "sm", s = Ro.createBadge({
      ...e,
      size: i,
      container: t.querySelector('[data-badge-container="true"]') || t
    });
    return this.applyMaxBadgeLogic(t), this.dispatchGroupEvent(t, "badge-added", [s]), s;
  }
  /**
   * Refresh a badge group (re-apply all logic)
   */
  refreshBadgeGroup(t) {
    this.initializeBadgeGroup(t);
  }
  /**
   * Dispatch custom event for badge group action
   */
  dispatchGroupEvent(t, e, n) {
    T.dispatchCustomEvent(t, "badge-group-action", {
      group: t,
      action: e,
      badges: n
    }), T.dispatchCustomEvent(document.body, "badge-group-action", {
      group: t,
      action: e,
      badges: n
    });
  }
  /**
   * Add a custom badge group action handler
   */
  addGroupActionHandler(t, e) {
    return T.addEventListener(document, "badge-group-action", (n) => {
      const i = n;
      i.detail.action === t && e(i.detail.group, i.detail.badges);
    });
  }
  /**
   * Initialize badge groups that are added dynamically
   */
  initializeDynamicGroups() {
    y.querySelectorAll('[data-keys-badge-group="true"]:not([data-group-initialized])').forEach((e) => {
      this.initializeBadgeGroup(e), e.setAttribute("data-group-initialized", "true");
    });
  }
  /**
   * Clean up BadgeGroupActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
yc.getInstance();
class vc extends tt {
  constructor() {
    super(...arguments), this.buttonStates = /* @__PURE__ */ new Map();
  }
  /**
   * Initialize multi-state button elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll('[data-multi-state="true"]').forEach((e) => {
      this.initializeButton(e);
    });
  }
  /**
   * Initialize a single multi-state button
   */
  initializeButton(t) {
    this.buttonStates.set(t, {
      current: "default",
      cycling: !1,
      element: t
    }), this.updateIconState(t, "default");
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick('[data-multi-state="true"]', (t, e) => {
      e.preventDefault(), this.handleButtonClick(t);
    }), T.handleDelegatedKeydown('[data-multi-state="true"]', (t, e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.handleButtonClick(t));
    });
  }
  /**
   * Handle multi-state button click
   */
  async handleButtonClick(t) {
    const e = this.buttonStates.get(t);
    if (!e || e.cycling) return;
    const n = this.getNextState(e.current, t);
    e.cycling = !0, await this.transitionToState(t, n), e.current = n, e.cycling = !1, n === "success" && setTimeout(async () => {
      e.current === "success" && (e.cycling = !0, await this.transitionToState(t, "default"), e.current = "default", e.cycling = !1);
    }, 2e3), this.dispatchButtonEvent(t, n);
  }
  /**
   * Determine the next state for a button
   */
  getNextState(t, e) {
    const n = e.dataset.iconToggle, i = e.dataset.iconSuccess;
    switch (t) {
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
  async transitionToState(t, e) {
    this.updateIconState(t, e), this.updateButtonLabel(t, e), e === "success" && this.animateSuccessFeedback(t);
  }
  /**
   * Update button icon state using CSS classes
   */
  updateIconState(t, e) {
    const n = y.querySelector(".button-icon-default", t), i = y.querySelector(".button-icon-toggle", t), s = y.querySelector(".button-icon-success", t);
    [n, i, s].forEach((o) => {
      o && (o.classList.remove("opacity-100", "scale-110"), o.classList.add("opacity-0"));
    });
    let a = null;
    switch (e) {
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
  updateButtonLabel(t, e) {
    const n = y.querySelector(".sr-only", t);
    let i = null, s = null;
    switch (e) {
      case "default":
        const a = this.getOriginalLabel(t);
        i = a, s = a;
        break;
      case "toggle":
        i = t.dataset.labelToggle || null, s = t.dataset.labelToggle || null;
        break;
      case "success":
        i = t.dataset.labelSuccess || null, s = t.dataset.labelSuccess || null;
        break;
    }
    i && n && (n.textContent = i), s && t.setAttribute("aria-label", s), e === "toggle" ? t.setAttribute("aria-pressed", "true") : t.removeAttribute("aria-pressed");
  }
  /**
   * Get the original label for a button
   */
  getOriginalLabel(t) {
    var n;
    if (t.dataset.originalLabel)
      return t.dataset.originalLabel;
    const e = (n = t.textContent) == null ? void 0 : n.trim();
    return e ? (t.dataset.originalLabel = e, e) : t.getAttribute("aria-label") || "Button";
  }
  /**
   * Animate success feedback with scale and timing
   */
  animateSuccessFeedback(t) {
    t.classList.add("scale-105"), setTimeout(() => {
      t.classList.remove("scale-105");
    }, 200);
  }
  /**
   * Dispatch custom event for button state change
   */
  dispatchButtonEvent(t, e) {
    T.dispatchCustomEvent(t, "button-state-change", {
      element: t,
      state: e,
      timestamp: Date.now()
    });
  }
  /**
   * Public method to manually set button state
   */
  setButtonState(t, e) {
    const n = this.buttonStates.get(t);
    n || this.initializeButton(t), this.transitionToState(t, e), n && (n.current = e);
  }
  /**
   * Public method to get current button state
   */
  getButtonState(t) {
    const e = this.buttonStates.get(t);
    return e ? e.current : "default";
  }
  /**
   * Add a custom state change handler with automatic cleanup
   */
  addStateChangeHandler(t) {
    return T.addEventListener(document, "button-state-change", (e) => {
      const n = e;
      t(n.detail.element, n.detail.state);
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
const xa = class xa {
  /**
   * Format Date object to string using custom format
   */
  static formatDate(t, e) {
    if (!t || isNaN(t.getTime()))
      return "";
    const n = t.getFullYear(), i = t.getMonth() + 1, s = t.getDate(), a = [
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
    let o = e;
    for (const [l, c] of a)
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
xa.MONTH_NAMES = [
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
], xa.MONTH_NAMES_SHORT = [
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
let yt = xa;
class Pe {
  /**
   * Handle date selection for both single and range modes
   */
  static selectDate(t, e, n, i) {
    n.isDisabled || (n.isRange ? this.handleRangeSelection(t, e, n, i) : i({
      selectedDate: e,
      focusedDate: e
    }));
  }
  /**
   * Handle range selection logic with proper start/end management
   */
  static handleRangeSelection(t, e, n, i) {
    const s = new Date(e);
    if (!n.startDate || n.rangeSelectionState === "none") {
      i({
        startDate: e,
        endDate: null,
        focusedDate: e,
        rangeSelectionState: "selecting-end"
      });
      return;
    }
    if (n.startDate && !n.endDate) {
      const a = new Date(n.startDate);
      s < a ? i({
        startDate: e,
        endDate: null,
        focusedDate: e,
        rangeSelectionState: "selecting-end"
      }) : s.getTime() === a.getTime() ? i({
        startDate: null,
        endDate: null,
        focusedDate: e,
        rangeSelectionState: "none"
      }) : i({
        endDate: e,
        focusedDate: e,
        rangeSelectionState: "none"
      });
      return;
    }
    i({
      startDate: e,
      endDate: null,
      focusedDate: e,
      rangeSelectionState: "selecting-end"
    });
  }
  /**
   * Clear selected dates (single or range)
   */
  static clearSelection(t, e, n) {
    e.isRange ? n({
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
  static selectToday(t, e, n) {
    const i = this.getTodayDate();
    e.isRange ? n({
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
  static formatRangeForDisplay(t, e) {
    return !t && !e ? "" : t && e ? `${t},${e}` : t ? `${t},` : "";
  }
  /**
   * Check if a date is within the selected range
   */
  static isDateInRange(t, e, n) {
    if (!e || !n) return !1;
    const i = new Date(t), s = new Date(e), a = new Date(n);
    return i >= s && i <= a;
  }
  /**
   * Check if a date is the range start
   */
  static isDateRangeStart(t, e) {
    return e === t;
  }
  /**
   * Check if a date is the range end
   */
  static isDateRangeEnd(t, e) {
    return e === t;
  }
  /**
   * Get range attributes for styling
   */
  static getRangeAttributes(t, e) {
    if (!e.isRange) return "";
    const n = [];
    return t.isInRange && n.push('data-is-in-range="true"'), t.isRangeStart && n.push('data-is-range-start="true"'), t.isRangeEnd && n.push('data-is-range-end="true"'), n.join(" ");
  }
  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getTodayDate() {
    const t = /* @__PURE__ */ new Date();
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  }
  /**
   * Check if a date string represents today
   */
  static isToday(t) {
    return t === this.getTodayDate();
  }
}
class om {
  /**
   * Generate calendar grid data for a specific month
   */
  static generateCalendarGrid(t, e, n = 0) {
    const i = this.addMonthsToDate(e.currentMonth + "-01", n), s = parseInt(i.substring(0, 4)), a = parseInt(i.substring(5, 7)) - 1, o = new Date(s, a, 1), l = new Date(o);
    l.setDate(l.getDate() - o.getDay());
    const c = [];
    let d = [];
    for (let f = 0; f < 42; f++) {
      const h = new Date(l);
      h.setDate(l.getDate() + f);
      const p = this.formatDateString(h), m = h.getMonth() === a, b = Pe.isToday(p), k = e.selectedDate === p, v = this.isDateDisabled(t, h, e), S = e.isRange ? Pe.isDateInRange(p, e.startDate, e.endDate) : !1, E = e.isRange ? Pe.isDateRangeStart(p, e.startDate) : !1, C = e.isRange ? Pe.isDateRangeEnd(p, e.endDate) : !1, I = {
        date: p,
        day: h.getDate(),
        isCurrentMonth: m,
        isToday: b,
        isSelected: k,
        isDisabled: v,
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
  static renderCalendarGrid(t, e) {
    e.monthsToShow > 1 ? this.renderMultipleMonths(t, e) : this.renderSingleMonth(t, e);
  }
  /**
   * Render a single month calendar
   */
  static renderSingleMonth(t, e) {
    const n = t.querySelector("[data-calendar-grid-container]");
    if (!n) return;
    const i = this.generateCalendarGrid(t, e), s = this.getCellClasses(t), a = e.weekdays.map(
      (c) => `<div class="${s} font-semibold text-muted text-center">${c}</div>`
    ).join(""), o = i.map(
      (c) => c.map((d) => {
        const f = this.getDayButtonClasses(d, t, e), h = Pe.getRangeAttributes(d, e), p = this.getDateAriaLabel(d, e);
        return `
                    <div class="calendar-day ${s}">
                        <button
                            type="button"
                            class="${f}"
                            data-date="${d.date}"
                            data-calendar-day-btn
                            ${d.isDisabled ? "disabled" : ""}
                            ${h}
                            aria-label="${p}"
                            tabindex="${d.date === e.focusedDate ? "0" : "-1"}"
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
  static renderMultipleMonths(t, e) {
    t.querySelectorAll("[data-calendar-grid-container]").forEach((i, s) => {
      if (s >= e.monthsToShow) return;
      const a = this.generateCalendarGrid(t, e, s), o = this.getCellClasses(t), l = this.addMonthsToDate(e.currentMonth + "-01", s), c = e.monthNames[parseInt(l.substring(5, 7)) - 1], d = l.substring(0, 4), f = `
                <div class="calendar-month-header text-center font-semibold text-sm mb-2 text-muted">
                    ${c} ${d}
                </div>
            `, h = e.weekdays.map(
        (b) => `<div class="${o} font-semibold text-muted text-center text-xs">${b}</div>`
      ).join(""), p = a.map(
        (b) => b.map((k) => {
          const v = this.getDayButtonClasses(k, t, e), S = Pe.getRangeAttributes(k, e), E = this.getDateAriaLabel(k, e);
          return `
                        <div class="calendar-day ${o}">
                            <button
                                type="button"
                                class="${v}"
                                data-date="${k.date}"
                                data-calendar-day-btn
                                data-month-index="${s}"
                                ${k.isDisabled ? "disabled" : ""}
                                ${S}
                                aria-label="${E}"
                                tabindex="${k.date === e.focusedDate ? "0" : "-1"}"
                            >
                                ${k.day}
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
                    ${p}
                </div>
            `;
      i.innerHTML = m;
    });
  }
  /**
   * Get responsive cell classes based on calendar size
   */
  static getCellClasses(t) {
    const e = t.dataset.size || "sm";
    return {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base"
    }[e] || "w-8 h-8 text-xs";
  }
  /**
   * Get day button classes with proper state styling
   */
  static getDayButtonClasses(t, e, n) {
    const i = e.dataset.size || "sm", s = "w-full h-full rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1", a = {
      sm: "text-xs",
      md: "text-sm font-medium",
      lg: "text-base font-medium"
    }[i] || "text-sm font-medium";
    let o = "";
    return t.isDisabled ? o = "bg-elevation-1 text-muted border-transparent cursor-not-allowed opacity-40 hover:bg-elevation-1 hover:border-transparent" : t.isSelected && !n.isRange ? o = "bg-accent text-white border-accent-600 font-bold shadow-sm" : t.isToday ? o = "bg-neutral-50 text-accent border-accent font-semibold" : t.isCurrentMonth ? o = "text-primary border-transparent hover:bg-neutral-hover hover:border-line" : o = "text-muted border-transparent hover:bg-neutral-hover hover:border-line", `${s} ${a} ${o}`.trim();
  }
  /**
   * Generate accessible aria-label for date buttons
   */
  static getDateAriaLabel(t, e) {
    const n = new Date(t.date), i = n.toLocaleDateString("en-US", { weekday: "long" }), s = n.toLocaleDateString("en-US", { month: "long" });
    let a = `${i}, ${s} ${t.day}, ${n.getFullYear()}`;
    return t.isToday && (a += ", today"), t.isSelected && (a += ", selected"), t.isRangeStart && (a += ", range start"), t.isRangeEnd && (a += ", range end"), t.isInRange && (a += ", in range"), t.isDisabled && (a += ", disabled"), a;
  }
  /**
   * Check if a date should be disabled
   */
  static isDateDisabled(t, e, n) {
    if (n.isDisabled) return !0;
    const i = this.formatDateString(e);
    return n.minDate && i < n.minDate || n.maxDate && i > n.maxDate ? !0 : n.disabledDates && Array.isArray(n.disabledDates) ? n.disabledDates.includes(i) : !1;
  }
  /**
   * Format date as YYYY-MM-DD string
   */
  static formatDateString(t) {
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  }
  /**
   * Add months to a date string
   */
  static addMonthsToDate(t, e) {
    const n = new Date(t);
    return n.setMonth(n.getMonth() + e), this.formatDateString(n);
  }
}
class wn {
  /**
   * Navigate to previous or next month
   */
  static navigateMonth(t, e, n, i, s) {
    if (n.isDisabled) return;
    const a = /* @__PURE__ */ new Date(n.currentMonth + "-01"), o = new Date(a);
    e === "prev" ? o.setMonth(a.getMonth() - 1) : o.setMonth(a.getMonth() + 1);
    const l = this.formatYearMonth(o);
    this.canNavigateToMonth(o, n) && (i({
      currentMonth: l,
      viewMode: "calendar"
    }), s(), this.updateMonthYearDisplay(t, n.monthNames, l));
  }
  /**
   * Navigate to today's month
   */
  static navigateToToday(t, e, n, i) {
    const s = /* @__PURE__ */ new Date(), a = this.formatYearMonth(s);
    a !== e.currentMonth && (n({
      currentMonth: a,
      viewMode: "calendar"
    }), i(), this.updateMonthYearDisplay(t, e.monthNames, a));
  }
  /**
   * Toggle month/year dropdown
   */
  static toggleMonthYearDropdown(t, e, n, i) {
    e.isDisabled || (e.viewMode === "calendar" ? (n({ viewMode: "month" }), this.renderMonthGrid(t, e, n, i)) : e.viewMode === "month" ? (n({ viewMode: "year" }), this.renderYearGrid(t, e, n, i)) : (n({ viewMode: "calendar" }), i()));
  }
  /**
   * Render month selection grid
   */
  static renderMonthGrid(t, e, n, i) {
    const s = t.querySelector("[data-calendar-grid-container]");
    if (!s) return;
    const a = parseInt(e.currentMonth.substring(0, 4)), o = parseInt(e.currentMonth.substring(5, 7)) - 1, l = e.monthNames.map((f, h) => {
      const p = h === o, m = this.isMonthDisabled(t, a, h, e);
      return `
                <button
                    type="button"
                    class="${this.getMonthButtonClasses(p, m)} month-option"
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
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-year-nav="prev"
                    aria-label="Previous year"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    type="button"
                    class="text-lg font-semibold px-4 py-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-year-btn
                    aria-label="Select year ${a}"
                >
                    ${a}
                </button>

                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
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
    s.innerHTML = d, this.bindMonthGridEvents(t, e, n, i);
  }
  /**
   * Render year selection grid
   */
  static renderYearGrid(t, e, n, i) {
    const s = t.querySelector("[data-calendar-grid-container]");
    if (!s) return;
    const a = parseInt(e.currentMonth.substring(0, 4)), o = Math.floor(a / 10) * 10, c = Array.from({ length: 12 }, (h, p) => o - 1 + p).map((h) => {
      const p = h === a, m = this.isYearDisabled(t, h, e), b = h < o || h >= o + 10;
      return `
                <button
                    type="button"
                    class="${this.getYearButtonClasses(p, m, b)} year-option"
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
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
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
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
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
    s.innerHTML = f, this.bindYearGridEvents(t, e, n, i);
  }
  /**
   * Select a specific month
   */
  static selectMonth(t, e, n, i, s) {
    const o = `${n.currentMonth.substring(0, 4)}-${String(e + 1).padStart(2, "0")}`;
    i({
      currentMonth: o,
      viewMode: "calendar"
    }), s(), this.updateMonthYearDisplay(t, n.monthNames, o);
  }
  /**
   * Select a specific year
   */
  static selectYear(t, e, n, i, s) {
    const a = n.currentMonth.substring(5, 7), o = `${e}-${a}`;
    i({
      currentMonth: o,
      viewMode: "month"
    }), this.renderMonthGrid(t, n, i, s);
  }
  /**
   * Navigate year in month/year picker
   */
  static navigateYear(t, e, n, i, s) {
    if (n.isDisabled) return;
    const a = parseInt(n.currentMonth.substring(0, 4)), o = e === "prev" ? a - 1 : a + 1, l = n.currentMonth.substring(5, 7), c = `${o}-${l}`;
    i({
      currentMonth: c
    }), n.viewMode === "year" ? this.renderYearGrid(t, n, i, s) : n.viewMode === "month" && this.renderMonthGrid(t, n, i, s);
  }
  /**
   * Check if navigation to a specific month is allowed
   */
  static canNavigateToMonth(t, e) {
    if (e.minDate) {
      const n = new Date(e.minDate), i = new Date(n.getFullYear(), n.getMonth(), 1);
      if (t < i) return !1;
    }
    if (e.maxDate) {
      const n = new Date(e.maxDate), i = new Date(n.getFullYear(), n.getMonth(), 1);
      if (t > i) return !1;
    }
    return !0;
  }
  /**
   * Check if a specific month is disabled
   */
  static isMonthDisabled(t, e, n, i) {
    if (i.minDate) {
      const s = new Date(i.minDate);
      if (e < s.getFullYear() || e === s.getFullYear() && n < s.getMonth())
        return !0;
    }
    if (i.maxDate) {
      const s = new Date(i.maxDate);
      if (e > s.getFullYear() || e === s.getFullYear() && n > s.getMonth())
        return !0;
    }
    return !1;
  }
  /**
   * Check if a specific year is disabled
   */
  static isYearDisabled(t, e, n) {
    return !!(n.minDate && e < new Date(n.minDate).getFullYear() || n.maxDate && e > new Date(n.maxDate).getFullYear());
  }
  /**
   * Update month/year display in header
   */
  static updateMonthYearDisplay(t, e, n) {
    const i = t.querySelector(".calendar-month-year-display");
    if (!i) return;
    const s = n.substring(0, 4), a = parseInt(n.substring(5, 7)) - 1, o = e[a];
    i.textContent = `${o} ${s}`;
  }
  /**
   * Get month button classes
   */
  static getMonthButtonClasses(t, e) {
    const n = "w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent";
    return e ? `${n} bg-elevation-1 text-muted cursor-not-allowed opacity-50` : t ? `${n} bg-accent text-white font-semibold shadow-sm` : `${n} text-primary hover:bg-neutral-hover hover:scale-105`;
  }
  /**
   * Get year button classes
   */
  static getYearButtonClasses(t, e, n) {
    const i = "w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent";
    return e ? `${i} bg-elevation-1 text-muted cursor-not-allowed opacity-50` : t ? `${i} bg-accent text-white font-semibold shadow-sm` : n ? `${i} text-muted hover:bg-neutral-hover opacity-75` : `${i} text-primary hover:bg-neutral-hover hover:scale-105`;
  }
  /**
   * Format date as YYYY-MM string
   */
  static formatYearMonth(t) {
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0");
  }
  /**
   * Bind month grid event listeners
   */
  static bindMonthGridEvents(t, e, n, i) {
    var s;
    t.querySelectorAll("[data-calendar-month-btn]").forEach((a) => {
      a.addEventListener("click", (o) => {
        const l = parseInt(o.target.dataset.month || "0");
        this.selectMonth(t, l, e, n, i);
      });
    }), (s = t.querySelector("[data-calendar-year-btn]")) == null || s.addEventListener("click", () => {
      n({ viewMode: "year" }), this.renderYearGrid(t, e, n, i);
    });
  }
  /**
   * Bind year grid event listeners
   */
  static bindYearGridEvents(t, e, n, i) {
    t.querySelectorAll("[data-calendar-year-option]").forEach((s) => {
      s.addEventListener("click", (a) => {
        const o = parseInt(a.target.dataset.year || "0");
        this.selectYear(t, o, e, n, i);
      });
    }), t.querySelectorAll("[data-calendar-decade-nav]").forEach((s) => {
      s.addEventListener("click", (a) => {
        const o = a.target.dataset.calendarDecadeNav, l = parseInt(e.currentMonth.substring(0, 4)), c = Math.floor(l / 10) * 10, h = `${(o === "prev" ? c - 10 : c + 10) + l % 10}-${e.currentMonth.substring(5, 7)}`;
        n({ currentMonth: h }), this.renderYearGrid(t, e, n, i);
      });
    });
  }
}
class Po {
  /**
   * Handle keyboard navigation
   */
  static handleKeydown(t, e, n, i, s, a) {
    if (n.isDisabled || !n.focusedDate) return;
    const { key: o, ctrlKey: l, shiftKey: c } = e;
    switch (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", "Enter", " ", "Escape"].includes(o) && e.preventDefault(), o) {
      case "ArrowLeft":
        this.navigateByDays(t, -1, n, i, a);
        break;
      case "ArrowRight":
        this.navigateByDays(t, 1, n, i, a);
        break;
      case "ArrowUp":
        this.navigateByDays(t, -7, n, i, a);
        break;
      case "ArrowDown":
        this.navigateByDays(t, 7, n, i, a);
        break;
      case "PageUp":
        c ? this.navigateByYears(t, -1, n, i, a) : this.navigateByMonths(t, -1, n, i, a);
        break;
      case "PageDown":
        c ? this.navigateByYears(t, 1, n, i, a) : this.navigateByMonths(t, 1, n, i, a);
        break;
      case "Home":
        l ? this.navigateToToday(t, n, i, a) : this.navigateToWeekStart(t, n, i, a);
        break;
      case "End":
        this.navigateToWeekEnd(t, n, i, a);
        break;
      case "Enter":
      case " ":
        n.focusedDate && s(n.focusedDate);
        break;
      case "Escape":
        this.handleEscape(t, n, i, a);
        break;
      case "t":
      case "T":
        !l && !c && this.navigateToToday(t, n, i, a);
        break;
    }
  }
  /**
   * Navigate by a specific number of days
   */
  static navigateByDays(t, e, n, i, s) {
    if (!n.focusedDate) return;
    const a = this.addDaysToDate(n.focusedDate, e);
    this.isDateNavigable(a, n) && this.focusDate(t, a, n, i, s);
  }
  /**
   * Navigate by a specific number of months
   */
  static navigateByMonths(t, e, n, i, s) {
    if (!n.focusedDate) return;
    const a = new Date(n.focusedDate), o = new Date(a);
    o.setMonth(a.getMonth() + e), o.getDate() !== a.getDate() && o.setDate(0);
    const l = this.formatDateString(o);
    if (this.isDateNavigable(l, n)) {
      const c = this.formatYearMonth(o);
      c !== n.currentMonth ? (i({
        currentMonth: c,
        focusedDate: l
      }), s()) : this.focusDate(t, l, n, i, s);
    }
  }
  /**
   * Navigate by a specific number of years
   */
  static navigateByYears(t, e, n, i, s) {
    if (!n.focusedDate) return;
    const a = new Date(n.focusedDate), o = new Date(a);
    o.setFullYear(a.getFullYear() + e), o.getMonth() !== a.getMonth() && o.setDate(0);
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
  static navigateToWeekStart(t, e, n, i) {
    if (!e.focusedDate) return;
    const s = new Date(e.focusedDate), a = s.getDay(), o = new Date(s);
    o.setDate(s.getDate() - a);
    const l = this.formatDateString(o);
    this.isDateNavigable(l, e) && this.focusDate(t, l, e, n, i);
  }
  /**
   * Navigate to the end of the current week (Saturday)
   */
  static navigateToWeekEnd(t, e, n, i) {
    if (!e.focusedDate) return;
    const s = new Date(e.focusedDate), a = 6 - s.getDay(), o = new Date(s);
    o.setDate(s.getDate() + a);
    const l = this.formatDateString(o);
    this.isDateNavigable(l, e) && this.focusDate(t, l, e, n, i);
  }
  /**
   * Navigate to today's date
   */
  static navigateToToday(t, e, n, i) {
    const s = this.getTodayDate();
    if (this.isDateNavigable(s, e)) {
      const a = this.formatYearMonth(new Date(s));
      a !== e.currentMonth ? (n({
        currentMonth: a,
        focusedDate: s
      }), i()) : this.focusDate(t, s, e, n, i);
    }
  }
  /**
   * Handle Escape key - close dropdowns or cancel operations
   */
  static handleEscape(t, e, n, i) {
    e.viewMode !== "calendar" ? (n({ viewMode: "calendar" }), setTimeout(() => i(), 100)) : e.isRange && e.rangeSelectionState === "selecting-end" && (n({
      rangeSelectionState: "none",
      startDate: null,
      endDate: null
    }), setTimeout(() => i(), 100));
  }
  /**
   * Focus a specific date and update visual state
   */
  static focusDate(t, e, n, i, s) {
    i({ focusedDate: e }), t.querySelectorAll("[data-calendar-day-btn]").forEach((o) => {
      o.setAttribute("tabindex", "-1");
    });
    const a = t.querySelector(`[data-calendar-day-btn][data-date="${e}"]`);
    a && (a.setAttribute("tabindex", "0"), a.focus());
  }
  /**
   * Check if a date can be navigated to (not disabled)
   */
  static isDateNavigable(t, e) {
    return !(e.minDate && t < e.minDate || e.maxDate && t > e.maxDate || e.disabledDates.includes(t));
  }
  /**
   * Add days to a date string
   */
  static addDaysToDate(t, e) {
    const n = new Date(t);
    return n.setDate(n.getDate() + e), this.formatDateString(n);
  }
  /**
   * Format date as YYYY-MM-DD string
   */
  static formatDateString(t) {
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  }
  /**
   * Format date as YYYY-MM string
   */
  static formatYearMonth(t) {
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0");
  }
  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getTodayDate() {
    const t = /* @__PURE__ */ new Date();
    return this.formatDateString(t);
  }
  /**
   * Set up keyboard event listeners for a calendar
   */
  static bindKeyboardEvents(t, e, n, i, s) {
    t.removeEventListener("keydown", t.dataset.keydownHandler);
    const a = (o) => {
      this.handleKeydown(t, o, e, n, i, s);
    };
    t.dataset.keydownHandler = a.toString(), t.addEventListener("keydown", a), t.hasAttribute("tabindex") || t.setAttribute("tabindex", "0");
  }
  /**
   * Initialize focus for a calendar
   */
  static initializeFocus(t, e) {
    const n = e.focusedDate || this.getTodayDate(), i = t.querySelector(`[data-calendar-day-btn][data-date="${n}"]`);
    i && (i.setAttribute("tabindex", "0"), document.activeElement === t && i.focus());
  }
  /**
   * Cleanup keyboard event listeners
   */
  static unbindKeyboardEvents(t) {
    const e = t.dataset.keydownHandler;
    e && (t.removeEventListener("keydown", e), delete t.dataset.keydownHandler);
  }
}
class en {
  /**
   * Update hidden form inputs based on current selection
   */
  static updateHiddenInput(t, e) {
    e.isRange ? this.updateRangeInputs(t, e) : this.updateSingleInput(t, e);
  }
  /**
   * Update hidden inputs for range mode
   */
  static updateRangeInputs(t, e) {
    const n = t.querySelector(".calendar-start-input"), i = t.querySelector(".calendar-end-input"), s = t.querySelector(".calendar-range-input");
    n && (n.value = e.startDate || ""), i && (i.value = e.endDate || ""), s && (s.value = Pe.formatRangeForDisplay(e.startDate, e.endDate)), [n, i, s].forEach((a) => {
      a && this.dispatchInputChangeEvent(a);
    });
  }
  /**
   * Update hidden input for single date mode
   */
  static updateSingleInput(t, e) {
    const n = t.querySelector(".calendar-hidden-input");
    n && (n.value = e.selectedDate || "", this.dispatchInputChangeEvent(n));
  }
  /**
   * Dispatch change event on input for framework integration
   */
  static dispatchInputChangeEvent(t) {
    const e = new Event("input", { bubbles: !0 }), n = new Event("change", { bubbles: !0 });
    t.dispatchEvent(e), t.dispatchEvent(n), window.Livewire && t.hasAttribute("wire:model") && window.Livewire.hook("message.processed", () => {
    });
  }
  /**
   * Handle quick selector actions
   */
  static handleQuickSelector(t, e, n, i, s) {
    const a = /* @__PURE__ */ new Date();
    let o = null, l = null, c = null;
    switch (e) {
      case "today":
        if (c = this.formatDateString(a), this.isDateDisabled(c, n)) {
          console.warn("Today is disabled and cannot be selected");
          return;
        }
        n.isRange && (o = c, l = c);
        break;
      case "yesterday":
        const p = new Date(a);
        if (p.setDate(p.getDate() - 1), c = this.formatDateString(p), this.isDateDisabled(c, n)) {
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
          const m = new Date(a.getFullYear(), a.getMonth(), 1), b = new Date(a.getFullYear(), a.getMonth() + 1, 0);
          o = this.formatDateString(m), l = this.formatDateString(b);
        }
        break;
      case "lastmonth":
        if (n.isRange) {
          const m = new Date(a.getFullYear(), a.getMonth() - 1, 1), b = new Date(a.getFullYear(), a.getMonth(), 0);
          o = this.formatDateString(m), l = this.formatDateString(b);
        }
        break;
      case "thisyear":
        if (n.isRange) {
          const m = new Date(a.getFullYear(), 0, 1), b = new Date(a.getFullYear(), 11, 31);
          o = this.formatDateString(m), l = this.formatDateString(b);
        }
        break;
      default:
        console.warn(`Unknown quick selector value: ${e}`);
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
    }), s(), wn.updateMonthYearDisplay(t, n.monthNames, f), this.updateHiddenInput(t, n);
    const h = c ? yt.formatDateForDisplay(c, n.displayFormat) : null;
    o && yt.formatDateForDisplay(o, n.displayFormat), l && yt.formatDateForDisplay(l, n.displayFormat), n.isRange && o && l ? this.dispatchCalendarEvent(t, "rangeSelected", {
      startDate: o,
      endDate: l,
      formattedRange: yt.formatRangeForDisplay(o, l, n.displayFormat),
      source: "quickSelector"
    }) : !n.isRange && c && this.dispatchCalendarEvent(t, "dateSelected", {
      selectedDate: c,
      formattedDate: h,
      source: "quickSelector"
    });
  }
  /**
   * Check if a date is disabled based on calendar constraints
   */
  static isDateDisabled(t, e) {
    const n = yt.parseDate(t);
    if (!n) return !0;
    if (e.minDate) {
      const i = yt.parseDate(e.minDate);
      if (i && n < i)
        return !0;
    }
    if (e.maxDate) {
      const i = yt.parseDate(e.maxDate);
      if (i && n > i)
        return !0;
    }
    return !!(e.disabledDates && e.disabledDates.includes(t));
  }
  /**
   * Handle footer actions (clear, today)
   */
  static handleFooterAction(t, e, n, i, s) {
    switch (e) {
      case "clear":
        Pe.clearSelection(t, n, i), s(), this.updateHiddenInput(t, n), this.dispatchCalendarEvent(t, "cleared", {
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
        }), s(), wn.updateMonthYearDisplay(t, n.monthNames, o), this.updateHiddenInput(t, n);
        const l = yt.formatDateForDisplay(a, n.displayFormat);
        this.dispatchCalendarEvent(t, "dateSelected", {
          selectedDate: n.isRange ? null : a,
          startDate: n.isRange ? a : null,
          endDate: n.isRange ? a : null,
          formattedDate: n.isRange ? null : l,
          formattedRange: n.isRange ? `${l} - ${l}` : null,
          source: "footerAction"
        });
        break;
      default:
        console.warn(`Unknown footer action: ${e}`);
    }
  }
  /**
   * Dispatch custom calendar events for framework integration
   */
  static dispatchCalendarEvent(t, e, n = null) {
    const i = new CustomEvent(`calendar:${e}`, {
      bubbles: !0,
      cancelable: !0,
      detail: {
        calendar: t,
        ...n
      }
    });
    t.dispatchEvent(i), document.dispatchEvent(new CustomEvent(`keys:calendar:${e}`, {
      bubbles: !0,
      cancelable: !0,
      detail: {
        calendar: t,
        ...n
      }
    }));
  }
  /**
   * Bind form integration event listeners
   */
  static bindFormEvents(t, e, n, i) {
    t.addEventListener("quickSelector:clicked", (s) => {
      var o;
      const a = (o = s.detail) == null ? void 0 : o.value;
      a && this.handleQuickSelector(t, a, e, n, i);
    }), t.addEventListener("click", (s) => {
      const a = s.target.closest("[data-quick-selector]");
      if (a && !t.closest("[data-keys-date-picker]")) {
        const l = a.dataset.quickSelector;
        l && this.handleQuickSelector(t, l, e, n, i);
      }
    }), t.addEventListener("click", (s) => {
      const a = s.target.closest("[data-calendar-action]");
      if (a) {
        const o = a.dataset.calendarAction;
        o && this.handleFooterAction(t, o, e, n, i);
      }
    });
  }
  /**
   * Get current calendar state for external access
   */
  static getCalendarState(t, e) {
    return {
      currentMonth: e.currentMonth,
      selectedDate: e.selectedDate,
      startDate: e.startDate,
      endDate: e.endDate,
      focusedDate: e.focusedDate,
      isRange: e.isRange,
      isDisabled: e.isDisabled,
      viewMode: e.viewMode,
      rangeSelectionState: e.rangeSelectionState,
      formattedValue: e.isRange ? Pe.formatRangeForDisplay(e.startDate, e.endDate) : e.selectedDate
    };
  }
  /**
   * Set selected date programmatically (external API)
   */
  static setSelectedDate(t, e, n, i, s) {
    if (n.isRange) {
      console.warn("Use setSelectedRange for range calendars");
      return;
    }
    if (i({
      selectedDate: e,
      focusedDate: e
    }), e) {
      const a = this.formatYearMonth(new Date(e));
      a !== n.currentMonth && i({ currentMonth: a });
    }
    s(), this.updateHiddenInput(t, n), this.dispatchCalendarEvent(t, "dateChanged", {
      selectedDate: e,
      source: "programmatic"
    });
  }
  /**
   * Set selected range programmatically (external API)
   */
  static setSelectedRange(t, e, n, i, s, a) {
    if (!i.isRange) {
      console.warn("Use setSelectedDate for single date calendars");
      return;
    }
    if (s({
      startDate: e,
      endDate: n,
      rangeSelectionState: "none",
      focusedDate: n || e
    }), n || e) {
      const o = n || e, l = this.formatYearMonth(new Date(o));
      l !== i.currentMonth && s({ currentMonth: l });
    }
    a(), this.updateHiddenInput(t, i), this.dispatchCalendarEvent(t, "rangeChanged", {
      startDate: e,
      endDate: n,
      source: "programmatic"
    });
  }
  /**
   * Format date as YYYY-MM-DD string
   */
  static formatDateString(t) {
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  }
  /**
   * Format date as YYYY-MM string
   */
  static formatYearMonth(t) {
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0");
  }
}
class Uh extends tt {
  /**
   * Initialize calendar elements - required by BaseActionClass
   */
  initializeElements() {
    y.findByDataAttribute("keys-calendar", "true").forEach((t) => {
      this.initializeCalendar(t);
    });
  }
  /**
   * Initialize a single calendar element
   */
  initializeCalendar(t) {
    if (this.hasState(t))
      return;
    const e = t.dataset.keysCalendarConfig, n = t.dataset.disabled === "true";
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
      viewMode: "calendar",
      format: i.format || "Y-m-d",
      displayFormat: i.displayFormat || i.format || "Y-m-d"
    };
    this.setState(t, s), this.renderCalendar(t), this.bindAllEventListeners(t), en.updateHiddenInput(t, s), en.dispatchCalendarEvent(t, "initialized", { state: s });
  }
  /**
   * Bind all event listeners for a calendar
   */
  bindEventListeners() {
  }
  /**
   * Bind all event listeners for a specific calendar
   */
  bindAllEventListeners(t) {
    const e = this.getState(t);
    e && (this.bindDateSelectionEvents(t), this.bindNavigationEvents(t), en.bindFormEvents(
      t,
      e,
      (n) => this.updateState(t, n),
      () => this.renderCalendar(t)
    ), Po.bindKeyboardEvents(
      t,
      e,
      (n) => this.updateState(t, n),
      (n) => this.selectDate(t, n),
      () => this.renderCalendar(t)
    ));
  }
  /**
   * Bind date selection event listeners
   */
  bindDateSelectionEvents(t) {
    t.addEventListener("click", (e) => {
      const n = e.target;
      if (n.dataset.calendarDayBtn !== void 0) {
        const i = n.dataset.date, s = n.hasAttribute("disabled") || n.getAttribute("aria-disabled") === "true";
        i && !s && this.selectDate(t, i);
      }
    });
  }
  /**
   * Bind navigation event listeners
   */
  bindNavigationEvents(t) {
    t.addEventListener("click", (e) => {
      const n = e.target, i = this.getState(t);
      if (!i) return;
      const s = n.closest("[data-calendar-nav]");
      if (s) {
        const d = s.dataset.calendarNav;
        wn.navigateMonth(
          t,
          d,
          i,
          (f) => this.updateState(t, f),
          () => this.renderCalendar(t)
        );
        return;
      }
      if (n.closest("[data-calendar-month-year-btn]")) {
        wn.toggleMonthYearDropdown(
          t,
          i,
          (d) => this.updateState(t, d),
          () => this.renderCalendar(t)
        );
        return;
      }
      const o = n.closest("[data-calendar-month-btn]");
      if (o) {
        const d = parseInt(o.dataset.month || "0");
        wn.selectMonth(
          t,
          d,
          i,
          (f) => this.updateState(t, f),
          () => this.renderCalendar(t)
        );
        return;
      }
      const l = n.closest("[data-calendar-year-option]");
      if (l) {
        const d = parseInt(l.dataset.year || "0");
        wn.selectYear(
          t,
          d,
          i,
          (f) => this.updateState(t, f),
          () => this.renderCalendar(t)
        );
        return;
      }
      const c = n.closest("[data-calendar-year-nav]");
      if (c) {
        const d = c.dataset.calendarYearNav;
        wn.navigateYear(
          t,
          d,
          i,
          (f) => this.updateState(t, f),
          () => this.renderCalendar(t)
        );
        return;
      }
    });
  }
  /**
   * Handle date selection
   */
  selectDate(t, e) {
    const n = this.getState(t);
    if (!n) return;
    Pe.selectDate(
      t,
      e,
      n,
      (s) => this.updateState(t, s)
    ), this.renderCalendar(t), en.updateHiddenInput(t, this.getState(t));
    const i = this.getState(t);
    if (n.isRange) {
      const s = i.startDate && i.endDate ? yt.formatRangeForDisplay(i.startDate, i.endDate, i.displayFormat) : i.startDate ? yt.formatDateForDisplay(i.startDate, i.displayFormat) : "";
      en.dispatchCalendarEvent(t, "rangeSelected", {
        startDate: i.startDate,
        endDate: i.endDate,
        formattedRange: s,
        source: "userClick"
      });
    } else {
      const s = yt.formatDateForDisplay(e, i.displayFormat);
      en.dispatchCalendarEvent(t, "dateSelected", {
        selectedDate: e,
        formattedDate: s,
        source: "userClick"
      });
    }
  }
  /**
   * Render the calendar
   */
  renderCalendar(t) {
    const e = this.getState(t);
    e && (this.toggleQuickSelectors(t, e.viewMode), e.viewMode === "calendar" ? (om.renderCalendarGrid(t, e), Po.initializeFocus(t, e)) : e.viewMode === "month" || e.viewMode === "year" && wn.renderYearGrid(
      t,
      e,
      (n) => this.updateState(t, n),
      () => this.renderCalendar(t)
    ));
  }
  /**
   * Toggle quick selectors visibility based on view mode, isRange, and selector configuration
   */
  toggleQuickSelectors(t, e) {
    const n = this.getState(t), i = t.querySelector('[data-view-mode-show="calendar"]');
    if (i) {
      const a = i.querySelectorAll("[data-quick-selector]").length > 0;
      e === "calendar" && (n != null && n.isRange) && a ? i.style.display = "" : i.style.display = "none";
    }
  }
  /**
   * Update state and trigger re-render
   */
  updateState(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = { ...n, ...e };
    this.setState(t, i);
  }
  /**
   * Setup dynamic observer for dynamically added calendars
   */
  setupDynamicObserver() {
    new MutationObserver((e) => {
      e.forEach((n) => {
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
  getCalendarState(t) {
    const e = this.getState(t);
    return e ? en.getCalendarState(t, e) : null;
  }
  /**
   * Public API: Set selected date
   */
  setSelectedDate(t, e) {
    const n = this.getState(t);
    n && en.setSelectedDate(
      t,
      e,
      n,
      (i) => this.updateState(t, i),
      () => this.renderCalendar(t)
    );
  }
  /**
   * Public API: Set selected range
   */
  setSelectedRange(t, e, n) {
    const i = this.getState(t);
    i && en.setSelectedRange(
      t,
      e,
      n,
      i,
      (s) => this.updateState(t, s),
      () => this.renderCalendar(t)
    );
  }
  /**
   * Cleanup when component is destroyed
   */
  onDestroy() {
    y.findByDataAttribute("keys-calendar", "true").forEach((t) => {
      Po.unbindKeyboardEvents(t);
    });
  }
  /**
   * Get current year-month string
   */
  getCurrentYearMonth() {
    const t = /* @__PURE__ */ new Date();
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0");
  }
  /**
   * Get today's date string
   */
  getTodayDate() {
    const t = /* @__PURE__ */ new Date();
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  }
}
class wc extends tt {
  /**
   * Initialize radio elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("label[for]", (t) => {
      const e = t.getAttribute("for");
      if (!e) return;
      const n = y.getElementById(e);
      !n || n.type !== "radio" || this.focusRadioInput(n);
    }), T.handleDelegatedKeydown('input[type="radio"]', (t, e) => {
      T.createNavigationHandler({
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
    y.focus(t, 0), this.dispatchFocusEvent(t);
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
    return e ? Array.from(y.querySelectorAll(`input[type="radio"][name="${e}"]`)).filter((i) => !i.disabled) : [t];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(t) {
    T.dispatchCustomEvent(t, "radio-focus", {
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
    return T.addEventListener(document, "radio-focus", (e) => {
      t(e.detail.radio);
    });
  }
  /**
   * Clean up RadioActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
wc.getInstance();
class Br extends tt {
  /**
   * Initialize range elements - required by BaseActionClass
   */
  initializeElements() {
    y.findByDataAttribute("range", "true").forEach((t) => {
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
    const e = y.querySelector(".range-track", t);
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
    const n = y.querySelector(".range-track", t), i = y.querySelector(".range-fill", t), s = {}, a = {}, o = {}, l = {};
    return e.dual ? (s.min = y.querySelector('[data-handle="min"]', t), s.max = y.querySelector('[data-handle="max"]', t), a.min = y.querySelector('[data-native-input="min"]', t), a.max = y.querySelector('[data-native-input="max"]', t), o.min = y.querySelector('[data-range-input="min"]', t), o.max = y.querySelector('[data-range-input="max"]', t), l.min = y.querySelector('[data-value-display="min"]', t), l.max = y.querySelector('[data-value-display="max"]', t)) : (s.single = y.querySelector('[data-handle="single"]', t), a.single = y.querySelector('[data-native-input="single"]', t), o.single = y.querySelector('[data-range-input="single"]', t), l.single = y.querySelector('[data-value-display="single"]', t)), {
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
    T.addEventListener(document, "mousemove", (t) => this.handleMove(t)), T.addEventListener(document, "mouseup", (t) => this.handleEnd(t)), T.addEventListener(document, "touchmove", (t) => this.handleMove(t), { passive: !1 }), T.addEventListener(document, "touchend", (t) => this.handleEnd(t)), T.addEventListener(document, "touchcancel", (t) => this.handleEnd(t));
  }
  /**
   * Setup dynamic observer for new ranges - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          y.hasDataAttribute(n, "range", "true") && this.initializeRange(n), y.findByDataAttribute("range", "true", n).forEach((i) => {
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
    const e = Array.from(this.getAllStates().entries()).find(([h, p]) => p.state.isDragging);
    if (!e) return;
    t.preventDefault();
    const [n, i] = e, { config: s, state: a, elements: o } = i, l = "touches" in t ? t.touches[0].clientX : t.clientX, c = o.track.getBoundingClientRect(), d = Math.max(0, Math.min(1, (l - c.left) / c.width));
    let f = this.percentageToValue(d, s);
    f = this.snapToTickIfNeeded(f, s), this.updateValue(n, a.activeHandle, f);
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
      const c = Math.abs(l - s.minValue), d = Math.abs(l - s.maxValue), f = c <= d ? "min" : "max";
      this.updateValue(e, f, l);
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
    T.dispatchCustomEvent(t, "range-input", {
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
    T.dispatchCustomEvent(t, "range-change", {
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
  Br.getInstance().init();
}) : Br.getInstance().init();
window.RangeActions = Br;
Br.getInstance();
let pn = class {
  static isLivewireAvailable() {
    return typeof window < "u" && "Livewire" in window;
  }
  static isLivewireEnabled(t) {
    return t.dataset.livewireEnabled === "true" || t.dataset.livewireMode === "true" || !!t.dataset.wireModel;
  }
  static getLivewireComponent(t) {
    if (!this.isLivewireAvailable()) return null;
    const e = t.closest("[wire\\:id]");
    return e ? window.Livewire.find(e.getAttribute("wire:id")) : null;
  }
  static getWireModelProperty(t) {
    return t.dataset.wireModel || t.dataset.livewireProperty || null;
  }
  static updateLivewireProperty(t, e) {
    const n = this.getLivewireComponent(t), i = this.getWireModelProperty(t);
    if (!(!n || !i))
      try {
        n.set(i, e);
      } catch (s) {
        console.warn("Failed to update Livewire property:", i, s);
      }
  }
  static formatValueForLivewire(t, e) {
    return e ? Array.isArray(t) ? t : [] : Array.isArray(t) ? t[0] || "" : t || "";
  }
};
class kc extends tt {
  initializeElements() {
    y.findByDataAttribute("select", "true").forEach((e, n) => {
      this.initializeSelect(e);
    });
  }
  initializeSelect(t) {
    const e = t.dataset.multiple === "true", i = {
      selectedValues: this.readInitialValues(t, e),
      searchTerm: "",
      filteredOptions: []
    };
    this.setState(t, i), this.updateOptions(t), this.updateOptionsSelectedState(t), this.updateDisplay(t), this.updateStableInputs(t);
  }
  readInitialValues(t, e) {
    if (pn.isLivewireEnabled(t))
      return [];
    const i = this.getAllOptions(t).filter(
      (s) => s.element.hasAttribute("selected") || s.element.dataset.selected === "true"
    );
    if (i.length > 0)
      return i.map((s) => s.value);
    if (e) {
      const s = y.querySelectorAll(".select-pool-input", t), a = [];
      return s.forEach((o) => {
        o.dataset.poolActive === "true" && o.value && a.push(o.value);
      }), a;
    } else {
      const s = y.querySelector(".select-single-input", t);
      return s && s.value ? [s.value] : [];
    }
  }
  bindEventListeners() {
    T.handleDelegatedEvent("click", "[data-chip-remove]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = t.dataset.chipValue, i = y.findClosest(t, '[data-select="true"]');
      i && n && this.removeChip(i, n);
    }), T.handleDelegatedEvent("click", "[data-select-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = y.findClosest(t, '[data-select="true"]');
      n && this.clearSelection(n);
    }), T.handleDelegatedEvent("click", "[data-select-option]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, '[data-select="true"]');
      n && this.selectOption(n, t);
    }), T.handleDelegatedEvent("input", "input[data-select-search]", (t, e) => {
      const n = y.findClosest(t, '[data-select="true"]');
      n && n.dataset.searchable === "true" && this.handleSearch(n, t.value);
    }), T.addEventListener(document, "toggle", (t) => {
      var n;
      const e = t.target;
      if (e.dataset.keysPopover === "true" && e.id.startsWith("select-dropdown-")) {
        const i = t, s = e.id.replace("select-dropdown-", ""), a = (n = y.querySelector(`[data-select="true"] button[id="${s}"]`)) == null ? void 0 : n.closest('[data-select="true"]');
        i.newState === "open" ? this.handlePopoverOpened(e, a) : i.newState === "closed" && this.handlePopoverClosed(e, a);
      }
    });
  }
  handlePopoverOpened(t, e) {
    if (e && e.dataset.searchable === "true") {
      const n = y.querySelector("input[data-select-search]", t);
      n && setTimeout(() => {
        n.focus();
      }, 0);
    }
  }
  handlePopoverClosed(t, e) {
    if (e) {
      const n = y.querySelector("input[data-select-search]", t);
      n && (n.value = "", this.handleSearch(e, ""));
    }
  }
  selectOption(t, e) {
    var a;
    const n = this.getState(t), i = e.dataset.value;
    if (!n || !i || e.getAttribute("aria-disabled") === "true")
      return;
    if (t.dataset.multiple === "true") {
      const o = n.selectedValues.indexOf(i);
      o > -1 ? n.selectedValues.splice(o, 1) : n.selectedValues.push(i);
    } else {
      n.selectedValues = [i];
      const o = y.querySelector(`#select-dropdown-${(a = t.querySelector("button")) == null ? void 0 : a.id}`);
      o && o.hidePopover && o.hidePopover();
    }
    this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), pn.isLivewireEnabled(t) && this.syncToLivewire(t);
  }
  removeChip(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = n.selectedValues.indexOf(e);
    i > -1 && (n.selectedValues.splice(i, 1), this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), pn.isLivewireEnabled(t) && this.syncToLivewire(t));
  }
  clearSelection(t) {
    const e = this.getState(t);
    e && (e.selectedValues = [], this.setState(t, e), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), pn.isLivewireEnabled(t) && this.syncToLivewire(t));
  }
  handleSearch(t, e) {
    const n = this.getState(t);
    n && (n.searchTerm = e.trim().toLowerCase(), this.setState(t, n), this.updateFilteredOptions(t), this.updateOptionsVisibility(t));
  }
  updateFilteredOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = this.getAllOptions(t);
    e.searchTerm ? e.filteredOptions = n.filter(
      (i) => i.searchableText.includes(e.searchTerm)
    ) : e.filteredOptions = n, this.setState(t, e);
  }
  updateOptionsVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelectorAll("[data-select-option]", t), i = y.querySelector("[data-select-no-results]", t);
    let s = 0;
    n.forEach((a) => {
      const o = a, l = o.dataset.value || "";
      e.filteredOptions.some((d) => d.value === l) ? (o.style.display = "", s++) : o.style.display = "none";
    }), i && (s === 0 && e.searchTerm ? i.classList.remove("hidden") : i.classList.add("hidden"));
  }
  updateDisplay(t) {
    if (!this.getState(t)) return;
    t.dataset.multiple === "true" ? this.updateChipsDisplay(t) : this.updateSingleValueDisplay(t), this.updateClearButtonVisibility(t);
  }
  updateClearButtonVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-select-clear]", t);
    if (!n) return;
    const i = e.selectedValues.length > 0, s = t.dataset.disabled === "true", a = t.dataset.clearable === "true";
    i && !s && a ? (n.classList.remove("opacity-0", "pointer-events-none"), n.classList.add("opacity-100", "pointer-events-auto")) : (n.classList.remove("opacity-100", "pointer-events-auto"), n.classList.add("opacity-0", "pointer-events-none"));
  }
  updateChipsDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-select-chips]", t);
    if (!n) return;
    const i = y.querySelectorAll('[data-select-chip="true"]', n), s = y.querySelector("[data-select-placeholder]", t), a = y.querySelector("[data-select-spacer]", t);
    if (e.selectedValues.length === 0)
      i.forEach((o) => o.remove()), s && s.classList.remove("hidden"), a && a.classList.add("hidden");
    else {
      s && s.classList.add("hidden"), a && a.classList.remove("hidden");
      const o = Array.from(i).map(
        (l) => l.dataset.chipValue
      ).filter((l) => l);
      i.forEach((l) => {
        const c = l.dataset.chipValue;
        c && !e.selectedValues.includes(c) && l.remove();
      }), e.selectedValues.forEach((l) => {
        o.includes(l) || this.createChipElement(t, n, l);
      });
    }
  }
  createChipElement(t, e, n) {
    this.createChipElementFallback(t, e, n);
  }
  createChipElementFallback(t, e, n) {
    const i = this.findOptionByValue(t, n), s = i ? i.displayLabel : n, a = i ? i.htmlContent : s, o = document.createElement("span");
    o.className = "inline-flex items-center font-medium px-2 py-0.5 text-xs rounded-full bg-elevation-1 text-primary border border-line gap-1.5", o.setAttribute("data-select-chip", "true"), o.setAttribute("data-chip-value", n), o.innerHTML = `
            <span class="chip-content inline-flex items-center gap-1.5">${a}</span>
            <button type="button" class="w-4 h-4 flex items-center justify-center rounded-full hover:bg-hover transition-colors focus:outline-none focus:ring-1 focus:ring-line ml-0.5" data-chip-remove data-chip-value="${n}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="sr-only">Remove ${s}</span>
            </button>
        `, e.appendChild(o);
  }
  updateSingleValueDisplay(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector(".select-value", t);
    if (n)
      if (e.selectedValues.length === 0) {
        const i = t.dataset.placeholder || "Select option...";
        n.innerHTML = `<span class="text-muted select-placeholder">${i}</span>`;
      } else {
        const i = e.selectedValues[0], s = this.findOptionByValue(t, i), a = s ? s.htmlContent : i;
        n.innerHTML = a;
      }
  }
  updateStableInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = t.dataset.multiple === "true";
    pn.isLivewireEnabled(t) ? this.syncToLivewire(t) : n ? this.updateMultipleInputPool(t, e.selectedValues) : this.updateSingleInput(t, e.selectedValues[0] || "");
  }
  updateSingleInput(t, e) {
    const n = y.querySelector(".select-single-input", t);
    n && n.value !== e && (n.value = e, n.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  updateMultipleInputPool(t, e) {
    const n = y.querySelectorAll(".select-pool-input", t);
    n.forEach((s, a) => {
      const o = a < e.length, l = o ? e[a] : "";
      s.value !== l && (s.value = l), s.dataset.poolActive = o ? "true" : "false", s.style.display = o ? "" : "none";
    });
    const i = n[0];
    i && i.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  updateOptionsSelectedState(t) {
    const e = this.getState(t);
    if (!e) return;
    y.querySelectorAll("[data-select-option]", t).forEach((i) => {
      const s = i, a = s.dataset.value || "", o = e.selectedValues.includes(a);
      s.setAttribute("aria-selected", o ? "true" : "false");
    });
  }
  updateOptions(t) {
    const e = this.getAllOptions(t), n = this.getState(t);
    n && (n.filteredOptions = e, this.setState(t, n));
  }
  getAllOptions(t) {
    const e = y.querySelectorAll("[data-select-option]", t);
    return Array.from(e).map((n) => {
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
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((i) => i.value === e) || null;
  }
  syncToLivewire(t) {
    const e = this.getState(t);
    if (!e || !pn.isLivewireEnabled(t)) return;
    const n = t.dataset.multiple === "true", i = pn.formatValueForLivewire(e.selectedValues, n);
    pn.updateLivewireProperty(t, i);
  }
  setSelectedValues(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = t.dataset.multiple === "true";
    n.selectedValues = i ? e : e.slice(0, 1), this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t);
  }
  getSelectValue(t) {
    const e = this.getState(t);
    return e ? t.dataset.multiple === "true" ? e.selectedValues : e.selectedValues[0] || null : null;
  }
}
kc.getInstance();
class xc extends tt {
  /**
   * Initialize modal elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll("dialog[data-modal]").forEach((t) => {
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
    T.handleDelegatedClick("[commandfor]", (t, e) => {
      const n = t.getAttribute("command"), i = t.getAttribute("commandfor");
      if (n === "show-modal" && i) {
        const s = y.getElementById(i);
        s && s.matches("dialog[data-modal]") && this.handleModalOpen(s, t);
      }
    }), T.handleDelegatedClick("[data-modal-close]", (t, e) => {
      const n = y.findClosest(t, "dialog[data-modal]");
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
          n.matches && n.matches("dialog[data-modal]") && this.initializeModal(n), y.querySelectorAll("dialog[data-modal]", n).forEach((s) => {
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
    const e = y.querySelector("[autofocus]", t);
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
    const e = y.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(t, e, n = {}) {
    T.dispatchCustomEvent(t, e, {
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
    const e = y.getElementById(t);
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
    const n = y.getElementById(t);
    if (!n) return;
    const i = n.getAttribute("wire:model");
    if (i && typeof window.Livewire < "u" && window.Livewire.find) {
      const a = (s = y.findClosest(n, "[wire\\:id]")) == null ? void 0 : s.getAttribute("wire:id");
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
    const e = y.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : e.open ? this.closeModal(t) : this.openModal(t);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    y.querySelectorAll("dialog[data-modal][open]").forEach((t) => {
      t.id && this.closeModal(t.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(t, e) {
    const n = y.getElementById(t);
    return !n || !n.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (this.handleModalOpen(n, e), n.showModal(), this.dispatchLivewireEvent("modalOpened", { id: t, modal: t }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(t) {
    const e = y.getElementById(t);
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
xc.getInstance();
const yr = {
  DEFAULT_TIMEOUT: 5e3,
  STACK_OFFSET: 72,
  ANIMATION_DURATION: 300
}, gn = {
  TOAST: '[data-keys-toast="true"]',
  DISMISS_BUTTON: "[data-toast-dismiss]"
};
class $r extends tt {
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
    T.handleDelegatedClick(`${gn.TOAST}[popover] [data-keys-button]${gn.DISMISS_BUTTON}`, (t, e) => {
      const n = t.getAttribute("data-toast-dismiss");
      n && (e.preventDefault(), e.stopPropagation(), this.dismiss(n));
    }), T.handleDelegatedEvent("toggle", `${gn.TOAST}[popover]`, (t) => {
      const e = t.id;
      if (e) {
        const n = t.matches(":popover-open");
        this.dispatchToastEvent(n ? "toast:show" : "toast:close", e);
      }
    }), T.handleDelegatedClick(`${gn.TOAST}[popover] [data-toast-action]`, (t, e) => {
      const n = t.getAttribute("data-toast-action"), i = y.findClosest(t, `${gn.TOAST}[popover]`);
      n && i && (e.preventDefault(), e.stopPropagation(), this.dispatchToastEvent("toast:action", i.id, { action: n }));
    }), T.handleDelegatedEvent("mouseenter", `${gn.TOAST}[popover]`, (t) => {
      this.pauseTimer(t.id);
    }), T.handleDelegatedEvent("mouseleave", `${gn.TOAST}[popover]`, (t) => {
      this.resumeTimer(t.id);
    }), T.handleDelegatedEvent("keydown", `${gn.TOAST}[popover]`, (t, e) => {
      const n = e;
      n.key === "Escape" && t.hasAttribute("data-dismissible") && (n.preventDefault(), this.dismiss(t.id));
    });
  }
  /**
   * Setup dynamic observer for new toasts - uses BaseActionClass utility
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        e.nodeType === Node.ELEMENT_NODE && e.querySelectorAll("[data-keys-toast][popover]").length > 0 && this.discoverToasts();
      });
    });
  }
  /**
   * Discover and register existing toasts (no containers needed)
   */
  discoverToasts() {
    const t = this.getGlobalState();
    t && document.querySelectorAll("[data-keys-toast][popover]").forEach((e) => {
      const n = e.id;
      n && t.toasts.set(n, e);
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
    n && n.toasts.set(t, e);
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
   * @param variant Toast type (info, success, warning, danger, neutral)
   * @param data Toast configuration object
   * @returns Whether the toast was successfully created and shown
   */
  show(t, e = { message: "" }) {
    const n = this.getGlobalState();
    if (!n) return !1;
    const i = e.position || "top-right", s = `toast-${t}-${i}-${++n.toastCounter}`, a = this.createToastElement(s, t, i, e), l = this.calculateStackPosition(i) * yr.STACK_OFFSET;
    a.style.setProperty("--stack-offset", `${l}px`), document.body.appendChild(a), this.showToastElement(a), a.setAttribute("data-toast-visible", "true");
    const c = e.duration || yr.DEFAULT_TIMEOUT;
    return !(e.persistent === !0) && c > 0 && this.setTimer(s, c), n.toasts.set(s, a), this.dispatchToastEvent("toast:show", s, e), !0;
  }
  /**
   * Calculate stack position for toasts at a specific position
   */
  calculateStackPosition(t) {
    const e = this.getGlobalState();
    if (!e) return 0;
    let n = 0;
    return e.toasts.forEach((i) => {
      i.getAttribute("data-position") === t && i.getAttribute("data-toast-visible") === "true" && n++;
    }), n;
  }
  /**
   * Show toast element using Popover API with fallback
   */
  showToastElement(t) {
    try {
      t.showPopover();
    } catch {
      console.warn("Popover API not supported, using fallback display"), t.style.display = "block";
    }
  }
  /**
   * Hide toast element using Popover API with fallback
   */
  hideToastElement(t) {
    try {
      t.hidePopover();
    } catch {
      console.warn("Popover API hide failed, using manual hide"), t.style.display = "none";
    }
  }
  /**
   * Create a toast popover element dynamically to match Blade template
   */
  createToastElement(t, e, n, i) {
    const s = e === "error" ? "danger" : e, a = document.createElement("div");
    a.className = this.getPopoverClasses(n, s), a.setAttribute("data-keys-toast", "true"), a.setAttribute("data-variant", e), a.setAttribute("data-position", n), a.setAttribute("data-element-type", "popover"), a.setAttribute("data-dismissible", "true"), a.setAttribute("data-has-icon", "true"), a.setAttribute("popover", "manual"), a.setAttribute("role", "status");
    const o = s === "danger" || s === "warning" ? "assertive" : "polite";
    return a.setAttribute("aria-live", o), a.setAttribute("aria-atomic", "true"), a.id = t, i.title && (a.setAttribute("aria-labelledby", `${t}-title`), a.setAttribute("data-has-title", "true")), a.setAttribute("aria-describedby", `${t}-message`), a.innerHTML = `
            <div class="px-4 pt-4 pb-3">
                <div class="flex ${i.title ? "items-start" : "items-center"} gap-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${this.getIconWrapperClasses(s)}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-icon="true">
                            ${this.getIconPath(s)}
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 id="${t}-title" class="hidden text-sm text-heading font-semibold tracking-tight mb-1"></h3>
                        <div id="${t}-message" class="text-sm text-primary font-normal text-left leading-tight opacity-90"></div>
                    </div>
                    <div class="flex-shrink-0">
                        <button type="button"
                                class="inline-flex items-center justify-center rounded-md bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6 text-xs hover:bg-elevation-1 active:bg-muted focus:ring-accent text-current opacity-60 hover:opacity-100 -m-1"
                                data-keys-button="true"
                                data-variant="ghost"
                                data-size="xs"
                                data-element-type="button"
                                data-icon-only="true"
                                data-has-icon="true"
                                data-toast-dismiss="${t}"
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
  getPopoverClasses(t, e) {
    let n = "max-w-sm w-fit h-fit rounded-lg shadow-lg text-primary z-[9999] p-0 overflow-visible opacity-100";
    return n += " " + this.getVariantClasses(e), n;
  }
  /**
   * Get variant classes - adaptive backgrounds that switch between light and dark mode
   */
  getVariantClasses(t) {
    const e = {
      info: "border border-info bg-info-subtle",
      success: "border border-success bg-success-subtle",
      warning: "border border-warning bg-warning-subtle",
      danger: "border border-danger bg-danger-subtle",
      neutral: "border border-line bg-elevation-1"
    };
    return e[t] || e.info;
  }
  /**
   * Get icon wrapper classes for variant - optimized for text contrast
   */
  getIconWrapperClasses(t) {
    const e = {
      info: "bg-info text-white",
      success: "bg-success text-white",
      warning: "bg-warning text-black",
      danger: "bg-danger text-white",
      neutral: "bg-neutral text-white"
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
    if (!n)
      return !1;
    const i = n.getAttribute("data-position");
    return this.clearTimer(t), e.pausedTimers.delete(t), n.setAttribute("data-toast-visible", "false"), this.hideToastElement(n), e.toasts.delete(t), i && this.recalculateStackPositions(i), window.setTimeout(() => {
      n.parentNode && n.parentNode.removeChild(n);
    }, yr.ANIMATION_DURATION), this.dispatchToastEvent("toast:dismiss", t), !0;
  }
  /**
   * Recalculate stack positions for all toasts at a specific position
   */
  recalculateStackPositions(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const n = [];
    e.toasts.forEach((i) => {
      i.getAttribute("data-position") === t && i.getAttribute("data-toast-visible") === "true" && n.push(i);
    }), n.forEach((i, s) => {
      const a = s * yr.STACK_OFFSET;
      i.style.setProperty("--stack-offset", `${a}px`);
    });
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
   * Convenience methods for common toast types
   */
  /**
   * Show a success toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  success(t, e = {}) {
    return this.show("success", { message: t, ...e });
  }
  /**
   * Show an error toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  error(t, e = {}) {
    return this.show("danger", { message: t, ...e });
  }
  /**
   * Show a warning toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  warning(t, e = {}) {
    return this.show("warning", { message: t, ...e });
  }
  /**
   * Show an info toast
   * @param message Toast message
   * @param options Additional toast options
   * @returns Whether the toast was successfully created
   */
  info(t, e = {}) {
    return this.show("info", { message: t, ...e });
  }
  /**
   * Update toast content with provided data
   */
  updateToastContent(t, e) {
    const n = t.querySelector(`#${t.id}-title`), i = t.querySelector(`#${t.id}-message`), s = t.querySelector("[data-toast-actions]");
    n && (e.title ? (n.textContent = e.title, n.classList.remove("hidden"), t.setAttribute("data-has-title", "true")) : (n.classList.add("hidden"), t.removeAttribute("data-has-title"))), i && e.message && (i.textContent = e.message), s && (e.actions ? (s.innerHTML = e.actions, s.classList.remove("hidden")) : s.classList.add("hidden"));
    const a = e.duration || yr.DEFAULT_TIMEOUT;
    t.setAttribute("data-timeout", String(a)), e.persistent === !0 && t.setAttribute("data-persistent", "true"), a > 0 && !e.persistent && t.setAttribute("data-auto-hide", "true");
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
    const s = window.setTimeout(() => {
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
    n && (window.clearTimeout(n), e.timers.delete(t));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(t) {
    const e = this.getGlobalState();
    if (!e) return;
    const n = e.timers.get(t), i = e.toasts.get(t);
    if (n && i) {
      const s = parseInt(i.getAttribute("data-timeout") || String(yr.DEFAULT_TIMEOUT)), a = parseInt(i.getAttribute("data-toast-start-time") || "0"), o = Date.now() - a, l = Math.max(0, s - o);
      this.clearTimer(t), e.pausedTimers.set(t, {
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
    if (n && i)
      n.getAttribute("data-persistent") === "true" || e.pausedTimers.delete(t);
    else if (n && s) {
      const a = n.getAttribute("data-persistent") === "true", o = n.getAttribute("data-auto-hide") === "true";
      !a && o && s.remaining > 0 && (this.setTimer(t, s.remaining), e.pausedTimers.delete(t));
    }
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(t, e, n = {}) {
    const i = this.getGlobalState();
    if (!i) return;
    const s = { id: e, toast: e, ...n };
    T.dispatchCustomEvent(document.documentElement, t, s, {
      bubbles: !0,
      cancelable: !0
    });
    const a = i.toasts.get(e);
    if (a && T.dispatchCustomEvent(a, t, s, {
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
    const t = this.getGlobalState();
    t && (t.timers.forEach((e) => window.clearTimeout(e)), t.timers.clear(), t.pausedTimers.clear(), t.toasts.forEach((e) => {
      this.hideToastElement(e), e.setAttribute("data-toast-visible", "false");
    }), t.toasts.clear());
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  $r.getInstance().init();
}) : $r.getInstance().init();
const lm = $r.getInstance();
window.ToastActions = lm;
$r.getInstance();
class Sc extends tt {
  /**
   * Initialize dropdown elements - required by BaseActionClass
   */
  initializeElements() {
    y.findByDataAttribute("dropdown", "true").forEach((t) => {
      this.initializeDropdown(t);
    }), y.findByDataAttribute("submenu", "true").forEach((t) => {
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
    }, n = y.findClosest(t, '[data-submenu="true"]');
    n && n !== t && (e.parent = n), this.setupTriggerButton(t), this.setState(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
  }
  /**
   * Automatically add popovertarget and data-dropdown-trigger to user's button
   */
  setupTriggerButton(t) {
    const e = t.previousElementSibling;
    if (!e || !e.hasAttribute("data-popover-trigger"))
      return;
    const n = e.getAttribute("data-popover-trigger");
    if (!n)
      return;
    const i = e.querySelector("button");
    i && (i.setAttribute("popovertarget", n), i.setAttribute("data-dropdown-trigger", ""), i.setAttribute("aria-expanded", "false"));
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(t) {
    const e = y.querySelectorAll('[data-submenu="true"]', t), n = this.getState(t);
    n && (n.children = Array.from(e), this.setState(t, n)), e.forEach((i) => {
      this.hasState(i) || this.initializeDropdown(i);
    });
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.addEventListener(document, "toggle", (e) => {
      const n = e.target;
      if (n && y.hasDataAttribute(n, "dropdown", "true")) {
        const i = this.getState(n);
        if (!i) return;
        const s = n.matches(":popover-open");
        i.isOpen = s, this.setState(n, i);
        const a = n.previousElementSibling, o = a == null ? void 0 : a.querySelector("[data-dropdown-trigger]");
        o && o.setAttribute("aria-expanded", s ? "true" : "false"), s ? (this.updateMenuItems(n), this.dispatchDropdownEvent(n, "dropdown:open")) : this.dispatchDropdownEvent(n, "dropdown:close");
      }
    }, !0), T.handleDelegatedClick("[data-submenu-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (e, n) => {
      if (e.matches("[data-submenu-trigger]")) {
        n.preventDefault(), n.stopPropagation();
        const i = y.findClosest(e, '[data-submenu="true"]');
        i && !this.isDisabled(i) && this.toggleSubmenu(i);
        return;
      }
      if (e.matches("[data-menu-item]")) {
        const i = y.findClosest(e, '[data-dropdown="true"]');
        i && (e.dataset.keepOpen === "true" || this.closeDropdown(i));
        return;
      }
      if (e.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (n.stopPropagation(), !(e.dataset.keepOpen !== "false")) {
          const s = y.findClosest(e, '[data-dropdown="true"]');
          s && this.closeDropdown(s);
        }
        return;
      }
      if (e.matches("[data-dropdown-panel], [data-submenu-panel]")) {
        n.stopPropagation();
        return;
      }
    }), T.addEventListener(document, "click", (e) => {
      const n = e.target;
      n && n instanceof Element && (n.closest("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]") || this.closeAllDropdowns());
    });
    let t = null;
    T.addEventListener(document, "mouseenter", (e) => {
      const n = y.findClosest(e.target, "[data-submenu-trigger]");
      if (n && !this.isMobile()) {
        t && (clearTimeout(t), t = null);
        const i = y.findClosest(n, "[data-popover-trigger]");
        if (i) {
          const s = i.getAttribute("data-popover-trigger"), a = s ? document.getElementById(s) : null;
          if (a && !a.matches(":popover-open")) {
            const o = y.findClosest(n, '[role="menu"]');
            o && y.querySelectorAll("[data-submenu-trigger]", o).forEach((c) => {
              var d;
              if (c !== n) {
                const f = c.getAttribute("data-popover-trigger");
                if (f) {
                  const h = document.getElementById(f);
                  if (h && h.matches(":popover-open")) {
                    const p = h.style.transition;
                    h.style.transition = "none", (d = h.hidePopover) == null || d.call(h), requestAnimationFrame(() => {
                      h.style.transition = p;
                    });
                  }
                }
              }
            }), n.click();
          }
        }
      }
    }, { capture: !0 }), T.addEventListener(document, "mouseleave", (e) => {
      const n = y.findClosest(e.target, "[data-submenu-trigger]");
      if (n && !this.isMobile()) {
        const i = y.findClosest(n, "[data-popover-trigger]");
        if (i) {
          const s = i.getAttribute("data-popover-trigger"), a = s ? document.getElementById(s) : null;
          if (a && a.matches(":popover-open")) {
            const o = e.relatedTarget;
            if (o && (y.findClosest(o, `#${s}`) || o.id === s))
              return;
            t = window.setTimeout(() => {
              var d;
              if (a.matches(":hover"))
                return;
              const l = document.querySelector(":hover"), c = l ? y.findClosest(l, "[data-submenu-trigger]") : null;
              (!c || c === n) && ((d = a.hidePopover) == null || d.call(a));
            }, 200);
          }
        }
      }
    }, { capture: !0 }), T.handleDelegatedKeydown('[data-dropdown="true"]', (e, n) => {
      this.handleKeydown(e, n);
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
          y.hasDataAttribute(n, "dropdown", "true") && (this.hasState(n) || this.initializeDropdown(n)), y.hasDataAttribute(n, "submenu", "true") && (this.hasState(n) || this.initializeDropdown(n)), y.findByDataAttribute("dropdown", "true", n).forEach((a) => {
            this.hasState(a) || this.initializeDropdown(a);
          }), y.findByDataAttribute("submenu", "true", n).forEach((a) => {
            this.hasState(a) || this.initializeDropdown(a);
          });
        }
      });
    });
  }
  /**
   * Toggle dropdown open/closed state using native popover API
   */
  toggleDropdown(t) {
    this.getState(t) && t.togglePopover && t.togglePopover();
  }
  /**
   * Open dropdown using native popover API
   */
  openDropdown(t) {
    !this.getState(t) || this.isDisabled(t) || (this.closeSiblingDropdowns(t), t.showPopover && t.showPopover());
  }
  /**
   * Open submenu using HTML Popover API
   */
  openSubmenu(t) {
    const e = this.getState(t);
    if (!e || this.isDisabled(t))
      return;
    e.isOpen = !0, e.focusedIndex = -1, this.closeSiblingSubmenus(t), this.setState(t, e);
    const n = t, i = t.previousElementSibling, s = i == null ? void 0 : i.querySelector("[data-submenu-trigger]");
    if (n && n.showPopover)
      try {
        n.showPopover();
      } catch {
      }
    s && s.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "submenu:open");
  }
  /**
   * Close dropdown using native popover API
   */
  closeDropdown(t) {
    const e = this.getState(t);
    !e || !e.isOpen || (this.closeChildSubmenus(t), t.hidePopover && t.hidePopover());
  }
  /**
   * Close submenu using HTML Popover API
   */
  closeSubmenu(t) {
    const e = this.getState(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.setState(t, e);
    const n = t, i = t.previousElementSibling, s = i == null ? void 0 : i.querySelector("[data-submenu-trigger]");
    n && n.hidePopover && n.hidePopover(), s && s.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "submenu:close");
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
            const i = t.previousElementSibling, s = i == null ? void 0 : i.querySelector("[data-dropdown-trigger]");
            s && s.focus();
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
    const n = y.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", t);
    e.menuItems = Array.from(n).filter((i) => {
      const s = i;
      return !s.hasAttribute("disabled") && s.offsetParent !== null;
    }), this.setState(t, e);
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
    T.dispatchCustomEvent(t, e, {
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
Sc.getInstance();
class Fr extends tt {
  /**
   * Initialize table elements - required by BaseActionClass
   */
  initializeElements() {
    y.findByDataAttribute("table", "true").forEach((t) => {
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
    const n = y.querySelector('[data-sorted="true"]', t);
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
    T.handleDelegatedClick('[data-sortable="true"]', (t, e) => {
      e.preventDefault(), this.handleSort(t);
    }), T.handleDelegatedChange("[data-table-row-select]", (t) => {
      this.handleRowSelection(t);
    }), T.handleDelegatedChange("[data-table-select-all]", (t) => {
      this.handleSelectAll(t);
    }), T.handleDelegatedKeydown('[data-table="true"]', (t, e) => {
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
          y.hasDataAttribute(n, "table", "true") && this.initializeTable(n), y.findByDataAttribute("table", "true", n).forEach((i) => {
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
  handleSort(t) {
    var a;
    const e = y.findClosest(t, '[data-table="true"]');
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
    if (y.querySelectorAll('[data-sortable="true"]', t).forEach((s) => {
      s.setAttribute("data-sorted", "false"), s.removeAttribute("data-direction"), y.querySelectorAll(".table-sort-icon", s).forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), n) {
      const s = t.querySelector(`[data-sort-key="${e}"]`);
      if (s) {
        s.setAttribute("data-sorted", "true"), s.setAttribute("data-direction", n);
        const a = y.querySelector(".table-sort-icon", s);
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
    const e = y.findClosest(t, '[data-table="true"]');
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
    const e = y.findClosest(t, '[data-table="true"]');
    if (!e) return;
    const n = this.getState(e);
    if (!n) return;
    const i = y.querySelectorAll("[data-table-row-select]", e);
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
    const n = y.querySelectorAll("[data-table-row-select]", t), i = y.querySelector("[data-table-select-all]", t), s = n.length, a = e.selectedRows.size;
    a === 0 ? (e.selectAllState = "none", i && (i.checked = !1, i.indeterminate = !1)) : a === s ? (e.selectAllState = "all", i && (i.checked = !0, i.indeterminate = !1)) : (e.selectAllState = "some", i && (i.checked = !1, i.indeterminate = !0)), y.querySelectorAll("[data-table-row]", t).forEach((l) => {
      const c = l.getAttribute("data-row-id");
      c && e.selectedRows.has(c) ? l.setAttribute("data-selected", "true") : l.setAttribute("data-selected", "false");
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
    if (T.dispatchCustomEvent(t, "table:sort", e, {
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
    T.dispatchCustomEvent(t, "table:selection", { selectedIds: e }, {
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
  Fr.getInstance().init();
}) : Fr.getInstance().init();
window.TableActions = Fr;
Fr.getInstance();
class jr extends tt {
  /**
   * Initialize timepicker elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll("[data-keys-timepicker]").forEach((t) => {
      this.initializeTimePicker(t);
    });
  }
  /**
   * Initialize a single timepicker element
   */
  initializeTimePicker(t) {
    if (console.log("🕒 Initializing TimePicker:", t), this.hasState(t)) {
      console.log("🕒 TimePicker already initialized, skipping");
      return;
    }
    const e = t.dataset.format || "24", n = t.dataset.showSeconds === "true", i = parseInt(t.dataset.step || "1"), s = t.dataset.minTime || null, a = t.dataset.maxTime || null, o = t.dataset.value || null;
    console.log("🕒 TimePicker config:", { format: e, showSeconds: n, step: i, minTime: s, maxTime: a, initialValue: o });
    const l = this.parseTime(o) || this.getCurrentTime(), c = {
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
    this.setState(t, c), this.updateDisplay(t), this.updateSelectedStates(t), this.updateClearButtonVisibility(t, o || ""), console.log("🕒 TimePicker initialized successfully with state:", c);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedClick("[data-timepicker-trigger]", (t, e) => {
      console.log("🕒 TimePicker trigger clicked:", t);
      const n = y.findClosest(t, "[data-keys-timepicker]");
      if (n && !this.isDisabled(n)) {
        console.log("🕒 Native popover will handle toggle for:", n);
        const i = this.getState(n);
        i && console.log("🕒 Current TimePicker state:", i);
      } else
        console.log("🕒 TimePicker trigger ignored - disabled or not found"), e.preventDefault();
    }), T.handleDelegatedClick("[data-timepicker-clear]", (t, e) => {
      console.log("🕒 TimePicker clear button clicked:", t), e.preventDefault(), e.stopPropagation();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && (console.log("🕒 Clearing TimePicker value for:", n), this.clearTime(n));
    }), T.handleDelegatedClick("[data-timepicker-hour]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = parseInt(t.dataset.timepickerHour || "0");
      n && this.setHour(n, i);
    }), T.handleDelegatedClick("[data-timepicker-minute]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = parseInt(t.dataset.timepickerMinute || "0");
      n && this.setMinute(n, i);
    }), T.handleDelegatedClick("[data-timepicker-second]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = parseInt(t.dataset.timepickerSecond || "0");
      n && this.setSecond(n, i);
    }), T.handleDelegatedClick("[data-timepicker-period]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = t.dataset.timepickerPeriod;
      n && this.setPeriod(n, i);
    }), T.handleDelegatedClick("[data-timepicker-format]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = t.dataset.timepickerFormat;
      n && this.setFormat(n, i);
    }), T.handleDelegatedClick("[data-timepicker-now]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && this.setToCurrentTime(n);
    }), T.handleDelegatedClick("[data-timepicker-apply]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && this.applyTime(n);
    }), T.handleDelegatedClick("[data-timepicker-cancel]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && this.closeDropdown(n);
    }), T.handleDelegatedClick("[data-timepicker-preset]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = t.dataset.timepickerPreset;
      n && i && this.setPresetTime(n, i);
    }), T.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest("[data-keys-timepicker]") || this.closeAllDropdowns());
    }), T.handleDelegatedKeydown("[data-keys-timepicker]", (t, e) => {
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
          n.matches && n.matches("[data-keys-timepicker]") && this.initializeTimePicker(n), y.querySelectorAll("[data-keys-timepicker]", n).forEach((i) => {
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
    const n = y.querySelector("[data-timepicker-trigger]", t);
    n && n.setAttribute("aria-expanded", "true"), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.dispatchTimePickerEvent(t, "timepicker:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.getState(t);
    if (!e) return;
    e.isOpen = !1, this.setState(t, e);
    const n = y.querySelector("[data-timepicker-trigger]", t), i = y.querySelector("[data-popover]", t);
    if (n && n.setAttribute("aria-expanded", "false"), i && "hidePopover" in i)
      try {
        i.hidePopover();
      } catch {
        console.log("Fallback: triggering click to close popover"), n && n.click();
      }
    else n && n.click();
    this.dispatchTimePickerEvent(t, "timepicker:close");
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
      n.hour = s.hour, s.period && (n.period = s.period), n.format = e, this.setState(t, n), this.updateFormatButtons(t), this.updatePeriodSectionVisibility(t), this.updateGridLayout(t), this.updateHourOptions(t), this.updateSelectedStates(t), this.updateDisplay(t), this.updatePreview(t);
    }
  }
  /**
   * Set to current time
   */
  setToCurrentTime(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = this.getCurrentTime();
    if (e.format === "12") {
      const i = this.convertHourBetweenFormats(n.hour, "24", "12");
      e.hour = i.hour, e.period = i.period;
    } else
      e.hour = n.hour;
    e.minute = n.minute, e.second = n.second, this.setState(t, e), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.updatePreview(t);
  }
  /**
   * Set preset time
   */
  setPresetTime(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = this.parseTime(e);
    if (i) {
      if (n.format === "12")
        if (i.period)
          n.hour = i.hour, n.period = i.period;
        else {
          const s = this.convertHourBetweenFormats(i.hour, "24", "12");
          n.hour = s.hour, n.period = s.period;
        }
      else if (i.period) {
        const s = this.convertHourBetweenFormats(i.hour, "12", "24", i.period);
        n.hour = s.hour;
      } else
        n.hour = i.hour;
      n.minute = i.minute, n.second = i.second, this.setState(t, n), this.updateSelectedStates(t), this.scrollToSelectedOptions(t), this.updatePreview(t);
    }
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
    const n = this.formatTimeValue(e), i = y.querySelector("[data-timepicker-display]", t);
    if (i)
      if (n)
        i.innerHTML = n;
      else {
        const s = t.dataset.placeholder || "Select time...";
        i.innerHTML = `<span class="text-muted timepicker-placeholder">${s}</span>`;
      }
    n ? t.dataset.hasValue = "true" : delete t.dataset.hasValue, this.updateClearButtonVisibility(t, n);
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
    const n = y.querySelector("[data-timepicker-hidden-input]", t), i = y.querySelector("[data-timepicker-display]", t);
    if (n) {
      n.value = e;
      const a = new Event("input", { bubbles: !0 }), o = new Event("change", { bubbles: !0 });
      n.dispatchEvent(a), n.dispatchEvent(o), window.Livewire && n.hasAttribute("wire:model") && window.Livewire.hook("message.processed", () => {
      });
    }
    if (i)
      if (e)
        i.innerHTML = e;
      else {
        const a = t.dataset.placeholder || "Select time...";
        i.innerHTML = `<span class="text-muted timepicker-placeholder">${a}</span>`;
      }
    e ? t.dataset.hasValue = "true" : delete t.dataset.hasValue, this.updateClearButtonVisibility(t, e);
    const s = this.getState(t);
    s && (s.value = e, this.setState(t, s));
  }
  /**
   * Update clear button visibility based on value
   */
  updateClearButtonVisibility(t, e) {
    const n = y.querySelector("[data-timepicker-clear]", t);
    console.log("🕒 Updating clear button visibility:", { value: e, clearButton: !!n, disabled: t.dataset.disabled }), n && (e && !t.dataset.disabled ? (n.classList.remove("invisible"), console.log("🕒 Clear button shown")) : (n.classList.add("invisible"), console.log("🕒 Clear button hidden")));
  }
  /**
   * Update selected states in dropdown
   */
  updateSelectedStates(t) {
    const e = this.getState(t);
    if (!e) return;
    y.querySelectorAll(".selected", t).forEach((s) => {
      s.classList.remove("selected"), s.hasAttribute("aria-selected") && s.setAttribute("aria-selected", "false"), s.hasAttribute("aria-checked") && s.setAttribute("aria-checked", "false");
    });
    const n = y.querySelector(`[data-timepicker-hour="${e.hour}"]`, t);
    n && (n.classList.add("selected"), n.setAttribute("aria-selected", "true"));
    const i = y.querySelector(`[data-timepicker-minute="${e.minute}"]`, t);
    if (i && (i.classList.add("selected"), i.setAttribute("aria-selected", "true")), e.showSeconds) {
      const s = t.querySelector(`[data-timepicker-second="${e.second}"]`);
      s && (s.classList.add("selected"), s.setAttribute("aria-selected", "true"));
    }
    if (e.format === "12") {
      const s = t.querySelector(`[data-timepicker-period="${e.period}"]`);
      s && (s.classList.add("selected"), s.setAttribute("aria-checked", "true"));
    }
  }
  /**
   * Update format toggle buttons
   */
  updateFormatButtons(t) {
    const e = this.getState(t);
    if (!e) return;
    y.querySelectorAll("[data-timepicker-format]", t).forEach((i) => {
      i.dataset.timepickerFormat === e.format ? (i.dataset.selected = "true", i.setAttribute("aria-pressed", "true")) : (delete i.dataset.selected, i.setAttribute("aria-pressed", "false"));
    });
  }
  /**
   * Update hour options based on current format
   */
  updateHourOptions(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-timepicker-hours]", t);
    if (!n) return;
    const i = e.format === "12" ? Array.from({ length: 12 }, (s, a) => a + 1) : Array.from({ length: 24 }, (s, a) => a);
    n.innerHTML = "", i.forEach((s) => {
      const a = document.createElement("button");
      a.type = "button", a.dataset.timepickerHour = s.toString(), a.className = "w-full px-3 py-2 text-sm text-primary text-left hover:bg-hover focus-visible:bg-accent focus-visible:text-accent-foreground [&.selected]:bg-accent [&.selected]:text-accent-foreground transition-colors", a.textContent = s.toString().padStart(2, "0"), n.appendChild(a);
    }), e.format === "12" && (e.hour < 1 || e.hour > 12) ? (e.hour = Math.max(1, Math.min(12, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t)) : e.format === "24" && (e.hour < 0 || e.hour > 23) && (e.hour = Math.max(0, Math.min(23, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t));
  }
  /**
   * Update visibility of the period (AM/PM) section based on current format
   */
  updatePeriodSectionVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-timepicker-period-section]", t);
    n && (e.format === "12" ? (n.classList.remove("hidden"), n.classList.add("flex", "flex-col")) : (n.classList.add("hidden"), n.classList.remove("flex", "flex-col")));
  }
  /**
   * Update grid layout based on current format and settings
   * Note: Grid columns are now calculated in Blade, this method updates the classes dynamically
   */
  updateGridLayout(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-timepicker-grid]", t);
    if (!n) return;
    n.classList.remove("grid-cols-2", "grid-cols-3", "grid-cols-4");
    let i = 2;
    e.showSeconds && i++, e.format === "12" && i++, n.classList.add(`grid-cols-${i}`);
  }
  /**
   * Scroll to selected options in dropdown lists
   */
  scrollToSelectedOptions(t) {
    y.querySelectorAll(".selected", t).forEach((n) => {
      n.scrollIntoView({ block: "center", behavior: "smooth" });
    });
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
      const l = e.toString(), c = n.toString().padStart(2, "0"), d = i.toString().padStart(2, "0");
      return o ? `${l}:${c}:${d} ${s}` : `${l}:${c} ${s}`;
    } else {
      const l = e.toString().padStart(2, "0"), c = n.toString().padStart(2, "0"), d = i.toString().padStart(2, "0");
      return o ? `${l}:${c}:${d}` : `${l}:${c}`;
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
    T.dispatchCustomEvent(t, e, {
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
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  jr.getInstance().init();
}) : jr.getInstance().init();
window.TimePickerActions = jr;
jr.getInstance();
class Pn {
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
class Ac extends tt {
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
    y.findByDataAttribute("quill-editor", "true").forEach((e) => this.initializeQuillEditor(e));
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
          y.hasDataAttribute(n, "quill-editor", "true") && this.initializeQuillEditor(n), y.findByDataAttribute("quill-editor", "true", n).forEach((s) => this.initializeQuillEditor(s));
        }
      });
    });
  }
  /**
   * Find the hidden input for an editor
   */
  findHiddenInput(t) {
    return y.querySelector('[data-quill-input="true"]', t);
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
    if (!y.getDataAttribute(t, "editorId")) {
      console.warn("Editor missing editorId, skipping initialization");
      return;
    }
    if (this.hasState(t))
      return;
    const n = y.querySelector('[data-quill-container="true"]', t), i = this.findHiddenInput(t), s = y.querySelector('[data-quill-live-region="true"]', t);
    if (!n)
      return;
    const a = y.getDataAttribute(n, "quillConfig");
    let o = "";
    if (i && i.value)
      o = i.value;
    else {
      const f = y.getDataAttribute(n, "quill-value");
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
    Pn.isLivewireEnabled(t);
    const d = {
      quillInstance: c,
      containerElement: n,
      hiddenInput: i,
      config: l,
      liveRegion: s,
      lastAnnouncementTime: 0
    };
    this.setState(t, d), this.setupContentSync(d), this.setupAccessibilityFeatures(d);
  }
  /**
   * Set up content synchronization between Quill and Livewire
   */
  setupContentSync(t) {
    const e = Pn.isLivewireEnabled(t.containerElement);
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
    const e = t.quillInstance.root.innerHTML, n = Pn.formatValueForLivewire(e);
    Pn.updateLivewireProperty(t.containerElement, n);
  }
  /**
   * Reinitialize editor after DOM morphing
   */
  reinitializeAfterMorph(t) {
    y.querySelector('[data-quill-container="true"]', t) && !this.hasState(t) && this.initializeQuillEditor(t);
  }
  /**
   * Manually trigger content sync to Livewire (for debugging)
   */
  manualSync() {
    y.querySelectorAll('[data-quill-container="true"]').forEach((e) => {
      if (Pn.isLivewireEnabled(e)) {
        const n = window.Quill.find(e);
        if (n) {
          const i = n.root.innerHTML, s = Pn.formatValueForLivewire(i);
          Pn.updateLivewireProperty(e, s);
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
Ac.getInstance();
class Ur extends tt {
  initializeElements() {
    y.querySelectorAll("[data-keys-date-picker]").forEach((t) => {
      this.initializeDatePicker(t);
    });
  }
  initializeDatePicker(t) {
    if (this.hasState(t)) return;
    const e = t.dataset.keysDatePickerConfig;
    let n = {};
    try {
      n = e ? JSON.parse(e) : {};
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
      isInline: t.dataset.inline === "true",
      isDisabled: t.dataset.disabled === "true"
    };
    this.setState(t, i), this.setupCalendarEventListeners(t);
  }
  bindEventListeners() {
    T.handleDelegatedClick("[data-date-picker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = y.findClosest(t, "[data-keys-date-picker]");
      n && !this.isDisabled(n) && this.clearDate(n);
    }), T.handleDelegatedClick("[data-quick-selector]", (t, e) => {
      var s;
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-date-picker]"), i = n ? y.querySelector('[data-keys-calendar="true"]', n) : null;
      if (i && ((s = window.KeysUI) != null && s.CalendarCore)) {
        const a = t.dataset.quickSelector;
        a && i.dispatchEvent(new CustomEvent("quickSelector:clicked", {
          detail: { value: a },
          bubbles: !0
        }));
      }
    }), T.handleDelegatedInput("[data-date-picker-input]", (t) => {
      if (!t.readOnly) {
        const e = y.findClosest(t, "[data-keys-date-picker]");
        e && !this.isDisabled(e) && this.handleManualInput(e, t.value);
      }
    });
  }
  setupCalendarEventListeners(t) {
    const e = y.querySelector('[data-keys-calendar="true"]', t);
    e && (e.addEventListener("calendar:dateSelected", (n) => {
      n.stopPropagation();
      const { selectedDate: i, formattedDate: s } = n.detail;
      this.handleDateSelected(t, i, s);
    }), e.addEventListener("calendar:rangeSelected", (n) => {
      n.stopPropagation();
      const { startDate: i, endDate: s, formattedRange: a } = n.detail;
      this.handleRangeSelected(t, i, s, a);
    }), e.addEventListener("calendar:cleared", (n) => {
      n.stopPropagation(), this.handleCalendarCleared(t);
    }));
  }
  handleDateSelected(t, e, n) {
    const i = this.getState(t);
    i && (i.selectedDate = e, this.setState(t, i), this.updateDisplay(t, e ? this.formatDateForDisplay(e, i.displayFormat) : null), this.updateHiddenInput(t, e ? yt.formatDateForSubmission(e, i.format) : ""), i.closeOnSelect && !i.isInline && !i.isRange && this.closePopover(t), this.dispatchDatePickerEvent(t, "datepicker:change", {
      value: e,
      formatted: n
    }));
  }
  handleRangeSelected(t, e, n, i) {
    const s = this.getState(t);
    if (!s) return;
    s.startDate = e, s.endDate = n, this.setState(t, s);
    const a = yt.formatRangeForDisplay(e, n, s.displayFormat);
    this.updateDisplay(t, a);
    const o = yt.formatRangeForSubmission(e, n, s.format);
    this.updateHiddenInput(t, o || ""), s.closeOnSelect && e && n && !s.isInline && this.closePopover(t), this.dispatchDatePickerEvent(t, "datepicker:change", {
      startDate: e,
      endDate: n,
      formatted: i
    });
  }
  handleCalendarCleared(t) {
    this.clearDate(t);
  }
  clearDate(t) {
    var i;
    const e = this.getState(t);
    if (!e) return;
    e.selectedDate = null, e.startDate = null, e.endDate = null, this.setState(t, e), this.updateDisplay(t, null), this.updateHiddenInput(t, "");
    const n = y.querySelector('[data-keys-calendar="true"]', t);
    if (n && ((i = window.KeysUI) != null && i.CalendarCore))
      try {
        const s = window.KeysUI.CalendarCore;
        e.isRange ? s.setSelectedRange(n, null, null) : s.setSelectedDate(n, null);
      } catch {
      }
    e.isInline || this.closePopover(t), this.dispatchDatePickerEvent(t, "datepicker:cleared");
  }
  updateDisplay(t, e) {
    const n = y.querySelector("[data-date-picker-display]", t);
    if (n)
      if (e)
        n.innerHTML = e;
      else {
        const i = t.dataset.placeholder || "Select date...";
        n.innerHTML = `<span class="text-muted date-picker-placeholder">${i}</span>`;
      }
  }
  updateHiddenInput(t, e) {
    const n = y.querySelector("[data-date-picker-value]", t);
    if (n) {
      n.value = e;
      const i = new Event("input", { bubbles: !0 }), s = new Event("change", { bubbles: !0 });
      n.dispatchEvent(i), n.dispatchEvent(s), window.Livewire && n.hasAttribute("wire:model") && window.Livewire.hook("message.processed", () => {
      });
    }
  }
  closePopover(t) {
    setTimeout(() => {
      const e = y.findClosest(t, "[data-keys-popover]") || y.querySelector("[data-keys-popover]", t);
      if (e && "hidePopover" in e)
        try {
          e.hidePopover();
        } catch {
        }
    }, 150);
  }
  handleManualInput(t, e) {
    var s;
    const n = this.getState(t);
    if (!n) return;
    const i = yt.parseInputDate(e, n.displayFormat);
    if (i) {
      const a = yt.formatDateString(i);
      this.updateDisplay(t, this.formatDateForDisplay(a, n.displayFormat));
      const o = y.querySelector('[data-keys-calendar="true"]', t);
      if (o && ((s = window.KeysUI) != null && s.CalendarCore))
        try {
          window.KeysUI.CalendarCore.setSelectedDate(o, a);
        } catch (l) {
          console.warn("Calendar core not available or failed:", l);
        }
    }
  }
  isDisabled(t) {
    const e = this.getState(t);
    return e ? e.isDisabled : !1;
  }
  dispatchDatePickerEvent(t, e, n = null) {
    T.dispatchCustomEvent(t, e, {
      datePicker: t,
      ...n
    }, {
      bubbles: !0,
      cancelable: !0
    });
  }
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          y.hasDataAttribute(n, "keys-date-picker", "true") && this.initializeDatePicker(n), y.findByDataAttribute("keys-date-picker", "true", n).forEach((i) => {
            this.initializeDatePicker(i);
          });
        }
      });
    });
  }
  formatDateForDisplay(t, e) {
    try {
      const n = /* @__PURE__ */ new Date(t + "T00:00:00");
      return isNaN(n.getTime()) ? t : yt.formatDateForDisplay(t, e) || t;
    } catch (n) {
      return console.warn("Date formatting error:", n), t;
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
class Ec extends tt {
  constructor() {
    super(...arguments), this.cleanupFunctions = [];
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      T.handleDelegatedClick(
        '[data-add-to-cart="true"]',
        (t, e) => this.handleAddToCart(t, e)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        ".qty-decrease",
        (t, e) => this.handleQuantityChange(t, e, "decrease")
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        ".qty-increase",
        (t, e) => this.handleQuantityChange(t, e, "increase")
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedInput(
        ".qty-input",
        (t, e) => this.handleQuantityInput(t, e)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedKeydown(
        ".qty-input",
        (t, e) => this.handleQuantityKeydown(t, e)
      )
    );
  }
  initializeElements() {
    y.findByDataAttribute("add-to-cart", "true").forEach((e) => this.initializeButton(e));
  }
  initializeButton(t) {
    const e = this.extractStateFromButton(t);
    if (e) {
      const n = y.querySelector(".button-text", t);
      n && (e.originalText = n.textContent || ""), this.setState(t, e), this.updateButtonState(t), this.updateQuantityControls(t);
    }
  }
  extractStateFromButton(t) {
    const e = y.getDataAttribute(t, "productId");
    return e ? {
      productId: e,
      variantId: y.getDataAttribute(t, "variantId"),
      quantity: parseInt(y.getDataAttribute(t, "quantity") || "1"),
      maxQuantity: parseInt(y.getDataAttribute(t, "maxQuantity") || "99"),
      stockLevel: y.getDataAttribute(t, "stockLevel") ? parseInt(y.getDataAttribute(t, "stockLevel")) : void 0,
      price: y.getDataAttribute(t, "price"),
      ajaxUrl: y.getDataAttribute(t, "ajaxUrl") || "/cart/add",
      inCart: y.getDataAttribute(t, "inCart") === "true",
      isProcessing: !1
    } : (console.warn("AddToCart button missing required data-product-id attribute"), null);
  }
  async handleAddToCart(t, e) {
    if (e.preventDefault(), y.isDisabled(t))
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
        n.inCart = s.inCart ?? !0, n.isProcessing = !1, s.stockLevel !== void 0 && (n.stockLevel = s.stockLevel, y.setDataAttribute(t, "stockLevel", s.stockLevel.toString())), this.setState(t, n), this.setButtonState(t, "added"), this.dispatchCartEvent(t, "cart:added", {
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
    const i = y.getDataAttribute(t, "target");
    if (!i) return;
    const s = y.getElementById(i);
    if (!s) return;
    const a = y.findClosest(t, ".add-to-cart-wrapper"), o = a ? y.querySelector('[data-add-to-cart="true"]', a) : null;
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
  handleQuantityInput(t, e) {
    const n = y.findClosest(t, ".add-to-cart-wrapper"), i = n ? y.querySelector('[data-add-to-cart="true"]', n) : null;
    if (!i) return;
    const s = this.getState(i);
    if (!s) return;
    let a = parseInt(t.value) || 1;
    a = Math.max(1, Math.min(a, s.maxQuantity)), t.value !== a.toString() && (t.value = a.toString()), s.quantity = a, this.setState(i, s), this.updateQuantityControls(i);
  }
  handleQuantityKeydown(t, e) {
    [8, 9, 27, 13, 35, 36, 37, 39, 38, 40].includes(e.keyCode) || e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode) || (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.preventDefault();
  }
  validateQuantity(t, e) {
    return !(t < 1 || t > e.maxQuantity || e.stockLevel !== void 0 && t > e.stockLevel);
  }
  async sendCartRequest(t) {
    var s;
    const e = new FormData();
    e.append("product_id", t.productId), e.append("quantity", t.quantity.toString()), t.variantId && e.append("variant_id", t.variantId);
    const n = (s = y.querySelector('meta[name="csrf-token"]')) == null ? void 0 : s.getAttribute("content");
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
    y.removeClasses(t, ["adding", "added"]), e !== "default" && y.addClass(t, e);
    const n = y.querySelector(".button-text", t);
    if (n) {
      const i = this.getState(t);
      switch (e) {
        case "adding":
          const s = y.getDataAttribute(t, "labelToggle");
          s && (n.textContent = s);
          break;
        case "added":
          const a = y.getDataAttribute(t, "labelSuccess");
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
    e && (e.stockLevel !== void 0 && e.stockLevel <= 0 ? (y.toggleAttribute(t, "disabled", "true"), y.addClasses(t, ["cursor-not-allowed", "opacity-50"])) : (y.toggleAttribute(t, "disabled"), y.removeClasses(t, ["cursor-not-allowed", "opacity-50"])));
  }
  updateQuantityControls(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.findClosest(t, ".add-to-cart-wrapper");
    if (!n) return;
    const i = y.querySelector(".qty-decrease", n);
    i && y.toggleAttribute(i, "disabled", e.quantity <= 1 ? "true" : void 0);
    const s = y.querySelector(".qty-increase", n);
    if (s) {
      const o = e.quantity >= e.maxQuantity || e.stockLevel !== void 0 && e.quantity >= e.stockLevel;
      y.toggleAttribute(s, "disabled", o ? "true" : void 0);
    }
    const a = this.getQuantityInput(t);
    a && (a.max = e.maxQuantity.toString(), e.stockLevel !== void 0 && (a.max = Math.min(e.maxQuantity, e.stockLevel).toString()));
  }
  getQuantityInput(t) {
    const e = y.findClosest(t, ".add-to-cart-wrapper");
    return e ? y.querySelector(".qty-input", e) : null;
  }
  showError(t, e) {
    this.dispatchCartEvent(t, "cart:error", { message: e }), console.error("Add to Cart Error:", e);
  }
  dispatchCartEvent(t, e, n) {
    T.dispatchCustomEvent(t, e, n);
  }
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        e instanceof Element && y.findByDataAttribute("add-to-cart", "true", e).forEach((i) => this.initializeButton(i));
      });
    });
  }
  destroy() {
    this.cleanupFunctions.forEach((t) => t()), this.cleanupFunctions = [], super.destroy();
  }
}
if (typeof document < "u") {
  const r = () => {
    Ec.getInstance().init();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
}
class Sa extends tt {
  constructor() {
    super(), this.cleanupFunctions = [], this.currentModal = null;
  }
  bindEventListeners() {
    this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-trigger]",
        (t, e) => this.handleThumbnailClick(t, e)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-close]",
        (t, e) => this.handleCloseClick(t, e)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-prev]",
        (t, e) => this.handlePrevClick(t, e)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-next]",
        (t, e) => this.handleNextClick(t, e)
      )
    ), this.cleanupFunctions.push(
      T.addEventListener(document, "keydown", (t) => {
        this.handleKeydown(t);
      })
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-modal]",
        (t, e) => this.handleModalBackgroundClick(t, e)
      )
    ), this.cleanupFunctions.push(
      T.handleDelegatedClick(
        "[data-lightbox-trigger]",
        (t, e) => this.handleTriggerClick(t, e)
      )
    );
  }
  initializeElements() {
    console.log("[Lightbox] Initializing lightbox elements...");
    const t = y.findByDataAttribute("file-upload-zone");
    console.log("[Lightbox] Found file upload zones:", t.length), t.forEach((i) => {
      if (i.getAttribute("data-lightbox") === "true") {
        const a = i.parentElement;
        a && (console.log("[Lightbox] Initializing lightbox for upload zone"), this.initializeLightboxForUpload(a));
      }
    });
    const e = y.findByDataAttribute("lightbox-image");
    console.log("[Lightbox] Found standalone images:", e.length), e.forEach((i) => {
      console.log("[Lightbox] Initializing lightbox for image:", i), this.initializeLightboxForImage(i);
    });
    const n = y.findByDataAttribute("gallery");
    console.log("[Lightbox] Found gallery containers:", n.length), n.forEach((i) => {
      const s = i.getAttribute("data-lightbox") === "true";
      console.log("[Lightbox] Gallery has lightbox enabled:", s, i), s && (console.log("[Lightbox] Initializing lightbox for gallery"), this.initializeLightboxForGallery(i));
    }), console.log("[Lightbox] Initialization complete");
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
  /**
   * Handle click on lightbox trigger element (image preview)
   */
  handleTriggerClick(t, e) {
    console.log("[Lightbox] Trigger clicked:", t), e.preventDefault(), e.stopPropagation();
    const n = t.closest(".file-upload-wrapper") || t.closest("[data-gallery]") || t.closest("[data-lightbox-container]") || t.closest("[data-keys-file-upload]");
    if (!n) {
      console.warn("[Lightbox] No container found for trigger:", t);
      return;
    }
    console.log("[Lightbox] Found container:", n);
    const i = this.getState(n);
    if (!i) {
      console.warn("[Lightbox] No state found for container");
      return;
    }
    console.log("[Lightbox] State:", i);
    const s = t.getAttribute("data-lightbox-trigger");
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
    this.currentModal = i, this.updateModalContent(i, n), i.showModal(), T.dispatchCustomEvent(t, "lightbox:open", {
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
      e && (e.isOpen = !1, this.setState(t, e)), T.dispatchCustomEvent(t, "lightbox:close", {});
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
    e.currentImageIndex = n, this.setState(t, e), this.updateModalContent(this.currentModal, e), T.dispatchCustomEvent(t, "lightbox:navigate", {
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
    e.currentImageIndex = n, this.setState(t, e), this.updateModalContent(this.currentModal, e), T.dispatchCustomEvent(t, "lightbox:navigate", {
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
    const e = y.createElement("dialog", {
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
      const d = e.images.length > 1;
      l.style.display = d ? "flex" : "none", c.style.display = d ? "flex" : "none";
    }
  }
  findLightboxContainer(t) {
    const e = y.findClosest(t, "[data-file-upload-id]");
    if (e)
      return e;
    const n = y.findClosest(t, "[data-gallery]");
    if (n)
      return n;
    const i = y.findClosest(t, "[data-lightbox-container]");
    return i || (t.hasAttribute("data-lightbox-image") ? t : null);
  }
  findContainerElementFromModal(t) {
    const n = t.id.replace("-lightbox-modal", "");
    let i = document.querySelector(`[data-file-upload-id="${n}"]`);
    return i || (i = document.querySelector(`[data-gallery-id="${n}"]`), i) || (i = document.getElementById(n), i) ? i : null;
  }
  addImage(t, e) {
    const n = this.getState(t);
    n && (n.images.push(e), this.setState(t, n));
  }
  addImages(t, e) {
    const n = this.getState(t);
    n && (n.images.push(...e), this.setState(t, n));
  }
  setImages(t, e) {
    const n = this.getState(t);
    n && (n.images = e, this.setState(t, n));
  }
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
class Hh extends tt {
  constructor() {
    super(), this.lightboxActions = Sa.getInstance(), this.init();
  }
  /**
   * Initialize gallery elements - required by BaseActionClass
   */
  initializeElements() {
    y.findByDataAttribute("gallery", "true").forEach((t) => {
      this.initializeGallery(t);
    });
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
    T.handleDelegatedKeydown('[data-gallery="true"]', (t, e) => {
      const n = t.dataset.galleryId;
      n && this.handleKeyboardNavigation(e, n, t);
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
    n && T.addEventListener(n, "click", () => {
      this.navigateToImage(e, t, "prev");
    }), i && T.addEventListener(i, "click", () => {
      this.navigateToImage(e, t, "next");
    }), t.querySelectorAll("[data-gallery-thumbnail]").forEach((o, l) => {
      T.addEventListener(o, "click", () => {
        this.goToImage(e, t, l);
      }), T.addEventListener(o, "keydown", (c) => {
        const d = c;
        (d.key === "Enter" || d.key === " ") && (d.preventDefault(), this.goToImage(e, t, l));
      });
    });
    const a = t.querySelector('[data-gallery-action="toggle-autoplay"]');
    a && T.addEventListener(a, "click", () => {
      this.toggleAutoplay(e, t);
    }), this.setupTouchEvents(t, e), T.addEventListener(t, "mouseenter", () => {
      this.pauseAutoplayOnHover(e);
    }), T.addEventListener(t, "mouseleave", () => {
      this.resumeAutoplayOnHover(e, t);
    });
  }
  /**
   * Set up touch/swipe event listeners (simplified for scroll-based navigation)
   */
  setupTouchEvents(t, e) {
    const n = t.querySelector(".gallery-scroll-container");
    n && (T.addEventListener(n, "scroll", () => {
      this.updateCurrentIndexFromScroll(t, n);
    }), T.addEventListener(n, "touchstart", (i) => {
      const s = i, a = this.getState(t);
      a && (a.touchStartX = s.touches[0].clientX, this.setState(t, a));
    }), T.addEventListener(n, "touchmove", (i) => {
      const s = i, a = this.getState(t);
      if (!a || !s.touches[0]) return;
      const o = s.touches[0].clientX, l = s.touches[0].clientY;
      a.touchStartY || (a.touchStartY = l);
      const c = Math.abs(o - a.touchStartX), d = Math.abs(l - a.touchStartY);
      c > 10 && c > d && i.preventDefault(), this.setState(t, a);
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
  updateCurrentIndexFromScroll(t, e) {
    const n = e.querySelectorAll(".gallery-slide");
    if (n.length === 0) return;
    const i = e.getBoundingClientRect(), s = i.left + i.width / 2;
    let a = 0, o = 1 / 0;
    n.forEach((c, d) => {
      const f = c.getBoundingClientRect(), h = f.left + f.width / 2, p = Math.abs(h - s);
      p < o && (o = p, a = d);
    });
    const l = this.getState(t);
    l && l.currentIndex !== a && (l.currentIndex = a, this.setState(t, l), this.updateThumbnails(t, a), this.updateCounter(t, a));
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
   * Update image display using container-only scrolling (no page scroll hijacking)
   */
  updateImageDisplay(t, e) {
    const n = t.querySelector(".gallery-scroll-container");
    if (!n) return;
    const s = n.offsetWidth * e;
    n.scrollTo({
      left: s,
      behavior: "smooth"
    }), n.querySelectorAll(".gallery-slide").forEach((o, l) => {
      const c = o;
      l === e ? (c.classList.add("active"), c.setAttribute("aria-current", "true")) : (c.classList.remove("active"), c.removeAttribute("aria-current"));
    });
  }
  /**
   * Update thumbnail highlighting
   */
  updateThumbnails(t, e) {
    t.querySelectorAll(".gallery-thumbnail").forEach((i, s) => {
      const a = i;
      s === e ? (a.classList.add("active", "border-accent-500"), a.classList.remove("border-transparent"), a.setAttribute("aria-current", "true")) : (a.classList.remove("active", "border-accent-500"), a.classList.add("border-transparent"), a.removeAttribute("aria-current"));
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
   * Start autoplay with scroll-based navigation
   */
  startAutoplay(t, e) {
    const n = this.getState(e);
    if (!n) return;
    const i = parseInt(e.dataset.autoplayDelay || "3000");
    n.autoplayInterval = window.setInterval(() => {
      this.navigateToImageWithScroll(t, e, "next");
    }, i), n.isAutoplayActive = !0, this.setState(e, n), this.updateAutoplayButton(e, !0);
  }
  /**
   * Navigate using scroll-based approach
   */
  navigateToImageWithScroll(t, e, n) {
    const i = this.getState(e);
    if (!i) return;
    const s = parseInt(e.dataset.totalImages || "0"), a = e.dataset.loop === "true";
    let o = i.currentIndex;
    n === "next" ? (o = i.currentIndex + 1, o >= s && (o = a ? 0 : s - 1)) : (o = i.currentIndex - 1, o < 0 && (o = a ? s - 1 : 0)), this.goToImage(t, e, o);
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
    e.className = "gallery-error-placeholder absolute inset-0 flex items-center justify-center bg-elevation-1 border border-line rounded-lg", e.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 text-muted opacity-50">
                    <svg xmlns="http:
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
    e.className = "gallery-thumbnail-error-placeholder absolute inset-0 flex items-center justify-center bg-elevation-1 border border-line rounded text-muted", e.innerHTML = `
            <svg xmlns="http:
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
class Cc extends tt {
  /**
   * Initialize popover elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
  }
  /**
   * Clean up PopoverActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
Cc.getInstance();
class Vh extends tt {
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
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
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
    y.querySelectorAll('[data-keys-image="true"]').forEach((e) => {
      this.initializeImage(e);
    });
  }
  /**
   * Initialize a single image element
   */
  initializeImage(t) {
    const e = t.querySelector("img"), n = t.querySelector('[data-image-fallback="true"]');
    if (!e)
      return;
    const i = t.getAttribute("data-fallback-icon") || "heroicon-o-photo", s = t.getAttribute("data-fallback-text") || "Image placeholder", a = parseInt(t.getAttribute("data-retry-attempts") || "2", 10), o = t.hasAttribute("data-lightbox"), l = {
      element: t,
      img: e,
      fallbackContainer: n,
      fallbackIcon: i,
      fallbackText: s,
      retryCount: 0,
      maxRetries: Math.max(0, Math.min(a, 5)),
      isLoading: !1,
      hasFailed: !1,
      hasLightbox: o
    };
    this.setState(t, l), this.setupImageErrorHandling(l), e.complete && !e.naturalWidth && this.handleImageError(l);
  }
  /**
   * Set up error handling for image
   */
  setupImageErrorHandling(t) {
    t.img && (T.addEventListener(t.img, "error", () => {
      this.handleImageError(t);
    }), T.addEventListener(t.img, "load", () => {
      this.handleImageLoad(t);
    }), t.img.loading === "lazy" && this.setupLazyLoadingSupport(t));
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
  handleImageError(t) {
    if (!t.img || t.hasFailed) return;
    const e = t.img.src;
    if (this.failedUrls.add(e), t.retryCount < t.maxRetries && !this.isKnownFailedUrl(e)) {
      this.retryImageLoad(t);
      return;
    }
    t.hasFailed = !0, this.showFallback(t);
  }
  /**
   * Handle successful image load
   */
  handleImageLoad(t) {
    if (!t.img) return;
    const e = t.img.src;
    this.failedUrls.delete(e), t.hasFailed = !1, t.retryCount = 0, t.isLoading = !1, this.showImage(t);
  }
  /**
   * Retry loading the image after a delay
   */
  retryImageLoad(t) {
    !t.img || t.retryCount >= t.maxRetries || (t.retryCount++, t.isLoading = !0, t.element.setAttribute("data-image-loading", "true"), setTimeout(() => {
      if (!t.img || t.hasFailed) return;
      const e = t.img.src;
      t.img.src = "", requestAnimationFrame(() => {
        t.img && (t.img.src = e);
      });
    }, this.RETRY_DELAY * t.retryCount));
  }
  /**
   * Show the fallback placeholder using existing styled template structure
   */
  showFallback(t) {
    t.img && (t.img.style.display = "none", t.fallbackContainer && (t.fallbackContainer.style.display = "flex"), t.element.setAttribute("data-fallback-active", "true"), t.element.removeAttribute("data-image-active"), t.element.removeAttribute("data-image-loading"), t.hasLightbox && this.disableLightbox(t), this.updateAccessibility(t, "fallback"), this.dispatchImageEvent(t.element, "fallback", {
      fallbackIcon: t.fallbackIcon,
      fallbackText: t.fallbackText,
      originalSrc: t.img.src
    }));
  }
  /**
   * Show the image (hide fallback) using existing template structure
   */
  showImage(t) {
    t.img && (t.img.style.display = "block", t.fallbackContainer && (t.fallbackContainer.style.display = "none"), t.element.setAttribute("data-image-active", "true"), t.element.removeAttribute("data-fallback-active"), t.element.removeAttribute("data-image-loading"), t.hasLightbox && this.enableLightbox(t), this.updateAccessibility(t, "image"), this.dispatchImageEvent(t.element, "imageLoad", {
      src: t.img.src
    }));
  }
  /**
   * Set up lazy loading support
   */
  setupLazyLoadingSupport(t) {
    if (!t.img || !("IntersectionObserver" in window)) return;
    const e = new IntersectionObserver((n) => {
      n.forEach((i) => {
        i.isIntersecting && e.unobserve(i.target);
      });
    }, {
      rootMargin: "50px"
    });
    e.observe(t.img);
  }
  /**
   * Update accessibility attributes based on current state
   */
  updateAccessibility(t, e) {
    var i;
    const n = (i = t.img) == null ? void 0 : i.getAttribute("alt");
    e === "fallback" ? (t.element.setAttribute("aria-label", t.fallbackText), t.img && (t.img.setAttribute("alt", ""), t.img.setAttribute("aria-hidden", "true"))) : e === "image" && n && (t.element.removeAttribute("aria-label"), t.img && (t.img.setAttribute("alt", n), t.img.removeAttribute("aria-hidden")));
  }
  /**
   * Disable lightbox functionality for fallback state
   */
  disableLightbox(t) {
    t.element.removeAttribute("role"), t.element.removeAttribute("tabindex"), t.element.style.cursor = "default", t.element.getAttribute("data-lightbox-trigger") && t.element.setAttribute("data-lightbox-disabled", "true");
  }
  /**
   * Enable lightbox functionality for image state
   */
  enableLightbox(t) {
    t.hasLightbox && (t.element.setAttribute("role", "button"), t.element.setAttribute("tabindex", "0"), t.element.style.cursor = "pointer", t.element.removeAttribute("data-lightbox-disabled"));
  }
  /**
   * Check if URL is known to be failed
   */
  isKnownFailedUrl(t) {
    return this.failedUrls.has(t);
  }
  /**
   * Dispatch custom image events
   */
  dispatchImageEvent(t, e, n = {}) {
    const i = new CustomEvent(`image:${e}`, {
      detail: {
        element: t,
        ...n
      },
      bubbles: !0
    });
    t.dispatchEvent(i);
  }
  /**
   * Public method to manually trigger fallback for an image
   */
  triggerFallback(t) {
    const e = this.getState(t);
    e && !e.hasFailed && this.handleImageError(e);
  }
  /**
   * Public method to retry loading an image
   */
  retryImage(t) {
    const e = this.getState(t);
    e && e.hasFailed && e.img && (e.hasFailed = !1, e.retryCount = 0, this.handleImageLoad(e));
  }
  /**
   * Public method to check if an image has failed
   */
  hasImageFailed(t) {
    const e = this.getState(t);
    return e ? e.hasFailed : !1;
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
  isImageLoading(t) {
    const e = this.getState(t);
    return e ? e.isLoading : !1;
  }
  /**
   * Force reload an image (useful for updating dynamic sources)
   */
  reloadImage(t, e) {
    const n = this.getState(t);
    if (n && n.img)
      if (e)
        n.img.src = e;
      else {
        const i = n.img.src;
        n.img.src = "", requestAnimationFrame(() => {
          n.img && (n.img.src = i);
        });
      }
  }
}
class Yh extends tt {
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
    y.querySelectorAll('[data-keys-chart="true"]').forEach((e) => {
      this.initializeChart(e);
    });
  }
  /**
   * Initialize a single chart element
   */
  initializeChart(t) {
    const e = t.getAttribute("data-interactive") === "true", n = t.getAttribute("data-animated") === "true", i = Array.from(t.querySelectorAll('[data-chart-item="true"]')), s = {
      element: t,
      isInteractive: e,
      isAnimated: n,
      dataItems: i,
      activeClickedItem: void 0,
      tooltipPinned: !1
    };
    this.chartStates.set(t, s), e && i.length > 0 && this.setupInteractiveEvents(s), this.setupKeyboardNavigation(s), this.setupOutsideClickHandler(s), n && this.triggerAnimations(s);
  }
  /**
   * Set up interactive event listeners for chart data items
   */
  setupInteractiveEvents(t) {
    t.dataItems.forEach((e, n) => {
      e.addEventListener("mouseenter", (i) => {
        const s = i.target;
        (!t.tooltipPinned || t.activeClickedItem === s) && this.showTooltip(t, s);
      }), e.addEventListener("mouseleave", () => {
        t.tooltipPinned || this.hideTooltip(t);
      }), e.addEventListener("click", (i) => {
        this.handleDataItemClick(t, i.target);
      });
    });
  }
  /**
   * Set up keyboard navigation for chart accessibility
   */
  setupKeyboardNavigation(t) {
    if (!t.isInteractive || t.dataItems.length === 0)
      return;
    const e = t.dataItems[0];
    if (e) {
      e.setAttribute("tabindex", "0"), e.setAttribute("role", "button");
      const n = e.getAttribute("data-label") || "", i = e.getAttribute("data-value") || "";
      e.setAttribute("aria-label", `${n}: ${i}`);
    }
    t.dataItems.forEach((n, i) => {
      if (!n.getAttribute("aria-label")) {
        const a = n.getAttribute("data-label") || "", o = n.getAttribute("data-value") || "";
        n.setAttribute("aria-label", `${a}: ${o}`);
      }
      n.addEventListener("keydown", (a) => {
        this.handleKeyboardNavigation(t, a, i);
      });
    });
  }
  /**
   * Set up outside click handler for pinned tooltips
   */
  setupOutsideClickHandler(t) {
    const e = (n) => {
      const i = n.target;
      t.tooltipPinned && !t.element.contains(i) && (this.hideTooltip(t), t.tooltipPinned = !1, t.activeClickedItem = void 0);
    };
    this.outsideClickHandlers.set(t.element, e), document.addEventListener("click", e);
  }
  /**
   * Clean up event listeners for a chart (prevents memory leaks)
   */
  destroyChart(t) {
    const e = this.outsideClickHandlers.get(t);
    e && (document.removeEventListener("click", e), this.outsideClickHandlers.delete(t)), this.chartStates.delete(t);
  }
  /**
   * Handle keyboard navigation between chart data items
   */
  handleKeyboardNavigation(t, e, n) {
    let i = -1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        i = (n + 1) % t.dataItems.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        i = n === 0 ? t.dataItems.length - 1 : n - 1;
        break;
      case "Home":
        i = 0;
        break;
      case "End":
        i = t.dataItems.length - 1;
        break;
      case "Enter":
      case " ":
        this.handleDataItemClick(t, e.target), e.preventDefault();
        return;
    }
    i !== -1 && (e.preventDefault(), this.focusDataItem(t, i));
  }
  /**
   * Focus on a specific data item
   */
  focusDataItem(t, e) {
    t.dataItems.forEach((i) => {
      i.setAttribute("tabindex", "-1");
    });
    const n = t.dataItems[e];
    n && (n.setAttribute("tabindex", "0"), n.focus());
  }
  /**
   * Show tooltip for chart item on hover
   */
  showTooltip(t, e) {
    const n = this.extractItemData(e);
    if (!n) return;
    let i = t.element.querySelector("[data-chart-tooltip]");
    i || (i = this.createTooltip(t));
    const s = e.hasAttribute("data-chart-pie-slice");
    let a;
    if (s) {
      const o = e.getAttribute("data-percentage") || "0";
      a = `${n.label}: ${this.formatTooltipValue(n.value)} (${o}%)`;
    } else
      a = `${n.label}: ${this.formatTooltipValue(n.value)}`;
    i.textContent = a, this.positionTooltip(i, e), i.style.opacity = "1", i.style.pointerEvents = "none";
  }
  /**
   * Hide tooltip
   */
  hideTooltip(t) {
    const e = t.element.querySelector("[data-chart-tooltip]");
    e && (e.style.opacity = "0");
  }
  /**
   * Create tooltip element
   */
  createTooltip(t) {
    const e = document.createElement("div");
    return e.setAttribute("data-chart-tooltip", "true"), e.className = "chart-tooltip absolute px-2 py-1 text-xs font-medium pointer-events-none opacity-0 transition-opacity duration-200", t.element.appendChild(e), e;
  }
  /**
   * Position tooltip relative to chart item
   */
  positionTooltip(t, e) {
    var o;
    const n = e.getBoundingClientRect(), i = ((o = t.offsetParent) == null ? void 0 : o.getBoundingClientRect()) || { left: 0, top: 0 }, s = n.left - i.left + n.width / 2 - t.offsetWidth / 2, a = n.top - i.top - t.offsetHeight - 8;
    t.style.left = `${Math.max(0, s)}px`, t.style.top = `${Math.max(0, a)}px`;
  }
  /**
   * Format tooltip value for display
   */
  formatTooltipValue(t) {
    const e = parseFloat(t);
    return isNaN(e) ? t : e.toLocaleString();
  }
  /**
   * Extract data from chart item element for click handling
   */
  extractItemData(t) {
    const e = t.getAttribute("data-index"), n = t.getAttribute("data-value"), i = t.getAttribute("data-label");
    return e === null || n === null || i === null ? null : {
      index: parseInt(e),
      value: n,
      label: i
    };
  }
  /**
   * Handle click events on chart data items
   */
  handleDataItemClick(t, e) {
    var s;
    const n = this.extractItemData(e);
    if (!n) return;
    t.activeClickedItem === e && t.tooltipPinned ? (this.hideTooltip(t), t.tooltipPinned = !1, t.activeClickedItem = void 0) : (this.showTooltip(t, e), t.tooltipPinned = !0, t.activeClickedItem = e), e.blur();
    const i = new CustomEvent("chart:item:click", {
      detail: {
        ...n,
        element: e,
        chart: t.element
      },
      bubbles: !0,
      cancelable: !0
    });
    if (t.element.dispatchEvent(i), "Livewire" in window) {
      const a = t.element.closest("[wire\\:id]");
      if (a) {
        const o = a.getAttribute("wire:id");
        o && ((s = window.Livewire.find(o)) == null || s.$dispatch("chart-item-clicked", {
          index: n.index,
          value: n.value,
          label: n.label
        }));
      }
    }
  }
  /**
   * Trigger chart animations
   * Note: Animations are now handled by CSS @keyframes with animation-delay attributes
   * This method dispatches the animation complete event for framework integration
   */
  triggerAnimations(t) {
    const i = t.dataItems.length * 100 + 800;
    setTimeout(() => {
      const s = new CustomEvent("chart:animation:complete", {
        detail: { chart: t.element },
        bubbles: !0
      });
      t.element.dispatchEvent(s);
    }, i);
  }
  /**
   * Public API: Refresh chart (useful for dynamic data updates)
   */
  refreshChart(t) {
    const e = this.chartStates.get(t);
    e && (e.dataItems = Array.from(t.querySelectorAll('[data-chart-item="true"]')), e.isInteractive && this.setupInteractiveEvents(e), e.isAnimated && this.triggerAnimations(e));
  }
  /**
   * Public API: Update chart data (for dynamic charts)
   */
  updateChartData(t, e) {
    const n = new CustomEvent("chart:data:update", {
      detail: { chart: t, data: e },
      bubbles: !0
    });
    t.dispatchEvent(n);
  }
}
class cm extends tt {
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    document.addEventListener("input", (t) => {
      const e = t.target;
      e.matches("[data-color-input]") && this.handleColorInput(t), e.matches("[data-text-input]") && this.handleTextInput(t);
    }), document.addEventListener("blur", (t) => {
      t.target.matches("[data-text-input]") && this.handleTextBlur(t);
    }, !0), document.addEventListener("keydown", (t) => {
      t.target.matches("[data-text-input]") && this.handleKeydown(t);
    });
  }
  /**
   * Initialize color picker elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll('[data-keys-color-picker="true"]').forEach((e) => {
      this.initializeColorPicker(e);
    });
  }
  /**
   * Initialize a single color picker element
   */
  initializeColorPicker(t) {
    const e = y.querySelector("[data-color-input]", t), n = y.querySelector("[data-text-input]", t);
    if (!e || !n) {
      console.warn("ColorPicker: Required input elements not found");
      return;
    }
    const i = {
      colorInput: e,
      textInput: n,
      isUpdating: !1
    };
    this.setState(t, i);
  }
  /**
   * Handle color picker input changes
   */
  handleColorInput(t) {
    const e = t.target, n = e.closest('[data-keys-color-picker="true"]');
    if (!n) return;
    const i = this.getState(n);
    if (!i || i.isUpdating) return;
    const s = e.value.toUpperCase();
    i.isUpdating = !0, i.textInput.value = s, this.dispatchChangeEvent(i.colorInput), i.isUpdating = !1;
  }
  /**
   * Handle text input changes
   */
  handleTextInput(t) {
    const e = t.target, n = e.closest('[data-keys-color-picker="true"]');
    if (!n) return;
    const i = this.getState(n);
    if (!i || i.isUpdating) return;
    const s = e.value;
    this.isValidHexColor(s) && (i.isUpdating = !0, i.colorInput.value = s.toUpperCase(), i.isUpdating = !1);
  }
  /**
   * Handle text input blur - validate and correct format
   */
  handleTextBlur(t) {
    const e = t.target, n = e.closest('[data-keys-color-picker="true"]');
    if (!n) return;
    const i = this.getState(n);
    if (!i) return;
    let s = e.value.trim();
    s.length > 0 && !s.startsWith("#") && (s = "#" + s), this.isValidHexColor(s) ? (s = s.toUpperCase(), i.isUpdating = !0, i.textInput.value = s, i.colorInput.value = s, this.dispatchChangeEvent(i.colorInput), i.isUpdating = !1) : s !== "" && (i.isUpdating = !0, i.textInput.value = i.colorInput.value, i.isUpdating = !1);
  }
  /**
   * Handle keyboard events
   */
  handleKeydown(t) {
    const n = t.target.closest('[data-keys-color-picker="true"]');
    if (!n) return;
    const i = this.getState(n);
    i && t.key === "Enter" && (t.preventDefault(), i.colorInput.focus(), i.colorInput.click());
  }
  /**
   * Validate hex color format
   */
  isValidHexColor(t) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(t);
  }
  /**
   * Dispatch change event for form integration
   */
  dispatchChangeEvent(t) {
    const e = new Event("change", { bubbles: !0 });
    t.dispatchEvent(e);
  }
  /**
   * Clean up ColorPickerActions - extends BaseActionClass destroy
   */
  onDestroy() {
  }
}
class Tc extends tt {
  constructor() {
    super(...arguments), this.sidebars = /* @__PURE__ */ new Map();
  }
  /**
   * Initialize sidebar elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll('[data-keys-sidebar="true"]').forEach((e) => {
      const n = e.id, i = document.querySelector(`[data-sidebar-overlay][data-sidebar-target="${n}"]`), s = Array.from(document.querySelectorAll(`[data-sidebar-toggle="${n}"]`));
      e.querySelectorAll("details[data-keys-sidebar-section]").forEach((o) => {
        const l = o;
        l.hasAttribute("open") || (l.dataset.originallyCollapsed = "true");
      }), this.sidebars.set(n, {
        sidebar: e,
        overlay: i,
        toggleButtons: s
      });
    }), this.updateAllToggleIcons();
  }
  /**
   * Bind event listeners - required by BaseActionClass
   */
  bindEventListeners() {
    document.addEventListener("click", (t) => {
      const n = t.target.closest("[data-sidebar-toggle]");
      if (n) {
        const i = n.dataset.sidebarToggle;
        i && this.toggleSidebar(i);
      }
    }), document.addEventListener("click", (t) => {
      const e = t.target;
      if (e.matches("[data-sidebar-overlay]")) {
        const n = e.dataset.sidebarTarget;
        n && this.closeSidebar(n);
      }
    }), document.addEventListener("keydown", (t) => {
      t.key === "Escape" && this.closeAllSidebars();
    }), window.addEventListener("resize", () => {
      this.updateAllToggleIcons();
    }), document.addEventListener("sidebar:toggle", (t) => {
      const { sidebarId: e } = t.detail;
      e && this.toggleSidebar(e);
    }), document.addEventListener("sidebar:open", (t) => {
      const { sidebarId: e } = t.detail;
      e && this.openSidebar(e);
    }), document.addEventListener("sidebar:close", (t) => {
      const { sidebarId: e } = t.detail;
      e && this.closeSidebar(e);
    });
  }
  toggleSidebar(t) {
    const e = this.sidebars.get(t);
    if (!e) {
      console.error(`[SidebarActions] Sidebar not found: ${t}`);
      return;
    }
    const { sidebar: n } = e;
    n.dataset.collapsed === "true" ? this.openSidebar(t) : this.closeSidebar(t);
  }
  openSidebar(t) {
    const e = this.sidebars.get(t);
    if (!e) {
      console.error(`[SidebarActions] Sidebar not found: ${t}`);
      return;
    }
    const { sidebar: n, overlay: i, toggleButtons: s } = e;
    n.dataset.collapsed = "false", n.classList.remove("sidebar-collapsed"), n.querySelectorAll("details[data-keys-sidebar-section]").forEach((o) => {
      const l = o;
      l.dataset.originallyCollapsed === "true" && l.removeAttribute("open");
    }), i && (i.classList.remove("opacity-0", "pointer-events-none"), i.classList.add("opacity-100")), this.updateToggleIcons(s, t), n.dispatchEvent(new CustomEvent("sidebar:opened", { detail: { sidebarId: t } })), console.log(`[SidebarActions] Opened sidebar: ${t}`);
  }
  closeSidebar(t) {
    const e = this.sidebars.get(t);
    if (!e) {
      console.error(`[SidebarActions] Sidebar not found: ${t}`);
      return;
    }
    const { sidebar: n, overlay: i, toggleButtons: s } = e;
    n.dataset.collapsed = "true", n.classList.add("sidebar-collapsed"), n.querySelectorAll("details[data-keys-sidebar-section]").forEach((o) => {
      o.setAttribute("open", "");
    }), i && (i.classList.remove("opacity-100"), i.classList.add("opacity-0", "pointer-events-none")), this.updateToggleIcons(s, t), n.dispatchEvent(new CustomEvent("sidebar:closed", { detail: { sidebarId: t } })), console.log(`[SidebarActions] Closed sidebar: ${t}`);
  }
  closeAllSidebars() {
    this.sidebars.forEach((t, e) => {
      this.closeSidebar(e);
    });
  }
  updateAllToggleIcons() {
    this.sidebars.forEach(({ toggleButtons: t }, e) => {
      this.updateToggleIcons(t, e);
    });
  }
  updateToggleIcons(t, e) {
    const n = window.innerWidth < 1024, i = this.sidebars.get(e);
    if (!i) return;
    const { sidebar: s } = i, a = s.dataset.collapsed === "true";
    t.forEach((o) => {
      const l = o.dataset.mobileIcon || "heroicon-o-x-mark", c = o.dataset.desktopIcon || "heroicon-o-chevron-up-down", d = o.querySelector("[data-icon]");
      if (!d) return;
      const f = d.querySelector("svg");
      if (!f) return;
      const h = n && !a ? l : c;
      d.setAttribute("data-icon-name", h), this.updateIconSvg(f, h);
    });
  }
  updateIconSvg(t, e) {
    const i = {
      "heroicon-o-x-mark": "M6 18L18 6M6 6l12 12",
      "heroicon-o-chevron-up-down": "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    }[e];
    if (!i) return;
    t.innerHTML = "";
    const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
    s.setAttribute("stroke-linecap", "round"), s.setAttribute("stroke-linejoin", "round"), s.setAttribute("d", i), t.appendChild(s);
  }
  /**
   * Clean up SidebarActions - extends BaseActionClass destroy
   */
  onDestroy() {
    this.sidebars.clear();
  }
}
Tc.getInstance();
class Lc extends tt {
  constructor() {
    super(...arguments), this.lastUpdate = 0;
  }
  /**
   * Initialize countdown elements
   */
  initializeElements() {
    y.querySelectorAll('[data-keys-countdown="true"]').forEach((e) => {
      this.initializeCountdown(e);
    });
  }
  /**
   * Initialize a single countdown element
   */
  initializeCountdown(t) {
    const e = parseInt(t.dataset.target || "0", 10), n = t.dataset.autoStart !== "false";
    if (!e) {
      console.error("[CountdownActions] Invalid target timestamp for countdown", t);
      return;
    }
    const i = [];
    t.querySelectorAll("[data-unit]").forEach((o) => {
      const l = o, c = l.querySelector(".countdown-value"), d = l.querySelector(".countdown-next");
      !c && !d ? i.push({
        element: l,
        key: l.dataset.unit || "",
        max: parseInt(l.dataset.max || "999", 10)
      }) : i.push({
        element: l,
        key: l.dataset.unit || "",
        max: parseInt(l.dataset.max || "999", 10)
      });
    });
    const a = {
      targetTimestamp: e * 1e3,
      // Convert to milliseconds
      isPaused: !n,
      isComplete: !1,
      showDays: t.dataset.showDays === "true",
      showHours: t.dataset.showHours === "true",
      showMinutes: t.dataset.showMinutes === "true",
      showSeconds: t.dataset.showSeconds === "true",
      showLabels: t.dataset.showLabels === "true",
      completeMessage: t.dataset.completeMessage,
      units: i
    };
    this.stateManager.set(t, a), n && this.startCountdown(t);
  }
  /**
   * Bind event listeners
   */
  bindEventListeners() {
    this.startAnimationFrame();
  }
  /**
   * Start animation frame loop for smooth updates
   */
  startAnimationFrame() {
    const t = (e) => {
      e - this.lastUpdate >= 1e3 && (this.updateAllCountdowns(), this.lastUpdate = e), this.rafId = requestAnimationFrame(t);
    };
    this.rafId = requestAnimationFrame(t);
  }
  /**
   * Update all active countdowns
   */
  updateAllCountdowns() {
    this.stateManager.forEach((t, e) => {
      !t.isPaused && !t.isComplete && this.updateCountdown(e, t);
    });
  }
  /**
   * Update a single countdown
   */
  updateCountdown(t, e) {
    const n = Date.now(), i = Math.max(0, e.targetTimestamp - n);
    if (i === 0 && !e.isComplete) {
      this.completeCountdown(t, e);
      return;
    }
    const s = Math.floor(i / 1e3), a = Math.floor(s / 86400), o = Math.floor(s % 86400 / 3600), l = Math.floor(s % 3600 / 60), c = s % 60;
    e.units.forEach((d) => {
      var b;
      let f = 0;
      switch (d.key) {
        case "days":
          f = a;
          break;
        case "hours":
          f = e.showDays ? o : Math.floor(s / 3600);
          break;
        case "minutes":
          f = e.showHours ? l : Math.floor(s / 60);
          break;
        case "seconds":
          f = e.showMinutes ? c : s;
          break;
      }
      f = Math.min(f, d.max);
      const h = f.toString().padStart(2, "0"), p = d.element.querySelector(".countdown-value"), m = d.element.querySelector(".countdown-next");
      if (p && m) {
        if (((b = p.textContent) == null ? void 0 : b.trim()) !== h) {
          m.textContent = h, this.animateFlip(p, m, h);
          const v = p.getAttribute("aria-label");
          if (v) {
            const S = v.split(" ");
            S[0] = f.toString(), p.setAttribute("aria-label", S.join(" "));
          }
        }
      } else
        d.element.textContent !== h && (d.element.textContent = h);
    }), this.dispatchCountdownEvent(t, "tick", {
      timeRemaining: i,
      days: a,
      hours: o,
      minutes: l,
      seconds: c
    });
  }
  /**
   * Animate flip transition for countdown numbers
   */
  animateFlip(t, e, n) {
    e.textContent = n, e.style.transform = "translateY(-100%)", e.style.opacity = "0", e.offsetHeight, t.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)", e.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)", requestAnimationFrame(() => {
      t.style.transform = "translateY(100%)", t.style.opacity = "0", e.style.transform = "translateY(0)", e.style.opacity = "1";
    }), setTimeout(() => {
      t.textContent = n, t.style.transition = "none", t.style.transform = "translateY(0)", t.style.opacity = "1", e.style.transition = "none", e.style.transform = "translateY(-100%)", e.style.opacity = "0", e.textContent = "";
    }, 500);
  }
  /**
   * Complete a countdown
   */
  completeCountdown(t, e) {
    e.isComplete = !0;
    const n = t.querySelector(".countdown-complete");
    n && (n.style.display = "", n.classList.remove("hidden"), e.units.forEach((i) => {
      var s;
      (s = i.element.parentElement) == null || s.classList.add("hidden");
    })), this.dispatchCountdownEvent(t, "complete", {
      timeRemaining: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  }
  /**
   * Start a countdown
   */
  startCountdown(t) {
    const e = this.stateManager.get(t);
    !e || e.isComplete || (e.isPaused = !1, this.dispatchCountdownEvent(t, "start", this.getTimeValues(t)));
  }
  /**
   * Pause a countdown
   */
  pauseCountdown(t) {
    const e = this.stateManager.get(t);
    !e || e.isComplete || (e.isPaused = !0, this.dispatchCountdownEvent(t, "pause", this.getTimeValues(t)));
  }
  /**
   * Resume a countdown
   */
  resumeCountdown(t) {
    this.startCountdown(t);
  }
  /**
   * Reset a countdown to a new target
   */
  resetCountdown(t, e) {
    const n = this.stateManager.get(t);
    if (!n) return;
    n.targetTimestamp = e ? e * 1e3 : parseInt(t.dataset.target || "0", 10) * 1e3, n.isComplete = !1, n.isPaused = !1;
    const i = t.querySelector(".countdown-complete");
    i && (i.style.display = "none", i.classList.add("hidden")), n.units.forEach((s) => {
      var a;
      (a = s.element.parentElement) == null || a.classList.remove("hidden");
    }), this.updateCountdown(t, n);
  }
  /**
   * Get current time values for a countdown
   */
  getTimeValues(t) {
    const e = this.stateManager.get(t);
    if (!e) return {};
    const n = Date.now(), i = Math.max(0, e.targetTimestamp - n), s = Math.floor(i / 1e3);
    return {
      timeRemaining: i,
      days: Math.floor(s / 86400),
      hours: Math.floor(s % 86400 / 3600),
      minutes: Math.floor(s % 3600 / 60),
      seconds: s % 60
    };
  }
  /**
   * Dispatch countdown event
   */
  dispatchCountdownEvent(t, e, n) {
    T.dispatchCustomEvent(t, `countdown-${e}`, {
      countdown: t,
      ...n
    });
  }
  /**
   * Add event listener for countdown events
   */
  onCountdownEvent(t, e) {
    return T.addEventListener(document, `countdown-${t}`, (n) => {
      e(n.detail);
    });
  }
  /**
   * Get countdown instance by ID
   */
  getCountdown(t) {
    return y.querySelector(`#${t}[data-keys-countdown="true"]`);
  }
  /**
   * Clean up on destroy
   */
  onDestroy() {
    this.rafId && cancelAnimationFrame(this.rafId);
  }
  /**
   * Setup dynamic observer for new countdowns
   */
  setupDynamicObserver() {
    new MutationObserver((e) => {
      e.forEach((n) => {
        n.addedNodes.forEach((i) => {
          i instanceof HTMLElement && (i.matches('[data-keys-countdown="true"]') && this.initializeCountdown(i), i.querySelectorAll('[data-keys-countdown="true"]').forEach((a) => {
            this.initializeCountdown(a);
          }));
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}
Lc.getInstance();
const J = {
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
  singleFilePreview: ".single-file-preview",
  multipleFilesPreview: ".multiple-files-preview",
  fileSummary: ".file-summary",
  fileCount: ".file-count",
  fileTotalSize: ".file-total-size",
  addMoreFilesBtn: ".file-add-more-btn",
  addMoreFilesContainer: ".add-more-files"
}, Ht = {
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
}, Wn = {
  fileRemoved: "File removed",
  uploadFailed: "Upload failed. Please try again.",
  fileTypeError: (r) => `File type not allowed. Accepted: ${r}`,
  fileSizeError: (r) => `File too large. Maximum size: ${r}`,
  invalidFile: "Invalid file",
  maxFilesError: (r) => `Maximum ${r} file(s) allowed`,
  filesRemoved: (r) => `${r} file(s) removed`
}, Nr = /* @__PURE__ */ new Map(), $i = Sa.getInstance(), Dc = () => typeof window.Livewire < "u";
function Gh() {
  const r = document.querySelectorAll(J.container), t = Dc();
  r.forEach((e, n) => {
    const i = e, s = i.closest(".file-upload-wrapper");
    if (!s)
      return;
    const a = i.querySelector(J.fileInput);
    a && (um(s, a, t), dm(i, a), hm(s, a), fm(s, a), gm(s, a, t), $i.setState(s, {
      currentImageIndex: 0,
      images: [],
      isOpen: !1,
      elementId: s.id || `upload-${Date.now()}`
    }), i.setAttribute(Ht.initialized, "true"));
  });
}
function um(r, t, e) {
  const n = r.getAttribute(Ht.multiple) === "true";
  t.addEventListener("change", () => {
    const i = r.hasAttribute("data-adding-more"), s = Nr.get(r) || [];
    if (t.files && t.files.length > 0)
      if (n) {
        const a = i && s.length > 0;
        Wh(r, t, Array.from(t.files), e, a), r.removeAttribute("data-adding-more");
      } else
        Kh(r, t, t.files[0], e);
    else
      Aa(r);
  });
}
function dm(r, t) {
  const e = r.getAttribute(Ht.dragDrop) === "true", n = r.getAttribute(Ht.disabled) === "true";
  if (!e || n)
    return;
  ["dragenter", "dragover", "dragleave", "drop"].forEach((s) => r.addEventListener(s, ym)), ["dragenter", "dragover"].forEach((s) => {
    r.addEventListener(s, () => {
      r.classList.add("dragover");
    });
  }), ["dragleave", "drop"].forEach((s) => {
    r.addEventListener(s, () => {
      r.classList.remove("dragover");
    });
  }), r.addEventListener("drop", (s) => {
    var l;
    const a = (l = s.dataTransfer) == null ? void 0 : l.files, o = r.getAttribute(Ht.multiple) === "true";
    a && a.length > 0 && (o ? Wh(r, t, Array.from(a)) : Kh(r, t, a[0], Dc()));
  });
}
function hm(r, t) {
  const e = r.querySelector(J.changeButton);
  e && e.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), t.disabled || t.click();
  });
  const n = r.querySelector(J.emptyState);
  n && n.addEventListener("click", (s) => {
    s.target.closest(J.fileInput) || r.hasAttribute("data-is-removing") || t.disabled || t.click();
  });
  const i = r.querySelector(J.addMoreFilesBtn);
  i && i.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), t.disabled || (r.setAttribute("data-adding-more", "true"), t.click());
  }), r.addEventListener("click", (s) => {
    const o = s.target.closest("[data-remove-file]");
    if (o) {
      s.preventDefault(), s.stopPropagation();
      const l = parseInt(o.getAttribute("data-remove-file") || "0");
      pm(r, t, l);
    }
  });
}
function fm(r, t) {
  const e = r.querySelector(J.removeButton);
  e && e.addEventListener("click", (n) => {
    n.preventDefault(), n.stopPropagation(), r.setAttribute("data-is-removing", "true"), t.value = "", Aa(r), Ea(r), Fi(r, Wn.fileRemoved), setTimeout(() => {
      r.removeAttribute("data-is-removing");
    }, 150), r.getAttribute(Ht.livewire) === "true" && t.dispatchEvent(new Event("change", { bubbles: !0 }));
  });
}
function pm(r, t, e) {
  const n = Nr.get(r) || [];
  if (e < 0 || e >= n.length)
    return;
  const i = `preview-${e}-`, s = $i.getState(r);
  s && s.images && s.images.filter((o) => o.id.startsWith(i)).forEach((o) => {
    $i.removeImage(r, o.id);
  }), n.splice(e, 1), n.length === 0 ? (Nr.delete(r), t.value = "", Aa(r), Fi(r, Wn.fileRemoved)) : (Nr.set(r, n), Qh(t, n), Xh(r, n), Fi(r, `File removed. ${n.length} file(s) remaining`));
}
function gm(r, t, e) {
  const n = r.getAttribute(Ht.livewire) === "true";
  !e || !n || (t.addEventListener("livewire-upload-start", () => {
    t.setAttribute("data-livewire-upload-started", "true"), Hn(r, !0), Sl(r, 0);
  }), t.addEventListener("livewire-upload-progress", (i) => {
    var a;
    const s = i;
    (a = s.detail) != null && a.progress && Sl(r, s.detail.progress);
  }), t.addEventListener("livewire-upload-finish", () => {
    t.removeAttribute("data-livewire-upload-started"), Hn(r, !1), t.files && t.files.length > 0 && xl(r, t.files[0]);
  }), t.addEventListener("livewire-upload-error", (i) => {
    var a;
    ia(r, ((a = i.detail) == null ? void 0 : a.message) || Wn.uploadFailed), Hn(r, !1);
  }), t.addEventListener("livewire-upload-cancel", () => {
    Hn(r, !1), Ea(r);
  }));
}
function Kh(r, t, e, n) {
  const i = Zh(r, e);
  if (!i.valid) {
    ia(r, i.error || Wn.invalidFile);
    return;
  }
  Ea(r);
  const s = r.getAttribute(Ht.livewire) === "true", a = n && typeof window.Livewire < "u";
  s && a ? (Hn(r, !0), Sl(r, 0), setTimeout(() => {
    t.hasAttribute("data-livewire-upload-started") || (Hn(r, !1), xl(r, e));
  }, 500)) : xl(r, e);
}
function Wh(r, t, e, n, i = !1) {
  const s = r.getAttribute(Ht.maxFiles), a = Nr.get(r) || [];
  let o = i ? [...a] : [];
  for (const l of e) {
    const c = Zh(r, l);
    if (!c.valid) {
      ia(r, c.error || Wn.invalidFile);
      continue;
    }
    if (s && o.length >= parseInt(s)) {
      ia(r);
      break;
    }
    o.push(l);
  }
  if (o.length === 0) {
    Aa(r);
    return;
  }
  Nr.set(r, o), Qh(t, o), Ea(r), Xh(r, o);
}
function Qh(r, t) {
  const e = new DataTransfer();
  t.forEach((n) => e.items.add(n)), r.files = e.files;
}
function Zh(r, t) {
  const e = r.getAttribute(Ht.accept), n = r.getAttribute(Ht.maxSize), i = r.getAttribute(Ht.maxSizeFormatted);
  if (e && e !== "*") {
    const s = e.split(",").map((o) => o.trim());
    if (!s.some((o) => o.startsWith(".") ? t.name.toLowerCase().endsWith(o.toLowerCase()) : o.includes("*") ? t.type.startsWith(o.split("/")[0] + "/") : t.type === o))
      return {
        valid: !1,
        error: Wn.fileTypeError(s.join(", "))
      };
  }
  return n && t.size > parseInt(n) ? {
    valid: !1,
    error: Wn.fileSizeError(i || "10MB")
  } : { valid: !0 };
}
function Aa(r) {
  const t = r.querySelector(J.emptyState), e = r.querySelector(J.fileState);
  vt(t, !0), vt(e, !1), Hn(r, !1), r.classList.remove("dragover");
}
function xl(r, t) {
  const e = r.querySelector(J.emptyState), n = r.querySelector(J.fileState), i = r.querySelector(J.singleFilePreview), s = r.querySelector(J.multipleFilesPreview), a = r.querySelector(J.fileSummary), o = r.querySelector(J.addMoreFilesContainer);
  vt(e, !1), vt(n, !0), vt(i, !0), vt(s, !1), vt(a, !1), vt(o, !1), bm(r, t), Fi(r, `File selected: ${t.name}`);
}
function Xh(r, t) {
  const e = r.querySelector(J.emptyState), n = r.querySelector(J.fileState), i = r.querySelector(J.singleFilePreview), s = r.querySelector(J.multipleFilesPreview), a = r.querySelector(J.fileSummary), o = r.querySelector(J.fileCount), l = r.querySelector(J.fileTotalSize), c = r.querySelector(J.addMoreFilesContainer);
  if (vt(e, !1), vt(n, !0), vt(i, !1), vt(s, !0), vt(a, !0), vt(c, !0), o && (o.textContent = t.length.toString()), l) {
    const d = t.reduce((f, h) => f + h.size, 0);
    l.textContent = Gn(d);
  }
  s && (s.innerHTML = "", t.forEach((d, f) => {
    const h = mm(r, d, f);
    s.appendChild(h);
  })), Fi(r, `${t.length} file(s) selected`);
}
function mm(r, t, e) {
  const n = document.createElement("div");
  n.className = "file-card relative p-3 rounded-lg border-2 border-line bg-elevation-1 hover:border-accent transition-colors", n.setAttribute("data-file-index", e.toString());
  const i = document.createElement("div");
  i.className = "mb-2 relative";
  const s = document.createElement("img");
  s.className = "hidden w-full h-24 object-cover rounded", s.alt = t.name;
  const a = document.createElement("div");
  if (a.className = "flex items-center justify-center w-full h-24 bg-elevation-1 border border-line rounded", a.innerHTML = `<svg class="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>`, i.appendChild(s), i.appendChild(a), t.type.startsWith("image/")) {
    const f = new FileReader();
    f.onload = (h) => {
      var p;
      if ((p = h.target) != null && p.result) {
        const m = h.target.result;
        s.src = m, s.classList.remove("hidden"), a.classList.add("hidden");
        const b = `preview-${e}-${Date.now()}`;
        s.setAttribute("data-lightbox-trigger", b), s.setAttribute("data-filename", t.name), s.setAttribute("data-filetype", "image"), s.setAttribute("data-filesize", Gn(t.size)), s.style.cursor = "pointer", s.setAttribute("role", "button"), s.setAttribute("tabindex", "0"), s.setAttribute("aria-label", `View ${t.name} in lightbox`), $i.addImage(r, {
          id: b,
          src: m,
          alt: t.name,
          fileName: t.name,
          fileSize: Gn(t.size),
          fileType: t.type
        });
      }
    }, f.readAsDataURL(t);
  }
  const o = document.createElement("div");
  o.className = "space-y-1";
  const l = document.createElement("div");
  l.className = "text-sm font-medium text-primary truncate", l.textContent = t.name, l.title = t.name;
  const c = document.createElement("div");
  c.className = "text-xs text-muted", c.textContent = Gn(t.size), o.appendChild(l), o.appendChild(c);
  const d = document.createElement("button");
  return d.type = "button", d.className = "absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-danger text-white hover:bg-danger-hover transition-colors", d.setAttribute("data-remove-file", e.toString()), d.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>`, n.appendChild(i), n.appendChild(o), n.appendChild(d), n;
}
function bm(r, t) {
  const e = r.querySelector(J.fileName), n = r.querySelector(J.fileSize), i = r.querySelector(J.previewImage), s = r.querySelector(J.fileIcon);
  if (e && (e.textContent = t.name), n && (n.textContent = Gn(t.size)), t.type.startsWith("image/")) {
    const a = new FileReader();
    a.onload = (o) => {
      var l;
      if (i && ((l = o.target) != null && l.result)) {
        const c = o.target.result;
        i.src = c;
        const d = "preview-" + Date.now();
        i.setAttribute("data-lightbox-trigger", d), i.setAttribute("data-filename", t.name), i.setAttribute("data-filetype", "image"), i.setAttribute("data-filesize", Gn(t.size)), i.style.cursor = "pointer", i.setAttribute("role", "button"), i.setAttribute("tabindex", "0"), i.setAttribute("aria-label", `View ${t.name} in lightbox`);
        const f = i.closest(".file-upload-wrapper");
        f && $i.addImage(f, {
          id: d,
          src: c,
          alt: t.name,
          fileName: t.name,
          fileSize: Gn(t.size),
          fileType: t.type
        }), vt(i, !0), vt(s, !1);
      }
    }, a.readAsDataURL(t);
  } else
    vt(i, !1), vt(s, !0);
}
function Hn(r, t) {
  const e = r.querySelector(J.uploadProgress);
  vt(e, t);
}
function ia(r, t) {
  r.setAttribute(Ht.invalid, "true");
}
function Ea(r) {
  r.removeAttribute(Ht.invalid);
}
function Gn(r) {
  if (r === 0) return "0 Bytes";
  const t = 1024, e = ["Bytes", "KB", "MB", "GB"], n = Math.floor(Math.log(r) / Math.log(t));
  return parseFloat((r / Math.pow(t, n)).toFixed(2)) + " " + e[n];
}
function vt(r, t) {
  r && r.classList.toggle("hidden", !t);
}
function Sl(r, t) {
  const e = r.querySelector(J.progressBar);
  e && (e.style.width = `${t}%`);
}
function ym(r) {
  r.preventDefault(), r.stopPropagation();
}
function Fi(r, t) {
  const e = document.createElement("div");
  e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), e.className = "sr-only", e.textContent = t, r.appendChild(e), setTimeout(() => {
    r.contains(e) && r.removeChild(e);
  }, 1e3);
}
document.addEventListener("DOMContentLoaded", Gh);
Dc() && document.addEventListener("livewire:navigated", Gh);
function Eu() {
  console.log("[Tabs] Initializing tabs...");
  const r = document.querySelectorAll("[data-keys-tabs]");
  console.log("[Tabs] Found tabs containers:", r.length), r.forEach((t) => {
    const e = t.querySelectorAll("[data-tab]"), n = t.querySelectorAll("[data-tab-panel]"), i = t.querySelector("[data-tab-slider]"), s = t.querySelector('[role="tablist"]'), a = t.getAttribute("data-value");
    if (!e.length || !n.length || !s)
      return;
    function o(h) {
      const p = h.getAttribute("data-tab");
      p && (l(h), e.forEach((m) => {
        const b = m === h;
        m.classList.toggle("text-primary", b), m.classList.toggle("font-semibold", b), m.classList.toggle("text-muted", !b), m.setAttribute("aria-selected", String(b)), m.setAttribute("tabindex", b ? "0" : "-1");
      }), n.forEach((m) => {
        const k = m.getAttribute("data-tab-panel") === p;
        m.classList.toggle("hidden", !k), m.setAttribute("aria-hidden", String(!k)), k ? m.classList.add("block") : m.classList.remove("block");
      }), t.setAttribute("data-value", p));
    }
    function l(h) {
      if (!i) return;
      const p = s.getBoundingClientRect(), m = h.getBoundingClientRect(), b = m.left - p.left, k = i.classList.contains("inset-y-1");
      if (i.style.width = `${m.width}px`, i.style.left = `${b}px`, !k) {
        const v = m.top - p.top;
        i.style.height = `${m.height}px`, i.style.top = `${v}px`;
      }
    }
    function c(h) {
      const p = h.target, m = Array.from(e).indexOf(p);
      let b = null;
      const v = (t.getAttribute("data-orientation") || "horizontal") === "horizontal";
      switch (h.key) {
        case (v ? "ArrowLeft" : "ArrowUp"):
          h.preventDefault(), b = e[m - 1] || e[e.length - 1];
          break;
        case (v ? "ArrowRight" : "ArrowDown"):
          h.preventDefault(), b = e[m + 1] || e[0];
          break;
        case "Home":
          h.preventDefault(), b = e[0];
          break;
        case "End":
          h.preventDefault(), b = e[e.length - 1];
          break;
      }
      b && (o(b), b.focus());
    }
    e.forEach((h) => {
      h.addEventListener("click", () => {
        h.hasAttribute("disabled") || o(h);
      }), h.addEventListener("keydown", c);
    });
    const d = a ? t.querySelector(`[data-tab="${a}"]`) : e[0];
    d && setTimeout(() => {
      o(d);
    }, 50);
    let f;
    window.addEventListener("resize", () => {
      clearTimeout(f), f = window.setTimeout(() => {
        const h = t.querySelector('[data-tab][aria-selected="true"]');
        h && i && l(h);
      }, 100);
    });
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Eu) : Eu();
var Jh = typeof global == "object" && global && global.Object === Object && global, vm = typeof self == "object" && self && self.Object === Object && self, Ke = Jh || vm || Function("return this")(), En = Ke.Symbol, tf = Object.prototype, wm = tf.hasOwnProperty, km = tf.toString, xi = En ? En.toStringTag : void 0;
function xm(r) {
  var t = wm.call(r, xi), e = r[xi];
  try {
    r[xi] = void 0;
    var n = !0;
  } catch {
  }
  var i = km.call(r);
  return n && (t ? r[xi] = e : delete r[xi]), i;
}
var Sm = Object.prototype, Am = Sm.toString;
function Em(r) {
  return Am.call(r);
}
var Cm = "[object Null]", Tm = "[object Undefined]", Cu = En ? En.toStringTag : void 0;
function ti(r) {
  return r == null ? r === void 0 ? Tm : Cm : Cu && Cu in Object(r) ? xm(r) : Em(r);
}
function sn(r) {
  return r != null && typeof r == "object";
}
var Qn = Array.isArray;
function Dn(r) {
  var t = typeof r;
  return r != null && (t == "object" || t == "function");
}
function ef(r) {
  return r;
}
var Lm = "[object AsyncFunction]", Dm = "[object Function]", Im = "[object GeneratorFunction]", Nm = "[object Proxy]";
function Ic(r) {
  if (!Dn(r))
    return !1;
  var t = ti(r);
  return t == Dm || t == Im || t == Lm || t == Nm;
}
var Bo = Ke["__core-js_shared__"], Tu = function() {
  var r = /[^.]+$/.exec(Bo && Bo.keys && Bo.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function Om(r) {
  return !!Tu && Tu in r;
}
var Mm = Function.prototype, qm = Mm.toString;
function er(r) {
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
var _m = /[\\^$.*+?()[\]{}|]/g, zm = /^\[object .+?Constructor\]$/, Rm = Function.prototype, Pm = Object.prototype, Bm = Rm.toString, $m = Pm.hasOwnProperty, Fm = RegExp(
  "^" + Bm.call($m).replace(_m, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function jm(r) {
  if (!Dn(r) || Om(r))
    return !1;
  var t = Ic(r) ? Fm : zm;
  return t.test(er(r));
}
function Um(r, t) {
  return r == null ? void 0 : r[t];
}
function nr(r, t) {
  var e = Um(r, t);
  return jm(e) ? e : void 0;
}
var Al = nr(Ke, "WeakMap"), Lu = Object.create, Hm = /* @__PURE__ */ function() {
  function r() {
  }
  return function(t) {
    if (!Dn(t))
      return {};
    if (Lu)
      return Lu(t);
    r.prototype = t;
    var e = new r();
    return r.prototype = void 0, e;
  };
}();
function Vm(r, t, e) {
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
function Ym(r, t) {
  var e = -1, n = r.length;
  for (t || (t = Array(n)); ++e < n; )
    t[e] = r[e];
  return t;
}
var Gm = 800, Km = 16, Wm = Date.now;
function Qm(r) {
  var t = 0, e = 0;
  return function() {
    var n = Wm(), i = Km - (n - e);
    if (e = n, i > 0) {
      if (++t >= Gm)
        return arguments[0];
    } else
      t = 0;
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
}(), Xm = sa ? function(r, t) {
  return sa(r, "toString", {
    configurable: !0,
    enumerable: !1,
    value: Zm(t),
    writable: !0
  });
} : ef, Jm = Qm(Xm);
function tb(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length; ++e < n && t(r[e], e, r) !== !1; )
    ;
  return r;
}
var eb = 9007199254740991, nb = /^(?:0|[1-9]\d*)$/;
function nf(r, t) {
  var e = typeof r;
  return t = t ?? eb, !!t && (e == "number" || e != "symbol" && nb.test(r)) && r > -1 && r % 1 == 0 && r < t;
}
function Nc(r, t, e) {
  t == "__proto__" && sa ? sa(r, t, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : r[t] = e;
}
function es(r, t) {
  return r === t || r !== r && t !== t;
}
var rb = Object.prototype, ib = rb.hasOwnProperty;
function rf(r, t, e) {
  var n = r[t];
  (!(ib.call(r, t) && es(n, e)) || e === void 0 && !(t in r)) && Nc(r, t, e);
}
function sb(r, t, e, n) {
  var i = !e;
  e || (e = {});
  for (var s = -1, a = t.length; ++s < a; ) {
    var o = t[s], l = void 0;
    l === void 0 && (l = r[o]), i ? Nc(e, o, l) : rf(e, o, l);
  }
  return e;
}
var Du = Math.max;
function ab(r, t, e) {
  return t = Du(t === void 0 ? r.length - 1 : t, 0), function() {
    for (var n = arguments, i = -1, s = Du(n.length - t, 0), a = Array(s); ++i < s; )
      a[i] = n[t + i];
    i = -1;
    for (var o = Array(t + 1); ++i < t; )
      o[i] = n[i];
    return o[t] = e(a), Vm(r, this, o);
  };
}
function ob(r, t) {
  return Jm(ab(r, t, ef), r + "");
}
var lb = 9007199254740991;
function sf(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= lb;
}
function Ca(r) {
  return r != null && sf(r.length) && !Ic(r);
}
function cb(r, t, e) {
  if (!Dn(e))
    return !1;
  var n = typeof t;
  return (n == "number" ? Ca(e) && nf(t, e.length) : n == "string" && t in e) ? es(e[t], r) : !1;
}
function ub(r) {
  return ob(function(t, e) {
    var n = -1, i = e.length, s = i > 1 ? e[i - 1] : void 0, a = i > 2 ? e[2] : void 0;
    for (s = r.length > 3 && typeof s == "function" ? (i--, s) : void 0, a && cb(e[0], e[1], a) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++n < i; ) {
      var o = e[n];
      o && r(t, o, n, s);
    }
    return t;
  });
}
var db = Object.prototype;
function Oc(r) {
  var t = r && r.constructor, e = typeof t == "function" && t.prototype || db;
  return r === e;
}
function hb(r, t) {
  for (var e = -1, n = Array(r); ++e < r; )
    n[e] = t(e);
  return n;
}
var fb = "[object Arguments]";
function Iu(r) {
  return sn(r) && ti(r) == fb;
}
var af = Object.prototype, pb = af.hasOwnProperty, gb = af.propertyIsEnumerable, El = Iu(/* @__PURE__ */ function() {
  return arguments;
}()) ? Iu : function(r) {
  return sn(r) && pb.call(r, "callee") && !gb.call(r, "callee");
};
function mb() {
  return !1;
}
var of = typeof exports == "object" && exports && !exports.nodeType && exports, Nu = of && typeof module == "object" && module && !module.nodeType && module, bb = Nu && Nu.exports === of, Ou = bb ? Ke.Buffer : void 0, yb = Ou ? Ou.isBuffer : void 0, ji = yb || mb, vb = "[object Arguments]", wb = "[object Array]", kb = "[object Boolean]", xb = "[object Date]", Sb = "[object Error]", Ab = "[object Function]", Eb = "[object Map]", Cb = "[object Number]", Tb = "[object Object]", Lb = "[object RegExp]", Db = "[object Set]", Ib = "[object String]", Nb = "[object WeakMap]", Ob = "[object ArrayBuffer]", Mb = "[object DataView]", qb = "[object Float32Array]", _b = "[object Float64Array]", zb = "[object Int8Array]", Rb = "[object Int16Array]", Pb = "[object Int32Array]", Bb = "[object Uint8Array]", $b = "[object Uint8ClampedArray]", Fb = "[object Uint16Array]", jb = "[object Uint32Array]", lt = {};
lt[qb] = lt[_b] = lt[zb] = lt[Rb] = lt[Pb] = lt[Bb] = lt[$b] = lt[Fb] = lt[jb] = !0;
lt[vb] = lt[wb] = lt[Ob] = lt[kb] = lt[Mb] = lt[xb] = lt[Sb] = lt[Ab] = lt[Eb] = lt[Cb] = lt[Tb] = lt[Lb] = lt[Db] = lt[Ib] = lt[Nb] = !1;
function Ub(r) {
  return sn(r) && sf(r.length) && !!lt[ti(r)];
}
function Mc(r) {
  return function(t) {
    return r(t);
  };
}
var lf = typeof exports == "object" && exports && !exports.nodeType && exports, Oi = lf && typeof module == "object" && module && !module.nodeType && module, Hb = Oi && Oi.exports === lf, $o = Hb && Jh.process, Hr = function() {
  try {
    var r = Oi && Oi.require && Oi.require("util").types;
    return r || $o && $o.binding && $o.binding("util");
  } catch {
  }
}(), Mu = Hr && Hr.isTypedArray, qc = Mu ? Mc(Mu) : Ub, Vb = Object.prototype, Yb = Vb.hasOwnProperty;
function cf(r, t) {
  var e = Qn(r), n = !e && El(r), i = !e && !n && ji(r), s = !e && !n && !i && qc(r), a = e || n || i || s, o = a ? hb(r.length, String) : [], l = o.length;
  for (var c in r)
    (t || Yb.call(r, c)) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    nf(c, l))) && o.push(c);
  return o;
}
function uf(r, t) {
  return function(e) {
    return r(t(e));
  };
}
var Gb = uf(Object.keys, Object), Kb = Object.prototype, Wb = Kb.hasOwnProperty;
function Qb(r) {
  if (!Oc(r))
    return Gb(r);
  var t = [];
  for (var e in Object(r))
    Wb.call(r, e) && e != "constructor" && t.push(e);
  return t;
}
function Zb(r) {
  return Ca(r) ? cf(r) : Qb(r);
}
function Xb(r) {
  var t = [];
  if (r != null)
    for (var e in Object(r))
      t.push(e);
  return t;
}
var Jb = Object.prototype, ty = Jb.hasOwnProperty;
function ey(r) {
  if (!Dn(r))
    return Xb(r);
  var t = Oc(r), e = [];
  for (var n in r)
    n == "constructor" && (t || !ty.call(r, n)) || e.push(n);
  return e;
}
function df(r) {
  return Ca(r) ? cf(r, !0) : ey(r);
}
var Ui = nr(Object, "create");
function ny() {
  this.__data__ = Ui ? Ui(null) : {}, this.size = 0;
}
function ry(r) {
  var t = this.has(r) && delete this.__data__[r];
  return this.size -= t ? 1 : 0, t;
}
var iy = "__lodash_hash_undefined__", sy = Object.prototype, ay = sy.hasOwnProperty;
function oy(r) {
  var t = this.__data__;
  if (Ui) {
    var e = t[r];
    return e === iy ? void 0 : e;
  }
  return ay.call(t, r) ? t[r] : void 0;
}
var ly = Object.prototype, cy = ly.hasOwnProperty;
function uy(r) {
  var t = this.__data__;
  return Ui ? t[r] !== void 0 : cy.call(t, r);
}
var dy = "__lodash_hash_undefined__";
function hy(r, t) {
  var e = this.__data__;
  return this.size += this.has(r) ? 0 : 1, e[r] = Ui && t === void 0 ? dy : t, this;
}
function Zn(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
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
function Ta(r, t) {
  for (var e = r.length; e--; )
    if (es(r[e][0], t))
      return e;
  return -1;
}
var py = Array.prototype, gy = py.splice;
function my(r) {
  var t = this.__data__, e = Ta(t, r);
  if (e < 0)
    return !1;
  var n = t.length - 1;
  return e == n ? t.pop() : gy.call(t, e, 1), --this.size, !0;
}
function by(r) {
  var t = this.__data__, e = Ta(t, r);
  return e < 0 ? void 0 : t[e][1];
}
function yy(r) {
  return Ta(this.__data__, r) > -1;
}
function vy(r, t) {
  var e = this.__data__, n = Ta(e, r);
  return n < 0 ? (++this.size, e.push([r, t])) : e[n][1] = t, this;
}
function cn(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
cn.prototype.clear = fy;
cn.prototype.delete = my;
cn.prototype.get = by;
cn.prototype.has = yy;
cn.prototype.set = vy;
var Hi = nr(Ke, "Map");
function wy() {
  this.size = 0, this.__data__ = {
    hash: new Zn(),
    map: new (Hi || cn)(),
    string: new Zn()
  };
}
function ky(r) {
  var t = typeof r;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? r !== "__proto__" : r === null;
}
function La(r, t) {
  var e = r.__data__;
  return ky(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
}
function xy(r) {
  var t = La(this, r).delete(r);
  return this.size -= t ? 1 : 0, t;
}
function Sy(r) {
  return La(this, r).get(r);
}
function Ay(r) {
  return La(this, r).has(r);
}
function Ey(r, t) {
  var e = La(this, r), n = e.size;
  return e.set(r, t), this.size += e.size == n ? 0 : 1, this;
}
function rr(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
rr.prototype.clear = wy;
rr.prototype.delete = xy;
rr.prototype.get = Sy;
rr.prototype.has = Ay;
rr.prototype.set = Ey;
function Cy(r, t) {
  for (var e = -1, n = t.length, i = r.length; ++e < n; )
    r[i + e] = t[e];
  return r;
}
var hf = uf(Object.getPrototypeOf, Object), Ty = "[object Object]", Ly = Function.prototype, Dy = Object.prototype, ff = Ly.toString, Iy = Dy.hasOwnProperty, Ny = ff.call(Object);
function Oy(r) {
  if (!sn(r) || ti(r) != Ty)
    return !1;
  var t = hf(r);
  if (t === null)
    return !0;
  var e = Iy.call(t, "constructor") && t.constructor;
  return typeof e == "function" && e instanceof e && ff.call(e) == Ny;
}
function My() {
  this.__data__ = new cn(), this.size = 0;
}
function qy(r) {
  var t = this.__data__, e = t.delete(r);
  return this.size = t.size, e;
}
function _y(r) {
  return this.__data__.get(r);
}
function zy(r) {
  return this.__data__.has(r);
}
var Ry = 200;
function Py(r, t) {
  var e = this.__data__;
  if (e instanceof cn) {
    var n = e.__data__;
    if (!Hi || n.length < Ry - 1)
      return n.push([r, t]), this.size = ++e.size, this;
    e = this.__data__ = new rr(n);
  }
  return e.set(r, t), this.size = e.size, this;
}
function Fe(r) {
  var t = this.__data__ = new cn(r);
  this.size = t.size;
}
Fe.prototype.clear = My;
Fe.prototype.delete = qy;
Fe.prototype.get = _y;
Fe.prototype.has = zy;
Fe.prototype.set = Py;
var pf = typeof exports == "object" && exports && !exports.nodeType && exports, qu = pf && typeof module == "object" && module && !module.nodeType && module, By = qu && qu.exports === pf, _u = By ? Ke.Buffer : void 0, zu = _u ? _u.allocUnsafe : void 0;
function gf(r, t) {
  if (t)
    return r.slice();
  var e = r.length, n = zu ? zu(e) : new r.constructor(e);
  return r.copy(n), n;
}
function $y(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length, i = 0, s = []; ++e < n; ) {
    var a = r[e];
    t(a, e, r) && (s[i++] = a);
  }
  return s;
}
function Fy() {
  return [];
}
var jy = Object.prototype, Uy = jy.propertyIsEnumerable, Ru = Object.getOwnPropertySymbols, Hy = Ru ? function(r) {
  return r == null ? [] : (r = Object(r), $y(Ru(r), function(t) {
    return Uy.call(r, t);
  }));
} : Fy;
function Vy(r, t, e) {
  var n = t(r);
  return Qn(r) ? n : Cy(n, e(r));
}
function Cl(r) {
  return Vy(r, Zb, Hy);
}
var Tl = nr(Ke, "DataView"), Ll = nr(Ke, "Promise"), Dl = nr(Ke, "Set"), Pu = "[object Map]", Yy = "[object Object]", Bu = "[object Promise]", $u = "[object Set]", Fu = "[object WeakMap]", ju = "[object DataView]", Gy = er(Tl), Ky = er(Hi), Wy = er(Ll), Qy = er(Dl), Zy = er(Al), be = ti;
(Tl && be(new Tl(new ArrayBuffer(1))) != ju || Hi && be(new Hi()) != Pu || Ll && be(Ll.resolve()) != Bu || Dl && be(new Dl()) != $u || Al && be(new Al()) != Fu) && (be = function(r) {
  var t = ti(r), e = t == Yy ? r.constructor : void 0, n = e ? er(e) : "";
  if (n)
    switch (n) {
      case Gy:
        return ju;
      case Ky:
        return Pu;
      case Wy:
        return Bu;
      case Qy:
        return $u;
      case Zy:
        return Fu;
    }
  return t;
});
var Xy = Object.prototype, Jy = Xy.hasOwnProperty;
function tv(r) {
  var t = r.length, e = new r.constructor(t);
  return t && typeof r[0] == "string" && Jy.call(r, "index") && (e.index = r.index, e.input = r.input), e;
}
var aa = Ke.Uint8Array;
function _c(r) {
  var t = new r.constructor(r.byteLength);
  return new aa(t).set(new aa(r)), t;
}
function ev(r, t) {
  var e = _c(r.buffer);
  return new r.constructor(e, r.byteOffset, r.byteLength);
}
var nv = /\w*$/;
function rv(r) {
  var t = new r.constructor(r.source, nv.exec(r));
  return t.lastIndex = r.lastIndex, t;
}
var Uu = En ? En.prototype : void 0, Hu = Uu ? Uu.valueOf : void 0;
function iv(r) {
  return Hu ? Object(Hu.call(r)) : {};
}
function mf(r, t) {
  var e = t ? _c(r.buffer) : r.buffer;
  return new r.constructor(e, r.byteOffset, r.length);
}
var sv = "[object Boolean]", av = "[object Date]", ov = "[object Map]", lv = "[object Number]", cv = "[object RegExp]", uv = "[object Set]", dv = "[object String]", hv = "[object Symbol]", fv = "[object ArrayBuffer]", pv = "[object DataView]", gv = "[object Float32Array]", mv = "[object Float64Array]", bv = "[object Int8Array]", yv = "[object Int16Array]", vv = "[object Int32Array]", wv = "[object Uint8Array]", kv = "[object Uint8ClampedArray]", xv = "[object Uint16Array]", Sv = "[object Uint32Array]";
function Av(r, t, e) {
  var n = r.constructor;
  switch (t) {
    case fv:
      return _c(r);
    case sv:
    case av:
      return new n(+r);
    case pv:
      return ev(r);
    case gv:
    case mv:
    case bv:
    case yv:
    case vv:
    case wv:
    case kv:
    case xv:
    case Sv:
      return mf(r, e);
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
function bf(r) {
  return typeof r.constructor == "function" && !Oc(r) ? Hm(hf(r)) : {};
}
var Ev = "[object Map]";
function Cv(r) {
  return sn(r) && be(r) == Ev;
}
var Vu = Hr && Hr.isMap, Tv = Vu ? Mc(Vu) : Cv, Lv = "[object Set]";
function Dv(r) {
  return sn(r) && be(r) == Lv;
}
var Yu = Hr && Hr.isSet, Iv = Yu ? Mc(Yu) : Dv, Nv = 1, yf = "[object Arguments]", Ov = "[object Array]", Mv = "[object Boolean]", qv = "[object Date]", _v = "[object Error]", vf = "[object Function]", zv = "[object GeneratorFunction]", Rv = "[object Map]", Pv = "[object Number]", wf = "[object Object]", Bv = "[object RegExp]", $v = "[object Set]", Fv = "[object String]", jv = "[object Symbol]", Uv = "[object WeakMap]", Hv = "[object ArrayBuffer]", Vv = "[object DataView]", Yv = "[object Float32Array]", Gv = "[object Float64Array]", Kv = "[object Int8Array]", Wv = "[object Int16Array]", Qv = "[object Int32Array]", Zv = "[object Uint8Array]", Xv = "[object Uint8ClampedArray]", Jv = "[object Uint16Array]", t1 = "[object Uint32Array]", at = {};
at[yf] = at[Ov] = at[Hv] = at[Vv] = at[Mv] = at[qv] = at[Yv] = at[Gv] = at[Kv] = at[Wv] = at[Qv] = at[Rv] = at[Pv] = at[wf] = at[Bv] = at[$v] = at[Fv] = at[jv] = at[Zv] = at[Xv] = at[Jv] = at[t1] = !0;
at[_v] = at[vf] = at[Uv] = !1;
function Ws(r, t, e, n, i, s) {
  var a, o = t & Nv;
  if (a !== void 0)
    return a;
  if (!Dn(r))
    return r;
  var l = Qn(r);
  if (l)
    a = tv(r);
  else {
    var c = be(r), d = c == vf || c == zv;
    if (ji(r))
      return gf(r, o);
    if (c == wf || c == yf || d && !i)
      a = d ? {} : bf(r);
    else {
      if (!at[c])
        return i ? r : {};
      a = Av(r, c, o);
    }
  }
  s || (s = new Fe());
  var f = s.get(r);
  if (f)
    return f;
  s.set(r, a), Iv(r) ? r.forEach(function(m) {
    a.add(Ws(m, t, e, m, r, s));
  }) : Tv(r) && r.forEach(function(m, b) {
    a.set(b, Ws(m, t, e, b, r, s));
  });
  var h = Cl, p = l ? void 0 : h(r);
  return tb(p || r, function(m, b) {
    p && (b = m, m = r[b]), rf(a, b, Ws(m, t, e, b, r, s));
  }), a;
}
var e1 = 1, n1 = 4;
function Or(r) {
  return Ws(r, e1 | n1);
}
var r1 = "__lodash_hash_undefined__";
function i1(r) {
  return this.__data__.set(r, r1), this;
}
function s1(r) {
  return this.__data__.has(r);
}
function oa(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.__data__ = new rr(); ++t < e; )
    this.add(r[t]);
}
oa.prototype.add = oa.prototype.push = i1;
oa.prototype.has = s1;
function a1(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length; ++e < n; )
    if (t(r[e], e, r))
      return !0;
  return !1;
}
function o1(r, t) {
  return r.has(t);
}
var l1 = 1, c1 = 2;
function kf(r, t, e, n, i, s) {
  var a = e & l1, o = r.length, l = t.length;
  if (o != l && !(a && l > o))
    return !1;
  var c = s.get(r), d = s.get(t);
  if (c && d)
    return c == t && d == r;
  var f = -1, h = !0, p = e & c1 ? new oa() : void 0;
  for (s.set(r, t), s.set(t, r); ++f < o; ) {
    var m = r[f], b = t[f];
    if (n)
      var k = a ? n(b, m, f, t, r, s) : n(m, b, f, r, t, s);
    if (k !== void 0) {
      if (k)
        continue;
      h = !1;
      break;
    }
    if (p) {
      if (!a1(t, function(v, S) {
        if (!o1(p, S) && (m === v || i(m, v, e, n, s)))
          return p.push(S);
      })) {
        h = !1;
        break;
      }
    } else if (!(m === b || i(m, b, e, n, s))) {
      h = !1;
      break;
    }
  }
  return s.delete(r), s.delete(t), h;
}
function u1(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(n, i) {
    e[++t] = [i, n];
  }), e;
}
function d1(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(n) {
    e[++t] = n;
  }), e;
}
var h1 = 1, f1 = 2, p1 = "[object Boolean]", g1 = "[object Date]", m1 = "[object Error]", b1 = "[object Map]", y1 = "[object Number]", v1 = "[object RegExp]", w1 = "[object Set]", k1 = "[object String]", x1 = "[object Symbol]", S1 = "[object ArrayBuffer]", A1 = "[object DataView]", Gu = En ? En.prototype : void 0, Fo = Gu ? Gu.valueOf : void 0;
function E1(r, t, e, n, i, s, a) {
  switch (e) {
    case A1:
      if (r.byteLength != t.byteLength || r.byteOffset != t.byteOffset)
        return !1;
      r = r.buffer, t = t.buffer;
    case S1:
      return !(r.byteLength != t.byteLength || !s(new aa(r), new aa(t)));
    case p1:
    case g1:
    case y1:
      return es(+r, +t);
    case m1:
      return r.name == t.name && r.message == t.message;
    case v1:
    case k1:
      return r == t + "";
    case b1:
      var o = u1;
    case w1:
      var l = n & h1;
      if (o || (o = d1), r.size != t.size && !l)
        return !1;
      var c = a.get(r);
      if (c)
        return c == t;
      n |= f1, a.set(r, t);
      var d = kf(o(r), o(t), n, i, s, a);
      return a.delete(r), d;
    case x1:
      if (Fo)
        return Fo.call(r) == Fo.call(t);
  }
  return !1;
}
var C1 = 1, T1 = Object.prototype, L1 = T1.hasOwnProperty;
function D1(r, t, e, n, i, s) {
  var a = e & C1, o = Cl(r), l = o.length, c = Cl(t), d = c.length;
  if (l != d && !a)
    return !1;
  for (var f = l; f--; ) {
    var h = o[f];
    if (!(a ? h in t : L1.call(t, h)))
      return !1;
  }
  var p = s.get(r), m = s.get(t);
  if (p && m)
    return p == t && m == r;
  var b = !0;
  s.set(r, t), s.set(t, r);
  for (var k = a; ++f < l; ) {
    h = o[f];
    var v = r[h], S = t[h];
    if (n)
      var E = a ? n(S, v, h, t, r, s) : n(v, S, h, r, t, s);
    if (!(E === void 0 ? v === S || i(v, S, e, n, s) : E)) {
      b = !1;
      break;
    }
    k || (k = h == "constructor");
  }
  if (b && !k) {
    var C = r.constructor, I = t.constructor;
    C != I && "constructor" in r && "constructor" in t && !(typeof C == "function" && C instanceof C && typeof I == "function" && I instanceof I) && (b = !1);
  }
  return s.delete(r), s.delete(t), b;
}
var I1 = 1, Ku = "[object Arguments]", Wu = "[object Array]", Ms = "[object Object]", N1 = Object.prototype, Qu = N1.hasOwnProperty;
function O1(r, t, e, n, i, s) {
  var a = Qn(r), o = Qn(t), l = a ? Wu : be(r), c = o ? Wu : be(t);
  l = l == Ku ? Ms : l, c = c == Ku ? Ms : c;
  var d = l == Ms, f = c == Ms, h = l == c;
  if (h && ji(r)) {
    if (!ji(t))
      return !1;
    a = !0, d = !1;
  }
  if (h && !d)
    return s || (s = new Fe()), a || qc(r) ? kf(r, t, e, n, i, s) : E1(r, t, l, e, n, i, s);
  if (!(e & I1)) {
    var p = d && Qu.call(r, "__wrapped__"), m = f && Qu.call(t, "__wrapped__");
    if (p || m) {
      var b = p ? r.value() : r, k = m ? t.value() : t;
      return s || (s = new Fe()), i(b, k, e, n, s);
    }
  }
  return h ? (s || (s = new Fe()), D1(r, t, e, n, i, s)) : !1;
}
function xf(r, t, e, n, i) {
  return r === t ? !0 : r == null || t == null || !sn(r) && !sn(t) ? r !== r && t !== t : O1(r, t, e, n, xf, i);
}
function M1(r) {
  return function(t, e, n) {
    for (var i = -1, s = Object(t), a = n(t), o = a.length; o--; ) {
      var l = a[++i];
      if (e(s[l], l, s) === !1)
        break;
    }
    return t;
  };
}
var q1 = M1();
function Il(r, t, e) {
  (e !== void 0 && !es(r[t], e) || e === void 0 && !(t in r)) && Nc(r, t, e);
}
function _1(r) {
  return sn(r) && Ca(r);
}
function Nl(r, t) {
  if (!(t === "constructor" && typeof r[t] == "function") && t != "__proto__")
    return r[t];
}
function z1(r) {
  return sb(r, df(r));
}
function R1(r, t, e, n, i, s, a) {
  var o = Nl(r, e), l = Nl(t, e), c = a.get(l);
  if (c) {
    Il(r, e, c);
    return;
  }
  var d = s ? s(o, l, e + "", r, t, a) : void 0, f = d === void 0;
  if (f) {
    var h = Qn(l), p = !h && ji(l), m = !h && !p && qc(l);
    d = l, h || p || m ? Qn(o) ? d = o : _1(o) ? d = Ym(o) : p ? (f = !1, d = gf(l, !0)) : m ? (f = !1, d = mf(l, !0)) : d = [] : Oy(l) || El(l) ? (d = o, El(o) ? d = z1(o) : (!Dn(o) || Ic(o)) && (d = bf(l))) : f = !1;
  }
  f && (a.set(l, d), i(d, l, n, s, a), a.delete(l)), Il(r, e, d);
}
function Sf(r, t, e, n, i) {
  r !== t && q1(t, function(s, a) {
    if (i || (i = new Fe()), Dn(s))
      R1(r, t, a, e, Sf, n, i);
    else {
      var o = n ? n(Nl(r, a), s, a + "", r, t, i) : void 0;
      o === void 0 && (o = s), Il(r, a, o);
    }
  }, df);
}
function zc(r, t) {
  return xf(r, t);
}
var An = ub(function(r, t, e) {
  Sf(r, t, e);
}), B = /* @__PURE__ */ ((r) => (r[r.TYPE = 3] = "TYPE", r[r.LEVEL = 12] = "LEVEL", r[r.ATTRIBUTE = 13] = "ATTRIBUTE", r[r.BLOT = 14] = "BLOT", r[r.INLINE = 7] = "INLINE", r[r.BLOCK = 11] = "BLOCK", r[r.BLOCK_BLOT = 10] = "BLOCK_BLOT", r[r.INLINE_BLOT = 6] = "INLINE_BLOT", r[r.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", r[r.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", r[r.ANY = 15] = "ANY", r))(B || {});
class Ue {
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
class Mr extends Error {
  constructor(t) {
    t = "[Parchment] " + t, super(t), this.message = t, this.name = this.constructor.name;
  }
}
const Af = class Ol {
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
      throw new Mr(`Unable to create ${e} blot`);
    const s = i, a = (
      // @ts-expect-error Fix me later
      e instanceof Node || e.nodeType === Node.TEXT_NODE ? e : s.create(n)
    ), o = new s(t, a, n);
    return Ol.blots.set(o.domNode, o), o;
  }
  find(t, e = !1) {
    return Ol.find(t, e);
  }
  query(t, e = B.ANY) {
    let n;
    return typeof t == "string" ? n = this.types[t] || this.attributes[t] : t instanceof Text || t.nodeType === Node.TEXT_NODE ? n = this.types.text : typeof t == "number" ? t & B.LEVEL & B.BLOCK ? n = this.types.block : t & B.LEVEL & B.INLINE && (n = this.types.inline) : t instanceof Element && ((t.getAttribute("class") || "").split(/\s+/).some((i) => (n = this.classes[i], !!n)), n = n || this.tags[t.tagName]), n == null ? null : "scope" in n && e & B.LEVEL & n.scope && e & B.TYPE & n.scope ? n : null;
  }
  register(...t) {
    return t.map((e) => {
      const n = "blotName" in e, i = "attrName" in e;
      if (!n && !i)
        throw new Mr("Invalid definition");
      if (n && e.blotName === "abstract")
        throw new Mr("Cannot register abstract class");
      const s = n ? e.blotName : i ? e.attrName : void 0;
      return this.types[s] = e, i ? typeof e.keyName == "string" && (this.attributes[e.keyName] = e) : n && (e.className && (this.classes[e.className] = e), e.tagName && (Array.isArray(e.tagName) ? e.tagName = e.tagName.map((a) => a.toUpperCase()) : e.tagName = e.tagName.toUpperCase(), (Array.isArray(e.tagName) ? e.tagName : [e.tagName]).forEach((a) => {
        (this.tags[a] == null || e.className == null) && (this.tags[a] = e);
      }))), e;
    });
  }
};
Af.blots = /* @__PURE__ */ new WeakMap();
let Vr = Af;
function Zu(r, t) {
  return (r.getAttribute("class") || "").split(/\s+/).filter((e) => e.indexOf(`${t}-`) === 0);
}
class P1 extends Ue {
  static keys(t) {
    return (t.getAttribute("class") || "").split(/\s+/).map((e) => e.split("-").slice(0, -1).join("-"));
  }
  add(t, e) {
    return this.canAdd(t, e) ? (this.remove(t), t.classList.add(`${this.keyName}-${e}`), !0) : !1;
  }
  remove(t) {
    Zu(t, this.keyName).forEach((e) => {
      t.classList.remove(e);
    }), t.classList.length === 0 && t.removeAttribute("class");
  }
  value(t) {
    const e = (Zu(t, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(t, e) ? e : "";
  }
}
const Ee = P1;
function jo(r) {
  const t = r.split("-"), e = t.slice(1).map((n) => n[0].toUpperCase() + n.slice(1)).join("");
  return t[0] + e;
}
class B1 extends Ue {
  static keys(t) {
    return (t.getAttribute("style") || "").split(";").map((e) => e.split(":")[0].trim());
  }
  add(t, e) {
    return this.canAdd(t, e) ? (t.style[jo(this.keyName)] = e, !0) : !1;
  }
  remove(t) {
    t.style[jo(this.keyName)] = "", t.getAttribute("style") || t.removeAttribute("style");
  }
  value(t) {
    const e = t.style[jo(this.keyName)];
    return this.canAdd(t, e) ? e : "";
  }
}
const In = B1;
class $1 {
  constructor(t) {
    this.attributes = {}, this.domNode = t, this.build();
  }
  attribute(t, e) {
    e ? t.add(this.domNode, e) && (t.value(this.domNode) != null ? this.attributes[t.attrName] = t : delete this.attributes[t.attrName]) : (t.remove(this.domNode), delete this.attributes[t.attrName]);
  }
  build() {
    this.attributes = {};
    const t = Vr.find(this.domNode);
    if (t == null)
      return;
    const e = Ue.keys(this.domNode), n = Ee.keys(this.domNode), i = In.keys(this.domNode);
    e.concat(n).concat(i).forEach((s) => {
      const a = t.scroll.query(s, B.ATTRIBUTE);
      a instanceof Ue && (this.attributes[a.attrName] = a);
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
const Da = $1, Ef = class {
  constructor(t, e) {
    this.scroll = t, this.domNode = e, Vr.blots.set(e, this), this.prev = null, this.next = null;
  }
  static create(t) {
    if (this.tagName == null)
      throw new Mr("Blot definition missing tagName");
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
    this.parent != null && this.parent.removeChild(this), Vr.blots.delete(this.domNode);
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
      throw new Mr(`Cannot wrap ${t}`);
    return n.appendChild(this), n;
  }
};
Ef.blotName = "abstract";
let Cf = Ef;
const Tf = class extends Cf {
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
Tf.scope = B.INLINE_BLOT;
let F1 = Tf;
const Nt = F1;
class j1 {
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
function Xu(r, t) {
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
const Lf = class yn extends Cf {
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
    this.uiNode != null && this.uiNode.remove(), this.uiNode = t, yn.uiClass && this.uiNode.classList.add(yn.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new j1(), Array.from(this.domNode.childNodes).filter((t) => t !== this.uiNode).reverse().forEach((t) => {
      try {
        const e = Xu(t, this.scroll);
        this.insertBefore(e, this.children.head || void 0);
      } catch (e) {
        if (e instanceof Mr)
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
    return t.blotName == null && t(n) || t.blotName != null && n instanceof t ? [n, i] : n instanceof yn ? n.descendant(t, i) : [null, -1];
  }
  descendants(t, e = 0, n = Number.MAX_VALUE) {
    let i = [], s = n;
    return this.children.forEachAt(
      e,
      n,
      (a, o, l) => {
        (t.blotName == null && t(a) || t.blotName != null && a instanceof t) && i.push(a), a instanceof yn && (i = i.concat(
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
      ) || (e.statics.scope === B.BLOCK_BLOT ? (e.next != null && this.splitAfter(e), e.prev != null && this.splitAfter(e.prev), e.parent.unwrap(), t = !0) : e instanceof yn ? e.unwrap() : e.remove());
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
    return n instanceof yn ? s.concat(n.path(i, e)) : (n != null && s.push([n, i]), s);
  }
  removeChild(t) {
    this.children.remove(t);
  }
  replaceWith(t, e) {
    const n = typeof t == "string" ? this.scroll.create(t, e) : t;
    return n instanceof yn && this.moveChildren(n), super.replaceWith(n);
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
      const o = Xu(s, this.scroll);
      (o.next !== a || o.next == null) && (o.parent != null && o.parent.removeChild(this), this.insertBefore(o, a || void 0));
    }), this.enforceAllowedChildren();
  }
};
Lf.uiClass = "";
let U1 = Lf;
const we = U1;
function H1(r, t) {
  if (Object.keys(r).length !== Object.keys(t).length)
    return !1;
  for (const e in r)
    if (r[e] !== t[e])
      return !1;
  return !0;
}
const Sr = class Ar extends we {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const n = e.query(Ar.blotName);
    if (!(n != null && t.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new Da(this.domNode);
  }
  format(t, e) {
    if (t === this.statics.blotName && !e)
      this.children.forEach((n) => {
        n instanceof Ar || (n = n.wrap(Ar.blotName, !0)), this.attributes.copy(n);
      }), this.unwrap();
    else {
      const n = this.scroll.query(t, B.INLINE);
      if (n == null)
        return;
      n instanceof Ue ? this.attributes.attribute(n, e) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e);
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
    n instanceof Ar && n.prev === this && H1(e, n.formats()) && (n.moveChildren(this), n.remove());
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
    return n instanceof Ar && this.attributes.move(n), n;
  }
};
Sr.allowedChildren = [Sr, Nt], Sr.blotName = "inline", Sr.scope = B.INLINE_BLOT, Sr.tagName = "SPAN";
let V1 = Sr;
const Rc = V1, Er = class Ml extends we {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const n = e.query(Ml.blotName);
    if (!(n != null && t.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new Da(this.domNode);
  }
  format(t, e) {
    const n = this.scroll.query(t, B.BLOCK);
    n != null && (n instanceof Ue ? this.attributes.attribute(n, e) : t === this.statics.blotName && !e ? this.replaceWith(Ml.blotName) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e));
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
Er.blotName = "block", Er.scope = B.BLOCK_BLOT, Er.tagName = "P", Er.allowedChildren = [
  Rc,
  Er,
  Nt
];
let Y1 = Er;
const Vi = Y1, ql = class extends we {
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
ql.blotName = "container", ql.scope = B.BLOCK_BLOT;
let G1 = ql;
const Ia = G1;
class K1 extends Nt {
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
const Zt = K1, W1 = {
  attributes: !0,
  characterData: !0,
  characterDataOldValue: !0,
  childList: !0,
  subtree: !0
}, Q1 = 100, Cr = class extends we {
  constructor(t, e) {
    super(null, e), this.registry = t, this.scroll = this, this.build(), this.observer = new MutationObserver((n) => {
      this.update(n);
    }), this.observer.observe(this.domNode, W1), this.attach();
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
      n.has(l.domNode) && (l instanceof we && l.children.forEach(a), n.delete(l.domNode), l.optimize(e));
    };
    let o = t;
    for (let l = 0; o.length > 0; l += 1) {
      if (l >= Q1)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (o.forEach((c) => {
        const d = this.find(c.target, !0);
        d != null && (d.domNode === c.target && (c.type === "childList" ? (s(this.find(c.previousSibling, !1)), Array.from(c.addedNodes).forEach((f) => {
          const h = this.find(f, !1);
          s(h, !1), h instanceof we && h.children.forEach((p) => {
            s(p, !1);
          });
        })) : c.type === "attributes" && s(d.prev)), s(d));
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
Cr.blotName = "scroll", Cr.defaultChild = Vi, Cr.allowedChildren = [Vi, Ia], Cr.scope = B.BLOCK_BLOT, Cr.tagName = "DIV";
let Z1 = Cr;
const Pc = Z1, _l = class Df extends Nt {
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
    super.optimize(t), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof Df && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
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
_l.blotName = "text", _l.scope = B.INLINE_BLOT;
let X1 = _l;
const la = X1, J1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Attributor: Ue,
  AttributorStore: Da,
  BlockBlot: Vi,
  ClassAttributor: Ee,
  ContainerBlot: Ia,
  EmbedBlot: Zt,
  InlineBlot: Rc,
  LeafBlot: Nt,
  ParentBlot: we,
  Registry: Vr,
  Scope: B,
  ScrollBlot: Pc,
  StyleAttributor: In,
  TextBlot: la
}, Symbol.toStringTag, { value: "Module" }));
var kn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function If(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var zl = { exports: {} }, Wt = -1, Rt = 1, wt = 0;
function Yi(r, t, e, n, i) {
  if (r === t)
    return r ? [[wt, r]] : [];
  if (e != null) {
    var s = l0(r, t, e);
    if (s)
      return s;
  }
  var a = Bc(r, t), o = r.substring(0, a);
  r = r.substring(a), t = t.substring(a), a = Na(r, t);
  var l = r.substring(r.length - a);
  r = r.substring(0, r.length - a), t = t.substring(0, t.length - a);
  var c = t0(r, t);
  return o && c.unshift([wt, o]), l && c.push([wt, l]), $c(c, i), n && r0(c), c;
}
function t0(r, t) {
  var e;
  if (!r)
    return [[Rt, t]];
  if (!t)
    return [[Wt, r]];
  var n = r.length > t.length ? r : t, i = r.length > t.length ? t : r, s = n.indexOf(i);
  if (s !== -1)
    return e = [
      [Rt, n.substring(0, s)],
      [wt, i],
      [Rt, n.substring(s + i.length)]
    ], r.length > t.length && (e[0][0] = e[2][0] = Wt), e;
  if (i.length === 1)
    return [
      [Wt, r],
      [Rt, t]
    ];
  var a = n0(r, t);
  if (a) {
    var o = a[0], l = a[1], c = a[2], d = a[3], f = a[4], h = Yi(o, c), p = Yi(l, d);
    return h.concat([[wt, f]], p);
  }
  return e0(r, t);
}
function e0(r, t) {
  for (var e = r.length, n = t.length, i = Math.ceil((e + n) / 2), s = i, a = 2 * i, o = new Array(a), l = new Array(a), c = 0; c < a; c++)
    o[c] = -1, l[c] = -1;
  o[s + 1] = 0, l[s + 1] = 0;
  for (var d = e - n, f = d % 2 !== 0, h = 0, p = 0, m = 0, b = 0, k = 0; k < i; k++) {
    for (var v = -k + h; v <= k - p; v += 2) {
      var S = s + v, E;
      v === -k || v !== k && o[S - 1] < o[S + 1] ? E = o[S + 1] : E = o[S - 1] + 1;
      for (var C = E - v; E < e && C < n && r.charAt(E) === t.charAt(C); )
        E++, C++;
      if (o[S] = E, E > e)
        p += 2;
      else if (C > n)
        h += 2;
      else if (f) {
        var I = s + d - v;
        if (I >= 0 && I < a && l[I] !== -1) {
          var M = e - l[I];
          if (E >= M)
            return Ju(r, t, E, C);
        }
      }
    }
    for (var O = -k + m; O <= k - b; O += 2) {
      var I = s + O, M;
      O === -k || O !== k && l[I - 1] < l[I + 1] ? M = l[I + 1] : M = l[I - 1] + 1;
      for (var x = M - O; M < e && x < n && r.charAt(e - M - 1) === t.charAt(n - x - 1); )
        M++, x++;
      if (l[I] = M, M > e)
        b += 2;
      else if (x > n)
        m += 2;
      else if (!f) {
        var S = s + d - O;
        if (S >= 0 && S < a && o[S] !== -1) {
          var E = o[S], C = s + E - S;
          if (M = e - M, E >= M)
            return Ju(r, t, E, C);
        }
      }
    }
  }
  return [
    [Wt, r],
    [Rt, t]
  ];
}
function Ju(r, t, e, n) {
  var i = r.substring(0, e), s = t.substring(0, n), a = r.substring(e), o = t.substring(n), l = Yi(i, s), c = Yi(a, o);
  return l.concat(c);
}
function Bc(r, t) {
  if (!r || !t || r.charAt(0) !== t.charAt(0))
    return 0;
  for (var e = 0, n = Math.min(r.length, t.length), i = n, s = 0; e < i; )
    r.substring(s, i) == t.substring(s, i) ? (e = i, s = e) : n = i, i = Math.floor((n - e) / 2 + e);
  return Nf(r.charCodeAt(i - 1)) && i--, i;
}
function td(r, t) {
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
function Na(r, t) {
  if (!r || !t || r.slice(-1) !== t.slice(-1))
    return 0;
  for (var e = 0, n = Math.min(r.length, t.length), i = n, s = 0; e < i; )
    r.substring(r.length - i, r.length - s) == t.substring(t.length - i, t.length - s) ? (e = i, s = e) : n = i, i = Math.floor((n - e) / 2 + e);
  return Of(r.charCodeAt(r.length - i)) && i--, i;
}
function n0(r, t) {
  var e = r.length > t.length ? r : t, n = r.length > t.length ? t : r;
  if (e.length < 4 || n.length * 2 < e.length)
    return null;
  function i(p, m, b) {
    for (var k = p.substring(b, b + Math.floor(p.length / 4)), v = -1, S = "", E, C, I, M; (v = m.indexOf(k, v + 1)) !== -1; ) {
      var O = Bc(
        p.substring(b),
        m.substring(v)
      ), x = Na(
        p.substring(0, b),
        m.substring(0, v)
      );
      S.length < x + O && (S = m.substring(v - x, v) + m.substring(v, v + O), E = p.substring(0, b - x), C = p.substring(b + O), I = m.substring(0, v - x), M = m.substring(v + O));
    }
    return S.length * 2 >= p.length ? [
      E,
      C,
      I,
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
  var l, c, d, f;
  r.length > t.length ? (l = o[0], c = o[1], d = o[2], f = o[3]) : (d = o[0], f = o[1], l = o[2], c = o[3]);
  var h = o[4];
  return [l, c, d, f, h];
}
function r0(r) {
  for (var t = !1, e = [], n = 0, i = null, s = 0, a = 0, o = 0, l = 0, c = 0; s < r.length; )
    r[s][0] == wt ? (e[n++] = s, a = l, o = c, l = 0, c = 0, i = r[s][1]) : (r[s][0] == Rt ? l += r[s][1].length : c += r[s][1].length, i && i.length <= Math.max(a, o) && i.length <= Math.max(l, c) && (r.splice(e[n - 1], 0, [
      Wt,
      i
    ]), r[e[n - 1] + 1][0] = Rt, n--, n--, s = n > 0 ? e[n - 1] : -1, a = 0, o = 0, l = 0, c = 0, i = null, t = !0)), s++;
  for (t && $c(r), a0(r), s = 1; s < r.length; ) {
    if (r[s - 1][0] == Wt && r[s][0] == Rt) {
      var d = r[s - 1][1], f = r[s][1], h = td(d, f), p = td(f, d);
      h >= p ? (h >= d.length / 2 || h >= f.length / 2) && (r.splice(s, 0, [
        wt,
        f.substring(0, h)
      ]), r[s - 1][1] = d.substring(
        0,
        d.length - h
      ), r[s + 1][1] = f.substring(h), s++) : (p >= d.length / 2 || p >= f.length / 2) && (r.splice(s, 0, [
        wt,
        d.substring(0, p)
      ]), r[s - 1][0] = Rt, r[s - 1][1] = f.substring(
        0,
        f.length - p
      ), r[s + 1][0] = Wt, r[s + 1][1] = d.substring(p), s++), s++;
    }
    s++;
  }
}
var ed = /[^a-zA-Z0-9]/, nd = /\s/, rd = /[\r\n]/, i0 = /\n\r?\n$/, s0 = /^\r?\n\r?\n/;
function a0(r) {
  function t(p, m) {
    if (!p || !m)
      return 6;
    var b = p.charAt(p.length - 1), k = m.charAt(0), v = b.match(ed), S = k.match(ed), E = v && b.match(nd), C = S && k.match(nd), I = E && b.match(rd), M = C && k.match(rd), O = I && p.match(i0), x = M && m.match(s0);
    return O || x ? 5 : I || M ? 4 : v && !E && C ? 3 : E || C ? 2 : v || S ? 1 : 0;
  }
  for (var e = 1; e < r.length - 1; ) {
    if (r[e - 1][0] == wt && r[e + 1][0] == wt) {
      var n = r[e - 1][1], i = r[e][1], s = r[e + 1][1], a = Na(n, i);
      if (a) {
        var o = i.substring(i.length - a);
        n = n.substring(0, n.length - a), i = o + i.substring(0, i.length - a), s = o + s;
      }
      for (var l = n, c = i, d = s, f = t(n, i) + t(i, s); i.charAt(0) === s.charAt(0); ) {
        n += i.charAt(0), i = i.substring(1) + s.charAt(0), s = s.substring(1);
        var h = t(n, i) + t(i, s);
        h >= f && (f = h, l = n, c = i, d = s);
      }
      r[e - 1][1] != l && (l ? r[e - 1][1] = l : (r.splice(e - 1, 1), e--), r[e][1] = c, d ? r[e + 1][1] = d : (r.splice(e + 1, 1), e--));
    }
    e++;
  }
}
function $c(r, t) {
  r.push([wt, ""]);
  for (var e = 0, n = 0, i = 0, s = "", a = "", o; e < r.length; ) {
    if (e < r.length - 1 && !r[e][1]) {
      r.splice(e, 1);
      continue;
    }
    switch (r[e][0]) {
      case Rt:
        i++, a += r[e][1], e++;
        break;
      case Wt:
        n++, s += r[e][1], e++;
        break;
      case wt:
        var l = e - i - n - 1;
        if (t) {
          if (l >= 0 && qf(r[l][1])) {
            var c = r[l][1].slice(-1);
            if (r[l][1] = r[l][1].slice(
              0,
              -1
            ), s = c + s, a = c + a, !r[l][1]) {
              r.splice(l, 1), e--;
              var d = l - 1;
              r[d] && r[d][0] === Rt && (i++, a = r[d][1] + a, d--), r[d] && r[d][0] === Wt && (n++, s = r[d][1] + s, d--), l = d;
            }
          }
          if (Mf(r[e][1])) {
            var c = r[e][1].charAt(0);
            r[e][1] = r[e][1].slice(1), s += c, a += c;
          }
        }
        if (e < r.length - 1 && !r[e][1]) {
          r.splice(e, 1);
          break;
        }
        if (s.length > 0 || a.length > 0) {
          s.length > 0 && a.length > 0 && (o = Bc(a, s), o !== 0 && (l >= 0 ? r[l][1] += a.substring(
            0,
            o
          ) : (r.splice(0, 0, [
            wt,
            a.substring(0, o)
          ]), e++), a = a.substring(o), s = s.substring(o)), o = Na(a, s), o !== 0 && (r[e][1] = a.substring(a.length - o) + r[e][1], a = a.substring(
            0,
            a.length - o
          ), s = s.substring(
            0,
            s.length - o
          )));
          var f = i + n;
          s.length === 0 && a.length === 0 ? (r.splice(e - f, f), e = e - f) : s.length === 0 ? (r.splice(e - f, f, [Rt, a]), e = e - f + 1) : a.length === 0 ? (r.splice(e - f, f, [Wt, s]), e = e - f + 1) : (r.splice(
            e - f,
            f,
            [Wt, s],
            [Rt, a]
          ), e = e - f + 2);
        }
        e !== 0 && r[e - 1][0] === wt ? (r[e - 1][1] += r[e][1], r.splice(e, 1)) : e++, i = 0, n = 0, s = "", a = "";
        break;
    }
  }
  r[r.length - 1][1] === "" && r.pop();
  var h = !1;
  for (e = 1; e < r.length - 1; )
    r[e - 1][0] === wt && r[e + 1][0] === wt && (r[e][1].substring(
      r[e][1].length - r[e - 1][1].length
    ) === r[e - 1][1] ? (r[e][1] = r[e - 1][1] + r[e][1].substring(
      0,
      r[e][1].length - r[e - 1][1].length
    ), r[e + 1][1] = r[e - 1][1] + r[e + 1][1], r.splice(e - 1, 1), h = !0) : r[e][1].substring(0, r[e + 1][1].length) == r[e + 1][1] && (r[e - 1][1] += r[e + 1][1], r[e][1] = r[e][1].substring(r[e + 1][1].length) + r[e + 1][1], r.splice(e + 1, 1), h = !0)), e++;
  h && $c(r, t);
}
function Nf(r) {
  return r >= 55296 && r <= 56319;
}
function Of(r) {
  return r >= 56320 && r <= 57343;
}
function Mf(r) {
  return Of(r.charCodeAt(0));
}
function qf(r) {
  return Nf(r.charCodeAt(r.length - 1));
}
function o0(r) {
  for (var t = [], e = 0; e < r.length; e++)
    r[e][1].length > 0 && t.push(r[e]);
  return t;
}
function Uo(r, t, e, n) {
  return qf(r) || Mf(n) ? null : o0([
    [wt, r],
    [Wt, t],
    [Rt, e],
    [wt, n]
  ]);
}
function l0(r, t, e) {
  var n = typeof e == "number" ? { index: e, length: 0 } : e.oldRange, i = typeof e == "number" ? null : e.newRange, s = r.length, a = t.length;
  if (n.length === 0 && (i === null || i.length === 0)) {
    var o = n.index, l = r.slice(0, o), c = r.slice(o), d = i ? i.index : null;
    t: {
      var f = o + a - s;
      if (d !== null && d !== f || f < 0 || f > a)
        break t;
      var h = t.slice(0, f), p = t.slice(f);
      if (p !== c)
        break t;
      var m = Math.min(o, f), b = l.slice(0, m), k = h.slice(0, m);
      if (b !== k)
        break t;
      var v = l.slice(m), S = h.slice(m);
      return Uo(b, v, S, c);
    }
    t: {
      if (d !== null && d !== o)
        break t;
      var E = o, h = t.slice(0, E), p = t.slice(E);
      if (h !== l)
        break t;
      var C = Math.min(s - E, a - E), I = c.slice(c.length - C), M = p.slice(p.length - C);
      if (I !== M)
        break t;
      var v = c.slice(0, c.length - C), S = p.slice(0, p.length - C);
      return Uo(l, v, S, I);
    }
  }
  if (n.length > 0 && i && i.length === 0)
    t: {
      var b = r.slice(0, n.index), I = r.slice(n.index + n.length), m = b.length, C = I.length;
      if (a < m + C)
        break t;
      var k = t.slice(0, m), M = t.slice(a - C);
      if (b !== k || I !== M)
        break t;
      var v = r.slice(m, s - C), S = t.slice(m, a - C);
      return Uo(b, v, S, I);
    }
  return null;
}
function Oa(r, t, e, n) {
  return Yi(r, t, e, n, !0);
}
Oa.INSERT = Rt;
Oa.DELETE = Wt;
Oa.EQUAL = wt;
var c0 = Oa, ca = { exports: {} };
ca.exports;
(function(r, t) {
  var e = 200, n = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", l = "[object Date]", c = "[object Error]", d = "[object Function]", f = "[object GeneratorFunction]", h = "[object Map]", p = "[object Number]", m = "[object Object]", b = "[object Promise]", k = "[object RegExp]", v = "[object Set]", S = "[object String]", E = "[object Symbol]", C = "[object WeakMap]", I = "[object ArrayBuffer]", M = "[object DataView]", O = "[object Float32Array]", x = "[object Float64Array]", A = "[object Int8Array]", _ = "[object Int16Array]", N = "[object Int32Array]", V = "[object Uint8Array]", ht = "[object Uint8ClampedArray]", it = "[object Uint16Array]", Yt = "[object Uint32Array]", Bt = /[\\^$.*+?()[\]{}|]/g, ni = /\w*$/, Le = /^\[object .+?Constructor\]$/, De = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[a] = U[I] = U[M] = U[o] = U[l] = U[O] = U[x] = U[A] = U[_] = U[N] = U[h] = U[p] = U[m] = U[k] = U[v] = U[S] = U[E] = U[V] = U[ht] = U[it] = U[Yt] = !0, U[c] = U[d] = U[C] = !1;
  var Ie = typeof kn == "object" && kn && kn.Object === Object && kn, Ne = typeof self == "object" && self && self.Object === Object && self, ue = Ie || Ne || Function("return this")(), ls = t && !t.nodeType && t, et = ls && !0 && r && !r.nodeType && r, cs = et && et.exports === ls;
  function Ka(u, g) {
    return u.set(g[0], g[1]), u;
  }
  function de(u, g) {
    return u.add(g), u;
  }
  function us(u, g) {
    for (var w = -1, L = u ? u.length : 0; ++w < L && g(u[w], w, u) !== !1; )
      ;
    return u;
  }
  function ds(u, g) {
    for (var w = -1, L = g.length, j = u.length; ++w < L; )
      u[j + w] = g[w];
    return u;
  }
  function ri(u, g, w, L) {
    for (var j = -1, $ = u ? u.length : 0; ++j < $; )
      w = g(w, u[j], j, u);
    return w;
  }
  function ii(u, g) {
    for (var w = -1, L = Array(u); ++w < u; )
      L[w] = g(w);
    return L;
  }
  function hs(u, g) {
    return u == null ? void 0 : u[g];
  }
  function si(u) {
    var g = !1;
    if (u != null && typeof u.toString != "function")
      try {
        g = !!(u + "");
      } catch {
      }
    return g;
  }
  function fs(u) {
    var g = -1, w = Array(u.size);
    return u.forEach(function(L, j) {
      w[++g] = [j, L];
    }), w;
  }
  function ai(u, g) {
    return function(w) {
      return u(g(w));
    };
  }
  function ps(u) {
    var g = -1, w = Array(u.size);
    return u.forEach(function(L) {
      w[++g] = L;
    }), w;
  }
  var Wa = Array.prototype, Qa = Function.prototype, or = Object.prototype, oi = ue["__core-js_shared__"], gs = function() {
    var u = /[^.]+$/.exec(oi && oi.keys && oi.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), ms = Qa.toString, Oe = or.hasOwnProperty, lr = or.toString, Za = RegExp(
    "^" + ms.call(Oe).replace(Bt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Nn = cs ? ue.Buffer : void 0, cr = ue.Symbol, li = ue.Uint8Array, Jt = ai(Object.getPrototypeOf, Object), bs = Object.create, ys = or.propertyIsEnumerable, Xa = Wa.splice, ci = Object.getOwnPropertySymbols, ur = Nn ? Nn.isBuffer : void 0, vs = ai(Object.keys, Object), dr = fe(ue, "DataView"), On = fe(ue, "Map"), he = fe(ue, "Promise"), hr = fe(ue, "Set"), ui = fe(ue, "WeakMap"), Mn = fe(Object, "create"), di = _t(dr), qn = _t(On), hi = _t(he), fi = _t(hr), pi = _t(ui), hn = cr ? cr.prototype : void 0, ws = hn ? hn.valueOf : void 0;
  function Ze(u) {
    var g = -1, w = u ? u.length : 0;
    for (this.clear(); ++g < w; ) {
      var L = u[g];
      this.set(L[0], L[1]);
    }
  }
  function Ja() {
    this.__data__ = Mn ? Mn(null) : {};
  }
  function to(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function eo(u) {
    var g = this.__data__;
    if (Mn) {
      var w = g[u];
      return w === n ? void 0 : w;
    }
    return Oe.call(g, u) ? g[u] : void 0;
  }
  function ks(u) {
    var g = this.__data__;
    return Mn ? g[u] !== void 0 : Oe.call(g, u);
  }
  function gi(u, g) {
    var w = this.__data__;
    return w[u] = Mn && g === void 0 ? n : g, this;
  }
  Ze.prototype.clear = Ja, Ze.prototype.delete = to, Ze.prototype.get = eo, Ze.prototype.has = ks, Ze.prototype.set = gi;
  function St(u) {
    var g = -1, w = u ? u.length : 0;
    for (this.clear(); ++g < w; ) {
      var L = u[g];
      this.set(L[0], L[1]);
    }
  }
  function no() {
    this.__data__ = [];
  }
  function ro(u) {
    var g = this.__data__, w = pr(g, u);
    if (w < 0)
      return !1;
    var L = g.length - 1;
    return w == L ? g.pop() : Xa.call(g, w, 1), !0;
  }
  function io(u) {
    var g = this.__data__, w = pr(g, u);
    return w < 0 ? void 0 : g[w][1];
  }
  function so(u) {
    return pr(this.__data__, u) > -1;
  }
  function ao(u, g) {
    var w = this.__data__, L = pr(w, u);
    return L < 0 ? w.push([u, g]) : w[L][1] = g, this;
  }
  St.prototype.clear = no, St.prototype.delete = ro, St.prototype.get = io, St.prototype.has = so, St.prototype.set = ao;
  function Ct(u) {
    var g = -1, w = u ? u.length : 0;
    for (this.clear(); ++g < w; ) {
      var L = u[g];
      this.set(L[0], L[1]);
    }
  }
  function oo() {
    this.__data__ = {
      hash: new Ze(),
      map: new (On || St)(),
      string: new Ze()
    };
  }
  function lo(u) {
    return zn(this, u).delete(u);
  }
  function co(u) {
    return zn(this, u).get(u);
  }
  function uo(u) {
    return zn(this, u).has(u);
  }
  function ho(u, g) {
    return zn(this, u).set(u, g), this;
  }
  Ct.prototype.clear = oo, Ct.prototype.delete = lo, Ct.prototype.get = co, Ct.prototype.has = uo, Ct.prototype.set = ho;
  function $t(u) {
    this.__data__ = new St(u);
  }
  function fo() {
    this.__data__ = new St();
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
  function bo(u, g) {
    var w = this.__data__;
    if (w instanceof St) {
      var L = w.__data__;
      if (!On || L.length < e - 1)
        return L.push([u, g]), this;
      w = this.__data__ = new Ct(L);
    }
    return w.set(u, g), this;
  }
  $t.prototype.clear = fo, $t.prototype.delete = po, $t.prototype.get = go, $t.prototype.has = mo, $t.prototype.set = bo;
  function fr(u, g) {
    var w = vi(u) || mr(u) ? ii(u.length, String) : [], L = w.length, j = !!L;
    for (var $ in u)
      Oe.call(u, $) && !(j && ($ == "length" || No($, L))) && w.push($);
    return w;
  }
  function xs(u, g, w) {
    var L = u[g];
    (!(Oe.call(u, g) && Ts(L, w)) || w === void 0 && !(g in u)) && (u[g] = w);
  }
  function pr(u, g) {
    for (var w = u.length; w--; )
      if (Ts(u[w][0], g))
        return w;
    return -1;
  }
  function Me(u, g) {
    return u && yi(g, ki(g), u);
  }
  function mi(u, g, w, L, j, $, Q) {
    var W;
    if (L && (W = $ ? L(u, j, $, Q) : L(u)), W !== void 0)
      return W;
    if (!_e(u))
      return u;
    var ft = vi(u);
    if (ft) {
      if (W = Do(u), !g)
        return Co(u, W);
    } else {
      var X = Je(u), Tt = X == d || X == f;
      if (Ls(u))
        return gr(u, g);
      if (X == m || X == s || Tt && !$) {
        if (si(u))
          return $ ? u : {};
        if (W = qe(Tt ? {} : u), !g)
          return To(u, Me(W, u));
      } else {
        if (!U[X])
          return $ ? u : {};
        W = Io(u, X, mi, g);
      }
    }
    Q || (Q = new $t());
    var Ft = Q.get(u);
    if (Ft)
      return Ft;
    if (Q.set(u, W), !ft)
      var bt = w ? Lo(u) : ki(u);
    return us(bt || u, function(Lt, At) {
      bt && (At = Lt, Lt = u[At]), xs(W, At, mi(Lt, g, w, L, At, u, Q));
    }), W;
  }
  function yo(u) {
    return _e(u) ? bs(u) : {};
  }
  function vo(u, g, w) {
    var L = g(u);
    return vi(u) ? L : ds(L, w(u));
  }
  function wo(u) {
    return lr.call(u);
  }
  function ko(u) {
    if (!_e(u) || Mo(u))
      return !1;
    var g = wi(u) || si(u) ? Za : Le;
    return g.test(_t(u));
  }
  function xo(u) {
    if (!Es(u))
      return vs(u);
    var g = [];
    for (var w in Object(u))
      Oe.call(u, w) && w != "constructor" && g.push(w);
    return g;
  }
  function gr(u, g) {
    if (g)
      return u.slice();
    var w = new u.constructor(u.length);
    return u.copy(w), w;
  }
  function bi(u) {
    var g = new u.constructor(u.byteLength);
    return new li(g).set(new li(u)), g;
  }
  function _n(u, g) {
    var w = g ? bi(u.buffer) : u.buffer;
    return new u.constructor(w, u.byteOffset, u.byteLength);
  }
  function Ss(u, g, w) {
    var L = g ? w(fs(u), !0) : fs(u);
    return ri(L, Ka, new u.constructor());
  }
  function As(u) {
    var g = new u.constructor(u.source, ni.exec(u));
    return g.lastIndex = u.lastIndex, g;
  }
  function So(u, g, w) {
    var L = g ? w(ps(u), !0) : ps(u);
    return ri(L, de, new u.constructor());
  }
  function Ao(u) {
    return ws ? Object(ws.call(u)) : {};
  }
  function Eo(u, g) {
    var w = g ? bi(u.buffer) : u.buffer;
    return new u.constructor(w, u.byteOffset, u.length);
  }
  function Co(u, g) {
    var w = -1, L = u.length;
    for (g || (g = Array(L)); ++w < L; )
      g[w] = u[w];
    return g;
  }
  function yi(u, g, w, L) {
    w || (w = {});
    for (var j = -1, $ = g.length; ++j < $; ) {
      var Q = g[j], W = void 0;
      xs(w, Q, W === void 0 ? u[Q] : W);
    }
    return w;
  }
  function To(u, g) {
    return yi(u, Xe(u), g);
  }
  function Lo(u) {
    return vo(u, ki, Xe);
  }
  function zn(u, g) {
    var w = u.__data__;
    return Oo(g) ? w[typeof g == "string" ? "string" : "hash"] : w.map;
  }
  function fe(u, g) {
    var w = hs(u, g);
    return ko(w) ? w : void 0;
  }
  var Xe = ci ? ai(ci, Object) : _o, Je = wo;
  (dr && Je(new dr(new ArrayBuffer(1))) != M || On && Je(new On()) != h || he && Je(he.resolve()) != b || hr && Je(new hr()) != v || ui && Je(new ui()) != C) && (Je = function(u) {
    var g = lr.call(u), w = g == m ? u.constructor : void 0, L = w ? _t(w) : void 0;
    if (L)
      switch (L) {
        case di:
          return M;
        case qn:
          return h;
        case hi:
          return b;
        case fi:
          return v;
        case pi:
          return C;
      }
    return g;
  });
  function Do(u) {
    var g = u.length, w = u.constructor(g);
    return g && typeof u[0] == "string" && Oe.call(u, "index") && (w.index = u.index, w.input = u.input), w;
  }
  function qe(u) {
    return typeof u.constructor == "function" && !Es(u) ? yo(Jt(u)) : {};
  }
  function Io(u, g, w, L) {
    var j = u.constructor;
    switch (g) {
      case I:
        return bi(u);
      case o:
      case l:
        return new j(+u);
      case M:
        return _n(u, L);
      case O:
      case x:
      case A:
      case _:
      case N:
      case V:
      case ht:
      case it:
      case Yt:
        return Eo(u, L);
      case h:
        return Ss(u, L, w);
      case p:
      case S:
        return new j(u);
      case k:
        return As(u);
      case v:
        return So(u, L, w);
      case E:
        return Ao(u);
    }
  }
  function No(u, g) {
    return g = g ?? i, !!g && (typeof u == "number" || De.test(u)) && u > -1 && u % 1 == 0 && u < g;
  }
  function Oo(u) {
    var g = typeof u;
    return g == "string" || g == "number" || g == "symbol" || g == "boolean" ? u !== "__proto__" : u === null;
  }
  function Mo(u) {
    return !!gs && gs in u;
  }
  function Es(u) {
    var g = u && u.constructor, w = typeof g == "function" && g.prototype || or;
    return u === w;
  }
  function _t(u) {
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
  function Ts(u, g) {
    return u === g || u !== u && g !== g;
  }
  function mr(u) {
    return qo(u) && Oe.call(u, "callee") && (!ys.call(u, "callee") || lr.call(u) == s);
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
    var g = _e(u) ? lr.call(u) : "";
    return g == d || g == f;
  }
  function Ds(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= i;
  }
  function _e(u) {
    var g = typeof u;
    return !!u && (g == "object" || g == "function");
  }
  function Is(u) {
    return !!u && typeof u == "object";
  }
  function ki(u) {
    return br(u) ? fr(u) : xo(u);
  }
  function _o() {
    return [];
  }
  function zo() {
    return !1;
  }
  r.exports = Cs;
})(ca, ca.exports);
var _f = ca.exports, ua = { exports: {} };
ua.exports;
(function(r, t) {
  var e = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, o = "[object Arguments]", l = "[object Array]", c = "[object AsyncFunction]", d = "[object Boolean]", f = "[object Date]", h = "[object Error]", p = "[object Function]", m = "[object GeneratorFunction]", b = "[object Map]", k = "[object Number]", v = "[object Null]", S = "[object Object]", E = "[object Promise]", C = "[object Proxy]", I = "[object RegExp]", M = "[object Set]", O = "[object String]", x = "[object Symbol]", A = "[object Undefined]", _ = "[object WeakMap]", N = "[object ArrayBuffer]", V = "[object DataView]", ht = "[object Float32Array]", it = "[object Float64Array]", Yt = "[object Int8Array]", Bt = "[object Int16Array]", ni = "[object Int32Array]", Le = "[object Uint8Array]", De = "[object Uint8ClampedArray]", U = "[object Uint16Array]", Ie = "[object Uint32Array]", Ne = /[\\^$.*+?()[\]{}|]/g, ue = /^\[object .+?Constructor\]$/, ls = /^(?:0|[1-9]\d*)$/, et = {};
  et[ht] = et[it] = et[Yt] = et[Bt] = et[ni] = et[Le] = et[De] = et[U] = et[Ie] = !0, et[o] = et[l] = et[N] = et[d] = et[V] = et[f] = et[h] = et[p] = et[b] = et[k] = et[S] = et[I] = et[M] = et[O] = et[_] = !1;
  var cs = typeof kn == "object" && kn && kn.Object === Object && kn, Ka = typeof self == "object" && self && self.Object === Object && self, de = cs || Ka || Function("return this")(), us = t && !t.nodeType && t, ds = us && !0 && r && !r.nodeType && r, ri = ds && ds.exports === us, ii = ri && cs.process, hs = function() {
    try {
      return ii && ii.binding && ii.binding("util");
    } catch {
    }
  }(), si = hs && hs.isTypedArray;
  function fs(u, g) {
    for (var w = -1, L = u == null ? 0 : u.length, j = 0, $ = []; ++w < L; ) {
      var Q = u[w];
      g(Q, w, u) && ($[j++] = Q);
    }
    return $;
  }
  function ai(u, g) {
    for (var w = -1, L = g.length, j = u.length; ++w < L; )
      u[j + w] = g[w];
    return u;
  }
  function ps(u, g) {
    for (var w = -1, L = u == null ? 0 : u.length; ++w < L; )
      if (g(u[w], w, u))
        return !0;
    return !1;
  }
  function Wa(u, g) {
    for (var w = -1, L = Array(u); ++w < u; )
      L[w] = g(w);
    return L;
  }
  function Qa(u) {
    return function(g) {
      return u(g);
    };
  }
  function or(u, g) {
    return u.has(g);
  }
  function oi(u, g) {
    return u == null ? void 0 : u[g];
  }
  function gs(u) {
    var g = -1, w = Array(u.size);
    return u.forEach(function(L, j) {
      w[++g] = [j, L];
    }), w;
  }
  function ms(u, g) {
    return function(w) {
      return u(g(w));
    };
  }
  function Oe(u) {
    var g = -1, w = Array(u.size);
    return u.forEach(function(L) {
      w[++g] = L;
    }), w;
  }
  var lr = Array.prototype, Za = Function.prototype, Nn = Object.prototype, cr = de["__core-js_shared__"], li = Za.toString, Jt = Nn.hasOwnProperty, bs = function() {
    var u = /[^.]+$/.exec(cr && cr.keys && cr.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), ys = Nn.toString, Xa = RegExp(
    "^" + li.call(Jt).replace(Ne, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ci = ri ? de.Buffer : void 0, ur = de.Symbol, vs = de.Uint8Array, dr = Nn.propertyIsEnumerable, On = lr.splice, he = ur ? ur.toStringTag : void 0, hr = Object.getOwnPropertySymbols, ui = ci ? ci.isBuffer : void 0, Mn = ms(Object.keys, Object), di = Xe(de, "DataView"), qn = Xe(de, "Map"), hi = Xe(de, "Promise"), fi = Xe(de, "Set"), pi = Xe(de, "WeakMap"), hn = Xe(Object, "create"), ws = _t(di), Ze = _t(qn), Ja = _t(hi), to = _t(fi), eo = _t(pi), ks = ur ? ur.prototype : void 0, gi = ks ? ks.valueOf : void 0;
  function St(u) {
    var g = -1, w = u == null ? 0 : u.length;
    for (this.clear(); ++g < w; ) {
      var L = u[g];
      this.set(L[0], L[1]);
    }
  }
  function no() {
    this.__data__ = hn ? hn(null) : {}, this.size = 0;
  }
  function ro(u) {
    var g = this.has(u) && delete this.__data__[u];
    return this.size -= g ? 1 : 0, g;
  }
  function io(u) {
    var g = this.__data__;
    if (hn) {
      var w = g[u];
      return w === n ? void 0 : w;
    }
    return Jt.call(g, u) ? g[u] : void 0;
  }
  function so(u) {
    var g = this.__data__;
    return hn ? g[u] !== void 0 : Jt.call(g, u);
  }
  function ao(u, g) {
    var w = this.__data__;
    return this.size += this.has(u) ? 0 : 1, w[u] = hn && g === void 0 ? n : g, this;
  }
  St.prototype.clear = no, St.prototype.delete = ro, St.prototype.get = io, St.prototype.has = so, St.prototype.set = ao;
  function Ct(u) {
    var g = -1, w = u == null ? 0 : u.length;
    for (this.clear(); ++g < w; ) {
      var L = u[g];
      this.set(L[0], L[1]);
    }
  }
  function oo() {
    this.__data__ = [], this.size = 0;
  }
  function lo(u) {
    var g = this.__data__, w = gr(g, u);
    if (w < 0)
      return !1;
    var L = g.length - 1;
    return w == L ? g.pop() : On.call(g, w, 1), --this.size, !0;
  }
  function co(u) {
    var g = this.__data__, w = gr(g, u);
    return w < 0 ? void 0 : g[w][1];
  }
  function uo(u) {
    return gr(this.__data__, u) > -1;
  }
  function ho(u, g) {
    var w = this.__data__, L = gr(w, u);
    return L < 0 ? (++this.size, w.push([u, g])) : w[L][1] = g, this;
  }
  Ct.prototype.clear = oo, Ct.prototype.delete = lo, Ct.prototype.get = co, Ct.prototype.has = uo, Ct.prototype.set = ho;
  function $t(u) {
    var g = -1, w = u == null ? 0 : u.length;
    for (this.clear(); ++g < w; ) {
      var L = u[g];
      this.set(L[0], L[1]);
    }
  }
  function fo() {
    this.size = 0, this.__data__ = {
      hash: new St(),
      map: new (qn || Ct)(),
      string: new St()
    };
  }
  function po(u) {
    var g = fe(this, u).delete(u);
    return this.size -= g ? 1 : 0, g;
  }
  function go(u) {
    return fe(this, u).get(u);
  }
  function mo(u) {
    return fe(this, u).has(u);
  }
  function bo(u, g) {
    var w = fe(this, u), L = w.size;
    return w.set(u, g), this.size += w.size == L ? 0 : 1, this;
  }
  $t.prototype.clear = fo, $t.prototype.delete = po, $t.prototype.get = go, $t.prototype.has = mo, $t.prototype.set = bo;
  function fr(u) {
    var g = -1, w = u == null ? 0 : u.length;
    for (this.__data__ = new $t(); ++g < w; )
      this.add(u[g]);
  }
  function xs(u) {
    return this.__data__.set(u, n), this;
  }
  function pr(u) {
    return this.__data__.has(u);
  }
  fr.prototype.add = fr.prototype.push = xs, fr.prototype.has = pr;
  function Me(u) {
    var g = this.__data__ = new Ct(u);
    this.size = g.size;
  }
  function mi() {
    this.__data__ = new Ct(), this.size = 0;
  }
  function yo(u) {
    var g = this.__data__, w = g.delete(u);
    return this.size = g.size, w;
  }
  function vo(u) {
    return this.__data__.get(u);
  }
  function wo(u) {
    return this.__data__.has(u);
  }
  function ko(u, g) {
    var w = this.__data__;
    if (w instanceof Ct) {
      var L = w.__data__;
      if (!qn || L.length < e - 1)
        return L.push([u, g]), this.size = ++w.size, this;
      w = this.__data__ = new $t(L);
    }
    return w.set(u, g), this.size = w.size, this;
  }
  Me.prototype.clear = mi, Me.prototype.delete = yo, Me.prototype.get = vo, Me.prototype.has = wo, Me.prototype.set = ko;
  function xo(u, g) {
    var w = mr(u), L = !w && Ts(u), j = !w && !L && br(u), $ = !w && !L && !j && Is(u), Q = w || L || j || $, W = Q ? Wa(u.length, String) : [], ft = W.length;
    for (var X in u)
      Jt.call(u, X) && !(Q && // Safari 9 has enumerable `arguments.length` in strict mode.
      (X == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      j && (X == "offset" || X == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      $ && (X == "buffer" || X == "byteLength" || X == "byteOffset") || // Skip index properties.
      Io(X, ft))) && W.push(X);
    return W;
  }
  function gr(u, g) {
    for (var w = u.length; w--; )
      if (Cs(u[w][0], g))
        return w;
    return -1;
  }
  function bi(u, g, w) {
    var L = g(u);
    return mr(u) ? L : ai(L, w(u));
  }
  function _n(u) {
    return u == null ? u === void 0 ? A : v : he && he in Object(u) ? Je(u) : Es(u);
  }
  function Ss(u) {
    return _e(u) && _n(u) == o;
  }
  function As(u, g, w, L, j) {
    return u === g ? !0 : u == null || g == null || !_e(u) && !_e(g) ? u !== u && g !== g : So(u, g, w, L, As, j);
  }
  function So(u, g, w, L, j, $) {
    var Q = mr(u), W = mr(g), ft = Q ? l : qe(u), X = W ? l : qe(g);
    ft = ft == o ? S : ft, X = X == o ? S : X;
    var Tt = ft == S, Ft = X == S, bt = ft == X;
    if (bt && br(u)) {
      if (!br(g))
        return !1;
      Q = !0, Tt = !1;
    }
    if (bt && !Tt)
      return $ || ($ = new Me()), Q || Is(u) ? yi(u, g, w, L, j, $) : To(u, g, ft, w, L, j, $);
    if (!(w & i)) {
      var Lt = Tt && Jt.call(u, "__wrapped__"), At = Ft && Jt.call(g, "__wrapped__");
      if (Lt || At) {
        var fn = Lt ? u.value() : u, tn = At ? g.value() : g;
        return $ || ($ = new Me()), j(fn, tn, w, L, $);
      }
    }
    return bt ? ($ || ($ = new Me()), Lo(u, g, w, L, j, $)) : !1;
  }
  function Ao(u) {
    if (!Ds(u) || Oo(u))
      return !1;
    var g = Ls(u) ? Xa : ue;
    return g.test(_t(u));
  }
  function Eo(u) {
    return _e(u) && wi(u.length) && !!et[_n(u)];
  }
  function Co(u) {
    if (!Mo(u))
      return Mn(u);
    var g = [];
    for (var w in Object(u))
      Jt.call(u, w) && w != "constructor" && g.push(w);
    return g;
  }
  function yi(u, g, w, L, j, $) {
    var Q = w & i, W = u.length, ft = g.length;
    if (W != ft && !(Q && ft > W))
      return !1;
    var X = $.get(u);
    if (X && $.get(g))
      return X == g;
    var Tt = -1, Ft = !0, bt = w & s ? new fr() : void 0;
    for ($.set(u, g), $.set(g, u); ++Tt < W; ) {
      var Lt = u[Tt], At = g[Tt];
      if (L)
        var fn = Q ? L(At, Lt, Tt, g, u, $) : L(Lt, At, Tt, u, g, $);
      if (fn !== void 0) {
        if (fn)
          continue;
        Ft = !1;
        break;
      }
      if (bt) {
        if (!ps(g, function(tn, Rn) {
          if (!or(bt, Rn) && (Lt === tn || j(Lt, tn, w, L, $)))
            return bt.push(Rn);
        })) {
          Ft = !1;
          break;
        }
      } else if (!(Lt === At || j(Lt, At, w, L, $))) {
        Ft = !1;
        break;
      }
    }
    return $.delete(u), $.delete(g), Ft;
  }
  function To(u, g, w, L, j, $, Q) {
    switch (w) {
      case V:
        if (u.byteLength != g.byteLength || u.byteOffset != g.byteOffset)
          return !1;
        u = u.buffer, g = g.buffer;
      case N:
        return !(u.byteLength != g.byteLength || !$(new vs(u), new vs(g)));
      case d:
      case f:
      case k:
        return Cs(+u, +g);
      case h:
        return u.name == g.name && u.message == g.message;
      case I:
      case O:
        return u == g + "";
      case b:
        var W = gs;
      case M:
        var ft = L & i;
        if (W || (W = Oe), u.size != g.size && !ft)
          return !1;
        var X = Q.get(u);
        if (X)
          return X == g;
        L |= s, Q.set(u, g);
        var Tt = yi(W(u), W(g), L, j, $, Q);
        return Q.delete(u), Tt;
      case x:
        if (gi)
          return gi.call(u) == gi.call(g);
    }
    return !1;
  }
  function Lo(u, g, w, L, j, $) {
    var Q = w & i, W = zn(u), ft = W.length, X = zn(g), Tt = X.length;
    if (ft != Tt && !Q)
      return !1;
    for (var Ft = ft; Ft--; ) {
      var bt = W[Ft];
      if (!(Q ? bt in g : Jt.call(g, bt)))
        return !1;
    }
    var Lt = $.get(u);
    if (Lt && $.get(g))
      return Lt == g;
    var At = !0;
    $.set(u, g), $.set(g, u);
    for (var fn = Q; ++Ft < ft; ) {
      bt = W[Ft];
      var tn = u[bt], Rn = g[bt];
      if (L)
        var Su = Q ? L(Rn, tn, bt, g, u, $) : L(tn, Rn, bt, u, g, $);
      if (!(Su === void 0 ? tn === Rn || j(tn, Rn, w, L, $) : Su)) {
        At = !1;
        break;
      }
      fn || (fn = bt == "constructor");
    }
    if (At && !fn) {
      var Ns = u.constructor, Os = g.constructor;
      Ns != Os && "constructor" in u && "constructor" in g && !(typeof Ns == "function" && Ns instanceof Ns && typeof Os == "function" && Os instanceof Os) && (At = !1);
    }
    return $.delete(u), $.delete(g), At;
  }
  function zn(u) {
    return bi(u, ki, Do);
  }
  function fe(u, g) {
    var w = u.__data__;
    return No(g) ? w[typeof g == "string" ? "string" : "hash"] : w.map;
  }
  function Xe(u, g) {
    var w = oi(u, g);
    return Ao(w) ? w : void 0;
  }
  function Je(u) {
    var g = Jt.call(u, he), w = u[he];
    try {
      u[he] = void 0;
      var L = !0;
    } catch {
    }
    var j = ys.call(u);
    return L && (g ? u[he] = w : delete u[he]), j;
  }
  var Do = hr ? function(u) {
    return u == null ? [] : (u = Object(u), fs(hr(u), function(g) {
      return dr.call(u, g);
    }));
  } : _o, qe = _n;
  (di && qe(new di(new ArrayBuffer(1))) != V || qn && qe(new qn()) != b || hi && qe(hi.resolve()) != E || fi && qe(new fi()) != M || pi && qe(new pi()) != _) && (qe = function(u) {
    var g = _n(u), w = g == S ? u.constructor : void 0, L = w ? _t(w) : "";
    if (L)
      switch (L) {
        case ws:
          return V;
        case Ze:
          return b;
        case Ja:
          return E;
        case to:
          return M;
        case eo:
          return _;
      }
    return g;
  });
  function Io(u, g) {
    return g = g ?? a, !!g && (typeof u == "number" || ls.test(u)) && u > -1 && u % 1 == 0 && u < g;
  }
  function No(u) {
    var g = typeof u;
    return g == "string" || g == "number" || g == "symbol" || g == "boolean" ? u !== "__proto__" : u === null;
  }
  function Oo(u) {
    return !!bs && bs in u;
  }
  function Mo(u) {
    var g = u && u.constructor, w = typeof g == "function" && g.prototype || Nn;
    return u === w;
  }
  function Es(u) {
    return ys.call(u);
  }
  function _t(u) {
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
  function Cs(u, g) {
    return u === g || u !== u && g !== g;
  }
  var Ts = Ss(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ss : function(u) {
    return _e(u) && Jt.call(u, "callee") && !dr.call(u, "callee");
  }, mr = Array.isArray;
  function vi(u) {
    return u != null && wi(u.length) && !Ls(u);
  }
  var br = ui || zo;
  function qo(u, g) {
    return As(u, g);
  }
  function Ls(u) {
    if (!Ds(u))
      return !1;
    var g = _n(u);
    return g == p || g == m || g == c || g == C;
  }
  function wi(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= a;
  }
  function Ds(u) {
    var g = typeof u;
    return u != null && (g == "object" || g == "function");
  }
  function _e(u) {
    return u != null && typeof u == "object";
  }
  var Is = si ? Qa(si) : Eo;
  function ki(u) {
    return vi(u) ? xo(u) : Co(u);
  }
  function _o() {
    return [];
  }
  function zo() {
    return !1;
  }
  r.exports = qo;
})(ua, ua.exports);
var zf = ua.exports, Fc = {};
Object.defineProperty(Fc, "__esModule", { value: !0 });
const u0 = _f, d0 = zf;
var Rl;
(function(r) {
  function t(s = {}, a = {}, o = !1) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    let l = u0(a);
    o || (l = Object.keys(l).reduce((c, d) => (l[d] != null && (c[d] = l[d]), c), {}));
    for (const c in s)
      s[c] !== void 0 && a[c] === void 0 && (l[c] = s[c]);
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.compose = t;
  function e(s = {}, a = {}) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    const o = Object.keys(s).concat(Object.keys(a)).reduce((l, c) => (d0(s[c], a[c]) || (l[c] = a[c] === void 0 ? null : a[c]), l), {});
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
  function t(e) {
    return typeof e.delete == "number" ? e.delete : typeof e.retain == "number" ? e.retain : typeof e.retain == "object" && e.retain !== null ? 1 : typeof e.insert == "string" ? e.insert.length : 1;
  }
  r.length = t;
})(Pl || (Pl = {}));
Ma.default = Pl;
var jc = {};
Object.defineProperty(jc, "__esModule", { value: !0 });
const id = Ma;
class h0 {
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
      const n = this.offset, i = id.default.length(e);
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
    return this.ops[this.index] ? id.default.length(this.ops[this.index]) - this.offset : 1 / 0;
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
jc.default = h0;
(function(r, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.AttributeMap = t.OpIterator = t.Op = void 0;
  const e = c0, n = _f, i = zf, s = Fc;
  t.AttributeMap = s.default;
  const a = Ma;
  t.Op = a.default;
  const o = jc;
  t.OpIterator = o.default;
  const l = "\0", c = (f, h) => {
    if (typeof f != "object" || f === null)
      throw new Error(`cannot retain a ${typeof f}`);
    if (typeof h != "object" || h === null)
      throw new Error(`cannot retain a ${typeof h}`);
    const p = Object.keys(f)[0];
    if (!p || p !== Object.keys(h)[0])
      throw new Error(`embed types not matched: ${p} != ${Object.keys(h)[0]}`);
    return [p, f[p], h[p]];
  };
  class d {
    constructor(h) {
      Array.isArray(h) ? this.ops = h : h != null && Array.isArray(h.ops) ? this.ops = h.ops : this.ops = [];
    }
    static registerEmbed(h, p) {
      this.handlers[h] = p;
    }
    static unregisterEmbed(h) {
      delete this.handlers[h];
    }
    static getHandler(h) {
      const p = this.handlers[h];
      if (!p)
        throw new Error(`no handlers for embed type "${h}"`);
      return p;
    }
    insert(h, p) {
      const m = {};
      return typeof h == "string" && h.length === 0 ? this : (m.insert = h, p != null && typeof p == "object" && Object.keys(p).length > 0 && (m.attributes = p), this.push(m));
    }
    delete(h) {
      return h <= 0 ? this : this.push({ delete: h });
    }
    retain(h, p) {
      if (typeof h == "number" && h <= 0)
        return this;
      const m = { retain: h };
      return p != null && typeof p == "object" && Object.keys(p).length > 0 && (m.attributes = p), this.push(m);
    }
    push(h) {
      let p = this.ops.length, m = this.ops[p - 1];
      if (h = n(h), typeof m == "object") {
        if (typeof h.delete == "number" && typeof m.delete == "number")
          return this.ops[p - 1] = { delete: m.delete + h.delete }, this;
        if (typeof m.delete == "number" && h.insert != null && (p -= 1, m = this.ops[p - 1], typeof m != "object"))
          return this.ops.unshift(h), this;
        if (i(h.attributes, m.attributes)) {
          if (typeof h.insert == "string" && typeof m.insert == "string")
            return this.ops[p - 1] = { insert: m.insert + h.insert }, typeof h.attributes == "object" && (this.ops[p - 1].attributes = h.attributes), this;
          if (typeof h.retain == "number" && typeof m.retain == "number")
            return this.ops[p - 1] = { retain: m.retain + h.retain }, typeof h.attributes == "object" && (this.ops[p - 1].attributes = h.attributes), this;
        }
      }
      return p === this.ops.length ? this.ops.push(h) : this.ops.splice(p, 0, h), this;
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
      const p = [], m = [];
      return this.forEach((b) => {
        (h(b) ? p : m).push(b);
      }), [p, m];
    }
    reduce(h, p) {
      return this.ops.reduce(h, p);
    }
    changeLength() {
      return this.reduce((h, p) => p.insert ? h + a.default.length(p) : p.delete ? h - p.delete : h, 0);
    }
    length() {
      return this.reduce((h, p) => h + a.default.length(p), 0);
    }
    slice(h = 0, p = 1 / 0) {
      const m = [], b = new o.default(this.ops);
      let k = 0;
      for (; k < p && b.hasNext(); ) {
        let v;
        k < h ? v = b.next(h - k) : (v = b.next(p - k), m.push(v)), k += a.default.length(v);
      }
      return new d(m);
    }
    compose(h) {
      const p = new o.default(this.ops), m = new o.default(h.ops), b = [], k = m.peek();
      if (k != null && typeof k.retain == "number" && k.attributes == null) {
        let S = k.retain;
        for (; p.peekType() === "insert" && p.peekLength() <= S; )
          S -= p.peekLength(), b.push(p.next());
        k.retain - S > 0 && m.next(k.retain - S);
      }
      const v = new d(b);
      for (; p.hasNext() || m.hasNext(); )
        if (m.peekType() === "insert")
          v.push(m.next());
        else if (p.peekType() === "delete")
          v.push(p.next());
        else {
          const S = Math.min(p.peekLength(), m.peekLength()), E = p.next(S), C = m.next(S);
          if (C.retain) {
            const I = {};
            if (typeof E.retain == "number")
              I.retain = typeof C.retain == "number" ? S : C.retain;
            else if (typeof C.retain == "number")
              E.retain == null ? I.insert = E.insert : I.retain = E.retain;
            else {
              const O = E.retain == null ? "insert" : "retain", [x, A, _] = c(E[O], C.retain), N = d.getHandler(x);
              I[O] = {
                [x]: N.compose(A, _, O === "retain")
              };
            }
            const M = s.default.compose(E.attributes, C.attributes, typeof E.retain == "number");
            if (M && (I.attributes = M), v.push(I), !m.hasNext() && i(v.ops[v.ops.length - 1], I)) {
              const O = new d(p.rest());
              return v.concat(O).chop();
            }
          } else typeof C.delete == "number" && (typeof E.retain == "number" || typeof E.retain == "object" && E.retain !== null) && v.push(C);
        }
      return v.chop();
    }
    concat(h) {
      const p = new d(this.ops.slice());
      return h.ops.length > 0 && (p.push(h.ops[0]), p.ops = p.ops.concat(h.ops.slice(1))), p;
    }
    diff(h, p) {
      if (this.ops === h.ops)
        return new d();
      const m = [this, h].map((E) => E.map((C) => {
        if (C.insert != null)
          return typeof C.insert == "string" ? C.insert : l;
        const I = E === h ? "on" : "with";
        throw new Error("diff() called " + I + " non-document");
      }).join("")), b = new d(), k = e(m[0], m[1], p, !0), v = new o.default(this.ops), S = new o.default(h.ops);
      return k.forEach((E) => {
        let C = E[1].length;
        for (; C > 0; ) {
          let I = 0;
          switch (E[0]) {
            case e.INSERT:
              I = Math.min(S.peekLength(), C), b.push(S.next(I));
              break;
            case e.DELETE:
              I = Math.min(C, v.peekLength()), v.next(I), b.delete(I);
              break;
            case e.EQUAL:
              I = Math.min(v.peekLength(), S.peekLength(), C);
              const M = v.next(I), O = S.next(I);
              i(M.insert, O.insert) ? b.retain(I, s.default.diff(M.attributes, O.attributes)) : b.push(O).delete(I);
              break;
          }
          C -= I;
        }
      }), b.chop();
    }
    eachLine(h, p = `
`) {
      const m = new o.default(this.ops);
      let b = new d(), k = 0;
      for (; m.hasNext(); ) {
        if (m.peekType() !== "insert")
          return;
        const v = m.peek(), S = a.default.length(v) - m.peekLength(), E = typeof v.insert == "string" ? v.insert.indexOf(p, S) - S : -1;
        if (E < 0)
          b.push(m.next());
        else if (E > 0)
          b.push(m.next(E));
        else {
          if (h(b, m.next(1).attributes || {}, k) === !1)
            return;
          k += 1, b = new d();
        }
      }
      b.length() > 0 && h(b, {}, k);
    }
    invert(h) {
      const p = new d();
      return this.reduce((m, b) => {
        if (b.insert)
          p.delete(a.default.length(b));
        else {
          if (typeof b.retain == "number" && b.attributes == null)
            return p.retain(b.retain), m + b.retain;
          if (b.delete || typeof b.retain == "number") {
            const k = b.delete || b.retain;
            return h.slice(m, m + k).forEach((S) => {
              b.delete ? p.push(S) : b.retain && b.attributes && p.retain(a.default.length(S), s.default.invert(b.attributes, S.attributes));
            }), m + k;
          } else if (typeof b.retain == "object" && b.retain !== null) {
            const k = h.slice(m, m + 1), v = new o.default(k.ops).next(), [S, E, C] = c(b.retain, v.insert), I = d.getHandler(S);
            return p.retain({ [S]: I.invert(E, C) }, s.default.invert(b.attributes, v.attributes)), m + 1;
          }
        }
        return m;
      }, 0), p.chop();
    }
    transform(h, p = !1) {
      if (p = !!p, typeof h == "number")
        return this.transformPosition(h, p);
      const m = h, b = new o.default(this.ops), k = new o.default(m.ops), v = new d();
      for (; b.hasNext() || k.hasNext(); )
        if (b.peekType() === "insert" && (p || k.peekType() !== "insert"))
          v.retain(a.default.length(b.next()));
        else if (k.peekType() === "insert")
          v.push(k.next());
        else {
          const S = Math.min(b.peekLength(), k.peekLength()), E = b.next(S), C = k.next(S);
          if (E.delete)
            continue;
          if (C.delete)
            v.push(C);
          else {
            const I = E.retain, M = C.retain;
            let O = typeof M == "object" && M !== null ? M : S;
            if (typeof I == "object" && I !== null && typeof M == "object" && M !== null) {
              const x = Object.keys(I)[0];
              if (x === Object.keys(M)[0]) {
                const A = d.getHandler(x);
                A && (O = {
                  [x]: A.transform(I[x], M[x], p)
                });
              }
            }
            v.retain(O, s.default.transform(E.attributes, C.attributes, p));
          }
        }
      return v.chop();
    }
    transformPosition(h, p = !1) {
      p = !!p;
      const m = new o.default(this.ops);
      let b = 0;
      for (; m.hasNext() && b <= h; ) {
        const k = m.peekLength(), v = m.peekType();
        if (m.next(), v === "delete") {
          h -= Math.min(k, h - b);
          continue;
        } else v === "insert" && (b < h || !p) && (h += k);
        b += k;
      }
      return h;
    }
  }
  d.Op = a.default, d.OpIterator = o.default, d.AttributeMap = s.default, d.handlers = {}, t.default = d, r.exports = d, r.exports.default = d;
})(zl, zl.exports);
var oe = zl.exports;
const P = /* @__PURE__ */ If(oe);
class Ce extends Zt {
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
Ce.blotName = "break";
Ce.tagName = "BR";
let xe = class extends la {
};
const f0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function qa(r) {
  return r.replace(/[&<>"']/g, (t) => f0[t]);
}
const ze = class ze extends Rc {
  static compare(t, e) {
    const n = ze.order.indexOf(t), i = ze.order.indexOf(e);
    return n >= 0 || i >= 0 ? n - i : t === e ? 0 : t < e ? -1 : 1;
  }
  formatAt(t, e, n, i) {
    if (ze.compare(this.statics.blotName, n) < 0 && this.scroll.query(n, B.BLOT)) {
      const s = this.isolate(t, e);
      i && s.wrap(n, i);
    } else
      super.formatAt(t, e, n, i);
  }
  optimize(t) {
    if (super.optimize(t), this.parent instanceof ze && ze.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const e = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(e), e.wrap(this);
    }
  }
};
q(ze, "allowedChildren", [ze, Ce, Zt, xe]), // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
q(ze, "order", [
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
let He = ze;
const sd = 1;
class Et extends Vi {
  constructor() {
    super(...arguments);
    q(this, "cache", {});
  }
  delta() {
    return this.cache.delta == null && (this.cache.delta = Rf(this)), this.cache.delta;
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
    super.insertBefore(e, n), i instanceof Ce && i.remove(), this.cache = {};
  }
  length() {
    return this.cache.length == null && (this.cache.length = super.length() + sd), this.cache.length;
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
    if (n && (e === 0 || e >= this.length() - sd)) {
      const s = this.clone();
      return e === 0 ? (this.parent.insertBefore(s, this), this) : (this.parent.insertBefore(s, this.next), s);
    }
    const i = super.split(e, n);
    return this.cache = {}, i;
  }
}
Et.blotName = "block";
Et.tagName = "P";
Et.defaultChild = Ce;
Et.allowedChildren = [Ce, He, Zt, xe];
class ae extends Zt {
  attach() {
    super.attach(), this.attributes = new Da(this.domNode);
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
      const c = this.scroll.create(Et.blotName);
      return c.insertAt(0, l), c;
    }), o = this.split(t);
    a.forEach((l) => {
      this.parent.insertBefore(l, o);
    }), s && this.parent.insertBefore(this.scroll.create("text", s), o);
  }
}
ae.scope = B.BLOCK_BLOT;
function Rf(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  return r.descendants(Nt).reduce((e, n) => n.length() === 0 ? e : e.insert(n.value(), re(n, {}, t)), new P()).insert(`
`, re(r));
}
function re(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  return r == null || ("formats" in r && typeof r.formats == "function" && (t = {
    ...t,
    ...r.formats()
  }, e && delete t["code-token"]), r.parent == null || r.parent.statics.blotName === "scroll" || r.parent.statics.scope !== r.statics.scope) ? t : re(r.parent, t, e);
}
const ee = class ee extends Zt {
  // Zero width no break space
  static value() {
  }
  constructor(t, e, n) {
    super(t, e), this.selection = n, this.textNode = document.createTextNode(ee.CONTENTS), this.domNode.appendChild(this.textNode), this.savedLength = 0;
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
    n != null && (this.savedLength = ee.CONTENTS.length, n.optimize(), n.formatAt(i, ee.CONTENTS.length, t, e), this.savedLength = 0);
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
    const e = this.prev instanceof xe ? this.prev : null, n = e ? e.length() : 0, i = this.next instanceof xe ? this.next : null, s = i ? i.text : "", {
      textNode: a
    } = this, o = a.data.split(ee.CONTENTS).join("");
    a.data = ee.CONTENTS;
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
      const c = (h, p) => e && h === e.domNode ? p : h === a ? n + p - 1 : i && h === i.domNode ? n + o.length + p : null, d = c(t.start.node, t.start.offset), f = c(t.end.node, t.end.offset);
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
        this.savedLength = ee.CONTENTS.length, e.isolate(this.offset(e), this.length()).unwrap(), this.savedLength = 0;
        break;
      }
      e = e.parent;
    }
  }
  value() {
    return "";
  }
};
q(ee, "blotName", "cursor"), q(ee, "className", "ql-cursor"), q(ee, "tagName", "span"), q(ee, "CONTENTS", "\uFEFF");
let Yr = ee;
var Pf = { exports: {} };
(function(r) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function n() {
  }
  Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (e = !1));
  function i(l, c, d) {
    this.fn = l, this.context = c, this.once = d || !1;
  }
  function s(l, c, d, f, h) {
    if (typeof d != "function")
      throw new TypeError("The listener must be a function");
    var p = new i(d, f || l, h), m = e ? e + c : c;
    return l._events[m] ? l._events[m].fn ? l._events[m] = [l._events[m], p] : l._events[m].push(p) : (l._events[m] = p, l._eventsCount++), l;
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
      t.call(d, f) && c.push(e ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(d)) : c;
  }, o.prototype.listeners = function(c) {
    var d = e ? e + c : c, f = this._events[d];
    if (!f) return [];
    if (f.fn) return [f.fn];
    for (var h = 0, p = f.length, m = new Array(p); h < p; h++)
      m[h] = f[h].fn;
    return m;
  }, o.prototype.listenerCount = function(c) {
    var d = e ? e + c : c, f = this._events[d];
    return f ? f.fn ? 1 : f.length : 0;
  }, o.prototype.emit = function(c, d, f, h, p, m) {
    var b = e ? e + c : c;
    if (!this._events[b]) return !1;
    var k = this._events[b], v = arguments.length, S, E;
    if (k.fn) {
      switch (k.once && this.removeListener(c, k.fn, void 0, !0), v) {
        case 1:
          return k.fn.call(k.context), !0;
        case 2:
          return k.fn.call(k.context, d), !0;
        case 3:
          return k.fn.call(k.context, d, f), !0;
        case 4:
          return k.fn.call(k.context, d, f, h), !0;
        case 5:
          return k.fn.call(k.context, d, f, h, p), !0;
        case 6:
          return k.fn.call(k.context, d, f, h, p, m), !0;
      }
      for (E = 1, S = new Array(v - 1); E < v; E++)
        S[E - 1] = arguments[E];
      k.fn.apply(k.context, S);
    } else {
      var C = k.length, I;
      for (E = 0; E < C; E++)
        switch (k[E].once && this.removeListener(c, k[E].fn, void 0, !0), v) {
          case 1:
            k[E].fn.call(k[E].context);
            break;
          case 2:
            k[E].fn.call(k[E].context, d);
            break;
          case 3:
            k[E].fn.call(k[E].context, d, f);
            break;
          case 4:
            k[E].fn.call(k[E].context, d, f, h);
            break;
          default:
            if (!S) for (I = 1, S = new Array(v - 1); I < v; I++)
              S[I - 1] = arguments[I];
            k[E].fn.apply(k[E].context, S);
        }
    }
    return !0;
  }, o.prototype.on = function(c, d, f) {
    return s(this, c, d, f, !1);
  }, o.prototype.once = function(c, d, f) {
    return s(this, c, d, f, !0);
  }, o.prototype.removeListener = function(c, d, f, h) {
    var p = e ? e + c : c;
    if (!this._events[p]) return this;
    if (!d)
      return a(this, p), this;
    var m = this._events[p];
    if (m.fn)
      m.fn === d && (!h || m.once) && (!f || m.context === f) && a(this, p);
    else {
      for (var b = 0, k = [], v = m.length; b < v; b++)
        (m[b].fn !== d || h && !m[b].once || f && m[b].context !== f) && k.push(m[b]);
      k.length ? this._events[p] = k.length === 1 ? k[0] : k : a(this, p);
    }
    return this;
  }, o.prototype.removeAllListeners = function(c) {
    var d;
    return c ? (d = e ? e + c : c, this._events[d] && a(this, d)) : (this._events = new n(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = e, o.EventEmitter = o, r.exports = o;
})(Pf);
var p0 = Pf.exports;
const g0 = /* @__PURE__ */ If(p0), Bl = /* @__PURE__ */ new WeakMap(), $l = ["error", "warn", "log", "info"];
let Fl = "warn";
function Bf(r) {
  if (Fl && $l.indexOf(r) <= $l.indexOf(Fl)) {
    for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
      e[n - 1] = arguments[n];
    console[r](...e);
  }
}
function un(r) {
  return $l.reduce((t, e) => (t[e] = Bf.bind(console, e, r), t), {});
}
un.level = (r) => {
  Fl = r;
};
Bf.level = un.level;
const Ho = un("quill:events"), m0 = ["selectionchange", "mousedown", "mouseup", "click"];
m0.forEach((r) => {
  document.addEventListener(r, function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    Array.from(document.querySelectorAll(".ql-container")).forEach((i) => {
      const s = Bl.get(i);
      s && s.emitter && s.emitter.handleDOM(...e);
    });
  });
});
class R extends g0 {
  constructor() {
    super(), this.domListeners = {}, this.on("error", Ho.error);
  }
  emit() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return Ho.log.call(Ho, ...e), super.emit(...e);
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
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = t, this.length = e;
  }
}
class b0 {
  constructor(t, e) {
    this.emitter = e, this.scroll = t, this.composing = !1, this.mouseDown = !1, this.root = this.scroll.domNode, this.cursor = this.scroll.create("cursor", this), this.savedRange = new Xn(0, 0), this.lastRange = this.savedRange, this.lastNative = null, this.handleComposition(), this.handleDragging(), this.emitter.listenDOM("selectionchange", document, () => {
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
      this.mouseDown = !1, this.update(R.sources.USER);
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
        if (i instanceof Nt) {
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
      const [d] = this.scroll.leaf(t + 1);
      if (d) {
        const [f] = this.scroll.line(t), [h] = this.scroll.line(t + 1);
        f === h && (s = d, a = 0);
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
    return Vo.info("getNativeRange", n), n;
  }
  getRange() {
    const t = this.scroll.domNode;
    if ("isConnected" in t && !t.isConnected)
      return [null, null];
    const e = this.getNativeRange();
    return e == null ? [null, null] : [this.normalizedToRange(e), e];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && Yo(this.root, document.activeElement);
  }
  normalizedToRange(t) {
    const e = [[t.start.node, t.start.offset]];
    t.native.collapsed || e.push([t.end.node, t.end.offset]);
    const n = e.map((a) => {
      const [o, l] = a, c = this.scroll.find(o, !0), d = c.offset(this.scroll);
      return l === 0 ? d : c instanceof Nt ? d + c.index(o, l) : d + c.length();
    }), i = Math.min(Math.max(...n), this.scroll.length() - 1), s = Math.min(i, ...n);
    return new Xn(s, i - s);
  }
  normalizeNative(t) {
    if (!Yo(this.root, t.startContainer) || !t.collapsed && !Yo(this.root, t.endContainer))
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
    if (Vo.info("setNativeRange", t, e, n, i), t != null && (this.root.parentNode == null || t.parentNode == null || // @ts-expect-error Fix me later
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
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : R.sources.API;
    if (typeof e == "string" && (n = e, e = !1), Vo.info("setRange", t), t != null) {
      const i = this.rangeToNative(t);
      this.setNativeRange(...i, e);
    } else
      this.setNativeRange(null);
    this.update(n);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : R.sources.USER;
    const e = this.lastRange, [n, i] = this.getRange();
    if (this.lastRange = n, this.lastNative = i, this.lastRange != null && (this.savedRange = this.lastRange), !zc(e, this.lastRange)) {
      if (!this.composing && i != null && i.native.collapsed && i.start.node !== this.cursor.textNode) {
        const a = this.cursor.restore();
        a && this.setNativeRange(a.startNode, a.startOffset, a.endNode, a.endOffset);
      }
      const s = [R.events.SELECTION_CHANGE, Or(this.lastRange), Or(e), t];
      this.emitter.emit(R.events.EDITOR_CHANGE, ...s), t !== R.sources.SILENT && this.emitter.emit(...s);
    }
  }
}
function Yo(r, t) {
  try {
    t.parentNode;
  } catch {
    return !1;
  }
  return r.contains(t);
}
const y0 = /^[ -~]*$/;
class v0 {
  constructor(t) {
    this.scroll = t, this.delta = this.getDelta();
  }
  applyDelta(t) {
    this.scroll.update();
    let e = this.scroll.length();
    this.scroll.batchStart();
    const n = ad(t), i = new P();
    return k0(n.ops.slice()).reduce((a, o) => {
      const l = oe.Op.length(o);
      let c = o.attributes || {}, d = !1, f = !1;
      if (o.insert != null) {
        if (i.retain(l), typeof o.insert == "string") {
          const m = o.insert;
          f = !m.endsWith(`
`) && (e <= a || !!this.scroll.descendant(ae, a)[0]), this.scroll.insertAt(a, m);
          const [b, k] = this.scroll.line(a);
          let v = An({}, re(b));
          if (b instanceof Et) {
            const [S] = b.descendant(Nt, k);
            S && (v = An(v, re(S)));
          }
          c = oe.AttributeMap.diff(v, c) || {};
        } else if (typeof o.insert == "object") {
          const m = Object.keys(o.insert)[0];
          if (m == null) return a;
          const b = this.scroll.query(m, B.INLINE) != null;
          if (b)
            (e <= a || this.scroll.descendant(ae, a)[0]) && (f = !0);
          else if (a > 0) {
            const [k, v] = this.scroll.descendant(Nt, a - 1);
            k instanceof xe ? k.value()[v] !== `
` && (d = !0) : k instanceof Zt && k.statics.scope === B.INLINE_BLOT && (d = !0);
          }
          if (this.scroll.insertAt(a, m, o.insert[m]), b) {
            const [k] = this.scroll.descendant(Nt, a);
            if (k) {
              const v = An({}, re(k));
              c = oe.AttributeMap.diff(v, c) || {};
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
      const h = d ? 1 : 0, p = f ? 1 : 0;
      return e += h + p, i.retain(h), i.delete(p), a + l + h + p;
    }, 0), i.reduce((a, o) => typeof o.delete == "number" ? (this.scroll.deleteAt(a, o.delete), a) : a + oe.Op.length(o), 0), this.scroll.batchEnd(), this.scroll.optimize(), this.update(n);
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
    const i = new P().retain(t).retain(e, Or(n));
    return this.update(i);
  }
  formatText(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(n).forEach((s) => {
      this.scroll.formatAt(t, e, s, n[s]);
    });
    const i = new P().retain(t).retain(e, Or(n));
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
      l instanceof Et ? n.push(l) : l instanceof Nt && i.push(l);
    }) : (n = this.scroll.lines(t, e), i = this.scroll.descendants(Nt, t, e));
    const [s, a] = [n, i].map((o) => {
      const l = o.shift();
      if (l == null) return {};
      let c = re(l);
      for (; Object.keys(c).length > 0; ) {
        const d = o.shift();
        if (d == null) return c;
        c = w0(re(d), c);
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
      return n.length() >= i + e && !(i === 0 && e === s) ? Gi(n, i, e, !0) : Gi(this.scroll, t, e, !0);
    }
    return "";
  }
  getText(t, e) {
    return this.getContents(t, e).filter((n) => typeof n.insert == "string").map((n) => n.insert).join("");
  }
  insertContents(t, e) {
    const n = ad(e), i = new P().retain(t).concat(n);
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
    }), this.update(new P().retain(t).insert(e, Or(n)));
  }
  isBlank() {
    if (this.scroll.children.length === 0) return !0;
    if (this.scroll.children.length > 1) return !1;
    const t = this.scroll.children.head;
    if ((t == null ? void 0 : t.statics.blotName) !== Et.blotName) return !1;
    const e = t;
    return e.children.length > 1 ? !1 : e.children.head instanceof Ce;
  }
  removeFormat(t, e) {
    const n = this.getText(t, e), [i, s] = this.scroll.line(t + e);
    let a = 0, o = new P();
    i != null && (a = i.length() - s, o = i.delta().slice(s, s + a - 1).insert(`
`));
    const c = this.getContents(t, e + a).diff(new P().insert(n).concat(o)), d = new P().retain(t).concat(c);
    return this.applyDelta(d);
  }
  update(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
    const i = this.delta;
    if (e.length === 1 && e[0].type === "characterData" && // @ts-expect-error Fix me later
    e[0].target.data.match(y0) && this.scroll.find(e[0].target)) {
      const s = this.scroll.find(e[0].target), a = re(s), o = s.offset(this.scroll), l = e[0].oldValue.replace(Yr.CONTENTS, ""), c = new P().insert(l), d = new P().insert(s.value()), f = n && {
        oldRange: od(n.oldRange, -o),
        newRange: od(n.newRange, -o)
      };
      t = new P().retain(o).concat(c.diff(d, f)).reduce((p, m) => m.insert ? p.insert(m.insert, a) : p.push(m), new P()), this.delta = i.compose(t);
    } else
      this.delta = this.getDelta(), (!t || !zc(i.compose(t), this.delta)) && (t = i.diff(this.delta, n));
    return t;
  }
}
function Tr(r, t, e) {
  if (r.length === 0) {
    const [p] = Go(e.pop());
    return t <= 0 ? `</li></${p}>` : `</li></${p}>${Tr([], t - 1, e)}`;
  }
  const [{
    child: n,
    offset: i,
    length: s,
    indent: a,
    type: o
  }, ...l] = r, [c, d] = Go(o);
  if (a > t)
    return e.push(o), a === t + 1 ? `<${c}><li${d}>${Gi(n, i, s)}${Tr(l, a, e)}` : `<${c}><li>${Tr(r, t + 1, e)}`;
  const f = e[e.length - 1];
  if (a === t && o === f)
    return `</li><li${d}>${Gi(n, i, s)}${Tr(l, a, e)}`;
  const [h] = Go(e.pop());
  return `</li></${h}>${Tr(r, t - 1, e)}`;
}
function Gi(r, t, e) {
  let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if ("html" in r && typeof r.html == "function")
    return r.html(t, e);
  if (r instanceof xe)
    return qa(r.value().slice(t, t + e)).replaceAll(" ", "&nbsp;");
  if (r instanceof we) {
    if (r.statics.blotName === "list-container") {
      const c = [];
      return r.children.forEachAt(t, e, (d, f, h) => {
        const p = "formats" in d && typeof d.formats == "function" ? d.formats() : {};
        c.push({
          child: d,
          offset: f,
          length: h,
          indent: p.indent || 0,
          type: p.list
        });
      }), Tr(c, -1, []);
    }
    const i = [];
    if (r.children.forEachAt(t, e, (c, d, f) => {
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
function w0(r, t) {
  return Object.keys(t).reduce((e, n) => {
    if (r[n] == null) return e;
    const i = t[n];
    return i === r[n] ? e[n] = i : Array.isArray(i) ? i.indexOf(r[n]) < 0 ? e[n] = i.concat([r[n]]) : e[n] = i : e[n] = [i, r[n]], e;
  }, {});
}
function Go(r) {
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
function ad(r) {
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
function od(r, t) {
  let {
    index: e,
    length: n
  } = r;
  return new Xn(e + t, n);
}
function k0(r) {
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
class Te {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = t, this.options = e;
  }
}
q(Te, "DEFAULTS", {});
const qs = "\uFEFF";
class Uc extends Zt {
  constructor(t, e) {
    super(t, e), this.contentNode = document.createElement("span"), this.contentNode.setAttribute("contenteditable", "false"), Array.from(this.domNode.childNodes).forEach((n) => {
      this.contentNode.appendChild(n);
    }), this.leftGuard = document.createTextNode(qs), this.rightGuard = document.createTextNode(qs), this.domNode.appendChild(this.leftGuard), this.domNode.appendChild(this.contentNode), this.domNode.appendChild(this.rightGuard);
  }
  index(t, e) {
    return t === this.leftGuard ? 0 : t === this.rightGuard ? 1 : super.index(t, e);
  }
  restore(t) {
    let e = null, n;
    const i = t.data.split(qs).join("");
    if (t === this.leftGuard)
      if (this.prev instanceof xe) {
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
    else t === this.rightGuard && (this.next instanceof xe ? (this.next.insertAt(0, i), e = {
      startNode: this.next.domNode,
      startOffset: i.length
    }) : (n = document.createTextNode(i), this.parent.insertBefore(this.scroll.create(n), this.next), e = {
      startNode: n,
      startOffset: i.length
    }));
    return t.data = qs, e;
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
class x0 {
  constructor(t, e) {
    q(this, "isComposing", !1);
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
    e && !(e instanceof Uc) && (this.emitter.emit(R.events.COMPOSITION_BEFORE_START, t), this.scroll.batchStart(), this.emitter.emit(R.events.COMPOSITION_START, t), this.isComposing = !0);
  }
  handleCompositionEnd(t) {
    this.emitter.emit(R.events.COMPOSITION_BEFORE_END, t), this.scroll.batchEnd(), this.emitter.emit(R.events.COMPOSITION_END, t), this.isComposing = !1;
  }
}
const Pi = class Pi {
  constructor(t, e) {
    q(this, "modules", {});
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
q(Pi, "DEFAULTS", {
  modules: {}
}), q(Pi, "themes", {
  default: Pi
});
let Gr = Pi;
const S0 = (r) => r.parentElement || r.getRootNode().host || null, A0 = (r) => {
  const t = r.getBoundingClientRect(), e = "offsetWidth" in r && Math.abs(t.width) / r.offsetWidth || 1, n = "offsetHeight" in r && Math.abs(t.height) / r.offsetHeight || 1;
  return {
    top: t.top,
    right: t.left + r.clientWidth * e,
    bottom: t.top + r.clientHeight * n,
    left: t.left
  };
}, _s = (r) => {
  const t = parseInt(r, 10);
  return Number.isNaN(t) ? 0 : t;
}, ld = (r, t, e, n, i, s) => r < e && t > n ? 0 : r < e ? -(e - r + i) : t > n ? t - r > n - e ? r + i - e : t - n + s : 0, E0 = (r, t) => {
  var s, a, o;
  const e = r.ownerDocument;
  let n = t, i = r;
  for (; i; ) {
    const l = i === e.body, c = l ? {
      top: 0,
      right: ((s = window.visualViewport) == null ? void 0 : s.width) ?? e.documentElement.clientWidth,
      bottom: ((a = window.visualViewport) == null ? void 0 : a.height) ?? e.documentElement.clientHeight,
      left: 0
    } : A0(i), d = getComputedStyle(i), f = ld(n.left, n.right, c.left, c.right, _s(d.scrollPaddingLeft), _s(d.scrollPaddingRight)), h = ld(n.top, n.bottom, c.top, c.bottom, _s(d.scrollPaddingTop), _s(d.scrollPaddingBottom));
    if (f || h)
      if (l)
        (o = e.defaultView) == null || o.scrollBy(f, h);
      else {
        const {
          scrollLeft: p,
          scrollTop: m
        } = i;
        h && (i.scrollTop += h), f && (i.scrollLeft += f);
        const b = i.scrollLeft - p, k = i.scrollTop - m;
        n = {
          left: n.left - b,
          top: n.top - k,
          right: n.right - b,
          bottom: n.bottom - k
        };
      }
    i = l || d.position === "fixed" ? null : S0(i);
  }
}, C0 = 100, T0 = ["block", "break", "cursor", "inline", "scroll", "text"], L0 = (r, t, e) => {
  const n = new Vr();
  return T0.forEach((i) => {
    const s = t.query(i);
    s && n.register(s);
  }), r.forEach((i) => {
    let s = t.query(i);
    s || e.error(`Cannot register "${i}" specified in "formats" config. Are you sure it was registered?`);
    let a = 0;
    for (; s; )
      if (n.register(s), s = "blotName" in s ? s.requiredContainer ?? null : null, a += 1, a > C0) {
        e.error(`Cycle detected in registering blot requiredContainer: "${i}"`);
        break;
      }
  }), n;
}, qr = un("quill"), zs = new Vr();
we.uiClass = "ql-ui";
const ge = class ge {
  static debug(t) {
    t === !0 && (t = "log"), un.level(t);
  }
  static find(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    return Bl.get(t) || zs.find(t, e);
  }
  static import(t) {
    return this.imports[t] == null && qr.error(`Cannot import ${t}. Are you sure it was registered?`), this.imports[t];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) != "string") {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = !!(!(arguments.length <= 1) && arguments[1]), n = "attrName" in t ? t.attrName : t.blotName;
      typeof n == "string" ? this.register(`formats/${n}`, t, e) : Object.keys(t).forEach((i) => {
        this.register(i, t[i], e);
      });
    } else {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = arguments.length <= 1 ? void 0 : arguments[1], n = !!(!(arguments.length <= 2) && arguments[2]);
      this.imports[t] != null && !n && qr.warn(`Overwriting ${t} with`, e), this.imports[t] = e, (t.startsWith("blots/") || t.startsWith("formats/")) && e && typeof e != "boolean" && e.blotName !== "abstract" && zs.register(e), typeof e.register == "function" && e.register(zs);
    }
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.options = D0(t, e), this.container = this.options.container, this.container == null) {
      qr.error("Invalid Quill container", t);
      return;
    }
    this.options.debug && ge.debug(this.options.debug);
    const n = this.container.innerHTML.trim();
    this.container.classList.add("ql-container"), this.container.innerHTML = "", Bl.set(this.container, this), this.root = this.addContainer("ql-editor"), this.root.classList.add("ql-blank"), this.emitter = new R();
    const i = Pc.blotName, s = this.options.registry.query(i);
    if (!s || !("blotName" in s))
      throw new Error(`Cannot initialize Quill without "${i}" blot`);
    if (this.scroll = new s(this.options.registry, this.root, {
      emitter: this.emitter
    }), this.editor = new v0(this.scroll), this.selection = new b0(this.scroll, this.emitter), this.composition = new x0(this.scroll, this.emitter), this.theme = new this.options.theme(this, this.options), this.keyboard = this.theme.addModule("keyboard"), this.clipboard = this.theme.addModule("clipboard"), this.history = this.theme.addModule("history"), this.uploader = this.theme.addModule("uploader"), this.theme.addModule("input"), this.theme.addModule("uiNode"), this.theme.init(), this.emitter.on(R.events.EDITOR_CHANGE, (a) => {
      a === R.events.TEXT_CHANGE && this.root.classList.toggle("ql-blank", this.editor.isBlank());
    }), this.emitter.on(R.events.SCROLL_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), d = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      pe.call(this, () => this.editor.update(null, o, d), a);
    }), this.emitter.on(R.events.SCROLL_EMBED_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), d = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      pe.call(this, () => {
        const f = new P().retain(a.offset(this)).retain({
          [a.statics.blotName]: o
        });
        return this.editor.update(f, [], d);
      }, ge.sources.USER);
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
    return [t, e, , n] = nn(t, e, n), pe.call(this, () => this.editor.deleteText(t, e), n, t, -1 * e);
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
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : R.sources.API;
    return pe.call(this, () => {
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
      return this.setSelection(i, R.sources.SILENT), s;
    }, n);
  }
  formatLine(t, e, n, i, s) {
    let a;
    return [t, e, a, s] = nn(
      t,
      e,
      // @ts-expect-error
      n,
      i,
      s
    ), pe.call(this, () => this.editor.formatLine(t, e, a), s, t, 0);
  }
  formatText(t, e, n, i, s) {
    let a;
    return [t, e, a, s] = nn(
      // @ts-expect-error
      t,
      e,
      n,
      i,
      s
    ), pe.call(this, () => this.editor.formatText(t, e, a), s, t, 0);
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
    return [t, e] = nn(t, e), this.editor.getContents(t, e);
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
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = nn(t, e), this.editor.getHTML(t, e);
  }
  getText() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 ? arguments[1] : void 0;
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = nn(t, e), this.editor.getText(t, e);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(t, e, n) {
    let i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ge.sources.API;
    return pe.call(this, () => this.editor.insertEmbed(t, e, n), i, t);
  }
  insertText(t, e, n, i, s) {
    let a;
    return [t, , a, s] = nn(t, 0, n, i, s), pe.call(this, () => this.editor.insertText(t, e, a), s, t, e.length);
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
    return [t, e, , n] = nn(t, e, n), pe.call(this, () => this.editor.removeFormat(t, e), n, t);
  }
  scrollRectIntoView(t) {
    E0(this.root, t);
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
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : R.sources.API;
    return pe.call(this, () => {
      t = new P(t);
      const n = this.getLength(), i = this.editor.deleteText(0, n), s = this.editor.insertContents(0, t), a = this.editor.deleteText(this.getLength() - 1, 1);
      return i.compose(s).compose(a);
    }, e);
  }
  setSelection(t, e, n) {
    t == null ? this.selection.setRange(null, e || ge.sources.API) : ([t, e, , n] = nn(t, e, n), this.selection.setRange(new Xn(Math.max(0, t), e), n), n !== R.sources.SILENT && this.scrollSelectionIntoView());
  }
  setText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : R.sources.API;
    const n = new P().insert(t);
    return this.setContents(n, e);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : R.sources.USER;
    const e = this.scroll.update(t);
    return this.selection.update(t), e;
  }
  updateContents(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : R.sources.API;
    return pe.call(this, () => (t = new P(t), this.editor.applyDelta(t)), e, !0);
  }
};
q(ge, "DEFAULTS", {
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
}), q(ge, "events", R.events), q(ge, "sources", R.sources), q(ge, "version", "2.0.3"), q(ge, "imports", {
  delta: P,
  parchment: J1,
  "core/module": Te,
  "core/theme": Gr
});
let D = ge;
function cd(r) {
  return typeof r == "string" ? document.querySelector(r) : r;
}
function Ko(r) {
  return Object.entries(r ?? {}).reduce((t, e) => {
    let [n, i] = e;
    return {
      ...t,
      [n]: i === !0 ? {} : i
    };
  }, {});
}
function ud(r) {
  return Object.fromEntries(Object.entries(r).filter((t) => t[1] !== void 0));
}
function D0(r, t) {
  const e = cd(r);
  if (!e)
    throw new Error("Invalid Quill container");
  const i = !t.theme || t.theme === D.DEFAULTS.theme ? Gr : D.import(`themes/${t.theme}`);
  if (!i)
    throw new Error(`Invalid theme ${t.theme}. Did you register it?`);
  const {
    modules: s,
    ...a
  } = D.DEFAULTS, {
    modules: o,
    ...l
  } = i.DEFAULTS;
  let c = Ko(t.modules);
  c != null && c.toolbar && c.toolbar.constructor !== Object && (c = {
    ...c,
    toolbar: {
      container: c.toolbar
    }
  });
  const d = An({}, Ko(s), Ko(o), c), f = {
    ...a,
    ...ud(l),
    ...ud(t)
  };
  let h = t.registry;
  return h ? t.formats && qr.warn('Ignoring "formats" option because "registry" is specified') : h = t.formats ? L0(t.formats, f.registry, qr) : f.registry, {
    ...f,
    registry: h,
    container: e,
    theme: i,
    modules: Object.entries(d).reduce((p, m) => {
      let [b, k] = m;
      if (!k) return p;
      const v = D.import(`modules/${b}`);
      return v == null ? (qr.error(`Cannot load ${b} module. Are you sure you registered it?`), p) : {
        ...p,
        // @ts-expect-error
        [b]: An({}, v.DEFAULTS || {}, k)
      };
    }, {}),
    bounds: cd(f.bounds)
  };
}
function pe(r, t, e, n) {
  if (!this.isEnabled() && t === R.sources.USER && !this.allowReadOnlyEdits)
    return new P();
  let i = e == null ? null : this.getSelection();
  const s = this.editor.delta, a = r();
  if (i != null && (e === !0 && (e = i.index), n == null ? i = dd(i, a, t) : n !== 0 && (i = dd(i, e, n, t)), this.setSelection(i, R.sources.SILENT)), a.length() > 0) {
    const o = [R.events.TEXT_CHANGE, a, s, t];
    this.emitter.emit(R.events.EDITOR_CHANGE, ...o), t !== R.sources.SILENT && this.emitter.emit(...o);
  }
  return a;
}
function nn(r, t, e, n, i) {
  let s = {};
  return typeof r.index == "number" && typeof r.length == "number" ? typeof t != "number" ? (i = n, n = e, e = t, t = r.length, r = r.index) : (t = r.length, r = r.index) : typeof t != "number" && (i = n, n = e, e = t, t = 0), typeof e == "object" ? (s = e, i = n) : typeof e == "string" && (n != null ? s[e] = n : i = e), i = i || R.sources.API, [r, t, s, i];
}
function dd(r, t, e, n) {
  const i = typeof e == "number" ? e : 0;
  if (r == null) return null;
  let s, a;
  return t && typeof t.transformPosition == "function" ? [s, a] = [r.index, r.index + r.length].map((o) => (
    // @ts-expect-error -- TODO: add a better type guard around `index`
    t.transformPosition(o, n !== R.sources.USER)
  )) : [s, a] = [r.index, r.index + r.length].map((o) => o < t || o === t && n === R.sources.USER ? o : i >= 0 ? o + i : Math.max(t, o + i)), new Xn(s, a - s);
}
class ir extends Ia {
}
function hd(r) {
  return r instanceof Et || r instanceof ae;
}
function fd(r) {
  return typeof r.updateContent == "function";
}
class Lr extends Pc {
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
    this.emitter.emit(R.events.SCROLL_BLOT_MOUNT, t);
  }
  emitUnmount(t) {
    this.emitter.emit(R.events.SCROLL_BLOT_UNMOUNT, t);
  }
  emitEmbedUpdate(t, e) {
    this.emitter.emit(R.events.SCROLL_EMBED_UPDATE, t, e);
  }
  deleteAt(t, e) {
    const [n, i] = this.line(t), [s] = this.line(t + e);
    if (super.deleteAt(t, e), s != null && n !== s && i > 0) {
      if (n instanceof ae || s instanceof ae) {
        this.optimize();
        return;
      }
      const a = s.children.head instanceof Ce ? null : s.children.head;
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
      const l = s.type === "block" && (s.delta.length() === 0 || !this.descendant(ae, t)[0] && t < this.length()), c = s.type === "block" ? s.delta : new P().insert({
        [s.key]: s.value
      });
      Wo(this, t, c);
      const d = s.type === "block" ? 1 : 0, f = t + c.length() + d;
      l && this.insertAt(f - 1, `
`);
      const h = re(this.line(t)[0]), p = oe.AttributeMap.diff(h, s.attributes) || {};
      Object.keys(p).forEach((m) => {
        this.formatAt(f - 1, 1, m, p[m]);
      }), t = f;
    }
    let [a, o] = this.children.find(t);
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
  leaf(t) {
    const e = this.path(t).pop();
    if (!e)
      return [null, -1];
    const [n, i] = e;
    return n instanceof Nt ? [n, i] : [null, -1];
  }
  line(t) {
    return t === this.length() ? this.line(t - 1) : this.descendant(hd, t);
  }
  lines() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const n = (i, s, a) => {
      let o = [], l = a;
      return i.children.forEachAt(s, a, (c, d, f) => {
        hd(c) ? o.push(c) : c instanceof Ia && (o = o.concat(n(c, d, l))), l -= f;
      }), o;
    };
    return n(this, t, e);
  }
  optimize() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.batch || (super.optimize(t, e), t.length > 0 && this.emitter.emit(R.events.SCROLL_OPTIMIZE, t, e));
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
    let e = R.sources.USER;
    typeof t == "string" && (e = t), Array.isArray(t) || (t = this.observer.takeRecords()), t = t.filter((n) => {
      let {
        target: i
      } = n;
      const s = this.find(i, !0);
      return s && !fd(s);
    }), t.length > 0 && this.emitter.emit(R.events.SCROLL_BEFORE_UPDATE, e, t), super.update(t.concat([])), t.length > 0 && this.emitter.emit(R.events.SCROLL_UPDATE, e, t);
  }
  updateEmbedAt(t, e, n) {
    const [i] = this.descendant((s) => s instanceof ae, t);
    i && i.statics.blotName === e && fd(i) && i.updateContent(n);
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
q(Lr, "blotName", "scroll"), q(Lr, "className", "ql-editor"), q(Lr, "tagName", "DIV"), q(Lr, "defaultChild", Et), q(Lr, "allowedChildren", [Et, ae, ir]);
function Wo(r, t, e) {
  e.reduce((n, i) => {
    const s = oe.Op.length(i);
    let a = i.attributes || {};
    if (i.insert != null) {
      if (typeof i.insert == "string") {
        const o = i.insert;
        r.insertAt(n, o);
        const [l] = r.descendant(Nt, n), c = re(l);
        a = oe.AttributeMap.diff(c, a) || {};
      } else if (typeof i.insert == "object") {
        const o = Object.keys(i.insert)[0];
        if (o == null) return n;
        if (r.insertAt(n, o, i.insert[o]), r.scroll.query(o, B.INLINE) != null) {
          const [c] = r.descendant(Nt, n), d = re(c);
          a = oe.AttributeMap.diff(d, a) || {};
        }
      }
    }
    return Object.keys(a).forEach((o) => {
      r.formatAt(n, s, o, a[o]);
    }), n + s;
  }, t);
}
const Hc = {
  scope: B.BLOCK,
  whitelist: ["right", "center", "justify"]
}, I0 = new Ue("align", "align", Hc), $f = new Ee("align", "ql-align", Hc), Ff = new In("align", "text-align", Hc);
class jf extends In {
  value(t) {
    let e = super.value(t);
    return e.startsWith("rgb(") ? (e = e.replace(/^[^\d]+/, "").replace(/[^\d]+$/, ""), `#${e.split(",").map((i) => `00${parseInt(i, 10).toString(16)}`.slice(-2)).join("")}`) : e;
  }
}
const N0 = new Ee("color", "ql-color", {
  scope: B.INLINE
}), Vc = new jf("color", "color", {
  scope: B.INLINE
}), O0 = new Ee("background", "ql-bg", {
  scope: B.INLINE
}), Yc = new jf("background", "background-color", {
  scope: B.INLINE
});
class sr extends ir {
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
${qa(this.code(t, e))}
</pre>`;
  }
}
class Ot extends Et {
  static register() {
    D.register(sr);
  }
}
q(Ot, "TAB", "  ");
class Gc extends He {
}
Gc.blotName = "code";
Gc.tagName = "CODE";
Ot.blotName = "code-block";
Ot.className = "ql-code-block";
Ot.tagName = "DIV";
sr.blotName = "code-block-container";
sr.className = "ql-code-block-container";
sr.tagName = "DIV";
sr.allowedChildren = [Ot];
Ot.allowedChildren = [xe, Ce, Yr];
Ot.requiredContainer = sr;
const Kc = {
  scope: B.BLOCK,
  whitelist: ["rtl"]
}, Uf = new Ue("direction", "dir", Kc), Hf = new Ee("direction", "ql-direction", Kc), Vf = new In("direction", "direction", Kc), Yf = {
  scope: B.INLINE,
  whitelist: ["serif", "monospace"]
}, Gf = new Ee("font", "ql-font", Yf);
class M0 extends In {
  value(t) {
    return super.value(t).replace(/["']/g, "");
  }
}
const Kf = new M0("font", "font-family", Yf), Wf = new Ee("size", "ql-size", {
  scope: B.INLINE,
  whitelist: ["small", "large", "huge"]
}), Qf = new In("size", "font-size", {
  scope: B.INLINE,
  whitelist: ["10px", "18px", "32px"]
}), q0 = un("quill:keyboard"), _0 = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
class _a extends Te {
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
    const i = R0(t);
    if (i == null) {
      q0.warn("Attempted to add invalid keyboard binding", i);
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
      const i = (this.bindings[t.key] || []).concat(this.bindings[t.which] || []).filter((v) => _a.match(t, v));
      if (i.length === 0) return;
      const s = D.find(t.target, !0);
      if (s && s.scroll !== this.quill.scroll) return;
      const a = this.quill.getSelection();
      if (a == null || !this.quill.hasFocus()) return;
      const [o, l] = this.quill.getLine(a.index), [c, d] = this.quill.getLeaf(a.index), [f, h] = a.length === 0 ? [c, d] : this.quill.getLeaf(a.index + a.length), p = c instanceof la ? c.value().slice(0, d) : "", m = f instanceof la ? f.value().slice(h) : "", b = {
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
        if (v.collapsed != null && v.collapsed !== b.collapsed || v.empty != null && v.empty !== b.empty || v.offset != null && v.offset !== b.offset)
          return !1;
        if (Array.isArray(v.format)) {
          if (v.format.every((S) => b.format[S] == null))
            return !1;
        } else if (typeof v.format == "object" && !Object.keys(v.format).every((S) => v.format[S] === !0 ? b.format[S] != null : v.format[S] === !1 ? b.format[S] == null : zc(v.format[S], b.format[S])))
          return !1;
        return v.prefix != null && !v.prefix.test(b.prefix) || v.suffix != null && !v.suffix.test(b.suffix) ? !1 : v.handler.call(this, a, b, v) !== !0;
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
        const c = s.formats(), d = this.quill.getFormat(t.index - 1, 1);
        if (i = oe.AttributeMap.diff(c, d) || {}, Object.keys(i).length > 0) {
          const f = new P().retain(t.index + s.length() - 2).retain(1, i);
          a = a.compose(f);
        }
      }
    }
    this.quill.updateContents(a, D.sources.USER), this.quill.focus();
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
        i = oe.AttributeMap.diff(l, c) || {}, Object.keys(i).length > 0 && (a = a.retain(o.length() - 1).retain(1, i));
      }
    }
    this.quill.updateContents(a, D.sources.USER), this.quill.focus();
  }
  handleDeleteRange(t) {
    Wc({
      range: t,
      quill: this.quill
    }), this.quill.focus();
  }
  handleEnter(t, e) {
    const n = Object.keys(e.format).reduce((s, a) => (this.quill.scroll.query(a, B.BLOCK) && !Array.isArray(e.format[a]) && (s[a] = e.format[a]), s), {}), i = new P().retain(t.index).delete(t.length).insert(`
`, n);
    this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(t.index + 1, D.sources.SILENT), this.quill.focus();
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
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "+1", D.sources.USER), !1);
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: !0,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "-1", D.sources.USER), !1);
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
        t.format.indent != null ? this.quill.format("indent", "-1", D.sources.USER) : t.format.list != null && this.quill.format("list", !1, D.sources.USER);
      }
    },
    "indent code-block": pd(!0),
    "outdent code-block": pd(!1),
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
      handler(r, t) {
        if (t.format.table) return !0;
        this.quill.history.cutoff();
        const e = new P().retain(r.index).delete(r.length).insert("	");
        return this.quill.updateContents(e, D.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index + 1, D.sources.SILENT), !1;
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
      handler(r, t) {
        const e = {
          list: !1
        };
        t.format.indent && (e.indent = !1), this.quill.formatLine(r.index, r.length, e, D.sources.USER);
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
        this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(r.index + 1, D.sources.SILENT), this.quill.scrollSelectionIntoView();
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
        const t = this.quill.getModule("table");
        if (t) {
          const [e, n, i, s] = t.getTable(r), a = P0(e, n, i, s);
          if (a == null) return;
          let o = e.offset();
          if (a < 0) {
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, D.sources.USER), this.quill.setSelection(r.index + 1, r.length, D.sources.SILENT);
          } else if (a > 0) {
            o += e.length();
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
      handler(r, t) {
        const {
          event: e,
          line: n
        } = t, i = n.offset(this.quill.scroll);
        e.shiftKey ? this.quill.setSelection(i - 1, D.sources.USER) : this.quill.setSelection(i + n.length(), D.sources.USER);
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
        this.quill.insertText(r.index, " ", D.sources.USER), this.quill.history.cutoff();
        const a = new P().retain(r.index - i).delete(e + 1).retain(n.length() - 2 - i).retain(1, {
          list: s
        });
        return this.quill.updateContents(a, D.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index - e, D.sources.SILENT), !1;
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
            return this.quill.updateContents(s, D.sources.USER), this.quill.setSelection(r.index - 1, D.sources.SILENT), !1;
          }
        return !0;
      }
    },
    "embed left": Rs("ArrowLeft", !1),
    "embed left shift": Rs("ArrowLeft", !0),
    "embed right": Rs("ArrowRight", !1),
    "embed right shift": Rs("ArrowRight", !0),
    "table down": gd(!1),
    "table up": gd(!0)
  }
};
_a.DEFAULTS = z0;
function pd(r) {
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
        this.quill.insertText(t.index, s, D.sources.USER), this.quill.setSelection(t.index + s.length, D.sources.SILENT);
        return;
      }
      const a = t.length === 0 ? this.quill.getLines(t.index, 1) : this.quill.getLines(t);
      let {
        index: o,
        length: l
      } = t;
      a.forEach((c, d) => {
        r ? (c.insertAt(0, s), d === 0 ? o += s.length : l += s.length) : c.domNode.textContent.startsWith(s) && (c.deleteAt(0, s.length), d === 0 ? o -= s.length : l -= s.length);
      }), this.quill.update(D.sources.USER), this.quill.setSelection(o, l, D.sources.SILENT);
    }
  };
}
function Rs(r, t) {
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
      return s instanceof Zt ? (r === "ArrowLeft" ? t ? this.quill.setSelection(n.index - 1, n.length + 1, D.sources.USER) : this.quill.setSelection(n.index - 1, D.sources.USER) : t ? this.quill.setSelection(n.index, n.length + 1, D.sources.USER) : this.quill.setSelection(n.index + n.length + 1, D.sources.USER), !1) : !0;
    }
  };
}
function Qo(r) {
  return {
    key: r[0],
    shortKey: !0,
    handler(t, e) {
      this.quill.format(r, !e.format[r], D.sources.USER);
    }
  };
}
function gd(r) {
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
function Wc(r) {
  let {
    quill: t,
    range: e
  } = r;
  const n = t.getLines(e);
  let i = {};
  if (n.length > 1) {
    const s = n[0].formats(), a = n[n.length - 1].formats();
    i = oe.AttributeMap.diff(a, s) || {};
  }
  t.deleteText(e, D.sources.USER), Object.keys(i).length > 0 && t.formatLine(e.index, 1, i, D.sources.USER), t.setSelection(e.index, D.sources.SILENT);
}
function P0(r, t, e, n) {
  return t.prev == null && t.next == null ? e.prev == null && e.next == null ? n === 0 ? -1 : 1 : e.prev == null ? -1 : 1 : t.prev == null ? -1 : t.next == null ? 1 : null;
}
const B0 = /font-weight:\s*normal/, $0 = ["P", "OL", "UL"], md = (r) => r && $0.includes(r.tagName), F0 = (r) => {
  Array.from(r.querySelectorAll("br")).filter((t) => md(t.previousElementSibling) && md(t.nextElementSibling)).forEach((t) => {
    var e;
    (e = t.parentNode) == null || e.removeChild(t);
  });
}, j0 = (r) => {
  Array.from(r.querySelectorAll('b[style*="font-weight"]')).filter((t) => {
    var e;
    return (e = t.getAttribute("style")) == null ? void 0 : e.match(B0);
  }).forEach((t) => {
    var n;
    const e = r.createDocumentFragment();
    e.append(...t.childNodes), (n = t.parentNode) == null || n.replaceChild(e, t);
  });
};
function U0(r) {
  r.querySelector('[id^="docs-internal-guid-"]') && (j0(r), F0(r));
}
const H0 = /\bmso-list:[^;]*ignore/i, V0 = /\bmso-list:[^;]*\bl(\d+)/i, Y0 = /\bmso-list:[^;]*\blevel(\d+)/i, G0 = (r, t) => {
  const e = r.getAttribute("style"), n = e == null ? void 0 : e.match(V0);
  if (!n)
    return null;
  const i = Number(n[1]), s = e == null ? void 0 : e.match(Y0), a = s ? Number(s[1]) : 1, o = new RegExp(`@list l${i}:level${a}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i"), l = t.match(o), c = l && l[1] === "bullet" ? "bullet" : "ordered";
  return {
    id: i,
    indent: a,
    type: c,
    element: r
  };
}, K0 = (r) => {
  var a, o;
  const t = Array.from(r.querySelectorAll("[style*=mso-list]")), e = [], n = [];
  t.forEach((l) => {
    (l.getAttribute("style") || "").match(H0) ? e.push(l) : n.push(l);
  }), e.forEach((l) => {
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
    l.forEach((p) => {
      const m = document.createElement("li");
      m.setAttribute("data-list", p.type), p.indent > 1 && m.setAttribute("class", `ql-indent-${p.indent - 1}`), m.innerHTML = p.element.innerHTML, d.appendChild(m);
    });
    const f = (o = l[0]) == null ? void 0 : o.element, {
      parentNode: h
    } = f ?? {};
    f && (h == null || h.replaceChild(d, f)), l.slice(1).forEach((p) => {
      let {
        element: m
      } = p;
      h == null || h.removeChild(m);
    });
  }
};
function W0(r) {
  r.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word" && K0(r);
}
const Q0 = [W0, U0], Z0 = (r) => {
  r.documentElement && Q0.forEach((t) => {
    t(r);
  });
}, X0 = un("quill:clipboard"), J0 = [[Node.TEXT_NODE, dw], [Node.TEXT_NODE, yd], ["br", iw], [Node.ELEMENT_NODE, yd], [Node.ELEMENT_NODE, rw], [Node.ELEMENT_NODE, nw], [Node.ELEMENT_NODE, cw], ["li", ow], ["ol, ul", lw], ["pre", sw], ["tr", uw], ["b", Zo("bold")], ["i", Zo("italic")], ["strike", Zo("strike")], ["style", aw]], tw = [I0, Uf].reduce((r, t) => (r[t.keyName] = t, r), {}), bd = [Ff, Yc, Vc, Vf, Kf, Qf].reduce((r, t) => (r[t.keyName] = t, r), {});
class Zf extends Te {
  constructor(t, e) {
    super(t, e), this.quill.root.addEventListener("copy", (n) => this.onCaptureCopy(n, !1)), this.quill.root.addEventListener("cut", (n) => this.onCaptureCopy(n, !0)), this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this)), this.matchers = [], J0.concat(this.options.matchers ?? []).forEach((n) => {
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
    if (i[Ot.blotName])
      return new P().insert(n || "", {
        [Ot.blotName]: i[Ot.blotName]
      });
    if (!e)
      return new P().insert(n || "", i);
    const s = this.convertHTML(e);
    return ns(s, `
`) && (s.ops[s.ops.length - 1].attributes == null || i.table) ? s.compose(new P().retain(s.length() - 1).delete(1)) : s;
  }
  normalizeHTML(t) {
    Z0(t);
  }
  convertHTML(t) {
    const e = new DOMParser().parseFromString(t, "text/html");
    this.normalizeHTML(e);
    const n = e.body, i = /* @__PURE__ */ new WeakMap(), [s, a] = this.prepareMatching(n, i);
    return Qc(this.quill.scroll, n, s, a, i);
  }
  dangerouslyPasteHTML(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : D.sources.API;
    if (typeof t == "string") {
      const i = this.convert({
        html: t,
        text: ""
      });
      this.quill.setContents(i, e), this.quill.setSelection(0, D.sources.SILENT);
    } else {
      const i = this.convert({
        html: e,
        text: ""
      });
      this.quill.updateContents(new P().retain(t).concat(i), n), this.quill.setSelection(t + i.length(), D.sources.SILENT);
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
    (a = t.clipboardData) == null || a.setData("text/plain", s), (o = t.clipboardData) == null || o.setData("text/html", i), e && Wc({
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
    var a, o, l, c, d;
    if (t.defaultPrevented || !this.quill.isEnabled()) return;
    t.preventDefault();
    const e = this.quill.getSelection(!0);
    if (e == null) return;
    const n = (a = t.clipboardData) == null ? void 0 : a.getData("text/html");
    let i = (o = t.clipboardData) == null ? void 0 : o.getData("text/plain");
    if (!n && !i) {
      const f = (l = t.clipboardData) == null ? void 0 : l.getData("text/uri-list");
      f && (i = this.normalizeURIList(f));
    }
    const s = Array.from(((c = t.clipboardData) == null ? void 0 : c.files) || []);
    if (!n && s.length > 0) {
      this.quill.uploader.upload(e, s);
      return;
    }
    if (n && s.length > 0) {
      const f = new DOMParser().parseFromString(n, "text/html");
      if (f.body.childElementCount === 1 && ((d = f.body.firstElementChild) == null ? void 0 : d.tagName) === "IMG") {
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
    X0.log("onPaste", a, {
      text: n,
      html: i
    });
    const o = new P().retain(t.index).delete(t.length).concat(a);
    this.quill.updateContents(o, D.sources.USER), this.quill.setSelection(o.length() - t.length, D.sources.SILENT), this.quill.scrollSelectionIntoView();
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
q(Zf, "DEFAULTS", {
  matchers: []
});
function ar(r, t, e, n) {
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
function ns(r, t) {
  let e = "";
  for (let n = r.ops.length - 1; n >= 0 && e.length < t.length; --n) {
    const i = r.ops[n];
    if (typeof i.insert != "string") break;
    e = i.insert + e;
  }
  return e.slice(-1 * t.length) === t;
}
function xn(r, t) {
  if (!(r instanceof Element)) return !1;
  const e = t.query(r);
  return e && e.prototype instanceof Zt ? !1 : ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(r.tagName.toLowerCase());
}
function ew(r, t) {
  return r.previousElementSibling && r.nextElementSibling && !xn(r.previousElementSibling, t) && !xn(r.nextElementSibling, t);
}
const Ps = /* @__PURE__ */ new WeakMap();
function Xf(r) {
  return r == null ? !1 : (Ps.has(r) || (r.tagName === "PRE" ? Ps.set(r, !0) : Ps.set(r, Xf(r.parentNode))), Ps.get(r));
}
function Qc(r, t, e, n, i) {
  return t.nodeType === t.TEXT_NODE ? n.reduce((s, a) => a(t, s, r), new P()) : t.nodeType === t.ELEMENT_NODE ? Array.from(t.childNodes || []).reduce((s, a) => {
    let o = Qc(r, a, e, n, i);
    return a.nodeType === t.ELEMENT_NODE && (o = e.reduce((l, c) => c(a, l, r), o), o = (i.get(a) || []).reduce((l, c) => c(a, l, r), o)), s.concat(o);
  }, new P()) : new P();
}
function Zo(r) {
  return (t, e, n) => ar(e, r, !0, n);
}
function nw(r, t, e) {
  const n = Ue.keys(r), i = Ee.keys(r), s = In.keys(r), a = {};
  return n.concat(i).concat(s).forEach((o) => {
    let l = e.query(o, B.ATTRIBUTE);
    l != null && (a[l.attrName] = l.value(r), a[l.attrName]) || (l = tw[o], l != null && (l.attrName === o || l.keyName === o) && (a[l.attrName] = l.value(r) || void 0), l = bd[o], l != null && (l.attrName === o || l.keyName === o) && (l = bd[o], a[l.attrName] = l.value(r) || void 0));
  }), Object.entries(a).reduce((o, l) => {
    let [c, d] = l;
    return ar(o, c, d, e);
  }, t);
}
function rw(r, t, e) {
  const n = e.query(r);
  if (n == null) return t;
  if (n.prototype instanceof Zt) {
    const i = {}, s = n.value(r);
    if (s != null)
      return i[n.blotName] = s, new P().insert(i, n.formats(r, e));
  } else if (n.prototype instanceof Vi && !ns(t, `
`) && t.insert(`
`), "blotName" in n && "formats" in n && typeof n.formats == "function")
    return ar(t, n.blotName, n.formats(r, e), e);
  return t;
}
function iw(r, t) {
  return ns(t, `
`) || t.insert(`
`), t;
}
function sw(r, t, e) {
  const n = e.query("code-block"), i = n && "formats" in n && typeof n.formats == "function" ? n.formats(r, e) : !0;
  return ar(t, "code-block", i, e);
}
function aw() {
  return new P();
}
function ow(r, t, e) {
  const n = e.query(r);
  if (n == null || // @ts-expect-error
  n.blotName !== "list" || !ns(t, `
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
function lw(r, t, e) {
  const n = r;
  let i = n.tagName === "OL" ? "ordered" : "bullet";
  const s = n.getAttribute("data-checked");
  return s && (i = s === "true" ? "checked" : "unchecked"), ar(t, "list", i, e);
}
function yd(r, t, e) {
  if (!ns(t, `
`)) {
    if (xn(r, e) && (r.childNodes.length > 0 || r instanceof HTMLParagraphElement))
      return t.insert(`
`);
    if (t.length() > 0 && r.nextSibling) {
      let n = r.nextSibling;
      for (; n != null; ) {
        if (xn(n, e))
          return t.insert(`
`);
        const i = e.query(n);
        if (i && i.prototype instanceof ae)
          return t.insert(`
`);
        n = n.firstChild;
      }
    }
  }
  return t;
}
function cw(r, t, e) {
  var s;
  const n = {}, i = r.style || {};
  return i.fontStyle === "italic" && (n.italic = !0), i.textDecoration === "underline" && (n.underline = !0), i.textDecoration === "line-through" && (n.strike = !0), ((s = i.fontWeight) != null && s.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(i.fontWeight, 10) >= 700) && (n.bold = !0), t = Object.entries(n).reduce((a, o) => {
    let [l, c] = o;
    return ar(a, l, c, e);
  }, t), parseFloat(i.textIndent || 0) > 0 ? new P().insert("	").concat(t) : t;
}
function uw(r, t, e) {
  var i, s;
  const n = ((i = r.parentElement) == null ? void 0 : i.tagName) === "TABLE" ? r.parentElement : (s = r.parentElement) == null ? void 0 : s.parentElement;
  if (n != null) {
    const o = Array.from(n.querySelectorAll("tr")).indexOf(r) + 1;
    return ar(t, "table", o, e);
  }
  return t;
}
function dw(r, t, e) {
  var i;
  let n = r.data;
  if (((i = r.parentElement) == null ? void 0 : i.tagName) === "O:P")
    return t.insert(n.trim());
  if (!Xf(r)) {
    if (n.trim().length === 0 && n.includes(`
`) && !ew(r, e))
      return t;
    n = n.replace(/[^\S\u00a0]/g, " "), n = n.replace(/ {2,}/g, " "), (r.previousSibling == null && r.parentElement != null && xn(r.parentElement, e) || r.previousSibling instanceof Element && xn(r.previousSibling, e)) && (n = n.replace(/^ /, "")), (r.nextSibling == null && r.parentElement != null && xn(r.parentElement, e) || r.nextSibling instanceof Element && xn(r.nextSibling, e)) && (n = n.replace(/ $/, "")), n = n.replaceAll(" ", " ");
  }
  return t.insert(n);
}
class Jf extends Te {
  constructor(e, n) {
    super(e, n);
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
  change(e, n) {
    if (this.stack[e].length === 0) return;
    const i = this.stack[e].pop();
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
    vd(this.stack.undo, e), vd(this.stack.redo, e);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(e) {
    if (e.range)
      this.quill.setSelection(e.range, D.sources.USER);
    else {
      const n = fw(this.quill.scroll, e.delta);
      this.quill.setSelection(n, D.sources.USER);
    }
  }
}
q(Jf, "DEFAULTS", {
  delay: 1e3,
  maxStack: 100,
  userOnly: !1
});
function vd(r, t) {
  let e = t;
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = r[n];
    r[n] = {
      delta: e.transform(i.delta, !0),
      range: i.range && jl(i.range, e)
    }, e = i.delta.transform(e), r[n].delta.length() === 0 && r.splice(n, 1);
  }
}
function hw(r, t) {
  const e = t.ops[t.ops.length - 1];
  return e == null ? !1 : e.insert != null ? typeof e.insert == "string" && e.insert.endsWith(`
`) : e.attributes != null ? Object.keys(e.attributes).some((n) => r.query(n, B.BLOCK) != null) : !1;
}
function fw(r, t) {
  const e = t.reduce((i, s) => i + (s.delete || 0), 0);
  let n = t.length() - e;
  return hw(r, t) && (n -= 1), n;
}
function jl(r, t) {
  if (!r) return r;
  const e = t.transformPosition(r.index), n = t.transformPosition(r.index + r.length);
  return {
    index: e,
    length: n - e
  };
}
class tp extends Te {
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
tp.DEFAULTS = {
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
      this.quill.updateContents(i, R.sources.USER), this.quill.setSelection(r.index + n.length, R.sources.SILENT);
    });
  }
};
const pw = ["insertText", "insertReplacementText"];
class gw extends Te {
  constructor(t, e) {
    super(t, e), t.root.addEventListener("beforeinput", (n) => {
      this.handleBeforeInput(n);
    }), /Android/i.test(navigator.userAgent) || t.on(D.events.COMPOSITION_BEFORE_START, () => {
      this.handleCompositionStart();
    });
  }
  deleteRange(t) {
    Wc({
      range: t,
      quill: this.quill
    });
  }
  replaceText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (t.length === 0) return !1;
    if (e) {
      const n = this.quill.getFormat(t.index, 1);
      this.deleteRange(t), this.quill.updateContents(new P().retain(t.index).insert(e, n), D.sources.USER);
    } else
      this.deleteRange(t);
    return this.quill.setSelection(t.index + e.length, 0, D.sources.SILENT), !0;
  }
  handleBeforeInput(t) {
    if (this.quill.composition.isComposing || t.defaultPrevented || !pw.includes(t.inputType))
      return;
    const e = t.getTargetRanges ? t.getTargetRanges()[0] : null;
    if (!e || e.collapsed === !0)
      return;
    const n = mw(t);
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
function mw(r) {
  var t;
  return typeof r.data == "string" ? r.data : (t = r.dataTransfer) != null && t.types.includes("text/plain") ? r.dataTransfer.getData("text/plain") : null;
}
const bw = /Mac/i.test(navigator.platform), yw = 100, vw = (r) => !!(r.key === "ArrowLeft" || r.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
r.key === "ArrowUp" || r.key === "ArrowDown" || r.key === "Home" || bw && r.key === "a" && r.ctrlKey === !0);
class ww extends Te {
  constructor(e, n) {
    super(e, n);
    q(this, "isListening", !1);
    q(this, "selectionChangeDeadline", 0);
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
        if (!(i instanceof we) || !i.uiNode)
          return !0;
        const a = getComputedStyle(i.domNode).direction === "rtl";
        return a && s.key !== "ArrowRight" || !a && s.key !== "ArrowLeft" ? !0 : (this.quill.setSelection(e.index - 1, e.length + (s.shiftKey ? 1 : 0), D.sources.USER), !1);
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (e) => {
      !e.defaultPrevented && vw(e) && this.ensureListeningToSelectionChange();
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
    if (!(i instanceof we) || !i.uiNode) return;
    const s = document.createRange();
    s.setStartAfter(i.uiNode), s.setEndAfter(i.uiNode), e.removeAllRanges(), e.addRange(s);
  }
}
D.register({
  "blots/block": Et,
  "blots/block/embed": ae,
  "blots/break": Ce,
  "blots/container": ir,
  "blots/cursor": Yr,
  "blots/embed": Uc,
  "blots/inline": He,
  "blots/scroll": Lr,
  "blots/text": xe,
  "modules/clipboard": Zf,
  "modules/history": Jf,
  "modules/keyboard": _a,
  "modules/uploader": tp,
  "modules/input": gw,
  "modules/uiNode": ww
});
class kw extends Ee {
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
const xw = new kw("indent", "ql-indent", {
  scope: B.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
class Ul extends Et {
}
q(Ul, "blotName", "blockquote"), q(Ul, "tagName", "blockquote");
class Hl extends Et {
  static formats(t) {
    return this.tagName.indexOf(t.tagName) + 1;
  }
}
q(Hl, "blotName", "header"), q(Hl, "tagName", ["H1", "H2", "H3", "H4", "H5", "H6"]);
class rs extends ir {
}
rs.blotName = "list-container";
rs.tagName = "OL";
class is extends Et {
  static create(t) {
    const e = super.create();
    return e.setAttribute("data-list", t), e;
  }
  static formats(t) {
    return t.getAttribute("data-list") || void 0;
  }
  static register() {
    D.register(rs);
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
is.blotName = "list";
is.tagName = "LI";
rs.allowedChildren = [is];
is.requiredContainer = rs;
class Ki extends He {
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
q(Ki, "blotName", "bold"), q(Ki, "tagName", ["STRONG", "B"]);
class Vl extends Ki {
}
q(Vl, "blotName", "italic"), q(Vl, "tagName", ["EM", "I"]);
class Sn extends He {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("href", this.sanitize(t)), e.setAttribute("rel", "noopener noreferrer"), e.setAttribute("target", "_blank"), e;
  }
  static formats(t) {
    return t.getAttribute("href");
  }
  static sanitize(t) {
    return ep(t, this.PROTOCOL_WHITELIST) ? t : this.SANITIZED_URL;
  }
  format(t, e) {
    t !== this.statics.blotName || !e ? super.format(t, e) : this.domNode.setAttribute("href", this.constructor.sanitize(e));
  }
}
q(Sn, "blotName", "link"), q(Sn, "tagName", "A"), q(Sn, "SANITIZED_URL", "about:blank"), q(Sn, "PROTOCOL_WHITELIST", ["http", "https", "mailto", "tel", "sms"]);
function ep(r, t) {
  const e = document.createElement("a");
  e.href = r;
  const n = e.href.slice(0, e.href.indexOf(":"));
  return t.indexOf(n) > -1;
}
class Yl extends He {
  static create(t) {
    return t === "super" ? document.createElement("sup") : t === "sub" ? document.createElement("sub") : super.create(t);
  }
  static formats(t) {
    if (t.tagName === "SUB") return "sub";
    if (t.tagName === "SUP") return "super";
  }
}
q(Yl, "blotName", "script"), q(Yl, "tagName", ["SUB", "SUP"]);
class Gl extends Ki {
}
q(Gl, "blotName", "strike"), q(Gl, "tagName", ["S", "STRIKE"]);
class Kl extends He {
}
q(Kl, "blotName", "underline"), q(Kl, "tagName", "U");
class Qs extends Uc {
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
q(Qs, "blotName", "formula"), q(Qs, "className", "ql-formula"), q(Qs, "tagName", "SPAN");
const wd = ["alt", "height", "width"];
var Ks;
let Sw = (Ks = class extends Zt {
  static create(t) {
    const e = super.create(t);
    return typeof t == "string" && e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return wd.reduce((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e), {});
  }
  static match(t) {
    return /\.(jpe?g|gif|png)$/.test(t) || /^data:image\/.+;base64/.test(t);
  }
  static sanitize(t) {
    return ep(t, ["http", "https", "data"]) ? t : "//:0";
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    wd.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
}, q(Ks, "blotName", "image"), q(Ks, "tagName", "IMG"), Ks);
const kd = ["height", "width"];
class Zs extends ae {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("frameborder", "0"), e.setAttribute("allowfullscreen", "true"), e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return kd.reduce((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e), {});
  }
  static sanitize(t) {
    return Sn.sanitize(t);
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    kd.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
  html() {
    const {
      video: t
    } = this.value();
    return `<a href="${t}">${t}</a>`;
  }
}
q(Zs, "blotName", "video"), q(Zs, "className", "ql-video"), q(Zs, "tagName", "IFRAME");
const Ci = new Ee("code-token", "hljs", {
  scope: B.INLINE
});
class an extends He {
  static formats(t, e) {
    for (; t != null && t !== e.domNode; ) {
      if (t.classList && t.classList.contains(Ot.className))
        return super.formats(t, e);
      t = t.parentNode;
    }
  }
  constructor(t, e, n) {
    super(t, e, n), Ci.add(this.domNode, n);
  }
  format(t, e) {
    t !== an.blotName ? super.format(t, e) : e ? Ci.add(this.domNode, e) : (Ci.remove(this.domNode), this.domNode.classList.remove(this.statics.className));
  }
  optimize() {
    super.optimize(...arguments), Ci.value(this.domNode) || this.unwrap();
  }
}
an.blotName = "code-token";
an.className = "ql-token";
class ie extends Ot {
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
    return this.formatAt(0, this.length(), an.blotName, !1), super.replaceWith(t, e);
  }
}
class Mi extends sr {
  attach() {
    super.attach(), this.forceNext = !1, this.scroll.emitMount(this);
  }
  format(t, e) {
    t === ie.blotName && (this.forceNext = !0, this.children.forEach((n) => {
      n.format(t, e);
    }));
  }
  formatAt(t, e, n, i) {
    n === ie.blotName && (this.forceNext = !0), super.formatAt(t, e, n, i);
  }
  highlight(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.children.head == null) return;
    const i = `${Array.from(this.domNode.childNodes).filter((a) => a !== this.uiNode).map((a) => a.textContent).join(`
`)}
`, s = ie.formats(this.children.head.domNode);
    if (e || this.forceNext || this.cachedText !== i) {
      if (i.trim().length > 0 || this.cachedText == null) {
        const a = this.children.reduce((l, c) => l.concat(Rf(c, !1)), new P()), o = t(i, s);
        a.diff(o).reduce((l, c) => {
          let {
            retain: d,
            attributes: f
          } = c;
          return d ? (f && Object.keys(f).forEach((h) => {
            [ie.blotName, an.blotName].includes(h) && this.formatAt(l, d, h, f[h]);
          }), l + d) : l;
        }, 0);
      }
      this.cachedText = i, this.forceNext = !1;
    }
  }
  html(t, e) {
    const [n] = this.children.find(t);
    return `<pre data-language="${n ? ie.formats(n.domNode) : "plain"}">
${qa(this.code(t, e))}
</pre>`;
  }
  optimize(t) {
    if (super.optimize(t), this.parent != null && this.children.head != null && this.uiNode != null) {
      const e = ie.formats(this.children.head.domNode);
      e !== this.uiNode.value && (this.uiNode.value = e);
    }
  }
}
Mi.allowedChildren = [ie];
ie.requiredContainer = Mi;
ie.allowedChildren = [an, Yr, xe, Ce];
const Aw = (r, t, e) => {
  if (typeof r.versionString == "string") {
    const n = r.versionString.split(".")[0];
    if (parseInt(n, 10) >= 11)
      return r.highlight(e, {
        language: t
      }).value;
  }
  return r.highlight(t, e).value;
};
class np extends Te {
  static register() {
    D.register(an, !0), D.register(ie, !0), D.register(Mi, !0);
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
    this.quill.on(D.events.SCROLL_BLOT_MOUNT, (t) => {
      if (!(t instanceof Mi)) return;
      const e = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach((n) => {
        let {
          key: i,
          label: s
        } = n;
        const a = e.ownerDocument.createElement("option");
        a.textContent = s, a.setAttribute("value", i), e.appendChild(a);
      }), e.addEventListener("change", () => {
        t.format(ie.blotName, e.value), this.quill.root.focus(), this.highlight(t, !0);
      }), t.uiNode == null && (t.attachUI(e), t.children.head && (e.value = ie.formats(t.children.head.domNode)));
    });
  }
  initTimer() {
    let t = null;
    this.quill.on(D.events.SCROLL_OPTIMIZE, () => {
      t && clearTimeout(t), t = setTimeout(() => {
        this.highlight(), t = null;
      }, this.options.interval);
    });
  }
  highlight() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.quill.selection.composing) return;
    this.quill.update(D.sources.USER);
    const n = this.quill.getSelection();
    (t == null ? this.quill.scroll.descendants(Mi) : [t]).forEach((s) => {
      s.highlight(this.highlightBlot, e);
    }), this.quill.update(D.sources.SILENT), n != null && this.quill.setSelection(n, D.sources.SILENT);
  }
  highlightBlot(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
    if (e = this.languages[e] ? e : "plain", e === "plain")
      return qa(t).split(`
`).reduce((i, s, a) => (a !== 0 && i.insert(`
`, {
        [Ot.blotName]: e
      }), i.insert(s)), new P());
    const n = this.quill.root.ownerDocument.createElement("div");
    return n.classList.add(Ot.className), n.innerHTML = Aw(this.options.hljs, e, t), Qc(this.quill.scroll, n, [(i, s) => {
      const a = Ci.value(i);
      return a ? s.compose(new P().retain(s.length(), {
        [an.blotName]: a
      })) : s;
    }], [(i, s) => i.data.split(`
`).reduce((a, o, l) => (l !== 0 && a.insert(`
`, {
      [Ot.blotName]: e
    }), a.insert(o)), s)], /* @__PURE__ */ new WeakMap());
  }
}
np.DEFAULTS = {
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
const Bi = class Bi extends Et {
  static create(t) {
    const e = super.create();
    return t ? e.setAttribute("data-row", t) : e.setAttribute("data-row", Zc()), e;
  }
  static formats(t) {
    if (t.hasAttribute("data-row"))
      return t.getAttribute("data-row");
  }
  cellOffset() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  format(t, e) {
    t === Bi.blotName && e ? this.domNode.setAttribute("data-row", e) : super.format(t, e);
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
let ye = Bi;
class on extends ir {
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
q(on, "blotName", "table-row"), q(on, "tagName", "TR");
class je extends ir {
}
q(je, "blotName", "table-body"), q(je, "tagName", "TBODY");
class Kr extends ir {
  balanceCells() {
    const t = this.descendants(on), e = t.reduce((n, i) => Math.max(i.children.length, n), 0);
    t.forEach((n) => {
      new Array(e - n.children.length).fill(0).forEach(() => {
        let i;
        n.children.head != null && (i = ye.formats(n.children.head.domNode));
        const s = this.scroll.create(ye.blotName, i);
        n.appendChild(s), s.optimize();
      });
    });
  }
  cells(t) {
    return this.rows().map((e) => e.children.at(t));
  }
  deleteColumn(t) {
    const [e] = this.descendant(je);
    e == null || e.children.head == null || e.children.forEach((n) => {
      const i = n.children.at(t);
      i != null && i.remove();
    });
  }
  insertColumn(t) {
    const [e] = this.descendant(je);
    e == null || e.children.head == null || e.children.forEach((n) => {
      const i = n.children.at(t), s = ye.formats(n.children.head.domNode), a = this.scroll.create(ye.blotName, s);
      n.insertBefore(a, i);
    });
  }
  insertRow(t) {
    const [e] = this.descendant(je);
    if (e == null || e.children.head == null) return;
    const n = Zc(), i = this.scroll.create(on.blotName);
    e.children.head.children.forEach(() => {
      const a = this.scroll.create(ye.blotName, n);
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
q(Kr, "blotName", "table-container"), q(Kr, "tagName", "TABLE");
Kr.allowedChildren = [je];
je.requiredContainer = Kr;
je.allowedChildren = [on];
on.requiredContainer = je;
on.allowedChildren = [ye];
ye.requiredContainer = on;
function Zc() {
  return `row-${Math.random().toString(36).slice(2, 6)}`;
}
class Ew extends Te {
  static register() {
    D.register(ye), D.register(on), D.register(je), D.register(Kr);
  }
  constructor() {
    super(...arguments), this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(Kr).forEach((t) => {
      t.balanceCells();
    });
  }
  deleteColumn() {
    const [t, , e] = this.getTable();
    e != null && (t.deleteColumn(e.cellOffset()), this.quill.update(D.sources.USER));
  }
  deleteRow() {
    const [, t] = this.getTable();
    t != null && (t.remove(), this.quill.update(D.sources.USER));
  }
  deleteTable() {
    const [t] = this.getTable();
    if (t == null) return;
    const e = t.offset();
    t.remove(), this.quill.update(D.sources.USER), this.quill.setSelection(e, D.sources.SILENT);
  }
  getTable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
    if (t == null) return [null, null, null, -1];
    const [e, n] = this.quill.getLine(t.index);
    if (e == null || e.statics.blotName !== ye.blotName)
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
    n.insertColumn(a + t), this.quill.update(D.sources.USER);
    let o = i.rowOffset();
    t === 0 && (o += 1), this.quill.setSelection(e.index + o, e.length, D.sources.SILENT);
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
    n.insertRow(a + t), this.quill.update(D.sources.USER), t > 0 ? this.quill.setSelection(e, D.sources.SILENT) : this.quill.setSelection(e.index + i.children.length, e.length, D.sources.SILENT);
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
        table: Zc()
      });
    }, new P().retain(n.index));
    this.quill.updateContents(i, D.sources.USER), this.quill.setSelection(n.index, D.sources.SILENT), this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(D.events.SCROLL_OPTIMIZE, (t) => {
      t.some((e) => ["TD", "TR", "TBODY", "TABLE"].includes(e.target.tagName) ? (this.quill.once(D.events.TEXT_CHANGE, (n, i, s) => {
        s === D.sources.USER && this.balanceTables();
      }), !0) : !1);
    });
  }
}
const xd = un("quill:toolbar");
class Xc extends Te {
  constructor(t, e) {
    var n, i;
    if (super(t, e), Array.isArray(this.options.container)) {
      const s = document.createElement("div");
      s.setAttribute("role", "toolbar"), Cw(s, this.options.container), (i = (n = t.container) == null ? void 0 : n.parentNode) == null || i.insertBefore(s, t.container), this.container = s;
    } else typeof this.options.container == "string" ? this.container = document.querySelector(this.options.container) : this.container = this.options.container;
    if (!(this.container instanceof HTMLElement)) {
      xd.error("Container required for toolbar", this.options);
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
  addHandler(t, e) {
    this.handlers[t] = e;
  }
  attach(t) {
    let e = Array.from(t.classList).find((i) => i.indexOf("ql-") === 0);
    if (!e) return;
    if (e = e.slice(3), t.tagName === "BUTTON" && t.setAttribute("type", "button"), this.handlers[e] == null && this.quill.scroll.query(e) == null) {
      xd.warn("ignoring attaching to nonexistent format", e, t);
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
        this.quill.scroll.query(e).prototype instanceof Zt
      ) {
        if (s = prompt(`Enter ${e}`), !s) return;
        this.quill.updateContents(new P().retain(a.index).delete(a.length).insert({
          [e]: s
        }), D.sources.USER);
      } else
        this.quill.format(e, s, D.sources.USER);
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
Xc.DEFAULTS = {};
function Sd(r, t, e) {
  const n = document.createElement("button");
  n.setAttribute("type", "button"), n.classList.add(`ql-${t}`), n.setAttribute("aria-pressed", "false"), e != null ? (n.value = e, n.setAttribute("aria-label", `${t}: ${e}`)) : n.setAttribute("aria-label", t), r.appendChild(n);
}
function Cw(r, t) {
  Array.isArray(t[0]) || (t = [t]), t.forEach((e) => {
    const n = document.createElement("span");
    n.classList.add("ql-formats"), e.forEach((i) => {
      if (typeof i == "string")
        Sd(n, i);
      else {
        const s = Object.keys(i)[0], a = i[s];
        Array.isArray(a) ? Tw(n, s, a) : Sd(n, s, a);
      }
    }), r.appendChild(n);
  });
}
function Tw(r, t, e) {
  const n = document.createElement("select");
  n.classList.add(`ql-${t}`), e.forEach((i) => {
    const s = document.createElement("option");
    i !== !1 ? s.setAttribute("value", String(i)) : s.setAttribute("selected", "selected"), n.appendChild(s);
  }), r.appendChild(n);
}
Xc.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const r = this.quill.getSelection();
      if (r != null)
        if (r.length === 0) {
          const t = this.quill.getFormat();
          Object.keys(t).forEach((e) => {
            this.quill.scroll.query(e, B.INLINE) != null && this.quill.format(e, !1, D.sources.USER);
          });
        } else
          this.quill.removeFormat(r.index, r.length, D.sources.USER);
    },
    direction(r) {
      const {
        align: t
      } = this.quill.getFormat();
      r === "rtl" && t == null ? this.quill.format("align", "right", D.sources.USER) : !r && t === "right" && this.quill.format("align", !1, D.sources.USER), this.quill.format("direction", r, D.sources.USER);
    },
    indent(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t), n = parseInt(e.indent || 0, 10);
      if (r === "+1" || r === "-1") {
        let i = r === "+1" ? 1 : -1;
        e.direction === "rtl" && (i *= -1), this.quill.format("indent", n + i, D.sources.USER);
      }
    },
    link(r) {
      r === !0 && (r = prompt("Enter link URL:")), this.quill.format("link", r, D.sources.USER);
    },
    list(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t);
      r === "check" ? e.list === "checked" || e.list === "unchecked" ? this.quill.format("list", !1, D.sources.USER) : this.quill.format("list", "unchecked", D.sources.USER) : this.quill.format("list", r, D.sources.USER);
    }
  }
};
const Lw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>', Dw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>', Iw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>', Nw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>', Ow = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>', Mw = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>', qw = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>', _w = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>', Ad = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>', zw = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>', Rw = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>', Pw = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>', Bw = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>', $w = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>', Fw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', jw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Uw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>', Hw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Vw = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>', Yw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>', Gw = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>', Kw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>', Ww = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>', Qw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>', Zw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>', Xw = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>', Jw = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>', tk = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>', ek = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>', nk = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>', rk = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>', ik = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>', sk = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>', Wi = {
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
  code: Ad,
  "code-block": Ad,
  color: zw,
  direction: {
    "": Rw,
    rtl: Pw
  },
  formula: Bw,
  header: {
    1: $w,
    2: Fw,
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
    sub: tk,
    super: ek
  },
  strike: nk,
  table: rk,
  underline: ik,
  video: sk
}, ak = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
let Ed = 0;
function Cd(r, t) {
  r.setAttribute(t, `${r.getAttribute(t) !== "true"}`);
}
class za {
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
    this.container.classList.toggle("ql-expanded"), Cd(this.label, "aria-expanded"), Cd(this.options, "aria-hidden");
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
    return t.classList.add("ql-picker-label"), t.innerHTML = ak, t.tabIndex = "0", t.setAttribute("role", "button"), t.setAttribute("aria-expanded", "false"), this.container.appendChild(t), t;
  }
  buildOptions() {
    const t = document.createElement("span");
    t.classList.add("ql-picker-options"), t.setAttribute("aria-hidden", "true"), t.tabIndex = "-1", t.id = `ql-picker-options-${Ed}`, Ed += 1, this.label.setAttribute("aria-controls", t.id), this.options = t, Array.from(this.select.options).forEach((e) => {
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
class rp extends za {
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
class ip extends za {
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
const ok = (r) => {
  const {
    overflowY: t
  } = getComputedStyle(r, null);
  return t !== "visible" && t !== "clip";
};
class sp {
  constructor(t, e) {
    this.quill = t, this.boundsContainer = e || document.body, this.root = t.addContainer("ql-tooltip"), this.root.innerHTML = this.constructor.TEMPLATE, ok(this.quill.root) && this.quill.root.addEventListener("scroll", () => {
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
const lk = [!1, "center", "right", "justify"], ck = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"], uk = [!1, "serif", "monospace"], dk = ["1", "2", "3", !1], hk = ["small", !1, "large", "huge"];
class ss extends Gr {
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
      if (i.classList.contains("ql-align") && (i.querySelector("option") == null && Si(i, lk), typeof e.align == "object"))
        return new ip(i, e.align);
      if (i.classList.contains("ql-background") || i.classList.contains("ql-color")) {
        const s = i.classList.contains("ql-background") ? "background" : "color";
        return i.querySelector("option") == null && Si(i, ck, s === "background" ? "#ffffff" : "#000000"), new rp(i, e[s]);
      }
      return i.querySelector("option") == null && (i.classList.contains("ql-font") ? Si(i, uk) : i.classList.contains("ql-header") ? Si(i, dk) : i.classList.contains("ql-size") && Si(i, hk)), new za(i);
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
class ap extends sp {
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
        this.linkRange ? (this.quill.formatText(this.linkRange, "link", t, R.sources.USER), delete this.linkRange) : (this.restoreFocus(), this.quill.format("link", t, R.sources.USER)), this.quill.root.scrollTop = e;
        break;
      }
      case "video":
        t = fk(t);
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
            R.sources.USER
          ), this.root.getAttribute("data-mode") === "formula" && this.quill.insertText(n + 1, " ", R.sources.USER), this.quill.setSelection(n + 2, R.sources.USER);
        }
        break;
      }
    }
    this.textbox.value = "", this.hide();
  }
}
function fk(r) {
  let t = r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  return t ? `${t[1] || "https"}://www.youtube.com/embed/${t[2]}?showinfo=0` : (t = r.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) ? `${t[1] || "https"}://player.vimeo.com/video/${t[2]}/` : r;
}
function Si(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  t.forEach((n) => {
    const i = document.createElement("option");
    n === e ? i.setAttribute("selected", "selected") : i.setAttribute("value", String(n)), r.appendChild(i);
  });
}
const pk = [["bold", "italic", "link"], [{
  header: 1
}, {
  header: 2
}, "blockquote"]];
class op extends ap {
  constructor(t, e) {
    super(t, e), this.quill.on(R.events.EDITOR_CHANGE, (n, i, s, a) => {
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
q(op, "TEMPLATE", ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join(""));
class lp extends ss {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = pk), super(t, e), this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(t) {
    this.tooltip = new op(this.quill, this.options.bounds), t.container != null && (this.tooltip.root.appendChild(t.container), this.buildButtons(t.container.querySelectorAll("button"), Wi), this.buildPickers(t.container.querySelectorAll("select"), Wi));
  }
}
lp.DEFAULTS = An({}, ss.DEFAULTS, {
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
const gk = [[{
  header: ["1", "2", "3", !1]
}], ["bold", "italic", "underline", "link"], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["clean"]];
class cp extends ap {
  constructor() {
    super(...arguments);
    q(this, "preview", this.root.querySelector("a.ql-preview"));
  }
  listen() {
    super.listen(), this.root.querySelector("a.ql-action").addEventListener("click", (e) => {
      this.root.classList.contains("ql-editing") ? this.save() : this.edit("link", this.preview.textContent), e.preventDefault();
    }), this.root.querySelector("a.ql-remove").addEventListener("click", (e) => {
      if (this.linkRange != null) {
        const n = this.linkRange;
        this.restoreFocus(), this.quill.formatText(n, "link", !1, R.sources.USER), delete this.linkRange;
      }
      e.preventDefault(), this.hide();
    }), this.quill.on(R.events.SELECTION_CHANGE, (e, n, i) => {
      if (e != null) {
        if (e.length === 0 && i === R.sources.USER) {
          const [s, a] = this.quill.scroll.descendant(Sn, e.index);
          if (s != null) {
            this.linkRange = new Xn(e.index - a, s.length());
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
q(cp, "TEMPLATE", ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join(""));
class up extends ss {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = gk), super(t, e), this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(t) {
    t.container != null && (t.container.classList.add("ql-snow"), this.buildButtons(t.container.querySelectorAll("button"), Wi), this.buildPickers(t.container.querySelectorAll("select"), Wi), this.tooltip = new cp(this.quill, this.options.bounds), t.container.querySelector(".ql-link") && this.quill.keyboard.addBinding({
      key: "k",
      shortKey: !0
    }, (e, n) => {
      t.handlers.link.call(t, !n.format.link);
    }));
  }
}
up.DEFAULTS = An({}, ss.DEFAULTS, {
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
            this.quill.format("link", !1, D.sources.USER);
        }
      }
    }
  }
});
D.register({
  "attributors/attribute/direction": Uf,
  "attributors/class/align": $f,
  "attributors/class/background": O0,
  "attributors/class/color": N0,
  "attributors/class/direction": Hf,
  "attributors/class/font": Gf,
  "attributors/class/size": Wf,
  "attributors/style/align": Ff,
  "attributors/style/background": Yc,
  "attributors/style/color": Vc,
  "attributors/style/direction": Vf,
  "attributors/style/font": Kf,
  "attributors/style/size": Qf
}, !0);
D.register({
  "formats/align": $f,
  "formats/direction": Hf,
  "formats/indent": xw,
  "formats/background": Yc,
  "formats/color": Vc,
  "formats/font": Gf,
  "formats/size": Wf,
  "formats/blockquote": Ul,
  "formats/code-block": Ot,
  "formats/header": Hl,
  "formats/list": is,
  "formats/bold": Ki,
  "formats/code": Gc,
  "formats/italic": Vl,
  "formats/link": Sn,
  "formats/script": Yl,
  "formats/strike": Gl,
  "formats/underline": Kl,
  "formats/formula": Qs,
  "formats/image": Sw,
  "formats/video": Zs,
  "modules/syntax": np,
  "modules/table": Ew,
  "modules/toolbar": Xc,
  "themes/bubble": lp,
  "themes/snow": up,
  "ui/icons": Wi,
  "ui/picker": za,
  "ui/icon-picker": ip,
  "ui/color-picker": rp,
  "ui/tooltip": sp
}, !0);
const xu = class xu {
  /**
   * Detect if the current document is in RTL mode
   */
  static isRTL() {
    var e;
    if (this.cachedDirection !== null)
      return this.cachedDirection === "rtl";
    const t = [
      document.documentElement.getAttribute("dir"),
      this.getDirectionFromLanguage(document.documentElement.getAttribute("lang")),
      (e = document.body) == null ? void 0 : e.getAttribute("dir"),
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
xu.cachedDirection = null;
let Wl = xu;
var mk = Object.defineProperty, bk = Object.defineProperties, yk = Object.getOwnPropertyDescriptors, Td = Object.getOwnPropertySymbols, vk = Object.prototype.hasOwnProperty, wk = Object.prototype.propertyIsEnumerable, Ld = (r, t, e) => t in r ? mk(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, H = (r, t) => {
  for (var e in t || (t = {}))
    vk.call(t, e) && Ld(r, e, t[e]);
  if (Td)
    for (var e of Td(t))
      wk.call(t, e) && Ld(r, e, t[e]);
  return r;
}, zt = (r, t) => bk(r, yk(t)), mt = (r, t, e) => new Promise((n, i) => {
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
const Ql = Math.min, _r = Math.max, da = Math.round, Bs = Math.floor, Cn = (r) => ({
  x: r,
  y: r
});
function kk(r, t) {
  return typeof r == "function" ? r(t) : r;
}
function xk(r) {
  return H({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, r);
}
function Sk(r) {
  return typeof r != "number" ? xk(r) : {
    top: r,
    right: r,
    bottom: r,
    left: r
  };
}
function ha(r) {
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
function Ak(r, t) {
  return mt(this, null, function* () {
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
      rootBoundary: d = "viewport",
      elementContext: f = "floating",
      altBoundary: h = !1,
      padding: p = 0
    } = kk(t, r), m = Sk(p), b = o[h ? f === "floating" ? "reference" : "floating" : f], k = ha(yield s.getClippingRect({
      element: (e = yield s.isElement == null ? void 0 : s.isElement(b)) == null || e ? b : b.contextElement || (yield s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
      boundary: c,
      rootBoundary: d,
      strategy: l
    })), v = f === "floating" ? {
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
      rect: v,
      offsetParent: S,
      strategy: l
    }) : v);
    return {
      top: (k.top - C.top + m.top) / E.y,
      bottom: (C.bottom - k.bottom + m.bottom) / E.y,
      left: (k.left - C.left + m.left) / E.x,
      right: (C.right - k.right + m.right) / E.x
    };
  });
}
function ei(r) {
  return dp(r) ? (r.nodeName || "").toLowerCase() : "#document";
}
function Qt(r) {
  var t;
  return (r == null || (t = r.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function dn(r) {
  var t;
  return (t = (dp(r) ? r.ownerDocument : r.document) || window.document) == null ? void 0 : t.documentElement;
}
function dp(r) {
  return r instanceof Node || r instanceof Qt(r).Node;
}
function Ve(r) {
  return r instanceof Element || r instanceof Qt(r).Element;
}
function Ye(r) {
  return r instanceof HTMLElement || r instanceof Qt(r).HTMLElement;
}
function Dd(r) {
  return typeof ShadowRoot > "u" ? !1 : r instanceof ShadowRoot || r instanceof Qt(r).ShadowRoot;
}
function as(r) {
  const {
    overflow: t,
    overflowX: e,
    overflowY: n,
    display: i
  } = Se(r);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + e) && !["inline", "contents"].includes(i);
}
function Ek(r) {
  return ["table", "td", "th"].includes(ei(r));
}
function Ra(r) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return r.matches(t);
    } catch {
      return !1;
    }
  });
}
function Jc(r) {
  const t = tu(), e = Se(r);
  return e.transform !== "none" || e.perspective !== "none" || (e.containerType ? e.containerType !== "normal" : !1) || !t && (e.backdropFilter ? e.backdropFilter !== "none" : !1) || !t && (e.filter ? e.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((n) => (e.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (e.contain || "").includes(n));
}
function Ck(r) {
  let t = Tn(r);
  for (; Ye(t) && !Wr(t); ) {
    if (Ra(t))
      return null;
    if (Jc(t))
      return t;
    t = Tn(t);
  }
  return null;
}
function tu() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function Wr(r) {
  return ["html", "body", "#document"].includes(ei(r));
}
function Se(r) {
  return Qt(r).getComputedStyle(r);
}
function Pa(r) {
  return Ve(r) ? {
    scrollLeft: r.scrollLeft,
    scrollTop: r.scrollTop
  } : {
    scrollLeft: r.scrollX,
    scrollTop: r.scrollY
  };
}
function Tn(r) {
  if (ei(r) === "html")
    return r;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    r.assignedSlot || // DOM Element detected.
    r.parentNode || // ShadowRoot detected.
    Dd(r) && r.host || // Fallback.
    dn(r)
  );
  return Dd(t) ? t.host : t;
}
function hp(r) {
  const t = Tn(r);
  return Wr(t) ? r.ownerDocument ? r.ownerDocument.body : r.body : Ye(t) && as(t) ? t : hp(t);
}
function Qi(r, t, e) {
  var n;
  t === void 0 && (t = []), e === void 0 && (e = !0);
  const i = hp(r), s = i === ((n = r.ownerDocument) == null ? void 0 : n.body), a = Qt(i);
  return s ? t.concat(a, a.visualViewport || [], as(i) ? i : [], a.frameElement && e ? Qi(a.frameElement) : []) : t.concat(i, Qi(i, [], e));
}
function fp(r) {
  const t = Se(r);
  let e = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const i = Ye(r), s = i ? r.offsetWidth : e, a = i ? r.offsetHeight : n, o = da(e) !== s || da(n) !== a;
  return o && (e = s, n = a), {
    width: e,
    height: n,
    $: o
  };
}
function eu(r) {
  return Ve(r) ? r : r.contextElement;
}
function zr(r) {
  const t = eu(r);
  if (!Ye(t))
    return Cn(1);
  const e = t.getBoundingClientRect(), {
    width: n,
    height: i,
    $: s
  } = fp(t);
  let a = (s ? da(e.width) : e.width) / n, o = (s ? da(e.height) : e.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const Tk = /* @__PURE__ */ Cn(0);
function pp(r) {
  const t = Qt(r);
  return !tu() || !t.visualViewport ? Tk : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Lk(r, t, e) {
  return t === void 0 && (t = !1), !e || t && e !== Qt(r) ? !1 : t;
}
function Jn(r, t, e, n) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  const i = r.getBoundingClientRect(), s = eu(r);
  let a = Cn(1);
  t && (n ? Ve(n) && (a = zr(n)) : a = zr(r));
  const o = Lk(s, e, n) ? pp(s) : Cn(0);
  let l = (i.left + o.x) / a.x, c = (i.top + o.y) / a.y, d = i.width / a.x, f = i.height / a.y;
  if (s) {
    const h = Qt(s), p = n && Ve(n) ? Qt(n) : n;
    let m = h, b = m.frameElement;
    for (; b && n && p !== m; ) {
      const k = zr(b), v = b.getBoundingClientRect(), S = Se(b), E = v.left + (b.clientLeft + parseFloat(S.paddingLeft)) * k.x, C = v.top + (b.clientTop + parseFloat(S.paddingTop)) * k.y;
      l *= k.x, c *= k.y, d *= k.x, f *= k.y, l += E, c += C, m = Qt(b), b = m.frameElement;
    }
  }
  return ha({
    width: d,
    height: f,
    x: l,
    y: c
  });
}
function Dk(r) {
  let {
    elements: t,
    rect: e,
    offsetParent: n,
    strategy: i
  } = r;
  const s = i === "fixed", a = dn(n), o = t ? Ra(t.floating) : !1;
  if (n === a || o && s)
    return e;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Cn(1);
  const d = Cn(0), f = Ye(n);
  if ((f || !f && !s) && ((ei(n) !== "body" || as(a)) && (l = Pa(n)), Ye(n))) {
    const h = Jn(n);
    c = zr(n), d.x = h.x + n.clientLeft, d.y = h.y + n.clientTop;
  }
  return {
    width: e.width * c.x,
    height: e.height * c.y,
    x: e.x * c.x - l.scrollLeft * c.x + d.x,
    y: e.y * c.y - l.scrollTop * c.y + d.y
  };
}
function Ik(r) {
  return Array.from(r.getClientRects());
}
function gp(r) {
  return Jn(dn(r)).left + Pa(r).scrollLeft;
}
function Nk(r) {
  const t = dn(r), e = Pa(r), n = r.ownerDocument.body, i = _r(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = _r(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -e.scrollLeft + gp(r);
  const o = -e.scrollTop;
  return Se(n).direction === "rtl" && (a += _r(t.clientWidth, n.clientWidth) - i), {
    width: i,
    height: s,
    x: a,
    y: o
  };
}
function Ok(r, t) {
  const e = Qt(r), n = dn(r), i = e.visualViewport;
  let s = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (i) {
    s = i.width, a = i.height;
    const c = tu();
    (!c || c && t === "fixed") && (o = i.offsetLeft, l = i.offsetTop);
  }
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
function Mk(r, t) {
  const e = Jn(r, !0, t === "fixed"), n = e.top + r.clientTop, i = e.left + r.clientLeft, s = Ye(r) ? zr(r) : Cn(1), a = r.clientWidth * s.x, o = r.clientHeight * s.y, l = i * s.x, c = n * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: c
  };
}
function Id(r, t, e) {
  let n;
  if (t === "viewport")
    n = Ok(r, e);
  else if (t === "document")
    n = Nk(dn(r));
  else if (Ve(t))
    n = Mk(t, e);
  else {
    const i = pp(r);
    n = zt(H({}, t), {
      x: t.x - i.x,
      y: t.y - i.y
    });
  }
  return ha(n);
}
function mp(r, t) {
  const e = Tn(r);
  return e === t || !Ve(e) || Wr(e) ? !1 : Se(e).position === "fixed" || mp(e, t);
}
function qk(r, t) {
  const e = t.get(r);
  if (e)
    return e;
  let n = Qi(r, [], !1).filter((o) => Ve(o) && ei(o) !== "body"), i = null;
  const s = Se(r).position === "fixed";
  let a = s ? Tn(r) : r;
  for (; Ve(a) && !Wr(a); ) {
    const o = Se(a), l = Jc(a);
    !l && o.position === "fixed" && (i = null), (s ? !l && !i : !l && o.position === "static" && i && ["absolute", "fixed"].includes(i.position) || as(a) && !l && mp(r, a)) ? n = n.filter((c) => c !== a) : i = o, a = Tn(a);
  }
  return t.set(r, n), n;
}
function _k(r) {
  let {
    element: t,
    boundary: e,
    rootBoundary: n,
    strategy: i
  } = r;
  const s = [...e === "clippingAncestors" ? Ra(t) ? [] : qk(t, this._c) : [].concat(e), n], a = s[0], o = s.reduce((l, c) => {
    const d = Id(t, c, i);
    return l.top = _r(d.top, l.top), l.right = Ql(d.right, l.right), l.bottom = Ql(d.bottom, l.bottom), l.left = _r(d.left, l.left), l;
  }, Id(t, a, i));
  return {
    width: o.right - o.left,
    height: o.bottom - o.top,
    x: o.left,
    y: o.top
  };
}
function zk(r) {
  const {
    width: t,
    height: e
  } = fp(r);
  return {
    width: t,
    height: e
  };
}
function Rk(r, t, e) {
  const n = Ye(t), i = dn(t), s = e === "fixed", a = Jn(r, !0, s, t);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Cn(0);
  if (n || !n && !s)
    if ((ei(t) !== "body" || as(i)) && (o = Pa(t)), n) {
      const f = Jn(t, !0, s, t);
      l.x = f.x + t.clientLeft, l.y = f.y + t.clientTop;
    } else i && (l.x = gp(i));
  const c = a.left + o.scrollLeft - l.x, d = a.top + o.scrollTop - l.y;
  return {
    x: c,
    y: d,
    width: a.width,
    height: a.height
  };
}
function Xo(r) {
  return Se(r).position === "static";
}
function Nd(r, t) {
  return !Ye(r) || Se(r).position === "fixed" ? null : t ? t(r) : r.offsetParent;
}
function bp(r, t) {
  const e = Qt(r);
  if (Ra(r))
    return e;
  if (!Ye(r)) {
    let i = Tn(r);
    for (; i && !Wr(i); ) {
      if (Ve(i) && !Xo(i))
        return i;
      i = Tn(i);
    }
    return e;
  }
  let n = Nd(r, t);
  for (; n && Ek(n) && Xo(n); )
    n = Nd(n, t);
  return n && Wr(n) && Xo(n) && !Jc(n) ? e : n || Ck(r) || e;
}
const Pk = function(r) {
  return mt(this, null, function* () {
    const t = this.getOffsetParent || bp, e = this.getDimensions, n = yield e(r.floating);
    return {
      reference: Rk(r.reference, yield t(r.floating), r.strategy),
      floating: {
        x: 0,
        y: 0,
        width: n.width,
        height: n.height
      }
    };
  });
};
function Bk(r) {
  return Se(r).direction === "rtl";
}
const se = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Dk,
  getDocumentElement: dn,
  getClippingRect: _k,
  getOffsetParent: bp,
  getElementRects: Pk,
  getClientRects: Ik,
  getDimensions: zk,
  getScale: zr,
  isElement: Ve,
  isRTL: Bk
};
function $k(r, t) {
  let e = null, n;
  const i = dn(r);
  function s() {
    var o;
    clearTimeout(n), (o = e) == null || o.disconnect(), e = null;
  }
  function a(o, l) {
    o === void 0 && (o = !1), l === void 0 && (l = 1), s();
    const {
      left: c,
      top: d,
      width: f,
      height: h
    } = r.getBoundingClientRect();
    if (o || t(), !f || !h)
      return;
    const p = Bs(d), m = Bs(i.clientWidth - (c + f)), b = Bs(i.clientHeight - (d + h)), k = Bs(c), v = {
      rootMargin: -p + "px " + -m + "px " + -b + "px " + -k + "px",
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
      e = new IntersectionObserver(E, zt(H({}, v), {
        // Handle <iframe>s
        root: i.ownerDocument
      }));
    } catch {
      e = new IntersectionObserver(E, v);
    }
    e.observe(r);
  }
  return a(!0), s;
}
function yp(r, t, e, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = eu(r), d = i || s ? [...c ? Qi(c) : [], ...Qi(t)] : [];
  d.forEach((v) => {
    i && v.addEventListener("scroll", e, {
      passive: !0
    }), s && v.addEventListener("resize", e);
  });
  const f = c && o ? $k(c, e) : null;
  let h = -1, p = null;
  a && (p = new ResizeObserver((v) => {
    let [S] = v;
    S && S.target === c && p && (p.unobserve(t), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var E;
      (E = p) == null || E.observe(t);
    })), e();
  }), c && !l && p.observe(c), p.observe(t));
  let m, b = l ? Jn(r) : null;
  l && k();
  function k() {
    const v = Jn(r);
    b && (v.x !== b.x || v.y !== b.y || v.width !== b.width || v.height !== b.height) && e(), b = v, m = requestAnimationFrame(k);
  }
  return e(), () => {
    var v;
    d.forEach((S) => {
      i && S.removeEventListener("scroll", e), s && S.removeEventListener("resize", e);
    }), f == null || f(), (v = p) == null || v.disconnect(), p = null, l && cancelAnimationFrame(m);
  };
}
const Fk = Ak, Jo = 0, z = 1, K = 2, gt = 3, ot = 4, We = 5, Ba = 6, It = 7, jt = 8, G = 9, F = 10, ct = 11, Y = 12, ut = 13, os = 14, Ut = 15, Mt = 16, Vt = 17, Qe = 18, Xt = 19, Ae = 20, kt = 21, rt = 22, qt = 23, le = 24, Pt = 25, jk = 0;
function xt(r) {
  return r >= 48 && r <= 57;
}
function Ln(r) {
  return xt(r) || // 0 .. 9
  r >= 65 && r <= 70 || // A .. F
  r >= 97 && r <= 102;
}
function nu(r) {
  return r >= 65 && r <= 90;
}
function Uk(r) {
  return r >= 97 && r <= 122;
}
function Hk(r) {
  return nu(r) || Uk(r);
}
function Vk(r) {
  return r >= 128;
}
function fa(r) {
  return Hk(r) || Vk(r) || r === 95;
}
function vp(r) {
  return fa(r) || xt(r) || r === 45;
}
function Yk(r) {
  return r >= 0 && r <= 8 || r === 11 || r >= 14 && r <= 31 || r === 127;
}
function pa(r) {
  return r === 10 || r === 13 || r === 12;
}
function tr(r) {
  return pa(r) || r === 32 || r === 9;
}
function $e(r, t) {
  return !(r !== 92 || pa(t) || t === jk);
}
function Xs(r, t, e) {
  return r === 45 ? fa(t) || t === 45 || $e(t, e) : fa(r) ? !0 : r === 92 ? $e(r, t) : !1;
}
function tl(r, t, e) {
  return r === 43 || r === 45 ? xt(t) ? 2 : t === 46 && xt(e) ? 3 : 0 : r === 46 ? xt(t) ? 2 : 0 : xt(r) ? 1 : 0;
}
function wp(r) {
  return r === 65279 || r === 65534 ? 1 : 0;
}
const Zl = new Array(128), Gk = 128, Js = 130, kp = 131, ru = 132, xp = 133;
for (let r = 0; r < Zl.length; r++)
  Zl[r] = tr(r) && Js || xt(r) && kp || fa(r) && ru || Yk(r) && xp || r || Gk;
function el(r) {
  return r < 128 ? Zl[r] : ru;
}
function Rr(r, t) {
  return t < r.length ? r.charCodeAt(t) : 0;
}
function Xl(r, t, e) {
  return e === 13 && Rr(r, t + 1) === 10 ? 2 : 1;
}
function Pr(r, t, e) {
  let n = r.charCodeAt(t);
  return nu(n) && (n = n | 32), n === e;
}
function Zi(r, t, e, n) {
  if (e - t !== n.length || t < 0 || e > r.length)
    return !1;
  for (let i = t; i < e; i++) {
    const s = n.charCodeAt(i - t);
    let a = r.charCodeAt(i);
    if (nu(a) && (a = a | 32), a !== s)
      return !1;
  }
  return !0;
}
function Kk(r, t) {
  for (; t >= 0 && tr(r.charCodeAt(t)); t--)
    ;
  return t + 1;
}
function $s(r, t) {
  for (; t < r.length && tr(r.charCodeAt(t)); t++)
    ;
  return t;
}
function nl(r, t) {
  for (; t < r.length && xt(r.charCodeAt(t)); t++)
    ;
  return t;
}
function Qr(r, t) {
  if (t += 2, Ln(Rr(r, t - 1))) {
    for (const n = Math.min(r.length, t + 5); t < n && Ln(Rr(r, t)); t++)
      ;
    const e = Rr(r, t);
    tr(e) && (t += Xl(r, t, e));
  }
  return t;
}
function Fs(r, t) {
  for (; t < r.length; t++) {
    const e = r.charCodeAt(t);
    if (!vp(e)) {
      if ($e(e, Rr(r, t + 1))) {
        t = Qr(r, t) - 1;
        continue;
      }
      break;
    }
  }
  return t;
}
function $a(r, t) {
  let e = r.charCodeAt(t);
  if ((e === 43 || e === 45) && (e = r.charCodeAt(t += 1)), xt(e) && (t = nl(r, t + 1), e = r.charCodeAt(t)), e === 46 && xt(r.charCodeAt(t + 1)) && (t += 2, t = nl(r, t)), Pr(
    r,
    t,
    101
    /* e */
  )) {
    let n = 0;
    e = r.charCodeAt(t + 1), (e === 45 || e === 43) && (n = 1, e = r.charCodeAt(t + 2)), xt(e) && (t = nl(r, t + 1 + n + 1));
  }
  return t;
}
function rl(r, t) {
  for (; t < r.length; t++) {
    const e = r.charCodeAt(t);
    if (e === 41) {
      t++;
      break;
    }
    $e(e, Rr(r, t + 1)) && (t = Qr(r, t));
  }
  return t;
}
function Sp(r) {
  if (r.length === 1 && !Ln(r.charCodeAt(0)))
    return r[0];
  let t = parseInt(r, 16);
  return (t === 0 || // If this number is zero,
  t >= 55296 && t <= 57343 || // or is for a surrogate,
  t > 1114111) && (t = 65533), String.fromCodePoint(t);
}
const Ap = [
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
], Wk = 16 * 1024;
function ga(r = null, t) {
  return r === null || r.length < t ? new Uint32Array(Math.max(t + 1024, Wk)) : r;
}
const Od = 10, Qk = 12, Md = 13;
function qd(r) {
  const t = r.source, e = t.length, n = t.length > 0 ? wp(t.charCodeAt(0)) : 0, i = ga(r.lines, e), s = ga(r.columns, e);
  let a = r.startLine, o = r.startColumn;
  for (let l = n; l < e; l++) {
    const c = t.charCodeAt(l);
    i[l] = a, s[l] = o++, (c === Od || c === Md || c === Qk) && (c === Md && l + 1 < e && t.charCodeAt(l + 1) === Od && (l++, i[l] = a, s[l] = o), a++, o = 1);
  }
  i[e] = a, s[e] = o, r.lines = i, r.columns = s, r.computed = !0;
}
class Zk {
  constructor() {
    this.lines = null, this.columns = null, this.computed = !1;
  }
  setSource(t, e = 0, n = 1, i = 1) {
    this.source = t, this.startOffset = e, this.startLine = n, this.startColumn = i, this.computed = !1;
  }
  getLocation(t, e) {
    return this.computed || qd(this), {
      source: e,
      offset: this.startOffset + t,
      line: this.lines[t],
      column: this.columns[t]
    };
  }
  getLocationRange(t, e, n) {
    return this.computed || qd(this), {
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
const te = 16777215, mn = 24, Xk = /* @__PURE__ */ new Map([
  [K, rt],
  [kt, rt],
  [Xt, Ae],
  [qt, le]
]);
class Jk {
  constructor(t, e) {
    this.setSource(t, e);
  }
  reset() {
    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
  }
  setSource(t = "", e = () => {
  }) {
    t = String(t || "");
    const n = t.length, i = ga(this.offsetAndType, t.length + 1), s = ga(this.balance, t.length + 1);
    let a = 0, o = 0, l = 0, c = -1;
    for (this.offsetAndType = null, this.balance = null, e(t, (d, f, h) => {
      switch (d) {
        default:
          s[a] = n;
          break;
        case o: {
          let p = l & te;
          for (l = s[p], o = l >> mn, s[a] = p, s[p++] = a; p < a; p++)
            s[p] === n && (s[p] = a);
          break;
        }
        case kt:
        case K:
        case Xt:
        case qt:
          s[a] = l, o = Xk.get(d), l = o << mn | a;
          break;
      }
      i[a++] = d << mn | h, c === -1 && (c = f);
    }), i[a] = Jo << mn | n, s[a] = n, s[n] = n; l !== 0; ) {
      const d = l & te;
      l = s[d], s[d] = n;
    }
    this.source = t, this.firstCharOffset = c === -1 ? 0 : c, this.tokenCount = a, this.offsetAndType = i, this.balance = s, this.reset(), this.next();
  }
  lookupType(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t] >> mn : Jo;
  }
  lookupOffset(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t - 1] & te : this.source.length;
  }
  lookupValue(t, e) {
    return t += this.tokenIndex, t < this.tokenCount ? Zi(
      this.source,
      this.offsetAndType[t - 1] & te,
      this.offsetAndType[t] & te,
      e
    ) : !1;
  }
  getTokenStart(t) {
    return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & te : this.offsetAndType[this.tokenCount] & te : this.firstCharOffset;
  }
  substrToCursor(t) {
    return this.source.substring(t, this.tokenStart);
  }
  isBalanceEdge(t) {
    return this.balance[this.tokenIndex] < t;
  }
  isDelim(t, e) {
    return e ? this.lookupType(e) === G && this.source.charCodeAt(this.lookupOffset(e)) === t : this.tokenType === G && this.source.charCodeAt(this.tokenStart) === t;
  }
  skip(t) {
    let e = this.tokenIndex + t;
    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.offsetAndType[e - 1] & te, e = this.offsetAndType[e], this.tokenType = e >> mn, this.tokenEnd = e & te) : (this.tokenIndex = this.tokenCount, this.next());
  }
  next() {
    let t = this.tokenIndex + 1;
    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.tokenEnd, t = this.offsetAndType[t], this.tokenType = t >> mn, this.tokenEnd = t & te) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = Jo, this.tokenStart = this.tokenEnd = this.source.length);
  }
  skipSC() {
    for (; this.tokenType === ut || this.tokenType === Pt; )
      this.next();
  }
  skipUntilBalanced(t, e) {
    let n = t, i, s;
    t:
      for (; n < this.tokenCount; n++) {
        if (i = this.balance[n], i < t)
          break t;
        switch (s = n > 0 ? this.offsetAndType[n - 1] & te : this.firstCharOffset, e(this.source.charCodeAt(s))) {
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
      const i = n, s = this.offsetAndType[e], a = s & te, o = s >> mn;
      n = a, t(o, i, a, e);
    }
  }
  dump() {
    const t = new Array(this.tokenCount);
    return this.forEachToken((e, n, i, s) => {
      t[s] = {
        idx: s,
        type: Ap[e],
        chunk: this.source.substring(n, i),
        balance: this.balance[s]
      };
    }), t;
  }
}
function Fa(r, t) {
  function e(f) {
    return f < o ? r.charCodeAt(f) : 0;
  }
  function n() {
    if (c = $a(r, c), Xs(e(c), e(c + 1), e(c + 2))) {
      d = Y, c = Fs(r, c);
      return;
    }
    if (e(c) === 37) {
      d = ct, c++;
      return;
    }
    d = F;
  }
  function i() {
    const f = c;
    if (c = Fs(r, c), Zi(r, f, c, "url") && e(c) === 40) {
      if (c = $s(r, c + 1), e(c) === 34 || e(c) === 39) {
        d = K, c = f + 4;
        return;
      }
      a();
      return;
    }
    if (e(c) === 40) {
      d = K, c++;
      return;
    }
    d = z;
  }
  function s(f) {
    for (f || (f = e(c++)), d = We; c < r.length; c++) {
      const h = r.charCodeAt(c);
      switch (el(h)) {
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
          const p = e(c + 1);
          pa(p) ? c += Xl(r, c + 1, p) : $e(h, p) && (c = Qr(r, c) - 1);
          break;
      }
    }
  }
  function a() {
    for (d = It, c = $s(r, c); c < r.length; c++) {
      const f = r.charCodeAt(c);
      switch (el(f)) {
        case 41:
          c++;
          return;
        case Js:
          if (c = $s(r, c), e(c) === 41 || c >= r.length) {
            c < r.length && c++;
            return;
          }
          c = rl(r, c), d = jt;
          return;
        case 34:
        case 39:
        case 40:
        case xp:
          c = rl(r, c), d = jt;
          return;
        case 92:
          if ($e(f, e(c + 1))) {
            c = Qr(r, c) - 1;
            break;
          }
          c = rl(r, c), d = jt;
          return;
      }
    }
  }
  r = String(r || "");
  const o = r.length;
  let l = wp(e(0)), c = l, d;
  for (; c < o; ) {
    const f = r.charCodeAt(c);
    switch (el(f)) {
      case Js:
        d = ut, c = $s(r, c + 1);
        break;
      case 34:
        s();
        break;
      case 35:
        vp(e(c + 1)) || $e(e(c + 1), e(c + 2)) ? (d = ot, c = Fs(r, c + 1)) : (d = G, c++);
        break;
      case 39:
        s();
        break;
      case 40:
        d = kt, c++;
        break;
      case 41:
        d = rt, c++;
        break;
      case 43:
        tl(f, e(c + 1), e(c + 2)) ? n() : (d = G, c++);
        break;
      case 44:
        d = Qe, c++;
        break;
      case 45:
        tl(f, e(c + 1), e(c + 2)) ? n() : e(c + 1) === 45 && e(c + 2) === 62 ? (d = Ut, c = c + 3) : Xs(f, e(c + 1), e(c + 2)) ? i() : (d = G, c++);
        break;
      case 46:
        tl(f, e(c + 1), e(c + 2)) ? n() : (d = G, c++);
        break;
      case 47:
        e(c + 1) === 42 ? (d = Pt, c = r.indexOf("*/", c + 2), c = c === -1 ? r.length : c + 2) : (d = G, c++);
        break;
      case 58:
        d = Mt, c++;
        break;
      case 59:
        d = Vt, c++;
        break;
      case 60:
        e(c + 1) === 33 && e(c + 2) === 45 && e(c + 3) === 45 ? (d = os, c = c + 4) : (d = G, c++);
        break;
      case 64:
        Xs(e(c + 1), e(c + 2), e(c + 3)) ? (d = gt, c = Fs(r, c + 1)) : (d = G, c++);
        break;
      case 91:
        d = Xt, c++;
        break;
      case 92:
        $e(f, e(c + 1)) ? i() : (d = G, c++);
        break;
      case 93:
        d = Ae, c++;
        break;
      case 123:
        d = qt, c++;
        break;
      case 125:
        d = le, c++;
        break;
      case kp:
        n();
        break;
      case ru:
        i();
        break;
      default:
        d = G, c++;
    }
    t(d, l, l = c);
  }
}
let vr = null;
class pt {
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
    return pt.createItem(t);
  }
  // cursor helpers
  allocateCursor(t, e) {
    let n;
    return vr !== null ? (n = vr, vr = vr.cursor, n.prev = t, n.next = e, n.cursor = this.cursor) : n = {
      prev: t,
      next: e,
      cursor: this.cursor
    }, this.cursor = n, n;
  }
  releaseCursor() {
    const { cursor: t } = this;
    this.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = vr, vr = t;
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
      const i = pt.createItem(n);
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
    const n = new pt();
    for (let i = this.head; i !== null; i = i.next)
      n.appendData(t.call(e, i.data, i, this));
    return n;
  }
  filter(t, e = this) {
    const n = new pt();
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
    const t = new pt();
    for (let e of this)
      t.appendData(e);
    return t;
  }
  prepend(t) {
    return this.updateCursors(null, t, this.head, t), this.head !== null ? (this.head.prev = t, t.next = this.head) : this.tail = t, this.head = t, this;
  }
  prependData(t) {
    return this.prepend(pt.createItem(t));
  }
  append(t) {
    return this.insert(t);
  }
  appendData(t) {
    return this.insert(pt.createItem(t));
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
    return this.insert(pt.createItem(t), e);
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
    this.insert(pt.createItem(t));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(t) {
    this.prepend(pt.createItem(t));
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
function ja(r, t) {
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
const il = 100, _d = 60, zd = "    ";
function Rd({ source: r, line: t, column: e }, n) {
  function i(d, f) {
    return s.slice(d, f).map(
      (h, p) => String(d + p + 1).padStart(l) + " |" + h
    ).join(`
`);
  }
  const s = r.split(/\r\n?|\n|\f/), a = Math.max(1, t - n) - 1, o = Math.min(t + n, s.length + 1), l = Math.max(4, String(o).length) + 1;
  let c = 0;
  e += (zd.length - 1) * (s[t - 1].substr(0, e - 1).match(/\t/g) || []).length, e > il && (c = e - _d + 3, e = _d - 2);
  for (let d = a; d <= o; d++)
    d >= 0 && d < s.length && (s[d] = s[d].replace(/\t/g, zd), s[d] = (c > 0 && s[d].length > c ? "…" : "") + s[d].substr(c, il - 2) + (s[d].length > c + il - 1 ? "…" : ""));
  return [
    i(a, t),
    new Array(e + l + 2).join("-") + "^",
    i(t, o)
  ].filter(Boolean).join(`
`);
}
function Pd(r, t, e, n, i) {
  return Object.assign(ja("SyntaxError", r), {
    source: t,
    offset: e,
    line: n,
    column: i,
    sourceFragment(s) {
      return Rd({ source: t, line: n, column: i }, isNaN(s) ? 0 : s);
    },
    get formattedMessage() {
      return `Parse error: ${r}
` + Rd({ source: t, line: n, column: i }, 2);
    }
  });
}
function tx(r) {
  const t = this.createList();
  let e = !1;
  const n = {
    recognizer: r
  };
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case Pt:
        this.next();
        continue;
      case ut:
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
const Bd = () => {
}, ex = 33, nx = 35, sl = 59, $d = 123, Fd = 0;
function rx(r) {
  return function() {
    return this[r]();
  };
}
function al(r) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const e in r) {
    const n = r[e], i = n.parse || n;
    i && (t[e] = i);
  }
  return t;
}
function ix(r) {
  const t = {
    context: /* @__PURE__ */ Object.create(null),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), r.scope),
    atrule: al(r.atrule),
    pseudo: al(r.pseudo),
    node: al(r.node)
  };
  for (const e in r.parseContext)
    switch (typeof r.parseContext[e]) {
      case "function":
        t.context[e] = r.parseContext[e];
        break;
      case "string":
        t.context[e] = rx(r.parseContext[e]);
        break;
    }
  return H(H({
    config: t
  }, t), t.node);
}
function sx(r) {
  let t = "", e = "<unknown>", n = !1, i = Bd, s = !1;
  const a = new Zk(), o = Object.assign(new Jk(), ix(r || {}), {
    parseAtrulePrelude: !0,
    parseRulePrelude: !0,
    parseValue: !0,
    parseCustomProperty: !1,
    readSequence: tx,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(l) {
      return l === $d ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(l) {
      return l === $d || l === sl ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(l) {
      return l === ex || l === sl ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(l) {
      return l === sl ? 2 : 0;
    },
    createList() {
      return new pt();
    },
    createSingleNodeList(l) {
      return new pt().appendData(l);
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
        if (c = this.lookupType(l++), c !== ut)
          return c;
      while (c !== Fd);
      return Fd;
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
      return Pr(t, l, c);
    },
    cmpStr(l, c, d) {
      return Zi(t, l, c, d);
    },
    consume(l) {
      const c = this.tokenStart;
      return this.eat(l), this.substrToCursor(c);
    },
    consumeFunctionName() {
      const l = t.substring(this.tokenStart, this.tokenEnd - 1);
      return this.eat(K), l;
    },
    consumeNumber(l) {
      const c = t.substring(this.tokenStart, $a(t, this.tokenStart));
      return this.eat(l), c;
    },
    eat(l) {
      if (this.tokenType !== l) {
        const c = Ap[l].slice(0, -6).replace(/-/g, " ").replace(/^./, (h) => h.toUpperCase());
        let d = `${/[[\](){}]/.test(c) ? `"${c}"` : c} is expected`, f = this.tokenStart;
        switch (l) {
          case z:
            this.tokenType === K || this.tokenType === It ? (f = this.tokenEnd - 1, d = "Identifier is expected but function found") : d = "Identifier is expected";
            break;
          case ot:
            this.isDelim(nx) && (this.next(), f++, d = "Name is expected");
            break;
          case ct:
            this.tokenType === F && (f = this.tokenEnd, d = "Percent sign is expected");
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
        e
      ) : null;
    },
    getLocationFromList(l) {
      if (n) {
        const c = this.getFirstListNode(l), d = this.getLastListNode(l);
        return a.getLocationRange(
          c !== null ? c.loc.start.offset - a.startOffset : this.tokenStart,
          d !== null ? d.loc.end.offset - a.startOffset : this.tokenStart,
          e
        );
      }
      return null;
    },
    error(l, c) {
      const d = typeof c < "u" && c < t.length ? a.getLocation(c) : this.eof ? a.getLocation(Kk(t, t.length - 1)) : a.getLocation(this.tokenStart);
      throw new Pd(
        l || "Unexpected input",
        t,
        d.offset,
        d.line,
        d.column
      );
    }
  });
  return Object.assign(function(l, c) {
    t = l, c = c || {}, o.setSource(t, Fa), a.setSource(
      t,
      c.offset,
      c.line,
      c.column
    ), e = c.filename || "<unknown>", n = !!c.positions, i = typeof c.onParseError == "function" ? c.onParseError : Bd, s = !1, o.parseAtrulePrelude = "parseAtrulePrelude" in c ? !!c.parseAtrulePrelude : !0, o.parseRulePrelude = "parseRulePrelude" in c ? !!c.parseRulePrelude : !0, o.parseValue = "parseValue" in c ? !!c.parseValue : !0, o.parseCustomProperty = "parseCustomProperty" in c ? !!c.parseCustomProperty : !1;
    const { context: d = "default", onComment: f } = c;
    if (!(d in o.context))
      throw new Error("Unknown context `" + d + "`");
    typeof f == "function" && o.forEachToken((p, m, b) => {
      if (p === Pt) {
        const k = o.getLocation(m, b), v = Zi(t, b - 2, b, "*/") ? t.slice(m + 2, b - 2) : t.slice(m + 2, b);
        f(v, k);
      }
    });
    const h = o.context[d].call(o, c);
    return o.eof || o.error(), h;
  }, {
    SyntaxError: Pd,
    config: o.config
  });
}
var iu = {}, su = {}, jd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
su.encode = function(r) {
  if (0 <= r && r < jd.length)
    return jd[r];
  throw new TypeError("Must be between 0 and 63: " + r);
};
su.decode = function(r) {
  var t = 65, e = 90, n = 97, i = 122, s = 48, a = 57, o = 43, l = 47, c = 26, d = 52;
  return t <= r && r <= e ? r - t : n <= r && r <= i ? r - n + c : s <= r && r <= a ? r - s + d : r == o ? 62 : r == l ? 63 : -1;
};
var Ep = su, au = 5, Cp = 1 << au, Tp = Cp - 1, Lp = Cp;
function ax(r) {
  return r < 0 ? (-r << 1) + 1 : (r << 1) + 0;
}
function ox(r) {
  var t = (r & 1) === 1, e = r >> 1;
  return t ? -e : e;
}
iu.encode = function(r) {
  var t = "", e, n = ax(r);
  do
    e = n & Tp, n >>>= au, n > 0 && (e |= Lp), t += Ep.encode(e);
  while (n > 0);
  return t;
};
iu.decode = function(r, t, e) {
  var n = r.length, i = 0, s = 0, a, o;
  do {
    if (t >= n)
      throw new Error("Expected more digits in base 64 VLQ value.");
    if (o = Ep.decode(r.charCodeAt(t++)), o === -1)
      throw new Error("Invalid base64 digit: " + r.charAt(t - 1));
    a = !!(o & Lp), o &= Tp, i = i + (o << s), s += au;
  } while (a);
  e.value = ox(i), e.rest = t;
};
var Ua = {};
(function(r) {
  function t(x, A, _) {
    if (A in x)
      return x[A];
    if (arguments.length === 3)
      return _;
    throw new Error('"' + A + '" is a required argument.');
  }
  r.getArg = t;
  var e = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, n = /^data:.+\,.+$/;
  function i(x) {
    var A = x.match(e);
    return A ? {
      scheme: A[1],
      auth: A[2],
      host: A[3],
      port: A[4],
      path: A[5]
    } : null;
  }
  r.urlParse = i;
  function s(x) {
    var A = "";
    return x.scheme && (A += x.scheme + ":"), A += "//", x.auth && (A += x.auth + "@"), x.host && (A += x.host), x.port && (A += ":" + x.port), x.path && (A += x.path), A;
  }
  r.urlGenerate = s;
  var a = 32;
  function o(x) {
    var A = [];
    return function(_) {
      for (var N = 0; N < A.length; N++)
        if (A[N].input === _) {
          var V = A[0];
          return A[0] = A[N], A[N] = V, A[0].result;
        }
      var ht = x(_);
      return A.unshift({
        input: _,
        result: ht
      }), A.length > a && A.pop(), ht;
    };
  }
  var l = o(function(x) {
    var A = x, _ = i(x);
    if (_) {
      if (!_.path)
        return x;
      A = _.path;
    }
    for (var N = r.isAbsolute(A), V = [], ht = 0, it = 0; ; )
      if (ht = it, it = A.indexOf("/", ht), it === -1) {
        V.push(A.slice(ht));
        break;
      } else
        for (V.push(A.slice(ht, it)); it < A.length && A[it] === "/"; )
          it++;
    for (var Yt, Bt = 0, it = V.length - 1; it >= 0; it--)
      Yt = V[it], Yt === "." ? V.splice(it, 1) : Yt === ".." ? Bt++ : Bt > 0 && (Yt === "" ? (V.splice(it + 1, Bt), Bt = 0) : (V.splice(it, 2), Bt--));
    return A = V.join("/"), A === "" && (A = N ? "/" : "."), _ ? (_.path = A, s(_)) : A;
  });
  r.normalize = l;
  function c(x, A) {
    x === "" && (x = "."), A === "" && (A = ".");
    var _ = i(A), N = i(x);
    if (N && (x = N.path || "/"), _ && !_.scheme)
      return N && (_.scheme = N.scheme), s(_);
    if (_ || A.match(n))
      return A;
    if (N && !N.host && !N.path)
      return N.host = A, s(N);
    var V = A.charAt(0) === "/" ? A : l(x.replace(/\/+$/, "") + "/" + A);
    return N ? (N.path = V, s(N)) : V;
  }
  r.join = c, r.isAbsolute = function(x) {
    return x.charAt(0) === "/" || e.test(x);
  };
  function d(x, A) {
    x === "" && (x = "."), x = x.replace(/\/$/, "");
    for (var _ = 0; A.indexOf(x + "/") !== 0; ) {
      var N = x.lastIndexOf("/");
      if (N < 0 || (x = x.slice(0, N), x.match(/^([^\/]+:\/)?\/*$/)))
        return A;
      ++_;
    }
    return Array(_ + 1).join("../") + A.substr(x.length + 1);
  }
  r.relative = d;
  var f = function() {
    var x = /* @__PURE__ */ Object.create(null);
    return !("__proto__" in x);
  }();
  function h(x) {
    return x;
  }
  function p(x) {
    return b(x) ? "$" + x : x;
  }
  r.toSetString = f ? h : p;
  function m(x) {
    return b(x) ? x.slice(1) : x;
  }
  r.fromSetString = f ? h : m;
  function b(x) {
    if (!x)
      return !1;
    var A = x.length;
    if (A < 9 || x.charCodeAt(A - 1) !== 95 || x.charCodeAt(A - 2) !== 95 || x.charCodeAt(A - 3) !== 111 || x.charCodeAt(A - 4) !== 116 || x.charCodeAt(A - 5) !== 111 || x.charCodeAt(A - 6) !== 114 || x.charCodeAt(A - 7) !== 112 || x.charCodeAt(A - 8) !== 95 || x.charCodeAt(A - 9) !== 95)
      return !1;
    for (var _ = A - 10; _ >= 0; _--)
      if (x.charCodeAt(_) !== 36)
        return !1;
    return !0;
  }
  function k(x, A, _) {
    var N = C(x.source, A.source);
    return N !== 0 || (N = x.originalLine - A.originalLine, N !== 0) || (N = x.originalColumn - A.originalColumn, N !== 0 || _) || (N = x.generatedColumn - A.generatedColumn, N !== 0) || (N = x.generatedLine - A.generatedLine, N !== 0) ? N : C(x.name, A.name);
  }
  r.compareByOriginalPositions = k;
  function v(x, A, _) {
    var N;
    return N = x.originalLine - A.originalLine, N !== 0 || (N = x.originalColumn - A.originalColumn, N !== 0 || _) || (N = x.generatedColumn - A.generatedColumn, N !== 0) || (N = x.generatedLine - A.generatedLine, N !== 0) ? N : C(x.name, A.name);
  }
  r.compareByOriginalPositionsNoSource = v;
  function S(x, A, _) {
    var N = x.generatedLine - A.generatedLine;
    return N !== 0 || (N = x.generatedColumn - A.generatedColumn, N !== 0 || _) || (N = C(x.source, A.source), N !== 0) || (N = x.originalLine - A.originalLine, N !== 0) || (N = x.originalColumn - A.originalColumn, N !== 0) ? N : C(x.name, A.name);
  }
  r.compareByGeneratedPositionsDeflated = S;
  function E(x, A, _) {
    var N = x.generatedColumn - A.generatedColumn;
    return N !== 0 || _ || (N = C(x.source, A.source), N !== 0) || (N = x.originalLine - A.originalLine, N !== 0) || (N = x.originalColumn - A.originalColumn, N !== 0) ? N : C(x.name, A.name);
  }
  r.compareByGeneratedPositionsDeflatedNoLine = E;
  function C(x, A) {
    return x === A ? 0 : x === null ? 1 : A === null ? -1 : x > A ? 1 : -1;
  }
  function I(x, A) {
    var _ = x.generatedLine - A.generatedLine;
    return _ !== 0 || (_ = x.generatedColumn - A.generatedColumn, _ !== 0) || (_ = C(x.source, A.source), _ !== 0) || (_ = x.originalLine - A.originalLine, _ !== 0) || (_ = x.originalColumn - A.originalColumn, _ !== 0) ? _ : C(x.name, A.name);
  }
  r.compareByGeneratedPositionsInflated = I;
  function M(x) {
    return JSON.parse(x.replace(/^\)]}'[^\n]*\n/, ""));
  }
  r.parseSourceMapInput = M;
  function O(x, A, _) {
    if (A = A || "", x && (x[x.length - 1] !== "/" && A[0] !== "/" && (x += "/"), A = x + A), _) {
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
var Dp = {}, ou = Ua, lu = Object.prototype.hasOwnProperty, Kn = typeof Map < "u";
function ln() {
  this._array = [], this._set = Kn ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
}
ln.fromArray = function(r, t) {
  for (var e = new ln(), n = 0, i = r.length; n < i; n++)
    e.add(r[n], t);
  return e;
};
ln.prototype.size = function() {
  return Kn ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
ln.prototype.add = function(r, t) {
  var e = Kn ? r : ou.toSetString(r), n = Kn ? this.has(r) : lu.call(this._set, e), i = this._array.length;
  (!n || t) && this._array.push(r), n || (Kn ? this._set.set(r, i) : this._set[e] = i);
};
ln.prototype.has = function(r) {
  if (Kn)
    return this._set.has(r);
  var t = ou.toSetString(r);
  return lu.call(this._set, t);
};
ln.prototype.indexOf = function(r) {
  if (Kn) {
    var t = this._set.get(r);
    if (t >= 0)
      return t;
  } else {
    var e = ou.toSetString(r);
    if (lu.call(this._set, e))
      return this._set[e];
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
Dp.ArraySet = ln;
var Ip = {}, Np = Ua;
function lx(r, t) {
  var e = r.generatedLine, n = t.generatedLine, i = r.generatedColumn, s = t.generatedColumn;
  return n > e || n == e && s >= i || Np.compareByGeneratedPositionsInflated(r, t) <= 0;
}
function Ha() {
  this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
}
Ha.prototype.unsortedForEach = function(r, t) {
  this._array.forEach(r, t);
};
Ha.prototype.add = function(r) {
  lx(this._last, r) ? (this._last = r, this._array.push(r)) : (this._sorted = !1, this._array.push(r));
};
Ha.prototype.toArray = function() {
  return this._sorted || (this._array.sort(Np.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
};
Ip.MappingList = Ha;
var Ai = iu, dt = Ua, ma = Dp.ArraySet, cx = Ip.MappingList;
function ce(r) {
  r || (r = {}), this._file = dt.getArg(r, "file", null), this._sourceRoot = dt.getArg(r, "sourceRoot", null), this._skipValidation = dt.getArg(r, "skipValidation", !1), this._ignoreInvalidMapping = dt.getArg(r, "ignoreInvalidMapping", !1), this._sources = new ma(), this._names = new ma(), this._mappings = new cx(), this._sourcesContents = null;
}
ce.prototype._version = 3;
ce.fromSourceMap = function(r, t) {
  var e = r.sourceRoot, n = new ce(Object.assign(t || {}, {
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
    i.source != null && (s.source = i.source, e != null && (s.source = dt.relative(e, s.source)), s.original = {
      line: i.originalLine,
      column: i.originalColumn
    }, i.name != null && (s.name = i.name)), n.addMapping(s);
  }), r.sources.forEach(function(i) {
    var s = i;
    e !== null && (s = dt.relative(e, i)), n._sources.has(s) || n._sources.add(s);
    var a = r.sourceContentFor(i);
    a != null && n.setSourceContent(i, a);
  }), n;
};
ce.prototype.addMapping = function(r) {
  var t = dt.getArg(r, "generated"), e = dt.getArg(r, "original", null), n = dt.getArg(r, "source", null), i = dt.getArg(r, "name", null);
  !this._skipValidation && this._validateMapping(t, e, n, i) === !1 || (n != null && (n = String(n), this._sources.has(n) || this._sources.add(n)), i != null && (i = String(i), this._names.has(i) || this._names.add(i)), this._mappings.add({
    generatedLine: t.line,
    generatedColumn: t.column,
    originalLine: e != null && e.line,
    originalColumn: e != null && e.column,
    source: n,
    name: i
  }));
};
ce.prototype.setSourceContent = function(r, t) {
  var e = r;
  this._sourceRoot != null && (e = dt.relative(this._sourceRoot, e)), t != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[dt.toSetString(e)] = t) : this._sourcesContents && (delete this._sourcesContents[dt.toSetString(e)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
};
ce.prototype.applySourceMap = function(r, t, e) {
  var n = t;
  if (t == null) {
    if (r.file == null)
      throw new Error(
        `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
      );
    n = r.file;
  }
  var i = this._sourceRoot;
  i != null && (n = dt.relative(i, n));
  var s = new ma(), a = new ma();
  this._mappings.unsortedForEach(function(o) {
    if (o.source === n && o.originalLine != null) {
      var l = r.originalPositionFor({
        line: o.originalLine,
        column: o.originalColumn
      });
      l.source != null && (o.source = l.source, e != null && (o.source = dt.join(e, o.source)), i != null && (o.source = dt.relative(i, o.source)), o.originalLine = l.line, o.originalColumn = l.column, l.name != null && (o.name = l.name));
    }
    var c = o.source;
    c != null && !s.has(c) && s.add(c);
    var d = o.name;
    d != null && !a.has(d) && a.add(d);
  }, this), this._sources = s, this._names = a, r.sources.forEach(function(o) {
    var l = r.sourceContentFor(o);
    l != null && (e != null && (o = dt.join(e, o)), i != null && (o = dt.relative(i, o)), this.setSourceContent(o, l));
  }, this);
};
ce.prototype._validateMapping = function(r, t, e, n) {
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
ce.prototype._serializeMappings = function() {
  for (var r = 0, t = 1, e = 0, n = 0, i = 0, s = 0, a = "", o, l, c, d, f = this._mappings.toArray(), h = 0, p = f.length; h < p; h++) {
    if (l = f[h], o = "", l.generatedLine !== t)
      for (r = 0; l.generatedLine !== t; )
        o += ";", t++;
    else if (h > 0) {
      if (!dt.compareByGeneratedPositionsInflated(l, f[h - 1]))
        continue;
      o += ",";
    }
    o += Ai.encode(l.generatedColumn - r), r = l.generatedColumn, l.source != null && (d = this._sources.indexOf(l.source), o += Ai.encode(d - s), s = d, o += Ai.encode(l.originalLine - 1 - n), n = l.originalLine - 1, o += Ai.encode(l.originalColumn - e), e = l.originalColumn, l.name != null && (c = this._names.indexOf(l.name), o += Ai.encode(c - i), i = c)), a += o;
  }
  return a;
};
ce.prototype._generateSourcesContent = function(r, t) {
  return r.map(function(e) {
    if (!this._sourcesContents)
      return null;
    t != null && (e = dt.relative(t, e));
    var n = dt.toSetString(e);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
  }, this);
};
ce.prototype.toJSON = function() {
  var r = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  return this._file != null && (r.file = this._file), this._sourceRoot != null && (r.sourceRoot = this._sourceRoot), this._sourcesContents && (r.sourcesContent = this._generateSourcesContent(r.sources, r.sourceRoot)), r;
};
ce.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
};
var ux = ce;
const Ud = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function dx(r) {
  const t = new ux(), e = {
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
    if (h.loc && h.loc.start && Ud.has(h.type)) {
      const p = h.loc.start.line, m = h.loc.start.column - 1;
      (n.line !== p || n.column !== m) && (n.line = p, n.column = m, e.line = a, e.column = o, l && (l = !1, (e.line !== i.line || e.column !== i.column) && t.addMapping(s)), l = !0, t.addMapping({
        source: h.loc.source,
        original: n,
        generated: e
      }));
    }
    c.call(this, h), l && Ud.has(h.type) && (i.line = a, i.column = o);
  };
  const d = r.emit;
  r.emit = function(h, p, m) {
    for (let b = 0; b < h.length; b++)
      h.charCodeAt(b) === 10 ? (a++, o = 0) : o++;
    d(h, p, m);
  };
  const f = r.result;
  return r.result = function() {
    return l && t.addMapping(s), {
      css: f(),
      map: t
    };
  }, r;
}
const hx = 43, fx = 45, ol = (r, t) => {
  if (r === G && (r = t), typeof r == "string") {
    const e = r.charCodeAt(0);
    return e > 127 ? 32768 : e << 8;
  }
  return r;
}, Op = [
  [z, z],
  [z, K],
  [z, It],
  [z, jt],
  [z, "-"],
  [z, F],
  [z, ct],
  [z, Y],
  [z, Ut],
  [z, kt],
  [gt, z],
  [gt, K],
  [gt, It],
  [gt, jt],
  [gt, "-"],
  [gt, F],
  [gt, ct],
  [gt, Y],
  [gt, Ut],
  [ot, z],
  [ot, K],
  [ot, It],
  [ot, jt],
  [ot, "-"],
  [ot, F],
  [ot, ct],
  [ot, Y],
  [ot, Ut],
  [Y, z],
  [Y, K],
  [Y, It],
  [Y, jt],
  [Y, "-"],
  [Y, F],
  [Y, ct],
  [Y, Y],
  [Y, Ut],
  ["#", z],
  ["#", K],
  ["#", It],
  ["#", jt],
  ["#", "-"],
  ["#", F],
  ["#", ct],
  ["#", Y],
  ["#", Ut],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", z],
  ["-", K],
  ["-", It],
  ["-", jt],
  ["-", "-"],
  ["-", F],
  ["-", ct],
  ["-", Y],
  ["-", Ut],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [F, z],
  [F, K],
  [F, It],
  [F, jt],
  [F, F],
  [F, ct],
  [F, Y],
  [F, "%"],
  [F, Ut],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", z],
  ["@", K],
  ["@", It],
  ["@", jt],
  ["@", "-"],
  ["@", Ut],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", F],
  [".", ct],
  [".", Y],
  ["+", F],
  ["+", ct],
  ["+", Y],
  ["/", "*"]
], px = Op.concat([
  [z, ot],
  [Y, ot],
  [ot, ot],
  [gt, kt],
  [gt, We],
  [gt, Mt],
  [ct, ct],
  [ct, Y],
  [ct, K],
  [ct, "-"],
  [rt, z],
  [rt, K],
  [rt, ct],
  [rt, Y],
  [rt, ot],
  [rt, "-"]
]);
function Mp(r) {
  const t = new Set(
    r.map(([e, n]) => ol(e) << 16 | ol(n))
  );
  return function(e, n, i) {
    const s = ol(n, i), a = i.charCodeAt(0);
    return (a === fx && n !== z && n !== K && n !== Ut || a === hx ? t.has(e << 16 | a << 8) : t.has(e << 16 | s)) && this.emit(" ", ut, !0), s;
  };
}
const gx = Mp(Op), qp = Mp(px), Hd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe: qp,
  spec: gx
}, Symbol.toStringTag, { value: "Module" })), mx = 92;
function bx(r, t) {
  if (typeof t == "function") {
    let e = null;
    r.children.forEach((n) => {
      e !== null && t.call(this, e), this.node(n), e = n;
    });
    return;
  }
  r.children.forEach(this.node, this);
}
function yx(r) {
  Fa(r, (t, e, n) => {
    this.token(t, r.slice(e, n));
  });
}
function vx(r) {
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
      tokenBefore: qp,
      token(l, c) {
        s = this.tokenBefore(s, l, c), this.emit(c, l, !1), l === G && c.charCodeAt(0) === mx && this.emit(`
`, ut, !0);
      },
      emit(l) {
        i += l;
      },
      result() {
        return i;
      }
    };
    n && (typeof n.decorator == "function" && (a = n.decorator(a)), n.sourceMap && (a = dx(a)), n.mode in Hd && (a.tokenBefore = Hd[n.mode]));
    const o = {
      node: (l) => a.node(l),
      children: bx,
      token: (l, c) => a.token(l, c),
      tokenize: yx
    };
    return a.node(e), a.result();
  };
}
function wx(r) {
  return {
    fromPlainObject(t) {
      return r(t, {
        enter(e) {
          e.children && !(e.children instanceof pt) && (e.children = new pt().fromArray(e.children));
        }
      }), t;
    },
    toPlainObject(t) {
      return r(t, {
        leave(e) {
          e.children && e.children instanceof pt && (e.children = e.children.toArray());
        }
      }), t;
    }
  };
}
const { hasOwnProperty: cu } = Object.prototype, Ti = function() {
};
function Vd(r) {
  return typeof r == "function" ? r : Ti;
}
function Yd(r, t) {
  return function(e, n, i) {
    e.type === t && r.call(this, e, n, i);
  };
}
function kx(r, t) {
  const e = t.structure, n = [];
  for (const i in e) {
    if (cu.call(e, i) === !1)
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
function xx(r) {
  const t = {};
  for (const e in r.node)
    if (cu.call(r.node, e)) {
      const n = r.node[e];
      if (!n.structure)
        throw new Error("Missed `structure` field in `" + e + "` node type definition");
      t[e] = kx(e, n);
    }
  return t;
}
function Gd(r, t) {
  const e = r.fields.slice(), n = r.context, i = typeof n == "string";
  return t && e.reverse(), function(s, a, o, l) {
    let c;
    i && (c = a[n], a[n] = s);
    for (const d of e) {
      const f = s[d.name];
      if (!d.nullable || f) {
        if (d.type === "list") {
          if (t ? f.reduceRight(l, !1) : f.reduce(l, !1))
            return !0;
        } else if (o(f))
          return !0;
      }
    }
    i && (a[n] = c);
  };
}
function Kd({
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
function Sx(r) {
  const t = xx(r), e = {}, n = {}, i = Symbol("break-walk"), s = Symbol("skip-node");
  for (const c in t)
    cu.call(t, c) && t[c] !== null && (e[c] = Gd(t[c], !1), n[c] = Gd(t[c], !0));
  const a = Kd(e), o = Kd(n), l = function(c, d) {
    function f(v, S, E) {
      const C = h.call(k, v, S, E);
      return C === i ? !0 : C === s ? !1 : !!(m.hasOwnProperty(v.type) && m[v.type](v, k, f, b) || p.call(k, v, S, E) === i);
    }
    let h = Ti, p = Ti, m = e, b = (v, S, E, C) => v || f(S, E, C);
    const k = {
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
    else if (d && (h = Vd(d.enter), p = Vd(d.leave), d.reverse && (m = n), d.visit)) {
      if (a.hasOwnProperty(d.visit))
        m = d.reverse ? o[d.visit] : a[d.visit];
      else if (!t.hasOwnProperty(d.visit))
        throw new Error("Bad value `" + d.visit + "` for `visit` option (should be: " + Object.keys(t).sort().join(", ") + ")");
      h = Yd(h, d.visit), p = Yd(p, d.visit);
    }
    if (h === Ti && p === Ti)
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    f(c);
  };
  return l.break = i, l.skip = s, l.find = function(c, d) {
    let f = null;
    return l(c, function(h, p, m) {
      if (d.call(this, h, p, m))
        return f = h, i;
    }), f;
  }, l.findLast = function(c, d) {
    let f = null;
    return l(c, {
      reverse: !0,
      enter(h, p, m) {
        if (d.call(this, h, p, m))
          return f = h, i;
      }
    }), f;
  }, l.findAll = function(c, d) {
    const f = [];
    return l(c, function(h, p, m) {
      d.call(this, h, p, m) && f.push(h);
    }), f;
  }, l;
}
function Ax(r) {
  return r;
}
function Ex(r) {
  const { min: t, max: e, comma: n } = r;
  return t === 0 && e === 0 ? n ? "#?" : "*" : t === 0 && e === 1 ? "?" : t === 1 && e === 0 ? n ? "#" : "+" : t === 1 && e === 1 ? "" : (n ? "#" : "") + (t === e ? "{" + t + "}" : "{" + t + "," + (e !== 0 ? e : "") + "}");
}
function Cx(r) {
  switch (r.type) {
    case "Range":
      return " [" + (r.min === null ? "-∞" : r.min) + "," + (r.max === null ? "∞" : r.max) + "]";
    default:
      throw new Error("Unknown node type `" + r.type + "`");
  }
}
function Tx(r, t, e, n) {
  const i = r.combinator === " " || n ? r.combinator : " " + r.combinator + " ", s = r.terms.map((a) => uu(a, t, e, n)).join(i);
  return r.explicit || e ? (n || s[0] === "," ? "[" : "[ ") + s + (n ? "]" : " ]") : s;
}
function uu(r, t, e, n) {
  let i;
  switch (r.type) {
    case "Group":
      i = Tx(r, t, e, n) + (r.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return uu(r.term, t, e, n) + t(Ex(r), r);
    case "Type":
      i = "<" + r.name + (r.opts ? t(Cx(r.opts), r.opts) : "") + ">";
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
function du(r, t) {
  let e = Ax, n = !1, i = !1;
  return typeof t == "function" ? e = t : t && (n = !!t.forceBraces, i = !!t.compact, typeof t.decorate == "function" && (e = t.decorate)), uu(r, e, n, i);
}
const Wd = { offset: 0, line: 1, column: 1 };
function Lx(r, t) {
  const e = r.tokens, n = r.longestMatch, i = n < e.length && e[n].node || null, s = i !== t ? i : null;
  let a = 0, o = 0, l = 0, c = "", d, f;
  for (let h = 0; h < e.length; h++) {
    const p = e[h].value;
    h === n && (o = p.length, a = c.length), s !== null && e[h].node === s && (h <= n ? l++ : l = 0), c += p;
  }
  return n === e.length || l > 1 ? (d = js(s || t, "end") || Li(Wd, c), f = Li(d)) : (d = js(s, "start") || Li(js(t, "start") || Wd, c.slice(0, a)), f = js(s, "end") || Li(d, c.substr(a, o))), {
    css: c,
    mismatchOffset: a,
    mismatchLength: o,
    start: d,
    end: f
  };
}
function js(r, t) {
  const e = r && r.loc && r.loc[t];
  return e ? "line" in e ? Li(e) : e : null;
}
function Li({ offset: r, line: t, column: e }, n) {
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
const Ei = function(r, t) {
  const e = ja(
    "SyntaxReferenceError",
    r + (t ? " `" + t + "`" : "")
  );
  return e.reference = t, e;
}, Dx = function(r, t, e, n) {
  const i = ja("SyntaxMatchError", r), {
    css: s,
    mismatchOffset: a,
    mismatchLength: o,
    start: l,
    end: c
  } = Lx(n, e);
  return i.rawMessage = r, i.syntax = t ? du(t) : "<generic>", i.css = s, i.mismatchOffset = a, i.mismatchLength = o, i.message = r + `
  syntax: ` + i.syntax + `
   value: ` + (s || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, l), i.loc = {
    source: e && e.loc && e.loc.source || "<unknown>",
    start: l,
    end: c
  }, i;
}, Us = /* @__PURE__ */ new Map(), wr = /* @__PURE__ */ new Map(), ba = 45, ll = Ix, Qd = Nx;
function hu(r, t) {
  return t = t || 0, r.length - t >= 2 && r.charCodeAt(t) === ba && r.charCodeAt(t + 1) === ba;
}
function _p(r, t) {
  if (t = t || 0, r.length - t >= 3 && r.charCodeAt(t) === ba && r.charCodeAt(t + 1) !== ba) {
    const e = r.indexOf("-", t + 2);
    if (e !== -1)
      return r.substring(t, e + 1);
  }
  return "";
}
function Ix(r) {
  if (Us.has(r))
    return Us.get(r);
  const t = r.toLowerCase();
  let e = Us.get(t);
  if (e === void 0) {
    const n = hu(t, 0), i = n ? "" : _p(t, 0);
    e = Object.freeze({
      basename: t.substr(i.length),
      name: t,
      prefix: i,
      vendor: i,
      custom: n
    });
  }
  return Us.set(r, e), e;
}
function Nx(r) {
  if (wr.has(r))
    return wr.get(r);
  let t = r, e = r[0];
  e === "/" ? e = r[1] === "/" ? "//" : "/" : e !== "_" && e !== "*" && e !== "$" && e !== "#" && e !== "+" && e !== "&" && (e = "");
  const n = hu(t, e.length);
  if (!n && (t = t.toLowerCase(), wr.has(t))) {
    const o = wr.get(t);
    return wr.set(r, o), o;
  }
  const i = n ? "" : _p(t, e.length), s = t.substr(0, e.length + i.length), a = Object.freeze({
    basename: t.substr(s.length),
    name: t.substr(e.length),
    hack: e,
    vendor: i,
    prefix: s,
    custom: n
  });
  return wr.set(r, a), a;
}
const zp = [
  "initial",
  "inherit",
  "unset",
  "revert",
  "revert-layer"
], Xi = 43, Re = 45, cl = 110, kr = !0, Ox = !1;
function Jl(r, t) {
  return r !== null && r.type === G && r.value.charCodeAt(0) === t;
}
function qi(r, t, e) {
  for (; r !== null && (r.type === ut || r.type === Pt); )
    r = e(++t);
  return t;
}
function vn(r, t, e, n) {
  if (!r)
    return 0;
  const i = r.value.charCodeAt(t);
  if (i === Xi || i === Re) {
    if (e)
      return 0;
    t++;
  }
  for (; t < r.value.length; t++)
    if (!xt(r.value.charCodeAt(t)))
      return 0;
  return n + 1;
}
function ul(r, t, e) {
  let n = !1, i = qi(r, t, e);
  if (r = e(i), r === null)
    return t;
  if (r.type !== F)
    if (Jl(r, Xi) || Jl(r, Re)) {
      if (n = !0, i = qi(e(++i), i, e), r = e(i), r === null || r.type !== F)
        return 0;
    } else
      return t;
  if (!n) {
    const s = r.value.charCodeAt(0);
    if (s !== Xi && s !== Re)
      return 0;
  }
  return vn(r, n ? 0 : 1, n, i);
}
function Mx(r, t) {
  let e = 0;
  if (!r)
    return 0;
  if (r.type === F)
    return vn(r, 0, Ox, e);
  if (r.type === z && r.value.charCodeAt(0) === Re) {
    if (!Pr(r.value, 1, cl))
      return 0;
    switch (r.value.length) {
      case 2:
        return ul(t(++e), e, t);
      case 3:
        return r.value.charCodeAt(2) !== Re ? 0 : (e = qi(t(++e), e, t), r = t(e), vn(r, 0, kr, e));
      default:
        return r.value.charCodeAt(2) !== Re ? 0 : vn(r, 3, kr, e);
    }
  } else if (r.type === z || Jl(r, Xi) && t(e + 1).type === z) {
    if (r.type !== z && (r = t(++e)), r === null || !Pr(r.value, 0, cl))
      return 0;
    switch (r.value.length) {
      case 1:
        return ul(t(++e), e, t);
      case 2:
        return r.value.charCodeAt(1) !== Re ? 0 : (e = qi(t(++e), e, t), r = t(e), vn(r, 0, kr, e));
      default:
        return r.value.charCodeAt(1) !== Re ? 0 : vn(r, 2, kr, e);
    }
  } else if (r.type === Y) {
    let n = r.value.charCodeAt(0), i = n === Xi || n === Re ? 1 : 0, s = i;
    for (; s < r.value.length && xt(r.value.charCodeAt(s)); s++)
      ;
    return s === i || !Pr(r.value, s, cl) ? 0 : s + 1 === r.value.length ? ul(t(++e), e, t) : r.value.charCodeAt(s + 1) !== Re ? 0 : s + 2 === r.value.length ? (e = qi(t(++e), e, t), r = t(e), vn(r, 0, kr, e)) : vn(r, s + 2, kr, e);
  }
  return 0;
}
const qx = 43, Rp = 45, Pp = 63, _x = 117;
function tc(r, t) {
  return r !== null && r.type === G && r.value.charCodeAt(0) === t;
}
function zx(r, t) {
  return r.value.charCodeAt(0) === t;
}
function Di(r, t, e) {
  let n = 0;
  for (let i = t; i < r.value.length; i++) {
    const s = r.value.charCodeAt(i);
    if (s === Rp && e && n !== 0)
      return Di(r, t + n + 1, !1), 6;
    if (!Ln(s) || ++n > 6)
      return 0;
  }
  return n;
}
function Hs(r, t, e) {
  if (!r)
    return 0;
  for (; tc(e(t), Pp); ) {
    if (++r > 6)
      return 0;
    t++;
  }
  return t;
}
function Rx(r, t) {
  let e = 0;
  if (r === null || r.type !== z || !Pr(r.value, 0, _x) || (r = t(++e), r === null))
    return 0;
  if (tc(r, qx))
    return r = t(++e), r === null ? 0 : r.type === z ? Hs(Di(r, 0, !0), ++e, t) : tc(r, Pp) ? Hs(1, ++e, t) : 0;
  if (r.type === F) {
    const n = Di(r, 1, !0);
    return n === 0 ? 0 : (r = t(++e), r === null ? e : r.type === Y || r.type === F ? !zx(r, Rp) || !Di(r, 1, !1) ? 0 : e + 1 : Hs(n, e, t));
  }
  return r.type === Y ? Hs(Di(r, 1, !0), ++e, t) : 0;
}
const Px = ["calc(", "-moz-calc(", "-webkit-calc("], fu = /* @__PURE__ */ new Map([
  [K, rt],
  [kt, rt],
  [Xt, Ae],
  [qt, le]
]);
function ke(r, t) {
  return t < r.length ? r.charCodeAt(t) : 0;
}
function Bp(r, t) {
  return Zi(r, 0, r.length, t);
}
function $p(r, t) {
  for (let e = 0; e < t.length; e++)
    if (Bp(r, t[e]))
      return !0;
  return !1;
}
function Fp(r, t) {
  return t !== r.length - 2 ? !1 : ke(r, t) === 92 && // U+005C REVERSE SOLIDUS (\)
  xt(ke(r, t + 1));
}
function Va(r, t, e) {
  if (r && r.type === "Range") {
    const n = Number(
      e !== void 0 && e !== t.length ? t.substr(0, e) : t
    );
    if (isNaN(n) || r.min !== null && n < r.min && typeof r.min != "string" || r.max !== null && n > r.max && typeof r.max != "string")
      return !0;
  }
  return !1;
}
function Bx(r, t) {
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case le:
        case rt:
        case Ae:
          if (r.type !== e)
            break t;
          if (e = n.pop(), n.length === 0) {
            i++;
            break t;
          }
          break;
        case K:
        case kt:
        case Xt:
        case qt:
          n.push(e), e = fu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function ne(r) {
  return function(t, e, n) {
    return t === null ? 0 : t.type === K && $p(t.value, Px) ? Bx(t, e) : r(t, e, n);
  };
}
function st(r) {
  return function(t) {
    return t === null || t.type !== r ? 0 : 1;
  };
}
function $x(r) {
  if (r === null || r.type !== z)
    return 0;
  const t = r.value.toLowerCase();
  return $p(t, zp) || Bp(t, "default") ? 0 : 1;
}
function Fx(r) {
  return r === null || r.type !== z || ke(r.value, 0) !== 45 || ke(r.value, 1) !== 45 ? 0 : 1;
}
function jx(r) {
  if (r === null || r.type !== ot)
    return 0;
  const t = r.value.length;
  if (t !== 4 && t !== 5 && t !== 7 && t !== 9)
    return 0;
  for (let e = 1; e < t; e++)
    if (!Ln(ke(r.value, e)))
      return 0;
  return 1;
}
function Ux(r) {
  return r === null || r.type !== ot || !Xs(ke(r.value, 1), ke(r.value, 2), ke(r.value, 3)) ? 0 : 1;
}
function Hx(r, t) {
  if (!r)
    return 0;
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case Ba:
        case jt:
          break t;
        case le:
        case rt:
        case Ae:
          if (r.type !== e)
            break t;
          e = n.pop();
          break;
        case Vt:
          if (e === 0)
            break t;
          break;
        case G:
          if (e === 0 && r.value === "!")
            break t;
          break;
        case K:
        case kt:
        case Xt:
        case qt:
          n.push(e), e = fu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function Vx(r, t) {
  if (!r)
    return 0;
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case Ba:
        case jt:
          break t;
        case le:
        case rt:
        case Ae:
          if (r.type !== e)
            break t;
          e = n.pop();
          break;
        case K:
        case kt:
        case Xt:
        case qt:
          n.push(e), e = fu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function rn(r) {
  return r && (r = new Set(r)), function(t, e, n) {
    if (t === null || t.type !== Y)
      return 0;
    const i = $a(t.value, 0);
    if (r !== null) {
      const s = t.value.indexOf("\\", i), a = s === -1 || !Fp(t.value, s) ? t.value.substr(i) : t.value.substring(i, s);
      if (r.has(a.toLowerCase()) === !1)
        return 0;
    }
    return Va(n, t.value, i) ? 0 : 1;
  };
}
function Yx(r, t, e) {
  return r === null || r.type !== ct || Va(e, r.value, r.value.length - 1) ? 0 : 1;
}
function jp(r) {
  return typeof r != "function" && (r = function() {
    return 0;
  }), function(t, e, n) {
    return t !== null && t.type === F && Number(t.value) === 0 ? 1 : r(t, e, n);
  };
}
function Gx(r, t, e) {
  if (r === null)
    return 0;
  const n = $a(r.value, 0);
  return n !== r.value.length && !Fp(r.value, n) || Va(e, r.value, n) ? 0 : 1;
}
function Kx(r, t, e) {
  if (r === null || r.type !== F)
    return 0;
  let n = ke(r.value, 0) === 43 || // U+002B PLUS SIGN (+)
  ke(r.value, 0) === 45 ? 1 : 0;
  for (; n < r.value.length; n++)
    if (!xt(ke(r.value, n)))
      return 0;
  return Va(e, r.value, n) ? 0 : 1;
}
const Wx = {
  "ident-token": st(z),
  "function-token": st(K),
  "at-keyword-token": st(gt),
  "hash-token": st(ot),
  "string-token": st(We),
  "bad-string-token": st(Ba),
  "url-token": st(It),
  "bad-url-token": st(jt),
  "delim-token": st(G),
  "number-token": st(F),
  "percentage-token": st(ct),
  "dimension-token": st(Y),
  "whitespace-token": st(ut),
  "CDO-token": st(os),
  "CDC-token": st(Ut),
  "colon-token": st(Mt),
  "semicolon-token": st(Vt),
  "comma-token": st(Qe),
  "[-token": st(Xt),
  "]-token": st(Ae),
  "(-token": st(kt),
  ")-token": st(rt),
  "{-token": st(qt),
  "}-token": st(le)
}, Qx = {
  // token type aliases
  string: st(We),
  ident: st(z),
  // percentage
  percentage: ne(Yx),
  // numeric
  zero: jp(),
  number: ne(Gx),
  integer: ne(Kx),
  // complex types
  "custom-ident": $x,
  "custom-property-name": Fx,
  "hex-color": jx,
  "id-selector": Ux,
  // element( <id-selector> )
  "an-plus-b": Mx,
  urange: Rx,
  "declaration-value": Hx,
  "any-value": Vx
};
function Zx(r) {
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
    dimension: ne(rn(null)),
    angle: ne(rn(t)),
    decibel: ne(rn(e)),
    frequency: ne(rn(n)),
    flex: ne(rn(i)),
    length: ne(jp(rn(s))),
    resolution: ne(rn(a)),
    semitones: ne(rn(o)),
    time: ne(rn(l))
  };
}
function Xx(r) {
  return H(H(H({}, Wx), Qx), Zx(r));
}
const Jx = [
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
], tS = ["deg", "grad", "rad", "turn"], eS = ["s", "ms"], nS = ["hz", "khz"], rS = ["dpi", "dpcm", "dppx", "x"], iS = ["fr"], sS = ["db"], aS = ["st"], Zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angle: tS,
  decibel: sS,
  flex: iS,
  frequency: nS,
  length: Jx,
  resolution: rS,
  semitones: aS,
  time: eS
}, Symbol.toStringTag, { value: "Module" }));
function oS(r, t, e) {
  return Object.assign(ja("SyntaxError", r), {
    input: t,
    offset: e,
    rawMessage: r,
    message: r + `
  ` + t + `
--` + new Array((e || t.length) + 1).join("-") + "^"
  });
}
const lS = 9, cS = 10, uS = 12, dS = 13, hS = 32;
class fS {
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
      if (e !== dS && e !== cS && e !== uS && e !== hS && e !== lS)
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
    throw new oS(t, this.str, this.pos);
  }
}
const pS = 9, gS = 10, mS = 12, bS = 13, yS = 32, Up = 33, pu = 35, Xd = 38, ya = 39, Hp = 40, vS = 41, Vp = 42, gu = 43, mu = 44, Jd = 45, bu = 60, Yp = 62, ec = 63, wS = 64, Ya = 91, yu = 93, va = 123, th = 124, eh = 125, nh = 8734, Ji = new Uint8Array(128).map(
  (r, t) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0
), rh = {
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
  let t = r.pos;
  for (; t < r.str.length; t++) {
    const e = r.str.charCodeAt(t);
    if (e >= 128 || Ji[e] === 0)
      break;
  }
  return r.pos === t && r.error("Expect a keyword"), r.substringToPos(t);
}
function ka(r) {
  let t = r.pos;
  for (; t < r.str.length; t++) {
    const e = r.str.charCodeAt(t);
    if (e < 48 || e > 57)
      break;
  }
  return r.pos === t && r.error("Expect a number"), r.substringToPos(t);
}
function kS(r) {
  const t = r.str.indexOf("'", r.pos + 1);
  return t === -1 && (r.pos = r.str.length, r.error("Expect an apostrophe")), r.substringToPos(t + 1);
}
function ih(r) {
  let t = null, e = null;
  return r.eat(va), t = ka(r), r.charCode() === mu ? (r.pos++, r.charCode() !== eh && (e = ka(r))) : e = t, r.eat(eh), {
    min: Number(t),
    max: e ? Number(e) : 0
  };
}
function xS(r) {
  let t = null, e = !1;
  switch (r.charCode()) {
    case Vp:
      r.pos++, t = {
        min: 0,
        max: 0
      };
      break;
    case gu:
      r.pos++, t = {
        min: 1,
        max: 0
      };
      break;
    case ec:
      r.pos++, t = {
        min: 0,
        max: 1
      };
      break;
    case pu:
      r.pos++, e = !0, r.charCode() === va ? t = ih(r) : r.charCode() === ec ? (r.pos++, t = {
        min: 0,
        max: 0
      }) : t = {
        min: 1,
        max: 0
      };
      break;
    case va:
      t = ih(r);
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
function Xr(r, t) {
  const e = xS(r);
  return e !== null ? (e.term = t, r.charCode() === pu && r.charCodeAt(r.pos - 1) === gu ? Xr(r, e) : e) : t;
}
function dl(r) {
  const t = r.peek();
  return t === "" ? null : {
    type: "Token",
    value: t
  };
}
function SS(r) {
  let t;
  return r.eat(bu), r.eat(ya), t = Zr(r), r.eat(ya), r.eat(Yp), Xr(r, {
    type: "Property",
    name: t
  });
}
function AS(r) {
  let t = null, e = null, n = 1;
  return r.eat(Ya), r.charCode() === Jd && (r.peek(), n = -1), n == -1 && r.charCode() === nh ? r.peek() : (t = n * Number(ka(r)), Ji[r.charCode()] !== 0 && (t += Zr(r))), wa(r), r.eat(mu), wa(r), r.charCode() === nh ? r.peek() : (n = 1, r.charCode() === Jd && (r.peek(), n = -1), e = n * Number(ka(r)), Ji[r.charCode()] !== 0 && (e += Zr(r))), r.eat(yu), {
    type: "Range",
    min: t,
    max: e
  };
}
function ES(r) {
  let t, e = null;
  return r.eat(bu), t = Zr(r), r.charCode() === Hp && r.nextCharCode() === vS && (r.pos += 2, t += "()"), r.charCodeAt(r.findWsEnd(r.pos)) === Ya && (wa(r), e = AS(r)), r.eat(Yp), Xr(r, {
    type: "Type",
    name: t,
    opts: e
  });
}
function CS(r) {
  const t = Zr(r);
  return r.charCode() === Hp ? (r.pos++, {
    type: "Function",
    name: t
  }) : Xr(r, {
    type: "Keyword",
    name: t
  });
}
function TS(r, t) {
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
  for (t = Object.keys(t).sort((i, s) => rh[i] - rh[s]); t.length > 0; ) {
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
function Gp(r) {
  const t = [], e = {};
  let n, i = null, s = r.pos;
  for (; n = DS(r); )
    n.type !== "Spaces" && (n.type === "Combinator" ? ((i === null || i.type === "Combinator") && (r.pos = s, r.error("Unexpected combinator")), e[n.value] = !0) : i !== null && i.type !== "Combinator" && (e[" "] = !0, t.push({
      type: "Combinator",
      value: " "
    })), t.push(n), i = n, s = r.pos);
  return i !== null && i.type === "Combinator" && (r.pos -= s, r.error("Unexpected combinator")), {
    type: "Group",
    terms: t,
    combinator: TS(t, e) || " ",
    disallowEmpty: !1,
    explicit: !1
  };
}
function LS(r) {
  let t;
  return r.eat(Ya), t = Gp(r), r.eat(yu), t.explicit = !0, r.charCode() === Up && (r.pos++, t.disallowEmpty = !0), t;
}
function DS(r) {
  let t = r.charCode();
  if (t < 128 && Ji[t] === 1)
    return CS(r);
  switch (t) {
    case yu:
      break;
    case Ya:
      return Xr(r, LS(r));
    case bu:
      return r.nextCharCode() === ya ? SS(r) : ES(r);
    case th:
      return {
        type: "Combinator",
        value: r.substringToPos(
          r.pos + (r.nextCharCode() === th ? 2 : 1)
        )
      };
    case Xd:
      return r.pos++, r.eat(Xd), {
        type: "Combinator",
        value: "&&"
      };
    case mu:
      return r.pos++, {
        type: "Comma"
      };
    case ya:
      return Xr(r, {
        type: "String",
        value: kS(r)
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
      return t = r.nextCharCode(), t < 128 && Ji[t] === 1 ? (r.pos++, {
        type: "AtKeyword",
        name: Zr(r)
      }) : dl(r);
    case Vp:
    case gu:
    case ec:
    case pu:
    case Up:
      break;
    case va:
      if (t = r.nextCharCode(), t < 48 || t > 57)
        return dl(r);
      break;
    default:
      return dl(r);
  }
}
function Kp(r) {
  const t = new fS(r), e = Gp(t);
  return t.pos !== r.length && t.error("Unexpected input"), e.terms.length === 1 && e.terms[0].type === "Group" ? e.terms[0] : e;
}
const Ii = function() {
};
function sh(r) {
  return typeof r == "function" ? r : Ii;
}
function IS(r, t, e) {
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
  let i = Ii, s = Ii;
  if (typeof t == "function" ? i = t : t && (i = sh(t.enter), s = sh(t.leave)), i === Ii && s === Ii)
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  n(r);
}
const NS = {
  decorator(r) {
    const t = [];
    let e = null;
    return zt(H({}, r), {
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
function OS(r) {
  const t = [];
  return Fa(
    r,
    (e, n, i) => t.push({
      type: e,
      value: r.slice(n, i),
      node: null
    })
  ), t;
}
function MS(r, t) {
  return typeof r == "string" ? OS(r) : t.generate(r, NS);
}
const Z = { type: "Match" }, nt = { type: "Mismatch" }, vu = { type: "DisallowEmpty" }, qS = 40, _S = 41;
function Dt(r, t, e) {
  return t === Z && e === nt || r === Z && t === Z && e === Z ? r : (r.type === "If" && r.else === nt && t === Z && (t = r.then, r = r.match), {
    type: "If",
    match: r,
    then: t,
    else: e
  });
}
function Wp(r) {
  return r.length > 2 && r.charCodeAt(r.length - 2) === qS && r.charCodeAt(r.length - 1) === _S;
}
function ah(r) {
  return r.type === "Keyword" || r.type === "AtKeyword" || r.type === "Function" || r.type === "Type" && Wp(r.name);
}
function nc(r, t, e) {
  switch (r) {
    case " ": {
      let n = Z;
      for (let i = t.length - 1; i >= 0; i--) {
        const s = t[i];
        n = Dt(
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
        if (ah(a) && (i === null && s > 0 && ah(t[s - 1]) && (i = /* @__PURE__ */ Object.create(null), n = Dt(
          {
            type: "Enum",
            map: i
          },
          Z,
          n
        )), i !== null)) {
          const o = (Wp(a.name) ? a.name.slice(0, -1) : a.name).toLowerCase();
          if (!(o in i)) {
            i[o] = a;
            continue;
          }
        }
        i = null, n = Dt(
          a,
          Z,
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
        t.length > 1 ? a = nc(
          r,
          t.filter(function(o) {
            return o !== s;
          }),
          !1
        ) : a = Z, n = Dt(
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
      let n = e ? Z : nt;
      for (let i = t.length - 1; i >= 0; i--) {
        const s = t[i];
        let a;
        t.length > 1 ? a = nc(
          r,
          t.filter(function(o) {
            return o !== s;
          }),
          !0
        ) : a = Z, n = Dt(
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
  let t = Z, e = wu(r.term);
  if (r.max === 0)
    e = Dt(
      e,
      vu,
      nt
    ), t = Dt(
      e,
      null,
      // will be a loop
      nt
    ), t.then = Dt(
      Z,
      Z,
      t
      // make a loop
    ), r.comma && (t.then.else = Dt(
      { type: "Comma", syntax: r },
      t,
      nt
    ));
  else
    for (let n = r.min || 1; n <= r.max; n++)
      r.comma && t !== Z && (t = Dt(
        { type: "Comma", syntax: r },
        t,
        nt
      )), t = Dt(
        e,
        Dt(
          Z,
          Z,
          t
        ),
        nt
      );
  if (r.min === 0)
    t = Dt(
      Z,
      Z,
      t
    );
  else
    for (let n = 0; n < r.min - 1; n++)
      r.comma && t !== Z && (t = Dt(
        { type: "Comma", syntax: r },
        t,
        nt
      )), t = Dt(
        e,
        t,
        nt
      );
  return t;
}
function wu(r) {
  if (typeof r == "function")
    return {
      type: "Generic",
      fn: r
    };
  switch (r.type) {
    case "Group": {
      let t = nc(
        r.combinator,
        r.terms.map(wu),
        !1
      );
      return r.disallowEmpty && (t = Dt(
        t,
        vu,
        nt
      )), t;
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
function rc(r, t) {
  return typeof r == "string" && (r = Kp(r)), {
    type: "MatchGraph",
    match: wu(r),
    syntax: t || null,
    source: r
  };
}
const { hasOwnProperty: oh } = Object.prototype, RS = 0, PS = 1, ic = 2, Qp = 3, lh = "Match", BS = "Mismatch", $S = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", ch = 15e3;
function FS(r) {
  let t = null, e = null, n = r;
  for (; n !== null; )
    e = n.prev, n.prev = t, t = n, n = e;
  return t;
}
function hl(r, t) {
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
function jS(r) {
  return r.type !== G ? !1 : r.value !== "?";
}
function uh(r) {
  return r === null ? !0 : r.type === Qe || r.type === K || r.type === kt || r.type === Xt || r.type === qt || jS(r);
}
function dh(r) {
  return r === null ? !0 : r.type === rt || r.type === Ae || r.type === le || r.type === G && r.value === "/";
}
function US(r, t, e) {
  function n() {
    do
      S++, v = S < r.length ? r[S] : null;
    while (v !== null && (v.type === ut || v.type === Pt));
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
    p = s(I, p);
  }
  function l() {
    C = {
      type: PS,
      syntax: t.syntax,
      token: v,
      prev: C
    }, n(), m = null, S > E && (E = S);
  }
  function c() {
    f = {
      syntax: t.syntax,
      opts: t.syntax.opts || f !== null && f.opts || null,
      prev: f
    }, C = {
      type: ic,
      syntax: t.syntax,
      token: C.token,
      prev: C
    };
  }
  function d() {
    C.type === ic ? C = C.prev : C = {
      type: Qp,
      syntax: f.syntax,
      token: C.token,
      prev: C
    }, f = f.prev;
  }
  let f = null, h = null, p = null, m = null, b = 0, k = null, v = null, S = -1, E = 0, C = {
    type: RS,
    syntax: null,
    token: null,
    prev: null
  };
  for (n(); k === null && ++b < ch; )
    switch (t.type) {
      case "Match":
        if (h === null) {
          if (v !== null && (S !== r.length - 1 || v.value !== "\\0" && v.value !== "\\9")) {
            t = nt;
            break;
          }
          k = lh;
          break;
        }
        if (t = h.nextState, t === vu)
          if (h.matchStack === C) {
            t = nt;
            break;
          } else
            t = Z;
        for (; h.syntaxStack !== f; )
          d();
        h = h.prev;
        break;
      case "Mismatch":
        if (m !== null && m !== !1)
          (p === null || S > p.tokenIndex) && (p = m, m = !1);
        else if (p === null) {
          k = BS;
          break;
        }
        t = p.nextState, h = p.thenStack, f = p.syntaxStack, C = p.matchStack, S = p.tokenIndex, v = S < r.length ? r[S] : null, p = p.prev;
        break;
      case "MatchGraph":
        t = t.match;
        break;
      case "If":
        t.else !== nt && o(t.else), t.then !== Z && a(t.then), t = t.match;
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
        const O = t.syntax.terms;
        if (t.index === O.length) {
          if (t.mask === 0 || t.syntax.all) {
            t = nt;
            break;
          }
          t = Z;
          break;
        }
        if (t.mask === (1 << O.length) - 1) {
          t = Z;
          break;
        }
        for (; t.index < O.length; t.index++) {
          const x = 1 << t.index;
          if (!(t.mask & x)) {
            o(t), a({
              type: "AddMatchOnce",
              syntax: t.syntax,
              mask: t.mask | x
            }), t = O[t.index++];
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
          let O = v.value.toLowerCase();
          if (O.indexOf("\\") !== -1 && (O = O.replace(/\\[09].*$/, "")), oh.call(t.map, O)) {
            t = t.map[O];
            break;
          }
        }
        t = nt;
        break;
      case "Generic": {
        const O = f !== null ? f.opts : null, x = S + Math.floor(t.fn(v, i, O));
        if (!isNaN(x) && x > S) {
          for (; S < x; )
            l();
          t = Z;
        } else
          t = nt;
        break;
      }
      case "Type":
      case "Property": {
        const O = t.type === "Type" ? "types" : "properties", x = oh.call(e, O) ? e[O][t.name] : null;
        if (!x || !x.match)
          throw new Error(
            "Bad syntax reference: " + (t.type === "Type" ? "<" + t.name + ">" : "<'" + t.name + "'>")
          );
        if (m !== !1 && v !== null && t.type === "Type" && // https://drafts.csswg.org/css-values-4/#custom-idents
        // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
        // can only claim the keyword if no other unfulfilled production can claim it.
        (t.name === "custom-ident" && v.type === z || // https://drafts.csswg.org/css-values-4/#lengths
        // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
        // it must parse as a <number>
        t.name === "length" && v.value === "0")) {
          m === null && (m = s(t, p)), t = nt;
          break;
        }
        c(), t = x.match;
        break;
      }
      case "Keyword": {
        const O = t.name;
        if (v !== null) {
          let x = v.value;
          if (x.indexOf("\\") !== -1 && (x = x.replace(/\\[09].*$/, "")), hl(x, O)) {
            l(), t = Z;
            break;
          }
        }
        t = nt;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (v !== null && hl(v.value, t.name)) {
          l(), t = Z;
          break;
        }
        t = nt;
        break;
      case "Token":
        if (v !== null && v.value === t.value) {
          l(), t = Z;
          break;
        }
        t = nt;
        break;
      case "Comma":
        v !== null && v.type === Qe ? uh(C.token) ? t = nt : (l(), t = dh(v) ? nt : Z) : t = uh(C.token) || dh(v) ? Z : nt;
        break;
      case "String":
        let I = "", M = S;
        for (; M < r.length && I.length < t.value.length; M++)
          I += r[M].value;
        if (hl(I, t.value)) {
          for (; S < M; )
            l();
          t = Z;
        } else
          t = nt;
        break;
      default:
        throw new Error("Unknown node type: " + t.type);
    }
  switch (k) {
    case null:
      console.warn("[csstree-match] BREAK after " + ch + " iterations"), k = $S, C = null;
      break;
    case lh:
      for (; f !== null; )
        d();
      break;
    default:
      C = null;
  }
  return {
    tokens: r,
    reason: k,
    iterations: b,
    match: C,
    longestMatch: E
  };
}
function hh(r, t, e) {
  const n = US(r, t, e || {});
  if (n.match === null)
    return n;
  let i = n.match, s = n.match = {
    syntax: t.syntax || null,
    match: []
  };
  const a = [s];
  for (i = FS(i).prev; i !== null; ) {
    switch (i.type) {
      case ic:
        s.match.push(s = {
          syntax: i.syntax,
          match: []
        }), a.push(s);
        break;
      case Qp:
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
function Zp(r) {
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
function HS(r, t) {
  return ku(this, r, (e) => e.type === "Type" && e.name === t);
}
function VS(r, t) {
  return ku(this, r, (e) => e.type === "Property" && e.name === t);
}
function YS(r) {
  return ku(this, r, (t) => t.type === "Keyword");
}
function ku(r, t, e) {
  const n = Zp.call(r, t);
  return n === null ? !1 : n.some(e);
}
const GS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getTrace: Zp,
  isKeyword: YS,
  isProperty: VS,
  isType: HS
}, Symbol.toStringTag, { value: "Module" }));
function Xp(r) {
  return "node" in r ? r.node : Xp(r.match[0]);
}
function Jp(r) {
  return "node" in r ? r.node : Jp(r.match[r.match.length - 1]);
}
function fh(r, t, e, n, i) {
  function s(o) {
    if (o.syntax !== null && o.syntax.type === n && o.syntax.name === i) {
      const l = Xp(o), c = Jp(o);
      r.syntax.walk(t, function(d, f, h) {
        if (d === l) {
          const p = new pt();
          do {
            if (p.appendData(f.data), f.data === c)
              break;
            f = f.next;
          } while (f !== null);
          a.push({
            parent: h,
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
const { hasOwnProperty: _i } = Object.prototype;
function fl(r) {
  return typeof r == "number" && isFinite(r) && Math.floor(r) === r && r >= 0;
}
function ph(r) {
  return !!r && fl(r.offset) && fl(r.line) && fl(r.column);
}
function KS(r, t) {
  return function(e, n) {
    if (!e || e.constructor !== Object)
      return n(e, "Type of node should be an Object");
    for (let i in e) {
      let s = !0;
      if (_i.call(e, i) !== !1) {
        if (i === "type")
          e.type !== r && n(e, "Wrong node type `" + e.type + "`, expected `" + r + "`");
        else if (i === "loc") {
          if (e.loc === null)
            continue;
          if (e.loc && e.loc.constructor === Object)
            if (typeof e.loc.source != "string")
              i += ".source";
            else if (!ph(e.loc.start))
              i += ".start";
            else if (!ph(e.loc.end))
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
                typeof o == "string" ? s = e[i] && e[i].type === o : Array.isArray(o) && (s = e[i] instanceof pt);
            }
          }
        } else
          n(e, "Unknown field `" + i + "` for " + r + " node type");
        s || n(e, "Bad value for `" + r + "." + i + "`");
      }
    }
    for (const i in t)
      _i.call(t, i) && _i.call(e, i) === !1 && n(e, "Field `" + r + "." + i + "` is missed");
  };
}
function WS(r, t) {
  const e = t.structure, n = {
    type: String,
    loc: !0
  }, i = {
    type: '"' + r + '"'
  };
  for (const s in e) {
    if (_i.call(e, s) === !1)
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
    check: KS(r, n)
  };
}
function QS(r) {
  const t = {};
  if (r.node) {
    for (const e in r.node)
      if (_i.call(r.node, e)) {
        const n = r.node[e];
        if (n.structure)
          t[e] = WS(e, n);
        else
          throw new Error("Missed `structure` field in `" + e + "` node type definition");
      }
  }
  return t;
}
const ZS = rc(zp.join(" | "));
function sc(r, t, e) {
  const n = {};
  for (const i in r)
    r[i].syntax && (n[i] = e ? r[i].syntax : du(r[i].syntax, { compact: t }));
  return n;
}
function XS(r, t, e) {
  const n = {};
  for (const [i, s] of Object.entries(r))
    n[i] = {
      prelude: s.prelude && (e ? s.prelude.syntax : du(s.prelude.syntax, { compact: t })),
      descriptors: s.descriptors && sc(s.descriptors, t, e)
    };
  return n;
}
function JS(r) {
  for (let t = 0; t < r.length; t++)
    if (r[t].value.toLowerCase() === "var(")
      return !0;
  return !1;
}
function me(r, t, e) {
  return H({
    matched: r,
    iterations: e,
    error: t
  }, GS);
}
function xr(r, t, e, n) {
  const i = MS(e, r.syntax);
  let s;
  return JS(i) ? me(null, new Error("Matching for a tree with var() is not supported")) : (n && (s = hh(i, r.cssWideKeywordsSyntax, r)), (!n || !s.match) && (s = hh(i, t.match, r), !s.match) ? me(
    null,
    new Dx(s.reason, t.syntax, e, s),
    s.iterations
  ) : me(s.match, null, s.iterations));
}
class gh {
  constructor(t, e, n) {
    if (this.cssWideKeywordsSyntax = ZS, this.syntax = e, this.generic = !1, this.units = H({}, Zd), this.atrules = /* @__PURE__ */ Object.create(null), this.properties = /* @__PURE__ */ Object.create(null), this.types = /* @__PURE__ */ Object.create(null), this.structure = n || QS(t), t) {
      if (t.units)
        for (const i of Object.keys(Zd))
          Array.isArray(t.units[i]) && (this.units[i] = t.units[i]);
      if (t.types)
        for (const i in t.types)
          this.addType_(i, t.types[i]);
      if (t.generic) {
        this.generic = !0;
        for (const [i, s] of Object.entries(Xx(this.units)))
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
    return typeof t == "function" ? a.match = rc(t, s) : (typeof t == "string" ? Object.defineProperty(a, "syntax", {
      get() {
        return Object.defineProperty(a, "syntax", {
          value: Kp(t)
        }), a.syntax;
      }
    }) : a.syntax = t, Object.defineProperty(a, "match", {
      get() {
        return Object.defineProperty(a, "match", {
          value: rc(a.syntax, s)
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
      return new Ei("Unknown at-rule", "@" + t);
  }
  checkAtrulePrelude(t, e) {
    const n = this.checkAtruleName(t);
    if (n)
      return n;
    const i = this.getAtrule(t);
    if (!i.prelude && e)
      return new SyntaxError("At-rule `@" + t + "` should not contain a prelude");
    if (i.prelude && !e && !xr(this, i.prelude, "", !1).matched)
      return new SyntaxError("At-rule `@" + t + "` should contain a prelude");
  }
  checkAtruleDescriptorName(t, e) {
    const n = this.checkAtruleName(t);
    if (n)
      return n;
    const i = this.getAtrule(t), s = ll(e);
    if (!i.descriptors)
      return new SyntaxError("At-rule `@" + t + "` has no known descriptors");
    if (!i.descriptors[s.name] && !i.descriptors[s.basename])
      return new Ei("Unknown at-rule descriptor", e);
  }
  checkPropertyName(t) {
    if (!this.getProperty(t))
      return new Ei("Unknown property", t);
  }
  matchAtrulePrelude(t, e) {
    const n = this.checkAtrulePrelude(t, e);
    if (n)
      return me(null, n);
    const i = this.getAtrule(t);
    return i.prelude ? xr(this, i.prelude, e || "", !1) : me(null, null);
  }
  matchAtruleDescriptor(t, e, n) {
    const i = this.checkAtruleDescriptorName(t, e);
    if (i)
      return me(null, i);
    const s = this.getAtrule(t), a = ll(e);
    return xr(this, s.descriptors[a.name] || s.descriptors[a.basename], n, !1);
  }
  matchDeclaration(t) {
    return t.type !== "Declaration" ? me(null, new Error("Not a Declaration node")) : this.matchProperty(t.property, t.value);
  }
  matchProperty(t, e) {
    if (Qd(t).custom)
      return me(null, new Error("Lexer matching doesn't applicable for custom properties"));
    const n = this.checkPropertyName(t);
    return n ? me(null, n) : xr(this, this.getProperty(t), e, !0);
  }
  matchType(t, e) {
    const n = this.getType(t);
    return n ? xr(this, n, e, !1) : me(null, new Ei("Unknown type", t));
  }
  match(t, e) {
    return typeof t != "string" && (!t || !t.type) ? me(null, new Ei("Bad syntax")) : ((typeof t == "string" || !t.match) && (t = this.createDescriptor(t, "Type", "anonymous")), xr(this, t, e, !1));
  }
  findValueFragments(t, e, n, i) {
    return fh(this, e, this.matchProperty(t, e), n, i);
  }
  findDeclarationValueFragments(t, e, n) {
    return fh(this, t.value, this.matchDeclaration(t), e, n);
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
    const n = ll(t);
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
    const n = Qd(t);
    return (n.vendor && e ? this.properties[n.name] || this.properties[n.basename] : this.properties[n.name]) || null;
  }
  getType(t) {
    return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
  }
  validate() {
    function t(i, s, a, o) {
      if (a.has(s))
        return a.get(s);
      a.set(s, !1), o.syntax !== null && IS(o.syntax, function(l) {
        if (l.type !== "Type" && l.type !== "Property")
          return;
        const c = l.type === "Type" ? i.types : i.properties, d = l.type === "Type" ? e : n;
        (!hasOwnProperty.call(c, l.name) || t(i, l.name, d, c[l.name])) && a.set(s, !0);
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
      types: sc(this.types, !e, t),
      properties: sc(this.properties, !e, t),
      atrules: XS(this.atrules, !e, t)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
}
function pl(r, t) {
  return typeof t == "string" && /^\s*\|/.test(t) ? typeof r == "string" ? r + t : t.replace(/^\s*\|\s*/, "") : t || null;
}
function mh(r, t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const [n, i] of Object.entries(r))
    if (i) {
      e[n] = {};
      for (const s of Object.keys(i))
        t.includes(s) && (e[n][s] = i[s]);
    }
  return e;
}
function ac(r, t) {
  const e = H({}, r);
  for (const [n, i] of Object.entries(t))
    switch (n) {
      case "generic":
        e[n] = !!i;
        break;
      case "units":
        e[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = Array.isArray(a) ? a : [];
        break;
      case "atrules":
        e[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i)) {
          const o = e[n][s] || {}, l = e[n][s] = {
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
        e[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = pl(e[n][s], a);
        break;
      case "scope":
        e[n] = H({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = H(H({}, e[n][s]), a);
        break;
      case "parseContext":
        e[n] = H(H({}, r[n]), i);
        break;
      case "atrule":
      case "pseudo":
        e[n] = H(H({}, r[n]), mh(i, ["parse"]));
        break;
      case "node":
        e[n] = H(H({}, r[n]), mh(i, ["name", "structure", "parse", "generate", "walkContext"]));
        break;
    }
  return e;
}
function tg(r) {
  const t = sx(r), e = Sx(r), n = vx(r), { fromPlainObject: i, toPlainObject: s } = wx(e), a = {
    lexer: null,
    createLexer: (o) => new gh(o, a, a.lexer.structure),
    tokenize: Fa,
    parse: t,
    generate: n,
    walk: e,
    find: e.find,
    findLast: e.findLast,
    findAll: e.findAll,
    fromPlainObject: i,
    toPlainObject: s,
    fork(o) {
      const l = ac({}, r);
      return tg(
        typeof o == "function" ? o(l, Object.assign) : ac(l, o)
      );
    }
  };
  return a.lexer = new gh({
    generic: !0,
    units: r.units,
    types: r.types,
    atrules: r.atrules,
    properties: r.properties,
    node: r.node
  }, a), a;
}
const tA = (r) => tg(ac({}, r)), eA = {
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
}, Be = 43, Gt = 45, ta = 110, $n = !0, nA = !1;
function ea(r, t) {
  let e = this.tokenStart + r;
  const n = this.charCodeAt(e);
  for ((n === Be || n === Gt) && (t && this.error("Number sign is not allowed"), e++); e < this.tokenEnd; e++)
    xt(this.charCodeAt(e)) || this.error("Integer is expected", e);
}
function Dr(r) {
  return ea.call(this, 0, r);
}
function bn(r, t) {
  if (!this.cmpChar(this.tokenStart + r, t)) {
    let e = "";
    switch (t) {
      case ta:
        e = "N is expected";
        break;
      case Gt:
        e = "HyphenMinus is expected";
        break;
    }
    this.error(e, this.tokenStart + r);
  }
}
function gl() {
  let r = 0, t = 0, e = this.tokenType;
  for (; e === ut || e === Pt; )
    e = this.lookupType(++r);
  if (e !== F)
    if (this.isDelim(Be, r) || this.isDelim(Gt, r)) {
      t = this.isDelim(Be, r) ? Be : Gt;
      do
        e = this.lookupType(++r);
      while (e === ut || e === Pt);
      e !== F && (this.skip(r), Dr.call(this, $n));
    } else
      return null;
  return r > 0 && this.skip(r), t === 0 && (e = this.charCodeAt(this.tokenStart), e !== Be && e !== Gt && this.error("Number sign is expected")), Dr.call(this, t !== 0), t === Gt ? "-" + this.consume(F) : this.consume(F);
}
const rA = "AnPlusB", iA = {
  a: [String, null],
  b: [String, null]
};
function eg() {
  const r = this.tokenStart;
  let t = null, e = null;
  if (this.tokenType === F)
    Dr.call(this, nA), e = this.consume(F);
  else if (this.tokenType === z && this.cmpChar(this.tokenStart, Gt))
    switch (t = "-1", bn.call(this, 1, ta), this.tokenEnd - this.tokenStart) {
      case 2:
        this.next(), e = gl.call(this);
        break;
      case 3:
        bn.call(this, 2, Gt), this.next(), this.skipSC(), Dr.call(this, $n), e = "-" + this.consume(F);
        break;
      default:
        bn.call(this, 2, Gt), ea.call(this, 3, $n), this.next(), e = this.substrToCursor(r + 2);
    }
  else if (this.tokenType === z || this.isDelim(Be) && this.lookupType(1) === z) {
    let n = 0;
    switch (t = "1", this.isDelim(Be) && (n = 1, this.next()), bn.call(this, 0, ta), this.tokenEnd - this.tokenStart) {
      case 1:
        this.next(), e = gl.call(this);
        break;
      case 2:
        bn.call(this, 1, Gt), this.next(), this.skipSC(), Dr.call(this, $n), e = "-" + this.consume(F);
        break;
      default:
        bn.call(this, 1, Gt), ea.call(this, 2, $n), this.next(), e = this.substrToCursor(r + n + 1);
    }
  } else if (this.tokenType === Y) {
    const n = this.charCodeAt(this.tokenStart), i = n === Be || n === Gt;
    let s = this.tokenStart + i;
    for (; s < this.tokenEnd && xt(this.charCodeAt(s)); s++)
      ;
    s === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), bn.call(this, s - this.tokenStart, ta), t = this.substring(r, s), s + 1 === this.tokenEnd ? (this.next(), e = gl.call(this)) : (bn.call(this, s - this.tokenStart + 1, Gt), s + 2 === this.tokenEnd ? (this.next(), this.skipSC(), Dr.call(this, $n), e = "-" + this.consume(F)) : (ea.call(this, s - this.tokenStart + 2, $n), this.next(), e = this.substrToCursor(s + 1)));
  } else
    this.error();
  return t !== null && t.charCodeAt(0) === Be && (t = t.substr(1)), e !== null && e.charCodeAt(0) === Be && (e = e.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(r, this.tokenStart),
    a: t,
    b: e
  };
}
function sA(r) {
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
const aA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: sA,
  name: rA,
  parse: eg,
  structure: iA
}, Symbol.toStringTag, { value: "Module" }));
function bh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function oA() {
  for (let r = 1, t; t = this.lookupType(r); r++) {
    if (t === le)
      return !0;
    if (t === qt || t === gt)
      return !1;
  }
  return !1;
}
const lA = "Atrule", cA = "atrule", uA = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function ng(r = !1) {
  const t = this.tokenStart;
  let e, n, i = null, s = null;
  switch (this.eat(gt), e = this.substrToCursor(t + 1), n = e.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== qt && this.tokenType !== Vt && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, e, r), bh) : i = bh.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case Vt:
      this.next();
      break;
    case qt:
      hasOwnProperty.call(this.atrule, n) && typeof this.atrule[n].block == "function" ? s = this.atrule[n].block.call(this, r) : s = this.Block(oA.call(this));
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
function dA(r) {
  this.token(gt, "@" + r.name), r.prelude !== null && this.node(r.prelude), r.block ? this.node(r.block) : this.token(Vt, ";");
}
const hA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: dA,
  name: lA,
  parse: ng,
  structure: uA,
  walkContext: cA
}, Symbol.toStringTag, { value: "Module" })), fA = "AtrulePrelude", pA = "atrulePrelude", gA = {
  children: [[]]
};
function rg(r) {
  let t = null;
  return r !== null && (r = r.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, r) && typeof this.atrule[r].prelude == "function" ? t = this.atrule[r].prelude.call(this) : t = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== qt && this.tokenType !== Vt && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function mA(r) {
  this.children(r);
}
const bA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: mA,
  name: fA,
  parse: rg,
  structure: gA,
  walkContext: pA
}, Symbol.toStringTag, { value: "Module" })), yA = 36, ig = 42, na = 61, vA = 94, oc = 124, wA = 126;
function kA() {
  this.eof && this.error("Unexpected end of input");
  const r = this.tokenStart;
  let t = !1;
  return this.isDelim(ig) ? (t = !0, this.next()) : this.isDelim(oc) || this.eat(z), this.isDelim(oc) ? this.charCodeAt(this.tokenStart + 1) !== na ? (this.next(), this.eat(z)) : t && this.error("Identifier is expected", this.tokenEnd) : t && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function xA() {
  const r = this.tokenStart, t = this.charCodeAt(r);
  return t !== na && // =
  t !== wA && // ~=
  t !== vA && // ^=
  t !== yA && // $=
  t !== ig && // *=
  t !== oc && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), t !== na && (this.isDelim(na) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(r);
}
const SA = "AttributeSelector", AA = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function sg() {
  const r = this.tokenStart;
  let t, e = null, n = null, i = null;
  return this.eat(Xt), this.skipSC(), t = kA.call(this), this.skipSC(), this.tokenType !== Ae && (this.tokenType !== z && (e = xA.call(this), this.skipSC(), n = this.tokenType === We ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === z && (i = this.consume(z), this.skipSC())), this.eat(Ae), {
    type: "AttributeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: t,
    matcher: e,
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
  parse: sg,
  structure: AA
}, Symbol.toStringTag, { value: "Module" })), TA = 38;
function ag(r) {
  return this.Raw(r, null, !0);
}
function yh() {
  return this.parseWithFallback(this.Rule, ag);
}
function vh(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
function LA() {
  if (this.tokenType === Vt)
    return vh.call(this, this.tokenIndex);
  const r = this.parseWithFallback(this.Declaration, vh);
  return this.tokenType === Vt && this.next(), r;
}
const DA = "Block", IA = "block", NA = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function og(r) {
  const t = r ? LA : yh, e = this.tokenStart;
  let n = this.createList();
  this.eat(qt);
  t:
    for (; !this.eof; )
      switch (this.tokenType) {
        case le:
          break t;
        case ut:
        case Pt:
          this.next();
          break;
        case gt:
          n.push(this.parseWithFallback(this.Atrule.bind(this, r), ag));
          break;
        default:
          r && this.isDelim(TA) ? n.push(yh.call(this)) : n.push(t.call(this));
      }
  return this.eof || this.eat(le), {
    type: "Block",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function OA(r) {
  this.token(qt, "{"), this.children(r, (t) => {
    t.type === "Declaration" && this.token(Vt, ";");
  }), this.token(le, "}");
}
const MA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OA,
  name: DA,
  parse: og,
  structure: NA,
  walkContext: IA
}, Symbol.toStringTag, { value: "Module" })), qA = "Brackets", _A = {
  children: [[]]
};
function lg(r, t) {
  const e = this.tokenStart;
  let n = null;
  return this.eat(Xt), n = r.call(this, t), this.eof || this.eat(Ae), {
    type: "Brackets",
    loc: this.getLocation(e, this.tokenStart),
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
  parse: lg,
  structure: _A
}, Symbol.toStringTag, { value: "Module" })), PA = "CDC", BA = [];
function cg() {
  const r = this.tokenStart;
  return this.eat(Ut), {
    type: "CDC",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function $A() {
  this.token(Ut, "-->");
}
const FA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: $A,
  name: PA,
  parse: cg,
  structure: BA
}, Symbol.toStringTag, { value: "Module" })), jA = "CDO", UA = [];
function ug() {
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
  parse: ug,
  structure: UA
}, Symbol.toStringTag, { value: "Module" })), YA = 46, GA = "ClassSelector", KA = {
  name: String
};
function dg() {
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
  parse: dg,
  structure: KA
}, Symbol.toStringTag, { value: "Module" })), ZA = 43, wh = 47, XA = 62, JA = 126, tE = "Combinator", eE = {
  name: String
};
function hg() {
  const r = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case ut:
      t = " ";
      break;
    case G:
      switch (this.charCodeAt(this.tokenStart)) {
        case XA:
        case ZA:
        case JA:
          this.next();
          break;
        case wh:
          this.next(), this.eatIdent("deep"), this.eatDelim(wh);
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
function nE(r) {
  this.tokenize(r.name);
}
const rE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nE,
  name: tE,
  parse: hg,
  structure: eE
}, Symbol.toStringTag, { value: "Module" })), iE = 42, sE = 47, aE = "Comment", oE = {
  value: String
};
function fg() {
  const r = this.tokenStart;
  let t = this.tokenEnd;
  return this.eat(Pt), t - r + 2 >= 2 && this.charCodeAt(t - 2) === iE && this.charCodeAt(t - 1) === sE && (t -= 2), {
    type: "Comment",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substring(r + 2, t)
  };
}
function lE(r) {
  this.token(Pt, "/*" + r.value + "*/");
}
const cE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lE,
  name: aE,
  parse: fg,
  structure: oE
}, Symbol.toStringTag, { value: "Module" })), pg = 33, uE = 35, dE = 36, hE = 38, fE = 42, pE = 43, kh = 47;
function gE(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function mE(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function bE() {
  const r = this.tokenIndex, t = this.Value();
  return t.type !== "Raw" && this.eof === !1 && this.tokenType !== Vt && this.isDelim(pg) === !1 && this.isBalanceEdge(r) === !1 && this.error(), t;
}
const yE = "Declaration", vE = "declaration", wE = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function gg() {
  const r = this.tokenStart, t = this.tokenIndex, e = xE.call(this), n = hu(e), i = n ? this.parseCustomProperty : this.parseValue, s = n ? mE : gE;
  let a = !1, o;
  this.skipSC(), this.eat(Mt);
  const l = this.tokenIndex;
  if (n || this.skipSC(), i ? o = this.parseWithFallback(bE, s) : o = s.call(this, this.tokenIndex), n && o.type === "Value" && o.children.isEmpty) {
    for (let c = l - this.tokenIndex; c <= 0; c++)
      if (this.lookupType(c) === ut) {
        o.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
  }
  return this.isDelim(pg) && (a = SE.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== Vt && this.isBalanceEdge(t) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(r, this.tokenStart),
    important: a,
    property: e,
    value: o
  };
}
function kE(r) {
  this.token(z, r.property), this.token(Mt, ":"), this.node(r.value), r.important && (this.token(G, "!"), this.token(z, r.important === !0 ? "important" : r.important));
}
function xE() {
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
      case kh:
        this.next(), this.isDelim(kh) && this.next();
        break;
    }
  return this.tokenType === ot ? this.eat(ot) : this.eat(z), this.substrToCursor(r);
}
function SE() {
  this.eat(G), this.skipSC();
  const r = this.consume(z);
  return r === "important" ? !0 : r;
}
const AE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: kE,
  name: yE,
  parse: gg,
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
function mg() {
  const r = this.createList();
  for (; !this.eof; )
    switch (this.tokenType) {
      case ut:
      case Pt:
      case Vt:
        this.next();
        break;
      case gt:
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
  this.children(r, (t) => {
    t.type === "Declaration" && this.token(Vt, ";");
  });
}
const DE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: LE,
  name: CE,
  parse: mg,
  structure: TE
}, Symbol.toStringTag, { value: "Module" })), IE = "Dimension", NE = {
  value: String,
  unit: String
};
function bg() {
  const r = this.tokenStart, t = this.consumeNumber(Y);
  return {
    type: "Dimension",
    loc: this.getLocation(r, this.tokenStart),
    value: t,
    unit: this.substring(r + t.length, this.tokenStart)
  };
}
function OE(r) {
  this.token(Y, r.value + r.unit);
}
const ME = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OE,
  name: IE,
  parse: bg,
  structure: NE
}, Symbol.toStringTag, { value: "Module" })), qE = "Function", _E = "function", zE = {
  name: String,
  children: [[]]
};
function yg(r, t) {
  const e = this.tokenStart, n = this.consumeFunctionName(), i = n.toLowerCase();
  let s;
  return s = t.hasOwnProperty(i) ? t[i].call(this, t) : r.call(this, t), this.eof || this.eat(rt), {
    type: "Function",
    loc: this.getLocation(e, this.tokenStart),
    name: n,
    children: s
  };
}
function RE(r) {
  this.token(K, r.name + "("), this.children(r), this.token(rt, ")");
}
const PE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: RE,
  name: qE,
  parse: yg,
  structure: zE,
  walkContext: _E
}, Symbol.toStringTag, { value: "Module" })), BE = "XXX", $E = "Hash", FE = {
  value: String
};
function vg() {
  const r = this.tokenStart;
  return this.eat(ot), {
    type: "Hash",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r + 1)
  };
}
function jE(r) {
  this.token(ot, "#" + r.value);
}
const UE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: jE,
  name: $E,
  parse: vg,
  structure: FE,
  xxx: BE
}, Symbol.toStringTag, { value: "Module" })), HE = "Identifier", VE = {
  name: String
};
function wg() {
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
  parse: wg,
  structure: VE
}, Symbol.toStringTag, { value: "Module" })), KE = "IdSelector", WE = {
  name: String
};
function kg() {
  const r = this.tokenStart;
  return this.eat(ot), {
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
  parse: kg,
  structure: WE
}, Symbol.toStringTag, { value: "Module" })), XE = "MediaFeature", JE = {
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", null]
};
function xg() {
  const r = this.tokenStart;
  let t, e = null;
  if (this.eat(kt), this.skipSC(), t = this.consume(z), this.skipSC(), this.tokenType !== rt) {
    switch (this.eat(Mt), this.skipSC(), this.tokenType) {
      case F:
        this.lookupNonWSType(1) === G ? e = this.Ratio() : e = this.Number();
        break;
      case Y:
        e = this.Dimension();
        break;
      case z:
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
function tC(r) {
  this.token(kt, "("), this.token(z, r.name), r.value !== null && (this.token(Mt, ":"), this.node(r.value)), this.token(rt, ")");
}
const eC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: tC,
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
function Sg() {
  const r = this.createList();
  let t = null;
  this.skipSC();
  t:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case Pt:
        case ut:
          this.next();
          continue;
        case z:
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
function iC(r) {
  this.children(r);
}
const sC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: iC,
  name: nC,
  parse: Sg,
  structure: rC
}, Symbol.toStringTag, { value: "Module" })), aC = "MediaQueryList", oC = {
  children: [[
    "MediaQuery"
  ]]
};
function Ag() {
  const r = this.createList();
  for (this.skipSC(); !this.eof && (r.push(this.MediaQuery()), this.tokenType === Qe); )
    this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function lC(r) {
  this.children(r, () => this.token(Qe, ","));
}
const cC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lC,
  name: aC,
  parse: Ag,
  structure: oC
}, Symbol.toStringTag, { value: "Module" })), uC = 38, dC = "NestingSelector", hC = {};
function Eg() {
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
  parse: Eg,
  structure: hC
}, Symbol.toStringTag, { value: "Module" })), gC = "Nth", mC = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function Cg() {
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
function bC(r) {
  this.node(r.nth), r.selector !== null && (this.token(z, "of"), this.node(r.selector));
}
const yC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: bC,
  name: gC,
  parse: Cg,
  structure: mC
}, Symbol.toStringTag, { value: "Module" })), vC = "Number", wC = {
  value: String
};
function Tg() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(F)
  };
}
function kC(r) {
  this.token(F, r.value);
}
const xC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: kC,
  name: vC,
  parse: Tg,
  structure: wC
}, Symbol.toStringTag, { value: "Module" })), SC = "Operator", AC = {
  value: String
};
function Lg() {
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
  parse: Lg,
  structure: AC
}, Symbol.toStringTag, { value: "Module" })), TC = "Parentheses", LC = {
  children: [[]]
};
function Dg(r, t) {
  const e = this.tokenStart;
  let n = null;
  return this.eat(kt), n = r.call(this, t), this.eof || this.eat(rt), {
    type: "Parentheses",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function DC(r) {
  this.token(kt, "("), this.children(r), this.token(rt, ")");
}
const IC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: DC,
  name: TC,
  parse: Dg,
  structure: LC
}, Symbol.toStringTag, { value: "Module" })), NC = "Percentage", OC = {
  value: String
};
function Ig() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(ct)
  };
}
function MC(r) {
  this.token(ct, r.value + "%");
}
const qC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: MC,
  name: NC,
  parse: Ig,
  structure: OC
}, Symbol.toStringTag, { value: "Module" })), _C = "PseudoClassSelector", zC = "function", RC = {
  name: String,
  children: [["Raw"], null]
};
function Ng() {
  const r = this.tokenStart;
  let t = null, e, n;
  return this.eat(Mt), this.tokenType === K ? (e = this.consumeFunctionName(), n = e.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(rt)) : e = this.consume(z), {
    type: "PseudoClassSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    children: t
  };
}
function PC(r) {
  this.token(Mt, ":"), r.children === null ? this.token(z, r.name) : (this.token(K, r.name + "("), this.children(r), this.token(rt, ")"));
}
const BC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: PC,
  name: _C,
  parse: Ng,
  structure: RC,
  walkContext: zC
}, Symbol.toStringTag, { value: "Module" })), $C = "PseudoElementSelector", FC = "function", jC = {
  name: String,
  children: [["Raw"], null]
};
function Og() {
  const r = this.tokenStart;
  let t = null, e, n;
  return this.eat(Mt), this.eat(Mt), this.tokenType === K ? (e = this.consumeFunctionName(), n = e.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(rt)) : e = this.consume(z), {
    type: "PseudoElementSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    children: t
  };
}
function UC(r) {
  this.token(Mt, ":"), this.token(Mt, ":"), r.children === null ? this.token(z, r.name) : (this.token(K, r.name + "("), this.children(r), this.token(rt, ")"));
}
const HC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: UC,
  name: $C,
  parse: Og,
  structure: jC,
  walkContext: FC
}, Symbol.toStringTag, { value: "Module" })), VC = 47, YC = 46;
function xh() {
  this.skipSC();
  const r = this.consume(F);
  for (let t = 0; t < r.length; t++) {
    const e = r.charCodeAt(t);
    !xt(e) && e !== YC && this.error("Unsigned number is expected", this.tokenStart - r.length + t);
  }
  return Number(r) === 0 && this.error("Zero number is not allowed", this.tokenStart - r.length), r;
}
const GC = "Ratio", KC = {
  left: String,
  right: String
};
function Mg() {
  const r = this.tokenStart, t = xh.call(this);
  let e;
  return this.skipSC(), this.eatDelim(VC), e = xh.call(this), {
    type: "Ratio",
    loc: this.getLocation(r, this.tokenStart),
    left: t,
    right: e
  };
}
function WC(r) {
  this.token(F, r.left), this.token(G, "/"), this.token(F, r.right);
}
const QC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: WC,
  name: GC,
  parse: Mg,
  structure: KC
}, Symbol.toStringTag, { value: "Module" }));
function ZC() {
  return this.tokenIndex > 0 && this.lookupType(-1) === ut ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
const XC = "Raw", JC = {
  value: String
};
function qg(r, t, e) {
  const n = this.getTokenStart(r);
  let i;
  return this.skipUntilBalanced(r, t || this.consumeUntilBalanceEnd), e && this.tokenStart > n ? i = ZC.call(this) : i = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(n, i),
    value: this.substring(n, i)
  };
}
function tT(r) {
  this.tokenize(r.value);
}
const eT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: tT,
  name: XC,
  parse: qg,
  structure: JC
}, Symbol.toStringTag, { value: "Module" }));
function Sh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracket, !0);
}
function nT() {
  const r = this.SelectorList();
  return r.type !== "Raw" && this.eof === !1 && this.tokenType !== qt && this.error(), r;
}
const rT = "Rule", iT = "rule", sT = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function _g() {
  const r = this.tokenIndex, t = this.tokenStart;
  let e, n;
  return this.parseRulePrelude ? e = this.parseWithFallback(nT, Sh) : e = Sh.call(this, r), n = this.Block(!0), {
    type: "Rule",
    loc: this.getLocation(t, this.tokenStart),
    prelude: e,
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
  parse: _g,
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
function zg() {
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
  parse: zg,
  structure: cT
}, Symbol.toStringTag, { value: "Module" })), hT = "SelectorList", fT = "selector", pT = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function Rg() {
  const r = this.createList();
  for (; !this.eof; ) {
    if (r.push(this.Selector()), this.tokenType === Qe) {
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
  this.children(r, () => this.token(Qe, ","));
}
const mT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: gT,
  name: hT,
  parse: Rg,
  structure: pT,
  walkContext: fT
}, Symbol.toStringTag, { value: "Module" })), lc = 92, Pg = 34, bT = 39;
function Bg(r) {
  const t = r.length, e = r.charCodeAt(0), n = e === Pg || e === bT ? 1 : 0, i = n === 1 && t > 1 && r.charCodeAt(t - 1) === e ? t - 2 : t - 1;
  let s = "";
  for (let a = n; a <= i; a++) {
    let o = r.charCodeAt(a);
    if (o === lc) {
      if (a === i) {
        a !== t - 1 && (s = r.substr(a + 1));
        break;
      }
      if (o = r.charCodeAt(++a), $e(lc, o)) {
        const l = a - 1, c = Qr(r, l);
        a = c - 1, s += Sp(r.substring(l + 1, c));
      } else
        o === 13 && r.charCodeAt(a + 1) === 10 && a++;
    } else
      s += r[a];
  }
  return s;
}
function yT(r, t) {
  const e = '"', n = Pg;
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
    o === n || o === lc ? (i += "\\" + r.charAt(a), s = !1) : (s && (Ln(o) || tr(o)) && (i += " "), i += r.charAt(a), s = !1);
  }
  return e + i + e;
}
const vT = "String", wT = {
  value: String
};
function $g() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: Bg(this.consume(We))
  };
}
function kT(r) {
  this.token(We, yT(r.value));
}
const xT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: kT,
  name: vT,
  parse: $g,
  structure: wT
}, Symbol.toStringTag, { value: "Module" })), ST = 33;
function Ah(r) {
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
  const r = this.tokenStart, t = this.createList();
  let e;
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case ut:
        this.next();
        continue;
      case Pt:
        if (this.charCodeAt(this.tokenStart + 2) !== ST) {
          this.next();
          continue;
        }
        e = this.Comment();
        break;
      case os:
        e = this.CDO();
        break;
      case Ut:
        e = this.CDC();
        break;
      case gt:
        e = this.parseWithFallback(this.Atrule, Ah);
        break;
      default:
        e = this.parseWithFallback(this.Rule, Ah);
    }
    t.push(e);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(r, this.tokenStart),
    children: t
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
}, Symbol.toStringTag, { value: "Module" })), DT = 42, Eh = 124;
function bl() {
  this.tokenType !== z && this.isDelim(DT) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
const IT = "TypeSelector", NT = {
  name: String
};
function jg() {
  const r = this.tokenStart;
  return this.isDelim(Eh) ? (this.next(), bl.call(this)) : (bl.call(this), this.isDelim(Eh) && (this.next(), bl.call(this))), {
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
  parse: jg,
  structure: NT
}, Symbol.toStringTag, { value: "Module" })), Ug = 43, Hg = 45, cc = 63;
function Ni(r, t) {
  let e = 0;
  for (let n = this.tokenStart + r; n < this.tokenEnd; n++) {
    const i = this.charCodeAt(n);
    if (i === Hg && t && e !== 0)
      return Ni.call(this, r + e + 1, !1), -1;
    Ln(i) || this.error(
      t && e !== 0 ? "Hyphen minus" + (e < 6 ? " or hex digit" : "") + " is expected" : e < 6 ? "Hex digit is expected" : "Unexpected input",
      n
    ), ++e > 6 && this.error("Too many hex digits", n);
  }
  return this.next(), e;
}
function Vs(r) {
  let t = 0;
  for (; this.isDelim(cc); )
    ++t > r && this.error("Too many question marks"), this.next();
}
function qT(r) {
  this.charCodeAt(this.tokenStart) !== r && this.error((r === Ug ? "Plus sign" : "Hyphen minus") + " is expected");
}
function _T() {
  let r = 0;
  switch (this.tokenType) {
    case F:
      if (r = Ni.call(this, 1, !0), this.isDelim(cc)) {
        Vs.call(this, 6 - r);
        break;
      }
      if (this.tokenType === Y || this.tokenType === F) {
        qT.call(this, Hg), Ni.call(this, 1, !1);
        break;
      }
      break;
    case Y:
      r = Ni.call(this, 1, !0), r > 0 && Vs.call(this, 6 - r);
      break;
    default:
      if (this.eatDelim(Ug), this.tokenType === z) {
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
function Vg() {
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
  parse: Vg,
  structure: RT
}, Symbol.toStringTag, { value: "Module" })), $T = 32, uc = 92, FT = 34, jT = 39, UT = 40, Yg = 41;
function HT(r) {
  const t = r.length;
  let e = 4, n = r.charCodeAt(t - 1) === Yg ? t - 2 : t - 1, i = "";
  for (; e < n && tr(r.charCodeAt(e)); )
    e++;
  for (; e < n && tr(r.charCodeAt(n)); )
    n--;
  for (let s = e; s <= n; s++) {
    let a = r.charCodeAt(s);
    if (a === uc) {
      if (s === n) {
        s !== t - 1 && (i = r.substr(s + 1));
        break;
      }
      if (a = r.charCodeAt(++s), $e(uc, a)) {
        const o = s - 1, l = Qr(r, o);
        s = l - 1, i += Sp(r.substring(o + 1, l));
      } else
        a === 13 && r.charCodeAt(s + 1) === 10 && s++;
    } else
      i += r[s];
  }
  return i;
}
function VT(r) {
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
    i === $T || i === uc || i === FT || i === jT || i === UT || i === Yg ? (t += "\\" + r.charAt(n), e = !1) : (e && Ln(i) && (t += " "), t += r.charAt(n), e = !1);
  }
  return "url(" + t + ")";
}
const YT = "Url", GT = {
  value: String
};
function Gg() {
  const r = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case It:
      t = HT(this.consume(It));
      break;
    case K:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(K), this.skipSC(), t = Bg(this.consume(We)), this.skipSC(), this.eof || this.eat(rt);
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
function KT(r) {
  this.token(It, VT(r.value));
}
const WT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: KT,
  name: YT,
  parse: Gg,
  structure: GT
}, Symbol.toStringTag, { value: "Module" })), QT = "Value", ZT = {
  children: [[]]
};
function Kg() {
  const r = this.tokenStart, t = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(r, this.tokenStart),
    children: t
  };
}
function XT(r) {
  this.children(r);
}
const JT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: XT,
  name: QT,
  parse: Kg,
  structure: ZT
}, Symbol.toStringTag, { value: "Module" })), tL = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
}), eL = "WhiteSpace", nL = {
  value: String
};
function Wg() {
  return this.eat(ut), tL;
}
function rL(r) {
  this.token(ut, r.value);
}
const iL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: rL,
  name: eL,
  parse: Wg,
  structure: nL
}, Symbol.toStringTag, { value: "Module" })), Qg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: aA,
  Atrule: hA,
  AtrulePrelude: bA,
  AttributeSelector: CA,
  Block: MA,
  Brackets: RA,
  CDC: FA,
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
  MediaFeature: eC,
  MediaQuery: sC,
  MediaQueryList: cC,
  NestingSelector: pC,
  Nth: yC,
  Number: xC,
  Operator: CC,
  Parentheses: IC,
  Percentage: qC,
  PseudoClassSelector: BC,
  PseudoElementSelector: HC,
  Ratio: QC,
  Raw: eT,
  Rule: oT,
  Selector: dT,
  SelectorList: mT,
  String: xT,
  StyleSheet: LT,
  TypeSelector: MT,
  UnicodeRange: BT,
  Url: WT,
  Value: JT,
  WhiteSpace: iL
}, Symbol.toStringTag, { value: "Module" })), sL = zt(H({
  generic: !0
}, eA), {
  node: Qg
}), aL = 35, oL = 42, Ch = 43, lL = 45, cL = 47, uL = 117;
function Zg(r) {
  switch (this.tokenType) {
    case ot:
      return this.Hash();
    case Qe:
      return this.Operator();
    case kt:
      return this.Parentheses(this.readSequence, r.recognizer);
    case Xt:
      return this.Brackets(this.readSequence, r.recognizer);
    case We:
      return this.String();
    case Y:
      return this.Dimension();
    case ct:
      return this.Percentage();
    case F:
      return this.Number();
    case K:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, r.recognizer);
    case It:
      return this.Url();
    case z:
      return this.cmpChar(this.tokenStart, uL) && this.cmpChar(this.tokenStart + 1, Ch) ? this.UnicodeRange() : this.Identifier();
    case G: {
      const t = this.charCodeAt(this.tokenStart);
      if (t === cL || t === oL || t === Ch || t === lL)
        return this.Operator();
      t === aL && this.error("Hex or identifier is expected", this.tokenStart + 1);
      break;
    }
  }
}
const dL = {
  getNode: Zg
}, hL = 35, fL = 38, pL = 42, gL = 43, mL = 47, Th = 46, bL = 62, yL = 124, vL = 126;
function wL(r, t) {
  t.last !== null && t.last.type !== "Combinator" && r !== null && r.type !== "Combinator" && t.push({
    // FIXME: this.Combinator() should be used instead
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function kL() {
  switch (this.tokenType) {
    case Xt:
      return this.AttributeSelector();
    case ot:
      return this.IdSelector();
    case Mt:
      return this.lookupType(1) === Mt ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case z:
      return this.TypeSelector();
    case F:
    case ct:
      return this.Percentage();
    case Y:
      this.charCodeAt(this.tokenStart) === Th && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case G: {
      switch (this.charCodeAt(this.tokenStart)) {
        case gL:
        case bL:
        case vL:
        case mL:
          return this.Combinator();
        case Th:
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
const xL = {
  onWhiteSpace: wL,
  getNode: kL
};
function SL() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function AL() {
  const r = this.createList();
  if (this.skipSC(), r.push(this.Identifier()), this.skipSC(), this.tokenType === Qe) {
    r.push(this.Operator());
    const t = this.tokenIndex, e = this.parseCustomProperty ? this.Value(null) : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, !1);
    if (e.type === "Value" && e.children.isEmpty) {
      for (let n = t - this.tokenIndex; n <= 0; n++)
        if (this.lookupType(n) === ut) {
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
function Lh(r) {
  return r !== null && r.type === "Operator" && (r.value[r.value.length - 1] === "-" || r.value[r.value.length - 1] === "+");
}
const EL = {
  getNode: Zg,
  onWhiteSpace(r, t) {
    Lh(r) && (r.value = " " + r.value), Lh(t.last) && (t.last.value += " ");
  },
  expression: SL,
  var: AL
}, CL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: dL,
  Selector: xL,
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
        case We:
          r.push(this.String());
          break;
        case It:
        case K:
          r.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      return (this.lookupNonWSType(0) === z || this.lookupNonWSType(0) === kt) && r.push(this.MediaQueryList()), r;
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
  return this.skipSC(), this.tokenType === z && this.lookupNonWSType(1) === Mt ? this.createSingleNodeList(
    this.Declaration()
  ) : Xg.call(this);
}
function Xg() {
  const r = this.createList();
  let t;
  this.skipSC();
  t:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case Pt:
        case ut:
          this.next();
          continue;
        case K:
          t = this.Function(OL, this.scope.AtrulePrelude);
          break;
        case z:
          t = this.Identifier();
          break;
        case kt:
          t = this.Parentheses(ML, this.scope.AtrulePrelude);
          break;
        default:
          break t;
      }
      r.push(t);
    }
  return r;
}
const qL = {
  parse: {
    prelude() {
      const r = Xg.call(this);
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
}, Bn = {
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
}, Dh = {
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
  dir: Dh,
  has: Bn,
  lang: Dh,
  matches: Bn,
  is: Bn,
  "-moz-any": Bn,
  "-webkit-any": Bn,
  where: Bn,
  not: Bn,
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
  Atrule: ng,
  AtrulePrelude: rg,
  AttributeSelector: sg,
  Block: og,
  Brackets: lg,
  CDC: cg,
  CDO: ug,
  ClassSelector: dg,
  Combinator: hg,
  Comment: fg,
  Declaration: gg,
  DeclarationList: mg,
  Dimension: bg,
  Function: yg,
  Hash: vg,
  IdSelector: kg,
  Identifier: wg,
  MediaFeature: xg,
  MediaQuery: Sg,
  MediaQueryList: Ag,
  NestingSelector: Eg,
  Nth: Cg,
  Number: Tg,
  Operator: Lg,
  Parentheses: Dg,
  Percentage: Ig,
  PseudoClassSelector: Ng,
  PseudoElementSelector: Og,
  Ratio: Mg,
  Raw: qg,
  Rule: _g,
  Selector: zg,
  SelectorList: Rg,
  String: $g,
  StyleSheet: Fg,
  TypeSelector: jg,
  UnicodeRange: Vg,
  Url: Gg,
  Value: Kg,
  WhiteSpace: Wg
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
  node: Qg
}, $L = tA(H(H(H({}, sL), PL), BL));
function dc(r) {
  const t = {};
  for (const e in r) {
    let n = r[e];
    n && (Array.isArray(n) || n instanceof pt ? n = n.map(dc) : n.constructor === Object && (n = dc(n))), t[e] = n;
  }
  return t;
}
const {
  tokenize: VD,
  parse: FL,
  generate: jL,
  lexer: YD,
  createLexer: GD,
  walk: Fn,
  find: KD,
  findLast: WD,
  findAll: QD,
  toPlainObject: ZD,
  fromPlainObject: XD,
  fork: JD
} = $L;
let UL = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", ve = (r = 21) => {
  let t = "", e = r;
  for (; e--; )
    t += UL[Math.random() * 64 | 0];
  return t;
};
function jn(r) {
  return FL(r, {
    parseAtrulePrelude: !1,
    parseCustomProperty: !0
  });
}
function Kt(r) {
  return jL(r, {
    // Default `safe` adds extra (potentially breaking) spaces for compatibility
    // with old browsers.
    mode: "spec"
  });
}
function Jg(r) {
  return r.type === "Declaration";
}
function HL(r) {
  return r.value.children.first.name;
}
const hc = {
  "position-anchor": `--position-anchor-${ve(12)}`,
  "anchor-scope": `--anchor-scope-${ve(12)}`,
  "anchor-name": `--anchor-name-${ve(12)}`
};
function VL(r, t) {
  return Jg(r) && hc[r.property] && t ? (t.children.appendData(zt(H({}, r), {
    property: hc[r.property]
  })), { updated: !0 }) : {};
}
function YL(r) {
  for (const t of r) {
    let e = !1;
    const n = jn(t.css);
    Fn(n, {
      visit: "Declaration",
      enter(i) {
        var s;
        const a = (s = this.rule) == null ? void 0 : s.block, { updated: o } = VL(i, a);
        o && (e = !0);
      }
    }), e && (t.css = Kt(n), t.changed = !0);
  }
  return r.some((t) => t.changed === !0);
}
var tm = /* @__PURE__ */ ((r) => (r.All = "all", r.None = "none", r))(tm || {});
function Ge(r, t) {
  var e;
  return t = (e = hc[t]) != null ? e : t, (r instanceof HTMLElement ? getComputedStyle(r) : r.computedStyle).getPropertyValue(t).trim();
}
function Jr(r, t, e) {
  return Ge(r, t) === e;
}
function GL(r, { selector: t, pseudoElementPart: e }) {
  const n = getComputedStyle(r, e), i = document.createElement("div"), s = document.createElement("style");
  i.id = `fake-pseudo-element-${ve()}`;
  for (const o of Array.from(n)) {
    const l = n.getPropertyValue(o);
    i.style.setProperty(o, l);
  }
  s.textContent += `#${i.id}${e} { content: ${n.content}; }`, s.textContent += `${t} { display: none !important; }`, document.head.append(s);
  const a = e === "::before" ? "afterbegin" : "beforeend";
  return r.insertAdjacentElement(a, i), { fakePseudoElement: i, sheet: s, computedStyle: n };
}
function KL(r) {
  let t = r;
  for (; t; ) {
    if (Jr(t, "overflow", "scroll"))
      return t;
    t = t.parentElement;
  }
  return t;
}
function WL(r) {
  let t = KL(r);
  return t === document.documentElement && (t = null), t ?? { scrollTop: 0, scrollLeft: 0 };
}
function QL(r) {
  const { elementPart: t, pseudoElementPart: e } = r, n = [];
  if (e && !(e === "::before" || e === "::after")) return n;
  const i = Array.from(
    document.querySelectorAll(t)
  );
  if (!e)
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
        const { scrollY: p, scrollX: m } = globalThis, { scrollTop: b, scrollLeft: k } = h;
        return DOMRect.fromRect({
          y: c.y + (d - p) + (h.scrollTop - b),
          x: c.x + (f - m) + (h.scrollLeft - k),
          width: c.width,
          height: c.height
        });
      }
    });
  }
  return n;
}
function ZL(r, t) {
  const e = Ge(r, "anchor-name");
  return t ? e.split(",").map((n) => n.trim()).includes(t) : !e;
}
function XL(r, t) {
  const e = Ge(r, "anchor-scope");
  return e === t || e === "all";
}
function JL(r) {
  return !!((r.type === "text/css" || r.rel === "stylesheet") && r.href);
}
function tD(r) {
  const t = new URL(r.href, document.baseURI);
  if (JL(r) && t.origin === location.origin)
    return t;
}
function eD(r) {
  return mt(this, null, function* () {
    return Promise.all(
      r.map((t) => mt(this, null, function* () {
        if (!t.url)
          return t;
        const e = yield (yield fetch(t.url.toString())).text();
        return zt(H({}, t), { css: e });
      }))
    );
  });
}
function nD() {
  const r = document.querySelectorAll('[style*="anchor"]'), t = [];
  return r.forEach((e) => {
    const n = ve(12), i = "data-has-inline-styles";
    e.setAttribute(i, n);
    const s = e.getAttribute("style"), a = `[${i}="${n}"] { ${s} }`;
    t.push({ el: e, css: a });
  }), t;
}
function rD() {
  return mt(this, null, function* () {
    const r = document.querySelectorAll("link, style"), t = [];
    r.forEach((n) => {
      if (n.tagName.toLowerCase() === "link") {
        const i = tD(n);
        i && t.push({ el: n, url: i });
      }
      n.tagName.toLowerCase() === "style" && t.push({ el: n, css: n.innerHTML });
    });
    const e = nD();
    return yield eD([...t, ...e]);
  });
}
function iD(r, t) {
  return !r || r === t ? !1 : em(r) ? r.document.contains(t) : r.contains(t);
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
function Ih(r, t) {
  return r.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING;
}
function aD(r) {
  return mt(this, null, function* () {
    return yield se.getOffsetParent(r);
  });
}
function vl(r) {
  return mt(this, null, function* () {
    if (!["absolute", "fixed"].includes(Ge(r, "position")))
      return yield aD(r);
    let t = r.parentElement;
    for (; t; ) {
      if (!Jr(t, "position", "static") && Jr(t, "display", "block"))
        return t;
      t = t.parentElement;
    }
    return window;
  });
}
function oD(r, t, e, n) {
  return mt(this, null, function* () {
    const i = yield vl(r), s = yield vl(e);
    if (!(iD(s, r) || em(s)) || i === s && !(!fc(r) || Ih(r, e)))
      return !1;
    if (i !== s) {
      let a;
      const o = [];
      for (a = i; a && a !== s && a !== window; )
        o.push(a), a = yield vl(a);
      const l = o[o.length - 1];
      if (l instanceof HTMLElement && !(!fc(l) || Ih(l, e)))
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
    return !(t && n && Nh(r, t, n) !== Nh(e, t, n));
  });
}
function Nh(r, t, e) {
  for (; !(r.matches(e) && XL(r, t)); ) {
    if (!r.parentElement)
      return null;
    r = r.parentElement;
  }
  return r;
}
function Oh(r, t, e, n) {
  return mt(this, null, function* () {
    if (!(r instanceof HTMLElement && e.length && fc(r)))
      return null;
    const i = e.flatMap(QL).filter((a) => ZL(a, t)), s = n.map((a) => a.selector).join(",") || null;
    for (let a = i.length - 1; a >= 0; a--) {
      const o = i[a], l = "fakePseudoElement" in o;
      if (yield oD(
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
function nm(r) {
  return !!(r && r.type === "Function" && r.name === "anchor");
}
function rm(r) {
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
function ts(r) {
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
function kD(r) {
  return uD.includes(r);
}
function Mh(r, t) {
  let e, n, i, s = "", a = !1, o;
  const l = [];
  r.children.toArray().forEach((h) => {
    if (a) {
      s = `${s}${Kt(h)}`;
      return;
    }
    if (h.type === "Operator" && h.value === ",") {
      a = !0;
      return;
    }
    l.push(h);
  });
  let [c, d] = l;
  if (d || (d = c, c = void 0), c && (wl(c) ? c.name === "implicit" ? c = void 0 : c.name.startsWith("--") && (e = c.name) : ra(c) && c.children.first && (o = c.children.first.name)), d)
    if (nm(r)) {
      if (wl(d) && vD(d.name))
        n = d.name;
      else if (yD(d)) {
        const h = Number(d.value);
        n = Number.isNaN(h) ? void 0 : h;
      }
    } else rm(r) && wl(d) && wD(d.name) && (i = d.name);
  const f = `--anchor-${ve(12)}`;
  return Object.assign(r, {
    type: "Raw",
    value: `var(${f})`,
    children: null
  }), Reflect.deleteProperty(r, "name"), {
    anchorName: e,
    anchorSide: n,
    anchorSize: i,
    fallbackValue: s || "0px",
    customPropName: o,
    uuid: f
  };
}
function qh(r) {
  return r.value.children.map(
    ({ name: t }) => t
  );
}
function kl(r) {
  return r ? r.children.map((t) => {
    var e;
    let n;
    ((e = t.children.last) == null ? void 0 : e.type) === "PseudoElementSelector" && (t = dc(t), n = Kt(t.children.last), t.children.pop());
    const i = Kt(t);
    return {
      selector: i + (n ?? ""),
      elementPart: i,
      pseudoElementPart: n
    };
  }).toArray() : [];
}
let zi = {}, Vn = {}, Yn = {}, Ri = {}, Un = {};
function xD() {
  zi = {}, Vn = {}, Yn = {}, Ri = {}, Un = {};
}
function SD(r, t) {
  var e;
  if ((nm(r) || rm(r)) && t) {
    if (t.property.startsWith("--")) {
      const n = Kt(t.value), i = Mh(r);
      return Ri[i.uuid] = n, Yn[t.property] = [
        ...(e = Yn[t.property]) != null ? e : [],
        i
      ], { changed: !0 };
    }
    if (ts(t.property) || Ga(t.property)) {
      const n = Mh(r);
      return { prop: t.property, data: n, changed: !0 };
    }
  }
  return {};
}
function AD(r) {
  return gD(r) && r.value.children.first ? HL(r) : null;
}
function ED(r) {
  var t, e;
  if (mD(r) && (t = r.prelude) != null && t.value && (e = r.block) != null && e.children) {
    const n = r.prelude.value, i = [];
    return r.block.children.filter(bD).forEach((s) => {
      var a;
      if ((a = s.block) != null && a.children) {
        const o = s.block.children.filter(
          (c) => Jg(c) && (ts(c.property) || Ga(c.property) || kD(c.property))
        ), l = {
          uuid: `${n}-try-${ve(12)}`,
          declarations: Object.fromEntries(
            o.map((c) => [c.property, Kt(c.value)])
          )
        };
        i.push(l);
      }
    }), { name: n, blocks: i };
  }
  return {};
}
function CD(r, t) {
  return mt(this, null, function* () {
    let e = t.anchorName;
    const n = t.customPropName;
    if (r && !e) {
      const o = r.getAttribute("anchor"), l = Ge(
        r,
        "position-anchor"
      );
      if (l)
        e = l;
      else if (n)
        e = Ge(r, n);
      else if (o) {
        const c = `#${CSS.escape(o)}`;
        return yield Oh(
          r,
          null,
          [{ selector: c, elementPart: c }],
          []
        );
      }
    }
    const i = e ? zi[e] || [] : [], s = e ? Vn[tm.All] || [] : [], a = e ? Vn[e] || [] : [];
    return yield Oh(
      r,
      e || null,
      i,
      [...s, ...a]
    );
  });
}
function TD(r) {
  return mt(this, null, function* () {
    var t, e, n, i, s, a;
    const o = {}, l = {}, c = {}, d = {};
    xD();
    for (const b of r) {
      const k = jn(b.css);
      Fn(k, {
        visit: "Atrule",
        enter(v) {
          const { name: S, blocks: E } = ED(v);
          S && E != null && E.length && (c[S] = {
            targets: [],
            blocks: E
          });
        }
      });
    }
    for (const b of r) {
      let k = !1;
      const v = jn(b.css);
      Fn(v, {
        visit: "Declaration",
        enter(S) {
          var E, C;
          const I = (E = this.rule) == null ? void 0 : E.prelude, M = kl(I), O = AD(S);
          if (O && M.length && c[O]) {
            for (const { selector: x } of M)
              d[x] = { fallbacks: c[O].blocks }, c[O].targets.includes(x) || c[O].targets.push(x);
            for (const x of c[O].blocks) {
              const A = `[data-anchor-polyfill="${x.uuid}"]`;
              (C = this.stylesheet) == null || C.children.prependData({
                type: "Rule",
                prelude: {
                  type: "Raw",
                  value: A
                },
                block: {
                  type: "Block",
                  children: new pt().fromArray(
                    Object.entries(x.declarations).map(([_, N]) => ({
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
            k = !0;
          }
        }
      }), k && (b.css = Kt(v), b.changed = !0);
    }
    for (const b of r) {
      let k = !1;
      const v = jn(b.css);
      Fn(v, function(S) {
        var E, C, I;
        const M = (E = this.rule) == null ? void 0 : E.prelude, O = kl(M);
        if (fD(S) && O.length)
          for (const N of qh(S))
            zi[N] != null || (zi[N] = []), zi[N].push(...O);
        if (pD(S) && O.length)
          for (const N of qh(S))
            Vn[N] != null || (Vn[N] = []), Vn[N].push(...O);
        const {
          prop: x,
          data: A,
          changed: _
        } = SD(S, this.declaration);
        if (x && A && O.length)
          for (const { selector: N } of O)
            o[N] = zt(H({}, o[N]), {
              [x]: [...(I = (C = o[N]) == null ? void 0 : C[x]) != null ? I : [], A]
            });
        _ && (k = !0);
      }), k && (b.css = Kt(v), b.changed = !0);
    }
    const f = new Set(Object.keys(Yn)), h = {}, p = (b) => {
      var k, v, S, E, C;
      const I = [], M = new Set((v = (k = h[b]) == null ? void 0 : k.names) != null ? v : []);
      for (; M.size > 0; )
        for (const O of M)
          I.push(...(S = Yn[O]) != null ? S : []), M.delete(O), (C = (E = h[O]) == null ? void 0 : E.names) != null && C.length && h[O].names.forEach((x) => M.add(x));
      return I;
    };
    for (; f.size > 0; ) {
      const b = [];
      for (const k of r) {
        let v = !1;
        const S = jn(k.css);
        Fn(S, {
          visit: "Function",
          enter(E) {
            var C, I;
            const M = (C = this.rule) == null ? void 0 : C.prelude, O = this.declaration, x = O == null ? void 0 : O.property;
            if ((M == null ? void 0 : M.children.isEmpty) === !1 && ra(E) && O && x && E.children.first && f.has(
              E.children.first.name
            ) && // For now, we only want assignments to other CSS custom properties
            x.startsWith("--")) {
              const A = E.children.first, _ = (I = Yn[A.name]) != null ? I : [], N = p(A.name);
              if (!(_.length || N.length))
                return;
              const V = `${A.name}-anchor-${ve(12)}`, ht = Kt(O.value);
              Ri[V] = ht, h[x] || (h[x] = { names: [], uuids: [] });
              const it = h[x];
              it.names.includes(A.name) || it.names.push(A.name), it.uuids.push(V), b.push(x), A.name = V, v = !0;
            }
          }
        }), v && (k.css = Kt(S), k.changed = !0);
      }
      f.clear(), b.forEach((k) => f.add(k));
    }
    for (const b of r) {
      let k = !1;
      const v = jn(b.css);
      Fn(v, {
        visit: "Function",
        enter(S) {
          var E, C, I, M, O, x, A;
          const _ = (E = this.rule) == null ? void 0 : E.prelude, N = this.declaration, V = N == null ? void 0 : N.property;
          if ((_ == null ? void 0 : _.children.isEmpty) === !1 && ra(S) && N && V && S.children.first && // Now we only want assignments to inset/sizing properties
          (ts(V) || Ga(V))) {
            const ht = S.children.first, it = (C = Yn[ht.name]) != null ? C : [], Yt = p(ht.name);
            if (!(it.length || Yt.length))
              return;
            const Bt = `${V}-${ve(12)}`;
            if (Yt.length) {
              const Le = /* @__PURE__ */ new Set([ht.name]);
              for (; Le.size > 0; )
                for (const De of Le) {
                  const U = h[De];
                  if ((I = U == null ? void 0 : U.names) != null && I.length && (M = U == null ? void 0 : U.uuids) != null && M.length)
                    for (const Ie of U.names)
                      for (const Ne of U.uuids)
                        Un[Ne] = zt(H({}, Un[Ne]), {
                          // - `key` (`propUuid`) is the property-specific
                          //   uuid to append to the new custom property name
                          // - `value` is the new property-specific custom
                          //   property value to use
                          [Bt]: `${Ie}-${Bt}`
                        });
                  Le.delete(De), (O = U == null ? void 0 : U.names) != null && O.length && U.names.forEach((Ie) => Le.add(Ie));
                }
            }
            const ni = kl(_);
            for (const Le of [...it, ...Yt]) {
              const De = H({}, Le), U = `--anchor-${ve(12)}-${V}`, Ie = De.uuid;
              De.uuid = U;
              for (const { selector: Ne } of ni)
                o[Ne] = zt(H({}, o[Ne]), {
                  [V]: [...(A = (x = o[Ne]) == null ? void 0 : x[V]) != null ? A : [], De]
                });
              Un[Ie] = zt(H({}, Un[Ie]), {
                // - `key` (`propUuid`) is the property-specific
                //   uuid to append to the new custom property name
                // - `value` is the new property-specific custom
                //   property value to use
                [Bt]: U
              });
            }
            ht.name = `${ht.name}-${Bt}`, k = !0;
          }
        }
      }), k && (b.css = Kt(v), b.changed = !0);
    }
    if (Object.keys(Un).length > 0)
      for (const b of r) {
        let k = !1;
        const v = jn(b.css);
        Fn(v, {
          visit: "Function",
          enter(S) {
            var E, C, I, M;
            if (ra(S) && (C = (E = S.children.first) == null ? void 0 : E.name) != null && C.startsWith(
              "--"
            ) && (M = (I = this.declaration) == null ? void 0 : I.property) != null && M.startsWith("--") && this.block) {
              const O = S.children.first, x = Un[O.name];
              if (x)
                for (const [A, _] of Object.entries(x))
                  this.block.children.appendData({
                    type: "Declaration",
                    important: !1,
                    property: `${this.declaration.property}-${A}`,
                    value: {
                      type: "Raw",
                      value: Kt(this.declaration.value).replace(
                        `var(${O.name})`,
                        `var(${_})`
                      )
                    }
                  }), k = !0;
              Ri[O.name] && (this.declaration.value = {
                type: "Raw",
                value: Ri[O.name]
              }, k = !0);
            }
          }
        }), k && (b.css = Kt(v), b.changed = !0);
      }
    const m = /* @__PURE__ */ new Map();
    for (const [b, k] of Object.entries(o)) {
      let v;
      b.startsWith("[data-anchor-polyfill=") && l[b] ? v = document.querySelectorAll(l[b]) : v = document.querySelectorAll(b);
      for (const [S, E] of Object.entries(k))
        for (const C of E)
          for (const I of v) {
            const M = yield CD(I, C), O = `--anchor-${ve(12)}`;
            m.set(I, zt(H({}, (t = m.get(I)) != null ? t : {}), {
              [C.uuid]: O
            })), I.setAttribute(
              "style",
              `${C.uuid}: var(${O}); ${(e = I.getAttribute("style")) != null ? e : ""}`
            ), d[b] = zt(H({}, d[b]), {
              declarations: zt(H({}, (n = d[b]) == null ? void 0 : n.declarations), {
                [S]: [
                  ...(a = (s = (i = d[b]) == null ? void 0 : i.declarations) == null ? void 0 : s[S]) != null ? a : [],
                  zt(H({}, C), { anchorEl: M, targetEl: I, uuid: O })
                ]
              })
            });
          }
    }
    return { rules: d, inlineStyles: m, anchorScopes: Vn };
  });
}
function _h(r, t, e = !1) {
  return mt(this, null, function* () {
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
            const f = t == null ? void 0 : t.get(i);
            if (f)
              for (const [h, p] of Object.entries(f))
                d = `${h}: var(${p}); ${d}`;
            i.setAttribute("style", d);
          }
        }
      }
      e && i.hasAttribute("data-has-inline-styles") && i.removeAttribute("data-has-inline-styles"), n.push(o);
    }
    return n;
  });
}
const LD = zt(H({}, se), { _c: /* @__PURE__ */ new Map() }), im = (r) => mt(void 0, null, function* () {
  var t, e, n;
  let i = yield (t = se.getOffsetParent) == null ? void 0 : t.call(se, r);
  return (yield (e = se.isElement) == null ? void 0 : e.call(se, i)) || (i = (yield (n = se.getDocumentElement) == null ? void 0 : n.call(se, r)) || window.document.documentElement), i;
}), DD = (r, t) => {
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
}, ID = (r, t) => {
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
}, zh = (r) => {
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
}, Rh = (r) => Ge(r, "display") === "inline", Ph = (r, t) => (t === "x" ? ["border-left-width", "border-right-width"] : ["border-top-width", "border-bottom-width"]).reduce(
  (e, n) => e + parseInt(Ge(r, n), 10),
  0
) || 0, Gs = (r, t) => parseInt(Ge(r, `margin-${t}`), 10) || 0, OD = (r) => ({
  top: Gs(r, "top"),
  right: Gs(r, "right"),
  bottom: Gs(r, "bottom"),
  left: Gs(r, "left")
}), Bh = (r) => mt(void 0, [r], function* ({
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
    if (!Ga(e))
      return a;
    let l;
    switch (s) {
      case "width":
      case "height":
        l = s;
        break;
      default: {
        let c = !1;
        const d = Ge(t, "writing-mode");
        c = d.startsWith("vertical-") || d.startsWith("sideways-"), l = ID(s, c);
      }
    }
    return l ? `${n[l]}px` : a;
  }
  if (i !== void 0) {
    let l, c;
    const d = zh(e);
    if (!(ts(e) && d && (!ts(i) || d === zh(i))))
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
          const p = (yield (o = se.isRTL) == null ? void 0 : o.call(se, t)) || !1;
          l = DD(i, p);
        }
    }
    const f = typeof l == "number" && !Number.isNaN(l), h = ND(d);
    if (f && h) {
      (e === "bottom" || e === "right") && (c = yield im(t));
      let p = n[d] + n[h] * (l / 100);
      switch (e) {
        case "bottom": {
          if (!c)
            break;
          let m = c.clientHeight;
          if (m === 0 && Rh(c)) {
            const b = Ph(c, d);
            m = c.offsetHeight - b;
          }
          p = m - p;
          break;
        }
        case "right": {
          if (!c)
            break;
          let m = c.clientWidth;
          if (m === 0 && Rh(c)) {
            const b = Ph(c, d);
            m = c.offsetWidth - b;
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
function MD(r, t = !1) {
  return mt(this, null, function* () {
    const e = document.documentElement;
    for (const [n, i] of Object.entries(r))
      for (const s of i) {
        const a = s.anchorEl, o = s.targetEl;
        if (a && o)
          yp(
            a,
            o,
            () => mt(this, null, function* () {
              const l = yield se.getElementRects({
                reference: a,
                floating: o,
                strategy: "absolute"
              }), c = yield Bh({
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
          const l = yield Bh({
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
function qD(r, t, e = !1) {
  return mt(this, null, function* () {
    if (!t.length)
      return;
    const n = document.querySelectorAll(r);
    for (const i of n) {
      let s = !1;
      const a = yield im(i);
      yp(
        i,
        i,
        () => mt(this, null, function* () {
          if (!s) {
            s = !0;
            for (const [o, { uuid: l }] of t.entries()) {
              if (i.setAttribute("data-anchor-polyfill", l), o === t.length - 1) {
                s = !1;
                break;
              }
              const c = yield se.getElementRects({
                reference: i,
                floating: i,
                strategy: "absolute"
              }), d = yield Fk(
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
        { animationFrame: e }
      );
    }
  });
}
function _D(r, t = !1) {
  return mt(this, null, function* () {
    var e, n;
    for (const i of Object.values(r))
      yield MD((e = i.declarations) != null ? e : {}, t);
    for (const [i, s] of Object.entries(r))
      yield qD(
        i,
        (n = s.fallbacks) != null ? n : [],
        t
      );
  });
}
function zD(r) {
  return mt(this, null, function* () {
    const t = !!window.UPDATE_ANCHOR_ON_ANIMATION_FRAME;
    let e = yield rD();
    (yield YL(e)) && (e = yield _h(e));
    const { rules: n, inlineStyles: i } = yield TD(e);
    return Object.values(n).length && (yield _h(e, i, !0), yield _D(n, t)), n;
  });
}
function $h() {
  console.log("[Keys UI] Starting initialization..."), "anchorName" in document.documentElement.style || zD(), Wl.initialize(), pc.getInstance().init(), gc.getInstance().init(), mc.getInstance().init(), jh.getInstance().init(), bc.getInstance().init(), yc.getInstance().init(), vc.getInstance().init(), Uh.getInstance().init(), wc.getInstance().init(), Br.getInstance().init(), kc.getInstance().init(), xc.getInstance().init(), $r.getInstance().init(), Sc.getInstance().init(), Fr.getInstance().init(), jr.getInstance().init(), Ac.getInstance().init(), Ur.getInstance().init(), Ec.getInstance().init(), Hh.getInstance().init(), Vh.getInstance().init(), console.log("[Keys UI] Initializing LightboxActions..."), Sa.getInstance().init(), Yh.getInstance().init(), Cc.getInstance().init(), cm.getInstance().init(), Tc.getInstance().init(), Lc.getInstance().init(), console.log("[Keys UI] Initialization complete!");
}
const Fh = {
  FormActions: pc.getInstance(),
  TextareaActions: gc.getInstance(),
  AlertActions: mc.getInstance(),
  AvatarActions: jh.getInstance(),
  BadgeActions: bc.getInstance(),
  BadgeGroupActions: yc.getInstance(),
  ButtonActions: vc.getInstance(),
  CalendarCore: Uh.getInstance(),
  RadioActions: wc.getInstance(),
  RangeActions: Br.getInstance(),
  SelectActions: kc.getInstance(),
  ModalActions: xc.getInstance(),
  ToastActions: $r.getInstance(),
  DropdownActions: Sc.getInstance(),
  TableActions: Fr.getInstance(),
  TimePickerActions: jr.getInstance(),
  EditorActions: Ac.getInstance(),
  DatePickerActions: Ur.getInstance(),
  AddToCartActions: Ec.getInstance(),
  GalleryActions: Hh.getInstance(),
  ImageActions: Vh.getInstance(),
  LightboxActions: Sa.getInstance(),
  ChartActions: Yh.getInstance(),
  PopoverActions: Cc.getInstance(),
  SidebarActions: Tc.getInstance(),
  CountdownActions: Lc.getInstance(),
  Quill: D,
  init: $h,
  initialize: $h
};
typeof window < "u" && (window.KeysUI = Fh, window.Quill = D, window.manualSyncEditor = () => Fh.EditorActions.manualSync());
export {
  Ec as AddToCartActions,
  mc as AlertActions,
  jh as AvatarActions,
  bc as BadgeActions,
  yc as BadgeGroupActions,
  tt as BaseActionClass,
  vc as ButtonActions,
  Uh as CalendarCore,
  Yh as ChartActions,
  cm as ColorPickerActions,
  Lc as CountdownActions,
  y as DOMUtils,
  Ur as DatePickerActions,
  Sc as DropdownActions,
  Ac as EditorActions,
  T as EventUtils,
  pc as FormActions,
  Hh as GalleryActions,
  Vh as ImageActions,
  Sa as LightboxActions,
  xc as ModalActions,
  Cc as PopoverActions,
  Wl as RTLUtils,
  wc as RadioActions,
  Br as RangeActions,
  kc as SelectActions,
  Tc as SidebarActions,
  Fr as TableActions,
  gc as TextareaActions,
  jr as TimePickerActions,
  $r as ToastActions,
  Fh as default,
  $h as initializeKeysUI
};
