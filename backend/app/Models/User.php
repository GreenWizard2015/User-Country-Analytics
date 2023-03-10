<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class User extends Model
{
    use HasFactory;

    // fillable fields
    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'country_id',
    ];

    // cast fields
    protected $casts = [
        'date_of_birth' => 'datetime',
    ];

    public $timestamps = false;

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function scopeDateRange(Builder $query, $dateFrom = null, $dateTo = null)
    {
        if ($dateFrom && $dateTo) {
            return $query->whereBetween('date_of_birth', [date('Y-m-d', $dateFrom), date('Y-m-d', $dateTo)]);
        }

        if ($dateFrom) {
            return $query->where('date_of_birth', '>=', date('Y-m-d', $dateFrom));
        }

        if ($dateTo) {
            return $query->where('date_of_birth', '<=', date('Y-m-d', $dateTo));
        }

        return $query;
    }

    public function scopeCountry(Builder $query, $countryName = null)
    {
        if ($countryName) {
            $country = Country::where('name', $countryName)->first();
            return $query->where('country_id', $country->id);
        }

        return $query;
    }
}
