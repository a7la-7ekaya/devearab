$(document).ready(function() {
    

    $('.pro-native-tabs li a').each(function() {
        var aText = $(this).text();
        var aHref = $(this).attr('href');
        var iconHtml = '';

        if(aHref.indexOf('wall') !== -1) { iconHtml = '<i class="material-symbols-outlined">chat</i> '; }
        else if(aHref.indexOf('stats') !== -1) { iconHtml = '<i class="material-symbols-outlined">pie_chart</i> '; }
        else if(aHref.indexOf('friends') !== -1) { iconHtml = '<i class="material-symbols-outlined">group</i> '; }
        else if(aHref.indexOf('followers') !== -1) { iconHtml = '<i class="material-symbols-outlined">rss_feed</i> '; }
        else if(aHref.indexOf('groups') !== -1) { iconHtml = '<i class="material-symbols-outlined">style</i> '; }
        else if(aHref.indexOf('awards') !== -1) { iconHtml = '<i class="material-symbols-outlined">military_tech</i> '; }
        else if(aHref.indexOf('rpg') !== -1) { iconHtml = '<i class="material-symbols-outlined">sports_esports</i> '; }
        else if(aHref.indexOf('attachments') !== -1) { iconHtml = '<i class="material-symbols-outlined">attachment</i> '; }
        else { iconHtml = '<i class="material-symbols-outlined">person</i> '; } 

        $(this).html(iconHtml + aText);
    });


    var currentPath = window.location.pathname; 
    var tabFound = false;
    $('.pro-native-tabs li a').each(function() {
        var tabHref = $(this).attr('href');
        if(currentPath === tabHref || (currentPath.indexOf('/u') === 0 && tabHref.indexOf('/u') === 0 && currentPath.length === tabHref.length)) {
            $(this).addClass('active');
            tabFound = true;
        }
    });
    if(!tabFound) { $('.pro-native-tabs li:first-child a').addClass('active'); }


    window.updateCoverAndBg = function() {
        var userIdMatch = currentPath.match(/\/u(\d+)/);
        var uId = userIdMatch ? userIdMatch[1] : null;
        var coverKey = 'user_cover_' + uId;
        var bgKey = 'user_bg_' + uId;

        var applyStyles = function(coverVal, bgVal) {
            if (coverVal && coverVal.length > 5 && coverVal.startsWith('http')) {
                $('#dynamic-cover').css('background-image', 'url(' + coverVal + ')');
            }
            if (bgVal && bgVal.length > 5 && bgVal.startsWith('http')) {
                $('body').css({
                    'background-image': 'url(' + bgVal + ')',
                    'background-size': 'cover',
                    'background-attachment': 'fixed',
                    'background-position': 'center'
                });
            }
        };


        if ($('.profile-data-row').length > 0) {
            var extractedCover = '', extractedBg = '';

            $('.profile-data-row').each(function() {
                var $row = $(this);
                var labelText = $.trim($row.find('.pf-label').text());

                if (labelText.indexOf('غلاف') !== -1 || labelText.indexOf('الغلاف') !== -1 ||
                    labelText.indexOf('خلفية') !== -1 || labelText.indexOf('الخلفية') !== -1) {
                    
                    var $uneditable = $row.find('.field_uneditable');
                    var $img = $uneditable.find('img');
                    var rawText = $.trim($uneditable.text());
                    var value = $img.length ? $img.attr('src') : rawText;
                    value = value.replace(/\[img\]/gi, '').replace(/\[\/img\]/gi, '').trim();

                    if (labelText.indexOf('غلاف') !== -1 || labelText.indexOf('الغلاف') !== -1) {
                        extractedCover = value;
                    } else {
                        extractedBg = value;
                    }

                
                    if (value && value.length > 5 && value.startsWith('http')) {
                        $uneditable.html('<a href="'+value+'" target="_blank" style="color:var(--primary-color, #8b5cf6); font-family:tahoma; font-size:13px; text-decoration:none; word-break: break-all;"><i class="material-symbols-outlined" style="font-size:14px; vertical-align:middle;">link</i> '+value+'</a>');
                    }
                }
            });

            if(uId) {
                localStorage.setItem(coverKey, extractedCover);
                localStorage.setItem(bgKey, extractedBg);
            }
            applyStyles(extractedCover, extractedBg);

        } else {
            
            if (uId) {
                var cachedCover = localStorage.getItem(coverKey);
                var cachedBg = localStorage.getItem(bgKey);

                if (cachedCover !== null || cachedBg !== null) {
                    applyStyles(cachedCover, cachedBg);
                } else {
                 
                    $.get('/u' + uId, function(data) {
                        var fetchedCover = '', fetchedBg = '';
                        $(data).find('.profile-data-row, .profile-advanced-stats').each(function() {
                            var labelText = $.trim($(this).find('.pf-label, dt').text());
                            if (labelText.indexOf('غلاف') !== -1 || labelText.indexOf('الغلاف') !== -1 ||
                                labelText.indexOf('خلفية') !== -1 || labelText.indexOf('الخلفية') !== -1) {
                                
                                var $dd = $(this).find('.pf-content, dd');
                                var val = $dd.find('img').length ? $dd.find('img').attr('src') : $.trim($dd.text());
                                val = val.replace(/\[img\]/gi, '').replace(/\[\/img\]/gi, '').trim();

                                if (labelText.indexOf('غلاف') !== -1 || labelText.indexOf('الغلاف') !== -1) { fetchedCover = val; } 
                                else { fetchedBg = val; }
                            }
                        });
                        localStorage.setItem(coverKey, fetchedCover);
                        localStorage.setItem(bgKey, fetchedBg);
                        applyStyles(fetchedCover, fetchedBg);
                    });
                }
            }
        }
    };

    window.updateCoverAndBg();

    $('.new-message-link a').addClass('btn-default').html('<i class="material-symbols-outlined">create</i> ' + $('.new-message-link img').attr('alt'));
});