# Astro RPG

RPG spatial 2D vue de dessus, inspiré de Pokémon Donjon Mystère. Projet PegasusCorp.

## Stack

- **Phaser 3** — moteur de jeu (Canvas / WebGL)
- **Vite** — bundler et serveur de dev → sortie `dist/`
- **Capacitor** — packaging Android (`webDir: dist`)
- **JavaScript** (ES modules)

Un seul build web (`dist/`) sert le navigateur, GitHub Pages et l’app Android.

## Démarrage

### Développement (recommandé)

```bash
npm install
npm run dev
```

Le navigateur s’ouvre automatiquement. C’est le mode le plus rapide pour itérer.

### Tester le build de production (identique à Capacitor)

```bash
npm run start
```

Compile dans `dist/` puis ouvre un aperçu local — **les mêmes fichiers** que Capacitor copiera dans l’app Android.

### Android (Capacitor)

Prérequis : Android Studio + SDK, émulateur ou téléphone en USB.

```bash
npm run android
```

Compile `dist/`, synchronise avec le projet `android/`, lance l’app.

Synchronisation seule (sans lancer) :

```bash
npm run cap:sync
```

### GitHub Pages (en ligne)

Après merge sur `main`, déploiement automatique de `dist/`. Active **Pages → Source : GitHub Actions** dans les paramètres du dépôt.

## Pourquoi pas un fichier HTML autonome ?

Le jeu utilise des modules ES et Phaser — les navigateurs bloquent souvent ça en `file://` (double-clic). Capacitor charge le jeu via une WebView avec une URL locale (`https://localhost`), comme `npm run preview`. Pas besoin d’un build spécial : **Vite → `dist/` → Capacitor**.

## Structure

```
src/
  core/       # Logique pure, sans Phaser (Grid, combat, tours…)
  scenes/     # Scènes Phaser (affichage uniquement)
  data/       # JSON : donjons, plans, dialogues…
  assets/     # Images, spritesheets, audio
android/      # Projet natif Capacitor (Android)
dist/         # Build web (généré, non versionné)
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
| 10 | 🔶 | Capacitor Android (base en place, test sur appareil à valider) |

## Générateur de plans (hors ligne)

```bash
npm run generate:plans
# ou
node tools/generator.js --dungeon test-dungeon --floor 0 --count 10
```

## Contrôles (jalon 2)

- **Flèches** ou **WASD** : déplacer le héros d’une case
- **G** : afficher / masquer la grille
- **R** : tirer un nouveau plan au hasard

## Document de conception

Voir le document de référence fourni au dépôt (pitch, narration Aurore / `{hero}`, architecture, génération procédurale, système de conséquences).
