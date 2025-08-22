import { err, ok } from 'neverthrow'

export class CloudIf {
	resultCache: any = [];

	constructor() {
	}


	async getMethod(url: string) {
		let response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'SP-MallCode': "sptville"
			},
			credentials: "include" // cookie를 보내도록 설정
		});

		if (response.status === 200)
			return ok(await response.json());
		else
			return err(await response.json());
	}

	async getProductCategories() {
		if (this.resultCache['getProductCategories'] !== undefined)
			return this.resultCache['getProductCategories'];

		let apiHost = `https://admin.ddddshop.co.kr`;
		let url = `${apiHost}/ProductApi/Shop/Categories`;
		let ret = await this.getMethod(url);

		if (ret.isOk()) {
			this.resultCache["getProductCategories"] = ret.value;
			return ret.value;
		}
		else {
			return [];
		}

	}

}


let cloudIf = new CloudIf();
export default cloudIf;
