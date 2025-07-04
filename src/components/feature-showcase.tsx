import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Zap, 
  BarChart3, 
  Clock, 
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface FeatureShowcaseProps {
  onStartTour: () => void;
}

const features = [
  {
    id: 1,
    title: "Opérateurs Avancés",
    description: "Maîtrisez les Google Dorks pour des recherches précises",
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    details: "Utilisez site:, filetype:, intitle: et bien plus pour cibler vos recherches"
  },
  {
    id: 2,
    title: "Suggestions IA",
    description: "Obtenez des recommandations intelligentes",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    details: "L'IA analyse vos recherches et propose des améliorations automatiques"
  },
  {
    id: 3,
    title: "Historique Intelligent",
    description: "Retrouvez et réutilisez vos recherches favorites",
    icon: Clock,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    details: "Sauvegardez, catégorisez et exportez votre historique de recherches"
  }
];

export function FeatureShowcase({ onStartTour }: FeatureShowcaseProps) {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-secondary/10 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Star className="h-4 w-4" />
            Fonctionnalités
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Découvrez la puissance de Deep Search
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Des outils avancés pour transformer votre façon de rechercher sur le web
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className={`p-4 rounded-xl ${feature.bgColor} w-fit mb-4`}>
                      <IconComponent className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {feature.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button 
            size="lg" 
            onClick={onStartTour}
            className="px-8 py-6 text-lg font-semibold"
          >
            <Zap className="h-5 w-5 mr-2" />
            Commencer la visite guidée
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}