import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/solid';

import PaginationButton from './PaginationButton';
import PaginationDivider from './PaginationDivider';

// Types
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  // Render
  return (
    <nav className="mt-8 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          type="button"
          className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          disabled={currentPage === 1}
          onClick={() => onChange(currentPage > 1 ? currentPage - 1 : currentPage)}
        >
          <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>

      <div className="hidden md:-mt-px md:flex">
        {totalPages > 6 ? (
          <>
            {Array(currentPage > 3 && currentPage < totalPages - 2 ? 1 : 3)
              .fill(null)
              .map((_, index) => {
                const arrayPage = index + 1;

                return (
                  <PaginationButton
                    key={index}
                    current={currentPage === arrayPage}
                    onClick={() => onChange(arrayPage)}
                  >
                    {arrayPage}
                  </PaginationButton>
                );
              })}

            {(currentPage <= 3 || currentPage >= totalPages - 2) && <PaginationDivider />}

            {currentPage > 3 && currentPage < totalPages - 2 && (
              <>
                <PaginationDivider />

                {Array(3)
                  .fill(null)
                  .map((_, index) => {
                    const arrayPage = currentPage - 1 + index;

                    return (
                      <PaginationButton
                        key={index}
                        current={currentPage === arrayPage}
                        onClick={() => onChange(arrayPage)}
                      >
                        {arrayPage}
                      </PaginationButton>
                    );
                  })}

                <PaginationDivider />
              </>
            )}

            {currentPage > 3 && currentPage < totalPages - 2 ? (
              <PaginationButton
                current={currentPage === totalPages}
                onClick={() => onChange(totalPages)}
              >
                {totalPages}
              </PaginationButton>
            ) : (
              <>
                {Array(3)
                  .fill(null)
                  .map((_, index) => {
                    const arrayPage = (totalPages || 0) + (index - 2);

                    return (
                      <PaginationButton
                        key={index}
                        current={currentPage === arrayPage}
                        onClick={() => onChange(arrayPage)}
                      >
                        {arrayPage}
                      </PaginationButton>
                    );
                  })}
              </>
            )}
          </>
        ) : (
          <>
            {Array(totalPages)
              .fill(null)
              .map((_, index) => {
                const arrayPage = index + 1;

                return (
                  <PaginationButton
                    key={index}
                    current={currentPage === arrayPage}
                    onClick={() => onChange(arrayPage)}
                  >
                    {arrayPage}
                  </PaginationButton>
                );
              })}
          </>
        )}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          type="button"
          className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          disabled={currentPage === totalPages}
          onClick={() => onChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
        >
          Next
          <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
