package com.example.epet.data.model.passport

import com.google.gson.annotations.SerializedName

data class OutputPassportDetail(
    val passport_number: String = "-",
    val img_url: String = "-",

    val pet_name: String = "-",
    val pet_name_en: String = "-",
    val date_of_birth: String = "-",

    val breed: String = "-",
    val breed_en: String = "-",

    val gender: String = "-",
    val gender_en: String = "-",

    val color: String = "-",
    val color_en: String = "-",

    val species: String = "-",
    val species_en: String = "-",

    val identifier_type: String = "-",
    val identifier_type_en: String = "-",

    val owner_passport_number: String = "-",
    val organization_id: String = "-",
    val identifier_number: String = "-",

    @SerializedName("date")
    val identifier_date: String = "-",

    val update_datetime: String = "-"
)