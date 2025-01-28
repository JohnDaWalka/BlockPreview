import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { SettingsRepository } from "..";
import { UmbObjectState, UmbStringState } from "@umbraco-cms/backoffice/observable-api";
import { BlockPreviewOptions } from "../api";

export class BlockPreviewContext extends UmbControllerBase {

    #settingsRepository: SettingsRepository;

    #settings = new UmbObjectState<BlockPreviewOptions | undefined>(undefined);
    public readonly settings = this.#settings.asObservable();

    #unique = new UmbStringState('');
    public readonly unique = this.#unique.asObservable();

    #documentTypeUnique = new UmbStringState('');
    public readonly documentTypeUnique = this.#documentTypeUnique.asObservable();

    constructor(host: UmbControllerHost) {
        super(host);
        this.#settingsRepository = new SettingsRepository(host);

        this.getSettings();
    }

    async getSettings() {
        const settings = await this.#settingsRepository.getSettings();
        this.#settings.setValue(settings);
    }

    getUnique(): string {
        return this.#unique.getValue();
    }

    async setUnique(unique: string) {
        if (unique != '') {
            this.#unique.setValue(unique);
        }
    }

    getDocumentTypeUnique(): string {
        return this.#documentTypeUnique.getValue();
    }

    async setDocumentTypeUnique(documentTypeUnique: string) {
        if (documentTypeUnique != '') {
            this.#documentTypeUnique.setValue(documentTypeUnique);
        }
    }
}

export default BlockPreviewContext;