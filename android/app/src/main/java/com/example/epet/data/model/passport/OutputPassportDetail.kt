package com.example.epet.data.model.passport

data class OutputPassportDetail(
    val passport_number: String = "-",
    val img_url: String = "-",

    val pet_name: String = "-",
    val pet_name_latin: String = "-",
    val date_of_birth: String = "-",

    val breed_ua: String = "-",
    val breed_en: String = "-",

    val gender_ua: String = "-",
    val gender_en: String = "-",

    val color_ua: String = "-",
    val color_en: String = "-",

    val species_ua: String = "-",
    val species_en: String = "-",

    val identifier_type_ua: String = "-",
    val identifier_type_en: String = "-",

    val owner_passport_number: String = "-",
    val organization_id: String = "-",
    val identifier_number: String = "-",
    val identifier_date: String = "-",

    val update_datetime: String = "-"
)
