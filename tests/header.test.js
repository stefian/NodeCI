const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

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

test('When signed in, shows logout button', async () => {
  // const id = '5fb2a9e25f0b478e40c16a3b';  // Dev user from Mongo users collection //
  const user = await userFactory(); // Create new user for the test //
  const { session, sig } = sessionFactory(user);

  // await page.goto('http://localhost:3000'); // Must be on the domain to associate the cookie with it //
  await page.setCookie({ name: 'session', value: session, domain: 'localhost:3000' });
  await page.setCookie({ name: 'session.sig', value: sig, domain: 'localhost:3000' });
  // await page.goto('http://localhost:3000'); // Refresh the page after cookie setup //
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.waitForSelector('a[href="/auth/logout"]'); // test might fail here instead of expectation statement //

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout'); 
});