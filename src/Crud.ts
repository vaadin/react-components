export * from './generated/Crud.js';

/**
 * HTML attributes that the `<Crud />` component recognizes on the fields
 * of a custom form.
 */
export type CrudFieldProps = Readonly<{
  /**
   * A key or path for the value of the particular field in the CRUD item
   * objects.
   */
  path: string;
}>;

/**
 * A helper function that allows declaring HTML attributes on the fields of
 * a custom form in the `<Crud />` component.
 *
 * ### Usage
 *
 * ```tsx
 * <Crud>
 *   <FormLayout slot="form">
 *     <TextField label="Name" {...{crudFieldProps({path: 'name'})}}></TextField>
 *   </FormLayout>
 * </Crud>
 * ```
 *
 * @param props HTML attributes of the field
 */
export function crudFieldProps(props: CrudFieldProps) {
  return props as {};
}
