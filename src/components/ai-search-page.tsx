import { History } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { AiTranslator } from "./ai-translator";
import { SearchHistory as SearchHistoryComponent } from "./search-history";
import { CollapsiblePanel } from "./collapsible-panel";
import { SearchHistory } from "@/types";

interface AiSearchPageProps {
  onSearch: (query: string) => void;
  
  searchHistory: SearchHistory[];
  onLoadFromHistory: (historyItem: SearchHistory) => void;
  onExportHistory: () => void;
  onClearHistory: () => void;
  onUpdateHistory: (updatedHistory: SearchHistory[]) => void;
  queryToLoad?: string;
}

export function AiSearchPage({
  onSearch,
  
  searchHistory,
  onLoadFromHistory,
  onExportHistory,
  onClearHistory,
  onUpdateHistory,
  queryToLoad,
}: AiSearchPageProps) {
  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center space-y-3">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          AI-Powered Search
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Describe what you're looking for, and let the AI do the rest.
        </motion.p>
      </div>

      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
        <CardContent className="p-8 space-y-6">
          <AiTranslator onQueryGenerated={onSearch} initialQuery={queryToLoad} />
          <CollapsiblePanel title="Search History" icon={History}>
            <SearchHistoryComponent
              searchHistory={searchHistory}
              onLoadFromHistory={onLoadFromHistory}
              onExportHistory={onExportHistory}
              onClearHistory={onClearHistory}
              onUpdateHistory={onUpdateHistory}
            />
          </CollapsiblePanel>
        </CardContent>
      </Card>
    </motion.div>
  );
}
