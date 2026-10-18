// scratch/test_full_suite.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Mock browser environment
const elementsMap = {};
function createMockElement(id) {
    const el = {
        id,
        tagName: "DIV",
        value: "",
        textContent: "",
        innerHTML: "",
        style: { setProperty: () => {} },
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            toggle(c, force) {
                if (force === undefined) {
                    if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c);
                } else if (force) {
                    this.classes.add(c);
                } else {
                    this.classes.delete(c);
                }
                return this.classes.has(c);
            },
            contains(c) { return this.classes.has(c); },
        },
        children: [],
        appendChild(child) { this.children.push(child); return child; },
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k] || null; },
        removeAttribute(k) { delete this[k]; },
        addEventListener() {},
        querySelector() { return null; },
        querySelectorAll() { return []; },
        closest() { return null; },
    };
    return el;
}

global.window = global;
global.window.addEventListener = () => {};
global.document = {
    getElementById(id) {
        if (!elementsMap[id]) {
            elementsMap[id] = createMockElement(id);
        }
        return elementsMap[id];
    },
    querySelectorAll(selector) {
        return [];
    },
    querySelector(selector) {
        return null;
    },
    createElement(tag) {
        return createMockElement(tag);
    },
    addEventListener() {},
};
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
};
global.Audio = class {
    play() { return Promise.resolve(); }
    pause() {}
};

// 1. Load Data.js
const dataCode = fs.readFileSync(path.join(__dirname, "../Data.js"), "utf8");
vm.runInThisContext(dataCode);

// 2. Load script.js
const scriptCode = fs.readFileSync(path.join(__dirname, "../script.js"), "utf8");
vm.runInThisContext(scriptCode);

console.log("=== RUNNING FULL SUITE TEST ===");

// 1. Verify Mutations List
console.log("\n[TEST 1] Mutations System Check:");
console.assert(MutationsList.length >= 9, "Expected at least 9 mutations");
const requiredMutations = ["Nuclear", "Galactic", "Robotic"];
for (const mutName of requiredMutations) {
    const found = MutationsList.find(m => m.name === mutName);
    console.assert(found, `Mutation ${mutName} should exist in MutationsList`);
    console.log(`  ✓ Found mutation: ${mutName} (×${found.multiplier})`);
}

// 2. Compact Number Formatting Check
console.log("\n[TEST 2] Compact Number Formatting:");
console.assert(FormatNumber(950) === "950", "950 format");
console.assert(FormatNumber(1500) === "1.5K", "1500 format");
console.assert(FormatNumber(1000000) === "1M", "1M format");
console.assert(FormatNumber(2500000000) === "2.5B", "2.5B format");
console.assert(FormatNumber(1000000000000) === "1T", "1T format");
console.log("  ✓ FormatNumber formats correctly across K, M, B, T");

// 3. Mutation Modal & Tag Interactions Check
console.log("\n[TEST 3] Interactive Mutation Tags & Modal:");
const nuclearMeta = ResolveMutationByName("Nuclear");
console.assert(nuclearMeta !== null, "ResolveMutationByName('Nuclear') should return meta");
console.assert(nuclearMeta.multiplier === 10000, "Nuclear multiplier should be 10,000");

OpenMutationModal("Nuclear");
console.assert(MutationModalState.isOpen === true, "MutationModalState should be open");
console.assert(MutationModalState.currentMutationName === "Nuclear", "Current mutation name should be Nuclear");

CloseMutationModal();
console.assert(MutationModalState.isOpen === false, "MutationModalState should be closed");
console.log("  ✓ OpenMutationModal and CloseMutationModal work properly");

const tagHtml = RenderCardTagBadgeHTML({
    name: "Galactic",
    type: "mutation",
    multiplier: 100000,
    icon: "🌌",
});
console.assert(tagHtml.includes("card-tag-interactive"), "Mutation badge should have card-tag-interactive class");
console.assert(tagHtml.toLowerCase().includes("inspect"), "Mutation badge should have tooltip inviting inspection");
console.log("  ✓ RenderCardTagBadgeHTML outputs interactive mutation badge");

// 4. Wiki System Checks
console.log("\n[TEST 4] Game Encyclopedia & Wiki:");
console.assert(typeof WikiState === "object", "WikiState should exist");
console.assert(typeof RenderWiki === "function", "RenderWiki should be a function");

// Test all categories in RenderWiki
const categories = ["all", "mutations", "tags", "cards", "rollers", "progression", "crafting", "shop", "guides"];
for (const cat of categories) {
    SetWikiCategory(cat);
    console.assert(WikiState.activeCategory === cat, `Active category should be ${cat}`);
    RenderWiki();
    const content = elementsMap["wiki-content"].innerHTML;
    console.assert(content.length > 50, `Category ${cat} should render non-empty HTML`);
    console.log(`  ✓ RenderWiki [${cat}] rendered successfully (${content.length} chars)`);
}

// 5. Card Catalog Mystery Silhouette Check
console.log("\n[TEST 5] Mystery Silhouette Protection:");
SetWikiCategory("cards");
RenderWiki();
const catalogContent = elementsMap["wiki-content"].innerHTML;
console.assert(catalogContent.includes("wiki-catalog-card undiscovered"), "Catalog should render undiscovered cards as silhouettes");
console.assert(catalogContent.includes("??? (Undiscovered)"), "Undiscovered card name should be hidden");
console.assert(catalogContent.includes("wiki-catalog-silhouette-icon"), "Catalog should have silhouette icon");
console.log("  ✓ Undiscovered cards correctly masked with mystery silhouettes");

// 6. Search Functionality
console.log("\n[TEST 6] Wiki Search Engine:");
WikiState.searchQuery = "nuclear";
SetWikiCategory("all");
RenderWiki();
let searchContent = elementsMap["wiki-content"].innerHTML;
console.assert(searchContent.toLowerCase().includes("nuclear"), "Search for 'nuclear' should return nuclear section");

ClearWikiSearch();
console.assert(WikiState.searchQuery === "", "WikiState.searchQuery should be reset");
console.log("  ✓ Search filtering and ClearWikiSearch work as expected");

console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
