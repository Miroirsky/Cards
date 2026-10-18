# Cards

## Project Goal
**Cards** is a responsive web-based card-rolling, mutation-hunting, leveling, and collection game where players spend tokens to roll for cards and their mutated variants, earn XP and diamonds, unlock auto-roll, and process cards in the Presses menu via a collapsible left sidebar. All configurable parameters reside in [`Data.js`](file:///G:/AI%20Projects/Cards/Data.js) following the nested structure and conventions of [`Exemple.lua`](file:///G:/AI%20Projects/Cards/exemple.lua).

---

## Features
- **Left Sidebar Navigation**: Collapsible ChatGPT-style left sidebar switching between **Roll & Inventory** and the dedicated **Presses** view (with direct quick-links to **Compressor**, **Decompressor**, and **Diamond Press**).
- **Roll Mutations (`MutationsList` & `CardsList`)**:
  - Every card in [`Data.js`](file:///G:/AI%20Projects/Cards/Data.js) includes its base version and 6 mutation variants in the roll pool with multiplied rarities:
    - **Bronze** (`2×`) — Metallic bronze card back
    - **Silver** (`3×`) — Brushed metallic silver card back
    - **Gold** (`5×`) — Radiant metallic gold card back
    - **Diamond** (`10×`) — Crystalline cyan/blue diamond card back
    - **Rainbow** (`100×`) — Animated prismatic rainbow card back
    - **Shiny** (`1000×`) — Shimmering starlight/gold iridescent card back
  - Base cards use a plain white back (`#ffffff`), while each mutation visually transforms the flipped card back to match its material/color.
- **Levels, XP & Diamonds**:
  - Rolling any card or mutation variant grants XP equal to `sqrt(card rarity)` (`GetCardXp`).
  - Level 1 requires `10` XP (`coreValues.level.baseXp`), and each next level requires `1.5×` (`coreValues.level.xpMultiplier`) the previous level's XP.
  - Gain `10 × current level` diamonds per level-up.
- **Auto-Roll**: Unlocks at Level `10` (`coreValues.roll.autoRoll.unlockLevel`) with a toggle button.
- **Presses Menu (`PressesList`)**:
  - **Compressor**: *Coming Soon*
  - **Decompressor**: *Coming Soon*
  - **Diamond Press**: Sell owned cards or mutation variants to gain `rarity^0.6666666667` diamonds per card.
- **Discovered-Only 2:1 Card Inventory & Detail Modal**:
  - Undiscovered cards are completely hidden.
  - Discovered cards are `2000×1000` (`2:1` aspect ratio) cards with the title overlaid directly on the image.
  - Hold a card (`coreValues.interaction.longPressDuration`) to open the detail modal with left/right sliding arrow navigation.
