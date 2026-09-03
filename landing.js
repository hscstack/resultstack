document.addEventListener('DOMContentLoaded', () => {
    // Initial icon creation for header/footer static elements
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 10);
    
    const boardsGrid = document.getElementById('boardsGrid');
    const noResults = document.getElementById('noResults');
    const examFilter = document.getElementById('examFilter');
    const yearFilter = document.getElementById('yearFilter');
    const boardFilter = document.getElementById('boardFilter');
    const viewMoreContainer = document.getElementById('viewMoreContainer');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    const viewMoreText = document.getElementById('viewMoreText');
    const viewMoreIcon = document.getElementById('viewMoreIcon');
    let isExpanded = false;
    let boardsData = [];

    // Fetch boards data
    fetch('data/boards.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            boardsData = data;
            renderBoards();
        })
        .catch(error => {
            console.error('Error loading boards data:', error);
            if (boardsGrid) {
                boardsGrid.innerHTML = '<div class="col-span-full text-center text-red-500 py-8 bg-white rounded-xl border border-red-200">Failed to load boards data. Please try again later.</div>';
            }
        });

    function renderBoards() {
        if (!boardsGrid) return;

        const selectedExam = examFilter ? examFilter.value : 'all';
        const selectedYear = yearFilter ? yearFilter.value : 'all';
        const selectedBoard = boardFilter ? boardFilter.value : 'all';

        const filteredBoards = boardsData.filter(board => {
            const matchExam = selectedExam === 'all' || board.exam === selectedExam;
            const matchYear = selectedYear === 'all' || board.year === selectedYear;
            const matchBoard = selectedBoard === 'all' || board.name.includes(selectedBoard);
            return matchExam && matchYear && matchBoard;
        });

        boardsGrid.innerHTML = '';

        if (filteredBoards.length === 0) {
            boardsGrid.classList.add('hidden');
            if (noResults) noResults.classList.remove('hidden');
            if (viewMoreContainer) viewMoreContainer.classList.add('hidden');
            return;
        }

        boardsGrid.classList.remove('hidden');
        if (noResults) noResults.classList.add('hidden');

        // Dynamic pagination: 3 for phone (<640px), 6 for larger screens
        const initialLimit = getInitialLimit();
        const hasMore = filteredBoards.length > initialLimit;
        const visibleBoards = (hasMore && !isExpanded) ? filteredBoards.slice(0, initialLimit) : filteredBoards;

        if (viewMoreContainer) {
            if (hasMore) {
                viewMoreContainer.classList.remove('hidden');
                if (viewMoreText) {
                    viewMoreText.textContent = isExpanded ? 'Show Less' : `View More Boards (${filteredBoards.length - initialLimit} more)`;
                }
                if (viewMoreIcon) {
                    viewMoreIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            } else {
                viewMoreContainer.classList.add('hidden');
            }
        }

        visibleBoards.forEach((board, index) => {
            const isAvailable = board.status === 'available';
            const banglaName = board.name_bn || '';
            const examLabel = (board.exam || '').toUpperCase();
            const yearLabel = board.year || '';
            const iconName = board.icon || 'landmark';
            const staggerDelay = Math.min(index * 40, 300);
            
            const card = document.createElement('div');
            
            if (isAvailable) {
                card.innerHTML = `
                    <div style="animation-delay: ${staggerDelay}ms;" class="board-card-animate group bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 p-5 flex flex-col justify-between transition-all duration-200">
                        <div>
                            <div class="flex items-center justify-between gap-2">
                                <div class="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform duration-200">
                                    <i data-lucide="${iconName}" class="w-5 h-5"></i>
                                </div>
                                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live
                                </span>
                            </div>

                            <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-3.5 mb-0.5">
                                ${board.name}
                            </h3>
                            ${banglaName ? `<p class="font-bengali text-xs text-slate-500">${banglaName}</p>` : ''}
                            
                            <div class="mt-3">
                                <span class="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                                    ${examLabel} ${yearLabel}
                                </span>
                            </div>
                        </div>

                        <div class="pt-4 mt-3 border-t border-slate-100">
                            <a href="${board.url}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-lg shadow-sm transition-all duration-150">
                                <span>View Leaderboard</span>
                                <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-0.5"></i>
                            </a>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div style="animation-delay: ${staggerDelay}ms;" class="board-card-animate bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between opacity-80 hover:opacity-100 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200">
                        <div>
                            <div class="flex items-center justify-between gap-2">
                                <div class="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                    <i data-lucide="${iconName}" class="w-5 h-5"></i>
                                </div>
                                <span class="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
                                    Coming Soon
                                </span>
                            </div>

                            <h3 class="text-base sm:text-lg font-semibold text-slate-700 mt-3.5 mb-0.5">
                                ${board.name}
                            </h3>
                            ${banglaName ? `<p class="font-bengali text-xs text-slate-400">${banglaName}</p>` : ''}

                            <div class="mt-3">
                                <span class="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                    ${examLabel} ${yearLabel}
                                </span>
                            </div>
                        </div>

                        <div class="pt-4 mt-3 border-t border-slate-100">
                            <div class="w-full inline-flex items-center justify-center text-slate-400 text-xs font-medium py-2 rounded-lg bg-slate-50 border border-slate-100 cursor-default">
                                Upcoming
                            </div>
                        </div>
                    </div>
                `;
            }
            
            boardsGrid.appendChild(card.firstElementChild);
        });
        
        // Refresh icons after DOM update
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 10);
    }

    // Filter change resets expanded state and re-renders
    const handleFilterChange = () => {
        isExpanded = false;
        renderBoards();
    };

    if (examFilter) examFilter.addEventListener('change', handleFilterChange);
    if (yearFilter) yearFilter.addEventListener('change', handleFilterChange);
    if (boardFilter) boardFilter.addEventListener('change', handleFilterChange);

    // View More click handler
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            renderBoards();
        });
    }

    // Window resize handler
    window.addEventListener('resize', () => {
        if (!isExpanded) {
            renderBoards();
        }
    });
});