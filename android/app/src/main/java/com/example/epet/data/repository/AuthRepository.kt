package com.example.epet.data.repository

import com.example.epet.data.helper.FunctionHelper
import com.example.epet.data.model.auth.InputLogin
import com.example.epet.data.model.auth.InputRegistration
import com.example.epet.data.model.auth.OutputAuth
import com.example.epet.data.network.RetrofitClient
import com.example.epet.data.helper.ValidationHelper
import com.example.epet.data.model.auth.InputResetPassword
import com.example.epet.data.model.auth.OutputResetPassword
import com.google.gson.GsonBuilder
import com.example.epet.data.network.RetrofitClient.gson

class AuthRepository {

    suspend fun login(inputLogin: InputLogin): OutputAuth {
        ValidationHelper.validateLogin(inputLogin)?.let {
            return OutputAuth.Error(it)
        }

        return try {
            val response = RetrofitClient.api.login(
                username = inputLogin.username,
                password = inputLogin.password
            )

            if (response.isSuccessful && response.body()!!.organization_type == null) {
                response.body()!!

            } else if (response.isSuccessful && response.body()!!.organization_type != null) {
                OutputAuth.Error("Користувача не знайдено")

            } else {
                val errorJson = response.errorBody()?.string()

                val errorObj = gson.fromJson(errorJson, OutputAuth.Error::class.java)
                errorObj ?: OutputAuth.Error("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputAuth.Error(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }

    suspend fun registration(inputRegistration: InputRegistration, address: String): OutputAuth {
        val (city, street, house_number) = FunctionHelper.parseAddress(address)

        val inputRegistrationUpdate = inputRegistration.copy(
            city = city,
            street = street,
            house_number = house_number
        )

        ValidationHelper.validateRegistration(inputRegistrationUpdate)?.let {
            return OutputAuth.Error(it)
        }

        return try {
            val response = RetrofitClient.api.registration(inputRegistrationUpdate)

            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()
                val errorObj = gson.fromJson(errorJson, OutputAuth.Error::class.java)
                errorObj ?: OutputAuth.Error("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputAuth.Error(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }

    suspend fun resetPassword(inputResetPassword: InputResetPassword): OutputResetPassword {
        ValidationHelper.validateResetPassword(inputResetPassword)?.let {
            return OutputResetPassword(it)
        }

        return try {
            val response = RetrofitClient.api.resetPassword(inputResetPassword)

            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()
                val errorObj = gson.fromJson(errorJson, OutputResetPassword::class.java)
                errorObj ?: OutputResetPassword("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputResetPassword(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }
}
