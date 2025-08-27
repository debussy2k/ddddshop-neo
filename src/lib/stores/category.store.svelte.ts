import { getShopicusAPI } from "$lib/service/shopicus.api";

class CategoryStore {
    public cachedCategories = $state<any[]>([]);

    loadData() {
        if (this.cachedCategories.length > 0) {
            return;
        }

        let api = getShopicusAPI();
        if (api) {
            api.productApi.getCategories().then(res => {
                this.cachedCategories = res.data;
            });
        }
    }

    getCategories() {
        return this.cachedCategories;
    }
}

export const categoryStore = new CategoryStore();