var fe = (t) => {
  throw TypeError(t);
};
var ye = (t, e, r) => e.has(t) || fe("Cannot " + r);
var d = (t, e, r) => (ye(t, e, "read from private field"), r ? r.call(t) : e.get(t)), R = (t, e, r) => e.has(t) ? fe("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), U = (t, e, r, i) => (ye(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as He } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as W } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as ke } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_WORKSPACE_CONTEXT as ve } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as Fe, UMB_BLOCK_GRID_MANAGER_CONTEXT as Xe } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as we } from "@umbraco-cms/backoffice/document";
import { css as Z, property as u, state as C, customElement as ee, html as D, ifDefined as te, unsafeHTML as re } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ie } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as A, UmbObjectState as Je, UmbStringState as be } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as oe, UMB_PROPERTY_CONTEXT as ze } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as Ye } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as Qe, UMB_BLOCK_LIST_MANAGER_CONTEXT as Ze } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as et } from "@umbraco-cms/backoffice/block-rte";
class _e extends Error {
  constructor(e, r, i) {
    super(i), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = e;
  }
}
class tt extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class rt {
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
      this.cancelHandlers.length = 0, this._reject && this._reject(new tt("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class me {
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
    request: new me(),
    response: new me()
  }
}, N = (t) => typeof t == "string", F = (t) => N(t) && t !== "", ne = (t) => t instanceof Blob, Te = (t) => t instanceof FormData, it = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, ot = (t) => {
  const e = [], r = (o, s) => {
    e.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(s))}`);
  }, i = (o, s) => {
    s != null && (s instanceof Date ? r(o, s.toISOString()) : Array.isArray(s) ? s.forEach((n) => i(o, n)) : typeof s == "object" ? Object.entries(s).forEach(([n, a]) => i(`${o}[${n}]`, a)) : r(o, s));
  };
  return Object.entries(t).forEach(([o, s]) => i(o, s)), e.length ? `?${e.join("&")}` : "";
}, nt = (t, e) => {
  const r = encodeURI, i = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (s, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : s;
  }), o = t.BASE + i;
  return e.query ? o + ot(e.query) : o;
}, st = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (i, o) => {
      N(o) || ne(o) ? e.append(i, o) : e.append(i, JSON.stringify(o));
    };
    return Object.entries(t.formData).filter(([, i]) => i != null).forEach(([i, o]) => {
      Array.isArray(o) ? o.forEach((s) => r(i, s)) : r(i, o);
    }), e;
  }
}, V = async (t, e) => typeof e == "function" ? e(t) : e, at = async (t, e) => {
  const [r, i, o, s] = await Promise.all([
    // @ts-ignore
    V(e, t.TOKEN),
    // @ts-ignore
    V(e, t.USERNAME),
    // @ts-ignore
    V(e, t.PASSWORD),
    // @ts-ignore
    V(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...s,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (F(r) && (n.Authorization = `Bearer ${r}`), F(i) && F(o)) {
    const a = it(`${i}:${o}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : ne(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : N(e.body) ? n["Content-Type"] = "text/plain" : Te(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, ct = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : N(t.body) || ne(t.body) || Te(t.body) ? t.body : JSON.stringify(t.body);
}, lt = async (t, e, r, i, o, s, n) => {
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
}, ut = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (N(r))
      return r;
  }
}, ht = async (t) => {
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
}, dt = (t, e) => {
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
    throw new _e(t, e, i);
  if (!e.ok) {
    const o = e.status ?? "unknown", s = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new _e(
      t,
      e,
      `Generic Error: status: ${o}; status text: ${s}; body: ${n}`
    );
  }
}, I = (t, e) => new rt(async (r, i, o) => {
  try {
    const s = nt(t, e), n = st(e), a = ct(e), c = await at(t, e);
    if (!o.isCancelled) {
      let l = await lt(t, e, s, a, n, c, o);
      for (const We of t.interceptors.response._fns)
        l = await We(l);
      const he = await ht(l), Ge = ut(l, e.responseHeader);
      let de = he;
      e.responseTransformer && l.ok && (de = await e.responseTransformer(he));
      const pe = {
        url: s,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: Ge ?? de
      };
      dt(e, pe), r(pe.body);
    }
  } catch (s) {
    i(s);
  }
});
class H {
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.contentUdi
   * @param data.settingsUdi
   * @param data.blockIndex
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewGridBlock(e = {}) {
    return I(x, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/grid",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique,
        contentUdi: e.contentUdi,
        settingsUdi: e.settingsUdi,
        blockIndex: e.blockIndex
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user does not have access to this resource"
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
    return I(x, {
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
        403: "The authenticated user does not have access to this resource"
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
    return I(x, {
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
        403: "The authenticated user does not have access to this resource"
      }
    });
  }
  /**
   * @returns unknown OK
   * @throws ApiError
   */
  static getSettings() {
    return I(x, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user does not have access to this resource"
      }
    });
  }
}
var L;
class pt {
  constructor(e) {
    R(this, L);
    U(this, L, e);
  }
  async getSettings() {
    return await W(d(this, L), H.getSettings());
  }
}
L = new WeakMap();
var $;
class ge extends ke {
  constructor(r) {
    super(r);
    R(this, $);
    U(this, $, new pt(r));
  }
  async getSettings() {
    const r = await d(this, $).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
$ = new WeakMap();
const se = new Ye("BlockPreviewContext");
var ft = Object.defineProperty, yt = Object.getOwnPropertyDescriptor, Ce = (t) => {
  throw TypeError(t);
}, E = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? yt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && ft(e, r, o), o;
}, ae = (t, e, r) => e.has(t) || Ce("Cannot " + r), k = (t, e, r) => (ae(t, e, "read from private field"), e.get(t)), X = (t, e, r) => e.has(t) ? Ce("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Ee = (t, e, r, i) => (ae(t, e, "write to private field"), e.set(t, r), r), g = (t, e, r) => (ae(t, e, "access private method"), r), p, K, _, xe, Ae, qe, Re, z, Ue, Pe, Se;
const bt = "block-grid-preview";
let b = class extends ie {
  constructor() {
    super(), X(this, _), X(this, p), X(this, K), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(se, (t) => {
      Ee(this, p, t), g(this, _, xe).call(this);
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
      g(this, _, Pe).call(this);
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
                    href=${te(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${re(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
p = /* @__PURE__ */ new WeakMap();
K = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakSet();
xe = function() {
  g(this, _, Ae).call(this), g(this, _, qe).call(this), g(this, _, Re).call(this);
};
Ae = function() {
  var t;
  this.observe((t = k(this, p)) == null ? void 0 : t.settings, (e) => {
    var r;
    (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockGrid.stylesheet);
  });
};
qe = function() {
  this.consumeContext(oe, (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
Re = async function() {
  this.getContext(we).then((t) => {
    Ee(this, K, t), this.observe(
      A([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        var i, o;
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", (i = k(this, p)) == null || i.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (o = k(this, p)) == null || o.setDocumentTypeUnique(this._blockContext.documentTypeUnique), g(this, _, z).call(this);
      }
    );
  }), k(this, K) == null && k(this, p) != null && this._blockContext.unique == "" && this.consumeContext(ve, (t) => {
    this.observe(t.content.structure.contentTypeUniques, (e) => {
      var r;
      this._blockContext.unique = ((r = k(this, p)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = e[0] ?? "", g(this, _, z).call(this);
    });
  });
};
z = async function() {
  this.consumeContext(Fe, async (t) => {
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
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = i ?? "", this._blockContext.contentElementTypeAlias = o ?? "", this._blockContext.contentElementTypeKey = s ?? "", await g(this, _, Ue).call(this);
      }
    );
  });
};
Ue = async function() {
  this.consumeContext(Xe, (t) => {
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
        }, this._blockContext.blockIndex = e.indexOf(this.blockGridValue.contentData[0]);
      }
    );
  });
};
Pe = async function() {
  const t = this._blockContext;
  if (k(this, p) != null && t.unique == "" && (t.unique = k(this, p).getUnique()), k(this, p) != null && t.documentTypeUnique == "" && (t.documentTypeUnique = k(this, p).getDocumentTypeUnique()), !g(this, _, Se).call(this, t)) {
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
      requestBody: JSON.stringify(this.blockGridValue),
      blockIndex: t.blockIndex
    }, { data: i } = await W(this, H.previewGridBlock(r));
    this._htmlMarkup = i ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
Se = function(t) {
  return t.unique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
b.styles = [
  Z`
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
], b.prototype, "content", 2);
E([
  u({ attribute: !1 })
], b.prototype, "settingsData", 2);
E([
  u({ attribute: !1 })
], b.prototype, "contentKey", 2);
E([
  u({ attribute: !1 })
], b.prototype, "config", 2);
E([
  C()
], b.prototype, "_htmlMarkup", 2);
E([
  C()
], b.prototype, "_isLoading", 2);
E([
  C()
], b.prototype, "_error", 2);
E([
  u({ attribute: !1 })
], b.prototype, "blockGridValue", 1);
b = E([
  ee(bt)
], b);
var _t = Object.defineProperty, mt = Object.getOwnPropertyDescriptor, De = (t) => {
  throw TypeError(t);
}, T = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? mt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && _t(e, r, o), o;
}, ce = (t, e, r) => e.has(t) || De("Cannot " + r), v = (t, e, r) => (ce(t, e, "read from private field"), e.get(t)), J = (t, e, r) => e.has(t) ? De("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Be = (t, e, r, i) => (ce(t, e, "write to private field"), e.set(t, r), r), w = (t, e, r) => (ce(t, e, "access private method"), r), f, j, y, Oe, Le, $e, Me, Y, Ne, le, Ve;
const kt = "block-list-preview";
let h = class extends ie {
  constructor() {
    super(), J(this, y), J(this, f), J(this, j), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(se, (t) => {
      Be(this, f, t), w(this, y, Oe).call(this);
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
      w(this, y, le).call(this);
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
                    href=${te(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${re(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
f = /* @__PURE__ */ new WeakMap();
j = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakSet();
Oe = function() {
  w(this, y, Le).call(this), w(this, y, $e).call(this), w(this, y, Me).call(this);
};
Le = function() {
  var t;
  this.observe((t = v(this, f)) == null ? void 0 : t.settings, (e) => {
    var r;
    (r = e == null ? void 0 : e.blockList) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockList.stylesheet);
  });
};
$e = function() {
  this.consumeContext(oe, async (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
Me = function() {
  this.getContext(we).then((t) => {
    Be(this, j, t), this.observe(
      A([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        var i, o;
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", (i = v(this, f)) == null || i.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (o = v(this, f)) == null || o.setDocumentTypeUnique(this._blockContext.documentTypeUnique), w(this, y, Y).call(this);
      }
    );
  }), v(this, j) == null && v(this, f) != null && this._blockContext.unique == "" && this.consumeContext(ve, (t) => {
    this.observe(t.content.structure.contentTypeUniques, (e) => {
      var r;
      this._blockContext.unique = ((r = v(this, f)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = e[0] ?? "", w(this, y, Y).call(this);
    });
  });
};
Y = function() {
  this.consumeContext(Qe, (t) => {
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
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = i ?? "", this._blockContext.contentElementTypeAlias = o ?? "", this._blockContext.contentElementTypeKey = s ?? "", await w(this, y, Ne).call(this);
      }
    );
  });
};
Ne = function() {
  this.consumeContext(Ze, (t) => {
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
        }, w(this, y, le).call(this);
      }
    );
  });
};
le = async function() {
  const t = this._blockContext;
  if (v(this, f) != null && t.unique == "" && (t.unique = v(this, f).getUnique()), v(this, f) != null && t.documentTypeUnique == "" && (t.documentTypeUnique = v(this, f).getDocumentTypeUnique()), !w(this, y, Ve).call(this, t)) {
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
    }, { data: i } = await W(this, H.previewListBlock(r));
    this._htmlMarkup = i ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
Ve = function(t) {
  return t.unique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
h.styles = [
  Z`
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
  ee(kt)
], h);
var vt = Object.defineProperty, wt = Object.getOwnPropertyDescriptor, Ie = (t) => {
  throw TypeError(t);
}, q = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? wt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && vt(e, r, o), o;
}, Tt = (t, e, r) => e.has(t) || Ie("Cannot " + r), gt = (t, e, r) => e.has(t) ? Ie("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), G = (t, e, r) => (Tt(t, e, "access private method"), r), B, Ke, je, ue;
const Ct = "rich-text-preview";
let m = class extends ie {
  constructor() {
    var t;
    super(), gt(this, B), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(oe, async (e) => {
      this.culture = e.getVariantId().culture ?? "";
    }), this.unique = (t = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : t[0], G(this, B, Ke).call(this);
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
      G(this, B, ue).call(this);
    }, 500));
  }
  render() {
    if (this.htmlMarkup !== "")
      return D`
                <a href=${te(this.workspaceEditContentPath)}>
                    ${re(this.htmlMarkup)}
                </a>`;
  }
};
B = /* @__PURE__ */ new WeakSet();
Ke = function() {
  this.consumeContext(ze, (t) => {
    this.observe(
      A([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), G(this, B, je).call(this));
      }
    );
  });
};
je = function() {
  this.consumeContext(et, (t) => {
    this.observe(
      A([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await G(this, B, ue).call(this);
      }
    );
  });
};
ue = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout) return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockRteValue)
  }, { data: e } = await W(this, H.previewRichTextMarkup(t));
  e && (this.htmlMarkup = e);
};
m.styles = [
  Z`
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
  u({ attribute: !1 })
], m.prototype, "content", 2);
q([
  u({ attribute: !1 })
], m.prototype, "settingsData", 2);
q([
  u({ attribute: !1 })
], m.prototype, "contentKey", 2);
q([
  u({ attribute: !1 })
], m.prototype, "config", 2);
q([
  C()
], m.prototype, "htmlMarkup", 2);
q([
  C()
], m.prototype, "_blockRteValue", 2);
q([
  u({ attribute: !1 })
], m.prototype, "blockRteValue", 1);
m = q([
  ee(Ct)
], m);
const Et = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => At)
  }
], xt = [...Et];
var M, O, P, S;
class Q extends ke {
  constructor(r) {
    super(r);
    R(this, M);
    R(this, O);
    R(this, P);
    R(this, S);
    U(this, O, new Je(void 0)), this.settings = d(this, O).asObservable(), U(this, P, new be("")), this.unique = d(this, P).asObservable(), U(this, S, new be("")), this.documentTypeUnique = d(this, S).asObservable(), U(this, M, new ge(r)), this.getSettings();
  }
  async getSettings() {
    const r = await d(this, M).getSettings();
    d(this, O).setValue(r);
  }
  getUnique() {
    return d(this, P).getValue();
  }
  async setUnique(r) {
    r != "" && d(this, P).setValue(r);
  }
  getDocumentTypeUnique() {
    return d(this, S).getValue();
  }
  async setDocumentTypeUnique(r) {
    r != "" && d(this, S).setValue(r);
  }
}
M = new WeakMap(), O = new WeakMap(), P = new WeakMap(), S = new WeakMap();
const At = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: Q,
  default: Q
}, Symbol.toStringTag, { value: "Module" })), Kt = async (t, e) => {
  var s, n, a;
  const i = await new ge(t).getSettings();
  let o = [];
  if (i) {
    if (i.blockGrid.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: b,
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
        element: m,
        forBlockEditor: "block-rte"
      };
      ((a = i.richText.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = i.richText.contentTypes), o.push(c);
    }
  }
  e.registerMany([
    ...o,
    ...xt
  ]), t.provideContext(se, new Q(t)), t.consumeContext(He, async (c) => {
    if (!c) return;
    const l = c.getOpenApiConfiguration();
    x.BASE = l.base, x.TOKEN = l.token, x.WITH_CREDENTIALS = l.withCredentials, x.CREDENTIALS = l.credentials;
  });
};
export {
  b as BlockGridPreviewCustomView,
  h as BlockListPreviewCustomView,
  m as RichTextPreviewCustomView,
  pt as SettingsDataSource,
  ge as SettingsRepository,
  Kt as onInit
};
//# sourceMappingURL=assets.js.map
