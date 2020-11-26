const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await browser.close();
});


test('the header has the correct text', async () => {
  // Get the text from the DOM element a.bran-logo //
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test.only('When signed in, shows logout button', async () => {
  const id = '5fb2a9e25f0b478e40c16a3b';  // Dev user from Mongo users collection //

  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer.from(
    JSON.stringify(sessionObject)).toString('base64');
  
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);  // session= + - is how the Cookie lib is doing this //

  // await page.goto('http://localhost:3000'); // Must be on the domain to associate the cookie with it //
  await page.setCookie({ name: 'session', value: sessionString, domain: 'localhost:3000' });
  await page.setCookie({ name: 'session.sig', value: sig, domain: 'localhost:3000' });
  // await page.goto('http://localhost:3000'); // Refresh the page after cookie setup //
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.waitForSelector('a[href="/auth/logout"]'); // test might fail here instead of expectation statement //

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout'); 
});