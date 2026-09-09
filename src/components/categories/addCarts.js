import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";

export class AddCart {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.url = url;
        this.urlRequest = urlRequest;
        this.createBtn = document.getElementById('createCartBtn');
        this.cancelBtn = document.getElementById('cancelCreateCartBtn');
        this.inputCartValue = document.getElementById('nameCreateIncomeElement');

        if (this.createBtn) this.createBtn.onclick = this.addCart.bind(this);
        if (this.cancelBtn) this.cancelBtn.onclick = () => this.openNewRouteAutomatic(this.url);
    }

    async addCart() {
        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const title = this.inputCartValue?.value.trim() || '';
        if (!title) {
            this.inputCartValue?.classList.add('invalid');
            return;
        }

        const result = await Response.getElementsFromBackend(
            'POST',
            this.urlRequest,
            accessToken,
            {title}
        );

        if (!result || result.error || !result.title) {
            console.error('Ошибка создания категории:', result);
            return;
        }

        await this.openNewRouteAutomatic(this.url);
    }
}
