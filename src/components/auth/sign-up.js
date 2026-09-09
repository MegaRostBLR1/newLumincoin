import {Response} from "../utils/response-utils.js";
import {AuthTokens} from "../utils/auth-utils.js";
import {Validation} from "../utils/validation.js";
import {FormUtils} from "../utils/reset-validation.js";

export class SignUp {
    constructor(openNewRouteAutomatic) {
        this.openNewRouteAutomatic = openNewRouteAutomatic;
        this.inputsElement = document.querySelectorAll('.form-floating input');
        this.errorSignUp = document.getElementById('error-singUp');

        const signUpButton = document.getElementById('singUpBtn');
        if (signUpButton) {
            signUpButton.onclick = this.signUp.bind(this);
        }
    }

    async signUp() {
        FormUtils.resetValidationErrors(this.inputsElement, this.errorSignUp);

        const formData = Validation.validForm(this.inputsElement);
        if (!formData) {
            this.errorSignUp.innerText = 'Пожалуйста, заполните все поля корректно';
            return;
        }

        const result = await Response.getElementsFromBackend('POST', '/signup', null, {
            name: formData.nameInputElement,
            lastName: formData.lastNameInputElement,
            email: formData.emailInputElement,
            password: formData.passwordInputElement,
            passwordRepeat: formData.passwordReplaceInputElement,
        });

        if (!result || result.error || !result.user?.email) {
            if (result?.networkError) {
                this.errorSignUp.innerText = 'Не удалось соединиться с сервером';
            } else if (result?.status === 409) {
                this.errorSignUp.innerText = 'Этот email уже зарегистрирован.';
            } else {
                this.errorSignUp.innerText = 'Не удалось зарегистрировать пользователя';
            }
            return;
        }

        const authResult = await AuthTokens.getTokensAfterRegistration(
            result.user.email,
            formData.passwordInputElement
        );

        if (!authResult || authResult.error) {
            this.errorSignUp.innerText = authResult?.networkError
                ? 'Пользователь создан, но сервер недоступен для входа'
                : 'Пользователь создан, но автоматический вход не выполнен';
            return;
        }

        this.errorSignUp.innerText = '';
        await this.openNewRouteAutomatic('/');
    }
}
