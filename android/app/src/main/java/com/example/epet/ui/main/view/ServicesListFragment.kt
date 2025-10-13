package com.example.epet.ui.main.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R

class ServicesListFragment : Fragment() {

    private lateinit var card_to_shelter: CardView
    private lateinit var card_to_documents: CardView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_services_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        card_to_shelter = view.findViewById(R.id.card_to_shelter)
        card_to_documents = view.findViewById(R.id.card_to_documents)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        card_to_shelter.setOnClickListener {
            findNavController().navigate(R.id.action_list_to_shelter)
        }

        card_to_documents.setOnClickListener {
            findNavController().navigate(R.id.action_list_to_documents)
        }
    }
}