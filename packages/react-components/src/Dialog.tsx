import {
  type ComponentType,
  createElement,
  type ForwardedRef,
  type HTMLAttributes,
  forwardRef,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react';
import { Dialog as _Dialog, type DialogElement, type DialogProps as _DialogProps } from './generated/Dialog.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
import useMergedRefs from './utils/useMergedRefs.js';

export * from './generated/Dialog.js';

export type DialogReactRendererProps = ReactSimpleRendererProps<DialogElement>;

type OmittedDialogHTMLAttributes = Omit<
  HTMLAttributes<DialogElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'role' | 'aria-label' | 'aria-labelledby' | 'draggable'
>;

export type DialogProps = Partial<
  Omit<_DialogProps, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer' | keyof OmittedDialogHTMLAttributes>
> &
  Readonly<{
    children?: ReactNode | ComponentType<DialogReactRendererProps>;
    footer?: ReactNode;
    /** @deprecated Provide footer content via the `footer` prop instead. */
    footerRenderer?: ComponentType<DialogReactRendererProps> | null;
    header?: ReactNode;
    /** @deprecated Provide header content via the `header` prop instead. */
    headerRenderer?: ComponentType<DialogReactRendererProps> | null;
    /** @deprecated Provide content as children instead. */
    renderer?: ComponentType<DialogReactRendererProps> | null;
  }>;

// Resolves a slot's content: a deprecated renderer component is rendered with the
// dialog element as `original` (once the element ref is populated), otherwise the
// plain node is used.
function resolveContent(
  element: DialogElement | null,
  renderer: ComponentType<DialogReactRendererProps> | null | undefined,
  node: ReactNode,
): ReactNode {
  if (renderer) {
    return element ? createElement(renderer, { original: element }) : null;
  }
  return node;
}

function Dialog(
  { children, footer, header, ...props }: DialogProps,
  ref: ForwardedRef<DialogElement>,
): ReactElement | null {
  const [element, setElement] = useState<DialogElement | null>(null);
  const finalRef = useMergedRefs(setElement, ref);

  // A function passed as children is treated as a (deprecated) content renderer.
  const childrenRenderer = typeof children === 'function' ? children : undefined;
  const childrenNode = childrenRenderer ? undefined : (children as ReactNode);

  // Keep the deprecated renderer props out of the element spread so the wrapper no
  // longer sets the web component's renderer properties (removed in Vaadin 26).
  const { headerRenderer, footerRenderer, renderer, ...rest } = props;

  const headerContent = resolveContent(element, headerRenderer, header);
  const footerContent = resolveContent(element, footerRenderer, footer);
  const bodyContent = resolveContent(element, childrenRenderer ?? renderer, childrenNode);

  return (
    <_Dialog {...rest} ref={finalRef}>
      {headerContent ? <div slot="header-content">{headerContent}</div> : null}
      {footerContent ? <div slot="footer">{footerContent}</div> : null}
      {bodyContent}
    </_Dialog>
  );
}

const ForwardedDialog = forwardRef(Dialog);

export { ForwardedDialog as Dialog };
