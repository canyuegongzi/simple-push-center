import {HttpService, Inject, Injectable, Post} from '@nestjs/common';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class CommonHttpService {
    constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

    /**
     * get请求数据
     */
    public async get(url: string, params: any, headers: any = {}) {
        try {
            const { data } = await this.httpService
                .get(url, { headers, params})
                .toPromise();
            return  data;
        } catch (e) {
            throw new ApiException('商品查询不到', 400, e);
        }
    }

    /**
     * post请求数据
     */
    public async post() {

    }

}
