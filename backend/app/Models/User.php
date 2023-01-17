<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public $timestamps = false;
    
    public function country() {
        return $this->belongsTo(Country::class);
    }
}
