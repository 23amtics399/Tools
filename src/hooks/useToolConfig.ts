import { useMemo } from 'react';
import { getToolBySlug, getToolById } from '../config/tools';

export function useToolConfig(identifier: string, isSlug = true) {
  return useMemo(() => {
    return isSlug ? getToolBySlug(identifier) : getToolById(identifier);
  }, [identifier, isSlug]);
}
