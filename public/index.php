<?php
// Hostinger Web Entry Point für Lara's Tagebuch
if (file_exists(__DIR__ . '/index.html')) {
    include_once(__DIR__ . '/index.html');
} else {
    echo "Lara's Tagebuch: index.html wurde nicht gefunden.";
}
?>
