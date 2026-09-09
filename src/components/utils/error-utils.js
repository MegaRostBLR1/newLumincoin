export class ErrorUtils {
    static getMessage(result, operation = 'операцию') {
        if (!result || result.networkError) {
            return {
                title: 'Сервер недоступен',
                message: 'Проверьте интернет.',
                action: 'Повторите попытку.',
            };
        }

        switch (Number(result.status)) {
            case 400:
                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Проверьте данные.',
                    action: 'Повторите попытку.',
                };
            case 401:
                return {
                    title: 'Сессия истекла',
                    message: 'Войдите снова.',
                    action: '',
                };
            case 403:
                return {
                    title: 'Недостаточно прав',
                    message: 'Действие запрещено.',
                    action: '',
                };
            case 404:
                return {
                    title: 'Данные не найдены',
                    message: '',
                    action: '',
                };
            case 409:
                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Такие данные уже существуют.',
                    action: '',
                };
            case 422:
                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Проверьте поля.',
                    action: '',
                };
            case 429:
                return {
                    title: 'Слишком много запросов',
                    message: 'Повторите позже.',
                    action: '',
                };
            default:
                if (Number(result.status) >= 500) {
                    return {
                        title: 'Ошибка сервера',
                        message: `Не удалось выполнить ${operation}.`,
                        action: 'Повторите позже.',
                    };
                }

                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Повторите попытку.',
                    action: '',
                };
        }
    }

    static show(result, element, operation = 'операцию') {
        if (!element) return;

        const error = ErrorUtils.getMessage(result, operation);
        element.textContent = `${error.title}. ${error.message} ${error.action}`.trim();
    }
}
