import MarkdownIt from 'markdown-it';
import containerPlugin from 'markdown-it-container';
import fs from 'node:fs/promises';
import fse from 'fs-extra/esm';
import path from 'node:path';
import juice from 'juice';

const template1Start = `<div class="container">`;
const template1End = `</div>`;

const template2Start = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        .naver-cafe-post {
            width: 743px;
            padding: 14px;
            border: 1px rgb(218, 216, 215) solid;
            margin: 0 auto;
        }
    </style>
</head>
<body>
<article class="naver-cafe-post">
`;
const template2End = `
</div>
</body>
</html>
`;

main();

async function main() {
    const config = await fse.readJson('./markcafe-config.json', 'utf8');
    if (config.generatedDirectoryPath.endsWith('/')) config.generatedDirectoryPath = config.generatedDirectoryPath.slice(0, str.length - 1);
    if (!config.imgSrcPrefix.endsWith('/')) config.imgSrcPrefix += '/';
    const md = new MarkdownIt(config.markdownItOptions).use(containerPlugin, 'tip', {
        render: (tokens, idx) => {
            if (tokens[idx].nesting === 1) {
                return `<div class="tip-header">${config.tipHeaderContent}</div>\n<div class="tip">`;
            } else {
                return `</div>\n`;
            }
        }
    });
    const oldImageRule = md.renderer.rules.image;
    md.renderer.rules.image = (tokens, idx, options, env, slf) => {
        if (tokens[idx].nesting !== 0) return oldImageRule(tokens, idx, options, env, slf);
        if (tokens[idx].attrGet('src').startsWith('images/')) {
            tokens[idx].attrSet('src', config.imgSrcPrefix + tokens[idx].attrGet('src'));
        }
        let result = oldImageRule(tokens, idx, options, env, slf);
        if (idx === 0) {
            result = `<div class="img-wrapper">` + result;
        }
        if (idx === tokens.length - 1) {
            result = result + `</div>`;
        }
        return result;
    };

    await fse.emptyDir(config.generatedDirectoryPath);

    const promises = [];
    promises.push(fse.copy(config.imagesDirectoryPath, path.join(config.generatedDirectoryPath, 'images')));
    promises.push((async () => {
        const css = await fs.readFile(config.cssPath, 'utf8');

        const filenames = await fs.readdir(config.articlesDirectoryPath);
        await Promise.all(filenames.map(async filename => {
            const baseName = filename.replace(/\.[^/.]+$/, '');
            await convertFile(md, css, path.join(config.articlesDirectoryPath, filename), path.join(config.generatedDirectoryPath, baseName + '.html.txt'), path.join(config.generatedDirectoryPath, baseName + '.html'));
        }));
    })());
    await Promise.all(promises);
}

async function convertFile(md, css, srcPath, targetTxtPath, targetHtmlPath) {
    const src = await fs.readFile(srcPath, 'utf8');
    const rendered = md.render(src);
    const templated1 = template1Start + rendered + template1End;
    const juiced = juice.inlineContent(templated1, css, {
        inlinePseudoElements: true,
        preserveFontFaces: false,
        preserveImportant: false,
        preserveMediaQueries: false,
        preserveKeyFrames: false,
        preservePseudos: false,
    });
    const templated2 = template2Start + juiced + template2End;

    await Promise.all([
        fs.writeFile(targetTxtPath, juiced),
        fs.writeFile(targetHtmlPath, templated2),
    ]);
}
