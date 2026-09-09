export class ErrorUtils {
    static getMessage(result, operation = 'операцию') {
        if (!result || result.networkError) {
            return {
                title: 'Сервер недоступен',
                message: 'Не удалось соединиться с сервером.',
                action: 'Проверьте подключение к интернету и повторите попытку.',
            };
        }

        switch (Number(result.status)) {
            case 400:
                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Сервер получил некорректные данные.',
                    action: 'Проверьте введённые данные и повторите попытку.',
                };
            case 401:
                return {
                    title: 'Сессия истекла',
                    message: 'Срок действия авторизации закончился.',
                    action: 'Войдите в аккаунт снова.',
                };
            case 403:
                return {
                    title: `Недостаточно прав для выполнения ${operation}`,
                    message: 'Сервер запретил выполнение этого действия.',
                    action: 'Проверьте аккаунт или обратитесь к администратору.',
                };
            case 404:
                return {
                    title: 'Данные не найдены',
                    message: 'Запрашиваемый ресурс не существует или был удалён.',
                    action: 'Вернитесь назад и повторите попытку.',
                };
            case 409:
                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Такая запись уже существует или конфликтует с текущими данными.',
                    action: 'Проверьте данные и используйте другое значение.',
                };
            case 422:
                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Сервер не принял переданные данные.',
                    action: 'Проверьте заполненные поля и исправьте ошибки.',
                };
            case 429:
                return {
                    title: 'Слишком много запросов',
                    message: 'Сервер временно ограничил количество обращений.',
                    action: 'Подождите немного и повторите попытку.',
                };
            default:
                if (Number(result.status) >= 500) {
                    return {
                        title: 'Ошибка сервера',
                        message: `Не удалось выполнить ${operation} из-за временной ошибки сервера.`,
                        action: 'Повторите попытку через некоторое время.',
                    };
                }

                return {
                    title: `Не удалось выполнить ${operation}`,
                    message: 'Сервер не смог завершить запрос.',
                    action: 'Повторите попытку. Если ошибка повторяется, обратитесь в поддержку.',
                };
        }
    }

    static show(result, element, operation = 'операцию') {
        if (!element) return;

        const error = ErrorUtils.getMessage(result, operation);
        element.textContent = `${error.title}. ${error.message} ${error.action}`;
    }
}
