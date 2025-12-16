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

- `runSingleTest.ngTestCommand`: دستور کامل برای اجرای ng test (پیش‌فرض: `node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test`)
- `runSingleTest.libraryName`: نام کتابخانه/پروژه برای ng test (مثال: `bdmp`)
- `runSingleTest.ngTestArgs`: آرگومان‌های اضافی برای ng test (پیش‌فرض: `--configuration=withConfig --browsers=ChromeDebug`)

مثال:
```json
{
  "runSingleTest.ngTestCommand": "node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test",
  "runSingleTest.libraryName": "bdmp",
  "runSingleTest.ngTestArgs": "--configuration=withConfig --browsers=ChromeDebug"
}
```

### نحوه تنظیم:

1. در VS Code، `Ctrl+,` (یا `Cmd+,` در Mac) را بزنید
2. در جستجو بنویسید: `runSingleTest`
3. مقادیر را تنظیم کنید:
   - **ngTestCommand**: دستور کامل ng test شما
   - **libraryName**: نام کتابخانه (مثل `bdmp`)
   - **ngTestArgs**: آرگومان‌های اضافی (مثل `--configuration=withConfig --browsers=ChromeDebug`)

## نحوه کار

اکستنشن از CodeLens استفاده می‌کند تا لینک‌های اجرای تست را کنار بلوک‌های تست نمایش دهد. هنگام کلیک روی لینک، اکستنشن:

1. نام کامل تست (شامل describe های والد) را استخراج می‌کند
2. دستور `ng test` را با فیلتر `--grep` برای اجرای فقط همان تست می‌سازد
3. دستور را اجرا می‌کند و خروجی را در پنل Output نمایش می‌دهد

### مثال دستور تولید شده:

اگر تست `should create` در `MyComponent` باشد، دستور زیر اجرا می‌شود:
```bash
node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test bdmp --configuration=withConfig --browsers=ChromeDebug --grep "MyComponent > should create"
```

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

