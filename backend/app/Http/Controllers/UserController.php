<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/*
ChatGPT:
Here is a list of methods that the UserController class should have:

index():  This method should handle the GET /users?dateFrom=&dateTo=&country=&page=&perPage= endpoint, it should be responsible for fetching all the records from the "users" table that match the provided country and date_of_birth range and returning them to the client.
Copilot: All parameters should be optional, if the client doesn't provide a country or date_of_birth range, the method should return all the users from the database.

show(): This method should handle the GET /users/{id} endpoint, it should be responsible for fetching a specific user from the "users" table and returning it to the client.

update(): This method should handle the PATCH /users/{id} endpoint, it should be responsible for handling the form submission, updating a specific user in the database.

destroy(): This method should handle the DELETE /users/{id} endpoint, it should be responsible for deleting a specific user from the "users" table.
*/

class UserController extends Controller
{
    // GET /users?dateFrom=&dateTo=&country=&page=&perPage= - This endpoint is used to retrieve a list of all users from the database.
    // dateFrom: nullable, unix timestamp, if provided, the users should be filtered by the date_of_birth field to only include users that were born after or on the provided date.
    // dateTo: nullable, unix timestamp, if provided, the users should be filtered by the date_of_birth field to only include users that were born before or on the provided date.
    // Laraver can't validate the dateFrom and dateTo parameters, so we have to do it manually by regexp
    public function index(Request $request)
    {
        // Validate the request
        $request->validate([
            'country' => 'exists:countries,id',
            'dateFrom' => 'regex:/^\d+$/|nullable',
            'dateTo' => 'regex:/^\d+$/|nullable',
            'page' => 'integer|min:1',
            'perPage' => 'integer|min:1',
        ]);
        // assert that the all the parameters names are valid
        $validParams = ['country', 'dateFrom', 'dateTo', 'page', 'perPage'];
        $invalidParams = array_diff(array_keys($request->all()), $validParams);
        if (count($invalidParams) > 0) {
            return response()->json([
                'message' => 'Invalid parameters: ' . implode(', ', $invalidParams),
            ], 400);
        }

        // Filter the users based on the provided country and date_of_birth range
        $usersQuery = \App\Models\User::query()
            ->withCountryName()
            ->dateRange($request->input('dateFrom'), $request->input('dateTo'))
            ->country($request->input('country'));

        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        $paginated = $usersQuery->paginate($perPage, ['*'], 'page', $page);
        // Return the users as a JSON
        return response()->json([
            'users' => $paginated->items(),
            'totalPages' => (0 < $paginated->total()) ? $paginated->lastPage() : 0,
        ], 200);
    }

    // GET /users/{id} - This endpoint is used to retrieve a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to retrieve.
    public function show($id)
    {
        // Get the user from the database
        $user = \App\Models\User::find($id);
        // If the user doesn't exist, return a 404 response
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
        // Return the user as a JSON
        return response()->json($user, 200);
    }

    // PATCH /users/{id} - This endpoint is used to update a specific user in the database via a country. The {id} path parameter should be replaced with the id of the user you want to update and the client should send the updated information in the request body.
    public function update(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date',
            'country_id' => 'required|exists:countries,id',
        ]);
        // Get the user from the database
        $user = \App\Models\User::find($id);
        // If the user doesn't exist, return a 404 response
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
        // Update the user
        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->date_of_birth = $request->input('date_of_birth');
        $user->country_id = $request->input('country_id');
        $user->save();
        // Return the user as a JSON
        return response()->json($user, 200);
    }

    // DELETE /users/{id} - This endpoint is used to delete a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to delete.
    public function destroy($id)
    {
        // Get the user from the database
        $user = \App\Models\User::find($id);
        // If the user doesn't exist, return a 404 response
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
        // Delete the user
        $user->delete();
        // Return a 204 response
        return response()->json(null, 204);
    }

    // POST /users - This endpoint is used to create a new user in the database. The client should send the user information in the request body.
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date',
            'country_id' => 'required|exists:countries,id',
        ]);
        // Create the user
        $user = \App\Models\User::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'date_of_birth' => $request->input('date_of_birth'),
            'country_id' => $request->input('country_id'),
        ]);
        $user->save();
        // Return the user as a JSON
        return response()->json($user, 201);
    }
}
