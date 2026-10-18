const math = {
    min: Math.min,
    max: Math.max,
    floor: Math.floor,
    sqrt: Math.sqrt,
    pow: Math.pow,
    random: function(min, max) {
        if (min === undefined && max === undefined) {
            return Math.random()
        }
        if (min === 0 && max === 1) {
            return Math.random()
        }
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
}

const table = {
    insert: function(list, value) {
        list.push(value)
    },
}

function pairs(list) {
    return Object.entries(list)
}

let PlayerData = {
    tokens: coreValues.tokens.starting,
    diamonds: coreValues.diamonds.starting,
    level: coreValues.level.starting,
    xp: 0,
    totalRolls: 0,
    isCooldown: false,
    autoRollEnabled: false,
    activeView: "cards",
    inventoryTab: "cards",
    activePressId: "diamondPress",
    pressPercent: (coreValues.presses && coreValues.presses.defaultPercentage) || 100,
    pressKeepOne: Boolean(coreValues.presses && coreValues.presses.defaultKeepOne),
    sortBy: "default",
    lastRolledCard: null,
    lastRolledCards: [],
    inventory: {},
    maxRollerSlots: (coreValues.rollers && coreValues.rollers.startingSlots) || 1,
    equippedRollers: [],
    itemsInventory: [],
    nextItemInstanceId: 1,
    upgrades: {
        luck: 0,
        tokenRate: 0,
        tokenCapacity: 0,
        xpMultiplier: 0,
        rollSpeed: 0,
        pressRevenue: 0,
    },
    settings: {
        theme: "dark",
        particles: true,
        bouncy: true,
        sfx: true,
    },
}

let ModalState = {
    isOpen: false,
    currentIndex: 0,
    isAnimating: false,
}

let TagModalState = {
    isOpen: false,
    currentTagId: null,
}

let audioCtx = null

const SAVE_STORAGE_KEY = "cards_game_save_v1"

function GetRollerDefinition(itemId) {
    let targetId = itemId || (coreValues.rollers && coreValues.rollers.startingRollerId) || "basicRoller"
    if (typeof RollersList !== "undefined" && Array.isArray(RollersList)) {
        for (let [i, r] of pairs(RollersList)) {
            if (r && r.id === targetId) return r
        }
    }
    if (typeof ItemsList !== "undefined" && Array.isArray(ItemsList)) {
        for (let [i, item] of pairs(ItemsList)) {
            if (item && item.id === targetId && item.type === "roller") return item
        }
    }
    return {
        id: "basicRoller",
        name: "Basic Roller",
        type: "roller",
        icon: "🎲",
        luckMultiplier: 1,
        maxCardsPerRoll: 1,
        rollDuration: 2,
        rollTime: 2,
        rollCost: 1,
        description: "Standard roller with ×1 luck that rolls up to 1 randomly selected card from the roll list.",
    }
}

function GetRollerBaseDuration(rollerOrId) {
    let itemId = (rollerOrId && typeof rollerOrId === "object") ? rollerOrId.itemId || rollerOrId.id : rollerOrId
    let rollerDef = GetRollerDefinition(itemId)
    if (rollerDef && typeof rollerDef.rollDuration === "number" && rollerDef.rollDuration > 0) {
        return rollerDef.rollDuration
    }
    if (rollerDef && typeof rollerDef.rollTime === "number" && rollerDef.rollTime > 0) {
        return rollerDef.rollTime
    }
    if (coreValues.roll && typeof coreValues.roll.cooldown === "number" && coreValues.roll.cooldown > 0) {
        return coreValues.roll.cooldown
    }
    return 2
}

function GetRollerCost(rollerOrId) {
    let itemId = (rollerOrId && typeof rollerOrId === "object") ? rollerOrId.itemId || rollerOrId.id : rollerOrId
    let rollerDef = GetRollerDefinition(itemId)
    if (rollerDef && typeof rollerDef.rollCost === "number" && rollerDef.rollCost >= 0) {
        return rollerDef.rollCost
    }
    return (coreValues.roll && typeof coreValues.roll.cost === "number") ? coreValues.roll.cost : 1
}

const RollerCooldownState = {}

function GetItemDefinition(itemId) {
    if (typeof ItemsList !== "undefined" && Array.isArray(ItemsList)) {
        for (let [i, item] of pairs(ItemsList)) {
            if (item && item.id === itemId) return item
        }
    }
    if (typeof RollersList !== "undefined" && Array.isArray(RollersList)) {
        for (let [i, r] of pairs(RollersList)) {
            if (r && r.id === itemId) return r
        }
    }
    return null
}

function AllocateItemInstanceId() {
    let id = "item_" + PlayerData.nextItemInstanceId
    PlayerData.nextItemInstanceId += 1
    return id
}

function CreateItemInstance(itemId, options) {
    let def = GetItemDefinition(itemId)
    if (!def) return null
    let opts = options && typeof options === "object" ? options : {}
    let instId = opts.instanceId ? String(opts.instanceId) : AllocateItemInstanceId()
    let numericSuffix = Number(instId.replace(/^item_/, ""))
    if (!isNaN(numericSuffix) && numericSuffix >= PlayerData.nextItemInstanceId) {
        PlayerData.nextItemInstanceId = math.floor(numericSuffix) + 1
    }

    if (def.type === "roller") {
        let hasAuto = Boolean(opts.hasAutoroller)
        return {
            instanceId: instId,
            itemId: def.id,
            type: "roller",
            hasAutoroller: hasAuto,
            autoEnabled: hasAuto ? (opts.autoEnabled !== undefined ? Boolean(opts.autoEnabled) : true) : false,
        }
    }

    return {
        instanceId: instId,
        itemId: def.id,
        type: def.type || "attachment",
    }
}

function EnsureRollerSlotsNormalized() {
    let minSlots = (coreValues.rollers && coreValues.rollers.startingSlots) || 1
    let maxAllowed = (coreValues.rollers && coreValues.rollers.maxSlots) || 8
    let targetSlots = math.max(minSlots, math.min(maxAllowed, math.floor(Number(PlayerData.maxRollerSlots) || minSlots)))
    PlayerData.maxRollerSlots = targetSlots

    if (!Array.isArray(PlayerData.equippedRollers)) {
        PlayerData.equippedRollers = []
    }
    while (PlayerData.equippedRollers.length < targetSlots) {
        table.insert(PlayerData.equippedRollers, null)
    }
    if (PlayerData.equippedRollers.length > targetSlots) {
        let overflow = PlayerData.equippedRollers.splice(targetSlots)
        for (let [i, extraRoller] of pairs(overflow)) {
            if (extraRoller) {
                table.insert(PlayerData.itemsInventory, extraRoller)
            }
        }
    }
}

function InitializeDefaultRollerSystem() {
    let startingSlots = (coreValues.rollers && coreValues.rollers.startingSlots) || 1
    PlayerData.maxRollerSlots = startingSlots
    PlayerData.equippedRollers = []
    for (let i = 0; i < startingSlots; i++) {
        table.insert(PlayerData.equippedRollers, null)
    }
    PlayerData.itemsInventory = []
    PlayerData.nextItemInstanceId = 1

    let startItems = (coreValues.rollers && Array.isArray(coreValues.rollers.startingItems))
        ? coreValues.rollers.startingItems
        : [{ itemId: "basicRoller", count: 1 }]

    for (let [i, entry] of pairs(startItems)) {
        let qty = math.max(1, math.floor(Number(entry.count) || 1))
        for (let k = 0; k < qty; k++) {
            let inst = CreateItemInstance(entry.itemId)
            if (inst) {
                table.insert(PlayerData.itemsInventory, inst)
            }
        }
    }
    PlayerData.autoRollEnabled = false
}

InitializeDefaultRollerSystem()

function GetEquippedRollers() {
    EnsureRollerSlotsNormalized()
    let equipped = []
    for (let [i, slotItem] of pairs(PlayerData.equippedRollers)) {
        if (slotItem && slotItem.type === "roller") {
            table.insert(equipped, slotItem)
        }
    }
    return equipped
}

function HasAutomatedEquippedRoller() {
    let equipped = GetEquippedRollers()
    for (let [i, roller] of pairs(equipped)) {
        if (roller.hasAutoroller) return true
    }
    return false
}

function HasActiveAutomatedRoller() {
    let equipped = GetEquippedRollers()
    for (let [i, roller] of pairs(equipped)) {
        if (roller.hasAutoroller && roller.autoEnabled) return true
    }
    return false
}

function SyncAutoRollStateFromRollers() {
    PlayerData.autoRollEnabled = HasActiveAutomatedRoller()
}

function GetUpgradeLevel(upgradeId) {
    if (!PlayerData.upgrades || typeof PlayerData.upgrades[upgradeId] !== "number") {
        return 0
    }
    return math.max(0, math.floor(PlayerData.upgrades[upgradeId]))
}

function GetUpgradeCompoundRate(upgradeId) {
    if (upgradeId && typeof ShopUpgradesList !== "undefined") {
        for (let [i, upg] of pairs(ShopUpgradesList)) {
            if (upg.id === upgradeId && typeof upg.compoundRate === "number") {
                return upg.compoundRate
            }
        }
    }
    return (coreValues.shop && coreValues.shop.compoundRate) || 0.2
}

function GetCompoundFactor(level, upgradeId) {
    let lvl = level !== undefined ? level : 0
    let rate = GetUpgradeCompoundRate(upgradeId)
    return math.pow(1 + rate, lvl)
}

function GetUpgradePrice(level) {
    let lvl = level !== undefined ? level : 0
    return math.pow(coreValues.shop.basePrice, math.pow(coreValues.shop.pricePower, lvl))
}

function GetEffectiveLuck(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("luck")
    return coreValues.luck * GetCompoundFactor(lvl, "luck")
}

function GetEffectiveTokenRatePerSec(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("tokenRate")
    let baseRatePerSec = 1 / coreValues.tokens.drop.rate
    return baseRatePerSec * GetCompoundFactor(lvl, "tokenRate")
}

function GetEffectiveTokenDropRate(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("tokenRate")
    return coreValues.tokens.drop.rate / GetCompoundFactor(lvl, "tokenRate")
}

function GetEffectiveTokenCapacity(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("tokenCapacity")
    return coreValues.tokens.capacity * GetCompoundFactor(lvl, "tokenCapacity")
}

function GetEffectiveXpMultiplier(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("xpMultiplier")
    let startMult = coreValues.level.startingCardXpMultiplier !== undefined ? coreValues.level.startingCardXpMultiplier : 1
    return startMult * GetCompoundFactor(lvl, "xpMultiplier")
}

function GetEffectiveRollSpeedMultiplier(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("rollSpeed")
    return GetCompoundFactor(lvl, "rollSpeed")
}

function GetEffectiveRollerDuration(rollerOrId, level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("rollSpeed")
    let baseDuration = GetRollerBaseDuration(rollerOrId)
    return baseDuration / GetEffectiveRollSpeedMultiplier(lvl)
}

function GetEffectiveRollCooldown(level, rollerOrId) {
    return GetEffectiveRollerDuration(rollerOrId, level)
}

function GetEffectivePressRevenueMultiplier(level) {
    let lvl = level !== undefined ? level : GetUpgradeLevel("pressRevenue")
    let startMult = coreValues.diamonds.startingPressRevenueMultiplier !== undefined ? coreValues.diamonds.startingPressRevenueMultiplier : 1
    return startMult * GetCompoundFactor(lvl, "pressRevenue")
}

function GenerateCardMutations(baseCards, mutations) {
    let fullList = []

    for (let [i, cardData] of pairs(baseCards)) {
        let baseIdx = Number(i)
        let rarityValue = cardData.rarity !== undefined ? cardData.rarity : cardData.Rarity
        let isVoidCard = cardData.name === "Void" || rarityValue <= 0
        let effectiveBaseRarity = isVoidCard ? 0 : rarityValue
        let baseTags = Array.isArray(cardData.tags) ? cardData.tags.slice() : undefined
        let baseEffects = Array.isArray(cardData.effects) ? cardData.effects.slice() : undefined

        let baseCard = {
            name: cardData.name,
            rarity: effectiveBaseRarity,
            image: cardData.image,
            tags: baseTags,
            effects: baseEffects,
            baseName: cardData.name,
            baseRarity: effectiveBaseRarity,
            baseIndex: baseIdx,
            mutationIndex: 0,
            defaultIndex: fullList.length,
        }
        table.insert(fullList, baseCard)

        if (isVoidCard) {
            continue
        }

        for (let [j, mutationData] of pairs(mutations)) {
            table.insert(fullList, {
                name: baseCard.name + "-" + mutationData.name,
                rarity: baseCard.rarity * mutationData.multiplier,
                image: baseCard.image,
                tags: baseTags ? baseTags.slice() : undefined,
                effects: baseEffects ? baseEffects.slice() : undefined,
                baseName: baseCard.name,
                baseRarity: effectiveBaseRarity,
                baseIndex: baseIdx,
                mutationIndex: Number(j) + 1,
                defaultIndex: fullList.length,
            })
        }
    }

    return fullList
}

function SaveGame() {
    try {
        let serializedInventory = {}
        for (let [cardName, entry] of pairs(PlayerData.inventory)) {
            if (entry && entry.count > 0) {
                serializedInventory[cardName] = {
                    count: entry.count,
                    firstObtained: entry.firstObtained instanceof Date
                        ? entry.firstObtained.toISOString()
                        : entry.firstObtained,
                }
            }
        }

        let rolledNames = Array.isArray(PlayerData.lastRolledCards) && PlayerData.lastRolledCards.length > 0
            ? PlayerData.lastRolledCards.map(function(c) { return c.name })
            : (PlayerData.lastRolledCard ? [PlayerData.lastRolledCard.name] : [])

        EnsureRollerSlotsNormalized()

        let payload = {
            tokens: PlayerData.tokens,
            diamonds: PlayerData.diamonds,
            level: PlayerData.level,
            xp: PlayerData.xp,
            totalRolls: PlayerData.totalRolls,
            autoRollEnabled: PlayerData.autoRollEnabled,
            inventoryTab: PlayerData.inventoryTab,
            activePressId: PlayerData.activePressId,
            pressPercent: PlayerData.pressPercent,
            pressKeepOne: PlayerData.pressKeepOne,
            sortBy: PlayerData.sortBy,
            lastRolledCardName: PlayerData.lastRolledCard ? PlayerData.lastRolledCard.name : null,
            lastRolledCardNames: rolledNames,
            inventory: serializedInventory,
            maxRollerSlots: PlayerData.maxRollerSlots,
            equippedRollers: PlayerData.equippedRollers,
            itemsInventory: PlayerData.itemsInventory,
            nextItemInstanceId: PlayerData.nextItemInstanceId,
            upgrades: PlayerData.upgrades,
            settings: PlayerData.settings,
        }

        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
        // Ignore storage quota or private mode errors
    }
}

function LoadGame() {
    try {
        let raw = localStorage.getItem(SAVE_STORAGE_KEY)
        if (!raw) return

        let saved = JSON.parse(raw)
        if (!saved || typeof saved !== "object") return

        let cardsByName = {}
        for (let [i, cardData] of pairs(CardsList)) {
            cardsByName[cardData.name] = cardData
        }

        if (saved.upgrades && typeof saved.upgrades === "object") {
            for (let [i, upg] of pairs(ShopUpgradesList)) {
                let savedLvl = saved.upgrades[upg.id]
                if (typeof savedLvl === "number" && !isNaN(savedLvl) && savedLvl >= 0) {
                    PlayerData.upgrades[upg.id] = math.floor(savedLvl)
                }
            }
        }

        if (typeof saved.tokens === "number" && !isNaN(saved.tokens)) {
            PlayerData.tokens = math.max(0, math.min(GetEffectiveTokenCapacity(), saved.tokens))
        }
        if (typeof saved.diamonds === "number" && !isNaN(saved.diamonds)) {
            PlayerData.diamonds = math.max(0, saved.diamonds)
        }
        if (typeof saved.level === "number" && saved.level >= 1) {
            PlayerData.level = math.floor(saved.level)
        }
        if (typeof saved.xp === "number" && !isNaN(saved.xp)) {
            PlayerData.xp = math.max(0, saved.xp)
        }
        if (typeof saved.totalRolls === "number" && !isNaN(saved.totalRolls)) {
            PlayerData.totalRolls = math.max(0, math.floor(saved.totalRolls))
        }
        if (saved.inventoryTab === "cards" || saved.inventoryTab === "items") {
            PlayerData.inventoryTab = saved.inventoryTab
        }
        if (typeof saved.activePressId === "string") {
            PlayerData.activePressId = saved.activePressId
        }
        if (typeof saved.pressPercent === "number" && coreValues.presses && coreValues.presses.percentages.includes(saved.pressPercent)) {
            PlayerData.pressPercent = saved.pressPercent
        }
        if (typeof saved.pressKeepOne === "boolean") {
            PlayerData.pressKeepOne = saved.pressKeepOne
        }
        if (typeof saved.sortBy === "string") {
            PlayerData.sortBy = saved.sortBy
        }

        if (saved.settings && typeof saved.settings === "object") {
            if (saved.settings.theme === "light" || saved.settings.theme === "dark") {
                PlayerData.settings.theme = saved.settings.theme
            }
            if (typeof saved.settings.particles === "boolean") {
                PlayerData.settings.particles = saved.settings.particles
            }
            if (typeof saved.settings.bouncy === "boolean") {
                PlayerData.settings.bouncy = saved.settings.bouncy
            }
            if (typeof saved.settings.sfx === "boolean") {
                PlayerData.settings.sfx = saved.settings.sfx
            }
        }

        PlayerData.inventory = {}
        if (saved.inventory && typeof saved.inventory === "object") {
            for (let [cardName, savedEntry] of pairs(saved.inventory)) {
                let cardData = cardsByName[cardName]
                if (!cardData) continue

                let count = Number(savedEntry.count) || 0
                if (count <= 0) continue

                let parsedDate = savedEntry.firstObtained ? new Date(savedEntry.firstObtained) : new Date()
                if (isNaN(parsedDate.getTime())) {
                    parsedDate = new Date()
                }

                PlayerData.inventory[cardName] = {
                    cardData: cardData,
                    count: count,
                    firstObtained: parsedDate,
                }
            }
        }

        if (Array.isArray(saved.equippedRollers) || Array.isArray(saved.itemsInventory)) {
            let startingSlots = (coreValues.rollers && coreValues.rollers.startingSlots) || 1
            if (typeof saved.maxRollerSlots === "number" && saved.maxRollerSlots >= startingSlots) {
                PlayerData.maxRollerSlots = math.floor(saved.maxRollerSlots)
            } else {
                PlayerData.maxRollerSlots = startingSlots
            }

            if (typeof saved.nextItemInstanceId === "number" && saved.nextItemInstanceId >= 1) {
                PlayerData.nextItemInstanceId = math.floor(saved.nextItemInstanceId)
            }

            PlayerData.equippedRollers = []
            if (Array.isArray(saved.equippedRollers)) {
                for (let i = 0; i < PlayerData.maxRollerSlots; i++) {
                    let rawSlot = saved.equippedRollers[i]
                    if (rawSlot && typeof rawSlot === "object" && rawSlot.itemId) {
                        let inst = CreateItemInstance(rawSlot.itemId, rawSlot)
                        table.insert(PlayerData.equippedRollers, inst && inst.type === "roller" ? inst : null)
                    } else {
                        table.insert(PlayerData.equippedRollers, null)
                    }
                }
            }

            PlayerData.itemsInventory = []
            if (Array.isArray(saved.itemsInventory)) {
                for (let [i, rawItem] of pairs(saved.itemsInventory)) {
                    if (rawItem && typeof rawItem === "object" && rawItem.itemId) {
                        let inst = CreateItemInstance(rawItem.itemId, rawItem)
                        if (inst) {
                            table.insert(PlayerData.itemsInventory, inst)
                        }
                    }
                }
            }

            EnsureRollerSlotsNormalized()

            let totalOwnedRollers = GetEquippedRollers().length
            for (let [i, it] of pairs(PlayerData.itemsInventory)) {
                if (it && it.type === "roller") {
                    totalOwnedRollers += 1
                }
            }
            if (totalOwnedRollers <= 0) {
                let freeBasic = CreateItemInstance((coreValues.rollers && coreValues.rollers.startingRollerId) || "basicRoller")
                if (freeBasic) {
                    table.insert(PlayerData.itemsInventory, freeBasic)
                }
            }
        } else {
            InitializeDefaultRollerSystem()
        }

        SyncAutoRollStateFromRollers()

        PlayerData.lastRolledCards = []
        if (Array.isArray(saved.lastRolledCardNames) && saved.lastRolledCardNames.length > 0) {
            for (let [i, cName] of pairs(saved.lastRolledCardNames)) {
                if (cardsByName[cName]) {
                    table.insert(PlayerData.lastRolledCards, cardsByName[cName])
                }
            }
        } else if (saved.lastRolledCardName && cardsByName[saved.lastRolledCardName]) {
            PlayerData.lastRolledCards = [cardsByName[saved.lastRolledCardName]]
        }

        if (PlayerData.lastRolledCards.length > 0) {
            PlayerData.lastRolledCard = GetRarest(PlayerData.lastRolledCards)
        }
    } catch (e) {
        // Ignore malformed save data
    }
}

function ApplySettings() {
    let theme = PlayerData.settings.theme === "light" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", theme)
    document.body.classList.toggle("no-bouncy", !PlayerData.settings.bouncy)

    let quickIcon = document.getElementById("quick-theme-icon")
    if (quickIcon) {
        quickIcon.textContent = theme === "light" ? "☀️" : "🌙"
    }

    let darkBtn = document.getElementById("theme-dark-btn")
    let lightBtn = document.getElementById("theme-light-btn")
    if (darkBtn && lightBtn) {
        darkBtn.classList.toggle("active", theme === "dark")
        lightBtn.classList.toggle("active", theme === "light")
    }

    let particlesToggle = document.getElementById("setting-particles")
    let bouncyToggle = document.getElementById("setting-bouncy")
    let sfxToggle = document.getElementById("setting-sfx")

    if (particlesToggle) particlesToggle.checked = Boolean(PlayerData.settings.particles)
    if (bouncyToggle) bouncyToggle.checked = Boolean(PlayerData.settings.bouncy)
    if (sfxToggle) sfxToggle.checked = Boolean(PlayerData.settings.sfx)
}

function SetTheme(themeName) {
    PlayerData.settings.theme = themeName === "light" ? "light" : "dark"
    ApplySettings()
    SaveGame()
    PlayGameSound("pop")
}

function ToggleTheme() {
    SetTheme(PlayerData.settings.theme === "light" ? "dark" : "light")
}

function PlayGameSound(kind) {
    if (!PlayerData.settings.sfx) return
    try {
        let AudioContextClass = window.AudioContext || window.webkitAudioContext
        if (!AudioContextClass) return
        if (!audioCtx) {
            audioCtx = new AudioContextClass()
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume()
        }

        let now = audioCtx.currentTime
        let osc = audioCtx.createOscillator()
        let gain = audioCtx.createGain()
        osc.connect(gain)
        gain.connect(audioCtx.destination)

        if (kind === "rare") {
            osc.type = "triangle"
            osc.frequency.setValueAtTime(440, now)
            osc.frequency.exponentialRampToValueAtTime(660, now + 0.09)
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.22)
            gain.gain.setValueAtTime(0.12, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)
            osc.start(now)
            osc.stop(now + 0.33)
        } else if (kind === "diamond") {
            osc.type = "sine"
            osc.frequency.setValueAtTime(587.33, now)
            osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.16)
            gain.gain.setValueAtTime(0.11, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
            osc.start(now)
            osc.stop(now + 0.21)
        } else if (kind === "levelup") {
            osc.type = "triangle"
            osc.frequency.setValueAtTime(392, now)
            osc.frequency.setValueAtTime(523.25, now + 0.08)
            osc.frequency.setValueAtTime(659.25, now + 0.16)
            osc.frequency.setValueAtTime(783.99, now + 0.24)
            gain.gain.setValueAtTime(0.13, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42)
            osc.start(now)
            osc.stop(now + 0.43)
        } else {
            osc.type = "sine"
            osc.frequency.setValueAtTime(320, now)
            osc.frequency.exponentialRampToValueAtTime(540, now + 0.11)
            gain.gain.setValueAtTime(0.1, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
            osc.start(now)
            osc.stop(now + 0.15)
        }
    } catch (e) {
        // Ignore audio errors
    }
}

function SpawnParticleBurst(targetEl, preset) {
    if (!PlayerData.settings.particles || !targetEl) return
    let fxLayer = document.getElementById("fx-layer")
    if (!fxLayer) return

    let rect = targetEl.getBoundingClientRect()
    let centerX = rect.left + rect.width / 2
    let centerY = rect.top + rect.height / 2

    let symbols = ["✦", "★", "✨", "🎉", "⚡"]
    let colors = ["#818cf8", "#ec4899", "#fbbf24", "#38bdf8", "#34d399"]
    let count = 12

    if (preset === "diamond") {
        symbols = ["💎", "✦", "✨", "★"]
        colors = ["#38bdf8", "#7dd3fc", "#e0f2fe", "#818cf8"]
        count = 14
    } else if (preset === "rare") {
        symbols = ["👑", "✨", "🌟", "🎉", "🔥", "💎"]
        colors = ["#fbbf24", "#ec4899", "#38bdf8", "#a855f7", "#4ade80"]
        count = 22
    }

    for (let i = 0; i < count; i++) {
        let p = document.createElement("span")
        p.className = "fx-particle"
        p.textContent = symbols[i % symbols.length]
        p.style.color = colors[i % colors.length]
        p.style.left = centerX + "px"
        p.style.top = centerY + "px"

        let angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45
        let dist = 55 + Math.random() * 110
        let tx = Math.cos(angle) * dist
        let ty = Math.sin(angle) * dist - 20
        let rot = Math.round((Math.random() - 0.5) * 320) + "deg"
        let sc = (0.85 + Math.random() * 0.65).toFixed(2)

        p.style.setProperty("--tx", tx + "px")
        p.style.setProperty("--ty", ty + "px")
        p.style.setProperty("--rot", rot)
        p.style.setProperty("--sc", sc)

        fxLayer.appendChild(p)
        setTimeout(function() {
            if (p.parentNode) p.parentNode.removeChild(p)
        }, 920)
    }
}

function BumpPill(pillId) {
    let pill = document.getElementById(pillId)
    if (!pill) return
    pill.classList.remove("pill-bump")
    void pill.offsetWidth
    pill.classList.add("pill-bump")
}

function GetCardMutation(cardData) {
    for (let [i, mutationData] of pairs(MutationsList)) {
        let suffix = "-" + mutationData.name
        if (cardData.name.endsWith(suffix)) {
            return {
                name: mutationData.name,
                multiplier: mutationData.multiplier,
                icon: mutationData.icon || "✨",
                background: mutationData.background,
                textColor: mutationData.textColor,
                borderColor: mutationData.borderColor,
                glowColor: mutationData.glowColor,
                animated: Boolean(mutationData.animated),
                cssClass: "mutation-" + mutationData.name.toLowerCase(),
            }
        }
    }
    return {
        name: "None",
        multiplier: 1,
        icon: "",
        cssClass: "mutation-none",
    }
}

function GetCardRarityTier(rarity) {
    let numericRarity = Number(rarity) || 0
    if (numericRarity < 1) return null

    for (let [i, tierData] of pairs(RarityTiersList)) {
        let idx = Number(i)
        let minR = tierData.minRarity !== undefined ? tierData.minRarity : 1
        let maxR = tierData.maxRarity !== undefined ? tierData.maxRarity : Infinity
        let nextTier = RarityTiersList[idx + 1]
        let upperBound = nextTier && nextTier.minRarity !== undefined ? nextTier.minRarity : Infinity
        if (numericRarity >= minR && (numericRarity <= maxR || numericRarity < upperBound)) {
            return tierData
        }
    }

    return RarityTiersList[RarityTiersList.length - 1] || null
}

function FindTagPreset(presetKey) {
    if (!presetKey || typeof CardTagConfig === "undefined" || !CardTagConfig.presets) {
        return null
    }
    if (CardTagConfig.presets[presetKey]) {
        return CardTagConfig.presets[presetKey]
    }
    let normalized = String(presetKey).trim().toLowerCase()
    for (let [key, presetData] of pairs(CardTagConfig.presets)) {
        if (!presetData) continue
        if (
            key.toLowerCase() === normalized ||
            (presetData.id && presetData.id.toLowerCase() === normalized) ||
            (presetData.name && presetData.name.toLowerCase() === normalized) ||
            ("tag-" + key.toLowerCase()) === normalized
        ) {
            return presetData
        }
    }
    return null
}

function CreateCardTag(tagOptions) {
    let preset = FindTagPreset(tagOptions.presetId || tagOptions.id || tagOptions.name) || {}
    let typeKey = tagOptions.type || preset.type || "custom"
    let typeConfig = (typeof CardTagConfig !== "undefined" && CardTagConfig.types && CardTagConfig.types[typeKey]) || {}
    let defaultStyle = typeConfig.defaultStyle || {}
    let resolvedName = preset.name || tagOptions.name || "Tag"

    return {
        id: tagOptions.id || preset.id || (typeKey + "-" + resolvedName.toLowerCase().replace(/\s+/g, "-")),
        type: typeKey,
        name: resolvedName,
        description: tagOptions.description || preset.description || "",
        icon: tagOptions.icon !== undefined ? tagOptions.icon : (preset.icon !== undefined ? preset.icon : (defaultStyle.icon || "")),
        suffix: tagOptions.suffix !== undefined ? tagOptions.suffix : (preset.suffix || ""),
        showOnFront: tagOptions.showOnFront !== undefined
            ? Boolean(tagOptions.showOnFront)
            : (preset.showOnFront !== undefined ? Boolean(preset.showOnFront) : Boolean(typeConfig.showOnFront)),
        showOnBack: tagOptions.showOnBack !== undefined
            ? Boolean(tagOptions.showOnBack)
            : (preset.showOnBack !== undefined ? Boolean(preset.showOnBack) : (typeConfig.showOnBack !== undefined ? Boolean(typeConfig.showOnBack) : true)),
        priority: tagOptions.priority !== undefined
            ? tagOptions.priority
            : (preset.priority !== undefined ? preset.priority : (typeConfig.priority !== undefined ? typeConfig.priority : 50)),
        background: tagOptions.background || preset.background || defaultStyle.background || "linear-gradient(135deg, #475569 0%, #334155 100%)",
        textColor: tagOptions.textColor || preset.textColor || defaultStyle.textColor || "#ffffff",
        borderColor: tagOptions.borderColor || preset.borderColor || defaultStyle.borderColor || "rgba(255, 255, 255, 0.55)",
        glowColor: tagOptions.glowColor || preset.glowColor || defaultStyle.glowColor || "rgba(0, 0, 0, 0.25)",
        animated: tagOptions.animated !== undefined
            ? Boolean(tagOptions.animated)
            : Boolean(preset.animated || defaultStyle.animated),
        cssClass: tagOptions.cssClass || preset.cssClass || ("tag-type-" + typeKey),
    }
}

const CardTagResolvers = [
    function resolveRarityTierTag(cardData) {
        if (!cardData) return null
        let tier = GetCardRarityTier(cardData.rarity)
        if (!tier) return null
        return CreateCardTag({
            type: "rarityTier",
            id: "tier-" + tier.id,
            name: tier.name,
            description: "Rarity Tier (" + (tier.rangeLabel || "") + ")",
            icon: tier.icon,
            background: tier.background,
            textColor: tier.textColor,
            borderColor: tier.borderColor,
            glowColor: tier.glowColor,
            animated: tier.animated,
            cssClass: "tag-tier-" + tier.id,
        })
    },
    function resolveMutationTag(cardData) {
        if (!cardData) return null
        let mutation = GetCardMutation(cardData)
        if (!mutation || mutation.name === "None") return null
        return CreateCardTag({
            type: "mutation",
            id: "mutation-" + mutation.name.toLowerCase(),
            name: mutation.name,
            icon: mutation.icon,
            suffix: mutation.multiplier + "×",
            background: mutation.background,
            textColor: mutation.textColor,
            borderColor: mutation.borderColor,
            glowColor: mutation.glowColor,
            animated: mutation.animated,
            cssClass: "tag-mutation-" + mutation.name.toLowerCase(),
        })
    },
    function resolveCustomAndEffectTags(cardData) {
        if (!cardData) return null
        let customTags = []

        if (Array.isArray(cardData.effects)) {
            for (let [i, effectEntry] of pairs(cardData.effects)) {
                if (typeof effectEntry === "string") {
                    table.insert(customTags, CreateCardTag({
                        type: "effect",
                        presetId: effectEntry,
                        name: effectEntry,
                    }))
                } else if (effectEntry && typeof effectEntry === "object") {
                    table.insert(customTags, CreateCardTag(Object.assign({ type: "effect" }, effectEntry)))
                }
            }
        }

        if (Array.isArray(cardData.tags)) {
            for (let [i, tagEntry] of pairs(cardData.tags)) {
                if (typeof tagEntry === "string") {
                    let preset = FindTagPreset(tagEntry)
                    table.insert(customTags, CreateCardTag({
                        type: (preset && preset.type) || "custom",
                        presetId: tagEntry,
                        name: (preset && preset.name) || tagEntry,
                    }))
                } else if (tagEntry && typeof tagEntry === "object") {
                    table.insert(customTags, CreateCardTag(Object.assign({ type: "custom" }, tagEntry)))
                }
            }
        }

        return customTags
    },
]

function RegisterCardTagResolver(resolverFn) {
    if (typeof resolverFn === "function") {
        table.insert(CardTagResolvers, resolverFn)
    }
}

function GetCardTags(cardData, surface) {
    if (!cardData) return []
    let targetSurface = surface || "all"
    let resolvedTags = []

    for (let [i, resolver] of pairs(CardTagResolvers)) {
        let result = resolver(cardData)
        if (!result) continue
        if (Array.isArray(result)) {
            for (let [j, tagObj] of pairs(result)) {
                if (tagObj) table.insert(resolvedTags, tagObj)
            }
        } else {
            table.insert(resolvedTags, result)
        }
    }

    resolvedTags.sort(function(a, b) {
        return (a.priority || 50) - (b.priority || 50)
    })

    if (targetSurface === "front") {
        return resolvedTags.filter(function(tag) {
            return tag.showOnFront && tag.type !== "rarityTier"
        })
    }

    if (targetSurface === "back") {
        return resolvedTags.filter(function(tag) {
            return tag.showOnBack
        })
    }

    return resolvedTags
}

function RenderCardTagBadgeHTML(tag) {
    if (!tag) return ""
    let isInteractive = tag.type !== "mutation"
    let classes = ["card-tag-pill"]
    if (tag.cssClass) classes.push(tag.cssClass)
    if (tag.animated) classes.push("card-tag-animated")
    if (isInteractive) classes.push("card-tag-interactive")

    let styleVars = [
        "--tag-bg: " + tag.background,
        "--tag-color: " + tag.textColor,
        "--tag-border: " + tag.borderColor,
        "--tag-glow: " + tag.glowColor,
    ].join("; ")

    let iconHtml = tag.icon ? `<span class="card-tag-icon">${tag.icon}</span>` : ""
    let suffixHtml = tag.suffix ? `<span class="card-tag-suffix">• ${tag.suffix}</span>` : ""
    let progressHtml = isInteractive ? `<span class="tag-hold-progress"></span>` : ""
    let titleAttr = isInteractive ? ` title="Hold to view ${tag.name} Tag Info"` : ""

    return `<span class="${classes.join(" ")}" data-tag-type="${tag.type}" data-tag-id="${tag.id}" data-tag-name="${tag.name}" style="${styleVars}"${titleAttr}>${iconHtml}<span class="card-tag-name">${tag.name}</span>${suffixHtml}${progressHtml}</span>`
}

function RenderCardTagsHTML(cardData, surface) {
    let targetSurface = surface || "back"
    let tags = GetCardTags(cardData, targetSurface)
    if (tags.length === 0) return ""

    let badgesHtml = ""
    for (let [i, tag] of pairs(tags)) {
        badgesHtml += RenderCardTagBadgeHTML(tag)
    }

    return `<div class="card-tags-list card-tags-${targetSurface}">${badgesHtml}</div>`
}

function RenderCardTagsInto(containerEl, cardData, surface) {
    if (!containerEl) return
    let html = RenderCardTagsHTML(cardData, surface)
    containerEl.innerHTML = html
    containerEl.classList.toggle("hidden", html === "")
}

function GetRarest(list) {
    let rarestCard
    for (let [i, cardData] of pairs(list)) {
        if (rarestCard) {
            if (cardData.rarity > rarestCard.rarity) {
                rarestCard = cardData
            }
        } else {
            rarestCard = cardData
        }
    }
    return rarestCard
}

function GetCommonest(list) {
    let commonestCard
    for (let [i, cardData] of pairs(list)) {
        if (commonestCard) {
            if (cardData.rarity < commonestCard.rarity) {
                commonestCard = cardData
            }
        } else {
            commonestCard = cardData
        }
    }
    return commonestCard
}

function GetCardByName(name, list) {
    let targetList = list || CardsList
    for (let [i, cardData] of pairs(targetList)) {
        if (cardData.name === name) return cardData
    }
    return null
}

function GetEffectiveCardRarity(cardOrRarity, luck, list) {
    let rawRarity = (cardOrRarity && typeof cardOrRarity === "object")
        ? Number(cardOrRarity.rarity)
        : Number(cardOrRarity)
    if (!rawRarity || rawRarity <= 0) return 0

    let effectiveLuck = luck !== undefined ? Number(luck) : GetEffectiveLuck()
    if (!effectiveLuck || effectiveLuck <= 0 || isNaN(effectiveLuck)) {
        effectiveLuck = 1
    }

    let targetList = Array.isArray(list) && list.length > 0
        ? list
        : (typeof CardsList !== "undefined" && Array.isArray(CardsList) ? CardsList : null)
    if (targetList && targetList.length > 0) {
        let rarestCard = GetRarest(targetList)
        if (rarestCard && rarestCard.rarity > 0) {
            effectiveLuck = math.min(effectiveLuck, rarestCard.rarity)
        }
    }

    let chance = rawRarity / effectiveLuck
    if (chance < 1) {
        chance = 1 / chance
    }

    return chance
}

function Roll(list, luck, maxCards) {
    let targetList = Array.isArray(list) && list.length > 0 ? list : CardsList
    let effectiveLuck = luck !== undefined ? Number(luck) : GetEffectiveLuck()
    if (!effectiveLuck || effectiveLuck <= 0 || isNaN(effectiveLuck)) {
        effectiveLuck = 1
    }

    let rarestCard = GetRarest(targetList)
    if (rarestCard && rarestCard.rarity > 0) {
        effectiveLuck = math.min(effectiveLuck, rarestCard.rarity)
    }

    let rolledCards = []

    for (let [i, cardData] of pairs(targetList)) {
        if (!cardData || cardData.name === "Void" || cardData.rarity <= 0) continue

        let chance = cardData.rarity
        chance /= effectiveLuck

        if (chance < 1) {
            chance = 1 / chance
        }

        if (math.random() * chance < 1) {
            table.insert(rolledCards, cardData)
        }
    }

    if (typeof maxCards === "number" && maxCards > 0 && rolledCards.length > maxCards) {
        let pool = rolledCards.slice()
        let selectedCards = []
        for (let k = 0; k < maxCards && pool.length > 0; k++) {
            let pickIndex = math.floor(math.random() * pool.length)
            table.insert(selectedCards, pool[pickIndex])
            pool.splice(pickIndex, 1)
        }
        rolledCards = selectedCards
    }

    if (rolledCards.length <= 0) {
        let voidCard = GetCardByName("Void", targetList)
        rolledCards = voidCard ? [voidCard] : [GetCommonest(targetList)]
    }

    return rolledCards
}

function RollWithEquippedRollers(list, isAutoRoll) {
    let targetList = Array.isArray(list) && list.length > 0 ? list : CardsList
    let equippedRollers = GetEquippedRollers()
    let activeRollers = []

    for (let [i, rollerInst] of pairs(equippedRollers)) {
        if (!rollerInst) continue
        if (isAutoRoll === true) {
            if (rollerInst.hasAutoroller && rollerInst.autoEnabled) {
                table.insert(activeRollers, rollerInst)
            }
        } else {
            table.insert(activeRollers, rollerInst)
        }
    }

    if (activeRollers.length <= 0) {
        return []
    }

    let combinedCards = []
    let basePlayerLuck = GetEffectiveLuck()

    for (let [i, rollerInst] of pairs(activeRollers)) {
        let rollerDef = GetRollerDefinition(rollerInst.itemId)
        let luckMult = (rollerDef && typeof rollerDef.luckMultiplier === "number" && rollerDef.luckMultiplier > 0)
            ? rollerDef.luckMultiplier
            : 1
        let maxCards = (rollerDef && typeof rollerDef.maxCardsPerRoll === "number" && rollerDef.maxCardsPerRoll > 0)
            ? rollerDef.maxCardsPerRoll
            : 1
        let effectiveRollerLuck = basePlayerLuck * luckMult
        let pull = Roll(targetList, effectiveRollerLuck, maxCards)
        if (Array.isArray(pull)) {
            for (let [j, c] of pairs(pull)) {
                if (c) table.insert(combinedCards, c)
            }
        } else if (pull) {
            table.insert(combinedCards, pull)
        }
    }

    return combinedCards
}

function GetCardSortMeta(cardData) {
    let mutation = GetCardMutation(cardData)
    let baseRarity = cardData.baseRarity
    if (baseRarity === undefined) {
        baseRarity = mutation.multiplier > 0 ? cardData.rarity / mutation.multiplier : cardData.rarity
    }

    let baseName = cardData.baseName
    if (baseName === undefined) {
        if (mutation.name !== "None") {
            baseName = cardData.name.slice(0, -(mutation.name.length + 1))
        } else {
            baseName = cardData.name
        }
    }

    let mutationIndex = cardData.mutationIndex
    if (mutationIndex === undefined) {
        mutationIndex = 0
        if (mutation.name !== "None") {
            for (let [i, m] of pairs(MutationsList)) {
                if (m.name === mutation.name) {
                    mutationIndex = Number(i) + 1
                    break
                }
            }
        }
    }

    let defaultIndex = cardData.defaultIndex !== undefined ? cardData.defaultIndex : 0
    let baseIndex = cardData.baseIndex !== undefined ? cardData.baseIndex : defaultIndex

    return {
        baseName: baseName,
        baseRarity: baseRarity,
        baseIndex: baseIndex,
        mutationIndex: mutationIndex,
        defaultIndex: defaultIndex,
    }
}

function SortCardsList(list, sortMode) {
    let mode = sortMode || "default"
    let copy = list.slice()

    copy.sort(function(a, b) {
        let metaA = GetCardSortMeta(a)
        let metaB = GetCardSortMeta(b)

        if (mode === "rarity-desc") {
            if (b.rarity !== a.rarity) {
                return b.rarity - a.rarity
            }
            return metaB.defaultIndex - metaA.defaultIndex
        }

        if (mode === "rarity-asc") {
            if (a.rarity !== b.rarity) {
                return a.rarity - b.rarity
            }
            return metaA.defaultIndex - metaB.defaultIndex
        }

        if (mode === "name-asc") {
            let cmp = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
            if (cmp !== 0) {
                return cmp
            }
            return metaA.defaultIndex - metaB.defaultIndex
        }

        if (mode === "base-rarity" || mode === "base-rarity-asc") {
            if (metaA.baseRarity !== metaB.baseRarity) {
                return metaA.baseRarity - metaB.baseRarity
            }
            if (metaA.baseName !== metaB.baseName) {
                return metaA.baseIndex - metaB.baseIndex
            }
            return metaA.mutationIndex - metaB.mutationIndex
        }

        if (mode === "base-rarity-desc") {
            if (metaB.baseRarity !== metaA.baseRarity) {
                return metaB.baseRarity - metaA.baseRarity
            }
            if (metaA.baseName !== metaB.baseName) {
                return metaB.baseIndex - metaA.baseIndex
            }
            return metaA.mutationIndex - metaB.mutationIndex
        }

        return metaA.defaultIndex - metaB.defaultIndex
    })

    return copy
}

function GetDiscoveredCards() {
    let ownedCardsData = []
    for (let [i, cardData] of pairs(CardsList)) {
        let entry = PlayerData.inventory[cardData.name]
        if (entry && entry.count > 0) {
            table.insert(ownedCardsData, cardData)
        }
    }
    return SortCardsList(ownedCardsData, PlayerData.sortBy)
}

function FormatNumber(value, decimals) {
    let places = decimals !== undefined ? decimals : 2
    let factor = math.pow(10, places)
    let rounded = Math.round(value * factor) / factor
    return rounded.toString()
}

const IMAGE_PATH_ALIASES = {
    "Assets/Cards/Sugar Cube.png": "Assets/Cards/AI/Sugar Cube.png",
    "Assets/Cards/Pasta.png": "Assets/Cards/AI/Pasta.png",
    "Assets/Cards/Lava.png": "Assets/Cards/AI/Lava.png",
    "Assets/Cards/Poke Balls.png": "Assets/Cards/Poke Ball.png",
    "Assets/Cards/Ice Spikes.png": "Assets/Cards/Ice Spikes.PNG",
}

function FormatImagePath(path) {
    if (!path) return ""
    let normalized = path.replace(/\\/g, "/")
    return IMAGE_PATH_ALIASES[normalized] || normalized
}

function FormatRarityText(rarity) {
    let displayRarity = rarity >= 0 ? rarity : 0
    return "1 in " + FormatNumber(displayRarity, 2)
}

function FormatDate(dateObj) {
    if (!dateObj) return "-"
    return dateObj.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
}

function GetRequiredXp(level) {
    return coreValues.level.baseXp * math.pow(coreValues.level.xpMultiplier, level - 1)
}

function GetCardXp(cardData) {
    if (!cardData || cardData.rarity <= 0) return 0
    let baseXp
    if (coreValues.level.cardXpExponent === 0.5) {
        baseXp = math.sqrt(cardData.rarity)
    } else {
        baseXp = math.pow(cardData.rarity, coreValues.level.cardXpExponent)
    }
    return baseXp * GetEffectiveXpMultiplier()
}

function GetRollBatchXp(rolledCards) {
    if (!Array.isArray(rolledCards)) {
        return rolledCards ? GetCardXp(rolledCards) : 0
    }
    let totalXp = 0
    for (let [i, cardData] of pairs(rolledCards)) {
        if (cardData && cardData.rarity > 0) {
            totalXp += GetCardXp(cardData)
        }
    }
    return totalXp
}

function GetDiamondPressValue(cardData) {
    if (!cardData || cardData.rarity <= 0) return 0
    let exponent = coreValues.diamonds.pressExponent
    for (let [i, pressData] of pairs(PressesList)) {
        if (pressData.id === "diamondPress" && pressData.rarityExponent !== undefined) {
            exponent = pressData.rarityExponent
            break
        }
    }
    return math.pow(cardData.rarity, exponent) * GetEffectivePressRevenueMultiplier()
}

function GetPressCardQuantity(ownedCount, percent, keepOne) {
    let count = math.max(0, math.floor(Number(ownedCount) || 0))
    let pct = percent !== undefined ? percent : (PlayerData.pressPercent || 100)
    let preserveOne = keepOne !== undefined ? Boolean(keepOne) : Boolean(PlayerData.pressKeepOne)

    let maxPressable = preserveOne ? math.max(0, count - 1) : count
    if (maxPressable <= 0) return 0
    if (pct >= 100) return maxPressable

    let calculated = math.floor(maxPressable * (pct / 100))
    return math.min(maxPressable, math.max(1, calculated))
}

function ShowPopup(elementId, text) {
    let popup = document.getElementById(elementId)
    if (!popup) return
    popup.textContent = text
    popup.classList.remove("active")
    void popup.offsetWidth
    popup.classList.add("active")
}

function AddDiamonds(amount) {
    if (amount <= 0) return
    PlayerData.diamonds += amount
    ShowPopup("diamond-popup", "+" + FormatNumber(amount))
    BumpPill("diamond-pill")
}

function AddXp(amount) {
    if (amount <= 0) return
    PlayerData.xp += amount

    let leveledUp = false
    let totalDiamondsGained = 0

    while (PlayerData.xp >= GetRequiredXp(PlayerData.level)) {
        PlayerData.xp -= GetRequiredXp(PlayerData.level)
        PlayerData.level += 1
        leveledUp = true
        totalDiamondsGained += coreValues.diamonds.perLevelMultiplier * PlayerData.level
    }

    if (leveledUp && totalDiamondsGained > 0) {
        AddDiamonds(totalDiamondsGained)
        PlayGameSound("levelup")
        SpawnParticleBurst(document.getElementById("level-badge"), "rare")
    }
}

function AddCardToInventory(cardData) {
    if (!cardData) return
    if (!PlayerData.inventory[cardData.name]) {
        PlayerData.inventory[cardData.name] = {
            cardData: cardData,
            count: 0,
            firstObtained: new Date(),
        }
    }
    PlayerData.inventory[cardData.name].count += 1
}

function SellCardInDiamondPress(cardData, quantity) {
    let entry = PlayerData.inventory[cardData.name]
    if (!entry || entry.count < quantity || quantity <= 0) return

    let diamondGain = GetDiamondPressValue(cardData) * quantity
    entry.count -= quantity
    AddDiamonds(diamondGain)
    PlayGameSound("diamond")
    SpawnParticleBurst(document.getElementById("diamond-pill"), "diamond")

    if (ModalState.isOpen) {
        let discovered = GetDiscoveredCards()
        if (discovered.length === 0) {
            CloseCardModal()
        } else {
            ModalState.currentIndex = math.min(ModalState.currentIndex, discovered.length - 1)
            PopulateModalCard(discovered[ModalState.currentIndex], ModalState.currentIndex, discovered.length)
        }
    }

    SaveGame()
    UpdateUI()
}

function PressAllEligibleCards(triggerEl) {
    let discovered = GetDiscoveredCards()
    if (discovered.length === 0) return

    let totalDiamondsGained = 0
    let totalCardsPressed = 0

    for (let [i, cardData] of pairs(discovered)) {
        let entry = PlayerData.inventory[cardData.name]
        if (!entry || entry.count <= 0) continue

        let qty = GetPressCardQuantity(entry.count, PlayerData.pressPercent, PlayerData.pressKeepOne)
        if (qty <= 0) continue

        let diamondValue = GetDiamondPressValue(cardData)
        totalDiamondsGained += diamondValue * qty
        totalCardsPressed += qty
        entry.count -= qty
    }

    if (totalCardsPressed <= 0) return

    AddDiamonds(totalDiamondsGained)
    PlayGameSound("diamond")
    SpawnParticleBurst(triggerEl || document.getElementById("diamond-pill"), "diamond")

    if (ModalState.isOpen) {
        let remainingDiscovered = GetDiscoveredCards()
        if (remainingDiscovered.length === 0) {
            CloseCardModal()
        } else {
            ModalState.currentIndex = math.min(ModalState.currentIndex, remainingDiscovered.length - 1)
            PopulateModalCard(remainingDiscovered[ModalState.currentIndex], ModalState.currentIndex, remainingDiscovered.length)
        }
    }

    SaveGame()
    UpdateUI()
}

function UpdateTokenGeneration(delta) {
    let effectiveDropRate = GetEffectiveTokenDropRate()
    let effectiveCapacity = GetEffectiveTokenCapacity()

    if (delta > math.random(0, 1) * effectiveDropRate) {
        if (PlayerData.tokens < effectiveCapacity) {
            let gainedTokens = math.random(
                coreValues.tokens.drop.ammount.min,
                coreValues.tokens.drop.ammount.max
            )
            let previousTokens = PlayerData.tokens
            PlayerData.tokens = math.min(effectiveCapacity, PlayerData.tokens + gainedTokens)
            let actualGained = PlayerData.tokens - previousTokens

            if (actualGained > 0) {
                ShowPopup("token-popup", "+" + FormatNumber(actualGained))
                BumpPill("token-pill")
                SaveGame()
                UpdateTopBarUI()
                if (PlayerData.activeView === "shop") {
                    RenderShop()
                }
            }
        }
    }
}

function StartRollCooldown() {
    PlayerData.isCooldown = true
    let effectiveCooldown = GetEffectiveRollCooldown()
    document.documentElement.style.setProperty("--roll-cooldown", effectiveCooldown + "s")

    let rollButton = document.getElementById("roll-button")
    rollButton.classList.remove("cooling-down")
    void rollButton.offsetWidth
    rollButton.classList.add("cooling-down")
    UpdateTopBarUI()

    setTimeout(function() {
        PlayerData.isCooldown = false
        rollButton.classList.remove("cooling-down")
        UpdateTopBarUI()
    }, effectiveCooldown * 1000)
}

function SetRollStatusMessage(message, isWarn) {
    let status = document.getElementById("roll-status")
    if (!status) return
    status.textContent = message
    status.classList.remove("warn")
    if (isWarn) {
        void status.offsetWidth
        status.classList.add("warn")
    }
}

function EquipRollerToSlot(instanceId, slotIndex) {
    EnsureRollerSlotsNormalized()
    let targetSlot = Number(slotIndex)
    if (isNaN(targetSlot) || targetSlot < 0 || targetSlot >= PlayerData.maxRollerSlots) {
        return false
    }

    let foundIndex = -1
    let itemInst = null
    for (let i = 0; i < PlayerData.itemsInventory.length; i++) {
        let candidate = PlayerData.itemsInventory[i]
        if (candidate && candidate.instanceId === instanceId) {
            foundIndex = i
            itemInst = candidate
            break
        }
    }

    if (foundIndex === -1 || !itemInst || itemInst.type !== "roller") {
        return false
    }

    PlayerData.itemsInventory.splice(foundIndex, 1)

    let previousEquipped = PlayerData.equippedRollers[targetSlot]
    if (previousEquipped) {
        table.insert(PlayerData.itemsInventory, previousEquipped)
    }

    PlayerData.equippedRollers[targetSlot] = itemInst
    SyncAutoRollStateFromRollers()

    let rollerDef = GetRollerDefinition(itemInst.itemId)
    PlayGameSound("pop")
    SetRollStatusMessage("⚙️ Equipped " + rollerDef.name + " in Slot #" + (targetSlot + 1) + "! Ready to roll.", false)
    SaveGame()
    UpdateUI()
    return true
}

function MoveOrSwapEquippedRoller(fromSlotIndex, toSlotIndex) {
    EnsureRollerSlotsNormalized()
    let fromIdx = Number(fromSlotIndex)
    let toIdx = Number(toSlotIndex)
    if (
        isNaN(fromIdx) || isNaN(toIdx) ||
        fromIdx < 0 || fromIdx >= PlayerData.maxRollerSlots ||
        toIdx < 0 || toIdx >= PlayerData.maxRollerSlots ||
        fromIdx === toIdx
    ) {
        return false
    }

    let fromRoller = PlayerData.equippedRollers[fromIdx]
    if (!fromRoller) return false

    let toRoller = PlayerData.equippedRollers[toIdx] || null
    PlayerData.equippedRollers[toIdx] = fromRoller
    PlayerData.equippedRollers[fromIdx] = toRoller
    SyncAutoRollStateFromRollers()

    PlayGameSound("pop")
    SaveGame()
    UpdateUI()
    return true
}

function UnequipRollerFromSlot(slotIndex) {
    EnsureRollerSlotsNormalized()
    let targetSlot = Number(slotIndex)
    if (isNaN(targetSlot) || targetSlot < 0 || targetSlot >= PlayerData.maxRollerSlots) {
        return false
    }

    let equippedRoller = PlayerData.equippedRollers[targetSlot]
    if (!equippedRoller) return false

    PlayerData.equippedRollers[targetSlot] = null
    table.insert(PlayerData.itemsInventory, equippedRoller)
    SyncAutoRollStateFromRollers()

    let rollerDef = GetRollerDefinition(equippedRoller.itemId)
    PlayGameSound("pop")
    SetRollStatusMessage("🎒 Unequipped " + rollerDef.name + " back to Items Inventory.", false)
    SaveGame()
    UpdateUI()
    return true
}

function AttachAutorollerToSlot(autorollerInstanceId, slotIndex, triggerEl) {
    EnsureRollerSlotsNormalized()
    let targetSlot = Number(slotIndex)
    if (isNaN(targetSlot) || targetSlot < 0 || targetSlot >= PlayerData.maxRollerSlots) {
        return false
    }

    let equippedRoller = PlayerData.equippedRollers[targetSlot]
    if (!equippedRoller || equippedRoller.type !== "roller") {
        SetRollStatusMessage("⚠️ Equip a roller in Slot #" + (targetSlot + 1) + " first before attaching an Autoroller!", true)
        return false
    }

    if (equippedRoller.hasAutoroller) {
        SetRollStatusMessage("⚠️ That roller already has an Autoroller permanently attached!", true)
        return false
    }

    let foundIndex = -1
    let autorollerId = (coreValues.rollers && coreValues.rollers.autorollerId) || "autoroller"
    for (let i = 0; i < PlayerData.itemsInventory.length; i++) {
        let candidate = PlayerData.itemsInventory[i]
        if (!candidate) continue
        if (autorollerInstanceId && candidate.instanceId === autorollerInstanceId && candidate.itemId === autorollerId) {
            foundIndex = i
            break
        }
        if (!autorollerInstanceId && candidate.itemId === autorollerId) {
            foundIndex = i
            break
        }
    }

    if (foundIndex === -1) {
        return false
    }

    PlayerData.itemsInventory.splice(foundIndex, 1)
    equippedRoller.hasAutoroller = true
    equippedRoller.autoEnabled = true
    SyncAutoRollStateFromRollers()

    let rollerDef = GetRollerDefinition(equippedRoller.itemId)
    PlayGameSound("levelup")
    if (triggerEl) {
        SpawnParticleBurst(triggerEl, "rare")
    }
    SetRollStatusMessage("🤖 Autoroller permanently attached to " + rollerDef.name + "! Automation is ON.", false)
    SaveGame()
    UpdateUI()
    return true
}

function ToggleRollerAutomation(slotIndex) {
    EnsureRollerSlotsNormalized()
    let targetSlot = Number(slotIndex)
    if (isNaN(targetSlot) || targetSlot < 0 || targetSlot >= PlayerData.maxRollerSlots) {
        return false
    }

    let equippedRoller = PlayerData.equippedRollers[targetSlot]
    if (!equippedRoller || !equippedRoller.hasAutoroller) {
        return false
    }

    equippedRoller.autoEnabled = !equippedRoller.autoEnabled
    SyncAutoRollStateFromRollers()

    let rollerDef = GetRollerDefinition(equippedRoller.itemId)
    PlayGameSound("pop")
    SetRollStatusMessage("🤖 " + rollerDef.name + " automation turned " + (equippedRoller.autoEnabled ? "ON" : "OFF") + ".", false)
    SaveGame()
    UpdateUI()
    return true
}

function GetAutorollerPrice() {
    if (coreValues.rollers && typeof coreValues.rollers.autorollerPrice === "number") {
        return coreValues.rollers.autorollerPrice
    }
    let def = GetItemDefinition("autoroller")
    return (def && typeof def.price === "number") ? def.price : 1000
}

function BuyAutoroller(triggerEl) {
    let price = GetAutorollerPrice()
    if (PlayerData.diamonds < price) {
        SetRollStatusMessage("⚠️ Need " + FormatNumber(price) + " Diamonds to buy an Autoroller!", true)
        return false
    }

    let autorollerId = (coreValues.rollers && coreValues.rollers.autorollerId) || "autoroller"
    let inst = CreateItemInstance(autorollerId)
    if (!inst) return false

    PlayerData.diamonds = math.max(0, PlayerData.diamonds - price)
    table.insert(PlayerData.itemsInventory, inst)

    ShowPopup("diamond-popup", "-" + FormatNumber(price))
    BumpPill("diamond-pill")
    PlayGameSound("levelup")
    if (triggerEl) {
        SpawnParticleBurst(triggerEl, "diamond")
    }

    SetRollStatusMessage("🤖 Purchased an Autoroller! Drag it from your Items Inventory onto an equipped roller to automate it.", false)
    SaveGame()
    UpdateUI()
    return true
}

function HandleRollClick(eventOrIsAuto) {
    let isAutoRoll = eventOrIsAuto === true
    if (PlayerData.isCooldown) return

    let equippedRollers = GetEquippedRollers()
    if (equippedRollers.length <= 0) {
        if (!isAutoRoll) {
            SetRollStatusMessage("⚠️ You cannot roll without an equipped roller! Open the Items Inventory tab and drag your Basic Roller into a Roller Slot.", true)
        }
        return
    }

    if (isAutoRoll && !HasActiveAutomatedRoller()) {
        return
    }

    let rollCost = coreValues.roll.cost
    if (PlayerData.tokens < rollCost) {
        if (!isAutoRoll) {
            SetRollStatusMessage("Not enough tokens! Waiting for token drop...", true)
        }
        return
    }

    let rolledCards = RollWithEquippedRollers(CardsList, isAutoRoll)
    if (!Array.isArray(rolledCards) || rolledCards.length <= 0) {
        return
    }

    PlayerData.tokens -= rollCost
    PlayerData.totalRolls += 1

    PlayerData.lastRolledCards = rolledCards
    PlayerData.lastRolledCard = GetRarest(rolledCards) || null

    let totalGainedXp = 0
    let hasRareOrMutated = false

    for (let [i, cardData] of pairs(rolledCards)) {
        if (!cardData) continue
        AddCardToInventory(cardData)
        totalGainedXp += GetCardXp(cardData)

        let mutation = GetCardMutation(cardData)
        if (mutation.name !== "None" || cardData.rarity >= 10) {
            hasRareOrMutated = true
        }
    }

    AddXp(totalGainedXp)

    PlayGameSound(hasRareOrMutated ? "rare" : "roll")
    SpawnParticleBurst(document.getElementById("rolled-card-display"), hasRareOrMutated ? "rare" : "normal")

    RenderRolledCards(rolledCards, totalGainedXp)
    StartRollCooldown()
    SaveGame()
    UpdateUI()
}

function ToggleAutoRoll() {
    if (!HasAutomatedEquippedRoller()) {
        SetRollStatusMessage("⚠️ Buy an Autoroller (1,000 💎) and drag it onto an equipped roller to unlock automation!", true)
        return
    }

    let nextState = !HasActiveAutomatedRoller()
    let equipped = GetEquippedRollers()
    for (let [i, roller] of pairs(equipped)) {
        if (roller && roller.hasAutoroller) {
            roller.autoEnabled = nextState
        }
    }
    SyncAutoRollStateFromRollers()

    PlayGameSound("pop")
    SaveGame()
    UpdateUI()
}

function RenderRolledCards(rolledCardsInput, totalGainedXp) {
    let rolledCards = Array.isArray(rolledCardsInput)
        ? rolledCardsInput.filter(Boolean)
        : (rolledCardsInput ? [rolledCardsInput] : [])
    if (rolledCards.length === 0) return

    let stageWrap = document.getElementById("roll-stage-wrap")
    let display = document.getElementById("rolled-card-display")
    let banner = document.getElementById("roll-batch-banner")
    let status = document.getElementById("roll-status")
    let starburst = document.getElementById("roll-starburst")

    if (!display) return

    let xpAmount = totalGainedXp !== undefined ? totalGainedXp : GetRollBatchXp(rolledCards)
    let rarestCard = GetRarest(rolledCards)
    let isMulti = rolledCards.length > 1

    if (stageWrap) {
        stageWrap.classList.toggle("multi-stage", isMulti)
    }

    display.classList.remove("empty", "pop", "single-roll", "multi-roll", "count-1", "count-2", "count-3", "count-4", "count-many")
    void display.offsetWidth
    display.classList.add("pop", isMulti ? "multi-roll" : "single-roll")
    if (rolledCards.length <= 4) {
        display.classList.add("count-" + rolledCards.length)
    } else {
        display.classList.add("count-many")
    }

    if (starburst) {
        starburst.classList.add("burst-active")
    }

    if (banner) {
        banner.classList.remove("hidden", "banner-pop")
        void banner.offsetWidth
        banner.classList.add("banner-pop")
        let cardWord = rolledCards.length === 1 ? "Card" : "Cards"
        let bestHtml = rarestCard
            ? `<span class="batch-banner-best">${isMulti ? "👑 Best: " : "✨ "}<strong>${rarestCard.name}</strong> (${FormatRarityText(rarestCard.rarity)})</span>`
            : ""
        banner.innerHTML = `
            <span class="batch-banner-count">🎲 Rolled ${rolledCards.length} ${cardWord}!</span>
            ${bestHtml}
            <span class="batch-banner-xp">🌟 +${FormatNumber(xpAmount)} XP</span>
        `
    }

    display.innerHTML = ""
    let staggerSec = (coreValues.roll && coreValues.roll.staggerDelay !== undefined) ? coreValues.roll.staggerDelay : 0.06

    for (let [i, cardData] of pairs(rolledCards)) {
        let idx = Number(i)
        let frontTagsHtml = RenderCardTagsHTML(cardData, "front")
        let isBestPull = isMulti && rarestCard && cardData.name === rarestCard.name && cardData.rarity > 0
        let cardXp = GetCardXp(cardData)

        let itemEl = document.createElement("div")
        itemEl.className = "rolled-card-item" + (isBestPull ? " is-best-pull" : "")
        itemEl.style.setProperty("--roll-delay", (idx * staggerSec).toFixed(3) + "s")

        itemEl.innerHTML = `
            <div class="roll-image-frame">
                <img src="${FormatImagePath(cardData.image)}" alt="${cardData.name}" draggable="false">
                <div class="card-holo-glare"></div>
                <div class="card-shine"></div>
                <div class="rolled-card-rarity-pill">
                    ${isBestPull ? '<span class="best-crown">👑</span>' : ""}
                    <span>${FormatRarityText(cardData.rarity)}</span>
                </div>
                <div class="card-front-tags-overlay ${frontTagsHtml ? "" : "hidden"}">${frontTagsHtml}</div>
                <div class="card-title-overlay">
                    <h2 class="rolled-item-name">${cardData.name}</h2>
                    <span class="rolled-item-xp">+${FormatNumber(cardXp)} XP</span>
                </div>
                <div class="hold-progress"></div>
            </div>
        `

        AttachCardInteractions(itemEl, function() {
            return cardData
        }, false)

        display.appendChild(itemEl)
    }

    if (status) {
        if (rolledCards.length === 1) {
            let single = rolledCards[0]
            status.textContent = "🎉 Rolled " + single.name + " (" + FormatRarityText(single.rarity) + ") • +" + FormatNumber(xpAmount) + " XP"
        } else {
            let namesPreview = rolledCards.slice(0, 4).map(function(c) { return c.name }).join(", ")
            if (rolledCards.length > 4) {
                namesPreview += " +" + (rolledCards.length - 4) + " more"
            }
            status.textContent = "🎉 Rolled " + rolledCards.length + " cards (" + namesPreview + ") • Best: " + rarestCard.name + " (" + FormatRarityText(rarestCard.rarity) + ") • +" + FormatNumber(xpAmount) + " XP"
        }
        status.classList.remove("warn")
    }
}

function RenderRolledCard(cardData, gainedXp) {
    RenderRolledCards(cardData, gainedXp)
}

function SwitchView(viewName) {
    PlayerData.activeView = viewName
    let viewCards = document.getElementById("view-cards")
    let viewPresses = document.getElementById("view-presses")
    let viewShop = document.getElementById("view-shop")
    let viewSettings = document.getElementById("view-settings")
    let navCards = document.getElementById("nav-cards")
    let navPresses = document.getElementById("nav-presses")
    let navShop = document.getElementById("nav-shop")
    let navSettings = document.getElementById("nav-settings")
    let sidebarPressSection = document.getElementById("sidebar-press-section")
    let viewTitle = document.getElementById("view-title")

    viewCards.classList.toggle("hidden", viewName !== "cards")
    viewPresses.classList.toggle("hidden", viewName !== "presses")
    if (viewShop) {
        viewShop.classList.toggle("hidden", viewName !== "shop")
    }
    if (viewSettings) {
        viewSettings.classList.toggle("hidden", viewName !== "settings")
    }

    navCards.classList.toggle("active", viewName === "cards")
    navPresses.classList.toggle("active", viewName === "presses")
    if (navShop) {
        navShop.classList.toggle("active", viewName === "shop")
    }
    if (navSettings) {
        navSettings.classList.toggle("active", viewName === "settings")
    }

    if (sidebarPressSection) {
        sidebarPressSection.classList.toggle("hidden", viewName !== "presses")
    }

    if (viewName === "presses") {
        viewTitle.textContent = "Presses"
    } else if (viewName === "shop") {
        viewTitle.textContent = "Upgrade Shop"
    } else if (viewName === "settings") {
        viewTitle.textContent = "Settings"
    } else {
        viewTitle.textContent = "Roll & Inventory"
    }

    RenderSidebarPresses()
    RenderPressMenu()
    RenderShop()
}

function ToggleSidebar() {
    let appShell = document.querySelector(".app-shell")
    let sidebar = document.getElementById("sidebar")
    let backdrop = document.getElementById("sidebar-backdrop")

    if (window.innerWidth <= 900) {
        let isOpen = sidebar.classList.toggle("mobile-open")
        backdrop.classList.toggle("hidden", !isOpen)
    } else {
        appShell.classList.toggle("sidebar-collapsed")
    }
}

function CloseMobileSidebar() {
    let sidebar = document.getElementById("sidebar")
    let backdrop = document.getElementById("sidebar-backdrop")
    sidebar.classList.remove("mobile-open")
    backdrop.classList.add("hidden")
}

function RenderSidebarMutationsLegend() {
    let legendContainer = document.getElementById("mutations-legend-list")
    if (!legendContainer) return
    legendContainer.innerHTML = ""

    for (let [i, mutationData] of pairs(MutationsList)) {
        let item = document.createElement("div")
        item.className = "legend-item"
        let swatchStyle = mutationData.background
            ? `style="background: ${mutationData.background}; border: 1px solid ${mutationData.borderColor || "transparent"};"`
            : ""
        item.innerHTML = `
            <span class="legend-swatch mutation-${mutationData.name.toLowerCase()}" ${swatchStyle}></span>
            <span class="legend-name">${mutationData.name}</span>
            <span class="legend-mult">${mutationData.multiplier}×</span>
        `
        legendContainer.appendChild(item)
    }
}

function RenderSidebarPresses() {
    let listEl = document.getElementById("sidebar-press-list")
    if (!listEl) return
    listEl.innerHTML = ""

    for (let [i, pressData] of pairs(PressesList)) {
        let btn = document.createElement("button")
        let isActive = PlayerData.activeView === "presses" && PlayerData.activePressId === pressData.id
        btn.className = "sidebar-subitem" + (isActive ? " active" : "")
        btn.innerHTML = `
            <span>${pressData.name}</span>
            ${pressData.comingSoon ? '<span class="soon-tag">Soon</span>' : ""}
        `
        btn.addEventListener("click", function() {
            PlayerData.activePressId = pressData.id
            SaveGame()
            SwitchView("presses")
            CloseMobileSidebar()
        })
        listEl.appendChild(btn)
    }
}

function RenderPressMenu() {
    let tabsContainer = document.getElementById("press-tabs")
    let contentContainer = document.getElementById("press-content")
    let headingEl = document.getElementById("active-press-heading")

    tabsContainer.innerHTML = ""
    contentContainer.innerHTML = ""

    let activePress = PressesList[0]
    for (let [i, pressData] of pairs(PressesList)) {
        if (pressData.id === PlayerData.activePressId) {
            activePress = pressData
        }

        let tabBtn = document.createElement("button")
        tabBtn.className = "press-tab" + (pressData.id === PlayerData.activePressId ? " active" : "")
        tabBtn.innerHTML = `
            <span>${pressData.name}</span>
            ${pressData.comingSoon ? '<span class="soon-tag">Soon</span>' : ""}
        `
        tabBtn.addEventListener("click", function() {
            PlayerData.activePressId = pressData.id
            SaveGame()
            RenderSidebarPresses()
            RenderPressMenu()
        })
        tabsContainer.appendChild(tabBtn)
    }

    if (headingEl) {
        headingEl.textContent = activePress.name
    }

    if (activePress.comingSoon) {
        let soonBox = document.createElement("div")
        soonBox.className = "press-coming-soon"
        soonBox.innerHTML = `
            <div class="soon-badge">Coming Soon</div>
            <h3>${activePress.name}</h3>
            <p>${activePress.description}</p>
        `
        contentContainer.appendChild(soonBox)
        return
    }

    let discovered = GetDiscoveredCards()
    let descEl = document.createElement("p")
    descEl.className = "press-description"
    descEl.textContent = activePress.description
    contentContainer.appendChild(descEl)

    let percentages = (coreValues.presses && coreValues.presses.percentages) || [10, 25, 50, 75, 100]
    let totalEligibleCards = 0
    let totalEligibleDiamonds = 0

    for (let [i, cardData] of pairs(discovered)) {
        let entry = PlayerData.inventory[cardData.name]
        if (!entry || entry.count <= 0) continue
        let qty = GetPressCardQuantity(entry.count, PlayerData.pressPercent, PlayerData.pressKeepOne)
        if (qty > 0) {
            totalEligibleCards += qty
            totalEligibleDiamonds += GetDiamondPressValue(cardData) * qty
        }
    }

    let controlsBar = document.createElement("div")
    controlsBar.className = "press-controls-bar"

    let optionsWrap = document.createElement("div")
    optionsWrap.className = "press-options-wrap"

    let optionsLabel = document.createElement("span")
    optionsLabel.className = "press-options-label"
    optionsLabel.textContent = "⚙️ Press Amount:"
    optionsWrap.appendChild(optionsLabel)

    let pctGroup = document.createElement("div")
    pctGroup.className = "press-pct-group"

    for (let [i, pct] of pairs(percentages)) {
        let pctBtn = document.createElement("button")
        pctBtn.type = "button"
        pctBtn.className = "press-option-btn" + (PlayerData.pressPercent === pct ? " active" : "")
        pctBtn.textContent = pct + "%"
        pctBtn.addEventListener("click", function() {
            PlayerData.pressPercent = pct
            PlayGameSound("pop")
            SaveGame()
            RenderPressMenu()
        })
        pctGroup.appendChild(pctBtn)
    }

    optionsWrap.appendChild(pctGroup)

    let keepOneBtn = document.createElement("button")
    keepOneBtn.type = "button"
    keepOneBtn.className = "press-keep1-btn" + (PlayerData.pressKeepOne ? " active" : "")
    keepOneBtn.textContent = "🛡️ Keep 1: " + (PlayerData.pressKeepOne ? "ON" : "OFF")
    keepOneBtn.addEventListener("click", function() {
        PlayerData.pressKeepOne = !PlayerData.pressKeepOne
        PlayGameSound("pop")
        SaveGame()
        RenderPressMenu()
    })
    optionsWrap.appendChild(keepOneBtn)

    let pressAllBtn = document.createElement("button")
    pressAllBtn.type = "button"
    pressAllBtn.className = "press-all-master-btn"
    pressAllBtn.disabled = totalEligibleCards <= 0
    if (totalEligibleCards > 0) {
        pressAllBtn.textContent = "💎 Press All (" + PlayerData.pressPercent + "% • x" + totalEligibleCards + " • +" + FormatNumber(totalEligibleDiamonds) + ")"
    } else {
        pressAllBtn.textContent = "💎 Press All (" + PlayerData.pressPercent + "% • 0 Eligible)"
    }
    pressAllBtn.addEventListener("click", function() {
        PressAllEligibleCards(pressAllBtn)
    })

    controlsBar.appendChild(optionsWrap)
    controlsBar.appendChild(pressAllBtn)
    contentContainer.appendChild(controlsBar)

    if (discovered.length === 0) {
        let emptyPress = document.createElement("div")
        emptyPress.className = "press-empty"
        emptyPress.textContent = "Roll and collect cards to sell them in the Diamond Press."
        contentContainer.appendChild(emptyPress)
        return
    }

    let listEl = document.createElement("div")
    listEl.className = "press-card-list"

    for (let [i, cardData] of pairs(discovered)) {
        let entry = PlayerData.inventory[cardData.name]
        let diamondValue = GetDiamondPressValue(cardData)
        let rowPressQty = GetPressCardQuantity(entry.count, PlayerData.pressPercent, PlayerData.pressKeepOne)
        let canPressOne = PlayerData.pressKeepOne ? entry.count > 1 : entry.count >= 1

        let row = document.createElement("div")
        row.className = "press-card-row"
        row.innerHTML = `
            <div class="press-card-left">
                <img src="${FormatImagePath(cardData.image)}" alt="${cardData.name}" class="press-card-thumb" draggable="false">
                <div class="press-card-info">
                    <h4>
                        ${cardData.name}
                        <span class="press-card-count">x${entry.count}</span>
                    </h4>
                    <span class="press-card-yield">Rarity: ${FormatRarityText(cardData.rarity)} • +${FormatNumber(diamondValue)} Diamonds each</span>
                </div>
            </div>
            <div class="press-card-actions">
                <button class="press-sell-btn sell-one" ${canPressOne ? "" : "disabled"}>Press 1 (+${FormatNumber(diamondValue)})</button>
                <button class="press-sell-btn sell-all" ${rowPressQty > 0 ? "" : "disabled"}>Press ${PlayerData.pressPercent}% (x${rowPressQty} • +${FormatNumber(diamondValue * rowPressQty)})</button>
            </div>
        `

        row.querySelector(".sell-one").addEventListener("click", function() {
            if (!canPressOne) return
            SellCardInDiamondPress(cardData, 1)
        })
        row.querySelector(".sell-all").addEventListener("click", function() {
            if (rowPressQty <= 0) return
            SellCardInDiamondPress(cardData, rowPressQty)
        })

        listEl.appendChild(row)
    }

    contentContainer.appendChild(listEl)
}

function GetUpgradeDisplayStats(upgradeId, level) {
    let nextLevel = level + 1
    if (upgradeId === "luck") {
        let curLuck = GetEffectiveLuck(level)
        let nextLuck = GetEffectiveLuck(nextLevel)
        let curBonus = (GetCompoundFactor(level, "luck") - 1) * 100
        let nextBonus = (GetCompoundFactor(nextLevel, "luck") - 1) * 100
        return {
            currentText: FormatNumber(curLuck) + "× (" + (curBonus > 0 ? "+" + FormatNumber(curBonus) + "%" : "Base") + ")",
            nextText: FormatNumber(nextLuck) + "× (+" + FormatNumber(nextBonus) + "%)",
            chipText: "🍀 Luck: " + FormatNumber(curLuck) + "×",
        }
    }

    if (upgradeId === "tokenRate") {
        let curRate = GetEffectiveTokenRatePerSec(level)
        let nextRate = GetEffectiveTokenRatePerSec(nextLevel)
        let diffRate = nextRate - curRate
        return {
            currentText: FormatNumber(curRate, 3) + " tokens/s",
            nextText: FormatNumber(nextRate, 3) + " tokens/s (+" + FormatNumber(diffRate, 3) + "/s)",
            chipText: "⚡ Token Rate: " + FormatNumber(curRate, 3) + "/s",
        }
    }

    if (upgradeId === "tokenCapacity") {
        let curCap = GetEffectiveTokenCapacity(level)
        let nextCap = GetEffectiveTokenCapacity(nextLevel)
        let diffCap = nextCap - curCap
        return {
            currentText: FormatNumber(curCap) + " Max Tokens",
            nextText: FormatNumber(nextCap) + " Max (+" + FormatNumber(diffCap) + ")",
            chipText: "🪣 Capacity: " + FormatNumber(curCap),
        }
    }

    if (upgradeId === "xpMultiplier") {
        let curXp = GetEffectiveXpMultiplier(level)
        let nextXp = GetEffectiveXpMultiplier(nextLevel)
        return {
            currentText: "×" + FormatNumber(curXp) + " XP",
            nextText: "×" + FormatNumber(nextXp) + " XP (+20%)",
            chipText: "🌟 XP Mult: ×" + FormatNumber(curXp),
        }
    }

    if (upgradeId === "rollSpeed") {
        let curSpeed = GetEffectiveRollSpeedMultiplier(level)
        let nextSpeed = GetEffectiveRollSpeedMultiplier(nextLevel)
        let curCd = GetEffectiveRollCooldown(level)
        let nextCd = GetEffectiveRollCooldown(nextLevel)
        return {
            currentText: FormatNumber(curSpeed) + "× (" + FormatNumber(curCd) + "s CD)",
            nextText: FormatNumber(nextSpeed) + "× (" + FormatNumber(nextCd) + "s CD)",
            chipText: "⏩ Roll Speed: " + FormatNumber(curSpeed) + "× (" + FormatNumber(curCd) + "s)",
        }
    }

    if (upgradeId === "pressRevenue") {
        let curRev = GetEffectivePressRevenueMultiplier(level)
        let nextRev = GetEffectivePressRevenueMultiplier(nextLevel)
        return {
            currentText: "×" + FormatNumber(curRev) + " Diamonds",
            nextText: "×" + FormatNumber(nextRev) + " Diamonds (+10%)",
            chipText: "💎 Press Rev: ×" + FormatNumber(curRev),
        }
    }

    return {
        currentText: "-",
        nextText: "-",
        chipText: "",
    }
}

function BuyShopUpgrade(upgradeId, triggerEl) {
    let level = GetUpgradeLevel(upgradeId)
    let price = GetUpgradePrice(level)

    if (PlayerData.diamonds < price) {
        return
    }

    PlayerData.diamonds = math.max(0, PlayerData.diamonds - price)
    PlayerData.upgrades[upgradeId] = level + 1

    ShowPopup("diamond-popup", "-" + FormatNumber(price))
    BumpPill("diamond-pill")
    PlayGameSound("levelup")
    if (triggerEl) {
        SpawnParticleBurst(triggerEl, "diamond")
    }

    SaveGame()
    UpdateUI()
}

function RenderShop() {
    let balanceEl = document.getElementById("shop-diamond-balance")
    let overviewEl = document.getElementById("shop-stats-overview")
    let gridEl = document.getElementById("shop-upgrades-grid")

    if (!gridEl) return

    if (balanceEl) {
        balanceEl.textContent = FormatNumber(PlayerData.diamonds)
    }

    if (overviewEl) {
        overviewEl.innerHTML = ""
        for (let [i, upg] of pairs(ShopUpgradesList)) {
            let lvl = GetUpgradeLevel(upg.id)
            let stats = GetUpgradeDisplayStats(upg.id, lvl)
            let chip = document.createElement("div")
            chip.className = "shop-stat-chip"
            chip.innerHTML = `<span>${stats.chipText}</span>`
            overviewEl.appendChild(chip)
        }
    }

    gridEl.innerHTML = ""

    for (let [i, upg] of pairs(ShopUpgradesList)) {
        let level = GetUpgradeLevel(upg.id)
        let price = GetUpgradePrice(level)
        let canAfford = PlayerData.diamonds >= price
        let stats = GetUpgradeDisplayStats(upg.id, level)
        let upgCompoundRate = GetUpgradeCompoundRate(upg.id)

        let card = document.createElement("div")
        card.className = "shop-upgrade-card"
        card.innerHTML = `
            <div class="shop-card-top">
                <div class="shop-card-title-group">
                    <div class="shop-card-icon">${upg.icon}</div>
                    <div class="shop-card-titles">
                        <h3>${upg.name}</h3>
                        <span class="shop-card-compound">+${FormatNumber(upgCompoundRate * 100)}% Compounding</span>
                    </div>
                </div>
                <span class="shop-level-badge">Lv. ${level}</span>
            </div>
            <p class="shop-card-desc">${upg.description}</p>
            <div class="shop-stat-progression">
                <div class="shop-stat-box">
                    <span class="shop-stat-label">Current</span>
                    <span class="shop-stat-val">${stats.currentText}</span>
                </div>
                <span class="shop-stat-arrow">➜</span>
                <div class="shop-stat-box next">
                    <span class="shop-stat-label">Next (Lv. ${level + 1})</span>
                    <span class="shop-stat-val">${stats.nextText}</span>
                </div>
            </div>
            <button class="shop-buy-btn ${canAfford ? "can-afford" : ""}" ${canAfford ? "" : "disabled"}>
                <span class="shop-buy-label">Upgrade ${upg.name}</span>
                <span class="shop-buy-price">💎 ${FormatNumber(price)}</span>
            </button>
        `

        let buyBtn = card.querySelector(".shop-buy-btn")
        buyBtn.addEventListener("click", function() {
            BuyShopUpgrade(upg.id, buyBtn)
        })

        gridEl.appendChild(card)
    }

    let autorollerDef = GetItemDefinition((coreValues.rollers && coreValues.rollers.autorollerId) || "autoroller")
    if (autorollerDef) {
        let autoPrice = GetAutorollerPrice()
        let canAffordAuto = PlayerData.diamonds >= autoPrice
        let ownedAutoCount = 0
        for (let [i, it] of pairs(PlayerData.itemsInventory)) {
            if (it && it.itemId === autorollerDef.id) {
                ownedAutoCount += 1
            }
        }
        let attachedAutoCount = 0
        for (let [i, r] of pairs(GetEquippedRollers())) {
            if (r && r.hasAutoroller) attachedAutoCount += 1
        }
        for (let [i, it] of pairs(PlayerData.itemsInventory)) {
            if (it && it.type === "roller" && it.hasAutoroller) attachedAutoCount += 1
        }

        let autoCard = document.createElement("div")
        autoCard.className = "shop-upgrade-card shop-item-card"
        autoCard.innerHTML = `
            <div class="shop-card-top">
                <div class="shop-card-title-group">
                    <div class="shop-card-icon">${autorollerDef.icon || "🤖"}</div>
                    <div class="shop-card-titles">
                        <h3>${autorollerDef.name}</h3>
                        <span class="shop-card-compound">Roller Attachment • Permanent</span>
                    </div>
                </div>
                <span class="shop-level-badge">In Bag: ${ownedAutoCount}</span>
            </div>
            <p class="shop-card-desc">${autorollerDef.description}</p>
            <div class="shop-stat-progression">
                <div class="shop-stat-box">
                    <span class="shop-stat-label">Automated Rollers</span>
                    <span class="shop-stat-val">${attachedAutoCount} Attached</span>
                </div>
                <span class="shop-stat-arrow">➜</span>
                <div class="shop-stat-box next">
                    <span class="shop-stat-label">Effect</span>
                    <span class="shop-stat-val">Toggleable Auto-Roll</span>
                </div>
            </div>
            <button class="shop-buy-btn ${canAffordAuto ? "can-afford" : ""}" ${canAffordAuto ? "" : "disabled"}>
                <span class="shop-buy-label">Buy ${autorollerDef.name}</span>
                <span class="shop-buy-price">💎 ${FormatNumber(autoPrice)}</span>
            </button>
        `

        let buyAutoBtn = autoCard.querySelector(".shop-buy-btn")
        buyAutoBtn.addEventListener("click", function() {
            BuyAutoroller(buyAutoBtn)
        })

        gridEl.appendChild(autoCard)
    }
}

function PopulateModalCard(cardData, index, total) {
    let entry = PlayerData.inventory[cardData.name]
    if (!entry) return

    let mutation = GetCardMutation(cardData)
    let modalImg = document.getElementById("modal-card-image")
    let modalName = document.getElementById("modal-card-name")
    let modalRarity = document.getElementById("modal-card-rarity")
    let modalMutation = document.getElementById("modal-card-mutation")
    let modalMutationTag = document.getElementById("modal-mutation-tag")
    let modalCardTags = document.getElementById("modal-card-tags")
    let modalQuantity = document.getElementById("modal-card-quantity")
    let modalDate = document.getElementById("modal-card-date")
    let modalBadge = document.getElementById("modal-index-badge")
    let prevBtn = document.getElementById("modal-prev")
    let nextBtn = document.getElementById("modal-next")

    modalImg.src = FormatImagePath(cardData.image)
    modalImg.alt = cardData.name
    modalName.textContent = cardData.name

    let baseRarityText = FormatRarityText(cardData.rarity)
    let currentLuck = GetEffectiveLuck()
    if (cardData.rarity > 0 && currentLuck > 1) {
        let effectiveRarity = GetEffectiveCardRarity(cardData.rarity, currentLuck)
        modalRarity.textContent = baseRarityText + " (🍀 " + FormatRarityText(effectiveRarity) + ")"
    } else {
        modalRarity.textContent = baseRarityText
    }

    modalMutation.textContent = mutation.name + " (" + mutation.multiplier + "×)"
    modalQuantity.textContent = entry.count
    modalDate.textContent = FormatDate(entry.firstObtained)
    modalBadge.textContent = (index + 1) + " / " + total

    RenderCardTagsInto(modalMutationTag, cardData, "front")
    RenderCardTagsInto(modalCardTags, cardData, "back")

    let hasMultiple = total > 1
    prevBtn.disabled = !hasMultiple
    nextBtn.disabled = !hasMultiple
}

function OpenCardModal(cardData) {
    let discovered = GetDiscoveredCards()
    if (discovered.length === 0) return

    let foundIndex = 0
    for (let [i, item] of pairs(discovered)) {
        if (item.name === cardData.name) {
            foundIndex = Number(i)
            break
        }
    }

    ModalState.currentIndex = foundIndex
    ModalState.isOpen = true
    ModalState.isAnimating = false

    let slideContent = document.getElementById("modal-slide-content")
    slideContent.className = "modal-slide-content"

    PopulateModalCard(discovered[foundIndex], foundIndex, discovered.length)

    let modal = document.getElementById("card-modal")
    modal.classList.remove("hidden")
}

function NavigateModal(direction) {
    if (!ModalState.isOpen || ModalState.isAnimating) return

    let discovered = GetDiscoveredCards()
    if (discovered.length <= 1) return

    ModalState.isAnimating = true
    let nextIndex = (ModalState.currentIndex + direction + discovered.length) % discovered.length
    ModalState.currentIndex = nextIndex

    let slideContent = document.getElementById("modal-slide-content")
    let outClass = direction > 0 ? "slide-out-left" : "slide-out-right"
    let inClass = direction > 0 ? "slide-in-right" : "slide-in-left"
    let halfDurationMs = (coreValues.interaction.slideDuration * 1000) / 2

    slideContent.classList.remove("slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right")
    slideContent.classList.add(outClass)

    setTimeout(function() {
        PopulateModalCard(discovered[nextIndex], nextIndex, discovered.length)
        slideContent.classList.remove(outClass)
        slideContent.classList.add(inClass)

        setTimeout(function() {
            slideContent.classList.remove(inClass)
            ModalState.isAnimating = false
        }, halfDurationMs)
    }, halfDurationMs)
}

function CloseCardModal() {
    ModalState.isOpen = false
    ModalState.isAnimating = false
    let modal = document.getElementById("card-modal")
    modal.classList.add("hidden")
}

function IsMutatedCard(cardData) {
    if (!cardData) return false
    if (typeof cardData.mutationIndex === "number" && cardData.mutationIndex > 0) {
        return true
    }
    let mutation = GetCardMutation(cardData)
    return Boolean(mutation && mutation.name !== "None")
}

function ResolveTagDefinitionById(tagId, fallbackName, fallbackType) {
    if (!tagId) return null

    if (typeof RarityTiersList !== "undefined") {
        for (let [i, tier] of pairs(RarityTiersList)) {
            if (("tier-" + tier.id) === tagId || tier.id === tagId) {
                return CreateCardTag({
                    type: "rarityTier",
                    id: "tier-" + tier.id,
                    name: tier.name,
                    description: "Rarity Tier (" + (tier.rangeLabel || "") + ")",
                    icon: tier.icon,
                    background: tier.background,
                    textColor: tier.textColor,
                    borderColor: tier.borderColor,
                    glowColor: tier.glowColor,
                    animated: tier.animated,
                    cssClass: "tag-tier-" + tier.id,
                })
            }
        }
    }

    let preset = FindTagPreset(tagId) || (fallbackName ? FindTagPreset(fallbackName) : null)
    if (preset) {
        return CreateCardTag({
            type: preset.type || fallbackType || "custom",
            id: preset.id || tagId,
            presetId: preset.name,
            name: preset.name,
            description: preset.description,
        })
    }

    for (let [i, cardData] of pairs(CardsList)) {
        if (IsMutatedCard(cardData)) continue
        let tags = GetCardTags(cardData, "all")
        for (let [j, t] of pairs(tags)) {
            if (t && t.id === tagId) {
                return t
            }
        }
    }

    return CreateCardTag({
        id: tagId,
        type: fallbackType || "custom",
        name: fallbackName || "Tag",
    })
}

function CardHasTag(cardData, targetTagId) {
    if (!cardData || !targetTagId) return false
    let tags = GetCardTags(cardData, "all")
    for (let [i, tag] of pairs(tags)) {
        if (tag && tag.id === targetTagId) {
            return true
        }
    }
    return false
}

function GetOwnedCardsByTag(targetTagId) {
    let discovered = GetDiscoveredCards()
    let matching = []
    for (let [i, cardData] of pairs(discovered)) {
        if (IsMutatedCard(cardData)) continue
        if (CardHasTag(cardData, targetTagId)) {
            table.insert(matching, cardData)
        }
    }
    return matching
}

function PopulateTagModal(tagId, fallbackName, fallbackType) {
    let tagMeta = ResolveTagDefinitionById(tagId, fallbackName, fallbackType)
    if (!tagMeta || tagMeta.type === "mutation") return

    let badgeSlot = document.getElementById("tag-modal-badge-slot")
    let titleEl = document.getElementById("tag-modal-title")
    let subtitleEl = document.getElementById("tag-modal-subtitle")
    let uniqueCountEl = document.getElementById("tag-modal-unique-count")
    let totalCopiesEl = document.getElementById("tag-modal-total-copies")
    let rarestEl = document.getElementById("tag-modal-rarest")
    let listEl = document.getElementById("tag-modal-cards-list")

    if (!listEl) return

    if (badgeSlot) {
        badgeSlot.innerHTML = RenderCardTagBadgeHTML(tagMeta)
    }

    let typeConfig = (typeof CardTagConfig !== "undefined" && CardTagConfig.types && CardTagConfig.types[tagMeta.type]) || {}
    let typeLabel = typeConfig.label || "Card Tag"

    if (titleEl) {
        titleEl.textContent = tagMeta.name + " — Tag Info"
    }
    if (subtitleEl) {
        subtitleEl.textContent = tagMeta.description
            ? (typeLabel + " • " + tagMeta.description)
            : (typeLabel + " • Owned base cards with the " + tagMeta.name + " tag")
    }

    let ownedMatching = GetOwnedCardsByTag(tagMeta.id)
    let totalCopies = 0
    for (let [i, cardData] of pairs(ownedMatching)) {
        let entry = PlayerData.inventory[cardData.name]
        if (entry && entry.count > 0) {
            totalCopies += entry.count
        }
    }

    if (uniqueCountEl) {
        uniqueCountEl.textContent = "🃏 Base Cards: " + ownedMatching.length
    }
    if (totalCopiesEl) {
        totalCopiesEl.textContent = "📦 Total Copies: " + totalCopies
    }
    if (rarestEl) {
        if (ownedMatching.length > 0) {
            let rarest = GetRarest(ownedMatching)
            rarestEl.textContent = "👑 Rarest: " + rarest.name + " (" + FormatRarityText(rarest.rarity) + ")"
        } else {
            rarestEl.textContent = "👑 Rarest: None"
        }
    }

    listEl.innerHTML = ""

    if (ownedMatching.length === 0) {
        let emptyEl = document.createElement("div")
        emptyEl.className = "tag-modal-empty"
        emptyEl.textContent = "No owned base cards with the " + tagMeta.name + " tag yet! Roll more cards to discover them."
        listEl.appendChild(emptyEl)
        return
    }

    for (let [i, cardData] of pairs(ownedMatching)) {
        let entry = PlayerData.inventory[cardData.name]
        let count = entry ? entry.count : 0
        let frontTagsHtml = RenderCardTagsHTML(cardData, "front")
        let backTagsHtml = RenderCardTagsHTML(cardData, "back")

        let rowEl = document.createElement("div")
        rowEl.className = "tag-modal-card-item"
        rowEl.innerHTML = `
            <div class="tag-modal-card-thumb-wrap">
                <img src="${FormatImagePath(cardData.image)}" alt="${cardData.name}" class="tag-modal-card-thumb" draggable="false">
                <div class="card-holo-glare"></div>
                ${frontTagsHtml ? `<div class="card-front-tags-overlay tag-modal-thumb-tags">${frontTagsHtml}</div>` : ""}
                <div class="card-title-overlay tag-modal-thumb-title">
                    <span class="card-front-name">${cardData.name}</span>
                </div>
            </div>
            <div class="tag-modal-card-details">
                <div class="tag-modal-card-top">
                    <h4 class="tag-modal-card-name">${cardData.name}</h4>
                    <span class="tag-modal-card-owned">Owned: x${count}</span>
                </div>
                <div class="tag-modal-card-rarity">✨ Rarity: <strong>${FormatRarityText(cardData.rarity)}</strong></div>
                <div class="tag-modal-card-tags">${backTagsHtml}</div>
            </div>
        `

        rowEl.addEventListener("click", function(e) {
            if (e.target && e.target.closest && e.target.closest(".card-tag-pill")) {
                return
            }
            CloseTagModal()
            OpenCardModal(cardData)
        })

        listEl.appendChild(rowEl)
    }
}

function OpenTagModal(tagId, fallbackName, fallbackType) {
    if (!tagId || fallbackType === "mutation" || String(tagId).startsWith("mutation-")) return
    let tagMeta = ResolveTagDefinitionById(tagId, fallbackName, fallbackType)
    if (!tagMeta || tagMeta.type === "mutation") return

    TagModalState.isOpen = true
    TagModalState.currentTagId = tagMeta.id

    PopulateTagModal(tagMeta.id, tagMeta.name, tagMeta.type)

    let tagModal = document.getElementById("tag-modal")
    if (tagModal) {
        tagModal.classList.remove("hidden")
    }
    PlayGameSound("pop")
}

function CloseTagModal() {
    TagModalState.isOpen = false
    TagModalState.currentTagId = null
    let tagModal = document.getElementById("tag-modal")
    if (tagModal) {
        tagModal.classList.add("hidden")
    }
}

function SetupTagLongPressInteractions() {
    let activeTagEl = null
    let pressTimer = null
    let startX = 0
    let startY = 0
    let isPressing = false

    function cancelTagPress() {
        if (pressTimer) {
            clearTimeout(pressTimer)
            pressTimer = null
        }
        if (activeTagEl) {
            activeTagEl.classList.remove("pressing")
            activeTagEl = null
        }
        isPressing = false
    }

    document.addEventListener("pointerdown", function(e) {
        if (e.button && e.button !== 0) return
        if (!e.target || typeof e.target.closest !== "function") return

        let tagEl = e.target.closest(".card-tag-pill")
        if (!tagEl) return

        let tagType = tagEl.getAttribute("data-tag-type")
        let tagId = tagEl.getAttribute("data-tag-id")
        let tagName = tagEl.getAttribute("data-tag-name") || tagEl.textContent

        if (!tagId || tagType === "mutation") {
            return
        }

        if (tagEl.closest("#tag-modal-badge-slot")) {
            return
        }

        e.stopPropagation()
        cancelTagPress()

        activeTagEl = tagEl
        isPressing = true
        startX = e.clientX
        startY = e.clientY
        activeTagEl.classList.add("pressing")

        pressTimer = setTimeout(function() {
            if (!isPressing || !activeTagEl) return
            let targetId = tagId
            let targetName = tagName
            let targetType = tagType
            cancelTagPress()
            OpenTagModal(targetId, targetName, targetType)
        }, coreValues.interaction.longPressDuration * 1000)
    }, true)

    document.addEventListener("pointermove", function(e) {
        if (!isPressing) return
        let dx = Math.abs(e.clientX - startX)
        let dy = Math.abs(e.clientY - startY)
        if (dx > coreValues.interaction.moveThreshold || dy > coreValues.interaction.moveThreshold) {
            cancelTagPress()
        }
    }, true)

    document.addEventListener("pointerup", cancelTagPress, true)
    document.addEventListener("pointercancel", cancelTagPress, true)
    document.addEventListener("contextmenu", function(e) {
        if (e.target && typeof e.target.closest === "function" && e.target.closest(".card-tag-pill.card-tag-interactive")) {
            e.preventDefault()
        }
    }, true)
}

function AttachCardInteractions(element, getCardData, allowTapFlip) {
    let pressTimer = null
    let startX = 0
    let startY = 0
    let longPressTriggered = false
    let isPointerDown = false

    function cancelPress() {
        if (pressTimer) {
            clearTimeout(pressTimer)
            pressTimer = null
        }
        isPointerDown = false
        element.classList.remove("pressing")
    }

    element.addEventListener("pointerdown", function(e) {
        if (e.button && e.button !== 0) return
        if (e.target && typeof e.target.closest === "function" && e.target.closest('.card-tag-pill:not([data-tag-type="mutation"])')) {
            return
        }
        let cardData = getCardData()
        if (!cardData || !PlayerData.inventory[cardData.name] || PlayerData.inventory[cardData.name].count <= 0) return

        isPointerDown = true
        longPressTriggered = false
        startX = e.clientX
        startY = e.clientY
        element.classList.add("pressing")

        pressTimer = setTimeout(function() {
            if (!isPointerDown) return
            longPressTriggered = true
            element.classList.remove("pressing")
            OpenCardModal(cardData)
        }, coreValues.interaction.longPressDuration * 1000)
    })

    element.addEventListener("pointermove", function(e) {
        if (!isPointerDown) return
        let dx = Math.abs(e.clientX - startX)
        let dy = Math.abs(e.clientY - startY)
        if (dx > coreValues.interaction.moveThreshold || dy > coreValues.interaction.moveThreshold) {
            cancelPress()
        }
    })

    element.addEventListener("pointerup", function(e) {
        let wasDown = isPointerDown
        let wasLongPress = longPressTriggered
        cancelPress()

        if (allowTapFlip && wasDown && !wasLongPress && e.pointerType === "touch") {
            element.classList.toggle("is-flipped")
        }
    })

    element.addEventListener("pointerleave", cancelPress)
    element.addEventListener("pointercancel", cancelPress)

    element.addEventListener("contextmenu", function(e) {
        e.preventDefault()
    })
}

let DragDropState = {
    activePayload: null,
    pointerDragging: false,
    pointerGhostEl: null,
    pointerStartX: 0,
    pointerStartY: 0,
    pendingPayload: null,
    pendingSourceEl: null,
}

function ClearDropTargetHighlights() {
    let highlighted = document.querySelectorAll(".drag-over-valid, .drag-over-invalid, .dragging-source")
    for (let i = 0; i < highlighted.length; i++) {
        highlighted[i].classList.remove("drag-over-valid", "drag-over-invalid", "dragging-source")
    }
}

function CanDropPayloadOnSlot(payload, slotIndex) {
    if (!payload) return false
    EnsureRollerSlotsNormalized()
    let idx = Number(slotIndex)
    if (isNaN(idx) || idx < 0 || idx >= PlayerData.maxRollerSlots) return false

    if (payload.itemType === "roller") {
        if (payload.source === "slot" && Number(payload.fromSlotIndex) === idx) {
            return false
        }
        return true
    }

    if (payload.itemType === "attachment") {
        let equipped = PlayerData.equippedRollers[idx]
        return Boolean(equipped && equipped.type === "roller" && !equipped.hasAutoroller)
    }

    return false
}

function ExecuteDropPayloadOnSlot(payload, slotIndex, slotEl) {
    if (!payload) return false
    let idx = Number(slotIndex)
    if (payload.itemType === "roller") {
        if (payload.source === "inventory") {
            return EquipRollerToSlot(payload.instanceId, idx)
        }
        if (payload.source === "slot") {
            return MoveOrSwapEquippedRoller(payload.fromSlotIndex, idx)
        }
    } else if (payload.itemType === "attachment") {
        return AttachAutorollerToSlot(payload.instanceId, idx, slotEl)
    }
    return false
}

function ExecuteDropPayloadOnInventory(payload) {
    if (!payload) return false
    if (payload.source === "slot" && payload.itemType === "roller") {
        return UnequipRollerFromSlot(payload.fromSlotIndex)
    }
    return false
}

function AttachDraggableItemEvents(el, payload) {
    if (!el || !payload) return
    el.setAttribute("draggable", "true")

    el.addEventListener("dragstart", function(e) {
        if (e.target && e.target.closest && e.target.closest("button")) {
            e.preventDefault()
            return
        }
        DragDropState.activePayload = payload
        el.classList.add("dragging-source")
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move"
            try {
                e.dataTransfer.setData("text/plain", JSON.stringify(payload))
            } catch (err) {
                // Ignore dataTransfer restrictions
            }
        }
    })

    el.addEventListener("dragend", function() {
        DragDropState.activePayload = null
        ClearDropTargetHighlights()
    })

    el.addEventListener("pointerdown", function(e) {
        if (e.pointerType !== "touch" && e.pointerType !== "pen") return
        if (e.target && e.target.closest && e.target.closest("button")) return
        DragDropState.pendingPayload = payload
        DragDropState.pendingSourceEl = el
        DragDropState.pointerStartX = e.clientX
        DragDropState.pointerStartY = e.clientY
    })
}

function AttachSlotDropZoneEvents(slotEl, slotIndex) {
    if (!slotEl) return

    slotEl.addEventListener("dragover", function(e) {
        let payload = DragDropState.activePayload
        if (!payload) return
        e.preventDefault()
        let isValid = CanDropPayloadOnSlot(payload, slotIndex)
        slotEl.classList.toggle("drag-over-valid", isValid)
        slotEl.classList.toggle("drag-over-invalid", !isValid)
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = isValid ? "move" : "none"
        }
    })

    slotEl.addEventListener("dragenter", function(e) {
        let payload = DragDropState.activePayload
        if (!payload) return
        e.preventDefault()
        let isValid = CanDropPayloadOnSlot(payload, slotIndex)
        slotEl.classList.toggle("drag-over-valid", isValid)
        slotEl.classList.toggle("drag-over-invalid", !isValid)
    })

    slotEl.addEventListener("dragleave", function(e) {
        if (e.relatedTarget && slotEl.contains(e.relatedTarget)) return
        slotEl.classList.remove("drag-over-valid", "drag-over-invalid")
    })

    slotEl.addEventListener("drop", function(e) {
        e.preventDefault()
        let payload = DragDropState.activePayload
        if (!payload && e.dataTransfer) {
            try {
                let raw = e.dataTransfer.getData("text/plain")
                if (raw) payload = JSON.parse(raw)
            } catch (err) {
                payload = null
            }
        }
        DragDropState.activePayload = null
        ClearDropTargetHighlights()
        if (payload) {
            ExecuteDropPayloadOnSlot(payload, slotIndex, slotEl)
        }
    })
}

function SetupRollerDragAndDropInteractions() {
    let itemsSection = document.getElementById("inventory-items-section")
    if (itemsSection) {
        itemsSection.addEventListener("dragover", function(e) {
            let payload = DragDropState.activePayload
            if (!payload || payload.source !== "slot" || payload.itemType !== "roller") return
            e.preventDefault()
            itemsSection.classList.add("drag-over-valid")
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = "move"
            }
        })

        itemsSection.addEventListener("dragleave", function(e) {
            if (e.relatedTarget && itemsSection.contains(e.relatedTarget)) return
            itemsSection.classList.remove("drag-over-valid")
        })

        itemsSection.addEventListener("drop", function(e) {
            let payload = DragDropState.activePayload
            if (!payload && e.dataTransfer) {
                try {
                    let raw = e.dataTransfer.getData("text/plain")
                    if (raw) payload = JSON.parse(raw)
                } catch (err) {
                    payload = null
                }
            }
            if (!payload || payload.source !== "slot" || payload.itemType !== "roller") return
            e.preventDefault()
            DragDropState.activePayload = null
            ClearDropTargetHighlights()
            ExecuteDropPayloadOnInventory(payload)
        })
    }

    document.addEventListener("pointermove", function(e) {
        if (!DragDropState.pendingPayload && !DragDropState.pointerDragging) return

        if (!DragDropState.pointerDragging && DragDropState.pendingPayload) {
            let dx = Math.abs(e.clientX - DragDropState.pointerStartX)
            let dy = Math.abs(e.clientY - DragDropState.pointerStartY)
            if (dx > 10 || dy > 10) {
                DragDropState.pointerDragging = true
                DragDropState.activePayload = DragDropState.pendingPayload
                if (DragDropState.pendingSourceEl) {
                    DragDropState.pendingSourceEl.classList.add("dragging-source")
                }
                let def = GetItemDefinition(DragDropState.activePayload.itemId)
                let ghost = document.createElement("div")
                ghost.className = "drag-pointer-ghost"
                ghost.textContent = (def ? def.icon + " " + def.name : "🎲 Item")
                document.body.appendChild(ghost)
                DragDropState.pointerGhostEl = ghost
            }
        }

        if (DragDropState.pointerDragging && DragDropState.pointerGhostEl) {
            e.preventDefault()
            DragDropState.pointerGhostEl.style.left = e.clientX + "px"
            DragDropState.pointerGhostEl.style.top = e.clientY + "px"

            ClearDropTargetHighlights()
            if (DragDropState.pendingSourceEl) {
                DragDropState.pendingSourceEl.classList.add("dragging-source")
            }

            let targetEl = document.elementFromPoint(e.clientX, e.clientY)
            if (targetEl && typeof targetEl.closest === "function") {
                let slotEl = targetEl.closest(".roller-slot[data-slot-index]")
                if (slotEl) {
                    let sIdx = Number(slotEl.getAttribute("data-slot-index"))
                    let isValid = CanDropPayloadOnSlot(DragDropState.activePayload, sIdx)
                    slotEl.classList.toggle("drag-over-valid", isValid)
                    slotEl.classList.toggle("drag-over-invalid", !isValid)
                }
            }
        }
    }, { passive: false })

    function finishPointerDrag(e) {
        if (DragDropState.pointerDragging && DragDropState.activePayload) {
            let payload = DragDropState.activePayload
            if (DragDropState.pointerGhostEl && DragDropState.pointerGhostEl.parentNode) {
                DragDropState.pointerGhostEl.parentNode.removeChild(DragDropState.pointerGhostEl)
            }
            DragDropState.pointerGhostEl = null

            let targetEl = (e && typeof e.clientX === "number")
                ? document.elementFromPoint(e.clientX, e.clientY)
                : null

            DragDropState.pointerDragging = false
            DragDropState.activePayload = null
            DragDropState.pendingPayload = null
            DragDropState.pendingSourceEl = null
            ClearDropTargetHighlights()

            if (targetEl && typeof targetEl.closest === "function") {
                let slotEl = targetEl.closest(".roller-slot[data-slot-index]")
                if (slotEl) {
                    let sIdx = Number(slotEl.getAttribute("data-slot-index"))
                    ExecuteDropPayloadOnSlot(payload, sIdx, slotEl)
                    return
                }
                let invDropEl = targetEl.closest("#inventory-items-section, #items-inventory-grid")
                if (invDropEl && payload.source === "slot") {
                    ExecuteDropPayloadOnInventory(payload)
                    return
                }
            }
        } else {
            DragDropState.pendingPayload = null
            DragDropState.pendingSourceEl = null
        }
    }

    document.addEventListener("pointerup", finishPointerDrag)
    document.addEventListener("pointercancel", finishPointerDrag)
}

function SwitchInventoryTab(tabName) {
    let targetTab = tabName === "items" ? "items" : "cards"
    PlayerData.inventoryTab = targetTab

    let tabCardsBtn = document.getElementById("inv-tab-cards")
    let tabItemsBtn = document.getElementById("inv-tab-items")
    let cardsSection = document.getElementById("inventory-cards-section")
    let itemsSection = document.getElementById("inventory-items-section")

    if (tabCardsBtn) {
        let isCards = targetTab === "cards"
        tabCardsBtn.classList.toggle("active", isCards)
        tabCardsBtn.setAttribute("aria-selected", isCards ? "true" : "false")
    }
    if (tabItemsBtn) {
        let isItems = targetTab === "items"
        tabItemsBtn.classList.toggle("active", isItems)
        tabItemsBtn.setAttribute("aria-selected", isItems ? "true" : "false")
    }
    if (cardsSection) {
        cardsSection.classList.toggle("hidden", targetTab !== "cards")
    }
    if (itemsSection) {
        itemsSection.classList.toggle("hidden", targetTab !== "items")
    }

    SaveGame()
}

function RenderEquippedRollers() {
    EnsureRollerSlotsNormalized()
    let slotsContainer = document.getElementById("equipped-rollers-slots")
    let slotsBadge = document.getElementById("roller-slots-badge")
    let equippedSummary = document.getElementById("equipped-rollers-summary")

    let equippedCount = GetEquippedRollers().length
    let maxSlots = PlayerData.maxRollerSlots

    if (slotsBadge) {
        slotsBadge.textContent = equippedCount + " / " + maxSlots + " Equipped"
    }
    if (equippedSummary) {
        equippedSummary.textContent = "⚙️ Equipped: " + equippedCount + " / " + maxSlots
    }

    if (!slotsContainer) return
    slotsContainer.innerHTML = ""

    for (let slotIndex = 0; slotIndex < maxSlots; slotIndex++) {
        let equippedInst = PlayerData.equippedRollers[slotIndex]
        let slotEl = document.createElement("div")
        slotEl.setAttribute("data-slot-index", String(slotIndex))

        if (equippedInst && equippedInst.type === "roller") {
            let rollerDef = GetRollerDefinition(equippedInst.itemId)
            let luckMult = rollerDef.luckMultiplier !== undefined ? rollerDef.luckMultiplier : 1
            let maxCards = rollerDef.maxCardsPerRoll !== undefined ? rollerDef.maxCardsPerRoll : 1
            let hasAuto = Boolean(equippedInst.hasAutoroller)
            let autoOn = Boolean(equippedInst.autoEnabled)

            slotEl.className = "roller-slot equipped" + (hasAuto ? (" has-autoroller" + (autoOn ? " auto-active" : " auto-paused")) : "")
            slotEl.innerHTML = `
                <div class="roller-slot-top">
                    <span class="roller-slot-number">Slot #${slotIndex + 1}</span>
                    <div class="roller-slot-badges">
                        ${hasAuto
                            ? `<span class="roller-auto-attached-badge" title="Autoroller permanently attached (cannot be removed)">🔒 🤖 Attached</span>`
                            : `<span class="roller-auto-drop-hint" title="Drag an Autoroller item here to automate this roller">Drop 🤖 Autoroller</span>`
                        }
                    </div>
                </div>
                <div class="roller-slot-main">
                    <div class="roller-slot-icon">${rollerDef.icon || "🎲"}</div>
                    <div class="roller-slot-info">
                        <div class="roller-slot-name">${rollerDef.name}</div>
                        <div class="roller-slot-stats">🍀 ×${FormatNumber(luckMult)} Luck • 🃏 Up to ${maxCards} ${maxCards === 1 ? "Card" : "Cards"}</div>
                    </div>
                </div>
                <div class="roller-slot-actions">
                    ${hasAuto
                        ? `<button type="button" class="roller-slot-auto-toggle ${autoOn ? "active" : ""}" title="Toggle Autoroller ON/OFF">
                            🤖 Auto: ${autoOn ? "ON" : "OFF"}
                        </button>`
                        : `<span class="roller-slot-manual-tag">🖐️ Manual Roll</span>`
                    }
                    <button type="button" class="roller-slot-unequip-btn" title="Unequip roller to Items Inventory">
                        Unequip
                    </button>
                </div>
            `

            let autoToggleBtn = slotEl.querySelector(".roller-slot-auto-toggle")
            if (autoToggleBtn) {
                autoToggleBtn.addEventListener("click", function(e) {
                    e.stopPropagation()
                    ToggleRollerAutomation(slotIndex)
                })
            }

            let unequipBtn = slotEl.querySelector(".roller-slot-unequip-btn")
            if (unequipBtn) {
                unequipBtn.addEventListener("click", function(e) {
                    e.stopPropagation()
                    UnequipRollerFromSlot(slotIndex)
                })
            }

            AttachDraggableItemEvents(slotEl, {
                source: "slot",
                fromSlotIndex: slotIndex,
                instanceId: equippedInst.instanceId,
                itemId: equippedInst.itemId,
                itemType: "roller",
            })
        } else {
            slotEl.className = "roller-slot empty"
            slotEl.innerHTML = `
                <div class="roller-slot-top">
                    <span class="roller-slot-number">Slot #${slotIndex + 1}</span>
                    <span class="roller-slot-empty-tag">Empty Slot</span>
                </div>
                <div class="roller-slot-main empty-main">
                    <div class="roller-slot-icon empty-icon">➕</div>
                    <div class="roller-slot-info">
                        <div class="roller-slot-name">No Roller Equipped</div>
                        <div class="roller-slot-stats">Drag a Roller from Items Inventory here</div>
                    </div>
                </div>
                <div class="roller-slot-actions">
                    <button type="button" class="roller-slot-open-items-btn">
                        🎒 Open Items Tab
                    </button>
                </div>
            `

            let openItemsBtn = slotEl.querySelector(".roller-slot-open-items-btn")
            if (openItemsBtn) {
                openItemsBtn.addEventListener("click", function(e) {
                    e.stopPropagation()
                    SwitchInventoryTab("items")
                    PlayGameSound("pop")
                })
            }
        }

        AttachSlotDropZoneEvents(slotEl, slotIndex)
        slotsContainer.appendChild(slotEl)
    }
}

function RenderItemsInventory() {
    let grid = document.getElementById("items-inventory-grid")
    let shopBar = document.getElementById("items-shop-bar")
    let itemsOwnedBadge = document.getElementById("items-owned-badge")
    let tabItemsCount = document.getElementById("inv-tab-items-count")

    let storedCount = Array.isArray(PlayerData.itemsInventory) ? PlayerData.itemsInventory.length : 0
    if (itemsOwnedBadge) {
        itemsOwnedBadge.textContent = "📦 Stored Items: " + storedCount
    }
    if (tabItemsCount) {
        tabItemsCount.textContent = String(storedCount)
    }

    if (shopBar) {
        let autorollerDef = GetItemDefinition((coreValues.rollers && coreValues.rollers.autorollerId) || "autoroller")
        let autoPrice = GetAutorollerPrice()
        let canAfford = PlayerData.diamonds >= autoPrice
        shopBar.innerHTML = `
            <div class="items-shop-banner">
                <div class="items-shop-banner-left">
                    <div class="items-shop-icon">${(autorollerDef && autorollerDef.icon) || "🤖"}</div>
                    <div class="items-shop-details">
                        <h3>Buy ${(autorollerDef && autorollerDef.name) || "Autoroller"} <span class="items-shop-perm-pill">Permanent Attachment</span></h3>
                        <p>${(autorollerDef && autorollerDef.description) || "Drag onto an equipped roller to automate it! Automation can be toggled ON/OFF, but cannot be removed once attached."}</p>
                    </div>
                </div>
                <button type="button" id="buy-autoroller-btn" class="items-buy-autoroller-btn ${canAfford ? "can-afford" : ""}" ${canAfford ? "" : "disabled"}>
                    <span>🤖 Buy Autoroller</span>
                    <span class="items-buy-price">💎 ${FormatNumber(autoPrice)}</span>
                </button>
            </div>
        `
        let buyBtn = shopBar.querySelector("#buy-autoroller-btn")
        if (buyBtn) {
            buyBtn.addEventListener("click", function() {
                BuyAutoroller(buyBtn)
            })
        }
    }

    if (!grid) return
    grid.innerHTML = ""

    if (storedCount <= 0) {
        let emptyEl = document.createElement("div")
        emptyEl.className = "inventory-empty items-inventory-empty"
        emptyEl.textContent = "🎒 Your Items Inventory is empty! Equipped rollers are active in the Roller Slots above. Drag an equipped roller here to unequip it, or buy an Autoroller for 1,000 💎."
        grid.appendChild(emptyEl)
        return
    }

    for (let [i, itemInst] of pairs(PlayerData.itemsInventory)) {
        if (!itemInst) continue
        let def = GetItemDefinition(itemInst.itemId)
        if (!def) continue

        let itemEl = document.createElement("div")
        itemEl.className = "item-inventory-card item-type-" + (itemInst.type || "roller")
        itemEl.setAttribute("data-instance-id", itemInst.instanceId)

        if (itemInst.type === "roller") {
            let rollerDef = GetRollerDefinition(itemInst.itemId)
            let luckMult = rollerDef.luckMultiplier !== undefined ? rollerDef.luckMultiplier : 1
            let maxCards = rollerDef.maxCardsPerRoll !== undefined ? rollerDef.maxCardsPerRoll : 1
            let hasAuto = Boolean(itemInst.hasAutoroller)

            itemEl.innerHTML = `
                <div class="item-card-top">
                    <div class="item-card-icon-wrap">${rollerDef.icon || "🎲"}</div>
                    <div class="item-card-title-wrap">
                        <span class="item-card-type-label">Roller Equipment</span>
                        <h3 class="item-card-name">${rollerDef.name}</h3>
                    </div>
                    <span class="item-drag-badge">✋ Drag to Equip</span>
                </div>
                <p class="item-card-desc">${rollerDef.description}</p>
                <div class="item-card-stats-row">
                    <span class="item-stat-pill">🍀 ×${FormatNumber(luckMult)} Luck</span>
                    <span class="item-stat-pill">🃏 Max ${maxCards} ${maxCards === 1 ? "Card" : "Cards"} / Roll</span>
                    ${hasAuto ? `<span class="item-stat-pill auto-pill">🔒 🤖 Autoroller Attached</span>` : ""}
                </div>
            `

            AttachDraggableItemEvents(itemEl, {
                source: "inventory",
                instanceId: itemInst.instanceId,
                itemId: itemInst.itemId,
                itemType: "roller",
            })
        } else {
            itemEl.innerHTML = `
                <div class="item-card-top">
                    <div class="item-card-icon-wrap attachment-icon">${def.icon || "🤖"}</div>
                    <div class="item-card-title-wrap">
                        <span class="item-card-type-label">Roller Attachment</span>
                        <h3 class="item-card-name">${def.name}</h3>
                    </div>
                    <span class="item-drag-badge attachment-drag">✋ Drag onto Roller</span>
                </div>
                <p class="item-card-desc">${def.description}</p>
                <div class="item-card-stats-row">
                    <span class="item-stat-pill auto-pill">⚡ Automates 1 Equipped Roller</span>
                    <span class="item-stat-pill warn-pill">🔒 Permanent Once Attached</span>
                </div>
            `

            AttachDraggableItemEvents(itemEl, {
                source: "inventory",
                instanceId: itemInst.instanceId,
                itemId: itemInst.itemId,
                itemType: "attachment",
            })
        }

        grid.appendChild(itemEl)
    }
}

function RenderInventory() {
    let grid = document.getElementById("inventory-grid")
    let uniqueCountEl = document.getElementById("unique-count")
    let rarestOwnedEl = document.getElementById("rarest-owned")
    let tabCardsCount = document.getElementById("inv-tab-cards-count")

    if (!grid) return
    grid.innerHTML = ""

    let ownedCardsData = GetDiscoveredCards()

    if (uniqueCountEl) {
        uniqueCountEl.textContent = "🃏 Discovered: " + ownedCardsData.length + " / " + CardsList.length
    }
    if (tabCardsCount) {
        tabCardsCount.textContent = String(ownedCardsData.length)
    }

    if (ownedCardsData.length > 0) {
        let rarestOwned = GetRarest(ownedCardsData)
        if (rarestOwnedEl) {
            rarestOwnedEl.textContent = "👑 Rarest: " + rarestOwned.name + " (" + FormatRarityText(rarestOwned.rarity) + ")"
        }
    } else {
        if (rarestOwnedEl) {
            rarestOwnedEl.textContent = "👑 Rarest: None"
        }
        let emptyMsg = document.createElement("div")
        emptyMsg.className = "inventory-empty"
        emptyMsg.textContent = "✨ No cards discovered yet! Equip your Basic Roller from the Items Inventory tab and hit Roll above!"
        grid.appendChild(emptyMsg)
        return
    }

    for (let [i, cardData] of pairs(ownedCardsData)) {
        let entry = PlayerData.inventory[cardData.name]
        let mutation = GetCardMutation(cardData)
        let frontTagsHtml = RenderCardTagsHTML(cardData, "front")
        let backTagsHtml = RenderCardTagsHTML(cardData, "back")

        let cardEl = document.createElement("div")
        cardEl.className = "inventory-card"

        cardEl.innerHTML = `
            <div class="card-flip-inner">
                <div class="card-face card-front">
                    <div class="card-image-container">
                        <img src="${FormatImagePath(cardData.image)}" alt="${cardData.name}" draggable="false">
                        <div class="card-holo-glare"></div>
                        ${frontTagsHtml ? `<div class="card-front-tags-overlay">${frontTagsHtml}</div>` : ""}
                        <div class="card-title-overlay">
                            <span class="card-front-name">${cardData.name}</span>
                        </div>
                    </div>
                </div>
                <div class="card-face card-back ${mutation.cssClass}">
                    ${backTagsHtml ? `<div class="card-back-tags">${backTagsHtml}</div>` : ""}
                    <div class="card-back-rarity">${FormatRarityText(cardData.rarity)}</div>
                    <div class="card-back-quantity">Owned: ${entry.count}</div>
                </div>
            </div>
            <div class="hold-progress"></div>
        `

        AttachCardInteractions(cardEl, function() {
            return cardData
        }, true)

        grid.appendChild(cardEl)
    }
}

function UpdateTopBarUI() {
    let rollCost = coreValues.roll.cost
    document.getElementById("token-count").textContent = FormatNumber(PlayerData.tokens) + " / " + FormatNumber(GetEffectiveTokenCapacity())
    document.getElementById("diamond-count").textContent = FormatNumber(PlayerData.diamonds)
    document.getElementById("rolls-count").textContent = PlayerData.totalRolls

    let reqXp = GetRequiredXp(PlayerData.level)
    let xpPercent = math.min(100, (PlayerData.xp / reqXp) * 100)
    document.getElementById("level-badge").textContent = "⭐ Level " + PlayerData.level
    document.getElementById("xp-text").textContent = FormatNumber(PlayerData.xp) + " / " + FormatNumber(reqXp) + " XP"
    document.getElementById("xp-fill").style.width = xpPercent + "%"

    let equippedRollers = GetEquippedRollers()
    let hasRoller = equippedRollers.length > 0

    let rollButton = document.getElementById("roll-button")
    let rollButtonText = document.getElementById("roll-button-text")
    let canRoll = hasRoller && PlayerData.tokens >= rollCost && !PlayerData.isCooldown

    rollButton.disabled = !canRoll
    if (!hasRoller) {
        rollButtonText.textContent = "⚠️ Equip a Roller"
    } else if (PlayerData.isCooldown) {
        rollButtonText.textContent = "⏳ Recharging..."
    } else {
        rollButtonText.textContent = "🎲 Roll (" + rollCost + " Token" + (rollCost > 1 ? "s" : "") + ")"
    }

    let autoRollBtn = document.getElementById("auto-roll-button")
    let hasAutomated = HasAutomatedEquippedRoller()
    let isAutoActive = HasActiveAutomatedRoller()
    SyncAutoRollStateFromRollers()

    if (!hasAutomated) {
        autoRollBtn.disabled = true
        autoRollBtn.classList.remove("active")
        autoRollBtn.textContent = "🤖 Auto-Roll: No Autoroller"
    } else {
        autoRollBtn.disabled = false
        autoRollBtn.classList.toggle("active", isAutoActive)
        autoRollBtn.textContent = "🤖 Auto-Roll: " + (isAutoActive ? "ON" : "OFF")
    }
}

function UpdateSortControlsUI() {
    let currentSort = PlayerData.sortBy || "default"
    let sortSelect = document.getElementById("card-sort-select")
    if (sortSelect && sortSelect.value !== currentSort) {
        sortSelect.value = currentSort
    }

    let sortButtons = document.querySelectorAll(".sort-pill-btn")
    for (let i = 0; i < sortButtons.length; i++) {
        let btn = sortButtons[i]
        let btnSort = btn.getAttribute("data-sort")
        if (btnSort === "base-rarity") {
            let isBaseActive = currentSort === "base-rarity" || currentSort === "base-rarity-desc"
            btn.classList.toggle("active", isBaseActive)
            if (currentSort === "base-rarity-desc") {
                btn.textContent = "🧬 Base Rarity (Rarest → Lowest)"
            } else {
                btn.textContent = "🧬 Base Rarity"
            }
        } else {
            btn.classList.toggle("active", btnSort === currentSort)
        }
    }
}

function SetCardSort(sortMode) {
    PlayerData.sortBy = sortMode || "default"
    UpdateSortControlsUI()
    SaveGame()
    PlayGameSound("pop")
    RenderInventory()
    RenderPressMenu()
    if (TagModalState.isOpen && TagModalState.currentTagId) {
        PopulateTagModal(TagModalState.currentTagId)
    }
}

function UpdateUI() {
    UpdateTopBarUI()
    UpdateSortControlsUI()
    SwitchInventoryTab(PlayerData.inventoryTab || "cards")
    RenderEquippedRollers()
    RenderItemsInventory()
    RenderSidebarPresses()
    RenderPressMenu()
    RenderShop()
    RenderInventory()
    if (TagModalState.isOpen && TagModalState.currentTagId) {
        PopulateTagModal(TagModalState.currentTagId)
    }
}

function ResetGameProgress() {
    localStorage.removeItem(SAVE_STORAGE_KEY)
    PlayerData.tokens = coreValues.tokens.starting
    PlayerData.diamonds = coreValues.diamonds.starting
    PlayerData.level = coreValues.level.starting
    PlayerData.xp = 0
    PlayerData.totalRolls = 0
    PlayerData.autoRollEnabled = false
    PlayerData.inventoryTab = "cards"
    PlayerData.pressPercent = (coreValues.presses && coreValues.presses.defaultPercentage) || 100
    PlayerData.pressKeepOne = Boolean(coreValues.presses && coreValues.presses.defaultKeepOne)
    PlayerData.lastRolledCard = null
    PlayerData.lastRolledCards = []
    PlayerData.inventory = {}
    PlayerData.upgrades = {
        luck: 0,
        tokenRate: 0,
        tokenCapacity: 0,
        xpMultiplier: 0,
        rollSpeed: 0,
        pressRevenue: 0,
    }
    InitializeDefaultRollerSystem()

    let stageWrap = document.getElementById("roll-stage-wrap")
    let display = document.getElementById("rolled-card-display")
    let banner = document.getElementById("roll-batch-banner")
    let status = document.getElementById("roll-status")
    let starburst = document.getElementById("roll-starburst")

    if (stageWrap) {
        stageWrap.classList.remove("multi-stage")
    }
    if (banner) {
        banner.innerHTML = ""
        banner.className = "roll-batch-banner hidden"
    }
    if (display) {
        display.className = "roll-showcase empty"
        display.innerHTML = `
            <div class="roll-image-frame">
                <img id="rolled-card-image" src="Assets/Cards/Cards.png" alt="Card Preview" draggable="false">
                <div class="card-holo-glare"></div>
                <div class="card-shine"></div>
                <div id="rolled-mutation-tag" class="card-front-tags-overlay hidden"></div>
                <div class="card-title-overlay">
                    <h2 id="rolled-card-name">Ready to Roll!</h2>
                </div>
                <div class="hold-progress"></div>
            </div>
        `
    }
    if (starburst) starburst.classList.remove("burst-active")
    if (status) {
        status.textContent = "Equip your Basic Roller from the Items tab to start rolling!"
        status.classList.remove("warn")
    }

    CloseCardModal()
    CloseTagModal()
    SaveGame()
    UpdateUI()
}

function Init() {
    CardsList = GenerateCardMutations(CardsList, MutationsList)
    LoadGame()
    ApplySettings()

    document.documentElement.style.setProperty("--long-press-duration", coreValues.interaction.longPressDuration + "s")
    document.documentElement.style.setProperty("--roll-cooldown", GetEffectiveRollCooldown() + "s")
    document.documentElement.style.setProperty("--slide-half-duration", (coreValues.interaction.slideDuration / 2) + "s")

    RenderSidebarMutationsLegend()
    SetupTagLongPressInteractions()
    SetupRollerDragAndDropInteractions()

    let invTabCards = document.getElementById("inv-tab-cards")
    let invTabItems = document.getElementById("inv-tab-items")
    if (invTabCards) {
        invTabCards.addEventListener("click", function() {
            SwitchInventoryTab("cards")
            PlayGameSound("pop")
        })
    }
    if (invTabItems) {
        invTabItems.addEventListener("click", function() {
            SwitchInventoryTab("items")
            PlayGameSound("pop")
        })
    }

    let brandLogo = document.getElementById("brand-logo")
    if (brandLogo) {
        brandLogo.addEventListener("click", function() {
            brandLogo.classList.remove("boing")
            void brandLogo.offsetWidth
            brandLogo.classList.add("boing")
            PlayGameSound("pop")
            SpawnParticleBurst(brandLogo, "normal")
        })
    }

    let rollButton = document.getElementById("roll-button")
    rollButton.addEventListener("click", HandleRollClick)

    let autoRollButton = document.getElementById("auto-roll-button")
    autoRollButton.addEventListener("click", ToggleAutoRoll)

    let navCards = document.getElementById("nav-cards")
    let navPresses = document.getElementById("nav-presses")
    let navShop = document.getElementById("nav-shop")
    let navSettings = document.getElementById("nav-settings")
    let sidebarCollapseBtn = document.getElementById("sidebar-collapse-btn")
    let sidebarOpenBtn = document.getElementById("sidebar-open-btn")
    let sidebarBackdrop = document.getElementById("sidebar-backdrop")

    navCards.addEventListener("click", function() {
        SwitchView("cards")
        CloseMobileSidebar()
    })
    navPresses.addEventListener("click", function() {
        SwitchView("presses")
    })
    if (navShop) {
        navShop.addEventListener("click", function() {
            SwitchView("shop")
            CloseMobileSidebar()
        })
    }
    if (navSettings) {
        navSettings.addEventListener("click", function() {
            SwitchView("settings")
            CloseMobileSidebar()
        })
    }

    sidebarCollapseBtn.addEventListener("click", ToggleSidebar)
    sidebarOpenBtn.addEventListener("click", ToggleSidebar)
    sidebarBackdrop.addEventListener("click", CloseMobileSidebar)

    let sortButtons = document.querySelectorAll(".sort-pill-btn")
    for (let i = 0; i < sortButtons.length; i++) {
        let btn = sortButtons[i]
        btn.addEventListener("click", function() {
            let targetSort = btn.getAttribute("data-sort")
            if (targetSort === "base-rarity") {
                if (PlayerData.sortBy === "base-rarity") {
                    SetCardSort("base-rarity-desc")
                } else {
                    SetCardSort("base-rarity")
                }
            } else {
                SetCardSort(targetSort)
            }
        })
    }

    let sortSelect = document.getElementById("card-sort-select")
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            SetCardSort(sortSelect.value)
        })
    }

    let quickThemeBtn = document.getElementById("quick-theme-btn")
    let themeDarkBtn = document.getElementById("theme-dark-btn")
    let themeLightBtn = document.getElementById("theme-light-btn")
    let particlesToggle = document.getElementById("setting-particles")
    let bouncyToggle = document.getElementById("setting-bouncy")
    let sfxToggle = document.getElementById("setting-sfx")
    let manualSaveBtn = document.getElementById("manual-save-btn")
    let resetSaveBtn = document.getElementById("reset-save-btn")
    let saveStatusText = document.getElementById("save-status-text")

    if (quickThemeBtn) {
        quickThemeBtn.addEventListener("click", ToggleTheme)
    }
    if (themeDarkBtn) {
        themeDarkBtn.addEventListener("click", function() {
            SetTheme("dark")
        })
    }
    if (themeLightBtn) {
        themeLightBtn.addEventListener("click", function() {
            SetTheme("light")
        })
    }
    if (particlesToggle) {
        particlesToggle.addEventListener("change", function() {
            PlayerData.settings.particles = particlesToggle.checked
            ApplySettings()
            SaveGame()
            if (PlayerData.settings.particles) {
                SpawnParticleBurst(particlesToggle.parentElement, "normal")
            }
        })
    }
    if (bouncyToggle) {
        bouncyToggle.addEventListener("change", function() {
            PlayerData.settings.bouncy = bouncyToggle.checked
            ApplySettings()
            SaveGame()
            PlayGameSound("pop")
        })
    }
    if (sfxToggle) {
        sfxToggle.addEventListener("change", function() {
            PlayerData.settings.sfx = sfxToggle.checked
            ApplySettings()
            SaveGame()
            if (PlayerData.settings.sfx) {
                PlayGameSound("pop")
            }
        })
    }
    if (manualSaveBtn) {
        manualSaveBtn.addEventListener("click", function() {
            SaveGame()
            PlayGameSound("pop")
            SpawnParticleBurst(manualSaveBtn, "normal")
            if (saveStatusText) {
                saveStatusText.textContent = "✅ Progress saved at " + new Date().toLocaleTimeString() + "!"
            }
        })
    }
    if (resetSaveBtn) {
        let confirmResetTimer = null
        resetSaveBtn.addEventListener("click", function() {
            if (!resetSaveBtn.classList.contains("confirming")) {
                resetSaveBtn.classList.add("confirming")
                resetSaveBtn.textContent = "⚠️ Click Again to Confirm!"
                confirmResetTimer = setTimeout(function() {
                    resetSaveBtn.classList.remove("confirming")
                    resetSaveBtn.textContent = "🗑️ Reset Progress"
                }, 3500)
            } else {
                if (confirmResetTimer) clearTimeout(confirmResetTimer)
                resetSaveBtn.classList.remove("confirming")
                resetSaveBtn.textContent = "🗑️ Reset Progress"
                ResetGameProgress()
                PlayGameSound("pop")
                if (saveStatusText) {
                    saveStatusText.textContent = "🧹 Progress has been reset to a fresh start!"
                }
            }
        })
    }

    if (Array.isArray(PlayerData.lastRolledCards) && PlayerData.lastRolledCards.length > 0) {
        RenderRolledCards(PlayerData.lastRolledCards, GetRollBatchXp(PlayerData.lastRolledCards))
    } else if (PlayerData.lastRolledCard) {
        RenderRolledCards([PlayerData.lastRolledCard], GetCardXp(PlayerData.lastRolledCard))
    }

    let modalClose = document.getElementById("modal-close")
    let modalOverlay = document.getElementById("card-modal")
    let modalPrev = document.getElementById("modal-prev")
    let modalNext = document.getElementById("modal-next")
    let modalViewport = document.getElementById("modal-slide-viewport")

    modalClose.addEventListener("click", CloseCardModal)
    modalPrev.addEventListener("click", function() {
        NavigateModal(-1)
    })
    modalNext.addEventListener("click", function() {
        NavigateModal(1)
    })

    modalOverlay.addEventListener("click", function(e) {
        if (e.target === modalOverlay || e.target.classList.contains("modal-wrapper")) {
            CloseCardModal()
        }
    })

    let tagModalClose = document.getElementById("tag-modal-close")
    let tagModalOverlay = document.getElementById("tag-modal")
    if (tagModalClose) {
        tagModalClose.addEventListener("click", CloseTagModal)
    }
    if (tagModalOverlay) {
        tagModalOverlay.addEventListener("click", function(e) {
            if (e.target === tagModalOverlay || e.target.classList.contains("modal-wrapper")) {
                CloseTagModal()
            }
        })
    }

    let swipeStartX = 0
    modalViewport.addEventListener("pointerdown", function(e) {
        if (e.target && typeof e.target.closest === "function" && e.target.closest('.card-tag-pill:not([data-tag-type="mutation"])')) {
            return
        }
        swipeStartX = e.clientX
    })
    modalViewport.addEventListener("pointerup", function(e) {
        if (e.target && typeof e.target.closest === "function" && e.target.closest('.card-tag-pill:not([data-tag-type="mutation"])')) {
            return
        }
        let diffX = e.clientX - swipeStartX
        if (Math.abs(diffX) > 45) {
            NavigateModal(diffX < 0 ? 1 : -1)
        }
    })

    window.addEventListener("keydown", function(e) {
        if (TagModalState.isOpen) {
            if (e.key === "Escape") {
                CloseTagModal()
            }
            return
        }
        if (!ModalState.isOpen) return
        if (e.key === "Escape") {
            CloseCardModal()
        } else if (e.key === "ArrowLeft") {
            NavigateModal(-1)
        } else if (e.key === "ArrowRight") {
            NavigateModal(1)
        }
    })

    window.addEventListener("beforeunload", SaveGame)

    UpdateUI()

    setInterval(function() {
        let delta = coreValues.tokens.drop.interval
        UpdateTokenGeneration(delta)
    }, coreValues.tokens.drop.interval * 1000)

    setInterval(function() {
        if (
            HasActiveAutomatedRoller() &&
            !PlayerData.isCooldown &&
            PlayerData.tokens >= coreValues.roll.cost
        ) {
            HandleRollClick(true)
        }
    }, coreValues.roll.autoRoll.checkInterval * 1000)
}

window.addEventListener("DOMContentLoaded", Init)
