package com.example.epet.data.repository

import com.example.epet.data.model.service.InputExtractPet
import com.example.epet.data.model.service.InputRequestShelter
import com.example.epet.data.model.service.OutputExtractPet
import com.example.epet.data.model.service.OutputRequestShelter
import com.example.epet.data.model.service.OutputShelterPet
import com.example.epet.data.network.RetrofitClient
import com.example.epet.data.network.RetrofitClient.gson

class ServiceRepository {

    suspend fun generateReport(token: String?, inputExtractPet: InputExtractPet): OutputExtractPet {

        return try {
            val response = RetrofitClient.api.generateReport("Bearer $token", inputExtractPet)
            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()
                val errorObj = gson.fromJson(errorJson, OutputExtractPet::class.java)
                errorObj ?: OutputExtractPet("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputExtractPet("Помилка мережі, спробуйте ще раз")
        }
    }

    suspend fun getShelterPetsList(token: String?): List<OutputShelterPet> {

        if (token == null) {
            return emptyList()
        }

        return try {
            val response = RetrofitClient.api.getShelterPetsList("Bearer $token")
            if (response.isSuccessful) {
                response.body()!!
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun requestShelter(token: String?, inputRequestShelter: InputRequestShelter): OutputRequestShelter {

        return try {
            val response = RetrofitClient.api.requestShelter("Bearer $token", inputRequestShelter)

            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()

                val errorObj = gson.fromJson(errorJson, OutputRequestShelter.Error::class.java)
                errorObj ?: OutputRequestShelter.Error("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputRequestShelter.Error(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }
}