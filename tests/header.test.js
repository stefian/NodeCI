const puppeteer = require('puppeteer');

// jest.setTimeout(30000); //


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