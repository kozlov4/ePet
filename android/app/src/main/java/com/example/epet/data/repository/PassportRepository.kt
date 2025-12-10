package com.example.epet.data.repository

import com.example.epet.data.model.passport.OutputPassportDetail
import com.example.epet.data.model.passport.OutputPetItem
import com.example.epet.data.model.passport.OutputVaccinationsList
import kotlin.collections.emptyList
import com.example.epet.data.network.RetrofitClient

class PassportRepository {

    suspend fun passportList(token: String?): List<OutputPetItem> {

        if (token == null) {
            return emptyList()
        }

        return try {
            val response = RetrofitClient.api.passportList("Bearer $token")
            if (response.isSuccessful) {
                response.body() ?: emptyList()
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun passportDetail(token: String?, pet_id: String?) : OutputPassportDetail {

        if (token == null || pet_id == null) {
            return OutputPassportDetail()
        }

        return try {
            val response = RetrofitClient.api.passportDetail("Bearer $token", pet_id)
            if (response.isSuccessful) {
                response.body() ?: OutputPassportDetail()
            } else {
                OutputPassportDetail()
            }
        } catch (e: Exception) {
            OutputPassportDetail()
        }
    }

    suspend fun vaccinationsList(token: String?, pet_id: String?): OutputVaccinationsList {

        if (token == null || pet_id == null) {
            return OutputVaccinationsList()
        }

        return try {
            val response = RetrofitClient.api.vaccinationsList( "Bearer $token", pet_id)
            if (response.isSuccessful) {
                response.body() ?: OutputVaccinationsList()
            } else {
                OutputVaccinationsList()
            }
        } catch (e: Exception) {
            OutputVaccinationsList()
        }
    }
}