# 🔍 Guide Complet des Opérateurs Google Dorks - Deep Search

Ce guide présente tous les opérateurs Google Dorks supportés par Deep Search, organisés par catégorie pour une utilisation optimale.

## 📚 Table des Matières

1. [Opérateurs de Base](#opérateurs-de-base)
2. [Opérateurs de Contenu Avancés](#opérateurs-de-contenu-avancés)
3. [Opérateurs de Liens et Relations](#opérateurs-de-liens-et-relations)
4. [Opérateurs Temporels](#opérateurs-temporels)
5. [Opérateurs Numériques et de Plage](#opérateurs-numériques-et-de-plage)
6. [Opérateurs Géographiques](#opérateurs-géographiques)
7. [Opérateurs de Réseaux Sociaux](#opérateurs-de-réseaux-sociaux)
8. [Opérateurs de Fichiers et Documents](#opérateurs-de-fichiers-et-documents)
9. [Opérateurs de Recherche Spécialisée](#opérateurs-de-recherche-spécialisée)
10. [Opérateurs de Sécurité et Audit](#opérateurs-de-sécurité-et-audit)
11. [Templates de Requêtes Prédéfinies](#templates-de-requêtes-prédéfinies)

---

## 🎯 Opérateurs de Base

### `site:`
**Description**: Recherche sur un site spécifique  
**Syntaxe**: `site:domaine.com`  
**Exemple**: `site:github.com python tutorial`  
**Usage**: Limite la recherche à un domaine particulier

### `filetype:` / `ext:`
**Description**: Recherche par type de fichier  
**Syntaxe**: `filetype:extension` ou `ext:extension`  
**Exemple**: `filetype:pdf machine learning`  
**Usage**: Trouve des fichiers d'un type spécifique

### `define:`
**Description**: Obtenir la définition d'un terme  
**Syntaxe**: `define:terme`  
**Exemple**: `define:machine learning`  
**Usage**: Recherche de définitions et explications

### `stocks:`
**Description**: Informations boursières  
**Syntaxe**: `stocks:SYMBOLE`  
**Exemple**: `stocks:AAPL`  
**Usage**: Données financières d'entreprises

### `weather:`
**Description**: Informations météorologiques  
**Syntaxe**: `weather:lieu`  
**Exemple**: `weather:Paris`  
**Usage**: Prévisions et conditions météo

### `map:`
**Description**: Cartes et localisation  
**Syntaxe**: `map:lieu`  
**Exemple**: `map:Eiffel Tower`  
**Usage**: Recherche de cartes et directions

### `movie:`
**Description**: Informations sur les films  
**Syntaxe**: `movie:titre`  
**Exemple**: `movie:Inception`  
**Usage**: Données sur les films et cinéma

---

## 📝 Opérateurs de Contenu Avancés

### `intext:`
**Description**: Texte dans le contenu de la page  
**Syntaxe**: `intext:"phrase"`  
**Exemple**: `intext:"configuration file"`  
**Usage**: Recherche dans le corps du texte

### `intitle:`
**Description**: Mot dans le titre de la page  
**Syntaxe**: `intitle:"mot"`  
**Exemple**: `intitle:"admin panel"`  
**Usage**: Recherche dans les titres de pages

### `inurl:`
**Description**: Mot dans l'URL de la page  
**Syntaxe**: `inurl:mot`  
**Exemple**: `inurl:login`  
**Usage**: Recherche dans les URLs

### `allintext:`
**Description**: Tous les mots dans le contenu  
**Syntaxe**: `allintext:"phrase complète"`  
**Exemple**: `allintext:"python machine learning"`  
**Usage**: Tous les termes doivent être dans le contenu

### `allintitle:`
**Description**: Tous les mots dans le titre  
**Syntaxe**: `allintitle:"phrase complète"`  
**Exemple**: `allintitle:"data science tutorial"`  
**Usage**: Tous les termes doivent être dans le titre

### `allinurl:`
**Description**: Tous les mots dans l'URL  
**Syntaxe**: `allinurl:"mots"`  
**Exemple**: `allinurl:"admin config"`  
**Usage**: Tous les termes doivent être dans l'URL

### `inanchor:`
**Description**: Texte dans les liens pointant vers la page  
**Syntaxe**: `inanchor:"texte du lien"`  
**Exemple**: `inanchor:"download here"`  
**Usage**: Recherche dans le texte des liens

### `allinanchor:`
**Description**: Tous les mots dans les liens  
**Syntaxe**: `allinanchor:"phrase complète"`  
**Exemple**: `allinanchor:"free download pdf"`  
**Usage**: Tous les termes dans les liens

### `insubject:`
**Description**: Dans le sujet (groupes de discussion)  
**Syntaxe**: `insubject:"sujet"`  
**Exemple**: `insubject:"python help"`  
**Usage**: Recherche dans les sujets de forums

---

## 🔗 Opérateurs de Liens et Relations

### `link:`
**Description**: Pages avec liens vers cette URL  
**Syntaxe**: `link:url.com`  
**Exemple**: `link:example.com`  
**Usage**: Trouve les pages qui pointent vers un site

### `related:`
**Description**: Sites similaires ou liés  
**Syntaxe**: `related:url.com`  
**Exemple**: `related:stackoverflow.com`  
**Usage**: Découvre des sites similaires

### `cache:`
**Description**: Version en cache de Google  
**Syntaxe**: `cache:url.com`  
**Exemple**: `cache:example.com`  
**Usage**: Accède à la version mise en cache

### `info:`
**Description**: Informations sur une URL  
**Syntaxe**: `info:url.com`  
**Exemple**: `info:github.com`  
**Usage**: Obtient des infos sur un site

---

## ⏰ Opérateurs Temporels

### `before:`
**Description**: Contenu publié avant cette date  
**Syntaxe**: `before:YYYY-MM-DD`  
**Exemple**: `before:2023-01-01`  
**Usage**: Limite aux contenus antérieurs

### `after:`
**Description**: Contenu publié après cette date  
**Syntaxe**: `after:YYYY-MM-DD`  
**Exemple**: `after:2022-01-01`  
**Usage**: Limite aux contenus postérieurs

### `daterange:`
**Description**: Plage de dates (format Julian)  
**Syntaxe**: `daterange:début-fin`  
**Exemple**: `daterange:2451545-2451910`  
**Usage**: Période spécifique (format complexe)

---

## 🔢 Opérateurs Numériques et de Plage

### `numrange:`
**Description**: Plage de nombres  
**Syntaxe**: `numrange:min-max`  
**Exemple**: `numrange:100-500`  
**Usage**: Recherche dans une plage numérique

### `$` (Prix)
**Description**: Recherche de prix  
**Syntaxe**: `$min..$max`  
**Exemple**: `$100..$500`  
**Usage**: Recherche par gamme de prix

---

## 🌍 Opérateurs Géographiques

### `location:`
**Description**: Contenu géolocalisé  
**Syntaxe**: `location:"lieu"`  
**Exemple**: `location:"Paris, France"`  
**Usage**: Recherche géographique

### `NEAR:`
**Description**: Mots proches l'un de l'autre  
**Syntaxe**: `mot1 NEAR:distance mot2`  
**Exemple**: `python NEAR:5 tutorial`  
**Usage**: Proximité des termes dans le texte

---

## 📱 Opérateurs de Réseaux Sociaux

### `source:`
**Description**: Source spécifique (Google News)  
**Syntaxe**: `source:nom`  
**Exemple**: `source:reuters`  
**Usage**: Filtre par source d'actualité

### `blogurl:`
**Description**: URL de blog spécifique  
**Syntaxe**: `blogurl:domaine.com`  
**Exemple**: `blogurl:medium.com`  
**Usage**: Recherche dans des blogs

---

## 📁 Opérateurs de Fichiers et Documents

### `group:`
**Description**: Groupe de discussion spécifique  
**Syntaxe**: `group:nom.groupe`  
**Exemple**: `group:comp.lang.python`  
**Usage**: Recherche dans les newsgroups

### `msgid:`
**Description**: ID de message spécifique  
**Syntaxe**: `msgid:identifiant`  
**Exemple**: `msgid:123456789`  
**Usage**: Message spécifique dans les groupes

---

## 🔒 Opérateurs de Sécurité et Audit

⚠️ **Attention**: Ces opérateurs sont destinés aux professionnels de la sécurité pour des audits légitimes.

### Répertoires Exposés
**Syntaxe**: `intext:"index of"`  
**Exemple**: `intext:"index of" "parent directory"`  
**Usage**: Détection de répertoires web exposés

### Pages d'Administration
**Syntaxe**: `inurl:admin`  
**Exemple**: `inurl:admin intitle:login`  
**Usage**: Identification des interfaces d'admin

### Fichiers de Configuration
**Syntaxe**: `filetype:conf`  
**Exemple**: `filetype:conf inurl:firewall`  
**Usage**: Fichiers de config exposés

### Pages de Connexion
**Syntaxe**: `intitle:login`  
**Exemple**: `intitle:login inurl:admin`  
**Usage**: Interfaces de connexion

### Fichiers de Base de Données
**Syntaxe**: `filetype:sql`  
**Exemple**: `filetype:sql "insert into"`  
**Usage**: Dumps de bases de données

### Fichiers de Sauvegarde
**Syntaxe**: `filetype:bak`  
**Exemple**: `filetype:bak inurl:backup`  
**Usage**: Fichiers de backup exposés

### Mots de Passe Exposés
**Syntaxe**: `intext:password`  
**Exemple**: `intext:password filetype:txt`  
**Usage**: Recherche de credentials

### Fichiers d'Environnement
**Syntaxe**: `filetype:env`  
**Exemple**: `filetype:env "API_KEY"`  
**Usage**: Variables d'environnement exposées

### Clés API Exposées
**Syntaxe**: `intext:"api key"`  
**Exemple**: `intext:"api key" filetype:json`  
**Usage**: Clés d'API en clair

### Dépôts Git Exposés
**Syntaxe**: `inurl:.git`  
**Exemple**: `inurl:.git intitle:"index of"`  
**Usage**: Dépôts Git accessibles

### Pages d'Erreur
**Syntaxe**: `intext:error`  
**Exemple**: `intext:"fatal error" intext:"stack trace"`  
**Usage**: Pages révélant des informations

---

## 🎯 Templates de Requêtes Prédéfinies

### Recherche Académique
```
site:scholar.google.com OR site:arxiv.org OR site:researchgate.net OR site:ieee.org "{query}" filetype:pdf
```

### Code Source
```
site:github.com OR site:gitlab.com OR site:bitbucket.org "{query}" filetype:py OR filetype:js OR filetype:ts OR filetype:java
```

### Documentation
```
intitle:"documentation" OR intitle:"guide" OR intitle:"manual" OR intitle:"tutorial" "{query}" filetype:pdf OR filetype:doc
```

### Audit Sécurité
```
intext:"index of /" OR inurl:admin OR intitle:login OR filetype:conf "{query}" -inurl:jsp -inurl:php
```

### Articles de Presse
```
site:bbc.com OR site:cnn.com OR site:reuters.com OR site:lemonde.fr "{query}" after:2023-01-01
```

### Réseaux Sociaux
```
site:twitter.com OR site:facebook.com OR site:linkedin.com OR site:reddit.com "{query}"
```

### Fichiers Partagés
```
site:drive.google.com OR site:dropbox.com OR site:mega.nz "{query}" filetype:zip OR filetype:rar OR filetype:pdf
```

### Bases de Données
```
filetype:sql OR filetype:db OR filetype:mdb "{query}" intext:"insert into" OR intext:"create table"
```

### Fichiers de Configuration
```
filetype:conf OR filetype:config OR filetype:ini OR filetype:env "{query}" intext:"password" OR intext:"api_key"
```

### Sauvegardes
```
filetype:bak OR filetype:backup OR filetype:old OR filetype:tmp "{query}" inurl:backup OR intext:"backup"
```

### Logs d'Erreurs
```
filetype:log OR filetype:txt "{query}" intext:"error" OR intext:"exception" OR intext:"stack trace"
```

### Contenu Éducatif
```
site:coursera.org OR site:edx.org OR site:khan.academy.org OR site:mit.edu "{query}" intitle:"course" OR intitle:"tutorial"
```

### Recherche Scientifique
```
site:pubmed.ncbi.nlm.nih.gov OR site:nature.com OR site:science.org "{query}" intitle:"research" OR intitle:"study"
```

### Forums et Discussions
```
site:stackoverflow.com OR site:reddit.com OR site:quora.com "{query}" intext:"question" OR intext:"answer"
```

### CVE et Vulnérabilités
```
site:cve.mitre.org OR site:nvd.nist.gov "{query}" intext:"CVE-" OR intext:"vulnerability"
```

### Brevets
```
site:patents.google.com OR site:uspto.gov "{query}" intitle:"patent" OR filetype:pdf
```

---

## 💡 Conseils d'Utilisation

### Combinaisons Efficaces
- Utilisez `OR` pour élargir la recherche
- Utilisez `AND` (implicite) pour affiner
- Utilisez `-` pour exclure des termes
- Combinez plusieurs opérateurs pour plus de précision

### Bonnes Pratiques
1. **Guillemets**: Utilisez des guillemets pour les phrases exactes
2. **Exclusions**: Utilisez `-` pour éliminer le bruit
3. **Plages temporelles**: Combinez `after:` et `before:` pour des périodes
4. **Types de fichiers**: Spécifiez les extensions pour des résultats ciblés

### Exemples Avancés
```
# Recherche de vulnérabilités récentes
site:cve.mitre.org "remote code execution" after:2023-01-01 -"proof of concept"

# Documentation technique récente
intitle:"API documentation" filetype:pdf after:2022-01-01 -"deprecated"

# Code source avec exemples
site:github.com "machine learning" filetype:py intext:"example" -"fork"

# Articles académiques spécialisés
site:scholar.google.com "deep learning" filetype:pdf after:2020-01-01 intext:"neural network"
```

---

## ⚖️ Considérations Légales et Éthiques

- **Usage Responsable**: Utilisez ces opérateurs de manière éthique et légale
- **Respect de la Vie Privée**: Ne cherchez pas d'informations personnelles
- **Autorisation**: Obtenez les permissions nécessaires pour les audits de sécurité
- **Conformité**: Respectez les conditions d'utilisation des sites web

---

## 🔄 Mise à Jour

Ce guide est régulièrement mis à jour pour inclure les nouveaux opérateurs et améliorer les techniques de recherche. Pour les dernières nouveautés, consultez la documentation officielle de Deep Search.

---

*Développé avec ❤️ pour la communauté des chercheurs et professionnels de la sécurité*