import { useEffect, useRef, useState } from 'react';
import { VirtualList } from '../../src/VirtualList.js';
import { VirtualList as VaadinVirtualList } from '@vaadin/virtual-list';
import css from '../../css/lumo/Utility.module.css';

export default function VirtualListFlickeringIssue() {
  const [items, setItems] = useState([{ name: '0' }]);

  const list = useRef<VaadinVirtualList>(null);

  useEffect(() => {
    if (list.current) {
      list.current.items = items;
    }
  }, [items]);

  useEffect(() => {
    if (list.current) {
      list.current.renderer ||= (root, _list, model) => {
        console.log('WebComponent#renderer', [_list, model]);
        root.innerHTML = `<span>Item: ${model.item.name}</span>`;
      };
    }
  }, []);

  return (
    <div>
      <div className={`${css.flex} ${css['gap-m']}`}>
        <div>
          &lt;VirtualList&gt;
          <VirtualList items={items}>
            {({ item }) => <span>Item {item.name}</span>}
          </VirtualList>
        </div>

        <div>
          &lt;vaadin-virtual-list&gt;
          <vaadin-virtual-list ref={list}></vaadin-virtual-list>
        </div>
      </div>

      <button
        onClick={() => {
          setItems([...items, { name: items.length.toString() }]);
        }}
      >
        Add item
      </button>
    </div>
  );
}
