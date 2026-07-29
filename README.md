# Aether Realm — Developer Portfolio

A developer portfolio built as a playable isometric RPG world. Instead of scrolling through sections, you walk a character through a 3D game world, meet four Keepers who guard fragments of a shattered Void Crystal, and explore zones to discover projects, skills, and contact info.

Built with Next.js, TypeScript, React Three Fiber, and Zustand.

---

## Live Demo

**[aether-realm-soham.vercel.app](https://aether-realm-soham.vercel.app/)**

Press **Enter** at the intro screen to begin. Use **WASD** or **arrow keys** to move.

---

## What it is

The world has four named zones spread across an isometric grid map. Each zone is guarded by a Keeper — a character with their own personality and dialogue who speaks to you before revealing their content. Walking into a zone triggers a cinematic dialogue sequence, then a content panel opens with real portfolio information. Exploring zones earns XP and visually evolves your character with new cosmetic effects — nothing is ever gated behind level or XP, every zone is reachable from the very first second.

| Zone | Keeper | Purpose | Unlocks |
|---|---|---|---|
| The Forge | **Kael**, Keeper of Creation | Projects & builds | Floating crown + shoulder crystal |
| The Archives | **Elyra**, Guardian of Knowledge | Skills & tech stack | Orbiting relic + knowledge particles |
| The Oracle | **The Oracle of the Void** | About & journey | Pulsing void aura |
| The Gateway | **Nox**, Warden of Infinite Paths | Contact & links | Aether cape |

The narrative frame: the Void Crystal shattered long ago and its Keepers entered an endless slumber. Your arrival awakens them one by one — they aren't teaching you, they're judging whether you're worthy of becoming the Realm's next Architect.

---

## Core systems

**NPC Dialogue** — Each Keeper has multi-line arrival dialogue delivered through a typewriter text effect. Clicking mid-line instantly completes it; clicking again advances to the next line. First-time zone visits trigger dialogue before the content panel appears; return visits skip straight to the panel.

**Evolution system** — Character progression is tied to *which* zones you've explored, not your level number. Visiting The Forge grants a floating crown, The Archives grants an orbiting relic that circles the character in true 3D space, The Oracle grants a pulsing aura, The Gateway grants an animated cape that reacts to movement direction. All four can be visible simultaneously.

**Cinematic presentation** — Camera transitions, letterboxing, and world-space region titles anchor the experience closer to a game than a website. Dynamic waypoint trails help guide exploration across the map without forcing a fixed path.

**XP & leveling** — Visiting a new zone awards XP with correct overflow handling on level-up (excess XP carries into the next level rather than resetting). Rank titles progress from Wanderer upward. A dedicated level-up VFX burst plays when you cross a threshold.

**Day/night cycle** — World lighting shifts automatically based on the visitor's local system time.

**Persistence** — Level, XP, and visited zones are saved to `localStorage` and survive a page refresh.

**Reset** — Press `Ctrl+Shift+R` at any time to wipe saved progress and restart the journey from Wanderer.

---

## Tech stack

- **Next.js** — App Router, TypeScript, file-based routing
- **React Three Fiber** — React renderer for Three.js
- **@react-three/drei** — Billboard, Sparkles, texture loading helpers
- **Zustand** — global game state (XP, level, visited zones, dialogue state) with `persist` middleware
- **Tailwind CSS** — HUD, dialogue box, and panel styling
- **Three.js** — 3D engine underneath R3F

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                # root page, composes scene + UI layers
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Scene.tsx                # Canvas, lighting rig, zone crystal instances
│   ├── Avatar.tsx                # player sprite, evolution cosmetics, movement
│   ├── AetherCrystal.tsx         # zone marker — per-zone geometry, glow, particles
│   ├── WorldGround.tsx           # ground plane + grid
│   ├── GameHUD.tsx               # rank, XP bar, event log, reset shortcut
│   └── ui/
│       ├── DialogueBox.tsx       # typewriter Keeper dialogue system
│       └── ZonePanel.tsx         # portfolio content panel per zone
├── hooks/
│   ├── useKeyboardMovement.ts    # WASD/arrow input, proximity detection
│   ├── useCameraFollow.ts        # smooth isometric camera lerp
│   └── useDayNight.ts            # local-time-based lighting presets
├── store/
│   └── useGameStore.ts           # zustand: level, XP, visited zones, dialogue state
└── data/
    ├── zones.ts                  # zone config — position, color, shape, content
    └── dialogue.ts                # Keeper names, titles, arrival/leave lines
```

---

## How the core systems work

**Movement** — Keys are tracked in a `useRef`, not `useState`, because the render loop reads them 60 times per second. Using state here would trigger 60 re-renders/sec. Movement speed is scaled by `delta` for framerate independence.

**Proximity detection** — Every frame, distance from the avatar to each zone is checked against a trigger radius. Crossing it fires `visitZone`; walking away resets the active zone to `null`.

**Dialogue gating** — A `dialogueActive` flag in the store determines whether `DialogueBox` or `ZonePanel` renders. First-time zone entry sets the flag true; the panel only appears once dialogue finishes.

**XP and level-up** — `gainXP` handles overflow correctly: if XP gained crosses the threshold, the remainder carries into the next level rather than resetting to zero. `xpToNextLevel` scales ×1.5 each level.

**Evolution cosmetics** — Derived entirely from `visitedZones`, not from level. Each unlocked cosmetic is an independently animated Three.js mesh layered onto the character — no sprite-swapping required.

**Camera follow** — Lerps toward `avatarPosition + isometricOffset` every frame, with lerp speed scaled by `delta` to stay consistent across devices.

---

## Getting started

```bash
git clone https://github.com/SM33-07/Aether-Realm
cd Aether-Realm

npm install
npm run dev
```

Open `localhost:3000`.

---

## Controls

| Key | Action |
|---|---|
| W / Arrow Up | Move forward (northwest) |
| S / Arrow Down | Move backward (southeast) |
| A / Arrow Left | Move left (southwest) |
| D / Arrow Right | Move right (northeast) |
| Space / Enter / Click | Advance dialogue |
| Ctrl + Shift + R | Reset saved progress |

---

## Roadmap

**Shipped**
- [x] Four zones with real portfolio content
- [x] Pixel art character sprite with directional animation
- [x] NPC dialogue system with typewriter effect
- [x] Zone-based evolution cosmetics (crown, relic, aura, cape)
- [x] Level-up VFX
- [x] Ambient particles and per-zone atmosphere
- [x] Day/night cycle based on visitor local time
- [x] localStorage persistence
- [x] Cinematic camera transitions & letterboxing
- [x] World-space region titles and waypoint guidance

**In progress**
- [ ] Mobile touch controls
- [ ] Performance audit (Lighthouse pass)
- [ ] Hidden secret zone off the main map
- [ ] Opt-in ambient audio (Howler.js)

---

## Companion project

A static, animation-driven professional portfolio is in development as the primary recruiter-facing entry point, with Aether Realm linked from it as the deeper interactive experience.

---

## Build log

Built in public — progress and technical breakdowns posted on [LinkedIn](https://www.linkedin.com/in/soham-more-muj). Development combined hands-on implementation with AI-assisted ideation and pair-programming.

---

## License

MIT
