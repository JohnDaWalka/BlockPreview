import { UMB_BLOCK_LIST_ENTRY_CONTEXT, UmbBlockListValueModel } from "@umbraco-cms/backoffice/block-list";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';
import { css, customElement, html, ifDefined, property, state, unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_CONTEXT, UMB_PROPERTY_DATASET_CONTEXT } from "@umbraco-cms/backoffice/property";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { BlockPreviewService, PreviewListBlockData } from "../api";

const elementName = "block-list-preview";

@customElement(elementName)
export class BlockListPreviewCustomView
    extends UmbLitElement
    implements UmbBlockEditorCustomViewElement {

    @state()
    htmlMarkup: string | undefined = "";

    unique?: string = '';
    documentTypeUnique?: string = '';
    blockEditorAlias?: string = '';
    culture?: string = '';
    workspaceEditContentPath?: string;
    contentElementTypeAlias?: string;

    @state()
    private _blockListValue: UmbBlockListValueModel = {
        layout: {},
        expose: [],
        contentData: [],
        settingsData: []
    }

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

        this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
            this.culture = instance.getVariantId().culture ?? "";
        });

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.unique, context.contentTypeUnique]),
                async ([unique, documentTypeUnique]) => {
                    this.unique = unique;
                    this.documentTypeUnique = documentTypeUnique;
                    this.#observeBlockListValue();
                });
        });
    }

    #observeBlockListValue(): void {
        this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.alias, context.value]),
                async ([alias, value]) => {
                    this.blockEditorAlias = alias;

                    this.blockListValue = {
                        ...this.blockListValue,
                        contentData: value.contentData!,
                        settingsData: value.settingsData!,
                        expose: value.expose!,
                        layout: value.layout!
                    }

                    this.#observeBlockValue();

                    this.#observeBlockValue();
                });
        });
    }

    #observeBlockValue(): void {
        this.consumeContext(UMB_BLOCK_LIST_ENTRY_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.workspaceEditContentPath, context.contentElementTypeAlias]),
                async ([workspaceEditContentPath, contentElementTypeAlias]) => {
                    this.contentElementTypeAlias = contentElementTypeAlias;
                    this.workspaceEditContentPath = workspaceEditContentPath;

                    await this.#renderBlockPreview();
                });
        });
    }

    async #renderBlockPreview() {
        if (!this.unique ||
            !this.documentTypeUnique ||
            !this.blockEditorAlias ||
            !this.contentElementTypeAlias ||
            !this.blockListValue.contentData ||
            !this.blockListValue.layout) return;

        const previewData: PreviewListBlockData = {
            blockEditorAlias: this.blockEditorAlias,
            nodeKey: this.unique,
            contentElementAlias: this.contentElementTypeAlias,
            culture: this.culture,
            requestBody: JSON.stringify(this.blockListValue)
        };

        const { data } = await tryExecuteAndNotify(this, BlockPreviewService.previewListBlock(previewData));

        if (data) this.htmlMarkup = data;
    }

    render() {
        if (this.htmlMarkup !== "") {
            return html`
                <a href=${ifDefined(this.workspaceEditContentPath)}>
                    ${unsafeHTML(this.htmlMarkup)}
                </a>`;
        }
        return;
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
    ]
}

export default BlockListPreviewCustomView;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: BlockListPreviewCustomView;
    }
}
