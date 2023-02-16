<?php

namespace portal\repositories\pgsql;

use Exception;
use portal\base\exceptions\DatabaseException;
use portal\base\exceptions\NotFoundException;
use portal\base\repositories\Repository;
use portal\domain\dto\ParamsPortalServiceSettingDto;
use portal\domain\entities\PortalServiceSettingCollection;
use portal\domain\useCases\PortalServiceSettingRepositoryInterface;

class PortalServiceSettingRepository extends Repository implements PortalServiceSettingRepositoryInterface {

    /**
     * Получить настройки портала и МП
     * @param ParamsPortalServiceSettingDto $dto
     * @return array|false
     * @throws NotFoundException
     */
    public function get(ParamsPortalServiceSettingDto $dto): PortalServiceSettingCollection
    {
        $filters = "";
        $params = [];
        $portalServiceSettingFilters = "";

        if (!empty($dto->PortalSectionType_id)) {
            $portalServiceSettingFilters .= " AND PSS.PortalSectionType_id = :PortalSectionType_id ";
            $params['PortalSectionType_id'] = $dto->PortalSectionType_id;
        }

        if (!empty($dto->PortalSectionType_id) && (int)$dto->PortalSectionType_id === 1) {
            $filters .= " AND UCMS.UslugaComplexMedService_IsPay = 2
                          AND UCT.UslugaComplexTariff_id is not null
                          AND PT.PayType_SysNick = 'money' ";
        }

        if (!empty($dto->LpuAttach_id)) {
            $filters .= " AND (
                (PSS2.\"PortalServiceFilter_IsAttach\" = 2 AND MS.Lpu_id = :LpuAttach_id)
                OR COALESCE(PSS2.\"PortalServiceFilter_IsAttach\", 1) = 1
                ) ";
            $params['LpuAttach_id'] = $dto->LpuAttach_id;
        } else {
            $filters .= " AND COALESCE(PSS2.\"PortalServiceFilter_IsAttach\", 1) = 1 ";
        }

        if (!empty($dto->MedServiceType_id)) {
            $filters .= " AND MST.MedServiceType_id = :MedServiceType_id";
            $params['MedServiceType_id'] = $dto->MedServiceType_id;
        }

        if (!empty($dto->UslugaComplex_id)) {
            $filters .= " AND UCMS.UslugaComplex_id in ({$dto->UslugaComplex_id})";
        }

        $query = /** @lang PostgreSQL */
            "
            WITH CTE as (select dbo.tzGetDate() as curdate),
            PSS as (
                SELECT PSS.PortalServiceSetting_id as \"PortalServiceSetting_id\",
                   PSS.PortalServiceSetting_Name as \"PortalServiceSetting_Name\",
                   PSS.PortalServiceSetting_Descr as \"PortalServiceSetting_Descr\",
                   PSS.PortalServiceSetting_DescrShort as \"PortalServiceSetting_DescrShort\",
                   PSF.MedServiceType_id as \"MedServiceType_id\",
                   PSF.UslugaComplexAttributeType_id as \"UslugaComplexAttributeType_id\",
                   PSF.UslugaComplexAttribute_Value as \"UslugaComplexAttribute_Value\",
                   PSF.PortalServiceFilter_IsAttach as \"PortalServiceFilter_IsAttach\",
             PSS.PortalServiceSetting_AllowedDaysCount as \"PortalServiceSetting_AllowedDaysCount\"
            FROM v_PortalServiceSetting PSS
            LEFT JOIN v_PortalServiceFilter PSF ON PSF.PortalServiceSetting_id = PSS.PortalServiceSetting_id
            WHERE PSS.PortalServiceSetting_IsVisible = 2
                {$portalServiceSettingFilters}
            )

            SELECT DISTINCT
                   STRING_AGG(cast(UCMS.UslugaComplex_id as varchar), ',') as \"UslugaComplex_ids\",
                   PSS2.\"PortalServiceSetting_id\" as \"PortalServiceSetting_id\",
                   PSS2.\"PortalServiceSetting_Name\" as \"PortalServiceSetting_Name\",
                   PSS2.\"PortalServiceSetting_Descr\" as \"PortalServiceSetting_Descr\",
                   PSS2.\"PortalServiceSetting_DescrShort\" as \"PortalServiceSetting_DescrShort\",
                   MST.MedServiceType_SysNick as \"MedServiceType_SysNick\",
                   UCAT.UslugaComplexAttributeType_SysNick as \"UslugaComplexAttributeType_SysNick\",
                   PSS2.\"UslugaComplexAttribute_Value\" as \"UslugaComplexAttribute_Value\",
                   PSS2.\"PortalServiceFilter_IsAttach\" as \"PortalServiceFilter_IsAttach\",
                   UCMS.UslugaComplexMedService_IsPay as \"UslugaComplexMedService_IsPay\",
                   PSS2.\"PortalServiceSetting_AllowedDaysCount\" as \"PortalServiceSetting_AllowedDaysCount\"
            FROM v_UslugaComplexMedService UCMS
            LEFT JOIN v_MedService MS ON MS.MedService_id = UCMS.MedService_id
            LEFT JOIN v_Lpu LPU ON MS.Lpu_id = LPU.Lpu_id
            INNER JOIN LATERAL (
                SELECT
                   PSS2.\"PortalServiceSetting_id\" as \"PortalServiceSetting_id\",
                   PSS2.\"PortalServiceSetting_Name\" as \"PortalServiceSetting_Name\",
                   PSS2.\"PortalServiceSetting_Descr\" as \"PortalServiceSetting_Descr\",
                   PSS2.\"MedServiceType_id\" as \"MedServiceType_id\",
                   PSS2.\"PortalServiceSetting_DescrShort\" as \"PortalServiceSetting_DescrShort\",
                   PSS2.\"PortalServiceFilter_IsAttach\" as \"PortalServiceFilter_IsAttach\",
                   PSS2.\"UslugaComplexAttributeType_id\" as \"UslugaComplexAttributeType_id\",
                   PSS2.\"PortalServiceSetting_AllowedDaysCount\" as \"PortalServiceSetting_AllowedDaysCount\",
                   PSS2.\"UslugaComplexAttribute_Value\" as \"UslugaComplexAttribute_Value\"
                FROM PSS PSS2
                WHERE EXISTS (
                    SELECT UCA.UslugaComplexAttribute_id
                    FROM v_UslugaComplexAttribute UCA
                    INNER JOIN v_UslugaComplexAttributeType UCAT ON
                        PSS2.\"UslugaComplexAttributeType_id\" = UCAT.UslugaComplexAttributeType_id

                    WHERE UCA.UslugaComplex_id = UCMS.UslugaComplex_id
                      AND PSS2.\"UslugaComplexAttributeType_id\" = UCA.UslugaComplexAttributeType_id
                      AND (
                          (UCAT.AttributeValueType_id in (1, 4) AND PSS2.\"UslugaComplexAttribute_Value\" = coalesce(cast(UCA.UslugaComplexAttribute_Int as varchar), ''))
                          OR
                          (UCAT.AttributeValueType_id = 2 AND PSS2.\"UslugaComplexAttribute_Value\" = coalesce(cast(UCA.UslugaComplexAttribute_Float as varchar), ''))
                          OR
                          (UCAT.AttributeValueType_id in (6, 8) AND PSS2.\"UslugaComplexAttribute_Value\" = coalesce(cast(UCA.UslugaComplexAttribute_DBTableID as varchar), ''))
                      )
                )
                LIMIT 1
            ) PSS2 on true
            LEFT JOIN v_UslugaComplexAttributeType UCAT ON UCAT.UslugaComplexAttributeType_id = PSS2.\"UslugaComplexAttributeType_id\"
            LEFT JOIN v_MedServiceType MST ON MST.MedServiceType_id = PSS2.\"MedServiceType_id\"
            LEFT JOIN v_UslugaComplexTariff UCT ON UCT.UslugaComplex_id = UCMS.UslugaComplex_id
            LEFT JOIN v_PayType PT on PT.PayType_id = UCT.PayType_id

            WHERE
                UCMS.UslugaComplexMedService_IsPortalRec = 2
                AND (cast(coalesce(UCMS.UslugaComplexMedService_endDT, '2030-01-01') as timestamp) > (SELECT curdate FROM CTE))
                AND (cast(coalesce(MS.MedService_endDT, '2030-01-01') as timestamp) > (SELECT curdate FROM CTE))
                AND coalesce(LPU.Lpu_IsTest, 1) = 1
                {$filters}
            GROUP BY PSS2.\"PortalServiceSetting_id\",
                     PSS2.\"PortalServiceSetting_Name\",
                   PSS2.\"PortalServiceSetting_Descr\",
                   PSS2.\"PortalServiceSetting_DescrShort\",
                   UCAT.UslugaComplexAttributeType_SysNick,
                   MST.MedServiceType_SysNick,
                   PSS2.\"UslugaComplexAttribute_Value\",
                   PSS2.\"PortalServiceFilter_IsAttach\",
                   UCMS.UslugaComplexMedService_IsPay,
                   PSS2.\"PortalServiceSetting_AllowedDaysCount\"
        ";

        try {
            $result = $this->queryResult($query, $params);
        } catch (Exception $e) {
            throw (new DatabaseException())->withErrors([$e->getMessage()]);
        }
        if (empty($result)) {
            throw new NotFoundException();
        }

        $settings = new PortalServiceSettingCollection($result);

        return $settings;
    }
}
