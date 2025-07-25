# Search Page Improvements

This document outlines the planned improvements for the search page.

## 1. Enhanced Search Interface (`enhanced-search-interface.tsx`)

- **Simplified Layout:** The tabbed interface will be replaced with a more intuitive, unified layout. The "simple" and "advanced" modes will be merged into a single, streamlined search experience.
- **Collapsible Sections:** The "builder," "history," and "suggestions" sections will be converted into collapsible panels, allowing users to focus on the tools they need.
- **Saved Searches:** A new feature will be added to allow users to save their favorite search queries for quick access.

## 2. Google Dork AI (`google-dork-ai.tsx`)

- **External AI Integration:** The local, rule-based AI will be replaced with a call to an external, large language model for more accurate and context-aware translations of natural language queries into Google Dorks.
- **Real-time Suggestions:** The AI will provide real-time suggestions as the user types, improving the user experience.

## 3. Google Dork Builder (`google-dork-builder.tsx`)

- **Operator Filtering:** A search filter will be added to the operator list, making it easier for users to find the right operator.
- **Collapsible Operator Categories:** The operator categories will be made collapsible, reducing the visual clutter of the interface.

## 4. New Components

- **`saved-searches.tsx`:** A new component will be created to manage saved searches.
- **`collapsible-panel.tsx`:** A reusable collapsible panel component will be created to simplify the layout of the search interface.

By implementing these improvements, we aim to create a more user-friendly, powerful, and efficient search experience.