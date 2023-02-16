<?php

namespace App\Rules;

use App\Imports\Sheet;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class StudentAlreadyExist implements DataAwareRule, Rule
{
    private int $schoolId;
    private Sheet $sheet;
    /**
     * All of the data under validation.
     *
     * @var array
     */
    protected array $data = [];

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(int $schoolId, Sheet $sheet)
    {
        $this->schoolId = $schoolId;
        $this->sheet = $sheet;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     * @throws \Exception
     */
    public function passes($attribute, $value): bool
    {
        foreach ($this->data as $row) {
            if (!is_numeric($row[$this->sheet->getKey('birthDate')])) {
                throw  new Exception('Значение даты рождения некорректно. Строка: ' . intval($attribute - 1));
            }
            $birthDate = Date::excelToDateTimeObject($row[$this->sheet->getKey('birthDate')])->format('Y-m-d');
            $query = User::query()
                ->whereRaw("UPPER(last_name) = '" . mb_strtoupper($row[$this->sheet->getKey('lastNameStudent')]) . "'")
                ->whereRaw("UPPER(first_name) = '" . mb_strtoupper($row[$this->sheet->getKey('firstNameStudent')]) . "'")
                ->where('school_id', $this->schoolId)
                ->where('role', 'student')
                ->where('birth_date', $birthDate);
            if (!empty($row[$this->sheet->getKey('middleNameStudent')])) {
                $query->whereRaw("UPPER(middle_name) = '" . mb_strtoupper($row[$this->sheet->getKey('middleNameStudent')]) . "'");
            }
            /** @var $user User|null */
            $user = $query->first();

            return !isset($user);
        }

        return true;
    }


    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'Студент уже существует.';
    }

    public function setData($data)
    {
        $this->data = $data;
    }
}
