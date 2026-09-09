import {Validation} from "../utils/validation.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {FormUtils} from "../utils/reset-validation.js";

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
            this.errorLogin.innerText = 'Пожалуйста, заполните все поля корректно';
            return;
        }

        const result = await AuthTokens.getTokensAfterRegistration(
            formData.emailInputElement,
            formData.passwordInputElement,
            Boolean(this.rememberMeInput?.checked)
        );

        if (!result || result.error) {
            this.errorLogin.innerText = result?.networkError
                ? 'Не удалось соединиться с сервером'
                : 'Неверный email или пароль';
            return;
        }

        this.errorLogin.innerText = '';
        await this.openNewRouteAutomatic('/');
    }
}
