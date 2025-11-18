package com.example.epet.data.repository

import com.example.epet.data.model.settings.OutputUserDetail

class SettingsRepository {

    suspend fun userDetail(token: String?) : OutputUserDetail {

        return OutputUserDetail(
            "Корякін",
            "Захар",
            "Павлович",
            "8266101726",
            "Харків, Вадима Манька 50",
            "61070",
            "zaharywy@gmail.com",
            "12345678")
    }
}