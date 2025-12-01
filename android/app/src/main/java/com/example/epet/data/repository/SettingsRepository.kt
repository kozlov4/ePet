package com.example.epet.data.repository

import com.example.epet.data.model.settings.OutputUserDetail
import com.example.epet.data.network.RetrofitClient

class SettingsRepository {

    suspend fun userDetail(token: String?) : OutputUserDetail {

        return try {
            val response = RetrofitClient.api.userRetail("Bearer $token")
            if (response.isSuccessful) {
                response.body() ?: OutputUserDetail()
            } else {
                OutputUserDetail()
            }
        } catch (e: Exception) {
            OutputUserDetail()
        }
    }
}