import type { ComboBoxModule } from '../generated/index.js';
import type { ReactModelRenderer } from './modelRenderer.js';

export type ComboBoxReactRenderer<TItem> = ReactModelRenderer<
  TItem,
  ComboBoxModule.ComboBoxItemModel<TItem>,
  ComboBoxModule.ComboBox<TItem>
>;
