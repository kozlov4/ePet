package com.example.epet.data.repository

import com.example.epet.data.model.passport.InputPetId
import com.example.epet.data.model.passport.OutputPassportDetail
import com.example.epet.data.model.passport.OutputPetItem

class PassportRepository {

    suspend fun passportList(): List<OutputPetItem> {
        return listOf(
            OutputPetItem(
                "TEST1",
                "TEST1",
                "TEST1",
                "TEST1",
                "TEST1",
                "TEST1"
            ),
            OutputPetItem(
                "TEST2",
                "TEST2",
                "TEST2",
                "TEST2",
                "TEST2",
                "TEST2"
            ),
            OutputPetItem(
                "TEST3",
                "TEST3",
                "TEST3",
                "TEST3",
                "TEST3",
                "TEST3"
            )
        )
    }

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