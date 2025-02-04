$(document).ready(function(){
//Получение get параметров
    function $_GET(key) {
        var p = window.location.search;
        p = p.match(new RegExp(key + '=([^&=]+)'));
        return p ? p[1] : false;
    }

//Подгрузка подкатегорий при выборе категорий на странице редактирования площадок
    $("#categoriya").change(function(){
        selec();
    });
    selecswitch();
    function selecswitch() {
        if($("#podcategoriyaval").length) {
            var podcategor=document.getElementById('podcategoriyaval').innerHTML;
            if (podcategor!=""){
                selec();
                $('#podcategoriya option[value="'+podcategor+'"]').attr("selected", "selected");
            }
        }
    }
    function selec() {
        var categoriyaval = $("#categoriya option:selected").val();
        var str;
        $.post( "https://panel.cortonlab.com/platforms-get-podcategoriya?id="+categoriyaval, function(data) {
            let valu=JSON.parse(data);
            valu.forEach(function(value, index) {
                str=str+'<option value="'+value['id']+'">'+value['podcategoriya']+'</option>';
            });
            document.getElementById('podcategoriya').innerHTML='<option value="">Подкатегория площадки</option>'+str;
        });
    }

//Формирует теги с ссылками для подключения площадки
    $('input[name="domen"]').change(function() {
        var  domen= $('input[name="domen"]').val();
        domen = domen.replace(/\./gi, '_');
        document.getElementById('fileadrres').innerHTML='&lt;link href="https://api.cortonlab.com/css/'+domen+'.css.gz" rel="stylesheet"&gt;<br><br>&lt;script async src="https://api.cortonlab.com/js/cortonlab.js.gz"&gt;&lt;/script&gt;';
    });
	
//Функция для чекбокса для всех вариантов статей
    $('.flipswitch.all').click(function() {
        id=$(this)[0].id.substr(7,$(this)[0].id.length - 7);
        if ($(this).is(':checked')){
            var checkbox=$(this);
            $.post("https://panel.cortonlab.com/article-start-all?id="+id,function(data) {
                switch (data) {
                    case 'anon':{checkbox.next().text('Неактивна, отсутсвуют анонсы'); checkbox.prop('checked', false); console.log('a'); break;}
                    case 'word':{checkbox.next().text('Неактивна, отсутсвуют ключевые слова'); checkbox.prop('checked', false); console.log('w'); break;}
                    case 'true':{checkbox.next().text('Активна'); break;}
                    default:    {checkbox.next().text('Активна'); alert('Внимание активированно '+data+' варианта статьи');}
                }
            });
        } else {
            $.post("https://panel.cortonlab.com/article-stop-all?id="+id)
        }
    });

    //Функция для чекбокса для одного вариантов статей
    $('.flipswitch.one').click(function() {
        if ($(this).is(':checked')){
            var id=$(this).parents('tr:first').children('td')[0].innerHTML;
            var checkbox=$(this);
            $.post("https://panel.cortonlab.com/article-start?id="+id,function(data) {
                switch (data) {
                    case 'anon':{checkbox.next().text('Неактивна, отсутсвуют анонсы'); checkbox.prop('checked', false); console.log('a'); break;}
                    case 'word':{checkbox.next().text('Неактивна, отсутсвуют ключевые слова'); checkbox.prop('checked', false); console.log('w'); break;}
                    case 'true':{checkbox.next().text('Активна');}
                }
            });
        } else {
            $(this).next().text('На паузе');
            var id=$(this).parents('tr:first').children('td')[0].innerHTML;
            $.post("https://panel.cortonlab.com/article-stop?id="+id)
        }
    });

    //Функция для чекбокса для остановки показа анонсов
    $('.flipswitch.anons').click(function() {
        var id=$(this).parents('tr:first').children('td')[0].innerHTML;
        if ($(this).is(':checked')){
            $.post("https://panel.cortonlab.com/article-anons-start?id="+id,function(data) {
                switch (data) {
                    case 'anon':{checkbox.next().text('Неактивна, отсутсвуют анонсы'); checkbox.prop('checked', false); console.log('a'); break;}
                    case 'word':{checkbox.next().text('Неактивна, отсутсвуют ключевые слова'); checkbox.prop('checked', false); console.log('w'); break;}
                    case 'true':{checkbox.next().text('Активна'); break;}
                    default:    {checkbox.next().text('Активна'); alert('Внимание активированно '+data+' варианта статьи');}
                }
            });
        } else {
            $.post("https://panel.cortonlab.com/article-anons-stop?id="+id)
        }
    });

//Отрытие модальных окон на странице площадок
    $("#promo").click(function(){
        $('.modal.promo').css("display", "block");
        $('.black-fon').css("display", "block");
    });

    $("#recomend").click(function(){
        var variable = $('#recomend').html();
        if (variable=='Активировать'){
            var idploshadka= $('input[name=id]').val();
            $.get( "widget-aktiv?id="+idploshadka+"&widget=recomend");
            $("#recomend").html("Настройки");
        }else{
            $('.recomendation').css("display", "block");
            $('.black-fon').css("display", "block");
        }
    });

    $("#zagrecomend").click(function(){
        $('.modal.zagrecom').css("display", "block");
        $('.black-fon').css("display", "block");
    });

    $("#natprev").click(function(){
        var variable = $('#natprev').html();
        if (variable=='Активировать'){
            var idploshadka= $('input[name=id]').val();
            $.get( "widget-aktiv?id="+idploshadka+"&widget=natpre");
            $("#natprev").html("Настройки");
        }else{
            $('.modal.nativepreview').css("display", "block");
            $('.black-fon').css("display", "block");
        }
    });
    $("#zagnatprev").click(function(){
        $('.modal.zagnativepreview').css("display", "block");
        $('.black-fon').css("display", "block");
    });

    $("#natpro").click(function(){
        var variable = $('#natpro').html();
        if (variable=='Активировать'){
            var idploshadka= $('input[name=id]').val();
            $.get( "widget-aktiv?id="+idploshadka+"&widget=natpro");
            $("#natpro").html("Настройки");
        }else{
            $('.modal.nativepro').css("display", "block");
            $('.black-fon').css("display", "block");
        }
    });

    $("#zagnatpro").click(function(){
        $('.modal.zag-nativepro').css("display", "block");
        $('.black-fon').css("display", "block");
    });

    $("#slider").click(function(){
        var variable = $('#slider').html();
        if (variable=='Активировать'){
            var idploshadka= $('input[name=id]').val();
            $.get( "widget-aktiv?id="+idploshadka+"&widget=slider");
            $("#slider").html("Настройки");
        }else{
            $('.modal.slider').css("display", "block");
            $('.black-fon').css("display", "block");
        }
    });
//Скрытие модальных окон
    $(".modalhide").click(function(){
        $('.modal').css("display", "none");
        $('.black-fon').css("display", "none");
    });

//Открытие модальных окон на странице со статистикой площадок
    $(".modalclick").click(function(){
        $('.black-fon').css("display", "block");
        $('#modalotch'+this.id.substr(9)).css("display", "block");
    });
//Открытие модальных окон на списание баланса площадок
    $(".modalclickb").click(function(){
        $('.black-fon').css("display", "block");
        $('#spisanie'+this.id.substr(6)).css("display", "block");
    });
//Открытие модальных окон на пополнение баланса рекламодателя
    $(".modalclickc").click(function(){
        $('.black-fon').css("display", "block");
        $('#popolnenie'+this.id.substr(9)).css("display", "block");
    });

// При изменении виджета Promo
    $('.widget-promo input, .widget-promo select').change(function(){
        widget_promo();
    });
    widget_promo();

// Визуализация виджета Promo-статья
    function widget_promo(){

        var widgetfontunit=$('.widget-promo [name=widget-font-unit]').val();

        var style = "#corton-widget{width: 100%; padding:10px;} " +
            "#corton-promo .icon-partner{display: inline-block;}";

        if($('.widget-promo .icon').prop("checked")) style += "#corton-widget .icon-partner{display: block;}";

        var background_block = $('.widget-promo [name=widget-background-block]').val();
        if (background_block != "") style += "#corton-promo{background: #" + background_block + ";}";

        var width_block = $('.widget-promo [name=widget-width-block]').val();
        if (width_block != "") style += "#corton-promo{width: " + width_block + "%;}";

        style += "#corton-promo h1{font-weight: 400;}";
        
        style += "#corton-promo p{text-indent: 0px !important; margin-bottom: 20px !important;}";

        var h1_font = $('.widget-promo [name=widget-h1-font]').val();
        if (h1_font != "") style += "#corton-promo h1{font-family: " + h1_font + ";}";

        var h1_size = $('.widget-promo [name=widget-h1-size]').val();
        if (h1_size != ""){
            if (widgetfontunit=='px') {
                style += "#corton-promo h1{font-size: " + h1_size + "px;}";
            } else {
                style += "#corton-promo h1{font-size: " + h1_size/10 + "em;}";
            }
        }

        var h1_color = $('.widget-promo [name=widget-h1-color]').val();
        if (h1_color != "") style += "#corton-promo h1{color: #" + h1_color + ";}";

        var variable = $('.widget-promo [name=widget-h1-bold]').val();
        if (variable != "") style += "#corton-promo h1{font-weight: " + variable + ";}";

        if($('.widget-promo [name=widget-h1-italic]').prop("checked")) style += "#corton-promo h1{font-style: italic;}";

        if($('.widget-promo [name=widget-h1-underline]').prop("checked")) style += "#corton-promo h1{text-decoration: underline;}";

        var h2_color = $('.widget-promo [name=widget-h2-color]').val();
        if (h2_color != "") style += "#corton-promo h2{color: #" + h2_color + ";}";

        style += "#corton-promo h2{font-weight: 400;}";
        style += "#corton-promo img{max-width: 99%;}";

        var h2_font = $('.widget-promo [name=widget-h2-font]').val();
        if (h2_font != "") style += "#corton-promo h2{font-family: " + h2_font + ";}";

        var h2_size = $('.widget-promo [name=widget-h2-size]').val();
        if (h2_size != "") {
            if (widgetfontunit=='px') {
                style += "#corton-promo h2{font-size: " + h2_size + "px;}";
            } else {
                style += "#corton-promo h2{font-size: " + h2_size/10 + "em;}";
            }
        }

        var variable = $('.widget-promo [name=widget-h2-bold]').val();
        if (variable != "") style += "#corton-promo h2{font-weight: " + variable + ";}";

        if($('.widget-promo [name=widget-h2-italic]').prop("checked")) style += "#corton-promo h2{font-style: italic;}";

        if($('.widget-promo [name=widget-h2-underline]').prop("checked")) style += "#corton-promo h2{text-decoration: underline;}";

        var text_color = $('.widget-promo [name=widget-text-color]').val();
        if (text_color != "") style += "#corton-promo p{color: #" + text_color + ";}";

        var a_color = $('.widget-promo [name=widget-a-color]').val();
        if (a_color != "") style += "#corton-promo a{color: #" + a_color + ";}";

        var text_font = $('.widget-promo [name=widget-text-font]').val();
        if (text_font != "") style += "#corton-promo p{font-family: " + text_font + ";}";

        var text_size = $('.widget-promo [name=widget-text-size]').val();
        if (text_size != "") {
            if (widgetfontunit=='px') {
                style += "#corton-promo p{font-size: " + text_size + "px;}";
            } else {
                style += "#corton-promo p{font-size: " + text_size/10 + "em;}";
            }
        }

        var variable = $('.widget-promo [name=widget-text-bold]').val();
        if (variable != "") style += "#corton-promo p{font-weight: " + variable + ";}";

        var variable = $('.widget-promo [name=widget-type-interval-text]').val();
        if (variable != "") style += "#corton-promo p{line-height: " + variable + ";}";

        if($('.widget-promo [name=widget-text-italic]').prop("checked")) style += "#corton-promo p{font-style: italic;}";

        if($('.widget-promo [name=widget-text-underline]').prop("checked")) style += "#corton-promo p{text-decoration: underline;}";

        //форма
        style += ".promo-form {padding: 20px; margin-bottom: 30px; width: auto !important; margin-top: 20px; }";
        style += ".promo-form input.inputtext {padding: 7px; width: 30%; min-width: 160px; }";
        style += ".promo-form input.button {padding: 6px 20px 6px 20px; width: 30%; min-width: 160px; }";
        style += ".promo-form div.title {padding-bottom: 5px; margin-bottom: 0px !important; }";
        style += ".promo-form div.text {padding-bottom: 10px; }";
        
        style += " @media (max-width: 720px) and (min-width: 260px) { .promo-form input.inputtext{padding: 5px; margin-bottom: 10px !important; width: 100%; }}";
        style += " @media (max-width: 720px) and (min-width: 260px) { .promo-form input.button{padding: 6px 20px 6px 20px; width: 100%; }}";
        style += " @media (max-width: 992px) and (min-width: 770px) { .promo-form input.button{padding: 6px 20px 6px 20px; width: 30%; }}";
         
        var variable = $('.widget-promo [name=form-width]').val();
        if (variable != "") style += ".promo-form {width: " + variable + "%;}";

        var variable = $('.widget-promo [name=form-blok-aling]').val();
        if (variable == "center") style += ".promo-form {margin-left: auto;}"; style += ".promo-form {margin-right: auto;}";

        var variable = $('.widget-promo [name=form-in-blok-aling]').val();
        if (variable != "") style += ".promo-form {text-align: " + variable + ";}";

        var variable = $('.widget-promo [name=form-palitra-color]').val();
        if (variable != "") style += ".promo-form {background: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-border-width]').val();
        var variable2 = $('.widget-promo [name=form-palitra-border-color]').val();
        if(variable != "") style += ".promo-form{border: solid " + variable + "px #" + variable2 + ";}";

        var variable = $('.widget-promo [name=form-border-radius]').val();
        if(variable != "") style += ".promo-form{border-radius:" + variable + "px;}";

        var variable = $('.widget-promo [name=form-h2-font]').val();
        if(variable != "") style += ".promo-form div.title{font-family: " + variable + ";}";

        var variable = $('.widget-promo [name=form-h2-color]').val();
        if(variable != "") style += ".promo-form div.title{color: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-h2-size]').val();
        if(variable != "") {
            if (widgetfontunit=='px') {
                style += ".promo-form div.title{font-size: " + variable + "px;}";
            } else {
                style += ".promo-form div.title{font-size: " + variable/10 + "em;}";
            };
        };

        var variable = $('.widget-promo [name=form-input-baground-color]').val();
        if(variable != "") style += ".promo-form input.inputtext{background-color: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-input-text-border-size]').val();
        var variable2 = $('.widget-promo [name=form-input-text-border-color]').val();
        if(variable != "") style += ".promo-form input.inputtext{border: solid " + variable + "px #" + variable2 + ";}";

        var variable = $('.widget-promo [name=form-input-text-border-radius]').val();
        if(variable != "") style += ".promo-form input.inputtext{border-radius:" + variable + "px;}";

        var variable = $('.widget-promo [name=form-input-text-font]').val();
        if(variable != "") style += ".promo-form input.inputtext{font-family: " + variable + ";}";

        var variable = $('.widget-promo [name=form-input-text-color]').val();
        if(variable != "") style += ".promo-form input.inputtext{color: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-input-text-size]').val();
        if(variable != "") {
            if (widgetfontunit=='px') {
                style += ".promo-form input.inputtext{font-size: " + variable + "px;}";
            } else {
                style += ".promo-form input.inputtext{font-size: " + variable/10 + "em;}";
            };
        };

        style += ".promo-form input.inputtext{margin: 0px 2% 0px 0px;}";
        style += ".promo-form div.form{margin-top: 10px;}";

        var variable = $('.widget-promo [name=form-text-font]').val();
        if(variable != "") style += ".promo-form div.text{font-family: " + variable + ";}";

        var variable = $('.widget-promo [name=form-text-color]').val();
        if(variable != "") style += ".promo-form div.text{color: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-text-size]').val();
        if(variable != "") {
            if (widgetfontunit=='px') {
                style += ".promo-form div.text{font-size: " + variable + "px;}";
            } else {
                style += ".promo-form div.text{font-size: " + variable/10 + "em;}";
            };
        };

        var variable = $('.widget-promo [name=form-button-background-color]').val();
        if(variable != "") style += ".promo-form input.button{background-color: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-button-border-size]').val();
        var variable2 = $('.widget-promo [name=form-button-border-color]').val();
        if(variable != "") style += ".promo-form input.button{border: solid " + variable + "px #" + variable2 + ";}";

        var variable = $('.widget-promo [name=form-button-radius]').val();
        if(variable != "") style += ".promo-form input.button{border-radius:" + variable + "px;}";

        var variable = $('.widget-promo [name=form-button-text-color]').val();
        if(variable != "") style += ".promo-form input.button{color: #" + variable + ";}";

        var variable = $('.widget-promo [name=form-button-text-font]').val();
        if(variable != "") style += ".promo-form input.button{font-family: " + variable + ";}";

        var variable = $('.widget-promo [name=form-button-text-size]').val();
        if(variable != "") style += ".promo-form input.button{font-size: " + variable + "px;}";

        var variable = $("#textarea-promo").val();
        if(variable != "") style += variable;

        var variable2 = $("#textarea-promo2").val();

        $('.promo-script-container').html('<style>' + style + '</style>');
        $('.widget-promo [name=css]').val(style);
        $('.widget-promo [name=dop-css]').val(variable);
        $('.widget-promo [name=adblock-css]').val(variable2);

    }


// При изменении виджета рекомендаций
    $('.widget-recomendation input, .widget-recomendation select').change(function(){
        widget_recomendation();
    });
    widget_recomendation();

// Визуализация виджета рекомендаций
    function widget_recomendation(){
        $('.holder').css("display", "none");
        var width = $('[name=widget-format]').val();
        var height = $('[name=widget-format-1]').val();
        var count = parseInt(width) * parseInt(height);

        $('.corton-recomendation-row').html('');
        var html = $('.holder').html();
        for (i=0; i<count; i++) {
            $(html).appendTo('.corton-recomendation-row')
        }

        var style = "#corton-recomendation-widget{--hsize: "+height+"; --wsize: "+width+";}";

        style += ".corton-recomendation-wrapper{display: inline-block; padding:0px;}";

        if ($('[name=widget-format]').val() == 2) style += ".corton-recomendation-section{width: 50%;}";
        if ($('[name=widget-format]').val() == 3) style += ".corton-recomendation-section{width: 33.33%;}";
        if ($('[name=widget-format]').val() == 4) style += ".corton-recomendation-section{width: 25%;}";
		

        style += " @media (max-width: 1980px) and (min-width: 640px) { .corton-recomendation-section img{width: 100%; margin: 0 10px 0 0; }}";
        style += " @media (max-width: 1980px) and (min-width: 640px) { .corton-recomendation-section p{margin-bottom: 0px; }}";
        
        style += " @media (max-width: 640px) and (min-width: 260px) { .corton-recomendation-section{display: inline-block; width: 100%; }}";
        style += " @media (max-width: 640px) and (min-width: 260px) { .corton-recomendation-section img{width: 35%;  float: left; margin: 0 10px 0 0 !important; float: left; }}";
        style += " @media (max-width: 640px) and (min-width: 260px) { .corton-recomendation-section p{margin-bottom: 0px; }}";

        style += ".corton-recomendation-row{display: flex; flex-wrap: wrap; border-spacing: 5px; }";
        style += ".corton-recomendation-section{display: block; padding: 0px;}";
        style += ".corton-recomendation-section img{width: 100%; height: auto; margin-bottom:5px;}";

        var widgetfontunit=$('.widget-recomendation [name=widget-font-unit]').val();

        var bg1 = $('.widget-recomendation [name=widget-background-block]').val();
        if (bg1 != "") style += ".corton-recomendation-wrapper{background: #" + bg1 + ";}";

        var border_type = $('.widget-recomendation [name=widget-border-type]').val();
        var border_width = $('.widget-recomendation [name=widget-border-width]').val();
        var border_color = $('.widget-recomendation [name=widget-border-color]').val();
        if (border_width != "") 
        style += ".corton-recomendation-wrapper{border: "+border_width+"px #"+border_color+" " + border_type + ";}\n";

        var text_title = $('.widget-recomendation [name=widget-text-title]').val();
        $('#corton-recomendation-widget .corton-title').text(text_title);

        if(text_title != "") style += "#corton-recomendation-widget .corton-title{padding:10px 0 5px 8px;}";

        var font_title = $('.widget-recomendation [name=widget-font-title]').val();
        if(font_title != "") style += "#corton-recomendation-widget .corton-title{font-family: " + font_title + ";}";

        var size_title = $('.widget-recomendation [name=widget-size-title]').val();
        if(size_title != "") {
            if (widgetfontunit=='px') {
                style += "#corton-recomendation-widget .corton-title{font-size: " + size_title + "px;}";
            } else {
                style += "#corton-recomendation-widget .corton-title{font-size: " + size_title/10 + "em;}";
            };
        };

        var color_title = $('.widget-recomendation [name=widget-color-title]').val();
        if(color_title != "") style += "#corton-recomendation-widget .corton-title{color: #" + color_title + ";}";

        var bold = $('.widget-recomendation [name=widget-type-bold-title]').val();
        if(bold != "") style += "#corton-recomendation-widget .corton-title{font-weight: " + bold + ";}";

        if($('.widget-recomendation [name=widget-type-italic-title]').prop("checked")) style += "#corton-recomendation-widget .corton-title{font-style: italic;}";

        if($('.widget-recomendation [name=widget-type-underline-title]').prop("checked")) style += "#corton-recomendation-widget .corton-title{text-decoration: underline;}";

        style += ".corton-recomendation-section a{display: block; box-sizing: border-box; width: 100%; padding: 10px; text-decoration: none;}";

        var background_tizer = $('.widget-recomendation [name=widget-background-tizer]').val();
        if(background_tizer != "") style += ".corton-recomendation-section a{background: #" + background_tizer + ";}";

        var color_text = $('.widget-recomendation [name=widget-color-text]').val();
        if(color_text != "") style += ".corton-recomendation-section a{color: #" + color_text + ";}";

        var font_text = $('.widget-recomendation [name=widget-font-text]').val();
        if(font_text != "") style += ".corton-recomendation-section a{font-family: " + font_text + ";}";

        var size_text = $('.widget-recomendation [name=widget-size-text]').val();
        if(size_text != "") {
            if (widgetfontunit=='px') {
                style += ".corton-recomendation-section a{font-size: " + size_text + "px;}";
            } else {
                style += ".corton-recomendation-section a{font-size: " + size_text/10 + "em;}";
            };
        };

        var size_text = $('.widget-recomendation [name=widget-type-bold-text]').val();
        if(size_text != "") style += ".corton-recomendation-section a{font-weight: " + size_text + ";}";

        var size_text = $('.widget-recomendation [name=widget-type-interval-text]').val();
        if(size_text != "") style += ".corton-recomendation-section a p{line-height: " + size_text + "; text-indent: 0px !important;}";

        var size_text = $('.widget-recomendation [name=widget-type-align-text]').val();
        if(size_text != "") style += ".corton-recomendation-section p{text-align: " + size_text + ";}";

        if($('.widget-recomendation [name=widget-type-italic-text]').prop("checked")) style += ".corton-recomendation-section a{font-style: italic;}";

        if($('.widget-recomendation [name=widget-type-underline-text]').prop("checked")) style += ".corton-recomendation-section a{text-decoration: underline;}";

        var variable = $("#textarea-recomendation").val();
        if(variable != "") style += variable;

        $('.widget-recomendation [name=dop-css]').val(variable);
        $('.widget-recomendation [name=css]').val(style);

        $('.recomendation-script-container').html('<style>' + style + '</style>');

        var variable = $('.widget-recomendation [name=image-shape]').val();
        let n = $('.recomendationimg').length;
        for (i = 0; i < n; i++) {
            if (variable == 3){
                $('.recomendationimg')[i].style.width= "270px";
                $('.recomendationimg')[i].style.height= "180px";
            }else {
                $('.recomendationimg')[i].style.width= "180px";
                $('.recomendationimg')[i].style.height= "180px";
            }
        }
    }

// При изменении виджета nativepre
    $('.widget-nativepre input, .widget-nativepre select').change(function(){
        widget_nativepre();
    });
    widget_nativepre();
// Визуализация виджета nativepre-статья
    function widget_nativepre(){
        var style = "#corton-nativepreview-widget{width: 100%; padding: 18px 0 18px 0; display: table !important; box-sizing: border-box; margin-bottom: 20px; margin-top: 20px;}\n";

        style += "#corton-nativepreview-widget .corton-left{display: table-cell !important; vertical-align: middle; width: 290px;}\n";

        style += "#corton-nativepreview-widget .corton-left img{width: 100%; max-width: 290px; vertical-align:top; object-fit: cover;}\n";

        style += "#corton-nativepreview-widget .corton-right{display: table-cell !important; vertical-align: middle; padding-left: 15px;}\n";
        style += "#corton-nativepreview-widget .corton-title{width: 100%; padding-bottom: 10px !important; font-weight: 400;}\n";

        style += "#corton-nativepreview-widget .corton-link{display: inline-block !important; padding: 2px 10px !important;}\n";

        style += " @media (max-width: 600px) and (min-width: 200px) { #corton-nativepreview-widget .corton-left{ float: left; }}";
        style += " @media (max-width: 600px) and (min-width: 200px) { #corton-nativepreview-widget .corton-right{ padding-left: 0px; padding-top: 10px; }}";
		style += " @media (max-width: 640px) and (min-width: 600px) { #corton-nativepreview-widget .corton-left{ width: 230px; }}";
        style += " @media (max-width: 600px) and (min-width: 200px) { #corton-nativepreview-widget .corton-left{ width: 100%; }}";
		style += " @media (max-width: 440px) and (min-width: 360px) { #corton-nativepreview-widget .corton-left img{ width: 100%; max-width: 440px; height: 168px; object-fit: cover; }}";
        style += " @media (max-width: 360px) and (min-width: 200px) { #corton-nativepreview-widget .corton-left img{ width: 100%; max-width: 360px; }}";
        var widgetfontunit=$('.widget-nativepre [name=widget-font-unit]').val();

        var variable = $('.widget-nativepre  [name=widget-background-block]').val();
        if (variable != "") style += "#corton-nativepreview-widget{background: #" + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-width-block]').val();
        if ((variable != "")&& (variable!=0))style += "#corton-nativepreview-widget{width: " + variable + "%;}\n";

        var variable = $('.widget-nativepre  [name=widget-border-type]').val();
        var variable2 = $('.widget-nativepre  [name=widget-border-width]').val();
        var variable3 = $('.widget-nativepre  [name=widget-border-color]').val();
        if (variable == "left") style += "#corton-nativepreview-widget{border-left: "+variable2+"px #" + variable3 + " " + variable + ";}\n";
        else if (variable == "right") style += "#corton-nativepreview-widget{border-right: "+variable2+"px #" + variable3 + " " + variable + ";}\n";
        else if (variable != "") style += "#corton-nativepreview-widget{border-top: "+variable2+"px #" + variable3 + " " + variable + "; border-bottom: "+variable2+"px #" + variable3 + " " + variable + "; }\n";

        var variable = $('.widget-nativepre  [name=widget-font-title]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-title{font-family: " + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-size-title]').val();
        if (variable != "") {
            if (widgetfontunit=='px') {
                style += "#corton-nativepreview-widget .corton-title{font-size: " + variable + "px;}";
            } else {
                style += "#corton-nativepreview-widget .corton-title{font-size: " + variable/10 + "em;}";
            };
        };

        var variable = $('.widget-nativepre  [name=widget-color-title]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-title{color: #" + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-type-bold-title]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-title{font-weight: " + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-type-interval-title]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-title{line-height: " + variable + ";}\n";

        if ($('.widget-nativepre  [name=widget-type-italic-title]').prop("checked")) style += "#corton-nativepreview-widget .corton-title{font-style: italic;}\n";

        if ($('.widget-nativepre  [name=widget-type-underline-title]').prop("checked")) style += "#corton-nativepreview-widget .corton-title{text-decoration: underline;}\n";

        var variable = $('.widget-nativepre  [name=widget-font-text]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-content{font-family: " + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-size-text]').val();
        if (variable != "") {
            if (widgetfontunit=='px') {
                style += "#corton-nativepreview-widget .corton-content{font-size: " + variable + "px;}";
            } else {
                style += "#corton-nativepreview-widget .corton-content{font-size: " + variable/10 + "em;}";
            };
        };

        var variable = $('.widget-nativepre  [name=widget-color-text]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-content{color: #" + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-type-bold-text]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-content{font-weight: " + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=widget-type-interval-text]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-content{line-height: " + variable + ";}\n";

        if ($('.widget-nativepre  [name=widget-type-italic-text]').prop("checked")) style += "#corton-nativepreview-widget .corton-content{font-style: italic;}\n";

        if ($('.widget-nativepre  [name=widget-type-underline-text]').prop("checked")) style += "#corton-nativepreview-widget .corton-content{text-decoration: underline;}\n";

        var variable = $('.widget-nativepre  [name=button-background-color]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-link{background: #" + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=button-text-color]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-link{color: #" + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=button-font]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-link{font-family: " + variable + ";}\n";

        var variable = $('.widget-nativepre  [name=button-font-size]').val();
        if (variable != "") {
            if (widgetfontunit=='px') {
                style += "#corton-nativepreview-widget .corton-link{font-size: " + variable + "px;}";
            } else {
                style += "#corton-nativepreview-widget .corton-link{font-size: " + variable/10 + "em;}";
            };
        };

        var variable = $('.widget-nativepre  [name=button-type-bold]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-link{font-weight: " + variable + ";}\n";

        if ($('.widget-nativepre  [name=button-type-italic]').prop("checked")) style += "#corton-nativepreview-widget .corton-link{font-style: italic;}\n";

        if ($('.widget-nativepre  [name=button-type-underline]').prop("checked")) style += "#corton-nativepreview-widget .corton-link{text-decoration: underline;}\n";

        var variable = $('.widget-nativepre  [name=button-border-width]').val();
        var variable2 = $('.widget-nativepre  [name=button-border-color]').val();
        var variable3 = $('.widget-nativepre  [name=button-border-type]').val();
        if (variable != "") style += "#corton-nativepreview-widget .corton-link{border: " + variable + "px #" + variable2 + " " + variable3 + ";}\n";

        var text_title = $('.widget-nativepre [name=button-text]').val();
        $('#corton-nativepreview-widget .corton-link').text(text_title);

        var variable = $("#textarea-nativepreview").val();
        if(variable != "") {
            style += variable;
            $('.widget-nativepre [name=dop-css]').val(variable);
        }

        $('.widget-nativepre [name=css]').val(style);
        $('.nativepre-script-container').html('<style>' + style + '</style>');

        var variable = $('.widget-nativepre [name=image-shape]').val();
        if (variable == 3){
            $('.natpreimg')[0].style.width= "270px";
            $('.corton-left')[0].style.width= "270px";
        }
        if (variable == 4){
            $('.natpreimg')[0].style.width= "180px";
            $('.corton-left')[0].style.width= "180px";
        }
    }

// При изменении виджета slider
    $('.widget-slider input, .widget-slider select').change(function(){
        widget_slider();
    });
    widget_slider();
// Визуализация виджета slider
    function widget_slider(){
        var style = "#corton-slider-widget{width: 360px; height: 110px; display: table; position: relative; box-sizing: border-box; bottom: 0px; right: 0px; z-index: 99999;}\n";
        style += ".close-widget{display: block; position: absolute; top:0px; right: 0px; width: 15px; height: 15px;}";

        style += ".close-widget:after{content: ''; position: absolute; left: -4px; bottom: -6px; border: 7px solid transparent;  border-top: 7px solid #cccccc; cursor: pointer;}";
        style += ".widget-slider .corton-left{display: table-cell; vertical-align: middle; width: 110px; height: 110px;}\n";
        style += ".widget-slider .corton-left img{width: 110px; height: 110px; float: left;}\n";
        style += ".widget-slider .corton-right{display: table-cell; vertical-align: middle; padding: 0 10px 10px 10px;}\n";
        style += ".widget-slider .corton-title{width: 100%; margin-top: 5px;}\n";
        style += ".widget-slider .corton-sign{font-size: 12px;}\n";

        style += " @media (max-width: 460px) and (min-width: 220px) { #corton-slider-widget{ width: 100% !important; height: 95px !important; }}";
        style += " @media (max-width: 460px) and (min-width: 220px) { .widget-slider .corton-left img{ width: 95px; height: 95px; }}";

        var widgetfontunit=$('.widget-slider [name=widget-font-unit]').val();

        var variable = $('.widget-slider  [name=widget-background-block]').val();
        if (variable != "") style += "#corton-slider-widget{background: #" + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-border-type]').val();
        if (variable != "") style += "#corton-slider-widget{border: 1px #ccc " + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-border-width]').val();
        if (variable != "") style += "#corton-slider-widget{border-width: " + variable + "px;}\n";

        var variable = $('.widget-slider  [name=widget-border-color]').val();
        if (variable != "") style += "#corton-slider-widget{border-color: #" + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-font-sign]').val();
        if (variable != "") style += ".widget-slider  .corton-sign{font-family: " + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-size-sign]').val();
        if (variable != "") {
            if (widgetfontunit=='px') {
                style += ".widget-slider  .corton-sign{font-size: " + variable + "px;}";
            } else {
                style += ".widget-slider  .corton-sign{font-size: " + variable/10 + "em;}";
            };
        };

        var variable = $('.widget-slider  [name=widget-color-sign]').val();
        if (variable != "") style += ".widget-slider  .corton-sign{color: #" + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-font-title]').val();
        if (variable != "") style += ".widget-slider  .corton-title{font-family: " + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-size-title]').val();
        if (variable != "") {
            if (widgetfontunit=='px') {
                style += ".widget-slider .corton-title{font-size: " + variable + "px;}";
            } else {
                style += ".widget-slider .corton-title{font-size: " + variable/10 + "em;}";
            }
        }

        var variable = $('.widget-slider  [name=widget-color-title]').val();
        if (variable != "") style += ".widget-slider .corton-title{color: #" + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-type-bold-title]').val();
        if (variable != "") style += ".widget-slider .corton-title{font-weight: " + variable + ";}\n";

        var variable = $('.widget-slider  [name=widget-type-interval-title]').val();
        if (variable != "") style += ".widget-slider  .corton-title{line-height: " + variable + ";}\n";

        if ($('.widget-slider [name=widget-type-italic-title]').prop("checked")) style += ".widget-slider  .corton-title{font-style: italic;}\n";

        if ($('.widget-slider [name=widget-type-underline-title]').prop("checked")) style += ".widget-slider  .corton-title{text-decoration: underline;}\n";

        var variable = $("#textarea-slider").val();
        if(variable != "") {
            style += variable;
            $('.widget-slider [name=dop-css]').val(variable);
        }
        $('.widget-slider [name=css]').val(style);
        $('.slider-script-container').html('<style>' + style + '</style>');
    }

    //переключение табов при редактирование статьи
    // $( "#tab1" ).on( "click", function() {
    //     $(".w-tab-pane").removeClass("w--tab-active");
    //     $(".w-tab-link").removeClass("w--current");
    //     $("#tab1").addClass("w--current");
    //     $("#tab1block").addClass("w--tab-active");
    // });
    // $( "#tab2" ).on( "click", function() {
    //     $(".w-tab-pane").removeClass("w--tab-active");
    //     $(".w-tab-link").removeClass("w--current");
    //     $("#tab2").addClass("w--current");
    //     $("#tab2block").addClass("w--tab-active");
    // });
    // $( "#tab3" ).on( "click", function() {
    //     $(".w-tab-pane").removeClass("w--tab-active");
    //     $(".w-tab-link").removeClass("w--current");
    //     $("#tab3").addClass("w--current");
    //     $("#tab3block").addClass("w--tab-active");
    //     let toolbar=document.querySelector('div.ql-toolbar.ql-snow');
    //     if (toolbar)  toolbar.style.position = 'relative';
    // });
    // $( "#tab4" ).on( "click", function() {
    //     $(".w-tab-pane").removeClass("w--tab-active");
    //     $(".w-tab-link").removeClass("w--current");
    //     $("#tab4").addClass("w--current");
    //     $("#tab4block").addClass("w--tab-active");
    // });

    //Подключение слов в форму ключи
    function words() {
        let variable=$('.div-block-84.word').text();
        variable=variable.replace(/Удалить/g,',');
        variable=variable.replace(/ /g,'');
        variable=variable.replace(/\n/g,'');
        variable=variable.slice(0, -1);
        $('[name=words]').val(variable);
    }
    words();

    //Выделение, снятие всех категорий в таргетингах
    $("#category_select_all").on( "click", function() {
        $( ".div-block-86 > .checkbox" ).prop( "checked", true );
    });
    $("#category_clear_all").on( "click", function() {
        $( ".div-block-86 > .checkbox" ).prop( "checked", false );
    });

    //Добавление ключевых слов при редактировании статьи
    $( ".text-block-141.key" ).on( "click", function() {
        var variable = $('#addkey-2').val();
        if (variable.length > 3) {
            $('.div-block-84.word').append('<div class="div-block-86"><div class="text-block-114">' + variable + '</div><div class="text-block-98">Удалить</div></div>');
            $('#addkey-2').val("");
            words();
        }else{
            alert('Введите ключевое слово длинее 4 символов');
        }
    });
    //Удаление ключевых слов при редактировании статьи
    $(document).on('click','.text-block-98',function(){
        $(this).parent('tr').toggle('slow');
        $(this).parent('div').toggle('slow');
        var $this=this;
        setTimeout(function (){
            $($this).parent('tr').remove();
            $($this).parent('div').remove();
            words();geo();
        }, 300);
    });

    //Добавление условий поиска категорий на пложадках

    $(document).on('click','#addcategory',function(){
        let str="<option selected=\"\" value=\"\">Выберите</option>";
        Object.keys(category).forEach(function(el, id) {
            str=str+'<option value="'+el+'">'+category[el]+'</option>';
        });

        $("#tablecategory").append("" +
            "<tr>"+
            "<td>"+
            "<select name=\"categoriay[]\" required=\"\" class=\"select-field w-select\">"+
            str +
            "</select>"+
            "</td>"+
            "<td>"+
            "<select name=\"type_search[]\" required=\"\" class=\"select-field w-select\">"+
            "<option selected=\"\" value=\"\">Выберите</option>"+
            "<option value=\"0\">По url</option>"+
            "<option value=\"1\">По DOM</option>"+
            "</select>"+
            "</td>"+
            "<td>"+
            "<input type=\"text\" class=\"text-field-10 w-input\" maxlength=\"256\" name=\"regex[]\" value=\"\" placeholder=\"Регуляторка url\" required=\"\">"+
            "</td>"+
            "<td style=\"color:red\" class=\"text-block-98\">Удалить</td>"+
            "</tr>"
        );

    });

    //Добавление формы анонса
    $('#addanons').click(function() {
        $('#anonses').append(
            '<div class="div-block-97-copy">' +
                '<input type="hidden" name="anons_ids[]" value="new">' +
                '<div class="div-block-142">' +
                    '<div class="div-block-145">' +
                        '<input type="text" class="text-field-6 _1 w-input" maxlength="60" name="title[]" placeholder="Заголовок анонса статьи до 60 символов" id="title-3" required="">' +
                        '<textarea name="opisanie[]" required="" placeholder="Описание от 90 до 120 символов" maxlength="120" class="textarea-7 w-input"></textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="div-block-142">' +
                    '<div class="div-block-148">' +
                        '<div class="image-preview">' +
                            '<label for="image-upload290" class="image-label">Загрузить изображение 290x180px</label>' +
                            '<input type="file" name="image290[]" class="image-upload290" accept=".png,.jpeg,.jpg,.gif" required="" />' +
                        '</div>' +
                    '</div>' +
                    '<div class="div-block-147"></div>' +
                    '<div class="div-block-148">' +
                        '<div class="image-preview _180">' +
                            '<label for="image-upload180" class="image-label">Загрузить изображение 180x180px</label>' +
                            '<input type="file" name="image180[]" class="image-upload180"  accept=".png,.jpeg,.jpg,.gif" required="" />' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<a class="button-10 w-button delanons">Удалить анонс</a>' +
            '</div>'
        );
    });
    //Удаление формы анонса
    $(document).on('click','.delanons',function(){
        $(this).parent('div').toggle('slow');
        $this=this;
        setTimeout(function (){
             $($this).parent('div').remove();
        }, 400);
    });
    //Подгрузка картинки в форму 290x180px
    $(document).on('change','.image-upload290',function(){
        var files = this.files;
        var file = files[0];
        var reader = new FileReader();
        var diver=this;
        reader.addEventListener("load",function(event) {
            var loadedFile = event.target;
            if (file.type.match('image')) {
                // Image
                $(diver).parent('div').css("background-image", "url("+loadedFile.result+")");
                $(diver).parent('div').css("background-position", "center center");
                $(diver).parent('div').css("background-repeat", "no-repeat");
                $(diver).parent('div').css("background-size", "cover");
                $(diver).parent('div').children('label').css("background-color", "#e1e2e8");
                $(diver).parent('div').children('label').html("Обновить изображение 290x180px");
            } else {
                alert("This file type is not supported yet.");
            }
        });
        reader.readAsDataURL(file);
    });
    //Подгрузка картинки в форму 180x180px
    $(document).on('change','.image-upload180',function(){
        var files = this.files;
        var file = files[0];
        var reader = new FileReader();
        var diver=this;
        reader.addEventListener("load",function(event) {
            var loadedFile = event.target;
             if (file.type.match('image')) {
                $(diver).parent('div').css("background-image", "url("+loadedFile.result+")");
                $(diver).parent('div').css("background-position", "center center");
                $(diver).parent('div').css("background-repeat", "no-repeat");
                $(diver).parent('div').css("background-size", "cover");
                $(diver).parent('div').children('label').css("background-color", "#e1e2e8");
                $(diver).parent('div').children('label').html("Обновить изображение 180x180px");
            } else {
                alert("This file type is not supported yet.");
            }
        });
        reader.readAsDataURL(file);
    });

    //Подгрузка десктоп скриншота в таргетингах
    $(document).on('change','.image-upload510',function(){
        var files = this.files;
        var file = files[0];
        var reader = new FileReader();
        var diver=this;

        var oldimg=$(diver).parent('div').css("background-image");
        function f() {
            var image = new Image();
            image.src = document.getElementById('imagepreview510').style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
            var input = document.getElementById('screenshot_desktop');
            if ((image.width!=1280)||(image.height!=800)){
                alert('Размер картинки должен быть 1280x800px');
                input.value = '';
                $(diver).parent('div').css("background-image", oldimg);
            }else {
                $(diver).parent('div').children('label').html("Скриншот десктоп "+image.width+"x"+image.height+"px");
            }
        }

        reader.addEventListener("load",function(event) {
            var loadedFile = event.target;
            if (file.type.match('image')) {
                $(diver).parent('div').css("background-image", "url("+loadedFile.result+")");
                $(diver).parent('div').css("background-position", "center center");
                $(diver).parent('div').css("background-repeat", "no-repeat");
                $(diver).parent('div').css("background-size", "cover");
                $(diver).parent('div').children('label').css("background-color", "#e1e2e8");
                setTimeout(f ,2000);
            } else {
                alert("This file type is not supported yet.");
            }
        });
        reader.readAsDataURL(file);
    });

    //Подгрузка мобильного скриншота  в таргетингах
    $(document).on('change','.image-upload239',function(){
        var files = this.files;
        var file = files[0];
        var reader = new FileReader();
        var diver=this;

        var oldimg=$(diver).parent('div').css("background-image");
        function f() {
            var image = new Image();
            image.src = document.getElementById('imagepreview239').style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
            var input = document.getElementById('screenshot_mobile');
            if ((image.width!=720)||(image.height!=1200)){
                alert('Размер картинки должен быть 720x1200px');
                input.value = '';
                $(diver).parent('div').css("background-image", oldimg);
            }else {
                $(diver).parent('div').children('label').html("Скриншот мобильный "+image.width+"x"+image.height+"px");
            }
        }

        reader.addEventListener("load",function(event) {
            var loadedFile = event.target;
            if (file.type.match('image')) {
                $(diver).parent('div').css("background-image", "url("+loadedFile.result+")");
                $(diver).parent('div').css("background-position", "center center");
                $(diver).parent('div').css("background-repeat", "no-repeat");
                $(diver).parent('div').css("background-size", "cover");
                $(diver).parent('div').children('label').css("background-color", "#e1e2e8");
                setTimeout(f ,2000);
            } else {
                alert("This file type is not supported yet.");
            }
        });
        reader.readAsDataURL(file);
    });

    s = document.getElementById('imagepreview239');
    if (s){
        s=s.style.backgroundImage;
        var image = new Image();
        image.src = 'https:'+s.split('("').pop().split('")').shift();
        if (image.width)
        $('#imagepreview239').children('label').html("Скриншот&nbsp;&nbsp; мобильный "+image.width+"x"+image.height+"px");
    }

    s = document.getElementById('imagepreview510');
    if (s){
        s=s.style.backgroundImage;
        var image = new Image();
        image.src = 'https:'+s.split('("').pop().split('")').shift();
        if (image.width)
        $('#imagepreview510').children('label').html("Скриншот десктоп "+image.width+"x"+image.height+"px");
    }

    //Добавление стилей
    $('#textarea-promo').keyup(function(){widget_promo();});
    $('#textarea-promo2').keyup(function(){widget_promo();});
    $('#textarea-recomendation').keyup(function(){widget_recomendation();});
    $('#textarea-nativepreview').keyup(function(){widget_nativepre();});
    $('#textarea-slider').keyup(function(){widget_slider();});

    //Переключатель смены алгоритма вывода виджетов Recomendation и Natpre
    function radioch(widget){
        var v=$(widget+'input[name=algorithm-output]:checked').val();
        switch(v)
        {
            case '1':
                $(widget+'input[name=widget-parent-id]').prop('disabled', true);
                $(widget+'input[name=widget-position-p]').prop('disabled', true);
                break;
            case '0':
                $(widget+'input[name=widget-parent-id]').prop('disabled', false);
                $(widget+'input[name=widget-position-p]').prop('disabled', false);
                break;
            default:
                $(widget+'input[name=widget-parent-id]').prop('disabled', false);
                $(widget+'input[name=widget-position-p]').prop('disabled', true);
        }
    }
    $('.widget-recomendation  input[name=algorithm-output]').click( function() {
        radioch('.widget-recomendation ');
    });
    $('.widget-nativepre  input[name=algorithm-output]').click( function() {
        radioch('.widget-nativepre ');
    });
    radioch('.widget-recomendation ');
    radioch('.widget-nativepre ');

    //События radiobutton в правом меню панели с отправкой формы
    $('label').click(function(){
        $(this).find(':radio').attr('checked','checked');
        $("#right-form").submit();
    });

    //Вывод балансов
    $('#button_vivod').click(function(){
        var variable = $('[name=summa]').val();

        //alert(variable);
        $.post("https://panel.cortonlab.com/finance-vivod?summa="+variable,function(data) {
            switch (data) {
                case 'summa':{$('#status_vivod').text('Неправильная сумма к выводу'); break;}
                case 'date':{$('#status_vivod').text('Ошибка запрашивать вывод можно, не чаше 1 раза в месяц'); break;}
                case 'true':{$('#status_vivod').text('Запрос принят');}
            }
        });
    });

    //Скрытие панели левого меню
    $('#panel_hide').click(function(){
        var str = $(this).text();
        if (str==='<'){
            $(this).text('>');
            document.getElementsByClassName('left-menu')[0].style.display = 'none';
            document.getElementsByClassName('div-block-88')[0].style.marginLeft = '0px';
            document.getElementById('panel_hide').style.marginLeft = '0px';
        } else {
            $(this).text('<');
            document.getElementsByClassName('left-menu')[0].style.display = 'block';
            document.getElementsByClassName('div-block-88')[0].style.marginLeft = '246px';
            document.getElementById('panel_hide').style.marginLeft = '246px';
        }
    });

    //Выпадающий список при поиске региона
    $('input[name=searchgeo]').keyup(function(){
        let value=$(this).val();
        value=value.replace(/[^-А-Я ,]/gim,'');
        $(this).val(value);
        value=value.toLowerCase();
        let str='';
        let count=0;
        if (value.length){
            Object.keys(countries).forEach(function(el, id) {
                if (count<15){
                    let itm=countries[el].toLowerCase();
                    if(itm.indexOf(value) + 1) {
                        str=str+'<li data-name="'+el+'"><div>'+countries[el]+'</div><div style="color: #008a00">Добавить</div></li>';
                        count++;
                    }
                }
            });

            if (count) {
                $('#geolist').html('<ul id="geo_list"><p>' + str + '</p></ul>');
            }else{
                $('#geolist').html('<div>Регион не найден</div>');
            }
            $('#geolist').show();
        }else {
            $('#geolist').html('');
            $('#geolist').hide();
        }
    });

    //Добавление в список регионов
    $(document).on('click','ul#geo_list > li',function(){
        let region=$(this).text();
            region=region.substr(0,region.length - 8);
        let name=$(this).data('name');
        $('.div-block-84.geo').append('<div class="div-block-86"><div class="text-block-114 isogeolist" data-label="'+name+'">' + region + '</div><div class="text-block-98">Удалить</div></div>');
        $('#geolist').hide();
        $('input[name=searchgeo]').val('');
        geo();
    });

    //Загрузка скриншота миниатюры сайта рекламодателя в таргетингах
/*    $(document).on('click','#load_preview_site',function(){
        var url = new URL(location.href);
        var searchParams = new URLSearchParams(url.search.substring(1));
        var id = searchParams.get("id");
        $('#screenshot_desktop').html('');
        $('#screenshot_mobile').html('');
        uri=$('[name=scroll2site_url]').val();
        $.post("https://panel.cortonlab.com/article-edit-target-img-upload?id="+id+"&url="+uri,function(data){
            $('#screenshot_desktop').html('<img src="https://185.75.90.54/img/rekl_screenshot_site/'+id+'_desktop.png?timestamp='+Date.now()+'">');
            $('#screenshot_mobile').html('<img src="https://185.75.90.54/img/rekl_screenshot_site/'+id+'_mobile.png?timestamp='+Date.now()+'">');
        });
    });
    var img = $('#screenshot_desktop > img'); if ($(img).width()<=50){img.remove()}
    var img = $('#screenshot_mobile > img');  if ($(img).width()<=50){img.remove()}
*/
    //Активация Scroll2Site в таргетингах
    $('#Scroll2Site').click(function() {
        if ($(this).is(':checked')){
            $('input[name=scroll2site_text]').prop('disabled', false);
            $('input[name=scroll2site_url]').prop('disabled', false);
            $('input[name=scroll2site_url_text]').prop('disabled', false);
            $('input[name=screenshot_desktop]').prop('disabled', false);
            $('input[name=screenshot_mobile]').prop('disabled', false);
        } else {
            $('input[name=scroll2site_text]').prop('disabled', true);
            $('input[name=scroll2site_url]').prop('disabled', true);
            $('input[name=scroll2site_url_text]').prop('disabled', true);
            $('input[name=screenshot_desktop]').prop('disabled', true);
            $('input[name=screenshot_mobile]').prop('disabled', true);
        }
    });

    //Отключение отправки форм по нажатию Enter
    $(document).ready(function() {
        $(window).keydown(function(event){
            if((event.keyCode == 13) && (event.originalEvent.target.localName=='input')) {
               event.preventDefault();
               return false;
            }
        });
    });

    //Подключение слов в форму регионы
    function geo() {
        var arr = [];
        var variable=document.querySelectorAll('.isogeolist');
        for (i = 0; i < variable.length; i++) {
//            console.log( variable[i].dataset.label);
            arr[i]=variable[i].dataset.label;
        }
        if (arr.length){
            $('#region_default').remove();
        }else{
            $('.div-block-84.geo').html('<div class="text-block-110" id="region_default">по умолчанию регион Россия</div>');
        }
        $('[name=geo]').val(arr.join(','));
    }
    geo();

    //Создание статьи на основе текущей
    $('#add_variat_promo').click(function(){
        let variant = document.getElementsByClassName('aticlevariant');
        id=$_GET('id');
        switch (variant.length) {
            case 1:{
                $.post("https://panel.cortonlab.com/article-clone?id="+id, function(data) {
                    $('#add_variat_promo').before("<a href='https://panel.cortonlab.com/article-edit-content?id="+ data +"' class=\"btnarticlegr aticlevariant\" style=\"width: 120px;float:left;margin-right: 12px;\">Вариант B</a>");
                });
                break;
            }
            case 2:{
                $.post("https://panel.cortonlab.com/article-clone?id="+id, function(data) {
                    $('#add_variat_promo').before("<a href='https://panel.cortonlab.com/article-edit-content?id="+ data +"' class=\"btnarticlegr aticlevariant\" style=\"width: 120px;float:left;margin-right: 12px;\">Вариант C</a>");
                });
                break;
            }
            case 3:{
                $.post("https://panel.cortonlab.com/article-clone?id="+id, function(data) {
                    $('#add_variat_promo').before("<a href='https://panel.cortonlab.com/article-edit-content?id="+ data +"' class=\"btnarticlegr aticlevariant\" style=\"width: 120px;float:left;margin-right: 12px;\">Вариант D</a>");
                    $('#add_variat_promo').remove();
                });
            }
        }
    });
});

//Блок с информацией о обновлениях для площадок
$(function(){
    function get_cookie(cookie_name){
        var results = document.cookie.match ('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
        if (results)
            return (unescape (results[2]));
        else
            return null;
    }

    function check_cookie(){
        var textCookie = get_cookie('messagetext'),
            currentText = $('.message-box p').text();
        if (textCookie == currentText) {
            $('.message-box').hide(0);
        }
    }
    check_cookie();
    
    $('.close-button').click(function(){
        var currentText = $('.message-box p').text(),
        date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
		document.cookie = "messagetext="+currentText+"; expires="+date.toGMTString()+"; path=/";
        $('.message-box').fadeOut(200);
    });
})

/* Выпадающая кнопка для админки */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}