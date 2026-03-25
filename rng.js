const items = [
    { name: "Grass", chance: 2, rollable: true },
    { name: "Bush", chance: 3, rollable: true },
    { name: "Tree", chance: 4, rollable: true },
    { name: "Burger", chance: 5, rollable: true, tags: ["caloric"] },
    { name: "Sugar", chance: 7, rollable: true, tags: ["sweet"] },
    { name: "Beach", chance: 10, rollable: true },
    { name: "Snow Mountains", chance: 15, rollable: true },
    { name: "Sugar Cube", chance: 20, rollable: true, tags: ["ai", "sweet"] },
    { name: "Sword", chance: 25, rollable: true, tags: ["Sharp"] },
    { name: "Overworld", chance: 35, rollable: true },
    { name: "Mars", chance: 50, rollable: true },
    { name: "Bones", chance: 75, rollable: true },
	{ name: "Star", chance: 99, rollable: true },
    { name: "Earth", chance: 100, rollable: true },
    { name: "Ice Spikes", chance: 150, rollable: true, tags: ["Sharp"] },
    { name: "Apple", chance: 200, rollable: true },
    { name: "Electricity", chance: 250, rollable: true },
    { name: "Coal", chance: 350, rollable: true, tags: ["ai"] },
    { name: "Hearth", chance: 500, rollable: true },
    { name: "Lava", chance: 625, rollable: true, tags: ["ai"] },
    { name: "Evil", chance: 666, rollable: true },
    { name: "Sky", chance: 750, rollable: true },
    { name: "Moon", chance: 999, rollable: true },
    { name: "Sun", chance: 999, rollable: true },
    { name: "Tacos", chance: 1000, rollable: true, tags: ["caloric"] },
    { name: "Gun", chance: 1500, rollable: true },
    { name: "Spikes", chance: 2000, rollable: false, tags: ["ai", "Sharp"] },
    { name: "Ugly", chance: 2500, rollable: true },
    { name: "Cute", chance: 2500, rollable: true },
    { name: "Zombie", chance: 3500, rollable: true, tags: ["ai"] },
    { name: "Noob", chance: 5000, rollable: true },
    { name: "Cards", chance: 7500, rollable: true },
    { name: "Circus", chance: 10000, rollable: true },
    { name: "Clouds", chance: 15000, rollable: true },
    { name: "Sand", chance: 20000, rollable: true, tags: ["ai"] },
    { name: "Nars", chance: 25000, rollable: true },
    { name: "Wood", chance: 35000, rollable: true, tags: ["ai"] },
    { name: "Rock", chance: 50000, rollable: true, tags: ["ai"] },
    { name: "Cog", chance: 75000, rollable: true, tags: ["ai"] },
    { name: "Salt", chance: 100000, rollable: true, tags: ["ai"] },
    { name: "Time", chance: 150000, rollable: true, tags: ["ai"] },
    { name: "Dog", chance: 200000, rollable: true, tags: ["ai"] },
    { name: "House", chance: 250000, rollable: true, tags: ["ai"] },
    { name: "Brick", chance: 350000, rollable: true, tags: ["ai"] },
    { name: "Slime", chance: 500000, rollable: true, tags: ["ai"] },
    { name: "Ghost", chance: 750000, rollable: true, tags: ["ai"] },
    { name: "Skeleton", chance: 1000000, rollable: true, tags: ["ai"] },
    { name: "Magma", chance: 1500000, rollable: true, tags: ["ai"] },
    { name: "Monkey", chance: 2500000, rollable: true, tags: ["ai"] },
    { name: "Uranus", chance: 3500000, rollable: true, tags: ["ai"] },
    { name: "Fire", chance: 5000000, rollable: true, tags: ["ai"] },
    { name: "Neptune", chance: 6250000, rollable: true, tags: ["ai"] },
    { name: "Water", chance: 7500000, rollable: true, tags: ["ai"] },
    { name: "Rubiks Cube", chance: 8500000, rollable: true, tags: ["ai"] },
    { name: "Empty Glass", chance: 10000000, rollable: true, tags: ["ai"] },
    { name: "Iron", chance: 15000000, rollable: true, tags: ["ai"] },
    { name: "Iceberg", chance: 15000, rollable: false },
    { name: "Water Glass", chance: 17500000, rollable: false, tags: ["ai"] },
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
        duration: 2 * 60 * 1000, // 2 minutes
        image: "Speed.png",
        effectType: "time" // Effet basé sur le temps
    },
    {
        name: "Thunder Potion",
        type: "rollspeed",
        power: 3,
        duration: 5 * 60 * 1000, // 5 minutes
        image: "Thunder.png",
        effectType: "time" // Effet basé sur le temps
    },
    {
        name: "Luck Potion",
        type: "luck",
        power: 2,
        duration: 2 * 60 * 1000, // 2 minutes
        image: "Luck.png",
        effectType: "time" // Effet basé sur le temps
    },
    {
        name: "Craft Speed Potion",
        type: "craftspeed",
        power: 2,
        duration: 2 * 60 * 1000, // 2 minutes
        image: "Craft Speed Potion.png",
        effectType: "time" // Effet basé sur le temps
    }
];

// ===== ARTIFACTS =====
const artifactDefinitions = [
    {
        name: "Sugar Magnet",
        description: "Sweet cards always trigger Sugar Rush (no more 1/3 chance). Each equipped copy adds +1 roll to Sugar Rush, up to the cap.",
        effect: "sugarMagnet",
        craft: [
            { name: "Sugar Cube", amount: 5 },
            { name: "Sugar",      amount: 50 }
        ],
        craftTime: 60 * 1000 * 2, // 2 minutes
        image: "Artifacts-Icons/Sugar Magnet.png"
    }
];

let artifactInventory = {};   // { "Sugar Magnet": 2 }  — owned but not equipped
let equippedArtifacts = [];   // [{ name, slot }]  — ordered list of equipped artifacts

const ARTIFACT_SLOT_LEVELS = [10, 20, 30, 40, 50];

function getMaxArtifactSlots() {
    return ARTIFACT_SLOT_LEVELS.filter(l => level >= l).length;
}
function getEquippedCount(artifactName) {
    return equippedArtifacts.filter(a => a.name === artifactName).length;
}
function equipArtifact(name) {
    const maxSlots = getMaxArtifactSlots();
    if (equippedArtifacts.length >= maxSlots) {
        showCraftMessage('No artifact slot available!', 'error');
        return false;
    }
    if ((artifactInventory[name] || 0) <= 0) {
        showCraftMessage('No ' + name + ' in inventory!', 'error');
        return false;
    }
    artifactInventory[name]--;
    if (artifactInventory[name] <= 0) delete artifactInventory[name];
    equippedArtifacts.push({ name });
    saveCollection();
    updateArtifactsUI();
    return true;
}
function unequipArtifact(index) {
    if (index < 0 || index >= equippedArtifacts.length) return;
    const { name } = equippedArtifacts[index];
    equippedArtifacts.splice(index, 1);
    artifactInventory[name] = (artifactInventory[name] || 0) + 1;
    saveCollection();
    updateArtifactsUI();
}

const cardsGroupes = [
    // ── Nature & Vegetation ──
    { name: "Nature",    content: ["Grass", "Bush", "Tree", "Apple", "Wood"],                                           color: "rgb(34, 110, 46)" },
    // ── Biomes & Environments ──
    { name: "Biomes",    content: ["Beach", "Snow Mountains", "Overworld", "Sky", "Clouds", "Iceberg", "Sugar", "Sugar Cube"],                 color: "rgb(78, 140, 160)" },
    // ── Food & Sweets ──
    { name: "Food",      content: ["Sugar", "Sugar Cube", "Burger", "Tacos", "Nars", "Apple"],                                        color: "rgb(210, 160, 40)" },
    // ── Space & Celestial ──
    { name: "Space",     content: ["Mars", "Earth", "Moon", "Sun", "Uranus", "Neptune"],                                color: "rgb(20, 30, 80)" },
    // ── Weapons ──
    { name: "Weapons",   content: ["Sword", "Gun"],                                                                     color: "rgb(60, 60, 60)" },
    // ── Energy & Elements ──
    { name: "Energy",    content: ["Electricity", "Thunder", "Fire", "Lava", "Magma", "Time"],                          color: "rgb(230, 200, 30)" },
    // ── Elements ──
    { name: "Elements",  content: ["Water", "Lava", "Magma", "Ice Spikes", "Sand", "Rock", "Coal", "Salt", "Iron"],     color: "rgb(70, 120, 180)" },
    // ── Body & Anatomy ──
    { name: "Body",      content: ["Bones", "Hearth", "Pierced Hearth"],                                                color: "rgb(200, 40, 80)" },
    // ── Creatures & Monsters ──
    { name: "Creatures", content: ["Evil", "Zombie", "Ghost", "Skeleton", "Monkey", "Slime", "Dog"],                    color: "rgb(100, 30, 10)" },
    // ── Materials & Crafting ──
    { name: "Materials", content: ["Wood", "Rock", "Coal", "Sand", "Salt", "Iron", "Brick", "Cog"],                     color: "rgb(130, 90, 50)" },
    // ── Objects & Items ──
    { name: "Objects",   content: ["Cards", "Cards Circus", "Rubiks Cube", "Empty Glass", "Water Glass", "Cog"],        color: "rgb(200, 190, 60)" },
    // ── Buildings & Structures ──
    { name: "Buildings", content: ["Circus", "House"],                                                                  color: "rgb(170, 170, 180)" },
    // ── Concepts & Abstracts ──
    { name: "Concepts",  content: ["Cute", "Ugly", "Noob", "Infinity", "Time"],                                        color: "rgb(160, 80, 230)" },
    // ── AI-generated ──
    { name: "AI",        content: [],                                                                                    color: "rgb(112, 18, 156)" }
];

// Auto-populate AI group from item tags
for (let item of items) {
    if (item.tags && item.tags.includes('ai') && !cardsGroupes.find(g => g.name === "AI").content.includes(item.name)) {
        cardsGroupes.find(g => g.name === "AI").content.push(item.name);
    }
}


let collection = {};
let discoveredTags = new Set(); // tracks tag types ever obtained (Gold, Rainbow, Shiny, Nuclear)
let discoveredEffects     = new Set(); // 'sugarRush', 'fullBelly', 'obese', 'bleeding'
let discoveredSpecialTags = new Set(); // 'sweet', 'caloric', 'sharp', 'ai'
let potionInventory = {}; // Inventaire des potions et items spéciaux
let activeEffects = {}; // Effets actuellement actifs
let potionQueues = {};
let rollBasedEffects = {}; // Effets basés sur le nombre de rolls
let rolls = 0;
let isRolling = false;
let tokens = 10;
let tokenRate = 0.2; // tokens par seconde (base)
let tokenAccumulator = 0; // accumulateur fractionnaire
let tokenRechargeIntervalId = null;
let bleedingIntervalId = null;
let bleedingAnimationId = null;
let bleedingParticles = [];
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
let rollSpeedUpgradeLevel = 0; // Niveau d'amélioration de vitesse de roll
let xpUpgradeLevel = 0;      // Niveau d'amélioration de gain XP


let slotInterval = null;
let sugarRushRolls = 0; // Nombre de rolls restants avec l'effet Sugar Rush (×2 luck sur les cartes sweet)
let ventrePleinRolls = 0; // Nombre de rolls restants avec l'effet Ventre Plein (×1.5 luck, déclenché par les cartes caloric)
let obeseEndTime = 0; // End time for the Obese effect (x0.8 roll speed)
let bleedingEndTime = 0; // End time for the Bleeding effect (token loss)

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
        name: "Sugar Magnet",
        ingredients: [
            { name: "Sugar Cube", amount: 5 },
            { name: "Sugar",      amount: 50 }
        ],
        time: 1000 * 60 * 2,
        type: "artifact"
    },
	{
        name: "Craft Speed Potion",
        ingredients: [
            { name: "Electricity", amount: 8 }
        ],
        time: 1000 * 45,
        type: "potion"
    },
	{
        name: "Iceberg",
        ingredients: [
            { name: "Ice Spikes", amount: 100 }
        ],
        time: 1000 * 60,
    },
	{
        name: "Water Glass",
        ingredients: [
            { name: "Empty Glass", amount: 1 },
            { name: "Water", amount: 1 }
        ],
        time: 1000 * 60,
    },
	{
        name: "Sugar Cube",
        ingredients: [
            { name: "Sugar", amount: 7 }
        ],
        time: 1000 * 30,
    },
	{
        name: "Sugar",
        ingredients: [
            { name: "Sugar Cube", amount: 1 }
        ],
        time: 1000 * 30,
        rewards: [
            { name: "Sugar", amount: 5 }
        ]
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

function getCraftSpeedMultiplier() {
    return (activeEffects.craftspeed && activeEffects.craftspeed.endTime > Date.now())
        ? activeEffects.craftspeed.power : 1;
}

function craftItem(recipe) {
    // Vérifier si on a les ingrédients nécessaires
    if (!hasIngredients(recipe)) {
        showCraftMessage("Not enough items!", "error");
        return false;
    }
    
    // Consommer les ingrédients
    consumeIngredients(recipe);
    
    // Ajouter à la queue de craft
    const now = Date.now();
    const effectiveTime = Math.round(recipe.time / getCraftSpeedMultiplier());
    let endTime;
    
    if (craftingQueue.length === 0) {
        // Premier craft - commence immédiatement
        endTime = now + effectiveTime;
    } else {
        // Craft suivant - commence après la fin du dernier craft
        const lastJob = craftingQueue[craftingQueue.length - 1];
        endTime = lastJob.endTime + effectiveTime;
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

function craftMultiple(recipe, n) {
    if (!n || n < 1) return;
    let crafted = 0;
    const effectiveTime = Math.round(recipe.time / getCraftSpeedMultiplier());
    for (let i = 0; i < n; i++) {
        if (!hasIngredients(recipe)) break;
        consumeIngredients(recipe);
        const lastJob = craftingQueue[craftingQueue.length - 1];
        const endTime = lastJob ? lastJob.endTime + effectiveTime : Date.now() + effectiveTime;
        craftingQueue.push({ recipe, startTime: Date.now(), endTime, id: Date.now() + Math.random() });
        crafted++;
    }
    if (crafted > 0) {
        saveCraftingQueue();
        startCraftingInterval();
        updateCraftButtons();
        showCraftMessage(`${crafted}× ${recipe.name} added to the queue!`, "success");
    } else {
        showCraftMessage("Not enough items!", "error");
    }
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
        } else if (recipe.type === "artifact") {
            artifactInventory[recipe.name] = (artifactInventory[recipe.name] || 0) + 1;
            updateArtifactsUI();
        } else {
            // Handle rewards for regular items
            if (recipe.rewards) {
                for (let reward of recipe.rewards) {
                    collection[reward.name] = (collection[reward.name] || 0) + reward.amount;
                }
            } else {
                collection[recipe.name] = (collection[recipe.name] || 0) + 1;
            }
        }

        craftingQueue.shift();

        saveCollection();
        saveCraftingQueue();
        updateCollection();
        updateInventoryStats();
        updatePotionsInventory();

        // Generate success message based on what was gained
        let message = "";
        if (recipe.type === "potion") {
            message = `Gained: 1 ${recipe.name}`;
        } else if (recipe.type === "artifact") {
            message = `Gained: 1 ${recipe.name}`;
        } else {
            if (recipe.rewards) {
                const rewardStrings = recipe.rewards.map(r => `${r.amount} ${r.name}`);
                message = `Gained: ${rewardStrings.join(", ")}`;
            } else {
                message = `Gained: 1 ${recipe.name}`;
            }
        }
        showCraftMessage(message, "success");

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
        setTimeout(() => { craftResult.innerText = ''; }, 3000);
    }
    showNotification(message, type);
}

const NOTIF_DURATION = 10000;

function getNotifContainer() {
    return document.getElementById('roll-notif-stack');
}

function showNotification(message, type) {
    const container = getNotifContainer();
    if (!container) return;
    const colors = {
        success: { bg: 'rgba(39,174,96,0.93)',  bar: '#2ecc71' },
        error:   { bg: 'rgba(192,57,43,0.93)',   bar: '#e74c3c' },
        info:    { bg: 'rgba(52,73,94,0.93)',     bar: '#95a5a6' },
    };
    const c = colors[type] || colors.info;
    const notif = document.createElement('div');
    notif.style.cssText = [
        'background:' + c.bg,
        'color:#fff',
        'border-radius:10px',
        'padding:0.55em 0.85em 0.45em',
        'font-size:0.82em',
        'font-weight:500',
        'box-shadow:0 2px 10px rgba(0,0,0,0.4)',
        'cursor:pointer',
        'max-width:240px',
        'word-break:break-word',
        'animation:notifSlideIn 0.18s ease',
        'position:relative',
        'overflow:hidden'
    ].join(';');
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '0.35em';
    msgDiv.textContent = message;
    const bar = document.createElement('div');
    bar.style.cssText = [
        'position:absolute',
        'bottom:0',
        'left:0',
        'height:3px',
        'width:100%',
        'background:' + c.bar,
        'border-radius:0 0 10px 10px',
        'transform-origin:left'
    ].join(';');
    notif.appendChild(msgDiv);
    notif.appendChild(bar);
    notif.addEventListener('click', () => dismissNotif(notif));
    container.appendChild(notif);
    const start = performance.now();
    let rafId;
    function animBar(now) {
        const pct = Math.max(0, 1 - (now - start) / NOTIF_DURATION);
        bar.style.width = (pct * 100) + '%';
        if (pct > 0) rafId = requestAnimationFrame(animBar);
    }
    rafId = requestAnimationFrame(animBar);
    const timer = setTimeout(() => dismissNotif(notif), NOTIF_DURATION);
    notif._timer = timer;
    notif._raf = rafId;
}

function dismissNotif(notif) {
    clearTimeout(notif._timer);
    cancelAnimationFrame(notif._raf);
    notif.style.transition = 'opacity 0.2s, transform 0.2s';
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(-20px)';
    setTimeout(() => { if (notif.parentNode) notif.parentNode.removeChild(notif); }, 220);
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


function getRecipeImageSrc(recipe) {
    if (recipe.type === 'potion') {
        const p = potions.find(pt => pt.name === recipe.name);
        if (p && p.image) return 'Potions/' + p.image;
    }
    return 'Cards-Icons/' + recipe.name + '.png';
}

function getCardImageSrc(item) {
    if (item && Array.isArray(item.tags) && item.tags.includes('ai')) {
        return 'Cards-Icons/AI/' + item.name + '.png';
    }
    return 'Cards-Icons/' + item.name + '.png';
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
        img.src = getRecipeImageSrc(recipe);
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
            const item = items.find(i => i.name === ing.name);
            const owned = collection[ing.name] || 0;
            const ok = owned >= ing.amount;
            const ingChance = getItemChance(ing.name);
            const ingSquare = document.createElement('div');
            ingSquare.className = 'craft-ing-square' + (ok ? ' ok' : ' missing');
            ingSquare.innerHTML = `
                <img src="${getCardImageSrc(item)}" alt="${ing.name}" onerror="this.style.display='none'">
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
    img.src = getRecipeImageSrc(recipe);
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
        const item = items.find(i => i.name === ing.name);
        const owned = collection[ing.name] || 0;
        const ok = owned >= ing.amount;
        const ingChance = getItemChance(ing.name);
        const sq = document.createElement('div');
        sq.className = 'craft-selected-ing-sq' + (ok ? ' ok' : ' missing');
        sq.innerHTML = `
            <img src="${getCardImageSrc(item)}" alt="${ing.name}" onerror="this.style.display='none'">
            <div class="craft-selected-ing-name">${ing.name}</div>
            <div class="craft-selected-ing-qty ${ok ? 'qty-ok' : 'qty-missing'}">${owned} / ${ing.amount}</div>
            <div class="craft-selected-ing-rarity">${getRarityTag(ingChance)}</div>
        `;
        ingsRow.appendChild(sq);
    }
    box.appendChild(ingsRow);

    // Craft buttons row
    const btnsRow = document.createElement('div');
    btnsRow.style.cssText = 'display:flex;gap:0.5em;flex-wrap:wrap;margin-top:0.5em;';

    // CRAFT ×1
    const btn = document.createElement('button');
    btn.className = 'craft-selected-btn' + (canCraft ? ' active' : ' disabled');
    btn.style.cssText = 'flex:1;min-width:80px;';
    btn.textContent = canCraft ? `CRAFT ×1` : 'Missing';
    btn.onclick = canCraft
        ? () => { craftItem(recipe); renderSelectedRecipe(recipe); }
        : () => showCraftMessage("Not enough items!", "error");
    btnsRow.appendChild(btn);

    // CRAFT ALL
    const btnAll = document.createElement('button');
    btnAll.className = 'craft-selected-btn' + (maxCrafts > 0 ? ' active' : ' disabled');
    btnAll.style.cssText = 'flex:1;min-width:80px;background:linear-gradient(135deg,#27ae60,#1e8449);';
    btnAll.textContent = maxCrafts > 0 ? `ALL ×${maxCrafts}` : 'ALL';
    btnAll.onclick = maxCrafts > 0
        ? () => { craftMultiple(recipe, maxCrafts); renderSelectedRecipe(recipe); }
        : () => showCraftMessage("Not enough items!", "error");
    btnsRow.appendChild(btnAll);

    // CRAFT N row
    const btnNRow = document.createElement('div');
    btnNRow.style.cssText = 'display:flex;gap:0.4em;align-items:center;width:100%;margin-top:0.3em;';

    const nInput = document.createElement('input');
    nInput.type = 'number';
    nInput.min = '1';
    nInput.max = String(maxCrafts);
    nInput.value = '1';
    nInput.style.cssText = 'flex:1;padding:0.5em 0.7em;border-radius:8px;border:1.5px solid rgba(52,152,219,0.4);background:rgba(255,255,255,0.07);color:#fff;font-size:1em;text-align:center;outline:none;min-width:0;';
    nInput.placeholder = 'N';

    const btnN = document.createElement('button');
    btnN.className = 'craft-selected-btn active';
    btnN.style.cssText = 'flex:2;min-width:80px;background:linear-gradient(135deg,#2980b9,#1a5276);';
    btnN.textContent = 'CRAFT ×N';
    btnN.onclick = () => {
        const n = parseInt(nInput.value);
        if (!n || n < 1) { showCraftMessage("Enter a valid number!", "error"); return; }
        const actualMax = Math.min(...recipe.ingredients.map(ing => Math.floor((collection[ing.name] || 0) / ing.amount)));
        if (n > actualMax) { showCraftMessage(`Not enough items (max: ${actualMax})`, "error"); return; }
        craftMultiple(recipe, n);
        renderSelectedRecipe(recipe);
    };
    btnNRow.appendChild(nInput);
    btnNRow.appendChild(btnN);

    box.appendChild(btnsRow);
    if (maxCrafts > 0) box.appendChild(btnNRow);
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
        showCraftMessage("Effect ended", "info");
    }
    
    activeEffectsDiv.innerHTML = '';

    // ── Calcul des stats réelles (upgrades + potions) ──
    const potionRollSpeed   = activeEffects.rollspeed  ? activeEffects.rollspeed.power  : 1;
    const potionLuckMult    = activeEffects.luck        ? activeEffects.luck.power        : 1;
    const potionTokenSpeed  = activeEffects.tokenspeed ? activeEffects.tokenspeed.power : 1;

    const upgradeRollSpeed  = 1 + rollSpeedUpgradeLevel * 0.2; // +0.2 roll/s per level
    const upgradeLuckMult   = 1 + luckUpgradeLevel  * 0.5;
    const upgradeTokenSpeed = 1 + tokenUpgradeLevel * 0.5;  // chaque niveau = +50% de la base
    const upgradeTokenRate  = (0.2 + tokenUpgradeLevel * 0.2).toFixed(1); // tokens/s réels

    const totalRollSpeed  = potionRollSpeed  * upgradeRollSpeed;
    const sugarRushMult   = sugarRushRolls > 0 ? 2 : 1;
    const ventrePleinMult = ventrePleinRolls > 0 ? 1.5 : 1;
    const totalLuck       = (potionLuckMult  * upgradeLuckMult * sugarRushMult * ventrePleinMult).toFixed(2);
    const totalTokenSpeed = (potionTokenSpeed * upgradeTokenSpeed).toFixed(2);
    const realTokenRate   = (parseFloat(upgradeTokenRate) * potionTokenSpeed).toFixed(2);

    // Délai effectif en ms
    const effectiveDelay  = Math.max(50, Math.round(1000 / totalRollSpeed));

    // ── Section stats toujours visible ──
    const statsSection = document.createElement('div');
    statsSection.style.cssText = `
        margin-bottom: 1em;
        padding-bottom: 1em;
        border-bottom: 1px solid rgba(231,76,60,0.3);
    `;
    statsSection.innerHTML = `
        <div style="font-weight:bold;color:#e74c3c;margin-bottom:0.6em;">📊 Current Stats</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.88em;">
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;">
                <div style="color:#7f8c8d;font-size:0.78em;text-transform:uppercase;letter-spacing:0.4px;">⚡ Roll Speed</div>
                <div style="color:#27ae60;font-weight:bold;">×${totalRollSpeed}
                    <span style="color:#555;font-size:0.8em;font-weight:normal;">(${effectiveDelay}ms)</span>
                </div>
                <div style="color:#555;font-size:0.75em;">base ×${upgradeRollSpeed}${potionRollSpeed > 1 ? ` · potion ×${potionRollSpeed}` : ''}</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;">
                <div style="color:#7f8c8d;font-size:0.78em;text-transform:uppercase;letter-spacing:0.4px;">🍀 Luck</div>
                <div style="color:#3498db;font-weight:bold;">×${totalLuck}</div>
                <div style="color:#555;font-size:0.75em;">upgrade ×${upgradeLuckMult.toFixed(2)}${potionLuckMult > 1 ? ` · potion ×${potionLuckMult}` : ''}</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;">
                <div style="color:#7f8c8d;font-size:0.78em;text-transform:uppercase;letter-spacing:0.4px;">🪙 Token Rate</div>
                <div style="color:#f39c12;font-weight:bold;">${realTokenRate}/s</div>
                <div style="color:#555;font-size:0.75em;">base ${upgradeTokenRate}/s${potionTokenSpeed > 1 ? ` · potion ×${potionTokenSpeed}` : ''}</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;">
                <div style="color:#7f8c8d;font-size:0.78em;text-transform:uppercase;letter-spacing:0.4px;">📦 Max Tokens</div>
                <div style="color:#e67e22;font-weight:bold;">${maxToken}</div>
                <div style="color:#555;font-size:0.75em;">base ${BASE_MAX_TOKEN} + ${maxTokenUpgradeLevel} upgrades</div>
            </div>
        </div>
    `;
    activeEffectsDiv.appendChild(statsSection);

    // ── Effets actifs ──
    let hasActiveEffects = false;

    // Effet Obese
    if (obeseEndTime > now) {
        hasActiveEffects = true;
        const timeLeft = obeseEndTime - now;
        const totalDuration = 60000;
        const pct = (timeLeft / totalDuration) * 100;
        const obeseDiv = document.createElement('div');
        obeseDiv.style.cssText = "background:linear-gradient(135deg,#c0392b,#8e44ad);color:white;padding:0.8em;border-radius:8px;margin-bottom:0.5em;";
        obeseDiv.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div>' +
                    '<div style="font-weight:bold;">🍔 Obese</div>' +
                    '<div style="font-size:0.8em;opacity:0.9;">Roll Speed ×0.8</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:0.9em;font-weight:bold;">' + Math.ceil(timeLeft / 1000) + 's left</div>' +
                    '<div style="font-size:0.75em;opacity:0.75;">' + Math.floor((totalDuration - timeLeft)/1000) + 's / 60s</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:0.5em;background:rgba(0,0,0,0.25);border-radius:999px;height:6px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,pct)) + '%;height:100%;background:rgba(255,255,255,0.85);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>';
        activeEffectsDiv.appendChild(obeseDiv);
    }

    // Effet Bleeding
    if (bleedingEndTime > now) {
        hasActiveEffects = true;
        const timeLeft = bleedingEndTime - now;
        const totalDuration = 60000;
        const pct = (timeLeft / totalDuration) * 100;
        const bleedingDiv = document.createElement('div');
        bleedingDiv.style.cssText = "background:linear-gradient(135deg,#8b0000,#ff0000);color:white;padding:0.8em;border-radius:8px;margin-bottom:0.5em;";
        bleedingDiv.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div>' +
                    '<div style="font-weight:bold;">🩸 Bleeding</div>' +
                    '<div style="font-size:0.8em;opacity:0.9;">1/3 chance to lose token per second</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:0.9em;font-weight:bold;">' + Math.ceil(timeLeft / 1000) + 's left</div>' +
                    '<div style="font-size:0.75em;opacity:0.75;">' + Math.floor((totalDuration - timeLeft)/1000) + 's / 60s</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:0.5em;background:rgba(0,0,0,0.25);border-radius:999px;height:6px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,pct)) + '%;height:100%;background:rgba(255,255,255,0.85);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>';
        activeEffectsDiv.appendChild(bleedingDiv);
    }

    // Effets de potions (temporels)
    for (let effectType in activeEffects) {
        hasActiveEffects = true;
        const effect = activeEffects[effectType];
        const timeLeft = Math.max(0, effect.endTime - now);
        const totalDuration = effect.totalDuration || 60000;
        const pct = (timeLeft / totalDuration) * 100;
        const queued = potionQueues[effectType] || 0;
        let effectName = "", effectIcon = "?";
        switch (effectType) {
            case "rollspeed":  effectName = "Roll Speed";  effectIcon = "⚡"; break;
            case "luck":       effectName = "Luck";        effectIcon = "🍀"; break;
            case "tokenspeed": effectName = "Token Speed"; effectIcon = "🪙"; break;
            case "craftspeed": effectName = "Craft Speed"; effectIcon = "⚗️"; break;
        }
        const bg = effectType === "craftspeed" ? "background:linear-gradient(135deg,#16a085,#1abc9c)" : "background:linear-gradient(135deg,#9b59b6,#8e44ad)";
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = bg + ";color:white;padding:0.8em;border-radius:8px;margin-bottom:0.5em;";
        const queueDots = queued > 0
            ? Array.from({length: Math.min(queued, 8)}).map(() =>
                '<div style="height:5px;flex:1;max-width:24px;background:rgba(241,196,15,0.7);border-radius:999px;"></div>'
              ).join('') : '';
        effectDiv.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div>' +
                    '<div style="font-weight:bold;">' + effectIcon + ' ' + effect.potionName + '</div>' +
                    '<div style="font-size:0.8em;opacity:0.9;">' + effectName + ' ×' + effect.power + '</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:0.9em;font-weight:bold;">' + Math.ceil(timeLeft / 1000) + 's left</div>' +
                    '<div style="font-size:0.75em;opacity:0.75;">' + Math.floor((totalDuration - timeLeft)/1000) + 's / ' + Math.floor(totalDuration/1000) + 's</div>' +
                    (queued > 0 ? '<div style="font-size:0.78em;color:#f1c40f;margin-top:0.2em;">⏳ ' + queued + ' in queue</div>' : '') +
                '</div>' +
            '</div>' +
            '<div style="margin-top:0.5em;background:rgba(0,0,0,0.25);border-radius:999px;height:6px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,pct)) + '%;height:100%;background:rgba(255,255,255,0.85);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>' +
            (queued > 0 ? '<div style="margin-top:0.3em;display:flex;gap:0.3em;">' + queueDots + '</div>' : '');
        activeEffectsDiv.appendChild(effectDiv);
    }
    // Effets basés sur les rolls
    for (let effectType in rollBasedEffects) {
        hasActiveEffects = true;
        const effect = rollBasedEffects[effectType];
        const pct = ((effect.rollLimit - effect.rollsUsed) / effect.rollLimit) * 100;
        let effectName = "", effectIcon = "?";
        switch (effectType) {
            case "rollspeed":  effectName = "Roll Speed";  effectIcon = "⚡"; break;
            case "luck":       effectName = "Luck";        effectIcon = "🍀"; break;
            case "tokenspeed": effectName = "Token Speed"; effectIcon = "🪙"; break;
            case "craftspeed": effectName = "Craft Speed"; effectIcon = "⚗️"; break;
        }
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = "background:linear-gradient(135deg,#e67e22,#d35400);color:white;padding:0.8em;border-radius:8px;margin-bottom:0.5em;";
        effectDiv.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div>' +
                    '<div style="font-weight:bold;">' + effectIcon + ' ' + effect.potionName + '</div>' +
                    '<div style="font-size:0.8em;opacity:0.9;">' + effectName + ' ×' + effect.power + '</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:0.9em;font-weight:bold;">' + (effect.rollLimit - effect.rollsUsed) + ' rolls left</div>' +
                    '<div style="font-size:0.75em;opacity:0.75;">Active for ' + effect.rollsUsed + ' / ' + effect.rollLimit + ' rolls</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:0.5em;background:rgba(0,0,0,0.25);border-radius:999px;height:6px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,pct)) + '%;height:100%;background:rgba(255,255,255,0.85);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>';
        activeEffectsDiv.appendChild(effectDiv);
    }
    // Sugar Rush dans la liste des effets
    if (sugarRushRolls > 0) {
        hasActiveEffects = true;
        const srPct = (sugarRushRolls / 10) * 100;
        const srDiv = document.createElement('div');
        srDiv.style.cssText = "background:linear-gradient(135deg,#f39c12,#e67e22);color:white;padding:0.8em;border-radius:8px;margin-bottom:0.5em;";
        srDiv.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div><div style="font-weight:bold;">🍬 Sugar Rush</div>' +
                '<div style="font-size:0.8em;opacity:0.9;">Luck ×2</div></div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:0.9em;font-weight:bold;">' + sugarRushRolls + ' rolls left</div>' +
                    '<div style="font-size:0.75em;opacity:0.75;">Active for ' + (10 - sugarRushRolls) + ' / 10 rolls</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:0.5em;background:rgba(0,0,0,0.25);border-radius:999px;height:6px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,srPct)) + '%;height:100%;background:rgba(255,255,255,0.85);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>';
        activeEffectsDiv.appendChild(srDiv);
    }

    // Ventre Plein dans la liste des effets
    if (ventrePleinRolls > 0) {
        hasActiveEffects = true;
        const vpPct = (ventrePleinRolls / 10) * 100;
        const vpDiv = document.createElement('div');
        vpDiv.style.cssText = "background:linear-gradient(135deg,#e67e22,#c0392b);color:white;padding:0.8em;border-radius:8px;margin-bottom:0.5em;";
        vpDiv.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div><div style="font-weight:bold;">🍔 Full Belly</div>' +
                '<div style="font-size:0.8em;opacity:0.9;">Luck ×1.5</div></div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:0.9em;font-weight:bold;">' + ventrePleinRolls + ' rolls left</div>' +
                    '<div style="font-size:0.75em;opacity:0.75;">Active for ' + (10 - ventrePleinRolls) + ' / 10 rolls</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:0.5em;background:rgba(0,0,0,0.25);border-radius:999px;height:6px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,vpPct)) + '%;height:100%;background:rgba(255,255,255,0.85);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>';
        activeEffectsDiv.appendChild(vpDiv);
    }

    // Message si aucun effet actif
    if (!hasActiveEffects) {
        const noEffect = document.createElement('div');
        noEffect.style.cssText = 'color:#7f8c8d;font-style:italic;text-align:center;padding:1em 0 0.5em;';
        noEffect.textContent = 'No active effects.';
        activeEffectsDiv.appendChild(noEffect);
    }

    updateRollEffectsIndicator();
}

function updateRollEffectsIndicator() {
    const indicator = document.getElementById('roll-effects-indicator');
    if (!indicator) return;
    indicator.innerHTML = '';
    const now = Date.now();

    function makeChip(bgColor, iconText, labelText, subText, pct) {
        const chip = document.createElement('div');
        chip.style.cssText = 'background:' + bgColor + ';color:white;border-radius:10px;padding:0.35em 0.65em;font-size:0.8em;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.35);min-width:90px;text-align:center;';
        chip.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:0.4em;">' +
                '<span>' + iconText + ' ' + labelText + '</span>' +
                '<span style="font-weight:normal;opacity:0.85;font-size:0.9em;">' + subText + '</span>' +
            '</div>' +
            '<div style="margin-top:0.3em;background:rgba(0,0,0,0.25);border-radius:999px;height:4px;overflow:hidden;">' +
                '<div style="width:' + Math.max(0,Math.min(100,pct)) + '%;height:100%;background:rgba(255,255,255,0.8);border-radius:999px;transition:width 0.3s;"></div>' +
            '</div>';
        return chip;
    }

    for (let effectType in activeEffects) {
        const effect = activeEffects[effectType];
        const timeLeft = Math.max(0, effect.endTime - now);
        const totalDuration = effect.totalDuration || 60000;
        const pct = (timeLeft / totalDuration) * 100;
        const queued = potionQueues[effectType] || 0;
        let icon = "?";
        switch (effectType) {
            case "rollspeed": icon = "??"; break;
            case "luck":      icon = "??"; break;
            case "tokenspeed":icon = "??"; break;
        }
        const sub = Math.ceil(timeLeft/1000) + 's' + (queued > 0 ? ' +' + queued : '');
        indicator.appendChild(makeChip('#8e44ad', icon, 'x' + effect.power, sub, pct));
    }

    for (let effectType in rollBasedEffects) {
        const effect = rollBasedEffects[effectType];
        const pct = ((effect.rollLimit - effect.rollsUsed) / effect.rollLimit) * 100;
        let icon = "?";
        switch (effectType) {
            case "rollspeed": icon = "??"; break;
            case "luck":      icon = "??"; break;
            case "tokenspeed":icon = "??"; break;
        }
        indicator.appendChild(makeChip('#d35400', icon, 'x' + effect.power, effect.rollsUsed + '/' + effect.rollLimit, pct));
    }

    if (obeseEndTime > now) {
        const timeLeft = obeseEndTime - now;
        const pct = (timeLeft / 60000) * 100;
        indicator.appendChild(makeChip('#c0392b', '🍔', 'x0.8', Math.ceil(timeLeft/1000) + 's', pct));
    } else {
        if (sugarRushRolls > 0) {
            indicator.appendChild(makeChip('#f39c12', '🍬', '×2', sugarRushRolls + '/10', (sugarRushRolls/10)*100));
        }
        if (ventrePleinRolls > 0) {
            indicator.appendChild(makeChip('#c0392b', '🍔', '×1.5', ventrePleinRolls + '/10', (ventrePleinRolls/10)*100));
        }
    }
}

// ═══════════════════════════════════════════════
// VISUAL EFFECTS SYSTEM
// ═══════════════════════════════════════════════

(function() {
    // ── Sugar Rush: rising streaks ──
    let srCanvas = null, srCtx = null, srAnim = null;
    let srStreaks = [];

    function srCreate() {
        if (srCanvas) return;
        srCanvas = document.createElement('canvas');
        srCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
        document.body.appendChild(srCanvas);
        srCtx = srCanvas.getContext('2d');
        srResize();
        window.addEventListener('resize', srResize);
    }
    function srResize() {
        if (!srCanvas) return;
        srCanvas.width  = window.innerWidth;
        srCanvas.height = window.innerHeight;
    }
    function srDestroy() {
        if (srAnim) { cancelAnimationFrame(srAnim); srAnim = null; }
        if (srCanvas) { srCanvas.remove(); srCanvas = null; srCtx = null; }
        srStreaks = [];
    }
    function srSpawn() {
        // Speed increases with fewer rolls left (inverse: faster when more rolls)
        const intensity = sugarRushRolls / 10; // 0..1
        const speedBase = 2 + intensity * 8;
        srStreaks.push({
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            len: 30 + Math.random() * 80,
            speed: speedBase + Math.random() * 4,
            alpha: 0.4 + Math.random() * 0.5,
            color: Math.random() < 0.6 ? '#ffffff' : '#ffb6e6', // white or pink
            width: 1 + Math.random() * 1.5,
        });
    }
    function srTick() {
        if (!srCanvas || sugarRushRolls <= 0) { srDestroy(); return; }
        srCtx.clearRect(0, 0, srCanvas.width, srCanvas.height);
        // Spawn new streaks based on intensity
        const spawnRate = 1 + Math.floor(sugarRushRolls / 3);
        for (let i = 0; i < spawnRate; i++) {
            if (Math.random() < 0.3) srSpawn();
        }
        // Update and draw
        srStreaks = srStreaks.filter(s => s.y + s.len > -10);
        for (const s of srStreaks) {
            s.y -= s.speed;
            const grad = srCtx.createLinearGradient(s.x, s.y + s.len, s.x, s.y);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, s.color.replace(')', ',' + s.alpha + ')').replace('rgb','rgba').replace('#', 'rgba(').replace(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i, (m,r,g,b) => parseInt(r,16)+','+parseInt(g,16)+','+parseInt(b,16)));
            // Simpler: just use globalAlpha
            srCtx.save();
            srCtx.globalAlpha = s.alpha;
            srCtx.strokeStyle = s.color;
            srCtx.lineWidth = s.width;
            srCtx.beginPath();
            srCtx.moveTo(s.x, s.y + s.len);
            srCtx.lineTo(s.x, s.y);
            srCtx.stroke();
            srCtx.restore();
        }
        srAnim = requestAnimationFrame(srTick);
    }
    function updateSugarRushFX() {
        if (sugarRushRolls > 0) {
            srCreate();
            if (!srAnim) srAnim = requestAnimationFrame(srTick);
        } else {
            srDestroy();
        }
    }

    // ── Full Belly / Obese / Bleeding: screen border glows ──
    let borderDiv = null;
    function updateBorderFX() {
        const now = Date.now();
        const isObese    = obeseEndTime    > now;
        const isBleeding = bleedingEndTime > now;
        const isFullBelly = !isObese && ventrePleinRolls > 0;

        if (!isObese && !isFullBelly && !isBleeding) {
            if (borderDiv) { borderDiv.remove(); borderDiv = null; }
            return;
        }
        if (!borderDiv) {
            borderDiv = document.createElement('div');
            borderDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;border-radius:0;';
            document.body.appendChild(borderDiv);
        }

        if (isObese) {
            const pct = Math.max(0, (obeseEndTime - now) / 60000);
            const alpha = 0.25 + pct * 0.25;
            borderDiv.style.boxShadow = `inset 0 0 60px 20px rgba(192,57,43,${alpha.toFixed(2)}), inset 0 0 120px 40px rgba(192,57,43,${(alpha*0.5).toFixed(2)})`;
        } else if (isBleeding) {
            // Pulsing red glow — faster pulse as time runs out
            const pct = Math.max(0, (bleedingEndTime - now) / 60000);
            const pulse = 0.5 + 0.5 * Math.sin(now / (200 + pct * 300)); // faster near end
            const alpha = (0.2 + pct * 0.2) * (0.7 + 0.3 * pulse);
            borderDiv.style.boxShadow = `inset 0 0 80px 30px rgba(180,0,0,${alpha.toFixed(2)}), inset 0 0 160px 60px rgba(120,0,0,${(alpha*0.4).toFixed(2)})`;
        } else if (isFullBelly) {
            const pct = ventrePleinRolls / 10;
            const alpha = 0.18 + pct * 0.22;
            borderDiv.style.boxShadow = `inset 0 0 60px 20px rgba(230,126,34,${alpha.toFixed(2)}), inset 0 0 120px 40px rgba(230,126,34,${(alpha*0.5).toFixed(2)})`;
        }
    }

    // ── Expose update functions ──
    window._updateSugarRushFX = updateSugarRushFX;
    window._updateBorderFX    = updateBorderFX;

    // Animate border continuously
    (function borderLoop() {
        updateBorderFX();
        requestAnimationFrame(borderLoop);
    })();
})();

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
                typeText = "Roll Speed";
                break;
            case "luck":
                typeText = "Luck";
                break;
            case "tokenspeed":
                typeText = "Token Speed";
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
        useButton.innerText = 'Use';
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
    if (potion.effectType === "rolls") {
        const rollLimit = potion.rollLimit || 10;
        rollBasedEffects[potion.type] = {
            power: potion.power, rollsUsed: 0, rollLimit: rollLimit, potionName: potion.name
        };
        let msg = "";
        switch (potion.type) {
            case "rollspeed":  msg = "Roll Speed ×" + potion.power + " for " + rollLimit + " rolls!"; break;
            case "luck":       msg = "Luck ×" + potion.power + " for " + rollLimit + " rolls!"; break;
            case "tokenspeed": msg = "Token Speed ×" + potion.power + " for " + rollLimit + " rolls!"; break;
            case "craftspeed": msg = "Craft Speed ×" + potion.power + " for " + rollLimit + " rolls!"; break;
        }
        showCraftMessage(msg, "success");
    } else {
        if (activeEffects[potion.type]) {
            potionQueues[potion.type] = (potionQueues[potion.type] || 0) + 1;
            showCraftMessage(potion.name + " added to queue (" + potionQueues[potion.type] + " waiting)", "success");
        } else {
            activatePotionEffect(potion.type, potion.power, potion.name, potion.duration);
            let msg = "";
            switch (potion.type) {
                case "rollspeed":  msg = "Roll Speed ×" + potion.power + "!"; break;
                case "luck":       msg = "Luck ×" + potion.power + "!"; break;
                case "tokenspeed": msg = "Token Speed ×" + potion.power + "!"; break;
                case "craftspeed": msg = "Craft Speed ×" + potion.power + "!"; break;
            }
            showCraftMessage(msg, "success");
        }
    }
    saveCollection();
    updateActiveEffects();
}

function activatePotionEffect(effectType, power, potionName, duration) {
    const now = Date.now();
    activeEffects[effectType] = {
        power: power, endTime: now + duration, startTime: now,
        totalDuration: duration, potionName: potionName,
        _duration: duration, _power: power, _name: potionName
    };
    activeEffects[effectType]._timeoutId = setTimeout(function() {
        consumePotionEffectOrDequeue(effectType);
    }, duration);
}

function consumePotionEffectOrDequeue(effectType) {
    const queued = potionQueues[effectType] || 0;
    const prev = activeEffects[effectType];
    if (queued > 0) {
        const dur = prev ? prev._duration : 60000;
        const pw  = prev ? prev._power    : 1;
        const nm  = prev ? prev._name     : effectType;
        potionQueues[effectType] = queued - 1;
        if (potionQueues[effectType] === 0) delete potionQueues[effectType];
        activatePotionEffect(effectType, pw, nm, dur);
        showCraftMessage("Next " + nm + " from queue! (" + (potionQueues[effectType] || 0) + " left)", "success");
    } else {
        delete activeEffects[effectType];
        showCraftMessage(effectType.replace("rollspeed","Roll Speed").replace("luck","Luck").replace("tokenspeed","Token Speed").replace("craftspeed","Craft Speed") + " effect ended", "info");
    }
    saveCollection();
    updateActiveEffects();
}

function removePotionEffect(effectType) {
    if (activeEffects[effectType]) {
        if (activeEffects[effectType]._timeoutId) clearTimeout(activeEffects[effectType]._timeoutId);
        delete activeEffects[effectType];
        delete potionQueues[effectType];
        updateActiveEffects();
    }
}

function updateActiveEffects() {
    const now = Date.now();
    // Déclencher la queue pour les effets expirés non traités par leur timeout
    for (let effectType of Object.keys(activeEffects)) {
        if (activeEffects[effectType].endTime <= now) {
            consumePotionEffectOrDequeue(effectType);
        }
    }
    let rollSpeedMultiplier = 1;
    let luckMultiplier = 1;
    let tokenSpeedMultiplier = 1;
    let craftSpeedMultiplier = 1;
    for (let effectType in activeEffects) {
        switch (effectType) {
            case "rollspeed":  rollSpeedMultiplier  = activeEffects[effectType].power; break;
            case "luck":       luckMultiplier       = activeEffects[effectType].power; break;
            case "tokenspeed": tokenSpeedMultiplier = activeEffects[effectType].power; break;
            case "craftspeed": craftSpeedMultiplier = activeEffects[effectType].power; break;
        }
    }
    
    // Obese reduces roll speed to 0.8x
    if (obeseEndTime > now) {
        rollSpeedMultiplier *= 0.8;
    }

    rollDelay = Math.max(50, 1000 / rollSpeedMultiplier);
    luck = luckMultiplier;
    tokenRate = (0.2 + tokenUpgradeLevel * 0.1) * tokenSpeedMultiplier;
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

function getSweetTag(item) {
    if (item && Array.isArray(item.tags) && item.tags.includes('sweet')) {
        return '<span class="rarity-tag rarity-sweet">🍬 Sweet</span>';
    }
    return '';
}

function getCaloricTag(item) {
    if (item && Array.isArray(item.tags) && item.tags.includes('caloric')) {
        return '<span class="rarity-tag rarity-caloric">🍔 Caloric</span>';
    }
    return '';
}

function getAiTag(item) {
    if (item && Array.isArray(item.tags) && item.tags.includes('ai')) {
        return '<span class="rarity-tag rarity-ai">🤖 AI</span>';
    }
    return '';
}

function getSharpTag(item) {
    if (item && Array.isArray(item.tags) && item.tags.includes('Sharp')) {
        return '<span class="rarity-tag rarity-cutting">🗡️ Sharp</span>';
    }
    return '';
}

function getSpecialTags(item) {
    return getSweetTag(item) + getCaloricTag(item) + getAiTag(item) + getSharpTag(item);
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

function startBleeding() {
    if (bleedingIntervalId !== null) return;

    const rollBtn = document.getElementById('roll-button');
    if (rollBtn) rollBtn.classList.add('bleeding');

    let tickCounter = 0;
    bleedingIntervalId = setInterval(() => {
        if (Date.now() < bleedingEndTime) {
            // Continuous particle stream (≈10/s)
            showBleedingEffect(1, false);

            // Every 10 ticks (≈1 second) evaluate token loss
            tickCounter++;
            if (tickCounter >= 10) {
                tickCounter = 0;
                if (Math.floor(Math.random() * 3) === 0) {
                    if (tokens > 0) {
                        tokens--;
                        updateTokensDisplay();
                    }
                    // Burst of particles when token loss is attempted (pulse)
                    showBleedingEffect(100, true);
                }
            }
        } else {
            stopBleeding();
        }
    }, 100); // 10 ticks per second
}

function stopBleeding() {
    if (bleedingIntervalId !== null) {
        clearInterval(bleedingIntervalId);
        bleedingIntervalId = null;
    }
    stopBleedingAnimation();

    const rollBtn = document.getElementById('roll-button');
    if (rollBtn) rollBtn.classList.remove('bleeding');

    updateActiveEffectsDisplay();
}

function startBleedingAnimation() {
    if (bleedingAnimationId !== null) return;
    let lastTs = null;

    const animate = (ts) => {
        if (lastTs === null) lastTs = ts;
        const dt = Math.min(50, ts - lastTs);
        lastTs = ts;

        // Update particles
        for (let i = bleedingParticles.length - 1; i >= 0; i--) {
            const p = bleedingParticles[i];
            p.life -= dt;
            if (p.life <= 0) {
                if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
                bleedingParticles.splice(i, 1);
                continue;
            }

            // Physics
            p.vy += p.gravity * (dt / 16);
            p.x += p.vx * (dt / 16);
            p.y += p.vy * (dt / 16);
            const alpha = Math.max(0, p.life / p.maxLife);

            p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
            p.el.style.opacity = alpha;
        }

        if (bleedingParticles.length > 0) {
            bleedingAnimationId = requestAnimationFrame(animate);
        } else {
            bleedingAnimationId = null;
        }
    };

    bleedingAnimationId = requestAnimationFrame(animate);
}

function stopBleedingAnimation() {
    if (bleedingAnimationId !== null) {
        cancelAnimationFrame(bleedingAnimationId);
        bleedingAnimationId = null;
    }
    bleedingParticles.forEach(p => {
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
    });
    bleedingParticles = [];
}

function showBleedingEffect(count, tokenLost) {
    const container = document.body;

    for (let i = 0; i < count; i++) {
        const delay = Math.random() * (tokenLost ? 80 : 300);
        setTimeout(() => {
            // Drop shape: tall and narrow (like a blood drop)
            const w = 5 + Math.random() * 7;
            const h = w * (1.5 + Math.random());
            const el = document.createElement('div');
            const alpha = 0.5 + Math.random() * 0.45;
            el.style.cssText = `
                position: fixed;
                width: ${w}px;
                height: ${h}px;
                background-color: rgba(${tokenLost ? '220,20,20' : '180,10,10'},${alpha});
                border-radius: 50% 50% 60% 60%;
                pointer-events: none;
                z-index: 9999;
                transform-origin: center top;
            `;

            let startX, startY, vx, vy, gravity, maxLife;

            if (tokenLost) {
                // Burst from center — blood splatter flying up then falling
                startX = window.innerWidth / 2 + (Math.random() - 0.5) * 120;
                startY = window.innerHeight / 2 + (Math.random() - 0.5) * 80;
                vx = (Math.random() - 0.5) * 30;
                vy = -(10 + Math.random() * 20);
                gravity = 0.8;
                maxLife = 1200 + Math.random() * 600;
            } else {
                // Drip from top edge, falling down
                startX = Math.random() * window.innerWidth;
                startY = -h;
                vx = (Math.random() - 0.5) * 2;
                vy = 1.5 + Math.random() * 2.5;
                gravity = 0.04;
                maxLife = 1800 + Math.random() * 800;
            }

            const particle = {
                el,
                x: startX,
                y: startY,
                vx, vy, gravity,
                rotation: Math.random() * 20 - 10,
                life: maxLife,
                maxLife,
            };

            el.style.left = `${particle.x}px`;
            el.style.top = `${particle.y}px`;
            container.appendChild(el);

            bleedingParticles.push(particle);
            startBleedingAnimation();
        }, delay);
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
                <img src="${getCardImageSrc(item)}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
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
    preview.innerHTML = `
        <div class="preview-card">
            <span class="rarity-tag-container">${getGoldTag(type)}${getSpecialTags(selected)}</span>
            <img src="${getCardImageSrc(selected)}" alt="${selected.name}" class="card-image">
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
    const sugarRushLuck = sugarRushRolls > 0 ? 2 : 1;
    const ventrePleinLuck = ventrePleinRolls > 0 ? 1.5 : 1;
    luck = potionLuck * upgradeLuck * sugarRushLuck * ventrePleinLuck;
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
                showCraftMessage("Roll-based effect ended", "info");
            }
        }
    
    // Sauvegarder immédiatement le compteur
    saveCollection();

    // Simuler le roll
    setTimeout(() => {
        // ── Build Rarities list: every rollable card × every variant ──
        const variants = [
            { type: '',        mult: 1      },
            { type: 'Gold',    mult: 10     },
            { type: 'Rainbow', mult: 100    },
            { type: 'Shiny',   mult: 1000   },
            { type: 'Nuclear', mult: 10000  },
        ];

        const sugarRushActive = sugarRushRolls > 0;

        const Rarities = [];
        for (const item of items.filter(i => i.rollable)) {
            const isSweet = Array.isArray(item.tags) && item.tags.includes('sweet');
            for (const variant of variants) {
                let rarity = item.chance * variant.mult;
                // Luck divides rarity, making cards more likely
                // Sugar Rush halves the rarity of sweet cards (×2 chance)
                if (sugarRushActive && isSweet) rarity = rarity / 2;
                Rarities.push({ item, type: variant.type, chanceDisplay: item.chance * variant.mult, rarity });
            }
        }

        // ── Test each card against luck ──
        // luck < rarity : random(0, rarity/luck) <= 1
        // luck > rarity : random(0, luck/rarity) <= 1  (inverted — higher chance)
        // luck === rarity: always add
        const rolls = [];
        for (const entry of Rarities) {
            const rarity = entry.rarity;
            let pass = false;
            if (luck === rarity) {
                pass = true;
            } else if (luck < rarity) {
                pass = Math.random() * (rarity / luck) <= 1;
            } else {
                // luck > rarity: flip the ratio so it becomes very likely
                pass = Math.random() * (luck / rarity) <= 1;
            }
            if (pass) rolls.push(entry);
        }

        // ── If nothing passed (extremely unlikely), fall back to the most common card ──
        const pool = rolls.length > 0 ? rolls : [Rarities[0]];

        // ── Pick one at random from the rolls list ──
        const chosen = pool[Math.floor(Math.random() * pool.length)];

        const selected     = chosen.item;
        const type         = chosen.type;
        const chanceDisplay = chosen.chanceDisplay;
        let displayName = selected.name + (type ? ` (${type})` : '');

        // XP gain: sqrt(roll chance)
        let xpGain = Math.floor(Math.sqrt(chanceDisplay));
        gainXp(xpGain);

        // Cacher l'animation et afficher la carte
        hideRollAnimation();

        // Mettre à jour l'aperçu de la carte
        updateCardPreview({ selected, type, displayName, chanceDisplay });

        (function(){
            let shouldNotify = false;

            // 1. Rarity threshold (existing behaviour)
            let thisRarity = '';
            if (chanceDisplay < 10) thisRarity = 'common';
            else if (chanceDisplay < 100) thisRarity = 'uncommon';
            else if (chanceDisplay < 1000) thisRarity = 'rare';
            else if (chanceDisplay < 10000) thisRarity = 'epic';
            else if (chanceDisplay < 100000) thisRarity = 'legendary';
            else thisRarity = 'mythic';
            let idx = rarityOrderMap[thisRarity];
            let minIdx = loadRarityBarSetting();
            if (idx >= minIdx) shouldNotify = true;

            // 2. Rarity multiplier tags (Gold / Rainbow / Shiny / Nuclear)
            if (!shouldNotify && type && loadNotifRarityTags()) {
                shouldNotify = true;
            }

            // 3. Special tags (sweet, caloric, …)
            if (!shouldNotify && Array.isArray(selected.tags) && selected.tags.length > 0 && loadNotifSpecialTags()) {
                shouldNotify = true;
            }

            if (shouldNotify) {
                let audio = document.getElementById('notification-sound');
                if (audio) { audio.currentTime = 0; audio.play(); }
            }
        })();

        // Comptage
        if (!collection[displayName]) {
            collection[displayName] = 1;
        } else {
            collection[displayName]++;
        }
        // Track discovered tag types
        if (type) discoveredTags.add(type);
        // Track discovered special tags from the rolled card
        if (Array.isArray(selected.tags)) {
            for (const t of selected.tags) {
                if (['sweet','caloric','Sharp','ai'].includes(t)) {
                    discoveredSpecialTags.add(t.toLowerCase());
                }
            }
        }

        // ── Sugar Rush ──
        const rolledIsSweet = Array.isArray(selected.tags) && selected.tags.includes('sweet');

        const sugarMagnetCount = getEquippedCount('Sugar Magnet');
        if (rolledIsSweet) {
            // Sugar Magnet: always trigger, +1 roll per equipped (not cumulable for the base +4)
            const guaranteed = sugarMagnetCount > 0;
            if (guaranteed || Math.floor(Math.random() * 3) === 0) {
                const bonusRolls = 4 + sugarMagnetCount; // base +4, +1 per magnet
                const before = sugarRushRolls;
                sugarRushRolls = Math.min(10, sugarRushRolls + bonusRolls);
                const added = sugarRushRolls - before;
                const magnetNote = sugarMagnetCount > 0 ? ` 🧲×${sugarMagnetCount}` : '';
                discoveredEffects.add('sugarRush');
                showCraftMessage(`🍬 Sugar Rush! +${added} roll${added > 1 ? 's' : ''}${magnetNote} (${sugarRushRolls} remaining)`, "success");
            }
        } else if (sugarRushRolls > 0) {
            // Roll normal : décrémente le compteur
            sugarRushRolls--;
            if (sugarRushRolls === 0) {
                showCraftMessage("🍬 Sugar Rush ended!", "info");
            }
        }
        // ── Ventre Plein / Obese ──
        const rolledIsCaloric = Array.isArray(selected.tags) && selected.tags.includes('caloric');

        if (rolledIsCaloric) {
            if (obeseEndTime > Date.now()) {
                // Do nothing if already Obese
            } else {
                // Roll caloric : ajoute entre 2 et 5 rolls, cap 10, ne consomme PAS le compteur
                const added = Math.floor(Math.random() * 4) + 2; // 2–5
                const before = ventrePleinRolls;
                ventrePleinRolls += added;
                if (ventrePleinRolls > 10) {
                    ventrePleinRolls = 0;
                    obeseEndTime = Date.now() + 60000;
                    discoveredEffects.add('obese');
                    showCraftMessage(`🍔 Obese! Roll speed ×0.8 for 60s`, "error");
                    updateActiveEffects();
                } else {
                    const actualAdded = ventrePleinRolls - before;
                    if (actualAdded > 0) {
                        discoveredEffects.add('fullBelly');
                        showCraftMessage(`🍔 Full Belly! +${actualAdded} roll${actualAdded > 1 ? 's' : ''} (${ventrePleinRolls} remaining)`, "success");
                    }
                }
            }
        } else if (ventrePleinRolls > 0) {
            ventrePleinRolls--;
            if (ventrePleinRolls === 0) {
                showCraftMessage("🍔 Full Belly ended!", "info");
            }
        }
        // ── Sharp / Bleeding ──
        const rolledIsSharp = Array.isArray(selected.tags) && selected.tags.includes('Sharp');

        if (rolledIsSharp) {
            // 1/4 chance to trigger bleeding
            if (Math.floor(Math.random() * 4) === 0) {
                bleedingEndTime = Date.now() + 60000; // 60 seconds
                startBleeding();
                discoveredEffects.add('bleeding');
                showCraftMessage(`🩸 Bleeding! Losing tokens for 60s`, "error");
                updateActiveEffects();
            }
        }

        updateLuck();
        if (window._updateSugarRushFX) _updateSugarRushFX();
        updateActiveEffectsDisplay();
        
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

function _getSortedCardNames() {
    let rarityOrder = chance => (chance < 10 ? 0 : chance < 100 ? 1 : chance < 1000 ? 2 : chance < 10000 ? 3 : chance < 100000 ? 4 : 5);
    return Object.keys(collection).filter(name => {
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
        let rarityA = rarityOrder(chanceA);
        let rarityB = rarityOrder(chanceB);
        if (rarityA !== rarityB) return rarityA - rarityB;
        if (chanceA !== chanceB) return chanceA - chanceB;
        return a.localeCompare(b);
    });
}

function _buildCardLi(name) {

        let type = name.endsWith('(Nuclear)') ? 'Nuclear' : name.endsWith('(Shiny)') ? 'Shiny' : name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
        let baseName = type ? name.replace(` (${type})`, '') : name;
        let item = items.find(i => i.name === baseName);
        let chanceDisplay = type === 'Nuclear' ? item.chance * 10000 : type === 'Shiny' ? item.chance * 1000 : type === 'Rainbow' ? item.chance * 100 : type === 'Gold' ? item.chance * 10 : item.chance;
        let displayName = baseName;
        let goldTag = getGoldTag(type);
        let specialTags = getSpecialTags(item);
        let rarityTag = getRarityTag(chanceDisplay);
        let imgSrc = getCardImageSrc(item);
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
                        <span class=\"rarity-tag-container\">${goldTag}${specialTags}</span>
                        <span class=\"rarity-tag-container rarity-front\" style=\"top:auto;bottom:5px;\">${rarityTag}</span>
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
        // data-card-key set by updateCollection
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
                                <div style='font-size:0.85em;color:#7f8c8d;margin:0.2em 0;'>1 in ${chanceDisplay.toLocaleString()}</div>
                                <div style='display:flex;flex-wrap:wrap;justify-content:center;gap:0.3em;margin:0.3em 0;'>${rarityTag}${goldTag}${specialTags}</div>
                                ${level >= 3 ? `<button id='compressor-btn' style='margin-top:1em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#3498db;color:white;border:none;cursor:pointer;'>Compressor</button>
                                <button id='decompressor-btn' style='margin-left:0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#16a085;color:white;border:none;cursor:pointer;'>Decompressor</button>` : ''}
                                ${level >= 7 ? `<button id='diamond-press-btn' style='margin-left:0.5em;padding:0.5em 1.5em;font-size:1em;border-radius:10px;background:#9b59b6;color:white;border:none;cursor:pointer;'>💎 Press</button>` : ''}<br>
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
                                div.title = `View group ${groupe.name}`
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
                    if (level >= 3) {
                        document.getElementById('compressor-btn').onclick = (e) => {
                            e.stopPropagation();
                            showCompressorMenu(baseName, type);
                        };
                    }
        var decompressBtn = document.getElementById('decompressor-btn');
        if (decompressBtn && level >= 3) decompressBtn.onclick = (e) => {
            e.stopPropagation();
            showDecompressorMenu(baseName, type);
        };
        var diamondPressBtn = document.getElementById('diamond-press-btn');
        if (diamondPressBtn && level >= 7) {
            const itemForDiamond = items.find(i => i.name === baseName);
            if (itemForDiamond) {
                let chanceForDiamond = itemForDiamond.chance;
                if (type === 'Nuclear') chanceForDiamond *= 10000;
                else if (type === 'Shiny') chanceForDiamond *= 1000;
                else if (type === 'Rainbow') chanceForDiamond *= 100;
                else if (type === 'Gold') chanceForDiamond *= 10;
                const gain = Math.floor(Math.pow(chanceForDiamond, 0.25));
                const cardKey = type ? `${baseName} (${type})` : baseName;
                const curOwned = collection[cardKey] || 0;

                function refreshDiamondBtn() {
                    const q = collection[cardKey] || 0;
                    if (q <= 0) {
                        diamondPressBtn.disabled = true;
                        diamondPressBtn.style.opacity = '0.5';
                        diamondPressBtn.style.cursor = 'not-allowed';
                        diamondPressBtn.innerHTML = '💎 Press (empty)';
                    } else {
                        diamondPressBtn.disabled = false;
                        diamondPressBtn.style.opacity = '1';
                        diamondPressBtn.style.cursor = 'pointer';
                        diamondPressBtn.innerHTML = `💎 +${gain} (×${q})`;
                    }
                }
                refreshDiamondBtn();

                diamondPressBtn.onclick = (e) => {
                    e.stopPropagation();
                    const cur = collection[cardKey] || 0;
                    if (cur <= 0) return;
                    diamonds += gain;
                    collection[cardKey]--;
                    if (collection[cardKey] <= 0) delete collection[cardKey];
                    gainXp(gain);
                    saveCollection(); updateCollection(); updateInventoryStats(); updateCraftButtons(); updateDiamondsDisplay();
                    refreshDiamondBtn();
                };
            }
        }
    
                    function showCompressorMenu(cardName, cardType) {
                        let item = items.find(i => i.name === cardName);
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
                                    <img src='${getCardImageSrc(item)}' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
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
        return li;
}

function updateCollection() {
    const ul = document.getElementById('collection-list');
    const sortedNames = _getSortedCardNames();

    // Build a map of currently rendered cards
    const existing = new Map();
    ul.querySelectorAll('li[data-card-key]').forEach(li => {
        existing.set(li.dataset.cardKey, li);
    });

    // Set of names that should now exist
    const desired = new Set(sortedNames);

    // 1. Remove cards no longer in collection
    existing.forEach((li, key) => {
        if (!desired.has(key)) {
            li.style.transition = 'opacity 0.25s, transform 0.25s';
            li.style.opacity = '0';
            li.style.transform = 'scale(0.85)';
            setTimeout(() => li.remove(), 260);
        }
    });

    // 2. Insert / reorder cards
    sortedNames.forEach((name, index) => {
        let li = existing.get(name);
        if (!li) {
            // New card — build and animate in
            li = _buildCardLi(name);
            li.dataset.cardKey = name;
            li.style.opacity = '0';
            li.style.transform = 'translateY(12px)';
            li.style.transition = 'opacity 0.3s, transform 0.3s';
            // Insert at correct position
            const refNode = ul.children[index] || null;
            ul.insertBefore(li, refNode);
            // Trigger animation
            requestAnimationFrame(() => {
                li.style.opacity = '1';
                li.style.transform = '';
            });
        } else {
            // Existing card — update count in detail text only
            const detail = li.querySelector('.detail');
            if (detail) {
                const type = name.endsWith('(Nuclear)') ? 'Nuclear' : name.endsWith('(Shiny)') ? 'Shiny' : name.endsWith('(Rainbow)') ? 'Rainbow' : name.endsWith('(Gold)') ? 'Gold' : '';
                const baseName = type ? name.replace(` (${type})`, '') : name;
                const item = items.find(i => i.name === baseName);
                const chanceDisplay = type === 'Nuclear' ? item.chance * 10000 : type === 'Shiny' ? item.chance * 1000 : type === 'Rainbow' ? item.chance * 100 : type === 'Gold' ? item.chance * 10 : item.chance;
                detail.innerHTML = `${baseName}<br>1 in ${chanceDisplay}<br>×${collection[name]}`;
            }
            // Ensure correct DOM order
            const currentIndex = Array.from(ul.children).indexOf(li);
            if (currentIndex !== index) {
                const refNode = ul.children[index] || null;
                ul.insertBefore(li, refNode);
            }
        }
    });

    if (window.updateCraftButtons) window.updateCraftButtons();
}


function showDecompressorMenu(cardName, cardType) {
    let item = items.find(i => i.name === cardName);
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
        comp.innerHTML = "<b>No higher rarity to decompress.</b>";
        comp.style.display = 'block';
        return;
    }
    owned = collection[cardType ? cardName + ' (' + cardType + ')' : cardName] || 0;
    comp.innerHTML = `
        <div style='width:100%;display:flex;flex-direction:column;align-items:center;'>
            <div style='width:100%;height:120px;display:flex;align-items:center;justify-content:center;border-radius:18px 18px 0 0;'>
                <img src='${getCardImageSrc(item)}' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
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
            <img src="${getCardImageSrc(item)}" alt="${cardName}"
                style="width:54px;height:54px;object-fit:contain;border-radius:8px;display:block;margin:0 auto 0.3em auto;">
            <div style="font-size:0.78em;font-weight:bold;color:#2c3e50;margin-bottom:0.2em;">${cardName}</div>
            <div style="font-size:0.7em;color:#7f8c8d;">1 in ${item.chance}</div>
            <div style="margin:0.2em 0;">${rarityTag}</div>
            ${isOwned ? `<div style="font-size:0.68em;color:#27ae60;margin-top:0.2em;">${variantText}</div>` : `<div style="font-size:0.68em;color:#bdc3c7;margin-top:0.2em;">Not obtained</div>`}
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
    let item = items.find(i => i.name === cardName);
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
                <img src='${getCardImageSrc(item)}' style='width:auto;max-width:90%;max-height:110px;object-fit:contain;border-radius:14px;box-shadow:0 2px 12px #0002;'>
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

// ══════════════════════════════════════════════════════════
// SYSTÈME D'INTÉGRITÉ ANTI-TRICHE
// ══════════════════════════════════════════════════════════

// Seed secret obscurcié (découper en morceaux pour compliquer la recherche)
const _s = [0x4b,0x61,0x72,0x64,0x73,0x47,0x61,0x6d,0x65,0x53,0x65,0x63,0x72,0x65,0x74,0x58];

function _computeIntegrity(fields) {
    // Construire une chaîne de tous les champs clés
    const keys = Object.keys(fields).sort();
    let raw = keys.map(k => k + '=' + fields[k]).join('|');
    // Ajouter le seed
    for (let i = 0; i < _s.length; i++) raw += String.fromCharCode(_s[i]);
    // Hash djb2-like
    let h = 5381;
    for (let i = 0; i < raw.length; i++) {
        h = ((h << 5) + h) ^ raw.charCodeAt(i);
        h = h >>> 0; // force unsigned 32-bit
    }
    return h.toString(36);
}

function _buildIntegrityFields() {
    // Resume partiel : on hash uniquement les valeurs numériques clés
    // (pas la collection entière pour les performances)
    return {
        tk: tokens,
        dm: diamonds,
        xp: xp,
        lv: level,
        xn: xpNext,
        ro: rolls,
        tu: tokenUpgradeLevel,
        mu: maxTokenUpgradeLevel,
        lu: luckUpgradeLevel,
        rs: rollSpeedUpgradeLevel,
        xu: xpUpgradeLevel,
        sr: sugarRushRolls,
    };
}

function _resetToDefaults() {
    // No-op: anti-cheat is now handled by Firestore security rules.
}

// Sauvegarde l'inventaire dans localStorage
// ── Build a plain-object snapshot of the entire game state ──
function _buildSaveData() {
    return {
        collection:           collection,
        potionInventory:      potionInventory,
        potionQueues:         potionQueues,
        rollBasedEffects:     rollBasedEffects,
        rolls:                rolls,
        tokens:               tokens,
        diamonds:             diamonds,
        xp:                   xp,
        level:                level,
        xpNext:               xpNext,
        tokenUpgradeLevel:    tokenUpgradeLevel,
        maxTokenUpgradeLevel: maxTokenUpgradeLevel,
        luckUpgradeLevel:     luckUpgradeLevel,
        rollSpeedUpgradeLevel:rollSpeedUpgradeLevel,
        xpUpgradeLevel:       xpUpgradeLevel,
        discoveredTags:       [...discoveredTags],
        discoveredEffects:     [...discoveredEffects],
        discoveredSpecialTags: [...discoveredSpecialTags],
        sugarRushRolls:       sugarRushRolls,
        bleedingEndTime:      bleedingEndTime,
        artifactInventory:    artifactInventory,
        equippedArtifacts:    equippedArtifacts,
        activeEffects:        Object.fromEntries(
            Object.entries(activeEffects).map(([k,v]) => [k, {
                power: v.power, endTime: v.endTime, startTime: v.startTime,
                totalDuration: v.totalDuration, potionName: v.potionName,
                _duration: v._duration, _power: v._power, _name: v._name
            }])
        ),
        lastSaved:            Date.now(),
    };
}

// Expose for firebase.js usage
window._buildSaveData = _buildSaveData;

// ── Save system ──────────────────────────────────────────────────
// saveCollection() just marks state as dirty (in-memory).
// Actual cloud pushes happen:
//   • Every 10 minutes via _autoSaveInterval
//   • On beforeunload / visibilitychange (tab hide)
//   • On manual logout (_doLogout in index.html)
//   • Via manualSave() button (1-min cooldown)

let _isDirty = false;
let _autoSaveIntervalId = null;
const AUTO_SAVE_MS = 10 * 60 * 1000; // 10 minutes

function saveCollection() {
    // Just mark dirty — no cloud write here
    _isDirty = true;
}

function _startAutoSave() {
    if (_autoSaveIntervalId) return;
    _autoSaveIntervalId = setInterval(async () => {
        if (_isDirty) await _pushCloudSave();
    }, AUTO_SAVE_MS);
}

// Manual save — called by Save buttons, 1-minute cooldown
let _lastManualSave = 0;
async function manualSave(btnId) {
    const id  = btnId || 'manual-save-btn';
    const btn = document.getElementById(id);
    const now = Date.now();
    const cooldown = 60 * 1000; // 1 minute
    const remaining = cooldown - (now - _lastManualSave);

    if (remaining > 0) {
        const secs = Math.ceil(remaining / 1000);
        if (btn) {
            btn.disabled = true;
            btn.textContent = '⏳ ' + secs + 's';
            // Tick down
            const iv = setInterval(() => {
                const r2 = cooldown - (Date.now() - _lastManualSave);
                if (r2 <= 0) { clearInterval(iv); _refreshSaveBtns(); }
                else if (btn) btn.textContent = '⏳ ' + Math.ceil(r2/1000) + 's';
            }, 1000);
        }
        return;
    }

    _lastManualSave = now;
    _refreshSaveBtns();
    if (btn) { btn.disabled = true; btn.textContent = '💾 Saving…'; }
    try {
        await _pushCloudSave();
        if (btn) {
            btn.textContent = '✅ Saved!';
            setTimeout(() => _refreshSaveBtns(), 1500);
        }
    } catch(e) {
        if (btn) {
            btn.textContent = '❌ Failed';
            setTimeout(() => _refreshSaveBtns(), 2000);
        }
    }
}

function _refreshSaveBtns() {
    const now = Date.now();
    const cooldown = 60 * 1000;
    const canSave = (now - _lastManualSave) >= cooldown;
    ['manual-save-btn','mini-save-btn'].forEach(id => {
        const b = document.getElementById(id);
        if (!b) return;
        b.disabled = !canSave;
        if (canSave) {
            b.textContent = id === 'mini-save-btn' ? '💾' : '💾 Save';
        }
    });
}

// ── Push save to cloud ──
async function _pushCloudSave() {
    if (window._cloudSave) {
        try {
            await window._cloudSave(_buildSaveData());
            _isDirty = false;
        } catch(e) {}
    }
}

// Save on tab hide / page close
window.addEventListener('beforeunload', () => { if (_isDirty) _pushCloudSave(); });
window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && _isDirty) _pushCloudSave();
});

// ── Apply a cloud save snapshot to all game variables ──
function _applyCloudSave(save) {
    if (!save) return;  // new account — start fresh

    // Collection
    if (save.collection && typeof save.collection === 'object') {
        collection = {};
        for (const [k, v] of Object.entries(save.collection)) {
            if (typeof v === 'number' && v > 0 && v <= 1_000_000) collection[k] = v;
        }
    }
    if (save.potionInventory) {
        potionInventory = {};
        for (const [k, v] of Object.entries(save.potionInventory)) {
            if (typeof v === 'number' && v > 0 && v <= 10_000) potionInventory[k] = v;
        }
    }
    if (save.potionQueues)    { try { potionQueues    = save.potionQueues;    } catch(e) {} }
    if (save.rollBasedEffects){ try { rollBasedEffects= save.rollBasedEffects;} catch(e) {} }

    // Numerics
    rolls                = Number(save.rolls)                || 0;
    tokens               = Number(save.tokens)               || 10;
    diamonds             = Number(save.diamonds)             || 0;
    xp                   = Number(save.xp)                   || 0;
    level                = Number(save.level)                || 1;
    xpNext               = Number(save.xpNext)               || 50;
    tokenUpgradeLevel    = Number(save.tokenUpgradeLevel)    || 0;
    maxTokenUpgradeLevel = Number(save.maxTokenUpgradeLevel) || 0;
    luckUpgradeLevel     = Number(save.luckUpgradeLevel)     || 0;
    rollSpeedUpgradeLevel= Number(save.rollSpeedUpgradeLevel)|| 0;
    xpUpgradeLevel       = Number(save.xpUpgradeLevel)       || 0;
    sugarRushRolls       = Number(save.sugarRushRolls)       || 0;
    bleedingEndTime      = Number(save.bleedingEndTime)      || 0;

    // Derived
    tokenRate = 0.2 + tokenUpgradeLevel * 0.1;
    maxToken  = BASE_MAX_TOKEN + maxTokenUpgradeLevel * 5;
    tokens    = Math.min(tokens, maxToken);

    // Artifacts
    if (save.artifactInventory) artifactInventory = save.artifactInventory;
    if (save.equippedArtifacts) equippedArtifacts = save.equippedArtifacts;

    // Discovered tags
    if (Array.isArray(save.discoveredTags)) {
        discoveredTags = new Set(save.discoveredTags);
    } else {
        discoveredTags = new Set();
        for (const k of Object.keys(collection)) {
            for (const t of ['Gold','Rainbow','Shiny','Nuclear']) {
                if (k.endsWith('(' + t + ')')) discoveredTags.add(t);
            }
        }
    }
    discoveredEffects     = save.discoveredEffects     ? new Set(save.discoveredEffects)     : new Set();
    discoveredSpecialTags = save.discoveredSpecialTags ? new Set(save.discoveredSpecialTags) : new Set();

    // Active effects (re-arm timeouts)
    if (save.activeEffects && typeof save.activeEffects === 'object') {
        const now = Date.now();
        activeEffects = {};
        for (const [effectType, effect] of Object.entries(save.activeEffects)) {
            const remaining = (effect.endTime || 0) - now;
            if (remaining <= 0) continue;
            activeEffects[effectType] = { ...effect };
            activeEffects[effectType]._timeoutId = setTimeout(
                (et => () => consumePotionEffectOrDequeue(et))(effectType),
                remaining
            );
        }
    }

    // Bleeding
    if (bleedingEndTime > Date.now()) startBleeding();

    // UI
    document.getElementById('rolls-count').innerText = rolls;
    updateTokensDisplay();
    updateDiamondsDisplay();
    updateLevelXpDisplay();
    updateUnlockables();
}

// ── _onAuthReady: called by Firebase module once auth resolves ──
// save = cloud save object or null (new account)
window._onAuthReady = function(save) {
    _applyCloudSave(save);

    updateCollection();
    updateInventoryStats();
    updateCraftButtons();
    updatePotionsInventory();
    updateActiveEffects();
    updateActiveEffectsDisplay();
    resetCardPreview();
    updateLuck();

    if (craftingQueue.length > 0) startCraftingInterval();
    startRealTimeEffectsUpdate();
    startTokenRecharge();
    updateTokensDisplay();
    if (typeof startRewardsPoll === 'function') startRewardsPoll();
    _startAutoSave();
};

// ── Username stored in window._username for quick access ──
window._username = '';

function _setUsername(name) {
    window._username = name || '';
    const el = document.getElementById('username-display');
    if (el) el.textContent = '👤 ' + window._username;
}

async function changeUsername(newName) {
    newName = newName.trim();
    if (!newName || newName.length < 2) { showCraftMessage('Username must be at least 2 characters.', 'error'); return; }
    if (/\s/.test(newName)) { showCraftMessage('No spaces in username.', 'error'); return; }
    const user = window._currentUser;
    if (!user) return;

    const updateUsername = window._fbUpdateUsername;
    if (!updateUsername) { showCraftMessage('Firebase not ready', 'error'); return; }

    try {
        await updateUsername(user.uid, window._username, newName);
        window._cloudUserData = { ...window._cloudUserData, username: newName };
        _setUsername(newName);
        showCraftMessage('Username changed to ' + newName + '!', 'success');
        closeUserMenu();
    } catch(e) {
        showCraftMessage('Failed: ' + (e.message || e), 'error');
    }
}

function openUserMenu() {
    let menu = document.getElementById('user-menu');
    if (!menu) return;
    document.getElementById('user-menu-name').textContent = window._username;
    document.getElementById('user-rename-input').value = '';
    menu.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) { menu.style.display = 'none'; document.body.style.overflow = ''; }
}

// Kept for backward-compat (called in a few places but now a no-op)
function loadCollection() {}
function saveLastConnection() {
    const now = new Date();
    localStorage.setItem('cards-last-connection', now.toISOString());
}

// (Cloud save fires on beforeunload via _pushCloudSave in saveCollection block above)

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
    el.innerHTML = `Last connection: <b>${dateStr}</b><br>Time elapsed: <b>${timeStr}</b><br>Tokens earned: <b>${tokensToAdd}</b><br><br><span style='font-size:0.9em;color:#888'>(Click to continue)</span>`;
    el.style.display = 'block';
    overlay.style.display = 'block';
    el.style.cursor = 'pointer';
    el.onclick = function() {
        el.style.display = 'none';
        overlay.style.display = 'none';
    };
}

// ── Rarity tag display setting ──
function loadRarityTagDisplaySetting() {
    const v = localStorage.getItem('rarity-tag-display') || 'always';
    applyRarityTagDisplaySetting(v);
    const sel = document.getElementById('rarity-tag-display-select');
    if (sel) sel.value = v;
}
function applyRarityTagDisplaySetting(value) {
    if (value === 'onclick') {
        document.body.classList.add('rarity-tags-onclick');
    } else {
        document.body.classList.remove('rarity-tags-onclick');
    }
}

// Initialization is deferred until _onAuthReady() is called by the
// Firebase module in index.html once the user's cloud save is fetched.
// Nothing to do here — rng.js variables start at their default values.

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


function startRealTimeEffectsUpdate() {
    if (realTimeEffectsIntervalId !== null) return;
    realTimeEffectsIntervalId = setInterval(() => {
        updateActiveEffectsDisplay();
    }, 1000);
}

// Gestion du menu paramètres
document.getElementById('settings-btn').onclick = function() {
    document.getElementById('settings-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Sync select to current setting
    const sel = document.getElementById('rarity-tag-display-select');
    if (sel) sel.value = localStorage.getItem('rarity-tag-display') || 'always';
    syncNotifCheckboxes();
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
    const keepQty = pressKeep ? (pressQty === 'max' ? 1 : pressQty) : 0;
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
            const diamondsGain = Math.floor(Math.pow(chanceDisplay, 0.25));
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
            if (mode === 'compress') emptyMsg.textContent = "No cards available to compress right now.";
            else if (mode === 'decompress') emptyMsg.textContent = "No cards available to decompress right now.";
            else emptyMsg.textContent = "No cards available for Diamond Press right now.";
            emptyMsg.style.display = 'block';
        }
        updatePressAllBtn();
        return;
    }

    // Tri d'abord par rareté (Common → Mythic), puis par chance effective, puis par nom
    entries.sort((a, b) => {
        if (a.rarityRank !== b.rarityRank) return a.rarityRank - b.rarityRank;
        if (a.chanceDisplay !== b.chanceDisplay) return a.chanceDisplay - b.chanceDisplay;
        return a.baseName.localeCompare(b.baseName);
    });
    const overlay = document.getElementById('blur-overlay');

    updatePressAllBtn();
    entries.forEach(entry => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:0.4em 0.6em;border-bottom:1px solid rgba(0,0,0,0.05);';

        const left = document.createElement('div');
        left.style.cssText = 'display:flex;align-items:center;gap:0.6em;';

        const img = document.createElement('img');
        const item = items.find(i => i.name === entry.baseName);
        img.src = getCardImageSrc(item);
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
                const keepQtyNow = pressKeep ? (pressQty === 'max' ? 1 : pressQty) : 0;
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
                const keepQtyNow = pressKeep ? (pressQty === 'max' ? 1 : pressQty) : 0;
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
            btn.textContent = `×${times} (${Math.floor(times * gainPer)}💎)`;
            if (canDo) btn.onclick = function() {
                const curOwned = collection[entry.name] || 0;
                const keepQtyNow = pressKeep ? (pressQty === 'max' ? 1 : pressQty) : 0;
                const effNow = Math.max(0, curOwned - keepQtyNow);
                const actualTimes = (pressKeep || pressQty === 'max') ? effNow : Math.min(pressQty, effNow);
                if (actualTimes <= 0) return;
                diamonds += Math.floor(actualTimes * gainPer);
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

function pressAll(mode) {
    const entries = getPressEntries(mode);
    if (!entries.length) return;
    const keepQtyNow = pressKeep ? 1 : 0;
    let diamondsGainedThisPress = 0;
    entries.forEach(entry => {
        const cur = collection[entry.name] || 0;
        const eff = Math.max(0, cur - keepQtyNow);
        if (eff <= 0) return;
        if (mode === 'compress') {
            const t = Math.floor(eff / entry.needed);
            if (!t) return;
            const res = entry.baseName + ' (' + entry.nextType + ')';
            collection[entry.name] = cur - t * entry.needed;
            if (collection[entry.name] <= 0) delete collection[entry.name];
            collection[res] = (collection[res] || 0) + t;
            gainXp(Math.floor(Math.sqrt(entry.chanceDisplay)) * t);
        } else if (mode === 'decompress') {
            collection[entry.name] = cur - eff;
            if (collection[entry.name] <= 0) delete collection[entry.name];
            collection[entry.resultName] = (collection[entry.resultName] || 0) + eff * 5;
            gainXp(Math.floor(Math.sqrt(entry.chanceDisplay)) * eff);
        } else if (mode === 'diamond') {
            const gained = Math.floor(eff * entry.diamondsGain);
            diamonds += gained;
            diamondsGainedThisPress += gained;
            collection[entry.name] = cur - eff;
            if (collection[entry.name] <= 0) delete collection[entry.name];
            gainXp(Math.floor(Math.sqrt(entry.chanceDisplay)) * eff);
        }
    });
    saveCollection(); updateCollection(); updateInventoryStats(); updateCraftButtons(); updateDiamondsDisplay();
    renderPressCardList(mode);
    if (mode === 'diamond' && diamondsGainedThisPress > 0) {
        showCraftMessage('💎 +' + diamondsGainedThisPress + ' diamonds!', 'success');
    }
}

function updatePressPreview(mode) {
    const preview = document.getElementById('press-preview');
    if (!preview) return;
    const entries = getPressEntries(mode === 'diamond' ? 'diamond' : mode);
    preview.innerHTML = '';
    if (entries.length === 0) {
        preview.innerHTML = `<span style="color:#7f8c8d;font-size:0.9em;">No combination available right now...</span>`;
        return;
    }
    const entry = entries[Math.floor(Math.random() * entries.length)];
    const baseName = entry.baseName;
    const item = items.find(i => i.name === baseName);
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
            <img src="${getCardImageSrc(item)}" style="width:100%;height:100%;object-fit:cover;">
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
                <img src="${getCardImageSrc(item)}" style="width:100%;height:100%;object-fit:cover;">
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

const pressAllBtn = document.getElementById('press-all-btn');
if (pressAllBtn) {
    pressAllBtn.onclick = function(e) {
        e.preventDefault();
        const modal = document.getElementById('press-modal');
        const currentMode = modal ? (modal.getAttribute('data-mode') || 'compress') : 'compress';
        pressAll(currentMode);
    };
}

function updatePressAllBtn() {
    const modal = document.getElementById('press-modal');
    if (!modal) return;
    const btn = document.getElementById('press-all-btn');
    if (!btn) return;
    const mode = modal.getAttribute('data-mode') || 'compress';
    if (mode === 'diamond') {
        const entries = getPressEntries('diamond');
        const keepQtyNow = pressKeep ? 1 : 0;
        let total = 0;
        entries.forEach(e => {
            const cur = collection[e.name] || 0;
            const eff = Math.max(0, cur - keepQtyNow);
            total += Math.floor(eff * e.diamondsGain);
        });
        btn.textContent = total > 0 ? 'All  💎+' + total : 'All';
    } else {
        btn.textContent = 'All';
    }
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

function loadNotifRarityTags() {
    return localStorage.getItem('notif-rarity-tags') === 'true';
}
function loadNotifSpecialTags() {
    return localStorage.getItem('notif-special-tags') === 'true';
}
function syncNotifCheckboxes() {
    const cb1 = document.getElementById('notif-rarity-tags');
    const cb2 = document.getElementById('notif-special-tags');
    if (cb1) cb1.checked = loadNotifRarityTags();
    if (cb2) cb2.checked = loadNotifSpecialTags();
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
        updateUnlockables();
        showCraftMessage('\u2b06\ufe0f Level ' + level + '!', 'success');
        // Send level-up diamond reward
        const user = window._currentUser;
        const addReward = window._fbAddPendingReward;
        if (user && addReward) {
            const diamondReward = level * 10;
            try {
                addReward(user.uid, diamondReward, 'level_up', 'Level ' + level + ' reached!');
            } catch(_) {}
        }
        // Refresh badge
        if (typeof refreshRewards === 'function') refreshRewards();
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
            localStorage.removeItem('cards-roll-speed-upgrade');
            localStorage.removeItem('cards-xp-upgrade');
            localStorage.removeItem('cards-sugar-rush');
            localStorage.removeItem('cards-bleeding-end-time');
            localStorage.removeItem('cards-discovered-tags');
            localStorage.removeItem('cards-artifact-inventory');
            localStorage.removeItem('cards-equipped-artifacts');
            // Reset in-memory variables
            artifactInventory = {};
            equippedArtifacts = [];
            collection = {};
            discoveredTags        = new Set();
            discoveredEffects     = new Set();
            discoveredSpecialTags = new Set();
            rolls = 0;
            tokens = 10;
            diamonds = 0;
            tokenUpgradeLevel = 0;
            maxTokenUpgradeLevel = 0;
            luckUpgradeLevel = 0;
            rollSpeedUpgradeLevel = 0;
            xpUpgradeLevel = 0;
            maxToken = BASE_MAX_TOKEN;
            tokenRate = 0.2;
            tokenAccumulator = 0;
            xp = 0;
            level = 1;
            xpNext = 50;
            obeseEndTime = 0;
            bleedingEndTime = 0;
            stopBleeding();
            updateTokensDisplay();
            updateDiamondsDisplay();
            updateLevelXpDisplay();
            updateCollection();
            updateInventoryStats();
            updateCraftButtons();
            updatePotionsInventory();
            updateActiveEffectsDisplay();
            resetCardPreview();
            // Push the wiped save to cloud
            _pushCloudSave().then(() => {
                alert('Progress has been reset!');
            });
        }
    };
}

// On page load, call renderRarityBar
renderRarityBar();
syncNotifCheckboxes();

// Notif checkboxes
(function() {
    const cb1 = document.getElementById('notif-rarity-tags');
    const cb2 = document.getElementById('notif-special-tags');
    if (cb1) cb1.onchange = () => localStorage.setItem('notif-rarity-tags', cb1.checked);
    if (cb2) cb2.onchange = () => localStorage.setItem('notif-special-tags', cb2.checked);
})();

// Rarity tag display setting
loadRarityTagDisplaySetting();
const rarityTagSelect = document.getElementById('rarity-tag-display-select');
if (rarityTagSelect) {
    rarityTagSelect.onchange = function() {
        localStorage.setItem('rarity-tag-display', this.value);
        applyRarityTagDisplaySetting(this.value);
    };
}

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
    if (btn) {
        if (level >= 5) {
            btn.style.display = 'block';
            btn.disabled = false;
        } else {
            btn.style.display = 'none';
        }
    }
    let pressBtn = document.getElementById('press-btn');
    if (pressBtn) {
        if (level >= 3) {
            pressBtn.style.display = 'flex';
        } else {
            pressBtn.style.display = 'none';
        }
    }
    let diamondBtn = document.getElementById('press-mode-diamond');
    if (diamondBtn) {
        if (level >= 7) {
            diamondBtn.style.display = 'inline-block';
        } else {
            diamondBtn.style.display = 'none';
        }
    }
    // Artifacts unlock at level 10
    let artifactsBtn = document.getElementById('artifacts-nav-btn');
    if (artifactsBtn) {
        artifactsBtn.style.display = level >= 10 ? 'flex' : 'none';
    }
    updateArtifactsUI();
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
const ROLL_SPEED_UPGRADE_BASE_COST = 150;
const ROLL_SPEED_UPGRADE_COST_MULTIPLIER = 2.5;
const XP_UPGRADE_BASE_COST = 60;
const XP_UPGRADE_COST_MULTIPLIER = 2.5;

function getTokenUpgradeCost(level) {
    return Math.round(TOKEN_UPGRADE_BASE_COST * Math.pow(TOKEN_UPGRADE_COST_MULTIPLIER, level));
}

function getMaxTokenUpgradeCost(level) {
    return Math.round(MAX_TOKEN_UPGRADE_BASE_COST * Math.pow(MAX_TOKEN_UPGRADE_COST_MULTIPLIER, level));
}

function getLuckUpgradeCost(level) {
    return Math.round(LUCK_UPGRADE_BASE_COST * Math.pow(LUCK_UPGRADE_COST_MULTIPLIER, level));
}

function getRollSpeedUpgradeCost(level) {
    return Math.round(ROLL_SPEED_UPGRADE_BASE_COST * Math.pow(ROLL_SPEED_UPGRADE_COST_MULTIPLIER, level));
}

function getXpUpgradeCost(level) {
    return Math.round(XP_UPGRADE_BASE_COST * Math.pow(XP_UPGRADE_COST_MULTIPLIER, level));
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

function buyRollSpeedUpgrade() {
    const cost = getRollSpeedUpgradeCost(rollSpeedUpgradeLevel);
    if (diamonds < cost) return;
    diamonds -= cost;
    rollSpeedUpgradeLevel++;
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


function renderShop() {
    const diamDisplay = document.getElementById('shop-diamonds-display');
    if (diamDisplay) diamDisplay.innerHTML = `💎 ${diamonds}`;

    const list = document.getElementById('shop-items-list');
    if (!list) return;
    list.innerHTML = '';

    // --- Upgrade Token Speed ---
    const currentRate = 0.2 + tokenUpgradeLevel * 0.2;
    const nextRate = currentRate + 0.2;
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
            <div style="font-size:0.82em;color:#95a5a6;">Level <b style="color:#e67e22;">${tokenUpgradeLevel}</b> · +0.2 per level</div>
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
            <div style="font-size:0.82em;color:#95a5a6;">Level <b style="color:#e67e22;">${maxTokenUpgradeLevel}</b></div>
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

    // --- Upgrade Roll Speed ---
    const currentRollSpeed = 1 + rollSpeedUpgradeLevel * 0.2;
    const nextRollSpeed = currentRollSpeed + 0.2;
    const rollSpeedCost = getRollSpeedUpgradeCost(rollSpeedUpgradeLevel);
    const canAffordRollSpeed = diamonds >= rollSpeedCost;

    const rollSpeedItem = document.createElement('div');
    rollSpeedItem.style.cssText = `
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
    rollSpeedItem.innerHTML = `
        <div style="flex:1;">
            <div style="font-size:1.15em;font-weight:bold;color:#e74c3c;margin-bottom:0.25em;">⚡ Roll Speed</div>
            <div style="font-size:0.88em;color:#bdc3c7;margin-bottom:0.3em;">
                <b style="color:#2ecc71;">${currentRollSpeed.toFixed(1)}/s</b> → <b style="color:#e74c3c;">${nextRollSpeed.toFixed(1)}/s</b>
            </div>
            <div style="font-size:0.82em;color:#95a5a6;">Level <b style="color:#e67e22;">${rollSpeedUpgradeLevel}</b> · +0.2 per level</div>
        </div>
        <button id="buy-roll-speed-btn" style="
            padding:0.65em 1.4em;border-radius:10px;border:none;font-size:1em;font-weight:bold;
            cursor:${canAffordRollSpeed ? 'pointer' : 'not-allowed'};
            background:${canAffordRollSpeed ? 'linear-gradient(90deg,#e74c3c,#c0392b)' : '#555'};
            color:${canAffordRollSpeed ? '#fff' : '#888'};white-space:nowrap;min-width:110px;
        ">💎 ${rollSpeedCost}</button>
    `;
    if (canAffordRollSpeed) rollSpeedItem.querySelector('#buy-roll-speed-btn').onclick = buyRollSpeedUpgrade;
    list.appendChild(rollSpeedItem);

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
            <div style="font-size:0.82em;color:#95a5a6;">Level <b style="color:#39ff14;">${luckUpgradeLevel}</b> · +0.5 per level</div>
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

// ===== INDEX SYSTEM =====

function openIndexMenu() {
    document.getElementById('index-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeIndexMenu() {
    document.getElementById('index-modal').style.display = 'none';
    document.body.style.overflow = '';
}

function openIndexSection(section) {
    if (section === 'cards') {
        document.getElementById('index-cards-modal').style.display = 'flex';
        const listEl = document.getElementById('index-cards-list');
        if (listEl) listEl.dataset.activeTab = 'cards';
        renderIndexCards();
        const searchEl = document.getElementById('index-search');
        if (searchEl) {
            searchEl.value = '';
            searchEl.oninput = function() { renderIndexCards(this.value); };
        }
    } else if (section === 'potions') {
        document.getElementById('index-potions-modal').style.display = 'flex';
        renderIndexPotions();
    } else if (section === 'tags') {
        document.getElementById('index-tags-modal').style.display = 'flex';
        renderIndexTags();
    } else if (section === 'specialtags') {
        document.getElementById('index-specialtags-modal').style.display = 'flex';
        renderIndexSpecialTags();
    } else if (section === 'effects') {
        document.getElementById('index-effects-modal').style.display = 'flex';
        renderIndexEffects();
    } else if (section === 'unlocks') {
        document.getElementById('index-unlocks-modal').style.display = 'flex';
        renderIndexUnlocks();
    } else if (section === 'artifacts') {
        document.getElementById('index-artifacts-modal').style.display = 'flex';
        renderIndexArtifacts();
    }
}

function closeIndexSection() {
    document.getElementById('index-cards-modal').style.display = 'none';
    document.getElementById('index-potions-modal').style.display = 'none';
    document.getElementById('index-tags-modal').style.display = 'none';
    document.getElementById('index-specialtags-modal').style.display = 'none';
    document.getElementById('index-effects-modal').style.display = 'none';
    document.getElementById('index-unlocks-modal').style.display = 'none';
    const artModal = document.getElementById('index-artifacts-modal');
    if (artModal) artModal.style.display = 'none';
}

function closeIndexCardDetail() {
    document.getElementById('index-card-detail').style.display = 'none';
}

function getRarityName(chance) {
    if (chance < 10) return 'Common';
    if (chance < 100) return 'Uncommon';
    if (chance < 1000) return 'Rare';
    if (chance < 10000) return 'Epic';
    if (chance < 100000) return 'Legendary';
    return 'Mythic';
}

function getRarityColor(chance) {
    if (chance < 10) return '#95a5a6';
    if (chance < 100) return '#2ecc71';
    if (chance < 1000) return '#3498db';
    if (chance < 10000) return '#9b59b6';
    if (chance < 100000) return '#f39c12';
    return '#e74c3c';
}

function renderIndexCards(filter, tab) {
    const listEl = document.getElementById('index-cards-list');
    const countEl = document.getElementById('index-cards-count');
    if (!listEl) return;

    // Tab selector: Cards | Groups
    const activeTab = tab || listEl.dataset.activeTab || 'cards';
    listEl.dataset.activeTab = activeTab;

    // Render tab bar once (check if already exists)
    let tabBar = document.getElementById('index-cards-tab-bar');
    if (!tabBar) {
        tabBar = document.createElement('div');
        tabBar.id = 'index-cards-tab-bar';
        tabBar.style.cssText = 'display:flex;gap:0.5em;padding:0.6em 1em 0;background:rgba(0,0,0,0.15);';
        ['cards','groups'].forEach(t => {
            const tb = document.createElement('button');
            tb.dataset.tab = t;
            tb.textContent = t === 'cards' ? '🎴 Cards' : '📂 Groups';
            tb.style.cssText = 'flex:1;padding:0.45em 0.8em;border-radius:8px;border:none;cursor:pointer;font-weight:bold;font-size:0.95em;transition:background 0.15s;';
            tb.onclick = () => { listEl.dataset.activeTab = t; renderIndexCards(filter, t); };
            tabBar.appendChild(tb);
        });
        listEl.parentNode.insertBefore(tabBar, listEl);
    }
    // Update tab styles
    tabBar.querySelectorAll('button').forEach(tb => {
        tb.style.background = tb.dataset.tab === activeTab ? 'rgba(78,205,196,0.25)' : 'rgba(255,255,255,0.07)';
        tb.style.color = tb.dataset.tab === activeTab ? '#4ecdc4' : '#7f8c8d';
    });

    listEl.innerHTML = '';

    if (activeTab === 'groups') {
        renderIndexGroupsList(listEl);
        if (countEl) countEl.textContent = cardsGroupes.length + ' groups';
        return;
    }

    // Only base (non-variant) items
    const rollableAll = items.filter(i => !i.name.includes('('));
    const discovered = rollableAll.filter(item => {
        // discovered = owned base OR any variant
        const baseOwned = collection[item.name] || 0;
        const goldOwned = collection[`${item.name} (Gold)`] || 0;
        const rainbowOwned = collection[`${item.name} (Rainbow)`] || 0;
        const shinyOwned = collection[`${item.name} (Shiny)`] || 0;
        const nuclearOwned = collection[`${item.name} (Nuclear)`] || 0;
        return baseOwned + goldOwned + rainbowOwned + shinyOwned + nuclearOwned > 0;
    });

    const filtered = filter
        ? discovered.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()))
        : discovered;

    // Sort by chance ascending
    filtered.sort((a, b) => a.chance - b.chance);

    if (countEl) countEl.textContent = `${filtered.length} / ${rollableAll.length} discovered`;

    if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;color:#7f8c8d;padding:2em;font-style:italic;">${filter ? 'No cards match your search.' : 'No cards discovered yet!'}</div>`;
        return;
    }

    filtered.forEach(item => {
        const totalOwned = (collection[item.name] || 0)
            + (collection[`${item.name} (Gold)`] || 0)
            + (collection[`${item.name} (Rainbow)`] || 0)
            + (collection[`${item.name} (Shiny)`] || 0)
            + (collection[`${item.name} (Nuclear)`] || 0);

        const rarityColor = getRarityColor(item.chance);
        const rarityName = getRarityName(item.chance);
        const diamondVal = Math.floor(Math.pow(item.chance, 0.25));

        const row = document.createElement('div');
        row.style.cssText = `background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.75em 1em;display:flex;align-items:center;gap:0.9em;cursor:pointer;transition:background 0.15s;`;
        row.onmouseenter = () => row.style.background = 'rgba(255,255,255,0.1)';
        row.onmouseleave = () => row.style.background = 'rgba(255,255,255,0.05)';
        row.innerHTML = `
            <img src="${getCardImageSrc(item)}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;">
            <div style="flex:1;min-width:0;">
                <div style="font-weight:bold;color:#fff;font-size:1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                <div style="font-size:0.78em;color:${rarityColor};font-weight:bold;">${rarityName} · 1 in ${item.chance.toLocaleString()}</div>
                <div style="margin-top:0.15em;">${getSpecialTags(item)}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
                <div style="font-size:0.85em;color:#4ecdc4;font-weight:bold;">×${totalOwned}</div>
                <div style="font-size:0.75em;color:#9b59b6;">💎${diamondVal}</div>
            </div>
            <span style="color:#4ecdc4;font-size:1.2em;">›</span>
        `;
        row.onclick = () => openIndexCardDetail(item.name);
        listEl.appendChild(row);
    });
}

function renderIndexGroupsList(listEl) {
    listEl.innerHTML = '';
    cardsGroupes.forEach(groupe => {
        const totalCards = groupe.content.length;
        const ownedCards = groupe.content.filter(name => {
            const variants = ['', ' (Gold)', ' (Rainbow)', ' (Shiny)', ' (Nuclear)'];
            return variants.some(v => (collection[name + v] || 0) > 0);
        }).length;

        const row = document.createElement('div');
        row.style.cssText = `background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.85em 1em;display:flex;align-items:center;gap:1em;cursor:pointer;transition:background 0.15s;`;
        row.onmouseenter = () => row.style.background = 'rgba(255,255,255,0.1)';
        row.onmouseleave = () => row.style.background = 'rgba(255,255,255,0.05)';

        // Colour swatch
        const swatch = document.createElement('div');
        swatch.style.cssText = `width:40px;height:40px;border-radius:10px;background:${groupe.color};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3em;`;
        swatch.textContent = '📂';
        row.appendChild(swatch);

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';
        info.innerHTML = `
            <div style="font-weight:bold;color:#fff;font-size:1em;">${groupe.name}</div>
            <div style="font-size:0.78em;color:#7f8c8d;margin-top:0.1em;">${ownedCards} / ${totalCards} cards discovered</div>
        `;
        row.appendChild(info);

        // Progress bar
        const prog = document.createElement('div');
        prog.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:0.25em;flex-shrink:0;';
        prog.innerHTML = `
            <div style="font-size:0.82em;color:#4ecdc4;font-weight:bold;">${ownedCards}/${totalCards}</div>
            <div style="width:60px;height:6px;background:rgba(255,255,255,0.1);border-radius:999px;overflow:hidden;">
                <div style="width:${Math.round(ownedCards/totalCards*100)}%;height:100%;background:${groupe.color};border-radius:999px;"></div>
            </div>
        `;
        row.appendChild(prog);
        row.appendChild(Object.assign(document.createElement('span'), { textContent: '›', style: 'color:#4ecdc4;font-size:1.2em;' }));

        row.onclick = () => openIndexGroupDetail(groupe.name);
        listEl.appendChild(row);
    });
}

function openIndexCardDetail(itemName) {
    const item = items.find(i => i.name === itemName);
    if (!item) return;

    document.getElementById('index-detail-title').textContent = item.name;
    document.getElementById('index-card-detail').style.display = 'flex';

    const content = document.getElementById('index-detail-content');
    content.innerHTML = '';

    const baseOwned = collection[item.name] || 0;
    const goldOwned = collection[`${item.name} (Gold)`] || 0;
    const rainbowOwned = collection[`${item.name} (Rainbow)`] || 0;
    const shinyOwned = collection[`${item.name} (Shiny)`] || 0;
    const nuclearOwned = collection[`${item.name} (Nuclear)`] || 0;
    const totalOwned = baseOwned + goldOwned + rainbowOwned + shinyOwned + nuclearOwned;

    const rarityName = getRarityName(item.chance);
    const rarityColor = getRarityColor(item.chance);
    const diamondVal = Math.floor(Math.pow(item.chance, 0.25));

    // Groups
    const groups = cardsGroupes.filter(g => g.content.includes(item.name));

    // Crafts: recipes where this card is an ingredient OR the result
    const craftsAsIngredient = craftRecipes.filter(r => r.ingredients.some(ing => ing.name === item.name));
    const craftsAsResult = craftRecipes.filter(r => r.name === item.name);

    // Build HTML
    let html = `
    <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:1.5em;">
        <img src="${getCardImageSrc(item)}" style="width:100px;height:100px;object-fit:cover;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.4);margin-bottom:0.7em;">
        <div style="font-size:1.4em;font-weight:bold;color:#fff;">${item.name}</div>
        <div style="font-size:0.9em;color:${rarityColor};font-weight:bold;margin-top:0.2em;">${rarityName}</div>
        <div style="margin-top:0.4em;">${getSpecialTags(item)}</div>
    </div>

    <!-- Stats -->
    <div style="background:rgba(255,255,255,0.05);border-radius:14px;padding:1em 1.2em;margin-bottom:1em;display:grid;grid-template-columns:1fr 1fr;gap:0.7em;">
        <div>
            <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;">Rarity</div>
            <div style="font-weight:bold;color:${rarityColor};">${rarityName}</div>
        </div>
        <div>
            <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;">Chance</div>
            <div style="font-weight:bold;color:#fff;">1 in ${item.chance.toLocaleString()}</div>
        </div>
        <div>
            <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;">Total owned</div>
            <div style="font-weight:bold;color:#4ecdc4;">×${totalOwned}</div>
        </div>
        <div>
            <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;">Diamond value</div>
            <div style="font-weight:bold;color:#9b59b6;">💎 ${diamondVal}</div>
        </div>
    </div>

    <!-- Variants owned -->
    <div style="background:rgba(255,255,255,0.05);border-radius:14px;padding:1em 1.2em;margin-bottom:1em;">
        <div style="font-size:0.8em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Variants</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
            ${[
                { label: 'Base', key: item.name, color: '#fff', mult: 1 },
                { label: 'Gold', key: `${item.name} (Gold)`, color: '#f1c40f', mult: 10 },
                { label: 'Rainbow', key: `${item.name} (Rainbow)`, color: '#e74c3c', mult: 100 },
                { label: 'Shiny', key: `${item.name} (Shiny)`, color: '#3498db', mult: 1000 },
                { label: 'Nuclear', key: `${item.name} (Nuclear)`, color: '#2ecc71', mult: 10000 },
            ].map(v => {
                const owned = collection[v.key] || 0;
                return `<div style="background:rgba(255,255,255,0.07);border-radius:8px;padding:0.35em 0.8em;font-size:0.85em;">
                    <span style="color:${v.color};font-weight:bold;">${v.label}</span>
                    <span style="color:#7f8c8d;margin-left:0.3em;">×${owned}</span>
                    <span style="color:#9b59b6;margin-left:0.3em;font-size:0.8em;">💎${Math.floor(Math.pow(item.chance * v.mult, 0.25))}</span>
                </div>`;
            }).join('')}
        </div>
    </div>`;

    // Groups
    if (groups.length > 0) {
        html += `<div style="background:rgba(255,255,255,0.05);border-radius:14px;padding:1em 1.2em;margin-bottom:1em;">
            <div style="font-size:0.8em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Groups</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${groups.map(g => `<span onclick="openIndexGroupDetail('${g.name.replace(/'/g,"\\'")}');event.stopPropagation();" style="background:${g.color};color:#fff;border-radius:8px;padding:0.3em 0.9em;font-size:0.85em;font-weight:bold;cursor:pointer;opacity:0.92;transition:opacity 0.15s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.92'">${g.name} ›</span>`).join('')}
            </div>
        </div>`;
    }

    // Crafts
    const hasCraft = craftsAsIngredient.length > 0 || craftsAsResult.length > 0;
    if (hasCraft) {
        html += `<div style="background:rgba(255,255,255,0.05);border-radius:14px;padding:1em 1.2em;margin-bottom:1em;">
            <div style="font-size:0.8em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.8em;">Crafts</div>`;

        if (craftsAsResult.length > 0) {
            html += `<div style="font-size:0.82em;color:#f39c12;font-weight:bold;margin-bottom:0.4em;">📦 Craftable result</div>`;
            craftsAsResult.forEach(r => {
                const ings = r.ingredients.map(i => `${i.amount}× ${i.name}`).join(', ');
                const timeSec = Math.round(r.time / 1000);
                html += `<div style="background:rgba(243,156,18,0.1);border-radius:8px;padding:0.5em 0.8em;margin-bottom:0.4em;font-size:0.85em;">
                    <span style="color:#f39c12;font-weight:bold;">${r.name}</span>
                    <span style="color:#bdc3c7;margin-left:0.5em;">← ${ings}</span>
                    <span style="color:#7f8c8d;margin-left:0.5em;">(${timeSec}s)</span>
                </div>`;
            });
        }

        if (craftsAsIngredient.length > 0) {
            html += `<div style="font-size:0.82em;color:#3498db;font-weight:bold;margin-bottom:0.4em;margin-top:0.6em;">🔧 Used as ingredient</div>`;
            craftsAsIngredient.forEach(r => {
                const qty = r.ingredients.find(i => i.name === item.name).amount;
                const timeSec = Math.round(r.time / 1000);
                html += `<div style="background:rgba(52,152,219,0.1);border-radius:8px;padding:0.5em 0.8em;margin-bottom:0.4em;font-size:0.85em;">
                    <span style="color:#3498db;font-weight:bold;">${r.name}</span>
                    <span style="color:#bdc3c7;margin-left:0.5em;">needs ${qty}×</span>
                    <span style="color:#7f8c8d;margin-left:0.5em;">(${timeSec}s)</span>
                </div>`;
            });
        }

        html += `</div>`;
    }

    content.innerHTML = html;
}

function openIndexGroupDetail(groupName) {
    const groupe = cardsGroupes.find(g => g.name === groupName);
    if (!groupe) return;

    document.getElementById('index-group-title').textContent = groupName;
    const header = document.getElementById('index-group-header');
    header.style.borderBottomColor = groupe.color;

    const content = document.getElementById('index-group-content');
    content.innerHTML = '';

    const groupCards = groupe.content.map(name => items.find(i => i.name === name)).filter(Boolean);

    groupCards.sort((a, b) => a.chance - b.chance);

    groupCards.forEach(item => {
        const totalOwned = (collection[item.name] || 0)
            + (collection[`${item.name} (Gold)`] || 0)
            + (collection[`${item.name} (Rainbow)`] || 0)
            + (collection[`${item.name} (Shiny)`] || 0)
            + (collection[`${item.name} (Nuclear)`] || 0);
        const discovered = totalOwned > 0;
        const rarityColor = getRarityColor(item.chance);
        const rarityName = getRarityName(item.chance);
        const diamondVal = Math.floor(Math.pow(item.chance, 0.25));

        const row = document.createElement('div');
        row.style.cssText = `background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.75em 1em;display:flex;align-items:center;gap:0.9em;${discovered ? 'cursor:pointer;' : 'opacity:0.45;'}transition:background 0.15s;`;
        if (discovered) {
            row.onmouseenter = () => row.style.background = 'rgba(255,255,255,0.1)';
            row.onmouseleave = () => row.style.background = 'rgba(255,255,255,0.05)';
            row.onclick = () => openIndexCardDetail(item.name);
        }

        row.innerHTML = `
            <img src="${getCardImageSrc(item)}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;${!discovered ? 'filter:grayscale(1) brightness(0.4);' : ''}">
            <div style="flex:1;min-width:0;">
                <div style="font-weight:bold;color:${discovered ? '#fff' : '#7f8c8d'};font-size:1em;">${discovered ? item.name : '???'}</div>
                <div style="font-size:0.78em;color:${rarityColor};font-weight:bold;">${rarityName} · 1 in ${item.chance.toLocaleString()}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
                ${discovered
                    ? `<div style="font-size:0.85em;color:#4ecdc4;font-weight:bold;">×${totalOwned}</div>
                       <div style="font-size:0.75em;color:#9b59b6;">💎${diamondVal}</div>`
                    : `<div style="font-size:0.8em;color:#7f8c8d;">Not found</div>`
                }
            </div>
            ${discovered ? '<span style="color:#4ecdc4;font-size:1.2em;">›</span>' : ''}
        `;
        content.appendChild(row);
    });

    const discovered_count = groupCards.filter(item => {
        const t = (collection[item.name]||0)+(collection[`${item.name} (Gold)`]||0)+(collection[`${item.name} (Rainbow)`]||0)+(collection[`${item.name} (Shiny)`]||0)+(collection[`${item.name} (Nuclear)`]||0);
        return t > 0;
    }).length;

    document.getElementById('index-group-title').textContent = `${groupName} (${discovered_count}/${groupCards.length})`;
    document.getElementById('index-group-detail').style.display = 'flex';
}

function closeIndexGroupDetail() {
    document.getElementById('index-group-detail').style.display = 'none';
}

function closeIndexSpecialTags() {
    document.getElementById('index-specialtags-modal').style.display = 'none';
}

function closeIndexEffects() {
    document.getElementById('index-effects-modal').style.display = 'none';
}

function renderIndexSpecialTags() {
    const list = document.getElementById('index-specialtags-list');
    if (!list) return;
    list.innerHTML = '';

    const sweetItems   = items.filter(i => Array.isArray(i.tags) && i.tags.includes('sweet'));
    const caloricItems = items.filter(i => Array.isArray(i.tags) && i.tags.includes('caloric'));

    if (discoveredSpecialTags.size === 0) {
        list.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">Roll cards to discover special tags!</div>';
        return;
    }

    // ── Sweet card ──
    if (!discoveredSpecialTags.has('sweet')) {
        // Not yet discovered — skip this section
    } else {
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,105,180,0.08);border:1.5px solid rgba(255,105,180,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';

    // Header
    card.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🍬</span>
            <div>
                <div style="font-weight:bold;font-size:1.15em;color:#ff69b4;">Sweet</div>
                <div style="font-size:0.82em;color:#7f8c8d;">Special property — triggers Sugar Rush</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Effect</div>
            <div style="color:#fff;line-height:1.5;">When a <span style="color:#ff69b4;font-weight:bold;">Sweet</span> card is rolled, there is a <span style="color:#f39c12;font-weight:bold;">1 in 3</span> chance to activate or extend <span style="color:#f39c12;font-weight:bold;">Sugar Rush</span> by +4 rolls (max 10). While Sugar Rush is active, rolling a Sweet card <b>does not</b> consume a Sugar Rush roll.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Chance table</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Trigger chance</div><div style="color:#f39c12;font-weight:bold;">1 in 3 per roll</div>
                <div style="color:#7f8c8d;">Rolls added</div><div style="color:#fff;font-weight:bold;">+4 (cap 10)</div>
                <div style="color:#7f8c8d;">Roll consumed?</div><div style="color:#2ecc71;font-weight:bold;">No (if Sweet)</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Cards with Sweet tag</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${sweetItems.map(item => {
                    const owned = (collection[item.name] || 0) + (collection[item.name + ' (Gold)'] || 0) + (collection[item.name + ' (Rainbow)'] || 0) + (collection[item.name + ' (Shiny)'] || 0) + (collection[item.name + ' (Nuclear)'] || 0);
                    return `<div onclick="openIndexCardDetail('${item.name.replace(/'/g,"\'")}');closeIndexSpecialTags();" style="background:rgba(255,105,180,0.12);border:1px solid rgba(255,105,180,0.3);border-radius:8px;padding:0.4em 0.7em;display:flex;align-items:center;gap:0.5em;cursor:pointer;">
                        <img src="${getCardImageSrc(item)}" style="width:22px;height:22px;object-fit:cover;border-radius:4px;">
                        <span style="color:#fff;font-size:0.88em;">${item.name}</span>
                        <span style="color:#7f8c8d;font-size:0.78em;">×${owned}</span>
                        <span style="color:#f39c12;font-size:0.75em;">1 in ${item.chance}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related effect</div>
            <div onclick="closeIndexSpecialTags();openIndexSection('effects');" style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.3);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;">
                <span style="font-size:1.3em;">🍬</span>
                <div>
                    <div style="font-weight:bold;color:#f39c12;font-size:0.9em;">Sugar Rush</div>
                    <div style="font-size:0.75em;color:#7f8c8d;">×2 Luck · roll-based</div>
                </div>
                <span style="margin-left:auto;color:#f39c12;">›</span>
            </div>
        </div>
    `;
    list.appendChild(card);

    } // end sweet section

    // ── Caloric card ──
    if (!discoveredSpecialTags.has('caloric')) {
        // Not yet discovered
    } else {
    const caloricCard = document.createElement('div');
    caloricCard.style.cssText = 'background:rgba(243,156,18,0.08);border:1.5px solid rgba(243,156,18,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';
    caloricCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🍔</span>
            <div>
                <div style="font-weight:bold;font-size:1.15em;color:#e67e22;">Caloric</div>
                <div style="font-size:0.82em;color:#7f8c8d;">Special property — triggers Full Belly</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Effect</div>
            <div style="color:#fff;line-height:1.5;">When a <span style="color:#e67e22;font-weight:bold;">Caloric</span> card is rolled, it adds <span style="color:#f39c12;font-weight:bold;">2 to 5 rolls</span> to <span style="color:#e67e22;font-weight:bold;">Full Belly</span> (max 10). Rolling a Caloric card <b>does not</b> consume a Full Belly roll.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Chance table</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Trigger</div><div style="color:#f39c12;font-weight:bold;">Always (100%)</div>
                <div style="color:#7f8c8d;">Rolls added</div><div style="color:#fff;font-weight:bold;">+2 to +5 (cap 10)</div>
                <div style="color:#7f8c8d;">Roll consumed?</div><div style="color:#2ecc71;font-weight:bold;">No (if Caloric)</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Cards with Caloric tag</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${caloricItems.map(item => {
                    const owned = (collection[item.name] || 0) + (collection[item.name + ' (Gold)'] || 0) + (collection[item.name + ' (Rainbow)'] || 0) + (collection[item.name + ' (Shiny)'] || 0) + (collection[item.name + ' (Nuclear)'] || 0);
                    const safeName = item.name.replace(/'/g, "\\'");
                    return '<div onclick="openIndexCardDetail(\'' + safeName + '\');closeIndexSpecialTags();" style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.3);border-radius:8px;padding:0.4em 0.7em;display:flex;align-items:center;gap:0.5em;cursor:pointer;">'
                        + '<img src="' + getCardImageSrc(item) + '" style="width:22px;height:22px;object-fit:cover;border-radius:4px;">'
                        + '<span style="color:#fff;font-size:0.88em;">' + item.name + '</span>'
                        + '<span style="color:#7f8c8d;font-size:0.78em;">×' + owned + '</span>'
                        + '<span style="color:#f39c12;font-size:0.75em;">1 in ' + item.chance + '</span>'
                        + '</div>';
                }).join('')}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related effect</div>
            <div onclick="closeIndexSpecialTags();openIndexSection('effects');" style="background:rgba(230,126,34,0.12);border:1px solid rgba(230,126,34,0.3);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;">
                <span style="font-size:1.3em;">🍔</span>
                <div>
                    <div style="font-weight:bold;color:#e67e22;font-size:0.9em;">Full Belly</div>
                    <div style="font-size:0.75em;color:#7f8c8d;">×1.5 Luck · roll-based</div>
                </div>
                <span style="margin-left:auto;color:#e67e22;">›</span>
            </div>
        </div>
    `;
    list.appendChild(caloricCard);

    } // end caloric section

    // ── Sharp card ──
    if (!discoveredSpecialTags.has('sharp')) {
        // Not yet discovered
    } else {
    const sharpItems = items.filter(i => Array.isArray(i.tags) && i.tags.includes('Sharp'));
    const sharpCard = document.createElement('div');
    sharpCard.style.cssText = 'background:rgba(231,76,60,0.08);border:1.5px solid rgba(231,76,60,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';
    sharpCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🗡️</span>
            <div>
                <div style="font-weight:bold;font-size:1.15em;color:#e74c3c;">Sharp</div>
                <div style="font-size:0.82em;color:#7f8c8d;">Special property — triggers Bleeding</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Effect</div>
            <div style="color:#fff;line-height:1.5;">When a <span style="color:#e74c3c;font-weight:bold;">Sharp</span> card is rolled, there is a <span style="color:#f39c12;font-weight:bold;">1 in 4</span> chance to apply <span style="color:#e74c3c;font-weight:bold;">Bleeding</span> for 60 seconds. While bleeding, every second has a 1 in 3 chance to lose a token.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Chance table</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Trigger chance</div><div style="color:#f39c12;font-weight:bold;">1 in 4 per roll</div>
                <div style="color:#7f8c8d;">Duration</div><div style="color:#fff;font-weight:bold;">60 seconds</div>
                <div style="color:#7f8c8d;">Token loss chance</div><div style="color:#e74c3c;font-weight:bold;">1 in 3 per second</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Cards with Sharp tag</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${sharpItems.map(item => {
                    const owned = (collection[item.name] || 0) + (collection[item.name + ' (Gold)'] || 0) + (collection[item.name + ' (Rainbow)'] || 0) + (collection[item.name + ' (Shiny)'] || 0) + (collection[item.name + ' (Nuclear)'] || 0);
                    const safeName = item.name.replace(/'/g, "\\'");
                    return '<div onclick="openIndexCardDetail(\'' + safeName + '\');closeIndexSpecialTags();" style="background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.3);border-radius:8px;padding:0.4em 0.7em;display:flex;align-items:center;gap:0.5em;cursor:pointer;">'
                        + '<img src="' + getCardImageSrc(item) + '" style="width:22px;height:22px;object-fit:cover;border-radius:4px;">'
                        + '<span style="color:#fff;font-size:0.88em;">' + item.name + '</span>'
                        + '<span style="color:#7f8c8d;font-size:0.78em;">×' + owned + '</span>'
                        + '<span style="color:#e74c3c;font-size:0.75em;">1 in ' + item.chance + '</span>'
                        + '</div>';
                }).join('')}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related effect</div>
            <div onclick="closeIndexSpecialTags();openIndexSection('effects');" style="background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.3);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;">
                <span style="font-size:1.3em;">🩸</span>
                <div>
                    <div style="font-weight:bold;color:#e74c3c;font-size:0.9em;">Bleeding</div>
                    <div style="font-size:0.75em;color:#7f8c8d;">Time-based debuff — token loss</div>
                </div>
                <span style="margin-left:auto;color:#e74c3c;">›</span>
            </div>
        </div>
    `;
    list.appendChild(sharpCard);

    } // end sharp section

    // ── AI card ──
    if (!discoveredSpecialTags.has('ai')) {
        // Not yet discovered
    } else {
    const aiItems = items.filter(i => Array.isArray(i.tags) && i.tags.includes('ai'));
    const aiCard = document.createElement('div');
    aiCard.style.cssText = 'background:rgba(155,89,182,0.08);border:1.5px solid rgba(155,89,182,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';
    aiCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🤖</span>
            <div>
                <div style="font-weight:bold;font-size:1.15em;color:#9b59b6;">AI</div>
                <div style="font-size:0.82em;color:#7f8c8d;">Special property — illustration is AI generated</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Description</div>
            <div style="color:#fff;line-height:1.5;">These cards feature illustrations that were generated using artificial intelligence. They represent a unique category of cards with AI-created artwork.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Cards with AI tag</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${aiItems.map(item => {
                    const owned = (collection[item.name] || 0) + (collection[item.name + ' (Gold)'] || 0) + (collection[item.name + ' (Rainbow)'] || 0) + (collection[item.name + ' (Shiny)'] || 0) + (collection[item.name + ' (Nuclear)'] || 0);
                    const safeName = item.name.replace(/'/g, "\\'");
                    return '<div onclick="openIndexCardDetail(\'' + safeName + '\');closeIndexSpecialTags();" style="background:rgba(155,89,182,0.12);border:1px solid rgba(155,89,182,0.3);border-radius:8px;padding:0.4em 0.7em;display:flex;align-items:center;gap:0.5em;cursor:pointer;">'
                        + '<img src="' + getCardImageSrc(item) + '" style="width:22px;height:22px;object-fit:cover;border-radius:4px;">'
                        + '<span style="color:#fff;font-size:0.88em;">' + item.name + '</span>'
                        + '<span style="color:#7f8c8d;font-size:0.78em;">×' + owned + '</span>'
                        + '<span style="color:#9b59b6;font-size:0.75em;">1 in ' + item.chance + '</span>'
                        + '</div>';
                }).join('')}
            </div>
        </div>
    `;
    list.appendChild(aiCard);
    } // end ai section
}

function renderIndexEffects() {
    const list = document.getElementById('index-effects-list');
    if (!list) return;
    list.innerHTML = '';

    if (discoveredEffects.size === 0) {
        list.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">Trigger effects in-game to discover them here!</div>';
        return;
    }

    // Sugar Rush
    const sweetItems = items.filter(i => Array.isArray(i.tags) && i.tags.includes('sweet'));
    if (!discoveredEffects.has('sugarRush')) {
        // not discovered
    } else {
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(243,156,18,0.08);border:1.5px solid rgba(243,156,18,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';

    const active = sugarRushRolls > 0;
    card.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🍬</span>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:0.5em;">
                    <div style="font-weight:bold;font-size:1.15em;color:#f39c12;">Sugar Rush</div>
                    ${active ? `<span style="background:#f39c12;color:#fff;font-size:0.7em;font-weight:bold;border-radius:6px;padding:2px 8px;">ACTIVE · ${sugarRushRolls} rolls</span>` : '<span style="background:rgba(255,255,255,0.08);color:#7f8c8d;font-size:0.7em;border-radius:6px;padding:2px 8px;">INACTIVE</span>'}
                </div>
                <div style="font-size:0.82em;color:#7f8c8d;">Roll-based passive effect</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">What it does</div>
            <div style="color:#fff;line-height:1.5;">Multiplies <span style="color:#3498db;font-weight:bold;">Luck ×2</span> for all cards while active. The effect has a roll counter — each non-Sweet roll decrements it by 1. Rolling a <span style="color:#ff69b4;font-weight:bold;">Sweet</span> card never decrements it.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Stats</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Luck bonus</div><div style="color:#3498db;font-weight:bold;">×2</div>
                <div style="color:#7f8c8d;">Max rolls</div><div style="color:#f39c12;font-weight:bold;">10</div>
                <div style="color:#7f8c8d;">Rolls added</div><div style="color:#fff;font-weight:bold;">+4 per trigger</div>
                <div style="color:#7f8c8d;">Trigger rate</div><div style="color:#f39c12;font-weight:bold;">1 in 3</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">How to obtain</div>
            <div style="font-size:0.85em;color:#fff;margin-bottom:0.6em;">Roll any card with the <span style="color:#ff69b4;font-weight:bold;">🍬 Sweet</span> tag. There is a 1 in 3 chance to trigger Sugar Rush or add +4 rolls to the current count.</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${sweetItems.map(item => `<div onclick="closeIndexEffects();openIndexCardDetail('${item.name.replace(/'/g,"\'")}');" style="background:rgba(255,105,180,0.12);border:1px solid rgba(255,105,180,0.25);border-radius:8px;padding:0.35em 0.7em;display:flex;align-items:center;gap:0.4em;cursor:pointer;">
                    <img src="${getCardImageSrc(item)}" style="width:20px;height:20px;object-fit:cover;border-radius:3px;">
                    <span style="color:#ff69b4;font-size:0.85em;font-weight:bold;">${item.name}</span>
                    <span style="color:#7f8c8d;font-size:0.78em;">1 in ${item.chance}</span>
                </div>`).join('')}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related special tag</div>
            <div onclick="closeIndexEffects();openIndexSection('specialtags');" style="background:rgba(255,105,180,0.1);border:1px solid rgba(255,105,180,0.25);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;">
                <span style="font-size:1.3em;">🍬</span>
                <div>
                    <div style="font-weight:bold;color:#ff69b4;font-size:0.9em;">Sweet</div>
                    <div style="font-size:0.75em;color:#7f8c8d;">Special tag — triggers Sugar Rush</div>
                </div>
                <span style="margin-left:auto;color:#ff69b4;">›</span>
            </div>
        </div>
    `;
    list.appendChild(card);

    } // end sugarRush section

    // ── Full Belly ──
    const caloricItems2 = items.filter(i => Array.isArray(i.tags) && i.tags.includes('caloric'));
    if (!discoveredEffects.has('fullBelly')) {
        // not discovered
    } else {
    const vpCard = document.createElement('div');
    vpCard.style.cssText = 'background:rgba(230,126,34,0.08);border:1.5px solid rgba(230,126,34,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';

    const vpActive = ventrePleinRolls > 0;
    vpCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🍔</span>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:0.5em;">
                    <div style="font-weight:bold;font-size:1.15em;color:#e67e22;">Full Belly</div>
                    ${vpActive ? `<span style="background:#e67e22;color:#fff;font-size:0.7em;font-weight:bold;border-radius:6px;padding:2px 8px;">ACTIVE · ${ventrePleinRolls} rolls</span>` : '<span style="background:rgba(255,255,255,0.08);color:#7f8c8d;font-size:0.7em;border-radius:6px;padding:2px 8px;">INACTIVE</span>'}
                </div>
                <div style="font-size:0.82em;color:#7f8c8d;">Roll-based passive effect</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">What it does</div>
            <div style="color:#fff;line-height:1.5;">Multiplies <span style="color:#3498db;font-weight:bold;">Luck ×1.5</span> for all cards while active. Each non-Caloric roll decrements the counter by 1. Rolling a <span style="color:#e67e22;font-weight:bold;">Caloric</span> card never decrements it.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Stats</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Luck bonus</div><div style="color:#3498db;font-weight:bold;">×1.5</div>
                <div style="color:#7f8c8d;">Max rolls</div><div style="color:#e67e22;font-weight:bold;">10</div>
                <div style="color:#7f8c8d;">Rolls added</div><div style="color:#fff;font-weight:bold;">+2 to +5 per trigger</div>
                <div style="color:#7f8c8d;">Trigger rate</div><div style="color:#2ecc71;font-weight:bold;">Always (100%)</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">How to obtain</div>
            <div style="font-size:0.85em;color:#fff;margin-bottom:0.6em;">Roll any card with the <span style="color:#e67e22;font-weight:bold;">🍔 Caloric</span> tag. Always adds +2 to +5 rolls to the current count.</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${caloricItems2.map(item => `<div onclick="closeIndexEffects();openIndexCardDetail('${item.name.replace(/'/g,"\'")}');" style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.25);border-radius:8px;padding:0.35em 0.7em;display:flex;align-items:center;gap:0.4em;cursor:pointer;">
                    <img src="${getCardImageSrc(item)}" style="width:20px;height:20px;object-fit:cover;border-radius:3px;">
                    <span style="color:#e67e22;font-size:0.85em;font-weight:bold;">${item.name}</span>
                    <span style="color:#7f8c8d;font-size:0.78em;">1 in ${item.chance}</span>
                </div>`).join('')}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related special tag</div>
            <div onclick="closeIndexEffects();openIndexSection('specialtags');" style="background:rgba(243,156,18,0.1);border:1px solid rgba(243,156,18,0.25);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;">
                <span style="font-size:1.3em;">🍔</span>
                <div>
                    <div style="font-weight:bold;color:#e67e22;font-size:0.9em;">Caloric</div>
                    <div style="font-size:0.75em;color:#7f8c8d;">Special tag — triggers Full Belly</div>
                </div>
                <span style="margin-left:auto;color:#e67e22;">›</span>
            </div>
        </div>
    `;
    list.appendChild(vpCard);

    } // end fullBelly section

    // ── Obese ──
    if (!discoveredEffects.has('obese')) {
        // not discovered
    } else {
    const obeseCard = document.createElement('div');
    obeseCard.style.cssText = 'background:rgba(192,57,43,0.08);border:1.5px solid rgba(192,57,43,0.35);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';

    const obeseNow = obeseEndTime > Date.now();
    const obeseLeft = obeseNow ? Math.ceil((obeseEndTime - Date.now()) / 1000) : 0;
    obeseCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🫃</span>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:0.5em;">
                    <div style="font-weight:bold;font-size:1.15em;color:#c0392b;">Obese</div>
                    ${obeseNow ? `<span style="background:#c0392b;color:#fff;font-size:0.7em;font-weight:bold;border-radius:6px;padding:2px 8px;">ACTIVE · ${obeseLeft}s</span>` : '<span style="background:rgba(255,255,255,0.08);color:#7f8c8d;font-size:0.7em;border-radius:6px;padding:2px 8px;">INACTIVE</span>'}
                </div>
                <div style="font-size:0.82em;color:#7f8c8d;">Time-based debuff</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">What it does</div>
            <div style="color:#fff;line-height:1.5;">Reduces <span style="color:#e74c3c;font-weight:bold;">Roll Speed ×0.8</span> for <b>60 seconds</b>. While Obese is active, <span style="color:#e67e22;font-weight:bold;">Full Belly</span> cannot be triggered — any Caloric card rolled is ignored.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Stats</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Roll Speed</div><div style="color:#e74c3c;font-weight:bold;">×0.8</div>
                <div style="color:#7f8c8d;">Duration</div><div style="color:#fff;font-weight:bold;">60 seconds</div>
                <div style="color:#7f8c8d;">Blocks</div><div style="color:#e67e22;font-weight:bold;">Full Belly</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">How it triggers</div>
            <div style="font-size:0.85em;color:#fff;">Triggered when a <span style="color:#e67e22;font-weight:bold;">🍔 Caloric</span> card pushes <span style="color:#e67e22;font-weight:bold;">Full Belly</span> above 10 rolls. The counter resets to 0 and Obese begins.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related effects</div>
            <div onclick="closeIndexEffects();openIndexSection('specialtags');" style="background:rgba(243,156,18,0.1);border:1px solid rgba(243,156,18,0.25);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;margin-bottom:0.4em;">
                <span style="font-size:1.2em;">🍔</span>
                <div><div style="font-weight:bold;color:#e67e22;font-size:0.9em;">Full Belly</div><div style="font-size:0.75em;color:#7f8c8d;">×1.5 Luck · roll-based</div></div>
                <span style="margin-left:auto;color:#e67e22;">›</span>
            </div>
        </div>
    `;
    list.appendChild(obeseCard);

    } // end obese section

    // ── Bleeding ──
    if (!discoveredEffects.has('bleeding')) {
        // not discovered
    } else {
    const sharpItems2 = items.filter(i => Array.isArray(i.tags) && i.tags.includes('Sharp'));
    const bleedingCard = document.createElement('div');
    bleedingCard.style.cssText = 'background:rgba(136,0,0,0.08);border:1.5px solid rgba(136,0,0,0.35);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';

    const bleedingNow = bleedingEndTime > Date.now();
    const bleedingLeft = bleedingNow ? Math.ceil((bleedingEndTime - Date.now()) / 1000) : 0;
    bleedingCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.8em;">
            <span style="font-size:2.2em;">🩸</span>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:0.5em;">
                    <div style="font-weight:bold;font-size:1.15em;color:#8b0000;">Bleeding</div>
                    ${bleedingNow ? `<span style="background:#8b0000;color:#fff;font-size:0.7em;font-weight:bold;border-radius:6px;padding:2px 8px;">ACTIVE · ${bleedingLeft}s left</span>` : '<span style="background:rgba(255,255,255,0.08);color:#7f8c8d;font-size:0.7em;border-radius:6px;padding:2px 8px;">INACTIVE</span>'}
                </div>
                <div style="font-size:0.82em;color:#7f8c8d;">Time-based debuff effect</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">What it does</div>
            <div style="color:#fff;line-height:1.5;">Every second while active, there is a <span style="color:#e74c3c;font-weight:bold;">1 in 3 chance</span> to lose 1 token. Red squares fall from the top of the screen to indicate pulses, with more squares when a token is actually lost.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.6em;">Stats</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5em;font-size:0.85em;">
                <div style="color:#7f8c8d;">Duration</div><div style="color:#fff;font-weight:bold;">60 seconds</div>
                <div style="color:#7f8c8d;">Token loss chance</div><div style="color:#e74c3c;font-weight:bold;">1 in 3 per second</div>
                <div style="color:#7f8c8d;">Visual effect</div><div style="color:#8b0000;font-weight:bold;">Red squares</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">How to obtain</div>
            <div style="font-size:0.85em;color:#fff;margin-bottom:0.6em;">Roll any card with the <span style="color:#e74c3c;font-weight:bold;">🗡️ Sharp</span> tag. There is a 1 in 4 chance to trigger Bleeding.</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5em;">
                ${sharpItems2.map(item => `<div onclick="closeIndexEffects();openIndexCardDetail('${item.name.replace(/'/g,"\'")}');" style="background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.25);border-radius:8px;padding:0.35em 0.7em;display:flex;align-items:center;gap:0.4em;cursor:pointer;">
                    <img src="${getCardImageSrc(item)}" style="width:20px;height:20px;object-fit:cover;border-radius:3px;">
                    <span style="color:#e74c3c;font-size:0.85em;font-weight:bold;">${item.name}</span>
                    <span style="color:#7f8c8d;font-size:0.78em;">1 in ${item.chance}</span>
                </div>`).join('')}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;">
            <div style="color:#7f8c8d;font-size:0.75em;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5em;">Related special tag</div>
            <div onclick="closeIndexEffects();openIndexSection('specialtags');" style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.25);border-radius:8px;padding:0.5em 0.9em;display:flex;align-items:center;gap:0.6em;cursor:pointer;">
                <span style="font-size:1.3em;">🗡️</span>
                <div>
                    <div style="font-weight:bold;color:#e74c3c;font-size:0.9em;">Sharp</div>
                    <div style="font-size:0.75em;color:#7f8c8d;">Special tag — triggers Bleeding</div>
                </div>
                <span style="margin-left:auto;color:#e74c3c;">›</span>
            </div>
        </div>
    `;
    list.appendChild(bleedingCard);
    } // end bleeding section
}

// ===== INDEX: UNLOCKS =====

function renderIndexUnlocks() {
    const list = document.getElementById('index-unlocks-list');
    if (!list) return;
    list.innerHTML = '';

    const unlocks = [
        { level: 3,  name: 'Press Menu',       description: 'Compress and decompress cards. Access card compressor, decompressor in the card popup.', icon: '🗜️' },
        { level: 5,  name: 'Auto Roll',         description: 'Automatic rolling that spends tokens passively without manual input.', icon: '🔄' },
        { level: 7,  name: 'Diamond Press',     description: 'Convert cards into 💎 Diamonds to spend in the Shop.', icon: '💎' },
        { level: 10, name: 'Artifacts',          description: 'Equip special artifacts that permanently modify your game. +1 slot every 10 levels (10, 20, 30, 40, 50).', icon: '🧲' },
    ];

    // Current level progress header
    const header = document.createElement('div');
    header.style.cssText = 'background:rgba(52,152,219,0.1);border:1.5px solid rgba(52,152,219,0.25);border-radius:14px;padding:1em 1.2em;display:flex;align-items:center;gap:1em;margin-bottom:0.2em;';
    const unlockedCount = unlocks.filter(u => level >= u.level).length;
    header.innerHTML = `
        <span style="font-size:2em;">🔓</span>
        <div style="flex:1;">
            <div style="font-weight:bold;color:#3498db;font-size:1.05em;">Level ${level}</div>
            <div style="font-size:0.82em;color:#7f8c8d;">${unlockedCount} / ${unlocks.length} features unlocked</div>
            <div style="margin-top:0.4em;height:6px;background:rgba(255,255,255,0.1);border-radius:999px;overflow:hidden;">
                <div style="width:${Math.round(unlockedCount/unlocks.length*100)}%;height:100%;background:linear-gradient(90deg,#3498db,#2ecc71);border-radius:999px;transition:width 0.4s;"></div>
            </div>
        </div>
    `;
    list.appendChild(header);

    unlocks.forEach(unlock => {
        const unlocked = level >= unlock.level;
        const color = unlocked ? '#3498db' : '#555';
        const card = document.createElement('div');
        card.style.cssText = `background:${unlocked ? 'rgba(52,152,219,0.08)' : 'rgba(255,255,255,0.03)'};border:1.5px solid ${unlocked ? 'rgba(52,152,219,0.3)' : 'rgba(255,255,255,0.08)'};border-radius:14px;padding:1.1em 1.2em;display:flex;flex-direction:column;gap:0.7em;`;

        const levelsLeft = unlock.level - level;
        const progressPct = unlocked ? 100 : Math.max(0, Math.round((level / unlock.level) * 100));

        card.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.9em;">
                <span style="font-size:2em;${unlocked ? '' : 'filter:grayscale(1);opacity:0.5;'}">${unlock.icon}</span>
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:0.5em;flex-wrap:wrap;">
                        <div style="font-weight:bold;font-size:1.05em;color:${color};">${unlock.name}</div>
                        ${unlocked
                            ? '<span style="background:#27ae60;color:#fff;font-size:0.68em;font-weight:bold;border-radius:6px;padding:2px 8px;">✓ UNLOCKED</span>'
                            : `<span style="background:rgba(255,255,255,0.07);color:#7f8c8d;font-size:0.68em;font-weight:bold;border-radius:6px;padding:2px 8px;">🔒 Level ${unlock.level}</span>`}
                    </div>
                    <div style="font-size:0.78em;color:#7f8c8d;margin-top:0.1em;">${unlocked ? `Unlocked at level ${unlock.level}` : `${levelsLeft} level${levelsLeft > 1 ? 's' : ''} away`}</div>
                </div>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.7em 0.9em;font-size:0.85em;color:${unlocked ? '#bdc3c7' : '#555'};">
                ${unlock.description}
            </div>
            <div style="height:4px;background:rgba(255,255,255,0.07);border-radius:999px;overflow:hidden;">
                <div style="width:${progressPct}%;height:100%;background:${unlocked ? 'linear-gradient(90deg,#27ae60,#2ecc71)' : 'linear-gradient(90deg,#3498db,#2980b9)'};border-radius:999px;transition:width 0.4s;"></div>
            </div>
        `;
        list.appendChild(card);
    });
}

// ===== ARTIFACTS UI =====

function updateArtifactsUI() {
    // Update equipped slots panel
    const slotsEl = document.getElementById('artifact-slots');
    const invEl   = document.getElementById('artifact-inventory');
    if (!slotsEl || !invEl) return;

    const maxSlots = getMaxArtifactSlots();

    // ── Equipped slots ──
    slotsEl.innerHTML = '';
    for (let i = 0; i < Math.max(maxSlots, 1); i++) {
        const slot = document.createElement('div');
        const equipped = equippedArtifacts[i];
        const unlocked = i < maxSlots;
        slot.style.cssText = `
            width:72px;height:72px;border-radius:12px;display:flex;flex-direction:column;
            align-items:center;justify-content:center;gap:4px;position:relative;cursor:pointer;
            background:${equipped ? 'rgba(243,156,18,0.15)' : unlocked ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)'};
            border:2px solid ${equipped ? 'rgba(243,156,18,0.6)' : unlocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'};
            transition:all 0.2s;
        `;
        if (equipped) {
            const def = artifactDefinitions.find(a => a.name === equipped.name);
            slot.innerHTML = `<img src="${def ? def.image : ''}" style="width:44px;height:44px;object-fit:contain;border-radius:8px;" onerror="this.style.display='none'">
                <div style="font-size:0.55em;color:#f39c12;text-align:center;line-height:1.1;">${equipped.name}</div>`;
            slot.title = 'Click to unequip ' + equipped.name;
            slot.onclick = () => { unequipArtifact(i); };
        } else if (unlocked) {
            slot.innerHTML = `<div style="font-size:1.5em;color:#555;">＋</div>
                <div style="font-size:0.6em;color:#555;">Empty</div>`;
            slot.title = 'Empty artifact slot';
        } else {
            const neededLvl = ARTIFACT_SLOT_LEVELS[i];
            slot.innerHTML = `<div style="font-size:1.1em;">🔒</div>
                <div style="font-size:0.55em;color:#555;text-align:center;">Lv.${neededLvl}</div>`;
        }
        slotsEl.appendChild(slot);
    }

    // ── Inventory ──
    invEl.innerHTML = '';
    const hasAny = Object.keys(artifactInventory).some(k => artifactInventory[k] > 0);
    if (!hasAny) {
        invEl.innerHTML = '<div style="color:#7f8c8d;font-style:italic;text-align:center;padding:1em;">No artifacts in inventory.<br><span style="font-size:0.85em;">Craft them in the Craft menu.</span></div>';
        return;
    }
    Object.entries(artifactInventory).forEach(([name, qty]) => {
        if (!qty) return;
        const def = artifactDefinitions.find(a => a.name === name);
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.8em;background:rgba(243,156,18,0.08);border:1px solid rgba(243,156,18,0.25);border-radius:10px;padding:0.6em 0.9em;';
        row.innerHTML = `
            <img src="${def ? def.image : ''}" style="width:44px;height:44px;object-fit:contain;border-radius:8px;flex-shrink:0;" onerror="this.style.display='none'">
            <div style="flex:1;">
                <div style="font-weight:bold;color:#f39c12;">${name}</div>
                <div style="font-size:0.78em;color:#7f8c8d;">×${qty} in inventory</div>
            </div>
            <button style="padding:0.4em 1em;border-radius:8px;border:none;background:${getMaxArtifactSlots() > equippedArtifacts.length ? 'linear-gradient(90deg,#f39c12,#e67e22)' : '#555'};color:#fff;font-weight:bold;cursor:pointer;font-size:0.9em;"
                onclick="equipArtifact('${name.replace(/'/g,"\'")}')">Equip</button>
        `;
        invEl.appendChild(row);
    });
}

function closeIndexArtifacts() {
    const m = document.getElementById('index-artifacts-modal');
    if (m) m.style.display = 'none';
}

function renderIndexArtifacts() {
    const list = document.getElementById('index-artifacts-list');
    if (!list) return;
    list.innerHTML = '';

    artifactDefinitions.forEach(def => {
        const equippedCount = getEquippedCount(def.name);
        const ownedCount    = artifactInventory[def.name] || 0;
        const totalCount    = equippedCount + ownedCount;

        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(243,156,18,0.08);border:1.5px solid rgba(243,156,18,0.3);border-radius:14px;padding:1.2em;display:flex;flex-direction:column;gap:0.8em;';
        card.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.9em;">
                <img src="${def.image}" style="width:56px;height:56px;object-fit:contain;border-radius:10px;background:rgba(243,156,18,0.12);padding:6px;flex-shrink:0;" onerror="this.style.display='none'">
                <div style="flex:1;">
                    <div style="font-weight:bold;font-size:1.1em;color:#f39c12;">${def.name}</div>
                    <div style="font-size:0.78em;color:#7f8c8d;margin-top:0.1em;">
                        ${equippedCount > 0 ? `<span style="color:#2ecc71;">✓ ${equippedCount} equipped</span>  ` : ''}${ownedCount > 0 ? `×${ownedCount} in inventory` : equippedCount === 0 ? 'Not obtained' : ''}
                    </div>
                </div>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.8em 1em;font-size:0.88em;color:#bdc3c7;">
                ${def.description}
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:0.7em 0.9em;">
                <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:0.5em;">Craft Recipe</div>
                <div style="display:flex;flex-wrap:wrap;gap:0.4em;">
                    ${def.craft.map(ing => {
                        const have = collection[ing.name] || 0;
                        const ok   = have >= ing.amount;
                        return `<div style="background:rgba(255,255,255,0.07);border-radius:7px;padding:0.3em 0.7em;font-size:0.83em;">
                            <span style="color:#fff;font-weight:bold;">${ing.amount}×</span>
                            <span style="color:${ok ? '#2ecc71' : '#e74c3c'};">${ing.name}</span>
                            <span style="color:#7f8c8d;"> (${have})</span>
                        </div>`;
                    }).join('')}
                </div>
                <div style="font-size:0.78em;color:#7f8c8d;margin-top:0.3em;">⏱ ${Math.round(def.craftTime/1000)}s</div>
            </div>
        `;
        list.appendChild(card);
    });
}

// ===== INDEX: POTIONS =====

function closeIndexPotions() {
    document.getElementById('index-potions-modal').style.display = 'none';
}

function renderIndexPotions() {
    const list = document.getElementById('index-potions-list');
    if (!list) return;
    list.innerHTML = '';

    // Discovered = in inventory OR all ingredients have been collected at least once
    const visiblePotions = potions.filter(potion => {
        if ((potionInventory[potion.name] || 0) > 0) return true;
        const recipe = craftRecipes.find(r => r.name === potion.name);
        if (!recipe) return false;
        return recipe.ingredients.every(ing => (collection[ing.name] || 0) > 0);
    });

    if (visiblePotions.length === 0) {
        list.innerHTML = `<div style="text-align:center;color:#7f8c8d;padding:3em 1em;font-style:italic;">No potions discovered yet.<br><span style="font-size:0.85em;">Collect all required ingredients to unlock a recipe!</span></div>`;
        return;
    }

    visiblePotions.forEach(potion => {
        const owned = potionInventory[potion.name] || 0;
        const recipe = craftRecipes.find(r => r.name === potion.name);
        const durationSec = potion.duration / 1000;
        const durationStr = durationSec >= 60 ? `${Math.floor(durationSec/60)}m ${durationSec%60 > 0 ? (durationSec%60)+'s' : ''}`.trim() : `${durationSec}s`;

        const effectLabel = potion.type === 'rollspeed'
            ? `×${potion.power} Roll Speed`
            : potion.type === 'luck'
            ? `×${potion.power} Luck`
            : `×${potion.power} ${potion.type}`;

        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(155,89,182,0.1);border:1.5px solid rgba(155,89,182,0.25);border-radius:14px;padding:1.1em 1.2em;display:flex;flex-direction:column;gap:0.7em;';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:0.9em;';
        header.innerHTML = `
            <img src="Icons/${potion.image}" style="width:48px;height:48px;object-fit:contain;border-radius:10px;background:rgba(155,89,182,0.2);padding:4px;flex-shrink:0;" onerror="this.style.display='none'">
            <div style="flex:1;">
                <div style="font-weight:bold;font-size:1.05em;color:#c39bd3;">${potion.name}</div>
                <div style="font-size:0.8em;color:#9b59b6;margin-top:0.1em;">×${owned} in inventory</div>
            </div>
        `;
        card.appendChild(header);

        const effectRow = document.createElement('div');
        effectRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.5em;';
        effectRow.innerHTML = `
            <div style="background:rgba(255,255,255,0.07);border-radius:8px;padding:0.3em 0.8em;font-size:0.85em;">
                <span style="color:#7f8c8d;">Effect: </span><span style="color:#2ecc71;font-weight:bold;">${effectLabel}</span>
            </div>
            <div style="background:rgba(255,255,255,0.07);border-radius:8px;padding:0.3em 0.8em;font-size:0.85em;">
                <span style="color:#7f8c8d;">Duration: </span><span style="color:#4ecdc4;font-weight:bold;">${durationStr}</span>
            </div>
        `;
        card.appendChild(effectRow);

        if (recipe) {
            const recipeRow = document.createElement('div');
            recipeRow.style.cssText = 'border-top:1px solid rgba(155,89,182,0.2);padding-top:0.6em;';
            const ings = recipe.ingredients.map(i => {
                const have = collection[i.name] || 0;
                const color = have >= i.amount ? '#2ecc71' : '#e74c3c';
                return `<span style="color:#fff;font-weight:bold;">${i.amount}×</span> <span style="color:${color};">${i.name}</span>`;
            }).join('  <span style="color:#555;">+</span>  ');
            const craftTimeSec = Math.round(recipe.time / 1000);
            const craftTimeStr = craftTimeSec >= 60 ? `${Math.floor(craftTimeSec/60)}m ${craftTimeSec%60 > 0 ? (craftTimeSec%60)+'s':''}`.trim() : `${craftTimeSec}s`;
            recipeRow.innerHTML = `
                <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.35em;">Craft Recipe</div>
                <div style="font-size:0.88em;">${ings}</div>
                <div style="font-size:0.78em;color:#7f8c8d;margin-top:0.2em;">⏱ ${craftTimeStr}</div>
            `;
            card.appendChild(recipeRow);
        }

        list.appendChild(card);
    });
}

// ===== INDEX: TAGS =====

function closeIndexTags() {
    document.getElementById('index-tags-modal').style.display = 'none';
}

function renderIndexTags() {
    const list = document.getElementById('index-tags-list');
    if (!list) return;
    list.innerHTML = '';

    const tags = [
        { name: 'Gold',    color: '#f1c40f', mult: 10,    chance: '1 in 10',    icon: '🌕', desc: 'Common variant. ×10 rarity multiplier.' },
        { name: 'Rainbow', color: '#e74c3c', mult: 100,   chance: '1 in 1,000', icon: '🌈', desc: 'Rare variant. ×100 rarity multiplier.' },
        { name: 'Shiny',   color: '#3498db', mult: 1000,  chance: '1 in 100,000', icon: '💫', desc: 'Very rare variant. ×1,000 rarity multiplier.' },
        { name: 'Nuclear', color: '#2ecc71', mult: 10000, chance: '1 in 1,000,000,000', icon: '☢️', desc: 'Legendary variant. ×10,000 rarity multiplier.' },
    ];

    let anyDiscovered = false;

    tags.forEach(tag => {
        const tagKey = `(${tag.name})`;

        // Show tag if ever discovered (even if all pressed away)
        if (!discoveredTags.has(tag.name)) return;
        anyDiscovered = true;

        // Currently owned cards with this tag
        const ownedCards = Object.keys(collection).filter(k => k.endsWith(tagKey) && (collection[k] || 0) > 0);
        const totalOwned = ownedCards.reduce((sum, k) => sum + (collection[k] || 0), 0);
        const uniqueCards = ownedCards.length;

        const card = document.createElement('div');
        card.style.cssText = `background:rgba(255,255,255,0.05);border:2px solid ${tag.color}33;border-radius:14px;padding:1.1em 1.2em;`;

        card.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.8em;margin-bottom:0.8em;">
                <span style="font-size:2em;">${tag.icon}</span>
                <div style="flex:1;">
                    <div style="font-weight:bold;font-size:1.1em;color:${tag.color};">${tag.name}</div>
                    <div style="font-size:0.8em;color:#7f8c8d;">${tag.desc}</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5em;margin-bottom:0.8em;">
                <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;text-align:center;">
                    <div style="font-size:0.7em;color:#7f8c8d;text-transform:uppercase;">Drop chance</div>
                    <div style="font-size:0.82em;font-weight:bold;color:#fff;">${tag.chance}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;text-align:center;">
                    <div style="font-size:0.7em;color:#7f8c8d;text-transform:uppercase;">Owned (total)</div>
                    <div style="font-size:0.82em;font-weight:bold;color:#4ecdc4;">×${totalOwned}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:0.4em 0.6em;text-align:center;">
                    <div style="font-size:0.7em;color:#7f8c8d;text-transform:uppercase;">Unique cards</div>
                    <div style="font-size:0.82em;font-weight:bold;color:#9b59b6;">${uniqueCards}</div>
                </div>
            </div>
            <div style="font-size:0.8em;color:#7f8c8d;margin-bottom:0.5em;text-transform:uppercase;letter-spacing:0.4px;">Rarity multiplier</div>
            <div style="display:flex;align-items:center;gap:0.6em;margin-bottom:0.8em;">
                <div style="flex:1;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;">
                    <div style="height:100%;width:${Math.min(100, Math.log10(tag.mult) / 4 * 100)}%;background:${tag.color};border-radius:4px;"></div>
                </div>
                <span style="font-weight:bold;color:${tag.color};font-size:0.9em;">×${tag.mult.toLocaleString()}</span>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:0.7em;">
                <div style="font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:0.5em;">Discovered variants</div>
                <div style="display:flex;flex-wrap:wrap;gap:0.4em;">
                    ${ownedCards.map(k => {
                        const baseName = k.replace(` ${tagKey}`, '');
                        const item = items.find(i => i.name === baseName);
                        const dv = item ? Math.floor(Math.pow(item.chance * tag.mult, 0.25)) : 0;
                        const qty = collection[k] || 0;
                        return `<div onclick="openIndexCardDetail('${baseName.replace(/'/g,"\\'")}');closeIndexTags();" style="background:rgba(255,255,255,0.07);border-radius:8px;padding:0.3em 0.7em;font-size:0.78em;cursor:pointer;display:flex;align-items:center;gap:0.4em;">
                            <img src="${getCardImageSrc(item)}" style="width:18px;height:18px;object-fit:cover;border-radius:3px;">
                            <span style="color:#fff;">${baseName}</span>
                            <span style="color:#7f8c8d;">×${qty}</span>
                            <span style="color:#9b59b6;font-size:0.85em;">💎${dv}</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;

        list.appendChild(card);
    });

    if (!anyDiscovered) {
        list.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em 1em;font-style:italic;">No rarity tags discovered yet!<br><span style="font-size:0.85em;opacity:0.7;">Keep rolling to find Gold, Rainbow, Shiny and Nuclear cards.</span></div>';
    }
}

// ═══════════════════════════════════════════════════════════════
// MARKET / SELL SYSTEM
// ═══════════════════════════════════════════════════════════════

let _sellSelectedCard = null;
let _sellQty          = 1;
let _sellPriceMode    = 'total';
let _sellPriceSrc     = 'press';
let _sellItemType     = 'card'; // 'card' | 'xp'
let _marketCurrentTab = 'all';
let _marketListings   = [];

// ── Helpers ──

function _pressValue(baseName, type) {
    const item = items.find(i => i.name === baseName);
    if (!item) return 0;
    let chance = item.chance;
    if (type === 'Gold')    chance *= 10;
    if (type === 'Rainbow') chance *= 100;
    if (type === 'Shiny')   chance *= 1000;
    if (type === 'Nuclear') chance *= 10000;
    return Math.floor(Math.pow(chance, 0.25));
}

// ── Open / close panels ──

function openSellMenu() {
    _resetSellForm();
    document.getElementById('sell-panel').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    _initSellCardSearch();
}
function closeSellMenu() {
    document.getElementById('sell-panel').style.display = 'none';
    document.body.style.overflow = '';
}
function openMarketMenu() {
    document.getElementById('market-panel').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const s = document.getElementById('market-search');
    if (s) s.value = '';
    refreshMarket();
}
function closeMarketMenu() {
    document.getElementById('market-panel').style.display = 'none';
    document.body.style.overflow = '';
}

// ── Sell form reset ──

function _resetSellForm() {
    _sellSelectedCard = null;
    _sellQty = 1;
    _sellPriceMode = 'total';
    _sellPriceSrc = 'press';
    if (typeof _sellItemType !== 'undefined') _sellItemType = 'card';
    const _tc = document.getElementById('sell-type-card'), _tx = document.getElementById('sell-type-xp');
    if (_tc) _tc.classList.add('active');
    if (_tx) _tx.classList.remove('active');
    const _cs = document.getElementById('sell-card-section'), _xs = document.getElementById('sell-xp-section');
    if (_cs) _cs.style.display = '';
    if (_xs) _xs.style.display = 'none';
    const _pp = document.getElementById('sell-price-src-press');
    if (_pp) _pp.style.display = '';

    const search = document.getElementById('sell-card-search');
    if (search) search.value = '';
    const dd = document.getElementById('sell-card-dropdown');
    if (dd) { dd.innerHTML = ''; dd.style.display = 'none'; }
    const selCard = document.getElementById('sell-selected-card');
    if (selCard) selCard.style.display = 'none';
    const priceInput = document.getElementById('sell-price-input');
    if (priceInput) { priceInput.value = ''; priceInput.style.display = 'none'; }
    const xpInput = document.getElementById('sell-xp-input');
    if (xpInput) xpInput.value = '';
    const customQty = document.getElementById('sell-qty-custom');
    if (customQty) customQty.style.display = 'none';

    document.querySelectorAll('.sell-qty-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.qty === '1'));
    document.querySelectorAll('.sell-price-mode-btn').forEach(b =>
        b.classList.toggle('active', b.id === 'sell-price-mode-total'));
    document.querySelectorAll('.sell-price-src-btn').forEach(b =>
        b.classList.toggle('active', b.id === 'sell-price-src-press'));

    const summary = document.getElementById('sell-summary');
    if (summary) summary.style.display = 'none';
    const msg = document.getElementById('sell-msg');
    if (msg) msg.style.display = 'none';
    const preview = document.getElementById('sell-price-preview');
    if (preview) preview.textContent = '';
}

// ── Card search ──

function _initSellCardSearch() {
    const input = document.getElementById('sell-card-search');
    const dd    = document.getElementById('sell-card-dropdown');
    if (!input || !dd) return;

    input.oninput = () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { dd.style.display = 'none'; return; }

        const owned = _getSortedCardNames().filter(name =>
            (collection[name] || 0) > 0 && name.toLowerCase().includes(q)
        );
        if (!owned.length) { dd.style.display = 'none'; return; }

        dd.innerHTML = '';
        owned.slice(0, 20).forEach(name => {
            const type     = name.endsWith('(Nuclear)') ? 'Nuclear'
                           : name.endsWith('(Shiny)')   ? 'Shiny'
                           : name.endsWith('(Rainbow)') ? 'Rainbow'
                           : name.endsWith('(Gold)')    ? 'Gold' : '';
            const baseName = type ? name.replace(' (' + type + ')', '') : name;
            const item     = items.find(i => i.name === baseName);
            const qty      = collection[name] || 0;

            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:0.7em;padding:0.55em 0.8em;cursor:pointer;';
            row.onmouseenter = () => row.style.background = 'rgba(230,126,34,0.12)';
            row.onmouseleave = () => row.style.background = '';

            const img = document.createElement('img');
            img.src = getCardImageSrc(item);
            img.style.cssText = 'width:36px;height:24px;object-fit:cover;border-radius:4px;';

            const label = document.createElement('span');
            label.style.cssText = 'flex:1;color:#fff;font-size:0.95em;';
            label.textContent = name;

            const qtySpan = document.createElement('span');
            qtySpan.style.cssText = 'color:#7f8c8d;font-size:0.82em;';
            qtySpan.textContent = '×' + qty;

            row.appendChild(img);
            row.appendChild(label);
            row.appendChild(qtySpan);
            row.onclick = () => _selectSellCard(baseName, type, name);
            dd.appendChild(row);
        });
        dd.style.display = 'block';
    };

    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function _closeDD(e) {
            const wrap = document.getElementById('sell-card-search-wrap');
            if (wrap && !wrap.contains(e.target)) {
                dd.style.display = 'none';
                document.removeEventListener('click', _closeDD);
            }
        });
    }, 0);
}

function _selectSellCard(baseName, type, fullName) {
    const item = items.find(i => i.name === baseName);
    if (!item) return;
    _sellSelectedCard = { name: fullName, baseName, type };
    _sellQty = 1;

    document.getElementById('sell-card-search').value = '';
    document.getElementById('sell-card-dropdown').style.display = 'none';

    const selDiv = document.getElementById('sell-selected-card');
    selDiv.style.display = 'flex';
    document.getElementById('sell-card-img').src  = getCardImageSrc(item);
    document.getElementById('sell-card-name').textContent  = fullName;
    document.getElementById('sell-card-owned').textContent = 'Owned: ×' + (collection[fullName] || 0);

    document.querySelectorAll('.sell-qty-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.qty === '1'));
    document.getElementById('sell-qty-custom').style.display = 'none';
    _updateSellSummary();
}

function clearSellCard() {
    _sellSelectedCard = null;
    document.getElementById('sell-selected-card').style.display = 'none';
    document.getElementById('sell-card-search').value = '';
    _updateSellSummary();
}

// ── Qty buttons (wired once on load) ──

(function initSellQtyBtns() {
    // Use event delegation since buttons exist in the panel
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.sell-qty-btn');
        if (!btn) return;
        document.querySelectorAll('.sell-qty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const customInput = document.getElementById('sell-qty-custom');
        if (btn.dataset.qty === 'custom') {
            customInput.style.display = 'block';
            customInput.focus();
            _sellQty = parseInt(customInput.value) || 1;
        } else if (btn.dataset.qty === 'max') {
            customInput.style.display = 'none';
            _sellQty = _sellSelectedCard ? (collection[_sellSelectedCard.name] || 1) : 1;
        } else {
            customInput.style.display = 'none';
            _sellQty = parseInt(btn.dataset.qty);
        }
        _updateSellSummary();
    });

    document.addEventListener('input', function(e) {
        if (e.target.id === 'sell-qty-custom') {
            _sellQty = Math.max(1, parseInt(e.target.value) || 1);
            _updateSellSummary();
        }
        if (e.target.id === 'sell-price-input') {
            _updateSellSummary();
        }
        if (e.target.id === 'sell-xp-input') {
            _updateSellSummary();
        }
    });
})();

function setSellPriceMode(mode) {
    _sellPriceMode = mode;
    document.getElementById('sell-price-mode-total').classList.toggle('active', mode === 'total');
    document.getElementById('sell-price-mode-each').classList.toggle('active',  mode === 'each');
    _updateSellSummary();
}

function setSellPriceSrc(src) {
    _sellPriceSrc = src;
    document.getElementById('sell-price-src-press').classList.toggle('active',  src === 'press');
    document.getElementById('sell-price-src-custom').classList.toggle('active', src === 'custom');
    const freeBtn = document.getElementById('sell-price-src-free');
    if (freeBtn) freeBtn.classList.toggle('active', src === 'free');
    const priceInput = document.getElementById('sell-price-input');
    priceInput.style.display = src === 'custom' ? 'block' : 'none';
    if (src === 'custom') priceInput.focus();
    _updateSellSummary();
}

function _fmtPrice(v) {
    if (v == null) return '0';
    // Show up to 2 decimal places, strip trailing zeros
    return parseFloat(v.toFixed(2)).toString();
}

function _computeSellPrice() {
    const isXp = _sellItemType === 'xp';
    if (!isXp && !_sellSelectedCard) return null;

    if (_sellPriceSrc === 'free') return { priceEach: 0, priceTotal: 0 };

    // For card press-value mode
    if (_sellPriceSrc === 'press' && !isXp) {
        const pressVal = _pressValue(_sellSelectedCard.baseName, _sellSelectedCard.type);
        const priceEach = Math.max(1, pressVal);
        return { priceEach, priceTotal: priceEach * _sellQty };
    }

    // Custom price — qty differs between card and XP
    const effectiveQty = isXp
        ? (parseInt(document.getElementById('sell-xp-input')?.value) || 0)
        : _sellQty;

    const raw = parseFloat(document.getElementById('sell-price-input').value);
    if (isNaN(raw) || raw < 0) return null;
    const v = Math.max(0, parseFloat(raw.toFixed(2)));
    if (_sellPriceMode === 'each') return { priceEach: v, priceTotal: parseFloat((v * effectiveQty).toFixed(2)) };
    return { priceEach: effectiveQty > 0 ? parseFloat((v / effectiveQty).toFixed(2)) : v, priceTotal: v };
}

function setSellItemType(type) {
    _sellItemType = type;
    const typeCard = document.getElementById('sell-type-card');
    const typeXp   = document.getElementById('sell-type-xp');
    if (typeCard) typeCard.classList.toggle('active', type === 'card');
    if (typeXp)   typeXp.classList.toggle('active',   type === 'xp');
    const cardSec = document.getElementById('sell-card-section');
    const xpSec   = document.getElementById('sell-xp-section');
    if (cardSec) cardSec.style.display = type === 'card' ? '' : 'none';
    if (xpSec)   xpSec.style.display   = type === 'xp'   ? '' : 'none';
    if (type === 'xp') {
        _sellSelectedCard = null;
        const ownedEl = document.getElementById('sell-xp-owned');
        if (ownedEl) ownedEl.textContent = 'You have: ' + xp + ' XP';
        const pressSrcBtn = document.getElementById('sell-price-src-press');
        if (pressSrcBtn) pressSrcBtn.style.display = 'none';
        setSellPriceSrc('custom');
    } else {
        const pressSrcBtn = document.getElementById('sell-price-src-press');
        if (pressSrcBtn) pressSrcBtn.style.display = '';
        setSellPriceSrc('press');
    }
    _updateSellSummary();
}

function _updateSellSummary() {
    const summary     = document.getElementById('sell-summary');
    const summaryText = document.getElementById('sell-summary-text');
    const preview     = document.getElementById('sell-price-preview');
    const postBtn     = document.getElementById('sell-post-btn');
    if (!summary || !summaryText || !preview || !postBtn) return;

    const isXp = _sellItemType === 'xp';

    if (!isXp && !_sellSelectedCard) {
        summary.style.display = 'none';
        preview.textContent = '';
        return;
    }

    let qty;
    if (isXp) {
        const xpAmt = parseInt(document.getElementById('sell-xp-input')?.value) || 0;
        qty = Math.min(xpAmt, xp);
        if (qty < 1) { summary.style.display = 'none'; preview.textContent = 'Enter a valid XP amount (you have ' + xp + ' XP).'; return; }
    } else {
        qty = Math.min(_sellQty, collection[_sellSelectedCard.name] || 0);
        if (qty < 1) { summary.style.display = 'none'; preview.textContent = "You don\u2019t own enough."; return; }
    }

    const price = _computeSellPrice();
    if (!price) { summary.style.display = 'none'; preview.textContent = 'Enter a valid price.'; return; }

    const { priceTotal, priceEach } = price;
    const isFree = priceTotal === 0;
    const priceLabel = isFree ? '<span style="color:#2ecc71;">\uD83C\uDD93 Free</span>' : '<b style="color:#a29bfe;">\uD83D\uDC8E ' + _fmtPrice(priceTotal) + '</b>';

    if (isXp) {
        preview.innerHTML = priceLabel;
        summaryText.innerHTML = 'Selling <b style="color:#4ecdc4;">' + qty + ' XP</b><br>Price: ' + priceLabel;
    } else {
        const pressVal = _pressValue(_sellSelectedCard.baseName, _sellSelectedCard.type);
        preview.innerHTML = isFree
            ? priceLabel
            : '<b style="color:#a29bfe;">\uD83D\uDC8E ' + _fmtPrice(priceEach) + '</b> each'
              + ' \u00B7 <b style="color:#a29bfe;">\uD83D\uDC8E ' + _fmtPrice(priceTotal) + '</b> total'
              + (pressVal ? ' <span style="color:#7f8c8d;font-size:0.85em;">(press: \uD83D\uDC8E' + pressVal + ')</span>' : '');
        summaryText.innerHTML = 'Selling <b style="color:#e67e22;">\u00D7' + qty + '</b> <b>' + _sellSelectedCard.name + '</b><br>Price: ' + priceLabel
            + (qty > 1 && !isFree ? ' <span style="color:#7f8c8d;">(' + _fmtPrice(priceEach) + ' each)</span>' : '');
    }

    summary.style.display = 'flex';
    postBtn.disabled = false;
}

// ── Post listing ──

async function postListing() {
    const price = _computeSellPrice();
    if (!price) return;

    const btn = document.getElementById('sell-post-btn');
    btn.disabled = true;
    btn.textContent = 'Posting\u2026';

    const isXpPost = _sellItemType === 'xp';

    // Resolve quantity based on item type
    let postQty;
    if (isXpPost) {
        postQty = Math.min(parseInt(document.getElementById('sell-xp-input')?.value) || 0, xp);
        if (postQty < 1) { _showSellMsg('Not enough XP! (you have ' + xp + ')', 'error'); btn.disabled = false; btn.textContent = 'Post Listing'; return; }
    } else {
        if (!_sellSelectedCard) { _showSellMsg('Select a card first.', 'error'); btn.disabled = false; btn.textContent = 'Post Listing'; return; }
        const maxOwned = collection[_sellSelectedCard.name] || 0;
        postQty = Math.min(_sellQty, maxOwned);
        if (postQty < 1) { _showSellMsg('Not enough cards!', 'error'); btn.disabled = false; btn.textContent = 'Post Listing'; return; }
    }

    try {
        if (isXpPost) {
            xp = Math.max(0, xp - postQty);
            updateLevelXpDisplay();
        } else {
            collection[_sellSelectedCard.name] -= postQty;
            if ((collection[_sellSelectedCard.name] || 0) <= 0) delete collection[_sellSelectedCard.name];
            updateCollection(); updateInventoryStats();
        }
        saveCollection();

        const fbPost = window._fbPostListing;
        if (!fbPost) throw new Error('Firebase not ready');
        await fbPost({
            sellerUid:    window._currentUser.uid,
            sellerName:   window._cloudUserData?.username || 'Unknown',
            cardName:     isXpPost ? 'XP' : _sellSelectedCard.baseName,
            cardType:     isXpPost ? '' : _sellSelectedCard.type,
            amount:       postQty,
            priceTotal:   price.priceTotal,
            itemCategory: isXpPost ? 'xp' : 'card',
        });

        const label = isXpPost ? postQty + ' XP' : ('\u00D7' + postQty + ' ' + _sellSelectedCard.name);
        const priceLabel = price.priceTotal === 0 ? '\uD83C\uDD93 Free' : '\uD83D\uDC8E' + _fmtPrice(price.priceTotal);
        _showSellMsg('Listed ' + label + ' for ' + priceLabel, 'success');
        _resetSellForm();
        btn.textContent = 'Post Listing';
    } catch(e) {
        if (isXpPost) { xp += postQty; updateLevelXpDisplay(); }
        else { collection[_sellSelectedCard.name] = (collection[_sellSelectedCard.name] || 0) + postQty; updateCollection(); }
        _showSellMsg('Failed: ' + (e.message || e), 'error');
        btn.disabled = false;
        btn.textContent = 'Post Listing';
    }
}

function _showSellMsg(text, type) {
    const el = document.getElementById('sell-msg');
    if (!el) return;
    el.textContent = text;
    el.style.display  = 'block';
    el.style.background = type === 'error' ? 'rgba(231,76,60,0.18)' : 'rgba(39,174,96,0.18)';
    el.style.color      = type === 'error' ? '#e74c3c'              : '#2ecc71';
    el.style.border     = '1px solid ' + (type === 'error' ? 'rgba(231,76,60,0.4)' : 'rgba(39,174,96,0.4)');
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// ── Market listing display ──

let _rapCache = {}; // { itemKey: rapValue } — refreshed on market open

function setMarketTab(tab) {
    _marketCurrentTab = tab;
    ['all','mine','rap'].forEach(t => {
        const el = document.getElementById('market-tab-' + t);
        if (!el) return;
        el.style.color = t === tab ? '#9b59b6' : '#7f8c8d';
        el.style.borderBottomColor = t === tab ? '#9b59b6' : 'transparent';
    });
    if (tab === 'rap') {
        _renderRapTable();
    } else {
        _renderMarketListings();
    }
}

async function refreshMarket() {
    const list = document.getElementById('market-list');
    if (list) list.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">Loading\u2026</div>';
    try {
        const fetchListings = window._fbFetchListings;
        const getAllRap     = window._fbGetAllRap;
        if (!fetchListings) throw new Error('Firebase not ready');
        // Load listings and RAP in parallel
        const [listings, rapData] = await Promise.all([
            fetchListings(),
            getAllRap ? getAllRap() : Promise.resolve({})
        ]);
        _marketListings = listings;
        _rapCache = rapData || {};
        if (_marketCurrentTab === 'rap') _renderRapTable();
        else _renderMarketListings();
    } catch(e) {
        if (list) list.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:2em;">Failed to load: ' + (e.message || e) + '</div>';
    }
}

function _renderMarketListings() {
    const list  = document.getElementById('market-list');
    if (!list) return;
    const myUid = window._currentUser?.uid;
    const q = (document.getElementById('market-search')?.value || '').toLowerCase().trim();

    let toShow = _marketCurrentTab === 'mine'
        ? _marketListings.filter(l => l.sellerUid === myUid)
        : _marketListings;

    // Apply search filter
    if (q) {
        toShow = toShow.filter(l => {
            const name   = (l.cardName || '').toLowerCase();
            const type   = (l.cardType || '').toLowerCase();
            const seller = (l.sellerName || '').toLowerCase();
            return name.includes(q) || type.includes(q) || seller.includes(q);
        });
    }

    if (!toShow.length) {
        list.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">'
            + (q ? 'No listings match "' + q + '".'
                : _marketCurrentTab === 'mine' ? 'No active listings.' : 'No listings yet. Be the first to sell!')
            + '</div>';
        return;
    }

    list.innerHTML = '';
    toShow.forEach(listing => {
        const isOwn     = listing.sellerUid === myUid;
        const isXpLi    = listing.itemCategory === 'xp';
        const isFree    = listing.priceTotal === 0;
        const item      = !isXpLi ? items.find(i => i.name === listing.cardName) : null;
        const fullName  = isXpLi
            ? listing.amount + ' XP'
            : (listing.cardType ? listing.cardName + ' (' + listing.cardType + ')' : listing.cardName);
        const canAfford = isFree || diamonds >= listing.priceTotal;

        const card = document.createElement('div');
        card.className = 'market-listing' + (isOwn ? ' own' : '');

        // Image / icon
        const img = document.createElement('img');
        img.src = item ? getCardImageSrc(item) : '';
        img.style.cssText = 'width:54px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;';
        img.onerror = function() { this.style.display = 'none'; };

        // XP listings use an emoji instead of a card image
        if (isXpLi) {
            img.style.display = 'none'; // hide the img, we'll add emoji below
        }

        // Info block
        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';

        const nameEl = document.createElement('div');
        nameEl.style.cssText = 'font-weight:bold;color:#fff;font-size:1em;';
        nameEl.textContent = fullName;

        const detailEl = document.createElement('div');
        detailEl.style.cssText = 'font-size:0.8em;color:#7f8c8d;margin-top:0.1em;';
        const freeStr  = '<span style="color:#2ecc71;">\uD83C\uDD93 Free</span>';
        const priceBit = isFree ? freeStr : ('\uD83D\uDC8E ' + _fmtPrice(listing.priceTotal) + (listing.amount > 1 && !isXpLi ? ' <span style="color:#555;">(' + _fmtPrice(listing.priceEach) + ' each)</span>' : ''));
        detailEl.innerHTML = (isXpLi ? '\u2B50 ' : '\u00D7') + listing.amount + ' \u00B7 ' + priceBit;

        const sellerEl = document.createElement('div');
        sellerEl.style.cssText = 'font-size:0.75em;color:#555;margin-top:0.1em;';
        sellerEl.textContent = 'by ' + (listing.sellerName || 'Unknown');

        // Per-card luck row (cards only)
        let luckRowEl = null;
        if (!isXpLi && item) {
            luckRowEl = document.createElement('div');
            luckRowEl.style.cssText = 'font-size:0.75em;margin-top:0.25em;display:flex;align-items:center;flex-wrap:wrap;gap:0.3em;';
            const multMap = { '': 1, 'Gold': 10, 'Rainbow': 100, 'Shiny': 1000, 'Nuclear': 10000 };
            const rarity = item.chance * (multMap[listing.cardType || ''] || 1);
            updateLuck();
            let chanceStr;
            if (luck >= rarity) {
                chanceStr = '100%';
            } else {
                const pct = luck / rarity * 100;
                chanceStr = pct >= 1 ? pct.toFixed(1) + '%' : pct.toFixed(3) + '%';
            }
            const rarColor = rarity < 10 ? '#95a5a6' : rarity < 100 ? '#2ecc71' : rarity < 1000 ? '#3498db' : rarity < 10000 ? '#9b59b6' : rarity < 100000 ? '#f39c12' : '#e74c3c';
            luckRowEl.innerHTML =
                getRarityTag(rarity) +
                '<span style="color:#555;">1 in ' + rarity.toLocaleString() + '</span>' +
                '<span style="color:#3498db;">\uD83C\uDFB2 ' + chanceStr + ' chance</span>';
        }

        // RAP row — show for all listings that have a RAP
        const rapKey = isXpLi
            ? 'xp'
            : (listing.cardType
                ? 'card:' + listing.cardName + ':' + listing.cardType
                : 'card:' + listing.cardName);
        const rapVal = _rapCache[rapKey];
        let rapEl = null;
        if (rapVal != null) {
            rapEl = document.createElement('div');
            rapEl.style.cssText = 'font-size:0.75em;margin-top:0.2em;color:#7f8c8d;';
            // Compare listing price per unit vs RAP
            const perUnit = isFree ? 0 : (listing.priceEach || listing.priceTotal);
            let cmpStr = '';
            if (!isFree && perUnit > 0) {
                const diff = perUnit - rapVal;
                const pct  = rapVal > 0 ? (diff / rapVal * 100) : 0;
                if (Math.abs(pct) >= 0.5) {
                    cmpStr = diff > 0
                        ? ' <span style="color:#e74c3c;">\u25b2 +' + _fmtPrice(Math.abs(diff)) + ' (' + pct.toFixed(1) + '% above)</span>'
                        : ' <span style="color:#2ecc71;">\u25bc \u2212' + _fmtPrice(Math.abs(diff)) + ' (' + Math.abs(pct).toFixed(1) + '% below)</span>';
                }
            }
            rapEl.innerHTML = 'RAP \uD83D\uDC8E' + _fmtPrice(rapVal) + cmpStr;
        }

        info.appendChild(nameEl);
        info.appendChild(detailEl);
        if (rapEl) info.appendChild(rapEl);
        if (luckRowEl) info.appendChild(luckRowEl);
        info.appendChild(sellerEl);

        // Action button(s)
        if (isOwn) {
            const btnWrap = document.createElement('div');
            btnWrap.style.cssText = 'display:flex;flex-direction:column;gap:0.35em;';

            const modBtn = document.createElement('button');
            modBtn.className = 'market-cancel-btn';
            modBtn.style.cssText += ';background:rgba(52,152,219,0.2);color:#3498db;border-color:rgba(52,152,219,0.35);';
            modBtn.textContent = '✏️ Modify';
            modBtn.onclick = () => modifyListing(listing);

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'market-cancel-btn';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => cancelListing(listing.id, listing.cardName, listing.cardType || '', listing.amount, listing.itemCategory || 'card');

            btnWrap.appendChild(modBtn);
            btnWrap.appendChild(cancelBtn);
            card.appendChild(img);
            if (isXpLi) {
                const xpIcon = document.createElement('span');
                xpIcon.style.cssText = 'font-size:2em;flex-shrink:0;line-height:1;';
                xpIcon.textContent = '\u2B50';
                card.insertBefore(xpIcon, card.firstChild);
            }
            card.appendChild(info);
            card.appendChild(btnWrap);
            list.appendChild(card);
            return; // skip the generic append below
        }
        const btn = document.createElement('button');
        btn.className = 'market-buy-btn';
        btn.textContent = isFree ? '\uD83C\uDD93 Get' : '\uD83D\uDC8E Buy';
        btn.disabled = !canAfford;
        if (!canAfford) btn.title = 'Not enough diamonds (' + diamonds + ' / ' + listing.priceTotal + ')';
        btn.onclick = () => buyListing(listing, btn);

        card.appendChild(img);
        if (isXpLi) {
            const xpIcon = document.createElement('span');
            xpIcon.style.cssText = 'font-size:2em;flex-shrink:0;line-height:1;';
            xpIcon.textContent = '\u2B50';
            card.insertBefore(xpIcon, card.firstChild);
        }
        card.appendChild(info);
        card.appendChild(btn);
        list.appendChild(card);
    });
}

// ── RAP table ──

function _renderRapTable() {
    const list = document.getElementById('market-list');
    if (!list) return;

    const rap = _rapCache;
    const keys = Object.keys(rap);

    if (!keys.length) {
        list.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">No RAP data yet. Prices are recorded when items are purchased.</div>';
        return;
    }

    list.innerHTML = '';

    // Sort: xp first, then cards by name
    keys.sort((a, b) => {
        if (a === 'xp') return -1;
        if (b === 'xp') return 1;
        return a.localeCompare(b);
    });

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'font-size:0.75em;color:#7f8c8d;text-transform:uppercase;letter-spacing:0.5px;padding:0 0.3em 0.5em;display:flex;justify-content:space-between;';
    header.innerHTML = '<span>Item</span><span>RAP (💎 per unit)</span>';
    list.appendChild(header);

    keys.forEach(key => {
        const rapVal = rap[key];
        if (rapVal == null) return;

        // Parse key
        let label = '', imgEl = null;
        if (key === 'xp') {
            label = 'XP';
            const span = document.createElement('span');
            span.style.cssText = 'font-size:1.6em;line-height:1;flex-shrink:0;';
            span.textContent = '⭐';
            imgEl = span;
        } else {
            // card:Name or card:Name:Type
            const parts = key.split(':');
            const baseName = parts[1] || key;
            const cardType = parts[2] || '';
            label = cardType ? baseName + ' (' + cardType + ')' : baseName;
            const item = items.find(i => i.name === baseName);
            if (item) {
                const img = document.createElement('img');
                img.src = getCardImageSrc(item);
                img.style.cssText = 'width:48px;height:32px;object-fit:cover;border-radius:5px;flex-shrink:0;';
                img.onerror = function() { this.style.display='none'; };
                imgEl = img;
            }
        }

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.8em;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:0.65em 0.9em;';

        if (imgEl) row.appendChild(imgEl);

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';
        info.innerHTML = '<div style="font-weight:bold;color:#fff;font-size:0.95em;">' + label + '</div>'
            + '<div style="font-size:0.75em;color:#7f8c8d;margin-top:0.1em;">' + key + '</div>';
        row.appendChild(info);

        const rapNum = document.createElement('div');
        rapNum.style.cssText = 'text-align:right;flex-shrink:0;';
        rapNum.innerHTML = '<div style="font-weight:bold;color:#a29bfe;font-size:1.05em;">\uD83D\uDC8E ' + _fmtPrice(rapVal) + '</div>'
            + '<div style="font-size:0.72em;color:#555;">per unit</div>';
        row.appendChild(rapNum);

        list.appendChild(row);
    });
}

// ── Modify listing: cancel it then open sell menu pre-filled ──
async function modifyListing(listing) {
    // Cancel the listing (refunds cards/xp)
    await cancelListing(listing.id, listing.cardName, listing.cardType || '', listing.amount, listing.itemCategory || 'card');
    // Close market, open sell menu
    closeMarketMenu();
    openSellMenu();

    const isXpListing = listing.itemCategory === 'xp';
    setTimeout(() => {
        if (isXpListing) {
            // Switch to XP mode and pre-fill amount
            setSellItemType('xp');
            const xpInput = document.getElementById('sell-xp-input');
            if (xpInput) { xpInput.value = listing.amount; xpInput.dispatchEvent(new Event('input')); }
        } else {
            // Pre-fill card and amount
            const type = listing.cardType || '';
            const fullName = type ? listing.cardName + ' (' + type + ')' : listing.cardName;
            _selectSellCard(listing.cardName, type, fullName);
            _sellQty = listing.amount;
            document.querySelectorAll('.sell-qty-btn').forEach(b => b.classList.remove('active'));
            _updateSellSummary();
        }
    }, 100);
}

async function buyListing(listing, btn) {
    const { id, cardName, cardType, amount, priceTotal, sellerUid, itemCategory } = listing;
    const isFree   = priceTotal === 0;
    const isXpItem = itemCategory === 'xp';
    if (!isFree && diamonds < priceTotal) { showCraftMessage('Not enough diamonds!', 'error'); return; }
    if (btn) { btn.disabled = true; btn.textContent = '\u2026'; }

    try {
        const deleteListing = window._fbDeleteListing;
        if (!deleteListing) throw new Error('Firebase not ready');
        await deleteListing(id);

        if (!isFree) {
            diamonds = parseFloat((diamonds - priceTotal).toFixed(2));
            updateDiamondsDisplay();
            // Send reward to seller
            const addReward = window._fbAddPendingReward;
            if (addReward && sellerUid) {
                const itemLabel = isXpItem
                    ? 'Sold ' + amount + ' XP'
                    : 'Sold ' + (amount > 1 ? amount + '\u00D7 ' : '') + (cardType ? cardName + ' (' + cardType + ')' : cardName);
                try { await addReward(sellerUid, priceTotal, 'market_sale', itemLabel); }
                catch(rewardErr) { console.warn('Reward failed:', rewardErr.message || rewardErr); }
            }
            // Update RAP — fires on actual purchase, not on listing
            const updateRap = window._fbUpdateRap;
            if (updateRap) {
                const rapKey = isXpItem
                    ? 'xp'
                    : (cardType ? 'card:' + cardName + ':' + cardType : 'card:' + cardName);
                const pricePerUnit = amount > 0 ? parseFloat((priceTotal / amount).toFixed(2)) : priceTotal;
                try {
                    const newRap = await updateRap(rapKey, pricePerUnit);
                    if (newRap != null) _rapCache[rapKey] = newRap;
                } catch(_) {}
            }
        }

        if (isXpItem) {
            xp += amount;
            updateLevelXpDisplay();
        } else {
            const key = cardType ? cardName + ' (' + cardType + ')' : cardName;
            collection[key] = (collection[key] || 0) + amount;
            updateCollection(); updateInventoryStats();
        }
        saveCollection();

        const what = isXpItem ? amount + ' XP' : ('\u00D7' + amount + ' ' + (cardType ? cardName + ' (' + cardType + ')' : cardName));
        const cost = isFree ? 'for free' : 'for \uD83D\uDC8E' + _fmtPrice(priceTotal);
        showCraftMessage('Bought ' + what + ' ' + cost + '!', 'success');
        _marketListings = _marketListings.filter(l => l.id !== id);
        _renderMarketListings();
    } catch(e) {
        showCraftMessage('Purchase failed: ' + (e.message || e), 'error');
        if (btn) { btn.disabled = false; btn.textContent = isFree ? '\uD83C\uDD93 Get' : '\uD83D\uDC8E Buy'; }
    }
}

async function cancelListing(id, cardName, cardType, amount, itemCategory) {
    try {
        const deleteListing = window._fbDeleteListing;
        if (!deleteListing) throw new Error('Firebase not ready');
        await deleteListing(id);

        if (itemCategory === 'xp') {
            xp += amount;
            updateLevelXpDisplay();
        } else {
            const key = cardType ? cardName + ' (' + cardType + ')' : cardName;
            collection[key] = (collection[key] || 0) + amount;
            updateCollection(); updateInventoryStats();
        }
        saveCollection();
        showCraftMessage('Listing cancelled \u2014 refunded.', 'info');
        _marketListings = _marketListings.filter(l => l.id !== id);
        _renderMarketListings();
    } catch(e) {
        showCraftMessage('Cancel failed: ' + (e.message || e), 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// REWARDS PANEL
// ═══════════════════════════════════════════════════════════════

async function openRewardsPanel() {
    document.getElementById('rewards-panel').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    await refreshRewards();
}

function closeRewardsPanel() {
    document.getElementById('rewards-panel').style.display = 'none';
    document.body.style.overflow = '';
}

async function refreshRewards() {
    const user = window._currentUser;
    if (!user) return;
    const get = window._fbGetPendingRewards;
    if (!get) return;

    const refreshBtn = document.getElementById('refresh-rewards-btn');
    if (refreshBtn) { refreshBtn.textContent = '↻ …'; refreshBtn.disabled = true; }

    try {
        const result = await get(user.uid);
        _renderRewardsList(result.docs || []);
        const totalDiamonds = result.diamonds || 0;
        _updateRewardsBadge(totalDiamonds);
    } catch(e) {
        showCraftMessage('Failed to load rewards: ' + (e.message || e), 'error');
    } finally {
        if (refreshBtn) { refreshBtn.textContent = '↻ Refresh'; refreshBtn.disabled = false; }
    }
}

function _rewardLabel(doc) {
    switch(doc.from) {
        case 'market_sale':      return '\uD83C\uDFF7\uFE0F Sale';
        case 'level_up':         return '\u2b06\ufe0f ' + (doc.label || 'Level up');
        case 'order_fill':       return '\uD83D\uDCE6 ' + (doc.label || 'Order filled');
        case 'order_received':   return '\uD83D\uDCE5 ' + (doc.label || 'Order received');
        case 'order_cancelled':  return '\u274C ' + (doc.label || 'Order cancelled');
        default:                 return '\uD83C\uDF81 ' + (doc.from || 'Reward');
    }
}

function _renderRewardsList(docs) {
    const list  = document.getElementById('rewards-list');
    const empty = document.getElementById('rewards-empty');
    if (!list) return;
    list.innerHTML = '';

    if (!docs.length) {
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    docs.forEach(doc => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.8em;background:rgba(243,156,18,0.08);border:1.5px solid rgba(243,156,18,0.2);border-radius:12px;padding:0.7em 0.9em;';

        // Icon based on type
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size:1.6em;flex-shrink:0;';
        if (doc.type === 'card') icon.textContent = '\uD83C\uDFA4';
        else if (doc.type === 'xp') icon.textContent = '\u2B50';
        else icon.textContent = '\uD83D\uDC8E';

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';

        let amountStr = '';
        if (doc.type === 'diamonds') amountStr = _fmtPrice(doc.amount) + ' \uD83D\uDC8E';
        else if (doc.type === 'xp')  amountStr = doc.amount + ' XP';
        else if (doc.type === 'card') {
            const cardKey = doc.cardType ? doc.cardName + ' (' + doc.cardType + ')' : doc.cardName;
            amountStr = doc.amount + '\u00D7 ' + cardKey;
        }

        info.innerHTML = '<div style="font-weight:bold;color:#f39c12;font-size:0.95em;">' + _rewardLabel(doc) + '</div>'
            + '<div style="font-size:0.8em;color:#7f8c8d;margin-top:0.1em;">' + amountStr + '</div>';

        const btn = document.createElement('button');
        btn.style.cssText = 'padding:0.5em 1em;border:none;border-radius:8px;background:linear-gradient(90deg,#f39c12,#e67e22);color:#fff;font-weight:bold;cursor:pointer;font-size:0.88em;white-space:nowrap;flex-shrink:0;';
        btn.textContent = 'Claim';
        btn.onclick = async () => {
            btn.disabled = true; btn.textContent = '\u2026';
            const claimOne = window._fbClaimOneReward;
            if (!claimOne) return;
            try {
                await claimOne(window._currentUser.uid, doc.id);
                // Apply reward locally
                if (doc.type === 'diamonds') {
                    diamonds += doc.amount;
                    updateDiamondsDisplay();
                } else if (doc.type === 'xp') {
                    gainXp(doc.amount);
                } else if (doc.type === 'card') {
                    const cardKey = doc.cardType ? doc.cardName + ' (' + doc.cardType + ')' : doc.cardName;
                    collection[cardKey] = (collection[cardKey] || 0) + doc.amount;
                    updateCollection(); updateInventoryStats();
                }
                saveCollection();
                showCraftMessage('+' + amountStr + ' claimed!', 'success');
                await refreshRewards();
            } catch(e) {
                showCraftMessage('Claim failed: ' + (e.message || e), 'error');
                btn.disabled = false; btn.textContent = 'Claim';
            }
        };

        row.appendChild(icon);
        row.appendChild(info);
        row.appendChild(btn);
        list.appendChild(row);
    });
}

function _updateRewardsBadge(amount) {
    const badge = document.getElementById('rewards-badge');
    if (!badge) return;
    if (amount > 0) {
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.textContent = amount > 999 ? '!' : amount;
    } else {
        badge.style.display = 'none';
    }
}

// claimRewards (all-at-once) kept for badge/total but UI now uses per-item
async function claimAllRewards() {
    const user = window._currentUser;
    if (!user) return;
    const get = window._fbGetPendingRewards;
    const claimOne = window._fbClaimOneReward;
    if (!get || !claimOne) return;
    try {
        const result = await get(user.uid);
        const docs = result.docs || [];
        if (!docs.length) return;
        await Promise.all(docs.map(d => claimOne(user.uid, d.id)));
        const gained = result.diamonds || 0;
        if (gained > 0) {
            diamonds += gained;
            updateDiamondsDisplay();
            saveCollection();
            showCraftMessage('Claimed \uD83D\uDC8E' + _fmtPrice(gained) + '!', 'success');
        }
        await refreshRewards();
    } catch(e) {
        showCraftMessage('Claim all failed: ' + (e.message || e), 'error');
    }
}

function startRewardsPoll() {
    refreshRewards();
    setInterval(refreshRewards, 60 * 1000);
}

// ═══════════════════════════════════════════════════════════════
// ORDERS SYSTEM
// ═══════════════════════════════════════════════════════════════

let _ordersCurrentTab = 'all';
let _ordersAll        = [];
let _currentFillOrder = null;
let _orderItemType    = 'card';
let _orderSelectedCard = null; // { baseName, type, fullName }

// ── Open / close ──────────────────────────────────────────────

function openOrdersPanel() {
    document.getElementById('orders-panel').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const s = document.getElementById('orders-search');
    if (s) s.value = '';
    refreshOrders();
}
function closeOrdersPanel() {
    document.getElementById('orders-panel').style.display = 'none';
    document.body.style.overflow = '';
}
function openCreateOrderPanel() {
    _resetCreateOrderForm();
    document.getElementById('create-order-panel').style.display = 'flex';
    _initOrderCardSearch();
}
function closeCreateOrderPanel() {
    document.getElementById('create-order-panel').style.display = 'none';
}
function closeFillOrderPanel() {
    document.getElementById('fill-order-panel').style.display = 'none';
    _currentFillOrder = null;
}

// ── Tabs ──────────────────────────────────────────────────────

function setOrdersTab(tab) {
    _ordersCurrentTab = tab;
    ['all','mine'].forEach(t => {
        const el = document.getElementById('orders-tab-' + t);
        if (!el) return;
        el.style.color = t === tab ? '#4ecdc4' : '#7f8c8d';
        el.style.borderBottomColor = t === tab ? '#4ecdc4' : 'transparent';
    });
    _renderOrdersList();
}

// ── Refresh ───────────────────────────────────────────────────

async function refreshOrders() {
    const listEl = document.getElementById('orders-list');
    if (listEl) listEl.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">Loading\u2026</div>';
    try {
        const fn = window._fbFetchOrders;
        if (!fn) throw new Error('Firebase not ready');
        _ordersAll = await fn();
        _renderOrdersList();
    } catch(e) {
        if (listEl) listEl.innerHTML = '<div style="color:#e74c3c;text-align:center;padding:2em;">Failed: ' + (e.message || e) + '</div>';
    }
}

// ── Render list ───────────────────────────────────────────────

function _renderOrdersList() {
    const listEl = document.getElementById('orders-list');
    if (!listEl) return;
    const myUid  = window._currentUser?.uid;
    const q = (document.getElementById('orders-search')?.value || '').toLowerCase().trim();

    let toShow = _ordersCurrentTab === 'mine'
        ? _ordersAll.filter(o => o.buyerUid === myUid)
        : _ordersAll;

    // Apply search filter
    if (q) {
        toShow = toShow.filter(o => {
            const name  = (o.cardName || '').toLowerCase();
            const type  = (o.cardType || '').toLowerCase();
            const buyer = (o.buyerName || '').toLowerCase();
            return name.includes(q) || type.includes(q) || buyer.includes(q);
        });
    }

    if (!toShow.length) {
        listEl.innerHTML = '<div style="text-align:center;color:#7f8c8d;padding:3em;font-style:italic;">'
            + (q ? 'No orders match "' + q + '".'
                : _ordersCurrentTab === 'mine' ? 'You have no open orders.' : 'No orders yet. Be the first!')
            + '</div>';
        return;
    }

    listEl.innerHTML = '';
    const isXpOrder = o => o.itemCategory === 'xp';
    toShow.forEach(order => {
        const isOwn      = order.buyerUid === myUid;
        const isXp       = isXpOrder(order);
        const item       = !isXp ? items.find(i => i.name === order.cardName) : null;
        const remaining  = order.amountWanted - order.amountFilled;
        const pct        = Math.round((order.amountFilled / order.amountWanted) * 100);
        const totalReward = parseFloat((remaining * order.rewardEach).toFixed(2));

        // Card to display
        const fullName = isXp
            ? 'XP'
            : (order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName);

        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(255,255,255,0.05);border:1.5px solid rgba(78,205,196,0.2);border-radius:14px;padding:0.9em 1em;display:flex;flex-direction:column;gap:0.55em;';
        if (isOwn) card.style.borderColor = 'rgba(78,205,196,0.5)';

        // Header row
        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display:flex;align-items:center;gap:0.8em;';

        if (isXp) {
            const icon = document.createElement('span');
            icon.style.cssText = 'font-size:1.8em;flex-shrink:0;line-height:1;';
            icon.textContent = '\u2B50';
            headerRow.appendChild(icon);
        } else if (item) {
            const img = document.createElement('img');
            img.src = getCardImageSrc(item);
            img.style.cssText = 'width:54px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;';
            img.onerror = function(){ this.style.display='none'; };
            headerRow.appendChild(img);
        }

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';
        info.innerHTML = '<div style="font-weight:bold;color:#fff;font-size:1em;">' + fullName + '</div>'
            + '<div style="font-size:0.8em;color:#7f8c8d;margin-top:0.1em;">'
            + 'Wants <b style="color:#4ecdc4;">' + order.amountWanted + '</b>'
            + ' \u00B7 <b style="color:#a29bfe;">\uD83D\uDC8E' + _fmtPrice(order.rewardEach) + '</b> each'
            + ' \u00B7 by ' + (order.buyerName || 'Unknown')
            + '</div>';

        // Luck row for card orders
        if (!isXp && item) {
            const multMap = { '': 1, 'Gold': 10, 'Rainbow': 100, 'Shiny': 1000, 'Nuclear': 10000 };
            const rarity = item.chance * (multMap[order.cardType || ''] || 1);
            const luckRow = document.createElement('div');
            luckRow.style.cssText = 'font-size:0.75em;margin-top:0.2em;';
            luckRow.innerHTML = getRarityTag(rarity) + ' <span style="color:#555;">1 in ' + rarity.toLocaleString() + '</span>';
            info.appendChild(luckRow);
        }

        headerRow.appendChild(info);

        // Progress bar
        const progWrap = document.createElement('div');
        progWrap.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:999px;height:6px;overflow:hidden;margin:0.1em 0;';
        const progBar = document.createElement('div');
        progBar.style.cssText = 'height:100%;border-radius:999px;background:linear-gradient(90deg,#4ecdc4,#2ecc71);width:' + pct + '%;transition:width 0.4s;';
        progWrap.appendChild(progBar);

        const fillRow = document.createElement('div');
        fillRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:0.8em;color:#7f8c8d;';
        fillRow.innerHTML = '<span>' + order.amountFilled + ' / ' + order.amountWanted + ' filled (' + pct + '%)</span>'
            + '<span style="color:#a29bfe;">\uD83D\uDC8E' + _fmtPrice(totalReward) + ' remaining</span>';

        // Buttons
        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:0.5em;margin-top:0.3em;';

        if (isOwn) {
            const cancelBtn = document.createElement('button');
            cancelBtn.style.cssText = 'padding:0.45em 1em;border-radius:8px;border:1px solid rgba(231,76,60,0.4);background:rgba(231,76,60,0.12);color:#e74c3c;font-weight:bold;cursor:pointer;font-size:0.88em;';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => _cancelOrder(order);
            btnRow.appendChild(cancelBtn);
        } else {
            const fillBtn = document.createElement('button');
            fillBtn.style.cssText = 'flex:1;padding:0.5em 1em;border-radius:8px;border:none;background:linear-gradient(90deg,#27ae60,#2ecc71);color:#fff;font-weight:bold;cursor:pointer;font-size:0.9em;';
            fillBtn.textContent = '\uD83D\uDCE6 Fill';
            fillBtn.onclick = () => _openFillOrder(order);
            btnRow.appendChild(fillBtn);
        }

        card.appendChild(headerRow);
        card.appendChild(progWrap);
        card.appendChild(fillRow);
        card.appendChild(btnRow);
        listEl.appendChild(card);
    });
}

// ── Cancel order ──────────────────────────────────────────────

async function _cancelOrder(order) {
    const fn = window._fbCancelOrder;
    if (!fn) return;
    try {
        const result = await fn(order.id, window._currentUser.uid);
        if (result.refund > 0) {
            showCraftMessage('Order cancelled \u2014 \uD83D\uDC8E' + _fmtPrice(result.refund) + ' refund queued in Rewards', 'info');
            if (typeof refreshRewards === 'function') refreshRewards();
        } else {
            showCraftMessage('Order cancelled.', 'info');
        }
        await refreshOrders();
    } catch(e) {
        showCraftMessage('Cancel failed: ' + (e.message || e), 'error');
    }
}

// ── Fill order ────────────────────────────────────────────────

function _openFillOrder(order) {
    _currentFillOrder = order;
    const isXp = order.itemCategory === 'xp';

    const infoEl = document.getElementById('fill-order-info');
    const hintEl = document.getElementById('fill-owned-hint');
    const amtInput = document.getElementById('fill-amount-input');
    const summaryEl = document.getElementById('fill-summary');
    const msgEl = document.getElementById('fill-msg');

    // Info block
    const fullName = isXp
        ? 'XP'
        : (order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName);
    const remaining = order.amountWanted - order.amountFilled;
    infoEl.innerHTML = '<div style="font-weight:bold;color:#2ecc71;font-size:1.05em;">' + fullName + '</div>'
        + '<div style="font-size:0.85em;color:#bdc3c7;margin-top:0.3em;">'
        + 'Needs <b style="color:#4ecdc4;">' + remaining + '</b> more'
        + ' \u00B7 earn <b style="color:#a29bfe;">\uD83D\uDC8E' + _fmtPrice(order.rewardEach) + '</b> each'
        + '</div>';

    // Owned hint
    if (isXp) {
        hintEl.textContent = 'You have: ' + xp + ' XP';
    } else {
        const key = order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName;
        const owned = collection[key] || 0;
        hintEl.innerHTML = 'You own: <b style="color:#4ecdc4;">' + owned + '</b> ' + fullName
            + (owned <= 0 ? ' <span style="color:#e74c3c;">(none!)</span>' : '');
    }

    amtInput.value = '';
    summaryEl.style.display = 'none';
    if (msgEl) msgEl.style.display = 'none';

    // Live summary on input
    amtInput.oninput = () => {
        const amt = parseInt(amtInput.value) || 0;
        if (amt <= 0) { summaryEl.style.display = 'none'; return; }
        const actualFill = Math.min(amt, remaining);
        const earn = parseFloat((actualFill * order.rewardEach).toFixed(2));
        summaryEl.style.display = 'block';
        summaryEl.innerHTML = 'Give <b style="color:#4ecdc4;">' + actualFill + '</b> ' + fullName
            + ' → earn <b style="color:#a29bfe;">\uD83D\uDC8E' + _fmtPrice(earn) + '</b>';
        if (amt > remaining) {
            summaryEl.innerHTML += ' <span style="color:#f39c12;">(capped at ' + remaining + ')</span>';
        }
    };

    document.getElementById('fill-order-panel').style.display = 'flex';
}

async function submitFillOrder() {
    const order = _currentFillOrder;
    if (!order) return;
    const isXp = order.itemCategory === 'xp';
    const amtInput = document.getElementById('fill-amount-input');
    const btn = document.getElementById('fill-submit-btn');
    const msgEl = document.getElementById('fill-msg');

    const requestedAmt = parseInt(amtInput.value) || 0;
    if (requestedAmt <= 0) {
        _showFillMsg('Enter a valid amount.', 'error'); return;
    }

    const remaining = order.amountWanted - order.amountFilled;
    const fillAmt = Math.min(requestedAmt, remaining);

    // Check stock
    if (isXp) {
        if (xp < fillAmt) { _showFillMsg('Not enough XP (you have ' + xp + ').', 'error'); return; }
    } else {
        const key = order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName;
        const owned = collection[key] || 0;
        if (owned < fillAmt) { _showFillMsg('Not enough ' + order.cardName + ' (you have ' + owned + ').', 'error'); return; }
    }

    btn.disabled = true; btn.textContent = 'Filling\u2026';

    // Deduct locally
    if (isXp) {
        xp = Math.max(0, xp - fillAmt);
        updateLevelXpDisplay();
    } else {
        const key = order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName;
        collection[key] -= fillAmt;
        if ((collection[key] || 0) <= 0) delete collection[key];
        updateCollection(); updateInventoryStats();
    }
    saveCollection();

    try {
        const fn = window._fbFillOrder;
        if (!fn) throw new Error('Firebase not ready');
        const result = await fn(order.id, {
            fillerUid:  window._currentUser.uid,
            fillerName: window._cloudUserData?.username || 'Unknown',
            amount:     fillAmt,
        });

        _showFillMsg('Filled! \uD83D\uDC8E' + _fmtPrice(result.earned) + ' added to Rewards', 'success');
        if (typeof refreshRewards === 'function') refreshRewards();
        btn.textContent = 'Fill Order';
        btn.disabled = false;
        amtInput.value = '';
        // Update local order cache
        const idx = _ordersAll.findIndex(o => o.id === order.id);
        if (idx >= 0) {
            _ordersAll[idx].amountFilled = order.amountFilled + fillAmt;
            _ordersAll[idx].status = result.newStatus;
            if (result.newStatus !== 'open') _ordersAll.splice(idx, 1);
        }
        setTimeout(() => {
            closeFillOrderPanel();
            _renderOrdersList();
        }, 1500);
    } catch(e) {
        // Refund locally on error
        if (isXp) { xp += fillAmt; updateLevelXpDisplay(); }
        else {
            const key = order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName;
            collection[key] = (collection[key] || 0) + fillAmt;
            updateCollection();
        }
        saveCollection();
        _showFillMsg('Failed: ' + (e.message || e), 'error');
        btn.disabled = false; btn.textContent = 'Fill Order';
    }
}

function _showFillMsg(text, type) {
    const el = document.getElementById('fill-msg');
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
    el.style.background = type === 'error' ? 'rgba(231,76,60,0.18)' : 'rgba(39,174,96,0.18)';
    el.style.color      = type === 'error' ? '#e74c3c'              : '#2ecc71';
    el.style.border     = '1px solid ' + (type === 'error' ? 'rgba(231,76,60,0.4)' : 'rgba(39,174,96,0.4)');
}

// ── Create order form ─────────────────────────────────────────

function setOrderItemType(type) {
    _orderItemType = type;
    document.getElementById('order-type-card').classList.toggle('active', type === 'card');
    document.getElementById('order-type-xp').classList.toggle('active',   type === 'xp');
    document.getElementById('order-card-section').style.display = type === 'card' ? '' : 'none';
    _orderSelectedCard = null;
    document.getElementById('order-selected-card').style.display = 'none';
    document.getElementById('order-card-search').value = '';
    _updateOrderSummary();
}

function clearOrderCard() {
    _orderSelectedCard = null;
    document.getElementById('order-selected-card').style.display = 'none';
    document.getElementById('order-card-search').value = '';
    _updateOrderSummary();
}

function _initOrderCardSearch() {
    const input = document.getElementById('order-card-search');
    const dd    = document.getElementById('order-card-dropdown');
    if (!input || !dd) return;
    input.oninput = () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { dd.style.display = 'none'; return; }
        const matches = items.filter(i => i.rollable && i.name.toLowerCase().includes(q));
        if (!matches.length) { dd.style.display = 'none'; return; }
        dd.innerHTML = '';
        matches.slice(0, 20).forEach(item => {
            // Show all variants
            const variants = ['', 'Gold', 'Rainbow', 'Shiny', 'Nuclear'];
            variants.forEach(vtype => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:0.7em;padding:0.5em 0.8em;cursor:pointer;';
                row.onmouseenter = () => row.style.background = 'rgba(78,205,196,0.12)';
                row.onmouseleave = () => row.style.background = '';
                const img = document.createElement('img');
                img.src = getCardImageSrc(item);
                img.style.cssText = 'width:36px;height:24px;object-fit:cover;border-radius:4px;';
                const label = document.createElement('span');
                label.style.cssText = 'color:#fff;font-size:0.95em;';
                label.textContent = vtype ? item.name + ' (' + vtype + ')' : item.name;
                const rarity = document.createElement('span');
                rarity.style.cssText = 'margin-left:auto;font-size:0.75em;color:#7f8c8d;';
                const chance = item.chance * ({ '': 1, 'Gold': 10, 'Rainbow': 100, 'Shiny': 1000, 'Nuclear': 10000 }[vtype] || 1);
                rarity.textContent = '1 in ' + chance.toLocaleString();
                row.appendChild(img); row.appendChild(label); row.appendChild(rarity);
                row.onclick = () => {
                    _orderSelectedCard = { baseName: item.name, type: vtype, fullName: vtype ? item.name + ' (' + vtype + ')' : item.name };
                    document.getElementById('order-card-img').src = getCardImageSrc(item);
                    document.getElementById('order-card-name').textContent = _orderSelectedCard.fullName;
                    document.getElementById('order-selected-card').style.display = 'flex';
                    input.value = '';
                    dd.style.display = 'none';
                    _updateOrderSummary();
                };
                dd.appendChild(row);
            });
        });
        dd.style.display = 'block';
    };
    setTimeout(() => {
        document.addEventListener('click', function _closeDD(e) {
            const wrap = document.getElementById('order-card-search-wrap');
            if (wrap && !wrap.contains(e.target)) { dd.style.display = 'none'; document.removeEventListener('click', _closeDD); }
        });
    }, 0);
}

function _updateOrderSummary() {
    const summary = document.getElementById('order-summary');
    const summaryText = document.getElementById('order-summary-text');
    const warning = document.getElementById('order-balance-warning');
    const postBtn = document.getElementById('order-post-btn');
    if (!summary) return;

    const isXp  = _orderItemType === 'xp';
    const amt   = parseInt(document.getElementById('order-amount-input')?.value) || 0;
    const rward = parseFloat(document.getElementById('order-reward-input')?.value) || 0;

    if (amt <= 0 || rward < 0 || (!isXp && !_orderSelectedCard)) {
        summary.style.display = 'none'; return;
    }

    const total = parseFloat((amt * rward).toFixed(2));
    const canAfford = diamonds >= total;
    const itemName = isXp ? amt + ' XP' : amt + '\u00D7 ' + _orderSelectedCard.fullName;

    summaryText.innerHTML = 'Order <b style="color:#4ecdc4;">' + itemName + '</b>'
        + ' for <b style="color:#a29bfe;">\uD83D\uDC8E' + _fmtPrice(rward) + '</b> each'
        + '<br>Total locked: <b style="color:#f39c12;">\uD83D\uDC8E' + _fmtPrice(total) + '</b>';

    if (warning) {
        if (!canAfford) {
            warning.style.display = 'block';
            warning.textContent = 'Not enough diamonds (you have \uD83D\uDC8E' + _fmtPrice(diamonds) + ')';
        } else {
            warning.style.display = 'none';
        }
    }
    if (postBtn) postBtn.disabled = !canAfford;
    summary.style.display = 'flex';
}

function _resetCreateOrderForm() {
    _orderItemType = 'card';
    _orderSelectedCard = null;
    const tc = document.getElementById('order-type-card'), tx = document.getElementById('order-type-xp');
    if (tc) tc.classList.add('active');
    if (tx) tx.classList.remove('active');
    const cs = document.getElementById('order-card-section');
    if (cs) cs.style.display = '';
    const selCard = document.getElementById('order-selected-card');
    if (selCard) selCard.style.display = 'none';
    const amtInput = document.getElementById('order-amount-input');
    if (amtInput) amtInput.value = '';
    const rwdInput = document.getElementById('order-reward-input');
    if (rwdInput) rwdInput.value = '';
    const summary = document.getElementById('order-summary');
    if (summary) summary.style.display = 'none';
    const msgEl = document.getElementById('order-msg');
    if (msgEl) msgEl.style.display = 'none';
    const search = document.getElementById('order-card-search');
    if (search) search.value = '';
}

async function submitOrder() {
    const isXp = _orderItemType === 'xp';
    const amt   = parseInt(document.getElementById('order-amount-input')?.value) || 0;
    const rward = parseFloat(document.getElementById('order-reward-input')?.value) || 0;

    if (amt <= 0 || rward < 0) { _showOrderMsg('Enter valid amount and reward.', 'error'); return; }
    if (!isXp && !_orderSelectedCard) { _showOrderMsg('Select a card.', 'error'); return; }

    const total = parseFloat((amt * rward).toFixed(2));
    if (diamonds < total) { _showOrderMsg('Not enough diamonds!', 'error'); return; }

    const btn = document.getElementById('order-post-btn');
    btn.disabled = true; btn.textContent = 'Posting\u2026';

    // Lock diamonds upfront
    diamonds = parseFloat((diamonds - total).toFixed(2));
    updateDiamondsDisplay();
    saveCollection();

    try {
        const fn = window._fbPostOrder;
        if (!fn) throw new Error('Firebase not ready');
        await fn({
            buyerUid:     window._currentUser.uid,
            buyerName:    window._cloudUserData?.username || 'Unknown',
            cardName:     isXp ? 'XP' : _orderSelectedCard.baseName,
            cardType:     isXp ? '' : _orderSelectedCard.type,
            itemCategory: isXp ? 'xp' : 'card',
            amountWanted: amt,
            rewardEach:   rward,
        });
        _showOrderMsg('Order posted!', 'success');
        _resetCreateOrderForm();
        btn.textContent = 'Post Order';
        setTimeout(() => {
            closeCreateOrderPanel();
            refreshOrders();
        }, 1200);
    } catch(e) {
        // Refund on failure
        diamonds = parseFloat((diamonds + total).toFixed(2));
        updateDiamondsDisplay();
        saveCollection();
        _showOrderMsg('Failed: ' + (e.message || e), 'error');
        btn.disabled = false; btn.textContent = 'Post Order';
    }
}

function _showOrderMsg(text, type) {
    const el = document.getElementById('order-msg');
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
    el.style.background = type === 'error' ? 'rgba(231,76,60,0.18)' : 'rgba(39,174,96,0.18)';
    el.style.color      = type === 'error' ? '#e74c3c' : '#2ecc71';
    el.style.border     = '1px solid ' + (type === 'error' ? 'rgba(231,76,60,0.4)' : 'rgba(39,174,96,0.4)');
}

// ── Wire create-order form live updates ───────────────────────
(function() {
    document.addEventListener('input', e => {
        if (e.target.id === 'order-amount-input' || e.target.id === 'order-reward-input') {
            _updateOrderSummary();
        }
    });
})();
