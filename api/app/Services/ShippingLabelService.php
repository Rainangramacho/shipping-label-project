<?php

namespace App\Services;

use App\Dtos\ShippingLabels\ShippingLabelCreateDTO;
use App\Repositories\ShippingLabelRepository;
use App\Models\ShippingLabel;
use Illuminate\Support\Facades\Auth;

class ShippingLabelService
{
    public function __construct(
        protected ShippingLabelRepository $repository)
    {
    }

    public function create(array $data): ShippingLabel
    {
        return $this->repository->create(
            new ShippingLabelCreateDTO(
                user_id: Auth::user()->id,
                to_address: $data['to_address'],
                from_address: $data['from_address'],
                weight: $data['weight'],
                length: $data['length'],
                width: $data['width'],
                height: $data['height'],
            )
        );
    }
}