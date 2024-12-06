import React, { useState } from 'react';
import '../../app/pagination.css';
import { BsThreeDots } from "react-icons/bs";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({
    total = 1,
    initialPage = 1,
    withEdges = false,
    withControls = true,
    getControlProps = () => ({}),
    nextIcon = 'Next',
    previousIcon = 'Previous',
    firstIcon = <MdKeyboardDoubleArrowLeft />,
    lastIcon = <MdKeyboardDoubleArrowRight />,
    dotsIcon = <BsThreeDots />,
    gap = 8,
    hideWithOnePage = false,
    onChange = () => { },
}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    if (hideWithOnePage && total === 1) {
        return null;
    }

    const changePage = (page) => {
        if (page < 1 || page > total) return;
        setCurrentPage(page);
        onChange(page);
    };

    const renderDots = () => (
        <span className="pagination-dots">{dotsIcon}</span>
    );

    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= total; i++) {
            if (
                i === 1 ||
                i === total ||
                Math.abs(i - currentPage) <= 1
            ) {
                pages.push(
                    <button
                        key={i}
                        className={`pagination-control ${i === currentPage ? 'active' : ''
                            }`}
                        onClick={() => changePage(i)}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === currentPage - 2 || i === currentPage + 2) &&
                !pages.includes(renderDots())
            ) {
                pages.push(renderDots());
            }
        }
        return pages;
    };

    return (
        <div className="pagination-root" style={{ gap }}>
            {withEdges && (
                <button
                    {...getControlProps('first')}
                    className="pagination-control"
                    onClick={() => changePage(1)}
                    disabled={currentPage === 1}
                >
                    {firstIcon}
                </button>
            )}

            {withControls && (
                <button
                    {...getControlProps('previous')}
                    className="pagination-control"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <p className='font-bold'>Previous</p>
                </button>
            )}

            {renderPages()}

            {withControls && (
                <button
                    {...getControlProps('next')}
                    className="pagination-control"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === total}
                >
                    <p className='font-bold'>Next</p>
                </button>
            )}

            {withEdges && (
                <button
                    {...getControlProps('last')}
                    className="pagination-control"
                    onClick={() => changePage(total)}
                    disabled={currentPage === total}
                >
                    {lastIcon}
                </button>
            )}
        </div>
    );
};

export default Pagination;
