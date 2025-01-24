import {
    UMB_BLOCK_LIST_ENTRY_CONTEXT,
    UmbBlockListValueModel
} from "@umbraco-cms/backoffice/block-list";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';
import {
    css,
    customElement,
    html,
    ifDefined,
    property,
    state,
    unsafeHTML
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import {
    UMB_PROPERTY_CONTEXT,
    UMB_PROPERTY_DATASET_CONTEXT
} from "@umbraco-cms/backoffice/property";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { BlockPreviewService, PreviewListBlockData } from "../api";

const elementName = "block-list-preview";

@customElement(elementName)
export class BlockListPreviewCustomView
    extends UmbLitElement
    implements UmbBlockEditorCustomViewElement {

    @state() private _htmlMarkup: string = '';
    @state() private _isLoading: boolean = false;
    @state() private _error: string | null = null;

    private _blockContext = {
        unique: '',
        documentTypeUnique: '',
        blockEditorAlias: '',
        culture: '',
        workspaceEditContentPath: '',
        contentElementTypeAlias: ''
    };

    @state()
    private _blockListValue: UmbBlockListValueModel = {
        layout: {},
        expose: [],
        contentData: [],
        settingsData: []
    };

    @property({ attribute: false })
    public set blockListValue(value: UmbBlockListValueModel | undefined) {
        const buildUpValue: Partial<UmbBlockListValueModel> = value ? { ...value } : {};
        buildUpValue.layout ??= {};
        buildUpValue.contentData ??= [];
        buildUpValue.settingsData ??= [];
        buildUpValue.expose ??= [];
        this._blockListValue = buildUpValue as UmbBlockListValueModel;
    }

    public get blockListValue(): UmbBlockListValueModel {
        return this._blockListValue;
    }

    constructor() {
        super();
        this.#setupContextObservers();
    }

    #setupContextObservers() {
        this.#observePropertyDataset();
        this.#observeDocumentWorkspace();
    }

    #observePropertyDataset() {
        this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
            this._blockContext.culture = instance.getVariantId().culture ?? "";
        });
    }

    #observeDocumentWorkspace() {
        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.unique, context.contentTypeUnique]),
                async ([unique, documentTypeUnique]) => {
                    this._blockContext.unique = unique?.toString() ?? '';
                    this._blockContext.documentTypeUnique = documentTypeUnique ?? '';
                    this.#observeBlockListValue();
                }
            );
        });
    }

    #observeBlockListValue() {
        this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.alias, context.value]),
                async ([alias, value]) => {
                    this._blockContext.blockEditorAlias = alias ?? '';

                    this.blockListValue = {
                        ...this.blockListValue,
                        contentData: value.contentData ?? [],
                        settingsData: value.settingsData ?? [],
                        expose: value.expose ?? [],
                        layout: value.layout ?? {}
                    };

                    this.#observeBlockValue();
                }
            );
        });
    }

    #observeBlockValue() {
        this.consumeContext(UMB_BLOCK_LIST_ENTRY_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.workspaceEditContentPath, context.contentElementTypeAlias]),
                async ([workspaceEditContentPath, contentElementTypeAlias]) => {
                    this._blockContext.contentElementTypeAlias = contentElementTypeAlias ?? '';
                    this._blockContext.workspaceEditContentPath = workspaceEditContentPath ?? '';

                    await this.#renderBlockPreview();
                }
            );
        });
    }

    async #renderBlockPreview() {
        const context = this._blockContext;
        const isDataValid = this.#validatePreviewData(context);

        if (!isDataValid) {
            this._error = 'Insufficient data for block preview';
            this._isLoading = false;
            return;
        }

        this._isLoading = true;
        this._error = null;

        try {
            const previewData: PreviewListBlockData = {
                blockEditorAlias: context.blockEditorAlias,
                nodeKey: context.unique,
                contentElementAlias: context.contentElementTypeAlias,
                documentTypeUnique: context.documentTypeUnique,
                culture: context.culture,
                requestBody: JSON.stringify(this._blockListValue)
            };

            const { data } = await tryExecuteAndNotify(this, BlockPreviewService.previewListBlock(previewData));

            this._htmlMarkup = data ?? '';
            this._isLoading = false;
        } catch (error) {
            this._error = 'Failed to render block preview';
            this._isLoading = false;
            console.error('Block preview error:', error);
        }
    }

    #validatePreviewData(context: typeof this._blockContext): boolean {
        return !!(
            context.unique &&
            context.documentTypeUnique &&
            context.blockEditorAlias &&
            context.contentElementTypeAlias
        );
    }

    render() {
        if (this._isLoading) {
            return html`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>`;
        }

        if (this._error) {
            return html`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            `;
        }

        if (this._htmlMarkup) {
            return html`
                <a 
                    href=${ifDefined(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${unsafeHTML(this._htmlMarkup)}
                </a>
            `;
        }

        return null;
    }

    static styles = [
        css`
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
    ]
}

export default BlockListPreviewCustomView;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: BlockListPreviewCustomView;
    }
}