import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsiblePanelProps {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
  isOpen?: boolean;
}

export function CollapsiblePanel({ title, icon: Icon, children, isOpen: defaultOpen = false }: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-semibold text-md sm:text-lg"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="text-left">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-4 pt-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
