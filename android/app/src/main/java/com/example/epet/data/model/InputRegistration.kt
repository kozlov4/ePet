package com.example.epet.data.model

data class InputRegistration (
    val surname: String,
    val name: String,
    val patronymic: String,
    val passportNumber: String,
    val address: String,
    val postalCode: String,
    val email: String,
    val password: String
)