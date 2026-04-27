function switchAuthTab(tab) {
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-register').classList.remove('active');
    document.getElementById('tab-' + tab).classList.add('active');

    document.getElementById('form-login').classList.remove('active');
    document.getElementById('form-register').classList.remove('active');
    document.getElementById('form-' + tab).classList.add('active');

    var authBox = document.getElementById('authBoxContainer');
    if (tab === 'register') {
        authBox.classList.add('wide-modal');
    } else {
        authBox.classList.remove('wide-modal');
    }
}