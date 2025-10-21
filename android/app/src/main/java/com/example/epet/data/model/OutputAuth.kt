package com.example.epet.data.model

sealed class OutputAuth {
    data class Success(
        val access_token: String,
        val token_type: String,
        val user_name: String) : OutputAuth()

    data class Error(
        val detail: String) : OutputAuth()
}
