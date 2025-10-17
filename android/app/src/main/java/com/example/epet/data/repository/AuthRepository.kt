package com.example.epet.data.repository

import com.example.epet.data.model.InputLogin
import com.example.epet.data.model.InputRegistration
import com.example.epet.data.model.OutputAuth
import com.example.epet.data.network.RetrofitClient
import com.example.epet.data.helper.ValidationHelper
import com.google.gson.GsonBuilder

class AuthRepository {

    suspend fun login(inputLogin: InputLogin): OutputAuth {
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(inputLogin.email).matches()) {
            return OutputAuth.Error("Некоректний формат email")
        }

        if (inputLogin.password.length < 6) {
            return OutputAuth.Error("Невірний пароль")
        }

        return OutputAuth.Success(
            access_token = "test_token",
            token_type = "test_token_type",
            user_name = "Захар",
        )
    }

    suspend fun registration(inputRegistration: InputRegistration, address: String): OutputAuth {
        val (city, street, house_number) = ValidationHelper.parse_address(address)

        val inputRegistrationUpdate = inputRegistration.copy(
            city = city,
            street = street,
            house_number = house_number
        )

        ValidationHelper.validate_registration(inputRegistrationUpdate)?.let {
            return OutputAuth.Error(it)
        }

        return try {
            val response = RetrofitClient.api.registration(inputRegistrationUpdate)

            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()
                val errorObj = GsonBuilder().create().fromJson(errorJson, OutputAuth.Error::class.java)
                errorObj ?: OutputAuth.Error("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputAuth.Error(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }

    suspend fun reset_password(inputEmail: String): String {
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(inputEmail).matches()) {
            return "Некоректний формат email"
        }

        return "Інструкція на відновлення паролю буде надіслана найближчим часом на email"
    }

}
