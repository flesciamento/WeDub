<?php
/** Converti Minutaggio **
 * Converte i secondi nel formato hh:mm:ss
 * @param number $Tempo: I secondi da convertire
 */
function ConvertiMinutaggio($Tempo) {
    $ore = floor($Tempo / 3600);
    $min = floor($Tempo / 60 % 60);
    $sec = floor($Tempo % 60);
    
    return sprintf('%02d:%02d:%02d', $ore, $min, $sec);
}

?>