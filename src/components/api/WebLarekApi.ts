import { IApi, IApiProducts, TOrder, TOrderResponse } from "../../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }
  getProducts(): Promise<IApiProducts> {
    return this.api.get("/product/");
  }

  postOrder(data: TOrder): Promise<TOrderResponse> {
    return this.api.post("/order/", data);
  }
}
