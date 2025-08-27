import { getShopicusAPI } from "$lib/service/api.config";

class BackendStore {
    private api = getShopicusAPI();

    private Categories = $state<any[]>([]);
    private Showcases = $state<any>({});
    private Banners = $state<any>({});


    private loadCategories() { 
        if (this.api) {
            this.api.productApi.getCategories().then(res => {
                this.Categories = res.data;
            });
        }
    }
    getCategories() {
        if (this.Categories.length > 0) {
            return this.Categories;
        }

        this.loadCategories();
        return null;
    }

    private loadShowcase(code: string) {
        if (this.api) {
            this.api.productDataApi.shopShowcasesList({ code: code }).then(res => {
                this.Showcases[code] = res.data;
                console.log("showcaseStore", this.Showcases);
            });
        }
    }
    getShowcase(code: string) {
        let showcase = this.Showcases[code];
        if (showcase) {
            return showcase;
        }

        this.loadShowcase(code);
        return null;
    }

    private loadBanner(code: string) {
        if (this.api) {
            this.api.siteDesignApi.shopRotatingBannersDetail(code).then(res => {
                this.Banners[code] = res.data;
            });
        }
    }
    getBanner(code: string) {
        let banner = this.Banners[code];
        if (banner) {
            return banner;
        }

        this.loadBanner(code);
        return null;
    }
}

export const backendStore = new BackendStore();