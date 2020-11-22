const puppeteer = require('puppeteer');

jest.setTimeout(30000);

test('Adds 2 numbers', () => {
  const sum = 1 + 2;  

  expect(sum).toEqual(3);
});

test('We can launch a browser', async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('localhost:3000');

  // Get the text from the DOM element a.bran-logo //
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});