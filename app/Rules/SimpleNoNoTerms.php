<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SimpleNoNoTerms implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $text = is_array($value) ? implode("\n", $value) : (string) $value;
        $text = mb_strtolower(mb_convert_kana($text, 'KV', 'UTF-8')); // ゆる正規化

        // whitelist を先に抜く（「無添加」「砂糖不使用」など）
        foreach (config('forbidden.whitelist', []) as $ok) {
            $text = str_replace(
                mb_strtolower(mb_convert_kana($ok, 'KV', 'UTF-8')),
                '',
                $text
            );
        }

        $hits = [];
        foreach (config('forbidden.keywords', []) as $kw) {
            $kwN = mb_strtolower(mb_convert_kana($kw, 'KV', 'UTF-8'));
            if (mb_strpos($text, $kwN) !== false) {
                $hits[] = $kw;
            }
        }

        if ($hits) {
            $fail('禁止ワードが含まれてるよ: '.implode('、', array_unique($hits)));
        }
    }
}
