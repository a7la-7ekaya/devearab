$(document).ready(function() {

    // --- 1. تفعيل السلايد شو الذكي للصور ---
    $('.content img:not(.smilies):not([src*="illiweb"]):not([src*="hits"])').each(function() {
        var $img = $(this);
        var parentA = $img.closest('a');
        if (parentA.length > 0) {
            parentA.attr('data-fancybox', 'gallery'); 
            parentA.attr('href', $img.attr('src')); 
            parentA.css('cursor', 'zoom-in');
            parentA.on('click', function(e) { e.preventDefault(); });
        } else {
            $img.wrap('<a href="' + $img.attr('src') + '" data-fancybox="gallery" style="cursor: zoom-in;"></a>');
        }
    });

    Fancybox.bind('[data-fancybox="gallery"]', {
        Toolbar: { display: { left: ["infobar"], middle: [], right: ["zoomIn", "zoomOut", "close"] } }
    });

    // --- 2. إظهار/إخفاء قائمة بيانات التواصل ---
    $('.flx-contact-toggle').on('click', function() {
        var $btn = $(this);
        var $list = $btn.siblings('.flx-contact-list');
        var isMainTopic = $btn.closest('.flx-main-topic').length > 0;

        $btn.toggleClass('active');
        
        if($list.text().trim() === "" && $list.find('img').length === 0) {
            $list.html('<span style="font-size:12px;color:gray;padding:0 5px;">لا توجد بيانات</span>');
        }

        if(isMainTopic) {
            $list.animate({width: 'toggle', opacity: 'toggle'}, 250);
        } else {
            $list.slideToggle(200);
        }
    });
    
    $('.flx-main-topic').first().find('.show-only-first-post').show();

    // --- 3. استخراج رقم العضوية ---
    $('.flx-main-topic, .flx-reply-topic').each(function() {
        var $card = $(this);
        var $userLink = $card.find('.flx-get-uid a');
        if ($userLink.length > 0) {
            var profileUrl = $userLink.attr('href');
            var match = profileUrl.match(/\/u(\d+)/);
            if (match && match[1]) { $card.find('.flx-put-uid').text(match[1]); } 
            else { $card.find('.flx-put-uid').text('غير محدد'); }
        } else { $card.find('.flx-put-uid').text('زائر'); }
    });

    // --- 4. اللايكات (AJAX) ---
    $('.raw-likes-data').each(function() {
        var $box = $(this);
        var likers = $box.find('.hidden-raw-likes a'); 
        
        if (likers.length > 0) {
            $box.css('display', 'block'); 
            var names = [];
            var avatarHTML = '';
            
            likers.each(function(index) {
                var username = $(this).text().trim();
                var profileUrl = $(this).attr('href');
                var firstLetter = username.charAt(0).toUpperCase(); 
                var tempId = 'like-av-' + Math.floor(Math.random() * 10000); 
                
                if(username !== "") {
                    names.push(username);
                    if(index < 5) { 
                        avatarHTML += '<a href="'+profileUrl+'" class="fb-like-avatar" title="'+username+'" id="'+tempId+'">'+firstLetter+'</a>';
                        $.get(profileUrl, function(data) {
                            var avatarSrc = $(data).find('.module .avatar img, .forumline .row1 img.avatar, .user-avatar img').first().attr('src');
                            if(avatarSrc) { $('#' + tempId).html('<img src="'+avatarSrc+'" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">'); }
                        });
                    }
                }
            });
            $box.find('.flx-like-avatars').html(avatarHTML); 
            
            var textString = '';
            if(names.length === 1) { textString = '<b>' + names[0] + '</b> أعجبه هذا.'; } 
            else if(names.length === 2) { textString = '<b>' + names[0] + '</b> و <b>' + names[1] + '</b> أعجبهم هذا.'; } 
            else if(names.length > 2) { var others = names.length - 2; textString = '<b>' + names[0] + '</b>، <b>' + names[1] + '</b> و ' + others + ' آخرين أعجبهم هذا.'; }
            $box.find('.flx-like-text').html(textString);
        } else {
            var rawText = $box.find('.hidden-raw-likes').text().trim();
            if(rawText.length > 5) { $box.css('display', 'block'); $box.find('.flx-like-text').html(rawText); } 
            else { $box.remove(); }
        }
    });

    // --- 5. الكلمات الدليلية ---
    var firstPostText = $('#topic-main-title').text() + " " + $('#first-post-content').text().replace(/<[^>]+>/g, ' '); 
    var stopWords = ['في','من','على','إلى','عن','مع','هذا','هذه','أن','إن','ولا','وما','كيف','كان','كانت','التي','الذي','هو','هي','تم','كل','وقد','أو','كما','بين','عند','بعد','قبل','حتى','إذا','فقط','غير','ذلك','هل','ولم','أنه','بها','به','عليه','إليه','أنا','نحن'];
    var words = firstPostText.split(/\s+/);
    var wordCounts = {};
    words.forEach(function(word) {
        word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""'']/g,"").trim(); 
        if(word.length > 3 && stopWords.indexOf(word) === -1 && isNaN(word)) { wordCounts[word] = (wordCounts[word] || 0) + 1; }
    });
    var sortedWords = Object.keys(wordCounts).sort(function(a, b) { return wordCounts[b] - wordCounts[a]; });
    var topTags = sortedWords.filter(function(word) { return wordCounts[word] >= 1; }).slice(0, 6); 
    
    if(topTags.length > 0) {
        $('#dynamic-meta-box').css('display', 'flex');
        $('#flx-auto-tags').css('display', 'flex');
        topTags.forEach(function(tag) { $('#flx-auto-tags .tags-container').append('<span>#' + tag + '</span>'); });
    }

    // --- 6. صور المشاركين ---
    var seenUsers = {};
    var participantsCount = 0;
    $('.flx-reply-user').each(function() {
        var userLink = $(this).find('.flx-get-uid a').attr('href');
        var userName = $(this).find('.flx-get-uid').text().trim();
        var userAvatarSrc = $(this).find('.flx-avatar-box img').attr('src');
        if(userLink && !seenUsers[userLink] && userAvatarSrc) {
            seenUsers[userLink] = true;
            participantsCount++;
            $('#flx-participants .avatars-container').append('<a href="'+userLink+'" title="'+userName+'"><img src="'+userAvatarSrc+'" alt="'+userName+'"></a>');
        }
    });
    if(participantsCount > 0) {
        $('#dynamic-meta-box').css('display', 'flex');
        $('#flx-participants').css('display', 'flex');
    }

    // --- 7. جلب صورة الرد السريع ---
    if(typeof _userdata !== "undefined" && _userdata.session_logged_in == 1) {
        $('#current-user-name').text(_userdata.username);
        if(_userdata.avatar) {
            var avatarMatch = _userdata.avatar.match(/src="([^"]+)"/);
            if(avatarMatch && avatarMatch[1]) { $('#current-user-avatar').attr('src', avatarMatch[1]); }
        }
    }

    // --- 8. تحويل روابط أدوات الإشراف لـ CSS ---
    $('#flx-mod-form a').each(function() {
        var $link = $(this);
        var href = $link.attr('href').toLowerCase();
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
        
        $link.empty();
        $link.addClass('mod-css-btn');
        $link.html('<i class="material-icons">'+icon+'</i> ' + title);
    });

});

function shareTopic(platform) {
    var url = encodeURIComponent(window.location.href.split('#')[0]);
    var title = encodeURIComponent(document.title);
    var shareLink = '';
    if (platform === 'wa') { shareLink = 'https://api.whatsapp.com/send?text=' + title + ' - ' + url; } 
    else if (platform === 'fb') { shareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + url; } 
    else if (platform === 'tw') { shareLink = 'https://twitter.com/intent/tweet?text=' + title + '&url=' + url; }
    else if (platform === 'cp') {
        var dummy = document.createElement('input'), text = window.location.href.split('#')[0];
        document.body.appendChild(dummy); dummy.value = text; dummy.select();
        document.execCommand('copy'); document.body.removeChild(dummy);
        alert('تم نسخ رابط الموضوع بنجاح!'); return;
    }
    if(shareLink !== '') { window.open(shareLink, '_blank', 'width=600,height=400'); }
}