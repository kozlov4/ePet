package com.example.epet.data.model.settings

sealed class OutputUpdateProfile {
    data class Success(
        val message: String,
        val access_token: String,
        val token_type: String ) : OutputUpdateProfile()

    data class Error(
        val detail: String) : OutputUpdateProfile()
}