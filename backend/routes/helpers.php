<?php
function tuneColorfulness(int $colorfulness, int $delta) {
    $newColorfulness = $colorfulness + $delta;
    if ($newColorfulness >= 1000) {
        return 900;
    }
    return $newColorfulness < 100 ? 0 : $newColorfulness;
}