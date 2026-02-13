document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('blog-nav');
    if (!nav) return;

    const menuToggle = nav.querySelector('.menu-toggle');
    const postList = nav.querySelector('.post-list');

    if (menuToggle && postList) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            postList.classList.toggle('show');
        });

        // 點擊外面自動關閉
        document.addEventListener('click', () => {
            postList.classList.remove('show');
        });

        // 防止點擊列表本身時關閉
        postList.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});
