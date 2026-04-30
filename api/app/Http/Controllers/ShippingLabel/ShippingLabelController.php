<?php

namespace App\Http\Controllers\ShippingLabel;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingLabelCreateRequest;
use App\Repositories\ShippingLabelRepository;
use App\Services\EasyPostService;
use App\Services\ShippingLabelService;
use EasyPost\Exception\General\FilteringException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ShippingLabelController extends Controller
{
    public function __construct(
        protected EasyPostService $easyPostService,
        protected ShippingLabelService $shippingLabelService,
        protected ShippingLabelRepository $shippingLabelRepository,
    ) {}

    /**
     * List the authenticated user's labels
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $userId = Auth::user()->id;
        $labels = $this->shippingLabelRepository->listLabelsByUserId($userId);

        return response()->json($labels);
    }

    /**
     * Create new shipping label
     * @param ShippingLabelCreateRequest $request
     * @return JsonResponse
     * @throws FilteringException
     * @throws \Throwable
     */
    public function store(ShippingLabelCreateRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $label = DB::transaction(function () use ($data) {

                $label = $this->shippingLabelService->create($data);

                $shipment = $this->easyPostService->createShipment($data);

                $label->update([
                    'tracking_code' => $shipment->tracking_code,
                    'label_url' => $shipment->postage_label->label_url,
                    'easypost_id' => $shipment->id,
                ]);

                return $label;
            });

            return response()->json($label, 201);

        } catch (FilteringException $e) {

            return response()->json([
                'message' => 'No USPS shipping rates are available for this shipment. Try adjusting package size, weight, or addresses.',
            ], 422);

        } catch (\Throwable $e) {

            report($e);

            return response()->json([
                'message' => 'Unexpected error while creating shipping label.',
            ], 500);
        }
    }

    /**
     * Get a specific label (of the authenticated user)
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function show(Request $request, $id): JsonResponse
    {
        $label = $request->user()
            ->shippingLabels()
            ->findOrFail($id);

        return response()->json($label);
    }
}
