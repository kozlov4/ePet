package com.example.epet.data.model.settings

data class OutputUserDetail(
    val last_name: String = "-",
    val first_name: String = "-",
    val patronymic: String = "-",
    val passport_number: String = "-",
    val full_address: String = "-",
    val postal_index: String = "-",
    val email: String = "-",
    var password: String? = "-"
)