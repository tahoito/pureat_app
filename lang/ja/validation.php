<?php

return [
    'required' => ':attributeを入力してください。',
    'string'   => ':attributeは文字列を入力してください。',
    'max'      => [
        'numeric' => ':attributeは:max以下で入力してください。',
        'file'    => ':attributeは:maxキロバイト以下のファイルを選択してください。',
        'string'  => ':attributeは:max文字以内で入力してください。',
        'array'   => ':attributeは:max個以内で指定してください。',
    ],
    'min'      => [
        'numeric' => ':attributeは:min以上で入力してください。',
        'file'    => ':attributeは:minキロバイト以上のファイルを選択してください。',
        'string'  => ':attributeは:min文字以上で入力してください。',
        'array'   => ':attributeは:min個以上で指定してください。',
    ],
    'image'    => ':attributeは画像ファイルを選択してください。',
    'boolean'  => ':attributeは真偽値で指定してください。',
    'integer'  => ':attributeは整数で入力してください。',
    'nullable' => ':attributeは省略可能です。',

    'attributes' => [
        'name'             => '名前',
        'brand'            => 'ブランド',
        'genre'           => 'ジャンル',
        'price'           => '価格',
        'image'           => '画像',
        'gf'              => 'グルテンフリー',
        'df'              => '乳製品フリー',
        'sf'              => '大豆フリー',
        'af'              => 'アルコールフリー',
        'ingredients_text' => '成分',
        'description'     => '説明',
        'is_published'    => '公開状態',
    ],
];