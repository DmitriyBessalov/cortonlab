//Защита от повторного запуска скрипта
if (corton_complete!=1) {
    var corton_complete = 1;
    //Получение get параметров
    var get = (function() {
        var a = window.location.search;
        var b = new Object();
        a = a.substring(1).split("&");
        for (var i = 0; i < a.length; i++) {
            c = a[i].split("=");
            b[c[0]] = c[1];
        }
        return b;
    })();

    //Обработка промо статьи
    function corton_promo() {
        if (window.location.hostname === 'demo.cortonlab.com'){
            console.log(corton_url);
            const promo_forcibly = style_b.getPropertyValue('--forcibly');
            const promo_selector = style_b.getPropertyValue('--selector');
            if (promo_forcibly==='1'){
                let sel = document.querySelectorAll(promo_selector);
                sel[0].innerHTML=
                '<div id="corton-promo"></div>';
            }
            console.log(promo_forcibly,promo_selector);
        }

        var widget_promo=document.getElementById("corton-promo");

        adblock();
        var h3=0;
        var request ='https://api2.cortonlab.com/promo.php'+location.search;
        let result=[];
        console.log(request);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', request,true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {return}
            if (xhr.status === 200) {
                result = JSON.parse(xhr.responseText);
                console.log('ajax:', result);
                if (!result) return false;
            }
            document.title = result['title'];

            var form='';
            if ((result['form_title']!='') && (result['form_text']!='')){
                form=
                    '<div class="promo-form">'+
                    '<div class="title">'+result['form_title']+'</div>'+
                    '<div class="text">'+result['form_text']+'</div>'+
                    '<div class="form">'+
                    '<div id="corton-form" class="form">'+
                    '<input class="inputtext" maxlength="256" name="name" placeholder="Ваше Имя" required="">'+
                    '<input class="inputtext" maxlength="256" name="phone" placeholder="Телефон" required="">'+
                    '<input type="submit" value="'+result['form_button']+'" onclick="cortonform();" class="button">'+
                    '<div id="corton_form_status"></div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
            }

            var logo='<a style="float: right; margin-top: 24px;" href="https://cortonlab.com/" target="_blank" title="Powered by Corton">' +
                '<img style="all:unset; width:80px; height:20px;" src="https://cortonlab.com/images/cortonlogo.png">' +
                '</a>';

            const promo_selector_title = style_b.getPropertyValue('--selectortitle');

            var promo= '<div id="promo_content">'+result['text']+form+logo+'</div><div id="scroll_to_site">0</div><div id="osvetlenie"></div>';

            if (promo_selector_title.length!=0){
                let ele = document.querySelectorAll(promo_selector_title);
                ele[0].innerHTML=result['title'];
                widget_promo.innerHTML = promo;
            }else{
                widget_promo.innerHTML ='<h1>'+result['title']+'</h1>'+promo;
            }

            var style_p = window.getComputedStyle(widget_promo, null);
            const scroll2site_activ = style_p.getPropertyValue('--scroll2site_activ');
            if ((result['scroll2site']==1) && (scroll2site_activ==1))
            {
                const scroll2site_fon_color = style_p.getPropertyValue('--scroll2site_fon_color');
                const scroll2site_text_size = style_p.getPropertyValue('--scroll2site_text_size');
                const scroll2site_text_font = style_p.getPropertyValue('--scroll2site_text_font');
                const scroll2site_text_color = style_p.getPropertyValue('--scroll2site_text_color');
                const scroll2site_perehod_color = style_p.getPropertyValue('--scroll2site_perehod_color');

                var corton_promo=document.getElementById("corton-promo");
                var promo_content=document.getElementById("promo_content");
                var scroll_to_site=document.getElementById("scroll_to_site");
                var osvetlenie=document.getElementById("osvetlenie");
                var transept=0;

                const regex = /^(https?:\/\/)?(.*?)($|[/?])/;
                let host = regex.exec(result['scroll2site_url']);

                scroll_to_site.innerHTML= ''+
                '<div id="scroll_border"><p> ' + result['scroll2site_text'] + ' <a href="'+result['scroll2site_url']+'" class="scroll2site">' + host[2] + '</a></p></div>'+
                '<div id="vityagivanie_img">'+
                    '<div id="background_color">' +
                        '<div id="banner-shadow"></div>'+
                        '<img id="image-fon">'+
                    '</div>'+
                '</div>'+

                '<style type="text/css">'+
                'div#scroll_to_site{position:absolute;top:100px;overflow:hidden;display:none; flex-direction: column;} '+
                'div#scroll_border{background-color:#' + scroll2site_fon_color + ';min-height:80px;border:1px solid #ddd;width:100%;display:flex;align-items:center;justify-content:center;} '+
                'div#scroll_border>p{font-size:'+ scroll2site_text_size +'px;font-family:' + scroll2site_text_font + ';color:#' + scroll2site_text_color + ';} '+
                'div#vityagivanie_img{overflow:hidden;} '+
                'div#background_color{background-color: #000;} '+
                'img#image-fon{top:0;opacity:0.97;width:100%;max-width:100%;} '+
                'div#banner-shadow{z-index:10;position:absolute;top:82px;left:0;width:100%;height:85px;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.1),transparent);} '+
                'div#osvetlenie{position:fixed;display:none;opacity:0;background-color:#'+scroll2site_perehod_color+';z-index:99999;top:0;left:0;width:100%;height:100%;} '+
                '</style>';

                scroll_to_site.style.maxWidth=corton_promo.offsetWidth+'px';
                scroll_to_site.style.width=corton_promo.offsetWidth+'px';

                var image_fon=document.getElementById("image-fon");
                var background_color=document.getElementById("background_color");
                var vityagivanie_img=document.getElementById("vityagivanie_img");

                function osvetlenie_redirert() {
                    transept=transept+0.025;
                    osvetlenie.style.display = 'block';
                    osvetlenie.style.opacity = transept;
                    if (transept<=1){
                        setTimeout(osvetlenie_redirert, 20);
                    }else{
                        let href=encodeURIComponent(result['scroll2site_url']);
                        console.log('https://stat.cortonlab.com/promo.php?prosmort_id=' + get['prosmort_id'] + '&host=' + location.hostname + '&a=c&anons_id=' + get['anons_id'] + '&t=' + get['t'] + '&p_id=' + result['id'] + '&href=' + href);
                        cxhr.open('GET', 'https://stat.cortonlab.com/promo.php?prosmort_id=' + get['prosmort_id'] + '&host=' + location.hostname + '&a=c&anons_id=' + get['anons_id'] + '&t=' + get['t'] + '&p_id=' + result['id']  + '&href=' + href);
                        cxhr.send();

                        if (result['scroll2site_url'].indexOf("?") > -1) {
                            var char = '&'
                        } else {
                            var char = '?'
                        }

                        document.location.href = result['scroll2site_url'] + char + 'sub_id1=-1&utm_source=corton&utm_medium=CPG&utm_campaign=' + result['id'] + '&utm_content=' + get['anons_id'] + '&utm_term=' + get['p_id'];
                    }
                };

                h_scroll=promo_content.scrollHeight+62;
                zasvet=0;
                var imgload=false;
                window.addEventListener('scroll', function() {
                    var i=promo_content.getBoundingClientRect().top+h_scroll-window.innerHeight;

                    if (i<300){
                        //console.log(i,'Подгрузка фона картинки');
                        if (!imgload) {
                            if (document.body.clientWidth < 480) {
                                image_fon.src = "https://api.cortonlab.com/img/rekl_screenshot_site/" + result['id'] + "_mobile.png";
                            } else {
                                image_fon.src = "https://api.cortonlab.com/img/rekl_screenshot_site/" + result['id'] + "_desktop.png";
                            }
                            imgload = true;
                        }
                    }else{
                        h_scroll=promo_content.scrollHeight+62;
                        scroll_to_site.style.width=corton_promo.offsetWidth+'px';
                    }

                    if((i<=0)&&(i>=-100)){
                        //console.log(i,'Выдвижение футер');
                        scroll_to_site.style.display='flex';
                    }

                    if(i<=0){
                        let i2=-100-i;
                        //console.log(i,i2,'Выдвижение заголовка перехода');
                        scroll_to_site.style.display='flex';
                        scroll_to_site.style.top=pageYOffset+i+window.innerHeight+'px';
                        scroll_to_site.style.height=i2+'px';
                    }

                    if(i<=-100){
                        let i2=-100-i;
                        //console.log(i,i2,'Остановка футтер');
                        promo_content.style.padding='0 0 '+i2+'px 0';
                    }else{
                        scroll_to_site.style.display='none';
                    }

                    if (i<-182) {
                        g=window.innerHeight/5-window.innerHeight-i;
                        if (g<=0){
                            console.log(i,g,'Выдвижение картинки');
                            vityagivanie_img.style.height = image_fon.height+'px';
                            background_color.style.top=i  +'px';
                            image_fon.style.top=g +'px';
                            let h=-g-image_fon.height;
                            if (h<0){
                                background_color.style.height=-g-image_fon.height +'px';
                            }else{
                                background_color.style.height='1px';
                            }
                        }else{
                            document.body.style.overflow = 'hidden';
                            osvetlenie_redirert();
                        }
                    }
                });

                //console.log('scroll2site');
            }else{
                widget_promo.innerHTML=promo;
            }


            var promo_form=document.getElementById("corton-form");
            if (promo_form) {
                h3=promo_form.scrollHeight;
            };

            //Скрытие referrer при переходе со статьи
            var meta = document.querySelectorAll('meta[name=referrer]');
            if (meta.length!=0){
                meta[0].remove();
            }else{
                var meta = document.createElement('meta');
                meta.name = "referrer";
                meta.content = "no-referrer";
                document.getElementsByTagName('head')[0].appendChild(meta);
            }

            //Клик по ссылке в промо статье
            var a = document.querySelectorAll('div#corton-promo a');
            for(var i=0; i<a.length; i++) {
                if (a[i].getAttribute('href')!=="https://cortonlab.com/") {
                    if (a[i].getAttribute('href').indexOf("?") > -1) {
                        var char = '&'
                    } else {
                        var char = '?'
                    }

                    a[i].rel="noreferrer";
                    let link='';
                    if(a[i].classList.contains('scroll2site')){
                        link=result['scroll2site_url'] + char + 'sub_id1=-1&utm_source=corton&utm_medium=CPG&utm_campaign=' + result['id'] + '&utm_content=' + get['anons_id'] + '&utm_term=' + get['p_id'];
                    }else{
                        link=a[i].getAttribute('href') + char + 'sub_id1=' + i + '&utm_source=corton&utm_medium=CPG&utm_campaign=' + result['id'] + '&utm_content=' + get['anons_id'] + '&utm_term=' + get['p_id'];
                    }
                    console.log(link);
                    a[i].setAttribute('href', link);

                    //console.log('promolink', a[i].getAttribute('href'));

                    a[i].onclick = function (e) {
                        let href=encodeURIComponent(this.href);
                        console.log('https://stat.cortonlab.com/promo.php?prosmort_id=' + get['prosmort_id'] + '&host=' + location.hostname + '&ancor=' + this.outerText + '&a=c&anons_id=' + get['anons_id'] + '&t=' + get['t'] + '&p_id=' + result['id'] +'&href=' + href );
                        cxhr.open('GET', 'https://stat.cortonlab.com/promo.php?prosmort_id=' + get['prosmort_id'] + '&host=' + location.hostname + '&ancor=' + this.outerText + '&a=c&anons_id=' + get['anons_id'] + '&t=' + get['t'] + '&p_id=' + result['id'] +'&href=' + href );
                        cxhr.send();
                    }
                }
            }

            //Отправка статистики что промо страница загружена
            if (widget_promo.scrollHeight>50)
            {
                var cxhr = new XMLHttpRequest();
                console.log     ('https://stat.cortonlab.com/promo.php?prosmort_id='+get['prosmort_id']+'&a=l&anons_id='+get['anons_id']+'&t='+get['t'] + '&p_id=' + result['id']+'&ref='+document.referrer);
                cxhr.open('GET', 'https://stat.cortonlab.com/promo.php?prosmort_id='+get['prosmort_id']+'&a=l&anons_id='+get['anons_id']+'&t='+get['t'] + '&p_id=' + result['id']+'&ref='+document.referrer);
                cxhr.send();
            }
        };

        //Таймер когда активна вкладка
        var i=0;
        var scroll=false;
        var scrollfull=false;
        var st=true;
        var timer35=false;
        var timer85=false;
        var scrollh=document.body.scrollHeight/20;
        window.onblur = function () {i=-1;};
        window.onfocus = function () {i=0;};

        function lett() {
            window.scrollTo(0, 0);
            scroll=false;
        }
        setTimeout(lett, 300);
        var p=0;
        function letsGo(){
            if (timer85 && scrollfull){
                var cxhr = new XMLHttpRequest();
                console.log     ('https://stat.cortonlab.com/promo.php?prosmort_id='+get['prosmort_id']+'&host='+location.hostname+'&a=r&anons_id=' + get['anons_id']+'&t='+get['t'] + '&p_id=' + result['id']);
                cxhr.open('GET', 'https://stat.cortonlab.com/promo.php?prosmort_id='+get['prosmort_id']+'&host='+location.hostname+'&a=r&anons_id=' + get['anons_id']+'&t='+get['t'] + '&p_id=' + result['id']);
                cxhr.send();
            }else{
                if (timer35 && scroll && st){
                    var cxhr = new XMLHttpRequest();
                    console.log     ('https://stat.cortonlab.com/promo.php?prosmort_id='+get['prosmort_id']+'&host='+location.hostname+'&a=s&anons_id=' + get['anons_id']+'&t='+get['t'] + '&p_id=' + result['id']);
                    cxhr.open('GET', 'https://stat.cortonlab.com/promo.php?prosmort_id='+get['prosmort_id']+'&host='+location.hostname+'&a=s&anons_id=' + get['anons_id']+'&t='+get['t'] + '&p_id=' + result['id']);
                    cxhr.send();
                    st=false;
                }
                setTimeout(letsGo,1000);
            };
            if (i>=35)timer35=true;
            if (i>=85)timer85=true;
            if (scrollh<=pageYOffset) scroll=true;
            var promo_form=document.getElementsByClassName("promo-form");
            if (promo_form[0]) {
                if  (promo_form[0].getBoundingClientRect().top - window.innerHeight<=0) {
                    if (i>2) scrollfull=true;
                }
            }else{
                if (widget_promo.getBoundingClientRect().top+widget_promo.scrollHeight<=window.innerHeight){
                    if (i>2) scrollfull=true;
                }
            }
            if (i!=-1 && widget_promo.scrollHeight>50) {
                i++;
            };
        }
        letsGo();
    }

    //Обработка виджетов
    function corton_widget() {
        var show_recomend=0;
        var show_natpre=0;
        var show_slider=0;
        var gadget='';
        var count=0;
        var result;
        var widget_load_status=0;
        var widget = '';
        var first_widget_check=true;
        var buttontext;
        var titletext;
        var w = 0;
        var wait=0;
        var anons_ids= [];
        var recomend_image_shape;
        var natpre_image_shape;

        const corton_body2=document.getElementsByTagName("body");

        const recomend_algorithm_output = style_b.getPropertyValue('--recomend-algorithm-output');
        const natpre_algorithm_output = style_b.getPropertyValue('--natpre-algorithm-output');
        const slider_algorithm_output = style_b.getPropertyValue('--slider-algorithm-output');

        //Определение устройства пользователя
        function Device() {
            const device = {};
            const userAgent = window.navigator.userAgent.toLowerCase();
            device.iphone = function() {return !device.windows() && find('iphone')};
            device.ipod = function() {return find('ipod')};
            device.ipad = function() {return find('ipad')};
            device.android = function() {return !device.windows() && find('android')};
            device.androidPhone = function() {return device.android() && find('mobile')};
            device.androidTablet = function() {return device.android() && !find('mobile')};
            device.blackberry = function() {return find('blackberry') || find('bb10') || find('rim')};
            device.blackberryPhone = function() {return device.blackberry() && !find('tablet')};
            device.blackberryTablet = function() {return device.blackberry() && find('tablet')};
            device.windows = function() {return find('windows')};
            device.windowsPhone = function() {return device.windows() && find('phone')};
            device.windowsTablet = function() {return device.windows() && (find('touch') && !device.windowsPhone())};
            device.fxos = function() {return (find('(mobile') || find('(tablet')) && find(' rv:')};
            device.fxosPhone = function() {return device.fxos() && find('mobile')};
            device.fxosTablet = function() {return device.fxos() && find('tablet')};
            device.meego = function() {return find('meego')};
            device.mobile = function() {return (device.androidPhone()||device.iphone()||device.ipod()||device.windowsPhone()||device.blackberryPhone()||device.fxosPhone()||device.meego())};
            device.tablet = function() {return (device.ipad()||device.androidTablet()||device.blackberryTablet()||device.windowsTablet()||device.fxosTablet())};
            device.desktop = function() {return !device.tablet() && !device.mobile()};
            function find(needle) {return userAgent.indexOf(needle) !== -1}
            function findMatch(arr) {for (let d = 0; d < arr.length; d++) {if (device[arr[d]]()) {return arr[d]}}return 'unknown'}
            device.type = findMatch(['mobile', 'tablet', 'desktop']);
            if (device.type==='desktop'){
                if(document.body.clientWidth<992){device.type='tablet'}
                if(document.body.clientWidth<480){device.type='mobile'}
            }
            return device.type;
        }
        var device=Device();

        function zaglushka(tizer) {
            console.log('zag_'+tizer);
            var elem = document.getElementById('corton-'+tizer+'-widget',);
            elem.outerHTML='<iframe width="100%" height="300px" frameborder="0" scrolling="no" id="'+tizer+'-iframe" src="//'+location.hostname+'/corton_stub_'+tizer+'.html" /></iframe>';
        }

        function words() {
            // Слова исключения в этой строке
            var exclude = {'автор':'','боле':'','будет':'','был':'','важны':'','вед':'','вес':'','влияет':'','вообщ':'','врем':'','всемирн':'','всех':'','встретит':'','дал':'',
                'действительн':'','делат':'','дел':'','ден':'','друг':'', 'есл':'','ест':'','здес':'','имеет':'','именн':'','ин':'','когд':'','комментар':'','конгресс':'','контакт':'',
                'котор':'','куд':'','лиш':'','любят':'','мен':'','мн':'','может':'','можн':'','над':'','наш':'','недел':'','некотор':'', 'никак':'','нужн':'','очен':'','перед':'',
                'поиск':'','портфоли':'','посл':'','поэт':'','привет':'','работ':'','ранн':'','реклам':'','рубрик':'','сво':'','сентябр':'','следует':'','такж':'','так':'','течен':'',
                'тип':'', 'т':'','тож':'','тольк':'','туд':'','час':'','част':'','чащ':'','чтоб':'','эт':'','этот':''};

            let top10=[];
            let val;
            function splitword(wordsss){
                let arr = wordsss.toLowerCase().match(/[а-яё]{4,}/g);
                if (arr !== null)
                for (val of arr){
                    const lastchar= val.slice(-1);
                    switch (lastchar) {
                        case 'я':val = val.replace(/ья$|яя$|ая$|ия$|я$/, "");break;
                        case 'е':val = val.replace(/ое$|ее$|ие$|ые$|е$/, "");break;
                        case 'а':val = val.replace(/а$/, "");break;
                        case 'и':val = val.replace(/иями$|ями$|ьми$|еми$|ами$|ии$|и$/, "");break;
                        case 'ь':val = val.replace(/ь$/, "");break;
                        case 'о':val = val.replace(/его$|ого$|о$/, "");break;
                        case 'й':val = val.replace(/ий$|ей$|ый$|ой$|й$/, "");break;
                        case 'м':val = val.replace(/иям$|им$|ем$|ом$|ям$|ам$/, "");break;
                        case 'ы':val = val.replace(/ы$/, "");break;
                        case 'ю':val = val.replace(/ию$|ью$|ею$|ою$|ю$/, "");break;
                        case 'х':val = val.replace(/иях$|ях$|их$|ах$/, "");break;
                        case 'в':val = val.replace(/ев$|ов$/, "");break;
                        case 'у':val = val.replace(/у$/, "");
                    }
                    if (top10[val]){
                        top10[val]++;
                    }else{
                        top10[val]=1;
                    }
                }
            }

            splitword(document.title);
            const head  = document.head.querySelector("meta[name='description']"); if (head) {splitword(head.content);}
            const p  = document.getElementsByTagName("p" );for (const val of p ){splitword(val.innerText);}
            const h1 = document.getElementsByTagName("h1");for (const val of h1){splitword(val.innerText);}
            const h2 = document.getElementsByTagName("h2");for (const val of h2){splitword(val.innerText);}
            const h3 = document.getElementsByTagName("h3");for (const val of h3){splitword(val.innerText);}
            const h4 = document.getElementsByTagName("h4");for (const val of h4){splitword(val.innerText);}

            //console.log(top10);

            top10 = Object.keys(top10).sort(function (a, b){return top10[b] - top10[a]});
                top10 = top10.slice(0, 15);
            let top15 = top10.slice(0, 15);

            for (val of top15){
                if (val in exclude){
                    top10.splice(top10.indexOf(val), 1);
                }
            }

            top10 = top10.slice(0, 10);
            console.log(top10);

            return top10;
        }

        if (location.hostname==='demo.cortonlab.com') {
            if (recomend_algorithm_output==='0'||recomend_algorithm_output==='3'||recomend_algorithm_output==='4'||recomend_algorithm_output==='5'){
                let div = document.createElement('div');
                div.id = 'corton-recomendation-widget';
                document.body.appendChild(div);
            }
            if (natpre_algorithm_output==='1'||natpre_algorithm_output==='3'||natpre_algorithm_output==='4'||natpre_algorithm_output==='5'){
                let div = document.createElement('div');
                div.id = 'corton-nativepreview-widget';
                document.body.appendChild(div);
            }
            if (slider_algorithm_output === '0') {
                let div = document.createElement('div');
                div.id = 'corton-slider-widget';
                document.body.appendChild(div);
            }
        }

        function widget_check() {
            //Подготовка к получению данных виджетов
            if (widget_recomend && show_recomend == 0) {
                var style_r = window.getComputedStyle(widget_recomend, null);
                gadget = style_r.getPropertyValue('--' + device);
                if (gadget == 1) {
                    var height = style_r.getPropertyValue('--hsize');
                    if (height == "") height = 0;
                    var width = style_r.getPropertyValue('--wsize');
                    if (width == "") width = 0;
                    recomend_image_shape = style_r.getPropertyValue('--image_shape');
                    count = parseInt(width) * parseInt(height);
                    if (count !== 0) {
                        if (recomend_algorithm_output === '1') {
                            widget = widget +'&r=' + count;
                            titletext = style_r.getPropertyValue('--titletext');
                            show_recomend = 1;
                        } else {
                            var selector = style_r.getPropertyValue('--widgetparentid');
                            var abzats = style_r.getPropertyValue('--widgetpositionp');
                            if (selector != "") {
                                var ele = document.querySelectorAll(selector);
                                if (ele.length !== 0) {
                                    if (ele[0]) {
                                        widget = widget +'&r=' + count;
                                        switch (recomend_algorithm_output) {
                                            case '3':
                                                ele[0].parentNode.insertBefore(widget_recomend,ele[0]);
                                                break;
                                            case '4':
                                                ele[0].parentNode.insertBefore(widget_recomend,ele[0]);
                                                ele[0].remove();
                                                break;
                                            case '5':
                                                ele[0].parentNode.insertBefore(widget_recomend,ele[0].nextSibling);
                                                break;
                                            case '0':
                                                let children = ele[0].children;
                                                abzats--;
                                                if (abzats==-1){
                                                    ele[0].insertBefore(widget_recomend,children[0]);
                                                }else {
                                                    for (var r = 0; r < children.length - 1; r++) {
                                                        if (children[r].localName == 'p') {
                                                            if (abzats == 0) {
                                                                break;
                                                            }
                                                            abzats--;
                                                        }
                                                    }
                                                    children[r].appendChild(widget_recomend);
                                                }
                                        }
                                        titletext = style_r.getPropertyValue('--titletext');
                                        show_recomend = 1;
                                    }
                                } else {
                                    widget_recomend.remove();
                                }
                            } else {
                                widget_recomend.remove();
                            }
                        }
                    }
                } else {
                    widget_recomend.remove();
                }
            }

            if (widget_natpre && show_natpre == 0) {
                var style_e = window.getComputedStyle(widget_natpre, null);
                gadget = style_e.getPropertyValue('--' + device);
                if (gadget == 1) {
                    buttontext = style_e.getPropertyValue('--buttontext');
                    natpre_image_shape = style_e.getPropertyValue('--image_shape');
                    if (natpre_algorithm_output === '1') {
                        widget = widget + '&e=1';
                        show_natpre = 1;
                    } else {
                        var selector = style_e.getPropertyValue('--widgetparentid');
                        var abzats = style_e.getPropertyValue('--widgetpositionp');
                        if (selector != "") {
                            var ele = document.querySelectorAll(selector);
                            if (ele.length !== 0) {
                                if (ele[0]) {
                                    widget = widget + '&e=1';
                                    switch (natpre_algorithm_output) {
                                        case '3':
                                            ele[0].parentNode.insertBefore(widget_natpre,ele[0]);
                                            break;
                                        case '4':
                                            ele[0].parentNode.insertBefore(widget_natpre,ele[0]);
                                            ele[0].remove();
                                            break;
                                        case '5':
                                            ele[0].parentNode.insertBefore(widget_natpre,ele[0].nextSibling);
                                            break;
                                        case '0':
                                            let children = ele[0].children;
                                            abzats--;
                                            if (abzats==-1){
                                                ele[0].insertBefore(widget_natpre,children[0]);
                                            }else {
                                                for (var r = 0; r < children.length - 1; r++) {
                                                    if (children[r].localName == 'p') {
                                                        if (abzats == 0) {
                                                            break;
                                                        }
                                                        abzats--;
                                                    }
                                                }
                                                children[r].appendChild(widget_natpre);
                                            }
                                    }
                                    show_natpre = 1;
                                }
                            } else {
                                widget_natpre.remove();
                            }
                        } else {
                            widget_natpre.remove();
                        }
                    }
                } else {
                    widget_natpre.remove();
                }
            }

            if (widget_slider && show_slider == 0) {
                var style_s = window.getComputedStyle(widget_slider, null);
                gadget = style_s.getPropertyValue('--' + device);
                if (gadget == 1) {
                    widget = widget + '&s=1';
                    show_slider = 1;
                } else {
                    widget_slider.remove();
                }
            }
        }

        //Запрос кода виджетов
        function widget_load() {
            if (widget_load_status==0) {
                widget_load_status=1;
                //console.log('widget_load');
                var top10 = words();

                let category = style_b.getPropertyValue('--category');
                if (category) {
                    const categor = JSON.parse(category);
                    category = '';

                    let i = 0;
                    while (i < categor.length) {
                        //console.log(categor[i]['id_categoriya'], categor[i]['type_search'], categor[i]['regex']);
                        let obj = eval('/(' + categor[i]['regex'] + ')/');
                        delete matches;
                        if (categor[i]['type_search'] == 0) {
                            var matches = obj.exec(location.href);
                        } else {
                            var matches = obj.exec(document.body.innerHTML);
                        }
                        if (matches) {
                            category += '&c[]=' + categor[i]['id_categoriya'];
                        }
                        i++;
                    }
                }

                var request = 'https://api2.cortonlab.com/widgets.php?words=' + encodeURI(top10.join()) + widget+category;
                if (location.hostname=='demo.cortonlab.com'){request='https://api2.cortonlab.com/widgets-demo.php?words=' + encodeURI(top10.join())+'&sheme='+document.cookie.match(/scheme=(.+?);/)+'&host='+document.cookie.match(/host=(.+?);/) + widget;}
                console.log(decodeURI(request));
                var xhr = new XMLHttpRequest();
                xhr.open('GET', request, true);
                xhr.send();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState != 4) {
                        return false;
                    }
                    if (xhr.status === 200) {
                        result = JSON.parse(xhr.responseText);
                        console.log('ajax:', result);
                        widget_load_status=2;
                    }
                }
            }
        }

        //Подгружает код виджетов при скроле
        function show_widget() {
            if (widget_load_status!=2){
                if (wait!=200) {
                    wait++;
                    setTimeout(show_widget, 30);
                    return false;
                }else {
                    wait!=0;
                    return false;
                }
            }
            const sCurrentProtocol = document.location.protocol == "https:" ? "https://" : "http://";
            if (window.location.hostname === 'demo.cortonlab.com') {
                var promo_page='https://demo.cortonlab.com'+result['promo_page'];
            }else{
                var promo_page=sCurrentProtocol+result['promo_page'];
            }
            if (show_recomend==2) {
                if (result['anons_count'] > 0) {
                    console.log('recomend_anons');
                    if (titletext != "") titletext = '<div class="corton-title">' + titletext + '</div>';
                    var htmll = '<div>' +
                        '<noindex><div class="corton-recomendation-wrapper 4x1">' +
                        titletext +
                        '<div class="corton-recomendation-row">';
                    count+=w;
                    for (; w < count; w++) {
                        if (result['anons_count'] > 0) {
                            htmll = htmll +
                                '<div class="corton-recomendation-section corton-anons" id="anons' + result['anons'][0][w] + 'r">' +
                                '<a href="' + promo_page + '?prosmort_id=' + result['prosmotr_id'] + '&anons_id=' + result['anons'][0][w] + '&p_id='+result['p_id']+'&t=r">' +
                                '<img src="https://api.cortonlab.com/img/' + result['anons'][5][w] + '/a/' + result['anons'][recomend_image_shape][w] + '">' +
                                '<p>' + result['anons'][1][w] + '</p>' +
                                '</a>' +
                                '</div>';
                            result['anons_count']--;
                        }
                    }
                    htmll = htmll +
                        '</div>' +
                        '</div>' +
                        '</div></noindex>';
                    widget_recomend.innerHTML = htmll;
                } else {
                    if (typeof(result['recomend_zag']) != "undefined" && result['recomend_zag'] !== null && result['recomend_zag'] != false) {
                        zaglushka( 'recomendation');
                    }else{
                        widget_recomend.remove();;
                    }
                }
                show_recomend=3;
            }
            if (show_natpre==2){
                if (result['anons_count'] > 0) {
                    console.log('natpre_anons');
                    if (buttontext == "") buttontext = 'Подробнее';
                    var htmll =
                        '<noindex><div class="corton-anons" id="anons' + result['anons'][0][w] + 'e">' +
                        '<div class="corton-left"> <a href="' + promo_page + '?prosmort_id=' + result['prosmotr_id'] + '&anons_id=' + result['anons'][0][w] +'&p_id='+result['p_id']+'&t=e"><img src="https://api.cortonlab.com/img/' + result['anons'][5][w] + '/a/' + result['anons'][natpre_image_shape][w] + '" width="290" height="180"></a> </div>' +
                        '<div class="corton-right">' +
                        '<a style="text-decoration: none" href="' + promo_page + '?prosmort_id=' + result['prosmotr_id'] + '&anons_id=' + result['anons'][0][w] + '&p_id='+result['p_id']+'&t=e"><div class="corton-title">' + result['anons'][1][w] + '</div></a>' +
                        '<a style="text-decoration: none" href="' + promo_page + '?prosmort_id=' + result['prosmotr_id'] + '&anons_id=' + result['anons'][0][w] + '&p_id='+result['p_id']+'&t=e"><p class="corton-content">' + result['anons'][2][w] + '</p></a>' +
                        '<a class="corton-link" href="' + promo_page + '?prosmort_id=' + result['prosmotr_id'] + '&anons_id=' + result['anons'][0][w] + '&p_id='+result['p_id']+'&t=e">' + buttontext + '</a>' +
                        '</div>' +
                        '</div></noindex>';
                    //Расчет позиции NatPrev
                    widget_natpre.innerHTML=htmll;
                    result['anons_count']--;
                    w++;
                }else {
                    if (typeof(result['natpre_zag']) != "undefined" && result['natpre_zag'] !== null && result['natpre_zag'] != false) {
                        zaglushka('nativepreview');
                    }else{
                        widget_natpre.remove();
                    }
                }
                show_natpre=3;
            }

            if (show_slider==2) {
                if (result['anons_count'] > 0) {
                    console.log('slider_anons');
                    widget_slider.innerHTML =
                        '<noindex><div class="widget-slider" id="widget-slider">' +
                        '<div class="corton-left">' +
                        '<a href="' + promo_page + '?prosmort_id='+ result['prosmotr_id']+'&anons_id=' + result['anons'][0][w] + '&p_id='+result['p_id']+'&t=s">' +
                        '<img src="https://api.cortonlab.com/img/'+result['anons'][5][w]+'/a/' + result['anons'][4][w] + '" alt="" width="180" height="180">' +
                        '</a>'+
                        '</div>'+
                        '<div class="corton-right">' +
                        '<span class="corton-sign">Рекомендовано для Вас:</span>' +
                        '<div class="corton-title">' +
                        '<a href="' + promo_page + '?prosmort_id='+ result['prosmotr_id']+'&anons_id=' + result['anons'][0][w] + '&p_id='+result['p_id']+'&t=s">' +
                        result['anons'][1][w] +
                        '</div>' +
                        '</a>' +
                        '</div>' +
                        '<span class="close-widget" onclick="document.getElementById(\'corton-slider-widget\').style.display = \'none\';"></span>' +
                        '<div class="widget-slider-id" id="'+result['anons'][0][w]+'"></div>'+
                        '</div></noindex>';
                    slider_anons_id=result['anons'][0][w]+'s';
                    widget_slider.style.position = 'fixed';
                    widget_slider.style.bottom = '0px';
                    widget_slider.style.right = '0px';
                    widget_slider.style.zIndex = '99999';
                    w++;
                    show_slider=3;
                    setTimeout(checkreadslider, 5000, slider_anons_id);
                }
            }
        }

        //Проверка тизеров на длительность прочтения в 5 секунды
        var anons_ids_old='';
        var anons_ids_new;
        var anons_ids_show=[];
        var anons_ids_read=[];
        var anons_ids_read2=[];
        var anons_ids_send=[];
        var anons_idsnew;
        var anons_idsold;
        var check;
        var if_arr;
        function checkread(show) {
            check=show.split(',');
            var elements = document.getElementsByClassName('corton-anons');
            for (q = 0; q < elements.length; q++) {
                var id = elements[q].id;
                id=id.substring(5);

                var h=elements[q].getBoundingClientRect().top;
                var h2=h+elements[q].scrollHeight-window.innerHeight;

                if ((h > 0) && (h2 < 0)) {
                    {
                        anons_ids_send.push(id);
                    }
                }
            }
            for (q = 0; q < check.length; q++) {
                if_arr=anons_ids_send.indexOf(anons_ids_send[q])+1;
                if(if_arr){
                    for (y = 0; y < anons_ids_send.length; y++) {
                        if(anons_ids_send[y]==check[q]){
                            if_arr=anons_ids_read.indexOf(anons_ids_send[q])+1;
                            if(!if_arr){
                                anons_ids_read.push(anons_ids_send[q]);
                                anons_ids_read2.push(anons_ids_send[q]);
                            }
                        }
                    }
                }
            }

            if(0<anons_ids_read2.length){
                var cxhr = new XMLHttpRequest();
                console.log('https://stat.cortonlab.com/widget_show.php?prosmort_id='+result['prosmotr_id']+'&anons_ids='+anons_ids_read2.join());
                cxhr.open('GET', 'https://stat.cortonlab.com/widget_show.php?prosmort_id='+result['prosmotr_id']+'&anons_ids='+anons_ids_read2.join());
                cxhr.send();
                anons_ids_read2.splice(0,anons_ids_read2.length);
            }
            anons_ids_send.splice(0,anons_ids_send.length);
        }

        //проверка прочтения слайдера
        function checkreadslider(slider_anons_id) {
            var cxhr = new XMLHttpRequest();
            console.log('https://stat.cortonlab.com/widget_show.php?prosmort_id='+result['prosmotr_id']+'&anons_ids='+slider_anons_id);
            cxhr.open('GET', 'https://stat.cortonlab.com/widget_show.php?prosmort_id='+result['prosmotr_id']+'&anons_ids='+slider_anons_id);
            cxhr.send();
        }

        //Поиск условия для загрузки виджетов
        function onscr() {
            widget_recomend = document.getElementById("corton-recomendation-widget");
            widget_natpre = document.getElementById("corton-nativepreview-widget");
            widget_slider = document.getElementById("corton-slider-widget");
            widget_check();
            var show_widget_aktiv=false;
            if (widget_recomend) {
                if (widget_recomend.getBoundingClientRect().top != 0) {
                    if (show_recomend == 1 && widget_recomend.getBoundingClientRect().top - window.innerHeight - window.innerHeight / 4 < 0) {
                        show_recomend = 2;
                        show_widget_aktiv = true;
                    }
                }else{
                    setTimeout(onscr, 20);
                    return false;
                }
            }

            if (widget_natpre) {
                if (widget_natpre.getBoundingClientRect().top != 0) {
                    if ((show_natpre == 1) && (widget_natpre.getBoundingClientRect().top - window.innerHeight - window.innerHeight / 4 < 0)) {
                        show_natpre = 2;
                        show_widget_aktiv = true;
                    }
                }else{
                    setTimeout(onscr, 20);
                    return false;
                }
            }

            if ((show_slider==1)&&(document.body.scrollHeight/2-window.innerHeight/2<pageYOffset)) {
                show_slider = 2;
                show_widget_aktiv=true;
            }
            if (show_widget_aktiv){
                widget_load();
                show_widget();
            }

            //Добавление просмотренных анонсов
            anons_ids.splice(0,anons_ids.length);
            var elements = document.getElementsByClassName('corton-anons');
            for (i = 0; i < elements.length; i++) {
                var id = elements[i].id;
                id=id.substring(5);

                var h=elements[i].getBoundingClientRect().top;
                var h2=h+elements[i].scrollHeight-window.innerHeight;

                if ((h > 0) && (h2 < 0)) {
                    {
                        anons_ids.push(id);
                    }
                }
            }
            anons_ids_show.splice(0,anons_ids_show.length);
            anons_ids_new=anons_ids.join();
            if (anons_ids_old!=anons_ids_new && anons_ids_new!=""){
                anons_idsnew=anons_ids_new.split(',');
                anons_idsold=anons_ids_old.split(',');
                for (f = 0; f < anons_idsnew.length; f++) {
                    if(!anons_idsold.indexOf(anons_idsnew[f]) !== -1){
                        anons_ids_show.push(anons_idsnew[f]);
                    }
                }
                //console.log('захвачены',anons_ids_show);

                setTimeout(checkread, 5000, anons_ids_show.join().substr(0));
                anons_idsnew.splice(0,anons_idsnew.length);
            }
            anons_ids_old=anons_ids.join();
        }

        window.onscroll = function(){onscr();};
        onscr();

        if (first_widget_check){
            first_widget_check=false;
            setTimeout(onscr, 500);
        }
    }

    //ajax отправка формы промо статьи
    function cortonform()
    {
        var cform=document.querySelector('#corton-form');
        var children = cform.children;
        var params = [];
        for (var i=0; i < children.length - 1; i++) {
            if (children[i].value==""){
                var status=document.getElementById("corton_form_status");
                status.innerHTML = 'Заполните обязательные поля формы';
                return false;
            }
            params.push(children[i].name + '=' + children[i].value);
        }
        params = params.join('&');
        cortonrequest.open('GET', 'https://stat.cortonlab.com/mail.php?'+params+'&host='+document.referrer);
        cortonrequest.send();
    }

    //Получение ответа отправленой формы статьи
    function getcortonrequest()
    {
        if (window.XMLHttpRequest) {return new XMLHttpRequest();}
        return new ActiveXObject('Microsoft.XMLHTTP');
    }
    cortonrequest = getcortonrequest();
    cortonrequest.onreadystatechange = function() {
        if (cortonrequest.readyState == 4) {
            var status=document.getElementById("corton_form_status");
            status.innerHTML = cortonrequest.responseText;
        }
    };

    //Блокировка чужой рекламы на промо странице
    var corton_adsblock=0;
    function adblock() {
        var widget_promo2 = document.getElementById("corton-promo");
        var style_p = window.getComputedStyle(widget_promo2, null);
        var block = style_p.getPropertyValue('--adblock');
        var arr3 = block.split(',');

        arr3.forEach(function (item, f, arr3) {
            if (item !== "") {
                var ele2 = document.querySelectorAll(item);
                for (var p = 0; p < ele2.length; p++) {
                    ele2[p].style.display = 'none';
                }
            }
        });
        if (corton_adsblock<20) {corton_adsblock++;setTimeout(adblock, 250);}else{setTimeout(adblock, 5000);}
    }

    //Расчёт готовности страницы для подгрузки виджетов и промо статьи
    function corton_delay() {
        if (window.location.hostname === 'demo.cortonlab.com') {
            let url = corton_url;
            url = url.split('?')[0];
            const url2 = url.split('/')[0];
            if (url===url2+'/promo') {
                const promo_selector = style_b.getPropertyValue('--selector');
                let sel = document.querySelectorAll(promo_selector);
                if (sel[0]) {
                    console.log(url);
                    corton_promo();
                    return true;
                } else {
                    setTimeout(corton_delay, 40);
                }
            } else {
                if (document.readyState === "complete") {
                    const recomend_algorithm_output = style_b.getPropertyValue('--recomend-algorithm-output');
                    const natpre_algorithm_output = style_b.getPropertyValue('--natpre-algorithm-output');
                    const slider_algorithm_output = style_b.getPropertyValue('--slider-algorithm-output');

                    if (recomend_algorithm_output !== '1' || natpre_algorithm_output !== '0' || slider_algorithm_output !== '1') {
                        corton_widget();
                        return true;
                    }
                } else {
                    setTimeout(corton_delay, 40);
                }
            }
        } else {
            let widget_promo = document.getElementById("corton-promo");
            if (widget_promo) {
                corton_promo();
                return true;
            } else {
                widget_recomend = document.getElementById("corton-recomendation-widget");
                widget_natpre = document.getElementById("corton-nativepreview-widget");
                widget_slider = document.getElementById("corton-slider-widget");
                if (widget_recomend || widget_natpre || widget_slider) {
                    corton_widget();
                    return true;
                }else{
                    if (document.readyState === "complete") {
                        if (corton_complete!==15){
                            setTimeout(corton_delay, 200);
                        }else{
                            corton_complete++;
                            return true;
                        }
                    }else{
                        setTimeout(corton_delay, 45);
                    }
                }
            }
        }
    }


    var corton_body = '';
    let style_b = '';
    let widget_recomend;
    let widget_natpre;
    let widget_slider;
    function corton_get_body() {

        corton_body = document.getElementsByTagName("body");
        if (corton_body.length !== 0) {
            style_b = window.getComputedStyle(corton_body[0], null);
            corton_delay();
        } else {
            setTimeout(corton_get_body, 40);
        }
    }

    corton_get_body();

    (function () {
        var eventMethod = "addEventListener";
        var eventer = window[eventMethod];
        var messageEvent = "message";
        eventer(messageEvent, function (e) {
            try {
                var array = JSON.parse(e.data);
                document.getElementById('corton-' + array['corton_tizer'] + '-iframe').height = array['height'] + 'px';
            } catch (e) {
            }
        }, false);
    })();
};