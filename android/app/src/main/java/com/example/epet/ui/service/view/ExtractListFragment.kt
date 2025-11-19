package com.example.epet.ui.services.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R

class ExtractListFragment : Fragment() {

    private lateinit var iv_to_back: ImageView

    private lateinit var cc_to_extract_pet_register: ConstraintLayout
    private lateinit var cc_to_extract_pet_passport: ConstraintLayout
    private lateinit var cc_to_extract_pet_vaccinations: ConstraintLayout
    private lateinit var cc_to_extract_pet_identifier: ConstraintLayout

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_extract_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        cc_to_extract_pet_register = view.findViewById(R.id.cc_to_extract_pet_register)
        cc_to_extract_pet_passport = view.findViewById(R.id.cc_to_extract_pet_passport)
        cc_to_extract_pet_vaccinations = view.findViewById(R.id.cc_to_extract_pet_vaccinations)
        cc_to_extract_pet_identifier = view.findViewById(R.id.cc_to_extract_pet_identifier)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        cc_to_extract_pet_register.setOnClickListener {
            val action = ExtractListFragmentDirections.actionExtractListToExtractPet("Витяг з реєстру домашніх тварин")
            findNavController().navigate(action)
        }

        cc_to_extract_pet_passport.setOnClickListener {
            val action = ExtractListFragmentDirections.actionExtractListToExtractPet("Витяг за паспортом тварини")
            findNavController().navigate(action)
        }

        cc_to_extract_pet_vaccinations.setOnClickListener {
            val action = ExtractListFragmentDirections.actionExtractListToExtractPet("Витяг про щеплення тварини")
            findNavController().navigate(action)
        }

        cc_to_extract_pet_identifier.setOnClickListener {
            val action = ExtractListFragmentDirections.actionExtractListToExtractPet("Витяг за ідентифікаторами")
            findNavController().navigate(action)
        }
    }
}