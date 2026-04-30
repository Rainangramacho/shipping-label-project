<?php

namespace App\Actions;

use App\Exceptions\NoUspsRatesAvailableException;
use App\Models\ShippingLabel;
use App\Models\User;
use App\Services\EasyPostService;
use App\Services\ShippingLabelService;
use EasyPost\Exception\General\FilteringException;
use Illuminate\Support\Facades\DB;

/**
 * Creates a persisted shipping label row, purchases a USPS label via EasyPost,
 * and stores tracking metadata on the model inside a single database transaction.
 */
class CreateShippingLabelAction
{
    public function __construct(
        protected ShippingLabelService $shippingLabelService,
        protected EasyPostService $easyPostService,
    ) {}

    /**
     * @param User $user
     * @param array $data
     * @return ShippingLabel
     * @throws NoUspsRatesAvailableException
     * @throws \Throwable
     */
    public function execute(User $user, array $data): ShippingLabel
    {
        return DB::transaction(function () use ($user, $data) {
            $label = $this->shippingLabelService->create($user, $data);

            try {
                $shipment = $this->easyPostService->createShipment($data);
            } catch (FilteringException $e) {
                throw new NoUspsRatesAvailableException($e);
            }

            $label->update([
                'tracking_code' => $shipment->tracking_code,
                'label_url' => $shipment->postage_label->label_url,
                'easypost_id' => $shipment->id,
            ]);

            return $label->fresh();
        });
    }
}
