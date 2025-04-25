import { UMB_BLOCK_WORKSPACE_CONTEXT, UmbBlockDataType } from '@umbraco-cms/backoffice/block';
import type { UmbBlockEditorCustomViewConfiguration, UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';
import { UMB_BLOCK_GRID_ENTRY_CONTEXT, UMB_BLOCK_GRID_MANAGER_CONTEXT, UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT, UmbDocumentWorkspaceContext } from "@umbraco-cms/backoffice/document";
import { css, customElement, html, ifDefined, property, state, unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT } from "@umbraco-cms/backoffice/property";
import { tryExecute, UmbApiError } from "@umbraco-cms/backoffice/resources";
import { BlockPreviewService } from "../api";
import BlockPreviewContext from '../context/block-preview.context';
import { BLOCK_PREVIEW_CONTEXT } from "../context/block-preview.context-token";

const elementName = "block-grid-preview";

@customElement(elementName)
export class BlockGridPreviewCustomView
    extends UmbLitElement
    implements UmbBlockEditorCustomViewElement {

    #blockPreviewContext?: BlockPreviewContext;
    #documentWorkspaceContext?: UmbDocumentWorkspaceContext;

    @property({ attribute: false })
    content?: UmbBlockDataType;

    @property({ attribute: false })
    settingsData?: UmbBlockDataType;

    @property({ attribute: false })
    contentKey?: string;

    @property({ attribute: false })
    config?: UmbBlockEditorCustomViewConfiguration;

    @state()
    private _htmlMarkup: string = '';

    @state()
    private _isLoading: boolean = false;

    @state()
    private _error: string | null = null;

    private _styleElement?: HTMLLinkElement;

    private _previewTimeout: number | undefined;

    private _blockContext = {
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
    };

    private _blockGridValue: UmbBlockGridValueModel = {
        layout: {},
        expose: [],
        contentData: [],
        settingsData: []
    }

    @property({ attribute: false })
    public set blockGridValue(value: UmbBlockGridValueModel | undefined) {
        const buildUpValue: Partial<UmbBlockGridValueModel> = value ? { ...value } : {};
        buildUpValue.layout ??= {};
        buildUpValue.contentData ??= [];
        buildUpValue.settingsData ??= [];
        buildUpValue.expose ??= [];
        this._blockGridValue = buildUpValue as UmbBlockGridValueModel;
    }
    public get blockGridValue(): UmbBlockGridValueModel {
        return this._blockGridValue;
    }

    constructor() {
        super();

        this.consumeContext(BLOCK_PREVIEW_CONTEXT, (context) => {
            this.#blockPreviewContext = context;
            this.#setupContextObservers();
        });
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);

        if (changedProperties.has('content')) {
            if (this._previewTimeout) {
                clearTimeout(this._previewTimeout);
            }
            this._previewTimeout = window.setTimeout(() => {
                this.#renderBlockPreview();
            }, 500);
        }
    }

    #setupContextObservers() {
        this.#observeBlockPreviewSettings();
        this.#observePropertyDataset();
        this.#observeDocumentWorkspace();
    }

    #observeBlockPreviewSettings() {
        this.observe(this.#blockPreviewContext?.settings, (settings) => {
            if (settings?.blockGrid?.stylesheet) {
                this._styleElement = document.createElement('link');
                this._styleElement.rel = 'stylesheet';
                this._styleElement.href = settings.blockGrid.stylesheet as string;
            }
        });
    }

    #observePropertyDataset() {
        this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, (instance) => {
            if (instance) {
                this._blockContext.culture = instance.getVariantId().culture ?? "";
            }
        });
    }

    async #observeDocumentWorkspace() {
        this.getContext(UMB_DOCUMENT_WORKSPACE_CONTEXT).then((context) => {
            if (context) {
                this.#documentWorkspaceContext = context;
                this.observe(
                    observeMultiple([context.unique, context.contentTypeUnique]),
                    async ([unique, documentTypeUnique]) => {
                        this._blockContext.unique = unique?.toString() ?? '';
                        this.#blockPreviewContext?.setUnique(this._blockContext.unique);

                        this._blockContext.documentTypeUnique = documentTypeUnique ?? '';
                        this.#blockPreviewContext?.setDocumentTypeUnique(this._blockContext.documentTypeUnique);
                        this.#observeBlockValue();
                    }
                );
            }
        });

        if (this.#documentWorkspaceContext == null && this.#blockPreviewContext != null && this._blockContext.unique == '') {
            this.consumeContext(UMB_BLOCK_WORKSPACE_CONTEXT, (context) => {
                if (context) {
                    this.observe(context.content.structure.contentTypeUniques, (contentTypeUniques) => {
                        this._blockContext.unique = this.#blockPreviewContext?.getUnique() ?? '';
                        this._blockContext.documentTypeUnique = contentTypeUniques[0] ?? '';
                        this.#observeBlockValue();
                    });
                }
            });
        }
    }

    async #observeBlockValue() {
        this.consumeContext(UMB_BLOCK_GRID_ENTRY_CONTEXT, async (context) => {
            if (context) {
                this.observe(
                    observeMultiple([
                        context.contentKey,
                        context.settingsKey,
                        context.workspaceEditContentPath,
                        context.contentElementTypeAlias,
                        context.contentElementTypeKey
                    ]),
                    async ([
                        contentUdi,
                        settingsUdi,
                        workspaceEditContentPath,
                        contentElementTypeAlias,
                        contentElementTypeKey
                    ]) => {
                        this._blockContext.contentUdi = contentUdi ?? '';
                        this._blockContext.settingsUdi = settingsUdi ?? '';
                        this._blockContext.workspaceEditContentPath = workspaceEditContentPath ?? '';
                        this._blockContext.contentElementTypeAlias = contentElementTypeAlias ?? '';
                        this._blockContext.contentElementTypeKey = contentElementTypeKey ?? '';

                        await this.#observeBlockPropertyValue();
                    }
                );
            }
        });
    }

    async #observeBlockPropertyValue() {
        this.consumeContext(UMB_BLOCK_GRID_MANAGER_CONTEXT, (context) => {
            if (context) {
                this.observe(
                    observeMultiple([
                        context.contents,
                        context.settings,
                        context.layouts,
                        context.exposes,
                        context.propertyAlias
                    ]),
                    async ([contents, settings, layouts, exposes, propertyAlias]) => {
                        this._blockContext.blockEditorAlias = propertyAlias ?? '';

                        this.blockGridValue = {
                            contentData: contents?.filter(x => x.key == this._blockContext.contentUdi) ?? [],
                            settingsData: settings?.filter(x => x.key == this._blockContext.settingsUdi) ?? [],
                            expose: exposes?.filter(x => x.contentKey == this._blockContext.contentUdi) ?? [],
                            layout: {
                                ['Umbraco.BlockGrid']: layouts?.filter(x => x.contentKey == this._blockContext.contentUdi) ?? []
                            }
                        };

                        this._blockContext.blockIndex = contents.indexOf(this.blockGridValue.contentData[0]);
                    }
                );
            }
        });
    }

    async #renderBlockPreview() {
        const context = this._blockContext;
        if (this.#blockPreviewContext != null && context.unique == '') {
            context.unique = this.#blockPreviewContext.getUnique();
        }
        if (this.#blockPreviewContext != null && context.documentTypeUnique == '') {
            context.documentTypeUnique = this.#blockPreviewContext.getDocumentTypeUnique();
        }

        const isDataValid = this.#validatePreviewData(context);

        if (!isDataValid) {
            this._error = 'Insufficient data for block preview';
            this._isLoading = false;
            return;
        }

        this._isLoading = true;
        this._error = null;

        try {
            const { data, error } = await tryExecute(this, BlockPreviewService.previewGridBlock({
                body: JSON.stringify(this.blockGridValue), query: {
                    blockEditorAlias: context.blockEditorAlias,
                    nodeKey: context.unique,
                    contentElementAlias: context.contentElementTypeAlias,
                    documentTypeUnique: context.documentTypeUnique,
                    contentUdi: context.contentUdi,
                    settingsUdi: context.settingsUdi,
                    culture: context.culture,
                    blockIndex: context.blockIndex
                }
            }));

            if (data) {
                this._htmlMarkup = data ?? '';
                this._isLoading = false;
            }
            else if (UmbApiError.isUmbApiError(error)) {
                debugger;
                this._error = error.message;
                this._isLoading = false;
            }

        } catch (error) {
            this._error = 'Failed to render block preview';
            this._isLoading = false;
            console.error('Block preview error:', error);
        }
    }

    #validatePreviewData(context: typeof this._blockContext): boolean {
        return !!(
            context.unique != '' &&
            context.blockEditorAlias != '' &&
            context.contentUdi != '' &&
            context.contentElementTypeAlias != ''
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
                ${this._styleElement}
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

export default BlockGridPreviewCustomView;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: BlockGridPreviewCustomView;
    }
}
