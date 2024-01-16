import {
  type ComponentType,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
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
  // React.Children.toArray() doesn't allow functions, so we convert manually.
  const children = Array.isArray(props.children) ? props.children : [props.children];

  // Components with slot attribute should stay in light DOM.
  const slottedChildren = children.filter((child): child is ReactNode => {
    return isValidElement(child) && child.props.slot;
  });

  // Component without slot attribute should go to the overlay.
  const overlayChildren = children.filter((child): child is ReactNode => {
    return isValidElement(child) && !slottedChildren.includes(child);
  });

  const renderFn = children.find((child) => typeof child === 'function');

  const innerRef = useRef<SelectElement>(null);
  const [portals, renderer] = useSimpleOrChildrenRenderer(
    props.renderer,
    renderFn || (overlayChildren.length ? overlayChildren : undefined),
  );
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    if (
      (props.renderer || props.children) &&
      innerRef.current &&
      typeof innerRef.current.requestContentUpdate === 'function'
    ) {
      innerRef.current?.requestContentUpdate();
    }
  }, [innerRef.current, props.renderer, props.children]);

  return (
    <_Select {...props} ref={finalRef} renderer={renderer}>
      {slottedChildren}
      {portals}
    </_Select>
  );
}

const ForwardedSelect = forwardRef(Select) as ForwardRefExoticComponent<SelectProps & RefAttributes<SelectElement>> & {
  define(): Promise<void>;
};

Object.assign(ForwardedSelect, { define: _Select.define });

export { ForwardedSelect as Select };
