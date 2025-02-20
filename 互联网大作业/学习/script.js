const galleryImgs = document.querySelectorAll('.gallery-img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
// 获取音频元素
const clickSound = document.getElementById('clickSound');
let currentIndex = 0;

function showImage(index) {
    galleryImgs.forEach((img, i) => {
        if (i === index) {
            img.classList.add('current');
        } else {
            img.classList.remove('current');
        }
    });
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
    showImage(currentIndex);
    // 播放音频
    clickSound.currentTime = 0; // 将音频播放位置重置到开头
    clickSound.play();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImgs.length;
    showImage(currentIndex);
    // 播放音频
    clickSound.currentTime = 0; // 将音频播放位置重置到开头
    clickSound.play();
});

showImage(currentIndex);