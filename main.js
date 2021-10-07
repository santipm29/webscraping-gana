const cheerio = require("cheerio");
const puppeteer = require("puppeteer");


const getNumbers = (numbers) => {
  let fullNumber = '';
  for (const number of numbers.values()) {
    fullNumber += number;
  }
  return fullNumber;
}

const getResults = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.gana.com.co/resultados");
    await page.waitForSelector("#root", { timeout: 1000 });

    const body = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });


    const results = [];
    const $ = cheerio.load(body);
    $(".resultado-loteria").each((_, element) => {

      const winningNumber = [];
      const favorites = [];
      const winningSign = $(element).find(".series-signo p").text();
      const favoriteSign = $(element).find(".series-signo-fav p").text();
      const title = $(element).find(".resultado-loteria-title h3 b").text();
      const date = $(element).find(".resultado-loteria-title p").html();

      $(element)
        .find(".resultado-loteria--generator-number span")
        .each((_, element) => winningNumber.push($(element).text()));

      $(element)
        .find(".resultado-loteria--generator-favorite span")
        .each((_, element) => favorites.push($(element).text()));

      results.push({ title, date, numbers: getNumbers(winningNumber), favorites: getNumbers(favorites), winningSign, favoriteSign });
    });

    console.log(results);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

getResults();
