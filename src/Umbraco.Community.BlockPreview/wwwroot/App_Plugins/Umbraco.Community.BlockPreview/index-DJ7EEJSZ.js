var bt = Object.defineProperty;
var Ee = (e) => {
  throw TypeError(e);
};
var _t = (e, t, i) => t in e ? bt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var Ue = (e, t, i) => _t(e, typeof t != "symbol" ? t + "" : t, i), xe = (e, t, i) => t.has(e) || Ee("Cannot " + i);
var d = (e, t, i) => (xe(e, t, "read from private field"), i ? i.call(e) : t.get(e)), L = (e, t, i) => t.has(e) ? Ee("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), D = (e, t, i, o) => (xe(e, t, "write to private field"), o ? o.call(e, i) : t.set(e, i), i);
import { UMB_AUTH_CONTEXT as mt } from "@umbraco-cms/backoffice/auth";
import { UMB_BLOCK_WORKSPACE_CONTEXT as pe } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as yt, UMB_BLOCK_GRID_MANAGER_CONTEXT as kt, UMB_BLOCK_GRID_PROPERTY_EDITOR_UI_ALIAS as vt } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as de } from "@umbraco-cms/backoffice/document";
import { css as fe, property as c, state as y, customElement as be, html as x, ifDefined as _e, unsafeHTML as me } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ye } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as M, UmbObjectState as wt, UmbStringState as Ae, UmbBooleanState as gt } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as ke, UMB_WRITABLE_PROPERTY_CONDITION_ALIAS as Oe } from "@umbraco-cms/backoffice/property";
import { tryExecute as Z, UmbApiError as ve } from "@umbraco-cms/backoffice/resources";
import { UmbContextToken as Ct } from "@umbraco-cms/backoffice/context-api";
import { UUIButtonElement as we } from "@umbraco-cms/backoffice/external/uui";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as Tt, UMB_BLOCK_LIST_MANAGER_CONTEXT as Et, UMB_BLOCK_LIST_PROPERTY_EDITOR_UI_ALIAS as Ut } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as xt, UMB_BLOCK_RTE_MANAGER_CONTEXT as At } from "@umbraco-cms/backoffice/block-rte";
import { UmbControllerBase as Pe } from "@umbraco-cms/backoffice/class-api";
import { UMB_PROPERTY_ACTION_DEFAULT_KIND_MANIFEST as Ot } from "@umbraco-cms/backoffice/property-action";
var $t = async (e, t) => {
  let i = typeof t == "function" ? await t(e) : t;
  if (i) return e.scheme === "bearer" ? `Bearer ${i}` : e.scheme === "basic" ? `Basic ${btoa(i)}` : i;
}, qt = { bodySerializer: (e) => JSON.stringify(e, (t, i) => typeof i == "bigint" ? i.toString() : i) }, Pt = (e) => {
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
}, Bt = (e) => {
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
}, Mt = (e) => {
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
}, Be = ({ allowReserved: e, explode: t, name: i, style: o, value: n }) => {
  if (!t) {
    let a = (e ? n : n.map((l) => encodeURIComponent(l))).join(Bt(o));
    switch (o) {
      case "label":
        return `.${a}`;
      case "matrix":
        return `;${i}=${a}`;
      case "simple":
        return a;
      default:
        return `${i}=${a}`;
    }
  }
  let s = Pt(o), r = n.map((a) => o === "label" || o === "simple" ? e ? a : encodeURIComponent(a) : ee({ allowReserved: e, name: i, value: a })).join(s);
  return o === "label" || o === "matrix" ? s + r : r;
}, ee = ({ allowReserved: e, name: t, value: i }) => {
  if (i == null) return "";
  if (typeof i == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${t}=${e ? i : encodeURIComponent(i)}`;
}, Me = ({ allowReserved: e, explode: t, name: i, style: o, value: n }) => {
  if (n instanceof Date) return `${i}=${n.toISOString()}`;
  if (o !== "deepObject" && !t) {
    let a = [];
    Object.entries(n).forEach(([S, u]) => {
      a = [...a, S, e ? u : encodeURIComponent(u)];
    });
    let l = a.join(",");
    switch (o) {
      case "form":
        return `${i}=${l}`;
      case "label":
        return `.${l}`;
      case "matrix":
        return `;${i}=${l}`;
      default:
        return l;
    }
  }
  let s = Mt(o), r = Object.entries(n).map(([a, l]) => ee({ allowReserved: e, name: o === "deepObject" ? `${i}[${a}]` : a, value: l })).join(s);
  return o === "label" || o === "matrix" ? s + r : r;
}, St = /\{[^{}]+\}/g, Lt = ({ path: e, url: t }) => {
  let i = t, o = t.match(St);
  if (o) for (let n of o) {
    let s = !1, r = n.substring(1, n.length - 1), a = "simple";
    r.endsWith("*") && (s = !0, r = r.substring(0, r.length - 1)), r.startsWith(".") ? (r = r.substring(1), a = "label") : r.startsWith(";") && (r = r.substring(1), a = "matrix");
    let l = e[r];
    if (l == null) continue;
    if (Array.isArray(l)) {
      i = i.replace(n, Be({ explode: s, name: r, style: a, value: l }));
      continue;
    }
    if (typeof l == "object") {
      i = i.replace(n, Me({ explode: s, name: r, style: a, value: l }));
      continue;
    }
    if (a === "matrix") {
      i = i.replace(n, `;${ee({ name: r, value: l })}`);
      continue;
    }
    let S = encodeURIComponent(a === "label" ? `.${l}` : l);
    i = i.replace(n, S);
  }
  return i;
}, Se = ({ allowReserved: e, array: t, object: i } = {}) => (o) => {
  let n = [];
  if (o && typeof o == "object") for (let s in o) {
    let r = o[s];
    if (r != null) if (Array.isArray(r)) {
      let a = Be({ allowReserved: e, explode: !0, name: s, style: "form", value: r, ...t });
      a && n.push(a);
    } else if (typeof r == "object") {
      let a = Me({ allowReserved: e, explode: !0, name: s, style: "deepObject", value: r, ...i });
      a && n.push(a);
    } else {
      let a = ee({ allowReserved: e, name: s, value: r });
      a && n.push(a);
    }
  }
  return n.join("&");
}, Dt = (e) => {
  var i;
  if (!e) return "stream";
  let t = (i = e.split(";")[0]) == null ? void 0 : i.trim();
  if (t) {
    if (t.startsWith("application/json") || t.endsWith("+json")) return "json";
    if (t === "multipart/form-data") return "formData";
    if (["application/", "audio/", "image/", "video/"].some((o) => t.startsWith(o))) return "blob";
    if (t.startsWith("text/")) return "text";
  }
}, Rt = async ({ security: e, ...t }) => {
  for (let i of e) {
    let o = await $t(i, t.auth);
    if (!o) continue;
    let n = i.name ?? "Authorization";
    switch (i.in) {
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
}, $e = (e) => It({ baseUrl: e.baseUrl, path: e.path, query: e.query, querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : Se(e.querySerializer), url: e.url }), It = ({ baseUrl: e, path: t, query: i, querySerializer: o, url: n }) => {
  let s = n.startsWith("/") ? n : `/${n}`, r = (e ?? "") + s;
  t && (r = Lt({ path: t, url: r }));
  let a = i ? o(i) : "";
  return a.startsWith("?") && (a = a.substring(1)), a && (r += `?${a}`), r;
}, qe = (e, t) => {
  var o;
  let i = { ...e, ...t };
  return (o = i.baseUrl) != null && o.endsWith("/") && (i.baseUrl = i.baseUrl.substring(0, i.baseUrl.length - 1)), i.headers = Le(e.headers, t.headers), i;
}, Le = (...e) => {
  let t = new Headers();
  for (let i of e) {
    if (!i || typeof i != "object") continue;
    let o = i instanceof Headers ? i.entries() : Object.entries(i);
    for (let [n, s] of o) if (s === null) t.delete(n);
    else if (Array.isArray(s)) for (let r of s) t.append(n, r);
    else s !== void 0 && t.set(n, typeof s == "object" ? JSON.stringify(s) : s);
  }
  return t;
}, re = class {
  constructor() {
    Ue(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  getInterceptorIndex(e) {
    return typeof e == "number" ? this._fns[e] ? e : -1 : this._fns.indexOf(e);
  }
  exists(e) {
    let t = this.getInterceptorIndex(e);
    return !!this._fns[t];
  }
  eject(e) {
    let t = this.getInterceptorIndex(e);
    this._fns[t] && (this._fns[t] = null);
  }
  update(e, t) {
    let i = this.getInterceptorIndex(e);
    return this._fns[i] ? (this._fns[i] = t, e) : !1;
  }
  use(e) {
    return this._fns = [...this._fns, e], this._fns.length - 1;
  }
}, Nt = () => ({ error: new re(), request: new re(), response: new re() }), Vt = Se({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), Kt = { "Content-Type": "application/json" }, De = (e = {}) => ({ ...qt, headers: Kt, parseAs: "auto", querySerializer: Vt, ...e }), Gt = (e = {}) => {
  let t = qe(De(), e), i = () => ({ ...t }), o = (r) => (t = qe(t, r), i()), n = Nt(), s = async (r) => {
    let a = { ...t, ...r, fetch: r.fetch ?? t.fetch ?? globalThis.fetch, headers: Le(t.headers, r.headers) };
    a.security && await Rt({ ...a, security: a.security }), a.body && a.bodySerializer && (a.body = a.bodySerializer(a.body)), (a.body === void 0 || a.body === "") && a.headers.delete("Content-Type");
    let l = $e(a), S = { redirect: "follow", ...a }, u = new Request(l, S);
    for (let w of n.request._fns) w && (u = await w(u, a));
    let ft = a.fetch, v = await ft(u);
    for (let w of n.response._fns) w && (v = await w(v, u, a));
    let H = { request: u, response: v };
    if (v.ok) {
      if (v.status === 204 || v.headers.get("Content-Length") === "0") return a.responseStyle === "data" ? {} : { data: {}, ...H };
      let w = (a.parseAs === "auto" ? Dt(v.headers.get("Content-Type")) : a.parseAs) ?? "json";
      if (w === "stream") return a.responseStyle === "data" ? v.body : { data: v.body, ...H };
      let G = await v[w]();
      return w === "json" && (a.responseValidator && await a.responseValidator(G), a.responseTransformer && (G = await a.responseTransformer(G))), a.responseStyle === "data" ? G : { data: G, ...H };
    }
    let Y = await v.text();
    try {
      Y = JSON.parse(Y);
    } catch {
    }
    let K = Y;
    for (let w of n.error._fns) w && (K = await w(Y, v, u, a));
    if (K = K || {}, a.throwOnError) throw K;
    return a.responseStyle === "data" ? void 0 : { error: K, ...H };
  };
  return { buildUrl: $e, connect: (r) => s({ ...r, method: "CONNECT" }), delete: (r) => s({ ...r, method: "DELETE" }), get: (r) => s({ ...r, method: "GET" }), getConfig: i, head: (r) => s({ ...r, method: "HEAD" }), interceptors: n, options: (r) => s({ ...r, method: "OPTIONS" }), patch: (r) => s({ ...r, method: "PATCH" }), post: (r) => s({ ...r, method: "POST" }), put: (r) => s({ ...r, method: "PUT" }), request: s, setConfig: o, trace: (r) => s({ ...r, method: "TRACE" }) };
};
const W = Gt(De({
  baseUrl: "http://localhost:26293",
  throwOnError: !0
}));
class te {
  static previewGridBlock(t) {
    return ((t == null ? void 0 : t.client) ?? W).post({
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
    return ((t == null ? void 0 : t.client) ?? W).post({
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
    return ((t == null ? void 0 : t.client) ?? W).post({
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
    return ((t == null ? void 0 : t.client) ?? W).get({
      url: "/umbraco/management/api/v1/block-preview/settings",
      ...t
    });
  }
}
const ie = new Ct("BlockPreviewContext");
var Wt = Object.defineProperty, jt = Object.getOwnPropertyDescriptor, Re = (e) => {
  throw TypeError(e);
}, k = (e, t, i, o) => {
  for (var n = o > 1 ? void 0 : o ? jt(t, i) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (o ? r(t, i, n) : r(n)) || n);
  return o && n && Wt(t, i, n), n;
}, ge = (e, t, i) => t.has(e) || Re("Cannot " + i), E = (e, t, i) => (ge(e, t, "read from private field"), t.get(e)), oe = (e, t, i) => t.has(e) ? Re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ie = (e, t, i, o) => (ge(e, t, "write to private field"), t.set(e, i), i), $ = (e, t, i) => (ge(e, t, "access private method"), i), b, J, g, Ne, Ve, Ke, Ge, We, ae, je, ze, Xe;
const zt = "block-grid-preview";
let p = class extends ye {
  constructor() {
    super(), oe(this, g), oe(this, b), oe(this, J), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._sortModeActive = !1, this._blockContext = {
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
    }, this.consumeContext(ie, (e) => {
      Ie(this, b, e), $(this, g, Ne).call(this);
    });
  }
  set blockGridValue(e) {
    const t = e ? { ...e } : {};
    t.layout ?? (t.layout = {}), t.contentData ?? (t.contentData = []), t.settingsData ?? (t.settingsData = []), t.expose ?? (t.expose = []), this._blockGridValue = t;
  }
  get blockGridValue() {
    return this._blockGridValue;
  }
  updated(e) {
    super.updated(e), (e.has("content") || e.has("settings")) && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      $(this, g, ze).call(this);
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
    const i = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (i.filter((r) => r instanceof Element && o.includes(r.tagName)).length > 0) {
      const r = i.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      r != null && r instanceof we && (s = r.href) != null && s.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    if (this._sortModeActive === !1) {
      if (this._isLoading)
        return x`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>`;
      if (this._error)
        return x`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            `;
      if (this._htmlMarkup)
        return x`
                ${this._styleElement}
                <a
                    href=${_e(this._blockContext.workspaceEditContentPath)} 
                    @click=${this._handleClick}
                    aria-label="Edit block"
                    class="block-preview-edit"
                    role="button"
                >
                    ${me(this._htmlMarkup)}
                </a>
            `;
    } else return x`<umb-block-grid-block
            class="umb-block-grid__block--view"
            .label=${this.label}
            .icon=${this.icon}
            .unpublished=${this.unpublished}
            .config=${this.config}
            .content=${this.content}
            .settings=${this.settings}>
            </umb-block-grid-block>
        `;
  }
};
b = /* @__PURE__ */ new WeakMap();
J = /* @__PURE__ */ new WeakMap();
g = /* @__PURE__ */ new WeakSet();
Ne = function() {
  $(this, g, Ve).call(this), $(this, g, Ke).call(this), $(this, g, Ge).call(this), $(this, g, We).call(this);
};
Ve = function() {
  var e;
  this.observe((e = E(this, b)) == null ? void 0 : e.sortModeActive, (t) => {
    t !== void 0 && (this._sortModeActive = t);
  });
};
Ke = function() {
  var e;
  this.observe((e = E(this, b)) == null ? void 0 : e.settings, (t) => {
    var i;
    (i = t == null ? void 0 : t.blockGrid) != null && i.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockGrid.stylesheet);
  });
};
Ge = function() {
  this.consumeContext(ke, (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
We = async function() {
  this.getContext(de).then((e) => {
    e && (Ie(this, J, e), this.observe(
      M([e.unique, e.contentTypeUnique]),
      async ([t, i]) => {
        var o, n;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = E(this, b)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = i ?? "", (n = E(this, b)) == null || n.setDocumentTypeUnique(this._blockContext.documentTypeUnique), $(this, g, ae).call(this);
      }
    ));
  }), E(this, J) == null && E(this, b) != null && this._blockContext.unique == "" && this.consumeContext(pe, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var i;
      this._blockContext.unique = ((i = E(this, b)) == null ? void 0 : i.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", $(this, g, ae).call(this);
    });
  });
};
ae = async function() {
  this.consumeContext(yt, async (e) => {
    e && this.observe(
      M([
        e.contentKey,
        e.settingsKey,
        e.workspaceEditContentPath,
        e.contentElementTypeAlias,
        e.contentElementTypeKey
      ]),
      async ([
        t,
        i,
        o,
        n,
        s
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = i ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = n ?? "", this._blockContext.contentElementTypeKey = s ?? "", await $(this, g, je).call(this);
      }
    );
  });
};
je = async function() {
  this.consumeContext(kt, (e) => {
    e && this.observe(
      M([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([t, i, o, n, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockGridValue = {
          contentData: (t == null ? void 0 : t.filter((r) => r.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (i == null ? void 0 : i.filter((r) => r.key == this._blockContext.settingsUdi)) ?? [],
          expose: (n == null ? void 0 : n.filter((r) => r.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: { "Umbraco.BlockGrid": this._filterLayouts(o) }
        }, this._blockContext.blockIndex = t.indexOf(this.blockGridValue.contentData[0]);
      }
    );
  });
};
ze = async function() {
  const e = this._blockContext;
  if (E(this, b) != null && e.unique == "" && (e.unique = E(this, b).getUnique()), E(this, b) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = E(this, b).getDocumentTypeUnique()), !$(this, g, Xe).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: i, error: o } = await Z(this, te.previewGridBlock({
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
    i ? (this._htmlMarkup = i ?? "", this._isLoading = !1) : ve.isUmbApiError(o) && (this._error = o.message, this._isLoading = !1);
  } catch (i) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", i);
  }
};
Xe = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
p.styles = [
  fe`
            a.block-preview-edit {
              display: block;
              color: inherit;
              text-decoration: inherit;
              border: 1px solid transparent;
              border-radius: 2px;
            }

            a.block-preview-edit:hover {
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
k([
  c({ attribute: !1 })
], p.prototype, "content", 2);
k([
  c({ attribute: !1 })
], p.prototype, "settings", 2);
k([
  c({ attribute: !1 })
], p.prototype, "contentKey", 2);
k([
  c({ attribute: !1 })
], p.prototype, "config", 2);
k([
  c({ attribute: !1 })
], p.prototype, "unpublished", 2);
k([
  c({ attribute: !1 })
], p.prototype, "icon", 2);
k([
  c({ attribute: !1 })
], p.prototype, "label", 2);
k([
  y()
], p.prototype, "_htmlMarkup", 2);
k([
  y()
], p.prototype, "_isLoading", 2);
k([
  y()
], p.prototype, "_error", 2);
k([
  y()
], p.prototype, "_sortModeActive", 2);
k([
  c({ attribute: !1 })
], p.prototype, "blockGridValue", 1);
p = k([
  be(zt)
], p);
var Xt = Object.defineProperty, Ht = Object.getOwnPropertyDescriptor, He = (e) => {
  throw TypeError(e);
}, f = (e, t, i, o) => {
  for (var n = o > 1 ? void 0 : o ? Ht(t, i) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (o ? r(t, i, n) : r(n)) || n);
  return o && n && Xt(t, i, n), n;
}, Ce = (e, t, i) => t.has(e) || He("Cannot " + i), U = (e, t, i) => (Ce(e, t, "read from private field"), t.get(e)), ne = (e, t, i) => t.has(e) ? He("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ye = (e, t, i, o) => (Ce(e, t, "write to private field"), t.set(e, i), i), q = (e, t, i) => (Ce(e, t, "access private method"), i), _, F, C, Je, Fe, Qe, Ze, et, le, tt, it, rt;
const Yt = "block-list-preview";
let h = class extends ye {
  constructor() {
    super(), ne(this, C), ne(this, _), ne(this, F), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._sortModeActive = !1, this._blockContext = {
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
    }, this.consumeContext(ie, (e) => {
      Ye(this, _, e), q(this, C, Je).call(this);
    });
  }
  set blockListValue(e) {
    const t = e ? { ...e } : {};
    t.layout ?? (t.layout = {}), t.contentData ?? (t.contentData = []), t.settingsData ?? (t.settingsData = []), t.expose ?? (t.expose = []), this._blockListValue = t;
  }
  get blockListValue() {
    return this._blockListValue;
  }
  updated(e) {
    super.updated(e), (e.has("content") || e.has("settings")) && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      q(this, C, it).call(this);
    }, 500));
  }
  _handleClick(e) {
    var s;
    let t = !0;
    const i = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (i.filter((r) => r instanceof Element && o.includes(r.tagName)).length > 0) {
      const r = i.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      r != null && r instanceof we && (s = r.href) != null && s.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    if (this._sortModeActive === !1) {
      if (this._isLoading)
        return x`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>`;
      if (this._error)
        return x`
                    <div class="preview-alert preview-alert-error" role="alert">
                        ${this._error}
                    </div>
                `;
      if (this._htmlMarkup)
        return x`
                    ${this._styleElement}
                    <a 
                        href=${_e(this._blockContext.workspaceEditContentPath)}
                        @click=${this._handleClick}
                        aria-label="Edit block"
                        class="block-preview-edit"
                        role="button"
                    >
                        ${me(this._htmlMarkup)}
                    </a>
                `;
    } else return x`<umb-ref-list-block
            class="umb-block-grid__block--view"
            .label=${this.label}
            .icon=${this.icon}
            .unpublished=${this.unpublished}
            .config=${this.config}
            .content=${this.content}
            .settings=${this.settings}>
            </umb-ref-list-block>
        `;
  }
};
_ = /* @__PURE__ */ new WeakMap();
F = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
Je = function() {
  q(this, C, Fe).call(this), q(this, C, Qe).call(this), q(this, C, Ze).call(this), q(this, C, et).call(this);
};
Fe = function() {
  var e;
  this.observe((e = U(this, _)) == null ? void 0 : e.sortModeActive, (t) => {
    t !== void 0 && (this._sortModeActive = t);
  });
};
Qe = function() {
  var e;
  this.observe((e = U(this, _)) == null ? void 0 : e.settings, (t) => {
    var i;
    (i = t == null ? void 0 : t.blockList) != null && i.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.blockList.stylesheet);
  });
};
Ze = function() {
  this.consumeContext(ke, async (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
et = function() {
  this.consumeContext(de, (e) => {
    e && (Ye(this, F, e), this.observe(
      M([e.unique, e.contentTypeUnique]),
      async ([t, i]) => {
        var o, n;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = U(this, _)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = i ?? "", (n = U(this, _)) == null || n.setDocumentTypeUnique(this._blockContext.documentTypeUnique), q(this, C, le).call(this);
      }
    ));
  }), U(this, F) == null && U(this, _) != null && this._blockContext.unique == "" && this.consumeContext(pe, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var i;
      this._blockContext.unique = ((i = U(this, _)) == null ? void 0 : i.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", q(this, C, le).call(this);
    });
  });
};
le = function() {
  this.consumeContext(Tt, (e) => {
    e && this.observe(
      M([
        e.contentKey,
        e.settingsKey,
        e.workspaceEditContentPath,
        e.contentElementTypeAlias,
        e.contentElementTypeKey
      ]),
      async ([
        t,
        i,
        o,
        n,
        s
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = i ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = n ?? "", this._blockContext.contentElementTypeKey = s ?? "", await q(this, C, tt).call(this);
      }
    );
  });
};
tt = function() {
  this.consumeContext(Et, (e) => {
    e && this.observe(
      M([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([
        t,
        i,
        o,
        n,
        s
      ]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockListValue = {
          contentData: (t == null ? void 0 : t.filter((r) => r.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (i == null ? void 0 : i.filter((r) => r.key == this._blockContext.settingsUdi)) ?? [],
          expose: (n == null ? void 0 : n.filter((r) => r.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockList": (o == null ? void 0 : o.filter((r) => r.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, this._blockContext.blockIndex = t == null ? void 0 : t.indexOf(this.blockListValue.contentData[0]);
      }
    );
  });
};
it = async function() {
  const e = this._blockContext;
  if (U(this, _) != null && e.unique == "" && (e.unique = U(this, _).getUnique()), U(this, _) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = U(this, _).getDocumentTypeUnique()), !q(this, C, rt).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: i, error: o } = await Z(this, te.previewListBlock({
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
    i ? (this._htmlMarkup = i ?? "", this._isLoading = !1) : ve.isUmbApiError(o) && (this._error = o.message, this._isLoading = !1);
  } catch (i) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", i);
  }
};
rt = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentUdi != "" && e.contentElementTypeAlias != "";
};
h.styles = [
  fe`
        a.block-preview-edit {
          display: block;
          color: inherit;
          text-decoration: inherit;
          border: 1px solid transparent;
          border-radius: 2px;
        }

        a.block-preview-edit:hover {
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
], h.prototype, "settings", 2);
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
  y()
], h.prototype, "_htmlMarkup", 2);
f([
  y()
], h.prototype, "_isLoading", 2);
f([
  y()
], h.prototype, "_error", 2);
f([
  y()
], h.prototype, "_sortModeActive", 2);
f([
  y()
], h.prototype, "_blockListValue", 2);
f([
  c({ attribute: !1 })
], h.prototype, "blockListValue", 1);
h = f([
  be(Yt)
], h);
var Jt = Object.defineProperty, Ft = Object.getOwnPropertyDescriptor, ot = (e) => {
  throw TypeError(e);
}, P = (e, t, i, o) => {
  for (var n = o > 1 ? void 0 : o ? Ft(t, i) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (o ? r(t, i, n) : r(n)) || n);
  return o && n && Jt(t, i, n), n;
}, Te = (e, t, i) => t.has(e) || ot("Cannot " + i), O = (e, t, i) => (Te(e, t, "read from private field"), t.get(e)), se = (e, t, i) => t.has(e) ? ot("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), nt = (e, t, i, o) => (Te(e, t, "write to private field"), t.set(e, i), i), B = (e, t, i) => (Te(e, t, "access private method"), i), T, Q, A, st, at, lt, ct, ce, ut, ht, pt;
const Qt = "rich-text-preview";
let m = class extends ye {
  constructor() {
    super(), se(this, A), se(this, T), se(this, Q), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      contentUdi: "",
      settingsUdi: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: "",
      contentElementTypeKey: ""
    }, this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(ie, (e) => {
      nt(this, T, e), B(this, A, st).call(this);
    });
  }
  set blockRteValue(e) {
    const t = e ? { ...e } : {};
    t.layout ?? (t.layout = {}), t.contentData ?? (t.contentData = []), t.settingsData ?? (t.settingsData = []), t.expose ?? (t.expose = []), this._blockRteValue = t;
  }
  get blockRteValue() {
    return this._blockRteValue;
  }
  updated(e) {
    super.updated(e), (e.has("content") || e.has("settings")) && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      B(this, A, ht).call(this);
    }, 500));
  }
  _handleClick(e) {
    var s;
    let t = !0;
    const i = e.composedPath(), o = [
      "UUI-ACTION-BAR",
      "UMB-BLOCK-SCALE-HANDLER"
    ];
    if (i.filter((r) => r instanceof Element && o.includes(r.tagName)).length > 0) {
      const r = i.find((a) => a instanceof Element && a.tagName === "UUI-BUTTON");
      r != null && r instanceof we && (s = r.href) != null && s.includes("block/edit") && (t = !1), t && (e.preventDefault(), e.stopPropagation());
    }
  }
  render() {
    if (this._isLoading)
      return x`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>`;
    if (this._error)
      return x`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            `;
    if (this._htmlMarkup)
      return x`
                ${this._styleElement}
                <a
                    href=${_e(this._blockContext.workspaceEditContentPath)}
                    @click=${this._handleClick}
                    aria-label="Edit block"
                    class="block-preview-edit"
                    role="button"
                >
                    ${me(this._htmlMarkup)}
                </a>`;
  }
};
T = /* @__PURE__ */ new WeakMap();
Q = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
st = function() {
  B(this, A, at).call(this), B(this, A, lt).call(this), B(this, A, ct).call(this);
};
at = function() {
  var e;
  this.observe((e = O(this, T)) == null ? void 0 : e.settings, (t) => {
    var i;
    (i = t == null ? void 0 : t.richText) != null && i.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = t.richText.stylesheet);
  });
};
lt = function() {
  this.consumeContext(ke, async (e) => {
    e && (this._blockContext.culture = e.getVariantId().culture ?? "");
  });
};
ct = function() {
  this.consumeContext(de, (e) => {
    e && (nt(this, Q, e), this.observe(
      M([e.unique, e.contentTypeUnique]),
      async ([t, i]) => {
        var o, n;
        this._blockContext.unique = (t == null ? void 0 : t.toString()) ?? "", (o = O(this, T)) == null || o.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = i ?? "", (n = O(this, T)) == null || n.setDocumentTypeUnique(this._blockContext.documentTypeUnique), B(this, A, ce).call(this);
      }
    ));
  }), O(this, Q) == null && O(this, T) != null && this._blockContext.unique == "" && this.consumeContext(pe, (e) => {
    e && this.observe(e.content.structure.contentTypeUniques, (t) => {
      var i;
      this._blockContext.unique = ((i = O(this, T)) == null ? void 0 : i.getUnique()) ?? "", this._blockContext.documentTypeUnique = t[0] ?? "", B(this, A, ce).call(this);
    });
  });
};
ce = function() {
  this.consumeContext(xt, (e) => {
    e != null && this.observe(
      M([
        e.contentKey,
        e.settingsKey,
        e.workspaceEditContentPath,
        e.contentElementTypeAlias,
        e.contentElementTypeKey
      ]),
      async ([
        t,
        i,
        o,
        n,
        s
      ]) => {
        this._blockContext.contentUdi = t ?? "", this._blockContext.settingsUdi = i ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = n ?? "", this._blockContext.contentElementTypeKey = s ?? "", await B(this, A, ut).call(this);
      }
    );
  });
};
ut = function() {
  this.consumeContext(At, (e) => {
    e != null && this.observe(
      M([
        e.contents,
        e.settings,
        e.layouts,
        e.exposes,
        e.propertyAlias
      ]),
      async ([
        t,
        i,
        o,
        n,
        s
      ]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockRteValue = {
          contentData: (t == null ? void 0 : t.filter((r) => r.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (i == null ? void 0 : i.filter((r) => r.key == this._blockContext.settingsUdi)) ?? [],
          expose: (n == null ? void 0 : n.filter((r) => r.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.RichText": (o == null ? void 0 : o.filter((r) => r.contentKey == this._blockContext.contentUdi)) ?? []
          }
        };
      }
    );
  });
};
ht = async function() {
  const e = this._blockContext;
  if (O(this, T) != null && e.unique == "" && (e.unique = O(this, T).getUnique()), O(this, T) != null && e.documentTypeUnique == "" && (e.documentTypeUnique = O(this, T).getDocumentTypeUnique()), !B(this, A, pt).call(this, e)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const { data: i, error: o } = await Z(this, te.previewRichTextMarkup({
      body: JSON.stringify(this.blockRteValue),
      query: {
        blockEditorAlias: e.blockEditorAlias,
        nodeKey: e.unique,
        contentElementAlias: e.contentElementTypeAlias,
        documentTypeUnique: e.documentTypeUnique,
        culture: e.culture
      }
    }));
    i ? (this._htmlMarkup = i ?? "", this._isLoading = !1) : ve.isUmbApiError(o) && (this._error = o.message, this._isLoading = !1);
  } catch (i) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", i);
  }
};
pt = function(e) {
  return e.unique != "" && e.blockEditorAlias != "" && e.contentElementTypeAlias != "";
};
m.styles = [
  fe`
            a.block-preview-edit {
              display: block;
              color: inherit;
              text-decoration: inherit;
              border: 1px solid transparent;
              border-radius: 2px;
            }

            a.block-preview-edit:hover {
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
P([
  c({ attribute: !1 })
], m.prototype, "content", 2);
P([
  c({ attribute: !1 })
], m.prototype, "settings", 2);
P([
  c({ attribute: !1 })
], m.prototype, "contentKey", 2);
P([
  c({ attribute: !1 })
], m.prototype, "config", 2);
P([
  y()
], m.prototype, "_htmlMarkup", 2);
P([
  y()
], m.prototype, "_isLoading", 2);
P([
  y()
], m.prototype, "_error", 2);
P([
  y()
], m.prototype, "_blockRteValue", 2);
P([
  c({ attribute: !1 })
], m.prototype, "blockRteValue", 1);
m = P([
  be(Qt)
], m);
var j, V, R, I, N;
class ue extends Pe {
  constructor(i) {
    super(i);
    L(this, j);
    L(this, V);
    L(this, R);
    L(this, I);
    L(this, N);
    D(this, V, new wt(void 0)), this.settings = d(this, V).asObservable(), D(this, R, new Ae("")), this.unique = d(this, R).asObservable(), D(this, I, new Ae("")), this.documentTypeUnique = d(this, I).asObservable(), D(this, N, new gt(!1)), this.sortModeActive = d(this, N).asObservable(), D(this, j, new dt(i)), this.getSettings(), this.setSortMode(!1);
  }
  async getSettings() {
    const i = await d(this, j).getSettings();
    d(this, V).setValue(i);
  }
  getUnique() {
    return d(this, R).getValue();
  }
  async setUnique(i) {
    i != "" && d(this, R).setValue(i);
  }
  getDocumentTypeUnique() {
    return d(this, I).getValue();
  }
  async setDocumentTypeUnique(i) {
    i != "" && d(this, I).setValue(i);
  }
  getSortMode() {
    return d(this, N).getValue();
  }
  async setSortMode(i) {
    d(this, N).setValue(i);
  }
}
j = new WeakMap(), V = new WeakMap(), R = new WeakMap(), I = new WeakMap(), N = new WeakMap();
const Zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: ue,
  default: ue
}, Symbol.toStringTag, { value: "Module" })), ei = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => Zt)
  }
], ti = [...ei], he = {
  type: "kind",
  alias: "Umb.PropertyAction.SortMode",
  matchKind: "sortMode",
  matchType: "propertyAction",
  manifest: {
    ...Ot.manifest,
    type: "propertyAction",
    kind: "sortMode",
    api: () => import("./sort-mode.property-action-TiJ6PfT-.js"),
    weight: 100,
    meta: {
      icon: "icon-navigation-vertical",
      label: "Sort Mode"
    }
  }
}, ii = [
  he
], ri = [
  {
    ...he.manifest,
    type: "propertyAction",
    kind: "sortMode",
    alias: "BlockPreview.PropertyAction.Grid.SortMode",
    name: "Block Grid Sort Mode Property Action",
    api: () => import("./block-grid-sort-mode-Fr0BqH_z.js"),
    forPropertyEditorUis: [vt],
    conditions: [
      {
        alias: Oe
      }
    ]
  },
  {
    ...he.manifest,
    type: "propertyAction",
    kind: "sortMode",
    alias: "BlockPreview.PropertyAction.List.SortMode",
    name: "Block List Sort Mode Property Action",
    api: () => import("./block-list-sort-mode-CV-5y-r9.js"),
    forPropertyEditorUis: [Ut],
    conditions: [
      {
        alias: Oe
      }
    ]
  }
];
var z;
class oi {
  constructor(t) {
    L(this, z);
    D(this, z, t);
  }
  async getSettings() {
    return await Z(d(this, z), te.getSettings());
  }
}
z = new WeakMap();
var X;
class dt extends Pe {
  constructor(i) {
    super(i);
    L(this, X);
    D(this, X, new oi(i));
  }
  async getSettings() {
    const i = await d(this, X).getSettings();
    if (i && (i != null && i.data))
      return i.data;
  }
}
X = new WeakMap();
const wi = async (e, t) => {
  e.consumeContext(mt, async (i) => {
    var a, l, S;
    if (!i) return;
    const o = i.getOpenApiConfiguration();
    W.setConfig({
      auth: () => i.getLatestToken(),
      baseUrl: o.base,
      credentials: o.credentials
    });
    const s = await new dt(e).getSettings();
    let r = [];
    if (s) {
      if (s.blockGrid.enabled) {
        let u = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.GridCustomView",
          name: "BlockPreview Grid Custom View",
          element: p,
          forBlockEditor: "block-grid"
        };
        ((a = s.blockGrid.contentTypes) == null ? void 0 : a.length) !== 0 && (u.forContentTypeAlias = s.blockGrid.contentTypes), r.push(u);
      }
      if (s.blockList.enabled) {
        let u = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.ListCustomView",
          name: "BlockPreview List Custom View",
          element: h,
          forBlockEditor: "block-list"
        };
        ((l = s.blockList.contentTypes) == null ? void 0 : l.length) !== 0 && (u.forContentTypeAlias = s.blockList.contentTypes), r.push(u);
      }
      if (s.richText.enabled) {
        let u = {
          type: "blockEditorCustomView",
          alias: "BlockPreview.RichTextCustomView",
          name: "BlockPreview Rich Text Custom View",
          element: m,
          forBlockEditor: "block-rte"
        };
        ((S = s.richText.contentTypes) == null ? void 0 : S.length) !== 0 && (u.forContentTypeAlias = s.richText.contentTypes), r.push(u);
      }
    }
    t.registerMany([
      ...r,
      ...ti,
      ...ii,
      ...ri
    ]), e.provideContext(ie, new ue(e));
  });
};
export {
  ie as B,
  m as R,
  oi as S,
  p as a,
  h as b,
  dt as c,
  wi as o
};
//# sourceMappingURL=index-DJ7EEJSZ.js.map
