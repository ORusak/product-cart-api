# Описание
Цель мини-проекта - реализовать простое API “корзины” интернет-магазина для неавторизованных
пользователей. Возможности зарегистрироваться или залогиниться в магазин нет.
В магазине имеется неограниченный запас фиксированного набора продуктов (например, бутылка
молока, булка хлеба, палка колбасы).
Пользовательского интерфейса у системы нет. Посетитель через вызовы API может просмотреть
список продуктов, добавить любой продукт себе в корзину любое количество раз, удалить ранее
помещенный продукт из корзины и просмотреть свою корзину.

# Требования
## Обязательные требования:
* Формат данных: JSON.
* Использовать стабильную LTS версию NodeJS
* Можно использовать фреймворк Express или другие доступные расширения Node.JS
* Список продуктов должен храниться в MongoDB
* Достаточное время хранения корзины - 5 минут, постоянное хранение данных на
сервере не требуется.

## Бонусные задачи:
* Валидация данных
* Обработка ошибок
* Обработка типов запросов (GET, POST, DELETE)
* Использование .htaccess для реализации канонических URL
* Методы должны возвращать соответствующие Status-Code:
    * Все успешные запросы возвращают: 200
    * Ошибки входящих параметров: 400
    * При доступе к несуществующему методу: 404
    * При внутренней ошибке сервера: 500
6. Unit-тесты, покрывающие некоторый функционал
7. Описание установки системы

# Ограничения к первоначальному заданию
* Убран уровень data и error в ответах не понятно его назначение с учетом того что код ответа определяет данные
* Изменен формат json ошибок под стандарт swagger, так как основа сервиса
# Не реализованные требования
* Unit test
* Использование .htaccess для реализации канонических URL
* Job для очистки корзины. "Достаточное время хранения корзины - 5 минут, постоянное хранение данных на
сервере не требуется."

# Реализация
## Технологии
* nodejs, mongodb, swagger, json schema
* логирование winston
* тесты sinon, ava
* стилистика standard
# Установка
## Окружение
### nodejs
* LTS версия больше 8.9.1 
### mongodb
* Установите mongodb (https://www.mongodb.com/)
    * Убедитесь, что БД запускается с значениями по умолчанию
    * По умолчанию проект ожидает БД по адрeсу: mongodb://localhost:27017. Если это не так измените конфигурацию проекта /config/default.json.
## Настройка проекта
* Склонируйте репозиторий, установите зависимости
```
git clone https://github.com/ORusak/product-cart-api.git
cd product-cart-api
npm i
npm start
```
* При старте сервера автоматически в БД будет мигрирован справочник продуктов (/fixture/product/product.json)
* Проект будет доступен по адресу
    * API http://localhost:8080/api
    * Документация http://localhost:8080/api/docs

# Использование 
* Со страницы документации можно вызывать соответствующий endpoint используя кнопку Execute

# Примечание к реализации
## API
* Запросы должны отвечать измененными данными
    * POST, DELETE /cart должен отвечать информацией о измененной корзине после добавления. Это позволяет из бегать лишнего запроса
    для обновления корзины на клиенте и лучше понимать результат вызова.
* 
## Доработки
* Выделить обработку ошибок в отдельный модуль