<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    // fillable fields
    protected $fillable = [
        'name',
    ];

    public $timestamps = false;
    
    public function users()
    {
        return $this->hasMany('App\User');
    }
}
