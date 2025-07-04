# 🔍 Deep Search

**Deep Search** est une application web moderne et intuitive conçue pour effectuer des recherches avancées et précises sur le web en utilisant les **opérateurs Google Dorks**. L'application propose également une intégration avec des intelligences artificielles via une API, permettant de générer automatiquement des requêtes complexes et optimisées.

![Deep Search Interface](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Fonctionnalités

### 🎯 Recherche Avancée
- **Opérateurs Google Dorks** : Utilisez des opérateurs puissants pour des recherches précises
- **Interface intuitive** : Ajoutez facilement des filtres par tags
- **Aperçu en temps réel** : Visualisez votre requête avant de la lancer
- **Support multi-moteurs** : Google et DuckDuckGo

### 🤖 Intelligence Artificielle
- **Génération automatique** : L'IA optimise vos requêtes avec les bons opérateurs
- **Configuration flexible** : Compatible avec OpenAI, Anthropic, et autres APIs
- **Gestion d'erreurs avancée** : Messages d'erreur clairs et solutions proposées

### 📊 Gestion des Données
- **Historique des recherches** : Gardez une trace de vos requêtes
- **Export/Import** : Sauvegardez et partagez votre historique
- **Persistance locale** : Vos paramètres sont automatiquement sauvegardés

### 🎨 Interface Utilisateur
- **Design moderne** : Interface élégante avec Tailwind CSS et Radix UI
- **Thèmes** : Mode sombre, clair ou automatique
- **Responsive** : Optimisé pour tous les appareils
- **Animations fluides** : Transitions avec Framer Motion

---

## 🚀 Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/alaminedione/deep-search.git
cd deep-search

# Installer les dépendances
npm install
# ou
pnpm install

# Lancer en mode développement
npm run dev
# ou
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

---

## 🛠️ Configuration

### API Intelligence Artificielle

1. **Cliquez sur l'icône API** en bas de l'interface
2. **Configurez vos paramètres** :
   - **Clé API** : Votre clé d'authentification
   - **Endpoint** : URL de l'API (ex: `https://api.openai.com/v1/chat/completions`)
   - **Modèle** : Le modèle à utiliser (ex: `gpt-3.5-turbo`, `claude-3-sonnet`)

### Exemples de Configuration

#### OpenAI
```
Endpoint: https://api.openai.com/v1/chat/completions
Modèle: gpt-3.5-turbo
```

#### Anthropic
```
Endpoint: https://api.anthropic.com/v1/messages
Modèle: claude-3-sonnet-20240229
```

#### OpenRouter
```
Endpoint: https://openrouter.ai/api/v1/chat/completions
Modèle: anthropic/claude-3-sonnet
```

---

## 📖 Guide d'Utilisation

### Opérateurs Google Dorks Supportés

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `site:` | Recherche sur un site spécifique | `site:github.com` |
| `filetype:` | Recherche par type de fichier | `filetype:pdf` |
| `intitle:` | Mots dans le titre | `intitle:"machine learning"` |
| `inurl:` | Mots dans l'URL | `inurl:blog` |
| `-site:` | Exclure un site | `-site:pinterest.com` |
| `-"mot"` | Exclure un mot | `-"publicité"` |

### Exemples de Recherches

1. **Trouver des tutoriels PDF** :
   ```
   Recherche: "python tutorial"
   Filetype: pdf
   Sites: site:github.com OR site:docs.python.org
   ```

2. **Recherche académique** :
   ```
   Recherche: "machine learning"
   Filetype: pdf
   Dans le titre: "research", "paper"
   Exclure: "course", "tutorial"
   ```

3. **Documentation technique** :
   ```
   Recherche: "API documentation"
   Sites: site:docs.microsoft.com
   Dans l'URL: "api", "reference"
   ```

---

## 🏗️ Architecture Technique

### Technologies Utilisées

- **Frontend** : React 19 avec TypeScript
- **Build Tool** : Vite 6 avec optimisations de bundle
- **Styling** : Tailwind CSS + Radix UI
- **Animations** : Framer Motion
- **State Management** : React Context + Hooks
- **Icons** : Lucide React

### Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── search-bar.tsx  # Barre de recherche avec IA
│   ├── input-tags.tsx  # Gestion des tags
│   └── dock.tsx        # Navigation principale
├── contexts/           # Contextes React
│   └── settingApi.tsx  # Gestion de la configuration API
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et helpers
└── types.tsx           # Définitions TypeScript
```

### Optimisations de Performance

- **Code Splitting** : Division automatique du bundle
- **Lazy Loading** : Chargement différé des composants
- **Memoization** : Optimisation des re-rendus
- **Bundle Analysis** : Surveillance de la taille du bundle

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code

# Analyse
npm run build-analyze  # Analyse de la taille du bundle
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines de Développement

- Utilisez TypeScript pour tous les nouveaux composants
- Suivez les conventions de nommage existantes
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les changements importants

---

## 📝 Changelog

### Version 1.1.0 (Améliorations)
- ✨ Aperçu en temps réel des requêtes
- 🤖 Amélioration de l'intégration IA avec gestion d'erreurs avancée
- 📊 Historique des recherches avec export/import
- 🎨 Interface utilisateur améliorée avec animations
- ⚡ Optimisations de performance et réduction de la taille du bundle
- 🔧 Configuration API améliorée avec validation
- 🌐 Support multilingue (français)
- 📱 Meilleure responsivité mobile

### Version 1.0.0
- 🎉 Version initiale
- 🔍 Recherche avec opérateurs Google Dorks
- 🤖 Intégration IA basique
- 🎨 Interface utilisateur de base

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Alamine Dione**
- GitHub: [@alaminedione](https://github.com/alaminedione)
- Email: [contact@alaminedione.dev](mailto:contact@alaminedione.dev)

---

## 🙏 Remerciements

- [Radix UI](https://www.radix-ui.com/) pour les composants UI
- [Tailwind CSS](https://tailwindcss.com/) pour le système de design
- [Lucide](https://lucide.dev/) pour les icônes
- [Framer Motion](https://www.framer.com/motion/) pour les animations

---

<div align="center">
  <p>Fait avec ❤️ pour la communauté des chercheurs et développeurs</p>
  
  [![GitHub stars](https://img.shields.io/github/stars/alaminedione/deep-search?style=social)](https://github.com/alaminedione/deep-search/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/alaminedione/deep-search?style=social)](https://github.com/alaminedione/deep-search/network/members)
</div>