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

    private val repository = PassportRepository()

    private val _outputPassportsList = MutableStateFlow<List<OutputPetItem>>(emptyList())
    val outputPassportsList = _outputPassportsList.asStateFlow()

    private val _outputPassportDetail = MutableStateFlow(OutputPassportDetail())
    val outputPassportDetail = _outputPassportDetail.asStateFlow()

    private val _outputVaccinationsList = MutableStateFlow(OutputVaccinationsList())
    val outputVaccinationsList = _outputVaccinationsList.asStateFlow()

    fun getPassportsList(token: String?) {
        viewModelScope.launch {
            val output = repository.getPassportsList(token)
            _outputPassportsList.value = output
        }
    }

    fun getPassportDetail(token: String?, pet_id: String?) {
        viewModelScope.launch {
            val input = pet_id
            val output = repository.getPassportDetail(token, input)
            _outputPassportDetail.value = output
        }
    }

    fun getVaccinationsList(token: String?, pet_id: String?) {
        viewModelScope.launch {
            val input = pet_id
            val output = repository.getVaccinationsList(token, input)
            _outputVaccinationsList.value = output
        }
    }
}