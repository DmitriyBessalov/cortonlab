<?php
$_POST = array_map('addslashes', $_POST);

if(!empty($_POST['email'] )) {
    $to = "info@cortonlab.com";
    $subject = "Corton лендинг форма";
    $message = '
         <h3>Получен запрос на добавление '.$_POST['type'].'</h3></br>
         <b>Еmail: </b>'.$_POST['email'].'</br>
         <b>IP: </b>'.$_SERVER['REMOTE_ADDR'].'</br>';
    $headers  = "Content-type: text/html; charset=UTF-8 \r\nFrom: <info@cortonlab.com>\r\n";
    $result = mail($to, $subject, $message, $headers);
    echo "<p class=\"textred\">Запрос отправлен</p>";
}else{
    echo "<p class=\"textred\">Email не введён</p>";
}