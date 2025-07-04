import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChevronRight, 
  Search, 
  Target, 
  Filter, 
  History, 
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react';

interface FeatureShowcaseProps {
  onStartTour: () => void;
}

export const FeatureShowcase = ({ onStartTour }: FeatureShowcaseProps) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'search-bar',
      title: 'Barre de recherche intelligente',
      description: 'Suggestions en temps réel, autocomplétion et navigation clavier avancée',
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      details: [
        'Suggestions basées sur l\'historique',
        'Autocomplétion intelligente',
        'Navigation complète au clavier',
        'Prévisualisation des requêtes'
      ],
      demo: 'Tapez votre recherche et voyez les suggestions apparaître instantanément'
    },
    {
      id: 'advanced-search',
      title: 'Recherche avancée',
      description: 'Presets personnalisables, filtres avancés et raccourcis de recherche',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      details: [
        'Presets de recherche prédéfinis',
        'Filtres par type, date et domaine',
        'Raccourcis personnalisables',
        'Opérateurs Google Dorks'
      ],
      demo: 'Créez des recherches complexes en quelques clics avec nos presets'
    },
    {
      id: 'smart-filters',
      title: 'Filtres intelligents',
      description: 'Système de tags avancé pour affiner vos recherches avec précision',
      icon: Filter,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      details: [
        'Tags par sites web',
        'Filtres par type de fichier',
        'Exclusion de mots-clés',
        'Recherche dans titre/URL'
      ],
      demo: 'Combinez différents filtres pour des résultats ultra-précis'
    },
    {
      id: 'search-history',
      title: 'Historique enrichi',
      description: 'Gestion complète de l\'historique avec statistiques et catégorisation',
      icon: History,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      details: [
        'Historique détaillé avec métadonnées',
        'Statistiques de recherche',
        'Catégorisation automatique',
        'Export et sauvegarde'
      ],
      demo: 'Retrouvez et réutilisez facilement vos recherches précédentes'
    },
    {
      id: 'ai-suggestions',
      title: 'Suggestions IA',
      description: 'Intelligence artificielle pour des suggestions de recherche pertinentes',
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      details: [
        'Suggestions basées sur le contexte',
        'Patterns de recherche intelligents',
        'Recommandations personnalisées',
        'Apprentissage adaptatif'
      ],
      demo: 'L\'IA analyse vos habitudes pour vous proposer de meilleures recherches'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold">Fonctionnalités avancées</h2>
        <p className="text-muted-foreground">
          Découvrez tous les outils qui font de Deep Search la solution ultime pour vos recherches
        </p>
        <Button onClick={onStartTour} className="group">
          <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Démarrer la visite guidée
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      {React.createElement(feature.icon, { 
                        className: `h-5 w-5 ${feature.color}` 
                      })}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 transition-transform ${
                        activeFeature === index ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Details */}
        <div className="lg:sticky lg:top-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${features[activeFeature].bgColor}`}>
                      {React.createElement(features[activeFeature].icon, { 
                        className: `h-6 w-6 ${features[activeFeature].color}` 
                      })}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {features[activeFeature].title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {features[activeFeature].description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Demo Description */}
                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      <span className="font-medium">Démo: </span>
                      {features[activeFeature].demo}
                    </p>
                  </div>

                  {/* Feature Details */}
                  <div>
                    <h4 className="font-semibold mb-3">Fonctionnalités clés:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {features[activeFeature].details.map((detail, index) => (
                        <motion.div
                          key={detail}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Disponible
                    </Badge>
                    <Button variant="outline" size="sm">
                      Essayer maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};