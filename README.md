# Astro RPG

RPG spatial 2D vue de dessus, inspiré de Pokémon Donjon Mystère. Projet PegasusCorp.

## Stack

- **Phaser 3** — moteur de jeu (Canvas / WebGL)
- **Vite** — bundler et serveur de dev
- **JavaScript** (ES modules)
- **Capacitor** — packaging Android (jalon ultérieur)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir l’URL affichée par Vite (généralement `http://localhost:5173`).

## Structure

```
src/
  core/       # Logique pure, sans Phaser (Grid, combat, tours…)
  scenes/     # Scènes Phaser (affichage uniquement)
  data/       # JSON : donjons, plans, dialogues…
  assets/     # Images, spritesheets, audio
tools/        # Générateur de plans, éditeur de collision hub
```

## Jalons

| # | Statut | Description |
|---|--------|-------------|
| 1 | ✅ | Grille, déplacement d’une entité, tileset statique |
| 2 | ✅ | Générateur de plans hors ligne + autotiling |
| 3 | — | Gestionnaire de tours + IA ennemis |
| 4 | — | Combat et résolution des dégâts |
| 5 | — | Alliés et IA d’équipe |
| 6 | — | Interface mobile, contrôle au tap |
| 7 | — | Inventaire, objets, échec d’expédition |
| 8 | — | Hub, PNJ, dialogues, sauvegarde |
| 9 | — | Prologue narratif |
| 10 | — | Build Capacitor |

## Générateur de plans (hors ligne)

```bash
node tools/generator.js --dungeon test-dungeon --floor 0 --count 10
```

Options : `--width`, `--height`, `--seed`, `--count`, `--floor`.

## Contrôles (jalon 2)

- **Flèches** ou **WASD** : déplacer le héros d’une case
- **G** : afficher / masquer la grille
- **R** : tirer un nouveau plan au hasard

## Document de conception

Voir le document de référence fourni au dépôt (pitch, narration Aurore / `{hero}`, architecture, génération procédurale, système de conséquences).
