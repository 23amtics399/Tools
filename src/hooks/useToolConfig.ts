import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getToolBySlug, getToolById, TOOLS } from '../config/tools';

export function useToolConfig(identifier?: string, isSlug = false) {
  const location = useLocation();

  return useMemo(() => {
    if (identifier) {
      return isSlug ? getToolBySlug(identifier) : getToolById(identifier);
    }
    // Match by exact path to correctly distinguish tools with the same slug in different categories
    return TOOLS.find(tool => tool.path === location.pathname);
  }, [identifier, isSlug, location.pathname]);
}
