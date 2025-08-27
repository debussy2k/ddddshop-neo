import { getShopicusAPI } from "$lib/service/shopicus.api";

class ShowcaseStore {
    public cachedShowcases = $state<any>({});

    loadData(code: string) {
        let api = getShopicusAPI();
        if (api) {
            api.productDataApi.shopShowcasesList({ code: code }).then(res => {
                this.cachedShowcases[code] = res.data;
                console.log("showcaseStore", this.cachedShowcases);
            });
        }
    }

    getShowcase(code: string) {
        let showcase = this.cachedShowcases[code];
        if (showcase) {
            return showcase;
        }

        this.loadData(code);
        return null;
    }
}

export const showcaseStore = new ShowcaseStore();