package com.example.epet.ui.main.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.passport.OutputPassportDetail
import com.example.epet.data.model.passport.OutputPetItem
import com.example.epet.data.model.passport.OutputVaccinationsList
import com.example.epet.data.repository.PassportRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PassportViewModel() : ViewModel() {

    val repository = PassportRepository()

    private val _outputPassportList = MutableStateFlow<List<OutputPetItem>>(emptyList())
    val outputPassportList = _outputPassportList.asStateFlow()

    private val _outputPassportDetail = MutableStateFlow(OutputPassportDetail())
    val outputPassportDetail = _outputPassportDetail.asStateFlow()

    private val _outputVaccinationList = MutableStateFlow(OutputVaccinationsList())
    val outputVaccinationList = _outputVaccinationList.asStateFlow()

    fun passportList(token: String?) {
        viewModelScope.launch {
            val output = repository.passportList(token)
            _outputPassportList.value = output
        }
    }

    fun passportDetail(token: String?, pet_id: String?) {
        viewModelScope.launch {
            val input = pet_id
            val output = repository.passportDetail(token, input)
            _outputPassportDetail.value = output
        }
    }

    fun vaccinationList(token: String?, pet_id: String?) {
        viewModelScope.launch {
            val input = pet_id
            val output = repository.vaccinationsList(token, input)
            _outputVaccinationList.value = output
        }
    }
}