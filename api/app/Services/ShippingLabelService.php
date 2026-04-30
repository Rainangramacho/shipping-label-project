<?php

namespace App\Services;

use App\Dtos\ShippingLabels\ShippingLabelCreateDTO;
use App\Models\ShippingLabel;
use App\Models\User;
use App\Repositories\ShippingLabelRepository;

class ShippingLabelService
{
    public function __construct(
        protected ShippingLabelRepository $repository
    ) {}

    /**
     * @param User $user
     * @param array $data
     * @return ShippingLabel
     * @throws \Throwable
     */
    public function create(User $user, array $data): ShippingLabel
    {
        return $this->repository->create(
            new ShippingLabelCreateDTO(
                user_id: $user->id,
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