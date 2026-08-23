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
    
    let boardsData = [];

    // Fetch boards data
    fetch('data/boards.json')
        .then(response => response.json())
        .then(data => {
            boardsData = data;
            renderBoards();
        })
        .catch(error => {
            console.error('Error loading boards data:', error);
            boardsGrid.innerHTML = '<div class="col-span-full text-center text-red-500 py-8">Failed to load boards data. Please try again later.</div>';
        });

    function renderBoards() {
        const selectedExam = examFilter.value;
        const selectedYear = yearFilter.value;
        const selectedBoard = boardFilter.value;

        const filteredBoards = boardsData.filter(board => {
            const matchExam = selectedExam === 'all' || board.exam === selectedExam;
            const matchYear = selectedYear === 'all' || board.year === selectedYear;
            const matchBoard = selectedBoard === 'all' || board.name.includes(selectedBoard);
            return matchExam && matchYear && matchBoard;
        });

        boardsGrid.innerHTML = '';

        if (filteredBoards.length === 0) {
            boardsGrid.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }

        boardsGrid.classList.remove('hidden');
        noResults.classList.add('hidden');

        filteredBoards.forEach(board => {
            const isAvailable = board.status === 'available';
            
            const card = document.createElement('div');
            
            if (isAvailable) {
                card.innerHTML = `
                    <a href="${board.url}" class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-500 transition-all duration-300 p-8 flex flex-col items-center text-center h-full relative overflow-hidden">
                        <div class="absolute top-0 w-full h-1 bg-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div class="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                            <span class="text-4xl">${board.icon}</span>
                        </div>
                        <h3 class="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">${board.name}</h3>
                        <p class="text-sm font-semibold text-indigo-600/80 bg-indigo-50 px-3 py-1 rounded-full mb-6">${board.exam.toUpperCase()} ${board.year}</p>
                        <span class="mt-auto inline-flex items-center text-slate-600 font-bold group-hover:text-indigo-600 transition-colors">
                            View Leaderboard
                            <i data-lucide="arrow-right" class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"></i>
                        </span>
                    </a>
                `;
            } else {
                card.innerHTML = `
                    <div class="relative bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col items-center text-center h-full overflow-hidden">
                        <div class="absolute top-4 right-4 bg-white border border-slate-200 text-slate-500 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">Coming Soon</div>
                        <div class="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 opacity-60">
                            <span class="text-4xl grayscale">${board.icon}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-400 mb-2">${board.name}</h3>
                        <p class="text-sm font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">${board.exam.toUpperCase()} ${board.year}</p>
                    </div>
                `;
            }
            
            boardsGrid.appendChild(card.firstElementChild);
        });
        
        // Timeout to ensure DOM is fully updated before lucide scans it
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 10);
    }

    examFilter.addEventListener('change', renderBoards);
    yearFilter.addEventListener('change', renderBoards);
    boardFilter.addEventListener('change', renderBoards);
});