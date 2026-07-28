# Astro RPG

RPG spatial 2D vue de dessus, inspiré de Pokémon Donjon Mystère. Projet PegasusCorp.

## Tester le jeu (sans commandes)

### En local — double-clic

Ouvre **`dist/index.html`** dans ton navigateur (Chrome ou Firefox).

Le dossier `dist/` est versionné : clone le dépôt, double-clic, c’est tout. Pas de `npm`, pas de serveur.

### En ligne

Après activation de GitHub Pages (Source : GitHub Actions), le jeu est accessible via l’URL du dépôt — pareil, aucune commande.

## Modifier le code

Seulement si tu touches au source :

```bash
npm install          # une fois
npm run build        # après chaque modification
```

Puis rouvre ou rafraîchis `dist/index.html`.

Option confort pendant l’édition : `npm run build:watch` (recompile automatiquement).

`npm run dev` existe aussi (serveur Vite) mais **n’est pas nécessaire** pour tester.

## Stack

| Outil | Rôle |
|-------|------|
| Phaser 3 | Moteur de jeu |
| Vite | Compile `src/` → `dist/` (script classique, pas module ES) |
| Capacitor | Android — utilise le **même** `dist/` |

Un seul build (`dist/`) pour navigateur, GitHub Pages et Android.

## Android (plus tard)

```bash
npm run android      # Android Studio requis
```

## Structure

```
dist/           ← jeu jouable (index.html + game.js) — ouvre ça
src/            ← code source
  core/         ← logique pure
  scenes/       ← Phaser
  data/         ← JSON donjons, plans…
android/        ← projet Capacitor
tools/          ← générateur de plans hors ligne
```

## Jalons

| # | Statut | Description |
|---|--------|-------------|
| 1 | ✅ | Grille, déplacement, tileset statique |
| 2 | ✅ | Générateur de plans + autotiling |
| 3 | — | Tours + IA ennemis |
| 4 | — | Combat |
| 5 | — | Alliés IA |
| 6 | — | Tap mobile |
| 7 | — | Inventaire, échec expédition |
| 8 | — | Hub, dialogues, sauvegarde |
| 9 | — | Prologue |
| 10 | 🔶 | Capacitor Android (base en place) |

## Générateur de plans

```bash
npm run generate:plans
```

## Contrôles

- **Flèches / WASD** — déplacement (1 case)
- **G** — grille
- **R** — nouveau plan
