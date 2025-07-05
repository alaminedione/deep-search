# Deep Search

Une application web moderne et épurée pour effectuer des recherches avancées en utilisant les opérateurs Google Dorks avec intégration IA.

🌐 **Demo**: [deep-search-ai.vercel.app](https://deep-search-ai.vercel.app)

## ✨ Fonctionnalités

### 🔍 Recherche Avancée
- **Opérateurs Google Dorks** pour des recherches précises
- **Interface unifiée** avec onglets pour différents types de recherche
- **Suggestions intelligentes** avec raccourcis prédéfinis

### 🤖 Intégration IA
- **Génération automatique** de requêtes complexes
- **Support multi-modèles** (OpenAI, Anthropic, etc.)
- **Optimisation intelligente** des recherches

### 📊 Statistiques Simplifiées
- **Recherches totales** - Nombre total de recherches effectuées
- **Aujourd'hui** - Recherches du jour en cours
- **Favoris** - Recherches marquées comme favorites
- **Moyenne/jour** - Moyenne des recherches sur 7 jours

### 🎨 Interface Moderne
- **Design épuré** et minimaliste
- **Responsive** sur tous les appareils
- **Mode sombre/clair** automatique
- **Animations fluides** avec Framer Motion
- **Effets glassmorphism** pour un look moderne

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/alaminedione/deep-search.git
cd deep-search

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## ⚙️ Configuration IA

1. Cliquez sur l'icône **API** dans l'interface
2. Ajoutez votre **clé API** et **endpoint**
3. Sélectionnez votre **modèle** préféré
4. Configurez les **paramètres** selon vos besoins

### Modèles supportés
- **OpenAI** (GPT-3.5, GPT-4)
- **Anthropic** (Claude)
- **Google** (Gemini)
- **Autres** modèles compatibles OpenAI

## 📱 Responsive Design

L'interface s'adapte parfaitement à tous les écrans :

- **Mobile** (320px+) - Interface optimisée tactile
- **Tablette** (768px+) - Layout adaptatif
- **Desktop** (1024px+) - Expérience complète
- **Large** (1440px+) - Utilisation optimale de l'espace

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification du code
```

## 🏗️ Technologies

### Frontend
- **React 19** - Framework moderne
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide

### Styling
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Composants accessibles
- **Framer Motion** - Animations fluides

### Fonctionnalités
- **LocalStorage** - Persistance des données
- **PWA Ready** - Application web progressive
- **Accessibility** - Conforme aux standards WCAG

## 🎯 Améliorations Récentes

### Interface Épurée
- ✅ Suppression de la visite guidée
- ✅ Simplification des statistiques (4 métriques essentielles)
- ✅ Design moderne avec glassmorphism
- ✅ Navigation sticky responsive

### Performance
- ✅ Optimisation du bundle size
- ✅ Lazy loading des composants
- ✅ Animations optimisées
- ✅ Polices web optimisées

### Accessibilité
- ✅ Support clavier complet
- ✅ Contraste amélioré
- ✅ Textes alternatifs
- ✅ Support lecteurs d'écran

## 📦 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI de base
│   ├── home-stats.tsx  # Statistiques simplifiées
│   ├── hero-section.tsx # Section d'accueil épurée
│   └── ...
├── contexts/           # Contextes React
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires
└── types.tsx           # Types TypeScript
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. Créez une **branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Alamine Dione**
- GitHub: [@alaminedione](https://github.com/alaminedione)
- Website: [alaminedione.dev](https://alaminedione.dev)

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**