package com.example.epet.data.model.service;

sealed class OutputRequestShelter {
    data class Success(
        val request_id: Int,
        val shelter_name: String,
        val message: String) : OutputRequestShelter()

    data class Error(
        val detail: String) : OutputRequestShelter()
}
