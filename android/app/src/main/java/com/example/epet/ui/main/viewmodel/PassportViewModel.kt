package com.example.epet.ui.main.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.passport.InputPetId
import com.example.epet.data.model.passport.OutputPassportDetail
import com.example.epet.data.repository.PassportRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PassportViewModel(private val repository: PassportRepository) : ViewModel() {

    private val _passportDetail = MutableStateFlow(OutputPassportDetail())
    val passportDetail = _passportDetail.asStateFlow()

    fun getPassportDetail(inputPetId: InputPetId) {
        viewModelScope.launch {
            val input = inputPetId
            val output = repository.passportDetail(input)
            _passportDetail.value = output
        }
    }
}