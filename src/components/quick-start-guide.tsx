import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Image, 
  Video, 
  ArrowRight,
  Lightbulb
} from "lucide-react";

interface QuickStartGuideProps {
  onApplyExample: (example: any) => void;
}

const quickExamples = [
  {
    id: 1,
    title: "Documents PDF",
    description: "Trouvez des guides et manuels",
    icon: FileText,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    searchText: "guide installation",
    tags: {
      fileTypes: ["pdf"]
    },
    tip: "Parfait pour les manuels techniques et guides officiels"
  },
  {
    id: 2,
    title: "Images HD",
    description: "Recherchez des images haute qualité",
    icon: Image,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    searchText: "wallpaper 4k",
    tags: {
      fileTypes: ["jpg", "png"],
      sites: ["unsplash.com", "pexels.com"]
    },
    tip: "Utilisez des sites spécialisés pour de meilleures images"
  },
  {
    id: 3,
    title: "Tutoriels Vidéo",
    description: "Apprenez avec des vidéos",
    icon: Video,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    searchText: "tutoriel programmation",
    tags: {
      sites: ["youtube.com"],
      wordsInTitle: ["tutorial", "guide", "how to"]
    },
    tip: "Filtrez par durée et qualité pour de meilleurs résultats"
  }
];

export function QuickStartGuide({ onApplyExample }: QuickStartGuideProps) {
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
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Lightbulb className="h-4 w-4" />
            Démarrage rapide
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Exemples de recherches populaires
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Cliquez sur un exemple pour l'appliquer instantanément et découvrir la puissance de Deep Search
          </motion.p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          {quickExamples.map((example, index) => {
            const IconComponent = example.icon;
            return (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20 h-full"
                  onClick={() => onApplyExample(example)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${example.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${example.color}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors break-words">
                      {example.title}
                    </CardTitle>
                    <CardDescription className="text-base break-words text-wrap">
                      {example.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {example.tags.fileTypes && example.tags.fileTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            .{type}
                          </Badge>
                        ))}
                        {example.tags.sites && example.tags.sites.slice(0, 2).map((site) => (
                          <Badge key={site} variant="outline" className="text-xs">
                            {site}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        💡 {example.tip}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 border"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Conseils pour optimiser vos recherches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>Utilisez des guillemets pour rechercher une expression exacte</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>Combinez plusieurs opérateurs pour affiner vos résultats</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>Excluez des termes avec le signe moins (-) pour filtrer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-semibold">•</span>
              <span>Spécifiez des sites fiables pour des informations de qualité</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}