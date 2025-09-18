function H(F, e = "") {
  const t = window.KeysUITranslations;
  if (!t)
    return e;
  const s = F.split(".");
  let i = t;
  for (const a of s)
    if (i = i == null ? void 0 : i[a], i === void 0)
      return e;
  return i || e;
}
const b = class b {
  constructor() {
    this.initialized = !1;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return b.instance || (b.instance = new b()), b.instance;
  }
  /**
   * Initialize FormActions for all form elements with actions
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initialized = !0);
  }
  /**
   * Bind event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      var s;
      const t = (s = e.target) == null ? void 0 : s.closest(".input-action");
      t && (e.preventDefault(), this.handleActionClick(t));
    }), document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const t = e.target;
        t != null && t.classList.contains("input-action") && (e.preventDefault(), this.handleActionClick(t));
      }
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(e) {
    const t = e.closest(".input-action"), s = t == null ? void 0 : t.dataset.action;
    if (!s) return;
    const i = this.findFormElementForAction(e);
    if (i) {
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
          this.openExternalUrl(e.dataset.url);
          break;
        default:
          this.handleCustomAction(i, s);
          break;
      }
      this.dispatchActionEvent(i, s);
    }
  }
  /**
   * Find the form element (input or textarea) associated with an action button
   */
  findFormElementForAction(e) {
    const t = e.closest(".relative");
    return (t == null ? void 0 : t.querySelector("input, textarea")) || null;
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
    const s = e.querySelector(".button-icon-default"), i = e.querySelector(".button-icon-toggle"), a = e.querySelector(".button-icon-success"), n = e.dataset.iconDefault, o = e.dataset.iconToggle, r = e.dataset.iconSuccess;
    s && (s.classList.remove("opacity-100"), s.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), a && (a.classList.remove("opacity-100", "scale-110", "scale-90"), a.classList.add("opacity-0")), t === n && s ? (s.classList.remove("opacity-0"), s.classList.add("opacity-100")) : t === o && i ? (i.classList.remove("opacity-0"), i.classList.add("opacity-100")) : t === r && a && (a.classList.remove("opacity-0"), a.classList.add("opacity-100", "scale-110"));
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
    const s = t.querySelector("button");
    try {
      await navigator.clipboard.writeText(e.value), this.showFeedback(e, H("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && await this.showCopySuccess(s, t);
    } catch {
      this.fallbackCopyToClipboard(e, t);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(e, t) {
    const s = t.querySelector("button");
    e.select(), e instanceof HTMLInputElement && e.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(e, H("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && this.showCopySuccess(s, t);
    } catch {
      this.showFeedback(e, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(e, t) {
    const s = e.dataset.iconSuccess, i = e.dataset.labelSuccess, a = e.dataset.iconDefault, n = e.querySelector(".sr-only");
    if (s && a)
      if (await this.swapButtonIcon(e, s), i && n) {
        const o = n.textContent;
        n.textContent = i, setTimeout(async () => {
          await this.swapButtonIcon(e, a), o && n && (n.textContent = o);
        }, 2e3);
      } else
        setTimeout(async () => {
          await this.swapButtonIcon(e, a);
        }, 2e3);
  }
  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(e, t, s) {
    var d;
    const i = e.type === "password", a = i ? "text" : "password", n = t.dataset.iconDefault, o = t.dataset.iconToggle, r = (d = t.querySelector(".sr-only")) == null ? void 0 : d.textContent, l = t.dataset.labelToggle;
    e.type = a;
    const c = t.querySelector(".sr-only");
    i ? (o && await this.swapButtonIcon(t, o), l && c && (c.textContent = l), t.setAttribute("aria-label", l || "Hide password")) : (n && await this.swapButtonIcon(t, n), r && c && (c.textContent = r), t.setAttribute("aria-label", r || "Show password"));
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
    const s = new CustomEvent("form-action", {
      detail: {
        element: e,
        action: t,
        value: e.value
      },
      bubbles: !0
    });
    e.dispatchEvent(s);
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(e, t, s = "success") {
    const i = document.createElement("div");
    i.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${s === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, i.textContent = t;
    const a = e.closest(".relative");
    a && (a.appendChild(i), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 2e3));
  }
  /**
   * Add a custom action handler
   */
  addActionHandler(e, t) {
    document.addEventListener("form-action", (s) => {
      const i = s;
      i.detail.action === e && t(i.detail.element);
    });
  }
  /**
   * Destroy FormActions and clean up
   */
  destroy() {
    this.initialized = !1;
  }
};
b.instance = null;
let D = b;
D.getInstance();
const m = class m {
  constructor() {
    this.initialized = !1;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return m.instance || (m.instance = new m()), m.instance;
  }
  /**
   * Initialize AlertActions for all dismissible alerts
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initialized = !0);
  }
  /**
   * Bind event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      var s;
      const t = (s = e.target) == null ? void 0 : s.closest("[data-dismiss-alert]");
      t && (e.preventDefault(), this.handleDismissClick(t));
    }), document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const t = e.target;
        t != null && t.hasAttribute("data-dismiss-alert") && (e.preventDefault(), this.handleDismissClick(t));
      }
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
    return e.closest('[data-dismissible="true"]') || null;
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(e) {
    e.classList.add("alert-dismissing"), e.style.transition = "all 0.3s ease-out", e.style.opacity = "0", e.style.transform = "translateX(100%)", e.style.maxHeight = "0", e.style.padding = "0", e.style.margin = "0", e.style.overflow = "hidden", setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e);
    }, 300);
  }
  /**
   * Show an alert programmatically
   */
  showAlert(e) {
    e.style.display = "block", e.style.opacity = "1", e.style.transform = "translateX(0)", this.dispatchAlertEvent(e, "show");
  }
  /**
   * Create and show a new alert dynamically
   */
  createAlert(e) {
    const {
      variant: t = "info",
      title: s,
      message: i,
      dismissible: a = !0,
      duration: n,
      container: o = document.body
    } = e, r = document.createElement("div");
    r.className = this.getAlertClasses(t), r.setAttribute("role", "alert"), a && r.setAttribute("data-dismissible", "true");
    const l = this.buildAlertContent(t, s, i, a);
    return r.innerHTML = l, o.appendChild(r), r.style.opacity = "0", r.style.transform = "translateX(100%)", setTimeout(() => {
      this.showAlert(r);
    }, 10), n && n > 0 && setTimeout(() => {
      this.dismissAlert(r);
    }, n), this.dispatchAlertEvent(r, "create"), r;
  }
  /**
   * Get CSS classes for alert variant
   */
  getAlertClasses(e) {
    const t = "rounded-lg border p-4 space-y-3", s = {
      info: "bg-info/5 border-info/20 text-info-foreground",
      success: "bg-success/5 border-success/20 text-success-foreground",
      warning: "bg-warning/5 border-warning/20 text-warning-foreground",
      danger: "bg-danger/5 border-danger/20 text-danger-foreground",
      neutral: "bg-neutral/5 border-neutral/20 text-neutral-foreground"
    };
    return `${t} ${s[e] || s.info}`;
  }
  /**
   * Build alert content HTML
   */
  buildAlertContent(e, t, s, i) {
    const a = this.getVariantIcon(e), n = this.getVariantIconColor(e);
    return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${n}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(a)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${t ? `<div class="text-base font-medium">${t}</div>` : ""}
                    <div class="text-sm opacity-90 ${t ? "mt-1" : ""}">${s || ""}</div>
                </div>
                ${i ? `
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
    const s = new CustomEvent("alert-action", {
      detail: {
        alert: e,
        action: t
      },
      bubbles: !0
    });
    e.dispatchEvent(s), document.dispatchEvent(s);
  }
  /**
   * Add a custom alert action handler
   */
  addActionHandler(e, t) {
    document.addEventListener("alert-action", (s) => {
      const i = s;
      i.detail.action === e && t(i.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(e) {
    document.querySelectorAll(`[data-dismissible="true"][class*="${e}"]`).forEach((s) => {
      this.dismissAlert(s);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    document.querySelectorAll('[data-dismissible="true"]').forEach((t) => {
      this.dismissAlert(t);
    });
  }
  /**
   * Destroy AlertActions and clean up
   */
  destroy() {
    this.initialized = !1;
  }
};
m.instance = null;
let M = m;
M.getInstance();
const w = class w {
  constructor() {
    this.initialized = !1;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return w.instance || (w.instance = new w()), w.instance;
  }
  /**
   * Initialize RadioActions for all radio elements
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initialized = !0);
  }
  /**
   * Bind event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      const s = e.target.closest("label[for]");
      if (!s) return;
      const i = s.getAttribute("for");
      if (!i) return;
      const a = document.getElementById(i);
      !a || a.type !== "radio" || this.focusRadioInput(a);
    }), document.addEventListener("keydown", (e) => {
      const t = e.target;
      !t || t.type !== "radio" || (e.key === "ArrowDown" || e.key === "ArrowRight" ? (e.preventDefault(), this.focusNextRadio(t)) : (e.key === "ArrowUp" || e.key === "ArrowLeft") && (e.preventDefault(), this.focusPreviousRadio(t)));
    });
  }
  /**
   * Focus a radio input with proper timing
   */
  focusRadioInput(e) {
    setTimeout(() => {
      e.focus(), this.dispatchFocusEvent(e);
    }, 0);
  }
  /**
   * Focus the next radio in the same group
   */
  focusNextRadio(e) {
    const t = this.getRadioGroup(e), i = (t.indexOf(e) + 1) % t.length, a = t[i];
    a && (a.focus(), a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(a));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(e) {
    const t = this.getRadioGroup(e), s = t.indexOf(e), i = s === 0 ? t.length - 1 : s - 1, a = t[i];
    a && (a.focus(), a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(a));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(e) {
    const t = e.name;
    return t ? Array.from(document.querySelectorAll(`input[type="radio"][name="${t}"]`)).filter((i) => !i.disabled) : [e];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(e) {
    const t = new CustomEvent("radio-focus", {
      detail: {
        radio: e,
        name: e.name,
        value: e.value,
        checked: e.checked
      },
      bubbles: !0
    });
    e.dispatchEvent(t);
  }
  /**
   * Add a custom radio focus handler
   */
  addFocusHandler(e) {
    document.addEventListener("radio-focus", (t) => {
      e(t.detail.radio);
    });
  }
  /**
   * Destroy RadioActions and clean up
   */
  destroy() {
    this.initialized = !1;
  }
};
w.instance = null;
let O = w;
O.getInstance();
const v = class v {
  constructor() {
    this.initialized = !1, this.selectStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return v.instance || (v.instance = new v()), v.instance;
  }
  /**
   * Initialize SelectActions for all select elements
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initializeSelects(), this.initialized = !0);
  }
  /**
   * Initialize all existing select elements
   */
  initializeSelects() {
    document.querySelectorAll('[data-select="true"]').forEach((e) => {
      this.initializeSelect(e);
    });
  }
  /**
   * Initialize a single select element
   */
  initializeSelect(e) {
    const t = e.dataset.multiple === "true", s = e.dataset.value;
    let i = [];
    if (s)
      try {
        i = t ? JSON.parse(s) : [s];
      } catch {
        i = t ? [] : [s];
      }
    const a = {
      isOpen: !1,
      selectedValues: i,
      searchTerm: "",
      focusedIndex: -1,
      filteredOptions: []
    };
    this.selectStates.set(e, a), this.updateOptions(e), this.updateOptionsSelectedState(e), this.updateDisplay(e);
  }
  /**
   * Bind global event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (t) => {
      var l, c, d, u, h, f, k;
      const s = (l = t.target) == null ? void 0 : l.closest("[data-remove-chip]");
      if (s) {
        t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation();
        const p = s.dataset.removeChip, N = s.closest('[data-select="true"]');
        N && p && this.removeChip(N, p);
        return;
      }
      const i = (c = t.target) == null ? void 0 : c.closest("[data-select-clear]");
      if (i) {
        t.preventDefault(), t.stopPropagation();
        const p = i.closest('[data-select="true"]');
        p && this.clearSelection(p);
        return;
      }
      const a = (d = t.target) == null ? void 0 : d.closest("[data-select-option]");
      if (a) {
        t.preventDefault(), t.stopPropagation();
        const p = a.closest('[data-select="true"]');
        p && this.selectOption(p, a);
        return;
      }
      const n = (u = t.target) == null ? void 0 : u.closest("[data-select-trigger]");
      if (n) {
        t.preventDefault(), t.stopPropagation();
        const p = n.closest('[data-select="true"]');
        p && !this.isDisabled(p) && this.toggleDropdown(p);
        return;
      }
      if ((h = t.target) == null ? void 0 : h.closest("[data-select-search]")) {
        t.stopPropagation();
        return;
      }
      const r = (k = (f = t.target) == null ? void 0 : f.closest("[data-select-search]")) == null ? void 0 : k.parentElement;
      if (r && r.querySelector("[data-select-search]")) {
        t.stopPropagation();
        return;
      }
      this.closeAllDropdowns();
    }), document.addEventListener("input", (t) => {
      const s = t.target;
      if (s != null && s.matches("[data-select-search]")) {
        const i = s.closest('[data-select="true"]');
        i && this.handleSearch(i, s.value);
      }
    }), document.addEventListener("keydown", (t) => {
      var i;
      const s = (i = t.target) == null ? void 0 : i.closest('[data-select="true"]');
      s && this.handleKeydown(s, t);
    }), document.addEventListener("focusin", (t) => {
      var i;
      const s = (i = t.target) == null ? void 0 : i.closest('[data-select="true"]');
      s && this.isOpen(s);
    }), window.addEventListener("resize", () => {
      this.repositionDropdowns();
    }), new MutationObserver((t) => {
      t.forEach((s) => {
        s.addedNodes.forEach((i) => {
          i.nodeType === Node.ELEMENT_NODE && i.querySelectorAll('[data-select="true"]').forEach((o) => {
            this.selectStates.has(o) || this.initializeSelect(o);
          });
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  /**
   * Toggle dropdown open/closed state
   */
  toggleDropdown(e) {
    const t = this.selectStates.get(e);
    t && (t.isOpen ? this.closeDropdown(e) : this.openDropdown(e));
  }
  /**
   * Open dropdown
   */
  openDropdown(e) {
    const t = this.selectStates.get(e);
    if (!t || this.isDisabled(e)) return;
    this.closeAllDropdowns(), t.isOpen = !0, this.selectStates.set(e, t);
    const s = e.querySelector("[data-select-dropdown]"), i = e.querySelector("[data-select-trigger]"), a = e.querySelector("[data-select-search]");
    if (s && (s.classList.remove("hidden"), this.positionDropdown(e)), i) {
      i.setAttribute("aria-expanded", "true");
      const n = i.querySelector(".select-arrow");
      n && n.classList.add("rotate-180");
    }
    a && e.dataset.searchable === "true" && setTimeout(() => a.focus(), 10), this.updateFilteredOptions(e), this.dispatchSelectEvent(e, "select:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(e) {
    const t = this.selectStates.get(e);
    if (!t || !t.isOpen) return;
    t.isOpen = !1, t.searchTerm = "", t.focusedIndex = -1, this.selectStates.set(e, t);
    const s = e.querySelector("[data-select-dropdown]"), i = e.querySelector("[data-select-trigger]"), a = e.querySelector("[data-select-search]");
    if (s && s.classList.add("hidden"), i) {
      i.setAttribute("aria-expanded", "false");
      const n = i.querySelector(".select-arrow");
      n && n.classList.remove("rotate-180");
    }
    a && (a.value = ""), this.handleSearch(e, ""), this.dispatchSelectEvent(e, "select:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.selectStates.forEach((e, t) => {
      e.isOpen && this.closeDropdown(t);
    });
  }
  /**
   * Handle option selection
   */
  selectOption(e, t) {
    const s = this.selectStates.get(e), i = t.dataset.value;
    if (!s || !i || t.getAttribute("aria-disabled") === "true")
      return;
    const a = e.dataset.multiple === "true";
    if (a) {
      const n = s.selectedValues.indexOf(i);
      n > -1 ? s.selectedValues.splice(n, 1) : s.selectedValues.push(i);
    } else
      s.selectedValues = [i], this.closeDropdown(e);
    this.selectStates.set(e, s), this.updateDisplay(e), this.updateHiddenInputs(e), this.updateOptionsSelectedState(e), this.dispatchSelectEvent(e, "select:change", {
      value: a ? s.selectedValues : i,
      selectedValues: s.selectedValues
    });
  }
  /**
   * Remove chip (for multiple selection)
   */
  removeChip(e, t) {
    const s = this.selectStates.get(e);
    if (!s) return;
    const i = s.selectedValues.indexOf(t);
    i > -1 && (s.selectedValues.splice(i, 1), this.selectStates.set(e, s), this.updateDisplay(e), this.updateHiddenInputs(e), this.updateOptionsSelectedState(e), this.dispatchSelectEvent(e, "select:change", {
      value: s.selectedValues,
      selectedValues: s.selectedValues
    }));
  }
  /**
   * Clear all selections
   */
  clearSelection(e) {
    const t = this.selectStates.get(e);
    t && (t.selectedValues = [], this.selectStates.set(e, t), this.updateDisplay(e), this.updateHiddenInputs(e), this.updateOptionsSelectedState(e), this.dispatchSelectEvent(e, "select:change", {
      value: e.dataset.multiple === "true" ? [] : "",
      selectedValues: []
    }));
  }
  /**
   * Handle search functionality
   */
  handleSearch(e, t) {
    const s = this.selectStates.get(e);
    s && (s.searchTerm = t.toLowerCase(), this.selectStates.set(e, s), this.updateFilteredOptions(e), this.updateOptionsVisibility(e));
  }
  /**
   * Update filtered options based on search term
   */
  updateFilteredOptions(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    const s = this.getAllOptions(e);
    t.searchTerm ? t.filteredOptions = s.filter(
      (i) => i.searchableText.includes(t.searchTerm)
    ) : t.filteredOptions = s, this.selectStates.set(e, t);
  }
  /**
   * Update options visibility based on filter
   */
  updateOptionsVisibility(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    const s = e.querySelectorAll("[data-select-option]"), i = e.querySelector("[data-select-no-results]");
    let a = 0;
    s.forEach((n) => {
      const o = n, r = o.dataset.value || "";
      t.filteredOptions.some((c) => c.value === r) ? (o.style.display = "", a++) : o.style.display = "none";
    }), i && (a === 0 && t.searchTerm ? i.classList.remove("hidden") : i.classList.add("hidden"));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(e, t) {
    const s = this.selectStates.get(e);
    if (s)
      switch (t.key) {
        case "Enter":
        case " ":
          if (!s.isOpen)
            t.preventDefault(), this.openDropdown(e);
          else if (s.focusedIndex >= 0) {
            t.preventDefault();
            const i = s.filteredOptions[s.focusedIndex];
            i && this.selectOption(e, i.element);
          }
          break;
        case "Escape":
          if (s.isOpen) {
            t.preventDefault(), this.closeDropdown(e);
            const i = e.querySelector("[data-select-trigger]");
            i && i.focus();
          }
          break;
        case "ArrowDown":
          s.isOpen ? (t.preventDefault(), this.navigateOptions(e, 1)) : (t.preventDefault(), this.openDropdown(e));
          break;
        case "ArrowUp":
          s.isOpen && (t.preventDefault(), this.navigateOptions(e, -1));
          break;
        case "Tab":
          s.isOpen && this.closeDropdown(e);
          break;
      }
  }
  /**
   * Navigate through options with arrow keys
   */
  navigateOptions(e, t) {
    const s = this.selectStates.get(e);
    if (!s || !s.isOpen) return;
    const i = s.filteredOptions.length;
    i !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = t > 0 ? 0 : i - 1 : (s.focusedIndex += t, s.focusedIndex >= i ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = i - 1)), this.selectStates.set(e, s), this.updateOptionFocus(e));
  }
  /**
   * Update visual focus state of options
   */
  updateOptionFocus(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    e.querySelectorAll("[data-select-option]").forEach((i, a) => {
      const n = i;
      a === t.focusedIndex ? (n.classList.add("bg-neutral-100", "dark:bg-neutral-800"), n.scrollIntoView({ block: "nearest" })) : n.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update display of selected values
   */
  updateDisplay(e) {
    if (!this.selectStates.get(e)) return;
    e.dataset.multiple === "true" ? this.updateChipsDisplay(e) : this.updateSingleValueDisplay(e);
  }
  /**
   * Update chips display for multiple selection using Badge components
   */
  updateChipsDisplay(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    const s = e.querySelector("[data-select-chips]");
    if (s)
      if (s.innerHTML = "", t.selectedValues.length === 0) {
        const i = e.dataset.placeholder || "Select options...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${i}</span>`;
      } else
        t.selectedValues.forEach((i) => {
          const a = this.findOptionByValue(e, i), n = a ? a.displayLabel : i, o = e.dataset.clearable === "true" && !this.isDisabled(e), r = `select-chip-${this.generateChipId(i)}`, l = document.createElement("button");
          l.type = "button", l.className = "inline-flex items-center gap-1 font-medium cursor-pointer transition-colors px-1.5 py-0.5 text-xs rounded-sm", l.style.cssText = `
                    background-color: var(--color-brand-50);
                    color: var(--color-brand-700);
                    border: 1px solid var(--color-brand-200);
                `, l.setAttribute("data-chip-value", i), l.setAttribute("data-remove-chip", i), l.setAttribute("data-dismiss-target", `#${r}`), l.setAttribute("aria-label", "Remove badge"), l.id = r, l.addEventListener("mouseenter", () => {
            l.style.backgroundColor = "var(--color-brand-100)";
          }), l.addEventListener("mouseleave", () => {
            l.style.backgroundColor = "var(--color-brand-50)";
          });
          const c = document.createElement("span");
          if (c.textContent = n, l.appendChild(c), o) {
            const d = document.createElement("span");
            d.className = "text-brand-600 hover:text-brand-700 ml-1 flex-shrink-0 font-bold leading-none", d.textContent = "×", d.setAttribute("aria-hidden", "true"), l.appendChild(d);
            const u = document.createElement("span");
            u.className = "sr-only", u.textContent = "Remove badge", l.appendChild(u);
          }
          s.appendChild(l);
        });
  }
  /**
   * Update single value display
   */
  updateSingleValueDisplay(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    const s = e.querySelector(".select-value");
    if (s)
      if (t.selectedValues.length === 0) {
        const i = e.dataset.placeholder || "Select option...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${i}</span>`;
      } else {
        const i = t.selectedValues[0], a = this.findOptionByValue(e, i), n = a ? a.displayLabel : i;
        s.textContent = n;
      }
  }
  /**
   * Update hidden form inputs
   */
  updateHiddenInputs(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    const s = e.dataset.multiple === "true", i = e.dataset.name;
    if (!i) return;
    if (e.querySelectorAll(".select-hidden-input").forEach((n) => n.remove()), s)
      t.selectedValues.forEach((n) => {
        const o = document.createElement("input");
        o.type = "hidden", o.name = `${i}[]`, o.value = n, o.className = "select-hidden-input", e.appendChild(o);
      });
    else {
      const n = document.createElement("input");
      n.type = "hidden", n.name = i, n.value = t.selectedValues[0] || "", n.className = "select-hidden-input", e.appendChild(n);
    }
  }
  /**
   * Update options selected state attributes
   */
  updateOptionsSelectedState(e) {
    const t = this.selectStates.get(e);
    if (!t) return;
    e.querySelectorAll("[data-select-option]").forEach((i) => {
      var r, l, c, d;
      const a = i, n = a.dataset.value || "", o = t.selectedValues.includes(n);
      if (a.setAttribute("aria-selected", o ? "true" : "false"), o) {
        a.classList.add("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const u = a.querySelector(".text-brand-600");
        u && ((r = u.parentElement) == null || r.classList.remove("opacity-0"), (l = u.parentElement) == null || l.classList.add("opacity-100"));
      } else {
        a.classList.remove("bg-brand-50", "text-brand-700", "dark:bg-brand-900/20", "dark:text-brand-300");
        const u = a.querySelector(".text-brand-600");
        u && ((c = u.parentElement) == null || c.classList.add("opacity-0"), (d = u.parentElement) == null || d.classList.remove("opacity-100"));
      }
    });
  }
  /**
   * Update options list
   */
  updateOptions(e) {
    const t = this.getAllOptions(e), s = this.selectStates.get(e);
    s && (s.filteredOptions = t, this.selectStates.set(e, s));
  }
  /**
   * Get all options from select element
   */
  getAllOptions(e) {
    const t = e.querySelectorAll("[data-select-option]");
    return Array.from(t).map((s) => {
      var n, o;
      const i = s, a = i.dataset.displayLabel || ((n = i.textContent) == null ? void 0 : n.trim()) || "";
      return {
        element: i,
        value: i.dataset.value || "",
        label: ((o = i.textContent) == null ? void 0 : o.trim()) || "",
        displayLabel: a,
        searchableText: i.dataset.searchableText || "",
        disabled: i.getAttribute("aria-disabled") === "true"
      };
    });
  }
  /**
   * Find option by value
   */
  findOptionByValue(e, t) {
    return this.getAllOptions(e).find((i) => i.value === t) || null;
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(e) {
    const t = e.querySelector("[data-select-dropdown]"), s = e.querySelector("[data-select-trigger]");
    if (!t || !s) return;
    const i = s.getBoundingClientRect(), a = t.getBoundingClientRect(), o = window.innerHeight - i.bottom, r = i.top, l = a.height || 240;
    o < l && r > l ? (t.style.bottom = "100%", t.style.top = "auto", t.style.marginBottom = "4px", t.style.marginTop = "0") : (t.style.top = "100%", t.style.bottom = "auto", t.style.marginTop = "4px", t.style.marginBottom = "0");
  }
  /**
   * Reposition all open dropdowns
   */
  repositionDropdowns() {
    this.selectStates.forEach((e, t) => {
      e.isOpen && this.positionDropdown(t);
    });
  }
  /**
   * Check if select is disabled
   */
  isDisabled(e) {
    return e.dataset.disabled === "true";
  }
  /**
   * Check if dropdown is open
   */
  isOpen(e) {
    const t = this.selectStates.get(e);
    return t ? t.isOpen : !1;
  }
  /**
   * Generate unique chip ID for a value
   */
  generateChipId(e) {
    return btoa(e).replace(/[^a-zA-Z0-9]/g, "").substring(0, 8) + Date.now().toString(36);
  }
  /**
   * Dispatch custom select event
   */
  dispatchSelectEvent(e, t, s = null) {
    const i = new CustomEvent(t, {
      detail: {
        select: e,
        ...s
      },
      bubbles: !0
    });
    e.dispatchEvent(i);
  }
  /**
   * Get select state (for external access)
   */
  getSelectState(e) {
    return this.selectStates.get(e) || null;
  }
  /**
   * Set selected values programmatically
   */
  setSelectedValues(e, t) {
    const s = this.selectStates.get(e);
    if (!s) return;
    const i = e.dataset.multiple === "true";
    s.selectedValues = i ? t : t.slice(0, 1), this.selectStates.set(e, s), this.updateDisplay(e), this.updateHiddenInputs(e), this.updateOptionsSelectedState(e), this.dispatchSelectEvent(e, "select:change", {
      value: i ? s.selectedValues : s.selectedValues[0] || "",
      selectedValues: s.selectedValues
    });
  }
  /**
   * Destroy SelectActions and clean up
   */
  destroy() {
    this.selectStates.clear(), this.initialized = !1;
  }
};
v.instance = null;
let z = v;
z.getInstance();
const y = class y {
  constructor() {
    this.initialized = !1, this.tabsStates = /* @__PURE__ */ new Map(), this.resizeTimeout = 0;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return y.instance || (y.instance = new y()), y.instance;
  }
  /**
   * Initialize TabsActions for all tabs elements
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initializeTabs(), this.initialized = !0);
  }
  /**
   * Initialize all existing tabs elements
   */
  initializeTabs() {
    document.querySelectorAll('[data-tabs="true"]').forEach((e) => {
      this.initializeTabsElement(e);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(e) {
    const t = e.dataset.orientation || "horizontal", s = e.dataset.variant || "default", i = e.dataset.disabled === "true", a = e.dataset.value, n = Array.from(e.querySelectorAll('[data-tabs-trigger="true"]')), o = Array.from(e.querySelectorAll('[data-tabs-panel="true"]'));
    let r = a;
    if (!r && n.length > 0) {
      const c = n.find((d) => d.getAttribute("aria-disabled") !== "true");
      r = (c == null ? void 0 : c.dataset.value) || null;
    }
    const l = {
      activeTab: r,
      tabs: n,
      panels: o,
      orientation: t,
      variant: s,
      disabled: i
    };
    this.tabsStates.set(e, l), this.updateTabsState(e), this.initializeMarker(e), e.classList.add("tabs-initialized");
  }
  /**
   * Bind global event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (t) => {
      var i;
      const s = (i = t.target) == null ? void 0 : i.closest('[data-tabs-trigger="true"]');
      if (s) {
        t.preventDefault();
        const a = s.closest('[data-tabs="true"]');
        a && s.getAttribute("aria-disabled") !== "true" && this.activateTab(a, s.dataset.value || "");
      }
    }), document.addEventListener("keydown", (t) => {
      var i;
      const s = (i = t.target) == null ? void 0 : i.closest('[data-tabs-trigger="true"]');
      if (s) {
        const a = s.closest('[data-tabs="true"]');
        a && this.handleKeydown(a, t);
      }
    }), window.addEventListener("resize", () => {
      this.handleResize();
    }), new MutationObserver((t) => {
      t.forEach((s) => {
        s.addedNodes.forEach((i) => {
          i.nodeType === Node.ELEMENT_NODE && i.querySelectorAll('[data-tabs="true"]').forEach((o) => {
            this.tabsStates.has(o) || this.initializeTabsElement(o);
          });
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  /**
   * Activate a specific tab
   */
  activateTab(e, t, s = !1) {
    const i = this.tabsStates.get(e);
    if (!i || i.disabled) return;
    const a = i.tabs.find((o) => o.dataset.value === t);
    if (!a || a.getAttribute("aria-disabled") === "true")
      return;
    const n = i.activeTab;
    i.activeTab = t, this.tabsStates.set(e, i), this.updateTabsState(e), this.repositionMarker(e, a), s && a.focus(), this.dispatchTabsEvent(e, "tabs:change", {
      activeTab: t,
      previousTab: n
    });
  }
  /**
   * Update tabs visual state and panel visibility
   */
  updateTabsState(e) {
    const t = this.tabsStates.get(e);
    t && (t.tabs.forEach((s) => {
      const i = s.dataset.value === t.activeTab, a = s.getAttribute("aria-disabled") === "true";
      s.setAttribute("aria-selected", i ? "true" : "false"), s.setAttribute("data-state", i ? "active" : "inactive"), a ? s.setAttribute("tabindex", "-1") : i ? s.setAttribute("tabindex", "0") : s.setAttribute("tabindex", "-1"), s.id = `tab-${s.dataset.value}`;
    }), t.panels.forEach((s) => {
      const i = s.dataset.value === t.activeTab;
      s.setAttribute("data-state", i ? "active" : "inactive"), s.style.display = i ? "block" : "none", s.setAttribute("aria-labelledby", `tab-${s.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(e, t) {
    const s = this.tabsStates.get(e);
    if (!s || s.disabled) return;
    const i = t.target, a = s.tabs.indexOf(i);
    let n = -1;
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowUp":
        t.preventDefault(), n = s.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(s, a) : t.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(s, a) : a;
        break;
      case "ArrowRight":
      case "ArrowDown":
        t.preventDefault(), n = s.orientation === "horizontal" ? this.getNextEnabledTabIndex(s, a) : t.key === "ArrowDown" ? this.getNextEnabledTabIndex(s, a) : a;
        break;
      case "Home":
        t.preventDefault(), n = this.getFirstEnabledTabIndex(s);
        break;
      case "End":
        t.preventDefault(), n = this.getLastEnabledTabIndex(s);
        break;
      case "Enter":
      case " ":
        t.preventDefault(), i.dataset.value && this.activateTab(e, i.dataset.value, !0);
        return;
    }
    if (n >= 0 && n < s.tabs.length) {
      const o = s.tabs[n];
      o.dataset.value && this.activateTab(e, o.dataset.value, !0);
    }
  }
  /**
   * Get next enabled tab index
   */
  getNextEnabledTabIndex(e, t) {
    for (let s = 1; s < e.tabs.length; s++) {
      const i = (t + s) % e.tabs.length;
      if (e.tabs[i].getAttribute("aria-disabled") !== "true")
        return i;
    }
    return t;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(e, t) {
    for (let s = 1; s < e.tabs.length; s++) {
      const i = (t - s + e.tabs.length) % e.tabs.length;
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
   * Dispatch custom tabs event
   */
  dispatchTabsEvent(e, t, s = null) {
    const i = new CustomEvent(t, {
      detail: {
        tabs: e,
        ...s
      },
      bubbles: !0
    });
    e.dispatchEvent(i);
  }
  /**
   * Get tabs state (for external access)
   */
  getTabsState(e) {
    return this.tabsStates.get(e) || null;
  }
  /**
   * Set active tab programmatically
   */
  setActiveTab(e, t, s = !1) {
    this.activateTab(e, t, s);
  }
  /**
   * Initialize marker position for the active tab
   */
  initializeMarker(e) {
    const t = this.tabsStates.get(e);
    if (!t || !t.activeTab) return;
    const s = t.tabs.find((i) => i.dataset.value === t.activeTab);
    s && setTimeout(() => {
      this.repositionMarker(e, s);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(e, t) {
    const s = this.tabsStates.get(e);
    if (!s) return;
    const i = e.querySelector('[data-tab-marker="true"]');
    if (!i) return;
    const { orientation: a, variant: n } = s;
    a === "vertical" ? this.repositionVerticalMarker(i, t, n) : this.repositionHorizontalMarker(i, t, n);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(e, t, s) {
    const i = t.offsetWidth, a = t.offsetLeft;
    if (e.style.width = `${i}px`, s === "pills") {
      const n = t.offsetHeight, o = t.offsetTop;
      e.style.height = `${n}px`, e.style.transform = `translate(${a}px, ${o}px)`;
    } else
      e.style.transform = `translateX(${a}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(e, t, s) {
    const i = t.offsetHeight, a = t.offsetTop;
    if (e.style.height = `${i}px`, s === "pills") {
      const n = t.offsetWidth, o = t.offsetLeft;
      e.style.width = `${n}px`, e.style.transform = `translate(${o}px, ${a}px)`;
    } else
      e.style.transform = `translateY(${a}px)`;
  }
  /**
   * Handle window resize - reposition all markers
   */
  handleResize() {
    clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(() => {
      this.tabsStates.forEach((e, t) => {
        if (e.activeTab) {
          const s = e.tabs.find((i) => i.dataset.value === e.activeTab);
          s && this.repositionMarker(t, s);
        }
      });
    }, 100);
  }
  /**
   * Destroy TabsActions and clean up
   */
  destroy() {
    this.tabsStates.clear(), this.initialized = !1, clearTimeout(this.resizeTimeout);
  }
};
y.instance = null;
let q = y;
q.getInstance();
const S = class S {
  constructor() {
    this.initialized = !1, this.modalStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return S.instance || (S.instance = new S()), S.instance;
  }
  /**
   * Initialize ModalActions for enhanced features
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initializeModals(), this.setupLivewireIntegration(), this.initialized = !0);
  }
  /**
   * Initialize all existing modal elements
   */
  initializeModals() {
    document.querySelectorAll("dialog[data-modal]").forEach((e) => {
      this.initializeModal(e);
    });
  }
  /**
   * Initialize a single modal element
   */
  initializeModal(e) {
    if (this.modalStates.has(e))
      return;
    const t = {
      lastFocusedElement: null,
      isAnimating: !1
    };
    this.modalStates.set(e, t), e.addEventListener("close", () => {
      this.handleModalClose(e);
    }), e.addEventListener("cancel", (s) => {
      this.handleModalCancel(e, s);
    });
  }
  /**
   * Bind event listeners for enhanced modal functionality
   */
  bindEventListeners() {
    document.addEventListener("click", (t) => {
      var a, n;
      const s = (a = t.target) == null ? void 0 : a.closest("[commandfor]");
      if (s) {
        const o = s.getAttribute("command"), r = s.getAttribute("commandfor");
        if (o === "show-modal" && r) {
          const l = document.getElementById(r);
          l && l.matches("dialog[data-modal]") && this.handleModalOpen(l, s);
        }
      }
      const i = (n = t.target) == null ? void 0 : n.closest("[data-modal-close]");
      if (i) {
        const o = i.closest("dialog[data-modal]");
        o && o.close();
      }
    }), new MutationObserver((t) => {
      t.forEach((s) => {
        s.addedNodes.forEach((i) => {
          i.nodeType === Node.ELEMENT_NODE && i.querySelectorAll("dialog[data-modal]").forEach((o) => {
            this.initializeModal(o);
          });
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
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
    const t = e.querySelector("[autofocus]");
    if (t) {
      t.focus();
      return;
    }
    const s = e.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    s.length > 0 && s[0].focus();
  }
  /**
   * Check if a modal is open
   */
  isModalOpen(e) {
    const t = document.getElementById(e);
    return t ? t.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(e, t, s = {}) {
    const i = new CustomEvent(t, {
      detail: {
        modal: e,
        ...s
      },
      bubbles: !0,
      cancelable: !0
    });
    e.dispatchEvent(i);
  }
  /**
   * Get modal state (for external access)
   */
  getModalState(e) {
    const t = document.getElementById(e);
    return t && this.modalStates.get(t) || null;
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
    var a;
    const s = document.getElementById(e);
    if (!s) return;
    const i = s.getAttribute("wire:model");
    if (i && typeof window.Livewire < "u" && window.Livewire.find) {
      const n = window.Livewire.find((a = s.closest("[wire\\:id]")) == null ? void 0 : a.getAttribute("wire:id"));
      n && n.set(i, t);
    }
  }
  /**
   * Toggle a modal's open state
   */
  toggleModal(e) {
    const t = document.getElementById(e);
    return !t || !t.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${e}" not found`), !1) : t.open ? this.closeModal(e) : this.openModal(e);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    document.querySelectorAll("dialog[data-modal][open]").forEach((e) => {
      e.id && this.closeModal(e.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(e, t) {
    const s = document.getElementById(e);
    return !s || !s.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${e}" not found`), !1) : (this.handleModalOpen(s, t), s.showModal(), this.dispatchLivewireEvent("modalOpened", { id: e, modal: e }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(e) {
    const t = document.getElementById(e);
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
    const t = this.modalStates.get(e);
    if (!t) return;
    e.getAttribute("wire:model") && this.updateWireModel(e.id, !1), t.lastFocusedElement && document.contains(t.lastFocusedElement) && t.lastFocusedElement.focus(), t.lastFocusedElement = null, t.isAnimating = !1, this.modalStates.set(e, t), this.dispatchModalEvent(e, "modal:close"), this.dispatchLivewireEvent("modalClosed", { id: e.id, modal: e.id });
  }
  /**
   * Handle modal opening with Livewire integration
   */
  handleModalOpen(e, t) {
    const s = this.modalStates.get(e);
    if (!s) return;
    e.getAttribute("wire:model") && this.updateWireModel(e.id, !0), s.lastFocusedElement = t || document.activeElement, this.modalStates.set(e, s), this.dispatchModalEvent(e, "modal:open", { trigger: t }), this.dispatchLivewireEvent("modalOpened", { id: e.id, modal: e.id }), setTimeout(() => {
      this.setInitialFocus(e);
    }, 50);
  }
  /**
   * Destroy ModalActions and clean up
   */
  destroy() {
    this.modalStates.clear(), this.initialized = !1;
  }
};
S.instance = null;
let V = S;
V.getInstance();
const E = class E {
  constructor() {
    this.toasts = /* @__PURE__ */ new Map(), this.containers = /* @__PURE__ */ new Map(), this.timers = /* @__PURE__ */ new Map(), this.pausedTimers = /* @__PURE__ */ new Map(), this.toastCounter = 0, this.initializeGlobalListeners();
  }
  static getInstance() {
    return E.instance || (E.instance = new E()), E.instance;
  }
  /**
   * Initialize ToastActions and set up global listeners
   */
  init() {
    this.initializeGlobalListeners();
  }
  /**
   * Initialize global event listeners for Livewire integration
   */
  initializeGlobalListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.discoverToasts(), this.setupLivewireListeners();
    });
  }
  /**
   * Discover and register toast containers
   */
  discoverToasts() {
    document.querySelectorAll("[data-toast-container]").forEach((t) => {
      if (t instanceof HTMLElement) {
        const s = t.getAttribute("data-toast-container");
        s && this.containers.set(s, t);
      }
    });
  }
  /**
   * Register a toast element for management
   */
  registerToast(e, t) {
    this.toasts.set(e, t), this.setupToastListeners(t);
  }
  /**
   * Set up individual toast event listeners
   */
  setupToastListeners(e) {
    const t = e.id;
    e.addEventListener("click", (s) => {
      const i = s.target, a = i.closest("[data-toast-dismiss]");
      if (a) {
        const o = a.getAttribute("data-toast-dismiss");
        o && (s.preventDefault(), s.stopPropagation(), this.dismiss(o));
        return;
      }
      const n = i.closest("[data-toast-action]");
      if (n) {
        const o = n.getAttribute("data-toast-action");
        o && (s.preventDefault(), s.stopPropagation(), this.dispatchToastEvent("toast:action", t, { action: o }));
      }
    }), e.addEventListener("mouseenter", () => {
      this.pauseTimer(t);
    }), e.addEventListener("mouseleave", () => {
      this.resumeTimer(t);
    });
  }
  /**
   * Set up Livewire event listeners if available
   */
  setupLivewireListeners() {
    typeof window.Livewire < "u" && (window.Livewire.on("showToast", (e) => {
      const t = e.variant || "info";
      this.show(t, e);
    }), window.Livewire.on("hideToast", (e) => {
      e.id ? this.dismiss(e.id) : this.dismissAll();
    }));
  }
  /**
   * Show a toast programmatically
   */
  show(e, t = {}) {
    const s = t.position || "top-right", i = this.containers.get(s);
    if (!i)
      return !1;
    const a = `toast-${e}-${s}-${++this.toastCounter}`, n = this.createToastElement(a, e, s, t);
    i.appendChild(n), requestAnimationFrame(() => {
      n.setAttribute("data-toast-visible", "true");
    });
    const o = t.duration || 5e3;
    return !(t.persistent === !0) && o > 0 && this.setTimer(a, o), this.toasts.set(a, n), this.setupToastListeners(n), this.dispatchToastEvent("toast:show", a, t), !0;
  }
  /**
   * Create a toast element dynamically
   */
  createToastElement(e, t, s, i) {
    const a = t === "error" ? "danger" : t, n = document.createElement("div");
    return n.className = "pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2", n.setAttribute("data-toast", "true"), n.setAttribute("data-toast-variant", t), n.setAttribute("data-toast-position", s), n.setAttribute("data-toast-visible", "false"), n.setAttribute("role", "alert"), n.setAttribute("aria-live", "polite"), n.id = e, n.innerHTML = `
            <div class="rounded-lg border p-4 space-y-3 ${this.getVariantClasses(a)}" role="alert" data-dismissible="true">
                <div class="flex">
                    <div class="flex-shrink-0 mt-1">
                        <svg class="w-5 h-5 ${this.getIconColor(a)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${this.getIconPath(a)}
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
                        <button type="button" class="inline-flex items-center justify-center rounded-md bg-transparent p-1.5 text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${this.getIconColor(a)}" data-toast-dismiss="${e}" aria-label="Dismiss">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="sr-only">Dismiss</span>
                        </button>
                    </div>
                </div>
            </div>
        `, this.updateToastContent(n, i), n;
  }
  /**
   * Get variant classes for alert styling
   */
  getVariantClasses(e) {
    const t = {
      info: "bg-info-100 border-info-200 text-info-foreground",
      success: "bg-success-100 border-success-200 text-success-foreground",
      warning: "bg-warning-100 border-warning-200 text-warning-foreground",
      danger: "bg-danger-100 border-danger-200 text-danger-foreground",
      neutral: "bg-neutral-100 border-neutral-200 text-neutral-foreground"
    };
    return t[e] || t.info;
  }
  /**
   * Get icon color for variant
   */
  getIconColor(e) {
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
    const t = this.toasts.get(e);
    return t ? (this.clearTimer(e), this.pausedTimers.delete(e), t.setAttribute("data-toast-visible", "false"), t.setAttribute("data-toast-exiting", "true"), setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t), this.toasts.delete(e);
    }, 300), this.dispatchToastEvent("toast:dismiss", e), !0) : !1;
  }
  /**
   * Dismiss all visible toasts
   */
  dismissAll() {
    this.toasts.forEach((e, t) => {
      e.getAttribute("data-toast-visible") === "true" && this.dismiss(t);
    });
  }
  /**
   * Helper methods for convenience
   */
  success(e, t = {}) {
    return this.show("success", { message: e, ...t });
  }
  error(e, t = {}) {
    return this.show("error", { message: e, ...t });
  }
  warning(e, t = {}) {
    return this.show("warning", { message: e, ...t });
  }
  info(e, t = {}) {
    return this.show("info", { message: e, ...t });
  }
  /**
   * Update toast content
   */
  updateToastContent(e, t) {
    const s = e.querySelector("[data-toast-title]"), i = e.querySelector("[data-toast-message]"), a = e.querySelector("[data-toast-actions]");
    s && t.title ? (s.textContent = t.title, s.classList.remove("hidden")) : s && s.classList.add("hidden"), i && t.message && (i.textContent = t.message), a && t.actions ? (a.innerHTML = t.actions, a.classList.remove("hidden")) : a && a.classList.add("hidden"), e.setAttribute("data-toast-duration", String(t.duration || 5e3)), e.setAttribute("data-toast-persistent", String(t.persistent === !0));
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(e) {
    const t = e.querySelector("[data-toast-title]"), s = e.querySelector("[data-toast-message]"), i = e.querySelector("[data-toast-actions]");
    t && (t.textContent = "", t.classList.add("hidden")), s && (s.textContent = ""), i && (i.innerHTML = "", i.classList.add("hidden")), e.removeAttribute("data-toast-duration"), e.removeAttribute("data-toast-persistent");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(e, t) {
    this.clearTimer(e);
    const s = this.toasts.get(e);
    s && s.setAttribute("data-toast-start-time", String(Date.now()));
    const i = window.setTimeout(() => {
      this.dismiss(e);
    }, t);
    this.timers.set(e, i);
  }
  /**
   * Clear timer
   */
  clearTimer(e) {
    const t = this.timers.get(e);
    t && (clearTimeout(t), this.timers.delete(e));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(e) {
    const t = this.timers.get(e), s = this.toasts.get(e);
    if (t && s) {
      const i = parseInt(s.getAttribute("data-toast-duration") || "5000"), a = parseInt(s.getAttribute("data-toast-start-time") || "0"), n = Date.now() - a, o = Math.max(0, i - n);
      this.pausedTimers.set(e, {
        remaining: o,
        startTime: Date.now()
      }), this.clearTimer(e);
    }
  }
  /**
   * Resume timer (on mouse leave)
   */
  resumeTimer(e) {
    const t = this.toasts.get(e), s = this.pausedTimers.get(e);
    if (t && !(t.getAttribute("data-toast-persistent") === "true"))
      if (s && s.remaining > 0)
        this.setTimer(e, s.remaining), this.pausedTimers.delete(e);
      else {
        const a = parseInt(t.getAttribute("data-toast-duration") || "5000");
        a > 0 && this.setTimer(e, a);
      }
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(e, t, s = {}) {
    const i = new CustomEvent(e, {
      detail: { id: t, toast: t, ...s }
    });
    document.dispatchEvent(i);
    const a = this.toasts.get(t);
    if (a && a.dispatchEvent(i), typeof window.Livewire < "u") {
      const n = e.replace("toast:", "toast");
      window.Livewire.dispatch(n, { id: t, toast: t, ...s });
    }
  }
  /**
   * Get toast state (for external access)
   */
  getToastState(e) {
    const t = this.toasts.get(e);
    return t ? {
      id: e,
      visible: t.getAttribute("data-toast-visible") === "true",
      variant: t.getAttribute("data-toast-variant"),
      position: t.getAttribute("data-toast-position"),
      duration: parseInt(t.getAttribute("data-toast-duration") || "0"),
      persistent: t.getAttribute("data-toast-persistent") === "true"
    } : null;
  }
  /**
   * Destroy ToastActions and clean up
   */
  destroy() {
    this.timers.forEach((e) => clearTimeout(e)), this.timers.clear(), this.pausedTimers.clear(), this.toasts.forEach((e) => {
      this.resetToastContent(e), e.style.display = "none", e.setAttribute("data-toast-visible", "false");
    }), this.toasts.clear(), this.containers.clear();
  }
};
E.instance = null;
let C = E;
const P = C.getInstance();
typeof window < "u" && (P.discoverToasts(), window.ToastActions = C);
const A = class A {
  constructor() {
    this.initialized = !1, this.dropdownStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return A.instance || (A.instance = new A()), A.instance;
  }
  /**
   * Initialize DropdownActions for all dropdown elements
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initializeDropdowns(), this.initialized = !0);
  }
  /**
   * Initialize all existing dropdown elements
   */
  initializeDropdowns() {
    document.querySelectorAll('[data-dropdown="true"]').forEach((e) => {
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
    }, s = e.closest('[data-submenu="true"]');
    s && s !== e && (t.parent = s), this.dropdownStates.set(e, t), this.updateMenuItems(e), this.initializeSubmenus(e);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(e) {
    const t = e.querySelectorAll('[data-submenu="true"]'), s = this.dropdownStates.get(e);
    s && (s.children = Array.from(t), this.dropdownStates.set(e, s)), t.forEach((i) => {
      this.dropdownStates.has(i) || this.initializeDropdown(i);
    });
  }
  /**
   * Bind global event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (t) => {
      const s = t.target && t.target.closest && t.target.closest("[data-submenu-trigger]");
      if (s) {
        t.preventDefault(), t.stopPropagation();
        const r = s.closest('[data-submenu="true"]');
        r && !this.isDisabled(r) && this.toggleSubmenu(r);
        return;
      }
      const i = t.target && t.target.closest && t.target.closest("[data-dropdown-trigger]");
      if (i) {
        t.preventDefault(), t.stopPropagation();
        const r = i.closest('[data-dropdown="true"]');
        r && !this.isDisabled(r) && this.toggleDropdown(r);
        return;
      }
      const a = t.target && t.target.closest && t.target.closest("[data-menu-item]");
      if (a) {
        const r = a.closest('[data-dropdown="true"]');
        r && (a.dataset.keepOpen === "true" || this.closeDropdown(r));
        return;
      }
      const n = t.target && t.target.closest && t.target.closest("[data-menu-checkbox], [data-menu-radio]");
      if (n) {
        if (t.stopPropagation(), !(n.dataset.keepOpen !== "false")) {
          const l = n.closest('[data-dropdown="true"]');
          l && this.closeDropdown(l);
        }
        return;
      }
      if (t.target && t.target.closest && t.target.closest("[data-dropdown-panel], [data-submenu-panel]")) {
        t.stopPropagation();
        return;
      }
      this.closeAllDropdowns();
    }), document.addEventListener("mouseenter", (t) => {
      const s = t.target && t.target.closest && t.target.closest("[data-submenu-trigger]");
      if (s && !this.isMobile()) {
        const i = s.closest('[data-submenu="true"]');
        i && !this.isDisabled(i) && (this.closeSiblingSubmenus(i), setTimeout(() => {
          s.matches(":hover") && this.openSubmenu(i);
        }, 100));
      }
    }, !0), document.addEventListener("mouseleave", (t) => {
      const s = t.target && t.target.closest && t.target.closest('[data-submenu="true"]');
      if (s && !this.isMobile()) {
        const i = this.dropdownStates.get(s);
        i != null && i.isOpen && setTimeout(() => {
          s.matches(":hover") || this.closeSubmenu(s);
        }, 150);
      }
    }, !0), document.addEventListener("keydown", (t) => {
      const s = t.target && t.target.closest && t.target.closest('[data-dropdown="true"]');
      s && this.handleKeydown(s, t);
    }), window.addEventListener("resize", () => {
      this.repositionDropdowns();
    }), new MutationObserver((t) => {
      t.forEach((s) => {
        s.addedNodes.forEach((i) => {
          i.nodeType === Node.ELEMENT_NODE && i.querySelectorAll('[data-dropdown="true"]').forEach((o) => {
            this.dropdownStates.has(o) || this.initializeDropdown(o);
          });
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  /**
   * Toggle dropdown open/closed state
   */
  toggleDropdown(e) {
    const t = this.dropdownStates.get(e);
    t && (t.isOpen ? this.closeDropdown(e) : this.openDropdown(e));
  }
  /**
   * Open dropdown
   */
  openDropdown(e) {
    const t = this.dropdownStates.get(e);
    if (!t || this.isDisabled(e)) return;
    this.closeSiblingDropdowns(e), t.isOpen = !0, t.focusedIndex = -1, this.dropdownStates.set(e, t);
    const s = e.querySelector("[data-dropdown-panel]"), i = e.querySelector("[data-dropdown-trigger]");
    s && (s.classList.remove("hidden"), this.positionDropdown(e)), i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(e), this.dispatchDropdownEvent(e, "dropdown:open");
  }
  /**
   * Open submenu
   */
  openSubmenu(e) {
    const t = this.dropdownStates.get(e);
    if (!t || this.isDisabled(e)) return;
    t.isOpen = !0, t.focusedIndex = -1, this.dropdownStates.set(e, t);
    const s = e.querySelector("[data-submenu-panel]"), i = e.querySelector("[data-submenu-trigger]");
    s && (s.classList.remove("hidden"), this.positionSubmenu(e)), i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(e), this.dispatchDropdownEvent(e, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(e) {
    const t = this.dropdownStates.get(e);
    if (!t || !t.isOpen) return;
    this.closeChildSubmenus(e), t.isOpen = !1, t.focusedIndex = -1, this.dropdownStates.set(e, t);
    const s = e.querySelector("[data-dropdown-panel]"), i = e.querySelector("[data-dropdown-trigger]");
    s && s.classList.add("hidden"), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(e, "dropdown:close");
  }
  /**
   * Close submenu
   */
  closeSubmenu(e) {
    const t = this.dropdownStates.get(e);
    if (!t || !t.isOpen) return;
    this.closeChildSubmenus(e), t.isOpen = !1, t.focusedIndex = -1, this.dropdownStates.set(e, t);
    const s = e.querySelector("[data-submenu-panel]"), i = e.querySelector("[data-submenu-trigger]");
    s && s.classList.add("hidden"), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(e, "submenu:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.dropdownStates.forEach((e, t) => {
      e.isOpen && (e.parent || this.closeDropdown(t));
    });
  }
  /**
   * Close sibling dropdowns but preserve parent-child relationships
   */
  closeSiblingDropdowns(e) {
    const t = this.dropdownStates.get(e);
    this.dropdownStates.forEach((s, i) => {
      if (i !== e && s.isOpen) {
        const a = (t == null ? void 0 : t.parent) === i, n = s.parent === e;
        !a && !n && this.closeDropdown(i);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(e) {
    const t = this.dropdownStates.get(e), s = t == null ? void 0 : t.parent;
    if (s) {
      const i = this.dropdownStates.get(s);
      i == null || i.children.forEach((a) => {
        a !== e && this.closeSubmenu(a);
      });
    }
  }
  /**
   * Close all child submenus
   */
  closeChildSubmenus(e) {
    const t = this.dropdownStates.get(e);
    t == null || t.children.forEach((s) => {
      this.closeSubmenu(s);
    });
  }
  /**
   * Toggle submenu open/closed state
   */
  toggleSubmenu(e) {
    const t = this.dropdownStates.get(e);
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
    const s = this.dropdownStates.get(e);
    if (s)
      switch (t.key) {
        case "Enter":
        case " ":
          if (!s.isOpen)
            t.preventDefault(), this.openDropdown(e);
          else if (s.focusedIndex >= 0) {
            t.preventDefault();
            const i = s.menuItems[s.focusedIndex];
            i && i.click();
          }
          break;
        case "Escape":
          if (s.isOpen) {
            t.preventDefault(), this.closeDropdown(e);
            const i = e.querySelector("[data-dropdown-trigger]");
            i && i.focus();
          }
          break;
        case "ArrowDown":
          s.isOpen ? (t.preventDefault(), this.navigateItems(e, 1)) : (t.preventDefault(), this.openDropdown(e));
          break;
        case "ArrowUp":
          s.isOpen && (t.preventDefault(), this.navigateItems(e, -1));
          break;
        case "Tab":
          s.isOpen && this.closeDropdown(e);
          break;
      }
  }
  /**
   * Navigate through menu items with arrow keys
   */
  navigateItems(e, t) {
    const s = this.dropdownStates.get(e);
    if (!s || !s.isOpen) return;
    const i = s.menuItems.length;
    i !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = t > 0 ? 0 : i - 1 : (s.focusedIndex += t, s.focusedIndex >= i ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = i - 1)), this.dropdownStates.set(e, s), this.updateItemFocus(e));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(e) {
    const t = this.dropdownStates.get(e);
    t && t.menuItems.forEach((s, i) => {
      i === t.focusedIndex ? (s.classList.add("bg-neutral-100", "dark:bg-neutral-800"), s.scrollIntoView({ block: "nearest" })) : s.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(e) {
    const t = this.dropdownStates.get(e);
    if (!t) return;
    const s = e.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]");
    t.menuItems = Array.from(s).filter((i) => {
      const a = i;
      return !a.hasAttribute("disabled") && a.offsetParent !== null;
    }), this.dropdownStates.set(e, t);
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(e) {
    const t = e.querySelector("[data-dropdown-panel]"), s = e.querySelector("[data-dropdown-trigger]");
    if (!t || !s) return;
    const i = s.getBoundingClientRect(), a = t.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, r = e.dataset.position || "bottom", l = e.dataset.align || "start", c = parseInt(e.dataset.offset || "8");
    t.style.top = "", t.style.bottom = "", t.style.left = "", t.style.right = "";
    const d = n - i.bottom, u = i.top;
    o - i.left, i.right;
    let h = r, f = l;
    switch (r === "bottom" && d < a.height && u > a.height ? h = "top" : r === "top" && u < a.height && d > a.height && (h = "bottom"), h) {
      case "top":
        t.style.bottom = "100%", t.style.marginBottom = `${c}px`;
        break;
      case "bottom":
        t.style.top = "100%", t.style.marginTop = `${c}px`;
        break;
      case "left":
        t.style.right = "100%", t.style.marginRight = `${c}px`;
        break;
      case "right":
        t.style.left = "100%", t.style.marginLeft = `${c}px`;
        break;
    }
    if (h === "top" || h === "bottom")
      switch (f) {
        case "start":
          t.style.left = "0";
          break;
        case "center":
          t.style.left = "50%", t.style.transform = "translateX(-50%)";
          break;
        case "end":
          t.style.right = "0";
          break;
      }
    else
      switch (f) {
        case "start":
          t.style.top = "0";
          break;
        case "center":
          t.style.top = "50%", t.style.transform = "translateY(-50%)";
          break;
        case "end":
          t.style.bottom = "0";
          break;
      }
  }
  /**
   * Position submenu relative to trigger
   */
  positionSubmenu(e) {
    const t = e.querySelector("[data-submenu-panel]"), s = e.querySelector("[data-submenu-trigger]");
    if (!t || !s) return;
    const i = s.getBoundingClientRect(), a = t.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, r = e.dataset.position || "right", l = e.dataset.align || "start", c = parseInt(e.dataset.offset || "4");
    t.style.top = "", t.style.bottom = "", t.style.left = "", t.style.right = "", t.style.transform = "";
    const d = o - i.right, u = i.left;
    n - i.bottom, i.top;
    let h = r;
    switch (r === "right" && d < a.width && u > a.width ? h = "left" : r === "left" && u < a.width && d > a.width && (h = "right"), h) {
      case "right":
        t.style.left = "100%", t.style.marginLeft = `${c}px`;
        break;
      case "left":
        t.style.right = "100%", t.style.marginRight = `${c}px`;
        break;
    }
    switch (l) {
      case "start":
        t.style.top = "0";
        break;
      case "center":
        t.style.top = "50%", t.style.transform = "translateY(-50%)";
        break;
      case "end":
        t.style.bottom = "0";
        break;
    }
    const f = t.getBoundingClientRect();
    if (f.bottom > n) {
      const k = f.bottom - n + 8;
      t.style.transform = `translateY(-${k}px)`;
    } else if (f.top < 0) {
      const k = Math.abs(f.top) + 8;
      t.style.transform = `translateY(${k}px)`;
    }
  }
  /**
   * Reposition all open dropdowns and submenus
   */
  repositionDropdowns() {
    this.dropdownStates.forEach((e, t) => {
      e.isOpen && (t.hasAttribute("data-submenu") ? this.positionSubmenu(t) : this.positionDropdown(t));
    });
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
  dispatchDropdownEvent(e, t, s = null) {
    const i = new CustomEvent(t, {
      detail: {
        dropdown: e,
        ...s
      },
      bubbles: !0
    });
    e.dispatchEvent(i);
  }
  /**
   * Destroy DropdownActions and clean up
   */
  destroy() {
    this.dropdownStates.clear(), this.initialized = !1;
  }
};
A.instance = null;
let B = A;
B.getInstance();
const L = class L {
  constructor() {
    this.initialized = !1, this.tableStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return L.instance || (L.instance = new L()), L.instance;
  }
  /**
   * Initialize TableActions for all table elements
   */
  init() {
    this.initialized || (this.initTables(), this.bindEvents(), this.initialized = !0);
  }
  /**
   * Initialize all tables on the page
   */
  initTables() {
    document.querySelectorAll('[data-table="true"]').forEach((t) => {
      this.initTable(t);
    });
  }
  /**
   * Initialize a single table
   */
  initTable(e) {
    var i;
    const t = {
      selectedRows: /* @__PURE__ */ new Set(),
      sortColumn: null,
      sortDirection: null,
      selectAllState: "none"
    };
    this.tableStates.set(e, t);
    const s = e.querySelector('[data-sorted="true"]');
    if (s) {
      const a = s.getAttribute("data-sort-key") || ((i = s.textContent) == null ? void 0 : i.trim()) || "", n = s.getAttribute("data-direction");
      t.sortColumn = a, t.sortDirection = n;
    }
    this.updateSelectionState(e);
  }
  /**
   * Bind event listeners
   */
  bindEvents() {
    document.addEventListener("click", (e) => {
      const s = e.target.closest('[data-sortable="true"]');
      s && (e.preventDefault(), this.handleSort(s));
    }), document.addEventListener("change", (e) => {
      const t = e.target;
      t.matches("[data-table-row-select]") && this.handleRowSelection(t), t.matches("[data-table-select-all]") && this.handleSelectAll(t);
    }), document.addEventListener("keydown", (e) => {
      e.target && e.target.closest('[data-table="true"]') && this.handleKeyboard(e);
    }), document.addEventListener("livewire:navigated", () => {
      this.reinit();
    });
  }
  /**
   * Handle sortable header clicks
   */
  handleSort(e) {
    var n;
    const t = e.closest('[data-table="true"]');
    if (!t) return;
    const s = this.tableStates.get(t);
    if (!s) return;
    const i = e.getAttribute("data-sort-key") || ((n = e.textContent) == null ? void 0 : n.trim()) || "";
    let a = "asc";
    s.sortColumn === i && (s.sortDirection === "asc" ? a = "desc" : s.sortDirection === "desc" && (a = null)), s.sortColumn = a ? i : null, s.sortDirection = a, this.updateSortUI(t, i, a), this.dispatchSortEvent(t, {
      column: i,
      direction: a || "asc",
      url: e.getAttribute("data-sort-url") || void 0,
      livewireMethod: e.getAttribute("data-sort-method") || void 0
    });
  }
  /**
   * Update sort UI indicators
   */
  updateSortUI(e, t, s) {
    if (e.querySelectorAll('[data-sortable="true"]').forEach((a) => {
      a.setAttribute("data-sorted", "false"), a.removeAttribute("data-direction"), a.querySelectorAll(".table-sort-icon").forEach((o) => {
        o.setAttribute("data-icon", "heroicon-o-chevron-up-down"), o.classList.remove("opacity-100"), o.classList.add("opacity-0", "group-hover:opacity-100");
      });
    }), s) {
      const a = e.querySelector(`[data-sort-key="${t}"]`);
      if (a) {
        a.setAttribute("data-sorted", "true"), a.setAttribute("data-direction", s);
        const n = a.querySelector(".table-sort-icon");
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
  handleRowSelection(e) {
    const t = e.closest('[data-table="true"]');
    if (!t) return;
    const s = this.tableStates.get(t);
    if (!s) return;
    const i = e.getAttribute("data-row-id");
    i && (e.checked ? s.selectedRows.add(i) : s.selectedRows.delete(i), this.updateSelectionState(t), this.dispatchSelectionEvent(t, Array.from(s.selectedRows)));
  }
  /**
   * Handle select all checkbox
   */
  handleSelectAll(e) {
    const t = e.closest('[data-table="true"]');
    if (!t) return;
    const s = this.tableStates.get(t);
    if (!s) return;
    const i = t.querySelectorAll("[data-table-row-select]");
    e.checked ? i.forEach((a) => {
      a.checked = !0;
      const n = a.getAttribute("data-row-id");
      n && s.selectedRows.add(n);
    }) : i.forEach((a) => {
      a.checked = !1;
      const n = a.getAttribute("data-row-id");
      n && s.selectedRows.delete(n);
    }), this.updateSelectionState(t), this.dispatchSelectionEvent(t, Array.from(s.selectedRows));
  }
  /**
   * Update selection state and UI
   */
  updateSelectionState(e) {
    const t = this.tableStates.get(e);
    if (!t) return;
    const s = e.querySelectorAll("[data-table-row-select]"), i = e.querySelector("[data-table-select-all]"), a = s.length, n = t.selectedRows.size;
    n === 0 ? (t.selectAllState = "none", i && (i.checked = !1, i.indeterminate = !1)) : n === a ? (t.selectAllState = "all", i && (i.checked = !0, i.indeterminate = !1)) : (t.selectAllState = "some", i && (i.checked = !1, i.indeterminate = !0)), e.querySelectorAll("[data-table-row]").forEach((r) => {
      const l = r.getAttribute("data-row-id");
      l && t.selectedRows.has(l) ? (r.setAttribute("data-selected", "true"), r.classList.add("table-row-selected")) : (r.setAttribute("data-selected", "false"), r.classList.remove("table-row-selected"));
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
    const s = new CustomEvent("table:sort", {
      detail: t,
      bubbles: !0
    });
    if (e.dispatchEvent(s), t.livewireMethod && window.Livewire) {
      const i = window.Livewire.find(e.getAttribute("wire:id"));
      i && i.call(t.livewireMethod, t.column, t.direction);
    }
  }
  /**
   * Dispatch selection event
   */
  dispatchSelectionEvent(e, t) {
    const s = new CustomEvent("table:selection", {
      detail: { selectedIds: t },
      bubbles: !0
    });
    e.dispatchEvent(s);
    const i = e.getAttribute("data-selection-method");
    if (i && window.Livewire) {
      const a = window.Livewire.find(e.getAttribute("wire:id"));
      a && a.call(i, t);
    }
  }
  /**
   * Reinitialize after page changes
   */
  reinit() {
    this.tableStates.clear(), this.initTables();
  }
  /**
   * Get selected rows for a table
   */
  getSelectedRows(e) {
    const t = this.tableStates.get(e);
    return t ? Array.from(t.selectedRows) : [];
  }
  /**
   * Clear selection for a table
   */
  clearSelection(e) {
    const t = this.tableStates.get(e);
    t && (t.selectedRows.clear(), this.updateSelectionState(e), this.dispatchSelectionEvent(e, []));
  }
};
L.instance = null;
let I = L;
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  I.getInstance().init();
}) : I.getInstance().init();
window.TableActions = I;
const x = class x {
  constructor() {
    this.initialized = !1;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return x.instance || (x.instance = new x()), x.instance;
  }
  /**
   * Initialize ButtonGroupActions for all button group elements
   */
  init() {
    this.initialized || (this.processButtonGroups(), this.bindEventListeners(), this.initialized = !0);
  }
  /**
   * Process all existing button groups on the page
   */
  processButtonGroups() {
    document.querySelectorAll('[data-button-group="true"][data-attached="true"]').forEach((t) => this.processButtonGroup(t));
  }
  /**
   * Bind event listeners using event delegation
   */
  bindEventListeners() {
    new MutationObserver((t) => {
      t.forEach((s) => {
        s.addedNodes.forEach((i) => {
          if (i.nodeType === Node.ELEMENT_NODE) {
            const a = i;
            a.matches && a.matches('[data-button-group="true"][data-attached="true"]') && this.processButtonGroup(a);
            const n = a.querySelectorAll && a.querySelectorAll('[data-button-group="true"][data-attached="true"]');
            n && n.forEach((o) => this.processButtonGroup(o));
          }
        });
      });
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  /**
   * Process a single button group element
   */
  processButtonGroup(e) {
    const t = e.getAttribute("data-orientation") || "horizontal", s = Array.from(e.children).filter(
      (i) => i.tagName === "BUTTON" || i.tagName === "A"
    );
    s.length <= 1 || s.forEach((i, a) => {
      const n = a === 0, o = a === s.length - 1, r = !n && !o;
      this.clearBorderRadiusClasses(i), t === "horizontal" ? n ? i.classList.add("rounded-r-none") : o ? i.classList.add("rounded-l-none") : r && i.classList.add("rounded-none") : t === "vertical" && (n ? i.classList.add("rounded-b-none") : o ? i.classList.add("rounded-t-none") : r && i.classList.add("rounded-none"));
    });
  }
  /**
   * Clear existing border radius classes from a button
   */
  clearBorderRadiusClasses(e) {
    [
      "rounded-none",
      "rounded-r-none",
      "rounded-l-none",
      "rounded-t-none",
      "rounded-b-none"
    ].forEach((s) => {
      e.classList.remove(s);
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
  processGroup(e) {
    e.matches('[data-button-group="true"][data-attached="true"]') && this.processButtonGroup(e);
  }
  /**
   * Destroy ButtonGroupActions and clean up
   */
  destroy() {
    this.initialized = !1;
  }
};
x.instance = null;
let $ = x;
$.getInstance();
const T = class T {
  constructor() {
    this.initialized = !1, this.tooltipStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return T.instance || (T.instance = new T()), T.instance;
  }
  /**
   * Initialize TooltipActions for all tooltip elements
   */
  init() {
    this.initialized || (this.initializeTooltips(), this.bindGlobalEvents(), this.setupLivewireIntegration(), this.initialized = !0);
  }
  /**
   * Initialize all tooltips on the page
   */
  initializeTooltips() {
    document.querySelectorAll("[data-tooltip-target]").forEach((e) => {
      const t = e.getAttribute("data-tooltip-target");
      if (t) {
        const s = document.getElementById(t);
        s && this.initializeTooltip(e, s);
      }
    }), document.querySelectorAll('[data-tooltip="true"]').forEach((e) => {
      const t = e.getAttribute("data-target");
      if (t) {
        const s = document.querySelector(t);
        s && this.initializeTooltip(s, e);
      }
    });
  }
  /**
   * Initialize a single tooltip
   */
  initializeTooltip(e, t) {
    if (this.tooltipStates.has(t))
      return;
    const s = e.getAttribute("data-tooltip-trigger") || t.getAttribute("data-trigger") || "hover", i = parseInt(e.getAttribute("data-tooltip-delay") || t.getAttribute("data-delay") || "100"), a = {
      isVisible: !1,
      trigger: e,
      tooltip: t,
      triggerType: s,
      delay: i
    };
    this.tooltipStates.set(t, a), this.bindTooltipEvents(e, t, a), this.hideTooltip(t);
  }
  /**
   * Bind events for a specific tooltip
   */
  bindTooltipEvents(e, t, s) {
    switch (s.triggerType) {
      case "hover":
        e.addEventListener("mouseenter", () => this.scheduleShow(t)), e.addEventListener("mouseleave", () => this.scheduleHide(t)), t.addEventListener("mouseenter", () => this.cancelHide(t)), t.addEventListener("mouseleave", () => this.scheduleHide(t));
        break;
      case "click":
        e.addEventListener("click", (i) => {
          i.preventDefault(), this.toggleTooltip(t);
        });
        break;
      case "focus":
        e.addEventListener("focus", () => this.scheduleShow(t)), e.addEventListener("blur", () => this.scheduleHide(t));
        break;
    }
    e.addEventListener("keydown", (i) => {
      i.key === "Escape" && s.isVisible && this.hideTooltip(t);
    });
  }
  /**
   * Bind global events
   */
  bindGlobalEvents() {
    document.addEventListener("click", (t) => {
      const s = t.target;
      this.tooltipStates.forEach((i, a) => {
        var n;
        i.triggerType === "click" && i.isVisible && !((n = i.trigger) != null && n.contains(s)) && !a.contains(s) && this.hideTooltip(a);
      });
    }), document.addEventListener("scroll", () => {
      this.tooltipStates.forEach((t, s) => {
        t.isVisible && this.hideTooltip(s);
      });
    }, { passive: !0 }), window.addEventListener("resize", () => {
      this.tooltipStates.forEach((t, s) => {
        t.isVisible && this.positionTooltip(t.trigger, s);
      });
    }), new MutationObserver((t) => {
      t.forEach((s) => {
        s.addedNodes.forEach((i) => {
          i.nodeType === Node.ELEMENT_NODE && i.querySelectorAll('[data-tooltip="true"], [data-tooltip-target]').forEach((n) => {
            if (n.hasAttribute("data-tooltip-target")) {
              const o = n.getAttribute("data-tooltip-target");
              if (o) {
                const r = document.getElementById(o);
                r && this.initializeTooltip(n, r);
              }
            }
          });
        });
      });
    }).observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * Schedule tooltip to show with delay
   */
  scheduleShow(e) {
    const t = this.tooltipStates.get(e);
    !t || e.getAttribute("data-disabled") === "true" || (this.cancelHide(e), t.showTimeout = window.setTimeout(() => {
      this.showTooltip(e);
    }, t.delay));
  }
  /**
   * Schedule tooltip to hide with delay
   */
  scheduleHide(e) {
    const t = this.tooltipStates.get(e);
    t && (this.cancelShow(e), t.hideTimeout = window.setTimeout(() => {
      this.hideTooltip(e);
    }, 100));
  }
  /**
   * Cancel scheduled show
   */
  cancelShow(e) {
    const t = this.tooltipStates.get(e);
    t != null && t.showTimeout && (clearTimeout(t.showTimeout), delete t.showTimeout);
  }
  /**
   * Cancel scheduled hide
   */
  cancelHide(e) {
    const t = this.tooltipStates.get(e);
    t != null && t.hideTimeout && (clearTimeout(t.hideTimeout), delete t.hideTimeout);
  }
  /**
   * Show tooltip
   */
  showTooltip(e) {
    const t = this.tooltipStates.get(e);
    !t || t.isVisible || (t.trigger && this.positionTooltip(t.trigger, e), e.setAttribute("data-show", "true"), t.isVisible = !0, this.dispatchTooltipEvent(e, "tooltip:show", { trigger: t.trigger }));
  }
  /**
   * Hide tooltip
   */
  hideTooltip(e) {
    const t = this.tooltipStates.get(e);
    !t || !t.isVisible || (e.setAttribute("data-show", "false"), t.isVisible = !1, this.dispatchTooltipEvent(e, "tooltip:hide", { trigger: t.trigger }));
  }
  /**
   * Toggle tooltip visibility
   */
  toggleTooltip(e) {
    const t = this.tooltipStates.get(e);
    t && (t.isVisible ? this.hideTooltip(e) : this.showTooltip(e));
  }
  /**
   * Position tooltip relative to trigger
   */
  positionTooltip(e, t) {
    const s = e.getBoundingClientRect(), i = t.style.visibility, a = t.style.opacity;
    t.style.visibility = "hidden", t.style.opacity = "1", t.style.position = "fixed", t.style.top = "-9999px", t.style.left = "-9999px";
    const n = t.getBoundingClientRect(), o = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    t.style.visibility = i, t.style.opacity = a;
    const r = t.getAttribute("data-placement") || "top", l = this.calculateOptimalPosition(s, n, o, r);
    t.style.position = "fixed", t.style.top = `${l.top}px`, t.style.left = `${l.left}px`, t.setAttribute("data-placement", l.placement);
  }
  /**
   * Calculate optimal tooltip position with collision detection
   */
  calculateOptimalPosition(e, t, s, i) {
    const n = {
      top: {
        top: e.top - t.height - 8,
        left: e.left + (e.width - t.width) / 2,
        placement: "top"
      },
      bottom: {
        top: e.bottom + 8,
        left: e.left + (e.width - t.width) / 2,
        placement: "bottom"
      },
      left: {
        top: e.top + (e.height - t.height) / 2,
        left: e.left - t.width - 8,
        placement: "left"
      },
      right: {
        top: e.top + (e.height - t.height) / 2,
        left: e.right + 8,
        placement: "right"
      }
    }, o = n[i];
    if (this.positionFitsInViewport(o, t, s))
      return o;
    const r = Object.values(n).filter((l) => l.placement !== i);
    for (const l of r)
      if (this.positionFitsInViewport(l, t, s))
        return l;
    return {
      top: Math.max(8, Math.min(o.top, s.height - t.height - 8)),
      left: Math.max(8, Math.min(o.left, s.width - t.width - 8)),
      placement: o.placement
    };
  }
  /**
   * Check if position fits in viewport
   */
  positionFitsInViewport(e, t, s) {
    return e.top >= 0 && e.left >= 0 && e.top + t.height <= s.height && e.left + t.width <= s.width;
  }
  /**
   * Dispatch tooltip events
   */
  dispatchTooltipEvent(e, t, s = {}) {
    const i = new CustomEvent(t, {
      detail: { tooltip: e, ...s },
      bubbles: !0,
      cancelable: !0
    });
    e.dispatchEvent(i);
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
  show(e) {
    const t = document.getElementById(e);
    return t && this.tooltipStates.has(t) ? (this.showTooltip(t), !0) : !1;
  }
  /**
   * Public API: Hide tooltip programmatically
   */
  hide(e) {
    const t = document.getElementById(e);
    return t && this.tooltipStates.has(t) ? (this.hideTooltip(t), !0) : !1;
  }
  /**
   * Public API: Toggle tooltip programmatically
   */
  toggle(e) {
    const t = document.getElementById(e);
    return t && this.tooltipStates.has(t) ? (this.toggleTooltip(t), !0) : !1;
  }
  /**
   * Public API: Destroy tooltip instance
   */
  destroy(e) {
    const t = document.getElementById(e);
    return t && this.tooltipStates.has(t) ? (this.hideTooltip(t), this.tooltipStates.delete(t), !0) : !1;
  }
};
T.instance = null;
let g = T;
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
  g.getInstance().init();
}) : g.getInstance().init();
window.TooltipActions = g;
g.getInstance();
function R() {
  D.getInstance().init(), M.getInstance().init(), O.getInstance().init(), z.getInstance().init(), q.getInstance().init(), V.getInstance().init(), C.getInstance().init(), B.getInstance().init(), I.getInstance().init(), $.getInstance().init(), g.getInstance().init();
}
const G = {
  FormActions: D.getInstance(),
  AlertActions: M.getInstance(),
  RadioActions: O.getInstance(),
  SelectActions: z.getInstance(),
  TabsActions: q.getInstance(),
  ModalActions: V.getInstance(),
  ToastActions: C.getInstance(),
  DropdownActions: B.getInstance(),
  TableActions: I.getInstance(),
  ButtonGroupActions: $.getInstance(),
  TooltipActions: g.getInstance(),
  init: R
};
export {
  M as AlertActions,
  $ as ButtonGroupActions,
  B as DropdownActions,
  D as FormActions,
  V as ModalActions,
  O as RadioActions,
  z as SelectActions,
  I as TableActions,
  q as TabsActions,
  C as ToastActions,
  g as TooltipActions,
  G as default,
  R as initializeKeysUI
};
