import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  FileText, 
  Image, 
  Video, 
  Code, 
  BookOpen, 
  Newspaper,
  Lightbulb,
  Zap
} from 'lucide-react';

interface QuickStartGuideProps {
  onApplyExample: (example: any) => void;
}

export const QuickStartGuide = ({ onApplyExample }: QuickStartGuideProps) => {
  const searchExamples = [
    {
      title: "Recherche de documents PDF",
      description: "Trouvez des documents PDF sur un sujet spécifique",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      example: {
        searchText: "intelligence artificielle",
        tags: {
          fileTypes: ["pdf"],
          sites: ["edu", "org"]
        }
      }
    },
    {
      title: "Images haute résolution",
      description: "Recherchez des images de qualité professionnelle",
      icon: Image,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      example: {
        searchText: "paysage montagne",
        tags: {
          fileTypes: ["jpg", "png"],
          wordsInTitle: ["HD", "4K", "high resolution"]
        }
      }
    },
    {
      title: "Tutoriels vidéo",
      description: "Trouvez des tutoriels vidéo détaillés",
      icon: Video,
      color: "text-green-600",
      bgColor: "bg-green-50",
      example: {
        searchText: "programmation Python",
        tags: {
          sites: ["youtube.com", "vimeo.com"],
          wordsInTitle: ["tutorial", "guide", "cours"]
        }
      }
    },
    {
      title: "Code source",
      description: "Recherchez du code source et des exemples",
      icon: Code,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      example: {
        searchText: "React hooks",
        tags: {
          sites: ["github.com", "stackoverflow.com"],
          fileTypes: ["js", "jsx", "ts", "tsx"]
        }
      }
    },
    {
      title: "Articles académiques",
      description: "Trouvez des publications scientifiques",
      icon: BookOpen,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      example: {
        searchText: "machine learning",
        tags: {
          sites: ["scholar.google.com", "arxiv.org", "researchgate.net"],
          fileTypes: ["pdf"],
          wordsInTitle: ["research", "study", "analysis"]
        }
      }
    },
    {
      title: "Actualités récentes",
      description: "Recherchez les dernières nouvelles",
      icon: Newspaper,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      example: {
        searchText: "technologie 2024",
        tags: {
          sites: ["news.google.com", "lemonde.fr", "figaro.fr"],
          wordsInUrl: ["news", "actualite", "article"]
        }
      }
    }
  ];

  const tips = [
    {
      icon: Lightbulb,
      title: "Utilisez les guillemets",
      description: "Pour rechercher une phrase exacte, entourez-la de guillemets"
    },
    {
      icon: Zap,
      title: "Combinez les opérateurs",
      description: "Mélangez sites, types de fichiers et mots-clés pour des résultats précis"
    },
    {
      icon: Search,
      title: "Explorez l'historique",
      description: "Vos recherches précédentes peuvent vous donner des idées pour de nouvelles requêtes"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold">Bienvenue dans Deep Search</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Maîtrisez l'art de la recherche avancée avec nos outils intelligents et nos raccourcis prédéfinis.
          Trouvez exactement ce que vous cherchez en quelques clics.
        </p>
      </motion.div>

      {/* Quick Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">Exemples de recherche populaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchExamples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => onApplyExample(example.example)}>
                <CardHeader className="pb-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${example.bgColor} mb-3 group-hover:scale-110 transition-transform`}>
                    <example.icon className={`h-6 w-6 ${example.color}`} />
                  </div>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {example.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Exemple:</div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {example.example.searchText}
                      </Badge>
                      {example.example.tags.fileTypes?.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          .{type}
                        </Badge>
                      ))}
                      {example.example.tags.sites?.slice(0, 2).map(site => (
                        <Badge key={site} variant="outline" className="text-xs">
                          {site}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-center">Conseils pour une recherche efficace</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip) => (
            <Card key={tip.title} className="text-center">
              <CardContent className="pt-6">
                <tip.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};