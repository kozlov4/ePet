package com.example.epet.ui.services.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R

class ExtractPetFragment : Fragment() {

    private lateinit var iv_to_back: ImageView
    private lateinit var bth_create_extract: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_extract_pet, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        bth_create_extract = view.findViewById(R.id.bth_create_extract)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        bth_create_extract.setOnClickListener {
            val action = ExtractPetFragmentDirections.actionExtractPetToMessage(
                tittletext = "Витяг про улюбленця",
                emoji = "✅",
                main = "Витяг сформовано!",
                description = "Документ про пухнастого буде надіслано вам найближчим часом на email"
            )

            findNavController().navigate(action)
        }
    }
}