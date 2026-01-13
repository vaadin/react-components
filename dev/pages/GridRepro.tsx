import { Grid } from '../../packages/react-components/src/Grid.js';
import { GridSelectionColumn } from '../../packages/react-components/src/GridSelectionColumn.js';
import { GridSortColumn } from '../../packages/react-components/src/GridSortColumn.js';

export default function () {
  return (
    <Grid
      theme="row-dividers"
      column-reordering-allowed
      multi-sort
      items={[
        {
          patientId: 1001,
          firstName: 'Michael',
          lastName: 'Jordan',
          age: 45,
          diagnosis: 'Hypertension',
          admissionDate: '2025-01-05',
          dischargeDate: '2025-01-09',
        },
        {
          patientId: 1002,
          firstName: 'Samantha',
          lastName: 'Smith',
          age: 32,
          diagnosis: 'Pneumonia',
          admissionDate: '2025-01-07',
          dischargeDate: '2025-01-14',
        },
        {
          patientId: 1003,
          firstName: 'Greg',
          lastName: 'Wilson',
          age: 50,
          diagnosis: 'Diabetes',
          admissionDate: '2025-01-10',
          dischargeDate: '2025-01-12',
        },
        {
          patientId: 1004,
          firstName: 'Emily',
          lastName: 'Davis',
          age: 27,
          diagnosis: 'Fractured Leg',
          admissionDate: '2025-01-11',
          dischargeDate: '2025-01-18',
        },
        {
          patientId: 1005,
          firstName: 'John',
          lastName: 'Lee',
          age: 60,
          diagnosis: 'COVID-19',
          admissionDate: '2025-01-09',
          dischargeDate: '2025-01-22',
        },
        {
          patientId: 1006,
          firstName: 'Nina',
          lastName: 'Patel',
          age: 41,
          diagnosis: 'Asthma',
          admissionDate: '2025-01-03',
          dischargeDate: '2025-01-05',
        },
        {
          patientId: 1007,
          firstName: 'Andrew',
          lastName: 'Clark',
          age: 34,
          diagnosis: 'Appendicitis',
          admissionDate: '2025-01-06',
          dischargeDate: '2025-01-10',
        },
        {
          patientId: 1008,
          firstName: 'Rachel',
          lastName: 'Kim',
          age: 25,
          diagnosis: 'Migraine',
          admissionDate: '2025-01-14',
          dischargeDate: '2025-01-15',
        },
        {
          patientId: 1009,
          firstName: 'Leo',
          lastName: 'Roberts',
          age: 55,
          diagnosis: 'Cancer Screening',
          admissionDate: '2025-01-12',
          dischargeDate: '2025-01-12',
        },
        {
          patientId: 1010,
          firstName: 'Paula',
          lastName: 'Adams',
          age: 37,
          diagnosis: 'Gallstones',
          admissionDate: '2025-01-11',
          dischargeDate: '2025-01-16',
        },
        {
          patientId: 1011,
          firstName: 'Xin',
          lastName: 'Zhang',
          age: 30,
          diagnosis: 'Food Poisoning',
          admissionDate: '2025-01-15',
          dischargeDate: '2025-01-17',
        },
        {
          patientId: 1012,
          firstName: 'Derek',
          lastName: 'Hall',
          age: 42,
          diagnosis: 'Back Pain',
          admissionDate: '2025-01-09',
          dischargeDate: '2025-01-10',
        },
        {
          patientId: 1013,
          firstName: 'Amy',
          lastName: 'Evans',
          age: 29,
          diagnosis: 'Flu',
          admissionDate: '2025-01-13',
          dischargeDate: '2025-01-16',
        },
        {
          patientId: 1014,
          firstName: 'Robert',
          lastName: 'Green',
          age: 66,
          diagnosis: 'Hip Replacement',
          admissionDate: '2025-01-04',
          dischargeDate: '2025-01-19',
        },
        {
          patientId: 1015,
          firstName: 'Monica',
          lastName: 'Bell',
          age: 23,
          diagnosis: 'Concussion',
          admissionDate: '2025-01-17',
          dischargeDate: '2025-01-20',
        },
        {
          patientId: 1016,
          firstName: 'Omar',
          lastName: 'Hussain',
          age: 48,
          diagnosis: 'Kidney Stones',
          admissionDate: '2025-01-08',
          dischargeDate: '2025-01-13',
        },
        {
          patientId: 1017,
          firstName: 'Tina',
          lastName: 'Foster',
          age: 36,
          diagnosis: 'Bronchitis',
          admissionDate: '2025-01-10',
          dischargeDate: '2025-01-13',
        },
        {
          patientId: 1018,
          firstName: 'Wesley',
          lastName: 'Morris',
          age: 39,
          diagnosis: 'Anxiety',
          admissionDate: '2025-01-02',
          dischargeDate: '2025-01-09',
        },
        {
          patientId: 1019,
          firstName: 'Irene',
          lastName: 'Parker',
          age: 53,
          diagnosis: 'Arthritis',
          admissionDate: '2025-01-01',
          dischargeDate: '2025-01-07',
        },
        {
          patientId: 1020,
          firstName: 'Victor',
          lastName: 'Coleman',
          age: 61,
          diagnosis: 'Heart Disease',
          admissionDate: '2025-01-16',
          dischargeDate: null,
        },
      ]}
    >
      <GridSelectionColumn auto-select frozen></GridSelectionColumn>

      <GridSortColumn path="patientId" header="Patient id" width="200px" />
      <GridSortColumn path="firstName" header="First name" width="200px" />
      <GridSortColumn path="lastName" header="Last name" width="200px" />
      <GridSortColumn path="age" header="Age" width="200px" />
      <GridSortColumn path="diagnosis" header="Diagnosis" width="200px" />
      <GridSortColumn path="admissionDate" header="Admission date" width="200px" />
      <GridSortColumn path="dischargeDate" header="Discharge date" width="200px" />
    </Grid>
  );
}
