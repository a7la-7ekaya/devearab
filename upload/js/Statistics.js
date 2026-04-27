// وظائف تبديل التبويبات
function switchTopicTab(event, targetId) {
    document.querySelectorAll('.cyb-col-right .cyb-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#topicTabs li').forEach(t => t.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    event.currentTarget.classList.add('active');
}
function switchMemberStats() {
    var sel = document.getElementById("memberSelect").value;
    document.querySelectorAll('.cyb-col-left .cyb-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(sel).classList.add('active');
}

$(document).ready(function() {
    // 1. نقل البيانات وتلوين الأرقام
    function moveData(sourceId, targetSelector) {
        let sourceEl = document.getElementById(sourceId);
        let targetEl = document.querySelector(targetSelector);
        if(sourceEl && targetEl) {
            targetEl.innerHTML = sourceEl.innerHTML;
            let items = targetEl.querySelectorAll('li');
            items.forEach((item, index) => {
                let colorClass = 'num-c' + Math.min(Math.ceil((index + 1) / 2), 5);
                let numSpans = item.querySelectorAll('.topic-num, .rank-num');
                numSpans.forEach(span => { span.innerText = (index + 1); span.classList.add(colorClass); });
            });
        }
    }

    moveData('raw_mod_recent_topics', '#tab-last-posts .cyb-list');
    moveData('raw_mod_new_topics', '#tab-new-topics .cyb-list');
    moveData('raw_mod_most_active_topics', '#tab-most-active .cyb-list');
    moveData('raw_mod_most_viewed_topics', '#tab-most-popular .cyb-list');
    moveData('raw_mod_top_posters', '#mem-all .cyb-list');
    moveData('raw_mod_top_week', '#mem-week .cyb-list');
    moveData('raw_mod_top_month', '#mem-month .cyb-list');
    moveData('raw_mod_top_liked', '#mem-rating .cyb-list');
    moveData('raw_mod_top_starters', '#mem-topics .cyb-list');

    let hiddenContainer = document.getElementById('hidden-raw-stats');
    if(hiddenContainer) hiddenContainer.remove();

    // 2. إنشاء الرسم البياني 
    setTimeout(function() {
        function buildCharts(tabId) {
            let items = $(tabId + ' .chart-container');
            if(items.length === 0) return;
            let dataArray = []; let maxValue = 0;
            items.each(function() {
                let rawText = $(this).find('.raw-title-data').text().replace(/,/g, '');
                let numbers = rawText.match(/\d+/g); 
                let num = numbers ? parseInt(numbers[numbers.length - 1]) : 0;
                let typeLabel = $(this).find('.dynamic-chart-area').attr('data-type');
                dataArray.push({ targetDiv: $(this).find('.dynamic-chart-area'), value: num, label: typeLabel });
                if(num > maxValue) maxValue = num;
            });
            dataArray.forEach(function(item) {
                let percentage = maxValue > 0 ? Math.round((item.value / maxValue) * 100) : 0;
                let chartHtml = `
                    <div class="stat-progress-wrapper">
                        <div class="stat-progress-text"><span>${percentage}%</span><span class="val">${item.value} ${item.label}</span></div>
                        <div class="stat-progress-track"><div class="stat-progress-fill" style="width: ${percentage}%;"></div></div>
                    </div>`;
                item.targetDiv.html(chartHtml);
            });
        }
        buildCharts('#tab-most-active');
        buildCharts('#tab-most-popular');
    }, 500);

    // 3. بطاقة العضو المنبثقة (Hover Card) المحدثة للتوافق مع التصميم الجديد
    if ($('#userHoverCard').length === 0) { $('body').append('<div id="userHoverCard" class="user-hover-card"></div>'); }
    let hoverCard = $('#userHoverCard');
    let cache = {}; let hideTimer;

    $('.cyb-stats-wrapper').on('mouseenter', 'a[href*="/u"]', function(e) {
        clearTimeout(hideTimer);
        let profileUrl = $(this).attr('href');
        let fallbackName = $(this).text().trim(); 
        if(!profileUrl.match(/\/u\d+/)) return;

        let rect = this.getBoundingClientRect();
        let top = rect.top + window.scrollY + 25;
        let left = rect.left + window.scrollX - (260 - rect.width) / 2;
        hoverCard.css({ top: top + 'px', left: left + 'px' }).addClass('show');

        if(cache[profileUrl]) { hoverCard.html(cache[profileUrl]); return; }

        hoverCard.html('<div class="uhc-loading"><i class="fas fa-circle-notch fa-spin fa-2x"></i><br><br>جاري جلب البيانات...</div>');

        $.get(profileUrl, function(data) {
            // تنظيف البيانات من السكريبتات لتجنب المشاكل أثناء الـ Parsing
            let cleanHtml = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
            let htmlData = $('<div>').html(cleanHtml);
            
            // 1. جلب الصورة الرمزية
            let avatar = htmlData.find('.pro-avatar-box img').attr('src');
            if (!avatar || avatar.indexOf('no_avatar') !== -1 || avatar.indexOf('deleted') !== -1) {
                avatar = htmlData.find('img[src*="avatar"]').first().attr('src') || 'https://i.postimg.cc/cJDvR91C/default-avatar.png';
            }

            // 2. جلب الاسم (مع لون المجموعة إن وجد)
            let userNameHtml = htmlData.find('.profile-username span').prop('outerHTML') || fallbackName;

            // 3. جلب الرتبة (النص + الصورة)
            let rankText = "عضو بالمنتدى";
            let rankElement = htmlData.find('.profile-rank');
            if (rankElement.length > 0) {
                let txt = rankElement.text().replace('الرتبة:', '').trim();
                let img = rankElement.find('img').attr('src');
                rankText = txt;
                if(img) {
                    rankText += ` <img src="${img}" style="height: 18px; vertical-align: middle; margin-right: 5px;">`;
                }
            }

            // دالة للبحث الذكي عن الحقول (النشاط، المساهمات، الجنس، التسجيل)
            function getFieldData(labelToFind, isImage = false) {
                let result = '';
                htmlData.find('dt.pf-label').each(function() {
                    if ($(this).text().indexOf(labelToFind) !== -1) {
                        let contentDiv = $(this).next('dd.pf-content').find('.field_uneditable');
                        if (isImage && contentDiv.find('img').length > 0) {
                            result = contentDiv.find('img').attr('title') || contentDiv.find('img').attr('alt');
                        } else {
                            result = contentDiv.text().trim();
                        }
                    }
                });
                return result;
            }

            // 4. استخراج البيانات المتبقية
            let gender = getFieldData('الجنس', true) || 'غير محدد';
            let postsCount = getFieldData('المساهمات', false) || '0';
            let activity = getFieldData('النشاط', false) || 'متوسط';
            let joinDate = getFieldData('تاريخ التسجيل', false) || '-';
            
            // تحديد أيقونة الجنس
            let genderIcon = gender.indexOf('ذكر') !== -1 ? 'fa-mars' : (gender.indexOf('انثى') !== -1 || gender.indexOf('أنثى') !== -1 ? 'fa-venus' : 'fa-genderless');
            
            let pmLink = '/privmsg?mode=post&u=' + profileUrl.replace(/\D/g, '');

            let cardContent = `
                <div class="uhc-header">
                    <img src="${avatar}" class="uhc-avatar" onerror="this.src='https://i.postimg.cc/cJDvR91C/default-avatar.png'">
                    <div class="uhc-user-info">
                        <h4 class="uhc-name" style="margin-bottom:0;">${userNameHtml}</h4>
                        <span class="uhc-rank">${rankText}</span>
                    </div>
                </div>
                <div class="uhc-stats">
                    <div class="uhc-stat-row"><span><i class="fas ${genderIcon}"></i> الجنس:</span><strong>${gender}</strong></div>
                    <div class="uhc-stat-row"><span><i class="fas fa-comment-dots"></i> المساهمات:</span><strong>${postsCount}</strong></div>
                    <div class="uhc-stat-row"><span><i class="fas fa-chart-line"></i> النشاط:</span><strong>${activity}</strong></div>
                    <div class="uhc-stat-row"><span><i class="fas fa-calendar-alt"></i> التسجيل:</span><strong dir="ltr">${joinDate}</strong></div>
                </div>
                <a href="${pmLink}" class="uhc-pm-btn"><i class="fas fa-envelope"></i> إرسال رسالة خاصة</a>
            `;
            
            cache[profileUrl] = cardContent; 
            hoverCard.html(cardContent);

        }).fail(function() { 
            hoverCard.html('<div class="uhc-loading text-danger">تعذر جلب البيانات</div>'); 
        });
    });

    $('.cyb-stats-wrapper').on('mouseleave', 'a[href*="/u"]', function() { 
        hideTimer = setTimeout(function() { hoverCard.removeClass('show'); }, 300); 
    });
    
    hoverCard.on('mouseenter', function() { clearTimeout(hideTimer); });
    hoverCard.on('mouseleave', function() { 
        hideTimer = setTimeout(function() { hoverCard.removeClass('show'); }, 300); 
    });
});
