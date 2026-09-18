/* ==========================================================================
   MC Command Hub — script.js
   Rendering, search, favorites, player selector, kits and generators.
   No frameworks, no build step. Data comes from commands.js.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Interface translations
     ------------------------------------------------------------------------ */
  const UI = {
    en: {
      tagline: "Every command that works in a command block — Java 1.21.11",
      search: "Search commands…",
      searchHint: "Press / to search",
      target: "Target",
      tS: "@s — me", tP: "@p — nearest player", tA: "@a — all players", tR: "@r — random player",
      tCustom: "Player name…",
      namePh: "PlayerName",
      nameBad: "Names are 3–16 letters, digits or _",
      shortIds: "Short IDs",
      shortIdsTip: "Leave out “minecraft:” to make commands shorter (works the same)",
      tabAll: "All", tabFav: "Favorites", tabGen: "Generator", tabHelp: "Help",
      copy: "Copy", copied: "Copied!", copyFail: "Press Ctrl+C", copyAll: "Copy all",
      favAdd: "Add to favorites", favRemove: "Remove from favorites",
      lvlTip: "Permission level — a command block runs at level 2",
      aliasTip: "Short alias for the same command",
      atSelfWarn: "@s does not point at a player inside a command block — use @p or @a.",
      tooLong: "{n} characters — over the command block limit of 32,500. Split it up or turn on Short IDs.",
      found: "{n} commands found", foundIn: "in {cat}",
      noResults: "No commands match “{q}”.",
      searchAll: "Search all categories",
      clearSearch: "Clear search",
      favEmpty: "No favorites yet. Click the ☆ on any command to pin it here.",
      note: "Note", warning: "Warning",
      chatOneByOne: "One command per block: impulse block first, then chain blocks set to Always Active — or use the single-command kit chest below.",
      /* armor & tools panels */
      armorSet: "Give full armor set", toolsSet: "Give all tools",
      equip: "Put armor on directly (item replace)",
      toolEnch: "Tool enchantment:", fortune: "Fortune III", silk: "Silk Touch",
      close: "Close",
      /* kits */
      fullKit: "Full PvP kit", preset: "Kit preset", choosePreset: "Choose a kit…",
      totemOff: "Also put a totem in the offhand",
      kitChest: "Kit chest — one command (command blocks only)",
      kitChestInfo: "Places chest(s) filled with the whole kit right next to the command block (east side). It is far too long for chat.",
      kitChain: "Kit as a command block chain",
      kitChainSteps: [
        "Place a command block. Set it to <b>Impulse</b> + <b>Needs Redstone</b> and put a <b>button</b> on it. Paste the first command.",
        "Place the next command block in the direction the arrow on the first block points. Set it to <b>Chain</b>, <b>Unconditional</b> and <b>Always Active</b>. Paste the next command.",
        "Repeat: one command per block, always following the arrows.",
        "Use <b>@p</b> or <b>@a</b> as target — <b>@s</b> does not work in command blocks.",
        "Press the button: the whole kit is given at once. Tip: <code>gamerule command_block_output false</code> stops chat spam.",
      ],
      editInBuilder: "Edit in Kit builder",
      stats: "{c} commands · {s} inventory slots",
      tooManySlots: "More than 36 stacks: items that don't fit are dropped on the ground.",
      /* generator */
      genIntro: "Build your own commands. Every generator follows the target selector at the top.",
      gGive: "Give", gEffect: "Effect", gFill: "Fill", gPotion: "Potion", gKit: "Kit builder",
      gSummon: "Summon", gTitle: "Title & chat", gAttr: "Attribute", gBorder: "World border", gRule: "Game rules",
      item: "Item", searchItems: "Search items…", amount: "Amount",
      enchantments: "Enchantments", overMax: "Allow over-max levels and conflicting enchants",
      conflictRemoved: "Removed because it conflicts: {list}",
      noEnchants: "This item has no enchantments.",
      unbreakable: "Unbreakable", customName: "Custom name (optional)", color: "Color",
      bookNote: "Enchanted books store the enchantments — combine them with items in an anvil.",
      effect: "Effect", duration: "Duration (seconds)", infinite: "Infinite", level: "Amplifier",
      levelShown: "shown as level {n}", hideParticles: "Hide particles", clearLine: "Remove this effect",
      from: "Corner 1 (x y z)", to: "Corner 2 (x y z)", block: "Block", mode: "Mode",
      filter: "Only replace this block (optional)", none: "— none —",
      blockCount: "Blocks: {n}", blockCountUnknown: "Blocks: can't count (mix of ~ and numbers)",
      overLimit: "Over the 32,768 block limit! Split the area into smaller parts.",
      coordHint: "Use numbers (press F3 to see your coordinates) or ~ for your position, e.g. ~5.",
      modeHelp: {
        replace: "Replace everything in the area.",
        hollow: "Outer shell of the block, inside becomes air.",
        outline: "Outer shell only, the inside is kept.",
        keep: "Only fill air, existing blocks stay.",
        destroy: "Replace and drop the old blocks as items.",
      },
      potion: "Potion", form: "Type", fDrink: "Drinkable", fSplash: "Splash", fLinger: "Lingering", fArrow: "Tipped arrow",
      long: "long", noEffectPotion: "This potion has no effect (it's a brewing ingredient).",
      loadPreset: "Load a preset", selectAll: "All", selectNone: "None",
      mob: "Mob", position: "Position", noAI: "No AI (stands still)", silent: "Silent", invulnerable: "Invulnerable",
      persistent: "Never despawns", glowing: "Glowing", baby: "Baby", showName: "Always show the name",
      titleType: "Where", ttTitle: "Big title", ttSubtitle: "Subtitle", ttActionbar: "Action bar (above hotbar)", ttChat: "Chat message",
      text: "Text", bold: "Bold", italic: "Italic", preview: "Preview", subtitleNote: "Shows the subtitle",
      attribute: "Attribute", action: "Action", aSet: "Set base value", aReset: "Reset to default", aGet: "Show current value",
      value: "Value", defaultVal: "Default: {v}",
      singleNote: "This command accepts only one target — with @a it is wrapped in “execute as @a run …”.",
      centerX: "Center X", centerZ: "Center Z", startSize: "Start size (blocks)", endSize: "Final size (blocks)",
      shrinkTime: "Shrink time (seconds)", dmg: "Damage per block outside", warnDist: "Warning distance",
      bCenter: "Center", bStart: "Start size", bShrink: "Shrink", bDamage: "Damage", bWarn: "Warning", bReset: "Reset after the match",
      borderNote: "Since 1.21.11 a plain number is in ticks — the “s” suffix means seconds.",
      rule: "Game rule", ruleNew: "1.21.11+ (new name)", ruleOld: "Before 1.21.11 (old name)",
      ruleNoOld: "This rule has no old name.",
      ruleTab: "Not sure which name your server accepts? Type /gamerule, a space, then press Tab.",
      /* help */
      helpTitle: "Help",
      footer: "Made for vanilla Minecraft Java 1.21.11 · Runs fully in your browser · Not affiliated with Mojang or Microsoft.",
      toTop: "Back to top",
    },

    ru: {
      tagline: "Все команды, которые работают в командном блоке — Java 1.21.11",
      search: "Поиск команд…",
      searchHint: "Нажмите / для поиска",
      target: "Цель",
      tS: "@s — я", tP: "@p — ближайший игрок", tA: "@a — все игроки", tR: "@r — случайный игрок",
      tCustom: "Имя игрока…",
      namePh: "PlayerName",
      nameBad: "Ник: 3–16 латинских букв, цифр или _",
      shortIds: "Короткие ID",
      shortIdsTip: "Убрать «minecraft:», чтобы команды были короче (работают так же)",
      tabAll: "Все", tabFav: "Избранное", tabGen: "Генератор", tabHelp: "Помощь",
      copy: "Копировать", copied: "Скопировано!", copyFail: "Нажмите Ctrl+C", copyAll: "Копировать всё",
      favAdd: "В избранное", favRemove: "Убрать из избранного",
      lvlTip: "Уровень прав — командный блок работает на уровне 2",
      aliasTip: "Короткий псевдоним той же команды",
      atSelfWarn: "@s внутри командного блока не указывает на игрока — используйте @p или @a.",
      tooLong: "{n} символов — больше лимита командного блока в 32 500. Разделите команду или включите короткие ID.",
      found: "Найдено команд: {n}", foundIn: "в разделе «{cat}»",
      noResults: "Нет команд по запросу «{q}».",
      searchAll: "Искать во всех разделах",
      clearSearch: "Очистить поиск",
      favEmpty: "Избранного пока нет. Нажмите ☆ у любой команды, чтобы закрепить её здесь.",
      note: "Заметка", warning: "Внимание",
      chatOneByOne: "По одной команде на блок: сначала импульсный блок, затем цепные с «Всегда активен» — или используйте сундук с набором одной командой ниже.",
      armorSet: "Выдать полный комплект брони", toolsSet: "Выдать все инструменты",
      equip: "Сразу надеть броню (item replace)",
      toolEnch: "Зачарование инструментов:", fortune: "Удача III", silk: "Шёлковое касание",
      close: "Закрыть",
      fullKit: "Полный PvP-набор", preset: "Готовый набор", choosePreset: "Выберите набор…",
      totemOff: "Ещё и тотем во вторую руку",
      kitChest: "Сундук с набором — одна команда (только для командного блока)",
      kitChestInfo: "Ставит сундук(и) со всем набором рядом с командным блоком (с восточной стороны). Для чата команда слишком длинная.",
      kitChain: "Набор как цепочка командных блоков",
      kitChainSteps: [
        "Поставьте командный блок. Режим <b>Импульсный</b> + <b>Нужен редстоун</b>, сверху — <b>кнопка</b>. Вставьте первую команду.",
        "Следующий командный блок ставьте туда, куда указывает стрелка на первом. Режим <b>Цепной</b>, <b>Безусловный</b> и <b>Всегда активен</b>. Вставьте следующую команду.",
        "Повторяйте: одна команда на блок, всегда по стрелкам.",
        "В качестве цели используйте <b>@p</b> или <b>@a</b> — <b>@s</b> в командных блоках не работает.",
        "Нажмите кнопку — весь набор выдаётся сразу. Совет: <code>gamerule command_block_output false</code> убирает спам в чате.",
      ],
      editInBuilder: "Изменить в конструкторе",
      stats: "Команд: {c} · слотов инвентаря: {s}",
      tooManySlots: "Больше 36 стаков: то, что не поместится, выпадет на землю.",
      genIntro: "Соберите свои команды. Все генераторы используют цель, выбранную вверху.",
      gGive: "Предметы", gEffect: "Эффекты", gFill: "Заполнение", gPotion: "Зелья", gKit: "Конструктор наборов",
      gSummon: "Призыв", gTitle: "Заголовки и чат", gAttr: "Атрибуты", gBorder: "Граница мира", gRule: "Игровые правила",
      item: "Предмет", searchItems: "Поиск предметов…", amount: "Количество",
      enchantments: "Зачарования", overMax: "Разрешить уровни выше максимума и несовместимые чары",
      conflictRemoved: "Убрано из-за несовместимости: {list}",
      noEnchants: "У этого предмета нет зачарований.",
      unbreakable: "Неразрушимый", customName: "Своё название (необязательно)", color: "Цвет",
      bookNote: "Зачарованные книги хранят чары — соединяйте их с предметами на наковальне.",
      effect: "Эффект", duration: "Длительность (секунды)", infinite: "Бесконечно", level: "Усилитель",
      levelShown: "отображается как уровень {n}", hideParticles: "Скрыть частицы", clearLine: "Снять этот эффект",
      from: "Угол 1 (x y z)", to: "Угол 2 (x y z)", block: "Блок", mode: "Режим",
      filter: "Заменять только этот блок (необязательно)", none: "— нет —",
      blockCount: "Блоков: {n}", blockCountUnknown: "Блоков: не посчитать (смешаны ~ и числа)",
      overLimit: "Больше лимита 32 768 блоков! Разделите область на части.",
      coordHint: "Числа (F3 покажет ваши координаты) или ~ для вашей позиции, например ~5.",
      modeHelp: {
        replace: "Заменить всё в области.",
        hollow: "Внешняя оболочка из блока, внутри воздух.",
        outline: "Только внешняя оболочка, внутри всё остаётся.",
        keep: "Заполнить только воздух, блоки остаются.",
        destroy: "Заменить, а старые блоки выпадут предметами.",
      },
      potion: "Зелье", form: "Вид", fDrink: "Обычное", fSplash: "Взрывное", fLinger: "Оседающее", fArrow: "Стрела с эффектом",
      long: "долгое", noEffectPotion: "У этого зелья нет эффекта (это основа для варки).",
      loadPreset: "Загрузить набор", selectAll: "Все", selectNone: "Ничего",
      mob: "Моб", position: "Позиция", noAI: "Без ИИ (стоит на месте)", silent: "Беззвучный", invulnerable: "Неуязвимый",
      persistent: "Никогда не исчезает", glowing: "Свечение", baby: "Детёныш", showName: "Всегда показывать имя",
      titleType: "Где", ttTitle: "Большой заголовок", ttSubtitle: "Подзаголовок", ttActionbar: "Над хотбаром", ttChat: "Сообщение в чат",
      text: "Текст", bold: "Жирный", italic: "Курсив", preview: "Предпросмотр", subtitleNote: "Показывает подзаголовок",
      attribute: "Атрибут", action: "Действие", aSet: "Задать базовое значение", aReset: "Сбросить", aGet: "Показать значение",
      value: "Значение", defaultVal: "По умолчанию: {v}",
      singleNote: "Эта команда принимает только одну цель — с @a она оборачивается в «execute as @a run …».",
      centerX: "Центр X", centerZ: "Центр Z", startSize: "Начальный размер (блоки)", endSize: "Конечный размер (блоки)",
      shrinkTime: "Время сужения (секунды)", dmg: "Урон за блок снаружи", warnDist: "Дистанция предупреждения",
      bCenter: "Центр", bStart: "Начальный размер", bShrink: "Сужение", bDamage: "Урон", bWarn: "Предупреждение", bReset: "Сброс после матча",
      borderNote: "С 1.21.11 число без суффикса — это тики, суффикс «s» — секунды.",
      rule: "Игровое правило", ruleNew: "1.21.11+ (новое имя)", ruleOld: "До 1.21.11 (старое имя)",
      ruleNoOld: "У этого правила нет старого имени.",
      ruleTab: "Не знаете, какое имя принимает сервер? Введите /gamerule, пробел и нажмите Tab.",
      helpTitle: "Помощь",
      footer: "Для ванильного Minecraft Java 1.21.11 · Работает полностью в браузере · Не связано с Mojang или Microsoft.",
      toTop: "Наверх",
    },

    de: {
      tagline: "Jeder Befehl, der im Befehlsblock funktioniert — Java 1.21.11",
      search: "Befehle suchen…",
      searchHint: "Drücke / zum Suchen",
      target: "Ziel",
      tS: "@s — ich", tP: "@p — nächster Spieler", tA: "@a — alle Spieler", tR: "@r — zufälliger Spieler",
      tCustom: "Spielername…",
      namePh: "PlayerName",
      nameBad: "Namen: 3–16 Buchstaben, Ziffern oder _",
      shortIds: "Kurze IDs",
      shortIdsTip: "„minecraft:“ weglassen, damit Befehle kürzer werden (funktionieren genauso)",
      tabAll: "Alle", tabFav: "Favoriten", tabGen: "Generator", tabHelp: "Hilfe",
      copy: "Kopieren", copied: "Kopiert!", copyFail: "Strg+C drücken", copyAll: "Alle kopieren",
      favAdd: "Zu Favoriten", favRemove: "Aus Favoriten entfernen",
      lvlTip: "Berechtigungsstufe — ein Befehlsblock läuft auf Stufe 2",
      aliasTip: "Kurzform desselben Befehls",
      atSelfWarn: "@s zeigt im Befehlsblock auf keinen Spieler — nimm @p oder @a.",
      tooLong: "{n} Zeichen — über dem Befehlsblock-Limit von 32.500. Teile ihn auf oder aktiviere kurze IDs.",
      found: "{n} Befehle gefunden", foundIn: "in „{cat}“",
      noResults: "Keine Befehle für „{q}“.",
      searchAll: "In allen Kategorien suchen",
      clearSearch: "Suche leeren",
      favEmpty: "Noch keine Favoriten. Klicke bei einem Befehl auf ☆, um ihn hier anzuheften.",
      note: "Hinweis", warning: "Achtung",
      chatOneByOne: "Ein Befehl pro Block: zuerst ein Impulsblock, dann Kettenblöcke auf „Immer aktiv“ — oder nimm unten die Kit-Truhe mit nur einem Befehl.",
      armorSet: "Komplette Rüstung geben", toolsSet: "Alle Werkzeuge geben",
      equip: "Rüstung direkt anziehen (item replace)",
      toolEnch: "Werkzeug-Verzauberung:", fortune: "Glück III", silk: "Behutsamkeit",
      close: "Schließen",
      fullKit: "Komplettes PvP-Kit", preset: "Kit-Vorlage", choosePreset: "Kit wählen…",
      totemOff: "Zusätzlich ein Totem in die Nebenhand",
      kitChest: "Kit-Truhe — ein Befehl (nur für Befehlsblöcke)",
      kitChestInfo: "Setzt Truhe(n) mit dem ganzen Kit direkt neben den Befehlsblock (Ostseite). Für den Chat viel zu lang.",
      kitChain: "Kit als Befehlsblock-Kette",
      kitChainSteps: [
        "Setze einen Befehlsblock. Stelle <b>Impuls</b> + <b>Benötigt Redstone</b> ein und setze einen <b>Knopf</b> drauf. Ersten Befehl einfügen.",
        "Setze den nächsten Befehlsblock in die Richtung, in die der Pfeil auf dem ersten Block zeigt. Stelle <b>Kette</b>, <b>Unbedingt</b> und <b>Immer aktiv</b> ein. Nächsten Befehl einfügen.",
        "Wiederholen: ein Befehl pro Block, immer den Pfeilen nach.",
        "Nutze <b>@p</b> oder <b>@a</b> als Ziel — <b>@s</b> funktioniert in Befehlsblöcken nicht.",
        "Knopf drücken: Das ganze Kit wird auf einmal vergeben. Tipp: <code>gamerule command_block_output false</code> stoppt Chat-Spam.",
      ],
      editInBuilder: "Im Kit-Baukasten bearbeiten",
      stats: "{c} Befehle · {s} Inventarplätze",
      tooManySlots: "Mehr als 36 Stapel: Was nicht passt, fällt auf den Boden.",
      genIntro: "Baue eigene Befehle. Alle Generatoren nutzen das Ziel aus der Auswahl oben.",
      gGive: "Items", gEffect: "Effekte", gFill: "Füllen", gPotion: "Tränke", gKit: "Kit-Baukasten",
      gSummon: "Beschwören", gTitle: "Titel & Chat", gAttr: "Attribute", gBorder: "Weltbarriere", gRule: "Spielregeln",
      item: "Item", searchItems: "Items suchen…", amount: "Anzahl",
      enchantments: "Verzauberungen", overMax: "Stufen über dem Maximum und unverträgliche Verzauberungen erlauben",
      conflictRemoved: "Wegen Unverträglichkeit entfernt: {list}",
      noEnchants: "Dieses Item hat keine Verzauberungen.",
      unbreakable: "Unzerstörbar", customName: "Eigener Name (optional)", color: "Farbe",
      bookNote: "Verzauberte Bücher speichern die Verzauberungen — am Amboss mit Items kombinieren.",
      effect: "Effekt", duration: "Dauer (Sekunden)", infinite: "Unendlich", level: "Verstärker",
      levelShown: "wird als Stufe {n} angezeigt", hideParticles: "Partikel verstecken", clearLine: "Diesen Effekt entfernen",
      from: "Ecke 1 (x y z)", to: "Ecke 2 (x y z)", block: "Block", mode: "Modus",
      filter: "Nur diesen Block ersetzen (optional)", none: "— keiner —",
      blockCount: "Blöcke: {n}", blockCountUnknown: "Blöcke: nicht zählbar (~ und Zahlen gemischt)",
      overLimit: "Über dem Limit von 32.768 Blöcken! Teile den Bereich auf.",
      coordHint: "Zahlen (F3 zeigt deine Koordinaten) oder ~ für deine Position, z. B. ~5.",
      modeHelp: {
        replace: "Alles im Bereich ersetzen.",
        hollow: "Außenhülle aus dem Block, innen wird Luft.",
        outline: "Nur die Außenhülle, das Innere bleibt.",
        keep: "Nur Luft füllen, Blöcke bleiben.",
        destroy: "Ersetzen und alte Blöcke als Items droppen.",
      },
      potion: "Trank", form: "Art", fDrink: "Trinkbar", fSplash: "Wurftrank", fLinger: "Verweiltrank", fArrow: "Getränkter Pfeil",
      long: "lang", noEffectPotion: "Dieser Trank hat keine Wirkung (Brau-Grundlage).",
      loadPreset: "Vorlage laden", selectAll: "Alle", selectNone: "Keine",
      mob: "Mob", position: "Position", noAI: "Keine KI (steht still)", silent: "Lautlos", invulnerable: "Unverwundbar",
      persistent: "Verschwindet nie", glowing: "Leuchten", baby: "Baby", showName: "Namen immer anzeigen",
      titleType: "Wo", ttTitle: "Großer Titel", ttSubtitle: "Untertitel", ttActionbar: "Aktionsleiste (über der Hotbar)", ttChat: "Chatnachricht",
      text: "Text", bold: "Fett", italic: "Kursiv", preview: "Vorschau", subtitleNote: "Zeigt den Untertitel an",
      attribute: "Attribut", action: "Aktion", aSet: "Basiswert setzen", aReset: "Auf Standard zurücksetzen", aGet: "Aktuellen Wert zeigen",
      value: "Wert", defaultVal: "Standard: {v}",
      singleNote: "Dieser Befehl akzeptiert nur ein Ziel — mit @a wird er in „execute as @a run …“ verpackt.",
      centerX: "Mitte X", centerZ: "Mitte Z", startSize: "Startgröße (Blöcke)", endSize: "Endgröße (Blöcke)",
      shrinkTime: "Schrumpfzeit (Sekunden)", dmg: "Schaden pro Block außerhalb", warnDist: "Warnabstand",
      bCenter: "Mitte", bStart: "Startgröße", bShrink: "Schrumpfen", bDamage: "Schaden", bWarn: "Warnung", bReset: "Nach dem Match zurücksetzen",
      borderNote: "Seit 1.21.11 ist eine reine Zahl in Ticks — das Suffix „s“ bedeutet Sekunden.",
      rule: "Spielregel", ruleNew: "1.21.11+ (neuer Name)", ruleOld: "Vor 1.21.11 (alter Name)",
      ruleNoOld: "Diese Regel hat keinen alten Namen.",
      ruleTab: "Unsicher, welchen Namen dein Server akzeptiert? Tippe /gamerule, ein Leerzeichen und drücke Tab.",
      helpTitle: "Hilfe",
      footer: "Für Vanilla Minecraft Java 1.21.11 · Läuft komplett im Browser · Nicht mit Mojang oder Microsoft verbunden.",
      toTop: "Nach oben",
    },
  };

  /* ------------------------------------------------------------------------
     2. Help page (static HTML per language)
     ------------------------------------------------------------------------ */
  const HELP = {
    en: `
<section class="help-block">
  <h3>1. Command blocks in 60 seconds</h3>
  <ol>
    <li>Get one: <code>/give @s minecraft:command_block</code> (Creative mode, operator).</li>
    <li>Place it, right-click it, paste a command. <b>No leading slash</b> — every Copy button here already leaves it out.</li>
    <li>Power it with a <b>button</b> (one pulse) or a <b>lever</b> (stays on), on the block or next to it.</li>
    <li>A block holds up to <b>32,500 characters</b>, so length is never a problem here.</li>
  </ol>
  <div class="mode-grid">
    <div class="mode mode-impulse"><b>Impulse</b> (orange)<br>Runs once each time it gets a redstone signal.</div>
    <div class="mode mode-chain"><b>Chain</b> (green)<br>Runs right after the block whose arrow points into it. Build long sequences with it.</div>
    <div class="mode mode-repeat"><b>Repeat</b> (purple)<br>Runs every game tick (20× per second) while powered. Careful with <code>give</code>!</div>
  </div>
  <ul>
    <li><b>Needs Redstone</b>: only runs when powered. <b>Always Active</b>: runs without redstone — use this for chain blocks.</li>
    <li><b>Conditional</b>: only runs if the previous block in the chain succeeded. <b>Unconditional</b>: always runs.</li>
    <li>A chain block fires in the same tick as the impulse block in front of it, in arrow order.</li>
  </ul>
</section>
<section class="help-block">
  <h3>2. Permission level 2 — what a block may do</h3>
  <p>A command block runs at <b>permission level 2</b>. Commands that need level 3 or 4 fail silently in a block, no matter who placed it:</p>
  <p><code>/op</code> <code>/deop</code> <code>/ban</code> <code>/kick</code> <code>/whitelist</code> <code>/stop</code> <code>/save-all</code> <code>/setidletimeout</code> <code>/transfer</code> <code>/debug</code> <code>/list</code> <code>/tick</code></p>
  <p>Everything else — all 63 commands in the reference tab — works. Run the level-3 ones in chat as an operator or from the server console instead.</p>
  <ul>
    <li><code>@s</code> does not point at a player inside a block (the block is the executor). Use <code>@p</code> or <code>@a</code>.</li>
    <li>Commands that take a single target (<code>attribute</code>, <code>ride</code>, <code>damage</code>, <code>rotate</code>) need <code>execute as @a run …</code> to hit everyone — this page does that for you.</li>
  </ul>
</section>
<section class="help-block">
  <h3>3. Target selectors</h3>
  <table class="help-table">
    <tr><td><code>@s</code></td><td>yourself (whoever runs the command)</td></tr>
    <tr><td><code>@p</code></td><td>the nearest player</td></tr>
    <tr><td><code>@a</code></td><td>all players</td></tr>
    <tr><td><code>@r</code></td><td>a random player</td></tr>
    <tr><td><code>@e</code></td><td>all entities — mobs, items, boats… <b>and players</b>. Always filter it!</td></tr>
  </table>
  <p>Filters go in square brackets: <code>@e[type=minecraft:zombie]</code>, <code>@e[distance=..10]</code> (within 10 blocks), <code>@a[team=red]</code>, <code>@e[type=minecraft:horse,sort=nearest,limit=1]</code>, <code>@e[type=!minecraft:player]</code> (<b>!</b> means “not”).</p>
  <p>The <b>Target</b> dropdown at the top of this page changes every command at once.</p>
</section>
<section class="help-block">
  <h3>4. Chaining commands</h3>
  <ul>
    <li><b>Impulse</b> block with a button, then <b>Chain + Unconditional + Always Active</b> blocks behind it, following the arrows: one command per block, all executed in one tick.</li>
    <li>Prefer a <b>Repeat</b> block (Always Active) for anything that must be checked constantly, e.g. <code>execute as @a at @s if block ~ ~-1 ~ minecraft:gold_block run …</code></li>
    <li><code>gamerule command_block_output false</code> stops the chat spam from every block.</li>
    <li><code>gamerule send_command_feedback false</code> hides the “Gave 1 … to …” lines too.</li>
    <li>A repeating <code>give</code> hands out items 20× per second — use a tag or a scoreboard so it only fires once.</li>
  </ul>
</section>
<section class="help-block">
  <h3>5. Good to know</h3>
  <ul>
    <li><b>Tab</b> autocompletes commands, items and game rules while typing in a block.</li>
    <li><b>F3</b> shows your coordinates. <code>~</code> means “this block’s position”, <code>~5</code> = 5 blocks further, <code>^ ^ ^3</code> = 3 blocks in the direction the executor faces.</li>
    <li>1.21.11 renamed all game rules (e.g. <code>keepInventory</code> → <code>keep_inventory</code>). Type <code>gamerule </code> and press Tab to see the names your server accepts.</li>
    <li><code>minecraft:</code> can be left out — the <b>Short IDs</b> switch does it for every command on this page.</li>
    <li>Since 1.20.5 items use components: <code>item[enchantments={…}]</code>. Old NBT like <code>{Enchantments:[…]}</code> no longer works.</li>
    <li>Fill and clone are limited to 32,768 blocks per command.</li>
  </ul>
</section>
<section class="help-block">
  <h3>6. Shortcuts on this page</h3>
  <ul>
    <li><kbd>/</kbd> — jump to the search box</li>
    <li><kbd>Esc</kbd> — clear the search</li>
    <li>☆ — save a command to <b>Favorites</b> (stored only in this browser)</li>
  </ul>
</section>`,

    ru: `
<section class="help-block">
  <h3>1. Командные блоки за 60 секунд</h3>
  <ol>
    <li>Получить: <code>/give @s minecraft:command_block</code> (творческий режим, права оператора).</li>
    <li>Поставьте блок, нажмите ПКМ, вставьте команду. <b>Слеш не нужен</b> — кнопки «Копировать» здесь его не добавляют.</li>
    <li>Запитайте <b>кнопкой</b> (один импульс) или <b>рычагом</b> (сигнал держится) — на блоке или рядом.</li>
    <li>В блок помещается до <b>32 500 символов</b>, так что длина здесь не проблема.</li>
  </ol>
  <div class="mode-grid">
    <div class="mode mode-impulse"><b>Импульсный</b> (оранжевый)<br>Срабатывает один раз при каждом сигнале редстоуна.</div>
    <div class="mode mode-chain"><b>Цепной</b> (зелёный)<br>Срабатывает сразу после блока, стрелка которого указывает на него. Для длинных цепочек.</div>
    <div class="mode mode-repeat"><b>Повторяющийся</b> (фиолетовый)<br>Срабатывает каждый тик (20 раз в секунду), пока запитан. Осторожно с <code>give</code>!</div>
  </div>
  <ul>
    <li><b>Нужен редстоун</b>: работает только с сигналом. <b>Всегда активен</b>: работает без редстоуна — для цепных блоков.</li>
    <li><b>Условный</b>: срабатывает, только если предыдущий блок цепи выполнился успешно. <b>Безусловный</b>: срабатывает всегда.</li>
    <li>Цепной блок срабатывает в тот же тик, что и импульсный перед ним, по порядку стрелок.</li>
  </ul>
</section>
<section class="help-block">
  <h3>2. Уровень прав 2 — что блоку разрешено</h3>
  <p>Командный блок работает на <b>уровне прав 2</b>. Команды уровня 3 и 4 в блоке молча не срабатывают, кем бы он ни был поставлен:</p>
  <p><code>/op</code> <code>/deop</code> <code>/ban</code> <code>/kick</code> <code>/whitelist</code> <code>/stop</code> <code>/save-all</code> <code>/setidletimeout</code> <code>/transfer</code> <code>/debug</code> <code>/list</code> <code>/tick</code></p>
  <p>Всё остальное — все 63 команды во вкладке «Справочник» — работает. Команды уровня 3 выполняйте в чате с правами оператора или из консоли сервера.</p>
  <ul>
    <li><code>@s</code> внутри блока не указывает на игрока (исполнитель — сам блок). Используйте <code>@p</code> или <code>@a</code>.</li>
    <li>Команды с одной целью (<code>attribute</code>, <code>ride</code>, <code>damage</code>, <code>rotate</code>) требуют <code>execute as @a run …</code>, чтобы затронуть всех — этот сайт делает это за вас.</li>
  </ul>
</section>
<section class="help-block">
  <h3>3. Селекторы целей</h3>
  <table class="help-table">
    <tr><td><code>@s</code></td><td>вы сами (тот, кто выполняет команду)</td></tr>
    <tr><td><code>@p</code></td><td>ближайший игрок</td></tr>
    <tr><td><code>@a</code></td><td>все игроки</td></tr>
    <tr><td><code>@r</code></td><td>случайный игрок</td></tr>
    <tr><td><code>@e</code></td><td>все сущности — мобы, предметы, лодки… <b>и игроки</b>. Всегда добавляйте фильтр!</td></tr>
  </table>
  <p>Фильтры пишутся в квадратных скобках: <code>@e[type=minecraft:zombie]</code>, <code>@e[distance=..10]</code> (в пределах 10 блоков), <code>@a[team=red]</code>, <code>@e[type=minecraft:horse,sort=nearest,limit=1]</code>, <code>@e[type=!minecraft:player]</code> (<b>!</b> значит «не»).</p>
  <p>Список <b>Цель</b> вверху страницы меняет сразу все команды.</p>
</section>
<section class="help-block">
  <h3>4. Цепочки команд</h3>
  <ul>
    <li><b>Импульсный</b> блок с кнопкой, за ним <b>Цепные + Безусловные + Всегда активны</b> по стрелкам: одна команда на блок, всё выполняется за один тик.</li>
    <li>Для постоянных проверок берите <b>Повторяющийся</b> блок («Всегда активен»), например <code>execute as @a at @s if block ~ ~-1 ~ minecraft:gold_block run …</code></li>
    <li><code>gamerule command_block_output false</code> убирает спам от каждого блока в чате.</li>
    <li><code>gamerule send_command_feedback false</code> скрывает и строки «Выдано 1 … игроку …».</li>
    <li>Повторяющийся <code>give</code> выдаёт предметы 20 раз в секунду — используйте тег или счётчик, чтобы сработало один раз.</li>
  </ul>
</section>
<section class="help-block">
  <h3>5. Полезно знать</h3>
  <ul>
    <li><b>Tab</b> дополняет команды, предметы и игровые правила прямо в блоке.</li>
    <li><b>F3</b> показывает координаты. <code>~</code> — «позиция этого блока», <code>~5</code> — на 5 блоков дальше, <code>^ ^ ^3</code> — на 3 блока в сторону взгляда исполнителя.</li>
    <li>В 1.21.11 все игровые правила переименованы (например, <code>keepInventory</code> → <code>keep_inventory</code>). Введите <code>gamerule </code> и нажмите Tab, чтобы увидеть имена для вашего сервера.</li>
    <li><code>minecraft:</code> можно не писать — переключатель <b>Короткие ID</b> убирает его во всех командах на странице.</li>
    <li>С 1.20.5 у предметов компоненты: <code>item[enchantments={…}]</code>. Старый NBT вроде <code>{Enchantments:[…]}</code> больше не работает.</li>
    <li>Fill и clone ограничены 32 768 блоками за команду.</li>
  </ul>
</section>
<section class="help-block">
  <h3>6. Горячие клавиши сайта</h3>
  <ul>
    <li><kbd>/</kbd> — перейти к поиску</li>
    <li><kbd>Esc</kbd> — очистить поиск</li>
    <li>☆ — сохранить команду в <b>Избранное</b> (хранится только в этом браузере)</li>
  </ul>
</section>`,

    de: `
<section class="help-block">
  <h3>1. Befehlsblöcke in 60 Sekunden</h3>
  <ol>
    <li>Besorgen: <code>/give @s minecraft:command_block</code> (Kreativmodus, Operator).</li>
    <li>Block setzen, rechtsklicken, Befehl einfügen. <b>Kein Schrägstrich</b> — die Kopieren-Knöpfe hier lassen ihn schon weg.</li>
    <li>Mit einem <b>Knopf</b> (ein Impuls) oder <b>Hebel</b> (bleibt an) aktivieren — auf dem Block oder daneben.</li>
    <li>Ein Block fasst bis zu <b>32.500 Zeichen</b>, Länge ist hier also nie ein Problem.</li>
  </ol>
  <div class="mode-grid">
    <div class="mode mode-impulse"><b>Impuls</b> (orange)<br>Läuft einmal pro Redstone-Signal.</div>
    <div class="mode mode-chain"><b>Kette</b> (grün)<br>Läuft direkt nach dem Block, dessen Pfeil auf ihn zeigt. Für lange Abläufe.</div>
    <div class="mode mode-repeat"><b>Wiederholen</b> (lila)<br>Läuft jeden Tick (20× pro Sekunde), solange er aktiv ist. Vorsicht mit <code>give</code>!</div>
  </div>
  <ul>
    <li><b>Benötigt Redstone</b>: läuft nur mit Signal. <b>Immer aktiv</b>: läuft ohne Redstone — für Kettenblöcke.</li>
    <li><b>Bedingt</b>: läuft nur, wenn der vorherige Block der Kette erfolgreich war. <b>Unbedingt</b>: läuft immer.</li>
    <li>Ein Kettenblock feuert im selben Tick wie der Impulsblock davor, in Pfeilreihenfolge.</li>
  </ul>
</section>
<section class="help-block">
  <h3>2. Berechtigungsstufe 2 — was ein Block darf</h3>
  <p>Ein Befehlsblock läuft auf <b>Berechtigungsstufe 2</b>. Befehle ab Stufe 3 schlagen im Block still fehl, egal wer ihn gesetzt hat:</p>
  <p><code>/op</code> <code>/deop</code> <code>/ban</code> <code>/kick</code> <code>/whitelist</code> <code>/stop</code> <code>/save-all</code> <code>/setidletimeout</code> <code>/transfer</code> <code>/debug</code> <code>/list</code> <code>/tick</code></p>
  <p>Alles andere — alle 63 Befehle im Referenz-Reiter — funktioniert. Die Stufe-3-Befehle führst du stattdessen im Chat als Operator oder über die Serverkonsole aus.</p>
  <ul>
    <li><code>@s</code> zeigt im Block auf keinen Spieler (der Block ist der Ausführende). Nimm <code>@p</code> oder <code>@a</code>.</li>
    <li>Befehle mit nur einem Ziel (<code>attribute</code>, <code>ride</code>, <code>damage</code>, <code>rotate</code>) brauchen <code>execute as @a run …</code>, um alle zu treffen — diese Seite macht das automatisch.</li>
  </ul>
</section>
<section class="help-block">
  <h3>3. Zielauswahl</h3>
  <table class="help-table">
    <tr><td><code>@s</code></td><td>du selbst (wer den Befehl ausführt)</td></tr>
    <tr><td><code>@p</code></td><td>der nächste Spieler</td></tr>
    <tr><td><code>@a</code></td><td>alle Spieler</td></tr>
    <tr><td><code>@r</code></td><td>ein zufälliger Spieler</td></tr>
    <tr><td><code>@e</code></td><td>alle Entitäten — Mobs, Items, Boote… <b>und Spieler</b>. Immer filtern!</td></tr>
  </table>
  <p>Filter stehen in eckigen Klammern: <code>@e[type=minecraft:zombie]</code>, <code>@e[distance=..10]</code> (im Umkreis von 10 Blöcken), <code>@a[team=red]</code>, <code>@e[type=minecraft:horse,sort=nearest,limit=1]</code>, <code>@e[type=!minecraft:player]</code> (<b>!</b> heißt „nicht“).</p>
  <p>Die Auswahl <b>Ziel</b> oben auf der Seite ändert alle Befehle auf einmal.</p>
</section>
<section class="help-block">
  <h3>4. Befehle verketten</h3>
  <ul>
    <li><b>Impuls</b>-Block mit Knopf, dahinter <b>Ketten- + Unbedingt- + Immer-aktiv</b>-Blöcke den Pfeilen nach: ein Befehl pro Block, alle in einem Tick.</li>
    <li>Für Dauerprüfungen lieber ein <b>Wiederholungs</b>-Block (Immer aktiv), z. B. <code>execute as @a at @s if block ~ ~-1 ~ minecraft:gold_block run …</code></li>
    <li><code>gamerule command_block_output false</code> stoppt den Chat-Spam jedes Blocks.</li>
    <li><code>gamerule send_command_feedback false</code> blendet auch die „… gegeben“-Zeilen aus.</li>
    <li>Ein wiederholtes <code>give</code> verteilt Items 20-mal pro Sekunde — nutze einen Tag oder ein Scoreboard, damit es nur einmal auslöst.</li>
  </ul>
</section>
<section class="help-block">
  <h3>5. Gut zu wissen</h3>
  <ul>
    <li><b>Tab</b> vervollständigt Befehle, Items und Spielregeln direkt im Block.</li>
    <li><b>F3</b> zeigt deine Koordinaten. <code>~</code> heißt „Position dieses Blocks“, <code>~5</code> = 5 Blöcke weiter, <code>^ ^ ^3</code> = 3 Blöcke in Blickrichtung des Ausführenden.</li>
    <li>1.21.11 hat alle Spielregeln umbenannt (z. B. <code>keepInventory</code> → <code>keep_inventory</code>). Tippe <code>gamerule </code> und drücke Tab, um die gültigen Namen zu sehen.</li>
    <li><code>minecraft:</code> kann weggelassen werden — der Schalter <b>Kurze IDs</b> tut das für alle Befehle auf dieser Seite.</li>
    <li>Seit 1.20.5 nutzen Items Komponenten: <code>item[enchantments={…}]</code>. Altes NBT wie <code>{Enchantments:[…]}</code> funktioniert nicht mehr.</li>
    <li>Fill und Clone sind auf 32.768 Blöcke pro Befehl begrenzt.</li>
  </ul>
</section>
<section class="help-block">
  <h3>6. Tastenkürzel auf dieser Seite</h3>
  <ul>
    <li><kbd>/</kbd> — zur Suche springen</li>
    <li><kbd>Esc</kbd> — Suche leeren</li>
    <li>☆ — Befehl in den <b>Favoriten</b> speichern (nur in diesem Browser)</li>
  </ul>
</section>`,
  };

  /* ------------------------------------------------------------------------
     3. Storage — localStorage is used ONLY for favorites, language and
        the last player selector. Every access is wrapped in try/catch.
     ------------------------------------------------------------------------ */
  const STORE = { fav: "mch.favorites", lang: "mch.lang", target: "mch.target" };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode etc. */ }
  }

  function detectLang() {
    const saved = load(STORE.lang, null);
    if (saved && UI[saved]) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return UI[nav] ? nav : "en";
  }

  /* ------------------------------------------------------------------------
     4. App state (only the three items above are persisted)
     ------------------------------------------------------------------------ */
  const savedTarget = load(STORE.target, null);
  const state = {
    lang: detectLang(),
    target: savedTarget && typeof savedTarget.mode === "string" ? savedTarget : { mode: "@p", name: "" },
    favs: new Set(load(STORE.fav, [])),
    view: "all",          // "all" | "fav" | category id | "generator" | "help"
    query: "",
    shortIds: false,
    toolEnch: "fortune",  // "fortune" | "silk"
    equipArmor: false,
    cardOpts: {},         // { cardId: { key: value } }
    panels: {},           // open/closed state of armor/tool boxes
    kit: { preset: null, totem: false },
  };

  /* Fast lookups */
  const KIT_BY_ID = Object.fromEntries(KIT_ITEMS.map((k) => [k.id, k]));
  const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  /* The command reference becomes normal cards, so search and favorites work on it */
  const REF_CARDS = REFERENCE.map((r) => ({
    id: "ref-" + r.cmd,
    cat: "reference",
    ref: true,
    lvl: r.lvl,
    alias: r.alias,
    single: r.single,
    title: T("/" + r.cmd, "/" + r.cmd, "/" + r.cmd),
    desc: r.desc,
    cmds: r.ex,
  }));
  REF_CARDS.push({
    id: "ref-not-available",
    cat: "reference",
    notInBlocks: true,
    title: T(
      "These commands do NOT work in a command block",
      "Эти команды НЕ работают в командном блоке",
      "Diese Befehle funktionieren NICHT im Befehlsblock"
    ),
    desc: T(
      "A command block runs at permission level 2. Everything below needs level 3 or 4, so it fails silently inside a block — run it in chat as an operator or from the server console.",
      "Командный блок работает на уровне прав 2. Всё перечисленное требует уровня 3 или 4, поэтому в блоке просто не срабатывает — выполняйте в чате с правами оператора или из консоли сервера.",
      "Ein Befehlsblock läuft auf Berechtigungsstufe 2. Alles hier braucht Stufe 3 oder 4 und schlägt im Block still fehl — führe es im Chat als Operator oder über die Serverkonsole aus."
    ),
    cmds: [],
  });

  const ALL_CARDS = COMMANDS.concat(REF_CARDS);

  /* ------------------------------------------------------------------------
     5. Small helpers
     ------------------------------------------------------------------------ */
  /** UI string with {placeholders} */
  function t(key, vars) {
    let s = (UI[state.lang] && UI[state.lang][key]) ?? UI.en[key] ?? key;
    if (vars && typeof s === "string") {
      s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    }
    return s;
  }

  /** Localised value from a T() object (or a plain string) */
  function L(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[state.lang] || v.en || "";
  }

  /** "#minecraft:smooth_stone" → "Smooth Stone" */
  function pretty(id) {
    return String(id)
      .replace(/^#?minecraft:/, "")
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  }

  /**
   * Tiny DOM builder: h("div", { class: "x", onclick: fn }, child, "text", ...)
   * Attributes starting with "on" become event listeners, `html` sets innerHTML.
   */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (k === "html") el.innerHTML = v;
        else if (k === "class") el.className = v;
        else if (k in el && typeof v !== "string") el[k] = v;
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  const $ = (sel, root = document) => root.querySelector(sel);

  /* ------------------------------------------------------------------------
     6. Command resolution
     ------------------------------------------------------------------------ */
  const NAME_RE = /^[A-Za-z0-9_]{3,16}$/;

  function customName() {
    return state.target.mode === "custom" ? (state.target.name || "").trim() : "";
  }
  /** The global target: @s / @p / @a / @r or a player name */
  function targetSel() {
    return state.target.mode === "custom" ? customName() || "PlayerName" : state.target.mode;
  }
  /** Name used by {NAME}: the custom name, otherwise the literal PlayerName */
  function playerName() {
    return customName() || "PlayerName";
  }

  /** Applies the global "Short IDs" option */
  function finalize(cmd) {
    return state.shortIds ? cmd.replace(/minecraft:/g, "") : cmd;
  }

  /**
   * Turns a template into a real command.
   * @param {string} tpl     template with {T}, {NAME}, {TOOL}, {key}
   * @param {object} opts    values for card dropdowns
   * @param {boolean} single command accepts only one target
   */
  function resolve(tpl, opts, single) {
    let target = targetSel();
    let wrap = false;
    if (single && target === "@a" && tpl.includes("{T}")) {
      target = "@s";
      wrap = true;
    }
    let s = tpl
      .replace(/\{T\}/g, target)
      .replace(/\{NAME\}/g, playerName())
      .replace(/\{TOOL\}/g, TOOL_ENCH[state.toolEnch]);
    if (opts) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in opts ? opts[k] : m));
    if (wrap) s = "execute as @a run " + s;
    return finalize(s);
  }

  /** Normalised dropdown values: [[value, label], ...] */
  function optValues(o) {
    const list = o.values === "EFFECTS" ? EFFECTS : o.values;
    return list.map((x) => (Array.isArray(x) ? [x[0], x[1]] : [x, pretty(x)]));
  }

  /** Current dropdown values of a card (first value is the default) */
  function cardOptValues(card) {
    if (!card.opts) return null;
    const saved = state.cardOpts[card.id] || {};
    const out = {};
    for (const o of card.opts) {
      const vals = optValues(o);
      out[o.key] = saved[o.key] !== undefined ? saved[o.key] : vals[0][0];
    }
    return out;
  }

  /* Kit helpers ----------------------------------------------------------- */
  /** "minecraft:item[enchantments={...},potion_contents={...}]" */
  function itemWithComponents(k) {
    const comps = [];
    if (k.ench) comps.push(`enchantments={${k.ench}}`);
    for (const [name, val] of Object.entries(k.comps || {})) comps.push(`${name}=${val}`);
    return `minecraft:${k.item}` + (comps.length ? `[${comps.join(",")}]` : "");
  }

  function kitAmount(k, n) {
    return n !== undefined ? n : k.n || 1;
  }

  /** Command templates for a list of { k, n } kit entries */
  function kitTemplates(entries, opt = {}) {
    const out = [];
    for (const { k, n } of entries) {
      if (opt.equip && k.slot) out.push(`item replace entity {T} ${k.slot} with ${itemWithComponents(k)}`);
      else out.push(`give {T} ${itemWithComponents(k)}` + (n > 1 ? ` ${n}` : ""));
    }
    if (opt.totem) out.push("item replace entity {T} weapon.offhand with minecraft:totem_of_undying");
    for (const x of opt.extra || []) out.push(x);
    return out;
  }

  /** Item stack NBT for chests: id:"...",count:N,components:{...} */
  function itemNbt(k, count) {
    const comps = [];
    if (k.ench) comps.push(`"minecraft:enchantments":{${k.ench}}`);
    for (const [name, val] of Object.entries(k.comps || {})) comps.push(`"minecraft:${name}":${val}`);
    return `id:"minecraft:${k.item}",count:${count}` + (comps.length ? `,components:{${comps.join(",")}}` : "");
  }

  function maxStack(k) {
    return k.max || (k.ench ? 1 : 64);
  }

  /** Number of inventory slots the entries need */
  function kitSlots(entries, opt = {}) {
    let slots = 0;
    for (const { k, n } of entries) {
      if (opt.equip && k.slot) continue;
      slots += Math.ceil(n / maxStack(k));
    }
    return slots;
  }

  /** setblock commands placing chest(s) with the kit (27 slots each) */
  function chestTemplates(entries) {
    const stacks = [];
    for (const { k, n } of entries) {
      let left = n;
      while (left > 0) {
        const c = Math.min(left, maxStack(k));
        stacks.push(itemNbt(k, c));
        left -= c;
      }
    }
    const out = [];
    for (let i = 0; i < stacks.length; i += 27) {
      const items = stacks.slice(i, i + 27).map((s, j) => `{Slot:${j}b,${s}}`).join(",");
      out.push(`setblock ~${out.length + 1} ~ ~ minecraft:chest{Items:[${items}]}`);
    }
    return out;
  }

  /** "gapples*12" → { k, n } */
  function parseKitEntry(str) {
    const [id, count] = str.split("*");
    const k = KIT_BY_ID[id];
    return k ? { k, n: count ? Number(count) : kitAmount(k) } : null;
  }

  /* ------------------------------------------------------------------------
     7. Syntax highlighting (command word, selectors, placeholders, namespace)
     ------------------------------------------------------------------------ */
  const TOKEN_RE = /(@[aeprsn](?:\[[^\]]*\])?)|(minecraft:)|(\bPlayerName\b)|((?:^|(?<=\s))[xyz][123]?(?=\s|$))/g;

  function highlight(cmd) {
    const sp = cmd.indexOf(" ");
    const head = sp < 0 ? cmd : cmd.slice(0, sp);
    const rest = sp < 0 ? "" : cmd.slice(sp);
    let out = `<span class="tk-cmd">${esc(head)}</span>`;
    let last = 0;
    rest.replace(TOKEN_RE, (m, sel, ns, name, coord, offset) => {
      out += esc(rest.slice(last, offset));
      const cls = sel ? "tk-sel" : ns ? "tk-ns" : "tk-ph";
      out += `<span class="${cls}">${esc(m)}</span>`;
      last = offset + m.length;
      return m;
    });
    return out + esc(rest.slice(last));
  }

  /* ------------------------------------------------------------------------
     8. Clipboard
     ------------------------------------------------------------------------ */
  function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  async function copyText(text, btn, selectEl) {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) ok = legacyCopy(text);
    if (!ok && selectEl) {
      // Last resort: select the text so the user can press Ctrl+C
      const range = document.createRange();
      range.selectNodeContents(selectEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    btn.textContent = ok ? t("copied") : t("copyFail");
    btn.classList.toggle("is-copied", ok);
    btn.classList.toggle("is-failed", !ok);
    clearTimeout(btn._timer);
    btn._timer = setTimeout(() => {
      btn.textContent = btn.dataset.label;
      btn.classList.remove("is-copied", "is-failed");
    }, 1500);
  }

  function copyButton(labelKey, getText, getSelectEl, extraClass) {
    const btn = h("button", { type: "button", class: "btn btn-copy" + (extraClass ? " " + extraClass : "") }, t(labelKey));
    btn.dataset.label = t(labelKey);
    btn.addEventListener("click", () => copyText(getText(), btn, getSelectEl && getSelectEl()));
    return btn;
  }

  /* ------------------------------------------------------------------------
     9. Output box — shows command lines with Copy buttons and updates live
        when the target / Short IDs change. getLines() → [{ text, label }]
     ------------------------------------------------------------------------ */
  let live = [];                 // refresh functions of the current view
  const MAX_BLOCK = 32500;       // character limit of a command block

  function refreshLive() {
    for (const fn of live) fn();
  }

  function createOutput(getLines, opt = {}) {
    const box = h("div", { class: "output" + (opt.compact ? " output-compact" : "") });
    const list = h("div", { class: "output-lines" });
    box.append(list);
    let current = [];
    let allBtn = null;

    function buildRow(line) {
      const code = h("code", { class: "cmd-code" });
      const warn = h("div", { class: "len-warn", hidden: true });
      const row = h("div", { class: "cmd-row" },
        line.label ? h("div", { class: "cmd-label" }, line.label) : null,
        h("div", { class: "cmd-line" },
          code,
          copyButton("copy", () => row._text, () => code)
        ),
        warn
      );
      row._code = code;
      row._warn = warn;
      return row;
    }

    function setRow(row, line) {
      row._text = line.text;
      row._code.innerHTML = highlight(line.text);
      const tooLong = line.text.length > MAX_BLOCK && !opt.noLengthWarn;
      row._warn.hidden = !tooLong;
      if (tooLong) row._warn.textContent = "⚠ " + t("tooLong", { n: line.text.length });
    }

    function refresh() {
      const lines = getLines();
      const sameShape = lines.length === current.length &&
        lines.every((l, i) => (l.label || "") === (current[i].label || ""));
      if (!sameShape) {
        list.replaceChildren(...lines.map(buildRow));
      }
      lines.forEach((l, i) => setRow(list.children[i], l));
      current = lines;
      if (opt.copyAll !== false && lines.length > 1) {
        if (!allBtn) {
          allBtn = h("div", { class: "output-actions" },
            copyButton("copyAll", () => current.map((l) => l.text).join("\n"), () => list, "btn-copy-all"));
          box.append(allBtn);
        }
        allBtn.hidden = false;
      } else if (allBtn) {
        allBtn.hidden = true;
      }
      box.hidden = lines.length === 0;
    }

    refresh();
    live.push(refresh);
    box.refresh = refresh;
    return box;
  }

  /* ------------------------------------------------------------------------
     10. Command cards
     ------------------------------------------------------------------------ */
  function cardLines(card) {
    const opts = cardOptValues(card);
    return card.cmds.map((c) => {
      const tpl = typeof c === "string" ? c : c.c;
      return { text: resolve(tpl, opts, card.single), label: typeof c === "string" ? "" : L(c.label) };
    });
  }

  function noteBox(kind, text) {
    return h("div", { class: "callout callout-" + kind },
      h("span", { class: "callout-icon", "aria-hidden": "true" }, kind === "warn" ? "⚠" : "ℹ"),
      h("span", null, h("b", null, t(kind === "warn" ? "warning" : "note") + ": "), text));
  }

  function starButton(card) {
    const on = state.favs.has(card.id);
    const btn = h("button", {
      type: "button",
      class: "btn-star" + (on ? " is-on" : ""),
      "aria-pressed": String(on),
      title: t(on ? "favRemove" : "favAdd"),
      "aria-label": t(on ? "favRemove" : "favAdd"),
    }, on ? "★" : "☆");
    btn.addEventListener("click", () => toggleFav(card.id, btn));
    return btn;
  }

  function toggleFav(id, btn) {
    if (state.favs.has(id)) state.favs.delete(id);
    else state.favs.add(id);
    save(STORE.fav, [...state.favs]);
    const on = state.favs.has(id);
    btn.classList.toggle("is-on", on);
    btn.textContent = on ? "★" : "☆";
    btn.setAttribute("aria-pressed", String(on));
    btn.title = t(on ? "favRemove" : "favAdd");
    btn.setAttribute("aria-label", btn.title);
    updateFavCount();
    if (state.view === "fav") renderView();
  }

  function renderCard(card) {
    const el = h("article", {
      class: "card" + (card.warn ? " card-danger" : "") + (card.ref ? " ref-card" : ""),
      id: "card-" + card.id,
    });

    el.append(h("header", { class: "card-head" },
      h("h3", { class: "card-title" + (card.ref ? " ref-name" : "") }, L(card.title)),
      card.alias ? h("span", { class: "badge badge-alias", title: t("aliasTip") }, "/" + card.alias) : null,
      card.lvl !== undefined ? h("span", { class: "badge badge-lvl", title: t("lvlTip") }, "lvl " + card.lvl) : null,
      starButton(card)
    ));
    if (card.desc) el.append(h("p", { class: "card-desc" }, L(card.desc)));
    if (card.notInBlocks) {
      el.append(h("div", { class: "no-cb-list" }, NOT_IN_BLOCKS.map((c) => h("code", null, "/" + c))));
    }

    let output = null;
    if (card.opts) {
      const row = h("div", { class: "card-opts" });
      const current = cardOptValues(card);
      for (const o of card.opts) {
        const sel = h("select", { class: "input", "aria-label": L(o.label) },
          optValues(o).map(([v, lab]) => h("option", { value: v, selected: v === current[o.key] }, L(lab))));
        sel.addEventListener("change", () => {
          state.cardOpts[card.id] = { ...(state.cardOpts[card.id] || {}), [o.key]: sel.value };
          if (output) output.refresh();
        });
        row.append(h("label", { class: "field field-inline" }, h("span", { class: "field-label" }, L(o.label)), sel));
      }
      el.append(row);
    }
    if (card.cmds.length) {
      output = createOutput(() => cardLines(card));
      el.append(output);
    }
    if (card.note) el.append(noteBox("note", L(card.note)));
    if (card.warn) el.append(noteBox("warn", L(card.warn)));
    return el;
  }

  /* ------------------------------------------------------------------------
     11. Category panels (armor set, tools toggle, PvP kits)
     ------------------------------------------------------------------------ */
  /** Checkbox bound to a shared option; all chips with the same key stay in sync */
  function toggleChip(labelKey, checked, onChange) {
    const input = h("input", { type: "checkbox", checked, "data-sync": labelKey });
    input.addEventListener("change", () => {
      document.querySelectorAll(`input[data-sync="${labelKey}"]`).forEach((x) => { x.checked = input.checked; });
      onChange(input.checked);
    });
    return h("label", { class: "check" }, input, h("span", null, t(labelKey)));
  }

  /** A toggle button that shows/hides a box of commands */
  function setBox(key, titleKey, getLines, extras) {
    const wrap = h("div", { class: "set-box-wrap" });
    const btn = h("button", { type: "button", class: "btn btn-primary", "aria-expanded": String(!!state.panels[key]) }, t(titleKey));
    const box = h("div", { class: "set-box", hidden: !state.panels[key] },
      h("p", { class: "muted small" }, t("chatOneByOne")),
      createOutput(getLines),
      extras || null
    );
    btn.addEventListener("click", () => {
      state.panels[key] = !state.panels[key];
      box.hidden = !state.panels[key];
      btn.setAttribute("aria-expanded", String(state.panels[key]));
    });
    wrap.append(btn, box);
    return wrap;
  }

  function armorPanel() {
    const entries = ARMOR_SET.map((id) => ({ k: KIT_BY_ID[id], n: 1 }));
    return h("div", { class: "panel" },
      h("div", { class: "panel-row" },
        toggleChip("equip", state.equipArmor, (v) => { state.equipArmor = v; refreshLive(); })),
      setBox("armor", "armorSet", () =>
        kitTemplates(entries, { equip: state.equipArmor }).map((tpl) => ({ text: resolve(tpl) })))
    );
  }

  function toolsPanel() {
    const seg = h("div", { class: "segmented", role: "group", "aria-label": t("toolEnch") });
    for (const [val, key] of [["fortune", "fortune"], ["silk", "silk"]]) {
      const b = h("button", { type: "button", class: "seg" + (state.toolEnch === val ? " is-on" : ""), "aria-pressed": String(state.toolEnch === val) }, t(key));
      b.addEventListener("click", () => {
        state.toolEnch = val;
        seg.querySelectorAll(".seg").forEach((x) => {
          const on = x === b;
          x.classList.toggle("is-on", on);
          x.setAttribute("aria-pressed", String(on));
        });
        refreshLive();
      });
      seg.append(b);
    }
    const toolIds = ["tl-pickaxe", "tl-axe", "tl-shovel", "tl-hoe"];
    const tools = ALL_CARDS.filter((c) => toolIds.includes(c.id));
    return h("div", { class: "panel" },
      h("div", { class: "panel-row" }, h("span", { class: "field-label" }, t("toolEnch")), seg),
      setBox("tools", "toolsSet", () => tools.map((c) => ({ text: resolve(c.cmds[0]) })))
    );
  }

  /** Kit box: full PvP kit + presets, chest version and command block steps */
  function pvpPanel() {
    const panel = h("div", { class: "panel panel-kit" });
    const presetSel = h("select", { class: "input", "aria-label": t("preset") },
      h("option", { value: "" }, t("choosePreset")),
      KIT_PRESETS.filter((p) => p.id !== "full").map((p) =>
        h("option", { value: p.id, selected: state.kit.preset === p.id }, L(p.name))));
    const fullBtn = h("button", { type: "button", class: "btn btn-primary btn-big" },
      h("span", { class: "ico", "aria-hidden": "true" }, "⚔️"), t("fullKit"));
    const box = h("div", { class: "kit-box" });

    function show(id) {
      state.kit.preset = id;
      presetSel.value = id && id !== "full" ? id : "";
      fullBtn.classList.toggle("is-on", id === "full");
      renderBox();
    }
    fullBtn.addEventListener("click", () => show(state.kit.preset === "full" ? null : "full"));
    presetSel.addEventListener("change", () => show(presetSel.value || null));

    function renderBox() {
      // Drop the old outputs from the live list before rebuilding the box
      box.querySelectorAll(".output").forEach((o) => { live = live.filter((f) => f !== o.refresh); });
      box.replaceChildren();
      const preset = KIT_PRESETS.find((p) => p.id === state.kit.preset);
      box.hidden = !preset;
      if (!preset) return;
      const entries = preset.items.map(parseKitEntry).filter(Boolean);
      const opt = () => ({ equip: state.equipArmor, totem: state.kit.totem, extra: preset.extra });
      const stats = h("p", { class: "kit-stats" });
      const updateStats = () => {
        const cmds = kitTemplates(entries, opt()).length;
        const slots = kitSlots(entries, opt());
        stats.textContent = t("stats", { c: cmds, s: slots });
        stats.classList.toggle("is-bad", slots > 36);
      };
      const out = createOutput(() => {
        updateStats();
        return kitTemplates(entries, opt()).map((tpl) => ({ text: resolve(tpl) }));
      });
      const chest = createOutput(() => chestTemplates(entries).map((tpl) => ({ text: resolve(tpl) })), { noLengthWarn: true });

      // Note: append() turns null into the string "null" — filter children first
      box.append(...[
        h("div", { class: "kit-head" },
          h("h4", null, L(preset.name)),
          h("button", { type: "button", class: "btn btn-ghost", onclick: () => show(null) }, "✕ " + t("close"))),
        preset.note ? noteBox("note", L(preset.note)) : null,
        h("div", { class: "panel-row" },
          toggleChip("equip", state.equipArmor, (v) => { state.equipArmor = v; refreshLive(); }),
          toggleChip("totemOff", state.kit.totem, (v) => { state.kit.totem = v; refreshLive(); })),
        stats,
        h("p", { class: "muted small" }, t("chatOneByOne")),
        out,
        h("details", { class: "details" },
          h("summary", null, "📦 " + t("kitChest")),
          h("p", { class: "muted small" }, t("kitChestInfo")),
          chest),
        h("details", { class: "details" },
          h("summary", null, "🧱 " + t("kitChain")),
          h("ol", { class: "steps" }, t("kitChainSteps").map((s) => h("li", { html: s })))),
        h("div", { class: "panel-row" },
          h("button", {
            type: "button", class: "btn",
            onclick: () => {
              gen.kit.sel = Object.fromEntries(entries.map(({ k, n }) => [k.id, n]));
              gen.kit.extra = preset.extra || [];
              gen.active = "kit";
              location.hash = "#generator";
            },
          }, "🛠 " + t("editInBuilder"))),
      ].filter(Boolean));
    }

    panel.append(
      h("div", { class: "panel-row" },
        fullBtn,
        h("label", { class: "field field-inline" }, h("span", { class: "field-label" }, t("preset")), presetSel)),
      box
    );
    renderBox();
    return panel;
  }

  const PANELS = { armor: armorPanel, tools: toolsPanel, kits: pvpPanel };

  /* ------------------------------------------------------------------------
     12. List view (All / Favorites / one category) with search
     ------------------------------------------------------------------------ */
  function haystack(card) {
    const parts = [L(card.title), L(card.desc), card.title.en, card.desc ? card.desc.en : ""];
    for (const c of card.cmds) {
      if (typeof c === "string") parts.push(c);
      else parts.push(c.c, L(c.label));
    }
    if (card.opts) for (const o of card.opts) parts.push(...optValues(o).map(([v, l]) => v + " " + L(l)));
    return parts.join(" ").toLowerCase();
  }

  function matches(card, words) {
    const hay = haystack(card);
    return words.every((w) => hay.includes(w));
  }

  function renderList(view) {
    const words = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    const searching = words.length > 0;
    const isFav = state.view === "fav";
    const cats = state.view === "all" || isFav ? CATEGORIES : CATEGORIES.filter((c) => c.id === state.view);
    let total = 0;
    const sections = [];

    for (const cat of cats) {
      let cards = ALL_CARDS.filter((c) => c.cat === cat.id);
      if (isFav) cards = cards.filter((c) => state.favs.has(c.id));
      if (searching) cards = cards.filter((c) => matches(c, words));
      const panel = !searching && !isFav && PANELS[cat.id];
      if (!cards.length && !panel) continue;
      total += cards.length;

      const sec = h("section", { class: "cat-section", id: "sec-" + cat.id });
      sec.append(h("h2", { class: "cat-title" }, h("span", { class: "cat-icon", "aria-hidden": "true" }, cat.icon), L(cat.name)));
      if (!searching && !isFav && CATEGORY_INTRO[cat.id]) sec.append(h("p", { class: "cat-intro" }, L(CATEGORY_INTRO[cat.id])));
      if (panel) sec.append(panel());

      let grid = null;
      let lastGroup;
      for (const card of cards) {
        if (!grid || card.group !== lastGroup) {
          if (card.group && GROUPS[card.group]) sec.append(h("h3", { class: "group-title" }, L(GROUPS[card.group])));
          grid = h("div", { class: "grid" });
          sec.append(grid);
          lastGroup = card.group;
        }
        grid.append(renderCard(card));
      }
      sections.push(sec);
    }

    if (searching) {
      const bar = h("div", { class: "results-bar" },
        h("span", null, t("found", { n: total }) +
          (state.view !== "all" && !isFav ? " " + t("foundIn", { cat: L(CAT_BY_ID[state.view].name) }) : "")),
        h("button", { type: "button", class: "btn btn-ghost", onclick: clearSearch }, "✕ " + t("clearSearch")));
      view.append(bar);
    }

    if (isFav && state.favs.size === 0 && !searching) {
      view.append(h("div", { class: "empty" }, h("div", { class: "empty-icon" }, "☆"), h("p", null, t("favEmpty"))));
      return;
    }

    if (total === 0 && searching) {
      view.append(h("div", { class: "empty" },
        h("div", { class: "empty-icon" }, "🔍"),
        h("p", null, t("noResults", { q: state.query })),
        state.view !== "all" ? h("button", { type: "button", class: "btn btn-primary", onclick: () => go("all") }, t("searchAll")) : null));
      return;
    }
    view.append(...sections);
  }

  /* ------------------------------------------------------------------------
     13. Generators — shared form helpers
     ------------------------------------------------------------------------ */
  const gen = {
    active: "give",
    give: { item: "netherite_sword", filter: "", amount: 1, over: false, ench: {}, removed: [], unbreakable: false, name: "", color: "gold" },
    effect: { eff: "speed", seconds: 60, infinite: true, amp: 1, hide: true },
    fill: { from: "~-5 ~-1 ~-5", to: "~5 ~-1 ~5", block: "stone", mode: "replace", filter: "" },
    potion: { id: "strong_healing", form: "splash_potion", amount: 3 },
    kit: { sel: null, equip: false, totem: false, extra: [] },
    summon: { mob: "zombie", pos: "~ ~ ~", noai: false, silent: false, invul: false, persist: true, glow: false, baby: false, name: "", showName: true },
    title: { type: "title", text: "FIGHT!", color: "red", bold: true, italic: false },
    attr: { id: "max_health", action: "set", value: "40" },
    border: { x: "~", z: "~", start: 200, end: 20, time: 300, dmg: 2, warn: 10 },
    rule: { id: "keep_inventory", value: "true" },
  };

  function field(label, control, hint) {
    return h("label", { class: "field" },
      h("span", { class: "field-label" }, label),
      control,
      hint ? h("span", { class: "field-hint" }, hint) : null);
  }
  function selectEl(options, value, onChange, ariaLabel) {
    const s = h("select", { class: "input", "aria-label": ariaLabel || null },
      options.map(([v, l]) => h("option", { value: v, selected: String(v) === String(value) }, l)));
    s.addEventListener("change", () => onChange(s.value));
    return s;
  }
  function numberEl(value, min, max, step, onChange) {
    const i = h("input", { type: "number", class: "input", value: String(value), min: String(min), max: String(max), step: String(step || 1), inputmode: "decimal" });
    i.addEventListener("input", () => onChange(i.value));
    return i;
  }
  function textEl(value, placeholder, onChange) {
    const i = h("input", { type: "text", class: "input", value, placeholder: placeholder || "", spellcheck: "false", autocomplete: "off" });
    i.addEventListener("input", () => onChange(i.value));
    return i;
  }
  function checkEl(label, checked, onChange) {
    const input = h("input", { type: "checkbox", checked });
    input.addEventListener("change", () => onChange(input.checked));
    return h("label", { class: "check" }, input, h("span", null, label));
  }
  function clampNum(v, min, max, fallback) {
    const n = Number(v);
    if (!isFinite(n) || String(v).trim() === "") return fallback;
    return Math.min(max, Math.max(min, n));
  }
  function colorOptions() {
    return TEXT_COLORS.map(([id]) => [id, pretty(id)]);
  }

  /* ------------------------------------------------------------------------
     14. Give generator
     ------------------------------------------------------------------------ */
  const ITEM_TYPE = Object.fromEntries(GIVE_ITEMS);

  function genGive() {
    const g = gen.give;
    const body = h("div", { class: "gen-body" });

    // Searchable item list
    const search = h("input", { type: "search", class: "input", placeholder: t("searchItems"), value: g.filter, "aria-label": t("searchItems") });
    const list = h("select", { class: "input item-list", size: 8, "aria-label": t("item") });
    function fillList() {
      const q = g.filter.trim().toLowerCase();
      const items = GIVE_ITEMS.filter(([id]) => !q || id.includes(q.replace(/\s+/g, "_")) || pretty(id).toLowerCase().includes(q));
      list.replaceChildren(...items.map(([id]) => h("option", { value: id, selected: id === g.item }, pretty(id))));
    }
    search.addEventListener("input", () => { g.filter = search.value; fillList(); });
    list.addEventListener("change", () => {
      g.item = list.value;
      g.removed = [];
      enforceRules();
      renderEnchants();
      out.refresh();
    });
    fillList();

    const enchBox = h("div", { class: "ench-list" });
    const conflictNote = h("p", { class: "field-hint conflict-note", hidden: true });
    const bookNote = h("p", { class: "field-hint" });

    /** Drop enchantments the item can't have, clamp levels and remove conflicts */
    function enforceRules() {
      const allowed = ITEM_ENCHANTS[ITEM_TYPE[g.item]];
      for (const id of Object.keys(g.ench)) {
        if (!allowed.includes(id)) delete g.ench[id];
        else if (!g.over) g.ench[id] = Math.min(g.ench[id], ENCHANTMENTS[id].max);
      }
      if (!g.over) {
        const kept = [];
        for (const id of Object.keys(g.ench)) {
          const clash = kept.some((k) => ENCH_EXCLUSIVE.some((grp) => grp.includes(k) && grp.includes(id)));
          if (clash) delete g.ench[id];
          else kept.push(id);
        }
      }
    }

    function renderEnchants() {
      const type = ITEM_TYPE[g.item];
      const ids = ITEM_ENCHANTS[type];
      bookNote.textContent = type === "book" ? t("bookNote") : "";
      bookNote.hidden = type !== "book";
      conflictNote.hidden = !g.removed.length;
      conflictNote.textContent = g.removed.length ? t("conflictRemoved", { list: g.removed.join(", ") }) : "";
      if (!ids.length) {
        enchBox.replaceChildren(h("p", { class: "muted" }, t("noEnchants")));
        return;
      }
      enchBox.replaceChildren(...ids.map((id) => {
        const e = ENCHANTMENTS[id];
        const max = g.over ? 255 : e.max;
        const on = id in g.ench;
        const lvl = on ? g.ench[id] : e.max;
        const cb = h("input", { type: "checkbox", checked: on, id: "ench-" + id });
        const range = h("input", { type: "range", min: "1", max: String(max), value: String(lvl), disabled: !on || max === 1, "aria-label": L(e.name) });
        const num = h("input", { type: "number", class: "input input-num", min: "1", max: String(max), value: String(lvl), disabled: !on, "aria-label": L(e.name) });
        const setLevel = (v) => {
          const n = Math.round(clampNum(v, 1, max, 1));
          g.ench[id] = n;
          range.value = String(n);
          if (document.activeElement !== num) num.value = String(n);
          out.refresh();
        };
        cb.addEventListener("change", () => {
          g.removed = [];
          if (cb.checked) {
            if (!g.over) {
              for (const grp of ENCH_EXCLUSIVE) {
                if (!grp.includes(id)) continue;
                for (const other of grp) {
                  if (other !== id && other in g.ench) {
                    delete g.ench[other];
                    g.removed.push(L(ENCHANTMENTS[other].name));
                  }
                }
              }
            }
            g.ench[id] = Math.min(Number(num.value) || e.max, max);
          } else {
            delete g.ench[id];
          }
          renderEnchants();
          out.refresh();
        });
        range.addEventListener("input", () => setLevel(range.value));
        num.addEventListener("input", () => { if (num.value !== "") setLevel(num.value); });
        num.addEventListener("blur", () => { num.value = String(g.ench[id] || lvl); });
        return h("div", { class: "ench-row" + (on ? " is-on" : "") },
          h("label", { class: "ench-name", for: "ench-" + id }, cb,
            h("span", null, L(e.name), h("small", null, `${id} · max ${e.max}`))),
          range, num);
      }));
    }

    const lines = () => {
      const type = ITEM_TYPE[g.item];
      const comps = [];
      const ench = Object.entries(g.ench);
      if (ench.length) {
        const key = type === "book" ? "stored_enchantments" : "enchantments";
        comps.push(`${key}={${ench.map(([id, l]) => `"minecraft:${id}":${l}`).join(",")}}`);
      }
      if (g.unbreakable && type !== "book") comps.push("unbreakable={}");
      if (g.name.trim()) comps.push(`custom_name={"text":${JSON.stringify(g.name.trim())},"color":"${g.color}","italic":false}`);
      const amount = Math.round(clampNum(g.amount, 1, 100, 1));
      const cmd = `give {T} minecraft:${g.item}` + (comps.length ? `[${comps.join(",")}]` : "") + (amount > 1 ? ` ${amount}` : "");
      return [{ text: resolve(cmd) }];
    };
    const out = createOutput(lines);

    renderEnchants();
    body.append(
      h("div", { class: "gen-cols" },
        h("div", { class: "gen-col" },
          field(t("item"), h("div", { class: "stack" }, search, list)),
          field(t("amount"), numberEl(g.amount, 1, 100, 1, (v) => { g.amount = v; out.refresh(); })),
          checkEl(t("unbreakable"), g.unbreakable, (v) => { g.unbreakable = v; out.refresh(); }),
          field(t("customName"), textEl(g.name, "Excalibur", (v) => { g.name = v; out.refresh(); })),
          field(t("color"), selectEl(colorOptions(), g.color, (v) => { g.color = v; out.refresh(); }))
        ),
        h("div", { class: "gen-col" },
          h("div", { class: "field-label" }, t("enchantments")),
          checkEl(t("overMax"), g.over, (v) => { g.over = v; g.removed = []; enforceRules(); renderEnchants(); out.refresh(); }),
          bookNote, conflictNote, enchBox
        )
      ),
      out
    );
    return body;
  }

  /* ------------------------------------------------------------------------
     15. Effect generator
     ------------------------------------------------------------------------ */
  function genEffect() {
    const g = gen.effect;
    const levelInfo = h("span", { class: "field-hint" });
    const seconds = numberEl(g.seconds, 1, 1000000, 1, (v) => { g.seconds = v; out.refresh(); });
    seconds.disabled = g.infinite;
    const amp = h("input", { type: "range", min: "0", max: "255", value: String(g.amp), "aria-label": t("level") });
    const ampNum = h("input", { type: "number", class: "input input-num", min: "0", max: "255", value: String(g.amp), "aria-label": t("level") });
    const setAmp = (v) => {
      g.amp = Math.round(clampNum(v, 0, 255, 0));
      amp.value = String(g.amp);
      if (document.activeElement !== ampNum) ampNum.value = String(g.amp);
      levelInfo.textContent = t("levelShown", { n: g.amp + 1 });
      out.refresh();
    };
    amp.addEventListener("input", () => setAmp(amp.value));
    ampNum.addEventListener("input", () => { if (ampNum.value !== "") setAmp(ampNum.value); });

    const lines = () => {
      const dur = g.infinite ? "infinite" : Math.round(clampNum(g.seconds, 1, 1000000, 30));
      return [
        { text: resolve(`effect give {T} minecraft:${g.eff} ${dur} ${g.amp} ${g.hide}`) },
        { text: resolve(`effect clear {T} minecraft:${g.eff}`), label: t("clearLine") },
      ];
    };
    const out = createOutput(lines, { copyAll: false });
    levelInfo.textContent = t("levelShown", { n: g.amp + 1 });

    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("effect"), selectEl(EFFECTS.map(([id, n]) => [id, `${L(n)} (${id})`]), g.eff, (v) => { g.eff = v; out.refresh(); })),
        field(t("duration"), h("div", { class: "stack" }, seconds,
          checkEl(t("infinite"), g.infinite, (v) => { g.infinite = v; seconds.disabled = v; out.refresh(); }))),
        field(t("level"), h("div", { class: "range-row" }, amp, ampNum), levelInfo),
        h("div", { class: "field" }, checkEl(t("hideParticles"), g.hide, (v) => { g.hide = v; out.refresh(); }))
      ),
      out
    );
  }

  /* ------------------------------------------------------------------------
     16. Fill generator
     ------------------------------------------------------------------------ */
  function parseCoord(s) {
    if (s.startsWith("~")) {
      const rest = s.slice(1);
      const v = rest === "" ? 0 : Number(rest);
      return isFinite(v) ? { rel: true, v } : null;
    }
    const v = Number(s);
    return s !== "" && isFinite(v) ? { rel: false, v } : null;
  }
  function parseTriple(str) {
    const parts = String(str).trim().split(/\s+/);
    if (parts.length !== 3) return null;
    const c = parts.map(parseCoord);
    return c.every(Boolean) ? c : null;
  }
  const FILL_LIMIT = 32768;

  function genFill() {
    const g = gen.fill;
    const countEl = h("div", { class: "count-box" });
    const modeHint = h("span", { class: "field-hint" });
    const filterField = field(t("filter"),
      selectEl([["", t("none")], ...BLOCKS.map((b) => [b, pretty(b)])], g.filter, (v) => { g.filter = v; out.refresh(); }));

    function updateMeta() {
      modeHint.textContent = t("modeHelp")[g.mode] || "";
      filterField.hidden = g.mode !== "replace";
      const a = parseTriple(g.from);
      const b = parseTriple(g.to);
      countEl.className = "count-box";
      if (!a || !b) {
        countEl.textContent = t("coordHint");
        countEl.classList.add("is-bad");
        return;
      }
      if (a.some((c, i) => c.rel !== b[i].rel)) {
        countEl.textContent = t("blockCountUnknown");
        return;
      }
      const n = a.reduce((acc, c, i) => acc * (Math.abs(Math.floor(c.v) - Math.floor(b[i].v)) + 1), 1);
      countEl.textContent = t("blockCount", { n: n.toLocaleString(state.lang) });
      if (n > FILL_LIMIT) {
        countEl.classList.add("is-bad");
        countEl.append(h("div", null, "⚠ " + t("overLimit")));
      } else {
        countEl.classList.add("is-good");
      }
    }

    const lines = () => {
      updateMeta();
      let cmd = `fill ${g.from.trim()} ${g.to.trim()} minecraft:${g.block}`;
      if (g.mode !== "replace") cmd += ` ${g.mode}`;
      else if (g.filter) cmd += ` replace minecraft:${g.filter}`;
      return [{ text: resolve(cmd) }];
    };
    const out = createOutput(lines);

    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("from"), textEl(g.from, "~-5 ~-1 ~-5", (v) => { g.from = v; out.refresh(); })),
        field(t("to"), textEl(g.to, "~5 ~-1 ~5", (v) => { g.to = v; out.refresh(); })),
        field(t("block"), selectEl(BLOCKS.map((b) => [b, pretty(b)]), g.block, (v) => { g.block = v; out.refresh(); })),
        field(t("mode"), selectEl(FILL_MODES.map((m) => [m, m]), g.mode, (v) => { g.mode = v; out.refresh(); }), modeHint),
        filterField
      ),
      h("p", { class: "field-hint" }, t("coordHint")),
      countEl,
      out
    );
  }

  /* ------------------------------------------------------------------------
     17. Potion generator
     ------------------------------------------------------------------------ */
  function potionList() {
    const out = [];
    for (const [base, name, vars] of POTION_BASES) {
      out.push([base, L(name)]);
      for (const v of vars || []) {
        out.push([`${v}_${base}`, L(name) + (v === "long" ? ` (${t("long")})` : " II")]);
      }
    }
    return out;
  }

  function genPotion() {
    const g = gen.potion;
    const hint = h("p", { class: "field-hint" });
    const lines = () => {
      hint.textContent = ["water", "mundane", "thick", "awkward"].includes(g.id) ? t("noEffectPotion") : "";
      const amount = Math.round(clampNum(g.amount, 1, 100, 1));
      return [{ text: resolve(`give {T} minecraft:${g.form}[potion_contents={potion:"minecraft:${g.id}"}]` + (amount > 1 ? ` ${amount}` : "")) }];
    };
    const out = createOutput(lines);
    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("potion"), selectEl(potionList(), g.id, (v) => { g.id = v; out.refresh(); })),
        field(t("form"), selectEl([
          ["potion", t("fDrink")], ["splash_potion", t("fSplash")],
          ["lingering_potion", t("fLinger")], ["tipped_arrow", t("fArrow")],
        ], g.form, (v) => { g.form = v; out.refresh(); })),
        field(t("amount"), numberEl(g.amount, 1, 100, 1, (v) => { g.amount = v; out.refresh(); }))
      ),
      hint,
      out
    );
  }

  /* ------------------------------------------------------------------------
     18. Kit builder
     ------------------------------------------------------------------------ */
  function presetSelection(id) {
    const p = KIT_PRESETS.find((x) => x.id === id);
    return Object.fromEntries(p.items.map(parseKitEntry).filter(Boolean).map(({ k, n }) => [k.id, n]));
  }

  function genKit() {
    const g = gen.kit;
    if (!g.sel) g.sel = presetSelection("full");
    const body = h("div", { class: "gen-body" });
    const listBox = h("div", { class: "kit-groups" });
    const stats = h("p", { class: "kit-stats" });

    const entries = () => KIT_ITEMS.filter((k) => k.id in g.sel)
      .map((k) => ({ k, n: Math.round(clampNum(g.sel[k.id], 1, 100, kitAmount(k))) }));
    const opt = () => ({ equip: g.equip, totem: g.totem, extra: g.extra });

    function renderItems() {
      listBox.replaceChildren(...KIT_GROUPS.map((grp) => h("fieldset", { class: "kit-group" },
        h("legend", null, L(grp.name)),
        KIT_ITEMS.filter((k) => k.grp === grp.id).map((k) => {
          const on = k.id in g.sel;
          const cb = h("input", { type: "checkbox", checked: on });
          const num = h("input", { type: "number", class: "input input-num", min: "1", max: "100", value: String(on ? g.sel[k.id] : kitAmount(k)), disabled: !on, "aria-label": t("amount") + " — " + L(k.name) });
          cb.addEventListener("change", () => {
            if (cb.checked) g.sel[k.id] = Number(num.value) || kitAmount(k);
            else delete g.sel[k.id];
            num.disabled = !cb.checked;
            row.classList.toggle("is-on", cb.checked);
            refreshAll();
          });
          num.addEventListener("input", () => { if (k.id in g.sel && num.value !== "") { g.sel[k.id] = num.value; refreshAll(); } });
          const row = h("div", { class: "kit-item" + (on ? " is-on" : "") },
            h("label", { class: "check" }, cb, h("span", null, L(k.name))), num);
          return row;
        }))));
    }

    const out = createOutput(() => {
      const e = entries();
      const cmds = kitTemplates(e, opt());
      const slots = kitSlots(e, opt());
      stats.replaceChildren(t("stats", { c: cmds.length, s: slots }));
      stats.classList.toggle("is-bad", slots > 36);
      if (slots > 36) stats.append(h("span", null, " — " + t("tooManySlots")));
      return cmds.map((tpl) => ({ text: resolve(tpl) }));
    });
    const chest = createOutput(() => chestTemplates(entries()).map((tpl) => ({ text: resolve(tpl) })), { noLengthWarn: true });
    function refreshAll() { out.refresh(); chest.refresh(); }

    const presetSel = selectEl([["", t("loadPreset")], ...KIT_PRESETS.map((p) => [p.id, L(p.name)])], "", (v) => {
      if (!v) return;
      g.sel = presetSelection(v);
      g.extra = KIT_PRESETS.find((p) => p.id === v).extra || [];
      presetSel.value = "";
      renderItems();
      refreshAll();
    }, t("loadPreset"));

    renderItems();
    body.append(
      h("div", { class: "panel-row" },
        presetSel,
        h("button", { type: "button", class: "btn", onclick: () => { g.sel = Object.fromEntries(KIT_ITEMS.map((k) => [k.id, kitAmount(k)])); renderItems(); refreshAll(); } }, t("selectAll")),
        h("button", { type: "button", class: "btn", onclick: () => { g.sel = {}; g.extra = []; renderItems(); refreshAll(); } }, t("selectNone")),
        checkEl(t("equip"), g.equip, (v) => { g.equip = v; refreshAll(); }),
        checkEl(t("totemOff"), g.totem, (v) => { g.totem = v; refreshAll(); })
      ),
      listBox,
      stats,
      h("p", { class: "muted small" }, t("chatOneByOne")),
      out,
      h("details", { class: "details" },
        h("summary", null, "📦 " + t("kitChest")),
        h("p", { class: "muted small" }, t("kitChestInfo")),
        chest),
      h("details", { class: "details" },
        h("summary", null, "🧱 " + t("kitChain")),
        h("ol", { class: "steps" }, t("kitChainSteps").map((s) => h("li", { html: s }))))
    );
    return body;
  }

  /* ------------------------------------------------------------------------
     19. Summon generator
     ------------------------------------------------------------------------ */
  function genSummon() {
    const g = gen.summon;
    const babyWrap = h("div", { class: "field" });
    const renderBaby = () => {
      const can = BABY_ISBABY.includes(g.mob) || BABY_AGE.includes(g.mob);
      babyWrap.replaceChildren(can ? checkEl(t("baby"), g.baby, (v) => { g.baby = v; out.refresh(); }) : "");
    };
    const lines = () => {
      const nbt = [];
      if (g.noai) nbt.push("NoAI:1b");
      if (g.silent) nbt.push("Silent:1b");
      if (g.invul) nbt.push("Invulnerable:1b");
      if (g.persist) nbt.push("PersistenceRequired:1b");
      if (g.glow) nbt.push("Glowing:1b");
      if (g.baby && BABY_ISBABY.includes(g.mob)) nbt.push("IsBaby:1b");
      if (g.baby && BABY_AGE.includes(g.mob)) nbt.push("Age:-24000");
      if (g.name.trim()) {
        nbt.push(`CustomName:${JSON.stringify(g.name.trim())}`);
        if (g.showName) nbt.push("CustomNameVisible:1b");
      }
      const pos = g.pos.trim() || "~ ~ ~";
      return [{ text: finalize(`summon minecraft:${g.mob} ${pos}` + (nbt.length ? ` {${nbt.join(",")}}` : "")) }];
    };
    const out = createOutput(lines);
    renderBaby();
    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("mob"), selectEl(SUMMON_MOBS.map((m) => [m, pretty(m)]), g.mob, (v) => { g.mob = v; renderBaby(); out.refresh(); })),
        field(t("position"), textEl(g.pos, "~ ~ ~", (v) => { g.pos = v; out.refresh(); })),
        field(t("customName"), textEl(g.name, "Bob", (v) => { g.name = v; out.refresh(); }))
      ),
      h("div", { class: "check-grid" },
        checkEl(t("noAI"), g.noai, (v) => { g.noai = v; out.refresh(); }),
        checkEl(t("silent"), g.silent, (v) => { g.silent = v; out.refresh(); }),
        checkEl(t("invulnerable"), g.invul, (v) => { g.invul = v; out.refresh(); }),
        checkEl(t("persistent"), g.persist, (v) => { g.persist = v; out.refresh(); }),
        checkEl(t("glowing"), g.glow, (v) => { g.glow = v; out.refresh(); }),
        checkEl(t("showName"), g.showName, (v) => { g.showName = v; out.refresh(); }),
        babyWrap
      ),
      out
    );
  }

  /* ------------------------------------------------------------------------
     20. Title & chat generator
     ------------------------------------------------------------------------ */
  function genTitle() {
    const g = gen.title;
    const preview = h("div", { class: "mc-preview" });
    const updatePreview = () => {
      const hex = (TEXT_COLORS.find(([id]) => id === g.color) || ["", "#fff"])[1];
      preview.className = "mc-preview mc-preview-" + g.type;
      preview.replaceChildren(h("span", {
        style: `color:${hex};font-weight:${g.bold ? 700 : 400};font-style:${g.italic ? "italic" : "normal"}`,
      }, g.text || " "));
    };
    const lines = () => {
      updatePreview();
      const json = `{"text":${JSON.stringify(g.text)},"color":"${g.color}"` +
        (g.bold ? ',"bold":true' : "") + (g.italic ? ',"italic":true' : "") + "}";
      switch (g.type) {
        case "subtitle":
          return [
            { text: resolve(`title {T} subtitle ${json}`) },
            { text: resolve('title {T} title ""'), label: t("subtitleNote") },
          ];
        case "actionbar": return [{ text: resolve(`title {T} actionbar ${json}`) }];
        case "chat": return [{ text: resolve(`tellraw {T} ${json}`) }];
        default: return [{ text: resolve(`title {T} title ${json}`) }];
      }
    };
    const out = createOutput(lines);
    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("titleType"), selectEl([
          ["title", t("ttTitle")], ["subtitle", t("ttSubtitle")],
          ["actionbar", t("ttActionbar")], ["chat", t("ttChat")],
        ], g.type, (v) => { g.type = v; out.refresh(); })),
        field(t("text"), textEl(g.text, "FIGHT!", (v) => { g.text = v; out.refresh(); })),
        field(t("color"), selectEl(colorOptions(), g.color, (v) => { g.color = v; out.refresh(); }))
      ),
      h("div", { class: "check-grid" },
        checkEl(t("bold"), g.bold, (v) => { g.bold = v; out.refresh(); }),
        checkEl(t("italic"), g.italic, (v) => { g.italic = v; out.refresh(); })
      ),
      h("div", { class: "field-label" }, t("preview")),
      preview,
      out
    );
  }

  /* ------------------------------------------------------------------------
     21. Attribute generator
     ------------------------------------------------------------------------ */
  function genAttribute() {
    const g = gen.attr;
    const byId = Object.fromEntries(ATTRIBUTES.map((a) => [a[0], a]));
    const valueWrap = h("div", { class: "field" });
    const defHint = h("span", { class: "field-hint" });

    function renderValue() {
      const [, def, min, max, step] = byId[g.id];
      defHint.textContent = t("defaultVal", { v: def });
      if (g.action !== "set") { valueWrap.replaceChildren(); return; }
      const range = h("input", { type: "range", min: String(min), max: String(max), step: String(step), value: String(g.value), "aria-label": t("value") });
      const num = numberEl(g.value, min, max, step, (v) => { g.value = v; range.value = v; out.refresh(); });
      num.classList.add("input-num");
      range.addEventListener("input", () => { g.value = range.value; num.value = range.value; out.refresh(); });
      valueWrap.replaceChildren(h("span", { class: "field-label" }, t("value")), h("div", { class: "range-row" }, range, num), defHint);
    }

    const lines = () => {
      let tail = "get";
      if (g.action === "reset") tail = "base reset";
      if (g.action === "set") {
        const v = Number(g.value);
        tail = `base set ${isFinite(v) && String(g.value).trim() !== "" ? v : byId[g.id][1]}`;
      }
      return [{ text: resolve(`attribute {T} minecraft:${g.id} ${tail}`, null, true) }];
    };
    const out = createOutput(lines);
    renderValue();
    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("attribute"), selectEl(ATTRIBUTES.map(([id, def]) => [id, `${pretty(id)} (${def})`]), g.id, (v) => {
          g.id = v;
          g.value = String(byId[v][1]);
          renderValue();
          out.refresh();
        })),
        field(t("action"), selectEl([["set", t("aSet")], ["reset", t("aReset")], ["get", t("aGet")]], g.action, (v) => {
          g.action = v;
          renderValue();
          out.refresh();
        })),
        valueWrap
      ),
      h("p", { class: "field-hint" }, t("singleNote")),
      out
    );
  }

  /* ------------------------------------------------------------------------
     22. World border generator (shrinking PvP arena)
     ------------------------------------------------------------------------ */
  function genBorder() {
    const g = gen.border;
    const lines = () => {
      const start = Math.round(clampNum(g.start, 1, 59999968, 200));
      const end = Math.round(clampNum(g.end, 1, 59999968, 20));
      const time = Math.round(clampNum(g.time, 1, 1000000, 300));
      const dmg = clampNum(g.dmg, 0, 1000, 0.2);
      const warn = Math.round(clampNum(g.warn, 0, 1000, 5));
      return [
        { text: finalize(`worldborder center ${g.x.trim() || "~"} ${g.z.trim() || "~"}`), label: t("bCenter") },
        { text: finalize(`worldborder set ${start}`), label: t("bStart") },
        { text: finalize(`worldborder set ${end} ${time}s`), label: t("bShrink") },
        { text: finalize(`worldborder damage amount ${dmg}`), label: t("bDamage") },
        { text: finalize(`worldborder warning distance ${warn}`), label: t("bWarn") },
        { text: finalize("worldborder set 59999968"), label: t("bReset") },
      ];
    };
    const out = createOutput(lines);
    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("centerX"), textEl(g.x, "~", (v) => { g.x = v; out.refresh(); })),
        field(t("centerZ"), textEl(g.z, "~", (v) => { g.z = v; out.refresh(); })),
        field(t("startSize"), numberEl(g.start, 1, 59999968, 1, (v) => { g.start = v; out.refresh(); })),
        field(t("endSize"), numberEl(g.end, 1, 59999968, 1, (v) => { g.end = v; out.refresh(); })),
        field(t("shrinkTime"), numberEl(g.time, 1, 1000000, 1, (v) => { g.time = v; out.refresh(); })),
        field(t("dmg"), numberEl(g.dmg, 0, 1000, 0.1, (v) => { g.dmg = v; out.refresh(); })),
        field(t("warnDist"), numberEl(g.warn, 0, 1000, 1, (v) => { g.warn = v; out.refresh(); }))
      ),
      noteBox("note", t("borderNote")),
      out
    );
  }

  /* ------------------------------------------------------------------------
     23. Game rule generator (shows the new AND the old name)
     ------------------------------------------------------------------------ */
  function genRule() {
    const g = gen.rule;
    const byId = Object.fromEntries(GAMERULES.map((r) => [r[0], r]));
    const valueWrap = h("div", { class: "field" });
    const descEl = h("p", { class: "field-hint" });

    function renderValue() {
      const [, , type, def, desc] = byId[g.id];
      descEl.textContent = `${L(desc)} · ${t("defaultVal", { v: def })}`;
      const control = type === "bool"
        ? selectEl([["true", "true"], ["false", "false"]], g.value, (v) => { g.value = v; out.refresh(); })
        : numberEl(g.value, -1, 100000000, 1, (v) => { g.value = v; out.refresh(); });
      valueWrap.replaceChildren(h("span", { class: "field-label" }, t("value")), control);
    }

    const lines = () => {
      const [id, old, type, def, , mapping] = byId[g.id];
      const value = type === "bool"
        ? (g.value === "false" ? "false" : "true")
        : String(Math.round(clampNum(g.value, -1, 100000000, Number(def))));
      const result = [{ text: `gamerule ${id} ${value}`, label: t("ruleNew") }];
      if (old) {
        let oldValue = value;
        if (mapping === "invert") oldValue = value === "true" ? "false" : "true";
        if (mapping === "fire") oldValue = value === "0" ? "false" : "true";
        result.push({ text: `gamerule ${old} ${oldValue}`, label: t("ruleOld") });
      }
      return result;
    };
    const out = createOutput(lines, { copyAll: false });
    const noOld = h("p", { class: "field-hint" });
    const updateNoOld = () => { noOld.textContent = byId[g.id][1] ? "" : t("ruleNoOld"); };

    renderValue();
    updateNoOld();
    return h("div", { class: "gen-body" },
      h("div", { class: "gen-grid" },
        field(t("rule"), selectEl(GAMERULES.map(([id]) => [id, id]), g.id, (v) => {
          g.id = v;
          g.value = byId[v][3];
          renderValue();
          updateNoOld();
          out.refresh();
        })),
        valueWrap
      ),
      descEl,
      noOld,
      out,
      noteBox("note", t("ruleTab"))
    );
  }

  /* ------------------------------------------------------------------------
     24. Generator & help views
     ------------------------------------------------------------------------ */
  const GENERATORS = [
    ["give", "🎁", "gGive", genGive],
    ["effect", "🧪", "gEffect", genEffect],
    ["fill", "🧱", "gFill", genFill],
    ["potion", "⚗️", "gPotion", genPotion],
    ["kit", "🎒", "gKit", genKit],
    ["summon", "🥚", "gSummon", genSummon],
    ["title", "💬", "gTitle", genTitle],
    ["attr", "📈", "gAttr", genAttribute],
    ["border", "🗺️", "gBorder", genBorder],
    ["rule", "📜", "gRule", genRule],
  ];

  function renderGenerator(view) {
    const holder = h("div", { class: "gen-panel" });
    const nav = h("div", { class: "gen-nav", role: "tablist" });

    function show(id) {
      gen.active = id;
      live = [];
      nav.querySelectorAll("button").forEach((b) => {
        const on = b.dataset.id === id;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", String(on));
      });
      const g = GENERATORS.find((x) => x[0] === id);
      holder.replaceChildren(h("h2", { class: "cat-title" }, h("span", { class: "cat-icon" }, g[1]), t(g[2])), g[3]());
    }

    for (const [id, icon, key] of GENERATORS) {
      const b = h("button", { type: "button", class: "pill", role: "tab", "data-id": id }, `${icon} ${t(key)}`);
      b.addEventListener("click", () => show(id));
      nav.append(b);
    }
    view.append(
      h("p", { class: "cat-intro" }, t("genIntro")),
      nav,
      holder
    );
    show(gen.active);
  }

  function renderHelp(view) {
    view.append(h("h2", { class: "cat-title" }, h("span", { class: "cat-icon" }, "❔"), t("helpTitle")),
      h("div", { class: "help", html: HELP[state.lang] || HELP.en }));
  }

  /* ------------------------------------------------------------------------
     25. Tabs, routing and global controls
     ------------------------------------------------------------------------ */
  const VIEWS = ["all", "fav", ...CATEGORIES.map((c) => c.id), "generator", "help"];

  function renderTabs() {
    const nav = $("#tabs");
    const tabs = [
      ["all", "🗂️", t("tabAll")],
      ["fav", "★", t("tabFav")],
      ...CATEGORIES.map((c) => [c.id, c.icon, L(c.name)]),
      ["generator", "🛠️", t("tabGen")],
      ["help", "❔", t("tabHelp")],
    ];
    nav.replaceChildren(...tabs.map(([id, icon, label]) => {
      const active = state.view === id;
      const a = h("a", {
        href: "#" + id,
        class: "tab" + (active ? " is-active" : "") + (id === "pvp" ? " tab-hot" : "") + (id === "generator" ? " tab-gen" : ""),
        "aria-current": active ? "page" : null,
      }, h("span", { class: "tab-icon", "aria-hidden": "true" }, icon), h("span", { class: "tab-label" }, label));
      if (id === "fav") a.append(h("span", { class: "tab-count", id: "fav-count" }, String(state.favs.size)));
      return a;
    }));
    const activeTab = nav.querySelector(".is-active");
    if (activeTab && activeTab.scrollIntoView) activeTab.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function updateFavCount() {
    const el = $("#fav-count");
    if (el) el.textContent = String(state.favs.size);
  }

  function renderView() {
    live = [];
    const view = $("#view");
    view.replaceChildren();
    if (state.view === "generator") renderGenerator(view);
    else if (state.view === "help") renderHelp(view);
    else renderList(view);
  }

  function go(id) {
    if (location.hash === "#" + id) applyHash();
    else location.hash = id;
  }

  let firstRoute = true;
  function applyHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    state.view = VIEWS.includes(id) ? id : "all";
    renderTabs();
    renderView();
    if (!firstRoute) {
      const top = $("#view").getBoundingClientRect().top + window.scrollY - $(".sticky").offsetHeight - 8;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "auto" });
    }
    firstRoute = false;
  }

  /* Search ---------------------------------------------------------------- */
  let searchTimer = 0;
  function onSearch(value) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = value.trim();
      if (state.query && (state.view === "generator" || state.view === "help")) go("all");
      else renderView();
    }, 90);
  }
  function clearSearch() {
    const input = $("#search");
    input.value = "";
    state.query = "";
    renderView();
  }

  /* Player selector ------------------------------------------------------- */
  function setupTarget() {
    const sel = $("#target-select");
    const name = $("#target-name");
    const hint = $("#target-hint");

    const validate = () => {
      const v = name.value.trim();
      const bad = state.target.mode === "custom" && v !== "" && !NAME_RE.test(v);
      name.classList.toggle("is-bad", bad);
      // @s means "the command block itself" inside a block — worth warning about
      const atSelf = !bad && state.target.mode === "@s";
      hint.hidden = !bad && !atSelf;
      hint.textContent = bad ? t("nameBad") : atSelf ? t("atSelfWarn") : "";
      hint.classList.toggle("is-info", atSelf);
    };
    const persist = () => save(STORE.target, state.target);

    sel.addEventListener("change", () => {
      state.target.mode = sel.value;
      name.hidden = sel.value !== "custom";
      if (sel.value === "custom") name.focus();
      persist();
      validate();
      refreshLive();
    });
    name.addEventListener("input", () => {
      state.target.name = name.value;
      persist();
      validate();
      refreshLive();
    });
    if (!["@s", "@p", "@a", "@r", "custom"].includes(state.target.mode)) state.target.mode = "@p";
    name.value = state.target.name || "";
    name.hidden = state.target.mode !== "custom";
    hint._validate = validate;   // so applyLang() can refresh the wording
    validate();
  }

  function fillTargetOptions() {
    const sel = $("#target-select");
    const opts = [["@s", "tS"], ["@p", "tP"], ["@a", "tA"], ["@r", "tR"], ["custom", "tCustom"]];
    sel.replaceChildren(...opts.map(([v, k]) => h("option", { value: v, selected: state.target.mode === v }, t(k))));
  }

  /* Language -------------------------------------------------------------- */
  function applyLang() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll(".lang-btn").forEach((b) => {
      const on = b.dataset.lang === state.lang;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    fillTargetOptions();
    const hint = $("#target-hint");
    if (hint && hint._validate) hint._validate();
  }

  function setLang(lang) {
    if (!UI[lang] || lang === state.lang) return;
    state.lang = lang;
    save(STORE.lang, lang);
    applyLang();
    renderTabs();
    renderView();
  }

  /* ------------------------------------------------------------------------
     26. Start
     ------------------------------------------------------------------------ */
  function init() {
    applyLang();
    setupTarget();

    document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

    const search = $("#search");
    search.addEventListener("input", () => onSearch(search.value));
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { clearSearch(); search.blur(); }
    });

    const shortIds = $("#short-ids");
    shortIds.checked = false;
    shortIds.addEventListener("change", () => { state.shortIds = shortIds.checked; refreshLive(); });

    // "/" focuses the search box (unless you are typing somewhere)
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target;
      const tag = (el.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable) return;
      e.preventDefault();
      search.focus();
      search.select();
    });

    // Back-to-top button
    const topBtn = $("#to-top");
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => { topBtn.classList.toggle("is-visible", window.scrollY > 700); }, { passive: true });

    window.addEventListener("hashchange", () => applyHash());
    applyHash();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
