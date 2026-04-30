<?php

namespace App\Dtos\EasyPost;

class EasyPostShipmentCreateDTO
{
    public function __construct(
        public array $to_address,
        public array $from_address,
        public array $parcel,
    ) {}

    public function toArray(): array
    {
        return [
            'to_address' => $this->to_address,
            'from_address' => $this->from_address,
            'parcel' => $this->parcel,
        ];
    }
}