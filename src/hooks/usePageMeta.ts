import { useEffect, useRef } from 'react';

export function usePageMeta(title: string, description?: string) {
  const previousDescription = useRef<string | null>(null);

  useEffect(() => {
    document.title = title;

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      // Store the previous value so we can restore it on unmount
      previousDescription.current = metaDesc.getAttribute('content');
      metaDesc.setAttribute('content', description);
    }

    return () => {
      // On unmount, revert description to the generic default
      if (previousDescription.current !== null) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', previousDescription.current);
        }
      }
    };
  }, [title, description]);
}