import { useState, useEffect, useCallback } from 'react';

export const usePagination = (totalItems, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Reset to first page if totalItems changes
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalItems, totalPages, currentPage]);

    const goToPage = useCallback((page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    }, [totalPages]);

    const goToNextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const goToPreviousPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const goToFirstPage = useCallback(() => {
        goToPage(1);
    }, [goToPage]);

    const goToLastPage = useCallback(() => {
        goToPage(totalPages);
    }, [goToPage, totalPages]);

    const getPageNumbers = useCallback(() => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    }, [currentPage, totalPages]);

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
        getPageNumbers,
        canGoNext: currentPage < totalPages,
        canGoPrevious: currentPage > 1,
    };
};