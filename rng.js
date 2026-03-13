const items = [
    { name: "Grass", chance: 2, rollable: true },
    { name: "Bush", chance: 3, rollable: true },
    { name: "Tree", chance: 4, rollable: true },
    { name: "Bones", chance: 5, rollable: true },
    { name: "Sugar", chance: 7, rollable: true, specialTag: "Sweet" },
    { name: "Beach", chance: 10, rollable: true },
    { name: "Snow Mountains", chance: 15, rollable: true },
    { name: "Sword", chance: 25, rollable: true, specialTag: "Cutting" },
	   { name: "Overworld", chance: 35, rollable: true },
    { name: "Mars", chance: 50, rollable: true },
    { name: "Burger", chance: 75, rollable: true, specialTag: "Caloric" },
    { name: "Earth", chance: 100, rollable: true },
    { name: "Ice Spikes", chance: 150, rollable: true },
    { name: "Apple", chance: 200, rollable: true },
    { name: "Electricity", chance: 250, rollable: true },
    { name: "Hearth", chance: 500, rollable: true },
    { name: "Evil", chance: 666, rollable: true },
    { name: "Sky", chance: 750, rollable: true },
    { name: "Tacos", chance: 1000, rollable: true },
    { name: "Gun", chance: 1500, rollable: true },
    { name: "Ugly", chance: 2500, rollable: true },
    { name: "Cute", chance: 2500, rollable: true },
    { name: "Noob", chance: 5000, rollable: true },
    { name: "Cards", chance: 7500, rollable: true },
    { name: "Circus", chance: 10000, rollable: true },
    { name: "Clouds", chance: 15000, rollable: true },
    { name: "Nars", chance: 25000, rollable: true },
    { name: "Iceberg", chance: 15000, rollable: false },
    { name: "Cards Circus", chance: 25000, rollable: false },
    { name: "Thunder", chance: 2500, rollable: false },
    { name: "Pierced Hearth", chance: 5000, rollable: false },
    { name: "Infinity", chance: 1000000000, rollable: false }
];

// Potions
const potions = [
    {
        name: "Speed Potion",
        type: "rollspeed",
        power: 2,
        duration: 60 * 1000, // 60 secondes
        image: "Speed.png",
        effectType: "time" // Effet basé sur le temps
    },
    {
        name: "Thunder Potion",
        type: "rollspeed",
        power: 3,
        duration: 30 * 60 * 1000, // 30 minutes
        image: "Thunder.png",
        effectType: "time" // Effet basé sur le temps
    },
    {
        name: "Luck Potion",
        type: "luck",
        power: 2,
        duration: 60 * 1000, // 60 secondes
        image: "Luck.png",
        effectType: "time" // Effet basé sur le temps
    }
];

const cardsGroupes = [
    { name: "Nature", content: ["Grass", "Bush", "Tree", "Apple"], color: "rgb(6, 65, 11)" },
    { name: "Biomes", content: ["Snow Mountains", "Beach", "Sky"], color: "rgb(129, 148, 131)" },
    { name: "Food", content: ["Sugar", "Burger", "Apple", "Tacos"], color: "rgb(216, 177, 47)" },
    { name: "Planets", content: ["Mars", "Earth"], color: "rgb(54, 54, 54)" },
    { name: "Weapons", content: ["Sword", "Gun"], color: "rgb(30, 30, 30)" },
    { name: "Monster Loot", content: ["Bones"], color: "rgb(165, 33, 0)" },
    { name: "Energy", content: ["Electricity", "Thunder"], color: "rgb(255, 245, 53)" },
    { name: "Body Parts", content: ["Bones", "Hearth", "Pierced Hearth"], color: "rgb(207, 43, 88)" }
];

let collection = {};
let potionInventory = {}; // Inventaire des potions et items spéciaux
let activeEffects = {}; // Effets actuellement actifs
let rollBasedEffects = {}; // Effets basés sur le nombre de rolls
let rolls = 0;
let isRolling = false;
let tokens = 10;
let tokenRate = 0.2; // tokens par seconde (base)
let tokenAccumulator = 0; // accumulateur fractionnaire
let tokenRechargeIntervalId = null;
let realTimeEffectsIntervalId = null;
const TOKEN_TICK_MS = 100; // tick toutes les 100ms
let pressPreviewIntervalId = null;
let pressQty = 1; // Quantité sélectionnée dans le menu Press
let pressKeep = false; // Option pour garder 1 carte lors du press
const BASE_MAX_TOKEN = 20;
let maxToken = BASE_MAX_TOKEN;
let rollDelay = 1000;
let luck = 1;
let spinningCardsAnimationSpeed = 200;
let diamonds = 0;
let tokenUpgradeLevel = 0; // Niveau d'amélioration de vitesse de tokens
let maxTokenUpgradeLevel = 0; // Niveau d'amélioration de max tokens
let luckUpgradeLevel = 0; // Niveau d'amélioration de chance
let xpUpgradeLevel = 0;      // Niveau d'amélioration de gain XP
let diamondUpgradeLevel = 0; // Niveau d'amélioration de gain diamants

let sugarRushCounter = 0;
let sugarRushTrigger = 6;
let sugarRushMax = 4;
let sugarRushBulk = 4;
let sugarRushMultiplier = 0;
let sugarRushMaxMultiplier = 2;

let slotInterval = null;

let xp = 0;
let level = 1;
let xpNext = 50;

// Crafting
const craftRecipes = [
    {
        name: "Thunder",
        ingredients: [
            { name: "Electricity", amount: 10 }
        ],
        time: 1000 * 45,
    },
    {
        name: "Speed Potion",
        ingredients: [
            { name: "Electricity", amount: 5 }
        ],
        time: 1000 * 30,
        type: "potion"
    },
    {
        name: "Thunder Potion",
        ingredients: [
            { name: "Thunder", amount: 2 },
            { name: "Electricity", amount: 5 },
        ],
        time: 1000 * 60,
        type: "potion"
    },
    {
        name: "Luck Potion",
        ingredients: [
            { name: "Sugar", amount: 10 },
            { name: "Snow Mountains", amount: 4 },
        ],
        time: 1000 * 30,
        type: "potion"
    },
	{
        name: "Pierced Hearth",
        ingredients: [
            { name: "Hearth", amount: 10 }
        ],
        time: 1000 * 45,
    },
	{
        name: "Ugly",
        ingredients: [
            { name: "Cute", amount: 5 }
        ],
        time: 1000 * 30,
    },
	{
        name: "Cute",
        ingredients: [
            { name: "Ugly", amount: 5 }
        ],
        time: 1000 * 30,
    },
	{
        name: "Cards Circus",
        ingredients: [
            { name: "Circus", amount: 1 },
            { name: "Cards", amount: 2 }
        ],
        time: 1000 * 45,
    },
	{
        name: "Iceberg",
        ingredients: [
            { name: "Ice Spikes", amount: 100 }
        ],
        time: 1000 * 60,
    }
];

let craftingQueue = [];

function saveCraftingQueue() {
    const simplified = craftingQueue.map(job => ({
        recipeName: job.recipe.name,
        endTime: job.endTime
    }));
    localStorage.setItem('cards-craft-queue', JSON.stringify(simplified));
}

function craftItem(recipe) {
    // Vérifier si on a les ingrédients nécessaires
    if (!hasIngredients(recipe)) {
        showCraftMessage("Not enought items!", "error");
        return false;
    }
    
    // Consommer les ingrédients
    consumeIngredients(recipe);
    
    // Ajouter à la queue de craft
    const now = Date.now();
    let endTime;
    
    if (craftingQueue.length === 0) {
        // Premier craft - commence immédiatement
        endTime = now + recipe.time;
    } else {
        // Craft suivant - commence après la fin du dernier craft
        const lastJob = craftingQueue[craftingQueue.length - 1];
        endTime = lastJob.endTime + recipe.time;
    }
    
    const craftJob = {
        recipe: recipe,
        startTime: now,
        endTime: endTime,
        id: Date.now() + Math.random()
    };
    
    craftingQueue.push(craftJob);
    saveCraftingQueue();
    showCraftMessage(`${recipe.name} added to the queue!`, "success");

    // Démarrer l'interval de traitement si pas déjà actif
    startCraftingInterval();

    updateCraftButtons();
    return true;
}

function hasIngredients(recipe) {
    for (let ingredient of recipe.ingredients) {
        const itemName = ingredient.name;
        const requiredAmount = ingredient.amount;
        const ownedAmount = collection[itemName] || 0;
        
        if (ownedAmount < requiredAmount) {
            return false;
        }
    }
    return true;
}

function consumeIngredients(recipe) {
    for (let ingredient of recipe.ingredients) {
        const itemName = ingredient.name;
        const amount = ingredient.amount;
        
        collection[itemName] -= amount;
        if (collection[itemName] <= 0) {
            delete collection[itemName];
        }
    }
    saveCollection();
    updateCollection();
    updateInventoryStats();
}

let craftingIntervalId = null;

function startCraftingInterval() {
    if (craftingIntervalId !== null) return;
    craftingIntervalId = setInterval(processCraftingQueue, 250);
}

function stopCraftingInterval() {
    if (craftingIntervalId !== null) {
        clearInterval(craftingIntervalId);
        craftingIntervalId = null;
    }
}

function processCraftingQueue() {
    if (craftingQueue.length === 0) {
        stopCraftingInterval();
        updateCraftButtons();
        return;
    }

    const currentJob = craftingQueue[0];
    const now = Date.now();

    if (now >= currentJob.endTime) {
        // Craft terminé
        const recipe = currentJob.recipe;

        if (recipe.type === "potion") {
            potionInventory[recipe.name] = (potionInventory[recipe.name] || 0) + 1;
        } else {
            collection[recipe.name] = (collection[recipe.name] || 0) + 1;
        }

        craftingQueue.shift();

        saveCollection();
        saveCraftingQueue();
        updateCollection();
        updateInventoryStats();
        updatePotionsInventory();
        showCraftMessage(`${recipe.name} successfuly crafted!`, "success");

        // Corriger le temps du prochain si nécessaire
        if (craftingQueue.length > 0) {
            const nextJob = craftingQueue[0];
            if (nextJob.endTime <= Date.now()) {
                nextJob.endTime = Date.now() + nextJob.recipe.time;
            }
            updateCraftButtons();
        } else {
            stopCraftingInterval();
            updateCraftButtons();
        }
    } else {
        // Mise à jour de l'affichage de la queue uniquement
        updateCraftQueue();
    }
}

function showCraftMessage(message, type) {
    const craftResult = document.getElementById('craft-result');
    if (craftResult) {
        craftResult.innerText = message;
        craftResult.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
            craftResult.innerText = '';
        }, 3000);
    }
}

function updateCraftQueue() {
    const craftQueue = document.getElementById('craft-queue');
    if (!craftQueue) return;
    
    if (craftingQueue.length === 0) {
        craftQueue.innerHTML = '<div style="color:#7f8c8d;font-style:italic;">No crafting in progress...</div>';
        saveCraftingQueue();
        return;
    }
    
    // Vérifier que tous les jobs ont des temps de fin valides
    const now = Date.now();
    for (let job of craftingQueue) {
        if (!job.endTime || job.endTime <= now) {
            // Corriger le temps de fin si nécessaire
            job.endTime = now + job.recipe.time;
        }
    }
    
    craftQueue.innerHTML = '';
    
    for (let i = 0; i < craftingQueue.length; i++) {
        const job = craftingQueue[i];
        const recipe = job.recipe;
        const now = Date.now();
        const timeLeft = Math.max(0, job.endTime - now);
        const progress = Math.max(0, Math.min(1, 1 - (timeLeft / recipe.time)));
        
        const queueItem = document.createElement('div');
        queueItem.style.cssText = `
            background: ${i === 0 ? 'linear-gradient(90deg, #3498db, #2980b9)' : 'rgba(52,152,219,0.2)'};
            color: ${i === 0 ? 'white' : '#2c3e50'};
            padding: 0.8em;
            margin-bottom: 0.5em;
            border-radius: 8px;
            font-weight: bold;
            position: relative;
            overflow: hidden;
        `;
        
        // Barre de progression pour le craft en cours
        if (i === 0) {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #2ecc71, #27ae60);
                width: ${progress * 100}%;
                transition: width 0.3s ease;
            `;
            queueItem.appendChild(progressBar);
        }
        
        const itemContent = document.createElement('div');
        itemContent.style.cssText = `
            position: relative;
            z-index: 1;
        `;
        
        if (i === 0) {
            // Craft en cours
            itemContent.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:1.1em;color:#2ecc71;">${recipe.name}</span>
                    <span style="font-size:0.9em;">${formatTime(timeLeft)} left</span>
                </div>
                <div style="font-size:0.8em;margin-top:0.3em;opacity:0.9;">
                    ${recipe.ingredients.map(ing => `${ing.name}: ${ing.amount}`).join(', ')}
                </div>
            `;
        } else {
            // Crafts en attente
            itemContent.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:1.1em;color:#f39c12;">${recipe.name}</span>
                    <span style="font-size:0.9em;">Waiting</span>
                </div>
                <div style="font-size:0.8em;margin-top:0.3em;opacity:0.9;">
                    ${recipe.ingredients.map(ing => `${ing.name}: ${ing.amount}`).join(', ')}
                </div>
            `;
        }
        
        queueItem.appendChild(itemContent);
        craftQueue.appendChild(queueItem);
    }
}

// Track selected recipe
let selectedRecipe = null;

function getItemChance(itemName) {
    const item = items.find(i => i.name === itemName);
    return item ? item.chance : 9999;
}

function updateCraftButtons() {
    const craftList = document.getElementById('craft-list');
    if (!craftList) return;
    craftList.innerHTML = '';

    for (let recipe of craftRecipes) {
        const canCraft = hasIngredients(recipe);
        const isSelected = selectedRecipe && selectedRecipe.name === recipe.name;

        const maxCrafts = Math.min(...recipe.ingredients.map(ing => {
            const owned = collection[ing.name] || 0;
            return Math.floor(owned / ing.amount);
        }));

        const card = document.createElement('div');
        card.className = 'craft-recipe-card' + (isSelected ? ' selected' : '') + (canCraft ? ' can-craft' : '');
        card.onclick = () => selectRecipe(recipe);

        // Image de la carte
        const imgWrap = document.createElement('div');
        imgWrap.className = 'craft-card-img-wrap';
        const img = document.createElement('img');
        img.src = `Cards-Icons/${recipe.name}.png`;
        img.alt = recipe.name;
        img.onerror = function() { this.style.display = 'none'; };
        imgWrap.appendChild(img);

        // Infos
        const info = document.createElement('div');
        info.className = 'craft-card-info';

        const nameRow = document.createElement('div');
        nameRow.className = 'craft-card-name';
        nameRow.innerHTML = recipe.name + (canCraft ? ` <span class="craft-can-badge">\u00d7${maxCrafts}</span>` : '');

        const timeRow = document.createElement('div');
        timeRow.className = 'craft-card-time';
        timeRow.innerHTML = `\u23f1 ${formatTime(recipe.time)}`;

        const ingredientsRow = document.createElement('div');
        ingredientsRow.className = 'craft-card-ingredients';
        for (let ing of recipe.ingredients) {
            const owned = collection[ing.name] || 0;
            const ok = owned >= ing.amount;
            const ingChance = getItemChance(ing.name);
            const ingSquare = document.createElement('div');
            ingSquare.className = 'craft-ing-square' + (ok ? ' ok' : ' missing');
            ingSquare.innerHTML = `
                <img src="Cards-Icons/${ing.name}.png" alt="${ing.name}" onerror="this.style.display='none'">
                <span class="craft-ing-qty">${owned}/${ing.amount}</span>
                <span class="craft-ing-name">${ing.name}</span>
                <span class="craft-ing-rarity">${getRarityTag(ingChance)}</span>
            `;
            ingredientsRow.appendChild(ingSquare);
        }

        info.appendChild(nameRow);
        info.appendChild(timeRow);
        info.appendChild(ingredientsRow);
        card.appendChild(imgWrap);
        card.appendChild(info);
        craftList.appendChild(card);
    }

    // Refresh selected panel
    if (selectedRecipe) {
        const updated = craftRecipes.find(r => r.name === selectedRecipe.name);
        if (updated) renderSelectedRecipe(updated);
    }

    updateCraftQueue();
}

function selectRecipe(recipe) {
    selectedRecipe = recipe;
    renderSelectedRecipe(recipe);
    document.querySelectorAll('.craft-recipe-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.craft-recipe-card').forEach(c => {
        const nameEl = c.querySelector('.craft-card-name');
        if (nameEl && nameEl.textContent.trim().startsWith(recipe.name)) {
            c.classList.add('selected');
        }
    });
}

function renderSelectedRecipe(recipe) {
    const box = document.getElementById('craft-selected');
    if (!box) return;

    const canCraft = hasIngredients(recipe);
    const maxCrafts = Math.min(...recipe.ingredients.map(ing => {
        const owned = collection[ing.name] || 0;
        return Math.floor(owned / ing.amount);
    }));

    box.innerHTML = '';

    // Grande image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'craft-selected-img-wrap';
    const img = document.createElement('img');
    img.src = `Cards-Icons/${recipe.name}.png`;
    img.alt = recipe.name;
    img.onerror = function() { this.style.display = 'none'; };
    imgWrap.appendChild(img);
    box.appendChild(imgWrap);

    // Nom + temps
    const header = document.createElement('div');
    header.className = 'craft-selected-header';
    header.innerHTML = `
        <div class="craft-selected-name">${recipe.name}</div>
        <div class="craft-selected-time">\u23f1 ${formatTime(recipe.time)}</div>
        ${maxCrafts > 0 ? `<div class="craft-selected-count">Can craft: <b>${maxCrafts}\u00d7</b></div>` : ''}
    `;
    box.appendChild(header);

    // Ingrédients
    const ingsTitle = document.createElement('div');
    ingsTitle.className = 'craft-selected-section-title';
    ingsTitle.textContent = 'Ingredients';
    box.appendChild(ingsTitle);

    const ingsRow = document.createElement('div');
    ingsRow.className = 'craft-selected-ings';
    for (let ing of recipe.ingredients) {
        const owned = collection[ing.name] || 0;
        const ok = owned >= ing.amount;
        const ingChance = getItemChance(ing.name);
        const sq = document.createElement('div');
        sq.className = 'craft-selected-ing-sq' + (ok ? ' ok' : ' missing');
        sq.innerHTML = `
            <img src="Cards-Icons/${ing.name}.png" alt="${ing.name}" onerror="this.style.display='none'">
            <div class="craft-selected-ing-name">${ing.name}</div>
            <div class="craft-selected-ing-qty ${ok ? 'qty-ok' : 'qty-missing'}">${owned} / ${ing.amount}</div>
            <div class="craft-selected-ing-rarity">${getRarityTag(ingChance)}</div>
        `;
        ingsRow.appendChild(sq);
    }
    box.appendChild(ingsRow);

    // Bouton craft
    const btn = document.createElement('button');
    btn.className = 'craft-selected-btn' + (canCraft ? ' active' : ' disabled');
    btn.textContent = canCraft ? `CRAFT ${recipe.name}` : 'Missing ingredients';
    btn.onclick = canCraft
        ? () => { craftItem(recipe); updateCraftButtons(); }
        : () => showCraftMessage("Not enough items!", "error");
    box.appendChild(btn);
}

function updateActiveEffectsDisplay() {
    const activeEffectsDiv = document.getElementById('active-effects');
    if (!activeEffectsDiv) return;
    
    // Nettoyer les effets expirés
    const now = Date.now();
    let effectsRemoved = false;
    for (let effectType in activeEffects) {
        if (activeEffects[effectType].endTime <= now) {
            delete activeEffects[effectType];
            effectsRemoved = true;
        }
    }
    
    // Mettre à jour les stats si des effets ont été supprimés
    if (effectsRemoved) {
        updateActiveEffects();
        showCraftMessage("Effet ended", "info");
    }
    
    activeEffectsDiv.innerHTML = '';
    
    // Stats de base
    const statsSection = document.createElement('div');
    statsSection.style.cssText = `
        margin-bottom: 1em;
        padding-bottom: 1em;
        border-bottom: 1px solid rgba(231,76,60,0.3);
    `;
    
    const rollSpeedMultiplier = activeEffects.rollspeed ? activeEffects.rollspeed.power : 1;
    const luckMultiplier = (activeEffects.luck ? activeEffects.luck.power : 1) * (sugarRushCounter >= sugarRushTrigger ? sugarRushMaxMultiplier : 1);
    const tokenSpeedMultiplier = activeEffects.tokenspeed ? activeEffects.tokenspeed.power : 1;
    
    statsSection.innerHTML = `
        <div style="font-weight:bold;color:#e74c3c;margin-bottom:0.5em;">Stats Actuelles</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.9em;">
            <div>Roll Speed: <span style="color:#27ae60;font-weight:bold;">x${rollSpeedMultiplier}</span></div>
            <div>Luck: <span style="color:#3498db;font-weight:bold;">x${luckMultiplier}</span></div>
            <div>Tokens Speed: <span style="color:#f39c12;font-weight:bold;">x${tokenSpeedMultiplier}</span></div>
        </div>
    `;
    
    activeEffectsDiv.appendChild(statsSection);
    
    // Effets actifs
    let hasActiveEffects = false;
    
    // Sugar Rush (effet basé sur les rolls)
    if (sugarRushCounter > 0) {
        hasActiveEffects = true;
        const sugarRushDiv = document.createElement('div');
        sugarRushDiv.style.cssText = `
            background: linear-gradient(135deg, #ff69b4, #e91e63);
            color: white;
            padding: 0.8em;
            border-radius: 8px;
            margin-bottom: 0.5em;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        sugarRushDiv.innerHTML = `
            <div>
                <div style="font-weight:bold;">🍭 Sugar Rush</div>
                <div style="font-size:0.8em;opacity:0.9;">Chance x${sugarRushMaxMultiplier}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.9em;">${sugarRushCounter}/${sugarRushTrigger + sugarRushMax}</div>
                <div style="font-size:0.8em;opacity:0.9;">Trigger: ${sugarRushTrigger}</div>
            </div>
        `;
        activeEffectsDiv.appendChild(sugarRushDiv);
    }
    
    // Effets de potions (temporels)
    for (let effectType in activeEffects) {
        hasActiveEffects = true;
        const effect = activeEffects[effectType];
        const timeLeft = Math.max(0, effect.endTime - now);
        
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = `
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            padding: 0.8em;
            border-radius: 8px;
            margin-bottom: 0.5em;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        let effectName = "";
        let effectIcon = "⚗️";
        switch (effectType) {
            case "rollspeed":
                effectName = "Roll Speed";
                effectIcon = "⚡";
                break;
            case "luck":
                effectName = "Luck";
                effectIcon = "🍀";
                break;
            case "tokenspeed":
                effectName = "Tokens Speed";
                effectIcon = "🪙";
                break;
        }
        
        effectDiv.innerHTML = `
            <div>
                <div style="font-weight:bold;">${effectIcon} ${effect.potionName}</div>
                <div style="font-size:0.8em;opacity:0.9;">${effectName} x${effect.power}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.9em;">${Math.ceil(timeLeft / 1000)}s left</div>
            </div>
        `;
        activeEffectsDiv.appendChild(effectDiv);
    }
    
    // Effets basés sur les rolls
    for (let effectType in rollBasedEffects) {
        hasActiveEffects = true;
        const effect = rollBasedEffects[effectType];
        
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = `
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            padding: 0.8em;
            border-radius: 8px;
            margin-bottom: 0.5em;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        let effectName = "";
        let effectIcon = "🎯";
        switch (effectType) {
            case "rollspeed":
                effectName = "Roll Speed";
                effectIcon = "⚡";
                break;
            case "luck":
                effectName = "Luck";
                effectIcon = "🍀";
                break;
            case "tokenspeed":
                effectName = "Tokens Speed";
                effectIcon = "🪙";
                break;
        }
        
        effectDiv.innerHTML = `
            <div>
                <div style="font-weight:bold;">${effectIcon} ${effect.potionName}</div>
                <div style="font-size:0.8em;opacity:0.9;">${effectName} x${effect.power}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.9em;">${effect.rollsUsed}/${effect.rollLimit}</div>
                <div style="font-size:0.8em;opacity:0.9;">Rolls left</div>
            </div>
        `;
        activeEffectsDiv.appendChild(effectDiv);
    }
    
    // Message si aucun effet
    if (!hasActiveEffects) {
        activeEffectsDiv.innerHTML = `
            <div style="color:#7f8c8d;font-style:italic;text-align:center;padding:2em;">
                No active effects...
            </div>
        `;
    }
}

function updatePotionsInventory() {
    const potionsList = document.getElementById('potions-list');
    if (!potionsList) return;
    
    potionsList.innerHTML = '';
    
    for (let potionName in potionInventory) {
        const amount = potionInventory[potionName];
        const potion = potions.find(p => p.name === potionName);
        
        if (!potion) continue;
        
        const potionItem = document.createElement('div');
        potionItem.style.cssText = `
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            padding: 1em;
            border-radius: 15px;
            text-align: center;
            min-width: 140px;
            box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        // Image de la potion
        const img = document.createElement('img');
        img.src = `Potions/${potion.image}`;
        img.style.cssText = `
            width: 60px;
            height: 60px;
            object-fit: contain;
            margin-bottom: 0.5em;
        `;
        img.onerror = function() {
            // Si l'image n'existe pas, afficher une icône par défaut
            this.style.display = 'none';
        };
        
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = `
            font-weight: bold;
            font-size: 0.9em;
            margin-bottom: 0.3em;
        `;
        nameDiv.innerText = potionName;
        
        // Informations de la potion
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            font-size: 0.8em;
            margin-bottom: 0.5em;
            opacity: 0.9;
        `;
        
        let typeText = "";
        switch (potion.type) {
            case "rollspeed":
                typeText = "Vitesse de roll";
                break;
            case "luck":
                typeText = "Chance";
                break;
            case "tokenspeed":
                typeText = "Vitesse de tokens";
                break;
        }
        
        infoDiv.innerHTML = `
            <div>${typeText} x${potion.power}</div>
            <div>${Math.floor(potion.duration / 1000)}s</div>
        `;
        
        const amountDiv = document.createElement('div');
        amountDiv.style.cssText = `
            font-size: 1.2em;
            font-weight: bold;
            color: #f1c40f;
        `;
        amountDiv.innerText = `×${amount}`;
        
        const useButton = document.createElement('button');
        useButton.style.cssText = `
            background: linear-gradient(90deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.5em 1em;
            margin-top: 0.5em;
            font-size: 0.8em;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        useButton.innerText = 'Utiliser';
        useButton.onclick = () => usePotion(potionName);
        
        potionItem.appendChild(img);
        potionItem.appendChild(nameDiv);
        potionItem.appendChild(infoDiv);
        potionItem.appendChild(amountDiv);
        potionItem.appendChild(useButton);
        
        potionsList.appendChild(potionItem);
    }
    
    // Afficher un message si pas de potions
    if (Object.keys(potionInventory).length === 0) {
        potionsList.innerHTML = '<div style="color:#7f8c8d;font-style:italic;">No potions in the inventory</div>';
    }
}

function usePotion(potionName) {
    if (potionInventory[potionName] <= 0) return;
    
    // Trouver la potion dans l'array
    const potion = potions.find(p => p.name === potionName);
    if (!potion) return;
    
    // Utiliser la potion
    potionInventory[potionName]--;
    if (potionInventory[potionName] <= 0) {
        delete potionInventory[potionName];
    }
    
    // Appliquer l'effet de la potion
    applyPotionEffect(potion);
    
    saveCollection();
    updatePotionsInventory();
}

function applyPotionEffect(potion) {
    // Vérifier le type d'effet
    if (potion.effectType === "rolls") {
        // Effet basé sur le nombre de rolls
        const rollLimit = potion.rollLimit || 10; // Par défaut 10 rolls
        
        rollBasedEffects[potion.type] = {
            power: potion.power,
            rollsUsed: 0,
            rollLimit: rollLimit,
            potionName: potion.name
        };
        
        // Message de confirmation
        let effectMessage = "";
        switch (potion.type) {
            case "rollspeed":
                effectMessage = `Roll Speed x${potion.power} for ${rollLimit} rolls !`;
                break;
            case "luck":
                effectMessage = `Luck x${potion.power} for ${rollLimit} rolls !`;
                break;
            case "tokenspeed":
                effectMessage = `Tokens Speed x${potion.power} for ${rollLimit} rolls !`;
                break;
        }
        showCraftMessage(effectMessage, "success");
    } else {
        // Effet basé sur le temps
        const now = Date.now();
        
        // Vérifier si un effet du même type existe déjà
        if (activeEffects[potion.type]) {
            // Ajouter le temps à l'effet existant
            activeEffects[potion.type].endTime += potion.duration;
            showCraftMessage(`+${Math.floor(potion.duration / 1000)}s added to ${potion.name}`, "success");
        } else {
            // Créer un nouvel effet
            const endTime = now + potion.duration;
            activeEffects[potion.type] = {
                power: potion.power,
                endTime: endTime,
                potionName: potion.name
            };
        }
        
        // Message de confirmation
        let effectMessage = "";
        switch (potion.type) {
            case "rollspeed":
                effectMessage = `Roll Speed x${potion.power} !`;
                break;
            case "luck":
                effectMessage = `Luck x${potion.power} !`;
                break;
            case "tokenspeed":
                effectMessage = `Tokens Speed x${potion.power} !`;
                break;
        }
        showCraftMessage(effectMessage, "success");
        
        // Programmer la fin de l'effet
        setTimeout(() => {
            removePotionEffect(potion.type);
        }, potion.duration);
    }
    
    // Appliquer l'effet immédiatement
    updateActiveEffects();
}

function removePotionEffect(effectType) {
    if (activeEffects[effectType]) {
        delete activeEffects[effectType];
        updateActiveEffects();
        showCraftMessage(`${effectType} ended`, "info");
    }
}

function updateActiveEffects() {
    const now = Date.now();
    
    // Nettoyer les effets expirés
    for (let effectType in activeEffects) {
        if (activeEffects[effectType].endTime <= now) {
            delete activeEffects[effectType];
        }
    }
    
    // Appliquer les effets actifs
    let rollSpeedMultiplier = 1;
    let luckMultiplier = 1;
    let tokenSpeedMultiplier = 1;
    
    for (let effectType in activeEffects) {
        const effect = activeEffects[effectType];
        switch (effectType) {
            case "rollspeed":
                rollSpeedMultiplier = effect.power;
                break;
            case "luck":
                luckMultiplier = effect.power;
                break;
            case "tokenspeed":
                tokenSpeedMultiplier = effect.power;
                break;
        }
    }
    
    // Appliquer les multiplicateurs
    rollDelay = Math.max(50, 1000 / rollSpeedMultiplier);
    luck = luckMultiplier;
    // tokenRate de base + upgrades, multiplié par la potion
    tokenRate = (0.2 + tokenUpgradeLevel * 0.1) * tokenSpeedMultiplier;
    
    // Mettre à jour l'affichage
    updateLuck();
    updateActiveEffectsDisplay();
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) {
        return `${seconds}s`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds}s`;
    }
}

function getRarityTag(chance) {
    if (chance < 10) return '<span class="rarity-tag rarity-common">Common</span>';
    if (chance < 100) return '<span class="rarity-tag rarity-uncommon">Uncommon</span>';
    if (chance < 1000) return '<span class="rarity-tag rarity-rare">Rare</span>';
    if (chance < 10000) return '<span class="rarity-tag rarity-epic">Epic</span>';
    if (chance < 100000) return '<span class="rarity-tag rarity-legendary">Legendary</span>';
    return '<span class="rarity-tag rarity-mythic">Mythic</span>';
}

function getGoldTag(type) {
    if (type === 'Nuclear') return '<span class="rarity-tag rarity-nuclear">Nuclear</span>';
    if (type === 'Shiny') return '<span class="rarity-tag rarity-shiny">Shiny</span>';
    if (type === 'Rainbow') return '<span class="rarity-tag rarity-rainbow">Rainbow</span>';
    if (type === 'Gold') return '<span class="rarity-tag rarity-gold">Gold</span>';
    return '';
}

function getSpecialTag(item) {
    if (item && item.specialTag) {
        let tagClass = 'rarity-sweet';
        if (item.name === 'Sword') tagClass = 'rarity-cutting';
        return `<span class=\"rarity-tag ${tagClass}\">${item.specialTag}</span>`;
    }
    return '';
}

function updateInventoryStats() {
    const totalCards = Object.values(collection).reduce((sum, count) => sum + count, 0);
    const unlockedCards = Object.keys(collection).length;
    
    document.getElementById('total-cards').innerText = `Total: ${totalCards}`;
    document.getElementById('unlocked-cards').innerText = `Unlocked: ${unlockedCards}`;
    updateLevelXpDisplay();
}

function updateTokensDisplay() {
    const tokensElement = document.getElementById('tokens-count');
    const indicator = document.getElementById('tokens-indicator');
    const rollButton = document.getElementById('roll-button');
    
    tokensElement.innerText = `${tokens} / ${maxToken}`;
    
    // Changer la couleur selon l'état des tokens
    if (tokens <= 25 / 100 * maxToken) {
        indicator.classList.add('very-low');
        indicator.classList.remove('low');
        indicator.classList.remove('medium');
        indicator.classList.remove('high');
        indicator.classList.remove('max');
    } else if (tokens <= 50 / 100 * maxToken) {
        indicator.classList.remove('very-low');
        indicator.classList.add('low');
        indicator.classList.remove('medium');
        indicator.classList.remove('high');
        indicator.classList.remove('max');
    } else if (tokens <= 75 / 100 * maxToken) {
        indicator.classList.remove('very-low');
        indicator.classList.remove('low');
        indicator.classList.add('medium');
        indicator.classList.remove('high');
        indicator.classList.remove('max');
    } else if (tokens >= maxToken) {
        indicator.classList.remove('very-low');
        indicator.classList.remove('low');
        indicator.classList.remove('medium');
        indicator.classList.remove('high');
        indicator.classList.add('max');
    } else {
        indicator.classList.remove('very-low');
        indicator.classList.remove('low');
        indicator.classList.remove('medium');
        indicator.classList.add('high');
        indicator.classList.remove('max');
    }
    // Désactiver et griser le bouton roll si plus de tokens
    if (rollButton) {
        if (tokens <= 0) {
            rollButton.disabled = true;
            rollButton.style.background = 'linear-gradient(90deg, #bdbdbd, #757575)';
            rollButton.style.color = '#888';
            rollButton.style.cursor = 'not-allowed';
        } else {
            rollButton.disabled = false;
            rollButton.style.background = '';
            rollButton.style.color = '';
            rollButton.style.cursor = 'pointer';
        }
    }
}

function updateDiamondsDisplay() {
    const diamondsElement = document.getElementById('diamonds-count');
    const indicator = document.getElementById('diamonds-indicator');
    if (!diamondsElement || !indicator) return;
    diamondsElement.innerText = diamonds.toString();
}

function startTokenRecharge() {
    if (tokenRechargeIntervalId !== null) return;
    let ticksSinceLastSave = 0;
    tokenRechargeIntervalId = setInterval(() => {
        if (tokens < maxToken) {
            tokenAccumulator += tokenRate * (TOKEN_TICK_MS / 1000);
            if (tokenAccumulator >= 1) {
                const toAdd = Math.floor(tokenAccumulator);
                tokenAccumulator -= toAdd;
                const wasZero = tokens === 0;
                tokens = Math.min(tokens + toAdd, maxToken);
                updateTokensDisplay();
                ticksSinceLastSave++;
                if (ticksSinceLastSave >= 10) {
                    saveCollection();
                    ticksSinceLastSave = 0;
                }
            }
        } else {
            tokenAccumulator = 0;
        }
    }, TOKEN_TICK_MS);
}

function stopTokenRecharge() {
    if (tokenRechargeIntervalId !== null) {
        clearInterval(tokenRechargeIntervalId);
        tokenRechargeIntervalId = null;
    }
}

function restartTokenRecharge() {
    stopTokenRecharge();
    startTokenRecharge();
}

// Fonction pour obtenir le temps restant avant le prochain token
function getTimeUntilNextToken() {
    // Cette fonction peut être utilisée pour afficher un compte à rebours
    // Pour l'instant, on retourne simplement 5 secondes
    return 5;
}

function getRandomItem() {
    return items[Math.floor(Math.random() * items.length)];
}

function updateSpinningCards() {
    const cards = document.querySelectorAll('.spinning-card');
    cards.forEach(card => {
        const item = getRandomItem();
        card.innerHTML = `
            <div style="position:relative;width:100%;height:100%;">
                <img src="Cards-Icons/${item.name}.png" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);color:#fff;font-size:0.85em;font-weight:bold;text-align:center;text-shadow:0 0 4px #000;padding:2px 0;border-radius:0 0 10px 10px;">${item.name}</div>
            </div>
        `;
    });
}

function clearSpinningCards() {
    const cards = document.querySelectorAll('.spinning-card');
    cards.forEach(card => {
        card.innerHTML = '';
    });
}

function showRollAnimation() {
    const animation = document.getElementById('roll-animation');
    animation.classList.remove('hidden');
    updateSpinningCards();
    if (slotInterval) clearInterval(slotInterval);
    slotInterval = setInterval(updateSpinningCards, spinningCardsAnimationSpeed);
}

function hideRollAnimation() {
    const animation = document.getElementById('roll-animation');
    animation.classList.add('hidden');
    if (slotInterval) {
        clearInterval(slotInterval);
        slotInterval = null;
    }
    clearSpinningCards();
}

function updateCardPreview(cardData) {
    const preview = document.getElementById('card-preview');
    const { selected, type, displayName, chanceDisplay } = cardData;
    const specialTag = getSpecialTag(selected);
    preview.innerHTML = `
        <div class="preview-card">
            <span class="rarity-tag-container">${getGoldTag(type)}${specialTag}</span>
            <img src="Cards-Icons/${selected.name}.png" alt="${selected.name}" class="card-image">
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

function updateLuck() {
    const potionLuck = (activeEffects.luck && activeEffects.luck.endTime > Date.now())
        ? activeEffects.luck.power : 1;
    const upgradeLuck = 1 + luckUpgradeLevel * 0.5;
    luck = Math.max(1, sugarRushMultiplier) * potionLuck * upgradeLuck;
}

function rollItem() {
    updateLuck()
    updateActiveEffects()
    if (isRolling) return; // Empêche les rolls multiples
    if (tokens <= 0) {
        // Ne rien faire, le bouton est désactivé
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
        
        // Incrémenter les compteurs d'effets basés sur les rolls
        for (let effectType in rollBasedEffects) {
            rollBasedEffects[effectType].rollsUsed++;
            if (rollBasedEffects[effectType].rollsUsed >= rollBasedEffects[effectType].rollLimit) {
                // Effet terminé
                delete rollBasedEffects[effectType];
                updateActiveEffects();
                showCraftMessage("Effet basé sur les rolls terminé", "info");
            }
        }
    
    // Sauvegarder immédiatement le compteur
    saveCollection();

    // Simuler le roll
    setTimeout(() => {
        let winners = [];

        for (let item of items) {
            if (!item.rollable) continue;

            // bonus de luck seulement sur les objets rares
            let rarityFactor = Math.log10(item.chance + 1);

            let effectiveChance = item.chance / (1 + (luck - 1) * rarityFactor * 0.25);

            let roll = Math.floor(Math.random() * effectiveChance) + 1;

            if (roll === 1) {
                winners.push(item);
            }
        }

        let selected;
        if (winners.length === 0) {
            // Ne choisir que parmi les cartes rollable:true
            const rollableItems = items.filter(item => item.rollable === true);
            selected = rollableItems[Math.floor(Math.random() * rollableItems.length)];
        } else {
            selected = winners.reduce((a, b) => (a.chance > b.chance ? a : b));
        }
        // Gestion du compteur Sweet (Sugar Rush) : 
        let isSweet = selected.specialTag === "Sweet";
        if (isSweet) {
           sugarRushCounter += sugarRushBulk;
        } else {
           sugarRushCounter = Math.max(0, sugarRushCounter - 1);
        }
        updateSugarRushDisplay();

        // Gold ou Rainbow ou Shiny ou Nuclear
        let type = '';
        let goldChance = 10 / luck;
        let rainbowChance = 100 / luck;
        let shinyChance = 1000 / luck;
        let nuclearChance = 10000 / luck;
        let isGold = Math.floor(Math.random() * goldChance) === 0;
        let isRainbow = isGold && Math.floor(Math.random() * rainbowChance) === 0;
        let isShiny = isRainbow && Math.floor(Math.random() * shinyChance) === 0;
        let isNuclear = isShiny && Math.floor(Math.random() * nuclearChance) === 0;
        if (isGold) {
            type = 'Gold';
            if (isRainbow) {
                type = 'Rainbow';
                if (isShiny) {
                    type = 'Shiny';
                    if (isNuclear) {
                        type = 'Nuclear';
                    }
                }
            }
        }
        let displayName = selected.name + (type ? ` (${type})` : '');
        let chanceDisplay = type === 'Nuclear' ? selected.chance * 10000 : type === 'Shiny' ? selected.chance * 1000 : type === 'Rainbow' ? selected.chance * 100 : type === 'Gold' ? selected.chance * 10 : selected.chance;

        // XP gain: sqrt(roll chance)
        let xpGain = Math.floor(Math.sqrt(chanceDisplay));
        gainXp(xpGain);

        // Cacher l'animation et afficher la carte
        hideRollAnimation();

        // Mettre à jour l'aperçu de la carte
        updateCardPreview({ selected, type, displayName, chanceDisplay });

        (function(){
            // Calcul de la rareté
            let thisRarity = '';
            if (chanceDisplay < 10) thisRarity = 'common';
            else if (chanceDisplay < 100) thisRarity = 'uncommon';
            else if (chanceDisplay < 1000) thisRarity = 'rare';
            else if (chanceDisplay < 10000) thisRarity = 'epic';
            else if (chanceDisplay < 100000) thisRarity = 'legendary';
            else thisRarity = 'mythic';
            let idx = rarityOrderMap[thisRarity];
            let minIdx = loadRarityBarSetting();
            if (idx >= minIdx) {
                let audio = document.getElementById('notification-sound');
                if(audio) { audio.currentTime = 0; audio.play(); }
            }
        })();

        // Comptage
        if (!collection[displayName]) {
            collection[displayName] = 1;
        } else {
            collection[displayName]++;
        }
        
        saveCollection();
        updateCollection();
        updateInventoryStats();
        updateCraftButtons();
        updateUnlockables();

        // Réactiver le bouton
        rollButton.disabled = false;
        isRolling = false;
    }, rollDelay);
}

function updateCollection() {
    const ul = document.getElementById('collection-list');
    ul.innerHTML = '';

    // Trier chaque carte indépendamment, sans regrouper les variantes
    let rarityOrder = chance => (chance < 10 ? 0 : chance < 100 ? 1 : chance < 1000 ? 2 : chance < 10000 ? 3 : chance < 100000 ? 4 : 5);
    let typeOrder = t => t === 'Nuclear' ? 4 : t === 'Shiny' ? 3 : t === 'Rainbow' ? 2 : t === 'Gold' ? 1 : 0;
    let sortedNames = Object.keys(collection).filter(name => {
        let type = name.endsWith('(Nuclear)') ? 'Nuclear' : name.endsWith('(Shiny)') ? 'Shiny' : name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
        let base = type ? name.replace(` (${type})`, '') : name;
        return !!items.find(i => i.name === base);
    }).sort((a, b) => {
        let typeA = a.endsWith('(Nuclear)') ? 'Nuclear' : a.endsWith('(Shiny)') ? 'Shiny' : a.endsWith('(Rainbow)') ? 'Rainbow' : a.endsWith('(Gold)') ? 'Gold' : '';
        let typeB = b.endsWith('(Nuclear)') ? 'Nuclear' : b.endsWith('(Shiny)') ? 'Shiny' : b.endsWith('(Rainbow)') ? 'Rainbow' : b.endsWith('(Gold)') ? 'Gold' : '';
        let baseA = typeA ? a.replace(` (${typeA})`, '') : a;
        let baseB = typeB ? b.replace(` (${typeB})`, '') : b;
        let itemA = items.find(i => i.name === baseA);
        let itemB = items.find(i => i.name === baseB);
        let chanceA = typeA === 'Nuclear' ? itemA.chance * 10000 : typeA === 'Shiny' ? itemA.chance * 1000 : typeA === 'Rainbow' ? itemA.chance * 100 : typeA === 'Gold' ? itemA.chance * 10 : itemA.chance;
        let chanceB = typeB === 'Nuclear' ? itemB.chance * 10000 : typeB === 'Shiny' ? itemB.chance * 1000 : typeB === 'Rainbow' ? itemB.chance * 100 : typeB === 'Gold' ? itemB.chance * 10 : itemB.chance;
        // Par rareté affichée
        let rarityA = rarityOrder(chanceA);
        let rarityB = rarityOrder(chanceB);
        if (rarityA !== rarityB) return rarityA - rarityB;
        // Par chance affichée croissante
        if (chanceA !== chanceB) return chanceA - chanceB;
        // Par nom complet (y compris le tag)
        return a.localeCompare(b);
    });

    for (let name of sortedNames) {
        let type = name.endsWith('(Nuclear)') ? 'Nuclear' : name.endsWith('(Shiny)') ? 'Shiny' : name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
        let baseName = type ? name.replace(` (${type})`, '') : name;
        let item = items.find(i => i.name === baseName);
        let chanceDisplay = type === 'Nuclear' ? item.chance * 10000 : type === 'Shiny' ? item.chance * 1000 : type === 'Rainbow' ? item.chance * 100 : type === 'Gold' ? item.chance * 10 : item.chance;
        let displayName = baseName;
        let goldTag = getGoldTag(type);
        let specialTag = getSpecialTag(item);
        let rarityTag = getRarityTag(chanceDisplay);
        let imgSrc = `Cards-Icons/${baseName}.png`;
        let cardText = `<span class=\"name-only\">${displayName}</span>`;
        let cardDetail = `<span class=\"detail\">${displayName}<br>1 in ${chanceDisplay}<br>×${collection[name]}</span>`;
        // Déterminer la classe de rareté pour le dos
        let rarityClass = '';
        if (type === 'Nuclear') rarityClass = 'rarity-nuclear';
        else if (type === 'Rainbow') rarityClass = 'rarity-rainbow';
        else if (type === 'Gold') rarityClass = 'rarity-gold';
        else if (type === 'Shiny') rarityClass = 'rarity-shiny';
        // Les autres n'ont pas de classe spéciale (dos gris par défaut)
        let li = document.createElement('li');
        li.innerHTML = `
            <div class=\"card-inventory\">
                <div class=\"card-flip-inner\">
                    <div class=\"card-flip-front\">
                        <span class=\"rarity-tag-container\">${goldTag}${specialTag}</span>
                        <img class=\"card-img\" src=\"${imgSrc}\" alt=\"${displayName}\">
                        <span class=\"card-text\">${cardText}</span>
                    </div>
                    <div class=\"card-flip-back${rarityClass ? ' ' + rarityClass : ''}\">\n
                    <span class=\"card-text text-shown\">${cardDetail}</span>
                    <span class=\"rarity-tag-container rarity-hidden\">${rarityTag}</span>
                    \n</div>
                </div>
            </div>
        `;
        ul.appendChild(li);
        // Attacher les events long-press directement (pas besoin de setTimeout)
        const cardDiv = li.querySelector('.card-inventory');
        if (cardDiv) {
            cardDiv.style.animation = 'none';
            let pressTimer = null;
            let startX = 0, startY = 0;
                const showPopup = () => {
                    let overlay = document.getElementById('blur-overlay');
                    let popup = document.getElementById('card-info-popup');
                    if (!popup) {
                        popup = document.createElement('div');
                        popup.id = 'card-info-popup';
                        popup.style.position = 'fixed';
                        popup.style.top = '50%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translate(-50%,-50%)';
                        popup.style.fontSize = '1.2em';
                        popup.style.color = '#3498db';
                        popup.style.background = 'rgba(255,255,255,0.97)';
                        popup.style.padding = '2em 2.5em';
                        popup.style.borderRadius = '25px';
                        popup.style.zIndex = '2001';
                        popup.style.textAlign = 'center';
                        popup.style.boxShadow = '0 8px 40px rgba(52,152,219,0.15)';
                        popup.style.display = 'none';
                        document.body.appendChild(popup);
                    }
                    popup.innerHTML = `
                        <div style='width:100%;display:flex;flex-direction:column;align-items:center;'>
                            <div style='width:100%;height:120px;display:flex;align-items:center;justify-content:center;border-radius:18px 18px 0 0;'>
                                <img src='${imgSrc}' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
                            </div>
                            <div style='padding:1.2em 0.5em 0.5em 0.5em;width:100%;text-align:center;'>
                                <b style='font-size:1.25em;'>${displayName}</b><br>
                                ${rarityTag}<br>${goldTag}${specialTag}<br>
                                <button id='compressor-btn' style='margin-top:1em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#3498db;color:white;border:none;cursor:pointer;'>Compressor</button>
                                <button id='decompressor-btn' style='margin-left:0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#16a085;color:white;border:none;cursor:pointer;'>Decompressor</button>
                                <button id='diamond-press-btn' style='margin-left:0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#9b59b6;color:white;border:none;cursor:pointer;'>💎 Press</button><br>
                                <span style='font-size:0.9em;color:#888'>(Tap anywhere to close)</span>
                            </div>
                        </div>`;
                    overlay.style.display = 'block';
                    popup.style.display = 'block';
                    let groupeDisplay = document.createElement('div')
                    groupeDisplay.id = `groupe-display`
                    groupeDisplay.style.background = "none"
                    popup.appendChild(groupeDisplay)
                    for (let groupe of cardsGroupes) {
                        for (let card of groupe.content) {
                            if (card === baseName) {
                                let div = document.createElement('div')
                                div.innerText = groupe.name
                                div.style.background = groupe.color
                                div.style.color = "#fff"
                                div.style.border = "none"
                                div.style.width = "5em"
                                div.style.display = "inline-block"
                                div.style.padding = "2px 6px"
                                div.style.borderRadius = "8px"
                                div.style.fontSize = "0.7em"
                                div.style.fontWeight = "bold"
                                div.style.textTransform = "uppercase"
                                div.style.marginLeft = "2px"
                                div.style.cursor = "pointer"
                                div.title = `Voir le groupe ${groupe.name}`
                                div.onclick = (e) => {
                                    e.stopPropagation();
                                    showGroupPopup(groupe);
                                }
                                groupeDisplay.appendChild(div)
                            }
                        }
                    }
                    const closePopup = () => {
                        overlay.style.display = 'none';
                        popup.style.display = 'none';
                        let comp = document.getElementById('compressor-popup');
                        if (comp) comp.style.display = 'none';
                    };
                    overlay.onclick = closePopup;
                    popup.onclick = closePopup;
                    // Prevent closing when clicking compressor button
                    document.getElementById('compressor-btn').onclick = (e) => {
                        e.stopPropagation();
                        showCompressorMenu(baseName, type);
                    };
        var decompressBtn = document.getElementById('decompressor-btn');
        if (decompressBtn) decompressBtn.onclick = (e) => {
            e.stopPropagation();
            showDecompressorMenu(baseName, type);
        };
        var diamondPressBtn = document.getElementById('diamond-press-btn');
        if (diamondPressBtn) {
            const itemForDiamond = items.find(i => i.name === baseName);
            if (itemForDiamond) {
                let chanceForDiamond = itemForDiamond.chance;
                if (type === 'Nuclear') chanceForDiamond *= 10000;
                else if (type === 'Shiny') chanceForDiamond *= 1000;
                else if (type === 'Rainbow') chanceForDiamond *= 100;
                else if (type === 'Gold') chanceForDiamond *= 10;
                const gain = Math.floor(Math.sqrt(chanceForDiamond));
                const gainWithMulti = Math.floor(gain * (1 + diamondUpgradeLevel * 0.5));
                diamondPressBtn.innerHTML = `💎 Press (+${gainWithMulti})`;
                if (owned <= 0) {
                    diamondPressBtn.disabled = true;
                    diamondPressBtn.style.opacity = '0.5';
                    diamondPressBtn.style.cursor = 'not-allowed';
                } else {
                    diamondPressBtn.onclick = (e) => {
                        e.stopPropagation();
                        const cardKey = type ? `${baseName} (${type})` : baseName;
                        const cur = collection[cardKey] || 0;
                        if (cur <= 0) return;
                        diamonds += Math.floor(gain * (1 + diamondUpgradeLevel * 0.5));
                        collection[cardKey]--;
                        if (collection[cardKey] <= 0) delete collection[cardKey];
                        gainXp(gain);
                        saveCollection(); updateCollection(); updateInventoryStats(); updateCraftButtons(); updateDiamondsDisplay();
                        // Mettre à jour le compteur dans le popup
                        const newOwned = collection[cardKey] || 0;
                        if (newOwned <= 0) {
                            diamondPressBtn.disabled = true;
                            diamondPressBtn.style.opacity = '0.5';
                            diamondPressBtn.style.cursor = 'not-allowed';
                        }
                        // Update label
                        const updatedGainWithMulti = Math.floor(gain * (1 + diamondUpgradeLevel * 0.5));
                        diamondPressBtn.innerHTML = `💎 Press (+${updatedGainWithMulti})`;
                    };
                }
            }
        }
    
                    function showCompressorMenu(cardName, cardType) {
                        let comp = document.getElementById('compressor-popup');
                        if (!comp) {
                            comp = document.createElement('div');
                            comp.id = 'compressor-popup';
                            comp.style.position = 'fixed';
                            comp.style.top = '50%';
                            comp.style.left = '50%';
                            comp.style.transform = 'translate(-50%,-50%)';
                            comp.style.fontSize = '1.1em';
                            comp.style.color = '#222';
                            comp.style.background = 'rgba(255,255,255,0.99)';
                            comp.style.padding = '2em 2.5em';
                            comp.style.borderRadius = '25px';
                            comp.style.zIndex = '2002';
                            comp.style.textAlign = 'center';
                            comp.style.boxShadow = '0 8px 40px rgba(52,152,219,0.15)';
                            comp.style.minWidth = '220px';
                            comp.style.maxWidth = '90vw';
                            comp.style.maxHeight = '80vh';
                            comp.style.overflowY = 'auto';
                            comp.style.display = 'none';
                            document.body.appendChild(comp);
                        }
                        // Determine compression rules
                        let nextType = '', needed = 25, canCompress = 0, owned = 0, resultName = '', resultType = '';
                        if (!cardType) { nextType = 'Gold'; resultType = 'Gold'; resultName = cardName + ' (Gold)'; }
                        else if (cardType === 'Gold') { nextType = 'Rainbow'; resultType = 'Rainbow'; resultName = cardName + ' (Rainbow)'; }
                        else if (cardType === 'Rainbow') { nextType = 'Shiny'; resultType = 'Shiny'; resultName = cardName + ' (Shiny)'; }
                        else if (cardType === 'Shiny') { nextType = 'Nuclear'; resultType = 'Nuclear'; resultName = cardName + ' (Nuclear)'; }
                        else { nextType = null; }
                        owned = collection[cardType ? cardName + ' (' + cardType + ')' : cardName] || 0;
                        if (nextType) canCompress = Math.floor(owned / needed);
                        comp.innerHTML = `
                            <div style='width:100%;display:flex;flex-direction:column;align-items:center;'>
                                <div style='width:100%;height:120px;display:flex;align-items:center;justify-content:center;border-radius:18px 18px 0 0;'>
                                    <img src='Cards-Icons/${cardName}.png' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
                                </div>
                                <div style='padding:1.2em 0.5em 0.5em 0.5em;width:100%;text-align:center;'>
                                    <b style='font-size:1.15em;'>${cardName}${cardType ? ' ('+cardType+')' : ''}</b><br>
                                    <span style='color:#888;'>You own: ${owned}</span><br>
                                    ${nextType ? `<span style='color:#3498db;'>${needed} → 1 ${nextType}</span><br>` : '<span style="color:#e74c3c;">Max rarity</span><br>'}
                                    ${nextType && canCompress > 0 ? `<button id='do-compress-btn' style='margin:1em 0.5em 0.5em 0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#27ae60;color:white;border:none;cursor:pointer;'>Compress ${needed} → 1 ${nextType} (${canCompress}x)</button>` : ''}
                                    ${nextType && canCompress > 0 ? `<button id='do-compress-all-btn' style='margin:0.5em 0.5em 0.5em 0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#e67e22;color:white;border:none;cursor:pointer;'>Compress All (${canCompress}x)</button>` : ''}
                                    <button id='cancel-compress-btn' style='margin-top:0.7em;padding:0.4em 1.2em;font-size:0.95em;border-radius:8px;background:#aaa;color:white;border:none;cursor:pointer;'>Cancel</button>
                                </div>
                            </div>
                        `;
                        comp.style.display = 'block';
                        popup.style.display = 'none';
                        // Cancel button
                        document.getElementById('cancel-compress-btn').onclick = function(ev) {
                            ev.stopPropagation();
                            comp.style.display = 'none';
                            popup.style.display = 'block';
                        };
                        // Compression logic
                        if (nextType && canCompress > 0) {
                            document.getElementById('do-compress-btn').onclick = function(ev) {
                                ev.stopPropagation();
                                // Remove cards
                                collection[cardType ? cardName + ' (' + cardType + ')' : cardName] -= needed;
                                if (collection[cardType ? cardName + ' (' + cardType + ')' : cardName] <= 0) delete collection[cardType ? cardName + ' (' + cardType + ')' : cardName];
                                // Add new card
                                if (!collection[resultName]) collection[resultName] = 0;
                                collection[resultName] += 1;
                                saveCollection();
                                updateCollection();
                                updateCraftButtons();
                                // Refresh compressor menu
                                showCompressorMenu(cardName, cardType);
                            };
                            // Compress All logic
                            document.getElementById('do-compress-all-btn').onclick = function(ev) {
                                ev.stopPropagation();
                                let totalCompress = canCompress;
                                // Remove all possible
                                collection[cardType ? cardName + ' (' + cardType + ')' : cardName] -= needed * totalCompress;
                                if (collection[cardType ? cardName + ' (' + cardType + ')' : cardName] <= 0) delete collection[cardType ? cardName + ' (' + cardType + ')' : cardName];
                                // Add all new cards
                                if (!collection[resultName]) collection[resultName] = 0;
                                collection[resultName] += totalCompress;
                                saveCollection();
                                updateCollection();
                                updateCraftButtons();
                                // Refresh compressor menu
                                showCompressorMenu(cardName, cardType);
                            };
                        }
                        // Prevent closing compressor by clicking inside
                        comp.onclick = function(ev) { ev.stopPropagation(); };
                        overlay.onclick = function() {
                            comp.style.display = 'none';
                            overlay.style.display = 'none';
                            popup.style.display = 'none';
                        };
                    }
                };
                cardDiv.addEventListener('mousedown', (e) => {
                    startX = e.clientX; startY = e.clientY;
                    pressTimer = setTimeout(showPopup, 1000);
                });
                cardDiv.addEventListener('mouseup', () => {
                    clearTimeout(pressTimer);
                });
                cardDiv.addEventListener('mouseleave', () => {
                    clearTimeout(pressTimer);
                });
                // Touch support
                cardDiv.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 1) {
                        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
                        pressTimer = setTimeout(showPopup, 500);
                    }
                });
                cardDiv.addEventListener('touchend', () => {
                    clearTimeout(pressTimer);
                });
                cardDiv.addEventListener('touchmove', (e) => {
                    if (e.touches.length === 1) {
                        const dx = Math.abs(e.touches[0].clientX - startX);
                        const dy = Math.abs(e.touches[0].clientY - startY);
                        if (dx > 10 || dy > 10) clearTimeout(pressTimer);
                    }
                });
        }
    }

    if (window.updateCraftButtons) window.updateCraftButtons();
}

function showDecompressorMenu(cardName, cardType) {
    let comp = document.getElementById('compressor-popup');
    if (!comp) {
        comp = document.createElement('div');
        comp.id = 'compressor-popup';
        comp.style.position = 'fixed';
        comp.style.top = '50%';
        comp.style.left = '50%';
        comp.style.transform = 'translate(-50%,-50%)';
        comp.style.fontSize = '1.1em';
        comp.style.color = '#222';
        comp.style.background = 'rgba(255,255,255,0.99)';
        comp.style.padding = '2em 2.5em';
        comp.style.borderRadius = '25px';
        comp.style.zIndex = '2002';
        comp.style.textAlign = 'center';
        comp.style.boxShadow = '0 8px 40px rgba(52,152,219,0.15)';
        comp.style.minWidth = '220px';
        comp.style.maxWidth = '90vw';
        comp.style.maxHeight = '80vh';
        comp.style.overflowY = 'auto';
        comp.style.display = 'none';
        document.body.appendChild(comp);
    }
    let prevType = '', decompressQty = 5, resultName = '', owned = 0;
    if (cardType === 'Gold')      { prevType = ''; resultName = cardName; }
    else if (cardType === 'Rainbow') { prevType = 'Gold'; resultName = cardName + ' (Gold)'; }
    else if (cardType === 'Shiny')   { prevType = 'Rainbow'; resultName = cardName + ' (Rainbow)'; }
    else if (cardType === 'Nuclear') { prevType = 'Shiny'; resultName = cardName + ' (Shiny)'; }
    else {
        comp.innerHTML = "<b>Pas de rareté supérieure à décompresser.</b>";
        comp.style.display = 'block';
        return;
    }
    owned = collection[cardType ? cardName + ' (' + cardType + ')' : cardName] || 0;
    comp.innerHTML = `
        <div style='width:100%;display:flex;flex-direction:column;align-items:center;'>
            <div style='width:100%;height:120px;display:flex;align-items:center;justify-content:center;border-radius:18px 18px 0 0;'>
                <img src='Cards-Icons/${cardName}.png' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
            </div>
            <div style='padding:1.2em 0.5em 0.5em 0.5em;width:100%;text-align:center;'>
                <b style='font-size:1.15em;'>${cardName}${cardType ? ' ('+cardType+')' : ''}</b><br>
                <span style='color:#888;'>You own: ${owned}</span><br>
                <span style='color:#16a085;'>1 → ${decompressQty} ${resultName}</span><br>
                ${(owned > 0) ? `<button id='do-decompress-btn' style='margin:1em 0.5em 0.5em 0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#16a085;color:white;border:none;cursor:pointer;'>Decompress 1 → ${decompressQty} (${resultName})</button>` : ''}
                ${(owned > 0) ? `<button id='do-decompress-all-btn' style='margin:0.5em 0.5em 0.5em 0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#2980b9;color:white;border:none;cursor:pointer;'>Decompress All (${owned} → ${owned*decompressQty})</button>` : ''}
                <button id='cancel-decompress-btn' style='margin-top:0.7em;padding:0.4em 1.2em;font-size:0.95em;border-radius:8px;background:#aaa;color:white;border:none;cursor:pointer;'>Cancel</button>
            </div>
        </div>
    `;
    comp.style.display = 'block';
    let popup = document.getElementById('card-info-popup');
    if (popup) popup.style.display = 'none';

    // Cancel button
    document.getElementById('cancel-decompress-btn').onclick = function(ev) {
        ev.stopPropagation();
        comp.style.display = 'none';
        if (popup) popup.style.display = 'block';
    };

    // Decompress One
    if (owned > 0) {
        document.getElementById('do-decompress-btn').onclick = function(ev) {
            ev.stopPropagation();
            // Retirer 1 carte rare
            collection[cardType ? cardName + ' (' + cardType + ')' : cardName] -= 1;
            if (collection[cardType ? cardName + ' (' + cardType + ')' : cardName] <= 0) delete collection[cardType ? cardName + ' (' + cardType + ')' : cardName];
            // Ajouter 5 cartes de rareté inférieure
            if (!collection[resultName]) collection[resultName] = 0;
            collection[resultName] += decompressQty;
            saveCollection();
            updateCollection();
            updateCraftButtons();
            showDecompressorMenu(cardName, cardType); // refresh
        };
        // Decompress All
        document.getElementById('do-decompress-all-btn').onclick = function(ev) {
            ev.stopPropagation();
            let total = owned;
            // Retirer toutes les cartes rares
            collection[cardType ? cardName + ' (' + cardType + ')' : cardName] -= total;
            if (collection[cardType ? cardName + ' (' + cardType + ')' : cardName] <= 0) delete collection[cardType ? cardName + ' (' + cardType + ')' : cardName];
            // Ajouter (owned*decompressQty) cartes de rareté inférieure
            if (!collection[resultName]) collection[resultName] = 0;
            collection[resultName] += total * decompressQty;
            saveCollection();
            updateCollection();
            updateCraftButtons();
            showDecompressorMenu(cardName, cardType); // refresh
        };
    }
    // Empêche la fermeture du menu en cliquant dedans
    comp.onclick = function(ev) { ev.stopPropagation(); };
    let overlay = document.getElementById('blur-overlay');
    overlay.onclick = function() {
        comp.style.display = 'none';
        if (popup) popup.style.display = 'none';
        overlay.style.display = 'none';
    };
}

// Version globale pour le menu Press : ouvre uniquement l'UI de compresseur
function showGroupPopup(groupe) {
    const overlay = document.getElementById('blur-overlay');
    let popup = document.getElementById('group-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'group-popup';
        popup.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.98);
            border-radius: 20px;
            z-index: 2003;
            padding: 1.5em;
            box-shadow: 0 8px 40px rgba(0,0,0,0.2);
            max-width: 90vw; min-width: 300px;
            max-height: 80vh; overflow-y: auto;
            display: none;
        `;
        document.body.appendChild(popup);
    }

    // Compter les cartes possédées dans le groupe
    const owned = groupe.content.filter(name => {
        return Object.keys(collection).some(k => {
            const base = k.replace(/ \((Gold|Rainbow|Shiny)\)$/, '');
            return base === name && collection[k] > 0;
        });
    }).length;

    popup.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.6em;margin-bottom:1em;">
            <div style="background:${groupe.color};color:#fff;padding:4px 12px;border-radius:8px;font-weight:bold;font-size:1em;text-transform:uppercase;">
                ${groupe.name}
            </div>
            <span style="color:#7f8c8d;font-size:0.9em;">${owned} / ${groupe.content.length} cartes</span>
            <button id="close-group-popup" style="margin-left:auto;background:none;border:none;font-size:1.4em;cursor:pointer;color:#aaa;line-height:1;">&times;</button>
        </div>
        <div id="group-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:0.7em;"></div>
    `;

    const grid = popup.querySelector('#group-cards-grid');
    for (const cardName of groupe.content) {
        const item = items.find(i => i.name === cardName);
        if (!item) continue;

        // Trouver toutes les variantes possédées
        const variants = ['', 'Gold', 'Rainbow', 'Shiny', 'Nuclear'].map(type => {
            const key = type ? `${cardName} (${type})` : cardName;
            return { type, key, qty: collection[key] || 0 };
        }).filter(v => v.qty > 0);

        const totalOwned = variants.reduce((s, v) => s + v.qty, 0);
        const isOwned = totalOwned > 0;

        const card = document.createElement('div');
        card.style.cssText = `
            background: ${isOwned ? '#f8f9fa' : '#ecf0f1'};
            border: 2px solid ${isOwned ? groupe.color : '#bdc3c7'};
            border-radius: 12px;
            padding: 0.5em;
            text-align: center;
            opacity: ${isOwned ? '1' : '0.45'};
            transition: transform 0.1s;
        `;

        const rarityTag = getRarityTag(item.chance);
        const variantText = variants.length > 0
            ? variants.map(v => `${v.type || 'Normal'}: ×${v.qty}`).join('<br>')
            : '—';

        card.innerHTML = `
            <img src="Cards-Icons/${cardName}.png" alt="${cardName}"
                style="width:54px;height:54px;object-fit:contain;border-radius:8px;display:block;margin:0 auto 0.3em auto;">
            <div style="font-size:0.78em;font-weight:bold;color:#2c3e50;margin-bottom:0.2em;">${cardName}</div>
            <div style="font-size:0.7em;color:#7f8c8d;">1 in ${item.chance}</div>
            <div style="margin:0.2em 0;">${rarityTag}</div>
            ${isOwned ? `<div style="font-size:0.68em;color:#27ae60;margin-top:0.2em;">${variantText}</div>` : `<div style="font-size:0.68em;color:#bdc3c7;margin-top:0.2em;">Non obtenu</div>`}
        `;
        grid.appendChild(card);
    }

    overlay.style.display = 'block';
    popup.style.display = 'block';

    const close = () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        // Fermer aussi le popup de carte parent s'il est ouvert
        const cardPopup = document.getElementById('card-info-popup');
        if (cardPopup) cardPopup.style.display = 'none';
    };

    popup.querySelector('#close-group-popup').onclick = (e) => { e.stopPropagation(); close(); };
    overlay.onclick = close;
    popup.onclick = (e) => e.stopPropagation();
}

function showCompressorFromPress(cardName, cardType) {
    let comp = document.getElementById('compressor-popup');
    if (!comp) {
        comp = document.createElement('div');
        comp.id = 'compressor-popup';
        comp.style.position = 'fixed';
        comp.style.top = '50%';
        comp.style.left = '50%';
        comp.style.transform = 'translate(-50%,-50%)';
        comp.style.fontSize = '1.1em';
        comp.style.color = '#222';
        comp.style.background = 'rgba(255,255,255,0.99)';
        comp.style.padding = '2em 2.5em';
        comp.style.borderRadius = '25px';
        comp.style.zIndex = '2002';
        comp.style.textAlign = 'center';
        comp.style.boxShadow = '0 8px 40px rgba(52,152,219,0.15)';
        comp.style.minWidth = '220px';
        comp.style.maxWidth = '90vw';
        comp.style.maxHeight = '80vh';
        comp.style.overflowY = 'auto';
        comp.style.display = 'none';
        document.body.appendChild(comp);
    }
    // Règles de compression
    let nextType = '', needed = 25, canCompress = 0, owned = 0, resultName = '', resultType = '';
    if (!cardType) {
        nextType = 'Gold'; resultType = 'Gold'; resultName = cardName + ' (Gold)';
    } else if (cardType === 'Gold') {
        nextType = 'Rainbow'; resultType = 'Rainbow'; resultName = cardName + ' (Rainbow)';
    } else if (cardType === 'Rainbow') {
        nextType = 'Shiny'; resultType = 'Shiny'; resultName = cardName + ' (Shiny)';
    } else if (cardType === 'Shiny') {
        nextType = 'Nuclear'; resultType = 'Nuclear'; resultName = cardName + ' (Nuclear)';
    } else {
        nextType = null;
    }
    const sourceKey = cardType ? cardName + ' (' + cardType + ')' : cardName;
    owned = collection[sourceKey] || 0;
    if (nextType) canCompress = Math.floor(owned / needed);

    comp.innerHTML = `
        <div style='width:100%;display:flex;flex-direction:column;align-items:center;'>
            <div style='width:100%;height:120px;display:flex;align-items:center;justify-content:center;border-radius:18px 18px 0 0;'>
                <img src='Cards-Icons/${cardName}.png' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
            </div>
            <div style='padding:1.2em 0.5em 0.5em 0.5em;width:100%;text-align:center;'>
                <b style='font-size:1.15em;'>${cardName}${cardType ? ' ('+cardType+')' : ''}</b><br>
                <span style='color:#888;'>You own: ${owned}</span><br>
                ${nextType ? `<span style='color:#3498db;'>${needed} → 1 ${nextType}</span><br>` : '<span style="color:#e74c3c;">Max rarity</span><br>'}
                ${nextType && canCompress > 0 ? `<button id='do-compress-btn' style='margin:1em 0.5em 0.5em 0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#27ae60;color:white;border:none;cursor:pointer;'>Compress ${needed} → 1 ${nextType} (${canCompress}x)</button>` : ''}
                ${nextType && canCompress > 0 ? `<button id='do-compress-all-btn' style='margin:0.5em 0.5em 0.5em 0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#e67e22;color:white;border:none;cursor:pointer;'>Compress All (${canCompress}x)</button>` : ''}
                <button id='cancel-compress-btn' style='margin-top:0.7em;padding:0.4em 1.2em;font-size:0.95em;border-radius:8px;background:#aaa;color:white;border:none;cursor:pointer;'>Cancel</button>
            </div>
        </div>
    `;
    comp.style.display = 'block';
    const overlay = document.getElementById('blur-overlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
    // Bouton Cancel
    const cancelBtn = document.getElementById('cancel-compress-btn');
    if (cancelBtn) {
        cancelBtn.onclick = function(ev) {
            ev.stopPropagation();
            comp.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
        };
    }
    // Logique de compression
    if (nextType && canCompress > 0) {
        const doOne = document.getElementById('do-compress-btn');
        const doAll = document.getElementById('do-compress-all-btn');
        if (doOne) {
            doOne.onclick = function(ev) {
                ev.stopPropagation();
                collection[sourceKey] -= needed;
                if (collection[sourceKey] <= 0) delete collection[sourceKey];
                if (!collection[resultName]) collection[resultName] = 0;
                collection[resultName] += 1;
                saveCollection();
                updateCollection();
                updateCraftButtons();
                showCompressorFromPress(cardName, cardType);
            };
        }
        if (doAll) {
            doAll.onclick = function(ev) {
                ev.stopPropagation();
                const totalCompress = canCompress;
                collection[sourceKey] -= needed * totalCompress;
                if (collection[sourceKey] <= 0) delete collection[sourceKey];
                if (!collection[resultName]) collection[resultName] = 0;
                collection[resultName] += totalCompress;
                saveCollection();
                updateCollection();
                updateCraftButtons();
                showCompressorFromPress(cardName, cardType);
            };
        }
    }
    comp.onclick = function(ev) { ev.stopPropagation(); };
    if (overlay) {
        overlay.onclick = function() {
            comp.style.display = 'none';
            overlay.style.display = 'none';
        };
    }
}

// Sauvegarde l'inventaire dans localStorage
function saveCollection() {
    localStorage.setItem('cards-collection', JSON.stringify(collection));
    localStorage.setItem('cards-potions', JSON.stringify(potionInventory));
    localStorage.setItem('cards-effects', JSON.stringify(activeEffects));
    localStorage.setItem('cards-roll-effects', JSON.stringify(rollBasedEffects));
    localStorage.setItem('cards-rolls', rolls.toString());
    localStorage.setItem('cards-tokens', tokens.toString());
    localStorage.setItem('cards-diamonds', diamonds.toString());
    localStorage.setItem('cards-xp', xp.toString());
    localStorage.setItem('cards-level', level.toString());
    localStorage.setItem('cards-xpNext', xpNext.toString());
    localStorage.setItem('cards-token-upgrade', tokenUpgradeLevel.toString());
    localStorage.setItem('cards-max-token-upgrade', maxTokenUpgradeLevel.toString());
    localStorage.setItem('cards-luck-upgrade', luckUpgradeLevel.toString());
    localStorage.setItem('cards-xp-upgrade', xpUpgradeLevel.toString());
    localStorage.setItem('cards-diamond-upgrade', diamondUpgradeLevel.toString());
}

// Charge l'inventaire depuis localStorage
function loadCollection() {
    const data = localStorage.getItem('cards-collection');
    const potionsData = localStorage.getItem('cards-potions');
    const effectsData = localStorage.getItem('cards-effects');
    const rollsData = localStorage.getItem('cards-rolls');
    const tokensData = localStorage.getItem('cards-tokens');
    const diamondsData = localStorage.getItem('cards-diamonds');
    const xpData = localStorage.getItem('cards-xp');
    const levelData = localStorage.getItem('cards-level');
    const xpNextData = localStorage.getItem('cards-xpNext');
    
    if (data) {
        collection = JSON.parse(data);
    }
    
    if (potionsData) {
        potionInventory = JSON.parse(potionsData);
    }
    
    if (effectsData) {
        activeEffects = JSON.parse(effectsData);
        // Supprimer les effets expirés et reprogrammer la fin des effets encore actifs
        const now = Date.now();
        for (let effectType in activeEffects) {
            const remaining = activeEffects[effectType].endTime - now;
            if (remaining <= 0) {
                delete activeEffects[effectType];
            } else {
                setTimeout(() => removePotionEffect(effectType), remaining);
            }
        }
    }
    
    const rollEffectsData = localStorage.getItem('cards-roll-effects');
    if (rollEffectsData) {
        rollBasedEffects = JSON.parse(rollEffectsData);
    }
    
    if (rollsData) {
        rolls = parseInt(rollsData);
        document.getElementById('rolls-count').innerText = rolls;
    }
    
    if (tokensData) {
        tokens = parseInt(tokensData);
        if (tokens > maxToken) tokens = maxToken;
        if (tokens <= 0) tokens = 1; // Toujours au moins 1 token au démarrage
    } else {
        tokens = 10;
    }

    if (diamondsData) {
        diamonds = parseInt(diamondsData);
    } else {
        diamonds = 0;
    }
    
    if (xpData) {
        xp = parseInt(xpData);
    }
    
    if (levelData) {
        level = parseInt(levelData);
    }
    
    if (xpNextData) {
        xpNext = parseInt(xpNextData);
    }

    const tokenUpgradeData = localStorage.getItem('cards-token-upgrade');
    if (tokenUpgradeData) {
        tokenUpgradeLevel = parseInt(tokenUpgradeData);
        tokenRate = 0.2 + tokenUpgradeLevel * 0.1;
    }

    const maxTokenUpgradeData = localStorage.getItem('cards-max-token-upgrade');
    if (maxTokenUpgradeData) {
        maxTokenUpgradeLevel = parseInt(maxTokenUpgradeData);
        maxToken = BASE_MAX_TOKEN + maxTokenUpgradeLevel * 5;
    }

    const luckUpgradeData = localStorage.getItem('cards-luck-upgrade');
    luckUpgradeLevel = luckUpgradeData !== null ? (parseInt(luckUpgradeData) || 0) : 0;

    const xpUpgradeData = localStorage.getItem('cards-xp-upgrade');
    xpUpgradeLevel = xpUpgradeData !== null ? (parseInt(xpUpgradeData) || 0) : 0;

    const diamondUpgradeData = localStorage.getItem('cards-diamond-upgrade');
    diamondUpgradeLevel = diamondUpgradeData !== null ? (parseInt(diamondUpgradeData) || 0) : 0;
    
    updateTokensDisplay();
    updateDiamondsDisplay();
    updateLevelXpDisplay();
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
    const tokensToAdd = Math.floor(diffSeconds * (0.2 + tokenUpgradeLevel * 0.1) / 10); // 10x plus lent qu'en ligne
    if (tokensToAdd > 0) {
        tokens = Math.min(tokens + tokensToAdd, maxToken);
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
updateCraftButtons();
updatePotionsInventory();
updateActiveEffects();
updateActiveEffectsDisplay();
resetCardPreview();
displayLastConnectionInfo(offlineInfo.tokensToAdd, offlineInfo.diffMinutes, offlineInfo.lastDate);
updateLuck();

// Reprendre la queue de craft si elle était en cours
if (craftingQueue.length > 0) startCraftingInterval();

// Démarrer la mise à jour en temps réel des effets
startRealTimeEffectsUpdate();

// Démarrer la recharge de tokens
startTokenRecharge();
updateTokensDisplay(); // S'assurer que l'état du bouton est correct au démarrage

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

function fillBackground(object, filling) {
    if (Math.round(filling * 10) >= 10) {
        object.className = `gradient-full`;
    } else {
        if (Math.round(filling * 10) <= 0) {
            object.className = `gradient-empty`;
        } else {
            object.className = `gradient-${Math.round(filling * 10)}-10`;
        }
    }
}

function updateSugarRushDisplay() {
	// Supprimer les anciens éléments d'affichage s'ils existent
	const oldSugarRushEffect = document.getElementById('sugar-rush-effect');
	if (oldSugarRushEffect) {
		oldSugarRushEffect.remove();
	}
	const oldSugarRushOverflow = document.getElementById('sugar-rush-overflow');
	if (oldSugarRushOverflow) {
		oldSugarRushOverflow.remove();
	}
	
	if (sugarRushCounter >= sugarRushTrigger + sugarRushMax) {
		sugarRushCounter = sugarRushTrigger + sugarRushMax
	}
    if (sugarRushCounter > 0) {
		if (sugarRushCounter >= sugarRushTrigger) {
            sugarRushMultiplier = sugarRushMaxMultiplier
            updateLuck()
		} else {
            sugarRushMultiplier = 0
            updateLuck()
		}
    } else {
        sugarRushMultiplier = 0
        updateLuck()
    }
    
    // Mettre à jour l'affichage des effets actifs
    updateActiveEffectsDisplay();
}

function startRealTimeEffectsUpdate() {
    if (realTimeEffectsIntervalId !== null) return;
    realTimeEffectsIntervalId = setInterval(() => {
        updateActiveEffectsDisplay();
    }, 1000);
}
updateSugarRushDisplay();

// Gestion du menu paramètres
document.getElementById('settings-btn').onclick = function() {
    document.getElementById('settings-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
};
document.getElementById('close-settings').onclick = function() {
    document.getElementById('settings-modal').classList.remove('open');
    document.body.style.overflow = '';
};
document.getElementById('settings-modal').onclick = function(e) {
    if (e.target === this) {
        this.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// ----- Menu Press (compresseur / décompresseur global) -----
function setPressMode(mode) {
    const modal = document.getElementById('press-modal');
    if (!modal) return;
    const btnCompress = document.getElementById('press-mode-compress');
    const btnDecompress = document.getElementById('press-mode-decompress');
    const btnDiamond = document.getElementById('press-mode-diamond');
    if (btnCompress && btnDecompress && btnDiamond) {
        // reset styles
        [btnCompress, btnDecompress, btnDiamond].forEach(b => {
            b.style.background = '#ecf0f1';
            b.style.color = '#2c3e50';
        });
        if (mode === 'compress') {
            btnCompress.style.background = '#3498db';
            btnCompress.style.color = '#ffffff';
        } else if (mode === 'decompress') {
            btnDecompress.style.background = '#16a085';
            btnDecompress.style.color = '#ffffff';
        } else if (mode === 'diamond') {
            btnDiamond.style.background = '#9b59b6';
            btnDiamond.style.color = '#ffffff';
        }
    }
    modal.setAttribute('data-mode', mode);
    renderPressCardList(mode);
    startPressPreview(mode);
}

function openPressMenu(initialMode) {
    const modal = document.getElementById('press-modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Initialiser les boutons de quantité
    document.querySelectorAll('.press-qty-btn').forEach(btn => {
        const qty = btn.dataset.qty === 'max' ? 'max' : parseInt(btn.dataset.qty);
        btn.classList.toggle('active', qty === pressQty || (btn.dataset.qty === 'max' && pressQty === 'max'));
        btn.onclick = () => {
            pressQty = btn.dataset.qty === 'max' ? 'max' : parseInt(btn.dataset.qty);
            document.querySelectorAll('.press-qty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Mettre à jour le label Keep
            const keepLabel = document.getElementById('press-keep-label');
            if (keepLabel) keepLabel.textContent = pressQty === 'max' ? '0' : pressQty;
            const currentMode = modal.getAttribute('data-mode') || 'compress';
            renderPressCardList(currentMode);
        };
    });

    const keepBox = document.getElementById('press-keep-checkbox');
    if (keepBox) {
        keepBox.checked = pressKeep;
        keepBox.onchange = () => {
            pressKeep = keepBox.checked;
            const currentMode = modal.getAttribute('data-mode') || 'compress';
            renderPressCardList(currentMode);
        };
    }

    // Init label keep
    const keepLabel = document.getElementById('press-keep-label');
    if (keepLabel) keepLabel.textContent = pressQty === 'max' ? '0' : pressQty;

    setPressMode(initialMode || 'compress');
}

function closePressMenu() {
    const modal = document.getElementById('press-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    stopPressPreview();
}

function getPressEntries(mode) {
    const entries = [];
    const keepQty = pressKeep ? (pressQty === 'max' ? 0 : pressQty) : 0;
    for (let name of Object.keys(collection)) {
        let type = '';
        if (name.endsWith('(Nuclear)')) type = 'Nuclear';
        else if (name.endsWith('(Shiny)')) type = 'Shiny';
        else if (name.endsWith('(Rainbow)')) type = 'Rainbow';
        else if (name.endsWith('(Gold)')) type = 'Gold';
        const baseName = type ? name.replace(` (${type})`, '') : name;
        const owned = collection[name] || 0;
        const effectiveOwned = Math.max(0, owned - keepQty);
        const item = items.find(i => i.name === baseName);
        if (!item) continue;
        let chanceDisplay = item.chance;
        if (type === 'Gold') chanceDisplay = item.chance * 10;
        else if (type === 'Rainbow') chanceDisplay = item.chance * 100;
        else if (type === 'Shiny') chanceDisplay = item.chance * 1000;
        else if (type === 'Nuclear') chanceDisplay = item.chance * 10000;
        const rarityRank = chanceDisplay < 10 ? 0
            : chanceDisplay < 100 ? 1
            : chanceDisplay < 1000 ? 2
            : chanceDisplay < 10000 ? 3
            : chanceDisplay < 100000 ? 4
            : 5;
        if (mode === 'compress') {
            let nextType = null;
            if (!type) nextType = 'Gold';
            else if (type === 'Gold') nextType = 'Rainbow';
            else if (type === 'Rainbow') nextType = 'Shiny';
            else if (type === 'Shiny') nextType = 'Nuclear';
            const needed = 25;
            if (!nextType || effectiveOwned < needed) continue;
            entries.push({ name, baseName, type, owned, effectiveOwned, nextType, needed, chanceDisplay, rarityRank });
        } else if (mode === 'decompress') {
            if (!type || (type !== 'Gold' && type !== 'Rainbow' && type !== 'Shiny' && type !== 'Nuclear')) continue;
            if (effectiveOwned <= 0) continue;
            let lowerType = '';
            if (type === 'Gold') lowerType = '';
            else if (type === 'Rainbow') lowerType = 'Gold';
            else if (type === 'Shiny') lowerType = 'Rainbow';
            else if (type === 'Nuclear') lowerType = 'Shiny';
            const resultName = lowerType ? `${baseName} (${lowerType})` : baseName;
            entries.push({ name, baseName, type, owned, effectiveOwned, resultName, chanceDisplay, rarityRank });
        } else if (mode === 'diamond') {
            const diamondsGain = Math.floor(Math.sqrt(chanceDisplay));
            if (diamondsGain <= 0 || effectiveOwned <= 0) continue;
            entries.push({ name, baseName, type, owned, effectiveOwned, diamondsGain, chanceDisplay, rarityRank });
        }
    }
    return entries;
}

function renderPressCardList(mode) {
    const list = document.getElementById('press-card-list');
    const emptyMsg = document.getElementById('press-empty-message');
    if (!list) return;
    list.innerHTML = '';
    if (emptyMsg) {
        emptyMsg.style.display = 'none';
    }

    const entries = getPressEntries(mode === 'diamond' ? 'diamond' : mode);

    if (entries.length === 0) {
        if (emptyMsg) {
            emptyMsg.textContent = mode === 'compress'
                ? "Aucune carte compressable pour l'instant."
                : "Aucune carte décompressable pour l'instant.";
            emptyMsg.style.display = 'block';
        }
        return;
    }

    // Tri d'abord par rareté (Common → Mythic), puis par chance effective, puis par nom
    entries.sort((a, b) => {
        if (a.rarityRank !== b.rarityRank) return a.rarityRank - b.rarityRank;
        if (a.chanceDisplay !== b.chanceDisplay) return a.chanceDisplay - b.chanceDisplay;
        return a.baseName.localeCompare(b.baseName);
    });
    const overlay = document.getElementById('blur-overlay');

    entries.forEach(entry => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:0.4em 0.6em;border-bottom:1px solid rgba(0,0,0,0.05);';

        const left = document.createElement('div');
        left.style.cssText = 'display:flex;align-items:center;gap:0.6em;';

        const img = document.createElement('img');
        img.src = `Cards-Icons/${entry.baseName}.png`;
        img.style.cssText = 'width:32px;height:32px;object-fit:cover;border-radius:6px;';

        const label = document.createElement('div');
        label.innerHTML = `<strong>${entry.baseName}${entry.type ? ' (' + entry.type + ')' : ''}</strong><br><span style="font-size:0.8em;color:#7f8c8d;">×${entry.owned}</span>`;

        left.appendChild(img);
        left.appendChild(label);

        const btn = document.createElement('button');
        btn.style.cssText = 'padding:0.4em 1em;border-radius:8px;border:none;cursor:pointer;font-size:0.9em;font-weight:bold;';

        if (mode === 'compress') {
            const needed = entry.needed;
            // entry.effectiveOwned = owned - keepQty déjà calculé
            const maxTimes = Math.floor(entry.effectiveOwned / needed);
            // Keep coché : presse tout le disponible. Sinon : pressQty = nb de fois
            const times = (pressKeep || pressQty === 'max') ? maxTimes : Math.min(pressQty, maxTimes);
            const canDo = times > 0;
            btn.style.background = canDo ? '#27ae60' : '#bdc3c7';
            btn.style.color = canDo ? '#ffffff' : '#888';
            btn.style.cursor = canDo ? 'pointer' : 'not-allowed';
            btn.textContent = `×${times} (${times * needed} → ${times})`;
            if (canDo) btn.onclick = function() {
                const sourceKey = entry.type ? `${entry.baseName} (${entry.type})` : entry.baseName;
                const resultName = entry.baseName + ' (' + entry.nextType + ')';
                const curOwned = collection[sourceKey] || 0;
                const keepQtyNow = pressKeep ? (pressQty === 'max' ? 0 : pressQty) : 0;
                const effNow = Math.max(0, curOwned - keepQtyNow);
                const actualTimes = (pressKeep || pressQty === 'max')
                    ? Math.floor(effNow / needed)
                    : Math.min(pressQty, Math.floor(effNow / needed));
                if (actualTimes <= 0) return;
                collection[sourceKey] = curOwned - actualTimes * needed;
                if (collection[sourceKey] <= 0) delete collection[sourceKey];
                collection[resultName] = (collection[resultName] || 0) + actualTimes;
                gainXp(Math.floor(Math.sqrt(entry.chanceDisplay)) * actualTimes);
                saveCollection(); updateCollection(); updateInventoryStats(); updateCraftButtons();
                renderPressCardList('compress');
            };
        } else if (mode === 'decompress') {
            const decompQty = 5;
            const maxTimes = entry.effectiveOwned;
            const times = (pressKeep || pressQty === 'max') ? maxTimes : Math.min(pressQty, maxTimes);
            const canDo = times > 0;
            btn.style.background = canDo ? '#16a085' : '#bdc3c7';
            btn.style.color = canDo ? '#ffffff' : '#888';
            btn.style.cursor = canDo ? 'pointer' : 'not-allowed';
            btn.textContent = `×${times} → ${times * decompQty}`;
            if (canDo) btn.onclick = function() {
                const sourceKey = entry.type ? `${entry.baseName} (${entry.type})` : entry.baseName;
                const curOwned = collection[sourceKey] || 0;
                const keepQtyNow = pressKeep ? (pressQty === 'max' ? 0 : pressQty) : 0;
                const effNow = Math.max(0, curOwned - keepQtyNow);
                const actualTimes = (pressKeep || pressQty === 'max') ? effNow : Math.min(pressQty, effNow);
                if (actualTimes <= 0) return;
                collection[sourceKey] = curOwned - actualTimes;
                if (collection[sourceKey] <= 0) delete collection[sourceKey];
                collection[entry.resultName] = (collection[entry.resultName] || 0) + actualTimes * decompQty;
                gainXp(Math.floor(Math.sqrt(entry.chanceDisplay)) * actualTimes);
                saveCollection(); updateCollection(); updateInventoryStats(); updateCraftButtons();
                renderPressCardList('decompress');
            };
        } else if (mode === 'diamond') {
            const gainPer = entry.diamondsGain;
            const maxTimes = entry.effectiveOwned;
            const times = (pressKeep || pressQty === 'max') ? maxTimes : Math.min(pressQty, maxTimes);
            const canDo = times > 0;
            btn.style.background = canDo ? '#9b59b6' : '#bdc3c7';
            btn.style.color = canDo ? '#ffffff' : '#888';
            btn.style.cursor = canDo ? 'pointer' : 'not-allowed';
            btn.textContent = `×${times} (${Math.floor(times * gainPer * (1 + diamondUpgradeLevel * 0.5))}💎)`;
            if (canDo) btn.onclick = function() {
                const curOwned = collection[entry.name] || 0;
                const keepQtyNow = pressKeep ? (pressQty === 'max' ? 0 : pressQty) : 0;
                const effNow = Math.max(0, curOwned - keepQtyNow);
                const actualTimes = (pressKeep || pressQty === 'max') ? effNow : Math.min(pressQty, effNow);
                if (actualTimes <= 0) return;
                diamonds += Math.floor(actualTimes * gainPer * (1 + diamondUpgradeLevel * 0.5));
                collection[entry.name] = curOwned - actualTimes;
                if (collection[entry.name] <= 0) delete collection[entry.name];
                gainXp(Math.floor(Math.sqrt(entry.chanceDisplay)) * actualTimes);
                saveCollection(); updateCollection(); updateInventoryStats(); updateCraftButtons(); updateDiamondsDisplay();
                renderPressCardList('diamond');
            };
        }

        row.appendChild(left);
        row.appendChild(btn);
        list.appendChild(row);
    });
}

function updatePressPreview(mode) {
    const preview = document.getElementById('press-preview');
    if (!preview) return;
    const entries = getPressEntries(mode === 'diamond' ? 'diamond' : mode);
    preview.innerHTML = '';
    if (entries.length === 0) {
        preview.innerHTML = `<span style="color:#7f8c8d;font-size:0.9em;">Aucune combinaison disponible pour l'instant...</span>`;
        return;
    }
    const entry = entries[Math.floor(Math.random() * entries.length)];
    const baseName = entry.baseName;
    const fromType = entry.type || '';

    let leftLabel = '';
    let rightLabel = '';
    let leftType = fromType;
    let rightType = '';
    let leftAmount = 1;
    let rightAmount = 1;

    if (mode === 'compress') {
        leftAmount = entry.needed || 25;
        rightAmount = 1;
        rightType = entry.nextType;
    } else if (mode === 'decompress') {
        leftAmount = 1;
        rightAmount = 5;
        if (entry.type === 'Gold') {
            rightType = '';
        } else if (entry.type === 'Rainbow') {
            rightType = 'Gold';
        } else if (entry.type === 'Shiny') {
            rightType = 'Rainbow';
        }
    } else if (mode === 'diamond') {
        // 1 carte => floor(sqrt(rareté)) diamonds
        leftAmount = 1;
        rightAmount = entry.diamondsGain;
    }

    function formatName(name, type) {
        return type ? `${name} (${type})` : name;
    }

    leftLabel = `${leftAmount}× ${formatName(baseName, leftType)}`;
    rightLabel = mode === 'diamond' ? `${rightAmount} 💎` : `${rightAmount}× ${formatName(baseName, rightType)}`;

    const leftCard = document.createElement('div');
    leftCard.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;';
    leftCard.innerHTML = `
        <div style="width:90px;height:90px;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.15);background:#2c3e50;display:flex;align-items:center;justify-content:center;">
            <img src="Cards-Icons/${baseName}.png" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="margin-top:0.3em;font-size:0.8em;color:#2c3e50;text-align:center;">${leftLabel}</div>
    `;

    const arrow = document.createElement('div');
    arrow.style.cssText = 'font-size:1.4em;color:#2c3e50;';
    arrow.textContent = mode === 'compress' ? '⇒' : (mode === 'decompress' ? '⇐' : '⇒');

    const rightCard = document.createElement('div');
    rightCard.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;';
    if (mode === 'diamond') {
        rightCard.innerHTML = `
            <div style="width:90px;height:90px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.15);background:linear-gradient(135deg,#9b59b6,#6c3483);display:flex;align-items:center;justify-content:center;font-size:2.5em;">
                💎
            </div>
            <div style="margin-top:0.3em;font-size:0.8em;color:#2c3e50;text-align:center;">${rightLabel}</div>
        `;
    } else {
        rightCard.innerHTML = `
            <div style="width:90px;height:90px;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.15);background:#2c3e50;display:flex;align-items:center;justify-content:center;">
                <img src="Cards-Icons/${baseName}.png" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="margin-top:0.3em;font-size:0.8em;color:#2c3e50;text-align:center;">${rightLabel}</div>
        `;
    }

    preview.appendChild(leftCard);
    preview.appendChild(arrow);
    preview.appendChild(rightCard);
}

function startPressPreview(mode) {
    stopPressPreview();
    updatePressPreview(mode);
    pressPreviewIntervalId = setInterval(() => {
        updatePressPreview(mode);
    }, 1000);
}

function stopPressPreview() {
    if (pressPreviewIntervalId !== null) {
        clearInterval(pressPreviewIntervalId);
        pressPreviewIntervalId = null;
    }
}

// Initialisation des événements du menu Press
const pressBtn = document.getElementById('press-btn');
if (pressBtn) {
    pressBtn.onclick = function() {
        openPressMenu('compress');
    };
}
const closePress = document.getElementById('close-press');
if (closePress) {
    closePress.onclick = function() {
        closePressMenu();
    };
}
const pressModal = document.getElementById('press-modal');
if (pressModal) {
    pressModal.addEventListener('click', function(e) {
        if (e.target === pressModal) {
            closePressMenu();
        }
    });
}
const pressModeCompressBtn = document.getElementById('press-mode-compress');
const pressModeDecompressBtn = document.getElementById('press-mode-decompress');
const pressModeDiamondBtn = document.getElementById('press-mode-diamond');
if (pressModeCompressBtn && pressModeDecompressBtn && pressModeDiamondBtn) {
    pressModeCompressBtn.onclick = function(e) {
        e.preventDefault();
        setPressMode('compress');
    };
    pressModeDecompressBtn.onclick = function(e) {
        e.preventDefault();
        setPressMode('decompress');
    };
    pressModeDiamondBtn.onclick = function(e) {
        e.preventDefault();
        setPressMode('diamond');
    };
}

// ----- Raretés utilisées pour la barre -----
const rarityLevels = [
    { key: 'common',    name: 'Common',    class: 'rarity-common',    order: 1 },
    { key: 'uncommon',  name: 'Uncommon',  class: 'rarity-uncommon',  order: 2 },
    { key: 'rare',      name: 'Rare',      class: 'rarity-rare',      order: 3 },
    { key: 'epic',      name: 'Epic',      class: 'rarity-epic',      order: 4 },
    { key: 'legendary', name: 'Legendary', class: 'rarity-legendary', order: 5 },
    { key: 'mythic',    name: 'Mythic',    class: 'rarity-mythic',    order: 6 }
];
const rarityOrderMap = {};
rarityLevels.forEach((r, i) => rarityOrderMap[r.key] = i+1);

// --- Chargement/sauvegarde seuil dans localStorage ---
function loadRarityBarSetting() {
    let idx = localStorage.getItem('rarity-notif-threshold');
    return idx !== null ? parseInt(idx) : 3; // Par défaut "epic"
}
function saveRarityBarSetting(idx) {
    localStorage.setItem('rarity-notif-threshold', idx.toString());
}

// --- Génération de la barre ---
function renderRarityBar() {
    const bar = document.getElementById('rarity-bar');
    bar.innerHTML = '';
    const selectedIdx = loadRarityBarSetting();
    rarityLevels.forEach((r, idx) => {
        const seg = document.createElement('div');
        seg.className = 'rarity-bar-segment'
            + (idx + 1 >= selectedIdx ? ' filled' : '')
            + (idx + 1 === selectedIdx ? ' selected' : '');
        seg.setAttribute('data-idx', idx + 1);
        seg.innerHTML = `<span class="rarity-tag ${r.class}">${r.name}</span>`;
        seg.onclick = function() {
            saveRarityBarSetting(idx + 1);
            renderRarityBar();
        };
        bar.appendChild(seg);
    });
}

function calculateXpNext(level) {
    // Example: next = 50 + 25 * (level-1) * sqrt(level)
    return Math.floor(50 + 25 * (level - 1) * Math.sqrt(level));
}

function gainXp(amount) {
    xp += Math.floor(amount * (1 + xpUpgradeLevel * 0.5));
    let leveledUp = false;
    while (xp >= xpNext) {
        xp -= xpNext;
        level++;
        xpNext = calculateXpNext(level);
        leveledUp = true;
    }
    updateLevelXpDisplay();
    if (leveledUp) {
        // Optionally, show a level up notification
        // alert(`Level up! You are now level ${level}`);
    }
}

function updateLevelXpDisplay() {
    const levelCount = document.getElementById('level-count');
    const xpCount = document.getElementById('xp-count');
    const xpNextSpan = document.getElementById('xp-next');
    if (levelCount) levelCount.innerText = level;
    if (xpCount) xpCount.innerText = xp;
    if (xpNextSpan) xpNextSpan.innerText = xpNext;
    // Update XP bar
    const xpBar = document.getElementById('xp-bar');
    if (xpBar) {
        let percent = Math.max(0, Math.min(1, xp / xpNext));
        xpBar.style.width = (percent * 100) + '%';
    }
    updateUnlockables();
}

// Add this at the end of the file or after DOMContentLoaded
const resetBtn = document.getElementById('reset-save-btn');
if (resetBtn) {
    resetBtn.onclick = function() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('cards-collection');
            localStorage.removeItem('cards-rolls');
            localStorage.removeItem('cards-tokens');
            localStorage.removeItem('cards-diamonds');
            localStorage.removeItem('cards-xp');
            localStorage.removeItem('cards-level');
            localStorage.removeItem('cards-xpNext');
            localStorage.removeItem('cards-last-connection');
            localStorage.removeItem('cards-token-upgrade');
            localStorage.removeItem('cards-max-token-upgrade');
            localStorage.removeItem('cards-luck-upgrade');
            localStorage.removeItem('cards-xp-upgrade');
            localStorage.removeItem('cards-diamond-upgrade');
            // Optionally reset rarity bar threshold
            // localStorage.removeItem('rarity-notif-threshold');
            // Reset in-memory variables
            collection = {};
            rolls = 0;
            tokens = 10;
            diamonds = 0;
            tokenUpgradeLevel = 0;
            maxTokenUpgradeLevel = 0;
            luckUpgradeLevel = 0;
            xpUpgradeLevel = 0;
            diamondUpgradeLevel = 0;
            maxToken = BASE_MAX_TOKEN;
            tokenRate = 0.2;
            tokenAccumulator = 0;
            xp = 0;
            level = 1;
            xpNext = 50;
            updateTokensDisplay();
            updateDiamondsDisplay();
            updateLevelXpDisplay();
            updateCollection();
            updateInventoryStats();
            updateCraftButtons();
            updatePotionsInventory();
            updateActiveEffectsDisplay();
            resetCardPreview();
            alert('Progress has been reset!');
            // Optionally reload the page
            // location.reload();
        }
    };
}

// On page load, call renderRarityBar
renderRarityBar();

// Add after DOMContentLoaded or at the end of the file
function createAutoRollButton() {
    let btn = document.getElementById('auto-roll-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'auto-roll-btn';
        btn.innerText = 'Auto Roll';
        // Positionnement à côté du bouton roll
        btn.style.position = 'relative';
        btn.style.right = 'unset';
        btn.style.bottom = 'unset';
        btn.style.marginLeft = '1em';
        btn.style.zIndex = 1;
        btn.style.background = 'linear-gradient(90deg, #4ecdc4, #f9d423)'; // Par défaut
        btn.style.color = '#222';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '1.1em';
        btn.style.border = 'none';
        btn.style.borderRadius = '12px';
        btn.style.padding = '0.7em 2.2em';
        btn.style.boxShadow = '0 2px 12px #0002';
        btn.style.cursor = 'pointer';
        btn.style.display = 'none';
        // Insérer juste après le bouton roll principal
        const rollBtn = document.getElementById('roll-button');
        if (rollBtn && rollBtn.parentNode) {
            rollBtn.parentNode.insertBefore(btn, rollBtn.nextSibling);
        } else {
            document.body.appendChild(btn);
        }
    }
    // Couleur par défaut (désactivé)
    btn.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
    function activateAutoRoll() {
        if (isRolling) return;
        btn.disabled = true;
        let autoRolling = true;
        // Quand activé, bouton vert
        btn.style.background = 'linear-gradient(90deg, #27ae60, #2ecc40)';
        function doAutoRoll() {
            if (!autoRolling) {
                btn.disabled = false;
                // Quand désactivé, bouton rouge
                btn.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
                btn.onclick = activateAutoRoll; // Permet de réactiver
                return;
            }
            if (tokens <= 0) {
                setTimeout(doAutoRoll, 500);
                return;
            }
            rollItem();
            setTimeout(() => {
                if (isRolling) {
                    setTimeout(doAutoRoll, rollDelay);
                } else {
                    doAutoRoll();
                }
            }, rollDelay + 50);
        }
        doAutoRoll();
        // Stop auto roll si on reclique
        btn.onclick = function() {
            autoRolling = false;
            btn.disabled = false;
            btn.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
            btn.onclick = activateAutoRoll; // Permet de réactiver
        };
    }
    btn.onclick = activateAutoRoll;
}

// Show/hide auto roll button based on level
function updateUnlockables() {
    let btn = document.getElementById('auto-roll-btn');
    if (!btn) return;
    if (level >= 5) {
        btn.style.display = 'block';
        btn.disabled = false;
    } else {
        btn.style.display = 'none';
    }
}

// Call these on page load and after level up
createAutoRollButton();
updateUnlockables();
// ===== SHOP =====
const TOKEN_UPGRADE_BASE_COST = 50;
const TOKEN_UPGRADE_COST_MULTIPLIER = 2.5;
const MAX_TOKEN_UPGRADE_BASE_COST = 100;
const MAX_TOKEN_UPGRADE_COST_MULTIPLIER = 2.5;
const LUCK_UPGRADE_BASE_COST = 75;
const LUCK_UPGRADE_COST_MULTIPLIER = 2.5;
const XP_UPGRADE_BASE_COST = 60;
const XP_UPGRADE_COST_MULTIPLIER = 2.5;
const DIAMOND_UPGRADE_BASE_COST = 120;
const DIAMOND_UPGRADE_COST_MULTIPLIER = 2.5;

function getTokenUpgradeCost(level) {
    return Math.round(TOKEN_UPGRADE_BASE_COST * Math.pow(TOKEN_UPGRADE_COST_MULTIPLIER, level));
}

function getMaxTokenUpgradeCost(level) {
    return Math.round(MAX_TOKEN_UPGRADE_BASE_COST * Math.pow(MAX_TOKEN_UPGRADE_COST_MULTIPLIER, level));
}

function getLuckUpgradeCost(level) {
    return Math.round(LUCK_UPGRADE_BASE_COST * Math.pow(LUCK_UPGRADE_COST_MULTIPLIER, level));
}

function getXpUpgradeCost(level) {
    return Math.round(XP_UPGRADE_BASE_COST * Math.pow(XP_UPGRADE_COST_MULTIPLIER, level));
}

function getDiamondUpgradeCost(level) {
    return Math.round(DIAMOND_UPGRADE_BASE_COST * Math.pow(DIAMOND_UPGRADE_COST_MULTIPLIER, level));
}

function buyTokenUpgrade() {
    const cost = getTokenUpgradeCost(tokenUpgradeLevel);
    if (diamonds < cost) return;
    diamonds -= cost;
    tokenUpgradeLevel++;
    tokenRate = 0.2 + tokenUpgradeLevel * 0.1;
    saveCollection();
    updateDiamondsDisplay();
    renderShop();
}

function buyMaxTokenUpgrade() {
    const cost = getMaxTokenUpgradeCost(maxTokenUpgradeLevel);
    if (diamonds < cost) return;
    diamonds -= cost;
    maxTokenUpgradeLevel++;
    maxToken = BASE_MAX_TOKEN + maxTokenUpgradeLevel * 5;
    saveCollection();
    updateDiamondsDisplay();
    updateTokensDisplay();
    renderShop();
}

function buyLuckUpgrade() {
    const cost = getLuckUpgradeCost(luckUpgradeLevel);
    if (diamonds < cost) return;
    diamonds -= cost;
    luckUpgradeLevel++;
    saveCollection();
    updateDiamondsDisplay();
    renderShop();
}

function buyXpUpgrade() {
    const cost = getXpUpgradeCost(xpUpgradeLevel);
    if (diamonds < cost) return;
    diamonds -= cost;
    xpUpgradeLevel++;
    saveCollection();
    updateDiamondsDisplay();
    renderShop();
}

function buyDiamondUpgrade() {
    const cost = getDiamondUpgradeCost(diamondUpgradeLevel);
    if (diamonds < cost) return;
    diamonds -= cost;
    diamondUpgradeLevel++;
    saveCollection();
    updateDiamondsDisplay();
    renderShop();
}

function renderShop() {
    const diamDisplay = document.getElementById('shop-diamonds-display');
    if (diamDisplay) diamDisplay.innerHTML = `💎 ${diamonds}`;

    const list = document.getElementById('shop-items-list');
    if (!list) return;
    list.innerHTML = '';

    // --- Upgrade Token Speed ---
    const currentRate = 0.2 + tokenUpgradeLevel * 0.1;
    const nextRate = currentRate + 0.1;
    const speedCost = getTokenUpgradeCost(tokenUpgradeLevel);
    const canAffordSpeed = diamonds >= speedCost;

    const speedItem = document.createElement('div');
    speedItem.style.cssText = `
        background: linear-gradient(135deg, #2c3e50, #34495e);
        border-radius: 16px;
        padding: 1.2em 1.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1em;
        box-shadow: 0 4px 18px rgba(0,0,0,0.18);
        margin-bottom: 0.8em;
    `;
    speedItem.innerHTML = `
        <div style="flex:1;">
            <div style="font-size:1.15em;font-weight:bold;color:#f1c40f;margin-bottom:0.25em;">⚡ Token Speed</div>
            <div style="font-size:0.88em;color:#bdc3c7;margin-bottom:0.3em;">
                <b style="color:#2ecc71;">${currentRate.toFixed(1)}/s</b> → <b style="color:#3498db;">${nextRate.toFixed(1)}/s</b>
            </div>
            <div style="font-size:0.82em;color:#95a5a6;">Niveau <b style="color:#e67e22;">${tokenUpgradeLevel}</b></div>
        </div>
        <button id="buy-speed-btn" style="
            padding:0.65em 1.4em;border-radius:10px;border:none;font-size:1em;font-weight:bold;
            cursor:${canAffordSpeed ? 'pointer' : 'not-allowed'};
            background:${canAffordSpeed ? 'linear-gradient(90deg,#9b59b6,#6c3483)' : '#555'};
            color:${canAffordSpeed ? '#fff' : '#888'};white-space:nowrap;min-width:110px;
        ">💎 ${speedCost}</button>
    `;
    if (canAffordSpeed) speedItem.querySelector('#buy-speed-btn').onclick = buyTokenUpgrade;
    list.appendChild(speedItem);

    // --- Upgrade Max Tokens ---
    const currentMax = BASE_MAX_TOKEN + maxTokenUpgradeLevel * 5;
    const nextMax = currentMax + 5;
    const maxCost = getMaxTokenUpgradeCost(maxTokenUpgradeLevel);
    const canAffordMax = diamonds >= maxCost;

    const maxItem = document.createElement('div');
    maxItem.style.cssText = `
        background: linear-gradient(135deg, #2c3e50, #34495e);
        border-radius: 16px;
        padding: 1.2em 1.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1em;
        box-shadow: 0 4px 18px rgba(0,0,0,0.18);
    `;
    maxItem.innerHTML = `
        <div style="flex:1;">
            <div style="font-size:1.15em;font-weight:bold;color:#f39c12;margin-bottom:0.25em;">🔋 Max Tokens</div>
            <div style="font-size:0.88em;color:#bdc3c7;margin-bottom:0.3em;">
                <b style="color:#2ecc71;">${currentMax}</b> → <b style="color:#3498db;">${nextMax}</b>
            </div>
            <div style="font-size:0.82em;color:#95a5a6;">Niveau <b style="color:#e67e22;">${maxTokenUpgradeLevel}</b></div>
        </div>
        <button id="buy-max-btn" style="
            padding:0.65em 1.4em;border-radius:10px;border:none;font-size:1em;font-weight:bold;
            cursor:${canAffordMax ? 'pointer' : 'not-allowed'};
            background:${canAffordMax ? 'linear-gradient(90deg,#e67e22,#d35400)' : '#555'};
            color:${canAffordMax ? '#fff' : '#888'};white-space:nowrap;min-width:110px;
        ">💎 ${maxCost}</button>
    `;
    if (canAffordMax) maxItem.querySelector('#buy-max-btn').onclick = buyMaxTokenUpgrade;
    list.appendChild(maxItem);

    // --- Upgrade Luck ---
    const currentLuck = 1 + luckUpgradeLevel * 0.5;
    const nextLuck = currentLuck + 0.5;
    const luckCost = getLuckUpgradeCost(luckUpgradeLevel);
    const canAffordLuck = diamonds >= luckCost;
    const luckItem = document.createElement('div');
    luckItem.style.cssText = `background:linear-gradient(135deg,#1a2900,#2d4a00);border-radius:16px;padding:1.2em 1.5em;display:flex;align-items:center;justify-content:space-between;gap:1em;box-shadow:0 4px 18px rgba(57,255,20,0.18);border:1px solid rgba(57,255,20,0.3);`;
    luckItem.innerHTML = `
        <div style="flex:1;">
            <div style="font-size:1.15em;font-weight:bold;color:#39ff14;margin-bottom:0.25em;">☢️ Luck</div>
            <div style="font-size:0.88em;color:#bdc3c7;margin-bottom:0.3em;">
                <b style="color:#2ecc71;">×${currentLuck.toFixed(1)}</b> → <b style="color:#39ff14;">×${nextLuck.toFixed(1)}</b>
            </div>
            <div style="font-size:0.82em;color:#95a5a6;">Niveau <b style="color:#39ff14;">${luckUpgradeLevel}</b> · +0.5 par niveau</div>
        </div>
        <button id="buy-luck-btn" style="padding:0.65em 1.4em;border-radius:10px;border:none;font-size:1em;font-weight:bold;cursor:${canAffordLuck?'pointer':'not-allowed'};background:${canAffordLuck?'linear-gradient(90deg,#39ff14,#7fff00)':'#555'};color:${canAffordLuck?'#1a2900':'#888'};white-space:nowrap;min-width:110px;">💎 ${luckCost}</button>
    `;
    if (canAffordLuck) luckItem.querySelector('#buy-luck-btn').onclick = buyLuckUpgrade;
    list.appendChild(luckItem);

    // --- Upgrade XP ---
    const currentXpMult = 1 + xpUpgradeLevel * 0.5;
    const nextXpMult = currentXpMult + 0.5;
    const xpCost = getXpUpgradeCost(xpUpgradeLevel);
    const canAffordXp = diamonds >= xpCost;
    const xpItem = document.createElement('div');
    xpItem.style.cssText = `background:linear-gradient(135deg,#0d2137,#1a3a5c);border-radius:16px;padding:1.2em 1.5em;display:flex;align-items:center;justify-content:space-between;gap:1em;box-shadow:0 4px 18px rgba(52,152,219,0.18);border:1px solid rgba(52,152,219,0.3);`;
    xpItem.innerHTML = `
        <div style="flex:1;">
            <div style="font-size:1.15em;font-weight:bold;color:#4ecdc4;margin-bottom:0.25em;">⭐ XP Boost</div>
            <div style="font-size:0.88em;color:#bdc3c7;margin-bottom:0.3em;">
                <b style="color:#2ecc71;">×${currentXpMult.toFixed(1)}</b> → <b style="color:#4ecdc4;">×${nextXpMult.toFixed(1)}</b>
            </div>
            <div style="font-size:0.82em;color:#95a5a6;">Level <b style="color:#4ecdc4;">${xpUpgradeLevel}</b> · +50% XP per level</div>
        </div>
        <button id="buy-xp-btn" style="padding:0.65em 1.4em;border-radius:10px;border:none;font-size:1em;font-weight:bold;cursor:${canAffordXp?'pointer':'not-allowed'};background:${canAffordXp?'linear-gradient(90deg,#4ecdc4,#2ecc71)':'#555'};color:${canAffordXp?'#0d2137':'#888'};white-space:nowrap;min-width:110px;">💎 ${xpCost}</button>
    `;
    if (canAffordXp) xpItem.querySelector('#buy-xp-btn').onclick = buyXpUpgrade;
    list.appendChild(xpItem);

    // --- Upgrade Diamond Gain ---
    const currentDiamMult = 1 + diamondUpgradeLevel * 0.5;
    const nextDiamMult = currentDiamMult + 0.5;
    const diamCost = getDiamondUpgradeCost(diamondUpgradeLevel);
    const canAffordDiam = diamonds >= diamCost;
    const diamItem = document.createElement('div');
    diamItem.style.cssText = `background:linear-gradient(135deg,#1a0a2e,#2d1b4e);border-radius:16px;padding:1.2em 1.5em;display:flex;align-items:center;justify-content:space-between;gap:1em;box-shadow:0 4px 18px rgba(155,89,182,0.25);border:1px solid rgba(155,89,182,0.4);`;
    diamItem.innerHTML = `
        <div style="flex:1;">
            <div style="font-size:1.15em;font-weight:bold;color:#c39bd3;margin-bottom:0.25em;">💎 Diamond Boost</div>
            <div style="font-size:0.88em;color:#bdc3c7;margin-bottom:0.3em;">
                <b style="color:#2ecc71;">×${currentDiamMult.toFixed(1)}</b> → <b style="color:#c39bd3;">×${nextDiamMult.toFixed(1)}</b>
            </div>
            <div style="font-size:0.82em;color:#95a5a6;">Level <b style="color:#c39bd3;">${diamondUpgradeLevel}</b> · +50% diamonds per level</div>
        </div>
        <button id="buy-diam-btn" style="padding:0.65em 1.4em;border-radius:10px;border:none;font-size:1em;font-weight:bold;cursor:${canAffordDiam?'pointer':'not-allowed'};background:${canAffordDiam?'linear-gradient(90deg,#9b59b6,#c39bd3)':'#555'};color:${canAffordDiam?'#fff':'#888'};white-space:nowrap;min-width:110px;">💎 ${diamCost}</button>
    `;
    if (canAffordDiam) diamItem.querySelector('#buy-diam-btn').onclick = buyDiamondUpgrade;
    list.appendChild(diamItem);
}

function openShopMenu() {
    document.getElementById('shop-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderShop();
}
function closeShopMenu() {
    document.getElementById('shop-modal').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('shop-btn').onclick = openShopMenu;
document.getElementById('close-shop').onclick = closeShopMenu;
document.getElementById('shop-modal').onclick = function(e) {
    if (e.target === this) closeShopMenu();
};
