package com.example.epet.data.model.service

data class OutputPetShelter(
    val pet_id: Int,
    val img_url: String,
    val pet_name: String,
    val gender: String,
    val breed: String,
    val date_of_birth: String
)