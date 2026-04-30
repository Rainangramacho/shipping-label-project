<?php

namespace App\Repositories;

use App\Dtos\ShippingLabels\ShippingLabelCreateDTO;
use App\Models\ShippingLabel;
use Illuminate\Support\Collection;

class ShippingLabelRepository
{
    public function listLabelsByUserId(int $userId): Collection
    {
        return ShippingLabel::where('user_id', $userId)->get();
    }

    public function create(ShippingLabelCreateDTO $dto): ShippingLabel
    {
        return ShippingLabel::create($dto->toArray());
    }
}