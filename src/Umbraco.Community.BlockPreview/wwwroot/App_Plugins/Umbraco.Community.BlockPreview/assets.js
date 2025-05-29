var Ze = Object.defineProperty;
var be = (e) => {
  throw TypeError(e);
};
var et = (e, t, r) => t in e ? Ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var me = (e, t, r) => et(e, typeof t != "symbol" ? t + "" : t, r), ye = (e, t, r) => t.has(e) || be("Cannot " + r);
var p = (e, t, r) => (ye(e, t, "read from private field"), r ? r.call(e) : t.get(e)), P = (e, t, r) => t.has(e) ? be("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), B = (e, t, r, o) => (ye(e, t, "write to private field"), o ? o.call(e, r) : t.set(e, r), r);
import { UMB_AUTH_CONTEXT as tt } from "@umbraco-cms/backoffice/auth";
import { tryExecute as F, UmbApiError as oe } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as we } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_WORKSPACE_CONTEXT as ge } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as rt, UMB_BLOCK_GRID_MANAGER_CONTEXT as it } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Ce } from "@umbraco-cms/backoffice/document";
import { css as ne, property as u, state as x, customElement as se, html as L, ifDefined as ae, unsafeHTML as le } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ce } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as q, UmbObjectState as ot, UmbStringState as _e } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as ue, UMB_PROPERTY_CONTEXT as nt } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as st } from "@umbraco-cms/backoffice/context-api";
import { UUIButtonElement as Te } from "@umbraco-cms/backoffice/external/uui";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as at, UMB_BLOCK_LIST_MANAGER_CONTEXT as lt } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as ct } from "@umbraco-cms/backoffice/block-rte";
var ut = async (e, t) => {
  let r = typeof t == "function" ? await t(e) : t;
  if (r) return e.scheme === "bearer" ? `Bearer ${r}` : e.scheme === "basic" ? `Basic ${btoa(r)}` : r;
}, ht = { bodySerializer: (e) => JSON.stringify(e, (t, r) => typeof r == "bigint" ? r.toString() : r) }, pt = (e) => {
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
}, dt = (e) => {
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
}, ft = (e) => {
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
}, Ee = ({ allowReserved: e, explode: t, name: r, style: o, value: n }) => {
  if (!t) {
    let a = (e ? n : n.map((l) => encodeURIComponent(l))).join(dt(o));
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
  let s = pt(o), i = n.map((a) => o === "label" || o === "simple" ? e ? a : encodeURIComponent(a) : J({ allowReserved: e, name: r, value: a })).join(s);
  return o === "label" || o === "matrix" ? s + i : i;
}, J = ({ allowReserved: e, name: t, value: r }) => {
  if (r == null) return "";
  if (typeof r == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${t}=${e ? r : encodeURIComponent(r)}`;
}, xe = ({ allowReserved: e, explode: t, name: r, style: o, value: n }) => {
  if (n instanceof Date) return `${r}=${n.toISOString()}`;
  if (o !== "deepObject" && !t) {
    let a = [];
    Object.entries(n).forEach(([A, c]) => {
      a = [...a, A, e ? c : encodeURIComponent(c)];
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
  let s = ft(o), i = Object.entries(n).map(([a, l]) => J({ allowReserved: e, name: o === "deepObject" ? `${r}[${a}]` : a, value: l })).join(s);
  return o === "label" || o === "matrix" ? s + i : i;
}, bt = /\{[^{}]+\}/g, mt = ({ path: e, url: t }) => {
  let r = t, o = t.match(bt);
  if (o) for (let n of o) {
    let s = !1, i = n.substring(1, n.length - 1), a = "simple";
    i.endsWith("*") && (s = !0, i = i.substring(0, i.length - 1)), i.startsWith(".") ? (i = i.substring(1), a = "label") : i.startsWith(";") && (i = i.substring(1), a = "matrix");
    let l = e[i];
    if (l == null) continue;
    if (Array.isArray(l)) {
      r = r.replace(n, Ee({ explode: s, name: i, style: a, value: l }));
      continue;
    }
    if (typeof l == "object") {
      r = r.replace(n, xe({ explode: s, name: i, style: a, value: l }));
      continue;
    }
    if (a === "matrix") {
      r = r.replace(n, `;${J({ name: i, value: l })}`);
      continue;
    }
    let A = encodeURIComponent(a === "label" ? `.${l}` : l);
    r = r.replace(n, A);
  }
  return r;
}, Ue = ({ allowReserved: e, array: t, object: r } = {}) => (o) => {
  let n = [];
  if (o && typeof o == "object") for (let s in o) {
    let i = o[s];
    if (i != null) {
      if (Array.isArray(i)) {
        n = [...n, Ee({ allowReserved: e, explode: !0, name: s, style: "form", value: i, ...t })];
        continue;
      }
      if (typeof i == "object") {
        n = [...n, xe({ allowReserved: e, explode: !0, name: s, style: "deepObject", value: i, ...r })];
        continue;
      }
      n = [...n, J({ allowReserved: e, name: s, value: i })];
    }
  }
  return n.join("&");
}, yt = (e) => {
  var r;
  if (!e) return "stream";
  let t = (r = e.split(";")[0]) == null ? void 0 : r.trim();
  if (t) {
    if (t.startsWith("application/json") || t.endsWith("+json")) return "json";
    if (t === "multipart/form-data") return "formData";
    if (["application/", "audio/", "image/", "video/"].some((o) => t.startsWith(o))) return "blob";
    if (t.startsWith("text/")) return "text";
  }
}, _t = async ({ security: e, ...t }) => {
  for (let r of e) {
    let o = await ut(r, t.auth);
    if (!o) continue;
    let n = r.name ?? "Authorization";
    switch (r.in) {
      case "query":
        t.query || (t.query = {}), t.query[n] = o;
        break;
      case "cookie":
        t.headers.append("Cookie", `${n}=${o}`);
        break;
      case "header":
      default:
        t.headers.set(n, o);
        break;
    }
    return;
  }
}, ke = (e) => kt({ baseUrl: e.baseUrl, path: e.path, query: e.query, querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : Ue(e.querySerializer), url: e.url }), kt = ({ baseUrl: e, path: t, query: r, querySerializer: o, url: n }) => {
  let s = n.startsWith("/") ? n : `/${n}`, i = (e ?? "") + s;
  t && (i = mt({ path: t, url: i }));
  let a = r ? o(r) : "";
  return a.startsWith("?") && (a = a.substring(1)), a && (i += `?${a}`), i;
}, ve = (e, t) => {
  var o;
  let r = { ...e, ...t };
  return (o = r.baseUrl) != null && o.endsWith("/") && (r.baseUrl = r.baseUrl.substring(0, r.baseUrl.length - 1)), r.headers = Ae(e.headers, t.headers), r;
}, Ae = (...e) => {
  let t = new Headers();
  for (let r of e) {
    if (!r || typeof r != "object") continue;
    let o = r instanceof Headers ? r.entries() : Object.entries(r);
    for (let [n, s] of o) if (s === null) t.delete(n);
    else if (Array.isArray(s)) for (let i of s) t.append(n, i);
    else s !== void 0 && t.set(n, typeof s == "object" ? JSON.stringify(s) : s);
  }
  return t;
}, Q = class {
  constructor() {
    me(this, "_fns");
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
}, vt = () => ({ error: new Q(), request: new Q(), response: new Q() }), wt = Ue({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), gt = { "Content-Type": "application/json" }, qe = (e = {}) => ({ ...ht, headers: gt, parseAs: "auto", querySerializer: wt, ...e }), Ct = (e = {}) => {
  let t = ve(qe(), e), r = () => ({ ...t }), o = (i) => (t = ve(t, i), r()), n = vt(), s = async (i) => {
    let a = { ...t, ...i, fetch: i.fetch ?? t.fetch ?? globalThis.fetch, headers: Ae(t.headers, i.headers) };
    a.security && await _t({ ...a, security: a.security }), a.body && a.bodySerializer && (a.body = a.bodySerializer(a.body)), (a.body === void 0 || a.body === "") && a.headers.delete("Content-Type");
    let l = ke(a), A = { redirect: "follow", ...a }, c = new Request(l, A);
    for (let C of n.request._fns) c = await C(c, a);
    let Qe = a.fetch, m = await Qe(c);
    for (let C of n.response._fns) m = await C(m, c, a);
    let j = { request: c, response: m };
    if (m.ok) {
      if (m.status === 204 || m.headers.get("Content-Length") === "0") return { data: {}, ...j };
      let C = (a.parseAs === "auto" ? yt(m.headers.get("Content-Type")) : a.parseAs) ?? "json";
      if (C === "stream") return { data: m.body, ...j };
      let W = await m[C]();
      return C === "json" && (a.responseValidator && await a.responseValidator(W), a.responseTransformer && (W = await a.responseTransformer(W))), { data: W, ...j };
    }
    let G = await m.text();
    try {
      G = JSON.parse(G);
    } catch {
    }
    let M = G;
    for (let C of n.error._fns) M = await C(G, m, c, a);
    if (M = M || {}, a.throwOnError) throw M;
    return { error: M, ...j };
  };
  return { buildUrl: ke, connect: (i) => s({ ...i, method: "CONNECT" }), delete: (i) => s({ ...i, method: "DELETE" }), get: (i) => s({ ...i, method: "GET" }), getConfig: r, head: (i) => s({ ...i, method: "HEAD" }), interceptors: n, options: (i) => s({ ...i, method: "OPTIONS" }), patch: (i) => s({ ...i, method: "PATCH" }), post: (i) => s({ ...i, method: "POST" }), put: (i) => s({ ...i, method: "PUT" }), request: s, setConfig: o, trace: (i) => s({ ...i, method: "TRACE" }) };
};
const V = Ct(qe({
  baseUrl: "http://localhost:26292",
  throwOnError: !0
}));
class Y {
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
var N;
class Tt {
  constructor(t) {
    P(this, N);
    B(this, N, t);
  }
  async getSettings() {
    return await F(p(this, N), Y.getSettings());
  }
}
N = new WeakMap();
var I;
class Oe extends we {
  constructor(r) {
    super(r);
    P(this, I);
    B(this, I, new Tt(r));
  }
  async getSettings() {
    const r = await p(this, I).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
I = new WeakMap();
const he = new st("BlockPreviewContext");
var Et = Object.defineProperty, xt = Object.getOwnPropertyDescriptor, Pe = (e) => {
  throw TypeError(e);
}, U = (e, t, r, o) => {
  for (var n = o > 1 ? void 0 : o ? xt(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (n = (o ? i(t, r, n) : i(n)) || n);
  return o && n && Et(t, r, n), n;
}, pe = (e, t, r) => t.has(e) || Pe("Cannot " + r), v = (e, t, r) => (pe(e, t, "read from private field"), t.get(e)), Z = (e, t, r) => t.has(e) ? Pe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Be = (e, t, r, o) => (pe(e, t, "write to private field"), t.set(e, r), r), T = (e, t, r) => (pe(e, t, "access private method"), r), d, z, y, De, $e, Le, Re, te, Se, Me, Ve;
const Ut = "block-grid-preview";
let b = class extends ce {
  constructor() {
    super(), Z(this, y), Z(this, d), Z(this, z), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(he, (e) => {
      Be(this, d, e), T(this, y, De).call(this);
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
      T(this, y, Me).call(this);
    }, 500));
  }
  _filterLayouts(e) {
    if (!e || e.length === 0)
      return [];
    const t = e.filter((o) => o.contentKey === this._blockContext.contentUdi);
    return t.length > 0 ? t : e.flatMap((o) => o.areas || []).flatMap((o) => (o == null ? void 0 : o.items) || []).filter((o) => o && o.contentKey === this._blockContext.contentUdi);
  }
  _handleClick(e) {
    var s;
    let t = !0;
    const r = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (r.filter((i) => i instanceof Element && o.includes(i.tagName)).length > 0) {
      const i = r.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      i != null && i instanceof Te && (s = i.href) != null && s.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    return this._isLoading ? L`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? L`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? L`
                ${this._styleElement}
                <a
                    href=${ae(this._blockContext.workspaceEditContentPath)} 
                    @click=${this._handleClick}
                    aria-label="Edit block"
                    role="button"
                >
                    ${le(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
d = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakSet();
De = function() {
  T(this, y, $e).call(this), T(this, y, Le).call(this), T(this, y, Re).call(this);
};
$e = function() {
  var e;
  this.observe((e = v(this, d)) == null ? void 0 : e.settings, (t) => {
    var r;
    (r = t == null ? void 0 : t.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockGrid.stylesheet);
  });
};
Le = function() {
  this.consumeContext(ue, (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
Re = async function() {
  this.getContext(Ce).then((e) => {
    e && (Be(this, z, e), this.observe(
      q([e.unique, e.contentTypeUnique]),
      async ([t, r]) => {
        var o, n;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = v(this, d)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (n = v(this, d)) == null || n.setDocumentTypeUnique(this._blockContext.documentTypeUnique), T(this, y, te).call(this);
      }
    ));
  }), v(this, z) == null && v(this, d) != null && this._blockContext.unique == "" && this.consumeContext(ge, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var r;
      this._blockContext.unique = ((r = v(this, d)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", T(this, y, te).call(this);
    });
  });
};
te = async function() {
  this.consumeContext(rt, async (e) => {
    e && this.observe(
      q([
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
        n,
        s
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = n ?? "", this._blockContext.contentElementTypeKey = s ?? "", await T(this, y, Se).call(this);
      }
    );
  });
};
Se = async function() {
  this.consumeContext(it, (e) => {
    e && this.observe(
      q([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([t, r, o, n, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockGridValue = {
          contentData: (t == null ? void 0 : t.filter((i) => i.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((i) => i.key == this._blockContext.settingsUdi)) ?? [],
          expose: (n == null ? void 0 : n.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: { "Umbraco.BlockGrid": this._filterLayouts(o) }
        }, this._blockContext.blockIndex = t.indexOf(this.blockGridValue.contentData[0]);
      }
    );
  });
};
Me = async function() {
  const e = this._blockContext;
  if (v(this, d) != null && e.unique == "" && (e.unique = v(this, d).getUnique()), v(this, d) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = v(this, d).getDocumentTypeUnique()), !T(this, y, Ve).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: r, error: o } = await F(this, Y.previewGridBlock({
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
    else if (oe.isUmbApiError(o)) {
      debugger;
      this._error = o.message, this._isLoading = !1;
    }
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
Ve = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
b.styles = [
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
U([
  u({ attribute: !1 })
], b.prototype, "content", 2);
U([
  u({ attribute: !1 })
], b.prototype, "settingsData", 2);
U([
  u({ attribute: !1 })
], b.prototype, "contentKey", 2);
U([
  u({ attribute: !1 })
], b.prototype, "config", 2);
U([
  x()
], b.prototype, "_htmlMarkup", 2);
U([
  x()
], b.prototype, "_isLoading", 2);
U([
  x()
], b.prototype, "_error", 2);
U([
  u({ attribute: !1 })
], b.prototype, "blockGridValue", 1);
b = U([
  se(Ut)
], b);
var At = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, Ne = (e) => {
  throw TypeError(e);
}, g = (e, t, r, o) => {
  for (var n = o > 1 ? void 0 : o ? qt(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (n = (o ? i(t, r, n) : i(n)) || n);
  return o && n && At(t, r, n), n;
}, de = (e, t, r) => t.has(e) || Ne("Cannot " + r), w = (e, t, r) => (de(e, t, "read from private field"), t.get(e)), ee = (e, t, r) => t.has(e) ? Ne("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ie = (e, t, r, o) => (de(e, t, "write to private field"), t.set(e, r), r), E = (e, t, r) => (de(e, t, "access private method"), r), f, X, _, Ke, je, Ge, We, re, ze, Xe, He;
const Ot = "block-list-preview";
let h = class extends ce {
  constructor() {
    super(), ee(this, _), ee(this, f), ee(this, X), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(he, (e) => {
      Ie(this, f, e), E(this, _, Ke).call(this);
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
      E(this, _, Xe).call(this);
    }, 500));
  }
  _handleClick(e) {
    var s;
    let t = !0;
    const r = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (r.filter((i) => i instanceof Element && o.includes(i.tagName)).length > 0) {
      const i = r.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      i != null && i instanceof Te && (s = i.href) != null && s.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    return this._isLoading ? L`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? L`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? L`
                ${this._styleElement}
                <a 
                    href=${ae(this._blockContext.workspaceEditContentPath)}
                    @click=${this._handleClick}
                    aria-label="Edit block"
                    role="button"
                >
                    ${le(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
f = /* @__PURE__ */ new WeakMap();
X = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakSet();
Ke = function() {
  E(this, _, je).call(this), E(this, _, Ge).call(this), E(this, _, We).call(this);
};
je = function() {
  var e;
  this.observe((e = w(this, f)) == null ? void 0 : e.settings, (t) => {
    var r;
    (r = t == null ? void 0 : t.blockList) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockList.stylesheet);
  });
};
Ge = function() {
  this.consumeContext(ue, async (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
We = function() {
  this.getContext(Ce).then((e) => {
    e && (Ie(this, X, e), this.observe(
      q([e.unique, e.contentTypeUnique]),
      async ([t, r]) => {
        var o, n;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = w(this, f)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (n = w(this, f)) == null || n.setDocumentTypeUnique(this._blockContext.documentTypeUnique), E(this, _, re).call(this);
      }
    ));
  }), w(this, X) == null && w(this, f) != null && this._blockContext.unique == "" && this.consumeContext(ge, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var r;
      this._blockContext.unique = ((r = w(this, f)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", E(this, _, re).call(this);
    });
  });
};
re = function() {
  this.consumeContext(at, (e) => {
    e && this.observe(
      q([
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
        n,
        s
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = n ?? "", this._blockContext.contentElementTypeKey = s ?? "", await E(this, _, ze).call(this);
      }
    );
  });
};
ze = function() {
  this.consumeContext(lt, (e) => {
    e && this.observe(
      q([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([t, r, o, n, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockListValue = {
          contentData: (t == null ? void 0 : t.filter((i) => i.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((i) => i.key == this._blockContext.settingsUdi)) ?? [],
          expose: (n == null ? void 0 : n.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockList": (o == null ? void 0 : o.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, this._blockContext.blockIndex = t == null ? void 0 : t.indexOf(this.blockListValue.contentData[0]);
      }
    );
  });
};
Xe = async function() {
  const e = this._blockContext;
  if (w(this, f) != null && e.unique == "" && (e.unique = w(this, f).getUnique()), w(this, f) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = w(this, f).getDocumentTypeUnique()), !E(this, _, He).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: r, error: o } = await F(this, Y.previewListBlock({
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
    r ? (this._htmlMarkup = r ?? "", this._isLoading = !1) : oe.isUmbApiError(o) && (this._error = o.message, this._isLoading = !1);
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
He = function(e) {
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
g([
  u({ attribute: !1 })
], h.prototype, "content", 2);
g([
  u({ attribute: !1 })
], h.prototype, "settingsData", 2);
g([
  u({ attribute: !1 })
], h.prototype, "contentKey", 2);
g([
  u({ attribute: !1 })
], h.prototype, "config", 2);
g([
  x()
], h.prototype, "_htmlMarkup", 2);
g([
  x()
], h.prototype, "_isLoading", 2);
g([
  x()
], h.prototype, "_error", 2);
g([
  x()
], h.prototype, "_blockListValue", 2);
g([
  u({ attribute: !1 })
], h.prototype, "blockListValue", 1);
h = g([
  se(Ot)
], h);
var Pt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, Fe = (e) => {
  throw TypeError(e);
}, O = (e, t, r, o) => {
  for (var n = o > 1 ? void 0 : o ? Bt(t, r) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (n = (o ? i(t, r, n) : i(n)) || n);
  return o && n && Pt(t, r, n), n;
}, Dt = (e, t, r) => t.has(e) || Fe("Cannot " + r), $t = (e, t, r) => t.has(e) ? Fe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), H = (e, t, r) => (Dt(e, t, "access private method"), r), R, Je, Ye, fe;
const Lt = "rich-text-preview";
let k = class extends ce {
  constructor() {
    var e;
    super(), $t(this, R), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(ue, async (t) => {
      t && (this.culture = t.getVariantId().culture ?? "");
    }), this.unique = (e = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : e[0], H(this, R, Je).call(this);
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
      H(this, R, fe).call(this);
    }, 500));
  }
  render() {
    if (this.htmlMarkup !== "")
      return L`
                <a href=${ae(this.workspaceEditContentPath)}>
                    ${le(this.htmlMarkup)}
                </a>`;
  }
};
R = /* @__PURE__ */ new WeakSet();
Je = function() {
  this.consumeContext(nt, (e) => {
    e && this.observe(
      q([e.alias, e.value]),
      async ([t, r]) => {
        this.blockEditorAlias = t, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), H(this, R, Ye).call(this));
      }
    );
  });
};
Ye = function() {
  this.consumeContext(ct, (e) => {
    e && this.observe(
      q([e.workspaceEditContentPath, e.contentElementTypeAlias]),
      async ([t, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = t, await H(this, R, fe).call(this);
      }
    );
  });
};
fe = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout) return;
  const { data: e, error: t } = await F(this, Y.previewRichTextMarkup({
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
  else if (oe.isUmbApiError(t))
    throw t;
};
k.styles = [
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
O([
  u({ attribute: !1 })
], k.prototype, "content", 2);
O([
  u({ attribute: !1 })
], k.prototype, "settingsData", 2);
O([
  u({ attribute: !1 })
], k.prototype, "contentKey", 2);
O([
  u({ attribute: !1 })
], k.prototype, "config", 2);
O([
  x()
], k.prototype, "htmlMarkup", 2);
O([
  x()
], k.prototype, "_blockRteValue", 2);
O([
  u({ attribute: !1 })
], k.prototype, "blockRteValue", 1);
k = O([
  se(Lt)
], k);
const Rt = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => Mt)
  }
], St = [...Rt];
var K, S, D, $;
class ie extends we {
  constructor(r) {
    super(r);
    P(this, K);
    P(this, S);
    P(this, D);
    P(this, $);
    B(this, S, new ot(void 0)), this.settings = p(this, S).asObservable(), B(this, D, new _e("")), this.unique = p(this, D).asObservable(), B(this, $, new _e("")), this.documentTypeUnique = p(this, $).asObservable(), B(this, K, new Oe(r)), this.getSettings();
  }
  async getSettings() {
    const r = await p(this, K).getSettings();
    p(this, S).setValue(r);
  }
  getUnique() {
    return p(this, D).getValue();
  }
  async setUnique(r) {
    r != "" && p(this, D).setValue(r);
  }
  getDocumentTypeUnique() {
    return p(this, $).getValue();
  }
  async setDocumentTypeUnique(r) {
    r != "" && p(this, $).setValue(r);
  }
}
K = new WeakMap(), S = new WeakMap(), D = new WeakMap(), $ = new WeakMap();
const Mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: ie,
  default: ie
}, Symbol.toStringTag, { value: "Module" })), er = async (e, t) => {
  e.consumeContext(tt, async (r) => {
    var a, l, A;
    if (!r) return;
    const o = r.getOpenApiConfiguration();
    V.setConfig({
      auth: () => r.getLatestToken(),
      baseUrl: o.base,
      credentials: o.credentials
    });
    const s = await new Oe(e).getSettings();
    let i = [];
    if (s) {
      if (s.blockGrid.enabled) {
        let c = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.GridCustomView",
          name: "BlockPreview Grid Custom View",
          element: b,
          forBlockEditor: "block-grid"
        };
        ((a = s.blockGrid.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = s.blockGrid.contentTypes), i.push(c);
      }
      if (s.blockList.enabled) {
        let c = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.ListCustomView",
          name: "BlockPreview List Custom View",
          element: h,
          forBlockEditor: "block-list"
        };
        ((l = s.blockList.contentTypes) == null ? void 0 : l.length) !== 0 && (c.forContentTypeAlias = s.blockList.contentTypes), i.push(c);
      }
      if (s.richText.enabled) {
        let c = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.RichTextCustomView",
          name: "BlockPreview Rich Text Custom View",
          element: k,
          forBlockEditor: "block-rte"
        };
        ((A = s.richText.contentTypes) == null ? void 0 : A.length) !== 0 && (c.forContentTypeAlias = s.richText.contentTypes), i.push(c);
      }
    }
    t.registerMany([
      ...i,
      ...St
    ]), e.provideContext(he, new ie(e));
  });
};
export {
  b as BlockGridPreviewCustomView,
  h as BlockListPreviewCustomView,
  k as RichTextPreviewCustomView,
  Tt as SettingsDataSource,
  Oe as SettingsRepository,
  er as onInit
};
//# sourceMappingURL=assets.js.map
