var Wm = Object.defineProperty;
var Gm = (r, t, e) => t in r ? Wm(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var _ = (r, t, e) => Gm(r, typeof t != "symbol" ? t + "" : t, e);
const Pr = class Pr {
  constructor() {
    this.initialized = !1, this.stateManager = /* @__PURE__ */ new Map();
  }
  /**
   * Singleton pattern implementation
   * Automatically handles instance management based on class name
   */
  static getInstance() {
    const t = this.name;
    return Pr.instances.has(t) || Pr.instances.set(t, new this()), Pr.instances.get(t);
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
Pr.instances = /* @__PURE__ */ new Map();
let ut = Pr;
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
      var s, a, o, l, c, u, h, f, p, m, b;
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
          (b = t.onTab) == null || b.call(t);
          break;
      }
    };
  }
}
function Ku(r, t = "") {
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
class Mc extends ut {
  /**
   * Initialize form elements - required by BaseActionClass
   */
  initializeElements() {
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-action] button", (t, e) => {
      e.preventDefault(), this.handleActionClick(t);
    }), D.handleDelegatedKeydown("[data-action] button", (t, e) => {
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
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, Ku("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && await this.showCopySuccess(n, e);
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
      document.execCommand("copy"), this.showFeedback(t, Ku("feedback.copied_clipboard", "Copied to clipboard"), "success"), n && this.showCopySuccess(n, e);
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
    var h;
    const i = t.type === "password", s = i ? "text" : "password", a = e.dataset.iconDefault, o = e.dataset.iconToggle, l = (h = y.querySelector(".sr-only", e)) == null ? void 0 : h.textContent, c = e.dataset.labelToggle;
    t.type = s;
    const u = y.querySelector(".sr-only", e);
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
    const s = y.findClosest(t, ".relative");
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
Mc.getInstance();
class qc extends ut {
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
    D.handleDelegatedEvent("input", 'textarea[data-auto-resize="true"]', (t) => {
      this.handleAutoResize(t);
    }), D.handleDelegatedEvent("input", 'textarea[data-show-character-count="true"]', (t) => {
      this.updateCharacterCount(t);
    }), D.handleDelegatedEvent("paste", 'textarea[data-show-character-count="true"]', (t) => {
      setTimeout(() => {
        this.updateCharacterCount(t);
      }, 0);
    }), D.handleDelegatedEvent("cut", 'textarea[data-show-character-count="true"]', (t) => {
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
    D.dispatchCustomEvent(t, "textarea-resize", {
      element: t,
      height: e
    });
  }
  /**
   * Dispatch character count event
   */
  dispatchCharacterCountEvent(t, e, n) {
    D.dispatchCustomEvent(t, "textarea-character-count", {
      element: t,
      currentLength: e,
      maxLength: n || void 0
    });
  }
  /**
   * Add a custom resize handler with automatic cleanup
   */
  addResizeHandler(t) {
    return D.addEventListener(document, "textarea-resize", (e) => {
      const n = e;
      t(n.detail.element, n.detail.height);
    });
  }
  /**
   * Add a custom character count handler with automatic cleanup
   */
  addCharacterCountHandler(t) {
    return D.addEventListener(document, "textarea-character-count", (e) => {
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
qc.getInstance();
class _c extends ut {
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
    return y.findClosest(t, '[data-dismissible="true"]');
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
_c.getInstance();
class Sf extends ut {
  constructor() {
    super(...arguments), this.failedUrls = /* @__PURE__ */ new Set(), this.MAX_RETRIES = 2, this.RETRY_DELAY = 1e3;
  }
  // 1 second
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
    t.img && (D.addEventListener(t.img, "error", () => {
      this.handleImageError(t);
    }), D.addEventListener(t.img, "load", () => {
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
      // Start loading slightly before visible
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
class Rc extends ut {
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
Rc.getInstance();
class zc extends ut {
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
    D.handleDelegatedClick('[data-multi-state="true"]', (t, e) => {
      e.preventDefault(), this.handleButtonClick(t);
    }), D.handleDelegatedKeydown('[data-multi-state="true"]', (t, e) => {
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
    D.dispatchCustomEvent(t, "button-state-change", {
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
    return D.addEventListener(document, "button-state-change", (e) => {
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
zc.getInstance();
class je {
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
class Km {
  /**
   * Generate calendar grid data for a specific month
   */
  static generateCalendarGrid(t, e, n = 0) {
    const i = this.addMonthsToDate(e.currentMonth + "-01", n), s = parseInt(i.substring(0, 4)), a = parseInt(i.substring(5, 7)) - 1, o = new Date(s, a, 1), l = new Date(o);
    l.setDate(l.getDate() - o.getDay());
    const c = [];
    let u = [];
    for (let h = 0; h < 42; h++) {
      const f = new Date(l);
      f.setDate(l.getDate() + h);
      const p = this.formatDateString(f), m = f.getMonth() === a, b = je.isToday(p), w = e.selectedDate === p, v = this.isDateDisabled(t, f, e), k = e.isRange ? je.isDateInRange(p, e.startDate, e.endDate) : !1, A = e.isRange ? je.isDateRangeStart(p, e.startDate) : !1, E = e.isRange ? je.isDateRangeEnd(p, e.endDate) : !1, T = {
        date: p,
        day: f.getDate(),
        isCurrentMonth: m,
        isToday: b,
        isSelected: w,
        isDisabled: v,
        isInRange: k,
        isRangeStart: A,
        isRangeEnd: E
      };
      u.push(T), u.length === 7 && (c.push(u), u = []);
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
      (c) => c.map((u) => {
        const h = this.getDayButtonClasses(u, t, e), f = je.getRangeAttributes(u, e), p = this.getDateAriaLabel(u, e);
        return `
                    <div class="calendar-day ${s}">
                        <button
                            type="button"
                            class="${h}"
                            data-date="${u.date}"
                            data-calendar-day-btn
                            ${u.isDisabled ? "disabled" : ""}
                            ${f}
                            aria-label="${p}"
                            tabindex="${u.date === e.focusedDate ? "0" : "-1"}"
                        >
                            ${u.day}
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
      const a = this.generateCalendarGrid(t, e, s), o = this.getCellClasses(t), l = this.addMonthsToDate(e.currentMonth + "-01", s), c = e.monthNames[parseInt(l.substring(5, 7)) - 1], u = l.substring(0, 4), h = `
                <div class="calendar-month-header text-center font-semibold text-sm mb-2 text-muted">
                    ${c} ${u}
                </div>
            `, f = e.weekdays.map(
        (b) => `<div class="${o} font-semibold text-muted text-center text-xs">${b}</div>`
      ).join(""), p = a.map(
        (b) => b.map((w) => {
          const v = this.getDayButtonClasses(w, t, e), k = je.getRangeAttributes(w, e), A = this.getDateAriaLabel(w, e);
          return `
                        <div class="calendar-day ${o}">
                            <button
                                type="button"
                                class="${v}"
                                data-date="${w.date}"
                                data-calendar-day-btn
                                data-month-index="${s}"
                                ${w.isDisabled ? "disabled" : ""}
                                ${k}
                                aria-label="${A}"
                                tabindex="${w.date === e.focusedDate ? "0" : "-1"}"
                            >
                                ${w.day}
                            </button>
                        </div>
                    `;
        }).join("")
      ).join(""), m = `
                ${h}
                <div class="calendar-weekdays-grid grid grid-cols-7 gap-0 mb-1">
                    ${f}
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
    const e = t.dataset.size || "md";
    return {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base"
    }[e] || "w-10 h-10 text-sm";
  }
  /**
   * Get day button classes with proper state styling
   */
  static getDayButtonClasses(t, e, n) {
    const i = e.dataset.size || "md", s = "w-full h-full rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1", a = {
      sm: "text-xs",
      md: "text-sm font-medium",
      lg: "text-base font-medium"
    }[i] || "text-sm font-medium";
    let o = "";
    return t.isDisabled ? o = "bg-surface text-muted border-transparent cursor-not-allowed opacity-50" : t.isSelected && !n.isRange ? o = "bg-brand text-white border-brand-600 font-bold shadow-sm" : t.isToday ? o = "bg-neutral-50 text-brand border-brand font-semibold" : t.isCurrentMonth ? o = "text-foreground border-transparent hover:bg-neutral-hover hover:border-border" : o = "text-muted border-transparent hover:bg-neutral-hover hover:border-border", `${s} ${a} ${o}`.trim();
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
    return n.minDate && i < n.minDate || n.maxDate && i > n.maxDate ? !0 : n.disabledDates.includes(i);
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
class Tn {
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
    const a = parseInt(e.currentMonth.substring(0, 4)), o = parseInt(e.currentMonth.substring(5, 7)) - 1, l = e.monthNames.map((h, f) => {
      const p = f === o, m = this.isMonthDisabled(t, a, f, e);
      return `
                <button
                    type="button"
                    class="${this.getMonthButtonClasses(p, m)} month-option"
                    data-month="${f}"
                    data-calendar-month-btn
                    ${m ? "disabled" : ""}
                    aria-label="Select ${h} ${a}"
                >
                    ${h}
                </button>
            `;
    }).join(""), u = `
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
    s.innerHTML = u, this.bindMonthGridEvents(t, e, n, i);
  }
  /**
   * Render year selection grid
   */
  static renderYearGrid(t, e, n, i) {
    const s = t.querySelector("[data-calendar-grid-container]");
    if (!s) return;
    const a = parseInt(e.currentMonth.substring(0, 4)), o = Math.floor(a / 10) * 10, c = Array.from({ length: 12 }, (f, p) => o - 1 + p).map((f) => {
      const p = f === a, m = this.isYearDisabled(t, f, e), b = f < o || f >= o + 10;
      return `
                <button
                    type="button"
                    class="${this.getYearButtonClasses(p, m, b)} year-option"
                    data-year="${f}"
                    data-calendar-year-option
                    ${m ? "disabled" : ""}
                    aria-label="Select year ${f}"
                >
                    ${f}
                </button>
            `;
    }).join(""), h = `
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
    s.innerHTML = h, this.bindYearGridEvents(t, e, n, i);
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
    const n = "w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand";
    return e ? `${n} bg-surface text-muted cursor-not-allowed opacity-50` : t ? `${n} bg-brand text-white font-semibold shadow-sm` : `${n} text-foreground hover:bg-neutral-hover hover:scale-105`;
  }
  /**
   * Get year button classes
   */
  static getYearButtonClasses(t, e, n) {
    const i = "w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand";
    return e ? `${i} bg-surface text-muted cursor-not-allowed opacity-50` : t ? `${i} bg-brand text-white font-semibold shadow-sm` : n ? `${i} text-muted hover:bg-neutral-hover opacity-75` : `${i} text-foreground hover:bg-neutral-hover hover:scale-105`;
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
    }), t.querySelectorAll("[data-calendar-year-nav]").forEach((a) => {
      a.addEventListener("click", (o) => {
        const l = o.target.dataset.calendarYearNav, c = parseInt(e.currentMonth.substring(0, 4)), u = l === "prev" ? c - 1 : c + 1;
        this.selectYear(t, u, e, n, i);
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
        const o = a.target.dataset.calendarDecadeNav, l = parseInt(e.currentMonth.substring(0, 4)), c = Math.floor(l / 10) * 10, f = `${(o === "prev" ? c - 10 : c + 10) + l % 10}-${e.currentMonth.substring(5, 7)}`;
        n({ currentMonth: f }), this.renderYearGrid(t, e, n, i);
      });
    });
  }
}
class tl {
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
class xn {
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
    n && (n.value = e.startDate || ""), i && (i.value = e.endDate || ""), s && (s.value = je.formatRangeForDisplay(e.startDate, e.endDate)), [n, i, s].forEach((a) => {
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
        c = this.formatDateString(a), n.isRange && (o = c, l = c);
        break;
      case "yesterday":
        const f = new Date(a);
        f.setDate(f.getDate() - 1), c = this.formatDateString(f), n.isRange && (o = c, l = c);
        break;
      case "last7days":
        if (n.isRange) {
          l = this.formatDateString(a);
          const p = new Date(a);
          p.setDate(a.getDate() - 6), o = this.formatDateString(p);
        }
        break;
      case "last30days":
        if (n.isRange) {
          l = this.formatDateString(a);
          const p = new Date(a);
          p.setDate(a.getDate() - 29), o = this.formatDateString(p);
        }
        break;
      case "thismonth":
        if (n.isRange) {
          const p = new Date(a.getFullYear(), a.getMonth(), 1), m = new Date(a.getFullYear(), a.getMonth() + 1, 0);
          o = this.formatDateString(p), l = this.formatDateString(m);
        }
        break;
      case "lastmonth":
        if (n.isRange) {
          const p = new Date(a.getFullYear(), a.getMonth() - 1, 1), m = new Date(a.getFullYear(), a.getMonth(), 0);
          o = this.formatDateString(p), l = this.formatDateString(m);
        }
        break;
      case "thisyear":
        if (n.isRange) {
          const p = new Date(a.getFullYear(), 0, 1), m = new Date(a.getFullYear(), 11, 31);
          o = this.formatDateString(p), l = this.formatDateString(m);
        }
        break;
      default:
        console.warn(`Unknown quick selector value: ${e}`);
        return;
    }
    const u = l || c;
    let h = n.currentMonth;
    u && (h = this.formatYearMonth(new Date(u))), n.isRange && o && l ? i({
      startDate: o,
      endDate: l,
      rangeSelectionState: "none",
      focusedDate: l,
      viewMode: "calendar",
      currentMonth: h
    }) : !n.isRange && c && i({
      selectedDate: c,
      focusedDate: c,
      viewMode: "calendar",
      currentMonth: h
    }), s(), Tn.updateMonthYearDisplay(t, n.monthNames, h), this.updateHiddenInput(t, n), this.dispatchCalendarEvent(t, "dateSelected", {
      selectedDate: c,
      startDate: o,
      endDate: l,
      source: "quickSelector"
    });
  }
  /**
   * Handle footer actions (clear, today)
   */
  static handleFooterAction(t, e, n, i, s) {
    switch (e) {
      case "clear":
        je.clearSelection(t, n, i), s(), this.updateHiddenInput(t, n), this.dispatchCalendarEvent(t, "dateCleared", {
          source: "footerAction"
        });
        break;
      case "today":
        const a = this.formatDateString(/* @__PURE__ */ new Date()), o = this.formatYearMonth(/* @__PURE__ */ new Date());
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
        }), s(), Tn.updateMonthYearDisplay(t, n.monthNames, o), this.updateHiddenInput(t, n), this.dispatchCalendarEvent(t, "dateSelected", {
          selectedDate: n.isRange ? null : a,
          startDate: n.isRange ? a : null,
          endDate: n.isRange ? a : null,
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
    e.isRange && t.addEventListener("click", (s) => {
      const a = s.target.closest("[data-quick-selector]");
      if (a) {
        const o = a.dataset.quickSelector;
        o && this.handleQuickSelector(t, o, e, n, i);
      }
    }), t.querySelectorAll("[data-calendar-action]").forEach((s) => {
      s.addEventListener("click", (a) => {
        const o = a.target.dataset.calendarAction;
        o && this.handleFooterAction(t, o, e, n, i);
      });
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
      formattedValue: e.isRange ? je.formatRangeForDisplay(e.startDate, e.endDate) : e.selectedDate
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
class Af extends ut {
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
    this.setState(t, s), this.renderCalendar(t), this.bindAllEventListeners(t), xn.updateHiddenInput(t, s), xn.dispatchCalendarEvent(t, "initialized", { state: s });
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
    e && (this.bindDateSelectionEvents(t), this.bindNavigationEvents(t), xn.bindFormEvents(
      t,
      e,
      (n) => this.updateState(t, n),
      () => this.renderCalendar(t)
    ), tl.bindKeyboardEvents(
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
        const i = n.dataset.date;
        i && !n.disabled && this.selectDate(t, i);
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
        const u = s.dataset.calendarNav;
        Tn.navigateMonth(
          t,
          u,
          i,
          (h) => this.updateState(t, h),
          () => this.renderCalendar(t)
        );
        return;
      }
      if (n.closest("[data-calendar-month-year-btn]")) {
        Tn.toggleMonthYearDropdown(
          t,
          i,
          (u) => this.updateState(t, u),
          () => this.renderCalendar(t)
        );
        return;
      }
      const o = n.closest("[data-calendar-month-btn]");
      if (o) {
        const u = parseInt(o.dataset.month || "0");
        Tn.selectMonth(
          t,
          u,
          i,
          (h) => this.updateState(t, h),
          () => this.renderCalendar(t)
        );
        return;
      }
      const l = n.closest("[data-calendar-year-option]");
      if (l) {
        const u = parseInt(l.dataset.year || "0");
        Tn.selectYear(
          t,
          u,
          i,
          (h) => this.updateState(t, h),
          () => this.renderCalendar(t)
        );
        return;
      }
      const c = n.closest("[data-calendar-year-nav]");
      if (c) {
        const u = c.dataset.calendarYearNav;
        Tn.navigateYear(
          t,
          u,
          i,
          (h) => this.updateState(t, h),
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
    var i, s;
    const n = this.getState(t);
    n && (je.selectDate(
      t,
      e,
      n,
      (a) => this.updateState(t, a)
    ), this.renderCalendar(t), xn.updateHiddenInput(t, this.getState(t)), xn.dispatchCalendarEvent(t, "dateSelected", {
      selectedDate: n.isRange ? null : e,
      startDate: n.isRange ? (i = this.getState(t)) == null ? void 0 : i.startDate : null,
      endDate: n.isRange ? (s = this.getState(t)) == null ? void 0 : s.endDate : null,
      source: "userClick"
    }));
  }
  /**
   * Render the calendar
   */
  renderCalendar(t) {
    const e = this.getState(t);
    e && (this.toggleQuickSelectors(t, e.viewMode), e.viewMode === "calendar" ? (Km.renderCalendarGrid(t, e), tl.initializeFocus(t, e)) : e.viewMode === "month" || e.viewMode === "year" && Tn.renderYearGrid(
      t,
      e,
      (n) => this.updateState(t, n),
      () => this.renderCalendar(t)
    ));
  }
  /**
   * Toggle quick selectors visibility based on view mode and isRange
   */
  toggleQuickSelectors(t, e) {
    const n = this.getState(t), i = t.querySelector('[data-view-mode-show="calendar"]');
    i && (e === "calendar" && (n != null && n.isRange) ? i.style.display = "" : i.style.display = "none");
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
    return e ? xn.getCalendarState(t, e) : null;
  }
  /**
   * Public API: Set selected date
   */
  setSelectedDate(t, e) {
    const n = this.getState(t);
    n && xn.setSelectedDate(
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
    i && xn.setSelectedRange(
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
      tl.unbindKeyboardEvents(t);
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
class Pc extends ut {
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
      const n = y.getElementById(e);
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
Pc.getInstance();
class Wr extends ut {
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
  Wr.getInstance().init();
}) : Wr.getInstance().init();
window.RangeActions = Wr;
Wr.getInstance();
let kn = class {
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
class Bc extends ut {
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
    if (kn.isLivewireEnabled(t))
      return [];
    if (e) {
      const n = y.querySelectorAll(".select-pool-input", t), i = [];
      return n.forEach((s) => {
        s.dataset.poolActive === "true" && s.value && i.push(s.value);
      }), i;
    } else {
      const n = y.querySelector(".select-single-input", t);
      return n && n.value ? [n.value] : [];
    }
  }
  bindEventListeners() {
    D.handleDelegatedEvent("click", "[data-chip-remove]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = t.dataset.chipValue, i = y.findClosest(t, '[data-select="true"]');
      i && n && this.removeChip(i, n);
    }), D.handleDelegatedEvent("click", "[data-select-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = y.findClosest(t, '[data-select="true"]');
      n && this.clearSelection(n);
    }), D.handleDelegatedEvent("click", "[data-select-option]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, '[data-select="true"]');
      n && this.selectOption(n, t);
    }), D.handleDelegatedEvent("input", "input[data-select-search]", (t, e) => {
      const n = y.findClosest(t, '[data-select="true"]');
      n && n.dataset.searchable === "true" && this.handleSearch(n, t.value);
    }), D.addEventListener(document, "toggle", (t) => {
      const e = t.target;
      e.dataset.keysPopover === "true" && e.id.startsWith("select-dropdown-") && t.newState === "closed" && this.handlePopoverClosed(e);
    });
  }
  handlePopoverClosed(t) {
    var i;
    const e = t.id.replace("select-dropdown-", ""), n = (i = y.querySelector(`[data-select="true"] button[id="${e}"]`)) == null ? void 0 : i.closest('[data-select="true"]');
    if (n) {
      const s = y.querySelector("[data-select-search]", t);
      s && (s.value = "", this.handleSearch(n, ""));
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
    this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), kn.isLivewireEnabled(t) && this.syncToLivewire(t);
  }
  removeChip(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = n.selectedValues.indexOf(e);
    i > -1 && (n.selectedValues.splice(i, 1), this.setState(t, n), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), kn.isLivewireEnabled(t) && this.syncToLivewire(t));
  }
  clearSelection(t) {
    const e = this.getState(t);
    e && (e.selectedValues = [], this.setState(t, e), this.updateDisplay(t), this.updateStableInputs(t), this.updateOptionsSelectedState(t), kn.isLivewireEnabled(t) && this.syncToLivewire(t));
  }
  handleSearch(t, e) {
    const n = this.getState(t);
    n && (n.searchTerm = e.toLowerCase(), this.setState(t, n), this.updateFilteredOptions(t), this.updateOptionsVisibility(t));
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
      e.filteredOptions.some((u) => u.value === l) ? (o.style.display = "", s++) : o.style.display = "none";
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
      i.forEach((o) => o.remove()), s && (s.style.display = "inline"), a && (a.style.display = "none");
    else {
      s && (s.style.display = "none"), a && (a.style.display = "inline");
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
    const i = this.findOptionByValue(t, n), s = i ? i.displayLabel : n, a = document.createElement("span");
    a.className = "inline-flex items-center font-medium px-2 py-0.5 text-xs rounded-sm bg-brand text-brand-foreground", a.setAttribute("data-select-chip", "true"), a.setAttribute("data-chip-value", n), a.innerHTML = `
            <span class="chip-label">${s}</span>
            <button type="button" class="ml-1.5 w-4 h-4 flex items-center justify-center rounded-sm hover:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-white/30" data-chip-remove data-chip-value="${n}">
                <span class="text-xs leading-none" aria-hidden="true">×</span>
                <span class="sr-only">Remove ${s}</span>
            </button>
        `, e.appendChild(a);
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
        const i = e.selectedValues[0], s = this.findOptionByValue(t, i), a = s ? s.displayLabel : i;
        n.textContent = a;
      }
  }
  updateStableInputs(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = t.dataset.multiple === "true";
    kn.isLivewireEnabled(t) ? this.syncToLivewire(t) : n ? this.updateMultipleInputPool(t, e.selectedValues) : this.updateSingleInput(t, e.selectedValues[0] || "");
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
      var a, o;
      const i = n, s = i.dataset.displayLabel || ((a = i.textContent) == null ? void 0 : a.trim()) || "";
      return {
        element: i,
        value: i.dataset.value || "",
        label: ((o = i.textContent) == null ? void 0 : o.trim()) || "",
        displayLabel: s,
        searchableText: i.dataset.searchableText || s.toLowerCase(),
        disabled: i.getAttribute("aria-disabled") === "true"
      };
    });
  }
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((i) => i.value === e) || null;
  }
  syncToLivewire(t) {
    const e = this.getState(t);
    if (!e || !kn.isLivewireEnabled(t)) return;
    const n = t.dataset.multiple === "true", i = kn.formatValueForLivewire(e.selectedValues, n);
    kn.updateLivewireProperty(t, i);
  }
  // Public API methods
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
Bc.getInstance();
class $c extends ut {
  constructor() {
    super(...arguments), this.resizeCleanup = null;
  }
  /**
   * Initialize tabs elements - required by BaseActionClass
   */
  initializeElements() {
    y.findByDataAttribute("keys-tabs", "true").forEach((t) => {
      this.initializeTabsElement(t);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(t) {
    const e = t.dataset.orientation || "horizontal", n = t.dataset.variant || "default", i = t.dataset.disabled === "true", s = t.dataset.value, a = Array.from(y.querySelectorAll('[data-tabs-trigger="true"]', t)), o = Array.from(y.querySelectorAll('[data-tabs-panel="true"]', t));
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
      const n = y.findClosest(t, '[data-keys-tabs="true"]');
      n && t.getAttribute("aria-disabled") !== "true" && this.activateTab(n, t.dataset.value || "");
    }), D.handleDelegatedKeydown('[data-tabs-trigger="true"]', (t, e) => {
      const n = y.findClosest(t, '[data-keys-tabs="true"]');
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
          y.hasDataAttribute(n, "keys-tabs", "true") && (this.hasState(n) || this.initializeTabsElement(n)), y.findByDataAttribute("keys-tabs", "true", n).forEach((s) => {
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
    n && setTimeout(() => {
      this.repositionMarker(t, n);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = y.querySelector('[data-tab-marker="true"]', t);
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
$c.getInstance();
class jc extends ut {
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
    D.handleDelegatedClick("[commandfor]", (t, e) => {
      const n = t.getAttribute("command"), i = t.getAttribute("commandfor");
      if (n === "show-modal" && i) {
        const s = y.getElementById(i);
        s && s.matches("dialog[data-modal]") && this.handleModalOpen(s, t);
      }
    }), D.handleDelegatedClick("[data-modal-close]", (t, e) => {
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
jc.getInstance();
class Gr extends ut {
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
    }), D.handleDelegatedEvent("close", "dialog[data-keys-toast]", (t) => {
      const e = t.id;
      e && this.dispatchToastEvent("toast:close", e);
    }), D.handleDelegatedClick("[data-toast-action]", (t, e) => {
      const n = t.getAttribute("data-toast-action"), i = y.findClosest(t, "dialog[data-keys-toast]");
      n && i && (e.preventDefault(), e.stopPropagation(), this.dispatchToastEvent("toast:action", i.id, { action: n }));
    }), D.handleDelegatedEvent("mouseenter", "dialog[data-keys-toast]", (t) => {
      this.pauseTimer(t.id);
    }), D.handleDelegatedEvent("mouseleave", "dialog[data-keys-toast]", (t) => {
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
          y.hasDataAttribute(n, "toast-container") && this.discoverToasts();
          const i = n.querySelectorAll("[data-toast-container]"), s = n.querySelectorAll("dialog[data-keys-toast]");
          (i.length > 0 || s.length > 0) && this.discoverToasts();
        }
      });
    });
  }
  /**
   * Discover and register toast containers and existing toasts
   */
  discoverToasts() {
    const t = this.getGlobalState();
    t && (y.findByDataAttribute("toast-container").forEach((e) => {
      const n = e.getAttribute("data-toast-container");
      n && t.containers.set(n, e);
    }), document.querySelectorAll("dialog[data-keys-toast]").forEach((e) => {
      if (e instanceof HTMLDialogElement) {
        const n = e.id;
        n && (t.toasts.set(n, e), this.setupToastListeners(e));
      }
    }));
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
    if (s)
      s.appendChild(o);
    else {
      const u = document.createElement("div");
      u.className = this.getContainerClasses(i), u.setAttribute("data-toast-container", i), u.appendChild(o), document.body.appendChild(u), n.containers.set(i, u);
    }
    o instanceof HTMLDialogElement && o.show(), o.setAttribute("data-toast-visible", "true");
    const l = e.duration || 5e3;
    return !(e.persistent === !0) && l > 0 && this.setTimer(a, l), n.toasts.set(a, o), this.setupToastListeners(o), this.dispatchToastEvent("toast:show", a, e), !0;
  }
  /**
   * Create a toast dialog element dynamically to match Blade template
   */
  createToastElement(t, e, n, i) {
    const s = e === "error" ? "danger" : e, a = document.createElement("dialog");
    return a.className = this.getDialogClasses(n, s), a.setAttribute("data-keys-toast", "true"), a.setAttribute("data-variant", e), a.setAttribute("data-position", n), a.setAttribute("data-element-type", "dialog"), a.setAttribute("data-dismissible", "true"), a.setAttribute("role", "alert"), a.setAttribute("aria-live", "assertive"), a.id = t, i.title && (a.setAttribute("aria-labelledby", `${t}-title`), a.setAttribute("data-has-title", "true")), a.setAttribute("aria-describedby", `${t}-message`), a.innerHTML = `
            <div class="p-4 space-y-3">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-0.5">
                        <svg class="w-5 h-5 ${this.getIconColor(s)}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-icon="true">
                            ${this.getIconPath(s)}
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 id="${t}-title" class="hidden font-semibold text-sm leading-5 mb-1"></h3>
                        <div id="${t}-message" class="text-sm opacity-90 leading-5"></div>
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
                                data-toast-dismiss="${t}"
                                aria-label="Dismiss notification">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="sr-only">Dismiss</span>
                        </button>
                    </div>
                </div>
                <div class="hidden flex gap-2 pt-1" data-toast-actions></div>
            </div>
        `, this.updateToastContent(a, i), a;
  }
  /**
   * Get container classes for toast positioning
   */
  getContainerClasses(t) {
    const e = "fixed z-50";
    return t === "top-left" ? `${e} top-4 left-4` : t === "top-right" ? `${e} top-4 right-4` : t === "top-center" ? `${e} top-4 left-1/2 -translate-x-1/2` : t === "bottom-left" ? `${e} bottom-4 left-4` : t === "bottom-right" ? `${e} bottom-4 right-4` : t === "bottom-center" ? `${e} bottom-4 left-1/2 -translate-x-1/2` : `${e} top-4 right-4`;
  }
  /**
   * Get dialog classes for toast styling to match Blade template
   */
  getDialogClasses(t, e) {
    let n = "max-w-sm w-full p-0 m-0 border rounded-lg shadow-lg backdrop:bg-transparent transition-all duration-300 ease-out";
    return n += " translate-y-2 opacity-0 scale-95", n += " open:translate-y-0 open:opacity-100 open:scale-100", t.startsWith("bottom") && (n += " -translate-y-2 open:translate-y-0"), n += " hover:shadow-xl hover:-translate-y-1 focus-within:shadow-xl focus-within:-translate-y-1", n += " " + this.getVariantClasses(e), n;
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
    return n ? (this.clearTimer(t), e.pausedTimers.delete(t), n.setAttribute("data-toast-visible", "false"), n.setAttribute("data-toast-exiting", "true"), n instanceof HTMLDialogElement && n.close(), setTimeout(() => {
      n.parentNode && n.parentNode.removeChild(n), e.toasts.delete(t);
    }, 300), this.dispatchToastEvent("toast:dismiss", t), !0) : !1;
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
    const n = y.querySelector("[data-toast-title]", t), i = y.querySelector("[data-toast-message]", t), s = y.querySelector("[data-toast-actions]", t);
    n && e.title ? (n.textContent = e.title, n.classList.remove("hidden"), t.setAttribute("data-has-title", "true")) : n && (n.classList.add("hidden"), t.removeAttribute("data-has-title")), i && e.message && (i.textContent = e.message, t.setAttribute("data-has-content", "true")), s && e.actions ? (s.innerHTML = e.actions, s.classList.remove("hidden")) : s && s.classList.add("hidden"), t.setAttribute("data-timeout", String(e.duration || 5e3)), e.persistent === !0 && t.setAttribute("data-persistent", "true"), e.duration > 0 && !e.persistent && t.setAttribute("data-auto-hide", "true");
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(t) {
    const e = y.querySelector("[data-toast-title]", t), n = y.querySelector("[data-toast-message]", t), i = y.querySelector("[data-toast-actions]", t);
    e && (e.textContent = "", e.classList.add("hidden")), n && (n.textContent = ""), i && (i.innerHTML = "", i.classList.add("hidden")), t.removeAttribute("data-timeout"), t.removeAttribute("data-persistent"), t.removeAttribute("data-auto-hide"), t.removeAttribute("data-has-title"), t.removeAttribute("data-has-content");
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
      const s = parseInt(i.getAttribute("data-timeout") || "5000"), a = parseInt(i.getAttribute("data-toast-start-time") || "0"), o = Date.now() - a, l = Math.max(0, s - o);
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
      open: n instanceof HTMLDialogElement ? n.open : !1,
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
    t && (t.timers.forEach((e) => clearTimeout(e)), t.timers.clear(), t.pausedTimers.clear(), t.toasts.forEach((e) => {
      this.resetToastContent(e), e.style.display = "none", e.setAttribute("data-toast-visible", "false");
    }), t.toasts.clear(), t.containers.clear());
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Gr.getInstance().init();
}) : Gr.getInstance().init();
const Qm = Gr.getInstance();
window.ToastActions = Qm;
Gr.getInstance();
class Fc extends ut {
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
    n && n !== t && (e.parent = n), this.setState(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
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
    D.handleDelegatedClick("[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]", (t, e) => {
      if (t.matches("[data-submenu-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const n = y.findClosest(t, '[data-submenu="true"]');
        n && !this.isDisabled(n) && this.toggleSubmenu(n);
        return;
      }
      if (t.matches("[data-dropdown-trigger]")) {
        e.preventDefault(), e.stopPropagation();
        const n = y.findClosest(t, '[data-dropdown="true"]');
        n && !this.isDisabled(n) && this.toggleDropdown(n);
        return;
      }
      if (t.matches("[data-menu-item]")) {
        const n = y.findClosest(t, '[data-dropdown="true"]');
        n && (t.dataset.keepOpen === "true" || this.closeDropdown(n));
        return;
      }
      if (t.matches("[data-menu-checkbox], [data-menu-radio]")) {
        if (e.stopPropagation(), !(t.dataset.keepOpen !== "false")) {
          const i = y.findClosest(t, '[data-dropdown="true"]');
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
      const e = y.findClosest(t.target, "[data-submenu-trigger]");
      if (e && !this.isMobile()) {
        const n = y.findClosest(e, "[data-popover-trigger]");
        if (n) {
          const i = y.findClosest(e, "[data-keys-dropdown]");
          i && y.querySelectorAll("[data-popover-trigger]", i).forEach((a) => {
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
    const n = y.querySelector("[data-keys-popover]", t), i = y.querySelector("[data-dropdown-trigger]", t);
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
    const n = y.querySelector("[data-keys-popover]", t), i = y.querySelector("[data-submenu-trigger]", t);
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
    const n = y.querySelector("[data-keys-popover]", t), i = y.querySelector("[data-dropdown-trigger]", t);
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
    const n = y.querySelector("[data-keys-popover]", t), i = y.querySelector("[data-submenu-trigger]", t);
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
            const i = y.querySelector("[data-dropdown-trigger]", t);
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
    const n = y.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]", t);
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
Fc.getInstance();
class Kr extends ut {
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
    typeof window.Livewire > "u" || D.addEventListener(document, "livewire:navigated", () => {
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
  Kr.getInstance().init();
}) : Kr.getInstance().init();
window.TableActions = Kr;
Kr.getInstance();
class Hc extends ut {
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
    y.findByDataAttribute("button-group", "true").filter(
      (e) => y.hasDataAttribute(e, "attached", "true")
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
          y.hasDataAttribute(n, "button-group", "true") && y.hasDataAttribute(n, "attached", "true") && this.processButtonGroup(n), y.findByDataAttribute("button-group", "true", n).filter(
            (s) => y.hasDataAttribute(s, "attached", "true")
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
Hc.getInstance();
const Xm = ["top", "right", "bottom", "left"], Ae = Math.min, Mt = Math.max, va = Math.round, Ws = Math.floor, Ve = (r) => ({
  x: r,
  y: r
}), Zm = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Jm = {
  start: "end",
  end: "start"
};
function Bl(r, t, e) {
  return Mt(r, Ae(t, e));
}
function Pn(r, t) {
  return typeof r == "function" ? r(t) : r;
}
function Ge(r) {
  return r.split("-")[0];
}
function di(r) {
  return r.split("-")[1];
}
function Ef(r) {
  return r === "x" ? "y" : "x";
}
function Uc(r) {
  return r === "y" ? "height" : "width";
}
const tb = /* @__PURE__ */ new Set(["top", "bottom"]);
function He(r) {
  return tb.has(Ge(r)) ? "y" : "x";
}
function Vc(r) {
  return Ef(He(r));
}
function eb(r, t, e) {
  e === void 0 && (e = !1);
  const n = di(r), i = Vc(r), s = Uc(i);
  let a = i === "x" ? n === (e ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (a = wa(a)), [a, wa(a)];
}
function nb(r) {
  const t = wa(r);
  return [$l(r), t, $l(t)];
}
function $l(r) {
  return r.replace(/start|end/g, (t) => Jm[t]);
}
const Qu = ["left", "right"], Xu = ["right", "left"], rb = ["top", "bottom"], ib = ["bottom", "top"];
function sb(r, t, e) {
  switch (r) {
    case "top":
    case "bottom":
      return e ? t ? Xu : Qu : t ? Qu : Xu;
    case "left":
    case "right":
      return t ? rb : ib;
    default:
      return [];
  }
}
function ab(r, t, e, n) {
  const i = di(r);
  let s = sb(Ge(r), e === "start", n);
  return i && (s = s.map((a) => a + "-" + i), t && (s = s.concat(s.map($l)))), s;
}
function wa(r) {
  return r.replace(/left|right|bottom|top/g, (t) => Zm[t]);
}
function ob(r) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...r
  };
}
function Yc(r) {
  return typeof r != "number" ? ob(r) : {
    top: r,
    right: r,
    bottom: r,
    left: r
  };
}
function Qr(r) {
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
function Zu(r, t, e) {
  let {
    reference: n,
    floating: i
  } = r;
  const s = He(t), a = Vc(t), o = Uc(a), l = Ge(t), c = s === "y", u = n.x + n.width / 2 - i.width / 2, h = n.y + n.height / 2 - i.height / 2, f = n[o] / 2 - i[o] / 2;
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
  switch (di(t)) {
    case "start":
      p[a] -= f * (e && c ? -1 : 1);
      break;
    case "end":
      p[a] += f * (e && c ? -1 : 1);
      break;
  }
  return p;
}
const lb = async (r, t, e) => {
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
  } = Zu(c, n, l), f = n, p = {}, m = 0;
  for (let b = 0; b < o.length; b++) {
    const {
      name: w,
      fn: v
    } = o[b], {
      x: k,
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
    u = k ?? u, h = A ?? h, p = {
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
    } = Zu(c, f, l)), b = -1);
  }
  return {
    x: u,
    y: h,
    placement: f,
    strategy: i,
    middlewareData: p
  };
};
async function Ji(r, t) {
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
  } = Pn(t, r), m = Yc(p), w = o[f ? h === "floating" ? "reference" : "floating" : h], v = Qr(await s.getClippingRect({
    element: (e = await (s.isElement == null ? void 0 : s.isElement(w))) == null || e ? w : w.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), k = h === "floating" ? {
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
  }, T = Qr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: o,
    rect: k,
    offsetParent: A,
    strategy: l
  }) : k);
  return {
    top: (v.top - T.top + m.top) / E.y,
    bottom: (T.bottom - v.bottom + m.bottom) / E.y,
    left: (v.left - T.left + m.left) / E.x,
    right: (T.right - v.right + m.right) / E.x
  };
}
const cb = (r) => ({
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
    } = Pn(r, t) || {};
    if (c == null)
      return {};
    const h = Yc(u), f = {
      x: e,
      y: n
    }, p = Vc(i), m = Uc(p), b = await a.getDimensions(c), w = p === "y", v = w ? "top" : "left", k = w ? "bottom" : "right", A = w ? "clientHeight" : "clientWidth", E = s.reference[m] + s.reference[p] - f[p] - s.floating[m], T = f[p] - s.reference[p], M = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(c));
    let N = M ? M[A] : 0;
    (!N || !await (a.isElement == null ? void 0 : a.isElement(M))) && (N = o.floating[A] || s.floating[m]);
    const S = E / 2 - T / 2, C = N / 2 - b[m] / 2 - 1, q = Ae(h[v], C), O = Ae(h[k], C), j = q, Q = N - b[m] - O, H = N / 2 - b[m] / 2 + S, lt = Bl(j, H, Q), it = !l.arrow && di(i) != null && H !== lt && s.reference[m] / 2 - (H < j ? q : O) - b[m] / 2 < 0, vt = it ? H < j ? H - j : H - Q : 0;
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
}), ub = function(r) {
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
        flipAlignment: b = !0,
        ...w
      } = Pn(r, t);
      if ((e = s.arrow) != null && e.alignmentOffset)
        return {};
      const v = Ge(i), k = He(o), A = Ge(o) === o, E = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), T = f || (A || !b ? [wa(o)] : nb(o)), M = m !== "none";
      !f && M && T.push(...ab(o, b, m, E));
      const N = [o, ...T], S = await Ji(t, w), C = [];
      let q = ((n = s.flip) == null ? void 0 : n.overflows) || [];
      if (u && C.push(S[v]), h) {
        const H = eb(i, a, E);
        C.push(S[H[0]], S[H[1]]);
      }
      if (q = [...q, {
        placement: i,
        overflows: C
      }], !C.every((H) => H <= 0)) {
        var O, j;
        const H = (((O = s.flip) == null ? void 0 : O.index) || 0) + 1, lt = N[H];
        if (lt && (!(h === "alignment" ? k !== He(lt) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        q.every((dt) => He(dt.placement) === k ? dt.overflows[0] > 0 : !0)))
          return {
            data: {
              index: H,
              overflows: q
            },
            reset: {
              placement: lt
            }
          };
        let it = (j = q.filter((vt) => vt.overflows[0] <= 0).sort((vt, dt) => vt.overflows[1] - dt.overflows[1])[0]) == null ? void 0 : j.placement;
        if (!it)
          switch (p) {
            case "bestFit": {
              var Q;
              const vt = (Q = q.filter((dt) => {
                if (M) {
                  const wt = He(dt.placement);
                  return wt === k || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  wt === "y";
                }
                return !0;
              }).map((dt) => [dt.placement, dt.overflows.filter((wt) => wt > 0).reduce((wt, U) => wt + U, 0)]).sort((dt, wt) => dt[1] - wt[1])[0]) == null ? void 0 : Q[0];
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
function Ju(r, t) {
  return {
    top: r.top - t.height,
    right: r.right - t.width,
    bottom: r.bottom - t.height,
    left: r.left - t.width
  };
}
function td(r) {
  return Xm.some((t) => r[t] >= 0);
}
const db = function(r) {
  return r === void 0 && (r = {}), {
    name: "hide",
    options: r,
    async fn(t) {
      const {
        rects: e
      } = t, {
        strategy: n = "referenceHidden",
        ...i
      } = Pn(r, t);
      switch (n) {
        case "referenceHidden": {
          const s = await Ji(t, {
            ...i,
            elementContext: "reference"
          }), a = Ju(s, e.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: td(a)
            }
          };
        }
        case "escaped": {
          const s = await Ji(t, {
            ...i,
            altBoundary: !0
          }), a = Ju(s, e.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: td(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
};
function Cf(r) {
  const t = Ae(...r.map((s) => s.left)), e = Ae(...r.map((s) => s.top)), n = Mt(...r.map((s) => s.right)), i = Mt(...r.map((s) => s.bottom));
  return {
    x: t,
    y: e,
    width: n - t,
    height: i - e
  };
}
function hb(r) {
  const t = r.slice().sort((i, s) => i.y - s.y), e = [];
  let n = null;
  for (let i = 0; i < t.length; i++) {
    const s = t[i];
    !n || s.y - n.y > n.height / 2 ? e.push([s]) : e[e.length - 1].push(s), n = s;
  }
  return e.map((i) => Qr(Cf(i)));
}
const fb = function(r) {
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
      } = Pn(r, t), u = Array.from(await (s.getClientRects == null ? void 0 : s.getClientRects(n.reference)) || []), h = hb(u), f = Qr(Cf(u)), p = Yc(o);
      function m() {
        if (h.length === 2 && h[0].left > h[1].right && l != null && c != null)
          return h.find((w) => l > w.left - p.left && l < w.right + p.right && c > w.top - p.top && c < w.bottom + p.bottom) || f;
        if (h.length >= 2) {
          if (He(e) === "y") {
            const q = h[0], O = h[h.length - 1], j = Ge(e) === "top", Q = q.top, H = O.bottom, lt = j ? q.left : O.left, it = j ? q.right : O.right, vt = it - lt, dt = H - Q;
            return {
              top: Q,
              bottom: H,
              left: lt,
              right: it,
              width: vt,
              height: dt,
              x: lt,
              y: Q
            };
          }
          const w = Ge(e) === "left", v = Mt(...h.map((q) => q.right)), k = Ae(...h.map((q) => q.left)), A = h.filter((q) => w ? q.left === k : q.right === v), E = A[0].top, T = A[A.length - 1].bottom, M = k, N = v, S = N - M, C = T - E;
          return {
            top: E,
            bottom: T,
            left: M,
            right: N,
            width: S,
            height: C,
            x: M,
            y: E
          };
        }
        return f;
      }
      const b = await s.getElementRects({
        reference: {
          getBoundingClientRect: m
        },
        floating: n.floating,
        strategy: a
      });
      return i.reference.x !== b.reference.x || i.reference.y !== b.reference.y || i.reference.width !== b.reference.width || i.reference.height !== b.reference.height ? {
        reset: {
          rects: b
        }
      } : {};
    }
  };
}, pb = /* @__PURE__ */ new Set(["left", "top"]);
async function gb(r, t) {
  const {
    placement: e,
    platform: n,
    elements: i
  } = r, s = await (n.isRTL == null ? void 0 : n.isRTL(i.floating)), a = Ge(e), o = di(e), l = He(e) === "y", c = pb.has(a) ? -1 : 1, u = s && l ? -1 : 1, h = Pn(t, r);
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
const mb = function(r) {
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
      } = t, l = await gb(t, r);
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
}, bb = function(r) {
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
              y: k
            } = w;
            return {
              x: v,
              y: k
            };
          }
        },
        ...l
      } = Pn(r, t), c = {
        x: e,
        y: n
      }, u = await Ji(t, l), h = He(Ge(i)), f = Ef(h);
      let p = c[f], m = c[h];
      if (s) {
        const w = f === "y" ? "top" : "left", v = f === "y" ? "bottom" : "right", k = p + u[w], A = p - u[v];
        p = Bl(k, p, A);
      }
      if (a) {
        const w = h === "y" ? "top" : "left", v = h === "y" ? "bottom" : "right", k = m + u[w], A = m - u[v];
        m = Bl(k, m, A);
      }
      const b = o.fn({
        ...t,
        [f]: p,
        [h]: m
      });
      return {
        ...b,
        data: {
          x: b.x - e,
          y: b.y - n,
          enabled: {
            [f]: s,
            [h]: a
          }
        }
      };
    }
  };
}, yb = function(r) {
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
      } = Pn(r, t), u = await Ji(t, c), h = Ge(i), f = di(i), p = He(i) === "y", {
        width: m,
        height: b
      } = s.floating;
      let w, v;
      h === "top" || h === "bottom" ? (w = h, v = f === (await (a.isRTL == null ? void 0 : a.isRTL(o.floating)) ? "start" : "end") ? "left" : "right") : (v = h, w = f === "end" ? "top" : "bottom");
      const k = b - u.top - u.bottom, A = m - u.left - u.right, E = Ae(b - u[w], k), T = Ae(m - u[v], A), M = !t.middlewareData.shift;
      let N = E, S = T;
      if ((e = t.middlewareData.shift) != null && e.enabled.x && (S = A), (n = t.middlewareData.shift) != null && n.enabled.y && (N = k), M && !f) {
        const q = Mt(u.left, 0), O = Mt(u.right, 0), j = Mt(u.top, 0), Q = Mt(u.bottom, 0);
        p ? S = m - 2 * (q !== 0 || O !== 0 ? q + O : Mt(u.left, u.right)) : N = b - 2 * (j !== 0 || Q !== 0 ? j + Q : Mt(u.top, u.bottom));
      }
      await l({
        ...t,
        availableWidth: S,
        availableHeight: N
      });
      const C = await a.getDimensions(o.floating);
      return m !== C.width || b !== C.height ? {
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
function hi(r) {
  return Tf(r) ? (r.nodeName || "").toLowerCase() : "#document";
}
function Qt(r) {
  var t;
  return (r == null || (t = r.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function en(r) {
  var t;
  return (t = (Tf(r) ? r.ownerDocument : r.document) || window.document) == null ? void 0 : t.documentElement;
}
function Tf(r) {
  return Ba() ? r instanceof Node || r instanceof Qt(r).Node : !1;
}
function Ee(r) {
  return Ba() ? r instanceof Element || r instanceof Qt(r).Element : !1;
}
function Ke(r) {
  return Ba() ? r instanceof HTMLElement || r instanceof Qt(r).HTMLElement : !1;
}
function ed(r) {
  return !Ba() || typeof ShadowRoot > "u" ? !1 : r instanceof ShadowRoot || r instanceof Qt(r).ShadowRoot;
}
const vb = /* @__PURE__ */ new Set(["inline", "contents"]);
function ps(r) {
  const {
    overflow: t,
    overflowX: e,
    overflowY: n,
    display: i
  } = Ce(r);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + e) && !vb.has(i);
}
const wb = /* @__PURE__ */ new Set(["table", "td", "th"]);
function xb(r) {
  return wb.has(hi(r));
}
const kb = [":popover-open", ":modal"];
function $a(r) {
  return kb.some((t) => {
    try {
      return r.matches(t);
    } catch {
      return !1;
    }
  });
}
const Sb = ["transform", "translate", "scale", "rotate", "perspective"], Ab = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Eb = ["paint", "layout", "strict", "content"];
function Wc(r) {
  const t = Gc(), e = Ee(r) ? Ce(r) : r;
  return Sb.some((n) => e[n] ? e[n] !== "none" : !1) || (e.containerType ? e.containerType !== "normal" : !1) || !t && (e.backdropFilter ? e.backdropFilter !== "none" : !1) || !t && (e.filter ? e.filter !== "none" : !1) || Ab.some((n) => (e.willChange || "").includes(n)) || Eb.some((n) => (e.contain || "").includes(n));
}
function Cb(r) {
  let t = Mn(r);
  for (; Ke(t) && !Xr(t); ) {
    if (Wc(t))
      return t;
    if ($a(t))
      return null;
    t = Mn(t);
  }
  return null;
}
function Gc() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Tb = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Xr(r) {
  return Tb.has(hi(r));
}
function Ce(r) {
  return Qt(r).getComputedStyle(r);
}
function ja(r) {
  return Ee(r) ? {
    scrollLeft: r.scrollLeft,
    scrollTop: r.scrollTop
  } : {
    scrollLeft: r.scrollX,
    scrollTop: r.scrollY
  };
}
function Mn(r) {
  if (hi(r) === "html")
    return r;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    r.assignedSlot || // DOM Element detected.
    r.parentNode || // ShadowRoot detected.
    ed(r) && r.host || // Fallback.
    en(r)
  );
  return ed(t) ? t.host : t;
}
function Lf(r) {
  const t = Mn(r);
  return Xr(t) ? r.ownerDocument ? r.ownerDocument.body : r.body : Ke(t) && ps(t) ? t : Lf(t);
}
function ts(r, t, e) {
  var n;
  t === void 0 && (t = []), e === void 0 && (e = !0);
  const i = Lf(r), s = i === ((n = r.ownerDocument) == null ? void 0 : n.body), a = Qt(i);
  if (s) {
    const o = jl(a);
    return t.concat(a, a.visualViewport || [], ps(i) ? i : [], o && e ? ts(o) : []);
  }
  return t.concat(i, ts(i, [], e));
}
function jl(r) {
  return r.parent && Object.getPrototypeOf(r.parent) ? r.frameElement : null;
}
function Df(r) {
  const t = Ce(r);
  let e = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const i = Ke(r), s = i ? r.offsetWidth : e, a = i ? r.offsetHeight : n, o = va(e) !== s || va(n) !== a;
  return o && (e = s, n = a), {
    width: e,
    height: n,
    $: o
  };
}
function Kc(r) {
  return Ee(r) ? r : r.contextElement;
}
function Br(r) {
  const t = Kc(r);
  if (!Ke(t))
    return Ve(1);
  const e = t.getBoundingClientRect(), {
    width: n,
    height: i,
    $: s
  } = Df(t);
  let a = (s ? va(e.width) : e.width) / n, o = (s ? va(e.height) : e.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const Lb = /* @__PURE__ */ Ve(0);
function If(r) {
  const t = Qt(r);
  return !Gc() || !t.visualViewport ? Lb : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Db(r, t, e) {
  return t === void 0 && (t = !1), !e || t && e !== Qt(r) ? !1 : t;
}
function rr(r, t, e, n) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  const i = r.getBoundingClientRect(), s = Kc(r);
  let a = Ve(1);
  t && (n ? Ee(n) && (a = Br(n)) : a = Br(r));
  const o = Db(s, e, n) ? If(s) : Ve(0);
  let l = (i.left + o.x) / a.x, c = (i.top + o.y) / a.y, u = i.width / a.x, h = i.height / a.y;
  if (s) {
    const f = Qt(s), p = n && Ee(n) ? Qt(n) : n;
    let m = f, b = jl(m);
    for (; b && n && p !== m; ) {
      const w = Br(b), v = b.getBoundingClientRect(), k = Ce(b), A = v.left + (b.clientLeft + parseFloat(k.paddingLeft)) * w.x, E = v.top + (b.clientTop + parseFloat(k.paddingTop)) * w.y;
      l *= w.x, c *= w.y, u *= w.x, h *= w.y, l += A, c += E, m = Qt(b), b = jl(m);
    }
  }
  return Qr({
    width: u,
    height: h,
    x: l,
    y: c
  });
}
function Fa(r, t) {
  const e = ja(r).scrollLeft;
  return t ? t.left + e : rr(en(r)).left + e;
}
function Of(r, t) {
  const e = r.getBoundingClientRect(), n = e.left + t.scrollLeft - Fa(r, e), i = e.top + t.scrollTop;
  return {
    x: n,
    y: i
  };
}
function Ib(r) {
  let {
    elements: t,
    rect: e,
    offsetParent: n,
    strategy: i
  } = r;
  const s = i === "fixed", a = en(n), o = t ? $a(t.floating) : !1;
  if (n === a || o && s)
    return e;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Ve(1);
  const u = Ve(0), h = Ke(n);
  if ((h || !h && !s) && ((hi(n) !== "body" || ps(a)) && (l = ja(n)), Ke(n))) {
    const p = rr(n);
    c = Br(n), u.x = p.x + n.clientLeft, u.y = p.y + n.clientTop;
  }
  const f = a && !h && !s ? Of(a, l) : Ve(0);
  return {
    width: e.width * c.x,
    height: e.height * c.y,
    x: e.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: e.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function Ob(r) {
  return Array.from(r.getClientRects());
}
function Nb(r) {
  const t = en(r), e = ja(r), n = r.ownerDocument.body, i = Mt(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = Mt(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -e.scrollLeft + Fa(r);
  const o = -e.scrollTop;
  return Ce(n).direction === "rtl" && (a += Mt(t.clientWidth, n.clientWidth) - i), {
    width: i,
    height: s,
    x: a,
    y: o
  };
}
const nd = 25;
function Mb(r, t) {
  const e = Qt(r), n = en(r), i = e.visualViewport;
  let s = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (i) {
    s = i.width, a = i.height;
    const u = Gc();
    (!u || u && t === "fixed") && (o = i.offsetLeft, l = i.offsetTop);
  }
  const c = Fa(n);
  if (c <= 0) {
    const u = n.ownerDocument, h = u.body, f = getComputedStyle(h), p = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, m = Math.abs(n.clientWidth - h.clientWidth - p);
    m <= nd && (s -= m);
  } else c <= nd && (s += c);
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
const qb = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function _b(r, t) {
  const e = rr(r, !0, t === "fixed"), n = e.top + r.clientTop, i = e.left + r.clientLeft, s = Ke(r) ? Br(r) : Ve(1), a = r.clientWidth * s.x, o = r.clientHeight * s.y, l = i * s.x, c = n * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: c
  };
}
function rd(r, t, e) {
  let n;
  if (t === "viewport")
    n = Mb(r, e);
  else if (t === "document")
    n = Nb(en(r));
  else if (Ee(t))
    n = _b(t, e);
  else {
    const i = If(r);
    n = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return Qr(n);
}
function Nf(r, t) {
  const e = Mn(r);
  return e === t || !Ee(e) || Xr(e) ? !1 : Ce(e).position === "fixed" || Nf(e, t);
}
function Rb(r, t) {
  const e = t.get(r);
  if (e)
    return e;
  let n = ts(r, [], !1).filter((o) => Ee(o) && hi(o) !== "body"), i = null;
  const s = Ce(r).position === "fixed";
  let a = s ? Mn(r) : r;
  for (; Ee(a) && !Xr(a); ) {
    const o = Ce(a), l = Wc(a);
    !l && o.position === "fixed" && (i = null), (s ? !l && !i : !l && o.position === "static" && !!i && qb.has(i.position) || ps(a) && !l && Nf(r, a)) ? n = n.filter((u) => u !== a) : i = o, a = Mn(a);
  }
  return t.set(r, n), n;
}
function zb(r) {
  let {
    element: t,
    boundary: e,
    rootBoundary: n,
    strategy: i
  } = r;
  const a = [...e === "clippingAncestors" ? $a(t) ? [] : Rb(t, this._c) : [].concat(e), n], o = a[0], l = a.reduce((c, u) => {
    const h = rd(t, u, i);
    return c.top = Mt(h.top, c.top), c.right = Ae(h.right, c.right), c.bottom = Ae(h.bottom, c.bottom), c.left = Mt(h.left, c.left), c;
  }, rd(t, o, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Pb(r) {
  const {
    width: t,
    height: e
  } = Df(r);
  return {
    width: t,
    height: e
  };
}
function Bb(r, t, e) {
  const n = Ke(t), i = en(t), s = e === "fixed", a = rr(r, !0, s, t);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ve(0);
  function c() {
    l.x = Fa(i);
  }
  if (n || !n && !s)
    if ((hi(t) !== "body" || ps(i)) && (o = ja(t)), n) {
      const p = rr(t, !0, s, t);
      l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
    } else i && c();
  s && !n && i && c();
  const u = i && !n && !s ? Of(i, o) : Ve(0), h = a.left + o.scrollLeft - l.x - u.x, f = a.top + o.scrollTop - l.y - u.y;
  return {
    x: h,
    y: f,
    width: a.width,
    height: a.height
  };
}
function el(r) {
  return Ce(r).position === "static";
}
function id(r, t) {
  if (!Ke(r) || Ce(r).position === "fixed")
    return null;
  if (t)
    return t(r);
  let e = r.offsetParent;
  return en(r) === e && (e = e.ownerDocument.body), e;
}
function Mf(r, t) {
  const e = Qt(r);
  if ($a(r))
    return e;
  if (!Ke(r)) {
    let i = Mn(r);
    for (; i && !Xr(i); ) {
      if (Ee(i) && !el(i))
        return i;
      i = Mn(i);
    }
    return e;
  }
  let n = id(r, t);
  for (; n && xb(n) && el(n); )
    n = id(n, t);
  return n && Xr(n) && el(n) && !Wc(n) ? e : n || Cb(r) || e;
}
const $b = async function(r) {
  const t = this.getOffsetParent || Mf, e = this.getDimensions, n = await e(r.floating);
  return {
    reference: Bb(r.reference, await t(r.floating), r.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function jb(r) {
  return Ce(r).direction === "rtl";
}
const Fb = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Ib,
  getDocumentElement: en,
  getClippingRect: zb,
  getOffsetParent: Mf,
  getElementRects: $b,
  getClientRects: Ob,
  getDimensions: Pb,
  getScale: Br,
  isElement: Ee,
  isRTL: jb
};
function qf(r, t) {
  return r.x === t.x && r.y === t.y && r.width === t.width && r.height === t.height;
}
function Hb(r, t) {
  let e = null, n;
  const i = en(r);
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
    const m = Ws(h), b = Ws(i.clientWidth - (u + f)), w = Ws(i.clientHeight - (h + p)), v = Ws(u), A = {
      rootMargin: -m + "px " + -b + "px " + -w + "px " + -v + "px",
      threshold: Mt(0, Ae(1, l)) || 1
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
      N === 1 && !qf(c, r.getBoundingClientRect()) && a(), E = !1;
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
function Ub(r, t, e, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Kc(r), u = i || s ? [...c ? ts(c) : [], ...ts(t)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", e, {
      passive: !0
    }), s && v.addEventListener("resize", e);
  });
  const h = c && o ? Hb(c, e) : null;
  let f = -1, p = null;
  a && (p = new ResizeObserver((v) => {
    let [k] = v;
    k && k.target === c && p && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var A;
      (A = p) == null || A.observe(t);
    })), e();
  }), c && !l && p.observe(c), p.observe(t));
  let m, b = l ? rr(r) : null;
  l && w();
  function w() {
    const v = rr(r);
    b && !qf(b, v) && e(), b = v, m = requestAnimationFrame(w);
  }
  return e(), () => {
    var v;
    u.forEach((k) => {
      i && k.removeEventListener("scroll", e), s && k.removeEventListener("resize", e);
    }), h == null || h(), (v = p) == null || v.disconnect(), p = null, l && cancelAnimationFrame(m);
  };
}
const sd = mb, Vb = bb, Yb = ub, Wb = yb, Gb = db, Kb = cb, Qb = fb, Xb = (r, t, e) => {
  const n = /* @__PURE__ */ new Map(), i = {
    platform: Fb,
    ...e
  }, s = {
    ...i.platform,
    _c: n
  };
  return lb(r, t, {
    ...i,
    platform: s
  });
};
let Qc = class Pi {
  constructor() {
    this.floatingElements = /* @__PURE__ */ new Map(), this.bindEvents();
  }
  static getInstance() {
    return Pi.instance || (Pi.instance = new Pi()), Pi.instance;
  }
  /**
   * Create a floating element with proper anchoring to trigger
   */
  createFloating(t, e, n = {}) {
    if (n.useFloating === !1)
      return this.createFallbackFloating(t, e, n);
    const i = this.generateFloatingId(), s = [];
    if (n.offset !== void 0 ? s.push(sd(n.offset)) : s.push(sd(8)), n.inline) {
      const h = typeof n.inline == "object" ? n.inline : {};
      s.push(Qb(h));
    }
    if (n.flip !== !1) {
      const h = typeof n.flip == "object" ? n.flip : {};
      s.push(Yb({
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        fallbackPlacements: h.fallbackPlacements || this.getFallbackPlacements(n.placement || "bottom"),
        fallbackStrategy: h.fallbackStrategy || n.fallbackStrategy || "bestFit",
        padding: h.padding || 8
      }));
    }
    if (n.shift !== !1) {
      const h = typeof n.shift == "object" ? n.shift : {};
      s.push(Vb({
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        padding: h.padding || 8,
        limiter: h.limiter,
        crossAxis: h.crossAxis !== !1
      }));
    }
    if (n.size) {
      const h = typeof n.size == "object" ? n.size : {};
      s.push(Wb({
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
      s.push(Gb({
        strategy: h.strategy || "referenceHidden",
        boundary: h.boundary || n.boundary,
        rootBoundary: h.rootBoundary || n.rootBoundary || "viewport",
        padding: h.padding || 8
      }));
    }
    n.arrow && n.arrow !== !0 && s.push(Kb({ element: n.arrow }));
    const a = async () => {
      const { x: h, y: f, placement: p, middlewareData: m } = await Xb(t, e, {
        placement: n.placement || "bottom-start",
        strategy: n.strategy || "absolute",
        middleware: s
      }), b = this.floatingElements.get(i);
      if (b && (b.x = h, b.y = f, b.placement = p, b.middlewareData = m), Object.assign(e.style, {
        left: `${h}px`,
        top: `${f}px`,
        position: n.strategy || "absolute"
      }), e.setAttribute("data-floating-placement", p), m.hide) {
        const { referenceHidden: w, escaped: v } = m.hide;
        e.style.visibility = w || v ? "hidden" : "visible";
      }
      if (n.arrow && n.arrow !== !0 && m.arrow) {
        const w = n.arrow, { x: v, y: k } = m.arrow, A = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        }[p.split("-")[0]];
        Object.assign(w.style, {
          left: v != null ? `${v}px` : "",
          top: k != null ? `${k}px` : "",
          right: "",
          bottom: "",
          [A]: "-4px"
        });
      }
    }, o = n.autoUpdate !== !1 ? typeof n.autoUpdate == "object" ? n.autoUpdate : {} : null;
    let l = null;
    o && (l = Ub(t, e, a, {
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
const LI = Qc.getInstance();
class Zr extends ut {
  constructor() {
    super(...arguments), this.tooltipContainer = null, this.templateRetryTimeouts = /* @__PURE__ */ new Map();
  }
  /**
   * Initialize tooltip system
   */
  initializeElements() {
    this.createTooltipContainer(), this.scanForTooltips(), this.setupLivewireIntegration();
  }
  /**
   * Create container for tooltip elements
   */
  createTooltipContainer() {
    this.tooltipContainer || (this.tooltipContainer = document.createElement("div"), this.tooltipContainer.id = "keys-tooltip-container", this.tooltipContainer.className = "keys-tooltip-container fixed inset-0 pointer-events-none z-[9999]", document.body.appendChild(this.tooltipContainer));
  }
  /**
   * Scan DOM for tooltip elements
   */
  scanForTooltips() {
    y.querySelectorAll("[data-tooltip]").forEach((e) => {
      this.hasState(e) || this.initializeTooltip(e);
    });
  }
  /**
   * Initialize a single tooltip element
   */
  initializeTooltip(t) {
    const e = t.getAttribute("data-tooltip");
    if (!e || t.getAttribute("data-tooltip-disabled") === "true")
      return;
    const n = t.getAttribute("data-tooltip-trigger") || "hover", i = t.getAttribute("data-tooltip-placement") || "top", s = t.getAttribute("data-tooltip-color") || "dark", a = t.getAttribute("data-tooltip-size") || "md", o = parseInt(t.getAttribute("data-tooltip-delay") || "100"), l = t.getAttribute("data-tooltip-arrow") === "true", c = this.getTooltipContent(t, e), u = this.createTooltipElement(t, c, s, a, l), h = {
      element: t,
      tooltip: u,
      content: c,
      trigger: n,
      placement: i,
      color: s,
      size: a,
      delay: o,
      isVisible: !1,
      hasArrow: l,
      isDisabled: !1
    };
    this.setState(t, h), this.bindTooltipEvents(t, h), t.setAttribute("aria-describedby", u.id);
  }
  /**
   * Get tooltip content (text or from template)
   */
  getTooltipContent(t, e) {
    if (e === "template") {
      const n = t.getAttribute("data-tooltip-template-id");
      if (n) {
        const i = this.findTemplate(n);
        return i && i.content && i.content.childNodes.length > 0 ? i.content.cloneNode(!0) : (this.scheduleTemplateRetry(t, n), "Loading rich content...");
      } else
        return "Template ID missing";
    }
    return e;
  }
  /**
   * Try multiple methods to find a template element
   */
  findTemplate(t) {
    let e = y.getElementById(t);
    if (e && e.tagName === "TEMPLATE")
      return e;
    try {
      if (e = document.querySelector(`template[id="${t}"]`), e && e.tagName === "TEMPLATE")
        return e;
    } catch {
    }
    const n = document.querySelectorAll('template[data-tooltip-template="true"]');
    for (const i of n)
      if (i.id === t)
        return i;
    return null;
  }
  /**
   * Schedule a retry to find template content
   */
  scheduleTemplateRetry(t, e) {
    this.templateRetryTimeouts.has(t) || this.templateRetryTimeouts.set(t, []);
    const n = this.templateRetryTimeouts.get(t), i = window.setTimeout(() => {
      const s = this.findTemplate(e);
      if (s && s.content && s.content.childNodes.length > 0) {
        const a = s.content.cloneNode(!0);
        this.updateTooltipContent(t, a), this.clearTemplateRetryTimeouts(t);
      } else {
        const a = window.setTimeout(() => {
          const o = this.findTemplate(e);
          if (o && o.content && o.content.childNodes.length > 0) {
            const l = o.content.cloneNode(!0);
            this.updateTooltipContent(t, l);
          } else
            this.updateTooltipContent(t, "Rich content unavailable");
          this.clearTemplateRetryTimeouts(t);
        }, 200);
        n.push(a);
      }
    }, 100);
    n.push(i);
  }
  /**
   * Clear template retry timeouts for an element
   */
  clearTemplateRetryTimeouts(t) {
    const e = this.templateRetryTimeouts.get(t);
    e && (e.forEach((n) => clearTimeout(n)), this.templateRetryTimeouts.delete(t));
  }
  /**
   * Update the content of an existing tooltip
   */
  updateTooltipContent(t, e) {
    const n = this.getState(t);
    if (n) {
      n.content = e;
      const i = y.querySelector(".tooltip-content-wrapper", n.tooltip);
      i && (i.innerHTML = "", typeof e == "string" ? i.textContent = e : i.appendChild(e));
    }
  }
  /**
   * Create tooltip DOM element
   */
  createTooltipElement(t, e, n, i, s) {
    var c;
    const a = `tooltip-${t.getAttribute("data-tooltip-id") || Date.now()}`, o = document.createElement("div");
    if (o.id = a, o.className = this.getTooltipClasses(n, i), o.setAttribute("role", "tooltip"), o.setAttribute("data-keys-tooltip-element", "true"), o.setAttribute("data-tooltip-placement", t.getAttribute("data-tooltip-placement") || "top"), o.setAttribute("data-tooltip-color", n), s) {
      const u = document.createElement("div");
      u.className = this.getArrowClasses(n), u.setAttribute("data-tooltip-arrow", "true"), o.appendChild(u);
    }
    const l = document.createElement("div");
    return l.className = "tooltip-content-wrapper", typeof e == "string" ? l.textContent = e : l.appendChild(e), o.appendChild(l), o.style.display = "none", o.style.position = "absolute", o.style.opacity = "0", o.style.transform = "scale(0.95)", (c = this.tooltipContainer) == null || c.appendChild(o), o;
  }
  /**
   * Get tooltip CSS classes using existing CSS infrastructure
   */
  getTooltipClasses(t, e) {
    const n = "tooltip-content transition-all duration-200 pointer-events-none", i = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base"
    }[e] || "px-3 py-2 text-sm", s = {
      dark: "bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600",
      light: "bg-surface text-foreground border border-border"
    }[t] || "bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600";
    return `${n} ${i} ${s}`;
  }
  /**
   * Get arrow CSS classes with placement-aware borders
   */
  getArrowClasses(t) {
    const e = "tooltip-arrow absolute w-2 h-2 rotate-45 -z-10", n = {
      dark: "bg-neutral-900 dark:bg-neutral-800",
      light: "bg-surface"
    }[t] || "bg-neutral-900 dark:bg-neutral-800";
    return `${e} ${n}`;
  }
  /**
   * Bind events for tooltip
   */
  bindTooltipEvents(t, e) {
    switch (e.trigger) {
      case "hover":
        t.addEventListener("mouseenter", () => this.scheduleShow(t)), t.addEventListener("mouseleave", () => this.scheduleHide(t)), e.tooltip.addEventListener("mouseenter", () => this.cancelHide(t)), e.tooltip.addEventListener("mouseleave", () => this.scheduleHide(t));
        break;
      case "click":
        t.addEventListener("click", (n) => {
          n.preventDefault(), this.toggleTooltip(t);
        });
        break;
      case "focus":
        t.addEventListener("focus", () => this.scheduleShow(t)), t.addEventListener("blur", () => this.scheduleHide(t));
        break;
    }
    t.addEventListener("keydown", (n) => {
      n.key === "Escape" && e.isVisible && this.hideTooltip(t);
    });
  }
  /**
   * Bind global event listeners
   */
  bindEventListeners() {
    D.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && this.getAllStates().forEach((n, i) => {
        n.trigger === "click" && n.isVisible && !i.contains(e) && !n.tooltip.contains(e) && this.hideTooltip(i);
      });
    }), D.addEventListener(document, "scroll", () => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.hideTooltip(e);
      });
    }, { passive: !0 }), D.handleResize(() => {
      this.getAllStates().forEach((t, e) => {
        t.isVisible && this.positionTooltip(e);
      });
    }, 100);
  }
  /**
   * Setup dynamic observer for new elements
   */
  setupDynamicObserver() {
    this.createDynamicObserver((t) => {
      t.forEach((e) => {
        if (e.nodeType === Node.ELEMENT_NODE) {
          const n = e;
          n.hasAttribute("data-tooltip") && this.initializeTooltip(n), y.querySelectorAll("[data-tooltip]", n).forEach((i) => {
            this.hasState(i) || this.initializeTooltip(i);
          });
        }
      });
    });
  }
  /**
   * Schedule tooltip show with delay
   */
  scheduleShow(t) {
    const e = this.getState(t);
    !e || e.isDisabled || (this.cancelHide(t), e.showTimer = window.setTimeout(() => {
      this.showTooltip(t);
    }, e.delay));
  }
  /**
   * Schedule tooltip hide with delay
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
    !e || e.isVisible || (this.hideAllTooltips(), e.tooltip.style.display = "block", this.positionTooltip(t), e.isVisible = !0, requestAnimationFrame(() => {
      e.tooltip.style.opacity = "1", e.tooltip.style.transform = "scale(1)";
    }), this.dispatchTooltipEvent(t, "tooltip:show"));
  }
  /**
   * Hide tooltip
   */
  hideTooltip(t) {
    const e = this.getState(t);
    !e || !e.isVisible || (e.floating && (e.floating.cleanup(), e.floating = void 0), e.tooltip.style.opacity = "0", e.tooltip.style.transform = "scale(0.95)", setTimeout(() => {
      e.tooltip.style.display = "none";
    }, 200), e.isVisible = !1, this.dispatchTooltipEvent(t, "tooltip:hide"));
  }
  /**
   * Toggle tooltip visibility
   */
  toggleTooltip(t) {
    const e = this.getState(t);
    e && (e.isVisible ? this.hideTooltip(t) : this.showTooltip(t));
  }
  /**
   * Hide all visible tooltips
   */
  hideAllTooltips() {
    this.getAllStates().forEach((t, e) => {
      t.isVisible && this.hideTooltip(e);
    });
  }
  /**
   * Position tooltip using Floating UI
   */
  positionTooltip(t) {
    const e = this.getState(t);
    if (!e) return;
    e.floating && e.floating.cleanup();
    const n = e.hasArrow ? y.querySelector("[data-tooltip-arrow]", e.tooltip) : void 0, i = Qc.getInstance().createFloating(t, e.tooltip, {
      placement: e.placement,
      offset: 8,
      flip: {
        fallbackStrategy: "bestFit",
        padding: 8
      },
      shift: {
        padding: 8,
        crossAxis: !0
      },
      arrow: n || void 0,
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
    e.floating = i;
  }
  /**
   * Dispatch tooltip events
   */
  dispatchTooltipEvent(t, e, n = {}) {
    D.dispatchCustomEvent(t, e, {
      element: t,
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
    typeof window.Livewire > "u" || (document.addEventListener("livewire:navigated", () => {
      this.reinitialize();
    }), document.addEventListener("livewire:updated", () => {
      this.scanForTooltips();
    }));
  }
  /**
   * Reinitialize tooltip system
   */
  reinitialize() {
    this.hideAllTooltips(), this.clearAllStates(), this.scanForTooltips();
  }
  /**
   * Public API: Show tooltip programmatically
   */
  show(t) {
    const e = typeof t == "string" ? y.querySelector(t) : t;
    return e && this.hasState(e) ? (this.showTooltip(e), !0) : !1;
  }
  /**
   * Public API: Hide tooltip programmatically
   */
  hide(t) {
    const e = typeof t == "string" ? y.querySelector(t) : t;
    return e && this.hasState(e) ? (this.hideTooltip(e), !0) : !1;
  }
  /**
   * Public API: Toggle tooltip programmatically
   */
  toggle(t) {
    const e = typeof t == "string" ? y.querySelector(t) : t;
    return e && this.hasState(e) ? (this.toggleTooltip(e), !0) : !1;
  }
  /**
   * Public API: Update tooltip content
   */
  updateContent(t, e) {
    const n = typeof t == "string" ? y.querySelector(t) : t;
    return n && this.hasState(n) && this.getState(n) ? (this.updateTooltipContent(n, e), typeof e == "string" ? (n.setAttribute("data-tooltip", e), n.setAttribute("title", e)) : (n.setAttribute("data-tooltip", "template"), n.removeAttribute("title")), !0) : !1;
  }
  /**
   * Public API: Enable/disable tooltip
   */
  setEnabled(t, e) {
    const n = typeof t == "string" ? y.querySelector(t) : t;
    if (n && this.hasState(n)) {
      const i = this.getState(n);
      if (i)
        return i.isDisabled = !e, n.setAttribute("data-tooltip-disabled", e ? "false" : "true"), !e && i.isVisible && this.hideTooltip(n), !0;
    }
    return !1;
  }
  /**
   * Clean up tooltip system
   */
  onDestroy() {
    this.getAllStates().forEach((t) => {
      t.floating && t.floating.cleanup();
    }), this.templateRetryTimeouts.forEach((t, e) => {
      t.forEach((n) => clearTimeout(n));
    }), this.templateRetryTimeouts.clear(), this.tooltipContainer && (this.tooltipContainer.remove(), this.tooltipContainer = null);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  Zr.getInstance().init();
}) : Zr.getInstance().init();
window.TooltipActions = Zr;
Zr.getInstance();
class Jr extends ut {
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
    D.handleDelegatedClick("[data-timepicker-trigger]", (t, e) => {
      console.log("🕒 TimePicker trigger clicked:", t);
      const n = y.findClosest(t, "[data-keys-timepicker]");
      if (n && !this.isDisabled(n)) {
        console.log("🕒 Native popover will handle toggle for:", n);
        const i = this.getState(n);
        i && console.log("🕒 Current TimePicker state:", i);
      } else
        console.log("🕒 TimePicker trigger ignored - disabled or not found"), e.preventDefault();
    }), D.handleDelegatedClick("[data-timepicker-clear]", (t, e) => {
      console.log("🕒 TimePicker clear button clicked:", t), e.preventDefault(), e.stopPropagation();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && (console.log("🕒 Clearing TimePicker value for:", n), this.clearTime(n));
    }), D.handleDelegatedClick("[data-timepicker-hour]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = parseInt(t.dataset.timepickerHour || "0");
      n && this.setHour(n, i);
    }), D.handleDelegatedClick("[data-timepicker-minute]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = parseInt(t.dataset.timepickerMinute || "0");
      n && this.setMinute(n, i);
    }), D.handleDelegatedClick("[data-timepicker-second]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = parseInt(t.dataset.timepickerSecond || "0");
      n && this.setSecond(n, i);
    }), D.handleDelegatedClick("[data-timepicker-period]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = t.dataset.timepickerPeriod;
      n && this.setPeriod(n, i);
    }), D.handleDelegatedClick("[data-timepicker-format]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]"), i = t.dataset.timepickerFormat;
      n && this.setFormat(n, i);
    }), D.handleDelegatedClick("[data-timepicker-now]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && this.setToCurrentTime(n);
    }), D.handleDelegatedClick("[data-timepicker-apply]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && this.applyTime(n);
    }), D.handleDelegatedClick("[data-timepicker-cancel]", (t, e) => {
      e.preventDefault();
      const n = y.findClosest(t, "[data-keys-timepicker]");
      n && this.closeDropdown(n);
    }), D.addEventListener(document, "click", (t) => {
      const e = t.target;
      e && e instanceof Element && (e.closest("[data-keys-timepicker]") || this.closeAllDropdowns());
    }), D.handleDelegatedKeydown("[data-keys-timepicker]", (t, e) => {
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
    e.floating && (e.floating.cleanup(), e.floating = void 0), e.isOpen = !1, this.setState(t, e);
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
    if (n && (n.value = e), i)
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
    console.log("🕒 Updating clear button visibility:", { value: e, clearButton: !!n, disabled: t.dataset.disabled }), n && (e && !t.dataset.disabled ? (n.classList.remove("opacity-0", "pointer-events-none"), n.classList.add("pointer-events-auto"), console.log("🕒 Clear button shown")) : (n.classList.add("opacity-0", "pointer-events-none"), n.classList.remove("pointer-events-auto"), console.log("🕒 Clear button hidden")));
  }
  /**
   * Update selected states in dropdown
   */
  updateSelectedStates(t) {
    const e = this.getState(t);
    if (!e) return;
    y.querySelectorAll(".selected", t).forEach((s) => s.classList.remove("selected"));
    const n = y.querySelector(`[data-timepicker-hour="${e.hour}"]`, t);
    n && n.classList.add("selected");
    const i = y.querySelector(`[data-timepicker-minute="${e.minute}"]`, t);
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
    y.querySelectorAll("[data-timepicker-format]", t).forEach((i) => {
      i.dataset.timepickerFormat === e.format ? (i.classList.add("bg-brand", "text-foreground-brand"), i.classList.remove("bg-surface", "text-muted")) : (i.classList.remove("bg-brand", "text-foreground-brand"), i.classList.add("bg-surface", "text-muted"));
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
    const i = e.format === "12" ? Array.from({ length: 12 }, (s, a) => a + 1) : (
      // 1-12 for 12h
      Array.from({ length: 24 }, (s, a) => a)
    );
    n.innerHTML = "", i.forEach((s) => {
      const a = document.createElement("button");
      a.type = "button", a.dataset.timepickerHour = s.toString(), a.className = "w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand transition-colors", a.textContent = s.toString().padStart(2, "0"), n.appendChild(a);
    }), e.format === "12" && (e.hour < 1 || e.hour > 12) ? (e.hour = Math.max(1, Math.min(12, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t)) : e.format === "24" && (e.hour < 0 || e.hour > 23) && (e.hour = Math.max(0, Math.min(23, e.hour)), this.setState(t, e), this.updateDisplay(t), this.updatePreview(t));
  }
  /**
   * Update visibility of the period (AM/PM) section based on current format
   */
  updatePeriodSectionVisibility(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-timepicker-period-section]", t);
    n && (n.style.display = e.format === "12" ? "block" : "none");
  }
  /**
   * Update grid layout based on current format and settings
   */
  updateGridLayout(t) {
    const e = this.getState(t);
    if (!e) return;
    const n = y.querySelector("[data-timepicker-grid]", t);
    if (!n) return;
    let i = 2;
    e.showSeconds && i++, e.format === "12" && i++, n.style.gridTemplateColumns = `repeat(${i}, 1fr)`;
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
   * Position dropdown using Floating UI
   */
  positionDropdown(t) {
    const e = y.querySelector("[data-timepicker-dropdown]", t), n = y.querySelector("[data-timepicker-trigger]", t);
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
    const c = Qc.getInstance().createFloating(e, n, {
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
  Jr.getInstance().init();
}) : Jr.getInstance().init();
window.TimePickerActions = Jr;
Jr.getInstance();
class Gn {
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
class Xc extends ut {
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
      const h = y.getDataAttribute(n, "quill-value");
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
    Gn.isLivewireEnabled(t);
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
    const e = Gn.isLivewireEnabled(t.containerElement);
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
    const e = t.quillInstance.root.innerHTML, n = Gn.formatValueForLivewire(e);
    Gn.updateLivewireProperty(t.containerElement, n);
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
      if (Gn.isLivewireEnabled(e)) {
        const n = window.Quill.find(e);
        if (n) {
          const i = n.root.innerHTML, s = Gn.formatValueForLivewire(i);
          Gn.updateLivewireProperty(e, s);
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
Xc.getInstance();
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
let Ln = Pa;
class ti extends ut {
  /**
   * Initialize date picker elements - required by BaseActionClass
   */
  initializeElements() {
    y.querySelectorAll("[data-keys-date-picker]").forEach((t) => {
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
      selectedDate: s.selectedDate || null,
      startDate: s.startDate || null,
      endDate: s.endDate || null,
      format: s.format || "Y-m-d",
      displayFormat: s.displayFormat || s.format || "Y-m-d",
      isRange: s.isRange || !1,
      closeOnSelect: s.closeOnSelect !== !1,
      isInline: n,
      isDisabled: i
    };
    this.setState(t, a), this.setupCalendarEventListeners(t);
  }
  /**
   * Bind event listeners using event delegation - required by BaseActionClass
   */
  bindEventListeners() {
    D.handleDelegatedClick("[data-date-picker-trigger]", (t, e) => {
      console.log("🗓️ DatePicker trigger clicked:", t);
      const n = y.findClosest(t, "[data-keys-date-picker]");
      if (n && !this.isDisabled(n)) {
        console.log("🗓️ Native popover will handle toggle for:", n);
        const i = this.getState(n);
        i && console.log("🗓️ Current DatePicker state:", i);
      } else
        console.log("🗓️ DatePicker trigger ignored - disabled or not found"), e.preventDefault();
    }), D.handleDelegatedClick("[data-date-picker-clear]", (t, e) => {
      e.preventDefault(), e.stopPropagation();
      const n = y.findClosest(t, '[data-date-picker="true"]');
      n && !this.isDisabled(n) && this.clearDate(n);
    }), D.handleDelegatedKeydown("[data-date-picker-input]", (t, e) => {
      const n = y.findClosest(t, "[data-keys-date-picker]");
      if (n)
        switch (e.key) {
          case "Tab":
            const i = y.querySelector('[data-keys-calendar="true"]', n);
            if (i) {
              const s = y.findClosest(i, "[data-keys-popover]");
              s && s.matches(":popover-open") && setTimeout(() => {
                const a = i.querySelector("button:not(:disabled)");
                a && a.focus();
              }, 10);
            }
            break;
        }
    }), D.handleDelegatedInput("[data-date-picker-input]", (t) => {
      if (!t.readOnly) {
        const e = y.findClosest(t, "[data-keys-date-picker]");
        e && !this.isDisabled(e) && this.handleManualInput(e, t.value);
      }
    });
  }
  /**
   * Setup calendar event listeners for a date picker
   */
  setupCalendarEventListeners(t) {
    const e = y.querySelector('[data-keys-calendar="true"]', t);
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
  // Dropdown management methods removed - now handled by native popover API
  // Positioning methods removed - now handled by native popover API
  /**
   * Handle date selection from calendar
   */
  handleDateSelected(t, e, n) {
    const i = this.getState(t);
    if (!i) return;
    i.selectedDate = e, this.setState(t, i);
    const s = y.querySelector("[data-date-picker-display]", t);
    if (s)
      if (e)
        s.innerHTML = this.formatDateForDisplay(e, i.displayFormat);
      else {
        const o = t.dataset.placeholder || "Select date...";
        s.innerHTML = `<span class="text-muted date-picker-placeholder">${o}</span>`;
      }
    const a = y.querySelector("[data-date-picker-value]", t);
    a && (a.value = e ? Ln.formatDateForSubmission(e, i.format) : ""), i.closeOnSelect && !i.isInline && !i.isRange && setTimeout(() => {
      const o = y.findClosest(t, "[data-keys-popover]") || y.querySelector("[data-keys-popover]", t);
      if (o && "hidePopover" in o)
        try {
          o.hidePopover();
        } catch {
          console.log("Popover already closed or not open");
        }
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
    const a = y.querySelector("[data-date-picker-display]", t);
    if (a) {
      const l = Ln.formatRangeForDisplay(e, n, s.displayFormat);
      if (l)
        a.innerHTML = l;
      else {
        const c = t.dataset.placeholder || "Select date range";
        a.innerHTML = `<span class="text-muted date-picker-placeholder">${c}</span>`;
      }
    }
    const o = y.querySelector("[data-date-picker-value]", t);
    if (o) {
      const l = Ln.formatRangeForSubmission(e, n, s.format);
      o.value = l || "";
    }
    s.closeOnSelect && e && n && !s.isInline && setTimeout(() => {
      const l = y.findClosest(t, "[data-keys-popover]") || y.querySelector("[data-keys-popover]", t);
      if (l && "hidePopover" in l)
        try {
          l.hidePopover();
        } catch {
        }
    }, 150), this.dispatchDatePickerEvent(t, "datepicker:change", {
      startDate: e,
      endDate: n,
      formatted: i
    });
  }
  /**
   * Handle calendar cleared event
   *
   * @private
   * @param {HTMLElement} datePicker - The date picker element
   */
  handleCalendarCleared(t) {
    this.clearDate(t);
  }
  /**
   * Clear selected date(s)
   *
   * @private
   * @param {HTMLElement} datePicker - The date picker element
   */
  clearDate(t) {
    const e = this.getState(t);
    if (!e) return;
    e.selectedDate = null, e.startDate = null, e.endDate = null, this.setState(t, e);
    const n = y.querySelector("[data-date-picker-display]", t);
    if (n) {
      const a = t.dataset.placeholder || "Select date...";
      n.innerHTML = `<span class="text-muted date-picker-placeholder">${a}</span>`;
    }
    const i = y.querySelector("[data-date-picker-value]", t);
    i && (i.value = "");
    const s = y.querySelector('[data-keys-calendar="true"]', t);
    if (s && window.CalendarCore)
      try {
        const a = window.CalendarCore.getInstance();
        e.isRange ? a.setSelectedRange(s, null, null) : a.setSelectedDate(s, null);
      } catch {
      }
    if (!e.isInline) {
      const a = y.findClosest(t, "[data-keys-popover]") || y.querySelector("[data-keys-popover]", t);
      if (a && "hidePopover" in a)
        try {
          a.hidePopover();
        } catch {
        }
    }
    this.dispatchDatePickerEvent(t, "datepicker:cleared");
  }
  /**
   * Handle manual input
   */
  handleManualInput(t, e) {
    const n = this.getState(t);
    if (!n) return;
    const i = Ln.parseInputDate(e, n.displayFormat);
    if (i) {
      const s = Ln.formatDateString(i), a = y.querySelector("[data-date-picker-display]", t);
      a && (a.innerHTML = this.formatDateForDisplay(s, n.displayFormat));
      const o = y.querySelector('[data-keys-calendar="true"]', t);
      if (o && window.CalendarCore)
        try {
          window.CalendarCore.getInstance().setSelectedDate(o, s);
        } catch (l) {
          console.warn("Calendar core not available or failed:", l);
        }
    }
  }
  /**
   * Check if date picker is disabled
   *
   * @private
   * @param {HTMLElement} datePicker - The date picker element
   * @returns {boolean} Whether the date picker is disabled
   */
  isDisabled(t) {
    const e = this.getState(t);
    return e ? e.isDisabled : !1;
  }
  /**
   * Dispatch custom date picker event
   *
   * @private
   * @param {HTMLElement} datePicker - The date picker element
   * @param {string} eventName - The event name
   * @param {any} detail - The event detail
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
   *
   * @protected
   */
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
  /**
   * Format a date for display using improved JavaScript date formatting
   *
   * This method provides consistent date formatting that properly handles custom formats
   * like 'F j, Y' without the corruption issues seen in DateUtils.
   *
   * @param dateString - The date string to format (Y-m-d format)
   * @param displayFormat - The display format string
   * @returns The formatted date string
   * @private
   */
  formatDateForDisplay(t, e) {
    try {
      const n = /* @__PURE__ */ new Date(t + "T00:00:00");
      if (e === "F j, Y") {
        const s = [
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
        ][n.getMonth()], a = n.getDate(), o = n.getFullYear();
        return `${s} ${a}, ${o}`;
      }
      return Ln.formatDateForDisplay(t, e);
    } catch (n) {
      return console.warn("Date formatting error:", n), t;
    }
  }
  /**
   * Clean up DatePickerActions - extends BaseActionClass destroy
   *
   * @protected
   */
  onDestroy() {
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  ti.getInstance().init();
}) : ti.getInstance().init();
window.DatePickerActions = ti;
ti.getInstance();
class Zc extends ut {
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
    let u = c;
    n === "increase" ? u = Math.min(c + 1, l.maxQuantity) : u = Math.max(c - 1, 1), u !== c && (s.value = u.toString(), l.quantity = u, this.setState(o, l), this.dispatchCartEvent(o, "cart:quantity-changed", {
      productId: l.productId,
      quantity: u,
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
    D.dispatchCustomEvent(t, e, n);
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
    Zc.getInstance().init();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r) : r();
}
class Zb extends ut {
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
    y.findByDataAttribute("file-upload-zone").forEach((i) => {
      if (i.getAttribute("data-lightbox") === "true") {
        const a = i.parentElement;
        a && this.initializeLightboxForUpload(a);
      }
    }), y.findByDataAttribute("lightbox-image").forEach((i) => {
      this.initializeLightboxForImage(i);
    }), y.findByDataAttribute("gallery").forEach((i) => {
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
      const u = e.images.length > 1;
      l.style.display = u ? "flex" : "none", c.style.display = u ? "flex" : "none";
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
class _f extends ut {
  constructor() {
    super(), this.lightboxActions = new Zb(), this.init();
  }
  /**
   * Initialize gallery elements - required by BaseActionClass
   */
  initializeElements() {
    this.lightboxActions.init(), y.findByDataAttribute("gallery", "true").forEach((t) => {
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
class Jc {
  constructor() {
    console.log("PopoverActions: Using native HTML Popover API");
  }
}
new Jc();
function Rf() {
  const r = document.querySelectorAll('[data-keys-file-upload="true"]:not([data-initialized="true"])'), t = typeof window.Livewire < "u";
  r.forEach((e) => {
    const n = e, i = n.querySelector(".file-input");
    i && (Jb(n, i), ty(n, i), ey(n, i), ny(n, i), ry(n, i, t), n.dataset.initialized = "true");
  });
}
function Jb(r, t, e) {
  t.addEventListener("change", () => {
    t.files && t.files.length > 0 ? zf(r, t, t.files[0]) : Pf(r);
  });
}
function ty(r, t) {
  if (r.dataset.dragDrop !== "true" || r.dataset.disabled === "true")
    return;
  ["dragenter", "dragover", "dragleave", "drop"].forEach((n) => r.addEventListener(n, oy)), ["dragenter", "dragover"].forEach((n) => {
    r.addEventListener(n, () => r.classList.add("dragover"));
  }), ["dragleave", "drop"].forEach((n) => {
    r.addEventListener(n, () => r.classList.remove("dragover"));
  }), r.addEventListener("drop", (n) => {
    var s;
    const i = (s = n.dataTransfer) == null ? void 0 : s.files;
    i && i.length > 0 && zf(r, t, i[0]);
  });
}
function ey(r, t) {
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
function ny(r, t) {
  const e = r.querySelector(".file-remove");
  e && e.addEventListener("click", (n) => {
    n.preventDefault(), n.stopPropagation(), t.value = "", Pf(r), tu(r), jf(r, "File removed"), r.dataset.livewire === "true" && t.dispatchEvent(new Event("change", { bubbles: !0 }));
  });
}
function ry(r, t, e) {
  !e || r.dataset.livewire !== "true" || (t.addEventListener("livewire-upload-start", () => {
    Rr(r, !0), Fl(r, 0);
  }), t.addEventListener("livewire-upload-progress", (n) => {
    var s;
    const i = n;
    (s = i.detail) != null && s.progress && Fl(r, i.detail.progress);
  }), t.addEventListener("livewire-upload-finish", () => {
    Rr(r, !1), t.files && t.files.length > 0 && Bf(r, t.files[0]);
  }), t.addEventListener("livewire-upload-error", (n) => {
    var s;
    $f(r, ((s = n.detail) == null ? void 0 : s.message) || "Upload failed. Please try again."), Rr(r, !1);
  }), t.addEventListener("livewire-upload-cancel", () => {
    Rr(r, !1), tu(r);
  }));
}
function zf(r, t, e, n) {
  const i = iy(r, e);
  if (!i.valid) {
    $f(r, i.error || "Invalid file");
    return;
  }
  tu(r), r.dataset.livewire === "true" ? (Rr(r, !0), Fl(r, 0)) : Bf(r, e);
}
function iy(r, t) {
  const e = r.dataset.accept, n = r.dataset.maxSize, i = r.dataset.maxSizeFormatted;
  if (e && e !== "*") {
    const s = e.split(",").map((o) => o.trim());
    if (!s.some((o) => o.startsWith(".") ? t.name.toLowerCase().endsWith(o.toLowerCase()) : o.includes("*") ? t.type.startsWith(o.split("/")[0] + "/") : t.type === o))
      return { valid: !1, error: `File type not allowed. Accepted: ${s.join(", ")}` };
  }
  return n && t.size > parseInt(n) ? { valid: !1, error: `File too large. Maximum size: ${i || "10MB"}` } : { valid: !0 };
}
function Pf(r) {
  const t = r.querySelector(".upload-empty-state"), e = r.querySelector(".upload-file-state");
  we(t, !0), we(e, !1), Rr(r, !1), r.classList.remove("dragover");
}
function Bf(r, t) {
  const e = r.querySelector(".upload-empty-state"), n = r.querySelector(".upload-file-state");
  we(e, !1), we(n, !0), sy(r, t), jf(r, `File selected: ${t.name}`);
}
function sy(r, t) {
  const e = r.querySelector(".file-name"), n = r.querySelector(".file-size"), i = r.querySelector(".file-preview-image"), s = r.querySelector(".file-icon");
  if (e && (e.textContent = t.name), n && (n.textContent = ay(t.size)), t.type.startsWith("image/")) {
    const a = new FileReader();
    a.onload = (o) => {
      var l;
      i && ((l = o.target) != null && l.result) && (i.src = o.target.result, we(i, !0), we(s, !1));
    }, a.readAsDataURL(t);
  } else
    we(i, !1), we(s, !0);
}
function Rr(r, t) {
  const e = r.querySelector(".upload-progress");
  we(e, t);
}
function $f(r, t) {
  const e = r.querySelector(".error-message");
  e && (e.textContent = t, we(e, !0)), r.setAttribute("data-invalid", "true");
}
function tu(r) {
  const t = r.querySelector(".error-message");
  t && we(t, !1), r.removeAttribute("data-invalid");
}
function ay(r) {
  if (r === 0) return "0 Bytes";
  const t = 1024, e = ["Bytes", "KB", "MB", "GB"], n = Math.floor(Math.log(r) / Math.log(t));
  return parseFloat((r / Math.pow(t, n)).toFixed(2)) + " " + e[n];
}
function we(r, t) {
  r && r.classList.toggle("hidden", !t);
}
function Fl(r, t) {
  const e = r.querySelector(".upload-progress-bar");
  e && (e.style.width = `${t}%`);
}
function oy(r) {
  r.preventDefault(), r.stopPropagation();
}
function jf(r, t) {
  const e = document.createElement("div");
  e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), e.className = "sr-only", e.textContent = t, r.appendChild(e), setTimeout(() => {
    r.contains(e) && r.removeChild(e);
  }, 1e3);
}
document.addEventListener("DOMContentLoaded", Rf);
typeof window.Livewire < "u" && document.addEventListener("livewire:navigated", Rf);
var Ff = typeof global == "object" && global && global.Object === Object && global, ly = typeof self == "object" && self && self.Object === Object && self, nn = Ff || ly || Function("return this")(), qn = nn.Symbol, Hf = Object.prototype, cy = Hf.hasOwnProperty, uy = Hf.toString, qi = qn ? qn.toStringTag : void 0;
function dy(r) {
  var t = cy.call(r, qi), e = r[qi];
  try {
    r[qi] = void 0;
    var n = !0;
  } catch {
  }
  var i = uy.call(r);
  return n && (t ? r[qi] = e : delete r[qi]), i;
}
var hy = Object.prototype, fy = hy.toString;
function py(r) {
  return fy.call(r);
}
var gy = "[object Null]", my = "[object Undefined]", ad = qn ? qn.toStringTag : void 0;
function fi(r) {
  return r == null ? r === void 0 ? my : gy : ad && ad in Object(r) ? dy(r) : py(r);
}
function hn(r) {
  return r != null && typeof r == "object";
}
var ir = Array.isArray;
function Bn(r) {
  var t = typeof r;
  return r != null && (t == "object" || t == "function");
}
function Uf(r) {
  return r;
}
var by = "[object AsyncFunction]", yy = "[object Function]", vy = "[object GeneratorFunction]", wy = "[object Proxy]";
function eu(r) {
  if (!Bn(r))
    return !1;
  var t = fi(r);
  return t == yy || t == vy || t == by || t == wy;
}
var nl = nn["__core-js_shared__"], od = function() {
  var r = /[^.]+$/.exec(nl && nl.keys && nl.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function xy(r) {
  return !!od && od in r;
}
var ky = Function.prototype, Sy = ky.toString;
function cr(r) {
  if (r != null) {
    try {
      return Sy.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var Ay = /[\\^$.*+?()[\]{}|]/g, Ey = /^\[object .+?Constructor\]$/, Cy = Function.prototype, Ty = Object.prototype, Ly = Cy.toString, Dy = Ty.hasOwnProperty, Iy = RegExp(
  "^" + Ly.call(Dy).replace(Ay, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Oy(r) {
  if (!Bn(r) || xy(r))
    return !1;
  var t = eu(r) ? Iy : Ey;
  return t.test(cr(r));
}
function Ny(r, t) {
  return r == null ? void 0 : r[t];
}
function ur(r, t) {
  var e = Ny(r, t);
  return Oy(e) ? e : void 0;
}
var Hl = ur(nn, "WeakMap"), ld = Object.create, My = /* @__PURE__ */ function() {
  function r() {
  }
  return function(t) {
    if (!Bn(t))
      return {};
    if (ld)
      return ld(t);
    r.prototype = t;
    var e = new r();
    return r.prototype = void 0, e;
  };
}();
function qy(r, t, e) {
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
function _y(r, t) {
  var e = -1, n = r.length;
  for (t || (t = Array(n)); ++e < n; )
    t[e] = r[e];
  return t;
}
var Ry = 800, zy = 16, Py = Date.now;
function By(r) {
  var t = 0, e = 0;
  return function() {
    var n = Py(), i = zy - (n - e);
    if (e = n, i > 0) {
      if (++t >= Ry)
        return arguments[0];
    } else
      t = 0;
    return r.apply(void 0, arguments);
  };
}
function $y(r) {
  return function() {
    return r;
  };
}
var xa = function() {
  try {
    var r = ur(Object, "defineProperty");
    return r({}, "", {}), r;
  } catch {
  }
}(), jy = xa ? function(r, t) {
  return xa(r, "toString", {
    configurable: !0,
    enumerable: !1,
    value: $y(t),
    writable: !0
  });
} : Uf, Fy = By(jy);
function Hy(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length; ++e < n && t(r[e], e, r) !== !1; )
    ;
  return r;
}
var Uy = 9007199254740991, Vy = /^(?:0|[1-9]\d*)$/;
function Vf(r, t) {
  var e = typeof r;
  return t = t ?? Uy, !!t && (e == "number" || e != "symbol" && Vy.test(r)) && r > -1 && r % 1 == 0 && r < t;
}
function nu(r, t, e) {
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
var Yy = Object.prototype, Wy = Yy.hasOwnProperty;
function Yf(r, t, e) {
  var n = r[t];
  (!(Wy.call(r, t) && gs(n, e)) || e === void 0 && !(t in r)) && nu(r, t, e);
}
function Gy(r, t, e, n) {
  var i = !e;
  e || (e = {});
  for (var s = -1, a = t.length; ++s < a; ) {
    var o = t[s], l = void 0;
    l === void 0 && (l = r[o]), i ? nu(e, o, l) : Yf(e, o, l);
  }
  return e;
}
var cd = Math.max;
function Ky(r, t, e) {
  return t = cd(t === void 0 ? r.length - 1 : t, 0), function() {
    for (var n = arguments, i = -1, s = cd(n.length - t, 0), a = Array(s); ++i < s; )
      a[i] = n[t + i];
    i = -1;
    for (var o = Array(t + 1); ++i < t; )
      o[i] = n[i];
    return o[t] = e(a), qy(r, this, o);
  };
}
function Qy(r, t) {
  return Fy(Ky(r, t, Uf), r + "");
}
var Xy = 9007199254740991;
function Wf(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= Xy;
}
function Ha(r) {
  return r != null && Wf(r.length) && !eu(r);
}
function Zy(r, t, e) {
  if (!Bn(e))
    return !1;
  var n = typeof t;
  return (n == "number" ? Ha(e) && Vf(t, e.length) : n == "string" && t in e) ? gs(e[t], r) : !1;
}
function Jy(r) {
  return Qy(function(t, e) {
    var n = -1, i = e.length, s = i > 1 ? e[i - 1] : void 0, a = i > 2 ? e[2] : void 0;
    for (s = r.length > 3 && typeof s == "function" ? (i--, s) : void 0, a && Zy(e[0], e[1], a) && (s = i < 3 ? void 0 : s, i = 1), t = Object(t); ++n < i; ) {
      var o = e[n];
      o && r(t, o, n, s);
    }
    return t;
  });
}
var tv = Object.prototype;
function ru(r) {
  var t = r && r.constructor, e = typeof t == "function" && t.prototype || tv;
  return r === e;
}
function ev(r, t) {
  for (var e = -1, n = Array(r); ++e < r; )
    n[e] = t(e);
  return n;
}
var nv = "[object Arguments]";
function ud(r) {
  return hn(r) && fi(r) == nv;
}
var Gf = Object.prototype, rv = Gf.hasOwnProperty, iv = Gf.propertyIsEnumerable, Ul = ud(/* @__PURE__ */ function() {
  return arguments;
}()) ? ud : function(r) {
  return hn(r) && rv.call(r, "callee") && !iv.call(r, "callee");
};
function sv() {
  return !1;
}
var Kf = typeof exports == "object" && exports && !exports.nodeType && exports, dd = Kf && typeof module == "object" && module && !module.nodeType && module, av = dd && dd.exports === Kf, hd = av ? nn.Buffer : void 0, ov = hd ? hd.isBuffer : void 0, es = ov || sv, lv = "[object Arguments]", cv = "[object Array]", uv = "[object Boolean]", dv = "[object Date]", hv = "[object Error]", fv = "[object Function]", pv = "[object Map]", gv = "[object Number]", mv = "[object Object]", bv = "[object RegExp]", yv = "[object Set]", vv = "[object String]", wv = "[object WeakMap]", xv = "[object ArrayBuffer]", kv = "[object DataView]", Sv = "[object Float32Array]", Av = "[object Float64Array]", Ev = "[object Int8Array]", Cv = "[object Int16Array]", Tv = "[object Int32Array]", Lv = "[object Uint8Array]", Dv = "[object Uint8ClampedArray]", Iv = "[object Uint16Array]", Ov = "[object Uint32Array]", ct = {};
ct[Sv] = ct[Av] = ct[Ev] = ct[Cv] = ct[Tv] = ct[Lv] = ct[Dv] = ct[Iv] = ct[Ov] = !0;
ct[lv] = ct[cv] = ct[xv] = ct[uv] = ct[kv] = ct[dv] = ct[hv] = ct[fv] = ct[pv] = ct[gv] = ct[mv] = ct[bv] = ct[yv] = ct[vv] = ct[wv] = !1;
function Nv(r) {
  return hn(r) && Wf(r.length) && !!ct[fi(r)];
}
function iu(r) {
  return function(t) {
    return r(t);
  };
}
var Qf = typeof exports == "object" && exports && !exports.nodeType && exports, Vi = Qf && typeof module == "object" && module && !module.nodeType && module, Mv = Vi && Vi.exports === Qf, rl = Mv && Ff.process, ei = function() {
  try {
    var r = Vi && Vi.require && Vi.require("util").types;
    return r || rl && rl.binding && rl.binding("util");
  } catch {
  }
}(), fd = ei && ei.isTypedArray, su = fd ? iu(fd) : Nv, qv = Object.prototype, _v = qv.hasOwnProperty;
function Xf(r, t) {
  var e = ir(r), n = !e && Ul(r), i = !e && !n && es(r), s = !e && !n && !i && su(r), a = e || n || i || s, o = a ? ev(r.length, String) : [], l = o.length;
  for (var c in r)
    (t || _v.call(r, c)) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    Vf(c, l))) && o.push(c);
  return o;
}
function Zf(r, t) {
  return function(e) {
    return r(t(e));
  };
}
var Rv = Zf(Object.keys, Object), zv = Object.prototype, Pv = zv.hasOwnProperty;
function Bv(r) {
  if (!ru(r))
    return Rv(r);
  var t = [];
  for (var e in Object(r))
    Pv.call(r, e) && e != "constructor" && t.push(e);
  return t;
}
function $v(r) {
  return Ha(r) ? Xf(r) : Bv(r);
}
function jv(r) {
  var t = [];
  if (r != null)
    for (var e in Object(r))
      t.push(e);
  return t;
}
var Fv = Object.prototype, Hv = Fv.hasOwnProperty;
function Uv(r) {
  if (!Bn(r))
    return jv(r);
  var t = ru(r), e = [];
  for (var n in r)
    n == "constructor" && (t || !Hv.call(r, n)) || e.push(n);
  return e;
}
function Jf(r) {
  return Ha(r) ? Xf(r, !0) : Uv(r);
}
var ns = ur(Object, "create");
function Vv() {
  this.__data__ = ns ? ns(null) : {}, this.size = 0;
}
function Yv(r) {
  var t = this.has(r) && delete this.__data__[r];
  return this.size -= t ? 1 : 0, t;
}
var Wv = "__lodash_hash_undefined__", Gv = Object.prototype, Kv = Gv.hasOwnProperty;
function Qv(r) {
  var t = this.__data__;
  if (ns) {
    var e = t[r];
    return e === Wv ? void 0 : e;
  }
  return Kv.call(t, r) ? t[r] : void 0;
}
var Xv = Object.prototype, Zv = Xv.hasOwnProperty;
function Jv(r) {
  var t = this.__data__;
  return ns ? t[r] !== void 0 : Zv.call(t, r);
}
var t1 = "__lodash_hash_undefined__";
function e1(r, t) {
  var e = this.__data__;
  return this.size += this.has(r) ? 0 : 1, e[r] = ns && t === void 0 ? t1 : t, this;
}
function sr(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
sr.prototype.clear = Vv;
sr.prototype.delete = Yv;
sr.prototype.get = Qv;
sr.prototype.has = Jv;
sr.prototype.set = e1;
function n1() {
  this.__data__ = [], this.size = 0;
}
function Ua(r, t) {
  for (var e = r.length; e--; )
    if (gs(r[e][0], t))
      return e;
  return -1;
}
var r1 = Array.prototype, i1 = r1.splice;
function s1(r) {
  var t = this.__data__, e = Ua(t, r);
  if (e < 0)
    return !1;
  var n = t.length - 1;
  return e == n ? t.pop() : i1.call(t, e, 1), --this.size, !0;
}
function a1(r) {
  var t = this.__data__, e = Ua(t, r);
  return e < 0 ? void 0 : t[e][1];
}
function o1(r) {
  return Ua(this.__data__, r) > -1;
}
function l1(r, t) {
  var e = this.__data__, n = Ua(e, r);
  return n < 0 ? (++this.size, e.push([r, t])) : e[n][1] = t, this;
}
function mn(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
mn.prototype.clear = n1;
mn.prototype.delete = s1;
mn.prototype.get = a1;
mn.prototype.has = o1;
mn.prototype.set = l1;
var rs = ur(nn, "Map");
function c1() {
  this.size = 0, this.__data__ = {
    hash: new sr(),
    map: new (rs || mn)(),
    string: new sr()
  };
}
function u1(r) {
  var t = typeof r;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? r !== "__proto__" : r === null;
}
function Va(r, t) {
  var e = r.__data__;
  return u1(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
}
function d1(r) {
  var t = Va(this, r).delete(r);
  return this.size -= t ? 1 : 0, t;
}
function h1(r) {
  return Va(this, r).get(r);
}
function f1(r) {
  return Va(this, r).has(r);
}
function p1(r, t) {
  var e = Va(this, r), n = e.size;
  return e.set(r, t), this.size += e.size == n ? 0 : 1, this;
}
function dr(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.clear(); ++t < e; ) {
    var n = r[t];
    this.set(n[0], n[1]);
  }
}
dr.prototype.clear = c1;
dr.prototype.delete = d1;
dr.prototype.get = h1;
dr.prototype.has = f1;
dr.prototype.set = p1;
function g1(r, t) {
  for (var e = -1, n = t.length, i = r.length; ++e < n; )
    r[i + e] = t[e];
  return r;
}
var tp = Zf(Object.getPrototypeOf, Object), m1 = "[object Object]", b1 = Function.prototype, y1 = Object.prototype, ep = b1.toString, v1 = y1.hasOwnProperty, w1 = ep.call(Object);
function x1(r) {
  if (!hn(r) || fi(r) != m1)
    return !1;
  var t = tp(r);
  if (t === null)
    return !0;
  var e = v1.call(t, "constructor") && t.constructor;
  return typeof e == "function" && e instanceof e && ep.call(e) == w1;
}
function k1() {
  this.__data__ = new mn(), this.size = 0;
}
function S1(r) {
  var t = this.__data__, e = t.delete(r);
  return this.size = t.size, e;
}
function A1(r) {
  return this.__data__.get(r);
}
function E1(r) {
  return this.__data__.has(r);
}
var C1 = 200;
function T1(r, t) {
  var e = this.__data__;
  if (e instanceof mn) {
    var n = e.__data__;
    if (!rs || n.length < C1 - 1)
      return n.push([r, t]), this.size = ++e.size, this;
    e = this.__data__ = new dr(n);
  }
  return e.set(r, t), this.size = e.size, this;
}
function Ye(r) {
  var t = this.__data__ = new mn(r);
  this.size = t.size;
}
Ye.prototype.clear = k1;
Ye.prototype.delete = S1;
Ye.prototype.get = A1;
Ye.prototype.has = E1;
Ye.prototype.set = T1;
var np = typeof exports == "object" && exports && !exports.nodeType && exports, pd = np && typeof module == "object" && module && !module.nodeType && module, L1 = pd && pd.exports === np, gd = L1 ? nn.Buffer : void 0, md = gd ? gd.allocUnsafe : void 0;
function rp(r, t) {
  if (t)
    return r.slice();
  var e = r.length, n = md ? md(e) : new r.constructor(e);
  return r.copy(n), n;
}
function D1(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length, i = 0, s = []; ++e < n; ) {
    var a = r[e];
    t(a, e, r) && (s[i++] = a);
  }
  return s;
}
function I1() {
  return [];
}
var O1 = Object.prototype, N1 = O1.propertyIsEnumerable, bd = Object.getOwnPropertySymbols, M1 = bd ? function(r) {
  return r == null ? [] : (r = Object(r), D1(bd(r), function(t) {
    return N1.call(r, t);
  }));
} : I1;
function q1(r, t, e) {
  var n = t(r);
  return ir(r) ? n : g1(n, e(r));
}
function Vl(r) {
  return q1(r, $v, M1);
}
var Yl = ur(nn, "DataView"), Wl = ur(nn, "Promise"), Gl = ur(nn, "Set"), yd = "[object Map]", _1 = "[object Object]", vd = "[object Promise]", wd = "[object Set]", xd = "[object WeakMap]", kd = "[object DataView]", R1 = cr(Yl), z1 = cr(rs), P1 = cr(Wl), B1 = cr(Gl), $1 = cr(Hl), ye = fi;
(Yl && ye(new Yl(new ArrayBuffer(1))) != kd || rs && ye(new rs()) != yd || Wl && ye(Wl.resolve()) != vd || Gl && ye(new Gl()) != wd || Hl && ye(new Hl()) != xd) && (ye = function(r) {
  var t = fi(r), e = t == _1 ? r.constructor : void 0, n = e ? cr(e) : "";
  if (n)
    switch (n) {
      case R1:
        return kd;
      case z1:
        return yd;
      case P1:
        return vd;
      case B1:
        return wd;
      case $1:
        return xd;
    }
  return t;
});
var j1 = Object.prototype, F1 = j1.hasOwnProperty;
function H1(r) {
  var t = r.length, e = new r.constructor(t);
  return t && typeof r[0] == "string" && F1.call(r, "index") && (e.index = r.index, e.input = r.input), e;
}
var ka = nn.Uint8Array;
function au(r) {
  var t = new r.constructor(r.byteLength);
  return new ka(t).set(new ka(r)), t;
}
function U1(r, t) {
  var e = au(r.buffer);
  return new r.constructor(e, r.byteOffset, r.byteLength);
}
var V1 = /\w*$/;
function Y1(r) {
  var t = new r.constructor(r.source, V1.exec(r));
  return t.lastIndex = r.lastIndex, t;
}
var Sd = qn ? qn.prototype : void 0, Ad = Sd ? Sd.valueOf : void 0;
function W1(r) {
  return Ad ? Object(Ad.call(r)) : {};
}
function ip(r, t) {
  var e = t ? au(r.buffer) : r.buffer;
  return new r.constructor(e, r.byteOffset, r.length);
}
var G1 = "[object Boolean]", K1 = "[object Date]", Q1 = "[object Map]", X1 = "[object Number]", Z1 = "[object RegExp]", J1 = "[object Set]", t0 = "[object String]", e0 = "[object Symbol]", n0 = "[object ArrayBuffer]", r0 = "[object DataView]", i0 = "[object Float32Array]", s0 = "[object Float64Array]", a0 = "[object Int8Array]", o0 = "[object Int16Array]", l0 = "[object Int32Array]", c0 = "[object Uint8Array]", u0 = "[object Uint8ClampedArray]", d0 = "[object Uint16Array]", h0 = "[object Uint32Array]";
function f0(r, t, e) {
  var n = r.constructor;
  switch (t) {
    case n0:
      return au(r);
    case G1:
    case K1:
      return new n(+r);
    case r0:
      return U1(r);
    case i0:
    case s0:
    case a0:
    case o0:
    case l0:
    case c0:
    case u0:
    case d0:
    case h0:
      return ip(r, e);
    case Q1:
      return new n();
    case X1:
    case t0:
      return new n(r);
    case Z1:
      return Y1(r);
    case J1:
      return new n();
    case e0:
      return W1(r);
  }
}
function sp(r) {
  return typeof r.constructor == "function" && !ru(r) ? My(tp(r)) : {};
}
var p0 = "[object Map]";
function g0(r) {
  return hn(r) && ye(r) == p0;
}
var Ed = ei && ei.isMap, m0 = Ed ? iu(Ed) : g0, b0 = "[object Set]";
function y0(r) {
  return hn(r) && ye(r) == b0;
}
var Cd = ei && ei.isSet, v0 = Cd ? iu(Cd) : y0, w0 = 1, ap = "[object Arguments]", x0 = "[object Array]", k0 = "[object Boolean]", S0 = "[object Date]", A0 = "[object Error]", op = "[object Function]", E0 = "[object GeneratorFunction]", C0 = "[object Map]", T0 = "[object Number]", lp = "[object Object]", L0 = "[object RegExp]", D0 = "[object Set]", I0 = "[object String]", O0 = "[object Symbol]", N0 = "[object WeakMap]", M0 = "[object ArrayBuffer]", q0 = "[object DataView]", _0 = "[object Float32Array]", R0 = "[object Float64Array]", z0 = "[object Int8Array]", P0 = "[object Int16Array]", B0 = "[object Int32Array]", $0 = "[object Uint8Array]", j0 = "[object Uint8ClampedArray]", F0 = "[object Uint16Array]", H0 = "[object Uint32Array]", at = {};
at[ap] = at[x0] = at[M0] = at[q0] = at[k0] = at[S0] = at[_0] = at[R0] = at[z0] = at[P0] = at[B0] = at[C0] = at[T0] = at[lp] = at[L0] = at[D0] = at[I0] = at[O0] = at[$0] = at[j0] = at[F0] = at[H0] = !0;
at[A0] = at[op] = at[N0] = !1;
function ua(r, t, e, n, i, s) {
  var a, o = t & w0;
  if (a !== void 0)
    return a;
  if (!Bn(r))
    return r;
  var l = ir(r);
  if (l)
    a = H1(r);
  else {
    var c = ye(r), u = c == op || c == E0;
    if (es(r))
      return rp(r, o);
    if (c == lp || c == ap || u && !i)
      a = u ? {} : sp(r);
    else {
      if (!at[c])
        return i ? r : {};
      a = f0(r, c, o);
    }
  }
  s || (s = new Ye());
  var h = s.get(r);
  if (h)
    return h;
  s.set(r, a), v0(r) ? r.forEach(function(m) {
    a.add(ua(m, t, e, m, r, s));
  }) : m0(r) && r.forEach(function(m, b) {
    a.set(b, ua(m, t, e, b, r, s));
  });
  var f = Vl, p = l ? void 0 : f(r);
  return Hy(p || r, function(m, b) {
    p && (b = m, m = r[b]), Yf(a, b, ua(m, t, e, b, r, s));
  }), a;
}
var U0 = 1, V0 = 4;
function $r(r) {
  return ua(r, U0 | V0);
}
var Y0 = "__lodash_hash_undefined__";
function W0(r) {
  return this.__data__.set(r, Y0), this;
}
function G0(r) {
  return this.__data__.has(r);
}
function Sa(r) {
  var t = -1, e = r == null ? 0 : r.length;
  for (this.__data__ = new dr(); ++t < e; )
    this.add(r[t]);
}
Sa.prototype.add = Sa.prototype.push = W0;
Sa.prototype.has = G0;
function K0(r, t) {
  for (var e = -1, n = r == null ? 0 : r.length; ++e < n; )
    if (t(r[e], e, r))
      return !0;
  return !1;
}
function Q0(r, t) {
  return r.has(t);
}
var X0 = 1, Z0 = 2;
function cp(r, t, e, n, i, s) {
  var a = e & X0, o = r.length, l = t.length;
  if (o != l && !(a && l > o))
    return !1;
  var c = s.get(r), u = s.get(t);
  if (c && u)
    return c == t && u == r;
  var h = -1, f = !0, p = e & Z0 ? new Sa() : void 0;
  for (s.set(r, t), s.set(t, r); ++h < o; ) {
    var m = r[h], b = t[h];
    if (n)
      var w = a ? n(b, m, h, t, r, s) : n(m, b, h, r, t, s);
    if (w !== void 0) {
      if (w)
        continue;
      f = !1;
      break;
    }
    if (p) {
      if (!K0(t, function(v, k) {
        if (!Q0(p, k) && (m === v || i(m, v, e, n, s)))
          return p.push(k);
      })) {
        f = !1;
        break;
      }
    } else if (!(m === b || i(m, b, e, n, s))) {
      f = !1;
      break;
    }
  }
  return s.delete(r), s.delete(t), f;
}
function J0(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(n, i) {
    e[++t] = [i, n];
  }), e;
}
function tw(r) {
  var t = -1, e = Array(r.size);
  return r.forEach(function(n) {
    e[++t] = n;
  }), e;
}
var ew = 1, nw = 2, rw = "[object Boolean]", iw = "[object Date]", sw = "[object Error]", aw = "[object Map]", ow = "[object Number]", lw = "[object RegExp]", cw = "[object Set]", uw = "[object String]", dw = "[object Symbol]", hw = "[object ArrayBuffer]", fw = "[object DataView]", Td = qn ? qn.prototype : void 0, il = Td ? Td.valueOf : void 0;
function pw(r, t, e, n, i, s, a) {
  switch (e) {
    case fw:
      if (r.byteLength != t.byteLength || r.byteOffset != t.byteOffset)
        return !1;
      r = r.buffer, t = t.buffer;
    case hw:
      return !(r.byteLength != t.byteLength || !s(new ka(r), new ka(t)));
    case rw:
    case iw:
    case ow:
      return gs(+r, +t);
    case sw:
      return r.name == t.name && r.message == t.message;
    case lw:
    case uw:
      return r == t + "";
    case aw:
      var o = J0;
    case cw:
      var l = n & ew;
      if (o || (o = tw), r.size != t.size && !l)
        return !1;
      var c = a.get(r);
      if (c)
        return c == t;
      n |= nw, a.set(r, t);
      var u = cp(o(r), o(t), n, i, s, a);
      return a.delete(r), u;
    case dw:
      if (il)
        return il.call(r) == il.call(t);
  }
  return !1;
}
var gw = 1, mw = Object.prototype, bw = mw.hasOwnProperty;
function yw(r, t, e, n, i, s) {
  var a = e & gw, o = Vl(r), l = o.length, c = Vl(t), u = c.length;
  if (l != u && !a)
    return !1;
  for (var h = l; h--; ) {
    var f = o[h];
    if (!(a ? f in t : bw.call(t, f)))
      return !1;
  }
  var p = s.get(r), m = s.get(t);
  if (p && m)
    return p == t && m == r;
  var b = !0;
  s.set(r, t), s.set(t, r);
  for (var w = a; ++h < l; ) {
    f = o[h];
    var v = r[f], k = t[f];
    if (n)
      var A = a ? n(k, v, f, t, r, s) : n(v, k, f, r, t, s);
    if (!(A === void 0 ? v === k || i(v, k, e, n, s) : A)) {
      b = !1;
      break;
    }
    w || (w = f == "constructor");
  }
  if (b && !w) {
    var E = r.constructor, T = t.constructor;
    E != T && "constructor" in r && "constructor" in t && !(typeof E == "function" && E instanceof E && typeof T == "function" && T instanceof T) && (b = !1);
  }
  return s.delete(r), s.delete(t), b;
}
var vw = 1, Ld = "[object Arguments]", Dd = "[object Array]", Gs = "[object Object]", ww = Object.prototype, Id = ww.hasOwnProperty;
function xw(r, t, e, n, i, s) {
  var a = ir(r), o = ir(t), l = a ? Dd : ye(r), c = o ? Dd : ye(t);
  l = l == Ld ? Gs : l, c = c == Ld ? Gs : c;
  var u = l == Gs, h = c == Gs, f = l == c;
  if (f && es(r)) {
    if (!es(t))
      return !1;
    a = !0, u = !1;
  }
  if (f && !u)
    return s || (s = new Ye()), a || su(r) ? cp(r, t, e, n, i, s) : pw(r, t, l, e, n, i, s);
  if (!(e & vw)) {
    var p = u && Id.call(r, "__wrapped__"), m = h && Id.call(t, "__wrapped__");
    if (p || m) {
      var b = p ? r.value() : r, w = m ? t.value() : t;
      return s || (s = new Ye()), i(b, w, e, n, s);
    }
  }
  return f ? (s || (s = new Ye()), yw(r, t, e, n, i, s)) : !1;
}
function up(r, t, e, n, i) {
  return r === t ? !0 : r == null || t == null || !hn(r) && !hn(t) ? r !== r && t !== t : xw(r, t, e, n, up, i);
}
function kw(r) {
  return function(t, e, n) {
    for (var i = -1, s = Object(t), a = n(t), o = a.length; o--; ) {
      var l = a[++i];
      if (e(s[l], l, s) === !1)
        break;
    }
    return t;
  };
}
var Sw = kw();
function Kl(r, t, e) {
  (e !== void 0 && !gs(r[t], e) || e === void 0 && !(t in r)) && nu(r, t, e);
}
function Aw(r) {
  return hn(r) && Ha(r);
}
function Ql(r, t) {
  if (!(t === "constructor" && typeof r[t] == "function") && t != "__proto__")
    return r[t];
}
function Ew(r) {
  return Gy(r, Jf(r));
}
function Cw(r, t, e, n, i, s, a) {
  var o = Ql(r, e), l = Ql(t, e), c = a.get(l);
  if (c) {
    Kl(r, e, c);
    return;
  }
  var u = s ? s(o, l, e + "", r, t, a) : void 0, h = u === void 0;
  if (h) {
    var f = ir(l), p = !f && es(l), m = !f && !p && su(l);
    u = l, f || p || m ? ir(o) ? u = o : Aw(o) ? u = _y(o) : p ? (h = !1, u = rp(l, !0)) : m ? (h = !1, u = ip(l, !0)) : u = [] : x1(l) || Ul(l) ? (u = o, Ul(o) ? u = Ew(o) : (!Bn(o) || eu(o)) && (u = sp(l))) : h = !1;
  }
  h && (a.set(l, u), i(u, l, n, s, a), a.delete(l)), Kl(r, e, u);
}
function dp(r, t, e, n, i) {
  r !== t && Sw(t, function(s, a) {
    if (i || (i = new Ye()), Bn(s))
      Cw(r, t, a, e, dp, n, i);
    else {
      var o = n ? n(Ql(r, a), s, a + "", r, t, i) : void 0;
      o === void 0 && (o = s), Kl(r, a, o);
    }
  }, Jf);
}
function ou(r, t) {
  return up(r, t);
}
var Nn = Jy(function(r, t, e) {
  dp(r, t, e);
}), B = /* @__PURE__ */ ((r) => (r[r.TYPE = 3] = "TYPE", r[r.LEVEL = 12] = "LEVEL", r[r.ATTRIBUTE = 13] = "ATTRIBUTE", r[r.BLOT = 14] = "BLOT", r[r.INLINE = 7] = "INLINE", r[r.BLOCK = 11] = "BLOCK", r[r.BLOCK_BLOT = 10] = "BLOCK_BLOT", r[r.INLINE_BLOT = 6] = "INLINE_BLOT", r[r.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", r[r.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", r[r.ANY = 15] = "ANY", r))(B || {});
class Qe {
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
class jr extends Error {
  constructor(t) {
    t = "[Parchment] " + t, super(t), this.message = t, this.name = this.constructor.name;
  }
}
const hp = class Xl {
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
      throw new jr(`Unable to create ${e} blot`);
    const s = i, a = (
      // @ts-expect-error Fix me later
      e instanceof Node || e.nodeType === Node.TEXT_NODE ? e : s.create(n)
    ), o = new s(t, a, n);
    return Xl.blots.set(o.domNode, o), o;
  }
  find(t, e = !1) {
    return Xl.find(t, e);
  }
  query(t, e = B.ANY) {
    let n;
    return typeof t == "string" ? n = this.types[t] || this.attributes[t] : t instanceof Text || t.nodeType === Node.TEXT_NODE ? n = this.types.text : typeof t == "number" ? t & B.LEVEL & B.BLOCK ? n = this.types.block : t & B.LEVEL & B.INLINE && (n = this.types.inline) : t instanceof Element && ((t.getAttribute("class") || "").split(/\s+/).some((i) => (n = this.classes[i], !!n)), n = n || this.tags[t.tagName]), n == null ? null : "scope" in n && e & B.LEVEL & n.scope && e & B.TYPE & n.scope ? n : null;
  }
  register(...t) {
    return t.map((e) => {
      const n = "blotName" in e, i = "attrName" in e;
      if (!n && !i)
        throw new jr("Invalid definition");
      if (n && e.blotName === "abstract")
        throw new jr("Cannot register abstract class");
      const s = n ? e.blotName : i ? e.attrName : void 0;
      return this.types[s] = e, i ? typeof e.keyName == "string" && (this.attributes[e.keyName] = e) : n && (e.className && (this.classes[e.className] = e), e.tagName && (Array.isArray(e.tagName) ? e.tagName = e.tagName.map((a) => a.toUpperCase()) : e.tagName = e.tagName.toUpperCase(), (Array.isArray(e.tagName) ? e.tagName : [e.tagName]).forEach((a) => {
        (this.tags[a] == null || e.className == null) && (this.tags[a] = e);
      }))), e;
    });
  }
};
hp.blots = /* @__PURE__ */ new WeakMap();
let ni = hp;
function Od(r, t) {
  return (r.getAttribute("class") || "").split(/\s+/).filter((e) => e.indexOf(`${t}-`) === 0);
}
class Tw extends Qe {
  static keys(t) {
    return (t.getAttribute("class") || "").split(/\s+/).map((e) => e.split("-").slice(0, -1).join("-"));
  }
  add(t, e) {
    return this.canAdd(t, e) ? (this.remove(t), t.classList.add(`${this.keyName}-${e}`), !0) : !1;
  }
  remove(t) {
    Od(t, this.keyName).forEach((e) => {
      t.classList.remove(e);
    }), t.classList.length === 0 && t.removeAttribute("class");
  }
  value(t) {
    const e = (Od(t, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(t, e) ? e : "";
  }
}
const Ie = Tw;
function sl(r) {
  const t = r.split("-"), e = t.slice(1).map((n) => n[0].toUpperCase() + n.slice(1)).join("");
  return t[0] + e;
}
class Lw extends Qe {
  static keys(t) {
    return (t.getAttribute("style") || "").split(";").map((e) => e.split(":")[0].trim());
  }
  add(t, e) {
    return this.canAdd(t, e) ? (t.style[sl(this.keyName)] = e, !0) : !1;
  }
  remove(t) {
    t.style[sl(this.keyName)] = "", t.getAttribute("style") || t.removeAttribute("style");
  }
  value(t) {
    const e = t.style[sl(this.keyName)];
    return this.canAdd(t, e) ? e : "";
  }
}
const $n = Lw;
class Dw {
  constructor(t) {
    this.attributes = {}, this.domNode = t, this.build();
  }
  attribute(t, e) {
    e ? t.add(this.domNode, e) && (t.value(this.domNode) != null ? this.attributes[t.attrName] = t : delete this.attributes[t.attrName]) : (t.remove(this.domNode), delete this.attributes[t.attrName]);
  }
  build() {
    this.attributes = {};
    const t = ni.find(this.domNode);
    if (t == null)
      return;
    const e = Qe.keys(this.domNode), n = Ie.keys(this.domNode), i = $n.keys(this.domNode);
    e.concat(n).concat(i).forEach((s) => {
      const a = t.scroll.query(s, B.ATTRIBUTE);
      a instanceof Qe && (this.attributes[a.attrName] = a);
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
const Ya = Dw, fp = class {
  constructor(t, e) {
    this.scroll = t, this.domNode = e, ni.blots.set(e, this), this.prev = null, this.next = null;
  }
  static create(t) {
    if (this.tagName == null)
      throw new jr("Blot definition missing tagName");
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
    this.parent != null && this.parent.removeChild(this), ni.blots.delete(this.domNode);
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
      throw new jr(`Cannot wrap ${t}`);
    return n.appendChild(this), n;
  }
};
fp.blotName = "abstract";
let pp = fp;
const gp = class extends pp {
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
gp.scope = B.INLINE_BLOT;
let Iw = gp;
const qt = Iw;
class Ow {
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
function Nd(r, t) {
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
const mp = class En extends pp {
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
    this.uiNode != null && this.uiNode.remove(), this.uiNode = t, En.uiClass && this.uiNode.classList.add(En.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new Ow(), Array.from(this.domNode.childNodes).filter((t) => t !== this.uiNode).reverse().forEach((t) => {
      try {
        const e = Nd(t, this.scroll);
        this.insertBefore(e, this.children.head || void 0);
      } catch (e) {
        if (e instanceof jr)
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
    return t.blotName == null && t(n) || t.blotName != null && n instanceof t ? [n, i] : n instanceof En ? n.descendant(t, i) : [null, -1];
  }
  descendants(t, e = 0, n = Number.MAX_VALUE) {
    let i = [], s = n;
    return this.children.forEachAt(
      e,
      n,
      (a, o, l) => {
        (t.blotName == null && t(a) || t.blotName != null && a instanceof t) && i.push(a), a instanceof En && (i = i.concat(
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
      ) || (e.statics.scope === B.BLOCK_BLOT ? (e.next != null && this.splitAfter(e), e.prev != null && this.splitAfter(e.prev), e.parent.unwrap(), t = !0) : e instanceof En ? e.unwrap() : e.remove());
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
    return n instanceof En ? s.concat(n.path(i, e)) : (n != null && s.push([n, i]), s);
  }
  removeChild(t) {
    this.children.remove(t);
  }
  replaceWith(t, e) {
    const n = typeof t == "string" ? this.scroll.create(t, e) : t;
    return n instanceof En && this.moveChildren(n), super.replaceWith(n);
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
      const o = Nd(s, this.scroll);
      (o.next !== a || o.next == null) && (o.parent != null && o.parent.removeChild(this), this.insertBefore(o, a || void 0));
    }), this.enforceAllowedChildren();
  }
};
mp.uiClass = "";
let Nw = mp;
const ke = Nw;
function Mw(r, t) {
  if (Object.keys(r).length !== Object.keys(t).length)
    return !1;
  for (const e in r)
    if (r[e] !== t[e])
      return !1;
  return !0;
}
const Ir = class Or extends ke {
  static create(t) {
    return super.create(t);
  }
  static formats(t, e) {
    const n = e.query(Or.blotName);
    if (!(n != null && t.tagName === n.tagName)) {
      if (typeof this.tagName == "string")
        return !0;
      if (Array.isArray(this.tagName))
        return t.tagName.toLowerCase();
    }
  }
  constructor(t, e) {
    super(t, e), this.attributes = new Ya(this.domNode);
  }
  format(t, e) {
    if (t === this.statics.blotName && !e)
      this.children.forEach((n) => {
        n instanceof Or || (n = n.wrap(Or.blotName, !0)), this.attributes.copy(n);
      }), this.unwrap();
    else {
      const n = this.scroll.query(t, B.INLINE);
      if (n == null)
        return;
      n instanceof Qe ? this.attributes.attribute(n, e) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e);
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
    n instanceof Or && n.prev === this && Mw(e, n.formats()) && (n.moveChildren(this), n.remove());
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
    return n instanceof Or && this.attributes.move(n), n;
  }
};
Ir.allowedChildren = [Ir, qt], Ir.blotName = "inline", Ir.scope = B.INLINE_BLOT, Ir.tagName = "SPAN";
let qw = Ir;
const lu = qw, Nr = class Zl extends ke {
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
    super(t, e), this.attributes = new Ya(this.domNode);
  }
  format(t, e) {
    const n = this.scroll.query(t, B.BLOCK);
    n != null && (n instanceof Qe ? this.attributes.attribute(n, e) : t === this.statics.blotName && !e ? this.replaceWith(Zl.blotName) : e && (t !== this.statics.blotName || this.formats()[t] !== e) && this.replaceWith(t, e));
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
Nr.blotName = "block", Nr.scope = B.BLOCK_BLOT, Nr.tagName = "P", Nr.allowedChildren = [
  lu,
  Nr,
  qt
];
let _w = Nr;
const is = _w, Jl = class extends ke {
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
Jl.blotName = "container", Jl.scope = B.BLOCK_BLOT;
let Rw = Jl;
const Wa = Rw;
class zw extends qt {
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
const Zt = zw, Pw = {
  attributes: !0,
  characterData: !0,
  characterDataOldValue: !0,
  childList: !0,
  subtree: !0
}, Bw = 100, Mr = class extends ke {
  constructor(t, e) {
    super(null, e), this.registry = t, this.scroll = this, this.build(), this.observer = new MutationObserver((n) => {
      this.update(n);
    }), this.observer.observe(this.domNode, Pw), this.attach();
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
      n.has(l.domNode) && (l instanceof ke && l.children.forEach(a), n.delete(l.domNode), l.optimize(e));
    };
    let o = t;
    for (let l = 0; o.length > 0; l += 1) {
      if (l >= Bw)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (o.forEach((c) => {
        const u = this.find(c.target, !0);
        u != null && (u.domNode === c.target && (c.type === "childList" ? (s(this.find(c.previousSibling, !1)), Array.from(c.addedNodes).forEach((h) => {
          const f = this.find(h, !1);
          s(f, !1), f instanceof ke && f.children.forEach((p) => {
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
Mr.blotName = "scroll", Mr.defaultChild = is, Mr.allowedChildren = [is, Wa], Mr.scope = B.BLOCK_BLOT, Mr.tagName = "DIV";
let $w = Mr;
const cu = $w, tc = class bp extends qt {
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
    super.optimize(t), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof bp && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
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
tc.blotName = "text", tc.scope = B.INLINE_BLOT;
let jw = tc;
const Aa = jw, Fw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Attributor: Qe,
  AttributorStore: Ya,
  BlockBlot: is,
  ClassAttributor: Ie,
  ContainerBlot: Wa,
  EmbedBlot: Zt,
  InlineBlot: lu,
  LeafBlot: qt,
  ParentBlot: ke,
  Registry: ni,
  Scope: B,
  ScrollBlot: cu,
  StyleAttributor: $n,
  TextBlot: Aa
}, Symbol.toStringTag, { value: "Module" }));
var Dn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function yp(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var ec = { exports: {} }, Kt = -1, $t = 1, kt = 0;
function ss(r, t, e, n, i) {
  if (r === t)
    return r ? [[kt, r]] : [];
  if (e != null) {
    var s = Xw(r, t, e);
    if (s)
      return s;
  }
  var a = uu(r, t), o = r.substring(0, a);
  r = r.substring(a), t = t.substring(a), a = Ga(r, t);
  var l = r.substring(r.length - a);
  r = r.substring(0, r.length - a), t = t.substring(0, t.length - a);
  var c = Hw(r, t);
  return o && c.unshift([kt, o]), l && c.push([kt, l]), du(c, i), n && Yw(c), c;
}
function Hw(r, t) {
  var e;
  if (!r)
    return [[$t, t]];
  if (!t)
    return [[Kt, r]];
  var n = r.length > t.length ? r : t, i = r.length > t.length ? t : r, s = n.indexOf(i);
  if (s !== -1)
    return e = [
      [$t, n.substring(0, s)],
      [kt, i],
      [$t, n.substring(s + i.length)]
    ], r.length > t.length && (e[0][0] = e[2][0] = Kt), e;
  if (i.length === 1)
    return [
      [Kt, r],
      [$t, t]
    ];
  var a = Vw(r, t);
  if (a) {
    var o = a[0], l = a[1], c = a[2], u = a[3], h = a[4], f = ss(o, c), p = ss(l, u);
    return f.concat([[kt, h]], p);
  }
  return Uw(r, t);
}
function Uw(r, t) {
  for (var e = r.length, n = t.length, i = Math.ceil((e + n) / 2), s = i, a = 2 * i, o = new Array(a), l = new Array(a), c = 0; c < a; c++)
    o[c] = -1, l[c] = -1;
  o[s + 1] = 0, l[s + 1] = 0;
  for (var u = e - n, h = u % 2 !== 0, f = 0, p = 0, m = 0, b = 0, w = 0; w < i; w++) {
    for (var v = -w + f; v <= w - p; v += 2) {
      var k = s + v, A;
      v === -w || v !== w && o[k - 1] < o[k + 1] ? A = o[k + 1] : A = o[k - 1] + 1;
      for (var E = A - v; A < e && E < n && r.charAt(A) === t.charAt(E); )
        A++, E++;
      if (o[k] = A, A > e)
        p += 2;
      else if (E > n)
        f += 2;
      else if (h) {
        var T = s + u - v;
        if (T >= 0 && T < a && l[T] !== -1) {
          var M = e - l[T];
          if (A >= M)
            return Md(r, t, A, E);
        }
      }
    }
    for (var N = -w + m; N <= w - b; N += 2) {
      var T = s + N, M;
      N === -w || N !== w && l[T - 1] < l[T + 1] ? M = l[T + 1] : M = l[T - 1] + 1;
      for (var S = M - N; M < e && S < n && r.charAt(e - M - 1) === t.charAt(n - S - 1); )
        M++, S++;
      if (l[T] = M, M > e)
        b += 2;
      else if (S > n)
        m += 2;
      else if (!h) {
        var k = s + u - N;
        if (k >= 0 && k < a && o[k] !== -1) {
          var A = o[k], E = s + A - k;
          if (M = e - M, A >= M)
            return Md(r, t, A, E);
        }
      }
    }
  }
  return [
    [Kt, r],
    [$t, t]
  ];
}
function Md(r, t, e, n) {
  var i = r.substring(0, e), s = t.substring(0, n), a = r.substring(e), o = t.substring(n), l = ss(i, s), c = ss(a, o);
  return l.concat(c);
}
function uu(r, t) {
  if (!r || !t || r.charAt(0) !== t.charAt(0))
    return 0;
  for (var e = 0, n = Math.min(r.length, t.length), i = n, s = 0; e < i; )
    r.substring(s, i) == t.substring(s, i) ? (e = i, s = e) : n = i, i = Math.floor((n - e) / 2 + e);
  return vp(r.charCodeAt(i - 1)) && i--, i;
}
function qd(r, t) {
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
function Ga(r, t) {
  if (!r || !t || r.slice(-1) !== t.slice(-1))
    return 0;
  for (var e = 0, n = Math.min(r.length, t.length), i = n, s = 0; e < i; )
    r.substring(r.length - i, r.length - s) == t.substring(t.length - i, t.length - s) ? (e = i, s = e) : n = i, i = Math.floor((n - e) / 2 + e);
  return wp(r.charCodeAt(r.length - i)) && i--, i;
}
function Vw(r, t) {
  var e = r.length > t.length ? r : t, n = r.length > t.length ? t : r;
  if (e.length < 4 || n.length * 2 < e.length)
    return null;
  function i(p, m, b) {
    for (var w = p.substring(b, b + Math.floor(p.length / 4)), v = -1, k = "", A, E, T, M; (v = m.indexOf(w, v + 1)) !== -1; ) {
      var N = uu(
        p.substring(b),
        m.substring(v)
      ), S = Ga(
        p.substring(0, b),
        m.substring(0, v)
      );
      k.length < S + N && (k = m.substring(v - S, v) + m.substring(v, v + N), A = p.substring(0, b - S), E = p.substring(b + N), T = m.substring(0, v - S), M = m.substring(v + N));
    }
    return k.length * 2 >= p.length ? [
      A,
      E,
      T,
      M,
      k
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
function Yw(r) {
  for (var t = !1, e = [], n = 0, i = null, s = 0, a = 0, o = 0, l = 0, c = 0; s < r.length; )
    r[s][0] == kt ? (e[n++] = s, a = l, o = c, l = 0, c = 0, i = r[s][1]) : (r[s][0] == $t ? l += r[s][1].length : c += r[s][1].length, i && i.length <= Math.max(a, o) && i.length <= Math.max(l, c) && (r.splice(e[n - 1], 0, [
      Kt,
      i
    ]), r[e[n - 1] + 1][0] = $t, n--, n--, s = n > 0 ? e[n - 1] : -1, a = 0, o = 0, l = 0, c = 0, i = null, t = !0)), s++;
  for (t && du(r), Kw(r), s = 1; s < r.length; ) {
    if (r[s - 1][0] == Kt && r[s][0] == $t) {
      var u = r[s - 1][1], h = r[s][1], f = qd(u, h), p = qd(h, u);
      f >= p ? (f >= u.length / 2 || f >= h.length / 2) && (r.splice(s, 0, [
        kt,
        h.substring(0, f)
      ]), r[s - 1][1] = u.substring(
        0,
        u.length - f
      ), r[s + 1][1] = h.substring(f), s++) : (p >= u.length / 2 || p >= h.length / 2) && (r.splice(s, 0, [
        kt,
        u.substring(0, p)
      ]), r[s - 1][0] = $t, r[s - 1][1] = h.substring(
        0,
        h.length - p
      ), r[s + 1][0] = Kt, r[s + 1][1] = u.substring(p), s++), s++;
    }
    s++;
  }
}
var _d = /[^a-zA-Z0-9]/, Rd = /\s/, zd = /[\r\n]/, Ww = /\n\r?\n$/, Gw = /^\r?\n\r?\n/;
function Kw(r) {
  function t(p, m) {
    if (!p || !m)
      return 6;
    var b = p.charAt(p.length - 1), w = m.charAt(0), v = b.match(_d), k = w.match(_d), A = v && b.match(Rd), E = k && w.match(Rd), T = A && b.match(zd), M = E && w.match(zd), N = T && p.match(Ww), S = M && m.match(Gw);
    return N || S ? 5 : T || M ? 4 : v && !A && E ? 3 : A || E ? 2 : v || k ? 1 : 0;
  }
  for (var e = 1; e < r.length - 1; ) {
    if (r[e - 1][0] == kt && r[e + 1][0] == kt) {
      var n = r[e - 1][1], i = r[e][1], s = r[e + 1][1], a = Ga(n, i);
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
function du(r, t) {
  r.push([kt, ""]);
  for (var e = 0, n = 0, i = 0, s = "", a = "", o; e < r.length; ) {
    if (e < r.length - 1 && !r[e][1]) {
      r.splice(e, 1);
      continue;
    }
    switch (r[e][0]) {
      case $t:
        i++, a += r[e][1], e++;
        break;
      case Kt:
        n++, s += r[e][1], e++;
        break;
      case kt:
        var l = e - i - n - 1;
        if (t) {
          if (l >= 0 && kp(r[l][1])) {
            var c = r[l][1].slice(-1);
            if (r[l][1] = r[l][1].slice(
              0,
              -1
            ), s = c + s, a = c + a, !r[l][1]) {
              r.splice(l, 1), e--;
              var u = l - 1;
              r[u] && r[u][0] === $t && (i++, a = r[u][1] + a, u--), r[u] && r[u][0] === Kt && (n++, s = r[u][1] + s, u--), l = u;
            }
          }
          if (xp(r[e][1])) {
            var c = r[e][1].charAt(0);
            r[e][1] = r[e][1].slice(1), s += c, a += c;
          }
        }
        if (e < r.length - 1 && !r[e][1]) {
          r.splice(e, 1);
          break;
        }
        if (s.length > 0 || a.length > 0) {
          s.length > 0 && a.length > 0 && (o = uu(a, s), o !== 0 && (l >= 0 ? r[l][1] += a.substring(
            0,
            o
          ) : (r.splice(0, 0, [
            kt,
            a.substring(0, o)
          ]), e++), a = a.substring(o), s = s.substring(o)), o = Ga(a, s), o !== 0 && (r[e][1] = a.substring(a.length - o) + r[e][1], a = a.substring(
            0,
            a.length - o
          ), s = s.substring(
            0,
            s.length - o
          )));
          var h = i + n;
          s.length === 0 && a.length === 0 ? (r.splice(e - h, h), e = e - h) : s.length === 0 ? (r.splice(e - h, h, [$t, a]), e = e - h + 1) : a.length === 0 ? (r.splice(e - h, h, [Kt, s]), e = e - h + 1) : (r.splice(
            e - h,
            h,
            [Kt, s],
            [$t, a]
          ), e = e - h + 2);
        }
        e !== 0 && r[e - 1][0] === kt ? (r[e - 1][1] += r[e][1], r.splice(e, 1)) : e++, i = 0, n = 0, s = "", a = "";
        break;
    }
  }
  r[r.length - 1][1] === "" && r.pop();
  var f = !1;
  for (e = 1; e < r.length - 1; )
    r[e - 1][0] === kt && r[e + 1][0] === kt && (r[e][1].substring(
      r[e][1].length - r[e - 1][1].length
    ) === r[e - 1][1] ? (r[e][1] = r[e - 1][1] + r[e][1].substring(
      0,
      r[e][1].length - r[e - 1][1].length
    ), r[e + 1][1] = r[e - 1][1] + r[e + 1][1], r.splice(e - 1, 1), f = !0) : r[e][1].substring(0, r[e + 1][1].length) == r[e + 1][1] && (r[e - 1][1] += r[e + 1][1], r[e][1] = r[e][1].substring(r[e + 1][1].length) + r[e + 1][1], r.splice(e + 1, 1), f = !0)), e++;
  f && du(r, t);
}
function vp(r) {
  return r >= 55296 && r <= 56319;
}
function wp(r) {
  return r >= 56320 && r <= 57343;
}
function xp(r) {
  return wp(r.charCodeAt(0));
}
function kp(r) {
  return vp(r.charCodeAt(r.length - 1));
}
function Qw(r) {
  for (var t = [], e = 0; e < r.length; e++)
    r[e][1].length > 0 && t.push(r[e]);
  return t;
}
function al(r, t, e, n) {
  return kp(r) || xp(n) ? null : Qw([
    [kt, r],
    [Kt, t],
    [$t, e],
    [kt, n]
  ]);
}
function Xw(r, t, e) {
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
      var m = Math.min(o, h), b = l.slice(0, m), w = f.slice(0, m);
      if (b !== w)
        break t;
      var v = l.slice(m), k = f.slice(m);
      return al(b, v, k, c);
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
      var v = c.slice(0, c.length - E), k = p.slice(0, p.length - E);
      return al(l, v, k, T);
    }
  }
  if (n.length > 0 && i && i.length === 0)
    t: {
      var b = r.slice(0, n.index), T = r.slice(n.index + n.length), m = b.length, E = T.length;
      if (a < m + E)
        break t;
      var w = t.slice(0, m), M = t.slice(a - E);
      if (b !== w || T !== M)
        break t;
      var v = r.slice(m, s - E), k = t.slice(m, a - E);
      return al(b, v, k, T);
    }
  return null;
}
function Ka(r, t, e, n) {
  return ss(r, t, e, n, !0);
}
Ka.INSERT = $t;
Ka.DELETE = Kt;
Ka.EQUAL = kt;
var Zw = Ka, Ea = { exports: {} };
Ea.exports;
(function(r, t) {
  var e = 200, n = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", l = "[object Date]", c = "[object Error]", u = "[object Function]", h = "[object GeneratorFunction]", f = "[object Map]", p = "[object Number]", m = "[object Object]", b = "[object Promise]", w = "[object RegExp]", v = "[object Set]", k = "[object String]", A = "[object Symbol]", E = "[object WeakMap]", T = "[object ArrayBuffer]", M = "[object DataView]", N = "[object Float32Array]", S = "[object Float64Array]", C = "[object Int8Array]", q = "[object Int16Array]", O = "[object Int32Array]", j = "[object Uint8Array]", Q = "[object Uint8ClampedArray]", H = "[object Uint16Array]", lt = "[object Uint32Array]", it = /[\\^$.*+?()[\]{}|]/g, vt = /\w*$/, dt = /^\[object .+?Constructor\]$/, wt = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[a] = U[T] = U[M] = U[o] = U[l] = U[N] = U[S] = U[C] = U[q] = U[O] = U[f] = U[p] = U[m] = U[w] = U[v] = U[k] = U[A] = U[j] = U[Q] = U[H] = U[lt] = !0, U[c] = U[u] = U[E] = !1;
  var Me = typeof Dn == "object" && Dn && Dn.Object === Object && Dn, qe = typeof self == "object" && self && self.Object === Object && self, de = Me || qe || Function("return this")(), ks = t && !t.nodeType && t, et = ks && !0 && r && !r.nodeType && r, Ss = et && et.exports === ks;
  function ho(d, g) {
    return d.set(g[0], g[1]), d;
  }
  function he(d, g) {
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
  function gi(d, g, x, L) {
    for (var V = -1, $ = d ? d.length : 0; ++V < $; )
      x = g(x, d[V], V, d);
    return x;
  }
  function mi(d, g) {
    for (var x = -1, L = Array(d); ++x < d; )
      L[x] = g(x);
    return L;
  }
  function Cs(d, g) {
    return d == null ? void 0 : d[g];
  }
  function bi(d) {
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
  function yi(d, g) {
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
  var fo = Array.prototype, po = Function.prototype, gr = Object.prototype, vi = de["__core-js_shared__"], Ds = function() {
    var d = /[^.]+$/.exec(vi && vi.keys && vi.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Is = po.toString, _e = gr.hasOwnProperty, mr = gr.toString, go = RegExp(
    "^" + Is.call(_e).replace(it, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), jn = Ss ? de.Buffer : void 0, br = de.Symbol, wi = de.Uint8Array, te = yi(Object.getPrototypeOf, Object), Os = Object.create, Ns = gr.propertyIsEnumerable, mo = fo.splice, xi = Object.getOwnPropertySymbols, yr = jn ? jn.isBuffer : void 0, Ms = yi(Object.keys, Object), vr = pe(de, "DataView"), Fn = pe(de, "Map"), fe = pe(de, "Promise"), wr = pe(de, "Set"), ki = pe(de, "WeakMap"), Hn = pe(Object, "create"), Si = Pt(vr), Un = Pt(Fn), Ai = Pt(fe), Ei = Pt(wr), Ci = Pt(ki), vn = br ? br.prototype : void 0, qs = vn ? vn.valueOf : void 0;
  function an(d) {
    var g = -1, x = d ? d.length : 0;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function bo() {
    this.__data__ = Hn ? Hn(null) : {};
  }
  function yo(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function vo(d) {
    var g = this.__data__;
    if (Hn) {
      var x = g[d];
      return x === n ? void 0 : x;
    }
    return _e.call(g, d) ? g[d] : void 0;
  }
  function _s(d) {
    var g = this.__data__;
    return Hn ? g[d] !== void 0 : _e.call(g, d);
  }
  function Ti(d, g) {
    var x = this.__data__;
    return x[d] = Hn && g === void 0 ? n : g, this;
  }
  an.prototype.clear = bo, an.prototype.delete = yo, an.prototype.get = vo, an.prototype.has = _s, an.prototype.set = Ti;
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
    var g = this.__data__, x = kr(g, d);
    if (x < 0)
      return !1;
    var L = g.length - 1;
    return x == L ? g.pop() : mo.call(g, x, 1), !0;
  }
  function ko(d) {
    var g = this.__data__, x = kr(g, d);
    return x < 0 ? void 0 : g[x][1];
  }
  function So(d) {
    return kr(this.__data__, d) > -1;
  }
  function Ao(d, g) {
    var x = this.__data__, L = kr(x, d);
    return L < 0 ? x.push([d, g]) : x[L][1] = g, this;
  }
  Et.prototype.clear = wo, Et.prototype.delete = xo, Et.prototype.get = ko, Et.prototype.has = So, Et.prototype.set = Ao;
  function Lt(d) {
    var g = -1, x = d ? d.length : 0;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function Eo() {
    this.__data__ = {
      hash: new an(),
      map: new (Fn || Et)(),
      string: new an()
    };
  }
  function Co(d) {
    return Yn(this, d).delete(d);
  }
  function To(d) {
    return Yn(this, d).get(d);
  }
  function Lo(d) {
    return Yn(this, d).has(d);
  }
  function Do(d, g) {
    return Yn(this, d).set(d, g), this;
  }
  Lt.prototype.clear = Eo, Lt.prototype.delete = Co, Lt.prototype.get = To, Lt.prototype.has = Lo, Lt.prototype.set = Do;
  function Ft(d) {
    this.__data__ = new Et(d);
  }
  function Io() {
    this.__data__ = new Et();
  }
  function Oo(d) {
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
      if (!Fn || L.length < e - 1)
        return L.push([d, g]), this;
      x = this.__data__ = new Lt(L);
    }
    return x.set(d, g), this;
  }
  Ft.prototype.clear = Io, Ft.prototype.delete = Oo, Ft.prototype.get = No, Ft.prototype.has = Mo, Ft.prototype.set = qo;
  function xr(d, g) {
    var x = Oi(d) || Ar(d) ? mi(d.length, String) : [], L = x.length, V = !!L;
    for (var $ in d)
      _e.call(d, $) && !(V && ($ == "length" || Go($, L))) && x.push($);
    return x;
  }
  function Rs(d, g, x) {
    var L = d[g];
    (!(_e.call(d, g) && js(L, x)) || x === void 0 && !(g in d)) && (d[g] = x);
  }
  function kr(d, g) {
    for (var x = d.length; x--; )
      if (js(d[x][0], g))
        return x;
    return -1;
  }
  function Re(d, g) {
    return d && Ii(g, Mi(g), d);
  }
  function Li(d, g, x, L, V, $, Z) {
    var X;
    if (L && (X = $ ? L(d, V, $, Z) : L(d)), X !== void 0)
      return X;
    if (!Pe(d))
      return d;
    var gt = Oi(d);
    if (gt) {
      if (X = Yo(d), !g)
        return Ho(d, X);
    } else {
      var tt = ln(d), Dt = tt == u || tt == h;
      if (Fs(d))
        return Sr(d, g);
      if (tt == m || tt == s || Dt && !$) {
        if (bi(d))
          return $ ? d : {};
        if (X = ze(Dt ? {} : d), !g)
          return Uo(d, Re(X, d));
      } else {
        if (!U[tt])
          return $ ? d : {};
        X = Wo(d, tt, Li, g);
      }
    }
    Z || (Z = new Ft());
    var Ht = Z.get(d);
    if (Ht)
      return Ht;
    if (Z.set(d, X), !gt)
      var xt = x ? Vo(d) : Mi(d);
    return As(xt || d, function(It, Ct) {
      xt && (Ct = It, It = d[Ct]), Rs(X, Ct, Li(It, g, x, L, Ct, d, Z));
    }), X;
  }
  function _o(d) {
    return Pe(d) ? Os(d) : {};
  }
  function Ro(d, g, x) {
    var L = g(d);
    return Oi(d) ? L : Es(L, x(d));
  }
  function zo(d) {
    return mr.call(d);
  }
  function Po(d) {
    if (!Pe(d) || Qo(d))
      return !1;
    var g = Ni(d) || bi(d) ? go : dt;
    return g.test(Pt(d));
  }
  function Bo(d) {
    if (!Bs(d))
      return Ms(d);
    var g = [];
    for (var x in Object(d))
      _e.call(d, x) && x != "constructor" && g.push(x);
    return g;
  }
  function Sr(d, g) {
    if (g)
      return d.slice();
    var x = new d.constructor(d.length);
    return d.copy(x), x;
  }
  function Di(d) {
    var g = new d.constructor(d.byteLength);
    return new wi(g).set(new wi(d)), g;
  }
  function Vn(d, g) {
    var x = g ? Di(d.buffer) : d.buffer;
    return new d.constructor(x, d.byteOffset, d.byteLength);
  }
  function zs(d, g, x) {
    var L = g ? x(Ts(d), !0) : Ts(d);
    return gi(L, ho, new d.constructor());
  }
  function Ps(d) {
    var g = new d.constructor(d.source, vt.exec(d));
    return g.lastIndex = d.lastIndex, g;
  }
  function $o(d, g, x) {
    var L = g ? x(Ls(d), !0) : Ls(d);
    return gi(L, he, new d.constructor());
  }
  function jo(d) {
    return qs ? Object(qs.call(d)) : {};
  }
  function Fo(d, g) {
    var x = g ? Di(d.buffer) : d.buffer;
    return new d.constructor(x, d.byteOffset, d.length);
  }
  function Ho(d, g) {
    var x = -1, L = d.length;
    for (g || (g = Array(L)); ++x < L; )
      g[x] = d[x];
    return g;
  }
  function Ii(d, g, x, L) {
    x || (x = {});
    for (var V = -1, $ = g.length; ++V < $; ) {
      var Z = g[V], X = void 0;
      Rs(x, Z, X === void 0 ? d[Z] : X);
    }
    return x;
  }
  function Uo(d, g) {
    return Ii(d, on(d), g);
  }
  function Vo(d) {
    return Ro(d, Mi, on);
  }
  function Yn(d, g) {
    var x = d.__data__;
    return Ko(g) ? x[typeof g == "string" ? "string" : "hash"] : x.map;
  }
  function pe(d, g) {
    var x = Cs(d, g);
    return Po(x) ? x : void 0;
  }
  var on = xi ? yi(xi, Object) : Zo, ln = zo;
  (vr && ln(new vr(new ArrayBuffer(1))) != M || Fn && ln(new Fn()) != f || fe && ln(fe.resolve()) != b || wr && ln(new wr()) != v || ki && ln(new ki()) != E) && (ln = function(d) {
    var g = mr.call(d), x = g == m ? d.constructor : void 0, L = x ? Pt(x) : void 0;
    if (L)
      switch (L) {
        case Si:
          return M;
        case Un:
          return f;
        case Ai:
          return b;
        case Ei:
          return v;
        case Ci:
          return E;
      }
    return g;
  });
  function Yo(d) {
    var g = d.length, x = d.constructor(g);
    return g && typeof d[0] == "string" && _e.call(d, "index") && (x.index = d.index, x.input = d.input), x;
  }
  function ze(d) {
    return typeof d.constructor == "function" && !Bs(d) ? _o(te(d)) : {};
  }
  function Wo(d, g, x, L) {
    var V = d.constructor;
    switch (g) {
      case T:
        return Di(d);
      case o:
      case l:
        return new V(+d);
      case M:
        return Vn(d, L);
      case N:
      case S:
      case C:
      case q:
      case O:
      case j:
      case Q:
      case H:
      case lt:
        return Fo(d, L);
      case f:
        return zs(d, L, x);
      case p:
      case k:
        return new V(d);
      case w:
        return Ps(d);
      case v:
        return $o(d, L, x);
      case A:
        return jo(d);
    }
  }
  function Go(d, g) {
    return g = g ?? i, !!g && (typeof d == "number" || wt.test(d)) && d > -1 && d % 1 == 0 && d < g;
  }
  function Ko(d) {
    var g = typeof d;
    return g == "string" || g == "number" || g == "symbol" || g == "boolean" ? d !== "__proto__" : d === null;
  }
  function Qo(d) {
    return !!Ds && Ds in d;
  }
  function Bs(d) {
    var g = d && d.constructor, x = typeof g == "function" && g.prototype || gr;
    return d === x;
  }
  function Pt(d) {
    if (d != null) {
      try {
        return Is.call(d);
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
    return Li(d, !0, !0);
  }
  function js(d, g) {
    return d === g || d !== d && g !== g;
  }
  function Ar(d) {
    return Xo(d) && _e.call(d, "callee") && (!Ns.call(d, "callee") || mr.call(d) == s);
  }
  var Oi = Array.isArray;
  function Er(d) {
    return d != null && Hs(d.length) && !Ni(d);
  }
  function Xo(d) {
    return Us(d) && Er(d);
  }
  var Fs = yr || Jo;
  function Ni(d) {
    var g = Pe(d) ? mr.call(d) : "";
    return g == u || g == h;
  }
  function Hs(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= i;
  }
  function Pe(d) {
    var g = typeof d;
    return !!d && (g == "object" || g == "function");
  }
  function Us(d) {
    return !!d && typeof d == "object";
  }
  function Mi(d) {
    return Er(d) ? xr(d) : Bo(d);
  }
  function Zo() {
    return [];
  }
  function Jo() {
    return !1;
  }
  r.exports = $s;
})(Ea, Ea.exports);
var Sp = Ea.exports, Ca = { exports: {} };
Ca.exports;
(function(r, t) {
  var e = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, o = "[object Arguments]", l = "[object Array]", c = "[object AsyncFunction]", u = "[object Boolean]", h = "[object Date]", f = "[object Error]", p = "[object Function]", m = "[object GeneratorFunction]", b = "[object Map]", w = "[object Number]", v = "[object Null]", k = "[object Object]", A = "[object Promise]", E = "[object Proxy]", T = "[object RegExp]", M = "[object Set]", N = "[object String]", S = "[object Symbol]", C = "[object Undefined]", q = "[object WeakMap]", O = "[object ArrayBuffer]", j = "[object DataView]", Q = "[object Float32Array]", H = "[object Float64Array]", lt = "[object Int8Array]", it = "[object Int16Array]", vt = "[object Int32Array]", dt = "[object Uint8Array]", wt = "[object Uint8ClampedArray]", U = "[object Uint16Array]", Me = "[object Uint32Array]", qe = /[\\^$.*+?()[\]{}|]/g, de = /^\[object .+?Constructor\]$/, ks = /^(?:0|[1-9]\d*)$/, et = {};
  et[Q] = et[H] = et[lt] = et[it] = et[vt] = et[dt] = et[wt] = et[U] = et[Me] = !0, et[o] = et[l] = et[O] = et[u] = et[j] = et[h] = et[f] = et[p] = et[b] = et[w] = et[k] = et[T] = et[M] = et[N] = et[q] = !1;
  var Ss = typeof Dn == "object" && Dn && Dn.Object === Object && Dn, ho = typeof self == "object" && self && self.Object === Object && self, he = Ss || ho || Function("return this")(), As = t && !t.nodeType && t, Es = As && !0 && r && !r.nodeType && r, gi = Es && Es.exports === As, mi = gi && Ss.process, Cs = function() {
    try {
      return mi && mi.binding && mi.binding("util");
    } catch {
    }
  }(), bi = Cs && Cs.isTypedArray;
  function Ts(d, g) {
    for (var x = -1, L = d == null ? 0 : d.length, V = 0, $ = []; ++x < L; ) {
      var Z = d[x];
      g(Z, x, d) && ($[V++] = Z);
    }
    return $;
  }
  function yi(d, g) {
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
  function gr(d, g) {
    return d.has(g);
  }
  function vi(d, g) {
    return d == null ? void 0 : d[g];
  }
  function Ds(d) {
    var g = -1, x = Array(d.size);
    return d.forEach(function(L, V) {
      x[++g] = [V, L];
    }), x;
  }
  function Is(d, g) {
    return function(x) {
      return d(g(x));
    };
  }
  function _e(d) {
    var g = -1, x = Array(d.size);
    return d.forEach(function(L) {
      x[++g] = L;
    }), x;
  }
  var mr = Array.prototype, go = Function.prototype, jn = Object.prototype, br = he["__core-js_shared__"], wi = go.toString, te = jn.hasOwnProperty, Os = function() {
    var d = /[^.]+$/.exec(br && br.keys && br.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Ns = jn.toString, mo = RegExp(
    "^" + wi.call(te).replace(qe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), xi = gi ? he.Buffer : void 0, yr = he.Symbol, Ms = he.Uint8Array, vr = jn.propertyIsEnumerable, Fn = mr.splice, fe = yr ? yr.toStringTag : void 0, wr = Object.getOwnPropertySymbols, ki = xi ? xi.isBuffer : void 0, Hn = Is(Object.keys, Object), Si = on(he, "DataView"), Un = on(he, "Map"), Ai = on(he, "Promise"), Ei = on(he, "Set"), Ci = on(he, "WeakMap"), vn = on(Object, "create"), qs = Pt(Si), an = Pt(Un), bo = Pt(Ai), yo = Pt(Ei), vo = Pt(Ci), _s = yr ? yr.prototype : void 0, Ti = _s ? _s.valueOf : void 0;
  function Et(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function wo() {
    this.__data__ = vn ? vn(null) : {}, this.size = 0;
  }
  function xo(d) {
    var g = this.has(d) && delete this.__data__[d];
    return this.size -= g ? 1 : 0, g;
  }
  function ko(d) {
    var g = this.__data__;
    if (vn) {
      var x = g[d];
      return x === n ? void 0 : x;
    }
    return te.call(g, d) ? g[d] : void 0;
  }
  function So(d) {
    var g = this.__data__;
    return vn ? g[d] !== void 0 : te.call(g, d);
  }
  function Ao(d, g) {
    var x = this.__data__;
    return this.size += this.has(d) ? 0 : 1, x[d] = vn && g === void 0 ? n : g, this;
  }
  Et.prototype.clear = wo, Et.prototype.delete = xo, Et.prototype.get = ko, Et.prototype.has = So, Et.prototype.set = Ao;
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
    var g = this.__data__, x = Sr(g, d);
    if (x < 0)
      return !1;
    var L = g.length - 1;
    return x == L ? g.pop() : Fn.call(g, x, 1), --this.size, !0;
  }
  function To(d) {
    var g = this.__data__, x = Sr(g, d);
    return x < 0 ? void 0 : g[x][1];
  }
  function Lo(d) {
    return Sr(this.__data__, d) > -1;
  }
  function Do(d, g) {
    var x = this.__data__, L = Sr(x, d);
    return L < 0 ? (++this.size, x.push([d, g])) : x[L][1] = g, this;
  }
  Lt.prototype.clear = Eo, Lt.prototype.delete = Co, Lt.prototype.get = To, Lt.prototype.has = Lo, Lt.prototype.set = Do;
  function Ft(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.clear(); ++g < x; ) {
      var L = d[g];
      this.set(L[0], L[1]);
    }
  }
  function Io() {
    this.size = 0, this.__data__ = {
      hash: new Et(),
      map: new (Un || Lt)(),
      string: new Et()
    };
  }
  function Oo(d) {
    var g = pe(this, d).delete(d);
    return this.size -= g ? 1 : 0, g;
  }
  function No(d) {
    return pe(this, d).get(d);
  }
  function Mo(d) {
    return pe(this, d).has(d);
  }
  function qo(d, g) {
    var x = pe(this, d), L = x.size;
    return x.set(d, g), this.size += x.size == L ? 0 : 1, this;
  }
  Ft.prototype.clear = Io, Ft.prototype.delete = Oo, Ft.prototype.get = No, Ft.prototype.has = Mo, Ft.prototype.set = qo;
  function xr(d) {
    var g = -1, x = d == null ? 0 : d.length;
    for (this.__data__ = new Ft(); ++g < x; )
      this.add(d[g]);
  }
  function Rs(d) {
    return this.__data__.set(d, n), this;
  }
  function kr(d) {
    return this.__data__.has(d);
  }
  xr.prototype.add = xr.prototype.push = Rs, xr.prototype.has = kr;
  function Re(d) {
    var g = this.__data__ = new Lt(d);
    this.size = g.size;
  }
  function Li() {
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
      if (!Un || L.length < e - 1)
        return L.push([d, g]), this.size = ++x.size, this;
      x = this.__data__ = new Ft(L);
    }
    return x.set(d, g), this.size = x.size, this;
  }
  Re.prototype.clear = Li, Re.prototype.delete = _o, Re.prototype.get = Ro, Re.prototype.has = zo, Re.prototype.set = Po;
  function Bo(d, g) {
    var x = Ar(d), L = !x && js(d), V = !x && !L && Er(d), $ = !x && !L && !V && Us(d), Z = x || L || V || $, X = Z ? fo(d.length, String) : [], gt = X.length;
    for (var tt in d)
      te.call(d, tt) && !(Z && // Safari 9 has enumerable `arguments.length` in strict mode.
      (tt == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      V && (tt == "offset" || tt == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      $ && (tt == "buffer" || tt == "byteLength" || tt == "byteOffset") || // Skip index properties.
      Wo(tt, gt))) && X.push(tt);
    return X;
  }
  function Sr(d, g) {
    for (var x = d.length; x--; )
      if ($s(d[x][0], g))
        return x;
    return -1;
  }
  function Di(d, g, x) {
    var L = g(d);
    return Ar(d) ? L : yi(L, x(d));
  }
  function Vn(d) {
    return d == null ? d === void 0 ? C : v : fe && fe in Object(d) ? ln(d) : Bs(d);
  }
  function zs(d) {
    return Pe(d) && Vn(d) == o;
  }
  function Ps(d, g, x, L, V) {
    return d === g ? !0 : d == null || g == null || !Pe(d) && !Pe(g) ? d !== d && g !== g : $o(d, g, x, L, Ps, V);
  }
  function $o(d, g, x, L, V, $) {
    var Z = Ar(d), X = Ar(g), gt = Z ? l : ze(d), tt = X ? l : ze(g);
    gt = gt == o ? k : gt, tt = tt == o ? k : tt;
    var Dt = gt == k, Ht = tt == k, xt = gt == tt;
    if (xt && Er(d)) {
      if (!Er(g))
        return !1;
      Z = !0, Dt = !1;
    }
    if (xt && !Dt)
      return $ || ($ = new Re()), Z || Us(d) ? Ii(d, g, x, L, V, $) : Uo(d, g, gt, x, L, V, $);
    if (!(x & i)) {
      var It = Dt && te.call(d, "__wrapped__"), Ct = Ht && te.call(g, "__wrapped__");
      if (It || Ct) {
        var wn = It ? d.value() : d, cn = Ct ? g.value() : g;
        return $ || ($ = new Re()), V(wn, cn, x, L, $);
      }
    }
    return xt ? ($ || ($ = new Re()), Vo(d, g, x, L, V, $)) : !1;
  }
  function jo(d) {
    if (!Hs(d) || Ko(d))
      return !1;
    var g = Fs(d) ? mo : de;
    return g.test(Pt(d));
  }
  function Fo(d) {
    return Pe(d) && Ni(d.length) && !!et[Vn(d)];
  }
  function Ho(d) {
    if (!Qo(d))
      return Hn(d);
    var g = [];
    for (var x in Object(d))
      te.call(d, x) && x != "constructor" && g.push(x);
    return g;
  }
  function Ii(d, g, x, L, V, $) {
    var Z = x & i, X = d.length, gt = g.length;
    if (X != gt && !(Z && gt > X))
      return !1;
    var tt = $.get(d);
    if (tt && $.get(g))
      return tt == g;
    var Dt = -1, Ht = !0, xt = x & s ? new xr() : void 0;
    for ($.set(d, g), $.set(g, d); ++Dt < X; ) {
      var It = d[Dt], Ct = g[Dt];
      if (L)
        var wn = Z ? L(Ct, It, Dt, g, d, $) : L(It, Ct, Dt, d, g, $);
      if (wn !== void 0) {
        if (wn)
          continue;
        Ht = !1;
        break;
      }
      if (xt) {
        if (!Ls(g, function(cn, Wn) {
          if (!gr(xt, Wn) && (It === cn || V(It, cn, x, L, $)))
            return xt.push(Wn);
        })) {
          Ht = !1;
          break;
        }
      } else if (!(It === Ct || V(It, Ct, x, L, $))) {
        Ht = !1;
        break;
      }
    }
    return $.delete(d), $.delete(g), Ht;
  }
  function Uo(d, g, x, L, V, $, Z) {
    switch (x) {
      case j:
        if (d.byteLength != g.byteLength || d.byteOffset != g.byteOffset)
          return !1;
        d = d.buffer, g = g.buffer;
      case O:
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
      case b:
        var X = Ds;
      case M:
        var gt = L & i;
        if (X || (X = _e), d.size != g.size && !gt)
          return !1;
        var tt = Z.get(d);
        if (tt)
          return tt == g;
        L |= s, Z.set(d, g);
        var Dt = Ii(X(d), X(g), L, V, $, Z);
        return Z.delete(d), Dt;
      case S:
        if (Ti)
          return Ti.call(d) == Ti.call(g);
    }
    return !1;
  }
  function Vo(d, g, x, L, V, $) {
    var Z = x & i, X = Yn(d), gt = X.length, tt = Yn(g), Dt = tt.length;
    if (gt != Dt && !Z)
      return !1;
    for (var Ht = gt; Ht--; ) {
      var xt = X[Ht];
      if (!(Z ? xt in g : te.call(g, xt)))
        return !1;
    }
    var It = $.get(d);
    if (It && $.get(g))
      return It == g;
    var Ct = !0;
    $.set(d, g), $.set(g, d);
    for (var wn = Z; ++Ht < gt; ) {
      xt = X[Ht];
      var cn = d[xt], Wn = g[xt];
      if (L)
        var Gu = Z ? L(Wn, cn, xt, g, d, $) : L(cn, Wn, xt, d, g, $);
      if (!(Gu === void 0 ? cn === Wn || V(cn, Wn, x, L, $) : Gu)) {
        Ct = !1;
        break;
      }
      wn || (wn = xt == "constructor");
    }
    if (Ct && !wn) {
      var Vs = d.constructor, Ys = g.constructor;
      Vs != Ys && "constructor" in d && "constructor" in g && !(typeof Vs == "function" && Vs instanceof Vs && typeof Ys == "function" && Ys instanceof Ys) && (Ct = !1);
    }
    return $.delete(d), $.delete(g), Ct;
  }
  function Yn(d) {
    return Di(d, Mi, Yo);
  }
  function pe(d, g) {
    var x = d.__data__;
    return Go(g) ? x[typeof g == "string" ? "string" : "hash"] : x.map;
  }
  function on(d, g) {
    var x = vi(d, g);
    return jo(x) ? x : void 0;
  }
  function ln(d) {
    var g = te.call(d, fe), x = d[fe];
    try {
      d[fe] = void 0;
      var L = !0;
    } catch {
    }
    var V = Ns.call(d);
    return L && (g ? d[fe] = x : delete d[fe]), V;
  }
  var Yo = wr ? function(d) {
    return d == null ? [] : (d = Object(d), Ts(wr(d), function(g) {
      return vr.call(d, g);
    }));
  } : Zo, ze = Vn;
  (Si && ze(new Si(new ArrayBuffer(1))) != j || Un && ze(new Un()) != b || Ai && ze(Ai.resolve()) != A || Ei && ze(new Ei()) != M || Ci && ze(new Ci()) != q) && (ze = function(d) {
    var g = Vn(d), x = g == k ? d.constructor : void 0, L = x ? Pt(x) : "";
    if (L)
      switch (L) {
        case qs:
          return j;
        case an:
          return b;
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
    return g = g ?? a, !!g && (typeof d == "number" || ks.test(d)) && d > -1 && d % 1 == 0 && d < g;
  }
  function Go(d) {
    var g = typeof d;
    return g == "string" || g == "number" || g == "symbol" || g == "boolean" ? d !== "__proto__" : d === null;
  }
  function Ko(d) {
    return !!Os && Os in d;
  }
  function Qo(d) {
    var g = d && d.constructor, x = typeof g == "function" && g.prototype || jn;
    return d === x;
  }
  function Bs(d) {
    return Ns.call(d);
  }
  function Pt(d) {
    if (d != null) {
      try {
        return wi.call(d);
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
    return Pe(d) && te.call(d, "callee") && !vr.call(d, "callee");
  }, Ar = Array.isArray;
  function Oi(d) {
    return d != null && Ni(d.length) && !Fs(d);
  }
  var Er = ki || Jo;
  function Xo(d, g) {
    return Ps(d, g);
  }
  function Fs(d) {
    if (!Hs(d))
      return !1;
    var g = Vn(d);
    return g == p || g == m || g == c || g == E;
  }
  function Ni(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= a;
  }
  function Hs(d) {
    var g = typeof d;
    return d != null && (g == "object" || g == "function");
  }
  function Pe(d) {
    return d != null && typeof d == "object";
  }
  var Us = bi ? po(bi) : Fo;
  function Mi(d) {
    return Oi(d) ? Bo(d) : Ho(d);
  }
  function Zo() {
    return [];
  }
  function Jo() {
    return !1;
  }
  r.exports = Xo;
})(Ca, Ca.exports);
var Ap = Ca.exports, hu = {};
Object.defineProperty(hu, "__esModule", { value: !0 });
const Jw = Sp, tx = Ap;
var nc;
(function(r) {
  function t(s = {}, a = {}, o = !1) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    let l = Jw(a);
    o || (l = Object.keys(l).reduce((c, u) => (l[u] != null && (c[u] = l[u]), c), {}));
    for (const c in s)
      s[c] !== void 0 && a[c] === void 0 && (l[c] = s[c]);
    return Object.keys(l).length > 0 ? l : void 0;
  }
  r.compose = t;
  function e(s = {}, a = {}) {
    typeof s != "object" && (s = {}), typeof a != "object" && (a = {});
    const o = Object.keys(s).concat(Object.keys(a)).reduce((l, c) => (tx(s[c], a[c]) || (l[c] = a[c] === void 0 ? null : a[c]), l), {});
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
})(nc || (nc = {}));
hu.default = nc;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
var rc;
(function(r) {
  function t(e) {
    return typeof e.delete == "number" ? e.delete : typeof e.retain == "number" ? e.retain : typeof e.retain == "object" && e.retain !== null ? 1 : typeof e.insert == "string" ? e.insert.length : 1;
  }
  r.length = t;
})(rc || (rc = {}));
Qa.default = rc;
var fu = {};
Object.defineProperty(fu, "__esModule", { value: !0 });
const Pd = Qa;
class ex {
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
      const n = this.offset, i = Pd.default.length(e);
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
    return this.ops[this.index] ? Pd.default.length(this.ops[this.index]) - this.offset : 1 / 0;
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
fu.default = ex;
(function(r, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.AttributeMap = t.OpIterator = t.Op = void 0;
  const e = Zw, n = Sp, i = Ap, s = hu;
  t.AttributeMap = s.default;
  const a = Qa;
  t.Op = a.default;
  const o = fu;
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
      return this.forEach((b) => {
        (f(b) ? p : m).push(b);
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
      const m = [], b = new o.default(this.ops);
      let w = 0;
      for (; w < p && b.hasNext(); ) {
        let v;
        w < f ? v = b.next(f - w) : (v = b.next(p - w), m.push(v)), w += a.default.length(v);
      }
      return new u(m);
    }
    compose(f) {
      const p = new o.default(this.ops), m = new o.default(f.ops), b = [], w = m.peek();
      if (w != null && typeof w.retain == "number" && w.attributes == null) {
        let k = w.retain;
        for (; p.peekType() === "insert" && p.peekLength() <= k; )
          k -= p.peekLength(), b.push(p.next());
        w.retain - k > 0 && m.next(w.retain - k);
      }
      const v = new u(b);
      for (; p.hasNext() || m.hasNext(); )
        if (m.peekType() === "insert")
          v.push(m.next());
        else if (p.peekType() === "delete")
          v.push(p.next());
        else {
          const k = Math.min(p.peekLength(), m.peekLength()), A = p.next(k), E = m.next(k);
          if (E.retain) {
            const T = {};
            if (typeof A.retain == "number")
              T.retain = typeof E.retain == "number" ? k : E.retain;
            else if (typeof E.retain == "number")
              A.retain == null ? T.insert = A.insert : T.retain = A.retain;
            else {
              const N = A.retain == null ? "insert" : "retain", [S, C, q] = c(A[N], E.retain), O = u.getHandler(S);
              T[N] = {
                [S]: O.compose(C, q, N === "retain")
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
      }).join("")), b = new u(), w = e(m[0], m[1], p, !0), v = new o.default(this.ops), k = new o.default(f.ops);
      return w.forEach((A) => {
        let E = A[1].length;
        for (; E > 0; ) {
          let T = 0;
          switch (A[0]) {
            case e.INSERT:
              T = Math.min(k.peekLength(), E), b.push(k.next(T));
              break;
            case e.DELETE:
              T = Math.min(E, v.peekLength()), v.next(T), b.delete(T);
              break;
            case e.EQUAL:
              T = Math.min(v.peekLength(), k.peekLength(), E);
              const M = v.next(T), N = k.next(T);
              i(M.insert, N.insert) ? b.retain(T, s.default.diff(M.attributes, N.attributes)) : b.push(N).delete(T);
              break;
          }
          E -= T;
        }
      }), b.chop();
    }
    eachLine(f, p = `
`) {
      const m = new o.default(this.ops);
      let b = new u(), w = 0;
      for (; m.hasNext(); ) {
        if (m.peekType() !== "insert")
          return;
        const v = m.peek(), k = a.default.length(v) - m.peekLength(), A = typeof v.insert == "string" ? v.insert.indexOf(p, k) - k : -1;
        if (A < 0)
          b.push(m.next());
        else if (A > 0)
          b.push(m.next(A));
        else {
          if (f(b, m.next(1).attributes || {}, w) === !1)
            return;
          w += 1, b = new u();
        }
      }
      b.length() > 0 && f(b, {}, w);
    }
    invert(f) {
      const p = new u();
      return this.reduce((m, b) => {
        if (b.insert)
          p.delete(a.default.length(b));
        else {
          if (typeof b.retain == "number" && b.attributes == null)
            return p.retain(b.retain), m + b.retain;
          if (b.delete || typeof b.retain == "number") {
            const w = b.delete || b.retain;
            return f.slice(m, m + w).forEach((k) => {
              b.delete ? p.push(k) : b.retain && b.attributes && p.retain(a.default.length(k), s.default.invert(b.attributes, k.attributes));
            }), m + w;
          } else if (typeof b.retain == "object" && b.retain !== null) {
            const w = f.slice(m, m + 1), v = new o.default(w.ops).next(), [k, A, E] = c(b.retain, v.insert), T = u.getHandler(k);
            return p.retain({ [k]: T.invert(A, E) }, s.default.invert(b.attributes, v.attributes)), m + 1;
          }
        }
        return m;
      }, 0), p.chop();
    }
    transform(f, p = !1) {
      if (p = !!p, typeof f == "number")
        return this.transformPosition(f, p);
      const m = f, b = new o.default(this.ops), w = new o.default(m.ops), v = new u();
      for (; b.hasNext() || w.hasNext(); )
        if (b.peekType() === "insert" && (p || w.peekType() !== "insert"))
          v.retain(a.default.length(b.next()));
        else if (w.peekType() === "insert")
          v.push(w.next());
        else {
          const k = Math.min(b.peekLength(), w.peekLength()), A = b.next(k), E = w.next(k);
          if (A.delete)
            continue;
          if (E.delete)
            v.push(E);
          else {
            const T = A.retain, M = E.retain;
            let N = typeof M == "object" && M !== null ? M : k;
            if (typeof T == "object" && T !== null && typeof M == "object" && M !== null) {
              const S = Object.keys(T)[0];
              if (S === Object.keys(M)[0]) {
                const C = u.getHandler(S);
                C && (N = {
                  [S]: C.transform(T[S], M[S], p)
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
      let b = 0;
      for (; m.hasNext() && b <= f; ) {
        const w = m.peekLength(), v = m.peekType();
        if (m.next(), v === "delete") {
          f -= Math.min(w, f - b);
          continue;
        } else v === "insert" && (b < f || !p) && (f += w);
        b += w;
      }
      return f;
    }
  }
  u.Op = a.default, u.OpIterator = o.default, u.AttributeMap = s.default, u.handlers = {}, t.default = u, r.exports = u, r.exports.default = u;
})(ec, ec.exports);
var le = ec.exports;
const P = /* @__PURE__ */ yp(le);
class Oe extends Zt {
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
Oe.blotName = "break";
Oe.tagName = "BR";
let Te = class extends Aa {
};
const nx = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Xa(r) {
  return r.replace(/[&<>"']/g, (t) => nx[t]);
}
const Be = class Be extends lu {
  static compare(t, e) {
    const n = Be.order.indexOf(t), i = Be.order.indexOf(e);
    return n >= 0 || i >= 0 ? n - i : t === e ? 0 : t < e ? -1 : 1;
  }
  formatAt(t, e, n, i) {
    if (Be.compare(this.statics.blotName, n) < 0 && this.scroll.query(n, B.BLOT)) {
      const s = this.isolate(t, e);
      i && s.wrap(n, i);
    } else
      super.formatAt(t, e, n, i);
  }
  optimize(t) {
    if (super.optimize(t), this.parent instanceof Be && Be.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const e = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(e), e.wrap(this);
    }
  }
};
_(Be, "allowedChildren", [Be, Oe, Zt, Te]), // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
_(Be, "order", [
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
let Xe = Be;
const Bd = 1;
class Tt extends is {
  constructor() {
    super(...arguments);
    _(this, "cache", {});
  }
  delta() {
    return this.cache.delta == null && (this.cache.delta = Ep(this)), this.cache.delta;
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
    super.insertBefore(e, n), i instanceof Oe && i.remove(), this.cache = {};
  }
  length() {
    return this.cache.length == null && (this.cache.length = super.length() + Bd), this.cache.length;
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
    if (n && (e === 0 || e >= this.length() - Bd)) {
      const s = this.clone();
      return e === 0 ? (this.parent.insertBefore(s, this), this) : (this.parent.insertBefore(s, this.next), s);
    }
    const i = super.split(e, n);
    return this.cache = {}, i;
  }
}
Tt.blotName = "block";
Tt.tagName = "P";
Tt.defaultChild = Oe;
Tt.allowedChildren = [Oe, Xe, Zt, Te];
class oe extends Zt {
  attach() {
    super.attach(), this.attributes = new Ya(this.domNode);
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
oe.scope = B.BLOCK_BLOT;
function Ep(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  return r.descendants(qt).reduce((e, n) => n.length() === 0 ? e : e.insert(n.value(), ie(n, {}, t)), new P()).insert(`
`, ie(r));
}
function ie(r) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  return r == null || ("formats" in r && typeof r.formats == "function" && (t = {
    ...t,
    ...r.formats()
  }, e && delete t["code-token"]), r.parent == null || r.parent.statics.blotName === "scroll" || r.parent.statics.scope !== r.statics.scope) ? t : ie(r.parent, t, e);
}
const ne = class ne extends Zt {
  // Zero width no break space
  static value() {
  }
  constructor(t, e, n) {
    super(t, e), this.selection = n, this.textNode = document.createTextNode(ne.CONTENTS), this.domNode.appendChild(this.textNode), this.savedLength = 0;
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
    n != null && (this.savedLength = ne.CONTENTS.length, n.optimize(), n.formatAt(i, ne.CONTENTS.length, t, e), this.savedLength = 0);
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
    const e = this.prev instanceof Te ? this.prev : null, n = e ? e.length() : 0, i = this.next instanceof Te ? this.next : null, s = i ? i.text : "", {
      textNode: a
    } = this, o = a.data.split(ne.CONTENTS).join("");
    a.data = ne.CONTENTS;
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
        this.savedLength = ne.CONTENTS.length, e.isolate(this.offset(e), this.length()).unwrap(), this.savedLength = 0;
        break;
      }
      e = e.parent;
    }
  }
  value() {
    return "";
  }
};
_(ne, "blotName", "cursor"), _(ne, "className", "ql-cursor"), _(ne, "tagName", "span"), _(ne, "CONTENTS", "\uFEFF");
let ri = ne;
var Cp = { exports: {} };
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
    var b = e ? e + c : c;
    if (!this._events[b]) return !1;
    var w = this._events[b], v = arguments.length, k, A;
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
      for (A = 1, k = new Array(v - 1); A < v; A++)
        k[A - 1] = arguments[A];
      w.fn.apply(w.context, k);
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
            if (!k) for (T = 1, k = new Array(v - 1); T < v; T++)
              k[T - 1] = arguments[T];
            w[A].fn.apply(w[A].context, k);
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
      for (var b = 0, w = [], v = m.length; b < v; b++)
        (m[b].fn !== u || f && !m[b].once || h && m[b].context !== h) && w.push(m[b]);
      w.length ? this._events[p] = w.length === 1 ? w[0] : w : a(this, p);
    }
    return this;
  }, o.prototype.removeAllListeners = function(c) {
    var u;
    return c ? (u = e ? e + c : c, this._events[u] && a(this, u)) : (this._events = new n(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = e, o.EventEmitter = o, r.exports = o;
})(Cp);
var rx = Cp.exports;
const ix = /* @__PURE__ */ yp(rx), ic = /* @__PURE__ */ new WeakMap(), sc = ["error", "warn", "log", "info"];
let ac = "warn";
function Tp(r) {
  if (ac && sc.indexOf(r) <= sc.indexOf(ac)) {
    for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
      e[n - 1] = arguments[n];
    console[r](...e);
  }
}
function bn(r) {
  return sc.reduce((t, e) => (t[e] = Tp.bind(console, e, r), t), {});
}
bn.level = (r) => {
  ac = r;
};
Tp.level = bn.level;
const ol = bn("quill:events"), sx = ["selectionchange", "mousedown", "mouseup", "click"];
sx.forEach((r) => {
  document.addEventListener(r, function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    Array.from(document.querySelectorAll(".ql-container")).forEach((i) => {
      const s = ic.get(i);
      s && s.emitter && s.emitter.handleDOM(...e);
    });
  });
});
class z extends ix {
  constructor() {
    super(), this.domListeners = {}, this.on("error", ol.error);
  }
  emit() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return ol.log.call(ol, ...e), super.emit(...e);
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
const ll = bn("quill:selection");
class ar {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = t, this.length = e;
  }
}
class ax {
  constructor(t, e) {
    this.emitter = e, this.scroll = t, this.composing = !1, this.mouseDown = !1, this.root = this.scroll.domNode, this.cursor = this.scroll.create("cursor", this), this.savedRange = new ar(0, 0), this.lastRange = this.savedRange, this.lastNative = null, this.handleComposition(), this.handleDragging(), this.emitter.listenDOM("selectionchange", document, () => {
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
    return ll.info("getNativeRange", n), n;
  }
  getRange() {
    const t = this.scroll.domNode;
    if ("isConnected" in t && !t.isConnected)
      return [null, null];
    const e = this.getNativeRange();
    return e == null ? [null, null] : [this.normalizedToRange(e), e];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && cl(this.root, document.activeElement);
  }
  normalizedToRange(t) {
    const e = [[t.start.node, t.start.offset]];
    t.native.collapsed || e.push([t.end.node, t.end.offset]);
    const n = e.map((a) => {
      const [o, l] = a, c = this.scroll.find(o, !0), u = c.offset(this.scroll);
      return l === 0 ? u : c instanceof qt ? u + c.index(o, l) : u + c.length();
    }), i = Math.min(Math.max(...n), this.scroll.length() - 1), s = Math.min(i, ...n);
    return new ar(s, i - s);
  }
  normalizeNative(t) {
    if (!cl(this.root, t.startContainer) || !t.collapsed && !cl(this.root, t.endContainer))
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
    if (ll.info("setNativeRange", t, e, n, i), t != null && (this.root.parentNode == null || t.parentNode == null || // @ts-expect-error Fix me later
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
    if (typeof e == "string" && (n = e, e = !1), ll.info("setRange", t), t != null) {
      const i = this.rangeToNative(t);
      this.setNativeRange(...i, e);
    } else
      this.setNativeRange(null);
    this.update(n);
  }
  update() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : z.sources.USER;
    const e = this.lastRange, [n, i] = this.getRange();
    if (this.lastRange = n, this.lastNative = i, this.lastRange != null && (this.savedRange = this.lastRange), !ou(e, this.lastRange)) {
      if (!this.composing && i != null && i.native.collapsed && i.start.node !== this.cursor.textNode) {
        const a = this.cursor.restore();
        a && this.setNativeRange(a.startNode, a.startOffset, a.endNode, a.endOffset);
      }
      const s = [z.events.SELECTION_CHANGE, $r(this.lastRange), $r(e), t];
      this.emitter.emit(z.events.EDITOR_CHANGE, ...s), t !== z.sources.SILENT && this.emitter.emit(...s);
    }
  }
}
function cl(r, t) {
  try {
    t.parentNode;
  } catch {
    return !1;
  }
  return r.contains(t);
}
const ox = /^[ -~]*$/;
class lx {
  constructor(t) {
    this.scroll = t, this.delta = this.getDelta();
  }
  applyDelta(t) {
    this.scroll.update();
    let e = this.scroll.length();
    this.scroll.batchStart();
    const n = $d(t), i = new P();
    return ux(n.ops.slice()).reduce((a, o) => {
      const l = le.Op.length(o);
      let c = o.attributes || {}, u = !1, h = !1;
      if (o.insert != null) {
        if (i.retain(l), typeof o.insert == "string") {
          const m = o.insert;
          h = !m.endsWith(`
`) && (e <= a || !!this.scroll.descendant(oe, a)[0]), this.scroll.insertAt(a, m);
          const [b, w] = this.scroll.line(a);
          let v = Nn({}, ie(b));
          if (b instanceof Tt) {
            const [k] = b.descendant(qt, w);
            k && (v = Nn(v, ie(k)));
          }
          c = le.AttributeMap.diff(v, c) || {};
        } else if (typeof o.insert == "object") {
          const m = Object.keys(o.insert)[0];
          if (m == null) return a;
          const b = this.scroll.query(m, B.INLINE) != null;
          if (b)
            (e <= a || this.scroll.descendant(oe, a)[0]) && (h = !0);
          else if (a > 0) {
            const [w, v] = this.scroll.descendant(qt, a - 1);
            w instanceof Te ? w.value()[v] !== `
` && (u = !0) : w instanceof Zt && w.statics.scope === B.INLINE_BLOT && (u = !0);
          }
          if (this.scroll.insertAt(a, m, o.insert[m]), b) {
            const [w] = this.scroll.descendant(qt, a);
            if (w) {
              const v = Nn({}, ie(w));
              c = le.AttributeMap.diff(v, c) || {};
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
    }, 0), i.reduce((a, o) => typeof o.delete == "number" ? (this.scroll.deleteAt(a, o.delete), a) : a + le.Op.length(o), 0), this.scroll.batchEnd(), this.scroll.optimize(), this.update(n);
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
    const i = new P().retain(t).retain(e, $r(n));
    return this.update(i);
  }
  formatText(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(n).forEach((s) => {
      this.scroll.formatAt(t, e, s, n[s]);
    });
    const i = new P().retain(t).retain(e, $r(n));
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
      let c = ie(l);
      for (; Object.keys(c).length > 0; ) {
        const u = o.shift();
        if (u == null) return c;
        c = cx(ie(u), c);
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
      return n.length() >= i + e && !(i === 0 && e === s) ? as(n, i, e, !0) : as(this.scroll, t, e, !0);
    }
    return "";
  }
  getText(t, e) {
    return this.getContents(t, e).filter((n) => typeof n.insert == "string").map((n) => n.insert).join("");
  }
  insertContents(t, e) {
    const n = $d(e), i = new P().retain(t).concat(n);
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
    }), this.update(new P().retain(t).insert(e, $r(n)));
  }
  isBlank() {
    if (this.scroll.children.length === 0) return !0;
    if (this.scroll.children.length > 1) return !1;
    const t = this.scroll.children.head;
    if ((t == null ? void 0 : t.statics.blotName) !== Tt.blotName) return !1;
    const e = t;
    return e.children.length > 1 ? !1 : e.children.head instanceof Oe;
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
    e[0].target.data.match(ox) && this.scroll.find(e[0].target)) {
      const s = this.scroll.find(e[0].target), a = ie(s), o = s.offset(this.scroll), l = e[0].oldValue.replace(ri.CONTENTS, ""), c = new P().insert(l), u = new P().insert(s.value()), h = n && {
        oldRange: jd(n.oldRange, -o),
        newRange: jd(n.newRange, -o)
      };
      t = new P().retain(o).concat(c.diff(u, h)).reduce((p, m) => m.insert ? p.insert(m.insert, a) : p.push(m), new P()), this.delta = i.compose(t);
    } else
      this.delta = this.getDelta(), (!t || !ou(i.compose(t), this.delta)) && (t = i.diff(this.delta, n));
    return t;
  }
}
function qr(r, t, e) {
  if (r.length === 0) {
    const [p] = ul(e.pop());
    return t <= 0 ? `</li></${p}>` : `</li></${p}>${qr([], t - 1, e)}`;
  }
  const [{
    child: n,
    offset: i,
    length: s,
    indent: a,
    type: o
  }, ...l] = r, [c, u] = ul(o);
  if (a > t)
    return e.push(o), a === t + 1 ? `<${c}><li${u}>${as(n, i, s)}${qr(l, a, e)}` : `<${c}><li>${qr(r, t + 1, e)}`;
  const h = e[e.length - 1];
  if (a === t && o === h)
    return `</li><li${u}>${as(n, i, s)}${qr(l, a, e)}`;
  const [f] = ul(e.pop());
  return `</li></${f}>${qr(r, t - 1, e)}`;
}
function as(r, t, e) {
  let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if ("html" in r && typeof r.html == "function")
    return r.html(t, e);
  if (r instanceof Te)
    return Xa(r.value().slice(t, t + e)).replaceAll(" ", "&nbsp;");
  if (r instanceof ke) {
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
      }), qr(c, -1, []);
    }
    const i = [];
    if (r.children.forEachAt(t, e, (c, u, h) => {
      i.push(as(c, u, h));
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
function cx(r, t) {
  return Object.keys(t).reduce((e, n) => {
    if (r[n] == null) return e;
    const i = t[n];
    return i === r[n] ? e[n] = i : Array.isArray(i) ? i.indexOf(r[n]) < 0 ? e[n] = i.concat([r[n]]) : e[n] = i : e[n] = [i, r[n]], e;
  }, {});
}
function ul(r) {
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
function $d(r) {
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
function jd(r, t) {
  let {
    index: e,
    length: n
  } = r;
  return new ar(e + t, n);
}
function ux(r) {
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
class Ne {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = t, this.options = e;
  }
}
_(Ne, "DEFAULTS", {});
const Ks = "\uFEFF";
class pu extends Zt {
  constructor(t, e) {
    super(t, e), this.contentNode = document.createElement("span"), this.contentNode.setAttribute("contenteditable", "false"), Array.from(this.domNode.childNodes).forEach((n) => {
      this.contentNode.appendChild(n);
    }), this.leftGuard = document.createTextNode(Ks), this.rightGuard = document.createTextNode(Ks), this.domNode.appendChild(this.leftGuard), this.domNode.appendChild(this.contentNode), this.domNode.appendChild(this.rightGuard);
  }
  index(t, e) {
    return t === this.leftGuard ? 0 : t === this.rightGuard ? 1 : super.index(t, e);
  }
  restore(t) {
    let e = null, n;
    const i = t.data.split(Ks).join("");
    if (t === this.leftGuard)
      if (this.prev instanceof Te) {
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
    else t === this.rightGuard && (this.next instanceof Te ? (this.next.insertAt(0, i), e = {
      startNode: this.next.domNode,
      startOffset: i.length
    }) : (n = document.createTextNode(i), this.parent.insertBefore(this.scroll.create(n), this.next), e = {
      startNode: n,
      startOffset: i.length
    }));
    return t.data = Ks, e;
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
class dx {
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
    e && !(e instanceof pu) && (this.emitter.emit(z.events.COMPOSITION_BEFORE_START, t), this.scroll.batchStart(), this.emitter.emit(z.events.COMPOSITION_START, t), this.isComposing = !0);
  }
  handleCompositionEnd(t) {
    this.emitter.emit(z.events.COMPOSITION_BEFORE_END, t), this.scroll.batchEnd(), this.emitter.emit(z.events.COMPOSITION_END, t), this.isComposing = !1;
  }
}
const Xi = class Xi {
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
_(Xi, "DEFAULTS", {
  modules: {}
}), _(Xi, "themes", {
  default: Xi
});
let ii = Xi;
const hx = (r) => r.parentElement || r.getRootNode().host || null, fx = (r) => {
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
}, Fd = (r, t, e, n, i, s) => r < e && t > n ? 0 : r < e ? -(e - r + i) : t > n ? t - r > n - e ? r + i - e : t - n + s : 0, px = (r, t) => {
  var s, a, o;
  const e = r.ownerDocument;
  let n = t, i = r;
  for (; i; ) {
    const l = i === e.body, c = l ? {
      top: 0,
      right: ((s = window.visualViewport) == null ? void 0 : s.width) ?? e.documentElement.clientWidth,
      bottom: ((a = window.visualViewport) == null ? void 0 : a.height) ?? e.documentElement.clientHeight,
      left: 0
    } : fx(i), u = getComputedStyle(i), h = Fd(n.left, n.right, c.left, c.right, Qs(u.scrollPaddingLeft), Qs(u.scrollPaddingRight)), f = Fd(n.top, n.bottom, c.top, c.bottom, Qs(u.scrollPaddingTop), Qs(u.scrollPaddingBottom));
    if (h || f)
      if (l)
        (o = e.defaultView) == null || o.scrollBy(h, f);
      else {
        const {
          scrollLeft: p,
          scrollTop: m
        } = i;
        f && (i.scrollTop += f), h && (i.scrollLeft += h);
        const b = i.scrollLeft - p, w = i.scrollTop - m;
        n = {
          left: n.left - b,
          top: n.top - w,
          right: n.right - b,
          bottom: n.bottom - w
        };
      }
    i = l || u.position === "fixed" ? null : hx(i);
  }
}, gx = 100, mx = ["block", "break", "cursor", "inline", "scroll", "text"], bx = (r, t, e) => {
  const n = new ni();
  return mx.forEach((i) => {
    const s = t.query(i);
    s && n.register(s);
  }), r.forEach((i) => {
    let s = t.query(i);
    s || e.error(`Cannot register "${i}" specified in "formats" config. Are you sure it was registered?`);
    let a = 0;
    for (; s; )
      if (n.register(s), s = "blotName" in s ? s.requiredContainer ?? null : null, a += 1, a > gx) {
        e.error(`Cycle detected in registering blot requiredContainer: "${i}"`);
        break;
      }
  }), n;
}, Fr = bn("quill"), Xs = new ni();
ke.uiClass = "ql-ui";
const me = class me {
  static debug(t) {
    t === !0 && (t = "log"), bn.level(t);
  }
  static find(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    return ic.get(t) || Xs.find(t, e);
  }
  static import(t) {
    return this.imports[t] == null && Fr.error(`Cannot import ${t}. Are you sure it was registered?`), this.imports[t];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) != "string") {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = !!(!(arguments.length <= 1) && arguments[1]), n = "attrName" in t ? t.attrName : t.blotName;
      typeof n == "string" ? this.register(`formats/${n}`, t, e) : Object.keys(t).forEach((i) => {
        this.register(i, t[i], e);
      });
    } else {
      const t = arguments.length <= 0 ? void 0 : arguments[0], e = arguments.length <= 1 ? void 0 : arguments[1], n = !!(!(arguments.length <= 2) && arguments[2]);
      this.imports[t] != null && !n && Fr.warn(`Overwriting ${t} with`, e), this.imports[t] = e, (t.startsWith("blots/") || t.startsWith("formats/")) && e && typeof e != "boolean" && e.blotName !== "abstract" && Xs.register(e), typeof e.register == "function" && e.register(Xs);
    }
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.options = yx(t, e), this.container = this.options.container, this.container == null) {
      Fr.error("Invalid Quill container", t);
      return;
    }
    this.options.debug && me.debug(this.options.debug);
    const n = this.container.innerHTML.trim();
    this.container.classList.add("ql-container"), this.container.innerHTML = "", ic.set(this.container, this), this.root = this.addContainer("ql-editor"), this.root.classList.add("ql-blank"), this.emitter = new z();
    const i = cu.blotName, s = this.options.registry.query(i);
    if (!s || !("blotName" in s))
      throw new Error(`Cannot initialize Quill without "${i}" blot`);
    if (this.scroll = new s(this.options.registry, this.root, {
      emitter: this.emitter
    }), this.editor = new lx(this.scroll), this.selection = new ax(this.scroll, this.emitter), this.composition = new dx(this.scroll, this.emitter), this.theme = new this.options.theme(this, this.options), this.keyboard = this.theme.addModule("keyboard"), this.clipboard = this.theme.addModule("clipboard"), this.history = this.theme.addModule("history"), this.uploader = this.theme.addModule("uploader"), this.theme.addModule("input"), this.theme.addModule("uiNode"), this.theme.init(), this.emitter.on(z.events.EDITOR_CHANGE, (a) => {
      a === z.events.TEXT_CHANGE && this.root.classList.toggle("ql-blank", this.editor.isBlank());
    }), this.emitter.on(z.events.SCROLL_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), u = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      ge.call(this, () => this.editor.update(null, o, u), a);
    }), this.emitter.on(z.events.SCROLL_EMBED_UPDATE, (a, o) => {
      const l = this.selection.lastRange, [c] = this.selection.getRange(), u = l && c ? {
        oldRange: l,
        newRange: c
      } : void 0;
      ge.call(this, () => {
        const h = new P().retain(a.offset(this)).retain({
          [a.statics.blotName]: o
        });
        return this.editor.update(h, [], u);
      }, me.sources.USER);
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
    return [t, e, , n] = un(t, e, n), ge.call(this, () => this.editor.deleteText(t, e), n, t, -1 * e);
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
    return ge.call(this, () => {
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
    return [t, e, a, s] = un(
      t,
      e,
      // @ts-expect-error
      n,
      i,
      s
    ), ge.call(this, () => this.editor.formatLine(t, e, a), s, t, 0);
  }
  formatText(t, e, n, i, s) {
    let a;
    return [t, e, a, s] = un(
      // @ts-expect-error
      t,
      e,
      n,
      i,
      s
    ), ge.call(this, () => this.editor.formatText(t, e, a), s, t, 0);
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
    return [t, e] = un(t, e), this.editor.getContents(t, e);
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
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = un(t, e), this.editor.getHTML(t, e);
  }
  getText() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 ? arguments[1] : void 0;
    return typeof t == "number" && (e = e ?? this.getLength() - t), [t, e] = un(t, e), this.editor.getText(t, e);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(t, e, n) {
    let i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : me.sources.API;
    return ge.call(this, () => this.editor.insertEmbed(t, e, n), i, t);
  }
  insertText(t, e, n, i, s) {
    let a;
    return [t, , a, s] = un(t, 0, n, i, s), ge.call(this, () => this.editor.insertText(t, e, a), s, t, e.length);
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
    return [t, e, , n] = un(t, e, n), ge.call(this, () => this.editor.removeFormat(t, e), n, t);
  }
  scrollRectIntoView(t) {
    px(this.root, t);
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
    return ge.call(this, () => {
      t = new P(t);
      const n = this.getLength(), i = this.editor.deleteText(0, n), s = this.editor.insertContents(0, t), a = this.editor.deleteText(this.getLength() - 1, 1);
      return i.compose(s).compose(a);
    }, e);
  }
  setSelection(t, e, n) {
    t == null ? this.selection.setRange(null, e || me.sources.API) : ([t, e, , n] = un(t, e, n), this.selection.setRange(new ar(Math.max(0, t), e), n), n !== z.sources.SILENT && this.scrollSelectionIntoView());
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
    return ge.call(this, () => (t = new P(t), this.editor.applyDelta(t)), e, !0);
  }
};
_(me, "DEFAULTS", {
  bounds: null,
  modules: {
    clipboard: !0,
    keyboard: !0,
    history: !0,
    uploader: !0
  },
  placeholder: "",
  readOnly: !1,
  registry: Xs,
  theme: "default"
}), _(me, "events", z.events), _(me, "sources", z.sources), _(me, "version", "2.0.3"), _(me, "imports", {
  delta: P,
  parchment: Fw,
  "core/module": Ne,
  "core/theme": ii
});
let I = me;
function Hd(r) {
  return typeof r == "string" ? document.querySelector(r) : r;
}
function dl(r) {
  return Object.entries(r ?? {}).reduce((t, e) => {
    let [n, i] = e;
    return {
      ...t,
      [n]: i === !0 ? {} : i
    };
  }, {});
}
function Ud(r) {
  return Object.fromEntries(Object.entries(r).filter((t) => t[1] !== void 0));
}
function yx(r, t) {
  const e = Hd(r);
  if (!e)
    throw new Error("Invalid Quill container");
  const i = !t.theme || t.theme === I.DEFAULTS.theme ? ii : I.import(`themes/${t.theme}`);
  if (!i)
    throw new Error(`Invalid theme ${t.theme}. Did you register it?`);
  const {
    modules: s,
    ...a
  } = I.DEFAULTS, {
    modules: o,
    ...l
  } = i.DEFAULTS;
  let c = dl(t.modules);
  c != null && c.toolbar && c.toolbar.constructor !== Object && (c = {
    ...c,
    toolbar: {
      container: c.toolbar
    }
  });
  const u = Nn({}, dl(s), dl(o), c), h = {
    ...a,
    ...Ud(l),
    ...Ud(t)
  };
  let f = t.registry;
  return f ? t.formats && Fr.warn('Ignoring "formats" option because "registry" is specified') : f = t.formats ? bx(t.formats, h.registry, Fr) : h.registry, {
    ...h,
    registry: f,
    container: e,
    theme: i,
    modules: Object.entries(u).reduce((p, m) => {
      let [b, w] = m;
      if (!w) return p;
      const v = I.import(`modules/${b}`);
      return v == null ? (Fr.error(`Cannot load ${b} module. Are you sure you registered it?`), p) : {
        ...p,
        // @ts-expect-error
        [b]: Nn({}, v.DEFAULTS || {}, w)
      };
    }, {}),
    bounds: Hd(h.bounds)
  };
}
function ge(r, t, e, n) {
  if (!this.isEnabled() && t === z.sources.USER && !this.allowReadOnlyEdits)
    return new P();
  let i = e == null ? null : this.getSelection();
  const s = this.editor.delta, a = r();
  if (i != null && (e === !0 && (e = i.index), n == null ? i = Vd(i, a, t) : n !== 0 && (i = Vd(i, e, n, t)), this.setSelection(i, z.sources.SILENT)), a.length() > 0) {
    const o = [z.events.TEXT_CHANGE, a, s, t];
    this.emitter.emit(z.events.EDITOR_CHANGE, ...o), t !== z.sources.SILENT && this.emitter.emit(...o);
  }
  return a;
}
function un(r, t, e, n, i) {
  let s = {};
  return typeof r.index == "number" && typeof r.length == "number" ? typeof t != "number" ? (i = n, n = e, e = t, t = r.length, r = r.index) : (t = r.length, r = r.index) : typeof t != "number" && (i = n, n = e, e = t, t = 0), typeof e == "object" ? (s = e, i = n) : typeof e == "string" && (n != null ? s[e] = n : i = e), i = i || z.sources.API, [r, t, s, i];
}
function Vd(r, t, e, n) {
  const i = typeof e == "number" ? e : 0;
  if (r == null) return null;
  let s, a;
  return t && typeof t.transformPosition == "function" ? [s, a] = [r.index, r.index + r.length].map((o) => (
    // @ts-expect-error -- TODO: add a better type guard around `index`
    t.transformPosition(o, n !== z.sources.USER)
  )) : [s, a] = [r.index, r.index + r.length].map((o) => o < t || o === t && n === z.sources.USER ? o : i >= 0 ? o + i : Math.max(t, o + i)), new ar(s, a - s);
}
class hr extends Wa {
}
function Yd(r) {
  return r instanceof Tt || r instanceof oe;
}
function Wd(r) {
  return typeof r.updateContent == "function";
}
class _r extends cu {
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
      if (n instanceof oe || s instanceof oe) {
        this.optimize();
        return;
      }
      const a = s.children.head instanceof Oe ? null : s.children.head;
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
      const l = s.type === "block" && (s.delta.length() === 0 || !this.descendant(oe, t)[0] && t < this.length()), c = s.type === "block" ? s.delta : new P().insert({
        [s.key]: s.value
      });
      hl(this, t, c);
      const u = s.type === "block" ? 1 : 0, h = t + c.length() + u;
      l && this.insertAt(h - 1, `
`);
      const f = ie(this.line(t)[0]), p = le.AttributeMap.diff(f, s.attributes) || {};
      Object.keys(p).forEach((m) => {
        this.formatAt(h - 1, 1, m, p[m]);
      }), t = h;
    }
    let [a, o] = this.children.find(t);
    if (n.length && (a && (a = a.split(o), o = 0), n.forEach((l) => {
      if (l.type === "block") {
        const c = this.createBlock(l.attributes, a || void 0);
        hl(c, 0, l.delta);
      } else {
        const c = this.create(l.key, l.value);
        this.insertBefore(c, a || void 0), Object.keys(l.attributes).forEach((u) => {
          c.format(u, l.attributes[u]);
        });
      }
    })), i.type === "block" && i.delta.length()) {
      const l = a ? a.offset(a.scroll) + o : this.length();
      hl(this, l, i.delta);
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
    return t === this.length() ? this.line(t - 1) : this.descendant(Yd, t);
  }
  lines() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const n = (i, s, a) => {
      let o = [], l = a;
      return i.children.forEachAt(s, a, (c, u, h) => {
        Yd(c) ? o.push(c) : c instanceof Wa && (o = o.concat(n(c, u, l))), l -= h;
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
      return s && !Wd(s);
    }), t.length > 0 && this.emitter.emit(z.events.SCROLL_BEFORE_UPDATE, e, t), super.update(t.concat([])), t.length > 0 && this.emitter.emit(z.events.SCROLL_UPDATE, e, t);
  }
  updateEmbedAt(t, e, n) {
    const [i] = this.descendant((s) => s instanceof oe, t);
    i && i.statics.blotName === e && Wd(i) && i.updateContent(n);
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
_(_r, "blotName", "scroll"), _(_r, "className", "ql-editor"), _(_r, "tagName", "DIV"), _(_r, "defaultChild", Tt), _(_r, "allowedChildren", [Tt, oe, hr]);
function hl(r, t, e) {
  e.reduce((n, i) => {
    const s = le.Op.length(i);
    let a = i.attributes || {};
    if (i.insert != null) {
      if (typeof i.insert == "string") {
        const o = i.insert;
        r.insertAt(n, o);
        const [l] = r.descendant(qt, n), c = ie(l);
        a = le.AttributeMap.diff(c, a) || {};
      } else if (typeof i.insert == "object") {
        const o = Object.keys(i.insert)[0];
        if (o == null) return n;
        if (r.insertAt(n, o, i.insert[o]), r.scroll.query(o, B.INLINE) != null) {
          const [c] = r.descendant(qt, n), u = ie(c);
          a = le.AttributeMap.diff(u, a) || {};
        }
      }
    }
    return Object.keys(a).forEach((o) => {
      r.formatAt(n, s, o, a[o]);
    }), n + s;
  }, t);
}
const gu = {
  scope: B.BLOCK,
  whitelist: ["right", "center", "justify"]
}, vx = new Qe("align", "align", gu), Lp = new Ie("align", "ql-align", gu), Dp = new $n("align", "text-align", gu);
class Ip extends $n {
  value(t) {
    let e = super.value(t);
    return e.startsWith("rgb(") ? (e = e.replace(/^[^\d]+/, "").replace(/[^\d]+$/, ""), `#${e.split(",").map((i) => `00${parseInt(i, 10).toString(16)}`.slice(-2)).join("")}`) : e;
  }
}
const wx = new Ie("color", "ql-color", {
  scope: B.INLINE
}), mu = new Ip("color", "color", {
  scope: B.INLINE
}), xx = new Ie("background", "ql-bg", {
  scope: B.INLINE
}), bu = new Ip("background", "background-color", {
  scope: B.INLINE
});
class fr extends hr {
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
${Xa(this.code(t, e))}
</pre>`;
  }
}
class _t extends Tt {
  static register() {
    I.register(fr);
  }
}
_(_t, "TAB", "  ");
class yu extends Xe {
}
yu.blotName = "code";
yu.tagName = "CODE";
_t.blotName = "code-block";
_t.className = "ql-code-block";
_t.tagName = "DIV";
fr.blotName = "code-block-container";
fr.className = "ql-code-block-container";
fr.tagName = "DIV";
fr.allowedChildren = [_t];
_t.allowedChildren = [Te, Oe, ri];
_t.requiredContainer = fr;
const vu = {
  scope: B.BLOCK,
  whitelist: ["rtl"]
}, Op = new Qe("direction", "dir", vu), Np = new Ie("direction", "ql-direction", vu), Mp = new $n("direction", "direction", vu), qp = {
  scope: B.INLINE,
  whitelist: ["serif", "monospace"]
}, _p = new Ie("font", "ql-font", qp);
class kx extends $n {
  value(t) {
    return super.value(t).replace(/["']/g, "");
  }
}
const Rp = new kx("font", "font-family", qp), zp = new Ie("size", "ql-size", {
  scope: B.INLINE,
  whitelist: ["small", "large", "huge"]
}), Pp = new $n("size", "font-size", {
  scope: B.INLINE,
  whitelist: ["10px", "18px", "32px"]
}), Sx = bn("quill:keyboard"), Ax = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
class Za extends Ne {
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
    const i = Cx(t);
    if (i == null) {
      Sx.warn("Attempted to add invalid keyboard binding", i);
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
      const i = (this.bindings[t.key] || []).concat(this.bindings[t.which] || []).filter((v) => Za.match(t, v));
      if (i.length === 0) return;
      const s = I.find(t.target, !0);
      if (s && s.scroll !== this.quill.scroll) return;
      const a = this.quill.getSelection();
      if (a == null || !this.quill.hasFocus()) return;
      const [o, l] = this.quill.getLine(a.index), [c, u] = this.quill.getLeaf(a.index), [h, f] = a.length === 0 ? [c, u] : this.quill.getLeaf(a.index + a.length), p = c instanceof Aa ? c.value().slice(0, u) : "", m = h instanceof Aa ? h.value().slice(f) : "", b = {
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
          if (v.format.every((k) => b.format[k] == null))
            return !1;
        } else if (typeof v.format == "object" && !Object.keys(v.format).every((k) => v.format[k] === !0 ? b.format[k] != null : v.format[k] === !1 ? b.format[k] == null : ou(v.format[k], b.format[k])))
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
        const c = s.formats(), u = this.quill.getFormat(t.index - 1, 1);
        if (i = le.AttributeMap.diff(c, u) || {}, Object.keys(i).length > 0) {
          const h = new P().retain(t.index + s.length() - 2).retain(1, i);
          a = a.compose(h);
        }
      }
    }
    this.quill.updateContents(a, I.sources.USER), this.quill.focus();
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
        i = le.AttributeMap.diff(l, c) || {}, Object.keys(i).length > 0 && (a = a.retain(o.length() - 1).retain(1, i));
      }
    }
    this.quill.updateContents(a, I.sources.USER), this.quill.focus();
  }
  handleDeleteRange(t) {
    wu({
      range: t,
      quill: this.quill
    }), this.quill.focus();
  }
  handleEnter(t, e) {
    const n = Object.keys(e.format).reduce((s, a) => (this.quill.scroll.query(a, B.BLOCK) && !Array.isArray(e.format[a]) && (s[a] = e.format[a]), s), {}), i = new P().retain(t.index).delete(t.length).insert(`
`, n);
    this.quill.updateContents(i, I.sources.USER), this.quill.setSelection(t.index + 1, I.sources.SILENT), this.quill.focus();
  }
}
const Ex = {
  bindings: {
    bold: fl("bold"),
    italic: fl("italic"),
    underline: fl("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "+1", I.sources.USER), !1);
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: !0,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(r, t) {
        return t.collapsed && t.offset !== 0 ? !0 : (this.quill.format("indent", "-1", I.sources.USER), !1);
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
        t.format.indent != null ? this.quill.format("indent", "-1", I.sources.USER) : t.format.list != null && this.quill.format("list", !1, I.sources.USER);
      }
    },
    "indent code-block": Gd(!0),
    "outdent code-block": Gd(!1),
    "remove tab": {
      key: "Tab",
      shiftKey: !0,
      collapsed: !0,
      prefix: /\t$/,
      handler(r) {
        this.quill.deleteText(r.index - 1, 1, I.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(r, t) {
        if (t.format.table) return !0;
        this.quill.history.cutoff();
        const e = new P().retain(r.index).delete(r.length).insert("	");
        return this.quill.updateContents(e, I.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index + 1, I.sources.SILENT), !1;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: !0,
      format: ["blockquote"],
      empty: !0,
      handler() {
        this.quill.format("blockquote", !1, I.sources.USER);
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
        t.format.indent && (e.indent = !1), this.quill.formatLine(r.index, r.length, e, I.sources.USER);
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
        this.quill.updateContents(i, I.sources.USER), this.quill.setSelection(r.index + 1, I.sources.SILENT), this.quill.scrollSelectionIntoView();
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
        this.quill.updateContents(i, I.sources.USER), this.quill.setSelection(r.index + 1, I.sources.SILENT), this.quill.scrollSelectionIntoView();
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
          const [e, n, i, s] = t.getTable(r), a = Tx(e, n, i, s);
          if (a == null) return;
          let o = e.offset();
          if (a < 0) {
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, I.sources.USER), this.quill.setSelection(r.index + 1, r.length, I.sources.SILENT);
          } else if (a > 0) {
            o += e.length();
            const l = new P().retain(o).insert(`
`);
            this.quill.updateContents(l, I.sources.USER), this.quill.setSelection(o, I.sources.USER);
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
        e.shiftKey ? this.quill.setSelection(i - 1, I.sources.USER) : this.quill.setSelection(i + n.length(), I.sources.USER);
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
        this.quill.insertText(r.index, " ", I.sources.USER), this.quill.history.cutoff();
        const a = new P().retain(r.index - i).delete(e + 1).retain(n.length() - 2 - i).retain(1, {
          list: s
        });
        return this.quill.updateContents(a, I.sources.USER), this.quill.history.cutoff(), this.quill.setSelection(r.index - e, I.sources.SILENT), !1;
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
            return this.quill.updateContents(s, I.sources.USER), this.quill.setSelection(r.index - 1, I.sources.SILENT), !1;
          }
        return !0;
      }
    },
    "embed left": Zs("ArrowLeft", !1),
    "embed left shift": Zs("ArrowLeft", !0),
    "embed right": Zs("ArrowRight", !1),
    "embed right shift": Zs("ArrowRight", !0),
    "table down": Kd(!1),
    "table up": Kd(!0)
  }
};
Za.DEFAULTS = Ex;
function Gd(r) {
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
        this.quill.insertText(t.index, s, I.sources.USER), this.quill.setSelection(t.index + s.length, I.sources.SILENT);
        return;
      }
      const a = t.length === 0 ? this.quill.getLines(t.index, 1) : this.quill.getLines(t);
      let {
        index: o,
        length: l
      } = t;
      a.forEach((c, u) => {
        r ? (c.insertAt(0, s), u === 0 ? o += s.length : l += s.length) : c.domNode.textContent.startsWith(s) && (c.deleteAt(0, s.length), u === 0 ? o -= s.length : l -= s.length);
      }), this.quill.update(I.sources.USER), this.quill.setSelection(o, l, I.sources.SILENT);
    }
  };
}
function Zs(r, t) {
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
      return s instanceof Zt ? (r === "ArrowLeft" ? t ? this.quill.setSelection(n.index - 1, n.length + 1, I.sources.USER) : this.quill.setSelection(n.index - 1, I.sources.USER) : t ? this.quill.setSelection(n.index, n.length + 1, I.sources.USER) : this.quill.setSelection(n.index + n.length + 1, I.sources.USER), !1) : !0;
    }
  };
}
function fl(r) {
  return {
    key: r[0],
    shortKey: !0,
    handler(t, e) {
      this.quill.format(r, !e.format[r], I.sources.USER);
    }
  };
}
function Kd(r) {
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
          this.quill.setSelection(l, 0, I.sources.USER);
        }
      } else {
        const a = i.table()[n];
        a != null && (r ? this.quill.setSelection(a.offset(this.quill.scroll) + a.length() - 1, 0, I.sources.USER) : this.quill.setSelection(a.offset(this.quill.scroll), 0, I.sources.USER));
      }
      return !1;
    }
  };
}
function Cx(r) {
  if (typeof r == "string" || typeof r == "number")
    r = {
      key: r
    };
  else if (typeof r == "object")
    r = $r(r);
  else
    return null;
  return r.shortKey && (r[Ax] = r.shortKey, delete r.shortKey), r;
}
function wu(r) {
  let {
    quill: t,
    range: e
  } = r;
  const n = t.getLines(e);
  let i = {};
  if (n.length > 1) {
    const s = n[0].formats(), a = n[n.length - 1].formats();
    i = le.AttributeMap.diff(a, s) || {};
  }
  t.deleteText(e, I.sources.USER), Object.keys(i).length > 0 && t.formatLine(e.index, 1, i, I.sources.USER), t.setSelection(e.index, I.sources.SILENT);
}
function Tx(r, t, e, n) {
  return t.prev == null && t.next == null ? e.prev == null && e.next == null ? n === 0 ? -1 : 1 : e.prev == null ? -1 : 1 : t.prev == null ? -1 : t.next == null ? 1 : null;
}
const Lx = /font-weight:\s*normal/, Dx = ["P", "OL", "UL"], Qd = (r) => r && Dx.includes(r.tagName), Ix = (r) => {
  Array.from(r.querySelectorAll("br")).filter((t) => Qd(t.previousElementSibling) && Qd(t.nextElementSibling)).forEach((t) => {
    var e;
    (e = t.parentNode) == null || e.removeChild(t);
  });
}, Ox = (r) => {
  Array.from(r.querySelectorAll('b[style*="font-weight"]')).filter((t) => {
    var e;
    return (e = t.getAttribute("style")) == null ? void 0 : e.match(Lx);
  }).forEach((t) => {
    var n;
    const e = r.createDocumentFragment();
    e.append(...t.childNodes), (n = t.parentNode) == null || n.replaceChild(e, t);
  });
};
function Nx(r) {
  r.querySelector('[id^="docs-internal-guid-"]') && (Ox(r), Ix(r));
}
const Mx = /\bmso-list:[^;]*ignore/i, qx = /\bmso-list:[^;]*\bl(\d+)/i, _x = /\bmso-list:[^;]*\blevel(\d+)/i, Rx = (r, t) => {
  const e = r.getAttribute("style"), n = e == null ? void 0 : e.match(qx);
  if (!n)
    return null;
  const i = Number(n[1]), s = e == null ? void 0 : e.match(_x), a = s ? Number(s[1]) : 1, o = new RegExp(`@list l${i}:level${a}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i"), l = t.match(o), c = l && l[1] === "bullet" ? "bullet" : "ordered";
  return {
    id: i,
    indent: a,
    type: c,
    element: r
  };
}, zx = (r) => {
  var a, o;
  const t = Array.from(r.querySelectorAll("[style*=mso-list]")), e = [], n = [];
  t.forEach((l) => {
    (l.getAttribute("style") || "").match(Mx) ? e.push(l) : n.push(l);
  }), e.forEach((l) => {
    var c;
    return (c = l.parentNode) == null ? void 0 : c.removeChild(l);
  });
  const i = r.documentElement.innerHTML, s = n.map((l) => Rx(l, i)).filter((l) => l);
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
function Px(r) {
  r.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word" && zx(r);
}
const Bx = [Px, Nx], $x = (r) => {
  r.documentElement && Bx.forEach((t) => {
    t(r);
  });
}, jx = bn("quill:clipboard"), Fx = [[Node.TEXT_NODE, tk], [Node.TEXT_NODE, Zd], ["br", Wx], [Node.ELEMENT_NODE, Zd], [Node.ELEMENT_NODE, Yx], [Node.ELEMENT_NODE, Vx], [Node.ELEMENT_NODE, Zx], ["li", Qx], ["ol, ul", Xx], ["pre", Gx], ["tr", Jx], ["b", pl("bold")], ["i", pl("italic")], ["strike", pl("strike")], ["style", Kx]], Hx = [vx, Op].reduce((r, t) => (r[t.keyName] = t, r), {}), Xd = [Dp, bu, mu, Mp, Rp, Pp].reduce((r, t) => (r[t.keyName] = t, r), {});
class Bp extends Ne {
  constructor(t, e) {
    super(t, e), this.quill.root.addEventListener("copy", (n) => this.onCaptureCopy(n, !1)), this.quill.root.addEventListener("cut", (n) => this.onCaptureCopy(n, !0)), this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this)), this.matchers = [], Fx.concat(this.options.matchers ?? []).forEach((n) => {
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
    $x(t);
  }
  convertHTML(t) {
    const e = new DOMParser().parseFromString(t, "text/html");
    this.normalizeHTML(e);
    const n = e.body, i = /* @__PURE__ */ new WeakMap(), [s, a] = this.prepareMatching(n, i);
    return xu(this.quill.scroll, n, s, a, i);
  }
  dangerouslyPasteHTML(t, e) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : I.sources.API;
    if (typeof t == "string") {
      const i = this.convert({
        html: t,
        text: ""
      });
      this.quill.setContents(i, e), this.quill.setSelection(0, I.sources.SILENT);
    } else {
      const i = this.convert({
        html: e,
        text: ""
      });
      this.quill.updateContents(new P().retain(t).concat(i), n), this.quill.setSelection(t + i.length(), I.sources.SILENT);
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
    (a = t.clipboardData) == null || a.setData("text/plain", s), (o = t.clipboardData) == null || o.setData("text/html", i), e && wu({
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
    jx.log("onPaste", a, {
      text: n,
      html: i
    });
    const o = new P().retain(t.index).delete(t.length).concat(a);
    this.quill.updateContents(o, I.sources.USER), this.quill.setSelection(o.length() - t.length, I.sources.SILENT), this.quill.scrollSelectionIntoView();
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
_(Bp, "DEFAULTS", {
  matchers: []
});
function pr(r, t, e, n) {
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
function In(r, t) {
  if (!(r instanceof Element)) return !1;
  const e = t.query(r);
  return e && e.prototype instanceof Zt ? !1 : ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(r.tagName.toLowerCase());
}
function Ux(r, t) {
  return r.previousElementSibling && r.nextElementSibling && !In(r.previousElementSibling, t) && !In(r.nextElementSibling, t);
}
const Js = /* @__PURE__ */ new WeakMap();
function $p(r) {
  return r == null ? !1 : (Js.has(r) || (r.tagName === "PRE" ? Js.set(r, !0) : Js.set(r, $p(r.parentNode))), Js.get(r));
}
function xu(r, t, e, n, i) {
  return t.nodeType === t.TEXT_NODE ? n.reduce((s, a) => a(t, s, r), new P()) : t.nodeType === t.ELEMENT_NODE ? Array.from(t.childNodes || []).reduce((s, a) => {
    let o = xu(r, a, e, n, i);
    return a.nodeType === t.ELEMENT_NODE && (o = e.reduce((l, c) => c(a, l, r), o), o = (i.get(a) || []).reduce((l, c) => c(a, l, r), o)), s.concat(o);
  }, new P()) : new P();
}
function pl(r) {
  return (t, e, n) => pr(e, r, !0, n);
}
function Vx(r, t, e) {
  const n = Qe.keys(r), i = Ie.keys(r), s = $n.keys(r), a = {};
  return n.concat(i).concat(s).forEach((o) => {
    let l = e.query(o, B.ATTRIBUTE);
    l != null && (a[l.attrName] = l.value(r), a[l.attrName]) || (l = Hx[o], l != null && (l.attrName === o || l.keyName === o) && (a[l.attrName] = l.value(r) || void 0), l = Xd[o], l != null && (l.attrName === o || l.keyName === o) && (l = Xd[o], a[l.attrName] = l.value(r) || void 0));
  }), Object.entries(a).reduce((o, l) => {
    let [c, u] = l;
    return pr(o, c, u, e);
  }, t);
}
function Yx(r, t, e) {
  const n = e.query(r);
  if (n == null) return t;
  if (n.prototype instanceof Zt) {
    const i = {}, s = n.value(r);
    if (s != null)
      return i[n.blotName] = s, new P().insert(i, n.formats(r, e));
  } else if (n.prototype instanceof is && !ms(t, `
`) && t.insert(`
`), "blotName" in n && "formats" in n && typeof n.formats == "function")
    return pr(t, n.blotName, n.formats(r, e), e);
  return t;
}
function Wx(r, t) {
  return ms(t, `
`) || t.insert(`
`), t;
}
function Gx(r, t, e) {
  const n = e.query("code-block"), i = n && "formats" in n && typeof n.formats == "function" ? n.formats(r, e) : !0;
  return pr(t, "code-block", i, e);
}
function Kx() {
  return new P();
}
function Qx(r, t, e) {
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
function Xx(r, t, e) {
  const n = r;
  let i = n.tagName === "OL" ? "ordered" : "bullet";
  const s = n.getAttribute("data-checked");
  return s && (i = s === "true" ? "checked" : "unchecked"), pr(t, "list", i, e);
}
function Zd(r, t, e) {
  if (!ms(t, `
`)) {
    if (In(r, e) && (r.childNodes.length > 0 || r instanceof HTMLParagraphElement))
      return t.insert(`
`);
    if (t.length() > 0 && r.nextSibling) {
      let n = r.nextSibling;
      for (; n != null; ) {
        if (In(n, e))
          return t.insert(`
`);
        const i = e.query(n);
        if (i && i.prototype instanceof oe)
          return t.insert(`
`);
        n = n.firstChild;
      }
    }
  }
  return t;
}
function Zx(r, t, e) {
  var s;
  const n = {}, i = r.style || {};
  return i.fontStyle === "italic" && (n.italic = !0), i.textDecoration === "underline" && (n.underline = !0), i.textDecoration === "line-through" && (n.strike = !0), ((s = i.fontWeight) != null && s.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(i.fontWeight, 10) >= 700) && (n.bold = !0), t = Object.entries(n).reduce((a, o) => {
    let [l, c] = o;
    return pr(a, l, c, e);
  }, t), parseFloat(i.textIndent || 0) > 0 ? new P().insert("	").concat(t) : t;
}
function Jx(r, t, e) {
  var i, s;
  const n = ((i = r.parentElement) == null ? void 0 : i.tagName) === "TABLE" ? r.parentElement : (s = r.parentElement) == null ? void 0 : s.parentElement;
  if (n != null) {
    const o = Array.from(n.querySelectorAll("tr")).indexOf(r) + 1;
    return pr(t, "table", o, e);
  }
  return t;
}
function tk(r, t, e) {
  var i;
  let n = r.data;
  if (((i = r.parentElement) == null ? void 0 : i.tagName) === "O:P")
    return t.insert(n.trim());
  if (!$p(r)) {
    if (n.trim().length === 0 && n.includes(`
`) && !Ux(r, e))
      return t;
    n = n.replace(/[^\S\u00a0]/g, " "), n = n.replace(/ {2,}/g, " "), (r.previousSibling == null && r.parentElement != null && In(r.parentElement, e) || r.previousSibling instanceof Element && In(r.previousSibling, e)) && (n = n.replace(/^ /, "")), (r.nextSibling == null && r.parentElement != null && In(r.parentElement, e) || r.nextSibling instanceof Element && In(r.nextSibling, e)) && (n = n.replace(/ $/, "")), n = n.replaceAll(" ", " ");
  }
  return t.insert(n);
}
class jp extends Ne {
  constructor(e, n) {
    super(e, n);
    _(this, "lastRecorded", 0);
    _(this, "ignoreChange", !1);
    _(this, "stack", {
      undo: [],
      redo: []
    });
    _(this, "currentRange", null);
    this.quill.on(I.events.EDITOR_CHANGE, (i, s, a, o) => {
      i === I.events.SELECTION_CHANGE ? s && o !== I.sources.SILENT && (this.currentRange = s) : i === I.events.TEXT_CHANGE && (this.ignoreChange || (!this.options.userOnly || o === I.sources.USER ? this.record(s, a) : this.transform(s)), this.currentRange = oc(this.currentRange, s));
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
      range: oc(i.range, a)
    }), this.lastRecorded = 0, this.ignoreChange = !0, this.quill.updateContents(i.delta, I.sources.USER), this.ignoreChange = !1, this.restoreSelection(i);
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
    Jd(this.stack.undo, e), Jd(this.stack.redo, e);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(e) {
    if (e.range)
      this.quill.setSelection(e.range, I.sources.USER);
    else {
      const n = nk(this.quill.scroll, e.delta);
      this.quill.setSelection(n, I.sources.USER);
    }
  }
}
_(jp, "DEFAULTS", {
  delay: 1e3,
  maxStack: 100,
  userOnly: !1
});
function Jd(r, t) {
  let e = t;
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = r[n];
    r[n] = {
      delta: e.transform(i.delta, !0),
      range: i.range && oc(i.range, e)
    }, e = i.delta.transform(e), r[n].delta.length() === 0 && r.splice(n, 1);
  }
}
function ek(r, t) {
  const e = t.ops[t.ops.length - 1];
  return e == null ? !1 : e.insert != null ? typeof e.insert == "string" && e.insert.endsWith(`
`) : e.attributes != null ? Object.keys(e.attributes).some((n) => r.query(n, B.BLOCK) != null) : !1;
}
function nk(r, t) {
  const e = t.reduce((i, s) => i + (s.delete || 0), 0);
  let n = t.length() - e;
  return ek(r, t) && (n -= 1), n;
}
function oc(r, t) {
  if (!r) return r;
  const e = t.transformPosition(r.index), n = t.transformPosition(r.index + r.length);
  return {
    index: e,
    length: n - e
  };
}
class Fp extends Ne {
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
Fp.DEFAULTS = {
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
const rk = ["insertText", "insertReplacementText"];
class ik extends Ne {
  constructor(t, e) {
    super(t, e), t.root.addEventListener("beforeinput", (n) => {
      this.handleBeforeInput(n);
    }), /Android/i.test(navigator.userAgent) || t.on(I.events.COMPOSITION_BEFORE_START, () => {
      this.handleCompositionStart();
    });
  }
  deleteRange(t) {
    wu({
      range: t,
      quill: this.quill
    });
  }
  replaceText(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (t.length === 0) return !1;
    if (e) {
      const n = this.quill.getFormat(t.index, 1);
      this.deleteRange(t), this.quill.updateContents(new P().retain(t.index).insert(e, n), I.sources.USER);
    } else
      this.deleteRange(t);
    return this.quill.setSelection(t.index + e.length, 0, I.sources.SILENT), !0;
  }
  handleBeforeInput(t) {
    if (this.quill.composition.isComposing || t.defaultPrevented || !rk.includes(t.inputType))
      return;
    const e = t.getTargetRanges ? t.getTargetRanges()[0] : null;
    if (!e || e.collapsed === !0)
      return;
    const n = sk(t);
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
function sk(r) {
  var t;
  return typeof r.data == "string" ? r.data : (t = r.dataTransfer) != null && t.types.includes("text/plain") ? r.dataTransfer.getData("text/plain") : null;
}
const ak = /Mac/i.test(navigator.platform), ok = 100, lk = (r) => !!(r.key === "ArrowLeft" || r.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
r.key === "ArrowUp" || r.key === "ArrowDown" || r.key === "Home" || ak && r.key === "a" && r.ctrlKey === !0);
class ck extends Ne {
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
        if (!(i instanceof ke) || !i.uiNode)
          return !0;
        const a = getComputedStyle(i.domNode).direction === "rtl";
        return a && s.key !== "ArrowRight" || !a && s.key !== "ArrowLeft" ? !0 : (this.quill.setSelection(e.index - 1, e.length + (s.shiftKey ? 1 : 0), I.sources.USER), !1);
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (e) => {
      !e.defaultPrevented && lk(e) && this.ensureListeningToSelectionChange();
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    if (this.selectionChangeDeadline = Date.now() + ok, this.isListening) return;
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
    if (!(i instanceof ke) || !i.uiNode) return;
    const s = document.createRange();
    s.setStartAfter(i.uiNode), s.setEndAfter(i.uiNode), e.removeAllRanges(), e.addRange(s);
  }
}
I.register({
  "blots/block": Tt,
  "blots/block/embed": oe,
  "blots/break": Oe,
  "blots/container": hr,
  "blots/cursor": ri,
  "blots/embed": pu,
  "blots/inline": Xe,
  "blots/scroll": _r,
  "blots/text": Te,
  "modules/clipboard": Bp,
  "modules/history": jp,
  "modules/keyboard": Za,
  "modules/uploader": Fp,
  "modules/input": ik,
  "modules/uiNode": ck
});
class uk extends Ie {
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
const dk = new uk("indent", "ql-indent", {
  scope: B.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
class lc extends Tt {
}
_(lc, "blotName", "blockquote"), _(lc, "tagName", "blockquote");
class cc extends Tt {
  static formats(t) {
    return this.tagName.indexOf(t.tagName) + 1;
  }
}
_(cc, "blotName", "header"), _(cc, "tagName", ["H1", "H2", "H3", "H4", "H5", "H6"]);
class bs extends hr {
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
    I.register(bs);
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
class os extends Xe {
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
_(os, "blotName", "bold"), _(os, "tagName", ["STRONG", "B"]);
class uc extends os {
}
_(uc, "blotName", "italic"), _(uc, "tagName", ["EM", "I"]);
class On extends Xe {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("href", this.sanitize(t)), e.setAttribute("rel", "noopener noreferrer"), e.setAttribute("target", "_blank"), e;
  }
  static formats(t) {
    return t.getAttribute("href");
  }
  static sanitize(t) {
    return Hp(t, this.PROTOCOL_WHITELIST) ? t : this.SANITIZED_URL;
  }
  format(t, e) {
    t !== this.statics.blotName || !e ? super.format(t, e) : this.domNode.setAttribute("href", this.constructor.sanitize(e));
  }
}
_(On, "blotName", "link"), _(On, "tagName", "A"), _(On, "SANITIZED_URL", "about:blank"), _(On, "PROTOCOL_WHITELIST", ["http", "https", "mailto", "tel", "sms"]);
function Hp(r, t) {
  const e = document.createElement("a");
  e.href = r;
  const n = e.href.slice(0, e.href.indexOf(":"));
  return t.indexOf(n) > -1;
}
class dc extends Xe {
  static create(t) {
    return t === "super" ? document.createElement("sup") : t === "sub" ? document.createElement("sub") : super.create(t);
  }
  static formats(t) {
    if (t.tagName === "SUB") return "sub";
    if (t.tagName === "SUP") return "super";
  }
}
_(dc, "blotName", "script"), _(dc, "tagName", ["SUB", "SUP"]);
class hc extends os {
}
_(hc, "blotName", "strike"), _(hc, "tagName", ["S", "STRIKE"]);
class fc extends Xe {
}
_(fc, "blotName", "underline"), _(fc, "tagName", "U");
class da extends pu {
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
const th = ["alt", "height", "width"];
var ca;
let hk = (ca = class extends Zt {
  static create(t) {
    const e = super.create(t);
    return typeof t == "string" && e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return th.reduce((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e), {});
  }
  static match(t) {
    return /\.(jpe?g|gif|png)$/.test(t) || /^data:image\/.+;base64/.test(t);
  }
  static sanitize(t) {
    return Hp(t, ["http", "https", "data"]) ? t : "//:0";
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    th.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
}, _(ca, "blotName", "image"), _(ca, "tagName", "IMG"), ca);
const eh = ["height", "width"];
class ha extends oe {
  static create(t) {
    const e = super.create(t);
    return e.setAttribute("frameborder", "0"), e.setAttribute("allowfullscreen", "true"), e.setAttribute("src", this.sanitize(t)), e;
  }
  static formats(t) {
    return eh.reduce((e, n) => (t.hasAttribute(n) && (e[n] = t.getAttribute(n)), e), {});
  }
  static sanitize(t) {
    return On.sanitize(t);
  }
  static value(t) {
    return t.getAttribute("src");
  }
  format(t, e) {
    eh.indexOf(t) > -1 ? e ? this.domNode.setAttribute(t, e) : this.domNode.removeAttribute(t) : super.format(t, e);
  }
  html() {
    const {
      video: t
    } = this.value();
    return `<a href="${t}">${t}</a>`;
  }
}
_(ha, "blotName", "video"), _(ha, "className", "ql-video"), _(ha, "tagName", "IFRAME");
const Bi = new Ie("code-token", "hljs", {
  scope: B.INLINE
});
class fn extends Xe {
  static formats(t, e) {
    for (; t != null && t !== e.domNode; ) {
      if (t.classList && t.classList.contains(_t.className))
        return super.formats(t, e);
      t = t.parentNode;
    }
  }
  constructor(t, e, n) {
    super(t, e, n), Bi.add(this.domNode, n);
  }
  format(t, e) {
    t !== fn.blotName ? super.format(t, e) : e ? Bi.add(this.domNode, e) : (Bi.remove(this.domNode), this.domNode.classList.remove(this.statics.className));
  }
  optimize() {
    super.optimize(...arguments), Bi.value(this.domNode) || this.unwrap();
  }
}
fn.blotName = "code-token";
fn.className = "ql-token";
class se extends _t {
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
    return this.formatAt(0, this.length(), fn.blotName, !1), super.replaceWith(t, e);
  }
}
class Yi extends fr {
  attach() {
    super.attach(), this.forceNext = !1, this.scroll.emitMount(this);
  }
  format(t, e) {
    t === se.blotName && (this.forceNext = !0, this.children.forEach((n) => {
      n.format(t, e);
    }));
  }
  formatAt(t, e, n, i) {
    n === se.blotName && (this.forceNext = !0), super.formatAt(t, e, n, i);
  }
  highlight(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.children.head == null) return;
    const i = `${Array.from(this.domNode.childNodes).filter((a) => a !== this.uiNode).map((a) => a.textContent).join(`
`)}
`, s = se.formats(this.children.head.domNode);
    if (e || this.forceNext || this.cachedText !== i) {
      if (i.trim().length > 0 || this.cachedText == null) {
        const a = this.children.reduce((l, c) => l.concat(Ep(c, !1)), new P()), o = t(i, s);
        a.diff(o).reduce((l, c) => {
          let {
            retain: u,
            attributes: h
          } = c;
          return u ? (h && Object.keys(h).forEach((f) => {
            [se.blotName, fn.blotName].includes(f) && this.formatAt(l, u, f, h[f]);
          }), l + u) : l;
        }, 0);
      }
      this.cachedText = i, this.forceNext = !1;
    }
  }
  html(t, e) {
    const [n] = this.children.find(t);
    return `<pre data-language="${n ? se.formats(n.domNode) : "plain"}">
${Xa(this.code(t, e))}
</pre>`;
  }
  optimize(t) {
    if (super.optimize(t), this.parent != null && this.children.head != null && this.uiNode != null) {
      const e = se.formats(this.children.head.domNode);
      e !== this.uiNode.value && (this.uiNode.value = e);
    }
  }
}
Yi.allowedChildren = [se];
se.requiredContainer = Yi;
se.allowedChildren = [fn, ri, Te, Oe];
const fk = (r, t, e) => {
  if (typeof r.versionString == "string") {
    const n = r.versionString.split(".")[0];
    if (parseInt(n, 10) >= 11)
      return r.highlight(e, {
        language: t
      }).value;
  }
  return r.highlight(t, e).value;
};
class Up extends Ne {
  static register() {
    I.register(fn, !0), I.register(se, !0), I.register(Yi, !0);
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
    this.quill.on(I.events.SCROLL_BLOT_MOUNT, (t) => {
      if (!(t instanceof Yi)) return;
      const e = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach((n) => {
        let {
          key: i,
          label: s
        } = n;
        const a = e.ownerDocument.createElement("option");
        a.textContent = s, a.setAttribute("value", i), e.appendChild(a);
      }), e.addEventListener("change", () => {
        t.format(se.blotName, e.value), this.quill.root.focus(), this.highlight(t, !0);
      }), t.uiNode == null && (t.attachUI(e), t.children.head && (e.value = se.formats(t.children.head.domNode)));
    });
  }
  initTimer() {
    let t = null;
    this.quill.on(I.events.SCROLL_OPTIMIZE, () => {
      t && clearTimeout(t), t = setTimeout(() => {
        this.highlight(), t = null;
      }, this.options.interval);
    });
  }
  highlight() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (this.quill.selection.composing) return;
    this.quill.update(I.sources.USER);
    const n = this.quill.getSelection();
    (t == null ? this.quill.scroll.descendants(Yi) : [t]).forEach((s) => {
      s.highlight(this.highlightBlot, e);
    }), this.quill.update(I.sources.SILENT), n != null && this.quill.setSelection(n, I.sources.SILENT);
  }
  highlightBlot(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "plain";
    if (e = this.languages[e] ? e : "plain", e === "plain")
      return Xa(t).split(`
`).reduce((i, s, a) => (a !== 0 && i.insert(`
`, {
        [_t.blotName]: e
      }), i.insert(s)), new P());
    const n = this.quill.root.ownerDocument.createElement("div");
    return n.classList.add(_t.className), n.innerHTML = fk(this.options.hljs, e, t), xu(this.quill.scroll, n, [(i, s) => {
      const a = Bi.value(i);
      return a ? s.compose(new P().retain(s.length(), {
        [fn.blotName]: a
      })) : s;
    }], [(i, s) => i.data.split(`
`).reduce((a, o, l) => (l !== 0 && a.insert(`
`, {
      [_t.blotName]: e
    }), a.insert(o)), s)], /* @__PURE__ */ new WeakMap());
  }
}
Up.DEFAULTS = {
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
    return t ? e.setAttribute("data-row", t) : e.setAttribute("data-row", ku()), e;
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
let ve = Zi;
class pn extends hr {
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
_(pn, "blotName", "table-row"), _(pn, "tagName", "TR");
class We extends hr {
}
_(We, "blotName", "table-body"), _(We, "tagName", "TBODY");
class si extends hr {
  balanceCells() {
    const t = this.descendants(pn), e = t.reduce((n, i) => Math.max(i.children.length, n), 0);
    t.forEach((n) => {
      new Array(e - n.children.length).fill(0).forEach(() => {
        let i;
        n.children.head != null && (i = ve.formats(n.children.head.domNode));
        const s = this.scroll.create(ve.blotName, i);
        n.appendChild(s), s.optimize();
      });
    });
  }
  cells(t) {
    return this.rows().map((e) => e.children.at(t));
  }
  deleteColumn(t) {
    const [e] = this.descendant(We);
    e == null || e.children.head == null || e.children.forEach((n) => {
      const i = n.children.at(t);
      i != null && i.remove();
    });
  }
  insertColumn(t) {
    const [e] = this.descendant(We);
    e == null || e.children.head == null || e.children.forEach((n) => {
      const i = n.children.at(t), s = ve.formats(n.children.head.domNode), a = this.scroll.create(ve.blotName, s);
      n.insertBefore(a, i);
    });
  }
  insertRow(t) {
    const [e] = this.descendant(We);
    if (e == null || e.children.head == null) return;
    const n = ku(), i = this.scroll.create(pn.blotName);
    e.children.head.children.forEach(() => {
      const a = this.scroll.create(ve.blotName, n);
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
_(si, "blotName", "table-container"), _(si, "tagName", "TABLE");
si.allowedChildren = [We];
We.requiredContainer = si;
We.allowedChildren = [pn];
pn.requiredContainer = We;
pn.allowedChildren = [ve];
ve.requiredContainer = pn;
function ku() {
  return `row-${Math.random().toString(36).slice(2, 6)}`;
}
class pk extends Ne {
  static register() {
    I.register(ve), I.register(pn), I.register(We), I.register(si);
  }
  constructor() {
    super(...arguments), this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(si).forEach((t) => {
      t.balanceCells();
    });
  }
  deleteColumn() {
    const [t, , e] = this.getTable();
    e != null && (t.deleteColumn(e.cellOffset()), this.quill.update(I.sources.USER));
  }
  deleteRow() {
    const [, t] = this.getTable();
    t != null && (t.remove(), this.quill.update(I.sources.USER));
  }
  deleteTable() {
    const [t] = this.getTable();
    if (t == null) return;
    const e = t.offset();
    t.remove(), this.quill.update(I.sources.USER), this.quill.setSelection(e, I.sources.SILENT);
  }
  getTable() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.quill.getSelection();
    if (t == null) return [null, null, null, -1];
    const [e, n] = this.quill.getLine(t.index);
    if (e == null || e.statics.blotName !== ve.blotName)
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
    n.insertColumn(a + t), this.quill.update(I.sources.USER);
    let o = i.rowOffset();
    t === 0 && (o += 1), this.quill.setSelection(e.index + o, e.length, I.sources.SILENT);
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
    n.insertRow(a + t), this.quill.update(I.sources.USER), t > 0 ? this.quill.setSelection(e, I.sources.SILENT) : this.quill.setSelection(e.index + i.children.length, e.length, I.sources.SILENT);
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
        table: ku()
      });
    }, new P().retain(n.index));
    this.quill.updateContents(i, I.sources.USER), this.quill.setSelection(n.index, I.sources.SILENT), this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(I.events.SCROLL_OPTIMIZE, (t) => {
      t.some((e) => ["TD", "TR", "TBODY", "TABLE"].includes(e.target.tagName) ? (this.quill.once(I.events.TEXT_CHANGE, (n, i, s) => {
        s === I.sources.USER && this.balanceTables();
      }), !0) : !1);
    });
  }
}
const nh = bn("quill:toolbar");
class Su extends Ne {
  constructor(t, e) {
    var n, i;
    if (super(t, e), Array.isArray(this.options.container)) {
      const s = document.createElement("div");
      s.setAttribute("role", "toolbar"), gk(s, this.options.container), (i = (n = t.container) == null ? void 0 : n.parentNode) == null || i.insertBefore(s, t.container), this.container = s;
    } else typeof this.options.container == "string" ? this.container = document.querySelector(this.options.container) : this.container = this.options.container;
    if (!(this.container instanceof HTMLElement)) {
      nh.error("Container required for toolbar", this.options);
      return;
    }
    this.container.classList.add("ql-toolbar"), this.controls = [], this.handlers = {}, this.options.handlers && Object.keys(this.options.handlers).forEach((s) => {
      var o;
      const a = (o = this.options.handlers) == null ? void 0 : o[s];
      a && this.addHandler(s, a);
    }), Array.from(this.container.querySelectorAll("button, select")).forEach((s) => {
      this.attach(s);
    }), this.quill.on(I.events.EDITOR_CHANGE, () => {
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
      nh.warn("ignoring attaching to nonexistent format", e, t);
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
        }), I.sources.USER);
      } else
        this.quill.format(e, s, I.sources.USER);
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
Su.DEFAULTS = {};
function rh(r, t, e) {
  const n = document.createElement("button");
  n.setAttribute("type", "button"), n.classList.add(`ql-${t}`), n.setAttribute("aria-pressed", "false"), e != null ? (n.value = e, n.setAttribute("aria-label", `${t}: ${e}`)) : n.setAttribute("aria-label", t), r.appendChild(n);
}
function gk(r, t) {
  Array.isArray(t[0]) || (t = [t]), t.forEach((e) => {
    const n = document.createElement("span");
    n.classList.add("ql-formats"), e.forEach((i) => {
      if (typeof i == "string")
        rh(n, i);
      else {
        const s = Object.keys(i)[0], a = i[s];
        Array.isArray(a) ? mk(n, s, a) : rh(n, s, a);
      }
    }), r.appendChild(n);
  });
}
function mk(r, t, e) {
  const n = document.createElement("select");
  n.classList.add(`ql-${t}`), e.forEach((i) => {
    const s = document.createElement("option");
    i !== !1 ? s.setAttribute("value", String(i)) : s.setAttribute("selected", "selected"), n.appendChild(s);
  }), r.appendChild(n);
}
Su.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const r = this.quill.getSelection();
      if (r != null)
        if (r.length === 0) {
          const t = this.quill.getFormat();
          Object.keys(t).forEach((e) => {
            this.quill.scroll.query(e, B.INLINE) != null && this.quill.format(e, !1, I.sources.USER);
          });
        } else
          this.quill.removeFormat(r.index, r.length, I.sources.USER);
    },
    direction(r) {
      const {
        align: t
      } = this.quill.getFormat();
      r === "rtl" && t == null ? this.quill.format("align", "right", I.sources.USER) : !r && t === "right" && this.quill.format("align", !1, I.sources.USER), this.quill.format("direction", r, I.sources.USER);
    },
    indent(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t), n = parseInt(e.indent || 0, 10);
      if (r === "+1" || r === "-1") {
        let i = r === "+1" ? 1 : -1;
        e.direction === "rtl" && (i *= -1), this.quill.format("indent", n + i, I.sources.USER);
      }
    },
    link(r) {
      r === !0 && (r = prompt("Enter link URL:")), this.quill.format("link", r, I.sources.USER);
    },
    list(r) {
      const t = this.quill.getSelection(), e = this.quill.getFormat(t);
      r === "check" ? e.list === "checked" || e.list === "unchecked" ? this.quill.format("list", !1, I.sources.USER) : this.quill.format("list", "unchecked", I.sources.USER) : this.quill.format("list", r, I.sources.USER);
    }
  }
};
const bk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/></svg>', yk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"/><line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"/></svg>', vk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"/></svg>', wk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"/><line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"/></svg>', xk = '<svg viewbox="0 0 18 18"><g class="ql-fill ql-color-label"><polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/><rect height="1" width="1" x="4" y="4"/><polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/><rect height="1" width="1" x="2" y="6"/><rect height="1" width="1" x="3" y="5"/><rect height="1" width="1" x="4" y="7"/><polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/><rect height="1" width="1" x="2" y="12"/><rect height="1" width="1" x="2" y="9"/><rect height="1" width="1" x="2" y="15"/><polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/><rect height="1" width="1" x="3" y="8"/><path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/><path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/><path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/><rect height="1" width="1" x="12" y="2"/><rect height="1" width="1" x="11" y="3"/><path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/><rect height="1" width="1" x="2" y="3"/><rect height="1" width="1" x="6" y="2"/><rect height="1" width="1" x="3" y="2"/><rect height="1" width="1" x="5" y="3"/><rect height="1" width="1" x="9" y="2"/><rect height="1" width="1" x="15" y="14"/><polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/><rect height="1" width="1" x="13" y="7"/><rect height="1" width="1" x="15" y="5"/><rect height="1" width="1" x="14" y="6"/><rect height="1" width="1" x="15" y="8"/><rect height="1" width="1" x="14" y="9"/><path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/><rect height="1" width="1" x="14" y="3"/><polygon points="12 6.868 12 6 11.62 6 12 6.868"/><rect height="1" width="1" x="15" y="2"/><rect height="1" width="1" x="12" y="5"/><rect height="1" width="1" x="13" y="4"/><polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/><rect height="1" width="1" x="9" y="14"/><rect height="1" width="1" x="8" y="15"/><path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/><rect height="1" width="1" x="5" y="15"/><path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/><rect height="1" width="1" x="11" y="15"/><path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/><rect height="1" width="1" x="14" y="15"/><rect height="1" width="1" x="15" y="11"/></g><polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/></svg>', kk = '<svg viewbox="0 0 18 18"><rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/><rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/><path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/><path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/></svg>', Sk = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/><path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/></svg>', Ak = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/><line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/><line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/><line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/></svg>', ih = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/></svg>', Ek = '<svg viewbox="0 0 18 18"><line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/><polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/><line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/></svg>', Ck = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/><line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/><path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/><rect class="ql-fill" height="11" width="1" x="11" y="4"/><rect class="ql-fill" height="11" width="1" x="13" y="4"/></svg>', Tk = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/><line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/><path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/><rect class="ql-fill" height="11" width="1" x="5" y="4"/><rect class="ql-fill" height="11" width="1" x="7" y="4"/></svg>', Lk = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"/><rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"/><path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"/></svg>', Dk = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>', Ik = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Ok = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', Nk = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>', Mk = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>', qk = '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>', _k = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/><line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/><line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/></svg>', Rk = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"/><circle class="ql-fill" cx="6" cy="7" r="1"/><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/></svg>', zk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/></svg>', Pk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/></svg>', Bk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"/><path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"/><path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"/></svg>', $k = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/><line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/><line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/></svg>', jk = '<svg class="" viewbox="0 0 18 18"><line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"/><polyline class="ql-stroke" points="3 4 4 5 6 3"/><line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"/><polyline class="ql-stroke" points="3 14 4 15 6 13"/><line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/><polyline class="ql-stroke" points="3 9 4 10 6 8"/></svg>', Fk = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/><line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/><line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/><line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/><path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/><path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/><path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/></svg>', Hk = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/><path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/></svg>', Uk = '<svg viewbox="0 0 18 18"><path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/><path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/></svg>', Vk = '<svg viewbox="0 0 18 18"><line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/><path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/><path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/></svg>', Yk = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="2" width="3" x="5" y="5"/><rect class="ql-fill" height="2" width="4" x="9" y="5"/><g class="ql-fill ql-transparent"><rect height="2" width="3" x="5" y="8"/><rect height="2" width="4" x="9" y="8"/><rect height="2" width="3" x="5" y="11"/><rect height="2" width="4" x="9" y="11"/></g></svg>', Wk = '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/><rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/></svg>', Gk = '<svg viewbox="0 0 18 18"><rect class="ql-stroke" height="12" width="12" x="3" y="3"/><rect class="ql-fill" height="12" width="1" x="5" y="3"/><rect class="ql-fill" height="12" width="1" x="12" y="3"/><rect class="ql-fill" height="2" width="8" x="5" y="8"/><rect class="ql-fill" height="1" width="3" x="3" y="5"/><rect class="ql-fill" height="1" width="3" x="3" y="7"/><rect class="ql-fill" height="1" width="3" x="3" y="10"/><rect class="ql-fill" height="1" width="3" x="3" y="12"/><rect class="ql-fill" height="1" width="3" x="12" y="5"/><rect class="ql-fill" height="1" width="3" x="12" y="7"/><rect class="ql-fill" height="1" width="3" x="12" y="10"/><rect class="ql-fill" height="1" width="3" x="12" y="12"/></svg>', ls = {
  align: {
    "": bk,
    center: yk,
    right: vk,
    justify: wk
  },
  background: xk,
  blockquote: kk,
  bold: Sk,
  clean: Ak,
  code: ih,
  "code-block": ih,
  color: Ek,
  direction: {
    "": Ck,
    rtl: Tk
  },
  formula: Lk,
  header: {
    1: Dk,
    2: Ik,
    3: Ok,
    4: Nk,
    5: Mk,
    6: qk
  },
  italic: _k,
  image: Rk,
  indent: {
    "+1": zk,
    "-1": Pk
  },
  link: Bk,
  list: {
    bullet: $k,
    check: jk,
    ordered: Fk
  },
  script: {
    sub: Hk,
    super: Uk
  },
  strike: Vk,
  table: Yk,
  underline: Wk,
  video: Gk
}, Kk = '<svg viewbox="0 0 18 18"><polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"/><polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"/></svg>';
let sh = 0;
function ah(r, t) {
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
    this.container.classList.toggle("ql-expanded"), ah(this.label, "aria-expanded"), ah(this.options, "aria-hidden");
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
    return t.classList.add("ql-picker-label"), t.innerHTML = Kk, t.tabIndex = "0", t.setAttribute("role", "button"), t.setAttribute("aria-expanded", "false"), this.container.appendChild(t), t;
  }
  buildOptions() {
    const t = document.createElement("span");
    t.classList.add("ql-picker-options"), t.setAttribute("aria-hidden", "true"), t.tabIndex = "-1", t.id = `ql-picker-options-${sh}`, sh += 1, this.label.setAttribute("aria-controls", t.id), this.options = t, Array.from(this.select.options).forEach((e) => {
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
class Vp extends Ja {
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
class Yp extends Ja {
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
const Qk = (r) => {
  const {
    overflowY: t
  } = getComputedStyle(r, null);
  return t !== "visible" && t !== "clip";
};
class Wp {
  constructor(t, e) {
    this.quill = t, this.boundsContainer = e || document.body, this.root = t.addContainer("ql-tooltip"), this.root.innerHTML = this.constructor.TEMPLATE, Qk(this.quill.root) && this.quill.root.addEventListener("scroll", () => {
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
const Xk = [!1, "center", "right", "justify"], Zk = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"], Jk = [!1, "serif", "monospace"], tS = ["1", "2", "3", !1], eS = ["small", !1, "large", "huge"];
class vs extends ii {
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
      if (i.classList.contains("ql-align") && (i.querySelector("option") == null && _i(i, Xk), typeof e.align == "object"))
        return new Yp(i, e.align);
      if (i.classList.contains("ql-background") || i.classList.contains("ql-color")) {
        const s = i.classList.contains("ql-background") ? "background" : "color";
        return i.querySelector("option") == null && _i(i, Zk, s === "background" ? "#ffffff" : "#000000"), new Vp(i, e[s]);
      }
      return i.querySelector("option") == null && (i.classList.contains("ql-font") ? _i(i, Jk) : i.classList.contains("ql-header") ? _i(i, tS) : i.classList.contains("ql-size") && _i(i, eS)), new Ja(i);
    });
    const n = () => {
      this.pickers.forEach((i) => {
        i.update();
      });
    };
    this.quill.on(z.events.EDITOR_CHANGE, n);
  }
}
vs.DEFAULTS = Nn({}, ii.DEFAULTS, {
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
class Gp extends Wp {
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
        t = nS(t);
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
function nS(r) {
  let t = r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || r.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  return t ? `${t[1] || "https"}://www.youtube.com/embed/${t[2]}?showinfo=0` : (t = r.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) ? `${t[1] || "https"}://player.vimeo.com/video/${t[2]}/` : r;
}
function _i(r, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  t.forEach((n) => {
    const i = document.createElement("option");
    n === e ? i.setAttribute("selected", "selected") : i.setAttribute("value", String(n)), r.appendChild(i);
  });
}
const rS = [["bold", "italic", "link"], [{
  header: 1
}, {
  header: 2
}, "blockquote"]];
class Kp extends Gp {
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
            const l = o[o.length - 1], c = this.quill.getIndex(l), u = Math.min(l.length() - 1, i.index + i.length - c), h = this.quill.getBounds(new ar(c, u));
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
_(Kp, "TEMPLATE", ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', "</div>"].join(""));
class Qp extends vs {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = rS), super(t, e), this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(t) {
    this.tooltip = new Kp(this.quill, this.options.bounds), t.container != null && (this.tooltip.root.appendChild(t.container), this.buildButtons(t.container.querySelectorAll("button"), ls), this.buildPickers(t.container.querySelectorAll("select"), ls));
  }
}
Qp.DEFAULTS = Nn({}, vs.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(r) {
          r ? this.quill.theme.tooltip.edit() : this.quill.format("link", !1, I.sources.USER);
        }
      }
    }
  }
});
const iS = [[{
  header: ["1", "2", "3", !1]
}], ["bold", "italic", "underline", "link"], [{
  list: "ordered"
}, {
  list: "bullet"
}], ["clean"]];
class Xp extends Gp {
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
          const [s, a] = this.quill.scroll.descendant(On, e.index);
          if (s != null) {
            this.linkRange = new ar(e.index - a, s.length());
            const o = On.formats(s.domNode);
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
_(Xp, "TEMPLATE", ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join(""));
class Zp extends vs {
  constructor(t, e) {
    e.modules.toolbar != null && e.modules.toolbar.container == null && (e.modules.toolbar.container = iS), super(t, e), this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(t) {
    t.container != null && (t.container.classList.add("ql-snow"), this.buildButtons(t.container.querySelectorAll("button"), ls), this.buildPickers(t.container.querySelectorAll("select"), ls), this.tooltip = new Xp(this.quill, this.options.bounds), t.container.querySelector(".ql-link") && this.quill.keyboard.addBinding({
      key: "k",
      shortKey: !0
    }, (e, n) => {
      t.handlers.link.call(t, !n.format.link);
    }));
  }
}
Zp.DEFAULTS = Nn({}, vs.DEFAULTS, {
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
            this.quill.format("link", !1, I.sources.USER);
        }
      }
    }
  }
});
I.register({
  "attributors/attribute/direction": Op,
  "attributors/class/align": Lp,
  "attributors/class/background": xx,
  "attributors/class/color": wx,
  "attributors/class/direction": Np,
  "attributors/class/font": _p,
  "attributors/class/size": zp,
  "attributors/style/align": Dp,
  "attributors/style/background": bu,
  "attributors/style/color": mu,
  "attributors/style/direction": Mp,
  "attributors/style/font": Rp,
  "attributors/style/size": Pp
}, !0);
I.register({
  "formats/align": Lp,
  "formats/direction": Np,
  "formats/indent": dk,
  "formats/background": bu,
  "formats/color": mu,
  "formats/font": _p,
  "formats/size": zp,
  "formats/blockquote": lc,
  "formats/code-block": _t,
  "formats/header": cc,
  "formats/list": ys,
  "formats/bold": os,
  "formats/code": yu,
  "formats/italic": uc,
  "formats/link": On,
  "formats/script": dc,
  "formats/strike": hc,
  "formats/underline": fc,
  "formats/formula": da,
  "formats/image": hk,
  "formats/video": ha,
  "modules/syntax": Up,
  "modules/table": pk,
  "modules/toolbar": Su,
  "themes/bubble": Qp,
  "themes/snow": Zp,
  "ui/icons": ls,
  "ui/picker": Ja,
  "ui/icon-picker": Yp,
  "ui/color-picker": Vp,
  "ui/tooltip": Wp
}, !0);
const Wu = class Wu {
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
Wu.cachedDirection = null;
let pc = Wu;
var sS = Object.defineProperty, aS = Object.defineProperties, oS = Object.getOwnPropertyDescriptors, oh = Object.getOwnPropertySymbols, lS = Object.prototype.hasOwnProperty, cS = Object.prototype.propertyIsEnumerable, lh = (r, t, e) => t in r ? sS(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, Y = (r, t) => {
  for (var e in t || (t = {}))
    lS.call(t, e) && lh(r, e, t[e]);
  if (oh)
    for (var e of oh(t))
      cS.call(t, e) && lh(r, e, t[e]);
  return r;
}, Bt = (r, t) => aS(r, oS(t)), yt = (r, t, e) => new Promise((n, i) => {
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
const gc = Math.min, Hr = Math.max, Ta = Math.round, ta = Math.floor, _n = (r) => ({
  x: r,
  y: r
});
function uS(r, t) {
  return typeof r == "function" ? r(t) : r;
}
function dS(r) {
  return Y({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, r);
}
function hS(r) {
  return typeof r != "number" ? dS(r) : {
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
function fS(r, t) {
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
    } = uS(t, r), m = hS(p), b = o[f ? h === "floating" ? "reference" : "floating" : h], w = La(yield s.getClippingRect({
      element: (e = yield s.isElement == null ? void 0 : s.isElement(b)) == null || e ? b : b.contextElement || (yield s.getDocumentElement == null ? void 0 : s.getDocumentElement(o.floating)),
      boundary: c,
      rootBoundary: u,
      strategy: l
    })), v = h === "floating" ? {
      x: n,
      y: i,
      width: a.floating.width,
      height: a.floating.height
    } : a.reference, k = yield s.getOffsetParent == null ? void 0 : s.getOffsetParent(o.floating), A = (yield s.isElement == null ? void 0 : s.isElement(k)) ? (yield s.getScale == null ? void 0 : s.getScale(k)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    }, E = La(s.convertOffsetParentRelativeRectToViewportRelativeRect ? yield s.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements: o,
      rect: v,
      offsetParent: k,
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
function pi(r) {
  return Jp(r) ? (r.nodeName || "").toLowerCase() : "#document";
}
function Xt(r) {
  var t;
  return (r == null || (t = r.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function yn(r) {
  var t;
  return (t = (Jp(r) ? r.ownerDocument : r.document) || window.document) == null ? void 0 : t.documentElement;
}
function Jp(r) {
  return r instanceof Node || r instanceof Xt(r).Node;
}
function Ze(r) {
  return r instanceof Element || r instanceof Xt(r).Element;
}
function Je(r) {
  return r instanceof HTMLElement || r instanceof Xt(r).HTMLElement;
}
function ch(r) {
  return typeof ShadowRoot > "u" ? !1 : r instanceof ShadowRoot || r instanceof Xt(r).ShadowRoot;
}
function ws(r) {
  const {
    overflow: t,
    overflowX: e,
    overflowY: n,
    display: i
  } = Le(r);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + e) && !["inline", "contents"].includes(i);
}
function pS(r) {
  return ["table", "td", "th"].includes(pi(r));
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
function Au(r) {
  const t = Eu(), e = Le(r);
  return e.transform !== "none" || e.perspective !== "none" || (e.containerType ? e.containerType !== "normal" : !1) || !t && (e.backdropFilter ? e.backdropFilter !== "none" : !1) || !t && (e.filter ? e.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((n) => (e.willChange || "").includes(n)) || ["paint", "layout", "strict", "content"].some((n) => (e.contain || "").includes(n));
}
function gS(r) {
  let t = Rn(r);
  for (; Je(t) && !ai(t); ) {
    if (to(t))
      return null;
    if (Au(t))
      return t;
    t = Rn(t);
  }
  return null;
}
function Eu() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function ai(r) {
  return ["html", "body", "#document"].includes(pi(r));
}
function Le(r) {
  return Xt(r).getComputedStyle(r);
}
function eo(r) {
  return Ze(r) ? {
    scrollLeft: r.scrollLeft,
    scrollTop: r.scrollTop
  } : {
    scrollLeft: r.scrollX,
    scrollTop: r.scrollY
  };
}
function Rn(r) {
  if (pi(r) === "html")
    return r;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    r.assignedSlot || // DOM Element detected.
    r.parentNode || // ShadowRoot detected.
    ch(r) && r.host || // Fallback.
    yn(r)
  );
  return ch(t) ? t.host : t;
}
function tg(r) {
  const t = Rn(r);
  return ai(t) ? r.ownerDocument ? r.ownerDocument.body : r.body : Je(t) && ws(t) ? t : tg(t);
}
function cs(r, t, e) {
  var n;
  t === void 0 && (t = []), e === void 0 && (e = !0);
  const i = tg(r), s = i === ((n = r.ownerDocument) == null ? void 0 : n.body), a = Xt(i);
  return s ? t.concat(a, a.visualViewport || [], ws(i) ? i : [], a.frameElement && e ? cs(a.frameElement) : []) : t.concat(i, cs(i, [], e));
}
function eg(r) {
  const t = Le(r);
  let e = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const i = Je(r), s = i ? r.offsetWidth : e, a = i ? r.offsetHeight : n, o = Ta(e) !== s || Ta(n) !== a;
  return o && (e = s, n = a), {
    width: e,
    height: n,
    $: o
  };
}
function Cu(r) {
  return Ze(r) ? r : r.contextElement;
}
function Ur(r) {
  const t = Cu(r);
  if (!Je(t))
    return _n(1);
  const e = t.getBoundingClientRect(), {
    width: n,
    height: i,
    $: s
  } = eg(t);
  let a = (s ? Ta(e.width) : e.width) / n, o = (s ? Ta(e.height) : e.height) / i;
  return (!a || !Number.isFinite(a)) && (a = 1), (!o || !Number.isFinite(o)) && (o = 1), {
    x: a,
    y: o
  };
}
const mS = /* @__PURE__ */ _n(0);
function ng(r) {
  const t = Xt(r);
  return !Eu() || !t.visualViewport ? mS : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function bS(r, t, e) {
  return t === void 0 && (t = !1), !e || t && e !== Xt(r) ? !1 : t;
}
function or(r, t, e, n) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  const i = r.getBoundingClientRect(), s = Cu(r);
  let a = _n(1);
  t && (n ? Ze(n) && (a = Ur(n)) : a = Ur(r));
  const o = bS(s, e, n) ? ng(s) : _n(0);
  let l = (i.left + o.x) / a.x, c = (i.top + o.y) / a.y, u = i.width / a.x, h = i.height / a.y;
  if (s) {
    const f = Xt(s), p = n && Ze(n) ? Xt(n) : n;
    let m = f, b = m.frameElement;
    for (; b && n && p !== m; ) {
      const w = Ur(b), v = b.getBoundingClientRect(), k = Le(b), A = v.left + (b.clientLeft + parseFloat(k.paddingLeft)) * w.x, E = v.top + (b.clientTop + parseFloat(k.paddingTop)) * w.y;
      l *= w.x, c *= w.y, u *= w.x, h *= w.y, l += A, c += E, m = Xt(b), b = m.frameElement;
    }
  }
  return La({
    width: u,
    height: h,
    x: l,
    y: c
  });
}
function yS(r) {
  let {
    elements: t,
    rect: e,
    offsetParent: n,
    strategy: i
  } = r;
  const s = i === "fixed", a = yn(n), o = t ? to(t.floating) : !1;
  if (n === a || o && s)
    return e;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = _n(1);
  const u = _n(0), h = Je(n);
  if ((h || !h && !s) && ((pi(n) !== "body" || ws(a)) && (l = eo(n)), Je(n))) {
    const f = or(n);
    c = Ur(n), u.x = f.x + n.clientLeft, u.y = f.y + n.clientTop;
  }
  return {
    width: e.width * c.x,
    height: e.height * c.y,
    x: e.x * c.x - l.scrollLeft * c.x + u.x,
    y: e.y * c.y - l.scrollTop * c.y + u.y
  };
}
function vS(r) {
  return Array.from(r.getClientRects());
}
function rg(r) {
  return or(yn(r)).left + eo(r).scrollLeft;
}
function wS(r) {
  const t = yn(r), e = eo(r), n = r.ownerDocument.body, i = Hr(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), s = Hr(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -e.scrollLeft + rg(r);
  const o = -e.scrollTop;
  return Le(n).direction === "rtl" && (a += Hr(t.clientWidth, n.clientWidth) - i), {
    width: i,
    height: s,
    x: a,
    y: o
  };
}
function xS(r, t) {
  const e = Xt(r), n = yn(r), i = e.visualViewport;
  let s = n.clientWidth, a = n.clientHeight, o = 0, l = 0;
  if (i) {
    s = i.width, a = i.height;
    const c = Eu();
    (!c || c && t === "fixed") && (o = i.offsetLeft, l = i.offsetTop);
  }
  return {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
function kS(r, t) {
  const e = or(r, !0, t === "fixed"), n = e.top + r.clientTop, i = e.left + r.clientLeft, s = Je(r) ? Ur(r) : _n(1), a = r.clientWidth * s.x, o = r.clientHeight * s.y, l = i * s.x, c = n * s.y;
  return {
    width: a,
    height: o,
    x: l,
    y: c
  };
}
function uh(r, t, e) {
  let n;
  if (t === "viewport")
    n = xS(r, e);
  else if (t === "document")
    n = wS(yn(r));
  else if (Ze(t))
    n = kS(t, e);
  else {
    const i = ng(r);
    n = Bt(Y({}, t), {
      x: t.x - i.x,
      y: t.y - i.y
    });
  }
  return La(n);
}
function ig(r, t) {
  const e = Rn(r);
  return e === t || !Ze(e) || ai(e) ? !1 : Le(e).position === "fixed" || ig(e, t);
}
function SS(r, t) {
  const e = t.get(r);
  if (e)
    return e;
  let n = cs(r, [], !1).filter((o) => Ze(o) && pi(o) !== "body"), i = null;
  const s = Le(r).position === "fixed";
  let a = s ? Rn(r) : r;
  for (; Ze(a) && !ai(a); ) {
    const o = Le(a), l = Au(a);
    !l && o.position === "fixed" && (i = null), (s ? !l && !i : !l && o.position === "static" && i && ["absolute", "fixed"].includes(i.position) || ws(a) && !l && ig(r, a)) ? n = n.filter((c) => c !== a) : i = o, a = Rn(a);
  }
  return t.set(r, n), n;
}
function AS(r) {
  let {
    element: t,
    boundary: e,
    rootBoundary: n,
    strategy: i
  } = r;
  const s = [...e === "clippingAncestors" ? to(t) ? [] : SS(t, this._c) : [].concat(e), n], a = s[0], o = s.reduce((l, c) => {
    const u = uh(t, c, i);
    return l.top = Hr(u.top, l.top), l.right = gc(u.right, l.right), l.bottom = gc(u.bottom, l.bottom), l.left = Hr(u.left, l.left), l;
  }, uh(t, a, i));
  return {
    width: o.right - o.left,
    height: o.bottom - o.top,
    x: o.left,
    y: o.top
  };
}
function ES(r) {
  const {
    width: t,
    height: e
  } = eg(r);
  return {
    width: t,
    height: e
  };
}
function CS(r, t, e) {
  const n = Je(t), i = yn(t), s = e === "fixed", a = or(r, !0, s, t);
  let o = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = _n(0);
  if (n || !n && !s)
    if ((pi(t) !== "body" || ws(i)) && (o = eo(t)), n) {
      const h = or(t, !0, s, t);
      l.x = h.x + t.clientLeft, l.y = h.y + t.clientTop;
    } else i && (l.x = rg(i));
  const c = a.left + o.scrollLeft - l.x, u = a.top + o.scrollTop - l.y;
  return {
    x: c,
    y: u,
    width: a.width,
    height: a.height
  };
}
function gl(r) {
  return Le(r).position === "static";
}
function dh(r, t) {
  return !Je(r) || Le(r).position === "fixed" ? null : t ? t(r) : r.offsetParent;
}
function sg(r, t) {
  const e = Xt(r);
  if (to(r))
    return e;
  if (!Je(r)) {
    let i = Rn(r);
    for (; i && !ai(i); ) {
      if (Ze(i) && !gl(i))
        return i;
      i = Rn(i);
    }
    return e;
  }
  let n = dh(r, t);
  for (; n && pS(n) && gl(n); )
    n = dh(n, t);
  return n && ai(n) && gl(n) && !Au(n) ? e : n || gS(r) || e;
}
const TS = function(r) {
  return yt(this, null, function* () {
    const t = this.getOffsetParent || sg, e = this.getDimensions, n = yield e(r.floating);
    return {
      reference: CS(r.reference, yield t(r.floating), r.strategy),
      floating: {
        x: 0,
        y: 0,
        width: n.width,
        height: n.height
      }
    };
  });
};
function LS(r) {
  return Le(r).direction === "rtl";
}
const ae = {
  convertOffsetParentRelativeRectToViewportRelativeRect: yS,
  getDocumentElement: yn,
  getClippingRect: AS,
  getOffsetParent: sg,
  getElementRects: TS,
  getClientRects: vS,
  getDimensions: ES,
  getScale: Ur,
  isElement: Ze,
  isRTL: LS
};
function DS(r, t) {
  let e = null, n;
  const i = yn(r);
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
    const p = ta(u), m = ta(i.clientWidth - (c + h)), b = ta(i.clientHeight - (u + f)), w = ta(c), v = {
      rootMargin: -p + "px " + -m + "px " + -b + "px " + -w + "px",
      threshold: Hr(0, gc(1, l)) || 1
    };
    let k = !0;
    function A(E) {
      const T = E[0].intersectionRatio;
      if (T !== l) {
        if (!k)
          return a();
        T ? a(!1, T) : n = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      k = !1;
    }
    try {
      e = new IntersectionObserver(A, Bt(Y({}, v), {
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
function ag(r, t, e, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: o = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = n, c = Cu(r), u = i || s ? [...c ? cs(c) : [], ...cs(t)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", e, {
      passive: !0
    }), s && v.addEventListener("resize", e);
  });
  const h = c && o ? DS(c, e) : null;
  let f = -1, p = null;
  a && (p = new ResizeObserver((v) => {
    let [k] = v;
    k && k.target === c && p && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var A;
      (A = p) == null || A.observe(t);
    })), e();
  }), c && !l && p.observe(c), p.observe(t));
  let m, b = l ? or(r) : null;
  l && w();
  function w() {
    const v = or(r);
    b && (v.x !== b.x || v.y !== b.y || v.width !== b.width || v.height !== b.height) && e(), b = v, m = requestAnimationFrame(w);
  }
  return e(), () => {
    var v;
    u.forEach((k) => {
      i && k.removeEventListener("scroll", e), s && k.removeEventListener("resize", e);
    }), h == null || h(), (v = p) == null || v.disconnect(), p = null, l && cancelAnimationFrame(m);
  };
}
const IS = fS, ml = 0, R = 1, K = 2, bt = 3, ot = 4, rn = 5, no = 6, Nt = 7, Ut = 8, G = 9, F = 10, ht = 11, W = 12, ft = 13, xs = 14, Vt = 15, Rt = 16, Yt = 17, sn = 18, Jt = 19, De = 20, St = 21, rt = 22, zt = 23, ce = 24, jt = 25, OS = 0;
function At(r) {
  return r >= 48 && r <= 57;
}
function zn(r) {
  return At(r) || // 0 .. 9
  r >= 65 && r <= 70 || // A .. F
  r >= 97 && r <= 102;
}
function Tu(r) {
  return r >= 65 && r <= 90;
}
function NS(r) {
  return r >= 97 && r <= 122;
}
function MS(r) {
  return Tu(r) || NS(r);
}
function qS(r) {
  return r >= 128;
}
function Da(r) {
  return MS(r) || qS(r) || r === 95;
}
function og(r) {
  return Da(r) || At(r) || r === 45;
}
function _S(r) {
  return r >= 0 && r <= 8 || r === 11 || r >= 14 && r <= 31 || r === 127;
}
function Ia(r) {
  return r === 10 || r === 13 || r === 12;
}
function lr(r) {
  return Ia(r) || r === 32 || r === 9;
}
function Ue(r, t) {
  return !(r !== 92 || Ia(t) || t === OS);
}
function fa(r, t, e) {
  return r === 45 ? Da(t) || t === 45 || Ue(t, e) : Da(r) ? !0 : r === 92 ? Ue(r, t) : !1;
}
function bl(r, t, e) {
  return r === 43 || r === 45 ? At(t) ? 2 : t === 46 && At(e) ? 3 : 0 : r === 46 ? At(t) ? 2 : 0 : At(r) ? 1 : 0;
}
function lg(r) {
  return r === 65279 || r === 65534 ? 1 : 0;
}
const mc = new Array(128), RS = 128, pa = 130, cg = 131, Lu = 132, ug = 133;
for (let r = 0; r < mc.length; r++)
  mc[r] = lr(r) && pa || At(r) && cg || Da(r) && Lu || _S(r) && ug || r || RS;
function yl(r) {
  return r < 128 ? mc[r] : Lu;
}
function Vr(r, t) {
  return t < r.length ? r.charCodeAt(t) : 0;
}
function bc(r, t, e) {
  return e === 13 && Vr(r, t + 1) === 10 ? 2 : 1;
}
function Yr(r, t, e) {
  let n = r.charCodeAt(t);
  return Tu(n) && (n = n | 32), n === e;
}
function us(r, t, e, n) {
  if (e - t !== n.length || t < 0 || e > r.length)
    return !1;
  for (let i = t; i < e; i++) {
    const s = n.charCodeAt(i - t);
    let a = r.charCodeAt(i);
    if (Tu(a) && (a = a | 32), a !== s)
      return !1;
  }
  return !0;
}
function zS(r, t) {
  for (; t >= 0 && lr(r.charCodeAt(t)); t--)
    ;
  return t + 1;
}
function ea(r, t) {
  for (; t < r.length && lr(r.charCodeAt(t)); t++)
    ;
  return t;
}
function vl(r, t) {
  for (; t < r.length && At(r.charCodeAt(t)); t++)
    ;
  return t;
}
function oi(r, t) {
  if (t += 2, zn(Vr(r, t - 1))) {
    for (const n = Math.min(r.length, t + 5); t < n && zn(Vr(r, t)); t++)
      ;
    const e = Vr(r, t);
    lr(e) && (t += bc(r, t, e));
  }
  return t;
}
function na(r, t) {
  for (; t < r.length; t++) {
    const e = r.charCodeAt(t);
    if (!og(e)) {
      if (Ue(e, Vr(r, t + 1))) {
        t = oi(r, t) - 1;
        continue;
      }
      break;
    }
  }
  return t;
}
function ro(r, t) {
  let e = r.charCodeAt(t);
  if ((e === 43 || e === 45) && (e = r.charCodeAt(t += 1)), At(e) && (t = vl(r, t + 1), e = r.charCodeAt(t)), e === 46 && At(r.charCodeAt(t + 1)) && (t += 2, t = vl(r, t)), Yr(
    r,
    t,
    101
    /* e */
  )) {
    let n = 0;
    e = r.charCodeAt(t + 1), (e === 45 || e === 43) && (n = 1, e = r.charCodeAt(t + 2)), At(e) && (t = vl(r, t + 1 + n + 1));
  }
  return t;
}
function wl(r, t) {
  for (; t < r.length; t++) {
    const e = r.charCodeAt(t);
    if (e === 41) {
      t++;
      break;
    }
    Ue(e, Vr(r, t + 1)) && (t = oi(r, t));
  }
  return t;
}
function dg(r) {
  if (r.length === 1 && !zn(r.charCodeAt(0)))
    return r[0];
  let t = parseInt(r, 16);
  return (t === 0 || // If this number is zero,
  t >= 55296 && t <= 57343 || // or is for a surrogate,
  t > 1114111) && (t = 65533), String.fromCodePoint(t);
}
const hg = [
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
], PS = 16 * 1024;
function Oa(r = null, t) {
  return r === null || r.length < t ? new Uint32Array(Math.max(t + 1024, PS)) : r;
}
const hh = 10, BS = 12, fh = 13;
function ph(r) {
  const t = r.source, e = t.length, n = t.length > 0 ? lg(t.charCodeAt(0)) : 0, i = Oa(r.lines, e), s = Oa(r.columns, e);
  let a = r.startLine, o = r.startColumn;
  for (let l = n; l < e; l++) {
    const c = t.charCodeAt(l);
    i[l] = a, s[l] = o++, (c === hh || c === fh || c === BS) && (c === fh && l + 1 < e && t.charCodeAt(l + 1) === hh && (l++, i[l] = a, s[l] = o), a++, o = 1);
  }
  i[e] = a, s[e] = o, r.lines = i, r.columns = s, r.computed = !0;
}
class $S {
  constructor() {
    this.lines = null, this.columns = null, this.computed = !1;
  }
  setSource(t, e = 0, n = 1, i = 1) {
    this.source = t, this.startOffset = e, this.startLine = n, this.startColumn = i, this.computed = !1;
  }
  getLocation(t, e) {
    return this.computed || ph(this), {
      source: e,
      offset: this.startOffset + t,
      line: this.lines[t],
      column: this.columns[t]
    };
  }
  getLocationRange(t, e, n) {
    return this.computed || ph(this), {
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
const ee = 16777215, Sn = 24, jS = /* @__PURE__ */ new Map([
  [K, rt],
  [St, rt],
  [Jt, De],
  [zt, ce]
]);
class FS {
  constructor(t, e) {
    this.setSource(t, e);
  }
  reset() {
    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
  }
  setSource(t = "", e = () => {
  }) {
    t = String(t || "");
    const n = t.length, i = Oa(this.offsetAndType, t.length + 1), s = Oa(this.balance, t.length + 1);
    let a = 0, o = 0, l = 0, c = -1;
    for (this.offsetAndType = null, this.balance = null, e(t, (u, h, f) => {
      switch (u) {
        default:
          s[a] = n;
          break;
        case o: {
          let p = l & ee;
          for (l = s[p], o = l >> Sn, s[a] = p, s[p++] = a; p < a; p++)
            s[p] === n && (s[p] = a);
          break;
        }
        case St:
        case K:
        case Jt:
        case zt:
          s[a] = l, o = jS.get(u), l = o << Sn | a;
          break;
      }
      i[a++] = u << Sn | f, c === -1 && (c = h);
    }), i[a] = ml << Sn | n, s[a] = n, s[n] = n; l !== 0; ) {
      const u = l & ee;
      l = s[u], s[u] = n;
    }
    this.source = t, this.firstCharOffset = c === -1 ? 0 : c, this.tokenCount = a, this.offsetAndType = i, this.balance = s, this.reset(), this.next();
  }
  lookupType(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t] >> Sn : ml;
  }
  lookupOffset(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t - 1] & ee : this.source.length;
  }
  lookupValue(t, e) {
    return t += this.tokenIndex, t < this.tokenCount ? us(
      this.source,
      this.offsetAndType[t - 1] & ee,
      this.offsetAndType[t] & ee,
      e
    ) : !1;
  }
  getTokenStart(t) {
    return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & ee : this.offsetAndType[this.tokenCount] & ee : this.firstCharOffset;
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
    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.offsetAndType[e - 1] & ee, e = this.offsetAndType[e], this.tokenType = e >> Sn, this.tokenEnd = e & ee) : (this.tokenIndex = this.tokenCount, this.next());
  }
  next() {
    let t = this.tokenIndex + 1;
    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.tokenEnd, t = this.offsetAndType[t], this.tokenType = t >> Sn, this.tokenEnd = t & ee) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = ml, this.tokenStart = this.tokenEnd = this.source.length);
  }
  skipSC() {
    for (; this.tokenType === ft || this.tokenType === jt; )
      this.next();
  }
  skipUntilBalanced(t, e) {
    let n = t, i, s;
    t:
      for (; n < this.tokenCount; n++) {
        if (i = this.balance[n], i < t)
          break t;
        switch (s = n > 0 ? this.offsetAndType[n - 1] & ee : this.firstCharOffset, e(this.source.charCodeAt(s))) {
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
      const i = n, s = this.offsetAndType[e], a = s & ee, o = s >> Sn;
      n = a, t(o, i, a, e);
    }
  }
  dump() {
    const t = new Array(this.tokenCount);
    return this.forEachToken((e, n, i, s) => {
      t[s] = {
        idx: s,
        type: hg[e],
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
      u = ht, c++;
      return;
    }
    u = F;
  }
  function i() {
    const h = c;
    if (c = na(r, c), us(r, h, c, "url") && e(c) === 40) {
      if (c = ea(r, c + 1), e(c) === 34 || e(c) === 39) {
        u = K, c = h + 4;
        return;
      }
      a();
      return;
    }
    if (e(c) === 40) {
      u = K, c++;
      return;
    }
    u = R;
  }
  function s(h) {
    for (h || (h = e(c++)), u = rn; c < r.length; c++) {
      const f = r.charCodeAt(c);
      switch (yl(f)) {
        case h:
          c++;
          return;
        case pa:
          if (Ia(f)) {
            c += bc(r, c, f), u = no;
            return;
          }
          break;
        case 92:
          if (c === r.length - 1)
            break;
          const p = e(c + 1);
          Ia(p) ? c += bc(r, c + 1, p) : Ue(f, p) && (c = oi(r, c) - 1);
          break;
      }
    }
  }
  function a() {
    for (u = Nt, c = ea(r, c); c < r.length; c++) {
      const h = r.charCodeAt(c);
      switch (yl(h)) {
        case 41:
          c++;
          return;
        case pa:
          if (c = ea(r, c), e(c) === 41 || c >= r.length) {
            c < r.length && c++;
            return;
          }
          c = wl(r, c), u = Ut;
          return;
        case 34:
        case 39:
        case 40:
        case ug:
          c = wl(r, c), u = Ut;
          return;
        case 92:
          if (Ue(h, e(c + 1))) {
            c = oi(r, c) - 1;
            break;
          }
          c = wl(r, c), u = Ut;
          return;
      }
    }
  }
  r = String(r || "");
  const o = r.length;
  let l = lg(e(0)), c = l, u;
  for (; c < o; ) {
    const h = r.charCodeAt(c);
    switch (yl(h)) {
      case pa:
        u = ft, c = ea(r, c + 1);
        break;
      case 34:
        s();
        break;
      case 35:
        og(e(c + 1)) || Ue(e(c + 1), e(c + 2)) ? (u = ot, c = na(r, c + 1)) : (u = G, c++);
        break;
      case 39:
        s();
        break;
      case 40:
        u = St, c++;
        break;
      case 41:
        u = rt, c++;
        break;
      case 43:
        bl(h, e(c + 1), e(c + 2)) ? n() : (u = G, c++);
        break;
      case 44:
        u = sn, c++;
        break;
      case 45:
        bl(h, e(c + 1), e(c + 2)) ? n() : e(c + 1) === 45 && e(c + 2) === 62 ? (u = Vt, c = c + 3) : fa(h, e(c + 1), e(c + 2)) ? i() : (u = G, c++);
        break;
      case 46:
        bl(h, e(c + 1), e(c + 2)) ? n() : (u = G, c++);
        break;
      case 47:
        e(c + 1) === 42 ? (u = jt, c = r.indexOf("*/", c + 2), c = c === -1 ? r.length : c + 2) : (u = G, c++);
        break;
      case 58:
        u = Rt, c++;
        break;
      case 59:
        u = Yt, c++;
        break;
      case 60:
        e(c + 1) === 33 && e(c + 2) === 45 && e(c + 3) === 45 ? (u = xs, c = c + 4) : (u = G, c++);
        break;
      case 64:
        fa(e(c + 1), e(c + 2), e(c + 3)) ? (u = bt, c = na(r, c + 1)) : (u = G, c++);
        break;
      case 91:
        u = Jt, c++;
        break;
      case 92:
        Ue(h, e(c + 1)) ? i() : (u = G, c++);
        break;
      case 93:
        u = De, c++;
        break;
      case 123:
        u = zt, c++;
        break;
      case 125:
        u = ce, c++;
        break;
      case cg:
        n();
        break;
      case Lu:
        i();
        break;
      default:
        u = G, c++;
    }
    t(u, l, l = c);
  }
}
let Cr = null;
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
    return Cr !== null ? (n = Cr, Cr = Cr.cursor, n.prev = t, n.next = e, n.cursor = this.cursor) : n = {
      prev: t,
      next: e,
      cursor: this.cursor
    }, this.cursor = n, n;
  }
  releaseCursor() {
    const { cursor: t } = this;
    this.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = Cr, Cr = t;
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
const xl = 100, gh = 60, mh = "    ";
function bh({ source: r, line: t, column: e }, n) {
  function i(u, h) {
    return s.slice(u, h).map(
      (f, p) => String(u + p + 1).padStart(l) + " |" + f
    ).join(`
`);
  }
  const s = r.split(/\r\n?|\n|\f/), a = Math.max(1, t - n) - 1, o = Math.min(t + n, s.length + 1), l = Math.max(4, String(o).length) + 1;
  let c = 0;
  e += (mh.length - 1) * (s[t - 1].substr(0, e - 1).match(/\t/g) || []).length, e > xl && (c = e - gh + 3, e = gh - 2);
  for (let u = a; u <= o; u++)
    u >= 0 && u < s.length && (s[u] = s[u].replace(/\t/g, mh), s[u] = (c > 0 && s[u].length > c ? "…" : "") + s[u].substr(c, xl - 2) + (s[u].length > c + xl - 1 ? "…" : ""));
  return [
    i(a, t),
    new Array(e + l + 2).join("-") + "^",
    i(t, o)
  ].filter(Boolean).join(`
`);
}
function yh(r, t, e, n, i) {
  return Object.assign(so("SyntaxError", r), {
    source: t,
    offset: e,
    line: n,
    column: i,
    sourceFragment(s) {
      return bh({ source: t, line: n, column: i }, isNaN(s) ? 0 : s);
    },
    get formattedMessage() {
      return `Parse error: ${r}
` + bh({ source: t, line: n, column: i }, 2);
    }
  });
}
function HS(r) {
  const t = this.createList();
  let e = !1;
  const n = {
    recognizer: r
  };
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case jt:
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
const vh = () => {
}, US = 33, VS = 35, kl = 59, wh = 123, xh = 0;
function YS(r) {
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
function WS(r) {
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
        t.context[e] = YS(r.parseContext[e]);
        break;
    }
  return Y(Y({
    config: t
  }, t), t.node);
}
function GS(r) {
  let t = "", e = "<unknown>", n = !1, i = vh, s = !1;
  const a = new $S(), o = Object.assign(new FS(), WS(r || {}), {
    parseAtrulePrelude: !0,
    parseRulePrelude: !0,
    parseValue: !0,
    parseCustomProperty: !1,
    readSequence: HS,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(l) {
      return l === wh ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(l) {
      return l === wh || l === kl ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(l) {
      return l === US || l === kl ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(l) {
      return l === kl ? 2 : 0;
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
      while (c !== xh);
      return xh;
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
      return Yr(t, l, c);
    },
    cmpStr(l, c, u) {
      return us(t, l, c, u);
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
      const c = t.substring(this.tokenStart, ro(t, this.tokenStart));
      return this.eat(l), c;
    },
    eat(l) {
      if (this.tokenType !== l) {
        const c = hg[l].slice(0, -6).replace(/-/g, " ").replace(/^./, (f) => f.toUpperCase());
        let u = `${/[[\](){}]/.test(c) ? `"${c}"` : c} is expected`, h = this.tokenStart;
        switch (l) {
          case R:
            this.tokenType === K || this.tokenType === Nt ? (h = this.tokenEnd - 1, u = "Identifier is expected but function found") : u = "Identifier is expected";
            break;
          case ot:
            this.isDelim(VS) && (this.next(), h++, u = "Name is expected");
            break;
          case ht:
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
      const u = typeof c < "u" && c < t.length ? a.getLocation(c) : this.eof ? a.getLocation(zS(t, t.length - 1)) : a.getLocation(this.tokenStart);
      throw new yh(
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
    ), e = c.filename || "<unknown>", n = !!c.positions, i = typeof c.onParseError == "function" ? c.onParseError : vh, s = !1, o.parseAtrulePrelude = "parseAtrulePrelude" in c ? !!c.parseAtrulePrelude : !0, o.parseRulePrelude = "parseRulePrelude" in c ? !!c.parseRulePrelude : !0, o.parseValue = "parseValue" in c ? !!c.parseValue : !0, o.parseCustomProperty = "parseCustomProperty" in c ? !!c.parseCustomProperty : !1;
    const { context: u = "default", onComment: h } = c;
    if (!(u in o.context))
      throw new Error("Unknown context `" + u + "`");
    typeof h == "function" && o.forEachToken((p, m, b) => {
      if (p === jt) {
        const w = o.getLocation(m, b), v = us(t, b - 2, b, "*/") ? t.slice(m + 2, b - 2) : t.slice(m + 2, b);
        h(v, w);
      }
    });
    const f = o.context[u].call(o, c);
    return o.eof || o.error(), f;
  }, {
    SyntaxError: yh,
    config: o.config
  });
}
var Du = {}, Iu = {}, kh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
Iu.encode = function(r) {
  if (0 <= r && r < kh.length)
    return kh[r];
  throw new TypeError("Must be between 0 and 63: " + r);
};
Iu.decode = function(r) {
  var t = 65, e = 90, n = 97, i = 122, s = 48, a = 57, o = 43, l = 47, c = 26, u = 52;
  return t <= r && r <= e ? r - t : n <= r && r <= i ? r - n + c : s <= r && r <= a ? r - s + u : r == o ? 62 : r == l ? 63 : -1;
};
var fg = Iu, Ou = 5, pg = 1 << Ou, gg = pg - 1, mg = pg;
function KS(r) {
  return r < 0 ? (-r << 1) + 1 : (r << 1) + 0;
}
function QS(r) {
  var t = (r & 1) === 1, e = r >> 1;
  return t ? -e : e;
}
Du.encode = function(r) {
  var t = "", e, n = KS(r);
  do
    e = n & gg, n >>>= Ou, n > 0 && (e |= mg), t += fg.encode(e);
  while (n > 0);
  return t;
};
Du.decode = function(r, t, e) {
  var n = r.length, i = 0, s = 0, a, o;
  do {
    if (t >= n)
      throw new Error("Expected more digits in base 64 VLQ value.");
    if (o = fg.decode(r.charCodeAt(t++)), o === -1)
      throw new Error("Invalid base64 digit: " + r.charAt(t - 1));
    a = !!(o & mg), o &= gg, i = i + (o << s), s += Ou;
  } while (a);
  e.value = QS(i), e.rest = t;
};
var ao = {};
(function(r) {
  function t(S, C, q) {
    if (C in S)
      return S[C];
    if (arguments.length === 3)
      return q;
    throw new Error('"' + C + '" is a required argument.');
  }
  r.getArg = t;
  var e = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, n = /^data:.+\,.+$/;
  function i(S) {
    var C = S.match(e);
    return C ? {
      scheme: C[1],
      auth: C[2],
      host: C[3],
      port: C[4],
      path: C[5]
    } : null;
  }
  r.urlParse = i;
  function s(S) {
    var C = "";
    return S.scheme && (C += S.scheme + ":"), C += "//", S.auth && (C += S.auth + "@"), S.host && (C += S.host), S.port && (C += ":" + S.port), S.path && (C += S.path), C;
  }
  r.urlGenerate = s;
  var a = 32;
  function o(S) {
    var C = [];
    return function(q) {
      for (var O = 0; O < C.length; O++)
        if (C[O].input === q) {
          var j = C[0];
          return C[0] = C[O], C[O] = j, C[0].result;
        }
      var Q = S(q);
      return C.unshift({
        input: q,
        result: Q
      }), C.length > a && C.pop(), Q;
    };
  }
  var l = o(function(S) {
    var C = S, q = i(S);
    if (q) {
      if (!q.path)
        return S;
      C = q.path;
    }
    for (var O = r.isAbsolute(C), j = [], Q = 0, H = 0; ; )
      if (Q = H, H = C.indexOf("/", Q), H === -1) {
        j.push(C.slice(Q));
        break;
      } else
        for (j.push(C.slice(Q, H)); H < C.length && C[H] === "/"; )
          H++;
    for (var lt, it = 0, H = j.length - 1; H >= 0; H--)
      lt = j[H], lt === "." ? j.splice(H, 1) : lt === ".." ? it++ : it > 0 && (lt === "" ? (j.splice(H + 1, it), it = 0) : (j.splice(H, 2), it--));
    return C = j.join("/"), C === "" && (C = O ? "/" : "."), q ? (q.path = C, s(q)) : C;
  });
  r.normalize = l;
  function c(S, C) {
    S === "" && (S = "."), C === "" && (C = ".");
    var q = i(C), O = i(S);
    if (O && (S = O.path || "/"), q && !q.scheme)
      return O && (q.scheme = O.scheme), s(q);
    if (q || C.match(n))
      return C;
    if (O && !O.host && !O.path)
      return O.host = C, s(O);
    var j = C.charAt(0) === "/" ? C : l(S.replace(/\/+$/, "") + "/" + C);
    return O ? (O.path = j, s(O)) : j;
  }
  r.join = c, r.isAbsolute = function(S) {
    return S.charAt(0) === "/" || e.test(S);
  };
  function u(S, C) {
    S === "" && (S = "."), S = S.replace(/\/$/, "");
    for (var q = 0; C.indexOf(S + "/") !== 0; ) {
      var O = S.lastIndexOf("/");
      if (O < 0 || (S = S.slice(0, O), S.match(/^([^\/]+:\/)?\/*$/)))
        return C;
      ++q;
    }
    return Array(q + 1).join("../") + C.substr(S.length + 1);
  }
  r.relative = u;
  var h = function() {
    var S = /* @__PURE__ */ Object.create(null);
    return !("__proto__" in S);
  }();
  function f(S) {
    return S;
  }
  function p(S) {
    return b(S) ? "$" + S : S;
  }
  r.toSetString = h ? f : p;
  function m(S) {
    return b(S) ? S.slice(1) : S;
  }
  r.fromSetString = h ? f : m;
  function b(S) {
    if (!S)
      return !1;
    var C = S.length;
    if (C < 9 || S.charCodeAt(C - 1) !== 95 || S.charCodeAt(C - 2) !== 95 || S.charCodeAt(C - 3) !== 111 || S.charCodeAt(C - 4) !== 116 || S.charCodeAt(C - 5) !== 111 || S.charCodeAt(C - 6) !== 114 || S.charCodeAt(C - 7) !== 112 || S.charCodeAt(C - 8) !== 95 || S.charCodeAt(C - 9) !== 95)
      return !1;
    for (var q = C - 10; q >= 0; q--)
      if (S.charCodeAt(q) !== 36)
        return !1;
    return !0;
  }
  function w(S, C, q) {
    var O = E(S.source, C.source);
    return O !== 0 || (O = S.originalLine - C.originalLine, O !== 0) || (O = S.originalColumn - C.originalColumn, O !== 0 || q) || (O = S.generatedColumn - C.generatedColumn, O !== 0) || (O = S.generatedLine - C.generatedLine, O !== 0) ? O : E(S.name, C.name);
  }
  r.compareByOriginalPositions = w;
  function v(S, C, q) {
    var O;
    return O = S.originalLine - C.originalLine, O !== 0 || (O = S.originalColumn - C.originalColumn, O !== 0 || q) || (O = S.generatedColumn - C.generatedColumn, O !== 0) || (O = S.generatedLine - C.generatedLine, O !== 0) ? O : E(S.name, C.name);
  }
  r.compareByOriginalPositionsNoSource = v;
  function k(S, C, q) {
    var O = S.generatedLine - C.generatedLine;
    return O !== 0 || (O = S.generatedColumn - C.generatedColumn, O !== 0 || q) || (O = E(S.source, C.source), O !== 0) || (O = S.originalLine - C.originalLine, O !== 0) || (O = S.originalColumn - C.originalColumn, O !== 0) ? O : E(S.name, C.name);
  }
  r.compareByGeneratedPositionsDeflated = k;
  function A(S, C, q) {
    var O = S.generatedColumn - C.generatedColumn;
    return O !== 0 || q || (O = E(S.source, C.source), O !== 0) || (O = S.originalLine - C.originalLine, O !== 0) || (O = S.originalColumn - C.originalColumn, O !== 0) ? O : E(S.name, C.name);
  }
  r.compareByGeneratedPositionsDeflatedNoLine = A;
  function E(S, C) {
    return S === C ? 0 : S === null ? 1 : C === null ? -1 : S > C ? 1 : -1;
  }
  function T(S, C) {
    var q = S.generatedLine - C.generatedLine;
    return q !== 0 || (q = S.generatedColumn - C.generatedColumn, q !== 0) || (q = E(S.source, C.source), q !== 0) || (q = S.originalLine - C.originalLine, q !== 0) || (q = S.originalColumn - C.originalColumn, q !== 0) ? q : E(S.name, C.name);
  }
  r.compareByGeneratedPositionsInflated = T;
  function M(S) {
    return JSON.parse(S.replace(/^\)]}'[^\n]*\n/, ""));
  }
  r.parseSourceMapInput = M;
  function N(S, C, q) {
    if (C = C || "", S && (S[S.length - 1] !== "/" && C[0] !== "/" && (S += "/"), C = S + C), q) {
      var O = i(q);
      if (!O)
        throw new Error("sourceMapURL could not be parsed");
      if (O.path) {
        var j = O.path.lastIndexOf("/");
        j >= 0 && (O.path = O.path.substring(0, j + 1));
      }
      C = c(s(O), C);
    }
    return l(C);
  }
  r.computeSourceURL = N;
})(ao);
var bg = {}, Nu = ao, Mu = Object.prototype.hasOwnProperty, nr = typeof Map < "u";
function gn() {
  this._array = [], this._set = nr ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
}
gn.fromArray = function(r, t) {
  for (var e = new gn(), n = 0, i = r.length; n < i; n++)
    e.add(r[n], t);
  return e;
};
gn.prototype.size = function() {
  return nr ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
gn.prototype.add = function(r, t) {
  var e = nr ? r : Nu.toSetString(r), n = nr ? this.has(r) : Mu.call(this._set, e), i = this._array.length;
  (!n || t) && this._array.push(r), n || (nr ? this._set.set(r, i) : this._set[e] = i);
};
gn.prototype.has = function(r) {
  if (nr)
    return this._set.has(r);
  var t = Nu.toSetString(r);
  return Mu.call(this._set, t);
};
gn.prototype.indexOf = function(r) {
  if (nr) {
    var t = this._set.get(r);
    if (t >= 0)
      return t;
  } else {
    var e = Nu.toSetString(r);
    if (Mu.call(this._set, e))
      return this._set[e];
  }
  throw new Error('"' + r + '" is not in the set.');
};
gn.prototype.at = function(r) {
  if (r >= 0 && r < this._array.length)
    return this._array[r];
  throw new Error("No element indexed by " + r);
};
gn.prototype.toArray = function() {
  return this._array.slice();
};
bg.ArraySet = gn;
var yg = {}, vg = ao;
function XS(r, t) {
  var e = r.generatedLine, n = t.generatedLine, i = r.generatedColumn, s = t.generatedColumn;
  return n > e || n == e && s >= i || vg.compareByGeneratedPositionsInflated(r, t) <= 0;
}
function oo() {
  this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
}
oo.prototype.unsortedForEach = function(r, t) {
  this._array.forEach(r, t);
};
oo.prototype.add = function(r) {
  XS(this._last, r) ? (this._last = r, this._array.push(r)) : (this._sorted = !1, this._array.push(r));
};
oo.prototype.toArray = function() {
  return this._sorted || (this._array.sort(vg.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
};
yg.MappingList = oo;
var Ri = Du, pt = ao, Na = bg.ArraySet, ZS = yg.MappingList;
function ue(r) {
  r || (r = {}), this._file = pt.getArg(r, "file", null), this._sourceRoot = pt.getArg(r, "sourceRoot", null), this._skipValidation = pt.getArg(r, "skipValidation", !1), this._ignoreInvalidMapping = pt.getArg(r, "ignoreInvalidMapping", !1), this._sources = new Na(), this._names = new Na(), this._mappings = new ZS(), this._sourcesContents = null;
}
ue.prototype._version = 3;
ue.fromSourceMap = function(r, t) {
  var e = r.sourceRoot, n = new ue(Object.assign(t || {}, {
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
ue.prototype.addMapping = function(r) {
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
ue.prototype.setSourceContent = function(r, t) {
  var e = r;
  this._sourceRoot != null && (e = pt.relative(this._sourceRoot, e)), t != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[pt.toSetString(e)] = t) : this._sourcesContents && (delete this._sourcesContents[pt.toSetString(e)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
};
ue.prototype.applySourceMap = function(r, t, e) {
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
ue.prototype._validateMapping = function(r, t, e, n) {
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
ue.prototype._serializeMappings = function() {
  for (var r = 0, t = 1, e = 0, n = 0, i = 0, s = 0, a = "", o, l, c, u, h = this._mappings.toArray(), f = 0, p = h.length; f < p; f++) {
    if (l = h[f], o = "", l.generatedLine !== t)
      for (r = 0; l.generatedLine !== t; )
        o += ";", t++;
    else if (f > 0) {
      if (!pt.compareByGeneratedPositionsInflated(l, h[f - 1]))
        continue;
      o += ",";
    }
    o += Ri.encode(l.generatedColumn - r), r = l.generatedColumn, l.source != null && (u = this._sources.indexOf(l.source), o += Ri.encode(u - s), s = u, o += Ri.encode(l.originalLine - 1 - n), n = l.originalLine - 1, o += Ri.encode(l.originalColumn - e), e = l.originalColumn, l.name != null && (c = this._names.indexOf(l.name), o += Ri.encode(c - i), i = c)), a += o;
  }
  return a;
};
ue.prototype._generateSourcesContent = function(r, t) {
  return r.map(function(e) {
    if (!this._sourcesContents)
      return null;
    t != null && (e = pt.relative(t, e));
    var n = pt.toSetString(e);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
  }, this);
};
ue.prototype.toJSON = function() {
  var r = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  return this._file != null && (r.file = this._file), this._sourceRoot != null && (r.sourceRoot = this._sourceRoot), this._sourcesContents && (r.sourcesContent = this._generateSourcesContent(r.sources, r.sourceRoot)), r;
};
ue.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
};
var JS = ue;
const Sh = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function tA(r) {
  const t = new JS(), e = {
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
    if (f.loc && f.loc.start && Sh.has(f.type)) {
      const p = f.loc.start.line, m = f.loc.start.column - 1;
      (n.line !== p || n.column !== m) && (n.line = p, n.column = m, e.line = a, e.column = o, l && (l = !1, (e.line !== i.line || e.column !== i.column) && t.addMapping(s)), l = !0, t.addMapping({
        source: f.loc.source,
        original: n,
        generated: e
      }));
    }
    c.call(this, f), l && Sh.has(f.type) && (i.line = a, i.column = o);
  };
  const u = r.emit;
  r.emit = function(f, p, m) {
    for (let b = 0; b < f.length; b++)
      f.charCodeAt(b) === 10 ? (a++, o = 0) : o++;
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
const eA = 43, nA = 45, Al = (r, t) => {
  if (r === G && (r = t), typeof r == "string") {
    const e = r.charCodeAt(0);
    return e > 127 ? 32768 : e << 8;
  }
  return r;
}, wg = [
  [R, R],
  [R, K],
  [R, Nt],
  [R, Ut],
  [R, "-"],
  [R, F],
  [R, ht],
  [R, W],
  [R, Vt],
  [R, St],
  [bt, R],
  [bt, K],
  [bt, Nt],
  [bt, Ut],
  [bt, "-"],
  [bt, F],
  [bt, ht],
  [bt, W],
  [bt, Vt],
  [ot, R],
  [ot, K],
  [ot, Nt],
  [ot, Ut],
  [ot, "-"],
  [ot, F],
  [ot, ht],
  [ot, W],
  [ot, Vt],
  [W, R],
  [W, K],
  [W, Nt],
  [W, Ut],
  [W, "-"],
  [W, F],
  [W, ht],
  [W, W],
  [W, Vt],
  ["#", R],
  ["#", K],
  ["#", Nt],
  ["#", Ut],
  ["#", "-"],
  ["#", F],
  ["#", ht],
  ["#", W],
  ["#", Vt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", R],
  ["-", K],
  ["-", Nt],
  ["-", Ut],
  ["-", "-"],
  ["-", F],
  ["-", ht],
  ["-", W],
  ["-", Vt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [F, R],
  [F, K],
  [F, Nt],
  [F, Ut],
  [F, F],
  [F, ht],
  [F, W],
  [F, "%"],
  [F, Vt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", R],
  ["@", K],
  ["@", Nt],
  ["@", Ut],
  ["@", "-"],
  ["@", Vt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", F],
  [".", ht],
  [".", W],
  ["+", F],
  ["+", ht],
  ["+", W],
  ["/", "*"]
], rA = wg.concat([
  [R, ot],
  [W, ot],
  [ot, ot],
  [bt, St],
  [bt, rn],
  [bt, Rt],
  [ht, ht],
  [ht, W],
  [ht, K],
  [ht, "-"],
  [rt, R],
  [rt, K],
  [rt, ht],
  [rt, W],
  [rt, ot],
  [rt, "-"]
]);
function xg(r) {
  const t = new Set(
    r.map(([e, n]) => Al(e) << 16 | Al(n))
  );
  return function(e, n, i) {
    const s = Al(n, i), a = i.charCodeAt(0);
    return (a === nA && n !== R && n !== K && n !== Vt || a === eA ? t.has(e << 16 | a << 8) : t.has(e << 16 | s)) && this.emit(" ", ft, !0), s;
  };
}
const iA = xg(wg), kg = xg(rA), Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe: kg,
  spec: iA
}, Symbol.toStringTag, { value: "Module" })), sA = 92;
function aA(r, t) {
  if (typeof t == "function") {
    let e = null;
    r.children.forEach((n) => {
      e !== null && t.call(this, e), this.node(n), e = n;
    });
    return;
  }
  r.children.forEach(this.node, this);
}
function oA(r) {
  io(r, (t, e, n) => {
    this.token(t, r.slice(e, n));
  });
}
function lA(r) {
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
      tokenBefore: kg,
      token(l, c) {
        s = this.tokenBefore(s, l, c), this.emit(c, l, !1), l === G && c.charCodeAt(0) === sA && this.emit(`
`, ft, !0);
      },
      emit(l) {
        i += l;
      },
      result() {
        return i;
      }
    };
    n && (typeof n.decorator == "function" && (a = n.decorator(a)), n.sourceMap && (a = tA(a)), n.mode in Ah && (a.tokenBefore = Ah[n.mode]));
    const o = {
      node: (l) => a.node(l),
      children: aA,
      token: (l, c) => a.token(l, c),
      tokenize: oA
    };
    return a.node(e), a.result();
  };
}
function cA(r) {
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
const { hasOwnProperty: qu } = Object.prototype, $i = function() {
};
function Eh(r) {
  return typeof r == "function" ? r : $i;
}
function Ch(r, t) {
  return function(e, n, i) {
    e.type === t && r.call(this, e, n, i);
  };
}
function uA(r, t) {
  const e = t.structure, n = [];
  for (const i in e) {
    if (qu.call(e, i) === !1)
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
function dA(r) {
  const t = {};
  for (const e in r.node)
    if (qu.call(r.node, e)) {
      const n = r.node[e];
      if (!n.structure)
        throw new Error("Missed `structure` field in `" + e + "` node type definition");
      t[e] = uA(e, n);
    }
  return t;
}
function Th(r, t) {
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
function Lh({
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
function hA(r) {
  const t = dA(r), e = {}, n = {}, i = Symbol("break-walk"), s = Symbol("skip-node");
  for (const c in t)
    qu.call(t, c) && t[c] !== null && (e[c] = Th(t[c], !1), n[c] = Th(t[c], !0));
  const a = Lh(e), o = Lh(n), l = function(c, u) {
    function h(v, k, A) {
      const E = f.call(w, v, k, A);
      return E === i ? !0 : E === s ? !1 : !!(m.hasOwnProperty(v.type) && m[v.type](v, w, h, b) || p.call(w, v, k, A) === i);
    }
    let f = $i, p = $i, m = e, b = (v, k, A, E) => v || h(k, A, E);
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
    else if (u && (f = Eh(u.enter), p = Eh(u.leave), u.reverse && (m = n), u.visit)) {
      if (a.hasOwnProperty(u.visit))
        m = u.reverse ? o[u.visit] : a[u.visit];
      else if (!t.hasOwnProperty(u.visit))
        throw new Error("Bad value `" + u.visit + "` for `visit` option (should be: " + Object.keys(t).sort().join(", ") + ")");
      f = Ch(f, u.visit), p = Ch(p, u.visit);
    }
    if (f === $i && p === $i)
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
function fA(r) {
  return r;
}
function pA(r) {
  const { min: t, max: e, comma: n } = r;
  return t === 0 && e === 0 ? n ? "#?" : "*" : t === 0 && e === 1 ? "?" : t === 1 && e === 0 ? n ? "#" : "+" : t === 1 && e === 1 ? "" : (n ? "#" : "") + (t === e ? "{" + t + "}" : "{" + t + "," + (e !== 0 ? e : "") + "}");
}
function gA(r) {
  switch (r.type) {
    case "Range":
      return " [" + (r.min === null ? "-∞" : r.min) + "," + (r.max === null ? "∞" : r.max) + "]";
    default:
      throw new Error("Unknown node type `" + r.type + "`");
  }
}
function mA(r, t, e, n) {
  const i = r.combinator === " " || n ? r.combinator : " " + r.combinator + " ", s = r.terms.map((a) => _u(a, t, e, n)).join(i);
  return r.explicit || e ? (n || s[0] === "," ? "[" : "[ ") + s + (n ? "]" : " ]") : s;
}
function _u(r, t, e, n) {
  let i;
  switch (r.type) {
    case "Group":
      i = mA(r, t, e, n) + (r.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return _u(r.term, t, e, n) + t(pA(r), r);
    case "Type":
      i = "<" + r.name + (r.opts ? t(gA(r.opts), r.opts) : "") + ">";
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
function Ru(r, t) {
  let e = fA, n = !1, i = !1;
  return typeof t == "function" ? e = t : t && (n = !!t.forceBraces, i = !!t.compact, typeof t.decorate == "function" && (e = t.decorate)), _u(r, e, n, i);
}
const Dh = { offset: 0, line: 1, column: 1 };
function bA(r, t) {
  const e = r.tokens, n = r.longestMatch, i = n < e.length && e[n].node || null, s = i !== t ? i : null;
  let a = 0, o = 0, l = 0, c = "", u, h;
  for (let f = 0; f < e.length; f++) {
    const p = e[f].value;
    f === n && (o = p.length, a = c.length), s !== null && e[f].node === s && (f <= n ? l++ : l = 0), c += p;
  }
  return n === e.length || l > 1 ? (u = ra(s || t, "end") || ji(Dh, c), h = ji(u)) : (u = ra(s, "start") || ji(ra(t, "start") || Dh, c.slice(0, a)), h = ra(s, "end") || ji(u, c.substr(a, o))), {
    css: c,
    mismatchOffset: a,
    mismatchLength: o,
    start: u,
    end: h
  };
}
function ra(r, t) {
  const e = r && r.loc && r.loc[t];
  return e ? "line" in e ? ji(e) : e : null;
}
function ji({ offset: r, line: t, column: e }, n) {
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
const zi = function(r, t) {
  const e = so(
    "SyntaxReferenceError",
    r + (t ? " `" + t + "`" : "")
  );
  return e.reference = t, e;
}, yA = function(r, t, e, n) {
  const i = so("SyntaxMatchError", r), {
    css: s,
    mismatchOffset: a,
    mismatchLength: o,
    start: l,
    end: c
  } = bA(n, e);
  return i.rawMessage = r, i.syntax = t ? Ru(t) : "<generic>", i.css = s, i.mismatchOffset = a, i.mismatchLength = o, i.message = r + `
  syntax: ` + i.syntax + `
   value: ` + (s || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, l), i.loc = {
    source: e && e.loc && e.loc.source || "<unknown>",
    start: l,
    end: c
  }, i;
}, ia = /* @__PURE__ */ new Map(), Tr = /* @__PURE__ */ new Map(), Ma = 45, El = vA, Ih = wA;
function zu(r, t) {
  return t = t || 0, r.length - t >= 2 && r.charCodeAt(t) === Ma && r.charCodeAt(t + 1) === Ma;
}
function Sg(r, t) {
  if (t = t || 0, r.length - t >= 3 && r.charCodeAt(t) === Ma && r.charCodeAt(t + 1) !== Ma) {
    const e = r.indexOf("-", t + 2);
    if (e !== -1)
      return r.substring(t, e + 1);
  }
  return "";
}
function vA(r) {
  if (ia.has(r))
    return ia.get(r);
  const t = r.toLowerCase();
  let e = ia.get(t);
  if (e === void 0) {
    const n = zu(t, 0), i = n ? "" : Sg(t, 0);
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
function wA(r) {
  if (Tr.has(r))
    return Tr.get(r);
  let t = r, e = r[0];
  e === "/" ? e = r[1] === "/" ? "//" : "/" : e !== "_" && e !== "*" && e !== "$" && e !== "#" && e !== "+" && e !== "&" && (e = "");
  const n = zu(t, e.length);
  if (!n && (t = t.toLowerCase(), Tr.has(t))) {
    const o = Tr.get(t);
    return Tr.set(r, o), o;
  }
  const i = n ? "" : Sg(t, e.length), s = t.substr(0, e.length + i.length), a = Object.freeze({
    basename: t.substr(s.length),
    name: t.substr(e.length),
    hack: e,
    vendor: i,
    prefix: s,
    custom: n
  });
  return Tr.set(r, a), a;
}
const Ag = [
  "initial",
  "inherit",
  "unset",
  "revert",
  "revert-layer"
], ds = 43, $e = 45, Cl = 110, Lr = !0, xA = !1;
function yc(r, t) {
  return r !== null && r.type === G && r.value.charCodeAt(0) === t;
}
function Wi(r, t, e) {
  for (; r !== null && (r.type === ft || r.type === jt); )
    r = e(++t);
  return t;
}
function Cn(r, t, e, n) {
  if (!r)
    return 0;
  const i = r.value.charCodeAt(t);
  if (i === ds || i === $e) {
    if (e)
      return 0;
    t++;
  }
  for (; t < r.value.length; t++)
    if (!At(r.value.charCodeAt(t)))
      return 0;
  return n + 1;
}
function Tl(r, t, e) {
  let n = !1, i = Wi(r, t, e);
  if (r = e(i), r === null)
    return t;
  if (r.type !== F)
    if (yc(r, ds) || yc(r, $e)) {
      if (n = !0, i = Wi(e(++i), i, e), r = e(i), r === null || r.type !== F)
        return 0;
    } else
      return t;
  if (!n) {
    const s = r.value.charCodeAt(0);
    if (s !== ds && s !== $e)
      return 0;
  }
  return Cn(r, n ? 0 : 1, n, i);
}
function kA(r, t) {
  let e = 0;
  if (!r)
    return 0;
  if (r.type === F)
    return Cn(r, 0, xA, e);
  if (r.type === R && r.value.charCodeAt(0) === $e) {
    if (!Yr(r.value, 1, Cl))
      return 0;
    switch (r.value.length) {
      case 2:
        return Tl(t(++e), e, t);
      case 3:
        return r.value.charCodeAt(2) !== $e ? 0 : (e = Wi(t(++e), e, t), r = t(e), Cn(r, 0, Lr, e));
      default:
        return r.value.charCodeAt(2) !== $e ? 0 : Cn(r, 3, Lr, e);
    }
  } else if (r.type === R || yc(r, ds) && t(e + 1).type === R) {
    if (r.type !== R && (r = t(++e)), r === null || !Yr(r.value, 0, Cl))
      return 0;
    switch (r.value.length) {
      case 1:
        return Tl(t(++e), e, t);
      case 2:
        return r.value.charCodeAt(1) !== $e ? 0 : (e = Wi(t(++e), e, t), r = t(e), Cn(r, 0, Lr, e));
      default:
        return r.value.charCodeAt(1) !== $e ? 0 : Cn(r, 2, Lr, e);
    }
  } else if (r.type === W) {
    let n = r.value.charCodeAt(0), i = n === ds || n === $e ? 1 : 0, s = i;
    for (; s < r.value.length && At(r.value.charCodeAt(s)); s++)
      ;
    return s === i || !Yr(r.value, s, Cl) ? 0 : s + 1 === r.value.length ? Tl(t(++e), e, t) : r.value.charCodeAt(s + 1) !== $e ? 0 : s + 2 === r.value.length ? (e = Wi(t(++e), e, t), r = t(e), Cn(r, 0, Lr, e)) : Cn(r, s + 2, Lr, e);
  }
  return 0;
}
const SA = 43, Eg = 45, Cg = 63, AA = 117;
function vc(r, t) {
  return r !== null && r.type === G && r.value.charCodeAt(0) === t;
}
function EA(r, t) {
  return r.value.charCodeAt(0) === t;
}
function Fi(r, t, e) {
  let n = 0;
  for (let i = t; i < r.value.length; i++) {
    const s = r.value.charCodeAt(i);
    if (s === Eg && e && n !== 0)
      return Fi(r, t + n + 1, !1), 6;
    if (!zn(s) || ++n > 6)
      return 0;
  }
  return n;
}
function sa(r, t, e) {
  if (!r)
    return 0;
  for (; vc(e(t), Cg); ) {
    if (++r > 6)
      return 0;
    t++;
  }
  return t;
}
function CA(r, t) {
  let e = 0;
  if (r === null || r.type !== R || !Yr(r.value, 0, AA) || (r = t(++e), r === null))
    return 0;
  if (vc(r, SA))
    return r = t(++e), r === null ? 0 : r.type === R ? sa(Fi(r, 0, !0), ++e, t) : vc(r, Cg) ? sa(1, ++e, t) : 0;
  if (r.type === F) {
    const n = Fi(r, 1, !0);
    return n === 0 ? 0 : (r = t(++e), r === null ? e : r.type === W || r.type === F ? !EA(r, Eg) || !Fi(r, 1, !1) ? 0 : e + 1 : sa(n, e, t));
  }
  return r.type === W ? sa(Fi(r, 1, !0), ++e, t) : 0;
}
const TA = ["calc(", "-moz-calc(", "-webkit-calc("], Pu = /* @__PURE__ */ new Map([
  [K, rt],
  [St, rt],
  [Jt, De],
  [zt, ce]
]);
function Se(r, t) {
  return t < r.length ? r.charCodeAt(t) : 0;
}
function Tg(r, t) {
  return us(r, 0, r.length, t);
}
function Lg(r, t) {
  for (let e = 0; e < t.length; e++)
    if (Tg(r, t[e]))
      return !0;
  return !1;
}
function Dg(r, t) {
  return t !== r.length - 2 ? !1 : Se(r, t) === 92 && // U+005C REVERSE SOLIDUS (\)
  At(Se(r, t + 1));
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
function LA(r, t) {
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case ce:
        case rt:
        case De:
          if (r.type !== e)
            break t;
          if (e = n.pop(), n.length === 0) {
            i++;
            break t;
          }
          break;
        case K:
        case St:
        case Jt:
        case zt:
          n.push(e), e = Pu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function re(r) {
  return function(t, e, n) {
    return t === null ? 0 : t.type === K && Lg(t.value, TA) ? LA(t, e) : r(t, e, n);
  };
}
function st(r) {
  return function(t) {
    return t === null || t.type !== r ? 0 : 1;
  };
}
function DA(r) {
  if (r === null || r.type !== R)
    return 0;
  const t = r.value.toLowerCase();
  return Lg(t, Ag) || Tg(t, "default") ? 0 : 1;
}
function IA(r) {
  return r === null || r.type !== R || Se(r.value, 0) !== 45 || Se(r.value, 1) !== 45 ? 0 : 1;
}
function OA(r) {
  if (r === null || r.type !== ot)
    return 0;
  const t = r.value.length;
  if (t !== 4 && t !== 5 && t !== 7 && t !== 9)
    return 0;
  for (let e = 1; e < t; e++)
    if (!zn(Se(r.value, e)))
      return 0;
  return 1;
}
function NA(r) {
  return r === null || r.type !== ot || !fa(Se(r.value, 1), Se(r.value, 2), Se(r.value, 3)) ? 0 : 1;
}
function MA(r, t) {
  if (!r)
    return 0;
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case no:
        case Ut:
          break t;
        case ce:
        case rt:
        case De:
          if (r.type !== e)
            break t;
          e = n.pop();
          break;
        case Yt:
          if (e === 0)
            break t;
          break;
        case G:
          if (e === 0 && r.value === "!")
            break t;
          break;
        case K:
        case St:
        case Jt:
        case zt:
          n.push(e), e = Pu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function qA(r, t) {
  if (!r)
    return 0;
  let e = 0, n = [], i = 0;
  t:
    do {
      switch (r.type) {
        case no:
        case Ut:
          break t;
        case ce:
        case rt:
        case De:
          if (r.type !== e)
            break t;
          e = n.pop();
          break;
        case K:
        case St:
        case Jt:
        case zt:
          n.push(e), e = Pu.get(r.type);
          break;
      }
      i++;
    } while (r = t(i));
  return i;
}
function dn(r) {
  return r && (r = new Set(r)), function(t, e, n) {
    if (t === null || t.type !== W)
      return 0;
    const i = ro(t.value, 0);
    if (r !== null) {
      const s = t.value.indexOf("\\", i), a = s === -1 || !Dg(t.value, s) ? t.value.substr(i) : t.value.substring(i, s);
      if (r.has(a.toLowerCase()) === !1)
        return 0;
    }
    return lo(n, t.value, i) ? 0 : 1;
  };
}
function _A(r, t, e) {
  return r === null || r.type !== ht || lo(e, r.value, r.value.length - 1) ? 0 : 1;
}
function Ig(r) {
  return typeof r != "function" && (r = function() {
    return 0;
  }), function(t, e, n) {
    return t !== null && t.type === F && Number(t.value) === 0 ? 1 : r(t, e, n);
  };
}
function RA(r, t, e) {
  if (r === null)
    return 0;
  const n = ro(r.value, 0);
  return n !== r.value.length && !Dg(r.value, n) || lo(e, r.value, n) ? 0 : 1;
}
function zA(r, t, e) {
  if (r === null || r.type !== F)
    return 0;
  let n = Se(r.value, 0) === 43 || // U+002B PLUS SIGN (+)
  Se(r.value, 0) === 45 ? 1 : 0;
  for (; n < r.value.length; n++)
    if (!At(Se(r.value, n)))
      return 0;
  return lo(e, r.value, n) ? 0 : 1;
}
const PA = {
  "ident-token": st(R),
  "function-token": st(K),
  "at-keyword-token": st(bt),
  "hash-token": st(ot),
  "string-token": st(rn),
  "bad-string-token": st(no),
  "url-token": st(Nt),
  "bad-url-token": st(Ut),
  "delim-token": st(G),
  "number-token": st(F),
  "percentage-token": st(ht),
  "dimension-token": st(W),
  "whitespace-token": st(ft),
  "CDO-token": st(xs),
  "CDC-token": st(Vt),
  "colon-token": st(Rt),
  "semicolon-token": st(Yt),
  "comma-token": st(sn),
  "[-token": st(Jt),
  "]-token": st(De),
  "(-token": st(St),
  ")-token": st(rt),
  "{-token": st(zt),
  "}-token": st(ce)
}, BA = {
  // token type aliases
  string: st(rn),
  ident: st(R),
  // percentage
  percentage: re(_A),
  // numeric
  zero: Ig(),
  number: re(RA),
  integer: re(zA),
  // complex types
  "custom-ident": DA,
  "custom-property-name": IA,
  "hex-color": OA,
  "id-selector": NA,
  // element( <id-selector> )
  "an-plus-b": kA,
  urange: CA,
  "declaration-value": MA,
  "any-value": qA
};
function $A(r) {
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
    dimension: re(dn(null)),
    angle: re(dn(t)),
    decibel: re(dn(e)),
    frequency: re(dn(n)),
    flex: re(dn(i)),
    length: re(Ig(dn(s))),
    resolution: re(dn(a)),
    semitones: re(dn(o)),
    time: re(dn(l))
  };
}
function jA(r) {
  return Y(Y(Y({}, PA), BA), $A(r));
}
const FA = [
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
], HA = ["deg", "grad", "rad", "turn"], UA = ["s", "ms"], VA = ["hz", "khz"], YA = ["dpi", "dpcm", "dppx", "x"], WA = ["fr"], GA = ["db"], KA = ["st"], Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angle: HA,
  decibel: GA,
  flex: WA,
  frequency: VA,
  length: FA,
  resolution: YA,
  semitones: KA,
  time: UA
}, Symbol.toStringTag, { value: "Module" }));
function QA(r, t, e) {
  return Object.assign(so("SyntaxError", r), {
    input: t,
    offset: e,
    rawMessage: r,
    message: r + `
  ` + t + `
--` + new Array((e || t.length) + 1).join("-") + "^"
  });
}
const XA = 9, ZA = 10, JA = 12, tE = 13, eE = 32;
class nE {
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
      if (e !== tE && e !== ZA && e !== JA && e !== eE && e !== XA)
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
    throw new QA(t, this.str, this.pos);
  }
}
const rE = 9, iE = 10, sE = 12, aE = 13, oE = 32, Og = 33, Bu = 35, Nh = 38, qa = 39, Ng = 40, lE = 41, Mg = 42, $u = 43, ju = 44, Mh = 45, Fu = 60, qg = 62, wc = 63, cE = 64, co = 91, Hu = 93, _a = 123, qh = 124, _h = 125, Rh = 8734, hs = new Uint8Array(128).map(
  (r, t) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0
), zh = {
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
function li(r) {
  let t = r.pos;
  for (; t < r.str.length; t++) {
    const e = r.str.charCodeAt(t);
    if (e >= 128 || hs[e] === 0)
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
function uE(r) {
  const t = r.str.indexOf("'", r.pos + 1);
  return t === -1 && (r.pos = r.str.length, r.error("Expect an apostrophe")), r.substringToPos(t + 1);
}
function Ph(r) {
  let t = null, e = null;
  return r.eat(_a), t = za(r), r.charCode() === ju ? (r.pos++, r.charCode() !== _h && (e = za(r))) : e = t, r.eat(_h), {
    min: Number(t),
    max: e ? Number(e) : 0
  };
}
function dE(r) {
  let t = null, e = !1;
  switch (r.charCode()) {
    case Mg:
      r.pos++, t = {
        min: 0,
        max: 0
      };
      break;
    case $u:
      r.pos++, t = {
        min: 1,
        max: 0
      };
      break;
    case wc:
      r.pos++, t = {
        min: 0,
        max: 1
      };
      break;
    case Bu:
      r.pos++, e = !0, r.charCode() === _a ? t = Ph(r) : r.charCode() === wc ? (r.pos++, t = {
        min: 0,
        max: 0
      }) : t = {
        min: 1,
        max: 0
      };
      break;
    case _a:
      t = Ph(r);
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
function ci(r, t) {
  const e = dE(r);
  return e !== null ? (e.term = t, r.charCode() === Bu && r.charCodeAt(r.pos - 1) === $u ? ci(r, e) : e) : t;
}
function Ll(r) {
  const t = r.peek();
  return t === "" ? null : {
    type: "Token",
    value: t
  };
}
function hE(r) {
  let t;
  return r.eat(Fu), r.eat(qa), t = li(r), r.eat(qa), r.eat(qg), ci(r, {
    type: "Property",
    name: t
  });
}
function fE(r) {
  let t = null, e = null, n = 1;
  return r.eat(co), r.charCode() === Mh && (r.peek(), n = -1), n == -1 && r.charCode() === Rh ? r.peek() : (t = n * Number(za(r)), hs[r.charCode()] !== 0 && (t += li(r))), Ra(r), r.eat(ju), Ra(r), r.charCode() === Rh ? r.peek() : (n = 1, r.charCode() === Mh && (r.peek(), n = -1), e = n * Number(za(r)), hs[r.charCode()] !== 0 && (e += li(r))), r.eat(Hu), {
    type: "Range",
    min: t,
    max: e
  };
}
function pE(r) {
  let t, e = null;
  return r.eat(Fu), t = li(r), r.charCode() === Ng && r.nextCharCode() === lE && (r.pos += 2, t += "()"), r.charCodeAt(r.findWsEnd(r.pos)) === co && (Ra(r), e = fE(r)), r.eat(qg), ci(r, {
    type: "Type",
    name: t,
    opts: e
  });
}
function gE(r) {
  const t = li(r);
  return r.charCode() === Ng ? (r.pos++, {
    type: "Function",
    name: t
  }) : ci(r, {
    type: "Keyword",
    name: t
  });
}
function mE(r, t) {
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
  for (t = Object.keys(t).sort((i, s) => zh[i] - zh[s]); t.length > 0; ) {
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
function _g(r) {
  const t = [], e = {};
  let n, i = null, s = r.pos;
  for (; n = yE(r); )
    n.type !== "Spaces" && (n.type === "Combinator" ? ((i === null || i.type === "Combinator") && (r.pos = s, r.error("Unexpected combinator")), e[n.value] = !0) : i !== null && i.type !== "Combinator" && (e[" "] = !0, t.push({
      type: "Combinator",
      value: " "
    })), t.push(n), i = n, s = r.pos);
  return i !== null && i.type === "Combinator" && (r.pos -= s, r.error("Unexpected combinator")), {
    type: "Group",
    terms: t,
    combinator: mE(t, e) || " ",
    disallowEmpty: !1,
    explicit: !1
  };
}
function bE(r) {
  let t;
  return r.eat(co), t = _g(r), r.eat(Hu), t.explicit = !0, r.charCode() === Og && (r.pos++, t.disallowEmpty = !0), t;
}
function yE(r) {
  let t = r.charCode();
  if (t < 128 && hs[t] === 1)
    return gE(r);
  switch (t) {
    case Hu:
      break;
    case co:
      return ci(r, bE(r));
    case Fu:
      return r.nextCharCode() === qa ? hE(r) : pE(r);
    case qh:
      return {
        type: "Combinator",
        value: r.substringToPos(
          r.pos + (r.nextCharCode() === qh ? 2 : 1)
        )
      };
    case Nh:
      return r.pos++, r.eat(Nh), {
        type: "Combinator",
        value: "&&"
      };
    case ju:
      return r.pos++, {
        type: "Comma"
      };
    case qa:
      return ci(r, {
        type: "String",
        value: uE(r)
      });
    case oE:
    case rE:
    case iE:
    case aE:
    case sE:
      return {
        type: "Spaces",
        value: Ra(r)
      };
    case cE:
      return t = r.nextCharCode(), t < 128 && hs[t] === 1 ? (r.pos++, {
        type: "AtKeyword",
        name: li(r)
      }) : Ll(r);
    case Mg:
    case $u:
    case wc:
    case Bu:
    case Og:
      break;
    case _a:
      if (t = r.nextCharCode(), t < 48 || t > 57)
        return Ll(r);
      break;
    default:
      return Ll(r);
  }
}
function Rg(r) {
  const t = new nE(r), e = _g(t);
  return t.pos !== r.length && t.error("Unexpected input"), e.terms.length === 1 && e.terms[0].type === "Group" ? e.terms[0] : e;
}
const Hi = function() {
};
function Bh(r) {
  return typeof r == "function" ? r : Hi;
}
function vE(r, t, e) {
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
  let i = Hi, s = Hi;
  if (typeof t == "function" ? i = t : t && (i = Bh(t.enter), s = Bh(t.leave)), i === Hi && s === Hi)
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  n(r);
}
const wE = {
  decorator(r) {
    const t = [];
    let e = null;
    return Bt(Y({}, r), {
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
function xE(r) {
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
function kE(r, t) {
  return typeof r == "string" ? xE(r) : t.generate(r, wE);
}
const J = { type: "Match" }, nt = { type: "Mismatch" }, Uu = { type: "DisallowEmpty" }, SE = 40, AE = 41;
function Ot(r, t, e) {
  return t === J && e === nt || r === J && t === J && e === J ? r : (r.type === "If" && r.else === nt && t === J && (t = r.then, r = r.match), {
    type: "If",
    match: r,
    then: t,
    else: e
  });
}
function zg(r) {
  return r.length > 2 && r.charCodeAt(r.length - 2) === SE && r.charCodeAt(r.length - 1) === AE;
}
function $h(r) {
  return r.type === "Keyword" || r.type === "AtKeyword" || r.type === "Function" || r.type === "Type" && zg(r.name);
}
function xc(r, t, e) {
  switch (r) {
    case " ": {
      let n = J;
      for (let i = t.length - 1; i >= 0; i--) {
        const s = t[i];
        n = Ot(
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
        if ($h(a) && (i === null && s > 0 && $h(t[s - 1]) && (i = /* @__PURE__ */ Object.create(null), n = Ot(
          {
            type: "Enum",
            map: i
          },
          J,
          n
        )), i !== null)) {
          const o = (zg(a.name) ? a.name.slice(0, -1) : a.name).toLowerCase();
          if (!(o in i)) {
            i[o] = a;
            continue;
          }
        }
        i = null, n = Ot(
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
        t.length > 1 ? a = xc(
          r,
          t.filter(function(o) {
            return o !== s;
          }),
          !1
        ) : a = J, n = Ot(
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
        t.length > 1 ? a = xc(
          r,
          t.filter(function(o) {
            return o !== s;
          }),
          !0
        ) : a = J, n = Ot(
          s,
          a,
          n
        );
      }
      return n;
    }
  }
}
function EE(r) {
  let t = J, e = Vu(r.term);
  if (r.max === 0)
    e = Ot(
      e,
      Uu,
      nt
    ), t = Ot(
      e,
      null,
      // will be a loop
      nt
    ), t.then = Ot(
      J,
      J,
      t
      // make a loop
    ), r.comma && (t.then.else = Ot(
      { type: "Comma", syntax: r },
      t,
      nt
    ));
  else
    for (let n = r.min || 1; n <= r.max; n++)
      r.comma && t !== J && (t = Ot(
        { type: "Comma", syntax: r },
        t,
        nt
      )), t = Ot(
        e,
        Ot(
          J,
          J,
          t
        ),
        nt
      );
  if (r.min === 0)
    t = Ot(
      J,
      J,
      t
    );
  else
    for (let n = 0; n < r.min - 1; n++)
      r.comma && t !== J && (t = Ot(
        { type: "Comma", syntax: r },
        t,
        nt
      )), t = Ot(
        e,
        t,
        nt
      );
  return t;
}
function Vu(r) {
  if (typeof r == "function")
    return {
      type: "Generic",
      fn: r
    };
  switch (r.type) {
    case "Group": {
      let t = xc(
        r.combinator,
        r.terms.map(Vu),
        !1
      );
      return r.disallowEmpty && (t = Ot(
        t,
        Uu,
        nt
      )), t;
    }
    case "Multiplier":
      return EE(r);
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
function kc(r, t) {
  return typeof r == "string" && (r = Rg(r)), {
    type: "MatchGraph",
    match: Vu(r),
    syntax: t || null,
    source: r
  };
}
const { hasOwnProperty: jh } = Object.prototype, CE = 0, TE = 1, Sc = 2, Pg = 3, Fh = "Match", LE = "Mismatch", DE = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", Hh = 15e3;
function IE(r) {
  let t = null, e = null, n = r;
  for (; n !== null; )
    e = n.prev, n.prev = t, t = n, n = e;
  return t;
}
function Dl(r, t) {
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
function OE(r) {
  return r.type !== G ? !1 : r.value !== "?";
}
function Uh(r) {
  return r === null ? !0 : r.type === sn || r.type === K || r.type === St || r.type === Jt || r.type === zt || OE(r);
}
function Vh(r) {
  return r === null ? !0 : r.type === rt || r.type === De || r.type === ce || r.type === G && r.value === "/";
}
function NE(r, t, e) {
  function n() {
    do
      k++, v = k < r.length ? r[k] : null;
    while (v !== null && (v.type === ft || v.type === jt));
  }
  function i(T) {
    const M = k + T;
    return M < r.length ? r[M] : null;
  }
  function s(T, M) {
    return {
      nextState: T,
      matchStack: E,
      syntaxStack: h,
      thenStack: f,
      tokenIndex: k,
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
      type: TE,
      syntax: t.syntax,
      token: v,
      prev: E
    }, n(), m = null, k > A && (A = k);
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
      type: Pg,
      syntax: h.syntax,
      token: E.token,
      prev: E
    }, h = h.prev;
  }
  let h = null, f = null, p = null, m = null, b = 0, w = null, v = null, k = -1, A = 0, E = {
    type: CE,
    syntax: null,
    token: null,
    prev: null
  };
  for (n(); w === null && ++b < Hh; )
    switch (t.type) {
      case "Match":
        if (f === null) {
          if (v !== null && (k !== r.length - 1 || v.value !== "\\0" && v.value !== "\\9")) {
            t = nt;
            break;
          }
          w = Fh;
          break;
        }
        if (t = f.nextState, t === Uu)
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
          (p === null || k > p.tokenIndex) && (p = m, m = !1);
        else if (p === null) {
          w = LE;
          break;
        }
        t = p.nextState, f = p.thenStack, h = p.syntaxStack, E = p.matchStack, k = p.tokenIndex, v = k < r.length ? r[k] : null, p = p.prev;
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
          const S = 1 << t.index;
          if (!(t.mask & S)) {
            o(t), a({
              type: "AddMatchOnce",
              syntax: t.syntax,
              mask: t.mask | S
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
          if (N.indexOf("\\") !== -1 && (N = N.replace(/\\[09].*$/, "")), jh.call(t.map, N)) {
            t = t.map[N];
            break;
          }
        }
        t = nt;
        break;
      case "Generic": {
        const N = h !== null ? h.opts : null, S = k + Math.floor(t.fn(v, i, N));
        if (!isNaN(S) && S > k) {
          for (; k < S; )
            l();
          t = J;
        } else
          t = nt;
        break;
      }
      case "Type":
      case "Property": {
        const N = t.type === "Type" ? "types" : "properties", S = jh.call(e, N) ? e[N][t.name] : null;
        if (!S || !S.match)
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
        c(), t = S.match;
        break;
      }
      case "Keyword": {
        const N = t.name;
        if (v !== null) {
          let S = v.value;
          if (S.indexOf("\\") !== -1 && (S = S.replace(/\\[09].*$/, "")), Dl(S, N)) {
            l(), t = J;
            break;
          }
        }
        t = nt;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (v !== null && Dl(v.value, t.name)) {
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
        v !== null && v.type === sn ? Uh(E.token) ? t = nt : (l(), t = Vh(v) ? nt : J) : t = Uh(E.token) || Vh(v) ? J : nt;
        break;
      case "String":
        let T = "", M = k;
        for (; M < r.length && T.length < t.value.length; M++)
          T += r[M].value;
        if (Dl(T, t.value)) {
          for (; k < M; )
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
      console.warn("[csstree-match] BREAK after " + Hh + " iterations"), w = DE, E = null;
      break;
    case Fh:
      for (; h !== null; )
        u();
      break;
    default:
      E = null;
  }
  return {
    tokens: r,
    reason: w,
    iterations: b,
    match: E,
    longestMatch: A
  };
}
function Yh(r, t, e) {
  const n = NE(r, t, e || {});
  if (n.match === null)
    return n;
  let i = n.match, s = n.match = {
    syntax: t.syntax || null,
    match: []
  };
  const a = [s];
  for (i = IE(i).prev; i !== null; ) {
    switch (i.type) {
      case Sc:
        s.match.push(s = {
          syntax: i.syntax,
          match: []
        }), a.push(s);
        break;
      case Pg:
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
function Bg(r) {
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
function ME(r, t) {
  return Yu(this, r, (e) => e.type === "Type" && e.name === t);
}
function qE(r, t) {
  return Yu(this, r, (e) => e.type === "Property" && e.name === t);
}
function _E(r) {
  return Yu(this, r, (t) => t.type === "Keyword");
}
function Yu(r, t, e) {
  const n = Bg.call(r, t);
  return n === null ? !1 : n.some(e);
}
const RE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getTrace: Bg,
  isKeyword: _E,
  isProperty: qE,
  isType: ME
}, Symbol.toStringTag, { value: "Module" }));
function $g(r) {
  return "node" in r ? r.node : $g(r.match[0]);
}
function jg(r) {
  return "node" in r ? r.node : jg(r.match[r.match.length - 1]);
}
function Wh(r, t, e, n, i) {
  function s(o) {
    if (o.syntax !== null && o.syntax.type === n && o.syntax.name === i) {
      const l = $g(o), c = jg(o);
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
const { hasOwnProperty: Gi } = Object.prototype;
function Il(r) {
  return typeof r == "number" && isFinite(r) && Math.floor(r) === r && r >= 0;
}
function Gh(r) {
  return !!r && Il(r.offset) && Il(r.line) && Il(r.column);
}
function zE(r, t) {
  return function(e, n) {
    if (!e || e.constructor !== Object)
      return n(e, "Type of node should be an Object");
    for (let i in e) {
      let s = !0;
      if (Gi.call(e, i) !== !1) {
        if (i === "type")
          e.type !== r && n(e, "Wrong node type `" + e.type + "`, expected `" + r + "`");
        else if (i === "loc") {
          if (e.loc === null)
            continue;
          if (e.loc && e.loc.constructor === Object)
            if (typeof e.loc.source != "string")
              i += ".source";
            else if (!Gh(e.loc.start))
              i += ".start";
            else if (!Gh(e.loc.end))
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
      Gi.call(t, i) && Gi.call(e, i) === !1 && n(e, "Field `" + r + "." + i + "` is missed");
  };
}
function PE(r, t) {
  const e = t.structure, n = {
    type: String,
    loc: !0
  }, i = {
    type: '"' + r + '"'
  };
  for (const s in e) {
    if (Gi.call(e, s) === !1)
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
    check: zE(r, n)
  };
}
function BE(r) {
  const t = {};
  if (r.node) {
    for (const e in r.node)
      if (Gi.call(r.node, e)) {
        const n = r.node[e];
        if (n.structure)
          t[e] = PE(e, n);
        else
          throw new Error("Missed `structure` field in `" + e + "` node type definition");
      }
  }
  return t;
}
const $E = kc(Ag.join(" | "));
function Ac(r, t, e) {
  const n = {};
  for (const i in r)
    r[i].syntax && (n[i] = e ? r[i].syntax : Ru(r[i].syntax, { compact: t }));
  return n;
}
function jE(r, t, e) {
  const n = {};
  for (const [i, s] of Object.entries(r))
    n[i] = {
      prelude: s.prelude && (e ? s.prelude.syntax : Ru(s.prelude.syntax, { compact: t })),
      descriptors: s.descriptors && Ac(s.descriptors, t, e)
    };
  return n;
}
function FE(r) {
  for (let t = 0; t < r.length; t++)
    if (r[t].value.toLowerCase() === "var(")
      return !0;
  return !1;
}
function be(r, t, e) {
  return Y({
    matched: r,
    iterations: e,
    error: t
  }, RE);
}
function Dr(r, t, e, n) {
  const i = kE(e, r.syntax);
  let s;
  return FE(i) ? be(null, new Error("Matching for a tree with var() is not supported")) : (n && (s = Yh(i, r.cssWideKeywordsSyntax, r)), (!n || !s.match) && (s = Yh(i, t.match, r), !s.match) ? be(
    null,
    new yA(s.reason, t.syntax, e, s),
    s.iterations
  ) : be(s.match, null, s.iterations));
}
class Kh {
  constructor(t, e, n) {
    if (this.cssWideKeywordsSyntax = $E, this.syntax = e, this.generic = !1, this.units = Y({}, Oh), this.atrules = /* @__PURE__ */ Object.create(null), this.properties = /* @__PURE__ */ Object.create(null), this.types = /* @__PURE__ */ Object.create(null), this.structure = n || BE(t), t) {
      if (t.units)
        for (const i of Object.keys(Oh))
          Array.isArray(t.units[i]) && (this.units[i] = t.units[i]);
      if (t.types)
        for (const i in t.types)
          this.addType_(i, t.types[i]);
      if (t.generic) {
        this.generic = !0;
        for (const [i, s] of Object.entries(jA(this.units)))
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
    return typeof t == "function" ? a.match = kc(t, s) : (typeof t == "string" ? Object.defineProperty(a, "syntax", {
      get() {
        return Object.defineProperty(a, "syntax", {
          value: Rg(t)
        }), a.syntax;
      }
    }) : a.syntax = t, Object.defineProperty(a, "match", {
      get() {
        return Object.defineProperty(a, "match", {
          value: kc(a.syntax, s)
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
      return new zi("Unknown at-rule", "@" + t);
  }
  checkAtrulePrelude(t, e) {
    const n = this.checkAtruleName(t);
    if (n)
      return n;
    const i = this.getAtrule(t);
    if (!i.prelude && e)
      return new SyntaxError("At-rule `@" + t + "` should not contain a prelude");
    if (i.prelude && !e && !Dr(this, i.prelude, "", !1).matched)
      return new SyntaxError("At-rule `@" + t + "` should contain a prelude");
  }
  checkAtruleDescriptorName(t, e) {
    const n = this.checkAtruleName(t);
    if (n)
      return n;
    const i = this.getAtrule(t), s = El(e);
    if (!i.descriptors)
      return new SyntaxError("At-rule `@" + t + "` has no known descriptors");
    if (!i.descriptors[s.name] && !i.descriptors[s.basename])
      return new zi("Unknown at-rule descriptor", e);
  }
  checkPropertyName(t) {
    if (!this.getProperty(t))
      return new zi("Unknown property", t);
  }
  matchAtrulePrelude(t, e) {
    const n = this.checkAtrulePrelude(t, e);
    if (n)
      return be(null, n);
    const i = this.getAtrule(t);
    return i.prelude ? Dr(this, i.prelude, e || "", !1) : be(null, null);
  }
  matchAtruleDescriptor(t, e, n) {
    const i = this.checkAtruleDescriptorName(t, e);
    if (i)
      return be(null, i);
    const s = this.getAtrule(t), a = El(e);
    return Dr(this, s.descriptors[a.name] || s.descriptors[a.basename], n, !1);
  }
  matchDeclaration(t) {
    return t.type !== "Declaration" ? be(null, new Error("Not a Declaration node")) : this.matchProperty(t.property, t.value);
  }
  matchProperty(t, e) {
    if (Ih(t).custom)
      return be(null, new Error("Lexer matching doesn't applicable for custom properties"));
    const n = this.checkPropertyName(t);
    return n ? be(null, n) : Dr(this, this.getProperty(t), e, !0);
  }
  matchType(t, e) {
    const n = this.getType(t);
    return n ? Dr(this, n, e, !1) : be(null, new zi("Unknown type", t));
  }
  match(t, e) {
    return typeof t != "string" && (!t || !t.type) ? be(null, new zi("Bad syntax")) : ((typeof t == "string" || !t.match) && (t = this.createDescriptor(t, "Type", "anonymous")), Dr(this, t, e, !1));
  }
  findValueFragments(t, e, n, i) {
    return Wh(this, e, this.matchProperty(t, e), n, i);
  }
  findDeclarationValueFragments(t, e, n) {
    return Wh(this, t.value, this.matchDeclaration(t), e, n);
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
    const n = El(t);
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
    const n = Ih(t);
    return (n.vendor && e ? this.properties[n.name] || this.properties[n.basename] : this.properties[n.name]) || null;
  }
  getType(t) {
    return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
  }
  validate() {
    function t(i, s, a, o) {
      if (a.has(s))
        return a.get(s);
      a.set(s, !1), o.syntax !== null && vE(o.syntax, function(l) {
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
      types: Ac(this.types, !e, t),
      properties: Ac(this.properties, !e, t),
      atrules: jE(this.atrules, !e, t)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
}
function Ol(r, t) {
  return typeof t == "string" && /^\s*\|/.test(t) ? typeof r == "string" ? r + t : t.replace(/^\s*\|\s*/, "") : t || null;
}
function Qh(r, t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const [n, i] of Object.entries(r))
    if (i) {
      e[n] = {};
      for (const s of Object.keys(i))
        t.includes(s) && (e[n][s] = i[s]);
    }
  return e;
}
function Ec(r, t) {
  const e = Y({}, r);
  for (const [n, i] of Object.entries(t))
    switch (n) {
      case "generic":
        e[n] = !!i;
        break;
      case "units":
        e[n] = Y({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = Array.isArray(a) ? a : [];
        break;
      case "atrules":
        e[n] = Y({}, r[n]);
        for (const [s, a] of Object.entries(i)) {
          const o = e[n][s] || {}, l = e[n][s] = {
            prelude: o.prelude || null,
            descriptors: Y({}, o.descriptors)
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
        e[n] = Y({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = Ol(e[n][s], a);
        break;
      case "scope":
        e[n] = Y({}, r[n]);
        for (const [s, a] of Object.entries(i))
          e[n][s] = Y(Y({}, e[n][s]), a);
        break;
      case "parseContext":
        e[n] = Y(Y({}, r[n]), i);
        break;
      case "atrule":
      case "pseudo":
        e[n] = Y(Y({}, r[n]), Qh(i, ["parse"]));
        break;
      case "node":
        e[n] = Y(Y({}, r[n]), Qh(i, ["name", "structure", "parse", "generate", "walkContext"]));
        break;
    }
  return e;
}
function Fg(r) {
  const t = GS(r), e = hA(r), n = lA(r), { fromPlainObject: i, toPlainObject: s } = cA(e), a = {
    lexer: null,
    createLexer: (o) => new Kh(o, a, a.lexer.structure),
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
      const l = Ec({}, r);
      return Fg(
        typeof o == "function" ? o(l, Object.assign) : Ec(l, o)
      );
    }
  };
  return a.lexer = new Kh({
    generic: !0,
    units: r.units,
    types: r.types,
    atrules: r.atrules,
    properties: r.properties,
    node: r.node
  }, a), a;
}
const HE = (r) => Fg(Ec({}, r)), UE = {
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
}, Fe = 43, Wt = 45, ga = 110, Qn = !0, VE = !1;
function ma(r, t) {
  let e = this.tokenStart + r;
  const n = this.charCodeAt(e);
  for ((n === Fe || n === Wt) && (t && this.error("Number sign is not allowed"), e++); e < this.tokenEnd; e++)
    At(this.charCodeAt(e)) || this.error("Integer is expected", e);
}
function zr(r) {
  return ma.call(this, 0, r);
}
function An(r, t) {
  if (!this.cmpChar(this.tokenStart + r, t)) {
    let e = "";
    switch (t) {
      case ga:
        e = "N is expected";
        break;
      case Wt:
        e = "HyphenMinus is expected";
        break;
    }
    this.error(e, this.tokenStart + r);
  }
}
function Nl() {
  let r = 0, t = 0, e = this.tokenType;
  for (; e === ft || e === jt; )
    e = this.lookupType(++r);
  if (e !== F)
    if (this.isDelim(Fe, r) || this.isDelim(Wt, r)) {
      t = this.isDelim(Fe, r) ? Fe : Wt;
      do
        e = this.lookupType(++r);
      while (e === ft || e === jt);
      e !== F && (this.skip(r), zr.call(this, Qn));
    } else
      return null;
  return r > 0 && this.skip(r), t === 0 && (e = this.charCodeAt(this.tokenStart), e !== Fe && e !== Wt && this.error("Number sign is expected")), zr.call(this, t !== 0), t === Wt ? "-" + this.consume(F) : this.consume(F);
}
const YE = "AnPlusB", WE = {
  a: [String, null],
  b: [String, null]
};
function Hg() {
  const r = this.tokenStart;
  let t = null, e = null;
  if (this.tokenType === F)
    zr.call(this, VE), e = this.consume(F);
  else if (this.tokenType === R && this.cmpChar(this.tokenStart, Wt))
    switch (t = "-1", An.call(this, 1, ga), this.tokenEnd - this.tokenStart) {
      case 2:
        this.next(), e = Nl.call(this);
        break;
      case 3:
        An.call(this, 2, Wt), this.next(), this.skipSC(), zr.call(this, Qn), e = "-" + this.consume(F);
        break;
      default:
        An.call(this, 2, Wt), ma.call(this, 3, Qn), this.next(), e = this.substrToCursor(r + 2);
    }
  else if (this.tokenType === R || this.isDelim(Fe) && this.lookupType(1) === R) {
    let n = 0;
    switch (t = "1", this.isDelim(Fe) && (n = 1, this.next()), An.call(this, 0, ga), this.tokenEnd - this.tokenStart) {
      case 1:
        this.next(), e = Nl.call(this);
        break;
      case 2:
        An.call(this, 1, Wt), this.next(), this.skipSC(), zr.call(this, Qn), e = "-" + this.consume(F);
        break;
      default:
        An.call(this, 1, Wt), ma.call(this, 2, Qn), this.next(), e = this.substrToCursor(r + n + 1);
    }
  } else if (this.tokenType === W) {
    const n = this.charCodeAt(this.tokenStart), i = n === Fe || n === Wt;
    let s = this.tokenStart + i;
    for (; s < this.tokenEnd && At(this.charCodeAt(s)); s++)
      ;
    s === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), An.call(this, s - this.tokenStart, ga), t = this.substring(r, s), s + 1 === this.tokenEnd ? (this.next(), e = Nl.call(this)) : (An.call(this, s - this.tokenStart + 1, Wt), s + 2 === this.tokenEnd ? (this.next(), this.skipSC(), zr.call(this, Qn), e = "-" + this.consume(F)) : (ma.call(this, s - this.tokenStart + 2, Qn), this.next(), e = this.substrToCursor(s + 1)));
  } else
    this.error();
  return t !== null && t.charCodeAt(0) === Fe && (t = t.substr(1)), e !== null && e.charCodeAt(0) === Fe && (e = e.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(r, this.tokenStart),
    a: t,
    b: e
  };
}
function GE(r) {
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
const KE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: GE,
  name: YE,
  parse: Hg,
  structure: WE
}, Symbol.toStringTag, { value: "Module" }));
function Xh(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function QE() {
  for (let r = 1, t; t = this.lookupType(r); r++) {
    if (t === ce)
      return !0;
    if (t === zt || t === bt)
      return !1;
  }
  return !1;
}
const XE = "Atrule", ZE = "atrule", JE = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function Ug(r = !1) {
  const t = this.tokenStart;
  let e, n, i = null, s = null;
  switch (this.eat(bt), e = this.substrToCursor(t + 1), n = e.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== zt && this.tokenType !== Yt && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, e, r), Xh) : i = Xh.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case Yt:
      this.next();
      break;
    case zt:
      hasOwnProperty.call(this.atrule, n) && typeof this.atrule[n].block == "function" ? s = this.atrule[n].block.call(this, r) : s = this.Block(QE.call(this));
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
function tC(r) {
  this.token(bt, "@" + r.name), r.prelude !== null && this.node(r.prelude), r.block ? this.node(r.block) : this.token(Yt, ";");
}
const eC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: tC,
  name: XE,
  parse: Ug,
  structure: JE,
  walkContext: ZE
}, Symbol.toStringTag, { value: "Module" })), nC = "AtrulePrelude", rC = "atrulePrelude", iC = {
  children: [[]]
};
function Vg(r) {
  let t = null;
  return r !== null && (r = r.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, r) && typeof this.atrule[r].prelude == "function" ? t = this.atrule[r].prelude.call(this) : t = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== zt && this.tokenType !== Yt && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function sC(r) {
  this.children(r);
}
const aC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: sC,
  name: nC,
  parse: Vg,
  structure: iC,
  walkContext: rC
}, Symbol.toStringTag, { value: "Module" })), oC = 36, Yg = 42, ba = 61, lC = 94, Cc = 124, cC = 126;
function uC() {
  this.eof && this.error("Unexpected end of input");
  const r = this.tokenStart;
  let t = !1;
  return this.isDelim(Yg) ? (t = !0, this.next()) : this.isDelim(Cc) || this.eat(R), this.isDelim(Cc) ? this.charCodeAt(this.tokenStart + 1) !== ba ? (this.next(), this.eat(R)) : t && this.error("Identifier is expected", this.tokenEnd) : t && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function dC() {
  const r = this.tokenStart, t = this.charCodeAt(r);
  return t !== ba && // =
  t !== cC && // ~=
  t !== lC && // ^=
  t !== oC && // $=
  t !== Yg && // *=
  t !== Cc && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), t !== ba && (this.isDelim(ba) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(r);
}
const hC = "AttributeSelector", fC = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function Wg() {
  const r = this.tokenStart;
  let t, e = null, n = null, i = null;
  return this.eat(Jt), this.skipSC(), t = uC.call(this), this.skipSC(), this.tokenType !== De && (this.tokenType !== R && (e = dC.call(this), this.skipSC(), n = this.tokenType === rn ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === R && (i = this.consume(R), this.skipSC())), this.eat(De), {
    type: "AttributeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: t,
    matcher: e,
    value: n,
    flags: i
  };
}
function pC(r) {
  this.token(G, "["), this.node(r.name), r.matcher !== null && (this.tokenize(r.matcher), this.node(r.value)), r.flags !== null && this.token(R, r.flags), this.token(G, "]");
}
const gC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: pC,
  name: hC,
  parse: Wg,
  structure: fC
}, Symbol.toStringTag, { value: "Module" })), mC = 38;
function Gg(r) {
  return this.Raw(r, null, !0);
}
function Zh() {
  return this.parseWithFallback(this.Rule, Gg);
}
function Jh(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
function bC() {
  if (this.tokenType === Yt)
    return Jh.call(this, this.tokenIndex);
  const r = this.parseWithFallback(this.Declaration, Jh);
  return this.tokenType === Yt && this.next(), r;
}
const yC = "Block", vC = "block", wC = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function Kg(r) {
  const t = r ? bC : Zh, e = this.tokenStart;
  let n = this.createList();
  this.eat(zt);
  t:
    for (; !this.eof; )
      switch (this.tokenType) {
        case ce:
          break t;
        case ft:
        case jt:
          this.next();
          break;
        case bt:
          n.push(this.parseWithFallback(this.Atrule.bind(this, r), Gg));
          break;
        default:
          r && this.isDelim(mC) ? n.push(Zh.call(this)) : n.push(t.call(this));
      }
  return this.eof || this.eat(ce), {
    type: "Block",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function xC(r) {
  this.token(zt, "{"), this.children(r, (t) => {
    t.type === "Declaration" && this.token(Yt, ";");
  }), this.token(ce, "}");
}
const kC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xC,
  name: yC,
  parse: Kg,
  structure: wC,
  walkContext: vC
}, Symbol.toStringTag, { value: "Module" })), SC = "Brackets", AC = {
  children: [[]]
};
function Qg(r, t) {
  const e = this.tokenStart;
  let n = null;
  return this.eat(Jt), n = r.call(this, t), this.eof || this.eat(De), {
    type: "Brackets",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function EC(r) {
  this.token(G, "["), this.children(r), this.token(G, "]");
}
const CC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: EC,
  name: SC,
  parse: Qg,
  structure: AC
}, Symbol.toStringTag, { value: "Module" })), TC = "CDC", LC = [];
function Xg() {
  const r = this.tokenStart;
  return this.eat(Vt), {
    type: "CDC",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function DC() {
  this.token(Vt, "-->");
}
const IC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: DC,
  name: TC,
  parse: Xg,
  structure: LC
}, Symbol.toStringTag, { value: "Module" })), OC = "CDO", NC = [];
function Zg() {
  const r = this.tokenStart;
  return this.eat(xs), {
    type: "CDO",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function MC() {
  this.token(xs, "<!--");
}
const qC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: MC,
  name: OC,
  parse: Zg,
  structure: NC
}, Symbol.toStringTag, { value: "Module" })), _C = 46, RC = "ClassSelector", zC = {
  name: String
};
function Jg() {
  return this.eatDelim(_C), {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(R)
  };
}
function PC(r) {
  this.token(G, "."), this.token(R, r.name);
}
const BC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: PC,
  name: RC,
  parse: Jg,
  structure: zC
}, Symbol.toStringTag, { value: "Module" })), $C = 43, tf = 47, jC = 62, FC = 126, HC = "Combinator", UC = {
  name: String
};
function tm() {
  const r = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case ft:
      t = " ";
      break;
    case G:
      switch (this.charCodeAt(this.tokenStart)) {
        case jC:
        case $C:
        case FC:
          this.next();
          break;
        case tf:
          this.next(), this.eatIdent("deep"), this.eatDelim(tf);
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
function VC(r) {
  this.tokenize(r.name);
}
const YC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: VC,
  name: HC,
  parse: tm,
  structure: UC
}, Symbol.toStringTag, { value: "Module" })), WC = 42, GC = 47, KC = "Comment", QC = {
  value: String
};
function em() {
  const r = this.tokenStart;
  let t = this.tokenEnd;
  return this.eat(jt), t - r + 2 >= 2 && this.charCodeAt(t - 2) === WC && this.charCodeAt(t - 1) === GC && (t -= 2), {
    type: "Comment",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substring(r + 2, t)
  };
}
function XC(r) {
  this.token(jt, "/*" + r.value + "*/");
}
const ZC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: XC,
  name: KC,
  parse: em,
  structure: QC
}, Symbol.toStringTag, { value: "Module" })), nm = 33, JC = 35, tT = 36, eT = 38, nT = 42, rT = 43, ef = 47;
function iT(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function sT(r) {
  return this.Raw(r, this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function aT() {
  const r = this.tokenIndex, t = this.Value();
  return t.type !== "Raw" && this.eof === !1 && this.tokenType !== Yt && this.isDelim(nm) === !1 && this.isBalanceEdge(r) === !1 && this.error(), t;
}
const oT = "Declaration", lT = "declaration", cT = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function rm() {
  const r = this.tokenStart, t = this.tokenIndex, e = dT.call(this), n = zu(e), i = n ? this.parseCustomProperty : this.parseValue, s = n ? sT : iT;
  let a = !1, o;
  this.skipSC(), this.eat(Rt);
  const l = this.tokenIndex;
  if (n || this.skipSC(), i ? o = this.parseWithFallback(aT, s) : o = s.call(this, this.tokenIndex), n && o.type === "Value" && o.children.isEmpty) {
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
  return this.isDelim(nm) && (a = hT.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== Yt && this.isBalanceEdge(t) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(r, this.tokenStart),
    important: a,
    property: e,
    value: o
  };
}
function uT(r) {
  this.token(R, r.property), this.token(Rt, ":"), this.node(r.value), r.important && (this.token(G, "!"), this.token(R, r.important === !0 ? "important" : r.important));
}
function dT() {
  const r = this.tokenStart;
  if (this.tokenType === G)
    switch (this.charCodeAt(this.tokenStart)) {
      case nT:
      case tT:
      case rT:
      case JC:
      case eT:
        this.next();
        break;
      case ef:
        this.next(), this.isDelim(ef) && this.next();
        break;
    }
  return this.tokenType === ot ? this.eat(ot) : this.eat(R), this.substrToCursor(r);
}
function hT() {
  this.eat(G), this.skipSC();
  const r = this.consume(R);
  return r === "important" ? !0 : r;
}
const fT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: uT,
  name: oT,
  parse: rm,
  structure: cT,
  walkContext: lT
}, Symbol.toStringTag, { value: "Module" })), pT = 38;
function Ml(r) {
  return this.Raw(r, this.consumeUntilSemicolonIncluded, !0);
}
const gT = "DeclarationList", mT = {
  children: [[
    "Declaration",
    "Atrule",
    "Rule"
  ]]
};
function im() {
  const r = this.createList();
  for (; !this.eof; )
    switch (this.tokenType) {
      case ft:
      case jt:
      case Yt:
        this.next();
        break;
      case bt:
        r.push(this.parseWithFallback(this.Atrule.bind(this, !0), Ml));
        break;
      default:
        this.isDelim(pT) ? r.push(this.parseWithFallback(this.Rule, Ml)) : r.push(this.parseWithFallback(this.Declaration, Ml));
    }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function bT(r) {
  this.children(r, (t) => {
    t.type === "Declaration" && this.token(Yt, ";");
  });
}
const yT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: bT,
  name: gT,
  parse: im,
  structure: mT
}, Symbol.toStringTag, { value: "Module" })), vT = "Dimension", wT = {
  value: String,
  unit: String
};
function sm() {
  const r = this.tokenStart, t = this.consumeNumber(W);
  return {
    type: "Dimension",
    loc: this.getLocation(r, this.tokenStart),
    value: t,
    unit: this.substring(r + t.length, this.tokenStart)
  };
}
function xT(r) {
  this.token(W, r.value + r.unit);
}
const kT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xT,
  name: vT,
  parse: sm,
  structure: wT
}, Symbol.toStringTag, { value: "Module" })), ST = "Function", AT = "function", ET = {
  name: String,
  children: [[]]
};
function am(r, t) {
  const e = this.tokenStart, n = this.consumeFunctionName(), i = n.toLowerCase();
  let s;
  return s = t.hasOwnProperty(i) ? t[i].call(this, t) : r.call(this, t), this.eof || this.eat(rt), {
    type: "Function",
    loc: this.getLocation(e, this.tokenStart),
    name: n,
    children: s
  };
}
function CT(r) {
  this.token(K, r.name + "("), this.children(r), this.token(rt, ")");
}
const TT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: CT,
  name: ST,
  parse: am,
  structure: ET,
  walkContext: AT
}, Symbol.toStringTag, { value: "Module" })), LT = "XXX", DT = "Hash", IT = {
  value: String
};
function om() {
  const r = this.tokenStart;
  return this.eat(ot), {
    type: "Hash",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r + 1)
  };
}
function OT(r) {
  this.token(ot, "#" + r.value);
}
const NT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: OT,
  name: DT,
  parse: om,
  structure: IT,
  xxx: LT
}, Symbol.toStringTag, { value: "Module" })), MT = "Identifier", qT = {
  name: String
};
function lm() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(R)
  };
}
function _T(r) {
  this.token(R, r.name);
}
const RT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: _T,
  name: MT,
  parse: lm,
  structure: qT
}, Symbol.toStringTag, { value: "Module" })), zT = "IdSelector", PT = {
  name: String
};
function cm() {
  const r = this.tokenStart;
  return this.eat(ot), {
    type: "IdSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r + 1)
  };
}
function BT(r) {
  this.token(G, "#" + r.name);
}
const $T = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: BT,
  name: zT,
  parse: cm,
  structure: PT
}, Symbol.toStringTag, { value: "Module" })), jT = "MediaFeature", FT = {
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", null]
};
function um() {
  const r = this.tokenStart;
  let t, e = null;
  if (this.eat(St), this.skipSC(), t = this.consume(R), this.skipSC(), this.tokenType !== rt) {
    switch (this.eat(Rt), this.skipSC(), this.tokenType) {
      case F:
        this.lookupNonWSType(1) === G ? e = this.Ratio() : e = this.Number();
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
function HT(r) {
  this.token(St, "("), this.token(R, r.name), r.value !== null && (this.token(Rt, ":"), this.node(r.value)), this.token(rt, ")");
}
const UT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: HT,
  name: jT,
  parse: um,
  structure: FT
}, Symbol.toStringTag, { value: "Module" })), VT = "MediaQuery", YT = {
  children: [[
    "Identifier",
    "MediaFeature",
    "WhiteSpace"
  ]]
};
function dm() {
  const r = this.createList();
  let t = null;
  this.skipSC();
  t:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case jt:
        case ft:
          this.next();
          continue;
        case R:
          t = this.Identifier();
          break;
        case St:
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
function WT(r) {
  this.children(r);
}
const GT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: WT,
  name: VT,
  parse: dm,
  structure: YT
}, Symbol.toStringTag, { value: "Module" })), KT = "MediaQueryList", QT = {
  children: [[
    "MediaQuery"
  ]]
};
function hm() {
  const r = this.createList();
  for (this.skipSC(); !this.eof && (r.push(this.MediaQuery()), this.tokenType === sn); )
    this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function XT(r) {
  this.children(r, () => this.token(sn, ","));
}
const ZT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: XT,
  name: KT,
  parse: hm,
  structure: QT
}, Symbol.toStringTag, { value: "Module" })), JT = 38, tL = "NestingSelector", eL = {};
function fm() {
  const r = this.tokenStart;
  return this.eatDelim(JT), {
    type: "NestingSelector",
    loc: this.getLocation(r, this.tokenStart)
  };
}
function nL() {
  this.token(G, "&");
}
const rL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nL,
  name: tL,
  parse: fm,
  structure: eL
}, Symbol.toStringTag, { value: "Module" })), iL = "Nth", sL = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function pm() {
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
function aL(r) {
  this.node(r.nth), r.selector !== null && (this.token(R, "of"), this.node(r.selector));
}
const oL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: aL,
  name: iL,
  parse: pm,
  structure: sL
}, Symbol.toStringTag, { value: "Module" })), lL = "Number", cL = {
  value: String
};
function gm() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(F)
  };
}
function uL(r) {
  this.token(F, r.value);
}
const dL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: uL,
  name: lL,
  parse: gm,
  structure: cL
}, Symbol.toStringTag, { value: "Module" })), hL = "Operator", fL = {
  value: String
};
function mm() {
  const r = this.tokenStart;
  return this.next(), {
    type: "Operator",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r)
  };
}
function pL(r) {
  this.tokenize(r.value);
}
const gL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: pL,
  name: hL,
  parse: mm,
  structure: fL
}, Symbol.toStringTag, { value: "Module" })), mL = "Parentheses", bL = {
  children: [[]]
};
function bm(r, t) {
  const e = this.tokenStart;
  let n = null;
  return this.eat(St), n = r.call(this, t), this.eof || this.eat(rt), {
    type: "Parentheses",
    loc: this.getLocation(e, this.tokenStart),
    children: n
  };
}
function yL(r) {
  this.token(St, "("), this.children(r), this.token(rt, ")");
}
const vL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: yL,
  name: mL,
  parse: bm,
  structure: bL
}, Symbol.toStringTag, { value: "Module" })), wL = "Percentage", xL = {
  value: String
};
function ym() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(ht)
  };
}
function kL(r) {
  this.token(ht, r.value + "%");
}
const SL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: kL,
  name: wL,
  parse: ym,
  structure: xL
}, Symbol.toStringTag, { value: "Module" })), AL = "PseudoClassSelector", EL = "function", CL = {
  name: String,
  children: [["Raw"], null]
};
function vm() {
  const r = this.tokenStart;
  let t = null, e, n;
  return this.eat(Rt), this.tokenType === K ? (e = this.consumeFunctionName(), n = e.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(rt)) : e = this.consume(R), {
    type: "PseudoClassSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    children: t
  };
}
function TL(r) {
  this.token(Rt, ":"), r.children === null ? this.token(R, r.name) : (this.token(K, r.name + "("), this.children(r), this.token(rt, ")"));
}
const LL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: TL,
  name: AL,
  parse: vm,
  structure: CL,
  walkContext: EL
}, Symbol.toStringTag, { value: "Module" })), DL = "PseudoElementSelector", IL = "function", OL = {
  name: String,
  children: [["Raw"], null]
};
function wm() {
  const r = this.tokenStart;
  let t = null, e, n;
  return this.eat(Rt), this.eat(Rt), this.tokenType === K ? (e = this.consumeFunctionName(), n = e.toLowerCase(), hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(rt)) : e = this.consume(R), {
    type: "PseudoElementSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: e,
    children: t
  };
}
function NL(r) {
  this.token(Rt, ":"), this.token(Rt, ":"), r.children === null ? this.token(R, r.name) : (this.token(K, r.name + "("), this.children(r), this.token(rt, ")"));
}
const ML = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: NL,
  name: DL,
  parse: wm,
  structure: OL,
  walkContext: IL
}, Symbol.toStringTag, { value: "Module" })), qL = 47, _L = 46;
function nf() {
  this.skipSC();
  const r = this.consume(F);
  for (let t = 0; t < r.length; t++) {
    const e = r.charCodeAt(t);
    !At(e) && e !== _L && this.error("Unsigned number is expected", this.tokenStart - r.length + t);
  }
  return Number(r) === 0 && this.error("Zero number is not allowed", this.tokenStart - r.length), r;
}
const RL = "Ratio", zL = {
  left: String,
  right: String
};
function xm() {
  const r = this.tokenStart, t = nf.call(this);
  let e;
  return this.skipSC(), this.eatDelim(qL), e = nf.call(this), {
    type: "Ratio",
    loc: this.getLocation(r, this.tokenStart),
    left: t,
    right: e
  };
}
function PL(r) {
  this.token(F, r.left), this.token(G, "/"), this.token(F, r.right);
}
const BL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: PL,
  name: RL,
  parse: xm,
  structure: zL
}, Symbol.toStringTag, { value: "Module" }));
function $L() {
  return this.tokenIndex > 0 && this.lookupType(-1) === ft ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
const jL = "Raw", FL = {
  value: String
};
function km(r, t, e) {
  const n = this.getTokenStart(r);
  let i;
  return this.skipUntilBalanced(r, t || this.consumeUntilBalanceEnd), e && this.tokenStart > n ? i = $L.call(this) : i = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(n, i),
    value: this.substring(n, i)
  };
}
function HL(r) {
  this.tokenize(r.value);
}
const UL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: HL,
  name: jL,
  parse: km,
  structure: FL
}, Symbol.toStringTag, { value: "Module" }));
function rf(r) {
  return this.Raw(r, this.consumeUntilLeftCurlyBracket, !0);
}
function VL() {
  const r = this.SelectorList();
  return r.type !== "Raw" && this.eof === !1 && this.tokenType !== zt && this.error(), r;
}
const YL = "Rule", WL = "rule", GL = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function Sm() {
  const r = this.tokenIndex, t = this.tokenStart;
  let e, n;
  return this.parseRulePrelude ? e = this.parseWithFallback(VL, rf) : e = rf.call(this, r), n = this.Block(!0), {
    type: "Rule",
    loc: this.getLocation(t, this.tokenStart),
    prelude: e,
    block: n
  };
}
function KL(r) {
  this.node(r.prelude), this.node(r.block);
}
const QL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: KL,
  name: YL,
  parse: Sm,
  structure: GL,
  walkContext: WL
}, Symbol.toStringTag, { value: "Module" })), XL = "Selector", ZL = {
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
function Am() {
  const r = this.readSequence(this.scope.Selector);
  return this.getFirstListNode(r) === null && this.error("Selector is expected"), {
    type: "Selector",
    loc: this.getLocationFromList(r),
    children: r
  };
}
function JL(r) {
  this.children(r);
}
const tD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: JL,
  name: XL,
  parse: Am,
  structure: ZL
}, Symbol.toStringTag, { value: "Module" })), eD = "SelectorList", nD = "selector", rD = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function Em() {
  const r = this.createList();
  for (; !this.eof; ) {
    if (r.push(this.Selector()), this.tokenType === sn) {
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
function iD(r) {
  this.children(r, () => this.token(sn, ","));
}
const sD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: iD,
  name: eD,
  parse: Em,
  structure: rD,
  walkContext: nD
}, Symbol.toStringTag, { value: "Module" })), Tc = 92, Cm = 34, aD = 39;
function Tm(r) {
  const t = r.length, e = r.charCodeAt(0), n = e === Cm || e === aD ? 1 : 0, i = n === 1 && t > 1 && r.charCodeAt(t - 1) === e ? t - 2 : t - 1;
  let s = "";
  for (let a = n; a <= i; a++) {
    let o = r.charCodeAt(a);
    if (o === Tc) {
      if (a === i) {
        a !== t - 1 && (s = r.substr(a + 1));
        break;
      }
      if (o = r.charCodeAt(++a), Ue(Tc, o)) {
        const l = a - 1, c = oi(r, l);
        a = c - 1, s += dg(r.substring(l + 1, c));
      } else
        o === 13 && r.charCodeAt(a + 1) === 10 && a++;
    } else
      s += r[a];
  }
  return s;
}
function oD(r, t) {
  const e = '"', n = Cm;
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
    o === n || o === Tc ? (i += "\\" + r.charAt(a), s = !1) : (s && (zn(o) || lr(o)) && (i += " "), i += r.charAt(a), s = !1);
  }
  return e + i + e;
}
const lD = "String", cD = {
  value: String
};
function Lm() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: Tm(this.consume(rn))
  };
}
function uD(r) {
  this.token(rn, oD(r.value));
}
const dD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: uD,
  name: lD,
  parse: Lm,
  structure: cD
}, Symbol.toStringTag, { value: "Module" })), hD = 33;
function sf(r) {
  return this.Raw(r, null, !1);
}
const fD = "StyleSheet", pD = "stylesheet", gD = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function Dm() {
  const r = this.tokenStart, t = this.createList();
  let e;
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case ft:
        this.next();
        continue;
      case jt:
        if (this.charCodeAt(this.tokenStart + 2) !== hD) {
          this.next();
          continue;
        }
        e = this.Comment();
        break;
      case xs:
        e = this.CDO();
        break;
      case Vt:
        e = this.CDC();
        break;
      case bt:
        e = this.parseWithFallback(this.Atrule, sf);
        break;
      default:
        e = this.parseWithFallback(this.Rule, sf);
    }
    t.push(e);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(r, this.tokenStart),
    children: t
  };
}
function mD(r) {
  this.children(r);
}
const bD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: mD,
  name: fD,
  parse: Dm,
  structure: gD,
  walkContext: pD
}, Symbol.toStringTag, { value: "Module" })), yD = 42, af = 124;
function ql() {
  this.tokenType !== R && this.isDelim(yD) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
const vD = "TypeSelector", wD = {
  name: String
};
function Im() {
  const r = this.tokenStart;
  return this.isDelim(af) ? (this.next(), ql.call(this)) : (ql.call(this), this.isDelim(af) && (this.next(), ql.call(this))), {
    type: "TypeSelector",
    loc: this.getLocation(r, this.tokenStart),
    name: this.substrToCursor(r)
  };
}
function xD(r) {
  this.tokenize(r.name);
}
const kD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xD,
  name: vD,
  parse: Im,
  structure: wD
}, Symbol.toStringTag, { value: "Module" })), Om = 43, Nm = 45, Lc = 63;
function Ui(r, t) {
  let e = 0;
  for (let n = this.tokenStart + r; n < this.tokenEnd; n++) {
    const i = this.charCodeAt(n);
    if (i === Nm && t && e !== 0)
      return Ui.call(this, r + e + 1, !1), -1;
    zn(i) || this.error(
      t && e !== 0 ? "Hyphen minus" + (e < 6 ? " or hex digit" : "") + " is expected" : e < 6 ? "Hex digit is expected" : "Unexpected input",
      n
    ), ++e > 6 && this.error("Too many hex digits", n);
  }
  return this.next(), e;
}
function aa(r) {
  let t = 0;
  for (; this.isDelim(Lc); )
    ++t > r && this.error("Too many question marks"), this.next();
}
function SD(r) {
  this.charCodeAt(this.tokenStart) !== r && this.error((r === Om ? "Plus sign" : "Hyphen minus") + " is expected");
}
function AD() {
  let r = 0;
  switch (this.tokenType) {
    case F:
      if (r = Ui.call(this, 1, !0), this.isDelim(Lc)) {
        aa.call(this, 6 - r);
        break;
      }
      if (this.tokenType === W || this.tokenType === F) {
        SD.call(this, Nm), Ui.call(this, 1, !1);
        break;
      }
      break;
    case W:
      r = Ui.call(this, 1, !0), r > 0 && aa.call(this, 6 - r);
      break;
    default:
      if (this.eatDelim(Om), this.tokenType === R) {
        r = Ui.call(this, 0, !0), r > 0 && aa.call(this, 6 - r);
        break;
      }
      if (this.isDelim(Lc)) {
        this.next(), aa.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
const ED = "UnicodeRange", CD = {
  value: String
};
function Mm() {
  const r = this.tokenStart;
  return this.eatIdent("u"), AD.call(this), {
    type: "UnicodeRange",
    loc: this.getLocation(r, this.tokenStart),
    value: this.substrToCursor(r)
  };
}
function TD(r) {
  this.tokenize(r.value);
}
const LD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: TD,
  name: ED,
  parse: Mm,
  structure: CD
}, Symbol.toStringTag, { value: "Module" })), DD = 32, Dc = 92, ID = 34, OD = 39, ND = 40, qm = 41;
function MD(r) {
  const t = r.length;
  let e = 4, n = r.charCodeAt(t - 1) === qm ? t - 2 : t - 1, i = "";
  for (; e < n && lr(r.charCodeAt(e)); )
    e++;
  for (; e < n && lr(r.charCodeAt(n)); )
    n--;
  for (let s = e; s <= n; s++) {
    let a = r.charCodeAt(s);
    if (a === Dc) {
      if (s === n) {
        s !== t - 1 && (i = r.substr(s + 1));
        break;
      }
      if (a = r.charCodeAt(++s), Ue(Dc, a)) {
        const o = s - 1, l = oi(r, o);
        s = l - 1, i += dg(r.substring(o + 1, l));
      } else
        a === 13 && r.charCodeAt(s + 1) === 10 && s++;
    } else
      i += r[s];
  }
  return i;
}
function qD(r) {
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
    i === DD || i === Dc || i === ID || i === OD || i === ND || i === qm ? (t += "\\" + r.charAt(n), e = !1) : (e && zn(i) && (t += " "), t += r.charAt(n), e = !1);
  }
  return "url(" + t + ")";
}
const _D = "Url", RD = {
  value: String
};
function _m() {
  const r = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case Nt:
      t = MD(this.consume(Nt));
      break;
    case K:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(K), this.skipSC(), t = Tm(this.consume(rn)), this.skipSC(), this.eof || this.eat(rt);
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
function zD(r) {
  this.token(Nt, qD(r.value));
}
const PD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: zD,
  name: _D,
  parse: _m,
  structure: RD
}, Symbol.toStringTag, { value: "Module" })), BD = "Value", $D = {
  children: [[]]
};
function Rm() {
  const r = this.tokenStart, t = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(r, this.tokenStart),
    children: t
  };
}
function jD(r) {
  this.children(r);
}
const FD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: jD,
  name: BD,
  parse: Rm,
  structure: $D
}, Symbol.toStringTag, { value: "Module" })), HD = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
}), UD = "WhiteSpace", VD = {
  value: String
};
function zm() {
  return this.eat(ft), HD;
}
function YD(r) {
  this.token(ft, r.value);
}
const WD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: YD,
  name: UD,
  parse: zm,
  structure: VD
}, Symbol.toStringTag, { value: "Module" })), Pm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: KE,
  Atrule: eC,
  AtrulePrelude: aC,
  AttributeSelector: gC,
  Block: kC,
  Brackets: CC,
  CDC: IC,
  CDO: qC,
  ClassSelector: BC,
  Combinator: YC,
  Comment: ZC,
  Declaration: fT,
  DeclarationList: yT,
  Dimension: kT,
  Function: TT,
  Hash: NT,
  IdSelector: $T,
  Identifier: RT,
  MediaFeature: UT,
  MediaQuery: GT,
  MediaQueryList: ZT,
  NestingSelector: rL,
  Nth: oL,
  Number: dL,
  Operator: gL,
  Parentheses: vL,
  Percentage: SL,
  PseudoClassSelector: LL,
  PseudoElementSelector: ML,
  Ratio: BL,
  Raw: UL,
  Rule: QL,
  Selector: tD,
  SelectorList: sD,
  String: dD,
  StyleSheet: bD,
  TypeSelector: kD,
  UnicodeRange: LD,
  Url: PD,
  Value: FD,
  WhiteSpace: WD
}, Symbol.toStringTag, { value: "Module" })), GD = Bt(Y({
  generic: !0
}, UE), {
  node: Pm
}), KD = 35, QD = 42, of = 43, XD = 45, ZD = 47, JD = 117;
function Bm(r) {
  switch (this.tokenType) {
    case ot:
      return this.Hash();
    case sn:
      return this.Operator();
    case St:
      return this.Parentheses(this.readSequence, r.recognizer);
    case Jt:
      return this.Brackets(this.readSequence, r.recognizer);
    case rn:
      return this.String();
    case W:
      return this.Dimension();
    case ht:
      return this.Percentage();
    case F:
      return this.Number();
    case K:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, r.recognizer);
    case Nt:
      return this.Url();
    case R:
      return this.cmpChar(this.tokenStart, JD) && this.cmpChar(this.tokenStart + 1, of) ? this.UnicodeRange() : this.Identifier();
    case G: {
      const t = this.charCodeAt(this.tokenStart);
      if (t === ZD || t === QD || t === of || t === XD)
        return this.Operator();
      t === KD && this.error("Hex or identifier is expected", this.tokenStart + 1);
      break;
    }
  }
}
const t2 = {
  getNode: Bm
}, e2 = 35, n2 = 38, r2 = 42, i2 = 43, s2 = 47, lf = 46, a2 = 62, o2 = 124, l2 = 126;
function c2(r, t) {
  t.last !== null && t.last.type !== "Combinator" && r !== null && r.type !== "Combinator" && t.push({
    // FIXME: this.Combinator() should be used instead
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function u2() {
  switch (this.tokenType) {
    case Jt:
      return this.AttributeSelector();
    case ot:
      return this.IdSelector();
    case Rt:
      return this.lookupType(1) === Rt ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case R:
      return this.TypeSelector();
    case F:
    case ht:
      return this.Percentage();
    case W:
      this.charCodeAt(this.tokenStart) === lf && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case G: {
      switch (this.charCodeAt(this.tokenStart)) {
        case i2:
        case a2:
        case l2:
        case s2:
          return this.Combinator();
        case lf:
          return this.ClassSelector();
        case r2:
        case o2:
          return this.TypeSelector();
        case e2:
          return this.IdSelector();
        case n2:
          return this.NestingSelector();
      }
      break;
    }
  }
}
const d2 = {
  onWhiteSpace: c2,
  getNode: u2
};
function h2() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function f2() {
  const r = this.createList();
  if (this.skipSC(), r.push(this.Identifier()), this.skipSC(), this.tokenType === sn) {
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
function cf(r) {
  return r !== null && r.type === "Operator" && (r.value[r.value.length - 1] === "-" || r.value[r.value.length - 1] === "+");
}
const p2 = {
  getNode: Bm,
  onWhiteSpace(r, t) {
    cf(r) && (r.value = " " + r.value), cf(t.last) && (t.last.value += " ");
  },
  expression: h2,
  var: f2
}, g2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: t2,
  Selector: d2,
  Value: p2
}, Symbol.toStringTag, { value: "Module" })), m2 = {
  parse: {
    prelude: null,
    block() {
      return this.Block(!0);
    }
  }
}, b2 = {
  parse: {
    prelude() {
      const r = this.createList();
      switch (this.skipSC(), this.tokenType) {
        case rn:
          r.push(this.String());
          break;
        case Nt:
        case K:
          r.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      return (this.lookupNonWSType(0) === R || this.lookupNonWSType(0) === St) && r.push(this.MediaQueryList()), r;
    },
    block: null
  }
}, y2 = {
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
}, v2 = {
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
}, w2 = {
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
function x2() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function k2() {
  return this.skipSC(), this.tokenType === R && this.lookupNonWSType(1) === Rt ? this.createSingleNodeList(
    this.Declaration()
  ) : $m.call(this);
}
function $m() {
  const r = this.createList();
  let t;
  this.skipSC();
  t:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case jt:
        case ft:
          this.next();
          continue;
        case K:
          t = this.Function(x2, this.scope.AtrulePrelude);
          break;
        case R:
          t = this.Identifier();
          break;
        case St:
          t = this.Parentheses(k2, this.scope.AtrulePrelude);
          break;
        default:
          break t;
      }
      r.push(t);
    }
  return r;
}
const S2 = {
  parse: {
    prelude() {
      const r = $m.call(this);
      return this.getFirstListNode(r) === null && this.error("Condition is expected"), r;
    },
    block(r = !1) {
      return this.Block(r);
    }
  }
}, A2 = {
  "font-face": m2,
  import: b2,
  media: y2,
  nest: v2,
  page: w2,
  supports: S2
}, Kn = {
  parse() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
}, _l = {
  parse() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
}, uf = {
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
}, E2 = {
  dir: uf,
  has: Kn,
  lang: uf,
  matches: Kn,
  is: Kn,
  "-moz-any": Kn,
  "-webkit-any": Kn,
  where: Kn,
  not: Kn,
  "nth-child": oa,
  "nth-last-child": oa,
  "nth-last-of-type": oa,
  "nth-of-type": oa,
  slotted: _l,
  host: _l,
  "host-context": _l
}, C2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: Hg,
  Atrule: Ug,
  AtrulePrelude: Vg,
  AttributeSelector: Wg,
  Block: Kg,
  Brackets: Qg,
  CDC: Xg,
  CDO: Zg,
  ClassSelector: Jg,
  Combinator: tm,
  Comment: em,
  Declaration: rm,
  DeclarationList: im,
  Dimension: sm,
  Function: am,
  Hash: om,
  IdSelector: cm,
  Identifier: lm,
  MediaFeature: um,
  MediaQuery: dm,
  MediaQueryList: hm,
  NestingSelector: fm,
  Nth: pm,
  Number: gm,
  Operator: mm,
  Parentheses: bm,
  Percentage: ym,
  PseudoClassSelector: vm,
  PseudoElementSelector: wm,
  Ratio: xm,
  Raw: km,
  Rule: Sm,
  Selector: Am,
  SelectorList: Em,
  String: Lm,
  StyleSheet: Dm,
  TypeSelector: Im,
  UnicodeRange: Mm,
  Url: _m,
  Value: Rm,
  WhiteSpace: zm
}, Symbol.toStringTag, { value: "Module" })), T2 = {
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
  scope: g2,
  atrule: A2,
  pseudo: E2,
  node: C2
}, L2 = {
  node: Pm
}, D2 = HE(Y(Y(Y({}, GD), T2), L2));
function Ic(r) {
  const t = {};
  for (const e in r) {
    let n = r[e];
    n && (Array.isArray(n) || n instanceof mt ? n = n.map(Ic) : n.constructor === Object && (n = Ic(n))), t[e] = n;
  }
  return t;
}
const {
  tokenize: _I,
  parse: I2,
  generate: O2,
  lexer: RI,
  createLexer: zI,
  walk: Xn,
  find: PI,
  findLast: BI,
  findAll: $I,
  toPlainObject: jI,
  fromPlainObject: FI,
  fork: HI
} = D2;
let N2 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", xe = (r = 21) => {
  let t = "", e = r;
  for (; e--; )
    t += N2[Math.random() * 64 | 0];
  return t;
};
function Zn(r) {
  return I2(r, {
    parseAtrulePrelude: !1,
    parseCustomProperty: !0
  });
}
function Gt(r) {
  return O2(r, {
    // Default `safe` adds extra (potentially breaking) spaces for compatibility
    // with old browsers.
    mode: "spec"
  });
}
function jm(r) {
  return r.type === "Declaration";
}
function M2(r) {
  return r.value.children.first.name;
}
const Oc = {
  "position-anchor": `--position-anchor-${xe(12)}`,
  "anchor-scope": `--anchor-scope-${xe(12)}`,
  "anchor-name": `--anchor-name-${xe(12)}`
};
function q2(r, t) {
  return jm(r) && Oc[r.property] && t ? (t.children.appendData(Bt(Y({}, r), {
    property: Oc[r.property]
  })), { updated: !0 }) : {};
}
function _2(r) {
  for (const t of r) {
    let e = !1;
    const n = Zn(t.css);
    Xn(n, {
      visit: "Declaration",
      enter(i) {
        var s;
        const a = (s = this.rule) == null ? void 0 : s.block, { updated: o } = q2(i, a);
        o && (e = !0);
      }
    }), e && (t.css = Gt(n), t.changed = !0);
  }
  return r.some((t) => t.changed === !0);
}
var Fm = /* @__PURE__ */ ((r) => (r.All = "all", r.None = "none", r))(Fm || {});
function tn(r, t) {
  var e;
  return t = (e = Oc[t]) != null ? e : t, (r instanceof HTMLElement ? getComputedStyle(r) : r.computedStyle).getPropertyValue(t).trim();
}
function ui(r, t, e) {
  return tn(r, t) === e;
}
function R2(r, { selector: t, pseudoElementPart: e }) {
  const n = getComputedStyle(r, e), i = document.createElement("div"), s = document.createElement("style");
  i.id = `fake-pseudo-element-${xe()}`;
  for (const o of Array.from(n)) {
    const l = n.getPropertyValue(o);
    i.style.setProperty(o, l);
  }
  s.textContent += `#${i.id}${e} { content: ${n.content}; }`, s.textContent += `${t} { display: none !important; }`, document.head.append(s);
  const a = e === "::before" ? "afterbegin" : "beforeend";
  return r.insertAdjacentElement(a, i), { fakePseudoElement: i, sheet: s, computedStyle: n };
}
function z2(r) {
  let t = r;
  for (; t; ) {
    if (ui(t, "overflow", "scroll"))
      return t;
    t = t.parentElement;
  }
  return t;
}
function P2(r) {
  let t = z2(r);
  return t === document.documentElement && (t = null), t ?? { scrollTop: 0, scrollLeft: 0 };
}
function B2(r) {
  const { elementPart: t, pseudoElementPart: e } = r, n = [];
  if (e && !(e === "::before" || e === "::after")) return n;
  const i = Array.from(
    document.querySelectorAll(t)
  );
  if (!e)
    return n.push(...i), n;
  for (const s of i) {
    const { fakePseudoElement: a, sheet: o, computedStyle: l } = R2(
      s,
      r
    ), c = a.getBoundingClientRect(), { scrollY: u, scrollX: h } = globalThis, f = P2(s);
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
        const { scrollY: p, scrollX: m } = globalThis, { scrollTop: b, scrollLeft: w } = f;
        return DOMRect.fromRect({
          y: c.y + (u - p) + (f.scrollTop - b),
          x: c.x + (h - m) + (f.scrollLeft - w),
          width: c.width,
          height: c.height
        });
      }
    });
  }
  return n;
}
function $2(r, t) {
  const e = tn(r, "anchor-name");
  return t ? e.split(",").map((n) => n.trim()).includes(t) : !e;
}
function j2(r, t) {
  const e = tn(r, "anchor-scope");
  return e === t || e === "all";
}
function F2(r) {
  return !!((r.type === "text/css" || r.rel === "stylesheet") && r.href);
}
function H2(r) {
  const t = new URL(r.href, document.baseURI);
  if (F2(r) && t.origin === location.origin)
    return t;
}
function U2(r) {
  return yt(this, null, function* () {
    return Promise.all(
      r.map((t) => yt(this, null, function* () {
        if (!t.url)
          return t;
        const e = yield (yield fetch(t.url.toString())).text();
        return Bt(Y({}, t), { css: e });
      }))
    );
  });
}
function V2() {
  const r = document.querySelectorAll('[style*="anchor"]'), t = [];
  return r.forEach((e) => {
    const n = xe(12), i = "data-has-inline-styles";
    e.setAttribute(i, n);
    const s = e.getAttribute("style"), a = `[${i}="${n}"] { ${s} }`;
    t.push({ el: e, css: a });
  }), t;
}
function Y2() {
  return yt(this, null, function* () {
    const r = document.querySelectorAll("link, style"), t = [];
    r.forEach((n) => {
      if (n.tagName.toLowerCase() === "link") {
        const i = H2(n);
        i && t.push({ el: n, url: i });
      }
      n.tagName.toLowerCase() === "style" && t.push({ el: n, css: n.innerHTML });
    });
    const e = V2();
    return yield U2([...t, ...e]);
  });
}
function W2(r, t) {
  return !r || r === t ? !1 : Hm(r) ? r.document.contains(t) : r.contains(t);
}
function Hm(r) {
  return !!(r && r === r.window);
}
function G2(r) {
  return ui(r, "position", "fixed");
}
function Nc(r) {
  return !!(r && (G2(r) || ui(r, "position", "absolute")));
}
function df(r, t) {
  return r.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING;
}
function K2(r) {
  return yt(this, null, function* () {
    return yield ae.getOffsetParent(r);
  });
}
function Rl(r) {
  return yt(this, null, function* () {
    if (!["absolute", "fixed"].includes(tn(r, "position")))
      return yield K2(r);
    let t = r.parentElement;
    for (; t; ) {
      if (!ui(t, "position", "static") && ui(t, "display", "block"))
        return t;
      t = t.parentElement;
    }
    return window;
  });
}
function Q2(r, t, e, n) {
  return yt(this, null, function* () {
    const i = yield Rl(r), s = yield Rl(e);
    if (!(W2(s, r) || Hm(s)) || i === s && !(!Nc(r) || df(r, e)))
      return !1;
    if (i !== s) {
      let a;
      const o = [];
      for (a = i; a && a !== s && a !== window; )
        o.push(a), a = yield Rl(a);
      const l = o[o.length - 1];
      if (l instanceof HTMLElement && !(!Nc(l) || df(l, e)))
        return !1;
    }
    {
      let a = r.parentElement;
      for (; a; ) {
        if (ui(a, "content-visibility", "hidden"))
          return !1;
        a = a.parentElement;
      }
    }
    return !(t && n && hf(r, t, n) !== hf(e, t, n));
  });
}
function hf(r, t, e) {
  for (; !(r.matches(e) && j2(r, t)); ) {
    if (!r.parentElement)
      return null;
    r = r.parentElement;
  }
  return r;
}
function ff(r, t, e, n) {
  return yt(this, null, function* () {
    if (!(r instanceof HTMLElement && e.length && Nc(r)))
      return null;
    const i = e.flatMap(B2).filter((a) => $2(a, t)), s = n.map((a) => a.selector).join(",") || null;
    for (let a = i.length - 1; a >= 0; a--) {
      const o = i[a], l = "fakePseudoElement" in o;
      if (yield Q2(
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
const X2 = [
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
], Z2 = [
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height"
], J2 = [
  "justify-content",
  "align-content",
  "justify-self",
  "align-self",
  "justify-items",
  "align-items"
], tI = [
  "top",
  "left",
  "right",
  "bottom",
  "start",
  "end",
  "self-start",
  "self-end",
  "center"
], eI = [
  "width",
  "height",
  "block",
  "inline",
  "self-block",
  "self-inline"
];
function nI(r) {
  return r.type === "Declaration" && r.property === "anchor-name";
}
function rI(r) {
  return r.type === "Declaration" && r.property === "anchor-scope";
}
function Um(r) {
  return !!(r && r.type === "Function" && r.name === "anchor");
}
function Vm(r) {
  return !!(r && r.type === "Function" && r.name === "anchor-size");
}
function ya(r) {
  return !!(r && r.type === "Function" && r.name === "var");
}
function iI(r) {
  return r.type === "Declaration" && r.property === "position-fallback";
}
function sI(r) {
  return r.type === "Atrule" && r.name === "position-fallback";
}
function aI(r) {
  return r.type === "Atrule" && r.name === "try";
}
function zl(r) {
  return !!(r.type === "Identifier" && r.name);
}
function oI(r) {
  return !!(r.type === "Percentage" && r.value);
}
function fs(r) {
  return X2.includes(r);
}
function lI(r) {
  return tI.includes(r);
}
function uo(r) {
  return Z2.includes(r);
}
function cI(r) {
  return eI.includes(r);
}
function uI(r) {
  return J2.includes(r);
}
function pf(r, t) {
  let e, n, i, s = "", a = !1, o;
  const l = [];
  r.children.toArray().forEach((f) => {
    if (a) {
      s = `${s}${Gt(f)}`;
      return;
    }
    if (f.type === "Operator" && f.value === ",") {
      a = !0;
      return;
    }
    l.push(f);
  });
  let [c, u] = l;
  if (u || (u = c, c = void 0), c && (zl(c) ? c.name === "implicit" ? c = void 0 : c.name.startsWith("--") && (e = c.name) : ya(c) && c.children.first && (o = c.children.first.name)), u)
    if (Um(r)) {
      if (zl(u) && lI(u.name))
        n = u.name;
      else if (oI(u)) {
        const f = Number(u.value);
        n = Number.isNaN(f) ? void 0 : f;
      }
    } else Vm(r) && zl(u) && cI(u.name) && (i = u.name);
  const h = `--anchor-${xe(12)}`;
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
function gf(r) {
  return r.value.children.map(
    ({ name: t }) => t
  );
}
function Pl(r) {
  return r ? r.children.map((t) => {
    var e;
    let n;
    ((e = t.children.last) == null ? void 0 : e.type) === "PseudoElementSelector" && (t = Ic(t), n = Gt(t.children.last), t.children.pop());
    const i = Gt(t);
    return {
      selector: i + (n ?? ""),
      elementPart: i,
      pseudoElementPart: n
    };
  }).toArray() : [];
}
let Ki = {}, tr = {}, er = {}, Qi = {}, Jn = {};
function dI() {
  Ki = {}, tr = {}, er = {}, Qi = {}, Jn = {};
}
function hI(r, t) {
  var e;
  if ((Um(r) || Vm(r)) && t) {
    if (t.property.startsWith("--")) {
      const n = Gt(t.value), i = pf(r);
      return Qi[i.uuid] = n, er[t.property] = [
        ...(e = er[t.property]) != null ? e : [],
        i
      ], { changed: !0 };
    }
    if (fs(t.property) || uo(t.property)) {
      const n = pf(r);
      return { prop: t.property, data: n, changed: !0 };
    }
  }
  return {};
}
function fI(r) {
  return iI(r) && r.value.children.first ? M2(r) : null;
}
function pI(r) {
  var t, e;
  if (sI(r) && (t = r.prelude) != null && t.value && (e = r.block) != null && e.children) {
    const n = r.prelude.value, i = [];
    return r.block.children.filter(aI).forEach((s) => {
      var a;
      if ((a = s.block) != null && a.children) {
        const o = s.block.children.filter(
          (c) => jm(c) && (fs(c.property) || uo(c.property) || uI(c.property))
        ), l = {
          uuid: `${n}-try-${xe(12)}`,
          declarations: Object.fromEntries(
            o.map((c) => [c.property, Gt(c.value)])
          )
        };
        i.push(l);
      }
    }), { name: n, blocks: i };
  }
  return {};
}
function gI(r, t) {
  return yt(this, null, function* () {
    let e = t.anchorName;
    const n = t.customPropName;
    if (r && !e) {
      const o = r.getAttribute("anchor"), l = tn(
        r,
        "position-anchor"
      );
      if (l)
        e = l;
      else if (n)
        e = tn(r, n);
      else if (o) {
        const c = `#${CSS.escape(o)}`;
        return yield ff(
          r,
          null,
          [{ selector: c, elementPart: c }],
          []
        );
      }
    }
    const i = e ? Ki[e] || [] : [], s = e ? tr[Fm.All] || [] : [], a = e ? tr[e] || [] : [];
    return yield ff(
      r,
      e || null,
      i,
      [...s, ...a]
    );
  });
}
function mI(r) {
  return yt(this, null, function* () {
    var t, e, n, i, s, a;
    const o = {}, l = {}, c = {}, u = {};
    dI();
    for (const b of r) {
      const w = Zn(b.css);
      Xn(w, {
        visit: "Atrule",
        enter(v) {
          const { name: k, blocks: A } = pI(v);
          k && A != null && A.length && (c[k] = {
            targets: [],
            blocks: A
          });
        }
      });
    }
    for (const b of r) {
      let w = !1;
      const v = Zn(b.css);
      Xn(v, {
        visit: "Declaration",
        enter(k) {
          var A, E;
          const T = (A = this.rule) == null ? void 0 : A.prelude, M = Pl(T), N = fI(k);
          if (N && M.length && c[N]) {
            for (const { selector: S } of M)
              u[S] = { fallbacks: c[N].blocks }, c[N].targets.includes(S) || c[N].targets.push(S);
            for (const S of c[N].blocks) {
              const C = `[data-anchor-polyfill="${S.uuid}"]`;
              (E = this.stylesheet) == null || E.children.prependData({
                type: "Rule",
                prelude: {
                  type: "Raw",
                  value: C
                },
                block: {
                  type: "Block",
                  children: new mt().fromArray(
                    Object.entries(S.declarations).map(([q, O]) => ({
                      type: "Declaration",
                      important: !0,
                      property: q,
                      value: {
                        type: "Raw",
                        value: O
                      }
                    }))
                  )
                }
              }), l[C] = M.map(({ selector: q }) => q).join(", ");
            }
            w = !0;
          }
        }
      }), w && (b.css = Gt(v), b.changed = !0);
    }
    for (const b of r) {
      let w = !1;
      const v = Zn(b.css);
      Xn(v, function(k) {
        var A, E, T;
        const M = (A = this.rule) == null ? void 0 : A.prelude, N = Pl(M);
        if (nI(k) && N.length)
          for (const O of gf(k))
            Ki[O] != null || (Ki[O] = []), Ki[O].push(...N);
        if (rI(k) && N.length)
          for (const O of gf(k))
            tr[O] != null || (tr[O] = []), tr[O].push(...N);
        const {
          prop: S,
          data: C,
          changed: q
        } = hI(k, this.declaration);
        if (S && C && N.length)
          for (const { selector: O } of N)
            o[O] = Bt(Y({}, o[O]), {
              [S]: [...(T = (E = o[O]) == null ? void 0 : E[S]) != null ? T : [], C]
            });
        q && (w = !0);
      }), w && (b.css = Gt(v), b.changed = !0);
    }
    const h = new Set(Object.keys(er)), f = {}, p = (b) => {
      var w, v, k, A, E;
      const T = [], M = new Set((v = (w = f[b]) == null ? void 0 : w.names) != null ? v : []);
      for (; M.size > 0; )
        for (const N of M)
          T.push(...(k = er[N]) != null ? k : []), M.delete(N), (E = (A = f[N]) == null ? void 0 : A.names) != null && E.length && f[N].names.forEach((S) => M.add(S));
      return T;
    };
    for (; h.size > 0; ) {
      const b = [];
      for (const w of r) {
        let v = !1;
        const k = Zn(w.css);
        Xn(k, {
          visit: "Function",
          enter(A) {
            var E, T;
            const M = (E = this.rule) == null ? void 0 : E.prelude, N = this.declaration, S = N == null ? void 0 : N.property;
            if ((M == null ? void 0 : M.children.isEmpty) === !1 && ya(A) && N && S && A.children.first && h.has(
              A.children.first.name
            ) && // For now, we only want assignments to other CSS custom properties
            S.startsWith("--")) {
              const C = A.children.first, q = (T = er[C.name]) != null ? T : [], O = p(C.name);
              if (!(q.length || O.length))
                return;
              const j = `${C.name}-anchor-${xe(12)}`, Q = Gt(N.value);
              Qi[j] = Q, f[S] || (f[S] = { names: [], uuids: [] });
              const H = f[S];
              H.names.includes(C.name) || H.names.push(C.name), H.uuids.push(j), b.push(S), C.name = j, v = !0;
            }
          }
        }), v && (w.css = Gt(k), w.changed = !0);
      }
      h.clear(), b.forEach((w) => h.add(w));
    }
    for (const b of r) {
      let w = !1;
      const v = Zn(b.css);
      Xn(v, {
        visit: "Function",
        enter(k) {
          var A, E, T, M, N, S, C;
          const q = (A = this.rule) == null ? void 0 : A.prelude, O = this.declaration, j = O == null ? void 0 : O.property;
          if ((q == null ? void 0 : q.children.isEmpty) === !1 && ya(k) && O && j && k.children.first && // Now we only want assignments to inset/sizing properties
          (fs(j) || uo(j))) {
            const Q = k.children.first, H = (E = er[Q.name]) != null ? E : [], lt = p(Q.name);
            if (!(H.length || lt.length))
              return;
            const it = `${j}-${xe(12)}`;
            if (lt.length) {
              const dt = /* @__PURE__ */ new Set([Q.name]);
              for (; dt.size > 0; )
                for (const wt of dt) {
                  const U = f[wt];
                  if ((T = U == null ? void 0 : U.names) != null && T.length && (M = U == null ? void 0 : U.uuids) != null && M.length)
                    for (const Me of U.names)
                      for (const qe of U.uuids)
                        Jn[qe] = Bt(Y({}, Jn[qe]), {
                          // - `key` (`propUuid`) is the property-specific
                          //   uuid to append to the new custom property name
                          // - `value` is the new property-specific custom
                          //   property value to use
                          [it]: `${Me}-${it}`
                        });
                  dt.delete(wt), (N = U == null ? void 0 : U.names) != null && N.length && U.names.forEach((Me) => dt.add(Me));
                }
            }
            const vt = Pl(q);
            for (const dt of [...H, ...lt]) {
              const wt = Y({}, dt), U = `--anchor-${xe(12)}-${j}`, Me = wt.uuid;
              wt.uuid = U;
              for (const { selector: qe } of vt)
                o[qe] = Bt(Y({}, o[qe]), {
                  [j]: [...(C = (S = o[qe]) == null ? void 0 : S[j]) != null ? C : [], wt]
                });
              Jn[Me] = Bt(Y({}, Jn[Me]), {
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
      }), w && (b.css = Gt(v), b.changed = !0);
    }
    if (Object.keys(Jn).length > 0)
      for (const b of r) {
        let w = !1;
        const v = Zn(b.css);
        Xn(v, {
          visit: "Function",
          enter(k) {
            var A, E, T, M;
            if (ya(k) && (E = (A = k.children.first) == null ? void 0 : A.name) != null && E.startsWith(
              "--"
            ) && (M = (T = this.declaration) == null ? void 0 : T.property) != null && M.startsWith("--") && this.block) {
              const N = k.children.first, S = Jn[N.name];
              if (S)
                for (const [C, q] of Object.entries(S))
                  this.block.children.appendData({
                    type: "Declaration",
                    important: !1,
                    property: `${this.declaration.property}-${C}`,
                    value: {
                      type: "Raw",
                      value: Gt(this.declaration.value).replace(
                        `var(${N.name})`,
                        `var(${q})`
                      )
                    }
                  }), w = !0;
              Qi[N.name] && (this.declaration.value = {
                type: "Raw",
                value: Qi[N.name]
              }, w = !0);
            }
          }
        }), w && (b.css = Gt(v), b.changed = !0);
      }
    const m = /* @__PURE__ */ new Map();
    for (const [b, w] of Object.entries(o)) {
      let v;
      b.startsWith("[data-anchor-polyfill=") && l[b] ? v = document.querySelectorAll(l[b]) : v = document.querySelectorAll(b);
      for (const [k, A] of Object.entries(w))
        for (const E of A)
          for (const T of v) {
            const M = yield gI(T, E), N = `--anchor-${xe(12)}`;
            m.set(T, Bt(Y({}, (t = m.get(T)) != null ? t : {}), {
              [E.uuid]: N
            })), T.setAttribute(
              "style",
              `${E.uuid}: var(${N}); ${(e = T.getAttribute("style")) != null ? e : ""}`
            ), u[b] = Bt(Y({}, u[b]), {
              declarations: Bt(Y({}, (n = u[b]) == null ? void 0 : n.declarations), {
                [k]: [
                  ...(a = (s = (i = u[b]) == null ? void 0 : i.declarations) == null ? void 0 : s[k]) != null ? a : [],
                  Bt(Y({}, E), { anchorEl: M, targetEl: T, uuid: N })
                ]
              })
            });
          }
    }
    return { rules: u, inlineStyles: m, anchorScopes: tr };
  });
}
function mf(r, t, e = !1) {
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
const bI = Bt(Y({}, ae), { _c: /* @__PURE__ */ new Map() }), Ym = (r) => yt(void 0, null, function* () {
  var t, e, n;
  let i = yield (t = ae.getOffsetParent) == null ? void 0 : t.call(ae, r);
  return (yield (e = ae.isElement) == null ? void 0 : e.call(ae, i)) || (i = (yield (n = ae.getDocumentElement) == null ? void 0 : n.call(ae, r)) || window.document.documentElement), i;
}), yI = (r, t) => {
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
}, vI = (r, t) => {
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
}, bf = (r) => {
  switch (r) {
    case "top":
    case "bottom":
      return "y";
    case "left":
    case "right":
      return "x";
  }
  return null;
}, wI = (r) => {
  switch (r) {
    case "x":
      return "width";
    case "y":
      return "height";
  }
  return null;
}, yf = (r) => tn(r, "display") === "inline", vf = (r, t) => (t === "x" ? ["border-left-width", "border-right-width"] : ["border-top-width", "border-bottom-width"]).reduce(
  (e, n) => e + parseInt(tn(r, n), 10),
  0
) || 0, la = (r, t) => parseInt(tn(r, `margin-${t}`), 10) || 0, xI = (r) => ({
  top: la(r, "top"),
  right: la(r, "right"),
  bottom: la(r, "bottom"),
  left: la(r, "left")
}), wf = (r) => yt(void 0, [r], function* ({
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
        const u = tn(t, "writing-mode");
        c = u.startsWith("vertical-") || u.startsWith("sideways-"), l = vI(s, c);
      }
    }
    return l ? `${n[l]}px` : a;
  }
  if (i !== void 0) {
    let l, c;
    const u = bf(e);
    if (!(fs(e) && u && (!fs(i) || u === bf(i))))
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
          const p = (yield (o = ae.isRTL) == null ? void 0 : o.call(ae, t)) || !1;
          l = yI(i, p);
        }
    }
    const h = typeof l == "number" && !Number.isNaN(l), f = wI(u);
    if (h && f) {
      (e === "bottom" || e === "right") && (c = yield Ym(t));
      let p = n[u] + n[f] * (l / 100);
      switch (e) {
        case "bottom": {
          if (!c)
            break;
          let m = c.clientHeight;
          if (m === 0 && yf(c)) {
            const b = vf(c, u);
            m = c.offsetHeight - b;
          }
          p = m - p;
          break;
        }
        case "right": {
          if (!c)
            break;
          let m = c.clientWidth;
          if (m === 0 && yf(c)) {
            const b = vf(c, u);
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
function kI(r, t = !1) {
  return yt(this, null, function* () {
    const e = document.documentElement;
    for (const [n, i] of Object.entries(r))
      for (const s of i) {
        const a = s.anchorEl, o = s.targetEl;
        if (a && o)
          ag(
            a,
            o,
            () => yt(this, null, function* () {
              const l = yield ae.getElementRects({
                reference: a,
                floating: o,
                strategy: "absolute"
              }), c = yield wf({
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
          const l = yield wf({
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
function SI(r, t, e = !1) {
  return yt(this, null, function* () {
    if (!t.length)
      return;
    const n = document.querySelectorAll(r);
    for (const i of n) {
      let s = !1;
      const a = yield Ym(i);
      ag(
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
              const c = yield ae.getElementRects({
                reference: i,
                floating: i,
                strategy: "absolute"
              }), u = yield IS(
                {
                  x: i.offsetLeft,
                  y: i.offsetTop,
                  platform: bI,
                  rects: c,
                  elements: { floating: i },
                  strategy: "absolute"
                },
                {
                  boundary: a,
                  rootBoundary: "document",
                  padding: xI(i)
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
function AI(r, t = !1) {
  return yt(this, null, function* () {
    var e, n;
    for (const i of Object.values(r))
      yield kI((e = i.declarations) != null ? e : {}, t);
    for (const [i, s] of Object.entries(r))
      yield SI(
        i,
        (n = s.fallbacks) != null ? n : [],
        t
      );
  });
}
function EI(r) {
  return yt(this, null, function* () {
    const t = !!window.UPDATE_ANCHOR_ON_ANIMATION_FRAME;
    let e = yield Y2();
    (yield _2(e)) && (e = yield mf(e));
    const { rules: n, inlineStyles: i } = yield mI(e);
    return Object.values(n).length && (yield mf(e, i, !0), yield AI(n, t)), n;
  });
}
function xf() {
  "anchorName" in document.documentElement.style || EI(), pc.initialize(), Mc.getInstance().init(), qc.getInstance().init(), _c.getInstance().init(), Sf.getInstance().init(), Rc.getInstance().init(), zc.getInstance().init(), Af.getInstance().init(), Pc.getInstance().init(), Wr.getInstance().init(), Bc.getInstance().init(), $c.getInstance().init(), jc.getInstance().init(), Gr.getInstance().init(), Fc.getInstance().init(), Kr.getInstance().init(), Hc.getInstance().init(), Zr.getInstance().init(), Jr.getInstance().init(), Xc.getInstance().init(), ti.getInstance().init(), Zc.getInstance().init(), _f.getInstance().init(), new Jc();
}
const kf = {
  FormActions: Mc.getInstance(),
  TextareaActions: qc.getInstance(),
  AlertActions: _c.getInstance(),
  AvatarActions: Sf.getInstance(),
  BadgeActions: Rc.getInstance(),
  ButtonActions: zc.getInstance(),
  CalendarCore: Af.getInstance(),
  RadioActions: Pc.getInstance(),
  RangeActions: Wr.getInstance(),
  SelectActions: Bc.getInstance(),
  TabsActions: $c.getInstance(),
  ModalActions: jc.getInstance(),
  ToastActions: Gr.getInstance(),
  DropdownActions: Fc.getInstance(),
  TableActions: Kr.getInstance(),
  ButtonGroupActions: Hc.getInstance(),
  TooltipActions: Zr.getInstance(),
  TimePickerActions: Jr.getInstance(),
  EditorActions: Xc.getInstance(),
  DatePickerActions: ti.getInstance(),
  AddToCartActions: Zc.getInstance(),
  GalleryActions: _f.getInstance(),
  PopoverActions: new Jc(),
  // Expose Quill for EditorActions to use
  Quill: I,
  init: xf,
  initialize: xf
  // Alias for consistency
};
typeof window < "u" && (window.KeysUI = kf, window.Quill = I, window.manualSyncEditor = () => kf.EditorActions.manualSync());
export {
  Zc as AddToCartActions,
  _c as AlertActions,
  Sf as AvatarActions,
  Rc as BadgeActions,
  ut as BaseActionClass,
  zc as ButtonActions,
  Hc as ButtonGroupActions,
  Af as CalendarCore,
  y as DOMUtils,
  ti as DatePickerActions,
  Fc as DropdownActions,
  Xc as EditorActions,
  D as EventUtils,
  LI as FloatingManager,
  Mc as FormActions,
  _f as GalleryActions,
  jc as ModalActions,
  Jc as PopoverActions,
  pc as RTLUtils,
  Pc as RadioActions,
  Wr as RangeActions,
  Bc as SelectActions,
  Kr as TableActions,
  $c as TabsActions,
  qc as TextareaActions,
  Jr as TimePickerActions,
  Gr as ToastActions,
  Zr as TooltipActions,
  kf as default,
  xf as initializeKeysUI
};
