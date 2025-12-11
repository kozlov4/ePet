package com.example.epet.data.repository

import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.network.RetrofitClient

class NotificationsRepository {

    suspend fun getNotifications(token: String?) : List<OutputNotification> {

        if (token == null) {
            return emptyList()
        }

        return try {
            val response = RetrofitClient.api.getNotifications("Bearer $token")

            if (response.isSuccessful) {
                response.body()!!
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

}

