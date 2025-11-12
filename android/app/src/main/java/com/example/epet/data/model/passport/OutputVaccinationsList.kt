package com.example.epet.data.model.passport

data class OutputVaccinationsList(
    val passport_number: String = "-",
    val update_datetime: String = "-",
    val vaccinations: List<OutputVaccinationItem> = emptyList<OutputVaccinationItem>()
)