var be = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var w = (t, e, r) => (be(t, e, "read from private field"), r ? r.call(t) : e.get(t)), T = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, C = (t, e, r, o) => (be(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as Ke } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as O } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as ke } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as We, UMB_BLOCK_GRID_MANAGER_CONTEXT as Ge } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as me } from "@umbraco-cms/backoffice/document";
import { css as I, state as u, property as K, customElement as W, html as k, ifDefined as G, unsafeHTML as H } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as y, UmbObjectState as He } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as X, UMB_PROPERTY_CONTEXT as Fe } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as Xe } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as Je, UMB_BLOCK_LIST_MANAGER_CONTEXT as ze } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as Ye } from "@umbraco-cms/backoffice/block-rte";
class ye extends Error {
  constructor(e, r, o) {
    super(o), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = e;
  }
}
class Qe extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class Ze {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((r, o) => {
      this._resolve = r, this._reject = o;
      const i = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(a));
      }, s = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isRejected = !0, this._reject && this._reject(a));
      }, n = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || this.cancelHandlers.push(a);
      };
      return Object.defineProperty(n, "isResolved", {
        get: () => this._isResolved
      }), Object.defineProperty(n, "isRejected", {
        get: () => this._isRejected
      }), Object.defineProperty(n, "isCancelled", {
        get: () => this._isCancelled
      }), e(i, s, n);
    });
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(e, r) {
    return this.promise.then(e, r);
  }
  catch(e) {
    return this.promise.catch(e);
  }
  finally(e) {
    return this.promise.finally(e);
  }
  cancel() {
    if (!(this._isResolved || this._isRejected || this._isCancelled)) {
      if (this._isCancelled = !0, this.cancelHandlers.length)
        try {
          for (const e of this.cancelHandlers)
            e();
        } catch (e) {
          console.warn("Cancellation threw an error", e);
          return;
        }
      this.cancelHandlers.length = 0, this._reject && this._reject(new Qe("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class _e {
  constructor() {
    this._fns = [];
  }
  eject(e) {
    const r = this._fns.indexOf(e);
    r !== -1 && (this._fns = [...this._fns.slice(0, r), ...this._fns.slice(r + 1)]);
  }
  use(e) {
    this._fns = [...this._fns, e];
  }
}
const p = {
  BASE: "",
  CREDENTIALS: "include",
  ENCODE_PATH: void 0,
  HEADERS: void 0,
  PASSWORD: void 0,
  TOKEN: void 0,
  USERNAME: void 0,
  VERSION: "Latest",
  WITH_CREDENTIALS: !1,
  interceptors: {
    request: new _e(),
    response: new _e()
  }
}, R = (t) => typeof t == "string", L = (t) => R(t) && t !== "", J = (t) => t instanceof Blob, ve = (t) => t instanceof FormData, et = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, tt = (t) => {
  const e = [], r = (i, s) => {
    e.push(`${encodeURIComponent(i)}=${encodeURIComponent(String(s))}`);
  }, o = (i, s) => {
    s != null && (s instanceof Date ? r(i, s.toISOString()) : Array.isArray(s) ? s.forEach((n) => o(i, n)) : typeof s == "object" ? Object.entries(s).forEach(([n, a]) => o(`${i}[${n}]`, a)) : r(i, s));
  };
  return Object.entries(t).forEach(([i, s]) => o(i, s)), e.length ? `?${e.join("&")}` : "";
}, rt = (t, e) => {
  const r = t.ENCODE_PATH || encodeURI, o = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (s, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : s;
  }), i = t.BASE + o;
  return e.query ? i + tt(e.query) : i;
}, ot = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (o, i) => {
      R(i) || J(i) ? e.append(o, i) : e.append(o, JSON.stringify(i));
    };
    return Object.entries(t.formData).filter(([, o]) => o != null).forEach(([o, i]) => {
      Array.isArray(i) ? i.forEach((s) => r(o, s)) : r(o, i);
    }), e;
  }
}, B = async (t, e) => typeof e == "function" ? e(t) : e, it = async (t, e) => {
  const [r, o, i, s] = await Promise.all([
    // @ts-ignore
    B(e, t.TOKEN),
    // @ts-ignore
    B(e, t.USERNAME),
    // @ts-ignore
    B(e, t.PASSWORD),
    // @ts-ignore
    B(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...s,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (L(r) && (n.Authorization = `Bearer ${r}`), L(o) && L(i)) {
    const a = et(`${o}:${i}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : J(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : R(e.body) ? n["Content-Type"] = "text/plain" : ve(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, nt = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : R(t.body) || J(t.body) || ve(t.body) ? t.body : JSON.stringify(t.body);
}, st = async (t, e, r, o, i, s, n) => {
  const a = new AbortController();
  let c = {
    headers: s,
    body: o ?? i,
    method: e.method,
    signal: a.signal
  };
  t.WITH_CREDENTIALS && (c.credentials = t.CREDENTIALS);
  for (const l of t.interceptors.request._fns)
    c = await l(c);
  return n(() => a.abort()), await fetch(r, c);
}, at = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (R(r))
      return r;
  }
}, ct = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e) {
        const r = ["application/octet-stream", "application/pdf", "application/zip", "audio/", "image/", "video/"];
        if (e.includes("application/json") || e.includes("+json"))
          return await t.json();
        if (r.some((o) => e.includes(o)))
          return await t.blob();
        if (e.includes("multipart/form-data"))
          return await t.formData();
        if (e.includes("text/"))
          return await t.text();
      }
    } catch (e) {
      console.error(e);
    }
}, lt = (t, e) => {
  const o = {
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "Im a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Content",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    ...t.errors
  }[e.status];
  if (o)
    throw new ye(t, e, o);
  if (!e.ok) {
    const i = e.status ?? "unknown", s = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new ye(
      t,
      e,
      `Generic Error: status: ${i}; status text: ${s}; body: ${n}`
    );
  }
}, D = (t, e) => new Ze(async (r, o, i) => {
  try {
    const s = rt(t, e), n = ot(e), a = nt(e), c = await it(t, e);
    if (!i.isCancelled) {
      let l = await st(t, e, s, a, n, c, i);
      for (const Ie of t.interceptors.response._fns)
        l = await Ie(l);
      const he = await ct(l), je = at(l, e.responseHeader);
      let pe = he;
      e.responseTransformer && l.ok && (pe = await e.responseTransformer(he));
      const fe = {
        url: s,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: je ?? pe
      };
      lt(e, fe), r(fe.body);
    }
  } catch (s) {
    o(s);
  }
});
class U {
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.contentUdi
   * @param data.settingsUdi
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewGridBlock(e = {}) {
    return D(p, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/grid",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique,
        contentUdi: e.contentUdi,
        settingsUdi: e.settingsUdi
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.contentUdi
   * @param data.settingsUdi
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewListBlock(e = {}) {
    return D(p, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/list",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique,
        contentUdi: e.contentUdi,
        settingsUdi: e.settingsUdi
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewRichTextMarkup(e = {}) {
    return D(p, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/rte",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
  /**
   * @returns unknown OK
   * @throws ApiError
   */
  static getSettings() {
    return D(p, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
}
var x;
class dt {
  constructor(e) {
    T(this, x, void 0);
    C(this, x, e);
  }
  async getSettings() {
    return await O(w(this, x), U.getSettings());
  }
}
x = new WeakMap();
var A;
class we extends ke {
  constructor(r) {
    super(r);
    T(this, A, void 0);
    C(this, A, new dt(r));
  }
  async getSettings() {
    const r = await w(this, A).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
A = new WeakMap();
const ge = new Xe("BlockPreviewContext");
var ut = Object.defineProperty, ht = Object.getOwnPropertyDescriptor, P = (t, e, r, o) => {
  for (var i = o > 1 ? void 0 : o ? ht(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (i = (o ? n(e, r, i) : n(i)) || i);
  return o && i && ut(e, r, i), i;
}, pt = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, h = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, f = (t, e, r) => (pt(t, e, "access private method"), r), N, Ee, z, Te, Y, Ce, Q, xe, Z, Ae, ee, Se, te, Re, re, Pe;
const ft = "block-grid-preview";
let b = class extends F {
  constructor() {
    super(), h(this, N), h(this, z), h(this, Y), h(this, Q), h(this, Z), h(this, ee), h(this, te), h(this, re), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      contentUdi: "",
      settingsUdi: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: "",
      contentElementTypeKey: ""
    }, this._blockGridValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, f(this, N, Ee).call(this);
  }
  set blockGridValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockGridValue = e;
  }
  get blockGridValue() {
    return this._blockGridValue;
  }
  render() {
    return this._isLoading ? k`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? k`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? k`
                ${this._styleElement}
                <a 
                    href=${G(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${H(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
N = /* @__PURE__ */ new WeakSet();
Ee = function() {
  f(this, z, Te).call(this), f(this, Y, Ce).call(this), f(this, Q, xe).call(this);
};
z = /* @__PURE__ */ new WeakSet();
Te = function() {
  this.consumeContext(ge, (t) => {
    this.observe(t.settings, (e) => {
      var r;
      (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockGrid.stylesheet);
    });
  });
};
Y = /* @__PURE__ */ new WeakSet();
Ce = function() {
  this.consumeContext(X, (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
Q = /* @__PURE__ */ new WeakSet();
xe = function() {
  this.consumeContext(me, (t) => {
    this.observe(
      y([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", this._blockContext.documentTypeUnique = r ?? "", await f(this, Z, Ae).call(this);
      }
    );
  });
};
Z = /* @__PURE__ */ new WeakSet();
Ae = async function() {
  this.consumeContext(We, async (t) => {
    this.observe(
      y([
        t.contentKey,
        t.settingsKey,
        t.workspaceEditContentPath,
        t.contentElementTypeAlias,
        t.contentElementTypeKey
      ]),
      async ([
        e,
        r,
        o,
        i,
        s
      ]) => {
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = i ?? "", this._blockContext.contentElementTypeKey = s ?? "", await f(this, ee, Se).call(this);
      }
    );
  });
};
ee = /* @__PURE__ */ new WeakSet();
Se = async function() {
  this.consumeContext(Ge, (t) => {
    this.observe(
      y([
        t.contents,
        t.settings,
        t.layouts,
        t.exposes,
        t.propertyAlias
      ]),
      async ([e, r, o, i, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockGridValue = {
          contentData: (e == null ? void 0 : e.filter((n) => n.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((n) => n.key == this._blockContext.settingsUdi)) ?? [],
          expose: (i == null ? void 0 : i.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockGrid": (o == null ? void 0 : o.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, await f(this, te, Re).call(this);
      }
    );
  });
};
te = /* @__PURE__ */ new WeakSet();
Re = async function() {
  const t = this._blockContext;
  if (!f(this, re, Pe).call(this, t)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const r = {
      blockEditorAlias: t.blockEditorAlias,
      nodeKey: t.unique,
      contentElementAlias: t.contentElementTypeAlias,
      documentTypeUnique: t.documentTypeUnique,
      contentUdi: t.contentUdi,
      settingsUdi: t.settingsUdi,
      culture: t.culture,
      requestBody: JSON.stringify(this.blockGridValue)
    }, { data: o } = await O(this, U.previewGridBlock(r));
    this._htmlMarkup = o ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
re = /* @__PURE__ */ new WeakSet();
Pe = function(t) {
  return t.unique != "" && t.documentTypeUnique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
b.styles = [
  I`
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
P([
  u()
], b.prototype, "_htmlMarkup", 2);
P([
  u()
], b.prototype, "_isLoading", 2);
P([
  u()
], b.prototype, "_error", 2);
P([
  K({ attribute: !1 })
], b.prototype, "blockGridValue", 1);
b = P([
  W(ft)
], b);
var bt = Object.defineProperty, yt = Object.getOwnPropertyDescriptor, E = (t, e, r, o) => {
  for (var i = o > 1 ? void 0 : o ? yt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (i = (o ? n(e, r, i) : n(i)) || i);
  return o && i && bt(e, r, i), i;
}, _t = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, _ = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, m = (t, e, r) => (_t(t, e, "access private method"), r), V, Be, oe, De, ie, Oe, ne, Ue, se, qe, ae, Le, ce, $e;
const kt = "block-list-preview";
let d = class extends F {
  constructor() {
    super(), _(this, V), _(this, oe), _(this, ie), _(this, ne), _(this, se), _(this, ae), _(this, ce), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      contentUdi: "",
      settingsUdi: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: "",
      contentElementTypeKey: ""
    }, this._blockListValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, m(this, V, Be).call(this);
  }
  set blockListValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockListValue = e;
  }
  get blockListValue() {
    return this._blockListValue;
  }
  render() {
    return this._isLoading ? k`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? k`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? k`
                <a 
                    href=${G(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${H(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
V = /* @__PURE__ */ new WeakSet();
Be = function() {
  m(this, oe, De).call(this), m(this, ie, Oe).call(this);
};
oe = /* @__PURE__ */ new WeakSet();
De = function() {
  this.consumeContext(X, async (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
ie = /* @__PURE__ */ new WeakSet();
Oe = function() {
  this.consumeContext(me, (t) => {
    this.observe(
      y([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", this._blockContext.documentTypeUnique = r ?? "", m(this, ne, Ue).call(this);
      }
    );
  });
};
ne = /* @__PURE__ */ new WeakSet();
Ue = function() {
  this.consumeContext(Je, (t) => {
    this.observe(
      y([
        t.contentKey,
        t.settingsKey,
        t.workspaceEditContentPath,
        t.contentElementTypeAlias,
        t.contentElementTypeKey
      ]),
      async ([
        e,
        r,
        o,
        i,
        s
      ]) => {
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = i ?? "", this._blockContext.contentElementTypeKey = s ?? "", await m(this, se, qe).call(this);
      }
    );
  });
};
se = /* @__PURE__ */ new WeakSet();
qe = function() {
  this.consumeContext(ze, (t) => {
    this.observe(
      y([
        t.contents,
        t.settings,
        t.layouts,
        t.exposes,
        t.propertyAlias
      ]),
      async ([e, r, o, i, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockListValue = {
          contentData: (e == null ? void 0 : e.filter((n) => n.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((n) => n.key == this._blockContext.settingsUdi)) ?? [],
          expose: (i == null ? void 0 : i.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockList": (o == null ? void 0 : o.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, m(this, ae, Le).call(this);
      }
    );
  });
};
ae = /* @__PURE__ */ new WeakSet();
Le = async function() {
  const t = this._blockContext;
  if (!m(this, ce, $e).call(this, t)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const r = {
      blockEditorAlias: t.blockEditorAlias,
      nodeKey: t.unique,
      contentElementAlias: t.contentElementTypeAlias,
      documentTypeUnique: t.documentTypeUnique,
      contentUdi: t.contentUdi,
      settingsUdi: t.settingsUdi,
      culture: t.culture,
      requestBody: JSON.stringify(this._blockListValue)
    }, { data: o } = await O(this, U.previewListBlock(r));
    this._htmlMarkup = o ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
ce = /* @__PURE__ */ new WeakSet();
$e = function(t) {
  return !!(t.unique && t.documentTypeUnique && t.blockEditorAlias && t.contentElementTypeAlias);
};
d.styles = [
  I`
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
E([
  u()
], d.prototype, "_htmlMarkup", 2);
E([
  u()
], d.prototype, "_isLoading", 2);
E([
  u()
], d.prototype, "_error", 2);
E([
  u()
], d.prototype, "_blockListValue", 2);
E([
  K({ attribute: !1 })
], d.prototype, "blockListValue", 1);
d = E([
  W(kt)
], d);
var mt = Object.defineProperty, vt = Object.getOwnPropertyDescriptor, q = (t, e, r, o) => {
  for (var i = o > 1 ? void 0 : o ? vt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (i = (o ? n(e, r, i) : n(i)) || i);
  return o && i && mt(e, r, i), i;
}, wt = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, $ = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, le = (t, e, r) => (wt(t, e, "access private method"), r), M, Ne, de, Ve, ue, Me;
const gt = "rich-text-preview";
let v = class extends F {
  constructor() {
    var t;
    super(), $(this, M), $(this, de), $(this, ue), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(X, async (e) => {
      this.culture = e.getVariantId().culture ?? "";
    }), this.unique = (t = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : t[0], le(this, M, Ne).call(this);
  }
  set blockRteValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockRteValue = e;
  }
  get blockRteValue() {
    return this._blockRteValue;
  }
  render() {
    if (this.htmlMarkup !== "")
      return k`
                <a href=${G(this.workspaceEditContentPath)}>
                    ${H(this.htmlMarkup)}
                </a>`;
  }
};
M = /* @__PURE__ */ new WeakSet();
Ne = function() {
  this.consumeContext(Fe, (t) => {
    this.observe(
      y([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), le(this, de, Ve).call(this));
      }
    );
  });
};
de = /* @__PURE__ */ new WeakSet();
Ve = function() {
  this.consumeContext(Ye, (t) => {
    this.observe(
      y([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await le(this, ue, Me).call(this);
      }
    );
  });
};
ue = /* @__PURE__ */ new WeakSet();
Me = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockRteValue)
  }, { data: e } = await O(this, U.previewRichTextMarkup(t));
  e && (this.htmlMarkup = e);
};
v.styles = [
  I`
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
q([
  u()
], v.prototype, "htmlMarkup", 2);
q([
  u()
], v.prototype, "_blockRteValue", 2);
q([
  K({ attribute: !1 })
], v.prototype, "blockRteValue", 1);
v = q([
  W(gt)
], v);
const Et = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => Ct)
  }
], Tt = [...Et];
var S, g;
class j extends ke {
  constructor(r) {
    super(r);
    T(this, S, void 0);
    T(this, g, void 0);
    C(this, g, new He(void 0)), this.settings = w(this, g).asObservable(), C(this, S, new we(r)), this.getSettings();
  }
  async getSettings() {
    const r = await w(this, S).getSettings();
    w(this, g).setValue(r);
  }
}
S = new WeakMap(), g = new WeakMap();
const Ct = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: j,
  default: j
}, Symbol.toStringTag, { value: "Module" })), Vt = async (t, e) => {
  var s, n, a;
  const o = await new we(t).getSettings();
  let i = [];
  if (o) {
    if (o.blockGrid.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: b,
        forBlockEditor: "block-grid"
      };
      ((s = o.blockGrid.contentTypes) == null ? void 0 : s.length) !== 0 && (c.forContentTypeAlias = o.blockGrid.contentTypes), i.push(c);
    }
    if (o.blockList.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.ListCustomView",
        name: "BlockPreview List Custom View",
        element: d,
        forBlockEditor: "block-list"
      };
      ((n = o.blockList.contentTypes) == null ? void 0 : n.length) !== 0 && (c.forContentTypeAlias = o.blockList.contentTypes), i.push(c);
    }
    if (o.richText.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.RichTextCustomView",
        name: "BlockPreview Rich Text Custom View",
        element: v,
        forBlockEditor: "block-rte"
      };
      ((a = o.richText.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = o.richText.contentTypes), i.push(c);
    }
  }
  e.registerMany([
    ...i,
    ...Tt
  ]), t.provideContext(ge, new j(t)), t.consumeContext(Ke, async (c) => {
    if (!c)
      return;
    const l = c.getOpenApiConfiguration();
    p.BASE = l.base, p.TOKEN = l.token, p.WITH_CREDENTIALS = l.withCredentials, p.CREDENTIALS = l.credentials;
  });
};
export {
  b as BlockGridPreviewCustomView,
  d as BlockListPreviewCustomView,
  v as RichTextPreviewCustomView,
  dt as SettingsDataSource,
  we as SettingsRepository,
  Vt as onInit
};
//# sourceMappingURL=assets.js.map
