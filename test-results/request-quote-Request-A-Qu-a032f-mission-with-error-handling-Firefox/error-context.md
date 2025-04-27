# Test info

- Name: Request A Quote Form Tests >> Form submission with error handling
- Location: C:\git\playwright-request-quote\tests\request-quote.spec.ts:19:7

# Error details

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://qatest.datasub.com/index.html", waiting until "networkidle"

    at C:\git\playwright-request-quote\tests\request-quote.spec.ts:7:16
```

# Page snapshot

```yaml
- text:  123 Street, New York, USA 
- link "+012 345 6789":
  - /url: tel:0123456789
- text: 
- link "info@example.com":
  - /url: mailto:test@example.com
- link "":
  - /url: ""
- link "":
  - /url: ""
- link "":
  - /url: ""
- link "":
  - /url: ""
- link "":
  - /url: ""
- navigation:
  - link " Startup":
    - /url: index.html
    - heading " Startup" [level=1]
  - link "Home":
    - /url: index.html
  - link "About":
    - /url: about.html
  - link "Quote":
    - /url: quote.html
  - link "Contact":
    - /url: contact.html
- img "Image"
- heading "Innovation & Focused" [level=5]
- heading "Driven by Innovation, Powered by Passion" [level=1]
- link "Free Quote":
  - /url: quote.html
- link "Contact Us":
  - /url: contact.html
- button "Previous"
- button "Next"
- text: 
- heading "Happy Clients" [level=5]
- heading "236" [level=1]
- text: 
- heading "Projects Done" [level=5]
- heading "226" [level=1]
- text: 
- heading "Win Awards" [level=5]
- heading "184" [level=1]
- paragraph: © All Rights Reserved 2025.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | const BASE_URL = 'https://qatest.datasub.com/index.html';
   4 |
   5 | test.describe('Request A Quote Form Tests', () => {
   6 |   test.beforeEach(async ({ page }) => {
>  7 |     await page.goto(BASE_URL, { waitUntil: 'networkidle' });
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
   8 |     
   9 |     // Более надежный способ скролла и ожидания формы
   10 |     const form = page.locator('#subscriptionForm');
   11 |     for (let attempt = 0; attempt < 3; attempt++) {
   12 |       await form.scrollIntoViewIfNeeded();
   13 |       if (await form.isVisible()) break;
   14 |       await page.waitForTimeout(1000);
   15 |     }
   16 |     await expect(form).toBeVisible();
   17 |   });
   18 |
   19 |   test('Form submission with error handling', async ({ page }) => {
   20 |     // 1. Заполнение формы с проверками
   21 |     await test.step('Fill form fields', async () => {
   22 |       await page.fill('#name', 'Дмитрий');
   23 |       await expect(page.locator('#name')).toHaveValue('Дмитрий');
   24 |       
   25 |       await page.fill('#email', 'mrz_2001@mail.ru');
   26 |       await expect(page.locator('#email')).toHaveValue('mrz_2001@mail.ru');
   27 |       
   28 |       await page.selectOption('#service', { value: 'B Service' });
   29 |       await expect(page.locator('#service')).toHaveValue('B Service');
   30 |       
   31 |       await page.locator('#purposeBusiness').click({ force: true, timeout: 5000 });
   32 |       await expect(page.locator('#purposeBusiness')).toBeChecked();
   33 |       
   34 |       await page.locator('#withdrawCard').click({ force: true });
   35 |       await expect(page.locator('#withdrawCard')).toBeChecked();
   36 |       
   37 |       await page.fill('#message', 'сообщение');
   38 |       await expect(page.locator('#message')).toHaveValue('сообщение');
   39 |     });
   40 |
   41 |     // 2. Настройка перехвата запросов
   42 |     let requestIntercepted = false;
   43 |     let requestUrl = '';
   44 |     await page.route('**/*', async route => {
   45 |       requestIntercepted = true;
   46 |       requestUrl = route.request().url();
   47 |       console.log(`Intercepted request to: ${requestUrl}`);
   48 |       await route.continue();
   49 |     });
   50 |
   51 |     // 3. Сбор ошибок со страницы
   52 |     const jsErrors: string[] = [];
   53 |     page.on('pageerror', error => jsErrors.push(error.message));
   54 |     page.on('console', msg => {
   55 |       if (msg.type() === 'error') jsErrors.push(msg.text());
   56 |     });
   57 |
   58 |     // 4. Отправка формы с расширенной обработкой ошибок
   59 |     try {
   60 |       const submitPromise = page.click('button:has-text("Request A Quote")', { 
   61 |         force: true,
   62 |         timeout: 10000
   63 |       });
   64 |
   65 |       const responsePromise = page.waitForResponse(
   66 |         response => {
   67 |           const url = response.url();
   68 |           const status = response.status();
   69 |           console.log(`Detected response from ${url} with status ${status}`);
   70 |           return url.includes('/submit') || url.includes(BASE_URL);
   71 |         },
   72 |         { timeout: 15000 }
   73 |       );
   74 |
   75 |       const [response] = await Promise.all([responsePromise, submitPromise]);
   76 |       console.log(`Final response status: ${response.status()}`);
   77 |
   78 |       // 5. Обработка различных статусов ответа
   79 |       if (response.status() === 501) {
   80 |         console.warn('Server returned 501 (Not Implemented)');
   81 |         await expect(page.locator('#formStatus')).toBeVisible({ timeout: 5000 });
   82 |         const statusText = await page.locator('#formStatus').textContent();
   83 |         expect(statusText).toMatch(/ошибка|error|501/i);
   84 |         return;
   85 |       }
   86 |
   87 |       if (response.status() === 200) {
   88 |         await expect(page.locator('#formStatus')).toBeVisible();
   89 |         const statusText = await page.locator('#formStatus').textContent();
   90 |         expect(statusText).toMatch(/успех|success/i);
   91 |         return;
   92 |       }
   93 |
   94 |     // Для других статусов
   95 | console.warn(`Unexpected status code: ${status}`);
   96 | expect([200, 501]).toContain(status); // ← Исправленная строка
   97 |
   98 |     } catch (error) {
   99 |       // 6. Детальный анализ ошибок с явной проверкой типа
  100 |       if (error instanceof Error) {
  101 |         console.error('Test failed:', error.message);
  102 |       } else {
  103 |         console.error('Test failed with non-Error object:', error);
  104 |       }
  105 |
  106 |       if (!requestIntercepted) {
  107 |         console.error('Form submission failed - no request detected');
```