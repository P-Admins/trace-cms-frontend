import { ChangeEventHandler } from 'react';

type Props = {
  onRowsPerPageChange: ChangeEventHandler<HTMLSelectElement>;
};

function RowsPerPageSelector({ onRowsPerPageChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small"></span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default RowsPerPageSelector;
