package com.example.epet.data.repository

import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.network.RetrofitClient

class NotificationRepository {

    suspend fun getNotificationsList(token: String?) : List<OutputNotification> {

        if (token == null) {
            return emptyList()
        }

        return try {
            val response = RetrofitClient.api.getNotificationsList("Bearer $token")

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

