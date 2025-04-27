# Playwright Request Quote Automation Tests

Этот репозиторий содержит автоматизированные тесты для формы "Request a Quote" (Запрос предложения) на веб-сайте [https://qatest.datasub.com/index.html](https://qatest.datasub.com/index.html).  Тесты написаны с использованием Playwright, фреймворка для сквозного тестирования (end-to-end testing).

## Описание

Тесты предназначены для проверки следующего:

*   Корректная отправка формы "Request a Quote".
*   Обработка ошибок, включая ожидаемую ошибку 501 (Not Implemented).
*   Валидация отображения сообщений об ошибках.

## Предварительные требования

Убедитесь, что у вас установлено следующее:

*   **Node.js:** (версия 16 или выше). Рекомендуется использовать LTS версию.  Вы можете скачать Node.js с [https://nodejs.org/](https://nodejs.org/).
*   **npm** (или yarn, или pnpm).  npm обычно устанавливается вместе с Node.js.
*   **Git:**  (для клонирования репозитория). Вы можете скачать Git с [https://git-scm.com/](https://git-scm.com/).

## Установка

1.  **Клонируйте репозиторий:**

    ```bash
    git clone https://github.com/Pwnzmoroz/playwright-request-quote.git
    cd playwright-request-quote
    ```

2.  **Установите зависимости:**

    ```bash
    npm install  # или yarn install или pnpm install
    ```

3. **Установите Playwright browsers**
    ```bash
    npx playwright install #установка всех браузеров
    npx playwright install chromium # установка только chromium
    ```

## Запуск тестов

Вы можете запустить тесты следующими способами:

*   **Запуск всех тестов:**

    ```bash
    npx playwright test
    ```

*   **Запуск тестов в режиме UI (Playwright Inspector):**

    ```bash
    npx playwright test --ui
    ```

*   **Запуск тестов с просмотром трассировки:**

    ```bash
    npx playwright test --trace on
    ```

    После завершения тестов вы сможете просмотреть трассировку, запустив `npx playwright show-trace`.

*   **Запуск тестов в режиме Headed (с отображением браузера):**

    ```bash
    npx playwright test --headed
    ```

## Конфигурация

Файл конфигурации Playwright (`playwright.config.ts`) содержит основные настройки для тестов, такие как:

*   `baseURL`: Базовый URL для тестируемого сайта (в данном случае, `https://qatest.datasub.com/index.html`).
*   `timeout`: Общий таймаут для тестов.
*   `reporter`:  Репортер для формирования отчетов о тестировании.
*   `use`:  Настройки для браузеров, headless режим, и т.д.

## Структура проекта
