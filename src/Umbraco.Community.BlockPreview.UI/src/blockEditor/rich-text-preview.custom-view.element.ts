import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';
import { UMB_BLOCK_RTE_ENTRY_CONTEXT, UmbBlockRteValueModel } from "@umbraco-cms/backoffice/block-rte";
import { css, customElement, html, ifDefined, property, state, unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_CONTEXT, UMB_PROPERTY_DATASET_CONTEXT } from "@umbraco-cms/backoffice/property";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { BlockPreviewService, PreviewRichTextMarkupData } from "../api";

const elementName = "rich-text-preview";

@customElement(elementName)
export class RichTextPreviewCustomView
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
    private _blockRteValue: UmbBlockRteValueModel = {
        layout: {},
        expose: [],
        contentData: [],
        settingsData: []
    }

    @property({ attribute: false })
    public set blockRteValue(value: UmbBlockRteValueModel | undefined) {
        const buildUpValue: Partial<UmbBlockRteValueModel> = value ? { ...value } : {};
        buildUpValue.layout ??= {};
        buildUpValue.contentData ??= [];
        buildUpValue.settingsData ??= [];
        buildUpValue.expose ??= [];
        this._blockRteValue = buildUpValue as UmbBlockRteValueModel;
    }
    public get blockRteValue(): UmbBlockRteValueModel {
        return this._blockRteValue;
    }

    constructor() {
        super();

        this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
            this.culture = instance.getVariantId().culture ?? "";
        });

        this.unique = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)?.[0];

        this.#observeBlockRteValue();
    }

    #observeBlockRteValue(): void {
        this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
            this.observe(
                observeMultiple([context.alias, context.value]),
                async ([alias, value]) => {
                    this.blockEditorAlias = alias;

                    if (value.blocks.length !== 0) {
                        this.blockRteValue = {
                            ...this.blockRteValue,
                            contentData: value.blocks.contentData!,
                            settingsData: value.blocks.settingsData!,
                            expose: value.blocks.expose!,
                            layout: value.blocks.layout!
                        }
                    }

                    this.#observeBlockValue();
                });
        });
    }

    #observeBlockValue(): void {
        this.consumeContext(UMB_BLOCK_RTE_ENTRY_CONTEXT, (context) => {
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
            !this.blockEditorAlias ||
            !this.contentElementTypeAlias ||
            !this.blockRteValue.contentData ||
            !this.blockRteValue.layout) return;

        const previewData: PreviewRichTextMarkupData = {
            blockEditorAlias: this.blockEditorAlias,
            nodeKey: this.unique,
            contentElementAlias: this.contentElementTypeAlias,
            culture: this.culture,
            requestBody: JSON.stringify(this.blockRteValue)
        };

        const { data } = await tryExecuteAndNotify(this, BlockPreviewService.previewRichTextMarkup(previewData));

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

export default RichTextPreviewCustomView;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: RichTextPreviewCustomView;
    }
}
