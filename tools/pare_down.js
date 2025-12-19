const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, "../data/bofm.json");
const configFile = path.join(
    __dirname, "../data/cplan_configs/bofm_isaiah.json"
);
const outputFile = path.join(
    __dirname, "../data/bom_isaiah.json"
);

try{
    // Read the input JSON files
    const bofmRaw = fs.readFileSync(inputFile, 'utf8');
    const configRaw = fs.readFileSync(configFile, 'utf8');

    const bofm = JSON.parse(bofmRaw);
    const config = JSON.parse(configRaw);

    const result = {};

    /*
    // Pare down data to correct volumes only
    const targetBookOnly = data.filter(entry => entry.volume_title === "Doctrine and Covenants");
    */

    for(const [bookName, compressedChapters] of Object.entries(config.volumes.bofm.books)) {
        if(!bofm[bookName]) {
            console.warn(`Book not found: ${bookName}`);
            continue;
        }

        result[bookName] = {};

        let chapters = expandChapters(compressedChapters);

        chapters.forEach(chapterNum => {
            const chapterKey = String(chapterNum);

            if(!bofm[bookName][chapterKey]) {
                console.warn(`Chapter not found: ${bookName} ${chapterNum}`);
                return;
            }

            result[bookName][chapterKey] = bofm[bookName][chapterKey];
        });

        if(Object.keys(result[bookName]).length === 0) {
            delete result[bookName];
        }
    }


    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf-8");

    console.log(`Pare-Down Complete! Wrote ${Object.keys(result).length} verses from BOM to ${outputFile}`);
}catch(err){
    console.error("Error during pare-down process:", err.message);
}

// This expands the shorthand "11-15" -> "11, 12, 13, 14, 15"
function expandChapters(chapters){
    return chapters.flatMap(chapter => {
        if (typeof chapter === "number") {
            return chapter;
        }

        if(typeof chapter === "string" && chapter.includes("-")) {
            const [start, end] = chapter.split("-").map(Number);

            // This fills the array with items ranging from the start value going up by ones
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }

        return [];
    });
    
}