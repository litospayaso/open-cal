import fs from 'fs';

const languages = ['es', 'de', 'it', 'fr', 'en'];
const maxTimeout = 6000;

let page = 11;
let maxPages = 150;
let cookie = '';

Array.prototype.forEachAsync = async function(fn) {
  for (let t of this) { await fn(t) }
}

const openCookiFile = () => {
  cookie = fs.readFileSync(`cookie.txt`, `utf8`);
}

const makeRequest = async (page, lan) => {
  return new Promise(async (resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 15000);
    const url = `https://${lan === 'en' ? 'world' : lan}.openfoodfacts.org/cgi/search.pl?action=process&sort_by=unique_scans_n&page_size=100&json=true&fields=code,nutriments,product_name${lan === 'en' ? '' : '_'.concat(lan)},brands&page=${page}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BroteApp/1.0 (https://brote.app; angel.jesuita@gmail.com)',
        Cookie: cookie
      }
    });
    //checking if response is valid json
    if (response.ok) {
      const data = await response.json();
      resolve(data);
    } else {
      page--;
      resolve(null);
    }
  });
}

const appendProducts = async (products, lan) => {
  //create file if doesn't exists:
  if (!fs.existsSync(`assets/data/products_${lan}.json`)) {
    fs.writeFileSync(`assets/data/products_${lan}.json`, ``);
  }
  const data = JSON.stringify(products);
  fs.appendFileSync(`assets/data/products_${lan}.json`, data);

  // replacing ][ with ,
  const file = await fs.readFileSync(`assets/data/popular_${lan}.json`, `utf8`);
  const data2 = file.replaceAll(`][`, `,`);
  fs.writeFileSync(`assets/data/popular_${lan}.json`, data2);
}

const requestLanguage = async (language) => {
  return new Promise(async (resolve) => {
    for (;page <= maxPages;page++) {
      console.log(`${language} - Page ${page}`);
      process.stdout.write(`Waiting ${maxTimeout / 1000} seconds.`);
      const interval = setInterval(() => process.stdout.write(`.`), 1000);
      await new Promise(resolve => setTimeout(resolve, maxTimeout));
      interval.close();
      process.stdout.write(`\n`);
      process.stdout.write(`making request page ${page}`);
      const pageInterval = setInterval(() => process.stdout.write(`.`), 1000);
      const data = await makeRequest(page, language);
      pageInterval.close();
      process.stdout.write(`\n`);
      if (data && data.products) {
        appendProducts(data.products.
          filter((product) => product[`product_name${language === 'en' ? '' : '_'.concat(language)}`])
          .map((product) =>
            `${product.code} :: ${product[`product_name${language === 'en' ? '' : '_'.concat(language)}`]} - ${product.brands} ${product?.nutriments?.['energy-kcal_100g'] ? `[${Math.trunc(Number(product.nutriments?.['energy-kcal_100g']))}]` : ''}`), language);
      } else {
        console.log(`Page ${page} failed`);
        console.log(`Retrying...`);
        page--;
      }
    }
    resolve()
  });
}

const main = async () => {
  await openCookiFile();
  languages.forEachAsync(async (lan) => {
    await requestLanguage(lan);
    page = 0;
  });
}

main();