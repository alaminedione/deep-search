import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Search, 
  Zap, 
  Target,
  ArrowRight,
  Sparkles,
  Play
} from "lucide-react";

interface HeroSectionProps {
  onStartSearch: () => void;
}

export function HeroSection({ onStartSearch }: HeroSectionProps) {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <Sparkles className="h-4 w-4" />
          Recherche avancée nouvelle génération
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Deep Search
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Maîtrisez l'art de la recherche web avec les{" "}
          <span className="text-primary font-semibold">Google Dorks</span> et l'
          <span className="text-primary font-semibold">intelligence artificielle</span>.
          Trouvez exactement ce que vous cherchez.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button 
            size="lg" 
            onClick={onStartSearch}
            className="px-8 py-6 text-lg font-semibold group"
          >
            <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Commencer à rechercher
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
          >
            <Play className="h-5 w-5 mr-2" />
            Voir la démo
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <Card className="border-2 hover:border-primary/20 transition-colors h-full">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 w-fit mb-3">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-lg break-words">Recherche Précise</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="break-words text-wrap">
                Utilisez les opérateurs avancés pour des résultats ultra-ciblés
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors h-full">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 w-fit mb-3">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="text-lg break-words">IA Intégrée</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="break-words text-wrap">
                Suggestions intelligentes pour optimiser vos recherches
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors h-full">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 w-fit mb-3">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-lg break-words">Interface Intuitive</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="break-words text-wrap">
                Simplicité et puissance réunies dans une interface moderne
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}