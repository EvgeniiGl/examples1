<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class AccessDeniedException extends Exception
{
    protected $code = Response::HTTP_FORBIDDEN;
    protected $message = 'Доступ запрещен.';
}
