const items = [
    { name: "Grass", chance: 2, rollable: true },
    { name: "Bush", chance: 3, rollable: true },
    { name: "Tree", chance: 4, rollable: true },
    { name: "Bones", chance: 5, rollable: true },
    { name: "Sugar", chance: 7, rollable: true, specialTag: "Sweet" },
    { name: "Beach", chance: 10, rollable: true },
    { name: "Snow Mountains", chance: 15, rollable: true },
    { name: "Sword", chance: 25, rollable: true, specialTag: "Cutting" },
    { name: "Mars", chance: 50, rollable: true },
    { name: "Burger", chance: 75, rollable: true, specialTag: "Caloric" },
    { name: "Earth", chance: 100, rollable: true },
    { name: "Ice Spikes", chance: 150, rollable: true },
    { name: "Apple", chance: 200, rollable: true },
    { name: "Electricity", chance: 250, rollable: true },
    { name: "Thunder", chance: 2500, rollable: false },
    { name: "Infinity", chance: 1000000000, rollable: false }
];

// Potions
const potions = [
    {
        name: "Speed Potion",
        type: "rollspeed",
        power: 2,
        duration: 60000, // 60 secondes
        image: "Speed.png",
        effectType: "time" // Effet basé sur le temps
    },
    {
        name: "Thunder Potion",
        type: "rollspeed",
        power: 3,
        duration: 180000, // 50 rolls
        image: "Thunder.png",
        effectType: "time" // Effet basé sur le temps
    }
];

const cardsGroupes = [
    { name: "Nature", content: ["Grass", "Bush", "Tree", "Apple"], color: "rgb(6, 65, 11)" },
    { name: "Biomes", content: ["Snow Mountains", "Beach"], color: "rgb(129, 148, 131)" },
    { name: "Food", content: ["Sugar", "Burger", "Apple"], color: "rgb(216, 177, 47)" },
    { name: "Planets", content: ["Mars", "Earth"], color: "rgb(54, 54, 54)" },
    { name: "Weapons", content: ["Sword"], color: "rgb(30, 30, 30)" },
    { name: "Monster Loot", content: ["Bones"], color: "rgb(165, 33, 0)" },
    { name: "Energy", content: ["Electricity", "Thunder"], color: "rgb(255, 245, 53)" }
];

let collection = {};
let potionInventory = {}; // Inventaire des potions et items spéciaux
let activeEffects = {}; // Effets actuellement actifs
let rollBasedEffects = {}; // Effets basés sur le nombre de rolls
let rolls = 0;
let isRolling = false;
let tokens = 10;
let tokenInterval = 5000;
let maxToken = 20;
let rollDelay = 1000;
let luck = 1;
let spinningCardsAnimationSpeed = 200;

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
        time: 7000,
    },
    {
        name: "Speed Potion",
        ingredients: [
            { name: "Electricity", amount: 5 }
        ],
        time: 10000,
        type: "potion"
    },
    {
        name: "Thunder Potion",
        ingredients: [
            { name: "Thunder", amount: 2 },
            { name: "Electricity", amount: 5 },
        ],
        time: 20000,
        type: "potion"
    }
];

let craftingQueue = [];

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
    showCraftMessage(`${recipe.name} added to the queue!`, "success");
    
    // Démarrer le traitement de la queue si c'est le premier craft
    if (craftingQueue.length === 1) {
        processCraftingQueue();
    }
    
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

function processCraftingQueue() {
    if (craftingQueue.length === 0) {
        updateCraftButtons();
        return;
    }
    
    const currentJob = craftingQueue[0];
    const now = Date.now();
    
    if (now >= currentJob.endTime) {
        // Craft terminé
        const recipe = currentJob.recipe;
        
        // Ajouter l'objet crafté à l'inventaire approprié
        if (recipe.type === "potion") {
            // Ajouter à l'inventaire des potions
            if (!potionInventory[recipe.name]) {
                potionInventory[recipe.name] = 1;
            } else {
                potionInventory[recipe.name]++;
            }
        } else {
            // Ajouter à l'inventaire normal
            if (!collection[recipe.name]) {
                collection[recipe.name] = 1;
            } else {
                collection[recipe.name]++;
            }
        }
        
        // Retirer de la queue
        craftingQueue.shift();
        
        // Sauvegarder et mettre à jour
        saveCollection();
        updateCollection();
        updateInventoryStats();
        updatePotionsInventory();
        
        showCraftMessage(`${recipe.name} successfuly crafted!`, "success");
        
        // Traiter le prochain craft s'il y en a
        if (craftingQueue.length > 0) {
            // Ajuster le temps de fin du prochain craft si nécessaire
            const nextJob = craftingQueue[0];
            const now = Date.now();
            if (nextJob.endTime <= now) {
                nextJob.endTime = now + nextJob.recipe.time;
            }
            // Démarrer immédiatement le prochain craft
            processCraftingQueue();
        } else {
            // Mettre à jour l'interface seulement si plus de crafts
            updateCraftButtons();
        }
    } else {
        // Mettre à jour la queue en temps réel
        updateCraftQueue();
        // Continuer à attendre
        setTimeout(processCraftingQueue, 100);
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

function updateCraftButtons() {
    const craftList = document.getElementById('craft-list');
    if (!craftList) return;
    
    craftList.innerHTML = '';
    
    for (let recipe of craftRecipes) {
        const canCraft = hasIngredients(recipe);
        const isInQueue = craftingQueue.some(job => job.recipe.name === recipe.name);
        
        const button = document.createElement('button');
        button.className = 'craft-button';
        button.style.cssText = `
            margin: 0.5em;
            padding: 0.8em 1.5em;
            border: none;
            border-radius: 10px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${canCraft ? 'linear-gradient(90deg, #27ae60, #2ecc71)' : '#bdc3c7'};
            color: ${canCraft ? 'white' : '#7f8c8d'};
            opacity: 1;
        `;
        
        button.innerText = `${recipe.name} (${formatTime(recipe.time)})`;
        
        if (canCraft) {
            button.onclick = () => craftItem(recipe);
        } else {
            button.onclick = () => showCraftMessage("Not enought items!", "error");
        }
        
        // Afficher les ingrédients requis et combien on peut crafter
        const maxCrafts = Math.min(...recipe.ingredients.map(ing => {
            const owned = collection[ing.name] || 0;
            return Math.floor(owned / ing.amount);
        }));
        
        const ingredientsText = recipe.ingredients.map(ing => {
            const owned = collection[ing.name] || 0;
            const color = owned >= ing.amount ? '#27ae60' : '#e74c3c';
            return `<span style="color: ${color}">${ing.name}: ${owned}/${ing.amount}</span>`;
        }).join(', ');
        
        // Ajouter le nombre de crafts possibles
        if (maxCrafts > 0) {
            button.innerText += ` (${maxCrafts}x)`;
        }
        
        const ingredientsDiv = document.createElement('div');
        ingredientsDiv.style.cssText = `
            font-size: 0.8em;
            margin-top: 0.3em;
            color: #7f8c8d;
        `;
        ingredientsDiv.innerHTML = ingredientsText;
        
        const container = document.createElement('div');
        container.style.cssText = `
            display: inline-block;
            margin: 0.5em;
            text-align: center;
        `;
        container.appendChild(button);
        container.appendChild(ingredientsDiv);
        
        craftList.appendChild(container);
    }
    
    // Mettre à jour aussi la queue
    updateCraftQueue();
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
    tokenInterval = Math.max(1000, 5000 / tokenSpeedMultiplier);
    
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
    if (chance < 100) return '<span class="rarity-tag rarity-rare">Rare</span>';
    if (chance < 1000) return '<span class="rarity-tag rarity-epic">Epic</span>';
    if (chance < 10000) return '<span class="rarity-tag rarity-legendary">Legendary</span>';
    return '<span class="rarity-tag rarity-mythic">Mythic</span>';
}

function getGoldTag(type) {
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
    } else if (tokens === maxToken) {
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

function addToken() {
    if (tokens < maxToken) { // Limite de 10 tokens
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
    }, tokenInterval);
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

function updateLuck() {
    luck = (sugarRushMultiplier)

    if (luck < 1) {
        luck = 1
    }
}

function rollItem() {
    updateLuck()
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
            if (item.rollable === true) {
                let chance = Math.max(1, Math.round(item.chance / luck));
                let roll = Math.floor(Math.random() * chance) + 1;
                if (roll === 1) {
                    winners.push(item);
                }
            }
        }
        let selected;
        if (winners.length === 0) {
            // Ne choisir que parmi les cartes rollable:true
            const rollableItems = items.filter(item => item.rollable === true);
            selected = rollableItems.reduce((a, b) => (a.chance < b.chance ? a : b));
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
        let chanceDisplay = type === 'Shiny' ? selected.chance * 1000 : type === 'Rainbow' ? selected.chance * 100 : type === 'Gold' ? selected.chance * 10 : selected.chance;

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
            else if (chanceDisplay < 100) thisRarity = 'rare';
            else if (chanceDisplay < 1000) thisRarity = 'epic';
            else if (chanceDisplay < 10000) thisRarity = 'legendary';
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

        // Réactiver le bouton après 200ms supplémentaires (plus rapide)
        setTimeout(() => {
            rollButton.disabled = false;
            isRolling = false;
        },);
    }, rollDelay);
}

function updateCollection() {
    const ul = document.getElementById('collection-list');
    ul.innerHTML = '';

    // Trier chaque carte indépendamment, sans regrouper les variantes
    let rarityOrder = chance => (chance < 10 ? 0 : chance < 100 ? 1 : chance < 1000 ? 2 : 3);
    let typeOrder = t => t === 'Shiny' ? 3 : t === 'Rainbow' ? 2 : t === 'Gold' ? 1 : 0;
    let sortedNames = Object.keys(collection).sort((a, b) => {
        // Détecter le type pour chaque carte
        let typeA = a.endsWith('(Shiny)') ? 'Shiny' : a.endsWith('(Rainbow)') ? 'Rainbow' : a.endsWith('(Gold)') ? 'Gold' : '';
        let typeB = b.endsWith('(Shiny)') ? 'Shiny' : b.endsWith('(Rainbow)') ? 'Rainbow' : b.endsWith('(Gold)') ? 'Gold' : '';
        let baseA = typeA ? a.replace(` (${typeA})`, '') : a;
        let baseB = typeB ? b.replace(` (${typeB})`, '') : b;
        let itemA = items.find(i => i.name === baseA);
        let itemB = items.find(i => i.name === baseB);
        let chanceA = typeA === 'Shiny' ? itemA.chance * 1000 : typeA === 'Rainbow' ? itemA.chance * 100 : typeA === 'Gold' ? itemA.chance * 10 : itemA.chance;
        let chanceB = typeB === 'Shiny' ? itemB.chance * 1000 : typeB === 'Rainbow' ? itemB.chance * 100 : typeB === 'Gold' ? itemB.chance * 10 : itemB.chance;
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
        let type = name.endsWith('(Shiny)') ? 'Shiny' : name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
        let baseName = type ? name.replace(` (${type})`, '') : name;
        let item = items.find(i => i.name === baseName);
        let chanceDisplay = type === 'Shiny' ? item.chance * 1000 : type === 'Rainbow' ? item.chance * 100 : type === 'Gold' ? item.chance * 10 : item.chance;
        let displayName = baseName;
        let goldTag = getGoldTag(type);
        let specialTag = getSpecialTag(item);
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
        // Remove animation class if present
        setTimeout(() => {
            const cardDiv = li.querySelector('.card-inventory');
            if (cardDiv) cardDiv.style.animation = 'none';
        }, 0);
        // Add long-press event for card info popup
        setTimeout(() => { // Wait for DOM
            const cardDiv = li.querySelector('.card-inventory');
            if (cardDiv) {
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
                                <button id='decompressor-btn' style='margin-left:1em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#16a085;color:white;border:none;cursor:pointer;'>Decompressor</button><br>
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
        }, 0);
        ul.appendChild(li);
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

// Sauvegarde l'inventaire dans localStorage
function saveCollection() {
    localStorage.setItem('cards-collection', JSON.stringify(collection));
    localStorage.setItem('cards-potions', JSON.stringify(potionInventory));
    localStorage.setItem('cards-effects', JSON.stringify(activeEffects));
    localStorage.setItem('cards-roll-effects', JSON.stringify(rollBasedEffects));
    localStorage.setItem('cards-rolls', rolls.toString());
    localStorage.setItem('cards-tokens', tokens.toString());
    localStorage.setItem('cards-xp', xp.toString());
    localStorage.setItem('cards-level', level.toString());
    localStorage.setItem('cards-xpNext', xpNext.toString());
}

// Charge l'inventaire depuis localStorage
function loadCollection() {
    const data = localStorage.getItem('cards-collection');
    const potionsData = localStorage.getItem('cards-potions');
    const effectsData = localStorage.getItem('cards-effects');
    const rollsData = localStorage.getItem('cards-rolls');
    const tokensData = localStorage.getItem('cards-tokens');
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
        // S'assurer que les tokens ne dépassent pas la limite
        if (tokens > maxToken) tokens = maxToken;
    } else {
        tokens = 10; // Valeur par défaut pour les nouveaux utilisateurs
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
    
    updateTokensDisplay();
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
    const tokensToAdd = Math.floor(diffSeconds / (rollDelay / 100)); // Gagne des tokens 100X plus lentement que en ligne
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
updateLuck()

// Démarrer la mise à jour en temps réel des effets
startRealTimeEffectsUpdate();

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
    // Mettre à jour l'affichage des effets toutes les secondes
    setInterval(() => {
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

// ----- Raretés utilisées pour la barre -----
const rarityLevels = [
    { key: 'common',    name: 'Common',    class: 'rarity-common',    order: 1 },
    { key: 'rare',      name: 'Rare',      class: 'rarity-rare',      order: 2 },
    { key: 'epic',      name: 'Epic',      class: 'rarity-epic',      order: 3 },
    { key: 'legendary', name: 'Legendary', class: 'rarity-legendary', order: 4 },
    { key: 'mythic',    name: 'Mythic',    class: 'rarity-mythic',    order: 5 }
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
    xp += amount;
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
            localStorage.removeItem('cards-xp');
            localStorage.removeItem('cards-level');
            localStorage.removeItem('cards-xpNext');
            localStorage.removeItem('cards-last-connection');
            // Optionally reset rarity bar threshold
            // localStorage.removeItem('rarity-notif-threshold');
            // Reset in-memory variables
            collection = {};
            rolls = 0;
            tokens = 10;
            xp = 0;
            level = 1;
            xpNext = 50;
            updateTokensDisplay();
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