import {
  HorizontalLayout,
  Icon,
  Iconset,
  LoginForm,
  LoginOverlay,
  MenuBar,
  Scroller,
  VerticalLayout,
} from '@vaadin/react-components';
import { BoardRow } from '@vaadin/react-components-pro';

export default function Row6() {
  return (
    <BoardRow>
      <HorizontalLayout>
        <VerticalLayout>
          <Scroller>Scroller</Scroller>
          <Iconset></Iconset>
          <Icon></Icon>
        </VerticalLayout>
        <VerticalLayout>
          <LoginForm></LoginForm>
          <LoginOverlay></LoginOverlay>
        </VerticalLayout>
      </HorizontalLayout>
      <MenuBar
        items={[
          {
            text: 'File',
            children: [{ text: 'Open' }, { text: 'Auto Save', checked: true }],
          },
          { component: 'hr' },
          {
            text: 'Edit',
            children: [{ text: 'Undo', disabled: true }, { text: 'Redo' }],
          },
          { text: 'Help' },
        ]}
      ></MenuBar>
    </BoardRow>
  );
}
