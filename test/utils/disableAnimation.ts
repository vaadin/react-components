const overlays = [
  'vaadin-combo-box-overlay',
  'vaadin-context-menu-overlay',
  'vaadin-dialog-overlay',
  'vaadin-notification-container',
  'vaadin-select-overlay',
];

const parts = ['[opening]', '[opening]::part(overlay)'];

const styles = `
${overlays.map((overlay) => parts.map((part) => `${overlay}${part}`).join(',')).join(',')}{
  animation: none !important;
}
`;

const id = 'animation-disable';

export default function disableAnimation() {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = styles;
    document.head.append(style);
  }
}
