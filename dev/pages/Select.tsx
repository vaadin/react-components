import { Select } from '../../packages/react-components/src/Select.js';

export default function () {
  return (
    <>
      <Select
        opened
        items={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]}
        onValueChanged={(e) => console.log(e.detail)}
      ></Select>
    </>
  );
}
