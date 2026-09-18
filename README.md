# MC Command Hub

A static reference and generator for **Minecraft Java Edition 1.21.11**, built around
one rule: **everything here runs inside a command block.**

A command block executes at **permission level 2**. Every command on this site is level 2
or lower, so it works when you paste it into a block. The 21 commands that need level 3+
(`/op`, `/ban`, `/kick`, `/whitelist`, `/stop`, `/save-all`, `/list`, `/tick`, …) are listed
separately in the reference tab, marked as *not* usable in blocks.

## What's inside

- **Command reference** — all **63** command-block-capable commands with working syntax
  and examples, each tagged with its permission level.
- **Kits** — 7 presets (Full PvP, Sword, Mace, Crystal, UHC, Spear, Archer), an
  "equip armor directly" mode, and a **kit chest**: one `setblock` that places a chest
  holding the entire loadout.
- **Overpowered** — Sharpness 255 gear, 2048 attack damage, 1024 hearts, 64-block reach,
  instant mining, moon jump, mega creeper.
- **Unusual & advanced** — `execute` condition patterns, entity stacking, marker armor
  stands, loot tables, forceload, `fillbiome`, NBT editing, structure placing.
- **PvP & arena** — scoreboards, teams, countdowns, shrinking world border, match timer.
- Plus weapons, armor, tools, movement, effects, player, world, building, entities,
  bosses, display & sound, and fun.
- **10 generators**: give, effect, fill, potion, kit builder, summon, title & chat,
  attribute, world border, game rules.
- Global target selector (`@p` / `@a` / `@r` / player name), search, favorites,
  English / Русский / Deutsch.
- **Short IDs** switch strips `minecraft:` from every command at once.

Copy buttons always copy **without** a leading slash — exactly what a command block wants.

## Files

| File | What it is |
| --- | --- |
| `index.html` | page shell |
| `style.css` | dark glassmorphism theme (Inter + JetBrains Mono) |
| `commands.js` | all command, reference, kit and generator data |
| `script.js` | rendering, search, favorites, generators |
| `.claude/launch.json` | local dev-server helper — safe to delete |

No frameworks, no build step, no backend, no accounts, no tracking, no external APIs.
`localStorage` holds only favorites, the language choice and the last used target.
The single external request is the Google Fonts stylesheet.

## Open it locally

Double-click **`index.html`**. It works straight from the file system.

Optional local server:

```bash
python -m http.server 8777
```

## Put it online for free

### GitHub Pages
1. Create a public repository on github.com.
2. Upload `index.html`, `style.css`, `commands.js`, `script.js` to the repo root
   (**Add file → Upload files**, no git needed).
3. **Settings → Pages** → Source `Deploy from a branch`, branch `main`, folder `/ (root)` → **Save**.
4. Live at `https://<your-name>.github.io/<repo>/` within a minute.

### Netlify Drop
Drag the project folder onto <https://app.netlify.com/drop> for an instant public URL.

## Adding your own commands

Cards live in the `COMMANDS` array in `commands.js`:

```js
{
  id: "my-command",            // unique, used for favorites
  cat: "op",                   // category id, see CATEGORIES
  title: T("English", "Русский", "Deutsch"),
  desc:  T("English", "Русский", "Deutsch"),
  cmds:  ["give {T} minecraft:diamond 64"],
  single: true,                // command takes only ONE target → auto-wrapped in execute as @a
  overmax: true,               // uses enchantment levels above the vanilla max on purpose
}
```

`{T}` becomes the selected target, `{NAME}` a player name, and `opts` adds dropdowns.
The reference tab is generated from the separate `REFERENCE` array, and `NOT_IN_BLOCKS`
holds the level-3+ commands.

## 1.21.11 notes

- Items use components — `item[enchantments={"minecraft:sharpness":5}]`, not old NBT.
- All game rules were renamed (`keepInventory` → `keep_inventory`); cards show both names,
  and `doFireTick` became `fire_spread_radius_around_player`.
- `/worldborder` times are in ticks — use the `s` suffix for seconds.
- New in 1.21.11: spears with Lunge, `/stopwatch`, netherite horse armor, nautilus mounts.
