package com.example.epet.data.model.passport

data class OutputVaccinationItem(
    val drug_name: String,
    val series_number: String,
    val vaccination_date: String,
    val valid_until: String,
    val organization_name: String
)