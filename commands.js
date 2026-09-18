/* ==========================================================================
   MC Command Hub — commands.js
   All command data for Minecraft Java Edition 1.21.11 (vanilla).

   Everything in this file is plain data, loaded with a classic <script> tag
   so the site also works when index.html is opened straight from disk.

   Placeholders inside command templates (replaced live by script.js):
     {T}     → the global player selector (@s, @p, @a, @r or a player name)
     {NAME}  → the custom player name, or the literal "PlayerName"
     {TOOL}  → Fortune III / Silk Touch (toggle in the Tools category)
     {key}   → the current value of a card dropdown (see `opts` on a card)

   Card fields:
     id      unique, stable id (used for favorites)
     cat     category id (see CATEGORIES)
     group   optional sub-heading id (see GROUPS)
     title / desc / note / warn   localised text  T(en, ru, de)
     cmds    array of command strings or { c: "command", label: T(...) }
     opts    dropdowns: [{ key, label, values: ["id", ...] | [[value, label], ...] }]
     single  true → command accepts only ONE target; with @a it is wrapped
             in "execute as @a run ..." automatically
     console true → typed in the Aternos console (no slash)
   ========================================================================== */

/** Localised text helper: T(English, Russian, German) */
const T = (en, ru, de) => ({ en, ru, de });

/* ---------- Categories (tab order) ---------- */
const CATEGORIES = [
  { id: "reference", icon: "📖", name: T("Command reference", "Справочник команд", "Befehlsreferenz") },
  { id: "kits",     icon: "🎒", name: T("Kits", "Наборы", "Kits") },
  { id: "pvp",      icon: "⚔️", name: T("PvP & arena", "PvP и арена", "PvP & Arena") },
  { id: "op",       icon: "💀", name: T("Overpowered", "Имба", "Overpowered") },
  { id: "weapons",  icon: "🗡️", name: T("Weapons", "Оружие", "Waffen") },
  { id: "armor",    icon: "🛡️", name: T("Armor", "Броня", "Rüstung") },
  { id: "tools",    icon: "⛏️", name: T("Tools", "Инструменты", "Werkzeuge") },
  { id: "movement", icon: "🪽", name: T("Movement", "Передвижение", "Bewegung") },
  { id: "effects",  icon: "🧪", name: T("Effects", "Эффекты", "Effekte") },
  { id: "player",   icon: "🧍", name: T("Player", "Игрок", "Spieler") },
  { id: "world",    icon: "🌍", name: T("World", "Мир", "Welt") },
  { id: "building", icon: "🧱", name: T("Building", "Строительство", "Bauen") },
  { id: "entities", icon: "👾", name: T("Entities", "Сущности", "Entitäten") },
  { id: "bosses",   icon: "🐉", name: T("Bosses", "Боссы", "Bosse") },
  { id: "display",  icon: "💬", name: T("Display & sound", "Экран и звук", "Anzeige & Ton") },
  { id: "unusual",  icon: "🧬", name: T("Unusual & advanced", "Необычное и продвинутое", "Ungewöhnlich & fortgeschritten") },
  { id: "fun",      icon: "🎉", name: T("Fun", "Веселье", "Spaß") },
];

/* Short intro shown under a category heading */
const CATEGORY_INTRO = {
  reference: T(
    "Every command a command block can run (permission level 2 or lower) — 63 of them, with working syntax. Commands that need level 3+ are listed at the end and simply fail in a block.",
    "Все команды, которые может выполнить командный блок (уровень прав 2 и ниже) — 63 штуки, с рабочим синтаксисом. Команды уровня 3+ перечислены в конце: в блоке они просто не сработают.",
    "Alle Befehle, die ein Befehlsblock ausführen kann (Berechtigungsstufe 2 oder niedriger) — 63 Stück, mit funktionierender Syntax. Befehle ab Stufe 3 stehen am Ende: Im Block schlagen sie einfach fehl."
  ),
  kits: T(
    "Full loadouts as one command list. Paste one command per chain block, or use the single-command kit chest.",
    "Готовые комплекты одним списком. По одной команде на цепной блок — или один командный сундук.",
    "Komplette Ausrüstungen als Befehlsliste. Ein Befehl pro Kettenblock — oder die Kit-Truhe mit nur einem Befehl."
  ),
  op: T(
    "Deliberately broken stuff: one-hit weapons, immortality, 1000-block reach. Great for testing and creative servers, unfair everywhere else.",
    "Намеренно сломанные вещи: оружие с одного удара, бессмертие, досягаемость в 1000 блоков. Отлично для тестов и креативных серверов, нечестно везде ещё.",
    "Absichtlich kaputtes Zeug: Ein-Schlag-Waffen, Unsterblichkeit, riesige Reichweite. Super zum Testen und für Kreativserver, überall sonst unfair."
  ),
  unusual: T(
    "Tricks most players never see: entity stacking, scheduled loops, loot tables, forced chunks, scoreboard logic.",
    "Приёмы, которых почти никто не видит: стопки сущностей, отложенные циклы, лут-таблицы, принудительные чанки, логика на счётчиках.",
    "Tricks, die kaum jemand kennt: Entity-Stapel, geplante Schleifen, Loot-Tabellen, erzwungene Chunks, Scoreboard-Logik."
  ),
  pvp: T(
    "Weapons, potions and everything for running a match: scoreboards, teams, countdowns, shrinking borders.",
    "Оружие, зелья и всё для проведения матча: счётчики, команды, отсчёт, сужающаяся граница.",
    "Waffen, Tränke und alles für ein Match: Punktetafeln, Teams, Countdown, schrumpfende Grenze."
  ),
  effects: T(
    "The number after “infinite” is the amplifier: 0 = level I, 1 = level II … “true” hides the particles.",
    "Число после «infinite» — усилитель: 0 = уровень I, 1 = уровень II … «true» скрывает частицы.",
    "Die Zahl nach „infinite“ ist der Verstärker: 0 = Stufe I, 1 = Stufe II … „true“ versteckt die Partikel."
  ),
  world: T(
    "Press F3 in game to see your coordinates (the “XYZ” line).",
    "Нажмите F3 в игре, чтобы увидеть свои координаты (строка «XYZ»).",
    "Drücke im Spiel F3, um deine Koordinaten zu sehen (Zeile „XYZ“)."
  ),
  building: T(
    "Commands using ~ are relative to where you stand (~ ~-1 ~ = the block under your feet). Fill and clone are limited to 32,768 blocks.",
    "Команды с ~ считаются от вашей позиции (~ ~-1 ~ = блок под ногами). Fill и clone ограничены 32 768 блоками.",
    "Befehle mit ~ beziehen sich auf deine Position (~ ~-1 ~ = Block unter deinen Füßen). Fill und Clone sind auf 32.768 Blöcke begrenzt."
  ),
};

/* Sub-headings inside a category */
const GROUPS = {
  ranged:     T("Ranged weapons", "Дальний бой", "Fernkampfwaffen"),
  consumable: T("Healing & food", "Лечение и еда", "Heilung & Essen"),
  potions:    T("Potions", "Зелья", "Tränke"),
  crystal:    T("Crystal & anchor PvP", "Кристаллы и якоря", "Kristall- & Anker-PvP"),
  utility:    T("Utility blocks", "Полезные блоки", "Nützliche Blöcke"),
  arena:      T("Arena & match", "Арена и матч", "Arena & Match"),
  rules:      T("Match game rules", "Игровые правила для матча", "Spielregeln fürs Match"),
  time:       T("Time & weather", "Время и погода", "Zeit & Wetter"),
  gamerules:  T("Game rules", "Игровые правила", "Spielregeln"),
  fill:       T("Fill & locate", "Заполнение и поиск", "Füllen & Suchen"),
  attributes: T("Attributes", "Атрибуты", "Attribute"),
  moderation: T("Moderation", "Модерация", "Moderation"),
  chat:       T("Chat & announcements", "Чат и объявления", "Chat & Ansagen"),
};

/* ---------- Game rule helper (1.21.11 renamed all game rules) ---------- */
const GR_NEW = T("1.21.11+ (new name)", "1.21.11+ (новое имя)", "1.21.11+ (neuer Name)");
const GR_OLD = T("Before 1.21.11 (old name)", "До 1.21.11 (старое имя)", "Vor 1.21.11 (alter Name)");
const GR_NOTE = T(
  "Minecraft 1.21.11 renamed the game rules (e.g. doDaylightCycle → advance_time). Not sure which name your server accepts? Type /gamerule, a space, then press Tab to see the valid names.",
  "В Minecraft 1.21.11 игровые правила переименованы (например, doDaylightCycle → advance_time). Не уверены, какое имя принимает сервер? Введите /gamerule, пробел и нажмите Tab — игра покажет верные имена.",
  "Minecraft 1.21.11 hat die Spielregeln umbenannt (z. B. doDaylightCycle → advance_time). Unsicher, welcher Name auf deinem Server gilt? Tippe /gamerule, ein Leerzeichen und drücke Tab, um die gültigen Namen zu sehen."
);

/** Returns command lines for a game rule: new 1.21.11 name first, old name second. */
function grLines(newName, oldName, value, oldLabel) {
  const lines = [{ c: `gamerule ${newName} ${value}`, label: GR_NEW }];
  if (oldName) lines.push({ c: `gamerule ${oldName} ${value}`, label: oldLabel || GR_OLD });
  return lines;
}

/* ---------- Reusable enchantment lists (1.21.5+ component format) ---------- */
const ENC = {
  helmet:     '"minecraft:protection":4,"minecraft:respiration":3,"minecraft:aqua_affinity":1,"minecraft:thorns":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  chestplate: '"minecraft:protection":4,"minecraft:thorns":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  leggings:   '"minecraft:protection":4,"minecraft:swift_sneak":3,"minecraft:thorns":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  boots:      '"minecraft:protection":4,"minecraft:feather_falling":4,"minecraft:depth_strider":3,"minecraft:soul_speed":3,"minecraft:thorns":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  sword:      '"minecraft:sharpness":5,"minecraft:sweeping_edge":3,"minecraft:fire_aspect":2,"minecraft:knockback":2,"minecraft:looting":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  mace:       '"minecraft:wind_burst":3,"minecraft:density":5,"minecraft:unbreaking":3,"minecraft:mending":1',
  maceBreach: '"minecraft:breach":4,"minecraft:wind_burst":3,"minecraft:fire_aspect":2,"minecraft:unbreaking":3,"minecraft:mending":1',
  spear:      '"minecraft:lunge":3',
  spearMax:   '"minecraft:lunge":3,"minecraft:sharpness":5,"minecraft:fire_aspect":2,"minecraft:looting":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  basic:      '"minecraft:unbreaking":3,"minecraft:mending":1',
  bow:        '"minecraft:power":5,"minecraft:punch":2,"minecraft:flame":1,"minecraft:infinity":1,"minecraft:unbreaking":3',
  crossbow:   '"minecraft:quick_charge":3,"minecraft:multishot":1,"minecraft:unbreaking":3,"minecraft:mending":1',
  riptide:    '"minecraft:riptide":3,"minecraft:impaling":5,"minecraft:unbreaking":3,"minecraft:mending":1',
  loyalty:    '"minecraft:loyalty":3,"minecraft:channeling":1,"minecraft:impaling":5,"minecraft:unbreaking":3,"minecraft:mending":1',
  axePvp:     '"minecraft:sharpness":5,"minecraft:efficiency":5,"minecraft:unbreaking":3,"minecraft:mending":1',
  pickaxe:    '"minecraft:efficiency":5,"minecraft:unbreaking":3,"minecraft:mending":1',
  rod:        '"minecraft:luck_of_the_sea":3,"minecraft:lure":3,"minecraft:unbreaking":3,"minecraft:mending":1',
  shears:     '"minecraft:efficiency":5,"minecraft:unbreaking":3,"minecraft:mending":1',
  uhcArmor:   '"minecraft:protection":2,"minecraft:unbreaking":3',
  uhcSword:   '"minecraft:sharpness":3,"minecraft:unbreaking":3',
  uhcBow:     '"minecraft:power":3,"minecraft:unbreaking":3',
};

/* Tool enchantment toggle used by {TOOL} */
const TOOL_ENCH = {
  fortune: '"minecraft:fortune":3',
  silk:    '"minecraft:silk_touch":1',
};

/* ---------- Shared dropdown lists ---------- */
const MOB_TYPES = [
  "zombie", "husk", "drowned", "skeleton", "stray", "bogged", "parched", "creeper",
  "spider", "cave_spider", "enderman", "phantom", "witch", "slime", "magma_cube",
  "blaze", "ghast", "zombified_piglin", "piglin", "piglin_brute", "hoglin", "zoglin",
  "wither_skeleton", "pillager", "vindicator", "evoker", "vex", "ravager", "breeze",
  "guardian", "silverfish", "endermite", "shulker", "zombie_villager", "zombie_horse",
  "zombie_nautilus", "camel_husk", "creaking",
];

const POTION_IDS = [
  "strong_healing", "strong_strength", "strong_swiftness", "long_fire_resistance",
  "strong_turtle_master", "strong_regeneration", "long_invisibility", "strong_leaping",
  "long_slow_falling", "strong_poison", "strong_harming", "long_slowness", "long_weakness",
];

const STRUCTURES = [
  "#minecraft:village", "minecraft:ancient_city", "minecraft:trial_chambers",
  "minecraft:stronghold", "minecraft:fortress", "minecraft:bastion_remnant",
  "minecraft:end_city", "minecraft:monument", "minecraft:mansion", "minecraft:trail_ruins",
  "minecraft:desert_pyramid", "minecraft:jungle_pyramid", "minecraft:pillager_outpost",
  "minecraft:shipwreck", "minecraft:buried_treasure", "minecraft:igloo",
  "minecraft:swamp_hut", "minecraft:mineshaft", "minecraft:ruined_portal",
];

const BIOMES = [
  "cherry_grove", "pale_garden", "mushroom_fields", "deep_dark", "jungle", "bamboo_jungle",
  "badlands", "ice_spikes", "desert", "mangrove_swamp", "flower_forest", "meadow",
  "dark_forest", "snowy_plains", "savanna", "lush_caves", "dripstone_caves",
  "sunflower_plains", "warm_ocean",
];

/* Dye colors as integers (used by dyed_color and fireworks) */
const DYE_COLORS = [
  [String(0xB02E26), T("Red", "Красный", "Rot")],
  [String(0x3C44AA), T("Blue", "Синий", "Blau")],
  [String(0x5E7C16), T("Green", "Зелёный", "Grün")],
  [String(0xFED83D), T("Yellow", "Жёлтый", "Gelb")],
  [String(0x80C71F), T("Lime", "Лаймовый", "Hellgrün")],
  [String(0xF9801D), T("Orange", "Оранжевый", "Orange")],
  [String(0x8932B8), T("Purple", "Фиолетовый", "Violett")],
  [String(0xF9FFFE), T("White", "Белый", "Weiß")],
  [String(0x1D1D21), T("Black", "Чёрный", "Schwarz")],
];

const TRIM_MATERIALS = ["amethyst", "copper", "diamond", "emerald", "gold", "iron", "lapis", "netherite", "quartz", "redstone", "resin"];
const TRIM_PATTERNS = ["bolt", "coast", "dune", "eye", "flow", "host", "raiser", "rib", "sentry", "shaper", "silence", "snout", "spire", "tide", "vex", "ward", "wayfinder", "wild"];

/* ==========================================================================
   COMMAND CARDS
   ========================================================================== */
const COMMANDS = [

/* ───────────────────────────── PVP ───────────────────────────── */
/* Ranged weapons */
{
  id: "pvp-bow", cat: "pvp", group: "ranged",
  title: T("Bow (Power V, Infinity)", "Лук (Сила V, Бесконечность)", "Bogen (Stärke V, Unendlichkeit)"),
  desc: T(
    "Infinity needs just one arrow in your inventory.",
    "С Бесконечностью нужна всего одна стрела в инвентаре.",
    "Mit Unendlichkeit reicht ein einziger Pfeil im Inventar."
  ),
  cmds: [`give {T} minecraft:bow[enchantments={${ENC.bow}}]`, "give {T} minecraft:arrow 1"],
},
{
  id: "pvp-crossbow", cat: "pvp", group: "ranged",
  title: T("Crossbow (Quick Charge III, Multishot)", "Арбалет (Быстрая перезарядка III, Тройной выстрел)", "Armbrust (Schnellladen III, Mehrfachschuss)"),
  desc: T("Comes with 64 arrows.", "С 64 стрелами.", "Mit 64 Pfeilen."),
  cmds: [`give {T} minecraft:crossbow[enchantments={${ENC.crossbow}}]`, "give {T} minecraft:arrow 64"],
},
{
  id: "pvp-trident-riptide", cat: "pvp", group: "ranged",
  title: T("Trident (Riptide III)", "Трезубец (Тягун III)", "Dreizack (Sog III)"),
  desc: T(
    "Launches you through the air — only in water or rain.",
    "Запускает вас в воздух — только в воде или под дождём.",
    "Schleudert dich durch die Luft — nur im Wasser oder bei Regen."
  ),
  cmds: [`give {T} minecraft:trident[enchantments={${ENC.riptide}}]`],
},
{
  id: "pvp-trident-loyalty", cat: "pvp", group: "ranged",
  title: T("Trident (Loyalty III, Channeling)", "Трезубец (Верность III, Громовержец)", "Dreizack (Treue III, Entladung)"),
  desc: T(
    "Flies back after a throw. Channeling calls lightning during thunderstorms.",
    "Возвращается после броска. Громовержец вызывает молнию во время грозы.",
    "Kehrt nach dem Wurf zurück. Entladung ruft bei Gewitter Blitze herbei."
  ),
  cmds: [`give {T} minecraft:trident[enchantments={${ENC.loyalty}}]`],
  note: T(
    "Riptide can't be combined with Loyalty or Channeling — that's why there are two tridents.",
    "Тягун несовместим с Верностью и Громовержцем — поэтому здесь два трезубца.",
    "Sog ist nicht mit Treue oder Entladung kombinierbar — deshalb gibt es zwei Dreizacke."
  ),
},
{
  id: "pvp-tipped", cat: "pvp", group: "ranged",
  title: T("Tipped arrows", "Стрелы с эффектом", "Getränkte Pfeile"),
  desc: T(
    "Arrows that apply a potion effect on hit.",
    "Стрелы, которые накладывают эффект зелья при попадании.",
    "Pfeile, die beim Treffer einen Trankeffekt auslösen."
  ),
  opts: [{ key: "pot", label: T("Potion", "Зелье", "Trank"),
    values: ["strong_harming", "strong_poison", "long_slowness", "long_weakness", "strong_slowness"] }],
  cmds: ['give {T} minecraft:tipped_arrow[potion_contents={potion:"minecraft:{pot}"}] 64'],
  note: T("Infinity doesn't work with tipped arrows.", "Бесконечность не действует на стрелы с эффектом.", "Unendlichkeit wirkt nicht bei getränkten Pfeilen."),
},
{
  id: "pvp-spectral", cat: "pvp", group: "ranged",
  title: T("Spectral arrows", "Спектральные стрелы", "Spektralpfeile"),
  desc: T(
    "Hit players glow and can be seen through walls.",
    "Поражённые игроки светятся и видны сквозь стены.",
    "Getroffene Spieler leuchten und sind durch Wände sichtbar."
  ),
  cmds: ["give {T} minecraft:spectral_arrow 64"],
},
{
  id: "pvp-rod", cat: "pvp", group: "ranged",
  title: T("Fishing rod", "Удочка", "Angel"),
  desc: T(
    "Hook opponents and pull them towards you.",
    "Цепляйте противников и притягивайте к себе.",
    "Gegner einhaken und zu dir ziehen."
  ),
  cmds: [`give {T} minecraft:fishing_rod[enchantments={${ENC.basic}}]`],
},

/* Healing & food */
{
  id: "pvp-totem", cat: "pvp", group: "consumable",
  title: T("Totem of Undying", "Тотем бессмертия", "Totem der Unsterblichkeit"),
  desc: T(
    "Saves you from death once. Hold it in your offhand (F key). Totems don't stack — use a bigger number to get several.",
    "Один раз спасает от смерти. Держите во второй руке (клавиша F). Тотемы не складываются — укажите число больше, чтобы получить несколько.",
    "Rettet dich einmal vor dem Tod. In der Nebenhand halten (Taste F). Totems stapeln nicht — größere Zahl für mehrere."
  ),
  cmds: [
    "give {T} minecraft:totem_of_undying 1",
    { c: "item replace entity {T} weapon.offhand with minecraft:totem_of_undying",
      label: T("Put it straight into the offhand", "Сразу во вторую руку", "Direkt in die Nebenhand") },
  ],
},
{
  id: "pvp-gapple", cat: "pvp", group: "consumable",
  title: T("Golden apples", "Золотые яблоки", "Goldene Äpfel"),
  desc: T("Absorption + Regeneration II.", "Поглощение + Регенерация II.", "Absorption + Regeneration II."),
  cmds: ["give {T} minecraft:golden_apple 64"],
},
{
  id: "pvp-egapple", cat: "pvp", group: "consumable",
  title: T("Enchanted golden apples", "Зачарованные золотые яблоки", "Verzauberte goldene Äpfel"),
  desc: T(
    "Absorption IV, Regeneration II, Resistance and Fire Resistance.",
    "Поглощение IV, Регенерация II, Сопротивление и Огнестойкость.",
    "Absorption IV, Regeneration II, Resistenz und Feuerresistenz."
  ),
  cmds: ["give {T} minecraft:enchanted_golden_apple 64"],
},
{
  id: "pvp-beef", cat: "pvp", group: "consumable",
  title: T("Steak", "Стейк", "Steak"),
  desc: T("Good food to keep your hunger bar full.", "Хорошая еда, чтобы шкала голода была полной.", "Gutes Essen für eine volle Hungerleiste."),
  cmds: ["give {T} minecraft:cooked_beef 64"],
},
{
  id: "pvp-carrot", cat: "pvp", group: "consumable",
  title: T("Golden carrots", "Золотая морковь", "Goldene Karotten"),
  desc: T("The food with the best saturation.", "Еда с лучшим насыщением.", "Das Essen mit der besten Sättigung."),
  cmds: ["give {T} minecraft:golden_carrot 64"],
},
{
  id: "pvp-xp", cat: "pvp", group: "consumable",
  title: T("Bottles o' Enchanting", "Пузырьки опыта", "Erfahrungsfläschchen"),
  desc: T(
    "Throw them to repair Mending gear in the middle of a fight.",
    "Бросайте, чтобы чинить снаряжение с Починкой прямо в бою.",
    "Werfen, um Reparatur-Ausrüstung mitten im Kampf zu reparieren."
  ),
  cmds: ["give {T} minecraft:experience_bottle 64"],
},
{
  id: "pvp-chorus", cat: "pvp", group: "consumable",
  title: T("Chorus fruit", "Плод коруса", "Chorusfrucht"),
  desc: T("Eat it to teleport a short random distance — an emergency escape.", "Съешьте, чтобы телепортироваться недалеко в случайное место — экстренный побег.", "Essen teleportiert dich ein Stück zufällig weg — Notfall-Flucht."),
  cmds: ["give {T} minecraft:chorus_fruit 64"],
},

/* Potions */
{
  id: "pvp-splash-buff", cat: "pvp", group: "potions",
  title: T("Splash potions — buffs", "Взрывные зелья — усиления", "Wurftränke — Buffs"),
  desc: T("Throw at your feet. 16 of each.", "Бросайте себе под ноги. По 16 штук.", "Vor die eigenen Füße werfen. Je 16 Stück."),
  cmds: [
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:strong_healing"}] 16', label: T("Healing II", "Исцеление II", "Heilung II") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:strong_strength"}] 16', label: T("Strength II", "Сила II", "Stärke II") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:strong_swiftness"}] 16', label: T("Speed II", "Скорость II", "Schnelligkeit II") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:long_fire_resistance"}] 16', label: T("Fire Resistance (8:00)", "Огнестойкость (8:00)", "Feuerresistenz (8:00)") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:strong_turtle_master"}] 16', label: T("Turtle Master II", "Черепашья мощь II", "Schildkrötenmeister II") },
  ],
},
{
  id: "pvp-splash-attack", cat: "pvp", group: "potions",
  title: T("Splash potions — attack", "Взрывные зелья — атака", "Wurftränke — Angriff"),
  desc: T("Throw them at your opponents.", "Бросайте в противников.", "Auf Gegner werfen."),
  cmds: [
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:strong_poison"}] 16', label: T("Poison II", "Отравление II", "Vergiftung II") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:strong_harming"}] 16', label: T("Harming II", "Вред II", "Schaden II") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:long_slowness"}] 16', label: T("Slowness (long)", "Замедление (долгое)", "Langsamkeit (lang)") },
    { c: 'give {T} minecraft:splash_potion[potion_contents={potion:"minecraft:long_weakness"}] 16', label: T("Weakness (long)", "Слабость (долгая)", "Schwäche (lang)") },
  ],
},
{
  id: "pvp-lingering", cat: "pvp", group: "potions",
  title: T("Lingering potions", "Оседающие зелья", "Verweiltränke"),
  desc: T(
    "Leave a cloud on the ground that keeps applying the effect.",
    "Оставляют облако на земле, которое продолжает действовать.",
    "Hinterlassen eine Wolke am Boden, die weiter wirkt."
  ),
  opts: [{ key: "pot", label: T("Potion", "Зелье", "Trank"), values: POTION_IDS }],
  cmds: ['give {T} minecraft:lingering_potion[potion_contents={potion:"minecraft:{pot}"}] 16'],
},

/* Crystal & anchor PvP */
{
  id: "pvp-crystal", cat: "pvp", group: "crystal",
  title: T("End crystals + obsidian", "Кристаллы Энда + обсидиан", "Endkristalle + Obsidian"),
  desc: T(
    "Crystals can only be placed on obsidian or bedrock. Hit them to explode.",
    "Кристаллы ставятся только на обсидиан или бедрок. Ударьте — и они взорвутся.",
    "Kristalle lassen sich nur auf Obsidian oder Grundgestein setzen. Draufschlagen lässt sie explodieren."
  ),
  cmds: ["give {T} minecraft:end_crystal 64", "give {T} minecraft:obsidian 64"],
  warn: T("Explosions destroy terrain and hurt you too.", "Взрывы разрушают местность и ранят вас тоже.", "Explosionen zerstören Gelände und verletzen auch dich."),
},
{
  id: "pvp-anchor", cat: "pvp", group: "crystal",
  title: T("Respawn anchors + glowstone", "Якоря возрождения + светокамень", "Seelenanker + Glowstone"),
  desc: T(
    "Charge an anchor with glowstone and use it outside the Nether — it explodes.",
    "Зарядите якорь светокамнем и используйте вне Незера — он взорвётся.",
    "Lade den Anker mit Glowstone und benutze ihn außerhalb des Nethers — er explodiert."
  ),
  cmds: ["give {T} minecraft:respawn_anchor 64", "give {T} minecraft:glowstone 64"],
},

/* Utility blocks */
{
  id: "pvp-utility", cat: "pvp", group: "utility",
  title: T("Utility blocks & items", "Полезные блоки и предметы", "Nützliche Blöcke & Items"),
  desc: T(
    "Cobwebs trap players, water breaks falls, lava and fire deal damage, planks block paths.",
    "Паутина ловит игроков, вода спасает от падения, лава и огонь наносят урон, доски перекрывают путь.",
    "Spinnweben fangen Spieler, Wasser bremst Stürze, Lava und Feuer machen Schaden, Bretter blockieren Wege."
  ),
  cmds: [
    "give {T} minecraft:cobweb 64",
    "give {T} minecraft:water_bucket 1",
    "give {T} minecraft:lava_bucket 1",
    "give {T} minecraft:oak_planks 64",
    "give {T} minecraft:flint_and_steel 1",
  ],
},

/* Arena & match */
{
  id: "arena-kills", cat: "pvp", group: "arena",
  title: T("Kill counter on the sidebar", "Счётчик убийств сбоку", "Kill-Zähler in der Seitenleiste"),
  desc: T(
    "Counts player kills and shows them on the right side of the screen.",
    "Считает убийства игроков и показывает их справа на экране.",
    "Zählt Spieler-Kills und zeigt sie rechts am Bildschirm."
  ),
  cmds: ['scoreboard objectives add kills playerKillCount "Kills"', "scoreboard objectives setdisplay sidebar kills"],
},
{
  id: "arena-hp", cat: "pvp", group: "arena",
  title: T("Health under player names", "Здоровье под никами", "Leben unter Spielernamen"),
  desc: T("Shows each player's health below their name tag.", "Показывает здоровье каждого игрока под его ником.", "Zeigt die Lebenspunkte jedes Spielers unter dem Namen."),
  cmds: ['scoreboard objectives add hp health "❤"', "scoreboard objectives setdisplay below_name hp"],
},
{
  id: "arena-hp-tab", cat: "pvp", group: "arena",
  title: T("Hearts in the Tab list", "Сердца в списке игроков (Tab)", "Herzen in der Tab-Liste"),
  desc: T(
    "Shows health as hearts when you hold Tab. Needs the “hp” objective from the card above.",
    "Показывает здоровье сердечками при нажатии Tab. Нужна цель «hp» из карточки выше.",
    "Zeigt Leben als Herzen, wenn du Tab hältst. Braucht das Ziel „hp“ aus der Karte oben."
  ),
  cmds: ["scoreboard objectives setdisplay list hp", "scoreboard objectives modify hp rendertype hearts"],
},
{
  id: "arena-deaths", cat: "pvp", group: "arena",
  title: T("Death counter", "Счётчик смертей", "Tode-Zähler"),
  desc: T("Counts deaths and shows them in the Tab list.", "Считает смерти и показывает их в списке Tab.", "Zählt Tode und zeigt sie in der Tab-Liste."),
  cmds: ['scoreboard objectives add deaths deathCount "Deaths"', "scoreboard objectives setdisplay list deaths"],
},
{
  id: "arena-reset", cat: "pvp", group: "arena",
  title: T("Reset the scoreboard", "Сбросить счёт", "Punktestand zurücksetzen"),
  desc: T(
    "Remove the kill counter completely, or only set everyone back to 0.",
    "Удалить счётчик убийств полностью или только обнулить очки у всех.",
    "Kill-Zähler komplett entfernen oder nur alle auf 0 setzen."
  ),
  cmds: [
    { c: "scoreboard objectives remove kills", label: T("Delete the objective", "Удалить цель", "Ziel löschen") },
    { c: "scoreboard players reset @a kills", label: T("Only reset the scores", "Только обнулить очки", "Nur Punkte zurücksetzen") },
  ],
},
{
  id: "arena-teams", cat: "pvp", group: "arena",
  title: T("Red vs. blue teams", "Команды: красные против синих", "Teams: Rot gegen Blau"),
  desc: T(
    "Creates two colored teams without friendly fire. Run the join line for every player.",
    "Создаёт две цветные команды без урона по своим. Выполните строку join для каждого игрока.",
    "Erstellt zwei farbige Teams ohne Eigenbeschuss. Die join-Zeile für jeden Spieler ausführen."
  ),
  cmds: [
    "team add red", "team modify red color red", "team modify red friendlyFire false", "team join red {NAME}",
    "team add blue", "team modify blue color blue", "team modify blue friendlyFire false", "team join blue {NAME}",
  ],
},
{
  id: "arena-teams-extra", cat: "pvp", group: "arena",
  title: T("Team extras", "Дополнительно для команд", "Team-Extras"),
  desc: T(
    "See invisible teammates, chat only with your team, and remove the teams after the match.",
    "Видеть невидимых союзников, писать только своей команде и удалить команды после матча.",
    "Unsichtbare Teamkollegen sehen, nur im Team chatten und die Teams nach dem Match löschen."
  ),
  cmds: [
    { c: "team modify red seeFriendlyInvisibles true", label: T("See invisible teammates", "Видеть невидимых союзников", "Unsichtbare Mitspieler sehen") },
    { c: "teammsg Push left!", label: T("Team chat (alias: tm)", "Чат команды (сокращение: tm)", "Team-Chat (Kurzform: tm)") },
    { c: "team leave {NAME}", label: T("Leave a team", "Выйти из команды", "Team verlassen") },
    { c: "team remove red", label: T("Delete a team", "Удалить команду", "Team löschen") },
  ],
},
{
  id: "arena-countdown", cat: "pvp", group: "arena",
  title: T("Countdown 3-2-1-FIGHT!", "Отсчёт 3-2-1-БОЙ!", "Countdown 3-2-1-KAMPF!"),
  desc: T(
    "Run the lines one after another (about one second apart). The first line makes the titles short and snappy.",
    "Выполняйте строки друг за другом (примерно через секунду). Первая строка делает заголовки короткими.",
    "Die Zeilen nacheinander ausführen (etwa eine Sekunde Abstand). Die erste Zeile macht die Titel kurz."
  ),
  cmds: [
    { c: "title @a times 0 20 5", label: T("Optional: fade in / stay / fade out (ticks)", "Необязательно: появление / показ / исчезание (тики)", "Optional: Einblenden / Anzeigen / Ausblenden (Ticks)") },
    { c: 'title @a title "3"', label: T("Step 1", "Шаг 1", "Schritt 1") },
    { c: 'title @a title "2"', label: T("Step 2", "Шаг 2", "Schritt 2") },
    { c: 'title @a title "1"', label: T("Step 3", "Шаг 3", "Schritt 3") },
    { c: 'title @a title "FIGHT!"', label: T("Step 4", "Шаг 4", "Schritt 4") },
  ],
},
{
  id: "arena-beep", cat: "pvp", group: "arena",
  title: T("Countdown beep", "Звук отсчёта", "Countdown-Piepton"),
  desc: T(
    "Plays a sound for every player at their own position.",
    "Проигрывает звук каждому игроку в его позиции.",
    "Spielt jedem Spieler an seiner Position einen Ton ab."
  ),
  cmds: [
    { c: "execute as @a at @s run playsound minecraft:block.note_block.pling master @s ~ ~ ~ 1 1", label: T("Beep (3, 2, 1)", "Сигнал (3, 2, 1)", "Piep (3, 2, 1)") },
    { c: "execute as @a at @s run playsound minecraft:entity.ender_dragon.growl master @s ~ ~ ~ 1 1", label: T("FIGHT!", "БОЙ!", "KAMPF!") },
  ],
},
{
  id: "arena-heal", cat: "pvp", group: "arena",
  title: T("Heal everyone before a round", "Вылечить всех перед раундом", "Alle vor der Runde heilen"),
  desc: T("Full health and full hunger bar for all players.", "Полное здоровье и сытость для всех игроков.", "Volle Leben und volle Hungerleiste für alle Spieler."),
  cmds: ["effect give @a minecraft:instant_health 1 10 true", "effect give @a minecraft:saturation 1 255 true"],
},
{
  id: "arena-clear", cat: "pvp", group: "arena",
  title: T("Clear everyone", "Очистить всех", "Alle leeren"),
  desc: T("Empties all inventories and removes all effects.", "Очищает все инвентари и снимает все эффекты.", "Leert alle Inventare und entfernt alle Effekte."),
  cmds: ["clear @a", "effect clear @a"],
  warn: T("Items are deleted for good.", "Предметы удаляются безвозвратно.", "Items werden endgültig gelöscht."),
},
{
  id: "arena-spawn", cat: "pvp", group: "arena",
  title: T("Set the arena spawn", "Точка возрождения на арене", "Arena-Spawnpunkt setzen"),
  desc: T(
    "Stand in the arena. Line 1 sets the respawn point of all online players, line 2 sets the world spawn.",
    "Встаньте на арене. Строка 1 задаёт точку возрождения всем игрокам онлайн, строка 2 — точку спавна мира.",
    "Stell dich in die Arena. Zeile 1 setzt den Respawn aller Online-Spieler, Zeile 2 den Welt-Spawn."
  ),
  cmds: ["spawnpoint @a ~ ~ ~", "setworldspawn ~ ~ ~"],
},
{
  id: "arena-tpall", cat: "pvp", group: "arena",
  title: T("Teleport all players to me", "Телепортировать всех ко мне", "Alle Spieler zu mir teleportieren"),
  desc: T("Brings every player to your position.", "Перемещает всех игроков к вам.", "Holt alle Spieler zu deiner Position."),
  cmds: ["tp @a @s"],
},
{
  id: "arena-spread", cat: "pvp", group: "arena",
  title: T("Scatter players randomly", "Раскидать игроков случайно", "Spieler zufällig verteilen"),
  desc: T(
    "Spreads all players within 30 blocks of you, at least 5 blocks apart. The second line keeps teams together.",
    "Раскидывает всех игроков в радиусе 30 блоков от вас, минимум в 5 блоках друг от друга. Вторая строка держит команды вместе.",
    "Verteilt alle Spieler im Umkreis von 30 Blöcken, mindestens 5 Blöcke auseinander. Zeile 2 hält Teams zusammen."
  ),
  cmds: [
    { c: "spreadplayers ~ ~ 5 30 false @a", label: T("Everyone alone", "Каждый сам за себя", "Jeder für sich") },
    { c: "spreadplayers ~ ~ 10 50 true @a", label: T("Teams stay together", "Команды вместе", "Teams bleiben zusammen") },
  ],
},
{
  id: "arena-border", cat: "pvp", group: "arena",
  title: T("Shrinking world border", "Сужающаяся граница мира", "Schrumpfende Weltbarriere"),
  desc: T(
    "Battle-royale style: the border starts 200 blocks wide around you and shrinks to 20 blocks in 5 minutes.",
    "Как в королевской битве: граница шириной 200 блоков вокруг вас сужается до 20 блоков за 5 минут.",
    "Battle-Royale-Stil: Die Grenze ist 200 Blöcke breit und schrumpft in 5 Minuten auf 20 Blöcke."
  ),
  cmds: [
    { c: "worldborder center ~ ~", label: T("1. Center on you", "1. Центр на вас", "1. Mitte bei dir") },
    { c: "worldborder set 200", label: T("2. Start size", "2. Начальный размер", "2. Startgröße") },
    { c: "worldborder set 20 300s", label: T("3. Shrink over 300 seconds", "3. Сужение за 300 секунд", "3. In 300 Sekunden schrumpfen") },
    { c: "worldborder set 59999968", label: T("Reset to normal", "Вернуть как было", "Zurücksetzen") },
  ],
  note: T(
    "Since 1.21.11 a plain number means ticks (20 ticks = 1 s). Add “s” for seconds, like 300s.",
    "С 1.21.11 число без суффикса — это тики (20 тиков = 1 с). Добавьте «s» для секунд, например 300s.",
    "Seit 1.21.11 bedeutet eine reine Zahl Ticks (20 Ticks = 1 s). Hänge „s“ für Sekunden an, z. B. 300s."
  ),
},
{
  id: "arena-border-damage", cat: "pvp", group: "arena",
  title: T("World border damage & warning", "Урон и предупреждение границы", "Barrieren-Schaden & Warnung"),
  desc: T(
    "Makes standing outside the border hurt more, and warns players earlier.",
    "Усиливает урон за границей и раньше предупреждает игроков.",
    "Außerhalb der Grenze gibt es mehr Schaden, und Spieler werden früher gewarnt."
  ),
  cmds: ["worldborder damage amount 2", "worldborder damage buffer 0", "worldborder warning distance 10"],
},
{
  id: "arena-timer", cat: "pvp", group: "arena",
  title: T("Match timer (stopwatch)", "Таймер матча (секундомер)", "Match-Timer (Stoppuhr)"),
  desc: T(
    "New in 1.21.11: a real-time stopwatch. Query shows the elapsed seconds.",
    "Новое в 1.21.11: секундомер реального времени. Query показывает прошедшие секунды.",
    "Neu in 1.21.11: eine Echtzeit-Stoppuhr. Query zeigt die vergangenen Sekunden."
  ),
  cmds: [
    { c: "stopwatch create pvp:match", label: T("Start", "Старт", "Start") },
    { c: "stopwatch query pvp:match", label: T("Show time", "Показать время", "Zeit anzeigen") },
    { c: "stopwatch restart pvp:match", label: T("Restart", "Перезапуск", "Neustart") },
    { c: "stopwatch remove pvp:match", label: T("Remove", "Удалить", "Entfernen") },
  ],
},
{
  id: "arena-bossbar", cat: "pvp", group: "arena",
  title: T("Boss bar for a match", "Полоса босса для матча", "Bossleiste fürs Match"),
  desc: T(
    "A custom bar at the top of the screen — e.g. for time or points. Change “value” during the match.",
    "Своя полоса вверху экрана — например, для времени или очков. Меняйте «value» во время матча.",
    "Eine eigene Leiste oben am Bildschirm — z. B. für Zeit oder Punkte. „value“ im Match ändern."
  ),
  cmds: [
    'bossbar add pvp:bar "Match"',
    "bossbar set pvp:bar players @a",
    "bossbar set pvp:bar color red",
    "bossbar set pvp:bar max 100",
    "bossbar set pvp:bar value 50",
    { c: "bossbar remove pvp:bar", label: T("Remove", "Удалить", "Entfernen") },
  ],
},
{
  id: "arena-spectate", cat: "pvp", group: "arena",
  title: T("Spectate a player", "Наблюдать за игроком", "Einem Spieler zuschauen"),
  desc: T(
    "Switch to spectator mode, then view the match through a player's eyes. Run “spectate” alone to stop.",
    "Перейдите в режим наблюдателя и смотрите матч глазами игрока. Чтобы выйти, введите просто «spectate».",
    "Wechsle in den Zuschauermodus und sieh das Match aus Sicht eines Spielers. Nur „spectate“ beendet es."
  ),
  cmds: ["gamemode spectator {T}", "spectate {NAME}", { c: "spectate", label: T("Stop spectating", "Перестать наблюдать", "Zuschauen beenden") }],
},
{
  id: "arena-glow", cat: "pvp", group: "arena",
  title: T("Reveal hiding players", "Подсветить прячущихся", "Versteckte Spieler aufdecken"),
  desc: T("Everyone glows for 60 seconds — visible through walls.", "Все светятся 60 секунд — видно сквозь стены.", "Alle leuchten 60 Sekunden — durch Wände sichtbar."),
  cmds: ["effect give @a minecraft:glowing 60 0 true"],
},
{
  id: "arena-dummy", cat: "pvp", group: "arena",
  title: T("Training dummy", "Тренировочный манекен", "Trainingspuppe"),
  desc: T(
    "A mob that stands still, never despawns and doesn't burn in daylight. Lines 2–3 give it 500 HP.",
    "Моб, который стоит на месте, не исчезает и не горит на солнце. Строки 2–3 дают ему 500 HP.",
    "Ein Mob, der stillsteht, nie verschwindet und in der Sonne nicht brennt. Zeilen 2–3 geben ihm 500 LP."
  ),
  cmds: [
    'summon minecraft:husk ~ ~ ~ {NoAI:1b,PersistenceRequired:1b,Silent:1b,CustomName:"Training Dummy",CustomNameVisible:1b}',
    { c: "attribute @e[type=minecraft:husk,sort=nearest,limit=1] minecraft:max_health base set 500", label: T("Optional: 500 max HP", "Необязательно: 500 макс. HP", "Optional: 500 max. LP") },
    { c: "data merge entity @e[type=minecraft:husk,sort=nearest,limit=1] {Health:500f}", label: T("Optional: fill up the HP", "Необязательно: заполнить HP", "Optional: LP auffüllen") },
    { c: 'kill @e[type=minecraft:husk,name="Training Dummy"]', label: T("Remove dummies", "Убрать манекены", "Puppen entfernen") },
  ],
},
{
  id: "arena-oldcombat", cat: "pvp", group: "arena", single: true,
  title: T("Old 1.8-style combat (no cooldown)", "Старое PvP 1.8 (без задержки)", "Alter 1.8-Kampf (ohne Abklingzeit)"),
  desc: T(
    "Removes the attack cooldown so you can spam-click like in 1.8. Line 2 sets it back to normal (4).",
    "Убирает задержку атаки — можно кликать часто, как в 1.8. Строка 2 возвращает обычное значение (4).",
    "Entfernt die Angriffs-Abklingzeit — Spam-Klicken wie in 1.8. Zeile 2 stellt den Normalwert (4) wieder her."
  ),
  cmds: [
    "attribute {T} minecraft:attack_speed base set 100",
    { c: "attribute {T} minecraft:attack_speed base set 4", label: T("Reset", "Сброс", "Zurücksetzen") },
  ],
  note: T("Only affects players who are online right now.", "Действует только на игроков, которые сейчас в сети.", "Wirkt nur auf Spieler, die gerade online sind."),
},

/* Match game rules */
{
  id: "rule-keepinv-off", cat: "pvp", group: "rules",
  title: T("Drop items on death", "Выпадение вещей при смерти", "Items beim Tod fallen lassen"),
  desc: T("keep_inventory off: the loser drops the loot.", "keep_inventory выкл.: проигравший теряет лут.", "keep_inventory aus: Der Verlierer lässt die Beute fallen."),
  cmds: grLines("keep_inventory", "keepInventory", "false"),
  note: GR_NOTE,
},
{
  id: "rule-regen-off", cat: "pvp", group: "rules",
  title: T("No natural regeneration (UHC)", "Без естественной регенерации (UHC)", "Keine natürliche Regeneration (UHC)"),
  desc: T(
    "Health only comes back from golden apples, potions and effects.",
    "Здоровье восстанавливается только золотыми яблоками, зельями и эффектами.",
    "Leben kommt nur durch goldene Äpfel, Tränke und Effekte zurück."
  ),
  cmds: grLines("natural_health_regeneration", "naturalRegeneration", "false"),
  note: GR_NOTE,
},
{
  id: "rule-deathmsg", cat: "pvp", group: "rules",
  title: T("Show death messages", "Показывать сообщения о смерти", "Todesnachrichten anzeigen"),
  desc: T("“Steve was slain by Alex” appears in chat.", "В чате появляется «Steve был убит Alex».", "„Steve wurde von Alex erschlagen“ erscheint im Chat."),
  cmds: grLines("show_death_messages", "showDeathMessages", "true"),
  note: GR_NOTE,
},
{
  id: "rule-pvp", cat: "pvp", group: "rules",
  title: T("PvP on / off by command", "PvP вкл./выкл. командой", "PvP per Befehl an/aus"),
  desc: T(
    "Since 1.21.9 there is a pvp game rule. On Aternos you can also use Options → PvP.",
    "С 1.21.9 есть игровое правило pvp. На Aternos также можно использовать «Опции» → PvP.",
    "Seit 1.21.9 gibt es die Spielregel pvp. Auf Aternos geht auch Optionen → PvP."
  ),
  cmds: [
    { c: "gamerule pvp false", label: T("PvP off", "PvP выкл.", "PvP aus") },
    { c: "gamerule pvp true", label: T("PvP on", "PvP вкл.", "PvP an") },
  ],
},
{
  id: "rule-respawn", cat: "pvp", group: "rules",
  title: T("Instant respawn", "Мгновенное возрождение", "Sofortiger Respawn"),
  desc: T("Skips the death screen — players are back in the fight immediately.", "Пропускает экран смерти — игроки сразу возвращаются в бой.", "Überspringt den Todesbildschirm — Spieler sind sofort zurück."),
  cmds: grLines("immediate_respawn", "doImmediateRespawn", "true"),
  note: GR_NOTE,
},
{
  id: "rule-falldamage", cat: "pvp", group: "rules",
  title: T("No fall damage", "Без урона от падения", "Kein Fallschaden"),
  desc: T("Handy for mace or elytra practice.", "Удобно для тренировки с булавой или элитрами.", "Praktisch zum Üben mit Streitkolben oder Elytren."),
  cmds: grLines("fall_damage", "fallDamage", "false"),
  note: GR_NOTE,
},

/* ───────────────────────────── WEAPONS ───────────────────────────── */
{
  id: "wp-spear", cat: "weapons",
  title: T("Netherite spear (Lunge III)", "Незеритовое копьё (Выпад III)", "Netheritspeer (Ausfall III)"),
  desc: T(
    "New in 1.21.11. Lunge pushes you forward on jab attacks — it costs hunger.",
    "Новое в 1.21.11. Выпад толкает вас вперёд при уколе — тратит голод.",
    "Neu in 1.21.11. Ausfall stößt dich beim Stich nach vorn — kostet Hunger."
  ),
  cmds: [`give {T} minecraft:netherite_spear[enchantments={${ENC.spear}}]`],
},
{
  id: "wp-spear-max", cat: "weapons",
  title: T("Maxed netherite spear", "Прокачанное незеритовое копьё", "Maximaler Netheritspeer"),
  desc: T(
    "Lunge III, Sharpness V, Fire Aspect II, Looting III, Unbreaking III, Mending.",
    "Выпад III, Острота V, Заговор огня II, Добыча III, Прочность III, Починка.",
    "Ausfall III, Schärfe V, Verbrennung II, Plünderung III, Haltbarkeit III, Reparatur."
  ),
  cmds: [`give {T} minecraft:netherite_spear[enchantments={${ENC.spearMax}}]`],
},
{
  id: "wp-spear-types", cat: "weapons",
  title: T("Spear by material", "Копьё из любого материала", "Speer nach Material"),
  desc: T("All seven spear types from 1.21.11.", "Все семь видов копий из 1.21.11.", "Alle sieben Speerarten aus 1.21.11."),
  opts: [{ key: "mat", label: T("Material", "Материал", "Material"),
    values: ["wooden", "stone", "copper", "iron", "golden", "diamond", "netherite"] }],
  cmds: ["give {T} minecraft:{mat}_spear"],
},
{
  id: "wp-mace", cat: "weapons",
  title: T("Mace (Density V, Wind Burst III)", "Булава (Плотность V, Порыв ветра III)", "Streitkolben (Dichte V, Windstoß III)"),
  desc: T(
    "Deals more damage the farther you fall. Wind Burst launches you back up after a hit.",
    "Чем выше падение, тем сильнее удар. Порыв ветра подбрасывает вас вверх после удара.",
    "Je tiefer der Fall, desto mehr Schaden. Windstoß schleudert dich nach dem Treffer wieder hoch."
  ),
  cmds: [`give {T} minecraft:mace[enchantments={${ENC.mace}}]`],
},
{
  id: "wp-mace-breach", cat: "weapons",
  title: T("Breach mace (armor piercing)", "Булава с Пробитием", "Bresche-Streitkolben (durchschlägt Rüstung)"),
  desc: T(
    "Breach IV ignores part of the armor. Breach and Density can't be on the same mace.",
    "Пробитие IV игнорирует часть брони. Пробитие и Плотность нельзя совместить на одной булаве.",
    "Bresche IV ignoriert einen Teil der Rüstung. Bresche und Dichte gehen nicht zusammen."
  ),
  cmds: [`give {T} minecraft:mace[enchantments={${ENC.maceBreach}}]`],
},
{
  id: "wp-sword", cat: "weapons",
  title: T("Netherite sword (maxed)", "Незеритовый меч (макс.)", "Netheritschwert (maximal)"),
  desc: T(
    "Sharpness V, Sweeping Edge III, Fire Aspect II, Knockback II, Looting III, Unbreaking III, Mending.",
    "Острота V, Разящий клинок III, Заговор огня II, Отдача II, Добыча III, Прочность III, Починка.",
    "Schärfe V, Schwungkraft III, Verbrennung II, Rückstoß II, Plünderung III, Haltbarkeit III, Reparatur."
  ),
  cmds: [`give {T} minecraft:netherite_sword[enchantments={${ENC.sword}}]`],
},
{
  id: "wp-sword-1000", cat: "weapons",
  title: T("1000-damage sword", "Меч на 1000 урона", "Schwert mit 1000 Schaden"),
  desc: T(
    "Kills almost anything in one hit. Uses an attribute modifier plus Sharpness 255.",
    "Убивает почти всё с одного удара. Модификатор атрибута плюс Острота 255.",
    "Tötet fast alles mit einem Schlag. Attribut-Modifikator plus Schärfe 255."
  ),
  cmds: ['give {T} minecraft:netherite_sword[attribute_modifiers=[{type:"minecraft:attack_damage",amount:1000,operation:"add_value",id:"minecraft:max_damage",slot:"mainhand"}],enchantments={"minecraft:sharpness":255}]'],
  warn: T("Not fair in PvP — for testing and bosses only.", "Нечестно в PvP — только для тестов и боссов.", "Im PvP unfair — nur für Tests und Bosse."),
},
{
  id: "wp-axe", cat: "weapons",
  title: T("Shield-breaker axe", "Топор против щитов", "Schildbrecher-Axt"),
  desc: T(
    "An axe hit disables the enemy's shield for a few seconds.",
    "Удар топором отключает щит противника на несколько секунд.",
    "Ein Axthieb deaktiviert den gegnerischen Schild für ein paar Sekunden."
  ),
  cmds: [`give {T} minecraft:netherite_axe[enchantments={${ENC.axePvp}}]`],
},
{
  id: "wp-shield", cat: "weapons",
  title: T("Shield", "Щит", "Schild"),
  desc: T("Unbreaking III and Mending.", "Прочность III и Починка.", "Haltbarkeit III und Reparatur."),
  cmds: [`give {T} minecraft:shield[enchantments={${ENC.basic}}]`],
},
{
  id: "wp-kbstick", cat: "weapons",
  title: T("Knockback stick", "Палка с отбрасыванием", "Rückstoß-Stock"),
  desc: T(
    "Knockback 10 on a stick — the classic “knock them off the map” minigame.",
    "Отдача 10 на палке — классическая мини-игра «сбей всех с карты».",
    "Rückstoß 10 auf einem Stock — das klassische „Wirf alle von der Map“-Minispiel."
  ),
  cmds: ['give {T} minecraft:stick[enchantments={"minecraft:knockback":10}]'],
},

/* ───────────────────────────── ARMOR ───────────────────────────── */
{
  id: "ar-helmet", cat: "armor",
  title: T("Netherite helmet", "Незеритовый шлем", "Netheritehelm"),
  desc: T(
    "Protection IV, Respiration III, Aqua Affinity, Thorns III, Unbreaking III, Mending.",
    "Защита IV, Подводное дыхание III, Подводник, Шипы III, Прочность III, Починка.",
    "Schutz IV, Atmung III, Wasseraffinität, Dornen III, Haltbarkeit III, Reparatur."
  ),
  cmds: [`give {T} minecraft:netherite_helmet[enchantments={${ENC.helmet}}]`],
},
{
  id: "ar-chestplate", cat: "armor",
  title: T("Netherite chestplate", "Незеритовый нагрудник", "Netheritharnisch"),
  desc: T("Protection IV, Thorns III, Unbreaking III, Mending.", "Защита IV, Шипы III, Прочность III, Починка.", "Schutz IV, Dornen III, Haltbarkeit III, Reparatur."),
  cmds: [`give {T} minecraft:netherite_chestplate[enchantments={${ENC.chestplate}}]`],
},
{
  id: "ar-leggings", cat: "armor",
  title: T("Netherite leggings", "Незеритовые поножи", "Netheritbeinschutz"),
  desc: T("Protection IV, Swift Sneak III, Thorns III, Unbreaking III, Mending.", "Защита IV, Проворство III, Шипы III, Прочность III, Починка.", "Schutz IV, Huschen III, Dornen III, Haltbarkeit III, Reparatur."),
  cmds: [`give {T} minecraft:netherite_leggings[enchantments={${ENC.leggings}}]`],
},
{
  id: "ar-boots", cat: "armor",
  title: T("Netherite boots", "Незеритовые ботинки", "Netheritstiefel"),
  desc: T(
    "Protection IV, Feather Falling IV, Depth Strider III, Soul Speed III, Thorns III, Unbreaking III, Mending.",
    "Защита IV, Невесомость IV, Подводная ходьба III, Скорость души III, Шипы III, Прочность III, Починка.",
    "Schutz IV, Federfall IV, Wasserläufer III, Seelenläufer III, Dornen III, Haltbarkeit III, Reparatur."
  ),
  cmds: [`give {T} minecraft:netherite_boots[enchantments={${ENC.boots}}]`],
},
{
  id: "ar-trim", cat: "armor",
  title: T("Trimmed armor piece", "Броня с отделкой", "Rüstungsteil mit Besatz"),
  desc: T("Pick a piece, trim material and pattern — pure style.", "Выберите часть брони, материал и узор отделки — для красоты.", "Wähle Teil, Besatzmaterial und Muster — reiner Style."),
  opts: [
    { key: "piece", label: T("Piece", "Часть", "Teil"), values: ["netherite_helmet", "netherite_chestplate", "netherite_leggings", "netherite_boots"] },
    { key: "mat", label: T("Material", "Материал", "Material"), values: TRIM_MATERIALS },
    { key: "pat", label: T("Pattern", "Узор", "Muster"), values: TRIM_PATTERNS },
  ],
  cmds: ['give {T} minecraft:{piece}[trim={pattern:"minecraft:{pat}",material:"minecraft:{mat}"},enchantments={"minecraft:protection":4,"minecraft:unbreaking":3,"minecraft:mending":1}]'],
},
{
  id: "ar-leather", cat: "armor",
  title: T("Team-colored leather armor", "Кожаная броня цвета команды", "Lederrüstung in Teamfarbe"),
  desc: T("Dyed leather set so everyone can see which team you are on.", "Окрашенный кожаный комплект — видно, в какой вы команде.", "Gefärbtes Lederset — alle sehen, in welchem Team du bist."),
  opts: [{ key: "col", label: T("Color", "Цвет", "Farbe"), values: DYE_COLORS }],
  cmds: [
    "give {T} minecraft:leather_helmet[dyed_color={col}]",
    "give {T} minecraft:leather_chestplate[dyed_color={col}]",
    "give {T} minecraft:leather_leggings[dyed_color={col}]",
    "give {T} minecraft:leather_boots[dyed_color={col}]",
  ],
},

/* ───────────────────────────── TOOLS ───────────────────────────── */
{
  id: "tl-pickaxe", cat: "tools",
  title: T("Netherite pickaxe", "Незеритовая кирка", "Netheritspitzhacke"),
  desc: T("Efficiency V, Unbreaking III, Mending + Fortune III or Silk Touch.", "Эффективность V, Прочность III, Починка + Удача III или Шёлковое касание.", "Effizienz V, Haltbarkeit III, Reparatur + Glück III oder Behutsamkeit."),
  cmds: ['give {T} minecraft:netherite_pickaxe[enchantments={"minecraft:efficiency":5,{TOOL},"minecraft:unbreaking":3,"minecraft:mending":1}]'],
},
{
  id: "tl-axe", cat: "tools",
  title: T("Netherite axe", "Незеритовый топор", "Netheritaxt"),
  desc: T("Also gets Sharpness V.", "Дополнительно Острота V.", "Zusätzlich Schärfe V."),
  cmds: ['give {T} minecraft:netherite_axe[enchantments={"minecraft:sharpness":5,"minecraft:efficiency":5,{TOOL},"minecraft:unbreaking":3,"minecraft:mending":1}]'],
},
{
  id: "tl-shovel", cat: "tools",
  title: T("Netherite shovel", "Незеритовая лопата", "Netheritschaufel"),
  desc: T("Efficiency V, Unbreaking III, Mending + Fortune III or Silk Touch.", "Эффективность V, Прочность III, Починка + Удача III или Шёлковое касание.", "Effizienz V, Haltbarkeit III, Reparatur + Glück III oder Behutsamkeit."),
  cmds: ['give {T} minecraft:netherite_shovel[enchantments={"minecraft:efficiency":5,{TOOL},"minecraft:unbreaking":3,"minecraft:mending":1}]'],
},
{
  id: "tl-hoe", cat: "tools",
  title: T("Netherite hoe", "Незеритовая мотыга", "Netherithacke"),
  desc: T("Efficiency V, Unbreaking III, Mending + Fortune III or Silk Touch.", "Эффективность V, Прочность III, Починка + Удача III или Шёлковое касание.", "Effizienz V, Haltbarkeit III, Reparatur + Glück III oder Behutsamkeit."),
  cmds: ['give {T} minecraft:netherite_hoe[enchantments={"minecraft:efficiency":5,{TOOL},"minecraft:unbreaking":3,"minecraft:mending":1}]'],
},
{
  id: "tl-shears", cat: "tools",
  title: T("Shears", "Ножницы", "Schere"),
  desc: T("Efficiency V, Unbreaking III, Mending.", "Эффективность V, Прочность III, Починка.", "Effizienz V, Haltbarkeit III, Reparatur."),
  cmds: [`give {T} minecraft:shears[enchantments={${ENC.shears}}]`],
},
{
  id: "tl-rod", cat: "tools",
  title: T("Best fishing rod", "Лучшая удочка", "Beste Angel"),
  desc: T("Luck of the Sea III, Lure III, Unbreaking III, Mending.", "Везучий рыбак III, Приманка III, Прочность III, Починка.", "Glück des Meeres III, Köder III, Haltbarkeit III, Reparatur."),
  cmds: [`give {T} minecraft:fishing_rod[enchantments={${ENC.rod}}]`],
},
{
  id: "tl-enchant-held", cat: "tools",
  title: T("Enchant the item in your hand", "Зачаровать предмет в руке", "Item in der Hand verzaubern"),
  desc: T(
    "Works only if the enchantment fits the item and doesn't exceed the normal max level.",
    "Работает, только если зачарование подходит предмету и не выше обычного максимума.",
    "Klappt nur, wenn die Verzauberung zum Item passt und die normale Maximalstufe nicht übersteigt."
  ),
  opts: [{ key: "ench", label: T("Enchantment", "Зачарование", "Verzauberung"), values: [
    ["minecraft:mending 1", "Mending I"], ["minecraft:unbreaking 3", "Unbreaking III"],
    ["minecraft:efficiency 5", "Efficiency V"], ["minecraft:fortune 3", "Fortune III"],
    ["minecraft:silk_touch 1", "Silk Touch I"], ["minecraft:sharpness 5", "Sharpness V"],
    ["minecraft:protection 4", "Protection IV"], ["minecraft:feather_falling 4", "Feather Falling IV"],
    ["minecraft:power 5", "Power V"], ["minecraft:looting 3", "Looting III"],
  ] }],
  cmds: ["enchant {T} {ench}"],
},

/* ───────────────────────────── MOVEMENT ───────────────────────────── */
{
  id: "mv-elytra", cat: "movement",
  title: T("Elytra", "Элитры", "Elytren"),
  desc: T("Wings for gliding. Unbreaking III and Mending.", "Крылья для полёта. Прочность III и Починка.", "Flügel zum Gleiten. Haltbarkeit III und Reparatur."),
  cmds: [`give {T} minecraft:elytra[enchantments={${ENC.basic}}]`],
},
{
  id: "mv-rockets", cat: "movement",
  title: T("Firework rockets", "Фейерверк-ракеты", "Feuerwerksraketen"),
  desc: T("Boost while flying with elytra. Flight duration 1 = no explosion damage.", "Ускорение в полёте на элитрах. Длительность 1 = без урона от взрыва.", "Boost beim Elytrenflug. Flugdauer 1 = kein Explosionsschaden."),
  cmds: ["give {T} minecraft:firework_rocket[fireworks={flight_duration:1}] 64"],
},
{
  id: "mv-wind", cat: "movement",
  title: T("Wind charges", "Заряды ветра", "Windladungen"),
  desc: T("Throw at your feet to jump high. Great with the mace.", "Бросьте под ноги, чтобы высоко подпрыгнуть. Отлично с булавой.", "Vor die Füße werfen für hohe Sprünge. Super mit dem Streitkolben."),
  cmds: ["give {T} minecraft:wind_charge 64"],
},
{
  id: "mv-pearls", cat: "movement",
  title: T("Ender pearls", "Жемчуг Эндера", "Enderperlen"),
  desc: T("Throw to teleport. Stacks to 16.", "Бросьте, чтобы телепортироваться. Стак — 16.", "Werfen zum Teleportieren. Stapelt bis 16."),
  cmds: ["give {T} minecraft:ender_pearl 16"],
},
{
  id: "mv-horse", cat: "movement",
  title: T("Tamed super horse", "Приручённая суперлошадь", "Gezähmtes Super-Pferd"),
  desc: T(
    "Summons a tamed horse and makes it fast with a high jump. Saddle it, add armor and ride — perfect for spear charges.",
    "Призывает приручённую лошадь и делает её быстрой и прыгучей. Оседлайте, наденьте броню и скачите — идеально для атак копьём.",
    "Beschwört ein gezähmtes Pferd und macht es schnell und sprungstark. Satteln, Rüstung drauf und los — ideal für Speer-Angriffe."
  ),
  cmds: [
    "summon minecraft:horse ~ ~ ~ {Tame:1b}",
    { c: "attribute @e[type=minecraft:horse,sort=nearest,limit=1] minecraft:movement_speed base set 0.3375", label: T("Max speed", "Макс. скорость", "Max. Tempo") },
    { c: "attribute @e[type=minecraft:horse,sort=nearest,limit=1] minecraft:jump_strength base set 1", label: T("Max jump", "Макс. прыжок", "Max. Sprung") },
    "give {T} minecraft:saddle",
    { c: "give {T} minecraft:netherite_horse_armor", label: T("New in 1.21.11", "Новое в 1.21.11", "Neu in 1.21.11") },
  ],
},
{
  id: "mv-nautilus", cat: "movement",
  title: T("Nautilus (underwater mount)", "Наутилус (подводный скакун)", "Nautilus (Unterwasser-Reittier)"),
  desc: T(
    "New in 1.21.11. Tame it with pufferfish (1 in 3 chance each), then saddle it and give it armor.",
    "Новое в 1.21.11. Приручите иглобрюхом (шанс 1 к 3 за штуку), затем оседлайте и наденьте броню.",
    "Neu in 1.21.11. Mit Kugelfisch zähmen (je 1 zu 3 Chance), dann satteln und Rüstung anlegen."
  ),
  cmds: [
    "summon minecraft:nautilus ~ ~ ~",
    "give {T} minecraft:pufferfish 8",
    "give {T} minecraft:saddle",
    "give {T} minecraft:netherite_nautilus_armor",
  ],
},
{
  id: "mv-tp-coords", cat: "movement",
  title: T("Teleport to coordinates", "Телепорт по координатам", "Zu Koordinaten teleportieren"),
  desc: T("Replace x y z with numbers (F3 shows yours).", "Замените x y z числами (F3 показывает ваши).", "Ersetze x y z durch Zahlen (F3 zeigt deine)."),
  cmds: ["tp {T} x y z", { c: "tp {T} ~ ~50 ~", label: T("50 blocks up", "На 50 блоков вверх", "50 Blöcke nach oben") }],
},

/* ───────────────────────────── EFFECTS ───────────────────────────── */
{
  id: "ef-saturation", cat: "effects",
  title: T("Saturation (never hungry)", "Насыщение (никогда не голоден)", "Sättigung (nie hungrig)"),
  desc: T("Keeps the hunger bar full forever.", "Шкала голода всегда полная.", "Hält die Hungerleiste für immer voll."),
  cmds: ["effect give {T} minecraft:saturation infinite 255 true"],
},
{
  id: "ef-nightvision", cat: "effects",
  title: T("Night vision", "Ночное зрение", "Nachtsicht"),
  desc: T("See clearly in the dark and underwater.", "Хорошо видно в темноте и под водой.", "Klare Sicht im Dunkeln und unter Wasser."),
  cmds: ["effect give {T} minecraft:night_vision infinite 0 true"],
},
{
  id: "ef-resistance", cat: "effects",
  title: T("Resistance (full immunity)", "Сопротивление (полная неуязвимость)", "Resistenz (volle Immunität)"),
  desc: T(
    "Each level blocks 20 % of damage. Amplifier 4 (= level V) blocks 100 %.",
    "Каждый уровень блокирует 20 % урона. Усилитель 4 (= уровень V) блокирует 100 %.",
    "Jede Stufe blockt 20 % Schaden. Verstärker 4 (= Stufe V) blockt 100 %."
  ),
  cmds: ["effect give {T} minecraft:resistance infinite 4 true"],
  note: T("Higher than 4 is useless — you are already immune.", "Больше 4 бесполезно — вы уже неуязвимы.", "Höher als 4 bringt nichts — du bist schon immun."),
},
{
  id: "ef-strength", cat: "effects",
  title: T("Strength 100", "Сила 100", "Stärke 100"),
  desc: T("Adds a huge amount of melee damage.", "Добавляет огромный урон в ближнем бою.", "Gibt riesigen Nahkampfschaden."),
  cmds: ["effect give {T} minecraft:strength infinite 100 true"],
},
{
  id: "ef-speed", cat: "effects",
  title: T("Speed III", "Скорость III", "Schnelligkeit III"),
  desc: T("Run much faster.", "Бегайте намного быстрее.", "Viel schneller laufen."),
  cmds: ["effect give {T} minecraft:speed infinite 2 true"],
},
{
  id: "ef-haste", cat: "effects",
  title: T("Haste III", "Спешка III", "Eile III"),
  desc: T("Mine and attack faster.", "Быстрее копать и атаковать.", "Schneller abbauen und angreifen."),
  cmds: ["effect give {T} minecraft:haste infinite 2 true"],
},
{
  id: "ef-jump", cat: "effects",
  title: T("Jump Boost II", "Прыгучесть II", "Sprungkraft II"),
  desc: T("Jump higher (and take less fall damage).", "Прыгайте выше (и получайте меньше урона от падения).", "Höher springen (und weniger Fallschaden)."),
  cmds: ["effect give {T} minecraft:jump_boost infinite 1 true"],
},
{
  id: "ef-regen", cat: "effects",
  title: T("Regeneration II", "Регенерация II", "Regeneration II"),
  desc: T("Constantly heals you.", "Постоянно восстанавливает здоровье.", "Heilt dich ständig."),
  cmds: ["effect give {T} minecraft:regeneration infinite 1 true"],
},
{
  id: "ef-fireres", cat: "effects",
  title: T("Fire resistance", "Огнестойкость", "Feuerresistenz"),
  desc: T("Immune to fire and lava.", "Иммунитет к огню и лаве.", "Immun gegen Feuer und Lava."),
  cmds: ["effect give {T} minecraft:fire_resistance infinite 0 true"],
},
{
  id: "ef-water", cat: "effects",
  title: T("Water breathing", "Подводное дыхание", "Unterwasseratmung"),
  desc: T("Never run out of air underwater.", "Воздух под водой не заканчивается.", "Unter Wasser geht nie die Luft aus."),
  cmds: ["effect give {T} minecraft:water_breathing infinite 0 true"],
},
{
  id: "ef-invis", cat: "effects",
  title: T("Invisibility", "Невидимость", "Unsichtbarkeit"),
  desc: T("Others can't see you — but armor and held items are still visible.", "Вас не видно — но броня и предметы в руках видны.", "Andere sehen dich nicht — Rüstung und gehaltene Items aber schon."),
  cmds: ["effect give {T} minecraft:invisibility infinite 0 true"],
},
{
  id: "ef-slowfall", cat: "effects",
  title: T("Slow falling", "Плавное падение", "Sanfter Fall"),
  desc: T("Float down gently, no fall damage.", "Медленно опускаетесь, без урона от падения.", "Langsam nach unten schweben, kein Fallschaden."),
  cmds: ["effect give {T} minecraft:slow_falling infinite 0 true"],
},
{
  id: "ef-absorption", cat: "effects",
  title: T("Absorption V (+10 hearts)", "Поглощение V (+10 сердец)", "Absorption V (+10 Herzen)"),
  desc: T("Golden extra hearts that absorb damage.", "Золотые доп. сердца, поглощающие урон.", "Goldene Extraherzen, die Schaden abfangen."),
  cmds: ["effect give {T} minecraft:absorption infinite 4 true"],
},
{
  id: "ef-healthboost", cat: "effects",
  title: T("Health Boost V (+10 hearts)", "Прилив здоровья V (+10 сердец)", "Extraenergie V (+10 Herzen)"),
  desc: T("More max health. Heal afterwards to fill the new hearts.", "Больше макс. здоровья. Потом вылечитесь, чтобы заполнить новые сердца.", "Mehr maximale Leben. Danach heilen, um die neuen Herzen zu füllen."),
  cmds: ["effect give {T} minecraft:health_boost infinite 4 true"],
},
{
  id: "ef-dolphin", cat: "effects",
  title: T("Dolphin's Grace + Conduit Power", "Грация дельфина + Сила источника", "Gunst des Delfins + Meereskraft"),
  desc: T("Swim fast, see and mine well underwater.", "Быстро плавать, хорошо видеть и копать под водой.", "Schnell schwimmen, unter Wasser gut sehen und abbauen."),
  cmds: ["effect give {T} minecraft:dolphins_grace infinite 0 true", "effect give {T} minecraft:conduit_power infinite 0 true"],
},
{
  id: "ef-godmode", cat: "effects",
  title: T("“God mode” effect combo", "Набор эффектов «режим бога»", "„Gott-Modus“-Effektkombi"),
  desc: T("No damage, full health, never hungry, fire- and water-proof.", "Без урона, полное здоровье, без голода, защита от огня и воды.", "Kein Schaden, volle Leben, nie hungrig, feuer- und wasserfest."),
  cmds: [
    "effect give {T} minecraft:resistance infinite 4 true",
    "effect give {T} minecraft:regeneration infinite 4 true",
    "effect give {T} minecraft:saturation infinite 255 true",
    "effect give {T} minecraft:fire_resistance infinite 0 true",
    "effect give {T} minecraft:water_breathing infinite 0 true",
  ],
},
{
  id: "ef-clear-one", cat: "effects",
  title: T("Remove one effect", "Снять один эффект", "Einen Effekt entfernen"),
  desc: T("Choose which effect to remove.", "Выберите, какой эффект снять.", "Wähle, welcher Effekt entfernt wird."),
  opts: [{ key: "eff", label: T("Effect", "Эффект", "Effekt"), values: "EFFECTS" }],
  cmds: ["effect clear {T} minecraft:{eff}"],
},
{
  id: "ef-clear-all", cat: "effects",
  title: T("Remove all effects", "Снять все эффекты", "Alle Effekte entfernen"),
  desc: T("Clears every active effect.", "Снимает все активные эффекты.", "Entfernt alle aktiven Effekte."),
  cmds: ["effect clear {T}"],
},

/* ───────────────────────────── PLAYER ───────────────────────────── */
{
  id: "pl-gamemode", cat: "player",
  title: T("Game modes", "Режимы игры", "Spielmodi"),
  desc: T("Switch between survival, creative, adventure and spectator.", "Переключение между выживанием, творчеством, приключением и наблюдателем.", "Wechsel zwischen Überleben, Kreativ, Abenteuer und Zuschauer."),
  cmds: [
    { c: "gamemode survival {T}", label: T("Survival", "Выживание", "Überleben") },
    { c: "gamemode creative {T}", label: T("Creative", "Творческий", "Kreativ") },
    { c: "gamemode adventure {T}", label: T("Adventure (can't break blocks)", "Приключение (нельзя ломать блоки)", "Abenteuer (keine Blöcke abbauen)") },
    { c: "gamemode spectator {T}", label: T("Spectator (fly through walls)", "Наблюдатель (сквозь стены)", "Zuschauer (durch Wände fliegen)") },
  ],
},
{
  id: "pl-heal", cat: "player",
  title: T("Heal instantly", "Мгновенно вылечить", "Sofort heilen"),
  desc: T("Full health and a full hunger bar.", "Полное здоровье и полная сытость.", "Volle Leben und volle Hungerleiste."),
  cmds: ["effect give {T} minecraft:instant_health 1 10 true", "effect give {T} minecraft:saturation 1 255 true"],
},
{
  id: "pl-tp", cat: "player",
  title: T("Teleport to / bring a player", "Телепорт к игроку / призвать игрока", "Zu Spieler teleportieren / Spieler holen"),
  desc: T("Go to a player, or pull a player to you.", "Перейти к игроку или притянуть игрока к себе.", "Zu einem Spieler gehen oder ihn zu dir holen."),
  cmds: [
    { c: "tp @s {NAME}", label: T("Me → player", "Я → игрок", "Ich → Spieler") },
    { c: "tp {NAME} @s", label: T("Player → me", "Игрок → ко мне", "Spieler → zu mir") },
  ],
},
{
  id: "pl-clear", cat: "player",
  title: T("Clear the inventory", "Очистить инвентарь", "Inventar leeren"),
  desc: T("Everything, or just one item type.", "Всё или только один вид предметов.", "Alles oder nur eine Itemart."),
  cmds: [
    { c: "clear {T}", label: T("Everything", "Всё", "Alles") },
    { c: "clear {T} minecraft:dirt", label: T("Only dirt", "Только землю", "Nur Erde") },
  ],
  warn: T("Cleared items are gone for good.", "Удалённые предметы не вернуть.", "Gelöschte Items sind endgültig weg."),
},
{
  id: "pl-damage1000", cat: "player", group: "attributes", single: true,
  title: T("1000 attack damage (bare hands)", "1000 урона (даже рукой)", "1000 Angriffsschaden (auch mit der Hand)"),
  desc: T("Every hit deals 1000 damage. Reset brings back the normal value.", "Каждый удар наносит 1000 урона. Сброс возвращает обычное значение.", "Jeder Schlag macht 1000 Schaden. Reset stellt den Normalwert her."),
  cmds: [
    "attribute {T} minecraft:attack_damage base set 1000",
    { c: "attribute {T} minecraft:attack_damage base set 1", label: T("Reset", "Сброс", "Zurücksetzen") },
    { c: "attribute {T} minecraft:attack_damage base reset", label: T("Reset (alternative)", "Сброс (другой способ)", "Zurücksetzen (Alternative)") },
  ],
},
{
  id: "pl-maxhealth", cat: "player", group: "attributes", single: true,
  title: T("More hearts (max health)", "Больше сердец (макс. здоровье)", "Mehr Herzen (max. Leben)"),
  desc: T("40 = 20 hearts. Heal afterwards to fill them up.", "40 = 20 сердец. Затем вылечитесь, чтобы заполнить их.", "40 = 20 Herzen. Danach heilen, um sie aufzufüllen."),
  cmds: [
    "attribute {T} minecraft:max_health base set 40",
    { c: "attribute {T} minecraft:max_health base reset", label: T("Reset (20)", "Сброс (20)", "Zurücksetzen (20)") },
  ],
},
{
  id: "pl-scale", cat: "player", group: "attributes", single: true,
  title: T("Giant or tiny player", "Великан или малыш", "Riese oder Winzling"),
  desc: T("Scale from 0.0625 to 16. Normal size is 1.", "Размер от 0.0625 до 16. Обычный — 1.", "Größe von 0.0625 bis 16. Normal ist 1."),
  cmds: [
    { c: "attribute {T} minecraft:scale base set 3", label: T("Giant", "Великан", "Riese") },
    { c: "attribute {T} minecraft:scale base set 0.3", label: T("Tiny", "Малыш", "Winzling") },
    { c: "attribute {T} minecraft:scale base reset", label: T("Reset", "Сброс", "Zurücksetzen") },
  ],
},
{
  id: "pl-speed", cat: "player", group: "attributes", single: true,
  title: T("Faster walking", "Быстрая ходьба", "Schneller laufen"),
  desc: T("Normal walking speed is 0.1.", "Обычная скорость — 0.1.", "Normales Tempo ist 0.1."),
  cmds: [
    "attribute {T} minecraft:movement_speed base set 0.2",
    { c: "attribute {T} minecraft:movement_speed base reset", label: T("Reset", "Сброс", "Zurücksetzen") },
  ],
},
{
  id: "pl-jump", cat: "player", group: "attributes", single: true,
  title: T("Super jump & low gravity", "Суперпрыжок и низкая гравитация", "Supersprung & wenig Schwerkraft"),
  desc: T("Normal jump strength is 0.42, normal gravity 0.08.", "Обычная сила прыжка — 0.42, гравитация — 0.08.", "Normale Sprungkraft ist 0.42, Schwerkraft 0.08."),
  cmds: [
    "attribute {T} minecraft:jump_strength base set 1",
    "attribute {T} minecraft:gravity base set 0.03",
    { c: "attribute {T} minecraft:jump_strength base reset", label: T("Reset jump", "Сброс прыжка", "Sprung zurücksetzen") },
    { c: "attribute {T} minecraft:gravity base reset", label: T("Reset gravity", "Сброс гравитации", "Schwerkraft zurücksetzen") },
  ],
},
{
  id: "pl-step", cat: "player", group: "attributes", single: true,
  title: T("Walk up full blocks", "Шагать на целый блок", "Ganze Blöcke hochlaufen"),
  desc: T("Step height 1 = no jumping needed on stairs of full blocks. Normal is 0.6.", "Высота шага 1 — не нужно прыгать на блоки. Обычно 0.6.", "Stufenhöhe 1 = kein Springen auf Blöcke nötig. Normal ist 0.6."),
  cmds: [
    "attribute {T} minecraft:step_height base set 1",
    { c: "attribute {T} minecraft:step_height base reset", label: T("Reset", "Сброс", "Zurücksetzen") },
  ],
},
{
  id: "pl-xp", cat: "player",
  title: T("Experience levels", "Уровни опыта", "Erfahrungslevel"),
  desc: T("Give 30 levels (enough for the best enchantments) or reset to 0.", "Дать 30 уровней (хватит на лучшие зачарования) или обнулить.", "30 Level geben (genug für die besten Verzauberungen) oder auf 0 setzen."),
  cmds: [
    { c: "experience add {T} 30 levels", label: T("+30 levels", "+30 уровней", "+30 Level") },
    { c: "experience add {T} 1000 points", label: T("+1000 points", "+1000 очков", "+1000 Punkte") },
    { c: "experience set {T} 0 levels", label: T("Reset levels", "Обнулить уровни", "Level zurücksetzen") },
    { c: "experience set {T} 0 points", label: T("Reset points", "Обнулить очки", "Punkte zurücksetzen") },
  ],
},
{
  id: "pl-xp-query", cat: "player", single: true,
  title: T("How many levels do I have?", "Сколько у меня уровней?", "Wie viele Level habe ich?"),
  desc: T("Shows the current XP level in chat.", "Показывает текущий уровень опыта в чате.", "Zeigt das aktuelle Level im Chat."),
  cmds: ["experience query {T} levels"],
},
{
  id: "pl-recipes", cat: "player",
  title: T("Unlock all recipes", "Открыть все рецепты", "Alle Rezepte freischalten"),
  desc: T("Fills the recipe book.", "Заполняет книгу рецептов.", "Füllt das Rezeptbuch."),
  cmds: ["recipe give {T} *"],
},
{
  id: "pl-advancements", cat: "player",
  title: T("Grant / revoke all advancements", "Выдать / забрать все достижения", "Alle Fortschritte geben / entziehen"),
  desc: T("Useful for testing — spams chat with messages.", "Полезно для тестов — засыпает чат сообщениями.", "Praktisch zum Testen — flutet den Chat mit Nachrichten."),
  cmds: [
    { c: "advancement grant {T} everything", label: T("Grant", "Выдать", "Geben") },
    { c: "advancement revoke {T} everything", label: T("Revoke", "Забрать", "Entziehen") },
  ],
},
{
  id: "pl-damage", cat: "player", single: true,
  title: T("Deal exact damage", "Нанести точный урон", "Genauen Schaden zufügen"),
  desc: T("4 = two hearts. Handy for testing armor setups.", "4 = два сердца. Удобно для проверки брони.", "4 = zwei Herzen. Praktisch zum Testen von Rüstung."),
  cmds: ["damage {T} 4"],
},
{
  id: "pl-respawn", cat: "player",
  title: T("Respawn (kill yourself)", "Возродиться (убить себя)", "Respawnen (dich selbst töten)"),
  desc: T("Useful when you are stuck.", "Полезно, если вы застряли.", "Hilfreich, wenn du feststeckst."),
  cmds: ["kill @s"],
  warn: T("You drop your items unless keep_inventory is on.", "Вещи выпадут, если не включён keep_inventory.", "Du verlierst deine Items, außer keep_inventory ist an."),
},

/* ───────────────────────────── WORLD ───────────────────────────── */
{
  id: "wd-difficulty", cat: "world",
  title: T("Difficulty", "Сложность", "Schwierigkeit"),
  desc: T("Peaceful removes all hostile mobs.", "На мирной сложности исчезают все враждебные мобы.", "Friedlich entfernt alle feindlichen Mobs."),
  cmds: ["difficulty peaceful", "difficulty easy", "difficulty normal", "difficulty hard"],
},
{
  id: "wd-day", cat: "world", group: "time",
  title: T("Always day", "Всегда день", "Immer Tag"),
  desc: T("Set the time to day and stop the day/night cycle.", "Поставить день и остановить смену дня и ночи.", "Zeit auf Tag setzen und den Tag-Nacht-Zyklus stoppen."),
  cmds: ["time set day", ...grLines("advance_time", "doDaylightCycle", "false")],
  note: GR_NOTE,
},
{
  id: "wd-time", cat: "world", group: "time",
  title: T("Change the time", "Изменить время", "Zeit ändern"),
  desc: T("Jump to a time of day, or ask what time it is.", "Перейти к нужному времени суток или узнать текущее.", "Zu einer Tageszeit springen oder die Uhrzeit abfragen."),
  cmds: ["time set noon", "time set night", "time set midnight", "time add 6000",
    { c: "time query daytime", label: T("What time is it?", "Который час?", "Wie spät ist es?") }],
},
{
  id: "wd-weather", cat: "world", group: "time",
  title: T("Always clear weather", "Всегда ясно", "Immer klares Wetter"),
  desc: T("Stop the rain and keep it from coming back.", "Остановить дождь и не дать ему вернуться.", "Regen stoppen und nicht zurückkommen lassen."),
  cmds: ["weather clear", ...grLines("advance_weather", "doWeatherCycle", "false")],
  note: GR_NOTE,
},
{
  id: "wd-weather-more", cat: "world", group: "time",
  title: T("Rain & thunderstorm", "Дождь и гроза", "Regen & Gewitter"),
  desc: T("A thunderstorm is needed for the Channeling trident.", "Гроза нужна для трезубца с Громовержцем.", "Für den Entladungs-Dreizack braucht es Gewitter."),
  cmds: ["weather rain", "weather thunder"],
},
{
  id: "wd-keepinv", cat: "world", group: "gamerules",
  title: T("Keep inventory on death", "Сохранять вещи при смерти", "Inventar beim Tod behalten"),
  desc: T("You keep all items and XP when you die.", "При смерти вы сохраняете все вещи и опыт.", "Beim Tod behältst du alle Items und XP."),
  cmds: grLines("keep_inventory", "keepInventory", "true"),
  note: GR_NOTE,
},
{
  id: "wd-mobspawn", cat: "world", group: "gamerules",
  title: T("Stop mob spawning", "Отключить спавн мобов", "Mob-Spawning stoppen"),
  desc: T("No mobs spawn naturally anymore.", "Мобы больше не появляются сами.", "Keine Mobs spawnen mehr natürlich."),
  cmds: grLines("spawn_mobs", "doMobSpawning", "false"),
  note: GR_NOTE,
},
{
  id: "wd-monsters", cat: "world", group: "gamerules",
  title: T("Stop only monsters", "Отключить только монстров", "Nur Monster stoppen"),
  desc: T("Animals still spawn, monsters don't. New in 1.21.9, so there is no old name.", "Животные появляются, монстры — нет. Новое в 1.21.9, старого имени нет.", "Tiere spawnen weiter, Monster nicht. Neu in 1.21.9, daher kein alter Name."),
  cmds: grLines("spawn_monsters", null, "false"),
},
{
  id: "wd-griefing", cat: "world", group: "gamerules",
  title: T("Protect blocks from mobs", "Защитить блоки от мобов", "Blöcke vor Mobs schützen"),
  desc: T("Creepers, endermen, withers and the dragon can't destroy blocks.", "Криперы, эндермены, иссушители и дракон не ломают блоки.", "Creeper, Endermen, Wither und Drache zerstören keine Blöcke."),
  cmds: grLines("mob_griefing", "mobGriefing", "false"),
  note: GR_NOTE,
},
{
  id: "wd-fire", cat: "world", group: "gamerules",
  title: T("Stop fire from spreading", "Запретить распространение огня", "Feuerausbreitung stoppen"),
  desc: T(
    "1.21.11 replaced doFireTick with a radius rule: 0 turns fire spread off, -1 means unlimited.",
    "В 1.21.11 doFireTick заменили правилом радиуса: 0 отключает распространение огня, -1 — без ограничений.",
    "1.21.11 hat doFireTick durch eine Radius-Regel ersetzt: 0 schaltet Feuerausbreitung aus, -1 heißt unbegrenzt."
  ),
  cmds: [
    { c: "gamerule fire_spread_radius_around_player 0", label: GR_NEW },
    { c: "gamerule doFireTick false", label: GR_OLD },
  ],
  note: GR_NOTE,
},
{
  id: "wd-sleep", cat: "world", group: "gamerules",
  title: T("One player can skip the night", "Один игрок может пропустить ночь", "Ein Spieler kann die Nacht überspringen"),
  desc: T("0 % = one sleeping player is enough.", "0 % = достаточно одного спящего игрока.", "0 % = ein schlafender Spieler reicht."),
  cmds: grLines("players_sleeping_percentage", "playersSleepingPercentage", "0"),
  note: GR_NOTE,
},
{
  id: "wd-phantoms", cat: "world", group: "gamerules",
  title: T("No phantoms", "Без фантомов", "Keine Phantome"),
  desc: T("Phantoms stop spawning when you don't sleep.", "Фантомы перестают появляться, если вы не спите.", "Phantome spawnen nicht mehr, wenn du nicht schläfst."),
  cmds: grLines("spawn_phantoms", "doInsomnia", "false"),
  note: GR_NOTE,
},
{
  id: "wd-tickspeed", cat: "world", group: "gamerules",
  title: T("Faster crop growth", "Быстрый рост растений", "Schnelleres Pflanzenwachstum"),
  desc: T("Random tick speed: default 3. Higher = crops and trees grow faster.", "Скорость случайных тиков: по умолчанию 3. Больше — растения растут быстрее.", "Zufallstick-Tempo: Standard 3. Höher = Pflanzen wachsen schneller."),
  cmds: [...grLines("random_tick_speed", "randomTickSpeed", "30"),
    { c: "gamerule random_tick_speed 3", label: T("Back to default (1.21.11+)", "По умолчанию (1.21.11+)", "Standard (1.21.11+)") }],
  warn: T("Very high values cause lag.", "Очень большие значения вызывают лаги.", "Sehr hohe Werte verursachen Lag."),
},
{
  id: "wd-tick", cat: "world",
  title: T("Freeze or speed up the game", "Заморозить или ускорить игру", "Spiel einfrieren oder beschleunigen"),
  desc: T("Freeze stops mobs, crops and redstone. Normal tick rate is 20.", "Заморозка останавливает мобов, растения и редстоун. Обычная скорость — 20.", "Einfrieren stoppt Mobs, Pflanzen und Redstone. Normale Tickrate ist 20."),
  cmds: [
    { c: "tick freeze", label: T("Freeze", "Заморозить", "Einfrieren") },
    { c: "tick unfreeze", label: T("Unfreeze", "Разморозить", "Auftauen") },
    { c: "tick rate 40", label: T("Double speed", "Двойная скорость", "Doppeltes Tempo") },
    { c: "tick rate 20", label: T("Normal", "Обычная", "Normal") },
  ],
},
{
  id: "wd-fill", cat: "world", group: "fill",
  title: T("Fill an area with blocks", "Заполнить область блоками", "Bereich mit Blöcken füllen"),
  desc: T(
    "Replace x1 y1 z1 and x2 y2 z2 with two opposite corners (press F3 to see coordinates).",
    "Замените x1 y1 z1 и x2 y2 z2 на два противоположных угла (нажмите F3, чтобы увидеть координаты).",
    "Ersetze x1 y1 z1 und x2 y2 z2 durch zwei gegenüberliegende Ecken (F3 zeigt die Koordinaten)."
  ),
  cmds: [
    { c: "fill x1 y1 z1 x2 y2 z2 minecraft:stone", label: T("Solid", "Сплошная", "Massiv") },
    { c: "fill x1 y1 z1 x2 y2 z2 minecraft:stone hollow", label: T("Hollow box (inside becomes air)", "Полая коробка (внутри воздух)", "Hohle Box (innen wird Luft)") },
    { c: "fill x1 y1 z1 x2 y2 z2 minecraft:stone keep", label: T("Only fill air (keep blocks)", "Только воздух (блоки остаются)", "Nur Luft füllen (Blöcke bleiben)") },
    { c: "fill x1 y1 z1 x2 y2 z2 minecraft:stone replace minecraft:dirt", label: T("Replace dirt with stone", "Заменить землю камнем", "Erde durch Stein ersetzen") },
  ],
  note: T("Max 32,768 blocks per command. Use the Fill generator to count them.", "Максимум 32 768 блоков за команду. Посчитать поможет генератор Fill.", "Max. 32.768 Blöcke pro Befehl. Der Fill-Generator zählt sie für dich."),
},
{
  id: "wd-locate", cat: "world", group: "fill",
  title: T("Find a structure", "Найти строение", "Bauwerk finden"),
  desc: T("Shows the coordinates of the nearest one — click them in chat to teleport.", "Показывает координаты ближайшего — кликните по ним в чате для телепорта.", "Zeigt die Koordinaten des nächsten — im Chat anklicken zum Teleportieren."),
  opts: [{ key: "st", label: T("Structure", "Строение", "Bauwerk"), values: STRUCTURES }],
  cmds: ["locate structure {st}"],
},
{
  id: "wd-locate-biome", cat: "world", group: "fill",
  title: T("Find a biome", "Найти биом", "Biom finden"),
  desc: T("Finds the nearest biome of that type.", "Находит ближайший биом этого типа.", "Findet das nächste Biom dieser Art."),
  opts: [{ key: "bi", label: T("Biome", "Биом", "Biom"), values: BIOMES }],
  cmds: ["locate biome minecraft:{bi}"],
},
{
  id: "wd-seed", cat: "world",
  title: T("World seed", "Сид мира", "Welt-Seed"),
  desc: T("Shows the seed — click it in chat to copy.", "Показывает сид — кликните в чате, чтобы скопировать.", "Zeigt den Seed — im Chat anklicken zum Kopieren."),
  cmds: ["seed"],
},

/* ───────────────────────────── BUILDING ───────────────────────────── */
{
  id: "bd-platform", cat: "building",
  title: T("11×11 floor under you", "Пол 11×11 под вами", "11×11-Boden unter dir"),
  desc: T("Instant platform — great for sky arenas.", "Мгновенная платформа — отлично для арен в небе.", "Sofort-Plattform — super für Himmelsarenen."),
  cmds: ["fill ~-5 ~-1 ~-5 ~5 ~-1 ~5 minecraft:smooth_stone"],
},
{
  id: "bd-arena-box", cat: "building",
  title: T("Glass arena box (31×17×31)", "Стеклянная арена (31×17×31)", "Glas-Arenabox (31×17×31)"),
  desc: T("Builds a hollow glass box around you. Fly high into the sky first.", "Строит полую стеклянную коробку вокруг вас. Сначала поднимитесь высоко в небо.", "Baut eine hohle Glasbox um dich. Flieg vorher hoch in den Himmel."),
  cmds: ["fill ~-15 ~-1 ~-15 ~15 ~15 ~15 minecraft:glass hollow"],
  warn: T("“hollow” turns everything inside into air — including terrain.", "«hollow» превращает всё внутри в воздух — включая местность.", "„hollow“ macht alles im Inneren zu Luft — auch Gelände."),
},
{
  id: "bd-walls", cat: "building",
  title: T("Invisible barrier walls", "Невидимые стены-барьеры", "Unsichtbare Barriere-Wände"),
  desc: T("“outline” only replaces the outer shell and keeps the inside.", "«outline» заменяет только внешнюю оболочку, внутри всё остаётся.", "„outline“ ersetzt nur die Außenhülle, das Innere bleibt."),
  cmds: ["fill ~-15 ~-1 ~-15 ~15 ~15 ~15 minecraft:barrier outline"],
  warn: T("The floor and roof become barriers too.", "Пол и потолок тоже станут барьерами.", "Boden und Decke werden auch zu Barrieren."),
},
{
  id: "bd-clear", cat: "building",
  title: T("Clear an area", "Расчистить область", "Bereich freiräumen"),
  desc: T("Removes all blocks in a 21×11×21 area around you.", "Удаляет все блоки в области 21×11×21 вокруг вас.", "Entfernt alle Blöcke in einem 21×11×21-Bereich um dich."),
  cmds: ["fill ~-10 ~ ~-10 ~10 ~10 ~10 minecraft:air"],
  warn: T("Blocks are deleted for good — no undo!", "Блоки удаляются навсегда — отмены нет!", "Blöcke werden endgültig gelöscht — kein Rückgängig!"),
},
{
  id: "bd-drain", cat: "building",
  title: T("Remove water or lava nearby", "Убрать воду или лаву рядом", "Wasser oder Lava entfernen"),
  desc: T("Only water/lava is replaced, other blocks stay.", "Заменяется только вода/лава, остальные блоки остаются.", "Nur Wasser/Lava wird ersetzt, andere Blöcke bleiben."),
  cmds: [
    "fill ~-10 ~-5 ~-10 ~10 ~5 ~10 minecraft:air replace minecraft:water",
    "fill ~-10 ~-5 ~-10 ~10 ~5 ~10 minecraft:air replace minecraft:lava",
  ],
},
{
  id: "bd-clone", cat: "building",
  title: T("Copy a build (clone)", "Копировать постройку (clone)", "Bauwerk kopieren (clone)"),
  desc: T(
    "Copies the box between the two corners to x y z (the new lowest corner).",
    "Копирует область между двумя углами в точку x y z (новый нижний угол).",
    "Kopiert den Bereich zwischen den zwei Ecken nach x y z (neue unterste Ecke)."
  ),
  cmds: [
    "clone x1 y1 z1 x2 y2 z2 x y z",
    { c: "clone x1 y1 z1 x2 y2 z2 x y z masked", label: T("Skip air blocks", "Без блоков воздуха", "Luftblöcke überspringen") },
    { c: "clone x1 y1 z1 x2 y2 z2 x y z replace move", label: T("Move instead of copy", "Переместить вместо копирования", "Verschieben statt kopieren") },
  ],
  note: T("Max 32,768 blocks, same as fill.", "Максимум 32 768 блоков, как у fill.", "Max. 32.768 Blöcke, wie bei fill."),
},
{
  id: "bd-debugstick", cat: "building",
  title: T("Debug stick", "Отладочная палка", "Debug-Stick"),
  desc: T("Right-click to cycle block states (stair shape, fence sides…), left-click to pick the property.", "ПКМ — сменить состояние блока (форма ступеней, стороны забора…), ЛКМ — выбрать свойство.", "Rechtsklick wechselt Blockzustände (Treppenform, Zaunseiten…), Linksklick wählt die Eigenschaft."),
  cmds: ["give {T} minecraft:debug_stick"],
},
{
  id: "bd-light", cat: "building",
  title: T("Invisible light blocks", "Невидимые блоки света", "Unsichtbare Lichtblöcke"),
  desc: T("Light level 15 without a visible lamp. Only visible while holding one.", "Свет уровня 15 без видимой лампы. Видны, только если держать такой блок.", "Lichtstufe 15 ohne sichtbare Lampe. Nur sichtbar, wenn du einen hältst."),
  cmds: ['give {T} minecraft:light[block_state={level:"15"}] 64'],
},
{
  id: "bd-barrier", cat: "building",
  title: T("Barrier & structure blocks", "Барьеры и структурные блоки", "Barrieren & Konstruktionsblöcke"),
  desc: T("Barriers are invisible walls. Structure blocks save and load builds.", "Барьеры — невидимые стены. Структурные блоки сохраняют и загружают постройки.", "Barrieren sind unsichtbare Wände. Konstruktionsblöcke speichern und laden Bauten."),
  cmds: ["give {T} minecraft:barrier 64", "give {T} minecraft:structure_block"],
},
{
  id: "bd-frame", cat: "building",
  title: T("Invisible item frames", "Невидимые рамки", "Unsichtbare Rahmen"),
  desc: T("The frame disappears, only the item inside is visible.", "Рамка не видна, видно только предмет в ней.", "Der Rahmen verschwindet, nur das Item ist zu sehen."),
  cmds: ['give {T} minecraft:item_frame[entity_data={id:"minecraft:item_frame",Invisible:1b}] 16'],
},
{
  id: "bd-reach", cat: "building", single: true,
  title: T("Long reach for building", "Дальняя досягаемость", "Große Reichweite zum Bauen"),
  desc: T("Place and break blocks 10 blocks away. Normal is 4.5.", "Ставить и ломать блоки на расстоянии 10. Обычно 4.5.", "Blöcke aus 10 Blöcken Entfernung setzen und abbauen. Normal ist 4.5."),
  cmds: [
    "attribute {T} minecraft:block_interaction_range base set 10",
    { c: "attribute {T} minecraft:block_interaction_range base reset", label: T("Reset", "Сброс", "Zurücksetzen") },
  ],
},
{
  id: "bd-breakspeed", cat: "building", single: true,
  title: T("Break blocks faster", "Быстрее ломать блоки", "Blöcke schneller abbauen"),
  desc: T("Multiplies mining speed. Normal is 1.", "Умножает скорость добычи. Обычно 1.", "Multipliziert das Abbautempo. Normal ist 1."),
  cmds: [
    "attribute {T} minecraft:block_break_speed base set 5",
    { c: "attribute {T} minecraft:block_break_speed base reset", label: T("Reset", "Сброс", "Zurücksetzen") },
  ],
},
{
  id: "bd-spawnradius", cat: "building",
  title: T("Exact spawn point (lobbies)", "Точная точка спавна (лобби)", "Exakter Spawnpunkt (Lobbys)"),
  desc: T("New players and players without a bed appear exactly at the world spawn.", "Новые игроки и игроки без кровати появляются ровно на точке спавна.", "Neue Spieler und Spieler ohne Bett erscheinen genau am Welt-Spawn."),
  cmds: ["setworldspawn ~ ~ ~", ...grLines("respawn_radius", "spawnRadius", "0")],
  note: GR_NOTE,
},

/* ───────────────────────────── ENTITIES ───────────────────────────── */
{
  id: "en-warning", cat: "entities",
  title: T("Never use plain “kill @e”", "Никогда не используйте просто «kill @e»", "Niemals nur „kill @e“ benutzen"),
  desc: T(
    "“kill @e” kills EVERYTHING — including all players (you too). Always add a filter like type=!minecraft:player.",
    "«kill @e» убивает ВСЁ — включая всех игроков (и вас). Всегда добавляйте фильтр, например type=!minecraft:player.",
    "„kill @e“ tötet ALLES — auch alle Spieler (dich eingeschlossen). Immer einen Filter wie type=!minecraft:player anhängen."
  ),
  cmds: [],
  warn: T("Players lose their inventory when killed (unless keep_inventory is on).", "Убитые игроки теряют вещи (если не включён keep_inventory).", "Getötete Spieler verlieren ihr Inventar (außer keep_inventory ist an)."),
},
{
  id: "en-kill-nonplayer", cat: "entities",
  title: T("Kill everything except players", "Убить всё, кроме игроков", "Alles außer Spielern töten"),
  desc: T("Clears all mobs and objects in loaded chunks.", "Удаляет всех мобов и объекты в загруженных чанках.", "Entfernt alle Mobs und Objekte in geladenen Chunks."),
  cmds: ["kill @e[type=!minecraft:player]"],
  warn: T(
    "Also removes dropped items, pets, villagers, horses, boats, minecarts, armor stands and item frames!",
    "Также удаляет выпавшие предметы, питомцев, жителей, лошадей, лодки, вагонетки, стойки для брони и рамки!",
    "Entfernt auch gedroppte Items, Haustiere, Dorfbewohner, Pferde, Boote, Loren, Rüstungsständer und Rahmen!"
  ),
},
{
  id: "en-kill-50", cat: "entities",
  title: T("Kill non-players within 50 blocks", "Убить всё, кроме игроков, в радиусе 50", "Nicht-Spieler im Umkreis von 50 töten"),
  desc: T("Same as above, but only near you.", "То же, но только рядом с вами.", "Wie oben, aber nur in deiner Nähe."),
  cmds: ["kill @e[type=!minecraft:player,distance=..50]"],
  warn: T("Also removes pets, villagers, boats and item frames nearby.", "Также удаляет питомцев, жителей, лодки и рамки поблизости.", "Entfernt auch Haustiere, Dorfbewohner, Boote und Rahmen in der Nähe."),
},
{
  id: "en-kill-items", cat: "entities",
  title: T("Remove dropped items only", "Удалить только выпавшие предметы", "Nur gedroppte Items entfernen"),
  desc: T("Reduces lag after big fights.", "Уменьшает лаги после больших боёв.", "Reduziert Lag nach großen Kämpfen."),
  cmds: ["kill @e[type=minecraft:item]", { c: "kill @e[type=minecraft:experience_orb]", label: T("XP orbs", "Сферы опыта", "XP-Kugeln") }],
},
{
  id: "en-kill-type", cat: "entities",
  title: T("Kill one mob type", "Убить мобов одного типа", "Eine Mob-Art töten"),
  desc: T("Choose the mob in the dropdown.", "Выберите моба в списке.", "Wähle den Mob in der Liste."),
  opts: [{ key: "mob", label: T("Mob", "Моб", "Mob"), values: MOB_TYPES }],
  cmds: ["kill @e[type=minecraft:{mob}]"],
},
{
  id: "en-kill-projectiles", cat: "entities",
  title: T("Clean up an arena", "Очистить арену", "Arena aufräumen"),
  desc: T("Removes stuck arrows and leftover end crystals.", "Удаляет застрявшие стрелы и оставшиеся кристаллы Энда.", "Entfernt steckende Pfeile und übrige Endkristalle."),
  cmds: ["kill @e[type=minecraft:arrow]", "kill @e[type=minecraft:spectral_arrow]", "kill @e[type=minecraft:end_crystal]"],
},
{
  id: "en-count", cat: "entities",
  title: T("Count entities (lag check)", "Посчитать сущности (проверка лагов)", "Entitäten zählen (Lag-Check)"),
  desc: T("Chat shows “Test passed, count: …”.", "В чате появится «Test passed, count: …».", "Im Chat steht „Test passed, count: …“."),
  cmds: [
    { c: "execute if entity @e", label: T("All entities", "Все сущности", "Alle Entitäten") },
    { c: "execute if entity @e[type=minecraft:item]", label: T("Dropped items", "Выпавшие предметы", "Gedroppte Items") },
  ],
},
{
  id: "en-glow", cat: "entities",
  title: T("Make nearby mobs glow", "Подсветить мобов рядом", "Mobs in der Nähe leuchten lassen"),
  desc: T("Find hidden mobs through walls for 30 seconds.", "Найти спрятанных мобов сквозь стены на 30 секунд.", "Versteckte Mobs 30 Sekunden durch Wände sehen."),
  cmds: ["effect give @e[type=!minecraft:player,distance=..50] minecraft:glowing 30 0 true"],
},

/* ───────────────────────────── BOSSES ───────────────────────────── */
{
  id: "bo-warning", cat: "bosses",
  title: T("Read this before summoning", "Прочтите перед призывом", "Vor dem Beschwören lesen"),
  desc: T(
    "Turn off mob_griefing (World tab) to protect your builds.",
    "Отключите mob_griefing (вкладка «Мир»), чтобы защитить постройки.",
    "Schalte mob_griefing aus (Reiter „Welt“), um deine Bauten zu schützen."
  ),
  cmds: [],
  warn: T(
    "The Ender Dragon and the Wither destroy blocks. A summoned dragon drops no dragon egg.",
    "Эндер-дракон и иссушитель разрушают блоки. Призванный дракон не оставляет яйцо.",
    "Enderdrache und Wither zerstören Blöcke. Ein beschworener Drache lässt kein Drachenei fallen."
  ),
},
{
  id: "bo-dragon", cat: "bosses",
  title: T("Ender Dragon", "Эндер-дракон", "Enderdrache"),
  desc: T("Spawns 10 blocks above you.", "Появляется в 10 блоках над вами.", "Erscheint 10 Blöcke über dir."),
  cmds: ["summon minecraft:ender_dragon ~ ~10 ~"],
  warn: T("Destroys blocks. No dragon egg.", "Разрушает блоки. Без яйца дракона.", "Zerstört Blöcke. Kein Drachenei."),
},
{
  id: "bo-dragon-active", cat: "bosses",
  title: T("Active dragon (attacks right away)", "Активный дракон (сразу атакует)", "Aktiver Drache (greift sofort an)"),
  desc: T("Phase 0 = circling and attacking.", "Фаза 0 = кружит и атакует.", "Phase 0 = kreisen und angreifen."),
  cmds: ["summon minecraft:ender_dragon ~ ~10 ~ {DragonPhase:0}"],
  warn: T("Destroys blocks. No dragon egg.", "Разрушает блоки. Без яйца дракона.", "Zerstört Blöcke. Kein Drachenei."),
},
{
  id: "bo-dragon-frozen", cat: "bosses",
  title: T("Frozen dragon (statue)", "Замороженный дракон (статуя)", "Eingefrorener Drache (Statue)"),
  desc: T("No AI — it just hangs in the air. Great decoration.", "Без ИИ — просто висит в воздухе. Отличное украшение.", "Keine KI — schwebt nur in der Luft. Tolle Deko."),
  cmds: ["summon minecraft:ender_dragon ~ ~10 ~ {NoAI:1b}"],
},
{
  id: "bo-wither", cat: "bosses",
  title: T("Wither", "Иссушитель", "Wither"),
  desc: T("Explodes when it spawns, then attacks everything.", "Взрывается при появлении, затем атакует всех.", "Explodiert beim Erscheinen und greift dann alles an."),
  cmds: ["summon minecraft:wither ~ ~5 ~"],
  warn: T("Destroys blocks.", "Разрушает блоки.", "Zerstört Blöcke."),
},
{
  id: "bo-warden", cat: "bosses",
  title: T("Warden", "Хранитель", "Wärter"),
  desc: T("Blind but hears everything — and hits very hard.", "Слепой, но всё слышит — и бьёт очень сильно.", "Blind, hört aber alles — und schlägt sehr hart zu."),
  cmds: ["summon minecraft:warden ~ ~ ~"],
},
{
  id: "bo-elder", cat: "bosses",
  title: T("Elder Guardian", "Древний страж", "Großer Wächter"),
  desc: T("Best summoned in water. Gives Mining Fatigue.", "Лучше призывать в воде. Накладывает Усталость.", "Am besten im Wasser beschwören. Gibt Abbaulähmung."),
  cmds: ["summon minecraft:elder_guardian ~ ~ ~"],
},
{
  id: "bo-giant", cat: "bosses",
  title: T("Giant (hidden mob)", "Великан (скрытый моб)", "Riese (versteckter Mob)"),
  desc: T("A huge zombie that exists only via commands. It doesn't move.", "Огромный зомби, доступный только через команды. Не двигается.", "Ein riesiger Zombie, nur per Befehl. Er bewegt sich nicht."),
  cmds: ["summon minecraft:giant ~ ~ ~"],
},
{
  id: "bo-remove", cat: "bosses",
  title: T("Remove bosses", "Убрать боссов", "Bosse entfernen"),
  desc: T("Kills all bosses of that type.", "Убивает всех боссов этого типа.", "Tötet alle Bosse dieser Art."),
  cmds: [
    "kill @e[type=minecraft:ender_dragon]",
    "kill @e[type=minecraft:wither]",
    "kill @e[type=minecraft:warden]",
  ],
},

/* ───────────────────────────── FUN ───────────────────────────── */
{
  id: "fun-lightning", cat: "fun",
  title: T("Strike with lightning", "Ударить молнией", "Blitz einschlagen lassen"),
  desc: T("Lightning hits the target player.", "Молния бьёт в выбранного игрока.", "Ein Blitz trifft den Zielspieler."),
  cmds: ["execute at {T} run summon minecraft:lightning_bolt ~ ~ ~"],
  warn: T("Can start fires and hurts.", "Может поджечь и ранит.", "Kann Feuer legen und verletzt."),
},
{
  id: "fun-levitate", cat: "fun",
  title: T("Float into the air", "Взлететь в воздух", "In die Luft schweben"),
  desc: T("Levitation for 3 seconds. Add slow falling to land safely.", "Левитация на 3 секунды. Плавное падение — для мягкой посадки.", "Schwebekraft für 3 Sekunden. Sanfter Fall für eine sichere Landung."),
  cmds: ["effect give {T} minecraft:levitation 3 5 true", "effect give {T} minecraft:slow_falling 15 0 true"],
},
{
  id: "fun-fireworks", cat: "fun",
  title: T("Firework show rockets", "Ракеты для салюта", "Feuerwerks-Raketen für eine Show"),
  desc: T("Pick a shape and color, then launch them.", "Выберите форму и цвет — и запускайте.", "Form und Farbe wählen und abfeuern."),
  opts: [
    { key: "shape", label: T("Shape", "Форма", "Form"), values: ["large_ball", "small_ball", "star", "creeper", "burst"] },
    { key: "col", label: T("Color", "Цвет", "Farbe"), values: DYE_COLORS },
  ],
  cmds: ['give {T} minecraft:firework_rocket[fireworks={flight_duration:2,explosions:[{shape:"{shape}",colors:[{col}],has_trail:true,has_twinkle:true}]}] 16'],
},
{
  id: "fun-particles", cat: "fun",
  title: T("Totem particle burst", "Взрыв частиц тотема", "Totem-Partikelexplosion"),
  desc: T("A colorful celebration effect at your position.", "Красочный праздничный эффект на вашей позиции.", "Ein bunter Jubel-Effekt an deiner Position."),
  cmds: ["particle minecraft:totem_of_undying ~ ~1 ~ 0.5 1 0.5 0.5 300"],
},
{
  id: "fun-slowmo", cat: "fun",
  title: T("Slow motion", "Замедленная съёмка", "Zeitlupe"),
  desc: T("The whole world runs at 1/4 speed.", "Весь мир работает на 1/4 скорости.", "Die ganze Welt läuft mit 1/4 Tempo."),
  cmds: ["tick rate 5", { c: "tick rate 20", label: T("Back to normal", "Вернуть как было", "Zurück zu normal") }],
},
{
  id: "fun-dice", cat: "fun",
  title: T("Roll a dice", "Бросить кубик", "Würfeln"),
  desc: T("Everyone sees the result in chat.", "Все видят результат в чате.", "Alle sehen das Ergebnis im Chat."),
  cmds: ["random roll 1..6"],
},
{
  id: "fun-growl", cat: "fun",
  title: T("Scary dragon roar", "Страшный рёв дракона", "Gruseliges Drachengebrüll"),
  desc: T("Every player hears it right next to them.", "Каждый игрок слышит его прямо рядом.", "Jeder Spieler hört es direkt neben sich."),
  cmds: ["execute as @a at @s run playsound minecraft:entity.ender_dragon.growl master @s ~ ~ ~ 1 1"],
},

/* ───────────────────────────── KITS ───────────────────────────── */
{
  id: "kit-equip", cat: "kits",
  title: T("Equip armor directly", "Надеть броню сразу", "Rüstung direkt anlegen"),
  desc: T(
    "item replace puts the piece straight onto the body instead of into the inventory.",
    "item replace надевает часть брони сразу на игрока, а не кладёт в инвентарь.",
    "item replace zieht das Teil direkt an, statt es ins Inventar zu legen."
  ),
  cmds: [
    `item replace entity {T} armor.head with minecraft:netherite_helmet[enchantments={${ENC.helmet}}]`,
    `item replace entity {T} armor.chest with minecraft:netherite_chestplate[enchantments={${ENC.chestplate}}]`,
    `item replace entity {T} armor.legs with minecraft:netherite_leggings[enchantments={${ENC.leggings}}]`,
    `item replace entity {T} armor.feet with minecraft:netherite_boots[enchantments={${ENC.boots}}]`,
  ],
},
{
  id: "kit-offhand", cat: "kits",
  title: T("Fill the offhand", "Заполнить вторую руку", "Nebenhand füllen"),
  desc: T(
    "Slot names: weapon.mainhand, weapon.offhand, armor.head/chest/legs/feet, hotbar.0–8, inventory.0–26.",
    "Названия слотов: weapon.mainhand, weapon.offhand, armor.head/chest/legs/feet, hotbar.0–8, inventory.0–26.",
    "Slot-Namen: weapon.mainhand, weapon.offhand, armor.head/chest/legs/feet, hotbar.0–8, inventory.0–26."
  ),
  cmds: [
    "item replace entity {T} weapon.offhand with minecraft:totem_of_undying",
    "item replace entity {T} hotbar.0 with minecraft:golden_apple 64",
  ],
},
{
  id: "kit-clear-first", cat: "kits",
  title: T("Wipe before handing out a kit", "Очистить перед выдачей набора", "Vor der Kit-Ausgabe leeren"),
  desc: T(
    "Put these in front of the chain so nobody keeps items from the last round.",
    "Поставьте их в начало цепочки, чтобы никто не остался с вещами прошлого раунда.",
    "An den Anfang der Kette setzen, damit niemand Items aus der letzten Runde behält."
  ),
  cmds: ["clear @a", "effect clear @a", "xp set @a 0 levels"],
  warn: T("Deletes everything players are carrying.", "Удаляет все вещи игроков.", "Löscht alles, was die Spieler tragen."),
},
{
  id: "kit-chest", cat: "kits",
  title: T("Whole kit in one chest", "Весь набор в одном сундуке", "Ganzes Kit in einer Truhe"),
  desc: T(
    "One setblock places a filled chest — the only way to hand out a kit with a single command. Build yours with the Kit builder.",
    "Один setblock ставит заполненный сундук — единственный способ выдать набор одной командой. Соберите свой в конструкторе наборов.",
    "Ein setblock setzt eine gefüllte Truhe — der einzige Weg, ein Kit mit einem Befehl zu vergeben. Bau deins im Kit-Baukasten."
  ),
  cmds: ['setblock ~1 ~ ~ minecraft:chest{Items:[{Slot:0b,id:"minecraft:netherite_sword",count:1,components:{"minecraft:enchantments":{"minecraft:sharpness":5}}},{Slot:1b,id:"minecraft:golden_apple",count:64}]}'],
  note: T(
    "Too long for chat once it holds a real kit — command block only.",
    "С полным набором команда слишком длинная для чата — только командный блок.",
    "Mit einem echten Kit zu lang für den Chat — nur Befehlsblock."
  ),
},
{
  id: "kit-barrel", cat: "kits",
  title: T("Loot barrel from a loot table", "Бочка с лутом из лут-таблицы", "Beutefass aus einer Loot-Tabelle"),
  desc: T(
    "Fills a container with real vanilla structure loot — different every time.",
    "Заполняет контейнер настоящим лутом из структур — каждый раз разным.",
    "Füllt einen Behälter mit echtem Struktur-Loot — jedes Mal anders."
  ),
  opts: [{ key: "table", label: T("Loot table", "Лут-таблица", "Loot-Tabelle"), values: [
    "minecraft:chests/end_city_treasure", "minecraft:chests/ancient_city", "minecraft:chests/bastion_treasure",
    "minecraft:chests/nether_bridge", "minecraft:chests/stronghold_library", "minecraft:chests/simple_dungeon",
    "minecraft:chests/buried_treasure", "minecraft:chests/shipwreck_treasure", "minecraft:chests/woodland_mansion",
  ] }],
  cmds: [
    { c: "setblock ~1 ~ ~ minecraft:barrel", label: T("1. Place the container", "1. Поставить контейнер", "1. Behälter setzen") },
    { c: "loot insert ~1 ~ ~ loot {table}", label: T("2. Fill it", "2. Заполнить", "2. Befüllen") },
    { c: "loot give {T} loot {table}", label: T("Straight into the inventory instead", "Или сразу в инвентарь", "Oder direkt ins Inventar") },
  ],
},

/* ───────────────────────────── OVERPOWERED ───────────────────────────── */
{
  id: "op-godsword", cat: "op", overmax: true,
  title: T("God sword (Sharpness 255)", "Меч бога (Острота 255)", "Gott-Schwert (Schärfe 255)"),
  desc: T(
    "Levels above the vanilla maximum are legal in the enchantments component — only /enchant refuses them.",
    "Уровни выше ванильного максимума допустимы в компоненте enchantments — их не принимает только /enchant.",
    "Stufen über dem Vanilla-Maximum sind in der enchantments-Komponente erlaubt — nur /enchant lehnt sie ab."
  ),
  cmds: ['give {T} minecraft:netherite_sword[enchantments={"minecraft:sharpness":255,"minecraft:knockback":10,"minecraft:fire_aspect":10,"minecraft:looting":10},unbreakable={}]'],
},
{
  id: "op-godarmor", cat: "op", overmax: true,
  title: T("God armor (Protection 255)", "Броня бога (Защита 255)", "Gott-Rüstung (Schutz 255)"),
  desc: T(
    "Unbreakable and effectively immune to normal damage.",
    "Неразрушимая и практически неуязвимая к обычному урону.",
    "Unzerstörbar und praktisch immun gegen normalen Schaden."
  ),
  cmds: [
    'give {T} minecraft:netherite_helmet[enchantments={"minecraft:protection":255,"minecraft:respiration":10,"minecraft:thorns":10},unbreakable={}]',
    'give {T} minecraft:netherite_chestplate[enchantments={"minecraft:protection":255,"minecraft:thorns":10},unbreakable={}]',
    'give {T} minecraft:netherite_leggings[enchantments={"minecraft:protection":255,"minecraft:swift_sneak":10},unbreakable={}]',
    'give {T} minecraft:netherite_boots[enchantments={"minecraft:protection":255,"minecraft:feather_falling":10,"minecraft:depth_strider":10},unbreakable={}]',
  ],
},
{
  id: "op-1000", cat: "op", overmax: true,
  title: T("1000-damage sword", "Меч на 1000 урона", "Schwert mit 1000 Schaden"),
  desc: T(
    "An attribute modifier on the item itself — works for anyone holding it.",
    "Модификатор атрибута на самом предмете — работает у любого, кто его держит.",
    "Ein Attribut-Modifikator am Item selbst — wirkt bei jedem, der es hält."
  ),
  cmds: ['give {T} minecraft:netherite_sword[attribute_modifiers=[{type:"minecraft:attack_damage",amount:1000,operation:"add_value",id:"minecraft:max_damage",slot:"mainhand"}],enchantments={"minecraft:sharpness":255}]'],
},
{
  id: "op-onehit", cat: "op", single: true,
  title: T("One-hit fists", "Убийство с одного удара", "Ein-Schlag-Fäuste"),
  desc: T("2048 is the hard cap of the attack_damage attribute.", "2048 — жёсткий предел атрибута attack_damage.", "2048 ist die Obergrenze des Attributs attack_damage."),
  cmds: [
    "attribute {T} minecraft:attack_damage base set 2048",
    { c: "attribute {T} minecraft:attack_damage base reset", label: T("Undo", "Отменить", "Rückgängig") },
  ],
},
{
  id: "op-immortal", cat: "op", single: true,
  title: T("Immortality", "Бессмертие", "Unsterblichkeit"),
  desc: T(
    "1024 hearts of health, full damage immunity and no knockback.",
    "1024 единицы здоровья, полная неуязвимость и никакого отбрасывания.",
    "1024 Lebenspunkte, komplette Schadensimmunität und kein Rückstoß."
  ),
  cmds: [
    "attribute {T} minecraft:max_health base set 1024",
    "attribute {T} minecraft:knockback_resistance base set 1",
    "attribute {T} minecraft:explosion_knockback_resistance base set 1",
    "effect give {T} minecraft:resistance infinite 4 true",
    "effect give {T} minecraft:instant_health 1 100 true",
  ],
  note: T("Reset with: attribute … base reset", "Сброс: attribute … base reset", "Zurücksetzen mit: attribute … base reset"),
},
{
  id: "op-reach", cat: "op", single: true,
  title: T("64-block reach", "Досягаемость 64 блока", "64 Blöcke Reichweite"),
  desc: T("64 is the maximum for both interaction ranges.", "64 — максимум для обоих радиусов взаимодействия.", "64 ist das Maximum für beide Interaktionsreichweiten."),
  cmds: [
    "attribute {T} minecraft:block_interaction_range base set 64",
    "attribute {T} minecraft:entity_interaction_range base set 64",
    { c: "attribute {T} minecraft:block_interaction_range base reset", label: T("Undo", "Отменить", "Rückgängig") },
  ],
},
{
  id: "op-instamine", cat: "op", single: true,
  title: T("Break anything instantly", "Ломать всё мгновенно", "Alles sofort abbauen"),
  desc: T("Mining speed multiplier — bedrock still refuses.", "Множитель скорости добычи — бедрок всё равно не сломать.", "Multiplikator fürs Abbautempo — Grundgestein bleibt unzerstörbar."),
  cmds: [
    "attribute {T} minecraft:block_break_speed base set 1024",
    "attribute {T} minecraft:submerged_mining_speed base set 20",
    "effect give {T} minecraft:haste infinite 5 true",
  ],
},
{
  id: "op-speed", cat: "op", single: true,
  title: T("Ten times walking speed", "Скорость ходьбы ×10", "Zehnfaches Lauftempo"),
  desc: T("Default is 0.1. Above ~0.5 the server may reject your movement.", "По умолчанию 0.1. Выше ~0.5 сервер может отклонять движение.", "Standard ist 0.1. Über ~0,5 kann der Server die Bewegung ablehnen."),
  cmds: [
    "attribute {T} minecraft:movement_speed base set 1",
    { c: "attribute {T} minecraft:movement_speed base reset", label: T("Undo", "Отменить", "Rückgängig") },
  ],
},
{
  id: "op-jump", cat: "op", single: true,
  title: T("Moon jump", "Лунный прыжок", "Mondsprung"),
  desc: T("High jump, low gravity, and fall damage switched off.", "Высокий прыжок, низкая гравитация и отключённый урон от падения.", "Hoher Sprung, wenig Schwerkraft und kein Fallschaden."),
  cmds: [
    "attribute {T} minecraft:jump_strength base set 3",
    "attribute {T} minecraft:gravity base set 0.02",
    "attribute {T} minecraft:fall_damage_multiplier base set 0",
    "attribute {T} minecraft:safe_fall_distance base set 1024",
  ],
},
{
  id: "op-tank", cat: "op", single: true,
  title: T("Walking tank", "Ходячий танк", "Wandelnder Panzer"),
  desc: T("Maximum armor points, toughness and knockback power.", "Максимум брони, прочности и силы отбрасывания.", "Maximale Rüstungspunkte, Härte und Rückstoßkraft."),
  cmds: [
    "attribute {T} minecraft:armor base set 30",
    "attribute {T} minecraft:armor_toughness base set 20",
    "attribute {T} minecraft:attack_knockback base set 5",
    "attribute {T} minecraft:max_absorption base set 100",
  ],
},
{
  id: "op-bow", cat: "op", overmax: true,
  title: T("God bow & mace", "Лук и булава бога", "Gott-Bogen & -Streitkolben"),
  desc: T("Over-max Power and Density, plus unbreakable.", "Сила и Плотность выше максимума, плюс неразрушимость.", "Stärke und Dichte über dem Maximum, dazu unzerstörbar."),
  cmds: [
    'give {T} minecraft:bow[enchantments={"minecraft:power":255,"minecraft:punch":10,"minecraft:flame":1,"minecraft:infinity":1},unbreakable={}]',
    'give {T} minecraft:mace[enchantments={"minecraft:density":255,"minecraft:wind_burst":10,"minecraft:fire_aspect":10},unbreakable={}]',
    "give {T} minecraft:arrow 1",
  ],
},
{
  id: "op-creeper", cat: "op",
  title: T("Mega creeper", "Мега-крипер", "Mega-Creeper"),
  desc: T(
    "Explosion radius 20 instead of 3, already ignited.",
    "Радиус взрыва 20 вместо 3, уже подожжён.",
    "Explosionsradius 20 statt 3, bereits gezündet."
  ),
  cmds: ["summon minecraft:creeper ~ ~ ~5 {ExplosionRadius:20b,Fuse:60s,ignited:1b,powered:1b}"],
  warn: T(
    "Leaves a huge crater. Turn off mob_griefing first if you want your build to survive.",
    "Оставляет огромный кратер. Сначала отключите mob_griefing, если хотите сохранить постройку.",
    "Hinterlässt einen riesigen Krater. Schalte vorher mob_griefing aus, wenn dein Bau überleben soll."
  ),
},
{
  id: "op-everyone", cat: "op",
  title: T("Make every player a god", "Сделать богом каждого игрока", "Jeden Spieler zum Gott machen"),
  desc: T(
    "execute as @a runs a single-target command once per player — that is how you apply attributes to everyone.",
    "execute as @a выполняет команду по разу на каждого игрока — так атрибуты выдаются всем.",
    "execute as @a führt einen Einzelziel-Befehl pro Spieler aus — so bekommen alle die Attribute."
  ),
  cmds: [
    "execute as @a run attribute @s minecraft:max_health base set 200",
    "execute as @a run attribute @s minecraft:attack_damage base set 100",
    "effect give @a minecraft:resistance infinite 4 true",
  ],
},

/* ───────────────────────────── DISPLAY & SOUND ───────────────────────────── */
{
  id: "dp-title", cat: "display",
  title: T("Big title on screen", "Крупный заголовок на экране", "Großer Titel auf dem Bildschirm"),
  desc: T(
    "times sets fade-in / stay / fade-out in ticks (20 ticks = 1 second).",
    "times задаёт появление / показ / исчезание в тиках (20 тиков = 1 секунда).",
    "times setzt Einblenden / Anzeigen / Ausblenden in Ticks (20 Ticks = 1 Sekunde)."
  ),
  cmds: [
    'title {T} times 10 60 20',
    'title {T} subtitle {"text":"Round 2","color":"gray"}',
    'title {T} title {"text":"FIGHT!","color":"red","bold":true}',
    { c: "title {T} clear", label: T("Clear it", "Убрать", "Entfernen") },
  ],
},
{
  id: "dp-actionbar", cat: "display",
  title: T("Text above the hotbar", "Текст над хотбаром", "Text über der Hotbar"),
  desc: T("Short status lines, no interruption.", "Короткие строки статуса, ничего не перекрывают.", "Kurze Statuszeilen, die nichts verdecken."),
  cmds: ['title {T} actionbar {"text":"Zone closing in 30s","color":"gold"}'],
},
{
  id: "dp-tellraw", cat: "display",
  title: T("Formatted chat message", "Форматированное сообщение в чат", "Formatierte Chatnachricht"),
  desc: T(
    "Several parts in one message, each with its own colour and style.",
    "Несколько частей в одном сообщении, у каждой свой цвет и стиль.",
    "Mehrere Teile in einer Nachricht, jeder mit eigener Farbe und Formatierung."
  ),
  cmds: [
    'tellraw {T} {"text":"Welcome!","color":"gold","bold":true}',
    'tellraw {T} [{"text":"[Arena] ","color":"dark_gray"},{"text":"Match starts now","color":"green"}]',
  ],
},
{
  id: "dp-selector-text", cat: "display",
  title: T("Put a player name into the text", "Вставить имя игрока в текст", "Spielernamen in den Text einsetzen"),
  desc: T(
    "A selector inside a text component is replaced by the matching player names.",
    "Селектор внутри текстового компонента заменяется именами подходящих игроков.",
    "Ein Selektor im Textbaustein wird durch die passenden Spielernamen ersetzt."
  ),
  cmds: [
    'tellraw @a [{"selector":"@p","color":"yellow"},{"text":" reached the flag!"}]',
    'title @a actionbar {"score":{"name":"*","objective":"kills"},"color":"aqua"}',
  ],
  note: T(
    "The score version needs an objective called kills (see PvP → arena).",
    "Вариант со счётом требует цель kills (см. PvP → арена).",
    "Die score-Variante braucht ein Ziel namens kills (siehe PvP → Arena)."
  ),
},
{
  id: "dp-say", cat: "display",
  title: T("say & me", "say и me", "say & me"),
  desc: T(
    "say shows the block name in brackets; me writes in third person.",
    "say показывает имя блока в скобках; me пишет от третьего лица.",
    "say zeigt den Blocknamen in Klammern; me schreibt in der dritten Person."
  ),
  cmds: ["say Match starts in 10 seconds", "me opened the gates"],
},
{
  id: "dp-sound", cat: "display",
  title: T("Play a sound for everyone", "Проиграть звук всем", "Ton für alle abspielen"),
  desc: T(
    "playsound <sound> <source> <targets> [pos] [volume] [pitch]. Run it at each player so distance doesn't matter.",
    "playsound <звук> <источник> <цели> [позиция] [громкость] [высота]. Выполняйте у каждого игрока, чтобы расстояние не мешало.",
    "playsound <Ton> <Quelle> <Ziele> [Position] [Lautstärke] [Tonhöhe]. Bei jedem Spieler ausführen, dann spielt die Entfernung keine Rolle."
  ),
  opts: [{ key: "snd", label: T("Sound", "Звук", "Ton"), values: [
    "minecraft:entity.ender_dragon.growl", "minecraft:block.note_block.pling", "minecraft:entity.player.levelup",
    "minecraft:entity.lightning_bolt.thunder", "minecraft:block.bell.use", "minecraft:entity.wither.spawn",
    "minecraft:ui.toast.challenge_complete", "minecraft:entity.experience_orb.pickup", "minecraft:block.anvil.land",
  ] }],
  cmds: [
    "execute as {T} at @s run playsound {snd} master @s ~ ~ ~ 1 1",
    { c: "stopsound {T}", label: T("Stop all sounds", "Остановить все звуки", "Alle Töne stoppen") },
  ],
},
{
  id: "dp-particle", cat: "display",
  title: T("Particles", "Частицы", "Partikel"),
  desc: T(
    "particle <name> <pos> <dx> <dy> <dz> <speed> <count> — dx/dy/dz spread the particles around the position.",
    "particle <имя> <позиция> <dx> <dy> <dz> <скорость> <количество> — dx/dy/dz задают разброс вокруг точки.",
    "particle <Name> <Position> <dx> <dy> <dz> <Tempo> <Anzahl> — dx/dy/dz streuen die Partikel um die Position."
  ),
  opts: [{ key: "par", label: T("Particle", "Частица", "Partikel"), values: [
    "minecraft:flame", "minecraft:soul_fire_flame", "minecraft:heart", "minecraft:happy_villager",
    "minecraft:angry_villager", "minecraft:totem_of_undying", "minecraft:end_rod", "minecraft:explosion",
    "minecraft:smoke", "minecraft:crit", "minecraft:enchant", "minecraft:portal",
  ] }],
  cmds: [
    "particle {par} ~ ~1 ~ 0.5 0.5 0.5 0.1 100",
    { c: "execute at {T} run particle {par} ~ ~1 ~ 0.4 0.8 0.4 0.05 60", label: T("At the player", "У игрока", "Beim Spieler") },
    { c: 'particle minecraft:dust{color:[1.0,0.2,0.2],scale:2.0} ~ ~1 ~ 0.5 0.5 0.5 0 80', label: T("Coloured dust", "Цветная пыль", "Farbiger Staub") },
  ],
},
{
  id: "dp-scoreboard", cat: "display",
  title: T("Your own sidebar counter", "Свой счётчик сбоку", "Eigener Zähler in der Seitenleiste"),
  desc: T(
    "A dummy objective is a number you control yourself — coins, points, lives.",
    "Цель типа dummy — это число, которым управляете вы: монеты, очки, жизни.",
    "Ein dummy-Ziel ist eine Zahl, die du selbst steuerst — Münzen, Punkte, Leben."
  ),
  cmds: [
    'scoreboard objectives add coins dummy {"text":"Coins","color":"gold"}',
    "scoreboard objectives setdisplay sidebar coins",
    "scoreboard players set {T} coins 100",
    "scoreboard players add {T} coins 5",
    "scoreboard players remove {T} coins 5",
    { c: "scoreboard players get {T} coins", label: T("Read the value", "Прочитать значение", "Wert auslesen") },
  ],
},
{
  id: "dp-tag", cat: "display",
  title: T("Tags — your own player groups", "Теги — свои группы игроков", "Tags — eigene Spielergruppen"),
  desc: T(
    "Tags are invisible labels you can select on later: @a[tag=vip].",
    "Теги — невидимые метки, по которым потом можно выбирать: @a[tag=vip].",
    "Tags sind unsichtbare Markierungen, nach denen du später auswählen kannst: @a[tag=vip]."
  ),
  cmds: [
    "tag {T} add vip",
    "tag {T} remove vip",
    { c: "give @a[tag=vip] minecraft:diamond 5", label: T("Use it in a selector", "Использовать в селекторе", "Im Selektor benutzen") },
    { c: "tag {T} list", label: T("List tags", "Список тегов", "Tags auflisten") },
  ],
},
{
  id: "dp-bossbar-custom", cat: "display",
  title: T("Custom boss bar", "Своя полоса босса", "Eigene Bossleiste"),
  desc: T(
    "A bar at the top of the screen you fill yourself — timers, objectives, events.",
    "Полоса вверху экрана, которую вы заполняете сами: таймеры, цели, события.",
    "Eine Leiste oben am Bildschirm, die du selbst füllst — Timer, Ziele, Ereignisse."
  ),
  cmds: [
    'bossbar add hub:event {"text":"Next event","color":"yellow"}',
    "bossbar set hub:event players @a",
    "bossbar set hub:event color yellow",
    "bossbar set hub:event style notched_10",
    "bossbar set hub:event max 60",
    "bossbar set hub:event value 45",
    { c: "bossbar remove hub:event", label: T("Remove", "Удалить", "Entfernen") },
  ],
},

/* ───────────────────────────── UNUSUAL & ADVANCED ───────────────────────────── */
{
  id: "un-execute-detect", cat: "unusual",
  title: T("Run something only if a condition is true", "Выполнять только при условии", "Nur bei erfüllter Bedingung ausführen"),
  desc: T(
    "The classic repeating-block pattern: check every player, act only on the ones that match.",
    "Классический приём для повторяющегося блока: проверять каждого игрока и действовать только на подходящих.",
    "Das klassische Muster für Wiederholungsblöcke: jeden Spieler prüfen und nur bei Treffern handeln."
  ),
  cmds: [
    { c: "execute as @a at @s if block ~ ~-1 ~ minecraft:gold_block run effect give @s minecraft:speed 2 4 true", label: T("Standing on a block", "Стоит на блоке", "Steht auf einem Block") },
    { c: "execute as @a at @s if entity @e[type=minecraft:zombie,distance=..5] run damage @s 2", label: T("Enemy nearby", "Враг рядом", "Gegner in der Nähe") },
    { c: "execute as @a if items entity @s weapon.mainhand minecraft:diamond run tag @s add holding_diamond", label: T("Holding an item", "Держит предмет", "Hält ein Item") },
    { c: "execute as @a at @s unless block ~ ~-1 ~ minecraft:air run say on solid ground", label: T("unless = the opposite", "unless = наоборот", "unless = das Gegenteil") },
  ],
  note: T(
    "Put these in a Repeat + Always Active block to check 20 times per second.",
    "Поставьте в повторяющийся блок с «Всегда активен», чтобы проверять 20 раз в секунду.",
    "In einen Wiederholungsblock mit „Immer aktiv“ setzen, um 20-mal pro Sekunde zu prüfen."
  ),
},
{
  id: "un-execute-positioned", cat: "unusual",
  title: T("Move the execution point", "Сдвинуть точку выполнения", "Den Ausführungspunkt verschieben"),
  desc: T(
    "positioned, facing and ^ local coordinates let one block act anywhere in the world.",
    "positioned, facing и локальные координаты ^ позволяют одному блоку действовать где угодно.",
    "positioned, facing und lokale ^-Koordinaten lassen einen Block überall wirken."
  ),
  cmds: [
    { c: "execute at {T} run summon minecraft:lightning_bolt ~ ~ ~", label: T("At the player", "В точке игрока", "Beim Spieler") },
    { c: "execute at {T} positioned ~ ~10 ~ run summon minecraft:tnt", label: T("10 blocks above", "На 10 блоков выше", "10 Blöcke darüber") },
    { c: "execute as {T} at @s anchored eyes run particle minecraft:flame ^ ^ ^3 0 0 0 0 1", label: T("3 blocks in front of the eyes", "В 3 блоках перед глазами", "3 Blöcke vor den Augen") },
    { c: "execute at {T} facing entity @e[type=!minecraft:player,limit=1,sort=nearest] eyes run particle minecraft:end_rod ^ ^ ^1 0 0 0 0 1", label: T("Pointing at the nearest mob", "В сторону ближайшего моба", "Richtung nächster Mob") },
  ],
},
{
  id: "un-ride", cat: "unusual",
  title: T("Stack entities on top of each other", "Посадить сущности друг на друга", "Entitäten aufeinander setzen"),
  desc: T(
    "ride mounts one entity onto another — chickens on zombies, players on dragons.",
    "ride сажает одну сущность на другую — курицу на зомби, игрока на дракона.",
    "ride setzt eine Entität auf eine andere — Huhn auf Zombie, Spieler auf Drachen."
  ),
  cmds: [
    "summon minecraft:zombie ~ ~ ~2",
    "execute as {T} run ride @s mount @e[type=minecraft:zombie,limit=1,sort=nearest]",
    { c: "ride {T} dismount", label: T("Get off", "Слезть", "Absteigen") },
  ],
},
{
  id: "un-marker", cat: "unusual",
  title: T("Invisible position marker", "Невидимый маркер позиции", "Unsichtbare Positionsmarkierung"),
  desc: T(
    "A marker armor stand has no hitbox and no gravity — the standard anchor for command contraptions.",
    "Стойка-маркер без хитбокса и гравитации — стандартный якорь для командных механизмов.",
    "Ein Marker-Rüstungsständer hat keine Hitbox und keine Schwerkraft — der Standard-Anker für Befehlskonstruktionen."
  ),
  cmds: [
    'summon minecraft:armor_stand ~ ~ ~ {Marker:1b,Invisible:1b,NoGravity:1b,Tags:["anchor"]}',
    { c: "execute at @e[tag=anchor,limit=1] run particle minecraft:end_rod ~ ~1 ~ 0 0 0 0 5", label: T("Use it as a position", "Использовать как точку", "Als Position nutzen") },
    { c: "kill @e[tag=anchor]", label: T("Remove markers", "Удалить маркеры", "Marker entfernen") },
  ],
},
{
  id: "un-data", cat: "unusual",
  title: T("Read and change NBT data", "Читать и менять NBT-данные", "NBT-Daten lesen und ändern"),
  desc: T(
    "data get shows the raw data of an entity or block, data merge overwrites parts of it.",
    "data get показывает сырые данные сущности или блока, data merge перезаписывает их части.",
    "data get zeigt die Rohdaten einer Entität oder eines Blocks, data merge überschreibt Teile davon."
  ),
  cmds: [
    "data get entity {NAME} Pos",
    "data get entity {NAME} Inventory",
    "data get block ~ ~-1 ~",
    { c: "data merge entity @e[type=minecraft:zombie,limit=1,sort=nearest] {NoAI:1b,Silent:1b}", label: T("Freeze the nearest zombie", "Заморозить ближайшего зомби", "Nächsten Zombie einfrieren") },
  ],
},
{
  id: "un-scale-mob", cat: "unusual",
  title: T("Giant and tiny mobs", "Гигантские и крошечные мобы", "Riesige und winzige Mobs"),
  desc: T(
    "The scale attribute works on every mob, not just players.",
    "Атрибут scale работает на любом мобе, не только на игроках.",
    "Das scale-Attribut wirkt bei jedem Mob, nicht nur bei Spielern."
  ),
  cmds: [
    "summon minecraft:zombie ~ ~ ~3",
    "attribute @e[type=minecraft:zombie,limit=1,sort=nearest] minecraft:scale base set 6",
    "attribute @e[type=minecraft:zombie,limit=1,sort=nearest] minecraft:max_health base set 400",
    "attribute @e[type=minecraft:zombie,limit=1,sort=nearest] minecraft:attack_damage base set 25",
  ],
  warn: T("A scale-6 zombie breaks doors and walks over walls.", "Зомби масштаба 6 ломает двери и перешагивает стены.", "Ein Zombie mit Skalierung 6 bricht Türen auf und steigt über Mauern."),
},
{
  id: "un-forceload", cat: "unusual",
  title: T("Keep chunks loaded", "Держать чанки загруженными", "Chunks geladen halten"),
  desc: T(
    "Forced chunks keep ticking with no player nearby — farms and clocks keep running.",
    "Принудительно загруженные чанки продолжают работать без игроков — фермы и таймеры не останавливаются.",
    "Erzwungene Chunks laufen ohne Spieler weiter — Farmen und Uhren machen weiter."
  ),
  cmds: [
    "forceload add ~ ~",
    { c: "forceload query", label: T("What is loaded?", "Что загружено?", "Was ist geladen?") },
    { c: "forceload remove all", label: T("Stop", "Остановить", "Beenden") },
  ],
  warn: T("Every forced chunk costs server performance.", "Каждый такой чанк нагружает сервер.", "Jeder erzwungene Chunk kostet Serverleistung."),
},
{
  id: "un-fillbiome", cat: "unusual",
  title: T("Change the biome of an area", "Сменить биом области", "Biom eines Gebiets ändern"),
  desc: T(
    "Changes sky colour, water colour, mob spawns and weather — no world edit needed.",
    "Меняет цвет неба и воды, спавн мобов и погоду — без внешних редакторов.",
    "Ändert Himmel- und Wasserfarbe, Mob-Spawns und Wetter — ganz ohne Welteditor."
  ),
  opts: [{ key: "bi", label: T("Biome", "Биом", "Biom"), values: BIOMES }],
  cmds: ["fillbiome ~-32 ~-32 ~-32 ~32 ~32 ~32 minecraft:{bi}"],
},
{
  id: "un-loot", cat: "unusual",
  title: T("Drops without breaking anything", "Дроп без разрушения", "Beute ohne etwas abzubauen"),
  desc: T(
    "loot can hand out exactly what a block, a mob or a chest would drop.",
    "loot выдаёт ровно то, что выпало бы из блока, моба или сундука.",
    "loot gibt genau das aus, was ein Block, ein Mob oder eine Truhe fallen lassen würde."
  ),
  cmds: [
    { c: "loot give {T} mine ~ ~-1 ~", label: T("As if you mined that block", "Как будто сломали этот блок", "Als hättest du den Block abgebaut") },
    { c: "loot give {T} kill @e[type=minecraft:zombie,limit=1,sort=nearest]", label: T("As if you killed that mob", "Как будто убили этого моба", "Als hättest du den Mob getötet") },
    { c: "loot spawn ~ ~1 ~ loot minecraft:chests/end_city_treasure", label: T("Drop chest loot on the floor", "Высыпать лут сундука на пол", "Truhenbeute auf den Boden werfen") },
  ],
},
{
  id: "un-rotate", cat: "unusual",
  title: T("Turn a player or mob", "Повернуть игрока или моба", "Spieler oder Mob drehen"),
  desc: T(
    "rotate changes where an entity looks — added in 1.21.2.",
    "rotate меняет направление взгляда сущности — добавлено в 1.21.2.",
    "rotate ändert die Blickrichtung einer Entität — seit 1.21.2."
  ),
  cmds: [
    "rotate {T} 0 0",
    { c: "rotate {T} facing entity @e[type=!minecraft:player,limit=1,sort=nearest]", label: T("Face the nearest mob", "Повернуть к ближайшему мобу", "Zum nächsten Mob drehen") },
  ],
},
{
  id: "un-place", cat: "unusual",
  title: T("Place a whole structure", "Поставить целую структуру", "Ein ganzes Bauwerk setzen"),
  desc: T(
    "Drops a vanilla structure exactly where you point. Press Tab after “place structure ” to browse them all.",
    "Ставит ванильную структуру там, где укажете. Нажмите Tab после «place structure », чтобы увидеть все.",
    "Setzt ein Vanilla-Bauwerk genau dort ab. Drücke Tab nach „place structure “, um alle zu sehen."
  ),
  cmds: [
    "place structure minecraft:igloo ~ ~ ~",
    "place structure minecraft:desert_pyramid ~ ~ ~",
  ],
  warn: T("Overwrites whatever is already there.", "Перезаписывает всё, что там было.", "Überschreibt alles, was dort schon steht."),
},
{
  id: "un-item-copy", cat: "unusual",
  title: T("Copy an item between slots", "Скопировать предмет между слотами", "Item zwischen Slots kopieren"),
  desc: T(
    "item … from copies whatever is in another slot — of a player or of a container block.",
    "item … from копирует то, что лежит в другом слоте — у игрока или в блоке-контейнере.",
    "item … from kopiert, was in einem anderen Slot liegt — bei einem Spieler oder in einem Behälter."
  ),
  cmds: [
    "item replace entity {T} weapon.offhand from entity {T} weapon.mainhand",
    "item replace entity {T} weapon.mainhand from block ~ ~-1 ~ container.0",
  ],
},
{
  id: "un-random", cat: "unusual",
  title: T("Random numbers", "Случайные числа", "Zufallszahlen"),
  desc: T(
    "roll shows the result to everyone, value keeps it for the command chain.",
    "roll показывает результат всем, value оставляет его для цепочки команд.",
    "roll zeigt das Ergebnis allen, value behält es für die Befehlskette."
  ),
  cmds: ["random roll 1..6", "random value 1..100"],
},
{
  id: "un-datapack", cat: "unusual",
  title: T("Data packs & functions", "Датапаки и функции", "Datenpakete & Funktionen"),
  desc: T(
    "A function is a text file of commands — the grown-up version of a long block chain.",
    "Функция — это текстовый файл с командами, взрослая замена длинной цепочке блоков.",
    "Eine Funktion ist eine Textdatei voller Befehle — die erwachsene Version einer langen Blockkette."
  ),
  cmds: [
    "datapack list",
    "reload",
    { c: "function example:start", label: T("Run a function from a data pack", "Запустить функцию из датапака", "Funktion aus einem Datenpaket ausführen") },
    { c: "schedule function example:start 10s", label: T("Run it later", "Запустить позже", "Später ausführen") },
  ],
},
];

/* ==========================================================================
   COMMAND REFERENCE
   Every command a command block can run in Java 1.21.11 — that means
   permission level 2 or lower. Anything above level 2 (op, ban, stop, …)
   silently fails inside a block; those are listed in NOT_IN_BLOCKS.
   ========================================================================== */
const REFERENCE = [
  { cmd: "advancement", lvl: 2,
    desc: T("Grant or revoke advancements.", "Выдать или забрать достижения.", "Fortschritte geben oder entziehen."),
    ex: ["advancement grant {T} everything", "advancement revoke {T} only minecraft:story/mine_stone"] },
  { cmd: "attribute", lvl: 2, single: true,
    desc: T("Read or set an entity attribute (health, speed, reach…). One target only.", "Читать или задавать атрибут сущности (здоровье, скорость, досягаемость…). Только одна цель.", "Ein Entitäts-Attribut lesen oder setzen (Leben, Tempo, Reichweite…). Nur ein Ziel."),
    ex: ["attribute {T} minecraft:max_health base set 40", "attribute {T} minecraft:movement_speed base reset"] },
  { cmd: "bossbar", lvl: 2,
    desc: T("Create and control bars at the top of the screen.", "Создавать и настраивать полосы вверху экрана.", "Leisten oben am Bildschirm erstellen und steuern."),
    ex: ['bossbar add hub:timer {"text":"Timer"}', "bossbar set hub:timer players @a", "bossbar set hub:timer value 30"] },
  { cmd: "clear", lvl: 2,
    desc: T("Delete items from an inventory.", "Удалить предметы из инвентаря.", "Items aus dem Inventar löschen."),
    ex: ["clear {T}", "clear {T} minecraft:dirt 32"] },
  { cmd: "clone", lvl: 2,
    desc: T("Copy or move a block region (max 32,768 blocks).", "Копировать или переместить область блоков (макс. 32 768).", "Einen Blockbereich kopieren oder verschieben (max. 32.768 Blöcke)."),
    ex: ["clone x1 y1 z1 x2 y2 z2 x y z", "clone x1 y1 z1 x2 y2 z2 x y z masked", "clone x1 y1 z1 x2 y2 z2 x y z replace move"] },
  { cmd: "damage", lvl: 2, single: true,
    desc: T("Deal an exact amount of damage, optionally with a source.", "Нанести точный урон, при желании с источником.", "Genauen Schaden zufügen, optional mit Quelle."),
    ex: ["damage {T} 6", "damage {T} 6 minecraft:magic"] },
  { cmd: "data", lvl: 2,
    desc: T("Read, merge or remove NBT data of entities, blocks and storage.", "Читать, изменять и удалять NBT-данные сущностей, блоков и хранилища.", "NBT-Daten von Entitäten, Blöcken und Storage lesen, ändern oder löschen."),
    ex: ["data get entity {NAME} Pos", "data get block ~ ~-1 ~", "data merge entity @e[type=minecraft:zombie,limit=1,sort=nearest] {NoAI:1b}"] },
  { cmd: "datapack", lvl: 2,
    desc: T("List, enable or disable data packs.", "Список, включение и отключение датапаков.", "Datenpakete auflisten, aktivieren oder deaktivieren."),
    ex: ["datapack list", "datapack list available"] },
  { cmd: "defaultgamemode", lvl: 2,
    desc: T("Game mode new players start in.", "Режим игры для новых игроков.", "Spielmodus für neue Spieler."),
    ex: ["defaultgamemode survival", "defaultgamemode adventure"] },
  { cmd: "dialog", lvl: 2,
    desc: T("Opens a dialog screen defined by a data pack (1.21.6+). Needs a pack, no vanilla dialogs exist.", "Открывает диалоговое окно из датапака (1.21.6+). Требуется датапак, ванильных диалогов нет.", "Öffnet einen im Datenpaket definierten Dialog (1.21.6+). Braucht ein Paket, es gibt keine Vanilla-Dialoge."),
    ex: [] },
  { cmd: "difficulty", lvl: 2,
    desc: T("Peaceful, easy, normal or hard.", "Мирный, лёгкий, обычный или сложный.", "Friedlich, einfach, normal oder schwer."),
    ex: ["difficulty hard", "difficulty peaceful"] },
  { cmd: "effect", lvl: 2,
    desc: T("Give or remove status effects. Duration in seconds or infinite.", "Выдать или снять эффекты. Длительность в секундах или infinite.", "Statuseffekte geben oder entfernen. Dauer in Sekunden oder infinite."),
    ex: ["effect give {T} minecraft:speed 30 1 true", "effect give {T} minecraft:resistance infinite 4 true", "effect clear {T}"] },
  { cmd: "enchant", lvl: 2,
    desc: T("Enchant the held item — refuses over-max levels and wrong items. Use give components instead for those.", "Зачаровать предмет в руке — не принимает уровни выше максимума и неподходящие предметы. Для этого используйте компоненты в give.", "Verzaubert das gehaltene Item — verweigert Überstufen und falsche Items. Dafür lieber give-Komponenten nutzen."),
    ex: ["enchant {T} minecraft:sharpness 5", "enchant {T} minecraft:mending"] },
  { cmd: "execute", lvl: 2,
    desc: T("Run a command as/at someone else, or only if a condition is true. The most important command there is.", "Выполнить команду от лица/в точке другого или только при условии. Самая важная команда.", "Führt einen Befehl als/bei jemand anderem aus — oder nur bei erfüllter Bedingung. Der wichtigste Befehl überhaupt."),
    ex: ["execute as @a at @s run effect give @s minecraft:glowing 5 0 true",
      "execute at {T} positioned ~ ~10 ~ run summon minecraft:tnt",
      "execute as @a at @s if block ~ ~-1 ~ minecraft:gold_block run say on gold",
      "execute as @a store result score @s coins run data get entity @s XpLevel"] },
  { cmd: "experience", lvl: 2, alias: "xp",
    desc: T("Add, set or query experience.", "Добавить, задать или узнать опыт.", "Erfahrung geben, setzen oder abfragen."),
    ex: ["xp add {T} 30 levels", "xp set {T} 0 points", "experience query {T} levels"] },
  { cmd: "fetchprofile", lvl: 2,
    desc: T("Fetches a player profile (skin, UUID) from the Mojang servers. Added in 1.21.9.", "Загружает профиль игрока (скин, UUID) с серверов Mojang. Добавлено в 1.21.9.", "Holt ein Spielerprofil (Skin, UUID) von den Mojang-Servern. Neu in 1.21.9."),
    ex: ["fetchprofile name {NAME}"] },
  { cmd: "fill", lvl: 2,
    desc: T("Fill a region with one block. Modes: replace, hollow, outline, keep, destroy.", "Заполнить область одним блоком. Режимы: replace, hollow, outline, keep, destroy.", "Einen Bereich mit einem Block füllen. Modi: replace, hollow, outline, keep, destroy."),
    ex: ["fill ~-5 ~ ~-5 ~5 ~ ~5 minecraft:stone", "fill ~-5 ~ ~-5 ~5 ~5 ~5 minecraft:glass hollow", "fill x1 y1 z1 x2 y2 z2 minecraft:air replace minecraft:water"] },
  { cmd: "fillbiome", lvl: 2,
    desc: T("Change the biome of a region.", "Сменить биом в области.", "Das Biom eines Bereichs ändern."),
    ex: ["fillbiome ~-16 ~-16 ~-16 ~16 ~16 ~16 minecraft:cherry_grove"] },
  { cmd: "forceload", lvl: 2,
    desc: T("Keep chunks loaded even with no player nearby.", "Держать чанки загруженными без игроков рядом.", "Chunks geladen halten, auch ohne Spieler in der Nähe."),
    ex: ["forceload add ~ ~", "forceload query", "forceload remove all"] },
  { cmd: "function", lvl: 2,
    desc: T("Run a list of commands from a data pack file.", "Выполнить список команд из файла датапака.", "Führt eine Befehlsliste aus einer Datenpaket-Datei aus."),
    ex: ["function example:start"] },
  { cmd: "gamemode", lvl: 2,
    desc: T("survival, creative, adventure or spectator.", "survival, creative, adventure или spectator.", "survival, creative, adventure oder spectator."),
    ex: ["gamemode creative {T}", "gamemode adventure @a"] },
  { cmd: "gamerule", lvl: 2,
    desc: T("Change a world rule. 1.21.11 renamed all of them to snake_case.", "Изменить правило мира. В 1.21.11 все они переименованы в snake_case.", "Eine Weltregel ändern. 1.21.11 hat alle in snake_case umbenannt."),
    ex: ["gamerule keep_inventory true", "gamerule mob_griefing false", "gamerule random_tick_speed 3"] },
  { cmd: "give", lvl: 2,
    desc: T("Give items, with components for enchantments, names and more.", "Выдать предметы с компонентами: зачарования, названия и прочее.", "Items geben, mit Komponenten für Verzauberungen, Namen und mehr."),
    ex: ["give {T} minecraft:diamond 64", 'give {T} minecraft:netherite_sword[enchantments={"minecraft:sharpness":5}]'] },
  { cmd: "help", lvl: 0,
    desc: T("Show the syntax of a command. In a block the output goes to the block, not to chat.", "Показать синтаксис команды. В блоке вывод идёт в блок, а не в чат.", "Zeigt die Syntax eines Befehls. Im Block geht die Ausgabe an den Block, nicht in den Chat."),
    ex: ["help execute"] },
  { cmd: "item", lvl: 2,
    desc: T("Replace or copy the item in a specific slot.", "Заменить или скопировать предмет в конкретном слоте.", "Das Item in einem bestimmten Slot ersetzen oder kopieren."),
    ex: ["item replace entity {T} weapon.offhand with minecraft:totem_of_undying",
      "item replace entity {T} armor.head with minecraft:carved_pumpkin",
      "item replace entity {T} weapon.mainhand from block ~ ~-1 ~ container.0"] },
  { cmd: "kill", lvl: 2,
    desc: T("Remove entities. Always filter the selector.", "Удалить сущности. Всегда фильтруйте селектор.", "Entitäten entfernen. Den Selektor immer filtern."),
    ex: ["kill @e[type=minecraft:item]", "kill @e[type=!minecraft:player,distance=..50]"] },
  { cmd: "locate", lvl: 2,
    desc: T("Find the nearest structure, biome or point of interest.", "Найти ближайшую структуру, биом или точку интереса.", "Das nächste Bauwerk, Biom oder POI finden."),
    ex: ["locate structure minecraft:ancient_city", "locate biome minecraft:cherry_grove", "locate poi minecraft:lodestone"] },
  { cmd: "loot", lvl: 2,
    desc: T("Produce the drops of a block, mob or loot table without touching it.", "Получить дроп блока, моба или лут-таблицы, не трогая их.", "Die Beute eines Blocks, Mobs oder einer Loot-Tabelle erzeugen, ohne ihn anzufassen."),
    ex: ["loot give {T} loot minecraft:chests/simple_dungeon", "loot spawn ~ ~1 ~ mine ~ ~-1 ~", "loot insert ~1 ~ ~ loot minecraft:chests/ancient_city"] },
];

REFERENCE.push(
  { cmd: "me", lvl: 0,
    desc: T("Writes a message in third person.", "Пишет сообщение от третьего лица.", "Schreibt eine Nachricht in der dritten Person."),
    ex: ["me opened the gates"] },
  { cmd: "msg", lvl: 0, alias: "tell / w",
    desc: T("Private message to specific players.", "Личное сообщение конкретным игрокам.", "Private Nachricht an bestimmte Spieler."),
    ex: ["msg {NAME} The arena is open"] },
  { cmd: "particle", lvl: 2,
    desc: T("Spawn particles: name, position, spread x/y/z, speed, count.", "Создать частицы: имя, позиция, разброс x/y/z, скорость, количество.", "Partikel erzeugen: Name, Position, Streuung x/y/z, Tempo, Anzahl."),
    ex: ["particle minecraft:flame ~ ~1 ~ 0.3 0.3 0.3 0 40", 'particle minecraft:dust{color:[1.0,0.2,0.2],scale:2.0} ~ ~1 ~ 0.5 0.5 0.5 0 80'] },
  { cmd: "place", lvl: 2,
    desc: T("Place a structure, feature or jigsaw piece.", "Поставить структуру, фичу или jigsaw-часть.", "Ein Bauwerk, Feature oder Jigsaw-Teil setzen."),
    ex: ["place structure minecraft:igloo ~ ~ ~"] },
  { cmd: "playsound", lvl: 2,
    desc: T("Play any sound event. Run it at the player so distance doesn't mute it.", "Проиграть любой звук. Выполняйте у игрока, чтобы расстояние не глушило.", "Ein beliebiges Soundereignis abspielen. Beim Spieler ausführen, damit die Entfernung nichts dämpft."),
    ex: ["execute as @a at @s run playsound minecraft:block.bell.use master @s ~ ~ ~ 1 1"] },
  { cmd: "random", lvl: 0,
    desc: T("Random number. roll is public, value is silent.", "Случайное число. roll — публично, value — тихо.", "Zufallszahl. roll ist öffentlich, value still."),
    ex: ["random roll 1..6", "random value 1..100"] },
  { cmd: "recipe", lvl: 2,
    desc: T("Unlock or lock crafting recipes.", "Открыть или закрыть рецепты крафта.", "Rezepte freischalten oder sperren."),
    ex: ["recipe give {T} *", "recipe take {T} *"] },
  { cmd: "reload", lvl: 2,
    desc: T("Reload data packs (functions, loot tables, recipes).", "Перезагрузить датапаки (функции, лут-таблицы, рецепты).", "Datenpakete neu laden (Funktionen, Loot-Tabellen, Rezepte)."),
    ex: ["reload"] },
  { cmd: "return", lvl: 2,
    desc: T("Ends a function early and sets its return value. Only useful inside functions.", "Досрочно завершает функцию и задаёт возвращаемое значение. Полезно только внутри функций.", "Beendet eine Funktion vorzeitig und setzt ihren Rückgabewert. Nur in Funktionen sinnvoll."),
    ex: ["return 1", "return fail"] },
  { cmd: "ride", lvl: 2, single: true,
    desc: T("Mount one entity onto another, or dismount.", "Посадить одну сущность на другую или ссадить.", "Eine Entität auf eine andere setzen oder absteigen lassen."),
    ex: ["ride {T} mount @e[type=minecraft:horse,limit=1,sort=nearest]", "ride {T} dismount"] },
  { cmd: "rotate", lvl: 2, single: true,
    desc: T("Turn an entity to an angle or towards a target (1.21.2+).", "Повернуть сущность на угол или к цели (1.21.2+).", "Eine Entität auf einen Winkel oder zu einem Ziel drehen (1.21.2+)."),
    ex: ["rotate {T} 90 0", "rotate {T} facing entity @e[type=!minecraft:player,limit=1,sort=nearest]"] },
  { cmd: "say", lvl: 2,
    desc: T("Message to everyone, prefixed with the sender name.", "Сообщение всем с именем отправителя.", "Nachricht an alle, mit Absendername davor."),
    ex: ["say Round starts now"] },
  { cmd: "schedule", lvl: 2,
    desc: T("Run a function after a delay — the clean way to build loops.", "Выполнить функцию с задержкой — чистый способ делать циклы.", "Eine Funktion mit Verzögerung ausführen — der saubere Weg für Schleifen."),
    ex: ["schedule function example:tick 10s", "schedule clear example:tick"] },
  { cmd: "scoreboard", lvl: 2,
    desc: T("Objectives, scores, display slots — the memory of your command builds.", "Цели, очки, слоты отображения — память ваших командных построек.", "Ziele, Punkte, Anzeigeplätze — das Gedächtnis deiner Befehlsbauten."),
    ex: ['scoreboard objectives add kills playerKillCount {"text":"Kills"}',
      "scoreboard objectives setdisplay sidebar kills",
      "scoreboard players add {T} kills 1",
      "scoreboard players reset @a kills"] },
  { cmd: "seed", lvl: 2,
    desc: T("Show the world seed.", "Показать сид мира.", "Zeigt den Welt-Seed."),
    ex: ["seed"] },
  { cmd: "setblock", lvl: 2,
    desc: T("Place a single block, with block states and block entity data.", "Поставить один блок с состояниями и данными блока-сущности.", "Einen einzelnen Block setzen, mit Blockzuständen und Blockentity-Daten."),
    ex: ["setblock ~ ~1 ~ minecraft:redstone_block", "setblock ~ ~1 ~ minecraft:oak_door[facing=north,half=lower]", "setblock ~ ~1 ~ minecraft:air destroy"] },
  { cmd: "setworldspawn", lvl: 2,
    desc: T("Set the world spawn point.", "Задать точку спавна мира.", "Den Welt-Spawnpunkt setzen."),
    ex: ["setworldspawn ~ ~ ~"] },
  { cmd: "spawnpoint", lvl: 2,
    desc: T("Set the personal respawn point of players.", "Задать личную точку возрождения игроков.", "Den persönlichen Respawn-Punkt von Spielern setzen."),
    ex: ["spawnpoint @a ~ ~ ~"] },
  { cmd: "spectate", lvl: 2,
    desc: T("Make a spectator follow a target through its eyes.", "Заставить наблюдателя смотреть глазами цели.", "Lässt einen Zuschauer durch die Augen eines Ziels sehen."),
    ex: ["spectate {NAME}", "spectate"] },
  { cmd: "spreadplayers", lvl: 2,
    desc: T("Scatter players randomly, optionally keeping teams together.", "Раскидать игроков случайно, при желании сохраняя команды.", "Spieler zufällig verteilen, optional Teams zusammenhalten."),
    ex: ["spreadplayers ~ ~ 5 30 false @a", "spreadplayers ~ ~ 10 50 true @a"] },
  { cmd: "stopsound", lvl: 2,
    desc: T("Stop sounds that are currently playing.", "Остановить проигрываемые звуки.", "Laufende Töne stoppen."),
    ex: ["stopsound @a", "stopsound @a music"] },
  { cmd: "stopwatch", lvl: 2,
    desc: T("Real-time stopwatch, new in 1.21.11. query returns seconds.", "Секундомер реального времени, новинка 1.21.11. query возвращает секунды.", "Echtzeit-Stoppuhr, neu in 1.21.11. query gibt Sekunden zurück."),
    ex: ["stopwatch create hub:round", "stopwatch query hub:round", "stopwatch restart hub:round", "stopwatch remove hub:round"] },
  { cmd: "summon", lvl: 2,
    desc: T("Spawn any entity, with NBT for its behaviour.", "Призвать любую сущность, с NBT для поведения.", "Jede Entität beschwören, mit NBT für ihr Verhalten."),
    ex: ["summon minecraft:wolf ~ ~ ~", "summon minecraft:armor_stand ~ ~ ~ {Marker:1b,Invisible:1b}"] },
  { cmd: "tag", lvl: 2,
    desc: T("Invisible labels on entities, usable in selectors.", "Невидимые метки на сущностях, годятся для селекторов.", "Unsichtbare Markierungen an Entitäten, im Selektor nutzbar."),
    ex: ["tag {T} add vip", "tag {T} remove vip", "tag @a list"] },
  { cmd: "team", lvl: 2,
    desc: T("Teams with colours, friendly fire and shared name tags.", "Команды с цветами, уроном по своим и общими метками.", "Teams mit Farben, Eigenbeschuss und gemeinsamen Namen."),
    ex: ["team add red", "team modify red color red", "team modify red friendlyFire false", "team join red {NAME}"] },
  { cmd: "teammsg", lvl: 0, alias: "tm",
    desc: T("Message only your own team.", "Сообщение только своей команде.", "Nachricht nur an das eigene Team."),
    ex: ["teammsg Push left"] },
  { cmd: "teleport", lvl: 2, alias: "tp",
    desc: T("Move entities to coordinates, to another entity, or make them face something.", "Переместить сущности к координатам, к другой сущности или повернуть к цели.", "Entitäten zu Koordinaten, zu einer anderen Entität bewegen oder ausrichten."),
    ex: ["tp {T} x y z", "tp @a {NAME}", "tp {T} ~ ~50 ~", "teleport {T} x y z facing 0 64 0"] },
  { cmd: "tellraw", lvl: 2,
    desc: T("Chat message with colours, styles, scores and selectors.", "Сообщение в чат с цветом, стилем, очками и селекторами.", "Chatnachricht mit Farben, Stilen, Punkten und Selektoren."),
    ex: ['tellraw @a {"text":"Welcome","color":"gold"}', 'tellraw @a [{"selector":"@p"},{"text":" won!"}]'] },
  { cmd: "test", lvl: 2,
    desc: T("Runs data-pack game tests (1.21.5+). Only useful with a test pack installed.", "Запускает игровые тесты из датапака (1.21.5+). Полезно только с установленным тест-паком.", "Führt Gametests aus Datenpaketen aus (1.21.5+). Nur mit installiertem Test-Paket sinnvoll."),
    ex: [] },
  { cmd: "time", lvl: 2,
    desc: T("Set or add world time.", "Задать или добавить время мира.", "Weltzeit setzen oder erhöhen."),
    ex: ["time set day", "time set midnight", "time add 1000", "time query daytime"] },
  { cmd: "title", lvl: 2,
    desc: T("Big title, subtitle or action-bar text.", "Крупный заголовок, подзаголовок или текст над хотбаром.", "Großer Titel, Untertitel oder Text in der Aktionsleiste."),
    ex: ['title @a title {"text":"GO","color":"green"}', 'title @a actionbar {"text":"30s left"}', "title @a times 10 60 20", "title @a clear"] },
  { cmd: "trigger", lvl: 0,
    desc: T("The only command normal players can always run — it changes a trigger objective, so you can offer them menus.", "Единственная команда, доступная обычным игрокам всегда: меняет цель типа trigger, так можно давать им меню.", "Der einzige Befehl, den normale Spieler immer nutzen dürfen — er ändert ein trigger-Ziel, so baust du ihnen Menüs."),
    ex: ["scoreboard objectives add menu trigger", "scoreboard players enable @a menu", "trigger menu set 1"] },
  { cmd: "waypoint", lvl: 2,
    desc: T("Controls locator-bar waypoints (1.21.6+). Press Tab after the command to see its options.", "Управляет точками на панели локатора (1.21.6+). Нажмите Tab после команды, чтобы увидеть опции.", "Steuert Wegpunkte der Ortungsleiste (1.21.6+). Drücke Tab nach dem Befehl für die Optionen."),
    ex: [] },
  { cmd: "weather", lvl: 2,
    desc: T("clear, rain or thunder.", "clear, rain или thunder.", "clear, rain oder thunder."),
    ex: ["weather clear", "weather rain", "weather thunder"] },
  { cmd: "worldborder", lvl: 2,
    desc: T("Move, resize and arm the world border. Times are in ticks since 1.21.11 — add s for seconds.", "Двигать, менять размер и настраивать границу мира. С 1.21.11 время в тиках — добавьте s для секунд.", "Weltbarriere verschieben, ändern und scharf stellen. Zeiten sind seit 1.21.11 in Ticks — s für Sekunden anhängen."),
    ex: ["worldborder center ~ ~", "worldborder set 200", "worldborder set 20 300s", "worldborder damage amount 2"] }
);

/* Commands that need permission level 3+ — a command block runs at level 2,
   so these simply do nothing inside one. Use chat as an operator, or the
   server console. */
const NOT_IN_BLOCKS = [
  "op", "deop", "ban", "ban-ip", "banlist", "pardon", "pardon-ip", "kick", "whitelist",
  "setidletimeout", "save-all", "save-off", "save-on", "stop", "publish", "debug",
  "jfr", "perf", "transfer", "list", "tick",
];

/* ==========================================================================
   KITS — used by the PvP kit box, the armor/tool sets and the Kit builder
   item  item id (without minecraft:)
   n     amount given (default 1)
   max   max stack size (default: 1 for enchanted gear, else 64)
   comps extra components { name: "SNBT value" }
   slot  equipment slot for "put armor on directly"
   ========================================================================== */
const KIT_GROUPS = [
  { id: "armor",   name: T("Armor", "Броня", "Rüstung") },
  { id: "weapons", name: T("Melee weapons", "Ближний бой", "Nahkampfwaffen") },
  { id: "ranged",  name: T("Ranged", "Дальний бой", "Fernkampf") },
  { id: "healing", name: T("Healing & food", "Лечение и еда", "Heilung & Essen") },
  { id: "potions", name: T("Splash potions", "Взрывные зелья", "Wurftränke") },
  { id: "blocks",  name: T("Blocks & tools", "Блоки и инструменты", "Blöcke & Werkzeuge") },
  { id: "moving",  name: T("Movement & mounts", "Передвижение и скакуны", "Bewegung & Reittiere") },
];

const potion = (id) => ({ potion_contents: `{potion:"minecraft:${id}"}` });

const KIT_ITEMS = [
  /* Armor */
  { id: "helmet",     grp: "armor", item: "netherite_helmet",     ench: ENC.helmet,     slot: "armor.head",  name: T("Netherite helmet", "Незеритовый шлем", "Netheritehelm") },
  { id: "chestplate", grp: "armor", item: "netherite_chestplate", ench: ENC.chestplate, slot: "armor.chest", name: T("Netherite chestplate", "Незеритовый нагрудник", "Netheritharnisch") },
  { id: "leggings",   grp: "armor", item: "netherite_leggings",   ench: ENC.leggings,   slot: "armor.legs",  name: T("Netherite leggings", "Незеритовые поножи", "Netheritbeinschutz") },
  { id: "boots",      grp: "armor", item: "netherite_boots",      ench: ENC.boots,      slot: "armor.feet",  name: T("Netherite boots", "Незеритовые ботинки", "Netheritstiefel") },
  { id: "d_helmet",     grp: "armor", item: "diamond_helmet",     ench: ENC.uhcArmor, slot: "armor.head",  name: T("Diamond helmet (Prot II)", "Алмазный шлем (Защита II)", "Diamanthelm (Schutz II)") },
  { id: "d_chestplate", grp: "armor", item: "diamond_chestplate", ench: ENC.uhcArmor, slot: "armor.chest", name: T("Diamond chestplate (Prot II)", "Алмазный нагрудник (Защита II)", "Diamantharnisch (Schutz II)") },
  { id: "d_leggings",   grp: "armor", item: "diamond_leggings",   ench: ENC.uhcArmor, slot: "armor.legs",  name: T("Diamond leggings (Prot II)", "Алмазные поножи (Защита II)", "Diamantbeinschutz (Schutz II)") },
  { id: "d_boots",      grp: "armor", item: "diamond_boots",      ench: ENC.uhcArmor, slot: "armor.feet",  name: T("Diamond boots (Prot II)", "Алмазные ботинки (Защита II)", "Diamantstiefel (Schutz II)") },

  /* Melee */
  { id: "sword",       grp: "weapons", item: "netherite_sword", ench: ENC.sword,      name: T("Netherite sword (maxed)", "Незеритовый меч (макс.)", "Netheritschwert (maximal)") },
  { id: "axe",         grp: "weapons", item: "netherite_axe",   ench: ENC.axePvp,     name: T("Netherite axe (shield breaker)", "Незеритовый топор (против щитов)", "Netheritaxt (Schildbrecher)") },
  { id: "mace",        grp: "weapons", item: "mace",            ench: ENC.mace,       name: T("Mace (Density V)", "Булава (Плотность V)", "Streitkolben (Dichte V)") },
  { id: "mace_breach", grp: "weapons", item: "mace",            ench: ENC.maceBreach, name: T("Mace (Breach IV)", "Булава (Пробитие IV)", "Streitkolben (Bresche IV)") },
  { id: "spear",       grp: "weapons", item: "netherite_spear", ench: ENC.spearMax,   name: T("Netherite spear (Lunge III)", "Незеритовое копьё (Выпад III)", "Netheritspeer (Ausfall III)") },
  { id: "uhc_sword",   grp: "weapons", item: "diamond_sword",   ench: ENC.uhcSword,   name: T("Diamond sword (Sharpness III)", "Алмазный меч (Острота III)", "Diamantschwert (Schärfe III)") },
  { id: "shield",      grp: "weapons", item: "shield",          ench: ENC.basic,      name: T("Shield", "Щит", "Schild") },

  /* Ranged */
  { id: "bow",       grp: "ranged", item: "bow",       ench: ENC.bow,      name: T("Bow (Power V, Infinity)", "Лук (Сила V, Бесконечность)", "Bogen (Stärke V, Unendlichkeit)") },
  { id: "uhc_bow",   grp: "ranged", item: "bow",       ench: ENC.uhcBow,   name: T("Bow (Power III)", "Лук (Сила III)", "Bogen (Stärke III)") },
  { id: "crossbow",  grp: "ranged", item: "crossbow",  ench: ENC.crossbow, name: T("Crossbow (Quick Charge III)", "Арбалет (Быстрая перезарядка III)", "Armbrust (Schnellladen III)") },
  { id: "trident",   grp: "ranged", item: "trident",   ench: ENC.loyalty,  name: T("Trident (Loyalty III)", "Трезубец (Верность III)", "Dreizack (Treue III)") },
  { id: "trident_riptide", grp: "ranged", item: "trident", ench: ENC.riptide, name: T("Trident (Riptide III)", "Трезубец (Тягун III)", "Dreizack (Sog III)") },
  { id: "arrows",    grp: "ranged", item: "arrow", n: 64, name: T("Arrows", "Стрелы", "Pfeile") },
  { id: "harm_arrows", grp: "ranged", item: "tipped_arrow", n: 32, comps: potion("strong_harming"), name: T("Harming II arrows", "Стрелы вреда II", "Schadenspfeile II") },
  { id: "rod",       grp: "ranged", item: "fishing_rod", ench: ENC.basic, name: T("Fishing rod", "Удочка", "Angel") },

  /* Healing & food */
  { id: "totems",   grp: "healing", item: "totem_of_undying", n: 3, max: 1, name: T("Totems of Undying", "Тотемы бессмертия", "Totems der Unsterblichkeit") },
  { id: "gapples",  grp: "healing", item: "golden_apple", n: 64, name: T("Golden apples", "Золотые яблоки", "Goldene Äpfel") },
  { id: "egapples", grp: "healing", item: "enchanted_golden_apple", n: 16, name: T("Enchanted golden apples", "Зачарованные золотые яблоки", "Verzauberte goldene Äpfel") },
  { id: "beef",     grp: "healing", item: "cooked_beef", n: 64, name: T("Steak", "Стейк", "Steak") },
  { id: "carrots",  grp: "healing", item: "golden_carrot", n: 64, name: T("Golden carrots", "Золотая морковь", "Goldene Karotten") },
  { id: "xp",       grp: "healing", item: "experience_bottle", n: 64, name: T("Bottles o' Enchanting", "Пузырьки опыта", "Erfahrungsfläschchen") },

  /* Splash potions */
  { id: "p_heal",     grp: "potions", item: "splash_potion", n: 4, max: 1, comps: potion("strong_healing"),       name: T("Healing II", "Исцеление II", "Heilung II") },
  { id: "p_strength", grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("strong_strength"),      name: T("Strength II", "Сила II", "Stärke II") },
  { id: "p_speed",    grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("strong_swiftness"),     name: T("Speed II", "Скорость II", "Schnelligkeit II") },
  { id: "p_regen",    grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("strong_regeneration"),  name: T("Regeneration II", "Регенерация II", "Regeneration II") },
  { id: "p_fireres",  grp: "potions", item: "splash_potion", n: 1, max: 1, comps: potion("long_fire_resistance"), name: T("Fire Resistance", "Огнестойкость", "Feuerresistenz") },
  { id: "p_turtle",   grp: "potions", item: "splash_potion", n: 1, max: 1, comps: potion("strong_turtle_master"), name: T("Turtle Master II", "Черепашья мощь II", "Schildkrötenmeister II") },
  { id: "p_poison",   grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("strong_poison"),        name: T("Poison II (attack)", "Отравление II (атака)", "Vergiftung II (Angriff)") },
  { id: "p_harm",     grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("strong_harming"),       name: T("Harming II (attack)", "Вред II (атака)", "Schaden II (Angriff)") },
  { id: "p_slow",     grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("long_slowness"),        name: T("Slowness (attack)", "Замедление (атака)", "Langsamkeit (Angriff)") },
  { id: "p_weak",     grp: "potions", item: "splash_potion", n: 2, max: 1, comps: potion("long_weakness"),        name: T("Weakness (attack)", "Слабость (атака)", "Schwäche (Angriff)") },

  /* Blocks & tools */
  { id: "crystals",  grp: "blocks", item: "end_crystal", n: 64, name: T("End crystals", "Кристаллы Энда", "Endkristalle") },
  { id: "obsidian",  grp: "blocks", item: "obsidian", n: 64, name: T("Obsidian", "Обсидиан", "Obsidian") },
  { id: "anchors",   grp: "blocks", item: "respawn_anchor", n: 64, name: T("Respawn anchors", "Якоря возрождения", "Seelenanker") },
  { id: "glowstone", grp: "blocks", item: "glowstone", n: 64, name: T("Glowstone", "Светокамень", "Glowstone") },
  { id: "cobweb",    grp: "blocks", item: "cobweb", n: 64, name: T("Cobwebs", "Паутина", "Spinnweben") },
  { id: "water",     grp: "blocks", item: "water_bucket", max: 1, name: T("Water bucket", "Ведро воды", "Wassereimer") },
  { id: "lava",      grp: "blocks", item: "lava_bucket", max: 1, name: T("Lava bucket", "Ведро лавы", "Lavaeimer") },
  { id: "planks",    grp: "blocks", item: "oak_planks", n: 64, name: T("Oak planks", "Дубовые доски", "Eichenbretter") },
  { id: "flint",     grp: "blocks", item: "flint_and_steel", max: 1, name: T("Flint and steel", "Огниво", "Feuerzeug") },
  { id: "pickaxe",   grp: "blocks", item: "netherite_pickaxe", ench: ENC.pickaxe, name: T("Netherite pickaxe", "Незеритовая кирка", "Netheritspitzhacke") },

  /* Movement & mounts */
  { id: "pearls",  grp: "moving", item: "ender_pearl", n: 16, max: 16, name: T("Ender pearls", "Жемчуг Эндера", "Enderperlen") },
  { id: "wind",    grp: "moving", item: "wind_charge", n: 64, name: T("Wind charges", "Заряды ветра", "Windladungen") },
  { id: "elytra",  grp: "moving", item: "elytra", ench: ENC.basic, name: T("Elytra", "Элитры", "Elytren") },
  { id: "rockets", grp: "moving", item: "firework_rocket", n: 64, comps: { fireworks: "{flight_duration:1}" }, name: T("Firework rockets", "Фейерверк-ракеты", "Feuerwerksraketen") },
  { id: "saddle",  grp: "moving", item: "saddle", max: 1, name: T("Saddle", "Седло", "Sattel") },
  { id: "horse_armor", grp: "moving", item: "netherite_horse_armor", max: 1, name: T("Netherite horse armor", "Незеритовая конская броня", "Netherit-Rossharnisch") },
];

const ARMOR_SET = ["helmet", "chestplate", "leggings", "boots"];

/* Kit presets. "id*N" overrides the amount. `extra` = additional commands. */
const KIT_PRESETS = [
  {
    id: "full", name: T("Full PvP kit", "Полный PvP-набор", "Komplettes PvP-Kit"),
    items: [...ARMOR_SET, "sword", "mace", "bow", "crossbow", "arrows", "totems", "gapples", "egapples",
      "pearls", "wind", "p_heal", "p_strength", "p_speed", "cobweb", "water", "obsidian", "crystals"],
  },
  {
    id: "sword", name: T("Sword kit", "Набор с мечом", "Schwert-Kit"),
    items: [...ARMOR_SET, "sword", "axe", "shield", "totems", "gapples", "beef", "pearls",
      "p_heal", "p_strength", "p_speed", "p_fireres"],
  },
  {
    id: "mace", name: T("Mace kit", "Набор с булавой", "Streitkolben-Kit"),
    items: [...ARMOR_SET, "mace", "mace_breach", "sword", "wind", "pearls", "totems", "gapples",
      "p_heal", "p_strength", "cobweb"],
    note: T(
      "Throw a wind charge at your feet, then hit on the way down. Switch to the Breach mace against heavy armor.",
      "Бросьте заряд ветра под ноги и бейте при падении. Против тяжёлой брони берите булаву с Пробитием.",
      "Wirf eine Windladung vor die Füße und schlag im Fallen zu. Gegen schwere Rüstung den Bresche-Streitkolben nehmen."
    ),
  },
  {
    id: "crystal", name: T("Crystal kit", "Кристальный набор", "Kristall-Kit"),
    items: [...ARMOR_SET, "sword", "pickaxe", "crystals", "obsidian", "anchors", "glowstone",
      "totems*5", "gapples", "pearls", "xp", "p_heal"],
    extra: ["item replace entity {T} weapon.offhand with minecraft:totem_of_undying"],
    note: T(
      "Place obsidian, put a crystal on it and hit it. Keep a totem in your offhand at all times.",
      "Поставьте обсидиан, на него кристалл и ударьте. Всегда держите тотем во второй руке.",
      "Obsidian setzen, Kristall drauf, draufschlagen. Immer ein Totem in der Nebenhand halten."
    ),
  },
  {
    id: "uhc", name: T("UHC kit", "UHC-набор", "UHC-Kit"),
    items: ["d_helmet", "d_chestplate", "d_leggings", "d_boots", "uhc_sword", "uhc_bow", "arrows",
      "gapples*12", "water", "lava", "planks", "beef", "pickaxe"],
    extra: ["gamerule natural_health_regeneration false"],
    note: T(
      "UHC = no natural regeneration, so health only returns from golden apples. Before 1.21.11 the rule is called naturalRegeneration.",
      "UHC = без естественной регенерации, здоровье восстанавливают только золотые яблоки. До 1.21.11 правило называется naturalRegeneration.",
      "UHC = keine natürliche Regeneration, Leben gibt es nur durch goldene Äpfel. Vor 1.21.11 heißt die Regel naturalRegeneration."
    ),
  },
  {
    id: "spear", name: T("Spear kit", "Набор с копьём", "Speer-Kit"),
    items: [...ARMOR_SET, "spear", "shield", "totems", "gapples", "beef", "pearls", "saddle", "horse_armor"],
    extra: [
      "effect give {T} minecraft:saturation infinite 255 true",
      "summon minecraft:horse ~ ~ ~ {Tame:1b}",
    ],
    note: T(
      "Lunge costs hunger on every jab — Saturation keeps you fed. Saddle the horse for mounted spear charges.",
      "Выпад тратит голод при каждом уколе — Насыщение не даст проголодаться. Оседлайте лошадь для атак копьём верхом.",
      "Ausfall kostet bei jedem Stich Hunger — Sättigung hält dich satt. Sattel das Pferd für Speer-Angriffe zu Pferd."
    ),
  },
  {
    id: "archer", name: T("Archer kit", "Набор лучника", "Bogenschützen-Kit"),
    items: [...ARMOR_SET, "bow", "crossbow", "trident", "arrows", "harm_arrows", "pearls", "gapples",
      "beef", "p_speed", "rod"],
  },
];

/* ==========================================================================
   GENERATOR DATA
   ========================================================================== */

/* All enchantments with their vanilla max level (Java 1.21.11) */
const ENCHANTMENTS = {
  protection:            { max: 4, name: T("Protection", "Защита", "Schutz") },
  fire_protection:       { max: 4, name: T("Fire Protection", "Огнеупорность", "Feuerschutz") },
  blast_protection:      { max: 4, name: T("Blast Protection", "Взрывоустойчивость", "Explosionsschutz") },
  projectile_protection: { max: 4, name: T("Projectile Protection", "Защита от снарядов", "Schusssicher") },
  feather_falling:       { max: 4, name: T("Feather Falling", "Невесомость", "Federfall") },
  respiration:           { max: 3, name: T("Respiration", "Подводное дыхание", "Atmung") },
  aqua_affinity:         { max: 1, name: T("Aqua Affinity", "Подводник", "Wasseraffinität") },
  thorns:                { max: 3, name: T("Thorns", "Шипы", "Dornen") },
  depth_strider:         { max: 3, name: T("Depth Strider", "Подводная ходьба", "Wasserläufer") },
  frost_walker:          { max: 2, name: T("Frost Walker", "Ледоход", "Eisläufer") },
  soul_speed:            { max: 3, name: T("Soul Speed", "Скорость души", "Seelenläufer") },
  swift_sneak:           { max: 3, name: T("Swift Sneak", "Проворство", "Huschen") },
  sharpness:             { max: 5, name: T("Sharpness", "Острота", "Schärfe") },
  smite:                 { max: 5, name: T("Smite", "Небесная кара", "Bann") },
  bane_of_arthropods:    { max: 5, name: T("Bane of Arthropods", "Бич членистоногих", "Nemesis der Gliederfüßer") },
  knockback:             { max: 2, name: T("Knockback", "Отдача", "Rückstoß") },
  fire_aspect:           { max: 2, name: T("Fire Aspect", "Заговор огня", "Verbrennung") },
  looting:               { max: 3, name: T("Looting", "Добыча", "Plünderung") },
  sweeping_edge:         { max: 3, name: T("Sweeping Edge", "Разящий клинок", "Schwungkraft") },
  lunge:                 { max: 3, name: T("Lunge", "Выпад", "Ausfall") },
  efficiency:            { max: 5, name: T("Efficiency", "Эффективность", "Effizienz") },
  silk_touch:            { max: 1, name: T("Silk Touch", "Шёлковое касание", "Behutsamkeit") },
  fortune:               { max: 3, name: T("Fortune", "Удача", "Glück") },
  power:                 { max: 5, name: T("Power", "Сила", "Stärke") },
  punch:                 { max: 2, name: T("Punch", "Отбрасывание", "Schlag") },
  flame:                 { max: 1, name: T("Flame", "Горящая стрела", "Flamme") },
  infinity:              { max: 1, name: T("Infinity", "Бесконечность", "Unendlichkeit") },
  quick_charge:          { max: 3, name: T("Quick Charge", "Быстрая перезарядка", "Schnellladen") },
  multishot:             { max: 1, name: T("Multishot", "Тройной выстрел", "Mehrfachschuss") },
  piercing:              { max: 4, name: T("Piercing", "Пронзающая стрела", "Durchschuss") },
  loyalty:               { max: 3, name: T("Loyalty", "Верность", "Treue") },
  riptide:               { max: 3, name: T("Riptide", "Тягун", "Sog") },
  channeling:            { max: 1, name: T("Channeling", "Громовержец", "Entladung") },
  impaling:              { max: 5, name: T("Impaling", "Пронзатель", "Harpune") },
  luck_of_the_sea:       { max: 3, name: T("Luck of the Sea", "Везучий рыбак", "Glück des Meeres") },
  lure:                  { max: 3, name: T("Lure", "Приманка", "Köder") },
  density:               { max: 5, name: T("Density", "Плотность", "Dichte") },
  breach:                { max: 4, name: T("Breach", "Пробитие", "Bresche") },
  wind_burst:            { max: 3, name: T("Wind Burst", "Порыв ветра", "Windstoß") },
  unbreaking:            { max: 3, name: T("Unbreaking", "Прочность", "Haltbarkeit") },
  mending:               { max: 1, name: T("Mending", "Починка", "Reparatur") },
  binding_curse:         { max: 1, name: T("Curse of Binding", "Проклятие несъёмности", "Fluch der Bindung") },
  vanishing_curse:       { max: 1, name: T("Curse of Vanishing", "Проклятие утраты", "Fluch des Verschwindens") },
};

/* Mutually exclusive enchantment groups (Java) */
const ENCH_EXCLUSIVE = [
  ["sharpness", "smite", "bane_of_arthropods", "density", "breach"],
  ["protection", "fire_protection", "blast_protection", "projectile_protection"],
  ["depth_strider", "frost_walker"],
  ["fortune", "silk_touch"],
  ["infinity", "mending"],
  ["multishot", "piercing"],
  ["riptide", "loyalty"],
  ["riptide", "channeling"],
];

/* Which enchantments each item type accepts (enchanting table + anvil) */
const PROT = ["protection", "fire_protection", "blast_protection", "projectile_protection"];
const CURSE_ARMOR = ["unbreaking", "mending", "binding_curse", "vanishing_curse"];
const ITEM_ENCHANTS = {
  sword:      ["sharpness", "smite", "bane_of_arthropods", "knockback", "fire_aspect", "looting", "sweeping_edge", "unbreaking", "mending", "vanishing_curse"],
  spear:      ["lunge", "sharpness", "smite", "bane_of_arthropods", "knockback", "fire_aspect", "looting", "unbreaking", "mending", "vanishing_curse"],
  axe:        ["sharpness", "smite", "bane_of_arthropods", "efficiency", "fortune", "silk_touch", "unbreaking", "mending", "vanishing_curse"],
  tool:       ["efficiency", "fortune", "silk_touch", "unbreaking", "mending", "vanishing_curse"],
  helmet:     [...PROT, "respiration", "aqua_affinity", "thorns", ...CURSE_ARMOR],
  chestplate: [...PROT, "thorns", ...CURSE_ARMOR],
  leggings:   [...PROT, "swift_sneak", "thorns", ...CURSE_ARMOR],
  boots:      [...PROT, "feather_falling", "depth_strider", "frost_walker", "soul_speed", "thorns", ...CURSE_ARMOR],
  elytra:     ["unbreaking", "mending", "binding_curse", "vanishing_curse"],
  shield:     ["unbreaking", "mending", "vanishing_curse"],
  bow:        ["power", "punch", "flame", "infinity", "unbreaking", "mending", "vanishing_curse"],
  crossbow:   ["quick_charge", "multishot", "piercing", "unbreaking", "mending", "vanishing_curse"],
  trident:    ["loyalty", "riptide", "channeling", "impaling", "unbreaking", "mending", "vanishing_curse"],
  mace:       ["density", "breach", "smite", "bane_of_arthropods", "wind_burst", "fire_aspect", "unbreaking", "mending", "vanishing_curse"],
  rod:        ["luck_of_the_sea", "lure", "unbreaking", "mending", "vanishing_curse"],
  shears:     ["efficiency", "unbreaking", "mending", "vanishing_curse"],
  basic:      ["unbreaking", "mending", "vanishing_curse"],
  book:       Object.keys(ENCHANTMENTS),
};

/* Items for the Give generator: [item id, enchantment type] */
const GIVE_ITEMS = [
  ["netherite_sword", "sword"], ["netherite_spear", "spear"], ["netherite_axe", "axe"],
  ["netherite_pickaxe", "tool"], ["netherite_shovel", "tool"], ["netherite_hoe", "tool"],
  ["netherite_helmet", "helmet"], ["netherite_chestplate", "chestplate"],
  ["netherite_leggings", "leggings"], ["netherite_boots", "boots"],
  ["mace", "mace"], ["bow", "bow"], ["crossbow", "crossbow"], ["trident", "trident"],
  ["elytra", "elytra"], ["shield", "shield"],
  ["wooden_spear", "spear"], ["stone_spear", "spear"], ["copper_spear", "spear"],
  ["iron_spear", "spear"], ["golden_spear", "spear"], ["diamond_spear", "spear"],
  ["diamond_sword", "sword"], ["diamond_axe", "axe"], ["diamond_pickaxe", "tool"],
  ["diamond_shovel", "tool"], ["diamond_hoe", "tool"],
  ["diamond_helmet", "helmet"], ["diamond_chestplate", "chestplate"],
  ["diamond_leggings", "leggings"], ["diamond_boots", "boots"],
  ["turtle_helmet", "helmet"], ["fishing_rod", "rod"], ["shears", "shears"],
  ["flint_and_steel", "basic"], ["brush", "basic"], ["carrot_on_a_stick", "basic"],
  ["enchanted_book", "book"],
];

/* Status effects (Java 1.21.11) */
const EFFECTS = [
  ["speed", T("Speed", "Скорость", "Schnelligkeit")],
  ["slowness", T("Slowness", "Замедление", "Langsamkeit")],
  ["haste", T("Haste", "Спешка", "Eile")],
  ["mining_fatigue", T("Mining Fatigue", "Усталость", "Abbaulähmung")],
  ["strength", T("Strength", "Сила", "Stärke")],
  ["instant_health", T("Instant Health", "Исцеление", "Direktheilung")],
  ["instant_damage", T("Instant Damage", "Мгновенный урон", "Direktschaden")],
  ["jump_boost", T("Jump Boost", "Прыгучесть", "Sprungkraft")],
  ["nausea", T("Nausea", "Тошнота", "Übelkeit")],
  ["regeneration", T("Regeneration", "Регенерация", "Regeneration")],
  ["resistance", T("Resistance", "Сопротивление", "Resistenz")],
  ["fire_resistance", T("Fire Resistance", "Огнестойкость", "Feuerresistenz")],
  ["water_breathing", T("Water Breathing", "Подводное дыхание", "Unterwasseratmung")],
  ["invisibility", T("Invisibility", "Невидимость", "Unsichtbarkeit")],
  ["blindness", T("Blindness", "Слепота", "Blindheit")],
  ["night_vision", T("Night Vision", "Ночное зрение", "Nachtsicht")],
  ["hunger", T("Hunger", "Голод", "Hunger")],
  ["weakness", T("Weakness", "Слабость", "Schwäche")],
  ["poison", T("Poison", "Отравление", "Vergiftung")],
  ["wither", T("Wither", "Иссушение", "Verdorrung")],
  ["health_boost", T("Health Boost", "Прилив здоровья", "Extraenergie")],
  ["absorption", T("Absorption", "Поглощение", "Absorption")],
  ["saturation", T("Saturation", "Насыщение", "Sättigung")],
  ["glowing", T("Glowing", "Свечение", "Leuchten")],
  ["levitation", T("Levitation", "Левитация", "Schwebekraft")],
  ["luck", T("Luck", "Удача", "Glück")],
  ["unluck", T("Bad Luck", "Невезение", "Pech")],
  ["slow_falling", T("Slow Falling", "Плавное падение", "Sanfter Fall")],
  ["conduit_power", T("Conduit Power", "Сила источника", "Meereskraft")],
  ["dolphins_grace", T("Dolphin's Grace", "Грация дельфина", "Gunst des Delfins")],
  ["bad_omen", T("Bad Omen", "Дурное знамение", "Böses Omen")],
  ["hero_of_the_village", T("Hero of the Village", "Герой деревни", "Held des Dorfes")],
  ["darkness", T("Darkness", "Тьма", "Dunkelheit")],
  ["trial_omen", T("Trial Omen", "Знамение испытаний", "Prüfungsomen")],
  ["raid_omen", T("Raid Omen", "Знамение рейда", "Überfallomen")],
  ["wind_charged", T("Wind Charged", "Заряд ветра", "Windgeladen")],
  ["weaving", T("Weaving", "Плетение", "Weben")],
  ["oozing", T("Oozing", "Слизистость", "Schleimen")],
  ["infested", T("Infested", "Заражение", "Befall")],
  ["breath_of_the_nautilus", T("Breath of the Nautilus", "Дыхание наутилуса", "Atem des Nautilus")],
];

/* Potion registry ids (Java 1.21.11) with base names; long_/strong_ variants are built in script.js */
const POTION_BASES = [
  ["water", T("Water", "Вода", "Wasser")],
  ["mundane", T("Mundane", "Непримечательное", "Gewöhnlich")],
  ["thick", T("Thick", "Густое", "Dickflüssig")],
  ["awkward", T("Awkward", "Грубое", "Seltsam")],
  ["night_vision", T("Night Vision", "Ночное зрение", "Nachtsicht"), ["long"]],
  ["invisibility", T("Invisibility", "Невидимость", "Unsichtbarkeit"), ["long"]],
  ["leaping", T("Leaping", "Прыгучесть", "Sprungkraft"), ["long", "strong"]],
  ["fire_resistance", T("Fire Resistance", "Огнестойкость", "Feuerresistenz"), ["long"]],
  ["swiftness", T("Swiftness", "Скорость", "Schnelligkeit"), ["long", "strong"]],
  ["slowness", T("Slowness", "Замедление", "Langsamkeit"), ["long", "strong"]],
  ["turtle_master", T("Turtle Master", "Черепашья мощь", "Schildkrötenmeister"), ["long", "strong"]],
  ["water_breathing", T("Water Breathing", "Подводное дыхание", "Unterwasseratmung"), ["long"]],
  ["healing", T("Healing", "Исцеление", "Heilung"), ["strong"]],
  ["harming", T("Harming", "Вред", "Schaden"), ["strong"]],
  ["poison", T("Poison", "Отравление", "Vergiftung"), ["long", "strong"]],
  ["regeneration", T("Regeneration", "Регенерация", "Regeneration"), ["long", "strong"]],
  ["strength", T("Strength", "Сила", "Stärke"), ["long", "strong"]],
  ["weakness", T("Weakness", "Слабость", "Schwäche"), ["long"]],
  ["luck", T("Luck", "Удача", "Glück")],
  ["slow_falling", T("Slow Falling", "Плавное падение", "Sanfter Fall"), ["long"]],
  ["wind_charged", T("Wind Charging", "Заряд ветра", "Windladung")],
  ["weaving", T("Weaving", "Плетение", "Weben")],
  ["oozing", T("Oozing", "Слизистость", "Schleimen")],
  ["infested", T("Infestation", "Заражение", "Befall")],
];

/* Blocks for the Fill generator */
const BLOCKS = [
  "stone", "smooth_stone", "cobblestone", "stone_bricks", "deepslate_bricks", "polished_blackstone_bricks",
  "obsidian", "bedrock", "barrier", "air", "water", "lava", "glass", "tinted_glass",
  "white_stained_glass", "light_gray_stained_glass", "black_stained_glass",
  "oak_planks", "spruce_planks", "dark_oak_planks", "cherry_planks", "pale_oak_planks",
  "grass_block", "dirt", "sand", "red_sand", "gravel", "snow_block", "ice", "packed_ice",
  "white_concrete", "gray_concrete", "black_concrete", "red_concrete", "blue_concrete",
  "lime_concrete", "yellow_concrete", "quartz_block", "smooth_quartz", "sandstone",
  "prismarine_bricks", "sea_lantern", "glowstone", "shroomlight", "mud_bricks", "resin_bricks",
  "copper_block", "waxed_copper_block", "iron_block", "gold_block", "diamond_block",
  "emerald_block", "netherite_block", "slime_block", "honey_block", "cobweb", "tnt",
];

const FILL_MODES = ["replace", "hollow", "outline", "keep", "destroy"];

/* Mobs for the Summon generator */
const SUMMON_MOBS = [
  "zombie", "husk", "drowned", "skeleton", "stray", "bogged", "parched", "wither_skeleton",
  "creeper", "spider", "cave_spider", "enderman", "witch", "slime", "magma_cube", "blaze",
  "ghast", "piglin", "piglin_brute", "zombified_piglin", "hoglin", "pillager", "vindicator",
  "evoker", "ravager", "breeze", "creaking", "vex", "phantom", "guardian", "shulker",
  "iron_golem", "snow_golem", "copper_golem", "villager", "wandering_trader", "allay",
  "wolf", "cat", "fox", "panda", "polar_bear", "goat", "horse", "camel", "camel_husk",
  "zombie_horse", "skeleton_horse", "nautilus", "zombie_nautilus", "happy_ghast",
  "pig", "cow", "sheep", "chicken", "bee", "axolotl", "frog", "armadillo", "sniffer",
  "armor_stand", "warden", "wither", "ender_dragon", "elder_guardian", "giant", "illusioner",
];
/* Mobs that use IsBaby:1b / Age:-24000 for the "baby" option */
const BABY_ISBABY = ["zombie", "husk", "drowned", "zombified_piglin", "piglin"];
const BABY_AGE = ["villager", "wolf", "cat", "fox", "panda", "polar_bear", "goat", "horse", "camel",
  "pig", "cow", "sheep", "chicken", "bee", "axolotl", "armadillo", "sniffer", "hoglin"];

/* Text colors for the Title generator */
const TEXT_COLORS = [
  ["white", "#FFFFFF"], ["yellow", "#FFFF55"], ["gold", "#FFAA00"], ["red", "#FF5555"],
  ["dark_red", "#AA0000"], ["green", "#55FF55"], ["dark_green", "#00AA00"], ["aqua", "#55FFFF"],
  ["dark_aqua", "#00AAAA"], ["blue", "#5555FF"], ["dark_blue", "#0000AA"],
  ["light_purple", "#FF55FF"], ["dark_purple", "#AA00AA"], ["gray", "#AAAAAA"],
  ["dark_gray", "#555555"], ["black", "#000000"],
];

/* Game rules: [1.21.11 name, pre-1.21.11 name or null, type, default, description] */
const GAMERULES = [
  ["keep_inventory", "keepInventory", "bool", "false", T("Keep items and XP on death", "Сохранять вещи и опыт при смерти", "Items und XP beim Tod behalten")],
  ["advance_time", "doDaylightCycle", "bool", "true", T("Day/night cycle runs", "Смена дня и ночи", "Tag-Nacht-Zyklus läuft")],
  ["advance_weather", "doWeatherCycle", "bool", "true", T("Weather changes", "Погода меняется", "Wetter ändert sich")],
  ["natural_health_regeneration", "naturalRegeneration", "bool", "true", T("Regenerate health when fed", "Регенерация здоровья при сытости", "Leben regenerieren, wenn satt")],
  ["pvp", null, "bool", "true", T("Players can hurt players (1.21.9+)", "Игроки могут ранить игроков (1.21.9+)", "Spieler können Spieler verletzen (1.21.9+)")],
  ["show_death_messages", "showDeathMessages", "bool", "true", T("Death messages in chat", "Сообщения о смерти в чате", "Todesnachrichten im Chat")],
  ["immediate_respawn", "doImmediateRespawn", "bool", "false", T("Skip the death screen", "Пропускать экран смерти", "Todesbildschirm überspringen")],
  ["fall_damage", "fallDamage", "bool", "true", T("Fall damage", "Урон от падения", "Fallschaden")],
  ["fire_damage", "fireDamage", "bool", "true", T("Fire damage", "Урон от огня", "Feuerschaden")],
  ["drowning_damage", "drowningDamage", "bool", "true", T("Drowning damage", "Урон от утопления", "Ertrinkungsschaden")],
  ["freeze_damage", "freezeDamage", "bool", "true", T("Powder snow freeze damage", "Урон от замерзания", "Erfrierungsschaden")],
  ["spawn_mobs", "doMobSpawning", "bool", "true", T("Mobs spawn naturally", "Мобы появляются сами", "Mobs spawnen natürlich")],
  ["spawn_monsters", null, "bool", "true", T("Monsters spawn (1.21.9+)", "Монстры появляются (1.21.9+)", "Monster spawnen (1.21.9+)")],
  ["mob_griefing", "mobGriefing", "bool", "true", T("Mobs can change blocks", "Мобы могут менять блоки", "Mobs können Blöcke verändern")],
  ["spawn_phantoms", "doInsomnia", "bool", "true", T("Phantoms spawn", "Фантомы появляются", "Phantome spawnen")],
  ["spawn_patrols", "doPatrolSpawning", "bool", "true", T("Pillager patrols spawn", "Патрули разбойников", "Plünderer-Patrouillen")],
  ["spawn_wandering_traders", "doTraderSpawning", "bool", "true", T("Wandering traders spawn", "Странствующие торговцы", "Fahrende Händler")],
  ["spawn_wardens", "doWardenSpawning", "bool", "true", T("Wardens spawn", "Хранители появляются", "Wärter spawnen")],
  ["raids", "disableRaids", "bool", "true", T("Raids happen (the old rule is the opposite!)", "Рейды происходят (старое правило — наоборот!)", "Überfälle finden statt (alte Regel ist umgekehrt!)"), "invert"],
  ["block_drops", "doTileDrops", "bool", "true", T("Broken blocks drop items", "Сломанные блоки выпадают", "Abgebaute Blöcke droppen")],
  ["mob_drops", "doMobLoot", "bool", "true", T("Mobs drop loot", "Мобы оставляют лут", "Mobs droppen Beute")],
  ["entity_drops", "doEntityDrops", "bool", "true", T("Minecarts, boats etc. drop items", "Вагонетки, лодки и т. п. выпадают", "Loren, Boote usw. droppen")],
  ["tnt_explodes", null, "bool", "true", T("TNT can explode (1.21.5+)", "Динамит взрывается (1.21.5+)", "TNT kann explodieren (1.21.5+)")],
  ["projectiles_can_break_blocks", null, "bool", "true", T("Projectiles break blocks", "Снаряды ломают блоки", "Geschosse zerstören Blöcke")],
  ["ender_pearls_vanish_on_death", null, "bool", "true", T("Thrown pearls vanish on death", "Брошенный жемчуг исчезает при смерти", "Geworfene Perlen verschwinden beim Tod")],
  ["fire_spread_radius_around_player", "doFireTick", "int", "128", T("Fire spread radius (0 = off, -1 = unlimited). The old rule was true/false.", "Радиус огня (0 = выкл., -1 = без предела). Старое правило было true/false.", "Feuer-Radius (0 = aus, -1 = unbegrenzt). Die alte Regel war true/false."), "fire"],
  ["players_sleeping_percentage", "playersSleepingPercentage", "int", "100", T("% of players needed to skip night", "% игроков, нужных чтобы пропустить ночь", "% Spieler zum Überspringen der Nacht")],
  ["random_tick_speed", "randomTickSpeed", "int", "3", T("Crop/plant growth speed", "Скорость роста растений", "Wachstumstempo")],
  ["respawn_radius", "spawnRadius", "int", "10", T("Spawn spread around world spawn", "Разброс спавна вокруг точки мира", "Spawn-Streuung um den Welt-Spawn")],
  ["max_entity_cramming", "maxEntityCramming", "int", "24", T("Mobs in one block before damage", "Мобов в блоке до урона от давки", "Mobs pro Block bis zum Quetschschaden")],
  ["max_block_modifications", "commandModificationBlockLimit", "int", "32768", T("Block limit for fill/clone", "Лимит блоков для fill/clone", "Blocklimit für fill/clone")],
  ["send_command_feedback", "sendCommandFeedback", "bool", "true", T("Command feedback in chat", "Ответы команд в чате", "Befehlsrückmeldung im Chat")],
  ["command_block_output", "commandBlockOutput", "bool", "true", T("Command blocks notify OPs", "Командные блоки пишут операторам", "Befehlsblöcke melden an OPs")],
  ["command_blocks_work", "commandBlocksEnabled", "bool", "true", T("Command blocks run (old name only 1.21.9–1.21.10)", "Командные блоки работают (старое имя только в 1.21.9–1.21.10)", "Befehlsblöcke laufen (alter Name nur 1.21.9–1.21.10)")],
  ["show_advancement_messages", "announceAdvancements", "bool", "true", T("Advancement messages in chat", "Сообщения о достижениях", "Fortschritts-Meldungen im Chat")],
  ["log_admin_commands", "logAdminCommands", "bool", "true", T("Log OP commands", "Логировать команды операторов", "OP-Befehle protokollieren")],
  ["reduced_debug_info", "reducedDebugInfo", "bool", "false", T("Hide coordinates in F3", "Скрыть координаты в F3", "Koordinaten in F3 verstecken")],
  ["spectators_generate_chunks", "spectatorsGenerateChunks", "bool", "true", T("Spectators load new chunks", "Наблюдатели генерируют чанки", "Zuschauer erzeugen Chunks")],
  ["limited_crafting", "doLimitedCrafting", "bool", "false", T("Only unlocked recipes craftable", "Крафт только открытых рецептов", "Nur freigeschaltete Rezepte")],
  ["forgive_dead_players", null, "bool", "true", T("Angry mobs calm down when target dies", "Мобы успокаиваются после смерти цели", "Wütende Mobs beruhigen sich")],
  ["universal_anger", null, "bool", "false", T("Angry mobs attack everyone", "Злые мобы атакуют всех", "Wütende Mobs greifen alle an")],
];

/* Attributes for the Attribute generator: [id, default, slider min, slider max, step] */
const ATTRIBUTES = [
  ["max_health", 20, 1, 1024, 1],
  ["attack_damage", 1, 0, 2048, 1],
  ["attack_speed", 4, 0, 1024, 0.5],
  ["attack_knockback", 0, 0, 5, 0.1],
  ["movement_speed", 0.1, 0, 1, 0.01],
  ["scale", 1, 0.0625, 16, 0.0625],
  ["jump_strength", 0.42, 0, 5, 0.01],
  ["gravity", 0.08, -1, 1, 0.01],
  ["step_height", 0.6, 0, 10, 0.1],
  ["safe_fall_distance", 3, 0, 1024, 1],
  ["fall_damage_multiplier", 1, 0, 100, 0.1],
  ["block_interaction_range", 4.5, 0, 64, 0.5],
  ["entity_interaction_range", 3, 0, 64, 0.5],
  ["block_break_speed", 1, 0, 1024, 0.5],
  ["mining_efficiency", 0, 0, 1024, 1],
  ["submerged_mining_speed", 0.2, 0, 20, 0.1],
  ["knockback_resistance", 0, 0, 1, 0.05],
  ["explosion_knockback_resistance", 0, 0, 1, 0.05],
  ["armor", 0, 0, 30, 1],
  ["armor_toughness", 0, 0, 20, 1],
  ["max_absorption", 0, 0, 2048, 1],
  ["luck", 0, -1024, 1024, 1],
  ["oxygen_bonus", 0, 0, 1024, 1],
  ["sneaking_speed", 0.3, 0, 1, 0.05],
  ["movement_efficiency", 0, 0, 1, 0.05],
  ["water_movement_efficiency", 0, 0, 1, 0.05],
  ["burning_time", 1, 0, 1024, 0.1],
  ["sweeping_damage_ratio", 0, 0, 1, 0.05],
];

