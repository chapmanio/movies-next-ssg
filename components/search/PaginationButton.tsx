// Types
type PaginationButtonProps = {
  current: boolean;
  onClick: () => void;
};

// Component
const PaginationButton: React.FC<PaginationButtonProps> = ({ current, onClick, children }) => {
  // Render
  return (
    <button
      type="button"
      className={
        `inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium` +
        (current
          ? ` border-indigo-500 text-indigo-600`
          : ` border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`)
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
