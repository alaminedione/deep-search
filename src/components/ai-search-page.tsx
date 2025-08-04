import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { AiTranslator } from "./ai-translator";
import { ApiConfigNotification } from "./api-config-notification";
import { useSettingApi } from "../contexts/settingApi";

interface AiSearchPageProps {
  onSearch: (query: string) => void;
  onOpenSettings?: () => void;
}

export function AiSearchPage({ onSearch, onOpenSettings }: AiSearchPageProps) {
  const { configured } = useSettingApi();

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 container-padding"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4 mobile-text-center">
        <motion.h2
          className="text-responsive-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent text-balance"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Recherche IA Avancée
        </motion.h2>
        {/* <motion.p */}
        {/*   className="text-muted-foreground max-w-3xl mx-auto text-responsive-xl leading-relaxed text-balance" */}
        {/*   initial={{ opacity: 0 }} */}
        {/*   animate={{ opacity: 1 }} */}
        {/*   transition={{ delay: 0.2 }} */}
        {/* > */}
        {/* Décrivez ce que vous cherchez en langage naturel, et laissez l'IA */}
        {/* créer des recherches Google optimisées pour vous. */}
        {/* </motion.p> */}

        {/* Feature badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs sm:text-sm font-medium">
            🚀 Instantané
          </div>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium">
            🎯 Précis
          </div>
          <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium">
            ✨ Intelligent
          </div>
        </motion.div>
      </div>

      {/* API Configuration Notification */}
      <ApiConfigNotification onOpenSettings={onOpenSettings} />

      {/* Main Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card
          className={`
          border-0 shadow-2xl hover-lift transition-all duration-500
          ${configured
              ? "bg-gradient-to-br from-white/95 via-emerald-50/50 to-blue-50/30 dark:from-gray-900/95 dark:via-emerald-950/20 dark:to-blue-950/10 border-emerald-200/30 dark:border-emerald-800/20"
              : "bg-gradient-to-br from-white/90 to-gray-100/60 dark:from-gray-900/90 dark:to-gray-800/60 border-gray-200/50 dark:border-gray-800/50"
            }
          backdrop-blur-md
        `}
        >
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
            <AiTranslator onQueryGenerated={onSearch} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Tips Section */}
      {configured && (
        <motion.div
          className="mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center space-y-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                  💡 Conseils pour de meilleures recherches
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Soyez spécifique dans vos demandes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Mentionnez le type de contenu souhaité</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Précisez la langue si nécessaire</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
