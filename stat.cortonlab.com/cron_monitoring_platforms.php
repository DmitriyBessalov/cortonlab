<?php
require_once('/var/www/www-root/data/www/panel.cortonlab.com/config/db.php');

function notifikation($platform_id, $opisanie, $date, $type){
    $last_week_date = date('Y-m-d', strtotime("-7 day", strtotime($date)));
    $sql= "SELECT COUNT(*) FROM `notifications` WHERE `platform_id` = ".$platform_id." AND `opisanie` LIKE '%".$type."%' AND `date`>='".$last_week_date."'";
    $result=$GLOBALS['db']->query($sql)->fetch(PDO::FETCH_COLUMN);
    if ($result){exit;};

    $sql= "SELECT `domen` FROM `ploshadki` WHERE `id`='".$platform_id."'";
    $domen = $GLOBALS['db']->query($sql)->fetch(PDO::FETCH_COLUMN);

    $sql= "INSERT INTO `notifications`( `platform_id`, `opisanie`,`date`) VALUES ('".$platform_id."', '".$opisanie."', '".$date."')";
    $GLOBALS['db']->query($sql);

    mail('support@cortonlab.com', 'Уведомление по '.$domen, $opisanie, "Content-Type: text/html; charset=UTF-8\r\n");
}

$sql="SELECT `id` FROM `ploshadki` WHERE `status`='1' AND `type`!='demo' AND `id`!='0'";
$result = $GLOBALS['db']->query($sql)->fetchAll(PDO::FETCH_COLUMN);

$platform_ids=implode("','", $result);

$mySQLdatebegin = date('Y-m-d', strtotime("-9 days"));
$mySQLdateend = date('Y-m-d', strtotime("-2 days"));
$mySQLdatelast = date('Y-m-d', strtotime("-1 days"));

$sql="SELECT `ploshadka_id`, SUM(`r_show_anons`) AS r_show_anons, SUM(`e_show_anons`) AS e_show_anons, SUM(`s_show_anons`) AS s_show_anons, SUM(`r_promo_load`)+SUM(`e_promo_load`)+SUM(`s_promo_load`) AS promo_load FROM `balans_ploshadki` WHERE `ploshadka_id` IN ('".$platform_ids."') AND `date`>='".$mySQLdatebegin."' AND `date`<'".$mySQLdateend."' GROUP BY `ploshadka_id`";
$result2 = $GLOBALS['dbstat']->query($sql)->fetchAll(PDO::FETCH_ASSOC);

$sql="SELECT `ploshadka_id`,`r_show_anons`,`e_show_anons`,`s_show_anons`,`r_promo_load`+`e_promo_load`+`s_promo_load` AS promo_load FROM `balans_ploshadki` WHERE `ploshadka_id` IN ('".$platform_ids."') AND `date`='".$mySQLdatelast."'";
$result3 = $GLOBALS['dbstat']->query($sql)->fetchAll(PDO::FETCH_ASSOC);

foreach ($result as $i){
    unset ($i22);
    unset ($i33);

    foreach ($result2 as $i2) {
        if ($i2['ploshadka_id']==$i){
            $i22=$i2;
            break;
        }
    }

    foreach ($result3 as $i3) {
        if ($i3['ploshadka_id']==$i){
            $i33=$i3;
            break;
        }
    }

    if (isset($i33)){
        if ($i22['r_show_anons']>500){
            $med=$i22['r_show_anons']/7;
            if ($med>$i33['r_show_anons']){
                $ism=round(100 * ($med-$i33['r_show_anons']) / $med);
                if ($ism>90)
                    notifikation($i,'Снижение показа виджета Recommendation на '.$ism.'%', $mySQLdatelast, 'Recommendation');
            }
        }
        if ($i22['e_show_anons']>150){
            $med=$i22['e_show_anons']/7;
            if ($med>$i33['e_show_anons']){
                $ism=round(100 * ($med-$i33['e_show_anons']) / $med);
                if ($ism>90)
                    notifikation($i,'Снижение показа виджета Native Preview на '.$ism.'%', $mySQLdatelast, 'Preview');
            }
        }
        if ($i22['s_show_anons']>150){
            $med=$i22['s_show_anons']/7;
            if ($med>$i33['s_show_anons']){
                $ism=round(100 * ($med-$i33['r_show_anons']) / $med);
                if ($ism>90)
                    notifikation($i,'Снижение показа виджета Slider на '.$ism.'%', $mySQLdatelast, 'Slider');
            }
        }
        if ($i22['promo_load']>80){
            $med=$i22['promo_load']/7;
            if ($med>$i33['promo_load']){
                $ism=round(100 * ($med-$i33['promo_load']) / $med);
                if ($ism>90)
                    notifikation($i,'Снижение показа промо статей на '.$ism.'%', $mySQLdatelast, 'промо');
            }
        }
    }else{
        if (isset($i22) and ($i22['promo_load']>10))
            notifikation($i,'Площадка упала', $mySQLdatelast, 'упала');
    }
}