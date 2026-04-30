<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShippingLabelCreateRequest extends FormRequest
{
    /**
     * Shared rules for domestic US addresses (EasyPost-compatible fields).
     *
     * @return array<string, mixed>
     */
    protected function usAddressRules(string $prefix): array
    {
        return [
            "{$prefix}.name" => ['required', 'string', 'max:255'],
            "{$prefix}.street1" => ['required', 'string', 'max:255'],
            "{$prefix}.city" => ['required', 'string', 'max:255'],
            "{$prefix}.state" => ['required', 'string', 'size:2', 'regex:/^[A-Za-z]{2}$/'],
            "{$prefix}.zip" => ['required', 'string', 'regex:/^\d{5}(-\d{4})?$/'],
            "{$prefix}.country" => ['required', 'string', Rule::in(['US', 'USA'])],
        ];
    }

    public function rules(): array
    {
        return array_merge(
            $this->usAddressRules('to_address'),
            $this->usAddressRules('from_address'),
            [
                'to_address' => 'required|array',
                'from_address' => 'required|array',
                'weight' => 'required|numeric|min:0.01',
                'width' => 'required|numeric|min:0.01',
                'height' => 'required|numeric|min:0.01',
                'length' => 'required|numeric|min:0.01',
            ]
        );
    }

    protected function prepareForValidation(): void
    {
        foreach (['to_address', 'from_address'] as $field) {
            $addr = $this->input($field);
            if (! is_array($addr)) {
                continue;
            }
            if (isset($addr['country'])) {
                $c = strtoupper(trim((string) $addr['country']));
                if (in_array($c, ['US', 'USA'], true)) {
                    $addr['country'] = 'US';
                }
            }
            if (isset($addr['state'])) {
                $addr['state'] = strtoupper((string) $addr['state']);
            }
            $this->merge([$field => $addr]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}