<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dishes\DishesRequest;
use App\Http\Requests\Main\StoryRequest;
use App\Http\Requests\SimpleRequest;
use App\Http\Transformers\CategoryTransformer;
use App\Http\Transformers\MainInterestingTransformer;
use App\Http\Transformers\StoryCompilationTransformer;
use App\Kitchen\UseCases\Dishes\GetDishesUseCase;
use App\Kitchen\UseCases\Main\GetStoriesUseCase;
use App\Kitchen\UseCases\Main\GetInterestingsUseCase;
use App\Kitchen\UseCases\Main\GetStoryUseCase;


/**
 *
 */
class MainController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/{version}/",
     *     summary="Получить информацию для главной страницы",
     *     tags={"Main"},
     *     @OA\Parameter(
     *         name="version",
     *         in="path",
     *         description="версия, v2 - вторая версия",
     *         required=true,
     *         example="v2",
     *     	   @OA\Schema(type="string", enum={"v2"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation",
     *         @OA\JsonContent(ref="./ApiMainControllerIndex.json"),
     *     ),
     * )
     */
    public function index(SimpleRequest $request)
    {
        $stories = app(GetStoriesUseCase::class)->execute();
        $request->request->add(['categoryId' => 0]);
        $request->request->add(['asEntity' => true]);
        $categories = app(GetDishesUseCase::class)->execute($request);
        $interestings = app(GetInterestingsUseCase::class)->execute();
        $listId = app(GetInterestingsUseCase::class)->getListDishesId($interestings);
        $dishesRequest = new DishesRequest();
        $dishesRequest->request->add(['listId' => $listId]);
        $dishesRequest->request->add(['asEntity' => true]);
        $dishes = app(GetDishesUseCase::class)->execute($dishesRequest);
        $interestingsWithDishes = app(GetInterestingsUseCase::class)->mergeDishesIntoInteresting(
            $interestings,
            $dishes
        );

        $response = [
            'stories'      => $stories,
            'categories'   => $this->transform($categories, CategoryTransformer::class),
            'interestings' => $this->transform($interestingsWithDishes, MainInterestingTransformer::class),
        ];
        return $response;
    }

    /**
     * @OA\Get(
     *     path="/api/{version}/story/{id}",
     *     summary="Получить историю",
     *     tags={"Main"},
     *     @OA\Parameter(
     *         name="version",
     *         in="path",
     *         description="версия, v2 - вторая версия",
     *         required=true,
     *         example="v2",
     *     	   @OA\Schema(type="string", enum={"v2"})
     *     ),
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="идентификатор истории",
     *         required=true,
     *         example="1",
     *     	   @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation",
     *         @OA\JsonContent(ref="./ApiMainControllerStory.json"),
     *     ),
     * )
     */
    public function story(StoryRequest $request)
    {
        $story = app(GetStoryUseCase::class)->execute($request);
        return $story;
    }

    /**
     * @OA\Get(
     *     path="/api/{version}/interestings",
     *     summary="Получить подборки для главной страницы",
     *     tags={"Main"},
     *     @OA\Parameter(
     *         name="version",
     *         in="path",
     *         description="версия, v2 - вторая версия",
     *         required=true,
     *         example="v2",
     *     	   @OA\Schema(type="string", enum={"v2"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation",
     *         @OA\JsonContent(ref="./ApiMainControllerInterestings.json"),
     *     ),
     * )
     */
    public function interestings()
    {
        $interestings = app(GetInterestingsUseCase::class)->execute();
        $listId = app(GetInterestingsUseCase::class)->getListDishesId($interestings);
        $dishesRequest = new DishesRequest();
        $dishesRequest->request->add(['listId' => $listId]);
        $dishesRequest->request->add(['asEntity' => true]);
        $dishes = app(GetDishesUseCase::class)->execute($dishesRequest);
        $interestingsWithDishes = app(GetInterestingsUseCase::class)->mergeDishesIntoInteresting(
            $interestings,
            $dishes
        );

        return $this->transform($interestingsWithDishes, MainInterestingTransformer::class);
    }

    /**
     * @OA\Get(
     *     path="/api/{version}/stories",
     *     summary="Получить истории",
     *     tags={"Main"},
     *     @OA\Parameter(
     *         name="version",
     *         in="path",
     *         description="версия, v2 - вторая версия",
     *         required=true,
     *         example="v2",
     *     	   @OA\Schema(type="string", enum={"v2"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation",
     *         @OA\JsonContent(ref="./ApiMainControllerStories.json"),
     *     ),
     * )
     */
    public function stories()
    {
        $listStories = app(GetStoriesUseCase::class)->execute();

        return $this->transform($listStories, StoryCompilationTransformer::class);
    }
}
