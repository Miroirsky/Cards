-- Remember, all code is this file are just exemples so they only tell you the logic but you don't have to copy directly the code, and this is made like a Roblox script style

local CardsList = {
    {name = "Void", rarity = 0, image = "Assets\Cards\Infinity.png"},
    {name = "Grass", rarity = 2, image = "Assets\Cards\Grass.png"},
    {name = "Bush", rarity = 3, image = "Assets\Cards\Bush.png"},
    {name = "Tree", rarity = 4, image = "Assets\Cards\Tree.png"},
    {name = "Burger", rarity = 5, image = "Assets\Cards\Burger.png", tags = ["Caloric"]},
    {name = "Sugar", rarity = 7, image = "Assets\Cards\Sugar.png", tags = ["Sweet"]},
    {name = "Beach", rarity = 8, image = "Assets\Cards\Beach.png"},
    {name = "Sky", rarity = 15, image = "Assets\Cards\Sky.png"},
    {name = "Snow Mountains", rarity = 20, image = "Assets\Cards\Snow Mountains.png"},
    {name = "Sugar Cube", rarity = 25, image = "Assets\Cards\Sugar Cube.png", tags = ["Ai", "Sweet"]},
    {name = "Sword", rarity = 35, image = "Assets\Cards\Sword.png", tags = ["Sharp"]},
    {name = "Pasta", rarity = 50, image = "Assets\Cards\Pasta.png", tags = ["Ai", "Caloric"]},
    {name = "Overworld", rarity = 62.5, image = "Assets\Cards\Overworld.png"},
    {name = "Mars", rarity = 75, image = "Assets\Cards\Mars.png"},
    {name = "Balls", rarity = 100, image = "Assets\Cards\Balls.png"},
    {name = "Poke Balls", rarity = 150, image = "Assets\Cards\Poke Balls.png"},
    {name = "Bones", rarity = 200, image = "Assets\Cards\Bones.png"},
    {name = "Earth", rarity = 250, image = "Assets\Cards\Earth.png"},
    {name = "Ice Spikes", rarity = 375, image = "Assets\Cards\Ice Spikes.png", tags = ["Sharp"]},
    {name = "Apple", rarity = 400, image = "Assets\Cards\Apple.png"},
    {name = "Electricity", rarity = 500, image = "Assets\Cards\Electricity.png"},
    {name = "Coal", rarity = 625, image = "Assets\Cards\Coal.png"},
    {name = "Evil", rarity = 666, image = "Assets\Cards\Evil.png"},
    {name = "Lava", rarity = 750, image = "Assets\Cards\Lava.png", tags = ["Ai", "Hot"]},
}

local coreValues = {
    luck = 1,
    tokens = {drop = {rate = 10, ammount = {min = 1, max = 3}}, capacity = 10}
}

function GetRarest(list)
    local rarestCard
    for i, cardData in pairs(list) do
        if rarestCard then
            if cardData.rarity > rarestCard.rarity then
                rarestCard = cardData
            end
        else
            rarestCard = cardData
        end
    end
    return rarestCard
end
function GetCommonest(list)
    local commonestCard
    for i, cardData in pairs(list) do
        if commonestCard then
            if cardData.rarity < commonestCard.rarity then
                commonestCard = cardData
            end
        else
            commonestCard = cardData
        end
    end
    return commonestCard
end
function GetCardByName(name: string)
    for i, cardData in pairs(list) do
        if cardData.name == name then return cardData end
    end
end

function Roll(list, luck)
    luck = luck or 1

    luck = math.min(luck, GetRarest(list).rarity)

    local rolledCards = {}

    for i, cardData in pairs(list) do
        if cardData.name == "Void" then continue end

        local chance = cardData.rarity

        chance /= luck

        if chance > 1 then
            chance = 1 / chance
        end

        if math.random() * chance < 1 then
            table.insert(rolledCards, cardData)
        end
    end

    if #rolledCards <= 0 then
        rolledCards = {GetCardByName("Void")}
    end

    return rolledCards
end
