<?php

namespace App\Entities;

use App\Traits\FillProperties;

final class TeacherDoc extends Doc
{
    use FillProperties;

    private ?int $id;
    private string $link;
    private string $name;
    private string $author_id;
    private int $user_id;

    /**
     * @return string
     */
    public function getLink(): string
    {
        return $this->link;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getAuthorId(): string
    {
        return $this->author_id;
    }

    /**
     * @return int
     */
    public function getUserId(): int
    {
        return $this->user_id;
    }

    final public function __construct(array $data)
    {
        $this->fill($data);
    }

    final function allowCreate(User $user): bool
    {
        if ($user instanceof Director || $user instanceof Admin) {
            return true;
        }
        if ($user instanceof Teacher && $user->getId() === $this->user_id) {
            return true;
        }

        return false;
    }

    final public function allowDelete(User $user): bool
    {
        if ($user instanceof Director || $user instanceof Admin) {
            return true;
        }
        if ($user instanceof Teacher && $user->getId() === $this->user_id) {
            return true;
        }

        return false;
    }

    final public function allowView(User $user): bool
    {
        if ($user instanceof Student || $user instanceof ParentStudent) {
            return false;
        }

        return true;
    }
}
