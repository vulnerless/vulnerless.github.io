document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const FADE_OUT_DURATION = 300;

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const updateSkillNames = () => {
        const isSmallScreen = window.innerWidth <= 768;
        document.querySelectorAll('.skill-name').forEach(skillName => {
            const fullName = skillName.getAttribute('data-full-name') || skillName.textContent;
            
            if (!skillName.getAttribute('data-full-name')) {
                skillName.setAttribute('data-full-name', fullName);
            }
            
            if (isSmallScreen) {
                switch(fullName.trim()) {
                    case 'Python': skillName.textContent = 'PY'; break;
                    case 'JavaScript': skillName.textContent = 'JS'; break;
                    case 'PHP': skillName.textContent = 'PHP'; break;
                    case 'SQL': skillName.textContent = 'SQL'; break;
                    default: skillName.textContent = fullName.substring(0, 2); break;
                }
            } else {
                skillName.textContent = fullName;
            }
        });
    };

    const animateSkillBars = () => {
        document.querySelectorAll('.skill-progress').forEach(progress => {
            const percent = progress.getAttribute('data-percent');
            progress.style.width = '0%';
            setTimeout(() => {
                progress.style.width = `${percent}%`;
            }, 100);
        });
    };

    const animateSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        if (sectionId === 'about') {
            animateSkillBars();
            updateSkillNames();
        }

        if (sectionId === 'resume') {
            const items = section.querySelectorAll('.project-card, .interest-item');
            items.forEach(item => item.classList.remove('fade-in'));
            items.forEach((item, index) => {
                setTimeout(() => item.classList.add('fade-in'), index * 100);
            });
            
            window.scrollTo(0, 0);
        }
    };

    const updateActiveLink = (sectionId) => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    };

    const showSection = async (sectionId) => {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        const currentActive = document.querySelector('.section.active');

        if (currentActive && currentActive.id !== sectionId) {
            currentActive.classList.remove('active');
            await sleep(FADE_OUT_DURATION);
            currentActive.style.display = 'none';
        }

        targetSection.style.display = 'block';
        await sleep(20);
        targetSection.classList.add('active');
        
        updateActiveLink(sectionId);
        animateSection(sectionId);
        
        window.scrollTo(0, 0);
    };

    document.querySelectorAll('.nav-link, .btn[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            showSection(targetSection);
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sections = ['home', 'about', 'showcase', 'contact', 'cv'];
            showSection(sections[parseInt(e.key) - 1]);
        }
    });

    window.addEventListener('resize', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection && aboutSection.classList.contains('active')) {
            updateSkillNames();
        }
    });

    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    const videoTitle = document.getElementById('videoTitle');
    const closeModal = document.querySelector('.close-modal');
    const videoButtons = document.querySelectorAll('.video-btn');

    videoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (button.classList.contains('disabled')) {
                return;
            }
            
            const videoUrl = button.getAttribute('data-video');
            if (videoUrl) {
                const videoId = videoUrl.split('/').pop();
                
                const wrapperDiv = document.createElement('div');
                wrapperDiv.style.cssText = 'position:relative; width:100%; height:0px; padding-bottom:56.250%';

                const iframe = document.createElement('iframe');
                iframe.src = `https://streamable.com/e/${videoId}?autoplay=1&muted=1`;
                iframe.style.cssText = 'border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;';
                iframe.setAttribute('allow', 'fullscreen');
                iframe.setAttribute('allowfullscreen', '');

                wrapperDiv.appendChild(iframe);

                videoContainer.innerHTML = '';
                videoContainer.appendChild(wrapperDiv);
                
                const projectCard = button.closest('.project-card');
                const projectTitleText = projectCard.querySelector('h4').textContent;
                videoTitle.textContent = `${projectTitleText} - Video Preview`;
                
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            }
        });
    });
    
    const closeVideoModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            videoContainer.innerHTML = ''; 
        }, 300);
    };

    closeModal.addEventListener('click', closeVideoModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    showSection('home');
});