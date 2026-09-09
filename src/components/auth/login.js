import {Validation} from "../utils/validation.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {FormUtils} from "../utils/reset-validation.js";
import {ErrorUtils} from "../utils/error-utils.js";

export class Login {
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.inputsElement = document.querySelectorAll('.form-floating input');
        this.rememberMeInput = document.getElementById('remember-meInput');
        this.errorLogin = document.getElementById('error-login');

        const loginButton = document.getElementById('loginBtn');
        if (loginButton) {
            loginButton.onclick = this.login.bind(this);
        }
    }

    async login() {
        FormUtils.resetValidationErrors(this.inputsElement, this.errorLogin);

        const formData = Validation.validForm(this.inputsElement);
        if (!formData) {
            this.errorLogin.innerText = 'Заполните все поля корректно.';
            return;
        }

        const result = await AuthTokens.getTokensAfterRegistration(
            formData.emailInputElement,
            formData.passwordInputElement,
            Boolean(this.rememberMeInput?.checked)
        );

        if (!result || result.error) {
            if (result?.status === 401 || result?.status === 400 || result?.status === 422) {
                this.errorLogin.innerText = 'Неверный email или пароль.';
            } else {
                ErrorUtils.show(result, this.errorLogin, 'войти в аккаунт');
            }
            return;
        }

        this.errorLogin.innerText = '';
        await this.openNewRouteAutomatic('/');
    }
}
