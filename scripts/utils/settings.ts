import type { JSONSchemaForWebTypes } from '../../types/schema.js';

export interface MissingEvents {
  all?: boolean;
  some?: readonly string[];
}

export enum NonGenericInterface {
  EVENT_MAP,
}

export type GenericElementInfo = Readonly<{
  numberOfGenerics: number;
  nonGenericInterfaces?: readonly NonGenericInterface[];
}>;

export const genericElements = new Map<string, GenericElementInfo>([
  ['ComboBox', { numberOfGenerics: 1 }],
  ['ComboBoxLight', { numberOfGenerics: 1 }],
  ['Crud', { numberOfGenerics: 1 }],
  ['Grid', { numberOfGenerics: 1 }],
  ['GridColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridFilterColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridPro', { numberOfGenerics: 1 }],
  ['GridProEditColumn', { numberOfGenerics: 1 }],
  ['GridSelectionColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridSortColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['GridTreeColumn', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
  ['MultiSelectComboBox', { numberOfGenerics: 1 }],
  ['VirtualList', { numberOfGenerics: 1, nonGenericInterfaces: [NonGenericInterface.EVENT_MAP] }],
]);

export type EventSettings = Readonly<{
  remove?: readonly string[];
  makeUnknown?: readonly string[];
}>;

export const eventSettings = new Map<string, EventSettings>([
  ['AppLayout', { remove: ['close-overlay-drawer'] }],
  ['Checkbox', { remove: ['value-changed'] }],
  ['ComboBox', { remove: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'] }],
  ['ComboBoxLight', { remove: ['vaadin-combo-box-dropdown-closed', 'vaadin-combo-box-dropdown-opened'] }],
  ['CrudEdit', { makeUnknown: ['edit'] }],
  ['Grid', { makeUnknown: ['size-changed', 'data-provider-changed'] }],
  [
    'GridPro',
    { makeUnknown: ['size-changed', 'data-provider-changed', 'enter-next-row-changed', 'single-cell-edit-changed'] },
  ],
  ['GridProEditColumn', { makeUnknown: ['editor-type-changed'] }],
  [
    'MultiSelectComboBox',
    {
      remove: [
        // Internal events
        'vaadin-combo-box-dropdown-closed',
        'vaadin-combo-box-dropdown-opened',
        // FIXME: missing event typing in the web component, see
        // https://github.com/vaadin/web-components/issues/4900#issuecomment-1512927512
        'opened-changed',
      ],
    },
  ],
  ['RadioButton', { remove: ['value-changed'] }],
]);

export const elementsWithMissingEntrypoint = new Set<string>([]);

export const descriptionOverrides = new Map<string, Partial<JSONSchemaForWebTypes>>([
  [
    '@vaadin/confirm-dialog',
    {
      contributions: {
        html: {
          elements: [
            {
              name: 'vaadin-confirm-dialog',
              attributes: [],
              js: {
                properties: [],
                events: [
                  {
                    name: 'cancel',
                    description: '',
                  },
                  {
                    name: 'confirm',
                    description: '',
                  },
                  {
                    name: 'reject',
                    description: '',
                  },
                  {
                    name: 'opened-changed',
                    description: '',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  ],
]);

export const elementToClassNamingConventionViolations = new Map<string, string>([['vaadin-tabsheet', 'TabSheet']]);
