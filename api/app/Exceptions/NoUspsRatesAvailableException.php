<?php

namespace App\Exceptions;

use Exception;
use Throwable;

/**
 * Thrown when EasyPost returns no USPS rates for the given shipment inputs.
 */
class NoUspsRatesAvailableException extends Exception
{
    public function __construct(?Throwable $previous = null)
    {
        parent::__construct(
            'No USPS shipping rates are available for this shipment. Try adjusting package size, weight, or addresses.',
            0,
            $previous
        );
    }
}
