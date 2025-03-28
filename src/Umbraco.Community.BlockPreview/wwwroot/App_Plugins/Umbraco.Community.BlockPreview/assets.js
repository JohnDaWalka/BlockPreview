var Re = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var d = (t, e, r) => (Re(t, e, "read from private field"), r ? r.call(t) : e.get(t)), q = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, P = (t, e, r, i) => (Re(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as nt } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as X } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as Oe } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_WORKSPACE_CONTEXT as Le } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as st, UMB_BLOCK_GRID_MANAGER_CONTEXT as at } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as $e } from "@umbraco-cms/backoffice/document";
import { css as ne, property as u, state as C, customElement as se, html as D, ifDefined as ae, unsafeHTML as ce } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as le } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as A, UmbObjectState as ct, UmbStringState as Ue } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as ue, UMB_PROPERTY_CONTEXT as lt } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as ut } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as ht, UMB_BLOCK_LIST_MANAGER_CONTEXT as dt } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as pt } from "@umbraco-cms/backoffice/block-rte";
class De extends Error {
  constructor(e, r, i) {
    super(i), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = e;
  }
}
class ft extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class yt {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((r, i) => {
      this._resolve = r, this._reject = i;
      const o = (a) => {
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
      }), e(o, s, n);
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
      this.cancelHandlers.length = 0, this._reject && this._reject(new ft("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class Be {
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
const x = {
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
    request: new Be(),
    response: new Be()
  }
}, N = (t) => typeof t == "string", z = (t) => N(t) && t !== "", he = (t) => t instanceof Blob, Ne = (t) => t instanceof FormData, bt = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, _t = (t) => {
  const e = [], r = (o, s) => {
    e.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(s))}`);
  }, i = (o, s) => {
    s != null && (s instanceof Date ? r(o, s.toISOString()) : Array.isArray(s) ? s.forEach((n) => i(o, n)) : typeof s == "object" ? Object.entries(s).forEach(([n, a]) => i(`${o}[${n}]`, a)) : r(o, s));
  };
  return Object.entries(t).forEach(([o, s]) => i(o, s)), e.length ? `?${e.join("&")}` : "";
}, mt = (t, e) => {
  const r = t.ENCODE_PATH || encodeURI, i = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (s, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : s;
  }), o = t.BASE + i;
  return e.query ? o + _t(e.query) : o;
}, kt = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (i, o) => {
      N(o) || he(o) ? e.append(i, o) : e.append(i, JSON.stringify(o));
    };
    return Object.entries(t.formData).filter(([, i]) => i != null).forEach(([i, o]) => {
      Array.isArray(o) ? o.forEach((s) => r(i, s)) : r(i, o);
    }), e;
  }
}, M = async (t, e) => typeof e == "function" ? e(t) : e, vt = async (t, e) => {
  const [r, i, o, s] = await Promise.all([
    // @ts-ignore
    M(e, t.TOKEN),
    // @ts-ignore
    M(e, t.USERNAME),
    // @ts-ignore
    M(e, t.PASSWORD),
    // @ts-ignore
    M(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...s,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (z(r) && (n.Authorization = `Bearer ${r}`), z(i) && z(o)) {
    const a = bt(`${i}:${o}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : he(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : N(e.body) ? n["Content-Type"] = "text/plain" : Ne(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, wt = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : N(t.body) || he(t.body) || Ne(t.body) ? t.body : JSON.stringify(t.body);
}, Tt = async (t, e, r, i, o, s, n) => {
  const a = new AbortController();
  let c = {
    headers: s,
    body: i ?? o,
    method: e.method,
    signal: a.signal
  };
  t.WITH_CREDENTIALS && (c.credentials = t.CREDENTIALS);
  for (const l of t.interceptors.request._fns)
    c = await l(c);
  return n(() => a.abort()), await fetch(r, c);
}, gt = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (N(r))
      return r;
  }
}, Ct = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e) {
        const r = ["application/octet-stream", "application/pdf", "application/zip", "audio/", "image/", "video/"];
        if (e.includes("application/json") || e.includes("+json"))
          return await t.json();
        if (r.some((i) => e.includes(i)))
          return await t.blob();
        if (e.includes("multipart/form-data"))
          return await t.formData();
        if (e.includes("text/"))
          return await t.text();
      }
    } catch (e) {
      console.error(e);
    }
}, Et = (t, e) => {
  const i = {
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
  if (i)
    throw new De(t, e, i);
  if (!e.ok) {
    const o = e.status ?? "unknown", s = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new De(
      t,
      e,
      `Generic Error: status: ${o}; status text: ${s}; body: ${n}`
    );
  }
}, V = (t, e) => new yt(async (r, i, o) => {
  try {
    const s = mt(t, e), n = kt(e), a = wt(e), c = await vt(t, e);
    if (!o.isCancelled) {
      let l = await Tt(t, e, s, a, n, c, o);
      for (const ot of t.interceptors.response._fns)
        l = await ot(l);
      const Se = await Ct(l), it = gt(l, e.responseHeader);
      let qe = Se;
      e.responseTransformer && l.ok && (qe = await e.responseTransformer(Se));
      const Pe = {
        url: s,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: it ?? qe
      };
      Et(e, Pe), r(Pe.body);
    }
  } catch (s) {
    i(s);
  }
});
class J {
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
    return V(x, {
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
    return V(x, {
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
    return V(x, {
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
    return V(x, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
}
var O;
class xt {
  constructor(e) {
    q(this, O, void 0);
    P(this, O, e);
  }
  async getSettings() {
    return await X(d(this, O), J.getSettings());
  }
}
O = new WeakMap();
var L;
class Me extends Oe {
  constructor(r) {
    super(r);
    q(this, L, void 0);
    P(this, L, new xt(r));
  }
  async getSettings() {
    const r = await d(this, L).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
L = new WeakMap();
const de = new ut("BlockPreviewContext");
var At = Object.defineProperty, St = Object.getOwnPropertyDescriptor, E = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? St(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && At(e, r, o), o;
}, pe = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, k = (t, e, r) => (pe(t, e, "read from private field"), r ? r.call(t) : e.get(t)), _ = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Ve = (t, e, r, i) => (pe(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r), g = (t, e, r) => (pe(t, e, "access private method"), r), p, W, Q, We, fe, Ke, ye, Ie, be, Ge, K, Z, _e, je, ee, He, me, Fe;
const qt = "block-grid-preview";
let y = class extends le {
  constructor() {
    super(), _(this, Q), _(this, fe), _(this, ye), _(this, be), _(this, K), _(this, _e), _(this, ee), _(this, me), _(this, p, void 0), _(this, W, void 0), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(de, (t) => {
      Ve(this, p, t), g(this, Q, We).call(this);
    });
  }
  set blockGridValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockGridValue = e;
  }
  get blockGridValue() {
    return this._blockGridValue;
  }
  async updated(t) {
    super.updated(t), t.has("content") && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      g(this, ee, He).call(this);
    }, 500));
  }
  render() {
    return this._isLoading ? D`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? D`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? D`
                ${this._styleElement}
                <a 
                    href=${ae(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${ce(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
p = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakMap();
Q = /* @__PURE__ */ new WeakSet();
We = function() {
  g(this, fe, Ke).call(this), g(this, ye, Ie).call(this), g(this, be, Ge).call(this);
};
fe = /* @__PURE__ */ new WeakSet();
Ke = function() {
  var t;
  this.observe((t = k(this, p)) == null ? void 0 : t.settings, (e) => {
    var r;
    (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockGrid.stylesheet);
  });
};
ye = /* @__PURE__ */ new WeakSet();
Ie = function() {
  this.consumeContext(ue, (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
be = /* @__PURE__ */ new WeakSet();
Ge = async function() {
  this.getContext($e).then((t) => {
    Ve(this, W, t), this.observe(
      A([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        var i, o;
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", (i = k(this, p)) == null || i.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (o = k(this, p)) == null || o.setDocumentTypeUnique(this._blockContext.documentTypeUnique), g(this, K, Z).call(this);
      }
    );
  }), k(this, W) == null && k(this, p) != null && this._blockContext.unique == "" && this.consumeContext(Le, (t) => {
    this.observe(t.content.structure.contentTypeUniques, (e) => {
      var r;
      this._blockContext.unique = ((r = k(this, p)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = e[0] ?? "", g(this, K, Z).call(this);
    });
  });
};
K = /* @__PURE__ */ new WeakSet();
Z = async function() {
  this.consumeContext(st, async (t) => {
    this.observe(
      A([
        t.contentKey,
        t.settingsKey,
        t.workspaceEditContentPath,
        t.contentElementTypeAlias,
        t.contentElementTypeKey
      ]),
      async ([
        e,
        r,
        i,
        o,
        s
      ]) => {
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = i ?? "", this._blockContext.contentElementTypeAlias = o ?? "", this._blockContext.contentElementTypeKey = s ?? "", await g(this, _e, je).call(this);
      }
    );
  });
};
_e = /* @__PURE__ */ new WeakSet();
je = async function() {
  this.consumeContext(at, (t) => {
    this.observe(
      A([
        t.contents,
        t.settings,
        t.layouts,
        t.exposes,
        t.propertyAlias
      ]),
      async ([e, r, i, o, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockGridValue = {
          contentData: (e == null ? void 0 : e.filter((n) => n.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((n) => n.key == this._blockContext.settingsUdi)) ?? [],
          expose: (o == null ? void 0 : o.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockGrid": (i == null ? void 0 : i.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? []
          }
        };
      }
    );
  });
};
ee = /* @__PURE__ */ new WeakSet();
He = async function() {
  const t = this._blockContext;
  if (k(this, p) != null && t.unique == "" && (t.unique = k(this, p).getUnique()), k(this, p) != null && t.documentTypeUnique == "" && (t.documentTypeUnique = k(this, p).getDocumentTypeUnique()), !g(this, me, Fe).call(this, t)) {
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
    }, { data: i } = await X(this, J.previewGridBlock(r));
    this._htmlMarkup = i ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
me = /* @__PURE__ */ new WeakSet();
Fe = function(t) {
  return t.unique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
y.styles = [
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
E([
  u({ attribute: !1 })
], y.prototype, "content", 2);
E([
  u({ attribute: !1 })
], y.prototype, "settingsData", 2);
E([
  u({ attribute: !1 })
], y.prototype, "contentKey", 2);
E([
  u({ attribute: !1 })
], y.prototype, "config", 2);
E([
  C()
], y.prototype, "_htmlMarkup", 2);
E([
  C()
], y.prototype, "_isLoading", 2);
E([
  C()
], y.prototype, "_error", 2);
E([
  u({ attribute: !1 })
], y.prototype, "blockGridValue", 1);
y = E([
  se(qt)
], y);
var Pt = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, T = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? Rt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && Pt(e, r, o), o;
}, ke = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, v = (t, e, r) => (ke(t, e, "read from private field"), r ? r.call(t) : e.get(t)), m = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Xe = (t, e, r, i) => (ke(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r), w = (t, e, r) => (ke(t, e, "access private method"), r), f, I, te, Je, ve, ze, we, Ye, Te, Qe, G, re, ge, Ze, j, Ce, Ee, et;
const Ut = "block-list-preview";
let h = class extends le {
  constructor() {
    super(), m(this, te), m(this, ve), m(this, we), m(this, Te), m(this, G), m(this, ge), m(this, j), m(this, Ee), m(this, f, void 0), m(this, I, void 0), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(de, (t) => {
      Xe(this, f, t), w(this, te, Je).call(this);
    });
  }
  set blockListValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockListValue = e;
  }
  get blockListValue() {
    return this._blockListValue;
  }
  async updated(t) {
    super.updated(t), t.has("content") && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      w(this, j, Ce).call(this);
    }, 500));
  }
  render() {
    return this._isLoading ? D`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? D`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? D`
                ${this._styleElement}
                <a 
                    href=${ae(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${ce(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
f = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
te = /* @__PURE__ */ new WeakSet();
Je = function() {
  w(this, ve, ze).call(this), w(this, we, Ye).call(this), w(this, Te, Qe).call(this);
};
ve = /* @__PURE__ */ new WeakSet();
ze = function() {
  var t;
  this.observe((t = v(this, f)) == null ? void 0 : t.settings, (e) => {
    var r;
    (r = e == null ? void 0 : e.blockList) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockList.stylesheet);
  });
};
we = /* @__PURE__ */ new WeakSet();
Ye = function() {
  this.consumeContext(ue, async (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
Te = /* @__PURE__ */ new WeakSet();
Qe = function() {
  this.getContext($e).then((t) => {
    Xe(this, I, t), this.observe(
      A([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        var i, o;
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", (i = v(this, f)) == null || i.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (o = v(this, f)) == null || o.setDocumentTypeUnique(this._blockContext.documentTypeUnique), w(this, G, re).call(this);
      }
    );
  }), v(this, I) == null && v(this, f) != null && this._blockContext.unique == "" && this.consumeContext(Le, (t) => {
    this.observe(t.content.structure.contentTypeUniques, (e) => {
      var r;
      this._blockContext.unique = ((r = v(this, f)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = e[0] ?? "", w(this, G, re).call(this);
    });
  });
};
G = /* @__PURE__ */ new WeakSet();
re = function() {
  this.consumeContext(ht, (t) => {
    this.observe(
      A([
        t.contentKey,
        t.settingsKey,
        t.workspaceEditContentPath,
        t.contentElementTypeAlias,
        t.contentElementTypeKey
      ]),
      async ([
        e,
        r,
        i,
        o,
        s
      ]) => {
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = i ?? "", this._blockContext.contentElementTypeAlias = o ?? "", this._blockContext.contentElementTypeKey = s ?? "", await w(this, ge, Ze).call(this);
      }
    );
  });
};
ge = /* @__PURE__ */ new WeakSet();
Ze = function() {
  this.consumeContext(dt, (t) => {
    this.observe(
      A([
        t.contents,
        t.settings,
        t.layouts,
        t.exposes,
        t.propertyAlias
      ]),
      async ([e, r, i, o, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockListValue = {
          contentData: (e == null ? void 0 : e.filter((n) => n.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((n) => n.key == this._blockContext.settingsUdi)) ?? [],
          expose: (o == null ? void 0 : o.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockList": (i == null ? void 0 : i.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, w(this, j, Ce).call(this);
      }
    );
  });
};
j = /* @__PURE__ */ new WeakSet();
Ce = async function() {
  const t = this._blockContext;
  if (v(this, f) != null && t.unique == "" && (t.unique = v(this, f).getUnique()), v(this, f) != null && t.documentTypeUnique == "" && (t.documentTypeUnique = v(this, f).getDocumentTypeUnique()), !w(this, Ee, et).call(this, t)) {
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
      requestBody: JSON.stringify(this.blockListValue)
    }, { data: i } = await X(this, J.previewListBlock(r));
    this._htmlMarkup = i ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
Ee = /* @__PURE__ */ new WeakSet();
et = function(t) {
  return t.unique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
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
T([
  u({ attribute: !1 })
], h.prototype, "content", 2);
T([
  u({ attribute: !1 })
], h.prototype, "settingsData", 2);
T([
  u({ attribute: !1 })
], h.prototype, "contentKey", 2);
T([
  u({ attribute: !1 })
], h.prototype, "config", 2);
T([
  C()
], h.prototype, "_htmlMarkup", 2);
T([
  C()
], h.prototype, "_isLoading", 2);
T([
  C()
], h.prototype, "_error", 2);
T([
  C()
], h.prototype, "_blockListValue", 2);
T([
  u({ attribute: !1 })
], h.prototype, "blockListValue", 1);
h = T([
  se(Ut)
], h);
var Dt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, S = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? Bt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && Dt(e, r, o), o;
}, Ot = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, Y = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, H = (t, e, r) => (Ot(t, e, "access private method"), r), ie, tt, xe, rt, F, Ae;
const Lt = "rich-text-preview";
let b = class extends le {
  constructor() {
    var t;
    super(), Y(this, ie), Y(this, xe), Y(this, F), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(ue, async (e) => {
      this.culture = e.getVariantId().culture ?? "";
    }), this.unique = (t = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : t[0], H(this, ie, tt).call(this);
  }
  set blockRteValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockRteValue = e;
  }
  get blockRteValue() {
    return this._blockRteValue;
  }
  async updated(t) {
    super.updated(t), t.has("content") && (this._previewTimeout && clearTimeout(this._previewTimeout), this._previewTimeout = window.setTimeout(() => {
      H(this, F, Ae).call(this);
    }, 500));
  }
  render() {
    if (this.htmlMarkup !== "")
      return D`
                <a href=${ae(this.workspaceEditContentPath)}>
                    ${ce(this.htmlMarkup)}
                </a>`;
  }
};
ie = /* @__PURE__ */ new WeakSet();
tt = function() {
  this.consumeContext(lt, (t) => {
    this.observe(
      A([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), H(this, xe, rt).call(this));
      }
    );
  });
};
xe = /* @__PURE__ */ new WeakSet();
rt = function() {
  this.consumeContext(pt, (t) => {
    this.observe(
      A([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await H(this, F, Ae).call(this);
      }
    );
  });
};
F = /* @__PURE__ */ new WeakSet();
Ae = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockRteValue)
  }, { data: e } = await X(this, J.previewRichTextMarkup(t));
  e && (this.htmlMarkup = e);
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
S([
  u({ attribute: !1 })
], b.prototype, "content", 2);
S([
  u({ attribute: !1 })
], b.prototype, "settingsData", 2);
S([
  u({ attribute: !1 })
], b.prototype, "contentKey", 2);
S([
  u({ attribute: !1 })
], b.prototype, "config", 2);
S([
  C()
], b.prototype, "htmlMarkup", 2);
S([
  C()
], b.prototype, "_blockRteValue", 2);
S([
  u({ attribute: !1 })
], b.prototype, "blockRteValue", 1);
b = S([
  se(Lt)
], b);
const $t = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => Mt)
  }
], Nt = [...$t];
var $, B, R, U;
class oe extends Oe {
  constructor(r) {
    super(r);
    q(this, $, void 0);
    q(this, B, void 0);
    q(this, R, void 0);
    q(this, U, void 0);
    P(this, B, new ct(void 0)), this.settings = d(this, B).asObservable(), P(this, R, new Ue("")), this.unique = d(this, R).asObservable(), P(this, U, new Ue("")), this.documentTypeUnique = d(this, U).asObservable(), P(this, $, new Me(r)), this.getSettings();
  }
  async getSettings() {
    const r = await d(this, $).getSettings();
    d(this, B).setValue(r);
  }
  getUnique() {
    return d(this, R).getValue();
  }
  async setUnique(r) {
    r != "" && d(this, R).setValue(r);
  }
  getDocumentTypeUnique() {
    return d(this, U).getValue();
  }
  async setDocumentTypeUnique(r) {
    r != "" && d(this, U).setValue(r);
  }
}
$ = new WeakMap(), B = new WeakMap(), R = new WeakMap(), U = new WeakMap();
const Mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: oe,
  default: oe
}, Symbol.toStringTag, { value: "Module" })), er = async (t, e) => {
  var s, n, a;
  const i = await new Me(t).getSettings();
  let o = [];
  if (i) {
    if (i.blockGrid.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: y,
        forBlockEditor: "block-grid"
      };
      ((s = i.blockGrid.contentTypes) == null ? void 0 : s.length) !== 0 && (c.forContentTypeAlias = i.blockGrid.contentTypes), o.push(c);
    }
    if (i.blockList.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.ListCustomView",
        name: "BlockPreview List Custom View",
        element: h,
        forBlockEditor: "block-list"
      };
      ((n = i.blockList.contentTypes) == null ? void 0 : n.length) !== 0 && (c.forContentTypeAlias = i.blockList.contentTypes), o.push(c);
    }
    if (i.richText.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.RichTextCustomView",
        name: "BlockPreview Rich Text Custom View",
        element: b,
        forBlockEditor: "block-rte"
      };
      ((a = i.richText.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = i.richText.contentTypes), o.push(c);
    }
  }
  e.registerMany([
    ...o,
    ...Nt
  ]), t.provideContext(de, new oe(t)), t.consumeContext(nt, async (c) => {
    if (!c)
      return;
    const l = c.getOpenApiConfiguration();
    x.BASE = l.base, x.TOKEN = l.token, x.WITH_CREDENTIALS = l.withCredentials, x.CREDENTIALS = l.credentials;
  });
};
export {
  y as BlockGridPreviewCustomView,
  h as BlockListPreviewCustomView,
  b as RichTextPreviewCustomView,
  xt as SettingsDataSource,
  Me as SettingsRepository,
  er as onInit
};
//# sourceMappingURL=assets.js.map
