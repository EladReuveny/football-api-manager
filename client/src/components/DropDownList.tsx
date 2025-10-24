import React from "react";

type DropDownListProps<T> = {
  items: T[];
  selectedItemsIds: number[];
  handleSelectItem: (item: T, isChecked?: boolean) => void;
  renderItem: (item: T) => React.ReactNode;
  label: string;
};

const DropDownList = <T extends { id: number }>({
  items,
  selectedItemsIds,
  handleSelectItem,
  renderItem,
  label,
}: DropDownListProps<T>) => {
  const selectedItems = items.filter((item) =>
    selectedItemsIds.includes(item.id)
  );

  return (
    <div className="floating-label-effect">
      <details
        data-has-items={selectedItems.length > 0 ? true : false}
        className="group p-1"
      >
        <summary
          className="flex items-center justify-between cursor-pointer"
          title={`Select ${label}`}
        >
          <div className="flex flex-wrap gap-1 text-sm">
            {selectedItems.length > 0 &&
              selectedItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-(--color-text)/15 py-1 px-2 rounded hover:backdrop-brightness-200"
                >
                  {renderItem(item)}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectItem(item, true);
                    }}
                    title="Remove"
                  >
                    <i className="fa-solid fa-xmark text-gray-300 hover:brightness-125"></i>
                  </button>
                </div>
              ))}
          </div>
          <i className="fa-solid fa-chevron-down group-open:rotate-180"></i>
        </summary>

        <ul className="mt-2 border-t border-gray-500 rounded-md max-h-40 overflow-y-auto">
          {items.map((item, i) => (
            <li
              key={i}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                selectedItemsIds.includes(item.id)
                  ? "bg-(--color-primary)/25 text-(--color-primary)"
                  : "hover:bg-(--color-text)/15"
              }`}
              onClick={() => handleSelectItem(item)}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </details>

      <label className="left-4">{label}</label>
    </div>
  );
};

export default DropDownList;
