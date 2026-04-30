<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShippingLabel extends Model
{
    use HasFactory;

    protected $table = 'shipping_labels';

    protected $fillable = [
        'user_id',
        'to_address',
        'from_address',
        'weight',
        'width',
        'height',
        'length',
        'label_url',
        'tracking_code',
        'easypost_id'
    ];

    protected $casts = [
        'to_address' => 'array',
        'from_address' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}