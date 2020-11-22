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

});