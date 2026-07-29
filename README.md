# Astro RPG

Jeu de rôle spatial 2D, inspiré de Pokémon Donjon Mystère.

## Jouer

### Lien en ligne

**https://arknoid01.github.io/astro-platform-starter/**

### En local

Double-clic sur **`index.html`** (à la racine du projet).

Aucun npm, aucune commande.

## Si écran noir sur le lien GitHub

GitHub Pages doit pointer sur la branche **`main`**, dossier **`/docs`** (ou racine avec le nouveau `index.html`).

1. GitHub → **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branche : **`main`**
4. Dossier : **`/docs`** (ou **`/ (root)`**)
5. **Save**, attendre 2 minutes, rafraîchir

## Contrôles

- **Flèches / WASD** — déplacement
- **G** — grille
- **R** — nouveau plan

## Android (optionnel)

```bash
npm install
npm run android
```

## Structure

| Emplacement | Rôle |
|-------------|------|
| `index.html` + `js/` + `lib/` | Jeu à la racine (Pages + local) |
| `docs/` | Copie identique (Capacitor + option Pages `/docs`) |
