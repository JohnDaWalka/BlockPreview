var ot = Object.defineProperty;
var ye = (e) => {
  throw TypeError(e);
};
var st = (e, t, r) => t in e ? ot(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var _e = (e, t, r) => st(e, typeof t != "symbol" ? t + "" : t, r), ke = (e, t, r) => t.has(e) || ye("Cannot " + r);
var d = (e, t, r) => (ke(e, t, "read from private field"), r ? r.call(e) : t.get(e)), P = (e, t, r) => t.has(e) ? ye("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), M = (e, t, r, o) => (ke(e, t, "write to private field"), o ? o.call(e, r) : t.set(e, r), r);
import { UMB_AUTH_CONTEXT as nt } from "@umbraco-cms/backoffice/auth";
import { UMB_BLOCK_WORKSPACE_CONTEXT as Te } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as at, UMB_BLOCK_GRID_MANAGER_CONTEXT as lt, UMB_BLOCK_GRID_PROPERTY_EDITOR_UI_ALIAS as ct } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Ee } from "@umbraco-cms/backoffice/document";
import { css as ne, property as c, state as T, customElement as ae, html as U, ifDefined as le, unsafeHTML as ce } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ue } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as B, UmbObjectState as ut, UmbStringState as ve, UmbBooleanState as ht } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as he, UMB_PROPERTY_CONTEXT as pt, UMB_WRITABLE_PROPERTY_CONDITION_ALIAS as we } from "@umbraco-cms/backoffice/property";
import { tryExecute as H, UmbApiError as pe } from "@umbraco-cms/backoffice/resources";
import { UmbContextToken as dt } from "@umbraco-cms/backoffice/context-api";
import { UUIButtonElement as xe } from "@umbraco-cms/backoffice/external/uui";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as ft, UMB_BLOCK_LIST_MANAGER_CONTEXT as bt, UMB_BLOCK_LIST_PROPERTY_EDITOR_UI_ALIAS as mt } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as yt } from "@umbraco-cms/backoffice/block-rte";
import { UmbControllerBase as Ae } from "@umbraco-cms/backoffice/class-api";
import { UMB_PROPERTY_ACTION_DEFAULT_KIND_MANIFEST as _t } from "@umbraco-cms/backoffice/property-action";
var kt = async (e, t) => {
  let r = typeof t == "function" ? await t(e) : t;
  if (r) return e.scheme === "bearer" ? `Bearer ${r}` : e.scheme === "basic" ? `Basic ${btoa(r)}` : r;
}, vt = { bodySerializer: (e) => JSON.stringify(e, (t, r) => typeof r == "bigint" ? r.toString() : r) }, wt = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, gt = (e) => {
  switch (e) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, Ct = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, Ue = ({ allowReserved: e, explode: t, name: r, style: o, value: s }) => {
  if (!t) {
    let a = (e ? s : s.map((l) => encodeURIComponent(l))).join(gt(o));
    switch (o) {
      case "label":
        return `.${a}`;
      case "matrix":
        return `;${r}=${a}`;
      case "simple":
        return a;
      default:
        return `${r}=${a}`;
    }
  }
  let n = wt(o), i = s.map((a) => o === "label" || o === "simple" ? e ? a : encodeURIComponent(a) : J({ allowReserved: e, name: r, value: a })).join(n);
  return o === "label" || o === "matrix" ? n + i : i;
}, J = ({ allowReserved: e, name: t, value: r }) => {
  if (r == null) return "";
  if (typeof r == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${t}=${e ? r : encodeURIComponent(r)}`;
}, Oe = ({ allowReserved: e, explode: t, name: r, style: o, value: s }) => {
  if (s instanceof Date) return `${r}=${s.toISOString()}`;
  if (o !== "deepObject" && !t) {
    let a = [];
    Object.entries(s).forEach(([O, u]) => {
      a = [...a, O, e ? u : encodeURIComponent(u)];
    });
    let l = a.join(",");
    switch (o) {
      case "form":
        return `${r}=${l}`;
      case "label":
        return `.${l}`;
      case "matrix":
        return `;${r}=${l}`;
      default:
        return l;
    }
  }
  let n = Ct(o), i = Object.entries(s).map(([a, l]) => J({ allowReserved: e, name: o === "deepObject" ? `${r}[${a}]` : a, value: l })).join(n);
  return o === "label" || o === "matrix" ? n + i : i;
}, Tt = /\{[^{}]+\}/g, Et = ({ path: e, url: t }) => {
  let r = t, o = t.match(Tt);
  if (o) for (let s of o) {
    let n = !1, i = s.substring(1, s.length - 1), a = "simple";
    i.endsWith("*") && (n = !0, i = i.substring(0, i.length - 1)), i.startsWith(".") ? (i = i.substring(1), a = "label") : i.startsWith(";") && (i = i.substring(1), a = "matrix");
    let l = e[i];
    if (l == null) continue;
    if (Array.isArray(l)) {
      r = r.replace(s, Ue({ explode: n, name: i, style: a, value: l }));
      continue;
    }
    if (typeof l == "object") {
      r = r.replace(s, Oe({ explode: n, name: i, style: a, value: l }));
      continue;
    }
    if (a === "matrix") {
      r = r.replace(s, `;${J({ name: i, value: l })}`);
      continue;
    }
    let O = encodeURIComponent(a === "label" ? `.${l}` : l);
    r = r.replace(s, O);
  }
  return r;
}, Pe = ({ allowReserved: e, array: t, object: r } = {}) => (o) => {
  let s = [];
  if (o && typeof o == "object") for (let n in o) {
    let i = o[n];
    if (i != null) {
      if (Array.isArray(i)) {
        s = [...s, Ue({ allowReserved: e, explode: !0, name: n, style: "form", value: i, ...t })];
        continue;
      }
      if (typeof i == "object") {
        s = [...s, Oe({ allowReserved: e, explode: !0, name: n, style: "deepObject", value: i, ...r })];
        continue;
      }
      s = [...s, J({ allowReserved: e, name: n, value: i })];
    }
  }
  return s.join("&");
}, xt = (e) => {
  var r;
  if (!e) return "stream";
  let t = (r = e.split(";")[0]) == null ? void 0 : r.trim();
  if (t) {
    if (t.startsWith("application/json") || t.endsWith("+json")) return "json";
    if (t === "multipart/form-data") return "formData";
    if (["application/", "audio/", "image/", "video/"].some((o) => t.startsWith(o))) return "blob";
    if (t.startsWith("text/")) return "text";
  }
}, At = async ({ security: e, ...t }) => {
  for (let r of e) {
    let o = await kt(r, t.auth);
    if (!o) continue;
    let s = r.name ?? "Authorization";
    switch (r.in) {
      case "query":
        t.query || (t.query = {}), t.query[s] = o;
        break;
      case "cookie":
        t.headers.append("Cookie", `${s}=${o}`);
        break;
      case "header":
      default:
        t.headers.set(s, o);
        break;
    }
    return;
  }
}, ge = (e) => Ut({ baseUrl: e.baseUrl, path: e.path, query: e.query, querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : Pe(e.querySerializer), url: e.url }), Ut = ({ baseUrl: e, path: t, query: r, querySerializer: o, url: s }) => {
  let n = s.startsWith("/") ? s : `/${s}`, i = (e ?? "") + n;
  t && (i = Et({ path: t, url: i }));
  let a = r ? o(r) : "";
  return a.startsWith("?") && (a = a.substring(1)), a && (i += `?${a}`), i;
}, Ce = (e, t) => {
  var o;
  let r = { ...e, ...t };
  return (o = r.baseUrl) != null && o.endsWith("/") && (r.baseUrl = r.baseUrl.substring(0, r.baseUrl.length - 1)), r.headers = Me(e.headers, t.headers), r;
}, Me = (...e) => {
  let t = new Headers();
  for (let r of e) {
    if (!r || typeof r != "object") continue;
    let o = r instanceof Headers ? r.entries() : Object.entries(r);
    for (let [s, n] of o) if (n === null) t.delete(s);
    else if (Array.isArray(n)) for (let i of n) t.append(s, i);
    else n !== void 0 && t.set(s, typeof n == "object" ? JSON.stringify(n) : n);
  }
  return t;
}, Z = class {
  constructor() {
    _e(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  exists(e) {
    return this._fns.indexOf(e) !== -1;
  }
  eject(e) {
    let t = this._fns.indexOf(e);
    t !== -1 && (this._fns = [...this._fns.slice(0, t), ...this._fns.slice(t + 1)]);
  }
  use(e) {
    this._fns = [...this._fns, e];
  }
}, Ot = () => ({ error: new Z(), request: new Z(), response: new Z() }), Pt = Pe({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), Mt = { "Content-Type": "application/json" }, Be = (e = {}) => ({ ...vt, headers: Mt, parseAs: "auto", querySerializer: Pt, ...e }), Bt = (e = {}) => {
  let t = Ce(Be(), e), r = () => ({ ...t }), o = (i) => (t = Ce(t, i), r()), s = Ot(), n = async (i) => {
    let a = { ...t, ...i, fetch: i.fetch ?? t.fetch ?? globalThis.fetch, headers: Me(t.headers, i.headers) };
    a.security && await At({ ...a, security: a.security }), a.body && a.bodySerializer && (a.body = a.bodySerializer(a.body)), (a.body === void 0 || a.body === "") && a.headers.delete("Content-Type");
    let l = ge(a), O = { redirect: "follow", ...a }, u = new Request(l, O);
    for (let A of s.request._fns) u = await A(u, a);
    let it = a.fetch, v = await it(u);
    for (let A of s.response._fns) v = await A(v, u, a);
    let j = { request: u, response: v };
    if (v.ok) {
      if (v.status === 204 || v.headers.get("Content-Length") === "0") return { data: {}, ...j };
      let A = (a.parseAs === "auto" ? xt(v.headers.get("Content-Type")) : a.parseAs) ?? "json";
      if (A === "stream") return { data: v.body, ...j };
      let z = await v[A]();
      return A === "json" && (a.responseValidator && await a.responseValidator(z), a.responseTransformer && (z = await a.responseTransformer(z))), { data: z, ...j };
    }
    let W = await v.text();
    try {
      W = JSON.parse(W);
    } catch {
    }
    let I = W;
    for (let A of s.error._fns) I = await A(W, v, u, a);
    if (I = I || {}, a.throwOnError) throw I;
    return { error: I, ...j };
  };
  return { buildUrl: ge, connect: (i) => n({ ...i, method: "CONNECT" }), delete: (i) => n({ ...i, method: "DELETE" }), get: (i) => n({ ...i, method: "GET" }), getConfig: r, head: (i) => n({ ...i, method: "HEAD" }), interceptors: s, options: (i) => n({ ...i, method: "OPTIONS" }), patch: (i) => n({ ...i, method: "PATCH" }), post: (i) => n({ ...i, method: "POST" }), put: (i) => n({ ...i, method: "PUT" }), request: n, setConfig: o, trace: (i) => n({ ...i, method: "TRACE" }) };
};
const V = Bt(Be({
  baseUrl: "http://localhost:26292",
  throwOnError: !0
}));
class Q {
  static previewGridBlock(t) {
    return ((t == null ? void 0 : t.client) ?? V).post({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/block-preview/preview/grid",
      ...t,
      headers: {
        "Content-Type": "application/json",
        ...t == null ? void 0 : t.headers
      }
    });
  }
  static previewListBlock(t) {
    return ((t == null ? void 0 : t.client) ?? V).post({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/block-preview/preview/list",
      ...t,
      headers: {
        "Content-Type": "application/json",
        ...t == null ? void 0 : t.headers
      }
    });
  }
  static previewRichTextMarkup(t) {
    return ((t == null ? void 0 : t.client) ?? V).post({
      security: [
        {
          scheme: "bearer",
          type: "http"
        }
      ],
      url: "/umbraco/management/api/v1/block-preview/preview/rte",
      ...t,
      headers: {
        "Content-Type": "application/json",
        ...t == null ? void 0 : t.headers
      }
    });
  }
  static getSettings(t) {
    return ((t == null ? void 0 : t.client) ?? V).get({
      url: "/umbraco/management/api/v1/block-preview/settings",
      ...t
    });
  }
}
const de = new dt("BlockPreviewContext");
var $t = Object.defineProperty, St = Object.getOwnPropertyDescriptor, $e = (e) => {
  throw TypeError(e);
}, y = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? St(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (s = (o ? i(t, r, s) : i(s)) || s);
  return o && s && $t(t, r, s), s;
}, fe = (e, t, r) => t.has(e) || $e("Cannot " + r), w = (e, t, r) => (fe(e, t, "read from private field"), t.get(e)), ee = (e, t, r) => t.has(e) ? $e("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Se = (e, t, r, o) => (fe(e, t, "write to private field"), t.set(e, r), r), E = (e, t, r) => (fe(e, t, "access private method"), r), b, X, _, qe, De, Re, Le, Ie, re, Ve, Ne, Ke;
const qt = "block-grid-preview";
let p = class extends ue {
  constructor() {
    super(), ee(this, _), ee(this, b), ee(this, X), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._sortModeActive = !1, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      contentUdi: "",
      settingsUdi: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: "",
      contentElementTypeKey: "",
      blockIndex: 0
    }, this._blockGridValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(de, (e) => {
      Se(this, b, e), E(this, _, qe).call(this);
    });
  }
  set blockGridValue(e) {
    const t = e ? { ...e } : {};
    t.layout ?? (t.layout = {}), t.contentData ?? (t.contentData = []), t.settingsData ?? (t.settingsData = []), t.expose ?? (t.expose = []), this._blockGridValue = t;
  }
  get blockGridValue() {
    return this._blockGridValue;
  }
  async updated(e) {
    super.updated(e), e.has("content") && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      E(this, _, Ne).call(this);
    }, 500));
  }
  _filterLayouts(e) {
    if (!e || e.length === 0)
      return [];
    const t = e.filter((o) => o.contentKey === this._blockContext.contentUdi);
    return t.length > 0 ? t : e.flatMap((o) => o.areas || []).flatMap((o) => (o == null ? void 0 : o.items) || []).filter((o) => o && o.contentKey === this._blockContext.contentUdi);
  }
  _handleClick(e) {
    var n;
    let t = !0;
    const r = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (r.filter((i) => i instanceof Element && o.includes(i.tagName)).length > 0) {
      const i = r.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      i != null && i instanceof xe && (n = i.href) != null && n.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    if (this._sortModeActive === !1) {
      if (this._isLoading)
        return U`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>`;
      if (this._error)
        return U`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            `;
      if (this._htmlMarkup)
        return U`
                ${this._styleElement}
                <a
                    href=${le(this._blockContext.workspaceEditContentPath)} 
                    @click=${this._handleClick}
                    aria-label="Edit block"
                    role="button"
                >
                    ${ce(this._htmlMarkup)}
                </a>
            `;
    } else return U`<umb-block-grid-block
            class="umb-block-grid__block--view"
            .label=${this.label}
            .icon=${this.icon}
            .unpublished=${this.unpublished}
            .config=${this.config}
            .content=${this.content}
            .settings=${this.settingsData}>
            </umb-block-grid-block>
        `;
  }
};
b = /* @__PURE__ */ new WeakMap();
X = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakSet();
qe = function() {
  E(this, _, De).call(this), E(this, _, Re).call(this), E(this, _, Le).call(this), E(this, _, Ie).call(this);
};
De = function() {
  var e;
  this.observe((e = w(this, b)) == null ? void 0 : e.sortModeActive, (t) => {
    t !== void 0 && (this._sortModeActive = t);
  });
};
Re = function() {
  var e;
  this.observe((e = w(this, b)) == null ? void 0 : e.settings, (t) => {
    var r;
    (r = t == null ? void 0 : t.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockGrid.stylesheet);
  });
};
Le = function() {
  this.consumeContext(he, (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
Ie = async function() {
  this.getContext(Ee).then((e) => {
    e && (Se(this, X, e), this.observe(
      B([e.unique, e.contentTypeUnique]),
      async ([t, r]) => {
        var o, s;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = w(this, b)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (s = w(this, b)) == null || s.setDocumentTypeUnique(this._blockContext.documentTypeUnique), E(this, _, re).call(this);
      }
    ));
  }), w(this, X) == null && w(this, b) != null && this._blockContext.unique == "" && this.consumeContext(Te, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var r;
      this._blockContext.unique = ((r = w(this, b)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", E(this, _, re).call(this);
    });
  });
};
re = async function() {
  this.consumeContext(at, async (e) => {
    e && this.observe(
      B([
        e.contentKey,
        e.settingsKey,
        e.workspaceEditContentPath,
        e.contentElementTypeAlias,
        e.contentElementTypeKey
      ]),
      async ([
        t,
        r,
        o,
        s,
        n
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = s ?? "", this._blockContext.contentElementTypeKey = n ?? "", await E(this, _, Ve).call(this);
      }
    );
  });
};
Ve = async function() {
  this.consumeContext(lt, (e) => {
    e && this.observe(
      B([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([t, r, o, s, n]) => {
        this._blockContext.blockEditorAlias = n ?? "", this.blockGridValue = {
          contentData: (t == null ? void 0 : t.filter((i) => i.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((i) => i.key == this._blockContext.settingsUdi)) ?? [],
          expose: (s == null ? void 0 : s.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: { "Umbraco.BlockGrid": this._filterLayouts(o) }
        }, this._blockContext.blockIndex = t.indexOf(this.blockGridValue.contentData[0]);
      }
    );
  });
};
Ne = async function() {
  const e = this._blockContext;
  if (w(this, b) != null && e.unique == "" && (e.unique = w(this, b).getUnique()), w(this, b) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = w(this, b).getDocumentTypeUnique()), !E(this, _, Ke).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: r, error: o } = await H(this, Q.previewGridBlock({
      body: JSON.stringify(this.blockGridValue),
      query: {
        blockEditorAlias: e.blockEditorAlias,
        nodeKey: e.unique,
        contentElementAlias: e.contentElementTypeAlias,
        documentTypeUnique: e.documentTypeUnique,
        contentUdi: e.contentUdi,
        settingsUdi: e.settingsUdi,
        culture: e.culture,
        blockIndex: e.blockIndex
      }
    }));
    if (r)
      this._htmlMarkup = r ?? "", this._isLoading = !1;
    else if (pe.isUmbApiError(o)) {
      debugger;
      this._error = o.message, this._isLoading = !1;
    }
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
Ke = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
p.styles = [
  ne`
            a {
              display: block;
              color: inherit;
              text-decoration: inherit;
              border: 1px solid transparent;
              border-radius: 2px;
            }

            a:hover {
                border-color: var(--uui-color-interactive-emphasis, #3544b1);
            }

            .preview-alert {
                background-color: var(--uui-color-danger, #f0ac00);
                border: 1px solid transparent;
                border-radius: 0;
                margin-bottom: 20px;
                padding: 8px 35px 8px 14px;
                position: relative;

                &, a, h4 {
                    color: #fff;
                }

                pre {
                    white-space: normal;
                }

                uui-loader {
                    margin-right: 16px;
                }
            }

            .preview-alert-warning {
                background-color: var(--uui-color-warning, #f0ac00);
                border-color: transparent;
                color: #000;
            }

            .preview-alert-info {
                background-color: var(--uui-color-default, #3544b1);
                border-color: transparent;
                color: #fff;
            }

            .preview-alert-danger, .preview-alert-error {
                background-color: var(--uui-color-danger, #f0ac00);
                border-color: transparent;
                color: #fff;
            }
        `
];
y([
  c({ attribute: !1 })
], p.prototype, "content", 2);
y([
  c({ attribute: !1 })
], p.prototype, "settingsData", 2);
y([
  c({ attribute: !1 })
], p.prototype, "contentKey", 2);
y([
  c({ attribute: !1 })
], p.prototype, "config", 2);
y([
  c({ attribute: !1 })
], p.prototype, "unpublished", 2);
y([
  c({ attribute: !1 })
], p.prototype, "icon", 2);
y([
  c({ attribute: !1 })
], p.prototype, "label", 2);
y([
  T()
], p.prototype, "_htmlMarkup", 2);
y([
  T()
], p.prototype, "_isLoading", 2);
y([
  T()
], p.prototype, "_error", 2);
y([
  T()
], p.prototype, "_sortModeActive", 2);
y([
  c({ attribute: !1 })
], p.prototype, "blockGridValue", 1);
p = y([
  ae(qt)
], p);
var Dt = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, Ge = (e) => {
  throw TypeError(e);
}, f = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? Rt(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (s = (o ? i(t, r, s) : i(s)) || s);
  return o && s && Dt(t, r, s), s;
}, be = (e, t, r) => t.has(e) || Ge("Cannot " + r), g = (e, t, r) => (be(e, t, "read from private field"), t.get(e)), te = (e, t, r) => t.has(e) ? Ge("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), je = (e, t, r, o) => (be(e, t, "write to private field"), t.set(e, r), r), x = (e, t, r) => (be(e, t, "access private method"), r), m, Y, k, We, ze, Xe, Ye, Fe, ie, He, Je, Qe;
const Lt = "block-list-preview";
let h = class extends ue {
  constructor() {
    super(), te(this, k), te(this, m), te(this, Y), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._sortModeActive = !1, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      contentUdi: "",
      settingsUdi: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: "",
      contentElementTypeKey: "",
      blockIndex: 0
    }, this._blockListValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(de, (e) => {
      je(this, m, e), x(this, k, We).call(this);
    });
  }
  set blockListValue(e) {
    const t = e ? { ...e } : {};
    t.layout ?? (t.layout = {}), t.contentData ?? (t.contentData = []), t.settingsData ?? (t.settingsData = []), t.expose ?? (t.expose = []), this._blockListValue = t;
  }
  get blockListValue() {
    return this._blockListValue;
  }
  async updated(e) {
    super.updated(e), e.has("content") && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      x(this, k, Je).call(this);
    }, 500));
  }
  _handleClick(e) {
    var n;
    let t = !0;
    const r = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (r.filter((i) => i instanceof Element && o.includes(i.tagName)).length > 0) {
      const i = r.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      i != null && i instanceof xe && (n = i.href) != null && n.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    if (this._sortModeActive === !1) {
      if (this._isLoading)
        return U`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>`;
      if (this._error)
        return U`
                    <div class="preview-alert preview-alert-error" role="alert">
                        ${this._error}
                    </div>
                `;
      if (this._htmlMarkup)
        return U`
                    ${this._styleElement}
                    <a 
                        href=${le(this._blockContext.workspaceEditContentPath)}
                        @click=${this._handleClick}
                        aria-label="Edit block"
                        role="button"
                    >
                        ${ce(this._htmlMarkup)}
                    </a>
                `;
    } else return U`<umb-ref-list-block
            class="umb-block-grid__block--view"
            .label=${this.label}
            .icon=${this.icon}
            .unpublished=${this.unpublished}
            .config=${this.config}
            .content=${this.content}
            .settings=${this.settingsData}>
            </umb-ref-list-block>
        `;
  }
};
m = /* @__PURE__ */ new WeakMap();
Y = /* @__PURE__ */ new WeakMap();
k = /* @__PURE__ */ new WeakSet();
We = function() {
  x(this, k, ze).call(this), x(this, k, Xe).call(this), x(this, k, Ye).call(this), x(this, k, Fe).call(this);
};
ze = function() {
  var e;
  this.observe((e = g(this, m)) == null ? void 0 : e.sortModeActive, (t) => {
    t !== void 0 && (this._sortModeActive = t);
  });
};
Xe = function() {
  var e;
  this.observe((e = g(this, m)) == null ? void 0 : e.settings, (t) => {
    var r;
    (r = t == null ? void 0 : t.blockList) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockList.stylesheet);
  });
};
Ye = function() {
  this.consumeContext(he, async (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
Fe = function() {
  this.getContext(Ee).then((e) => {
    e && (je(this, Y, e), this.observe(
      B([e.unique, e.contentTypeUnique]),
      async ([t, r]) => {
        var o, s;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = g(this, m)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (s = g(this, m)) == null || s.setDocumentTypeUnique(this._blockContext.documentTypeUnique), x(this, k, ie).call(this);
      }
    ));
  }), g(this, Y) == null && g(this, m) != null && this._blockContext.unique == "" && this.consumeContext(Te, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var r;
      this._blockContext.unique = ((r = g(this, m)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", x(this, k, ie).call(this);
    });
  });
};
ie = function() {
  this.consumeContext(ft, (e) => {
    e && this.observe(
      B([
        e.contentKey,
        e.settingsKey,
        e.workspaceEditContentPath,
        e.contentElementTypeAlias,
        e.contentElementTypeKey
      ]),
      async ([
        t,
        r,
        o,
        s,
        n
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = s ?? "", this._blockContext.contentElementTypeKey = n ?? "", await x(this, k, He).call(this);
      }
    );
  });
};
He = function() {
  this.consumeContext(bt, (e) => {
    e && this.observe(
      B([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([t, r, o, s, n]) => {
        this._blockContext.blockEditorAlias = n ?? "", this.blockListValue = {
          contentData: (t == null ? void 0 : t.filter((i) => i.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((i) => i.key == this._blockContext.settingsUdi)) ?? [],
          expose: (s == null ? void 0 : s.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockList": (o == null ? void 0 : o.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, this._blockContext.blockIndex = t == null ? void 0 : t.indexOf(this.blockListValue.contentData[0]);
      }
    );
  });
};
Je = async function() {
  const e = this._blockContext;
  if (g(this, m) != null && e.unique == "" && (e.unique = g(this, m).getUnique()), g(this, m) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = g(this, m).getDocumentTypeUnique()), !x(this, k, Qe).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: r, error: o } = await H(this, Q.previewListBlock({
      body: JSON.stringify(this.blockListValue),
      query: {
        blockEditorAlias: e.blockEditorAlias,
        nodeKey: e.unique,
        contentElementAlias: e.contentElementTypeAlias,
        documentTypeUnique: e.documentTypeUnique,
        contentUdi: e.contentUdi,
        settingsUdi: e.settingsUdi,
        culture: e.culture,
        blockIndex: e.blockIndex
      }
    }));
    r ? (this._htmlMarkup = r ?? "", this._isLoading = !1) : pe.isUmbApiError(o) && (this._error = o.message, this._isLoading = !1);
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
Qe = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
h.styles = [
  ne`
        a {
          display: block;
          color: inherit;
          text-decoration: inherit;
          border: 1px solid transparent;
          border-radius: 2px;
        }

        a:hover {
            border-color: var(--uui-color-interactive-emphasis, #3544b1);
        }

        .preview-alert {
            background-color: var(--uui-color-danger, #f0ac00);
            border: 1px solid transparent;
            border-radius: 0;
            margin-bottom: 20px;
            padding: 8px 35px 8px 14px;
            position: relative;

            &, a, h4 {
                color: #fff;
            }

            pre {
                white-space: normal;
            }

            uui-loader {
                margin-right: 16px;
            }
        }

        .preview-alert-warning {
            background-color: var(--uui-color-warning, #f0ac00);
            border-color: transparent;
            color: #000;
        }

        .preview-alert-info {
            background-color: var(--uui-color-default, #3544b1);
            border-color: transparent;
            color: #fff;
        }

        .preview-alert-danger, .preview-alert-error {
            background-color: var(--uui-color-danger, #f0ac00);
            border-color: transparent;
            color: #fff;
        }
    `
];
f([
  c({ attribute: !1 })
], h.prototype, "content", 2);
f([
  c({ attribute: !1 })
], h.prototype, "settingsData", 2);
f([
  c({ attribute: !1 })
], h.prototype, "contentKey", 2);
f([
  c({ attribute: !1 })
], h.prototype, "config", 2);
f([
  c({ attribute: !1 })
], h.prototype, "unpublished", 2);
f([
  c({ attribute: !1 })
], h.prototype, "icon", 2);
f([
  c({ attribute: !1 })
], h.prototype, "label", 2);
f([
  T()
], h.prototype, "_htmlMarkup", 2);
f([
  T()
], h.prototype, "_isLoading", 2);
f([
  T()
], h.prototype, "_error", 2);
f([
  T()
], h.prototype, "_sortModeActive", 2);
f([
  T()
], h.prototype, "_blockListValue", 2);
f([
  c({ attribute: !1 })
], h.prototype, "blockListValue", 1);
h = f([
  ae(Lt)
], h);
var It = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, Ze = (e) => {
  throw TypeError(e);
}, $ = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? Vt(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (s = (o ? i(t, r, s) : i(s)) || s);
  return o && s && It(t, r, s), s;
}, Nt = (e, t, r) => t.has(e) || Ze("Cannot " + r), Kt = (e, t, r) => t.has(e) ? Ze("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), F = (e, t, r) => (Nt(e, t, "access private method"), r), R, et, tt, me;
const Gt = "rich-text-preview";
let C = class extends ue {
  constructor() {
    var e;
    super(), Kt(this, R), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(he, async (t) => {
      t && (this.culture = t.getVariantId().culture ?? "");
    }), this.unique = (e = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : e[0], F(this, R, et).call(this);
  }
  set blockRteValue(e) {
    const t = e ? { ...e } : {};
    t.layout ?? (t.layout = {}), t.contentData ?? (t.contentData = []), t.settingsData ?? (t.settingsData = []), t.expose ?? (t.expose = []), this._blockRteValue = t;
  }
  get blockRteValue() {
    return this._blockRteValue;
  }
  async updated(e) {
    super.updated(e), e.has("content") && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      F(this, R, me).call(this);
    }, 500));
  }
  render() {
    if (this.htmlMarkup !== "")
      return U`
                <a href=${le(this.workspaceEditContentPath)}>
                    ${ce(this.htmlMarkup)}
                </a>`;
  }
};
R = /* @__PURE__ */ new WeakSet();
et = function() {
  this.consumeContext(pt, (e) => {
    e && this.observe(
      B([e.alias, e.value]),
      async ([t, r]) => {
        this.blockEditorAlias = t, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), F(this, R, tt).call(this));
      }
    );
  });
};
tt = function() {
  this.consumeContext(yt, (e) => {
    e && this.observe(
      B([e.workspaceEditContentPath, e.contentElementTypeAlias]),
      async ([t, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = t, await F(this, R, me).call(this);
      }
    );
  });
};
me = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout) return;
  const { data: e, error: t } = await H(this, Q.previewRichTextMarkup({
    body: JSON.stringify(this.blockRteValue),
    query: {
      blockEditorAlias: this.blockEditorAlias,
      nodeKey: this.unique,
      contentElementAlias: this.contentElementTypeAlias,
      culture: this.culture
    }
  }), { disableNotifications: !0 });
  if (e)
    this.htmlMarkup = e ?? "";
  else if (pe.isUmbApiError(t))
    throw t;
};
C.styles = [
  ne`
            a {
              display: block;
              color: inherit;
              text-decoration: inherit;
              border: 1px solid transparent;
              border-radius: 2px;
            }

            a:hover {
                border-color: var(--uui-color-interactive-emphasis, #3544b1);
            }

            .preview-alert {
                background-color: var(--uui-color-danger, #f0ac00);
                border: 1px solid transparent;
                border-radius: 0;
                margin-bottom: 20px;
                padding: 8px 35px 8px 14px;
                position: relative;

                &, a, h4 {
                    color: #fff;
                }

                pre {
                    white-space: normal;
                }
            }

            .preview-alert-warning {
                background-color: var(--uui-color-warning, #f0ac00);
                border-color: transparent;
                color: #000;
            }

            .preview-alert-info {
                background-color: var(--uui-color-default, #3544b1);
                border-color: transparent;
                color: #fff;
            }

            .preview-alert-danger, .preview-alert-error {
                background-color: var(--uui-color-danger, #f0ac00);
                border-color: transparent;
                color: #fff;
            }
        `
];
$([
  c({ attribute: !1 })
], C.prototype, "content", 2);
$([
  c({ attribute: !1 })
], C.prototype, "settingsData", 2);
$([
  c({ attribute: !1 })
], C.prototype, "contentKey", 2);
$([
  c({ attribute: !1 })
], C.prototype, "config", 2);
$([
  T()
], C.prototype, "htmlMarkup", 2);
$([
  T()
], C.prototype, "_blockRteValue", 2);
$([
  c({ attribute: !1 })
], C.prototype, "blockRteValue", 1);
C = $([
  ae(Gt)
], C);
var N, L, S, q, D;
class oe extends Ae {
  constructor(r) {
    super(r);
    P(this, N);
    P(this, L);
    P(this, S);
    P(this, q);
    P(this, D);
    M(this, L, new ut(void 0)), this.settings = d(this, L).asObservable(), M(this, S, new ve("")), this.unique = d(this, S).asObservable(), M(this, q, new ve("")), this.documentTypeUnique = d(this, q).asObservable(), M(this, D, new ht(!1)), this.sortModeActive = d(this, D).asObservable(), M(this, N, new rt(r)), this.getSettings(), this.setSortMode(!1);
  }
  async getSettings() {
    const r = await d(this, N).getSettings();
    d(this, L).setValue(r);
  }
  getUnique() {
    return d(this, S).getValue();
  }
  async setUnique(r) {
    r != "" && d(this, S).setValue(r);
  }
  getDocumentTypeUnique() {
    return d(this, q).getValue();
  }
  async setDocumentTypeUnique(r) {
    r != "" && d(this, q).setValue(r);
  }
  getSortMode() {
    return d(this, D).getValue();
  }
  async setSortMode(r) {
    d(this, D).setValue(r);
  }
}
N = new WeakMap(), L = new WeakMap(), S = new WeakMap(), q = new WeakMap(), D = new WeakMap();
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: oe,
  default: oe
}, Symbol.toStringTag, { value: "Module" })), Wt = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => jt)
  }
], zt = [...Wt], se = {
  type: "kind",
  alias: "Umb.PropertyAction.SortMode",
  matchKind: "sortMode",
  matchType: "propertyAction",
  manifest: {
    ..._t.manifest,
    type: "propertyAction",
    kind: "sortMode",
    api: () => import("./sort-mode.property-action-Cast0wQP.js"),
    weight: 100,
    meta: {
      icon: "icon-navigation-vertical",
      label: "Sort Mode"
    }
  }
}, Xt = [
  se
], Yt = [
  {
    ...se.manifest,
    type: "propertyAction",
    kind: "sortMode",
    alias: "BlockPreview.PropertyAction.Grid.SortMode",
    name: "Block Grid Sort Mode Property Action",
    api: () => import("./block-grid-sort-mode-BpSwQm8e.js"),
    forPropertyEditorUis: [ct],
    conditions: [
      {
        alias: we
      }
    ]
  },
  {
    ...se.manifest,
    type: "propertyAction",
    kind: "sortMode",
    alias: "BlockPreview.PropertyAction.List.SortMode",
    name: "Block List Sort Mode Property Action",
    api: () => import("./block-list-sort-mode-qAKpXOJz.js"),
    forPropertyEditorUis: [mt],
    conditions: [
      {
        alias: we
      }
    ]
  }
];
var K;
class Ft {
  constructor(t) {
    P(this, K);
    M(this, K, t);
  }
  async getSettings() {
    return await H(d(this, K), Q.getSettings());
  }
}
K = new WeakMap();
var G;
class rt extends Ae {
  constructor(r) {
    super(r);
    P(this, G);
    M(this, G, new Ft(r));
  }
  async getSettings() {
    const r = await d(this, G).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
G = new WeakMap();
const pr = async (e, t) => {
  e.consumeContext(nt, async (r) => {
    var a, l, O;
    if (!r) return;
    const o = r.getOpenApiConfiguration();
    V.setConfig({
      auth: () => r.getLatestToken(),
      baseUrl: o.base,
      credentials: o.credentials
    });
    const n = await new rt(e).getSettings();
    let i = [];
    if (n) {
      if (n.blockGrid.enabled) {
        let u = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.GridCustomView",
          name: "BlockPreview Grid Custom View",
          element: p,
          forBlockEditor: "block-grid"
        };
        ((a = n.blockGrid.contentTypes) == null ? void 0 : a.length) !== 0 && (u.forContentTypeAlias = n.blockGrid.contentTypes), i.push(u);
      }
      if (n.blockList.enabled) {
        let u = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.ListCustomView",
          name: "BlockPreview List Custom View",
          element: h,
          forBlockEditor: "block-list"
        };
        ((l = n.blockList.contentTypes) == null ? void 0 : l.length) !== 0 && (u.forContentTypeAlias = n.blockList.contentTypes), i.push(u);
      }
      if (n.richText.enabled) {
        let u = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.RichTextCustomView",
          name: "BlockPreview Rich Text Custom View",
          element: C,
          forBlockEditor: "block-rte"
        };
        ((O = n.richText.contentTypes) == null ? void 0 : O.length) !== 0 && (u.forContentTypeAlias = n.richText.contentTypes), i.push(u);
      }
    }
    t.registerMany([
      ...i,
      ...zt,
      ...Xt,
      ...Yt
    ]), e.provideContext(de, new oe(e));
  });
};
export {
  de as B,
  C as R,
  Ft as S,
  p as a,
  h as b,
  rt as c,
  pr as o
};
//# sourceMappingURL=index-qWwkpU-u.js.map
