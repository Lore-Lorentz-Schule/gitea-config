/*
    (Modified) Copy of https://github.com/go-gitea/gitea/blob/main/build/generate-images.js (27.08.2022)
    For getting it to work on windows for generating images seperate from running gitea
*/

const imageminZopfli = require('imagemin-zopfli');
const svgo = require('svgo');
const fabric = require('fabric');
const appRoot = require("app-root-path");
const fs = require('fs');

function exit(err) {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
}

function loadSvg(svg) {
  return new Promise((resolve) => {
    fabric.fabric.loadSVGFromString(svg, (objects, options) => {
      resolve({objects, options});
    });
  });
}

async function generate(svg, path, {size, bg}) {
  const outputFile = appRoot + path;

  if (String(outputFile).endsWith('.svg')) {
    const {data} = svgo.optimize(svg, {
      plugins: [
        'preset-default',
        'removeDimensions',
        {
          name: 'addAttributesToSVGElement',
          params: {attributes: [{width: size}, {height: size}]}
        },
      ],
    });
    await fs.writeFileSync(outputFile, data);
    return;
  }

  const {objects, options} = await loadSvg(svg);
  const canvas = new fabric.fabric.Canvas();
  canvas.setDimensions({width: size, height: size});
  const ctx = canvas.getContext('2d');
  ctx.scale(options.width ? (size / options.width) : 1, options.height ? (size / options.height) : 1);

  if (bg) {
    canvas.add(new fabric.fabric.Rect({
      left: 0,
      top: 0,
      height: size * (1 / (size / options.height)),
      width: size * (1 / (size / options.width)),
      fill: 'white',
    }));
  }

  canvas.add(fabric.fabric.util.groupSVGElements(objects, options));
  canvas.renderAll();

  let png = Buffer.from([]);
  for await (const chunk of canvas.createPNGStream()) {
    png = Buffer.concat([png, chunk]);
  }

  png = await imageminZopfli({more: true})(png);
  await fs.writeFileSync(outputFile, png);
}

async function main() {
  const logoSvg = await fs.readFileSync(appRoot + '/logo.svg', 'utf8');
  const faviconSvg = await fs.readFileSync(appRoot + '/favicon.svg', 'utf8');
  const path = '/../gitea/gitea/public/img/'

  await Promise.all([
    generate(logoSvg, path + 'logo.svg', {size: 32}),
    generate(logoSvg, path + 'logo.png', {size: 512}),
    generate(faviconSvg, path + 'favicon.svg', {size: 32}),
    generate(faviconSvg, path + 'favicon.png', {size: 180}),
    generate(logoSvg, path + 'avatar_default.png', {size: 200}),
    generate(logoSvg, path + 'apple-touch-icon.png', {size: 180, bg: true}),
    generate(logoSvg, path + 'gitea.svg', {size: 32}),
  ]);
}

main().then(exit).catch(exit);
