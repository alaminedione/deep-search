import { useState, useCallback } from "react";
import { Star, Trash2, Edit, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "../hooks/use-toast";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
}

interface SavedSearchesProps {
  onApplySearch: (query: string) => void;
}

export function SavedSearches({ onApplySearch }: SavedSearchesProps) {
  const { toast } = useToast();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState("");
  const [newSearchQuery, setNewSearchQuery] = useState("");

  const addSearch = useCallback(() => {
    if (newSearchName.trim() && newSearchQuery.trim()) {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: newSearchName,
        query: newSearchQuery,
      };
      setSavedSearches(prev => [...prev, newSearch]);
      setNewSearchName("");
      setNewSearchQuery("");
      toast({ title: "Search saved!" });
    }
  }, [newSearchName, newSearchQuery, toast]);

  const removeSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
    toast({ title: "Search removed!" });
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Saved Searches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Search Name"
            value={newSearchName}
            onChange={e => setNewSearchName(e.target.value)}
          />
          <Input
            placeholder="Search Query"
            value={newSearchQuery}
            onChange={e => setNewSearchQuery(e.target.value)}
          />
          <Button onClick={addSearch} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Search
          </Button>
        </div>
        <div className="space-y-2">
          {savedSearches.map(search => (
            <div key={search.id} className="flex items-center gap-2 p-2 border rounded-lg">
              <div className="flex-1 cursor-pointer" onClick={() => onApplySearch(search.query)}>
                <p className="font-semibold">{search.name}</p>
                <p className="text-sm text-muted-foreground">{search.query}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeSearch(search.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
