package com.example.epet.data.model.passport

data class OutputPetItem(
    val pet_id: String,
    val update_datetime: String,
    val passport_number: String,
    val pet_name_ua: String,
    val pet_name_en: String,
    val date_of_birth: String
)