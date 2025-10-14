package com.example.epet.data.model

sealed class OutputAuth {
    data class Success(
        val token: String,
        val name: String) : OutputAuth()

    data class Error(
        val message: String) : OutputAuth()
}
