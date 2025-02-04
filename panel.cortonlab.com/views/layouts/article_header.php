<?php
include PANELDIR.'/views/layouts/header.php';

UsersController::blockArticle();

if (!isset($result['main_promo_id'])){
    $result['main_promo_id']=$_GET['id'];
}

if ($GLOBALS['role']=='advertiser'){
    echo '
    <style>
        #add_variat_promo, .ql-toolbar, .submit-button-6, .flipswitch, .delanons, .image-label{
            display: none;
        }
        input, #editor-container {
            pointer-events: none;
        }
        #right-form>div>input {
            pointer-events: auto;
        }
                
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="btncontrolarticle">
       <a href="/article-edit-content?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Статья</a>
       <a href="/article-link?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Анализ ссылок</a>
       <a href="/article-stat?id=' . $result['main_promo_id'] . '" class="btnarticle" style="border-radius: 4px 4px 4px 4px;">Расширенная статистика</a>
    </div>
    ';
    $sql="SELECT `balans` FROM `balans_rekl` WHERE `user_id`='".$GLOBALS['user']."' AND `date`=(SELECT MAX(`date`) FROM `balans_rekl` WHERE `user_id`='".$GLOBALS['user']."')";
    $balans=$GLOBALS['db']->query($sql)->fetch(PDO::FETCH_COLUMN);
    if ($balans==false)$balans='0.00';
    echo '<script>$(".text-block-balans").html("'.$balans.' р.");</script>';
}else {
    echo '
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="btncontrolarticle">
       <a href="/article-edit-content?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Редактирование</a>
       <a href="/article-edit-anons?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Управление анонсами</a>
       <a href="/article-edit-target?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Таргетинги</a>       
       <a href="/article-link?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Анализ ссылок</a>
       <a href="/article-edit-form?id=' . $result['main_promo_id'] . '" class="btnarticlegr">Лид форма</a>
       <a href="/article-stat?id=' . $result['main_promo_id'] . '" class="btnarticle" style="border-radius: 4px 0 0 4px;">Cтатистика</a>
       <div class="dropdown">
          <button onclick="myFunction()" class="dropbtn"><i class="fa fa-caret-down"></i></button>
       <div id="myDropdown" class="dropdown-content">
         <a href="/article-a/b?id=' . $result['main_promo_id'] . '">A/B анализ</a>
         <a href="/article-stat-url?id=' . $result['main_promo_id'] . '">Анализ ссылок</a>
       </div>
    </div>
    </div>';
}