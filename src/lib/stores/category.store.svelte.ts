import { getShopicusAPI } from "$lib/service/shopicus.api";

class CategoryStore {
    private Categories = $state<any[]>([]);

    loadData() {
        if (this.Categories.length > 0) {
            return;
        }

        let api = getShopicusAPI();
        if (api) {
            api.productApi.getCategories().then(res => {
                this.Categories = res.data;
            });
        }
    }

    getCategories() {
        return this.Categories;
    }
}

export const categoryStore = new CategoryStore();