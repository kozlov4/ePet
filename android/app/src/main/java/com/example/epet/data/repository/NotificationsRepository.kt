package com.example.epet.data.repository

import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.network.RetrofitClient
import android.util.Log

class NotificationsRepository {

    suspend fun getNotifications(token: String?) : List<OutputNotification> {

        if (token == null) {
            return emptyList()
        }

        return try {
            val response = RetrofitClient.api.getNotifications("Bearer $token")

            if (response.isSuccessful) {
                Log.d("notifications1", response.body().toString())
                response.body()!!
            } else {
                Log.d("notifications1", "1")
                emptyList()
            }
        } catch (e: Exception) {
            Log.d("notifications1", e.toString())
            emptyList()
        }
    }

}

