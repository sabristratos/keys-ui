function z(q, t = "") {
  const e = window.KeysUITranslations;
  if (!e)
    return t;
  const s = q.split(".");
  let i = e;
  for (const a of s)
    if (i = i == null ? void 0 : i[a], i === void 0)
      return t;
  return i || t;
}
const g = class g {
  constructor() {
    this.initialized = !1;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return g.instance || (g.instance = new g()), g.instance;
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
    document.addEventListener("click", (t) => {
      var s;
      const e = (s = t.target) == null ? void 0 : s.closest(".input-action");
      e && (t.preventDefault(), this.handleActionClick(e));
    }), document.addEventListener("keydown", (t) => {
      if (t.key === "Enter" || t.key === " ") {
        const e = t.target;
        e != null && e.classList.contains("input-action") && (t.preventDefault(), this.handleActionClick(e));
      }
    });
  }
  /**
   * Handle action button click
   */
  async handleActionClick(t) {
    const e = t.closest(".input-action"), s = e == null ? void 0 : e.dataset.action;
    if (!s) return;
    const i = this.findFormElementForAction(t);
    if (i) {
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
          this.openExternalUrl(t.dataset.url);
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
  findFormElementForAction(t) {
    const e = t.closest(".relative");
    return (e == null ? void 0 : e.querySelector("input, textarea")) || null;
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
    const s = t.querySelector(".button-icon-default"), i = t.querySelector(".button-icon-toggle"), a = t.querySelector(".button-icon-success"), n = t.dataset.iconDefault, o = t.dataset.iconToggle, r = t.dataset.iconSuccess;
    s && (s.classList.remove("opacity-100"), s.classList.add("opacity-0")), i && (i.classList.remove("opacity-100", "scale-110", "scale-90"), i.classList.add("opacity-0")), a && (a.classList.remove("opacity-100", "scale-110", "scale-90"), a.classList.add("opacity-0")), e === n && s ? (s.classList.remove("opacity-0"), s.classList.add("opacity-100")) : e === o && i ? (i.classList.remove("opacity-0"), i.classList.add("opacity-100")) : e === r && a && (a.classList.remove("opacity-0"), a.classList.add("opacity-100", "scale-110"));
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
    const s = e.querySelector("button");
    try {
      await navigator.clipboard.writeText(t.value), this.showFeedback(t, z("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && await this.showCopySuccess(s, e);
    } catch {
      this.fallbackCopyToClipboard(t, e);
    }
  }
  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(t, e) {
    const s = e.querySelector("button");
    t.select(), t instanceof HTMLInputElement && t.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy"), this.showFeedback(t, z("feedback.copied_clipboard", "Copied to clipboard"), "success"), s && this.showCopySuccess(s, e);
    } catch {
      this.showFeedback(t, "Copy failed", "error");
    }
  }
  /**
   * Show copy success visual feedback
   */
  async showCopySuccess(t, e) {
    const s = t.dataset.iconSuccess, i = t.dataset.labelSuccess, a = t.dataset.iconDefault, n = t.querySelector(".sr-only");
    if (s && a)
      if (await this.swapButtonIcon(t, s), i && n) {
        const o = n.textContent;
        n.textContent = i, setTimeout(async () => {
          await this.swapButtonIcon(t, a), o && n && (n.textContent = o);
        }, 2e3);
      } else
        setTimeout(async () => {
          await this.swapButtonIcon(t, a);
        }, 2e3);
  }
  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(t, e, s) {
    var d;
    const i = t.type === "password", a = i ? "text" : "password", n = e.dataset.iconDefault, o = e.dataset.iconToggle, r = (d = e.querySelector(".sr-only")) == null ? void 0 : d.textContent, l = e.dataset.labelToggle;
    t.type = a;
    const c = e.querySelector(".sr-only");
    i ? (o && await this.swapButtonIcon(e, o), l && c && (c.textContent = l), e.setAttribute("aria-label", l || "Hide password")) : (n && await this.swapButtonIcon(e, n), r && c && (c.textContent = r), e.setAttribute("aria-label", r || "Show password"));
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
    const s = new CustomEvent("form-action", {
      detail: {
        element: t,
        action: e,
        value: t.value
      },
      bubbles: !0
    });
    t.dispatchEvent(s);
  }
  /**
   * Show temporary feedback message
   */
  showFeedback(t, e, s = "success") {
    const i = document.createElement("div");
    i.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${s === "success" ? "bg-success text-foreground-success" : "bg-danger text-foreground-danger"}`, i.textContent = e;
    const a = t.closest(".relative");
    a && (a.appendChild(i), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 2e3));
  }
  /**
   * Add a custom action handler
   */
  addActionHandler(t, e) {
    document.addEventListener("form-action", (s) => {
      const i = s;
      i.detail.action === t && e(i.detail.element);
    });
  }
  /**
   * Destroy FormActions and clean up
   */
  destroy() {
    this.initialized = !1;
  }
};
g.instance = null;
let A = g;
A.getInstance();
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
    document.addEventListener("click", (t) => {
      var s;
      const e = (s = t.target) == null ? void 0 : s.closest("[data-dismiss-alert]");
      e && (t.preventDefault(), this.handleDismissClick(e));
    }), document.addEventListener("keydown", (t) => {
      if (t.key === "Enter" || t.key === " ") {
        const e = t.target;
        e != null && e.hasAttribute("data-dismiss-alert") && (t.preventDefault(), this.handleDismissClick(e));
      }
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
    return t.closest('[data-dismissible="true"]') || null;
  }
  /**
   * Dismiss an alert with smooth animation
   */
  dismissAlert(t) {
    t.classList.add("alert-dismissing"), t.style.transition = "all 0.3s ease-out", t.style.opacity = "0", t.style.transform = "translateX(100%)", t.style.maxHeight = "0", t.style.padding = "0", t.style.margin = "0", t.style.overflow = "hidden", setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t);
    }, 300);
  }
  /**
   * Show an alert programmatically
   */
  showAlert(t) {
    t.style.display = "block", t.style.opacity = "1", t.style.transform = "translateX(0)", this.dispatchAlertEvent(t, "show");
  }
  /**
   * Create and show a new alert dynamically
   */
  createAlert(t) {
    const {
      variant: e = "info",
      title: s,
      message: i,
      dismissible: a = !0,
      duration: n,
      container: o = document.body
    } = t, r = document.createElement("div");
    r.className = this.getAlertClasses(e), r.setAttribute("role", "alert"), a && r.setAttribute("data-dismissible", "true");
    const l = this.buildAlertContent(e, s, i, a);
    return r.innerHTML = l, o.appendChild(r), r.style.opacity = "0", r.style.transform = "translateX(100%)", setTimeout(() => {
      this.showAlert(r);
    }, 10), n && n > 0 && setTimeout(() => {
      this.dismissAlert(r);
    }, n), this.dispatchAlertEvent(r, "create"), r;
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
  buildAlertContent(t, e, s, i) {
    const a = this.getVariantIcon(t), n = this.getVariantIconColor(t);
    return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${n}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(a)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${e ? `<div class="text-base font-medium">${e}</div>` : ""}
                    <div class="text-sm opacity-90 ${e ? "mt-1" : ""}">${s || ""}</div>
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
    const s = new CustomEvent("alert-action", {
      detail: {
        alert: t,
        action: e
      },
      bubbles: !0
    });
    t.dispatchEvent(s), document.dispatchEvent(s);
  }
  /**
   * Add a custom alert action handler
   */
  addActionHandler(t, e) {
    document.addEventListener("alert-action", (s) => {
      const i = s;
      i.detail.action === t && e(i.detail.alert);
    });
  }
  /**
   * Dismiss all alerts of a specific variant
   */
  dismissAllByVariant(t) {
    document.querySelectorAll(`[data-dismissible="true"][class*="${t}"]`).forEach((s) => {
      this.dismissAlert(s);
    });
  }
  /**
   * Dismiss all dismissible alerts
   */
  dismissAll() {
    document.querySelectorAll('[data-dismissible="true"]').forEach((e) => {
      this.dismissAlert(e);
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
let k = m;
k.getInstance();
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
   * Initialize RadioActions for all radio elements
   */
  init() {
    this.initialized || (this.bindEventListeners(), this.initialized = !0);
  }
  /**
   * Bind event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (t) => {
      const s = t.target.closest("label[for]");
      if (!s) return;
      const i = s.getAttribute("for");
      if (!i) return;
      const a = document.getElementById(i);
      !a || a.type !== "radio" || this.focusRadioInput(a);
    }), document.addEventListener("keydown", (t) => {
      const e = t.target;
      !e || e.type !== "radio" || (t.key === "ArrowDown" || t.key === "ArrowRight" ? (t.preventDefault(), this.focusNextRadio(e)) : (t.key === "ArrowUp" || t.key === "ArrowLeft") && (t.preventDefault(), this.focusPreviousRadio(e)));
    });
  }
  /**
   * Focus a radio input with proper timing
   */
  focusRadioInput(t) {
    setTimeout(() => {
      t.focus(), this.dispatchFocusEvent(t);
    }, 0);
  }
  /**
   * Focus the next radio in the same group
   */
  focusNextRadio(t) {
    const e = this.getRadioGroup(t), i = (e.indexOf(t) + 1) % e.length, a = e[i];
    a && (a.focus(), a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(a));
  }
  /**
   * Focus the previous radio in the same group
   */
  focusPreviousRadio(t) {
    const e = this.getRadioGroup(t), s = e.indexOf(t), i = s === 0 ? e.length - 1 : s - 1, a = e[i];
    a && (a.focus(), a.checked = !0, a.dispatchEvent(new Event("change", { bubbles: !0 })), this.dispatchFocusEvent(a));
  }
  /**
   * Get all radio inputs in the same group
   */
  getRadioGroup(t) {
    const e = t.name;
    return e ? Array.from(document.querySelectorAll(`input[type="radio"][name="${e}"]`)).filter((i) => !i.disabled) : [t];
  }
  /**
   * Dispatch custom event for radio focus
   */
  dispatchFocusEvent(t) {
    const e = new CustomEvent("radio-focus", {
      detail: {
        radio: t,
        name: t.name,
        value: t.value,
        checked: t.checked
      },
      bubbles: !0
    });
    t.dispatchEvent(e);
  }
  /**
   * Add a custom radio focus handler
   */
  addFocusHandler(t) {
    document.addEventListener("radio-focus", (e) => {
      t(e.detail.radio);
    });
  }
  /**
   * Destroy RadioActions and clean up
   */
  destroy() {
    this.initialized = !1;
  }
};
b.instance = null;
let I = b;
I.getInstance();
const w = class w {
  constructor() {
    this.initialized = !1, this.selectStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return w.instance || (w.instance = new w()), w.instance;
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
    document.querySelectorAll('[data-select="true"]').forEach((t) => {
      this.initializeSelect(t);
    });
  }
  /**
   * Initialize a single select element
   */
  initializeSelect(t) {
    const e = t.dataset.multiple === "true", s = t.dataset.value;
    let i = [];
    if (s)
      try {
        i = e ? JSON.parse(s) : [s];
      } catch {
        i = e ? [] : [s];
      }
    const a = {
      isOpen: !1,
      selectedValues: i,
      searchTerm: "",
      focusedIndex: -1,
      filteredOptions: []
    };
    this.selectStates.set(t, a), this.updateOptions(t), this.updateOptionsSelectedState(t), this.updateDisplay(t);
  }
  /**
   * Bind global event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      var l, c, d, u, h, f, x;
      const s = (l = e.target) == null ? void 0 : l.closest("[data-remove-chip]");
      if (s) {
        e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
        const p = s.dataset.removeChip, O = s.closest('[data-select="true"]');
        O && p && this.removeChip(O, p);
        return;
      }
      const i = (c = e.target) == null ? void 0 : c.closest("[data-select-clear]");
      if (i) {
        e.preventDefault(), e.stopPropagation();
        const p = i.closest('[data-select="true"]');
        p && this.clearSelection(p);
        return;
      }
      const a = (d = e.target) == null ? void 0 : d.closest("[data-select-option]");
      if (a) {
        e.preventDefault(), e.stopPropagation();
        const p = a.closest('[data-select="true"]');
        p && this.selectOption(p, a);
        return;
      }
      const n = (u = e.target) == null ? void 0 : u.closest("[data-select-trigger]");
      if (n) {
        e.preventDefault(), e.stopPropagation();
        const p = n.closest('[data-select="true"]');
        p && !this.isDisabled(p) && this.toggleDropdown(p);
        return;
      }
      if ((h = e.target) == null ? void 0 : h.closest("[data-select-search]")) {
        e.stopPropagation();
        return;
      }
      const r = (x = (f = e.target) == null ? void 0 : f.closest("[data-select-search]")) == null ? void 0 : x.parentElement;
      if (r && r.querySelector("[data-select-search]")) {
        e.stopPropagation();
        return;
      }
      this.closeAllDropdowns();
    }), document.addEventListener("input", (e) => {
      const s = e.target;
      if (s != null && s.matches("[data-select-search]")) {
        const i = s.closest('[data-select="true"]');
        i && this.handleSearch(i, s.value);
      }
    }), document.addEventListener("keydown", (e) => {
      var i;
      const s = (i = e.target) == null ? void 0 : i.closest('[data-select="true"]');
      s && this.handleKeydown(s, e);
    }), document.addEventListener("focusin", (e) => {
      var i;
      const s = (i = e.target) == null ? void 0 : i.closest('[data-select="true"]');
      s && this.isOpen(s);
    }), window.addEventListener("resize", () => {
      this.repositionDropdowns();
    }), new MutationObserver((e) => {
      e.forEach((s) => {
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
  toggleDropdown(t) {
    const e = this.selectStates.get(t);
    e && (e.isOpen ? this.closeDropdown(t) : this.openDropdown(t));
  }
  /**
   * Open dropdown
   */
  openDropdown(t) {
    const e = this.selectStates.get(t);
    if (!e || this.isDisabled(t)) return;
    this.closeAllDropdowns(), e.isOpen = !0, this.selectStates.set(t, e);
    const s = t.querySelector("[data-select-dropdown]"), i = t.querySelector("[data-select-trigger]"), a = t.querySelector("[data-select-search]");
    if (s && (s.classList.remove("hidden"), this.positionDropdown(t)), i) {
      i.setAttribute("aria-expanded", "true");
      const n = i.querySelector(".select-arrow");
      n && n.classList.add("rotate-180");
    }
    a && t.dataset.searchable === "true" && setTimeout(() => a.focus(), 10), this.updateFilteredOptions(t), this.dispatchSelectEvent(t, "select:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.selectStates.get(t);
    if (!e || !e.isOpen) return;
    e.isOpen = !1, e.searchTerm = "", e.focusedIndex = -1, this.selectStates.set(t, e);
    const s = t.querySelector("[data-select-dropdown]"), i = t.querySelector("[data-select-trigger]"), a = t.querySelector("[data-select-search]");
    if (s && s.classList.add("hidden"), i) {
      i.setAttribute("aria-expanded", "false");
      const n = i.querySelector(".select-arrow");
      n && n.classList.remove("rotate-180");
    }
    a && (a.value = ""), this.handleSearch(t, ""), this.dispatchSelectEvent(t, "select:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.selectStates.forEach((t, e) => {
      t.isOpen && this.closeDropdown(e);
    });
  }
  /**
   * Handle option selection
   */
  selectOption(t, e) {
    const s = this.selectStates.get(t), i = e.dataset.value;
    if (!s || !i || e.getAttribute("aria-disabled") === "true")
      return;
    const a = t.dataset.multiple === "true";
    if (a) {
      const n = s.selectedValues.indexOf(i);
      n > -1 ? s.selectedValues.splice(n, 1) : s.selectedValues.push(i);
    } else
      s.selectedValues = [i], this.closeDropdown(t);
    this.selectStates.set(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: a ? s.selectedValues : i,
      selectedValues: s.selectedValues
    });
  }
  /**
   * Remove chip (for multiple selection)
   */
  removeChip(t, e) {
    const s = this.selectStates.get(t);
    if (!s) return;
    const i = s.selectedValues.indexOf(e);
    i > -1 && (s.selectedValues.splice(i, 1), this.selectStates.set(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: s.selectedValues,
      selectedValues: s.selectedValues
    }));
  }
  /**
   * Clear all selections
   */
  clearSelection(t) {
    const e = this.selectStates.get(t);
    e && (e.selectedValues = [], this.selectStates.set(t, e), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
      value: t.dataset.multiple === "true" ? [] : "",
      selectedValues: []
    }));
  }
  /**
   * Handle search functionality
   */
  handleSearch(t, e) {
    const s = this.selectStates.get(t);
    s && (s.searchTerm = e.toLowerCase(), this.selectStates.set(t, s), this.updateFilteredOptions(t), this.updateOptionsVisibility(t));
  }
  /**
   * Update filtered options based on search term
   */
  updateFilteredOptions(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    const s = this.getAllOptions(t);
    e.searchTerm ? e.filteredOptions = s.filter(
      (i) => i.searchableText.includes(e.searchTerm)
    ) : e.filteredOptions = s, this.selectStates.set(t, e);
  }
  /**
   * Update options visibility based on filter
   */
  updateOptionsVisibility(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    const s = t.querySelectorAll("[data-select-option]"), i = t.querySelector("[data-select-no-results]");
    let a = 0;
    s.forEach((n) => {
      const o = n, r = o.dataset.value || "";
      e.filteredOptions.some((c) => c.value === r) ? (o.style.display = "", a++) : o.style.display = "none";
    }), i && (a === 0 && e.searchTerm ? i.classList.remove("hidden") : i.classList.add("hidden"));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.selectStates.get(t);
    if (s)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!s.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (s.focusedIndex >= 0) {
            e.preventDefault();
            const i = s.filteredOptions[s.focusedIndex];
            i && this.selectOption(t, i.element);
          }
          break;
        case "Escape":
          if (s.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const i = t.querySelector("[data-select-trigger]");
            i && i.focus();
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
    const s = this.selectStates.get(t);
    if (!s || !s.isOpen) return;
    const i = s.filteredOptions.length;
    i !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = e > 0 ? 0 : i - 1 : (s.focusedIndex += e, s.focusedIndex >= i ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = i - 1)), this.selectStates.set(t, s), this.updateOptionFocus(t));
  }
  /**
   * Update visual focus state of options
   */
  updateOptionFocus(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    t.querySelectorAll("[data-select-option]").forEach((i, a) => {
      const n = i;
      a === e.focusedIndex ? (n.classList.add("bg-neutral-100", "dark:bg-neutral-800"), n.scrollIntoView({ block: "nearest" })) : n.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update display of selected values
   */
  updateDisplay(t) {
    if (!this.selectStates.get(t)) return;
    t.dataset.multiple === "true" ? this.updateChipsDisplay(t) : this.updateSingleValueDisplay(t);
  }
  /**
   * Update chips display for multiple selection using Badge components
   */
  updateChipsDisplay(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    const s = t.querySelector("[data-select-chips]");
    if (s)
      if (s.innerHTML = "", e.selectedValues.length === 0) {
        const i = t.dataset.placeholder || "Select options...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${i}</span>`;
      } else
        e.selectedValues.forEach((i) => {
          const a = this.findOptionByValue(t, i), n = a ? a.displayLabel : i, o = t.dataset.clearable === "true" && !this.isDisabled(t), r = `select-chip-${this.generateChipId(i)}`, l = document.createElement("button");
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
  updateSingleValueDisplay(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    const s = t.querySelector(".select-value");
    if (s)
      if (e.selectedValues.length === 0) {
        const i = t.dataset.placeholder || "Select option...";
        s.innerHTML = `<span class="text-neutral-500 select-placeholder">${i}</span>`;
      } else {
        const i = e.selectedValues[0], a = this.findOptionByValue(t, i), n = a ? a.displayLabel : i;
        s.textContent = n;
      }
  }
  /**
   * Update hidden form inputs
   */
  updateHiddenInputs(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    const s = t.dataset.multiple === "true", i = t.dataset.name;
    if (!i) return;
    if (t.querySelectorAll(".select-hidden-input").forEach((n) => n.remove()), s)
      e.selectedValues.forEach((n) => {
        const o = document.createElement("input");
        o.type = "hidden", o.name = `${i}[]`, o.value = n, o.className = "select-hidden-input", t.appendChild(o);
      });
    else {
      const n = document.createElement("input");
      n.type = "hidden", n.name = i, n.value = e.selectedValues[0] || "", n.className = "select-hidden-input", t.appendChild(n);
    }
  }
  /**
   * Update options selected state attributes
   */
  updateOptionsSelectedState(t) {
    const e = this.selectStates.get(t);
    if (!e) return;
    t.querySelectorAll("[data-select-option]").forEach((i) => {
      var r, l, c, d;
      const a = i, n = a.dataset.value || "", o = e.selectedValues.includes(n);
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
  updateOptions(t) {
    const e = this.getAllOptions(t), s = this.selectStates.get(t);
    s && (s.filteredOptions = e, this.selectStates.set(t, s));
  }
  /**
   * Get all options from select element
   */
  getAllOptions(t) {
    const e = t.querySelectorAll("[data-select-option]");
    return Array.from(e).map((s) => {
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
  findOptionByValue(t, e) {
    return this.getAllOptions(t).find((i) => i.value === e) || null;
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = t.querySelector("[data-select-dropdown]"), s = t.querySelector("[data-select-trigger]");
    if (!e || !s) return;
    const i = s.getBoundingClientRect(), a = e.getBoundingClientRect(), o = window.innerHeight - i.bottom, r = i.top, l = a.height || 240;
    o < l && r > l ? (e.style.bottom = "100%", e.style.top = "auto", e.style.marginBottom = "4px", e.style.marginTop = "0") : (e.style.top = "100%", e.style.bottom = "auto", e.style.marginTop = "4px", e.style.marginBottom = "0");
  }
  /**
   * Reposition all open dropdowns
   */
  repositionDropdowns() {
    this.selectStates.forEach((t, e) => {
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
    const e = this.selectStates.get(t);
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
    const i = new CustomEvent(e, {
      detail: {
        select: t,
        ...s
      },
      bubbles: !0
    });
    t.dispatchEvent(i);
  }
  /**
   * Get select state (for external access)
   */
  getSelectState(t) {
    return this.selectStates.get(t) || null;
  }
  /**
   * Set selected values programmatically
   */
  setSelectedValues(t, e) {
    const s = this.selectStates.get(t);
    if (!s) return;
    const i = t.dataset.multiple === "true";
    s.selectedValues = i ? e : e.slice(0, 1), this.selectStates.set(t, s), this.updateDisplay(t), this.updateHiddenInputs(t), this.updateOptionsSelectedState(t), this.dispatchSelectEvent(t, "select:change", {
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
w.instance = null;
let T = w;
T.getInstance();
const v = class v {
  constructor() {
    this.initialized = !1, this.tabsStates = /* @__PURE__ */ new Map(), this.resizeTimeout = 0;
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return v.instance || (v.instance = new v()), v.instance;
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
    document.querySelectorAll('[data-tabs="true"]').forEach((t) => {
      this.initializeTabsElement(t);
    });
  }
  /**
   * Initialize a single tabs element
   */
  initializeTabsElement(t) {
    const e = t.dataset.orientation || "horizontal", s = t.dataset.variant || "default", i = t.dataset.disabled === "true", a = t.dataset.value, n = Array.from(t.querySelectorAll('[data-tabs-trigger="true"]')), o = Array.from(t.querySelectorAll('[data-tabs-panel="true"]'));
    let r = a;
    if (!r && n.length > 0) {
      const c = n.find((d) => d.getAttribute("aria-disabled") !== "true");
      r = (c == null ? void 0 : c.dataset.value) || null;
    }
    const l = {
      activeTab: r,
      tabs: n,
      panels: o,
      orientation: e,
      variant: s,
      disabled: i
    };
    this.tabsStates.set(t, l), this.updateTabsState(t), this.initializeMarker(t), t.classList.add("tabs-initialized");
  }
  /**
   * Bind global event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      var i;
      const s = (i = e.target) == null ? void 0 : i.closest('[data-tabs-trigger="true"]');
      if (s) {
        e.preventDefault();
        const a = s.closest('[data-tabs="true"]');
        a && s.getAttribute("aria-disabled") !== "true" && this.activateTab(a, s.dataset.value || "");
      }
    }), document.addEventListener("keydown", (e) => {
      var i;
      const s = (i = e.target) == null ? void 0 : i.closest('[data-tabs-trigger="true"]');
      if (s) {
        const a = s.closest('[data-tabs="true"]');
        a && this.handleKeydown(a, e);
      }
    }), window.addEventListener("resize", () => {
      this.handleResize();
    }), new MutationObserver((e) => {
      e.forEach((s) => {
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
  activateTab(t, e, s = !1) {
    const i = this.tabsStates.get(t);
    if (!i || i.disabled) return;
    const a = i.tabs.find((o) => o.dataset.value === e);
    if (!a || a.getAttribute("aria-disabled") === "true")
      return;
    const n = i.activeTab;
    i.activeTab = e, this.tabsStates.set(t, i), this.updateTabsState(t), this.repositionMarker(t, a), s && a.focus(), this.dispatchTabsEvent(t, "tabs:change", {
      activeTab: e,
      previousTab: n
    });
  }
  /**
   * Update tabs visual state and panel visibility
   */
  updateTabsState(t) {
    const e = this.tabsStates.get(t);
    e && (e.tabs.forEach((s) => {
      const i = s.dataset.value === e.activeTab, a = s.getAttribute("aria-disabled") === "true";
      s.setAttribute("aria-selected", i ? "true" : "false"), s.setAttribute("data-state", i ? "active" : "inactive"), a ? s.setAttribute("tabindex", "-1") : i ? s.setAttribute("tabindex", "0") : s.setAttribute("tabindex", "-1"), s.id = `tab-${s.dataset.value}`;
    }), e.panels.forEach((s) => {
      const i = s.dataset.value === e.activeTab;
      s.setAttribute("data-state", i ? "active" : "inactive"), s.style.display = i ? "block" : "none", s.setAttribute("aria-labelledby", `tab-${s.dataset.value}`);
    }));
  }
  /**
   * Handle keyboard navigation
   */
  handleKeydown(t, e) {
    const s = this.tabsStates.get(t);
    if (!s || s.disabled) return;
    const i = e.target, a = s.tabs.indexOf(i);
    let n = -1;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault(), n = s.orientation === "horizontal" ? this.getPreviousEnabledTabIndex(s, a) : e.key === "ArrowUp" ? this.getPreviousEnabledTabIndex(s, a) : a;
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault(), n = s.orientation === "horizontal" ? this.getNextEnabledTabIndex(s, a) : e.key === "ArrowDown" ? this.getNextEnabledTabIndex(s, a) : a;
        break;
      case "Home":
        e.preventDefault(), n = this.getFirstEnabledTabIndex(s);
        break;
      case "End":
        e.preventDefault(), n = this.getLastEnabledTabIndex(s);
        break;
      case "Enter":
      case " ":
        e.preventDefault(), i.dataset.value && this.activateTab(t, i.dataset.value, !0);
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
      const i = (e + s) % t.tabs.length;
      if (t.tabs[i].getAttribute("aria-disabled") !== "true")
        return i;
    }
    return e;
  }
  /**
   * Get previous enabled tab index
   */
  getPreviousEnabledTabIndex(t, e) {
    for (let s = 1; s < t.tabs.length; s++) {
      const i = (e - s + t.tabs.length) % t.tabs.length;
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
   * Dispatch custom tabs event
   */
  dispatchTabsEvent(t, e, s = null) {
    const i = new CustomEvent(e, {
      detail: {
        tabs: t,
        ...s
      },
      bubbles: !0
    });
    t.dispatchEvent(i);
  }
  /**
   * Get tabs state (for external access)
   */
  getTabsState(t) {
    return this.tabsStates.get(t) || null;
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
    const e = this.tabsStates.get(t);
    if (!e || !e.activeTab) return;
    const s = e.tabs.find((i) => i.dataset.value === e.activeTab);
    s && setTimeout(() => {
      this.repositionMarker(t, s);
    }, 10);
  }
  /**
   * Reposition marker to match the given tab
   */
  repositionMarker(t, e) {
    const s = this.tabsStates.get(t);
    if (!s) return;
    const i = t.querySelector('[data-tab-marker="true"]');
    if (!i) return;
    const { orientation: a, variant: n } = s;
    a === "vertical" ? this.repositionVerticalMarker(i, e, n) : this.repositionHorizontalMarker(i, e, n);
  }
  /**
   * Reposition marker for horizontal orientation
   */
  repositionHorizontalMarker(t, e, s) {
    const i = e.offsetWidth, a = e.offsetLeft;
    if (t.style.width = `${i}px`, s === "pills") {
      const n = e.offsetHeight, o = e.offsetTop;
      t.style.height = `${n}px`, t.style.transform = `translate(${a}px, ${o}px)`;
    } else
      t.style.transform = `translateX(${a}px)`;
  }
  /**
   * Reposition marker for vertical orientation
   */
  repositionVerticalMarker(t, e, s) {
    const i = e.offsetHeight, a = e.offsetTop;
    if (t.style.height = `${i}px`, s === "pills") {
      const n = e.offsetWidth, o = e.offsetLeft;
      t.style.width = `${n}px`, t.style.transform = `translate(${o}px, ${a}px)`;
    } else
      t.style.transform = `translateY(${a}px)`;
  }
  /**
   * Handle window resize - reposition all markers
   */
  handleResize() {
    clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(() => {
      this.tabsStates.forEach((t, e) => {
        if (t.activeTab) {
          const s = t.tabs.find((i) => i.dataset.value === t.activeTab);
          s && this.repositionMarker(e, s);
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
v.instance = null;
let D = v;
D.getInstance();
const y = class y {
  constructor() {
    this.initialized = !1, this.modalStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return y.instance || (y.instance = new y()), y.instance;
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
    document.querySelectorAll("dialog[data-modal]").forEach((t) => {
      this.initializeModal(t);
    });
  }
  /**
   * Initialize a single modal element
   */
  initializeModal(t) {
    if (this.modalStates.has(t))
      return;
    const e = {
      lastFocusedElement: null,
      isAnimating: !1
    };
    this.modalStates.set(t, e), t.addEventListener("close", () => {
      this.handleModalClose(t);
    }), t.addEventListener("cancel", (s) => {
      this.handleModalCancel(t, s);
    });
  }
  /**
   * Bind event listeners for enhanced modal functionality
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      var a, n;
      const s = (a = e.target) == null ? void 0 : a.closest("[commandfor]");
      if (s) {
        const o = s.getAttribute("command"), r = s.getAttribute("commandfor");
        if (o === "show-modal" && r) {
          const l = document.getElementById(r);
          l && l.matches("dialog[data-modal]") && this.handleModalOpen(l, s);
        }
      }
      const i = (n = e.target) == null ? void 0 : n.closest("[data-modal-close]");
      if (i) {
        const o = i.closest("dialog[data-modal]");
        o && o.close();
      }
    }), new MutationObserver((e) => {
      e.forEach((s) => {
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
   * Handle modal opening for enhanced features
   */
  handleModalOpen(t, e) {
    const s = this.modalStates.get(t);
    s && (s.lastFocusedElement = e || document.activeElement, this.modalStates.set(t, s), this.dispatchModalEvent(t, "modal:open", { trigger: e }), setTimeout(() => {
      this.setInitialFocus(t);
    }, 50));
  }
  /**
   * Handle modal close event
   */
  handleModalClose(t) {
    const e = this.modalStates.get(t);
    e && (e.lastFocusedElement && document.contains(e.lastFocusedElement) && e.lastFocusedElement.focus(), e.lastFocusedElement = null, e.isAnimating = !1, this.modalStates.set(t, e), this.dispatchModalEvent(t, "modal:close"));
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
    const e = t.querySelector("[autofocus]");
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
    const e = document.getElementById(t);
    return e ? e.open : !1;
  }
  /**
   * Dispatch custom modal events
   */
  dispatchModalEvent(t, e, s = {}) {
    const i = new CustomEvent(e, {
      detail: {
        modal: t,
        ...s
      },
      bubbles: !0,
      cancelable: !0
    });
    t.dispatchEvent(i);
  }
  /**
   * Get modal state (for external access)
   */
  getModalState(t) {
    const e = document.getElementById(t);
    return e && this.modalStates.get(e) || null;
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
    var a;
    const s = document.getElementById(t);
    if (!s) return;
    const i = s.getAttribute("wire:model");
    if (i && typeof window.Livewire < "u" && window.Livewire.find) {
      const n = window.Livewire.find((a = s.closest("[wire\\:id]")) == null ? void 0 : a.getAttribute("wire:id"));
      n && n.set(i, e);
    }
  }
  /**
   * Toggle a modal's open state
   */
  toggleModal(t) {
    const e = document.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : e.open ? this.closeModal(t) : this.openModal(t);
  }
  /**
   * Close all open modals
   */
  closeAllModals() {
    document.querySelectorAll("dialog[data-modal][open]").forEach((t) => {
      t.id && this.closeModal(t.id);
    });
  }
  /**
   * Enhanced modal open with Livewire event dispatching
   */
  openModal(t, e) {
    const s = document.getElementById(t);
    return !s || !s.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (this.handleModalOpen(s, e), s.showModal(), this.dispatchLivewireEvent("modalOpened", { id: t, modal: t }), !0);
  }
  /**
   * Enhanced modal close with Livewire event dispatching
   */
  closeModal(t) {
    const e = document.getElementById(t);
    return !e || !e.matches("dialog[data-modal]") ? (console.warn(`Modal with id "${t}" not found`), !1) : (e.close(), this.dispatchLivewireEvent("modalClosed", { id: t, modal: t }), !0);
  }
  /**
   * Dispatch Livewire events
   */
  dispatchLivewireEvent(t, e) {
    typeof window.Livewire < "u" && window.Livewire.dispatch && window.Livewire.dispatch(t, e);
  }
  /**
   * Enhanced modal close handler with Livewire integration
   */
  handleModalClose(t) {
    const e = this.modalStates.get(t);
    if (!e) return;
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !1), e.lastFocusedElement && document.contains(e.lastFocusedElement) && e.lastFocusedElement.focus(), e.lastFocusedElement = null, e.isAnimating = !1, this.modalStates.set(t, e), this.dispatchModalEvent(t, "modal:close"), this.dispatchLivewireEvent("modalClosed", { id: t.id, modal: t.id });
  }
  /**
   * Enhanced modal open handler with Livewire integration
   */
  handleModalOpen(t, e) {
    const s = this.modalStates.get(t);
    if (!s) return;
    t.getAttribute("wire:model") && this.updateWireModel(t.id, !0), s.lastFocusedElement = e || document.activeElement, this.modalStates.set(t, s), this.dispatchModalEvent(t, "modal:open", { trigger: e }), this.dispatchLivewireEvent("modalOpened", { id: t.id, modal: t.id }), setTimeout(() => {
      this.setInitialFocus(t);
    }, 50);
  }
  /**
   * Destroy ModalActions and clean up
   */
  destroy() {
    this.modalStates.clear(), this.initialized = !1;
  }
};
y.instance = null;
let C = y;
C.getInstance();
const S = class S {
  constructor() {
    this.toasts = /* @__PURE__ */ new Map(), this.containers = /* @__PURE__ */ new Map(), this.timers = /* @__PURE__ */ new Map(), this.pausedTimers = /* @__PURE__ */ new Map(), this.toastCounter = 0, this.initializeGlobalListeners();
  }
  static getInstance() {
    return S.instance || (S.instance = new S()), S.instance;
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
    document.querySelectorAll("[data-toast-container]").forEach((e) => {
      if (e instanceof HTMLElement) {
        const s = e.getAttribute("data-toast-container");
        s && this.containers.set(s, e);
      }
    });
  }
  /**
   * Register a toast element for management
   */
  registerToast(t, e) {
    this.toasts.set(t, e), this.setupToastListeners(e);
  }
  /**
   * Set up individual toast event listeners
   */
  setupToastListeners(t) {
    const e = t.id;
    t.addEventListener("click", (s) => {
      const i = s.target, a = i.closest("[data-toast-dismiss]");
      if (a) {
        const o = a.getAttribute("data-toast-dismiss");
        o && (s.preventDefault(), s.stopPropagation(), this.dismiss(o));
        return;
      }
      const n = i.closest("[data-toast-action]");
      if (n) {
        const o = n.getAttribute("data-toast-action");
        o && (s.preventDefault(), s.stopPropagation(), this.dispatchToastEvent("toast:action", e, { action: o }));
      }
    }), t.addEventListener("mouseenter", () => {
      this.pauseTimer(e);
    }), t.addEventListener("mouseleave", () => {
      this.resumeTimer(e);
    });
  }
  /**
   * Set up Livewire event listeners if available
   */
  setupLivewireListeners() {
    typeof window.Livewire < "u" && (window.Livewire.on("showToast", (t) => {
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
    const s = e.position || "top-right", i = this.containers.get(s);
    if (!i)
      return !1;
    const a = `toast-${t}-${s}-${++this.toastCounter}`, n = this.createToastElement(a, t, s, e);
    i.appendChild(n), requestAnimationFrame(() => {
      n.setAttribute("data-toast-visible", "true");
    });
    const o = e.duration || 5e3;
    return !(e.persistent === !0) && o > 0 && this.setTimer(a, o), this.toasts.set(a, n), this.setupToastListeners(n), this.dispatchToastEvent("toast:show", a, e), !0;
  }
  /**
   * Create a toast element dynamically
   */
  createToastElement(t, e, s, i) {
    const a = e === "error" ? "danger" : e, n = document.createElement("div");
    return n.className = "pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2", n.setAttribute("data-toast", "true"), n.setAttribute("data-toast-variant", e), n.setAttribute("data-toast-position", s), n.setAttribute("data-toast-visible", "false"), n.setAttribute("role", "alert"), n.setAttribute("aria-live", "polite"), n.id = t, n.innerHTML = `
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
                        <button type="button" class="inline-flex items-center justify-center rounded-md bg-transparent p-1.5 text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${this.getIconColor(a)}" data-toast-dismiss="${t}" aria-label="Dismiss">
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
    const e = this.toasts.get(t);
    return e ? (this.clearTimer(t), this.pausedTimers.delete(t), e.setAttribute("data-toast-visible", "false"), e.setAttribute("data-toast-exiting", "true"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e), this.toasts.delete(t);
    }, 300), this.dispatchToastEvent("toast:dismiss", t), !0) : !1;
  }
  /**
   * Dismiss all visible toasts
   */
  dismissAll() {
    this.toasts.forEach((t, e) => {
      t.getAttribute("data-toast-visible") === "true" && this.dismiss(e);
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
    const s = t.querySelector("[data-toast-title]"), i = t.querySelector("[data-toast-message]"), a = t.querySelector("[data-toast-actions]");
    s && e.title ? (s.textContent = e.title, s.classList.remove("hidden")) : s && s.classList.add("hidden"), i && e.message && (i.textContent = e.message), a && e.actions ? (a.innerHTML = e.actions, a.classList.remove("hidden")) : a && a.classList.add("hidden"), t.setAttribute("data-toast-duration", String(e.duration || 5e3)), t.setAttribute("data-toast-persistent", String(e.persistent === !0));
  }
  /**
   * Reset toast content for reuse
   */
  resetToastContent(t) {
    const e = t.querySelector("[data-toast-title]"), s = t.querySelector("[data-toast-message]"), i = t.querySelector("[data-toast-actions]");
    e && (e.textContent = "", e.classList.add("hidden")), s && (s.textContent = ""), i && (i.innerHTML = "", i.classList.add("hidden")), t.removeAttribute("data-toast-duration"), t.removeAttribute("data-toast-persistent");
  }
  /**
   * Set auto-dismiss timer
   */
  setTimer(t, e) {
    this.clearTimer(t);
    const s = this.toasts.get(t);
    s && s.setAttribute("data-toast-start-time", String(Date.now()));
    const i = window.setTimeout(() => {
      this.dismiss(t);
    }, e);
    this.timers.set(t, i);
  }
  /**
   * Clear timer
   */
  clearTimer(t) {
    const e = this.timers.get(t);
    e && (clearTimeout(e), this.timers.delete(t));
  }
  /**
   * Pause timer (on hover)
   */
  pauseTimer(t) {
    const e = this.timers.get(t), s = this.toasts.get(t);
    if (e && s) {
      const i = parseInt(s.getAttribute("data-toast-duration") || "5000"), a = parseInt(s.getAttribute("data-toast-start-time") || "0"), n = Date.now() - a, o = Math.max(0, i - n);
      this.pausedTimers.set(t, {
        remaining: o,
        startTime: Date.now()
      }), this.clearTimer(t);
    }
  }
  /**
   * Resume timer (on mouse leave)
   */
  resumeTimer(t) {
    const e = this.toasts.get(t), s = this.pausedTimers.get(t);
    if (e && !(e.getAttribute("data-toast-persistent") === "true"))
      if (s && s.remaining > 0)
        this.setTimer(t, s.remaining), this.pausedTimers.delete(t);
      else {
        const a = parseInt(e.getAttribute("data-toast-duration") || "5000");
        a > 0 && this.setTimer(t, a);
      }
  }
  /**
   * Dispatch custom toast events
   */
  dispatchToastEvent(t, e, s = {}) {
    const i = new CustomEvent(t, {
      detail: { id: e, toast: e, ...s }
    });
    document.dispatchEvent(i);
    const a = this.toasts.get(e);
    if (a && a.dispatchEvent(i), typeof window.Livewire < "u") {
      const n = t.replace("toast:", "toast");
      window.Livewire.dispatch(n, { id: e, toast: e, ...s });
    }
  }
  /**
   * Get toast state (for external access)
   */
  getToastState(t) {
    const e = this.toasts.get(t);
    return e ? {
      id: t,
      visible: e.getAttribute("data-toast-visible") === "true",
      variant: e.getAttribute("data-toast-variant"),
      position: e.getAttribute("data-toast-position"),
      duration: parseInt(e.getAttribute("data-toast-duration") || "0"),
      persistent: e.getAttribute("data-toast-persistent") === "true"
    } : null;
  }
  /**
   * Destroy ToastActions and clean up
   */
  destroy() {
    this.timers.forEach((t) => clearTimeout(t)), this.timers.clear(), this.pausedTimers.clear(), this.toasts.forEach((t) => {
      this.resetToastContent(t), t.style.display = "none", t.setAttribute("data-toast-visible", "false");
    }), this.toasts.clear(), this.containers.clear();
  }
};
S.instance = null;
let L = S;
const V = L.getInstance();
typeof window < "u" && (V.discoverToasts(), window.ToastActions = L);
const E = class E {
  constructor() {
    this.initialized = !1, this.dropdownStates = /* @__PURE__ */ new Map();
  }
  /**
   * Get singleton instance
   */
  static getInstance() {
    return E.instance || (E.instance = new E()), E.instance;
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
    document.querySelectorAll('[data-dropdown="true"]').forEach((t) => {
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
    }, s = t.closest('[data-submenu="true"]');
    s && s !== t && (e.parent = s), this.dropdownStates.set(t, e), this.updateMenuItems(t), this.initializeSubmenus(t);
  }
  /**
   * Initialize submenus within a dropdown
   */
  initializeSubmenus(t) {
    const e = t.querySelectorAll('[data-submenu="true"]'), s = this.dropdownStates.get(t);
    s && (s.children = Array.from(e), this.dropdownStates.set(t, s)), e.forEach((i) => {
      this.dropdownStates.has(i) || this.initializeDropdown(i);
    });
  }
  /**
   * Bind global event listeners using event delegation
   */
  bindEventListeners() {
    document.addEventListener("click", (e) => {
      const s = e.target && e.target.closest && e.target.closest("[data-submenu-trigger]");
      if (s) {
        e.preventDefault(), e.stopPropagation();
        const r = s.closest('[data-submenu="true"]');
        r && !this.isDisabled(r) && this.toggleSubmenu(r);
        return;
      }
      const i = e.target && e.target.closest && e.target.closest("[data-dropdown-trigger]");
      if (i) {
        e.preventDefault(), e.stopPropagation();
        const r = i.closest('[data-dropdown="true"]');
        r && !this.isDisabled(r) && this.toggleDropdown(r);
        return;
      }
      const a = e.target && e.target.closest && e.target.closest("[data-menu-item]");
      if (a) {
        const r = a.closest('[data-dropdown="true"]');
        r && (a.dataset.keepOpen === "true" || this.closeDropdown(r));
        return;
      }
      const n = e.target && e.target.closest && e.target.closest("[data-menu-checkbox], [data-menu-radio]");
      if (n) {
        if (e.stopPropagation(), !(n.dataset.keepOpen !== "false")) {
          const l = n.closest('[data-dropdown="true"]');
          l && this.closeDropdown(l);
        }
        return;
      }
      if (e.target && e.target.closest && e.target.closest("[data-dropdown-panel], [data-submenu-panel]")) {
        e.stopPropagation();
        return;
      }
      this.closeAllDropdowns();
    }), document.addEventListener("mouseenter", (e) => {
      const s = e.target && e.target.closest && e.target.closest("[data-submenu-trigger]");
      if (s && !this.isMobile()) {
        const i = s.closest('[data-submenu="true"]');
        i && !this.isDisabled(i) && (this.closeSiblingSubmenus(i), setTimeout(() => {
          s.matches(":hover") && this.openSubmenu(i);
        }, 100));
      }
    }, !0), document.addEventListener("mouseleave", (e) => {
      const s = e.target && e.target.closest && e.target.closest('[data-submenu="true"]');
      if (s && !this.isMobile()) {
        const i = this.dropdownStates.get(s);
        i != null && i.isOpen && setTimeout(() => {
          s.matches(":hover") || this.closeSubmenu(s);
        }, 150);
      }
    }, !0), document.addEventListener("keydown", (e) => {
      const s = e.target && e.target.closest && e.target.closest('[data-dropdown="true"]');
      s && this.handleKeydown(s, e);
    }), window.addEventListener("resize", () => {
      this.repositionDropdowns();
    }), new MutationObserver((e) => {
      e.forEach((s) => {
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
  toggleDropdown(t) {
    const e = this.dropdownStates.get(t);
    e && (e.isOpen ? this.closeDropdown(t) : this.openDropdown(t));
  }
  /**
   * Open dropdown
   */
  openDropdown(t) {
    const e = this.dropdownStates.get(t);
    if (!e || this.isDisabled(t)) return;
    this.closeSiblingDropdowns(t), e.isOpen = !0, e.focusedIndex = -1, this.dropdownStates.set(t, e);
    const s = t.querySelector("[data-dropdown-panel]"), i = t.querySelector("[data-dropdown-trigger]");
    s && (s.classList.remove("hidden"), this.positionDropdown(t)), i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "dropdown:open");
  }
  /**
   * Open submenu
   */
  openSubmenu(t) {
    const e = this.dropdownStates.get(t);
    if (!e || this.isDisabled(t)) return;
    e.isOpen = !0, e.focusedIndex = -1, this.dropdownStates.set(t, e);
    const s = t.querySelector("[data-submenu-panel]"), i = t.querySelector("[data-submenu-trigger]");
    s && (s.classList.remove("hidden"), this.positionSubmenu(t)), i && i.setAttribute("aria-expanded", "true"), this.updateMenuItems(t), this.dispatchDropdownEvent(t, "submenu:open");
  }
  /**
   * Close dropdown
   */
  closeDropdown(t) {
    const e = this.dropdownStates.get(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.dropdownStates.set(t, e);
    const s = t.querySelector("[data-dropdown-panel]"), i = t.querySelector("[data-dropdown-trigger]");
    s && s.classList.add("hidden"), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "dropdown:close");
  }
  /**
   * Close submenu
   */
  closeSubmenu(t) {
    const e = this.dropdownStates.get(t);
    if (!e || !e.isOpen) return;
    this.closeChildSubmenus(t), e.isOpen = !1, e.focusedIndex = -1, this.dropdownStates.set(t, e);
    const s = t.querySelector("[data-submenu-panel]"), i = t.querySelector("[data-submenu-trigger]");
    s && s.classList.add("hidden"), i && i.setAttribute("aria-expanded", "false"), this.dispatchDropdownEvent(t, "submenu:close");
  }
  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    this.dropdownStates.forEach((t, e) => {
      t.isOpen && (t.parent || this.closeDropdown(e));
    });
  }
  /**
   * Close sibling dropdowns but preserve parent-child relationships
   */
  closeSiblingDropdowns(t) {
    const e = this.dropdownStates.get(t);
    this.dropdownStates.forEach((s, i) => {
      if (i !== t && s.isOpen) {
        const a = (e == null ? void 0 : e.parent) === i, n = s.parent === t;
        !a && !n && this.closeDropdown(i);
      }
    });
  }
  /**
   * Close sibling submenus
   */
  closeSiblingSubmenus(t) {
    const e = this.dropdownStates.get(t), s = e == null ? void 0 : e.parent;
    if (s) {
      const i = this.dropdownStates.get(s);
      i == null || i.children.forEach((a) => {
        a !== t && this.closeSubmenu(a);
      });
    }
  }
  /**
   * Close all child submenus
   */
  closeChildSubmenus(t) {
    const e = this.dropdownStates.get(t);
    e == null || e.children.forEach((s) => {
      this.closeSubmenu(s);
    });
  }
  /**
   * Toggle submenu open/closed state
   */
  toggleSubmenu(t) {
    const e = this.dropdownStates.get(t);
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
    const s = this.dropdownStates.get(t);
    if (s)
      switch (e.key) {
        case "Enter":
        case " ":
          if (!s.isOpen)
            e.preventDefault(), this.openDropdown(t);
          else if (s.focusedIndex >= 0) {
            e.preventDefault();
            const i = s.menuItems[s.focusedIndex];
            i && i.click();
          }
          break;
        case "Escape":
          if (s.isOpen) {
            e.preventDefault(), this.closeDropdown(t);
            const i = t.querySelector("[data-dropdown-trigger]");
            i && i.focus();
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
    const s = this.dropdownStates.get(t);
    if (!s || !s.isOpen) return;
    const i = s.menuItems.length;
    i !== 0 && (s.focusedIndex === -1 ? s.focusedIndex = e > 0 ? 0 : i - 1 : (s.focusedIndex += e, s.focusedIndex >= i ? s.focusedIndex = 0 : s.focusedIndex < 0 && (s.focusedIndex = i - 1)), this.dropdownStates.set(t, s), this.updateItemFocus(t));
  }
  /**
   * Update visual focus state of menu items
   */
  updateItemFocus(t) {
    const e = this.dropdownStates.get(t);
    e && e.menuItems.forEach((s, i) => {
      i === e.focusedIndex ? (s.classList.add("bg-neutral-100", "dark:bg-neutral-800"), s.scrollIntoView({ block: "nearest" })) : s.classList.remove("bg-neutral-100", "dark:bg-neutral-800");
    });
  }
  /**
   * Update menu items list for keyboard navigation
   */
  updateMenuItems(t) {
    const e = this.dropdownStates.get(t);
    if (!e) return;
    const s = t.querySelectorAll("[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]");
    e.menuItems = Array.from(s).filter((i) => {
      const a = i;
      return !a.hasAttribute("disabled") && a.offsetParent !== null;
    }), this.dropdownStates.set(t, e);
  }
  /**
   * Position dropdown relative to trigger
   */
  positionDropdown(t) {
    const e = t.querySelector("[data-dropdown-panel]"), s = t.querySelector("[data-dropdown-trigger]");
    if (!e || !s) return;
    const i = s.getBoundingClientRect(), a = e.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, r = t.dataset.position || "bottom", l = t.dataset.align || "start", c = parseInt(t.dataset.offset || "8");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "";
    const d = n - i.bottom, u = i.top;
    o - i.left, i.right;
    let h = r, f = l;
    switch (r === "bottom" && d < a.height && u > a.height ? h = "top" : r === "top" && u < a.height && d > a.height && (h = "bottom"), h) {
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
    if (h === "top" || h === "bottom")
      switch (f) {
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
      switch (f) {
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
    const e = t.querySelector("[data-submenu-panel]"), s = t.querySelector("[data-submenu-trigger]");
    if (!e || !s) return;
    const i = s.getBoundingClientRect(), a = e.getBoundingClientRect(), n = window.innerHeight, o = window.innerWidth, r = t.dataset.position || "right", l = t.dataset.align || "start", c = parseInt(t.dataset.offset || "4");
    e.style.top = "", e.style.bottom = "", e.style.left = "", e.style.right = "", e.style.transform = "";
    const d = o - i.right, u = i.left;
    n - i.bottom, i.top;
    let h = r;
    switch (r === "right" && d < a.width && u > a.width ? h = "left" : r === "left" && u < a.width && d > a.width && (h = "right"), h) {
      case "right":
        e.style.left = "100%", e.style.marginLeft = `${c}px`;
        break;
      case "left":
        e.style.right = "100%", e.style.marginRight = `${c}px`;
        break;
    }
    switch (l) {
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
    const f = e.getBoundingClientRect();
    if (f.bottom > n) {
      const x = f.bottom - n + 8;
      e.style.transform = `translateY(-${x}px)`;
    } else if (f.top < 0) {
      const x = Math.abs(f.top) + 8;
      e.style.transform = `translateY(${x}px)`;
    }
  }
  /**
   * Reposition all open dropdowns and submenus
   */
  repositionDropdowns() {
    this.dropdownStates.forEach((t, e) => {
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
    const i = new CustomEvent(e, {
      detail: {
        dropdown: t,
        ...s
      },
      bubbles: !0
    });
    t.dispatchEvent(i);
  }
  /**
   * Destroy DropdownActions and clean up
   */
  destroy() {
    this.dropdownStates.clear(), this.initialized = !1;
  }
};
E.instance = null;
let M = E;
M.getInstance();
function $() {
  A.getInstance().init(), k.getInstance().init(), I.getInstance().init(), T.getInstance().init(), D.getInstance().init(), C.getInstance().init(), L.getInstance().init(), M.getInstance().init();
}
const B = {
  FormActions: A.getInstance(),
  AlertActions: k.getInstance(),
  RadioActions: I.getInstance(),
  SelectActions: T.getInstance(),
  TabsActions: D.getInstance(),
  ModalActions: C.getInstance(),
  ToastActions: L.getInstance(),
  DropdownActions: M.getInstance(),
  init: $
};
export {
  k as AlertActions,
  M as DropdownActions,
  A as FormActions,
  C as ModalActions,
  I as RadioActions,
  T as SelectActions,
  D as TabsActions,
  L as ToastActions,
  B as default,
  $ as initializeKeysUI
};
