<?php
	header('Content-Type:text/plain');
    $db=['18605608561','18555339750','15556409938'];
    $num=$_REQUEST['number'];
    $exists=false;
    for($i=0;$i<count($db);$i++){
        if($num===$db[$i]){
            $exists=true;
            break;
        }
    }
    if($exists){
        echo '1';
    }else{
        echo '0';
    }
?>