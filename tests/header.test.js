const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();  // the Proxy page for Puppeteer, custom and browser //
  await page.goto('http://localhost:3000'); // important to have http:// in front //
});

afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  // Get the text from the DOM element a.brand-logo //
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  await page.login();

  // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML); //
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout'); 
});