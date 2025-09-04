
import { getShopicusAPI } from '$lib/service/api.config';
let api= getShopicusAPI();


export default class ShopicusFunc {
    static async getChildUsers(query: any) {
        const api = getShopicusAPI();
        const response = await api.request({
            path: '/AccountApi/ChildUsers/CurrentUser',
            method: 'GET',
            query: query
        });
        console.log(response);
        return response.data.result || [];
    }

 
    static async getCartItems(query: any) {
        const api = getShopicusAPI();
        const response = await api.request({
            path: '/OrderApi/Cart',
            method: 'GET',
            query: query
        });
        console.log(response);
        return response.data;
    }
}