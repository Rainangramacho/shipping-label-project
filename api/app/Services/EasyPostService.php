<?php

namespace App\Services;

use App\Dtos\EasyPost\EasyPostShipmentCreateDTO;
use EasyPost\EasyPostClient;
use EasyPost\Shipment;

class EasyPostService
{
    /** USPS carrier name as returned by EasyPost rates. */
    public const CARRIER_USPS = 'USPS';

    protected EasyPostClient $client;

    public function __construct()
    {
        $this->client = new EasyPostClient(env('EASYPOST_API_KEY'));
    }

    public function createShipment(array $data): Shipment
    {
        $dto = new EasyPostShipmentCreateDTO(
            to_address: $data['to_address'],
            from_address: $data['from_address'],
            parcel: [
                'length' => $data['length'],
                'width' => $data['width'],
                'height' => $data['height'],
                'weight' => $data['weight'],
            ],
        );

        $shipment = $this->client->shipment->create($dto->toArray());

        // Lowest rate among USPS options only.
        $rate = $shipment->lowestRate([self::CARRIER_USPS]);

        return $this->client->shipment->buy(
            $shipment->id,
            ['rate' => $rate]
        );
    }
}