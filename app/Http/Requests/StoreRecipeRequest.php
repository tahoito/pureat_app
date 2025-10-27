<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SimpleNoNoTerms;

class StoreRecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {

        $rule = new SimpleNoNoTerms();
        return [
            'title' => ['required', 'string', 'max:255', $rule],
            'ingredients' => ['required', 'string',$rule],
            'ingredients.*' => ['required', 'string', $rule],
            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['array'],
            'tags.*' => ['exists:tags,id'],
            'steps' => ['required', 'array'],
            'steps.*' => ['required', 'string', $rule],
        ];
    }
}