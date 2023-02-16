<?php

namespace App\Kitchen\Dishes\Comments\Entities;

use DateTime;

class Comment
{
    private int $id;
    private string $text;
    private int $pid;
    private User $user;
    private ?User $user_reply;
    private ImageCollection $images;
    private DateTime $created_at;
    private int $likes_count;
    private int $verified;
    private CommentCollection $child_comments;
    private ComplaintCollection $complaints;

    public function __construct(
        $id,
        $text,
        $pid,
        User $user,
        ?User $user_reply,
        ImageCollection $images,
        DateTime $created_at,
        int $likes_count,
        $verified,
    ) {
        $this->id = $id;
        $this->text = $text;
        $this->pid = $pid;
        $this->user = $user;
        $this->user_reply = $user_reply;
        $this->images = $images;
        $this->created_at = $created_at;
        $this->likes_count = $likes_count;
        $this->verified = $verified;
        $this->child_comments = new CommentCollection();
        $this->complaints = new ComplaintCollection();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getPid(): int
    {
        return $this->pid;
    }

    /**
     * @return ImageCollection
     */
    public function getImages(): ImageCollection
    {
        return $this->images;
    }

    /**
     * @return ComplaintCollection
     */
    public function getComplaints(): ComplaintCollection
    {
        return $this->complaints;
    }

    /**
     * @return CommentCollection
     */
    public function getChildComments(): CommentCollection
    {
        return $this->child_comments;
    }

    public function toArray()
    {
        $data = [
            'id'             => $this->id,
            'text'           => $this->text,
            'pid'            => $this->pid,
            'user'           => $this->user->toArray(),
            'user_reply'     => $this->user_reply ? $this->user_reply->toArray() : null,
            'images'         => $this->images->toArray(),
            'created_at'     => $this->created_at,
            'likes_count'    => $this->likes_count,
            'verified'       => $this->verified,
            'child_comments' => $this->child_comments->toArray(),
            'complaints'     => $this->complaints->toArray(),
        ];

        return $data;
    }

    public function addComplaint($value)
    {
        if (isset($value->complaint_id)) {
            $this->getComplaints()->add(
                new Complaint(
                    $value->complaint_id,
                    $value->complaint_text,
                    $value->complaint_reviewed
                )
            );
        }
    }
}
