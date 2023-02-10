<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    // no wrap
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $result = parent::toArray($request);

        // date_of_birth as a unix timestamp
        $result['date_of_birth'] = $this->date_of_birth->getTimestamp();
        // country_name
        $result['country_name'] = $this->country->name;
        return $result;
    }
}
