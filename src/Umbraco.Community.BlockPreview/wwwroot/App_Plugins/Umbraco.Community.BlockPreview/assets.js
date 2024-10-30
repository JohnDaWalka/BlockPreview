var W = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var h = (t, e, r) => (W(t, e, "read from private field"), r ? r.call(t) : e.get(t)), m = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, b = (t, e, r, s) => (W(t, e, "write to private field"), s ? s.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as me } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as D } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as J } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as be } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as z } from "@umbraco-cms/backoffice/document";
import { css as Y, state as L, property as Q, customElement as Z, html as ee, ifDefined as te, unsafeHTML as re } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as se } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as y, UmbObjectState as ve } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as ie, UMB_PROPERTY_CONTEXT as oe } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as ke } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as we } from "@umbraco-cms/backoffice/block-list";
class F extends Error {
  constructor(e, r, s) {
    super(s), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = e;
  }
}
class Ee extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class Te {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((r, s) => {
      this._resolve = r, this._reject = s;
      const i = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(a));
      }, o = (a) => {
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
      }), e(i, o, n);
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
      this.cancelHandlers.length = 0, this._reject && this._reject(new Ee("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class X {
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
const u = {
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
    request: new X(),
    response: new X()
  }
}, E = (t) => typeof t == "string", S = (t) => E(t) && t !== "", N = (t) => t instanceof Blob, ne = (t) => t instanceof FormData, _e = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, ge = (t) => {
  const e = [], r = (i, o) => {
    e.push(`${encodeURIComponent(i)}=${encodeURIComponent(String(o))}`);
  }, s = (i, o) => {
    o != null && (o instanceof Date ? r(i, o.toISOString()) : Array.isArray(o) ? o.forEach((n) => s(i, n)) : typeof o == "object" ? Object.entries(o).forEach(([n, a]) => s(`${i}[${n}]`, a)) : r(i, o));
  };
  return Object.entries(t).forEach(([i, o]) => s(i, o)), e.length ? `?${e.join("&")}` : "";
}, Ce = (t, e) => {
  const r = t.ENCODE_PATH || encodeURI, s = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (o, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : o;
  }), i = t.BASE + s;
  return e.query ? i + ge(e.query) : i;
}, Ae = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (s, i) => {
      E(i) || N(i) ? e.append(s, i) : e.append(s, JSON.stringify(i));
    };
    return Object.entries(t.formData).filter(([, s]) => s != null).forEach(([s, i]) => {
      Array.isArray(i) ? i.forEach((o) => r(s, o)) : r(s, i);
    }), e;
  }
}, T = async (t, e) => typeof e == "function" ? e(t) : e, Se = async (t, e) => {
  const [r, s, i, o] = await Promise.all([
    // @ts-ignore
    T(e, t.TOKEN),
    // @ts-ignore
    T(e, t.USERNAME),
    // @ts-ignore
    T(e, t.PASSWORD),
    // @ts-ignore
    T(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...o,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (S(r) && (n.Authorization = `Bearer ${r}`), S(s) && S(i)) {
    const a = _e(`${s}:${i}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : N(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : E(e.body) ? n["Content-Type"] = "text/plain" : ne(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, Re = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : E(t.body) || N(t.body) || ne(t.body) ? t.body : JSON.stringify(t.body);
}, xe = async (t, e, r, s, i, o, n) => {
  const a = new AbortController();
  let c = {
    headers: o,
    body: s ?? i,
    method: e.method,
    signal: a.signal
  };
  t.WITH_CREDENTIALS && (c.credentials = t.CREDENTIALS);
  for (const l of t.interceptors.request._fns)
    c = await l(c);
  return n(() => a.abort()), await fetch(r, c);
}, Pe = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (E(r))
      return r;
  }
}, qe = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e) {
        const r = ["application/octet-stream", "application/pdf", "application/zip", "audio/", "image/", "video/"];
        if (e.includes("application/json") || e.includes("+json"))
          return await t.json();
        if (r.some((s) => e.includes(s)))
          return await t.blob();
        if (e.includes("multipart/form-data"))
          return await t.formData();
        if (e.includes("text/"))
          return await t.text();
      }
    } catch (e) {
      console.error(e);
    }
}, Be = (t, e) => {
  const s = {
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
  if (s)
    throw new F(t, e, s);
  if (!e.ok) {
    const i = e.status ?? "unknown", o = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new F(
      t,
      e,
      `Generic Error: status: ${i}; status text: ${o}; body: ${n}`
    );
  }
}, _ = (t, e) => new Te(async (r, s, i) => {
  try {
    const o = Ce(t, e), n = Ae(e), a = Re(e), c = await Se(t, e);
    if (!i.isCancelled) {
      let l = await xe(t, e, o, a, n, c, i);
      for (const ye of t.interceptors.response._fns)
        l = await ye(l);
      const $ = await qe(l), fe = Pe(l, e.responseHeader);
      let H = $;
      e.responseTransformer && l.ok && (H = await e.responseTransformer($));
      const K = {
        url: o,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: fe ?? H
      };
      Be(e, K), r(K.body);
    }
  } catch (o) {
    s(o);
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
    return _(u, {
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
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewListBlock(e = {}) {
    return _(u, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/list",
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
    return _(u, {
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
    return _(u, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
}
var v;
class Oe {
  constructor(e) {
    m(this, v, void 0);
    b(this, v, e);
  }
  async getSettings() {
    return await D(h(this, v), U.getSettings());
  }
}
v = new WeakMap();
var k;
class ae extends J {
  constructor(r) {
    super(r);
    m(this, k, void 0);
    b(this, k, new Oe(r));
  }
  async getSettings() {
    const r = await h(this, k).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
k = new WeakMap();
const ce = new ke("BlockPreviewContext");
var De = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, j = (t, e, r, s) => {
  for (var i = s > 1 ? void 0 : s ? Le(e, r) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (s ? n(e, r, i) : n(i)) || i);
  return s && i && De(e, r, i), i;
}, Ne = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, R = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, V = (t, e, r) => (Ne(t, e, "access private method"), r), P, le, M, ue, G, de;
const Ue = "block-grid-preview";
let f = class extends se {
  constructor() {
    super(), R(this, P), R(this, M), R(this, G), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.contentUdi = "", this.settingsUdi = null, this.blockEditorAlias = "", this.culture = "", this._blockGridValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(ce, async (t) => {
      this.observe(t.settings, (e) => {
        var r, s;
        (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = (s = e == null ? void 0 : e.blockGrid) == null ? void 0 : s.stylesheet);
      });
    }), this.consumeContext(ie, async (t) => {
      this.culture = t.getVariantId().culture ?? "";
    }), this.consumeContext(z, (t) => {
      this.observe(
        y([t.unique, t.contentTypeUnique]),
        async ([e, r]) => {
          this.unique = e, this.documentTypeUnique = r, V(this, P, le).call(this);
        }
      );
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
    if (this.htmlMarkup !== "")
      return ee`
                ${this._styleElement}
                <a href=${te(this.workspaceEditContentPath)}>
                    ${re(this.htmlMarkup)}
                </a>`;
  }
};
P = /* @__PURE__ */ new WeakSet();
le = function() {
  this.consumeContext(oe, (t) => {
    this.observe(
      y([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, this.blockGridValue = {
          ...this.blockGridValue,
          contentData: r.contentData,
          settingsData: r.settingsData,
          expose: r.expose,
          layout: r.layout
        }, V(this, M, ue).call(this);
      }
    );
  });
};
M = /* @__PURE__ */ new WeakSet();
ue = function() {
  this.consumeContext(be, (t) => {
    this.observe(
      y([t.contentKey, t.settingsKey, t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r, s, i]) => {
        this.contentUdi = e, this.settingsUdi = r ?? void 0, this.contentElementTypeAlias = i, this.workspaceEditContentPath = s, await V(this, G, de).call(this);
      }
    );
  });
};
G = /* @__PURE__ */ new WeakSet();
de = async function() {
  if (!this.unique || !this.documentTypeUnique || !this.blockEditorAlias || !this.contentUdi || !this.contentElementTypeAlias || this.settingsUdi === null || !this.blockGridValue.contentData || !this.blockGridValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    documentTypeUnique: this.documentTypeUnique,
    contentUdi: this.contentUdi,
    settingsUdi: this.settingsUdi,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockGridValue)
  }, { data: e } = await D(this, U.previewGridBlock(t));
  e && (this.htmlMarkup = e);
};
f.styles = [
  Y`
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
                background-color: var(--uui-color-danger, #f0ac00);
                border-color: transparent;
                color: #fff;
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
  L()
], f.prototype, "htmlMarkup", 2);
j([
  Q({ attribute: !1 })
], f.prototype, "blockGridValue", 1);
f = j([
  Z(Ue)
], f);
var je = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, A = (t, e, r, s) => {
  for (var i = s > 1 ? void 0 : s ? Ve(e, r) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (i = (s ? n(e, r, i) : n(i)) || i);
  return s && i && je(e, r, i), i;
}, Me = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, x = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, g = (t, e, r) => (Me(t, e, "access private method"), r), q, he, C, B, I, pe;
const Ge = "block-list-preview";
let d = class extends se {
  constructor() {
    super(), x(this, q), x(this, C), x(this, I), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockListValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(ie, async (t) => {
      this.culture = t.getVariantId().culture ?? "";
    }), this.consumeContext(z, (t) => {
      this.observe(
        y([t.unique, t.contentTypeUnique]),
        async ([e, r]) => {
          this.unique = e, this.documentTypeUnique = r, g(this, q, he).call(this);
        }
      );
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
    if (this.htmlMarkup !== "")
      return ee`
                <a href=${te(this.workspaceEditContentPath)}>
                    ${re(this.htmlMarkup)}
                </a>`;
  }
};
q = /* @__PURE__ */ new WeakSet();
he = function() {
  this.consumeContext(oe, (t) => {
    this.observe(
      y([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, this.blockListValue = {
          ...this.blockListValue,
          contentData: r.contentData,
          settingsData: r.settingsData,
          expose: r.expose,
          layout: r.layout
        }, g(this, C, B).call(this), g(this, C, B).call(this);
      }
    );
  });
};
C = /* @__PURE__ */ new WeakSet();
B = function() {
  this.consumeContext(we, (t) => {
    this.observe(
      y([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await g(this, I, pe).call(this);
      }
    );
  });
};
I = /* @__PURE__ */ new WeakSet();
pe = async function() {
  if (!this.unique || !this.documentTypeUnique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockListValue.contentData || !this.blockListValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockListValue)
  }, { data: e } = await D(this, U.previewListBlock(t));
  e && (this.htmlMarkup = e);
};
d.styles = [
  Y`
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
                color: #fff;
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
A([
  L()
], d.prototype, "htmlMarkup", 2);
A([
  L()
], d.prototype, "_blockListValue", 2);
A([
  Q({ attribute: !1 })
], d.prototype, "blockListValue", 1);
d = A([
  Z(Ge)
], d);
const Ie = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => He)
  }
], $e = [...Ie];
var w, p;
class O extends J {
  constructor(r) {
    super(r);
    m(this, w, void 0);
    m(this, p, void 0);
    b(this, p, new ve(void 0)), this.settings = h(this, p).asObservable(), b(this, w, new ae(r)), this.getSettings();
  }
  async getSettings() {
    const r = await h(this, w).getSettings();
    h(this, p).setValue(r);
  }
}
w = new WeakMap(), p = new WeakMap();
const He = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: O,
  default: O
}, Symbol.toStringTag, { value: "Module" })), st = async (t, e) => {
  var o, n;
  const s = await new ae(t).getSettings();
  let i = [];
  if (s) {
    if (s.blockGrid.enabled) {
      let a = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: f,
        forBlockEditor: "block-grid"
      };
      ((o = s.blockGrid.contentTypes) == null ? void 0 : o.length) !== 0 && (a.forContentTypeAlias = s.blockGrid.contentTypes), i.push(a);
    }
    if (s.blockList.enabled) {
      let a = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.ListCustomView",
        name: "BlockPreview List Custom View",
        element: d,
        forBlockEditor: "block-list"
      };
      ((n = s.blockList.contentTypes) == null ? void 0 : n.length) !== 0 && (a.forContentTypeAlias = s.blockList.contentTypes), i.push(a);
    }
  }
  e.registerMany([
    ...i,
    ...$e
  ]), t.provideContext(ce, new O(t)), t.consumeContext(me, async (a) => {
    if (!a)
      return;
    const c = a.getOpenApiConfiguration();
    u.BASE = c.base, u.TOKEN = c.token, u.WITH_CREDENTIALS = c.withCredentials, u.CREDENTIALS = c.credentials;
  });
};
export {
  f as BlockGridPreviewCustomView,
  d as BlockListPreviewCustomView,
  Oe as SettingsDataSource,
  ae as SettingsRepository,
  st as onInit
};
//# sourceMappingURL=assets.js.map
