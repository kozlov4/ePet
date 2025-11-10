package com.example.epet.data.repository

import com.example.epet.data.model.passport.InputPetId
import com.example.epet.data.model.passport.OutputPassportDetail

class PassportRepository {

    suspend fun passportDetail(inputPetId: InputPetId) : OutputPassportDetail {
        return OutputPassportDetail(
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST",
            "TEST")
    }
}