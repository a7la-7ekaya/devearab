document.addEventListener('DOMContentLoaded', function() {
    var originalFormContent = document.querySelector('#ucp .block-content');
    if (!originalFormContent) return;

   
    var modernUI = document.createElement('div');
    modernUI.className = 'modern-reg-container';
    modernUI.innerHTML = `
        <div class="reg-alert">جميع&nbsp;الحقول&nbsp;أدناه&nbsp;إجبارية&nbsp;لإتمام&nbsp;التسجيل</div>
        <div class="reg-grid">
          
            <div class="reg-col">
                <div class="col-header">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm4 4h8v2H8v-2zm0 4h8v2H8v-2zM6 8h2v2H6V8zm0 4h2v2H6v-2z"/></svg>
                    بيانات&nbsp;الحساب
                </div>
                
                <div class="input-wrap" id="wrap-username">
                    <label>اسم&nbsp;العضو&nbsp;المستعار</label>
                </div>
                
                <div class="input-wrap" id="wrap-email">
                    <label>البريد&nbsp;الالكتروني</label>
                </div>
                
                <div class="input-wrap" id="wrap-password">
                    <label>كلمة&nbsp;السر</label>
                    <div class="pwd-box">
                        <i class="material-symbols-outlined pwd-toggle">visibility</i>
                        <!-- سينتقل حقل الباسورد هنا -->
                    </div>
                </div>
            </div>

            <!-- العمود الأيسر: البيانات الشخصية -->
            <div class="reg-col">
                <div class="col-header">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    البيانات&nbsp;الشخصية
                </div>
                
                <div class="input-wrap" id="wrap-country">
                    <label>الدولة</label>
                </div>
                
                <div class="input-wrap" id="wrap-gender">
                    <label>الجنس</label>
                    <div class="gender-box"></div>
                </div>
                
                <div class="input-wrap" id="wrap-dob">
                    <label>تاريخ&nbsp;الميلاد</label>
                    <div class="dob-box"></div>
                </div>
            </div>
        </div>
        
        <!-- المنطقة السفلية -->
        <div class="reg-bottom">
            <div class="checkbox-wrap" id="wrap-checkbox"></div>
            <div id="wrap-submit"></div>
        </div>
    `;

  
    originalFormContent.prepend(modernUI);

    function moveElement(selector, targetSelector, placeholder) {
        var el = document.querySelector(selector);
        var target = document.querySelector(targetSelector);
        if (el && target) {
            if (placeholder) el.setAttribute('placeholder', placeholder);
            target.appendChild(el);
        }
    }

 
    moveElement('#username_reg', '#wrap-username', 'مثال: الطائر الحر');
    moveElement('#email', '#wrap-email', 'example@gmail.com');
    moveElement('#password_reg', '.pwd-box', '........');

   
    moveElement('#profile_field_7_2', '#wrap-country');

    
    moveElement('#profile_field_4_-12_2', '.dob-box'); // اليوم
    moveElement('#profile_field_4_-12_1', '.dob-box'); // الشهر
    moveElement('#profile_field_4_-12_0', '.dob-box', 'العام (1990)'); // العام
    
    
    var daySelect = document.querySelector('#profile_field_4_-12_2 option[value=""]');
    var monthSelect = document.querySelector('#profile_field_4_-12_1 option[value=""]');
    if(daySelect) daySelect.textContent = 'يوم';
    if(monthSelect) monthSelect.textContent = 'شهر';

   
    var genderRadios = document.querySelectorAll('input[name="profile_field_16_-7"]');
    var genderTarget = document.querySelector('.gender-box');
    var genderLabels = ['ذكر', 'انثى', 'أخرى'];
    
    genderRadios.forEach(function(radio, index) {
        if (index < 3) {
            var lbl = document.createElement('label');
            lbl.className = 'gender-label';
            lbl.appendChild(radio);
            lbl.appendChild(document.createTextNode(' ' + genderLabels[index]));
            genderTarget.appendChild(lbl);
        } else {
            radio.remove(); 
        }
    });

    
    var chk = document.querySelector('#wantsnews');
    if(chk) {
        var chkLbl = document.createElement('label');
        chkLbl.appendChild(chk);
        chkLbl.appendChild(document.createTextNode(' أوافق على القوانين وتلقي أخبار المنتدى'));
        document.querySelector('#wrap-checkbox').appendChild(chkLbl);
    }

    var submitBtn = document.querySelector('input[name="submit"]');
    if (submitBtn) {
        submitBtn.value = 'متابعة التسجيل وإثبات الأمان \u2190';
        submitBtn.className = 'modern-submit-btn';
        document.querySelector('#wrap-submit').appendChild(submitBtn);
    }

    
    var resetBtn = document.querySelector('input[name="reset"]');
    if(resetBtn) resetBtn.style.display = 'none';

    
    var eyeIcon = document.querySelector('.pwd-toggle');
    var pwdInput = document.getElementById('password_reg');
    if (eyeIcon && pwdInput) {
        eyeIcon.addEventListener('click', function() {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                eyeIcon.style.color = '#7a58ff';
                eyeIcon.textContent = 'visibility_off';
            } else {
                pwdInput.type = 'password';
                eyeIcon.style.color = '#a0aabf';
                eyeIcon.textContent = 'visibility';
            }
        });
    }
});