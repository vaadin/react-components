import { type Ref, type RefCallback, useCallback } from 'react';

export default function useMergedRefs<T extends HTMLElement>(
  ...refs: ReadonlyArray<Ref<T> | undefined>
): RefCallback<T> {
  return useCallback((element: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (!!ref) {
        ref.current = element;
      }
    });
  }, refs);
}
