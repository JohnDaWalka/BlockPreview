import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { ManifestBlockEditorCustomView } from '@umbraco-cms/backoffice/block-custom-view';

export * from './repository';
export * from './blockEditor';

import { SettingsRepository } from './repository';
import { BlockGridPreviewCustomView, RichTextPreviewCustomView, BlockListPreviewCustomView } from './blockEditor';
import { manifests as contextManifests } from './context/manifests.ts';
import { client } from './api/index.ts';
import { BLOCK_PREVIEW_CONTEXT } from './context/block-preview.context-token.ts';
import BlockPreviewContext from './context/block-preview.context.ts';

export const onInit: UmbEntryPointOnInit = async (host, extensionRegistry) => {

    host.consumeContext(UMB_AUTH_CONTEXT, async (authContext) => {
        if (!authContext) return;

        const config = authContext.getOpenApiConfiguration();

        client.setConfig({
            auth: () => authContext.getLatestToken(),
            baseUrl: config.base,
            credentials: config.credentials,
        });

        const settingsRepository = new SettingsRepository(host);
        const settings = await settingsRepository.getSettings();

        let customViewManifests: ManifestBlockEditorCustomView[] = [];

        if (settings) {
            if (settings.blockGrid.enabled) {
                let blockGridManifest: ManifestBlockEditorCustomView = {
                    type: 'blockEditorCustomView',
                    alias: 'BlockPreview.GridCustomView',
                    name: 'BlockPreview Grid Custom View',
                    element: BlockGridPreviewCustomView,
                    forBlockEditor: 'block-grid'
                };

                if (settings.blockGrid.contentTypes?.length !== 0) {
                    blockGridManifest.forContentTypeAlias = settings.blockGrid.contentTypes as string[];
                }

                customViewManifests.push(blockGridManifest);
            }

            if (settings.blockList.enabled) {
                let blockListManifest: ManifestBlockEditorCustomView = {
                    type: 'blockEditorCustomView',
                    alias: 'BlockPreview.ListCustomView',
                    name: 'BlockPreview List Custom View',
                    element: BlockListPreviewCustomView,
                    forBlockEditor: 'block-list'
                };

                if (settings.blockList.contentTypes?.length !== 0) {
                    blockListManifest.forContentTypeAlias = settings.blockList.contentTypes as string[];
                }

                customViewManifests.push(blockListManifest);
            }

            if (settings.richText.enabled) {
                let richTextManifext: ManifestBlockEditorCustomView = {
                    type: 'blockEditorCustomView',
                    alias: 'BlockPreview.RichTextCustomView',
                    name: 'BlockPreview Rich Text Custom View',
                    element: RichTextPreviewCustomView,
                    forBlockEditor: 'block-rte'
                };

                if (settings.richText.contentTypes?.length !== 0) {
                    richTextManifext.forContentTypeAlias = settings.richText.contentTypes as string[];
                }

                customViewManifests.push(richTextManifext);
            }
        }

        extensionRegistry.registerMany([
            ...customViewManifests,
            ...contextManifests
        ]);

        host.provideContext(BLOCK_PREVIEW_CONTEXT, new BlockPreviewContext(host));
    });
};