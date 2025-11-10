package com.example.epet.ui.main.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.passport.InputPetId
import com.example.epet.data.model.passport.OutputPassportDetail
import com.example.epet.data.model.passport.OutputPetItem
import com.example.epet.data.model.passport.OutputVaccinationsList
import com.example.epet.data.repository.PassportRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PassportViewModel(private val repository: PassportRepository) : ViewModel() {

    private val _outputPassportList = MutableStateFlow<List<OutputPetItem>>(emptyList())
    val outputPassportList = _outputPassportList.asStateFlow()

    private val _outputPassportDetail = MutableStateFlow(OutputPassportDetail())
    val outputPassportDetail = _outputPassportDetail.asStateFlow()

    private val _outputVaccinationList = MutableStateFlow(OutputVaccinationsList())
    val outputVaccinationList = _outputVaccinationList.asStateFlow()

    fun passportList() {
        viewModelScope.launch {
            val output = repository.passportList()
            _outputPassportList.value = output
        }
    }

    fun passportDetail(inputPetId: InputPetId) {
        viewModelScope.launch {
            val input = inputPetId
            val output = repository.passportDetail(input)
            _outputPassportDetail.value = output
        }
    }

    fun vaccinationList(inputPetId: InputPetId) {
        viewModelScope.launch {
            val input = inputPetId
            val output = repository.vaccinationsList(input)
            _outputVaccinationList.value = output
        }
    }
}