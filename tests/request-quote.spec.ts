import { test, expect } from '@playwright/test';

const BASE_URL = 'https://qatest.datasub.com/index.html';

test.describe('Request A Quote Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    
    // Более надежный способ скролла и ожидания формы
    const form = page.locator('#subscriptionForm');
    for (let attempt = 0; attempt < 3; attempt++) {
      await form.scrollIntoViewIfNeeded();
      if (await form.isVisible()) break;
      await page.waitForTimeout(1000);
    }
    await expect(form).toBeVisible();
  });

  test('Form submission with error handling', async ({ page }) => {
    // 1. Заполнение формы с проверками
    await test.step('Fill form fields', async () => {
      await page.fill('#name', 'Дмитрий');
      await expect(page.locator('#name')).toHaveValue('Дмитрий');
      
      await page.fill('#email', 'mrz_2001@mail.ru');
      await expect(page.locator('#email')).toHaveValue('mrz_2001@mail.ru');
      
      await page.selectOption('#service', { value: 'B Service' });
      await expect(page.locator('#service')).toHaveValue('B Service');
      
      await page.locator('#purposeBusiness').click({ force: true, timeout: 5000 });
      await expect(page.locator('#purposeBusiness')).toBeChecked();
      
      await page.locator('#withdrawCard').click({ force: true });
      await expect(page.locator('#withdrawCard')).toBeChecked();
      
      await page.fill('#message', 'сообщение');
      await expect(page.locator('#message')).toHaveValue('сообщение');
    });

    // 2. Настройка перехвата запросов
    let requestIntercepted = false;
    let requestUrl = '';
    await page.route('**/*', async route => {
      requestIntercepted = true;
      requestUrl = route.request().url();
      console.log(`Intercepted request to: ${requestUrl}`);
      await route.continue();
    });

    // 3. Сбор ошибок со страницы
    const jsErrors: string[] = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') jsErrors.push(msg.text());
    });

    // 4. Отправка формы с расширенной обработкой ошибок
    try {
      const submitPromise = page.click('button:has-text("Request A Quote")', { 
        force: true,
        timeout: 10000
      });

      const responsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const status = response.status();
          console.log(`Detected response from ${url} with status ${status}`);
          return url.includes('/submit') || url.includes(BASE_URL);
        },
        { timeout: 15000 }
      );

      const [response] = await Promise.all([responsePromise, submitPromise]);
      console.log(`Final response status: ${response.status()}`);

      // 5. Обработка различных статусов ответа
      if (response.status() === 501) {
        console.warn('Server returned 501 (Not Implemented)');
        await expect(page.locator('#formStatus')).toBeVisible({ timeout: 5000 });
        const statusText = await page.locator('#formStatus').textContent();
        expect(statusText).toMatch(/ошибка|error|501/i);
        return;
      }

      if (response.status() === 200) {
        await expect(page.locator('#formStatus')).toBeVisible();
        const statusText = await page.locator('#formStatus').textContent();
        expect(statusText).toMatch(/успех|success/i);
        return;
      }

    // Для других статусов
console.warn(`Unexpected status code: ${status}`);
expect([200, 501]).toContain(status); // ← Исправленная строка

    } catch (error) {
      // 6. Детальный анализ ошибок с явной проверкой типа
      if (error instanceof Error) {
        console.error('Test failed:', error.message);
      } else {
        console.error('Test failed with non-Error object:', error);
      }

      if (!requestIntercepted) {
        console.error('Form submission failed - no request detected');
        if (jsErrors.length) {
          console.error('JavaScript errors:', jsErrors);
        } else {
          console.error('No JavaScript errors detected');
        }
        
        // Проверка состояния кнопки
        const isButtonDisabled = await page.locator('button:has-text("Request A Quote")').isDisabled();
        console.log('Submit button disabled:', isButtonDisabled);
        
        // Проверка валидации формы
        const nameError = await page.locator('#name + .invalid-feedback').isVisible();
        const emailError = await page.locator('#email + .invalid-feedback').isVisible();
        console.log('Validation errors - name:', nameError, 'email:', emailError);
      } else if (requestUrl) {
        console.error(`Request was sent to ${requestUrl} but no response received`);
      }

      // Скриншот и источник страницы для диагностики
      await page.screenshot({ path: 'form-error.png', fullPage: true });
      const html = await page.content();
      console.log('Page content length:', html.length);
      
      throw error;
    }
  });
});