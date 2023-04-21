interface PaginationPropTypes {
  totalCount: number;
  pageSize: number;
  pageCount: number;
  pageIndex: number;
  canNext: boolean;
  canPrevious: boolean;
  nextPage: Function;
  previousPage: Function;
  gotoPage: Function;
}

export default function Pagination({
  pageIndex,
  pageSize,
  totalCount,
  pageCount,
  previousPage,
  nextPage,
  canNext,
  canPrevious,
  gotoPage,
}: PaginationPropTypes) {
  const pageIndexStartWithOne = pageIndex + 1;
  return (
    <nav
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span className="font-semibold text-gray-900 dark:text-white">
          {` ${pageIndex * pageSize}-${Math.min(
            pageIndex * pageSize + pageSize,
            totalCount
          )} `}
        </span>
        of
        <span className="font-semibold text-gray-900 dark:text-white">
          {" "}
          {totalCount}
        </span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <button
            type="button"
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => previousPage()}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        {pageCount < 5 ? (
          <>
            {new Array(pageCount).map((_v, idx) => (
              <li key={_v}>
                <button
                  type="button"
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                    pageIndexStartWithOne === 1
                      ? "text-blue-600 bg-blue-50 border-blue-300"
                      : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                  onClick={() => gotoPage(idx)}
                >
                  1
                </button>
              </li>
            ))}
          </>
        ) : (
          <>
            <li>
              <button
                type="button"
                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                  pageIndexStartWithOne === 1
                    ? "text-blue-600 bg-blue-50 border-blue-300"
                    : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
                onClick={() => gotoPage(0)}
              >
                1
              </button>
            </li>
            {pageIndexStartWithOne > 2 ? (
              <li>
                <button
                  type="button"
                  className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  ...
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => gotoPage(1)}
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                      pageIndexStartWithOne === 2
                        ? "text-blue-600 bg-blue-50 border-blue-300"
                        : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    2
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    aria-current="page"
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                      pageIndexStartWithOne === 3
                        ? "text-blue-600 bg-blue-50 border-blue-300"
                        : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => gotoPage(2)}
                  >
                    3
                  </button>
                </li>
              </>
            )}
            {pageIndexStartWithOne > 2 &&
              pageIndexStartWithOne < pageCount - 2 && (
                <>
                  <li>
                    <button
                      type="button"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight border text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                      onClick={() => gotoPage(pageIndexStartWithOne - 2)}
                    >
                      {pageIndexStartWithOne - 1}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight border text-blue-600 bg-blue-50 border-blue-300"
                      onClick={() => gotoPage(pageIndexStartWithOne - 1)}
                    >
                      {pageIndexStartWithOne}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                      onClick={() => gotoPage(pageIndexStartWithOne)}
                    >
                      {pageIndexStartWithOne + 1}
                    </button>
                  </li>
                </>
              )}
            {pageIndexStartWithOne >= pageCount - 2 ? (
              <>
                <li>
                  <button
                    type="button"
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                      pageIndexStartWithOne === pageCount - 2
                        ? "text-blue-600 bg-blue-50 border-blue-300"
                        : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => gotoPage(pageCount - 3)}
                  >
                    {pageCount - 3}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                      pageIndexStartWithOne === pageCount - 1
                        ? "text-blue-600 bg-blue-50 border-blue-300"
                        : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => gotoPage(pageCount - 2)}
                  >
                    {pageCount - 2}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                      pageIndexStartWithOne === pageCount
                        ? "text-blue-600 bg-blue-50 border-blue-300"
                        : " text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    onClick={() => gotoPage(pageCount - 1)}
                  >
                    {pageCount - 1}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  >
                    ...
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => gotoPage(pageCount - 1)}
                  >
                    {pageCount - 1}
                  </button>
                </li>
              </>
            )}
          </>
        )}

        <li>
          <button
            type="button"
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => nextPage()}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
