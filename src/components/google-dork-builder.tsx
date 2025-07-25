import { useState, useMemo, useCallback } from "react";
import { Code2, Copy, RefreshCw, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";
import { CollapsiblePanel } from "./collapsible-panel";

// (The GOOGLE_DORK_OPERATORS and QUERY_TEMPLATES constants remain the same)

interface DorkOperator {
  name: string;
  syntax: string;
  description: string;
  example: string;
  category: 'basic' | 'advanced' | 'file' | 'content' | 'time' | 'academic' | 'development' | 'social' | 'news' | 'education';
  requiresValue: boolean;
}

const GOOGLE_DORK_OPERATORS: DorkOperator[] = [
  // Basic Search Operators
  { name: 'Site', syntax: 'site:', description: 'Recherche sur un site spécifique', example: 'site:github.com', category: 'basic', requiresValue: true },
  { name: 'Filetype', syntax: 'filetype:', description: 'Recherche par type de fichier', example: 'filetype:pdf', category: 'file', requiresValue: true },
  { name: 'Ext', syntax: 'ext:', description: 'Extension de fichier (alias filetype)', example: 'ext:docx', category: 'file', requiresValue: true },
  { name: 'Intext', syntax: 'intext:', description: 'Texte dans le contenu de la page', example: 'intext:"configuration"', category: 'content', requiresValue: true },
  { name: 'Intitle', syntax: 'intitle:', description: 'Mot dans le titre de la page', example: 'intitle:"admin panel"', category: 'content', requiresValue: true },
  { name: 'Inurl', syntax: 'inurl:', description: 'Mot dans l\'URL de la page', example: 'inurl:login', category: 'content', requiresValue: true },
  
  // Advanced Content Operators
  { name: 'Allintext', syntax: 'allintext:', description: 'Tous les mots dans le contenu', example: 'allintext:"python machine learning"', category: 'advanced', requiresValue: true },
  { name: 'Allintitle', syntax: 'allintitle:', description: 'Tous les mots dans le titre', example: 'allintitle:"data science tutorial"', category: 'advanced', requiresValue: true },
  { name: 'Allinurl', syntax: 'allinurl:', description: 'Tous les mots dans l\'URL', example: 'allinurl:"admin config"', category: 'advanced', requiresValue: true },
  { name: 'Inanchor', syntax: 'inanchor:', description: 'Texte dans les liens pointant vers la page', example: 'inanchor:"download here"', category: 'advanced', requiresValue: true },
  { name: 'Allinanchor', syntax: 'allinanchor:', description: 'Tous les mots dans les liens', example: 'allinanchor:"free download pdf"', category: 'advanced', requiresValue: true },
  
  // Link and Relationship Operators
  { name: 'Link', syntax: 'link:', description: 'Pages avec liens vers cette URL', example: 'link:example.com', category: 'advanced', requiresValue: true },
  { name: 'Related', syntax: 'related:', description: 'Sites similaires ou liés', example: 'related:stackoverflow.com', category: 'advanced', requiresValue: true },
  { name: 'Cache', syntax: 'cache:', description: 'Version en cache de Google', example: 'cache:example.com', category: 'advanced', requiresValue: true },
  { name: 'Info', syntax: 'info:', description: 'Informations sur une URL', example: 'info:github.com', category: 'advanced', requiresValue: true },
  
  // Time-based Operators
  { name: 'Before', syntax: 'before:', description: 'Contenu publié avant cette date', example: 'before:2023-01-01', category: 'time', requiresValue: true },
  { name: 'After', syntax: 'after:', description: 'Contenu publié après cette date', example: 'after:2022-01-01', category: 'time', requiresValue: true },
  { name: 'Daterange', syntax: 'daterange:', description: 'Plage de dates (format Julian)', example: 'daterange:2451545-2451910', category: 'time', requiresValue: true },
  
  // Numeric and Range Operators
  { name: 'Numrange', syntax: 'numrange:', description: 'Plage de nombres', example: 'numrange:100-500', category: 'advanced', requiresValue: true },
  { name: 'Price', syntax: '$', description: 'Recherche de prix', example: '$100..$500', category: 'advanced', requiresValue: true },
  
  // Geographic Operators
  { name: 'Location', syntax: 'location:', description: 'Contenu géolocalisé', example: 'location:"Paris, France"', category: 'advanced', requiresValue: true },
  { name: 'Near', syntax: 'NEAR:', description: 'Mots proches l\'un de l\'autre', example: 'python NEAR:5 tutorial', category: 'advanced', requiresValue: true },
  
  // Social Media Operators
  { name: 'Source', syntax: 'source:', description: 'Source spécifique (Google News)', example: 'source:reuters', category: 'advanced', requiresValue: true },
  { name: 'Blogurl', syntax: 'blogurl:', description: 'URL de blog spécifique', example: 'blogurl:medium.com', category: 'advanced', requiresValue: true },
  
  // File and Document Operators
  { name: 'Insubject', syntax: 'insubject:', description: 'Dans le sujet (groupes)', example: 'insubject:"python help"', category: 'content', requiresValue: true },
  { name: 'Group', syntax: 'group:', description: 'Groupe de discussion spécifique', example: 'group:comp.lang.python', category: 'advanced', requiresValue: true },
  { name: 'Msgid', syntax: 'msgid:', description: 'ID de message spécifique', example: 'msgid:123456789', category: 'advanced', requiresValue: true },
  
  // Special Search Operators
  { name: 'Define', syntax: 'define:', description: 'Définition d\'un terme', example: 'define:machine learning', category: 'basic', requiresValue: true },
  { name: 'Stocks', syntax: 'stocks:', description: 'Informations boursières', example: 'stocks:AAPL', category: 'basic', requiresValue: true },
  { name: 'Weather', syntax: 'weather:', description: 'Météo d\'un lieu', example: 'weather:Paris', category: 'basic', requiresValue: true },
  { name: 'Map', syntax: 'map:', description: 'Carte d\'un lieu', example: 'map:Eiffel Tower', category: 'basic', requiresValue: true },
  { name: 'Movie', syntax: 'movie:', description: 'Informations sur un film', example: 'movie:Inception', category: 'basic', requiresValue: true },
  
  // Security and Penetration Testing Operators
  { name: 'Intext Index', syntax: 'intext:"index of"', description: 'Répertoires exposés', example: 'intext:"index of" "parent directory"', category: 'content', requiresValue: false },
  { name: 'Inurl Admin', syntax: 'inurl:admin', description: 'Pages d\'administration', example: 'inurl:admin intitle:login', category: 'content', requiresValue: false },
  { name: 'Filetype Config', syntax: 'filetype:conf', description: 'Fichiers de configuration', example: 'filetype:conf inurl:firewall', category: 'file', requiresValue: false },
  { name: 'Intitle Login', syntax: 'intitle:login', description: 'Pages de connexion', example: 'intitle:login inurl:admin', category: 'content', requiresValue: false },
  
  // Database and Backup Operators
  { name: 'Filetype SQL', syntax: 'filetype:sql', description: 'Fichiers de base de données', example: 'filetype:sql "insert into"', category: 'file', requiresValue: false },
  { name: 'Filetype Bak', syntax: 'filetype:bak', description: 'Fichiers de sauvegarde', example: 'filetype:bak inurl:backup', category: 'file', requiresValue: false },
  { name: 'Intext Password', syntax: 'intext:password', description: 'Contenu avec mots de passe', example: 'intext:password filetype:txt', category: 'content', requiresValue: false },
  
  // Development and Code Operators
  { name: 'Filetype Env', syntax: 'filetype:env', description: 'Fichiers d\'environnement', example: 'filetype:env "API_KEY"', category: 'file', requiresValue: false },
  { name: 'Intext API Key', syntax: 'intext:"api key"', description: 'Clés API exposées', example: 'intext:"api key" filetype:json', category: 'content', requiresValue: false },
  { name: 'Inurl Git', syntax: 'inurl:.git', description: 'Dépôts Git exposés', example: 'inurl:.git intitle:"index of"', category: 'content', requiresValue: false },
  
  // Error and Debug Operators
  { name: 'Intext Error', syntax: 'intext:error', description: 'Pages d\'erreur', example: 'intext:"fatal error" intext:"stack trace"', category: 'content', requiresValue: false },
  { name: 'Intext Warning', syntax: 'intext:warning', description: 'Avertissements système', example: 'intext:warning intext:"deprecated"', category: 'content', requiresValue: false },
  { name: 'Intitle Exception', syntax: 'intitle:exception', description: 'Pages d\'exception', example: 'intitle:exception intext:"stack trace"', category: 'content', requiresValue: false },
  
  // Advanced Academic and Research Operators
  { name: 'Scholar', syntax: 'site:scholar.google.com', description: 'Recherche académique Google Scholar', example: 'site:scholar.google.com "machine learning"', category: 'academic', requiresValue: false },
  { name: 'ArXiv', syntax: 'site:arxiv.org', description: 'Prépublications scientifiques', example: 'site:arxiv.org "neural networks"', category: 'academic', requiresValue: false },
  { name: 'PubMed', syntax: 'site:pubmed.ncbi.nlm.nih.gov', description: 'Littérature biomédicale', example: 'site:pubmed.ncbi.nlm.nih.gov "covid-19"', category: 'academic', requiresValue: false },
  { name: 'IEEE', syntax: 'site:ieee.org', description: 'Publications IEEE', example: 'site:ieee.org "artificial intelligence"', category: 'academic', requiresValue: false },
  
  // Advanced Development Operators
  { name: 'GitHub Code', syntax: 'site:github.com', description: 'Code source GitHub', example: 'site:github.com "function" filetype:py', category: 'development', requiresValue: false },
  { name: 'Stack Overflow', syntax: 'site:stackoverflow.com', description: 'Questions et réponses', example: 'site:stackoverflow.com "python error"', category: 'development', requiresValue: false },
  { name: 'Documentation', syntax: 'inurl:docs', description: 'Pages de documentation', example: 'inurl:docs "API reference"', category: 'development', requiresValue: false },
  
  // Social Media and Communication Operators
  { name: 'Twitter', syntax: 'site:twitter.com', description: 'Tweets et discussions', example: 'site:twitter.com "breaking news"', category: 'social', requiresValue: false },
  { name: 'Reddit', syntax: 'site:reddit.com', description: 'Discussions Reddit', example: 'site:reddit.com "AMA" intitle:"I am"', category: 'social', requiresValue: false },
  { name: 'LinkedIn', syntax: 'site:linkedin.com', description: 'Profils et posts LinkedIn', example: 'site:linkedin.com "data scientist"', category: 'social', requiresValue: false },
  
  // News and Media Operators
  { name: 'News Sites', syntax: 'site:bbc.com OR site:cnn.com OR site:reuters.com', description: 'Sites d\'actualités majeurs', example: '(site:bbc.com OR site:cnn.com) "breaking news"', category: 'news', requiresValue: false },
  { name: 'French News', syntax: 'site:lemonde.fr OR site:lefigaro.fr', description: 'Presse française', example: '(site:lemonde.fr OR site:lefigaro.fr) "politique"', category: 'news', requiresValue: false },
  
  // E-learning and Education Operators
  { name: 'Coursera', syntax: 'site:coursera.org', description: 'Cours en ligne Coursera', example: 'site:coursera.org "machine learning"', category: 'education', requiresValue: false },
  { name: 'Khan Academy', syntax: 'site:khanacademy.org', description: 'Ressources Khan Academy', example: 'site:khanacademy.org "mathematics"', category: 'education', requiresValue: false },
  { name: 'MIT OpenCourseWare', syntax: 'site:ocw.mit.edu', description: 'Cours MIT gratuits', example: 'site:ocw.mit.edu "computer science"', category: 'education', requiresValue: false },
];
const QUERY_TEMPLATES = {
  academic: {
    name: 'Recherche académique',
    template: 'site:scholar.google.com OR site:arxiv.org OR site:researchgate.net OR site:ieee.org "{query}" filetype:pdf',
    description: 'Recherche d\'articles scientifiques et académiques'
  },
  code: {
    name: 'Code source',
    template: 'site:github.com OR site:gitlab.com OR site:bitbucket.org "{query}" filetype:py OR filetype:js OR filetype:ts OR filetype:java',
    description: 'Recherche de code source et projets'
  },
  documentation: {
    name: 'Documentation',
    template: 'intitle:"documentation" OR intitle:"guide" OR intitle:"manual" OR intitle:"tutorial" "{query}" filetype:pdf OR filetype:doc',
    description: 'Guides et documentation technique'
  },
  security: {
    name: 'Audit sécurité',
    template: 'intext:"index of /" OR inurl:admin OR intitle:login OR filetype:conf "{query}" -inurl:jsp -inurl:php',
    description: 'Recherche de vulnérabilités et fichiers sensibles'
  },
  news: {
    name: 'Articles de presse',
    template: 'site:bbc.com OR site:cnn.com OR site:reuters.com OR site:lemonde.fr "{query}" after:2023-01-01',
    description: 'Actualités récentes et articles journalistiques'
  },
  social: {
    name: 'Réseaux sociaux',
    template: 'site:twitter.com OR site:facebook.com OR site:linkedin.com OR site:reddit.com "{query}"',
    description: 'Recherche sur les plateformes sociales'
  },
  files: {
    name: 'Fichiers partagés',
    template: 'site:drive.google.com OR site:dropbox.com OR site:mega.nz "{query}" filetype:zip OR filetype:rar OR filetype:pdf',
    description: 'Recherche de fichiers partagés publiquement'
  },
  databases: {
    name: 'Bases de données',
    template: 'filetype:sql OR filetype:db OR filetype:mdb "{query}" intext:"insert into" OR intext:"create table"',
    description: 'Fichiers de bases de données exposés'
  },
  configs: {
    name: 'Fichiers config',
    template: 'filetype:conf OR filetype:config OR filetype:ini OR filetype:env "{query}" intext:"password" OR intext:"api_key"',
    description: 'Fichiers de configuration et secrets'
  },
  backups: {
    name: 'Sauvegardes',
    template: 'filetype:bak OR filetype:backup OR filetype:old OR filetype:tmp "{query}" inurl:backup OR intext:"backup"',
    description: 'Fichiers de sauvegarde exposés'
  },
  logs: {
    name: 'Fichiers de logs',
    template: 'filetype:log OR filetype:txt "{query}" intext:"error" OR intext:"exception" OR intext:"stack trace"',
    description: 'Logs d\'erreurs et de débogage'
  },
  educational: {
    name: 'Contenu éducatif',
    template: 'site:coursera.org OR site:edx.org OR site:khan.academy.org OR site:mit.edu "{query}" intitle:"course" OR intitle:"tutorial"',
    description: 'Cours et ressources éducatives'
  },
  research: {
    name: 'Recherche scientifique',
    template: 'site:pubmed.ncbi.nlm.nih.gov OR site:nature.com OR site:science.org "{query}" intitle:"research" OR intitle:"study"',
    description: 'Publications et recherches scientifiques'
  },
  forums: {
    name: 'Forums et discussions',
    template: 'site:stackoverflow.com OR site:reddit.com OR site:quora.com "{query}" intext:"question" OR intext:"answer"',
    description: 'Discussions et Q&A techniques'
  },
  vulnerabilities: {
    name: 'CVE et vulnérabilités',
    template: 'site:cve.mitre.org OR site:nvd.nist.gov "{query}" intext:"CVE-" OR intext:"vulnerability"',
    description: 'Base de données de vulnérabilités'
  },
  patents: {
    name: 'Brevets',
    template: 'site:patents.google.com OR site:uspto.gov "{query}" intitle:"patent" OR filetype:pdf',
    description: 'Recherche de brevets et propriété intellectuelle'
  }
};

interface GoogleDorkBuilderProps {
  onQueryGenerated: (query: string) => void;
  initialQuery?: string;
}

export function GoogleDorkBuilder({ onQueryGenerated, initialQuery = "" }: GoogleDorkBuilderProps) {
  const { toast } = useToast();
  const [baseQuery, setBaseQuery] = useState(initialQuery);
  const [selectedOperators, setSelectedOperators] = useState<Array<{operator: DorkOperator, value: string}>>([]);
  const [excludeTerms, setExcludeTerms] = useState<string[]>([]);
  const [includeTerms, setIncludeTerms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const generatedQuery = useMemo(() => {
    let query = baseQuery.trim();
    if (includeTerms.length > 0) {
      query += ` ${includeTerms.map(term => `"${term}"`).join(" " )}`;
    }
    if (excludeTerms.length > 0) {
      query += ` ${excludeTerms.map(term => `-"${term}"`).join(" " )}`;
    }
    selectedOperators.forEach(({ operator, value }) => {
      if (value.trim()) {
        query += ` ${operator.syntax}${value.trim()}`;
      }
    });
    return query.trim();
  }, [baseQuery, selectedOperators, excludeTerms, includeTerms]);

  const addOperator = useCallback((operator: DorkOperator) => {
    setSelectedOperators(prev => [...prev, { operator, value: '' }]);
  }, []);

  const removeOperator = useCallback((index: number) => {
    setSelectedOperators(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateOperatorValue = useCallback((index: number, value: string) => {
    setSelectedOperators(prev => prev.map((item, i) => (i === index ? { ...item, value } : item)));
  }, []);

  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(generatedQuery);
    toast({ title: "Query copied to clipboard!" });
  }, [generatedQuery, toast]);

  const resetBuilder = useCallback(() => {
    setBaseQuery("");
    setSelectedOperators([]);
    setExcludeTerms([]);
    setIncludeTerms([]);
    setSearchTerm("");
  }, []);

  const filteredOperators = useMemo(() => {
    return GOOGLE_DORK_OPERATORS.filter(op => op.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const operatorsByCategory = useMemo(() => {
    return filteredOperators.reduce((acc, operator) => {
      if (!acc[operator.category]) {
        acc[operator.category] = [];
      }
      acc[operator.category].push(operator);
      return acc;
    }, {} as Record<string, DorkOperator[]>);
  }, [filteredOperators]);

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Google Dork Builder</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="base-query">Base Query</Label>
        <Input
          id="base-query"
          placeholder="Enter your main keywords..."
          value={baseQuery}
          onChange={(e) => setBaseQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Operators</Label>
        <Input
          placeholder="Search for an operator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-y-2">
          {Object.entries(operatorsByCategory).map(([category, operators]) => (
            <CollapsiblePanel key={category} title={category} icon={Code2}>
              <div className="flex flex-wrap gap-1">
                {operators.map((operator) => (
                  <Button
                    key={operator.syntax}
                    variant="outline"
                    size="sm"
                    onClick={() => addOperator(operator)}
                    className="text-xs h-7"
                    title={operator.description}
                  >
                    {operator.name}
                  </Button>
                ))}
              </div>
            </CollapsiblePanel>
          ))}
        </div>
      </div>

      {selectedOperators.length > 0 && (
        <div className="space-y-3">
          <Label>Configured Operators</Label>
          <div className="space-y-2">
            {selectedOperators.map(({ operator, value }, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="secondary">{operator.syntax}</Badge>
                <Input
                  placeholder={operator.example}
                  value={value}
                  onChange={(e) => updateOperatorValue(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOperator(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Generated Query</Label>
        <Textarea
          value={generatedQuery}
          readOnly
          className="min-h-[80px] font-mono text-sm"
          placeholder="Your Google Dork query will appear here..."
        />
        <div className="flex gap-2">
          <Button onClick={() => onQueryGenerated(generatedQuery)} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={copyQuery} className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="destructive" onClick={resetBuilder} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
