<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    // wrap as "users"
    public static $wrap = 'users';

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }

    // paginationInformation override
    public function paginationInformation()
    {
        $totalPages = $this->resource->lastPage();
        return [
            'totalPages' => (0 < $this->resource->total()) ? $totalPages : 0,
        ];
    }

    // load the country relation in constructor to avoid N+1 problem
    public function __construct($resource)
    {
        $resource->loadMissing('country');
        parent::__construct($resource);
    }
}
