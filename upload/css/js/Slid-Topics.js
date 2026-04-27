document.addEventListener("DOMContentLoaded", function() {
    
    if (typeof Fancybox !== "undefined") {
        
        
        var topicImages = document.querySelectorAll('.content img, .entry-content img');
        
        topicImages.forEach(function(img) {
            var imgSrc = img.getAttribute('src');
            
            
            if (!img.classList.contains('smilies') && imgSrc.indexOf('smiles') === -1 && imgSrc.indexOf('illiweb') === -1 && imgSrc.indexOf('icon') === -1) {
                
               
                img.setAttribute('data-fancybox', 'gallery');
                img.setAttribute('data-src', imgSrc);
                img.style.cursor = 'zoom-in'; 
                
                
                img.style.pointerEvents = "auto";
            }
        });

        
        Fancybox.bind('[data-fancybox="gallery"]', {
            groupAll: true,
            Toolbar: {
                display: ["zoom", "slideShow", "fullScreen", "download", "close"],
            },
        });
    }
});