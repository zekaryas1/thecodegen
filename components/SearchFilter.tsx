import { FilterMatchMode } from "primereact/api";
import { DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

interface SearchFilterProps {
  filters: any;
  setFilters: any;
  title: string;
  subTitle: string;
}

function SearchFilter({
  filters,
  setFilters,
  title,
  subTitle,
}: SearchFilterProps) {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div className="flex justify-content-between align-items-center">
      <div>
        <h2>{title}</h2>
        <span>{subTitle}</span>
      </div>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search"
        />
      </span>
    </div>
  );
}

export default SearchFilter;

export function useFilters() {
  const filters = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  return filters;
}
