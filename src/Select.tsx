import {
  Children,
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { Select as _Select, type SelectElement, type SelectProps as _SelectProps } from './generated/Select.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
import useMergedRefs from './utils/useMergedRefs.js';

export * from './generated/Select.js';

export type SelectReactRendererProps = ReactSimpleRendererProps<SelectElement>;

type SelectRenderer = ComponentType<SelectReactRendererProps>;

export type SelectProps = Partial<Omit<_SelectProps, 'children' | 'renderer'>> &
  Readonly<{
    children?: ReactNode | SelectRenderer | Array<ReactNode | SelectRenderer>;
    renderer?: SelectRenderer | null;
  }>;

function Select(props: SelectProps, ref: ForwardedRef<SelectElement>): ReactElement | null {
  const children = Children.toArray(props.children as ReactNode[]);

  // Components with slot attribute should stay in light DOM.
  const slotted = children.filter((child: any) => {
    return 'props' in child && child.props.slot;
  });

  // Component without slot attribute should go to the overlay.
  let overlayChildren: ReactNode[] | undefined;

  children.forEach((child) => {
    if (!slotted.includes(child)) {
      if (!overlayChildren) {
        overlayChildren = [];
      }
      overlayChildren.push(child);
    }
  });

  // React.Children.toArray() doesn't allow functions, so we convert manually.
  const renderFn = (Array.isArray(props.children) ? props.children : [props.children]).find(
    (child: any) => typeof child === 'function',
  );

  const innerRef = useRef<SelectElement>(null);
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, renderFn || overlayChildren);
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    if (props.renderer || props.children) {
      innerRef.current?.requestContentUpdate();
    }
  }, [innerRef.current, props.renderer, props.children]);

  return (
    <_Select {...props} ref={finalRef} renderer={renderer}>
      {slotted}
      {portals}
    </_Select>
  );
}

const ForwardedSelect = forwardRef(Select);

export { ForwardedSelect as Select };
