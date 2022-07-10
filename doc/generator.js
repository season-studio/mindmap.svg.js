const jsdoc2md = require("jsdoc-to-markdown");
const fs = require('fs');
const path = require('path');

const jsdocOptions = {"no-gfm": false, "module-index-format": "none", "global-index-format": "none"};

function processFolder(_folderPath, _opt) {
    var folderInfo = fs.readdirSync(_folderPath);
    folderInfo.forEach(function (item, index) {
        var itemPath = path.resolve(_folderPath, item);
        var itemInfo = fs.statSync(itemPath);
        if (itemInfo.isDirectory()) {
            processFolder(itemPath, _opt);
        } else if (itemPath.endsWith(".js")) {
            console.log("\x1b[92m", "Documenting", item, "...\x1b[0m");
            var doc = jsdoc2md.getTemplateDataSync({ files: itemPath });
            var destFileName = path.basename(itemPath, ".js");
            (destFileName === "index") && (destFileName = path.basename(_folderPath));
            destFileName = destFileName + ".md";
            (doc instanceof Array) && doc.forEach(function (docItem, index) {
                if ("global" === docItem.scope) {
                    if (docItem.kind === "constant") {
                        _opt.constants.push(docItem);
                        doc[index] = undefined;
                    } else if (docItem.kind === "function") {
                        _opt.functions.push(docItem);
                        doc[index] = undefined;
                    } else if (docItem.kind === "event") {
                        _opt.events.push(docItem);
                        doc[index] = undefined;
                    } else if (docItem.kind === "class") {
                        _opt.classes.push({ docItem, file: destFileName });
                    }
                }
            });
            var docContent = jsdoc2md.renderSync(Object.assign({ data: doc }, jsdocOptions)).trim();
            docContent && fs.writeFileSync(path.resolve(_opt.docPath, destFileName), docContent);
        }
    })
}

function sortDocItem(a, b) {
    return String(a.name).localeCompare(b.name);
}

function generateDocs(_docPath, _srcFolders, _opt) {
    const opt = Object.assign((_opt || {}), {
        docPath: _docPath,
        constants: [],
        functions: [],
        classes: [],
        events: []
    });

    _srcFolders.forEach(function (folder) {
        processFolder(folder, opt);
    });

    const indexDoc = [];
    if (opt.classes.length > 0) {
        indexDoc.push("## Export Classes");
        opt.classes.sort(function (a, b) {
            return String(a.docItem.name).localeCompare(b.docItem.name);
        })
        opt.classes.forEach(function (item) {
            indexDoc.push(`- [${item.docItem.name}](./${item.file}#${item.docItem.id})`);
            indexDoc.push(`  ${item.docItem.description || ""} `);
        });
        indexDoc.push("");
    }

    opt.functions.sort(sortDocItem);
    const functionDoc = jsdoc2md.renderSync(Object.assign({data: opt.functions, "heading-depth": 3}, jsdocOptions)).trim();
    functionDoc && indexDoc.push("## Export Functions", functionDoc, "");

    opt.constants.sort(sortDocItem);
    const constantDoc = jsdoc2md.renderSync(Object.assign({data: opt.constants, "heading-depth": 3}, jsdocOptions)).trim();
    constantDoc && indexDoc.push("## Export Constants", constantDoc, "");

    opt.events.sort(sortDocItem);
    const eventDoc = jsdoc2md.renderSync(Object.assign({data: opt.events, "heading-depth": 3}, jsdocOptions)).trim();
    eventDoc && indexDoc.push("## Declared Events", eventDoc, "");

    opt.header && indexDoc.unshift(opt.header);
    opt.footer && indexDoc.push(opt.footer);

    fs.writeFileSync(path.resolve(_docPath, `${opt.indexFileName || "index"}.md`), indexDoc.join("\r\n"));
}

if (require.main === module) {
    const docPath = path.dirname(process.argv[1]);
    generateDocs(docPath, [path.resolve(docPath, "../src")]);
}

module.exports = generateDocs;

