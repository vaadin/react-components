/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import React from 'react';
import {
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  createElement,
} from 'react';
import type { GridBodyRenderer, GridDefaultItem } from '@vaadin/react-components/Grid.js';
import type { GridColumnElement, GridColumnProps } from '@vaadin/react-components/GridColumn.js';
import {
  GridProEditColumn as _GridProEditColumn,
  type GridProEditColumnElement,
  type GridProEditColumnProps as _GridProEditColumnProps,
} from './generated/GridProEditColumn.js';
import { useModelRenderer } from '@vaadin/react-components/renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from '@vaadin/react-components/renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from '@vaadin/react-components/GridColumn.js';

export * from './generated/GridProEditColumn.js';

type GridColumnRenderer<TItem> = GridColumnProps<TItem>['renderer'];
type GridColumnHeaderFooterRenderer<TItem> = GridColumnProps<TItem>['footerRenderer'];

export type GridProEditColumnProps<TItem> = Partial<
  Omit<
    _GridProEditColumnProps<TItem>,
    | 'children'
    | 'editModeRenderer'
    | 'footerRenderer'
    | 'header'
    | 'headerRenderer'
    | 'renderer'
    | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: GridColumnRenderer<TItem>;
    editModeRenderer?: GridColumnRenderer<TItem>;
    footer?: ReactNode;
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: GridColumnHeaderFooterRenderer<TItem>;
    header?: ReactNode;
    /**
     * @deprecated Use `header` instead.
     */
    headerRenderer?: GridColumnHeaderFooterRenderer<TItem>;
    renderer?: GridColumnRenderer<TItem>;
  }>;

type ReactBodyRenderer<TItem> = GridColumnRenderer<TItem> & {
  __wrapperRenderer?: ReactBodyRenderer<TItem>;
};

type EditColumnRendererRoot = HTMLElement & { __editColumnRenderer?: GridBodyRenderer };

type ClearFunction = (arg0: HTMLElement & { _content: EditColumnRendererRoot }) => void;

/**
 * Wraps a React renderer function to render empty when requested
 *
 * @returns
 */
function editColumnReactRenderer<TItem>(reactBodyRenderer?: ReactBodyRenderer<TItem> | null) {
  if (!reactBodyRenderer) {
    return undefined;
  }

  reactBodyRenderer.__wrapperRenderer ||= function GridProEditColumnRenderer(props) {
    // If the model has __renderEmpty set, return null, otherwise call the original renderer
    return '__renderEmpty' in props.model ? null : createElement(reactBodyRenderer, props);
  };

  return reactBodyRenderer.__wrapperRenderer;
}

/**
 * Wraps a Grid body renderer function to make it request empty render before
 * the GridPro edit column clears cell content.
 */
function editColumnRenderer(bodyRenderer?: (GridBodyRenderer & { __wrapperRenderer?: GridBodyRenderer }) | null) {
  if (!bodyRenderer) {
    return undefined;
  }

  bodyRenderer.__wrapperRenderer ||= (
    root: EditColumnRendererRoot,
    column: GridColumnElement & {
      __originalClearCellContent?: ClearFunction;
      _clearCellContent?: ClearFunction;
    },
    model,
  ) => {
    // Patch the column's _clearCellContent function which is called internally by grid-pro
    // when switching from edit mode to view mode and vice versa
    if (!column.__originalClearCellContent) {
      column.__originalClearCellContent = column._clearCellContent;

      column._clearCellContent = (cell) => {
        const cellRoot = cell._content;
        // Call the original renderer with __renderEmpty set to true to clear the content it manages
        cellRoot.__editColumnRenderer?.(cellRoot, column, Object.assign({}, model, { __renderEmpty: true }));
        // Call the original clearCellContent function to manually clear the cell content
        column.__originalClearCellContent?.(cell);
      };
    }

    // Update the cell content's renderer reference so that the correct one is used
    // to render empty when the cell is cleared
    root.__editColumnRenderer = bodyRenderer;

    // Call the original renderer
    bodyRenderer(root, column, model);
  };

  return bodyRenderer.__wrapperRenderer;
}

function GridProEditColumn<TItem = GridDefaultItem>(
  { children, footer, header, ...props }: GridProEditColumnProps<TItem>,
  ref: ForwardedRef<GridProEditColumnElement<TItem>>,
): ReactElement | null {
  const [editModePortals, editModeRenderer] = useModelRenderer(editColumnReactRenderer(props.editModeRenderer), {
    renderSync: true,
  });
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderSync: true,
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });
  const [bodyPortals, bodyRenderer] = useModelRenderer(editColumnReactRenderer(props.renderer ?? children), {
    renderSync: true,
  });

  return (
    <_GridProEditColumn<TItem>
      {...props}
      editModeRenderer={editColumnRenderer(editModeRenderer)}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={ref}
      renderer={editColumnRenderer(bodyRenderer)}
    >
      {editModePortals}
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridProEditColumn>
  );
}

const ForwardedGridProEditColumn = forwardRef(GridProEditColumn) as <TItem = GridDefaultItem>(
  props: GridProEditColumnProps<TItem> & RefAttributes<GridProEditColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridProEditColumn as GridProEditColumn };
