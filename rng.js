const items = [
    { name: "Grass", chance: 2 },
    { name: "Bush", chance: 3 },
    { name: "Tree", chance: 5 },
    { name: "Bones", chance: 7 },
    { name: "Beach", chance: 10 },
    { name: "Snow Mountains", chance: 15 },
    { name: "Sugar", chance: 20 },
    { name: "Sword", chance: 25 },
    { name: "Mars", chance: 50 }
];

let collection = {};
let rolls = 0;

function getRarityTag(chance) {
    if (chance < 10) return '<span class="rarity-tag rarity-common">Common</span>';
    if (chance < 100) return '<span class="rarity-tag rarity-rare">Rare</span>';
    if (chance < 1000) return '<span class="rarity-tag rarity-epic">Epic</span>';
    return '<span class="rarity-tag rarity-legendary">Legendary</span>';
}
function getGoldTag(type) {
    if (type === 'Rainbow') return '<span class="rarity-tag rarity-rainbow">Rainbow</span>';
    if (type === 'Gold') return '<span class="rarity-tag rarity-gold">Gold</span>';
    return '';
}

function rollItem() {
    rolls++;
    document.getElementById('rolls-count').innerText = rolls;

    let winners = [];
    for (let item of items) {
        let roll = Math.floor(Math.random() * item.chance) + 1;
        if (roll === 1) {
            winners.push(item);
        }
    }

    let selected;
    if (winners.length === 0) {
        selected = items.reduce((a, b) => (a.chance < b.chance ? a : b));
    } else {
        selected = winners.reduce((a, b) => (a.chance > b.chance ? a : b));
    }

    // Gold ou Rainbow
    let type = '';
    let isGold = Math.floor(Math.random() * 10) === 0;
    if (isGold) {
        type = (Math.floor(Math.random() * 10) === 0) ? 'Rainbow' : 'Gold';
    }
    let displayName = selected.name + (type ? ` (${type})` : '');
    let chanceDisplay = type === 'Rainbow' ? selected.chance * 100 : type === 'Gold' ? selected.chance * 10 : selected.chance;

    // Affichage du dernier roll
    document.getElementById('last-item').innerHTML = `
        <div class="card-roll">
            <span class="rarity-tag-container">
                ${getRarityTag(chanceDisplay)}${getGoldTag(type)}
            </span>
            <img class="card-roll-img" src="Cards-Icons/${selected.name}.png" alt="${selected.name}">
            <span class="card-roll-text">
                ${displayName}<br>[1 in ${chanceDisplay}]
            </span>
        </div>
    `;

    // Comptage
    if (!collection[displayName]) {
        collection[displayName] = 1;
    } else {
        collection[displayName]++;
    }
    saveCollection();
    updateCollection();
}

function updateCollection() {
    const ul = document.getElementById('collection-list');
    ul.innerHTML = '';

    // Trie par rareté/chance affichée, puis nom, puis type (normale/Gold/Rainbow)
    let rarityOrder = chance => (chance < 10 ? 0 : chance < 100 ? 1 : chance < 1000 ? 2 : 3);
    let typeOrder = t => t === 'Rainbow' ? 2 : t === 'Gold' ? 1 : 0;
    let sortedNames = Object.keys(collection).sort((a, b) => {
        let typeA = a.endsWith('(Rainbow)') ? 'Rainbow' : a.endsWith('(Gold)') ? 'Gold' : '';
        let typeB = b.endsWith('(Rainbow)') ? 'Rainbow' : b.endsWith('(Gold)') ? 'Gold' : '';
        let baseA = typeA ? a.replace(` (${typeA})`, '') : a;
        let baseB = typeB ? b.replace(` (${typeB})`, '') : b;
        let itemA = items.find(i => i.name === baseA);
        let itemB = items.find(i => i.name === baseB);
        let chanceA = typeA === 'Rainbow' ? itemA.chance * 100 : typeA === 'Gold' ? itemA.chance * 10 : itemA.chance;
        let chanceB = typeB === 'Rainbow' ? itemB.chance * 100 : typeB === 'Gold' ? itemB.chance * 10 : itemB.chance;
        // Par rareté affichée
        let rarityA = rarityOrder(chanceA);
        let rarityB = rarityOrder(chanceB);
        if (rarityA !== rarityB) return rarityA - rarityB;
        // Par chance affichée croissante
        if (chanceA !== chanceB) return chanceA - chanceB;
        // Par nom
        if (baseA !== baseB) return baseA.localeCompare(baseB);
        // Par type (normale, Gold, Rainbow)
        return typeOrder(typeA) - typeOrder(typeB);
    });

    for (let name of sortedNames) {
        let type = name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
        let baseName = type ? name.replace(` (${type})`, '') : name;
        let item = items.find(i => i.name === baseName);
        let chanceDisplay = type === 'Rainbow' ? item.chance * 100 : type === 'Gold' ? item.chance * 10 : item.chance;
        let displayName = baseName;
        let goldTag = getGoldTag(type);
        let rarityTag = getRarityTag(chanceDisplay);
        let imgSrc = `Cards-Icons/${baseName}.png`;
        let cardText = `<span class=\"name-only\">${displayName}</span>`;
        let cardDetail = `<span class=\"detail\">${displayName}<br>1 in ${chanceDisplay}<br>×${collection[name]}</span>`;
        let li = document.createElement('li');
        li.innerHTML = `
            <div class=\"card-inventory\">
                <span class=\"rarity-tag-container\">${rarityTag}${goldTag}</span>
                <div class=\"card-flip-inner\">
                    <div class=\"card-flip-front\">
                        <img class=\"card-img\" src=\"${imgSrc}\" alt=\"${displayName}\">
                        <span class=\"card-text\">${cardText}</span>
                    </div>
                    <div class=\"card-flip-back\">
                        <span class=\"card-text\">${cardDetail}</span>
                    </div>
                </div>
            </div>
        `;
        ul.appendChild(li);
    }
}

// Sauvegarde l'inventaire dans localStorage
function saveCollection() {
    localStorage.setItem('cards-collection', JSON.stringify(collection));
}

// Charge l'inventaire depuis localStorage
function loadCollection() {
    const data = localStorage.getItem('cards-collection');
    if (data) {
        collection = JSON.parse(data);
    }
}

// Au chargement de la page, on restaure l'inventaire
loadCollection();
updateCollection();
