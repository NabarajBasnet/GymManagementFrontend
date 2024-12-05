import { useMemo, useState } from 'react';

export const DOTS = 'dots';

export const usePagination = ({
    total,
    siblings = 1,
    boundaries = 1,
    page,
    initialPage = 1,
    onChange,
}) => {
    const [activePage, setActivePage] = useState(initialPage);

    const setPage = (pageNumber) => {
        const safePageNumber = Math.min(Math.max(pageNumber, 1), total);
        setActivePage(safePageNumber);
        if (onChange) onChange(safePageNumber);
    };

    const next = () => setPage(activePage + 1);
    const previous = () => setPage(activePage - 1);
    const first = () => setPage(1);
    const last = () => setPage(total);

    const paginationRange = useMemo(() => {
        if (total <= 1) return [1];

        const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

        if (totalPageNumbers >= total) {
            return Array.from({ length: total }, (_, index) => index + 1);
        }

        const leftSiblingIndex = Math.max(activePage - siblings, boundaries + 1);
        const rightSiblingIndex = Math.min(activePage + siblings, total - boundaries);

        const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
        const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1);

        const range = (start, end) =>
            Array.from({ length: end - start + 1 }, (_, index) => index + start);

        if (!shouldShowLeftDots && shouldShowRightDots) {
            return [
                ...range(1, boundaries + siblings + 1),
                DOTS,
                ...range(total - boundaries + 1, total),
            ];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            return [
                ...range(1, boundaries),
                DOTS,
                ...range(total - (boundaries + siblings), total),
            ];
        }

        return [
            ...range(1, boundaries),
            DOTS,
            ...range(leftSiblingIndex, rightSiblingIndex),
            DOTS,
            ...range(total - boundaries + 1, total),
        ];
    }, [total, siblings, boundaries, activePage]);

    return {
        range: paginationRange,
        active: activePage,
        setPage,
        next,
        previous,
        first,
        last,
    };
};
