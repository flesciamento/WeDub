<?php
    function DoppiatoreOnline($DataUltimaAzione) {
        return (($DataUltimaAzione > strtotime("20 minutes ago")) ? "&nbsp;<span class='fa fa-circle' style='color: green; cursor: default;' title='utente on-line'></span>" : "");
    }
?>