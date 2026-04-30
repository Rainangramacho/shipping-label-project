<?php

namespace App\Dtos\ShippingLabels;

class ShippingLabelCreateDTO
{
    public function __construct(
        public int $user_id,
        public array $to_address,
        public array $from_address,
        public float $weight,
        public float $length,
        public float $width,
        public float $height,
    ) {}

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'to_address' => $this->to_address,
            'from_address' => $this->from_address,
            'weight' => $this->weight,
            'length' => $this->length,
            'width' => $this->width,
            'height' => $this->height,
        ];
    }
}