<?php
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json;');
$kuki=2;
//require_once('/var/www/www-root/data/www/stat.cortonlab.com/postgres.php');
$stat_arr['is_load_widget']=1;

$interes = addslashes(implode("','",$_GET['c']));
$_GET = array_map('addslashes', $_GET);

if ($_SERVER['REMOTE_ADDR']=='192.168.1.153')$_SERVER['REMOTE_ADDR']='185.68.146.112';

#Определение geo
require_once '/var/www/www-root/data/www/api2.cortonlab.com/geoip/geoip.php';

$redis = new Redis();
$redis->pconnect('185.75.90.54', 6379);
$stat_arr['view_id']=$arr['prosmotr_id'] = $redis->incr("prosmotr_id");
$redis->close();

require_once('/var/www/www-root/data/www/panel.cortonlab.com/config/db.php');

$words=str_replace(',', '\',\'', $_GET['words']);
$count_widgets=$_GET['e']+$_GET['r']+$_GET['s'];

if (strlen($iso)==2) {
    $sql = "SELECT c.`promo_id` FROM `promo_category` c JOIN `promo` p ON c.`promo_id`=p.`main_promo_id` WHERE (FIND_IN_SET('" . $iso . "', p.`region`)) AND c.`category_id` IN ('" . $interes . "') AND p.`active`=1 GROUP BY c.`promo_id`";
    $sql2 = "SELECT `promo_ids` FROM `words_index` WHERE `word` IN ('" . $words . "') AND `region`='" . $iso . "'";
}else{
    $county = substr($iso, 0, 2);
    $sql = "SELECT c.`promo_id` FROM `promo_category` c JOIN `promo` p ON c.`promo_id`=p.`main_promo_id` WHERE (FIND_IN_SET('" . $county . "', p.`region`) OR FIND_IN_SET('" . $iso . "', p.`region`)) AND p.`active`=1 AND c.`category_id` IN ('" . $interes . "') GROUP BY c.`promo_id`";
    $sql2="SELECT `promo_ids` FROM `words_index` WHERE `word` IN ('".$words."') AND `region` IN ('".$county . "','" . $iso."')";
}

$result0 = $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_COLUMN);
$result1 = $GLOBALS['db']->query($sql2)->fetchALL(PDO::FETCH_COLUMN);
$result2 = array();
foreach ($result1 as $i) {
    $result2 = array_merge($result2, explode(',',$i));
};

$result1=implode("','",$result2);
$sql2="SELECT `id` FROM `promo` WHERE `active`=1 AND `id` IN ('".$result1."')";
$result2 = $GLOBALS['db']->query($sql2)->fetchALL(PDO::FETCH_COLUMN);

$promo_ids=array_unique(array_merge($result0, $result2));

# Фильтр статей где обязательное обязательное совпадение по ключу и категория
if (count($promo_ids)){
    $domen=parse_url ($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST );
    $sql= "SELECT `medblok`,`finblok` FROM `ploshadki` WHERE `domen`='".$domen."'";
    $blok = $GLOBALS['db']->query($sql)->fetch(PDO::FETCH_ASSOC);

    $ids = implode("','", $promo_ids);

    if ($blok['medblok']) {
        $sql="SELECT `id` FROM `promo` WHERE `medblok`='1' AND `id` IN ('".$ids."')";
        $blok_ids = $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_COLUMN);
        foreach ($blok_ids as $i){
            $key = array_search($i,$promo_ids);
            unset($promo_ids[$key]);
        }
        $ids = implode("','", $promo_ids);
    }

    if ($blok['finblok']) {
        $sql="SELECT `id` FROM `promo` WHERE `finblok`='1' AND `id` IN ('".$ids."')";
        $blok_ids = $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_COLUMN);
        foreach ($blok_ids as $i){
            $key = array_search($i,$promo_ids);
            unset($promo_ids[$key]);
        }
        $ids = implode("','", $promo_ids);
    }

    $sql="SELECT `id` FROM `promo` WHERE `id` IN ('".$ids."') AND `merge_key_and_categor`=1";
    $result3 = $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_COLUMN);
    foreach ($result3 as $i){
        if((in_array($i,$result0)) xor (in_array($i,$result2)))
        {
            $key = array_search($i,$promo_ids);
            unset($promo_ids[$key]);
        }
    }
}

foreach ($promo_ids as $i) {

    $sql = "SELECT `id` FROM `anons` WHERE `promo_id`='" . $i . "'";
    $anons= $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_COLUMN);
    $anons=implode("','" , $anons);

    $sql="SELECT SUM(`pay`) FROM `stat_promo_day_count` WHERE `data`=CURRENT_DATE() and `anons_id` in ('".$anons."')";
    $CPG= $GLOBALS['dbstat']->query($sql)->fetch(PDO::FETCH_COLUMN);
    if (is_null($CPG)) {
        $CPG=0;
    }

    $sql="SELECT max_rashod FROM `promo` WHERE `id` ='".$i."'";
    $max_rashod=$GLOBALS['db']->query($sql)->fetch(PDO::FETCH_COLUMN)-20;

    if ($max_rashod<=$CPG){
        $key = array_search($i,$promo_ids);
        unset($promo_ids[$key]);
    }
}

//Берем ID Анонсов
$promo=implode("','" , $promo_ids);
$sql="SELECT promo_id, anons_ids, stavka
        FROM anons_index WHERE promo_id IN ('".$promo."')
        ORDER BY stavka DESC, RAND()";
$anons_all = $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_ASSOC);

$anons_ids = array();
$y=0;

$anons_count=0;
//Премешивание анонсов внутри статьи
foreach ($anons_all as $i) {
    if ($i['anons_ids']==''){
        unset($anons_all[$y]);
    }else{
        $f = explode(',',$i['anons_ids']);
        shuffle($f);
        //$anons_ids=array_merge($anons_ids, $f);
        $anons_all[$y]['an_count']=count($f);
        $anons_count=$anons_count+count($f);
        $anons_all[$y]['an']=$f;
        $y++;
    };
};

$ch = $ch2 = 0;
$count = count($anons_all);
while ($anons_count != 0) {
    if ($anons_all[$ch]['an_count'] > 0) {
        $an[] = (int)$anons_all[$ch]['an'][$ch2];
        $anons_all[$ch]['an_count']--;
        $anons_count--;
    }
    $ch++;
    if ($ch == $count) {
        $ch = 0;
        $ch2++;
    }
}

$arr['anons_count'] = count($an);

if (count($an)==0){
    $show=0;
} else{
    $an = array_slice($an, 0, $count_widgets);

    $ann = implode("','", $an);

    $sql = "SELECT * FROM `anons` WHERE `id` IN ('" . $ann . "')";
    $result = $GLOBALS['db']->query($sql)->fetchALL(PDO::FETCH_ASSOC);

    while ($count_widgets>count($result))
        $result=array_merge($result, $result);

    shuffle($result);
    $result = array_slice($result, 0, $count_widgets);

    $arr['anons_count']=$count_widgets;

    $ch = 0;
    foreach ($result as $i) {
        $arr['anons'][0][] = $result[$ch]['id'];
        $stat_arr2['preview_id'][]=$i['id'];
        $arr['anons'][1][] = $result[$ch]['title'];
        $arr['anons'][2][] = $result[$ch]['snippet'];
        $arr['anons'][3][] = $result[$ch]['img_290x180'];
        $arr['anons'][4][] = $result[$ch]['img_180x180'];
        $arr['anons'][5][] = $result[$ch]['user_id'];
        $ch++;
    }
    $show=1;
}

preg_match('/\/\/(.*?)\//', $_SERVER['HTTP_REFERER'], $referer);
if ($referer[1]=='kiz.ru')$referer[1]='www.kiz.ru';
$sql="SELECT `id`,`promo_page` FROM `ploshadki` WHERE `domen`='".$referer[1]."'";
$result1 = $GLOBALS['db']->query($sql)->fetch(PDO::FETCH_ASSOC);
$stat_arr['platform_id']=$arr['p_id'] = $result1['id'];
$arr['promo_page']=$result1['promo_page'];

echo json_encode($arr,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

//Cбор статистики слов
$word_arr=explode("','",$words);

foreach ($word_arr as $i){
    $sql = "UPDATE `words` SET `count`=`count`+1 WHERE `platform_id`='".$arr['p_id']."' AND `word`='".$i."'";
    if (!$GLOBALS['dbstat']->exec($sql)){
        $sql = "INSERT INTO `words` SET `platform_id`='".$arr['p_id']."', `word`='".$i."', `count`='1'";
        $GLOBALS['dbstat']->query($sql);
    }
}

$i=parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH);

$sql = "UPDATE `words_top10` SET `count`=`count`+1   WHERE `platform_id`='".$arr['p_id']."' AND `uri`='".$i."'";
if (!$GLOBALS['dbstat']->exec($sql)) {
    $sql = "INSERT INTO `words_top10` SET `platform_id`='" . $arr['p_id'] . "', `uri`='".$i."', `top10`='" . $_GET['words'] . "', `wdget_show`='".$show."',`count`='1'";
    $GLOBALS['dbstat']->query($sql);
}

$stat_arr['words_list']=$words=str_replace("'","",$words);
$stat_arr['promo_id_list']=$promo=str_replace("'","",$promo);
$stat_arr['preview_id_list']=implode(',' ,$stat_arr2['preview_id']);
$stat_arr['category_id_list']=$interes=str_replace("'","",$interes);


if (is_null($_GET['r']))$_GET['r']='0';
$stat_arr['recomend']=$_GET['r'];

if (is_null($_GET['e'])){
    $_GET['e']='f';
}else{
    $stat_arr['native']=$_GET['e'];
}

//statpostgres($stat_arr);

//$sql="insert into tb_stat_request (view_id, words_list, category_id_list, promo_id_list, url, iso, recomend, native, remote_ip, platform_id) values
//    ('".$arr['prosmotr_id']."','{".$words."}','{".$interes."}','{".$promo."}','".$i."','".$iso."','".$_GET['r']."','".$_GET['e']."','".$_SERVER['REMOTE_ADDR']."','".$arr['p_id']."')";
//$GLOBALS['postgre'] -> query($sql);