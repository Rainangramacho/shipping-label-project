<?php

namespace App\Http\Controllers\ShippingLabel;

use App\Actions\CreateShippingLabelAction;
use App\Exceptions\NoUspsRatesAvailableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingLabelCreateRequest;
use App\Repositories\ShippingLabelRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShippingLabelController extends Controller
{
    public function __construct(
        protected CreateShippingLabelAction $createShippingLabelAction,
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
     * Create new shipping label.
     */
    public function store(ShippingLabelCreateRequest $request): JsonResponse
    {
        try {
            $label = $this->createShippingLabelAction->execute(
                $request->user(),
                $request->validated()
            );

            return response()->json($label, 201);
        } catch (NoUspsRatesAvailableException $e) {
            return response()->json([
                'message' => $e->getMessage(),
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
