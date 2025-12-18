package com.example.epet.ui.service.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.service.InputExtractPet
import com.example.epet.data.model.service.InputRequestShelter
import com.example.epet.data.model.service.OutputExtractPet
import com.example.epet.data.model.service.OutputRequestShelter
import com.example.epet.data.model.service.OutputShelterPet
import com.example.epet.data.repository.ServiceRepository
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ServiceViewModel : ViewModel() {

    private val repository = ServiceRepository()

    private val _outputGenerateReport = MutableSharedFlow<OutputExtractPet>()
    val outputGenerateReport = _outputGenerateReport.asSharedFlow()

    private val _outputShelterPetsList = MutableStateFlow<List<OutputShelterPet>>(emptyList())
    val outputShelterPetsList = _outputShelterPetsList.asStateFlow()

    private val _outputRequestShelter = MutableSharedFlow<OutputRequestShelter>()
    val outputRequestShelter = _outputRequestShelter.asSharedFlow()

    fun generateReport(token: String?, inputExtractPet: InputExtractPet) {
        viewModelScope.launch {
            val output = repository.generateReport(token, inputExtractPet)
            _outputGenerateReport.emit(output)
        }
    }

    fun getShelterPetsList(token: String?) {
        viewModelScope.launch {
            val output = repository.getShelterPetsList(token)
            _outputShelterPetsList.value = output
        }
    }

    fun requestShelter(token: String?, inputRequestShelter: InputRequestShelter) {
        viewModelScope.launch {
            val input = inputRequestShelter
            val output = repository.requestShelter(token, input)

            _outputRequestShelter.emit(output)
        }
    }
}