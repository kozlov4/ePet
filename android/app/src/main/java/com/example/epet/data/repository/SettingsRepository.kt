package com.example.epet.data.repository

import com.example.epet.data.helper.ValidationHelper
import com.example.epet.data.model.settings.InputUpdateProfile
import com.example.epet.data.model.settings.OutputUpdateProfile
import com.example.epet.data.model.settings.OutputUserDetail
import com.example.epet.data.network.RetrofitClient
import com.example.epet.data.network.RetrofitClient.gson

class SettingsRepository {

    suspend fun getUserDetail(token: String?) : OutputUserDetail {

        return try {
            val response = RetrofitClient.api.getUserDetail("Bearer $token")
            if (response.isSuccessful) {
                response.body() ?: OutputUserDetail()
            } else {
                OutputUserDetail()
            }
        } catch (e: Exception) {
            OutputUserDetail()
        }
    }

    suspend fun updateProfile(token: String?, inputUpdateProfile: InputUpdateProfile) : OutputUpdateProfile {
        ValidationHelper.validateUpdateProfile(inputUpdateProfile)?.let {
            return OutputUpdateProfile.Error(it)
        }

        return try {
            val response = RetrofitClient.api.updateProfile("Bearer $token", inputUpdateProfile)

            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()
                val errorObj = gson.fromJson(errorJson, OutputUpdateProfile.Error::class.java)
                errorObj ?: OutputUpdateProfile.Error("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputUpdateProfile.Error(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }
}