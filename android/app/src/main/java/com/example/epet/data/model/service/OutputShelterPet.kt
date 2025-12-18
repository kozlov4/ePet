package com.example.epet.data.model.service

data class OutputShelterPet(
    val pet_id: Int,
    val img_url: String,
    val pet_name: String,
    val gender: String,
    val breed: String,
    val date_of_birth: String
)