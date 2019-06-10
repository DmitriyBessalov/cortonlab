<?php
header('Access-Control-Allow-Origin: *');
$_GET = array_map('addslashes', $_GET);
$prosmort_id=(int)$_GET['prosmort_id'];if ($prosmort_id==0)exit;

$redis = new Redis();
$redis->pconnect('185.75.90.54', 6379);
$redis->select(4);
$block=$redis->get('s:'.$prosmort_id);
if ($block){$redis->set('s:'.$prosmort_id, 1, 1296000);exit;}else{$redis->set('s:'.$prosmort_id, 1, 1296000);}

require_once('/var/www/www-root/data/db.php');
$sql= "SELECT `id`,`otchiclen`,`user_id` FROM `ploshadki` WHERE `domen`='".$_GET['host']."'";
$ploshadka_id = $GLOBALS['db']->query($sql)->fetch(PDO::FETCH_ASSOC);

//Блокировка по IP
$redis->select(2);

$block_ip=$redis->get($ploshadka_id['id'].':'.$_SERVER['REMOTE_ADDR']);
if ($block_ip) {
    $redis->set($ploshadka_id['id'].':'.$_SERVER['REMOTE_ADDR'], 1, 1296000);
    exit;
}
$redis->set($ploshadka_id['id'].':'.$_SERVER['REMOTE_ADDR'], 1, 86400);
$redis->close();

$sql= "SELECT n.stavka FROM anons a RIGHT OUTER JOIN anons_index n ON a.promo_id = n.promo_id WHERE a.id='".$_GET['anons_id']."'";
$stavka = $GLOBALS['db']->query($sql)->fetch(PDO::FETCH_COLUMN);

if ($_GET['t']=='e'){$stavka=1.25*$stavka;}else{if($_GET['t']=='s'){$stavka=1.15*$stavka;}}

$stavka=round($stavka*$ploshadka_id['otchiclen']/100,2);

$sql= "UPDATE `stat_promo_prosmotr` SET `pay` = '".$stavka."' WHERE  `prosmotr_id` = '".$_GET['prosmort_id']."'";
$GLOBALS['dbstat']->query($sql);

$sql = "UPDATE `stat_promo_day_count` SET `st` = `st` + 1, `pay` = `pay` + ".$stavka."  WHERE `data`=CURDATE() AND `anons_id`='".$_GET['anons_id']."' AND `promo_variant`='".$_GET['p_id']."'";
if (!$GLOBALS['dbstat']->exec($sql)){$GLOBALS['dbstat']->query("INSERT INTO `stat_promo_day_count` SET `anons_id` = '".$_GET['anons_id']."', `data` = CURDATE(), `promo_variant`='".$_GET['p_id']."', `st` = 1, `pay` = ".$stavka);
}

$sql = "UPDATE `balans_ploshadki` SET `".$_GET['t']."`=".$_GET['t']."+1, `".$_GET['t']."_balans`=".$_GET['t']."_balans+".$stavka."  WHERE `date`=CURDATE() AND `ploshadka_id`='".$ploshadka_id['id']."'";
if (!$GLOBALS['dbstat']->exec($sql)){
    $sql = "INSERT INTO `balans_ploshadki` SET `ploshadka_id` = '".$ploshadka_id['id']."', `date` = CURDATE(), `".$_GET['t']."`=".$_GET['t']."+1, `".$_GET['t']."_balans`=".$_GET['t']."_balans+".$stavka;
    $GLOBALS['dbstat']->query($sql);
}

$sql = "UPDATE `balans_user` SET `balans` = `balans` + ".$stavka." WHERE `date`=CURDATE() AND `user_id`='".$ploshadka_id['user_id']."'";
if (!$GLOBALS['db']->exec($sql)){
    $sql="SELECT `balans` FROM `balans_user` WHERE `user_id` = '".$ploshadka_id['user_id']."' AND `date` =(SELECT MAX(`date`) FROM `balans_user` WHERE `user_id` = '".$ploshadka_id['user_id']."')";
    $oldbalans=$stavka+$GLOBALS['db']->query($sql)->fetch(PDO::FETCH_COLUMN);

    $sql = "INSERT INTO `balans_user` SET `user_id` = '".$ploshadka_id['user_id']."', `date` = CURDATE(), `balans` = ".$oldbalans;
    $GLOBALS['db']->query($sql);
}