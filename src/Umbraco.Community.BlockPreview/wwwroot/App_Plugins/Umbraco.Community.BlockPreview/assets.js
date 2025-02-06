var Pe = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var u = (t, e, r) => (Pe(t, e, "read from private field"), r ? r.call(t) : e.get(t)), C = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, E = (t, e, r, i) => (Pe(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as nt } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as I } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as Be } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_WORKSPACE_CONTEXT as De } from "@umbraco-cms/backoffice/block";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as st, UMB_BLOCK_GRID_MANAGER_CONTEXT as at } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as Oe } from "@umbraco-cms/backoffice/document";
import { css as ee, state as v, property as te, customElement as re, html as S, ifDefined as ie, unsafeHTML as oe } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ne } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as T, UmbObjectState as ct, UmbStringState as qe } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as se, UMB_PROPERTY_CONTEXT as lt } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as ut } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as ht, UMB_BLOCK_LIST_MANAGER_CONTEXT as dt } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as pt } from "@umbraco-cms/backoffice/block-rte";
class Re extends Error {
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
class Ue {
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
const w = {
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
    request: new Ue(),
    response: new Ue()
  }
}, O = (t) => typeof t == "string", H = (t) => O(t) && t !== "", ae = (t) => t instanceof Blob, Le = (t) => t instanceof FormData, _t = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, bt = (t) => {
  const e = [], r = (o, s) => {
    e.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(s))}`);
  }, i = (o, s) => {
    s != null && (s instanceof Date ? r(o, s.toISOString()) : Array.isArray(s) ? s.forEach((n) => i(o, n)) : typeof s == "object" ? Object.entries(s).forEach(([n, a]) => i(`${o}[${n}]`, a)) : r(o, s));
  };
  return Object.entries(t).forEach(([o, s]) => i(o, s)), e.length ? `?${e.join("&")}` : "";
}, kt = (t, e) => {
  const r = t.ENCODE_PATH || encodeURI, i = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (s, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : s;
  }), o = t.BASE + i;
  return e.query ? o + bt(e.query) : o;
}, mt = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (i, o) => {
      O(o) || ae(o) ? e.append(i, o) : e.append(i, JSON.stringify(o));
    };
    return Object.entries(t.formData).filter(([, i]) => i != null).forEach(([i, o]) => {
      Array.isArray(o) ? o.forEach((s) => r(i, s)) : r(i, o);
    }), e;
  }
}, $ = async (t, e) => typeof e == "function" ? e(t) : e, vt = async (t, e) => {
  const [r, i, o, s] = await Promise.all([
    // @ts-ignore
    $(e, t.TOKEN),
    // @ts-ignore
    $(e, t.USERNAME),
    // @ts-ignore
    $(e, t.PASSWORD),
    // @ts-ignore
    $(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...s,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (H(r) && (n.Authorization = `Bearer ${r}`), H(i) && H(o)) {
    const a = _t(`${i}:${o}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : ae(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : O(e.body) ? n["Content-Type"] = "text/plain" : Le(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, wt = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : O(t.body) || ae(t.body) || Le(t.body) ? t.body : JSON.stringify(t.body);
}, gt = async (t, e, r, i, o, s, n) => {
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
}, Tt = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (O(r))
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
    throw new Re(t, e, i);
  if (!e.ok) {
    const o = e.status ?? "unknown", s = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new Re(
      t,
      e,
      `Generic Error: status: ${o}; status text: ${s}; body: ${n}`
    );
  }
}, N = (t, e) => new yt(async (r, i, o) => {
  try {
    const s = kt(t, e), n = mt(e), a = wt(e), c = await vt(t, e);
    if (!o.isCancelled) {
      let l = await gt(t, e, s, a, n, c, o);
      for (const ot of t.interceptors.response._fns)
        l = await ot(l);
      const xe = await Ct(l), it = Tt(l, e.responseHeader);
      let Ae = xe;
      e.responseTransformer && l.ok && (Ae = await e.responseTransformer(xe));
      const Se = {
        url: s,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: it ?? Ae
      };
      Et(e, Se), r(Se.body);
    }
  } catch (s) {
    i(s);
  }
});
class G {
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
    return N(w, {
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
    return N(w, {
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
    return N(w, {
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
    return N(w, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
}
var U;
class xt {
  constructor(e) {
    C(this, U, void 0);
    E(this, U, e);
  }
  async getSettings() {
    return await I(u(this, U), G.getSettings());
  }
}
U = new WeakMap();
var B;
class $e extends Be {
  constructor(r) {
    super(r);
    C(this, B, void 0);
    E(this, B, new xt(r));
  }
  async getSettings() {
    const r = await u(this, B).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
B = new WeakMap();
const ce = new ut("BlockPreviewContext");
var At = Object.defineProperty, St = Object.getOwnPropertyDescriptor, L = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? St(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && At(e, r, o), o;
}, le = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, y = (t, e, r) => (le(t, e, "read from private field"), r ? r.call(t) : e.get(t)), p = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Ne = (t, e, r, i) => (le(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r), b = (t, e, r) => (le(t, e, "access private method"), r), h, M, X, Me, ue, Ve, he, We, de, Ke, V, J, pe, Ie, fe, Ge, ye, je;
const Pt = "block-grid-preview";
let g = class extends ne {
  constructor() {
    super(), p(this, X), p(this, ue), p(this, he), p(this, de), p(this, V), p(this, pe), p(this, fe), p(this, ye), p(this, h, void 0), p(this, M, void 0), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(ce, (t) => {
      Ne(this, h, t), b(this, X, Me).call(this);
    });
  }
  set blockGridValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockGridValue = e;
  }
  get blockGridValue() {
    return this._blockGridValue;
  }
  render() {
    return this._isLoading ? S`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? S`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? S`
                ${this._styleElement}
                <a 
                    href=${ie(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${oe(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
h = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
X = /* @__PURE__ */ new WeakSet();
Me = function() {
  b(this, ue, Ve).call(this), b(this, he, We).call(this), b(this, de, Ke).call(this);
};
ue = /* @__PURE__ */ new WeakSet();
Ve = function() {
  var t;
  this.observe((t = y(this, h)) == null ? void 0 : t.settings, (e) => {
    var r;
    (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockGrid.stylesheet);
  });
};
he = /* @__PURE__ */ new WeakSet();
We = function() {
  this.consumeContext(se, (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
de = /* @__PURE__ */ new WeakSet();
Ke = async function() {
  this.getContext(Oe).then((t) => {
    Ne(this, M, t), this.observe(
      T([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        var i, o;
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", (i = y(this, h)) == null || i.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (o = y(this, h)) == null || o.setDocumentTypeUnique(this._blockContext.documentTypeUnique), b(this, V, J).call(this);
      }
    );
  }), y(this, M) == null && y(this, h) != null && this._blockContext.unique == "" && this.consumeContext(De, (t) => {
    this.observe(t.content.structure.contentTypeUniques, (e) => {
      var r;
      this._blockContext.unique = ((r = y(this, h)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = e[0] ?? "", b(this, V, J).call(this);
    });
  });
};
V = /* @__PURE__ */ new WeakSet();
J = async function() {
  this.consumeContext(st, async (t) => {
    this.observe(
      T([
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
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = i ?? "", this._blockContext.contentElementTypeAlias = o ?? "", this._blockContext.contentElementTypeKey = s ?? "", await b(this, pe, Ie).call(this);
      }
    );
  });
};
pe = /* @__PURE__ */ new WeakSet();
Ie = async function() {
  this.consumeContext(at, (t) => {
    this.observe(
      T([
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
        }, await b(this, fe, Ge).call(this);
      }
    );
  });
};
fe = /* @__PURE__ */ new WeakSet();
Ge = async function() {
  const t = this._blockContext;
  if (y(this, h) != null && t.unique == "" && (t.unique = y(this, h).getUnique()), y(this, h) != null && t.documentTypeUnique == "" && (t.documentTypeUnique = y(this, h).getDocumentTypeUnique()), !b(this, ye, je).call(this, t)) {
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
    }, { data: i } = await I(this, G.previewGridBlock(r));
    this._htmlMarkup = i ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
ye = /* @__PURE__ */ new WeakSet();
je = function(t) {
  return t.unique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
g.styles = [
  ee`
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
L([
  v()
], g.prototype, "_htmlMarkup", 2);
L([
  v()
], g.prototype, "_isLoading", 2);
L([
  v()
], g.prototype, "_error", 2);
L([
  te({ attribute: !1 })
], g.prototype, "blockGridValue", 1);
g = L([
  re(Pt)
], g);
var qt = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, R = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? Rt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && qt(e, r, o), o;
}, _e = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, _ = (t, e, r) => (_e(t, e, "read from private field"), r ? r.call(t) : e.get(t)), f = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, He = (t, e, r, i) => (_e(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r), k = (t, e, r) => (_e(t, e, "access private method"), r), d, W, z, Fe, be, Xe, ke, Je, me, ze, K, Y, ve, Ye, we, Qe, ge, Ze;
const Ut = "block-list-preview";
let m = class extends ne {
  constructor() {
    super(), f(this, z), f(this, be), f(this, ke), f(this, me), f(this, K), f(this, ve), f(this, we), f(this, ge), f(this, d, void 0), f(this, W, void 0), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
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
    }, this.consumeContext(ce, (t) => {
      He(this, d, t), k(this, z, Fe).call(this);
    });
  }
  set blockListValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockListValue = e;
  }
  get blockListValue() {
    return this._blockListValue;
  }
  render() {
    return this._isLoading ? S`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? S`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? S`
                ${this._styleElement}
                <a 
                    href=${ie(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${oe(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
d = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
Fe = function() {
  k(this, be, Xe).call(this), k(this, ke, Je).call(this), k(this, me, ze).call(this);
};
be = /* @__PURE__ */ new WeakSet();
Xe = function() {
  var t;
  this.observe((t = _(this, d)) == null ? void 0 : t.settings, (e) => {
    var r;
    debugger;
    (r = e == null ? void 0 : e.blockList) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockList.stylesheet);
  });
};
ke = /* @__PURE__ */ new WeakSet();
Je = function() {
  this.consumeContext(se, async (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
me = /* @__PURE__ */ new WeakSet();
ze = function() {
  this.getContext(Oe).then((t) => {
    He(this, W, t), this.observe(
      T([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        var i, o;
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", (i = _(this, d)) == null || i.setUnique(this._blockContext.unique), this._blockContext.documentTypeUnique = r ?? "", (o = _(this, d)) == null || o.setDocumentTypeUnique(this._blockContext.documentTypeUnique), k(this, K, Y).call(this);
      }
    );
  }), _(this, W) == null && _(this, d) != null && this._blockContext.unique == "" && this.consumeContext(De, (t) => {
    this.observe(t.content.structure.contentTypeUniques, (e) => {
      var r;
      this._blockContext.unique = ((r = _(this, d)) == null ? void 0 : r.getUnique()) ?? "", this._blockContext.documentTypeUnique = e[0] ?? "", k(this, K, Y).call(this);
    });
  });
};
K = /* @__PURE__ */ new WeakSet();
Y = function() {
  this.consumeContext(ht, (t) => {
    this.observe(
      T([
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
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = i ?? "", this._blockContext.contentElementTypeAlias = o ?? "", this._blockContext.contentElementTypeKey = s ?? "", await k(this, ve, Ye).call(this);
      }
    );
  });
};
ve = /* @__PURE__ */ new WeakSet();
Ye = function() {
  this.consumeContext(dt, (t) => {
    this.observe(
      T([
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
        }, k(this, we, Qe).call(this);
      }
    );
  });
};
we = /* @__PURE__ */ new WeakSet();
Qe = async function() {
  const t = this._blockContext;
  if (_(this, d) != null && t.unique == "" && (t.unique = _(this, d).getUnique()), _(this, d) != null && t.documentTypeUnique == "" && (t.documentTypeUnique = _(this, d).getDocumentTypeUnique()), !k(this, ge, Ze).call(this, t)) {
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
    }, { data: i } = await I(this, G.previewListBlock(r));
    this._htmlMarkup = i ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
ge = /* @__PURE__ */ new WeakSet();
Ze = function(t) {
  return t.unique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
m.styles = [
  ee`
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
R([
  v()
], m.prototype, "_htmlMarkup", 2);
R([
  v()
], m.prototype, "_isLoading", 2);
R([
  v()
], m.prototype, "_error", 2);
R([
  v()
], m.prototype, "_blockListValue", 2);
R([
  te({ attribute: !1 })
], m.prototype, "blockListValue", 1);
m = R([
  re(Ut)
], m);
var Bt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, j = (t, e, r, i) => {
  for (var o = i > 1 ? void 0 : i ? Dt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (i ? n(e, r, o) : n(o)) || o);
  return i && o && Bt(e, r, o), o;
}, Ot = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, F = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Te = (t, e, r) => (Ot(t, e, "access private method"), r), Q, et, Ce, tt, Ee, rt;
const Lt = "rich-text-preview";
let P = class extends ne {
  constructor() {
    var t;
    super(), F(this, Q), F(this, Ce), F(this, Ee), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(se, async (e) => {
      this.culture = e.getVariantId().culture ?? "";
    }), this.unique = (t = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : t[0], Te(this, Q, et).call(this);
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
      return S`
                <a href=${ie(this.workspaceEditContentPath)}>
                    ${oe(this.htmlMarkup)}
                </a>`;
  }
};
Q = /* @__PURE__ */ new WeakSet();
et = function() {
  this.consumeContext(lt, (t) => {
    this.observe(
      T([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), Te(this, Ce, tt).call(this));
      }
    );
  });
};
Ce = /* @__PURE__ */ new WeakSet();
tt = function() {
  this.consumeContext(pt, (t) => {
    this.observe(
      T([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await Te(this, Ee, rt).call(this);
      }
    );
  });
};
Ee = /* @__PURE__ */ new WeakSet();
rt = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockRteValue)
  }, { data: e } = await I(this, G.previewRichTextMarkup(t));
  e && (this.htmlMarkup = e);
};
P.styles = [
  ee`
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
j([
  v()
], P.prototype, "htmlMarkup", 2);
j([
  v()
], P.prototype, "_blockRteValue", 2);
j([
  te({ attribute: !1 })
], P.prototype, "blockRteValue", 1);
P = j([
  re(Lt)
], P);
const $t = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => Mt)
  }
], Nt = [...$t];
var D, q, x, A;
class Z extends Be {
  constructor(r) {
    super(r);
    C(this, D, void 0);
    C(this, q, void 0);
    C(this, x, void 0);
    C(this, A, void 0);
    E(this, q, new ct(void 0)), this.settings = u(this, q).asObservable(), E(this, x, new qe("")), this.unique = u(this, x).asObservable(), E(this, A, new qe("")), this.documentTypeUnique = u(this, A).asObservable(), E(this, D, new $e(r)), this.getSettings();
  }
  async getSettings() {
    const r = await u(this, D).getSettings();
    u(this, q).setValue(r);
  }
  getUnique() {
    return u(this, x).getValue();
  }
  async setUnique(r) {
    r != "" && u(this, x).setValue(r);
  }
  getDocumentTypeUnique() {
    return u(this, A).getValue();
  }
  async setDocumentTypeUnique(r) {
    r != "" && u(this, A).setValue(r);
  }
}
D = new WeakMap(), q = new WeakMap(), x = new WeakMap(), A = new WeakMap();
const Mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: Z,
  default: Z
}, Symbol.toStringTag, { value: "Module" })), er = async (t, e) => {
  var s, n, a;
  const i = await new $e(t).getSettings();
  let o = [];
  if (i) {
    if (i.blockGrid.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: g,
        forBlockEditor: "block-grid"
      };
      ((s = i.blockGrid.contentTypes) == null ? void 0 : s.length) !== 0 && (c.forContentTypeAlias = i.blockGrid.contentTypes), o.push(c);
    }
    if (i.blockList.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.ListCustomView",
        name: "BlockPreview List Custom View",
        element: m,
        forBlockEditor: "block-list"
      };
      ((n = i.blockList.contentTypes) == null ? void 0 : n.length) !== 0 && (c.forContentTypeAlias = i.blockList.contentTypes), o.push(c);
    }
    if (i.richText.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.RichTextCustomView",
        name: "BlockPreview Rich Text Custom View",
        element: P,
        forBlockEditor: "block-rte"
      };
      ((a = i.richText.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = i.richText.contentTypes), o.push(c);
    }
  }
  e.registerMany([
    ...o,
    ...Nt
  ]), t.provideContext(ce, new Z(t)), t.consumeContext(nt, async (c) => {
    if (!c)
      return;
    const l = c.getOpenApiConfiguration();
    w.BASE = l.base, w.TOKEN = l.token, w.WITH_CREDENTIALS = l.withCredentials, w.CREDENTIALS = l.credentials;
  });
};
export {
  g as BlockGridPreviewCustomView,
  m as BlockListPreviewCustomView,
  P as RichTextPreviewCustomView,
  xt as SettingsDataSource,
  $e as SettingsRepository,
  er as onInit
};
//# sourceMappingURL=assets.js.map
