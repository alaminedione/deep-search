import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { 
  Search, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface HeroSectionProps {
  onStartSearch: () => void;
}

export function HeroSection({ onStartSearch }: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24">
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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 dark:border-blue-800/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8"
        >
          <Sparkles className="h-4 w-4" />
          Recherche avancée nouvelle génération
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Deep Search
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Maîtrisez l'art de la recherche web avec les{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Google Dorks</span> et l'
          <span className="text-purple-600 dark:text-purple-400 font-semibold">intelligence artificielle</span>.
          <br />
          Trouvez exactement ce que vous cherchez.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <Button 
            size="lg" 
            onClick={onStartSearch}
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Commencer à rechercher
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            "Opérateurs avancés",
            "IA intégrée", 
            "Interface moderne",
            "Historique intelligent"
          ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}