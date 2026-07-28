# Astro RPG

Jeu de rôle spatial 2D, inspiré de Pokémon Donjon Mystère.

## Jouer (aucune commande)

### En ligne

**https://arknoid01.github.io/astro-platform-starter/**

Si la page est vide : dans GitHub → **Settings → Pages** → Source : **Deploy from a branch** → branche `main` → dossier **`/docs`**.

### En local

Double-clic sur **`docs/index.html`**.

## Contrôles

- **Flèches / WASD** — déplacement
- **G** — grille
- **R** — nouveau plan

## Android (optionnel)

```bash
npm install
npm run android
```

## Modifier le contenu (optionnel)

```bash
node tools/generator.js
node tools/embed-plans.js
```

## Structure

| Dossier | Rôle |
|---------|------|
| `docs/` | Jeu jouable + GitHub Pages + Capacitor |
| `src/data/` | JSON source des donjons |
| `tools/` | Générateur de plans |
