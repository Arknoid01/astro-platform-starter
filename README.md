# Astro RPG

Jeu de rôle spatial 2D, inspiré de Pokémon Donjon Mystère.

## Jouer

**Double-clic** sur `play/index.html` — ou ouvre le lien GitHub Pages après publication.

Aucun npm, aucun serveur, aucune commande.

```
play/
  index.html       ← ouvre ça
  lib/phaser.min.js
  js/              ← code du jeu + données intégrées
```

## Contrôles

- **Flèches / WASD** — déplacement (1 case)
- **G** — afficher / masquer la grille
- **R** — nouveau plan aléatoire

## Android (plus tard)

Le dossier `play/` est aussi utilisé par Capacitor. Nécessite Node + Android Studio :

```bash
npm install
npm run android
```

## Outils (optionnel, pour modifier le jeu)

Si quelqu'un ajoute du contenu :

```bash
npm install
node tools/generator.js          # génère des plans JSON
node tools/embed-plans.js        # intègre les plans dans play/js/plans-data.js
```

## Structure

| Dossier | Contenu |
|---------|---------|
| `play/` | Jeu jouable (HTML + JS classique) |
| `src/data/` | Source JSON des donjons (pour les outils) |
| `tools/` | Générateur de plans, intégration des données |
| `android/` | App Android (Capacitor) |
