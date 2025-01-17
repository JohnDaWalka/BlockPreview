var ae = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var f = (t, e, r) => (ae(t, e, "read from private field"), r ? r.call(t) : e.get(t)), b = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, k = (t, e, r, o) => (ae(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as Ae } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as A } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as ue } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as Re } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as he } from "@umbraco-cms/backoffice/document";
import { css as M, state as T, property as $, customElement as j, html as U, ifDefined as G, unsafeHTML as I } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as H } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple as h, UmbObjectState as xe } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as W, UMB_PROPERTY_CONTEXT as K } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as Se } from "@umbraco-cms/backoffice/context-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as Pe } from "@umbraco-cms/backoffice/block-list";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as Be } from "@umbraco-cms/backoffice/block-rte";
class ce extends Error {
  constructor(e, r, o) {
    super(o), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = e;
  }
}
class De extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class Oe {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((r, o) => {
      this._resolve = r, this._reject = o;
      const s = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(a));
      }, i = (a) => {
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
      }), e(s, i, n);
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
      this.cancelHandlers.length = 0, this._reject && this._reject(new De("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class le {
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
    request: new le(),
    response: new le()
  }
}, E = (t) => typeof t == "string", P = (t) => E(t) && t !== "", F = (t) => t instanceof Blob, de = (t) => t instanceof FormData, qe = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, Ve = (t) => {
  const e = [], r = (s, i) => {
    e.push(`${encodeURIComponent(s)}=${encodeURIComponent(String(i))}`);
  }, o = (s, i) => {
    i != null && (i instanceof Date ? r(s, i.toISOString()) : Array.isArray(i) ? i.forEach((n) => o(s, n)) : typeof i == "object" ? Object.entries(i).forEach(([n, a]) => o(`${s}[${n}]`, a)) : r(s, i));
  };
  return Object.entries(t).forEach(([s, i]) => o(s, i)), e.length ? `?${e.join("&")}` : "";
}, Ne = (t, e) => {
  const r = t.ENCODE_PATH || encodeURI, o = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (i, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : i;
  }), s = t.BASE + o;
  return e.query ? s + Ve(e.query) : s;
}, Le = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (o, s) => {
      E(s) || F(s) ? e.append(o, s) : e.append(o, JSON.stringify(s));
    };
    return Object.entries(t.formData).filter(([, o]) => o != null).forEach(([o, s]) => {
      Array.isArray(s) ? s.forEach((i) => r(o, i)) : r(o, s);
    }), e;
  }
}, g = async (t, e) => typeof e == "function" ? e(t) : e, Me = async (t, e) => {
  const [r, o, s, i] = await Promise.all([
    // @ts-ignore
    g(e, t.TOKEN),
    // @ts-ignore
    g(e, t.USERNAME),
    // @ts-ignore
    g(e, t.PASSWORD),
    // @ts-ignore
    g(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...i,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (P(r) && (n.Authorization = `Bearer ${r}`), P(o) && P(s)) {
    const a = qe(`${o}:${s}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : F(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : E(e.body) ? n["Content-Type"] = "text/plain" : de(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, $e = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : E(t.body) || F(t.body) || de(t.body) ? t.body : JSON.stringify(t.body);
}, je = async (t, e, r, o, s, i, n) => {
  const a = new AbortController();
  let c = {
    headers: i,
    body: o ?? s,
    method: e.method,
    signal: a.signal
  };
  t.WITH_CREDENTIALS && (c.credentials = t.CREDENTIALS);
  for (const l of t.interceptors.request._fns)
    c = await l(c);
  return n(() => a.abort()), await fetch(r, c);
}, Ue = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (E(r))
      return r;
  }
}, Ge = async (t) => {
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
}, Ie = (t, e) => {
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
    throw new ce(t, e, o);
  if (!e.ok) {
    const s = e.status ?? "unknown", i = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new ce(
      t,
      e,
      `Generic Error: status: ${s}; status text: ${i}; body: ${n}`
    );
  }
}, C = (t, e) => new Oe(async (r, o, s) => {
  try {
    const i = Ne(t, e), n = Le(e), a = $e(e), c = await Me(t, e);
    if (!s.isCancelled) {
      let l = await je(t, e, i, a, n, c, s);
      for (const Ce of t.interceptors.response._fns)
        l = await Ce(l);
      const se = await Ge(l), ge = Ue(l, e.responseHeader);
      let ie = se;
      e.responseTransformer && l.ok && (ie = await e.responseTransformer(se));
      const ne = {
        url: i,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: ge ?? ie
      };
      Ie(e, ne), r(ne.body);
    }
  } catch (i) {
    o(i);
  }
});
class R {
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
    return C(u, {
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
    return C(u, {
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
    return C(u, {
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
    return C(u, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
}
var v;
class He {
  constructor(e) {
    b(this, v, void 0);
    k(this, v, e);
  }
  async getSettings() {
    return await A(f(this, v), R.getSettings());
  }
}
v = new WeakMap();
var w;
class pe extends ue {
  constructor(r) {
    super(r);
    b(this, w, void 0);
    k(this, w, new He(r));
  }
  async getSettings() {
    const r = await f(this, w).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
w = new WeakMap();
const fe = new Se("BlockPreviewContext");
var We = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, X = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? Ke(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && We(e, r, s), s;
}, Fe = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, B = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, J = (t, e, r) => (Fe(t, e, "access private method"), r), q, ye, z, me, Y, be;
const Xe = "block-grid-preview";
let m = class extends H {
  constructor() {
    super(), B(this, q), B(this, z), B(this, Y), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.contentUdi = "", this.settingsUdi = null, this.blockEditorAlias = "", this.culture = "", this._blockGridValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(fe, async (t) => {
      this.observe(t.settings, (e) => {
        var r, o;
        (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = (o = e == null ? void 0 : e.blockGrid) == null ? void 0 : o.stylesheet);
      });
    }), this.consumeContext(W, async (t) => {
      this.culture = t.getVariantId().culture ?? "";
    }), this.consumeContext(he, (t) => {
      this.observe(
        h([t.unique, t.contentTypeUnique]),
        async ([e, r]) => {
          this.unique = e == null ? void 0 : e.toString(), this.documentTypeUnique = r, J(this, q, ye).call(this);
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
      return U`
                ${this._styleElement}
                <a href=${G(this.workspaceEditContentPath)}>
                    ${I(this.htmlMarkup)}
                </a>`;
  }
};
q = /* @__PURE__ */ new WeakSet();
ye = function() {
  this.consumeContext(K, (t) => {
    this.observe(
      h([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, this.blockGridValue = {
          ...this.blockGridValue,
          contentData: r.contentData,
          settingsData: r.settingsData,
          expose: r.expose,
          layout: r.layout
        }, J(this, z, me).call(this);
      }
    );
  });
};
z = /* @__PURE__ */ new WeakSet();
me = function() {
  this.consumeContext(Re, (t) => {
    this.observe(
      h([t.contentKey, t.settingsKey, t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r, o, s]) => {
        this.contentUdi = e, this.settingsUdi = r ?? void 0, this.contentElementTypeAlias = s, this.workspaceEditContentPath = o, await J(this, Y, be).call(this);
      }
    );
  });
};
Y = /* @__PURE__ */ new WeakSet();
be = async function() {
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
  }, { data: e } = await A(this, R.previewGridBlock(t));
  e && (this.htmlMarkup = e);
};
m.styles = [
  M`
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
X([
  T()
], m.prototype, "htmlMarkup", 2);
X([
  $({ attribute: !1 })
], m.prototype, "blockGridValue", 1);
m = X([
  j(Xe)
], m);
var Je = Object.defineProperty, ze = Object.getOwnPropertyDescriptor, x = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? ze(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && Je(e, r, s), s;
}, Ye = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, D = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Q = (t, e, r) => (Ye(t, e, "access private method"), r), V, ke, Z, ve, ee, we;
const Qe = "block-list-preview";
let d = class extends H {
  constructor() {
    super(), D(this, V), D(this, Z), D(this, ee), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockListValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(W, async (t) => {
      this.culture = t.getVariantId().culture ?? "";
    }), this.consumeContext(he, (t) => {
      this.observe(
        h([t.unique, t.contentTypeUnique]),
        async ([e, r]) => {
          this.unique = e == null ? void 0 : e.toString(), this.documentTypeUnique = r, Q(this, V, ke).call(this);
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
      return U`
                <a href=${G(this.workspaceEditContentPath)}>
                    ${I(this.htmlMarkup)}
                </a>`;
  }
};
V = /* @__PURE__ */ new WeakSet();
ke = function() {
  this.consumeContext(K, (t) => {
    this.observe(
      h([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, this.blockListValue = {
          ...this.blockListValue,
          contentData: r.contentData,
          settingsData: r.settingsData,
          expose: r.expose,
          layout: r.layout
        }, Q(this, Z, ve).call(this);
      }
    );
  });
};
Z = /* @__PURE__ */ new WeakSet();
ve = function() {
  this.consumeContext(Pe, (t) => {
    this.observe(
      h([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await Q(this, ee, we).call(this);
      }
    );
  });
};
ee = /* @__PURE__ */ new WeakSet();
we = async function() {
  if (!this.unique || !this.documentTypeUnique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockListValue.contentData || !this.blockListValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockListValue)
  }, { data: e } = await A(this, R.previewListBlock(t));
  e && (this.htmlMarkup = e);
};
d.styles = [
  M`
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
x([
  T()
], d.prototype, "htmlMarkup", 2);
x([
  T()
], d.prototype, "_blockListValue", 2);
x([
  $({ attribute: !1 })
], d.prototype, "blockListValue", 1);
d = x([
  j(Qe)
], d);
var Ze = Object.defineProperty, et = Object.getOwnPropertyDescriptor, S = (t, e, r, o) => {
  for (var s = o > 1 ? void 0 : o ? et(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (s = (o ? n(e, r, s) : n(s)) || s);
  return o && s && Ze(e, r, s), s;
}, tt = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, O = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, te = (t, e, r) => (tt(t, e, "access private method"), r), N, _e, re, Te, oe, Ee;
const rt = "rich-text-preview";
let p = class extends H {
  constructor() {
    var t;
    super(), O(this, N), O(this, re), O(this, oe), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(W, async (e) => {
      this.culture = e.getVariantId().culture ?? "";
    }), this.unique = (t = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : t[0], te(this, N, _e).call(this);
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
      return U`
                <a href=${G(this.workspaceEditContentPath)}>
                    ${I(this.htmlMarkup)}
                </a>`;
  }
};
N = /* @__PURE__ */ new WeakSet();
_e = function() {
  this.consumeContext(K, (t) => {
    this.observe(
      h([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), te(this, re, Te).call(this);
      }
    );
  });
};
re = /* @__PURE__ */ new WeakSet();
Te = function() {
  this.consumeContext(Be, (t) => {
    this.observe(
      h([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await te(this, oe, Ee).call(this);
      }
    );
  });
};
oe = /* @__PURE__ */ new WeakSet();
Ee = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockRteValue)
  }, { data: e } = await A(this, R.previewRichTextMarkup(t));
  e && (this.htmlMarkup = e);
};
p.styles = [
  M`
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
  T()
], p.prototype, "htmlMarkup", 2);
S([
  T()
], p.prototype, "_blockRteValue", 2);
S([
  $({ attribute: !1 })
], p.prototype, "blockRteValue", 1);
p = S([
  j(rt)
], p);
const ot = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => it)
  }
], st = [...ot];
var _, y;
class L extends ue {
  constructor(r) {
    super(r);
    b(this, _, void 0);
    b(this, y, void 0);
    k(this, y, new xe(void 0)), this.settings = f(this, y).asObservable(), k(this, _, new pe(r)), this.getSettings();
  }
  async getSettings() {
    const r = await f(this, _).getSettings();
    f(this, y).setValue(r);
  }
}
_ = new WeakMap(), y = new WeakMap();
const it = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: L,
  default: L
}, Symbol.toStringTag, { value: "Module" })), vt = async (t, e) => {
  var i, n, a;
  const o = await new pe(t).getSettings();
  let s = [];
  if (o) {
    if (o.blockGrid.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: m,
        forBlockEditor: "block-grid"
      };
      ((i = o.blockGrid.contentTypes) == null ? void 0 : i.length) !== 0 && (c.forContentTypeAlias = o.blockGrid.contentTypes), s.push(c);
    }
    if (o.blockList.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.ListCustomView",
        name: "BlockPreview List Custom View",
        element: d,
        forBlockEditor: "block-list"
      };
      ((n = o.blockList.contentTypes) == null ? void 0 : n.length) !== 0 && (c.forContentTypeAlias = o.blockList.contentTypes), s.push(c);
    }
    if (o.richText.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.RichTextCustomView",
        name: "BlockPreview Rich Text Custom View",
        element: p,
        forBlockEditor: "block-rte"
      };
      ((a = o.richText.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = o.richText.contentTypes), s.push(c);
    }
  }
  e.registerMany([
    ...s,
    ...st
  ]), t.provideContext(fe, new L(t)), t.consumeContext(Ae, async (c) => {
    if (!c)
      return;
    const l = c.getOpenApiConfiguration();
    u.BASE = l.base, u.TOKEN = l.token, u.WITH_CREDENTIALS = l.withCredentials, u.CREDENTIALS = l.credentials;
  });
};
export {
  m as BlockGridPreviewCustomView,
  d as BlockListPreviewCustomView,
  p as RichTextPreviewCustomView,
  He as SettingsDataSource,
  pe as SettingsRepository,
  vt as onInit
};
//# sourceMappingURL=assets.js.map
