type SearchFilterBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDialog?: React.RefObject<HTMLDialogElement | null>;
  children?: React.ReactNode;
};

const SearchFilterBar = ({
  searchQuery,
  setSearchQuery,
  filterDialog,
  children,
}: SearchFilterBarProps) => {
  const showFilterDialog = () => {
    filterDialog?.current?.showModal();
  };

  const closeFilterDialog = () => {
    filterDialog?.current?.close();
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <input
          type="search"
          id="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="peer py-1 pl-8 pr-1 rounded border border-gray-600 hover:border-(--color-text) focus:border-(--color-primary)"
        />
        <i className="fa-solid fa-magnifying-glass text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 peer-hover:brightness-135 peer-focus:text-(--color-text)"></i>
      </div>

      {/* {filterDialog && (
        <>
          <button
            onClick={showFilterDialog}
            title="Open Filters"
            className="border border-gray-600 py-1 px-2 rounded text-gray-400 hover:brightness-125"
          >
            <span className="material-symbols-outlined align-middle">tune</span>
          </button>
          <FormDialog
            dialogRef={filterDialog}
            title="Filter Players"
            onClose={closeFilterDialog}
            onSubmit={onSubmitFilters}
          >
            {children}
          </FormDialog>
        </>
      )} */}
    </div>
  );
};

export default SearchFilterBar;
