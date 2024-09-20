const Puppeteer = require("puppeteer");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require('path');
const data = require("./database.json");
const moment = require('moment')

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', function(value, format) {
    return moment(value).format(format);
});

(async function () {
  try {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();

    const content = await compile('shot-list', data);

    await page.setContent(content, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    await page.pdf({
      format: "A4",
      path: "mypdf.pdf",
      printBackground: true,
    });
    console.log("Done.....");
    await browser.close();
    process.exit();
  } catch (error) {
    console.log("Error: ", error);
  }
})();
