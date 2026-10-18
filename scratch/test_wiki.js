// scratch/test_wiki.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Mock browser globals
global.window = global;
global.document = {
    getElementById: (id) => ({
        id,
        value: "",
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        addEventListener: () => {},
        setAttribute: () => {},
        innerHTML: "",
        textContent: "",
    }),
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {}, remove: () => {} } }),
    addEventListener: () => {},
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

// Load Data.js into global context
const dataCode = fs.readFileSync(path.join(__dirname, "../Data.js"), "utf8");
vm.runInThisContext(dataCode);

// Helpers
global.FormatNumber = (num) => {
    let n = Number(num);
    if (isNaN(n)) return String(num);
    if (n >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(Math.floor(n));
};
global.FormatRarityText = (num) => "1 in " + global.FormatNumber(num);
global.FormatImagePath = (img) => img;
global.RenderCardTagBadgeHTML = (tag) => `<span class="card-tag-pill">${tag.name}</span>`;
global.RenderCardTagsHTML = (card, face) => `<span class="card-tag-pill">tag</span>`;
global.GetCardMutation = (card) => ({ name: "None" });
global.GetCardTags = (card, filter) => [];
global.CardHasTag = (card, tagId) => false;
global.GetCardRarityTier = (rarity) => {
    for (let i = RarityTiersList.length - 1; i >= 0; i--) {
        if (rarity >= RarityTiersList[i].minRarity) return RarityTiersList[i];
    }
    return RarityTiersList[0];
};
global.GetOwnedCardsByMutation = (name) => ({ uniqueCount: 2, totalCopies: 5, cards: [], rarestCard: null });
global.GetMutationStepInfo = (idx) => ({ compressCost: 3, decompressYield: 2 });
global.ResolveMutationByName = (name) => {
    for (let i = 0; i < MutationsList.length; i++) {
        let m = MutationsList[i];
        if (m.name.toLowerCase() === String(name).toLowerCase()) {
            return {
                name: m.name,
                multiplier: m.multiplier,
                icon: m.icon,
                prevTierName: i === 0 ? "Normal" : MutationsList[i - 1].name,
                compressCost: 3,
                decompressYield: 2,
                tierIndex: i + 1,
                totalTiers: MutationsList.length,
            };
        }
    }
    return null;
};
global.GetEffectiveLuck = () => 1;
global.GetEffectiveRollerDuration = (r) => 2;
global.GetBoosterBonusCards = (b) => Math.floor(Math.log2((b || 0) + 1));
global.GetBoosterPrice = () => 1;
global.GetAutorollerPrice = () => 1;
global.GetRollerDefinition = (id) => RollersList[0];
global.PlayerData = {
    level: 5,
    xp: 45,
    diamonds: 1200,
    barks: 3,
    resigns: 1,
    tokens: 15,
    inventory: {
        "Grass": { count: 10, cardData: CardsList[0] },
    },
    upgrades: {
        luck: 1,
        tokenRate: 2,
        tokenCapacity: 1,
        xpMultiplier: 0,
        rollSpeed: 0,
        pressRevenue: 1,
    },
    equippedRollers: [],
    maxRollerSlots: 4,
};

let WikiState = {
    activeCategory: "all",
    searchQuery: "",
    catalogTierFilter: "all",
    catalogDiscoveredOnly: false,
};

function MatchWikiSearch(query, ...fields) {
    if (!query) return true;
    let q = query.toLowerCase().trim();
    if (!q) return true;
    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if (f !== undefined && f !== null && String(f).toLowerCase().includes(q)) {
            return true;
        }
    }
    return false;
}

function GetBaseCardsList() {
    let base = [];
    let seen = {};
    for (let i = 0; i < CardsList.length; i++) {
        let c = CardsList[i];
        if (!c || c.name === "Void") continue;
        if (c.mutationIndex && c.mutationIndex > 0) continue;
        if (!seen[c.name]) {
            seen[c.name] = true;
            base.push(c);
        }
    }
    return base;
}

function GetAllWikiTags() {
    let tagsMap = {};

    if (typeof CardTagConfig !== "undefined" && CardTagConfig.presets) {
        for (let key in CardTagConfig.presets) {
            let p = CardTagConfig.presets[key];
            let id = p.id || ("tag-" + key.toLowerCase());
            tagsMap[id] = {
                id: id,
                name: p.name || key,
                type: p.type || "custom",
                description: p.description || "Thematic card attribute.",
                icon: p.icon || "🏷️",
                background: p.background,
                textColor: p.textColor,
                borderColor: p.borderColor,
                glowColor: p.glowColor,
                animated: p.animated,
                cssClass: p.cssClass,
            };
        }
    }

    if (typeof RarityTiersList !== "undefined" && Array.isArray(RarityTiersList)) {
        for (let i = 0; i < RarityTiersList.length; i++) {
            let t = RarityTiersList[i];
            let id = "tier-" + t.id;
            tagsMap[id] = {
                id: id,
                name: t.name,
                type: "rarityTier",
                description: `Cards falling in the ${t.name} rarity tier (${t.rangeLabel || ""}).`,
                icon: t.icon || "⭐",
                background: t.background,
                textColor: t.textColor,
                borderColor: t.borderColor,
                glowColor: t.glowColor,
                animated: t.animated,
                cssClass: "tag-tier-" + t.id,
            };
        }
    }

    let baseCards = GetBaseCardsList();
    for (let i = 0; i < baseCards.length; i++) {
        let cardTags = GetCardTags(baseCards[i], "all");
        for (let j = 0; j < cardTags.length; j++) {
            let ct = cardTags[j];
            if (ct && ct.type !== "mutation" && !tagsMap[ct.id]) {
                tagsMap[ct.id] = {
                    id: ct.id,
                    name: ct.name,
                    type: ct.type || "custom",
                    description: ct.description || `Special ${ct.name} card tag.`,
                    icon: ct.icon || "🏷️",
                    background: ct.background,
                    textColor: ct.textColor,
                    borderColor: ct.borderColor,
                    glowColor: ct.glowColor,
                    animated: ct.animated,
                    cssClass: ct.cssClass,
                };
            }
        }
    }

    let result = [];
    for (let id in tagsMap) {
        let tag = tagsMap[id];
        let totalCount = 0;
        let discoveredCount = 0;
        for (let i = 0; i < baseCards.length; i++) {
            let c = baseCards[i];
            if (CardHasTag(c, tag.id)) {
                totalCount++;
                if (PlayerData.inventory[c.name] && PlayerData.inventory[c.name].count > 0) {
                    discoveredCount++;
                }
            }
        }
        tag.totalCards = totalCount;
        tag.discoveredCards = discoveredCount;
        result.push(tag);
    }

    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
}

// 1. Mutations HTML
function GenerateWikiMutationsHTML(searchQuery) {
    let mutations = MutationsList || [];
    let cardsHtml = "";
    let matchCount = 0;

    for (let i = 0; i < mutations.length; i++) {
        let m = mutations[i];
        let meta = ResolveMutationByName(m.name);
        if (!meta) continue;

        let searchPass = MatchWikiSearch(searchQuery, m.name, meta.prevTierName, `${m.multiplier}x`, `Tier ${meta.tierIndex}`);
        if (!searchPass) continue;
        matchCount++;

        let owned = GetOwnedCardsByMutation(m.name);
        let tagObj = {
            name: m.name,
            type: "mutation",
            icon: m.icon || "✨",
            suffix: FormatNumber(m.multiplier) + "×",
            background: m.background,
            textColor: m.textColor,
            borderColor: m.borderColor,
            glowColor: m.glowColor,
            animated: m.animated,
            cssClass: "tag-mutation-" + m.name.toLowerCase(),
        };

        cardsHtml += `
            <div class="wiki-card">
                <div class="wiki-card-header">
                    <div>
                        <div style="margin-bottom: 6px;">${RenderCardTagBadgeHTML(tagObj)}</div>
                        <h4 class="wiki-card-title">${m.icon || "✨"} ${m.name}</h4>
                    </div>
                    <span class="wiki-section-badge">Tier ${meta.tierIndex}/${meta.totalTiers}</span>
                </div>
                <div class="wiki-card-sub" style="margin-top: 4px; color: ${m.borderColor || 'var(--text-soft)'};">
                    Multiplier: ×${FormatNumber(m.multiplier)} Base Rarity
                </div>
                <div class="wiki-card-stats" style="margin: 10px 0;">
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Compress Recipe:</span>
                        <span class="wiki-stat-val">${meta.compressCost}× ${meta.prevTierName} ➔ 1× ${m.name}</span>
                    </div>
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Decompress Yield:</span>
                        <span class="wiki-stat-val">1× ${m.name} ➔ ${meta.decompressYield}× ${meta.prevTierName}</span>
                    </div>
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Discovered Cards:</span>
                        <span class="wiki-stat-val">${FormatNumber(owned.uniqueCount)} (${FormatNumber(owned.totalCopies)} copies)</span>
                    </div>
                </div>
                <button type="button" class="wiki-card-btn" onclick="OpenMutationModal('${m.name}')">
                    🔍 Inspect ${m.name} Details
                </button>
            </div>
        `;
    }

    if (matchCount === 0) return "";

    return `
        <div class="wiki-section" data-wiki-section="mutations">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">✨</span>
                    <div>
                        <h3>Mutations &amp; Multipliers</h3>
                        <p class="wiki-section-desc">Mutations drastically scale card rarity, appearance, and value. Roll them naturally or synthesize them in the Compressor.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">${mutations.length} Mutation Tiers</span>
            </div>

            <div class="wiki-formula-box">
                <span class="wiki-formula-icon">🎲</span>
                <div>
                    <div><strong>Roll Drop Probability:</strong> <span class="wiki-formula-code">1 / (Base Rarity × Multiplier / Effective Luck)</span></div>
                    <div style="font-size: 0.8rem; opacity: 0.85; margin-top: 2px;">
                        Mutations multiply the card's effective rarity in the roll pool. High roller luck and boosters help you pull ultra-rare mutations like Nuclear (×10K), Galactic (×100K), and Robotic (×1M)!
                    </div>
                </div>
            </div>

            <div class="wiki-grid wiki-grid-3">
                ${cardsHtml}
            </div>

            <div class="wiki-tip-card" style="margin-top: 14px;">
                <span class="tip-icon">📦</span>
                <div>
                    <h4>Compressor &amp; Decompressor Mechanics</h4>
                    <p>Unlocked at Level 3 in the Presses tab! Compress combines duplicate lower-tier cards into guaranteed next-tier mutated versions. Decompress splits a higher-tier card back into lower-tier cards. Use the "Keep 1 Copy" toggle to protect your collection.</p>
                </div>
            </div>
        </div>
    `;
}

// 2. Tags HTML
function GenerateWikiTagsHTML(searchQuery) {
    let allTags = GetAllWikiTags();
    let cardsHtml = "";
    let matchCount = 0;

    for (let i = 0; i < allTags.length; i++) {
        let t = allTags[i];
        if (!MatchWikiSearch(searchQuery, t.name, t.type, t.description)) continue;
        matchCount++;

        let badgeHtml = RenderCardTagBadgeHTML({
            name: t.name,
            type: t.type,
            icon: t.icon,
            background: t.background,
            textColor: t.textColor,
            borderColor: t.borderColor,
            glowColor: t.glowColor,
            animated: t.animated,
            cssClass: t.cssClass,
        });

        cardsHtml += `
            <div class="wiki-card">
                <div class="wiki-card-header">
                    <div>
                        <div style="margin-bottom: 6px;">${badgeHtml}</div>
                        <h4 class="wiki-card-title">${t.icon || "🏷️"} ${t.name}</h4>
                    </div>
                    <span class="wiki-section-badge">${t.type}</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-soft); margin: 6px 0 10px 0; min-height: 2.4em;">
                    ${t.description}
                </p>
                <div class="wiki-card-stats" style="margin-bottom: 10px;">
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Matching Base Cards:</span>
                        <span class="wiki-stat-val">${t.totalCards} cards</span>
                    </div>
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Discovered by You:</span>
                        <span class="wiki-stat-val">${t.discoveredCards} / ${t.totalCards}</span>
                    </div>
                </div>
                <button type="button" class="wiki-card-btn" onclick="OpenTagModal('${t.id}', '${t.name}', '${t.type}')">
                    🔍 View Matching Cards
                </button>
            </div>
        `;
    }

    if (matchCount === 0) return "";

    return `
        <div class="wiki-section" data-wiki-section="tags">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">🏷️</span>
                    <div>
                        <h3>Card Tags &amp; Classifications</h3>
                        <p class="wiki-section-desc">Tags identify themes, generation styles, artists, and rarity tiers. Click any tag on cards across the game to view matching owned cards.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">${allTags.length} Total Tags</span>
            </div>

            <div class="wiki-grid wiki-grid-3">
                ${cardsHtml}
            </div>
        </div>
    `;
}

// 3. Cards Catalog HTML
function GenerateWikiCardsCatalogHTML(searchQuery) {
    let baseCards = GetBaseCardsList();
    let totalBase = baseCards.length;
    let discoveredCount = 0;
    for (let i = 0; i < baseCards.length; i++) {
        let c = baseCards[i];
        if (PlayerData.inventory[c.name] && PlayerData.inventory[c.name].count > 0) {
            discoveredCount++;
        }
    }

    let cardsHtml = "";
    let matchCount = 0;

    for (let i = 0; i < baseCards.length; i++) {
        let card = baseCards[i];
        let isDiscovered = Boolean(PlayerData.inventory[card.name] && PlayerData.inventory[card.name].count > 0);
        let tier = GetCardRarityTier(card.rarity) || { name: "Common", id: "common", borderColor: "#94a3b8" };

        if (WikiState.catalogTierFilter !== "all" && tier.id !== WikiState.catalogTierFilter) {
            continue;
        }
        if (WikiState.catalogDiscoveredOnly && !isDiscovered) {
            continue;
        }

        let searchTarget = isDiscovered
            ? [card.name, tier.name, FormatRarityText(card.rarity), card.artist, card.description]
            : [tier.name, "undiscovered", "hidden", "mystery"];

        if (!MatchWikiSearch(searchQuery, ...searchTarget)) {
            continue;
        }
        matchCount++;

        if (isDiscovered) {
            let frontTagsHtml = RenderCardTagsHTML(card, "front");
            let safeName = card.name.replace(/'/g, "\\'");
            cardsHtml += `
                <div class="wiki-catalog-card discovered" onclick="OpenCardModalByName('${safeName}')" style="cursor: pointer;">
                    <div class="wiki-catalog-thumb-wrap">
                        <img src="${FormatImagePath(card.image)}" alt="${card.name}" class="wiki-catalog-thumb" draggable="false">
                        <div class="card-holo-glare"></div>
                        ${frontTagsHtml ? `<div class="card-front-tags-overlay wiki-catalog-thumb-tags">${frontTagsHtml}</div>` : ""}
                    </div>
                    <div class="wiki-catalog-card-info">
                        <h4 class="wiki-catalog-card-name" title="${card.name}">${card.name}</h4>
                        <div class="wiki-catalog-card-rarity">${FormatRarityText(card.rarity)}</div>
                        <div style="font-size: 0.72rem; color: var(--text-soft); margin-top: 4px;">Tier: ${tier.name}</div>
                    </div>
                </div>
            `;
        } else {
            cardsHtml += `
                <div class="wiki-catalog-card undiscovered" title="Undiscovered Card (${tier.name}) - Roll cards to discover!">
                    <div class="wiki-catalog-thumb-wrap">
                        <div class="wiki-catalog-silhouette-icon">❓</div>
                    </div>
                    <div class="wiki-catalog-card-info">
                        <h4 class="wiki-catalog-card-name">??? (Undiscovered)</h4>
                        <div class="wiki-catalog-card-rarity" style="color: ${tier.borderColor || '#94a3b8'};">⭐ Tier: ${tier.name}</div>
                        <div style="font-size: 0.72rem; color: var(--text-soft); margin-top: 4px;">🔍 Roll with rollers to unlock!</div>
                    </div>
                </div>
            `;
        }
    }

    let tierFiltersHtml = `
        <button type="button" class="catalog-filter-btn ${WikiState.catalogTierFilter === 'all' ? 'active' : ''}" onclick="SetWikiCatalogTier('all')">
            All Tiers
        </button>
    `;
    for (let i = 0; i < RarityTiersList.length; i++) {
        let t = RarityTiersList[i];
        let isActive = WikiState.catalogTierFilter === t.id;
        tierFiltersHtml += `
            <button type="button" class="catalog-filter-btn ${isActive ? 'active' : ''}" onclick="SetWikiCatalogTier('${t.id}')">
                ${t.icon || '⭐'} ${t.name}
            </button>
        `;
    }

    let tiersTableRows = "";
    for (let i = 0; i < RarityTiersList.length; i++) {
        let t = RarityTiersList[i];
        let tierCards = baseCards.filter(c => GetCardRarityTier(c.rarity).id === t.id);
        let tierDiscovered = tierCards.filter(c => PlayerData.inventory[c.name] && PlayerData.inventory[c.name].count > 0).length;
        tiersTableRows += `
            <tr>
                <td><strong>${t.icon || '⭐'} ${t.name}</strong></td>
                <td>${t.rangeLabel || '—'}</td>
                <td><span class="wiki-formula-code">1 / (Rarity ÷ Luck)</span></td>
                <td>${tierDiscovered} / ${tierCards.length} Cards</td>
            </tr>
        `;
    }

    return `
        <div class="wiki-section" data-wiki-section="cards">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">🃏</span>
                    <div>
                        <h3>Card Catalog &amp; Rarities</h3>
                        <p class="wiki-section-desc">Browse all base cards in the universe. Undiscovered cards remain mysterious silhouettes until you find them.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">Discovered: ${discoveredCount} / ${totalBase} (${((discoveredCount / totalBase) * 100).toFixed(0)}%)</span>
            </div>

            <div class="wiki-table-wrap" style="margin-bottom: 16px;">
                <table class="wiki-table">
                    <thead>
                        <tr>
                            <th>Rarity Tier</th>
                            <th>Rarity Range</th>
                            <th>Drop Formula</th>
                            <th>Your Collection</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tiersTableRows}
                    </tbody>
                </table>
            </div>

            <div class="wiki-catalog-controls">
                <div class="wiki-catalog-filters">
                    ${tierFiltersHtml}
                </div>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                    <input type="checkbox" ${WikiState.catalogDiscoveredOnly ? "checked" : ""} onchange="ToggleWikiDiscoveredOnly()">
                    <span>Show Discovered Only</span>
                </label>
            </div>

            <div class="wiki-catalog-grid">
                ${cardsHtml || `<div class="tag-modal-empty" style="grid-column: 1 / -1;">No cards found matching your current filter.</div>`}
            </div>
        </div>
    `;
}

// 4. Rollers HTML
function GenerateWikiRollersHTML(searchQuery) {
    let items = ItemsList || [];
    let rollers = items.filter(i => i.type === "roller");
    let cardsHtml = "";
    let matchCount = 0;

    for (let i = 0; i < rollers.length; i++) {
        let r = rollers[i];
        if (!MatchWikiSearch(searchQuery, r.name, r.description, `${r.luckMultiplier}x luck`, `${r.rollTime}s`)) continue;
        matchCount++;

        let recipe = (CraftingRecipes || []).find(rec => rec.resultItemId === r.id);
        let acquisition = recipe ? `Craft at Workbench (${recipe.craftTime}s)` : `Default starter equipment`;

        cardsHtml += `
            <div class="wiki-card">
                <div class="wiki-card-header">
                    <div>
                        <h4 class="wiki-card-title">${r.icon || "🎲"} ${r.name}</h4>
                        <div class="wiki-card-sub">${acquisition}</div>
                    </div>
                    <span class="wiki-section-badge">×${r.luckMultiplier || 1} Luck</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-soft); margin: 6px 0 10px 0;">
                    ${r.description || ""}
                </p>
                <div class="wiki-card-stats">
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Roll Cooldown:</span>
                        <span class="wiki-stat-val">${r.rollTime || 2}s</span>
                    </div>
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Max Cards / Roll:</span>
                        <span class="wiki-stat-val">${r.maxCardsPerRoll || 1} Cards</span>
                    </div>
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Cost per Roll:</span>
                        <span class="wiki-stat-val">${r.rollCost || 1} Token${(r.rollCost || 1) > 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="wiki-section" data-wiki-section="rollers">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">🎲</span>
                    <div>
                        <h3>Rollers, Boosters &amp; Automation</h3>
                        <p class="wiki-section-desc">Rollers are your primary tool for expanding your collection. Equip multiple rollers, attach autorollers, and socket boosters.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">Equipped Slots: ${PlayerData.maxRollerSlots || 1}</span>
            </div>

            <div class="wiki-grid wiki-grid-2">
                ${cardsHtml}
            </div>

            <div class="wiki-formula-box" style="margin-top: 14px;">
                <span class="wiki-formula-icon">🚀</span>
                <div>
                    <div><strong>Roll Booster Scaling:</strong> <span class="wiki-formula-code">Bonus Cards = floor(log2(Boosters + 1))</span></div>
                    <div style="font-size: 0.8rem; opacity: 0.85; margin-top: 2px;">
                        Each bonus card drawn in a single roll requires doubling your booster investment. Drag Roll Boosters onto equipped rollers to increase their capacity!
                    </div>
                </div>
            </div>

            <div class="wiki-table-wrap" style="margin-top: 10px;">
                <table class="wiki-table">
                    <thead>
                        <tr>
                            <th>Boosters Attached</th>
                            <th>Bonus Cards Drawn</th>
                            <th>Total Cards Per Roll (Basic Roller)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>0 Boosters</td><td>+0 Cards</td><td>3 Cards</td></tr>
                        <tr><td>1 Booster</td><td>+1 Card</td><td>4 Cards</td></tr>
                        <tr><td>3 Boosters</td><td>+2 Cards</td><td>5 Cards</td></tr>
                        <tr><td>7 Boosters</td><td>+3 Cards</td><td>6 Cards</td></tr>
                        <tr><td>15 Boosters</td><td>+4 Cards</td><td>7 Cards</td></tr>
                        <tr><td>31 Boosters</td><td>+5 Cards</td><td>8 Cards</td></tr>
                        <tr><td>63 Boosters</td><td>+6 Cards</td><td>9 Cards</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="wiki-tip-card" style="margin-top: 14px;">
                <span class="tip-icon">🤖</span>
                <div>
                    <h4>Autoroller Operation</h4>
                    <p>Purchase an Autoroller with Barks in the Shop or Items tab and drag it onto an equipped roller. The roller will automatically execute rolls every time its cooldown expires as long as you have enough tokens. You can pause or resume automation per roller anytime with the ⚡ toggle.</p>
                </div>
            </div>
        </div>
    `;
}

// 5. Progression HTML
function GenerateWikiProgressionHTML(searchQuery) {
    let baseXp = (coreValues.level && coreValues.level.baseXp) || 10;
    let xpMult = (coreValues.level && coreValues.level.xpMultiplier) || 1.5;

    return `
        <div class="wiki-section" data-wiki-section="progression">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">⭐</span>
                    <div>
                        <h3>Progression, Levels &amp; Resigns</h3>
                        <p class="wiki-section-desc">Gain XP by discovering cards, level up to unlock new machines, and Resign for prestigious Barks.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">Current Level ${PlayerData.level || 1}</span>
            </div>

            <div class="wiki-grid wiki-grid-2">
                <div class="wiki-card">
                    <div class="wiki-card-header">
                        <h4 class="wiki-card-title">📈 Leveling Mechanics</h4>
                        <span class="wiki-section-badge">XP Formula</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-soft); margin: 6px 0;">
                        Every card rolled yields XP proportional to its rarity: <span class="wiki-formula-code">XP = floor(Rarity ^ 0.5)</span>. Mutated cards give immense XP bursts!
                    </p>
                    <div class="wiki-card-stats">
                        <div class="wiki-stat-row">
                            <span class="wiki-stat-label">Level Threshold Formula:</span>
                            <span class="wiki-stat-val">floor(${baseXp} × (Level ^ ${xpMult}))</span>
                        </div>
                        <div class="wiki-stat-row">
                            <span class="wiki-stat-label">Level 3 Unlock:</span>
                            <span class="wiki-stat-val">Compressor &amp; Decompressor</span>
                        </div>
                        <div class="wiki-stat-row">
                            <span class="wiki-stat-label">Level 5 Unlock:</span>
                            <span class="wiki-stat-val">Resign Press &amp; Barks Conversion</span>
                        </div>
                    </div>
                </div>

                <div class="wiki-card">
                    <div class="wiki-card-header">
                        <h4 class="wiki-card-title">👑 Resigns &amp; Barks (Prestige)</h4>
                        <span class="wiki-section-badge">Prestige Power</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-soft); margin: 6px 0;">
                        Resigning resets your current level and card collection back to fresh start in exchange for Barks and permanent buffs.
                    </p>
                    <div class="wiki-card-stats">
                        <div class="wiki-stat-row">
                            <span class="wiki-stat-label">Resign Frequency:</span>
                            <span class="wiki-stat-val">Available Every 5 Levels</span>
                        </div>
                        <div class="wiki-stat-row">
                            <span class="wiki-stat-label">Bark Conversion Rate:</span>
                            <span class="wiki-stat-val">1,000 Diamonds = 1 Bark</span>
                        </div>
                        <div class="wiki-stat-row">
                            <span class="wiki-stat-label">Bark Currency Uses:</span>
                            <span class="wiki-stat-val">Autorollers, Roll Boosters, Rare Upgrades</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 6. Crafting HTML
function GenerateWikiCraftingHTML(searchQuery) {
    let recipes = CraftingRecipes || [];
    let rowsHtml = "";

    for (let i = 0; i < recipes.length; i++) {
        let r = recipes[i];
        let matList = (r.materials || []).map(m => `${m.amount}× ${m.cardName || m.name}`).join(", ");
        if (!MatchWikiSearch(searchQuery, r.name, r.description, matList)) continue;

        rowsHtml += `
            <tr>
                <td><strong>${r.icon || '🔨'} ${r.name}</strong></td>
                <td><span style="font-size: 0.8rem; color: var(--text-soft);">${matList}</span></td>
                <td>${r.craftTime}s</td>
                <td><span class="wiki-section-badge">${r.resultType || 'item'}</span></td>
            </tr>
        `;
    }

    return `
        <div class="wiki-section" data-wiki-section="crafting">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">🔨</span>
                    <div>
                        <h3>Crafting Bench &amp; Presses</h3>
                        <p class="wiki-section-desc">Combine duplicate cards to create new cards, advanced rollers, and items. 100% risk-free refunds!</p>
                    </div>
                </div>
                <span class="wiki-section-badge">${recipes.length} Blueprints</span>
            </div>

            <div class="wiki-tip-card" style="margin-bottom: 14px;">
                <span class="tip-icon">🛡️</span>
                <div>
                    <h4>100% Risk-Free Crafting Refund Guarantee</h4>
                    <p>You can cancel an active crafting project at any time with zero penalty. All contributed ingredient cards are immediately refunded directly into your inventory. You will never lose materials by changing your mind!</p>
                </div>
            </div>

            <div class="wiki-table-wrap">
                <table class="wiki-table">
                    <thead>
                        <tr>
                            <th>Blueprint</th>
                            <th>Required Materials</th>
                            <th>Craft Time</th>
                            <th>Result Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 7. Shop HTML
function GenerateWikiShopHTML(searchQuery) {
    let upgrades = ShopUpgradesList || [];
    let cardsHtml = "";

    for (let i = 0; i < upgrades.length; i++) {
        let u = upgrades[i];
        if (!MatchWikiSearch(searchQuery, u.name, u.description, u.category)) continue;

        let curLvl = (PlayerData.upgrades && PlayerData.upgrades[u.id]) || 0;

        cardsHtml += `
            <div class="wiki-card">
                <div class="wiki-card-header">
                    <div>
                        <h4 class="wiki-card-title">${u.icon || '🛒'} ${u.name}</h4>
                        <div class="wiki-card-sub">Category: ${u.category || 'upgrades'}</div>
                    </div>
                    <span class="wiki-section-badge">Level ${curLvl}/${u.maxLevel || '∞'}</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-soft); margin: 6px 0 10px 0;">
                    ${u.description || ""}
                </p>
                <div class="wiki-card-stats">
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Base Cost:</span>
                        <span class="wiki-stat-val">${u.basePrice || 50} 💎</span>
                    </div>
                    <div class="wiki-stat-row">
                        <span class="wiki-stat-label">Cost Scaling:</span>
                        <span class="wiki-stat-val">+${((u.compoundRate || 0.2) * 100).toFixed(0)}% per level</span>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="wiki-section" data-wiki-section="shop">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">🛒</span>
                    <div>
                        <h3>Upgrade Shop</h3>
                        <p class="wiki-section-desc">Spend Diamonds and Barks on permanent upgrades to accelerate your token generation, luck, and card revenue.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">${upgrades.length} Permanent Upgrades</span>
            </div>

            <div class="wiki-grid wiki-grid-3">
                ${cardsHtml}
            </div>
        </div>
    `;
}

// 8. Guides HTML
function GenerateWikiGuidesHTML(searchQuery) {
    return `
        <div class="wiki-section" data-wiki-section="guides">
            <div class="wiki-section-header">
                <div class="wiki-section-title-wrap">
                    <span class="wiki-section-icon">💡</span>
                    <div>
                        <h3>Tutorials &amp; Strategy Guides</h3>
                        <p class="wiki-section-desc">Step-by-step master walkthroughs and pro tips to optimize your journey from beginner to card tycoon.</p>
                    </div>
                </div>
                <span class="wiki-section-badge">Master Guides</span>
            </div>

            <div class="wiki-grid wiki-grid-3">
                <div class="wiki-card">
                    <h4 class="wiki-card-title">🌱 Phase 1: Beginner Walkthrough</h4>
                    <p style="font-size: 0.84rem; color: var(--text-soft); line-height: 1.5; margin: 8px 0;">
                        1. Equip your Basic Roller from the Items tab into Slot 1.<br>
                        2. Roll cards to earn XP and level up.<br>
                        3. Use the Diamond Press on duplicate cards to earn Diamonds.<br>
                        4. Invest initial Diamonds into Token Capacity &amp; Drop Rate in the Shop.
                    </p>
                </div>

                <div class="wiki-card">
                    <h4 class="wiki-card-title">⚙️ Phase 2: Mid-Game Automation</h4>
                    <p style="font-size: 0.84rem; color: var(--text-soft); line-height: 1.5; margin: 8px 0;">
                        1. Craft duplicate cards into higher-rarity cards or new Rollers at the Crafting Bench.<br>
                        2. Buy an Autoroller (1 Bark) and attach it to your primary roller.<br>
                        3. Unlock additional roller slots to roll multiple rollers simultaneously.<br>
                        4. Keep 1 Copy protected in Presses so you never squish unique discoveries.
                    </p>
                </div>

                <div class="wiki-card">
                    <h4 class="wiki-card-title">👑 Phase 3: End-Game Domination</h4>
                    <p style="font-size: 0.84rem; color: var(--text-soft); line-height: 1.5; margin: 8px 0;">
                        1. Stack Roll Boosters onto your best rollers for multi-card pulls.<br>
                        2. Resign every 5 levels to build a vast treasury of Barks.<br>
                        3. Synthesize your duplicate mutated cards in the Compressor towards Galactic (×100K) and Robotic (×1M)!
                    </p>
                </div>
            </div>

            <div class="wiki-tip-card" style="margin-top: 14px;">
                <span class="tip-icon">💡</span>
                <div>
                    <h4>Interactive Card &amp; Tag Popups</h4>
                    <p>You can click or long-press any Mutation pill or Tag badge anywhere in the game (on cards, inside modals, in the roll showcase, or in sidebar legends) to open an instant breakdown of that attribute, its multipliers, and all owned matching cards in your collection!</p>
                </div>
            </div>
        </div>
    `;
}

// Test generation of all sections
console.log("Mutations HTML length:", GenerateWikiMutationsHTML("").length);
console.log("Tags HTML length:", GenerateWikiTagsHTML("").length);
console.log("Cards Catalog HTML length:", GenerateWikiCardsCatalogHTML("").length);
console.log("Rollers HTML length:", GenerateWikiRollersHTML("").length);
console.log("Progression HTML length:", GenerateWikiProgressionHTML("").length);
console.log("Crafting HTML length:", GenerateWikiCraftingHTML("").length);
console.log("Shop HTML length:", GenerateWikiShopHTML("").length);
console.log("Guides HTML length:", GenerateWikiGuidesHTML("").length);

console.log("ALL WIKI GENERATORS RAN WITH ZERO ERRORS!");
