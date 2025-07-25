import { useState, useCallback } from "react";
import { Search, Sparkles, Settings, Code2, Brain, History, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { UnifiedSearch } from "./unified-search";
import { GoogleDorkBuilder } from "./google-dork-builder";
import { GoogleDorkAI } from "./google-dork-ai";
import { EnhancedSearchHistory } from "./enhanced-search-history";
import { SmartSearchSuggestions } from "./smart-search-suggestions";
import { SavedSearches } from "./saved-searches";
import { CollapsiblePanel } from "./collapsible-panel";

interface EnhancedSearchInterfaceProps {
  onSearch: (query: string) => void;
  onAddToHistory: (query: string) => void;
  searchHistory: any[];
  onLoadFromHistory: (historyItem: any) => void;
  onExportHistory: () => void;
  onClearHistory: () => void;
  onUpdateHistory: (updatedHistory: any[]) => void;
  onApplyShortcut: (shortcut: any) => void;
}

export function EnhancedSearchInterface({
  onSearch,
  onAddToHistory,
  searchHistory,
  onLoadFromHistory,
  onExportHistory,
  onClearHistory,
  onUpdateHistory,
  onApplyShortcut
}: EnhancedSearchInterfaceProps) {
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
          Enhanced Search Interface
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explore all search possibilities with our specialized tools
        </motion.p>
      </div>

      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
        <CardContent className="p-8 space-y-6">
          <UnifiedSearch 
            onSearch={onSearch}
            onAddToHistory={onAddToHistory}
          />
          <CollapsiblePanel title="AI Google Dork Translator" icon={Brain}>
            <GoogleDorkAI onQueryGenerated={onSearch} />
          </CollapsiblePanel>
          <CollapsiblePanel title="Google Dork Builder" icon={Code2}>
            <GoogleDorkBuilder onQueryGenerated={onSearch} />
          </CollapsiblePanel>
          <CollapsiblePanel title="Search History" icon={History}>
            <EnhancedSearchHistory
              searchHistory={searchHistory}
              onLoadFromHistory={onLoadFromHistory}
              onExportHistory={onExportHistory}
              onClearHistory={onClearHistory}
              onUpdateHistory={onUpdateHistory}
            />
          </CollapsiblePanel>
          <CollapsiblePanel title="Smart Suggestions" icon={Star}>
            <SmartSearchSuggestions onApplyShortcut={onApplyShortcut} />
          </CollapsiblePanel>
          <CollapsiblePanel title="Saved Searches" icon={Star}>
            <SavedSearches onApplySearch={onSearch} />
          </CollapsiblePanel>
        </CardContent>
      </Card>
    </motion.div>
  );
}
