<?php

namespace App\UseCases;

use App\DTO\InputSaveFileDto;
use App\DTO\OutputSaveFileDto;
use App\Entities\TeacherDoc;
use App\Exceptions\AccessDeniedException;
use App\Exceptions\CreateResourceFailedException;
use App\Services\S3FileService;
use App\UseCases\Interfaces\IUserRepository;
use Exception;

class SaveTeacherFileUseCase
{
    private S3FileService $s3FileService;
    private IUserRepository $userRepository;

    public function __construct(S3FileService $s3FileService, IUserRepository $userRepository)
    {
        $this->s3FileService = $s3FileService;
        $this->userRepository = $userRepository;
    }

    /**
     * @throws CreateResourceFailedException
     * @throws AccessDeniedException
     */
    public function execute(InputSaveFileDto $dto): OutputSaveFileDto
    {
        $doc = new TeacherDoc(['user_id' => $dto->user_id]);
        if (!$doc->allowCreate($dto->author)) {
            throw new AccessDeniedException();
        }

        try {
            $link = $this->s3FileService->save($dto->file, 'teacher/doc');
            $file  = $this->userRepository->saveFile($dto, $link);
        } catch (Exception $e) {
            throw new CreateResourceFailedException($e->getMessage());
        }

        return new OutputSaveFileDto($file->toArray());
    }
}
