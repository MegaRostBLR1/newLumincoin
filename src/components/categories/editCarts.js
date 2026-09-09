import {AuthTokens} from "../utils/auth-utils.js";
import {Response} from "../utils/response-utils.js";

export class EditCarts {
    constructor(openNewRouteAutomatic, urlRequest, url) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.urlRequest = urlRequest;
        this.url = url;
        this.incomeElementTitle = localStorage.getItem('incomeElementTitle');
        this.incomeElementId = localStorage.getItem('incomeElementId');
        this.editElementTitle = document.getElementById('nameEditElement');
        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelEdit');

        if (!this.incomeElementId || !this.editElementTitle) {
            this.openNewRouteAutomatic(this.url).catch(error => console.error('Ошибка возврата к категориям:', error));
            return;
        }

        this.setEditElementValue();
        if (this.saveBtn) this.saveBtn.onclick = this.changeElementValue.bind(this);
        if (this.cancelBtn) this.cancelBtn.onclick = this.cancelEditElement.bind(this);
    }

    setEditElementValue() {
        this.editElementTitle.value = this.incomeElementTitle || '';
    }

    async changeElementValue() {
        const accessToken = AuthTokens.getToken(AuthTokens.accessTokenKey);
        if (!accessToken) {
            await AuthTokens.handleSessionExpired();
            return;
        }

        const editElementTitle = this.editElementTitle.value.trim();
        if (!editElementTitle) {
            this.editElementTitle.classList.add('invalid');
            return;
        }

        const result = await Response.getElementsFromBackend(
            'PUT',
            this.urlRequest + this.incomeElementId,
            accessToken,
            {title: editElementTitle}
        );

        if (!result || result.error) {
            console.error('Ошибка редактирования категории:', result);
            return;
        }

        localStorage.removeItem('incomeElementTitle');
        localStorage.removeItem('incomeElementId');
        await this.openNewRouteAutomatic(this.url);
    }

    async cancelEditElement() {
        localStorage.removeItem('incomeElementTitle');
        localStorage.removeItem('incomeElementId');
        await this.openNewRouteAutomatic(this.url);
    }
}
