var Qe = Object.defineProperty;
var ye = (e) => {
  throw TypeError(e);
};
var Ze = (e, t, r) => t in e ? Qe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var me = (e, t, r) => Ze(e, typeof t != "symbol" ? t + "" : t, r), _e = (e, t, r) => t.has(e) || ye("Cannot " + r);
var p = (e, t, r) => (_e(e, t, "read from private field"), r ? r.call(e) : t.get(e)), P = (e, t, r) => t.has(e) ? ye("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), $ = (e, t, r, o) => (_e(e, t, "write to private field"), o ? o.call(e, r) : t.set(e, r), r);
import { UMB_AUTH_CONTEXT as et } from "@umbraco-cms/backoffice/auth";
import { tryExecute as H, UmbApiError as oe } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as ge } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_WORKSPACE_CONTEXT as Ce } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as tt, UMB_BLOCK_GRID_MANAGER_CONTEXT as rt } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Te } from "@umbraco-cms/backoffice/document";
import { css as se, property as u, state as E, customElement as ne, html as S, ifDefined as ae, unsafeHTML as le } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ce } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as A, UmbObjectState as it, UmbStringState as ke } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as ue, UMB_PROPERTY_CONTEXT as ot } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as st } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as nt, UMB_BLOCK_LIST_MANAGER_CONTEXT as at } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as lt } from "@umbraco-cms/backoffice/block-rte";
var ct = async (e, t) => {
  let r = typeof t == "function" ? await t(e) : t;
  if (r) return e.scheme === "bearer" ? `Bearer ${r}` : e.scheme === "basic" ? `Basic ${btoa(r)}` : r;
}, ut = { bodySerializer: (e) => JSON.stringify(e, (t, r) => typeof r == "bigint" ? r.toString() : r) }, ht = (e) => {
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
}, pt = (e) => {
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
}, dt = (e) => {
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
}, xe = ({ allowReserved: e, explode: t, name: r, style: o, value: s }) => {
  if (!t) {
    let a = (e ? s : s.map((l) => encodeURIComponent(l))).join(pt(o));
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
  let n = ht(o), i = s.map((a) => o === "label" || o === "simple" ? e ? a : encodeURIComponent(a) : J({ allowReserved: e, name: r, value: a })).join(n);
  return o === "label" || o === "matrix" ? n + i : i;
}, J = ({ allowReserved: e, name: t, value: r }) => {
  if (r == null) return "";
  if (typeof r == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${t}=${e ? r : encodeURIComponent(r)}`;
}, Ee = ({ allowReserved: e, explode: t, name: r, style: o, value: s }) => {
  if (s instanceof Date) return `${r}=${s.toISOString()}`;
  if (o !== "deepObject" && !t) {
    let a = [];
    Object.entries(s).forEach(([q, c]) => {
      a = [...a, q, e ? c : encodeURIComponent(c)];
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
  let n = dt(o), i = Object.entries(s).map(([a, l]) => J({ allowReserved: e, name: o === "deepObject" ? `${r}[${a}]` : a, value: l })).join(n);
  return o === "label" || o === "matrix" ? n + i : i;
}, ft = /\{[^{}]+\}/g, bt = ({ path: e, url: t }) => {
  let r = t, o = t.match(ft);
  if (o) for (let s of o) {
    let n = !1, i = s.substring(1, s.length - 1), a = "simple";
    i.endsWith("*") && (n = !0, i = i.substring(0, i.length - 1)), i.startsWith(".") ? (i = i.substring(1), a = "label") : i.startsWith(";") && (i = i.substring(1), a = "matrix");
    let l = e[i];
    if (l == null) continue;
    if (Array.isArray(l)) {
      r = r.replace(s, xe({ explode: n, name: i, style: a, value: l }));
      continue;
    }
    if (typeof l == "object") {
      r = r.replace(s, Ee({ explode: n, name: i, style: a, value: l }));
      continue;
    }
    if (a === "matrix") {
      r = r.replace(s, `;${J({ name: i, value: l })}`);
      continue;
    }
    let q = encodeURIComponent(a === "label" ? `.${l}` : l);
    r = r.replace(s, q);
  }
  return r;
}, Ue = ({ allowReserved: e, array: t, object: r } = {}) => (o) => {
  let s = [];
  if (o && typeof o == "object") for (let n in o) {
    let i = o[n];
    if (i != null) {
      if (Array.isArray(i)) {
        s = [...s, xe({ allowReserved: e, explode: !0, name: n, style: "form", value: i, ...t })];
        continue;
      }
      if (typeof i == "object") {
        s = [...s, Ee({ allowReserved: e, explode: !0, name: n, style: "deepObject", value: i, ...r })];
        continue;
      }
      s = [...s, J({ allowReserved: e, name: n, value: i })];
    }
  }
  return s.join("&");
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
}, mt = async ({ security: e, ...t }) => {
  for (let r of e) {
    let o = await ct(r, t.auth);
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
}, ve = (e) => _t({ baseUrl: e.baseUrl, path: e.path, query: e.query, querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : Ue(e.querySerializer), url: e.url }), _t = ({ baseUrl: e, path: t, query: r, querySerializer: o, url: s }) => {
  let n = s.startsWith("/") ? s : `/${s}`, i = (e ?? "") + n;
  t && (i = bt({ path: t, url: i }));
  let a = r ? o(r) : "";
  return a.startsWith("?") && (a = a.substring(1)), a && (i += `?${a}`), i;
}, we = (e, t) => {
  var o;
  let r = { ...e, ...t };
  return (o = r.baseUrl) != null && o.endsWith("/") && (r.baseUrl = r.baseUrl.substring(0, r.baseUrl.length - 1)), r.headers = qe(e.headers, t.headers), r;
}, qe = (...e) => {
  let t = new Headers();
  for (let r of e) {
    if (!r || typeof r != "object") continue;
    let o = r instanceof Headers ? r.entries() : Object.entries(r);
    for (let [s, n] of o) if (n === null) t.delete(s);
    else if (Array.isArray(n)) for (let i of n) t.append(s, i);
    else n !== void 0 && t.set(s, typeof n == "object" ? JSON.stringify(n) : n);
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
}, kt = () => ({ error: new Q(), request: new Q(), response: new Q() }), vt = Ue({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), wt = { "Content-Type": "application/json" }, Ae = (e = {}) => ({ ...ut, headers: wt, parseAs: "auto", querySerializer: vt, ...e }), gt = (e = {}) => {
  let t = we(Ae(), e), r = () => ({ ...t }), o = (i) => (t = we(t, i), r()), s = kt(), n = async (i) => {
    let a = { ...t, ...i, fetch: i.fetch ?? t.fetch ?? globalThis.fetch, headers: qe(t.headers, i.headers) };
    a.security && await mt({ ...a, security: a.security }), a.body && a.bodySerializer && (a.body = a.bodySerializer(a.body)), (a.body === void 0 || a.body === "") && a.headers.delete("Content-Type");
    let l = ve(a), q = { redirect: "follow", ...a }, c = new Request(l, q);
    for (let T of s.request._fns) c = await T(c, a);
    let Ye = a.fetch, m = await Ye(c);
    for (let T of s.response._fns) m = await T(m, c, a);
    let K = { request: c, response: m };
    if (m.ok) {
      if (m.status === 204 || m.headers.get("Content-Length") === "0") return { data: {}, ...K };
      let T = (a.parseAs === "auto" ? yt(m.headers.get("Content-Type")) : a.parseAs) ?? "json";
      if (T === "stream") return { data: m.body, ...K };
      let I = await m[T]();
      return T === "json" && (a.responseValidator && await a.responseValidator(I), a.responseTransformer && (I = await a.responseTransformer(I))), { data: I, ...K };
    }
    let W = await m.text();
    try {
      W = JSON.parse(W);
    } catch {
    }
    let V = W;
    for (let T of s.error._fns) V = await T(W, m, c, a);
    if (V = V || {}, a.throwOnError) throw V;
    return { error: V, ...K };
  };
  return { buildUrl: ve, connect: (i) => n({ ...i, method: "CONNECT" }), delete: (i) => n({ ...i, method: "DELETE" }), get: (i) => n({ ...i, method: "GET" }), getConfig: r, head: (i) => n({ ...i, method: "HEAD" }), interceptors: s, options: (i) => n({ ...i, method: "OPTIONS" }), patch: (i) => n({ ...i, method: "PATCH" }), post: (i) => n({ ...i, method: "POST" }), put: (i) => n({ ...i, method: "PUT" }), request: n, setConfig: o, trace: (i) => n({ ...i, method: "TRACE" }) };
};
const M = gt(Ae({
  baseUrl: "http://localhost:26292",
  throwOnError: !0
}));
class Y {
  static previewGridBlock(t) {
    return ((t == null ? void 0 : t.client) ?? M).post({
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
    return ((t == null ? void 0 : t.client) ?? M).post({
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
    return ((t == null ? void 0 : t.client) ?? M).post({
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
    return ((t == null ? void 0 : t.client) ?? M).get({
      url: "/umbraco/management/api/v1/block-preview/settings",
      ...t
    });
  }
}
var j;
class Ct {
  constructor(t) {
    P(this, j);
    $(this, j, t);
  }
  async getSettings() {
    return await H(p(this, j), Y.getSettings());
  }
}
j = new WeakMap();
var N;
class Oe extends ge {
  constructor(r) {
    super(r);
    P(this, N);
    $(this, N, new Ct(r));
  }
  async getSettings() {
    const r = await p(this, N).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
N = new WeakMap();
const he = new st("BlockPreviewContext");
var Tt = Object.defineProperty, xt = Object.getOwnPropertyDescriptor, Pe = (e) => {
  throw TypeError(e);
}, U = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? xt(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (s = (o ? i(t, r, s) : i(s)) || s);
  return o && s && Tt(t, r, s), s;
}, pe = (e, t, r) => t.has(e) || Pe("Cannot " + r), v = (e, t, r) => (pe(e, t, "read from private field"), t.get(e)), Z = (e, t, r) => t.has(e) ? Pe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), $e = (e, t, r, o) => (pe(e, t, "write to private field"), t.set(e, r), r), x = (e, t, r) => (pe(e, t, "access private method"), r), d, z, _, De, Be, Se, Re, te, Le, Ve, Me;
const Et = "block-grid-preview";
let y = class extends ce {
  constructor() {
    super(), Z(this, _), Z(this, d), Z(this, z), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
      $e(this, d, e), x(this, _, De).call(this);
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
      x(this, _, Ve).call(this);
    }, 500));
  }
  render() {
    return this._isLoading ? S`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? S`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? S`
                ${this._styleElement}
                <a 
                    href=${ae(this._blockContext.workspaceEditContentPath)} 
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
_ = /* @__PURE__ */ new WeakSet();
De = function() {
  x(this, _, Be).call(this), x(this, _, Se).call(this), x(this, _, Re).call(this);
};
Be = function() {
  var e;
  this.observe((e = v(this, d)) == null ? void 0 : e.settings, (t) => {
    var r;
    (r = t == null ? void 0 : t.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockGrid.stylesheet);
  });
};
Se = function() {
  this.consumeContext(ue, (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
Re = async function() {
  this.getContext(Te).then((e) => {
    e && ($e(this, z, e), this.observe(
      A([e.unique, e.contentTypeUnique]),
      async ([t, r]) => {
        var o, s;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = v(this, d)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (s = v(this, d)) == null || s.setDocumentTypeUnique(this._blockContext.documentTypeUnique), x(this, _, te).call(this);
      }
    ));
  }), v(this, z) == null && v(this, d) != null && this._blockContext.unique == "" && this.consumeContext(Ce, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var r;
      this._blockContext.unique = ((r = v(this, d)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", x(this, _, te).call(this);
    });
  });
};
te = async function() {
  this.consumeContext(tt, async (e) => {
    e && this.observe(
      A([
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
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = s ?? "", this._blockContext.contentElementTypeKey = n ?? "", await x(this, _, Le).call(this);
      }
    );
  });
};
Le = async function() {
  this.consumeContext(rt, (e) => {
    e && this.observe(
      A([
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
          layout: {
            "Umbraco.BlockGrid": (o == null ? void 0 : o.filter((i) => i.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, this._blockContext.blockIndex = t.indexOf(this.blockGridValue.contentData[0]);
      }
    );
  });
};
Ve = async function() {
  const e = this._blockContext;
  if (v(this, d) != null && e.unique == "" && (e.unique = v(this, d).getUnique()), v(this, d) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = v(this, d).getDocumentTypeUnique()), !x(this, _, Me).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: r, error: o } = await H(this, Y.previewGridBlock({
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
Me = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
y.styles = [
  se`
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
], y.prototype, "content", 2);
U([
  u({ attribute: !1 })
], y.prototype, "settingsData", 2);
U([
  u({ attribute: !1 })
], y.prototype, "contentKey", 2);
U([
  u({ attribute: !1 })
], y.prototype, "config", 2);
U([
  E()
], y.prototype, "_htmlMarkup", 2);
U([
  E()
], y.prototype, "_isLoading", 2);
U([
  E()
], y.prototype, "_error", 2);
U([
  u({ attribute: !1 })
], y.prototype, "blockGridValue", 1);
y = U([
  ne(Et)
], y);
var Ut = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, je = (e) => {
  throw TypeError(e);
}, C = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? qt(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (s = (o ? i(t, r, s) : i(s)) || s);
  return o && s && Ut(t, r, s), s;
}, de = (e, t, r) => t.has(e) || je("Cannot " + r), w = (e, t, r) => (de(e, t, "read from private field"), t.get(e)), ee = (e, t, r) => t.has(e) ? je("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ne = (e, t, r, o) => (de(e, t, "write to private field"), t.set(e, r), r), g = (e, t, r) => (de(e, t, "access private method"), r), f, X, b, Ge, Ke, We, Ie, re, ze, fe, Xe;
const At = "block-list-preview";
let h = class extends ce {
  constructor() {
    super(), ee(this, b), ee(this, f), ee(this, X), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
      Ne(this, f, e), g(this, b, Ge).call(this);
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
      g(this, b, fe).call(this);
    }, 500));
  }
  render() {
    return this._isLoading ? S`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? S`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? S`
                ${this._styleElement}
                <a 
                    href=${ae(this._blockContext.workspaceEditContentPath)} 
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
b = /* @__PURE__ */ new WeakSet();
Ge = function() {
  g(this, b, Ke).call(this), g(this, b, We).call(this), g(this, b, Ie).call(this);
};
Ke = function() {
  var e;
  this.observe((e = w(this, f)) == null ? void 0 : e.settings, (t) => {
    var r;
    (r = t == null ? void 0 : t.blockList) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockList.stylesheet);
  });
};
We = function() {
  this.consumeContext(ue, async (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
Ie = function() {
  this.getContext(Te).then((e) => {
    e && (Ne(this, X, e), this.observe(
      A([e.unique, e.contentTypeUnique]),
      async ([t, r]) => {
        var o, s;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = w(this, f)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (s = w(this, f)) == null || s.setDocumentTypeUnique(this._blockContext.documentTypeUnique), g(this, b, re).call(this);
      }
    ));
  }), w(this, X) == null && w(this, f) != null && this._blockContext.unique == "" && this.consumeContext(Ce, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var r;
      this._blockContext.unique = ((r = w(this, f)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", g(this, b, re).call(this);
    });
  });
};
re = function() {
  this.consumeContext(nt, (e) => {
    e && this.observe(
      A([
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
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = s ?? "", this._blockContext.contentElementTypeKey = n ?? "", await g(this, b, ze).call(this);
      }
    );
  });
};
ze = function() {
  this.consumeContext(at, (e) => {
    e && this.observe(
      A([
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
        }, this._blockContext.blockIndex = t == null ? void 0 : t.indexOf(this.blockListValue.contentData[0]), g(this, b, fe).call(this);
      }
    );
  });
};
fe = async function() {
  const e = this._blockContext;
  if (w(this, f) != null && e.unique == "" && (e.unique = w(this, f).getUnique()), w(this, f) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = w(this, f).getDocumentTypeUnique()), !g(this, b, Xe).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: r, error: o } = await H(this, Y.previewListBlock({
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
Xe = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
h.styles = [
  se`
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
C([
  u({ attribute: !1 })
], h.prototype, "content", 2);
C([
  u({ attribute: !1 })
], h.prototype, "settingsData", 2);
C([
  u({ attribute: !1 })
], h.prototype, "contentKey", 2);
C([
  u({ attribute: !1 })
], h.prototype, "config", 2);
C([
  E()
], h.prototype, "_htmlMarkup", 2);
C([
  E()
], h.prototype, "_isLoading", 2);
C([
  E()
], h.prototype, "_error", 2);
C([
  E()
], h.prototype, "_blockListValue", 2);
C([
  u({ attribute: !1 })
], h.prototype, "blockListValue", 1);
h = C([
  ne(At)
], h);
var Ot = Object.defineProperty, Pt = Object.getOwnPropertyDescriptor, Fe = (e) => {
  throw TypeError(e);
}, O = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? Pt(t, r) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (s = (o ? i(t, r, s) : i(s)) || s);
  return o && s && Ot(t, r, s), s;
}, $t = (e, t, r) => t.has(e) || Fe("Cannot " + r), Dt = (e, t, r) => t.has(e) ? Fe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), F = (e, t, r) => ($t(e, t, "access private method"), r), R, He, Je, be;
const Bt = "rich-text-preview";
let k = class extends ce {
  constructor() {
    var e;
    super(), Dt(this, R), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(ue, async (t) => {
      t && (this.culture = t.getVariantId().culture ?? "");
    }), this.unique = (e = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : e[0], F(this, R, He).call(this);
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
      F(this, R, be).call(this);
    }, 500));
  }
  render() {
    if (this.htmlMarkup !== "")
      return S`
                <a href=${ae(this.workspaceEditContentPath)}>
                    ${le(this.htmlMarkup)}
                </a>`;
  }
};
R = /* @__PURE__ */ new WeakSet();
He = function() {
  this.consumeContext(ot, (e) => {
    e && this.observe(
      A([e.alias, e.value]),
      async ([t, r]) => {
        this.blockEditorAlias = t, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), F(this, R, Je).call(this));
      }
    );
  });
};
Je = function() {
  this.consumeContext(lt, (e) => {
    e && this.observe(
      A([e.workspaceEditContentPath, e.contentElementTypeAlias]),
      async ([t, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = t, await F(this, R, be).call(this);
      }
    );
  });
};
be = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout) return;
  const { data: e, error: t } = await H(this, Y.previewRichTextMarkup({
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
  se`
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
  E()
], k.prototype, "htmlMarkup", 2);
O([
  E()
], k.prototype, "_blockRteValue", 2);
O([
  u({ attribute: !1 })
], k.prototype, "blockRteValue", 1);
k = O([
  ne(Bt)
], k);
const St = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => Lt)
  }
], Rt = [...St];
var G, L, D, B;
class ie extends ge {
  constructor(r) {
    super(r);
    P(this, G);
    P(this, L);
    P(this, D);
    P(this, B);
    $(this, L, new it(void 0)), this.settings = p(this, L).asObservable(), $(this, D, new ke("")), this.unique = p(this, D).asObservable(), $(this, B, new ke("")), this.documentTypeUnique = p(this, B).asObservable(), $(this, G, new Oe(r)), this.getSettings();
  }
  async getSettings() {
    const r = await p(this, G).getSettings();
    p(this, L).setValue(r);
  }
  getUnique() {
    return p(this, D).getValue();
  }
  async setUnique(r) {
    r != "" && p(this, D).setValue(r);
  }
  getDocumentTypeUnique() {
    return p(this, B).getValue();
  }
  async setDocumentTypeUnique(r) {
    r != "" && p(this, B).setValue(r);
  }
}
G = new WeakMap(), L = new WeakMap(), D = new WeakMap(), B = new WeakMap();
const Lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: ie,
  default: ie
}, Symbol.toStringTag, { value: "Module" })), Qt = async (e, t) => {
  e.consumeContext(et, async (r) => {
    var a, l, q;
    if (!r) return;
    const o = r.getOpenApiConfiguration();
    M.setConfig({
      auth: () => r.getLatestToken(),
      baseUrl: o.base,
      credentials: o.credentials
    });
    const n = await new Oe(e).getSettings();
    let i = [];
    if (n) {
      if (n.blockGrid.enabled) {
        let c = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.GridCustomView",
          name: "BlockPreview Grid Custom View",
          element: y,
          forBlockEditor: "block-grid"
        };
        ((a = n.blockGrid.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = n.blockGrid.contentTypes), i.push(c);
      }
      if (n.blockList.enabled) {
        let c = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.ListCustomView",
          name: "BlockPreview List Custom View",
          element: h,
          forBlockEditor: "block-list"
        };
        ((l = n.blockList.contentTypes) == null ? void 0 : l.length) !== 0 && (c.forContentTypeAlias = n.blockList.contentTypes), i.push(c);
      }
      if (n.richText.enabled) {
        let c = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.RichTextCustomView",
          name: "BlockPreview Rich Text Custom View",
          element: k,
          forBlockEditor: "block-rte"
        };
        ((q = n.richText.contentTypes) == null ? void 0 : q.length) !== 0 && (c.forContentTypeAlias = n.richText.contentTypes), i.push(c);
      }
    }
    t.registerMany([
      ...i,
      ...Rt
    ]), e.provideContext(he, new ie(e));
  });
};
export {
  y as BlockGridPreviewCustomView,
  h as BlockListPreviewCustomView,
  k as RichTextPreviewCustomView,
  Ct as SettingsDataSource,
  Oe as SettingsRepository,
  Qt as onInit
};
//# sourceMappingURL=assets.js.map
