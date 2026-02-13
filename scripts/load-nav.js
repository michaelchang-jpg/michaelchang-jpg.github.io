document.addEventListener('DOMContentLoaded', () => {
    const postList = document.querySelector('.post-list');
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle && postList) {
        menuToggle.addEventListener('click', () => {
            postList.classList.toggle('show');
        });
    }
});
