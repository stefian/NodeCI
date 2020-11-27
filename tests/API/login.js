const Page = require('puppeteer/lib/Page');

Page.prototype.login = async function () {
  const user = await userFactory(); // Create new user for the test //
  const { session, sig } = sessionFactory(user);

  await this.setCookie({ name: 'session', value: session, domain: 'localhost:3000' });
  await this.setCookie({ name: 'session.sig', value: sig, domain: 'localhost:3000' });
  await this.reload({ waitUntil: 'domcontentloaded' });
  await this.waitForSelector('a[href="/auth/logout"]'); // test might fail here instead of expectation statement //

};