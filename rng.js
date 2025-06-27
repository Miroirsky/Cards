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
let isRolling = false;
let tokens = 5;
let tokenInterval;
let rollDelay = 5000;

function getRarityTag(chance) {
    if (chance < 10) return '<span class="rarity-tag rarity-common">Common</span>';
    if (chance < 100) return '<span class="rarity-tag rarity-rare">Rare</span>';
    if (chance < 1000) return '<span class="rarity-tag rarity-epic">Epic</span>';
    if (chance <= 10000) return '<span class="rarity-tag rarity-mythic">Mythic</span>';
    return '<span class="rarity-tag rarity-legendary">Legendary</span>';
}

function getGoldTag(type) {
    if (type === 'Shiny') return '<span class="rarity-tag rarity-shiny">Shiny</span>';
    if (type === 'Rainbow') return '<span class="rarity-tag rarity-rainbow">Rainbow</span>';
    if (type === 'Gold') return '<span class="rarity-tag rarity-gold">Gold</span>';
    return '';
}

function updateInventoryStats() {
    const totalCards = Object.values(collection).reduce((sum, count) => sum + count, 0);
    const unlockedCards = Object.keys(collection).length;
    
    document.getElementById('total-cards').innerText = `Total: ${totalCards}`;
    document.getElementById('unlocked-cards').innerText = `Unlocked: ${unlockedCards}`;
}

function updateTokensDisplay() {
    const tokensElement = document.getElementById('tokens-count');
    const indicator = document.getElementById('tokens-indicator');
    
    tokensElement.innerText = tokens;
    
    // Changer la couleur selon l'état des tokens
    if (tokens <= 3) {
        // Rouge pour 3 tokens et moins
        indicator.classList.add('low');
        indicator.classList.remove('medium');
        indicator.classList.remove('high');
        indicator.classList.remove('max');
    } else if (tokens >= 4 && tokens <= 6) {
        // Orange pour 4 à 6 tokens
        indicator.classList.remove('low');
        indicator.classList.add('medium');
        indicator.classList.remove('high');
        indicator.classList.remove('max');
    } else if (tokens >= 7 && tokens <= 9) {
        // Vert pour 7 à 9 tokens
        indicator.classList.remove('low');
        indicator.classList.remove('medium');
        indicator.classList.add('high');
        indicator.classList.remove('max');
    } else if (tokens >= 10) {
        // Bleu pour 10 tokens
        indicator.classList.remove('low');
        indicator.classList.remove('medium');
        indicator.classList.remove('high');
        indicator.classList.add('max');
    }
}

function addToken() {
    if (tokens < 10) { // Limite de 10 tokens
        tokens++;
        updateTokensDisplay();
        saveCollection();
    }
}

function startTokenRecharge() {
    // Ajouter un token toutes les 5 secondes
    tokenInterval = setInterval(() => {
        addToken();
        // Afficher le temps restant dans la console pour le débogage
        console.log(`Token ajouté. Total: ${tokens}/10`);
    }, rollDelay);
}

function stopTokenRecharge() {
    if (tokenInterval) {
        clearInterval(tokenInterval);
    }
}

// Fonction pour obtenir le temps restant avant le prochain token
function getTimeUntilNextToken() {
    // Cette fonction peut être utilisée pour afficher un compte à rebours
    // Pour l'instant, on retourne simplement 5 secondes
    return 5;
}

function showRollAnimation() {
    const animation = document.getElementById('roll-animation');
    animation.classList.remove('hidden');
}

function hideRollAnimation() {
    const animation = document.getElementById('roll-animation');
    animation.classList.add('hidden');
}

function updateCardPreview(cardData) {
    const preview = document.getElementById('card-preview');
    const { selected, type, displayName, chanceDisplay } = cardData;
    
    preview.innerHTML = `
        <div class="preview-card">
            <span class="rarity-tag-container">${getGoldTag(type)}</span>
            <img src="Cards-Icons/${selected.name}.png" alt="${selected.name}">
            <div class="preview-card-text">
                ${displayName}<br>[1 in ${chanceDisplay}]
            </div>
            <span class="rarity-tag-container rarity-hidden">${getRarityTag(chanceDisplay)}</span>
        </div>
    `;
}

function resetCardPreview() {
    const preview = document.getElementById('card-preview');
    preview.innerHTML = `
        <div class="preview-placeholder">
            <span>Click ROLL! to get a card</span>
        </div>
    `;
}

function rollItem() {
    if (isRolling) return; // Empêche les rolls multiples
    if (tokens <= 0) {
        alert('Vous n\'avez plus de tokens ! Attendez qu\'ils se rechargent.');
        return;
    }
    
    // Consommer un token
    tokens--;
    updateTokensDisplay();
    
    isRolling = true;
    const rollButton = document.getElementById('roll-button');
    rollButton.disabled = true;
    
    rolls++;
    document.getElementById('rolls-count').innerText = rolls;
    
    // Sauvegarder immédiatement le compteur
    saveCollection();

    // Afficher l'animation de roll
    showRollAnimation();

    // Simuler le roll après 200ms (plus rapide)
    setTimeout(() => {
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

        // Gold ou Rainbow ou Shiny
        let type = '';
        let isGold = Math.floor(Math.random() * 10) === 0;
        let isRainbow = Math.floor(Math.random() * 10) === 0;
        let isShiny = Math.floor(Math.random() * 10) === 0;
        if (isGold) {
            type = 'Gold';
            if (isRainbow) {
                type = 'Rainbow';
                if (isShiny) {
                    type = 'Shiny';
                }
            }
        }
        let displayName = selected.name + (type ? ` (${type})` : '');
        let chanceDisplay = type === 'Shiny' ? selected.chance * 100 : type === 'Rainbow' ? selected.chance * 100 : type === 'Gold' ? selected.chance * 10 : selected.chance;

        // Cacher l'animation et afficher la carte
        hideRollAnimation();
        
        // Mettre à jour l'aperçu de la carte
        updateCardPreview({ selected, type, displayName, chanceDisplay });

        // Comptage
        if (!collection[displayName]) {
            collection[displayName] = 1;
        } else {
            collection[displayName]++;
        }
        
        saveCollection();
        updateCollection();
        updateInventoryStats();

        // Réactiver le bouton après 200ms supplémentaires (plus rapide)
        setTimeout(() => {
            rollButton.disabled = false;
            isRolling = false;
        }, 200);
    }, 200);
}

function updateCollection() {
    const ul = document.getElementById('collection-list');
    ul.innerHTML = '';

    // Trier par chance affichée
    let rarityOrder = chance => (chance < 10 ? 0 : chance < 100 ? 1 : chance < 1000 ? 2 : 3);
    let typeOrder = t => t === 'Rainbow' ? 2 : t === 'Gold' ? 1 : 0;
    let sortedNames = Object.keys(collection).sort((a, b) => {
        let typeA = a.endsWith('(Shiny)') ? 'Shiny' : a.endsWith('(Rainbow)') ? 'Rainbow' : a.endsWith('(Gold)') ? 'Gold' : '';
        let typeB = b.endsWith('(Shiny)') ? 'Shiny' : b.endsWith('(Rainbow)') ? 'Rainbow' : b.endsWith('(Gold)') ? 'Gold' : '';
        let baseA = typeA ? a.replace(` (${typeA})`, '') : a;
        let baseB = typeB ? b.replace(` (${typeB})`, '') : b;
        let itemA = items.find(i => i.name === baseA);
        let itemB = items.find(i => i.name === baseB);
        let chanceA = typeA === 'Shiny' ? itemA.chance * 100 : 'Rainbow' ? itemA.chance * 100 : typeA === 'Gold' ? itemA.chance * 10 : itemA.chance;
        let chanceB = typeB === 'Shiny' ? itemB.chance * 100 : 'Rainbow' ? itemB.chance * 100 : typeB === 'Gold' ? itemB.chance * 10 : itemB.chance;
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
        let type = name.endsWith('(Shiny)') ? 'Shiny' : name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
        let baseName = type ? name.replace(` (${type})`, '') : name;
        let item = items.find(i => i.name === baseName);
        let chanceDisplay = type === 'Shiny' ? item.chance * 1000 : type === 'Rainbow' ? item.chance * 100 : type === 'Gold' ? item.chance * 10 : item.chance;
        let displayName = baseName;
        let goldTag = getGoldTag(type);
        let rarityTag = getRarityTag(chanceDisplay);
        let imgSrc = `Cards-Icons/${baseName}.png`;
        let cardText = `<span class=\"name-only\">${displayName}</span>`;
        let cardDetail = `<span class=\"detail\">${displayName}<br>1 in ${chanceDisplay}<br>×${collection[name]}</span>`;
        // Déterminer la classe de rareté pour le dos
        let rarityClass = '';
        if (type === 'Rainbow') rarityClass = 'rarity-rainbow';
        else if (type === 'Gold') rarityClass = 'rarity-gold';
        else if (type === 'Shiny') rarityClass = 'rarity-shiny';
        // Les autres n'ont pas de classe spéciale (dos gris par défaut)
        let li = document.createElement('li');
        li.innerHTML = `
            <div class=\"card-inventory\">
                <span class=\"rarity-tag-container\">${goldTag}</span>
                <div class=\"card-flip-inner\">
                    <div class=\"card-flip-front\">
                        <img class=\"card-img\" src=\"${imgSrc}\" alt=\"${displayName}\">
                        <span class=\"card-text\">${cardText}</span>
                    </div>
                    <div class=\"card-flip-back${rarityClass ? ' ' + rarityClass : ''}\">\n<span class=\"card-text\">${cardDetail}</span>\n</div>
                </div>
                <span class=\"rarity-tag-container rarity-hidden\">${rarityTag}</span>
            </div>
        `;
        ul.appendChild(li);
    }
}

// Sauvegarde l'inventaire dans localStorage
function saveCollection() {
    localStorage.setItem('cards-collection', JSON.stringify(collection));
    localStorage.setItem('cards-rolls', rolls.toString());
    localStorage.setItem('cards-tokens', tokens.toString());
}

// Charge l'inventaire depuis localStorage
function loadCollection() {
    const data = localStorage.getItem('cards-collection');
    const rollsData = localStorage.getItem('cards-rolls');
    const tokensData = localStorage.getItem('cards-tokens');
    
    if (data) {
        collection = JSON.parse(data);
    }
    
    if (rollsData) {
        rolls = parseInt(rollsData);
        document.getElementById('rolls-count').innerText = rolls;
    }
    
    if (tokensData) {
        tokens = parseInt(tokensData);
        // S'assurer que les tokens ne dépassent pas la limite
        if (tokens > 10) tokens = 10;
    } else {
        tokens = 5; // Valeur par défaut pour les nouveaux utilisateurs
    }
    
    updateTokensDisplay();
}

// Fonction pour enregistrer la date de dernière connexion
function saveLastConnection() {
    const now = new Date();
    localStorage.setItem('cards-last-connection', now.toISOString());
}

// Enregistrer la date de dernière connexion à la déconnexion
window.addEventListener('beforeunload', saveLastConnection);

function gainTokensSinceLastConnection() {
    const last = localStorage.getItem('cards-last-connection');
    if (!last) return { tokensToAdd: 0, diffMinutes: 0, lastDate: null };
    const now = new Date();
    const lastDate = new Date(last);
    const diffMs = now - lastDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const tokensToAdd = Math.floor(diffSeconds / (rollDelay / 100)); // Gagne des tokens 100X plus lentement que en ligne
    if (tokensToAdd > 0) {
        tokens = Math.min(tokens + tokensToAdd, 10);
        updateTokensDisplay();
        saveCollection();
    }
    return { tokensToAdd, diffMinutes: Math.floor(diffSeconds / 60), lastDate };
}

function displayLastConnectionInfo(tokensToAdd, diffMinutes, lastDate) {
    const el = document.getElementById('last-connection');
    const overlay = document.getElementById('blur-overlay');
    if (!el || !lastDate || !overlay) return;
    const dateStr = lastDate.toLocaleString();
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    let timeStr = '';
    if (hours > 0) timeStr += hours + 'h ';
    timeStr += minutes + 'min';
    el.innerHTML = `Dernière connexion : <b>${dateStr}</b><br>Temps écoulé : <b>${timeStr}</b><br>Tokens gagnés : <b>${tokensToAdd}</b><br><br><span style='font-size:0.9em;color:#888'>(Clique pour continuer)</span>`;
    el.style.display = 'block';
    overlay.style.display = 'block';
    el.style.cursor = 'pointer';
    el.onclick = function() {
        el.style.display = 'none';
        overlay.style.display = 'none';
    };
}

// Au chargement de la page, on restaure l'inventaire
loadCollection();
const offlineInfo = gainTokensSinceLastConnection();
updateCollection();
updateInventoryStats();
resetCardPreview();
displayLastConnectionInfo(offlineInfo.tokensToAdd, offlineInfo.diffMinutes, offlineInfo.lastDate);

// Démarrer la recharge de tokens
startTokenRecharge();

// Ajouter des styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    #last-item {
        transition: all 0.3s ease;
    }
    
    .card-inventory {
        animation: fadeInUp 0.5s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

function resetAllSave() {
    localStorage.removeItem('cards-collection');
    localStorage.removeItem('cards-rolls');
    localStorage.removeItem('cards-tokens');
    localStorage.removeItem('cards-last-connection');
    location.reload();
}

function showResetConfirm() {
    const overlay = document.getElementById('blur-overlay');
    const popup = document.getElementById('reset-confirm');
    if (overlay && popup) {
        overlay.style.display = 'block';
        popup.style.display = 'block';
        // Empêche le scroll du fond
        document.body.style.overflow = 'hidden';
    }
    // Gestion des boutons
    document.getElementById('confirm-reset-btn').onclick = function() {
        resetAllSave();
    };
    document.getElementById('cancel-reset-btn').onclick = function() {
        if (overlay && popup) {
            overlay.style.display = 'none';
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    };
}
