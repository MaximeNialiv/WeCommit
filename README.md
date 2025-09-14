# Habits Tracker

Application mobile de suivi d'habitudes quotidiennes développée avec Next.js et Tailwind CSS.

## 🚀 Fonctionnalités

- ✅ **Interface mobile-first** optimisée pour smartphone
- ✅ **PWA complète** (installation sur écran d'accueil)
- ✅ **Calendrier visuel** avec vue mensuelle
- ✅ **Multi-utilisateurs** (Maxime, Chloé, Camille)
- ✅ **Suivi de progression** avec slider interactif
- ✅ **Statistiques** (jours consécutifs, pourcentage mensuel)
- ✅ **Mode offline** avec cache automatique
- ✅ **Icônes FontAwesome** (calendrier, paramètres, chat)

## 🛠️ Technologies

- **Next.js 15** - Framework React
- **Tailwind CSS** - Styling
- **TypeScript** - Typage
- **PWA** - Application web progressive
- **FontAwesome** - Icônes
- **Bun** - Package manager

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/[VOTRE-USERNAME]/habits-tracker.git
cd habits-tracker

# Installer les dépendances
bun install

# Lancer en développement
bun run dev
```

## 📱 Utilisation sur mobile

1. **Accéder à l'URL** déployée
2. **iOS** : Safari → Partager → "Sur l'écran d'accueil"
3. **Android** : Chrome → Menu → "Ajouter à l'écran d'accueil"

## 🌐 Déploiement

Application optimisée pour Vercel :

```bash
# Déploiement
vercel --prod
```

## 📊 Structure

- `src/app/page.tsx` - Page principale avec calendrier
- `src/app/layout.tsx` - Layout avec configuration PWA
- `public/manifest.json` - Configuration PWA
- `public/sw.js` - Service Worker (généré automatiquement)

## 🎨 Design

Interface inspirée d'un calendrier mobile avec :
- Header avec date et icônes
- Grille de calendrier colorée (vert = fait, orange = partiel)
- Footer compact sur 2 lignes
- Slider de progression