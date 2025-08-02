import { motion } from "framer-motion";
import { AlertTriangle, Settings, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useSettingApi } from "../contexts/settingApi";

interface ApiConfigNotificationProps {
  onOpenSettings?: () => void;
  className?: string;
}

export function ApiConfigNotification({
  onOpenSettings,
  className = ""
}: ApiConfigNotificationProps) {
  const { configured, isLoading } = useSettingApi();

  // Don't show notification if API is configured or still loading
  if (configured || isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/80 via-yellow-50/60 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-semibold text-amber-800 dark:text-amber-200">
                  Configuration requise
                </h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-200/50 dark:bg-amber-800/30 rounded-full">
                  <Zap className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    IA
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-amber-700 dark:text-amber-300 leading-relaxed">
                Pour utiliser la fonctionnalité de recherche intelligente, vous devez configurer votre clé API IA.
                <span className="hidden sm:inline">
                  {" "}Cela permettra au système de traduire vos requêtes en recherches Google Dorks optimisées.
                </span>
              </p>

              {/* Mobile-friendly additional info */}
              <div className="sm:hidden">
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Configurez votre API pour débloquer la recherche IA
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Button
                onClick={onOpenSettings}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
                size="lg"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Configurer</span>
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
              <span>Étape 1/1: Configuration de l'API</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>En attente</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ApiConfigNotification;
