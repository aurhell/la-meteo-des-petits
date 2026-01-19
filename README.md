# la-meteo-des-petits

Un petit ami annonce la météo aux enfants ☀️🌧️❄️

## Setup

```sh
pnpm install
```

### Dev

```sh
pnpm dev
```

### Build

```sh
pnpm build
```

L'app est maintenant une **Progressive Web App (PWA)** complète! Voir [PWA_SETUP.md](PWA_SETUP.md) pour l'installation sur iPhone et autres appareils.

### Lint

```sh
pnpm lint
```

## Configuration

### ElevenLabs TTS

Pour activer la synthèse vocale naturelle avec ElevenLabs :

1. Inscrivez-vous gratuitement : https://elevenlabs.io/sign-up
2. Obtenez votre API Key dans les paramètres
3. Créez un fichier `.env.local` à la racine du projet :

```env
VITE_ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx
```

Sans cette clé, l'app utilise la Web Speech API native comme fallback (moins naturelle).

### Debug Mode

Le bouton debug (permettant de tester les saisons et météo) s'affiche automatiquement :
- **En développement** : ✅ Visible par défaut
- **En production** : ❌ Caché par défaut

Pour forcer le comportement, ajoutez dans `.env.local` :

```env
# Forcer la visibilité
VITE_DEBUG_MODE=true

# Forcer à cacher
VITE_DEBUG_MODE=false
```

## Architecture

L'app suit une architecture modulaire :

- **Composables** (`src/composables/`) - Logique métier réutilisable
  - `useSeason` - Gestion des saisons et thèmes
  - `useWeather` - Fetch et gestion de la météo
  - `useWeatherUI` - Formatage emoji et animations
  - `useTemperature` - Logique de la barre température
  - `useTTS` - Synthèse vocale avec ElevenLabs/Web Speech

- **Composants** (`src/components/`) - Composants UI réutilisables
  - `WeatherDisplay` - Affichage météo
  - `CharacterButton` - Personnage + TTS
  - `WeatherBackground` - Animations de fond
  - `FriendSelector` - Sélection du personnage
