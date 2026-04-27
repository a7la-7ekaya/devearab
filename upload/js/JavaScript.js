


function isValidTopicImage(imgElement) {
    let src = (imgElement.getAttribute('src') || '').toLowerCase();
    let className = (imgElement.className || '').toLowerCase();

    if (className.includes('smilies') || className.includes('avatar') || className.includes('icon')) return false;

    const blockedKeywords = ['smilies', 'smile', '/i/smiles/', 'avatar', 'icon', 'logo', 'illiweb.com', 'hitskin.com', 'button', 'rank', 'clear.gif', 'emoji', 'twemoji'];
    for (let word of blockedKeywords) {
        if (src.includes(word)) return false;
    }
    if (src.trim() === '') return false;
    return true; 
}


function verifyImageSize(src) {
    return new Promise(resolve => {
        let img = new Image();
        img.onload = function() {
            if (this.width > 100 && this.height > 100) resolve(true);
            else resolve(false);
        };
        img.onerror = () => resolve(false);
        img.src = src;
    });
}


function getFirstPostImages(doc) {
    let firstPost = doc.querySelector('.post, article, .row1, .postbody'); 
    if (!firstPost) firstPost = doc; 
    return firstPost.querySelectorAll('.content img, .entry-content img, .post-content img, .postbody img');
}


(function() {
    const myUrl = "https://www.facebook.com/Flying1free"; 
    const myName = "تصميم و برمجة :- الطائر الحر";

    function checkDesignerRights() {
        var linkEl = document.getElementById('designer-copy-link');
        var isTampered = false;

        if (!linkEl) {
            isTampered = true;
        } else {
            var currentHref = linkEl.getAttribute('href') || "";
            if (!currentHref.includes(myUrl) || !linkEl.innerText.includes(myName)) {
                isTampered = true;
            }
            var styles = window.getComputedStyle(linkEl);
            if (styles.display === 'none' || styles.visibility === 'hidden' || parseFloat(styles.opacity) === 0 || parseFloat(styles.fontSize) === 0) {
                isTampered = true;
            }
        }

        if (isTampered) {
            document.body.innerHTML = `
                <div style="display:flex; justify-content:center; align-items:center; height:100vh; background-color:#111827; color:#f9fafb; flex-direction:column; text-align:center; padding:20px; font-family:'Tajawal', Arial, sans-serif; direction:rtl;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 5rem; color: #ef4444; margin-bottom: 20px;"></i>
                    <h1 style="color:#ef4444; font-size:3rem; margin-bottom:15px; font-weight:900; word-spacing: 8px;">تم&nbsp;إيقاف&nbsp;الموقع!</h1>
                    <p style="font-size:1.5rem; line-height:1.8; word-spacing: 5px;">عذراً،&nbsp;لقد&nbsp;تم&nbsp;إزالة&nbsp;أو&nbsp;التلاعب&nbsp;بحقوق&nbsp;المصمم&nbsp;الأصلي&nbsp;للموقع.<br>يرجى&nbsp;استرجاع&nbsp;حقوق&nbsp;<a href="${myUrl}" target="_blank" style="color:#3b82f6; text-decoration:underline; font-weight:bold;">${myName}</a>&nbsp;ليعمل&nbsp;الموقع&nbsp;بشكل&nbsp;طبيعي.</p>
                </div>
            `;
            document.body.style.overflow = "hidden";
        }
    }
    window.addEventListener('DOMContentLoaded', checkDesignerRights);
    setInterval(checkDesignerRights, 2000);
})();


const root = document.documentElement;
let currentFontSize = 16;

function openAuthModal(tabType) { const authModal = document.getElementById('authModal'); if(authModal) { authModal.classList.add('active'); switchAuthTab(tabType); } }
function closeAuthModal() { const authModal = document.getElementById('authModal'); if(authModal) authModal.classList.remove('active'); }
function switchAuthTab(tabType) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form-container').forEach(f => f.classList.remove('active'));
    const selectedTab = document.getElementById(`tab-${tabType}`); const selectedForm = document.getElementById(`form-${tabType}`);
    if(selectedTab) selectedTab.classList.add('active'); if(selectedForm) selectedForm.classList.add('active');
}

function toggleMenu(menuId) {
    const menus = ['settingsPanel', 'notificationsBox', 'userDropdown'];
    menus.forEach(id => { const el = document.getElementById(id); if (el) { if (id === menuId) el.classList.toggle('active'); else el.classList.remove('active'); } });
}

function openSearch() { document.getElementById('searchModal').classList.add('active'); document.getElementById('searchInput').focus(); }
function closeSearch() { document.getElementById('searchModal').classList.remove('active'); document.getElementById('searchInput').value = ''; document.getElementById('searchResults').innerHTML = '<div class="search-placeholder">قم بكتابة حرفين على الأقل لبدء البحث...</div>'; }

function changeFontSize(step) {
    currentFontSize += step; if(currentFontSize < 12) currentFontSize = 12; if(currentFontSize > 24) currentFontSize = 24; 
    const fontDisplay = document.getElementById('fontSizeDisplay'); if(fontDisplay) fontDisplay.innerText = currentFontSize;
    root.style.fontSize = currentFontSize + 'px'; localStorage.setItem('f_font_num', currentFontSize);
}

function setSetting(type, value, element) {
    if(element) {
        const siblings = element.parentElement.children;
        for(let el of siblings) { el.classList.remove('active-btn'); if(el.querySelector('i') && type==='theme') el.querySelector('i').style.color = ''; }
        element.classList.add('active-btn');
    }
    if(type === 'theme') { if(value === 'dark') document.body.classList.add('dark-theme'); else document.body.classList.remove('dark-theme'); localStorage.setItem('f_theme', value); }
    else if(type === 'color') { root.style.setProperty('--primary-color', value); localStorage.setItem('f_color', value); const profileHeader = document.getElementById('profileHeaderBox'); if(profileHeader) profileHeader.style.backgroundColor = value; }
    else if(type === 'header') { if(value === 'none') root.style.setProperty('--header-display', 'none'); else { root.style.setProperty('--header-display', 'flex'); root.style.setProperty('--header-image', value); } localStorage.setItem('f_header', value); }
}

function loadSettings() {
    const fontNum = localStorage.getItem('f_font_num'), theme = localStorage.getItem('f_theme'), color = localStorage.getItem('f_color'), header = localStorage.getItem('f_header');
    if(fontNum) { currentFontSize = parseInt(fontNum); const fontDisp = document.getElementById('fontSizeDisplay'); if(fontDisp) fontDisp.innerText = currentFontSize; root.style.fontSize = currentFontSize + 'px'; }
    if(theme) setSetting('theme', theme, document.querySelector(`.theme-btn[data-theme="${theme}"]`));
    if(color) { setSetting('color', color, document.querySelector(`.color-circle[data-color="${color}"]`)); const profileHeader = document.getElementById('profileHeaderBox'); if(profileHeader) profileHeader.style.backgroundColor = color; }
    if(header) { const imgOptions = document.querySelectorAll('.img-option'); let targetEl = null; for(let el of imgOptions) if(el.dataset.img === header) targetEl = el; if(targetEl) setSetting('header', header, targetEl); }
}

window.resetSettings = function() {
    localStorage.removeItem('f_font_num');
    localStorage.removeItem('f_theme');
    localStorage.removeItem('f_color');
    localStorage.removeItem('f_header');
    localStorage.removeItem('forum_layout');
    location.reload();
};

function toggleSubBoards(btn) {
    const container = btn.closest('.board-row').querySelector('.sub-boards-container');
    const icon = btn.querySelector('i');
    if(container.style.display === 'block') { container.style.display = 'none'; icon.style.transform = 'rotate(0deg)'; } 
    else { container.style.display = 'block'; icon.style.transform = 'rotate(180deg)'; }
}

function shareTopic(platform) {
    var url = encodeURIComponent(window.location.href.split('#')[0]), title = encodeURIComponent(document.title), shareLink = '';
    if (platform === 'wa') { shareLink = 'https://api.whatsapp.com/send?text=' + title + ' - ' + url; } 
    else if (platform === 'fb') { shareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + url; } 
    else if (platform === 'tw') { shareLink = 'https://twitter.com/intent/tweet?text=' + title + '&url=' + url; }
    else if (platform === 'cp') {
        var dummy = document.createElement('input'), text = window.location.href.split('#')[0];
        document.body.appendChild(dummy); dummy.value = text; dummy.select(); document.execCommand('copy'); document.body.removeChild(dummy);
        alert('تم نسخ رابط الموضوع بنجاح!'); return;
    }
    if(shareLink !== '') { window.open(shareLink, '_blank', 'width=600,height=400'); }
}


function initUserData() {
    if (typeof _userdata !== "undefined") {
        
      
        if (_userdata.avatar && _userdata.avatar !== "") {
            let extractedAvatar = "";
            if (_userdata.avatar.includes('<img')) {
                let tempDiv = document.createElement('div'); tempDiv.innerHTML = _userdata.avatar;
                let imgEl = tempDiv.querySelector('img'); if(imgEl) extractedAvatar = imgEl.src;
            } else { extractedAvatar = _userdata.avatar; }
            if (extractedAvatar) { document.querySelectorAll('#customUserAvatar, #customUserAvatarLarge, #current-user-avatar').forEach(el => { el.src = extractedAvatar; }); }
        }
       
        if (_userdata.username && _userdata.username !== "") {
            const userNameEl = document.getElementById('customUserName'); if(userNameEl) userNameEl.textContent = _userdata.username;
            const curUserName = document.getElementById('current-user-name'); if(curUserName) curUserName.textContent = _userdata.username;
        }

        if (_userdata.session_logged_in == 1 && _userdata.user_id) {
            
            
            const profileLink = document.getElementById('customProfileLink');
            if(profileLink) profileLink.href = '/u' + _userdata.user_id;

            
            const pmCacheKey = 'flx_unread_pm_count';
            const pmTimeKey = 'flx_unread_pm_time';
            let cachedPmCount = sessionStorage.getItem(pmCacheKey);
            let cachedPmTime = sessionStorage.getItem(pmTimeKey);
            let now = Date.now();

            function updatePmUI(count) {
                const pmBadge = document.getElementById('customPmBadge');
                const pmText = document.getElementById('pmText');
                if (pmBadge && pmText) {
                    pmBadge.textContent = count;
                    if (count > 0) {
                        pmBadge.classList.add('has-new-pms');
                        pmText.textContent = 'رسائل جديدة';
                        pmText.style.color = '#ef4444';
                        pmText.style.fontWeight = 'bold';
                    } else {
                        pmBadge.classList.remove('has-new-pms');
                        pmText.textContent = 'الرسائل الخاصة';
                        pmText.style.color = '';
                        pmText.style.fontWeight = 'normal';
                    }
                }
            }

            if (cachedPmCount !== null && cachedPmTime && (now - cachedPmTime < 60 * 1000)) {
                updatePmUI(parseInt(cachedPmCount)); 
            } else {
               
                $.ajax({
                    url: '/privmsg?folder=inbox',
                    type: 'GET',
                    success: function(data) {
                        // حساب كم مرة تكررت كلمة pm_unread.png في كود الـ HTML الخاص بصندوق الوارد
                        let unreadCount = (data.match(/pm_unread\.png/g) || []).length;
                        
                        sessionStorage.setItem(pmCacheKey, unreadCount);
                        sessionStorage.setItem(pmTimeKey, now);
                        
                        updatePmUI(unreadCount);
                    }
                });
            }

          
            const rankTextEl = document.getElementById('customUserRankText');
            const rankImgEl = document.getElementById('customUserRankImg');
            const rankCacheKey = 'flx_rank_data_v4_' + _userdata.user_id; 
            const cachedRankDataStr = localStorage.getItem(rankCacheKey);

            if (cachedRankDataStr) {
                try {
                    let cachedData = JSON.parse(cachedRankDataStr);
                    if (rankTextEl && cachedData.text) {
                        rankTextEl.textContent = cachedData.text;
                        rankTextEl.style.display = 'block';
                    }
                    if (rankImgEl && cachedData.img) {
                        rankImgEl.src = cachedData.img;
                        rankImgEl.style.display = 'block';
                    }
                } catch(e) {}
            } else {
                $.ajax({
                    url: '/u' + _userdata.user_id,
                    type: 'GET',
                    success: function(data) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(data, "text/html");
                        
                        let rankText = "";
                        let rankImgSrc = "";

                       
                        let profileRankBlock = $(doc).find('.profile-rank');
                        
                        if (profileRankBlock.length > 0) {
                            let fullText = profileRankBlock.text();
                            if(fullText.includes('الرتبة:')) {
                                rankText = fullText.split('الرتبة:')[1].trim().split('\n')[0].trim();
                            }
                            let imgElement = profileRankBlock.find('img').first();
                            if (imgElement.length > 0) {
                                rankImgSrc = imgElement.attr('src');
                            }
                        }

                    
                        if (!rankText) rankText = $(doc).find('.user-profile-rank, .rank-title').first().text().replace('الرتبة:', '').trim();
                        if (!rankImgSrc) rankImgSrc = $(doc).find('.user-profile-rank-img, img[alt*="رتب"], img[title*="رتب"]').first().attr('src');
                        
                        if(rankText && rankTextEl) {
                            rankTextEl.textContent = rankText;
                            rankTextEl.style.display = 'block';
                        }
                        if(rankImgSrc && rankImgEl) {
                            rankImgEl.src = rankImgSrc;
                            rankImgEl.style.display = 'block';
                        }

                        localStorage.setItem(rankCacheKey, JSON.stringify({
                            text: rankText,
                            img: rankImgSrc
                        }));
                    }
                });
            }
        }
    }
}


function initDynamicSlider() {
    const sliderContainer = document.getElementById('flx-dynamic-slider');
    if (!sliderContainer) return;
    const sideItems = document.querySelectorAll('.flx-side-item');
    if (sideItems.length === 0) return;

    let currentActiveSlide = 0;
    let slideIntervalTimer;
    const fallbackImage = 'https://i.servimg.com/u/f33/19/52/81/36/pngtre10.png';

    async function fetchTopicData(url, itemElement, index) {
        try {
            let cleanUrl = url.split('#')[0];
            let response = await fetch(cleanUrl);
            let htmlText = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlText, 'text/html');

            let finalImageUrl = fallbackImage;
            let contentImages = getFirstPostImages(doc);
            
            for (let img of contentImages) {
                if (isValidTopicImage(img)) {
                    let src = img.getAttribute('src');
                    let isBigEnough = await verifyImageSize(src); 
                    if (isBigEnough) {
                        finalImageUrl = src; 
                        break; 
                    }
                }
            }

            if(finalImageUrl === fallbackImage) {
                let ogImageTag = doc.querySelector('meta[property="og:image"]');
                if (ogImageTag && ogImageTag.content) {
                    let fetchedImg = ogImageTag.content;
                    if (!fetchedImg.includes('illiweb.com') && !fetchedImg.includes('hitskin.com') && !fetchedImg.includes('logo')) { finalImageUrl = fetchedImg; }
                }
            }

            let forumName = '';
            let navLinks = doc.querySelectorAll('a.nav');
            let forumLinks = Array.from(navLinks).filter(a => a.getAttribute('href') && a.getAttribute('href').indexOf('/f') === 0);
            if(forumLinks.length > 0) { forumName = forumLinks[forumLinks.length - 1].innerText.trim(); } 
            else if (navLinks.length > 1) { forumName = navLinks[navLinks.length - 2].innerText.trim(); }

            let imgDiv = itemElement.querySelector('.flx-side-img');
            if (imgDiv) { imgDiv.style.backgroundImage = `url('${finalImageUrl}')`; imgDiv.classList.remove('flx-loading-img'); }
            
            itemElement.setAttribute('data-img', finalImageUrl);
            if(forumName) itemElement.setAttribute('data-forum-name', forumName);

            if (index === currentActiveSlide) { renderHero(index); }
        } catch (error) {
            console.log("خطأ في جلب بيانات السلايدر:", error);
            let imgDiv = itemElement.querySelector('.flx-side-img');
            if (imgDiv) { imgDiv.style.backgroundImage = `url('${fallbackImage}')`; imgDiv.classList.remove('flx-loading-img'); }
        }
    }

    sideItems.forEach((item, index) => {
        item.setAttribute('data-img', fallbackImage);
        item.setAttribute('data-forum-name', ''); 
        let linkEl = item.querySelector('.flx-post-title');
        if (linkEl && linkEl.href) { fetchTopicData(linkEl.href, item, index); }
        item.addEventListener('click', () => { changeSlide(index); });
    });

    function renderHero(index) {
        const item = sideItems[index];
        if(!item) return;
        try {
            const titleEl = item.querySelector('.flx-post-title'), timeEl = item.querySelector('.flx-time-val'), authorEl = item.querySelector('.flx-author-val');
            const img = item.getAttribute('data-img'), forumName = item.getAttribute('data-forum-name');
            const titleText = titleEl ? titleEl.innerText : 'بدون عنوان', link = titleEl ? titleEl.href : '#', timeText = timeEl ? timeEl.innerText.replace('access_time', '').trim() : '', authorText = authorEl ? authorEl.innerText.replace('person', '').trim() : 'عضو';

            let displayTitle = titleText;
            if(forumName && forumName !== '') {
                displayTitle = `<span style="background: var(--primary-color, #3498db); color: #fff; padding: 3px 10px; border-radius: 50px; font-size: 13px; margin-left: 10px; font-weight:bold; vertical-align: middle;">${forumName}</span> <span style="vertical-align: middle;">${titleText}</span>`;
            }

            document.getElementById('flx-heroBg').style.backgroundImage = `url('${img}')`;
            let heroTitleEl = document.getElementById('flx-heroTitle'); if(heroTitleEl) { heroTitleEl.innerHTML = displayTitle; heroTitleEl.href = link; }
            let heroAuthEl = document.getElementById('flx-heroAuthor'); if(heroAuthEl) heroAuthEl.innerHTML = `<i class="fas fa-user"></i> ${authorText}`;
            let heroTimeEl = document.getElementById('flx-heroTime'); if(heroTimeEl) heroTimeEl.innerHTML = `<i class="fas fa-clock"></i> ${timeText}`;

            sideItems.forEach(el => el.classList.remove('flx-active-slide'));
            item.classList.add('flx-active-slide');
        } catch (e) { console.error(e); }
    }

    function changeSlide(index) { currentActiveSlide = index; renderHero(index); resetSlideTimer(); }
    function autoNextSlide() { currentActiveSlide = (currentActiveSlide + 1) % sideItems.length; renderHero(currentActiveSlide); }
    function startSlideTimer() { slideIntervalTimer = setInterval(autoNextSlide, 4500); }
    function resetSlideTimer() { clearInterval(slideIntervalTimer); startSlideTimer(); }

    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideIntervalTimer));
    sliderContainer.addEventListener('mouseleave', startSlideTimer);

    renderHero(0);
    startSlideTimer();
}


document.addEventListener("DOMContentLoaded", function() {
    loadSettings(); 
    initUserData(); 
    initDynamicSlider(); 
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-icons') && !event.target.closest('#settingsPanel')) { 
            document.querySelectorAll('.dropdown-panel').forEach(d => d.classList.remove('active')); 
        }
    });
    const authModalEl = document.getElementById('authModal');
    if(authModalEl) authModalEl.addEventListener('click', function(e) { if(e.target === this) closeAuthModal(); });
    const searchModalEl = document.getElementById('searchModal');
    if(searchModalEl) searchModalEl.addEventListener('click', function(e) { if(e.target === this) closeSearch(); });

   
    const codeBoxes = document.querySelectorAll('.codebox');
    codeBoxes.forEach((box, index) => {
        const codeElement = box.querySelector('code');
        if (!codeElement) return;

        let rawCode = codeElement.innerText.trim();

        const detectCodeType = (code) => {
            if (/^(<!--|<!DOCTYPE|<html|<head|<body|<div|<table|<script|<style)/i.test(code)) return { name: 'HTML', ext: 'html', mime: 'text/html' };
            if (/(function\s*\(|var\s+|let\s+|const\s+|\$\(|document\.|window\.|console\.log)/i.test(code)) return { name: 'JavaScript', ext: 'js', mime: 'text/javascript' };
            if (/(margin|padding|color|background-color|font-size|border)\s*:/i.test(code) && /\{[\s\S]*\}/.test(code) && !/<\/?[a-z][\s\S]*>/i.test(code)) return { name: 'CSS', ext: 'css', mime: 'text/css' };
            if (/<\/?[a-z][\s\S]*>/i.test(code)) return { name: 'HTML', ext: 'html', mime: 'text/html' };
            if (/^(http:\/\/|https:\/\/|www\.)/i.test(code)) return { name: 'روابط', ext: 'txt', mime: 'text/plain' };
            return { name: 'نص عام', ext: 'txt', mime: 'text/plain' };
        };

        const codeType = detectCodeType(rawCode);
        const toolbar = document.createElement('div');
        toolbar.className = 'codebox-toolbar';
        toolbar.style.display = 'flex'; toolbar.style.justifyContent = 'space-between'; toolbar.style.alignItems = 'center'; toolbar.style.marginBottom = '10px'; toolbar.style.paddingBottom = '5px'; toolbar.style.borderBottom = '1px dashed #ccc';

        const langLabel = document.createElement('span');
        langLabel.className = 'codebox-lang'; langLabel.style.fontWeight = 'bold'; langLabel.style.color = 'var(--primary-color, #27ae60)';
        langLabel.innerHTML = `نوع &nbsp;الكود: <span style="text-transform: uppercase;">${codeType.name}</span>`;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'codebox-buttons';
        const btnStyle = "cursor:pointer; margin-right:5px; padding:4px 10px; border:1px solid #ddd; background:#f9f9f9; color:#333; border-radius:3px; font-family:tahoma; font-size:12px; transition:0.3s;";

        const selectBtn = document.createElement('button');
        selectBtn.style.cssText = btnStyle; selectBtn.innerHTML = '<i class="fa fa-check-square"></i> تحديد الكل';
        selectBtn.onclick = function() { const range = document.createRange(); range.selectNodeContents(codeElement); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); };

        const copyBtn = document.createElement('button');
        copyBtn.style.cssText = btnStyle; copyBtn.innerHTML = '<i class="fa fa-copy"></i> نسخ';
        copyBtn.onclick = function() {
            navigator.clipboard.writeText(rawCode).then(() => {
                copyBtn.innerHTML = '<i class="fa fa-check" style="color:green;"></i> تم &nbsp;النسخ!';
                setTimeout(() => { copyBtn.innerHTML = '<i class="fa fa-copy"></i> نسخ'; }, 2000);
            }).catch(err => {
                const textArea = document.createElement("textarea"); textArea.value = rawCode; document.body.appendChild(textArea); textArea.select(); document.execCommand("Copy"); textArea.remove();
                copyBtn.innerHTML = '<i class="fa fa-check" style="color:green;"></i> تم &nbsp;النسخ!'; setTimeout(() => { copyBtn.innerHTML = '<i class="fa fa-copy"></i> نسخ'; }, 2000);
            });
        };

        const downloadBtn = document.createElement('button');
        downloadBtn.style.cssText = btnStyle; downloadBtn.innerHTML = `<i class="fa fa-download"></i> تحميل (${codeType.ext.toUpperCase()})`;
        downloadBtn.onclick = function() {
            const blob = new Blob([rawCode], { type: codeType.mime }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `code_${index + 1}.${codeType.ext}`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        };

        btnContainer.appendChild(downloadBtn); btnContainer.appendChild(copyBtn); btnContainer.appendChild(selectBtn);
        toolbar.appendChild(langLabel); toolbar.appendChild(btnContainer); box.insertBefore(toolbar, box.firstChild);
    });
});


function fetchThumbnails() {
    if(!$('body').hasClass('grid-layout')) return;
    $('.board-row').each(function() {
        var $row = $(this);
        var $link = $row.find('.lp-title a.topic-title').length ? $row.find('.lp-title a.topic-title') : $row.find('.lp-title a').last();
        var topicLink = $link.attr('href');
        var $thumbnail = $row.find('.topic-thumbnail');
        
        if(topicLink && !$thumbnail.attr('data-loaded')) {
            $thumbnail.attr('data-loaded', 'loading');
            $.ajax({
                url: topicLink, type: 'GET',
                success: function(response) {
                    var parser = new DOMParser(); var doc = parser.parseFromString(response, "text/html");
                    let contentImages = getFirstPostImages(doc);
                    let validImgSrc = null;

                    (async function() {
                        for (let img of contentImages) {
                            if (isValidTopicImage(img)) {
                                let src = $(img).attr('src');
                                let isLarge = await verifyImageSize(src);
                                if (isLarge) { validImgSrc = src; break; }
                            }
                        }
                        
                        if(validImgSrc) {
                            $thumbnail.css('background-image', 'url(' + validImgSrc + ')');
                            $thumbnail.find('i').fadeOut(); 
                            $thumbnail.attr('data-loaded', 'true');
                        } else { 
                            $thumbnail.attr('data-loaded', 'no-image'); 
                        }
                    })();
                },
                error: function() { $thumbnail.attr('data-loaded', 'error'); }
            });
        }
    });
}

function setForumLayout(layout, btn) {
    if(layout === 'grid') { $('body').addClass('grid-layout'); localStorage.setItem('forum_layout', 'grid'); fetchThumbnails(); } 
    else { $('body').removeClass('grid-layout'); localStorage.setItem('forum_layout', 'list'); }
    if(btn) { $('.layout-modes .theme-btn').removeClass('active-btn'); $(btn).addClass('active-btn'); }
}

$(document).ready(function() {
    
    $('.post-content img, .postbody .content img, .entry-content img').each(function() {
        var $img = $(this);
        if (!isValidTopicImage(this)) return;

        $img.on('load', function() {
            var originalSrc = $img.attr('src');
            var originalWidth = this.naturalWidth;
            
            if (originalWidth > 450) {
                $img.css({ width: '450px', height: 'auto', 'max-width': '100%' });
                if (!$img.parent().hasClass('image-wrapper')) {
                    $img.wrap('<div class="image-wrapper" style="position:relative; display:inline-block; max-width:100%;"></div>');
                    var $wrapper = $img.parent();
                    var toolbar = $(`
                        <div class="image-toolbar" style="background:rgba(0,0,0,0.7); color:#fff; padding:5px 10px; border-radius:5px 5px 0 0; display:flex; justify-content:space-between; font-size:12px; margin-bottom:-4px; position:relative; z-index:2;">
                            <div class="preview" style="cursor:pointer;"><i class="fa fa-external-link"></i> معاينة الصورة كاملة</div>
                            <span class="toggle-size" style="cursor:pointer;"><i class="fa fa-search-plus"></i> تكبير الصورة</span>
                        </div>
                    `);
                    $wrapper.prepend(toolbar);
                    
                    toolbar.find('.toggle-size').on('click', function(e) {
                        e.preventDefault(); e.stopPropagation();
                        var $this = $(this);
                        if ($img.hasClass('expanded')) {
                            $img.removeClass('expanded').css({ width: '450px', height: 'auto' });
                            $this.html('<i class="fa fa-search-plus"></i> تكبير الصورة');
                        } else {
                            $img.addClass('expanded').css({ width: originalWidth, height: 'auto' });
                            $this.html('<i class="fa fa-search-minus"></i> تصغير الصورة');
                        }
                    });
                    
                    toolbar.find('.preview').on('click', function(e) {
                        e.preventDefault(); e.stopPropagation();
                        window.open(originalSrc, '_blank');
                    });
                }
            }
        });
        if ($img[0].complete) { $img.trigger('load'); }
    });

    $('.board-row').each(function() {
        var $subContainer = $(this).find('.sub-boards-container');
        var $toggleBtn = $(this).find('button[onclick*="toggleSubBoards"]');
        if ($subContainer.length === 0 || $subContainer.find('a').length === 0) { $toggleBtn.css('display', 'none'); }
    });

    if(localStorage.getItem('forum_layout') === 'grid') {
        setForumLayout('grid'); $('.layout-modes button[data-layout="grid"]').addClass('active-btn').siblings().removeClass('active-btn');
    }

    if(typeof Fancybox !== 'undefined') {
        $('.content img, .entry-content img, .postbody .content img').each(function() {
            var $img = $(this);
            var imgSrc = $img.attr('src');
            
            if (isValidTopicImage(this)) {
                $img.attr('data-fancybox', 'gallery');
                $img.attr('data-src', imgSrc);
                $img.css({ 'cursor': 'zoom-in', 'pointer-events': 'auto' });
            }
        });

        Fancybox.bind('[data-fancybox="gallery"]', {
            groupAll: true, 
            Toolbar: { display: ["zoom", "slideShow", "fullScreen", "download", "close"] },
        });
    }

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.flx-contact-wrapper').length) { $('.flx-contact-toggle.active').removeClass('active'); $('.flx-contact-list:visible').slideUp(200); }
    });
    $('.flx-contact-toggle').on('click', function(e) {
        e.preventDefault(); var $btn = $(this); var $list = $btn.siblings('.flx-contact-list');
        $btn.toggleClass('active');
        if($list.text().trim() === "" && $list.find('img').length === 0) { $list.html('<span style="font-size:12px;color:gray;padding:0 5px;">لا توجد بيانات</span>'); }
        $list.slideToggle(250);
    });
    $('.flx-main-topic').first().find('.show-only-first-post').show();

    $('.flx-main-topic, .flx-reply-topic').each(function() {
        var $card = $(this); var $userLink = $card.find('.flx-get-uid a');
        if ($userLink.length > 0) { var match = $userLink.attr('href').match(/\/u(\d+)/); if (match && match[1]) { $card.find('.flx-put-uid').text(match[1]); } else { $card.find('.flx-put-uid').text('غير محدد'); } } 
        else { $card.find('.flx-put-uid').text('زائر'); }
    });

  
    var avatarCache = JSON.parse(localStorage.getItem('flx_avatar_cache')) || {}; 
    
    $('.raw-likes-data').each(function() {
        var $box = $(this); 
        var $hiddenLikes = $box.find('.hidden-raw-likes');
        var rawText = $hiddenLikes.text() || ''; 
        var likers = $hiddenLikes.find('a'); 
        
        var likersHTML = '';
        var fetchQueue = []; 
        var addedUsers = {}; 
        var totalLikesCount = 0; 
        
        if ((rawText.indexOf('أنت') !== -1 || rawText.indexOf('You') !== -1) && typeof _userdata !== "undefined" && _userdata.session_logged_in == 1) {
            var myUrl = '/u' + _userdata.user_id;
            var myName = _userdata.username;
            var myAvatar = 'https://i.servimg.com/u/f60/19/93/33/22/user10.png';
            
            if (avatarCache[myUrl]) {
                myAvatar = avatarCache[myUrl];
            } else if (_userdata.avatar && _userdata.avatar !== "") {
                if (_userdata.avatar.indexOf('<img') !== -1) {
                    var match = _userdata.avatar.match(/src=["'](.*?)["']/);
                    if (match && match[1]) myAvatar = match[1];
                } else { myAvatar = _userdata.avatar; }
            }
            
            likersHTML += '<a href="'+myUrl+'" class="flx-liker-chip" data-title="'+myName+'"><img src="'+myAvatar+'" alt="'+myName+'"></a>';
            addedUsers[myUrl] = true; 
            totalLikesCount++;
        }
        
        if (likers.length > 0 || likersHTML !== '') {
            $box.css('display', 'block'); 
            
            likers.each(function() {
                var username = $(this).text().trim(); 
                var profileUrl = $(this).attr('href'); 
                var tempId = 'like-chip-' + Math.floor(Math.random() * 1000000); 
                
                if(username !== "" && profileUrl !== "#" && !addedUsers[profileUrl]) {
                    addedUsers[profileUrl] = true;
                    totalLikesCount++;
                    
                    var pageAvatar = null;
                    var $userInPage = $('.flx-get-uid a[href="'+profileUrl+'"]').first().closest('.flx-main-topic, .flx-reply-topic');
                    if ($userInPage.length > 0) pageAvatar = $userInPage.find('.flx-avatar-box img').attr('src');
                    
                    var defaultAvatar = 'https://i.servimg.com/u/f60/19/93/33/22/user10.png'; 
                    var displayAvatar = defaultAvatar;
                    var needsFetch = false;
                    
                    if (pageAvatar) { displayAvatar = pageAvatar; avatarCache[profileUrl] = pageAvatar; } 
                    else if (avatarCache[profileUrl]) { displayAvatar = avatarCache[profileUrl]; } 
                    else { needsFetch = true; }
                    
                    likersHTML += '<a href="'+profileUrl+'" class="flx-liker-chip" id="'+tempId+'" data-title="'+username+'"><img src="'+displayAvatar+'" alt="'+username+'"></a>';
                    
                    if(needsFetch) fetchQueue.push({id: tempId, url: profileUrl});
                }
            });
            
            var $titleNode = $box.contents().filter(function() { return this.nodeType === 3 && this.nodeValue.trim().length > 0; });
            if ($titleNode.length > 0 && $box.find('.flx-likes-total-box').length === 0) {
                $box.prepend('<span class="flx-likes-total-box" style="font-weight:bold; color:var(--primary-color, #3b82f6); margin-right:5px; font-size:16px;">('+totalLikesCount+')</span>');
            }
            
            $box.find('.flx-likers-container').html(likersHTML).addClass('stacked-avatars'); 
            
            fetchQueue.forEach(function(item) {
                $.ajax({
                    url: item.url, type: 'GET',
                    success: function(data) {
                        var parser = new DOMParser(); var doc = parser.parseFromString(data, "text/html");
                        var $imgTarget = $(doc).find('.user-avatar img, .avatar img, img.avatar, .forumline .row1 img:not([src*="icon"]), .module .avatar img, dl.left-box.details img, #profile-advanced-add img, .user-profile-avatar img, .page-content .row1 img, #profile-advanced-details img, .panel img[src*="avatar"]').not('img[src*="smilies"], img[src*="icon"], img[src*="logo"]').first();
                        var avatarSrc = $imgTarget.attr('src');
                        if(avatarSrc && avatarSrc.trim() !== '') {
                            avatarCache[item.url] = avatarSrc;
                            $('#' + item.id + ' img').attr('src', avatarSrc);
                            localStorage.setItem('flx_avatar_cache', JSON.stringify(avatarCache));
                        }
                    }
                });
            });
            localStorage.setItem('flx_avatar_cache', JSON.stringify(avatarCache));
        }
    });

    $('.fa_like_div .rep-button').each(function() { 
        var vanillaEl = this; var clone = vanillaEl.cloneNode(true); vanillaEl.parentNode.replaceChild(clone, vanillaEl); 
    });
    
    $(document).on('click', '.fa_like_div .rep-button', function(e) {
        e.preventDefault();
        if(typeof _userdata === "undefined" || _userdata.session_logged_in != 1) return alert("يجب تسجيل الدخول للإعجاب بالمواضيع."); 
        
        var $btn = $(this); if($btn.hasClass('flx-processing')) return; 
        
        var $article = $btn.closest('article, .post, .row'); 
        var postId = $article.attr('id').replace(/[^0-9]/g, '');
        var $likesBox = $('#likes_p' + postId); 
        var $likersContainer = $likesBox.find('.flx-likers-container');
        
        var currentUserIdUrl = '/u' + _userdata.user_id;
        var myName = _userdata.username;
        var myAvatar = 'https://i.servimg.com/u/f60/19/93/33/22/user10.png';
        
        if (typeof avatarCache !== 'undefined' && avatarCache[currentUserIdUrl]) {
            myAvatar = avatarCache[currentUserIdUrl];
        } else if (_userdata.avatar && _userdata.avatar !== "") { 
            if (_userdata.avatar.indexOf('<img') !== -1) { var match = _userdata.avatar.match(/src=["'](.*?)["']/); if (match && match[1]) myAvatar = match[1]; } else { myAvatar = _userdata.avatar; } 
        }

        var $existingChip = $likersContainer.find('a[href="'+currentUserIdUrl+'"]'); 
        var isLiked = $existingChip.length > 0;
        
        var urlLike = $btn.attr('data-href') || ('/eval?eval=plus&p=' + postId);
        var urlRmLike = $btn.attr('data-href-rm') || ('/eval?eval=minus&p=' + postId);
        var targetUrl = isLiked ? urlRmLike : urlLike; 

        $btn.addClass('flx-processing').css('opacity', '0.6');
        
        $.get(targetUrl, function() {
            $btn.removeClass('flx-processing').css('opacity', '1');
            
            var currentBtnCount = parseInt($btn.find('.like-count').text().replace(/[^0-9]/g, '')) || 0;
            var currentTotalCount = parseInt($likesBox.find('.flx-likes-total-box').text().replace(/[^0-9]/g, '')) || 0;
            
            if(isLiked) {
                $existingChip.fadeOut(200, function() { 
                    $(this).remove(); 
                    if($likersContainer.children('.flx-liker-chip').length === 0) { 
                        $likesBox.slideUp(250); $likersContainer.removeClass('stacked-avatars'); 
                    } 
                });
                
                $btn.find('.like-icon').text('thumb_up_off_alt'); 
                $btn.find('.like-text').text('إعجاب');
                var newBtnCount = Math.max(0, currentBtnCount - 1); 
                $btn.find('.like-count').text(newBtnCount > 0 ? newBtnCount : '');
                
                var newTotalCount = Math.max(0, currentTotalCount - 1);
                if(newTotalCount > 0) $likesBox.find('.flx-likes-total-box').text('('+newTotalCount+')');
                
            } else {
                var chipHtml = '<a href="'+currentUserIdUrl+'" class="flx-liker-chip" data-title="'+myName+'" style="display:none;"><img src="'+myAvatar+'" alt="'+myName+'"></a>';
                
                if($likesBox.is(':hidden') || $likersContainer.children().length === 0) { 
                    $likersContainer.empty().addClass('stacked-avatars');
                    
                    if($likesBox.find('.flx-likes-total-box').length === 0) {
                        $likesBox.prepend('<span class="flx-likes-total-box" style="font-weight:bold; color:var(--primary-color, #3b82f6); margin-right:5px; font-size:16px;">(1)</span>');
                    }
                    $likesBox.slideDown(250); 
                }
                
                $likersContainer.prepend(chipHtml); 
                $likersContainer.find('a[href="'+currentUserIdUrl+'"]').fadeIn(300);
                
                $btn.find('.like-icon').text('thumb_up'); 
                $btn.find('.like-text').text('إلغاء الإعجاب'); 
                $btn.find('.like-count').text(currentBtnCount + 1);
                
                $likesBox.find('.flx-likes-total-box').text('('+(currentTotalCount + 1)+')');
                
                if(typeof avatarCache !== 'undefined') {
                    avatarCache[currentUserIdUrl] = myAvatar;
                    localStorage.setItem('flx_avatar_cache', JSON.stringify(avatarCache));
                }
            }
        }).fail(function() { $btn.removeClass('flx-processing').css('opacity', '1'); });
    });

    var titleText = $('#topic-main-title').text().replace(/<[^>]+>/g, ' ').trim();
    var contentText = $('#first-post-content').text().replace(/<[^>]+>/g, ' ').trim();
    var stopWords = ['في','من','على','إلى','عن','مع','هذا','هذه','أن','إن','ولا','وما','كيف','كان','كانت','التي','الذي','هو','هي','تم','كل','وقد','أو','كما','بين','عند','بعد','قبل','حتى','إذا','فقط','غير','ذلك','هل','ولم','أنه','بها','به','عليه','إليه','أنا','نحن','لكن','ليس','ولكن','إلا','أكثر','بعض','أيضا','حيث','ومن','فإن','أجل','ذات','دون','أما'];
    var wordCounts = {};
    function extractWords(text, weight) {
        var words = text.split(/\s+/);
        words.forEach(function(word) {
            word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""''؟،]/g,"").trim();
            if(word.length > 3 && stopWords.indexOf(word) === -1 && isNaN(word)) { wordCounts[word] = (wordCounts[word] || 0) + weight; }
        });
    }
    extractWords(titleText, 3); extractWords(contentText, 1);
    var sortedWords = Object.keys(wordCounts).sort(function(a, b) { return wordCounts[b] - wordCounts[a]; });
    var topTags = sortedWords.slice(0, 6); 
    if(topTags.length > 0) {
        $('#dynamic-meta-box').css('display', 'flex'); $('#flx-auto-tags').css('display', 'flex');
        topTags.forEach(function(tag) { 
            $('#flx-auto-tags .tags-container').append('<a href="/search?search_keywords=' + encodeURIComponent(tag) + '" title="البحث عن: ' + tag + '">#' + tag + '</a>'); 
        });
    }

    var seenUsers = {}; var participantsCount = 0; $('#flx-participants .avatars-container').empty();
    $('.flx-main-topic, .flx-reply-topic').each(function() {
        var $card = $(this); var $userLinkObj = $card.find('.flx-get-uid a');
        var userLink = $userLinkObj.length > 0 ? $userLinkObj.attr('href') : null;
        var userName = $card.find('.flx-get-uid').text().trim();
        var userAvatarSrc = $card.find('.flx-avatar-box img').attr('src');
        var uniqueKey = userLink ? userLink : 'guest_' + userName;

        if (userName && userName !== "" && !seenUsers[uniqueKey] && userAvatarSrc) {
            seenUsers[uniqueKey] = true; participantsCount++;
            var avatarHTML = userLink ? '<a href="'+userLink+'" title="'+userName+'"><img src="'+userAvatarSrc+'" alt="'+userName+'"></a>' : '<span title="'+userName+'"><img src="'+userAvatarSrc+'" alt="'+userName+'"></span>';
            $('#flx-participants .avatars-container').append(avatarHTML);
        }
    });
    if(participantsCount > 0) { $('#dynamic-meta-box').css('display', 'flex'); $('#flx-participants').css('display', 'flex'); }

    $('#flx-mod-form a').each(function() {
        var $link = $(this); var href = $link.attr('href').toLowerCase();
        var title = $link.attr('title') || $link.find('img').attr('title') || $link.find('img').attr('alt') || '';
        var icon = 'settings'; 
        if(href.indexOf('delete') !== -1) { icon = 'delete'; title = 'حذف'; }
        else if(href.indexOf('move') !== -1) { icon = 'drive_file_move'; title = 'نقل'; }
        else if(href.indexOf('lock') !== -1) { icon = 'lock'; title = 'إغلاق'; }
        else if(href.indexOf('unlock') !== -1) { icon = 'lock_open'; title = 'فتح'; }
        else if(href.indexOf('split') !== -1) { icon = 'call_split'; title = 'فصل'; }
        else if(href.indexOf('merge') !== -1) { icon = 'merge_type'; title = 'دمج'; }
        else if(href.indexOf('trash') !== -1) { icon = 'restore_from_trash'; title = 'سلة المهملات'; }
        else if(href.indexOf('sticky') !== -1) { icon = 'push_pin'; title = 'تثبيت'; }
        $link.empty(); $link.addClass('mod-css-btn'); $link.html('<i class="material-icons">'+icon+'</i> ' + title);
    });

    $('.btn-quote-multi').on('click', function() { $(this).toggleClass('mq-active'); });
});