# Run Single Test - VS Code Extension

یک اکستنشن VS Code برای اجرای تست‌های Angular/Jasmine/Karma به صورت جداگانه.

## ویژگی‌ها

- نمایش آیکون "▶ Run" کنار هر بلوک `describe` و `it`
- اجرای تست‌های خاص با یک کلیک
- پشتیبانی از `describe`، `fdescribe`، `it`، `fit`
- نمایش خروجی تست‌ها در پنل Output

## نصب

1. کلون یا دانلود این ریپازیتوری
2. در ترمینال اجرا کنید:
   ```bash
   npm install
   npm run compile
   ```
3. در VS Code، کلید `F5` را بزنید تا اکستنشن در پنجره Extension Development Host باز شود

## استفاده

1. یک فایل تست Angular/Jasmine را باز کنید
2. کنار هر بلوک `describe` یا `it` یک لینک "▶ Run: [نام تست]" نمایش داده می‌شود
3. روی لینک کلیک کنید تا تست اجرا شود
4. خروجی در پنل Output با نام "Run Single Test" نمایش داده می‌شود

## تنظیمات

در تنظیمات VS Code می‌توانید موارد زیر را تغییر دهید:

- `runSingleTest.karmaConfigPath`: مسیر فایل کانفیگ karma (پیش‌فرض: `karma.conf.js`)
- `runSingleTest.karmaCommand`: دستور اجرای karma (پیش‌فرض: `npm test`)

مثال:
```json
{
  "runSingleTest.karmaConfigPath": "karma.conf.js",
  "runSingleTest.karmaCommand": "npm test"
}
```

## نحوه کار

اکستنشن از CodeLens استفاده می‌کند تا لینک‌های اجرای تست را کنار بلوک‌های تست نمایش دهد. هنگام کلیک روی لینک، اکستنشن:

1. نام کامل تست (شامل describe های والد) را استخراج می‌کند
2. دستور karma را با فیلتر `--grep` اجرا می‌کند
3. خروجی را در پنل Output نمایش می‌دهد

## مثال

```typescript
describe('MyComponent', () => {
  // ▶ Run: MyComponent  <-- کلیک کنید
  
  it('should create', () => {
    // ▶ Run: should create  <-- کلیک کنید
  });
  
  describe('nested suite', () => {
    // ▶ Run: nested suite  <-- کلیک کنید
    
    it('should do something', () => {
      // ▶ Run: should do something  <-- کلیک کنید
    });
  });
});
```

## توسعه

```bash
# کامپایل
npm run compile

# کامپایل با watch mode
npm run watch

# بیلد برای انتشار
npm run vscode:prepublish
```

## مجوز

MIT

