import React, { useState } from 'react';
import { MasterDetailLayout } from '../../packages/react-components/src/MasterDetailLayout.js';
import { Checkbox } from '../../packages/react-components/src/Checkbox.js';
import { MasterContent } from './MasterContent';
import { DetailContent } from './DetailContent';

export default function () {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <p>
        <Checkbox label="Show details" onChange={() => setShowDetail(!showDetail)}></Checkbox>
      </p>
      <MasterDetailLayout>
        <MasterDetailLayout.Master>
          <MasterContent />
        </MasterDetailLayout.Master>
        <MasterDetailLayout.Detail>{showDetail ? <DetailContent /> : null}</MasterDetailLayout.Detail>
      </MasterDetailLayout>
    </>
  );
}
