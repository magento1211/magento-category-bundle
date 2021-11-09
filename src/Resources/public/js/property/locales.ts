const FetcherRegistry = require('pim/fetcher-registry');

class Locale {
    private locales: string[];

    initialize(): void {
        FetcherRegistry.getFetcher('locale').fetchActivated({}).then((availableLocales: { code: string }[]) => {
            this.locales = availableLocales.map((locale) => locale.code);
        });
    }

    getEnabledLocales(isLocalizable: boolean): string[] {
        return isLocalizable ? this.locales : ['null']
    }
}

export namespace FlagbitLocales {
    const locale: Locale = new Locale();
    locale.initialize();

    export const locales = locale;
}
