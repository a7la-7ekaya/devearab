$(document).ready(function() {
    

    if (!$('#fb-notif-styles').length) {
        $('head').append(`
        <style id="fb-notif-styles">
            #customNotifList { direction: rtl; text-align: right; font-family: inherit; }
            .fb-notif-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-bottom: 1px solid #e5e7eb; background: #fff; border-radius: 8px 8px 0 0; }
            .fb-notif-title { font-weight: bold; font-size: 1.1rem; color: #050505; }
            .fb-mark-read { font-size: 0.85rem; color: #1877f2; text-decoration: none; font-weight: bold; cursor: pointer; transition: 0.2s; background: none; border: none; }
            .fb-mark-read:hover { background: #f0f2f5; padding: 4px 8px; border-radius: 6px; margin: -4px -8px; }
            
            .notif-item-fb { display: flex; align-items: flex-start; padding: 12px 15px 12px 40px; border-bottom: 1px solid #f0f2f5; transition: 0.2s; position: relative; background: #fff; gap: 12px; min-height: 70px; cursor: pointer; }
            .notif-item-fb:hover { background: #f2f2f2; }
            

            .notif-item-fb.unread { background: #eaf3ff; }
            
            .notif-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 1px solid #e5e7eb; }
            .notif-content { flex: 1; display: flex; flex-direction: column; gap: 4px; pointer-events: none; }
            .notif-title { font-size: 0.95rem; color: #050505; line-height: 1.4; margin-bottom: 2px; }
            .notif-title a { font-weight: bold; color: #050505; text-decoration: none; pointer-events: auto; }
            .notif-time { font-size: 0.8rem; color: #65676b; display: flex; align-items: center; gap: 4px; }
            

            .unread-dot { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: #1877f2; border-radius: 50%; display: none; }
            .notif-item-fb.unread .unread-dot { display: block; }
            
            .delete-notif-btn { position: absolute; left: 8px; top: 8px; background: #f0f2f5; border: none; color: #65676b; cursor: pointer; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; font-size: 12px; z-index: 5; }
            .notif-item-fb:hover .delete-notif-btn { opacity: 1; }
            .delete-notif-btn:hover { background: #e4e6eb; color: #050505; }
            
            .friend-req-actions { display: flex; gap: 8px; margin-top: 8px; width: 100%; pointer-events: auto; }
            .btn-fb-accept, .btn-fb-reject { flex: 1; padding: 6px 0; border-radius: 6px; font-weight: bold; cursor: pointer; border: none; font-size: 0.9rem; transition: 0.2s; font-family: inherit; }
            .btn-fb-accept { background: #1877f2; color: #fff; }
            .btn-fb-accept:hover { background: #166fe5; }
            .btn-fb-reject { background: #e4e6eb; color: #050505; }
            .btn-fb-reject:hover { background: #d8dadf; }
            
            .req-success-msg { font-size: 0.85rem; font-weight: bold; color: #65676b; margin-top: 5px; display: flex; align-items: center; gap: 6px; }
        </style>
        `);
    }


    const avatarCache = {};
    function fetchAvatarFromProfile(profileUrl, callback) {
        if (!profileUrl) return callback(null, null);
        if (avatarCache[profileUrl] !== undefined) return callback(avatarCache[profileUrl].src, avatarCache[profileUrl].color);

        $.ajax({
            url: profileUrl, method: 'GET',
            success: function(data) {
                var $doc = $(new DOMParser().parseFromString(data, 'text/html'));
                var avatarSrc = null, userColor = null;

                var $img = $doc.find('.pro-avatar-box img').first();
                if ($img.length && $img.attr('src')) avatarSrc = $img.attr('src');

                var $nameSpan = $doc.find('.profile-username span[style*="color"]').first();
                if ($nameSpan.length && $nameSpan.attr('style')) {
                    var colorMatch = $nameSpan.attr('style').match(/color\s*:\s*(#[0-9A-Fa-f]{3,6})/i);
                    if (colorMatch) userColor = colorMatch[1];
                }
                avatarCache[profileUrl] = { src: avatarSrc, color: userColor };
                callback(avatarSrc, userColor);
            },
            error: function() { callback(null, null); }
        });
    }


    let readNotifs = JSON.parse(localStorage.getItem('fb_read_notifs')) || [];
    let knownNotifsArray = []; 
    const notifSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    function fetchAndBuildNotifications(isBackgroundCheck = false) {
        if (!$('#customNotifList').length) return;

        $.ajax({
            url: '/profile?mode=editprofile&page_profil=notifications',
            type: 'GET',
            success: function(data) {
                var notifs = $(data).find('.notif_row');
                
                if (!isBackgroundCheck) {
                    var mainHtml = '<div class="fb-notif-header"><span class="fb-notif-title">الإشعارات</span><button class="fb-mark-read">تعليم الكل كمقروء</button></div>';
                    mainHtml += '<div class="fb-notif-body"></div>';
                    $('#customNotifList').html(mainHtml);
                }

                if (notifs.length > 0) {
                    let hasNewItems = false;
                    let currentUnreadCount = 0;

                    notifs.slice(0, 10).each(function() {
                        var notifId = $(this).find('input[name="del_notif[]"]').val();

                        if (!readNotifs.includes(notifId)) {
                            currentUnreadCount++;
                        }

                        if (isBackgroundCheck && knownNotifsArray.includes(notifId)) return true;

                        knownNotifsArray.push(notifId);
                        if (isBackgroundCheck) hasNewItems = true;

                        var titleHtml = $(this).find('.notification-title').html();
                        var dateText = $(this).find('.notification-date').text();

                        var userLink = $(this).find('.notification-title a[href^="/u"]').last();
                        var profileUrl = userLink.length ? userLink.attr('href') : null;
                        var userName = userLink.length ? userLink.text().trim() : '';
                        var userId = profileUrl ? profileUrl.replace(/[^0-9]/g, '') : '';

                        var isIncomingReq = titleHtml.indexOf('بطلب صداقة') !== -1;
                        var acceptUrl = '', rejectUrl = '';
                        var $tempDiv = $('<div>').html(titleHtml);

                        if (isIncomingReq && userName && userId) {
                            acceptUrl = '/profile?friend=' + encodeURIComponent(userName) + '&mode=editprofile&page_profil=friendsfoes';
                            rejectUrl = '/profile?deny=' + userId + '&mode=editprofile&page_profil=friendsfoes';
                            $tempDiv.find('a[href*="friendsfoes"]').remove(); 
                        }
                        
                        var cleanTitle = $tempDiv.html().replace(' - ', '').replace(/<br\s*[\/]?>/gi, '').replace('لقد توصلت', 'تلقيت');
                        var isUnread = !readNotifs.includes(notifId);
                        var unreadClass = isUnread ? 'unread' : '';
                        var defaultAvatar = 'https://2img.net/i.imgur.com/qIufhof.png'; 
                        
                        
                        var targetLink = $tempDiv.find('a').first().attr('href') || '#';

                        var notifHtml = '<div class="notif-item-fb ' + unreadClass + '" data-id="' + notifId + '" data-href="' + targetLink + '" id="notif-item-' + notifId + '">';
                        notifHtml += '<img src="' + defaultAvatar + '" class="notif-avatar" alt="">';
                        notifHtml += '<div class="notif-content">';
                        notifHtml += '<div class="notif-title">' + cleanTitle + '</div>';
                        notifHtml += '<div class="notif-time"><i class="far fa-clock"></i> ' + dateText + '</div>';
                        
                        if (isIncomingReq && acceptUrl && rejectUrl) {
                            notifHtml += '<div class="friend-req-actions">';
                            notifHtml += '<button class="btn-fb-accept" data-url="' + acceptUrl + '">تأكيد</button>';
                            notifHtml += '<button class="btn-fb-reject" data-url="' + rejectUrl + '">حذف</button>';
                            notifHtml += '</div>';
                        }
                        
                        notifHtml += '</div>'; 
                        notifHtml += '<div class="unread-dot"></div>'; 
                        notifHtml += '<button class="delete-notif-btn" data-id="' + notifId + '" title="حذف الإشعار"><i class="fas fa-times"></i></button>';
                        notifHtml += '</div>';

                        if (isBackgroundCheck) {
                            $('#customNotifList .fb-notif-body').prepend(notifHtml);
                        } else {
                            $('#customNotifList .fb-notif-body').append(notifHtml);
                        }

                        if (profileUrl) {
                            fetchAvatarFromProfile(profileUrl, function(avatarSrc, userColor) {
                                var $img = $('#notif-item-' + notifId + ' .notif-avatar');
                                if (avatarSrc) $img.attr('src', avatarSrc);
                                if (userColor) $img.css({ 'border': '2px solid ' + userColor, 'padding': '1px' });
                            });
                        }
                    });

                    if (isBackgroundCheck && hasNewItems) {
                        notifSound.play().catch(function(e){}); 
                    }

                    
                    if (currentUnreadCount > 0) {
                        $('#customNotifBadge').text(currentUnreadCount).css('display', 'flex');
                    } else {
                        $('#customNotifBadge').hide();
                    }
                    
                } else {
                    if (!isBackgroundCheck) {
                        $('#customNotifList').html('<div style="padding: 30px; text-align: center; color: #94a3b8;"><img src="https://cdn-icons-png.flaticon.com/512/1157/1157000.png" style="width:50px; opacity:0.3; margin-bottom:10px;"><br>لا توجد إشعارات جديدة</div>');
                    }
                }
            }
        });
    }

    
    fetchAndBuildNotifications(false);
    setInterval(function() { fetchAndBuildNotifications(true); }, 25000); 

    
    $(document).on('click', '.fb-mark-read', function(e) {
        e.preventDefault(); e.stopPropagation();
        $('.notif-item-fb').each(function() {
            let id = $(this).data('id').toString();
            if(!readNotifs.includes(id)) readNotifs.push(id);
        });
        localStorage.setItem('fb_read_notifs', JSON.stringify(readNotifs));
        $('.notif-item-fb').removeClass('unread');
        $('#customNotifBadge').hide(); 
    });

    
    $(document).on('click', '.notif-item-fb', function(e) {
        
        if($(e.target).closest('.delete-notif-btn, .btn-fb-accept, .btn-fb-reject').length) return;

        let id = $(this).data('id').toString();
        let targetHref = $(this).data('href');

        if($(this).hasClass('unread')) {
            if(!readNotifs.includes(id)) {
                readNotifs.push(id);
                localStorage.setItem('fb_read_notifs', JSON.stringify(readNotifs));
            }
            $(this).removeClass('unread');

            let currentCount = parseInt($('#customNotifBadge').text()) || 0;
            if(currentCount > 1) {
                $('#customNotifBadge').text(currentCount - 1);
            } else {
                $('#customNotifBadge').hide();
            }
        }

        
        if(targetHref && targetHref !== '#') {
            window.location.href = targetHref;
        }
    });

    
    $(document).on('click', '.btn-fb-accept', function(e) { 
        e.preventDefault(); e.stopPropagation(); var btn = $(this); var url = btn.data('url'); var notifItem = btn.closest('.notif-item-fb'); var notifId = notifItem.data('id'); var container = btn.closest('.friend-req-actions');
        btn.html('<i class="fas fa-spinner fa-spin"></i>'); $.get(url, function() { container.html('<div class="req-success-msg"><i class="fas fa-user-check" style="color:#1877f2;"></i> أصبحتم أصدقاء الآن</div>'); notifItem.removeClass('unread'); $.post('/profile?mode=editprofile&page_profil=notifications', { 'del_notif[]': notifId, 'delete': 'حذف' }); });
    });

    $(document).on('click', '.btn-fb-reject', function(e) { 
        e.preventDefault(); e.stopPropagation(); var btn = $(this); var url = btn.data('url'); var notifItem = btn.closest('.notif-item-fb'); var notifId = notifItem.data('id'); var container = btn.closest('.friend-req-actions');
        btn.html('<i class="fas fa-spinner fa-spin"></i>'); $.get(url, function() { container.html('<div class="req-success-msg"><i class="fas fa-user-times" style="color:#65676b;"></i> تم حذف الطلب</div>'); notifItem.removeClass('unread'); $.post('/profile?mode=editprofile&page_profil=notifications', { 'del_notif[]': notifId, 'delete': 'حذف' }); });
    });

    $(document).on('click', '.delete-notif-btn', function(e) {
        e.preventDefault(); e.stopPropagation(); var btn = $(this); var notifId = btn.data('id'); var notifItem = $('#notif-item-' + notifId);
        btn.html('<i class="fas fa-spinner fa-spin" style="color:#65676b;"></i>'); $.post('/profile?mode=editprofile&page_profil=notifications', { 'del_notif[]': notifId, 'delete': 'حذف' }, function() { notifItem.fadeOut(300, function() { $(this).remove(); }); });
    });
});